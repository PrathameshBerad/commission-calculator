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
