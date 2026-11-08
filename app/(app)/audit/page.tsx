import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardHeader, EmptyState, PageHeader } from "@/components/ui";
import { canManage, requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { getAuditLog } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Audit log",
};

const actionLabels: Record<string, string> = {
  "auth.login": "Signed in",
  "entry.create": "Added an entry",
  "entry.update": "Edited an entry",
  "entry.delete": "Deleted an entry",
  "timesheet.submit": "Submitted a week",
  "timesheet.approve": "Approved a week",
  "timesheet.reject": "Sent a week back",
  "project.create": "Created a project",
  "project.update": "Updated a project",
};

function actionLabel(action: string): string {
  return actionLabels[action] ?? action;
}

function detailText(detail: Record<string, unknown>): string {
  const note = typeof detail.note === "string" ? detail.note.trim() : "";
  if (note) return note;
  const entries = Object.entries(detail).filter(([, value]) => value !== null && value !== "");
  if (entries.length === 0) return "—";
  return entries
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join(" · ");
}

export default async function AuditPage() {
  const user = await requireUser();
  if (!canManage(user.role)) redirect("/dashboard");

  const rows = await getAuditLog(100);

  return (
    <div>
      <PageHeader
        eyebrow="Audit log"
        title="Every change, in order"
        description="Logins, entry edits, submissions, decisions, and project changes. Newest first, capped at the last 100 events."
      />

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState
            title="Nothing logged yet"
            description="Actions taken in the demo will appear here with the actor, entity, and a short detail."
          />
        ) : (
          <Card className="overflow-hidden">
            <CardHeader title="Recent activity" description={`${rows.length} events`} />
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th className="px-5 py-3 sm:px-6">When</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Entity</th>
                    <th className="px-5 py-3 sm:px-6">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="whitespace-nowrap px-5 py-3 text-xs text-muted sm:px-6">
                        {formatDateTime(row.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink">
                        {row.actor_name ?? "System"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center rounded-full border border-line bg-cream-100 px-2 py-0.5 text-[10px] font-medium text-ink">
                          {actionLabel(row.action)}
                        </span>
                      </td>
                      <td className="mono whitespace-nowrap px-4 py-3 text-[10px] text-muted">
                        {row.entity}
                        {row.entity_id ? ` · ${row.entity_id.slice(0, 8)}` : ""}
                      </td>
                      <td className="px-5 py-3 text-xs leading-5 text-muted sm:px-6">
                        {detailText(row.detail)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
