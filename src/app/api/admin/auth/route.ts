import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/User';
import { setAuthCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by email — explicitly select hidden password field for comparison
    let admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // SELF-HEALING: If no admin exists in the entire database, create a default one
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        // Create initial default admin
        admin = await Admin.create({
          name: 'Vishwajit Mavalankar',
          email: 'vishwajitmavalankar54339@gmail.com',
          password: 'Vishwajit@2001',
          role: 'admin'
        });
        console.log('Self-healing: Default admin created (vishwajitmavalankar54339@gmail.com / Vishwajit@2001)');
      } else {
        return NextResponse.json(
          { success: false, message: 'Admin account not found' },
          { status: 404 }
        );
      }
    }

    // Compare passwords using the method from our TypeScript model
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate tokens and set cookies using our next/headers helper
    const { token } = await setAuthCookies(admin._id.toString());

    return NextResponse.json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
