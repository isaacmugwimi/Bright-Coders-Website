// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? true : "Invalid email address.";
};

// Validate names (letters only, min 4 chars)
export const validateName = (fullName) => {
  const trimmed = fullName.trim();
  const nameRegex = /^[A-Za-z\s]+$/;
  const minLength = 4;

  if (!trimmed) return "Name cannot be empty.";
  if (!nameRegex.test(trimmed)) return "Name must only contain letters.";
  if (trimmed.length < minLength)
    return `Name is too short. Minimum ${minLength} characters.`;

  return true;
};

// // Validate phone number (digits only, length 10)
// export const validatePhone = (phone) => {
//   const phoneRegex = /^\d{10,15}$/; // allow 10–15 digits
//   return phoneRegex.test(phone)
//     ? true
//     : "Phone number must contain 10-15 digits only.";
// };

export const validatePhone = (phone) => {
if (!phone) return "Phone number is required.";
  
  // React-phone-input-2 returns numbers without the "+"
  // Kenya: 254 (3) + Number (9) = 12 digits
  const phoneLength = phone.replace(/\D/g, "").length; // Remove any non-digits just in case

  if (phoneLength < 12) {
    return "Phone number is too short. Please enter the full number.";
  }
  
  if (phoneLength > 12) {
    return "Phone number is too long.";
  }
    return true
};
