import { SUMMARY_GENERATION, SUMMARY_ERROR_MESSAGES } from "@/constants/chat";

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password) {
  if (!password || typeof password !== "string") {
    return false
  }

  // At least 6 chars, 1 letter, 1 digit, 1 special character
  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]).{6,}$/

  return strongPasswordRegex.test(password)
}

export function validateEmail(email) {
  if (!email) {
    return ["Email is required"];
  }
  
  if (!isValidEmail(email)) {
    return ["Please enter a valid email address"];
  }
  
  return null;
}

export function validatePassword(password) {
  if (!password) {
    return ["Password is required"]
  }

  // Regex: At least 6 chars, one letter, one number, one special char
  const strongPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]).{6,}$/

  if (!strongPasswordRegex.test(password)) {
    return [
      "Password must be at least 6 characters long and include a letter, a number, and a special character",
    ]
  }

  return null
}



export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return ["Please confirm your password"];
  }
  
  if (password !== confirmPassword) {
    return ["Passwords do not match"];
  }
  
  return null;
}

export function validateFullname(fullname) {
  if (!fullname) {
    return ["Full name is required"];
  }

  if (typeof fullname !== 'string' || fullname.trim().length < 2) {
    return ["Please enter your valid full name"];
  }

  return null;
}

export function validateSummaryMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: SUMMARY_ERROR_MESSAGES.INVALID_MESSAGES };
  }

  if (messages.length < SUMMARY_GENERATION.MIN_MESSAGES_FOR_SUMMARY) {
    return { valid: false, error: SUMMARY_ERROR_MESSAGES.INSUFFICIENT_MESSAGES };
  }

  return { valid: true };
}