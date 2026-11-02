"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocalInvites, type LocalInvite } from "./localInvites";
import { timeAgo } from "./occasions";

/** Lists invitations created on this device (localStorage `myInvites`). Renders nothing if empty. */
export function MyInvitesOnDevice({ loggedIn = false }: { loggedIn?: boolean }) {
  const [items, setItems] = useState<LocalInvite[]>([]);

  useEffect(() => {
    const list = readLocalInvites();
    list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    setItems(list);
  }, []);

  if (!items.length) return null;

  return (
    <section aria-labelledby="device-invites" className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-gold/30 bg-white/70 p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="device-invites" className="font-display text-2xl font-bold text-brand-dark">
              My invitations on this device
            </h2>
            <p className="mt-1 text-sm text-brand-dark/60">
              Saved in this browser only. {loggedIn ? "" : "Create an account to keep them safe everywhere."}
            </p>
          </div>
          {!loggedIn && (
            <Link
              href="/signup"
              className="rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              Save to an account
            </Link>
          )}
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((inv) => (
            <li
              key={inv.manageToken}
              className="flex items-center justify-between gap-3 rounded-2xl border border-brand/10 bg-cream/70 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-brand-dark">{inv.title || "Untitled invitation"}</p>
                {inv.createdAt && (
                  <p className="text-xs text-brand-dark/50" suppressHydrationWarning>
                    Created {timeAgo(inv.createdAt)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/i/${inv.slug}`}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand-dark shadow-sm ring-1 ring-brand/15 hover:ring-brand/40"
                >
                  View
                </Link>
                <Link
                  href={`/manage/${inv.manageToken}`}
                  className="rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark"
                >
                  Manage
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
