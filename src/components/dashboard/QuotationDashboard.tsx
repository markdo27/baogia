'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer, AlertTriangle, TrendingDown, CheckCircle, Wallet, Search, Loader2, Zap, Trash2, Bot, Database } from 'lucide-react';
import { usePipelineMode } from '@/components/layout/PipelineToggle';

const STATUS_CONFIG = {
  pending:     { label: 'Chưa chốt',   active: 'bg-[var(--surface2)] text-[var(--text2)] border-[var(--border)]' },
  negotiating: { label: 'Đàm phán',    active: 'bg-[var(--ylw-bg)] text-[var(--ylw)] border-[var(--ylw-border)]' },
  agreed:      { label: 'Đã chốt ✓',   active: 'bg-[var(--grn-bg)] text-[var(--grn)] border-[var(--grn-border)]' },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

function StatusToggle({ value, onChange }: { value: StatusKey; onChange: (v: StatusKey) => void }) {
  return (
    <div className="flex rounded-md overflow-hidden border border-[var(--border)] text-[10.5px] font-semibold w-full">
      {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((s, i) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex-1 py-1.5 border-r last:border-r-0 border-[var(--border)] transition-colors
            ${value === s ? STATUS_CONFIG[s].active : 'bg-[var(--surface)] text-[var(--text4)] hover:text-[var(--text3)]'}`}
        >
          {STATUS_CONFIG[s].label}
        </button>
      ))}
    </div>
  );
}

export default function QuotationDashboard({ quotation }: { quotation: any }) {
  const [items, setItems] = useState<any[]>(quotation.items);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [batchLoading, setBatchLoading] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [contributeToast, setContributeToast] = useState<{ itemId: string; itemName: string } | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [pipelineMode] = usePipelineMode();

  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // Metrics
  const totalItems = items.length;
  const unpricedCount = items.filter(i => !i.marketPrice).length;
  const highPricedItems = items.filter(i => i.marketPrice && (i.unitPrice - i.marketPrice) / i.marketPrice > 0.2).length;
  const potentialSavings = items.reduce((acc, i) => {
    if (!i.marketPrice) return acc;
    const diff = i.unitPrice - i.marketPrice;
    return diff > 0 ? acc + diff * i.quantity : acc;
  }, 0);
  const agreedCount = items.filter(i => i.status === 'agreed').length;
  const originalTotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const negotiatedTotal = items.reduce((acc, i) => acc + (i.agreedPrice !== null ? i.agreedPrice : i.totalPrice), 0);

  // Filter & Group
  const displayed = items.filter(i => {
    if (categoryFilter && (!i.category || !i.category.includes(categoryFilter))) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });
  const grouped = displayed.reduce((acc, item) => {
    const cat = item.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Helpers
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const fmtCompact = (v: number) => v >= 1e9 ? (v / 1e9).toFixed(2) + ' tỷ' : v >= 1e6 ? (v / 1e6).toFixed(1) + ' tr' : fmt(v);

  const handleUpdate = async (id: string, updates: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    // Show contribution toast when item is marked agreed
    if (updates.status === 'agreed') {
      const item = items.find(i => i.id === id);
      if (item) setContributeToast({ itemId: id, itemName: item.name });
    }
    try {
      await fetch('/api/items/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) { console.error(e); }
  };

  const submitContribution = async (itemId: string) => {
    setContributeToast(null);
    try {
      await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
    } catch (e) { console.error(e); }
  };

  const handleDeleteItem = async (id: string) => {
    if (deletingItemId !== id) {
      // First click: arm the delete
      setDeletingItemId(id);
      setTimeout(() => setDeletingItemId(prev => prev === id ? null : prev), 3000);
      return;
    }
    // Second click: commit
    setDeletingItemId(null);
    setItems(prev => prev.filter(i => i.id !== id));
    try {
      await fetch('/api/items/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) { console.error(e); }
  };

  const fetchMarketPrice = async (item: any) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const res = await fetch('/api/market-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          name: item.name,
          brand: item.brand,
          unit: item.unit,
          forceMode: pipelineMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(prev => prev.map(i => i.id === item.id ? data.item : i));
    } catch (err) {
      alert('Lỗi khi tìm giá: ' + err);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const fetchAllUnpriced = async () => {
    setBatchLoading(true);
    const unpriced = items.filter(i => !i.marketPrice);
    for (const item of unpriced) {
      await fetchMarketPrice(item);
    }
    setBatchLoading(false);
  };

  const searchLink = (name: string, brand: string, platform: string) => {
    const q = encodeURIComponent(`${name} ${brand || ''}`);
    if (platform === 'shopee') return `https://shopee.vn/search?keyword=${q}`;
    if (platform === 'lazada') return `https://www.lazada.vn/catalog/?q=${q}`;
    return `https://www.google.com/search?q=${q}`;
  };

  return (
    <div className="flex flex-col gap-5 pt-2 pb-10 relative">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[var(--text)] tracking-[-0.02em]">Bảng báo giá chi tiết</h1>
          <p className="text-[13px] text-[var(--text3)] mt-0.5">So sánh đơn giá báo với giá thị trường · {totalItems} hạng mục</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-md text-[12px] font-semibold text-[var(--text2)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors">
          <Printer size={13} /> Xuất báo cáo
        </button>
      </div>

      {/* Metric Cards — 1 Audit Score + 4 supporting */}
      {(() => {
        const cleanItems = items.filter(i =>
          i.status === 'agreed' ||
          (i.marketPrice && i.unitPrice <= i.marketPrice * 1.2)
        ).length;
        const auditScore = totalItems > 0 ? Math.round((cleanItems / totalItems) * 100) : 0;
        const scoreColor = auditScore >= 80 ? 'var(--score-great)' : auditScore >= 50 ? 'var(--score-warn)' : 'var(--score-danger)';
        const scoreLabel = auditScore >= 80 ? 'Tốt' : auditScore >= 50 ? 'Cần xem xét' : 'Rủi ro cao';
        const r = 30; const circ = 2 * Math.PI * r;
        const filled = (auditScore / 100) * circ;
        return (
          <div className="grid grid-cols-5 gap-3">
            {/* Audit Score — large left card */}
            <div className="col-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 card-hover">
              <div className="relative w-[76px] h-[76px] shrink-0">
                <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
                  <circle cx="38" cy="38" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
                  <circle cx="38" cy="38" r={r} fill="none" stroke={scoreColor} strokeWidth="6"
                    strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 800ms cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[17px] font-bold leading-none" style={{ color: scoreColor }}>{auditScore}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold" style={{ color: scoreColor }}>{scoreLabel}</p>
                <p className="text-[9.5px] text-[var(--text4)] font-medium uppercase tracking-wide mt-0.5">Audit Score</p>
              </div>
            </div>

            {/* 4 supporting metrics */}
            {[
              { label: 'Giá cao >20%',         value: highPricedItems,            sub: 'hạng mục',         icon: AlertTriangle, color: 'red'    },
              { label: 'Tiết kiệm tiềm năng',   value: fmtCompact(potentialSavings), sub: 'nếu đàm phán',  icon: TrendingDown,  color: 'grn'    },
              { label: 'Tổng gốc',              value: fmtCompact(originalTotal),  sub: 'báo giá gốc',      icon: Wallet,        color: 'blue'   },
              { label: 'Sau đàm phán',           value: fmtCompact(negotiatedTotal), sub: `${agreedCount}/${totalItems} đã chốt`, icon: CheckCircle, color: 'purple' },
            ].map(card => (
              <div key={card.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between card-hover">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-semibold text-[var(--text3)] uppercase tracking-wide leading-tight max-w-[75%]">{card.label}</span>
                  <div className={`w-6 h-6 rounded-md bg-[var(--${card.color}-bg)] flex items-center justify-center text-[var(--${card.color})] shrink-0`}>
                    <card.icon size={12} />
                  </div>
                </div>
                <div>
                  <div className="text-[20px] font-bold text-[var(--text)] leading-none tabular-nums">{card.value}</div>
                  <div className="text-[10px] font-medium text-[var(--text3)] mt-1">{card.sub}</div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Main Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'agreed', 'negotiating', 'pending'] as const).map(f => {
              const counts: Record<string, number> = {
                all: totalItems,
                agreed: agreedCount,
                negotiating: items.filter(i => i.status === 'negotiating').length,
                pending: items.filter(i => i.status === 'pending').length,
              };
              const labels: Record<string, string> = { all: 'Tất cả', agreed: 'Đã chốt', negotiating: 'Đàm phán', pending: 'Chưa chốt' };
              const colors: Record<string, string> = {
                all: statusFilter === 'all' ? 'bg-[var(--acc-light)] text-[var(--acc)] border border-[var(--acc-ring)]' : '',
                agreed: statusFilter === 'agreed' ? 'bg-[var(--grn-bg)] text-[var(--grn)] border border-[var(--grn-border)]' : '',
                negotiating: statusFilter === 'negotiating' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)] border border-[var(--ylw-border)]' : '',
                pending: statusFilter === 'pending' ? 'bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)]' : '',
              };
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-transparent
                    ${statusFilter === f ? colors[f] : 'text-[var(--text3)] hover:bg-[var(--surface2)]'}`}
                >
                  {labels[f]}
                  <span className="bg-[var(--border-subtle)] text-[var(--text3)] px-1.5 py-0.5 rounded text-[10px]">{counts[f]}</span>
                </button>
              );
            })}
          </div>

          {/* Batch pricing — label reflects active pipeline mode */}
          {unpricedCount > 0 && (
            <button
              onClick={fetchAllUnpriced}
              disabled={batchLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--ylw-bg)] border border-[var(--ylw-border)] text-[var(--ylw)] text-[12px] font-semibold hover:bg-[var(--ylw)] hover:text-white transition-colors disabled:opacity-60"
            >
              {batchLoading
                ? <Loader2 size={13} className="animate-spin" />
                : pipelineMode === 'ai'       ? <Bot size={13} />
                : pipelineMode === 'fallback' ? <Database size={13} />
                : <Zap size={13} />}
              {pipelineMode === 'ai'       ? `Tra giá AI ✦ ${unpricedCount} mục`
               : pipelineMode === 'fallback' ? `Tra giá Offline ${unpricedCount} mục`
               : `Tra giá ${unpricedCount} mục chưa có giá`}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[720px]">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
              {/* Group labels */}
              <tr className="border-b border-[var(--border-subtle)]">
                <th colSpan={3} className="py-1 px-3 text-[9px] font-bold text-[var(--text4)] uppercase tracking-widest border-r border-[var(--border)]">Thông tin</th>
                <th colSpan={4} className="py-1 px-3 text-[9px] font-bold text-[var(--text4)] uppercase tracking-widest border-r border-[var(--border)]">Dữ liệu AI</th>
                <th colSpan={3} className="py-1 px-3 text-[9px] font-bold text-[var(--acc)] uppercase tracking-widest" style={{ background: 'var(--action-band)' }}>Khu vực đàm phán ✎</th>
                <th className="py-1 px-3" />
                <th className="py-1 px-3" />
              </tr>
              {/* Column headers */}
              <tr>
                {/* GROUP A */}
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase">Hạng mục</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">Thương hiệu</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center border-r border-[var(--border)]">ĐVT / SL</th>
                {/* GROUP B */}
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Đơn giá báo</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-32 text-right">Giá thị trường</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Tiết kiệm</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right border-r border-[var(--border)]">Thành tiền</th>
                {/* GROUP C — action zone */}
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--acc)] uppercase w-28 text-right" style={{ background: 'var(--action-band)' }}>Giá đàm phán</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--acc)] uppercase w-36 text-center" style={{ background: 'var(--action-band)' }}>Trạng thái</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--acc)] uppercase w-28" style={{ background: 'var(--action-band)' }}>Ghi chú</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">Khảo giá</th>
                <th className="py-2.5 px-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {Object.keys(grouped).map(catName => {
                const catItems = grouped[catName];
                const catTotal = catItems.reduce((s: number, i: any) => s + i.totalPrice, 0);
                return (
                  <React.Fragment key={catName}>
                    {/* Category row */}
                    <tr className="bg-[var(--surface2)] border-y border-[var(--border)]">
                      <td colSpan={11} className="py-2 px-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11.5px] text-[var(--acc)] tracking-wide">{catName}</span>
                          <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--text3)]">
                            <span>{catItems.length} mục</span>
                            <span className="text-[var(--text)]">{fmt(catTotal)} đ</span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Item rows */}
                    {catItems.map((item: any) => {
                      const diff = item.marketPrice ? item.unitPrice - item.marketPrice : null;
                      const isOverpriced = diff !== null && diff > 0;
                      const savings = isOverpriced && diff ? diff * item.quantity : 0;
                      const pct = diff && item.marketPrice ? Math.round((diff / item.marketPrice) * 100) : 0;
                      const isUnpriced = !item.marketPrice;
                      const isAgreed = item.status === 'agreed';

                      return (
                        <React.Fragment key={item.id}>
                        <tr
                          className={`border-b border-[var(--border-subtle)] group transition-colors
                            ${isAgreed ? 'bg-[var(--grn-bg)] hover:bg-green-50/70' : 'hover:bg-[var(--surface2)]'}
                            ${isUnpriced ? 'border-l-2 border-l-[var(--ylw)]' : ''}`}
                        >
                          {/* Name — click to toggle history */}
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => setExpandedHistoryId(expandedHistoryId === item.id ? null : item.id)}
                              className="text-left w-full group/name"
                            >
                              <div className="font-semibold text-[var(--text)] leading-snug group-hover/name:text-[var(--acc)] transition-colors">
                                {item.name}
                                <span className="ml-1.5 text-[9px] font-normal text-[var(--text4)] group-hover/name:text-[var(--acc-ring)]">▾ lịch sử</span>
                              </div>
                              {item.note && <div className="text-[10px] text-[var(--text3)] mt-0.5 truncate max-w-[180px]">{item.note}</div>}
                            </button>
                          </td>

                          {/* Brand */}
                          <td className="py-2.5 px-3 text-center">
                            {item.brand
                              ? <span className="inline-block px-1.5 py-0.5 bg-[var(--acc-light)] text-[var(--acc)] rounded text-[10px] font-semibold border border-[var(--acc-ring)]">{item.brand}</span>
                              : <span className="text-[var(--text4)]">—</span>}
                          </td>

                          {/* Unit / Qty — last of Group A */}
                          <td className="py-2.5 px-3 text-center border-r border-[var(--border-subtle)]">
                            <div className="text-[10px] text-[var(--text3)] font-medium">{item.unit}</div>
                            <div className="text-[11px] font-bold text-[var(--blue)]">×{item.quantity}</div>
                          </td>

                          {/* Quoted price */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="font-bold text-[var(--text)]">{fmt(item.unitPrice)}</div>
                            {isOverpriced && <div className="text-[10px] font-bold text-[var(--red)] mt-0.5">+{pct}%</div>}
                          </td>

                          {/* Market price — Price Intelligence Card */}
                          <td className="py-2.5 px-3 text-right">
                            {loadingItems[item.id] ? (
                              <div className="flex justify-end"><Loader2 size={14} className="animate-spin text-[var(--text3)]" /></div>
                            ) : item.marketPrice ? (
                              <div className="text-right">
                                {item.priceRangeLow && item.priceRangeHigh && (
                                  <div className="text-[10px] text-[var(--text3)] mb-0.5 tabular-nums">
                                    {fmt(item.priceRangeLow)} – {fmt(item.priceRangeHigh)}
                                  </div>
                                )}
                                <div className="font-bold text-[var(--text)] tabular-nums">{fmt(item.marketPrice)}</div>
                                <div className="flex items-center justify-end gap-1.5 mt-0.5 flex-wrap">
                                  {item.priceConfidence && (
                                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded leading-none
                                      ${item.priceConfidence === 'high'   ? 'bg-[var(--grn-bg)] text-[var(--grn)]' :
                                        item.priceConfidence === 'medium' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)]' :
                                        'bg-[var(--red-bg)] text-[var(--red)]'}`}>
                                      {item.priceConfidence === 'high' ? '● Cao' : item.priceConfidence === 'medium' ? '● TB' : '● Thấp'}
                                    </span>
                                  )}
                                  {/* Pipeline source badge */}
                                  {item.priceSource && (
                                    item.priceSource.includes('★')
                                      ? <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-[var(--ylw-bg)] text-[var(--ylw)] border border-[var(--ylw-border)] leading-none">
                                          <Database size={8} /> Offline
                                        </span>
                                      : <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-[var(--grn-bg)] text-[var(--grn)] border border-[var(--grn-border)] leading-none">
                                          <Bot size={8} /> AI
                                        </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => fetchMarketPrice(item)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--acc-light)] border border-[var(--acc-ring)] text-[var(--acc)] text-[11.5px] font-semibold hover:bg-[var(--acc)] hover:text-white hover:border-[var(--acc)] transition-colors ml-auto"
                              >
                                {pipelineMode === 'ai'       ? <Bot size={11} />
                                 : pipelineMode === 'fallback' ? <Database size={11} />
                                 : <Search size={11} />}
                                {pipelineMode === 'ai'       ? 'Tra giá AI ✦'
                                 : pipelineMode === 'fallback' ? 'Tra giá Offline'
                                 : 'Tra giá'}
                              </button>
                            )}
                          </td>

                          {/* Savings */}
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--grn)]">
                            {savings > 0 ? fmt(savings) : <span className="text-[var(--text4)]">—</span>}
                          </td>

                          {/* Total — last of Group B */}
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--blue)] border-r border-[var(--border-subtle)]">{fmt(item.totalPrice)}</td>

                          {/* Negotiated price input — Group C */}
                          <td className="py-2.5 px-3" style={{ background: 'var(--action-band)' }}>
                            <input
                              type="text"
                              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-right text-[11px] font-bold text-[var(--text)] focus:border-[var(--acc)] focus:shadow-[0_0_0_2px_var(--acc-ring)] outline-none transition-all"
                              placeholder="Nhập giá..."
                              defaultValue={item.agreedPrice ? fmt(item.agreedPrice) : ''}
                              onBlur={e => {
                                const val = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(val) && val !== item.agreedPrice) handleUpdate(item.id, { agreedPrice: val });
                              }}
                            />
                          </td>

                          {/* Status toggle — Group C */}
                          <td className="py-2.5 px-3" style={{ background: 'var(--action-band)' }}>
                            <StatusToggle
                              value={item.status as StatusKey}
                              onChange={v => handleUpdate(item.id, { status: v })}
                            />
                          </td>

                          {/* Note — Group C */}
                          <td className="py-2.5 px-3" style={{ background: 'var(--action-band)' }}>
                            <input
                              type="text"
                              className="w-full bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--acc)] px-1 py-1 text-[11px] text-[var(--text2)] outline-none transition-colors"
                              placeholder="Ghi chú..."
                              defaultValue={item.note || ''}
                              onBlur={e => { if (e.target.value !== item.note) handleUpdate(item.id, { note: e.target.value }); }}
                            />
                          </td>

                          {/* Search links */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex justify-center gap-1">
                              <a href={searchLink(item.name, item.brand, 'shopee')} target="_blank" rel="noopener" className="w-5 h-5 bg-[#EE4D2D] rounded flex items-center justify-center text-white opacity-40 hover:opacity-100 transition-opacity" title="Shopee">
                                <span className="text-[9px] font-bold">S</span>
                              </a>
                              <a href={searchLink(item.name, item.brand, 'lazada')} target="_blank" rel="noopener" className="w-5 h-5 bg-[#0F136D] rounded flex items-center justify-center text-white opacity-40 hover:opacity-100 transition-opacity" title="Lazada">
                                <span className="text-[9px] font-bold">L</span>
                              </a>
                              <a href={searchLink(item.name, item.brand, 'google')} target="_blank" rel="noopener" className="w-5 h-5 bg-[#4285F4] rounded flex items-center justify-center text-white opacity-40 hover:opacity-100 transition-opacity" title="Google">
                                <Search size={9} />
                              </a>
                            </div>
                          </td>

                          {/* Delete */}
                          <td className="py-2.5 px-2 text-center">
                            {deletingItemId === item.id ? (
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-[10.5px] font-bold text-white bg-[var(--red)] px-2 py-1 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                              >
                                Xóa?
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-[var(--text4)] hover:text-[var(--red)] transition-all p-1.5 rounded-md hover:bg-[var(--red-bg)]"
                                title="Xóa hạng mục"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* History panel — expandable */}
                        {expandedHistoryId === item.id && (
                          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface2)]">
                            <td colSpan={11} className="px-4 py-3">
                              <p className="text-[10.5px] font-bold text-[var(--text3)] uppercase tracking-wide mb-2">Lịch sử thay đổi — {item.name}</p>
                              {item.events && item.events.length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                  {item.events.map((ev: any) => (
                                    <div key={ev.id} className="flex items-center gap-3 text-[12px]">
                                      <span className="text-[var(--text4)] tabular-nums shrink-0 text-[11px]">
                                        {new Date(ev.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <span className="text-[var(--text3)] font-semibold shrink-0">{ev.field}</span>
                                      <span className="text-[var(--text4)]">
                                        {ev.oldValue ? <><span className="line-through">{ev.oldValue}</span> → </> : ''}
                                        <span className="text-[var(--text)] font-medium">{ev.newValue || '(trống)'}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[12px] text-[var(--text4)] italic">Chưa có thay đổi nào được ghi lại.</p>
                              )}
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contribution toast */}
      {contributeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg p-4 flex flex-col gap-2.5 w-72">
          <div>
            <p className="text-[13px] font-bold text-[var(--text)] mb-0.5">✅ Đã chốt hợp đồng!</p>
            <p className="text-[11.5px] text-[var(--text3)] leading-relaxed">
              Đóng góp giá <strong className="text-[var(--text)]">{contributeToast.itemName}</strong> vào cơ sở dữ liệu cộng đồng ẩn danh?
            </p>
          </div>
          <p className="text-[10.5px] text-[var(--text4)]">Dữ liệu hoàn toàn ẩn danh, không liên kết với tên bạn hoặc nhà thầu.</p>
          <div className="flex gap-2 mt-0.5">
            <button
              onClick={() => submitContribution(contributeToast.itemId)}
              className="flex-1 py-1.5 bg-[var(--acc)] text-white text-[12px] font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Đóng góp ẩn danh
            </button>
            <button
              onClick={() => setContributeToast(null)}
              className="px-3 py-1.5 border border-[var(--border)] text-[12px] font-semibold text-[var(--text3)] rounded-md hover:border-[var(--text)] transition-colors"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
