"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

/** When true (builder preview / gallery cards), children render statically without entrance motion. */
export const StaticMotion = createContext(false);
/** Entrance animations wait until this is true (e.g. until the envelope intro starts parting). */
export const RevealGate = createContext(true);

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  scale?: number;
}

/** Fades/slides its children in the first time they scroll into view. */
export default function Reveal(props: RevealProps) {
  const isStatic = useContext(StaticMotion);
  if (isStatic) return <div className={props.className}>{props.children}</div>;
  return <AnimatedReveal {...props} />;
}

function AnimatedReveal({ children, className, delay = 0, y = 28, scale = 1 }: RevealProps) {
  const gate = useContext(RevealGate);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y, scale };
  const shown = { opacity: 1, y: 0, scale: 1 };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={gate && inView ? shown : hidden}
      transition={{ duration: reduce ? 0.2 : 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
