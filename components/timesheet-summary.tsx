import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui";
import { formatDate, formatDateTime, formatWeekLabel, weekdayName } from "@/lib/dates";
import type { Timesheet, TimesheetEntry } from "@/lib/queries";
import { formatHours, formatPercent, summarizeHours } from "@/lib/utilization";

function groupByDay(entries: TimesheetEntry[]) {
  const map = new Map<string, TimesheetEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.work_date) ?? [];
    list.push(entry);
    map.set(entry.work_date, list);
  }
  return [...map.entries()]
    .map(([date, list]) => ({ date, entries: list, summary: summarizeHours(list) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function TimesheetSummary({
  timesheet,
  entries,
  ownerName,
  showOwner = false,
}: {
  timesheet: Timesheet;
  entries: TimesheetEntry[];
  ownerName?: string;
  showOwner?: boolean;
}) {
  const summary = summarizeHours(entries);
  const days = groupByDay(entries);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="eyebrow">{formatWeekLabel(timesheet.week_start)}</p>
            <h2 className="mt-1 font-display text-2xl tracking-[-0.01em] text-ink">
              {showOwner && ownerName ? ownerName : "Weekly detail"}
            </h2>
            {showOwner && ownerName ? (
              <p className="mt-0.5 text-xs text-muted">Submitted by {ownerName}</p>
            ) : null}
          </div>
          <StatusBadge status={timesheet.status} />
        </div>

        <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Total</p>
            <p className="mt-1 font-display text-2xl text-ink">{formatHours(summary.total)}</p>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Billable</p>
            <p className="mt-1 font-display text-2xl text-ink">{formatHours(summary.billable)}</p>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Utilization
            </p>
            <p className="mt-1 font-display text-2xl text-ink">{formatPercent(summary.utilization)}</p>
          </div>
        </div>

        <dl className="grid gap-3 px-5 py-4 text-xs sm:grid-cols-2 sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <dt className="text-muted">Submitted</dt>
            <dd className="text-ink">{formatDateTime(timesheet.submitted_at)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <dt className="text-muted">Reviewed</dt>
            <dd className="text-ink">{formatDateTime(timesheet.reviewed_at)}</dd>
          </div>
        </dl>

        {timesheet.review_note ? (
          <div className="mx-5 mb-5 rounded-md border border-line bg-cream-100/60 px-3 py-2.5 sm:mx-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Reviewer note
            </p>
            <p className="mt-1 text-xs leading-5 text-ink">{timesheet.review_note}</p>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h3 className="font-display text-xl text-ink">Entries</h3>
          <p className="mt-0.5 text-xs text-muted">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} across {days.length}{" "}
            {days.length === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="px-5 sm:px-6">
          {days.length === 0 ? (
            <p className="py-10 text-center text-xs text-muted">No entries on this timesheet.</p>
          ) : (
            days.map((day) => (
              <section key={day.date} className="border-b border-line/70 py-4 last:border-b-0">
                <header className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                    {weekdayName(day.date)} · {formatDate(day.date)}
                  </p>
                  <p className="mono text-[10px] text-muted">{formatHours(day.summary.total)}</p>
                </header>
                <div className="mt-2 space-y-2">
                  {day.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between gap-4 rounded-md border border-line/70 bg-cream-50/50 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-ink">
                          {entry.note || entry.project_name}
                        </p>
                        <p className="mono mt-0.5 text-[10px] text-muted">
                          {entry.project_code} · {entry.project_client}
                          {entry.billable ? " · billable" : " · internal"}
                        </p>
                      </div>
                      <span className="shrink-0 font-display text-base text-ink">
                        {Number(entry.hours).toFixed(1)}h
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
