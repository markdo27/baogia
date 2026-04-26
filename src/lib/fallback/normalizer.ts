/**
 * Vietnamese text normalizer — strips diacritics, lowercases,
 * removes stop words and special characters for fuzzy matching.
 */

const STOP_WORDS = new Set([
  'va', 'cac', 'cho', 'cua', 'de', 'trong', 'tren', 'co', 'la',
  'the', 'and', 'of', 'for', 'in', 'with', 'loai', 'kieu', 'mau',
]);

/** Strip Vietnamese diacritics */
export function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // combining marks
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/** Full normalization: lowercase, strip diacritics, remove punctuation, remove stop words */
export function normalize(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize normalized text, removing stop words */
export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/** Extract material class keyword from item name */
const MATERIAL_CLASSES: [RegExp, string][] = [
  [/(thep|sat|inox|nhom)/, 'metal'],
  [/(xi mang|cement|be tong)/, 'cement'],
  [/(gach|ceramic|granite|da)/, 'tile'],
  [/(son|soi|coating|paint)/, 'paint'],
  [/(dien|cap|day|cong tac|o cam|mcb|aptomat)/, 'electrical'],
  [/(nuoc|ong|van|pump|bom)/, 'plumbing'],
  [/(cua|khung|canh|door|window)/, 'door'],
  [/(noithat|sofa|tu|ban|ghe|furniture)/, 'furniture'],
  [/(san|parquet|laminate|vinyl|floor)/, 'flooring'],
  [/(tran|ceiling|thach cao|gypsum)/, 'ceiling'],
];

export function getMaterialClass(text: string): string | null {
  const n = normalize(text);
  for (const [pattern, cls] of MATERIAL_CLASSES) {
    if (pattern.test(n)) return cls;
  }
  return null;
}
