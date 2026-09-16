"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

function ScrollToTopOnRouteChange() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  const isMobile = useIsMobile();

  const options = useMemo(
    () =>
      isMobile
        ? {
            // Own touch so we can kill post-gesture coasting
            syncTouch: true,
            // Instant follow while finger is down
            syncTouchLerp: 1,
            // |v|^0 ≈ 1px on release → no rubbery inertia
            touchInertiaExponent: 0,
            lerp: 0.35,
            touchMultiplier: 1.1,
          }
        : {
            lerp: 0.16,
            syncTouch: false,
          },
    [isMobile]
  );

  return (
    <ReactLenis
      // Remount when breakpoint flips so Lenis picks up touch options
      key={isMobile ? "lenis-mobile" : "lenis-desktop"}
      root
      options={options}
    >
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}
