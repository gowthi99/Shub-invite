import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { inviteDataSchema } from "@/lib/validation";
import { getSessionUser } from "@/lib/auth";
import { createInvite } from "@/lib/invites";
import type { InviteData } from "@/lib/types";
import { getOrigin, parseWith, readJson, safe } from "../_lib/http";

export const runtime = "nodejs";

const bodySchema = z.object({ data: inviteDataSchema });

export const POST = safe(async (req: NextRequest) => {
  const parsed = parseWith(bodySchema, await readJson(req));
  if (!parsed.ok) return parsed.response;

  const user = await getSessionUser();
  const { id, slug, manageToken } = await createInvite(parsed.data.data as InviteData, user?.id ?? null);
  const origin = getOrigin(req);
  return NextResponse.json(
    { id, slug, manageToken, url: `${origin}/i/${slug}`, manageUrl: `${origin}/manage/${manageToken}` },
    { status: 201 },
  );
});
