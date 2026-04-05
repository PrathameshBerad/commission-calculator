'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { useCalculatorStore } from '@/lib/store'
import { formatCurrency } from '@/lib/calculations'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: { color: string; tooltip?: string; currency: string }
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border/60 bg-popover px-3 py-2.5 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-xs font-semibold">{item.name}</span>
      </div>
      <p className="font-mono text-sm font-bold text-foreground">
        {formatCurrency(item.value, item.payload.currency)}
      </p>
      {item.payload.tooltip && (
        <p className="mt-1 text-xs text-muted-foreground max-w-40">
          {item.payload.tooltip}
        </p>
      )}
    </div>
  )
}

function CustomLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>
}) {
  if (!payload) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function BreakdownChart() {
  const { output } = useCalculatorStore()

  if (!output || output.feeBreakdown.length === 0) return null

  // Add "Net Payout" as the largest slice
  const chartData = [
    {
      name: 'Net Payout',
      value: Math.max(0, output.netPayout),
      color: '#00E5A0',
      tooltip: 'Amount you receive after all deductions',
      currency: output.currency,
    },
    ...output.feeBreakdown.map((fee) => ({
      name: fee.name,
      value: fee.amount,
      color: fee.color,
      tooltip: fee.tooltip,
      currency: output.currency,
    })),
  ].filter((d) => d.value > 0)

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <h3 className="text-sm font-semibold mb-1">Profit & Fee Breakdown</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Visual breakdown of where your revenue goes
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={72}
            outerRadius={108}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend />}
            wrapperStyle={{ paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground">Total Revenue</p>
        <p className="font-mono text-lg font-bold text-foreground">
          {formatCurrency(output.grossRevenue, output.currency)}
        </p>
      </div>
    </div>
  )
}
