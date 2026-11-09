import type { Metadata } from "next";
import { BarsIcon, LedgerIcon, LockIcon } from "@/components/marketing/icons";
import { Reveal } from "@/components/marketing/reveal";
import {
  CheckList,
  Container,
  CtaBand,
  PageIntro,
  StatusPill,
} from "@/components/marketing/ui";
import { ReportTable } from "@/components/marketing/visuals";

export const metadata: Metadata = {
  title: "Reporting",
  description:
    "How Sundial defines submitted hours, billable hours and utilization — and how the CSV export is built.",
};

const definitions = [
  {
    icon: BarsIcon,
    title: "Submitted hours",
    body: "Every hour on a week with status submitted or approved. Draft and rejected weeks are excluded entirely, not filtered entry by entry.",
  },
  {
    icon: LedgerIcon,
    title: "Billable hours",
    body: "Hours on projects marked billable. Billability is a property of the project, not a second flag that can disagree with the project record.",
  },
  {
    icon: LockIcon,
    title: "Utilization",
    body: "Billable hours divided by submitted hours, rounded to the nearest whole percent. A week with zero submitted hours reports 0%, not a blank cell.",
  },
];

export default function ReportingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Reporting"
        title={
          <>
            Numbers that match
            <br />
            the record.
          </>
        }
        body="One query produces the table, the totals and the CSV. The rules are small enough to state in a paragraph, and the same rules apply everywhere."
      >
        <dl className="grid max-w-2xl grid-cols-1 overflow-hidden rounded-xl border border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-line">
          {[
            ["40.0h", "Submitted"],
            ["35.0h", "Billable"],
            ["88%", "Utilization"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={index > 0 ? "border-t border-line px-5 py-4 sm:border-t-0" : "px-5 py-4"}
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </PageIntro>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <Reveal>
              <div className="rounded-2xl border border-line bg-cream-100 p-4 sm:p-7">
                <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
                  <ReportTable />
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="lg:pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  The report
                </p>
                <h2 className="mt-4 max-w-md text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  Read once, in one place.
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-muted">
                  Utilization is available per person and per project for any week. The totals at the
                  bottom of the page are the sum of the rows above them, not a separate calculation.
                </p>
                <CheckList
                  className="mt-6"
                  items={[
                    "People rows for employees and managers",
                    "Project rows for active projects, including zero-hour weeks",
                    "Totals computed from the same person rows",
                    "The week is always named on screen and in the file",
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-olive-900 text-white">
        <Container className="py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:items-center lg:gap-16">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-300">
                  The definition
                </p>
                <h2 className="mt-3 text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
                  One formula, written down.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur sm:p-8">
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Utilization
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-2xl font-semibold sm:text-3xl">Billable hours</span>
                  <span className="text-3xl font-light text-olive-300">÷</span>
                  <span className="text-2xl font-semibold sm:text-3xl">Submitted hours</span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-5">
                  <span className="mono text-sm text-white/60">35.0 ÷ 40.0</span>
                  <span className="text-white/40">=</span>
                  <span className="text-2xl font-extrabold text-white">0.875</span>
                  <span className="text-white/40">→</span>
                  <span className="rounded-lg bg-olive-600 px-3 py-1 text-2xl font-extrabold text-white">
                    88%
                  </span>
                </div>
                <p className="mt-5 max-w-xl text-[13px] leading-6 text-white/60">
                  Rounded to the nearest whole percent. The same value is used in the on-screen
                  table, the totals and the CSV.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                The rules
              </span>
              <span className="h-px w-8 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-2xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
              Three definitions, no exceptions.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {definitions.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive-100 text-olive-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-6 text-muted">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-10 rounded-2xl border border-line bg-cream-100 p-6 sm:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">
                    What never counts
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "Draft hours",
                      "Rejected weeks",
                      "Deleted entries",
                      "Admin accounts, which do not submit",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-muted">
                        <span className="mt-[11px] h-px w-3 shrink-0 bg-muted/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">
                    What always appears
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "Every employee and manager, even with no week",
                      "Every active project, even at zero hours",
                      "The reviewer note on a rejected week",
                      "The week start date in ISO format",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-muted">
                        <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-olive-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                    Export
                  </span>
                  <StatusPill>Admin only</StatusPill>
                </div>
                <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  The spreadsheet leaves with the week in its name.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
                  The export is generated from the same query as the screen. It is UTF-8 with a byte
                  order mark so Excel opens it cleanly, and it includes both the person table and
                  the project table.
                </p>
                <div className="mt-6 rounded-xl border border-line bg-cream-100 px-4 py-3">
                  <p className="mono text-[12px] text-ink">
                    sundial-utilization-2026-11-02.csv
                  </p>
                </div>
                <p className="mt-3 text-[12px] leading-5 text-muted">
                  The filename uses the week start date, not the export date.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Columns in the export
                </p>
                <div className="mt-4 overflow-hidden rounded-lg border border-line">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-cream-100">
                      <tr className="text-[10px] uppercase tracking-[0.08em] text-muted">
                        <th className="px-4 py-2.5 font-semibold">Section</th>
                        <th className="px-4 py-2.5 font-semibold">Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-line/70">
                        <td className="px-4 py-3 text-[12px] font-medium text-ink">Person</td>
                        <td className="px-4 py-3 text-[12px] leading-5 text-muted">
                          Name, email, role, status, total, billable, non-billable, utilization
                        </td>
                      </tr>
                      <tr className="border-t border-line/70">
                        <td className="px-4 py-3 text-[12px] font-medium text-ink">Project</td>
                        <td className="px-4 py-3 text-[12px] leading-5 text-muted">
                          Name, code, client, billable flag, hours
                        </td>
                      </tr>
                      <tr className="border-t border-line/70">
                        <td className="px-4 py-3 text-[12px] font-medium text-ink">Header</td>
                        <td className="px-4 py-3 text-[12px] leading-5 text-muted">
                          Week of, generated timestamp
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-[11px] leading-5 text-muted">
                  The report screen and the CSV export are both administrator-only. Employees and
                  managers see their own weeks and approvals instead.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Next"
        title="Check the numbers against the app."
        body="Open the demo as an admin, pick a week, and compare the report with the audit log. The same records feed both."
        primaryHref="/login"
        primaryLabel="Open the demo"
        secondaryHref="/roles"
        secondaryLabel="See the roles"
      />
    </>
  );
}
