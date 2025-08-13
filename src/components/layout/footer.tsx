import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Environment Sync Station</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Eliminate "works on my machine" problems forever with one-click environment synchronization.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="#workflow" className="text-muted-foreground hover:text-foreground">How It Works</Link></li>
              <li><Link href="#integrations" className="text-muted-foreground hover:text-foreground">Integrations</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link href="/api" className="text-muted-foreground hover:text-foreground">API Reference</Link></li>
              <li><Link href="/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Environment Sync Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};