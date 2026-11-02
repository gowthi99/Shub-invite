import type { ReactNode } from "react";
import type { InviteRecord, RsvpRecord } from "@/lib/types";
import { summarize } from "@/lib/invites";
import { firstEvent, formatDate, formatTime, inviteNames, occasionMeta } from "@/components/site/occasions";
import { RsvpStats } from "./RsvpStats";
import { EventHeadcounts } from "./EventHeadcounts";
import { ShareLinkBox } from "./ShareLinkBox";
import { RsvpList } from "./RsvpList";

interface Props {
  invite: InviteRecord & { views: number };
  rsvps: RsvpRecord[];
  /** Present on the no-login manage page; appended as ?token= to API calls. */
  manageToken?: string;
  /** Buttons rendered in the header (edit, delete…). */
  actions?: ReactNode;
  /** Optional element above the header (e.g. back link). */
  top?: ReactNode;
}

/** Shared RSVP management view used by /dashboard/invites/[id] and /manage/[token]. */
export function InviteRsvpOverview({ invite, rsvps, manageToken, actions, top }: Props) {
  const d = invite.data;
  const meta = occasionMeta(d.occasion);
  const names = inviteNames(d);
  const ev = firstEvent(d);
  const title = d.title?.trim() || `${names} · ${meta.label}`;
  const counts = summarize(rsvps);

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:py-10">
      {top}
      <header className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8" style={{ background: meta.gradient }}>
        <div aria-hidden className="absolute -right-6 -top-8 text-9xl opacity-15">
          {meta.emoji}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold backdrop-blur">
          <span aria-hidden>{meta.emoji}</span> {meta.label}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold drop-shadow-sm sm:text-4xl">{names}</h1>
        {d.title && <p className="mt-1 text-white/90">{d.title}</p>}
        <p className="mt-2 text-sm text-white/90">
          {ev ? (
            <>
              📅 {formatDate(ev.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {ev.time ? ` · ${formatTime(ev.time)}` : ""}
              {ev.venue ? ` · ${ev.venue}` : ""}
            </>
          ) : (
            "Date to be announced"
          )}
        </p>
        {d.rsvpEnabled === false && (
          <p className="mt-3 inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-semibold">RSVP is turned off for this invitation</p>
        )}
        {actions && <div className="relative mt-5 flex flex-wrap gap-2">{actions}</div>}
      </header>

      <RsvpStats counts={counts} views={invite.views} />

      <div className="grid gap-5 lg:grid-cols-2">
        <ShareLinkBox slug={invite.slug} title={title} />
        <EventHeadcounts events={d.events} rsvps={rsvps} />
      </div>

      <RsvpList inviteId={invite.id} rsvps={rsvps} events={d.events} manageToken={manageToken} />
    </div>
  );
}
