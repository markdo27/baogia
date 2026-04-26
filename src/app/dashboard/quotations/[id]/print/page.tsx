import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function PrintPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      project: true,
      items: { orderBy: { itemNo: 'asc' } },
    },
  });

  if (!quotation) notFound();

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const fmtCompact = (v: number) =>
    v >= 1e9 ? (v / 1e9).toFixed(2) + ' tỷ' : v >= 1e6 ? (v / 1e6).toFixed(1) + ' tr' : fmt(v);

  const totalOriginal = quotation.items.reduce((s, i) => s + i.totalPrice, 0);
  const totalNegotiated = quotation.items.reduce((s, i) => s + (i.agreedPrice ?? i.totalPrice), 0);
  const totalSavings = totalOriginal - totalNegotiated;
  const agreedCount = quotation.items.filter(i => i.status === 'agreed').length;

  const grouped = quotation.items.reduce((acc, item) => {
    const cat = item.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof quotation.items>);

  const printDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <title>{quotation.name} — Price Audit</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #111; background: #fff; }
          .page { max-width: 1100px; margin: 0 auto; padding: 32px 28px; }
          .no-print { display: flex; justify-content: flex-end; margin-bottom: 20px; gap: 8px; }
          @media print { .no-print { display: none !important; } }
          .btn { padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
          .btn-primary { background: #4F5FD9; color: #fff; }
          .btn-ghost { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
          .brand { font-size: 13px; font-weight: 800; color: #4F5FD9; letter-spacing: -0.02em; margin-bottom: 6px; }
          h1 { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
          .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .summary-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
          .summary-card .label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 4px; }
          .summary-card .value { font-size: 18px; font-weight: 800; color: #0f172a; }
          .summary-card .value.green { color: #16a34a; }
          .summary-card .sub { font-size: 10px; color: #94a3b8; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
          thead { background: #f8fafc; }
          th { padding: 7px 8px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: left; }
          th.right, td.right { text-align: right; }
          th.center, td.center { text-align: center; }
          td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
          tr.cat-row { background: #f8fafc; }
          tr.cat-row td { font-weight: 800; font-size: 10.5px; color: #4F5FD9; padding: 5px 8px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
          tr.agreed-row td { background: rgba(22,163,74,0.04); }
          .overpriced { color: #ef4444; font-weight: 700; }
          .savings-val { color: #16a34a; font-weight: 700; }
          .status-agreed { display: inline-block; padding: 2px 6px; border-radius: 10px; background: rgba(22,163,74,0.1); color: #16a34a; font-weight: 700; font-size: 9px; }
          .status-negotiating { display: inline-block; padding: 2px 6px; border-radius: 10px; background: rgba(217,119,6,0.1); color: #d97706; font-weight: 700; font-size: 9px; }
          .status-pending { display: inline-block; padding: 2px 6px; border-radius: 10px; background: #f1f5f9; color: #64748b; font-weight: 700; font-size: 9px; }
          .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px; }
        `}</style>
      </head>
      <body>
        <div className="page">
          {/* Print / Close buttons */}
          <div className="no-print">
            <button className="btn btn-ghost" onClick={() => window.close()}>✕ Đóng</button>
            <button className="btn btn-primary" onClick={() => window.print()}>🖨 In / Xuất PDF</button>
          </div>

          {/* Header */}
          <div className="header">
            <div className="brand">PriceAudit</div>
            <h1>{quotation.name}</h1>
            <div className="meta">Dự án: {quotation.project.name} · Ngày in: {printDate} · {quotation.items.length} hạng mục · {agreedCount} đã chốt</div>
          </div>

          {/* Summary cards */}
          <div className="summary">
            <div className="summary-card">
              <div className="label">Tổng gốc</div>
              <div className="value">{fmtCompact(totalOriginal)}</div>
              <div className="sub">Chưa đàm phán</div>
            </div>
            <div className="summary-card">
              <div className="label">Sau đàm phán</div>
              <div className="value">{fmtCompact(totalNegotiated)}</div>
              <div className="sub">{agreedCount}/{quotation.items.length} hạng mục đã chốt</div>
            </div>
            <div className="summary-card">
              <div className="label">Tiết kiệm được</div>
              <div className="value green">{fmtCompact(totalSavings > 0 ? totalSavings : 0)}</div>
              <div className="sub">So với báo giá gốc</div>
            </div>
            <div className="summary-card">
              <div className="label">Tiến độ đàm phán</div>
              <div className="value">{agreedCount}<span style={{ fontSize: 14, color: '#94a3b8' }}>/{quotation.items.length}</span></div>
              <div className="sub">Hạng mục đã chốt</div>
            </div>
          </div>

          {/* Items table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 24 }}>#</th>
                <th>Tên hạng mục</th>
                <th className="center" style={{ width: 60 }}>Thương hiệu</th>
                <th className="center" style={{ width: 40 }}>ĐVT</th>
                <th className="center" style={{ width: 36 }}>SL</th>
                <th className="right" style={{ width: 80 }}>Đơn giá</th>
                <th className="right" style={{ width: 80 }}>Giá TT</th>
                <th className="right" style={{ width: 80 }}>Thành tiền</th>
                <th className="right" style={{ width: 80 }}>Giá đàm phán</th>
                <th className="center" style={{ width: 70 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([catName, catItems]) => {
                const catTotal = catItems.reduce((s, i) => s + i.totalPrice, 0);
                return (
                  <>
                    <tr key={`cat-${catName}`} className="cat-row">
                      <td colSpan={10}>
                        <span>{catName}</span>
                        <span style={{ float: 'right', fontWeight: 600, color: '#475569', fontSize: 10 }}>{fmt(catTotal)} đ</span>
                      </td>
                    </tr>
                    {catItems.map(item => {
                      const isOverpriced = item.marketPrice && item.unitPrice > item.marketPrice * 1.2;
                      const savings = item.marketPrice && isOverpriced
                        ? (item.unitPrice - item.marketPrice) * item.quantity
                        : 0;
                      return (
                        <tr key={item.id} className={item.status === 'agreed' ? 'agreed-row' : ''}>
                          <td className="center" style={{ color: '#94a3b8' }}>{item.itemNo}</td>
                          <td style={{ fontWeight: 600 }}>{item.name}{item.note && <div style={{ fontWeight: 400, color: '#94a3b8', fontSize: 9.5 }}>{item.note}</div>}</td>
                          <td className="center" style={{ color: '#64748b' }}>{item.brand || '—'}</td>
                          <td className="center" style={{ color: '#64748b' }}>{item.unit}</td>
                          <td className="center" style={{ fontWeight: 700 }}>{item.quantity}</td>
                          <td className="right">
                            {fmt(item.unitPrice)}
                            {isOverpriced && <div className="overpriced">+{Math.round(((item.unitPrice - item.marketPrice!) / item.marketPrice!) * 100)}%</div>}
                          </td>
                          <td className="right" style={{ color: '#64748b' }}>{item.marketPrice ? fmt(item.marketPrice) : '—'}</td>
                          <td className="right" style={{ fontWeight: 700 }}>{fmt(item.totalPrice)}</td>
                          <td className="right savings-val">{item.agreedPrice ? fmt(item.agreedPrice) : '—'}</td>
                          <td className="center">
                            <span className={`status-${item.status}`}>
                              {item.status === 'agreed' ? 'Đã chốt' : item.status === 'negotiating' ? 'Đàm phán' : 'Chưa chốt'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="footer">
            <span>Báo cáo được tạo bởi PriceAudit · priceaudit.vercel.app</span>
            <span>In ngày {printDate}</span>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelector('.btn-primary')?.addEventListener('click', () => window.print());
          document.querySelector('.btn-ghost')?.addEventListener('click', () => window.close());
        `}} />
      </body>
    </html>
  );
}
