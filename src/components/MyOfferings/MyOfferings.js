"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import OfferingCard from "./OfferingCard";
import SaasBuildCard from "./SaasBuildCard";
import SaasOfferCopy from "./SaasOfferCopy";
import FullStackBuildCard from "./FullStackBuildCard";
import FullStackOfferCopy from "./FullStackOfferCopy";
import WebsiteRevampBuildCard from "./WebsiteRevampBuildCard";
import WebsiteRevampOfferCopy from "./WebsiteRevampOfferCopy";
import MyProjects, { PROJECT_COUNT } from "@/components/MyProjects/MyProjects";

/** Duration (s) of the programmatic snap scroll animation. */
const SNAP_DURATION = 1.05;
/** Extra duration per skipped project when jumping far. */
const SNAP_JUMP_BONUS = 0.14;
/** Ignore trackpad noise smaller than this (px). */
const WHEEL_DELTA_MIN = 6;
/** Skip snapping if already within this fraction of the target center. */
const SNAP_DEADZONE = 0.004;

/** cubic ease-in-out: slow → fast → slow */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const MAX_TOP_RADIUS = 1000;
/** Cap for the curtain peel’s top-right / bottom-right corner rounding (px). */
const MAX_CURTAIN_RADIUS = 200;
const OFFERINGS_SCROLL_VH = 12;
const CURTAIN_SCROLL_VH = 1.35;
/** Landing beat: heading settles + intro copy appears before the gallery. */
const PROJECTS_INTRO_SCROLL_VH = 1.25;
const PROJECTS_SCROLL_VH = 10;
const TOTAL_SCROLL_VH =
  OFFERINGS_SCROLL_VH +
  CURTAIN_SCROLL_VH +
  PROJECTS_INTRO_SCROLL_VH +
  PROJECTS_SCROLL_VH;
const OFFERINGS_END = OFFERINGS_SCROLL_VH / TOTAL_SCROLL_VH;
const CURTAIN_END =
  (OFFERINGS_SCROLL_VH + CURTAIN_SCROLL_VH) / TOTAL_SCROLL_VH;
/** End of intro / start of project snap-gallery. */
const INTRO_END =
  (OFFERINGS_SCROLL_VH + CURTAIN_SCROLL_VH + PROJECTS_INTRO_SCROLL_VH) /
  TOTAL_SCROLL_VH;
const GALLERY_START = INTRO_END;

// Pin progress phases (0→1 across the offerings portion only)
const SAAS_CARD_END = 0.14;
const SAAS_EXIT_END = 0.2;
const SAAS_COPY_END = 0.3;
const SAAS_COPY_EXIT_END = 0.34;
const FULL_STACK_START = 0.32;
const FULL_STACK_CARD_END = 0.48;
const FULL_STACK_EXIT_END = 0.54;
const FULL_STACK_COPY_END = 0.64;
const FULL_STACK_COPY_EXIT_END = 0.68;
const REVAMP_START = 0.66;
const REVAMP_CARD_END = 0.84;
const REVAMP_EXIT_END = 0.9;

function GrainLayers() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#141414]/80" />
      <div
        className="pointer-events-none absolute inset-0 opacity-75 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0.95 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "140px 140px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </>
  );
}

function OfferingSlot({ title, progress, exitProgress, number, side, children }) {
  return (
    <OfferingCard
      progress={progress}
      exitProgress={exitProgress}
      title={title}
      number={number}
      side={side}
    >
      {children}
    </OfferingCard>
  );
}

export default function MyOfferings() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const trackHeightVh = TOTAL_SCROLL_VH * 100;

  const { scrollYProgress: entranceProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: pinProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const pinProgressRef = useRef(0);
  useMotionValueEvent(pinProgress, "change", (value) => {
    pinProgressRef.current = value;
  });

  const isSnappingRef = useRef(false);
  /** Project index we last settled on. */
  const lockedProjectRef = useRef(0);
  const lenisRef = useRef(null);
  /** Live nav API used by gallery UI controls (and keyboard). */
  const navApiRef = useRef({
    goTo: () => false,
    goNext: () => false,
    goPrev: () => false,
  });

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  useLenis((lenis) => {
    lenisRef.current = lenis;
  });

  /**
   * Snap immediately on scroll intent inside the project gallery.
   * UI controls call the same snap API via navApiRef.
   */
  useEffect(() => {
    const galleryLocal = (pin) =>
      Math.min(1, Math.max(0, (pin - GALLERY_START) / (1 - GALLERY_START)));

    const isInIntro = (pin) =>
      pin > CURTAIN_END + 0.001 && pin < GALLERY_START - 0.001;
    const isInGallery = (pin) => pin >= GALLERY_START - 0.001 && pin < 0.999;
    const introReady = (pin) => {
      const span = GALLERY_START - CURTAIN_END;
      if (span <= 0) return true;
      return (pin - CURTAIN_END) / span >= 0.45;
    };

    const pinToScrollY = (targetPin) => {
      const trackEl = trackRef.current;
      if (!trackEl) return null;
      const rect = trackEl.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollRange = trackEl.offsetHeight - window.innerHeight;
      return trackTop + targetPin * scrollRange;
    };

    const scrollYForIndex = (index) => {
      const targetLocal = (index + 0.5) / PROJECT_COUNT;
      const targetPin = GALLERY_START + targetLocal * (1 - GALLERY_START);
      return pinToScrollY(targetPin);
    };

    const animateToScrollY = (targetScrollY, { duration, onSettled } = {}) => {
      const lenis = lenisRef.current;
      if (!lenis || targetScrollY == null) return false;

      isSnappingRef.current = true;
      lenis.stop();
      lenis.start();
      lenis.scrollTo(targetScrollY, {
        duration: duration ?? SNAP_DURATION,
        easing: easeInOutCubic,
        force: true,
        lock: true,
        onComplete: () => {
          isSnappingRef.current = false;
          onSettled?.();
        },
      });
      window.setTimeout(() => {
        isSnappingRef.current = false;
      }, (duration ?? SNAP_DURATION) * 1000 + 120);
      return true;
    };

    const snapToIndex = (index, { fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;

      const targetIndex = Math.min(PROJECT_COUNT - 1, Math.max(0, index));
      const pin = pinProgressRef.current;

      if (pin < CURTAIN_END + 0.001 && !fromUi) return false;

      const local = isInGallery(pin) ? galleryLocal(pin) : -1;
      const targetLocal = (targetIndex + 0.5) / PROJECT_COUNT;
      if (
        isInGallery(pin) &&
        targetIndex === lockedProjectRef.current &&
        Math.abs(targetLocal - local) < SNAP_DEADZONE
      ) {
        return false;
      }

      const targetScrollY = scrollYForIndex(targetIndex);
      if (targetScrollY == null) return false;

      const distance = Math.abs(targetIndex - lockedProjectRef.current);
      const duration = Math.min(
        1.55,
        SNAP_DURATION + Math.max(0, distance - 1) * SNAP_JUMP_BONUS
      );

      lockedProjectRef.current = targetIndex;
      setActiveProjectIndex(targetIndex);
      return animateToScrollY(targetScrollY, { duration });
    };

    const snapToIntroEnd = ({ fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;
      const targetScrollY = pinToScrollY(GALLERY_START - 0.002);
      const ok = animateToScrollY(targetScrollY, {
        onSettled: () => {
          lockedProjectRef.current = 0;
          setActiveProjectIndex(0);
        },
      });
      if (ok) lockedProjectRef.current = 0;
      return ok;
    };

    navApiRef.current = {
      goTo: (index) => snapToIndex(index, { fromUi: true }),
      goNext: () => {
        const pin = pinProgressRef.current;
        if (isInIntro(pin)) return snapToIndex(0, { fromUi: true });
        return snapToIndex(lockedProjectRef.current + 1, { fromUi: true });
      },
      goPrev: () => {
        const pin = pinProgressRef.current;
        if (!isInGallery(pin)) return false;
        if (lockedProjectRef.current === 0) {
          return snapToIntroEnd({ fromUi: true });
        }
        return snapToIndex(lockedProjectRef.current - 1, { fromUi: true });
      },
    };

    const trySnapFromDelta = (rawDelta) => {
      if (isSnappingRef.current) return true;
      if (Math.abs(rawDelta) < WHEEL_DELTA_MIN) return false;

      const pin = pinProgressRef.current;
      const direction = rawDelta > 0 ? 1 : -1;

      if (isInIntro(pin)) {
        if (direction > 0 && introReady(pin)) {
          return snapToIndex(0);
        }
        return false;
      }

      // While still entering the gallery (before the first project’s mid),
      // lock onto project 0 instead of overshooting. Threshold scales with
      // project count so settled project-0 doesn’t get stuck re-snapping.
      const firstSettle = 0.5 / PROJECT_COUNT;
      if (
        isInGallery(pin) &&
        direction > 0 &&
        galleryLocal(pin) < firstSettle - SNAP_DEADZONE
      ) {
        lockedProjectRef.current = 0;
        return snapToIndex(0);
      }

      if (!isInGallery(pin)) return false;

      if (direction < 0 && lockedProjectRef.current === 0) {
        return snapToIntroEnd();
      }

      const next = lockedProjectRef.current + direction;
      if (next < 0 || next >= PROJECT_COUNT) return false;

      return snapToIndex(next);
    };

    const onWheel = (event) => {
      const pin = pinProgressRef.current;
      const inSnapZone =
        isInIntro(pin) || isInGallery(pin) || isSnappingRef.current;
      if (!inSnapZone) return;

      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (trySnapFromDelta(delta)) {
        event.preventDefault();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event) => {
      const pin = pinProgressRef.current;
      const inSnapZone =
        isInIntro(pin) || isInGallery(pin) || isSnappingRef.current;
      if (!inSnapZone) return;
      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }
      const y = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - y;
      if (Math.abs(delta) < 24) return;
      if (trySnapFromDelta(delta)) {
        event.preventDefault();
        touchStartY = y;
      }
    };

    const onKeyDown = (event) => {
      const pin = pinProgressRef.current;
      if (!isInIntro(pin) && !isInGallery(pin)) return;

      if (/^[1-9]$/.test(event.key)) {
        const idx = Number(event.key) - 1;
        if (idx < PROJECT_COUNT && snapToIndex(idx, { fromUi: true })) {
          event.preventDefault();
        }
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        if (isInIntro(pin)) {
          if (introReady(pin) && snapToIndex(0)) event.preventDefault();
        } else if (snapToIndex(lockedProjectRef.current + 1)) {
          event.preventDefault();
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        if (isInGallery(pin) && lockedProjectRef.current === 0) {
          if (snapToIntroEnd()) event.preventDefault();
        } else if (snapToIndex(lockedProjectRef.current - 1)) {
          event.preventDefault();
        }
      } else if (event.key === "Home") {
        if (snapToIndex(0, { fromUi: true })) event.preventDefault();
      } else if (event.key === "End") {
        if (snapToIndex(PROJECT_COUNT - 1, { fromUi: true })) {
          event.preventDefault();
        }
      }
    };

    const syncLockFromProgress = () => {
      if (isSnappingRef.current) return;
      const pin = pinProgressRef.current;
      if (!isInGallery(pin)) return;
      const local = galleryLocal(pin);
      const idx = Math.min(
        PROJECT_COUNT - 1,
        Math.max(0, Math.round(local * PROJECT_COUNT - 0.5))
      );
      lockedProjectRef.current = idx;
      setActiveProjectIndex((prev) => (prev === idx ? prev : idx));
    };
    const progressInterval = window.setInterval(syncLockFromProgress, 120);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearInterval(progressInterval);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const goToProject = useCallback((index) => {
    navApiRef.current.goTo(index);
  }, []);
  const goToNextProject = useCallback(() => {
    navApiRef.current.goNext();
  }, []);
  const goToPrevProject = useCallback(() => {
    navApiRef.current.goPrev();
  }, []);

  const entranceSpring = useSpring(entranceProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.65,
  });

  const headingX = useTransform(entranceSpring, [0, 1], ["-48vw", "50vw"]);
  const headingOpacity = useTransform(entranceSpring, [0.75, 1], [1, 0]);

  const topRadius = useTransform(entranceSpring, [0, 1], [MAX_TOP_RADIUS, 0]);

  const offeringsProgress = useTransform(
    pinProgress,
    [0, OFFERINGS_END],
    [0, 1],
    { clamp: true }
  );
  const curtainProgress = useTransform(
    pinProgress,
    [OFFERINGS_END, CURTAIN_END],
    [0, 1],
    { clamp: true }
  );
  const introProgress = useTransform(
    pinProgress,
    [CURTAIN_END, INTRO_END],
    [0, 1],
    { clamp: true }
  );
  const projectsProgress = useTransform(
    pinProgress,
    [INTRO_END, 1],
    [0, 1],
    { clamp: true }
  );

  const pinSpring = useSpring(offeringsProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  const curtainSpring = useSpring(curtainProgress, {
    stiffness: 85,
    damping: 30,
    mass: 0.5,
  });

  const curtainX = useTransform(curtainSpring, [0, 1], ["0%", "-105%"]);
  const curtainRightRadius = useTransform(curtainSpring, (t) => {
    const p = Math.min(1, Math.max(0, t));
    const eased = 1 - Math.pow(1 - p, 2);
    return eased * MAX_CURTAIN_RADIUS;
  });

  const borderRadius = useTransform(
    [topRadius, curtainRightRadius],
    ([top, right]) => `${top}px ${Math.max(top, right)}px ${right}px 0`
  );

  const saasCardProgress = useTransform(pinSpring, [0, SAAS_CARD_END], [0, 1], {
    clamp: true,
  });
  const saasExitProgress = useTransform(
    pinSpring,
    [SAAS_CARD_END, SAAS_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const copyProgress = useTransform(
    pinSpring,
    [SAAS_EXIT_END, SAAS_COPY_END],
    [0, 1],
    { clamp: true }
  );
  const copyExitOpacity = useTransform(
    pinSpring,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [1, 0]
  );
  const copyExitY = useTransform(
    pinSpring,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [0, -24]
  );
  const copyExitBlur = useTransform(
    pinSpring,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [0, 10]
  );
  const copyExitFilter = useTransform(copyExitBlur, (value) => `blur(${value}px)`);

  const fullStackProgress = useTransform(
    pinSpring,
    [FULL_STACK_START, FULL_STACK_CARD_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackExitProgress = useTransform(
    pinSpring,
    [FULL_STACK_CARD_END, FULL_STACK_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackCopyProgress = useTransform(
    pinSpring,
    [FULL_STACK_EXIT_END, FULL_STACK_COPY_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackCopyExitOpacity = useTransform(
    pinSpring,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [1, 0]
  );
  const fullStackCopyExitY = useTransform(
    pinSpring,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [0, -24]
  );
  const fullStackCopyExitBlur = useTransform(
    pinSpring,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [0, 10]
  );
  const fullStackCopyExitFilter = useTransform(
    fullStackCopyExitBlur,
    (value) => `blur(${value}px)`
  );

  const revampProgress = useTransform(
    pinSpring,
    [REVAMP_START, REVAMP_CARD_END],
    [0, 1],
    { clamp: true }
  );
  const revampExitProgress = useTransform(
    pinSpring,
    [REVAMP_CARD_END, REVAMP_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const revampCopyProgress = useTransform(
    pinSpring,
    [REVAMP_EXIT_END, 1],
    [0, 1],
    { clamp: true }
  );

  return (
    <section id="myOfferings" ref={sectionRef} className="relative z-40 w-full">
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ height: `${trackHeightVh}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <MyProjects
            curtainProgress={curtainSpring}
            introProgress={introProgress}
            projectsProgress={projectsProgress}
            activeProjectIndex={activeProjectIndex}
            onGoToProject={goToProject}
            onNextProject={goToNextProject}
            onPrevProject={goToPrevProject}
          />

          <motion.div
            className="relative z-10 h-full w-full overflow-hidden bg-black will-change-transform"
            style={{ x: curtainX, borderRadius }}
          >
            <GrainLayers />

            <div className="relative z-10 overflow-hidden px-5 pt-14 sm:px-8 md:px-12 lg:px-16 md:pt-16">
              <motion.h2
                style={{ x: headingX, opacity: headingOpacity }}
                className="whitespace-nowrap font-climate-crisis text-[clamp(48px,10vw,120px)] uppercase leading-none tracking-tight text-white/90"
              >
                MY OFFERINGS
              </motion.h2>
            </div>

            <div className="absolute inset-0 z-20">
              <OfferingSlot
                title="SaaS Landing Page"
                number={1}
                side="left"
                progress={saasCardProgress}
                exitProgress={saasExitProgress}
              >
                <SaasBuildCard progress={saasCardProgress} />
              </OfferingSlot>
            </div>

            <motion.div
              style={{
                opacity: copyExitOpacity,
                y: copyExitY,
                filter: copyExitFilter,
              }}
              className="absolute inset-0 z-30"
            >
              <SaasOfferCopy progress={copyProgress} />
            </motion.div>

            <div className="absolute inset-0 z-40">
              <OfferingSlot
                title="Full-Stack Development"
                number={2}
                side="right"
                progress={fullStackProgress}
                exitProgress={fullStackExitProgress}
              >
                <FullStackBuildCard progress={fullStackProgress} />
              </OfferingSlot>
            </div>

            <motion.div
              style={{
                opacity: fullStackCopyExitOpacity,
                y: fullStackCopyExitY,
                filter: fullStackCopyExitFilter,
              }}
              className="absolute inset-0 z-50"
            >
              <FullStackOfferCopy progress={fullStackCopyProgress} />
            </motion.div>

            <div className="absolute inset-0 z-60">
              <OfferingSlot
                title="Website Revamps"
                number={3}
                side="left"
                progress={revampProgress}
                exitProgress={revampExitProgress}
              >
                <WebsiteRevampBuildCard progress={revampProgress} />
              </OfferingSlot>
            </div>

            <div className="absolute inset-0 z-70">
              <WebsiteRevampOfferCopy
                progress={revampCopyProgress}
                curtainProgress={curtainSpring}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
