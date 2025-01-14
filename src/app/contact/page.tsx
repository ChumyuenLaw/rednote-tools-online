'use client';

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function Contact() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:dongd202306@gmail.com';
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
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need support? We're here to help.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                Send us an email for any questions or support needs.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-rose-600"
                onClick={handleEmailClick}
              >
                Email Us
              </Button>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold">Frequently Asked Support Questions</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">What is the processing time for support requests?</h3>
                <p className="text-muted-foreground">
                  We aim to respond to all support requests within a few hours. Our automated system processes requests instantly.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">What information should I include in my support request?</h3>
                <p className="text-muted-foreground">
                  Please include your browser type, the Rednote link you're trying to process, and a detailed description of any issues you're experiencing.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Do you offer 24/7 support?</h3>
                <p className="text-muted-foreground">
                  Yes! Our automated system is available 24/7, and our support team provides round-the-clock assistance to ensure you get help whenever you need it.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-center text-muted-foreground">
              RedNote Tools is committed to providing excellent support to all our users.
            </p>
          </div>
        </div>
      </main>
    </>
  );
} 