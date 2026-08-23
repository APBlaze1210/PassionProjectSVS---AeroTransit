import { Gauge, DollarSign, Clock, Zap, Star } from 'lucide-react'
import type { TripScore as TripScoreType } from '../types'

interface TripScoreProps {
  score: TripScoreType
}

export default function TripScore({ score }: TripScoreProps) {
  const metrics = [
    { label: 'Price', value: score.price, icon: DollarSign, color: 'aero' },
    { label: 'Convenience', value: score.convenience, icon: Zap, color: 'accent' },
    { label: 'Timing', value: score.timing, icon: Clock, color: 'violet' },
    { label: 'Experiences', value: score.experiences, icon: Star, color: 'emerald' },
  ]

  const colorMap: Record<string, { text: string; ring: string; bg: string }> = {
    aero: { text: 'text-aero-400', ring: 'text-aero-500', bg: 'bg-aero-500' },
    accent: { text: 'text-accent-400', ring: 'text-accent-500', bg: 'bg-accent-500' },
    violet: { text: 'text-violet-400', ring: 'text-violet-500', bg: 'bg-violet-500' },
    emerald: { text: 'text-emerald-400', ring: 'text-emerald-500', bg: 'bg-emerald-500' },
  }

  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score.overall / 100) * circumference

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="w-5 h-5 text-aero-400" />
        <h3 className="font-display font-semibold text-white text-lg">Trip Score</h3>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-white">{score.overall}</span>
            <span className="text-xs text-slate-500">out of 100</span>
          </div>
        </div>
        <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-aero-500/20 to-accent-400/20 border border-aero-400/30">
          <span className="text-lg font-display font-bold text-gradient">Grade: {score.grade}</span>
        </div>
        <p className="text-sm text-slate-400 text-center mt-3 max-w-md">{score.summary}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const c = colorMap[m.color]
          return (
            <div key={m.label} className="bg-white/5 rounded-xl p-3 text-center">
              <m.icon className={`w-5 h-5 mx-auto mb-1.5 ${c.text}`} />
              <p className="text-xs text-slate-500 mb-0.5">{m.label}</p>
              <p className={`text-xl font-display font-bold ${c.text}`}>{m.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
