import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as xlsx from 'xlsx';
import PDFParser from 'pdf2json';
import { withCircuitBreaker, validateAIExtractionOutput, type PipelineMode } from '@/lib/fallback/circuit-breaker';
import { parseExcel } from '@/lib/fallback/excel-parser';
import { parsePDF } from '@/lib/fallback/pdf-parser';


const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
export const maxDuration = 300;

const EXTRACTION_SCHEMA_PROMPT = `You are an expert construction quotation auditor.
Extract all line items from the provided quotation text and format them as a JSON array of objects.
Do not include category headers as items, but DO assign the correct 'category' to each item based on the headers.
Categories usually start with Roman numerals (e.g., "I. Phần Điện").

Return ONLY a raw JSON array matching this schema:
[
  {
    "category": "String (e.g. I. Điện - Nước)",
    "itemNo": "Number (original order/STT)",
    "name": "String",
    "unit": "String (e.g. m2, bộ, cái)",
    "quantity": "Number",
    "unitPrice": "Number",
    "totalPrice": "Number",
    "brand": "String (Extract brand name if mentioned, otherwise empty string)",
    "note": "String (Any additional specs or notes)"
  }
]

IMPORTANT: Return ONLY valid JSON. No markdown backticks, no explanations. Just the [ ... ].`;

async function extractRawText(buffer: Buffer, filename: string): Promise<string> {
  if (filename.endsWith('.pdf')) {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, true);
      pdfParser.on('pdfParser_dataError', (e: any) => reject(e.parserError));
      pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });
  } else {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_csv(sheet);
  }
}

export async function POST(req: Request) {
  // Instantiate inside the handler so the SDK never runs at build/module-eval time
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const forceMode = (formData.get('forceMode') as string) ?? 'auto';
    const mode: PipelineMode = ['ai', 'fallback', 'auto'].includes(forceMode) ? forceMode as PipelineMode : 'auto';

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const isPDF  = file.name.endsWith('.pdf');
    const isXL   = file.name.match(/\.(xlsx|xls|csv)$/);

    if (!isPDF && !isXL) {
      return NextResponse.json({ error: 'Unsupported file format. Please upload PDF, XLSX, or CSV.' }, { status: 400 });
    }

    // ── AI pipeline (primary) ──────────────────────────────────────────────
    const aiTask = async () => {
      const rawText    = await extractRawText(buffer, file.name);
      const promptText = rawText.substring(0, 15000);

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: EXTRACTION_SCHEMA_PROMPT },
          { role: 'user',   content: `Extract data from this quotation:\n\n${promptText}` },
        ],
        temperature: 0.1,
      });

      const raw     = response.choices[0]?.message?.content || '[]';
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed  = JSON.parse(cleaned);
      return validateAIExtractionOutput(parsed);  // throws if invalid → triggers fallback
    };

    // ── Fallback pipeline (deterministic) ─────────────────────────────────
    const fallbackTask = async () => {
      const result = isPDF
        ? await parsePDF(buffer)
        : parseExcel(buffer);

      if (result.items.length === 0) {
        throw new Error(
          'Không thể tự động đọc file này. File có thể bị quét dạng ảnh (scan), được mã hoá, hoặc có cấu trúc không chuẩn. Vui lòng thử chế độ AI hoặc kiểm tra lại file.'
        );
      }
      return result.items;
    };

    // ── Circuit breaker routes to whichever succeeds ───────────────────────
    const { data, pipeline, durationMs, fallbackReason } = await withCircuitBreaker(
      'extract',
      aiTask,
      fallbackTask,
      mode,
    );

    console.log(`[extract] pipeline=${pipeline} duration=${durationMs}ms items=${data.length}`);
    if (fallbackReason) console.warn(`[extract] fallback reason: ${fallbackReason}`);

    return NextResponse.json({
      success: true,
      data,
      _meta: {
        pipeline,
        durationMs,
        fallbackReason: fallbackReason ?? null,
        // Only include extraction warning if fallback was used
        ...(pipeline === 'fallback' ? { warning: 'Dữ liệu được trích xuất bằng phương pháp truyền thống. Vui lòng kiểm tra lại trước khi lưu.' } : {}),
      },
    });

  } catch (error: any) {
    console.error('[extract] Critical failure in both pipelines:', error);
    return NextResponse.json({ error: error.message || 'Failed to process file' }, { status: 500 });
  }
}
