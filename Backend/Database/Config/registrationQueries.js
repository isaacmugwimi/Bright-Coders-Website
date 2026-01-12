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
    
    -- FINANCIAL COLUMNS --
    total_course_price DECIMAL(10, 2) DEFAULT 0.00,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    balance_due DECIMAL(10, 2) DEFAULT 0.00,
    payment_plan VARCHAR(50), -- 'full', 'deposit', 'pay_later'
    
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'paid'
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
  const course = await sql`
  SELECT code FROM courses WHERE title = ${data.course}
`;

  const courseCode = course[0]?.code || "GEN";

  // Insert into DB with financial data
  const result = await sql.query(
    `INSERT INTO registrations (
        parent_name, parent_phone, parent_email, 
        child_name, age_group, grade_group, gender, 
        course_name, preferred_time, device_type, internet_quality, 
        emergency_contact, emergency_phone, notes, heard_from, 
        consent, mpesa_code, total_course_price, amount_paid, 
        balance_due, payment_plan, payment_status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
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
      data.totalCoursePrice,
      data.amountPaid,
      data.balanceDue,
      data.paymentPlan,
      data.paymentStatus, // Calculated in your controller
    ]
  );

  const newDbId = result[0].id;
  const nextSerial = newDbId.toString().padStart(3, "0");
  const regNumber = `BC-${year}-${courseCode}-${nextSerial}`;

  const finalResult = await sql.query(
    `UPDATE registrations SET registration_number = $1 WHERE id = $2 RETURNING *`,
    [regNumber, newDbId]
  );

  return finalResult[0];
};
/* =========================
    READ ALL (ADMIN DASHBOARD)
========================= */
export const getAllRegistrations = async () => {
  // Fixed to use .query for consistency
  const result = await sql.query(
    `SELECT * FROM registrations ORDER BY created_at DESC`
  );
  return result;
};

/* =========================
    UPDATE PAYMENT & RECEIPT STATUS
========================= */
export const updatePaymentStatus = async (
  id,
  status,
  totalPaid,
  balance,
  mpesa
) => {
  // Use PostgreSQL $ syntax instead of ?
  const result = await sql.query(
    `UPDATE registrations 
     SET payment_status = $1, 
         amount_paid = $2, 
         balance_due = $3, 
         mpesa_code = $4
     WHERE id = $5
     RETURNING *`, // Returning * allows us to avoid a second query
    [status, totalPaid, balance, mpesa, id]
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
     WHERE registration_number = $1 
     AND payment_status = 'paid' `,
    [regNumber]
  );

  return result[0];
};

/* =========================
    GET REGISTRATION BY ID
========================= */
export const getRegistrationById = async (id) => {
  const result = await sql.query(`SELECT * FROM registrations WHERE id = $1`, [
    id,
  ]);
  return result[0]; // Returns the single student record
};
