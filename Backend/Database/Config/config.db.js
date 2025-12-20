import dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

// export default async function testDbConnection(params) {
//   try {
//     const result = await initDb`SELECT 1`;
//     console.log("✅ Database connected successfully!", result);
//   } catch (err) {
//     console.error("❌ Database connection error:", err.message);
//   }
// }

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

      last_login TIMESTAMP,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
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
  profile_image_url = null
) {
  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await sql`
   INSERT INTO admin_users (full_name, email, password_hash, profile_image_url)
    VALUES (${full_name}, ${email}, ${hashedPassword}, ${profile_image_url})
    RETURNING id, full_name, email, profile_image_url, created_at;
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
    SELECT id, full_name, email, profile_image_url, created_at
    FROM admin_users
    WHERE id = ${id};
  `;

  return result[0] || null; // always return array
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
