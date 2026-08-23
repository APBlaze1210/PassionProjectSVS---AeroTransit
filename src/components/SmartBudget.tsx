import { TrendingDown, TrendingUp, DollarSign, Plane, Hotel, Utensils, Camera, Bus, Sparkles, Lightbulb } from 'lucide-react'
import type { BudgetBreakdown } from '../types'

interface SmartBudgetProps {
  budget: BudgetBreakdown
}

export default function SmartBudget({ budget }: SmartBudgetProps) {
  const categories = [
    { label: 'Flights', value: budget.flights, icon: Plane, color: 'red' },
    { label: 'Hotels', value: budget.hotels, icon: Hotel, color: 'navy' },
    { label: 'Food', value: budget.food, icon: Utensils, color: 'rose' },
    { label: 'Attractions', value: budget.attractions, icon: Camera, color: 'violet' },
    { label: 'Transport', value: budget.transport, icon: Bus, color: 'emerald' },
    { label: 'Misc', value: budget.misc, icon: Sparkles, color: 'orange' },
  ]

  const maxVal = Math.max(...categories.map((c) => c.value))
  const overBudget = budget.remaining < 0

  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    navy: 'bg-cream-300',
    rose: 'bg-rose-400',
    violet: 'bg-violet-400',
    emerald: 'bg-emerald-400',
    orange: 'bg-orange-400',
  }

  const textMap: Record<string, string> = {
    red: 'text-red-400',
    navy: 'text-cream-300',
    rose: 'text-rose-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    orange: 'text-orange-400',
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-cream-400" />
            <span className="text-xs text-cream-400">Your Budget</span>
          </div>
          <p className="text-2xl font-display font-bold text-cream-100">${budget.budget.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-cream-400">Trip Total</span>
          </div>
          <p className="text-2xl font-display font-bold text-cream-100">${budget.total.toLocaleString()}</p>
        </div>
        <div className={`glass-card p-4 ${overBudget ? 'border-rose-400/30' : 'border-emerald-400/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {overBudget ? <TrendingDown className="w-4 h-4 text-rose-400" /> : <TrendingUp className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs text-cream-400">{overBudget ? 'Over Budget' : 'Remaining'}</span>
          </div>
          <p className={`text-2xl font-display font-bold ${overBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${Math.abs(budget.remaining).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-display font-semibold text-cream-100 mb-4">Spending Breakdown</h3>
        <div className="space-y-3">
          {categories.map((c) => {
            const pct = maxVal > 0 ? (c.value / maxVal) * 100 : 0
            return (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm text-cream-200">
                    <c.icon className={`w-4 h-4 ${textMap[c.color]}`} /> {c.label}
                  </span>
                  <span className="text-sm font-semibold text-cream-100">${c.value.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-cream-100/5 overflow-hidden">
                  <div className={`h-full rounded-full ${colorMap[c.color]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="glass-card p-5 border-emerald-400/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-display font-semibold text-cream-100">Smart Savings</h3>
          <span className="ml-auto text-sm font-semibold text-emerald-400">Save ${budget.savings}</span>
        </div>
        <div className="space-y-2">
          {budget.savingsTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-cream-400">
              <span className="text-emerald-400 mt-0.5">→</span>
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
