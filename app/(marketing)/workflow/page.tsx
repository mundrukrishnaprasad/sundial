import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckBadgeIcon,
  CheckIcon,
  LedgerIcon,
  LockIcon,
  MinusIcon,
} from "@/components/marketing/icons";
import { Reveal } from "@/components/marketing/reveal";
import { Container, CtaBand, PageIntro, StatusPill } from "@/components/marketing/ui";
import { ApprovalCard, AuditCard, WeekCard } from "@/components/marketing/visuals";

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "How a Sundial week moves from draft to submitted, review, approval or rejection — and back again.",
};

const states = [
  {
    name: "Draft",
    tone: "neutral" as const,
    summary: "The employee is still writing the week. Entries can be added, edited and deleted.",
    editable: true,
    icon: CalendarIcon,
  },
  {
    name: "Submitted",
    tone: "blue" as const,
    summary: "The week is locked and waiting for a decision. The reviewer sees exactly what was sent.",
    editable: false,
    icon: LockIcon,
  },
  {
    name: "Approved",
    tone: "green" as const,
    summary: "The final state. Approved hours feed utilization and stay in the audited record.",
    editable: false,
    icon: CheckBadgeIcon,
  },
  {
    name: "Rejected",
    tone: "red" as const,
    summary: "A reviewer sent the week back with a note. The week is editable again, and the note stays visible until the next change.",
    editable: true,
    icon: LedgerIcon,
  },
];

const transitions = [
  ["Add or edit an entry", "Draft → Draft", "Employee", "Own week, draft state"],
  ["Submit the week", "Draft → Submitted", "Employee", "At least one entry"],
  ["Approve the week", "Submitted → Approved", "Manager", "Direct report"],
  ["Reject the week", "Submitted → Rejected", "Manager", "A written note"],
  ["Edit a rejected week", "Rejected → Draft", "Employee", "The first change clears the note from the editor"],
  ["Resubmit", "Draft or rejected → Submitted", "Employee", "Changes addressed"],
];

export default function WorkflowPage() {
  return (
    <>
      <PageIntro
        eyebrow="Workflow"
        title={
          <>
            A week with a
            <br />
            clear ending.
          </>
        }
        body="Four states, one direction, and a visible hand-off at every step. Nobody has to ask whether the week is still open, and nobody edits a record after it has been reviewed."
      >
        <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_-44px_rgba(27,27,27,0.4)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {["Draft", "Submitted", "Approved"].map((state, index) => (
              <div key={state} className="flex flex-1 items-center gap-3">
                <div className="flex-1 rounded-lg border border-line bg-cream-100 px-4 py-3">
                  <p className="mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    State {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{state}</p>
                </div>
                {index < 2 ? (
                  <ArrowRightIcon className="h-4 w-4 shrink-0 rotate-90 text-muted sm:rotate-0" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700">
              Rejected
            </span>
            <span className="text-[11px] text-muted">
              reopens as a draft with the reviewer&apos;s note attached
            </span>
          </div>
        </div>
      </PageIntro>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                The states
              </span>
              <span className="h-px w-8 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-2xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
              Each state has one job.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {states.map((state, index) => (
              <Reveal key={state.name} delay={index * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive-100 text-olive-700">
                      <state.icon className="h-5 w-5" />
                    </span>
                    <StatusPill tone={state.tone}>{state.name}</StatusPill>
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-ink">
                    {state.name}
                  </h3>
                  <p className="mt-2 max-w-md text-[14px] leading-6 text-muted">{state.summary}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[12px]">
                    {state.editable ? (
                      <CheckIcon className="h-4 w-4 text-olive-600" />
                    ) : (
                      <MinusIcon className="h-4 w-4 text-muted" />
                    )}
                    <span className={state.editable ? "text-ink" : "text-muted"}>
                      {state.editable ? "Entries can change" : "Entries are read-only"}
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-100">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  Transitions
                </p>
                <h2 className="mt-4 text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  Who can move the week.
                </h2>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">
                  Authorization is checked in the route handler and again in the query. The table is
                  the actual rule set, not a summary of the UI.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead className="bg-cream-100">
                      <tr className="text-[10px] uppercase tracking-[0.1em] text-muted">
                        <th className="px-5 py-3 font-semibold">Action</th>
                        <th className="px-4 py-3 font-semibold">Transition</th>
                        <th className="px-4 py-3 font-semibold">Who</th>
                        <th className="px-5 py-3 font-semibold">Requires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transitions.map(([action, transition, who, requires]) => (
                        <tr key={action} className="border-t border-line/70">
                          <td className="px-5 py-3.5 text-[13px] font-medium text-ink">{action}</td>
                          <td className="mono px-4 py-3.5 text-[11px] text-muted">{transition}</td>
                          <td className="px-4 py-3.5 text-[12px] text-ink">{who}</td>
                          <td className="px-5 py-3.5 text-[12px] text-muted">{requires}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div>
                <div className="flex items-center gap-3">
                  <LockIcon className="h-5 w-5 text-olive-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                    The lock
                  </span>
                </div>
                <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  Review means read-only.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
                  Submitting freezes the week. If the employee could keep editing while a manager
                  reads it, approval would mean nothing — the reviewer might sign off on a number
                  that no longer exists.
                </p>
                <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted">
                  The lock is enforced server-side. A request to add an entry to a submitted week
                  returns a conflict, not a silently ignored write.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-line bg-cream-100 p-4 sm:p-7">
                <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
                  <WeekCard />
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-olive-50 px-3 py-2 text-[11px] text-olive-700">
                    <LockIcon className="h-3.5 w-3.5" />
                    This week is locked. Reopen it before adding entries.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-cream-100">
        <Container className="py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  The note
                </p>
                <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  A rejection has to say why.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
                  Sending a week back without a reason just moves the problem. Sundial requires a
                  note, makes the week editable again, and keeps the note on screen until the
                  employee makes a change.
                </p>
                <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted">
                  The note is not a chat message. The decision and its note stay in the audit log
                  beside the reviewer who made it.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:order-1">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_20px_50px_-40px_rgba(27,27,27,0.4)] sm:p-7">
                <ApprovalCard />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-600">
                  The record
                </p>
                <h2 className="mt-4 max-w-lg text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
                  Every step leaves a mark.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
                  Submission, rejection, resubmission and approval each write an audit row. The log
                  is append-only and readable by administrators, so a disputed week can be
                  reconstructed without asking anyone to remember.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Actor", "Action", "Entity", "Detail", "Timestamp"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-cream-100 px-3 py-1 text-[11px] font-medium text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-line bg-cream-100 p-4 sm:p-7">
                <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
                  <AuditCard />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Try it"
        title="Move a week through every state."
        body="The demo ships with seeded weeks in draft, submitted and approved states. Sign in as each role and watch the same record change shape."
        primaryHref="/login"
        primaryLabel="Open the demo"
        secondaryHref="/roles"
        secondaryLabel="Compare the roles"
      />
    </>
  );
}
