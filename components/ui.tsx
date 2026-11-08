import type { ReactNode } from "react";
import { cn } from "@/lib/ui";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}) {
  return (
    <button
      type={type}
      className={cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("textarea", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("input appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="text-[11px] leading-4 text-muted">{hint}</span> : null}
    </label>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("card", className)}>{children}</section>;
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className,
      )}
    >
      <div>
        <h2 className="font-display text-xl tracking-[-0.01em] text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-xs leading-5 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

type BadgeTone = "neutral" | "olive" | "danger" | "muted";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "border-line bg-cream-100 text-ink",
  olive: "border-olive-200 bg-olive-50 text-olive-800",
  danger: "border-danger/20 bg-danger-soft text-danger",
  muted: "border-line bg-transparent text-muted",
};

const badgeDots: Record<BadgeTone, string> = {
  neutral: "bg-muted",
  olive: "bg-olive-600",
  danger: "bg-danger",
  muted: "bg-muted",
};

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        badgeTones[tone],
        className,
      )}
    >
      {dot ? <span className={cn("h-1.5 w-1.5 rounded-full", badgeDots[tone])} /> : null}
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("card card-pad", accent && "border-olive-900 bg-olive-900")}>
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.12em]",
          accent ? "text-olive-200" : "text-muted",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-3xl tracking-[-0.02em]",
          accent ? "text-cream-50" : "text-ink",
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className={cn("mt-1 text-xs leading-5", accent ? "text-olive-200" : "text-muted")}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-cream-200", className)}>
      <div className="h-full rounded-full bg-olive-600" style={{ width: `${width}%` }} />
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-olive-100 font-medium text-olive-800",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs",
      )}
    >
      {initials}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card card-pad flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream-100">
        <span className="h-1.5 w-1.5 rounded-full bg-olive-500" />
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="page-title mt-1.5">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
