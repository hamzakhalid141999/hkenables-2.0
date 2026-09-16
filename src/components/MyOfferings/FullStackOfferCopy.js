"use client";

import { motion, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MagneticHotspot } from "./MagneticLink";

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
          className="font-ginto text-[clamp(32px,6.5vw,64px)] leading-[1.05] tracking-tight text-white"
        >
          Convert that idea into a SaaS!
        </motion.h3>

        <motion.p
          style={line2}
          className="mt-5 max-w-2xl font-gg-sans text-[clamp(20px,2.8vw,28px)] leading-[33px] text-white/70"
        >
          I can ship fast, so can others. But I can ship it not looking like another AI slop UI/UX
          <br />
          <br />
          <span className="text-white/45 text-[22px] font-bold">"94% of first impressions of a business are related to website design" - Marketing LTB</span>
          <br />
          <span className="text-white/45 text-[22px] font-bold">"Startups that start with an MVP are often cited as ~60–70% more likely to succeed" - American Chase</span>
        
        </motion.p>

        <motion.p
          style={line3}
          className="mt-10 max-w-xl font-gg-sans text-[clamp(20px,1.8vw,24px)] leading-[30px] text-white/45"
        >
          Founders are busy, I let them take the back-seat and take charge of the
          product myself. Don&apos;t take my word for it,{" "}
          <MagneticHotspot
            href="https://www.linkedin.com/in/hamza-khalid-5a40931a5/details/recommendations/?detailScreenTabIndex=0"
            magnet={false}
            hitPad={8}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Read LinkedIn recommendations"
            className="inline"
          >
            <span className="text-[#9aab6e] underline decoration-[#9aab6e]/40 underline-offset-4 transition-colors hover:text-[#b4c47e] hover:decoration-[#9aab6e]/70">
              see for yourself
            </span>
          </MagneticHotspot>{" "}
          :)
        </motion.p>
      </div>
    </div>
  );
}
