import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { WeekNav } from "@/components/week-nav";
import { TimesheetEditor } from "@/components/timesheet-editor";
import { requireUser } from "@/lib/auth";
import { formatWeekLabel } from "@/lib/dates";
import { resolveWeek } from "@/lib/params";
import { getActiveProjects, getOrCreateTimesheet, getTimesheet } from "@/lib/queries";

export const metadata: Metadata = {
  title: "My timesheet",
};

export default async function TimesheetsPage(props: {
  searchParams: Promise<{ week?: string | string[] }>;
}) {
  const user = await requireUser();
  const searchParams = await props.searchParams;
  const weekParam = Array.isArray(searchParams.week) ? searchParams.week[0] : searchParams.week;
  const week = resolveWeek(weekParam);

  await getOrCreateTimesheet(user.id, week);
  const [data, projects] = await Promise.all([getTimesheet(user.id, week), getActiveProjects()]);

  if (!data.timesheet) {
    return null;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Timesheets"
        title="My timesheet"
        description={`${formatWeekLabel(week)}. Add hours against a project, then submit the week when it is complete.`}
        actions={<WeekNav weekStart={week} basePath="/timesheets" />}
      />
      <TimesheetEditor
        timesheet={data.timesheet}
        entries={data.entries}
        projects={projects.map((project) => ({
          id: project.id,
          code: project.code,
          name: project.name,
          client: project.client,
          billable: project.billable,
        }))}
        weekStart={week}
      />
    </div>
  );
}
