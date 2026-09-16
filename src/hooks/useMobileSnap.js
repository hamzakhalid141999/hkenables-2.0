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
 * After a fling settles, lock onto the nearest [data-snap] section.
 * Does not intercept touchmove — CSS snap does the live work; this catches leftovers.
 */
export function useNearestSectionSnap(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    let timer = 0;
    let snapping = false;

    const nearestTop = () => {
      const sections = document.querySelectorAll("[data-snap]");
      if (!sections.length) return null;
      let bestEl = null;
      let bestDist = Number.POSITIVE_INFINITY;
      sections.forEach((section) => {
        const dist = Math.abs(section.getBoundingClientRect().top);
        if (dist < bestDist) {
          bestDist = dist;
          bestEl = section;
        }
      });
      if (!bestEl || bestDist < 18) return null;
      return window.scrollY + bestEl.getBoundingClientRect().top;
    };

    const snap = () => {
      if (snapping) return;
      const top = nearestTop();
      if (top == null) return;
      snapping = true;
      window.scrollTo({ top, behavior: "smooth" });
      window.setTimeout(() => {
        snapping = false;
      }, 420);
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(snap, 90);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", snap);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", snap);
    };
  }, [enabled]);
}

export const SNAP_SECTION = "h-dvh w-full shrink-0 snap-start snap-always";
