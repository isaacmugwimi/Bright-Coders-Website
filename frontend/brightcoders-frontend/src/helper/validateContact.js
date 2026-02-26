// validationUtils.js

export const getWordCount = (text) => {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
};

/**
 * VALIDATE CONTACT FORM
 * Matches the schema: fullName, email, message
 */
export const validateContact = (formData) => {
  const errors = {};

  // 1. Full Name Validation
  if (!formData.fullName.trim()) {
    errors.fullName = "Full Name is required.";
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = "Name must be at least 3 characters.";
  }

  // 2. Email Validation (Regex for standard email format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // 3. Message / Word Count Validation
  const words = getWordCount(formData.message);
  const message = formData.message.trim();
  
  // Adjusted limits for a contact inquiry
  const MIN_WORDS_LIMIT = 3; 
  const MAX_WORDS_LIMIT = 500; 

  if (!message) {
    errors.message = "Message content cannot be empty.";
  } else if (words < MIN_WORDS_LIMIT) {
    errors.message = `Your message is too short. Please provide a bit more detail.`;
  } else if (words > MAX_WORDS_LIMIT) {
    errors.message = `Message is too long. Please keep it under ${MAX_WORDS_LIMIT} words.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};