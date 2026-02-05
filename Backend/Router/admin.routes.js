import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import csrf from "csurf";

// import {
//   requestStepUpOTP,
//   verifyStepUpOTP,
//   getAdminProfile,
//   updateAdminProfile,
//   changeAdminPassword,
// } from "../Controller/adminController.js";

import { requireStepUp } from "../Middleware/requireStepUp.js";
import {
  changeAdminPassword,
  handleDeleteAdminAccount,
  handleGetAdminProfile,
  handleUpdateAdminProfile,
} from "../Controller/adminController.js";
// import { getAdminProfile, requestStepUpOTP,  verifyStepUpOTP } from "../Controller/adminController.js";
import { csrfProtection } from "../Middleware/csrfMiddleware.js";
// const csrfProtection = csrf({ cookie: true });
const router = express.Router();

/* =========================
   ADMIN PROFILE (SINGLE ADMIN)
========================= */

// Get admin details
router.get("/profile", protect, requireStepUp, handleGetAdminProfile);

// Update username / image
router.put(
  "/profile-update",
  protect,
  // requireStepUp,
  csrfProtection,
  handleUpdateAdminProfile,
);

// Change password
router.put(
  "/change-password",
  protect,
  // requireStepUp,
  csrfProtection,
  changeAdminPassword,
);

// Permanently delete admin account
router.delete(
  "/delete-account",
  protect,
  // requireStepUp,
  csrfProtection,
  handleDeleteAdminAccount,
);

export default router;
