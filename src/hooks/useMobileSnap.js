"use client";

import { useEffect, useState } from "react";

/**
 * True when a snap slide is the one filling the viewport.
 * Used to trigger one-shot enter animations (not per-frame scrub).
 * Returns [active, refCallback].
 */
export function useSnapActive(threshold = 0.45) {
  const [node, setNode] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio >= threshold);
      },
      { threshold: [0, 0.25, threshold, 0.75, 1] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return [active, setNode];
}

/**
 * After a touch gesture settles, nudge onto the section at the snap line.
 * CSS scroll-snap is the primary driver; this only corrects leftover drift
 * on iOS and never runs during an active touch (that's what caused bounce-back).
 */
export function useNearestSectionSnap(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    let timer = 0;
    let snapping = false;
    let touching = false;

    const targetY = () => {
      const sections = document.querySelectorAll("[data-snap]");
      if (!sections.length) return null;

      // Layout viewport — stable while the iOS URL bar shows/hides.
      const vh = document.documentElement.clientHeight || window.innerHeight;
      const line = vh * 0.35;
      let current = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= line) current = section;
      });

      const top = current.getBoundingClientRect().top;
      if (Math.abs(top) < 28) return null;
      return window.scrollY + top;
    };

    const snap = () => {
      if (touching || snapping) return;
      if (!document.documentElement.classList.contains("mobile-snap")) return;
      const top = targetY();
      if (top == null) return;
      snapping = true;
      window.scrollTo({ top, behavior: "auto" });
      window.setTimeout(() => {
        snapping = false;
      }, 120);
    };

    const schedule = () => {
      window.clearTimeout(timer);
      if (touching || snapping) return;
      timer = window.setTimeout(snap, 240);
    };

    const onScroll = () => {
      if (touching) {
        window.clearTimeout(timer);
        return;
      }
      schedule();
    };

    const onTouchStart = () => {
      touching = true;
      window.clearTimeout(timer);
    };

    const onTouchEnd = () => {
      touching = false;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled]);
}

/** svh stays put when the iOS URL bar shows/hides (dvh does not). */
export const SNAP_SECTION =
  "h-svh min-h-[100svh] w-full shrink-0 snap-start";
