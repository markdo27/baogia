import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Keep this fast — it's polled every 30s from the UI
export const maxDuration = 10;

export async function GET() {
  // Instantiate inside the handler so the SDK never runs at build/module-eval time
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const start = Date.now();
  try {
    // Minimal ping: 1-token completion to verify connectivity + key validity
    await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
      temperature: 0,
    });

    return NextResponse.json({
      status: 'ok',
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    const msg: string = err?.message ?? String(err);
    const isTimeout = msg.includes('timeout') || msg.includes('ETIMEDOUT');
    const isAuth    = err?.status === 401 || msg.includes('API key') || msg.includes('Incorrect API');
    const isRate    = err?.status === 429 || msg.includes('rate limit');

    return NextResponse.json({
      status: isAuth ? 'auth_error' : isRate ? 'rate_limited' : isTimeout ? 'timeout' : 'error',
      latencyMs: Date.now() - start,
      error: msg,
    }, { status: 200 }); // Always 200 so the client can read the body
  }
}
