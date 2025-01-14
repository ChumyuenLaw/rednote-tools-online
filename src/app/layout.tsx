import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://rednotetoolsonline.com'
  ),
  title: 'Rednote - Professional Content Downloader Without Watermark',
  description: 'Download Rednote images and videos without watermarks. Fast, secure, and reliable. The best tool for saving content from Rednote.',
  keywords: ['rednote downloader', 'rednote no watermark', 'download rednote', 'rednote images', 'rednote videos', 'xiaohongshu downloader', '小红书无水印下载'],
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
    title: 'RedNote - Professional Content Downloader Without Watermark',
    description: 'Download RedNote images and videos without watermarks. Fast, secure, and reliable.',
    url: 'https://rednotetoolsonline.com',
    siteName: 'Rednote Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rednote Tools - Content Downloader',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rednote - Professional Content Downloader',
    description: 'Download Rednote images and videos without watermarks. Fast, secure, and reliable.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
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
        <Analytics />
      </body>
    </html>
  );
}
