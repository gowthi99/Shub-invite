"use client";
import { LANGUAGE_LABELS, type InviteData } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/i18n";
import { getTheme } from "@/themes";
import { OCCASION_META, displayNames, type StepId } from "../constants";
import { PhoneFrame } from "../ScaledInvite";

export default function PreviewStep({
  data,
  errors,
  goTo,
  onFullscreen,
}: {
  data: InviteData;
  errors: Record<string, string>;
  goTo: (s: StepId) => void;
  onFullscreen: () => void;
}) {
  const errorList = Object.values(errors);
  const rows: { step: StepId; label: string; value: string }[] = [
    { step: "occasion", label: "Occasion", value: `${OCCASION_META[data.occasion].emoji} ${OCCASION_META[data.occasion].label}` },
    { step: "language", label: "Language", value: `${LANGUAGE_LABELS[data.language]} · ${data.mode === "single" ? "Single event" : `${data.events.length} events`}` },
    { step: "details", label: "Names", value: displayNames(data) || "—" },
    {
      step: "events",
      label: data.events.length > 1 ? "First event" : "Event",
      value: data.events[0]
        ? [data.events[0].name, data.events[0].date && formatDate(data.events[0].date, "en"), data.events[0].time && formatTime(data.events[0].time, "en")]
            .filter(Boolean)
            .join(" · ")
        : "—",
    },
    { step: "theme", label: "Theme", value: getTheme(data.themeId).name },
    {
      step: "extras",
      label: "Extras",
      value:
        [data.photoUrl && "Photo", data.scratchReveal && "Scratch reveal", data.rsvpEnabled && "RSVP", data.musicEnabled && "Music"]
          .filter(Boolean)
          .join(" · ") || "None",
    },
  ];

  return (
    <div className="space-y-5">
      {errorList.length > 0 && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Almost there — please fix:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorList.slice(0, 5).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mx-auto w-full max-w-[300px] lg:hidden">
        <PhoneFrame data={data} />
        <button
          type="button"
          onClick={onFullscreen}
          className="mt-3 w-full rounded-full border border-stone-300 bg-white py-3 text-sm font-medium text-stone-800 hover:border-brand"
        >
          Open full-screen preview
        </button>
      </div>

      <dl className="divide-y divide-stone-100 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        {rows.map((r) => (
          <div key={r.step} className="flex items-center gap-3 px-5 py-3.5">
            <dt className="w-24 shrink-0 text-sm text-stone-500">{r.label}</dt>
            <dd className="min-w-0 flex-1 truncate font-medium text-stone-900">{r.value}</dd>
            <button
              type="button"
              onClick={() => goTo(r.step)}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5"
              aria-label={`Edit ${r.label.toLowerCase()}`}
            >
              Edit
            </button>
          </div>
        ))}
      </dl>
    </div>
  );
}
