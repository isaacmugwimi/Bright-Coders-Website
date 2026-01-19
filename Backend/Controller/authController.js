import jwt from "jsonwebtoken";
import {
  clearOTP,
  comparePassword,
  countUsers,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithOTP,
  incrementOtpAttempts,
  resetOtpAttempts,
  saveOTP,
  updateLastLogin,
} from "../Database/Config/config.db.js";
import upload from "../Middleware/uploadMiddleware.js";
import { sendOTPEmail } from "../Utils/mailer.js";
import { canResendOTP, generateOTP, getResendRemainingSeconds } from "../Utils/otp.js";
import { SECURITY_LIMITS } from "../Utils/securityLimits.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Generate TEMP token for 2FA (NOT full auth)
const generateTempToken = (id) => {
  return jwt.sign({ id, twoFactor: true }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
};

// ========================================
// 🔹 Register User
// ========================================
export const registerUser = async (request, response) => {
  const { fullName, email, password, profileImageUrl } = request.body;

  if (!fullName || !email || !password) {
    return response.status(400).json({ message: "All fields are required." });
  }

  try {
    const totalUsers = await countUsers();
    // Register page is now dead forever after first admin.
    if (totalUsers > 0) {
      return response.status(403).json({
        message: "Registration is disabled. Admin already exists.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return response.status(409).json({ message: "Email already in use." });
    }

    const newUser = await createUser(
      fullName,
      email,
      password,
      profileImageUrl,
    );

    // SECURITY: Remove password from the user object before sending to frontend
    const { password_hash, ...userWithoutPassword } = newUser;

    return response.status(201).json({
      message: "User registered successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("[Registration Error]:", error); // Log full error internally
    return response
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

// ========================================
// 🔹 Login User
// ========================================
export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await findUserByEmail(email);

    // SECURITY: Using a generic error message so hackers don't know if the email exists
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    console.log(
      "2FA enabled:",
      user.two_factor_enabled,
      typeof user.two_factor_enabled,
    );

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return response
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    // 🔐 TWO FACTOR AUTH
    if (user.two_factor_enabled) {
      if (!canResendOTP(user)) {
        return response.status(429).json({
          message: "Please wait before requesting another OTP.",
        });
      }

      const otp = generateOTP();
      const expires = new Date(Date.now() + SECURITY_LIMITS.OTP_EXPIRY_MS);

      await saveOTP(user.id, otp, expires);
      await sendOTPEmail(user.email, otp);

      return response.status(200).json({
        twoFactorRequired: true,
        tempToken: generateTempToken(user.id),
        resendAvailableIn: canResendOTP(user)
          ? 0
          : Math.ceil(
              (SECURITY_LIMITS.OTP_RESEND_COOLDOWN_MS -
                (Date.now() - new Date(user.otp_last_sent).getTime())) /
                1000,
            ),
      });
    }

    // ❌ No 2FA → normal login
    await updateLastLogin(user.id);

    // SECURITY: Strip sensitive data
    const { password_hash, ...userWithoutPassword } = user;

    return response.status(200).json({
      message: "Login successful.",
      user: userWithoutPassword,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return response.status(500).json({ message: "Internal server error." });
  }
};

// ========================================
// 🔹 Get User Info
// ========================================
export const getUserInfo = async (request, response) => {
  try {
    const user = await findUserById(request.user.id);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    const { password_hash, ...userWithoutPassword } = user;
    return response.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("[GetUserInfo Error]:", error);
    return response
      .status(500)
      .json({ message: "Error retrieving user profile." });
  }
};

// ========================================
// 🔹 Image Upload
// ========================================
export const imageUpload = async (request, response) => {
  upload.single("image")(request, response, (error) => {
    if (error) {
      console.error("[Upload Error]:", error);
      return response.status(400).json({
        message:
          "Unable to upload image. Please check the 'uploads' directory.",
      });
    }

    if (!request.file) {
      return response.status(400).json({ message: "No file provided." });
    }

    const imageUrl = `${request.protocol}://${request.get("host")}/uploads/${
      request.file.filename
    }`;
    return response.status(200).json({ imageUrl });
  });
};

export const verifyOTP = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { otp } = req.body;

  if (!token || !otp) {
    return res.status(400).json({ message: "OTP required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.twoFactor) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await findUserByIdWithOTP(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Max attempts
    if (user.otp_attempts >= SECURITY_LIMITS.OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many failed attempts. Please login again.",
      });
    }

    // Invalid OTP
    if (
      user.two_factor_code !== otp ||
      new Date(user.two_factor_expires) < new Date()
    ) {
      await incrementOtpAttempts(user.id);
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    // SUCCESS
    await clearOTP(user.id);
    await resetOtpAttempts(user.id);
    await updateLastLogin(user.id);

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user.id),
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("[OTP Error]", error);
    return res.status(401).json({ message: "OTP verification failed." });
  }
};



export const resendOTP = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No temp token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.twoFactor) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!canResendOTP(user)) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
        resendAvailableIn: getResendRemainingSeconds(user),
      });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + SECURITY_LIMITS.OTP_EXPIRY_MS);

    await saveOTP(user.id, otp, expires);
    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      message: "OTP resent successfully",
      resendAvailableIn: SECURITY_LIMITS.OTP_RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired temp token" });
  }
};
