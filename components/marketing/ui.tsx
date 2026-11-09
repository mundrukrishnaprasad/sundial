import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/marketing/icons";
import { cn } from "@/lib/ui";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  body,
  align = "left",
  className,
}: {
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px] sm:leading-[44px]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-lg leading-7 text-muted sm:text-xl sm:leading-7">{body}</p>
      ) : null}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-olive-600 px-5 text-base font-semibold text-white transition-colors hover:bg-olive-700",
        className,
      )}
    >
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-5 text-base font-semibold text-ink transition-colors hover:border-olive-300 hover:text-olive-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function IconTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olive-100 text-olive-600",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "red";
}) {
  const tones = {
    neutral: "border-line bg-cream-100 text-muted",
    blue: "border-olive-200 bg-olive-50 text-olive-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function PageIntro({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-36 h-[420px] w-[420px] rounded-full bg-olive-100 blur-3xl"
      />
      <Container className="relative py-16 lg:py-24">
        <div className="max-w-3xl">
          <Eyebrow className="mkt-enter">{eyebrow}</Eyebrow>
          <h1 className="mkt-enter mkt-enter-1 mt-4 text-[38px] font-extrabold leading-[1.02] tracking-[-0.042em] text-ink sm:text-[52px] lg:text-[62px]">
            {title}
          </h1>
          {body ? (
            <p className="mkt-enter mkt-enter-2 mt-5 max-w-2xl text-lg leading-8 text-muted">
              {body}
            </p>
          ) : null}
          {children ? <div className="mkt-enter mkt-enter-3 mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export function CheckList({
  items,
  className,
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-[14px] leading-6 text-ink"
        >
          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-olive-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({
  eyebrow,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="bg-olive-100">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
              {eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[40px]">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink/70">{body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryHref}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-olive-600 px-5 text-base font-semibold text-white transition-colors hover:bg-olive-700"
            >
              {primaryLabel}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-ink/15 bg-white/60 px-5 text-base font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-white"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
