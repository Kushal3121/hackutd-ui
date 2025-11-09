import express from 'express';
import {
  bookTestDrive,
  getUserTestDrives,
  getAllTestDrivesController,
  deleteTestDrive,
  updateTestDriveAppointment,
} from '../controllers/testDriveController.js';

const router = express.Router();

router.get('/', getAllTestDrivesController); // GET /api/testdrive?userId=...
router.post('/', bookTestDrive); // POST /api/testdrive
router.get('/:userId', getUserTestDrives); // GET /api/testdrive/:userId
router.delete('/:id', deleteTestDrive); // DELETE /api/testdrive/:id
router.put('/:id', updateTestDriveAppointment); // PUT /api/testdrive/:id

export default router;


