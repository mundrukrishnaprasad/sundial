import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, currentWeekStart, formatWeekLabel, parseDateOnly, toDateOnly } from "@/lib/dates";

export function WeekNav({ weekStart, basePath }: { weekStart: string; basePath: string }) {
  const start = parseDateOnly(weekStart);
  const prev = start ? toDateOnly(addDays(start, -7)) : weekStart;
  const next = start ? toDateOnly(addDays(start, 7)) : weekStart;
  const isCurrent = weekStart === currentWeekStart();

  return (
    <div className="flex items-center gap-1 rounded-md border border-line bg-paper p-1">
      <Link
        href={`${basePath}?week=${prev}`}
        aria-label="Previous week"
        className="inline-flex h-8 w-8 items-center justify-center rounded text-muted transition-colors hover:bg-cream-100 hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
      </Link>
      <span className="min-w-[150px] px-2 text-center text-xs font-medium text-ink">
        {formatWeekLabel(weekStart)}
      </span>
      <Link
        href={`${basePath}?week=${next}`}
        aria-label="Next week"
        className="inline-flex h-8 w-8 items-center justify-center rounded text-muted transition-colors hover:bg-cream-100 hover:text-ink"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
      </Link>
      {isCurrent ? (
        <span className="ml-1 rounded bg-cream-100 px-2 py-1 text-[10px] font-medium text-muted">
          This week
        </span>
      ) : (
        <Link
          href={basePath}
          className="ml-1 rounded px-2 py-1 text-[10px] font-medium text-olive-700 hover:bg-olive-50"
        >
          This week
        </Link>
      )}
    </div>
  );
}
