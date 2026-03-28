import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * Handle image uploads to Cloudinary. Protected/Admin.
 * Uses native Request.formData() and our uploadToCloudinary helper.
 */
export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary SDK
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, 'portfolio');

    // Return the URL directly to match existing frontend expectation
    // (Existing Express route returned `req.file.path`)
    return new Response(result.url, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
});
