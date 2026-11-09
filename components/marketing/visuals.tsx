import { CheckBadgeIcon, LockIcon } from "@/components/marketing/icons";
import { StatusPill } from "@/components/marketing/ui";

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

export function WeekCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            My timesheet
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
        </div>
        <StatusPill tone="blue">Submitted</StatusPill>
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">Billable</p>
          <p className="text-[9px] text-muted">35 of 40 hours</p>
        </div>
        <p className="text-base font-semibold text-ink">40.0h</p>
      </div>
    </div>
  );
}

export function UtilizationCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Utilization
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
        </div>
        <StatusPill tone="blue">88%</StatusPill>
      </div>
      <div className="mt-4 space-y-3">
        {projectBars.map((project) => (
          <div key={project.code}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[10px] text-ink">{project.name}</span>
              <span className="mono shrink-0 text-[9px] text-muted">{project.hours}h</span>
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
  );
}

export function ApprovalCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Approval
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
        </div>
        <StatusPill tone="blue">Needs review</StatusPill>
      </div>
      <ol className="mt-4 space-y-4">
        <li className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive-600 text-white">
            <CheckBadgeIcon className="h-3 w-3" strokeWidth={3} />
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
        <LockIcon className="h-3.5 w-3.5 text-olive-600" />
        A submitted week is read-only until it is sent back.
      </div>
    </div>
  );
}

const auditRows = [
  ["09:12", "Ravi submitted week 45"],
  ["09:40", "Arjun rejected with a note"],
  ["10:05", "Ravi resubmitted week 45"],
  ["10:31", "Arjun approved week 45"],
];

export function AuditCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Audit log
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Four events, one week</p>
        </div>
        <StatusPill>Read-only</StatusPill>
      </div>
      <div className="mt-3">
        {auditRows.map(([time, text]) => (
          <div
            key={time}
            className="flex items-center gap-2 border-b border-line/70 px-1 py-2.5 last:border-b-0"
          >
            <span className="mono w-9 shrink-0 text-[9px] text-muted">{time}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-olive-500" />
            <span className="truncate text-[11px] text-ink">{text}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[9px] leading-4 text-muted">
        Actor, action, entity and detail stay attached to every change.
      </p>
    </div>
  );
}

const reportRows = [
  { name: "Ravi Kumar", role: "Employee", submitted: "40.0", billable: "35.0", utilization: "88%" },
  { name: "Sita Nair", role: "Employee", submitted: "38.0", billable: "31.0", utilization: "82%" },
  { name: "Arjun Mehta", role: "Manager", submitted: "36.0", billable: "22.0", utilization: "61%" },
];

export function ReportTable({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Utilization report
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">Week of Nov 2</p>
        </div>
        <StatusPill>CSV ready</StatusPill>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        <table className="w-full border-collapse text-left">
          <thead className="bg-cream-100">
            <tr className="text-[9px] uppercase tracking-[0.08em] text-muted">
              <th className="px-3 py-2 font-semibold">Person</th>
              <th className="px-2 py-2 text-right font-semibold">Submitted</th>
              <th className="px-2 py-2 text-right font-semibold">Billable</th>
              <th className="px-3 py-2 text-right font-semibold">Util.</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row) => (
              <tr key={row.name} className="border-t border-line/70">
                <td className="px-3 py-2.5">
                  <p className="text-[11px] font-medium text-ink">{row.name}</p>
                  <p className="text-[9px] text-muted">{row.role}</p>
                </td>
                <td className="mono px-2 py-2.5 text-right text-[10px] text-ink">{row.submitted}</td>
                <td className="mono px-2 py-2.5 text-right text-[10px] text-ink">{row.billable}</td>
                <td className="px-3 py-2.5 text-right text-[10px] font-semibold text-olive-700">
                  {row.utilization}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[9px] leading-4 text-muted">
        Only submitted or approved hours count. Draft entries never reach the report.
      </p>
    </div>
  );
}
