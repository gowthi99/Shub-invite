"use client";
import { useEffect, useRef, useState } from "react";
import InviteView from "@/components/invite/InviteView";
import type { InviteData } from "@/lib/types";

export const PHONE_W = 360;
export const PHONE_H = 640;

/**
 * Renders the invitation at a real 360×640 phone viewport, scaled to fit the container width.
 * `interactive` allows scrolling inside the phone (live preview); otherwise it's a static thumbnail.
 */
export default function ScaledInvite({
  data,
  interactive = false,
  className = "",
}: {
  data: InviteData;
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PHONE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${PHONE_W} / ${PHONE_H}` }}
    >
      {scale > 0 && (
        <div
          className={`absolute top-0 left-0 origin-top-left overscroll-contain ${
            interactive ? "overflow-y-auto" : "pointer-events-none overflow-hidden"
          }`}
          style={{
            width: PHONE_W,
            height: PHONE_H,
            transform: `scale(${scale})`,
            // creates a containing block so fixed-position layers stay inside the phone
            contain: "layout paint",
          }}
          aria-hidden={interactive ? undefined : true}
          inert={interactive ? undefined : true}
        >
          <InviteView data={data} preview />
        </div>
      )}
    </div>
  );
}

/** Phone-shaped bezel around a scaled invite. */
export function PhoneFrame({ data, className = "" }: { data: InviteData; className?: string }) {
  return (
    <div className={`rounded-[2.4rem] bg-stone-900 p-2.5 shadow-2xl shadow-brand/20 ring-1 ring-black/10 ${className}`}>
      <div className="relative overflow-hidden rounded-[1.9rem] bg-white">
        <div className="pointer-events-none absolute top-2 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-stone-900/90" />
        <ScaledInvite data={data} interactive />
      </div>
    </div>
  );
}
