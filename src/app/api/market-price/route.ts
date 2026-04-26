import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { itemId, name, brand, unit } = await req.json();
    if (!itemId || !name) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    const prompt = `You are a senior procurement specialist in Vietnam with deep knowledge of construction and interior material pricing.

Estimate the CURRENT market price range for this item in Vietnam (prices in VND):
- Name: ${name}
- Brand: ${brand || 'Any / Generic'}
- Unit: ${unit}

Return ONLY a valid JSON object:
{
  "priceLow": Number (lower bound, e.g. budget/generic brand),
  "priceMedian": Number (typical mid-market price),
  "priceHigh": Number (premium/branded price),
  "confidence": "high" | "medium" | "low",
  "source": "Shopee" | "Lazada" | "Thiết bị điện" | "Vật liệu xây dựng" | "AI estimate",
  "evaluation": "high" | "mid" | "ok",
  "marketUrl": "String (a relevant Google or Shopee search URL)"
}

Rules:
- confidence = "high" if this is a common, widely-sold item with clear pricing
- confidence = "medium" if pricing varies significantly by brand/region
- confidence = "low" if this is specialized, rare, or pricing is unclear
- ONLY return valid JSON, no markdown.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const aiContent = response.choices[0]?.message?.content || '{}';
    const cleaned = aiContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error('AI returned invalid JSON: ' + cleaned);
    }

    const updatedItem = await prisma.lineItem.update({
      where: { id: itemId },
      data: {
        marketPrice:     parsed.priceMedian,
        priceRangeLow:   parsed.priceLow,
        priceRangeHigh:  parsed.priceHigh,
        priceConfidence: parsed.confidence,
        priceSource:     parsed.source,
        priceFetchedAt:  new Date(),
        marketUrl:       parsed.marketUrl,
        evaluation:      parsed.evaluation,
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });

  } catch (error: any) {
    console.error('Market price error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch market price' }, { status: 500 });
  }
}
