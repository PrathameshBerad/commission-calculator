'use client'

import { motion } from 'framer-motion'
import {
  Zap,
  Globe,
  BarChart3,
  Download,
  Shield,
  RefreshCw,
  IndianRupee,
  Calculator,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Calculations',
    description:
      'Results update instantly as you type — no submit button, no waiting. Every fee computed on every keystroke.',
    color: '#00E5A0',
  },
  {
    icon: Globe,
    title: '8 Global Platforms',
    description:
      'Amazon India & USA, Flipkart, Meesho, eBay, Walmart, Shopee, Lazada — all with accurate, up-to-date fee structures.',
    color: '#3B82F6',
  },
  {
    icon: IndianRupee,
    title: 'GST & TCS Aware',
    description:
      'Handles India-specific tax rules: 18% GST on platform fees, 1% TCS deduction, and net payout after all deductions.',
    color: '#F59E0B',
  },
  {
    icon: BarChart3,
    title: 'Visual Fee Breakdown',
    description:
      'Interactive donut chart shows exactly where your money goes — referral, payment, shipping, taxes and more.',
    color: '#8B5CF6',
  },
  {
    icon: Calculator,
    title: 'Break-Even Price',
    description:
      'Automatically calculates the minimum selling price needed to cover all costs and reach profitability.',
    color: '#EC4899',
  },
  {
    icon: Download,
    title: 'Export to CSV',
    description:
      'Download a full breakdown of your calculation as a CSV file — perfect for spreadsheets and record-keeping.',
    color: '#0EA5E9',
  },
  {
    icon: RefreshCw,
    title: 'Multi-Currency Support',
    description:
      'INR, USD, SGD and more. Currency auto-switches based on platform but can be manually overridden.',
    color: '#EF4444',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'All calculations happen in your browser. No data is sent to any server. No account needed. Ever.',
    color: '#14B8A6',
  },
]

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-[#00E5A0]"
          >
            Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Everything You Need to{' '}
            <span className="gradient-text">Price Smarter</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            No more guessing. No more spreadsheet errors. CommCalc handles every
            fee type so you don&apos;t have to.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--feat-color)]/30 hover:shadow-lg"
              style={{ '--feat-color': feature.color } as React.CSSProperties}
            >
              {/* Icon */}
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${feature.color}15`,
                  boxShadow: `0 0 0 1px ${feature.color}25`,
                }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: feature.color }}
                />
              </div>

              <h3 className="mb-2 text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${feature.color}08, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
