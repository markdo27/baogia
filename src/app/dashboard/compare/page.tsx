import { PrismaClient } from '@prisma/client';
import CompareClient from './CompareClient';

const prisma = new PrismaClient();

export default async function ComparePage() {
  const projects = await prisma.project.findMany({
    include: {
      quotations: {
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const allQuotations = projects.flatMap(p => p.quotations);

  if (allQuotations.length < 2) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20 text-center gap-3">
        <h2 className="text-[18px] font-bold text-[var(--text)]">Cần ít nhất 2 báo giá</h2>
        <p className="text-[13px] text-[var(--text3)] max-w-sm">
          Tải lên ít nhất 2 bảng báo giá (cho cùng hoặc khác dự án) để sử dụng tính năng so sánh.
        </p>
      </div>
    );
  }

  return <CompareClient projects={projects} initialCompare={null} />;
}
