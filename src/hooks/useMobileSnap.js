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
 * Direction-aware: when scrolling up, prefer the previous section so the
 * footer doesn't pull you back mid-gesture.
 */
export function useNearestSectionSnap(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    let timer = 0;
    let snapping = false;
    let lastY = window.scrollY;
    /** 1 = down, -1 = up */
    let direction = 1;

    const nearestTop = () => {
      const sections = document.querySelectorAll("[data-snap]");
      if (!sections.length) return null;

      const vh = window.innerHeight || 800;
      let bestEl = null;
      let bestDist = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        // Bias toward the section in the travel direction so a small
        // upward fling from the footer doesn't lose to absolute nearest.
        let dist;
        if (direction < 0) {
          // Going up: sections still below the fold are heavily penalized.
          dist = top > vh * 0.2 ? top + vh : Math.abs(top);
        } else {
          // Going down: sections already above are heavily penalized.
          dist = top < -vh * 0.2 ? -top + vh : Math.abs(top);
        }

        if (dist < bestDist) {
          bestDist = dist;
          bestEl = section;
        }
      });

      if (!bestEl) return null;
      const top = bestEl.getBoundingClientRect().top;
      if (Math.abs(top) < 18) return null;
      return window.scrollY + top;
    };

    const snap = () => {
      if (snapping) return;
      if (!document.documentElement.classList.contains("mobile-snap")) return;
      const top = nearestTop();
      if (top == null) return;
      snapping = true;
      window.scrollTo({ top, behavior: "smooth" });
      window.setTimeout(() => {
        snapping = false;
      }, 420);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        direction = y > lastY ? 1 : -1;
      }
      lastY = y;
      window.clearTimeout(timer);
      timer = window.setTimeout(snap, 110);
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
