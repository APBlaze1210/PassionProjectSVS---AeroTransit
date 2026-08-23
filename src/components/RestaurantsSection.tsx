import { Star, Utensils, MapPin } from 'lucide-react'
import type { Restaurant } from '../types'

interface RestaurantsSectionProps {
  restaurants: Restaurant[]
}

export default function RestaurantsSection({ restaurants }: RestaurantsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r, i) => (
        <div key={i} className="glass-card overflow-hidden hover:border-red-500/30 transition-all duration-300">
          <div className="h-32 relative overflow-hidden">
            <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/40 to-transparent" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/70 backdrop-blur-sm">
              <span className="text-xs font-medium text-red-300">{r.mealType}</span>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-900/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-red-400 fill-red-400" />
              <span className="text-xs font-semibold text-cream-100">{r.rating}</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-cream-100 text-sm">{r.name}</h3>
                <p className="text-xs text-cream-400">{r.cuisine}</p>
              </div>
            </div>

            <p className="text-xs text-cream-400 leading-relaxed mb-3">{r.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-cream-100/5">
              <span className="text-xs text-cream-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" /> {r.neighborhood}
              </span>
              <span className="text-sm font-semibold text-red-400">{r.priceRange}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
