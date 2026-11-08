import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TimesheetSummary } from "@/components/timesheet-summary";
import { PageHeader } from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { formatWeekLabel } from "@/lib/dates";
import { getTimesheetById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Timesheet",
};

export default async function TimesheetDetailPage(props: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await props.params;
  const data = await getTimesheetById(id, user);
  if (!data) notFound();

  const { timesheet, entries, owner } = data;
  const isOwn = owner.id === user.id;
  const canReview = canManage(user.role) && timesheet.status === "submitted";

  return (
    <div>
      <PageHeader
        eyebrow={`Timesheet · ${formatWeekLabel(timesheet.week_start)}`}
        title={isOwn ? "Your week" : owner.name}
        description={
          isOwn
            ? "A read-only view of this week. Use the timesheet editor to make changes."
            : `Submitted by ${owner.email}.`
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href={isOwn ? "/timesheets" : "/team"} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              {isOwn ? "Back to editor" : "Back to team"}
            </Link>
            {canReview ? (
              <Link href={`/approvals/${timesheet.id}`} className="btn btn-primary">
                Review week
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="mt-6 max-w-4xl">
        <TimesheetSummary
          timesheet={timesheet}
          entries={entries}
          ownerName={owner.name}
          showOwner={!isOwn}
        />
      </div>
    </div>
  );
}
