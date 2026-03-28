import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/** Sign a short-lived access token (7d) */
export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

/** Sign a long-lived refresh token (30d) */
export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

/** Verify an access token. Returns the payload or null on failure. */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract the JWT from the incoming request.
 * Priority: Cookie "jwt" → Authorization: Bearer <token>
 */
export function getTokenFromRequest(req: Request): string | null {
  // 1. Try cookie  (set by our login route via next/headers)
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
  if (match) return match[1];

  // 2. Fallback: Authorization header
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}

/** Set httpOnly JWT cookies (call from login route) */
export async function setAuthCookies(userId: string) {
  const token = signToken(userId);
  const refreshToken = signRefreshToken(userId);

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieStore = await cookies();

  cookieStore.set('jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });

  cookieStore.set('jwtRefresh', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return { token, refreshToken };
}

/** Clear auth cookies (call from logout route) */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set('jwt', '', { maxAge: 0, path: '/' });
  cookieStore.set('jwtRefresh', '', { maxAge: 0, path: '/' });
}
