"use client";
import { useState } from "react";
import type { InviteData, InviteEvent } from "@/lib/types";
import { getStrings } from "@/lib/i18n";
import { emptyEvent } from "../constants";
import { SectionCard, TextArea, TextField } from "../ui";

const MAX_EVENTS = 12;

function EventForm({
  event,
  index,
  errors,
  onChange,
}: {
  event: InviteEvent;
  index: number;
  errors: Record<string, string>;
  onChange: (p: Partial<InviteEvent>) => void;
}) {
  const [more, setMore] = useState(!!(event.endTime || event.mapUrl || event.dressCode || event.notes));
  const e = (k: string) => errors[`events.${index}.${k}`];
  return (
    <div className="space-y-4">
      <TextField label="Event name" value={event.name} onChange={(v) => onChange({ name: v })} placeholder="Wedding Ceremony" error={e("name")} maxLength={80} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Date" type="date" value={event.date} onChange={(v) => onChange({ date: v })} error={e("date")} />
        <TextField label="Start time" type="time" value={event.time} onChange={(v) => onChange({ time: v })} error={e("time")} />
      </div>
      <TextField label="Venue" value={event.venue} onChange={(v) => onChange({ venue: v })} placeholder="Taj Krishna, Banjara Hills" error={e("venue")} maxLength={160} />
      <TextArea
        label="Address"
        rows={2}
        value={event.address}
        onChange={(v) => onChange({ address: v })}
        placeholder="Road No. 1, Banjara Hills, Hyderabad 500034"
        hint="Used for the “Get directions” button."
        error={e("address")}
        maxLength={400}
      />
      {more ? (
        <div className="space-y-4 rounded-2xl bg-cream/70 p-4">
          <TextField label="End time" optional type="time" value={event.endTime} onChange={(v) => onChange({ endTime: v })} error={e("endTime")} />
          <TextField
            label="Google Maps link"
            optional
            type="url"
            inputMode="url"
            value={event.mapUrl}
            onChange={(v) => onChange({ mapUrl: v })}
            placeholder="https://maps.app.goo.gl/…"
            hint="Paste a link from Google Maps → Share. Otherwise we'll search the address."
            error={e("mapUrl")}
          />
          <TextField label="Dress code" optional value={event.dressCode} onChange={(v) => onChange({ dressCode: v })} placeholder="Shades of yellow" error={e("dressCode")} maxLength={120} />
          <TextArea label="Notes" optional rows={2} value={event.notes} onChange={(v) => onChange({ notes: v })} placeholder="Lunch will be served after the ceremony." error={e("notes")} maxLength={500} />
        </div>
      ) : (
        <button type="button" onClick={() => setMore(true)} className="text-sm font-medium text-brand hover:text-brand-dark">
          + End time, map link, dress code & notes
        </button>
      )}
    </div>
  );
}

export default function EventsStep({
  data,
  update,
  errors,
}: {
  data: InviteData;
  update: (p: Partial<InviteData>) => void;
  errors: Record<string, string>;
}) {
  const events = data.events.length ? data.events : [emptyEvent()];
  const setEvents = (ev: InviteEvent[]) => update({ events: ev });
  const patch = (i: number, p: Partial<InviteEvent>) => setEvents(events.map((e, j) => (j === i ? { ...e, ...p } : e)));

  if (data.mode === "single") {
    return (
      <SectionCard>
        <EventForm event={events[0]} index={0} errors={errors} onChange={(p) => patch(0, p)} />
      </SectionCard>
    );
  }

  const suggestions = getStrings(data.language).suggestedEvents[data.occasion] ?? [];
  const used = new Set(events.map((e) => e.name.trim().toLowerCase()));
  const chips = suggestions.filter((s) => !used.has(s.toLowerCase()));
  const canAdd = events.length < MAX_EVENTS;

  const add = (name = "") => {
    if (!canAdd) return;
    // Fill an untouched blank event first
    const blank = events.findIndex((e) => !e.name && !e.date && !e.venue);
    if (name && blank >= 0) return patch(blank, { name });
    const prev = events[events.length - 1];
    setEvents([...events, { ...emptyEvent(name), venue: prev?.venue ?? "", address: prev?.address ?? "", mapUrl: prev?.mapUrl ?? "" }]);
  };
  const remove = (i: number) => setEvents(events.length > 1 ? events.filter((_, j) => j !== i) : [emptyEvent()]);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= events.length) return;
    const next = [...events];
    [next[i], next[j]] = [next[j], next[i]];
    setEvents(next);
  };

  return (
    <div className="space-y-5">
      {errors.events && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.events}
        </p>
      )}
      {chips.length > 0 && canAdd && (
        <div>
          <p className="mb-2 text-sm font-medium text-stone-600">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                lang={data.language}
                onClick={() => add(c)}
                className="min-h-11 rounded-full border border-gold/50 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-brand hover:text-brand active:scale-95"
              >
                + {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <ol className="space-y-5">
        {events.map((ev, i) => (
          <li key={ev.id}>
            <SectionCard
              title={`${i + 1}. ${ev.name || "New event"}`}
              actions={
                <div className="flex items-center gap-1">
                  <IconBtn label={`Move ${ev.name || "event"} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </IconBtn>
                  <IconBtn label={`Move ${ev.name || "event"} down`} disabled={i === events.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </IconBtn>
                  <IconBtn label={`Remove ${ev.name || "event"}`} onClick={() => remove(i)} danger>
                    ✕
                  </IconBtn>
                </div>
              }
            >
              <EventForm event={ev} index={i} errors={errors} onChange={(p) => patch(i, p)} />
            </SectionCard>
          </li>
        ))}
      </ol>

      {canAdd ? (
        <button
          type="button"
          onClick={() => add()}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-gold/60 bg-white/60 font-medium text-stone-700 transition hover:border-brand hover:text-brand"
        >
          <span aria-hidden className="text-xl">+</span> Add another event
        </button>
      ) : (
        <p className="text-center text-sm text-stone-500">You can add up to {MAX_EVENTS} events.</p>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-10 place-items-center rounded-full text-base transition disabled:opacity-30 ${
        danger ? "text-stone-500 hover:bg-red-50 hover:text-red-600" : "text-stone-600 hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}
