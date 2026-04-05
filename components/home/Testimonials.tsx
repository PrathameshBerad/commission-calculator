'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'CommCalc saved me from selling at a loss on Amazon. I had no idea GST on fees was eating 18% extra. Now I price right from the start.',
    name: 'Rahul Mehta',
    role: 'Amazon Seller, Pune',
    avatar: 'RM',
    rating: 5,
  },
  {
    quote:
      'The Meesho calculator is spot on. I can finally see how much I actually make after shipping deductions. Super helpful for my clothing business.',
    name: 'Priya Sharma',
    role: 'Meesho Seller, Jaipur',
    avatar: 'PS',
    rating: 5,
  },
  {
    quote:
      'I sell on both Flipkart and Amazon. Being able to compare margins side by side in seconds is a game changer for my pricing strategy.',
    name: 'Aditya Kulkarni',
    role: 'Multi-platform Seller, Mumbai',
    avatar: 'AK',
    rating: 5,
  },
]

export function Testimonials() {
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
            What Sellers Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Trusted by{' '}
            <span className="gradient-text">Smart Sellers</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-6"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E5A0]/15 text-xs font-bold text-[#00E5A0]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>

              {/* Decorative */}
              <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#00E5A0]/5 blur-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
