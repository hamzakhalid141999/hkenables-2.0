"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import OrbitingCircles from "./orbitingCircles";

/**
 * Hero copy — edit text here.
 * Font sizes are set in the JSX `className` blocks below (search for "text-").
 */
export const HERO_COPY = {
  tagline: "We Make",
  line1: "REAL GOOD",
  line2: "SITES",
  line3Prefix: "THAT",
  line3Accent: "MOVE",
};

const ORBIT_COUNT = 10;
const ORBIT_RADIUS = 520;
const CIRCLE_DIAMETER = 155;

const ORBIT_COUNT_2 = 12;
const ORBIT_RADIUS_2 = 840;
const CIRCLE_DIAMETER_2 = 240;

export default function HeroSection() {
  const mouseX = useMotionValue(0);

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
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      mouseX.set(e.clientX - centerX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden bg-black px-4 sm:px-6 md:px-8">
      <div
        style={{ zIndex: 30 }}
        className="absolute bottom-0 left-0 h-[15%] w-full bg-gradient-to-b from-transparent to-black"
      />

      {/* Blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] sm:h-[88vmin] sm:w-[88vmin] sm:blur-[140px] md:h-[85vmin] md:w-[85vmin] md:blur-[200px]"
        style={{
          background:
            "radial-gradient(circle, #A5C244 0%, #42482D 46%, #272D14 60%, #0D0F06 78%, #000000 100%)",
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1,
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* Breathing layer */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] sm:h-[88vmin] sm:w-[88vmin] sm:blur-[140px] md:h-[85vmin] md:w-[85vmin] md:blur-[200px]"
        style={{
          background:
            "radial-gradient(circle, #A5C244 0%, #42482D 46%, #272D14 60%, #0D0F06 78%, #000000 100%)",
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: 0.9,
          scale: [1, 1.2, 1],
        }}
        transition={{
          opacity: { delay: 1.4, duration: 0.3 },
          scale: {
            delay: 1.5,
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <OrbitingCircles
        orbitCount={ORBIT_COUNT}
        orbitRadius={ORBIT_RADIUS}
        circleDiameter={CIRCLE_DIAMETER}
        orbitCount2={ORBIT_COUNT_2}
        orbitRadius2={ORBIT_RADIUS_2}
        circleDiameter2={CIRCLE_DIAMETER_2}
      />

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
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-gruppo text-[22px] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] sm:text-[30px] md:text-[36px] lg:text-[40px]"
        >
          {HERO_COPY.tagline}
        </motion.p>

        <motion.h1
          className="font-climate-crisis text-[clamp(52px,14vw,120px)] leading-[0.92] drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] md:leading-tight"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {HERO_COPY.line1}
        </motion.h1>

        <motion.h1
          className="font-climate-crisis ml-[-15%] mt-[-25px] text-[clamp(52px,14vw,120px)] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)]"
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
          className="font-climate-crisis ml-[9%] mt-[-25px] text-[clamp(52px,14vw,120px)] leading-tight drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)]"
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
              skewX,
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
