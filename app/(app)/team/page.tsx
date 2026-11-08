import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { WeekNav } from "@/components/week-nav";
import {
  Avatar,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  ProgressBar,
  Stat,
} from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { formatWeekLabel } from "@/lib/dates";
import { resolveWeek } from "@/lib/params";
import { getTeamOverview } from "@/lib/queries";
import { formatHours, formatPercent } from "@/lib/utilization";

export const metadata: Metadata = {
  title: "Team",
};

export default async function TeamPage(props: {
  searchParams: Promise<{ week?: string | string[] }>;
}) {
  const user = await requireUser();
  if (!canManage(user.role)) redirect("/dashboard");

  const searchParams = await props.searchParams;
  const weekParam = Array.isArray(searchParams.week) ? searchParams.week[0] : searchParams.week;
  const week = resolveWeek(weekParam);
  const team = await getTeamOverview(user, week);

  const submitted = team.filter((row) => row.status === "submitted").length;
  const total = team.reduce((sum, row) => sum + Number(row.total_hours), 0);
  const billable = team.reduce((sum, row) => sum + Number(row.billable_hours), 0);
  const utilization = total > 0 ? Math.round((billable / total) * 100) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Team"
        title="The team's week"
        description={`${user.role === "admin" ? "All employees and managers" : "Your direct reports"} for ${formatWeekLabel(week)}.`}
        actions={<WeekNav weekStart={week} basePath="/team" />}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="People" value={String(team.length)} detail="In scope for this view" />
        <Stat label="Submitted" value={String(submitted)} detail="Waiting for a decision" />
        <Stat label="Hours" value={formatHours(total)} detail={formatHours(billable) + " billable"} />
        <Stat label="Utilization" value={formatPercent(utilization)} detail="Of entered hours" accent />
      </div>

      <div className="mt-6">
        {team.length === 0 ? (
          <EmptyState
            title="No team members yet"
            description="Once employees are assigned to you, their weeks will appear here with submitted hours and utilization."
          />
        ) : (
          <Card className="overflow-hidden">
            <CardHeader
              title="Overview"
              description={`Week of ${formatWeekLabel(week)} · ${submitted} awaiting review`}
            />
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Person</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Hours</th>
                    <th className="px-4 py-3 text-right">Billable</th>
                    <th className="px-4 py-3">Utilization</th>
                    <th className="px-5 py-3 text-right sm:px-6">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((row) => {
                    const rowTotal = Number(row.total_hours);
                    const rowBillable = Number(row.billable_hours);
                    const rowUtilization = rowTotal > 0 ? Math.round((rowBillable / rowTotal) * 100) : 0;

                    return (
                      <tr key={row.id}>
                        <td className="px-5 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={row.name} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                              <p className="truncate text-[10px] text-muted">{row.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-ink">
                          {formatHours(rowTotal)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-ink">
                          {formatHours(rowBillable)}
                        </td>
                        <td className="w-40 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ProgressBar value={rowUtilization} className="w-20" />
                            <span className="text-[11px] text-muted">
                              {formatPercent(rowUtilization)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right sm:px-6">
                          {row.timesheet_id ? (
                            <Link
                              href={`/timesheets/${row.timesheet_id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-olive-700 hover:text-olive-900"
                            >
                              View
                              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                            </Link>
                          ) : (
                            <span className="text-[11px] text-muted">No week yet</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
