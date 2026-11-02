import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getInviteByManageToken, listRsvps } from "@/lib/invites";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { InviteRsvpOverview } from "@/components/dashboard/InviteRsvpOverview";
import { DeleteInviteButton } from "@/components/dashboard/DeleteInviteButton";
import { inviteNames } from "@/components/site/occasions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Manage invitation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManagePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [invite, user] = await Promise.all([getInviteByManageToken(token), getSessionUser()]);
  if (!invite) notFound();
  const rsvps = await listRsvps(invite.id);
  const names = inviteNames(invite.data);
  const ownedByViewer = !!user && invite.userId === user.id;
  const signupHref = `/signup?claim=${encodeURIComponent(token)}`;

  const pill =
    "inline-flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-white";

  const banner = ownedByViewer ? (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <p>✅ This invitation is saved to your account.</p>
      <Link href={`/dashboard/invites/${invite.id}`} className="font-semibold underline-offset-4 hover:underline">
        Open in dashboard →
      </Link>
    </div>
  ) : (
    <div className="relative overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-[#fff3dc] to-white p-5 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span aria-hidden className="si-float grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold text-2xl text-white shadow">
            🔖
          </span>
          <div>
            <p className="font-display text-xl font-bold text-brand-dark">Bookmark this private page</p>
            <p className="mt-0.5 text-sm text-brand-dark/70">
              This secret link is the only way to edit your invitation and see RSVPs without an account. Don&apos;t share it
              with guests — share the invitation link below instead.
            </p>
          </div>
        </div>
        {invite.userId ? null : (
          <Link
            href={user ? `/login?claim=${encodeURIComponent(token)}` : signupHref}
            className="shrink-0 rounded-2xl bg-brand px-5 py-3.5 text-center font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            Save to an account
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SiteHeader user={user} />
      <main>
        <InviteRsvpOverview
          invite={invite}
          rsvps={rsvps}
          manageToken={token}
          top={banner}
          actions={
            <>
              <Link href={`/manage/${token}/edit`} className={pill}>
                ✏️ Edit invitation
              </Link>
              <a href={`/i/${invite.slug}`} target="_blank" rel="noopener noreferrer" className={pill}>
                Open ↗
              </a>
              <DeleteInviteButton
                inviteId={invite.id}
                title={invite.data.title?.trim() || names}
                manageToken={token}
                redirectTo="/"
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
