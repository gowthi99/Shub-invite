import type { InviteData, InviteEvent, Language, Occasion } from "@/lib/types";
import { isCoupleOccasion } from "@/lib/types";
import { getStrings } from "@/lib/i18n";
import { themesFor } from "@/themes";

export const DRAFT_KEY = "draft:new";
export const MY_INVITES_KEY = "myInvites";

export interface OccasionMeta {
  emoji: string;
  label: string;
  blurb: string;
}

export const OCCASION_META: Record<Occasion, OccasionMeta> = {
  wedding: { emoji: "💍", label: "Wedding", blurb: "The big day" },
  engagement: { emoji: "💞", label: "Engagement", blurb: "Ring ceremony" },
  haldi: { emoji: "🌼", label: "Haldi", blurb: "Turmeric & laughter" },
  mehndi: { emoji: "🌿", label: "Mehndi", blurb: "Henna night" },
  sangeet: { emoji: "🎶", label: "Sangeet", blurb: "Music & dance" },
  reception: { emoji: "🥂", label: "Reception", blurb: "Dinner & celebration" },
  birthday: { emoji: "🎂", label: "Birthday", blurb: "Cake & candles" },
  babyshower: { emoji: "🍼", label: "Baby Shower", blurb: "Welcome little one" },
  anniversary: { emoji: "❤️", label: "Anniversary", blurb: "Years of love" },
  housewarming: { emoji: "🏡", label: "Housewarming", blurb: "Griha pravesh" },
  graduation: { emoji: "🎓", label: "Graduation", blurb: "Proud milestone" },
  party: { emoji: "🎉", label: "Farewell / Party", blurb: "Good times" },
};

export const WEDDING_TYPES: Occasion[] = ["wedding", "engagement", "haldi", "mehndi", "sangeet", "reception"];

export interface NameLabels {
  primary: string;
  primaryPlaceholder: string;
  secondary?: string;
  secondaryPlaceholder?: string;
}

export function nameLabels(o: Occasion): NameLabels {
  if (WEDDING_TYPES.includes(o))
    return { primary: "Bride's name", primaryPlaceholder: "Priya", secondary: "Groom's name", secondaryPlaceholder: "Arjun" };
  switch (o) {
    case "anniversary":
      return { primary: "Your name", primaryPlaceholder: "Lakshmi", secondary: "Partner's name", secondaryPlaceholder: "Ravi" };
    case "birthday":
      return { primary: "Birthday person's name", primaryPlaceholder: "Aarav" };
    case "babyshower":
      return { primary: "Parents-to-be", primaryPlaceholder: "Ananya & Rahul" };
    case "housewarming":
      return { primary: "Family name", primaryPlaceholder: "The Reddy family" };
    case "graduation":
      return { primary: "Graduate's name", primaryPlaceholder: "Meera" };
    default:
      return { primary: "Who are we celebrating?", primaryPlaceholder: "Rohan's farewell" };
  }
}

export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().slice(0, 8);
  } catch {
    /* insecure context */
  }
  return Math.random().toString(36).slice(2, 10).padEnd(8, "0");
}

export function emptyEvent(name = ""): InviteEvent {
  return { id: newEventId(), name, date: "", time: "", endTime: "", venue: "", address: "", mapUrl: "", dressCode: "", notes: "" };
}

export function defaultEventName(o: Occasion, lang: Language) {
  return getStrings(lang).suggestedEvents[o]?.[0] ?? getStrings(lang).occasionLabel[o];
}

export function defaultData(occasion: Occasion = "wedding"): InviteData {
  return {
    occasion,
    language: "en",
    mode: "single",
    themeId: themesFor(occasion)[0]?.id ?? "",
    primaryName: "",
    secondaryName: "",
    hostedBy: "",
    title: "",
    message: "",
    photoUrl: "",
    events: [emptyEvent(defaultEventName(occasion, "en"))],
    rsvpEnabled: true,
    rsvpDeadline: "",
    contactPhone: "",
    scratchReveal: true,
    musicEnabled: false,
  };
}

/** Names as shown in share text: "Priya & Arjun" or "Aarav". */
export function displayNames(d: InviteData) {
  const a = d.primaryName.trim();
  const b = d.secondaryName?.trim();
  return isCoupleOccasion(d.occasion) && b ? `${a} & ${b}` : a;
}

/** Strips empty optional strings and fields not used by this occasion before saving. */
export function cleanData(d: InviteData): InviteData {
  const opt = (v?: string) => {
    const t = v?.trim();
    return t ? t : undefined;
  };
  const events = (d.mode === "single" ? d.events.slice(0, 1) : d.events).map((e) => ({
    id: e.id,
    name: e.name.trim(),
    date: e.date,
    time: e.time || "",
    endTime: opt(e.endTime),
    venue: e.venue.trim(),
    address: e.address.trim(),
    mapUrl: opt(e.mapUrl),
    dressCode: opt(e.dressCode),
    notes: opt(e.notes),
  }));
  return {
    occasion: d.occasion,
    language: d.language,
    mode: d.mode,
    themeId: d.themeId,
    primaryName: d.primaryName.trim(),
    secondaryName: isCoupleOccasion(d.occasion) ? opt(d.secondaryName) : undefined,
    hostedBy: opt(d.hostedBy),
    title: opt(d.title),
    message: opt(d.message),
    photoUrl: opt(d.photoUrl),
    events,
    rsvpEnabled: d.rsvpEnabled,
    rsvpDeadline: d.rsvpEnabled ? opt(d.rsvpDeadline) : undefined,
    contactPhone: opt(d.contactPhone),
    scratchReveal: d.scratchReveal,
    musicEnabled: !!d.musicEnabled,
  };
}

export type StepId = "occasion" | "language" | "details" | "events" | "theme" | "extras" | "preview";

export const STEPS: { id: StepId; label: string; title: string; subtitle: string }[] = [
  { id: "occasion", label: "Occasion", title: "What are we celebrating?", subtitle: "Pick the occasion — we'll tailor everything to it." },
  { id: "language", label: "Language", title: "Language & format", subtitle: "Choose the language your guests will read." },
  { id: "details", label: "Details", title: "The people & the words", subtitle: "Who's celebrating, and what you'd like to say." },
  { id: "events", label: "Events", title: "When & where", subtitle: "Add the date, time and venue." },
  { id: "theme", label: "Theme", title: "Choose a look", subtitle: "Every theme is animated. Tap one to apply it." },
  { id: "extras", label: "Extras", title: "Finishing touches", subtitle: "A photo, RSVPs and a little surprise." },
  { id: "preview", label: "Publish", title: "Preview & publish", subtitle: "Check everything looks perfect, then share." },
];

/** Which step owns a validation path, so we can jump there on errors. */
export function stepForPath(path: string): StepId {
  const root = path.split(".")[0];
  if (root === "occasion") return "occasion";
  if (root === "language" || root === "mode") return "language";
  if (root === "events") return "events";
  if (root === "themeId") return "theme";
  if (["photoUrl", "rsvpEnabled", "rsvpDeadline", "scratchReveal", "musicEnabled"].includes(root)) return "extras";
  return "details";
}

export interface PublishResult {
  id: string;
  slug: string;
  manageToken: string;
  url: string;
  manageUrl: string;
}

export interface MyInviteEntry {
  slug: string;
  manageToken: string;
  title: string;
  createdAt: string;
}
