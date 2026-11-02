"use client";
import { LANGUAGES, LANGUAGE_LABELS, type EventMode, type InviteData, type Language } from "@/lib/types";
import { getStrings } from "@/lib/i18n";

const LANG_HINT: Record<Language, string> = { en: "English", te: "Telugu", hi: "Hindi" };

export default function LanguageStep({
  data,
  onLanguage,
  onMode,
}: {
  data: InviteData;
  onLanguage: (l: Language) => void;
  onMode: (m: EventMode) => void;
}) {
  const sample = getStrings(data.language);
  const suggestions = getStrings("en").suggestedEvents[data.occasion];
  const modes: { id: EventMode; icon: string; title: string; desc: string }[] = [
    { id: "single", icon: "📅", title: "Single event", desc: "One date, one venue." },
    {
      id: "multi",
      icon: "🗓️",
      title: "Multiple events",
      desc: `e.g. ${(suggestions.length > 1 ? suggestions : ["Haldi", "Mehndi", "Sangeet", "Wedding"]).slice(0, 4).join(", ")}`,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-sm font-semibold tracking-wide text-stone-500 uppercase">Invitation language</h3>
        <p className="mb-3 text-sm text-stone-500">Your guests will see the invitation in this language.</p>
        <div role="radiogroup" aria-label="Invitation language" className="flex flex-wrap gap-3">
          {LANGUAGES.map((l) => {
            const active = data.language === l;
            return (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={active}
                lang={l}
                onClick={() => onLanguage(l)}
                className={`min-h-14 min-w-28 flex-1 rounded-full border-2 px-5 py-3 text-lg font-medium transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 sm:flex-none ${
                  active
                    ? "border-brand bg-brand text-white shadow-lg shadow-brand/25"
                    : "border-stone-200 bg-white text-stone-800 hover:border-gold"
                }`}
                style={l === "te" ? { fontFamily: "var(--font-telugu), sans-serif" } : l === "hi" ? { fontFamily: "var(--font-devanagari), sans-serif" } : undefined}
              >
                {LANGUAGE_LABELS[l]}
                {l !== "en" && <span className={`ml-2 text-xs ${active ? "text-white/80" : "text-stone-400"}`}>{LANG_HINT[l]}</span>}
              </button>
            );
          })}
        </div>
        <p
          lang={data.language}
          className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-center text-stone-700"
          style={{
            fontFamily:
              data.language === "te" ? "var(--font-telugu), sans-serif" : data.language === "hi" ? "var(--font-devanagari), sans-serif" : undefined,
          }}
        >
          <span className="text-xs tracking-wide text-stone-400 uppercase">Preview · </span>
          {sample.ui.youAreInvited} — {sample.defaultTitle[data.occasion]}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">How many events?</h3>
        <div role="radiogroup" aria-label="Number of events" className="grid gap-3 sm:grid-cols-2">
          {modes.map((m) => {
            const active = data.mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onMode(m.id)}
                className={`flex items-start gap-4 rounded-3xl border-2 p-5 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 ${
                  active ? "border-brand bg-white shadow-lg shadow-brand/10" : "border-transparent bg-white shadow-sm hover:border-gold/50"
                }`}
              >
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream text-2xl">
                  {m.icon}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-stone-900">{m.title}</span>
                  <span className="block text-sm text-stone-500">{m.desc}</span>
                </span>
                <span
                  aria-hidden
                  className={`ml-auto mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                    active ? "border-brand bg-brand text-xs text-white" : "border-stone-300"
                  }`}
                >
                  {active ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
