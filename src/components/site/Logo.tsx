import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Shubh Invites home">
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-lg text-cream shadow-md shadow-brand/30 ring-2 ring-gold/60 transition-transform group-hover:rotate-12"
      >
        ✿
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-brand-dark">
        Shubh <span className="text-gold">Invites</span>
      </span>
    </Link>
  );
}
