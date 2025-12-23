import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  handleAddCourse,
  handleDeleteCourse,
  handleGetCourses,
  handleUpdateCourse,
} from "../Controller/courseController";

const router = express.Router();
// Apply 'protect' to ensure only logged-in admins can do these tasks
router.get("/", protect, handleGetCourses);
router.post("/", protect, handleAddCourse);
router.put("/:id", protect, handleUpdateCourse);
router.delete("/:id", protect, handleDeleteCourse);

export default router;
