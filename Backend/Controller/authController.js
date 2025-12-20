import jwt from "jsonwebtoken";
import {
  comparePassword,
  createUser,
  findUserByEmail,
  findUserById,
  updateLastLogin,
} from "../Database/Config/config.db.js";
import upload from "../Middleware/uploadMiddleware.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return response.status(409).json({ message: "Email already in use." });
    }

    const newUser = await createUser(
      fullName,
      email,
      password,
      profileImageUrl
    );

    // SECURITY: Remove password from the user object before sending to frontend
    const { password_hash, ...userWithoutPassword } = newUser;

    return response.status(201).json({
      message: "User registered successfully.",
      user: userWithoutPassword,
      token: generateToken(newUser.id),
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

    // SECURITY: Use a generic error message so hackers don't know if the email exists
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return response
        .status(401)
        .json({ message: "Invalid email or password." });
    }
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
      return response
        .status(400)
        .json({ message: "Upload failed: " + error.message });
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
