// import multer from "multer"; 
// //This brings in the Multer library — a Node.js middleware used to handle file uploads (especially multipart/form-data forms).
// import fs from "fs"

// // Ensuring the folder exists
// const uploadDir ="uploads/"
// if(!fs.existsSync(uploadDir)){
//   fs.mkdirSync(uploadDir)
// }


// // configure storage for uploaded files
// const storage = multer.diskStorage({

//   // cb => is a callback function
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // means “Save all uploaded files inside the uploads folder in the backend.”
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // file filter to allow only images
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type. Only JPEG, WEBP, PNG and GIF are allowed."),
//       false
//     );
//   }
// };
// const upload = multer({ storage, fileFilter });
// export default upload;
 


import multer from "multer";

// Store file in memory (not disk)
const storage = multer.memoryStorage();

// File filter (unchanged)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, WEBP allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

export default upload;
