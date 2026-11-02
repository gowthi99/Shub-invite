import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import type { ZodType } from "zod";
import { getDb, schema } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { getInviteByManageToken, getInviteForUser } from "@/lib/invites";

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Parses a JSON body; returns undefined when the body is missing or malformed. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    const text = await req.text();
    if (!text.trim()) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

type Parsed<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

/** Validates input with a zod schema and maps the first issue to a 400. */
export function parseWith<T>(schemaDef: ZodType<T>, input: unknown): Parsed<T> {
  const r = schemaDef.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const issue = r.error.issues[0];
  const msg = issue?.message && issue.message !== "Required" ? issue.message : "Invalid request";
  return { ok: false, response: jsonError(msg, 400) };
}

/** Public base URL: NEXT_PUBLIC_SITE_URL, else derived from proxy headers / the request URL. */
export function getOrigin(req: NextRequest | Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/+$/, "");
  const h = req.headers;
  const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() || h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return new URL(req.url).origin;
}

export function clientIp(req: Request) {
  const h = req.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";
}

export type ManagedInvite = NonNullable<Awaited<ReturnType<typeof getInviteForUser>>>;

/**
 * Authorizes management of an invite by either the logged-in owner or a matching manage token.
 * Returns the invite, or a ready-made 404/403 response.
 */
export async function authorizeInvite(
  id: string,
  manageToken: string | null | undefined,
): Promise<{ ok: true; invite: ManagedInvite } | { ok: false; response: NextResponse }> {
  const user = await getSessionUser();
  if (user) {
    const owned = await getInviteForUser(id, user.id);
    if (owned) return { ok: true, invite: owned };
  }
  if (manageToken && typeof manageToken === "string" && manageToken.length <= 64) {
    const byToken = await getInviteByManageToken(manageToken);
    if (byToken && byToken.id === id) return { ok: true, invite: byToken };
  }
  const db = await getDb();
  const [exists] = await db
    .select({ id: schema.invites.id })
    .from(schema.invites)
    .where(eq(schema.invites.id, id));
  if (!exists) return { ok: false, response: jsonError("Invitation not found", 404) };
  return {
    ok: false,
    response: jsonError(
      user ? "You don't have permission to manage this invitation" : "Please log in to manage this invitation",
      403,
    ),
  };
}

/** Wraps a handler so unexpected errors become a generic 500 without leaking details. */
export function safe<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[api]", err);
      return jsonError("Something went wrong. Please try again.", 500);
    }
  };
}
