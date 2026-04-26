import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRACKED_FIELDS: Record<string, string> = {
  status:      'Trạng thái',
  agreedPrice: 'Giá đàm phán',
  note:        'Ghi chú',
};

export async function POST(req: Request) {
  try {
    const { id, agreedPrice, note, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

    // Fetch current state for diff comparison
    const current = await prisma.lineItem.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    const updates: Record<string, any> = {};
    if (agreedPrice !== undefined) updates.agreedPrice = agreedPrice;
    if (note !== undefined) updates.note = note;
    if (status !== undefined) updates.status = status;

    // Write update
    const updated = await prisma.lineItem.update({ where: { id }, data: updates });

    // Write event log for each changed field
    const eventWrites = Object.entries(updates)
      .filter(([field, newVal]) => {
        const oldVal = (current as any)[field];
        return String(oldVal ?? '') !== String(newVal ?? '');
      })
      .map(([field, newVal]) =>
        prisma.itemEvent.create({
          data: {
            itemId:   id,
            field:    TRACKED_FIELDS[field] ?? field,
            oldValue: String((current as any)[field] ?? ''),
            newValue: String(newVal ?? ''),
          },
        })
      );

    if (eventWrites.length > 0) await Promise.all(eventWrites);

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
