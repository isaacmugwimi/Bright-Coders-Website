import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

import bcrypt from "bcryptjs";
import { courseTableSchema } from "./courseQueries.js";
import { blogTableSchema } from "./blogQueries.js";
import { testimonialTableSchema } from "./testimonialsQueries.js";
import { registrationTableSchema } from "./registrationQueries.js";

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

// ========================================
// 🔹 PostgreSQL Pool (Neon-friendly)
// ========================================

export const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  ssl: { rejectUnauthorized: false }, // REQUIRED for Neon/Remote DBs
  max: 10, // connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,

});

console.log("🟢 DB HOST:", PGHOST);

// Handle pool errors so they don't crash your server
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * 🔹 SQL Helper Function
 * Rewritten to be safe from SQL Injection and strictly use standard strings.
 */
export const sql = async (text, params = []) => {
  // CRITICAL FIX: Standard 'pg' driver does not support tagged templates.
  // This check prevents the "object is not extensible" error.
  if (typeof text !== "string") {
    throw new Error(
      "Query Error: The 'sql' helper expected a string but received an object. " +
        "Ensure you are NOT using backticks directly after the function name (sql`...`). " +
        "Use sql('QUERY', [params]) instead.",
    );
  }

  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error.message);
    throw error;
  }
};

// ========================================
// 🔹 Initialize Database & Tables
// ========================================

export async function initDb() {
  try {
    // 1. Admin Users Table
    await sql(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        profile_image_url TEXT,
        two_factor_enabled BOOLEAN DEFAULT false,
        two_factor_code VARCHAR(6),
        two_factor_expires TIMESTAMP,
        otp_attempts INTEGER DEFAULT 0,
        otp_last_sent TIMESTAMP,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Initialize schemas imported from other query files
    // Ensure those variables (courseTableSchema, etc.) are raw strings.
    await sql(courseTableSchema);
    await sql(blogTableSchema);
    await sql(registrationTableSchema);
    await sql(testimonialTableSchema);

    console.log("✅ All Tables Initialized Successfully");
  } catch (error) {
    console.error("❌ Error initializing DB:", error);
  }
}

// ========================================
// 🔹 User Queries (Secure Parameterized)
// ========================================

export async function createUser(
  full_name,
  email,
  password,
  profile_image_url = null,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await sql(
    `
    INSERT INTO admin_users 
      (full_name, email, password_hash, profile_image_url, two_factor_enabled)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, full_name, email, profile_image_url, two_factor_enabled, created_at;
    `,
    [full_name, email, hashedPassword, profile_image_url],
  );

  return result[0];
}

export async function findUserByEmail(email) {
  const result = await sql(`SELECT * FROM admin_users WHERE email = $1`, [
    email,
  ]);
  return result[0] || null;
}

export async function findUserById(id) {
  const result = await sql(
    `
    SELECT id, full_name, email, password_hash, profile_image_url,
           two_factor_enabled, created_at
    FROM admin_users
    WHERE id = $1
    `,
    [id],
  );
  return result[0] || null;
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function updateLastLogin(id) {
  try {
    await sql(
      `UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [id],
    );
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
}

export const countUsers = async () => {
  const result = await sql(`SELECT COUNT(*)::int AS total FROM admin_users`);
  return result[0]?.total || 0;
};

// ========================================
// 🔹 OTP Helpers (Secure Parameterized)
// ========================================

export const saveOTP = async (userId, otp, expiresAt) => {
  await sql(
    `
    UPDATE admin_users
    SET two_factor_code = $1,
        two_factor_expires = $2,
        otp_attempts = 0,
        otp_last_sent = CURRENT_TIMESTAMP
    WHERE id = $3
    `,
    [otp, expiresAt, userId],
  );
};

export const clearOTP = async (userId) => {
  await sql(
    `
    UPDATE admin_users
    SET two_factor_code = NULL,
        two_factor_expires = NULL
    WHERE id = $1
    `,
    [userId],
  );
};

export async function findUserByIdWithOTP(id) {
  const result = await sql(
    `
    SELECT id, full_name, email, profile_image_url,
           two_factor_code, two_factor_expires, created_at
    FROM admin_users
    WHERE id = $1
    `,
    [id],
  );
  return result[0] || null;
}

export const incrementOtpAttempts = async (userId) => {
  await sql(
    `UPDATE admin_users SET otp_attempts = otp_attempts + 1 WHERE id = $1`,
    [userId],
  );
};

export const resetOtpAttempts = async (userId) => {
  await sql(`UPDATE admin_users SET otp_attempts = 0 WHERE id = $1`, [userId]);
};
