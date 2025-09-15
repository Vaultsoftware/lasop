// lasop-client/src/utils/token.ts

// Return a token string WITHOUT the 'Bearer ' prefix
export function getTokenFromStorage(): string {
  if (typeof window === 'undefined') return '';

  // 1) common localStorage keys
  const keys = [
    'token',
    'authToken',
    'jwt',
    'adminToken',
    'userToken',
    'studentToken',
    'staffToken',
    'lasop_token',
  ];
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (raw && typeof raw === 'string') {
      const val = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      if (val.trim()) return val.trim();
      // sometimes the token is stored as JSON
      try {
        const parsed = JSON.parse(raw);
        const t = parsed?.token || parsed?.accessToken;
        if (t) {
          return String(t).startsWith('Bearer ')
            ? String(t).slice(7).trim()
            : String(t).trim();
        }
      } catch {}
    }
  }

  // 2) cookie fallback (non-HttpOnly; for SPA convenience)
  const cookie = document.cookie || '';
  const m = cookie.match(/(?:^|;\s*)token=([^;]+)/i);
  if (m?.[1]) {
    const c = decodeURIComponent(m[1]);
    return c.startsWith('Bearer ') ? c.slice(7).trim() : c.trim();
  }

  return '';
}

// Pull a token from Redux state if present, else storage
// Accepts state as 'any' to avoid circular imports
export function pickAnyToken(state?: any): string {
  const fromState =
    state?.student?.token ||
    state?.staff?.token ||
    state?.user?.token ||
    state?.admin?.token ||
    '';

  if (fromState) {
    return String(fromState).startsWith('Bearer ')
      ? String(fromState).slice(7).trim()
      : String(fromState).trim();
  }

  return getTokenFromStorage();
}
