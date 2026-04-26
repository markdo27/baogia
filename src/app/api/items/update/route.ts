import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id, agreedPrice, note, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
    }

    const updated = await prisma.lineItem.update({
      where: { id },
      data: {
        ...(agreedPrice !== undefined && { agreedPrice }),
        ...(note !== undefined && { note }),
        ...(status !== undefined && { status })
      }
    });

    return NextResponse.json({ success: true, item: updated });

  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
