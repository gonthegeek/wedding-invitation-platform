/**
 * Phone number utility functions for WhatsApp and SMS integration
 */

/**
 * Cleans a phone number by removing all non-numeric characters except the leading +
 * @param phoneNumber - The raw phone number string
 * @returns Cleaned phone number string
 */
export const cleanPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[^\d+]/g, '');
};

/**
 * Formats a phone number for WhatsApp (removes + and leading zeros after country code)
 * @param phoneNumber - The phone number to format
 * @returns WhatsApp-compatible phone number
 */
export const formatForWhatsApp = (phoneNumber: string): string => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
};

/**
 * Validates if a phone number appears to be valid
 * @param phoneNumber - The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  // Basic validation: should have at least 7 digits and at most 15 (international standard)
  // Can optionally start with +
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Formats a phone number for display purposes
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number for display
 */
export const formatPhoneForDisplay = (phoneNumber: string): string => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  // If it's a US number (starts with +1 or is 10 digits)
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    const digits = cleaned.slice(2);
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // For international numbers, just add spacing after country code
  if (cleaned.startsWith('+') && cleaned.length > 7) {
    return cleaned.replace(/^(\+\d{1,3})(\d{3})(\d{3})(\d+)$/, '$1 $2 $3 $4');
  }
  
  // Return as-is if we can't format it nicely
  return cleaned;
};

/**
 * Gets the country code from a phone number
 * @param phoneNumber - The phone number
 * @returns The country code or null if not found
 */
export const getCountryCode = (phoneNumber: string): string | null => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (!cleaned.startsWith('+')) {
    return null;
  }
  
  // Common country codes (this could be expanded)
  const countryCodes = ['+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+93', '+94', '+95', '+98'];
  
  for (const code of countryCodes.sort((a, b) => b.length - a.length)) {
    if (cleaned.startsWith(code)) {
      return code;
    }
  }
  
  // Fallback: assume 1-3 digit country code
  const match = cleaned.match(/^\+(\d{1,3})/);
  return match ? `+${match[1]}` : null;
};
