# Aero Transit — Your journey. Planned by AI.

A modern, futuristic AI-powered travel companion that plans your entire trip. Enter your departure, destination, dates, travelers, budget, and preferences, and Aero Transit creates a personalized itinerary with flights, airports, hotels, restaurants, attractions, day-by-day plans, Smart Budget tracking, and a Trip Score.

## Features

- **AI Trip Planning** — Generates a complete itinerary from your travel inputs
- **Aero AI Chat** — Ask questions about your trip, get recommendations, directions, and travel problem-solving
- **Smart Budget** — Tracks spending across categories and suggests cheaper alternatives
- **Trip Score** — Rates your trip on price, convenience, timing, and experiences
- **Trip Dashboard** — Central hub with all travel information and an "Ask Aero AI" button
- **Flights & Airport Info** — Flight details, terminals, gates, security wait times, lounges, and airport services
- **Hotels, Restaurants & Attractions** — Curated recommendations matched to your preferences
- **Day-by-Day Itinerary** — Morning, afternoon, and evening plans for each day of your trip

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS for styling
- Supabase for trip persistence
- Lucide React for icons

## Getting Started

```bash
npm install
npm run dev
```

Vite will print the local preview address (normally `http://localhost:5173`).
Your edits to files in `src/` are picked up automatically by the development
server. Generated trips are also kept in the browser's local storage, so the
current trip remains available after a refresh even when Supabase environment
variables have not been configured.
