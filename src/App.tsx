import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TripPlannerForm from './components/TripPlannerForm'
import TripDashboard from './components/TripDashboard'
import AeroAIChat, { AeroAIFloatingButton } from './components/AeroAIChat'
import AuthModal from './components/AuthModal'
import { AuthProvider, useAuth } from './lib/auth'
import { generateItinerary } from './lib/tripService'
import { apiFetch } from './lib/api'
import type { Itinerary, TripInput } from './types'

type View = 'landing' | 'planner' | 'dashboard'

const LOCAL_TRIP_KEY = 'aero-transit:current-trip'

type LocalTrip = { itinerary: Itinerary; tripInput: TripInput }

function getSavedTrip(): LocalTrip | null {
  try {
    const savedTrip = localStorage.getItem(LOCAL_TRIP_KEY)
    if (!savedTrip) return null
    const parsedTrip = JSON.parse(savedTrip) as LocalTrip
    return parsedTrip.itinerary && parsedTrip.tripInput ? parsedTrip : null
  } catch {
    return null
  }
}

function AppContent() {
  const { user } = useAuth()
  const [savedTrip] = useState(getSavedTrip)
  const [view, setView] = useState<View>(savedTrip ? 'dashboard' : 'landing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itinerary, setItinerary] = useState<Itinerary | null>(savedTrip?.itinerary ?? null)
  const [tripInput, setTripInput] = useState<TripInput | null>(savedTrip?.tripInput ?? null)
  const [aiOpen, setAiOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if (!itinerary || !tripInput) return
    try {
      localStorage.setItem(LOCAL_TRIP_KEY, JSON.stringify({ itinerary, tripInput }))
    } catch { /* storage unavailable */ }
  }, [itinerary, tripInput])

  const handleGenerate = useCallback(async (input: TripInput) => {
    setLoading(true)
    setError('')
    try {
      const generated = await generateItinerary(input)
      setItinerary(generated)
      setTripInput(input)

      if (user) {
        try {
          await apiFetch('/api/user/trips', {
            method: 'POST',
            body: JSON.stringify({ tripData: { itinerary: generated, tripInput: input } }),
          })
        } catch { /* save failure shouldn't block the trip */ }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate trip. Is the backend running?')
    } finally {
      setLoading(false)
    }
    setView('dashboard')
  }, [user])

  const handleLogoClick = () => setView('landing')
  const handleDashboardClick = () => { if (itinerary) setView('dashboard') }
  const handleBuildTrip = () => {
    setView('planner')
    setTimeout(() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }
  const handleBack = () => {
    setView('planner')
    setTimeout(() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="min-h-screen">
      <Header
        onLogoClick={handleLogoClick}
        onDashboardClick={handleDashboardClick}
        hasTrip={!!itinerary}
        onLoginClick={() => setAuthModalOpen(true)}
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

      {error && view !== 'dashboard' && (
        <div className="max-w-3xl mx-auto px-4 -mt-4 mb-4">
          <div className="glass-card p-4 border-rose-500/30">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
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

      {itinerary && <AeroAIFloatingButton onClick={() => setAiOpen(true)} />}

      <AeroAIChat
        itinerary={itinerary}
        input={tripInput}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
