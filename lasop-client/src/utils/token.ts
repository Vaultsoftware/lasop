// Tries Redux-like slices, then localStorage, then cookies.
export function pickAnyToken(state?: any): string | null {
  const s = state || {};
  const candidates = [s?.student?.token, s?.staff?.token, s?.user?.token, s?.admin?.token];
  for (const v of candidates) if (typeof v === 'string' && v) return v;

  return getTokenFromStorage();
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;

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
    const v = localStorage.getItem(k);
    if (v && v.length > 10) return stripBearer(v);
    try {
      const parsed = JSON.parse(v || '{}');
      if (parsed?.token && parsed.token.length > 10) return stripBearer(parsed.token);
    } catch {}
  }

  const cookie = document.cookie || '';
  const m = cookie.match(/(?:^|;\s*)(token|authToken|jwt)=([^;]+)/i);
  if (m?.[2]) return stripBearer(decodeURIComponent(m[2]));

  return null;
}

function stripBearer(v: string): string {
  return v.startsWith('Bearer ') ? v.slice(7) : v;
}
