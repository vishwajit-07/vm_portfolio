import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import { withAuth } from '@/lib/withAuth';

/**
 * DELETE message. Protected/Admin.
 */
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { id } = await params;
    await connectDB();

    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    await Message.deleteOne({ _id: message._id });
    return NextResponse.json({ success: true, message: 'Message removed' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * Mark message as read (using PATCH/PUT). Protected/Admin.
 */
export const PUT = withAuth(async (req, { params }) => {
  try {
    const { id } = await params;
    await connectDB();

    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    message.isRead = true;
    const updatedMessage = await message.save();
    return NextResponse.json({ success: true, data: updatedMessage });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
