"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { InviteEvent, RsvpRecord, RsvpStatus } from "@/lib/types";
import { timeAgo } from "@/components/site/occasions";
import { ConfirmDialog } from "./ConfirmDialog";
import { WhatsAppIcon } from "./ShareLinkBox";

type Filter = "all" | RsvpStatus;

const STATUS: Record<RsvpStatus, { label: string; cls: string }> = {
  yes: { label: "Attending", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  maybe: { label: "Maybe", cls: "bg-amber-100 text-amber-800 ring-amber-200" },
  no: { label: "Declined", cls: "bg-rose-100 text-rose-800 ring-rose-200" },
};

interface Props {
  inviteId: string;
  rsvps: RsvpRecord[];
  events: InviteEvent[];
  /** No-login hosts: appended as ?token= to delete + CSV URLs. */
  manageToken?: string;
}

function digits(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function waNumber(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = `91${d}`; // assume India for bare 10-digit mobiles
  return d;
}

export function RsvpList({ inviteId, rsvps, events, manageToken }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, setPending] = useState<RsvpRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  const tokenQs = manageToken ? `?token=${encodeURIComponent(manageToken)}` : "";
  const csvHref = `/api/invites/${encodeURIComponent(inviteId)}/rsvps.csv${tokenQs}`;
  const eventName = useMemo(() => new Map(events.map((e) => [e.id, e.name])), [events]);
  const multi = events.length > 1;

  const visible = rsvps.filter((r) => !hidden.has(r.id));
  const counts = {
    all: visible.length,
    yes: visible.filter((r) => r.status === "yes").length,
    maybe: visible.filter((r) => r.status === "maybe").length,
    no: visible.filter((r) => r.status === "no").length,
  };

  const q = query.trim().toLowerCase();
  const list = visible.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (!q ||
        r.name.toLowerCase().includes(q) ||
        (r.phone ?? "").toLowerCase().includes(q) ||
        (r.message ?? "").toLowerCase().includes(q)),
  );

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/invites/${encodeURIComponent(inviteId)}/rsvps/${encodeURIComponent(pending.id)}${tokenQs}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(b.error || "Could not delete this RSVP.");
      }
      setHidden((s) => new Set(s).add(pending.id));
      setPending(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete this RSVP.");
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "yes", label: "Attending" },
    { id: "maybe", label: "Maybe" },
    { id: "no", label: "Declined" },
  ];

  return (
    <section aria-labelledby="rsvp-list" className="rounded-3xl border border-gold/30 bg-white/85 p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="rsvp-list" className="flex items-center gap-2 font-display text-2xl font-bold text-brand-dark">
          Guest responses
        </h2>
        <a
          href={csvHref}
          download
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-dark px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand"
        >
          <span aria-hidden>⬇</span> Download CSV
        </a>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search guests</span>
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone or message"
            className="w-full rounded-2xl border border-brand/15 bg-cream/50 py-3 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 sm:text-sm"
          />
        </label>
        <div role="tablist" aria-label="Filter by response" className="flex gap-1 overflow-x-auto rounded-2xl bg-cream p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={filter === t.id}
              onClick={() => setFilter(t.id)}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${
                filter === t.id ? "bg-white text-brand shadow-sm" : "text-brand-dark/60 hover:text-brand-dark"
              }`}
            >
              {t.label} <span className="tabular-nums opacity-60">{counts[t.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-brand/20 px-4 py-12 text-center">
          <p className="text-4xl" aria-hidden>
            💌
          </p>
          <p className="mt-2 font-semibold text-brand-dark">No RSVPs yet</p>
          <p className="mt-1 text-sm text-brand-dark/60">Share your invitation link — responses will appear here.</p>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-cream/60 px-4 py-8 text-center text-sm text-brand-dark/60">No guests match your search.</p>
      ) : (
        <ul className="mt-5 divide-y divide-brand/10">
          {list.map((r) => {
            const s = STATUS[r.status] ?? STATUS.maybe;
            return (
              <li key={r.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-dark">{r.name}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${s.cls}`}>{s.label}</span>
                      {r.status !== "no" && (
                        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-brand-dark ring-1 ring-gold/30">
                          👥 {r.guests} guest{r.guests === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-brand-dark/50" suppressHydrationWarning>
                      {timeAgo(r.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setPending(r);
                    }}
                    className="shrink-0 rounded-xl p-2.5 text-brand-dark/40 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete RSVP from ${r.name}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {multi && r.status !== "no" && r.eventIds?.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Events">
                    {r.eventIds.map((id) => (
                      <li key={id} className="rounded-full bg-brand/5 px-2.5 py-1 text-xs text-brand-dark/80 ring-1 ring-brand/10">
                        {eventName.get(id) ?? "Removed event"}
                      </li>
                    ))}
                  </ul>
                )}

                {r.message && (
                  <blockquote className="mt-2 rounded-2xl bg-cream/70 px-4 py-2.5 text-sm italic text-brand-dark/80">
                    “{r.message}”
                  </blockquote>
                )}

                {r.phone && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={`tel:${digits(r.phone)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-brand-dark ring-1 ring-brand/15 transition hover:bg-cream"
                    >
                      <span aria-hidden>📞</span> {r.phone}
                    </a>
                    <a
                      href={`https://wa.me/${waNumber(r.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#128C7E] ring-1 ring-[#25D366]/40 transition hover:bg-[#25D366]/10"
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!pending}
        title="Delete this RSVP?"
        body={pending ? `The response from ${pending.name} will be permanently removed.` : ""}
        busy={busy}
        error={error}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </section>
  );
}
