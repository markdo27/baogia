'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer, AlertTriangle, TrendingDown, CheckCircle, Wallet, Search, Loader2, Zap } from 'lucide-react';

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
    try {
      await fetch('/api/items/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) { console.error(e); }
  };

  const fetchMarketPrice = async (item: any) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const res = await fetch('/api/market-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, name: item.name, brand: item.brand, unit: item.unit }),
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
    <div className="flex flex-col gap-5 pt-2 pb-10">

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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Giá cao >20%', value: highPricedItems, sub: 'hạng mục', icon: AlertTriangle, color: 'red' },
          { label: 'Tiết kiệm tiềm năng', value: fmtCompact(potentialSavings), sub: 'nếu đàm phán', icon: TrendingDown, color: 'grn' },
          { label: 'Đã chốt / Tổng', value: `${agreedCount}/${totalItems}`, sub: 'tiến độ đàm phán', icon: CheckCircle, color: 'blue' },
          { label: 'Tổng gốc', value: fmtCompact(originalTotal), sub: 'chưa đàm phán', icon: Wallet, color: 'blue' },
          { label: 'Tổng sau đàm phán', value: fmtCompact(negotiatedTotal), sub: `còn ${totalItems - agreedCount} mục`, icon: Wallet, color: 'purple' },
        ].map(card => (
          <div key={card.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[100px] shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10.5px] font-semibold text-[var(--text3)] uppercase leading-tight max-w-[70%]">{card.label}</span>
              <div className={`w-6 h-6 rounded-md bg-[var(--${card.color}-bg)] flex items-center justify-center text-[var(--${card.color})] shrink-0`}>
                <card.icon size={13} />
              </div>
            </div>
            <div>
              <div className="text-[22px] font-bold text-[var(--text)] leading-none">{card.value}</div>
              <div className="text-[10px] font-medium text-[var(--text3)] mt-1">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

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

          {/* Batch AI pricing */}
          {unpricedCount > 0 && (
            <button
              onClick={fetchAllUnpriced}
              disabled={batchLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--ylw-bg)] border border-[var(--ylw-border)] text-[var(--ylw)] text-[12px] font-semibold hover:bg-[var(--ylw)] hover:text-white transition-colors disabled:opacity-60"
            >
              {batchLoading ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
              Tra giá {unpricedCount} mục chưa có giá
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[720px]">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase">Hạng mục</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">Thương hiệu</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">ĐVT / SL</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Đơn giá báo</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-32 text-right">Giá thị trường</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Tiết kiệm</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Thành tiền</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Giá đàm phán</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-36 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28">Ghi chú</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">Khảo giá</th>
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
                        <tr
                          key={item.id}
                          className={`border-b border-[var(--border-subtle)] group transition-colors
                            ${isAgreed ? 'bg-[var(--grn-bg)] hover:bg-green-50/70' : 'hover:bg-[var(--surface2)]'}
                            ${isUnpriced ? 'border-l-2 border-l-[var(--ylw)]' : ''}`}
                        >
                          {/* Name */}
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[var(--text)] leading-snug">{item.name}</div>
                            {item.note && <div className="text-[10px] text-[var(--text3)] mt-0.5 truncate max-w-[180px]">{item.note}</div>}
                          </td>

                          {/* Brand */}
                          <td className="py-2.5 px-3 text-center">
                            {item.brand
                              ? <span className="inline-block px-1.5 py-0.5 bg-[var(--acc-light)] text-[var(--acc)] rounded text-[10px] font-semibold border border-[var(--acc-ring)]">{item.brand}</span>
                              : <span className="text-[var(--text4)]">—</span>}
                          </td>

                          {/* Unit / Qty */}
                          <td className="py-2.5 px-3 text-center">
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
                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                  {item.priceConfidence && (
                                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded leading-none
                                      ${item.priceConfidence === 'high' ? 'bg-[var(--grn-bg)] text-[var(--grn)]' :
                                        item.priceConfidence === 'medium' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)]' :
                                        'bg-[var(--red-bg)] text-[var(--red)]'}`}>
                                      {item.priceConfidence === 'high' ? '● Cao' : item.priceConfidence === 'medium' ? '● TB' : '● Thấp'}
                                    </span>
                                  )}
                                  {item.priceSource && (
                                    <span className="text-[9px] text-[var(--text4)] font-medium">{item.priceSource}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => fetchMarketPrice(item)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--acc-light)] border border-[var(--acc-ring)] text-[var(--acc)] text-[11.5px] font-semibold hover:bg-[var(--acc)] hover:text-white hover:border-[var(--acc)] transition-colors ml-auto"
                              >
                                <Search size={11} />
                                Tra giá AI
                              </button>
                            )}
                          </td>

                          {/* Savings */}
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--grn)]">
                            {savings > 0 ? fmt(savings) : <span className="text-[var(--text4)]">—</span>}
                          </td>

                          {/* Total */}
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--blue)]">{fmt(item.totalPrice)}</td>

                          {/* Negotiated price input */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-right text-[11px] font-bold text-[var(--text)] focus:border-[var(--acc)] outline-none"
                              placeholder="Nhập giá..."
                              defaultValue={item.agreedPrice ? fmt(item.agreedPrice) : ''}
                              onBlur={e => {
                                const val = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(val) && val !== item.agreedPrice) handleUpdate(item.id, { agreedPrice: val });
                              }}
                            />
                          </td>

                          {/* Status toggle */}
                          <td className="py-2.5 px-3">
                            <StatusToggle
                              value={item.status as StatusKey}
                              onChange={v => handleUpdate(item.id, { status: v })}
                            />
                          </td>

                          {/* Note */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              className="w-full bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--acc)] px-1 py-1 text-[11px] text-[var(--text2)] outline-none transition-colors"
                              placeholder="Ghi chú..."
                              defaultValue={item.note || ''}
                              onBlur={e => { if (e.target.value !== item.note) handleUpdate(item.id, { note: e.target.value }); }}
                            />
                          </td>

                          {/* Search links — always visible at 40% */}
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
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
