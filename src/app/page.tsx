'use client';

import { UploadCloud, FileText, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Đang tải file lên...');

    setProgress(0);

    // Start a simulated progress bar that creeps up to 95%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        // Slow down as it gets higher
        const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
        return prev + increment;
      });
    }, 1000);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Đang đọc tài liệu và phân tích bằng AI...');
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract data');
      }

      clearInterval(progressInterval);
      setProgress(100);
      setUploadStatus('Trích xuất thành công! Đang chuyển hướng...');
      
      // Store extracted data in sessionStorage for the next screen (Extraction Review UI)
      sessionStorage.setItem('pendingExtraction', JSON.stringify(result.data));
      
      // Navigate to review page (we will build this next)
      setTimeout(() => {
        router.push('/dashboard/review');
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      alert('Lỗi: ' + err.message);
      setIsUploading(false);
      setUploadStatus('');
      setProgress(0);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isUploading
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
        className={`w-full bg-[var(--surface)] border border-dashed rounded-xl transition-all duration-150
          ${isDragActive ? 'border-[var(--acc)] bg-[var(--acc-light)] shadow-[0_0_0_4px_var(--acc-ring)]' : 'border-[var(--border)] hover:border-[var(--acc)] hover:shadow-[0_0_0_3px_var(--acc-ring)]'} 
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
                <span>AI đang phân tích nội dung...</span>
                <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface2)] text-[var(--text3)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud size={22} strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-[var(--text)] mb-1">
              {isDragActive ? 'Thả file vào đây' : 'Chọn hoặc kéo thả file'}
            </p>
            <p className="text-[12.5px] text-[var(--text3)] mb-6">PDF, Excel, CSV — tối đa 1 file</p>
            <div className="flex items-center gap-2.5 text-[var(--text4)] text-[11.5px]">
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-2.5 py-1 rounded-md">
                <FileText size={12} className="text-red-400" />
                <span className="text-[var(--text3)]">.PDF</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-2.5 py-1 rounded-md">
                <FileSpreadsheet size={12} className="text-emerald-500" />
                <span className="text-[var(--text3)]">.XLSX &nbsp;&middot;&nbsp; .CSV</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-[11.5px] text-[var(--text4)] leading-relaxed">
        Dữ liệu được lưu trữ an toàn trên hệ thống. Không chia sẻ với bên thứ ba.
      </p>
    </div>
  );
}
