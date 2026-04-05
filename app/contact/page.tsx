import type { Metadata } from 'next'
import { Mail, Github, Twitter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact CommCalc — report issues, suggest features, or say hello.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Found a fee error? Want a new platform? Just say hi.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        {[
          { icon: Mail, label: 'Email', value: 'hello@commcalc.app', href: 'mailto:hello@commcalc.app', color: '#00E5A0' },
          { icon: Github, label: 'GitHub', value: 'github.com/commcalc', href: '#', color: '#8B5CF6' },
          { icon: Twitter, label: 'Twitter', value: '@commcalcapp', href: '#', color: '#3B82F6' },
        ].map(({ icon: Icon, label, value, href, color }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-6 text-center transition-all hover:border-[color:var(--c)]/40"
            style={{ '--c': color } as React.CSSProperties}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium mt-0.5">{value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How often are fee rates updated?',
              a: 'We review official marketplace documentation regularly and update rates as they change. If you notice an outdated rate, please report it on GitHub.',
            },
            {
              q: 'Can I use the API for my project?',
              a: 'Yes! The /api/calculate endpoint is open. Just send a POST request with the required fields. Rate limiting applies for high-volume use.',
            },
            {
              q: 'Why is my calculation different from Amazon Seller Central?',
              a: 'FBA weight handling and long-term storage fees vary significantly by product dimensions and weight, which we use estimated values for. Always cross-check with your actual FBA fee preview.',
            },
            {
              q: 'Will you add more platforms?',
              a: 'Yes — Etsy, Shopify, Ajio, and Myntra are planned. Request platforms via GitHub issues.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-semibold mb-1.5">{q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
