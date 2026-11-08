import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock3,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { readSession } from "@/lib/session";

const metrics = [
  { value: "2 min", label: "to submit a full week" },
  { value: "3 roles", label: "employee, manager, admin" },
  { value: "1 record", label: "from entry to audit trail" },
];

const features = [
  {
    icon: Clock3,
    title: "A week, not a spreadsheet",
    body: "Enter hours against projects, day by day. Totals and billable share update as you type, so the week closes without a cleanup pass.",
  },
  {
    icon: Check,
    title: "Approvals with a paper trail",
    body: "Managers see only their team. Every approval, rejection, and resubmission is stamped with a note and kept in the audit log.",
  },
  {
    icon: BarChart3,
    title: "Utilization you can trust",
    body: "Billable hours divided by submitted hours, by person and by project. Export the week as CSV when finance asks for it.",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter the week",
    body: "Choose a project, a day, and a number of hours. Notes are optional but never hidden — the reviewer sees the same context you do.",
  },
  {
    number: "02",
    title: "Submit for review",
    body: "Submitting locks the week. A manager approves it or sends it back with a note. Rejected weeks reopen as drafts automatically.",
  },
  {
    number: "03",
    title: "Measure and export",
    body: "Approved and submitted hours roll into utilization by person and project. Export a clean CSV without rebuilding the numbers by hand.",
  },
];

const roles = [
  {
    name: "Employee",
    detail: "Owns the week. Adds, edits, deletes, and submits entries until the week is locked.",
  },
  {
    name: "Manager",
    detail: "Reviews direct reports only. Approves, rejects with a note, and keeps an eye on the team's week.",
  },
  {
    name: "Admin",
    detail: "Sees every team, manages projects, exports reports, and reads the full audit log.",
  },
];

const projectBars = [
  { code: "NW-DEL", name: "Northwind Delivery", hours: 34, width: 100 },
  { code: "ATL-PLAT", name: "Atlas Platform", hours: 22, width: 65 },
  { code: "NW-DISC", name: "Northwind Discovery", hours: 12, width: 35 },
  { code: "INT-OPS", name: "Internal Operations", hours: 9, width: 27 },
];

const weekRows = [
  { day: "Mon", code: "NW-DISC", note: "Discovery interviews", hours: "6.0", billable: true },
  { day: "Tue", code: "NW-DEL", note: "API implementation", hours: "7.0", billable: true },
  { day: "Wed", code: "NW-DEL", note: "Integration testing", hours: "8.0", billable: true },
  { day: "Thu", code: "ATL-PLAT", note: "Data model and migrations", hours: "6.0", billable: true },
  { day: "Fri", code: "ATL-PLAT", note: "Dashboard delivery", hours: "8.0", billable: true },
];

export default async function HomePage() {
  const user = await readSession();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Open dashboard" : "Open the demo";

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-line/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Sundial home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Primary">
            <a className="transition-colors hover:text-ink" href="#product">
              Product
            </a>
            <a className="transition-colors hover:text-ink" href="#workflow">
              Workflow
            </a>
            <a className="transition-colors hover:text-ink" href="#reporting">
              Reporting
            </a>
            <a className="transition-colors hover:text-ink" href="#roles">
              Roles
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? null : (
              <Link href="/login" className="btn btn-ghost btn-sm sm:h-9 sm:px-4 sm:text-sm">
                Sign in
              </Link>
            )}
            <Link href={primaryHref} className="btn btn-primary btn-sm sm:h-9 sm:px-4 sm:text-sm">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-line/80">
          <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-16 lg:py-24">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-olive-600" />
                Operations software for billable teams
              </p>
              <h1 className="mt-5 font-display text-[44px] leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[68px]">
                Every billable hour,
                <span className="block italic text-olive-700">accounted for.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                Sundial replaces the weekly spreadsheet ritual with a small, deliberate system:
                timesheets, approvals, and utilization that agree with each other.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={primaryHref} className="btn btn-primary h-11 px-5">
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </Link>
                <a href="#workflow" className="btn btn-secondary h-11 px-5">
                  See how a week moves
                </a>
              </div>
              <p className="mt-4 text-xs text-muted">
                Demo data included. Employee, manager, and admin accounts. Nothing to install.
              </p>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="font-display text-2xl tracking-[-0.02em] text-ink">
                      {metric.value}
                    </dt>
                    <dd className="mt-1 text-[11px] leading-4 text-muted">{metric.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-x-4 -inset-y-4 rounded-2xl border border-line/70 bg-cream-100/60"
                aria-hidden="true"
              />
              <div className="relative rounded-xl border border-line bg-paper shadow-[0_18px_50px_-30px_rgba(42,51,25,0.45)]">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      My timesheet
                    </p>
                    <p className="mt-1 font-display text-lg text-ink">Week of Mar 2</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-olive-200 bg-olive-50 px-2.5 py-1 text-[11px] font-medium text-olive-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-olive-600" />
                    Draft
                  </span>
                </div>
                <div className="px-5 py-2">
                  <div className="flex items-center justify-between border-b border-line py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                    <span>Day</span>
                    <span className="pr-2">Hours</span>
                  </div>
                  {weekRows.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between gap-3 border-b border-line/60 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="w-8 shrink-0 text-[11px] font-medium text-muted">
                          {row.day}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink">{row.note}</p>
                          <p className="mono mt-0.5 text-[10px] text-muted">{row.code}</p>
                        </div>
                      </div>
                      <span className="shrink-0 font-display text-lg text-ink">{row.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-b-xl border-t border-line bg-cream-100/60 px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Billable
                    </p>
                    <p className="mt-0.5 text-xs text-muted">35 of 35 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-ink">35.0h</p>
                    <p className="text-[11px] text-muted">week total</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-1 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-olive-600" strokeWidth={1.8} />
                  Locked on submit
                </span>
                <span>Reviewed by Arjun Mehta</span>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">The product</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl">
              Three small surfaces, one honest record.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Most timesheet tools grow into project management suites. Sundial stays narrow on
              purpose: the week goes in, a decision comes out, and the numbers stay traceable.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="card card-pad flex flex-col">
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-olive-200 bg-olive-50 text-olive-700">
                  <feature.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-xl tracking-[-0.01em] text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="border-y border-line bg-cream-100/50">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-24">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">The workflow</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl">
                A week moves through three hands.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Entry belongs to the employee, the decision belongs to the manager, and the record
                belongs to the business. Sundial keeps those boundaries visible.
              </p>
            </div>
            <ol className="space-y-4">
              {steps.map((step) => (
                <li key={step.number} className="card card-pad flex gap-5">
                  <span className="font-display text-2xl text-olive-500">{step.number}</span>
                  <div>
                    <h3 className="font-display text-xl tracking-[-0.01em] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="reporting" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="eyebrow">Reporting</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl">
                Utilization, without a second spreadsheet.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Submitted and approved hours are the only inputs. Sundial derives billable share by
                person and project, then hands finance a CSV with the week already named in the file.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Billable vs. non-billable split per person",
                  "Project totals with client and code",
                  "CSV export for the selected week",
                  "Audit trail behind every status change",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive-600" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card card-pad">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Utilization report</p>
                  <p className="mt-1 font-display text-xl text-ink">Week of Mar 2</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-cream-100 px-2.5 py-1.5 text-[11px] font-medium text-muted">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
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
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                      <div
                        className="h-full rounded-full bg-olive-600"
                        style={{ width: `${project.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <p className="text-xs text-muted">77.0 hours submitted</p>
                <p className="text-xs font-medium text-olive-800">74% billable</p>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="border-t border-line bg-cream-100/50">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Access</p>
                <h2 className="mt-3 font-display text-4xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl">
                  Everyone sees exactly their week.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted">
                Authorization is enforced on the server and repeated in the query layer. A manager
                cannot review another manager&apos;s team.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <article key={role.name} className="card card-pad">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl text-ink">{role.name}</h3>
                    <Users className="h-4 w-4 text-olive-500" strokeWidth={1.7} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{role.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="rounded-xl bg-olive-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-300">
              Try the working demo
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-[-0.02em] text-cream-50 sm:text-5xl">
              Close the week in a couple of minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-olive-200">
              Sign in as an employee, approve the week as a manager, then read the utilization
              report as an admin. The data resets only when the demo database says so.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={primaryHref}
                className="btn h-11 bg-cream-50 px-5 text-olive-900 hover:bg-cream-100"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <a
                href="#product"
                className="btn h-11 border border-olive-700 px-5 text-cream-100 hover:bg-olive-800"
              >
                Read the product notes
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-xs leading-5 text-muted">
              A working portfolio project: Next.js on Cloudflare Workers, Neon PostgreSQL, and a
              deliberately small feature set.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
            <a className="transition-colors hover:text-ink" href="#product">
              Product
            </a>
            <a className="transition-colors hover:text-ink" href="#workflow">
              Workflow
            </a>
            <a className="transition-colors hover:text-ink" href="#reporting">
              Reporting
            </a>
            <Link className="transition-colors hover:text-ink" href="/login">
              Sign in
            </Link>
          </div>
        </div>
        <div className="border-t border-line/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>© {new Date().getFullYear()} Sundial. Built as a demonstration, not a service.</p>
            <p className="mono">Next.js · Neon · Cloudflare</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
