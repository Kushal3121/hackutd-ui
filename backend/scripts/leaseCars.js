/**
 * Generate mock Toyota lease-available cars dataset (~100 entries)
 * Author: Kushal C | HackUTD 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// 1️⃣ Base Lease-Eligible Models (consistent with car dataset)
// -------------------------
const leaseEligibleModels = [
  { modelCode: 'COROLLA', name: 'Toyota Corolla', type: 'Sedan' },
  { modelCode: 'CAMRY', name: 'Toyota Camry', type: 'Sedan' },
  { modelCode: 'RAV4', name: 'Toyota RAV4', type: 'SUV' },
  { modelCode: 'HIGHLANDER', name: 'Toyota Highlander', type: 'SUV' },
  { modelCode: 'TACOMA', name: 'Toyota Tacoma', type: 'Truck' },
  { modelCode: 'PRIUS', name: 'Toyota Prius', type: 'Hybrid' },
  { modelCode: 'GRCOROLLA', name: 'Toyota GR Corolla', type: 'Performance' },
  { modelCode: 'CROWN', name: 'Toyota Crown', type: 'Sedan' },
  { modelCode: 'LANDCRUISER', name: 'Toyota Land Cruiser', type: 'SUV' },
  { modelCode: 'TUNDRA', name: 'Toyota Tundra', type: 'Truck' },
];

// -------------------------
// 2️⃣ Supporting Data
// -------------------------
const regions = ['US', 'Canada', 'EU'];
const locations = {
  US: ['Dallas, TX', 'Los Angeles, CA', 'Chicago, IL', 'New York, NY'],
  Canada: ['Toronto, ON', 'Vancouver, BC', 'Montreal, QC'],
  EU: ['Berlin, Germany', 'Paris, France', 'Rome, Italy'],
};

const leaseTypes = ['short-term', 'long-term'];
const insurancePlans = [
  { name: 'Basic', dailyFee: 10 },
  { name: 'Premium', dailyFee: 18 },
  { name: 'Full Coverage', dailyFee: 25 },
];

// -------------------------
// 3️⃣ Generate Lease Inventory (~100 entries total)
// -------------------------
const leaseInventory = [];
let leaseId = 1;
const targetCount = 100;
const entriesPerModel = Math.floor(targetCount / leaseEligibleModels.length);

for (const model of leaseEligibleModels) {
  for (let i = 0; i < entriesPerModel; i++) {
    const region = regions[i % regions.length];
    const leaseType = leaseTypes[Math.floor(Math.random() * leaseTypes.length)];

    const baseRate =
      model.type === 'SUV'
        ? 90
        : model.type === 'Truck'
        ? 100
        : model.type === 'Performance'
        ? 120
        : model.type === 'Hybrid'
        ? 80
        : 70;

    const dailyRate = Math.round(baseRate * (0.9 + Math.random() * 0.2));
    const monthlyRate = Math.round(dailyRate * 28 * 0.85);
    const selectedInsurance =
      insurancePlans[Math.floor(Math.random() * insurancePlans.length)];
    const location =
      locations[region][Math.floor(Math.random() * locations[region].length)];

    const minLeaseDays = leaseType === 'short-term' ? 1 : 30;
    const maxLeaseDays = leaseType === 'short-term' ? 14 : 365;

    const leaseCar = {
      id: `LEASE-${leaseId++}`,
      modelCode: model.modelCode,
      carName: model.name,
      region,
      leaseType,
      dailyRate,
      monthlyRate,
      minLeaseDays,
      maxLeaseDays,
      insuranceIncluded: Math.random() > 0.3,
      selectedInsurance: selectedInsurance.name,
      insuranceCostPerDay: selectedInsurance.dailyFee,
      mileageLimitPerDay: 200 + Math.floor(Math.random() * 50),
      location,
      availabilityStatus: Math.random() > 0.1 ? 'available' : 'unavailable',
      bookedDates: [],
      media: {
        hero: `/images/${model.modelCode.toLowerCase()}.jpg`,
      },
    };

    leaseInventory.push(leaseCar);
  }
}

// -------------------------
// 🔀 Shuffle Lease Inventory
// -------------------------
for (let i = leaseInventory.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [leaseInventory[i], leaseInventory[j]] = [
    leaseInventory[j],
    leaseInventory[i],
  ];
}

// -------------------------
// 4️⃣ Save JSON File
// -------------------------
const outDir = path.join(__dirname, '../data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'leaseCars.json'),
  JSON.stringify(leaseInventory, null, 2),
  'utf-8'
);

console.log(
  `Generated ${leaseInventory.length} lease-available cars (shuffled).`
);
