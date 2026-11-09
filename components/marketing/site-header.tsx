"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MarketingLogo } from "@/components/marketing/logo";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/marketing/icons";
import { cn } from "@/lib/ui";

const links = [
  { href: "/product", label: "Product" },
  { href: "/workflow", label: "Workflow" },
  { href: "/reporting", label: "Reporting" },
  { href: "/roles", label: "Roles" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebeaeb] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-[85px]">
        <Link href="/" aria-label="Sundial home" className="shrink-0">
          <MarketingLogo />
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] text-ink md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors hover:text-olive-600",
                  active && "text-olive-600",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-olive-600 transition-transform duration-300",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-olive-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-olive-700"
          >
            Open the demo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-cream-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "border-b border-line/70 py-3 text-[15px] text-ink last:border-b-0",
                pathname === link.href && "text-olive-600",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
