'use client';

import { UploadCloud, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

const STAGES = [
  { until: 30, msg: 'Đang đọc cấu trúc file...' },
  { until: 70, msg: 'AI đang nhận diện hạng mục...' },
  { until: 96, msg: 'Đang hoàn thiện và kiểm tra...' },
];

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    progressRef.current = 0;
    setUploadStatus(STAGES[0].msg);

    const progressInterval = setInterval(() => {
      const prev = progressRef.current;
      const next = prev >= 95 ? 95 : prev + (prev < 50 ? 5 : prev < 80 ? 2 : 0.5);
      progressRef.current = next;
      setProgress(next);
      const stage = STAGES.find(s => next < s.until) ?? STAGES[STAGES.length - 1];
      setUploadStatus(stage.msg);
    }, 1000);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to extract data');

      clearInterval(progressInterval);
      setProgress(100);
      setUploadStatus('Trích xuất thành công! Đang chuyển hướng...');

      sessionStorage.setItem('pendingExtraction', JSON.stringify(result.data));
      sessionStorage.setItem('pendingFilename', file.name);

      setTimeout(() => router.push('/dashboard/review'), 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      alert('Lỗi: ' + err.message);
      setIsUploading(false);
      setUploadStatus('');
      setProgress(0);
      progressRef.current = 0;
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="flex-1 flex flex-col pt-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--text)] mb-1.5">Tải lên bảng báo giá</h1>
        <p className="text-[var(--text3)] text-[13.5px] leading-relaxed">
          Hệ thống sẽ đọc file của bạn, trích xuất toàn bộ hạng mục và đối chiếu giá thị trường bằng AI — không cần nhập tay.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`w-full bg-[var(--surface)] border rounded-xl transition-all duration-150
          ${isDragActive ? 'border-[var(--acc)] bg-[var(--acc-light)] shadow-[0_0_0_4px_var(--acc-ring)]'
            : 'border-[var(--border)] hover:border-[var(--acc)] hover:shadow-[0_0_0_3px_var(--acc-ring)]'}
          ${isUploading ? 'opacity-80 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-start p-7 gap-4">
            <div className="flex items-center gap-3">
              <Loader2 size={18} className="text-[var(--acc)] animate-spin shrink-0" />
              <p className="text-[13.5px] text-[var(--text)] font-medium">{uploadStatus}</p>
            </div>
            <div className="w-full">
              <div className="w-full h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[var(--acc)] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11.5px] text-[var(--text3)]">
                <span>Thường mất 30–90 giây với file PDF</span>
                <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface2)] text-[var(--text3)] flex items-center justify-center mb-4">
              <UploadCloud size={22} strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-[var(--text)] mb-1">
              {isDragActive ? 'Thả file vào đây' : 'Chọn hoặc kéo thả file'}
            </p>
            <p className="text-[12.5px] text-[var(--text3)] mb-6">
              hoặc{' '}
              <span className="text-[var(--acc)] underline underline-offset-2 font-medium">nhấp để duyệt file</span>
            </p>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-2.5 py-1 rounded-md">
                <FileText size={12} className="text-red-400" />
                <span className="text-[11.5px] text-[var(--text3)]">.PDF</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-2.5 py-1 rounded-md">
                <FileSpreadsheet size={12} className="text-emerald-500" />
                <span className="text-[11.5px] text-[var(--text3)]">.XLSX · .CSV</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-step outcome preview */}
      {!isUploading && (
        <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--border-subtle)] pt-7">
          {[
            { step: '01', title: 'AI đọc & trích xuất', desc: 'Mọi hạng mục, đơn giá và thương hiệu được nhận diện tự động.' },
            { step: '02', title: 'So sánh giá thị trường', desc: 'AI tra giá thực tế từ Shopee, Lazada và các nguồn trực tuyến.' },
            { step: '03', title: 'Đàm phán & báo cáo', desc: 'Ghi nhận giá đã chốt, theo dõi tiết kiệm và xuất báo cáo.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <span className="text-[11px] font-bold text-[var(--acc)] tabular-nums mt-0.5 shrink-0">{item.step}</span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text)] mb-1 leading-snug">{item.title}</p>
                <p className="text-[12px] text-[var(--text3)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-[11.5px] text-[var(--text4)]">
        Dữ liệu được lưu trữ an toàn. Không chia sẻ với bên thứ ba.
      </p>
    </div>
  );
}
