"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GREEN = "#5E683C";
const CURSOR_SIZE = 56;
const HIT_PAD = 28;
/** How strongly content drifts toward the cursor (0–1). */
const MAGNET_STRENGTH = 0.28;

function LinkIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * Green circle cursor + optional loose magnetic pull on children.
 * Used by MagneticLink and footer contact icons.
 */
export function MagneticHotspot({
  href,
  children,
  className = "",
  target,
  rel,
  "aria-label": ariaLabel,
  magnet = true,
  color = GREEN,
  hitPad = HIT_PAD,
}) {
  const wrapRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawContentX = useMotionValue(0);
  const rawContentY = useMotionValue(0);

  // Laggy follow — bubble-escape feel
  const cursorX = useSpring(rawX, { stiffness: 38, damping: 14, mass: 0.85 });
  const cursorY = useSpring(rawY, { stiffness: 38, damping: 14, mass: 0.85 });
  const contentX = useSpring(rawContentX, {
    stiffness: 140,
    damping: 16,
    mass: 0.45,
  });
  const contentY = useSpring(rawContentY, {
    stiffness: 140,
    damping: 16,
    mass: 0.45,
  });

  const handleMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
    if (magnet) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawContentX.set((e.clientX - cx) * MAGNET_STRENGTH);
      rawContentY.set((e.clientY - cy) * MAGNET_STRENGTH);
    }
  };

  const handleEnter = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
    rawContentX.set(0);
    rawContentY.set(0);
  };

  return (
    <a
      ref={wrapRef}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className={`pointer-events-auto relative inline-flex items-center justify-center ${className}`}
      style={{ cursor: hovered ? "none" : "pointer" }}
    >
      {/* Expand hit area without eating the content box height (padding would). */}
      <span
        aria-hidden
        className="absolute"
        style={{ inset: -hitPad }}
      />

      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-30 flex items-center justify-center rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          marginLeft: -CURSOR_SIZE / 2,
          marginTop: -CURSOR_SIZE / 2,
          backgroundColor: color,
          boxShadow: `0 0 28px ${color}66`,
        }}
        animate={{
          scale: hovered ? 1 : 0.25,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.55 }}
      >
        <motion.span
          className="text-black"
          animate={{
            scale: hovered ? 1 : 0.4,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <LinkIcon className="h-5 w-5" />
        </motion.span>
      </motion.span>

      <motion.span
        className="relative z-10 flex h-full items-center"
        style={magnet ? { x: contentX, y: contentY } : undefined}
      >
        {children}
      </motion.span>
    </a>
  );
}

/**
 * Link text stays as-is. On hover, the cursor becomes a green circle
 * with a black link icon and lags like it’s escaping a bubble.
 */
export default function MagneticLink({ href, children, style, className = "" }) {
  return (
    <motion.div
      style={style}
      className={`pointer-events-auto relative mt-6 inline-flex items-center justify-center ${className}`}
    >
      <MagneticHotspot
        href={href}
        magnet={false}
        hitPad={12}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="relative z-10 font-gg-sans text-[clamp(15px,1.9vw,18px)] text-[#9aab6e] underline decoration-[#9aab6e]/40 underline-offset-4">
          {children}
        </span>
      </MagneticHotspot>
    </motion.div>
  );
}
