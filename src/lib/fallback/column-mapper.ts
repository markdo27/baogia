/**
 * Vietnamese construction quotation column mapper.
 * Maps raw column headers to semantic schema fields using keyword fingerprinting.
 */
import { normalize } from './normalizer';

export type ColumnRole =
  | 'itemNo' | 'name' | 'unit' | 'quantity'
  | 'unitPrice' | 'totalPrice' | 'brand' | 'note' | 'unknown';

/** Regex patterns per column role — normalized (no diacritics, lowercase) */
const COLUMN_PATTERNS: Record<ColumnRole, RegExp> = {
  itemNo:     /^(stt|tt|no|num|#|\d+\.?|seq)$/,
  name:       /(ten hang|hang muc|mo ta|noi dung|dien giai|description|item|cong viec)/,
  unit:       /^(dvt|don vi|unit|dv)$|don vi tinh/,
  quantity:   /(so luong|sl|kl|khoi luong|qty|quantity|klg)/,
  unitPrice:  /(don gia|gia don|gia san|unit price|price)\b/,
  totalPrice: /(thanh tien|tong tien|tong|amount|total|gia tri)/,
  brand:      /(thuong hieu|hang|brand|nha san xuat|xuat xu|nsx)/,
  note:       /(ghi chu|note|remarks|chu thich|dac tinh)/,
  unknown:    /^$/,
};

/** Score a header against all roles, return best match */
export function detectColumnRole(header: string): { role: ColumnRole; confidence: number } {
  const n = normalize(header);
  let bestRole: ColumnRole = 'unknown';
  let bestScore = 0;

  for (const [role, pattern] of Object.entries(COLUMN_PATTERNS)) {
    if (role === 'unknown') continue;
    if (pattern.test(n)) {
      // Shorter, more specific headers get higher confidence
      const confidence = n.length < 5 ? 0.95 : 0.80;
      if (confidence > bestScore) {
        bestScore = confidence;
        bestRole = role as ColumnRole;
      }
    }
  }

  return { role: bestRole, confidence: bestScore };
}

/** Map an array of header strings to an index→role map */
export function mapColumns(headers: string[]): Map<number, ColumnRole> {
  const roleMap = new Map<number, ColumnRole>();
  const usedRoles = new Set<ColumnRole>();

  headers.forEach((header, idx) => {
    const { role, confidence } = detectColumnRole(header);
    if (role !== 'unknown' && confidence >= 0.6 && !usedRoles.has(role)) {
      roleMap.set(idx, role);
      usedRoles.add(role);
    }
  });

  return roleMap;
}

/** Compute extraction confidence score from a role map */
export function extractionConfidence(roleMap: Map<number, ColumnRole>): number {
  const roles = [...roleMap.values()];
  let score = 0;
  if (roles.includes('name'))       score += 30;
  if (roles.includes('unitPrice'))  score += 20;
  if (roles.includes('totalPrice')) score += 20;
  if (roles.includes('quantity'))   score += 15;
  if (roles.includes('itemNo'))     score += 15;
  return score; // max 100
}

/** Detect if a row is a category header (e.g. "I. Phần Điện") */
export function isCategoryRow(cells: string[], expectedColCount: number): boolean {
  const nonEmpty = cells.filter(c => c.trim().length > 0);
  if (nonEmpty.length > 2) return false; // category rows usually have 1-2 cells
  const text = cells.join(' ').trim();
  return /^[IVX]+\.|^[A-Z]\.|^\d+\.$/.test(text) || // Roman or letter prefix
         (text.length > 3 && text === text.toUpperCase() && nonEmpty.length === 1); // All caps header
}
