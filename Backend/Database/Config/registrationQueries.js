import { sql } from "./config.db.js";

/* =========================
    REGISTRATION TABLE SCHEMA
========================= */
export const registrationTableSchema = `
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE, 
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    grade_group VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    internet_quality VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    notes TEXT,
    heard_from VARCHAR(100),
    consent BOOLEAN DEFAULT FALSE,
    mpesa_code VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending', 
    receipt_status VARCHAR(20) DEFAULT 'pending',
    
    -- CERTIFICATE COLUMNS --
    completion_status VARCHAR(20) DEFAULT 'enrolled',
    certificate_url TEXT,
    certificate_issued_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/* =========================
    CREATE REGISTRATION (Wizard Form)
========================= */
export const createRegistration = async (data) => {
  // 1. Generate Structured ID: BC-26-PY-001
  const year = new Date().getFullYear().toString().slice(-2);
  const courseMapping = {
    "Intro to Python": "PY",
    "Web Development": "WD",
    "Robotics for Kids": "RB",
    "Scratch Coding": "SC",
  };
  const courseCode = courseMapping[data.course] || "GN";

  // Get current count for serial number
  const countRes = await sql.query(
    `SELECT COUNT(*) FROM registrations WHERE registration_number LIKE $1`,
    [`BC-${year}-${courseCode}-%`]
  );
  const nextSerial = (parseInt(countRes.rows[0].count) + 1)
    .toString()
    .padStart(3, "0");
  const regNumber = `BC-${year}-${courseCode}-${nextSerial}`;

  const values = [
    regNumber,
    data.parentName,
    data.parentPhone,
    data.parentEmail,
    data.childName,
    data.ageGroup,
    data.gradeGroup,
    data.gender,
    data.course,
    data.preferredTime,
    data.deviceType,
    data.internetQuality,
    data.emergencyContact,
    data.emergencyPhone,
    data.notes || null,
    data.heardFrom,
    data.consent || false,
    data.mpesaCode || "PAY_LATER",
    data.mpesaCode && data.mpesaCode !== "PAY_LATER"
      ? "awaiting_verification"
      : "pending",
  ];

  const result = await sql.query(
    `INSERT INTO registrations (
        registration_number, parent_name, parent_phone, parent_email, 
        child_name, age_group, grade_group, gender, 
        course_name, preferred_time, device_type, internet_quality, 
        emergency_contact, emergency_phone, notes, heard_from, 
        consent, mpesa_code, payment_status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
    values
  );

  return result.rows[0];
};

/* =========================
    READ ALL (ADMIN DASHBOARD)
========================= */
export const getAllRegistrations = async () => {
  const result = await sql.query(
    `SELECT * FROM registrations ORDER BY created_at DESC`
  );
  return result.rows;
};

/* =========================
    UPDATE PAYMENT & RECEIPT STATUS
========================= */
export const updatePaymentStatus = async (
  id,
  paymentStatus,
  receiptStatus = "pending"
) => {
  const result = await sql.query(
    `UPDATE registrations
     SET payment_status = $1, receipt_status = $2
     WHERE id = $3
     RETURNING *`,
    [paymentStatus, receiptStatus, id]
  );
  return result.rows[0];
};

/* =========================
    ISSUE CERTIFICATE (Graduation)
========================= */
export const issueCertificate = async (id, certificateUrl) => {
  const result = await sql.query(
    `UPDATE registrations
     SET certificate_url = $1, 
         completion_status = 'completed',
         certificate_issued_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [certificateUrl, id]
  );
  return result.rows[0];
};

/* =========================
    DELETE REGISTRATION
========================= */
export const deleteRegistrationById = async (id) => {
  const result = await sql.query(
    `DELETE FROM registrations WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};
