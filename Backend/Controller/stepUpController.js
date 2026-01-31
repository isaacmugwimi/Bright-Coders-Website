import crypto from "crypto";
import {
  saveStepUpOTP,
  getStepUpData,
  markStepUpVerified,
  incrementStepUpAttempts,
} from "../Database/Config/stepUpQueries.js";

// import { logAdminAudit } from "../Database/Config/adminAuditQueries.js";
import { generateOTP } from "../Utils/otp.js";

// import { sendOTPEmail } from "../Utils/sendEmail.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 3;



/* =========================
   REQUEST STEP-UP OTP
========================= */
export const handleRequestStepUpOTP = async (request, response) => {
  try {
    const adminId = request.user.id;

    const otp = generateOTP();
    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await saveStepUpOTP(adminId, otp, expiresAt);

    // await sendOTPEmail(request.user.email, otp);

    // await logAdminAudit({
    //   action: "STEP_UP_OTP_SENT",
    //   metadata: { method: "email" },
    //   req: request,
    // });

    return response.status(200).json({
      message: "Verification code sent",
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch (error) {
    console.error("Step-up request error:", error);
    return response.status(500).json({
      message: "Failed to send verification code",
    });
  }
};

/* =========================
   VERIFY STEP-UP OTP
========================= */
export const handleVerifyStepUpOTP = async (request, response) => {
  try {
    const adminId = request.user.id;
    const { otp } = request.body;

    if (!otp) {
      return response.status(400).json({
        message: "OTP is required",
      });
    }

    const stepUp = await getStepUpData(adminId);

    if (!stepUp || !stepUp.otp_code) {
      return response.status(400).json({
        message: "No active verification request",
      });
    }

    if (stepUp.otp_attempts >= MAX_OTP_ATTEMPTS) {
      return response.status(403).json({
        message: "Too many failed attempts",
      });
    }

    if (new Date() > new Date(stepUp.otp_expires)) {
      return response.status(403).json({
        message: "Verification code expired",
      });
    }

    if (otp !== stepUp.otp_code) {
      await incrementStepUpAttempts(adminId);
      return response.status(401).json({
        message: "Invalid verification code",
      });
    }

    await markStepUpVerified(adminId);

    // await logAdminAudit({
    //   action: "STEP_UP_VERIFIED",
    //   metadata: { method: "email" },
    //   req: request,
    // });

    return response.status(200).json({
      message: "Verification successful",
      verified: true,
    });
  } catch (error) {
    console.error("Step-up verify error:", error);
    return response.status(500).json({
      message: "Verification failed",
    });
  }
};
