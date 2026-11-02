// Decorative, CSS-only falling petals and twinkling sparkles. Server-renderable, deterministic
// positions (no Math.random) so there is no hydration mismatch.

const PETALS = [
  { left: 4, delay: 0, dur: 13, size: 14, hue: "#e0748f" },
  { left: 12, delay: 4, dur: 16, size: 10, hue: "#f4a259" },
  { left: 21, delay: 8, dur: 12, size: 16, hue: "#b4235a" },
  { left: 30, delay: 2, dur: 15, size: 12, hue: "#ffd166" },
  { left: 39, delay: 6, dur: 14, size: 18, hue: "#e0748f" },
  { left: 48, delay: 10, dur: 17, size: 11, hue: "#f4a259" },
  { left: 57, delay: 1, dur: 13, size: 15, hue: "#c9a227" },
  { left: 66, delay: 7, dur: 16, size: 12, hue: "#b4235a" },
  { left: 74, delay: 3, dur: 12, size: 17, hue: "#ffd166" },
  { left: 82, delay: 9, dur: 15, size: 10, hue: "#e0748f" },
  { left: 90, delay: 5, dur: 14, size: 14, hue: "#f4a259" },
  { left: 96, delay: 11, dur: 18, size: 12, hue: "#b4235a" },
];

const SPARKLES = [
  { left: 8, top: 18, delay: 0 },
  { left: 22, top: 62, delay: 1.2 },
  { left: 35, top: 30, delay: 2.1 },
  { left: 52, top: 12, delay: 0.6 },
  { left: 63, top: 70, delay: 1.8 },
  { left: 77, top: 25, delay: 2.6 },
  { left: 88, top: 55, delay: 0.9 },
  { left: 94, top: 10, delay: 1.5 },
];

export const SITE_KEYFRAMES = `
@keyframes si-fall { 0% { transform: translate3d(0,-10vh,0) rotate(0deg); opacity: 0 } 10% { opacity: .9 } 50% { transform: translate3d(28px,45vh,0) rotate(180deg) } 90% { opacity: .8 } 100% { transform: translate3d(-18px,105vh,0) rotate(360deg); opacity: 0 } }
@keyframes si-twinkle { 0%,100% { transform: scale(.4); opacity: 0 } 50% { transform: scale(1); opacity: 1 } }
@keyframes si-rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
@keyframes si-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes si-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
.si-rise { animation: si-rise .8s cubic-bezier(.2,.7,.2,1) both }
.si-float { animation: si-float 5s ease-in-out infinite }
.si-shimmer { background-size: 200% 100%; animation: si-shimmer 6s linear infinite }
`;

export function SiteKeyframes() {
  return <style dangerouslySetInnerHTML={{ __html: SITE_KEYFRAMES }} />;
}

export function FloatingPetals({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <SiteKeyframes />
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute -top-8 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            background: `radial-gradient(circle at 30% 30%, #fff8, transparent 60%), ${p.hue}`,
            borderRadius: "80% 0 80% 0",
            opacity: 0,
            animation: `si-fall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      {SPARKLES.map((s, i) => (
        <span
          key={`s${i}`}
          className="absolute text-gold"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animation: `si-twinkle 3s ease-in-out ${s.delay}s infinite`, opacity: 0 }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
