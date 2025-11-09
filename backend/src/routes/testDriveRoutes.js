import express from 'express';
import {
  bookTestDrive,
  getUserTestDrives,
  getAllTestDrivesController,
  deleteTestDrive,
} from '../controllers/testDriveController.js';

const router = express.Router();

router.get('/', getAllTestDrivesController); // GET /api/testdrive?userId=...
router.post('/', bookTestDrive); // POST /api/testdrive
router.get('/:userId', getUserTestDrives); // GET /api/testdrive/:userId
router.delete('/:id', deleteTestDrive); // DELETE /api/testdrive/:id

export default router;


