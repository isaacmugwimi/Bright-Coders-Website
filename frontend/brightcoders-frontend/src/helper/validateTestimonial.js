// validationUtils.js

export const validateTestimonial = (formData, image) => {
  const errors = {};
  const WORD_LIMIT = 50;

  // Name Validation
  if (!formData.user_name.trim()) {
    errors.user_name = "Full Name is required.";
  } else if (formData.user_name.trim().length < 3) {
    errors.user_name = "Name must be at least 3 characters.";
  }

  // Role Validation
  if (!formData.user_role.trim()) {
    errors.user_role = "Please specify your role (e.g., Student).";
  }

  // Message / Word Count Validation
  const message = formData.message.trim();
  const words = message === "" ? 0 : message.split(/\s+/).length;

  if (!message) {
    errors.message = "The testimonial message cannot be empty.";
  } else if (words > WORD_LIMIT) {
    errors.message = `Story is too long! Please keep it under ${WORD_LIMIT} words (Current: ${words}).`;
  } else if (message.length < 10) {
    errors.message = "Please write a bit more (at least 10 characters).";
  }

  // Image Validation (Optional but recommended)
  if (image) {
    const fileSize = image.size / 1024 / 1024; // in MB
    if (fileSize > 2) {
      errors.image = "Image is too large. Max size is 2MB.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type. Please upload a JPG, PNG, or WebP image.");
    return false;
  }

  if (file.size > maxSize) {
    alert("File is too large. Maximum size is 2MB.");
    return false;
  }

  return true;
};