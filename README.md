# CommCalc — Marketplace Commission Calculator

> **Free, real-time commission calculator for Amazon, Flipkart, Meesho, eBay, Walmart, Shopee, Lazada and more.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## Overview

CommCalc is a production-grade SaaS-style web application that helps e-commerce sellers calculate their **true net profit** before listing products on any major marketplace.

It accounts for every fee type:
- Platform referral/commission fees (flat & tiered)
- Fixed/closing fees per order
- Payment gateway fees
- 18% GST on platform fees (India)
- 1% TCS deduction (India)
- COD surcharges
- Shipping/logistics costs

And outputs:
- **Net Payout** — What you actually receive
- **Profit** — After COGS deduction
- **Profit Margin %**
- **ROI %**
- **Break-even Price**

---

## Features

- ⚡ Real-time calculations — updates on every keystroke
- 🌐 8 platforms: Amazon IN/US, Flipkart, Meesho, eBay, Walmart, Shopee, Lazada
- 📊 Interactive fee breakdown donut chart (Recharts)
- 📥 Export to CSV
- 💾 Save calculations (via Zustand persistence)
- 🌙 Dark / Light theme toggle
- 📱 Fully responsive (mobile-first)
- 🔒 Privacy-first — no data stored server-side
- 🇮🇳 India-specific: GST, TCS, INR formatting
- 🌍 Multi-currency: INR, USD, SGD, EUR, GBP

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| UI Components | Radix UI + custom |
| Charts | Recharts |
| Animation | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Fonts | Outfit + JetBrains Mono |
| Theme | next-themes |
| API | Next.js Route Handlers |

---

## Project Structure

```
commission-calculator/
├── app/
│   ├── layout.tsx          # Root layout + fonts + theme
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + CSS variables
│   ├── calculator/page.tsx # Main calculator page
│   ├── about/page.tsx      # About page
│   ├── docs/page.tsx       # Documentation
│   ├── contact/page.tsx    # Contact
│   └── api/calculate/route.ts  # REST API endpoint
├── components/
│   ├── layout/             # Navbar, Footer, ThemeProvider
│   ├── home/               # Hero, Stats, Features, etc.
│   └── calculator/         # CalculatorForm, Results, Chart, Export
├── lib/
│   ├── platformFees.ts     # All platform fee configs
│   ├── calculations.ts     # Core calculation engine
│   ├── store.ts            # Zustand store
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript type definitions
```

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/commission-calculator.git
cd commission-calculator

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Deploy

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel
```

Or connect your GitHub repository at [vercel.com](https://vercel.com) and it will auto-deploy.

### Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

No required environment variables — the app works out of the box.

---

## API Reference

```
POST /api/calculate
```

**Request:**
```json
{
  "platform": "amazon-in",
  "sellingPrice": 1500,
  "category": "Apparel & Clothing",
  "shippingCost": 50,
  "cogs": 800,
  "quantity": 1,
  "currency": "INR",
  "isCOD": false,
  "includeGST": true,
  "includeTCS": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "netPayout": 1267.50,
    "totalFees": 232.50,
    "profit": 467.50,
    "profitMargin": 36.9,
    "roi": 58.4,
    "breakEvenPrice": 1032.20,
    "feeBreakdown": [...]
  }
}
```

---

## Supported Platforms

| Platform | Currency | GST | TCS | COD |
|---------|---------|-----|-----|-----|
| Amazon India | INR | ✅ 18% | ✅ 1% | ✅ 2% |
| Amazon USA | USD | ❌ | ❌ | ❌ |
| Flipkart | INR | ✅ 18% | ✅ 1% | ✅ 2% |
| Meesho | INR | ✅ 18% | ✅ 1% | ✅ |
| eBay | USD | ❌ | ❌ | ❌ |
| Walmart | USD | ❌ | ❌ | ❌ |
| Shopee | SGD | ❌ | ❌ | ❌ |
| Lazada | USD | ❌ | ❌ | ❌ |

---

## License

MIT © CommCalc

---

> **Disclaimer:** Fee rates are sourced from official marketplace documentation and updated regularly. Always verify rates with your Seller Central / Seller Hub before making pricing decisions.
