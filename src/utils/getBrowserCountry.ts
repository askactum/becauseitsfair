// Utility to get the user's country code from the browser (using navigator.language or geolocation as fallback)
export function getBrowserCountryCode(): string | null {
  // Try navigator.language (e.g., 'en-US', 'fr-FR')
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language;
    console.log('Browser language:', lang);
    const match = lang.match(/-([A-Z]{2})$/i);
    if (match) return match[1].toUpperCase();
  }
  // Try geolocation (not implemented here for privacy)
  return null;
}
