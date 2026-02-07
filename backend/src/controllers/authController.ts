import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

/**
 * REGISTER CONTROLLER
 * 
 * Handles POST /api/auth/register
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePassword123",
 *   "name": "John Doe"
 * }
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    const { email, password, name } = req.body;

    // Validate input (basic check)
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, password, and name are required',
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
        },
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters',
        },
      });
    }

    // Call service to register user
    const result = await registerUser(email, password, name);

    // Send success response
    return res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });

  } catch (error: any) {
    // Handle specific errors
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already registered',
        },
      });
    }

    // Handle unexpected errors
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Registration failed',
      },
    });
  }
};

/**
 * LOGIN CONTROLLER
 * 
 * Handles POST /api/auth/login
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePassword123"
 * }
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    // Call service to login user
    const result = await loginUser(email, password);

    // Send success response
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });

  } catch (error: any) {
    // Handle specific errors
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Handle unexpected errors
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Login failed',
      },
    });
  }
};