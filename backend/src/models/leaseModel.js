import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const leaseCarsFile = path.join(dataDir, 'leaseCars.json');
const userLeasesFile = path.join(dataDir, 'userLeases.json');

let leaseCars = [];
let leaseBookings = [];
let userLeases = [];

export async function initLeases() {
  try {
    await fs.ensureDir(dataDir);
    if (await fs.pathExists(leaseCarsFile)) {
      leaseCars = await fs.readJson(leaseCarsFile);
      console.log(`Loaded ${leaseCars.length} lease-available cars`);
    } else {
      await fs.writeJson(leaseCarsFile, [], { spaces: 2 });
      leaseCars = [];
      console.log('Initialized empty leaseCars.json');
    }
    // bookings are in-memory only (not persisted) for now
    leaseBookings = [];
    // userLeases persistent file
    if (await fs.pathExists(userLeasesFile)) {
      userLeases = await fs.readJson(userLeasesFile);
      console.log(`Loaded ${userLeases.length} user lease bookings`);
    } else {
      await fs.writeJson(userLeasesFile, [], { spaces: 2 });
      userLeases = [];
      console.log('Initialized empty userLeases.json');
    }
  } catch (err) {
    console.error('Failed to initialize leases:', err);
    leaseCars = [];
    leaseBookings = [];
    userLeases = [];
  }
}

async function saveLeaseCars() {
  try {
    await fs.writeJson(leaseCarsFile, leaseCars, { spaces: 2 });
    console.log('leaseCars.json saved successfully');
  } catch (err) {
    console.error('Failed to save lease cars:', err);
  }
}

async function saveUserLeases() {
  try {
    await fs.writeJson(userLeasesFile, userLeases, { spaces: 2 });
    console.log('userLeases.json saved successfully');
  } catch (err) {
    console.error('Failed to save user leases:', err);
  }
}

function nextLeaseId() {
  const maxNum = leaseCars.reduce((max, l) => {
    const n = parseInt(String(l.id || '').split('-')[1], 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `LEASE-${maxNum + 1}`;
}

function nextBookingId() {
  const maxNum = leaseBookings.reduce((max, b) => {
    const n = parseInt(String(b.id || '').split('-')[1], 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `LB-${maxNum + 1}`;
}

function nextUserLeaseId() {
  const maxNum = userLeases.reduce((max, b) => {
    const n = parseInt(String(b.id || '').split('-')[1], 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `LB-${maxNum + 1}`;
}

export async function getAllLeaseCars(filters = {}) {
  const { name, region, availability, location } = filters;
  let result = leaseCars;
  if (name) {
    const q = String(name).toLowerCase();
    result = result.filter((c) =>
      String(c.carName || '')
        .toLowerCase()
        .includes(q)
    );
  }
  if (region) {
    result = result.filter((c) => String(c.region) === String(region));
  }
  if (availability) {
    result = result.filter(
      (c) =>
        String(c.availabilityStatus).toLowerCase() ===
        String(availability).toLowerCase()
    );
  }
  if (location) {
    const loc = String(location).toLowerCase().trim();
    result = result.filter(
      (c) =>
        String(c.location || '')
          .toLowerCase()
          .trim() === loc
    );
  }
  return result;
}

export async function getLeaseCarById(id) {
  return leaseCars.find((c) => c.id === id) || null;
}

export async function createLeaseCar(payload) {
  const withId = { id: nextLeaseId(), ...payload };
  leaseCars.push(withId);
  await saveLeaseCars();
  return withId;
}

export async function updateLeaseCar(id, updates) {
  const idx = leaseCars.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  // Only allow updating availability, pricing and location related fields
  const allowed = [
    'availabilityStatus',
    'dailyRate',
    'monthlyRate',
    'location',
    'minLeaseDays',
    'maxLeaseDays',
    'leaseType',
  ];
  const current = leaseCars[idx];
  const next = { ...current };
  for (const key of allowed) {
    if (key in updates) next[key] = updates[key];
  }
  leaseCars[idx] = next;
  await saveLeaseCars();
  return next;
}

export async function deleteLeaseCar(id) {
  const idx = leaseCars.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  leaseCars.splice(idx, 1);
  await saveLeaseCars();
  return true;
}

export async function createLeaseBooking({
  userId,
  leaseId,
  startDate,
  endDate,
  insurancePlan,
  carName,
}) {
  const booking = {
    id: nextBookingId(),
    userId,
    leaseId,
    carName: carName ?? null,
    startDate,
    endDate,
    insurancePlan: insurancePlan ?? null,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  leaseBookings.push(booking);
  return booking;
}

export async function getLeaseBookingsByUser(userId) {
  return leaseBookings.filter((b) => b.userId === userId);
}

export async function deleteLeaseBooking(id) {
  const idx = leaseBookings.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  leaseBookings.splice(idx, 1);
  return true;
}

// --- New helpers for /api/leasecars & /api/myleases ---
export async function listLeaseCarsAvailableOnly() {
  return leaseCars.filter(
    (c) => String(c.availabilityStatus).toLowerCase() === 'available'
  );
}

export async function getLeaseCarItem(id) {
  return leaseCars.find((c) => c.id === id) || null;
}

export async function confirmLeaseAndPersist({
  userId,
  leaseId,
  startDate, // ISO string (yyyy-mm-dd or ISO)
  durationDays,
}) {
  const car = leaseCars.find((c) => c.id === leaseId);
  if (!car) return { error: 'Lease car not found' };
  const isAvailable =
    String(car.availabilityStatus).toLowerCase() === 'available';
  if (!isAvailable) return { error: 'Car currently unavailable for lease' };

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return { error: 'Invalid startDate' };
  const days = Number(durationDays);
  if (!Number.isFinite(days) || days <= 0)
    return { error: 'Invalid durationDays' };
  const min = Number(car.minLeaseDays ?? 0);
  const max = Number(car.maxLeaseDays ?? Number.MAX_SAFE_INTEGER);
  if (days < min) return { error: `Minimum lease days is ${min}` };
  if (days > max) return { error: `Maximum lease days is ${max}` };

  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);

  // Update car availability and bookedDates
  const bookedRange = {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
  const idx = leaseCars.findIndex((c) => c.id === leaseId);
  if (idx !== -1) {
    const updated = {
      ...leaseCars[idx],
      availabilityStatus: 'unavailable',
      bookedDates: Array.isArray(leaseCars[idx].bookedDates)
        ? [...leaseCars[idx].bookedDates, bookedRange]
        : [bookedRange],
    };
    leaseCars[idx] = updated;
    await saveLeaseCars();
  }

  // Append to userLeases.json
  const record = {
    id: nextUserLeaseId(),
    userId,
    leaseId,
    carName: car.carName ?? null,
    startDate: bookedRange.startDate,
    endDate: bookedRange.endDate,
    durationDays: days,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  userLeases.push(record);
  await saveUserLeases();
  return { booking: record };
}

export async function getMyLeases(userId) {
  if (!userId) return userLeases;
  return userLeases.filter((b) => b.userId === userId);
}

export async function cancelLeaseByLeaseId(leaseId) {
  // set car available and clear bookedDates for that car
  const idx = leaseCars.findIndex((c) => c.id === leaseId);
  if (idx !== -1) {
    leaseCars[idx] = {
      ...leaseCars[idx],
      availabilityStatus: 'available',
      bookedDates: [],
    };
    await saveLeaseCars();
  }
  // remove all active bookings for that leaseId
  const before = userLeases.length;
  userLeases = userLeases.filter((b) => b.leaseId !== leaseId);
  if (userLeases.length !== before) await saveUserLeases();
  return true;
}
