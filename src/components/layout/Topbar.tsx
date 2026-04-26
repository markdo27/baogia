'use client';

import { Search, ChevronRight, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Topbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from document class
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 py-3.5 border-b border-[var(--border)] mb-5 flex-wrap bg-[var(--bg)]">
      <div className="flex items-center gap-2 text-[13px] text-[var(--text2)]">
        <span className="text-[var(--text3)] text-xs">Hôm nay, {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-sm focus-within:border-[var(--acc)] focus-within:ring-2 focus-within:ring-[var(--acc-ring)] transition-all">
          <Search size={14} className="text-[var(--text3)] shrink-0" />
          <input 
            type="text" 
            placeholder="Tìm hạng mục, thương hiệu..." 
            className="border-none outline-none bg-transparent font-sans text-[13px] text-[var(--text)] w-[210px] placeholder:text-[var(--text3)]"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-[34px] h-[34px] border border-[var(--border)] rounded-md bg-[var(--surface)] cursor-pointer transition-colors hover:border-[var(--acc)] hover:ring-2 hover:ring-[var(--acc-ring)] relative overflow-hidden shrink-0"
          title="Chuyển chế độ tối/sáng"
        >
          <Sun size={16} className={`absolute transition-all duration-200 ${isDark ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
          <Moon size={16} className={`absolute transition-all duration-200 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}`} />
        </button>
      </div>
    </header>
  );
}
