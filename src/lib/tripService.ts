import { apiFetch } from './api'
import type { Itinerary, TripInput, Hotel, Restaurant, Attraction, DayPlan, BudgetBreakdown, TripScore } from '../types'
import { getHotelImage, getRestaurantImage, getAttractionImage, getCityImage } from './imageData'

interface BackendResponse {
  flights: any[]
  returnFlights: any[]
  airport: any
  destinationAirport: any
  hotels: Hotel[]
  restaurants: Restaurant[]
  attractions: Attraction[]
  events: any[]
  transport: { type: string; description: string; price: number }[]
  dataSources: Record<string, 'real' | 'unavailable' | 'estimated'>
}

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  const data = await apiFetch<BackendResponse>('/api/trips/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  // Add fallback images (decorative stock photos — not venue-specific)
  const hotels = (data.hotels || []).map((h, i) => ({ ...h, image: h.image || getHotelImage(i) }))
  const restaurants = (data.restaurants || []).map((r, i) => ({ ...r, image: r.image || getRestaurantImage(i) }))
  const attractions = (data.attractions || []).map((a, i) => ({ ...a, image: a.image || getAttractionImage(i) }))

  // Compute budget from real data
  const nights = Math.max(1, Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / 86400000))
  const flightCost = data.flights[0]?.price || 0
  const hotelCost = hotels[0]?.totalPrice || 120 * nights * input.travelers
  const food = 65 * nights * input.travelers
  const attractionCost = attractions.reduce((s, a) => s + (a.price || 0), 0) || 45 * nights * input.travelers
  const transportCost = (data.transport || []).reduce((s, t) => s + t.price, 0)
  const misc = 30 * nights * input.travelers
  const total = flightCost + hotelCost + food + attractionCost + transportCost + misc

  const budget: BudgetBreakdown = {
    flights: flightCost, hotels: hotelCost, food, attractions: attractionCost,
    transport: transportCost, misc, total, budget: input.budget,
    remaining: input.budget - total,
    savings: Math.max(0, Math.floor(total * 0.12)),
    savingsTips: [
      `Book flights on a Tuesday — potential savings up to $${Math.floor(flightCost * 0.15)}.`,
      `Use public transit passes instead of taxis — save ~$${Math.floor(transportCost * 0.4)}.`,
      `Eat at local markets for lunch — save ~$${Math.floor(food * 0.2)} over the trip.`,
      `Look for free walking tours and museum discount days — save ~$${Math.floor(attractionCost * 0.3)}.`,
    ],
  }

  // Compute trip score from real data
  const budgetRatio = budget.budget > 0 ? Math.min(1, budget.budget / budget.total) : 0.5
  const priceScore = Math.floor(budgetRatio * 100)
  const convenienceScore = Math.max(60, Math.min(98, 100 - (data.flights[0]?.stops || 0) * 20))
  const timingScore = 85
  const experienceScore = Math.min(98, 70 + attractions.length * 3 + restaurants.length * 2)
  const overall = Math.floor((priceScore + convenienceScore + timingScore + experienceScore) / 4)
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B+' : overall >= 60 ? 'B' : 'C+'

  const score: TripScore = {
    overall, price: priceScore, convenience: convenienceScore, timing: timingScore,
    experiences: experienceScore, grade,
    summary: `${grade} trip — ${data.flights[0]?.stops === 0 ? 'nonstop' : (data.flights[0]?.stops || 0) + '-stop'} flights, ${budget.remaining >= 0 ? 'under budget' : 'over budget'}, ${attractions.length} attractions and ${restaurants.length} restaurants found.`,
  }

  // Generate day plans from real venues
  const dayPlans = generateDayPlans(input, attractions, restaurants, Math.round((food + attractionCost + transportCost + misc) / nights))

  return {
    flights: data.flights, returnFlights: data.returnFlights,
    airport: data.airport, destinationAirport: data.destinationAirport,
    hotels, restaurants, attractions,
    events: [],
    transport: data.transport || [],
    dayPlans, budget, score,
    dataSources: data.dataSources || {},
  }
}

function generateDayPlans(input: TripInput, attractions: Attraction[], restaurants: Restaurant[], dailyCost: number): DayPlan[] {
  const nights = Math.max(1, Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / 86400000))
  const plans: DayPlan[] = []
  const nA = Math.max(attractions.length, 1)
  const nR = Math.max(restaurants.length, 1)

  for (let i = 0; i < nights; i++) {
    const date = new Date(input.departureDate)
    date.setDate(date.getDate() + i)
    plans.push({
      day: i + 1,
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      title: i === 0 ? 'Arrival & First Impressions' : i === nights - 1 ? 'Final Exploration & Departure' : `Day ${i + 1} Adventure`,
      morning: `Visit: ${attractions[i % nA]?.name || 'Free exploration time'}`,
      afternoon: `Lunch at: ${restaurants[i % nR]?.name || 'Explore local dining options'}`,
      evening: `Explore: ${attractions[(i + 1) % nA]?.name || 'Evening at leisure'}`,
      estimatedCost: dailyCost * input.travelers,
      image: getCityImage(input.destinationCity),
    })
  }
  return plans
}
