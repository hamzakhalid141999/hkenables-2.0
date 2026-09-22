"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { MagneticHotspot } from "@/components/MyOfferings/MagneticLink";
import { THEME } from "@/theme/palette";
import { scrollToMobileY } from "@/hooks/useMobileSnap";

const LINKS = [
  {
    id: "home",
    label: "Home",
    targetId: "home",
    icon: "/notch/home.svg",
  },
  {
    id: "aboutMe",
    label: "About Me",
    targetId: "aboutMe",
    icon: "/notch/about_me.svg",
  },
  {
    id: "myOfferings",
    label: "My Offerings",
    targetId: "notch-saas",
    icon: "/notch/my_offerings.svg",
  },
  {
    id: "myProjects",
    label: "Projects",
    targetId: "notch-projects",
    icon: "/notch/projects.svg",
  },
  {
    id: "contactMe",
    label: "Contact Me",
    targetId: "contactMe",
    icon: "/notch/contact.svg",
  },
];

/** Finer scroll stops for notch icon tint along the site gradient. */
const COLOR_STOPS = [
  {
    menuId: "home",
    targetId: "home",
    icon: "/notch/home.svg",
    color: THEME.hero,
  },
  {
    menuId: "aboutMe",
    targetId: "aboutMe",
    icon: "/notch/about_me.svg",
    color: THEME.about,
  },
  {
    menuId: "myOfferings",
    targetId: "notch-saas",
    icon: "/notch/my_offerings.svg",
    color: THEME.saas,
  },
  {
    menuId: "myOfferings",
    targetId: "notch-fullstack",
    icon: "/notch/my_offerings.svg",
    color: THEME.fullstack,
  },
  {
    menuId: "myOfferings",
    targetId: "notch-revamp",
    icon: "/notch/my_offerings.svg",
    color: THEME.revamp,
  },
  {
    menuId: "myProjects",
    targetId: "notch-projects",
    icon: "/notch/projects.svg",
    color: THEME.revamp,
  },
  {
    menuId: "contactMe",
    targetId: "contactMe",
    icon: "/notch/contact.svg",
    color: THEME.footer,
  },
];

const SIZE_EASE = [0.16, 1, 0.3, 1];
const RADIUS_EASE = [0.2, 0.9, 0.2, 1];
/** Slow → fast → slow for icon swaps */
const ICON_EASE = [0.65, 0, 0.35, 1];
/** Idle before notch merges into the top of the screen */
const DOCK_IDLE_MS = 1500;
/** Floating offset from top (matches Tailwind top-5) */
const FLOAT_TOP = 20;

const CLOSED = {
  width: 72,
  height: 34,
  borderTopLeftRadius: 999,
  borderTopRightRadius: 999,
  borderBottomLeftRadius: 999,
  borderBottomRightRadius: 999,
};

/** Flush with the viewport top — flat top edge, rounded bottom */
const DOCKED = {
  width: 92,
  height: 28,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 18,
  borderBottomRightRadius: 18,
};

const OPENED = {
  width: 220,
  height: 248,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
};

function resolveThemeStop() {
  const line = window.innerHeight * 0.3;
  let current = COLOR_STOPS[0];
  for (const stop of COLOR_STOPS) {
    const el = document.getElementById(stop.targetId);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line) current = stop;
  }
  return current;
}

export default function NavNotch() {
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState("home");
  const [themeStop, setThemeStop] = useState(COLOR_STOPS[0]);
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const lenis = useLenis();
  const tug = useMotionValue(0);
  const tugY = useSpring(tug, { stiffness: 320, damping: 24, mass: 0.45 });

  const springY = useSpring(0, {
    stiffness: 420,
    damping: 36,
    mass: 0.55,
  });
  const springH = useSpring(36, {
    stiffness: 420,
    damping: 36,
    mass: 0.55,
  });
  const highlightOpacity = useSpring(0, { stiffness: 300, damping: 30 });

  const syncHighlight = (id, { immediate = false } = {}) => {
    const item = itemRefs.current[id];
    if (!item) return;
    const y = item.offsetTop;
    const h = item.offsetHeight;
    if (immediate || highlightOpacity.get() < 0.05) {
      springY.jump(y);
      springH.jump(h);
    } else {
      springY.set(y);
      springH.set(h);
    }
    highlightOpacity.set(1);
  };

  // Idle → dock to top of screen; any cursor move pops it back
  useEffect(() => {
    if (open) {
      setDocked(false);
      return undefined;
    }

    let timer = window.setTimeout(() => setDocked(true), DOCK_IDLE_MS);

    const bump = () => {
      setDocked(false);
      tug.set(0);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setDocked(true), DOCK_IDLE_MS);
    };

    window.addEventListener("mousemove", bump, { passive: true });
    window.addEventListener("pointerdown", bump, { passive: true });
    window.addEventListener("touchstart", bump, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", bump);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("touchstart", bump);
    };
  }, [open, tug]);

  useEffect(() => {
    if (docked) tug.set(0);
  }, [docked, tug]);

  useEffect(() => {
    let lastY = window.scrollY;
    let settle = 0;
    let raf = 0;

    const syncSection = () => {
      const next = resolveThemeStop();
      setThemeStop((prev) =>
        prev.targetId === next.targetId && prev.color === next.color
          ? prev
          : next
      );
      setActiveId((prev) => (prev === next.menuId ? prev : next.menuId));
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!open && !docked && Math.abs(dy) > 0.5) {
        tug.set(Math.max(-10, Math.min(10, dy * 0.35)));
        window.clearTimeout(settle);
        settle = window.setTimeout(() => tug.set(0), 90);
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncSection);
    };

    syncSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncSection);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncSection);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
    };
  }, [open, docked, tug]);

  useEffect(() => {
    if (!open) {
      highlightOpacity.jump(0);
      setHoveredId(null);
      return;
    }
    if (!hoveredId) {
      highlightOpacity.set(0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      syncHighlight(hoveredId);
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hoveredId]);

  const goTo = (link) => {
    setOpen(false);

    const jump = (top) => {
      if (lenis) lenis.scrollTo(top, { offset: 0 });
      else scrollToMobileY(top);
    };

    // Sticky #home stays in-view while scrolled — always go to page top.
    if (link.id === "home") {
      jump(0);
      return;
    }

    // Desktop offerings use a tall pin track — land via pin progress so the
    // SaaS card is on-screen (raw marker top is short of the first offering).
    if (link.id === "myOfferings") {
      const track = document.querySelector("[data-offerings-track]");
      if (track) {
        const pin = Number.parseFloat(
          track.getAttribute("data-saas-land-pin") || "0"
        );
        const trackTop =
          track.getBoundingClientRect().top + window.scrollY;
        const scrollRange = Math.max(
          0,
          track.offsetHeight - window.innerHeight
        );
        jump(trackTop + pin * scrollRange);
        return;
      }
    }

    const el = document.getElementById(link.targetId);
    if (!el) return;
    jump(el.getBoundingClientRect().top + window.scrollY);
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        className="fixed inset-0 z-90 cursor-pointer bg-black/25"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: SIZE_EASE }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
      />

      <motion.div
        className="pointer-events-none fixed left-1/2 z-100 -translate-x-1/2"
        initial={false}
        animate={{
          top: docked && !open ? 0 : FLOAT_TOP,
        }}
        transition={
          docked && !open
            ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
            : { type: "spring", stiffness: 520, damping: 22, mass: 0.65 }
        }
      >
        <motion.div style={{ y: tugY }} className="pointer-events-auto">
          <MagneticHotspot
            as="div"
            customCursor={false}
            magnet={!open && !docked}
            hitPad={10}
            className="block"
            aria-label={open ? "Site menu" : "Open site menu"}
          >
            <motion.div
              initial={false}
              animate={open ? OPENED : docked ? DOCKED : CLOSED}
              transition={{
                width: {
                  duration: docked && !open ? 0.7 : 0.48,
                  ease: SIZE_EASE,
                },
                height: {
                  duration: docked && !open ? 0.7 : 0.48,
                  ease: SIZE_EASE,
                },
                borderTopLeftRadius: {
                  duration: open ? 0.22 : docked ? 0.55 : 0.4,
                  ease: open ? RADIUS_EASE : SIZE_EASE,
                },
                borderTopRightRadius: {
                  duration: open ? 0.22 : docked ? 0.55 : 0.4,
                  ease: open ? RADIUS_EASE : SIZE_EASE,
                },
                borderBottomLeftRadius: {
                  duration: open ? 0.22 : docked ? 0.55 : 0.4,
                  ease: open ? RADIUS_EASE : SIZE_EASE,
                },
                borderBottomRightRadius: {
                  duration: open ? 0.22 : docked ? 0.55 : 0.4,
                  ease: open ? RADIUS_EASE : SIZE_EASE,
                },
              }}
              className="relative overflow-hidden border border-white/12 bg-[#141414] text-white"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                borderTopColor:
                  docked && !open ? "transparent" : "rgba(255,255,255,0.12)",
              }}
              onClick={() => {
                if (!open) {
                  setDocked(false);
                  setOpen(true);
                }
              }}
              role={open ? "dialog" : "button"}
              aria-expanded={open}
            >
              {/* Section icon — closed notch only */}
              <motion.div
                aria-hidden={open}
                animate={{
                  opacity: open ? 0 : 1,
                  paddingBottom: docked && !open ? 4 : 0,
                }}
                transition={{ duration: 0.35, ease: SIZE_EASE }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 overflow-hidden"
              >
                <motion.span
                  aria-hidden
                  className="relative h-1.5 w-1.5 shrink-0 rounded-full"
                  animate={{ backgroundColor: themeStop.color }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    boxShadow: `0 0 8px ${themeStop.color}`,
                  }}
                />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={`${themeStop.targetId}-${themeStop.color}`}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.48, ease: ICON_EASE }}
                    className="block h-[18px] w-[18px]"
                    style={{
                      backgroundColor: themeStop.color,
                      WebkitMaskImage: `url(${themeStop.icon})`,
                      maskImage: `url(${themeStop.icon})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                    role="img"
                    aria-hidden
                  />
                </AnimatePresence>
              </motion.div>

              <motion.nav
                ref={navRef}
                aria-hidden={!open}
                aria-label="Sections"
                animate={{ opacity: open ? 1 : 0 }}
                transition={{
                  duration: 0.22,
                  delay: open ? 0.16 : 0,
                  ease: "linear",
                }}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute inset-0 flex flex-col items-stretch justify-start gap-0 px-3 py-4 ${
                  open ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-3 right-3 rounded-[8px] bg-white/10"
                  style={{
                    y: springY,
                    height: springH,
                    opacity: highlightOpacity,
                  }}
                />

                {LINKS.map((link) => (
                  <button
                    key={link.id}
                    ref={(el) => {
                      if (el) itemRefs.current[link.id] = el;
                    }}
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onMouseEnter={() => setHoveredId(link.id)}
                    onFocus={() => setHoveredId(link.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(link);
                    }}
                    className={`relative z-10 cursor-pointer rounded-xl px-4 py-2.5 text-center font-gg-sans text-[16px] font-medium tracking-wide transition-colors ${
                      hoveredId === link.id ? "text-white" : "text-white/75"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </motion.nav>
            </motion.div>
          </MagneticHotspot>
        </motion.div>
      </motion.div>
    </>
  );
}
