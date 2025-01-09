import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Free Image Converter - Convert WebP, PNG, JPG, GIF, RAW Online | imageconvertfree.com',
  description: 'Free online image converter. Convert between WebP, PNG, JPG, JPEG, GIF, and RAW formats instantly. No registration, no watermark, no limits. 100% free forever.',
  keywords: ['image converter', 'webp converter', 'png converter', 'jpg converter', 'gif converter', 'raw converter', 'free image converter', 'online image converter'],
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: 'Free Image Converter - Convert WebP, PNG, JPG, GIF, RAW Online',
    description: 'Free online image converter. Convert between WebP, PNG, JPG, JPEG, GIF, and RAW formats instantly. No registration required.',
    url: 'https://imageconvertfree.com',
    siteName: 'imageconvertfree.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Converter - Convert WebP, PNG, JPG, GIF, RAW Online',
    description: 'Free online image converter. Convert between WebP, PNG, JPG, JPEG, GIF, and RAW formats instantly. No registration required.',
    images: ['/og-image.png'],
    creator: '@arkyu2077',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
