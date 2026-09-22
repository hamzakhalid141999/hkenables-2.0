"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useIsMobile, useHasMounted } from "@/hooks/useIsMobile";
import { syncSafariSnapViewport } from "@/hooks/useMobileSnap";
import NavNotch from "@/components/NavNotch";

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
    if (on) syncSafariSnapViewport();
    else {
      document.documentElement.classList.remove("safari-mobile");
      document.documentElement.style.removeProperty("--snap-vh");
    }

    if (!on) return undefined;
    const onOrient = () => syncSafariSnapViewport();
    window.addEventListener("orientationchange", onOrient);
    window.addEventListener("resize", onOrient);
    return () => {
      document.documentElement.classList.remove("mobile-snap");
      document.body.classList.remove("mobile-snap");
      document.documentElement.classList.remove("safari-mobile");
      document.documentElement.style.removeProperty("--snap-vh");
      window.removeEventListener("orientationchange", onOrient);
      window.removeEventListener("resize", onOrient);
    };
  }, [isMobile, mounted]);

  const options = useMemo(
    () => ({
      lerp: 0.16,
      syncTouch: false,
    }),
    []
  );

  if (!mounted || isMobile) {
    return (
      <>
        {children}
        <NavNotch />
      </>
    );
  }

  return (
    <ReactLenis root options={options}>
      <ScrollToTopOnRouteChange />
      {children}
      <NavNotch />
    </ReactLenis>
  );
}
