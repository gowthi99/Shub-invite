import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { SiteKeyframes } from "./FloatingPetals";

/**
 * Shared top bar. Pass the session user (from getSessionUser()) so the nav adapts.
 * Kept prop-driven so pages that already fetched the user don't hit the DB twice.
 */
export function SiteHeader({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/80 backdrop-blur-md">
      <SiteKeyframes />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-brand-dark/80 transition hover:bg-brand/10 hover:text-brand sm:inline-block"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
              >
                <span className="sm:hidden">+ New</span>
                <span className="hidden sm:inline">Create invitation</span>
              </Link>
              <Link
                href="/dashboard"
                aria-label="Dashboard"
                className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 text-sm font-bold text-brand-dark sm:hidden"
              >
                {(user.name || user.email).charAt(0).toUpperCase()}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-brand-dark/80 transition hover:bg-brand/10 hover:text-brand"
              >
                Sign in
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
              >
                Create
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
