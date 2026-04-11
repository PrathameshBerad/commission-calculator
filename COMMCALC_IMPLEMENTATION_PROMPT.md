# CommCalc — Case 2 Fee Accuracy & Production Upgrade

## Context
You are working on the branch `Experiment-Baranch-Prathamesh` of:
https://github.com/PrathameshBerad/commission-calculator

Before doing anything else, run:
```bash
git fetch origin
git checkout Experiment-Baranch-Prathamesh
npm install
```

This is a Next.js 14 (App Router) + TypeScript + Tailwind CSS commission
calculator. The core files you will touch are:

- `lib/platformFees.ts` — all fee configs (hardcoded TypeScript object)
- `lib/calculations.ts` — calculation engine
- `lib/gstLogic.ts` — India GST logic
- `types/index.ts` — TypeScript interfaces
- `app/api/calculate/route.ts` — the only API endpoint

You have read the existing source code. Do NOT change the UI, the Zustand
store, the form, the chart, or any component files. Only change what is
explicitly listed below.

---

## TASK 1 — Fix Inaccurate Fee Data in `lib/platformFees.ts`

The existing fee data has several documented errors. Fix them all with the
researched-and-verified values below. Do not change any field names or the
TypeScript interface — only update the values.

### 1A. Add fee metadata to `PlatformConfig`

First add two new optional fields to the `PlatformConfig` interface in
`types/index.ts`:

```typescript
lastUpdated: string   // ISO date string e.g. "2026-03-16"
feeSource: string     // URL of the official source used
```

### 1B. Fix Amazon India (`amazon-in`)

**What is wrong right now:**
- `commissionRate` for Apparel is 0.18 — WRONG, it should be 0.07 (7%)
- `commissionRate` for Consumer Electronics is 0.11 — WRONG, should be 0.07
- `commissionRate` for Home Decor is 0.15 — WRONG, should be 0.10
- `commissionRate` for Shoes is 0.15 — WRONG, should be 0.10
- `commissionRate` for Toys is 0.12 — WRONG, should be 0.09
- `commissionRate` for Grocery is 0.10 — WRONG, should be 0.05
- `fixedFee` per category is WRONG — Amazon India closing fees are
  PRICE-BASED (not category-based). The correct values are:
    ≤₹250  → ₹9
    ₹251–₹500 → ₹12
    >₹500  → ₹20
  Set `fixedFee: 20` for all categories as a safe default (>₹500 slab).
  The dynamic closing fee by price will be handled in Task 2.

**Correct category rates to use (all apply for selling price > ₹1000;
the ≤₹1000 = 0% logic is already in `calculations.ts` — do not touch that):**

```
Apparel & Clothing         → commissionRate: 0.07, fixedFee: 20, minFee: 1
Mobile Phones              → commissionRate: 0.05, fixedFee: 20, minFee: 1
Laptops & Tablets          → commissionRate: 0.06, fixedFee: 20, minFee: 1
Consumer Electronics       → commissionRate: 0.07, fixedFee: 20, minFee: 1
Books                      → commissionRate: 0.08, fixedFee: 9,  minFee: 1
Home Decor                 → commissionRate: 0.10, fixedFee: 20, minFee: 1
Home & Kitchen             → commissionRate: 0.09, fixedFee: 20, minFee: 1
Jewelry                    → commissionRate: 0.20, fixedFee: 20, minFee: 5
Shoes & Footwear           → commissionRate: 0.10, fixedFee: 20, minFee: 1
Sports & Outdoors          → commissionRate: 0.09, fixedFee: 20, minFee: 1
Toys & Games               → commissionRate: 0.09, fixedFee: 20, minFee: 1
Beauty & Personal Care     → commissionRate: 0.10, fixedFee: 20, minFee: 1
Health & Household         → commissionRate: 0.08, fixedFee: 20, minFee: 1
Grocery & Gourmet          → commissionRate: 0.05, fixedFee: 9,  minFee: 1
Automotive Accessories     → commissionRate: 0.10, fixedFee: 20, minFee: 1
```

Add to platform level:
```typescript
lastUpdated: '2026-03-16',
feeSource: 'https://sell.amazon.in/fees-and-pricing',
```

### 1C. Fix Flipkart

**What is wrong:** Commission rates are broadly correct but missing the
Gold/Silver/Bronze tier distinction. Keep the existing commission rates
(they reflect mid-tier). Update fixed fees to reflect the Nov 2025 revision.

```
Apparel / Fashion                      → commissionRate: 0.07, fixedFee: 57, minFee: 1
Books & Media                          → commissionRate: 0.10, fixedFee: 30, minFee: 1
Consumer Electronics (Laptops/Tablets) → commissionRate: 0.05, fixedFee: 57, minFee: 1
Electronics Accessories                → commissionRate: 0.09, fixedFee: 57, minFee: 1
Home & Furniture                       → commissionRate: 0.12, fixedFee: 57, minFee: 1
Mobile Phones                          → commissionRate: 0.04, fixedFee: 57, minFee: 1
Footwear                               → commissionRate: 0.10, fixedFee: 57, minFee: 1
Toys & Baby Products                   → commissionRate: 0.12, fixedFee: 30, minFee: 1
Beauty & Wellness                      → commissionRate: 0.10, fixedFee: 30, minFee: 1
Jewelry & Accessories                  → commissionRate: 0.15, fixedFee: 57, minFee: 5
Sports & Fitness                       → commissionRate: 0.12, fixedFee: 57, minFee: 1
Food & Nutrition                       → commissionRate: 0.10, fixedFee: 30, minFee: 1
```

Add to platform level:
```typescript
lastUpdated: '2025-11-01',
feeSource: 'https://seller.flipkart.com/fees-and-commission',
```

### 1D. Fix eBay — Critical double-counting bug

**The bug:** eBay's final value fee ALREADY includes payment processing.
The current code sets `paymentRate: 0.0299` and `paymentFixed: 0.49` on
top of the commission, which charges sellers twice.

Fix: Set `paymentRate: 0` and `paymentFixed: 0` for eBay. The final value
fee percentages already include payment processing as of 2024 (eBay Managed
Payments).

Updated commission rates (Feb 2025 revision):
```
Consumer Electronics    → commissionRate: 0.1325, fixedFee: 0.30
Clothing & Accessories  → commissionRate: 0.1325, fixedFee: 0.30
Collectibles & Art      → commissionRate: 0.1325, fixedFee: 0.30
Books, Movies & Music   → commissionRate: 0.1465, fixedFee: 0.30
Home & Garden           → commissionRate: 0.1325, fixedFee: 0.30
Motors Parts            → commissionRate: 0.129,  fixedFee: 0.30
Sporting Goods          → commissionRate: 0.1325, fixedFee: 0.30
Toys & Hobbies          → commissionRate: 0.1325, fixedFee: 0.30
Health & Beauty         → commissionRate: 0.1325, fixedFee: 0.30
Baby                    → commissionRate: 0.1325, fixedFee: 0.30
Jewelry & Watches       → commissionRate: 0.15,   fixedFee: 0.30
```

Set at platform level:
```typescript
paymentRate: 0,
paymentFixed: 0,
lastUpdated: '2025-02-14',
feeSource: 'https://www.ebay.com/sellercenter/resources/seller-updates/2025-january/final-value-fee',
```

### 1E. Fix Walmart

Add missing categories and correct rates:
```
Apparel (≤$15)          → commissionRate: 0.05,  fixedFee: 0
Apparel ($15–$20)       → commissionRate: 0.10,  fixedFee: 0
Apparel (>$20)          → commissionRate: 0.15,  fixedFee: 0
Consumer Electronics    → commissionRate: 0.08,  fixedFee: 0
Health & Beauty         → commissionRate: 0.15,  fixedFee: 0
Home & Garden           → commissionRate: 0.15,  fixedFee: 0
Sporting Goods          → commissionRate: 0.15,  fixedFee: 0
Toys & Baby             → commissionRate: 0.15,  fixedFee: 0
Pet Supplies            → commissionRate: 0.15,  fixedFee: 0
Office Products         → commissionRate: 0.15,  fixedFee: 0
Books & Media           → commissionRate: 0.15,  fixedFee: 0
Grocery & Gourmet       → commissionRate: 0.08,  fixedFee: 0
Jewelry                 → commissionRate: 0.20,  fixedFee: 0
```

Set at platform level:
```typescript
paymentRate: 0.029,
paymentFixed: 0,
lastUpdated: '2025-01-01',
feeSource: 'https://sellerhelp.walmart.com/s/guide?article=000009164',
```

### 1F. Fix Shopee (Singapore)

Shopee Singapore current commission rates (2025):
```
Consumer Electronics    → commissionRate: 0.03, fixedFee: 0
Fashion & Clothing      → commissionRate: 0.06, fixedFee: 0
Home & Living           → commissionRate: 0.04, fixedFee: 0
Beauty & Personal Care  → commissionRate: 0.05, fixedFee: 0
Sports & Outdoors       → commissionRate: 0.04, fixedFee: 0
Food & Groceries        → commissionRate: 0.03, fixedFee: 0
Babies & Toys           → commissionRate: 0.04, fixedFee: 0
Shoes & Bags            → commissionRate: 0.06, fixedFee: 0
Watches & Jewelry       → commissionRate: 0.05, fixedFee: 0
Automotive              → commissionRate: 0.03, fixedFee: 0
```

Set at platform level:
```typescript
paymentRate: 0.0218,
paymentFixed: 0,
lastUpdated: '2025-06-01',
feeSource: 'https://seller.shopee.sg/edu/article/8236',
```

### 1G. Fix Lazada

Lazada uses SGD (Singapore) as representative currency:
```typescript
currency: 'SGD',  // change from 'USD'
```

Updated commission rates:
```
Consumer Electronics    → commissionRate: 0.04, fixedFee: 0
Fashion & Apparel       → commissionRate: 0.07, fixedFee: 0
Home & Living           → commissionRate: 0.05, fixedFee: 0
Beauty & Health         → commissionRate: 0.06, fixedFee: 0
Sports & Fitness        → commissionRate: 0.05, fixedFee: 0
Toys & Baby             → commissionRate: 0.06, fixedFee: 0
Groceries               → commissionRate: 0.03, fixedFee: 0
Automotive              → commissionRate: 0.04, fixedFee: 0
Watches & Jewelry       → commissionRate: 0.08, fixedFee: 0
```

Set at platform level:
```typescript
paymentRate: 0.005,
paymentFixed: 0,
lastUpdated: '2025-06-01',
feeSource: 'https://sellercenter.lazada.sg/apps/seller/education/detail?articleId=3',
```

---

## TASK 2 — Add Tiered Closing Fee Support for Amazon India

Amazon India closing fees are price-based (not per-category). The current
schema can't express this. Add it cleanly without breaking anything.

### 2A. Add `closingFeeTiers` to `types/index.ts`

```typescript
export interface ClosingFeeTier {
  maxPrice?: number   // undefined means "above the last tier"
  fee: number
}

// In PlatformCategory, add:
closingFeeTiers?: ClosingFeeTier[]
```

### 2B. Add `closingFeeTiers` to Amazon India categories in `platformFees.ts`

All Amazon India categories should share the same closing fee tier array.
Define it as a constant at the top of the Amazon IN config block:

```typescript
const amazonInClosingFees: ClosingFeeTier[] = [
  { maxPrice: 250, fee: 9 },
  { maxPrice: 500, fee: 12 },
  { fee: 20 },           // above ₹500
]
```

Then add `closingFeeTiers: amazonInClosingFees` to every Amazon India
category. Keep `fixedFee` as the fallback (for the break-even calculation).

### 2C. Update `calculations.ts` to use `closingFeeTiers`

In the `calculate()` function, after resolving `effectiveCategoryConfig`,
add a helper to calculate the correct closing fee:

```typescript
function getClosingFee(
  price: number,
  category: PlatformCategory,
  customFixedFee?: number
): number {
  if (customFixedFee !== undefined) return customFixedFee
  if (category.closingFeeTiers && category.closingFeeTiers.length > 0) {
    for (const tier of category.closingFeeTiers) {
      if (tier.maxPrice === undefined || price <= tier.maxPrice) {
        return tier.fee
      }
    }
  }
  return category.fixedFee ?? 0
}
```

Replace the line:
```typescript
const fixedFee = round2(effectiveCategoryConfig.fixedFee ?? 0)
```
with:
```typescript
const fixedFee = round2(getClosingFee(P, effectiveCategoryConfig, customFixedFee))
```

Remove the `customFixedFee` handling from `effectiveCategoryConfig` since
it is now handled inside `getClosingFee`.

---

## TASK 3 — Frankfurter Currency Conversion (Free, Zero Config)

File to create: `lib/currency.ts`

The Frankfurter API (https://api.frankfurter.app) is completely free with
no API key. Use it to provide live exchange rates for the multi-currency
display feature that already exists in the UI.

```typescript
// lib/currency.ts

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
```

Create `app/api/exchange-rates/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getExchangeRates } from '@/lib/currency'

export async function GET() {
  const rates = await getExchangeRates()
  return NextResponse.json(
    { success: true, base: 'USD', rates, timestamp: Date.now() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}
```

---

## TASK 4 — Add `lastUpdated` Fee Transparency Endpoint

File to create: `app/api/fees/route.ts`

This serves a summary of all platforms with their fee metadata — useful for
users who want to see when data was last verified.

```typescript
import { NextResponse } from 'next/server'
import { PLATFORM_LIST } from '@/lib/platformFees'

export async function GET() {
  const summary = PLATFORM_LIST.map((p) => ({
    id: p.id,
    name: p.name,
    currency: p.currency,
    lastUpdated: p.lastUpdated,
    feeSource: p.feeSource,
    categoryCount: p.categories.length,
  }))

  return NextResponse.json({
    success: true,
    platforms: summary,
    note: 'Fee data is researched and hardcoded. Verify against official sources before making pricing decisions.',
  })
}
```

---

## TASK 5 — Unit Tests with Vitest

### 5A. Setup

Add to `package.json` devDependencies:
```json
"vitest": "^1.6.0",
"@vitest/ui": "^1.6.0"
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

### 5B. Write `__tests__/calculations.test.ts`

Write 40+ tests covering the following. Use `expect(...).toBeCloseTo(N, 1)`
for floating point comparisons. Calculate expected values by hand and
hardcode them — do NOT call `calculate()` to generate your own expected values.

```typescript
import { describe, it, expect } from 'vitest'
import { calculate } from '@/lib/calculations'
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
```

**Suite A — Amazon India (selling price > ₹1000, 7% electronics):**
1. referralFee = 1500 * 0.07 = 105
2. closingFee = 20 (price > ₹500 tier)
3. gstOnFees = (105 + 20) * 0.18 = 22.50
4. tcs = 1500 * 0.01 = 15
5. totalFees = 105 + 20 + 22.50 + 15 = 162.50
6. netPayout = 1500 - 162.50 = 1337.50
7. profit = 1337.50 - 800 = 537.50
8. profitMargin ≈ (537.50 / 1500) * 100 = 35.83%
9. isProfit = true

**Suite B — Amazon India 0% commission rule (price ≤ ₹1000):**
1. Set sellingPrice = 999 → referralFee = 0
2. Set sellingPrice = 1000 → referralFee = 0
3. Set sellingPrice = 1001 → referralFee = 1001 * 0.07 = 70.07

**Suite C — Amazon India closing fee tiers:**
1. sellingPrice = 200 → closingFee = 9
2. sellingPrice = 400 → closingFee = 12
3. sellingPrice = 600 → closingFee = 20

**Suite D — Flipkart same 0% rule (price ≤ ₹1000):**
1. platform = 'flipkart', sellingPrice = 999 → referralFee = 0
2. platform = 'flipkart', sellingPrice = 1500, category = 'Electronics Accessories' → referralFee = 1500 * 0.09 = 135

**Suite E — eBay (no GST, no TCS, no double payment fee):**
1. platform = 'ebay', sellingPrice = 100, category = 'Consumer Electronics'
   → referralFee = 100 * 0.1325 = 13.25
   → fixedFee = 0.30
   → paymentFeeAmount = 0 (paymentRate is now 0)
   → gstOnFees = 0 (no GST)
   → tcs = 0 (no TCS)
   → totalFees = 13.25 + 0.30 = 13.55

**Suite F — eBay Jewelry (higher rate):**
1. platform = 'ebay', sellingPrice = 200, category = 'Jewelry & Watches'
   → referralFee = 200 * 0.15 = 30
   → fixedFee = 0.30
   → totalFees = 30.30

**Suite G — COD surcharge (Amazon India):**
1. isCOD = true, sellingPrice = 1500
   → codFee = 1500 * 0.02 = 30
   → gstOnFees now includes codFee: (105 + 20 + 30) * 0.18 = 27.90

**Suite H — Meesho (0% commission):**
1. platform = 'meesho', sellingPrice = 500, category = 'Apparel & Clothing'
   → referralFee = 0
   → fixedFee = 0
   → gstOnFees = 0 (no platform fees to tax)
   → tcs = 500 * 0.01 = 5

**Suite I — Break-even and ROI:**
1. Amazon India, selling = 1500, cogs = 800 → breakEvenPrice > 0 and < 1500
2. cogs = 0 → roi calculation returns 0 (not infinity)
3. profit > 0 → roi = round2((profit / cogsTotal) * 100)
4. sellingPrice = 0 → should throw Error

**Suite J — Quantity multiplication:**
1. quantity = 5 → grossRevenue = 1500 * 5 = 7500
2. quantity = 5 → totalFees = totalFeesPerUnit * 5
3. quantity = 5 → profit = netPayout - (cogs * 5)

**Suite K — Custom commission rate override:**
1. customCommissionRate = 0.05 on amazon-in, price = 1500
   → referralFee = 1500 * 0.05 = 75 (not 7%)

**Suite L — convertCurrency in lib/currency.ts:**
1. from = 'USD', to = 'INR', amount = 1, rates = { USD: 1, INR: 83.5 }
   → result ≈ 83.5
2. from = 'INR', to = 'INR', amount = 500
   → result = 500 (same currency)

---

## TASK 6 — Update `.env.example`

Replace contents of `.env.example` with:

```
# CommCalc Environment Variables
# Copy this file to .env.local and fill in values

# ── Optional: No keys required for basic operation ──────────────────────────
# All fee calculations work with zero env vars.
# The Frankfurter currency API (Task 3) also requires no API key.

# ── Future: Add these when you want contact form emails ─────────────────────
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# CONTACT_EMAIL=your@email.com

# ── Future: Add these when you want API rate limiting ───────────────────────
# UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
# UPSTASH_REDIS_REST_TOKEN=your_token_here

# ── App config ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## TASK 7 — Commit Everything to the Branch

After all tasks are complete and tests pass, commit all changes:

```bash
git add -A
git commit -m "feat: accurate fee data, tiered closing fees, currency API, Vitest tests

- Fix Amazon IN commission rates (apparel 18%→7%, electronics 11%→7%)
- Fix Amazon IN closing fees: price-tiered (₹9/₹12/₹20) via closingFeeTiers
- Fix eBay double-counting: payment fee was charged on top of FVF (FVF includes it)
- Fix Lazada currency: USD→SGD
- Update Flipkart fixed fees to Nov 2025 revision (₹57 Gold tier)
- Add lastUpdated + feeSource metadata to all 8 platforms
- Add Frankfurter free currency API with 1hr cache + fallback
- Add /api/exchange-rates and /api/fees transparency endpoints
- Add ClosingFeeTier type + getClosingFee() to calculation engine
- Add Vitest with 40+ unit tests covering all fee calculation scenarios"

git push origin Experiment-Baranch-Prathamesh
```

---

## Implementation Rules

1. TypeScript strict mode — zero `any` types. Use `unknown` if type is uncertain.
2. Run `npm run build` after every task — must pass with zero errors.
3. Run `npm run test` after Task 5 — all tests must pass.
4. Run `npm run lint` at the end — fix all warnings.
5. Do NOT modify: any component file, the Zustand store, the calculator form,
   the chart, the homepage, or `app/layout.tsx`.
6. Only add `import` statements where the file is actually used.
7. The `closingFeeTiers` field is optional — it must not break Flipkart, eBay,
   Meesho, Walmart, Shopee, or Lazada (they don't use it).
8. All new exported functions must have a JSDoc comment.

## Final Verification Checklist

- [ ] `npm run build` → 0 errors ✅
- [ ] `npm run test` → all 40+ tests pass ✅
- [ ] `npm run lint` → 0 warnings ✅
- [ ] Amazon India ₹999: referralFee = 0 ✅
- [ ] Amazon India ₹1500 Electronics: referralFee = ₹105 (7%) ✅
- [ ] Amazon India ₹1500 Apparel: referralFee = ₹105 (7%, not 18%) ✅
- [ ] Amazon India ₹400: closingFee = ₹12 (tiered) ✅
- [ ] eBay $100 Electronics: totalFees = $13.55 (no double payment) ✅
- [ ] GET /api/exchange-rates → returns USD-base rates ✅
- [ ] GET /api/fees → returns all 8 platforms with lastUpdated ✅
- [ ] All changes committed to `Experiment-Baranch-Prathamesh` ✅
