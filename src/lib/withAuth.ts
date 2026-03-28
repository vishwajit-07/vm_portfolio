import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from './auth';
import connectDB from './db';
import User from './models/User';

export type AuthenticatedHandler = (
  req: Request,
  context: { params: Promise<Record<string, string>>; admin: any }
) => Promise<Response>;

/**
 * Wraps a Next.js Route Handler to require a valid JWT.
 * Attaches the admin document to `context.admin`.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (
    req: Request,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, no token' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, token invalid or expired' },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await User.findById(payload.userId).select('-password');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin account deleted or not found' },
        { status: 401 }
      );
    }

    return handler(req, { ...context, admin });
  };
}
