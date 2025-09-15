export function sanitizeOtp(input: unknown, length = 6): string {
  // Keep only digits, ensure string, preserve leading zeros
  const s = String(input ?? '').replace(/\D/g, '');
  if (!s) return '';
  return s.padStart(length, '0').slice(-length);
}
