import { validateEmail, validateName, validatePhone } from "./validationHelpers";

export const validateStep = (step, formData) => {
  // STEP 1: Parent Info
  if (step === 1) {
    const nameCheck = validateName(formData.parentName);
    if (nameCheck !== true) return { field: "parentName", message: nameCheck };

    const phoneCheck = validatePhone(formData.parentPhone);
    if (phoneCheck !== true) return { field: "parentPhone", message: phoneCheck };

    const emailCheck = validateEmail(formData.parentEmail);
    if (emailCheck !== true) return { field: "parentEmail", message: emailCheck };
  }

  // STEP 2: Child Info
  if (step === 2) {
    const childNameCheck = validateName(formData.childName);
    if (childNameCheck !== true)
      return { field: "childName", message: childNameCheck };

    if (!formData.ageGroup)
      return { field: "ageGroup", message: "Select an Age Group." };

    if (!formData.gradeGroup)
      return { field: "gradeGroup", message: "Select a Grade Group." };

    if (!formData.gender)
      return { field: "gender", message: "Select Gender." };

    if (!formData.course)
      return { field: "course", message: "Select a Course." };
  }

  // STEP 3: Class Preferences
  if (step === 3) {
    if (!formData.preferredTime)
      return { field: "preferredTime", message: "Select Preferred Class Time." };

    if (!formData.deviceType)
      return { field: "deviceType", message: "Select Device Type." };

    if (!formData.internetQuality)
      return { field: "internetQuality", message: "Select Internet Quality." };

    const emergencyCheck = validateName(formData.emergencyContact);
    if (emergencyCheck !== true)
      return { field: "emergencyContact", message: emergencyCheck };

    const emergencyPhoneCheck = validatePhone(formData.emergencyPhone);
    if (emergencyPhoneCheck !== true)
      return { field: "emergencyPhone", message: emergencyPhoneCheck };

    if (!formData.heardFrom)
      return { field: "heardFrom", message: "Select how you heard about us." };
  }

  // STEP 4: Consent
  if (step === 4) {
    if (!formData.consent)
      return { field: "consent", message: "You must agree to the terms." };
  }

  return null; // No errors
};
