"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import HeroSection from "@/components/HeroSection/HeroSection";
import DescriptionSection from "@/components/DescriptionSection/DescriptionSection";
import MyOfferings from "@/components/MyOfferings/MyOfferings";
import { useIsMobile, useHasMounted } from "@/hooks/useIsMobile";
import { useNearestSectionSnap } from "@/hooks/useMobileSnap";

export default function Home() {
  const mounted = useHasMounted();
  const isCompact = useIsMobile();
  if (!mounted) {
    return <div className="min-h-dvh bg-black" aria-hidden />;
  }
  if (isCompact) return <HomeMobile />;
  return <HomeDesktop />;
}

function HomeMobile() {
  useNearestSectionSnap(true);

  return (
    <div className="relative">
      <div id="home" data-snap className="h-lvh min-h-[100lvh] w-full shrink-0 snap-start">
        <HeroSection active />
      </div>
      <DescriptionSection />
      <MyOfferings />
    </div>
  );
}

function HomeDesktop() {
  const containerRef = useRef(null);
  const [heroActive, setHeroActive] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setHeroActive(value < 0.45);
  });

  const heroY = useTransform(scrollYProgress, (v) => v * -450);
  const heroScale = useTransform(scrollYProgress, (v) => 1 - v * 0.05);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <div ref={containerRef} className="relative">
      <div id="home" className="sticky top-0 z-10 h-screen">
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="h-full"
        >
          <HeroSection active={heroActive} />
        </motion.div>
      </div>

      <div className="relative z-20">
        <DescriptionSection />
      </div>

      <div className="relative z-30 -mt-[100vh]">
        <MyOfferings />
      </div>
    </div>
  );
}
