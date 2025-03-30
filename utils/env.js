import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

// Load environment variables from .env file
const envPath = resolve(rootDir, ".env");

if (!existsSync(envPath)) {
  console.warn(`Warning: .env file not found at ${envPath}`);
}

dotenv.config({ path: envPath });

// Export environment variables with defaults
export const API_URL = process.env.API_URL || "http://localhost:3000";
export const API_VERSION = process.env.API_VERSION || "v1";
export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
export const TEST_USER_EMAIL =
  process.env.TEST_USER_EMAIL || "test@example.com";
export const TEST_USER_PASSWORD =
  process.env.TEST_USER_PASSWORD || "password123";

// Function to validate required environment variables
export function validateEnv() {
  const requiredEnvVars = ["JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
        "Please check your .env file or set these variables in your environment."
    );
  }
}
