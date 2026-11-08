"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  ScrollText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/ui";
import type { Role } from "@/lib/session";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
  badge?: boolean;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "admin"] },
  { href: "/timesheets", label: "Timesheets", icon: CalendarClock, roles: ["employee", "manager", "admin"] },
  {
    href: "/approvals",
    label: "Approvals",
    icon: CheckSquare,
    roles: ["manager", "admin"],
    badge: true,
  },
  { href: "/team", label: "Team", icon: Users, roles: ["manager", "admin"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
  { href: "/projects", label: "Projects", icon: FolderKanban, roles: ["admin"] },
  { href: "/audit", label: "Audit log", icon: ScrollText, roles: ["manager", "admin"] },
];

export function AppNav({
  role,
  pending = 0,
  variant = "sidebar",
}: {
  role: Role;
  pending?: number;
  variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();
  const visible = items.filter((item) => item.roles.includes(role));

  return (
    <nav
      aria-label="Application"
      className={cn(
        variant === "sidebar" ? "flex flex-col gap-1 px-3" : "flex items-center gap-1 overflow-x-auto px-3 pb-2",
      )}
    >
      {visible.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-md text-sm transition-colors",
              variant === "sidebar"
                ? "px-3 py-2"
                : "shrink-0 px-2.5 py-1.5 text-xs",
              active
                ? variant === "sidebar"
                  ? "border border-line bg-paper text-ink shadow-[0_1px_2px_rgba(42,51,25,0.05)]"
                  : "border border-line bg-paper text-ink"
                : "border border-transparent text-muted hover:bg-cream-100 hover:text-ink",
            )}
          >
            <item.icon
              className={cn(
                "shrink-0",
                variant === "sidebar" ? "h-[17px] w-[17px]" : "h-3.5 w-3.5",
                active ? "text-olive-700" : "text-muted group-hover:text-olive-700",
              )}
              strokeWidth={1.7}
            />
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge && pending > 0 ? (
              <span
                className={cn(
                  "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-olive-700 px-1.5 py-0.5 text-[10px] font-semibold text-cream-50",
                  variant === "mobile" && "ml-1",
                )}
              >
                {pending}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
