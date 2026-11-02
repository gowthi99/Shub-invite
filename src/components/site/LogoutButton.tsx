"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore – we still navigate away */
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className={`rounded-full px-3 py-2 text-sm font-medium text-brand-dark/80 transition hover:bg-brand/10 hover:text-brand disabled:opacity-60 ${className}`}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
