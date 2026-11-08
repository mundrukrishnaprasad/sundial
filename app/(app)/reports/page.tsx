import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { WeekNav } from "@/components/week-nav";
import { Card, CardHeader, EmptyState, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { formatWeekLabel } from "@/lib/dates";
import { resolveWeek } from "@/lib/params";
import { getUtilizationReport } from "@/lib/queries";
import { formatHours, formatPercent } from "@/lib/utilization";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function ReportsPage(props: {
  searchParams: Promise<{ week?: string | string[] }>;
}) {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");

  const searchParams = await props.searchParams;
  const weekParam = Array.isArray(searchParams.week) ? searchParams.week[0] : searchParams.week;
  const week = resolveWeek(weekParam);
  const report = await getUtilizationReport(week);

  const total = report.totals.total;
  const projectHours = report.projects.reduce((sum, row) => sum + Number(row.total_hours), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Utilization"
        description={`Submitted and approved hours for ${formatWeekLabel(week)}. Admin-only; exports follow the same week selection.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <WeekNav weekStart={week} basePath="/reports" />
            <a href={`/api/reports/export?week=${week}`} className="btn btn-primary">
              <Download className="h-4 w-4" strokeWidth={1.8} />
              Export CSV
            </a>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total hours" value={formatHours(total)} detail="Submitted or approved" />
        <Stat label="Billable" value={formatHours(report.totals.billable)} detail="Client-facing work" />
        <Stat label="Non-billable" value={formatHours(report.totals.nonBillable)} detail="Internal and admin" />
        <Stat
          label="Utilization"
          value={formatPercent(report.totals.utilization)}
          detail={total > 0 ? `${formatHours(report.totals.billable)} of ${formatHours(total)}` : "No hours submitted"}
          accent
        />
      </div>

      <div className="mt-6 grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader title="By person" description="Only submitted or approved weeks are counted" />
          {report.people.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No people in scope"
                description="Employees and managers with a submitted week will appear here."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Person</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Billable</th>
                    <th className="px-4 py-3">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {report.people.map((person) => {
                    const personTotal = Number(person.total_hours);
                    const personBillable = Number(person.billable_hours);
                    const personUtilization =
                      personTotal > 0 ? Math.round((personBillable / personTotal) * 100) : 0;

                    return (
                      <tr key={person.id}>
                        <td className="px-5 py-3 sm:px-6">
                          <p className="text-sm font-medium text-ink">{person.name}</p>
                          <p className="text-[10px] text-muted">{person.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs capitalize text-muted">{person.role}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={person.status} />
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-ink">
                          {formatHours(personTotal)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-ink">
                          {formatHours(personBillable)}
                        </td>
                        <td className="w-44 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ProgressBar value={personUtilization} className="w-24" />
                            <span className="text-[11px] text-muted">
                              {formatPercent(personUtilization)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="By project" description="Active projects only; hours from submitted weeks" />
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th className="px-5 py-3 sm:px-6">Project</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Hours</th>
                  <th className="px-4 py-3">Share</th>
                </tr>
              </thead>
              <tbody>
                {report.projects.map((project) => {
                  const hours = Number(project.total_hours);
                  const share = projectHours > 0 ? Math.round((hours / projectHours) * 100) : 0;
                  return (
                    <tr key={project.id}>
                      <td className="px-5 py-3 text-sm text-ink sm:px-6">{project.name}</td>
                      <td className="mono px-4 py-3 text-[11px] text-muted">{project.code}</td>
                      <td className="px-4 py-3 text-xs text-muted">{project.client}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-muted">
                          {project.billable ? "Billable" : "Internal"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-ink">{formatHours(hours)}</td>
                      <td className="w-44 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={share} className="w-24" />
                          <span className="text-[11px] text-muted">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line bg-cream-100/40 px-5 py-3 text-[11px] text-muted sm:px-6">
            The CSV includes both tables, the selected week, and a generated timestamp.
          </div>
        </Card>
      </div>
    </div>
  );
}
