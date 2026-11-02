import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listInvitesForUser } from "@/lib/invites";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { InviteCard } from "@/components/dashboard/InviteCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");

  const invites = await listInvitesForUser(user.id);
  const totals = invites.reduce(
    (t, i) => ({
      views: t.views + i.views,
      responses: t.responses + i.rsvp.responses,
      yes: t.yes + i.rsvp.yes,
      guests: t.guests + i.rsvp.guests,
    }),
    { views: 0, responses: 0, yes: 0, guests: 0 },
  );
  const firstName = (user.name?.trim() || user.email.split("@")[0]).split(" ")[0];

  const stats = [
    { label: "Invitations", value: invites.length, icon: "💌" },
    { label: "Views", value: totals.views, icon: "👀" },
    { label: "Responses", value: totals.responses, icon: "📝" },
    { label: "Guests attending", value: totals.guests, icon: "👥" },
  ];

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Your dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-brand-dark sm:text-4xl">Namaste, {firstName} 🙏</h1>
          </div>
          <Link
            href="/create"
            className="rounded-2xl bg-brand px-5 py-3.5 font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            + Create new invitation
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gold/25 bg-white/85 p-4 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark/55">
                <span aria-hidden>{s.icon}</span> {s.label}
              </dt>
              <dd className="mt-1 font-display text-3xl font-bold tabular-nums text-brand-dark">{s.value}</dd>
            </div>
          ))}
        </dl>

        {invites.length === 0 ? (
          <div className="mt-10 rounded-3xl border-2 border-dashed border-gold/40 bg-white/60 px-6 py-16 text-center">
            <p className="si-float text-6xl" aria-hidden>
              🪷
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold text-brand-dark">No invitations yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-brand-dark/60">
              Create your first animated invitation in minutes — then share it on WhatsApp and track RSVPs right here.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-block rounded-2xl bg-brand px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
            >
              Create your first invitation
            </Link>
          </div>
        ) : (
          <section aria-label="Your invitations" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {invites.map((inv) => (
              <InviteCard key={inv.id} invite={inv} />
            ))}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
