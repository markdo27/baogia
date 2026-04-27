/**
 * Deterministic Excel & CSV parser.
 * Uses SheetJS (already installed) — no LLM required.
 */
import * as xlsx from 'xlsx';
import { mapColumns, extractionConfidence, isCategoryRow, ColumnRole } from './column-mapper';

export interface ExtractedItem {
  category:   string;
  itemNo:     number;
  name:       string;
  unit:       string;
  quantity:   number;
  unitPrice:  number;
  totalPrice: number;
  brand:      string;
  note:       string;
}

export interface ExtractionResult {
  items:              ExtractedItem[];
  extractionScore:    number;   // 0–100 confidence in column detection
  rowsProcessed:      number;
  rowsSkipped:        number;
  pipeline:           'fallback';
}

/** Parse a number from a cell value — handles comma separators */
function toNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[,\s]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function parseExcel(buffer: Buffer): ExtractionResult {
  const workbook = xlsx.read(buffer, { type: 'buffer', cellText: true, cellDates: true });

  // Try all sheets, use the one with the most data rows
  let bestSheet: xlsx.WorkSheet | null = null;
  let bestRowCount = 0;

  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const ref = sheet['!ref'];
    if (!ref) continue;
    const range = xlsx.utils.decode_range(ref);
    if (range.e.r > bestRowCount) {
      bestRowCount = range.e.r;
      bestSheet = sheet;
    }
  }

  if (!bestSheet) {
    return { items: [], extractionScore: 0, rowsProcessed: 0, rowsSkipped: 0, pipeline: 'fallback' };
  }

  // Convert to array of arrays
  const rows: any[][] = xlsx.utils.sheet_to_json(bestSheet, { header: 1, raw: false, defval: '' });

  // ── Find header row ─────────────────────────────────────────────────────
  let headerRowIdx = -1;
  let roleMap = new Map<number, ColumnRole>();

  for (let i = 0; i < Math.min(50, rows.length); i++) {
    const row = rows[i].map(c => String(c ?? ''));
    const candidateMap = mapColumns(row);
    const score = extractionConfidence(candidateMap);
    if (score >= 30) { // Lowered from 60 — accept partial header matches
      headerRowIdx = i;
      roleMap = candidateMap;
      break;
    }
  }

  if (headerRowIdx === -1) {
    // Last resort: use row 0 as header
    headerRowIdx = 0;
    roleMap = mapColumns(rows[0]?.map(c => String(c ?? '')) ?? []);
  }

  const score = extractionConfidence(roleMap);

  // ── Extract data rows ───────────────────────────────────────────────────
  const items: ExtractedItem[] = [];
  let currentCategory = '';
  let autoItemNo = 0;
  let rowsSkipped = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i].map(c => String(c ?? '').trim());

    // Detect category row
    if (isCategoryRow(row, roleMap.size)) {
      currentCategory = row.find(c => c.trim().length > 0) ?? currentCategory;
      continue;
    }

    // Get name and price
    const nameIdx      = [...roleMap.entries()].find(([, r]) => r === 'name')?.[0];
    const unitPriceIdx = [...roleMap.entries()].find(([, r]) => r === 'unitPrice')?.[0];
    const totalIdx     = [...roleMap.entries()].find(([, r]) => r === 'totalPrice')?.[0];
    const quantityIdx  = [...roleMap.entries()].find(([, r]) => r === 'quantity')?.[0];
    const unitIdx      = [...roleMap.entries()].find(([, r]) => r === 'unit')?.[0];
    const itemNoIdx    = [...roleMap.entries()].find(([, r]) => r === 'itemNo')?.[0];
    const brandIdx     = [...roleMap.entries()].find(([, r]) => r === 'brand')?.[0];
    const noteIdx      = [...roleMap.entries()].find(([, r]) => r === 'note')?.[0];

    const name = nameIdx !== undefined ? row[nameIdx] : '';
    const unitPrice  = unitPriceIdx !== undefined ? toNumber(row[unitPriceIdx])  : 0;
    const totalPrice = totalIdx     !== undefined ? toNumber(row[totalIdx])      : 0;

    // Skip rows that don't look like valid line items
    if (!name || name.length < 2) { rowsSkipped++; continue; }
    if (unitPrice === 0 && totalPrice === 0) { rowsSkipped++; continue; }

    autoItemNo++;
    items.push({
      category:   currentCategory,
      itemNo:     itemNoIdx !== undefined ? toNumber(row[itemNoIdx]) || autoItemNo : autoItemNo,
      name,
      unit:       unitIdx     !== undefined ? row[unitIdx]  : '',
      quantity:   quantityIdx !== undefined ? toNumber(row[quantityIdx]) : 1,
      unitPrice,
      totalPrice: totalPrice || unitPrice * (quantityIdx !== undefined ? toNumber(row[quantityIdx]) : 1),
      brand:      brandIdx !== undefined ? row[brandIdx]  : '',
      note:       noteIdx  !== undefined ? row[noteIdx]   : '',
    });
  }

  return {
    items,
    extractionScore: score,
    rowsProcessed: rows.length - headerRowIdx - 1,
    rowsSkipped,
    pipeline: 'fallback',
  };
}
