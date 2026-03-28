import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';

/**
 * GET admin profile. Protected route.
 * withAuth higher-order function handles JWT verification and DB connection.
 */
export const GET = withAuth(async (req, { admin }) => {
  return NextResponse.json({
    success: true,
    user: admin
  });
});
