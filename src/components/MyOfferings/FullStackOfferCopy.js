"use client";

import { motion, useTransform } from "framer-motion";

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

/**
 * Post Full-Stack card copy — lines reveal one at a time.
 */
export default function FullStackOfferCopy({ progress }) {
  const line1 = useLineMotion(progress, 0.02, 0.2);
  const line2 = useLineMotion(progress, 0.18, 0.38);
  const line3 = useLineMotion(progress, 0.4, 0.62);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 sm:px-10">
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <motion.h3
          style={line1}
          className="font-climate-crisis text-[clamp(32px,6.5vw,64px)] leading-[1.05] tracking-tight text-white"
        >
          Got an idea for a project or MVP?
        </motion.h3>

        <motion.p
          style={line2}
          className="mt-5 max-w-2xl font-gruppo text-[clamp(18px,2.8vw,28px)] leading-snug text-white/70"
        >
          We don&apos;t just build it. We make it{" "}
          <span className="text-white">impossible to ignore</span>.
        </motion.p>

        <motion.p
          style={line3}
          className="mt-10 max-w-xl font-gruppo text-[clamp(14px,1.8vw,24px)] leading-relaxed text-white/45"
        >
          Shipped at{" "}
          <span className="text-[#9aab6e]">AI speed</span>
          {" "}- frontend, backend, and database, from concept to production.
        </motion.p>
      </div>
    </div>
  );
}
