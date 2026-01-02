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
    payment_status VARCHAR(50) DEFAULT 'pending', 
    receipt_status VARCHAR(50) DEFAULT 'pending',
    
    -- CERTIFICATE COLUMNS --
    completion_status VARCHAR(50) DEFAULT 'enrolled',
    certificate_url TEXT,
    certificate_issued_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/* =========================
    CREATE REGISTRATION (Wizard Form)
========================= */
export const createRegistration = async (data) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const courseMapping = {
    "Intro to Python": "PY",
    "Web Development": "WD",
    "Robotics for Kids": "RB",
    "Scratch Coding": "SC",
  };
  const courseCode = courseMapping[data.course] || "GN";

  // STEP 1: Insert into the DB without the registration_number first.
  // We use RETURNING id to get the auto-incremented number.
  const result = await sql.query(
    `INSERT INTO registrations (
        parent_name, parent_phone, parent_email, 
        child_name, age_group, grade_group, gender, 
        course_name, preferred_time, device_type, internet_quality, 
        emergency_contact, emergency_phone, notes, heard_from, 
        consent, mpesa_code, payment_status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id`,
    [
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
    ]
  );

  const newDbId = result[0].id; // This is the unique number (e.g., 5)

  // STEP 2: Format the Registration Number using that unique ID
  const nextSerial = newDbId.toString().padStart(3, "0"); // Turns 5 into "005"
  const regNumber = `BC-${year}-${courseCode}-${nextSerial}`;

  // STEP 3: Update the record with the final Registration Number
  const finalResult = await sql.query(
    `UPDATE registrations SET registration_number = $1 WHERE id = $2 RETURNING *`,
    [regNumber, newDbId]
  );

  return finalResult[0]; // Send the full updated record back to the controller
};
/* =========================
    READ ALL (ADMIN DASHBOARD)
========================= */
export const getAllRegistrations = async () => {
  const result =
    await sql`SELECT * FROM registrations ORDER BY created_at DESC`;

  return result;
};

/* =========================
    UPDATE PAYMENT & RECEIPT STATUS
========================= */
export const updatePaymentStatus = async (
  id,
  paymentStatus,
  receiptStatus = "pending",
  mpesaCode
) => {
  const result = await sql.query(
    `UPDATE registrations
     SET payment_status = $1, receipt_status = $2,mpesa_code = COALESCE($4, mpesa_code)
     WHERE id = $3
     RETURNING *`,
    [paymentStatus, receiptStatus, id,mpesaCode]
  );
  return result[0];
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
  return result[0];
};

/* =========================
    DELETE REGISTRATION
========================= */
export const deleteRegistrationById = async (id) => {
  const result = await sql.query(
    `DELETE FROM registrations WHERE id = $1 RETURNING id`,
    [id]
  );
  return result[0];
};

export const verifyCertificate = async (regNumber) => {
  const result = await sql.query(
    `SELECT child_name, course_name, certificate_issued_at, created_at
     FROM registrations 
     WHERE registration_number = $1 `,
    [regNumber]
  );

  return result[0];
};
