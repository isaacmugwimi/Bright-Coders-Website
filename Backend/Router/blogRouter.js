import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { blogValidationSchema } from "../Middleware/Validators/blogValidator.js";
import {
  handleAddBlog,
  handleDeleteBlog,
  handleGetAllBlogs,
  handleGetLiveBlogs,
  handlePublishBlog,
  handleUpdateBlog,
  handleWithdrawBlog,
} from "../Controller/blogController.js";
import { csrfProtection } from "../Middleware/csrfMiddleware.js";


const router = express.Router();

// --- PUBLIC ROUTES ---
// Accessible by everyone to see live content on the website
router.get("/live", handleGetLiveBlogs);

// --- ADMIN ROUTES (Protected) ---
// Fetch all blogs (drafts + live) for the admin dashboard
router.get("/", protect, csrfProtection, handleGetAllBlogs);

// Create a new blog - Validates input and ensures user is logged in
router.post("/", protect, csrfProtection, validate(blogValidationSchema), handleAddBlog);

// Update an existing blog
router.put("/:id", protect, csrfProtection, validate(blogValidationSchema), handleUpdateBlog);

// Delete a blog
router.delete("/:id", protect, csrfProtection, handleDeleteBlog);

// --- ACTION ROUTES ---
// Toggling visibility on the live website
router.post("/:id/push", protect, csrfProtection, handlePublishBlog);
router.post("/:id/withdraw", protect, csrfProtection, handleWithdrawBlog);

export default router;
