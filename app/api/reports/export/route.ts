import { apiError, getApiUser } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import { resolveWeek } from "@/lib/params";
import { getUtilizationReport } from "@/lib/queries";
import { roundHours } from "@/lib/utilization";

export async function GET(request: Request) {
  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);
  if (user.role !== "admin") return apiError("Only admins can export reports.", 403);

  const url = new URL(request.url);
  const week = resolveWeek(url.searchParams.get("week"));
  const report = await getUtilizationReport(week);

  const rows: unknown[][] = [
    ["Sundial utilization export"],
    ["Week of", week],
    ["Generated", new Date().toISOString()],
    [],
    ["Employee", "Email", "Role", "Status", "Total hours", "Billable hours", "Non-billable hours", "Utilization %"],
  ];

  for (const person of report.people) {
    const total = Number(person.total_hours);
    const billable = Number(person.billable_hours);
    rows.push([
      person.name,
      person.email,
      person.role,
      person.status ?? "not started",
      roundHours(total),
      roundHours(billable),
      roundHours(total - billable),
      total > 0 ? Math.round((billable / total) * 100) : 0,
    ]);
  }

  rows.push(
    [],
    ["Project", "Code", "Client", "Billable", "Hours"],
  );

  for (const project of report.projects) {
    rows.push([
      project.name,
      project.code,
      project.client,
      project.billable ? "yes" : "no",
      roundHours(Number(project.total_hours)),
    ]);
  }

  const csv = `\uFEFF${toCsv(rows)}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sundial-utilization-${week}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
