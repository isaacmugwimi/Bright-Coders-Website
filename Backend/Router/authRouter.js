import express from "express";

// import csrf from "csurf";
import {
  getUserInfo,
  imageUpload,
  loginUser,
  registerUser,
  resendOTP,
  verifyOTP,
} from "../Controller/authController.js";
import { protect } from "../Middleware/authMiddleware.js";
import { csrfProtection } from "../Middleware/csrfMiddleware.js";

const router = express.Router();
// const csrfProtection = csrf({ cookie: true });

// PUBLIC
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/upload-image", imageUpload); //public image route

// PROTECTED + CSRF
router.get("/getUser", protect, csrfProtection, getUserInfo);
router.post("/upload-image", protect, csrfProtection, imageUpload);

export default router;
