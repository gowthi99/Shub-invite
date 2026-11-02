import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { cache } from "react";
import InviteView from "@/components/invite/InviteView";
import { getInviteBySlug, incrementViews } from "@/lib/invites";
import { getStrings } from "@/lib/i18n";
import { isCoupleOccasion } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const SLUG_RE = /^[a-z0-9-]{3,64}$/i;
const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp\/|telegrambot|embedly|curl|wget|headless|lighthouse/i;

const loadInvite = cache(async (slug: string) => {
  if (!SLUG_RE.test(slug)) return null;
  return getInviteBySlug(slug);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invite = await loadInvite(slug);
  if (!invite) return { title: "Invitation not found", robots: { index: false } };
  const d = invite.data;
  const t = getStrings(d.language);
  const names =
    isCoupleOccasion(d.occasion) && d.secondaryName?.trim()
      ? `${d.primaryName} ${t.ui.and} ${d.secondaryName}`
      : d.primaryName;
  const title = `${names} — ${t.occasionLabel[d.occasion]}`;
  const description = (d.message?.trim() || t.defaultMessage[d.occasion]).slice(0, 200);
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { type: "website", title, description, url: `/i/${invite.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const invite = await loadInvite(slug);
  if (!invite) notFound();

  const ua = (await headers()).get("user-agent") ?? "";
  if (!BOT_RE.test(ua)) {
    // Count the view after the response is sent; never block or fail the render.
    after(() => incrementViews(invite.id).catch(() => {}));
  }

  return <InviteView data={invite.data} slug={invite.slug} />;
}
