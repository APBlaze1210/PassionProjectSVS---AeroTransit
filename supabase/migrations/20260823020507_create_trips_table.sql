/*
# Create trips table (single-tenant, no auth)

1. New Tables
- `trips`
  - `id` (uuid, primary key, auto-generated)
  - `departure_city` (text, not null) — where the user departs from
  - `destination_city` (text, not null) — where the user is traveling to
  - `departure_date` (date, not null) — trip start date
  - `return_date` (date, not null) — trip end date
  - `travelers` (integer, not null, default 1) — number of travelers
  - `budget` (numeric, not null, default 0) — total trip budget in USD
  - `preferences` (jsonb, default '{}') — travel preferences (adventure, food, culture, relaxation, nightlife, nature, shopping)
  - `itinerary_data` (jsonb, default '{}') — the full generated itinerary (flights, hotels, restaurants, attractions, events, day-by-day plans, budget breakdown, trip score)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `trips`.
- Allow anon + authenticated full CRUD because this is a single-tenant demo app with no sign-in screen.
- All trip data is intentionally shared/public so users can save and retrieve trips without authentication.

3. Important Notes
- This app has NO sign-in screen, so policies MUST include `anon` role.
- `USING (true)` is acceptable here because the data is intentionally public/shared (no auth, no user isolation).
- The `itinerary_data` jsonb column stores the complete generated itinerary so trips can be fully reconstructed from the database.
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_city text NOT NULL,
  destination_city text NOT NULL,
  departure_date date NOT NULL,
  return_date date NOT NULL,
  travelers integer NOT NULL DEFAULT 1,
  budget numeric NOT NULL DEFAULT 0,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  itinerary_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trips" ON trips;
CREATE POLICY "anon_select_trips" ON trips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trips" ON trips;
CREATE POLICY "anon_insert_trips" ON trips FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trips" ON trips;
CREATE POLICY "anon_update_trips" ON trips FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trips" ON trips;
CREATE POLICY "anon_delete_trips" ON trips FOR DELETE
  TO anon, authenticated USING (true);
