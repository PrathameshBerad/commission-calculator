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
