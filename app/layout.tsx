import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'OpSell AI Calculator',
    template: '%s | OpSell AI',
  },
  description:
    'Free real-time commission calculator for Amazon, Flipkart, Meesho, eBay, Walmart, Shopee, Lazada. Calculate net payout, profit margins, ROI & break-even price instantly.',
  keywords: [
    'commission calculator',
    'amazon seller fees',
    'flipkart commission',
    'meesho fees',
    'ebay seller fees',
    'marketplace calculator',
    'profit calculator',
    'ecommerce calculator',
    'seller margin calculator',
    'india ecommerce fees',
  ],
  openGraph: {
    title: 'OpSell AI Calculator',
    description:
      'Calculate your true profit across 8+ marketplaces instantly. No sign-up required.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpSell AI Calculator',
    description: 'Real-time commission calculator for Amazon, Flipkart, Meesho & more.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="bg-[#00E5A0] px-4 py-2 text-center text-xs font-semibold text-[#0A0B14] sm:text-sm transition-colors hover:bg-[#00C896]">
              <a href="https://opsell.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <span>🚀 Need help scaling your eCommerce margins? Return to Opsell.in to explore our full suite of seller insights.</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
