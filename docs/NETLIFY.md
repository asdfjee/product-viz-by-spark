# Deploying on Netlify

1) Build settings (Site → Deploy settings → Build settings)
- Build command: `npm run build`
- Publish directory: `dist`

2) Environment variables (Site → Settings → Environment variables)
- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key

3) SPA redirect (handled by netlify.toml)
- The included `netlify.toml` routes all paths to `/index.html` so routes like `/auth/callback` work on refresh and via shared links.

4) Supabase Auth URLs (Supabase → Authentication → URL configuration)
- Site URL: `https://YOUR-SITE.netlify.app`
- Additional Redirect URLs: `https://YOUR-SITE.netlify.app/auth/callback`
- For preview deploys, add each exact preview URL's `/auth/callback` as needed.

Notes
- The app sets `emailRedirectTo` to `/auth/callback` on signup and handles the redirect.
- See docs/supabase-rls-setup.md for database RLS and auth policy setup.