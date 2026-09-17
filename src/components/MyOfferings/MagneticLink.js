"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { THEME, lighten, withAlpha } from "@/theme/palette";

const DEFAULT_COLOR = THEME.saas;
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
 * Colored circle cursor + optional loose magnetic pull on children.
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
  color = DEFAULT_COLOR,
  hitPad = HIT_PAD,
  as = "a",
  customCursor = true,
  onClick,
  type = "button",
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

  useEffect(() => {
    if (magnet) return;
    rawContentX.set(0);
    rawContentY.set(0);
  }, [magnet, rawContentX, rawContentY]);

  const Tag = as === "button" ? "button" : as === "div" ? "div" : "a";
  const tagProps =
    Tag === "a"
      ? { href, target, rel }
      : Tag === "button"
        ? { type }
        : {};

  return (
    <Tag
      ref={wrapRef}
      {...tagProps}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className={`pointer-events-auto relative inline-flex items-center justify-center ${className}`}
      style={{ cursor: customCursor && hovered ? "none" : "pointer" }}
    >
      {/* Expand hit area without eating the content box height (padding would). */}
      <span
        aria-hidden
        className="absolute"
        style={{ inset: -hitPad }}
      />

      {customCursor ? (
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
      ) : null}

      <motion.span
        className="relative z-10 flex h-full items-center"
        style={magnet ? { x: contentX, y: contentY } : undefined}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

/**
 * Link text stays as-is. On hover, the cursor becomes a colored circle
 * with a black link icon and lags like it’s escaping a bubble.
 */
export default function MagneticLink({
  href,
  children,
  style,
  className = "",
  color = DEFAULT_COLOR,
}) {
  const textColor = lighten(color, 0.38);
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
        color={color}
      >
        <span
          className="relative z-10 font-gg-sans text-[clamp(15px,1.9vw,18px)] underline underline-offset-4"
          style={{
            color: textColor,
            textDecorationColor: withAlpha(textColor, 0.4),
          }}
        >
          {children}
        </span>
      </MagneticHotspot>
    </motion.div>
  );
}
