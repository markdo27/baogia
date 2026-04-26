import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { FileText, ArrowRight, UploadCloud } from 'lucide-react';

const prisma = new PrismaClient();

export default async function DashboardHome() {
  const projects = await prisma.project.findMany({
    include: {
      quotations: {
        include: {
          _count: {
            select: { items: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Tổng quan Báo giá</h1>
          <p className="text-sm text-[var(--text3)] mt-1">Quản lý các báo giá bạn đã tải lên hệ thống.</p>
        </div>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-white font-semibold text-[13px] rounded-md hover:bg-[#4F46E5] transition-colors"
        >
          <UploadCloud size={16} />
          Tải lên mới
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <p className="text-[var(--text3)] mb-4">Chưa có dự án nào.</p>
          <Link href="/" className="px-4 py-2 border border-[var(--border)] rounded-md text-[13px] hover:border-[var(--acc)] text-[var(--text2)] transition-colors">
            Tải file đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--acc-ring)] transition-colors group">
              <h3 className="font-bold text-base text-[var(--text)] mb-3">{project.name}</h3>
              <div className="flex flex-col gap-2">
                {project.quotations.map(q => (
                  <Link 
                    href={`/dashboard/quotations/${q.id}`} 
                    key={q.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface2)] hover:bg-[var(--acc-light)] hover:text-[var(--acc)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[var(--text4)] group-hover:text-[var(--acc)] transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium">{q.name}</span>
                        <span className="text-[11px] text-[var(--text3)]">{q._count.items} hạng mục</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--acc)]" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
