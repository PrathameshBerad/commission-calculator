'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-[#00E5A0]/20 bg-gradient-to-br from-[#00E5A0]/8 via-card to-[#3B82F6]/8 px-6 py-16 text-center sm:px-12"
        >
          {/* Background orb */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5A0]/10 blur-3xl" />

          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
            Stop Guessing.{' '}
            <span className="gradient-text">Start Knowing.</span>
          </h2>
          <p className="relative mt-4 text-base text-muted-foreground sm:text-lg max-w-xl mx-auto">
            Calculate your exact net payout, margin and ROI across any marketplace
            in seconds — completely free.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/calculator"
              className="group flex items-center gap-2 rounded-xl bg-[#00E5A0] px-8 py-3.5 text-sm font-semibold text-[#0A0B14] transition-all duration-200 hover:bg-[#00C896] hover:shadow-lg hover:shadow-[#00E5A0]/25 active:scale-95"
            >
              <Calculator className="h-4 w-4" />
              Open Calculator
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
