'use client';

import { useEffect, useState } from 'react';
import { Bot, Database, Zap } from 'lucide-react';

export type PipelineMode = 'auto' | 'ai' | 'fallback';
export const PIPELINE_KEY = 'pa_pipeline_mode';

export function usePipelineMode(): [PipelineMode, (m: PipelineMode) => void] {
  const [mode, setModeState] = useState<PipelineMode>('auto');

  useEffect(() => {
    const saved = localStorage.getItem(PIPELINE_KEY) as PipelineMode | null;
    if (saved && ['auto', 'ai', 'fallback'].includes(saved)) setModeState(saved);
  }, []);

  const setMode = (m: PipelineMode) => {
    setModeState(m);
    localStorage.setItem(PIPELINE_KEY, m);
  };

  return [mode, setMode];
}

const OPTIONS: { value: PipelineMode; label: string; icon: typeof Bot }[] = [
  { value: 'auto',     label: 'Tự động', icon: Zap      },
  { value: 'ai',       label: 'AI',      icon: Bot      },
  { value: 'fallback', label: 'Offline', icon: Database },
];

export default function PipelineToggle() {
  const [mode, setMode] = usePipelineMode();

  const statusMap: Record<PipelineMode, { dot: string; text: string }> = {
    auto:     { dot: 'bg-[var(--grn)] animate-pulse', text: 'AI với dự phòng tự động' },
    ai:       { dot: 'bg-[var(--acc)] animate-pulse', text: 'Chỉ dùng AI' },
    fallback: { dot: 'bg-[var(--ylw)]',               text: 'Chế độ ngoại tuyến' },
  };

  const { dot, text } = statusMap[mode];

  return (
    <div className="px-3 py-3 border-t border-[var(--border-subtle)]">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--text4)] mb-2">Nguồn dữ liệu</p>

      {/* 3-way toggle */}
      <div className="flex gap-0.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-0.5">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10.5px] font-semibold rounded-md transition-all
              ${mode === value
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--text3)] hover:text-[var(--text2)]'}`}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* Live status dot */}
      <div className="flex items-center gap-1.5 mt-2 px-0.5">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <span className="text-[10px] text-[var(--text3)] leading-tight">{text}</span>
      </div>
    </div>
  );
}
