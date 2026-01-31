import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import {
  handleAddRegistration,
  handleGetAllRegistrations,
  handleUpdatePayment,
  handleIssueCertificate,
  handleDeleteRegistration,
  handleVerifyCertificate,
} from "../Controller/registrationController.js";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import cloudinary from "../Utils/cloudinary.js";

const csrfProtection = csrf({ cookie: true });

const router = express.Router();

// Define the limit: 10 requests per 15 minutes per IP
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many verification attempts. Please try again in 15 minutes.",
  },
});

// ==========================
// --- PUBLIC ROUTES ---
// ==========================
// Anyone can submit a registration
router.post("/", handleAddRegistration);
router.get("/verify/:regNumber", verifyLimiter, handleVerifyCertificate);

// ==========================
// --- ADMIN ROUTES (Protected) ---
// ==========================

// Get all registrations (drafts + completed) for admin dashboard
router.get("/StudentsRegistration", protect, csrfProtection, handleGetAllRegistrations);

// Update payment or receipt status
router.patch("/payment/:id", protect, csrfProtection, handleUpdatePayment);

// Issue certificate / mark completion
router.patch("/certificate/:id", protect, csrfProtection, handleIssueCertificate);

// Delete a registration
router.delete("/:id", protect, csrfProtection, handleDeleteRegistration);

// VERIFY CERTIFICATE (Public Route)

// GET /api/registrations/download-receipt/:regNumber
router.get("/download-receipt/:regNumber", async (req, res) => {
  try {
    const { regNumber } = req.params;
    const filePath = path.resolve(`./receipts/Receipt_${regNumber}.pdf`);

    // 1. Check if the file exists locally
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Receipt file not found on server." });
    }

    // 2. Upload to Cloudinary 
    // We use the regNumber as the public_id so we don't duplicate files
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "receipts",
      public_id: `Receipt_${regNumber}`,
      resource_type: "raw", // CRITICAL: Must be "raw" for PDFs
      flags: "attachment"   // Tells Cloudinary to force download instead of viewing
    });

    // 3. Redirect the user to the Cloudinary URL
    // This triggers the download in the browser
    return res.redirect(uploadResponse.secure_url);

  } catch (error) {
    console.error("[Cloudinary Receipt Error]:", error);
    res.status(500).json({ message: "Error processing receipt download." });
  }
});

export default router;
