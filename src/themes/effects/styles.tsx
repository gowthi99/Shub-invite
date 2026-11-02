/**
 * One shared stylesheet for every theme effect, ornament and frame.
 * Rendered with React 19 `href` + `precedence` so it is hoisted to <head> and de-duplicated,
 * no matter how many themed components are on the page.
 */
const CSS = `
@layer components{
.si-orn{display:block;margin-inline:auto;width:100%;max-width:280px;height:auto;overflow:visible}
.si-frame{position:absolute;inset:0;pointer-events:none}
}
.si-fx{contain:strict}
.si-col{position:absolute;top:0;height:100%;display:flex;align-items:flex-start;justify-content:center;will-change:transform;animation:si-fall linear infinite}
.si-col.si-up{animation-name:si-rise}
@keyframes si-fall{from{transform:translate3d(0,-15%,0)}to{transform:translate3d(0,110%,0)}}
@keyframes si-rise{from{transform:translate3d(0,110%,0)}to{transform:translate3d(0,-18%,0)}}
.si-sw{animation:si-sway ease-in-out infinite alternate}
@keyframes si-sway{from{transform:translateX(calc(var(--si-sw,20px) * -1))}to{transform:translateX(var(--si-sw,20px))}}
.si-fl{animation:si-flutter linear infinite}
@keyframes si-flutter{from{transform:rotate(var(--si-r,0deg)) rotate3d(1,.6,0,0deg)}to{transform:rotate(calc(var(--si-r,0deg) + 200deg)) rotate3d(1,.6,0,360deg)}}
.si-sp{animation:si-spin linear infinite}
@keyframes si-spin{from{transform:rotate(var(--si-r,0deg))}to{transform:rotate(calc(var(--si-r,0deg) + 360deg))}}
.si-rock{animation:si-rock ease-in-out infinite alternate}
@keyframes si-rock{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
.si-tw{position:absolute;animation:si-twinkle ease-in-out infinite}
@keyframes si-twinkle{0%,100%{opacity:.15;transform:scale(.5)}50%{opacity:1;transform:scale(1)}}
.si-bob{position:absolute;animation:si-bob ease-in-out infinite alternate}
@keyframes si-bob{from{transform:translate3d(0,-12px,0)}to{transform:translate3d(0,12px,0)}}
.si-flame{transform-box:fill-box;transform-origin:50% 100%;animation:si-flame 1.4s ease-in-out infinite alternate}
@keyframes si-flame{0%{transform:scale(1,1) skewX(0)}30%{transform:scale(.9,1.1) skewX(3deg)}60%{transform:scale(1.05,.93) skewX(-3deg)}100%{transform:scale(.95,1.06) skewX(1deg)}}
.si-pulse{animation:si-pulse 2.8s ease-in-out infinite}
@keyframes si-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.si-swing{transform-box:fill-box;transform-origin:50% 0;animation:si-swing 3.6s ease-in-out infinite alternate}
@keyframes si-swing{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.si-float{animation:si-float 3.4s ease-in-out infinite alternate}
@keyframes si-float{from{transform:translateY(-3px)}to{transform:translateY(3px)}}
.si-blink{animation:si-blink 2.4s ease-in-out infinite}
@keyframes si-blink{0%,100%{opacity:1}50%{opacity:.3}}
.si-rot{transform-box:fill-box;transform-origin:50% 50%;animation:si-spin 48s linear infinite}
.si-neon{animation:si-neon 6s linear infinite}
@keyframes si-neon{0%,17%,21%,24%,52%,56%,100%{opacity:1}19%,23%,54%{opacity:.45}}
@media (prefers-reduced-motion:reduce){
.si-fx *,.si-flame,.si-pulse,.si-swing,.si-float,.si-blink,.si-rot,.si-neon{animation:none!important}
.si-col{transform:translate3d(0,var(--si-y,50%),0)!important}
}
`;

export function FxStyles() {
  return (
    <style href="shubh-theme-fx" precedence="medium">
      {CSS}
    </style>
  );
}

/** Encode an SVG string as a CSS url() for repeating background tiles. */
export function svgUrl(svg: string) {
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}
