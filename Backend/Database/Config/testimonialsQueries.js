import { sql } from "./config.db.js";

/* =========================
   TESTIMONIAL TABLE SCHEMA
========================= */
export const testimonialTableSchema = `
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(100) DEFAULT 'Student',
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/* =========================
   CREATE TESTIMONIAL
========================= */
export const createTestimonial = async (data) => {
  const rows = await sql(
    `INSERT INTO testimonials 
      (user_name, user_role, message, rating, image_url, is_approved)
    VALUES ($1, $2, $3, $4, $5, false)
    RETURNING *`,
    [
      data.userName,
      data.userRole || "Student",
      data.message,
      data.rating || 5,
      data.imageUrl || null,
    ],
  );
  return rows[0];
};

/* =========================
   READ ALL TESTIMONIALS (ADMIN)
========================= */
export const getAllTestimonials = async () => {
  return await sql("SELECT * FROM testimonials ORDER BY created_at DESC");
};

/* =========================
   APPROVE TESTIMONIAL
========================= */
export const approveTestimonial = async (id) => {
  const rows = await sql(
    `UPDATE testimonials
    SET is_approved = true
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return rows[0];
};

/* =========================
   HIDE/UNAPPROVE TESTIMONIAL
========================= */
export const hideTestimonial = async (id) => {
  const rows = await sql(
    `UPDATE testimonials
    SET is_approved = false
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return rows[0];
};

/* =========================
   READ LIVE TESTIMONIALS (PUBLIC)
========================= */
export const getLiveTestimonials = async () => {
  return await sql(
    `SELECT * FROM testimonials
    WHERE is_approved = true
    ORDER BY created_at DESC`,
  );
};

/* =========================
   DELETE TESTIMONIAL
========================= */
export const deleteTestimonialById = async (id) => {
  const rows = await sql(
    `DELETE FROM testimonials
    WHERE id = $1
    RETURNING id`,
    [id],
  );
  return rows[0];
};
