'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer, AlertTriangle, TrendingDown, CheckCircle, Wallet, Search, Loader2, Link as LinkIcon } from 'lucide-react';

export default function QuotationDashboard({ quotation }: { quotation: any }) {
  const [items, setItems] = useState<any[]>(quotation.items);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  // Metrics Calculation
  const totalItems = items.length;
  
  const highPricedItems = items.filter(i => {
    if (!i.marketPrice) return false;
    const diff = i.unitPrice - i.marketPrice;
    return diff > 0 && (diff / i.marketPrice) > 0.2;
  }).length;
  
  const potentialSavings = items.reduce((acc, i) => {
    if (!i.marketPrice) return acc;
    const diff = i.unitPrice - i.marketPrice;
    return diff > 0 ? acc + (diff * i.quantity) : acc;
  }, 0);
  
  const agreedCount = items.filter(i => i.status === 'agreed').length;
  const originalTotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  
  const negotiatedTotal = items.reduce((acc, i) => {
    return acc + (i.agreedPrice !== null ? i.agreedPrice : i.totalPrice);
  }, 0);

  // Filtering & Grouping
  const displayedItems = items.filter(i => {
    if (categoryFilter && (!i.category || !i.category.includes(categoryFilter))) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });

  const groupedItems = displayedItems.reduce((acc, item) => {
    const cat = item.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Formatting
  const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
  const formatCompact = (val: number) => {
    if (val >= 1e9) return (val / 1e9).toFixed(2) + ' tỷ';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + ' tr';
    return formatMoney(val);
  };

  // Handlers
  const handleUpdate = async (id: string, updates: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    try {
      await fetch('/api/items/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMarketPrice = async (item: any) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const res = await fetch('/api/market-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, name: item.name, brand: item.brand, unit: item.unit })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(prev => prev.map(i => i.id === item.id ? data.item : i));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tìm giá: " + err);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleSearchLink = (name: string, brand: string, platform: string) => {
    const query = encodeURIComponent(`${name} ${brand || ''}`);
    if (platform === 'shopee') return `https://shopee.vn/search?keyword=${query}`;
    if (platform === 'lazada') return `https://www.lazada.vn/catalog/?q=${query}`;
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--text)] tracking-tight">Bảng Báo Giá Chi Tiết</h1>
          <p className="text-[13px] text-[var(--text3)] mt-1">So sánh đơn giá báo với giá thị trường • {totalItems} hạng mục</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded text-[12px] font-semibold text-[var(--text2)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors">
          <Printer size={14} /> Xuất báo cáo
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[var(--text3)] uppercase">Hạng mục giá cao</span>
            <div className="w-6 h-6 rounded-md bg-[var(--red-bg)] flex items-center justify-center text-[var(--red)]"><AlertTriangle size={14} /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text)]">{highPricedItems}</div>
            <div className="text-[10.5px] font-medium text-[var(--red)] mt-1 tracking-wide">Kê cao hơn thị trường {">"}20%</div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[var(--text3)] uppercase">Tiết kiệm tiềm năng</span>
            <div className="w-6 h-6 rounded-md bg-[var(--grn-bg)] flex items-center justify-center text-[var(--grn)]"><TrendingDown size={14} /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--grn)]">{formatCompact(potentialSavings)}</div>
            <div className="text-[10.5px] font-medium text-[var(--grn)] mt-1 tracking-wide">Nếu đàm phán về giá thị trường</div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[var(--text3)] uppercase">Đã chốt / Tổng</span>
            <div className="w-6 h-6 rounded-md bg-[var(--blue-bg)] flex items-center justify-center text-[var(--blue)]"><CheckCircle size={14} /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text)]">{agreedCount} <span className="text-lg text-[var(--text4)]">/ {totalItems}</span></div>
            <div className="text-[10.5px] font-medium text-[var(--text3)] mt-1 tracking-wide">Tiến độ đàm phán</div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[var(--text3)] uppercase">Tổng trước đàm phán</span>
            <div className="w-6 h-6 rounded-md bg-[var(--blue-bg)] flex items-center justify-center text-[var(--blue)]"><Wallet size={14} /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text)]">{formatCompact(originalTotal)}</div>
            <div className="text-[10.5px] font-medium text-[var(--text3)] mt-1 tracking-wide">Tổng giá báo gốc chưa đàm phán</div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[var(--text3)] uppercase">Tổng sau đàm phán</span>
            <div className="w-6 h-6 rounded-md bg-[var(--purple-bg)] flex items-center justify-center text-[var(--purple)]"><Wallet size={14} /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text)]">{formatCompact(negotiatedTotal)}</div>
            <div className="text-[10.5px] font-medium text-[var(--text3)] mt-1 tracking-wide">Còn {totalItems - agreedCount} mục chưa chốt</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 p-3 border-b border-[var(--border)] bg-[var(--surface)]">
          <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${statusFilter === 'all' ? 'bg-[var(--acc-light)] text-[var(--acc)] border border-[var(--acc-ring)]' : 'text-[var(--text3)] hover:bg-[var(--surface2)]'}`}>
            Tất cả <span className="bg-[var(--border-subtle)] text-[var(--text3)] px-1.5 py-0.5 rounded text-[10px]">{totalItems}</span>
          </button>
          <button onClick={() => setStatusFilter('agreed')} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${statusFilter === 'agreed' ? 'bg-[var(--grn-bg)] text-[var(--grn)] border border-[var(--grn-border)]' : 'text-[var(--text3)] hover:bg-[var(--surface2)]'}`}>
            <div className="w-2 h-2 rounded-full bg-[var(--grn)]"></div> Đã đồng ý <span className="bg-[var(--border-subtle)] text-[var(--text3)] px-1.5 py-0.5 rounded text-[10px]">{agreedCount}</span>
          </button>
          <button onClick={() => setStatusFilter('negotiating')} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${statusFilter === 'negotiating' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)] border border-[var(--ylw-border)]' : 'text-[var(--text3)] hover:bg-[var(--surface2)]'}`}>
            <div className="w-2 h-2 rounded-full bg-[var(--ylw)]"></div> Đang đàm phán <span className="bg-[var(--border-subtle)] text-[var(--text3)] px-1.5 py-0.5 rounded text-[10px]">{items.filter(i => i.status === 'negotiating').length}</span>
          </button>
          <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${statusFilter === 'pending' ? 'bg-[var(--border-subtle)] text-[var(--text2)] border border-[var(--border)]' : 'text-[var(--text3)] hover:bg-[var(--surface2)]'}`}>
            <div className="w-2 h-2 rounded-full bg-[var(--text4)]"></div> Chưa chốt <span className="bg-[var(--border-subtle)] text-[var(--text3)] px-1.5 py-0.5 rounded text-[10px]">{items.filter(i => i.status === 'pending').length}</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[800px]">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-10 text-center">#</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase">Hạng mục</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-20 text-center">Thương hiệu</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-16 text-center">ĐVT / SL</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Đơn giá báo</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Giá thị trường (AI)</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-24 text-right">Tiết kiệm</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Thành tiền</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-28 text-right">Giá đàm phán</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-32 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-32 text-center">Ghi chú</th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-[var(--text3)] uppercase w-16 text-center">Khảo giá</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedItems).map(catName => {
                const catItems = groupedItems[catName];
                const catTotal = catItems.reduce((sum, i) => sum + i.totalPrice, 0);

                return (
                  <React.Fragment key={catName}>
                    {/* Category Header */}
                    <tr className="bg-[var(--surface2)] border-b border-[var(--border)]">
                      <td colSpan={12} className="py-2 px-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[12px] text-[var(--acc)] tracking-wide">{catName}</span>
                          <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--text3)]">
                            <span>{catItems.length} mục</span>
                            <span className="text-[var(--text)]">{formatMoney(catTotal)} đ</span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Items */}
                    {catItems.map((item) => {
                      const diff = item.marketPrice ? item.unitPrice - item.marketPrice : null;
                      const isOverpriced = diff && diff > 0;
                      const savings = (isOverpriced && diff) ? diff * item.quantity : 0;
                      const pct = diff ? Math.round((diff / item.marketPrice!) * 100) : 0;

                      return (
                        <tr key={item.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)] group transition-colors">
                          <td className="py-2.5 px-3 text-center text-[var(--text4)] font-medium text-[11px]">{item.itemNo}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[var(--text)] text-[12px] leading-snug">{item.name}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {item.brand ? <span className="inline-block px-1.5 py-0.5 bg-[var(--acc-light)] text-[var(--acc)] rounded text-[10px] font-semibold border border-[var(--acc-ring)]">{item.brand}</span> : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="text-[10px] text-[var(--text3)] font-medium">{item.unit}</div>
                            <div className="text-[11px] font-bold text-[var(--blue)]">x{item.quantity}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="font-bold text-[var(--text)]">{formatMoney(item.unitPrice)}</div>
                            {isOverpriced && <div className="text-[10px] font-bold text-[var(--red)] mt-0.5">+{pct}%</div>}
                          </td>
                          
                          <td className="py-2.5 px-3 text-right">
                            {loadingItems[item.id] ? (
                              <div className="flex justify-end"><Loader2 size={14} className="animate-spin text-[var(--text3)]" /></div>
                            ) : item.marketPrice ? (
                              <div>
                                <div className="font-bold text-[var(--text)]">{formatMoney(item.marketPrice)}</div>
                                <div className="text-[9px] font-medium text-[var(--text3)] uppercase tracking-wide mt-0.5">Thị trường</div>
                              </div>
                            ) : (
                              <button onClick={() => fetchMarketPrice(item)} className="text-[10px] font-semibold text-[var(--acc)] bg-[var(--acc-light)] px-2 py-1 rounded hover:bg-[var(--acc)] hover:text-white transition-colors">Tra AI</button>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-right font-bold text-[var(--grn)]">
                            {savings > 0 ? formatMoney(savings) : '-'}
                          </td>
                          
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--blue)]">
                            {formatMoney(item.totalPrice)}
                          </td>

                          <td className="py-2.5 px-3">
                            <input 
                              type="text" 
                              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-right text-[11px] font-bold text-[var(--text)] focus:border-[var(--acc)] outline-none" 
                              placeholder="Nhập giá..."
                              defaultValue={item.agreedPrice ? formatMoney(item.agreedPrice) : ''}
                              onBlur={(e) => {
                                const val = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(val) && val !== item.agreedPrice) handleUpdate(item.id, { agreedPrice: val });
                              }}
                            />
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <select 
                              value={item.status}
                              onChange={(e) => handleUpdate(item.id, { status: e.target.value })}
                              className={`w-full border rounded px-1.5 py-1 text-[11px] font-semibold outline-none appearance-none cursor-pointer
                                ${item.status === 'agreed' ? 'bg-[var(--grn-bg)] text-[var(--grn)] border-[var(--grn-border)]' : 
                                  item.status === 'negotiating' ? 'bg-[var(--ylw-bg)] text-[var(--ylw)] border-[var(--ylw-border)]' : 
                                  'bg-[var(--surface)] text-[var(--text2)] border-[var(--border)]'}`}
                            >
                              <option value="pending">⏳ Chưa chốt</option>
                              <option value="negotiating">💬 Đang đàm phán</option>
                              <option value="agreed">✅ Đã đồng ý</option>
                            </select>
                          </td>

                          <td className="py-2.5 px-3">
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--acc)] px-1 py-1 text-[11px] text-[var(--text2)] outline-none transition-colors" 
                              placeholder="Ghi chú..."
                              defaultValue={item.note || ''}
                              onBlur={(e) => {
                                if (e.target.value !== item.note) handleUpdate(item.id, { note: e.target.value });
                              }}
                            />
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a href={handleSearchLink(item.name, item.brand, 'shopee')} target="_blank" className="w-5 h-5 bg-[#EE4D2D] rounded flex items-center justify-center text-white" title="Tìm trên Shopee"><span className="text-[10px] font-bold">S</span></a>
                              <a href={handleSearchLink(item.name, item.brand, 'lazada')} target="_blank" className="w-5 h-5 bg-[#0F136D] rounded flex items-center justify-center text-white" title="Tìm trên Lazada"><span className="text-[10px] font-bold">L</span></a>
                              <a href={handleSearchLink(item.name, item.brand, 'google')} target="_blank" className="w-5 h-5 bg-[#4285F4] rounded flex items-center justify-center text-white" title="Tìm trên Google"><Search size={10} /></a>
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
