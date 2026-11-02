"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { InviteData } from "@/lib/types";
import { isCoupleOccasion } from "@/lib/types";
import { formatDate, formatTime, getStrings } from "@/lib/i18n";
import { getTheme } from "@/themes";
import { withScript } from "@/lib/fonts";
import EnvelopeIntro from "./EnvelopeIntro";
import Reveal, { RevealGate, StaticMotion } from "./Reveal";
import ScratchCard from "./ScratchCard";
import Countdown from "./Countdown";
import EventCard from "./EventCard";
import RsvpForm from "./RsvpForm";
import ShareBar from "./ShareBar";
import MusicToggle from "./MusicToggle";
import PhotoFrame from "./PhotoFrame";
import { Divider, Aura, SectionTitle } from "./Decor";
import { AmbientMusic } from "./ambientMusic";
import { IconHeart } from "./Icons";

export interface InviteViewProps {
  data: InviteData;
  /** Public slug; undefined in builder preview (RSVP submit disabled, no view tracking). */
  slug?: string;
  /** Compact non-interactive render for theme gallery thumbnails / live preview. */
  preview?: boolean;
}

function firstChar(s: string) {
  return Array.from(s.trim())[0]?.toUpperCase() ?? "";
}

export default function InviteView({ data, slug, preview = false }: InviteViewProps) {
  const theme = getTheme(data.themeId);
  const { palette, Backdrop, Ornament, Frame } = theme;
  const lang = data.language;
  const t = getStrings(lang);
  const displayFont = withScript(theme.fonts.display, lang);
  const bodyFont = withScript(theme.fonts.body, lang);

  const couple = isCoupleOccasion(data.occasion) && !!data.secondaryName?.trim();
  const names = couple ? `${data.primaryName} ${t.ui.and} ${data.secondaryName}` : data.primaryName;
  const initials = couple ? `${firstChar(data.primaryName)}${firstChar(data.secondaryName!)}` : firstChar(data.primaryName);
  const occasionLabel = t.occasionLabel[data.occasion];
  const title = data.title?.trim() || t.defaultTitle[data.occasion];
  const message = data.message?.trim() || t.defaultMessage[data.occasion];
  const events = data.events ?? [];
  const first = events[0];
  const lastDate = events.reduce((m, e) => (e.date && e.date > m ? e.date : m), first?.date ?? "");

  // ---- intro / reveal gating ----
  const [introDone, setIntroDone] = useState(preview);
  const [gateOpen, setGateOpen] = useState(preview);
  const openGate = useCallback(() => setGateOpen(true), []);
  const finishIntro = useCallback(() => {
    setGateOpen(true);
    setIntroDone(true);
  }, []);

  // ---- scratch reveal ----
  const scratch = data.scratchReveal && !!first?.date;
  const [dateRevealed, setDateRevealed] = useState(!scratch || preview);
  const onScratchReveal = useCallback(() => setDateRevealed(true), []);

  // ---- music ----
  const musicRef = useRef<AmbientMusic | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const musicAllowed = !!data.musicEnabled && !preview;
  useEffect(() => () => musicRef.current?.dispose(), []);
  const startMusic = useCallback(() => {
    if (!musicAllowed) return;
    musicRef.current ??= new AmbientMusic();
    void musicRef.current.start();
    setMusicOn(true);
  }, [musicAllowed]);
  const toggleMusic = useCallback(() => {
    if (!musicAllowed) return;
    if (musicRef.current?.playing) {
      musicRef.current.stop();
      setMusicOn(false);
    } else startMusic();
  }, [musicAllowed, startMusic]);
  // Pause when the tab is hidden, resume when it comes back.
  useEffect(() => {
    if (!musicAllowed) return;
    const onVis = () => {
      if (!musicRef.current) return;
      if (document.hidden) musicRef.current.stop();
      else if (musicOn) void musicRef.current.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [musicAllowed, musicOn]);

  const vars = useMemo(
    () =>
      ({
        "--c-bg": palette.bg,
        "--c-card": palette.card,
        "--c-text": palette.text,
        "--c-muted": palette.muted,
        "--c-accent": palette.accent,
        "--c-accent2": palette.accent2,
        "--c-button": palette.button,
        "--c-button-text": palette.buttonText,
        "--c-scratch": palette.scratch,
        "--font-invite-display": displayFont,
        "--font-invite-body": bodyFont,
      }) as CSSProperties,
    [palette, displayFont, bodyFont],
  );

  const cardStyle: CSSProperties = {
    background: "var(--c-card)",
    boxShadow:
      "0 24px 60px -30px color-mix(in srgb, var(--c-accent) 55%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 18%, transparent)",
  };

  const calendarDescription = `${title}\n${names}`;

  return (
    <StaticMotion.Provider value={preview}>
      <RevealGate.Provider value={gateOpen}>
        <div
          lang={lang}
          className={`relative isolate w-full overflow-x-clip ${preview ? "min-h-full" : "min-h-dvh"}`}
          style={{ ...vars, background: palette.bgGradient, color: palette.text, fontFamily: bodyFont }}
        >
          {/* Themed animated backdrop – fixed to the viewport on the live page, contained in preview */}
          <div
            aria-hidden
            className={`${preview ? "absolute" : "fixed"} pointer-events-none inset-0 -z-10 overflow-hidden`}
            style={{ background: palette.bgGradient }}
          >
            <Aura animate={!preview} />
            <Backdrop className="absolute inset-0 h-full w-full" />
          </div>

          <main
            className={`relative mx-auto flex w-full max-w-[480px] flex-col gap-9 px-4 ${preview ? "pb-10 pt-6" : "pb-28 pt-8"}`}
            style={{ containerType: "inline-size" }}
          >
            {/* ---------- Hero ---------- */}
            <Reveal y={40} scale={0.97}>
              <section className="relative rounded-[2rem] px-5 pb-10 pt-14 text-center backdrop-blur-md" style={cardStyle}>
                <Frame className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
                <div className="relative z-10 flex flex-col items-center">
                  <Reveal delay={0.1} y={16}>
                    <Ornament className="mx-auto mb-3 block h-16 w-full max-w-[260px]" />
                  </Reveal>
                  <Reveal delay={0.2} y={12}>
                    <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--c-accent2)" }}>
                      <span className="h-px w-8" style={{ background: "currentColor" }} />
                      {occasionLabel}
                      <span className="h-px w-8" style={{ background: "currentColor" }} />
                    </p>
                  </Reveal>

                  <Reveal delay={0.35} y={20} scale={0.94} className="mt-5">
                    <h1 className="break-words leading-[1.05]" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
                      {couple ? (
                        <>
                          <span className="block text-[clamp(2.6rem,15cqw,4.25rem)]">{data.primaryName}</span>
                          <span className="my-1 block text-[clamp(1.6rem,8cqw,2.4rem)]" style={{ color: "var(--c-accent2)" }}>
                            {t.ui.and}
                          </span>
                          <span className="block text-[clamp(2.6rem,15cqw,4.25rem)]">{data.secondaryName}</span>
                        </>
                      ) : (
                        <span className="block text-[clamp(2.6rem,15cqw,4.5rem)]">{data.primaryName}</span>
                      )}
                    </h1>
                  </Reveal>

                  <Reveal delay={0.5} y={12} className="mt-4">
                    <p className="text-[clamp(1.15rem,5.5cqw,1.45rem)] font-semibold italic leading-snug" style={{ color: "var(--c-text)" }}>
                      {title}
                    </p>
                  </Reveal>

                  <Reveal delay={0.6} y={8} className="my-5 w-full">
                    <Divider />
                  </Reveal>

                  {data.photoUrl && (
                    <Reveal delay={0.65} y={24} scale={0.9} className="mb-6">
                      <PhotoFrame src={data.photoUrl} alt={names} animate={!preview} />
                    </Reveal>
                  )}

                  <Reveal delay={0.7} y={12}>
                    <p className="mx-auto max-w-[34ch] whitespace-pre-line text-[16px] leading-relaxed" style={{ color: "var(--c-muted)" }}>
                      {message}
                    </p>
                  </Reveal>

                  {data.hostedBy?.trim() && (
                    <Reveal delay={0.8} y={10} className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>
                        {t.ui.hostedBy}
                      </p>
                      <p className="mt-1 text-lg font-semibold" style={{ color: "var(--c-text)" }}>
                        {data.hostedBy}
                      </p>
                    </Reveal>
                  )}
                </div>
              </section>
            </Reveal>

            {/* ---------- Save the date (scratch to reveal) ---------- */}
            {first?.date && (
              <Reveal>
                <section className="relative rounded-[2rem] px-5 py-7 text-center backdrop-blur-md" style={cardStyle}>
                  <SectionTitle font={displayFont}>{t.ui.dateRevealed}</SectionTitle>
                  {scratch ? (
                    <ScratchCard
                      className="mt-4"
                      coverColor={palette.scratch}
                      accent={palette.accent}
                      accent2={palette.accent2}
                      hint={t.ui.scratchToReveal}
                      preview={preview}
                      onReveal={onScratchReveal}
                    >
                      <DateBlock date={first.date} time={first.time} venue={first.venue} lang={lang} font={displayFont} />
                    </ScratchCard>
                  ) : (
                    <div className="mt-4">
                      <DateBlock date={first.date} time={first.time} venue={first.venue} lang={lang} font={displayFont} />
                    </div>
                  )}
                </section>
              </Reveal>
            )}

            {/* ---------- Countdown ---------- */}
            <AnimatePresence initial={false}>
              {first?.date && dateRevealed && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Reveal>
                    <section className="rounded-[2rem] px-4 py-7 backdrop-blur-md" style={cardStyle}>
                      <Countdown
                        date={first.date}
                        time={first.time}
                        lastDate={lastDate}
                        strings={t}
                        displayFont={displayFont}
                        frozen={preview}
                      />
                    </section>
                  </Reveal>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ---------- Events ---------- */}
            {events.length > 0 && (
              <section className="flex flex-col gap-5">
                <Reveal>
                  <SectionTitle font={displayFont}>{t.ui.events}</SectionTitle>
                </Reveal>
                <div className={`relative flex flex-col ${events.length > 1 ? "gap-8" : "gap-5"}`}>
                  {events.length > 1 && (
                    <span
                      aria-hidden
                      className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2"
                      style={{ background: "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-accent) 45%, transparent), transparent)" }}
                    />
                  )}
                  {events.map((ev, i) => (
                    <Reveal key={ev.id} delay={Math.min(i, 3) * 0.06} y={32}>
                      <EventCard
                        event={ev}
                        index={i}
                        total={events.length}
                        lang={lang}
                        strings={t}
                        displayFont={displayFont}
                        calendarTitle={`${ev.name} — ${names}`}
                        calendarDescription={calendarDescription}
                        hideDate={!dateRevealed && ev.date === first?.date}
                        preview={preview}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* ---------- RSVP ---------- */}
            {data.rsvpEnabled && (slug || preview) && (
              <Reveal>
                <section className="rounded-[2rem] px-5 py-8 backdrop-blur-md" style={cardStyle}>
                  <RsvpForm data={data} slug={slug} strings={t} displayFont={displayFont} preview={preview} />
                </section>
              </Reveal>
            )}

            {/* ---------- Contact & share ---------- */}
            <Reveal>
              <ShareBar
                contactPhone={data.contactPhone}
                strings={t}
                shareTitle={`${names} — ${occasionLabel}`}
                shareText={title}
                preview={preview}
              />
            </Reveal>

            <footer className="flex flex-col items-center gap-2 pt-2 text-center">
              <Divider small />
              <p className="flex items-center gap-1.5 text-xs tracking-wide" style={{ color: "var(--c-muted)" }}>
                {t.ui.madeWith}
                <IconHeart width={12} height={12} style={{ color: "var(--c-accent)" }} />
                <span className="font-semibold">Shubh Invites</span>
              </p>
            </footer>
          </main>

          {musicAllowed && introDone && <MusicToggle playing={musicOn} onToggle={toggleMusic} labelOn={t.ui.musicOn} labelOff={t.ui.musicOff} />}

          {!preview && !introDone && (
            <EnvelopeIntro
              invitedLabel={t.ui.youAreInvited}
              tapLabel={t.ui.tapToOpen}
              names={names}
              initials={initials}
              occasionLabel={occasionLabel}
              displayFont={displayFont}
              bodyFont={bodyFont}
              background={palette.bgGradient}
              Backdrop={Backdrop}
              onOpen={startMusic}
              onLeave={openGate}
              onDone={finishIntro}
            />
          )}
        </div>
      </RevealGate.Provider>
    </StaticMotion.Provider>
  );
}

function DateBlock({
  date,
  time,
  venue,
  lang,
  font,
}: {
  date: string;
  time: string;
  venue: string;
  lang: InviteData["language"];
  font: string;
}) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-6">
      <p className="text-[clamp(1.5rem,7.5cqw,2.1rem)] leading-tight" style={{ fontFamily: font, color: "var(--c-accent)" }}>
        {formatDate(date, lang)}
      </p>
      {time && (
        <p className="text-base font-semibold tracking-wide" style={{ color: "var(--c-text)" }}>
          {formatTime(time, lang)}
        </p>
      )}
      {venue && (
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>
          {venue}
        </p>
      )}
    </div>
  );
}
