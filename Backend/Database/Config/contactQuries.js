import pool from "./config.db";

/* =========================
   CONTACT MESSAGES SCHEMA
========================= */
export const contactTableSchema = `
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'replied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/* =========================
   CREATE MESSAGE (PUBLIC)
========================= */
export const createContactMessage = async (data) => {
  const result = await pool.query(
    `INSERT INTO contact_messages 
      (full_name, email, message) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [data.fullName, data.email, data.message]
  );
  return result.rows[0];
};

/* =========================
   GET ALL MESSAGES (ADMIN)
========================= */
export const getAllMessages = async () => {
  const result = await pool.query(
    `SELECT * FROM contact_messages 
     ORDER BY created_at DESC`
  );
  return result.rows;
};

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
export const updateMessageStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE contact_messages 
     SET status = $2 
     WHERE id = $1 
     RETURNING *`,
    [id, status]
  );
  return result.rows[0];
};

/* =========================
   DELETE MESSAGE (PERMANENT)
========================= */
export const deleteContactMessage = async (id) => {
  const result = await pool.query(
    `DELETE FROM contact_messages 
     WHERE id = $1 
     RETURNING id`,
    [id]
  );
  return result.rows[0];
};