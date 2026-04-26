import { PrismaClient } from '@prisma/client';
import { Users, TrendingUp, BarChart3 } from 'lucide-react';

const prisma = new PrismaClient();

export default async function PriceIndexPage() {
  const raw = await prisma.priceContribution.groupBy({
    by: ['category', 'itemKeyword', 'unit'],
    _avg: { confirmedPrice: true },
    _min: { confirmedPrice: true },
    _max: { confirmedPrice: true },
    _count: { confirmedPrice: true },
    orderBy: { _count: { confirmedPrice: 'desc' } },
  });

  const totalContributions = await prisma.priceContribution.count();
  const totalCategories = new Set(raw.map(r => r.category)).size;

  const fmt = (v: number | null | undefined) =>
    v != null ? new Intl.NumberFormat('vi-VN').format(Math.round(v)) : '—';

  const grouped = raw.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {} as Record<string, typeof raw>);

  return (
    <div className="flex flex-col gap-5 pt-2 pb-10">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--text)]">Chỉ số giá cộng đồng</h1>
        <p className="text-[13px] text-[var(--text3)] mt-0.5">Giá được đóng góp ẩn danh từ người dùng đã chốt hợp đồng thực tế.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users,     label: 'Đóng góp',    value: totalContributions, sub: 'mức giá ẩn danh' },
          { icon: BarChart3, label: 'Danh mục',     value: totalCategories,    sub: 'phân mục vật liệu' },
          { icon: TrendingUp, label: 'Hạng mục',    value: raw.length,         sub: 'mặt hàng được theo dõi' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--acc-light)] text-[var(--acc)] flex items-center justify-center shrink-0 mt-0.5">
              <s.icon size={15} />
            </div>
            <div>
              <div className="text-[22px] font-bold text-[var(--text)] leading-none">{s.value}</div>
              <div className="text-[10.5px] font-semibold text-[var(--text3)] mt-1">{s.label}</div>
              <div className="text-[10px] text-[var(--text4)]">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {totalContributions === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl text-center">
          <Users size={28} className="text-[var(--text4)] mb-4" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-[var(--text)] mb-1">Chưa có dữ liệu cộng đồng</p>
          <p className="text-[12.5px] text-[var(--text3)] max-w-sm leading-relaxed">
            Khi bạn chốt giá một hạng mục và chọn đóng góp ẩn danh, dữ liệu sẽ xuất hiện ở đây để giúp cộng đồng tham khảo.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-auto max-h-[680px]">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase">Hạng mục</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">ĐVT</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Thấp nhất</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--acc)] uppercase w-28 text-right bg-[var(--acc-light)]">Trung bình</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Cao nhất</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-center">Mẫu</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([catName, items]) => (
                  <>
                    <tr key={`cat-${catName}`} className="border-b border-[var(--border)] bg-[var(--surface2)]">
                      <td colSpan={6} className="py-2 px-4 font-bold text-[11.5px] text-[var(--acc)]">{catName}</td>
                    </tr>
                    {items.map((row, idx) => (
                      <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)]">
                        <td className="py-2.5 px-4 font-medium text-[var(--text)] capitalize">{row.itemKeyword}</td>
                        <td className="py-2.5 px-4 text-center text-[var(--text3)]">{row.unit || '—'}</td>
                        <td className="py-2.5 px-4 text-right text-[var(--text3)] tabular-nums">{fmt(row._min.confirmedPrice)}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-[var(--acc)] tabular-nums bg-[var(--acc-light)]">{fmt(row._avg.confirmedPrice)}</td>
                        <td className="py-2.5 px-4 text-right text-[var(--text3)] tabular-nums">{fmt(row._max.confirmedPrice)}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="bg-[var(--surface2)] border border-[var(--border)] px-2 py-0.5 rounded-full text-[10.5px] font-semibold text-[var(--text3)]">
                            {row._count.confirmedPrice}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
