'use client'

import { useEffect, useState } from 'react'
import { useCalculatorStore } from '@/lib/store'
import { formatCurrency } from '@/lib/calculations'
import { PLATFORMS } from '@/lib/platformFees'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function MetricCard({
  label,
  value,
  subValue,
  positive,
  neutral,
  icon: Icon,
  highlight,
}: {
  label: string
  value: string
  subValue?: string
  positive?: boolean
  neutral?: boolean
  icon?: React.ElementType
  highlight?: boolean
}) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const t = setTimeout(() => setAnimate(false), 200)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 transition-all duration-200',
        highlight
          ? 'border-[#00E5A0]/30 bg-[#00E5A0]/5'
          : 'border-border/60 bg-card',
        neutral && 'border-border/60 bg-card'
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <Icon
            className={cn(
              'h-3.5 w-3.5 flex-shrink-0',
              highlight ? 'text-[#00E5A0]' : 'text-muted-foreground/40'
            )}
          />
        )}
      </div>
      <p
        className={cn(
          'mt-2 font-mono text-xl font-bold tracking-tight transition-all duration-150',
          animate && 'result-updated',
          positive === true && !highlight && 'text-[#00E5A0]',
          positive === false && 'text-[#FF3366]',
          highlight && 'text-[#00E5A0]',
          neutral && 'text-foreground'
        )}
      >
        {value}
      </p>
      {subValue && (
        <p className="mt-1 text-xs text-muted-foreground">{subValue}</p>
      )}
    </div>
  )
}

export function ResultsPanel() {
  const { output, input } = useCalculatorStore()
  const platform = PLATFORMS[input.platform]

  if (!output) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card text-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Enter a selling price to see results
          </p>
        </div>
      </div>
    )
  }

  const fmt = (v: number) => formatCurrency(v, output.currency)
  const isLoss = !output.isProfit

  return (
    <div className="space-y-4">
      {/* Loss warning */}
      {isLoss && (
        <div className="flex items-start gap-3 rounded-xl border border-[#FF3366]/25 bg-[#FF3366]/8 px-4 py-3">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-[#FF3366] mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#FF3366]">Selling at a Loss</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your break-even price is{' '}
              <span className="font-mono font-semibold">
                {fmt(output.breakEvenPrice)}
              </span>
              . Raise your price or reduce costs.
            </p>
          </div>
        </div>
      )}

      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Net Payout"
          value={fmt(output.netPayout)}
          subValue={`After all fees for ${input.quantity} unit${input.quantity > 1 ? 's' : ''}`}
          highlight
          icon={Wallet}
        />
        <MetricCard
          label="Total Profit"
          value={fmt(output.profit)}
          subValue={`Gross − COGS − Fees`}
          positive={output.isProfit}
          icon={output.isProfit ? TrendingUp : TrendingDown}
        />
        <MetricCard
          label="Profit Margin"
          value={`${output.profitMargin.toFixed(1)}%`}
          subValue="Profit ÷ Revenue"
          positive={output.profitMargin > 0}
          icon={Percent}
        />
        <MetricCard
          label="ROI"
          value={`${output.roi.toFixed(1)}%`}
          subValue="Profit ÷ COGS"
          positive={output.roi > 0}
          icon={TrendingUp}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard
          label="Gross Revenue"
          value={fmt(output.grossRevenue)}
          neutral
        />
        <MetricCard
          label="Total (Platform) Fees"
          value={fmt(output.totalFees)}
          positive={false}
        />
        {output.outputGstAmount > 0 && (
           <MetricCard
             label="Net Tax Payable"
             value={fmt(output.netGstPayable)}
             subValue="Govt GST (after ITC claim)"
             positive={false}
           />
        )}
        <MetricCard
          label="Break-Even Price"
          value={fmt(output.breakEvenPrice)}
          icon={Target}
          neutral
        />
      </div>

      {/* Fee breakdown table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="border-b border-border/40 px-4 py-3">
          <h3 className="text-sm font-semibold">Fee Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Effective rate:{' '}
            <span className="font-mono font-semibold text-foreground">
              {output.effectiveCommissionRate.toFixed(1)}%
            </span>{' '}
            of selling price
          </p>
        </div>
        <div className="divide-y divide-border/40">
          {/* Platform info row */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-base">{platform?.flag}</span>
              <span className="text-xs font-medium">{platform?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{output.currency}</span>
          </div>

          {/* Fee rows */}
          {output.feeBreakdown.map((fee) => (
            <div
              key={fee.name}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: fee.color }}
                />
                <span className="text-xs text-muted-foreground">{fee.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground/60">
                  {fee.percentage?.toFixed(1)}%
                </span>
                <span className="font-mono text-xs font-semibold text-[#FF3366]">
                  −{fmt(fee.amount)}
                </span>
              </div>
            </div>
          ))}

          {/* Total fees row */}
          <div className="flex items-center justify-between bg-[#FF3366]/5 px-4 py-3">
            <span className="text-xs font-semibold">Total Fees</span>
            <span className="font-mono text-sm font-bold text-[#FF3366]">
              −{fmt(output.totalFees)}
            </span>
          </div>

          {/* Net payout row */}
          <div className="flex items-center justify-between bg-[#00E5A0]/5 px-4 py-3">
            <span className="text-xs font-semibold text-[#00E5A0]">Net Payout</span>
            <span className="font-mono text-sm font-bold text-[#00E5A0]">
              {fmt(output.netPayout)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
