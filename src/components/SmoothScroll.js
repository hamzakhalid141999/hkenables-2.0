"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useIsMobile, useHasMounted } from "@/hooks/useIsMobile";

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
  const mounted = useHasMounted();

  useEffect(() => {
    const on = mounted && isMobile;
    document.documentElement.classList.toggle("mobile-snap", on);
    document.body.classList.toggle("mobile-snap", on);
    return () => {
      document.documentElement.classList.remove("mobile-snap");
      document.body.classList.remove("mobile-snap");
    };
  }, [isMobile, mounted]);

  const options = useMemo(
    () => ({
      lerp: 0.16,
      syncTouch: false,
    }),
    []
  );

  if (!mounted || isMobile) return children;

  return (
    <ReactLenis root options={options}>
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}
