'use client';

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function ApiPage() {
  const [copied, setCopied] = useState(false);
  const apiEmail = 'dongd202306@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(apiEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground">
                API
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center p-8 md:p-24 pt-24">
        <div className="max-w-3xl w-full space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">API Access</h1>
            <p className="text-lg text-muted-foreground">
              Get access to our powerful Rednote content download API for your applications.
            </p>
          </div>

          <div className="space-y-8">
            {/* Contact Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Request API Access</h2>
              <p className="text-muted-foreground">
                To get started with our API, please contact us via email. We'll provide you with API credentials and documentation.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : apiEmail}</span>
                </Button>
                <Button
                  onClick={() => window.location.href = `mailto:${apiEmail}`}
                  className="bg-gradient-to-r from-red-500 to-rose-600"
                >
                  Send Email
                </Button>
              </div>
            </section>

            {/* Features Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">API Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">High Performance</h3>
                  <p className="text-sm text-muted-foreground">Fast and reliable API with excellent uptime</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Flexible Integration</h3>
                  <p className="text-sm text-muted-foreground">Easy to integrate with any platform or language</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Comprehensive Support</h3>
                  <p className="text-sm text-muted-foreground">Detailed documentation and technical support</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Fair Pricing</h3>
                  <p className="text-sm text-muted-foreground">Competitive rates with flexible plans</p>
                </div>
              </div>
            </section>

            {/* Getting Started Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Getting Started</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Contact Us</h3>
                  <p className="text-muted-foreground">
                    Send us an email to request API access credentials.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">2. Receive Credentials</h3>
                  <p className="text-muted-foreground">
                    We'll provide you with an API key and necessary documentation.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">3. Integration</h3>
                  <p className="text-muted-foreground">
                    Follow our documentation to integrate the API into your application.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
} 