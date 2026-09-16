"use client";

import { motion, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function useLineMotion(progress, start, end) {
  const isMobile = useIsMobile();
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
  const filter = useTransform(blur, (v) =>
    v <= 0.05 ? "none" : `blur(${v}px)`
  );
  return { opacity, y, filter: isMobile ? "none" : filter };
}

/**
 * Post Website Revamp card copy — lines reveal one at a time.
 * During the curtain exit, the whole copy block lags vs the parent panel
 * so it drifts left slower (one unit, no internal parallax).
 */
export default function WebsiteRevampOfferCopy({ progress, curtainProgress }) {
  const line1 = useLineMotion(progress, 0.02, 0.2);
  const line2 = useLineMotion(progress, 0.18, 0.38);
  const line3 = useLineMotion(progress, 0.4, 0.62);

  // Relative +x while panel does ~-105% → whole block moves left more slowly
  const copyParallaxX = useTransform(curtainProgress, [0, 1], ["0vw", "28vw"]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden px-6 sm:px-10">
      <motion.div
        style={{ x: copyParallaxX }}
        className="flex w-full max-w-4xl flex-col items-center text-center will-change-transform"
      >
        <motion.h3
          style={line1}
          className="font-ginto text-[clamp(32px,6.5vw,64px)] leading-[1.05] tracking-tight text-white"
        >
          Website looking tired?
        </motion.h3>

        <motion.p
          style={line2}
          className="mt-5 max-w-2xl font-gg-sans text-[clamp(20px,2.8vw,28px)] leading-[30px] text-white/70"
        >
          I don&apos;t patch it. I{" "}
          <span className="text-white">reinvent</span>
          <br />
          <br />
          <span className="text-white/45 text-[22px] font-bold leading-[2px]">"80% of website redesigns are initiated because of outdated aesthetics. 38% of visitors leave a page if the layout is unattractive" - Marketing LTB</span>
        </motion.p>

        <motion.p
          style={line3}
          className="mt-10 max-w-xl font-gg-sans text-[clamp(20px,1.8vw,24px)] leading-[30px] text-white/45"
        >
          Your brand is cool. Your website isn't. Make it stand out from the rest of the 1000+ websites out there.
        </motion.p>
      </motion.div>
    </div>
  );
}
