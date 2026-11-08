"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";

const demoAccounts = [
  { role: "Employee", label: "Ravi Kumar", email: "ravi@sundial.app" },
  { role: "Manager", label: "Arjun Mehta", email: "manager@sundial.app" },
  { role: "Admin", label: "Maya Rao", email: "admin@sundial.app" },
];

const DEMO_PASSWORD = "Sundial!2026";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("ravi@sundial.app");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Could not sign in. Check the details and try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  function useAccount(accountEmail: string) {
    setEmail(accountEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
          />
        </Field>

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-danger/20 bg-danger-soft px-3 py-2 text-xs leading-5 text-danger"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
              Signing in
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 border-t border-line pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Demo accounts
        </p>
        <div className="mt-3 space-y-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => useAccount(account.email)}
              className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2.5 text-left transition-colors hover:border-olive-300 hover:bg-olive-50/40"
            >
              <span className="min-w-0">
                <span className="block text-sm text-ink">{account.label}</span>
                <span className="mono mt-0.5 block truncate text-[10px] text-muted">
                  {account.email}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-line bg-cream-100 px-2 py-0.5 text-[10px] font-medium text-muted">
                {account.role}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-muted">
          Shared password: <span className="mono text-ink">{DEMO_PASSWORD}</span>. Click an account
          to fill the form.
        </p>
      </div>
    </div>
  );
}
