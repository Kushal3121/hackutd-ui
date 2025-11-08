import express from 'express';
import {
  getAllCars,
  getCarById,
  filterCars,
} from '../controllers/carController.js';

const router = express.Router();

router.get('/', getAllCars); // /api/cars
router.get('/filter', filterCars); // /api/cars/filter?region=US&year=2024
router.get('/:id', getCarById); // /api/cars/CAR-1

export default router;
