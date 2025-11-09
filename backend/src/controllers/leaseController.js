import {
  initLeases,
  getAllLeaseCars,
  getLeaseCarById,
  createLeaseCar,
  updateLeaseCar,
  deleteLeaseCar,
  createLeaseBooking,
  getLeaseBookingsByUser,
  deleteLeaseBooking as removeLeaseBooking,
} from '../models/leaseModel.js';

export { initLeases };

export const listLeaseCars = async (req, res) => {
  try {
    const { name, region, availability, location } = req.query;
    const data = await getAllLeaseCars({
      name,
      region,
      availability,
      location,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch lease cars' });
  }
};

export const getLeaseCar = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getLeaseCarById(id);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch lease car' });
  }
};

export const createLease = async (req, res) => {
  try {
    const {
      carId,
      carName,
      region,
      leaseType,
      dailyRate,
      monthlyRate,
      minLeaseDays,
      maxLeaseDays,
      location,
      availabilityStatus,
    } = req.body ?? {};

    if (!carId || !carName || !region) {
      return res
        .status(400)
        .json({ error: 'carId, carName and region are required' });
    }

    const payload = {
      carId,
      carName,
      region,
      leaseType: leaseType ?? 'short-term',
      dailyRate: Number.isFinite(dailyRate) ? dailyRate : null,
      monthlyRate: Number.isFinite(monthlyRate) ? monthlyRate : null,
      minLeaseDays: Number.isFinite(minLeaseDays) ? minLeaseDays : null,
      maxLeaseDays: Number.isFinite(maxLeaseDays) ? maxLeaseDays : null,
      location: location ?? null,
      availabilityStatus: availabilityStatus ?? 'available',
    };

    const created = await createLeaseCar(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create lease car' });
  }
};

export const updateLease = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateLeaseCar(id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update lease car' });
  }
};

export const deleteLease = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await deleteLeaseCar(id);
    if (!ok) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete lease car' });
  }
};

// --- Bookings ---
function parseDate(dateStr) {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export const bookLease = async (req, res) => {
  try {
    const { userId, leaseId, startDate, endDate, insurancePlan } = req.body ?? {};
    if (!userId || !leaseId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'userId, leaseId, startDate, endDate are required' });
    }

    const lease = await getLeaseCarById(leaseId);
    if (!lease) return res.status(404).json({ error: 'lease not found' });

    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e || e.getTime() < s.getTime()) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const numDays = daysBetween(s, e);
    const minDays = Number(lease.minLeaseDays ?? 0);
    const maxDays = Number(lease.maxLeaseDays ?? Number.MAX_SAFE_INTEGER);
    if (Number.isFinite(minDays) && numDays < minDays) {
      return res
        .status(400)
        .json({ error: `Minimum lease days is ${minDays}` });
    }
    if (Number.isFinite(maxDays) && numDays > maxDays) {
      return res
        .status(400)
        .json({ error: `Maximum lease days is ${maxDays}` });
    }

    const booking = await createLeaseBooking({
      userId,
      leaseId,
      startDate: s.toISOString(),
      endDate: e.toISOString(),
      insurancePlan: insurancePlan ?? null,
      carName: lease.carName,
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create lease booking' });
  }
};

export const listBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const list = await getLeaseBookingsByUser(userId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await removeLeaseBooking(id);
    if (!ok) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};


