# Deployment

Sundial runs on Cloudflare Workers through OpenNext, with Neon PostgreSQL as the database. The same code runs locally with `next dev`.

## 1. Database

Create a Neon project and a database. Copy the pooled connection string. It should look like:

```
postgresql://user:password@host/dbname?sslmode=require
```

From the repository:

```bash
cp .env.example .env.local
# paste DATABASE_URL and AUTH_SECRET
npm run seed
```

`npm run seed` creates the schema and demo users if the database is empty. To restore the demo state later, run `npm run db:reset`.

## 2. Cloudflare Worker

Requirements: a Cloudflare account and a Workers plan that allows the CPU time your traffic needs. The free plan is enough for a demo.

```bash
npx wrangler login
npx wrangler secret put DATABASE_URL
npx wrangler secret put AUTH_SECRET
```

Use the same pooled Neon connection string. `AUTH_SECRET` should be at least 32 random bytes; generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Build and deploy:

```bash
npm run build:cf
npx wrangler deploy
```

The first deploy prints the Worker URL. Open it, sign in with a demo account, and check `GET /api/health`.

### Optional custom domain

In the Cloudflare dashboard, open the Worker, go to **Settings → Domains & Routes**, and add a custom domain. TLS is automatic.

## 3. GitHub Actions

`.github/workflows/ci.yml` runs on pushes and pull requests:

- install dependencies with `npm ci`
- typecheck
- unit tests
- production build

`.github/workflows/deploy-cloudflare.yml` is manual (`workflow_dispatch`). Add these repository secrets:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token with Workers Scripts: Edit and Account Settings: Read |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account id |
| `DATABASE_URL` | Neon pooled connection string |
| `AUTH_SECRET` | Session signing secret |

The workflow builds with OpenNext, deploys with Wrangler, and writes the two runtime secrets to the Worker.

## Local production preview

```bash
npm run build
npm start
```

For a Worker-accurate preview:

```bash
npm run preview:cf
```

The preview uses the local `.env` files for runtime secrets. Production cookies are marked `Secure`, so use HTTPS in front of a production build if you need the session cookie to persist; `wrangler dev` and the Cloudflare deployment both provide HTTPS.

## Health and rollback

- Health: `GET /api/health` returns `200` with `database: "up"` when the Neon query succeeds, and `503` otherwise.
- Logs: `npx wrangler tail`.
- Rollback: Cloudflare keeps previous deployments. Use the dashboard’s deployment list or `npx wrangler rollback`.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Login succeeds but the next request is signed out | Cookie is `Secure` and you are on plain HTTP. Use HTTPS or a preview URL. |
| `Missing required environment variable: DATABASE_URL` | Worker secret not set, or the deploy used a different environment. |
| `Missing required environment variable: AUTH_SECRET` | Same as above; set it with `wrangler secret put`. |
| Health returns 503 | Neon project paused, wrong connection string, or network restriction. Check the pooled host. |
| OpenNext build fails after a Next upgrade | Check the supported Next version for your `@opennextjs/cloudflare` release. |
| Cold start feels slow | The schema check runs once per isolate. Nine small queries to Neon; subsequent requests reuse the isolate. |
