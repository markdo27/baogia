import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quotationName, projectName, items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    // Since this is a simple SaaS structure for now, we will create a Project and a Quotation inside it
    // In a real app, the user might select an existing project.
    
    // Create a new project for this quotation upload
    const project = await prisma.project.create({
      data: {
        name: projectName || 'Dự án mới',
        quotations: {
          create: {
            name: quotationName || 'Báo giá 1',
            items: {
              create: items.map((item: any, index: number) => ({
                category: item.category || 'Khác',
                itemNo: item.itemNo || index + 1,
                name: item.name || 'Hạng mục không tên',
                unit: item.unit || 'cái',
                quantity: Number(item.quantity) || 1,
                unitPrice: Number(item.unitPrice) || 0,
                totalPrice: Number(item.totalPrice) || 0,
                brand: item.brand || null,
                note: item.note || null,
              }))
            }
          }
        }
      },
      include: {
        quotations: true
      }
    });

    const createdQuotationId = project.quotations[0].id;

    return NextResponse.json({ success: true, quotationId: createdQuotationId });

  } catch (error: any) {
    console.error('Save quotation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save quotation' }, { status: 500 });
  }
}
