import type { InviteEvent } from "./types";

/** Google Maps search link for a venue / address. */
export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Text used to locate an event: "Venue, Address" (skipping empty parts). */
export function eventLocation(event: Pick<InviteEvent, "venue" | "address">) {
  return [event.venue, event.address]
    .map((s) => s?.trim())
    .filter(Boolean)
    .join(", ");
}

/**
 * "Get directions" link for an event: the host's pasted map link if present, otherwise a Google Maps
 * search for venue + address. Returns null when there is nothing to search for.
 */
export function directionsUrl(event: Pick<InviteEvent, "venue" | "address" | "mapUrl">): string | null {
  const explicit = event.mapUrl?.trim();
  if (explicit && /^https:\/\//i.test(explicit)) return explicit;
  const q = eventLocation(event);
  return q ? mapsSearchUrl(q) : null;
}
