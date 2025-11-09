/**
 * Generate ~4k realistic Toyota car variants (US, Canada, EU)
 * Author: Kushal C | HackUTD 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// Base Model Definitions
// -------------------------
const baseModels = [
  {
    modelCode: 'COROLLA',
    name: 'Toyota Corolla',
    series: 'Sedan',
    baseMsrp: 22200,
    trims: ['L', 'LE', 'SE', 'XSE', 'Hybrid LE', 'Hybrid XLE'],
    powertrains: ['Gas', 'Hybrid'],
    drivetrains: ['FWD'],
  },
  {
    modelCode: 'CAMRY',
    name: 'Toyota Camry',
    series: 'Sedan',
    baseMsrp: 26950,
    trims: ['LE', 'SE', 'XLE', 'XSE', 'TRD', 'Hybrid LE', 'Hybrid XSE'],
    powertrains: ['Gas', 'Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'RAV4',
    name: 'Toyota RAV4',
    series: 'SUV',
    baseMsrp: 28975,
    trims: ['LE', 'XLE', 'Adventure', 'Limited', 'Hybrid XLE', 'Prime XSE'],
    powertrains: ['Gas', 'Hybrid', 'Plug-in Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'HIGHLANDER',
    name: 'Toyota Highlander',
    series: 'SUV',
    baseMsrp: 37755,
    trims: ['LE', 'XLE', 'XSE', 'Limited', 'Hybrid Limited'],
    powertrains: ['Gas', 'Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'GRANDHIGHLANDER',
    name: 'Toyota Grand Highlander',
    series: 'SUV',
    baseMsrp: 42900,
    trims: ['XLE', 'Limited', 'Platinum'],
    powertrains: ['Gas', 'Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: '4RUNNER',
    name: 'Toyota 4Runner',
    series: 'SUV',
    baseMsrp: 40755,
    trims: ['SR5', 'TRD Sport', 'Limited', 'TRD Pro'],
    powertrains: ['Gas'],
    drivetrains: ['RWD', '4x4'],
  },
  {
    modelCode: 'SEQUOIA',
    name: 'Toyota Sequoia',
    series: 'SUV',
    baseMsrp: 61375,
    trims: ['SR5', 'Limited', 'Platinum', 'Capstone'],
    powertrains: ['Hybrid i-FORCE MAX'],
    drivetrains: ['4x4'],
  },
  {
    modelCode: 'LANDCRUISER',
    name: 'Toyota Land Cruiser',
    series: 'SUV',
    baseMsrp: 55950,
    trims: ['1958', 'Land Cruiser', 'First Edition'],
    powertrains: ['Hybrid i-FORCE MAX'],
    drivetrains: ['4x4'],
  },
  {
    modelCode: 'TACOMA',
    name: 'Toyota Tacoma',
    series: 'Truck',
    baseMsrp: 31900,
    trims: ['SR', 'SR5', 'TRD Sport', 'TRD Off-Road', 'Limited', 'TRD Pro'],
    powertrains: ['Gas', 'Hybrid i-FORCE MAX'],
    drivetrains: ['RWD', '4x4'],
  },
  {
    modelCode: 'TUNDRA',
    name: 'Toyota Tundra',
    series: 'Truck',
    baseMsrp: 39465,
    trims: ['SR', 'SR5', 'Limited', 'Platinum', '1794 Edition', 'TRD Pro'],
    powertrains: ['Gas', 'Hybrid i-FORCE MAX'],
    drivetrains: ['RWD', '4x4'],
  },
  {
    modelCode: 'PRIUS',
    name: 'Toyota Prius',
    series: 'Hybrid',
    baseMsrp: 28475,
    trims: ['LE', 'XLE', 'Limited', 'Prime SE', 'Prime XSE'],
    powertrains: ['Hybrid', 'Plug-in Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'BZ4X',
    name: 'Toyota bZ4X',
    series: 'EV',
    baseMsrp: 42700,
    trims: ['XLE', 'Limited'],
    powertrains: ['Electric'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'GRSUPRA',
    name: 'Toyota GR Supra',
    series: 'Performance',
    baseMsrp: 47400,
    trims: ['2.0', '3.0', '3.0 Premium', '45th Anniversary'],
    powertrains: ['Gas'],
    drivetrains: ['RWD'],
  },
  {
    modelCode: 'GR86',
    name: 'Toyota GR86',
    series: 'Performance',
    baseMsrp: 29500,
    trims: ['Base', 'Premium', 'Trueno Edition'],
    powertrains: ['Gas'],
    drivetrains: ['RWD'],
  },
  {
    modelCode: 'GRCOROLLA',
    name: 'Toyota GR Corolla',
    series: 'Performance',
    baseMsrp: 36200,
    trims: ['Core', 'Circuit', 'Morizo'],
    powertrains: ['Gas'],
    drivetrains: ['AWD'],
  },
  {
    modelCode: 'CROWN',
    name: 'Toyota Crown',
    series: 'Sedan',
    baseMsrp: 39950,
    trims: ['XLE', 'Limited', 'Platinum'],
    powertrains: ['Hybrid'],
    drivetrains: ['AWD'],
  },
  {
    modelCode: 'MIRAI',
    name: 'Toyota Mirai',
    series: 'Hydrogen',
    baseMsrp: 49500,
    trims: ['XLE', 'Limited'],
    powertrains: ['Fuel Cell'],
    drivetrains: ['RWD'],
  },
  {
    modelCode: 'SIENNA',
    name: 'Toyota Sienna',
    series: 'Minivan',
    baseMsrp: 37685,
    trims: ['LE', 'XLE', 'Woodland Edition', 'Limited', 'Platinum'],
    powertrains: ['Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
  {
    modelCode: 'COROLLACROSS',
    name: 'Toyota Corolla Cross',
    series: 'Crossover',
    baseMsrp: 24300,
    trims: ['L', 'LE', 'XLE', 'Hybrid S', 'Hybrid SE', 'Hybrid XSE'],
    powertrains: ['Gas', 'Hybrid'],
    drivetrains: ['FWD', 'AWD'],
  },
];

// -------------------------
// Supporting Data
// -------------------------
const colors = [
  { name: 'Wind Chill Pearl', code: '089', extraCost: 425 },
  { name: 'Midnight Black Metallic', code: '218', extraCost: 0 },
  { name: 'Supersonic Red', code: '3U5', extraCost: 0 },
  { name: 'Blueprint', code: '8X8', extraCost: 0 },
  { name: 'Celestial Silver Metallic', code: '1J9', extraCost: 0 },
  { name: 'Ice Cap', code: '089W', extraCost: 0 },
];

const packages = [
  {
    name: 'Convenience Package',
    description: 'Power liftgate, moonroof',
    price: 1265,
  },
  {
    name: 'Premium Audio Package',
    description: 'JBL audio, 12.3-in display, navigation',
    price: 1895,
  },
  {
    name: 'Weather Package',
    description: 'Heated seats, heated steering wheel',
    price: 950,
  },
  {
    name: 'Towing Prep Package',
    description: 'Improved cooling, wiring harness',
    price: 750,
  },
];

const regions = {
  US: { currency: 'USD', multiplier: 1.0 },
  Canada: { currency: 'CAD', multiplier: 1.15 },
  EU: { currency: 'EUR', multiplier: 0.95 },
};

// -------------------------
// Generate Cars
// -------------------------
const cars = [];
let id = 1;

for (const model of baseModels) {
  for (const region in regions) {
    const { currency, multiplier } = regions[region];

    for (const trim of model.trims) {
      for (const powertrain of model.powertrains) {
        for (const drivetrain of model.drivetrains) {
          if (Math.random() > 0.5) continue;

          const year = 2024 + Math.floor(Math.random() * 2);
          const basePrice =
            model.baseMsrp +
            (trim.toLowerCase().includes('limited') ? 5000 : 0) +
            (trim.toLowerCase().includes('xle') ? 3500 : 0) +
            (trim.toLowerCase().includes('xse') ? 4000 : 0) +
            (trim.toLowerCase().includes('prime') ? 8000 : 0) +
            (powertrain.includes('Hybrid')
              ? 2500
              : powertrain.includes('Electric')
              ? 8500
              : 0) +
            (drivetrain.includes('AWD') || drivetrain.includes('4x4')
              ? 1800
              : 0);

          const msrp = Math.round(
            basePrice * (0.95 + Math.random() * 0.1) * multiplier
          );

          // 🎯 Randomize package selection (1–2 per car)
          const randomPackages = [...packages]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 2) + 1);

          const car = {
            id: `CAR-${id++}`,
            name: model.name,
            modelCode: model.modelCode,
            year,
            region,
            currency,
            series: model.series,
            trim,
            powertrain,
            drivetrain,
            msrp,
            priceRange: { min: msrp, max: Math.round(msrp * 1.1) },
            colors,
            packages: randomPackages,
            efficiency:
              powertrain === 'Electric'
                ? {
                    range_miles: 250 + Math.floor(Math.random() * 20),
                    charge_kw: 150,
                  }
                : powertrain.includes('Hybrid')
                ? {
                    city_mpg: 38 + Math.floor(Math.random() * 4),
                    hwy_mpg: 35 + Math.floor(Math.random() * 3),
                  }
                : {
                    city_mpg: 22 + Math.floor(Math.random() * 4),
                    hwy_mpg: 28 + Math.floor(Math.random() * 3),
                  },
            finance: {
              apr: 3.9,
              termMonths: [36, 48, 60],
              estimatedMonthly: Math.round(
                (msrp / 60) * (1.03 + Math.random() * 0.02)
              ),
            },
            lease: {
              dueAtSigning: 2999,
              termMonths: 36,
              monthly: Math.round(msrp / 90),
              milesPerYear: 12000,
            },
            media: {
              hero: `/images/${model.modelCode.toLowerCase()}.jpg`,
            },
            inventory: {
              location:
                region === 'US'
                  ? 'Dallas, TX'
                  : region === 'Canada'
                  ? 'Toronto, ON'
                  : 'Berlin, Germany',
              inStock: Math.floor(Math.random() * 10),
              deliveryEtaDays: 7 + Math.floor(Math.random() * 14),
            },
          };

          cars.push(car);
        }
      }
    }
  }
}

// -------------------------
// Shuffle order for randomness
// -------------------------
for (let i = cars.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [cars[i], cars[j]] = [cars[j], cars[i]];
}

// -------------------------
// Save JSON File
// -------------------------
const outDir = path.join(__dirname, '../data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'cars.json'),
  JSON.stringify(cars, null, 2),
  'utf-8'
);

console.log(
  `Generated ${cars.length} Toyota variants (shuffled with random packages).`
);
