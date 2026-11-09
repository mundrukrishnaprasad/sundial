import type { Metadata } from "next";
import Link from "next/link";
import {
  BarsIcon,
  CalendarIcon,
  CheckBadgeIcon,
  LedgerIcon,
  LockIcon,
} from "@/components/marketing/icons";
import { Reveal } from "@/components/marketing/reveal";
import {
  CheckList,
  Container,
  CtaBand,
  PageIntro,
  StatusPill,
} from "@/components/marketing/ui";
import { ApprovalCard, AuditCard, ReportTable, WeekCard } from "@/components/marketing/visuals";
import { cn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Product",
  description:
    "The four surfaces of Sundial: the weekly timesheet, manager approvals, utilization reporting and the audit log.",
};

const index = [
  { href: "#timesheet", label: "Timesheet", icon: CalendarIcon },
  { href: "#approvals", label: "Approvals", icon: CheckBadgeIcon },
  { href: "#reporting", label: "Reporting", icon: BarsIcon },
  { href: "#audit", label: "Audit log", icon: LedgerIcon },
];

function Feature({
  id,
  number,
  eyebrow,
  title,
  body,
  points,
  visual,
  flip = false,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  points: React.ReactNode[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-line bg-white">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className={cn(flip && "lg:order-2")}>
            <div>
              <div className="flex items-center gap-3">
                <span className="mono text-xs text-muted">{number}</span>
                <span className="h-px w-8 bg-line" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  {eyebrow}
                </span>
              </div>
              <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                {title}
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">{body}</p>
              <CheckList className="mt-7" items={points} />
            </div>
          </Reveal>
          <Reveal delay={100} className={cn(flip && "lg:order-1")}>
            <div className="rounded-2xl border border-line bg-cream-100 p-4 sm:p-7">
              <div className="rounded-xl border border-line bg-white p-5 shadow-[0_20px_50px_-40px_rgba(27,27,27,0.5)] sm:p-6">
                {visual}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default function ProductPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product"
        title={
          <>
            Four surfaces.
            <br />
            One honest record.
          </>
        }
        body="Sundial does the small set of things a billable week needs, and it does them against one database. Pick a surface to see exactly what it holds."
      >
        <div className="flex flex-wrap gap-2">
          {index.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-medium text-ink transition-colors hover:border-olive-300 hover:text-olive-700"
            >
              <item.icon className="h-4 w-4 text-olive-600" />
              {item.label}
            </Link>
          ))}
        </div>
      </PageIntro>

      <Feature
        id="timesheet"
        number="01"
        eyebrow="Timesheet"
        title="A week you can read at a glance."
        body="The editor is the product. Add hours against a project and a day, and the week totals itself. There is no save-and-recalculate step and no hidden formula."
        points={[
          "Project and day-level entries with an optional note",
          "Live totals for submitted, billable and non-billable hours",
          "Drafts persist between sessions until the week is submitted",
          "Read-only the moment the week is submitted",
        ]}
        visual={<WeekCard />}
      />

      <Feature
        id="approvals"
        number="02"
        eyebrow="Approvals"
        title="A decision with the evidence attached."
        body="A manager sees the week as the employee sent it, scoped to their own direct reports. Approval is one action; sending it back requires a note that the employee will read."
        points={[
          "A queue of weeks that are waiting on a decision",
          "Manager scope enforced in the query, not just the UI",
          "Rejection makes the week editable again, with the note on screen",
          "Approval locks the week and writes an audit row",
        ]}
        visual={<ApprovalCard />}
        flip
      />

      <Feature
        id="reporting"
        number="03"
        eyebrow="Reporting"
        title="One definition of billable."
        body="Reports read submitted and approved hours directly. Billable share is derived in one place, so the number in the table and the number in the export cannot drift apart."
        points={[
          "Utilization by person and by project",
          "Only submitted or approved hours count toward the report",
          "CSV export names the week it covers",
          "Draft hours stay out of every total",
        ]}
        visual={<ReportTable />}
      />

      <Feature
        id="audit"
        number="04"
        eyebrow="Audit log"
        title="A history that explains itself."
        body="Every meaningful change writes a row: who acted, what changed, which record, and when. The log is read-only, and it is the first place to look when a number is questioned."
        points={[
          "Logins, edits, submissions, rejections and approvals",
          "Actor, action, entity and detail on every row",
          "Project changes are recorded too",
          "Read-only surface for administrators",
        ]}
        visual={<AuditCard />}
        flip
      />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                Scope
              </span>
              <span className="h-px w-8 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-2xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
              Stated plainly, so nobody expects a suite.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive-100 text-olive-700">
                    <CheckBadgeIcon className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">In the product</h3>
                </div>
                <CheckList
                  className="mt-5"
                  items={[
                    "Weekly timesheets with project and day entries",
                    "Submit, approve and reject with a note",
                    "Role-scoped dashboards for employee, manager and admin",
                    "Utilization reports and CSV export",
                    "Project create, archive and restore",
                    "An audit log with actor and detail",
                  ]}
                />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-2xl border border-line bg-cream-100 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-muted">
                    <LockIcon className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">
                    Deliberately out
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {[
                    "Invoicing and payment collection",
                    "Leave, expense and payroll management",
                    "Native mobile applications",
                    "Single sign-on and directory sync",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-muted">
                      <span className="mt-[11px] h-px w-3 shrink-0 bg-muted/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-line pt-4 text-[12px] leading-5 text-muted">
                  Sundial is a portfolio product. These are scope decisions, not missing pages.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-cream-100">
        <Container className="py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <StatusPill tone="blue">Open the demo</StatusPill>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-muted">
                The seeded data follows one week from draft to approval, with enough history to make
                the audit log and the report read like real work.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-olive-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-olive-700"
            >
              Sign in with a demo account
            </Link>
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Next"
        title="See the states a week moves through."
        body="The workflow page walks through draft, submitted, review and the record — including what happens when a week is sent back."
        primaryHref="/workflow"
        primaryLabel="Read the workflow"
        secondaryHref="/reporting"
        secondaryLabel="Reporting rules"
      />
    </>
  );
}
