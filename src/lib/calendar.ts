// Calendar export helpers. All invite times are local India time (Asia/Kolkata, UTC+05:30).
import type { InviteEvent } from "./types";
import { eventLocation } from "./maps";

export const INVITE_TZ = "Asia/Kolkata";
const IST_OFFSET_MIN = 5 * 60 + 30;
const DEFAULT_DURATION_MIN = 3 * 60;

export interface CalendarItem {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm, "" = all day
  endTime?: string; // HH:mm
  url?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Epoch ms of an India-local date + time. */
export function istToEpoch(date: string, time = "00:00") {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = (time || "00:00").split(":").map(Number);
  return Date.UTC(y, mo - 1, d, h || 0, mi || 0) - IST_OFFSET_MIN * 60_000;
}

/** Today's date in India as YYYY-MM-DD. */
export function todayInIndia(now = Date.now()) {
  const d = new Date(now + IST_OFFSET_MIN * 60_000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function utcStamp(ms: number) {
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function dateStamp(date: string) {
  return date.replace(/-/g, "");
}

function nextDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const n = new Date(Date.UTC(y, m - 1, d + 1));
  return `${n.getUTCFullYear()}${pad(n.getUTCMonth() + 1)}${pad(n.getUTCDate())}`;
}

/** Start/end in epoch ms, or null for all-day items. */
function range(item: CalendarItem): { start: number; end: number } | null {
  if (!item.time) return null;
  const start = istToEpoch(item.date, item.time);
  let end = start + DEFAULT_DURATION_MIN * 60_000;
  if (item.endTime) {
    let e = istToEpoch(item.date, item.endTime);
    if (e <= start) e += 24 * 60 * 60_000; // ends after midnight
    end = e;
  }
  return { start, end };
}

/** Build a calendar item from an invite event. */
export function toCalendarItem(
  event: InviteEvent,
  opts: { title: string; description?: string; url?: string; uidPrefix?: string },
): CalendarItem {
  return {
    uid: `${opts.uidPrefix ?? "invite"}-${event.id}@shubh-invites`,
    title: opts.title,
    description: opts.description,
    location: eventLocation(event) || undefined,
    date: event.date,
    time: event.time,
    endTime: event.endTime,
    url: opts.url,
  };
}

/** Google Calendar "create event" template link. */
export function googleCalendarUrl(item: CalendarItem) {
  const r = range(item);
  const dates = r ? `${utcStamp(r.start)}/${utcStamp(r.end)}` : `${dateStamp(item.date)}/${nextDay(item.date)}`;
  const details = [item.description, item.url].filter(Boolean).join("\n\n");
  const params = new URLSearchParams({ action: "TEMPLATE", text: item.title, dates, ctz: INVITE_TZ });
  if (details) params.set("details", details);
  if (item.location) params.set("location", item.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** Folds a content line to ≤75 octets (RFC 5545), never splitting a UTF-8 character. */
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + b > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** RFC 5545 .ics text for one or more items. */
export function buildIcs(items: CalendarItem[]) {
  const now = utcStamp(Date.now());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shubh Invites//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const item of items) {
    const r = range(item);
    lines.push("BEGIN:VEVENT", `UID:${item.uid}`, `DTSTAMP:${now}`);
    if (r) {
      lines.push(`DTSTART:${utcStamp(r.start)}`, `DTEND:${utcStamp(r.end)}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${dateStamp(item.date)}`, `DTEND;VALUE=DATE:${nextDay(item.date)}`);
    }
    lines.push(`SUMMARY:${escapeText(item.title)}`);
    const desc = [item.description, item.url].filter(Boolean).join("\n\n");
    if (desc) lines.push(`DESCRIPTION:${escapeText(desc)}`);
    if (item.location) lines.push(`LOCATION:${escapeText(item.location)}`);
    if (item.url) lines.push(`URL:${item.url}`);
    if (r) {
      lines.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "TRIGGER:-PT2H", "END:VALARM");
    }
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Triggers a client-side download of an .ics file. Browser only. */
export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Safe file name from arbitrary (possibly non-Latin) text. */
export function icsFileName(text: string) {
  const base = text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60);
  return `${base || "invitation"}.ics`;
}
