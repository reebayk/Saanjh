import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

// Secret key for JWT (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRY = '7d'; // Token valid for 7 days

/**
 * REGISTER NEW USER
 * 
 * What this does:
 * 1. Check if email already exists
 * 2. Hash the password (bcrypt turns "password123" into "$2b$10$...")
 * 3. Create user in database
 * 4. Generate JWT token
 * 5. Return user info (without password!) + token
 */
export const registerUser = async (email: string, password: string, name: string) => {
  // Step 1: Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('EMAIL_EXISTS'); // We'll handle this error in controller
  }

  // Step 2: Hash password
  // bcrypt.hash(password, saltRounds)
  // saltRounds = how many times to hash (10 is standard, secure enough)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 3: Create user in database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // Store HASHED password, never plain text!
      name,
    },
  });

  // Step 4: Generate JWT token
  // jwt.sign(payload, secret, options)
  // Payload = data to include in token (user ID, email)
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  // Step 5: Return user (without password) and token
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * LOGIN USER
 * 
 * What this does:
 * 1. Find user by email
 * 2. Compare provided password with hashed password in DB
 * 3. If match, generate JWT token
 * 4. Return user info + token
 */
export const loginUser = async (email: string, password: string) => {
  // Step 1: Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS'); // Don't reveal if email exists (security)
  }

  // Step 2: Compare passwords
  // bcrypt.compare(plainPassword, hashedPassword)
  // Returns true if they match, false otherwise
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // Step 3: Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  // Step 4: Return user (without password) and token
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * VERIFY TOKEN
 * 
 * What this does:
 * 1. Decode JWT token
 * 2. Check if it's valid and not expired
 * 3. Return user ID from token
 * 
 * Used in middleware to protect routes
 */
export const verifyToken = (token: string): { userId: string; email: string } => {
  try {
    // jwt.verify(token, secret)
    // Throws error if token is invalid or expired
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error('INVALID_TOKEN');
  }
};