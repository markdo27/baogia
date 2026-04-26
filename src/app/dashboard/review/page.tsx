'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Trash2 } from 'lucide-react';

export default function ReviewExtractionPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [quotationName, setQuotationName] = useState('Báo giá nhà thầu A');
  const [projectName, setProjectName] = useState('Dự án nhà ở');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load from sessionStorage
    const stored = sessionStorage.getItem('pendingExtraction');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored extraction", e);
      }
    }
  }, []);

  const handleFieldChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto calculate total if qty or price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Number(newItems[index].quantity) || 0;
      const p = Number(newItems[index].unitPrice) || 0;
      newItems[index].totalPrice = q * p;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          quotationName,
          items
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Clear pending
      sessionStorage.removeItem('pendingExtraction');
      
      // Redirect to the actual dashboard to view this quotation
      router.push(`/dashboard/quotations/${data.quotationId}`);

    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi lưu: " + err.message);
      setIsSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <p className="text-[var(--text3)]">Không có dữ liệu trích xuất. Vui lòng quay lại trang chủ để tải file.</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:border-[var(--acc)] transition-colors text-[13px]">
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      
      {/* Header bar */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[11.5px] font-semibold text-[var(--text3)] uppercase">Dự án:</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="px-2.5 py-1.5 text-[13px] border border-[var(--border)] rounded-md outline-none focus:border-[var(--acc)] bg-[var(--surface)] w-48" 
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11.5px] font-semibold text-[var(--text3)] uppercase">Tên báo giá:</label>
            <input 
              type="text" 
              value={quotationName}
              onChange={(e) => setQuotationName(e.target.value)}
              className="px-2.5 py-1.5 text-[13px] border border-[var(--border)] rounded-md outline-none focus:border-[var(--acc)] bg-[var(--surface)] w-48" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-[var(--text3)] flex items-center gap-1.5">
            <AlertCircle size={14} className="text-[var(--ylw)]" />
            Vui lòng kiểm tra lại dữ liệu AI trích xuất trước khi lưu
          </span>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-[var(--acc)] text-white font-semibold text-[13px] rounded-md hover:bg-[#4F46E5] transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-[12.5px]">
          <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
            <tr>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-12 text-center">STT</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-48">Phân mục (Category)</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase min-w-[200px]">Tên công việc / Hạng mục</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-20 text-center">Thương hiệu</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-16 text-center">ĐVT</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-20 text-center">SL</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-32 text-right">Đơn giá</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-32 text-right">Thành tiền</th>
              <th className="py-2.5 px-3 font-semibold text-[11px] text-[var(--text3)] uppercase w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)]">
                <td className="py-2 px-3">
                  <input type="number" value={item.itemNo} onChange={(e) => handleFieldChange(idx, 'itemNo', Number(e.target.value))} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded" />
                </td>
                <td className="py-2 px-3">
                  <input type="text" value={item.category || ''} onChange={(e) => handleFieldChange(idx, 'category', e.target.value)} className="w-full bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3">
                  <input type="text" value={item.name || ''} onChange={(e) => handleFieldChange(idx, 'name', e.target.value)} className="w-full font-medium bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3">
                  <input type="text" value={item.brand || ''} onChange={(e) => handleFieldChange(idx, 'brand', e.target.value)} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3">
                  <input type="text" value={item.unit || ''} onChange={(e) => handleFieldChange(idx, 'unit', e.target.value)} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3">
                  <input type="number" value={item.quantity} onChange={(e) => handleFieldChange(idx, 'quantity', Number(e.target.value))} className="w-full text-center font-bold text-[var(--blue)] bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3">
                  <input type="number" value={item.unitPrice} onChange={(e) => handleFieldChange(idx, 'unitPrice', Number(e.target.value))} className="w-full text-right bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded px-1" />
                </td>
                <td className="py-2 px-3 text-right font-bold text-[var(--text)]">
                  {new Intl.NumberFormat('vi-VN').format(item.totalPrice)}
                </td>
                <td className="py-2 px-3 text-center">
                  <button onClick={() => removeItem(idx)} className="text-[var(--text3)] hover:text-[var(--red)] transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
