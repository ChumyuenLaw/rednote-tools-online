import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { WebVitals } from "@/components/WebVitals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://rednotetoolsonline.com'
  ),
  title: 'Free Online Rednote Video Downloader - Download Without Watermark | RedNote Tools',
  description: 'Free online Rednote video downloader - Download Rednote videos in HD quality without watermark. Fast, secure, and 100% free online tool for RedNote videos.',
  keywords: ['rednote video downloader', 'free online rednote downloader', 'download rednote videos', 'rednote video without watermark', 'free rednote tools', 'online video downloader'],
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
    title: 'Free Online Rednote Video Downloader - Download Without Watermark',
    description: 'Download Rednote videos in HD quality without watermark. Fast, secure, and 100% free online video downloader for RedNote.',
    url: 'https://rednotetoolsonline.com',
    siteName: 'Free Rednote Video Downloader',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rednote Video Download Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Rednote Video Downloader - HD Quality',
    description: 'Download Rednote videos in HD quality without watermark. Fast, secure, and 100% free online video downloader.',
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-57C665G7');
          `}
        </Script>
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7728179738255536"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads-conversion"
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16807552157"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16807552157');
            gtag('event', 'conversion', {'send_to': 'AW-16807552157/1UlmCMis0ZoaEJ3Ju84-'});

            // Conversion tracking function
            window.gtag_report_conversion = function(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-16807552157/1UlmCMis0ZoaEJ3Ju84-',
                'event_callback': callback
              });
              return false;
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-57C665G7"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
