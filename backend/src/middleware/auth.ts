import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * What this does:
 * 1. Check if Authorization header exists
 * 2. Extract token from "Bearer <token>"
 * 3. Verify token is valid
 * 4. Attach user info to request object
 * 5. Allow request to continue
 * 
 * Usage: Add this middleware to any route that requires authentication
 * 
 * Example:
 * router.get('/tasks', authMiddleware, getTasks);
 *                      ^^^^^^^^^^^^^^
 *                      User must be logged in
 */

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Step 1: Get Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'No authentication token provided',
        },
      });
    }

    // Step 2: Extract token
    // Split "Bearer <token>" and get the token part
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_FORMAT',
          message: 'Invalid token format',
        },
      });
    }

    // Step 3: Verify token
    const decoded = verifyToken(token);

    // Step 4: Attach user info to request
    // Now any controller can access req.user.userId
    req.user = decoded;

    // Step 5: Continue to next middleware/controller
    next();

  } catch (error: any) {
    // Handle token errors
    if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};