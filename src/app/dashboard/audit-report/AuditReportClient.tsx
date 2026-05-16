'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingDown, Wallet, BarChart3, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Zap, Filter } from 'lucide-react';

type AuditItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  brand?: string | null;
  note?: string | null;
  marketPrice?: number | null;
  priceRangeLow?: number | null;
  priceRangeHigh?: number | null;
  priceConfidence?: string | null;
  priceSource?: string | null;
  evaluation?: string | null;
  status: string;
  agreedPrice?: number | null;
  projectName: string;
  quotationName: string;
  quotationId: string;
};

type Verdict = 'urgent' | 'should-change' | 'acceptable' | 'skip';

function computeVerdict(item: AuditItem): Verdict {
  if (item.status === 'agreed') return 'acceptable';
  if (!item.marketPrice) return 'skip';
  const ratio = (item.unitPrice - item.marketPrice) / item.marketPrice;
  if (ratio > 0.3) return 'urgent';
  if (ratio > 0.1) return 'should-change';
  return 'acceptable';
}

function verdictConfig(v: Verdict) {
  return {
    urgent:        { label: 'Nên đàm phán gấp',  color: 'var(--red)',    bg: 'var(--red-bg)',    border: 'var(--red-border)',    icon: XCircle },
    'should-change': { label: 'Cân nhắc thay đổi', color: 'var(--ylw)',    bg: 'var(--ylw-bg)',    border: 'var(--ylw-border)',    icon: AlertTriangle },
    acceptable:    { label: 'Giá hợp lý',         color: 'var(--grn)',    bg: 'var(--grn-bg)',    border: 'var(--grn-border)',    icon: CheckCircle },
    skip:          { label: 'Chưa có dữ liệu',    color: 'var(--text3)',  bg: 'var(--surface2)',  border: 'var(--border)',        icon: Zap },
  }[v];
}

function expertSuggest(item: AuditItem, verdict: Verdict): string {
  if (verdict === 'skip') return 'Chưa có giá thị trường để đối chiếu. Nên tra giá AI hoặc tự khảo sát trước khi ký hợp đồng.';
  if (verdict === 'acceptable') return item.status === 'agreed'
    ? 'Đã chốt giá. Không cần hành động thêm.'
    : 'Giá báo nằm trong khoảng thị trường. Có thể chấp nhận, nhưng vẫn nên thử đàm phán thêm 5–10%.';
  const pct = item.marketPrice ? Math.round(((item.unitPrice - item.marketPrice) / item.marketPrice) * 100) : 0;
  if (verdict === 'urgent') return `Giá báo cao hơn thị trường ${pct}%. Đây là mức chênh lệch đáng kể — nên yêu cầu nhà thầu giải thích hoặc tìm nhà cung cấp thay thế ngay.`;
  return `Giá báo cao hơn thị trường khoảng ${pct}%. Nên đàm phán đưa về mức tham chiếu hoặc nhờ nhà thầu báo lại với thương hiệu khác tương đương.`;
}

export default function AuditReportClient({ projects, allItems }: { projects: any[]; allItems: AuditItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verdictFilter, setVerdictFilter] = useState<Verdict | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [quotationFilter, setQuotationFilter] = useState('all');

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const fmtC = (v: number) => v >= 1e9 ? (v / 1e9).toFixed(2) + ' tỷ' : v >= 1e6 ? (v / 1e6).toFixed(1) + ' tr' : fmt(v);

  const categories = useMemo(() => Array.from(new Set(allItems.map(i => i.category).filter(Boolean))).sort(), [allItems]);
  const quotations = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach(p => p.quotations.forEach((q: any) => map.set(q.id, `${p.name} — ${q.name}`)));
    return Array.from(map.entries());
  }, [projects]);

  const itemsWithVerdict = useMemo(() => allItems.map(item => ({ item, verdict: computeVerdict(item) })), [allItems]);

  const filtered = useMemo(() => itemsWithVerdict.filter(({ item, verdict }) => {
    if (verdictFilter !== 'all' && verdict !== verdictFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (quotationFilter !== 'all' && item.quotationId !== quotationFilter) return false;
    return true;
  }), [itemsWithVerdict, verdictFilter, categoryFilter, quotationFilter]);

  // Summary stats
  const urgentCount = itemsWithVerdict.filter(x => x.verdict === 'urgent').length;
  const shouldChangeCount = itemsWithVerdict.filter(x => x.verdict === 'should-change').length;
  const acceptableCount = itemsWithVerdict.filter(x => x.verdict === 'acceptable').length;
  const skipCount = itemsWithVerdict.filter(x => x.verdict === 'skip').length;
  const totalSavings = allItems.reduce((acc, i) => {
    if (!i.marketPrice || i.unitPrice <= i.marketPrice) return acc;
    return acc + (i.unitPrice - i.marketPrice) * i.quantity;
  }, 0);
  const totalValue = allItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const auditScore = allItems.length > 0 ? Math.round((acceptableCount / allItems.length) * 100) : 0;
  const scoreColor = auditScore >= 75 ? 'var(--score-great)' : auditScore >= 45 ? 'var(--score-warn)' : 'var(--score-danger)';

  // Group filtered items by category
  const grouped = useMemo(() => filtered.reduce((acc, entry) => {
    const cat = entry.item.category || 'Chưa phân loại';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(entry);
    return acc;
  }, {} as Record<string, typeof filtered>), [filtered]);

  const VERDICTS: (Verdict | 'all')[] = ['all', 'urgent', 'should-change', 'acceptable', 'skip'];
  const verdictLabels: Record<string, string> = { all: 'Tất cả', urgent: 'Đàm phán gấp', 'should-change': 'Cân nhắc', acceptable: 'Hợp lý', skip: 'Chưa có dữ liệu' };

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldCheck size={36} className="text-[var(--text4)] mb-5" strokeWidth={1.5} />
        <h1 className="text-[18px] font-bold text-[var(--text)] mb-2">Chưa có dữ liệu để kiểm toán</h1>
        <p className="text-[13px] text-[var(--text3)] max-w-sm leading-relaxed">Tải lên ít nhất một báo giá để hệ thống bắt đầu phân tích và đưa ra khuyến nghị.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pt-2 pb-12">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--text)] flex items-center gap-2">
            <ShieldCheck size={20} className="text-[var(--acc)]" /> Báo cáo Kiểm toán Chuyên sâu
          </h1>
          <p className="text-[13px] text-[var(--text3)] mt-0.5">
            Đánh giá từ góc độ chuyên gia kiến trúc & nội thất — {allItems.length} hạng mục từ {projects.length} dự án.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] font-semibold text-[var(--text3)] uppercase tracking-wide mb-1">Điểm kiểm toán</div>
          <div className="text-[28px] font-black leading-none tabular-nums" style={{ color: scoreColor }}>{auditScore}%</div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Đàm phán gấp', value: urgentCount, sub: 'hạng mục giá cao >30%', color: 'red', icon: XCircle },
          { label: 'Cân nhắc thay đổi', value: shouldChangeCount, sub: 'hạng mục giá cao 10–30%', color: 'ylw', icon: AlertTriangle },
          { label: 'Tiết kiệm tiềm năng', value: fmtC(totalSavings), sub: 'nếu đàm phán toàn bộ', color: 'grn', icon: TrendingDown },
          { label: 'Tổng giá trị', value: fmtC(totalValue), sub: `${allItems.length} hạng mục`, color: 'blue', icon: Wallet },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between card-hover">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-semibold text-[var(--text3)] uppercase tracking-wide leading-tight max-w-[75%]">{c.label}</span>
                <div className={`w-6 h-6 rounded-md bg-[var(--${c.color}-bg)] text-[var(--${c.color})] flex items-center justify-center shrink-0`}>
                  <Icon size={12} />
                </div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[var(--text)] leading-none tabular-nums">{c.value}</div>
                <div className="text-[10px] text-[var(--text3)] mt-1">{c.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex flex-wrap gap-3 items-end">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-[var(--text3)] shrink-0" />
          <span className="text-[10.5px] font-semibold text-[var(--text3)] uppercase tracking-wide">Lọc theo kết quả:</span>
          {VERDICTS.map(v => {
            const cfg = v !== 'all' ? verdictConfig(v) : null;
            return (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors border ${
                  verdictFilter === v
                    ? v === 'all' ? 'bg-[var(--acc-light)] text-[var(--acc)] border-[var(--acc-ring)]'
                      : `border-[${cfg!.border}]`
                    : 'text-[var(--text3)] border-transparent hover:bg-[var(--surface2)]'
                }`}
                style={verdictFilter === v && v !== 'all' ? { background: cfg!.bg, color: cfg!.color, borderColor: cfg!.border } : {}}
              >
                {verdictLabels[v]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <select
            value={quotationFilter}
            onChange={e => setQuotationFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[var(--border)] rounded-md text-[12px] font-medium text-[var(--text)] bg-[var(--surface)] outline-none focus:border-[var(--acc)] appearance-none cursor-pointer"
          >
            <option value="all">Tất cả báo giá</option>
            {quotations.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[var(--border)] rounded-md text-[12px] font-medium text-[var(--text)] bg-[var(--surface)] outline-none focus:border-[var(--acc)] appearance-none cursor-pointer"
          >
            <option value="all">Tất cả phân mục</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Audit Items */}
      <div className="flex flex-col gap-3">
        {Object.keys(grouped).length === 0 && (
          <div className="py-16 text-center text-[var(--text3)] text-[13px] bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl">
            Không có hạng mục nào khớp với bộ lọc hiện tại.
          </div>
        )}
        {Object.entries(grouped).map(([catName, entries]) => (
          <div key={catName} className="flex flex-col gap-2">
            {/* Category header */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold text-[var(--acc)] uppercase tracking-widest">{catName}</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[10px] text-[var(--text3)] font-semibold">{entries.length} hạng mục</span>
            </div>

            {entries.map(({ item, verdict }) => {
              const cfg = verdictConfig(verdict);
              const Icon = cfg.icon;
              const suggest = expertSuggest(item, verdict);
              const isExpanded = expandedId === item.id;
              const diff = item.marketPrice ? item.unitPrice - item.marketPrice : null;
              const pct = diff && item.marketPrice ? Math.round((diff / item.marketPrice) * 100) : 0;
              const savingsTotal = diff && diff > 0 ? diff * item.quantity : 0;

              return (
                <div
                  key={item.id}
                  className="bg-[var(--surface)] border rounded-xl overflow-hidden transition-all duration-150"
                  style={{ borderColor: isExpanded ? cfg.color : 'var(--border)' }}
                >
                  {/* Row */}
                  <button
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[var(--surface2)] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    {/* Verdict icon */}
                    <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                      <Icon size={14} style={{ color: cfg.color }} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[13.5px] text-[var(--text)] leading-snug">{item.name}</span>
                        {item.brand && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--acc-light)] text-[var(--acc)] border border-[var(--acc-ring)]">{item.brand}</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[var(--text3)] mt-0.5">
                        {item.quantity} {item.unit} — báo giá từ <span className="font-medium text-[var(--text2)]">{item.quotationName}</span> · {item.projectName}
                      </div>
                    </div>

                    {/* Price info */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <div className="font-bold text-[var(--text)] tabular-nums text-[13px]">{fmt(item.unitPrice)} đ</div>
                      {item.marketPrice && (
                        <div className="text-[11px] tabular-nums font-semibold mt-0.5" style={{ color: pct > 0 ? 'var(--red)' : 'var(--grn)' }}>
                          {pct > 0 ? `+${pct}% vs TT` : `${pct}% vs TT`}
                        </div>
                      )}
                    </div>

                    {/* Expand icon */}
                    <div className="shrink-0 mt-1 text-[var(--text4)]">
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border)] px-4 py-4 bg-[var(--surface2)] flex flex-col gap-4">

                      {/* Expert suggestion box */}
                      <div className="flex gap-3 p-3 rounded-lg border" style={{ background: cfg.bg, borderColor: cfg.border }}>
                        <ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: cfg.color }}>Khuyến nghị chuyên gia</p>
                          <p className="text-[12.5px] text-[var(--text)] leading-relaxed">{suggest}</p>
                        </div>
                      </div>

                      {/* Price comparison */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Đơn giá báo', value: fmt(item.unitPrice) + ' đ', highlight: false },
                          { label: 'Giá thị trường', value: item.marketPrice ? fmt(item.marketPrice) + ' đ' : 'Chưa có', highlight: true },
                          { label: 'Chênh lệch đơn giá', value: diff ? (diff > 0 ? '+' : '') + fmt(diff) + ' đ' : '—', highlight: false, danger: diff !== null && diff > 0 },
                          { label: 'Tiết kiệm tiềm năng', value: savingsTotal > 0 ? fmt(savingsTotal) + ' đ' : '—', highlight: false, green: savingsTotal > 0 },
                        ].map(card => (
                          <div key={card.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3">
                            <div className="text-[9.5px] font-semibold text-[var(--text3)] uppercase tracking-wide mb-1">{card.label}</div>
                            <div className={`text-[14px] font-bold tabular-nums leading-snug ${
                              card.danger ? 'text-[var(--red)]' : card.green ? 'text-[var(--grn)]' : card.highlight ? 'text-[var(--acc)]' : 'text-[var(--text)]'
                            }`}>{card.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Price range bar */}
                      {item.priceRangeLow && item.priceRangeHigh && (
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text3)] font-semibold mb-1">
                            <span>Thấp: {fmt(item.priceRangeLow)} đ</span>
                            <span>Trung bình: {item.marketPrice ? fmt(item.marketPrice) : '—'} đ</span>
                            <span>Cao: {fmt(item.priceRangeHigh)} đ</span>
                          </div>
                          <div className="relative h-2 bg-[var(--surface)] border border-[var(--border)] rounded-full overflow-hidden">
                            {/* Range bar */}
                            <div className="absolute top-0 bottom-0 bg-[var(--acc-light)]"
                              style={{
                                left: '0%',
                                right: '0%',
                              }}
                            />
                            {/* Quoted price marker */}
                            {(() => {
                              const low = item.priceRangeLow!;
                              const high = item.priceRangeHigh!;
                              const range = high - low;
                              const pos = range > 0 ? Math.min(100, Math.max(0, ((item.unitPrice - low) / range) * 100)) : 50;
                              return (
                                <div
                                  className="absolute top-0 bottom-0 w-0.5 bg-[var(--red)]"
                                  style={{ left: `${pos}%` }}
                                  title={`Giá báo: ${fmt(item.unitPrice)}`}
                                />
                              );
                            })()}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[9px] text-[var(--text3)]">Khoảng giá thị trường · nguồn: {item.priceSource || 'AI'}</span>
                            {item.priceConfidence && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none
                                ${item.priceConfidence === 'high' ? 'bg-[var(--grn-bg)] text-[var(--grn)]' :
                                  item.priceConfidence === 'medium' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)]' :
                                  'bg-[var(--red-bg)] text-[var(--red)]'}`}>
                                Độ tin cậy: {item.priceConfidence === 'high' ? 'Cao' : item.priceConfidence === 'medium' ? 'TB' : 'Thấp'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quick actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`/dashboard/quotations/${item.quotationId}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border border-[var(--border)] rounded-md text-[var(--text2)] hover:border-[var(--acc)] hover:text-[var(--acc)] transition-colors"
                        >
                          <ExternalLink size={12} /> Mở báo giá
                        </a>
                        <a
                          href={`https://shopee.vn/search?keyword=${encodeURIComponent(item.name + ' ' + (item.brand || ''))}`}
                          target="_blank" rel="noopener"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-[#EE4D2D] text-white rounded-md hover:opacity-90 transition-opacity"
                        >
                          Shopee
                        </a>
                        <a
                          href={`https://www.lazada.vn/catalog/?q=${encodeURIComponent(item.name + ' ' + (item.brand || ''))}`}
                          target="_blank" rel="noopener"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-[#0F136D] text-white rounded-md hover:opacity-90 transition-opacity"
                        >
                          Lazada
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
        <p className="text-[10.5px] font-bold text-[var(--text3)] uppercase tracking-widest mb-3 flex items-center gap-2"><BarChart3 size={12} /> Phương pháp đánh giá</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['urgent', 'should-change', 'acceptable', 'skip'] as Verdict[]).map(v => {
            const cfg = verdictConfig(v);
            const Icon = cfg.icon;
            const desc = {
              urgent: 'Giá báo > thị trường 30%+. Cần đàm phán hoặc tìm nhà thầu khác.',
              'should-change': 'Giá báo cao hơn 10–30%. Nên thương lượng hoặc so sánh thêm.',
              acceptable: 'Giá trong khoảng chấp nhận được (<10% vs TT) hoặc đã chốt.',
              skip: 'Chưa có dữ liệu thị trường. Cần tra giá trước khi quyết định.',
            }[v];
            return (
              <div key={v} className="flex gap-2">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: cfg.bg }}>
                  <Icon size={12} style={{ color: cfg.color }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                  <p className="text-[10px] text-[var(--text3)] leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
