export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidIndianPhone = (phone: string): boolean => {
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length >= 10 && clean.length <= 12;
};

export const isValidPincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode.trim());
};
