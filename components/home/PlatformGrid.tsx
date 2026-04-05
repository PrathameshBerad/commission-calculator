'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PLATFORM_LIST } from '@/lib/platformFees'

export function PlatformGrid() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-[#00E5A0]"
          >
            Supported Platforms
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            One Calculator.{' '}
            <span className="gradient-text">Every Marketplace.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            Accurate fee data from official seller centers — updated regularly.
          </motion.p>
        </div>

        {/* Platform cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PLATFORM_LIST.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/calculator?platform=${platform.id}`}
                className="group platform-card flex flex-col gap-3 h-full"
              >
                {/* Logo area */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl flex-shrink-0"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    {platform.flag}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{platform.shortName}</p>
                    <p className="text-xs text-muted-foreground">{platform.currency}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-1">
                  {platform.description}
                </p>

                {/* Categories count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {platform.categories.length} categories
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#00E5A0]"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {platform.hasGST && (
                    <span className="rounded-full bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-medium text-[#F59E0B]">
                      GST
                    </span>
                  )}
                  {platform.hasTCS && (
                    <span className="rounded-full bg-[#EF4444]/10 px-2 py-0.5 text-[10px] font-medium text-[#EF4444]">
                      TCS
                    </span>
                  )}
                  {platform.hasCOD && (
                    <span className="rounded-full bg-[#3B82F6]/10 px-2 py-0.5 text-[10px] font-medium text-[#3B82F6]">
                      COD
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
