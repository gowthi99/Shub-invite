import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingPetals } from "@/components/site/FloatingPetals";
import { MyInvitesOnDevice } from "@/components/site/MyInvitesOnDevice";
import { OCCASION_LIST } from "@/components/site/occasions";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "✨", title: "Scratch to reveal", text: "Guests scratch a golden card to uncover your date — a little moment of delight." },
  { icon: "⏳", title: "Live countdown", text: "Days, hours and minutes ticking down to your big day." },
  { icon: "📍", title: "Maps & directions", text: "One tap opens Google Maps with directions to every venue." },
  { icon: "💌", title: "RSVP tracking", text: "See who's coming, headcount per event, messages — export to CSV anytime." },
  { icon: "🗣️", title: "English · తెలుగు · हिन्दी", text: "Your invitation, in the language your family speaks." },
  { icon: "🪔", title: "Multi-day celebrations", text: "Haldi → Mehndi → Sangeet → Wedding, all in one beautiful invitation." },
];

const STEPS = [
  { n: "1", title: "Pick your occasion & theme", text: "Wedding, haldi, birthday or housewarming — choose a design that feels like you." },
  { n: "2", title: "Add names, dates & venues", text: "Single event or a whole week of functions. Preview it live as you type." },
  { n: "3", title: "Share one link", text: "Send it on WhatsApp. Watch the RSVPs roll in from your dashboard." },
];

export default async function Home() {
  const user = await getSessionUser();
  const firstName = user ? (user.name?.trim() || user.email.split("@")[0]).split(" ")[0] : "";

  return (
    <>
      <SiteHeader user={user} />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(201,162,39,.22), transparent 70%), radial-gradient(50% 40% at 100% 30%, rgba(180,35,90,.14), transparent 70%), radial-gradient(40% 40% at 0% 60%, rgba(244,162,89,.16), transparent 70%)",
            }}
          />
          <FloatingPetals />
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 text-center sm:pt-20">
            <p className="si-rise mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold shadow-sm">
              <span aria-hidden>✦</span> Animated online invitations <span aria-hidden>✦</span>
            </p>
            <h1
              className="si-rise mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-brand-dark sm:text-6xl"
              style={{ animationDelay: ".1s" }}
            >
              Invitations as beautiful as your{" "}
              <span className="si-shimmer bg-gradient-to-r from-brand via-gold to-brand bg-clip-text text-transparent">
                celebration
              </span>
            </h1>
            <p className="si-rise mx-auto mt-5 max-w-xl text-base text-brand-dark/70 sm:text-lg" style={{ animationDelay: ".2s" }}>
              Weddings, haldi, mehndi, sangeet, birthdays and more — with scratch-to-reveal dates, countdowns, maps and RSVPs.
              Share with a single link.
            </p>

            {/* Ask first: how do you want to proceed? */}
            {user ? (
              <div
                className="si-rise mx-auto mt-10 max-w-xl rounded-3xl border border-gold/30 bg-white/80 p-6 shadow-xl shadow-brand/10 backdrop-blur sm:p-8"
                style={{ animationDelay: ".3s" }}
              >
                <p className="font-display text-2xl font-bold text-brand-dark sm:text-3xl">
                  Welcome back, {firstName} <span aria-hidden>🌸</span>
                </p>
                <p className="mt-2 text-sm text-brand-dark/60">Pick up where you left off.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/dashboard"
                    className="rounded-2xl bg-brand px-5 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    Go to dashboard →
                  </Link>
                  <Link
                    href="/create"
                    className="rounded-2xl border-2 border-gold/60 bg-cream px-5 py-4 text-base font-semibold text-brand-dark transition hover:-translate-y-0.5 hover:border-gold"
                  >
                    + Create new invitation
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-10 max-w-3xl">
                <h2 className="si-rise text-sm font-semibold uppercase tracking-[0.2em] text-brand-dark/60" style={{ animationDelay: ".25s" }}>
                  How would you like to begin?
                </h2>
                <div className="mt-5 grid gap-4 text-left sm:grid-cols-2">
                  <div
                    className="si-rise group relative flex flex-col overflow-hidden rounded-3xl border border-brand/15 bg-white/85 p-6 shadow-xl shadow-brand/10 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
                    style={{ animationDelay: ".35s" }}
                  >
                    <div aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/10 transition group-hover:scale-125" />
                    <span aria-hidden className="si-float grid h-12 w-12 place-items-center rounded-2xl bg-brand text-2xl text-white shadow-md">
                      🔐
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-brand-dark">Sign in to your dashboard</h3>
                    <p className="mt-2 flex-1 text-sm text-brand-dark/65">
                      Use email &amp; password to manage every invitation in one place and track RSVPs for all your events.
                    </p>
                    <Link
                      href="/login"
                      className="mt-5 block rounded-2xl bg-brand px-5 py-3.5 text-center text-base font-semibold text-white shadow-md shadow-brand/30 transition hover:bg-brand-dark"
                    >
                      Sign in
                    </Link>
                    <p className="mt-3 text-center text-sm text-brand-dark/60">
                      New here?{" "}
                      <Link href="/signup" className="font-semibold text-brand underline-offset-4 hover:underline">
                        Create account
                      </Link>
                    </p>
                  </div>

                  <div
                    className="si-rise group relative flex flex-col overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#fff3dc] to-white p-6 shadow-xl shadow-gold/10 transition hover:-translate-y-1 hover:shadow-2xl"
                    style={{ animationDelay: ".45s" }}
                  >
                    <div aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/15 transition group-hover:scale-125" />
                    <span
                      aria-hidden
                      className="si-float grid h-12 w-12 place-items-center rounded-2xl bg-gold text-2xl text-white shadow-md"
                      style={{ animationDelay: "1s" }}
                    >
                      ✨
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-brand-dark">Create without login</h3>
                    <p className="mt-2 flex-1 text-sm text-brand-dark/65">
                      No account needed. Design your invitation now and get a private manage link to edit it and see RSVPs.
                    </p>
                    <Link
                      href="/create"
                      className="mt-5 block rounded-2xl border-2 border-gold bg-white px-5 py-3.5 text-center text-base font-semibold text-brand-dark transition hover:bg-gold hover:text-white"
                    >
                      Start creating →
                    </Link>
                    <p className="mt-3 text-center text-xs text-brand-dark/50">You can save it to an account later.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <MyInvitesOnDevice loggedIn={!!user} />

        {/* Occasion strip */}
        <section aria-labelledby="occasions" className="py-10">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="occasions" className="text-center font-display text-3xl font-bold text-brand-dark">
              For every shubh occasion
            </h2>
            <p className="mt-2 text-center text-sm text-brand-dark/60">Tap one to start with a matching design.</p>
          </div>
          <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-auto sm:max-w-6xl sm:flex-wrap sm:justify-center sm:overflow-visible">
            {OCCASION_LIST.map((o) => (
              <li key={o.id} className="snap-start">
                <Link
                  href={`/create?occasion=${o.id}`}
                  className="flex w-28 flex-col items-center gap-2 rounded-2xl border border-brand/10 bg-white/80 px-3 py-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-md"
                >
                  <span
                    aria-hidden
                    className="grid h-12 w-12 place-items-center rounded-full text-2xl shadow-inner"
                    style={{ background: o.gradient }}
                  >
                    {o.emoji}
                  </span>
                  <span className="text-sm font-semibold text-brand-dark">{o.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section aria-labelledby="features" className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="features" className="text-center font-display text-3xl font-bold text-brand-dark">
            Little touches guests remember
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-gold/20 bg-white/75 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/10 to-gold/20 text-2xl">
                  {f.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-brand-dark">{f.title}</h3>
                <p className="mt-1 text-sm text-brand-dark/65">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand to-brand-dark px-5 py-10 text-white shadow-xl shadow-brand/20 sm:px-10">
            <h2 id="how" className="text-center font-display text-3xl font-bold">
              How it works
            </h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-lg font-bold text-brand-dark">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 text-center">
              <Link
                href="/create"
                className="inline-block rounded-full bg-gold px-8 py-3.5 font-semibold text-brand-dark shadow-lg transition hover:-translate-y-0.5 hover:bg-[#d8b437]"
              >
                Create your invitation — it&apos;s free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
