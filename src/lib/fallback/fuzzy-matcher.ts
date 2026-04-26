/**
 * Jaro-Winkler + Jaccard composite fuzzy matcher.
 * Zero dependencies — fully deterministic.
 */
import { normalize, tokenize, getMaterialClass } from './normalizer';

// ─── Jaro similarity ────────────────────────────────────────────────────────

function jaro(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  const len1 = s1.length, len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0;

  const matchDist = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0, transpositions = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDist);
    const end   = Math.min(i + matchDist + 1, len2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue;
      s1Matches[i] = true; s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
}

// ─── Jaro-Winkler ────────────────────────────────────────────────────────────

function jaroWinkler(s1: string, s2: string, p = 0.1): number {
  const j = jaro(s1, s2);
  let prefix = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
    if (s1[i] === s2[i]) prefix++; else break;
  }
  return j + prefix * p * (1 - j);
}

// ─── Jaccard token overlap ────────────────────────────────────────────────────

function jaccard(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 && tokensB.length === 0) return 1;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter(t => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─── Composite score ─────────────────────────────────────────────────────────

export interface FuzzyScore {
  score: number;          // 0.0 – 1.0 composite
  jaroWinklerScore: number;
  jaccardScore: number;
  materialMatch: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export function fuzzyScore(query: string, candidate: string): FuzzyScore {
  const nq = normalize(query);
  const nc = normalize(candidate);
  const tq = tokenize(query);
  const tc = tokenize(candidate);

  const jw  = jaroWinkler(nq, nc);
  const jac = jaccard(tq, tc);

  const mq = getMaterialClass(query);
  const mc = getMaterialClass(candidate);
  const materialMatch = mq !== null && mq === mc;
  const materialBonus = materialMatch ? 0.15 : 0;

  const score = Math.min(1, 0.5 * jac + 0.35 * jw + materialBonus);
  const confidence = score >= 0.80 ? 'high' : score >= 0.55 ? 'medium' : 'low';

  return { score, jaroWinklerScore: jw, jaccardScore: jac, materialMatch, confidence };
}

/** Find best match from a list of candidates */
export function bestMatch<T extends { name: string }>(
  query: string,
  candidates: T[]
): { item: T; score: FuzzyScore } | null {
  let best: { item: T; score: FuzzyScore } | null = null;

  for (const candidate of candidates) {
    const score = fuzzyScore(query, candidate.name);
    if (!best || score.score > best.score.score) {
      best = { item: candidate, score };
    }
  }

  // Return null if best score is too low to be meaningful
  return best && best.score.score >= 0.40 ? best : null;
}
