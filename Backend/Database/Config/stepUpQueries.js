import pool from "./config.db.js";

/* =========================
   STEP-UP VERIFICATION
========================= */

export const saveStepUpOTP = async (adminId, otp, expiresAt) => {
  await pool.query(
    `
    UPDATE admin_users
    SET otp_code = $1,
        otp_expires = $2,
        otp_attempts = 0,
        otp_last_sent = CURRENT_TIMESTAMP
    WHERE id = $3
    `,
    [otp, expiresAt, adminId]
  );
};

export const getStepUpData = async (adminId) => {
  const result = await pool.query(
    `
    SELECT otp_code, otp_expires, otp_attempts, last_verified
    FROM admin_users
    WHERE id = $1
    `,
    [adminId]
  );

  return result.rows[0] || null;
};

export const markStepUpVerified = async (adminId) => {
  await pool.query(
    `
    UPDATE admin_users
    SET otp_code = NULL,
        otp_expires = NULL,
        otp_attempts = 0,
        last_verified = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [adminId]
  );
};

export const incrementStepUpAttempts = async (adminId) => {
  await pool.query(
    `
    UPDATE admin_users
    SET otp_attempts = otp_attempts + 1
    WHERE id = $1
    `,
    [adminId]
  );
};
