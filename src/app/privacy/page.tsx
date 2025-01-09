import { Logo } from '@/components/logo';

export default function PrivacyPolicy() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Introduction</h2>
            <p>At imageconvertfree.com, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our image conversion service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Information We Don&apos;t Collect</h2>
            <p>We want to be clear that we do not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Store your uploaded images</li>
              <li>Track your personal information</li>
              <li>Share any data with third parties</li>
              <li>Use cookies for tracking purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Process Your Images</h2>
            <p>All image processing is done directly in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security of your files.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Technical Information</h2>
            <p>We may collect anonymous usage statistics to improve our service, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Screen resolution</li>
              <li>Performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@imageconvertfree.com</p>
          </section>
        </div>
      </main>
    </>
  );
} 