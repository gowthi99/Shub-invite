// Shared data contracts. Every part of the app (builder, guest view, API, dashboard) uses these.

export const OCCASIONS = [
  "wedding",
  "engagement",
  "haldi",
  "mehndi",
  "sangeet",
  "reception",
  "birthday",
  "babyshower",
  "anniversary",
  "housewarming",
  "graduation",
  "party",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const LANGUAGES = ["en", "te", "hi"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिन्दी",
};

export type EventMode = "single" | "multi";

export interface InviteEvent {
  id: string; // short random id, stable within an invite
  name: string; // e.g. "Haldi", "Wedding Ceremony", "Birthday Party"
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm" 24h, may be ""
  endTime?: string; // "HH:mm", optional
  venue: string; // venue name, e.g. "Taj Krishna"
  address: string; // full address, used for Google Maps search
  mapUrl?: string; // optional explicit Google Maps link pasted by host
  dressCode?: string;
  notes?: string;
}

export interface InviteData {
  occasion: Occasion;
  language: Language;
  mode: EventMode;
  themeId: string;
  // People being celebrated. For couple occasions (wedding, engagement, haldi, mehndi, sangeet,
  // reception, anniversary) both are used; otherwise only primaryName.
  primaryName: string;
  secondaryName?: string;
  hostedBy?: string; // e.g. "The Reddy & Sharma families"
  title?: string; // optional custom headline; defaults from i18n per occasion
  message?: string; // optional custom invitation message; defaults from i18n per occasion
  photoUrl?: string; // optional uploaded photo
  events: InviteEvent[]; // length 1 when mode === "single"
  rsvpEnabled: boolean;
  rsvpDeadline?: string; // "YYYY-MM-DD"
  contactPhone?: string; // shown as tap-to-call / WhatsApp
  scratchReveal: boolean; // hide the first event's date behind a scratch card
  musicEnabled?: boolean; // gentle ambient tune toggle on the guest page
}

export type RsvpStatus = "yes" | "no" | "maybe";

export interface RsvpInput {
  name: string;
  phone?: string;
  status: RsvpStatus;
  guests: number; // total headcount including the respondent, 0 when status === "no"
  eventIds: string[]; // which events they will attend (multi-day)
  message?: string;
}

export interface RsvpRecord extends RsvpInput {
  id: string;
  inviteId: string;
  createdAt: string; // ISO
}

export interface InviteRecord {
  id: string;
  slug: string; // public share id: /i/{slug}
  userId: string | null;
  data: InviteData;
  createdAt: string;
  updatedAt: string;
}

// Couple-style occasions show "A & B"
export const COUPLE_OCCASIONS: Occasion[] = [
  "wedding",
  "engagement",
  "haldi",
  "mehndi",
  "sangeet",
  "reception",
  "anniversary",
];

export function isCoupleOccasion(o: Occasion) {
  return COUPLE_OCCASIONS.includes(o);
}
