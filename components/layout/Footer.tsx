import Link from 'next/link'
import { TrendingUp, Github, Twitter, Linkedin } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Calculator', href: '/calculator' },
    { label: 'Documentation', href: '/docs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Platforms: [
    { label: 'Amazon India', href: '/calculator?platform=amazon-in' },
    { label: 'Amazon USA', href: '/calculator?platform=amazon-us' },
    { label: 'Flipkart', href: '/calculator?platform=flipkart' },
    { label: 'Meesho', href: '/calculator?platform=meesho' },
    { label: 'eBay', href: '/calculator?platform=ebay' },
    { label: 'Walmart', href: '/calculator?platform=walmart' },
  ],
  Resources: [
    { label: 'Fee Guide', href: '/docs#fees' },
    { label: 'API Reference', href: '/docs#api' },
    { label: 'GST Calculator', href: '/docs#gst' },
    { label: 'ROI Guide', href: '/docs#roi' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00E5A0]/15 ring-1 ring-[#00E5A0]/30">
                <TrendingUp className="h-4 w-4 text-[#00E5A0]" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                OpSell <span className="text-[#00E5A0]">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Free real-time commission calculator for 8+ marketplaces. Know your
              true profit before you sell.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all hover:border-[#00E5A0]/40 hover:text-[#00E5A0]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OpSell AI. Built for sellers, by sellers.
          </p>
          <p className="text-xs text-muted-foreground">
            Fee data sourced from official platform documentation. Always verify
            with seller centers.
          </p>
        </div>
      </div>
    </footer>
  )
}
