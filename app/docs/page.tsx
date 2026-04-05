import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'CommCalc documentation — fee formulas, API reference, and platform details.',
}

export default function DocsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="gradient-text">Documentation</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          How CommCalc works — formulas, fee structures, and API reference.
        </p>
      </div>

      <div className="space-y-12">
        {/* Fee Formula */}
        <section id="fees">
          <h2 className="text-xl font-bold mb-4">Fee Calculation Formula</h2>
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div className="space-y-2 font-mono text-sm">
              <p className="text-muted-foreground">// Core formula</p>
              {[
                'ReferralFee = max(Price × CommissionRate, MinFee)',
                'GSTonFees = (ReferralFee + FixedFee + CODFee) × 0.18',
                'TCS = Price × 0.01',
                'PaymentFee = (Price + Shipping) × PaymentRate + PaymentFixed',
                'TotalFees = ReferralFee + FixedFee + GSTonFees + TCS + PaymentFee + Shipping + CODFee',
                'GrossRevenue = Price × Quantity',
                'NetPayout = GrossRevenue − (TotalFees × Quantity)',
                'Profit = NetPayout − (COGS × Quantity)',
                'ProfitMargin = (Profit / GrossRevenue) × 100',
                'ROI = (Profit / (COGS × Quantity)) × 100',
              ].map((formula) => (
                <div
                  key={formula}
                  className="rounded-lg bg-muted/40 px-4 py-2.5 text-xs leading-relaxed"
                >
                  {formula}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GST section */}
        <section id="gst">
          <h2 className="text-xl font-bold mb-4">GST & TCS (India)</h2>
          <div className="prose prose-sm dark:prose-invert">
            <p>
              Indian marketplaces (Amazon.in, Flipkart, Meesho) charge{' '}
              <strong>18% GST</strong> on their commission and fixed fees. This
              is an additional cost beyond the commission percentage shown in
              their rate cards.
            </p>
            <p>
              <strong>TCS (Tax Collected at Source)</strong> at 1% is withheld
              from your total sales by the marketplace. This is refundable — you
              can claim it against your GST liability while filing returns.
            </p>
          </div>
        </section>

        {/* Platform Rates Table */}
        <section>
          <h2 className="text-xl font-bold mb-4">Platform Quick Reference</h2>
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  {['Platform', 'Commission', 'Fixed Fee', 'GST', 'TCS', 'COD'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[
                  ['Amazon India', '4–18%', '₹10–50', '18%', '1%', '2%'],
                  ['Amazon USA', '6–45%', '$0–1.80', '—', '—', '—'],
                  ['Flipkart', '0–20%', '₹30–50', '18%', '1%', '2%'],
                  ['Meesho', '0–3%', '—', '18%', '1%', '—'],
                  ['eBay', '10–15%', '$0.30', '—', '—', '—'],
                  ['Walmart', '6–20%', '—', '—', '—', '—'],
                  ['Shopee', '2–6%', '—', '—', '—', '—'],
                  ['Lazada', '3–8%', '—', '—', '—', '—'],
                ].map(([platform, ...cells]) => (
                  <tr key={platform} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{platform}</td>
                    {cells.map((cell, i) => (
                      <td key={i} className="px-4 py-3 text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* API section */}
        <section id="api">
          <h2 className="text-xl font-bold mb-4">API Reference</h2>
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">
                POST{' '}
                <code className="rounded bg-muted px-2 py-0.5 text-[#00E5A0]">
                  /api/calculate
                </code>
              </p>
              <pre className="rounded-lg bg-muted/40 p-4 text-xs overflow-x-auto">
{`// Request body
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

// Response
{
  "success": true,
  "data": {
    "netPayout": 1267.50,
    "totalFees": 232.50,
    "profit": 467.50,
    "profitMargin": 36.9,
    "roi": 58.4,
    "breakEvenPrice": 1032.20,
    ...
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* ROI section */}
        <section id="roi">
          <h2 className="text-xl font-bold mb-4">Understanding ROI vs Margin</h2>
          <div className="prose prose-sm dark:prose-invert">
            <p>
              <strong>Profit Margin %</strong> measures profit as a percentage of
              revenue: how much of every rupee/dollar of sales you keep. A 30%
              margin means you keep ₹30 for every ₹100 sold.
            </p>
            <p>
              <strong>ROI %</strong> measures return on your investment (COGS):
              how much profit you made relative to what you spent. A 50% ROI
              means for every ₹100 invested in inventory, you earned ₹150 back.
            </p>
            <p>
              <strong>Break-even Price</strong> is the minimum selling price at
              which your net payout exactly equals your COGS — zero profit. Price
              above this for any margin.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
