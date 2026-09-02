"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const RISE_DURATION = 0.88;
const TITLE_RISE_DURATION = 0.55;
const NUMBER_RISE_DURATION = 0.62;
const TITLE_TUCK_START = 70;
const TITLE_TUCK_END = 16;
const NUMBER_TUCK_START = 90;
const NUMBER_TUCK_END = 42;
// Panel + heading shift opposite the number (desktop only)
const CARD_SHIFT_VW = 11;
const NARROW_BREAKPOINT = 950;

const MOTION_SPRING = { stiffness: 105, damping: 27, mass: 0.5 };

function useIsNarrow(breakpoint = NARROW_BREAKPOINT) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);

  return isNarrow;
}

/**
 * Card + title + side number move together.
 * Number peeks from left/right; panel+heading shift the other way.
 * Below 950px: numbers hide, no lateral shift, panel widens to 90%.
 */
export default function OfferingCard({
  progress,
  exitProgress,
  children,
  title,
  number,
  side = "left",
}) {
  const fromLeft = side === "left";
  const isNarrow = useIsNarrow();

  const cardOpacityRaw = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p / 0.35));
    return easeOutCubic(t);
  });

  const cardYRaw = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p / RISE_DURATION));
    const eased = easeOutExpo(t);
    return (1 - eased) * 52;
  });

  // Number left → shift panel/heading right; number right → shift left.
  // Applied only on wide screens so the preview stays centered below 950px.
  const groupXRaw = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p / 0.45));
    const eased = easeOutCubic(t);
    const dir = fromLeft ? 1 : -1;
    return `${dir * eased * CARD_SHIFT_VW}vw`;
  });

  const titleY = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p / TITLE_RISE_DURATION));
    const eased = easeOutCubic(t);
    const tuck =
      TITLE_TUCK_START - eased * (TITLE_TUCK_START - TITLE_TUCK_END);
    return `calc(-100% + ${tuck}%)`;
  });

  const titleOpacity = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p / 0.28));
    return easeOutCubic(t);
  });

  const numberOpacityRaw = useTransform([progress, exitProgress], ([p, e]) => {
    const enterT = Math.min(1, Math.max(0, p / 0.22));
    const exitT = Math.min(1, Math.max(0, e));
    return easeOutCubic(enterT) * (1 - easeInOutCubic(exitT));
  });
  const numberXRaw = useTransform([progress, exitProgress], ([p, e]) => {
    const enterT = Math.min(1, Math.max(0, p / NUMBER_RISE_DURATION));
    const exitT = Math.min(1, Math.max(0, e));
    const enterEased = easeOutCubic(enterT);
    const exitEased = easeInOutCubic(exitT);
    const visibleTuck =
      NUMBER_TUCK_START - enterEased * (NUMBER_TUCK_START - NUMBER_TUCK_END);
    const tuck =
      visibleTuck + (NUMBER_TUCK_START - visibleTuck) * exitEased;
    return fromLeft
      ? `calc(-100% + ${tuck}%)`
      : `calc(100% - ${tuck}%)`;
  });

  const cardOpacity = useSpring(cardOpacityRaw, MOTION_SPRING);
  const cardY = useSpring(cardYRaw, MOTION_SPRING);
  const groupX = useSpring(groupXRaw, MOTION_SPRING);

  const exitOpacityRaw = useTransform(exitProgress, (e) => {
    const t = Math.min(1, Math.max(0, e));
    return 1 - easeInOutCubic(t);
  });
  const exitYRaw = useTransform(exitProgress, (e) => {
    const t = Math.min(1, Math.max(0, e));
    return -easeInOutCubic(t) * 48;
  });
  const exitScaleRaw = useTransform(exitProgress, (e) => {
    const t = Math.min(1, Math.max(0, e));
    return 1 - easeInOutCubic(t) * 0.08;
  });
  const exitBlurRaw = useTransform(exitProgress, (e) => {
    const t = Math.min(1, Math.max(0, e));
    return easeInOutCubic(t) * 14;
  });

  const exitOpacity = useSpring(exitOpacityRaw, MOTION_SPRING);
  const exitY = useSpring(exitYRaw, MOTION_SPRING);
  const exitScale = useSpring(exitScaleRaw, MOTION_SPRING);
  const exitBlur = useSpring(exitBlurRaw, MOTION_SPRING);

  const numberOpacity = numberOpacityRaw;
  const numberX = numberXRaw;

  const combinedOpacity = useTransform(
    [cardOpacity, exitOpacity],
    ([a, b]) => a * b
  );
  const combinedY = useTransform(
    [cardY, exitY],
    ([rise, exit]) => `${rise + exit}vh`
  );
  const combinedFilter = useTransform(exitBlur, (v) =>
    v > 0.05 ? `blur(${v}px)` : "blur(0px)"
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Group: number + title + panel share the same horizontal shift */}
      <motion.div
        style={{
          x: isNarrow ? 0 : groupX,
          y: combinedY,
          opacity: combinedOpacity,
          scale: exitScale,
          filter: combinedFilter,
        }}
        className="relative flex h-[70vh] w-[90%] max-w-5xl items-start justify-center will-change-transform min-[950px]:w-[70%]"
      >
        {number != null && !isNarrow ? (
          <motion.span
            style={{ opacity: numberOpacity, x: numberX }}
            className={`pointer-events-none absolute top-1/2 z-0 -translate-y-1/2 select-none ${
              fromLeft ? "left-0" : "right-0"
            }`}
            aria-hidden
          >
            <span
              className="inline-block origin-center font-archivo-black text-[clamp(180px,36vw,420px)] leading-none tracking-tighter text-white/4"
              style={{
                transform: "scaleY(1.5) scaleX(0.78)",
              }}
            >
              {number}
            </span>
          </motion.span>
        ) : null}

        {title ? (
          <motion.h3
            style={{ opacity: titleOpacity, y: titleY }}
            className="pointer-events-none absolute left-1/2 top-0 z-1 w-[130%] -translate-x-1/2 text-center font-climate-crisis text-[clamp(28px,5vw,76px)] leading-none tracking-tight text-white"
          >
            {title}
          </motion.h3>
        ) : null}

        <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] bg-[#1a1a1a] shadow-[0_8px_40px_rgba(0,0,0,0.20)]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
