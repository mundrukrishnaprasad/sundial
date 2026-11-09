import Link from "next/link";
import { MarketingLogo } from "@/components/marketing/logo";

const productLinks = [
  { href: "/product", label: "Product" },
  { href: "/workflow", label: "Workflow" },
  { href: "/reporting", label: "Reporting" },
  { href: "/roles", label: "Roles" },
];

const demoLinks = [
  { href: "/login", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
  { href: "/audit", label: "Audit log" },
];

const projectLinks = [
  { href: "https://github.com/mundrukrishnaprasad/sundial", label: "GitHub" },
  {
    href: "https://github.com/mundrukrishnaprasad/sundial/blob/main/README.md",
    label: "README",
  },
  {
    href: "https://github.com/mundrukrishnaprasad/sundial/blob/main/docs/DEPLOYMENT.md",
    label: "Deployment",
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-olive-900 text-cream-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <MarketingLogo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-cream-100/80">
              Weekly timesheets, approvals and utilization for teams that bill by the hour.
            </p>
            <p className="mt-4 text-xs text-cream-100/60">
              A portfolio project, not a commercial service.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-cream-50">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition-colors hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-cream-50">Demo</p>
            <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
              {demoLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition-colors hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-cream-50">Project</p>
            <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="transition-colors hover:text-white"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sundial. Built as a demonstration.</p>
          <p className="mono">Next.js · Neon · Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}
