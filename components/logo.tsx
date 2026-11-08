import { cn } from "@/lib/ui";

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SundialMark
        className={cn("h-6 w-6", tone === "light" ? "text-cream-100" : "text-olive-700")}
      />
      <span
        className={cn(
          "font-display text-[22px] leading-none tracking-[-0.01em]",
          tone === "light" ? "text-cream-50" : "text-ink",
        )}
      >
        Sundial
      </span>
    </span>
  );
}

export function SundialMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="18" r="11" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 18V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 18l6.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 28h22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
