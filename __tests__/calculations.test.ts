import { describe, it, expect } from 'vitest'
import { calculate } from '@/lib/calculations'
import { convertCurrency } from '@/lib/currency'
import type { CalculatorInput } from '@/types'

// Base input template — override per test
const base: CalculatorInput = {
  platform: 'amazon-in',
  sellingPrice: 1500,
  category: 'Consumer Electronics',
  shippingCost: 0,
  cogs: 800,
  quantity: 1,
  currency: 'INR',
  isCOD: false,
  includeGST: true,
  includeTCS: true,
  calculateProductGst: false,
  productGstRate: 0,
  isGstInclusive: false,
  customCommissionRate: undefined,
  customFixedFee: undefined,
  fulfillmentMode: 'seller',
  pickAndPackFee: 0,
  platformShippingFee: 0,
}

// ── Suite A — Amazon India selling price > ₹1000, 7% electronics ──────────────

describe('Suite A — Amazon India ₹1500 Consumer Electronics', () => {
  const result = calculate(base)

  it('A1: referralFee = 1500 * 0.07 = 105', () => {
    expect(result.referralFee).toBeCloseTo(105, 1)
  })

  it('A2: closingFee = 20 (price > ₹500 tier)', () => {
    expect(result.fixedFee).toBeCloseTo(20, 1)
  })

  it('A3: gstOnFees = (105 + 20) * 0.18 = 22.50', () => {
    expect(result.gstOnFees).toBeCloseTo(22.5, 1)
  })

  it('A4: tcs = 1500 * 0.01 = 15', () => {
    expect(result.tcs).toBeCloseTo(15, 1)
  })

  it('A5: totalFees = 105 + 20 + 22.50 + 15 = 162.50', () => {
    expect(result.totalFees).toBeCloseTo(162.5, 1)
  })

  it('A6: netPayout = 1500 - 162.50 = 1337.50', () => {
    expect(result.netPayout).toBeCloseTo(1337.5, 1)
  })

  it('A7: profit reflects netPayout minus COGS plus ITC credit on gstOnFees', () => {
    // netGstPayable = outputGstAmount(0) - gstOnFees(22.50) = -22.50
    // profit = 1337.50 - 800 - (-22.50) = 560.00
    expect(result.profit).toBeCloseTo(560, 1)
  })

  it('A8: profitMargin = (560 / 1500) * 100 ≈ 37.3%', () => {
    expect(result.profitMargin).toBeCloseTo(37.3, 1)
  })

  it('A9: isProfit = true', () => {
    expect(result.isProfit).toBe(true)
  })
})

// ── Suite B — Amazon India 0% commission rule (price ≤ ₹1000) ─────────────────

describe('Suite B — Amazon India 0% commission rule', () => {
  it('B1: sellingPrice = 999 → referralFee = 0', () => {
    const result = calculate({ ...base, sellingPrice: 999 })
    expect(result.referralFee).toBeCloseTo(0, 1)
  })

  it('B2: sellingPrice = 1000 → referralFee = 0', () => {
    const result = calculate({ ...base, sellingPrice: 1000 })
    expect(result.referralFee).toBeCloseTo(0, 1)
  })

  it('B3: sellingPrice = 1001 → referralFee = 1001 * 0.07 = 70.07', () => {
    const result = calculate({ ...base, sellingPrice: 1001 })
    expect(result.referralFee).toBeCloseTo(70.07, 1)
  })
})

// ── Suite C — Amazon India closing fee tiers ──────────────────────────────────

describe('Suite C — Amazon India closing fee tiers', () => {
  it('C1: sellingPrice = 200 → closingFee = 9', () => {
    const result = calculate({ ...base, sellingPrice: 200 })
    expect(result.fixedFee).toBeCloseTo(9, 1)
  })

  it('C2: sellingPrice = 400 → closingFee = 12', () => {
    const result = calculate({ ...base, sellingPrice: 400 })
    expect(result.fixedFee).toBeCloseTo(12, 1)
  })

  it('C3: sellingPrice = 600 → closingFee = 20', () => {
    const result = calculate({ ...base, sellingPrice: 600 })
    expect(result.fixedFee).toBeCloseTo(20, 1)
  })
})

// ── Suite D — Flipkart 0% rule + corrected rates ──────────────────────────────

describe('Suite D — Flipkart commission', () => {
  it('D1: flipkart sellingPrice = 999 → referralFee = 0', () => {
    const result = calculate({ ...base, platform: 'flipkart', sellingPrice: 999, category: 'Electronics Accessories' })
    expect(result.referralFee).toBeCloseTo(0, 1)
  })

  it('D2: flipkart sellingPrice = 1500, Electronics Accessories → referralFee = 1500 * 0.09 = 135', () => {
    const result = calculate({ ...base, platform: 'flipkart', sellingPrice: 1500, category: 'Electronics Accessories' })
    expect(result.referralFee).toBeCloseTo(135, 1)
  })
})

// ── Suite E — eBay (no GST, no TCS, no double payment fee) ───────────────────

describe('Suite E — eBay Consumer Electronics $100', () => {
  const eBayInput: CalculatorInput = {
    ...base,
    platform: 'ebay',
    sellingPrice: 100,
    category: 'Consumer Electronics',
    currency: 'USD',
    includeGST: false,
    includeTCS: false,
  }
  const result = calculate(eBayInput)

  it('E1: referralFee = 100 * 0.1325 = 13.25', () => {
    expect(result.referralFee).toBeCloseTo(13.25, 1)
  })

  it('E2: fixedFee = 0.30', () => {
    expect(result.fixedFee).toBeCloseTo(0.30, 1)
  })

  it('E3: paymentFeeAmount = 0 (paymentRate is now 0 — FVF includes payment processing)', () => {
    expect(result.paymentFeeAmount).toBeCloseTo(0, 1)
  })

  it('E4: gstOnFees = 0 (no GST on eBay)', () => {
    expect(result.gstOnFees).toBeCloseTo(0, 1)
  })

  it('E5: totalFees = 13.25 + 0.30 = 13.55', () => {
    expect(result.totalFees).toBeCloseTo(13.55, 1)
  })
})

// ── Suite F — eBay Jewelry (higher rate) ─────────────────────────────────────

describe('Suite F — eBay Jewelry & Watches $200', () => {
  const result = calculate({
    ...base,
    platform: 'ebay',
    sellingPrice: 200,
    category: 'Jewelry & Watches',
    currency: 'USD',
    includeGST: false,
    includeTCS: false,
  })

  it('F1: referralFee = 200 * 0.15 = 30', () => {
    expect(result.referralFee).toBeCloseTo(30, 1)
  })

  it('F2: fixedFee = 0.30', () => {
    expect(result.fixedFee).toBeCloseTo(0.30, 1)
  })

  it('F3: totalFees = 30.30', () => {
    expect(result.totalFees).toBeCloseTo(30.30, 1)
  })
})

// ── Suite G — COD surcharge (Amazon India) ────────────────────────────────────

describe('Suite G — COD surcharge on Amazon India ₹1500', () => {
  const result = calculate({ ...base, isCOD: true })

  it('G1: codFee = 1500 * 0.02 = 30', () => {
    expect(result.codFee).toBeCloseTo(30, 1)
  })

  it('G2: gstOnFees includes codFee: (105 + 20 + 30) * 0.18 = 27.90', () => {
    expect(result.gstOnFees).toBeCloseTo(27.9, 1)
  })
})

// ── Suite H — Meesho 0% commission ───────────────────────────────────────────

describe('Suite H — Meesho 0% commission', () => {
  const result = calculate({
    ...base,
    platform: 'meesho',
    sellingPrice: 500,
    category: 'Apparel & Clothing',
  })

  it('H1: referralFee = 0', () => {
    expect(result.referralFee).toBeCloseTo(0, 1)
  })

  it('H2: fixedFee = 0', () => {
    expect(result.fixedFee).toBeCloseTo(0, 1)
  })

  it('H3: gstOnFees = 0 (no platform fees to tax)', () => {
    expect(result.gstOnFees).toBeCloseTo(0, 1)
  })

  it('H4: tcs = 500 * 0.01 = 5', () => {
    expect(result.tcs).toBeCloseTo(5, 1)
  })
})

// ── Suite I — Break-even and ROI ──────────────────────────────────────────────

describe('Suite I — Break-even and ROI', () => {
  it('I1: Amazon India ₹1500 cogs=800 → breakEvenPrice > 0 and < 1500', () => {
    const result = calculate(base)
    expect(result.breakEvenPrice).toBeGreaterThan(0)
    expect(result.breakEvenPrice).toBeLessThan(1500)
  })

  it('I2: cogs = 0 → roi = 0 (not infinity)', () => {
    const result = calculate({ ...base, cogs: 0 })
    expect(result.roi).toBe(0)
  })

  it('I3: profit > 0 → roi = round2((profit / cogsTotal) * 100) = 70', () => {
    const result = calculate(base)
    // profit = 560, cogsTotal = 800 → roi = (560/800)*100 = 70
    expect(result.roi).toBeCloseTo(70, 1)
  })

  it('I4: sellingPrice = 0 → should throw Error', () => {
    expect(() => calculate({ ...base, sellingPrice: 0 })).toThrow()
  })
})

// ── Suite J — Quantity multiplication ────────────────────────────────────────

describe('Suite J — Quantity multiplication (Q=5)', () => {
  const result = calculate({ ...base, quantity: 5 })

  it('J1: grossRevenue = 1500 * 5 = 7500', () => {
    expect(result.grossRevenue).toBeCloseTo(7500, 1)
  })

  it('J2: totalFees = totalFeesPerUnit(162.50) * 5 = 812.50', () => {
    expect(result.totalFees).toBeCloseTo(812.5, 1)
  })

  it('J3: profit = netPayout - cogsTotal + ITC credit = 2800', () => {
    // netPayout = 7500 - 812.50 = 6687.50
    // netGstPayable = 0 - (22.50*5) = -112.50
    // profit = 6687.50 - 4000 - (-112.50) = 2800
    expect(result.profit).toBeCloseTo(2800, 1)
  })
})

// ── Suite K — Custom commission rate override ─────────────────────────────────

describe('Suite K — Custom commission rate override', () => {
  it('K1: customCommissionRate = 0.05 → referralFee = 1500 * 0.05 = 75', () => {
    const result = calculate({ ...base, customCommissionRate: 0.05 })
    expect(result.referralFee).toBeCloseTo(75, 1)
  })
})

// ── Suite L — convertCurrency ─────────────────────────────────────────────────

describe('Suite L — convertCurrency', () => {
  const rates = { USD: 1, INR: 83.5 }

  it('L1: USD → INR, amount=1 → 83.5', () => {
    expect(convertCurrency(1, 'USD', 'INR', rates)).toBeCloseTo(83.5, 1)
  })

  it('L2: INR → INR, amount=500 → 500 (same currency)', () => {
    expect(convertCurrency(500, 'INR', 'INR', rates)).toBe(500)
  })
})
