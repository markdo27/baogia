import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import PrintActions from './PrintActions';

const prisma = new PrismaClient();

export default async function PrintPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { project: true, items: { orderBy: { itemNo: 'asc' } } },
  });

  if (!quotation) notFound();

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const fmtC = (v: number) => v >= 1e9 ? (v / 1e9).toFixed(2) + ' tỷ' : v >= 1e6 ? (v / 1e6).toFixed(1) + ' tr' : fmt(v);

  const totalOriginal    = quotation.items.reduce((s, i) => s + i.totalPrice, 0);
  const totalNegotiated  = quotation.items.reduce((s, i) => s + (i.agreedPrice ?? i.totalPrice), 0);
  const totalSavings     = totalOriginal - totalNegotiated;
  const agreedCount      = quotation.items.filter(i => i.status === 'agreed').length;

  const grouped = quotation.items.reduce((acc, item) => {
    const cat = item.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof quotation.items>);

  const printDate = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const css = `
    .print-page * { box-sizing: border-box; }
    .print-page { max-width: 1100px; margin: 0 auto; padding: 32px 28px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #111; background: #fff; }
    @media print { .no-print { display: none !important; } }
    .ph { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 13px; font-weight: 800; color: #4F5FD9; letter-spacing: -0.02em; margin-bottom: 6px; }
    .ph h1 { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .sc { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .sc .lbl { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 4px; }
    .sc .val { font-size: 18px; font-weight: 800; color: #0f172a; }
    .sc .val.grn { color: #16a34a; }
    .sc .sub { font-size: 10px; color: #94a3b8; margin-top: 2px; }
    .print-page table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
    .print-page thead { background: #f8fafc; }
    .print-page th { padding: 7px 8px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .print-page th.r, .print-page td.r { text-align: right; }
    .print-page th.c, .print-page td.c { text-align: center; }
    .print-page td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .cat-row td { font-weight: 800; font-size: 10.5px; color: #4F5FD9; padding: 5px 8px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
    .agreed-row td { background: rgba(22,163,74,0.04); }
    .ovp { color: #ef4444; font-weight: 700; font-size: 9px; }
    .tag { display: inline-block; padding: 2px 6px; border-radius: 10px; font-weight: 700; font-size: 9px; }
    .tag-agreed { background: rgba(22,163,74,0.1); color: #16a34a; }
    .tag-negotiating { background: rgba(217,119,6,0.1); color: #d97706; }
    .tag-pending { background: #f1f5f9; color: #64748b; }
    .pf { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="print-page">
        <PrintActions />

        {/* Header */}
        <div className="ph">
          <div className="brand">PriceAudit</div>
          <h1>{quotation.name}</h1>
          <div className="meta">Dự án: {quotation.project.name} · Ngày in: {printDate} · {quotation.items.length} hạng mục · {agreedCount} đã chốt</div>
        </div>

        {/* Summary */}
        <div className="summary">
          {[
            { lbl: 'Tổng gốc',         val: fmtC(totalOriginal),                 sub: 'Chưa đàm phán',                           green: false },
            { lbl: 'Sau đàm phán',      val: fmtC(totalNegotiated),               sub: `${agreedCount}/${quotation.items.length} hạng mục đã chốt`, green: false },
            { lbl: 'Tiết kiệm được',    val: fmtC(totalSavings > 0 ? totalSavings : 0), sub: 'So với báo giá gốc',               green: true  },
            { lbl: 'Tiến độ đàm phán',  val: `${agreedCount}/${quotation.items.length}`, sub: 'Hạng mục đã chốt',                green: false },
          ].map(c => (
            <div key={c.lbl} className="sc">
              <div className="lbl">{c.lbl}</div>
              <div className={`val${c.green ? ' grn' : ''}`}>{c.val}</div>
              <div className="sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th style={{ width: 24 }}>#</th>
              <th>Tên hạng mục</th>
              <th className="c" style={{ width: 60 }}>Thương hiệu</th>
              <th className="c" style={{ width: 40 }}>ĐVT</th>
              <th className="c" style={{ width: 36 }}>SL</th>
              <th className="r" style={{ width: 80 }}>Đơn giá</th>
              <th className="r" style={{ width: 80 }}>Giá TT</th>
              <th className="r" style={{ width: 80 }}>Thành tiền</th>
              <th className="r" style={{ width: 80 }}>Giá ĐP</th>
              <th className="c" style={{ width: 70 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([catName, catItems]) => {
              const catTotal = catItems.reduce((s, i) => s + i.totalPrice, 0);
              return (
                <React.Fragment key={catName}>
                  <tr className="cat-row">
                    <td colSpan={10}>
                      {catName}
                      <span style={{ float: 'right', fontWeight: 600, color: '#475569', fontSize: 10 }}>{fmt(catTotal)} đ</span>
                    </td>
                  </tr>
                  {catItems.map(item => {
                    const isOverpriced = item.marketPrice && item.unitPrice > item.marketPrice * 1.2;
                    return (
                      <tr key={item.id} className={item.status === 'agreed' ? 'agreed-row' : ''}>
                        <td className="c" style={{ color: '#94a3b8' }}>{item.itemNo}</td>
                        <td style={{ fontWeight: 600 }}>
                          {item.name}
                          {item.note && <div style={{ fontWeight: 400, color: '#94a3b8', fontSize: 9.5 }}>{item.note}</div>}
                        </td>
                        <td className="c" style={{ color: '#64748b' }}>{item.brand || '—'}</td>
                        <td className="c" style={{ color: '#64748b' }}>{item.unit}</td>
                        <td className="c" style={{ fontWeight: 700 }}>{item.quantity}</td>
                        <td className="r">
                          {fmt(item.unitPrice)}
                          {isOverpriced && <div className="ovp">+{Math.round(((item.unitPrice - item.marketPrice!) / item.marketPrice!) * 100)}%</div>}
                        </td>
                        <td className="r" style={{ color: '#64748b' }}>{item.marketPrice ? fmt(item.marketPrice) : '—'}</td>
                        <td className="r" style={{ fontWeight: 700 }}>{fmt(item.totalPrice)}</td>
                        <td className="r" style={{ color: '#16a34a', fontWeight: 700 }}>{item.agreedPrice ? fmt(item.agreedPrice) : '—'}</td>
                        <td className="c">
                          <span className={`tag tag-${item.status}`}>
                            {item.status === 'agreed' ? 'Đã chốt' : item.status === 'negotiating' ? 'Đàm phán' : 'Chưa chốt'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="pf">
          <span>Báo cáo được tạo bởi PriceAudit</span>
          <span>In ngày {printDate}</span>
        </div>
      </div>
    </>
  );
}

import React from 'react';
