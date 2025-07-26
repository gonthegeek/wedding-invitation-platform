/**
 * Generates a unique invite code for wedding guests
 * Format: XXXX-XXXX (8 characters total, alphanumeric)
 */
export function generateInviteCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters like I, O, 0, 1
  const codeLength = 8;
  const sections = 2;
  const sectionLength = codeLength / sections;
  
  let code = '';
  
  for (let section = 0; section < sections; section++) {
    for (let i = 0; i < sectionLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Add hyphen between sections (except for the last section)
    if (section < sections - 1) {
      code += '-';
    }
  }
  
  return code;
}

/**
 * Validates invite code format
 */
export function validateInviteCode(code: string): boolean {
  const regex = /^[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return regex.test(code);
}

/**
 * Formats invite code to ensure proper format
 */
export function formatInviteCode(code: string): string {
  // Remove any existing hyphens and convert to uppercase
  const cleaned = code.replace(/[-\s]/g, '').toUpperCase();
  
  // Add hyphen after 4th character
  if (cleaned.length >= 4) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
  }
  
  return cleaned;
}
