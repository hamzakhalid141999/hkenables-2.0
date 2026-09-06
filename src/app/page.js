"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import HeroSection from "@/components/HeroSection/HeroSection";
import DescriptionSection from "@/components/DescriptionSection/DescriptionSection";
import MyOfferings from "@/components/MyOfferings/MyOfferings";

export default function Home() {
  const containerRef = useRef(null);
  const offeringsRef = useRef(null);
  const isCompactRef = useRef(false);
  const [heroActive, setHeroActive] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      isCompactRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    // Freeze heavy hero work once About/Offerings cover it
    setHeroActive(value < 0.45);
  });

  const heroY = useTransform(
    scrollYProgress,
    (v) => v * (isCompactRef.current ? -280 : -450)
  );
  const heroScale = useTransform(
    scrollYProgress,
    (v) => 1 - v * (isCompactRef.current ? 0.03 : 0.05)
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <div ref={containerRef} className="relative">
      {/* Section 1 — pinned underlayer */}
      <div className="sticky top-0 z-10 h-screen">
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="h-full"
        >
          <HeroSection active={heroActive} />
        </motion.div>
      </div>

      {/* Section 2 — scrolls up over Hero, then stays pinned during Offerings overlap */}
      <div className="relative z-20">
        <DescriptionSection />
      </div>

      {/* Section 3 — scrolls up over About Me */}
      <div ref={offeringsRef} className="relative z-30 -mt-[100vh]">
        <MyOfferings />
      </div>
    </div>
  );
}
