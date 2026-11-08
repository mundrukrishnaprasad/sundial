import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { readSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
};

const points = [
  "Weekly entries against real projects",
  "Manager approvals with rejection notes",
  "Utilization by person and project",
  "Audit log for every status change",
];

export default async function LoginPage() {
  const user = await readSession();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
      <div className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Sundial home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.02em] text-ink">
            Sign in to Sundial
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use one of the demo accounts below, or your own credentials if you have been invited.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>

        <p className="text-[11px] text-muted">
          Demo environment · Data is seeded for evaluation ·{" "}
          <Link href="/" className="underline decoration-line underline-offset-2 hover:text-ink">
            About Sundial
          </Link>
        </p>
      </div>

      <aside className="relative hidden overflow-hidden bg-olive-900 lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, #e3e8fe 0, transparent 34%), radial-gradient(circle at 80% 70%, #9dbbf8 0, transparent 40%)",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-olive-300">
            The weekly record
          </p>
          <blockquote className="mt-6 max-w-md font-display text-4xl leading-[1.12] tracking-[-0.02em] text-cream-50">
            “A timesheet is a promise. Sundial just makes it easy to keep.”
          </blockquote>
          <p className="mt-4 text-xs text-olive-300">Product note, not a customer quote.</p>
        </div>

        <div className="relative">
          <ul className="space-y-3 border-t border-olive-700 pt-6">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-olive-100">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive-300" strokeWidth={2} />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[11px] leading-5 text-olive-400">
            Sundial is a demonstration project. Sessions last seven days and are signed with a
            server-side secret.
          </p>
        </div>
      </aside>
    </div>
  );
}
