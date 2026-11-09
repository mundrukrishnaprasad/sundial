import type { Metadata } from "next";
import {
  CalendarIcon,
  CheckIcon,
  LockIcon,
  MinusIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/marketing/icons";
import { Reveal } from "@/components/marketing/reveal";
import { Container, CtaBand, PageIntro, StatusPill } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Roles",
  description:
    "Employee, manager and admin access in Sundial — what each role can see, change and export.",
};

const roles = [
  {
    icon: CalendarIcon,
    name: "Employee",
    tone: "neutral" as const,
    line: "Owns the week",
    body: "Writes the week, submits it, and reads every decision that comes back. Nothing outside their own record is visible.",
    can: [
      "Add, edit and delete entries while the week is open",
      "Submit a week when the totals are right",
      "Read the reviewer's note on a rejected week",
      "See the history of their own weeks",
    ],
    cannot: ["See another employee's week", "Approve or reject a week", "Open reports or the audit log"],
  },
  {
    icon: UsersIcon,
    name: "Manager",
    tone: "blue" as const,
    line: "Reviews the team",
    body: "Sees the weeks of their direct reports, makes the decision, and follows the team's week without seeing the rest of the company.",
    can: [
      "Review weeks from direct reports only",
      "Approve, or reject with a written note",
      "Read the team overview for any week",
      "Keep their own weekly timesheet",
    ],
    cannot: [
      "Review another manager's team",
      "Create, archive or restore projects",
      "Export utilization or read the audit log",
    ],
  },
  {
    icon: ShieldIcon,
    name: "Admin",
    tone: "green" as const,
    line: "Keeps the ledger",
    body: "Sees every team and project, runs the report, exports the CSV and reads the audit log. The only role with company-wide scope.",
    can: [
      "See every employee and manager",
      "Approve any submitted week",
      "Create, archive and restore projects",
      "Export utilization and read the audit log",
    ],
    cannot: ["Edit another person's timesheet entries"],
  },
];

const matrix: { label: string; employee: boolean; manager: boolean; admin: boolean }[] = [
  { label: "Manage own weekly timesheet", employee: true, manager: true, admin: true },
  { label: "Review weeks from direct reports", employee: false, manager: true, admin: true },
  { label: "See every team and project", employee: false, manager: false, admin: true },
  { label: "Create, archive or restore projects", employee: false, manager: false, admin: true },
  { label: "Read the utilization report and export CSV", employee: false, manager: false, admin: true },
  { label: "Read the audit log", employee: false, manager: false, admin: true },
];

const security = [
  {
    icon: LockIcon,
    title: "Session cookie",
    body: "A signed JWT in an HttpOnly, SameSite=Lax cookie with a seven-day expiry. The browser cannot read the token, and the server verifies it on every request.",
  },
  {
    icon: ShieldIcon,
    title: "Password storage",
    body: "PBKDF2 with SHA-256, 60,000 iterations and a random per-user salt. The plain password is never stored and never logged.",
  },
  {
    icon: UsersIcon,
    title: "Query-level scope",
    body: "Manager queries join on the reporting line. Admin-only pages redirect before rendering, and the API repeats the check instead of trusting the page.",
  },
  {
    icon: CheckIcon,
    title: "Guarded mutations",
    body: "Every write checks the session, the role, the week state and the request origin. A locked or already-reviewed week returns a conflict.",
  },
];

function MatrixCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-olive-100 text-olive-700">
      <CheckIcon className="h-3.5 w-3.5" />
      <span className="sr-only">Allowed</span>
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cream-100 text-muted">
      <MinusIcon className="h-3.5 w-3.5" />
      <span className="sr-only">Not allowed</span>
    </span>
  );
}

export default function RolesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Roles"
        title={
          <>
            Everyone sees
            <br />
            exactly their week.
          </>
        }
        body="Three roles, one record. Authorization is enforced on the server and repeated in the query layer — a hidden button is not a permission model."
      >
        <div className="flex flex-wrap gap-2">
          {["Employee", "Manager", "Admin"].map((role) => (
            <span
              key={role}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink"
            >
              {role}
            </span>
          ))}
        </div>
      </PageIntro>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {roles.map((role, index) => (
              <Reveal key={role.name} delay={index * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-olive-100 text-olive-700">
                      <role.icon className="h-5 w-5" />
                    </span>
                    <StatusPill tone={role.tone}>{role.name}</StatusPill>
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {role.line}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-[-0.025em] text-ink">
                    {role.name}
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-muted">{role.body}</p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-olive-700">
                      Can
                    </p>
                    <ul className="mt-3 space-y-2">
                      {role.can.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] leading-5 text-ink">
                          <CheckIcon className="mt-[3px] h-3.5 w-3.5 shrink-0 text-olive-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 border-t border-line pt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Cannot
                    </p>
                    <ul className="mt-3 space-y-2">
                      {role.cannot.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] leading-5 text-muted">
                          <MinusIcon className="mt-[3px] h-3.5 w-3.5 shrink-0 text-muted/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-100">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                Permission matrix
              </span>
              <span className="h-px w-8 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-2xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
              The whole model on one screen.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-9 overflow-hidden rounded-2xl border border-line bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead className="bg-white">
                    <tr className="border-b border-line text-[10px] uppercase tracking-[0.1em] text-muted">
                      <th className="px-5 py-4 font-semibold sm:px-7">Capability</th>
                      <th className="px-4 py-4 text-center font-semibold">Employee</th>
                      <th className="px-4 py-4 text-center font-semibold">Manager</th>
                      <th className="px-5 py-4 text-center font-semibold sm:px-7">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row) => (
                      <tr key={row.label} className="border-b border-line/70 last:border-b-0">
                        <td className="px-5 py-4 text-[13px] font-medium text-ink sm:px-7">
                          {row.label}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <MatrixCell allowed={row.employee} />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <MatrixCell allowed={row.manager} />
                        </td>
                        <td className="px-5 py-4 text-center sm:px-7">
                          <MatrixCell allowed={row.admin} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
          <p className="mt-4 text-[11px] leading-5 text-muted">
            Admin rows marked as allowed include company-wide scope. The manager column covers
            direct reports only.
          </p>
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  Security
                </p>
                <h2 className="mt-4 max-w-sm text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  The checks live on the server.
                </h2>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">
                  Roles are not a navigation trick. Each layer verifies the session and the scope
                  before it returns a row or accepts a write.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {security.map((item, index) => (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="h-full rounded-xl border border-line bg-cream-100 p-5">
                    <item.icon className="h-5 w-5 text-olive-600" />
                    <h3 className="mt-4 text-[15px] font-bold tracking-[-0.01em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-muted">{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <Reveal>
              <div>
                <h2 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.034em] text-ink sm:text-[38px]">
                  Four accounts, one password.
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-muted">
                  Use any account to inspect the app from that role. The demo database is seeded with
                  drafts, submitted weeks, an approved week and audit history.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <div className="space-y-2">
                  {[
                    ["Ravi Kumar", "ravi@sundial.app", "Employee"],
                    ["Sita Nair", "sita@sundial.app", "Employee"],
                    ["Arjun Mehta", "manager@sundial.app", "Manager"],
                    ["Maya Rao", "admin@sundial.app", "Admin"],
                  ].map(([name, email, role]) => (
                    <div
                      key={email}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-cream-100 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-ink">{name}</p>
                        <p className="mono truncate text-[10px] text-muted">{email}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-line bg-white px-2 py-0.5 text-[9px] font-medium text-muted">
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-line pt-4 text-[11px] text-muted">
                  Shared password: <span className="mono text-ink">Sundial!2026</span>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Try it"
        title="Sign in as each role and compare."
        body="The fastest way to understand the model is to open the same week from two accounts. The app will only show what the role is allowed to see."
        primaryHref="/login"
        primaryLabel="Open the demo"
        secondaryHref="/product"
        secondaryLabel="Back to product"
      />
    </>
  );
}
