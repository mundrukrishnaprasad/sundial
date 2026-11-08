import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ReviewActions } from "@/components/review-actions";
import { TimesheetSummary } from "@/components/timesheet-summary";
import { PageHeader } from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { formatWeekLabel } from "@/lib/dates";
import { getTimesheetById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Review timesheet",
};

export default async function ApprovalDetailPage(props: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!canManage(user.role)) redirect("/dashboard");

  const { id } = await props.params;
  const data = await getTimesheetById(id, user);
  if (!data) notFound();

  const { timesheet, entries, owner } = data;
  const canReview = timesheet.status === "submitted";

  return (
    <div>
      <PageHeader
        eyebrow={`Approvals · ${formatWeekLabel(timesheet.week_start)}`}
        title={owner.name}
        description={`${entries.length} ${entries.length === 1 ? "entry" : "entries"} submitted by ${owner.email}. Review the detail before deciding.`}
        actions={
          <Link href="/approvals" className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to queue
          </Link>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <TimesheetSummary
          timesheet={timesheet}
          entries={entries}
          ownerName={owner.name}
          showOwner
        />

        <div className="space-y-6 lg:sticky lg:top-6">
          {canReview ? (
            <ReviewActions timesheetId={timesheet.id} />
          ) : (
            <div className="card card-pad">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-olive-200 bg-olive-50">
                  <CheckCircle2 className="h-4 w-4 text-olive-700" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-display text-lg text-ink">No decision needed</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    This week is {timesheet.status}. Only submitted timesheets can be approved or
                    sent back.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="card card-pad">
            <p className="eyebrow">Review checklist</p>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 text-muted">
              <li>Does every day reflect the work that was actually done?</li>
              <li>Are internal hours separated from client work?</li>
              <li>Is a single day above 24 hours? It cannot be submitted.</li>
              <li>If something is off, send it back with a specific note.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
