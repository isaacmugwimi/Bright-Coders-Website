import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  handleAddTestimonial,
  handleDeleteTestimonial,
  handleGetAllTestimonials,
  handleGetLiveTestimonials,
  handleApproveTestimonial,
  handleHideTestimonial,
} from "../Controller/testimonialController.js";
import upload from "../Middleware/uploadMiddleware.js";
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });

const router = express.Router();

// --- PUBLIC ROUTES ---
// Anyone can see approved testimonials on the landing page
router.get("/live", handleGetLiveTestimonials);

// Anyone can submit a new testimonial (Validation is handled inside the controller)
router.post("/submit", upload.single("image"), handleAddTestimonial);

// --- ADMIN ROUTES (Protected) ---
// Admin can see all submissions (including pending ones)
router.get("/", protect, csrfProtection, handleGetAllTestimonials);

// Admin can delete a testimonial
router.delete("/:id", protect, csrfProtection, handleDeleteTestimonial);

// --- MODERATION ROUTES ---
// Admin approves a testimonial to show it on the live site
router.post("/:id/approve", protect, csrfProtection, handleApproveTestimonial);

// Admin hides a testimonial from the live site
router.post("/:id/hide", protect, csrfProtection, handleHideTestimonial);

export default router;
