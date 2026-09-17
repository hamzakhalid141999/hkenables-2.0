"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
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
import { useIsMobile, useHasMounted } from "@/hooks/useIsMobile";
import MyOfferingsMobile from "./MyOfferingsMobile";

/** Duration (s) of the programmatic snap scroll animation. */
const SNAP_DURATION = 0.78;
/** Faster snaps on touch — less “coasting” between projects. */
const SNAP_DURATION_MOBILE = 0.42;
/** Extra duration per skipped project when jumping far. */
const SNAP_JUMP_BONUS = 0.1;
/** Ignore trackpad noise smaller than this (px). */
const WHEEL_DELTA_MIN = 6;
/** Skip snapping if already within this fraction of the target center. */
const SNAP_DEADZONE = 0.004;

/** cubic ease-in-out: slow → fast → slow */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const MAX_TOP_RADIUS = 1000;
/** Entrance rounding on small screens — 1000px reads as a huge pill on narrow viewports. */
const MOBILE_TOP_RADIUS = 140;
/** Cap for the curtain peel’s top-right / bottom-right corner rounding (px). */
const MAX_CURTAIN_RADIUS = 200;
const OFFERINGS_SCROLL_VH = 12;
const CURTAIN_SCROLL_VH = 1.35;
/** Landing beat: heading settles + intro copy appears before the gallery. */
const PROJECTS_INTRO_SCROLL_VH = 1.25;
const PROJECTS_SCROLL_VH = 10;
/** Extra pin distance to unveil the post-gallery footer (matches ~80vh lift). */
const FOOTER_SCROLL_VH = 0.85;
const MOBILE_OFFERING_BEATS = 6;
/** One short snap per card/copy beat — no 12-screen scrub. */
const MOBILE_OFFERINGS_VH = 4.2;
const MOBILE_CURTAIN_VH = 0.65;
const MOBILE_INTRO_VH = 0.65;
const MOBILE_PROJECTS_VH = 5.6;
const MOBILE_FOOTER_VH = 0.75;
const TOTAL_SCROLL_VH =
  OFFERINGS_SCROLL_VH +
  CURTAIN_SCROLL_VH +
  PROJECTS_INTRO_SCROLL_VH +
  PROJECTS_SCROLL_VH +
  FOOTER_SCROLL_VH;
const OFFERINGS_END = OFFERINGS_SCROLL_VH / TOTAL_SCROLL_VH;
const CURTAIN_END =
  (OFFERINGS_SCROLL_VH + CURTAIN_SCROLL_VH) / TOTAL_SCROLL_VH;
/** End of intro / start of project snap-gallery. */
const INTRO_END =
  (OFFERINGS_SCROLL_VH + CURTAIN_SCROLL_VH + PROJECTS_INTRO_SCROLL_VH) /
  TOTAL_SCROLL_VH;
const GALLERY_START = INTRO_END;
/** End of project snaps / start of footer unveil. */
const GALLERY_END =
  (OFFERINGS_SCROLL_VH +
    CURTAIN_SCROLL_VH +
    PROJECTS_INTRO_SCROLL_VH +
    PROJECTS_SCROLL_VH) /
  TOTAL_SCROLL_VH;

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
  const isMobile = useIsMobile();
  const mounted = useHasMounted();
  if (!mounted) return <div className="min-h-dvh bg-[#141414]" aria-hidden />;
  if (isMobile) return <MyOfferingsMobile />;
  return <MyOfferingsDesktop />;
}

function MyOfferingsDesktop() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isMobile = false;

  const offeringsVh = isMobile ? MOBILE_OFFERINGS_VH : OFFERINGS_SCROLL_VH;
  const curtainVh = isMobile ? MOBILE_CURTAIN_VH : CURTAIN_SCROLL_VH;
  const introVh = isMobile ? MOBILE_INTRO_VH : PROJECTS_INTRO_SCROLL_VH;
  const projectsVh = isMobile ? MOBILE_PROJECTS_VH : PROJECTS_SCROLL_VH;
  const footerVh = isMobile ? MOBILE_FOOTER_VH : FOOTER_SCROLL_VH;
  const totalVh = offeringsVh + curtainVh + introVh + projectsVh + footerVh;
  const offeringsEnd = offeringsVh / totalVh;
  const curtainEnd = (offeringsVh + curtainVh) / totalVh;
  const introEnd = (offeringsVh + curtainVh + introVh) / totalVh;
  const galleryStart = introEnd;
  const galleryEnd =
    (offeringsVh + curtainVh + introVh + projectsVh) / totalVh;
  const trackHeightVh = totalVh * 100;

  const frozenOne = useMotionValue(1);
  const frozenZero = useMotionValue(0);

  const layoutRef = useRef({});
  layoutRef.current = {
    isMobile,
    offeringsEnd,
    curtainEnd,
    introEnd,
    galleryStart,
    galleryEnd,
    offeringBeats: MOBILE_OFFERING_BEATS,
  };

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
  const lockedOfferingBeatRef = useRef(0);
  const lenisRef = useRef(null);
  /** Live nav API used by gallery UI controls (and keyboard). */
  const navApiRef = useRef({
    goTo: () => false,
    goNext: () => false,
    goPrev: () => false,
  });

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [offeringBeat, setOfferingBeat] = useState(0);
  /** Mobile: only mount offering beats near the current pin progress. */
  const [mobileMount, setMobileMount] = useState({
    saas: true,
    fullstack: false,
    revamp: false,
  });
  /** Mobile: don't mount MyProjects until the curtain is about to peel. */
  const [projectsReady, setProjectsReady] = useState(false);

  useLenis((lenis) => {
    lenisRef.current = lenis;
  });

  /**
   * Snap immediately on scroll intent inside the project gallery.
   * UI controls call the same snap API via navApiRef.
   */
  useEffect(() => {
    const galleryLocal = (pin) => {
      const { galleryStart, galleryEnd } = layoutRef.current;
      const span = galleryEnd - galleryStart;
      if (span <= 0) return 0;
      return Math.min(1, Math.max(0, (pin - galleryStart) / span));
    };

    const isInIntro = (pin) => {
      const { curtainEnd, galleryStart } = layoutRef.current;
      return pin > curtainEnd + 0.001 && pin < galleryStart - 0.001;
    };
    const isInGallery = (pin) => {
      const { galleryStart, galleryEnd } = layoutRef.current;
      return pin >= galleryStart - 0.001 && pin < galleryEnd - 0.002;
    };
    const isInFooter = (pin) => pin >= layoutRef.current.galleryEnd - 0.002;
    const isInOfferings = (pin) =>
      layoutRef.current.isMobile && pin < layoutRef.current.offeringsEnd - 0.001;
    const introReady = (pin) => {
      const { curtainEnd, galleryStart } = layoutRef.current;
      const span = galleryStart - curtainEnd;
      if (span <= 0) return true;
      return (pin - curtainEnd) / span >= 0.45;
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
      const { galleryStart, galleryEnd } = layoutRef.current;
      const targetLocal = (index + 0.5) / PROJECT_COUNT;
      const targetPin =
        galleryStart + targetLocal * (galleryEnd - galleryStart);
      return pinToScrollY(targetPin);
    };

    const snapDuration = () =>
      isMobile ? SNAP_DURATION_MOBILE : SNAP_DURATION;

    const animateToScrollY = (targetScrollY, { duration, onSettled } = {}) => {
      const lenis = lenisRef.current;
      if (!lenis || targetScrollY == null) return false;

      isSnappingRef.current = true;
      lenis.stop();
      lenis.start();
      lenis.scrollTo(targetScrollY, {
        duration: duration ?? snapDuration(),
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
      }, (duration ?? snapDuration()) * 1000 + 120);
      return true;
    };

    const snapToIndex = (index, { fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;

      const targetIndex = Math.min(PROJECT_COUNT - 1, Math.max(0, index));
      const pin = pinProgressRef.current;

      if (pin < layoutRef.current.curtainEnd + 0.001 && !fromUi) return false;

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
      const base = snapDuration();
      const duration = Math.min(
        isMobile ? 0.75 : 1.15,
        base + Math.max(0, distance - 1) * SNAP_JUMP_BONUS
      );

      lockedProjectRef.current = targetIndex;
      setActiveProjectIndex(targetIndex);
      return animateToScrollY(targetScrollY, { duration });
    };

    const snapToIntroEnd = ({ fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;
      const targetScrollY = pinToScrollY(layoutRef.current.galleryStart - 0.002);
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
        if (isInFooter(pin)) return false;
        if (lockedProjectRef.current >= PROJECT_COUNT - 1) {
          const targetScrollY = pinToScrollY(1);
          return animateToScrollY(targetScrollY, { duration: snapDuration() });
        }
        return snapToIndex(lockedProjectRef.current + 1, { fromUi: true });
      },
      goPrev: () => {
        const pin = pinProgressRef.current;
        if (isInFooter(pin)) {
          // Ease back to last project mid — longer so it feels like Lenis inertia
          lockedProjectRef.current = PROJECT_COUNT - 1;
          setActiveProjectIndex(PROJECT_COUNT - 1);
          return animateToScrollY(scrollYForIndex(PROJECT_COUNT - 1), {
            duration: isMobile ? 0.55 : 1.05,
          });
        }
        if (!isInGallery(pin)) return false;
        if (lockedProjectRef.current === 0) {
          return snapToIntroEnd({ fromUi: true });
        }
        return snapToIndex(lockedProjectRef.current - 1, { fromUi: true });
      },
    };

    const snapToOfferingBeat = (beat, { fromUi = false } = {}) => {
      const { offeringsEnd, offeringBeats } = layoutRef.current;
      const target = Math.min(offeringBeats - 1, Math.max(0, beat));
      if (isSnappingRef.current && !fromUi) return false;
      const targetPin = ((target + 0.5) / offeringBeats) * offeringsEnd;
      const targetScrollY = pinToScrollY(targetPin);
      if (targetScrollY == null) return false;
      lockedOfferingBeatRef.current = target;
      setOfferingBeat(target);
      return animateToScrollY(targetScrollY, { duration: snapDuration() });
    };

    const trySnapFromDelta = (rawDelta) => {
      if (isSnappingRef.current) return true;
      if (Math.abs(rawDelta) < WHEEL_DELTA_MIN) return false;

      const pin = pinProgressRef.current;
      const direction = rawDelta > 0 ? 1 : -1;
      const { offeringsEnd, introEnd, galleryStart, offeringBeats, isMobile: mobile } =
        layoutRef.current;

      if (mobile && pin < offeringsEnd - 0.001) {
        const local = pin / offeringsEnd;
        const beat = Math.min(
          offeringBeats - 1,
          Math.max(0, Math.round(local * offeringBeats - 0.5))
        );
        lockedOfferingBeatRef.current = beat;
        const next = beat + direction;
        if (next < 0) return false;
        if (next >= offeringBeats) {
          return animateToScrollY(pinToScrollY(introEnd - 0.002), {
            duration: snapDuration(),
          });
        }
        return snapToOfferingBeat(next);
      }

      if (mobile && pin >= offeringsEnd && pin < galleryStart) {
        if (direction > 0) return snapToIndex(0, { fromUi: true });
        return snapToOfferingBeat(offeringBeats - 1, { fromUi: true });
      }

      // Footer unveils/covers with free Lenis scroll — no project snaps here.
      if (isInFooter(pin)) {
        lockedProjectRef.current = PROJECT_COUNT - 1;
        return false;
      }

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

      const local = galleryLocal(pin);
      const lastMid = (PROJECT_COUNT - 0.5) / PROJECT_COUNT;

      // Returning from footer: free-scroll through the tail past last settle
      // until we reach the last project mid, then resume normal snaps.
      if (
        direction < 0 &&
        lockedProjectRef.current >= PROJECT_COUNT - 1 &&
        local > lastMid + SNAP_DEADZONE
      ) {
        lockedProjectRef.current = PROJECT_COUNT - 1;
        setActiveProjectIndex(PROJECT_COUNT - 1);
        return false;
      }

      if (direction < 0 && lockedProjectRef.current === 0) {
        return snapToIntroEnd();
      }

      const next = lockedProjectRef.current + direction;
      // Past the last project: release snap so the footer can unveil freely.
      if (next < 0 || next >= PROJECT_COUNT) return false;

      return snapToIndex(next);
    };

    const onWheel = (event) => {
      const pin = pinProgressRef.current;

      // Footer is free-scroll — never intercept, let Lenis carry inertia.
      if (isInFooter(pin) && !isSnappingRef.current) return;

      const inSnapZone =
        isInOfferings(pin) ||
        isInIntro(pin) ||
        isInGallery(pin) ||
        isSnappingRef.current;
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

      if (isInFooter(pin) && !isSnappingRef.current) return;

      const inSnapZone =
        isInOfferings(pin) ||
        isInIntro(pin) ||
        isInGallery(pin) ||
        isSnappingRef.current;
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
      if (!isInIntro(pin) && !isInGallery(pin) && !isInFooter(pin)) return;

      if (/^[1-9]$/.test(event.key)) {
        const idx = Number(event.key) - 1;
        if (idx < PROJECT_COUNT && snapToIndex(idx, { fromUi: true })) {
          event.preventDefault();
        }
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        if (isInFooter(pin)) return;
        if (isInIntro(pin)) {
          if (introReady(pin) && snapToIndex(0)) event.preventDefault();
        } else if (lockedProjectRef.current >= PROJECT_COUNT - 1) {
          const targetScrollY = pinToScrollY(1);
          if (animateToScrollY(targetScrollY)) event.preventDefault();
        } else if (snapToIndex(lockedProjectRef.current + 1)) {
          event.preventDefault();
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        if (isInFooter(pin)) {
          lockedProjectRef.current = PROJECT_COUNT - 1;
          setActiveProjectIndex(PROJECT_COUNT - 1);
          if (
            animateToScrollY(scrollYForIndex(PROJECT_COUNT - 1), {
              duration: 1.05,
            })
          ) {
            event.preventDefault();
          }
        } else if (isInGallery(pin) && lockedProjectRef.current === 0) {
          if (snapToIntroEnd()) event.preventDefault();
        } else if (
          isInGallery(pin) &&
          lockedProjectRef.current >= PROJECT_COUNT - 1 &&
          galleryLocal(pin) > (PROJECT_COUNT - 0.5) / PROJECT_COUNT + SNAP_DEADZONE
        ) {
          // Still in last-project tail after footer — ease to last mid first
          if (
            animateToScrollY(scrollYForIndex(PROJECT_COUNT - 1), {
              duration: 0.9,
            })
          ) {
            event.preventDefault();
          }
        } else if (snapToIndex(lockedProjectRef.current - 1)) {
          event.preventDefault();
        }
      } else if (event.key === "Home") {
        if (snapToIndex(0, { fromUi: true })) event.preventDefault();
      } else if (event.key === "End") {
        if (isInFooter(pin) || lockedProjectRef.current >= PROJECT_COUNT - 1) {
          const targetScrollY = pinToScrollY(1);
          if (animateToScrollY(targetScrollY, { duration: snapDuration() })) {
            event.preventDefault();
          }
        } else if (snapToIndex(PROJECT_COUNT - 1, { fromUi: true })) {
          event.preventDefault();
        }
      }
    };

    const syncLockFromProgress = () => {
      if (isSnappingRef.current) return;
      const pin = pinProgressRef.current;
      if (isInFooter(pin)) {
        lockedProjectRef.current = PROJECT_COUNT - 1;
        setActiveProjectIndex((prev) =>
          prev === PROJECT_COUNT - 1 ? prev : PROJECT_COUNT - 1
        );
        return;
      }
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
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearInterval(progressInterval);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile]);

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
  // Mobile: skip entrance spring — one less continuous solver
  const entranceDrive = isMobile ? entranceProgress : entranceSpring;

  const headingX = useTransform(entranceDrive, [0, 1], ["-48vw", "50vw"]);
  const headingOpacity = useTransform(entranceDrive, [0.75, 1], [1, 0]);

  const topRadius = useTransform(
    entranceDrive,
    [0, 1],
    [isMobile ? MOBILE_TOP_RADIUS : MAX_TOP_RADIUS, 0]
  );

  const offeringsProgress = useTransform(pinProgress, (p) => {
    const end = layoutRef.current.offeringsEnd || OFFERINGS_END;
    if (p <= 0) return 0;
    if (p >= end) return 1;
    return p / end;
  });
  const curtainProgress = useTransform(pinProgress, (p) => {
    const start = layoutRef.current.offeringsEnd || OFFERINGS_END;
    const end = layoutRef.current.curtainEnd || CURTAIN_END;
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / Math.max(end - start, 0.0001);
  });
  const introProgress = useTransform(pinProgress, (p) => {
    const start = layoutRef.current.curtainEnd || CURTAIN_END;
    const end = layoutRef.current.introEnd || INTRO_END;
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / Math.max(end - start, 0.0001);
  });
  const projectsProgress = useTransform(pinProgress, (p) => {
    const start = layoutRef.current.introEnd || INTRO_END;
    const end = layoutRef.current.galleryEnd || GALLERY_END;
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / Math.max(end - start, 0.0001);
  });
  const footerProgress = useTransform(pinProgress, (p) => {
    const start = layoutRef.current.galleryEnd || GALLERY_END;
    if (p <= start) return 0;
    return Math.min(1, (p - start) / Math.max(1 - start, 0.0001));
  });

  // Drive card/copy progress from raw scroll (Lenis already smooths).
  const pinDrive = offeringsProgress;

  useMotionValueEvent(pinDrive, "change", (p) => {
    if (!isMobile) return;
    const beat = Math.min(
      MOBILE_OFFERING_BEATS - 1,
      Math.max(0, Math.floor(p * MOBILE_OFFERING_BEATS))
    );
    lockedOfferingBeatRef.current = beat;
    setOfferingBeat((prev) => (prev === beat ? prev : beat));
  });

  useMotionValueEvent(pinProgress, "change", (p) => {
    if (!isMobile) return;
    if (p >= layoutRef.current.offeringsEnd - 0.08) setProjectsReady(true);
  });

  useEffect(() => {
    if (!isMobile) {
      setProjectsReady(true);
      return undefined;
    }
    setProjectsReady(false);
    setMobileMount({ saas: true, fullstack: false, revamp: false });
    setOfferingBeat(0);
    return undefined;
  }, [isMobile]);

  const curtainSpring = useSpring(curtainProgress, {
    stiffness: 100,
    damping: 32,
    mass: 0.45,
  });
  const curtainDrive = isMobile ? curtainProgress : curtainSpring;

  const curtainX = useTransform(curtainDrive, [0, 1], ["0%", "-105%"]);
  const curtainRightRadius = useTransform(curtainDrive, (t) => {
    const p = Math.min(1, Math.max(0, t));
    const eased = 1 - Math.pow(1 - p, 2);
    return eased * MAX_CURTAIN_RADIUS;
  });

  const borderRadius = useTransform(
    [topRadius, curtainRightRadius],
    ([top, right]) => `${top}px ${Math.max(top, right)}px ${right}px 0`
  );

  const mountSaas = !isMobile || mobileMount.saas;
  const mountFullStack = !isMobile || mobileMount.fullstack;
  const mountRevamp = !isMobile || mobileMount.revamp;

  const saasCardProgress = useTransform(pinDrive, [0, SAAS_CARD_END], [0, 1], {
    clamp: true,
  });
  const saasExitProgress = useTransform(
    pinDrive,
    [SAAS_CARD_END, SAAS_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const copyProgress = useTransform(
    pinDrive,
    [SAAS_EXIT_END, SAAS_COPY_END],
    [0, 1],
    { clamp: true }
  );
  const copyExitOpacity = useTransform(
    pinDrive,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [1, 0]
  );
  const copyExitY = useTransform(
    pinDrive,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [0, -24]
  );
  const copyExitBlur = useTransform(
    pinDrive,
    [SAAS_COPY_END, SAAS_COPY_EXIT_END],
    [0, 10]
  );
  const copyExitFilter = useTransform(copyExitBlur, (value) => `blur(${value}px)`);

  const fullStackProgress = useTransform(
    pinDrive,
    [FULL_STACK_START, FULL_STACK_CARD_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackExitProgress = useTransform(
    pinDrive,
    [FULL_STACK_CARD_END, FULL_STACK_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackCopyProgress = useTransform(
    pinDrive,
    [FULL_STACK_EXIT_END, FULL_STACK_COPY_END],
    [0, 1],
    { clamp: true }
  );
  const fullStackCopyExitOpacity = useTransform(
    pinDrive,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [1, 0]
  );
  const fullStackCopyExitY = useTransform(
    pinDrive,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [0, -24]
  );
  const fullStackCopyExitBlur = useTransform(
    pinDrive,
    [FULL_STACK_COPY_END, FULL_STACK_COPY_EXIT_END],
    [0, 10]
  );
  const fullStackCopyExitFilter = useTransform(
    fullStackCopyExitBlur,
    (value) => `blur(${value}px)`
  );

  const revampProgress = useTransform(
    pinDrive,
    [REVAMP_START, REVAMP_CARD_END],
    [0, 1],
    { clamp: true }
  );
  const revampExitProgress = useTransform(
    pinDrive,
    [REVAMP_CARD_END, REVAMP_EXIT_END],
    [0, 1],
    { clamp: true }
  );
  const revampCopyProgress = useTransform(
    pinDrive,
    [REVAMP_EXIT_END, 1],
    [0, 1],
    { clamp: true }
  );

  return (
    <section id="myOfferings" ref={sectionRef} className="relative z-40 w-full">
      <div
        ref={trackRef}
        data-offerings-track
        data-saas-land-pin={String(SAAS_CARD_END * 0.7 * offeringsEnd)}
        className="relative w-full"
        style={{ height: `${trackHeightVh}vh` }}
      >
        {/* Notch scroll markers — percentage along the pin track */}
        <div
          id="notch-saas"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-full"
          style={{ top: `${SAAS_CARD_END * 0.7 * offeringsEnd * 100}%` }}
        />
        <div
          id="notch-fullstack"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-full"
          style={{ top: `${FULL_STACK_START * offeringsEnd * 100}%` }}
        />
        <div
          id="notch-revamp"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-full"
          style={{ top: `${REVAMP_START * offeringsEnd * 100}%` }}
        />
        <div
          id="notch-projects"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-full"
          style={{ top: `${introEnd * 100}%` }}
        />
        <div
          id="contactMe"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-full"
          style={{ top: `${galleryEnd * 100}%` }}
        />
        <div className="sticky top-0 h-screen w-full overflow-hidden [touch-action:pan-y]">
          {projectsReady ? (
            <MyProjects
              curtainProgress={curtainDrive}
              introProgress={introProgress}
              projectsProgress={projectsProgress}
              footerProgress={footerProgress}
              activeProjectIndex={activeProjectIndex}
              onGoToProject={goToProject}
              onNextProject={goToNextProject}
              onPrevProject={goToPrevProject}
            />
          ) : (
            <div className="absolute inset-0 z-0 bg-white" aria-hidden />
          )}

          <motion.div
            className="pointer-events-none relative z-10 h-full w-full overflow-hidden bg-[#141414] will-change-transform"
            style={{
              x: curtainX,
              borderRadius: isMobile ? 0 : borderRadius,
            }}
          >
            <div className="relative z-10 overflow-hidden px-5 pt-14 sm:px-8 md:px-12 lg:px-16 md:pt-16">
              <motion.h2
        style={isMobile ? { opacity: headingOpacity } : { x: headingX, opacity: headingOpacity }}
                className="whitespace-nowrap font-ginto text-[clamp(28px,8vw,120px)] uppercase leading-none tracking-tight text-white/90"
              >
                MY OFFERINGS
              </motion.h2>
            </div>

            {isMobile ? (
              <>
                {offeringBeat === 0 ? (
                  <div className="pointer-events-none absolute inset-0 z-20">
                    <OfferingSlot
                      title="SaaS Landing Page"
                      number={1}
                      side="left"
                      progress={frozenOne}
                      exitProgress={frozenZero}
                    >
                      <SaasBuildCard progress={frozenOne} lite />
                    </OfferingSlot>
                  </div>
                ) : null}
                {offeringBeat === 1 ? (
                  <div className="pointer-events-none absolute inset-0 z-30">
                    <SaasOfferCopy progress={frozenOne} />
                  </div>
                ) : null}
                {offeringBeat === 2 ? (
                  <div className="pointer-events-none absolute inset-0 z-40">
                    <OfferingSlot
                      title="Develop, but fast"
                      number={2}
                      side="right"
                      progress={frozenOne}
                      exitProgress={frozenZero}
                    >
                      <FullStackBuildCard progress={frozenOne} lite />
                    </OfferingSlot>
                  </div>
                ) : null}
                {offeringBeat === 3 ? (
                  <div className="pointer-events-none absolute inset-0 z-50">
                    <FullStackOfferCopy progress={frozenOne} />
                  </div>
                ) : null}
                {offeringBeat === 4 ? (
                  <div className="pointer-events-none absolute inset-0 z-60">
                    <OfferingSlot
                      title="Website Revamps"
                      number={3}
                      side="left"
                      progress={frozenOne}
                      exitProgress={frozenZero}
                    >
                      <WebsiteRevampBuildCard progress={frozenOne} lite />
                    </OfferingSlot>
                  </div>
                ) : null}
                {offeringBeat === 5 ? (
                  <div className="pointer-events-none absolute inset-0 z-70">
                    <WebsiteRevampOfferCopy
                      progress={frozenOne}
                      curtainProgress={frozenZero}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <>
            {mountSaas ? (
              <>
                <div className="pointer-events-none absolute inset-0 z-20">
                  <OfferingSlot
                    title="SaaS Landing Page"
                    number={1}
                    side="left"
                    progress={saasCardProgress}
                    exitProgress={saasExitProgress}
                  >
                    <SaasBuildCard progress={saasCardProgress} lite={false} />
                  </OfferingSlot>
                </div>

                <motion.div
                  style={{
                    opacity: copyExitOpacity,
                    y: copyExitY,
                    filter: copyExitFilter,
                  }}
                  className="pointer-events-none absolute inset-0 z-30"
                >
                  <SaasOfferCopy progress={copyProgress} />
                </motion.div>
              </>
            ) : null}

            {mountFullStack ? (
              <>
                <div className="pointer-events-none absolute inset-0 z-40">
                  <OfferingSlot
                    title="Develop, but fast"
                    number={2}
                    side="right"
                    progress={fullStackProgress}
                    exitProgress={fullStackExitProgress}
                  >
                    <FullStackBuildCard
                      progress={fullStackProgress}
                      lite={false}
                    />
                  </OfferingSlot>
                </div>

                <motion.div
                  style={{
                    opacity: fullStackCopyExitOpacity,
                    y: fullStackCopyExitY,
                    filter: fullStackCopyExitFilter,
                  }}
                  className="pointer-events-none absolute inset-0 z-50"
                >
                  <FullStackOfferCopy progress={fullStackCopyProgress} />
                </motion.div>
              </>
            ) : null}

            {mountRevamp ? (
              <>
                <div className="pointer-events-none absolute inset-0 z-60">
                  <OfferingSlot
                    title="Website Revamps"
                    number={3}
                    side="left"
                    progress={revampProgress}
                    exitProgress={revampExitProgress}
                  >
                    <WebsiteRevampBuildCard
                      progress={revampProgress}
                      lite={false}
                    />
                  </OfferingSlot>
                </div>

                <div className="pointer-events-none absolute inset-0 z-70">
                  <WebsiteRevampOfferCopy
                    progress={revampCopyProgress}
                    curtainProgress={curtainDrive}
                  />
                </div>
              </>
            ) : null}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
