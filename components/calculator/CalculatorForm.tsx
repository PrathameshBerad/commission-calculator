'use client'

import { useEffect } from 'react'
import { useCalculatorStore } from '@/lib/store'
import { PLATFORMS, getCategoriesForPlatform } from '@/lib/platformFees'
import { PlatformSelector } from './PlatformSelector'
import type { PlatformId } from '@/types'
import { Info, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOOLTIP_MAP: Record<string, string> = {
  sellingPrice: 'The price at which you list and sell the product (MRP/Selling Price).',
  category: 'Commission rates differ by category — pick the most accurate one for your product.',
  shippingCost:
    'Cost you pay for shipping. For marketplace-fulfilled orders (FBA/WFS), enter the fulfillment fee.',
  cogs: 'Your total cost to produce/source one unit of the product.',
  quantity: 'Number of units to calculate for (scales total fees and profit).',
  isCOD: 'Cash on Delivery adds extra charges (typically 2% of sale value in India).',
  includeGST: 'GST @18% is charged by Indian marketplaces on their commission and fixed fees.',
  includeTCS: 'TCS @1% is withheld by Indian marketplaces on your total sales. Recoverable via GST return.',
}

function FieldTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex">
      <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 hover:text-muted-foreground" />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs text-muted-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </div>
    </div>
  )
}

function InputField({
  label,
  tooltipKey,
  prefix,
  children,
}: {
  label: string
  tooltipKey?: string
  prefix?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {label}
        {tooltipKey && TOOLTIP_MAP[tooltipKey] && (
          <FieldTooltip text={TOOLTIP_MAP[tooltipKey]} />
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-muted-foreground">
            {prefix}
          </span>
        )}
        <div className={cn(prefix && 'pl-7')}>{children}</div>
      </div>
    </div>
  )
}

const inputClass = cn(
  'w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm font-mono',
  'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00E5A0]/40 focus:border-[#00E5A0]/60',
  'placeholder:text-muted-foreground/50'
)

const selectClass = cn(
  'w-full appearance-none rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm',
  'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00E5A0]/40 focus:border-[#00E5A0]/60',
  'cursor-pointer'
)

export function CalculatorForm() {
  const { input, setInput, resetInput } = useCalculatorStore()

  const platform = PLATFORMS[input.platform]
  const categories = getCategoriesForPlatform(input.platform)

  // When platform changes, auto-set currency and reset category
  useEffect(() => {
    const pl = PLATFORMS[input.platform]
    if (pl) {
      setInput({
        currency: pl.currency,
        category: pl.categories[0]?.name ?? '',
        isCOD: false,
        includeGST: pl.hasGST,
        includeTCS: pl.hasTCS,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.platform])

  const handleNumberInput = (key: keyof typeof input, value: string) => {
    const num = parseFloat(value)
    setInput({ [key]: isNaN(num) ? 0 : Math.max(0, num) })
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Commission Calculator</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Results update in real-time
          </p>
        </div>
        <button
          onClick={resetInput}
          className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Platform Selector */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Select Platform
        </p>
        <PlatformSelector
          value={input.platform}
          onChange={(id: PlatformId) => setInput({ platform: id })}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border/40" />

      {/* Inputs Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Selling Price */}
        <InputField
          label="Selling Price"
          tooltipKey="sellingPrice"
          prefix={platform?.currency ?? ''}
        >
          <input
            type="number"
            min="0"
            step="any"
            value={input.sellingPrice || ''}
            onChange={(e) => handleNumberInput('sellingPrice', e.target.value)}
            placeholder="1500"
            className={cn(inputClass, 'pl-9')}
          />
        </InputField>

        {/* Category */}
        <InputField label="Product Category" tooltipKey="category">
          <select
            value={input.category}
            onChange={(e) => setInput({ category: e.target.value })}
            className={selectClass}
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </InputField>

        {/* COGS */}
        <InputField
          label="Cost of Goods (per unit)"
          tooltipKey="cogs"
          prefix={platform?.currency ?? ''}
        >
          <input
            type="number"
            min="0"
            step="any"
            value={input.cogs || ''}
            onChange={(e) => handleNumberInput('cogs', e.target.value)}
            placeholder="800"
            className={cn(inputClass, 'pl-9')}
          />
        </InputField>

        {/* Quantity */}
        <InputField label="Quantity" tooltipKey="quantity">
          <input
            type="number"
            min="1"
            step="1"
            value={input.quantity || ''}
            onChange={(e) =>
              setInput({ quantity: Math.max(1, parseInt(e.target.value) || 1) })
            }
            placeholder="1"
            className={inputClass}
          />
        </InputField>

        {/* Shipping Cost */}
        <InputField
          label="Shipping Cost (per unit)"
          tooltipKey="shippingCost"
          prefix={platform?.currency ?? ''}
        >
          <input
            type="number"
            min="0"
            step="any"
            value={input.shippingCost || ''}
            onChange={(e) => handleNumberInput('shippingCost', e.target.value)}
            placeholder="50"
            className={cn(inputClass, 'pl-9')}
          />
        </InputField>

        {/* Currency override */}
        <InputField label="Currency">
          <select
            value={input.currency}
            onChange={(e) =>
              setInput({ currency: e.target.value as typeof input.currency })
            }
            className={selectClass}
          >
            <option value="INR">INR — Indian Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="SGD">SGD — Singapore Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
          </select>
        </InputField>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Options
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {/* COD Toggle */}
          {platform?.hasCOD && (
            <ToggleOption
              label="COD Order"
              tooltip={TOOLTIP_MAP.isCOD}
              checked={input.isCOD}
              onChange={(v) => setInput({ isCOD: v })}
              color="#3B82F6"
            />
          )}

          {/* GST Toggle */}
          {platform?.hasGST && (
            <ToggleOption
              label="Include GST (18%)"
              tooltip={TOOLTIP_MAP.includeGST}
              checked={input.includeGST}
              onChange={(v) => setInput({ includeGST: v })}
              color="#F59E0B"
            />
          )}

          {/* TCS Toggle */}
          {platform?.hasTCS && (
            <ToggleOption
              label="Include TCS (1%)"
              tooltip={TOOLTIP_MAP.includeTCS}
              checked={input.includeTCS}
              onChange={(v) => setInput({ includeTCS: v })}
              color="#EF4444"
            />
          )}
        </div>
      </div>

      {/* Commission Rate info */}
      {input.category && (
        <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Commission rate for &ldquo;{input.category}&rdquo;
            </span>
            <span className="font-mono font-semibold text-[#00E5A0]">
              {(
                (categories.find((c) => c.name === input.category)
                  ?.commissionRate ?? 0) * 100
              ).toFixed(1)}
              %
            </span>
          </div>
          {categories.find((c) => c.name === input.category)?.fixedFee ? (
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Fixed fee per order</span>
              <span className="font-mono font-semibold text-[#3B82F6]">
                {platform?.currency}{' '}
                {categories.find((c) => c.name === input.category)?.fixedFee}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function ToggleOption({
  label,
  tooltip,
  checked,
  onChange,
  color,
}: {
  label: string
  tooltip: string
  checked: boolean
  onChange: (v: boolean) => void
  color: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-xs transition-all duration-150',
        checked
          ? 'bg-opacity-10 text-foreground'
          : 'border-border/60 bg-background text-muted-foreground hover:bg-accent'
      )}
      style={
        checked
          ? { borderColor: `${color}40`, backgroundColor: `${color}10` }
          : undefined
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{label}</span>
        <FieldTooltip text={tooltip} />
      </div>
      {/* Toggle pill */}
      <div
        className={cn(
          'relative flex h-4 w-7 items-center rounded-full transition-all duration-200',
          checked ? 'justify-end' : 'justify-start bg-border/60'
        )}
        style={checked ? { backgroundColor: color } : undefined}
      >
        <div className="mx-0.5 h-3 w-3 rounded-full bg-white shadow-sm" />
      </div>
    </button>
  )
}
