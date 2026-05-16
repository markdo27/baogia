import { PrismaClient } from '@prisma/client';
import AuditReportClient from './AuditReportClient';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AuditReportPage() {
  const projects = await prisma.project.findMany({
    include: {
      quotations: {
        include: {
          items: {
            orderBy: { itemNo: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Flatten all items across all quotations/projects
  const allItems = projects.flatMap(project =>
    project.quotations.flatMap(quotation =>
      quotation.items.map(item => ({
        ...item,
        projectName: project.name,
        projectId: project.id,
        quotationName: quotation.name,
        quotationId: quotation.id,
      }))
    )
  );

  return <AuditReportClient projects={projects} allItems={allItems} />;
}
