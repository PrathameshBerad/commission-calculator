'use client'

import { useEffect } from 'react'
import { useCalculatorStore } from '@/lib/store'
import { PLATFORMS, getCategoriesForPlatform } from '@/lib/platformFees'
import { getSuggestedGstRate } from '@/lib/gstLogic'
import { PlatformSelector } from './PlatformSelector'
import { type PlatformId, CURRENCY_SYMBOLS } from '@/types'
import { calculateDynamicShipping } from '@/lib/shippingLogic'
import { Info, RotateCcw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOOLTIP_MAP: Record<string, string> = {
  sellingPrice: 'The price at which you list and sell the product (MRP/Selling Price).',
  category: 'Commission rates differ by category — pick the most accurate one for your product.',
  shippingCost:
    'Cost you pay for shipping. For marketplace-fulfilled orders (FBA/WFS), enter the fulfillment fee.',
  cogs: 'Your total cost to produce/source one unit of the product.',
  quantity: 'Number of units to calculate for (scales total fees and profit).',
  isCOD: 'Cash on Delivery adds extra charges (typically 2% of sale value in India).',
  includeGST: 'Input Tax Credit (ITC): GST @18% charged by Indian marketplaces on their fees.',
  includeTCS: 'TCS @1% is withheld by Indian marketplaces on your total sales. Recoverable via GST return.',
  productGst: 'Output GST: The GST applicable on the actual product sold. Auto-calculated based on category and price.',
  gstInclusive: 'Is the Selling Price already inclusive of this Product GST?',
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

  // Auto-calculate suggested GST rate
  useEffect(() => {
    if (input.calculateProductGst && ['amazon-in', 'flipkart', 'meesho'].includes(input.platform)) {
      const suggestedRate = getSuggestedGstRate(input.category, input.sellingPrice, input.platform);
      if (input.productGstRate !== suggestedRate) {
        setInput({ productGstRate: suggestedRate })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.category, input.sellingPrice, input.platform, input.calculateProductGst])

  const handleNumberInput = (key: keyof typeof input, value: string) => {
    const num = parseFloat(value)
    setInput({ [key]: isNaN(num) ? 0 : Math.max(0, num) })
  }

  // Derive dynamic shipping metrics for UI sync
  const dynamicShipping = calculateDynamicShipping(
    input.platform,
    input.weightInGrams || 500,
    input.shippingZone || 'national',
    input.fulfillmentMode
  )

  const displayPickAndPack = input.useCustomShippingOverride ? input.pickAndPackFee : dynamicShipping.pickAndPackFee
  const displayPlatformShipping = input.useCustomShippingOverride ? input.platformShippingFee : dynamicShipping.shippingFee
  const displaySelfShipping = input.useCustomShippingOverride ? input.shippingCost : dynamicShipping.shippingFee

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-4 sm:p-6 shadow-sm flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">OpSell AI Calculator</h2>
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
        
        {/* Educational 2026 Timeline Alert */}
        {['amazon-in', 'flipkart'].includes(input.platform) && (
          <div
            className={cn(
              'mt-3 flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors',
              input.sellingPrice && input.sellingPrice <= 1000
                ? 'border-[#00E5A0]/30 bg-[#00E5A0]/5'
                : 'border-border/40 bg-muted/10'
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {input.sellingPrice && input.sellingPrice <= 1000 ? (
                <CheckCircle2 className="h-4 w-4 text-[#00E5A0]" />
              ) : (
                <Info className="h-4 w-4 text-blue-400" />
              )}
            </div>
            <div>
              <p
                className={cn(
                  'text-sm font-semibold transition-colors',
                  input.sellingPrice && input.sellingPrice <= 1000 ? 'text-[#00E5A0]' : 'text-foreground'
                )}
              >
                {input.sellingPrice && input.sellingPrice <= 1000
                  ? '0% Commission Active'
                  : '2026 E-commerce Tracker'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                To fight Meesho, this platform dropped referral fees to 0% for items under ₹1,000 in early 2026.
                {!(input.sellingPrice && input.sellingPrice <= 1000) && ' Lower your selling price below ₹1,000 to qualify.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border/40" />

      {/* Inputs Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Selling Price */}
        <InputField
          label="Selling Price"
          tooltipKey="sellingPrice"
          prefix={CURRENCY_SYMBOLS[input.currency] ?? platform?.currency ?? ''}
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
          prefix={CURRENCY_SYMBOLS[input.currency] ?? platform?.currency ?? ''}
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

        {/* Fulfillment Mode Toggle */}
        <div className="col-span-full pt-2">
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 px-4 py-3">
            <div className="space-y-1">
              <span className="text-sm font-medium">Use Platform Fulfillment?</span>
              <p className="text-xs text-muted-foreground mr-4">
                Enable this if using FBA or Flipkart Assured. Turns shipping into a platform fee to claim 18% ITC.
              </p>
            </div>
            <ToggleOption
              label={input.fulfillmentMode === 'platform' ? 'FBA/FBF' : 'Self-Ship'}
              tooltip="Switches from standard shipping costs to platform-billed Pick & Pack + Weight Handling fees."
              checked={input.fulfillmentMode === 'platform'}
              onChange={(v) => setInput({ fulfillmentMode: v ? 'platform' : 'seller' })}
              color="#3B82F6"
            />
          </div>
        </div>

        {/* Logistics Profile */}
        <div className="col-span-full mt-2 pt-4 pb-2 border-t border-border/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Logistics & Weight Config</h3>
            <ToggleOption
              label="Manual Override"
              tooltip="Unlock shipping fields to manually enter custom costs instead of physics-based tiers."
              checked={input.useCustomShippingOverride}
              onChange={(v) => setInput({ useCustomShippingOverride: v })}
              color="#F59E0B"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <InputField label="Product Weight (grams)" tooltipKey="quantity">
              <input
                type="number"
                min="0"
                step="1"
                value={input.weightInGrams || ''}
                onChange={(e) => handleNumberInput('weightInGrams', e.target.value)}
                placeholder="500"
                className={cn(inputClass, 'pl-3')}
              />
            </InputField>

            <InputField label="Shipping Zone" tooltipKey="quantity">
              <select
                value={input.shippingZone}
                onChange={(e) => setInput({ shippingZone: e.target.value as any })}
                className={selectClass}
              >
                <option value="local">Local (Intra-city)</option>
                <option value="regional">Regional (Intra-zone)</option>
                <option value="national">National (Inter-zone)</option>
              </select>
            </InputField>
          </div>
        </div>

        {/* Shipping / Fulfillment Costs */}
        <div className="col-span-full grid gap-4 sm:grid-cols-2">
        {input.fulfillmentMode === 'platform' ? (
          <>
            <InputField
              label="Pick & Pack Fee"
              tooltipKey="pickAndPackFee"
              prefix={CURRENCY_SYMBOLS[input.currency] ?? platform?.currency ?? ''}
            >
              <input
                type="number"
                min="0"
                step="any"
                disabled={!input.useCustomShippingOverride}
                value={displayPickAndPack || 0}
                onChange={(e) => handleNumberInput('pickAndPackFee', e.target.value)}
                placeholder="0"
                className={cn(inputClass, 'pl-9 border-[#EC4899]/30 focus:border-[#EC4899] bg-[#EC4899]/5 disabled:opacity-60')}
              />
            </InputField>
            <InputField
              label="FBA / FBF Shipping"
              tooltipKey="platformShipping"
              prefix={CURRENCY_SYMBOLS[input.currency] ?? platform?.currency ?? ''}
            >
              <input
                type="number"
                min="0"
                step="any"
                disabled={!input.useCustomShippingOverride}
                value={displayPlatformShipping || 0}
                onChange={(e) => handleNumberInput('platformShippingFee', e.target.value)}
                placeholder="0"
                className={cn(inputClass, 'pl-9 border-[#0EA5E9]/30 focus:border-[#0EA5E9] bg-[#0EA5E9]/5 disabled:opacity-60')}
              />
            </InputField>
          </>
        ) : (
          <InputField
            label="Shipping Cost (Self-Ship)"
            tooltipKey="shippingCost"
            prefix={CURRENCY_SYMBOLS[input.currency] ?? platform?.currency ?? ''}
          >
            <input
              type="number"
              min="0"
              step="any"
              disabled={!input.useCustomShippingOverride}
              value={displaySelfShipping || 0}
              onChange={(e) => handleNumberInput('shippingCost', e.target.value)}
              placeholder="0"
              className={cn(inputClass, 'pl-9 disabled:opacity-60 disabled:bg-muted/30')}
            />
          </InputField>
        )}
        </div>

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

      {/* Taxes & Compliance (New Section) */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Taxes & Compliance
        </p>

        {['amazon-in', 'flipkart', 'meesho'].includes(input.platform) && (
          <div className="space-y-4 rounded-xl border border-border/40 p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Calculate Product GST (Output GST)</span>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Tax required on the product sold.
                </p>
              </div>
              <ToggleOption
                label={input.calculateProductGst ? 'Enabled' : 'Disabled'}
                tooltip={TOOLTIP_MAP.productGst}
                checked={input.calculateProductGst}
                onChange={(v) => setInput({ calculateProductGst: v })}
                color="#10B981"
              />
            </div>

            {input.calculateProductGst && (
              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/30">
                <InputField label="Product GST Rate" tooltipKey="productGst">
                  <select
                    value={input.productGstRate}
                    onChange={(e) => setInput({ productGstRate: parseFloat(e.target.value) })}
                    className={selectClass}
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={0.03}>3% (Jewelry)</option>
                    <option value={0.05}>5%</option>
                    <option value={0.12}>12%</option>
                    <option value={0.18}>18% (Standard)</option>
                    <option value={0.28}>28%</option>
                  </select>
                </InputField>

                <InputField label="Price includes GST?" tooltipKey="gstInclusive">
                  <select
                    value={input.isGstInclusive ? 'yes' : 'no'}
                    onChange={(e) => setInput({ isGstInclusive: e.target.value === 'yes' })}
                    className={selectClass}
                  >
                    <option value="yes">Yes (Inclusive)</option>
                    <option value="no">No (Exclusive)</option>
                  </select>
                </InputField>
                <div className="sm:col-span-2 text-xs text-muted-foreground/80 mt-[-4px]">
                  <em>Rate auto-updates based on {platform?.shortName} category {input.category} & price.</em>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-3 mt-4">
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
              label="Fee GST (ITC)"
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
