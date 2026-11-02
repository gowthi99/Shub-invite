import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-cream px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-gold/40 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-4 text-5xl" aria-hidden>
          🪔
        </div>
        <p className="text-sm font-semibold tracking-[0.3em] text-gold uppercase">404</p>
        <h1 className="mt-2 font-display text-3xl text-brand-dark">This invitation wandered off</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6b3a4a]">
          The link may be mistyped, or the host may have removed this invitation. Please check the link with
          whoever shared it.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
