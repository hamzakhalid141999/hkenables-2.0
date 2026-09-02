"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useLenis } from "lenis/react";

const SCROLL_RANGE = [0, 1200]; // px scroll over which effects go from base to max

function TechCircle({
  width,
  height,
  filter,
  transform,
  delay,
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-10 rounded-full"
      style={{
        transform,
        width,
        height,
        filter,
      }}
    >
      <motion.div
        className="h-full w-full rounded-full border-[3px] border-[#424242]"
        style={{ background: "rgba(32, 32, 32, 0.45)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{
          delay,
          duration: 1.2,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

function OrbitCircleItem({
  index,
  count,
  radius,
  width,
  height,
  filter,
}) {
  const angleDeg = (index / count) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const transform = useTransform(radius, (r) => {
    const x = Math.cos(angleRad) * r;
    const y = Math.sin(angleRad) * r;
    return `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
  });

  return (
    <TechCircle
      width={width}
      height={height}
      filter={filter}
      transform={transform}
      delay={2.9 + index * 0.08}
    />
  );
}

function OrbitingCircles({
  orbitCount,
  orbitRadius,
  circleDiameter,
  orbitCount2,
  orbitRadius2,
  circleDiameter2,
}) {
  const scrollY = useMotionValue(0);

  // ─── Entrance phase rotation (time-based, plays once) ───────
  const entranceRotate1 = useMotionValue(0);
  const entranceRotate2 = useMotionValue(0);

  useEffect(() => {
    // Animate entrance rotation once on mount
    const controls1 = animate(entranceRotate1, 230, {
      duration: 9,
      delay: 2.8,
      ease: [0.22, 1, 0.36, 1], // strong ease-out → gradual stop
    });

    const controls2 = animate(entranceRotate2, 280, {
      duration: 9,
      delay: 2.8,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      controls1.stop();
      controls2.stop();
    };
  }, [entranceRotate1, entranceRotate2]);

  // ─── Scroll-driven values ────────────────────────────────────
  useLenis((lenis) => {
    scrollY.set(lenis.scroll);
  });

  const scrollSpring = useSpring(scrollY, {
    stiffness: 105,
    damping: 14,
    mass: 0.35,
  });

  // Scroll-driven rotation (starts from 0 again, or you can offset it)
  const scrollRotate1 = useTransform(scrollSpring, SCROLL_RANGE, [0, 80]);
  const scrollRotate2 = useTransform(scrollSpring, SCROLL_RANGE, [0, 120]);

  // Final rotation = entrance + scroll-driven
  const finalRotate1 = useTransform([entranceRotate1, scrollRotate1], ([e, s]) => e + s);
  const finalRotate2 = useTransform([entranceRotate2, scrollRotate2], ([e, s]) => e + s);

  // Other scroll-driven values
  const radius1 = useTransform(scrollSpring, SCROLL_RANGE, [orbitRadius, orbitRadius + 550]);
  const radius2 = useTransform(scrollSpring, SCROLL_RANGE, [orbitRadius2, orbitRadius2 + 580]);
  const blur1 = useTransform(scrollSpring, SCROLL_RANGE, [0, 20]);
  const blur2 = useTransform(scrollSpring, SCROLL_RANGE, [4, 36]);
  const diameter1 = useTransform(scrollSpring, SCROLL_RANGE, [circleDiameter, circleDiameter + 150]);
  const diameter2 = useTransform(scrollSpring, SCROLL_RANGE, [circleDiameter2, circleDiameter2 + 250]);

  const width1 = useTransform(diameter1, (d) => `${d}px`);
  const height1 = useTransform(diameter1, (d) => `${d}px`);
  const width2 = useTransform(diameter2, (d) => `${d}px`);
  const height2 = useTransform(diameter2, (d) => `${d}px`);
  const filter1 = useTransform(blur1, (b) => (b > 0 ? `blur(${b}px)` : "none"));
  const filter2 = useTransform(blur2, (b) => `blur(${b}px)`);

  return (
    <>
      {/* Orbit 1 */}
      <motion.div
        className="absolute left-1/2 top-1/2 pointer-events-none z-20"
        initial={{ scale: 3.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 2.8,
          duration: 2.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className="relative origin-center w-0 h-0 z-10"
          style={{ rotate: finalRotate1 }}
        >
          {Array.from({ length: orbitCount }).map((_, i) => (
            <OrbitCircleItem
              key={`orbit1-${i}`}
              index={i}
              count={orbitCount}
              radius={radius1}
              width={width1}
              height={height1}
              filter={filter1}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Orbit 2 – same logic */}
      <motion.div
        className="absolute left-1/2 top-1/2 pointer-events-none z-20"
        initial={{ scale: 3.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 2.8,
          duration: 2.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className="relative origin-center w-0 h-0 z-10"
          style={{ rotate: finalRotate2 }}
        >
          {Array.from({ length: orbitCount2 }).map((_, i) => (
            <OrbitCircleItem
              key={`orbit2-${i}`}
              index={i}
              count={orbitCount2}
              radius={radius2}
              width={width2}
              height={height2}
              filter={filter2}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}

export default OrbitingCircles;
