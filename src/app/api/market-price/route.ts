import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

export const maxDuration = 60; // Allow up to 60s

export async function POST(req: Request) {
  try {
    const { itemId, name, brand, unit } = await req.json();

    if (!itemId || !name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prompt = `You are a procurement expert in Vietnam. Estimate the current market price for the following construction/interior item:
Name: ${name}
Brand: ${brand || 'Unknown'}
Unit: ${unit}

Return ONLY a valid JSON object matching this schema:
{
  "marketPrice": Number (the estimated average price in VND, do not include commas or currency symbols),
  "marketUrl": "String (A generic google search URL for this product or a placeholder link)",
  "evaluation": "String ('high' if the quoted price is usually lower, 'mid', or 'ok')"
}

IMPORTANT: Return ONLY valid JSON without markdown formatting.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const aiContent = response.choices[0]?.message?.content || '{}';
    const cleanedJson = aiContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch (e) {
      throw new Error("AI returned invalid JSON: " + cleanedJson);
    }

    // Update the DB
    const updatedItem = await prisma.lineItem.update({
      where: { id: itemId },
      data: {
        marketPrice: parsedData.marketPrice,
        marketUrl: parsedData.marketUrl,
        evaluation: parsedData.evaluation
      }
    });

    return NextResponse.json({ success: true, item: updatedItem });

  } catch (error: any) {
    console.error('Market price error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch market price' }, { status: 500 });
  }
}
