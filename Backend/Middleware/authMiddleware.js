import jwt from "jsonwebtoken";
import { findUserById } from "../Database/Config/config.db.js";

export const protect = async (request, response, next) => {
  let token = request.headers.authorization?.split(" ")[1];
  console.log("this is the token: ", token);
  if (!token) {
    return response.status(401).json({ message: "Not authorized, no token!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    // Add a log here to see exactly what 'user' looks like in your terminal
    console.log("Middleware found user:", user);

    if (!user) {
      return response
        .status(404)
        .json({ message: "User not found in the database" });
    }
    request.user = user;
    next();
  } catch (error) {
    console.log("Authorization Failed!: ", error);
    response.status(401).json({ message: "Token is invalid or expired" });
  }
};
