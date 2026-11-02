import type { RsvpCounts } from "@/lib/invites";

interface Tile {
  label: string;
  value: number;
  icon: string;
  tone: string;
}

/** Five stat tiles: responses, attending, maybe, declined, headcount. Optionally views. */
export function RsvpStats({ counts, views }: { counts: RsvpCounts; views?: number }) {
  const tiles: Tile[] = [
    { label: "Responses", value: counts.responses, icon: "💌", tone: "from-brand/10 to-brand/5 text-brand-dark" },
    { label: "Attending", value: counts.yes, icon: "🎉", tone: "from-emerald-100 to-emerald-50 text-emerald-800" },
    { label: "Maybe", value: counts.maybe, icon: "🤔", tone: "from-amber-100 to-amber-50 text-amber-800" },
    { label: "Declined", value: counts.no, icon: "🙏", tone: "from-rose-100 to-rose-50 text-rose-800" },
    { label: "Total headcount", value: counts.guests, icon: "👥", tone: "from-gold/30 to-gold/10 text-brand-dark" },
  ];
  if (typeof views === "number") {
    tiles.push({ label: "Views", value: views, icon: "👀", tone: "from-sky-100 to-sky-50 text-sky-800" });
  }
  return (
    <dl className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${tiles.length > 5 ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={`rounded-2xl bg-gradient-to-br p-4 shadow-sm ring-1 ring-black/5 ${t.tone} ${
            i === 4 && tiles.length === 5 ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-75">
            <span aria-hidden>{t.icon}</span> {t.label}
          </dt>
          <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{t.value}</dd>
        </div>
      ))}
    </dl>
  );
}
