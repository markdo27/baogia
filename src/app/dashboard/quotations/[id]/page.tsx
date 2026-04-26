import { PrismaClient } from '@prisma/client';
import QuotationDashboard from '@/components/dashboard/QuotationDashboard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Printer } from 'lucide-react';

const prisma = new PrismaClient();

export default async function QuotationPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;

  const quotation = await prisma.quotation.findUnique({
    where: { id: resolvedParams.id },
    include: {
      project: true,
      items: {
        orderBy: { itemNo: 'asc' },
        include: {
          events: {
            orderBy: { createdAt: 'desc' },
            take: 20, // Last 20 events per item
          },
        },
      },
    },
  });

  if (!quotation) notFound();

  return (
    <div className="flex flex-col gap-0">
      {/* Print button at page level — opens dedicated print page in new tab */}
      <div className="flex justify-end mb-1">
        <Link
          href={`/dashboard/quotations/${resolvedParams.id}/print`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-md text-[12px] font-semibold text-[var(--text2)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors"
        >
          <Printer size={13} />
          Xuất báo cáo PDF
        </Link>
      </div>
      <QuotationDashboard quotation={quotation} />
    </div>
  );
}
