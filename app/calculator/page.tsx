'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { ResultsPanel } from '@/components/calculator/ResultsPanel'
import { BreakdownChart } from '@/components/calculator/BreakdownChart'
import { ExportButton } from '@/components/calculator/ExportButton'
import { useCalculatorStore } from '@/lib/store'
import { PLATFORMS } from '@/lib/platformFees'
import type { PlatformId } from '@/types'

function CalculatorPageContent() {
  const searchParams = useSearchParams()
  const { setInput, recalculate } = useCalculatorStore()

  useEffect(() => {
    // Read platform from query param
    const platformParam = searchParams.get('platform') as PlatformId | null
    if (platformParam && PLATFORMS[platformParam]) {
      const pl = PLATFORMS[platformParam]
      setInput({
        platform: platformParam,
        currency: pl.currency,
        category: pl.categories[0]?.name ?? '',
        includeGST: pl.hasGST,
        includeTCS: pl.hasTCS,
        isCOD: false,
      })
    }
    recalculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Commission{' '}
            <span className="gradient-text">Calculator</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Real-time profit & fee analysis across 8 marketplaces
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Left: Form */}
        <div className="space-y-6">
          <CalculatorForm />
          <BreakdownChart />
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          <ResultsPanel />
        </div>
      </div>

      {/* Info section */}
      <div className="mt-12 rounded-2xl border border-border/40 bg-card/40 p-6">
        <h2 className="mb-3 text-sm font-semibold">About These Calculations</h2>
        <div className="grid gap-4 text-xs text-muted-foreground leading-relaxed sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <strong className="text-foreground">GST (18%)</strong> — Indian
            platforms (Amazon.in, Flipkart, Meesho) charge 18% GST on their
            commission and fixed fees. This is separate from the GST you collect
            from buyers.
          </div>
          <div>
            <strong className="text-foreground">TCS (1%)</strong> — Tax Collected
            at Source is withheld by Indian marketplaces on your total sales.
            This is refundable against your GST liability.
          </div>
          <div>
            <strong className="text-foreground">Break-even Price</strong> — The
            minimum selling price needed to cover COGS + all fees with zero
            profit. Price above this for any margin.
          </div>
          <div>
            <strong className="text-foreground">Payment Fee</strong> — Charged by
            the payment gateway (Razorpay, Stripe, PayPal etc.). Calculated as a
            percentage of the total order value.
          </div>
          <div>
            <strong className="text-foreground">Net Payout</strong> — The actual
            amount you receive in your bank after all platform deductions. COGS is
            not deducted here.
          </div>
          <div>
            <strong className="text-foreground">Accuracy Note</strong> — Fee
            schedules are sourced from official platform documentation. Always
            verify with your seller center as rates may change.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00E5A0] border-t-transparent" />
        </div>
      }
    >
      <CalculatorPageContent />
    </Suspense>
  )
}
