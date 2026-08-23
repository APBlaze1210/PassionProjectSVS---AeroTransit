import { useState } from 'react'
import { Plane, Hotel, Utensils, Camera, CalendarDays, DollarSign, Gauge, MapPin, Users, Calendar, Sparkles, ArrowLeft, Bus, Star } from 'lucide-react'
import type { Itinerary, TripInput } from '../types'
import FlightsSection from './FlightsSection'
import HotelsSection from './HotelsSection'
import RestaurantsSection from './RestaurantsSection'
import AttractionsSection from './AttractionsSection'
import ItinerarySection from './ItinerarySection'
import SmartBudget from './SmartBudget'
import TripScore from './TripScore'

interface TripDashboardProps {
  itinerary: Itinerary
  input: TripInput
  onAskAero: () => void
  onBack: () => void
}

type TabId = 'overview' | 'flights' | 'hotels' | 'restaurants' | 'attractions' | 'itinerary' | 'budget'

const TABS: { id: TabId; label: string; icon: typeof Plane }[] = [
  { id: 'overview', label: 'Overview', icon: MapPin },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'restaurants', label: 'Restaurants', icon: Utensils },
  { id: 'attractions', label: 'Attractions', icon: Camera },
  { id: 'itinerary', label: 'Day-by-Day', icon: CalendarDays },
  { id: 'budget', label: 'Smart Budget', icon: DollarSign },
]

export default function TripDashboard({ itinerary, input, onAskAero, onBack }: TripDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const nights = Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> Plan New Trip
          </button>
          <button onClick={onAskAero} className="btn-primary text-sm">
            <Sparkles className="w-4 h-4" /> Ask Aero AI
          </button>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="section-label">Your Trip</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-xs font-semibold text-emerald-400">AI Planned</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {input.departureCity} <span className="text-aero-400">→</span> {input.destinationCity}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-aero-400" /> {new Date(input.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(input.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-aero-400" /> {input.travelers} {input.travelers === 1 ? 'traveler' : 'travelers'}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-aero-400" /> ${input.budget.toLocaleString()} budget</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-aero-400" /> {nights} {nights === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {input.preferences.map((p) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-aero-500/10 border border-aero-400/20 text-aero-300">{p}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-br from-aero-500/10 to-accent-400/5 border border-aero-400/20">
              <p className="text-xs text-slate-500 mb-1">Trip Score</p>
              <p className="text-4xl font-display font-bold text-gradient">{itinerary.score.overall}</p>
              <p className="text-xs text-accent-400 font-semibold mt-0.5">Grade {itinerary.score.grade}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  active
                    ? 'bg-aero-500/20 border border-aero-400/40 text-aero-300 shadow-lg shadow-aero-500/10'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'overview' && <OverviewTab itinerary={itinerary} input={input} onAskAero={onAskAero} />}
          {activeTab === 'flights' && (
            <FlightsSection
              flights={itinerary.flights}
              returnFlights={itinerary.returnFlights}
              airport={itinerary.airport}
              destinationAirport={itinerary.destinationAirport}
            />
          )}
          {activeTab === 'hotels' && <HotelsSection hotels={itinerary.hotels} />}
          {activeTab === 'restaurants' && <RestaurantsSection restaurants={itinerary.restaurants} />}
          {activeTab === 'attractions' && <AttractionsSection attractions={itinerary.attractions} />}
          {activeTab === 'itinerary' && <ItinerarySection dayPlans={itinerary.dayPlans} />}
          {activeTab === 'budget' && <SmartBudget budget={itinerary.budget} />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ itinerary, input, onAskAero }: { itinerary: Itinerary; input: TripInput; onAskAero: () => void }) {
  return (
    <div className="space-y-6">
      <TripScore score={itinerary.score} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-aero-400" />
            <h3 className="font-display font-semibold text-white">Flight Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Outbound</span>
              <span className="text-white font-medium">{itinerary.flights[0].airline} {itinerary.flights[0].airlineCode}{itinerary.flights[0].flightNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Route</span>
              <span className="text-white font-medium">{itinerary.flights[0].departureCode} → {itinerary.flights[0].arrivalCode}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Duration</span>
              <span className="text-white font-medium">{itinerary.flights[0].duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Stops</span>
              <span className="text-white font-medium">{itinerary.flights[0].stops === 0 ? 'Nonstop' : `1 stop in ${itinerary.flights[0].layoverCity}`}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Price</span>
              <span className="text-accent-400 font-semibold">${itinerary.flights[0].price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="w-5 h-5 text-aero-400" />
            <h3 className="font-display font-semibold text-white">Top Hotel Pick</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Hotel</span>
              <span className="text-white font-medium">{itinerary.hotels[0].name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Rating</span>
              <span className="flex items-center gap-1 text-white font-medium"><Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" /> {itinerary.hotels[0].rating}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Neighborhood</span>
              <span className="text-white font-medium">{itinerary.hotels[0].neighborhood}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Per night</span>
              <span className="text-white font-medium">${itinerary.hotels[0].pricePerNight}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total stay</span>
              <span className="text-aero-300 font-semibold">${itinerary.hotels[0].totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-aero-400" />
            <h3 className="font-display font-semibold text-white">Top Attractions</h3>
          </div>
          <div className="space-y-2">
            {itinerary.attractions.slice(0, 4).map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                <div>
                  <span className="text-white font-medium">{a.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{a.category} · {a.duration}</span>
                </div>
                <span className="text-accent-400 font-semibold">${a.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bus className="w-5 h-5 text-aero-400" />
            <h3 className="font-display font-semibold text-white">Transportation</h3>
          </div>
          <div className="space-y-2">
            {itinerary.transport.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                <div>
                  <span className="text-white font-medium">{t.type}</span>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
                <span className="text-accent-400 font-semibold">${t.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-aero-400" />
          <h3 className="font-display font-semibold text-white">Quick Itinerary Preview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {itinerary.dayPlans.map((d, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-aero-500/15 flex items-center justify-center text-sm font-bold text-aero-300">{d.day}</span>
                <div>
                  <p className="text-sm font-medium text-white">{d.title}</p>
                  <p className="text-xs text-slate-500">{d.date}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{d.morning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 text-center border-aero-400/20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aero-400 to-aero-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-aero-500/30">
          <Sparkles className="w-7 h-7 text-ink-950" />
        </div>
        <h3 className="font-display font-semibold text-white text-lg mb-2">Have questions about your trip?</h3>
        <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">Aero AI understands your entire itinerary and can answer questions, recommend places, help with directions, and solve travel problems.</p>
        <button onClick={onAskAero} className="btn-primary">
          <Sparkles className="w-4 h-4" /> Ask Aero AI
        </button>
      </div>
    </div>
  )
}
