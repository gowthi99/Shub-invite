import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Builder from "@/components/builder/Builder";
import { getSessionUser } from "@/lib/auth";
import { getInviteForUser } from "@/lib/invites";
import { OCCASIONS, type Occasion } from "@/lib/types";

export const metadata: Metadata = {
  title: "Create your invitation",
  description: "Design a beautiful animated invitation in minutes — pick an occasion, add your events and share one link.",
};

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CreatePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  const editId = first(sp.edit);
  const occParam = first(sp.occasion);
  const initialOccasion = OCCASIONS.includes(occParam as Occasion) ? (occParam as Occasion) : undefined;

  if (editId) {
    if (!user) redirect(`/login?next=${encodeURIComponent(`/create?edit=${editId}`)}`);
    const invite = await getInviteForUser(editId, user.id);
    if (!invite) redirect("/dashboard");
    return (
      <Builder
        key={invite.id}
        initial={invite.data}
        inviteId={invite.id}
        manageToken={invite.manageToken}
        slug={invite.slug}
        isLoggedIn
      />
    );
  }

  return <Builder isLoggedIn={!!user} initialOccasion={initialOccasion} />;
}
