"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { removeLocalInvite } from "@/components/site/localInvites";

interface Props {
  inviteId: string;
  title: string;
  /** For no-login hosts: sent in the JSON body as proof of ownership. */
  manageToken?: string;
  /** Where to go after deletion. Omit to just refresh the current page. */
  redirectTo?: string;
  className?: string;
  label?: string;
}

export function DeleteInviteButton({ inviteId, title, manageToken, redirectTo, className, label = "Delete" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(inviteId)}`, {
        method: "DELETE",
        headers: manageToken ? { "Content-Type": "application/json" } : undefined,
        body: manageToken ? JSON.stringify({ manageToken }) : undefined,
      });
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(b.error || "Could not delete the invitation.");
      }
      if (manageToken) removeLocalInvite(manageToken);
      setOpen(false);
      if (redirectTo) router.replace(redirectTo);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the invitation.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={
          className ??
          "rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
        }
      >
        {label}
      </button>
      <ConfirmDialog
        open={open}
        title="Delete this invitation?"
        body={`“${title}” and all of its RSVPs will be permanently deleted. Guests will no longer be able to open the link.`}
        confirmLabel="Delete forever"
        busy={busy}
        error={error}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
