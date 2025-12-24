import { sql } from "./config.db.js";

// Program course table creation
export const courseTableSchema = `
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    price VARCHAR(50),
    focus TEXT[],                   -- PostgreSQL array
    level VARCHAR(50),
    image_url TEXT,
    description JSONB,              -- Stores nested object
    requirements TEXT[],            -- PostgreSQL array
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

// ➤ CREATE: Add new course
export async function createCourse(data) {
  const result = await sql`
    INSERT INTO courses (title, category, duration, price, focus, level, image_url, description, requirements, is_public)
    VALUES (${data.title}, ${data.category}, ${data.duration}, ${data.price}, ${data.focus}, ${data.level}, ${data.imageUrl}, ${data.description}, ${data.requirements}, ${data.isPublic})
    RETURNING *;`;
  return result[0];
}

// ➤ READ: getting all courses
export const getAllCourses = async () => {
  return await sql`SELECT * FROM courses ORDER BY created_at DESC`;
};

// 🔹 UPDATE: update data in the database
export const updateCourseById = async (id, data) => {
  const result = await sql`UPDATE courses 
    SET title=${data.title}, category=${data.category}, duration=${data.duration}, price=${data.price}, focus=${data.focus}, level=${data.level}, image_url=${data.imageUrl}, description=${data.description}, requirements=${data.requirements}, is_public=${data.isPublic}
    WHERE id=${id}
    RETURNING *;`;
  return result[0];
};

// 🔹 DELETE: dalete data from the database
export const deleteCourseById = async (id) => {
  const result = await sql`DELETE FROM courses WHERE id=${id} RETURNING id`;
  return result[0];
};
