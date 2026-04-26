'use client';

export default function PrintActions() {
  return (
    <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 20 }}>
      <button
        onClick={() => window.close()}
        style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
      >
        ✕ Đóng
      </button>
      <button
        onClick={() => window.print()}
        style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#4F5FD9', color: '#fff', border: 'none' }}
      >
        🖨 In / Xuất PDF
      </button>
    </div>
  );
}
