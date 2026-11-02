import { Suspense, type ReactNode } from "react";
import { Logo } from "./Logo";
import { FloatingPetals } from "./FloatingPetals";

/** Full-page decorative wrapper for /login and /signup. Children may use useSearchParams. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(201,162,39,.22), transparent 70%), radial-gradient(50% 40% at 100% 100%, rgba(180,35,90,.16), transparent 70%)",
        }}
      />
      <FloatingPetals className="opacity-70" />
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-12 pt-4 sm:items-center">
        <Suspense
          fallback={<div className="h-[28rem] w-full max-w-md animate-pulse rounded-3xl bg-white/60" aria-label="Loading" />}
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
