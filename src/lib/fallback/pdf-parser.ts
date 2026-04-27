/**
 * Deterministic PDF parser using pdf2json (already installed).
 * Uses positional metadata to reconstruct table structure without LLM.
 */
import PDFParser from 'pdf2json';
import { mapColumns, extractionConfidence, isCategoryRow } from './column-mapper';
import type { ExtractedItem, ExtractionResult } from './excel-parser';

/** Parse a pdf2json text token into a plain string */
function decodeToken(text: string): string {
  return decodeURIComponent(text).replace(/\s+/g, ' ').trim();
}

/** Cluster x-positions into column bands with ±tolerance */
function clusterX(xValues: number[], tolerance = 8): number[] {
  const sorted = [...new Set(xValues)].sort((a, b) => a - b);
  const bands: number[] = [];
  for (const x of sorted) {
    const existing = bands.find(b => Math.abs(b - x) <= tolerance);
    if (!existing) bands.push(x);
  }
  return bands.sort((a, b) => a - b);
}

/** Assign a token's x-position to the nearest column band */
function assignColumn(x: number, bands: number[]): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < bands.length; i++) {
    const d = Math.abs(x - bands[i]);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

export async function parsePDF(buffer: Buffer): Promise<ExtractionResult> {
  // ── Step 1: Extract all text tokens with x,y positions ──────────────────
  const raw: { page: number; x: number; y: number; text: string }[] = await new Promise((resolve, reject) => {
    const parser = new PDFParser(null, true);
    parser.on('pdfParser_dataError', (e: any) => reject(e.parserError));
    parser.on('pdfParser_dataReady', (data: any) => {
      const tokens: { page: number; x: number; y: number; text: string }[] = [];
      (data.Pages ?? []).forEach((page: any, pageIdx: number) => {
        (page.Texts ?? []).forEach((t: any) => {
          const text = (t.R ?? []).map((r: any) => decodeToken(r.T)).join('');
          if (text.trim()) {
            tokens.push({ page: pageIdx, x: Math.round(t.x * 10), y: Math.round(t.y * 10), text });
          }
        });
      });
      resolve(tokens);
    });
    parser.parseBuffer(buffer);
  });

  if (raw.length === 0) {
    return { items: [], extractionScore: 0, rowsProcessed: 0, rowsSkipped: 0, pipeline: 'fallback' };
  }

  // ── Step 2: Group tokens by page+y into rows ──────────────────────────────
  const rowMap = new Map<string, typeof raw>();
  for (const token of raw) {
    const key = `${token.page}:${token.y}`;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key)!.push(token);
  }

  const sortedRows = [...rowMap.entries()]
    .sort(([a], [b]) => {
      const [ap, ay] = a.split(':').map(Number);
      const [bp, by] = b.split(':').map(Number);
      return ap !== bp ? ap - bp : ay - by;
    })
    .map(([, tokens]) => tokens.sort((a, b) => a.x - b.x));

  // ── Step 3: Detect column bands from header area ─────────────────────────
  const allX = raw.map(t => t.x);
  const columnBands = clusterX(allX);

  // ── Step 4: Reconstruct rows as column-cell arrays ───────────────────────
  const grid = sortedRows.map(row => {
    const cells = new Array(columnBands.length).fill('');
    for (const token of row) {
      const col = assignColumn(token.x, columnBands);
      cells[col] = (cells[col] + ' ' + token.text).trim();
    }
    return cells;
  });

  // ── Step 5: Detect header row ─────────────────────────────────────────────
  let headerRowIdx = -1;
  let roleMap = new Map<number, any>();

  for (let i = 0; i < Math.min(50, grid.length); i++) {
    const candidate = mapColumns(grid[i]);
    const score = extractionConfidence(candidate);
    if (score >= 30) {  // Lowered from 55 — accept any row that has at least a name or price
      headerRowIdx = i;
      roleMap = candidate;
      break;
    }
  }

  const score = extractionConfidence(roleMap);

  // ── Step 6: Extract data rows ─────────────────────────────────────────────
  const items: ExtractedItem[] = [];
  let currentCategory = '';
  let autoItemNo = 0;
  let rowsSkipped = 0;

  const get = (role: string) => [...roleMap.entries()].find(([, r]) => r === role)?.[0];

  for (let i = (headerRowIdx === -1 ? 0 : headerRowIdx + 1); i < grid.length; i++) {
    const row = grid[i];

    if (isCategoryRow(row, columnBands.length)) {
      currentCategory = row.find(c => c.trim().length > 0) ?? currentCategory;
      continue;
    }

    const nameIdx      = get('name');
    const unitPriceIdx = get('unitPrice');
    const totalIdx     = get('totalPrice');
    const quantityIdx  = get('quantity');
    const unitIdx      = get('unit');
    const itemNoIdx    = get('itemNo');
    const brandIdx     = get('brand');
    const noteIdx      = get('note');

    const name      = nameIdx      !== undefined ? row[nameIdx]      : '';
    const unitPrice = unitPriceIdx !== undefined ? parseFloat(row[unitPriceIdx]?.replace(/[,\s]/g, '') || '0') : 0;
    const total     = totalIdx     !== undefined ? parseFloat(row[totalIdx]?.replace(/[,\s]/g, '') || '0') : 0;
    const qty       = quantityIdx  !== undefined ? parseFloat(row[quantityIdx]?.replace(/[,\s]/g, '') || '1') : 1;

    if (!name || name.length < 2) {
      rowsSkipped++;
      continue;
    }
    // If we have no price data at all, skip — but allow rows with only one of unitPrice/total
    if (unitPrice === 0 && total === 0) {
      rowsSkipped++;
      continue;
    }

    autoItemNo++;
    items.push({
      category:   currentCategory,
      itemNo:     itemNoIdx !== undefined ? parseFloat(row[itemNoIdx] || '0') || autoItemNo : autoItemNo,
      name:       name.trim(),
      unit:       unitIdx  !== undefined ? row[unitIdx]  : '',
      quantity:   isNaN(qty) ? 1 : qty,
      unitPrice,
      totalPrice: total || unitPrice * (isNaN(qty) ? 1 : qty),
      brand:      brandIdx !== undefined ? row[brandIdx] : '',
      note:       noteIdx  !== undefined ? row[noteIdx]  : '',
    });
  }

  return {
    items,
    extractionScore: score,
    rowsProcessed: grid.length - (headerRowIdx + 1),
    rowsSkipped,
    pipeline: 'fallback',
  };
}
