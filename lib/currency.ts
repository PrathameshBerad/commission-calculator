const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  SGD: 1.35,
  EUR: 0.92,
  GBP: 0.79,
}

let cachedRates: Record<string, number> = { ...FALLBACK_RATES }
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Returns latest USD-base exchange rates.
 * Falls back to hardcoded values if fetch fails.
 * Caches in module memory for 1 hour.
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now()
  if (now - cacheTimestamp < CACHE_TTL_MS) return cachedRates

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { rates: Record<string, number> }
    cachedRates = { USD: 1, ...json.rates }
    cacheTimestamp = now
  } catch (err) {
    console.warn('[currency] Frankfurter fetch failed, using fallback:', err)
    cachedRates = { ...FALLBACK_RATES }
  }

  return cachedRates
}

/**
 * Converts an amount from one currency to another using the provided rates.
 * Rates must be USD-based (1 USD = X foreign).
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount
  const fromRate = rates[from] ?? 1
  const toRate = rates[to] ?? 1
  return (amount / fromRate) * toRate
}
