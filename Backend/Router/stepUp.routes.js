import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import csrf from "csurf";

import {
  handleRequestStepUpOTP,
  handleVerifyStepUpOTP,
} from "../Controller/stepUpController.js";

const csrfProtection = csrf({ cookie: true });
const router = express.Router();

/* =========================
   STEP-UP VERIFICATION ROUTES
========================= */

// Request OTP
router.post(
  "/request",
  protect,
  csrfProtection,
  handleRequestStepUpOTP
);

// Verify OTP
router.post(
  "/verify",
  protect,
  csrfProtection,
  handleVerifyStepUpOTP
);

export default router;
