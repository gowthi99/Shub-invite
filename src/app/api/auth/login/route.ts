import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { createSession } from "@/lib/auth";
import { jsonError, parseWith, readJson, safe } from "../../_lib/http";
import { z } from "zod";
import { credentialsSchema } from "@/lib/validation";
import { claimTokens } from "../../_lib/claims";

// Login is lenient on password length (the policy is enforced at signup) so a wrong password
// always yields the same generic error.
const loginSchema = z.object({
  email: credentialsSchema.shape.email,
  password: z.string().min(1, "Enter your password").max(200),
  claimTokens: z.array(z.unknown()).optional(),
});

export const runtime = "nodejs";

const INVALID = "Invalid email or password";
// Compared against when the email is unknown so both failure paths take similar time.
const DUMMY_HASH = "$2b$10$xLP6Qr2rBZ2lWUAvxxVLleg1c35kV.epWiivpIVLY23de46FKU1zK";

export const POST = safe(async (req: Request) => {
  const parsed = parseWith(loginSchema, await readJson(req));
  if (!parsed.ok) return parsed.response;
  const { email, password, claimTokens: tokens } = parsed.data;

  const db = await getDb();
  const [user] = await db
    .select({ id: schema.users.id, passwordHash: schema.users.passwordHash })
    .from(schema.users)
    .where(eq(schema.users.email, email));

  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH).catch(() => false);
  if (!user || !ok) return jsonError(INVALID, 401);

  await createSession(user.id);
  await claimTokens(tokens, user.id);
  return NextResponse.json({ ok: true });
});
