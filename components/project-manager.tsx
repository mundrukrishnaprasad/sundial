"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2, Plus, RotateCcw } from "lucide-react";
import { Badge, Button, Card, CardHeader, Field, Input, Select } from "@/components/ui";
import type { Project } from "@/lib/queries";

export function ProjectManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [billable, setBillable] = useState("true");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await request("create", "/api/projects", {
      method: "POST",
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        client: client.trim(),
        billable: billable === "true",
      }),
    });
    if (ok) {
      setCode("");
      setName("");
      setClient("");
      setBillable("true");
    }
  }

  async function updateProject(id: string, patch: Record<string, unknown>, key: string) {
    await request(key, `/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  const active = projects.filter((project) => project.active);
  const archived = projects.filter((project) => !project.active);

  return (
    <div>
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-danger/20 bg-danger-soft px-3 py-2 text-xs leading-5 text-danger"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <Card className="overflow-hidden">
          <CardHeader
            title="Active projects"
            description={`${active.length} ${active.length === 1 ? "project" : "projects"} available for entry`}
          />
          {active.length === 0 ? (
            <p className="px-5 py-10 text-center text-xs text-muted sm:px-6">
              No active projects. Create one to start accepting entries.
            </p>
          ) : (
            <div className="divide-y divide-line/70">
              {active.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink">{project.name}</p>
                      <span className="mono rounded bg-cream-100 px-1.5 py-0.5 text-[10px] text-muted">
                        {project.code}
                      </span>
                      {project.billable ? (
                        <Badge tone="olive">Billable</Badge>
                      ) : (
                        <Badge tone="muted">Internal</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted">{project.client}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateProject(
                          project.id,
                          { billable: !project.billable },
                          `billable-${project.id}`,
                        )
                      }
                      disabled={busy === `billable-${project.id}`}
                      className="inline-flex h-7 items-center rounded border border-line px-2 text-[10px] font-medium text-muted transition-colors hover:bg-cream-100 hover:text-ink disabled:opacity-50"
                    >
                      {busy === `billable-${project.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                      ) : project.billable ? (
                        "Mark internal"
                      ) : (
                        "Mark billable"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateProject(project.id, { active: false }, `archive-${project.id}`)
                      }
                      disabled={busy === `archive-${project.id}`}
                      className="inline-flex h-7 items-center gap-1 rounded border border-line px-2 text-[10px] font-medium text-muted transition-colors hover:border-danger/30 hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                    >
                      {busy === `archive-${project.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                      ) : (
                        <Archive className="h-3 w-3" strokeWidth={1.8} />
                      )}
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {archived.length > 0 ? (
            <div className="border-t border-line px-5 py-4 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Archived
              </p>
              <ul className="mt-2 space-y-2">
                {archived.map((project) => (
                  <li key={project.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted line-through">{project.name}</p>
                      <p className="mono text-[10px] text-muted">
                        {project.code} · {project.client}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProject(project.id, { active: true }, `restore-${project.id}`)
                      }
                      disabled={busy === `restore-${project.id}`}
                      className="inline-flex h-7 shrink-0 items-center gap-1 rounded border border-line px-2 text-[10px] font-medium text-muted transition-colors hover:bg-cream-100 hover:text-ink disabled:opacity-50"
                    >
                      {busy === `restore-${project.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                      ) : (
                        <RotateCcw className="h-3 w-3" strokeWidth={1.8} />
                      )}
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        <Card className="overflow-hidden lg:sticky lg:top-6">
          <CardHeader title="New project" description="Add a code, a client, and a billing type" />
          <form onSubmit={createProject} className="space-y-3 px-5 py-5 sm:px-6">
            <Field label="Code" hint="Uppercase letters, numbers, and dashes. Used on every entry.">
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="NW-DEL"
                maxLength={24}
                required
              />
            </Field>
            <Field label="Project name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Northwind Delivery"
                maxLength={120}
                required
              />
            </Field>
            <Field label="Client">
              <Input
                value={client}
                onChange={(event) => setClient(event.target.value)}
                placeholder="Northwind"
                maxLength={120}
                required
              />
            </Field>
            <Field label="Billing type">
              <Select value={billable} onChange={(event) => setBillable(event.target.value)}>
                <option value="true">Billable to the client</option>
                <option value="false">Internal / non-billable</option>
              </Select>
            </Field>
            <Button type="submit" className="w-full" disabled={busy === "create"}>
              {busy === "create" ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2} />
              )}
              Create project
            </Button>
            <p className="text-[10px] leading-4 text-muted">
              Archived projects disappear from the entry form but keep their history and hours.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
