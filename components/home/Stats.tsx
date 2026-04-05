'use client'

import { motion } from 'framer-motion'

const STATS = [
  { value: '8', label: 'Platforms', suffix: '+' },
  { value: '80', label: 'Categories', suffix: '+' },
  { value: '5', label: 'Currencies', suffix: '' },
  { value: '100', label: 'Accurate', suffix: '%' },
]

export function Stats() {
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="number-display text-3xl font-extrabold tracking-tight text-[#00E5A0] sm:text-4xl">
                {stat.value}
                <span className="text-2xl">{stat.suffix}</span>
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
