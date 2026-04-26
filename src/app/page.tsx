'use client';

import { UploadCloud, FileText, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Đang tải file lên...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Đang dùng AI trích xuất dữ liệu...');
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract data');
      }

      setUploadStatus('Trích xuất thành công! Đang chuyển hướng...');
      
      // Store extracted data in sessionStorage for the next screen (Extraction Review UI)
      sessionStorage.setItem('pendingExtraction', JSON.stringify(result.data));
      
      // Navigate to review page (we will build this next)
      router.push('/dashboard/review');

    } catch (err: any) {
      console.error(err);
      alert('Lỗi: ' + err.message);
      setIsUploading(false);
      setUploadStatus('');
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
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 size={36} className="text-[var(--acc)] animate-spin mb-4" />
            <p className="text-[var(--text)] font-medium">{uploadStatus}</p>
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
