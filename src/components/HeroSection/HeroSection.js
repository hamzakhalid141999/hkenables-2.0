"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import OrbitingCircles from "./orbitingCircles";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Hero copy — edit text here.
 * Font sizes are set in the JSX `className` blocks below (search for "text-").
 */
export const HERO_COPY = {
  tagline: "I Design & Build",
  line1: "REAL GOOD",
  line2: "STUFF",
  line3Prefix: "THAT",
  line3Accent: "MOVES",
};

const ORBIT_COUNT = 10;
const ORBIT_RADIUS = 520;
const CIRCLE_DIAMETER = 155;

const ORBIT_COUNT_2 = 12;
const ORBIT_RADIUS_2 = 840;
const CIRCLE_DIAMETER_2 = 240;

export default function HeroSection({ active = true }) {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const taglineRef = useRef(null);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 5,
  });

  const skewX = useTransform(smoothX, (x) => {
    const half =
      typeof window !== "undefined" ? window.innerWidth / 2 : 960;
    return 6.5 - ((x + half) / (2 * half)) * 13;
  });

  useEffect(() => {
    if (!active || isMobile) return undefined;
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      mouseX.set(e.clientX - centerX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, active, isMobile]);

  useEffect(() => {
    const el = taglineRef.current;
    if (!el) return undefined;

    const logFont = async () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        // ignore
      }
      const style = getComputedStyle(el);
      const family = style.fontFamily;
      const weight = style.fontWeight;
      let matched = "(document.fonts unavailable)";
      try {
        matched =
          [...document.fonts].find((f) =>
            family.toLowerCase().includes(f.family.toLowerCase().replace(/['"]/g, ""))
          )?.family ?? "(no matching loaded face)";
      } catch {
        // ignore
      }
      console.log("[font check] hero tagline", {
        computedFontFamily: family,
        fontWeight: weight,
        matchedLoadedFace: matched,
        usingGgSans:
          /gg.?sans|__ggSans/i.test(family) ||
          /gg.?sans/i.test(String(matched)),
      });
    };

    logFont();
    return undefined;
  }, []);

  const blobGradient =
    "radial-gradient(circle, #A5C244 0%, #42482D 32%, #272D14 48%, #0D0F06 68%, #000000 100%)";

  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden bg-black px-4 sm:px-6 md:px-8 ${
        isMobile ? "h-full" : "h-screen min-h-[600px]"
      }`}
    >
      <div
        style={{ zIndex: 30 }}
        className="absolute bottom-0 left-0 h-[15%] w-full bg-gradient-to-b from-transparent to-black"
      />

      {/*
        Full-bleed radial — no CSS filter:blur().
        iOS Safari rasterizes blur into a hard rectangle, which showed up as
        black bars around the glow on iPhone.
      */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax]"
        style={{ x: "-50%", y: "-50%", background: blobGradient }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1,
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax]"
        style={{ x: "-50%", y: "-50%", background: blobGradient }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{
          delay: 1.4,
          duration: 0.4,
          ease: "easeOut",
        }}
      />

      {active && !isMobile ? (
        <OrbitingCircles
          orbitCount={ORBIT_COUNT}
          orbitRadius={ORBIT_RADIUS}
          circleDiameter={CIRCLE_DIAMETER}
          orbitCount2={ORBIT_COUNT_2}
          orbitRadius2={ORBIT_RADIUS_2}
          circleDiameter2={CIRCLE_DIAMETER_2}
        />
      ) : null}

      {/* Text overlay — font sizes: mobile → tablet (md) → desktop (lg) */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center text-white"
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: 0.35,
          delayChildren: 2.2,
        }}
      >
        <motion.p
          ref={taglineRef}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-gg-sans mb-4 font-medium text-[22px] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] sm:text-[30px] md:text-[36px] lg:text-[40px]"
        >
          {HERO_COPY.tagline}
        </motion.p>

        <motion.h1
          className="font-ginto-ultra text-[clamp(30px,10vw,120px)] leading-[0.92] drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] md:leading-tight"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          style={{ marginLeft: isMobile ? "-13%" : "0" }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {HERO_COPY.line1}
        </motion.h1>

        <motion.h1
          className="font-ginto-ultra ml-[-15%] text-[clamp(30px,10vw,120px)] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)]"
          style={{ marginTop: isMobile ? -0 : -30, marginLeft: isMobile ? "-29%" : "0" }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {HERO_COPY.line2}
        </motion.h1>

        <motion.h1
          className="font-ginto-ultra ml-[9%] whitespace-nowrap text-[clamp(30px,10vw,120px)] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)]"
          style={{
            marginTop: isMobile ? '-8px' : -25,
            marginLeft: isMobile ? "3%" : "9%",
          }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {HERO_COPY.line3Prefix}{" "}
          <motion.span
            style={{
              display: "inline-block",
              skewX: isMobile ? 0 : skewX,
              transformOrigin: "left center",
            }}
          >
            {HERO_COPY.line3Accent}
          </motion.span>
        </motion.h1>
      </motion.div>
    </section>
  );
}
