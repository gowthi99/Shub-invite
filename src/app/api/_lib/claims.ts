import "server-only";
import { z } from "zod";
import { credentialsSchema } from "@/lib/validation";
import { claimInvite } from "@/lib/invites";

export const authBodySchema = credentialsSchema.extend({
  claimTokens: z.array(z.unknown()).optional(),
});

/** Attaches anonymously-created invites (by manage token) to the user. Max 50, failures ignored. */
export async function claimTokens(tokens: unknown[] | undefined, userId: string) {
  if (!tokens?.length) return;
  const unique = [
    ...new Set(tokens.filter((t): t is string => typeof t === "string" && t.length > 0 && t.length <= 64)),
  ].slice(0, 50);
  for (const t of unique) {
    try {
      await claimInvite(t, userId);
    } catch (err) {
      console.error("[claimInvite]", err);
    }
  }
}
