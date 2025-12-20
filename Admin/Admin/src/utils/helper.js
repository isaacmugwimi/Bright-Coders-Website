export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validating password

export const validatePassword = (password) => {
  const minLenghth = 8;
  if (!(password.length >= minLenghth)) {
    return "password must be morethan 8 characters";
  }
  return true;
};

export const validateName = (fullName) => {
  const trimmed = fullName.trim();
  const nameRegex = /^[A-Za-z\s]+$/;
  const minLength = 4;
  if (!trimmed) {
    return "Name cannot be empty.";
  }

  if (!nameRegex.test(trimmed)) {
    return "Name must only contain letters";
  }
  if (!(fullName.length >= minLength)) {
    return "The name is too short! use atleast 4 characters";
  }

  return true;
};

// a utility to format numbers with commas as thousand separators.

export const addThousandSeparator = (num) => {
  if (num == null || isNaN(num)) return "";
  const [integerPart, fractionalPart] = num.toString().split("."); //Split integer and decimal parts

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //   \B → not a word boundary. Prevents adding a comma at the start.

  // (?=(\d{3})+(?!\d)) → positive lookahead: match positions where there are groups of 3 digits ahead, but not beyond the last digit.

  // g → global, replaces all matches.
  // e.g "1234567".replace(/\B(?=(\d{3})+(?!\d))/g, ",") -> "1,234,567"

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};
