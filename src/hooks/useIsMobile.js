"use client";

import { useEffect, useState } from "react";

/** True after the first client paint — use before branching SSR vs mobile/desktop trees. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** True below the given CSS px breakpoint (default: mobile). Safe for hydration. */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);

  return isMobile;
}
