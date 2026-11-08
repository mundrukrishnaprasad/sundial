# Sundial

Timesheets, approvals, and utilization for teams that bill by the hour.

Sundial is a small, complete SaaS application: employees enter a week against projects, managers approve or send it back, and admins read utilization by person and project. It is built with Next.js on Cloudflare Workers and Neon PostgreSQL, with role-aware queries, an audit log, CSV exports, and tests.

This is a portfolio project, not a commercial service.

**Live demo:** https://sundial.kp489292.workers.dev — sign in with any account below. The database is seeded for evaluation and can be reset with `npm run db:reset`.

## What is included

- **Weekly timesheets** — add, edit, and delete entries; totals, billable hours, and utilization update immediately.
- **Submission workflow** — a submitted week locks; a manager approves it or sends it back with a required note; editing a rejected week reopens it as a draft.
- **Role-aware access** — employees, managers, and admins see different navigation and data. Managers can only review their own direct reports.
- **Utilization reporting** — billable share by person and project for a selected week, with a CSV export.
- **Project management** — admins create projects, change billing type, and archive or restore them without losing history.
- **Audit log** — logins, entry changes, submissions, decisions, and project changes, with actor and detail.
- **Health endpoint** — `GET /api/health` checks the database connection.

## Demo accounts

All accounts use the password `Sundial!2026`.

| Role | Name | Email |
| --- | --- | --- |
| Employee | Ravi Kumar | `ravi@sundial.app` |
| Employee | Sita Nair | `sita@sundial.app` |
| Manager | Arjun Mehta | `manager@sundial.app` |
| Admin | Maya Rao | `admin@sundial.app` |

The seed creates four weeks of timesheets: three approved or rejected weeks, plus the current week. The current Ravi week starts as submitted so the approval flow can be tested immediately. `npm run db:reset` restores this state.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, React 19.3) |
| Language | TypeScript 5.9, strict |
| Styling | Tailwind CSS 4 with a blue and white design system |
| Icons | lucide-react |
| Database | Neon PostgreSQL via `@neondatabase/serverless` (HTTP driver) |
| Auth | Signed JWT session cookie (`jose`), PBKDF2 password hashing |
| Validation | Zod |
| Tests | Vitest |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| CI/CD | GitHub Actions |

## Local development

Requirements: Node.js 22+, npm 10+, and a PostgreSQL database (Neon free tier is enough).

```bash
npm install
cp .env.example .env.local
```

Set the two values in `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
AUTH_SECRET=replace-with-a-long-random-string
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the database if it does not exist yet:

```bash
$env:BASE_DATABASE_URL="<connection string>"
node scripts/create-db.mjs
```

Then create the schema and demo data, and start the app:

```bash
npm run seed
npm run dev
```

Open `http://localhost:3000`. The first request also creates the schema and seeds an empty database, so `npm run seed` is optional when the database is already reachable.

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript with no emit |
| `npm run test` | Vitest unit tests |
| `npm run seed` | Create schema and seed if the database is empty |
| `npm run db:reset` | Drop and recreate all tables, then reseed |
| `npm run build:cf` | Build for Cloudflare Workers |
| `npm run preview:cf` | Preview the Worker locally |
| `npm run deploy:cf` | Deploy to Cloudflare Workers |

## Architecture

```mermaid
flowchart LR
  Browser[Browser] --> Worker[Cloudflare Worker<br/>Next.js App Router]
  Worker --> Neon[(Neon PostgreSQL<br/>HTTP driver)]
  Worker --> Assets[Static assets]
  GitHub[GitHub Actions] --> Worker
```

- Server Components read directly from the query layer; mutations go through route handlers.
- Authentication is a signed, HTTP-only cookie. The session payload contains the user id, name, email, and role.
- Authorization is enforced twice: route handlers check the role, and query functions check ownership or manager relationship.
- Weeks are Monday-based and calculated in UTC to avoid timezone drift between the browser and the database.
- The schema is applied idempotently at cold start; a new database seeds itself once.

### Data model

| Table | Purpose |
| --- | --- |
| `users` | Email, name, role, manager relationship, password hash |
| `projects` | Code, name, client, billable flag, active flag |
| `timesheets` | One row per user and week, with status and review metadata |
| `timesheet_entries` | Hours per project and work date, with an optional note |
| `audit_log` | Actor, action, entity, and JSON detail |

### Authorization rules

| Action | Employee | Manager | Admin |
| --- | --- | --- | --- |
| View own timesheet | Yes | Yes | Yes |
| Add or edit own entries | Own draft or rejected weeks | Own draft or rejected weeks | Own draft or rejected weeks |
| Submit own week | Yes | Yes | Yes |
| Review a timesheet | No | Direct reports only | Any submitted week |
| View team utilization | No | Direct reports | All people |
| Create or archive projects | No | No | Yes |
| Export CSV | No | No | Yes |
| Read the audit log | No | Yes | Yes |

## HTTP API

All mutations require a same-origin `Origin` header when the browser sends one, and they return JSON.

| Method | Route | Who | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public | Validate credentials, set the session cookie |
| `POST` | `/api/auth/logout` | Signed in | Clear the session |
| `GET` | `/api/auth/me` | Signed in | Current session user |
| `GET` | `/api/timesheets/mine?week=YYYY-MM-DD` | Signed in | Own week, entries, and summary |
| `POST` | `/api/timesheets/mine/entries` | Signed in | Add an entry to the matching week |
| `PATCH` | `/api/entries/:id` | Owner | Update an entry in an editable week |
| `DELETE` | `/api/entries/:id` | Owner | Delete an entry in an editable week |
| `GET` | `/api/timesheets/:id` | Owner, manager, admin | Read a timesheet with authorization |
| `POST` | `/api/timesheets/:id/submit` | Owner | Submit a draft or rejected week |
| `POST` | `/api/timesheets/:id/review` | Manager, admin | Approve or reject with a note |
| `GET` | `/api/projects` | Signed in | Project list |
| `POST` | `/api/projects` | Admin | Create a project |
| `PATCH` | `/api/projects/:id` | Admin | Rename, change billing, archive, restore |
| `GET` | `/api/reports/export?week=YYYY-MM-DD` | Admin | CSV export for a week |
| `GET` | `/api/health` | Public | Database connectivity |

## Testing

```bash
npm run typecheck
npm run test
npm run build
```

Unit tests cover date handling, utilization math, CSV escaping, and password hashing. The UI and API flows were also exercised manually: login for every role, entry add/edit/delete, rejection with a note, reopening, resubmission, approval, project creation and archiving, CSV download, and audit output.

## Deployment

The application is designed for Cloudflare Workers with a Neon database. The full procedure is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The current public deployment is at **https://sundial.kp489292.workers.dev**. In short:

1. Create a Neon database and schema.
2. Set `DATABASE_URL` and `AUTH_SECRET` as Worker secrets.
3. Run `npm run build:cf` and `npm run deploy:cf`.
4. Add a custom domain if needed.

The GitHub Actions workflow in `.github/workflows/ci.yml` runs typecheck, tests, and a production build on every push and pull request. `.github/workflows/deploy-cloudflare.yml` deploys manually with repository secrets.

## Scope and tradeoffs

Sundial is deliberately narrow. It does not include:

- Email or push notifications. A reviewer or employee sees the status on their next visit.
- Password reset, invitations, or multi-factor authentication.
- Multiple organizations or tenant-level isolation.
- Rate limiting on login. A production version would add it at the edge.
- A migration tool. The demo applies an idempotent schema at startup; a real product would use versioned migrations.
- Time zones other than UTC for week boundaries.

These omissions are documented rather than hidden. The parts that are present are tested and behave the same in development and on Workers.

## Project structure

```
app/                 Routes, layouts, and API handlers
components/          UI primitives and interactive pieces
lib/                 Auth, database, queries, validation, reporting helpers
scripts/             Create database, seed, and reset scripts
tests/               Vitest unit tests
docs/                Deployment notes
```

## Design

The interface uses a white surface, Signal-inspired ultramarine blue for primary actions, and a light blue hero block. Headings are set in Inter at extrabold weights. Status is always communicated with text as well as color. No emoji, no decorative illustrations, no gradients beyond a single soft accent.

---

Built as a working portfolio project. If you find a bug, the audit log will probably tell you where it started.
