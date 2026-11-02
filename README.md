# Shubh Invites

Beautiful, animated online invitations for Indian weddings and every celebration around them — engagement, haldi, mehndi, sangeet, reception — plus birthdays, baby showers, anniversaries, housewarmings, graduations and parties.

Hosts pick an occasion and a theme, add one or many events (multi-day weddings), and share a single link (`/i/<slug>`) on WhatsApp. Guests get a mobile-first animated page in English, Telugu or Hindi with:

- envelope intro, themed backdrop effects (petals, marigolds, lanterns, confetti…)
- scratch-to-reveal date and live countdown
- per-event venue, Google Maps directions and add-to-calendar
- RSVP form (headcount, which events, message) with an optional deadline
- tap-to-call / WhatsApp the host, rich link previews (Open Graph image)

Hosts can create invites **without an account** (they get a private manage link) and later sign up — anonymous invites are claimed into the account automatically. The dashboard shows views, RSVP totals and a CSV export (Excel-friendly, works with Telugu/Hindi names).

**Stack:** Next.js 16 (App Router, React 19), Tailwind CSS v4, TypeScript, Drizzle ORM on Neon Postgres, Vercel Blob for photos, JWT cookie sessions (`jose`) with `bcryptjs` passwords.

---

## Local development

Requirements: Node.js 20.9+ (22 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No environment variables are needed locally:**

| Without…                | the app uses…                                                                   |
| ----------------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`          | an embedded Postgres ([PGlite](https://pglite.dev)) stored in `./.pglite`        |
| `BLOB_READ_WRITE_TOKEN` | local files in `public/uploads/`, served at `/uploads/<file>`                    |
| `AUTH_SECRET`           | a built-in dev-only secret (the app refuses to start auth in production without one) |
| `NEXT_PUBLIC_SITE_URL`  | the request's own host for share links                                           |

Tables are created automatically on the first request. To reset local data, stop the server and delete `.pglite/` and `public/uploads/`.

Notes:

- `npm install` pulls `@electric-sql/pglite` (a WASM build of Postgres, ~10 MB). It is only loaded when `DATABASE_URL` is unset.
- Only one process can open `./.pglite` at a time — don't run two dev servers against the same folder.
- To develop against your real Neon database instead, copy `.env.example` to `.env.local` and fill it in (or use `vercel env pull`, see below).
- `npm run lint` runs the TypeScript type-check.

---

## Environment variables

| Variable                | Required in production | Set by                         | Purpose                                                                                       |
| ----------------------- | ---------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | yes                    | Neon integration (automatic)   | Postgres connection string. Unset → local PGlite.                                             |
| `BLOB_READ_WRITE_TOKEN` | yes (for photo upload) | Vercel Blob store (automatic)  | Stores uploaded photos. Unset → `public/uploads` (local only; the Vercel filesystem is read-only). |
| `AUTH_SECRET`           | **yes**                | you                            | Signs login session cookies. Use 32+ random characters: `openssl rand -base64 32`.            |
| `NEXT_PUBLIC_SITE_URL`  | recommended            | you                            | Public base URL, e.g. `https://shubhinvites.com`. Used in share links, manage links and OG tags. |

---

## Deploy to Vercel (dashboard)

1. **Push to GitHub.** Create a new repository and push this project (`.env*`, `.pglite` and `public/uploads` are git-ignored).
2. **Import the project.** In Vercel, click **Add New… → Project**, choose the repository and keep the detected **Next.js** framework preset and default build settings. You can click **Deploy** now (the first build will succeed; the app needs storage before it fully works) or configure storage first via the project settings after import.
3. **Add the database (Neon).** Open the project → **Storage** tab → **Create Database** → choose **Neon** (Serverless Postgres, from the Marketplace) → pick a region close to your guests (e.g. Singapore / Mumbai `aws-ap-south-1` for India) → **Connect** it to the project for all environments. This sets `DATABASE_URL` (plus a few other `PG*`/`POSTGRES_*` variables the app doesn't need).
4. **Add file storage (Blob).** Still in **Storage** → **Create** → **Blob** → name it (e.g. `invites-photos`) → connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
5. **Set the remaining variables.** Project → **Settings → Environment Variables**:
   - `AUTH_SECRET` = output of `openssl rand -base64 32` (all environments).
   - `NEXT_PUBLIC_SITE_URL` = your production URL, e.g. `https://your-app.vercel.app` (Production). For Preview you can leave it unset — links then use the preview's own host.
6. **Deploy.** Go to **Deployments** → latest → **⋯ → Redeploy** (environment variables only apply to new builds; `NEXT_PUBLIC_*` values are inlined at build time).
7. **Done.** Tables (`users`, `invites`, `rsvps`) are created automatically (idempotent `CREATE TABLE IF NOT EXISTS`) on the first request. Alternatively push the schema yourself with Drizzle:

   ```bash
   DATABASE_URL="postgres://…" npm run db:push
   ```

### Deploy with the Vercel CLI instead

```bash
npm i -g vercel
vercel login
vercel link                  # create/link the Vercel project
# add Neon + Blob in the dashboard Storage tab (step 3–4 above), then:
vercel env add AUTH_SECRET production        # paste the output of: openssl rand -base64 32
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env pull .env.local   # optional: use the cloud DB/Blob while developing locally
vercel --prod                # build and deploy to production
```

### Custom domain

Project → **Settings → Domains** → add e.g. `invites.example.com` and create the DNS record Vercel shows (CNAME to `cname.vercel-dns.com`, or A record for an apex domain). Then update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy so share links and link previews use it.

### Production notes

- **Upload size:** the API accepts images up to 5 MB, but Vercel Functions reject request bodies above ~4.5 MB. The builder should downscale photos client-side before upload (a 1600px JPEG is plenty).
- **Rate limiting** of RSVPs (10/min per IP per invite) and uploads (20/min per IP) is in-memory and per function instance — it stops casual spam, not a determined attacker. Swap `src/lib/rate-limit.ts` for Upstash Redis if you need a global limit.
- Link previews are rendered at `/i/<slug>/opengraph-image` (1200×630). WhatsApp caches previews aggressively; changes to an invite may take a while to show in already-shared chats.

---

## API reference

All endpoints take/return JSON (except upload and CSV) and return `{ "error": string }` with an appropriate status on failure. "Owner auth" means: the logged-in user owns the invite **or** the request carries the invite's manage token.

| Method & path                               | Body / query                                                                     | Success                                                     | Errors                    |
| ------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| `POST /api/auth/signup`                     | `{ email, password (≥8), name?, claimTokens?: string[] }`                         | `{ ok: true }` + session cookie; claims up to 50 invites     | 400, 409                  |
| `POST /api/auth/login`                      | `{ email, password, claimTokens?: string[] }`                                      | `{ ok: true }` + session cookie                             | 400, 401                  |
| `POST /api/auth/logout`                     | —                                                                                 | `{ ok: true }`                                              |                           |
| `POST /api/invites`                         | `{ data: InviteData }`                                                            | 201 `{ id, slug, manageToken, url, manageUrl }`             | 400                       |
| `PUT /api/invites/:id`                      | `{ data: InviteData, manageToken? }`                                              | `{ ok: true }`                                              | 400, 403, 404             |
| `DELETE /api/invites/:id`                   | optional `{ manageToken? }` or `?token=`                                          | `{ ok: true }`                                              | 403, 404                  |
| `POST /api/rsvp`                            | `{ slug, name, phone?, status: yes\|no\|maybe, guests, eventIds, message? }`      | `{ ok: true }`                                              | 400, 403, 404, 429        |
| `GET /api/invites/:id/rsvps.csv`            | `?token=` optional                                                                | `text/csv` attachment (UTF-8 BOM)                           | 403, 404                  |
| `DELETE /api/invites/:id/rsvps/:rsvpId`     | `?token=` optional                                                                | `{ ok: true }`                                              | 403, 404                  |
| `POST /api/upload`                          | `multipart/form-data` field `file` (JPEG/PNG/WebP/GIF, ≤ 5 MB)                    | `{ url }`                                                   | 400, 413, 415, 429, 503   |
