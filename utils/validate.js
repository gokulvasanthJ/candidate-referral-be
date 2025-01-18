const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Assumes Indian phone numbers for this example
  return phoneRegex.test(phone);
};

const validateCandidate = (candidate) => {
  const { name, email, phone, jobTitle } = candidate;

  if (!name || typeof name !== "string" || name.trim() === "") {
      return { isValid: false, message: "Invalid or missing name" };
  }

  if (!validateEmail(email)) {
      return { isValid: false, message: "Invalid email format" };
  }

  if (!validatePhone(phone)) {
      return { isValid: false, message: "Invalid phone number format" };
  }

  if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim() === "") {
      return { isValid: false, message: "Invalid or missing job title" };
  }

  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePhone,
  validateCandidate,
};