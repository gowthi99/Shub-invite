import { NextResponse, type NextRequest } from "next/server";
import { deleteRsvp } from "@/lib/invites";
import { authorizeInvite, readJson, safe } from "../../../../_lib/http";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string; rsvpId: string }> };

export const DELETE = safe(async (req: NextRequest, ctx: Ctx) => {
  const { id, rsvpId } = await ctx.params;
  const body = (await readJson(req)) as { manageToken?: unknown } | undefined;
  const bodyToken = typeof body?.manageToken === "string" ? body.manageToken : null;
  const auth = await authorizeInvite(id, req.nextUrl.searchParams.get("token") ?? bodyToken);
  if (!auth.ok) return auth.response;

  await deleteRsvp(id, rsvpId);
  return NextResponse.json({ ok: true });
});
