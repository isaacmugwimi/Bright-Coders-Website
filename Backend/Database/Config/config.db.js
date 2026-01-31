import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

import bcrypt from "bcryptjs";

// Table schemas
import { courseTableSchema } from "./courseQueries.js";
import { blogTableSchema } from "./blogQueries.js";
import { testimonialTableSchema } from "./testimonialsQueries.js";
import { registrationTableSchema } from "./registrationQueries.js";

// ========================================
// 🔹 Environment Variables
// ========================================

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT = 5432 } = process.env;

// ========================================
// 🔹 PostgreSQL Pool (Neon / Remote Safe)
// ========================================

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: PGPORT,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Neon
  },
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 20000,
  keepAlive: true,
});

console.log("🟢 DB HOST:", PGHOST);

// Prevent crashes on idle client errors
pool.on("error", (err) => {
  console.error("❌ Unexpected PG Pool Error:", err);
});

// ========================================
// 🔹 Query Helper (pg-style ONLY)
// ========================================

export const query = async (text, params = []) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("❌ Database Query Error:", error.message);
    throw error;
  }
};

// ========================================
// 🔹 Initialize Database & Tables
// ========================================

export const initDb = async () => {
  try {
    // Admin Users
    await query(`
          CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,

      is_active BOOLEAN DEFAULT TRUE,
      profile_image_url TEXT,

      -- LOGIN 2FA
      two_factor_enabled BOOLEAN DEFAULT false,
      two_factor_code VARCHAR(6),
      two_factor_expires TIMESTAMP,

      -- STEP-UP VERIFICATION
      otp_code VARCHAR(6),
      otp_expires TIMESTAMP,
      otp_attempts INTEGER DEFAULT 0,
      otp_last_sent TIMESTAMP,
      last_verified TIMESTAMP,

      -- Reset options
       reset_token VARCHAR(255),
       reset_expires TIMESTAMP,

      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `);

    // Other tables
    
    await query(courseTableSchema);
    await query(blogTableSchema);
    await query(registrationTableSchema);
    await query(testimonialTableSchema);
    

    console.log("✅ All Tables Initialized Successfully");
  } catch (error) {
    console.error("❌ Error initializing DB:", error);
    throw error;
  }
};

// ========================================
// 🔹 Admin User Queries
// ========================================

export const createUser = async (
  full_name,
  email,
  password,
  profile_image_url = null,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const rows = await query(
    `
    INSERT INTO admin_users
      (full_name, email, password_hash, profile_image_url, two_factor_enabled)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, full_name, email, profile_image_url, two_factor_enabled, created_at
    `,
    [full_name, email, hashedPassword, profile_image_url],
  );

  return rows[0];
};

export const findUserByEmail = async (email) => {
  const rows = await query(`SELECT * FROM admin_users WHERE email = $1`, [
    email,
  ]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const rows = await query(
    `
    SELECT id, full_name, email, password_hash,
           profile_image_url, two_factor_enabled, created_at
    FROM admin_users
    WHERE id = $1
    `,
    [id],
  );
  return rows[0] || null;
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

export const updateLastLogin = async (id) => {
  await query(
    `UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
    [id],
  );
};

export const countUsers = async () => {
  const rows = await query(`SELECT COUNT(*)::int AS total FROM admin_users`);
  return rows[0]?.total || 0;
};

// ========================================
// 🔹 OTP / 2FA Helpers
// ========================================

export const saveOTP = async (userId, otp, expiresAt) => {
  await query(
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
  await query(
    `
    UPDATE admin_users
    SET two_factor_code = NULL,
        two_factor_expires = NULL
    WHERE id = $1
    `,
    [userId],
  );
};

export const findUserByIdWithOTP = async (id) => {
  const rows = await query(
    `
    SELECT id, full_name, email, profile_image_url,
           two_factor_code, two_factor_expires, created_at
    FROM admin_users
    WHERE id = $1
    `,
    [id],
  );
  return rows[0] || null;
};

export const incrementOtpAttempts = async (userId) => {
  await query(
    `UPDATE admin_users SET otp_attempts = otp_attempts + 1 WHERE id = $1`,
    [userId],
  );
};

export const resetOtpAttempts = async (userId) => {
  await query(`UPDATE admin_users SET otp_attempts = 0 WHERE id = $1`, [
    userId,
  ]);
};

// ========================================
// 🔹 Export Pool (optional use elsewhere)
// ========================================

export default pool;
