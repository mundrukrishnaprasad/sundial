"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Lock, Pencil, Plus, Send, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import {
  formatDate,
  formatWeekLabel,
  parseDateOnly,
  toDateOnly,
  weekDays,
  weekdayName,
} from "@/lib/dates";
import type { Timesheet, TimesheetEntry } from "@/lib/queries";
import { formatHours, formatPercent, summarizeHours } from "@/lib/utilization";
import { cn } from "@/lib/ui";

type ProjectOption = {
  id: string;
  code: string;
  name: string;
  client: string;
  billable: boolean;
};

export function TimesheetEditor({
  timesheet,
  entries,
  projects,
  weekStart,
}: {
  timesheet: Timesheet;
  entries: TimesheetEntry[];
  projects: ProjectOption[];
  weekStart: string;
}) {
  const router = useRouter();
  const days = weekDays(weekStart);
  const today = toDateOnly(new Date());
  const [addDate, setAddDate] = useState(days.includes(today) ? today : days[0]);
  const [addProject, setAddProject] = useState(projects[0]?.id ?? "");
  const [addHours, setAddHours] = useState("");
  const [addNote, setAddNote] = useState("");
  const [editing, setEditing] = useState<{
    id: string;
    projectId: string;
    hours: string;
    note: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locked = timesheet.status === "submitted" || timesheet.status === "approved";
  const editable = !locked;
  const summary = summarizeHours(entries);

  const grouped = useMemo(() => {
    const map = new Map<string, TimesheetEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.work_date) ?? [];
      list.push(entry);
      map.set(entry.work_date, list);
    }
    return [...map.entries()]
      .map(([date, list]) => ({ date, entries: list, summary: summarizeHours(list) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  async function request(key: string, url: string, init: RequestInit): Promise<boolean> {
    setBusy(key);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...init,
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Something went wrong. Try again.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server. Try again.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hours = Number(addHours);
    if (!addDate || !addProject) {
      setError("Choose a day and a project.");
      return;
    }
    if (!Number.isFinite(hours) || hours < 0.25 || hours > 24) {
      setError("Enter between 0.25 and 24 hours.");
      return;
    }

    const ok = await request("add", "/api/timesheets/mine/entries", {
      method: "POST",
      body: JSON.stringify({
        workDate: addDate,
        projectId: addProject,
        hours,
        note: addNote.trim(),
      }),
    });

    if (ok) {
      setAddHours("");
      setAddNote("");
    }
  }

  async function saveEntry(id: string) {
    if (!editing) return;
    const hours = Number(editing.hours);
    if (!Number.isFinite(hours) || hours < 0.25 || hours > 24) {
      setError("Enter between 0.25 and 24 hours.");
      return;
    }

    const ok = await request(`save-${id}`, `/api/entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        projectId: editing.projectId,
        hours,
        note: editing.note.trim(),
      }),
    });
    if (ok) setEditing(null);
  }

  async function deleteEntry(id: string) {
    const ok = await request(`delete-${id}`, `/api/entries/${id}`, { method: "DELETE" });
    if (ok) {
      setDeletingId(null);
      if (editing?.id === id) setEditing(null);
    }
  }

  async function submitWeek() {
    const ok = await request("submit", `/api/timesheets/${timesheet.id}/submit`, {
      method: "POST",
    });
    if (ok) setConfirming(false);
  }

  return (
    <div>
      {timesheet.status === "rejected" && timesheet.review_note ? (
        <div className="mt-5 rounded-lg border border-danger/20 bg-danger-soft px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-danger">
            Sent back by your manager
          </p>
          <p className="mt-1 text-sm leading-6 text-danger">{timesheet.review_note}</p>
          <p className="mt-1 text-[11px] leading-5 text-danger/80">
            Editing an entry will reopen this week as a draft.
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-5 flex items-start justify-between gap-3 rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5"
        >
          <p className="text-xs leading-5 text-danger">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="text-danger/70 hover:text-danger"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="card card-pad">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Week total</p>
          <p className="mt-2 font-display text-3xl text-ink">{formatHours(summary.total)}</p>
        </div>
        <div className="card card-pad">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Billable</p>
          <p className="mt-2 font-display text-3xl text-ink">{formatHours(summary.billable)}</p>
        </div>
        <div className="card card-pad">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Utilization
          </p>
          <p className="mt-2 font-display text-3xl text-ink">{formatPercent(summary.utilization)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <Card className="overflow-hidden">
          <CardHeader
            title="Entries"
            description={`${formatWeekLabel(weekStart)} · ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
            action={<StatusBadge status={timesheet.status} />}
          />

          {grouped.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                title="No hours yet"
                description="Use the form beside this card to add your first entry. Each entry belongs to a project and a single day."
              />
            </div>
          ) : (
            <div className="px-5 sm:px-6">
              {grouped.map((day) => (
                <section key={day.date} className="border-b border-line/70 py-4 last:border-b-0">
                  <header className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {weekdayName(day.date)} · {formatDate(day.date)}
                    </p>
                    <p className="mono text-[10px] text-muted">{formatHours(day.summary.total)}</p>
                  </header>

                  <div className="mt-2 space-y-2">
                    {day.entries.map((entry) => {
                      const isEditing = editing?.id === entry.id;
                      if (isEditing && editing) {
                        return (
                          <div
                            key={entry.id}
                            className="rounded-md border border-olive-200 bg-olive-50/40 p-3"
                          >
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_90px]">
                              <Field label="Project">
                                <Select
                                  value={editing.projectId}
                                  onChange={(event) =>
                                    setEditing({ ...editing, projectId: event.target.value })
                                  }
                                >
                                  {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                      {project.code} — {project.name}
                                    </option>
                                  ))}
                                </Select>
                              </Field>
                              <Field label="Hours">
                                <Input
                                  type="number"
                                  min="0.25"
                                  max="24"
                                  step="0.25"
                                  value={editing.hours}
                                  onChange={(event) =>
                                    setEditing({ ...editing, hours: event.target.value })
                                  }
                                />
                              </Field>
                            </div>
                            <Field label="Note" className="mt-3">
                              <Input
                                value={editing.note}
                                maxLength={280}
                                onChange={(event) =>
                                  setEditing({ ...editing, note: event.target.value })
                                }
                                placeholder="What was worked on"
                              />
                            </Field>
                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEntry(entry.id)}
                                disabled={busy === `save-${entry.id}`}
                              >
                                {busy === `save-${entry.id}` ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                                ) : (
                                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                                )}
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditing(null)}
                                disabled={busy === `save-${entry.id}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={entry.id}
                          className="group flex items-start justify-between gap-3 rounded-md border border-transparent px-1 py-1.5 transition-colors hover:border-line hover:bg-cream-100/40"
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
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="w-12 text-right font-display text-base text-ink">
                              {Number(entry.hours).toFixed(1)}
                            </span>
                            {editable ? (
                              deletingId === entry.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => deleteEntry(entry.id)}
                                    disabled={busy === `delete-${entry.id}`}
                                    className="inline-flex h-7 items-center gap-1 rounded border border-danger/30 bg-danger-soft px-1.5 text-[10px] font-medium text-danger disabled:opacity-50"
                                  >
                                    {busy === `delete-${entry.id}` ? (
                                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                                    ) : null}
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingId(null)}
                                    aria-label="Cancel delete"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-cream-100 hover:text-ink"
                                  >
                                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditing({
                                        id: entry.id,
                                        projectId: entry.project_id,
                                        hours: Number(entry.hours).toString(),
                                        note: entry.note,
                                      })
                                    }
                                    aria-label={`Edit entry for ${entry.project_name}`}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-cream-100 hover:text-ink"
                                  >
                                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingId(entry.id)}
                                    aria-label={`Delete entry for ${entry.project_name}`}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-danger-soft hover:text-danger"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                                  </button>
                                </div>
                              )
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6 lg:sticky lg:top-6">
          {editable ? (
            <Card className="overflow-hidden">
              <CardHeader title="Add hours" description="One entry per project, per day" />
              <form onSubmit={addEntry} className="space-y-3 px-5 py-5 sm:px-6">
                <Field label="Day">
                  <Select value={addDate} onChange={(event) => setAddDate(event.target.value)}>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {weekdayName(day)} · {formatDate(day)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Project">
                  <Select
                    value={addProject}
                    onChange={(event) => setAddProject(event.target.value)}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.code} — {project.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Hours" hint="0.25 to 24, in quarter-hour steps">
                  <Input
                    type="number"
                    min="0.25"
                    max="24"
                    step="0.25"
                    value={addHours}
                    onChange={(event) => setAddHours(event.target.value)}
                    placeholder="8"
                    required
                  />
                </Field>
                <Field label="Note" hint="Optional, but useful to your reviewer">
                  <Textarea
                    value={addNote}
                    maxLength={280}
                    onChange={(event) => setAddNote(event.target.value)}
                    placeholder="What did you work on?"
                  />
                </Field>
                <Button type="submit" className="w-full" disabled={busy === "add"}>
                  {busy === "add" ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  )}
                  Add entry
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="card-pad">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-olive-200 bg-olive-50">
                  <Lock className="h-4 w-4 text-olive-700" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-display text-lg text-ink">This week is locked</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {timesheet.status === "approved"
                      ? "The week has been approved. Ask a manager to reopen it if something needs to change."
                      : "Submitted and waiting for review. You will be able to edit again if it comes back with a note."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <CardHeader title="Submit week" description="Locks the entries for review" />
            <div className="px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Entries</span>
                <span className="font-medium text-ink">{entries.length}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>Total hours</span>
                <span className="font-medium text-ink">{formatHours(summary.total)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>Billable share</span>
                <span className="font-medium text-ink">{formatPercent(summary.utilization)}</span>
              </div>

              {locked ? (
                <p className="mt-4 flex items-start gap-2 rounded-md border border-line bg-cream-100/60 px-3 py-2.5 text-[11px] leading-5 text-muted">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive-600" strokeWidth={1.8} />
                  {timesheet.status === "approved"
                    ? "Approved and closed."
                    : "Submitted. A manager will review it shortly."}
                </p>
              ) : confirming ? (
                <div className="mt-4 rounded-md border border-olive-200 bg-olive-50/50 p-3">
                  <p className="text-xs leading-5 text-olive-900">
                    Submit {formatHours(summary.total)} for the week of {formatWeekLabel(weekStart)}?
                    You will not be able to edit until a manager responds.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={submitWeek}
                      disabled={busy === "submit" || entries.length === 0}
                    >
                      {busy === "submit" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                      ) : (
                        <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
                      )}
                      Confirm submit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setConfirming(false)}
                      disabled={busy === "submit"}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="mt-4 w-full"
                  onClick={() => setConfirming(true)}
                  disabled={entries.length === 0}
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  Submit for approval
                </Button>
              )}

              <p className="mt-3 text-[10px] leading-4 text-muted">
                A single day cannot exceed 24 hours. Rejected weeks reopen automatically when you
                edit them.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
