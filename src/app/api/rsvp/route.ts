import { NextResponse } from "next/server";
import { z } from "zod";
import { rsvpInputSchema } from "@/lib/validation";
import { addRsvp, getInviteBySlug } from "@/lib/invites";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, jsonError, parseWith, readJson, safe } from "../_lib/http";

export const runtime = "nodejs";

const bodySchema = rsvpInputSchema.extend({ slug: z.string().trim().min(1).max(32) });

/** True once the deadline day ("YYYY-MM-DD") has fully ended in India Standard Time. */
function deadlinePassed(deadline: string | undefined) {
  if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return false;
  const end = Date.parse(`${deadline}T23:59:59.999+05:30`);
  return Number.isFinite(end) && Date.now() > end;
}

export const POST = safe(async (req: Request) => {
  const parsed = parseWith(bodySchema, await readJson(req));
  if (!parsed.ok) return parsed.response;
  const { slug, name, phone, status, guests, eventIds, message } = parsed.data;

  // Per-instance, best-effort limit: 10 submissions per minute per IP per invite.
  if (!rateLimit(`rsvp:${clientIp(req)}:${slug}`, 10, 60_000)) {
    return jsonError("Too many responses. Please wait a minute and try again.", 429);
  }

  const invite = await getInviteBySlug(slug);
  if (!invite) return jsonError("Invitation not found", 404);
  const { data } = invite;
  if (!data.rsvpEnabled) return jsonError("RSVPs are not enabled for this invitation", 403);
  if (deadlinePassed(data.rsvpDeadline)) return jsonError("RSVPs are closed", 403);

  const validIds = new Set(data.events.map((e) => e.id));
  const chosen =
    data.mode === "single" ? data.events.slice(0, 1).map((e) => e.id) : [...new Set(eventIds)].filter((id) => validIds.has(id));

  await addRsvp(invite.id, {
    name,
    phone: phone || undefined,
    status,
    guests: status === "no" ? 0 : Math.max(1, guests),
    eventIds: status === "no" ? [] : chosen,
    message: message || undefined,
  });
  return NextResponse.json({ ok: true });
});
