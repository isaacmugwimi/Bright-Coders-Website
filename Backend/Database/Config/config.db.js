import dotenv from "dotenv";
dotenv.config();
import { neon, neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { courseTableSchema } from "./courseQueries.js";
import { blogTableSchema } from "./blogQueries.js";
import { testimonialTableSchema } from "./testimonialsQueries.js";
import { registrationTableSchema } from "./registrationQueries.js";

neonConfig.fetchConnectionCache = true;
neonConfig.pipelineConnect = false;
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&connect_timeout=30`,
);
console.log("🟢 DB HOST:", PGHOST);

// ========================================
//  🔹 Initialize Database & Tables
// ========================================

export async function initDb() {
  try {
    await sql`
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
`;

    await sql.query(courseTableSchema);
    await sql.query(blogTableSchema);
    await sql.query(registrationTableSchema);
    await sql.query(testimonialTableSchema);

    // await sql({ raw: [registrationTableSchema] });

    console.log("Course Table Initialized");
    console.log("Blog Table Initialized");
    console.log("testimonial Table Initialized");
    console.log("registration Table Schema Initialized");
  } catch (error) {
    console.error("Error in initializing the Database: ", error);
  }
}

// *********************end******************

// ========================================
// 🔹  User Queries
// ========================================

// ➤ create new user
export async function createUser(
  full_name,
  email,
  password,
  profile_image_url = null,
) {
  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await sql`
   INSERT INTO admin_users (full_name, email, password_hash, profile_image_url,two_factor_enabled)
    VALUES (${full_name}, ${email}, ${hashedPassword}, ${profile_image_url},true)
    RETURNING id, full_name, email, profile_image_url, two_factor_enabled, created_at;
   `;
  return result[0]; //return the created user
}

// ➤ Find user by email
export async function findUserByEmail(email) {
  const result = await sql`SELECT * FROM admin_users WHERE email =${email}`;
  return result[0] || null;
}

// ➤ Find User by ID
export async function findUserById(id) {
  const result = await sql`
    SELECT id, full_name, email, password_hash, profile_image_url, two_factor_enabled, created_at
    FROM admin_users
    WHERE id = ${id};
  `;
  return result[0] || null;
}

// ➤ Compare Passwords
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// ➤ Update Last Login Time
export async function updateLastLogin(id) {
  try {
    await sql`
      UPDATE admin_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Failed to update last login: ", error);
  }
}

// the function below check if any user is registered.... if yes then we only allow single admin registration
export const countUsers = async () => {
  const result = await sql`SELECT COUNT(*) as total FROM admin_users;`;
  return parseInt(result[0].total);
};

// Save OTP + expiry
export const saveOTP = async (userId, otp, expiresAt) => {
  await sql`
    UPDATE admin_users
    SET 
      two_factor_code = ${otp},
      two_factor_expires = ${expiresAt},
      otp_attempts = 0,
      otp_last_sent = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;
};

// Clear OTP after verification
export const clearOTP = async (userId) => {
  await sql`
    UPDATE admin_users
    SET two_factor_code = NULL, two_factor_expires = NULL
    WHERE id = ${userId}
  `;
};

export async function findUserByIdWithOTP(id) {
  const result = await sql`
    SELECT id, full_name, email, profile_image_url, two_factor_code, two_factor_expires, created_at
    FROM admin_users
    WHERE id = ${id};
  `;
  return result[0] || null;
}

// Increment OTP attempts
export const incrementOtpAttempts = async (userId) => {
  await sql`
    UPDATE admin_users
    SET otp_attempts = otp_attempts + 1
    WHERE id = ${userId}
  `;
};

// Reset OTP attempts
export const resetOtpAttempts = async (userId) => {
  await sql`
    UPDATE admin_users
    SET otp_attempts = 0
    WHERE id = ${userId}
  `;
};
