import { registrationValidationSchema } from "../Middleware/Validators/registrationValidator.js";
import * as Queries from "../Database/Config/registrationQueries.js";
import { sendPaymentConfirmation } from "../Utils/mailer.js";
import { error } from "console";
import { generateAndSaveReceipt } from "../Utils/receiptsGenerator.js";

// ==========================
// 1. ADD NEW REGISTRATION
// =========================
export const handleAddRegistration = async (req, res) => {
  try {
    // Fetch the dynamic schema (async because courses come from DB)
    const schema = await registrationValidationSchema();
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log("JOI VALIDATION ERROR:", error.details);
      const errorMessages = error.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation failed!", errors: errorMessages });
    }

    // Insert registration into DB
    const newRegistration = await Queries.createRegistration(value);
    return res.status(201).json(newRegistration);
  } catch (err) {
    console.error("ADD_REGISTRATION_ERROR:", err);
    return res.status(500).json({
      message: "An internal error occurred while creating the registration.",
    });
  }
};

// ==========================
// 2. GET ALL REGISTRATIONS (ADMIN)
// =========================
export const handleGetAllRegistrations = async (req, res) => {
  try {
    const registrations = await Queries.getAllRegistrations();
    return res.status(200).json(registrations);
  } catch (err) {
    console.error("GET_ALL_REGISTRATIONS_ERROR:", err);
    return res
      .status(500)
      .json({ message: "Unable to retrieve registrations." });
  }
};

// ==========================
// 3. UPDATE PAYMENT & RECEIPT STATUS
// =========================
export const handleUpdatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, receiptStatus, mpesaCode } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status is required." });
    }

    const updatedRegistration = await Queries.updatePaymentStatus(
      id,
      paymentStatus,
      receiptStatus || "pending",
      mpesaCode
    );

    if (!updatedRegistration)
      return res.status(404).json({ message: "Registration not found." });
    if (paymentStatus === "paid") {
      try {
        const fileInfo = await generateAndSaveReceipt(updatedRegistration);
        await sendPaymentConfirmation(updatedRegistration, fileInfo);

        console.log(
          `Receipt saved and sent for ${updatedRegistration.registration_number}`
        );
      } catch (err) {
        console.error("Receipt/Email error:", err);
      }
    }
    return res.status(200).json(updatedRegistration);
  } catch (err) {
    console.error("UPDATE_PAYMENT_ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to update payment/receipt status." });
  }
};

// ==========================
// 4. ISSUE CERTIFICATE (Graduation)
// =========================
export const handleIssueCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateUrl } = req.body;

    if (!certificateUrl) {
      return res.status(400).json({ message: "Certificate URL is required." });
    }

    const updatedRegistration = await Queries.issueCertificate(
      id,
      certificateUrl
    );

    if (!updatedRegistration)
      return res.status(404).json({ message: "Registration not found." });

    return res.status(200).json({
      message: "Certificate issued successfully.",
      data: updatedRegistration,
    });
  } catch (err) {
    console.error("ISSUE_CERTIFICATE_ERROR:", err);
    return res.status(500).json({ message: "Failed to issue certificate." });
  }
};

// ==========================
// 5. DELETE REGISTRATION
// =========================
export const handleDeleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Queries.deleteRegistrationById(id);

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Registration does not exist or already deleted." });

    return res
      .status(200)
      .json({ message: "Registration successfully deleted." });
  } catch (err) {
    console.error("DELETE_REGISTRATION_ERROR:", err);
    return res.status(500).json({ message: "Could not delete registration." });
  }
};

// ==========================
// VERIFY CERTIFICATE
// =========================
export const handleVerifyCertificate = async (req, res) => {
  const { regNumber } = req.params;

  try {
    // Use the helper query from registrationQueries
    const registration = await Queries.verifyCertificate(regNumber);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        studentName: registration.child_name, // Match the frontend key
        courseName: registration.course_name, // Match the frontend key
        issuedAt: registration.certificate_issued_at || registration.created_at,
      },
    });
  } catch (error) {
    console.error("VERIFY_CERTIFICATE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during certificate verification.",
    });
  }
};
