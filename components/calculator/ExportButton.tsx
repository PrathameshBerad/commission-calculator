'use client'

import { useCalculatorStore } from '@/lib/store'
import { generateCSVData } from '@/lib/calculations'
import { Download, BookmarkPlus, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ExportButton() {
  const { output, input, saveCalculation } = useCalculatorStore()
  const [saved, setSaved] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleExportCSV = () => {
    if (!output) return
    const csv = generateCSVData(input, output)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `commcalc-${input.platform}-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  const handleSave = () => {
    saveCalculation()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        disabled={!output}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all duration-200',
          saved
            ? 'border-[#00E5A0]/40 bg-[#00E5A0]/10 text-[#00E5A0]'
            : 'border-border/60 bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
          !output && 'opacity-40 cursor-not-allowed'
        )}
      >
        {saved ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <BookmarkPlus className="h-3.5 w-3.5" />
        )}
        {saved ? 'Saved!' : 'Save'}
      </button>

      <button
        onClick={handleExportCSV}
        disabled={!output}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200',
          downloaded
            ? 'bg-[#00E5A0]/20 text-[#00E5A0]'
            : 'bg-[#00E5A0] text-[#0A0B14] hover:bg-[#00C896]',
          !output && 'opacity-40 cursor-not-allowed'
        )}
      >
        {downloaded ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {downloaded ? 'Downloaded!' : 'Export CSV'}
      </button>
    </div>
  )
}
