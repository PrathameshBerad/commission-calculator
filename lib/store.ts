'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalculatorInput, CalculatorOutput } from '@/types'
import { DEFAULT_INPUT } from '@/types'
import { calculate } from './calculations'

interface CalculatorStore {
  input: CalculatorInput
  output: CalculatorOutput | null
  isCalculating: boolean
  savedCalculations: Array<{ input: CalculatorInput; output: CalculatorOutput; timestamp: number }>
  
  setInput: (updates: Partial<CalculatorInput>) => void
  recalculate: () => void
  saveCalculation: () => void
  clearSaved: () => void
  resetInput: () => void
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      input: DEFAULT_INPUT,
      output: null,
      isCalculating: false,
      savedCalculations: [],

      setInput: (updates) => {
        const newInput = { ...get().input, ...updates }
        let newOutput: CalculatorOutput | null = null

        try {
          newOutput = calculate(newInput)
        } catch {
          newOutput = null
        }

        set({ input: newInput, output: newOutput })
      },

      recalculate: () => {
        const { input } = get()
        set({ isCalculating: true })
        try {
          const output = calculate(input)
          set({ output, isCalculating: false })
        } catch {
          set({ output: null, isCalculating: false })
        }
      },

      saveCalculation: () => {
        const { input, output, savedCalculations } = get()
        if (!output) return
        set({
          savedCalculations: [
            { input, output, timestamp: Date.now() },
            ...savedCalculations.slice(0, 9), // Keep last 10
          ],
        })
      },

      clearSaved: () => set({ savedCalculations: [] }),

      resetInput: () => {
        const output = calculate(DEFAULT_INPUT)
        set({ input: DEFAULT_INPUT, output })
      },
    }),
    {
      name: 'commission-calculator-storage',
      partialize: (state) => ({
        savedCalculations: state.savedCalculations,
      }),
    }
  )
)
