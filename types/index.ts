// Platform types
export type PlatformId =
  | 'amazon-in'
  | 'amazon-us'
  | 'flipkart'
  | 'meesho'
  | 'ebay'
  | 'walmart'
  | 'shopee'
  | 'lazada'

export type Currency = 'INR' | 'USD' | 'SGD' | 'EUR' | 'GBP'

// Fee tier for tiered commissions
export interface FeeTier {
  max: number
  rate: number
}

// A single product category with its fee structure
export interface PlatformCategory {
  name: string
  commissionRate: number
  minFee?: number
  fixedFee?: number
  tiers?: FeeTier[]
}

// Full platform configuration
export interface PlatformConfig {
  id: PlatformId
  name: string
  shortName: string
  currency: Currency
  flag: string
  color: string
  bgColor: string
  hasGST: boolean
  hasTCS: boolean
  hasCOD: boolean
  paymentRate: number
  paymentFixed: number
  gstRate: number
  tcsRate: number
  codRate: number
  shippingFeeDefault: number
  categories: PlatformCategory[]
  description: string
}

// Calculator form input
export interface CalculatorInput {
  platform: PlatformId
  sellingPrice: number
  category: string
  shippingCost: number
  cogs: number
  quantity: number
  currency: Currency
  isCOD: boolean
  includeGST: boolean
  includeTCS: boolean
  customCommissionRate?: number
  customFixedFee?: number
}

// Individual fee breakdown item
export interface FeeBreakdownItem {
  name: string
  amount: number
  color: string
  percentage?: number
  tooltip?: string
}

// Calculator output / result
export interface CalculatorOutput {
  platform: PlatformId
  grossRevenue: number
  referralFee: number
  fixedFee: number
  shippingFee: number
  paymentFeeAmount: number
  gstOnFees: number
  tcs: number
  codFee: number
  totalFees: number
  netPayout: number
  profit: number
  profitMargin: number
  roi: number
  breakEvenPrice: number
  currency: Currency
  feeBreakdown: FeeBreakdownItem[]
  effectiveCommissionRate: number
  isProfit: boolean
}

// Default form values
export const DEFAULT_INPUT: CalculatorInput = {
  platform: 'amazon-in',
  sellingPrice: 1500,
  category: 'Apparel & Clothing',
  shippingCost: 50,
  cogs: 800,
  quantity: 1,
  currency: 'INR',
  isCOD: false,
  includeGST: true,
  includeTCS: true,
}

// Currency symbols map
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  SGD: 'S$',
  EUR: '€',
  GBP: '£',
}

// Currency format locales
export const CURRENCY_LOCALES: Record<Currency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  SGD: 'en-SG',
  EUR: 'de-DE',
  GBP: 'en-GB',
}

// API types
export interface CalculateRequest extends CalculatorInput {}

export interface CalculateResponse {
  success: boolean
  data?: CalculatorOutput
  error?: string
}
