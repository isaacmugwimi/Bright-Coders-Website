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

const router = express.Router();

// ==========================
// --- PUBLIC ROUTES ---
// ==========================
// Anyone can submit a registration
router.post("/", handleAddRegistration);
router.get("/verify/:regNumber", handleVerifyCertificate);

// ==========================
// --- ADMIN ROUTES (Protected) ---
// ==========================

// Get all registrations (drafts + completed) for admin dashboard
router.get("/StudentsRegistration", protect, handleGetAllRegistrations);

// Update payment or receipt status
router.patch("/payment/:id", protect, handleUpdatePayment);

// Issue certificate / mark completion
router.patch("/certificate/:id", protect, handleIssueCertificate);

// Delete a registration
router.delete("/:id", protect, handleDeleteRegistration);
// VERIFY CERTIFICATE (Public Route)

// GET /api/registrations/download-receipt/:regNumber
router.get("/download-receipt/:regNumber", async (req, res) => {
  try {
    const { regNumber } = req.params;
    const filePath = path.resolve(`./receipts/Receipt_${regNumber}.pdf`);

    // Check if the file actually exists on the disk
    if (fs.existsSync(filePath)) {
      return res.download(filePath, `Receipt_${regNumber}.pdf`);
    } else {
      // If the file is missing, we could trigger the generator here as a fallback
      return res
        .status(404)
        .json({ message: "Receipt file not found on server." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error downloading file." });
  }
});

export default router;
