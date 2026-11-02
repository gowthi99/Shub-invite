import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getInviteForUser, listRsvps } from "@/lib/invites";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { InviteRsvpOverview } from "@/components/dashboard/InviteRsvpOverview";
import { DeleteInviteButton } from "@/components/dashboard/DeleteInviteButton";
import { inviteNames } from "@/components/site/occasions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RSVPs", robots: { index: false } };

export default async function InviteRsvpsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/dashboard/invites/${id}`)}`);

  const invite = await getInviteForUser(id, user.id);
  if (!invite) notFound();
  const rsvps = await listRsvps(invite.id);
  const names = inviteNames(invite.data);

  const pill =
    "inline-flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-white";

  return (
    <>
      <SiteHeader user={user} />
      <main>
        <InviteRsvpOverview
          invite={invite}
          rsvps={rsvps}
          top={
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark/70 hover:text-brand">
              ← All invitations
            </Link>
          }
          actions={
            <>
              <Link href={`/create?edit=${invite.id}`} className={pill}>
                ✏️ Edit invitation
              </Link>
              <a href={`/i/${invite.slug}`} target="_blank" rel="noopener noreferrer" className={pill}>
                Open ↗
              </a>
              <DeleteInviteButton
                inviteId={invite.id}
                title={invite.data.title?.trim() || names}
                redirectTo="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/50 transition hover:bg-red-600 hover:ring-red-600"
              />
            </>
          }
        />
      </main>
      <SiteFooter />
    </>
  );
}
