import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "./env.js";

/**
 * Generate a JWT token for a user
 *
 * @param {Object} user - User object with at least id and email
 * @returns {string} JWT token
 */
export function generateToken(user) {
  const payload = {
    userId: user.id || "test-user-id",
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

/**
 * Verify and decode a JWT token
 *
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

/**
 * Create a test user with token for testing
 *
 * @param {Object} customUser - Optional custom user properties
 * @returns {Object} Test user with token
 */
export function createTestUser(customUser = {}) {
  const defaultUser = {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
  };

  const user = { ...defaultUser, ...customUser };
  const token = generateToken(user);

  return {
    user,
    token,
    authHeader: { Authorization: `Bearer ${token}` },
  };
}
