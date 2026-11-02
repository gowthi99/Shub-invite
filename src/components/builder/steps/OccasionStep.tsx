"use client";
import { OCCASIONS, type Occasion } from "@/lib/types";
import { OCCASION_META } from "../constants";

export default function OccasionStep({
  value,
  chosen,
  onSelect,
}: {
  value: Occasion;
  chosen: boolean;
  onSelect: (o: Occasion) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Occasion" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {OCCASIONS.map((o) => {
        const m = OCCASION_META[o];
        const active = chosen && value === o;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(o)}
            className={`group relative flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl border-2 p-4 text-center transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 ${
              active
                ? "border-brand bg-gradient-to-b from-white to-brand/5 shadow-lg shadow-brand/15"
                : "border-transparent bg-white shadow-sm hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
            }`}
          >
            <span
              aria-hidden
              className={`text-4xl transition-transform duration-300 group-hover:scale-110 ${active ? "scale-110" : ""}`}
            >
              {m.emoji}
            </span>
            <span className="font-display text-base font-semibold text-stone-900">{m.label}</span>
            <span className="text-xs text-stone-500">{m.blurb}</span>
            {active && (
              <span aria-hidden className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full bg-brand text-xs text-white">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
