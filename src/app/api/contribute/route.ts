import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Normalize item name to anonymous keyword (first 3 meaningful words, lowercased, no diacritics)
function normalizeKeyword(name: string): string {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ');
}

export async function POST(req: Request) {
  try {
    const { itemId } = await req.json();
    if (!itemId) return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });

    const item = await prisma.lineItem.findUnique({
      where: { id: itemId },
      select: { category: true, name: true, unit: true, agreedPrice: true, unitPrice: true, status: true },
    });

    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    if (item.status !== 'agreed') return NextResponse.json({ error: 'Can only contribute agreed prices' }, { status: 400 });

    const confirmedPrice = item.agreedPrice ?? item.unitPrice;
    if (!confirmedPrice || confirmedPrice <= 0) return NextResponse.json({ error: 'No valid price to contribute' }, { status: 400 });

    const now = new Date();
    await prisma.priceContribution.create({
      data: {
        category:      item.category,
        itemKeyword:   normalizeKeyword(item.name),
        unit:          item.unit,
        confirmedPrice,
        month:         now.getMonth() + 1,
        year:          now.getFullYear(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return aggregated price index grouped by category + keyword
    const contributions = await prisma.priceContribution.groupBy({
      by: ['category', 'itemKeyword', 'unit'],
      _avg: { confirmedPrice: true },
      _min: { confirmedPrice: true },
      _max: { confirmedPrice: true },
      _count: { confirmedPrice: true },
      orderBy: { _count: { confirmedPrice: 'desc' } },
      having: { confirmedPrice: { _count: { gte: 1 } } },
    });

    return NextResponse.json({ data: contributions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
