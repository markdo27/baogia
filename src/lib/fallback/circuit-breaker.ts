/**
 * Circuit Breaker — per-request graceful degradation.
 *
 * This implementation uses the "Option C" approach described in the architecture doc:
 * per-request timeout-based fallback with no persistent state (serverless-safe).
 *
 * The AI is attempted on EVERY request but with a hard timeout.
 * If the AI times out or returns invalid output → silent fallback to deterministic pipeline.
 *
 * Upgrade path: swap `attemptAI` with a stateful CLOSED/OPEN/HALF-OPEN check
 * backed by a DB row in `public.circuit_breaker_state` (see architecture doc).
 */

export interface PipelineResult<T> {
  data: T;
  pipeline: 'ai' | 'fallback';
  durationMs: number;
  fallbackReason?: string;
}

const AI_TIMEOUT_MS = {
  extract:      55_000,  // 55s (5s buffer before Vercel's 60s limit)
  marketPrice:  12_000,  // 12s
};

/** Wrap a promise with a hard timeout that rejects after `ms` milliseconds */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[CircuitBreaker] Timeout: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);
}

export type PipelineMode = 'auto' | 'ai' | 'fallback';

/**
 * Attempt AI pipeline; if it fails or times out, execute fallback silently.
 * forceMode: 'auto' = normal circuit breaker | 'ai' = prefer AI but fall back with warning | 'fallback' = skip AI entirely
 */
export async function withCircuitBreaker<T>(
  context: keyof typeof AI_TIMEOUT_MS,
  aiTask: () => Promise<T>,
  fallbackTask: () => Promise<T>,
  forceMode: PipelineMode = 'auto',
): Promise<PipelineResult<T>> {
  const start = Date.now();

  // Force fallback: skip AI completely
  if (forceMode === 'fallback') {
    const data = await fallbackTask();
    return { data, pipeline: 'fallback', durationMs: Date.now() - start, fallbackReason: 'User selected Non-AI mode' };
  }

  try {
    const data = await withTimeout(aiTask(), AI_TIMEOUT_MS[context], context);
    return { data, pipeline: 'ai', durationMs: Date.now() - start };
  } catch (err: any) {
    const reason = err?.message ?? 'Unknown AI failure';
    console.warn(`[CircuitBreaker:${context}] AI failed → fallback. Reason: ${reason}`);

    // Even in AI-only mode: fall back gracefully instead of blocking the user.
    // The UI can detect the 'ai-timeout-fallback' reason to show a warning badge.
    try {
      const data = await fallbackTask();
      return {
        data,
        pipeline: 'fallback',
        durationMs: Date.now() - start,
        fallbackReason: forceMode === 'ai' ? `AI timeout — dùng dữ liệu offline: ${reason}` : reason,
      };
    } catch (fallbackErr: any) {
      // Both AI and fallback failed — now we truly have no data
      throw new Error(`Không thể tra giá: AI timeout và fallback cũng thất bại. ${fallbackErr?.message ?? ''}`);
    }
  }
}

/**
 * Validate that AI output is a usable non-empty array of items.
 * Throws if invalid so the circuit breaker can catch it and route to fallback.
 */
export function validateAIExtractionOutput(raw: any): any[] {
  if (!Array.isArray(raw)) throw new Error('AI output is not an array');
  if (raw.length === 0) throw new Error('AI returned empty array');
  const first = raw[0];
  if (!first.name || typeof first.unitPrice !== 'number') {
    throw new Error('AI output is missing required fields (name, unitPrice)');
  }
  return raw;
}

/**
 * Validate AI market price output.
 */
export function validateAIMarketPriceOutput(raw: any): any {
  if (!raw || typeof raw !== 'object') throw new Error('AI price output is not an object');
  if (typeof raw.priceMedian !== 'number' || raw.priceMedian <= 0) {
    throw new Error('AI price output has invalid priceMedian');
  }
  return raw;
}
