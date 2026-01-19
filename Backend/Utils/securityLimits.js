export const SECURITY_LIMITS = {
  OTP_MAX_ATTEMPTS: Number(process.env.OTP_MAX_ATTEMPTS || 5),

  // convert seconds → milliseconds
  OTP_RESEND_COOLDOWN_MS:
    Number(process.env.OTP_RESEND_COOLDOWN || 60) * 1000,

  // convert minutes → milliseconds
  OTP_EXPIRY_MS:
    Number(process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000,
};
