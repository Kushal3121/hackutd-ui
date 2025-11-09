// Lightweight natural-language command parser for car search.
// Parses phrases like:
// - "hybrid suv under 30k in canada"
// - "compare camry and corolla"
// - "2025 gas sedan below 35k awd"
//
// Returns a structured object:
// {
//   action: "search" | "compare",
//   filters: {
//     models: ["Camry","Corolla"], // optional, multiple
//     model: "Camry",              // optional, single for convenience
//     maxPrice: 30000,             // number
//     drivetrain: "AWD",           // AWD | FWD | RWD | 4x4
//     powertrain: "Hybrid",        // Hybrid | Plug-in Hybrid | Gas | Electric
//     bodyType: "SUV",             // SUV | Sedan | Truck | Crossover | Performance | Coupe | Hatchback
//     region: "Canada",            // US | Canada | EU
//     year: 2025                   // number
//   }
// }

const BODY_TYPE_MAP = {
  suv: 'SUV',
  sedan: 'Sedan',
  truck: 'Truck',
  crossover: 'Crossover',
  performance: 'Performance',
  coupe: 'Coupe',
  hatchback: 'Hatchback',
};

const REGION_MAP = {
  us: 'US',
  usa: 'US',
  'united states': 'US',
  america: 'US',
  canada: 'Canada',
  ca: 'Canada',
  eu: 'EU',
  europe: 'EU',
};

const DRIVETRAIN_MAP = {
  awd: 'AWD',
  'all-wheel': 'AWD',
  'all wheel': 'AWD',
  '4x4': '4x4',
  '4wd': '4x4',
  fwd: 'FWD',
  'front-wheel': 'FWD',
  'front wheel': 'FWD',
  rwd: 'RWD',
  'rear-wheel': 'RWD',
  'rear wheel': 'RWD',
};

const POWERTRAIN_MAP = {
  hybrid: 'Hybrid',
  'plug-in hybrid': 'Plug-in Hybrid',
  phev: 'Plug-in Hybrid',
  gas: 'Gas',
  gasoline: 'Gas',
  petrol: 'Gas',
  electric: 'Electric',
  ev: 'Electric',
  'battery electric': 'Electric',
};

// Common Toyota models present in dataset; used to detect specific model mentions
const KNOWN_MODELS = [
  'Camry',
  'Corolla',
  'Corolla Cross',
  'Crown',
  'Prius',
  'RAV4',
  'Highlander',
  'Grand Highlander',
  'Sequoia',
  '4Runner',
  'Land Cruiser',
  'Tacoma',
  'Tundra',
  'Sienna',
  'GR Corolla',
  'GR Supra',
  'GR86',
  'Mirai',
  'bZ4X',
];

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function extractAction(lowerText) {
  if (/\bcompare\b/.test(lowerText) || /\bvs\b/.test(lowerText)) return 'compare';
  return 'search';
}

function extractYear(text) {
  const m = text.match(/\b(20\d{2})\b/);
  if (m) return Number(m[1]);
  return undefined;
}

function extractMaxPrice(text) {
  // Supports "under 30k", "below 35000", "<= 40k", "under $25,000"
  const normalized = text.replace(/[, ]/g, '').toLowerCase();
  // e.g., "under30k", "below35000", "<=40k"
  const m1 = normalized.match(/(?:under|below|<=|<)(\d+)(k)?/);
  if (m1) {
    const val = Number(m1[1]) * (m1[2] ? 1000 : 1);
    return Number.isFinite(val) ? val : undefined;
  }
  // "max 30k", "at most 28000"
  const m2 = normalized.match(/(?:max|atmost)(\d+)(k)?/);
  if (m2) {
    const val = Number(m2[1]) * (m2[2] ? 1000 : 1);
    return Number.isFinite(val) ? val : undefined;
  }
  return undefined;
}

function findFromMap(text, map) {
  const lower = text.toLowerCase();
  for (const key of Object.keys(map)) {
    const re = new RegExp(`\\b${key}\\b`, 'i');
    if (re.test(lower)) return map[key];
  }
  return undefined;
}

function extractModels(text) {
  // Detect any known model mentions; handle multi-word models
  const models = [];
  const hay = ` ${text} `.toLowerCase();
  for (const model of KNOWN_MODELS) {
    const needle = ` ${model.toLowerCase()} `;
    if (hay.includes(needle)) models.push(model);
  }
  // Also handle "compare X and Y" by splitting around 'compare', 'vs', 'and'
  if (models.length === 0) {
    const cmp = text.toLowerCase().split(/compare|vs/).pop();
    if (cmp) {
      const parts = cmp.split(/,|and|&/).map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        const canonical = KNOWN_MODELS.find(
          (m) => m.toLowerCase() === p || m.toLowerCase().includes(p)
        );
        if (canonical) models.push(canonical);
      }
    }
  }
  // Deduplicate
  return Array.from(new Set(models));
}

export function parseCommand(input) {
  const text = normalizeWhitespace(input);
  const lower = text.toLowerCase();

  const action = extractAction(lower);
  const year = extractYear(text);
  const maxPrice = extractMaxPrice(text);
  const drivetrain = findFromMap(text, DRIVETRAIN_MAP);
  const powertrain = findFromMap(text, POWERTRAIN_MAP);
  const bodyType = findFromMap(text, BODY_TYPE_MAP);
  const region = findFromMap(text, REGION_MAP);
  const models = extractModels(text);

  const filters = {};
  if (models.length > 0) {
    filters.models = models;
    filters.model = models[0];
  }
  if (typeof maxPrice === 'number') filters.maxPrice = maxPrice;
  if (drivetrain) filters.drivetrain = drivetrain;
  if (powertrain) filters.powertrain = powertrain;
  if (bodyType) filters.bodyType = bodyType;
  if (region) filters.region = region;
  if (year) filters.year = year;

  return { action, filters };
}

export default parseCommand;


