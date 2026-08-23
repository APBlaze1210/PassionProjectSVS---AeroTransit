import type {
  Itinerary,
  TripInput,
  FlightSegment,
  AirportInfo,
  Hotel,
  Restaurant,
  Attraction,
  DayPlan,
  BudgetBreakdown,
  TripScore,
} from '../types'
import { getHotelImage, getRestaurantImage, getAttractionImage, getEventImage, getCityImage } from './imageData'

const AIRPORTS: Record<string, { name: string; code: string; terminals: { name: string; gates: number; restaurants: number; shops: number }[]; lounges: { name: string; location: string; access: string; rating: number }[]; services: string[] }> = {
  'New York': {
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    terminals: [
      { name: 'Terminal 1', gates: 11, restaurants: 14, shops: 8 },
      { name: 'Terminal 4', gates: 38, restaurants: 42, shops: 35 },
      { name: 'Terminal 5', gates: 29, restaurants: 31, shops: 24 },
      { name: 'Terminal 7', gates: 12, restaurants: 10, shops: 7 },
      { name: 'Terminal 8', gates: 29, restaurants: 22, shops: 18 },
    ],
    lounges: [
      { name: 'Delta Sky Club', location: 'Terminal 4, Concourse B', access: 'Delta One / SkyTeam Elite', rating: 4.5 },
      { name: 'American Admirals Club', location: 'Terminal 8, Concourse C', access: 'AA First / Oneworld Sapphire', rating: 4.2 },
      { name: 'The Lounge JFK', location: 'Terminal 4, Concourse A', access: 'Priority Pass / LoungeKey', rating: 4.0 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'Luggage Storage', 'Pet Relief Areas', 'Nursing Rooms', 'Charging Stations', 'Spa Services', 'Duty-Free Shopping'],
  },
  'Los Angeles': {
    name: 'Los Angeles International Airport',
    code: 'LAX',
    terminals: [
      { name: 'Terminal 1', gates: 15, restaurants: 12, shops: 9 },
      { name: 'Terminal 2', gates: 18, restaurants: 14, shops: 10 },
      { name: 'Terminal 3', gates: 23, restaurants: 18, shops: 12 },
      { name: 'Tom Bradley International', gates: 28, restaurants: 45, shops: 40 },
      { name: 'Terminal 5', gates: 14, restaurants: 11, shops: 8 },
      { name: 'Terminal 6', gates: 16, restaurants: 13, shops: 10 },
      { name: 'Terminal 7', gates: 13, restaurants: 10, shops: 7 },
      { name: 'Terminal 8', gates: 8, restaurants: 6, shops: 4 },
    ],
    lounges: [
      { name: 'Star Alliance Gold Lounge', location: 'Tom Bradley International', access: 'Star Alliance Gold', rating: 4.3 },
      { name: 'Oneworld Lounge', location: 'Tom Bradley International', access: 'Oneworld Sapphire / Emerald', rating: 4.4 },
      { name: 'Delta Sky Club', location: 'Terminal 3', access: 'Delta One / SkyTeam Elite', rating: 4.1 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'LAX FlyAway Bus', 'Pet Relief Areas', 'Nursing Rooms', 'Charging Stations', 'Art Exhibitions', 'Duty-Free Shopping'],
  },
  'London': {
    name: 'Heathrow Airport',
    code: 'LHR',
    terminals: [
      { name: 'Terminal 2 (The Queen\'s Terminal)', gates: 40, restaurants: 38, shops: 32 },
      { name: 'Terminal 3', gates: 34, restaurants: 30, shops: 28 },
      { name: 'Terminal 4', gates: 22, restaurants: 18, shops: 16 },
      { name: 'Terminal 5', gates: 65, restaurants: 55, shops: 50 },
    ],
    lounges: [
      { name: 'British Airways Galleries Club', location: 'Terminal 5, Concourse A', access: 'BA Gold / Oneworld Sapphire', rating: 4.6 },
      { name: 'United Club', location: 'Terminal 2, Concourse B', access: 'United Club Card / Star Alliance Gold', rating: 4.2 },
      { name: 'Plaza Premium Lounge', location: 'Terminal 4, Gate 22', access: 'Priority Pass / Pay-in', rating: 4.0 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'Left Luggage', 'Showers', 'Nursing Rooms', 'Charging Stations', 'Spa & Wellness', 'Duty-Free Shopping'],
  },
  'Tokyo': {
    name: 'Narita International Airport',
    code: 'NRT',
    terminals: [
      { name: 'Terminal 1', gates: 46, restaurants: 40, shops: 35 },
      { name: 'Terminal 2', gates: 40, restaurants: 38, shops: 32 },
      { name: 'Terminal 3', gates: 12, restaurants: 8, shops: 6 },
    ],
    lounges: [
      { name: 'ANA Suite Lounge', location: 'Terminal 1, South Wing', access: 'ANA First / Star Alliance Gold', rating: 4.8 },
      { name: 'JAL Sakura Lounge', location: 'Terminal 2, Main Building', access: 'JAL First / Oneworld Emerald', rating: 4.7 },
      { name: 'IASS Executive Lounge', location: 'Terminal 1, Central Building', access: 'Pay-in / Priority Pass', rating: 3.8 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'Coin Lockers', 'Shower Rooms', 'Nursing Rooms', 'Charging Stations', 'Meditation Room', 'Duty-Free Shopping'],
  },
  'Paris': {
    name: 'Charles de Gaulle Airport',
    code: 'CDG',
    terminals: [
      { name: 'Terminal 1', gates: 33, restaurants: 20, shops: 18 },
      { name: 'Terminal 2A', gates: 18, restaurants: 12, shops: 10 },
      { name: 'Terminal 2B', gates: 16, restaurants: 11, shops: 9 },
      { name: 'Terminal 2C', gates: 22, restaurants: 15, shops: 13 },
      { name: 'Terminal 2D', gates: 20, restaurants: 14, shops: 12 },
      { name: 'Terminal 2E', gates: 42, restaurants: 35, shops: 30 },
      { name: 'Terminal 2F', gates: 38, restaurants: 30, shops: 25 },
      { name: 'Terminal 3', gates: 10, restaurants: 6, shops: 5 },
    ],
    lounges: [
      { name: 'Air France La Première Lounge', location: 'Terminal 2E, Hall K', access: 'Air France La Première', rating: 4.9 },
      { name: 'Air France Lounge', location: 'Terminal 2E, Hall L', access: 'Air France Business / SkyTeam Elite', rating: 4.3 },
      { name: 'Extime Lounge', location: 'Terminal 2E, Hall M', access: 'Pay-in / Priority Pass', rating: 4.0 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'Left Luggage', 'Showers', 'Nursing Rooms', 'Charging Stations', 'Art Gallery', 'Duty-Free Shopping'],
  },
  'Dubai': {
    name: 'Dubai International Airport',
    code: 'DXB',
    terminals: [
      { name: 'Terminal 1', gates: 26, restaurants: 30, shops: 28 },
      { name: 'Terminal 2', gates: 22, restaurants: 18, shops: 15 },
      { name: 'Terminal 3', gates: 65, restaurants: 60, shops: 55 },
    ],
    lounges: [
      { name: 'Emirates First Class Lounge', location: 'Terminal 3, Concourse A', access: 'Emirates First Class', rating: 4.9 },
      { name: 'Emirates Business Class Lounge', location: 'Terminal 3, Concourse B', access: 'Emirates Business / Skywards Gold', rating: 4.7 },
      { name: 'Marhaba Lounge', location: 'Terminal 3, Concourse C', access: 'Pay-in / Priority Pass', rating: 4.1 },
    ],
    services: ['Free WiFi', 'Currency Exchange', 'Sleep Pods', 'Showers', 'Swimming Pool', 'Gym', 'Nursing Rooms', 'Duty-Free Shopping', 'Gardens'],
  },
}

const DEFAULT_AIRPORT = {
  name: 'International Airport',
  code: 'INTL',
  terminals: [
    { name: 'Terminal A', gates: 20, restaurants: 15, shops: 12 },
    { name: 'Terminal B', gates: 18, restaurants: 14, shops: 10 },
    { name: 'Terminal C', gates: 24, restaurants: 20, shops: 16 },
  ],
  lounges: [
    { name: 'Premium Lounge', location: 'Terminal A, Gate 12', access: 'Priority Pass / Business Class', rating: 4.2 },
    { name: 'Sky Lounge', location: 'Terminal B, Gate 8', access: 'Airline Elite Status', rating: 4.0 },
    { name: 'Club Lounge', location: 'Terminal C, Gate 15', access: 'Pay-in / Day Pass', rating: 3.8 },
  ],
  services: ['Free WiFi', 'Currency Exchange', 'Luggage Storage', 'Nursing Rooms', 'Charging Stations', 'Duty-Free Shopping'],
}

const AIRLINES = [
  { name: 'SkyJet Airlines', code: 'SJ', aircraft: 'Boeing 787-9 Dreamliner' },
  { name: 'Global Air', code: 'GA', aircraft: 'Airbus A350-900' },
  { name: 'Pacific Express', code: 'PX', aircraft: 'Boeing 777-300ER' },
  { name: 'Aurora Airways', code: 'AW', aircraft: 'Airbus A380-800' },
  { name: 'Meridian Air', code: 'MA', aircraft: 'Boeing 737 MAX 9' },
  { name: 'Vanguard Airlines', code: 'VG', aircraft: 'Airbus A330-300' },
]

const HOTEL_TEMPLATES: Record<string, { name: string; neighborhood: string; amenities: string[]; description: string }[]> = {
  default: [
    { name: 'The Grand Horizon Hotel', neighborhood: 'City Center', amenities: ['Free WiFi', 'Pool', 'Fitness Center', 'Restaurant', 'Bar', 'Spa'], description: 'A modern luxury hotel in the heart of the city with panoramic views and premium amenities.' },
    { name: 'Boutique Skyline Suites', neighborhood: 'Arts District', amenities: ['Free WiFi', 'Rooftop Bar', 'Restaurant', 'Bike Rental'], description: 'A stylish boutique hotel blending local culture with contemporary design.' },
    { name: 'Riverside Inn & Spa', neighborhood: 'Riverside', amenities: ['Free WiFi', 'Spa', 'Pool', 'Restaurant', 'Garden'], description: 'A serene retreat along the river with full-service spa and farm-to-table dining.' },
    { name: 'Metro Express Hotel', neighborhood: 'Business District', amenities: ['Free WiFi', 'Fitness Center', 'Business Center', '24h Check-in'], description: 'A smart, efficient hotel designed for modern travelers who value convenience.' },
  ],
}

const RESTAURANT_TEMPLATES: Record<string, { name: string; cuisine: string; priceRange: string; mealType: string; description: string }[]> = {
  default: [
    { name: 'Sakura Blossom', cuisine: 'Japanese', priceRange: '$$$', mealType: 'Dinner', description: 'Authentic omakase experience with seasonal sushi and a curated sake list.' },
    { name: 'Trattoria Bella', cuisine: 'Italian', priceRange: '$$', mealType: 'Dinner', description: 'Handmade pasta and wood-fired pizzas in a warm, family-style setting.' },
    { name: 'The Morning Brew', cuisine: 'Café', priceRange: '$', mealType: 'Breakfast', description: 'Artisanal coffee, fresh pastries, and healthy breakfast bowls.' },
    { name: 'Spice Route', cuisine: 'Indian', priceRange: '$$', mealType: 'Lunch', description: 'Regional Indian dishes with vegetarian options and a lunch thali special.' },
    { name: 'Le Petit Marché', cuisine: 'French', priceRange: '$$$', mealType: 'Lunch', description: 'A charming bistro serving classic French cuisine with a modern twist.' },
    { name: 'Verde Garden', cuisine: 'Plant-Based', priceRange: '$$', mealType: 'Dinner', description: 'Innovative plant-based cuisine in a garden setting with seasonal menus.' },
    { name: 'El Fuego Grill', cuisine: 'Mexican', priceRange: '$$', mealType: 'Lunch', description: 'Street tacos, house-made salsas, and craft margaritas in a vibrant space.' },
    { name: 'Harbor Catch', cuisine: 'Seafood', priceRange: '$$$', mealType: 'Dinner', description: 'Fresh, sustainably sourced seafood with harbor views.' },
  ],
}

const ATTRACTION_TEMPLATES: Record<string, { name: string; category: string; duration: string; description: string }[]> = {
  default: [
    { name: 'Historic Old Town Walking Tour', category: 'Culture', duration: '3 hours', description: 'Guided walk through cobblestone streets, historic landmarks, and hidden courtyards.' },
    { name: 'Skyline Observation Deck', category: 'Landmark', duration: '1-2 hours', description: 'Panoramic city views from the tallest tower with interactive exhibits.' },
    { name: 'Central Park Gardens', category: 'Nature', duration: '2 hours', description: 'Stroll through beautifully landscaped gardens with seasonal blooms and sculptures.' },
    { name: 'Modern Art Museum', category: 'Culture', duration: '2-3 hours', description: 'World-class contemporary art collection with rotating exhibitions.' },
    { name: 'Sunset Harbor Cruise', category: 'Adventure', duration: '2 hours', description: 'Scenic boat tour with sunset views, dolphin watching, and refreshments.' },
    { name: 'Food Market Adventure', category: 'Food', duration: '2 hours', description: 'Explore the city\'s best food market with tastings from local vendors.' },
    { name: 'Mountain Hiking Trail', category: 'Adventure', duration: '4-5 hours', description: 'Guided hike with breathtaking summit views and diverse wildlife.' },
    { name: 'Rooftop Cinema Experience', category: 'Entertainment', duration: '3 hours', description: 'Open-air movie screening under the stars with gourmet snacks.' },
  ],
}

function getAirport(city: string): AirportInfo {
  const data = AIRPORTS[city] || DEFAULT_AIRPORT
  return {
    name: data.name,
    code: data.code,
    terminals: data.terminals,
    securityWaitTime: `${Math.floor(Math.random() * 15 + 8)} min`,
    lounges: data.lounges,
    services: data.services,
  }
}

function generateFlights(input: TripInput, isReturn: boolean): FlightSegment[] {
  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)]
  const depAirport = getAirport(input.departureCity)
  const arrAirport = getAirport(input.destinationCity)
  const basePrice = Math.floor(Math.random() * 200 + 180) * input.travelers
  const stops = Math.random() > 0.6 ? 1 : 0
  const layoverCities = ['Chicago', 'Atlanta', 'Frankfurt', 'Singapore', 'Istanbul']
  const layoverCity = stops > 0 ? layoverCities[Math.floor(Math.random() * layoverCities.length)] : undefined

  const hour1 = Math.floor(Math.random() * 12 + 6)
  const hour2 = Math.floor(Math.random() * 12 + 6)
  const depHour = isReturn ? hour2 : hour1
  const arrHour = depHour + Math.floor(Math.random() * 4 + 3)

  const depTime = `${String(depHour % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
  const arrTime = `${String(arrHour % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`

  return [
    {
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${Math.floor(Math.random() * 900 + 100)}`,
      aircraft: airline.aircraft,
      departureAirport: isReturn ? arrAirport.name : depAirport.name,
      departureCode: isReturn ? arrAirport.code : depAirport.code,
      departureTerminal: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      departureGate: `G${Math.floor(Math.random() * 40 + 1)}`,
      departureTime: depTime,
      arrivalAirport: isReturn ? depAirport.name : arrAirport.name,
      arrivalCode: isReturn ? depAirport.code : arrAirport.code,
      arrivalTerminal: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      arrivalGate: `G${Math.floor(Math.random() * 40 + 1)}`,
      arrivalTime: arrTime,
      duration: `${Math.floor(Math.random() * 4 + 3)}h ${Math.floor(Math.random() * 60)}m`,
      price: basePrice,
      stops,
      layoverCity,
      layoverDuration: stops > 0 ? `${Math.floor(Math.random() * 3 + 1)}h ${Math.floor(Math.random() * 60)}m` : undefined,
    },
    {
      airline: AIRLINES[(AIRLINES.indexOf(airline) + 1) % AIRLINES.length].name,
      airlineCode: AIRLINES[(AIRLINES.indexOf(airline) + 1) % AIRLINES.length].code,
      flightNumber: `${AIRLINES[(AIRLINES.indexOf(airline) + 1) % AIRLINES.length].code}${Math.floor(Math.random() * 900 + 100)}`,
      aircraft: AIRLINES[(AIRLINES.indexOf(airline) + 1) % AIRLINES.length].aircraft,
      departureAirport: isReturn ? arrAirport.name : depAirport.name,
      departureCode: isReturn ? arrAirport.code : depAirport.code,
      departureTerminal: `${String.fromCharCode(66 + Math.floor(Math.random() * 4))}`,
      departureGate: `G${Math.floor(Math.random() * 40 + 1)}`,
      departureTime: `${String((depHour + 4) % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalAirport: isReturn ? depAirport.name : arrAirport.name,
      arrivalCode: isReturn ? depAirport.code : arrAirport.code,
      arrivalTerminal: `${String.fromCharCode(66 + Math.floor(Math.random() * 4))}`,
      arrivalGate: `G${Math.floor(Math.random() * 40 + 1)}`,
      arrivalTime: `${String((arrHour + 4) % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      duration: `${Math.floor(Math.random() * 3 + 4)}h ${Math.floor(Math.random() * 60)}m`,
      price: Math.floor(basePrice * 1.25),
      stops: 0,
    },
  ]
}

function generateHotels(input: TripInput): Hotel[] {
  const templates = HOTEL_TEMPLATES.default
  const nights = Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / (1000 * 60 * 60 * 24))
  return templates.map((t, i) => {
    const pricePerNight = Math.floor(Math.random() * 120 + 80) + i * 40
    return {
      name: t.name,
      rating: Number((Math.random() * 1 + 3.8).toFixed(1)),
      pricePerNight,
      totalPrice: pricePerNight * nights,
      neighborhood: t.neighborhood,
      amenities: t.amenities,
      image: getHotelImage(i),
      description: t.description,
    }
  })
}

function generateRestaurants(): Restaurant[] {
  return RESTAURANT_TEMPLATES.default.map((r, i) => ({
    name: r.name,
    cuisine: r.cuisine,
    priceRange: r.priceRange,
    rating: Number((Math.random() * 1 + 4.0).toFixed(1)),
    neighborhood: ['City Center', 'Arts District', 'Riverside', 'Old Town'][Math.floor(Math.random() * 4)],
    mealType: r.mealType,
    description: r.description,
    image: getRestaurantImage(i),
  }))
}

function generateAttractions(input: TripInput): Attraction[] {
  return ATTRACTION_TEMPLATES.default.map((a, i) => ({
    name: a.name,
    category: a.category,
    rating: Number((Math.random() * 0.8 + 4.1).toFixed(1)),
    price: Math.floor(Math.random() * 40 + 10) * input.travelers,
    duration: a.duration,
    description: a.description,
    image: getAttractionImage(i),
  }))
}

function generateDayPlans(input: TripInput): DayPlan[] {
  const nights = Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / (1000 * 60 * 60 * 24))
  const days = Math.max(nights, 1)
  const plans: DayPlan[] = []
  const morningActs = ['Guided city walking tour', 'Visit to the historic quarter', 'Museum visit', 'Local market exploration', 'Scenic park stroll', 'Sunrise photography walk']
  const afternoonActs = ['Food tour of local markets', 'Boat cruise with sightseeing', 'Art gallery hop', 'Adventure activity (zip-lining / kayaking)', 'Shopping at boutique districts', 'Wellness spa session']
  const eveningActs = ['Sunset dinner at rooftop restaurant', 'Live music at a local jazz bar', 'Theater performance', 'Night market food adventure', 'Stargazing experience', 'Cultural show and dinner']

  for (let i = 0; i < days; i++) {
    const date = new Date(input.departureDate)
    date.setDate(date.getDate() + i)
    plans.push({
      day: i + 1,
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      title: i === 0 ? 'Arrival & First Impressions' : i === days - 1 ? 'Final Exploration & Departure' : `Day ${i + 1} Adventure`,
      morning: morningActs[i % morningActs.length],
      afternoon: afternoonActs[i % afternoonActs.length],
      evening: eveningActs[i % eveningActs.length],
      estimatedCost: Math.floor(Math.random() * 80 + 60) * input.travelers,
      image: getCityImage(input.destinationCity),
    })
  }
  return plans
}

function generateBudget(input: TripInput, flights: FlightSegment[]): BudgetBreakdown {
  const flightCost = flights[0].price
  const nights = Math.ceil((new Date(input.returnDate).getTime() - new Date(input.departureDate).getTime()) / (1000 * 60 * 60 * 24))
  const hotels = 120 * nights * input.travelers
  const food = 65 * nights * input.travelers
  const attractions = 45 * nights * input.travelers
  const transport = 25 * nights * input.travelers
  const misc = 30 * nights * input.travelers
  const total = flightCost + hotels + food + attractions + transport + misc
  const remaining = input.budget - total
  const savings = Math.max(0, Math.floor(total * 0.12))

  return {
    flights: flightCost,
    hotels,
    food,
    attractions,
    transport,
    misc,
    total,
    budget: input.budget,
    remaining,
    savings,
    savingsTips: [
      `Book flights on a Tuesday — save up to $${Math.floor(flightCost * 0.15)} on this route.`,
      `Use public transit passes instead of taxis — save ~$${transport * 0.4}.`,
      `Eat at local markets for lunch — save ~$${Math.floor(food * 0.2)} over the trip.`,
      `Look for free walking tours and museum discount days — save ~$${Math.floor(attractions * 0.3)}.`,
    ],
  }
}

function generateTripScore(input: TripInput, budget: BudgetBreakdown, flights: FlightSegment[]): TripScore {
  const budgetRatio = budget.budget > 0 ? Math.min(1, budget.budget / budget.total) : 0.5
  const priceScore = Math.floor(budgetRatio * 100)
  const convenienceScore = Math.floor(100 - flights[0].stops * 20 + Math.random() * 10)
  const timingScore = Math.floor(Math.random() * 15 + 80)
  const experienceScore = Math.floor(Math.random() * 10 + 88)
  const overall = Math.floor((priceScore + convenienceScore + timingScore + experienceScore) / 4)
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B+' : overall >= 60 ? 'B' : 'C+'

  return {
    overall,
    price: priceScore,
    convenience: Math.max(60, Math.min(98, convenienceScore)),
    timing: timingScore,
    experiences: experienceScore,
    grade,
    summary: `${grade} trip — great value with ${flights[0].stops === 0 ? 'nonstop' : '1-stop'} flights, ${budget.remaining >= 0 ? 'under budget' : 'slightly over budget'}, and ${input.preferences.length} preference matches.`,
  }
}

export function generateItinerary(input: TripInput): Itinerary {
  const flights = generateFlights(input, false)
  const returnFlights = generateFlights(input, true)
  const airport = getAirport(input.departureCity)
  const destinationAirport = getAirport(input.destinationCity)
  const hotels = generateHotels(input)
  const restaurants = generateRestaurants()
  const attractions = generateAttractions(input)
  const dayPlans = generateDayPlans(input)
  const budget = generateBudget(input, flights)
  const score = generateTripScore(input, budget, flights)

  return {
    flights,
    returnFlights,
    airport,
    destinationAirport,
    hotels,
    restaurants,
    attractions,
    events: [
      { name: 'Summer Music Festival', type: 'Music', date: input.departureDate, description: 'Three-day outdoor music festival featuring international and local artists.', image: getEventImage(0) },
      { name: 'Food & Wine Expo', type: 'Food', date: input.departureDate, description: 'Annual culinary showcase with tastings, cooking demos, and wine pairings.', image: getEventImage(1) },
      { name: 'Night Light Parade', type: 'Culture', date: input.returnDate, description: 'Spectacular illuminated parade through the city center with performances.', image: getEventImage(2) },
    ],
    transport: [
      { type: 'Airport Transfer', description: 'Private car service from airport to hotel', price: 45 * input.travelers },
      { type: 'City Metro Pass', description: 'Unlimited daily public transit', price: 12 * input.travelers },
      { type: 'Bike Rental', description: 'Full-day electric bike rental', price: 28 * input.travelers },
      { type: 'Ride Share', description: 'Estimated rideshare costs per day', price: 20 * input.travelers },
    ],
    dayPlans,
    budget,
    score,
  }
}
