import express from "express";
import {
  getUserInfo,
  imageUpload,
  loginUser,
  registerUser,
} from "../Controller/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post("/upload-image", imageUpload);

export default router;
