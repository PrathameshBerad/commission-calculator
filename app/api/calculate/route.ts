import { NextRequest, NextResponse } from 'next/server'
import { calculate } from '@/lib/calculations'
import type { CalculatorInput } from '@/types'
import { z } from 'zod'

const calculatorSchema = z.object({
  platform: z.enum([
    'amazon-in', 'amazon-us', 'flipkart', 'meesho',
    'ebay', 'walmart', 'shopee', 'lazada'
  ]),
  sellingPrice: z.number().min(0).max(10_000_000),
  category: z.string().min(1),
  shippingCost: z.number().min(0),
  cogs: z.number().min(0),
  quantity: z.number().int().min(1).max(100_000),
  currency: z.enum(['INR', 'USD', 'SGD', 'EUR', 'GBP']),
  isCOD: z.boolean().default(false),
  includeGST: z.boolean().default(true),
  includeTCS: z.boolean().default(true),
  customCommissionRate: z.number().min(0).max(1).optional(),
  customFixedFee: z.number().min(0).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = calculatorSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const input = parsed.data as CalculatorInput
    const output = calculate(input)

    return NextResponse.json(
      { success: true, data: output },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { success: false, error: 'Calculation failed. Please check your inputs.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Commission Calculator API',
    version: '1.0.0',
    endpoints: {
      'POST /api/calculate': 'Calculate commission fees',
    },
    platforms: ['amazon-in', 'amazon-us', 'flipkart', 'meesho', 'ebay', 'walmart', 'shopee', 'lazada'],
  })
}
