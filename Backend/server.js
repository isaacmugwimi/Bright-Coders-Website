import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { initDb } from "./Database/Config/config.db.js";
import authRouter from "./Router/authRouter.js";
import courseRouter from "./Router/courseRouter.js";
import blogRouter from "./Router/blogRouter.js";
import testimonialRouter from "./Router/testimonialRouter.js";
import registrationRouter from "./Router/registrationRouter.js";

import path from "path";
import { fileURLToPath } from "url";
// backend starts here
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "http://localhost:8000",
          "https://images.unsplash.com",
        ], // Allow images from your backend
      },
    },
  }),
);

//Midleware to handle CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

const __filename = fileURLToPath(import.meta.url); //Gets the absolute path of the current file
const __dirname = path.dirname(__filename);

app.use(express.json());
// routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/registration", registrationRouter);

// serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// uploads: name of the subfolder in the backend you want to reach

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

const PORT = process.env.PORT || 8000;

initDb().then(() =>
  app.listen(PORT, () => console.log("Server running on port: ", PORT)),
);

// {

//   remember to include this for security purposes

// dotenv – Loads environment variables from a .env file into process.env to keep sensitive configuration data secure and separate from source code.

// helmet – Secures Express applications by setting HTTP response headers that protect against common web vulnerabilities.

// cors – Controls which external domains are allowed to access your backend resources, enabling safe communication between frontend and backend.

// bcryptjs – Hashes passwords before storing them in the database to protect user credentials even if the database is compromised.

// jsonwebtoken (JWT) – Creates and verifies secure tokens used for user authentication and authorization without storing sessions on the server.

// express-validator – Validates and sanitizes incoming request data to prevent invalid input, injection attacks, and application errors.

// express-rate-limit – Limits the number of requests a client can make in a given time period to prevent brute-force and denial-of-service attacks.

// hpp (HTTP Parameter Pollution) – Protects the server from attacks that manipulate duplicate query parameters in HTTP requests.

// xss-clean – Sanitizes user input to remove malicious scripts and prevent Cross-Site Scripting (XSS) attacks.

// compression – Compresses HTTP responses to reduce payload size and improve application performance and load speed.

// morgan – Logs HTTP requests and responses for monitoring, debugging, and auditing server activity.

// multer – Handles secure file uploads such as images and documents by processing multipart form data in Express.

// uuid – Generates universally unique identifiers to safely identify resources like users, files, or records without collisions.

// }
