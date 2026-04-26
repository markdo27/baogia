'use client';

import { UploadCloud, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { usePipelineMode } from '@/components/layout/PipelineToggle';

const SEGMENTS = [
  { label: 'Đọc file',      from: 0,  to: 33 },
  { label: 'AI phân tích',  from: 33, to: 66 },
  { label: 'Hoàn thiện',    from: 66, to: 100 },
];

function SegmentedProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-1.5">
        {SEGMENTS.map((seg, i) => {
          const segProgress = Math.min(100, Math.max(0, ((progress - seg.from) / (seg.to - seg.from)) * 100));
          const isActive = progress >= seg.from && progress < seg.to;
          const isDone   = progress >= seg.to;
          return (
            <div key={i} className="flex-1 flex flex-col gap-1.5">
              <div className="h-1 bg-[var(--surface2)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${segProgress}%`,
                    background: isDone ? 'var(--grn)' : 'var(--acc)',
                  }}
                />
              </div>
              <span className={`text-[10.5px] font-semibold transition-colors ${
                isDone   ? 'text-[var(--grn)]' :
                isActive ? 'text-[var(--acc)]' :
                           'text-[var(--text4)]'
              }`}>
                {isDone ? '✓ ' : ''}{seg.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] text-[var(--text3)]">
        <span>Thường mất 30–90 giây với file PDF</span>
        <span className="font-semibold tabular-nums text-[var(--text)]">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [pipelineMode] = usePipelineMode();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    progressRef.current = 0;
    setUploadStatus(SEGMENTS[0].label);

    const progressInterval = setInterval(() => {
      const prev = progressRef.current;
      const next = prev >= 95 ? 95 : prev + (prev < 50 ? 5 : prev < 80 ? 2 : 0.5);
      progressRef.current = next;
      setProgress(next);
      const seg = SEGMENTS.find(s => next >= s.from && next < s.to);
      if (seg) setUploadStatus(seg.label);
    }, 1000);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('forceMode', pipelineMode);

    try {
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to extract data');

      clearInterval(progressInterval);
      setProgress(100);
      setUploadStatus('Trích xuất thành công!');

      sessionStorage.setItem('pendingExtraction', JSON.stringify(result.data));
      sessionStorage.setItem('pendingFilename', file.name);
      if (result._meta) sessionStorage.setItem('pendingMeta', JSON.stringify(result._meta));

      setTimeout(() => router.push('/dashboard/review'), 600);
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

      {/* — Value first — */}
      <div className="mb-7">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--text)] mb-1">Kiểm toán báo giá bằng AI</h1>
        <p className="text-[13.5px] text-[var(--text3)] leading-relaxed mb-6">
          Tải lên file báo giá — AI tự động trích xuất, đối chiếu giá thị trường và tính toán tiết kiệm tiềm năng.
        </p>

        {/* 3-step flow — value before action */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '01', title: 'AI đọc & trích xuất', desc: 'Mọi hạng mục, đơn giá và thương hiệu được nhận diện tự động.' },
            { step: '02', title: 'So sánh giá thị trường', desc: 'AI tra giá thực tế từ Shopee, Lazada và các nguồn trực tuyến.' },
            { step: '03', title: 'Đàm phán & báo cáo', desc: 'Ghi nhận giá đã chốt, theo dõi tiết kiệm và xuất báo cáo.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <span className="text-[11px] font-bold text-[var(--acc)] tabular-nums mt-0.5 shrink-0">{item.step}</span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text)] mb-0.5 leading-snug">{item.title}</p>
                <p className="text-[11.5px] text-[var(--text3)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* — Dropzone — action after value — */}
      <div
        {...getRootProps()}
        className={`w-full bg-[var(--surface)] border rounded-xl transition-all duration-150
          ${isDragActive
            ? 'border-[var(--acc)] bg-[var(--acc-light)] shadow-[0_0_0_4px_var(--acc-ring)]'
            : 'border-[var(--border)] hover:border-[var(--acc)] hover:shadow-[0_0_0_3px_var(--acc-ring)]'}
          ${isUploading ? 'opacity-90 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-start p-7 gap-5">
            <div className="flex items-center gap-3">
              <Loader2 size={16} className="text-[var(--acc)] animate-spin shrink-0" />
              <p className="text-[13px] text-[var(--text)] font-semibold">{uploadStatus}</p>
            </div>
            <SegmentedProgress progress={progress} />
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

            {/* Active pipeline indicator */}
            <div className={`mt-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold
              ${pipelineMode === 'fallback'
                ? 'bg-[var(--ylw-bg)] border-[var(--ylw-border)] text-[var(--ylw)]'
                : 'bg-[var(--grn-bg)] border-[var(--grn-border)] text-[var(--grn)]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pipelineMode === 'fallback' ? 'bg-[var(--ylw)]' : 'bg-[var(--grn)] animate-pulse'}`} />
              {pipelineMode === 'ai'       ? 'Sẽ dùng AI để trích xuất'
               : pipelineMode === 'fallback' ? 'Sẽ dùng trích xuất truyền thống (Offline)'
               : 'AI với dự phòng tự động'}
            </div>
          </div>
        )}
      </div>

      <p className="mt-5 text-[11.5px] text-[var(--text4)]">
        Dữ liệu được lưu trữ an toàn. Không chia sẻ với bên thứ ba.
      </p>
    </div>
  );
}
