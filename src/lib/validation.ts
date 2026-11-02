import { z } from "zod";
import { OCCASIONS, LANGUAGES } from "./types";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");
const time = z.string().regex(/^(\d{2}:\d{2})?$/, "Invalid time");
const short = (max: number) => z.string().trim().max(max);

export const inviteEventSchema = z.object({
  id: short(24).min(1),
  name: short(80).min(1),
  date,
  time,
  endTime: time.optional(),
  venue: short(160),
  address: short(400),
  mapUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((u) => u === "" || /^https:\/\//.test(u), "Map link must start with https://")
    .optional(),
  dressCode: short(120).optional(),
  notes: short(500).optional(),
});

export const inviteDataSchema = z
  .object({
    occasion: z.enum(OCCASIONS),
    language: z.enum(LANGUAGES),
    mode: z.enum(["single", "multi"]),
    themeId: short(60).min(1),
    primaryName: short(80).min(1, "Name is required"),
    secondaryName: short(80).optional(),
    hostedBy: short(160).optional(),
    title: short(160).optional(),
    message: short(1200).optional(),
    photoUrl: z.string().max(1000).optional(),
    events: z.array(inviteEventSchema).min(1, "Add at least one event").max(12),
    rsvpEnabled: z.boolean(),
    rsvpDeadline: date.optional().or(z.literal("")),
    contactPhone: short(30).optional(),
    scratchReveal: z.boolean(),
    musicEnabled: z.boolean().optional(),
  })
  .refine((d) => d.mode === "multi" || d.events.length === 1, {
    message: "Single-event invitations have exactly one event",
    path: ["events"],
  });

export const rsvpInputSchema = z.object({
  name: short(100).min(1, "Name is required"),
  phone: short(30).optional(),
  status: z.enum(["yes", "no", "maybe"]),
  guests: z.number().int().min(0).max(50),
  eventIds: z.array(short(24)).max(12),
  message: short(1000).optional(),
});

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  name: short(80).optional(),
});
