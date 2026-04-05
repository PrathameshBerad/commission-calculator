import type { Metadata } from 'next'
import { Target, Zap, Shield, Code2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'About CommCalc — the free, open marketplace commission calculator.',
}

const VALUES = [
  {
    icon: Target,
    title: 'Accuracy First',
    description:
      'Every fee rate is sourced from official marketplace seller centers. We update rates regularly and document sources.',
    color: '#00E5A0',
  },
  {
    icon: Zap,
    title: 'Instant & Free',
    description:
      'No sign-up, no paywalls, no limits. Calculate as many times as you need for any product, any platform.',
    color: '#3B82F6',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    description:
      'All calculations run in your browser. We don\'t collect, store or sell your data. Period.',
    color: '#8B5CF6',
  },
  {
    icon: Code2,
    title: 'Built for India',
    description:
      'Deep India-specific support: GST on fees, TCS deductions, INR formatting, and Indian marketplace coverage.',
    color: '#F59E0B',
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          About <span className="gradient-text">CommCalc</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Built to give e-commerce sellers the one thing they need most: clarity
          on their true profitability.
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-16">
        <h2>Why CommCalc Exists</h2>
        <p>
          Marketplace fees are complicated. Between referral percentages, fixed
          closing fees, payment gateway charges, GST on platform fees, TCS
          withholding, COD surcharges and shipping costs — calculating your
          actual net payout is far from straightforward.
        </p>
        <p>
          Most sellers either guess, get it wrong in spreadsheets, or discover
          their true margins only after receiving their settlement statement.
          CommCalc was built to solve this — a single, accurate, real-time
          calculator covering every major marketplace.
        </p>
        <h2>What We Calculate</h2>
        <p>
          CommCalc handles every fee type: platform commissions (including tiered
          rates), fixed/closing fees, payment gateway fees, 18% GST on platform
          fees (India), 1% TCS (India), COD surcharges, shipping costs, and more.
          The output gives you net payout, profit, profit margin %, ROI, and
          break-even price — all instantly updated as you type.
        </p>
        <h2>Supported Platforms</h2>
        <p>
          Amazon India, Amazon USA, Flipkart, Meesho, eBay, Walmart, Shopee
          (Singapore), and Lazada (Southeast Asia). More platforms are added
          regularly.
        </p>
      </div>

      {/* Values */}
      <div className="grid gap-6 sm:grid-cols-2">
        {VALUES.map((value) => (
          <div
            key={value.title}
            className="rounded-xl border border-border/60 bg-card p-6"
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${value.color}15` }}
            >
              <value.icon className="h-5 w-5" style={{ color: value.color }} />
            </div>
            <h3 className="mb-2 text-base font-semibold">{value.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
