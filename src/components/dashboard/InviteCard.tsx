import type { InviteRecord } from "@/lib/types";
import type { RsvpCounts } from "@/lib/invites";
import { firstEvent, formatDate, formatTime, inviteNames, occasionMeta } from "@/components/site/occasions";
import { InviteCardActions } from "./InviteCardActions";

export type DashboardInvite = InviteRecord & { views: number; rsvp: RsvpCounts };

export function InviteCard({ invite }: { invite: DashboardInvite }) {
  const d = invite.data;
  const meta = occasionMeta(d.occasion);
  const names = inviteNames(d);
  const ev = firstEvent(d);
  const title = d.title?.trim() || `${names} · ${meta.label}`;
  const c = invite.rsvp;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative px-5 pb-4 pt-5 text-white" style={{ background: meta.gradient }}>
        <div aria-hidden className="absolute -right-4 -top-6 text-7xl opacity-20">
          {meta.emoji}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <span aria-hidden>{meta.emoji}</span> {meta.label}
          {d.mode === "multi" && d.events.length > 1 ? ` · ${d.events.length} events` : ""}
        </span>
        <h3 className="mt-2 truncate font-display text-2xl font-bold drop-shadow-sm">{names}</h3>
        <p className="mt-0.5 text-sm text-white/90">
          {ev ? (
            <>
              📅 {formatDate(ev.date)}
              {ev.time ? ` · ${formatTime(ev.time)}` : ""}
            </>
          ) : (
            "Date to be announced"
          )}
        </p>
      </div>

      <dl className="grid grid-cols-4 divide-x divide-brand/10 border-b border-brand/10 text-center">
        {[
          { k: "Yes", v: c.yes, cls: "text-emerald-700" },
          { k: "Maybe", v: c.maybe, cls: "text-amber-700" },
          { k: "No", v: c.no, cls: "text-rose-700" },
          { k: "Guests", v: c.guests, cls: "text-brand" },
        ].map((s) => (
          <div key={s.k} className="py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-dark/50">{s.k}</dt>
            <dd className={`font-display text-xl font-bold tabular-nums ${s.cls}`}>{s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <p className="flex items-center justify-between text-xs text-brand-dark/55">
          <span>👀 {invite.views} view{invite.views === 1 ? "" : "s"}</span>
          <span>{c.responses} response{c.responses === 1 ? "" : "s"}</span>
        </p>
        <InviteCardActions id={invite.id} slug={invite.slug} title={title} />
      </div>
    </article>
  );
}
