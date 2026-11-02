"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { InviteData } from "@/lib/types";
import { OCCASION_META, displayNames } from "./constants";

function absolute(u: string) {
  if (!u) return u;
  if (/^https?:\/\//.test(u)) return u;
  if (typeof window === "undefined") return u;
  return `${window.location.origin}${u.startsWith("/") ? "" : "/"}${u}`;
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
        return {
          left: r(1) * 100,
          delay: r(2) * 0.8,
          dur: 2.4 + r(3) * 1.8,
          size: 6 + r(4) * 8,
          color: ["#b4235a", "#c9a227", "#f59e0b", "#ec4899", "#fde68a", "#16a34a"][i % 6],
          round: i % 3 === 0,
          drift: (r(5) - 0.5) * 120,
        };
      }),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-[-20px] block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "999px" : "2px",
            animation: `si-confetti ${p.dur}s cubic-bezier(.2,.6,.4,1) ${p.delay}s forwards`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export interface SuccessInfo {
  kind: "created" | "saved";
  url: string; // public share link
  manageUrl?: string;
  manageToken?: string;
  slug?: string;
}

export default function SuccessScreen({
  info,
  data,
  isLoggedIn,
  onKeepEditing,
}: {
  info: SuccessInfo;
  data: InviteData;
  isLoggedIn: boolean;
  onKeepEditing: () => void;
}) {
  const [copied, setCopied] = useState<"" | "link" | "manage">("");
  const url = absolute(info.url);
  const manageUrl = info.manageUrl ? absolute(info.manageUrl) : "";
  const names = displayNames(data);
  const occ = OCCASION_META[data.occasion];
  const shareText = `${occ.emoji} You're warmly invited to ${names ? `${names}'s ` : "our "}${occ.label}! Tap to open your invitation and RSVP:`;
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  const copy = async (text: string, which: "link" | "manage") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(which);
    setTimeout(() => setCopied(""), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${names} · ${occ.label}`, text: shareText, url });
    } catch {
      /* cancelled */
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
  const saved = info.kind === "saved";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      <style>{`@keyframes si-confetti{0%{transform:translate3d(0,0,0) rotate(0)}100%{transform:translate3d(var(--drift),110vh,0) rotate(720deg);opacity:.9}}
@keyframes si-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}
@keyframes si-rise{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}`}</style>
      {!saved && <Confetti />}
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-5 pt-14 pb-16 text-center">
        <div
          className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-brand to-gold text-5xl shadow-xl shadow-brand/30"
          style={{ animation: "si-pop .7s cubic-bezier(.2,.9,.3,1.3) both" }}
          aria-hidden
        >
          {saved ? "✓" : "🎉"}
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-stone-900 sm:text-4xl" style={{ animation: "si-rise .5s .2s both" }}>
          {saved ? "Changes saved" : "Your invitation is live!"}
        </h1>
        <p className="mt-2 text-stone-600" style={{ animation: "si-rise .5s .3s both" }}>
          {saved ? "Guests opening the link will see the updated invitation." : "Share this link with your guests — on WhatsApp, SMS or anywhere."}
        </p>

        <div className="mt-8 w-full space-y-3 text-left" style={{ animation: "si-rise .5s .4s both" }}>
          <label htmlFor="share-link" className="text-sm font-medium text-stone-700">
            Invitation link
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 pl-4 shadow-sm">
            <input
              id="share-link"
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none"
            />
            <button
              type="button"
              onClick={() => copy(url, "link")}
              className="shrink-0 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700"
            >
              {copied === "link" ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 font-semibold text-white shadow-md shadow-green-600/20 hover:brightness-95"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z" />
              </svg>
              Share on WhatsApp
            </a>
            {canNativeShare ? (
              <button
                type="button"
                onClick={nativeShare}
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3.5 font-semibold text-stone-800 hover:border-brand"
              >
                <span aria-hidden>↗</span> More ways to share
              </button>
            ) : (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3.5 font-semibold text-stone-800 hover:border-brand"
              >
                Open invitation
              </a>
            )}
          </div>
          {canNativeShare && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-13 items-center justify-center rounded-2xl bg-brand px-5 py-3.5 font-semibold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark"
            >
              Open invitation
            </a>
          )}
        </div>

        {!isLoggedIn && manageUrl && !saved && (
          <div className="mt-8 w-full rounded-3xl border-2 border-amber-300 bg-amber-50 p-5 text-left" style={{ animation: "si-rise .5s .5s both" }}>
            <p className="flex items-center gap-2 font-semibold text-amber-900">
              <span aria-hidden>🔑</span> Save your private manage link
            </p>
            <p className="mt-1 text-sm text-amber-900/80">
              This is the only way to edit the invitation and see RSVPs without an account. Don&apos;t share it with guests — bookmark it or send
              it to yourself.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-white p-1.5 pl-3">
              <input
                readOnly
                aria-label="Private manage link"
                value={manageUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 bg-transparent text-xs text-stone-700 outline-none"
              />
              <button
                type="button"
                onClick={() => copy(manageUrl, "manage")}
                className="shrink-0 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
              >
                {copied === "manage" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-xs text-amber-900/70">We&apos;ve also remembered it on this device.</p>
          </div>
        )}

        <div className="mt-8 w-full space-y-3" style={{ animation: "si-rise .5s .6s both" }}>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex min-h-13 items-center justify-center rounded-2xl bg-stone-900 px-5 py-3.5 font-semibold text-white hover:bg-stone-700"
            >
              Go to dashboard
            </Link>
          ) : info.manageToken && !saved ? (
            <Link
              href={`/signup?claim=${encodeURIComponent(info.manageToken)}`}
              className="block rounded-3xl bg-gradient-to-r from-brand to-brand-dark p-5 text-left text-white shadow-lg shadow-brand/25"
            >
              <span className="block font-display text-lg font-semibold">Create a free account to track RSVPs in a dashboard</span>
              <span className="mt-1 block text-sm text-white/80">Your invitation will be added automatically. →</span>
            </Link>
          ) : manageUrl ? (
            <a
              href={manageUrl}
              className="flex min-h-13 items-center justify-center rounded-2xl bg-stone-900 px-5 py-3.5 font-semibold text-white hover:bg-stone-700"
            >
              Back to manage page
            </a>
          ) : null}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-sm font-medium">
            <button type="button" onClick={onKeepEditing} className="text-brand hover:text-brand-dark">
              {saved ? "Keep editing" : "Edit invitation"}
            </button>
            {!saved && (
              <a href="/create" className="text-stone-600 hover:text-stone-900">
                Create another
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
