import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";
import { Avatar } from "@/components/ui";
import { canManage } from "@/lib/auth";
import { getPendingApprovalCount } from "@/lib/queries";
import { readSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await readSession();
  if (!user) redirect("/login");

  const pending = canManage(user.role) ? await getPendingApprovalCount(user) : 0;
  const firstName = user.name.split(" ")[0];
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="min-h-screen bg-cream-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-cream-100/70 lg:flex">
        <div className="px-6 py-6">
          <Link href="/" aria-label="Sundial home">
            <Logo />
          </Link>
        </div>
        <AppNav role={user.role} pending={pending} />
        <div className="mt-auto border-t border-line p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="text-[11px] text-muted">{roleLabel}</p>
            </div>
            <LogoutButton />
          </div>
          <p className="mt-3 truncate text-[10px] text-muted">{user.email}</p>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-line bg-cream-50/95 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/" aria-label="Sundial home">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{firstName}</span>
              <Avatar name={user.name} size="sm" />
              <LogoutButton />
            </div>
          </div>
          <AppNav role={user.role} pending={pending} variant="mobile" />
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
