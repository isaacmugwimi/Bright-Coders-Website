import Joi from "joi";

export const courseSchema = Joi.object({
  code: Joi.string().uppercase().alphanum().min(2).max(10).required().messages({
    "string.empty": "Course code is required",
    "string.alphanum": "Code must be letters/numbers only",
    "string.max": "Max 10 characters",
  }),

  title: Joi.string().trim().min(5).max(100).required(),
  category: Joi.string().trim().max(50).required(),
  duration: Joi.string().trim().required(),
  price: Joi.number().min(0).max(1000000).required(),
  level: Joi.string().valid("Beginner", "Intermediate", "Advanced").required(),
  imageUrl: Joi.string().uri().required(),

  isPublic: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),

  description: Joi.object({
    definition: Joi.string().max(1000).required(),
    learningPoints: Joi.array().items(Joi.string()).min(1).required(),
    outcome: Joi.string().required(),
  }).required(),

  requirements: Joi.array().items(Joi.string()).min(1).required(),
  focus: Joi.array().items(Joi.string()).min(1).required(),
});

export const toggleFeaturedSchema = Joi.object({
  isFeatured: Joi.boolean().required(),
});
