import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Builder from "@/components/builder/Builder";
import { getSessionUser } from "@/lib/auth";
import { getInviteByManageToken } from "@/lib/invites";

export const metadata: Metadata = {
  title: "Edit invitation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ManageEditPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [invite, user] = await Promise.all([getInviteByManageToken(token), getSessionUser()]);
  if (!invite) notFound();
  return (
    <Builder
      key={invite.id}
      initial={invite.data}
      inviteId={invite.id}
      manageToken={invite.manageToken}
      slug={invite.slug}
      isLoggedIn={!!user}
    />
  );
}
