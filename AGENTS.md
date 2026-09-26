# Agent notes

- Frontend-only Vite 5 + React app; no backend. Run: `docker compose -f docker-compose.base44.yml up -d` → http://localhost:3000.
- `node_modules/` and `dist/` are committed to git (host-built). The compose file shadows `node_modules` with a named volume and runs `npm ci` in the container — don't rely on or modify the committed copy.
- Supabase is optional: without `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` the client is `null` and trips persist only in localStorage. If enabled, apply `supabase/migrations/*.sql` to the Supabase project. Vite env vars are read at dev-server start, so recreate `web` after changing them.
- `vite.config.ts` sets `server.allowedHosts: true` (Vite 5.4 doesn't read `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`).
- Verify: page renders the "Aero Transit" hero with no console errors; `npm run build` (tsc + vite) for type checking.
