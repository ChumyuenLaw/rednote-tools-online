import Link from "next/link"
import { Twitter, Mail, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 space-y-6 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left space-y-2">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} RedNote Tools. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> for the community
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center space-x-4">
              <Link 
                href="https://x.com/arkyu2077" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Contact Us"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 