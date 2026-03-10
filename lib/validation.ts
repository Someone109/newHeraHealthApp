//check if email is valid
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//check if password is valid
export function isValidPassword(password: string): boolean {
  if (!password) return false;
  if (password.trim().length < 8) return false;
  return true;
}

// check if name is valid
export function validateName(name: string): boolean {
  if (!name) return false;

  const trimmed = name.trim();

  // Length check
  if (trimmed.length < 2 || trimmed.length > 50) return false;

  // Character rules: letters, spaces, hyphens, apostrophes
  const pattern = /^[A-Za-z][A-Za-z\s'-]*[A-Za-z]$/;

  return pattern.test(trimmed);
}
