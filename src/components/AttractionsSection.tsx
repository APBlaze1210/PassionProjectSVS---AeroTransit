import { Star, Clock, DollarSign, MapPin } from 'lucide-react'
import type { Attraction } from '../types'

interface AttractionsSectionProps {
  attractions: Attraction[]
}

const categoryColors: Record<string, string> = {
  Culture: 'text-aero-400 bg-aero-500/10 border-aero-400/20',
  Landmark: 'text-accent-400 bg-accent-400/10 border-accent-400/20',
  Nature: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
  Adventure: 'text-orange-400 bg-orange-500/10 border-orange-400/20',
  Food: 'text-rose-400 bg-rose-500/10 border-rose-400/20',
  Entertainment: 'text-violet-400 bg-violet-500/10 border-violet-400/20',
}

export default function AttractionsSection({ attractions }: AttractionsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.map((a, i) => (
        <div key={i} className="glass-card overflow-hidden hover:border-aero-400/30 transition-all duration-300">
          <div className="h-32 bg-gradient-to-br from-ink-700 to-ink-800 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-3 left-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${categoryColors[a.category] || categoryColors.Culture}`}>
                {a.category}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold text-white">{a.name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                <span className="text-sm font-semibold text-white">{a.rating}</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-4">{a.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-aero-400" /> {a.duration}
              </span>
              <span className="text-sm font-semibold text-accent-400 flex items-center gap-0.5">
                <DollarSign className="w-3.5 h-3.5" />{a.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
