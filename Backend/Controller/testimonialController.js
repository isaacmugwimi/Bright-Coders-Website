import { testimonialValidationSchema } from "../Middleware/Validators/testimonialValidator.js";
import * as Queries from "../Database/Config/testimonialsQueries.js";
import { sendAdminNotification } from "../Utils/mailer.js";
import { generateTestimonialAdminEmail } from "../Utils/mailhelper.js";

// 1. ADD NEW TESTIMONIAL (Public Submission)
export const handleAddTestimonial = async (request, response) => {
  try {
    // 1. Validate the text fields from the body
    const { error, value } = testimonialValidationSchema.validate(
      request.body,
      { abortEarly: false },
    );

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return response
        .status(400)
        .json({ message: "Validation failed!", errors: errorMessages });
    }

    // 2. Capture the image path if a file was uploaded
    // We use request.file.filename (or path) provided by Multer
    const imagePath = request.file ? `/uploads/${request.file.filename}` : null;

    // 3. Merge the validated text with the image path
    const testimonialData = {
      ...value,
      imageUrl: imagePath, // This must match the column name in your database
    };

    // 4. Pass the combined object to your Query
    const newTestimonial = await Queries.createTestimonial(testimonialData);

    // ✅ SEND EMAIL
    const email = generateTestimonialAdminEmail({
      userName: value.userName,
      message: value.message,
    });

    await sendAdminNotification(email.subject, email.html);

    return response.status(201).json({
      message: "Thank you! Your testimonial has been submitted for review.",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("ADD_TESTIMONIAL_ERROR:", error);
    return response.status(500).json({
      message: "An internal error occurred while submitting your testimonial.",
    });
  }
};

// 2. GET ALL TESTIMONIALS (Admin View)
export const handleGetAllTestimonials = async (request, response) => {
  try {
    const testimonials = await Queries.getAllTestimonials();
    return response.status(200).json(testimonials);
  } catch (error) {
    console.error("GET_ALL_TESTIMONIALS_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Unable to retrieve testimonials at this time." });
  }
};

// 3. GET LIVE TESTIMONIALS (Public View)
export const handleGetLiveTestimonials = async (request, response) => {
  try {
    const testimonials = await Queries.getLiveTestimonials();
    return response.status(200).json(testimonials);
  } catch (error) {
    console.error("GET_LIVE_TESTIMONIALS_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Unable to load the testimonial feed." });
  }
};

// 4. APPROVE TESTIMONIAL (Publish)
export const handleApproveTestimonial = async (request, response) => {
  try {
    const { id } = request.params;
    const approved = await Queries.approveTestimonial(id);

    if (!approved)
      return response.status(404).json({ message: "Testimonial not found." });

    return response.status(200).json({
      message: "Testimonial approved and is now live!",
      data: approved,
    });
  } catch (error) {
    console.error("APPROVE_TESTIMONIAL_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Error occurred while approving the testimonial." });
  }
};

// 5. HIDE TESTIMONIAL (Withdraw)
export const handleHideTestimonial = async (request, response) => {
  try {
    const { id } = request.params;
    const hidden = await Queries.hideTestimonial(id);

    if (!hidden)
      return response.status(404).json({ message: "Testimonial not found." });

    return response.status(200).json({
      message: "Testimonial hidden from public view.",
      data: hidden,
    });
  } catch (error) {
    console.error("HIDE_TESTIMONIAL_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Error occurred while hiding the testimonial." });
  }
};

// 6. DELETE TESTIMONIAL
export const handleDeleteTestimonial = async (request, response) => {
  try {
    const { id } = request.params;
    const deleted = await Queries.deleteTestimonialById(id);

    if (!deleted) {
      return response
        .status(404)
        .json({ message: "Testimonial does not exist or already deleted." });
    }

    return response
      .status(200)
      .json({ message: "Testimonial successfully deleted." });
  } catch (error) {
    console.error("DELETE_TESTIMONIAL_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Could not delete the testimonial." });
  }
};
