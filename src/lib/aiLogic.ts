import type { Itinerary, TripInput } from '../types'

interface AIResponse {
  text: string
  suggestions?: string[]
}

export function getAIResponse(question: string, itinerary: Itinerary | null, input: TripInput | null): AIResponse {
  if (!itinerary || !input) {
    return {
      text: 'I don\'t have an itinerary to analyze yet. Build your trip first, and then I can help you with recommendations, directions, budget tips, and more!',
      suggestions: ['Build My Trip', 'What can Aero AI do?'],
    }
  }

  const q = question.toLowerCase().trim()

  if (q.match(/gate|terminal|airport|security|lounge/)) {
    const f = itinerary.flights[0]
    return {
      text: `Your flight ${f.airlineCode}${f.flightNumber} departs from ${input.departureCity} (${f.departureCode}), Terminal ${f.departureTerminal}, Gate ${f.departureGate}. Security wait is currently ${itinerary.airport.securityWaitTime}. Available lounges: ${itinerary.airport.lounges.map((l: { name: string }) => l.name).join(', ')}.`,
      suggestions: ['Where do I check in?', 'What amenities are at the airport?'],
    }
  }

  if (q.match(/flight|airline|boarding|depart/)) {
    const f = itinerary.flights[0]
    return {
      text: `Your outbound flight is ${f.airline} ${f.airlineCode}${f.flightNumber} on a ${f.aircraft}. It departs at ${f.departureTime} and arrives at ${f.arrivalTime}. Duration: ${f.duration}. ${f.stops === 0 ? 'Nonstop flight.' : `1 stop in ${f.layoverCity} for ${f.layoverDuration}.`} Price: $${f.price}.`,
      suggestions: ['Show return flight details', 'Any cheaper flight options?'],
    }
  }

  if (q.match(/hotel|stay|accommodation|room/)) {
    const h = itinerary.hotels[0]
    return {
      text: `I recommend ${h.name} in ${h.neighborhood} — rated ${h.rating} stars at $${h.pricePerNight}/night. Amenities include ${h.amenities.join(', ')}. ${h.description}`,
      suggestions: ['Show all hotel options', 'Which hotel is cheapest?'],
    }
  }

  if (q.match(/restaurant|food|eat|dining|meal|breakfast|lunch|dinner/)) {
    const r = itinerary.restaurants
    return {
      text: `Here are my dining picks: ${r.slice(0, 3).map((x: { name: string; cuisine: string; priceRange: string; rating: number }) => `${x.name} (${x.cuisine}, ${x.priceRange}, ${x.rating}★)`).join('; ')}. I matched these to your food preferences and proximity to your hotel.`,
      suggestions: ['Find a vegetarian restaurant', 'Best breakfast spots?'],
    }
  }

  if (q.match(/attraction|activity|thing|do|visit|sightsee|explore/)) {
    const a = itinerary.attractions
    return {
      text: `Top attractions for your trip: ${a.slice(0, 3).map((x: { name: string; category: string; duration: string }) => `${x.name} (${x.category}, ${x.duration})`).join('; ')}. These are matched to your preferences: ${input.preferences.join(', ')}.`,
      suggestions: ['Plan a free activity', 'What\'s near my hotel?'],
    }
  }

  if (q.match(/budget|cost|cheap|afford|save|money|spend/)) {
    const b = itinerary.budget
    return {
      text: `Your trip total is $${b.total} against a budget of $${b.budget}. ${b.remaining >= 0 ? `You have $${b.remaining} remaining.` : `You're $${Math.abs(b.remaining)} over budget.`} I found $${b.savings} in potential savings: ${b.savingsTips[0]}`,
      suggestions: ['Show all savings tips', 'How to save on flights?'],
    }
  }

  if (q.match(/score|rating|grade|how good/)) {
    const s = itinerary.score
    return {
      text: `Your Trip Score is ${s.overall}/100 (Grade: ${s.grade}). Breakdown — Price: ${s.price}, Convenience: ${s.convenience}, Timing: ${s.timing}, Experiences: ${s.experiences}. ${s.summary}`,
      suggestions: ['How can I improve my score?', 'What does the score mean?'],
    }
  }

  if (q.match(/layover|connection|connecting|wait between/)) {
    const f = itinerary.flights[0]
    if (f.stops > 0 && f.layoverCity) {
      return {
        text: `You have a layover in ${f.layoverCity} for ${f.layoverDuration}. That's enough time to grab a meal or visit an airport lounge. I can recommend things to do near the airport if you'd like.`,
        suggestions: ['What can I do during the layover?', 'Find a lounge at the layover airport'],
      }
    }
    return {
      text: `Your flight is nonstop — no layovers! You'll go directly from ${input.departureCity} to ${input.destinationCity}.`,
      suggestions: ['What amenities are at the airport?', 'Best seat on the plane?'],
    }
  }

  if (q.match(/direction|get to|how to go|transport|travel to|getting around/)) {
    return {
      text: `For getting around ${input.destinationCity}: ${itinerary.transport.map((t: { type: string; description: string; price: number }) => `${t.type} — ${t.description} (${t.price})`).join('. ')}. I recommend the City Metro Pass for best value.`,
      suggestions: ['How do I get from airport to hotel?', 'Is public transit safe?'],
    }
  }

  if (q.match(/delay|cancel|change|problem|issue|missed|emergency/)) {
    return {
      text: `If your flight is delayed or canceled, I can help rebook alternatives, notify your hotel, and adjust your day-by-day plan. I'm monitoring your itinerary in real time. For now, everything looks on schedule.`,
      suggestions: ['What if I miss my connection?', 'Can I change my hotel dates?'],
    }
  }

  if (q.match(/weather|pack|bring|clothes/)) {
    return {
      text: `For your trip to ${input.destinationCity}, I recommend packing layers — comfortable walking shoes for attractions, a light jacket for evenings, and any specialty gear for your planned activities. Check the weather 48 hours before departure for last-minute adjustments.`,
      suggestions: ['What should I pack for adventure activities?', 'Any travel tips?'],
    }
  }

  if (q.match(/event|happen|festival|show|concert/)) {
    return {
      text: `Events during your stay: ${itinerary.events.map((e: { name: string; type: string; date: string }) => `${e.name} (${e.type}) on ${e.date}`).join('; ')}. These align with your dates and could be great additions to your itinerary.`,
      suggestions: ['Add an event to my plan', 'Are tickets still available?'],
    }
  }

  if (q.match(/itinerary|plan|schedule|day by day|daily/)) {
    return {
      text: `Your trip has ${itinerary.dayPlans.length} days. Day 1: ${itinerary.dayPlans[0].title} — Morning: ${itinerary.dayPlans[0].morning}. Afternoon: ${itinerary.dayPlans[0].afternoon}. Evening: ${itinerary.dayPlans[0].evening}. Want me to walk through all days or adjust any?`,
      suggestions: ['Show all days', 'Can I swap activities?'],
    }
  }

  if (q.match(/hello|hi|hey|help|what can you|who are you/)) {
    return {
      text: `Hi! I'm Aero AI, your personal travel companion. I understand your entire itinerary and can help with flight details, airport navigation, hotel info, restaurant picks, directions, budget tips, layover planning, and handling delays or changes. What would you like to know?`,
      suggestions: ['Tell me about my flights', 'What\'s my trip score?', 'Show me savings tips'],
    }
  }

  return {
    text: `I can help with that! Based on your trip to ${input.destinationCity}, I have details on flights, hotels, restaurants, attractions, transport, budget, and your day-by-day plan. Try asking about a specific part of your trip, or use one of the suggestions below.`,
    suggestions: ['Tell me about my flights', 'What\'s my trip score?', 'Show me savings tips', 'Best restaurants near my hotel?'],
  }
}
