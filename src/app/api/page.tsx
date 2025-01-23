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
            {/* Free Test Key Section */}
            <section className="p-6 border rounded-lg bg-card/50 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Try Before You Buy</h2>
                  <p className="text-muted-foreground">
                    Want to test our API first? Contact us at{' '}
                    <button 
                      onClick={handleCopyEmail}
                      className="text-primary hover:underline font-medium"
                    >
                      {apiEmail}
                    </button>
                    {' '}to get a free test API key.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleCopyEmail}
                    >
                      <Mail className="h-4 w-4" />
                      {copied ? 'Email Copied!' : 'Copy Email'}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-red-500 to-rose-600"
                      onClick={() => window.location.href = `mailto:${apiEmail}?subject=Request for API Test Key`}
                    >
                      Request Test Key
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">API Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                <div className="p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">$9.90</h3>
                      <span className="text-sm text-muted-foreground">Monthly</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        600 API calls per month
                      </li>
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        Auto-renewal
                      </li>
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        Full API documentation
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600"
                        onClick={() => window.open('https://buy.stripe.com/bIY014c9HcHmdq05km', '_blank')}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* One-time Plan */}
                <div className="p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">$19.90</h3>
                      <span className="text-sm text-muted-foreground">One-time payment</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        1,000 API calls
                      </li>
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        No expiration date
                      </li>
                      <li className="flex items-center text-base">
                        <span className="text-green-500 mr-2">✓</span>
                        Full API documentation
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600"
                        onClick={() => window.open('https://buy.stripe.com/4gw1584Hf8r6adOdQR', '_blank')}
                      >
                        Purchase Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center mt-4">
                After successful payment, we will send the API key to your payment email address
              </p>
            </section>

            {/* API Documentation Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">API Documentation</h2>
              <div className="border rounded-lg bg-card overflow-hidden">
                {/* Endpoint */}
                <div className="p-6 border-b">
                  <h3 className="font-medium mb-3">API Endpoint</h3>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">POST</span>
                    <code className="text-sm flex-1">https://api.rednotetoolsonline.com/v1/api/rednote-downloader</code>
                  </div>
                </div>

                {/* Headers */}
                <div className="p-6 border-b">
                  <h3 className="font-medium mb-3">Headers</h3>
                  <div className="space-y-2">
                    <div className="flex gap-4 items-center">
                      <code className="text-sm font-semibold min-w-[120px]">Authorization:</code>
                      <code className="text-sm text-muted-foreground">KEY ${'{YOUR_KEY}'}</code>
                    </div>
                    <div className="flex gap-4 items-center">
                      <code className="text-sm font-semibold min-w-[120px]">Content-Type:</code>
                      <code className="text-sm text-muted-foreground">application/json</code>
                    </div>
                    <div className="flex gap-4 items-center">
                      <code className="text-sm font-semibold min-w-[120px]">Accept:</code>
                      <code className="text-sm text-muted-foreground">application/json</code>
                    </div>
                  </div>
                </div>

                {/* Request Body */}
                <div className="p-6 border-b">
                  <h3 className="font-medium mb-3">Request Body</h3>
                  <div className="bg-muted rounded-md p-4">
                    <pre className="text-sm">{`{
  "url": "https://www.xiaohongshu.com/explore/{ID}"
}`}</pre>
                  </div>
                </div>

                {/* Example Request */}
                <div className="p-6">
                  <h3 className="font-medium mb-3">Example Request</h3>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm whitespace-pre overflow-x-auto">
{`curl -X 'POST' \\
  'https://api.rednotetoolsonline.com/v1/api/rednote-downloader' \\
  -H 'accept: application/json' \\
  -H 'Authorization: KEY \${YOUR_KEY}' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "url": "https://www.xiaohongshu.com/explore/6762504c00000000140208d7"
}'`}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="max-w-md"
                  onClick={() => window.open('https://api.rednotetoolsonline.com/docs', '_blank')}
                >
                  View Full API Documentation
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

            {/* Contact Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Support</h2>
              <p className="text-muted-foreground">
                Feel free to contact us anytime for support, questions, or to get started with our API. We're here to help!
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

          </div>
        </div>
      </main>
    </>
  );
} 