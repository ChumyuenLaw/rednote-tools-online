import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Footer } from '@/components/footer';

export default function NotFound() {
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

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-24">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
              404
            </h1>
            <p className="text-xl text-muted-foreground">
              Sorry, the page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-500 to-rose-600 text-white h-10 px-4 py-2 hover:opacity-90"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 