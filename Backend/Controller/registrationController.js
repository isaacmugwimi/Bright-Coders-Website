import { registrationValidationSchema } from "../Middleware/Validators/registrationValidator.js";
import * as Queries from "../Database/Config/registrationQueries.js";
import {
  sendAdminNotification,
  sendPaymentConfirmation,
} from "../Utils/mailer.js";
import { generateAndSaveReceipt } from "../Utils/receiptsGenerator.js";
import {  generateAdminEmailHtml } from "../Utils/mailhelper.js";

// ==========================
// 1. ADD NEW REGISTRATION
// =========================
// registrationController.js

export const handleAddRegistration = async (req, res) => {
  try {
    const schema = await registrationValidationSchema();
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation failed!", errors: errorMessages });
    }

    // --- ADD BALANCE CALCULATION ---
    // value contains the validated data from Joi
    const total = parseFloat(value.totalCoursePrice);
    const paid = parseFloat(value.amountPaid);
    const balanceDue = total - paid;

    // Determine initial payment status
    let paymentStatus = "pending";
    // If they provided an M-Pesa code or paid any amount,
    // it MUST be verified by admin first.
    if (value.paymentPlan === "full" || value.paymentPlan === "deposit") {
      paymentStatus = "awaiting_verification";
    }

    // Prepare data for DB
    const registrationData = {
      ...value,
      balanceDue,
      paymentStatus,
    };

    // Insert into DB
    const newRegistration = await Queries.createRegistration(registrationData);

    // ==========================================
    // 🔔 TRIGGER ADMIN NOTIFICATION HERE
    // ==========================================
// 1. Generate the HTML by passing the new record
    const emailHtml = generateAdminEmailHtml(newRegistration);
    sendAdminNotification("🎓 New Student Alert: " + newRegistration.child_name, emailHtml);
    // NEVER trust frontend-shaped data for receipts
    if (paymentStatus === "paid") {
      try {
        // Pull the fresh DB row with snake_case fields
        const dbRecord = await Queries.getRegistrationById(newRegistration.id);

        const fileInfo = await generateAndSaveReceipt(dbRecord);
        await sendPaymentConfirmation(dbRecord, fileInfo);
      } catch (err) {
        console.error("Immediate Receipt Error:", err);
      }
    }

    return res.status(201).json(newRegistration);
  } catch (err) {
    console.error("ADD_REGISTRATION_ERROR:", err);
    return res.status(500).json({ message: "An internal error occurred." });
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
    const { confirmedAmount, mpesaCode, isVerifyingExisting } = req.body;

    const student = await Queries.getRegistrationById(id);
    if (!student) return res.status(404).json({ message: "Not found." });

    // Use DB names: total_course_price
    const coursePrice = parseFloat(student.total_course_price);
    const previousPaid = parseFloat(student.amount_paid) || 0;
    const amountSent = Number(confirmedAmount);
    if (!Number.isFinite(amountSent) || amountSent <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let newTotalPaid = isVerifyingExisting
      ? amountSent
      : previousPaid + amountSent;
    const newBalance = Math.max(0, coursePrice - newTotalPaid);

    const newStatus = newBalance <= 0 ? "paid" : "partial";

    const safeMpesa = mpesaCode?.toUpperCase() || "PAY_LATER";

    // Update DB
    const updatedRegistration = await Queries.updatePaymentStatus(
      id,
      newStatus,
      newTotalPaid,
      newBalance,
      safeMpesa,
    );

    // GENERATE RECEIPT

    setImmediate(async () => {
      try {
        const fileInfo = await generateAndSaveReceipt(updatedRegistration);
        await sendPaymentConfirmation(updatedRegistration, fileInfo);
      } catch (err) {
        console.error("Receipt background error:", err);
      }
    });

    return res.status(200).json(updatedRegistration);
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify." });
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
      certificateUrl,
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
      message: "Security check failed.",
    });
  }
};
