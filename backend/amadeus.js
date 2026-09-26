const BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com'

let tokenCache = { token: null, expires: 0 }

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expires) return tokenCache.token
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error('Amadeus credentials not configured')
  }
  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
  })
  if (!res.ok) throw new Error(`Amadeus auth failed: ${await res.text()}`)
  const data = await res.json()
  tokenCache = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 }
  return tokenCache.token
}

async function amadeusGet(path, params = {}) {
  const token = await getToken()
  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v)
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Amadeus ${res.status}: ${await res.text()}`)
  return res.json()
}

// Factual geographic reference data (not invented travel info)
const CITY_DATA = {
  'New York':    { iata: 'NYC', lat: 40.7128, lon: -74.006 },
  'Los Angeles': { iata: 'LAX', lat: 34.0522, lon: -118.2437 },
  'London':      { iata: 'LON', lat: 51.5074, lon: -0.1278 },
  'Tokyo':       { iata: 'TYO', lat: 35.6762, lon: 139.6503 },
  'Paris':       { iata: 'PAR', lat: 48.8566, lon: 2.3522 },
  'Dubai':       { iata: 'DXB', lat: 25.2048, lon: 55.2708 },
}

const AIRLINE_NAMES = {
  AA:'American Airlines',UA:'United Airlines',DL:'Delta Air Lines',B6:'JetBlue Airways',
  BA:'British Airways',VS:'Virgin Atlantic',JL:'Japan Airlines',NH:'All Nippon Airways',
  AF:'Air France',EK:'Emirates',LH:'Lufthansa',KL:'KLM Royal Dutch Airlines',
  SQ:'Singapore Airlines',CX:'Cathay Pacific',QF:'Qantas',TK:'Turkish Airlines',
  AC:'Air Canada',LX:'Swiss International',IB:'Iberia',AZ:'ITA Airways',
  EY:'Etihad Airways',QR:'Qatar Airways',KE:'Korean Air',OZ:'Asiana Airlines',
  NZ:'Air New Zealand',SK:'Scandinavian Airlines',FI:'Icelandair',
  WN:'Southwest Airlines',AS:'Alaska Airlines',F9:'Frontier Airlines',
  NK:'Spirit Airlines',HA:'Hawaiian Airlines',UA:'United Airlines',
}

const AIRCRAFT_NAMES = {
  '789':'Boeing 787-9','788':'Boeing 787-8','78X':'Boeing 787-10',
  '359':'Airbus A350-900','351':'Airbus A350-1000',
  '77W':'Boeing 777-300ER','772':'Boeing 777-200','77L':'Boeing 777-200LR',
  '388':'Airbus A380-800','739':'Boeing 737 MAX 9','738':'Boeing 737-800',
  '73M':'Boeing 737 MAX 8','333':'Airbus A330-300','332':'Airbus A330-200',
  '32N':'Airbus A320neo','321':'Airbus A321','320':'Airbus A320','319':'Airbus A319',
  '763':'Boeing 767-300','752':'Boeing 757-200',
}

const AMENITY_MAP = {
  FREE_WIFI:'Free WiFi',POOL:'Pool',FITNESS_CENTER:'Fitness Center',SPA:'Spa',
  RESTAURANT:'Restaurant',BAR:'Bar',BUSINESS_CENTER:'Business Center',PARKING:'Parking',
  AIR_CONDITIONING:'Air Conditioning',ROOM_SERVICE:'Room Service',LAUNDRY:'Laundry',
  ELEVATOR:'Elevator',GARDEN:'Garden',HEATING:'Heating',
}

const POI_CATEGORY_MAP = {
  RESTAURANT:'Food',HERITAGE:'Culture',NATURAL:'Nature',
  SHOPPING:'Shopping',LEISURE:'Entertainment',TRANSPORT:'Transport',
}

function parseDuration(iso) {
  if (!iso) return 'N/A'
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return iso
  return `${m[1] ? m[1] + 'h' : ''} ${m[2] ? m[2] + 'm' : ''}`.trim() || '0m'
}

function parseTime(iso) {
  if (!iso) return 'N/A'
  return iso.split('T')[1]?.substring(0, 5) || 'N/A'
}

function calcLayover(segments) {
  if (segments.length < 2) return undefined
  const ms = new Date(segments[1].departure.at).getTime() - new Date(segments[0].arrival.at).getTime()
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`
}

async function getAirlineNames(codes) {
  const known = {}
  const unknown = []
  for (const c of codes) {
    if (AIRLINE_NAMES[c]) known[c] = AIRLINE_NAMES[c]
    else unknown.push(c)
  }
  if (unknown.length) {
    try {
      const data = await amadeusGet('/v1/reference-data/airlines', { airlineCodes: unknown.join(',') })
      for (const a of data.data || []) known[a.iataCode] = a.businessName
    } catch { /* use code as name */ }
  }
  return known
}

function transformFlights(flightData, airlineNames) {
  const outbound = [], returnFlights = []
  for (const offer of flightData.data || []) {
    const price = Math.round(parseFloat(offer.price?.total || 0))
    for (let idx = 0; idx < 2; idx++) {
      const itin = offer.itineraries?.[idx]
      if (!itin) continue
      const segs = itin.segments || []
      const first = segs[0], last = segs[segs.length - 1]
      const carrier = first?.carrierCode
      const flight = {
        airline: airlineNames[carrier] || carrier || 'Unknown',
        airlineCode: carrier || '',
        flightNumber: `${carrier || ''}${first?.number || ''}`,
        aircraft: AIRCRAFT_NAMES[first?.aircraft?.code] || first?.aircraft?.code || 'N/A',
        departureAirport: '',
        departureCode: first?.departure?.iataCode || '',
        departureTerminal: undefined,
        departureGate: undefined,
        departureTime: parseTime(first?.departure?.at),
        arrivalAirport: '',
        arrivalCode: last?.arrival?.iataCode || '',
        arrivalTerminal: undefined,
        arrivalGate: undefined,
        arrivalTime: parseTime(last?.arrival?.at),
        duration: parseDuration(itin.duration),
        price,
        stops: segs.length - 1,
        layoverCity: segs.length > 1 ? segs[0].arrival?.iataCode : undefined,
        layoverDuration: calcLayover(segs),
      }
      if (idx === 0) outbound.push(flight)
      else returnFlights.push(flight)
    }
  }
  return { outbound, returnFlights }
}

function transformHotels(hotelData, nights) {
  return (hotelData.data || []).slice(0, 4).map(h => {
    const hotel = h.hotel || h
    const offer = (h.offers || [])[0] || {}
    const ppn = Math.round(parseFloat(offer.price?.total || 0))
    return {
      name: hotel.name || 'Unknown Hotel',
      rating: parseFloat(hotel.rating) || 0,
      pricePerNight: ppn,
      totalPrice: ppn * Math.max(nights, 1),
      neighborhood: hotel.address?.cityName || 'N/A',
      amenities: (hotel.amenities || []).map(a => AMENITY_MAP[a] || a).slice(0, 6),
      image: (hotel.media || [])[0]?.uri || undefined,
      description: hotel.address?.lines?.join(', ') || undefined,
    }
  })
}

function transformPOIs(poiData) {
  const restaurants = [], attractions = []
  for (const poi of poiData.data || []) {
    const tags = poi.tags?.map(t => t.tag).join(', ')
    const item = {
      name: poi.name || 'Unknown',
      category: POI_CATEGORY_MAP[poi.category] || 'Landmark',
      rating: poi.rating || 0,
      price: undefined,
      duration: undefined,
      description: tags || undefined,
      image: undefined,
    }
    if (poi.category === 'RESTAURANT') {
      restaurants.push({
        ...item,
        cuisine: poi.tags?.find(t => t.tag !== 'restaurant')?.tag || 'Various',
        priceRange: undefined,
        neighborhood: undefined,
        mealType: undefined,
      })
    } else {
      attractions.push(item)
    }
  }
  return { restaurants, attractions }
}

function transformActivities(actData) {
  return (actData.data || []).slice(0, 6).map(a => ({
    name: a.name || 'Unknown Activity',
    category: 'Experience',
    rating: a.rating || 0,
    price: parseFloat(a.price?.amount) || undefined,
    duration: a.duration ? `${a.duration.amount} ${a.duration.unit?.toLowerCase()}` : undefined,
    description: a.description || undefined,
    image: (a.pictures || [])[0]?.uri || undefined,
  }))
}

export async function generateTrip(input) {
  const { departureCity, destinationCity, departureDate, returnDate, travelers } = input
  const dep = CITY_DATA[departureCity]
  const dest = CITY_DATA[destinationCity]
  if (!dep || !dest) throw new Error(`Unsupported city: ${departureCity} or ${destinationCity}`)

  const nights = Math.max(1, Math.ceil((new Date(returnDate) - new Date(departureDate)) / 86400000))
  const ds = {
    flights: 'unavailable', hotels: 'unavailable', restaurants: 'unavailable',
    attractions: 'unavailable', airports: 'unavailable', events: 'unavailable',
    transport: 'estimated', weather: 'unavailable', dayPlans: 'estimated',
  }

  const result = {
    flights: [], returnFlights: [],
    airport: { name: '', code: '', terminals: [], securityWaitTime: undefined, lounges: [], services: [] },
    destinationAirport: { name: '', code: '', terminals: [], securityWaitTime: undefined, lounges: [], services: [] },
    hotels: [], restaurants: [], attractions: [], events: [],
    transport: [
      { type: 'Airport Transfer', description: 'Estimated taxi/rideshare from airport to city center', price: 45 * travelers },
      { type: 'Public Transit', description: 'Estimated daily public transit pass', price: 12 * travelers },
      { type: 'Rideshare', description: 'Estimated daily rideshare costs', price: 25 * travelers },
    ],
    dataSources: ds,
  }

  // Flights
  try {
    const fd = await amadeusGet('/v2/shopping/flight-offers', {
      originLocationCode: dep.iata, destinationLocationCode: dest.iata,
      departureDate, returnDate, adults: travelers, currencyCode: 'USD', max: 4,
    })
    const codes = new Set()
    ;(fd.data || []).forEach(o => o.itineraries?.forEach(i => i.segments?.forEach(s => s.carrierCode && codes.add(s.carrierCode))))
    const names = await getAirlineNames([...codes])
    const t = transformFlights(fd, names)
    result.flights = t.outbound
    result.returnFlights = t.returnFlights
    if (result.flights.length) ds.flights = 'real'
  } catch (e) { console.error('Flights:', e.message) }

  // Hotels
  try {
    const hd = await amadeusGet('/v3/shopping/hotel-offers', {
      cityCode: dest.iata, checkInDate: departureDate, checkOutDate: returnDate,
      adults: travelers, roomQuantity: 1, currency: 'USD', max: 4,
    })
    result.hotels = transformHotels(hd, nights)
    if (result.hotels.length) ds.hotels = 'real'
  } catch (e) { console.error('Hotels:', e.message) }

  // POIs (restaurants + attractions)
  try {
    const pd = await amadeusGet('/v1/shopping/pois', { latitude: dest.lat, longitude: dest.lon, radius: 10 })
    const { restaurants, attractions } = transformPOIs(pd)
    result.restaurants = restaurants
    result.attractions = attractions
    if (restaurants.length) ds.restaurants = 'real'
    if (attractions.length) ds.attractions = 'real'
  } catch (e) { console.error('POIs:', e.message) }

  // Activities (merge into attractions)
  try {
    const ad = await amadeusGet('/v1/shopping/activities', { latitude: dest.lat, longitude: dest.lon, radius: 10 })
    const acts = transformActivities(ad)
    result.attractions = [...result.attractions, ...acts]
    if (acts.length && ds.attractions === 'unavailable') ds.attractions = 'real'
  } catch (e) { console.error('Activities:', e.message) }

  // Airports
  try {
    const [da, aa] = await Promise.all([
      amadeusGet('/v1/reference-data/locations', { subType: 'AIRPORT', keyword: dep.iata, 'page[limit]': 1 }),
      amadeusGet('/v1/reference-data/locations', { subType: 'AIRPORT', keyword: dest.iata, 'page[limit]': 1 }),
    ])
    const d = (da.data || [])[0], a = (aa.data || [])[0]
    if (d) result.airport = { name: d.name || '', code: d.iataCode || dep.iata, terminals: [], securityWaitTime: undefined, lounges: [], services: [] }
    if (a) result.destinationAirport = { name: a.name || '', code: a.iataCode || dest.iata, terminals: [], securityWaitTime: undefined, lounges: [], services: [] }
    ds.airports = 'real'
  } catch (e) { console.error('Airports:', e.message) }

  return result
}
