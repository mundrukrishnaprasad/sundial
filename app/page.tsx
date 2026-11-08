import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock3,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { readSession } from "@/lib/session";

const weekRows = [
  { day: "Mon", code: "NW-DISC", note: "Discovery interviews", hours: "6.0" },
  { day: "Tue", code: "NW-DEL", note: "API implementation", hours: "7.0" },
  { day: "Wed", code: "NW-DEL", note: "Integration testing", hours: "8.0" },
  { day: "Thu", code: "ATL-PLAT", note: "Data model and migrations", hours: "6.0" },
  { day: "Fri", code: "ATL-PLAT", note: "Dashboard delivery", hours: "8.0" },
];

const projectBars = [
  { code: "NW-DEL", name: "Northwind Delivery", hours: 18, width: 100 },
  { code: "ATL-PLAT", name: "Atlas Platform", hours: 12, width: 67 },
  { code: "NW-DISC", name: "Northwind Discovery", hours: 6, width: 33 },
  { code: "INT-OPS", name: "Internal Operations", hours: 4, width: 22 },
];

const features = [
  {
    icon: Clock3,
    title: "Enter the week",
    body: "Add hours against a project and a day. Totals and billable share update as you type, so the week closes without a cleanup pass.",
    visual: (
      <div className="mt-6 space-y-2">
        {[
          ["Mon", "NW-DISC", "6.0"],
          ["Tue", "NW-DEL", "7.0"],
          ["Wed", "NW-DEL", "8.0"],
        ].map(([day, code, hours]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-lg border border-line bg-cream-50 px-3 py-2"
          >
            <span className="w-8 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {day}
            </span>
            <span className="mono flex-1 truncate text-[11px] text-muted">{code}</span>
            <span className="text-sm font-medium text-ink">{hours}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Check,
    title: "Approve with context",
    body: "Managers see only their own team. Approve the week, or send it back with a note that reopens it as a draft.",
    visual: (
      <div className="mt-6 rounded-lg border border-line bg-cream-50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Reviewer note
        </p>
        <p className="mt-2 text-xs leading-5 text-ink">
          Please split Thursday between the two clients before I approve.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex h-7 items-center rounded-md bg-olive-600 px-2.5 text-[11px] font-medium text-white">
            Approve
          </span>
          <span className="inline-flex h-7 items-center rounded-md border border-line bg-paper px-2.5 text-[11px] font-medium text-ink">
            Send back
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: "Read utilization",
    body: "Billable hours divided by submitted hours, by person and by project, with a CSV export that names the week.",
    visual: (
      <div className="mt-6 rounded-lg border border-line bg-cream-50 p-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            This week
          </p>
          <p className="text-lg font-semibold text-ink">88%</p>
        </div>
        <div className="mt-3 space-y-2">
          {projectBars.slice(0, 3).map((project) => (
            <div key={project.code}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="mono truncate text-[10px] text-muted">{project.code}</span>
                <span className="text-[10px] text-muted">{project.hours}h</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-olive-600"
                  style={{ width: `${project.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Keep the record",
    body: "Logins, edits, submissions, decisions, and project changes stay in one audit log with the actor and the detail.",
    visual: (
      <div className="mt-6 space-y-2">
        {[
          ["09:12", "Ravi submitted week 45"],
          ["09:40", "Arjun rejected with a note"],
          ["10:05", "Ravi resubmitted week 45"],
        ].map(([time, text]) => (
          <div
            key={time}
            className="flex items-center gap-2 rounded-lg border border-line bg-cream-50 px-3 py-2"
          >
            <span className="mono text-[10px] text-muted">{time}</span>
            <span className="h-1 w-1 rounded-full bg-olive-500" />
            <span className="truncate text-[11px] text-ink">{text}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default async function HomePage() {
  const user = await readSession();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Open dashboard" : "Open the demo";

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebeaeb] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-[85px]">
          <Link href="/" aria-label="Sundial home">
            <Logo />
          </Link>
          <nav
            className="hidden items-center gap-8 text-[15px] text-ink md:flex"
            aria-label="Primary"
          >
            <a className="transition-colors hover:text-olive-600" href="#product">
              Product
            </a>
            <a className="transition-colors hover:text-olive-600" href="#workflow">
              Workflow
            </a>
            <a className="transition-colors hover:text-olive-600" href="#reporting">
              Reporting
            </a>
            <a className="transition-colors hover:text-olive-600" href="#roles">
              Roles
            </a>
          </nav>
          <Link
            href={primaryHref}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-olive-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-olive-700"
          >
            {user ? "Dashboard" : "Get started"}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </header>

      <main className="pt-[72px] lg:pt-[85px]">
        <section className="hero overflow-hidden bg-olive-300">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-6">
            <div className="pt-14 sm:pt-16 lg:pb-24 lg:pt-[120px]">
              <h1 className="max-w-xl text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[52px] lg:text-[60px] lg:leading-[64px]">
                Every billable hour, accounted for.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-7 text-ink/80 sm:text-xl sm:leading-7">
                Sundial turns the weekly timesheet into a calm, auditable record. Enter the week,
                approve it with a note, and read utilization without rebuilding a spreadsheet.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={primaryHref}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-5 text-lg font-semibold text-olive-600 transition-colors hover:text-olive-700"
                >
                  {primaryLabel}
                </Link>
                <a
                  href="#workflow"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-olive-700"
                >
                  See how a week moves
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
              <p className="mt-5 text-sm text-ink/70">
                Demo data included. Employee, manager, and admin accounts. Nothing to install.
              </p>
            </div>

            <div className="relative mx-auto h-[460px] w-full max-w-[440px] sm:h-[520px] lg:h-[620px] lg:max-w-none">
              <div className="absolute right-0 top-0 w-[215px] rotate-[10deg] sm:rotate-[16deg] rounded-2xl border border-white/70 bg-paper p-4 shadow-[0_28px_60px_-24px_rgba(27,27,27,0.5)] sm:w-[260px] lg:right-4 lg:top-20 lg:w-[280px] lg:rotate-[18deg] xl:right-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Utilization
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
                  </div>
                  <span className="rounded-full border border-olive-200 bg-olive-50 px-2 py-0.5 text-[9px] font-semibold text-olive-700">
                    88%
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {projectBars.map((project) => (
                    <div key={project.code}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[10px] text-ink">{project.name}</span>
                        <span className="mono shrink-0 text-[9px] text-muted">
                          {project.hours}h
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                        <div
                          className="h-full rounded-full bg-olive-600"
                          style={{ width: `${project.width}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="text-[9px] text-muted">40.0 hours submitted</span>
                  <span className="text-[9px] font-semibold text-olive-700">35h billable</span>
                </div>
              </div>

              <div className="absolute left-0 top-12 w-[235px] rotate-[10deg] sm:rotate-[16deg] rounded-2xl border border-white/70 bg-paper p-4 shadow-[0_28px_60px_-24px_rgba(27,27,27,0.5)] sm:w-[280px] lg:left-20 lg:top-36 lg:w-[310px] lg:rotate-[18deg] xl:left-24">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      My timesheet
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
                  </div>
                  <span className="rounded-full border border-olive-200 bg-olive-50 px-2 py-0.5 text-[9px] font-semibold text-olive-700">
                    Submitted
                  </span>
                </div>
                <div className="mt-3">
                  {weekRows.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center gap-2 border-b border-line/70 py-2 last:border-b-0"
                    >
                      <span className="w-7 shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                        {row.day}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] text-ink">{row.note}</p>
                        <p className="mono text-[8px] text-muted">{row.code}</p>
                      </div>
                      <span className="text-xs font-semibold text-ink">{row.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-cream-100 px-3 py-2">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Billable
                    </p>
                    <p className="text-[9px] text-muted">35 of 40 hours</p>
                  </div>
                  <p className="text-base font-semibold text-ink">40.0h</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20 text-center sm:px-8 lg:py-24">
          <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
            Why use Sundial?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-muted">
            A timesheet should answer three questions without a meeting: what did I work on, who
            approved it, and what did it cost? Sundial stays narrow on purpose.
          </p>
        </section>

        <section id="workflow" className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:pb-24">
          <h2 className="max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
            Submit without the spreadsheet
          </h2>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="rounded-2xl bg-olive-100 p-5 sm:p-8">
              <div className="rounded-xl border border-line bg-paper p-5 shadow-[0_16px_40px_-28px_rgba(27,27,27,0.4)]">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Approval
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
                  </div>
                  <span className="rounded-full border border-olive-200 bg-olive-50 px-2.5 py-1 text-[10px] font-semibold text-olive-700">
                    Needs review
                  </span>
                </div>
                <ol className="mt-4 space-y-4">
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive-600 text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">Submitted</p>
                      <p className="mt-0.5 text-[11px] text-muted">Mon 09:12 · Ravi Kumar</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-olive-300 bg-olive-50 text-[10px] font-semibold text-olive-700">
                      2
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">Reviewed by Arjun Mehta</p>
                      <p className="mt-0.5 text-[11px] text-muted">Tue 09:40 · one note</p>
                      <p className="mt-2 rounded-lg border border-line bg-cream-50 px-3 py-2 text-[11px] leading-5 text-ink">
                        Please split Thursday between the two clients.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-[10px] font-semibold text-muted">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">Resubmitted and approved</p>
                      <p className="mt-0.5 text-[11px] text-muted">Wed 10:05 · locked</p>
                    </div>
                  </li>
                </ol>
                <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[10px] text-muted">
                  <LockKeyhole className="h-3.5 w-3.5 text-olive-600" strokeWidth={1.8} />
                  A submitted week is read-only until it is sent back.
                </div>
              </div>
            </div>

            <div>
              <p className="text-base leading-7 text-muted">
                The week starts as a draft. Add hours against a project, check the totals, and
                submit. Submitting locks the record, so it cannot drift while a manager is reading
                it.
              </p>
              <p className="mt-4 text-base leading-7 text-muted">
                A manager approves it or sends it back with a note. A rejected week reopens as a
                draft, and the whole exchange stays in the audit log.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Project and day-level entries",
                  "Draft, submitted, approved, and rejected states",
                  "Rejection notes that reopen the week",
                  "A lock that holds while review is pending",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive-600" strokeWidth={2.4} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="product" className="bg-cream-100">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <h2 className="max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
              Four small surfaces. One honest record.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-muted">
              Most timesheet tools grow into project management suites. Sundial keeps the week, the
              decision, and the numbers close together.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="flex h-full flex-col rounded-2xl bg-paper p-6 shadow-[0_4px_12px_rgba(0,0,0,0.07),0_0_2px_rgba(0,0,0,0.06)] sm:p-8"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-olive-100 text-olive-600">
                    <feature.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.body}</p>
                  <div className="mt-auto">{feature.visual}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="reporting" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <h2 className="max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
            No spreadsheets. No chasing. No kidding.
          </h2>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-base leading-7 text-muted">
                Approved and submitted hours are the only inputs. Sundial derives billable share by
                person and project, names the week in the export, and leaves the arithmetic in one
                place.
              </p>
              <p className="mt-4 text-base leading-7 text-muted">
                There is no second worksheet, no copied formula, and no Friday afternoon
                reconciliation. The report reads the same records the reviewers already approved.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Utilization by person and project",
                  "CSV export with the week in the filename",
                  "Only submitted or approved hours count",
                  "Project totals with client and code",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive-600" strokeWidth={2.4} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 rounded-2xl border border-line bg-paper p-5 shadow-[0_16px_40px_-28px_rgba(27,27,27,0.35)] sm:p-8 lg:order-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Utilization report
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">Week of Nov 2</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-cream-100 px-3 py-1.5 text-[11px] font-medium text-muted">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                  CSV
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {projectBars.map((project) => (
                  <div key={project.code}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm text-ink">{project.name}</p>
                      <p className="mono shrink-0 text-xs text-muted">{project.hours}h</p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
                      <div
                        className="h-full rounded-full bg-olive-600"
                        style={{ width: `${project.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <p className="text-xs text-muted">40.0 hours submitted</p>
                <p className="text-xs font-semibold text-olive-700">88% billable</p>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="border-t border-line bg-cream-100">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
                Everyone sees exactly their week.
              </h2>
              <p className="mt-4 text-lg leading-7 text-muted">
                Authorization is enforced on the server and repeated in the query layer. A manager
                cannot review another manager&apos;s team, and an employee never sees the full
                ledger.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Clock3,
                  name: "Employee",
                  detail:
                    "Owns the week. Adds, edits, deletes, and submits entries until the week is locked.",
                },
                {
                  icon: Users,
                  name: "Manager",
                  detail:
                    "Reviews direct reports only. Approves, rejects with a note, and watches the team week.",
                },
                {
                  icon: ShieldCheck,
                  name: "Admin",
                  detail:
                    "Sees every team, manages projects, exports reports, and reads the full audit log.",
                },
              ].map((role) => (
                <article key={role.name} className="rounded-2xl border border-line bg-paper p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold tracking-[-0.02em] text-ink">
                      {role.name}
                    </h3>
                    <role.icon className="h-4 w-4 text-olive-500" strokeWidth={1.9} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{role.detail}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-olive-300 px-6 py-10 sm:px-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
                <div>
                  <h3 className="text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[34px]">
                    Two minutes from entry to approval.
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-ink/80">
                    Sign in as an employee, approve the week as a manager, then read the utilization
                    report as an admin. The demo data is already seeded.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={primaryHref}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-base font-semibold text-olive-600 transition-colors hover:text-olive-700"
                    >
                      {primaryLabel}
                    </Link>
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-olive-700"
                    >
                      See the demo accounts
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Demo accounts
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Ravi Kumar", "ravi@sundial.app", "Employee"],
                      ["Arjun Mehta", "manager@sundial.app", "Manager"],
                      ["Maya Rao", "admin@sundial.app", "Admin"],
                    ].map(([name, email, role]) => (
                      <div
                        key={email}
                        className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-3 py-2"
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
                  <p className="mt-3 text-[10px] leading-4 text-muted">
                    Shared password: <span className="mono text-ink">Sundial!2026</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Built in the open
              </p>
              <h2 className="mt-3 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
                A working product, not a mockup.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                Sundial runs on Next.js and Cloudflare Workers, stores its data in Neon PostgreSQL,
                and ships with tests, CI, and deployment notes. The full source is public.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="https://github.com/mundrukrishnaprasad/sundial"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 hover:text-olive-700"
                >
                  Read the source
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <a
                  href="https://github.com/mundrukrishnaprasad/sundial/blob/main/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 hover:text-olive-700"
                >
                  Deployment notes
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["40h", "Seeded week"],
                ["88%", "Billable share"],
                ["4", "Demo accounts"],
                ["23", "Unit tests"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-line bg-paper px-5 py-5">
                  <p className="text-2xl font-extrabold tracking-[-0.02em] text-ink">{value}</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-olive-900 text-cream-100">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <div>
              <Logo tone="light" />
              <p className="mt-4 max-w-xs text-sm leading-6 text-cream-100/80">
                Weekly timesheets, approvals, and utilization for teams that bill by the hour.
              </p>
              <p className="mt-4 text-xs text-cream-100/60">
                A portfolio project, not a commercial service.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-cream-50">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
                <li>
                  <a className="hover:text-white" href="#product">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="#workflow">
                    Workflow
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="#reporting">
                    Reporting
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="#roles">
                    Roles
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-cream-50">Demo</p>
              <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
                <li>
                  <Link className="hover:text-white" href="/login">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/reports">
                    Reports
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/audit">
                    Audit log
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-cream-50">Project</p>
              <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
                <li>
                  <a
                    className="hover:text-white"
                    href="https://github.com/mundrukrishnaprasad/sundial"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white"
                    href="https://github.com/mundrukrishnaprasad/sundial/blob/main/README.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    README
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white"
                    href="https://github.com/mundrukrishnaprasad/sundial/blob/main/docs/DEPLOYMENT.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Deployment
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream-100/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Sundial. Built as a demonstration.</p>
            <p className="mono">Next.js · Neon · Cloudflare</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
