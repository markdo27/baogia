import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { withCircuitBreaker, validateAIMarketPriceOutput, type PipelineMode } from '@/lib/fallback/circuit-breaker';
import { lookupPrice } from '@/lib/fallback/price-db-lookup';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { itemId, name, brand, unit, category, forceMode } = await req.json();
    const mode: PipelineMode = forceMode ?? 'auto';
    if (!itemId || !name) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    // ── AI pipeline (primary) ──────────────────────────────────────────────
    const aiTask = async () => {
      const prompt = `You are a senior procurement specialist in Vietnam with deep knowledge of construction and interior material pricing.

Estimate the CURRENT market price range for this item in Vietnam (prices in VND):
- Name: ${name}
- Brand: ${brand || 'Any / Generic'}
- Unit: ${unit}

Return ONLY a valid JSON object:
{
  "priceLow": Number,
  "priceMedian": Number,
  "priceHigh": Number,
  "confidence": "high" | "medium" | "low",
  "source": "Shopee" | "Lazada" | "Vật liệu xây dựng" | "AI estimate",
  "evaluation": "high" | "mid" | "ok",
  "marketUrl": "String"
}
ONLY return valid JSON, no markdown.`;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const raw     = response.choices[0]?.message?.content || '{}';
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed  = JSON.parse(cleaned);
      return validateAIMarketPriceOutput(parsed);  // throws if invalid
    };

    // ── Fallback pipeline (deterministic) ─────────────────────────────────
    const fallbackTask = async () => {
      const result = await lookupPrice(name, category);
      if (!result) throw new Error(`No price data available for: ${name}`);

      return {
        priceLow:    result.priceLow,
        priceMedian: result.priceMedian,
        priceHigh:   result.priceHigh,
        confidence:  result.confidence,
        source:      result.source,
        evaluation:  'mid' as const,
        marketUrl:   `https://shopee.vn/search?keyword=${encodeURIComponent(name)}`,
        _fallbackMeta: {
          matchStrategy: result.matchStrategy,
          matchScore:    result.matchScore,
          sampleCount:   result.sampleCount,
          flagReview:    result.flagReview,
        },
      };
    };

    // ── Circuit breaker ────────────────────────────────────────────────────
    const { data, pipeline, durationMs, fallbackReason } = await withCircuitBreaker(
      'marketPrice',
      aiTask,
      fallbackTask,
      mode,
    );

    console.log(`[market-price] pipeline=${pipeline} duration=${durationMs}ms item="${name}"`);

    // Save to DB — identical shape for both pipelines
    const updatedItem = await prisma.lineItem.update({
      where: { id: itemId },
      data: {
        marketPrice:     data.priceMedian,
        priceRangeLow:   data.priceLow,
        priceRangeHigh:  data.priceHigh,
        priceConfidence: data.confidence,
        priceSource:     pipeline === 'fallback'
          ? `${data.source} ★`           // ★ suffix flags fallback-sourced data in the UI
          : data.source,
        priceFetchedAt:  new Date(),
        marketUrl:       data.marketUrl,
        evaluation:      data.evaluation,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
      _meta: {
        pipeline,
        durationMs,
        fallbackReason: fallbackReason ?? null,
        ...(pipeline === 'fallback' && (data as any)._fallbackMeta
          ? { fallbackDetail: (data as any)._fallbackMeta }
          : {}),
      },
    });

  } catch (error: any) {
    console.error('[market-price] Critical failure in both pipelines:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch market price' }, { status: 500 });
  }
}
