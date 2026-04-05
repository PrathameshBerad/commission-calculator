'use client'

import { motion } from 'framer-motion'
import { MousePointerClick, Settings2, BarChart3, Download } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: MousePointerClick,
    title: 'Select Your Platform',
    description:
      'Choose from Amazon India, Amazon USA, Flipkart, Meesho, eBay, Walmart, Shopee or Lazada.',
    color: '#00E5A0',
  },
  {
    step: '02',
    icon: Settings2,
    title: 'Enter Your Details',
    description:
      'Input selling price, product category, shipping cost, COGS and quantity. Toggle COD if needed.',
    color: '#3B82F6',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'See Instant Results',
    description:
      'Net payout, total fees, profit margin, ROI and break-even price — all updated as you type.',
    color: '#8B5CF6',
  },
  {
    step: '04',
    icon: Download,
    title: 'Export & Share',
    description:
      'Download your complete fee breakdown as a CSV file for records, comparisons, or further analysis.',
    color: '#F59E0B',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-card/20 py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-[#00E5A0]"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Four Steps to{' '}
            <span className="gradient-text">Clarity</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-8 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#00E5A0]/40 via-[#8B5CF6]/20 to-transparent lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div className="relative mb-5">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60"
                    style={{ backgroundColor: `${step.color}12` }}
                  >
                    <step.icon
                      className="h-7 w-7"
                      style={{ color: step.color }}
                    />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: step.color,
                      color: '#0A0B14',
                    }}
                  >
                    {i + 1}
                  </div>
                </div>

                <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
