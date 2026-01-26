import { sql } from "./config.db.js";

/* =========================
   Helper: Normalize Course Input
========================= */
const normalizeCourseData = (data) => ({
  code: data.code,
  title: data.title,
  category: data.category,
  duration: data.duration ?? null,
  price: data.price ?? null,
  focus: Array.isArray(data.focus) ? data.focus : [],
  level: data.level ?? null,
  imageUrl: data.imageUrl ?? null,
  description: data.description ?? {},
  requirements: Array.isArray(data.requirements) ? data.requirements : [],
  isPublic: Boolean(data.isPublic),
  isFeatured: Boolean(data.isFeatured),
});

/* =========================
   Table Schema
========================= */
export const courseTableSchema = `
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    price VARCHAR(50),
    focus TEXT[],
    level VARCHAR(50),
    image_url TEXT,
    description JSONB,
    requirements TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    last_pushed_at TIMESTAMP WITH TIME ZONE,
    last_withdrawn_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

/* =========================
   CREATE Course
========================= */
export const createCourse = async (data) => {
  const c = normalizeCourseData(data);

  const result = await sql(
    `INSERT INTO courses (
      code, title, category, duration, price, focus, level,
      image_url, description, requirements, is_public, is_featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      c.code,
      c.title,
      c.category,
      c.duration,
      c.price,
      c.focus,
      c.level,
      c.imageUrl,
      JSON.stringify(c.description), // pg requires JSONB as a string or object
      c.requirements,
      c.isPublic,
      c.isFeatured,
    ],
  );
  return result[0];
};

/* =========================
   READ: All Courses (Admin)
========================= */
export const getAllCourses = async () => {
  return await sql("SELECT * FROM courses ORDER BY created_at DESC");
};

/* =========================
   READ: Course Titles
========================= */
export const getCourseTitles = async () => {
  const rows = await sql("SELECT title FROM courses");
  return rows.map((r) => r.title);
};

/* =========================
   UPDATE Course
========================= */
export const updateCourseById = async (id, data) => {
  const c = normalizeCourseData(data);

  const result = await sql(
    `UPDATE courses SET
      code = $1,
      title = $2,
      category = $3,
      duration = $4,
      price = $5,
      focus = $6,
      level = $7,
      image_url = $8,
      description = $9,
      requirements = $10,
      is_public = $11,
      is_featured = $12
    WHERE id = $13
    RETURNING *`,
    [
      c.code,
      c.title,
      c.category,
      c.duration,
      c.price,
      c.focus,
      c.level,
      c.imageUrl,
      JSON.stringify(c.description),
      c.requirements,
      c.isPublic,
      c.isFeatured,
      id,
    ],
  );
  return result[0];
};

/* =========================
   DELETE Course
========================= */
export const deleteCourseById = async (id) => {
  const result = await sql("DELETE FROM courses WHERE id = $1 RETURNING id", [
    id,
  ]);
  return result[0];
};

/* =========================
   Publish / Withdraw Course
========================= */
export const pushCourseToLiveDb = async (id) => {
  const result = await sql(
    `UPDATE courses
    SET is_public = true,
        last_pushed_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return result[0];
};

export const withdrawCourseFromLiveWeb = async (id) => {
  const result = await sql(
    `UPDATE courses
    SET is_public = false,
        last_withdrawn_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return result[0];
};

/* =========================
   Get Public Courses
========================= */
export const getLiveCourses = async () => {
  return await sql(
    `SELECT * FROM courses
    WHERE is_public = true
    ORDER BY is_featured DESC, created_at DESC`,
  );
};

/* =========================
   Toggle Featured Status
========================= */
export const toggleFeaturedStatus = async (id, isFeatured) => {
  const result = await sql(
    `UPDATE courses
    SET is_featured = $1
    WHERE id = $2
    RETURNING *`,
    [Boolean(isFeatured), id],
  );
  return result[0];
};
