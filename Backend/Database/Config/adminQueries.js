import { query } from "./config.db.js";
import bcrypt from "bcryptjs";

/* =========================
   ADMIN QUERIES
========================= */

export const createAdmin = async (
  full_name,
  email,
  password,
  profile_image_url = null
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const rows = await query(
    `
    INSERT INTO admin_users
      (full_name, email, password_hash, profile_image_url, two_factor_enabled)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, full_name, email, profile_image_url, created_at
    `,
    [full_name, email, hashedPassword, profile_image_url]
  );

  return rows[0];
};

export const getAdminByEmail = async (email) => {
  const rows = await query(
    `SELECT * FROM admin_users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
};

export const getAdminById = async (id) => {
  const rows = await query(
    `
    SELECT id, full_name, email, profile_image_url,
           two_factor_enabled, last_verified, created_at
    FROM admin_users
    WHERE id = $1
    `,
    [id]
  );
  return rows[0] || null;
};

export const updateAdminProfile = async (
  adminId,
  username,
  profile_image_url
) => {
  const rows = await query(
    `
    UPDATE admin_users
    SET full_name = $1,
        profile_image_url = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING id, full_name, email, profile_image_url
    `,
    [username, profile_image_url, adminId]
  );

  return rows[0];
};

export const updateAdminPassword = async (adminId, passwordHash) => {
  await query(
    `
    UPDATE admin_users
    SET password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [passwordHash, adminId]
  );
};

export const updateLastLogin = async (adminId) => {
  await query(
    `
    UPDATE admin_users
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [adminId]
  );
};


/**
 * Permanently deletes the admin account with the given ID.
 * Returns the deleted admin row (or null if none was deleted).
 */
export const deleteAdminById = async (adminId) => {
  const rows = await query(
    `
    DELETE FROM admin_users
    WHERE id = $1
    RETURNING id, full_name, email, profile_image_url
    `,
    [adminId]
  );

  return rows[0] || null;
};



export const getAdminAuthData = async (id) => {
  const rows = await query(
    `SELECT id, password_hash, last_verified FROM admin_users WHERE id = $1`, [id]
  );
  return rows[0] || null;
};