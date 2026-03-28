import { v2 as cloudinary } from 'cloudinary';

// Configure once — safe to call multiple times (cloudinary is a singleton)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload a buffer/Blob to Cloudinary using the upload_stream API.
 * This is the multer-free approach required for Next.js API routes.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'portfolio'
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
}
