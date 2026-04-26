'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function QuotationTable({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

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
          unit: item.unit
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update local state
      setItems(prev => prev.map(i => i.id === item.id ? data.item : i));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tìm giá: " + err);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  const displayedItems = categoryFilter 
    ? items.filter(item => item.category && item.category.includes(categoryFilter))
    : items;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)]">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-[12.5px]">
          <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)] shadow-sm">
            <tr>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-12 text-center">STT</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase">Tên công việc / Hạng mục</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-24 text-center">Thương hiệu</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-16 text-center">ĐVT</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-20 text-center">SL</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-32 text-right">Đơn giá báo</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-32 text-right">Thành tiền</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-40 text-right">Giá thị trường (AI)</th>
              <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-24 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item, idx) => {
              const diff = item.marketPrice ? item.unitPrice - item.marketPrice : null;
              const isOverpriced = diff && diff > 0;
              
              return (
                <tr key={item.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)] group transition-colors">
                  <td className="py-3 px-4 text-center text-[var(--text4)] font-medium">{item.itemNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[var(--text)]">{item.name}</div>
                    {item.note && <div className="text-[11px] text-[var(--text3)] mt-0.5">{item.note}</div>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.brand ? (
                      <span className="inline-block px-2 py-0.5 bg-[var(--acc-light)] text-[var(--acc)] rounded-full text-[11px] font-semibold border border-[var(--acc-ring)]">
                        {item.brand}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3 px-4 text-center text-[var(--text3)]">{item.unit}</td>
                  <td className="py-3 px-4 text-center font-bold text-[var(--blue)]">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatMoney(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--acc)]">{formatMoney(item.totalPrice)}</td>
                  
                  {/* AI Market Price Column */}
                  <td className="py-3 px-4 text-right">
                    {loadingItems[item.id] ? (
                      <div className="flex items-center justify-end gap-2 text-[var(--text3)]">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-[11px]">Đang tìm...</span>
                      </div>
                    ) : item.marketPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-[var(--text)]">{formatMoney(item.marketPrice)}</span>
                        {isOverpriced && (
                          <span className="text-[11px] text-[var(--red)] font-medium mt-0.5">
                            Cao hơn {formatMoney(diff!)}
                          </span>
                        )}
                        {!isOverpriced && (
                          <span className="text-[11px] text-[var(--grn)] font-medium mt-0.5">Giá hợp lý</span>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => fetchMarketPrice(item)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[11px] font-medium text-[var(--text2)] hover:border-[var(--acc)] hover:text-[var(--acc)] shadow-sm"
                      >
                        <Search size={12} /> Tra giá AI
                      </button>
                    )}
                  </td>
                  
                  <td className="py-3 px-4 text-center">
                    <select 
                      defaultValue={item.status} 
                      className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[11px] font-medium text-[var(--text2)] outline-none"
                    >
                      <option value="pending">Chưa chốt</option>
                      <option value="negotiating">Đang đàm phán</option>
                      <option value="agreed">Đã đồng ý</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
