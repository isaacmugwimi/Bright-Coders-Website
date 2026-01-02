import Joi from "joi";
import { getCourseTitles } from "../../Database/Config/courseQueries.js";

export const registrationValidationSchema = async () => {
  // const courses = await getCourseTitles(); // fetch dynamic courses from DB
  const courses = [
    "Intro to Python",
    "Web Development",
    "Robotics for Kids",
    "Scratch Coding",
  ];
  console.log("Available courses:", courses);

  return Joi.object({
    parentName: Joi.string().min(3).max(255).required().messages({
      "any.required": "Parent name is required",
      "string.min": "Parent name must be at least 3 characters",
    }),

    parentPhone: Joi.string()
      .pattern(/^\+?\d{9,15}$/)
      .required()
      .messages({
        "any.required": "Parent phone is required",
        "string.pattern.base": "Parent phone must be a valid number",
      }),

    parentEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "any.required": "Parent email is required",
        "string.email": "Please provide a valid email",
      }),

    childName: Joi.string().min(2).max(255).required().messages({
      "any.required": "Child name is required",
      "string.min": "Child name must be at least 2 characters",
    }),

    ageGroup: Joi.string()
      .required()
      .messages({ "any.required": "Age group is required" }),

    gradeGroup: Joi.string()
      .required()
      .messages({ "any.required": "Grade group is required" }),

    gender: Joi.string()
      .valid("Male", "Female", "Other", "notSay")
      .required()
      .messages({
        "any.only": "Please select a valid gender option",
        "any.required": "Gender is required",
      }),

    course: Joi.string()
      .valid(...(courses || null))
      .required()
      .messages({
        "any.only": "Please select a valid course",
        "any.required": "Course is required",
      }),

    preferredTime: Joi.string()
      .required()
      .messages({ "any.required": "Preferred schedule/time is required" }),

    deviceType: Joi.string()
      .required()
      .messages({ "any.required": "Device type is required" }),

    internetQuality: Joi.string()
      .required()
      .messages({ "any.required": "Internet quality is required" }),

    emergencyContact: Joi.string().min(3).max(255).required().messages({
      "any.required": "Emergency contact name is required",
      "string.min": "Emergency contact must be at least 3 characters",
    }),

    emergencyPhone: Joi.string()
      .pattern(/^\+?\d{9,15}$/)
      .required()
      .messages({
        "any.required": "Emergency phone is required",
        "string.pattern.base": "Emergency phone must be valid",
      }),

    notes: Joi.string().allow("", null).max(1000),

    heardFrom: Joi.string().allow("", null).max(100),

    consent: Joi.boolean().valid(true).required().messages({
      "any.only": "Consent must be given",
      "any.required": "Consent is required",
    }),

    mpesaCode: Joi.string()
      .pattern(/^[A-Z0-9]{10}$/)
      .allow("PAY_LATER", "")
      .messages({
        "string.pattern.base":
          "M-Pesa transaction code must be 10 characters (A-Z, 0-9)",
      }),
  }).unknown(true);
};
