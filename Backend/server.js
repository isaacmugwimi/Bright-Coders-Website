import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
// import csrf from "csurf";
import { fileURLToPath } from "url";

// Route Imports
import { initDb } from "./Database/Config/config.db.js";
import authRouter from "./Router/authRouter.js";
import courseRouter from "./Router/courseRouter.js";
import blogRouter from "./Router/blogRouter.js";
import testimonialRouter from "./Router/testimonialRouter.js";
import registrationRouter from "./Router/registrationRouter.js";
import adminRouter from "./Router/admin.routes.js"
import stepUpRouter from "./Router/stepUp.routes.js"
import forgotPasswordRouter from "./Router/authResetRoutes.js"
import { csrfProtection } from "./Middleware/csrfMiddleware.js";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ==========================================
// 1. TRUST PROXY (IMPORTANT FOR RENDER)
// ==========================================
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // common for most cloud hosts
} else {
  app.set("trust proxy", 0); // localhost / dev
}

// ==========================================
// 2. STRICT CORS (HARDENED)
// ==========================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://bright-coders-live-website.vercel.app",
  "https://bright-coders-website-nu.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // !origin means server to server
      if (!origin) {
        return callback(null, true); //postman, mobile
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("🛑 Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  }),
);

// ==========================================
// 3. SECURITY HEADERS (HELMET)
// ==========================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "https:",
          ...(process.env.NODE_ENV !== "production"
            ? ["http://localhost:8000"]
            : []),
        ],
      },
    },
  }),
);

// ==========================================
// 4. BODY & COOKIE PARSING
// ==========================================

app.use(express.json({ limit: "10kb" })); // prevent payload abuse
app.use(cookieParser());

// ==========================================
// 5. RATE LIMITING (ANTI-ABUSE)
// ==========================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500, // login / otp attempts
  message: "Too many atempts. Please try again later.",
});

// 📊 Relaxed limiter for general data fetching
const generalLimiter = rateLimit({
  windowMs: 1 * 60,
  max: 50, // Allows for dashboard refreshes without blocking
  message: "Slow down! You are refreshing too fast.",
});
app.use("/api/auth", authLimiter);

app.use("/api/", generalLimiter);

// ==========================================
// 6. CSRF PROTECTION (COOKIE-BASED)
// ==========================================



// Provide CSRF token to frontend
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

// ==========================================
// 7. ROUTES
// ==========================================
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/registration", registrationRouter);
app.use("/api/admin/",adminRouter)
app.use("/api/admin/step-up",stepUpRouter)
app.use("/api/auth-reset", forgotPasswordRouter);

// ==========================================
// 8. STATIC FILES (SAFE)
// ==========================================
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"), {
//     maxAge: "1d",
//     setHeaders: (res) => {
//       res.set("X-Content-Type-Options", "nosniff");
//     },
//   }),
// );

// ==========================================
// 9. HEALTH CHECK
// ==========================================
app.get("/", (req, res) => {
  res.send("Bright Coders API is running ✅");
});

// ==========================================
// 10. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  res.status(500).json({ message: "Internal server error" });
});

// ==========================================
// 11. SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 8000;

// Initialize DB then start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
      console.log(`🌍 Production URL: https://brightcoders-api.onrender.com`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize DB:", err);
    process.exit(1); // Exit if DB fails
  });

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
