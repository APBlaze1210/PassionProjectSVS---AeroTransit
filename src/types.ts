export interface TripInput {
  departureCity: string
  destinationCity: string
  departureDate: string
  returnDate: string
  travelers: number
  budget: number
  preferences: string[]
}

export interface FlightSegment {
  airline: string
  airlineCode: string
  flightNumber: string
  aircraft: string
  departureAirport: string
  departureCode: string
  departureTerminal: string
  departureGate: string
  departureTime: string
  arrivalAirport: string
  arrivalCode: string
  arrivalTerminal: string
  arrivalGate: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  layoverCity?: string
  layoverDuration?: string
}

export interface AirportInfo {
  name: string
  code: string
  terminals: TerminalInfo[]
  securityWaitTime: string
  lounges: LoungeInfo[]
  services: string[]
}

export interface TerminalInfo {
  name: string
  gates: number
  restaurants: number
  shops: number
}

export interface LoungeInfo {
  name: string
  location: string
  access: string
  rating: number
}

export interface Hotel {
  name: string
  rating: number
  pricePerNight: number
  totalPrice: number
  neighborhood: string
  amenities: string[]
  image: string
  description: string
}

export interface Restaurant {
  name: string
  cuisine: string
  priceRange: string
  rating: number
  neighborhood: string
  mealType: string
  description: string
  image: string
}

export interface Attraction {
  name: string
  category: string
  rating: number
  price: number
  duration: string
  description: string
  image: string
}

export interface DayPlan {
  day: number
  date: string
  title: string
  morning: string
  afternoon: string
  evening: string
  estimatedCost: number
  image: string
}

export interface BudgetBreakdown {
  flights: number
  hotels: number
  food: number
  attractions: number
  transport: number
  misc: number
  total: number
  budget: number
  remaining: number
  savings: number
  savingsTips: string[]
}

export interface TripScore {
  overall: number
  price: number
  convenience: number
  timing: number
  experiences: number
  grade: string
  summary: string
}

export interface Itinerary {
  flights: FlightSegment[]
  returnFlights: FlightSegment[]
  airport: AirportInfo
  destinationAirport: AirportInfo
  hotels: Hotel[]
  restaurants: Restaurant[]
  attractions: Attraction[]
  events: { name: string; type: string; date: string; description: string; image: string }[]
  transport: { type: string; description: string; price: number }[]
  dayPlans: DayPlan[]
  budget: BudgetBreakdown
  score: TripScore
}

export interface SavedTrip {
  id: string
  departure_city: string
  destination_city: string
  departure_date: string
  return_date: string
  travelers: number
  budget: number
  preferences: Record<string, boolean>
  itinerary_data: Itinerary
  created_at: string
}
