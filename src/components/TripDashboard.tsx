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
import { getCityImageLarge } from '../lib/imageData'

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
  const heroImage = getCityImageLarge(input.destinationCity)

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

        <div className="glass-card overflow-hidden mb-6">
          <div className="h-48 sm:h-64 relative overflow-hidden">
            <img src={heroImage} alt={input.destinationCity} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="section-label">Your Trip</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-xs font-semibold text-emerald-400">AI Planned</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream-100">
                {input.departureCity} <span className="text-red-400">→</span> {input.destinationCity}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-cream-300">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-400" /> {new Date(input.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(input.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-red-400" /> {input.travelers} {input.travelers === 1 ? 'traveler' : 'travelers'}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-red-400" /> ${input.budget.toLocaleString()} budget</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-red-400" /> {nights} {nights === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {input.preferences.map((p) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">{p}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-navy-900/70 backdrop-blur-md border border-red-500/20">
              <p className="text-xs text-cream-400 mb-1">Trip Score</p>
              <p className="text-3xl font-display font-bold text-red-400">{itinerary.score.overall}</p>
              <p className="text-xs text-cream-300 font-semibold mt-0.5">Grade {itinerary.score.grade}</p>
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
                    ? 'bg-red-500/20 border border-red-500/40 text-red-300 shadow-lg shadow-red-500/10'
                    : 'bg-cream-100/5 border border-cream-100/10 text-cream-400 hover:bg-cream-100/10 hover:text-cream-200'
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
        <div className="glass-card overflow-hidden">
          <div className="h-28 relative overflow-hidden">
            <img src="https://images.pexels.com/photos/1493756/pexels-photo-1493756.jpeg?auto=compress&cs=tinysrgb&h=200&w=600" alt="Flight" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-red-400" />
              <h3 className="font-display font-semibold text-cream-100">Flight Summary</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Outbound</span>
              <span className="text-cream-100 font-medium">{itinerary.flights[0].airline} {itinerary.flights[0].airlineCode}{itinerary.flights[0].flightNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Route</span>
              <span className="text-cream-100 font-medium">{itinerary.flights[0].departureCode} → {itinerary.flights[0].arrivalCode}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Duration</span>
              <span className="text-cream-100 font-medium">{itinerary.flights[0].duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Stops</span>
              <span className="text-cream-100 font-medium">{itinerary.flights[0].stops === 0 ? 'Nonstop' : `1 stop in ${itinerary.flights[0].layoverCity}`}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Price</span>
              <span className="text-red-400 font-semibold">${itinerary.flights[0].price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="h-28 relative overflow-hidden">
            <img src={itinerary.hotels[0].image} alt={itinerary.hotels[0].name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-red-400" />
              <h3 className="font-display font-semibold text-cream-100">Top Hotel Pick</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Hotel</span>
              <span className="text-cream-100 font-medium">{itinerary.hotels[0].name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Rating</span>
              <span className="flex items-center gap-1 text-cream-100 font-medium"><Star className="w-3.5 h-3.5 text-red-400 fill-red-400" /> {itinerary.hotels[0].rating}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Neighborhood</span>
              <span className="text-cream-100 font-medium">{itinerary.hotels[0].neighborhood}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Per night</span>
              <span className="text-cream-100 font-medium">${itinerary.hotels[0].pricePerNight}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-400">Total stay</span>
              <span className="text-red-300 font-semibold">${itinerary.hotels[0].totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-red-400" />
            <h3 className="font-display font-semibold text-cream-100">Top Attractions</h3>
          </div>
          <div className="space-y-2">
            {itinerary.attractions.slice(0, 4).map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-cream-100/5 rounded-lg px-3 py-2">
                <div>
                  <span className="text-cream-100 font-medium">{a.name}</span>
                  <span className="text-xs text-cream-400 ml-2">{a.category} · {a.duration}</span>
                </div>
                <span className="text-red-400 font-semibold">${a.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bus className="w-5 h-5 text-red-400" />
            <h3 className="font-display font-semibold text-cream-100">Transportation</h3>
          </div>
          <div className="space-y-2">
            {itinerary.transport.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-cream-100/5 rounded-lg px-3 py-2">
                <div>
                  <span className="text-cream-100 font-medium">{t.type}</span>
                  <p className="text-xs text-cream-400">{t.description}</p>
                </div>
                <span className="text-red-400 font-semibold">${t.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 p-5 pb-3">
          <CalendarDays className="w-5 h-5 text-red-400" />
          <h3 className="font-display font-semibold text-cream-100">Quick Itinerary Preview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-5 pb-5">
          {itinerary.dayPlans.map((d, i) => (
            <div key={i} className="bg-cream-100/5 rounded-xl overflow-hidden">
              <div className="h-20 relative overflow-hidden">
                <img src={d.image} alt={d.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-red-300">{d.day}</span>
                  <div>
                    <p className="text-xs font-medium text-cream-100">{d.title}</p>
                    <p className="text-[10px] text-cream-400">{d.date}</p>
                  </div>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-cream-400 leading-relaxed">{d.morning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 text-center border-red-500/20">
        <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
          <Sparkles className="w-7 h-7 text-cream-100" />
        </div>
        <h3 className="font-display font-semibold text-cream-100 text-lg mb-2">Have questions about your trip?</h3>
        <p className="text-sm text-cream-400 mb-4 max-w-md mx-auto">Aero AI understands your entire itinerary and can answer questions, recommend places, help with directions, and solve travel problems.</p>
        <button onClick={onAskAero} className="btn-primary">
          <Sparkles className="w-4 h-4" /> Ask Aero AI
        </button>
      </div>
    </div>
  )
}
