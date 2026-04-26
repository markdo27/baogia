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
    <div className="flex-1 flex flex-col items-center justify-center pt-10">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-3">Tải lên Bảng báo giá</h1>
        <p className="text-[var(--text3)] text-sm">
          Hệ thống sẽ tự động trích xuất dữ liệu từ file PDF hoặc Excel và tiến hành so sánh giá thị trường bằng AI.
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`w-full max-w-2xl bg-[var(--surface)] border-2 border-dashed rounded-2xl p-12 text-center transition-colors 
          ${isDragActive ? 'border-[var(--acc)] bg-[var(--acc-light)]' : 'border-[var(--border)] hover:border-[var(--acc)]'} 
          ${isUploading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer group'}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-6 w-full max-w-md mx-auto">
            <Loader2 size={36} className="text-[var(--acc)] animate-spin mb-6" />
            <p className="text-[var(--text)] font-medium mb-4">{uploadStatus}</p>
            
            <div className="w-full h-3 bg-[var(--surface2)] rounded-full overflow-hidden mb-2 relative">
              <div 
                className="h-full bg-[var(--acc)] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect inside progress bar */}
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite] w-full" style={{ transform: 'translateX(-100%)' }}></div>
              </div>
            </div>
            <div className="flex justify-between w-full text-xs text-[var(--text3)] font-medium">
              <span>Đang xử lý...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[var(--acc-light)] text-[var(--acc)] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)] mb-2">
              {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file vào đây'}
            </h3>
            <p className="text-[var(--text3)] text-xs mb-6">hoặc click để chọn file từ máy tính</p>
            
            <div className="flex items-center justify-center gap-4 text-[var(--text4)] text-xs">
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-3 py-1.5 rounded-md">
                <FileText size={14} className="text-red-400" />
                <span>.PDF</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--surface2)] px-3 py-1.5 rounded-md">
                <FileSpreadsheet size={14} className="text-green-500" />
                <span>.XLSX, .CSV</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
