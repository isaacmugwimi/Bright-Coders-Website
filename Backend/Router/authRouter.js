import express from "express";
import {
  getUserInfo,
  imageUpload,
  loginUser,
  registerUser,
  resendOTP,
  verifyOTP,
} from "../Controller/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp",resendOTP)

router.get("/getUser", protect, getUserInfo);
router.post("/upload-image", imageUpload);

export default router;
