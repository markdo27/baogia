'use client';

import { useState } from 'react';
import { ArrowLeftRight, TrendingDown, Crown, Minus } from 'lucide-react';

type LineItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  brand?: string;
};

type CompareResult = {
  name: string;
  category: string;
  q1: LineItem | null;
  q2: LineItem | null;
};

type Quotation = { id: string; name: string; _count: { items: number } };
type Project = { id: string; name: string; quotations: Quotation[] };

export default function CompareClient({
  projects,
  initialCompare,
}: {
  projects: Project[];
  initialCompare: CompareResult[] | null;
}) {
  const allQuotations = projects.flatMap(p => p.quotations.map(q => ({ ...q, projectName: p.name })));

  const [q1Id, setQ1Id] = useState(allQuotations[0]?.id ?? '');
  const [q2Id, setQ2Id] = useState(allQuotations[1]?.id ?? '');
  const [results, setResults] = useState<CompareResult[] | null>(initialCompare);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q1Label = allQuotations.find(q => q.id === q1Id);
  const q2Label = allQuotations.find(q => q.id === q2Id);

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  const runCompare = async () => {
    if (!q1Id || !q2Id || q1Id === q2Id) {
      setError('Vui lòng chọn 2 báo giá khác nhau.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/compare?q1=${q1Id}&q2=${q2Id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const q1Total = results?.reduce((s, r) => s + (r.q1?.totalPrice ?? 0), 0) ?? 0;
  const q2Total = results?.reduce((s, r) => s + (r.q2?.totalPrice ?? 0), 0) ?? 0;
  const totalDelta = Math.abs(q1Total - q2Total);
  const winner = q1Total < q2Total ? 'q1' : q2Total < q1Total ? 'q2' : 'tie';

  return (
    <div className="flex flex-col gap-5 pt-2 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--text)]">So sánh báo giá</h1>
          <p className="text-[13px] text-[var(--text3)] mt-0.5">Đặt hai báo giá cạnh nhau để tìm ra nhà thầu có lợi nhất.</p>
        </div>
      </div>

      {/* Selector */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <label className="text-[10.5px] font-semibold text-[var(--text3)] uppercase tracking-wide">Báo giá A</label>
          <select
            value={q1Id}
            onChange={e => setQ1Id(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-md text-[13px] font-medium text-[var(--text)] bg-[var(--surface)] outline-none focus:border-[var(--acc)] appearance-none cursor-pointer"
          >
            {allQuotations.map(q => (
              <option key={q.id} value={q.id}>{q.projectName} — {q.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface2)] text-[var(--text3)] mb-0.5 shrink-0">
          <ArrowLeftRight size={14} />
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <label className="text-[10.5px] font-semibold text-[var(--text3)] uppercase tracking-wide">Báo giá B</label>
          <select
            value={q2Id}
            onChange={e => setQ2Id(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-md text-[13px] font-medium text-[var(--text)] bg-[var(--surface)] outline-none focus:border-[var(--acc)] appearance-none cursor-pointer"
          >
            {allQuotations.map(q => (
              <option key={q.id} value={q.id}>{q.projectName} — {q.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={runCompare}
          disabled={loading}
          className="px-5 py-2 bg-[var(--acc)] text-white font-semibold text-[13px] rounded-md hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
        >
          {loading ? 'Đang so sánh...' : 'So sánh ngay'}
        </button>

        {error && <p className="w-full text-[12px] text-[var(--red)] font-medium">{error}</p>}
      </div>

      {/* Summary cards — show only after compare */}
      {results && q1Label && q2Label && (
        <div className="grid grid-cols-3 gap-3">
          <div className={`rounded-xl p-4 border flex flex-col gap-1 ${winner === 'q1' ? 'bg-[var(--grn-bg)] border-[var(--grn-border)]' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-semibold text-[var(--text3)] uppercase">{q1Label.name}</span>
              {winner === 'q1' && <Crown size={13} className="text-[var(--grn)]" />}
            </div>
            <div className="text-[22px] font-bold text-[var(--text)] tabular-nums">{fmt(q1Total)}</div>
            <div className="text-[11px] text-[var(--text3)]">Tổng giá trị</div>
          </div>

          <div className="rounded-xl p-4 border bg-[var(--surface2)] border-[var(--border)] flex flex-col gap-1 items-center justify-center text-center">
            <TrendingDown size={18} className="text-[var(--acc)] mb-1" />
            <div className="text-[18px] font-bold text-[var(--acc)] tabular-nums">{fmt(totalDelta)}</div>
            <div className="text-[11px] text-[var(--text3)]">Chênh lệch tổng</div>
          </div>

          <div className={`rounded-xl p-4 border flex flex-col gap-1 ${winner === 'q2' ? 'bg-[var(--grn-bg)] border-[var(--grn-border)]' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-semibold text-[var(--text3)] uppercase">{q2Label.name}</span>
              {winner === 'q2' && <Crown size={13} className="text-[var(--grn)]" />}
            </div>
            <div className="text-[22px] font-bold text-[var(--text)] tabular-nums">{fmt(q2Total)}</div>
            <div className="text-[11px] text-[var(--text3)]">Tổng giá trị</div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {results && q1Label && q2Label && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-auto max-h-[640px]">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase">Hạng mục</th>
                  <th className="py-3 px-4 font-semibold text-[10px] text-[var(--acc)] uppercase w-48 border-l border-[var(--border)] bg-[var(--acc-light)]">
                    A · {q1Label.name}
                  </th>
                  <th className="py-3 px-4 font-semibold text-[10px] text-[var(--purple)] uppercase w-48 border-l border-[var(--border)] bg-[var(--purple-bg)]">
                    B · {q2Label.name}
                  </th>
                  <th className="py-3 px-4 font-semibold text-[10px] text-[var(--text3)] uppercase w-36 text-center border-l border-[var(--border)]">
                    Chênh lệch
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((match, idx) => {
                  const diff = (match.q1?.totalPrice ?? 0) - (match.q2?.totalPrice ?? 0);
                  const absDiff = Math.abs(diff);
                  const rowWinner = diff < 0 ? 'q1' : diff > 0 ? 'q2' : 'tie';

                  return (
                    <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)] group">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--text)] leading-snug">{match.name}</div>
                        {match.category && <div className="text-[10px] text-[var(--text3)] mt-0.5">{match.category}</div>}
                      </td>

                      <td className={`py-3 px-4 border-l border-[var(--border-subtle)] ${rowWinner === 'q1' ? 'bg-[var(--grn-bg)]' : ''}`}>
                        {match.q1 ? (
                          <div>
                            <div className="font-bold text-[var(--text)] tabular-nums">{fmt(match.q1.totalPrice)}</div>
                            <div className="text-[10px] text-[var(--text3)] mt-0.5">{match.q1.quantity} {match.q1.unit} × {fmt(match.q1.unitPrice)}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--text4)] text-[11px] italic">Không có hạng mục này</span>
                        )}
                      </td>

                      <td className={`py-3 px-4 border-l border-[var(--border-subtle)] ${rowWinner === 'q2' ? 'bg-[var(--grn-bg)]' : ''}`}>
                        {match.q2 ? (
                          <div>
                            <div className="font-bold text-[var(--text)] tabular-nums">{fmt(match.q2.totalPrice)}</div>
                            <div className="text-[10px] text-[var(--text3)] mt-0.5">{match.q2.quantity} {match.q2.unit} × {fmt(match.q2.unitPrice)}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--text4)] text-[11px] italic">Không có hạng mục này</span>
                        )}
                      </td>

                      <td className="py-3 px-4 border-l border-[var(--border-subtle)] text-center">
                        {rowWinner === 'tie' ? (
                          <div className="flex items-center justify-center gap-1 text-[var(--text3)]">
                            <Minus size={12} />
                            <span className="text-[11px] font-medium">Bằng nhau</span>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-[var(--text)] tabular-nums text-[12px]">{fmt(absDiff)}</div>
                            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block
                              ${rowWinner === 'q1' ? 'bg-[var(--acc-light)] text-[var(--acc)]' : 'bg-[var(--purple-bg)] text-[var(--purple)]'}`}>
                              {rowWinner === 'q1' ? 'A rẻ hơn' : 'B rẻ hơn'}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!results && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl">
          <ArrowLeftRight size={28} className="text-[var(--text4)] mb-4" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-[var(--text)] mb-1">Chọn hai báo giá để bắt đầu so sánh</p>
          <p className="text-[12.5px] text-[var(--text3)]">Hệ thống sẽ tự động đối chiếu từng hạng mục và tìm ra nhà thầu có giá tốt nhất.</p>
        </div>
      )}
    </div>
  );
}
