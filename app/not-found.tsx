import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Sundial home">
          <Logo />
        </Link>
        <Link href="/dashboard" className="text-xs font-medium text-muted hover:text-ink">
          Dashboard
        </Link>
      </div>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-5xl tracking-[-0.02em] text-ink">
          This page is not on the dial.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The link may be out of date, or the record may have been removed. Return to the dashboard
          to pick up the current week.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn btn-primary">
            Go to dashboard
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to the site
          </Link>
        </div>
      </main>
    </div>
  );
}
