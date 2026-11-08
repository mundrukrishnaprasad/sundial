"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button, Field, Textarea } from "@/components/ui";

export function ReviewActions({ timesheetId }: { timesheetId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"idle" | "approve" | "reject">("idle");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: "approve" | "reject") {
    if (action === "reject" && note.trim().length === 0) {
      setError("A rejection needs a short note so the employee knows what to fix.");
      return;
    }

    setBusy(action);
    setError(null);

    try {
      const response = await fetch(`/api/timesheets/${timesheetId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: note.trim() }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Could not save the review. Try again.");
        return;
      }

      router.push("/approvals");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="font-display text-xl text-ink">Decision</h2>
        <p className="mt-0.5 text-xs leading-5 text-muted">
          Approving closes the week. Rejecting reopens it as a draft for the employee.
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {error ? (
          <p
            role="alert"
            className="mb-4 rounded-md border border-danger/20 bg-danger-soft px-3 py-2 text-xs leading-5 text-danger"
          >
            {error}
          </p>
        ) : null}

        {mode === "idle" ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={() => setMode("approve")}>
              <Check className="h-4 w-4" strokeWidth={2} />
              Approve week
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => setMode("reject")}>
              <X className="h-4 w-4" strokeWidth={2} />
              Send back
            </Button>
          </div>
        ) : (
          <div>
            <Field
              label={mode === "reject" ? "Reason for sending it back" : "Note (optional)"}
              hint={
                mode === "reject"
                  ? "Required. Be specific about the entry or day that needs attention."
                  : "Saved with the approval in the audit log."
              }
            >
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
                placeholder={
                  mode === "reject"
                    ? "For example: split the Atlas Platform hours by workstream."
                    : "Approved with the corrected Thursday entry."
                }
                autoFocus
              />
            </Field>
            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={() => submit(mode)}
                disabled={busy !== null}
                variant={mode === "reject" ? "danger" : "primary"}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : mode === "reject" ? (
                  <X className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Check className="h-4 w-4" strokeWidth={2} />
                )}
                {mode === "reject" ? "Send back to employee" : "Confirm approval"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setMode("idle");
                  setError(null);
                }}
                disabled={busy !== null}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
