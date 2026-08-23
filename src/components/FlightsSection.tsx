import { Plane, ArrowRight, Clock, DollarSign, Building2, DoorOpen, Coffee, ShoppingBag } from 'lucide-react'
import type { FlightSegment, AirportInfo } from '../types'

interface FlightCardProps {
  flight: FlightSegment
  label: string
}

export function FlightCard({ flight, label }: FlightCardProps) {
  return (
    <div className="glass-card p-5 hover:border-aero-400/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-aero-500/15 flex items-center justify-center">
            <Plane className="w-4 h-4 text-aero-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-white">{flight.airline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Flight</p>
          <p className="text-sm font-mono font-semibold text-aero-300">{flight.airlineCode}{flight.flightNumber}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-white">{flight.departureCode}</p>
          <p className="text-xs text-slate-500 mt-0.5">{flight.departureTime}</p>
          <p className="text-xs text-slate-600 mt-1">T{flight.departureTerminal} · {flight.departureGate}</p>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-1">{flight.duration}</p>
          <div className="relative w-full flex items-center">
            <div className="w-2 h-2 rounded-full bg-aero-400" />
            <div className="flex-1 h-px bg-gradient-to-r from-aero-400/40 to-aero-400/40" />
            <Plane className="w-4 h-4 text-aero-400 absolute left-1/2 -translate-x-1/2 -translate-y-2" />
            <div className="w-2 h-2 rounded-full bg-aero-400" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {flight.stops === 0 ? 'Nonstop' : `1 stop · ${flight.layoverCity}`}
          </p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-display font-bold text-white">{flight.arrivalCode}</p>
          <p className="text-xs text-slate-500 mt-0.5">{flight.arrivalTime}</p>
          <p className="text-xs text-slate-600 mt-1">T{flight.arrivalTerminal} · {flight.arrivalGate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <span className="text-xs text-slate-500">{flight.aircraft}</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-accent-400">
          <DollarSign className="w-3.5 h-3.5" />{flight.price.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

interface AirportCardProps {
  airport: AirportInfo
  title: string
}

export function AirportCard({ airport, title }: AirportCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-aero-400" />
        <h3 className="font-display font-semibold text-white">{title}: {airport.name}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-slate-500">Airport Code</p>
          <p className="text-lg font-display font-bold text-aero-300">{airport.code}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-slate-500">Security Wait</p>
          <p className="text-lg font-display font-bold text-accent-400">{airport.securityWaitTime}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Terminals</p>
        <div className="space-y-2">
          {airport.terminals.map((t) => (
            <div key={t.name} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sm text-slate-300">{t.name}</span>
              <div className="flex gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><DoorOpen className="w-3 h-3" />{t.gates}g</span>
                <span className="flex items-center gap-1"><Coffee className="w-3 h-3" />{t.restaurants}</span>
                <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" />{t.shops}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Lounges</p>
        <div className="space-y-2">
          {airport.lounges.map((l) => (
            <div key={l.name} className="bg-white/5 rounded-lg px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">{l.name}</span>
                <span className="text-xs text-accent-400">★ {l.rating}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{l.location}</p>
              <p className="text-xs text-aero-400/70 mt-0.5">{l.access}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Services</p>
        <div className="flex flex-wrap gap-1.5">
          {airport.services.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-aero-500/10 border border-aero-400/20 text-aero-300">{s}</span>
          ))}
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
        <AirportCard airport={airport} title="Departure Airport" />
        <AirportCard airport={destinationAirport} title="Arrival Airport" />
      </div>
    </div>
  )
}
