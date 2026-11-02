"use client";
import { AnimatePresence, motion } from "framer-motion";
import { IconMusic, IconMute } from "./Icons";

interface MusicToggleProps {
  playing: boolean;
  onToggle: () => void;
  labelOn: string; // strings.ui.musicOn
  labelOff: string; // strings.ui.musicOff
}

/** Floating round button that mutes/unmutes the ambient tune. */
export default function MusicToggle({ playing, onToggle, labelOn, labelOff }: MusicToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? labelOn : labelOff}
      title={playing ? labelOn : labelOff}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.6 }}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-12 w-12 place-items-center rounded-full shadow-lg backdrop-blur-md"
      style={{
        background: "var(--c-button)",
        color: "var(--c-button-text)",
        boxShadow: "0 10px 30px -10px var(--c-button)",
      }}
    >
      {playing && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 2px var(--c-button)" }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? "on" : "off"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {playing ? <IconMusic /> : <IconMute />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
