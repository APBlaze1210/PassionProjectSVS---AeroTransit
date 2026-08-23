import { useState, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TripPlannerForm from './components/TripPlannerForm'
import TripDashboard from './components/TripDashboard'
import AeroAIChat, { AeroAIFloatingButton } from './components/AeroAIChat'
import { generateItinerary } from './lib/tripGenerator'
import { supabase } from './lib/supabase'
import type { Itinerary, TripInput } from './types'

type View = 'landing' | 'planner' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [tripInput, setTripInput] = useState<TripInput | null>(null)
  const [aiOpen, setAiOpen] = useState(false)

  const handleGenerate = useCallback(async (input: TripInput) => {
    setLoading(true)
    const generated = generateItinerary(input)
    setItinerary(generated)
    setTripInput(input)

    try {
      await supabase.from('trips').insert({
        departure_city: input.departureCity,
        destination_city: input.destinationCity,
        departure_date: input.departureDate,
        return_date: input.returnDate,
        travelers: input.travelers,
        budget: input.budget,
        preferences: Object.fromEntries(input.preferences.map((p) => [p, true])),
        itinerary_data: generated as unknown as Record<string, unknown>,
      })
    } catch {
      // Trip still displays even if save fails
    }

    setLoading(false)
    setView('dashboard')
  }, [])

  const handleLogoClick = () => {
    setView('landing')
  }

  const handleDashboardClick = () => {
    if (itinerary) setView('dashboard')
  }

  const handleBuildTrip = () => {
    setView('planner')
    setTimeout(() => {
      document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleBack = () => {
    setView('planner')
    setTimeout(() => {
      document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen">
      <Header
        onLogoClick={handleLogoClick}
        onDashboardClick={handleDashboardClick}
        hasTrip={!!itinerary}
      />

      {view === 'landing' && (
        <>
          <Hero onBuildTrip={handleBuildTrip} />
          <TripPlannerForm onGenerate={handleGenerate} loading={loading} />
        </>
      )}

      {view === 'planner' && (
        <div className="pt-20">
          <TripPlannerForm onGenerate={handleGenerate} loading={loading} />
        </div>
      )}

      {view === 'dashboard' && itinerary && tripInput && (
        <TripDashboard
          itinerary={itinerary}
          input={tripInput}
          onAskAero={() => setAiOpen(true)}
          onBack={handleBack}
        />
      )}

      {itinerary && (
        <AeroAIFloatingButton onClick={() => setAiOpen(true)} />
      )}

      <AeroAIChat
        itinerary={itinerary}
        input={tripInput}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  )
}
