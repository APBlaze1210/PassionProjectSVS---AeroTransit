import { Star, Utensils, MapPin } from 'lucide-react'
import type { Restaurant } from '../types'

interface RestaurantsSectionProps {
  restaurants: Restaurant[]
}

export default function RestaurantsSection({ restaurants }: RestaurantsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r, i) => (
        <div key={i} className="glass-card p-5 hover:border-aero-400/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent-400/10 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-sm">{r.name}</h3>
                <p className="text-xs text-slate-500">{r.cuisine} · {r.mealType}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
              <span className="text-sm font-semibold text-white">{r.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3">{r.description}</p>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-aero-400" /> {r.neighborhood}
            </span>
            <span className="text-sm font-semibold text-accent-400">{r.priceRange}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
