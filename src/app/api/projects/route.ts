import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = parseInt(searchParams.get('skip') || '0');

    await connectDB();

    const portfolio = await Portfolio.findOne({}, {
      projects: { $slice: [skip, limit] }
    }).lean();

    if (!portfolio) {
      return NextResponse.json({ success: false, message: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: portfolio.projects,
      hasMore: portfolio.projects.length === limit
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
