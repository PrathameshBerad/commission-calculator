'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Zap, Shield, TrendingUp } from 'lucide-react'

const BADGES = ['Amazon', 'Flipkart', 'Meesho', 'eBay', 'Walmart', 'Shopee', 'Lazada']

const PREVIEW_METRICS = [
  { label: 'Net Payout', value: '₹1,267.50', positive: true },
  { label: 'Profit Margin', value: '36.9%', positive: true },
  { label: 'Total Fees', value: '₹232.50', positive: false },
  { label: 'ROI', value: '58.4%', positive: true },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-glow dark:block hidden absolute inset-0" />
        <div className="hero-glow-light dark:hidden block absolute inset-0" />
        <div className="absolute inset-0 bg-hero-grid dark:bg-hero-grid bg-hero-grid-light opacity-100" />
        {/* Orbs */}
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#00E5A0]/10 blur-3xl" />
        <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-[#3B82F6]/8 blur-3xl" />
        <div className="absolute top-40 -left-20 h-48 w-48 rounded-full bg-[#8B5CF6]/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/25 bg-[#00E5A0]/8 px-4 py-1.5 text-xs font-medium text-[#00E5A0]"
          >
            <Zap className="h-3 w-3" />
            Real-time · Free · No Sign-up Required
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Know Your{' '}
            <span className="gradient-text">True Profit</span>
            <br />
            Before You Sell
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base text-muted-foreground sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Instantly calculate net payout, profit margin, ROI & break-even price
            across Amazon, Flipkart, Meesho, eBay, Walmart and more — including
            GST, TCS & all hidden fees.
          </motion.p>

          {/* Platform tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/calculator"
              className="group flex items-center gap-2 rounded-xl bg-[#00E5A0] px-6 py-3.5 text-sm font-semibold text-[#0A0B14] transition-all duration-200 hover:bg-[#00C896] hover:shadow-lg hover:shadow-[#00E5A0]/25 active:scale-95"
            >
              <Calculator className="h-4 w-4" />
              Start Calculating Free
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:border-border active:scale-95"
            >
              View Documentation
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            {[
              { icon: Shield, text: 'No data stored' },
              { icon: Zap, text: 'Instant results' },
              { icon: TrendingUp, text: '8 platforms' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 text-[#00E5A0]" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Calculator preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 dark:shadow-black/40">
            {/* Top bar */}
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">
                OpSell AI Calculator — Amazon India · Apparel · ₹1,500
              </span>
            </div>

            {/* Preview content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PREVIEW_METRICS.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="rounded-xl border border-border/60 bg-background/60 p-4"
                  >
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p
                      className={`mt-1.5 font-mono text-lg font-bold tracking-tight ${
                        metric.positive ? 'text-[#00E5A0]' : 'text-[#FF3366]'
                      }`}
                    >
                      {metric.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Fee bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Fee Breakdown</span>
                  <span>₹1,500 total</span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-[#00E5A0]" style={{ width: '70%' }} title="Net Payout" />
                  <div className="h-full bg-[#6366F1]" style={{ width: '7%' }} title="Referral" />
                  <div className="h-full bg-[#3B82F6]" style={{ width: '4%' }} title="Payment" />
                  <div className="h-full bg-[#F59E0B]" style={{ width: '6%' }} title="GST" />
                  <div className="h-full bg-[#EF4444]" style={{ width: '3%' }} title="TCS" />
                  <div className="h-full bg-[#0EA5E9]" style={{ width: '10%' }} title="Shipping" />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {[
                    { label: 'Net Payout', color: '#00E5A0' },
                    { label: 'Referral Fee', color: '#6366F1' },
                    { label: 'Payment Fee', color: '#3B82F6' },
                    { label: 'GST', color: '#F59E0B' },
                    { label: 'Shipping', color: '#0EA5E9' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
