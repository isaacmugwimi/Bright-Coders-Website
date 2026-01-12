import Joi from "joi";
import { getCourseTitles } from "../../Database/Config/courseQueries.js";

export const registrationValidationSchema = async () => {
  const coursesFromDb = await getCourseTitles(); // fetch dynamic courses from DB
 const courses = coursesFromDb.filter(Boolean); // Remove undefined or null


  console.log("Available courses:", coursesFromDb);

  return Joi.object({
    parentName: Joi.string().min(3).max(255).required().messages({
      "any.required": "Parent name is required",
      "string.min": "Parent name must be at least 3 characters",
    }),

    parentPhone: Joi.string()
      .pattern(/^\+?\d{9,12}$/)
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
      .valid(...courses) // spread safe array
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
      .pattern(/^\+?\d{9,12}$/)
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
    paymentPlan: Joi.string()
      .valid("full", "deposit", "pay_later")
      .required()
      .messages({
        "any.only": "Valid payment plan is required",
      }),

    amountPaid: Joi.number()
      .when("paymentPlan", {
        is: "deposit",
        then: Joi.number().greater(0).required(),
        otherwise: Joi.number().min(0).required(),
      })
      .messages({
        "number.greater": "Deposit amount must be greater than 0",
        "any.required": "Amount paid is required",
      }),

    totalCoursePrice: Joi.number().min(1).required(),

    mpesaCode: Joi.string()
      .uppercase()
      .when("paymentPlan", {
        is: "pay_later",
        then: Joi.string().allow("PAY_LATER", ""),
        otherwise: Joi.string()
          .pattern(/^[A-Z0-9]{10}$/)
          .required(),
      })
      .messages({
        "string.pattern.base": "M-Pesa transaction code must be 10 characters",
        "any.required": "M-Pesa code is required for payments",
      }),
  })
    .custom((obj, helpers) => {
      // LOGIC CHECK: Ensure amountPaid isn't more than total price
      if (obj.amountPaid > obj.totalCoursePrice) {
        return helpers.message("Amount paid cannot exceed the course price");
      }
      return obj;
    })
    .unknown(true);
};
