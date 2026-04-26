/**
 * Price DB lookup — queries PriceContribution table using fuzzy keyword matching.
 * Falls back to static seed table if DB returns insufficient samples.
 */
import { PrismaClient } from '@prisma/client';
import { normalize, tokenize } from './normalizer';
import { fuzzyScore } from './fuzzy-matcher';
import { lookupStaticPrice } from './static-prices';

const prisma = new PrismaClient();

export interface PriceLookupResult {
  priceLow:    number;
  priceMedian: number;
  priceHigh:   number;
  confidence:  'high' | 'medium' | 'low';
  source:      string;
  matchScore:  number;
  sampleCount: number;
  matchStrategy: 'db_exact' | 'db_fuzzy' | 'static_seed' | 'no_match';
  flagReview:  boolean;
}

/** Normalize item name to lookup keyword (first 3 words, diacritics stripped) */
function toKeyword(name: string): string {
  return tokenize(name).slice(0, 3).join(' ');
}

export async function lookupPrice(
  itemName: string,
  category?: string
): Promise<PriceLookupResult | null> {

  const keyword = toKeyword(itemName);

  // 1. Pull all contributions from the same year and optionally same category
  const contributions = await prisma.priceContribution.findMany({
    where: {
      year: new Date().getFullYear(),
      ...(category ? { category: { contains: category, mode: 'insensitive' } } : {}),
    },
    select: {
      itemKeyword: true,
      confirmedPrice: true,
      unit: true,
    },
  });

  if (contributions.length === 0) {
    return staticFallback(itemName);
  }

  // 2. Score all DB entries against our query
  const scored = contributions
    .map(c => ({
      ...c,
      score: fuzzyScore(itemName, c.itemKeyword).score,
    }))
    .filter(c => c.score >= 0.45)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return staticFallback(itemName);
  }

  // 3. Take top-N matches and aggregate
  const topN = scored.slice(0, 10);
  const prices = topN.map(c => c.confirmedPrice).sort((a, b) => a - b);
  const avgScore = topN.reduce((s, c) => s + c.score, 0) / topN.length;

  const priceLow    = prices[0];
  const priceMedian = prices[Math.floor(prices.length / 2)];
  const priceHigh   = prices[prices.length - 1];
  const confidence: 'high' | 'medium' | 'low' =
    avgScore >= 0.80 && topN.length >= 5 ? 'high' :
    avgScore >= 0.55 && topN.length >= 2 ? 'medium' : 'low';

  return {
    priceLow,
    priceMedian,
    priceHigh,
    confidence,
    source: `Cộng đồng (${topN.length} mẫu)`,
    matchScore: avgScore,
    sampleCount: topN.length,
    matchStrategy: avgScore >= 0.80 ? 'db_exact' : 'db_fuzzy',
    flagReview: avgScore < 0.55 || topN.length < 3,
  };
}

function staticFallback(itemName: string): PriceLookupResult | null {
  const seed = lookupStaticPrice(itemName);
  if (!seed) return null;

  return {
    priceLow:    seed.low,
    priceMedian: seed.median,
    priceHigh:   seed.high,
    confidence:  'low',
    source:      'Bảng giá tham chiếu 2026',
    matchScore:  0.50,
    sampleCount: 0,
    matchStrategy: 'static_seed',
    flagReview:  true,
  };
}
