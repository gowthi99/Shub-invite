import Link from "next/link";

export default function InviteNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <div className="text-5xl" aria-hidden>
          💌
        </div>
        <h1 className="font-display text-3xl text-brand">Invitation not found</h1>
        <p className="text-sm leading-relaxed text-[#6b5a60]">
          This invitation link may be mistyped, or the host may have removed it. Please check the link with
          the person who shared it.
        </p>
        <p className="text-sm text-[#6b5a60]" lang="hi">यह निमंत्रण नहीं मिला।</p>
        <p className="text-sm text-[#6b5a60]" lang="te">ఈ ఆహ్వానం కనుగొనబడలేదు.</p>
        <Link
          href="/"
          className="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark"
        >
          Create your own invitation
        </Link>
      </div>
    </main>
  );
}
