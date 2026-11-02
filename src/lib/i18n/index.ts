// Guest-facing translations. The builder/dashboard UI is English; the *invitation* renders in the
// language the host picked. Add every guest-visible string here so all three languages stay in sync.
import type { Language, Occasion } from "@/lib/types";
import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";

export interface Strings {
  occasionLabel: Record<Occasion, string>; // "Wedding", "Haldi", ...
  defaultTitle: Record<Occasion, string>; // headline, e.g. "Together with their families"
  defaultMessage: Record<Occasion, string>; // body text inviting guests
  suggestedEvents: Record<Occasion, string[]>; // event names offered in multi-day mode
  ui: {
    youAreInvited: string;
    tapToOpen: string; // envelope intro
    scratchToReveal: string;
    dateRevealed: string;
    countdownTitle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    itsToday: string;
    eventOver: string;
    events: string;
    venue: string;
    getDirections: string; // Google Maps
    addToCalendar: string;
    dressCode: string;
    hostedBy: string;
    rsvpTitle: string;
    rsvpSubtitle: string; // "Kindly respond by {date}" – contains {date}
    rsvpSubtitleNoDeadline: string;
    yourName: string;
    phone: string;
    attending: string;
    yes: string;
    no: string;
    maybe: string;
    numberOfGuests: string;
    whichEvents: string;
    messageForHosts: string;
    submit: string;
    submitting: string;
    rsvpThanksYes: string;
    rsvpThanksNo: string;
    rsvpError: string;
    rsvpClosed: string;
    callHost: string;
    whatsappHost: string;
    share: string;
    copied: string;
    musicOn: string;
    musicOff: string;
    and: string; // joins couple names: "Priya & Arjun" uses "&", but text may use "and"
    madeWith: string; // footer credit
    respondAgain: string; // change an already-sent RSVP
  };
}

const dictionaries: Record<Language, Strings> = { en, te, hi };

export function getStrings(lang: Language): Strings {
  return dictionaries[lang] ?? en;
}

const LOCALES: Record<Language, string> = { en: "en-IN", te: "te-IN", hi: "hi-IN" };

/** "Saturday, 14 February 2027" in the invite language. date is "YYYY-MM-DD". */
export function formatDate(date: string, lang: Language) {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat(LOCALES[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "7:30 PM" in the invite language. time is "HH:mm". */
export function formatTime(time: string, lang: Language) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return new Intl.DateTimeFormat(LOCALES[lang], { hour: "numeric", minute: "2-digit" }).format(d);
}

/** Replaces {key} placeholders. */
export function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
