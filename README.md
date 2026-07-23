# BuildCraft — Contractor Platform

A professional, animated 3D contractor website (Next.js 16 App Router + Drizzle ORM + PostgreSQL) with an instant **quote system** and a secure **payment system**.

## Features
- 🧊 Animated 3D hero (Three.js / react-three-fiber) — rotating skyline, floating shapes, starfield
- 📱 Fully responsive (mobile hamburger nav, fluid grids)
- 💬 Quote system: live estimate → stored in Postgres → per-quote page
- 💳 Payment system: card-form checkout, deposit flow, server-side records
- 📊 Admin dashboard at `/admin` (live quotes & payments)
- 🚀 Self-bootstrapping schema (tables created automatically on first request)

## Local development
```bash
npm install
npx drizzle-kit push   # create tables (or let the app create them on first request)
npm run dev
```

## Deploy to Vercel
1. Push this repo to GitHub/GitLab and import it in [Vercel](https://vercel.com).
2. Add a Postgres database (Vercel Postgres, Neon, or Supabase).
3. In **Project → Settings → Environment Variables**, set:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
   (SSL is enabled automatically for non-local URLs.)
4. Deploy. On the first request the app creates the `quotes` and `payments`
   tables automatically — no manual migration step required.

## Demo payment
Use card `4242 4242 4242 4242`, any future `MM/YY`, any `CVC`.

## Deploy to Netlify
This repo is pre-configured for Netlify via `netlify.toml` + `@netlify/plugin-nextjs`.
1. Push this repo to GitHub/GitLab.
2. In Netlify, click **Add new site → Import an existing project** and connect the repo.
   - Build command: `npm run build` (already set in `netlify.toml`)
   - Publish directory / functions are handled automatically by the Next.js plugin.
3. Add a Postgres database. Easiest: **Netlify Postgres** (Neon), or use [Neon](https://neon.tech) /
   [Supabase](https://supabase.com). Copy its connection string.
4. In **Site settings → Environment variables**, add:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
   (SSL is enabled automatically for non-local URLs.)
5. Deploy. Your site goes live at `https://<yoursite>.netlify.app` (24/7). The `quotes`
   and `payments` tables are created automatically on the first request.

> Note: the preview link generated while editing this project is temporary. A permanent
> 24/7 URL only exists once you deploy to your own Netlify/Vercel account.

## Routes
- `/` — landing page (3D hero, services, process, stats, quote form, pay)
- `/quote/[id]` — quote detail + deposit payment
- `/admin` — dashboard
- `/api/quotes`, `/api/quotes/[id]`, `/api/payments`, `/api/health`
