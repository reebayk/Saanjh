import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * AUTH ROUTES
 * 
 * POST /api/auth/register - Create new user account
 * POST /api/auth/login    - Login existing user
 */

// Register route
// Anyone can access (no authentication required)
router.post('/register', register);

// Login route
// Anyone can access (no authentication required)
router.post('/login', login);

export default router;