/**
 * Centralised utility helpers used across frontend pages.
 */

/** Mask Aadhaar number — show only last 4 digits */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length < 4) return 'XXXX-XXXX-XXXX';
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
};

/** Mask PAN — show only last 4 chars */
export const maskPAN = (pan) => {
  if (!pan || pan.length < 4) return 'XXXXX-XXXX';
  return `XXXXX${pan.slice(-4)}`;
};

/**
 * Format a date string to a human-readable form.
 * @param {string} dateStr - ISO date string
 * @param {object} opts - Intl.DateTimeFormat options
 */
export const formatDate = (dateStr, opts = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, opts);
};

/** Returns true if the provided JWT token is still valid (not expired). */
export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/** Capitalise the first letter of a string */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
