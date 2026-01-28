import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  handleAddCourse,
  handleDeleteCourse,
  handleGetCourses,
  handlePushToLive,
  handleUpdateCourse,
  withdrawCourse,
  handleToggleFeatured, // Import the new toggle handler
  handleGetLiveCourses, // Import the improved live handler
} from "../Controller/courseController.js";
import { validate } from "../Middleware/validate.js";
import {
  courseSchema,
  toggleFeaturedSchema, // Import the smaller schema for toggling
} from "../Middleware/Validators/courseValidator.js";

import csrf from "csurf";
const csrfProtection = csrf({ cookie: true });

const router = express.Router();

// --- ADMIN ROUTES (Management) ---
router.get("/", protect, csrfProtection, handleGetCourses);
router.post("/", protect, validate(courseSchema), csrfProtection,handleAddCourse);
router.put("/:id", protect, validate(courseSchema), csrfProtection,handleUpdateCourse); 
router.delete("/:id", protect, csrfProtection,handleDeleteCourse);

//  One-click Featured Toggle
router.patch(
  "/:id/featured",
  protect,
  csrfProtection,
  validate(toggleFeaturedSchema),
  handleToggleFeatured
);

// Sync Actions
router.post("/:id/push", protect, csrfProtection,handlePushToLive);
router.post("/:id/withdraw", protect,csrfProtection, withdrawCourse);

// --- PUBLIC ROUTES (Website) ---
// This route is used by the student-facing homepage
router.get("/live", handleGetLiveCourses);

export default router;
