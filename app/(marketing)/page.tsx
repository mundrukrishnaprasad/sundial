import Link from "next/link";
import {
  ArrowUpRightIcon,
  BarsIcon,
  CalendarIcon,
  CheckBadgeIcon,
  LedgerIcon,
  LockIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/marketing/icons";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  Eyebrow,
  IconTile,
  PrimaryLink,
  SecondaryLink,
  SectionHeading,
  StatusPill,
} from "@/components/marketing/ui";
import { ReportTable, WeekCard } from "@/components/marketing/visuals";
import { readSession } from "@/lib/session";

const surfaces = [
  {
    id: "timesheet",
    icon: CalendarIcon,
    title: "The week",
    body: "Hours against projects and days. Totals and billable share update as you type, so Friday is a review, not a reconstruction.",
    link: "/product#timesheet",
  },
  {
    id: "approvals",
    icon: CheckBadgeIcon,
    title: "The decision",
    body: "A manager queue scoped to direct reports. Approve the week, or send it back with a note that reopens it as a draft.",
    link: "/product#approvals",
  },
  {
    id: "reporting",
    icon: BarsIcon,
    title: "The numbers",
    body: "Utilization by person and project, derived from submitted and approved hours only. Export the same record as CSV.",
    link: "/product#reporting",
  },
  {
    id: "audit",
    icon: LedgerIcon,
    title: "The record",
    body: "Every submission, rejection and approval keeps its actor, timestamp and detail. Nothing is overwritten silently.",
    link: "/product#audit",
  },
];

const steps = [
  {
    number: "01",
    title: "Draft",
    body: "Add hours by project and day. The week stays editable and shows its own totals.",
  },
  {
    number: "02",
    title: "Submit",
    body: "The week locks. The reviewer sees exactly what the employee sent, and nothing drifts underneath.",
  },
  {
    number: "03",
    title: "Review",
    body: "Approve, or reject with a note. A rejected week becomes editable again, and the note stays on screen.",
  },
  {
    number: "04",
    title: "Record",
    body: "Approved hours feed utilization and the audit log. The report reads the record, not a copy.",
  },
];

const roles = [
  {
    icon: CalendarIcon,
    name: "Employee",
    line: "Owns the week",
    points: ["Add, edit and delete entries", "Submit when the week is ready", "Read every note and decision"],
  },
  {
    icon: UsersIcon,
    name: "Manager",
    line: "Reviews the team",
    points: ["Sees direct reports only", "Approves or returns with a note", "Follows the team week at a glance"],
  },
  {
    icon: ShieldIcon,
    name: "Admin",
    line: "Keeps the ledger",
    points: ["Sees every team and project", "Manages projects and exports", "Reads the full audit log"],
  },
];

export default async function HomePage() {
  const user = await readSession();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Open dashboard" : "Open the demo";

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-olive-100 blur-3xl"
        />
        <Container className="relative grid items-center gap-14 py-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-10 lg:py-24">
          <div className="max-w-2xl">
            <Eyebrow className="mkt-enter">Timesheets · Approvals · Utilization</Eyebrow>
            <h1 className="mkt-enter mkt-enter-1 mt-5 text-[44px] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink sm:text-[62px] lg:text-[74px]">
              Every billable hour,{" "}
              <span className="text-olive-600">accounted for.</span>
            </h1>
            <p className="mkt-enter mkt-enter-2 mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
              Sundial is a small, complete timesheet product. Employees enter the week, managers
              approve it, and the business reads utilization from the same record — no spreadsheet
              handoffs, no second source of truth.
            </p>
            <div className="mkt-enter mkt-enter-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <PrimaryLink href={primaryHref}>{primaryLabel}</PrimaryLink>
              <SecondaryLink href="/workflow">See how a week moves</SecondaryLink>
            </div>
            <p className="mkt-enter mkt-enter-4 mt-5 text-sm leading-6 text-muted">
              Demo data included. Employee, manager and admin accounts. Nothing to install.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] pb-14 sm:pb-10 lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-x-6 top-10 h-full rounded-[28px] bg-olive-100/80"
            />
            <div className="mkt-enter mkt-enter-2 relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-40px_rgba(27,27,27,0.5)]">
              <div className="flex items-center gap-2 border-b border-line bg-cream-100 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-cream-300" />
                  <span className="h-2 w-2 rounded-full bg-cream-300" />
                  <span className="h-2 w-2 rounded-full bg-cream-300" />
                </span>
                <span className="mono ml-2 truncate text-[10px] text-muted">
                  sundial.app/timesheets/week-45
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <WeekCard />
              </div>
            </div>

            <div className="mkt-float [--mkt-rotate:2.5deg] absolute -bottom-2 right-0 hidden w-[228px] rounded-xl border border-line bg-white p-4 shadow-[0_24px_50px_-30px_rgba(27,27,27,0.55)] sm:block">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Approval
                </p>
                <StatusPill tone="blue">Approved</StatusPill>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">Week of Nov 2</p>
              <div className="mt-3 space-y-2 border-t border-line pt-3">
                <div className="flex items-center gap-2 text-[11px] text-ink">
                  <CheckBadgeIcon className="h-3.5 w-3.5 text-olive-600" />
                  Ravi Kumar · 40.0h
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <LockIcon className="h-3.5 w-3.5 text-olive-600" />
                  Reviewed by Arjun Mehta
                </div>
              </div>
            </div>

            <div className="mkt-float-slow [--mkt-rotate:-4deg] absolute -left-2 top-8 hidden w-[150px] rounded-xl border border-line bg-white p-3 shadow-[0_20px_44px_-28px_rgba(27,27,27,0.5)] lg:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Billable share
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">88%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                <div className="mkt-sweep h-full w-[88%] rounded-full bg-olive-600" />
              </div>
              <p className="mt-2 text-[9px] text-muted">35 of 40 hours</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-100">
        <Container>
          <dl className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
            {[
              ["40.0h", "A seeded week, ready to review"],
              ["88%", "Billable share, derived not typed"],
              ["3", "Roles enforced on the server"],
              ["23", "Automated tests in CI"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={index > 1 ? "border-t border-line py-6 md:border-t-0" : "py-6"}
              >
                <div className="md:px-6">
                  <dt className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[34px]">
                    {value}
                  </dt>
                  <dd className="mt-2 max-w-[200px] text-[13px] leading-5 text-muted">{label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              title={
                <>
                  Why use Sundial?
                </>
              }
              body="A timesheet should answer three questions without a meeting: what did I work on, who approved it, and what did it cost? Sundial stays narrow on purpose."
            />
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: CalendarIcon,
                title: "The week is the unit",
                body: "Not a task, not a running timer. A week is what gets submitted, locked, reviewed and reported. One boundary keeps the workflow honest.",
              },
              {
                icon: CheckBadgeIcon,
                title: "Decisions are explicit",
                body: "Approve, or send back with a note. Every state change carries an actor and a timestamp, so the history explains itself.",
              },
              {
                icon: BarsIcon,
                title: "Numbers have one source",
                body: "Billable share is derived from submitted hours, not copied into a second sheet. The report and the record never disagree.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <div className="h-full border-t-2 border-olive-600 pt-6">
                  <item.icon className="h-6 w-6 text-olive-600" />
                  <h3 className="mt-4 text-xl font-bold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-cream-100">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              title="Four small surfaces. One honest record."
              body="Most timesheet tools grow into project management suites. Sundial keeps the week, the decision and the numbers close together."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {surfaces.map((surface, index) => (
              <Reveal key={surface.id} delay={index * 70}>
                <Link
                  href={surface.link}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-olive-200 hover:shadow-[0_24px_50px_-36px_rgba(27,27,27,0.45)] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <IconTile>
                      <surface.icon className="h-5 w-5" />
                    </IconTile>
                    <ArrowUpRightIcon className="h-5 w-5 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-olive-600" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-[-0.025em] text-ink">
                    {surface.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-7 text-muted">{surface.body}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-olive-900 text-white">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-300">
                  The workflow
                </p>
                <h2 className="mt-4 text-[34px] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-[44px]">
                  A week with a clear ending.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-7 text-white/70">
                  Four states, one direction, and a visible hand-off at every step. Nobody has to
                  ask whether the week is still open.
                </p>
                <Link
                  href="/workflow"
                  className="mkt-link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                  Walk through the states
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 80}>
                  <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[64px_minmax(0,1fr)]">
                    <span className="mono pt-1 text-xs text-olive-300">{step.number}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                      <p className="mt-1 max-w-lg text-[14px] leading-6 text-white/65">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
            <Reveal>
              <div className="order-2 lg:order-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Reporting
                </p>
                <h2 className="mt-4 text-[34px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[44px]">
                  No spreadsheets. No chasing.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-7 text-muted">
                  Submitted and approved hours are the only inputs. Sundial derives billable share
                  by person and project, names the week in the export, and leaves the arithmetic in
                  one place.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Utilization by person and by project",
                    "CSV export with the week in the filename",
                    "Draft entries never reach the report",
                    "One query, one definition, one answer",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink">
                      <CheckBadgeIcon className="mt-0.5 h-4 w-4 shrink-0 text-olive-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/reporting"
                  className="mkt-link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold text-olive-600"
                >
                  Read the reporting rules
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="order-1 rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_-44px_rgba(27,27,27,0.45)] sm:p-7 lg:order-2">
                <ReportTable />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-100">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              title="One record. Three views."
              body="Authorization is enforced on the server and repeated in the query layer. A manager cannot review another manager's team, and an employee never sees the full ledger."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {roles.map((role, index) => (
              <Reveal key={role.name} delay={index * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <IconTile>
                      <role.icon className="h-5 w-5" />
                    </IconTile>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {role.line}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-ink">
                    {role.name}
                  </h3>
                  <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
                    {role.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13px] leading-5 text-muted">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-olive-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-10">
              <Link
                href="/roles"
                className="mkt-link-underline inline-flex items-center gap-2 text-sm font-semibold text-olive-600"
              >
                Compare the permission model
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-20">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Built in the open
                </p>
                <h2 className="mt-4 max-w-lg text-[34px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[44px]">
                  A working product, not a mockup.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-7 text-muted">
                  Sundial runs on Next.js and Cloudflare Workers, stores its data in Neon
                  PostgreSQL, and ships with tests, CI and deployment notes. The full source is
                  public.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="https://sundial.kp489292.workers.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 hover:text-olive-700"
                  >
                    Visit the live app
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://github.com/mundrukrishnaprasad/sundial"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 hover:text-olive-700"
                  >
                    Read the source
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Next.js 16", "App Router, server components"],
                  ["PostgreSQL", "Neon, serverless driver"],
                  ["Cloudflare", "Workers via OpenNext"],
                  ["Vitest", "23 domain tests in CI"],
                ].map(([value, label]) => (
                  <div key={value} className="rounded-xl border border-line bg-cream-100 px-5 py-5">
                    <p className="text-lg font-bold tracking-[-0.02em] text-ink">{value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-olive-100">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
            <Reveal>
              <div>
                <h2 className="max-w-xl text-[34px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[44px]">
                  Two minutes from entry to approval.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-7 text-ink/70">
                  Sign in as an employee, approve the week as a manager, then read the utilization
                  report as an admin. The demo data is already seeded.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <PrimaryLink href={primaryHref}>{primaryLabel}</PrimaryLink>
                  <Link
                    href="/login"
                    className="mkt-link-underline text-sm font-semibold text-ink"
                  >
                    See the demo accounts
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-5 backdrop-blur sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Demo accounts
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    ["Ravi Kumar", "ravi@sundial.app", "Employee"],
                    ["Arjun Mehta", "manager@sundial.app", "Manager"],
                    ["Maya Rao", "admin@sundial.app", "Admin"],
                  ].map(([name, email, role]) => (
                    <div
                      key={email}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-ink">{name}</p>
                        <p className="mono truncate text-[10px] text-muted">{email}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-line bg-cream-100 px-2 py-0.5 text-[9px] font-medium text-muted">
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] leading-5 text-muted">
                  Shared password: <span className="mono text-ink">Sundial!2026</span>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
