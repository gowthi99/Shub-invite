import { pgTable, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import type { InviteData, RsvpStatus } from "@/lib/types";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invites = pgTable(
  "invites",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    // Secret token for hosts who created without login: /manage/{manageToken}
    manageToken: text("manage_token").notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    data: jsonb("data").$type<InviteData>().notNull(),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("invites_user_idx").on(t.userId)],
);

export const rsvps = pgTable(
  "rsvps",
  {
    id: text("id").primaryKey(),
    inviteId: text("invite_id")
      .notNull()
      .references(() => invites.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    status: text("status").$type<RsvpStatus>().notNull(),
    guests: integer("guests").notNull().default(1),
    eventIds: jsonb("event_ids").$type<string[]>().notNull().default([]),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rsvps_invite_idx").on(t.inviteId)],
);

// Kept in sync with the tables above; executed idempotently on first DB use so neither
// local PGlite nor a fresh Neon database needs a separate migration step.
export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS invites (
    id text PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    manage_token text NOT NULL UNIQUE,
    user_id text REFERENCES users(id) ON DELETE SET NULL,
    data jsonb NOT NULL,
    views integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS invites_user_idx ON invites(user_id)`,
  `CREATE TABLE IF NOT EXISTS rsvps (
    id text PRIMARY KEY,
    invite_id text NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text,
    status text NOT NULL,
    guests integer NOT NULL DEFAULT 1,
    event_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
    message text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS rsvps_invite_idx ON rsvps(invite_id)`,
];
