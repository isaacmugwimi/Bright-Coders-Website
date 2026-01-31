import express from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../Controller/forgotPasswordController.js";
import { csrfProtection } from "../Middleware/csrfMiddleware.js";

const router = express.Router();

/**
 * PATH: /api/auth-reset/request
 * DESC: Initial email submission
 */
router.post("/request",  requestPasswordReset);

/**
 * PATH: /api/auth-reset/confirm
 * DESC: Submission of the new password + token
 */
router.post("/confirm", csrfProtection, resetPassword);

export default router;