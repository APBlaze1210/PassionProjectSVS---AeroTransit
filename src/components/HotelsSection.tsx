import { Star, MapPin, Wifi, Waves, Dumbbell, Utensils, Wine, Bike, Trees, AlertCircle } from 'lucide-react'
import type { Hotel } from '../types'

const amenityIcons: Record<string, typeof Wifi> = {
  'Free WiFi': Wifi, Pool: Waves, 'Fitness Center': Dumbbell, Restaurant: Utensils,
  Bar: Wine, Spa: Trees, 'Rooftop Bar': Wine, 'Bike Rental': Bike, Garden: Trees,
  'Business Center': Wifi, '24h Check-in': Wifi, Parking: Wifi, 'Air Conditioning': Wifi,
  'Room Service': Utensils, Laundry: Wifi, Elevator: Wifi, Heating: Wifi, Internet: Wifi,
}

interface HotelsSectionProps {
  hotels: Hotel[]
}

export default function HotelsSection({ hotels }: HotelsSectionProps) {
  if (!hotels.length) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <p className="text-cream-300 font-medium mb-1">No hotel data available</p>
        <p className="text-sm text-cream-400">No hotels were found for these dates via the Amadeus API. Try different dates or cities.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hotels.map((hotel, i) => (
        <div key={i} className="glass-card overflow-hidden hover:border-red-500/30 transition-all duration-300">
          <div className="h-48 relative overflow-hidden">
            {hotel.image ? (
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-500 to-navy-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/30 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-900/70 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="text-sm font-semibold text-cream-100">{hotel.rating || 'N/A'}</span>
            </div>
            <div className="absolute bottom-3 right-4 px-3 py-1.5 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30">
              <span className="text-xs font-semibold text-red-300">{i === 0 ? 'Top Pick' : 'Option ' + (i + 1)}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-display font-semibold text-cream-100 text-lg mb-1">{hotel.name}</h3>
            <p className="text-sm text-cream-400 mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> {hotel.neighborhood}
            </p>
            {hotel.description && <p className="text-sm text-cream-400 mb-4 leading-relaxed">{hotel.description}</p>}

            {hotel.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.amenities.map((a) => {
                  const Icon = amenityIcons[a] || Wifi
                  return (
                    <span key={a} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-cream-100/5 border border-cream-100/10 text-cream-300">
                      <Icon className="w-3 h-3 text-red-400" /> {a}
                    </span>
                  )
                })}
              </div>
            )}

            <div className="flex items-end justify-between pt-3 border-t border-cream-100/5">
              <div>
                <p className="text-xs text-cream-400">Per night</p>
                <p className="text-xl font-display font-bold text-cream-100">${hotel.pricePerNight}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-cream-400">Total stay</p>
                <p className="text-lg font-display font-bold text-red-300">${hotel.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
