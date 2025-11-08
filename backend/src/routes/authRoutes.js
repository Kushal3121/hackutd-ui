import express from 'express';
import {
  signup,
  login,
  resetPassword,
  listUsers,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/users', listUsers);

export default router;
