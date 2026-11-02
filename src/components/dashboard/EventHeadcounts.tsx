import type { InviteEvent, RsvpRecord } from "@/lib/types";
import { formatDate, formatTime } from "@/components/site/occasions";

/** Per-event headcount: sum of guests of "yes" RSVPs whose eventIds include the event. */
export function eventHeadcounts(events: InviteEvent[], rsvps: RsvpRecord[]) {
  return events.map((ev) => {
    let guests = 0;
    let responses = 0;
    for (const r of rsvps) {
      if (r.status === "yes" && r.eventIds?.includes(ev.id)) {
        guests += r.guests;
        responses++;
      }
    }
    return { event: ev, guests, responses };
  });
}

export function EventHeadcounts({ events, rsvps }: { events: InviteEvent[]; rsvps: RsvpRecord[] }) {
  if (events.length < 2) return null;
  const rows = eventHeadcounts(
    [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
    rsvps,
  );
  const max = Math.max(1, ...rows.map((r) => r.guests));
  return (
    <section aria-labelledby="per-event" className="rounded-3xl border border-gold/30 bg-white/85 p-5 shadow-sm">
      <h2 id="per-event" className="flex items-center gap-2 font-semibold text-brand-dark">
        <span aria-hidden>🪔</span> Headcount per event
      </h2>
      <ul className="mt-4 space-y-3">
        {rows.map(({ event, guests, responses }) => (
          <li key={event.id}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-brand-dark">{event.name}</p>
                <p className="text-xs text-brand-dark/55">
                  {formatDate(event.date)}
                  {event.time ? ` · ${formatTime(event.time)}` : ""}
                  {event.venue ? ` · ${event.venue}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-right">
                <span className="font-display text-2xl font-bold tabular-nums text-brand">{guests}</span>
                <span className="ml-1 text-xs text-brand-dark/55">
                  guest{guests === 1 ? "" : "s"} · {responses} RSVP{responses === 1 ? "" : "s"}
                </span>
              </p>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand/10" aria-hidden>
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-gold transition-all"
                style={{ width: `${(guests / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
