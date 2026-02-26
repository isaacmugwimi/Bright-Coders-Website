import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { contactValidationSchema } from "../Middleware/Validators/contactValidator.js";
import {
  handleAddContact,
  handleGetAllContacts,
  handleUpdateContactStatus,
  handleDeleteContact,
} from "../Controller/contactController.js";
import { csrfProtection } from "../Middleware/csrfMiddleware.js";


const router = express.Router();

// --- PUBLIC ROUTES ---
// Allow potential students to send messages from the website
// Note: csrfProtection is omitted here if this is a cross-origin API call, 
// but recommended if the frontend and backend share the same domain.
router.post("/submit", validate(contactValidationSchema), handleAddContact);

// --- ADMIN ROUTES (Protected) ---
// Fetch all contact inquiries for the admin dashboard
router.get("/", protect, csrfProtection, handleGetAllContacts);

// Update message status (e.g., marking as 'read' or 'replied')
// Using PATCH as we are only updating the status field
router.patch("/:id/status", protect, csrfProtection, handleUpdateContactStatus);

// Delete a contact message permanently
router.delete("/:id", protect, csrfProtection, handleDeleteContact);

export default router;