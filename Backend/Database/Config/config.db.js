import dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const initDb = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

export default async function testDbConnection(params) {
  try {
    const result = await initDb`SELECT 1`;
    console.log("✅ Database connected successfully!", result);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
}
