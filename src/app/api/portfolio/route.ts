import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import { withAuth } from '@/lib/withAuth';

/**
 * GET the unified portfolio data. Public.
 */
export async function GET() {
  try {
    await connectDB();
    let portfolio = await Portfolio.findOne();

    // If no document exists, create an initial one
    if (!portfolio) {
      portfolio = await Portfolio.create({
        name: 'VISHWAJIT',
        title: 'Full Stack Developer',
        bio: 'Welcome to my portfolio.',
        skills: [],
        experience: [],
        education: [],
        projects: []
      });
    }

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Update the portfolio data. Protected.
 */
export const PUT = withAuth(async (req) => {
  try {
    const body = await req.json();
    await connectDB();

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = await Portfolio.create(body);
    } else {
      // Overwrite entirely for simplicity as per original implementation
      portfolio = await Portfolio.findOneAndUpdate({}, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
