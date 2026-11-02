import "server-only";
import { and, desc, eq, sql, inArray } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { getDb, schema } from "@/db";
import type { InviteData, InviteRecord, RsvpInput, RsvpRecord } from "./types";

// Unambiguous lowercase alphabet for share links: /i/k7m2xq9p
const slugId = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);
const tokenId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 32);
const rowId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);

export const newId = () => rowId();

type InviteRow = typeof schema.invites.$inferSelect;

function toRecord(r: InviteRow): InviteRecord {
  return {
    id: r.id,
    slug: r.slug,
    userId: r.userId,
    data: r.data,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function createInvite(data: InviteData, userId: string | null) {
  const db = await getDb();
  const row = {
    id: rowId(),
    slug: slugId(),
    manageToken: tokenId(),
    userId,
    data,
  };
  await db.insert(schema.invites).values(row);
  return { id: row.id, slug: row.slug, manageToken: row.manageToken };
}

export async function getInviteBySlug(slug: string): Promise<InviteRecord | null> {
  const db = await getDb();
  const [r] = await db.select().from(schema.invites).where(eq(schema.invites.slug, slug));
  return r ? toRecord(r) : null;
}

export async function getInviteByManageToken(token: string) {
  const db = await getDb();
  const [r] = await db.select().from(schema.invites).where(eq(schema.invites.manageToken, token));
  return r ? { ...toRecord(r), manageToken: r.manageToken, views: r.views } : null;
}

export async function getInviteForUser(id: string, userId: string) {
  const db = await getDb();
  const [r] = await db
    .select()
    .from(schema.invites)
    .where(and(eq(schema.invites.id, id), eq(schema.invites.userId, userId)));
  return r ? { ...toRecord(r), manageToken: r.manageToken, views: r.views } : null;
}

export async function listInvitesForUser(userId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.invites)
    .where(eq(schema.invites.userId, userId))
    .orderBy(desc(schema.invites.createdAt));
  const counts = await rsvpCounts(rows.map((r) => r.id));
  return rows.map((r) => ({ ...toRecord(r), manageToken: r.manageToken, views: r.views, rsvp: counts[r.id] ?? emptyCounts() }));
}

export async function updateInviteData(id: string, data: InviteData) {
  const db = await getDb();
  await db
    .update(schema.invites)
    .set({ data, updatedAt: new Date() })
    .where(eq(schema.invites.id, id));
}

export async function deleteInvite(id: string) {
  const db = await getDb();
  await db.delete(schema.invites).where(eq(schema.invites.id, id));
}

/** Attach anonymous invites (created before login) to a user account. */
export async function claimInvite(manageToken: string, userId: string) {
  const db = await getDb();
  await db
    .update(schema.invites)
    .set({ userId })
    .where(and(eq(schema.invites.manageToken, manageToken), sql`${schema.invites.userId} IS NULL`));
}

export async function incrementViews(id: string) {
  const db = await getDb();
  await db
    .update(schema.invites)
    .set({ views: sql`${schema.invites.views} + 1` })
    .where(eq(schema.invites.id, id));
}

export async function addRsvp(inviteId: string, input: RsvpInput) {
  const db = await getDb();
  const id = rowId();
  await db.insert(schema.rsvps).values({ id, inviteId, ...input });
  return id;
}

export async function listRsvps(inviteId: string): Promise<RsvpRecord[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.rsvps)
    .where(eq(schema.rsvps.inviteId, inviteId))
    .orderBy(desc(schema.rsvps.createdAt));
  return rows.map((r) => ({
    id: r.id,
    inviteId: r.inviteId,
    name: r.name,
    phone: r.phone ?? undefined,
    status: r.status,
    guests: r.guests,
    eventIds: r.eventIds,
    message: r.message ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function deleteRsvp(inviteId: string, rsvpId: string) {
  const db = await getDb();
  await db
    .delete(schema.rsvps)
    .where(and(eq(schema.rsvps.id, rsvpId), eq(schema.rsvps.inviteId, inviteId)));
}

export interface RsvpCounts {
  responses: number;
  yes: number;
  no: number;
  maybe: number;
  guests: number; // total headcount of "yes" responses
}

export const emptyCounts = (): RsvpCounts => ({ responses: 0, yes: 0, no: 0, maybe: 0, guests: 0 });

export function summarize(list: Pick<RsvpRecord, "status" | "guests">[]): RsvpCounts {
  const c = emptyCounts();
  for (const r of list) {
    c.responses++;
    c[r.status]++;
    if (r.status === "yes") c.guests += r.guests;
  }
  return c;
}

async function rsvpCounts(inviteIds: string[]): Promise<Record<string, RsvpCounts>> {
  if (!inviteIds.length) return {};
  const db = await getDb();
  const rows = await db
    .select({ inviteId: schema.rsvps.inviteId, status: schema.rsvps.status, guests: schema.rsvps.guests })
    .from(schema.rsvps)
    .where(inArray(schema.rsvps.inviteId, inviteIds));
  const out: Record<string, RsvpCounts> = {};
  for (const r of rows) {
    const c = (out[r.inviteId] ??= emptyCounts());
    c.responses++;
    c[r.status]++;
    if (r.status === "yes") c.guests += r.guests;
  }
  return out;
}
