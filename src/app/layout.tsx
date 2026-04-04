import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import CustomCursor from "@/components/animations/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VISHWAJIT | Portfolio",
  description: "Innovative Portfolio showcasing clean code and modern web experiences.",
  openGraph: {
    title: "VISHWAJIT | Portfolio",
    description: "Premium digital experiences by a creative full-stack developer.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vishwajit",
    "jobTitle": "Full Stack Developer",
    "url": "https://your-portfolio-url.com", // User should update this
    "sameAs": [
      "https://github.com/vishwajit-07",
      "https://linkedin.com/in/vishwajit"
    ],
    "description": "Innovative Full-Stack Developer specializing in clean code and modern web experiences."
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative min-h-full flex flex-col font-sans bg-[#0B0B0F] text-[#f8fafc] selection:bg-orange-500/30 overflow-x-hidden">
        <div className="bg-mesh-noise" />
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
