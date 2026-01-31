import crypto from "crypto";
import bcrypt from "bcryptjs";

import {
  savePasswordResetToken,
  findUserByResetToken,
  clearResetToken,
  updatePasswordById,
} from "../Database/Config/authResetQueries.js";

import { findUserByEmail } from "../Database/Config/config.db.js";
import { sendResetEmail } from "../Utils/mailer.js";
// import { sendResetEmail } from "../Utils/mailer.js";

const RESET_EXPIRY_MINUTES = 15;

/* =========================
   REQUEST PASSWORD RESET
========================= */
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  // SECURITY: do not reveal if email exists
  if (!user) {
    return res.status(200).json({
      message: "If the email exists, reset instructions were sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(
    Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000
  );

  await savePasswordResetToken(email, token, expires);

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  // const frontendUrl = "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  await sendResetEmail(email, resetUrl);


  res.status(200).json({
    message: "Password reset instructions sent.",
  });
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const users = await findUserByResetToken();

  const matchedUser = await Promise.any(
    users.map(async (u) => {
      const isMatch = await bcrypt.compare(token, u.reset_token);
      return isMatch ? u : null;
    })
  ).catch(() => null);

  if (!matchedUser) {
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  await updatePasswordById(matchedUser.id, newPassword);
  await clearResetToken(matchedUser.id);

  res.status(200).json({
    message: "Password reset successful",
  });
};
