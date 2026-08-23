import { Sun, CloudSun, Moon, Calendar, DollarSign } from 'lucide-react'
import type { DayPlan } from '../types'

interface ItinerarySectionProps {
  dayPlans: DayPlan[]
}

export default function ItinerarySection({ dayPlans }: ItinerarySectionProps) {
  return (
    <div className="space-y-4">
      {dayPlans.map((day, i) => (
        <div key={i} className="glass-card overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-32 md:h-auto relative overflow-hidden shrink-0">
              <img src={day.image} alt={day.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-800/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/30 flex items-center justify-center">
                  <span className="text-xl font-display font-bold text-red-300">{day.day}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-cream-100">{day.title}</h3>
                  <p className="text-xs text-cream-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {day.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cream-400">Est. cost</p>
                  <p className="text-sm font-semibold text-red-400 flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5" />{day.estimatedCost}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TimeBlock icon={Sun} label="Morning" activity={day.morning} color="red" />
                <TimeBlock icon={CloudSun} label="Afternoon" activity={day.afternoon} color="navy" />
                <TimeBlock icon={Moon} label="Evening" activity={day.evening} color="violet" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TimeBlock({ icon: Icon, label, activity, color }: { icon: typeof Sun; label: string; activity: string; color: string }) {
  const colorMap: Record<string, string> = {
    red: 'text-red-400 bg-red-500/5 border-red-500/10',
    navy: 'text-cream-300 bg-cream-100/5 border-cream-100/10',
    violet: 'text-violet-400 bg-violet-500/5 border-violet-400/10',
  }
  return (
    <div className={`rounded-xl border p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-cream-200 leading-snug">{activity}</p>
    </div>
  )
}
