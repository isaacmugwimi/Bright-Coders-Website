import { sql } from "./config.db.js";

// Program course table creation
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
  );`;

export const getCourseTitles = async () => {
  try {
    const result = await sql`SELECT title FROM courses`;
    // ensure we only map valid rows
    return Array.isArray(result)
      ? result.filter((r) => r && r.title).map((r) => r.title)
      : [];
  } catch (err) {
    console.error("GET_COURSE_TITLES_ERROR:", err);
    return [];
  }
};


// ➤ CREATE: Add new course
export async function createCourse(data) {
  const result = await sql`
    INSERT INTO courses (
      code, title, category, duration, price, focus, level,
      image_url, description, requirements, is_public, is_featured
    )
    VALUES (
      ${data.code}, ${data.title}, ${data.category}, ${data.duration}, ${data.price},
      ${data.focus}, ${data.level}, ${data.imageUrl}, ${data.description},
      ${data.requirements}, ${data.isPublic || false}, ${data.isFeatured || false}
    )
    RETURNING *;
  `;
  return result[0];
}


// ➤ READ: Get all courses for management
export const getAllCourses = async () => {
  return await sql`SELECT * FROM courses ORDER BY created_at DESC`;
};

// 🔹 UPDATE: Update course including featured status
export const updateCourseById = async (id, data) => {
  const result = await sql`
    UPDATE courses SET
      code=${data.code},
      title=${data.title},
      category=${data.category},
      duration=${data.duration},
      price=${data.price},
      focus=${data.focus},
      level=${data.level},
      image_url=${data.imageUrl},
      description=${data.description},
      requirements=${data.requirements},
      is_public=${data.isPublic},
      is_featured=${data.isFeatured}
    WHERE id=${id}
    RETURNING *;
  `;
  return result[0];
};


// 🔹 DELETE: dalete data from the database
export const deleteCourseById = async (id) => {
  const result = await sql`DELETE FROM courses WHERE id=${id} RETURNING id`;
  return result[0];
};

export const pushCourseToLiveDb = async (id) => {
  const result = await sql`UPDATE courses 
    SET is_public = true, 
        last_pushed_at = CURRENT_TIMESTAMP 
    WHERE id = ${id}
    RETURNING *;`;
  return result[0];
};
export const withdrawCourseFromLiveWeb = async (id) => {
  const result = await sql`UPDATE courses 
  SET is_public = false,
  last_withdrawn_at = NOW()
  WHERE id=${id}
  RETURNING *`;
  return result[0];
};

// ➤ READ: Improvement - Ordering by Featured first, then newest
export const getLiveCourses = async () => {
  return await sql`
    SELECT * FROM courses 
    WHERE is_public = true 
    ORDER BY is_featured DESC, created_at DESC
  `;
};


export const toggleFeaturedStatus = async (id, isFeatured) => {
  const result = await sql`
    UPDATE courses 
    SET is_featured = ${isFeatured} 
    WHERE id = ${id} 
    RETURNING *;
  `;
  return result[0];
};