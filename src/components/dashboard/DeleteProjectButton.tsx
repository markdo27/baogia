'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này cùng tất cả báo giá bên trong?')) return;
    
    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project');
      }
      
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi xóa dự án');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-1.5 text-[var(--text3)] hover:text-[var(--red)] hover:bg-[var(--red-bg)] rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Xóa dự án"
      >
        <Trash2 size={16} />
      </button>
      {error && (
        <span className="text-[10px] text-[var(--red)] font-medium max-w-[120px] text-right leading-snug">{error}</span>
      )}
    </div>
  );
}
