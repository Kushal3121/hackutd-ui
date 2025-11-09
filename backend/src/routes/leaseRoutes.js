import express from 'express';
import {
  listLeaseCars,
  getLeaseCar,
  createLease,
  updateLease,
  deleteLease,
  bookLease,
  listBookings,
  deleteBooking,
} from '../controllers/leaseController.js';

const router = express.Router();

// IMPORTANT: Define specific routes BEFORE dynamic '/:id' to avoid route conflicts
// Lease listings
router.get('/', listLeaseCars); // GET /api/lease
// Lease bookings
router.post('/book', bookLease); // POST /api/lease/book
router.get('/bookings', listBookings); // GET /api/lease/bookings?userId=...
router.delete('/bookings/:id', deleteBooking); // DELETE /api/lease/bookings/:id
// Lease inventory CRUD
router.post('/', createLease); // POST /api/lease
router.put('/:id', updateLease); // PUT /api/lease/:id
router.get('/:id', getLeaseCar); // GET /api/lease/:id
router.delete('/:id', deleteLease); // DELETE /api/lease/:id

export default router;


