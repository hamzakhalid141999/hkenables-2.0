"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  /** Orbits + mouse skew — off as soon as About covers the hero. */
  const [heroActive, setHeroActive] = useState(true);
  /** Full hero tree — unmounted once About owns the screen (orbits included). */
  const [mountHero, setMountHero] = useState(true);
  /** About content — unmounted once Offerings owns the screen. */
  const [mountAbout, setMountAbout] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const about = document.getElementById("aboutMe");
    const offerings = document.getElementById("myOfferings");
    if (!about || !offerings) return undefined;

    let aboutCovered = false;
    let offeringsCovered = false;

    const sync = () => {
      // Stop orbits / hero work the moment About scrolls over the sticky hero.
      setHeroActive(!aboutCovered && !offeringsCovered);
      setMountHero(!aboutCovered && !offeringsCovered);
      setMountAbout(!offeringsCovered);
    };

    const ioAbout = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const vh = window.innerHeight || 1;
        const top = entry.boundingClientRect.top;
        if (!aboutCovered && entry.isIntersecting && top < vh * 0.45) {
          aboutCovered = true;
          sync();
        } else if (aboutCovered && top > vh * 0.7) {
          aboutCovered = false;
          sync();
        }
      },
      { threshold: [0, 0.05, 0.15, 0.3, 0.5] }
    );

    const ioOfferings = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const vh = window.innerHeight || 1;
        const top = entry.boundingClientRect.top;
        if (!offeringsCovered && entry.isIntersecting && top < vh * 0.28) {
          offeringsCovered = true;
          sync();
        } else if (offeringsCovered && (!entry.isIntersecting || top > vh * 0.55)) {
          offeringsCovered = false;
          sync();
        }
      },
      { threshold: [0, 0.05, 0.15, 0.3, 0.5] }
    );

    ioAbout.observe(about);
    ioOfferings.observe(offerings);
    return () => {
      ioAbout.disconnect();
      ioOfferings.disconnect();
    };
  }, []);

  const heroY = useTransform(scrollYProgress, (v) => v * -450);
  const heroScale = useTransform(scrollYProgress, (v) => 1 - v * 0.05);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <div ref={containerRef} className="relative">
      <div id="home" className="sticky top-0 z-10 h-screen bg-black">
        {mountHero ? (
          <motion.div
            style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
            className="h-full"
          >
            <HeroSection active={heroActive} />
          </motion.div>
        ) : null}
      </div>

      <div className="relative z-20">
        <DescriptionSection mount={mountAbout} />
      </div>

      <div className="relative z-30 -mt-[100vh]">
        <MyOfferings />
      </div>
    </div>
  );
}
