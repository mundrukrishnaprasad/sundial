"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-cream-200 hover:text-ink disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" strokeWidth={1.7} />
    </button>
  );
}
