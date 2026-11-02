import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { createSession } from "@/lib/auth";
import { newId } from "@/lib/invites";
import { jsonError, parseWith, readJson, safe } from "../../_lib/http";
import { authBodySchema, claimTokens } from "../../_lib/claims";

export const runtime = "nodejs";

const DUPLICATE = "An account with this email already exists";

function isUniqueViolation(err: unknown): boolean {
  for (let e: unknown = err, i = 0; e && i < 4; i++) {
    if (typeof e === "object" && (e as { code?: unknown }).code === "23505") return true;
    e = (e as { cause?: unknown }).cause;
  }
  return false;
}

export const POST = safe(async (req: Request) => {
  const parsed = parseWith(authBodySchema, await readJson(req));
  if (!parsed.ok) return parsed.response;
  const { email, password, name, claimTokens: tokens } = parsed.data;

  const db = await getDb();
  const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email));
  if (existing) return jsonError(DUPLICATE, 409);

  const id = newId();
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await db.insert(schema.users).values({ id, email, name: name || null, passwordHash });
  } catch (err) {
    if (isUniqueViolation(err)) return jsonError(DUPLICATE, 409);
    throw err;
  }

  await createSession(id);
  await claimTokens(tokens, id);
  return NextResponse.json({ ok: true });
});
