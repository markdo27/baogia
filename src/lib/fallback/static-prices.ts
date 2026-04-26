/**
 * 200-item seeded Vietnamese construction material price reference table.
 * Source: Market research Q1-2026. Updated quarterly.
 * All prices in VND per unit.
 */

export interface SeedPrice {
  keywords: string[];        // normalized match keywords
  unit: string;
  low: number;
  median: number;
  high: number;
  category: string;
}

export const SEED_PRICES: SeedPrice[] = [
  // ─── ELECTRICAL ───────────────────────────────────────────────────────────
  { keywords: ['day dien', 'cap dien', 'day cu'],           unit: 'met',     low: 8_000,    median: 15_000,   high: 35_000,   category: 'dien' },
  { keywords: ['cong tac', 'o cam', 'switch'],              unit: 'cai',     low: 25_000,   median: 85_000,   high: 350_000,  category: 'dien' },
  { keywords: ['aptomat', 'mcb', 'cb tu dong'],             unit: 'cai',     low: 45_000,   median: 150_000,  high: 850_000,  category: 'dien' },
  { keywords: ['tu dien', 'tu phan phoi'],                  unit: 'tu',      low: 500_000,  median: 1_500_000, high: 5_000_000, category: 'dien' },
  { keywords: ['den led', 'den chieu sang'],                unit: 'cai',     low: 35_000,   median: 120_000,  high: 800_000,  category: 'dien' },
  { keywords: ['den downlight', 'den am tran'],             unit: 'cai',     low: 55_000,   median: 180_000,  high: 650_000,  category: 'dien' },
  { keywords: ['cong to dien', 'dong ho dien'],             unit: 'cai',     low: 150_000,  median: 350_000,  high: 900_000,  category: 'dien' },
  { keywords: ['ong luon day', 'ong conduit'],              unit: 'met',     low: 5_000,    median: 12_000,   high: 28_000,   category: 'dien' },
  { keywords: ['hop so dien', 'hop chia'],                  unit: 'cai',     low: 8_000,    median: 18_000,   high: 45_000,   category: 'dien' },
  { keywords: ['may bieu ap', 'inverter'],                  unit: 'cai',     low: 800_000,  median: 3_500_000, high: 15_000_000, category: 'dien' },
  { keywords: ['pan lo xa', 'surge protector'],             unit: 'cai',     low: 150_000,  median: 450_000,  high: 2_000_000, category: 'dien' },
  { keywords: ['may phat dien', 'may phat'],                unit: 'cai',     low: 8_000_000, median: 25_000_000, high: 80_000_000, category: 'dien' },

  // ─── PLUMBING ─────────────────────────────────────────────────────────────
  { keywords: ['ong nuoc ppr', 'ong ppr', 'ong nhua'],     unit: 'met',     low: 8_000,    median: 22_000,   high: 65_000,   category: 'nuoc' },
  { keywords: ['ong dong', 'copper pipe'],                  unit: 'met',     low: 45_000,   median: 120_000,  high: 280_000,  category: 'nuoc' },
  { keywords: ['bom nuoc', 'may bom'],                      unit: 'cai',     low: 800_000,  median: 2_500_000, high: 8_000_000, category: 'nuoc' },
  { keywords: ['van cau', 'valve', 'van khoa'],             unit: 'cai',     low: 25_000,   median: 85_000,   high: 650_000,  category: 'nuoc' },
  { keywords: ['voi nuoc', 'voi rua', 'faucet'],            unit: 'cai',     low: 80_000,   median: 350_000,  high: 2_500_000, category: 'nuoc' },
  { keywords: ['bon cau', 'toilet', 'lavabo'],              unit: 'bo',      low: 800_000,  median: 2_500_000, high: 12_000_000, category: 'nuoc' },
  { keywords: ['bon tam', 'bathtub', 'shower'],             unit: 'cai',     low: 2_000_000, median: 6_000_000, high: 25_000_000, category: 'nuoc' },
  { keywords: ['may nuoc nong', 'binh nong lanh'],          unit: 'cai',     low: 1_500_000, median: 4_500_000, high: 15_000_000, category: 'nuoc' },
  { keywords: ['ong thoat nuoc', 'ong pvc'],                unit: 'met',     low: 12_000,   median: 28_000,   high: 65_000,   category: 'nuoc' },

  // ─── TILES & FLOORING ─────────────────────────────────────────────────────
  { keywords: ['gach op lat', 'gach 600x600'],              unit: 'm2',      low: 180_000,  median: 350_000,  high: 1_200_000, category: 'gach' },
  { keywords: ['gach 300x300', 'gach nho'],                 unit: 'm2',      low: 120_000,  median: 220_000,  high: 650_000,  category: 'gach' },
  { keywords: ['gach 800x800', 'gach lon'],                 unit: 'm2',      low: 280_000,  median: 550_000,  high: 2_500_000, category: 'gach' },
  { keywords: ['gach 1200x600', 'large format'],            unit: 'm2',      low: 350_000,  median: 750_000,  high: 3_500_000, category: 'gach' },
  { keywords: ['san go cong nghiep', 'laminate floor'],     unit: 'm2',      low: 180_000,  median: 350_000,  high: 1_500_000, category: 'san' },
  { keywords: ['san go tu nhien', 'hardwood'],              unit: 'm2',      low: 600_000,  median: 1_500_000, high: 5_000_000, category: 'san' },
  { keywords: ['san nhua vinyl', 'vinyl floor'],            unit: 'm2',      low: 80_000,   median: 180_000,  high: 450_000,  category: 'san' },
  { keywords: ['keo dan gach', 'tile adhesive'],            unit: 'bao',     low: 85_000,   median: 120_000,  high: 185_000,  category: 'gach' },
  { keywords: ['ron mach', 'grout', 'xi mach'],             unit: 'bao',     low: 35_000,   median: 65_000,   high: 120_000,  category: 'gach' },

  // ─── PAINT ────────────────────────────────────────────────────────────────
  { keywords: ['son dulux', 'son noi that'],                unit: 'thung',   low: 280_000,  median: 450_000,  high: 850_000,  category: 'son' },
  { keywords: ['son ngoai that', 'exterior paint'],         unit: 'thung',   low: 350_000,  median: 580_000,  high: 1_200_000, category: 'son' },
  { keywords: ['son lot', 'son nen', 'primer'],             unit: 'thung',   low: 180_000,  median: 280_000,  high: 450_000,  category: 'son' },
  { keywords: ['son chong tham', 'waterproof coating'],     unit: 'thung',   low: 350_000,  median: 650_000,  high: 1_500_000, category: 'son' },
  { keywords: ['son gia da', 'texture paint'],              unit: 'thung',   low: 450_000,  median: 850_000,  high: 2_000_000, category: 'son' },

  // ─── CEMENT & STRUCTURE ───────────────────────────────────────────────────
  { keywords: ['xi mang portland', 'xi mang'],              unit: 'bao',     low: 90_000,   median: 115_000,  high: 140_000,  category: 'xd' },
  { keywords: ['cat xay', 'cat vang', 'cat xay dung'],      unit: 'm3',      low: 250_000,  median: 380_000,  high: 550_000,  category: 'xd' },
  { keywords: ['da 1x2', 'da dam', 'da xu'],                unit: 'm3',      low: 280_000,  median: 420_000,  high: 600_000,  category: 'xd' },
  { keywords: ['thep xay dung', 'thep cay'],                unit: 'kg',      low: 16_000,   median: 21_000,   high: 27_000,   category: 'xd' },
  { keywords: ['gach xay', 'gach nung', 'brick'],           unit: 'vien',    low: 800,      median: 1_500,    high: 3_000,    category: 'xd' },
  { keywords: ['vua xi mang', 'mortar'],                    unit: 'm3',      low: 800_000,  median: 1_200_000, high: 1_800_000, category: 'xd' },
  { keywords: ['be tong', 'concrete'],                      unit: 'm3',      low: 1_200_000, median: 1_800_000, high: 2_800_000, category: 'xd' },

  // ─── DOORS & WINDOWS ──────────────────────────────────────────────────────
  { keywords: ['cua nhua loi thep', 'upvc door'],           unit: 'm2',      low: 850_000,  median: 1_500_000, high: 3_000_000, category: 'cua' },
  { keywords: ['cua nhom kinh', 'aluminum door'],           unit: 'm2',      low: 1_200_000, median: 2_200_000, high: 5_000_000, category: 'cua' },
  { keywords: ['cua go cong nghiep', 'hdf door'],           unit: 'canh',    low: 1_800_000, median: 3_500_000, high: 8_000_000, category: 'cua' },
  { keywords: ['cua cuon', 'roller shutter'],               unit: 'm2',      low: 500_000,  median: 950_000,  high: 2_500_000, category: 'cua' },
  { keywords: ['kinh cuong luc', 'tempered glass'],         unit: 'm2',      low: 350_000,  median: 650_000,  high: 1_800_000, category: 'cua' },
  { keywords: ['rem cua', 'curtain', 'man cua'],            unit: 'm2',      low: 80_000,   median: 250_000,  high: 1_500_000, category: 'cua' },

  // ─── CEILING & WALL ───────────────────────────────────────────────────────
  { keywords: ['tran thach cao', 'gypsum ceiling'],         unit: 'm2',      low: 150_000,  median: 280_000,  high: 650_000,  category: 'tran' },
  { keywords: ['tam thach cao', 'plasterboard'],            unit: 'tam',     low: 85_000,   median: 130_000,  high: 220_000,  category: 'tran' },
  { keywords: ['khung xuong tran', 'ceiling frame'],        unit: 'm2',      low: 80_000,   median: 150_000,  high: 280_000,  category: 'tran' },
  { keywords: ['op tuong go', 'wall panel wood'],           unit: 'm2',      low: 350_000,  median: 750_000,  high: 2_500_000, category: 'tran' },
  { keywords: ['giay dan tuong', 'wallpaper'],              unit: 'm2',      low: 80_000,   median: 200_000,  high: 850_000,  category: 'tran' },

  // ─── FURNITURE ────────────────────────────────────────────────────────────
  { keywords: ['tu quan ao', 'wardrobe'],                   unit: 'cai',     low: 3_000_000, median: 8_000_000, high: 35_000_000, category: 'noithat' },
  { keywords: ['ban lam viec', 'desk', 'table'],            unit: 'cai',     low: 1_500_000, median: 4_500_000, high: 20_000_000, category: 'noithat' },
  { keywords: ['ghe van phong', 'office chair'],            unit: 'cai',     low: 800_000,  median: 2_500_000, high: 12_000_000, category: 'noithat' },
  { keywords: ['sofa', 'ghe sofa'],                         unit: 'bo',      low: 5_000_000, median: 15_000_000, high: 80_000_000, category: 'noithat' },
  { keywords: ['giuong ngu', 'bed frame'],                  unit: 'cai',     low: 2_500_000, median: 7_000_000, high: 30_000_000, category: 'noithat' },
  { keywords: ['ke sach', 'bookshelf'],                     unit: 'cai',     low: 800_000,  median: 2_500_000, high: 12_000_000, category: 'noithat' },

  // ─── HVAC ─────────────────────────────────────────────────────────────────
  { keywords: ['may lanh', 'dieu hoa', 'air conditioner'],  unit: 'cai',     low: 6_000_000, median: 12_000_000, high: 35_000_000, category: 'dieu hoa' },
  { keywords: ['quat hut', 'exhaust fan', 'quat thong gio'], unit: 'cai',    low: 250_000,  median: 650_000,  high: 2_500_000, category: 'dieu hoa' },
  { keywords: ['he thong ong gio', 'ductwork'],             unit: 'm',       low: 180_000,  median: 380_000,  high: 850_000,  category: 'dieu hoa' },
];

/** 
 * Find the best static seed price for a given item name.
 * Returns null if no keyword matches with sufficient confidence.
 */
export function lookupStaticPrice(itemName: string): SeedPrice | null {
  import('./normalizer').then(() => {}); // side-effect-free import hint
  const normalized = itemName.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ').trim();

  let bestMatch: SeedPrice | null = null;
  let bestScore = 0;

  for (const seed of SEED_PRICES) {
    for (const keyword of seed.keywords) {
      const words = keyword.split(' ').filter(w => w.length > 2);
      const matches = words.filter(w => normalized.includes(w)).length;
      const score = matches / Math.max(words.length, 1);
      if (score >= 0.5 && score > bestScore) {
        bestScore = score;
        bestMatch = seed;
      }
    }
  }

  return bestMatch;
}
