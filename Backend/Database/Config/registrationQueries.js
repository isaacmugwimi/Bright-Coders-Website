import { query } from "./config.db.js";

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

  -- Financial
  total_course_price DECIMAL(10,2) DEFAULT 0.00,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  balance_due DECIMAL(10,2) DEFAULT 0.00,
  payment_plan VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  receipt_status VARCHAR(50) DEFAULT 'pending',
  receipt_url TEXT,

  -- Certificate
  completion_status VARCHAR(50) DEFAULT 'enrolled',
  certificate_url TEXT,
  certificate_issued_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/* =========================
   NORMALIZE INPUT
========================= */
const normalizeRegistrationData = (data) => ({
  parentName: data.parentName,
  parentPhone: data.parentPhone,
  parentEmail: data.parentEmail,
  childName: data.childName,
  ageGroup: data.ageGroup,
  gradeGroup: data.gradeGroup,
  gender: data.gender,
  course: data.course,
  preferredTime: data.preferredTime,
  deviceType: data.deviceType,
  internetQuality: data.internetQuality,
  emergencyContact: data.emergencyContact,
  emergencyPhone: data.emergencyPhone,
  notes: data.notes ?? null,
  heardFrom: data.heardFrom ?? null,
  consent: Boolean(data.consent),
  mpesaCode: data.mpesaCode ?? "PAY_LATER",
  totalCoursePrice: data.totalCoursePrice ?? 0.0,
  amountPaid: data.amountPaid ?? 0.0,
  balanceDue: data.balanceDue ?? 0.0,
  paymentPlan: data.paymentPlan ?? "full",
  paymentStatus: data.paymentStatus ?? "pending",
});

/* =========================
   CREATE REGISTRATION
========================= */
export const createRegistration = async (data) => {
  const d = normalizeRegistrationData(data);
  const year = new Date().getFullYear().toString().slice(-2);

  /* 1️⃣ Get course code */
  const courseRows = await query(`SELECT code FROM courses WHERE title = $1`, [
    d.course,
  ]);
  const courseCode = courseRows[0]?.code || "GEN";

  /* 2️⃣ Insert registration */
  const insertRows = await query(
    `
    INSERT INTO registrations (
      parent_name, parent_phone, parent_email, child_name, age_group,
      grade_group, gender, course_name, preferred_time, device_type,
      internet_quality, emergency_contact, emergency_phone, notes,
      heard_from, consent, mpesa_code, total_course_price,
      amount_paid, balance_due, payment_plan, payment_status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,
      $19,$20,$21,$22
    )
    RETURNING id
    `,
    [
      d.parentName,
      d.parentPhone,
      d.parentEmail,
      d.childName,
      d.ageGroup,
      d.gradeGroup,
      d.gender,
      d.course,
      d.preferredTime,
      d.deviceType,
      d.internetQuality,
      d.emergencyContact,
      d.emergencyPhone,
      d.notes,
      d.heardFrom,
      d.consent,
      d.mpesaCode,
      d.totalCoursePrice,
      d.amountPaid,
      d.balanceDue,
      d.paymentPlan,
      d.paymentStatus,
    ],
  );

  const newId = insertRows[0].id;
  const serial = newId.toString().padStart(3, "0");
  const regNumber = `BC-${year}-${courseCode}-${serial}`;

  /* 3️⃣ Update registration number */
  const finalRows = await query(
    `
    UPDATE registrations
    SET registration_number = $1
    WHERE id = $2
    RETURNING *
    `,
    [regNumber, newId],
  );

  return finalRows[0];
};

/* =========================
   READ REGISTRATIONS
========================= */
export const getAllRegistrations = async () => {
  return await query(`SELECT * FROM registrations ORDER BY created_at DESC`);
};

export const getRegistrationById = async (id) => {
  const rows = await query(`SELECT * FROM registrations WHERE id = $1`, [id]);
  return rows[0];
};

/* =========================
   UPDATE PAYMENT
========================= */
export const updatePaymentStatus = async (
  id,
  status,
  totalPaid,
  balance,
  mpesa,
) => {
  const rows = await query(
    `
    UPDATE registrations
    SET payment_status = $1,
        amount_paid = $2,
        balance_due = $3,
        mpesa_code = $4
    WHERE id = $5
    RETURNING *
    `,
    [status, totalPaid, balance, mpesa, id],
  );

  return rows[0];
};

/* =========================
   ISSUE CERTIFICATE
========================= */
export const issueCertificate = async (id, certificateUrl) => {
  const rows = await query(
    `
    UPDATE registrations
    SET certificate_url = $1,
        completion_status = 'completed',
        certificate_issued_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [certificateUrl, id],
  );

  return rows[0];
};

/* =========================
   DELETE REGISTRATION
========================= */
export const deleteRegistrationById = async (id) => {
  const rows = await query(
    `DELETE FROM registrations WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows[0];
};

/* =========================
   VERIFY CERTIFICATE
========================= */
export const verifyCertificate = async (regNumber) => {
  const rows = await query(
    `
    SELECT child_name, course_name, certificate_issued_at, created_at
    FROM registrations
    WHERE registration_number = $1
      AND payment_status = 'paid'
    `,
    [regNumber],
  );
  return rows[0];
};


/* =========================
   UPDATE RECEIPT URL
========================= */
export const updateReceiptUrl = async (id, receiptUrl) => {
  const rows = await query(
    `
    UPDATE registrations
    SET receipt_url = $1,
        receipt_status = 'generated'
    WHERE id = $2
    RETURNING *
    `,
    [receiptUrl, id]
  );

  return rows[0];
};