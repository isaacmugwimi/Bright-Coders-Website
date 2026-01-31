import { getStepUpData } from "../Database/Config/stepUpQueries.js";

export const requireStepUp = async (request, response, next) => {
  try {
    const adminId = request.user.id;
    const stepUp = await getStepUpData(adminId);

    // If stepUp is null/undefined, getStepUpData might have failed or 
    // the user doesn't exist in that table yet.
    if (!stepUp || !stepUp.last_verified) {
      return response.status(403).json({ message: "Step-up verification required" });
    }

    const TEN_MIN = 10 * 60 * 1000;
    const lastVerified = new Date(stepUp.last_verified).getTime();

    if (Date.now() - lastVerified > TEN_MIN) {
      return response.status(403).json({ message: "Step-up verification expired" });
    }

    next();
  } catch (err) {
    console.error("Step-up Middleware Error:", err); // Log this to see the REAL error in terminal
    response.status(500).json({ message: "Step-up check failed" });
  }
};