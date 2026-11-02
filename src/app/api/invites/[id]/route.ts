import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { inviteDataSchema } from "@/lib/validation";
import { deleteInvite, updateInviteData } from "@/lib/invites";
import type { InviteData } from "@/lib/types";
import { authorizeInvite, parseWith, readJson, safe } from "../../_lib/http";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const putSchema = z.object({ data: inviteDataSchema, manageToken: z.string().max(64).optional() });
const deleteSchema = z.object({ manageToken: z.string().max(64).optional() }).optional();

export const PUT = safe(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const parsed = parseWith(putSchema, await readJson(req));
  if (!parsed.ok) return parsed.response;

  const token = parsed.data.manageToken ?? req.nextUrl.searchParams.get("token");
  const auth = await authorizeInvite(id, token);
  if (!auth.ok) return auth.response;

  await updateInviteData(id, parsed.data.data as InviteData);
  return NextResponse.json({ ok: true });
});

export const DELETE = safe(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const parsed = parseWith(deleteSchema, await readJson(req));
  if (!parsed.ok) return parsed.response;

  const token = parsed.data?.manageToken ?? req.nextUrl.searchParams.get("token");
  const auth = await authorizeInvite(id, token);
  if (!auth.ok) return auth.response;

  await deleteInvite(id);
  return NextResponse.json({ ok: true });
});
