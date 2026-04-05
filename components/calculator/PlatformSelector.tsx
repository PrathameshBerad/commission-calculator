'use client'

import { PLATFORM_LIST } from '@/lib/platformFees'
import type { PlatformId } from '@/types'
import { cn } from '@/lib/utils'

interface PlatformSelectorProps {
  value: PlatformId
  onChange: (id: PlatformId) => void
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PLATFORM_LIST.map((platform) => {
        const selected = value === platform.id
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onChange(platform.id)}
            className={cn(
              'platform-card flex items-center gap-2.5 text-left',
              selected && 'selected'
            )}
            style={
              selected
                ? {
                    borderColor: `${platform.color}50`,
                    background: `${platform.color}08`,
                  }
                : undefined
            }
          >
            <span className="text-xl flex-shrink-0">{platform.flag}</span>
            <div className="min-w-0">
              <p
                className={cn(
                  'truncate text-xs font-semibold transition-colors',
                  selected ? 'text-foreground' : 'text-muted-foreground'
                )}
                style={selected ? { color: platform.color } : undefined}
              >
                {platform.shortName}
              </p>
              <p className="text-[10px] text-muted-foreground">{platform.currency}</p>
            </div>
            {selected && (
              <div
                className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: platform.color }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
