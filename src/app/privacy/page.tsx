import { Metadata } from "next";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Rednote Tools",
  description: "Privacy policy for Rednote Tools - Learn how we protect your data and privacy.",
};

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p>
                At Rednote Tools (rednotetoolsonline.com), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p>
                We only collect the minimum amount of information necessary to provide our service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>URLs you submit for processing</li>
                <li>Basic usage analytics to improve our service</li>
                <li>Technical information such as browser type and device information</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p>
                We use the collected information solely for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing your content download requests</li>
                <li>Improving our service and user experience</li>
                <li>Maintaining service security and preventing abuse</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Storage</h2>
              <p>
                Rednote Tools does not store any of your downloaded content or submitted URLs. All processing is done in real-time, and no personal data is retained after the download is complete.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Third-Party Services</h2>
              <p>
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics services to understand user behavior and improve our service</li>
                <li>Content delivery networks to ensure fast and reliable service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access information we have about you</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of analytics collection</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="font-medium">dongd202306@gmail.com</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
} 