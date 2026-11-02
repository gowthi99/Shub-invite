"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InviteData } from "@/lib/types";
import type { Theme } from "@/themes/types";
import { themesFor } from "@/themes";
import ScaledInvite from "../ScaledInvite";

function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, near] as const;
}

function ThemeCard({
  theme,
  data,
  selected,
  recommended,
  onSelect,
}: {
  theme: Theme;
  data: InviteData;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const preview = useMemo(() => ({ ...data, themeId: theme.id }), [data, theme.id]);
  const p = theme.palette;

  return (
    // A div, not a <button>: the live preview inside contains its own buttons.
    <div
      ref={ref}
      role="radio"
      tabIndex={0}
      aria-checked={selected}
      aria-label={`${theme.name}${recommended ? " (recommended)" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group cursor-pointer relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 active:scale-[0.98] ${
        selected ? "border-brand shadow-xl shadow-brand/20" : "border-transparent shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >
      <div className="relative w-full" style={{ background: p.bgGradient || p.bg }}>
        {near ? (
          <ScaledInvite data={preview} />
        ) : (
          <div className="flex w-full items-center justify-center" style={{ aspectRatio: "360 / 640" }}>
            <span className="font-display text-2xl opacity-70" style={{ color: p.accent, fontFamily: theme.fonts.display }}>
              {theme.name}
            </span>
          </div>
        )}
        {recommended && (
          <span className="absolute top-2 left-2 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase shadow">
            Recommended
          </span>
        )}
        {selected && (
          <span aria-hidden className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-brand text-sm text-white shadow">
            ✓
          </span>
        )}
      </div>
      <div className="flex items-start gap-2 p-3">
        <div className="mt-1 flex shrink-0 -space-x-1">
          {[p.accent, p.accent2, p.button].map((c, i) => (
            <span key={i} className="size-3.5 rounded-full ring-2 ring-white" style={{ background: c }} />
          ))}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-900">{theme.name}</p>
          <p className="line-clamp-2 text-xs text-stone-500">{theme.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ThemeStep({ data, onSelect }: { data: InviteData; onSelect: (id: string) => void }) {
  const themes = themesFor(data.occasion);
  const isRec = (t: Theme) => t.occasions === "all" || t.occasions.includes(data.occasion);

  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
      {themes.map((t) => (
        <ThemeCard key={t.id} theme={t} data={data} selected={data.themeId === t.id} recommended={isRec(t)} onSelect={() => onSelect(t.id)} />
      ))}
    </div>
  );
}
