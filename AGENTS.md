# AGENTS.md — Aero Transit (Base44 dev environment)

## What this app is
A Vite + React + TypeScript + Tailwind single-page app ("Aero Transit"), an AI-powered
travel planner. The "AI" is **fully local/rule-based** (`src/lib/aiLogic.ts`) — there is
no external LLM API and no API key required for it.

## Running it
- `docker compose -f docker-compose.base44.yml up -d` — starts the Vite dev server.
- Web entry point is on **host port 3000** (maps to Vite's 5173 inside the container).
- The container runs `npm install` then `npm run dev` from a bind-mount of the repo, so
  edits to `src/` hot-reload without a rebuild. `node_modules` is a named volume so the
  container's install isn't shadowed by the host bind mount.
- Healthcheck curls `http://localhost:5173/`.

## Supabase (optional)
- `src/lib/supabase.ts` only creates a client when both `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` are set; otherwise `supabase` is `null` and the app falls back
  to browser **localStorage** for trip persistence. The app boots and is fully usable
  without Supabase credentials.
- If you want trip persistence to a real backend, provide those two values as secrets
  (they are `import.meta.env` / Vite-prefixed, so they must be available at build/dev
  time, not just server-side). The schema is in `supabase/migrations/`.

## Vite host allowlist
- `vite.config.ts` sets `server.allowedHosts: true` so the preview's external hostname is
  accepted. Do not remove this or the preview will be blocked by Vite's DNS-rebinding check.

## No external credentials needed to boot
The app has no required environment variables. Do not add secret placeholders unless the
user wants to wire up real Supabase persistence.
