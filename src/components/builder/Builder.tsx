"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InviteView from "@/components/invite/InviteView";
import type { EventMode, InviteData, Language, Occasion } from "@/lib/types";
import { OCCASIONS } from "@/lib/types";
import { getStrings } from "@/lib/i18n";
import { inviteDataSchema } from "@/lib/validation";
import { getTheme, themesFor } from "@/themes";
import {
  DRAFT_KEY,
  MY_INVITES_KEY,
  OCCASION_META,
  STEPS,
  cleanData,
  defaultData,
  defaultEventName,
  displayNames,
  stepForPath,
  type MyInviteEntry,
  type PublishResult,
  type StepId,
} from "./constants";
import { PhoneFrame } from "./ScaledInvite";
import SuccessScreen, { type SuccessInfo } from "./SuccessScreen";
import OccasionStep from "./steps/OccasionStep";
import LanguageStep from "./steps/LanguageStep";
import DetailsStep from "./steps/DetailsStep";
import EventsStep from "./steps/EventsStep";
import ThemeStep from "./steps/ThemeStep";
import ExtrasStep from "./steps/ExtrasStep";
import PreviewStep from "./steps/PreviewStep";

export interface BuilderProps {
  /** Existing invitation data (edit mode). */
  initial?: InviteData;
  /** Invite id → edit mode (PUT /api/invites/{id}). */
  inviteId?: string;
  /** Manage token for anonymous edits (sent with the PUT). */
  manageToken?: string;
  /** Public slug of the invite being edited (for "view invitation" links). */
  slug?: string;
  isLoggedIn: boolean;
  /** Preselect from ?occasion= */
  initialOccasion?: Occasion;
}

interface Draft {
  v: 1;
  data: InviteData;
  step: number;
  maxVisited: number;
  occasionChosen: boolean;
  themeTouched: boolean;
}

interface Target {
  id: string;
  manageToken?: string;
  slug?: string;
}

const LAST = STEPS.length - 1;
const idx = (s: StepId) => STEPS.findIndex((x) => x.id === s);

function friendly(path: string, message: string): string {
  const leaf = path.split(".").pop() ?? "";
  const m = path.match(/^events\.(\d+)\./);
  const prefix = m ? `Event ${Number(m[1]) + 1}: ` : "";
  switch (leaf) {
    case "date":
      return `${prefix}Pick a date`;
    case "name":
      return m ? `${prefix}Give this event a name` : message;
    case "time":
    case "endTime":
      return `${prefix}Enter a valid time`;
    case "mapUrl":
      return `${prefix}Map link must start with https://`;
    case "primaryName":
      return "Please enter a name";
    case "themeId":
      return "Please choose a theme";
    case "rsvpDeadline":
      return "Enter a valid RSVP deadline";
  }
  if (/too_big|at most|too long/i.test(message)) return `${prefix}That's a little too long`;
  return prefix + message;
}

function validate(data: InviteData): Record<string, string> {
  const res = inviteDataSchema.safeParse(cleanData(data));
  if (res.success) return {};
  const out: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const path = issue.path.map(String).join(".") || "events";
    if (!out[path]) out[path] = friendly(path, issue.message);
  }
  return out;
}

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (d?.v !== 1 || !d.data || !OCCASIONS.includes(d.data.occasion)) return null;
    return d;
  } catch {
    return null;
  }
}

export default function Builder({ initial, inviteId, manageToken, slug, isLoggedIn, initialOccasion }: BuilderProps) {
  const [target, setTarget] = useState<Target | null>(inviteId ? { id: inviteId, manageToken, slug } : null);
  const editMode = !!target;
  const startOccasion = initialOccasion ?? "wedding";

  const [data, setData] = useState<InviteData>(() =>
    initial ? { ...defaultData(initial.occasion), ...initial } : defaultData(startOccasion)
  );
  const [step, setStep] = useState(() => (initial ? LAST : initialOccasion ? 1 : 0));
  const [maxVisited, setMaxVisited] = useState(() => (initial ? LAST : initialOccasion ? 1 : 0));
  const [occasionChosen, setOccasionChosen] = useState(!!initial || !!initialOccasion);
  const [themeTouched, setThemeTouched] = useState(!!initial);
  const [dir, setDir] = useState<1 | -1>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stepError, setStepError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<SuccessInfo | null>(null);
  const [fullPreview, setFullPreview] = useState(false);
  const [hydrated, setHydrated] = useState(!!inviteId);
  const [hasDraft, setHasDraft] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- occasion / language helpers ----------
  const applyOccasion = useCallback(
    (d: InviteData, o: Occasion, keepTheme: boolean): InviteData => {
      const next: InviteData = { ...d, occasion: o };
      if (!keepTheme) next.themeId = themesFor(o)[0]?.id ?? d.themeId;
      const s = getStrings(d.language);
      const autoNames = new Set<string>(["", ...OCCASIONS.flatMap((x) => [defaultEventName(x, d.language), s.occasionLabel[x]])]);
      if (d.events.length === 1 && autoNames.has(d.events[0].name.trim())) {
        next.events = [{ ...d.events[0], name: defaultEventName(o, d.language) }];
      }
      return next;
    },
    []
  );

  // ---------- draft restore (new mode only) ----------
  useEffect(() => {
    if (inviteId) return;
    const draft = readDraft();
    if (draft) {
      let d: InviteData = { ...defaultData(draft.data.occasion), ...draft.data };
      let s = Math.min(Math.max(0, draft.step), LAST);
      let mv = Math.min(Math.max(s, draft.maxVisited ?? s), LAST);
      if (initialOccasion && initialOccasion !== d.occasion) {
        d = applyOccasion(d, initialOccasion, draft.themeTouched);
        if (s === 0) s = 1;
        mv = Math.max(mv, 1);
      }
      setData(d);
      setStep(s);
      setMaxVisited(mv);
      setOccasionChosen(draft.occasionChosen || !!initialOccasion);
      setThemeTouched(draft.themeTouched);
      setHasDraft(true);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- autosave ----------
  useEffect(() => {
    if (!hydrated || editMode || success) return;
    const t = setTimeout(() => {
      try {
        const draft: Draft = { v: 1, data, step, maxVisited, occasionChosen, themeTouched };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* storage full / disabled */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [data, step, maxVisited, occasionChosen, themeTouched, hydrated, editMode, success]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // ---------- state updates ----------
  const update = useCallback((patch: Partial<InviteData>) => {
    setData((d) => ({ ...d, ...patch }));
    setPublishError("");
  }, []);

  // Clear field errors as they get fixed (never add new ones while typing).
  useEffect(() => {
    setErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      const now = validate(data);
      const kept: Record<string, string> = {};
      for (const k of Object.keys(prev)) if (now[k]) kept[k] = now[k];
      return Object.keys(kept).length === Object.keys(prev).length ? prev : kept;
    });
  }, [data]);

  const goTo = useCallback(
    (target: number | StepId) => {
      const i = typeof target === "number" ? target : idx(target);
      if (i < 0 || i > LAST) return;
      setDir(i >= step ? 1 : -1);
      setStep(i);
      setMaxVisited((m) => Math.max(m, i));
      setStepError("");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [step]
  );

  const selectOccasion = (o: Occasion) => {
    setData((d) => applyOccasion(d, o, themeTouched));
    setOccasionChosen(true);
    setStepError("");
    if (!editMode && step === 0) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => goTo(1), 280);
    }
  };

  const setLanguage = (l: Language) => {
    setData((d) => {
      if (d.language === l) return d;
      const from = getStrings(d.language);
      const to = getStrings(l);
      const fromList = from.suggestedEvents[d.occasion] ?? [];
      const toList = to.suggestedEvents[d.occasion] ?? [];
      const events = d.events.map((e) => {
        const i = fromList.indexOf(e.name.trim());
        if (i >= 0 && toList[i]) return { ...e, name: toList[i] };
        if (e.name.trim() === from.occasionLabel[d.occasion]) return { ...e, name: to.occasionLabel[d.occasion] };
        return e;
      });
      return { ...d, language: l, events };
    });
  };

  const setMode = (m: EventMode) => update({ mode: m });

  const selectTheme = (id: string) => {
    setThemeTouched(true);
    update({ themeId: id });
  };

  // ---------- navigation ----------
  const stepId = STEPS[step].id;

  const next = () => {
    if (stepId === "occasion" && !occasionChosen) {
      setStepError("Choose an occasion to continue.");
      return;
    }
    if (stepId === "extras" && uploading) {
      setStepError("Please wait for the photo to finish uploading.");
      return;
    }
    const all = validate(data);
    const mine = Object.fromEntries(Object.entries(all).filter(([k]) => stepForPath(k) === stepId));
    if (Object.keys(mine).length && stepId !== "preview") {
      setErrors(mine);
      setStepError("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    if (step < LAST) goTo(step + 1);
  };

  const back = () => step > 0 && goTo(step - 1);

  const canJump = (i: number) => editMode || i <= maxVisited;

  // ---------- publish ----------
  const publish = async () => {
    if (publishing) return;
    if (uploading) {
      setPublishError("Please wait for the photo to finish uploading.");
      return;
    }
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs).map(stepForPath).sort((a, b) => idx(a) - idx(b))[0];
      goTo(first);
      setStepError("Please fix the highlighted fields before publishing.");
      return;
    }
    const payload = cleanData(data);
    setPublishing(true);
    setPublishError("");
    try {
      if (target) {
        const res = await fetch(`/api/invites/${encodeURIComponent(target.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: payload, manageToken: target.manageToken }),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "Couldn't save your changes. Please try again.");
        setSuccess({
          kind: "saved",
          url: target.slug ? `/i/${target.slug}` : "",
          manageUrl: target.manageToken ? `/manage/${target.manageToken}` : undefined,
          manageToken: target.manageToken,
          slug: target.slug,
        });
      } else {
        const res = await fetch("/api/invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: payload }),
        });
        const json = (await res.json().catch(() => ({}))) as Partial<PublishResult> & { error?: string };
        if (!res.ok || !json.id || !json.slug || !json.manageToken)
          throw new Error(json.error || "Couldn't publish your invitation. Please try again.");
        const result = json as PublishResult;
        if (!isLoggedIn) {
          try {
            const list = JSON.parse(localStorage.getItem(MY_INVITES_KEY) || "[]") as MyInviteEntry[];
            const entry: MyInviteEntry = {
              slug: result.slug,
              manageToken: result.manageToken,
              title: `${displayNames(payload) || "My invitation"} — ${OCCASION_META[payload.occasion].label}`,
              createdAt: new Date().toISOString(),
            };
            localStorage.setItem(
              MY_INVITES_KEY,
              JSON.stringify([entry, ...(Array.isArray(list) ? list.filter((x) => x?.slug !== result.slug) : [])])
            );
          } catch {
            /* ignore */
          }
        }
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        setTarget({ id: result.id, manageToken: result.manageToken, slug: result.slug });
        setSuccess({
          kind: "created",
          url: result.url || `/i/${result.slug}`,
          manageUrl: result.manageUrl || `/manage/${result.manageToken}`,
          manageToken: result.manageToken,
          slug: result.slug,
        });
      }
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const startOver = () => {
    if (!window.confirm("Start a new invitation? Your current draft will be cleared.")) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setData(defaultData(startOccasion));
    setOccasionChosen(false);
    setThemeTouched(false);
    setErrors({});
    setMaxVisited(0);
    setHasDraft(false);
    goTo(0);
  };

  // lock body scroll while full-screen preview is open
  useEffect(() => {
    if (!fullPreview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullPreview(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullPreview]);

  const previewData = useMemo(() => cleanData(data), [data]);

  if (success) {
    return (
      <SuccessScreen
        info={success}
        data={previewData}
        isLoggedIn={isLoggedIn}
        onKeepEditing={() => {
          setSuccess(null);
          setStep(LAST);
          setMaxVisited(LAST);
        }}
      />
    );
  }

  const meta = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  let content: React.ReactNode;
  switch (stepId) {
    case "occasion":
      content = <OccasionStep value={data.occasion} chosen={occasionChosen} onSelect={selectOccasion} />;
      break;
    case "language":
      content = <LanguageStep data={data} onLanguage={setLanguage} onMode={setMode} />;
      break;
    case "details":
      content = <DetailsStep data={data} update={update} errors={errors} />;
      break;
    case "events":
      content = <EventsStep data={data} update={update} errors={errors} />;
      break;
    case "theme":
      content = <ThemeStep data={previewData} onSelect={selectTheme} />;
      break;
    case "extras":
      content = <ExtrasStep data={data} update={update} errors={errors} onUploadingChange={setUploading} />;
      break;
    case "preview":
      content = <PreviewStep data={previewData} errors={errors} goTo={goTo} onFullscreen={() => setFullPreview(true)} />;
      break;
  }

  const primaryLabel = stepId === "preview" ? (editMode ? "Save changes" : "Publish invitation") : "Continue";

  return (
    <div className="min-h-dvh bg-cream">
      <style>{`@keyframes si-in-r{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes si-in-l{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}`}</style>

      {/* Header + progress */}
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-3 sm:px-6">
          <Link href="/" className="font-display text-lg font-bold text-brand">
            Shubh <span className="text-gold">Invites</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500">
              {editMode ? "Editing · " : ""}Step {step + 1} of {STEPS.length}
            </span>
            {!editMode && hasDraft && hydrated && (
              <button type="button" onClick={startOver} className="font-medium text-stone-500 underline-offset-2 hover:text-brand hover:underline">
                Start over
              </button>
            )}
            {editMode && isLoggedIn && (
              <Link href="/dashboard" className="font-medium text-stone-500 hover:text-brand">
                Exit
              </Link>
            )}
          </div>
        </div>
        <nav aria-label="Builder steps" className="mx-auto max-w-6xl px-4 pt-3 pb-3 sm:px-6">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-stone-200" aria-hidden>
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-gold transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="mt-2 hidden justify-between sm:flex">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => canJump(i) && goTo(i)}
                  disabled={!canJump(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`rounded-full px-2 py-1 text-xs font-medium transition ${
                    i === step ? "text-brand" : canJump(i) ? "text-stone-600 hover:text-brand" : "cursor-default text-stone-300"
                  }`}
                >
                  {i < step || (editMode && i !== step) ? "✓ " : ""}
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
          <ol className="mt-2 flex justify-center gap-1.5 sm:hidden">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-label={`${s.label}${i === step ? " (current)" : ""}`}
                  onClick={() => canJump(i) && goTo(i)}
                  disabled={!canJump(i)}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      i === step ? "h-2 w-5 bg-brand" : canJump(i) ? "size-2 bg-brand/40" : "size-2 bg-stone-300"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div className="pt-6 pb-32 lg:pb-10">
          <div key={stepId} style={{ animation: `${dir === 1 ? "si-in-r" : "si-in-l"} .38s cubic-bezier(.2,.8,.2,1) both` }}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {meta.label}
              {stepId !== "occasion" && occasionChosen ? ` · ${OCCASION_META[data.occasion].emoji} ${OCCASION_META[data.occasion].label}` : ""}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-stone-900 sm:text-4xl">{meta.title}</h1>
            <p className="mt-2 mb-6 text-stone-600">{meta.subtitle}</p>
            {content}
          </div>

          {/* Action bar: fixed on mobile, sticky in-column on desktop */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:sticky lg:bottom-4 lg:mt-8 lg:rounded-2xl lg:border lg:pb-0 lg:shadow-lg">
            {(stepError || publishError) && (
              <p role="alert" className="px-4 pt-3 text-center text-sm text-red-600">
                {publishError || stepError}
              </p>
            )}
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="min-h-12 rounded-full px-4 font-medium text-stone-700 transition hover:bg-stone-100 disabled:invisible"
              >
                ← Back
              </button>
              {stepId !== "occasion" && stepId !== "preview" && (
                <button
                  type="button"
                  onClick={() => setFullPreview(true)}
                  className="min-h-12 rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:border-brand lg:hidden"
                >
                  Preview
                </button>
              )}
              <button
                type="button"
                onClick={stepId === "preview" ? publish : next}
                disabled={publishing}
                className={`ml-auto flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70 ${
                  stepId === "preview"
                    ? "bg-gradient-to-r from-brand to-brand-dark px-8 shadow-brand/30 hover:brightness-110"
                    : "bg-brand shadow-brand/20 hover:bg-brand-dark"
                }`}
              >
                {publishing && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {publishing ? (editMode ? "Saving…" : "Publishing…") : primaryLabel}
                {!publishing && stepId !== "preview" && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop live preview */}
        <aside className="hidden lg:block" aria-label="Live preview">
          <div className="sticky top-32 pt-6 pb-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Live preview</p>
              <button type="button" onClick={() => setFullPreview(true)} className="text-xs font-medium text-brand hover:text-brand-dark">
                Full screen ↗
              </button>
            </div>
            <PhoneFrame data={previewData} className="mx-auto w-[300px]" />
            <p className="mt-3 text-center text-xs text-stone-500">{getTheme(data.themeId).name}</p>
          </div>
        </aside>
      </main>

      {fullPreview && (
        <div role="dialog" aria-modal="true" aria-label="Invitation preview" className="fixed inset-0 z-50 flex flex-col bg-stone-950">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium text-white/80">Preview — this is what guests will see</span>
            <button
              type="button"
              autoFocus
              onClick={() => setFullPreview(false)}
              className="min-h-11 rounded-full bg-white/15 px-5 text-sm font-semibold hover:bg-white/25"
            >
              Close
            </button>
          </div>
          <div className="relative mx-auto w-full max-w-md flex-1 overflow-y-auto overscroll-contain bg-white" style={{ transform: "translateZ(0)" }}>
            <InviteView data={previewData} preview />
          </div>
        </div>
      )}
    </div>
  );
}
