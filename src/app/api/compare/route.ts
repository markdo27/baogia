import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q1Id = searchParams.get('q1');
    const q2Id = searchParams.get('q2');

    if (!q1Id || !q2Id) return NextResponse.json({ error: 'Missing q1 or q2 parameter' }, { status: 400 });
    if (q1Id === q2Id) return NextResponse.json({ error: 'Please select two different quotations' }, { status: 400 });

    const [q1, q2] = await Promise.all([
      prisma.quotation.findUnique({ where: { id: q1Id }, include: { items: { orderBy: { itemNo: 'asc' } } } }),
      prisma.quotation.findUnique({ where: { id: q2Id }, include: { items: { orderBy: { itemNo: 'asc' } } } }),
    ]);

    if (!q1 || !q2) return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });

    // Fuzzy item matching: normalize and match by keywords
    const normalize = (s: string) =>
      s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/[^a-z0-9\s]/g, '')
        .trim();

    const matched: any[] = [];
    const usedQ2Ids = new Set<string>();

    for (const item1 of q1.items) {
      const n1 = normalize(item1.name);
      const words1 = n1.split(/\s+/).filter(w => w.length > 2);

      // Find best match in Q2: item that shares the most keywords
      let bestMatch: any = null;
      let bestScore = 0;

      for (const item2 of q2.items) {
        if (usedQ2Ids.has(item2.id)) continue;
        const n2 = normalize(item2.name);
        const sharedWords = words1.filter(w => n2.includes(w));
        const score = sharedWords.length / Math.max(words1.length, 1);
        if (score > bestScore && score >= 0.4) {
          bestScore = score;
          bestMatch = item2;
        }
      }

      if (bestMatch) usedQ2Ids.add(bestMatch.id);

      matched.push({
        name: item1.name,
        category: item1.category,
        matchScore: bestMatch ? Math.round(bestScore * 100) : 0,
        q1: item1,
        q2: bestMatch ?? null,
      });
    }

    // Add Q2 items that were never matched
    for (const item2 of q2.items) {
      if (!usedQ2Ids.has(item2.id)) {
        matched.push({
          name: item2.name,
          category: item2.category,
          matchScore: 0,
          q1: null,
          q2: item2,
        });
      }
    }

    return NextResponse.json({ results: matched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
