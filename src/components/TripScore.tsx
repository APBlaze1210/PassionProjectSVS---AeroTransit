import { Gauge, DollarSign, Clock, Zap, Star } from 'lucide-react'
import type { TripScore as TripScoreType } from '../types'

interface TripScoreProps {
  score: TripScoreType
}

export default function TripScore({ score }: TripScoreProps) {
  const metrics = [
    { label: 'Price', value: score.price, icon: DollarSign, color: 'red' },
    { label: 'Convenience', value: score.convenience, icon: Zap, color: 'cream' },
    { label: 'Timing', value: score.timing, icon: Clock, color: 'violet' },
    { label: 'Experiences', value: score.experiences, icon: Star, color: 'emerald' },
  ]

  const colorMap: Record<string, { text: string }> = {
    red: { text: 'text-red-400' },
    cream: { text: 'text-cream-300' },
    violet: { text: 'text-violet-400' },
    emerald: { text: 'text-emerald-400' },
  }

  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score.overall / 100) * circumference

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="w-5 h-5 text-red-400" />
        <h3 className="font-display font-semibold text-cream-100 text-lg">Trip Score</h3>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(246, 240, 237, 0.05)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F40000" />
                <stop offset="100%" stopColor="#F6F0ED" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-cream-100">{score.overall}</span>
            <span className="text-xs text-cream-400">out of 100</span>
          </div>
        </div>
        <div className="mt-3 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
          <span className="text-lg font-display font-bold text-red-400">Grade: {score.grade}</span>
        </div>
        <p className="text-sm text-cream-400 text-center mt-3 max-w-md">{score.summary}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const c = colorMap[m.color]
          return (
            <div key={m.label} className="bg-cream-100/5 rounded-xl p-3 text-center">
              <m.icon className={`w-5 h-5 mx-auto mb-1.5 ${c.text}`} />
              <p className="text-xs text-cream-400 mb-0.5">{m.label}</p>
              <p className={`text-xl font-display font-bold ${c.text}`}>{m.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
