import { SundialMark } from "@/components/logo";
import { cn } from "@/lib/ui";

export function MarketingLogo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SundialMark
        className={cn("h-6 w-6", tone === "light" ? "text-cream-100" : "text-olive-600")}
      />
      <span
        className={cn(
          "text-[22px] font-bold leading-none tracking-[-0.02em]",
          tone === "light" ? "text-cream-50" : "text-ink",
        )}
      >
        Sundial
      </span>
    </span>
  );
}
