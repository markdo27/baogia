'use client';

import { 
  LayoutGrid, 
  Zap, 
  Hammer, 
  DoorClosed, 
  Sofa,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const mainNav = [
    { name: 'Tất cả Báo giá', href: '/dashboard', icon: LayoutGrid },
    { name: 'So sánh Báo giá', href: '/dashboard/compare', icon: LayoutGrid },
  ];

  // Base path for category filtering. If we are viewing a specific quotation, filter it.
  // Otherwise, default to dashboard.
  const basePath = pathname.includes('/dashboard/quotations/') ? pathname : '/dashboard';

  const categoryItems = [
    { name: 'Tổng quan', query: '', icon: LayoutGrid },
    { name: 'I. Điện - Nước', query: 'Điện', icon: Zap },
    { name: 'II. Xây dựng', query: 'Xây', icon: Hammer },
    { name: 'III. Lắp đặt Cửa', query: 'Cửa', icon: DoorClosed },
    { name: 'IV. Nội thất', query: 'Nội thất', icon: Sofa },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[232px] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-50 transition-all duration-200">
      <div className="flex items-center gap-2.5 p-4 border-b border-[var(--border-subtle)]">
        <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[var(--acc)] to-[#A5B4FC] flex items-center justify-center shrink-0 shadow-[0_2px_8px_var(--acc-ring)]">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 18L11 4l8 14H3z" fill="#fff" opacity=".9"/><path d="M7 18l4-8 4 8H7z" fill="#fff" opacity=".45"/></svg>
        </div>
        <div className="text-[11.5px] text-[var(--text3)] leading-snug flex-1 truncate">
          Quotation<strong className="block text-[13.5px] font-bold text-[var(--text)] tracking-tight">Checker</strong>
        </div>
        <button className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text2)] transition-colors shrink-0">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="p-4 pb-1">
        <div className="px-1.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text3)]">
          Quản lý
        </div>
        <nav className="flex flex-col gap-[1px] mb-6">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors border border-transparent
                  ${isActive 
                    ? 'bg-[var(--acc-light)] text-[var(--acc)] font-semibold border-[rgba(99,102,241,.12)]' 
                    : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]'
                  }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-1.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text3)]">
          Phân mục
        </div>
        <nav className="flex flex-col gap-[1px]">
          {categoryItems.map((item) => {
            const isActive = (currentCategory || '') === item.query;
            const Icon = item.icon;
            const href = item.query ? `${basePath}?category=${item.query}` : basePath;
            
            return (
              <Link
                key={item.name}
                href={href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors border border-transparent
                  ${isActive 
                    ? 'bg-[var(--acc-light)] text-[var(--acc)] font-semibold border-[rgba(99,102,241,.12)]' 
                    : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]'
                  }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
