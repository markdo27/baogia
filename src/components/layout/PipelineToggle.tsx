'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bot, Database, Zap, Wifi, WifiOff, Loader } from 'lucide-react';

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

type AIStatus = 'checking' | 'ok' | 'slow' | 'error' | 'auth_error' | 'rate_limited' | 'timeout';

function useAIHealth() {
  const [status, setStatus] = useState<AIStatus>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const check = useCallback(async () => {
    setStatus('checking');
    try {
      const res = await fetch('/api/ai-health');
      const data = await res.json();
      setLatencyMs(data.latencyMs ?? null);
      if (data.status === 'ok') {
        setStatus(data.latencyMs > 6000 ? 'slow' : 'ok');
      } else {
        setStatus(data.status as AIStatus);
      }
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000); // re-check every 30s
    return () => clearInterval(interval);
  }, [check]);

  return { status, latencyMs, recheck: check };
}

const AI_STATUS_CONFIG: Record<AIStatus, { dot: string; label: string; icon: typeof Wifi }> = {
  checking:     { dot: 'bg-[var(--text4)] animate-pulse',  label: 'Đang kiểm tra AI...',   icon: Loader },
  ok:           { dot: 'bg-[var(--grn)] animate-pulse',    label: 'AI kết nối tốt',         icon: Wifi },
  slow:         { dot: 'bg-[var(--ylw)] animate-pulse',    label: 'AI phản hồi chậm',       icon: Wifi },
  error:        { dot: 'bg-[var(--red)]',                  label: 'AI không phản hồi',       icon: WifiOff },
  timeout:      { dot: 'bg-[var(--red)]',                  label: 'AI timeout',              icon: WifiOff },
  auth_error:   { dot: 'bg-[var(--red)]',                  label: 'Lỗi API Key',             icon: WifiOff },
  rate_limited: { dot: 'bg-[var(--ylw)]',                  label: 'AI bị giới hạn tốc độ',  icon: Wifi },
};

const OPTIONS: { value: PipelineMode; label: string; icon: typeof Bot }[] = [
  { value: 'auto',     label: 'Tự động', icon: Zap      },
  { value: 'ai',       label: 'AI',      icon: Bot      },
  { value: 'fallback', label: 'Offline', icon: Database },
];

export default function PipelineToggle() {
  const [mode, setMode] = usePipelineMode();
  const { status, latencyMs, recheck } = useAIHealth();
  const ai = AI_STATUS_CONFIG[status];

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

      {/* AI health indicator */}
      <button
        onClick={recheck}
        title="Nhấn để kiểm tra lại kết nối AI"
        className="mt-2.5 w-full flex items-center gap-2 px-2 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface2)] hover:border-[var(--border)] hover:bg-[var(--surface)] transition-colors group"
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${ai.dot}`} />
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className={`text-[10px] font-semibold leading-tight truncate w-full
            ${status === 'ok'   ? 'text-[var(--grn)]'  :
              status === 'slow' || status === 'rate_limited' ? 'text-[var(--ylw)]' :
              status === 'checking' ? 'text-[var(--text3)]' :
              'text-[var(--red)]'}`}>
            {ai.label}
          </span>
          {latencyMs !== null && status !== 'checking' && (
            <span className="text-[9px] text-[var(--text4)] tabular-nums">{latencyMs}ms</span>
          )}
        </div>
        <span className="text-[8.5px] text-[var(--text4)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">↺</span>
      </button>
    </div>
  );
}
