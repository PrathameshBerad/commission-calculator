import type {
  CalculatorInput,
  CalculatorOutput,
  FeeBreakdownItem,
  PlatformId,
} from '@/types'
import { PLATFORMS } from './platformFees'

/**
 * Calculate referral fee using tiered or flat rate
 */
function calculateReferralFee(
  price: number,
  categoryConfig: { commissionRate: number; minFee?: number; fixedFee?: number; tiers?: Array<{ max: number; rate: number }> }
): number {
  let fee = 0

  if (categoryConfig.tiers && categoryConfig.tiers.length > 0) {
    // Tiered calculation (e.g. Amazon US Apparel)
    let remaining = price
    let prevMax = 0

    for (const tier of categoryConfig.tiers) {
      if (remaining <= 0) break
      const tierAmount = Math.min(remaining, tier.max - prevMax)
      if (tierAmount > 0) {
        fee += tierAmount * tier.rate
        remaining -= tierAmount
      }
      prevMax = tier.max
    }
  } else {
    // Flat rate
    fee = price * categoryConfig.commissionRate
  }

  // Apply minimum fee
  if (categoryConfig.minFee && fee < categoryConfig.minFee) {
    fee = categoryConfig.minFee
  }

  return fee
}

/**
 * Format currency value to 2 decimal places
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Main calculation function
 */
export function calculate(input: CalculatorInput): CalculatorOutput {
  const platform = PLATFORMS[input.platform]
  if (!platform) throw new Error(`Unknown platform: ${input.platform}`)

  const P = input.sellingPrice
  // If platform fulfillment, override S with the platform's native shipping fee
  const S = input.fulfillmentMode === 'platform' ? input.platformShippingFee : input.shippingCost
  const COGS = input.cogs
  const Q = input.quantity
  const { isCOD, includeGST, includeTCS, productGstRate, calculateProductGst, isGstInclusive, customCommissionRate, customFixedFee } = input

  // Determine FBA pick and pack if toggled
  const pickAndPackFee = input.fulfillmentMode === 'platform' ? input.pickAndPackFee : 0

  // Find category config
  const categoryConfig = platform.categories.find(
    (c) => c.name === input.category
  ) ?? platform.categories[0]

  let derivedCommissionRate = categoryConfig.commissionRate
  let derivedMinFee = categoryConfig.minFee ?? 0
  
  // 2026 E-commerce update: Amazon India and Flipkart 0% commission under 1000
  if (['amazon-in', 'flipkart'].includes(input.platform) && P <= 1000) {
    derivedCommissionRate = 0
    derivedMinFee = 0
  }

  // Override with custom rates if provided
  const effectiveCategoryConfig = {
    ...categoryConfig,
    commissionRate: customCommissionRate ?? derivedCommissionRate,
    fixedFee: customFixedFee ?? (categoryConfig.fixedFee ?? 0),
    minFee: derivedMinFee,
  }

  // 1. Referral Fee
  const referralFee = round2(calculateReferralFee(P, effectiveCategoryConfig))

  // 2. Fixed Fee
  const fixedFee = round2(effectiveCategoryConfig.fixedFee ?? 0)

  // 3. COD Fee (if applicable)
  const codFee = isCOD && platform.hasCOD
    ? round2(P * platform.codRate)
    : 0

  // 4. GST on platform fees (India platforms)
  // For FBA, pick & pack and Amazon-billed shipping also attract the 18% platform GST block!
  let taxablePlatformFees = referralFee + fixedFee + codFee
  if (input.fulfillmentMode === 'platform') {
    taxablePlatformFees += pickAndPackFee + S
  }
  const gstOnFees = includeGST && platform.hasGST
    ? round2(taxablePlatformFees * platform.gstRate)
    : 0

  // 5. TCS (India: 1% withheld on total sale value)
  const tcs = includeTCS && platform.hasTCS
    ? round2(P * platform.tcsRate)
    : 0

  // 6. Payment Gateway Fee
  const paymentFeeAmount = round2(
    (P + S) * platform.paymentRate + platform.paymentFixed
  )

  // 7. Shipping cost (seller-borne)
  const shippingFee = round2(S)

  // 8. Total Fees per unit
  const totalFeesPerUnit = round2(
    referralFee +
    fixedFee +
    pickAndPackFee +
    codFee +
    gstOnFees +
    tcs +
    paymentFeeAmount +
    shippingFee
  )

  // 9. Gross Revenue (for Q units)
  const grossRevenue = round2(P * Q)

  // 10. Total Fees (for Q units)
  const totalFees = round2(totalFeesPerUnit * Q)

  // 11. Net Payout
  const netPayout = round2(grossRevenue - totalFees)

  // 12. Output GST (Product GST)
  let outputGstAmount = 0
  if (calculateProductGst && productGstRate > 0 && ['amazon-in', 'flipkart', 'meesho'].includes(input.platform)) {
    if (isGstInclusive) {
      // P = Base + Base*Rate => Base = P / (1+Rate)
      // GST = P - Base = P - P / (1+Rate) = P * Rate / (1+Rate)
      const gstPerUnit = P - (P / (1 + productGstRate))
      outputGstAmount = round2(gstPerUnit * Q)
    } else {
      const gstPerUnit = P * productGstRate
      outputGstAmount = round2(gstPerUnit * Q)
    }
  }

  // 13. Net GST Payable to Government = Output GST - Input Tax Credit (GST on fees)
  // If ITC is more than Output GST, it's a credit, not payable (kept at 0 minimum for profit calculation)
  // Actually, usually ITC offsets Output GST. If it's negative, it's a credit. We subtract netGstPayable from profit.
  const netGstPayable = round2(outputGstAmount - (gstOnFees * Q))

  // 14. COGS total
  const cogsTotal = round2(COGS * Q)

  // 15. Profit
  const profit = round2(netPayout - cogsTotal - netGstPayable)

  // 14. Profit Margin (profit / gross revenue * 100)
  const profitMargin =
    grossRevenue > 0 ? round2((profit / grossRevenue) * 100) : 0

  // 15. ROI
  const roi =
    cogsTotal > 0 ? round2((profit / cogsTotal) * 100) : 0

  // 16. Break-even Price
  const effectiveCommRate =
    derivedCommissionRate +
    (isCOD && platform.hasCOD ? platform.codRate : 0) +
    (includeTCS && platform.hasTCS ? platform.tcsRate : 0)

  // Payment fees are charged on Gross + Shipping
  const varPaymentRate = platform.paymentRate

  let breakEvenPrice = 0

  if (calculateProductGst && productGstRate > 0 && ['amazon-in', 'flipkart', 'meesho'].includes(input.platform)) {
    // Registered seller: ITC offsets fee GST, so fee GST is not a pure cost. Output GST is a pure cost.
    const outputGstVarRate = isGstInclusive
      ? productGstRate / (1 + productGstRate) // effective rate of inclusive GST
      : productGstRate // exclusive GST rate directly multiplying P

    const totalVarRate = effectiveCommRate + varPaymentRate + outputGstVarRate
    const totalFixedCosts = COGS + fixedFee + pickAndPackFee + S + (S * varPaymentRate) + platform.paymentFixed

    breakEvenPrice = totalVarRate < 1 
      ? round2(totalFixedCosts / (1 - totalVarRate))
      : 0
  } else {
    // Unregistered seller: GST on fees is an unrecoverable pure cost. No Output GST logic.
    const gstMultiplier = includeGST && platform.hasGST ? 1 + platform.gstRate : 1
    
    // For platform mode, Pick & Pack and S are multiplied by GST as well
    const fixedPlatformService = input.fulfillmentMode === 'platform' ? fixedFee + pickAndPackFee + S : fixedFee
    const shippingBase = input.fulfillmentMode === 'platform' ? 0 : S // shipping is already in fixedPlatformService

    const totalVarRate = (effectiveCommRate * gstMultiplier) + varPaymentRate
    const totalFixedCosts = COGS + (fixedPlatformService * gstMultiplier) + shippingBase + (S * varPaymentRate) + platform.paymentFixed

    breakEvenPrice = totalVarRate < 1
      ? round2(totalFixedCosts / (1 - totalVarRate))
      : 0
  }

  // 18. Effective commission rate
  const effectiveCommissionRate =
    P > 0 ? round2((totalFeesPerUnit / P) * 100) : 0

  // 19. Fee breakdown for chart
  const feeBreakdown: FeeBreakdownItem[] = [
    {
      name: 'Referral Fee',
      amount: round2(referralFee * Q),
      color: '#6366F1',
      tooltip: `${(effectiveCategoryConfig.commissionRate * 100).toFixed(1)}% of selling price`,
    },
    {
      name: 'Fixed Fee',
      amount: round2(fixedFee * Q),
      color: '#8B5CF6',
      tooltip: 'Flat fee per order',
    })
  }

  if (pickAndPackFee > 0) {
    feeBreakdown.push({
      name: 'Pick & Pack Fee',
      amount: round2(pickAndPackFee * Q),
      color: '#EC4899', // pinkish
      tooltip: 'Fulfillment processing fee billed by the platform',
    })
  }

  if (paymentFeeAmount > 0) {
    feeBreakdown.push({
      name: 'Payment Fee',
      amount: round2(paymentFeeAmount * Q),
      color: '#3B82F6',
      tooltip: `${(platform.paymentRate * 100).toFixed(2)}% + fixed charge`,
    },
    {
      name: 'Shipping',
      amount: round2(shippingFee * Q),
      color: '#0EA5E9',
      tooltip: 'Shipping/logistics cost',
    },
  ]

  if (gstOnFees > 0) {
    feeBreakdown.push({
      name: '18% GST on Platform Fees',
      amount: round2(gstOnFees * Q),
      color: '#F59E0B',
      tooltip: '18% tax charged by the platform on their referral and fixed fees. This offsets your final tax liability.',
    })
  }

  if (tcs > 0) {
    feeBreakdown.push({
      name: 'TCS (1%)',
      amount: round2(tcs * Q),
      color: '#EF4444',
      tooltip: 'Tax Collected at Source — recoverable via GST return',
    })
  }

  if (codFee > 0) {
    feeBreakdown.push({
      name: 'COD Charge',
      amount: round2(codFee * Q),
      color: '#EC4899',
      tooltip: `${(platform.codRate * 100).toFixed(1)}% for Cash on Delivery`,
    })
  }

  // Filter out zero amounts and add percentages
  const filteredBreakdown = feeBreakdown
    .filter((item) => item.amount > 0)
    .map((item) => ({
      ...item,
      percentage: totalFees > 0 ? round2((item.amount / totalFees) * 100) : 0,
    }))

  return {
    platform: input.platform as PlatformId,
    grossRevenue,
    referralFee: round2(referralFee * Q),
    fixedFee: round2(fixedFee * Q),
    shippingFee: round2(shippingFee * Q),
    paymentFeeAmount: round2(paymentFeeAmount * Q),
    gstOnFees: round2(gstOnFees * Q),
    tcs: round2(tcs * Q),
    codFee: round2(codFee * Q),
    totalFees,
    netPayout,
    outputGstAmount,
    netGstPayable,
    profit,
    profitMargin,
    roi,
    breakEvenPrice,
    currency: platform.currency,
    feeBreakdown: filteredBreakdown,
    effectiveCommissionRate,
    isProfit: profit > 0,
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string,
  compact = false
): string {
  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    SGD: 'en-SG',
    EUR: 'de-DE',
    GBP: 'en-GB',
  }

  try {
    return new Intl.NumberFormat(localeMap[currency] ?? 'en-US', {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
      minimumFractionDigits: compact ? 0 : 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Generate CSV export data
 */
export function generateCSVData(
  input: CalculatorInput,
  output: CalculatorOutput
): string {
  const platform = PLATFORMS[input.platform]
  const currency = output.currency

  const rows = [
    ['Commission Calculator Export', ''],
    ['Platform', platform?.name ?? input.platform],
    ['Category', input.category],
    ['Date', new Date().toLocaleDateString()],
    ['', ''],
    ['INPUTS', ''],
    ['Selling Price', `${currency} ${input.sellingPrice}`],
    ['Quantity', input.quantity.toString()],
    ['COGS (per unit)', `${currency} ${input.cogs}`],
    ['Shipping Cost', `${currency} ${input.shippingCost}`],
    ['COD', input.isCOD ? 'Yes' : 'No'],
    ['', ''],
    ['RESULTS', ''],
    ['Gross Revenue', `${currency} ${output.grossRevenue}`],
    ['Referral Fee', `${currency} ${output.referralFee}`],
    ['Fixed Fee', `${currency} ${output.fixedFee}`],
    ['Payment Fee', `${currency} ${output.paymentFeeAmount}`],
    ['Shipping Fee', `${currency} ${output.shippingFee}`],
    ['GST on Fees', `${currency} ${output.gstOnFees}`],
    ['TCS (1%)', `${currency} ${output.tcs}`],
    ['COD Fee', `${currency} ${output.codFee}`],
    ['Total Fees', `${currency} ${output.totalFees}`],
    ['Net Payout', `${currency} ${output.netPayout}`],
    ['Output GST', `${currency} ${output.outputGstAmount}`],
    ['Net GST Payable', `${currency} ${output.netGstPayable}`],
    ['Profit', `${currency} ${output.profit}`],
    ['Profit Margin', `${output.profitMargin}%`],
    ['ROI', `${output.roi}%`],
    ['Break-even Price', `${currency} ${output.breakEvenPrice}`],
  ]

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
}
