import {
  addTestDrive,
  getAllTestDrives,
  getTestDrivesByUser,
  deleteTestDrive as deleteById,
  updateTestDrive as updateById,
} from '../models/testDriveModel.js';

const randomEta = () => 3 + Math.floor(Math.random() * 5); // 3-7

function parseAppointment({ appointmentAt, date, time }) {
  // Prefer appointmentAt if provided; else combine date + time (local)
  if (appointmentAt) {
    const d = new Date(appointmentAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (date && time) {
    const combined = new Date(`${date}T${time}`);
    return Number.isNaN(combined.getTime()) ? null : combined;
  }
  return null;
}

export const bookTestDrive = async (req, res) => {
  try {
    const {
      userId,
      carId,
      carName,
      color,
      packages = [],
      totalPrice,
      appointmentAt,
      date,
      time,
    } =
      req.body ?? {};

    if (!userId || !carId || !carName)
      return res
        .status(400)
        .json({ error: 'userId, carId and carName are required' });

    const appt = parseAppointment({ appointmentAt, date, time });
    if (!appt)
      return res
        .status(400)
        .json({ error: 'appointment date/time is required' });
    if (appt.getTime() < Date.now())
      return res
        .status(400)
        .json({ error: 'appointment must be in the future' });

    const base = {
      userId,
      carId,
      carName,
      color: color ?? null,
      packages: Array.isArray(packages) ? packages : [],
      totalPrice: Number.isFinite(totalPrice) ? totalPrice : null,
      status: 'booked',
      etaDays: randomEta(),
      bookedAt: new Date().toISOString(),
    };
    const withAppt = {
      ...base,
      appointmentAt: appt.toISOString(),
    };
    const record = await addTestDrive(withAppt);
    res.status(201).json(record);
  } catch (e) {
    res.status(500).json({ error: 'Failed to book test drive' });
  }
};

export const getUserTestDrives = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const list = await getTestDrivesByUser(userId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch test drives' });
  }
};

export const getAllTestDrivesController = async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const list = await getTestDrivesByUser(userId);
      return res.json(list);
    }
    const list = await getAllTestDrives();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch test drives' });
  }
};

export const deleteTestDrive = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id required' });
    const ok = await deleteById(id);
    if (!ok) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete test drive' });
  }
};

export const updateTestDriveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id required' });
    const { appointmentAt, date, time } = req.body ?? {};
    const appt = parseAppointment({ appointmentAt, date, time });
    if (!appt)
      return res
        .status(400)
        .json({ error: 'appointment date/time is required' });
    if (appt.getTime() < Date.now())
      return res
        .status(400)
        .json({ error: 'appointment must be in the future' });
    const updated = await updateById(id, { appointmentAt: appt.toISOString() });
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update test drive' });
  }
};


