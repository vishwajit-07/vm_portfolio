import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.22"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    // Removed `unoptimized: true` — Next.js image optimization is now enabled.
    // Cloudinary images will be served as WebP with automatic resizing via /_next/image.
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
