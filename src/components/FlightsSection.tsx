import { Plane, Clock, DollarSign, Building2, DoorOpen, Coffee, ShoppingBag } from 'lucide-react'
import type { FlightSegment, AirportInfo } from '../types'
import { AIRPORT_IMAGE, AIRPORT_IMAGE_2 } from '../lib/imageData'

interface FlightCardProps {
  flight: FlightSegment
  label: string
}

export function FlightCard({ flight, label }: FlightCardProps) {
  return (
    <div className="glass-card overflow-hidden hover:border-red-500/30 transition-all duration-300">
      <div className="h-28 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/1493756/pexels-photo-1493756.jpeg?auto=compress&cs=tinysrgb&h=200&w=600" alt="Flight" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
            <Plane className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-cream-300">{label}</p>
            <p className="text-sm font-semibold text-cream-100">{flight.airline}</p>
          </div>
        </div>
        <div className="absolute top-3 right-4">
          <p className="text-xs text-cream-400">Flight</p>
          <p className="text-sm font-mono font-semibold text-red-300">{flight.airlineCode}{flight.flightNumber}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-cream-100">{flight.departureCode}</p>
            <p className="text-xs text-cream-400 mt-0.5">{flight.departureTime}</p>
            <p className="text-xs text-cream-500 mt-1">T{flight.departureTerminal} · {flight.departureGate}</p>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs text-cream-400 mb-1">{flight.duration}</p>
            <div className="relative w-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/40 to-red-500/40" />
              <Plane className="w-4 h-4 text-red-400 absolute left-1/2 -translate-x-1/2 -translate-y-2" />
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <p className="text-xs text-cream-400 mt-1">
              {flight.stops === 0 ? 'Nonstop' : `1 stop · ${flight.layoverCity}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-display font-bold text-cream-100">{flight.arrivalCode}</p>
            <p className="text-xs text-cream-400 mt-0.5">{flight.arrivalTime}</p>
            <p className="text-xs text-cream-500 mt-1">T{flight.arrivalTerminal} · {flight.arrivalGate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100/5">
          <span className="text-xs text-cream-400">{flight.aircraft}</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-red-400">
            <DollarSign className="w-3.5 h-3.5" />{flight.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

interface AirportCardProps {
  airport: AirportInfo
  title: string
  image: string
}

export function AirportCard({ airport, title, image }: AirportCardProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="h-32 relative overflow-hidden">
        <img src={image} alt={airport.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/60 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-xs text-cream-400">{title}</p>
            <h3 className="font-display font-semibold text-cream-100">{airport.name}</h3>
          </div>
        </div>
        <div className="absolute top-3 right-4 px-3 py-1 rounded-full bg-navy-900/70 backdrop-blur-sm">
          <span className="text-sm font-display font-bold text-red-300">{airport.code}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-cream-100/5 rounded-xl p-3">
            <p className="text-xs text-cream-400">Security Wait</p>
            <p className="text-lg font-display font-bold text-red-400">{airport.securityWaitTime}</p>
          </div>
          <div className="bg-cream-100/5 rounded-xl p-3">
            <p className="text-xs text-cream-400">Terminals</p>
            <p className="text-lg font-display font-bold text-cream-100">{airport.terminals.length}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cream-400 mb-2">Terminals</p>
          <div className="space-y-2">
            {airport.terminals.map((t) => (
              <div key={t.name} className="flex items-center justify-between bg-cream-100/5 rounded-lg px-3 py-2">
                <span className="text-sm text-cream-200">{t.name}</span>
                <div className="flex gap-3 text-xs text-cream-400">
                  <span className="flex items-center gap-1"><DoorOpen className="w-3 h-3" />{t.gates}g</span>
                  <span className="flex items-center gap-1"><Coffee className="w-3 h-3" />{t.restaurants}</span>
                  <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" />{t.shops}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cream-400 mb-2">Lounges</p>
          <div className="space-y-2">
            {airport.lounges.map((l) => (
              <div key={l.name} className="bg-cream-100/5 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cream-100">{l.name}</span>
                  <span className="text-xs text-red-400">★ {l.rating}</span>
                </div>
                <p className="text-xs text-cream-400 mt-0.5">{l.location}</p>
                <p className="text-xs text-red-400/70 mt-0.5">{l.access}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cream-400 mb-2">Services</p>
          <div className="flex flex-wrap gap-1.5">
            {airport.services.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FlightsSectionProps {
  flights: FlightSegment[]
  returnFlights: FlightSegment[]
  airport: AirportInfo
  destinationAirport: AirportInfo
}

export default function FlightsSection({ flights, returnFlights, airport, destinationAirport }: FlightsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flights.map((f, i) => (
          <FlightCard key={i} flight={f} label={i === 0 ? 'Outbound · Recommended' : 'Outbound · Alternative'} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {returnFlights.map((f, i) => (
          <FlightCard key={i} flight={f} label={i === 0 ? 'Return · Recommended' : 'Return · Alternative'} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AirportCard airport={airport} title="Departure Airport" image={AIRPORT_IMAGE} />
        <AirportCard airport={destinationAirport} title="Arrival Airport" image={AIRPORT_IMAGE_2} />
      </div>
    </div>
  )
}
