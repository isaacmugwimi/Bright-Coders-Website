import Joi from "joi";

export const contactValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    "string.min": "Full name must be at least 3 characters long",
    "any.required": "Full name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // Flexible email validation
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  message: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Your message is too short (minimum 10 characters)",
    "string.max": "Message is too long (maximum 2000 characters)",
    "any.required": "Message content cannot be empty",
  }),
});
