"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import MagneticLink from "./MagneticLink";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function useLineMotion(progress, start, end) {
  const opacity = useTransform(progress, (p) => {
    if (p < start) return 0;
    if (p >= end) return 1;
    return easeOutCubic((p - start) / (end - start));
  });
  const y = useTransform(progress, (p) => {
    if (p < start) return 28;
    if (p >= end) return 0;
    const t = easeOutCubic((p - start) / (end - start));
    return 28 * (1 - t);
  });
  const blur = useTransform(progress, (p) => {
    if (p < start) return 8;
    if (p >= end) return 0;
    const t = easeOutCubic((p - start) / (end - start));
    return 8 * (1 - t);
  });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return { opacity, y, filter };
}

const GLOW_EASE = [0.22, 1, 0.36, 1];
const GLOW_IN_MS = 0.48;
const GLOW_HOLD_MS = 0.18;
const GLOW_OUT_MS = 0.5;
const BETWEEN_MS = 0.06;
/** Active while the SaaS copy heading is on screen. */
const GLOW_ACTIVE_AT = 0.18;
const GLOW_INACTIVE_ABOVE = 0.92;
const GLOW_RESET_BELOW = 0.08;

function useWordGlow(glow) {
  const textShadow = useTransform(
    glow,
    (v) =>
      `0 0 ${4 + v * 10}px rgba(255,255,255,${v * 0.45}), 0 0 ${
        10 + v * 22
      }px rgba(255,255,255,${v * 0.22})`
  );
  const color = useTransform(
    glow,
    (v) => `rgba(255,255,255,${0.78 + v * 0.22})`
  );
  return { textShadow, color };
}

function GlowWord({ children, glow }) {
  const style = useWordGlow(glow);
  return (
    <motion.span style={style} className="inline-block will-change-[text-shadow,color]">
      {children}
    </motion.span>
  );
}

/**
 * Post-card copy — lines reveal one at a time via scroll progress 0→1.
 * "Design / Develop / Engineer" cycle a white text glow once the heading is in view.
 */
export default function SaasOfferCopy({ progress }) {
  const line1 = useLineMotion(progress, 0.02, 0.2);
  const line2 = useLineMotion(progress, 0.18, 0.38);
  const line3 = useLineMotion(progress, 0.4, 0.6);
  const line4 = useLineMotion(progress, 0.58, 0.78);

  const designGlow = useMotionValue(0);
  const developGlow = useMotionValue(0);
  const engineerGlow = useMotionValue(0);
  const runningRef = useRef(false);
  const controlsRef = useRef([]);
  const generationRef = useRef(0);

  const stopGlow = () => {
    generationRef.current += 1;
    runningRef.current = false;
    controlsRef.current.forEach((c) => c.stop());
    controlsRef.current = [];
    designGlow.set(0);
    developGlow.set(0);
    engineerGlow.set(0);
  };

  useEffect(() => {
    return () => {
      stopGlow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup on unmount only
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    const inView = value >= GLOW_ACTIVE_AT && value <= GLOW_INACTIVE_ABOVE;
    const fullyLeft = value < GLOW_RESET_BELOW || value > GLOW_INACTIVE_ABOVE;

    if (fullyLeft && runningRef.current) {
      stopGlow();
      return;
    }

    if (!inView || runningRef.current) return;

    runningRef.current = true;
    const generation = generationRef.current;

    const glowIn = (mv) =>
      animate(mv, 1, { duration: GLOW_IN_MS, ease: GLOW_EASE });
    const glowOut = (mv) =>
      animate(mv, 0, { duration: GLOW_OUT_MS, ease: GLOW_EASE });

    const wait = (ms) =>
      new Promise((resolve) => {
        const t = window.setTimeout(resolve, ms * 1000);
        controlsRef.current.push({ stop: () => window.clearTimeout(t) });
      });

    const stillActive = () =>
      runningRef.current && generationRef.current === generation;

    const runCycle = async () => {
      const words = [designGlow, developGlow, engineerGlow];

      // Always open on Design when (re)entering view
      designGlow.set(0);
      developGlow.set(0);
      engineerGlow.set(0);
      const firstIn = glowIn(designGlow);
      controlsRef.current.push(firstIn);
      await firstIn.finished;
      if (!stillActive()) return;
      await wait(GLOW_HOLD_MS);
      if (!stillActive()) return;

      let index = 0;
      while (stillActive()) {
        const prev = words[index];
        index = (index + 1) % words.length;
        const current = words[index];

        const out = glowOut(prev);
        const inn = glowIn(current);
        controlsRef.current.push(out, inn);
        await Promise.all([out.finished, inn.finished]);
        if (!stillActive()) return;
        await wait(GLOW_HOLD_MS);
        if (!stillActive()) return;
        await wait(BETWEEN_MS);
      }
    };

    runCycle();
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 sm:px-10">
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <motion.h3
          style={line1}
          className="font-climate-crisis text-[clamp(32px,6.5vw,64px)] leading-[1.05] tracking-tight text-white"
        >
          <GlowWord glow={designGlow}>Design</GlowWord>
          <span className="text-white/75">, </span>
          <GlowWord glow={developGlow}>Develop</GlowWord>
          <span className="text-white/75"> and </span>
          <GlowWord glow={engineerGlow}>Engineer</GlowWord>
        </motion.h3>

        <motion.p
          style={line2}
          className="mt-5 max-w-2xl font-gruppo text-[clamp(18px,2.8vw,28px)] leading-snug text-white/70"
        >
          your SaaS landing pages, that attract and convert users
        </motion.p>

        <motion.p
          style={line3}
          className="mt-10 max-w-xl font-gruppo text-[clamp(14px,1.8vw,24px)] leading-relaxed text-white/45"
        >
          See the latest example where we have{" "}
          <span className="text-white/80">115+ signups</span> in less than a
          month
        </motion.p>

        <MagneticLink href="https://www.batchedits.com" style={line4}>
          www.batchedits.com
        </MagneticLink>
      </div>
    </div>
  );
}
