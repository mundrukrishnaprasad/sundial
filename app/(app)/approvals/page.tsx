import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, Card, CardHeader, EmptyState, PageHeader, Stat } from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { formatDateTime, formatWeekLabel } from "@/lib/dates";
import { getApprovals } from "@/lib/queries";
import { formatHours } from "@/lib/utilization";

export const metadata: Metadata = {
  title: "Approvals",
};

export default async function ApprovalsPage() {
  const user = await requireUser();
  if (!canManage(user.role)) redirect("/dashboard");

  const approvals = await getApprovals(user);
  const totalHours = approvals.reduce((sum, row) => sum + Number(row.total_hours), 0);
  const billableHours = approvals.reduce((sum, row) => sum + Number(row.billable_hours), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Approvals"
        title="The review queue"
        description={
          approvals.length === 0
            ? "Every submitted week has been reviewed. New submissions appear here."
            : "Submitted weeks, oldest first. Open one to see the entries before deciding."
        }
        actions={
          <div className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-olive-600" />
            {approvals.length} {approvals.length === 1 ? "week" : "weeks"} waiting
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="In the queue" value={String(approvals.length)} detail="Submitted timesheets" />
        <Stat label="Hours to review" value={formatHours(totalHours)} detail="Across all submissions" />
        <Stat
          label="Billable share"
          value={totalHours > 0 ? `${Math.round((billableHours / totalHours) * 100)}%` : "0%"}
          detail={formatHours(billableHours) + " billable"}
          accent
        />
      </div>

      <div className="mt-6">
        {approvals.length === 0 ? (
          <EmptyState
            title="The queue is clear"
            description="There are no submitted timesheets waiting for you. Approved and rejected weeks remain available in the team view."
            action={
              <Link href="/team" className="btn btn-secondary btn-sm">
                Open the team view
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </Link>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <CardHeader
              title="Awaiting review"
              description={`${user.role === "admin" ? "All teams" : "Your direct reports"} · oldest submission first`}
            />
            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_100px_100px_90px] items-center gap-4 border-b border-line px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted sm:grid sm:px-6">
              <span>Employee</span>
              <span>Week</span>
              <span>Submitted</span>
              <span className="text-right">Hours</span>
              <span className="text-right">Billable</span>
              <span />
            </div>
            <ul className="divide-y divide-line/70">
              {approvals.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/approvals/${row.id}`}
                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream-100/50 sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_100px_100px_90px] sm:items-center sm:gap-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={row.user_name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{row.user_name}</p>
                        <p className="truncate text-[10px] text-muted">{row.user_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:hidden">
                      <StatusBadge status={row.status} />
                      <span className="text-[11px] text-muted">{formatWeekLabel(row.week_start)}</span>
                    </div>
                    <span className="hidden text-xs text-muted sm:block">
                      {formatWeekLabel(row.week_start)}
                    </span>
                    <span className="hidden text-xs text-muted sm:block">
                      {formatDateTime(row.submitted_at)}
                    </span>
                    <div className="flex items-center justify-between gap-3 sm:contents">
                      <span className="text-xs text-muted sm:hidden">Hours</span>
                      <span className="text-right text-sm text-ink sm:block">
                        {formatHours(Number(row.total_hours))}
                      </span>
                      <span className="text-xs text-muted sm:hidden">Billable</span>
                      <span className="text-right text-sm text-ink sm:block">
                        {formatHours(Number(row.billable_hours))}
                      </span>
                    </div>
                    <span className="inline-flex items-center justify-end gap-1 text-xs font-medium text-olive-700">
                      Review
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 border-t border-line bg-cream-100/40 px-5 py-3 text-[11px] text-muted sm:px-6">
              <Check className="h-3.5 w-3.5 text-olive-600" strokeWidth={2} />
              Approving or rejecting writes to the audit log and notifies the employee on their next
              visit.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
