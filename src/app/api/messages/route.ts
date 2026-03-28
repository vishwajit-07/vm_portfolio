import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import { withAuth } from '@/lib/withAuth';

/**
 * GET all messages. Protected/Admin.
 */
export const GET = withAuth(async () => {
  try {
    await connectDB();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * Create a new message. Public.
 */
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    await connectDB();

    const newMessage = await Message.create({ name, email, message });
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
