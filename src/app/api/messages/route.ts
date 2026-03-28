import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import { withAuth } from '@/lib/withAuth';
import nodemailer from 'nodemailer';

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
 * Create a new message and send email via Nodemailer. Public.
 */
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    
    // 1. Save to Database (Keeping existing functionality)
    try {
      await connectDB();
      await Message.create({ name, email, message });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Non-blocking: we still want to send the email even if DB fails
    }

    // 2. Configure Nodemailer Transporter securely via Env Vars
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Define the Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vishwajitmavalankar54339@gmail.com',
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f97316;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="white-space: pre-wrap; line-height: 1.6;"><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    };

    // 4. Send the Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
