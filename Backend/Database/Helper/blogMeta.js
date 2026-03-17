import pool from "../Config/config.db.js";

export const getBlogMetadata = async (id) => {
  const result = await pool.query(
    "SELECT title, summary, image_url FROM blogs WHERE id = $1 AND is_public = true",
    [id]
  );
  return result.rows[0];
};