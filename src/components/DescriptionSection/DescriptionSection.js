"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useIsMobile, useHasMounted } from "@/hooks/useIsMobile";
import { THEME } from "@/theme/palette";

const ABOUT = THEME.about;

const PIN_SCROLL_VH = 1;
export const ABOUT_OVERLAP_VH = 1;
const CHAR_PROGRESS_SPAN = 0.028;
const REVEAL_START = 0;
const REVEAL_END = 1 / (PIN_SCROLL_VH + 1);
const REVEAL_RANGE = REVEAL_END - REVEAL_START - CHAR_PROGRESS_SPAN;
const FOCUS_END = REVEAL_END * 0.5;
const TEXT_EXIT_START = 0.3;
const DARK = "rgb(68, 68, 68)";
const WHITE = "rgb(255,255,255)";

const TITLE_TEXT = "About Me";
const BODY_TEXT =
  "I build impactful digital experiences that don't just look good, they drive user retention and convert. From frontend to full-stack solutions, I deliver fast, AI-powered development tailored to your goals.";

function Char({ children, charIndex, totalChars, progressSpring, isStroke = false }) {
  const charProgress = useTransform(progressSpring, (v) => {
    if (v >= REVEAL_END) return 1;
    const start = REVEAL_START + (charIndex / Math.max(totalChars - 1, 1)) * REVEAL_RANGE;
    const p = (v - start) / CHAR_PROGRESS_SPAN;
    return Math.max(0, Math.min(1, p));
  });

  const color = useTransform(charProgress, [0, 0.25, 1], [DARK, "#bbbbbb", WHITE]);
  const strokeStyle = useTransform(
    charProgress,
    (v) => `1px rgba(255,255,255,${0.08 + v * 0.38})`
  );

  if (isStroke) {
    return (
      <motion.span className="inline-block" style={{ WebkitTextStroke: strokeStyle }}>
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span className="inline-block" style={{ color }}>
      {children}
    </motion.span>
  );
}

function AboutMeMobile() {
  return (
    <section
      id="aboutMe"
      data-snap
      className="relative z-20 h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute inset-0 grid grid-cols-8 opacity-50">
        <div className="absolute top-0 left-0 z-30 h-[50%] w-full bg-linear-to-b from-black to-transparent" />
        <div
          className="absolute bottom-0 left-0 z-30 h-[70%] w-full"
          style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${ABOUT})` }}
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-full w-full border-r-[0.5px]"
            style={{ borderColor: ABOUT }}
          />
        ))}
      </div>
      <div className="relative z-20 flex h-full flex-col justify-center gap-10 px-5">
        <h1 className="font-ginto text-[clamp(42px,11vw,100px)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.46)]">
          {TITLE_TEXT}
        </h1>
        <p className="font-archivo-black text-[clamp(18px,6.2vw,36px)] leading-none tracking-tight text-white">
          {BODY_TEXT}
        </p>
      </div>
    </section>
  );
}

function AboutMeDesktop() {
  const sectionRef = useRef(null);
  const scrollTrackRef = useRef(null);

  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start end", "end start"],
  });

  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.65,
  });

  const sectionProgressSpring = useSpring(sectionScrollProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.65,
  });

  const blurAmount = useTransform(progressSpring, [0, FOCUS_END * 0.75, FOCUS_END], [18, 4, 0]);
  const focusFilter = useTransform(blurAmount, (v) => `blur(${v}px)`);
  const focusOpacity = useTransform(progressSpring, [0, FOCUS_END * 0.45, FOCUS_END], [0.15, 0.5, 1]);
  const contentY = useTransform(progressSpring, [0.78, 1], [0, -140]);
  const textExitOpacity = useTransform(sectionProgressSpring, [TEXT_EXIT_START, 1], [1, 0]);

  const titleChars = TITLE_TEXT.split("");
  const bodyWords = BODY_TEXT.split(/\s+/);
  const totalRevealChars = titleChars.length + BODY_TEXT.length;

  return (
    <div
      id="aboutMe"
      ref={sectionRef}
      className="relative z-20 w-full"
      style={{
        height: `${(PIN_SCROLL_VH + ABOUT_OVERLAP_VH) * 100}vh`,
        backgroundColor: ABOUT,
      }}
    >
      <div
        ref={scrollTrackRef}
        className="pointer-events-none absolute top-0 left-0 w-full"
        style={{ height: `${PIN_SCROLL_VH * 100}vh` }}
        aria-hidden
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="h-full w-full">
          <div className="relative h-full w-full bg-black flex flex-col items-center py-20 md:py-32 overflow-hidden">
            <div className="w-full h-full grid absolute top-0 left-0 grid-cols-8 opacity-50 pointer-events-none">
              <div style={{ zIndex: 30 }} className="absolute top-0 left-0 w-full h-[50%] bg-linear-to-b from-black to-transparent" />
              <div
                style={{
                  zIndex: 30,
                  backgroundImage: `linear-gradient(to bottom, transparent, ${ABOUT})`,
                }}
                className="absolute bottom-0 left-0 h-[70%] w-full"
              />
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full w-full border-r-[0.5px]"
                  style={{ borderColor: ABOUT }}
                />
              ))}
            </div>

            <motion.div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                opacity: 0.1,
                backgroundImage: `linear-gradient(to top, ${ABOUT}, transparent)`,
              }}
            />

            <motion.div
              className="relative z-20 w-full flex flex-col gap-10 px-5 sm:px-8 md:px-12 lg:px-16"
              style={{
                y: contentY,
                opacity: focusOpacity,
                filter: focusFilter,
              }}
            >
              <motion.div className="w-[90%]" style={{ opacity: textExitOpacity }}>
                <h1 className="w-full mb-12 text-[clamp(42px,11vw,100px)] font-ginto text-transparent leading-none">
                  {titleChars.map((char, i) => (
                    <Char
                      key={i}
                      charIndex={i}
                      totalChars={totalRevealChars}
                      progressSpring={progressSpring}
                      isStroke
                    >
                      {char}
                    </Char>
                  ))}
                </h1>

                <p className="w-full text-[clamp(14px,6.8vw,60px)] font-archivo-black leading-none tracking-tight">
                  {bodyWords.map((word, wi) => {
                    const startCharIndex = bodyWords
                      .slice(0, wi)
                      .reduce((sum, w) => sum + w.length + 1, 0);
                    return (
                      <React.Fragment key={wi}>
                        <span style={{ whiteSpace: "nowrap" }}>
                          {word.split("").map((char, j) => (
                            <Char
                              key={j}
                              charIndex={titleChars.length + startCharIndex + j}
                              totalChars={totalRevealChars}
                              progressSpring={progressSpring}
                            >
                              {char}
                            </Char>
                          ))}
                        </span>
                        {wi < bodyWords.length - 1 ? " " : null}
                      </React.Fragment>
                    );
                  })}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DescriptionSection() {
  const isMobile = useIsMobile();
  const mounted = useHasMounted();
  if (!mounted) return <div className="h-dvh w-full bg-black" aria-hidden />;
  return isMobile ? <AboutMeMobile /> : <AboutMeDesktop />;
}
