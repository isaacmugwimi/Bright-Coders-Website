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
  return phone.length >= 10 && phone.length <= 15
    ? true
    : "Phone number must contain 10-15 digits only.";
};
