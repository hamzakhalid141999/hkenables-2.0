"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import MyProjects, { PROJECT_COUNT } from "@/components/MyProjects/MyProjects";

const SNAP_DURATION = 0.42;
const SNAP_JUMP_BONUS = 0.1;
const WHEEL_DELTA_MIN = 6;
const SNAP_DEADZONE = 0.004;
const TOUCH_DELTA_MIN = 24;

/** One parked intro screen, then the same gallery/footer distances as desktop. */
const INTRO_VH = 1;
const PROJECTS_VH = 10;
const FOOTER_VH = 0.85;
const TOTAL_VH = INTRO_VH + PROJECTS_VH + FOOTER_VH;
const INTRO_END = INTRO_VH / TOTAL_VH;
const GALLERY_START = INTRO_END;
const GALLERY_END = (INTRO_VH + PROJECTS_VH) / TOTAL_VH;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function MyProjectsMobile() {
  const trackRef = useRef(null);
  const pinProgressRef = useRef(0);
  const isSnappingRef = useRef(false);
  const lockedProjectRef = useRef(0);
  const rafRef = useRef(0);
  const navApiRef = useRef({
    goTo: () => false,
    goNext: () => false,
    goPrev: () => false,
  });

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const curtainProgress = useMotionValue(1);
  const introProgress = useMotionValue(1);

  const { scrollYProgress: pinProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(pinProgress, "change", (value) => {
    pinProgressRef.current = value;
  });

  const projectsProgress = useTransform(pinProgress, (p) => {
    if (p <= GALLERY_START) return 0;
    if (p >= GALLERY_END) return 1;
    return (p - GALLERY_START) / Math.max(GALLERY_END - GALLERY_START, 0.0001);
  });
  const footerProgress = useTransform(pinProgress, (p) => {
    if (p <= GALLERY_END) return 0;
    return Math.min(1, (p - GALLERY_END) / Math.max(1 - GALLERY_END, 0.0001));
  });

  useEffect(() => {
    const galleryLocal = (pin) => {
      const span = GALLERY_END - GALLERY_START;
      if (span <= 0) return 0;
      return Math.min(1, Math.max(0, (pin - GALLERY_START) / span));
    };
    const isInIntro = (pin) => pin < GALLERY_START - 0.001;
    const isInGallery = (pin) =>
      pin >= GALLERY_START - 0.001 && pin < GALLERY_END - 0.002;
    const isInFooter = (pin) => pin >= GALLERY_END - 0.002;

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
      const targetPin =
        GALLERY_START + targetLocal * (GALLERY_END - GALLERY_START);
      return pinToScrollY(targetPin);
    };

    const animateToScrollY = (targetScrollY, { duration, onSettled } = {}) => {
      if (targetScrollY == null) return false;
      const start = window.scrollY;
      const dist = targetScrollY - start;
      if (Math.abs(dist) < 2) {
        onSettled?.();
        return false;
      }

      window.cancelAnimationFrame(rafRef.current);
      isSnappingRef.current = true;
      document.documentElement.classList.remove("mobile-snap");
      document.body.classList.remove("mobile-snap");

      const dur = (duration ?? SNAP_DURATION) * 1000;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, start + dist * easeInOutCubic(t));
        if (t < 1) {
          rafRef.current = window.requestAnimationFrame(step);
          return;
        }
        isSnappingRef.current = false;
        onSettled?.();
      };
      rafRef.current = window.requestAnimationFrame(step);
      window.setTimeout(() => {
        isSnappingRef.current = false;
      }, dur + 120);
      return true;
    };

    const snapToIndex = (index, { fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;

      const targetIndex = Math.min(PROJECT_COUNT - 1, Math.max(0, index));
      const pin = pinProgressRef.current;
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
        0.75,
        SNAP_DURATION + Math.max(0, distance - 1) * SNAP_JUMP_BONUS
      );

      lockedProjectRef.current = targetIndex;
      setActiveProjectIndex(targetIndex);
      return animateToScrollY(targetScrollY, { duration });
    };

    const snapToIntro = ({ fromUi = false } = {}) => {
      if (isSnappingRef.current && !fromUi) return false;
      if (fromUi) isSnappingRef.current = false;
      const ok = animateToScrollY(pinToScrollY(0), {
        onSettled: () => {
          lockedProjectRef.current = 0;
          setActiveProjectIndex(0);
        },
      });
      if (ok) lockedProjectRef.current = 0;
      return ok;
    };

    const lastOfferingEl = () => {
      const slides = document.querySelectorAll("#myOfferings > [data-snap]");
      return slides[slides.length - 1] ?? null;
    };
    const lastOfferingActive = () => {
      const last = lastOfferingEl();
      if (!last) return false;
      return Math.abs(last.getBoundingClientRect().top) < 48;
    };
    const trackCovering = () => {
      const track = trackRef.current;
      if (!track) return false;
      const r = track.getBoundingClientRect();
      return r.top <= 8 && r.bottom >= window.innerHeight - 8;
    };
    const snapToLastOffering = () => {
      const last = lastOfferingEl();
      if (!last) return false;
      document.documentElement.classList.add("mobile-snap");
      document.body.classList.add("mobile-snap");
      return animateToScrollY(
        window.scrollY + last.getBoundingClientRect().top
      );
    };

    navApiRef.current = {
      goTo: (index) => snapToIndex(index, { fromUi: true }),
      goNext: () => {
        const pin = pinProgressRef.current;
        if (isInIntro(pin)) return snapToIndex(0, { fromUi: true });
        if (isInFooter(pin)) return false;
        if (lockedProjectRef.current >= PROJECT_COUNT - 1) {
          return animateToScrollY(pinToScrollY(1), { duration: SNAP_DURATION });
        }
        return snapToIndex(lockedProjectRef.current + 1, { fromUi: true });
      },
      goPrev: () => {
        const pin = pinProgressRef.current;
        if (isInFooter(pin)) {
          lockedProjectRef.current = PROJECT_COUNT - 1;
          setActiveProjectIndex(PROJECT_COUNT - 1);
          return animateToScrollY(scrollYForIndex(PROJECT_COUNT - 1), {
            duration: 0.55,
          });
        }
        if (isInIntro(pin)) return snapToLastOffering();
        if (!isInGallery(pin)) return false;
        if (lockedProjectRef.current === 0) return snapToIntro({ fromUi: true });
        return snapToIndex(lockedProjectRef.current - 1, { fromUi: true });
      },
    };

    const trySnapFromDelta = (rawDelta) => {
      if (isSnappingRef.current) return true;
      if (Math.abs(rawDelta) < WHEEL_DELTA_MIN) return false;

      const pin = pinProgressRef.current;
      const direction = rawDelta > 0 ? 1 : -1;

      if (lastOfferingActive() && !trackCovering()) {
        if (direction > 0) return snapToIntro({ fromUi: true });
        return false;
      }

      if (isInFooter(pin)) {
        lockedProjectRef.current = PROJECT_COUNT - 1;
        return false;
      }

      if (isInIntro(pin)) {
        if (direction > 0) return snapToIndex(0);
        return snapToLastOffering();
      }

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
        return snapToIntro();
      }

      const next = lockedProjectRef.current + direction;
      if (next < 0 || next >= PROJECT_COUNT) return false;
      return snapToIndex(next);
    };

    const onWheel = (event) => {
      const pin = pinProgressRef.current;
      if (isInFooter(pin) && !isSnappingRef.current) return;

      const inZone =
        lastOfferingActive() || trackCovering() || isSnappingRef.current;
      if (!inZone) return;

      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      if (trySnapFromDelta(delta)) event.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event) => {
      const pin = pinProgressRef.current;
      if (isInFooter(pin) && !isSnappingRef.current) return;

      const inZone =
        lastOfferingActive() || trackCovering() || isSnappingRef.current;
      if (!inZone) return;

      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }

      const y = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - y;
      if (Math.abs(delta) < TOUCH_DELTA_MIN) return;
      if (trySnapFromDelta(delta)) {
        event.preventDefault();
        touchStartY = y;
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
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearInterval(progressInterval);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, []);

  useEffect(() => {
    const syncSnapMode = () => {
      if (isSnappingRef.current) {
        document.documentElement.classList.remove("mobile-snap");
        document.body.classList.remove("mobile-snap");
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const covering = r.top <= 8 && r.bottom >= window.innerHeight - 8;
      document.documentElement.classList.toggle("mobile-snap", !covering);
      document.body.classList.toggle("mobile-snap", !covering);
    };
    window.addEventListener("scroll", syncSnapMode, { passive: true });
    syncSnapMode();
    return () => {
      window.removeEventListener("scroll", syncSnapMode);
      document.documentElement.classList.add("mobile-snap");
      document.body.classList.add("mobile-snap");
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

  return (
    <div
      id="projects-gallery-track"
      ref={trackRef}
      className="relative w-full"
      style={{ height: `${TOTAL_VH * 100}vh` }}
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <MyProjects
          curtainProgress={curtainProgress}
          introProgress={introProgress}
          projectsProgress={projectsProgress}
          footerProgress={footerProgress}
          activeProjectIndex={activeProjectIndex}
          onGoToProject={goToProject}
          onNextProject={goToNextProject}
          onPrevProject={goToPrevProject}
        />
      </div>
    </div>
  );
}
