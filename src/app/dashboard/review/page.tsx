'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Trash2, Check } from 'lucide-react';

function cleanFilename(name: string): string {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function ReviewExtractionPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [quotationName, setQuotationName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [fallbackMeta, setFallbackMeta] = useState<{ warning?: string; pipeline?: string } | null>(null);
  const [saveError, setSaveError] = useState('');
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deleteTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored   = sessionStorage.getItem('pendingExtraction');
    const filename = sessionStorage.getItem('pendingFilename');
    const meta     = sessionStorage.getItem('pendingMeta');
    if (stored)   { try { setItems(JSON.parse(stored)); }    catch {} }
    if (filename) setQuotationName(cleanFilename(filename));
    if (meta)     { try { setFallbackMeta(JSON.parse(meta)); } catch {} }
  }, []);

  const handleFieldChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = (Number(newItems[index].quantity) || 0) * (Number(newItems[index].unitPrice) || 0);
    }
    setItems(newItems);
  };

  const requestDelete = (index: number) => {
    setDeletingIdx(index);
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => setDeletingIdx(null), 3000);
  };

  const confirmDelete = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setDeletingIdx(null);
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
  };

  const handleSaveClick = () => {
    if (!confirmingSave) {
      setConfirmingSave(true);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirmingSave(false), 4000);
      return;
    }
    doSave();
  };

  const doSave = async () => {
    setIsSaving(true);
    setConfirmingSave(false);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName || 'Dự án chưa đặt tên',
          quotationName: quotationName || 'Báo giá chưa đặt tên',
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.removeItem('pendingExtraction');
      sessionStorage.removeItem('pendingFilename');
      router.push(`/dashboard/quotations/${data.quotationId}`);
    } catch (err: any) {
      setSaveError('Lỗi khi lưu: ' + err.message);
      setIsSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <p className="text-[var(--text3)] mb-4">Không có dữ liệu trích xuất. Vui lòng quay lại trang chủ để tải file.</p>
        <button onClick={() => router.push('/')} className="mt-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:border-[var(--acc)] transition-colors text-[13px]">
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)]">

      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-[var(--text3)] uppercase tracking-wide">Dự án</label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Nhập tên dự án..."
              className="px-2.5 py-1.5 text-[13px] border border-[var(--border)] rounded-md outline-none focus:border-[var(--acc)] bg-[var(--surface)] w-44 placeholder:text-[var(--text4)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-[var(--text3)] uppercase tracking-wide">Tên báo giá</label>
            <input
              type="text"
              value={quotationName}
              onChange={e => setQuotationName(e.target.value)}
              placeholder="Nhập tên báo giá..."
              className="px-2.5 py-1.5 text-[13px] border border-[var(--border)] rounded-md outline-none focus:border-[var(--acc)] bg-[var(--surface)] w-44 placeholder:text-[var(--text4)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11.5px] font-medium text-[var(--text3)] hidden sm:flex items-center gap-1.5">
            <AlertCircle size={13} className="text-[var(--ylw)]" />
            Kiểm tra dữ liệu AI trước khi lưu
          </span>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-1.5 font-semibold text-[13px] rounded-md transition-all disabled:opacity-50
              ${confirmingSave
                ? 'bg-[var(--grn)] text-white hover:bg-green-600 scale-[1.02]'
                : 'bg-[var(--acc)] text-white hover:opacity-90'}`}
          >
            {confirmingSave ? <><Check size={15} /> Xác nhận lưu</> : <><Save size={15} /> {isSaving ? 'Đang lưu...' : `Lưu ${items.length} hạng mục`}</>}
          </button>
          {saveError && (
            <div className="px-4 py-2 bg-[var(--red-bg)] border-b border-[var(--red-border)] text-[var(--red)] text-[12.5px] font-medium flex items-center justify-between shrink-0">
              <span>{saveError}</span>
              <button onClick={() => setSaveError('')} className="text-[var(--red)] opacity-60 hover:opacity-100 text-lg leading-none ml-3">×</button>
            </div>
          )}
        </div>
      </div>

      {/* Editability hint */}
      {hintVisible && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--acc-light)] border-b border-[var(--acc-ring)] shrink-0">
          <p className="text-[12px] text-[var(--acc)] font-medium">💡 Nhấp vào bất kỳ ô nào để chỉnh sửa dữ liệu AI trước khi lưu.</p>
          <button onClick={() => setHintVisible(false)} className="text-[var(--acc)] hover:opacity-70 text-lg leading-none ml-3">×</button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-[12.5px]">
          <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)]">
            <tr>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-10 text-center">STT</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-40">Phân mục</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase min-w-[200px]">Tên hạng mục</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-24 text-center">Thương hiệu</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-16 text-center">ĐVT</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-16 text-center">SL</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-32 text-right">Đơn giá</th>
              <th className="py-2.5 px-3 font-semibold text-[10.5px] text-[var(--text3)] uppercase w-32 text-right">Thành tiền</th>
              <th className="py-2.5 px-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const isDeleting = deletingIdx === idx;
              return (
                <tr
                  key={idx}
                  className={`border-b border-[var(--border-subtle)] group transition-colors ${isDeleting ? 'bg-[var(--red-bg)]' : 'hover:bg-[var(--surface2)]'}`}
                >
                  <td className="py-2 px-3">
                    <input type="number" value={item.itemNo} onChange={e => handleFieldChange(idx, 'itemNo', Number(e.target.value))} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] rounded text-[var(--text3)]" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="text" value={item.category || ''} onChange={e => handleFieldChange(idx, 'category', e.target.value)} className="w-full bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="text" value={item.name || ''} onChange={e => handleFieldChange(idx, 'name', e.target.value)} className="w-full font-medium bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="text" value={item.brand || ''} onChange={e => handleFieldChange(idx, 'brand', e.target.value)} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="text" value={item.unit || ''} onChange={e => handleFieldChange(idx, 'unit', e.target.value)} className="w-full text-center bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="number" value={item.quantity} onChange={e => handleFieldChange(idx, 'quantity', Number(e.target.value))} className="w-full text-center font-bold text-[var(--blue)] bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="number" value={item.unitPrice} onChange={e => handleFieldChange(idx, 'unitPrice', Number(e.target.value))} className="w-full text-right bg-transparent outline-none border border-transparent focus:border-[var(--border)] focus:bg-[var(--surface)] rounded px-1 py-0.5" />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[var(--text)]">
                    {new Intl.NumberFormat('vi-VN').format(item.totalPrice)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {isDeleting ? (
                      <div className="flex items-center gap-1.5 justify-center">
                        <button onClick={() => confirmDelete(idx)} className="text-[11px] font-bold text-[var(--red)] hover:underline">Xóa</button>
                        <span className="text-[var(--text4)]">·</span>
                        <button onClick={() => setDeletingIdx(null)} className="text-[11px] text-[var(--text3)] hover:underline">Hủy</button>
                      </div>
                    ) : (
                      <button onClick={() => requestDelete(idx)} className="text-[var(--text4)] hover:text-[var(--red)] transition-colors p-1.5 rounded-md hover:bg-[var(--red-bg)]">
                        <Trash2 size={14} />
                      </button>
                    )}
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
