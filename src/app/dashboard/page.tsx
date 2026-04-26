import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { FileText, ArrowRight, UploadCloud, CheckCircle, Zap } from 'lucide-react';

const prisma = new PrismaClient();

export default async function DashboardHome() {
  const projects = await prisma.project.findMany({
    include: {
      quotations: {
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--text)]">Tổng quan báo giá</h1>
          <p className="text-[13px] text-[var(--text3)] mt-0.5">Quản lý các báo giá bạn đã tải lên hệ thống.</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-white font-semibold text-[13px] rounded-md hover:opacity-90 transition-opacity"
        >
          <UploadCloud size={15} />
          Tải lên mới
        </Link>
      </div>

      {projects.length === 0 ? (
        /* Rich empty state */
        <div className="flex flex-col items-center justify-center py-16 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface2)] flex items-center justify-center mb-5 text-[var(--text3)]">
            <FileText size={26} strokeWidth={1.5} />
          </div>
          <h2 className="text-[16px] font-bold text-[var(--text)] mb-1.5">Chưa có báo giá nào</h2>
          <p className="text-[13px] text-[var(--text3)] mb-8 max-w-sm leading-relaxed">
            Tải lên file PDF hoặc Excel đầu tiên của bạn — AI sẽ tự động đọc và so sánh giá thị trường.
          </p>

          {/* 3-step visual */}
          <div className="flex items-start gap-8 mb-8 text-left">
            {[
              { icon: UploadCloud, label: 'Tải lên file', desc: 'PDF, Excel, CSV' },
              { icon: Zap, label: 'AI trích xuất', desc: 'Tự động, không nhập tay' },
              { icon: CheckCircle, label: 'So sánh & chốt giá', desc: 'Tiết kiệm tối đa' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-28 text-center">
                <div className="w-9 h-9 rounded-xl bg-[var(--acc-light)] text-[var(--acc)] flex items-center justify-center">
                  <s.icon size={16} strokeWidth={1.5} />
                </div>
                <p className="text-[12.5px] font-semibold text-[var(--text)]">{s.label}</p>
                <p className="text-[11px] text-[var(--text3)]">{s.desc}</p>
                {i < 2 && <div className="absolute translate-x-[72px] translate-y-[-20px] text-[var(--text4)] text-lg hidden" />}
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="px-5 py-2.5 bg-[var(--acc)] text-white font-semibold text-[13px] rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <UploadCloud size={15} />
            Tải file đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 card-hover">
              <h3 className="font-bold text-[13.5px] text-[var(--text)] mb-3">{project.name}</h3>
              <div className="flex flex-col gap-1.5">
                {project.quotations.map(q => (
                  <Link
                    href={`/dashboard/quotations/${q.id}`}
                    key={q.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface2)] hover:bg-[var(--acc-light)] hover:text-[var(--acc)] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={15} className="text-[var(--text3)] group-hover:text-[var(--acc)] transition-colors shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-[var(--text)] group-hover:text-[var(--acc)]">{q.name}</p>
                        <p className="text-[11px] text-[var(--text3)]">{q._count.items} hạng mục</p>
                      </div>
                    </div>
                    {/* Arrow always visible at 40% opacity — not hidden */}
                    <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--acc)]" />
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
