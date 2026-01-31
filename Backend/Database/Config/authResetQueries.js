import { query } from "./config.db.js";
import bcrypt from "bcryptjs";

export const savePasswordResetToken = async (
  email,
  token,
  expires
) => {
  const hashedToken = await bcrypt.hash(token, 10);

  await query(
    `
    UPDATE admin_users
    SET reset_token = $1,
        reset_expires = $2
    WHERE email = $3
    `,
    [hashedToken, expires, email]
  );
};

export const findUserByResetToken = async () => {
  const rows = await query(
    `
    SELECT *
    FROM admin_users
    WHERE reset_token IS NOT NULL
      AND reset_expires > NOW()
    `
  );
  return rows;
};

export const clearResetToken = async (adminId) => {
  await query(
    `
    UPDATE admin_users
    SET reset_token = NULL,
        reset_expires = NULL
    WHERE id = $1
    `,
    [adminId]
  );
};

export const updatePasswordById = async (adminId, newPassword) => {
  const hash = await bcrypt.hash(newPassword, 12);

  await query(
    `
    UPDATE admin_users
    SET password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [hash, adminId]
  );
};
