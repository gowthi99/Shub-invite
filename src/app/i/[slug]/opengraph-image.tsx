import { ImageResponse } from "next/og";
import { getInviteBySlug } from "@/lib/invites";
import { getTheme } from "@/themes";
import { getStrings, formatDate } from "@/lib/i18n";
import { isCoupleOccasion } from "@/lib/types";

export const runtime = "nodejs";
export const alt = "You're invited";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori ships no Indic glyphs, so Telugu/Hindi names would render as boxes. Fetch just the
// glyphs we need from Google Fonts (a UA-less request returns TTF, which Satori can read).
async function loadFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@700&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function fontsFor(text: string) {
  const families = [
    ["Noto+Sans", "Noto Sans", /[\u0000-\u024f]/],
    ["Noto+Sans+Telugu", "Noto Sans Telugu", /[\u0c00-\u0c7f]/],
    ["Noto+Sans+Devanagari", "Noto Sans Devanagari", /[\u0900-\u097f]/],
  ] as const;
  const loaded = await Promise.all(
    families.filter(([, , re]) => re.test(text)).map(async ([q, name]) => ({ name, data: await loadFont(q, text) })),
  );
  return loaded.flatMap((f) =>
    f.data ? [{ name: f.name as string, data: f.data, weight: 700 as const, style: "normal" as const }] : [],
  );
}

function background(value: string, fallback: string): Record<string, string> {
  return /gradient\(/.test(value) ? { backgroundImage: value, backgroundColor: fallback } : { backgroundColor: value || fallback };
}

function GenericCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "linear-gradient(150deg,#fff8ef,#ffd9e4)",
        color: "#8a1744",
      }}
    >
      <div style={{ fontSize: 40, letterSpacing: 8, textTransform: "uppercase", color: "#c9a227" }}>Shubh Invites</div>
      <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24 }}>You&apos;re invited</div>
      <div style={{ fontSize: 34, marginTop: 24, color: "#6b3a4a" }}>Beautiful animated invitations</div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let invite = null;
  try {
    invite = await getInviteBySlug(slug);
  } catch (err) {
    console.error("[og-image]", err);
  }
  if (!invite) return new ImageResponse(<GenericCard />, size);

  const { data } = invite;
  const theme = getTheme(data.themeId);
  const p = theme.palette;
  const en = getStrings("en");
  const names =
    isCoupleOccasion(data.occasion) && data.secondaryName
      ? `${data.primaryName} & ${data.secondaryName}`
      : data.primaryName;
  const first = [...data.events].filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date))[0];
  const when = first ? formatDate(first.date, "en") : "";
  const fonts = await fontsFor(`${names}${en.occasionLabel[data.occasion]}${when}${en.ui.youAreInvited}`);
  const nameSize = names.length > 28 ? 64 : names.length > 18 ? 84 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          fontFamily: fonts.length ? fonts.map((f) => `"${f.name}"`).join(", ") : undefined,
          ...background(p.bgGradient, p.bg),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `4px solid ${p.accent}`,
            // Theme text colours are designed for the card surface, not the raw backdrop.
            backgroundColor: p.card.startsWith("rgba") ? p.card.replace(/[\d.]+\)$/, "0.92)") : p.card,
            borderRadius: 32,
            padding: 48,
            color: p.text,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 34, letterSpacing: 10, textTransform: "uppercase", color: p.accent }}>
            {en.occasionLabel[data.occasion]}
          </div>
          <div style={{ width: 160, height: 4, backgroundColor: p.accent2, marginTop: 24, marginBottom: 24, borderRadius: 2 }} />
          <div style={{ fontSize: nameSize, fontWeight: 700, lineHeight: 1.1, color: p.text, maxWidth: 1000 }}>{names}</div>
          {when ? <div style={{ fontSize: 40, marginTop: 32, color: p.muted }}>{when}</div> : null}
          <div style={{ fontSize: 36, marginTop: 28, color: p.accent, fontStyle: "italic" }}>{en.ui.youAreInvited}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
