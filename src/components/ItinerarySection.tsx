import { Sun, CloudSun, Moon, Calendar, DollarSign } from 'lucide-react'
import type { DayPlan } from '../types'

interface ItinerarySectionProps {
  dayPlans: DayPlan[]
}

export default function ItinerarySection({ dayPlans }: ItinerarySectionProps) {
  return (
    <div className="space-y-4">
      {dayPlans.map((day, i) => (
        <div key={i} className="glass-card p-5 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aero-500/20 to-aero-600/10 border border-aero-400/20 flex items-center justify-center">
                <span className="text-xl font-display font-bold text-aero-300">{day.day}</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">{day.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {day.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Est. cost</p>
              <p className="text-sm font-semibold text-accent-400 flex items-center gap-0.5">
                <DollarSign className="w-3.5 h-3.5" />{day.estimatedCost}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TimeBlock icon={Sun} label="Morning" activity={day.morning} color="aero" />
            <TimeBlock icon={CloudSun} label="Afternoon" activity={day.afternoon} color="accent" />
            <TimeBlock icon={Moon} label="Evening" activity={day.evening} color="violet" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TimeBlock({ icon: Icon, label, activity, color }: { icon: typeof Sun; label: string; activity: string; color: string }) {
  const colorMap: Record<string, string> = {
    aero: 'text-aero-400 bg-aero-500/5 border-aero-400/10',
    accent: 'text-accent-400 bg-accent-400/5 border-accent-400/10',
    violet: 'text-violet-400 bg-violet-500/5 border-violet-400/10',
  }
  return (
    <div className={`rounded-xl border p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-slate-300 leading-snug">{activity}</p>
    </div>
  )
}
