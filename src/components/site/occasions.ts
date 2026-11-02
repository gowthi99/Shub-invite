import { OCCASIONS, isCoupleOccasion, type InviteData, type Occasion } from "@/lib/types";
import { en } from "@/lib/i18n/en";

export interface OccasionMeta {
  id: Occasion;
  label: string;
  emoji: string;
  /** Tailwind classes for a soft themed chip/badge */
  chip: string;
  /** CSS gradient used for card accents */
  gradient: string;
}

const META: Record<Occasion, { emoji: string; chip: string; gradient: string }> = {
  wedding: { emoji: "💍", chip: "bg-rose-100 text-rose-800", gradient: "linear-gradient(135deg,#b4235a,#e0748f)" },
  engagement: { emoji: "💞", chip: "bg-pink-100 text-pink-800", gradient: "linear-gradient(135deg,#d6336c,#f7a1c4)" },
  haldi: { emoji: "🌼", chip: "bg-yellow-100 text-yellow-800", gradient: "linear-gradient(135deg,#e2a400,#ffd76a)" },
  mehndi: { emoji: "🌿", chip: "bg-green-100 text-green-800", gradient: "linear-gradient(135deg,#2f7d32,#9ccc65)" },
  sangeet: { emoji: "🎶", chip: "bg-purple-100 text-purple-800", gradient: "linear-gradient(135deg,#6a1b9a,#c77dff)" },
  reception: { emoji: "🥂", chip: "bg-amber-100 text-amber-800", gradient: "linear-gradient(135deg,#8a6d1a,#c9a227)" },
  birthday: { emoji: "🎂", chip: "bg-sky-100 text-sky-800", gradient: "linear-gradient(135deg,#0284c7,#7dd3fc)" },
  babyshower: { emoji: "🍼", chip: "bg-teal-100 text-teal-800", gradient: "linear-gradient(135deg,#0d9488,#99f6e4)" },
  anniversary: { emoji: "❤️", chip: "bg-red-100 text-red-800", gradient: "linear-gradient(135deg,#b91c1c,#f87171)" },
  housewarming: { emoji: "🏡", chip: "bg-orange-100 text-orange-800", gradient: "linear-gradient(135deg,#c2410c,#fdba74)" },
  graduation: { emoji: "🎓", chip: "bg-indigo-100 text-indigo-800", gradient: "linear-gradient(135deg,#3730a3,#a5b4fc)" },
  party: { emoji: "🎉", chip: "bg-fuchsia-100 text-fuchsia-800", gradient: "linear-gradient(135deg,#a21caf,#f0abfc)" },
};

export function occasionMeta(o: Occasion): OccasionMeta {
  const m = META[o] ?? META.party;
  return { id: o, label: en.occasionLabel[o] ?? o, ...m };
}

export const OCCASION_LIST: OccasionMeta[] = OCCASIONS.map(occasionMeta);

/** "Priya & Arjun" for couple occasions, otherwise the primary name. */
export function inviteNames(d: InviteData): string {
  if (isCoupleOccasion(d.occasion) && d.secondaryName?.trim()) {
    return `${d.primaryName} & ${d.secondaryName}`;
  }
  return d.primaryName;
}

/** Earliest event (by date+time). */
export function firstEvent(d: InviteData) {
  const sorted = [...(d.events ?? [])].sort((a, b) =>
    `${a.date}T${a.time || "00:00"}`.localeCompare(`${b.date}T${b.time || "00:00"}`),
  );
  return sorted[0];
}

/** Formats a "YYYY-MM-DD" date without timezone drift. */
export function formatDate(date: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? "");
  if (!m) return date || "Date TBA";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
  return new Intl.DateTimeFormat("en-IN", { ...opts, timeZone: "UTC" }).format(d);
}

/** "18:30" → "6:30 PM" */
export function formatTime(time: string | undefined) {
  if (!time) return "";
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) return time;
  const h = +m[1];
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  const y = Math.round(mo / 12);
  return `${y} year${y > 1 ? "s" : ""} ago`;
}
