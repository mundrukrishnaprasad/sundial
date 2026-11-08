import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, Card, CardHeader, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { currentWeekStart, formatDate, formatWeekLabel, weekdayName } from "@/lib/dates";
import {
  getApprovals,
  getRecentTimesheets,
  getTimesheet,
  type RecentTimesheet,
  type TimesheetEntry,
} from "@/lib/queries";
import { formatHours, formatPercent, summarizeHours } from "@/lib/utilization";

export const metadata: Metadata = {
  title: "Dashboard",
};

function groupByDay(entries: TimesheetEntry[]): { date: string; entries: TimesheetEntry[] }[] {
  const map = new Map<string, TimesheetEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.work_date) ?? [];
    list.push(entry);
    map.set(entry.work_date, list);
  }
  return [...map.entries()]
    .map(([date, list]) => ({ date, entries: list }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function recentStatus(row: RecentTimesheet) {
  return <StatusBadge status={row.status} />;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const week = currentWeekStart();
  const firstName = user.name.split(" ")[0];
  const manager = canManage(user.role);

  const [current, recent, approvals] = await Promise.all([
    getTimesheet(user.id, week),
    getRecentTimesheets(user.id, 6),
    manager ? getApprovals(user) : Promise.resolve([]),
  ]);

  const summary = summarizeHours(current.entries);
  const days = groupByDay(current.entries);
  const latest = recent.find((row) => row.week_start === week);
  const latestStatus = latest?.status ?? "draft";
  const statusLabel =
    latestStatus.charAt(0).toUpperCase() + latestStatus.slice(1);

  return (
    <div>
      <PageHeader
        eyebrow={formatDate(week, { month: "long", day: "numeric", year: "numeric" })}
        title={`Good to see you, ${firstName}.`}
        description="Your week, the approvals waiting on you, and the last few weeks in one view."
        actions={
          <Link href="/timesheets" className="btn btn-primary">
            Open this week
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Hours this week"
          value={formatHours(summary.total)}
          detail={`${current.entries.length} ${current.entries.length === 1 ? "entry" : "entries"} so far`}
        />
        <Stat
          label="Billable"
          value={formatHours(summary.billable)}
          detail={`${formatHours(summary.nonBillable)} non-billable`}
        />
        <Stat
          label="Utilization"
          value={formatPercent(summary.utilization)}
          detail="Billable share of entered hours"
          accent
        />
        {manager ? (
          <Stat
            label="Awaiting review"
            value={String(approvals.length)}
            detail={approvals.length === 1 ? "Timesheet in the queue" : "Timesheets in the queue"}
          />
        ) : (
          <Stat
            label="Week status"
            value={statusLabel}
            detail={latest?.submitted_at ? "Submitted for review" : "Still editable"}
          />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader
            title="This week"
            description={formatWeekLabel(week)}
            action={
              <Link
                href="/timesheets"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-olive-700 hover:text-olive-900"
              >
                Edit week
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </Link>
            }
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-100/40 px-5 py-3 sm:px-6">
            <StatusBadge status={current.timesheet?.status ?? "draft"} />
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>
                <span className="font-medium text-ink">{formatHours(summary.billable)}</span>{" "}
                billable
              </span>
              <span>
                <span className="font-medium text-ink">{formatHours(summary.total)}</span> total
              </span>
            </div>
          </div>

          <div className="px-5 pb-4 sm:px-6">
            {days.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock3 className="h-5 w-5 text-olive-500" strokeWidth={1.6} />
                <p className="mt-3 font-display text-lg text-ink">The week is still open.</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
                  Add your first entry and the totals here will fill in as you go.
                </p>
                <Link href="/timesheets" className="btn btn-secondary btn-sm mt-4">
                  Add an entry
                </Link>
              </div>
            ) : (
              <div>
                {days.map((day) => {
                  const daySummary = summarizeHours(day.entries);
                  return (
                    <div key={day.date} className="border-b border-line/70 py-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                          {weekdayName(day.date)} · {formatDate(day.date)}
                        </p>
                        <p className="mono text-[10px] text-muted">{formatHours(daySummary.total)}</p>
                      </div>
                      <div className="mt-2 space-y-2">
                        {day.entries.map((entry) => (
                          <div key={entry.id} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm text-ink">
                                {entry.note || entry.project_name}
                              </p>
                              <p className="mono mt-0.5 text-[10px] text-muted">
                                {entry.project_code} · {entry.project_client}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {entry.billable ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-olive-700">
                                  <Check className="h-3 w-3" strokeWidth={2} />
                                  Billable
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted">Internal</span>
                              )}
                              <span className="w-12 text-right font-display text-base text-ink">
                                {Number(entry.hours).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-line px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>Billable share</span>
              <span className="font-medium text-ink">{formatPercent(summary.utilization)}</span>
            </div>
            <ProgressBar value={summary.utilization} className="mt-2" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader title="Recent weeks" description="Six most recent timesheets" />
            <div className="px-5 sm:px-6">
              {recent.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted">No weeks on record yet.</p>
              ) : (
                <ul className="divide-y divide-line/70">
                  {recent.map((row) => (
                    <li key={row.week_start}>
                      <Link
                        href={`/timesheets?week=${row.week_start}`}
                        className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-olive-800"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink">{formatWeekLabel(row.week_start)}</p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {formatHours(Number(row.total_hours))} ·{" "}
                            {formatHours(Number(row.billable_hours))} billable
                          </p>
                        </div>
                        {recentStatus(row)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {manager ? (
            <Card className="overflow-hidden">
              <CardHeader
                title="Waiting on you"
                description={approvals.length === 0 ? "The queue is clear" : "Oldest submissions first"}
                action={
                  approvals.length > 0 ? (
                    <Link
                      href="/approvals"
                      className="text-xs font-medium text-olive-700 hover:text-olive-900"
                    >
                      View all
                    </Link>
                  ) : undefined
                }
              />
              <div className="px-5 sm:px-6">
                {approvals.length === 0 ? (
                  <div className="flex items-center gap-2 py-6 text-xs text-muted">
                    <Check className="h-4 w-4 text-olive-600" strokeWidth={2} />
                    Nothing needs a decision right now.
                  </div>
                ) : (
                  <ul className="divide-y divide-line/70">
                    {approvals.slice(0, 4).map((row) => (
                      <li key={row.id}>
                        <Link
                          href={`/approvals/${row.id}`}
                          className="flex items-center gap-3 py-3 transition-colors hover:text-olive-800"
                        >
                          <Avatar name={row.user_name} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-ink">{row.user_name}</p>
                            <p className="mt-0.5 text-[10px] text-muted">
                              {formatWeekLabel(row.week_start)} ·{" "}
                              {formatHours(Number(row.total_hours))}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted" strokeWidth={1.8} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
