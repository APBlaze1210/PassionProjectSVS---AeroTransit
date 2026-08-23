import { useState } from 'react'
import { MapPin, Calendar, Users, DollarSign, Plane, Sparkles, Loader as Loader2, Compass, Utensils, Mountain, Building2, Music, ShoppingBag, Waves } from 'lucide-react'
import type { TripInput } from '../types'

interface TripPlannerFormProps {
  onGenerate: (input: TripInput) => void
  loading: boolean
}

const PREFERENCE_OPTIONS = [
  { label: 'Adventure', icon: Mountain },
  { label: 'Food', icon: Utensils },
  { label: 'Culture', icon: Building2 },
  { label: 'Relaxation', icon: Waves },
  { label: 'Nightlife', icon: Music },
  { label: 'Shopping', icon: ShoppingBag },
]

const CITIES = ['New York', 'Los Angeles', 'London', 'Tokyo', 'Paris', 'Dubai']

export default function TripPlannerForm({ onGenerate, loading }: TripPlannerFormProps) {
  const [departureCity, setDepartureCity] = useState('New York')
  const [destinationCity, setDestinationCity] = useState('Tokyo')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState(5000)
  const [preferences, setPreferences] = useState<string[]>(['Adventure', 'Food', 'Culture'])

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      departureCity,
      destinationCity,
      departureDate: departureDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      returnDate: returnDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      travelers,
      budget,
      preferences,
    })
  }

  return (
    <section id="planner" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-aero-500/10 border border-aero-400/20 mb-4">
            <Compass className="w-4 h-4 text-aero-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-aero-400">Trip Planner</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Plan Your Perfect Trip</h2>
          <p className="text-slate-400">Fill in the details below and let Aero AI build your personalized itinerary.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1.5 text-aero-400" /> Departure City
              </label>
              <select value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} className="input-field">
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1.5 text-accent-400" /> Destination
              </label>
              <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} className="input-field">
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5 text-aero-400" /> Departure Date
              </label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5 text-aero-400" /> Return Date
              </label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Users className="w-4 h-4 inline mr-1.5 text-aero-400" /> Travelers
              </label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-lg font-bold transition-all">−</button>
                <span className="text-xl font-semibold text-white w-8 text-center">{travelers}</span>
                <button type="button" onClick={() => setTravelers(Math.min(10, travelers + 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-lg font-bold transition-all">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1.5 text-aero-400" /> Budget (USD)
              </label>
              <input type="range" min="1000" max="20000" step="500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-aero-400" />
              <div className="flex justify-between text-sm text-slate-400 mt-1">
                <span>$1,000</span>
                <span className="text-aero-400 font-semibold text-lg">${budget.toLocaleString()}</span>
                <span>$20,000</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <Sparkles className="w-4 h-4 inline mr-1.5 text-aero-400" /> Travel Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map((p) => {
                const active = preferences.includes(p.label)
                const Icon = p.icon
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => togglePreference(p.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                      active
                        ? 'bg-aero-500/20 border-aero-400/50 text-aero-300 shadow-lg shadow-aero-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Aero AI is planning your trip...
              </>
            ) : (
              <>
                <Plane className="w-5 h-5" />
                Build My Trip
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
