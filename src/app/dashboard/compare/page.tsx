import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ComparePage() {
  // Get all projects and their quotations
  const projects = await prisma.project.findMany({
    include: {
      quotations: {
        include: {
          items: true
        }
      }
    }
  });

  const project = projects[0]; // For simplicity, take the first project

  if (!project || project.quotations.length < 2) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20 flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--text)]">Chưa đủ dữ liệu so sánh</h2>
        <p className="text-[var(--text3)] text-[13px]">Bạn cần tải lên ít nhất 2 bảng báo giá cho cùng một dự án để sử dụng tính năng so sánh.</p>
      </div>
    );
  }

  const q1 = project.quotations[0];
  const q2 = project.quotations[1];

  // Simple matching algorithm: group by item name
  const matchedItems: any[] = [];
  
  q1.items.forEach(item1 => {
    // Find matching item in Q2
    const item2 = q2.items.find(i2 => 
      i2.name.toLowerCase().includes(item1.name.toLowerCase().split(' ')[0]) // simplistic keyword matching
    );
    
    matchedItems.push({
      name: item1.name,
      category: item1.category,
      q1: item1,
      q2: item2 || null
    });
  });

  // Add items from Q2 that weren't in Q1
  q2.items.forEach(item2 => {
    const exists = matchedItems.find(m => m.q2?.id === item2.id);
    if (!exists) {
      matchedItems.push({
        name: item2.name,
        category: item2.category,
        q1: null,
        q2: item2
      });
    }
  });

  const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">So sánh Báo giá</h1>
          <p className="text-sm text-[var(--text3)] mt-1">{project.name}: {q1.name} vs {q2.name}</p>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)]">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[var(--surface2)] sticky top-0 z-10 border-b border-[var(--border)] shadow-sm">
              <tr>
                <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase">Hạng mục</th>
                <th className="py-3 px-4 font-semibold text-[11px] text-[var(--acc)] bg-[var(--acc-light)] uppercase w-64 border-l border-[var(--border)]">{q1.name}</th>
                <th className="py-3 px-4 font-semibold text-[11px] text-[var(--purple)] bg-[var(--purple-bg)] uppercase w-64 border-l border-[var(--border)]">{q2.name}</th>
                <th className="py-3 px-4 font-semibold text-[11px] text-[var(--text3)] uppercase w-32 text-center border-l border-[var(--border)]">Chênh lệch</th>
              </tr>
            </thead>
            <tbody>
              {matchedItems.map((match, idx) => {
                const diff = (match.q1?.totalPrice || 0) - (match.q2?.totalPrice || 0);
                const absDiff = Math.abs(diff);
                const winner = diff > 0 ? 'Q2' : diff < 0 ? 'Q1' : 'TIE';

                return (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface2)]">
                    <td className="py-3 px-4 font-medium text-[var(--text)]">{match.name}</td>
                    
                    <td className="py-3 px-4 border-l border-[var(--border-subtle)]">
                      {match.q1 ? (
                        <div>
                          <div className="font-bold text-[var(--text)]">{formatMoney(match.q1.totalPrice)}</div>
                          <div className="text-[11px] text-[var(--text3)]">{match.q1.quantity} {match.q1.unit} x {formatMoney(match.q1.unitPrice)}</div>
                        </div>
                      ) : <span className="text-[var(--text4)] italic">Không có</span>}
                    </td>

                    <td className="py-3 px-4 border-l border-[var(--border-subtle)]">
                      {match.q2 ? (
                        <div>
                          <div className="font-bold text-[var(--text)]">{formatMoney(match.q2.totalPrice)}</div>
                          <div className="text-[11px] text-[var(--text3)]">{match.q2.quantity} {match.q2.unit} x {formatMoney(match.q2.unitPrice)}</div>
                        </div>
                      ) : <span className="text-[var(--text4)] italic">Không có</span>}
                    </td>

                    <td className="py-3 px-4 border-l border-[var(--border-subtle)] text-center">
                      {diff === 0 ? (
                        <span className="text-[11px] font-medium text-[var(--text3)]">Bằng nhau</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[var(--text)]">{formatMoney(absDiff)}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${winner === 'Q1' ? 'bg-[var(--acc-light)] text-[var(--acc)]' : 'bg-[var(--purple-bg)] text-[var(--purple)]'}`}>
                            {winner === 'Q1' ? q1.name : q2.name} rẻ hơn
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
