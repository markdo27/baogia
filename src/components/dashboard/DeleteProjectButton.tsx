'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này cùng tất cả báo giá bên trong?')) return;
    
    setIsDeleting(true);
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
      alert('Lỗi khi xóa dự án: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1.5 text-[var(--text3)] hover:text-[var(--red)] hover:bg-[var(--red-bg)] rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Xóa dự án"
    >
      <Trash2 size={16} />
    </button>
  );
}
