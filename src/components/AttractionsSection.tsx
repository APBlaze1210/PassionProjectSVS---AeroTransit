import { Star, Clock, DollarSign, AlertCircle } from 'lucide-react'
import type { Attraction } from '../types'

interface AttractionsSectionProps {
  attractions: Attraction[]
}

const categoryColors: Record<string, string> = {
  Culture: 'text-red-400 bg-red-500/10 border-red-500/20',
  Landmark: 'text-cream-300 bg-cream-100/10 border-cream-100/20',
  Nature: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
  Adventure: 'text-orange-400 bg-orange-500/10 border-orange-400/20',
  Food: 'text-rose-400 bg-rose-500/10 border-rose-400/20',
  Entertainment: 'text-violet-400 bg-violet-500/10 border-violet-400/20',
  Shopping: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/20',
  Experience: 'text-amber-400 bg-amber-500/10 border-amber-400/20',
}

export default function AttractionsSection({ attractions }: AttractionsSectionProps) {
  if (!attractions.length) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <p className="text-cream-300 font-medium mb-1">No attraction data available</p>
        <p className="text-sm text-cream-400">No attractions or activities were found for this destination via the Amadeus API.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.map((a, i) => (
        <div key={i} className="glass-card overflow-hidden hover:border-red-500/30 transition-all duration-300">
          <div className="h-40 relative overflow-hidden">
            {a.image ? (
              <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-500 to-navy-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/30 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm ${categoryColors[a.category] || categoryColors.Landmark}`}>
                {a.category}
              </span>
            </div>
            {a.rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-900/70 backdrop-blur-sm">
                <Star className="w-3 h-3 text-red-400 fill-red-400" />
                <span className="text-xs font-semibold text-cream-100">{a.rating}</span>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-display font-semibold text-cream-100 mb-2">{a.name}</h3>
            {a.description && <p className="text-sm text-cream-400 leading-relaxed mb-4">{a.description}</p>}

            <div className="flex items-center justify-between pt-3 border-t border-cream-100/5">
              <span className="text-xs text-cream-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-400" /> {a.duration || 'N/A'}
              </span>
              {a.price != null ? (
                <span className="text-sm font-semibold text-red-400 flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5" />{a.price}
                </span>
              ) : (
                <span className="text-xs text-cream-500">Price N/A</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
