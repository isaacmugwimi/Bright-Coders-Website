import fs from "fs";
import path from "path";
import cloudinary from "./cloudinary.js";

const uploadsDir = path.join(process.cwd(), "uploads");

const migrate = async () => {
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
         ,
      });

      console.log(`✅ Uploaded: ${file} → ${result.secure_url}`);

      // OPTIONAL: save mapping somewhere
      // old filename → result.secure_url
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err.message);
    }
  }
};

migrate();
