import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <>
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

      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">What Are Cookies</h2>
            <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
            <p>At rednotetoolsonline.com, we use only essential cookies that are necessary for the website to function properly. We do not use any tracking or advertising cookies.</p>
            
            <div className="mt-4">
              <h3 className="font-medium text-foreground mb-2">Essential Cookies:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session cookies to maintain your session while using our service</li>
                <li>Security cookies to protect against malicious attacks</li>
                <li>Functionality cookies to remember your preferences</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p>Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect the functionality of our website.</p>
            
            <div className="mt-4">
              <h3 className="font-medium text-foreground mb-2">How to manage cookies in your browser:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                <li>Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                <li>Safari: Preferences → Privacy → Cookies and website data</li>
                <li>Microsoft Edge: Settings → Privacy, search, and services → Cookies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p>We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>If you have any questions about our Cookie Policy, please contact us at dongd202306@gmail.com</p>
          </section>
        </div>
      </main>
    </>
  );
} 