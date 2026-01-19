import crypto from "crypto";
import { SECURITY_LIMITS } from "./securityLimits.js";

export const generateOTP = () => {
  // Generates a cryptographically strong random value
  return crypto.randomInt(100000, 999999).toString();
};

export const canResendOTP = (user) => {
  if (!user.otp_last_sent) return true;

  const elapsed = Date.now() - new Date(user.otp_last_sent).getTime();

  return elapsed >= SECURITY_LIMITS.OTP_RESEND_COOLDOWN_MS;
};

export const getResendRemainingSeconds = (user) => {
  if (!user.otp_last_sent) return 0;

  const elapsed = Date.now() - new Date(user.otp_last_sent).getTime();

  const remainingMs = SECURITY_LIMITS.OTP_RESEND_COOLDOWN_MS - elapsed;

  return Math.max(0, Math.ceil(remainingMs / 1000));
};
