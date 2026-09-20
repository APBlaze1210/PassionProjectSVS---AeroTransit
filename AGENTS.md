# Aero Transit — Base44 dev environment

## Stack
- React 18 + TypeScript + Vite 5 (dev server on port 5173, host 0.0.0.0)
- Tailwind CSS, Lucide React icons
- Supabase for optional trip persistence (gracefully degrades to `null` without credentials; trips fall back to browser localStorage)

## Running
- `docker compose -f docker-compose.base44.yml up -d` — starts the Vite dev server, host port 3000 → container 5173.
- The container runs `npm install` then `npm run dev` with the repo bind-mounted at `/app`, so edits hot-reload live. `node_modules` is an anonymous volume (not the host's).

## Secrets
- **No external credentials required to boot.** The Supabase client (`src/lib/supabase.ts`) only initializes when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set; otherwise it's `null` and the app uses localStorage. The AI logic (`src/lib/aiLogic.ts`) is fully local/rule-based — no LLM API key needed.
- If real Supabase persistence is wanted later, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via the platform secrets (they're `VITE_`-prefixed so Vite exposes them to the client). The migration is at `supabase/migrations/`.

## Verifying it works
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- The served HTML includes `/@vite/client` and `/src/main.tsx` (live source, not a prebuilt bundle).
