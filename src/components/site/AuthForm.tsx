"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { localManageTokens } from "./localInvites";

type Mode = "login" | "signup";

/** Only allow same-site relative paths ("/x", not "//evil.com"). */
function safeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/dashboard";
  return next;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const claim = params.get("claim");
  const ids = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const claimTokens = Array.from(new Set([...(claim ? [claim] : []), ...localManageTokens()])).filter(Boolean);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          ...(mode === "signup" && name.trim() ? { name: name.trim() } : {}),
          ...(claimTokens.length ? { claimTokens } : {}),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error || (mode === "login" ? "Could not sign you in. Please try again." : "Could not create your account."));
        setLoading(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const other = mode === "login" ? "/signup" : "/login";
  const carry = new URLSearchParams();
  if (params.get("next")) carry.set("next", next);
  if (claim) carry.set("claim", claim);
  const qs = carry.toString();
  const otherHref = qs ? `${other}?${qs}` : other;

  const input =
    "mt-1.5 block w-full rounded-2xl border border-brand/15 bg-white px-4 py-3.5 text-base text-brand-dark shadow-sm outline-none transition placeholder:text-brand-dark/35 focus:border-brand focus:ring-4 focus:ring-brand/15";

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-gold/30 bg-white/90 p-6 shadow-2xl shadow-brand/10 backdrop-blur sm:p-8">
        <div className="text-center">
          <span aria-hidden className="si-float mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-2xl text-white shadow-lg ring-4 ring-gold/30">
            {mode === "login" ? "🔐" : "🌸"}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-brand-dark">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-brand-dark/60">
            {mode === "login" ? "Sign in to manage your invitations and RSVPs." : "Keep all your invitations and RSVPs in one place."}
          </p>
        </div>

        {claim && (
          <p className="mt-5 rounded-2xl bg-gold/10 px-4 py-3 text-sm text-brand-dark/80 ring-1 ring-gold/30">
            Your invitation will be saved to this account.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {mode === "signup" && (
            <div>
              <label htmlFor={`${ids}-name`} className="text-sm font-medium text-brand-dark">
                Your name
              </label>
              <input
                id={`${ids}-name`}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Reddy"
                maxLength={80}
                className={input}
              />
            </div>
          )}
          <div>
            <label htmlFor={`${ids}-email`} className="text-sm font-medium text-brand-dark">
              Email
            </label>
            <input
              id={`${ids}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={input}
            />
          </div>
          <div>
            <label htmlFor={`${ids}-pw`} className="text-sm font-medium text-brand-dark">
              Password
            </label>
            <div className="relative">
              <input
                id={`${ids}-pw`}
                type={showPw ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={mode === "signup" ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                className={`${input} pr-20`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 rounded-xl px-3 py-2 text-xs font-semibold text-brand hover:bg-brand/10"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? (mode === "login" ? "Signing in…" : "Creating account…") : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-dark/65">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <Link href={otherHref} className="font-semibold text-brand underline-offset-4 hover:underline">
            {mode === "login" ? "Create account" : "Sign in"}
          </Link>
        </p>
      </div>
      <p className="mt-6 text-center text-sm text-brand-dark/60">
        Prefer not to sign up?{" "}
        <Link href="/create" className="font-semibold text-brand-dark underline-offset-4 hover:underline">
          Create without login →
        </Link>
      </p>
    </div>
  );
}
