import { PrismaClient } from '@prisma/client';
import QuotationDashboard from '@/components/dashboard/QuotationDashboard';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function QuotationPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  
  const quotation = await prisma.quotation.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        orderBy: { itemNo: 'asc' }
      },
      project: true
    }
  });

  if (!quotation) {
    notFound();
  }

  return <QuotationDashboard quotation={quotation} />;
}
