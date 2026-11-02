import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gold/20 bg-gradient-to-b from-cream to-[#fbeedd]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-brand-dark/60">Invitations as beautiful as your celebration.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-brand-dark/70">
          <Link href="/create" className="hover:text-brand">Create</Link>
          <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
          <Link href="/login" className="hover:text-brand">Sign in</Link>
          <Link href="/signup" className="hover:text-brand">Sign up</Link>
        </nav>
      </div>
      <p className="pb-8 text-center text-xs text-brand-dark/50">
        Made with <span aria-label="love">♥</span> for every shubh muhurat · © {new Date().getFullYear()} Shubh Invites
      </p>
    </footer>
  );
}
