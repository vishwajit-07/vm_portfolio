import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/User';
import { setAuthCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const adminExists = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (adminExists) {
      return NextResponse.json(
        { success: false, message: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      password
    });

    if (admin) {
      const { token } = await setAuthCookies(admin._id.toString());
      return NextResponse.json(
        {
          success: true,
          token,
          user: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid admin data' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
