import type { PlatformId } from '@/types'

export interface ShippingCalculation {
  shippingFee: number
  pickAndPackFee: number
}

// Helper to calculate intervals (how many additional 500g blocks)
const calculateIncrements = (weightInGrams: number, step: number = 500) => {
  return Math.max(0, Math.ceil(weightInGrams / step) - 1)
}

/**
 * Calculates algorithmic shipping and fulfillment fees based on exact
 * 2025/2026 marketplace physical weight limits.
 */
export const calculateDynamicShipping = (
  platform: PlatformId,
  weightInGrams: number,
  zone: 'local' | 'regional' | 'national',
  fulfillmentMode: 'seller' | 'platform'
): ShippingCalculation => {
  const increments = calculateIncrements(weightInGrams, 500)
  
  let baseShipping = 0
  let incrementRate = 0
  let pickAndPack = 0

  if (platform === 'amazon-in') {
    if (fulfillmentMode === 'platform') {
      // FBA (Fulfillment by Amazon) rates
      pickAndPack = 15 // Standard size pick and pack
      if (zone === 'local') { baseShipping = 30; incrementRate = 15 }
      else if (zone === 'regional') { baseShipping = 45; incrementRate = 15 }
      else { baseShipping = 65; incrementRate = 20 }
    } else {
      // Amazon Easy Ship (Seller Fulfilled) rates
      pickAndPack = 0
      if (zone === 'local') { baseShipping = 45; incrementRate = 15 }
      else if (zone === 'regional') { baseShipping = 55; incrementRate = 20 }
      else { baseShipping = 74; incrementRate = 25 }
    }
  } else if (platform === 'flipkart') {
    if (fulfillmentMode === 'platform') {
      // Flipkart Assured (FBF) rates
      pickAndPack = 15
      if (zone === 'local') { baseShipping = 40; incrementRate = 15 }
      else if (zone === 'regional') { baseShipping = 48; incrementRate = 18 }
      else { baseShipping = 60; incrementRate = 20 }
    } else {
      // Flipkart standard self-ship
      pickAndPack = 0
      if (zone === 'local') { baseShipping = 45; incrementRate = 15 }
      else if (zone === 'regional') { baseShipping = 55; incrementRate = 20 }
      else { baseShipping = 65; incrementRate = 25 }
    }
  } else if (platform === 'meesho') {
    // Meesho shipping rates
    pickAndPack = fulfillmentMode === 'platform' ? 10 : 0
    if (zone === 'local') { baseShipping = 40; incrementRate = 12 }
    else if (zone === 'regional') { baseShipping = 48; incrementRate = 15 }
    else { baseShipping = 55; incrementRate = 18 }
  } else {
    // Generic fallback for other platforms
    pickAndPack = fulfillmentMode === 'platform' ? 15 : 0
    if (zone === 'local') { baseShipping = 40; incrementRate = 15 }
    else if (zone === 'regional') { baseShipping = 50; incrementRate = 20 }
    else { baseShipping = 65; incrementRate = 25 }
  }

  // Calculate total shipping cost
  const calculatedShippingFee = baseShipping + (increments * incrementRate)

  return {
    shippingFee: calculatedShippingFee,
    pickAndPackFee: pickAndPack
  }
}
