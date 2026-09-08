"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import {
  PROJECT_IMAGE_QUALITY,
  prefetchOptimizedImage,
} from "@/lib/optimizedImage";
import { useIsMobile } from "@/hooks/useIsMobile";

/** Brand-coded tech tags shown under each project window. */
const TECH_STYLES = {
  JavaScript: { bg: "#F7DF1E", text: "#1a1a1a" },
  TypeScript: { bg: "#3178C6", text: "#FFFFFF" },
  React: { bg: "#61DAFB", text: "#0b1a22" },
  "Next.js": { bg: "#111111", text: "#FFFFFF" },
  NestJS: { bg: "#E0234E", text: "#FFFFFF" },
  "Node.js": { bg: "#339933", text: "#FFFFFF" },
  AWS: { bg: "#FF9900", text: "#1a1a1a" },
  Amazon: { bg: "#FF9900", text: "#1a1a1a" },
  Azure: { bg: "#0078D4", text: "#FFFFFF" },
  MetaMask: { bg: "#F6851B", text: "#1a1a1a" },
  "The Graph": { bg: "#6747ED", text: "#FFFFFF" },
  GraphQL: { bg: "#E10098", text: "#FFFFFF" },
  Whisper: { bg: "#10A37F", text: "#FFFFFF" },
  BuildMQ: { bg: "#2563EB", text: "#FFFFFF" },
  RadixUI: { bg: "#111111", text: "#FFFFFF" },
  PostgreSQL: { bg: "#336791", text: "#FFFFFF" },
  "Lemon Squeezy": { bg: "#FFC233", text: "#1a1a1a" },
  OpenAI: { bg: "#10A37F", text: "#FFFFFF" },
  "fluent-ffmpeg": { bg: "#007808", text: "#FFFFFF" },
  TipTap: { bg: "#5C4BFF", text: "#FFFFFF" },
  MCP: { bg: "#D97706", text: "#FFFFFF" },
  "Azure AD B2C": { bg: "#0078D4", text: "#FFFFFF" },
  "Azure App Service": { bg: "#0078D4", text: "#FFFFFF" },
  "Azure Front Door": { bg: "#0078D4", text: "#FFFFFF" },
  "Azure Storage": { bg: "#0078D4", text: "#FFFFFF" },
  Strapi: { bg: "#4945FF", text: "#FFFFFF" },
};

function techStyle(name) {
  return TECH_STYLES[name] ?? { bg: "#2a2a2a", text: "#FFFFFF" };
}

/** Soft grid line color when a project omits `meshColor`. */
const DEFAULT_MESH_COLOR = "#FFFFFF";
const MESH_LINE_OPACITY = 0.08;

const PROJECTS = [
  {
    number: "01",
    title: "BatchEdits",
    type: "Bulk Video Editor",
    liveLink: "https://batchedits.com/",
    description:
      "An all-in-one bulk editor for podcasts, talking-head clips, narrated videos, and more. Cut awkward silences, customize captions, clip and crop, refine your transcript, and punch in or out with cinematic zooms.",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF6B00",
    foreground: "#111111",
    textColor: "#000000",
    tech: [
      "Amazon",
      "React",
      "Whisper",
      "BuildMQ",
      "RadixUI",
      "PostgreSQL",
      "Lemon Squeezy",
      "OpenAI",
      "fluent-ffmpeg",
      "TipTap",
      "MCP",
    ],
    video: "/projects-screenshots/batch-edits.mp4",
    meshColor: "#A0581D", // optional — grid line tint; defaults to white
  },

  {
    number: "02",
    title: "Estately.io",
    type: "Property Management",
    description:
      "Estately brings all property operations into one powerful, easy-to-use platform. Manage tenants, assets, bookings, maintenance, compliance, and finances from a single dashboard. Custom made accounting solution so you can track every add-on's penny.\n\nWith smart automation, real-time reporting, and role-based access, Estately delivers complete visibility and control making complex property management simple and scalable.",
    liveLink: "https://www.estately.io/",
    primaryColor: "#dde8e4",
    secondaryColor: "#73ad95",
    foreground: "#111111",
    textColor: "#000000",
    meshColor: "#244135",
    tech: [],
    screenshots: Array.from(
      { length: 22 },
      (_, i) => `/projects-screenshots/e-${i + 1}.png`
    ),
  },
  {
    number: "03",
    title: "H&S Auditor",
    type: "AI Health & Safety Auditor",
    description:
      "An AI-powered health and safety auditor that can help you identify and mitigate risks in your workplace or sites and generates a detailed excel with recommendations.",
    liveLink: "https://www.isekaiverse.io/",
    primaryColor: "#192222",
    secondaryColor: "#17FFC6",
    foreground: "#111111",
    textColor: "#FFFFFF",
    // meshColor: "#FFFFFF", // optional — grid line tint; defaults to white
    tech: [],
    video: "/projects-screenshots/hns-audit.mp4",
  },
  {
    number: "04",
    title: "Redbook",
    type: "Certified Listings Platform",
    liveLink: "https://www.redbooklive.com/",
    description:
      "Redbook is an eco-system of 3 apps. RedBookLive delivers instant, up-to-date verification of LPCB-certified products and services — online and via PDF.\nI've solely built the Azure AD B2C single sign-on used across 10+ BRE applications, including Redbook, and contributed to the admin portal.",
    primaryColor: "#141535",
    secondaryColor: "#DC0043",
    foreground: "#FFFFFF",
    textColor: "#FFFFFF",
    tech: [
      "Next.js",
      "React",
      "NestJS",
      "PostgreSQL",
      "Azure AD B2C",
      "Azure App Service",
      "Azure Front Door",
      "Azure Storage",
      "Strapi",
    ],
    screenshots: Array.from(
      { length: 15 },
      (_, i) => `/projects-screenshots/rbl-${i + 1}.png`
    ),
  },
  {
    number: "05",
    title: "FARBE",
    type: "NFT Marketplace",
    description:
      "An online NFT marketplace where artists could publish and sell their work, with support for multiple crypto wallets including MetaMask.",
    liveLink: "https://www.isekaiverse.io/",
    primaryColor: "#FFFFFF",
    secondaryColor: "#17FFC6",
    foreground: "#111111",
    textColor: "#000000",
    meshColor: "#1DA088",
    tech: ["JavaScript", "Next.js", "AWS", "MetaMask", "The Graph"],
    screenshots: Array.from(
      { length: 9 },
      (_, i) => `/projects-screenshots/fb-${i + 1}.png`
    ),
  },
  {
    number: "06",
    title: "Facing North",
    type: "Travel Agency",
    liveLink: "https://facing-north-dev.vercel.app/",
    description:
      "A travel platform for customized tours showcasing the natural beauty, cultural heritage, and way of life across Pakistan's northern region.",
    primaryColor: "#73EAFC",
    secondaryColor: "#18B5CD",
    foreground: "#10252a",
    textColor: "#000000",
    meshColor: "rgb(29 119 102)",
    tech: ["TypeScript", "Next.js", "AWS"],
    screenshots: Array.from(
      { length: 12 },
      (_, i) => `/projects-screenshots/fn-${i + 1}.png`
    ),
  },
  {
    number: "07",
    title: "Isekaiverse",
    type: "Anime Web3 Ecosystem",
    description:
      "A Web3 entertainment ecosystem connecting fans, creators, and professionals with tools that help original brands and IP come to life.",
    liveLink: "https://www.mysticreign.io/",
    primaryColor: "#5F11D1",
    secondaryColor: "#40EA6B",
    foreground: "#FFFFFF",
    textColor: "#FFFFFF",
    tech: ["JavaScript", "Next.js", "AWS", "MetaMask", "The Graph"],
    screenshots: Array.from(
      { length: 6 },
      (_, i) => `/projects-screenshots/iv-${i + 1}.png`
    ),
  },
  {
    number: "08",
    title: "Rentto",
    type: "Real Estate Portal",
    liveLink: "https://rentto-web-kappa.vercel.app/",
    description:
      "A direct rental marketplace for workplaces and properties, connecting renters with owners without the friction of a middleman.",
    primaryColor: "#387F80",
    secondaryColor: "#f09737",
    foreground: "#FFFFFF",
    textColor: "#FFFFFF",
    tech: ["JavaScript", "Next.js", "AWS"],
    screenshots: Array.from(
      { length: 12 },
      (_, i) => `/projects-screenshots/r-${i + 1}.png`
    ),
  },
  {
    number: "09",
    title: "Zilaay",
    type: "Real Estate Portal",
    description:
      "A modern property portal bringing buyers and sellers closer through international-standard listings and map-based boundary search.",
    primaryColor: "#73EAFC",
    secondaryColor: "#18B5CD",
    meshColor: "#108EA1",
    foreground: "#10252a",
    textColor: "#183840",
    tech: ["TypeScript", "Next.js", "AWS", "MetaMask"],
    screenshots: Array.from(
      { length: 12 },
      (_, i) => `/projects-screenshots/z-${i + 1}.png`
    ),
  },
];

/** Exposed so the scroll-snap logic in MyOfferings knows how many beats exist. */
export const PROJECT_COUNT = PROJECTS.length;

/** Lightweight nav labels for the gallery controls. */
export const PROJECT_NAV = PROJECTS.map(({ number, title, secondaryColor, foreground }) => ({
  number,
  title,
  secondaryColor,
  foreground,
}));

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const to = (v) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mixToward(hex, target, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (target.r - r) * amount,
    g: g + (target.g - g) * amount,
    b: b + (target.b - b) * amount,
  });
}

function darkerShade(hex) {
  return mixToward(hex, { r: 0, g: 0, b: 0 }, 0.4);
}

function lighterShade(hex) {
  return mixToward(hex, { r: 255, g: 255, b: 255 }, 0.45);
}

const COLOR_SPRING = { stiffness: 120, damping: 26, mass: 0.55 };
/** Wait until the outgoing project has started leaving before swapping theme colors. */
const COLOR_CHANGE_DELAY_MS = 380;

/** Smoothly interpolates a hex color when the target changes (snap-safe). */
function useSprungColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rSpring = useSpring(r, COLOR_SPRING);
  const gSpring = useSpring(g, COLOR_SPRING);
  const bSpring = useSpring(b, COLOR_SPRING);

  useEffect(() => {
    rSpring.set(r);
    gSpring.set(g);
    bSpring.set(b);
  }, [r, g, b, rSpring, gSpring, bSpring]);

  return useTransform(
    [rSpring, gSpring, bSpring],
    ([rv, gv, bv]) =>
      `rgb(${Math.round(rv)}, ${Math.round(gv)}, ${Math.round(bv)})`
  );
}

function TechTag({ name, index, count, progress, start, mid, end }) {
  const enterSpan = Math.max(mid - start, 0.0001);
  const exitSpan = Math.max(end - mid, 0.0001);
  const enterStep = (enterSpan / (count + 1)) * 0.9;
  const exitStep = (exitSpan / (count + 1)) * 0.9;

  const enterStart = start + index * enterStep;
  const enterEnd = enterStart + enterStep;
  const exitStart = mid + index * exitStep;
  const exitEnd = exitStart + exitStep;

  const y = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [22, 0, 0, -22]
  );
  const opacity = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0]
  );

  const { bg, text } = techStyle(name);

  return (
    <motion.span
      style={{
        y,
        opacity,
        backgroundColor: bg,
        color: text,
      }}
      className="inline-flex items-center rounded-md px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm sm:text-[12px]"
    >
      {name}
    </motion.span>
  );
}

function TechTagStatic({ name }) {
  const { bg, text } = techStyle(name);
  return (
    <span
      style={{ backgroundColor: bg, color: text }}
      className="inline-flex items-center rounded-md px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm"
    >
      {name}
    </span>
  );
}

const TECH_MOBILE_VISIBLE = 5;

function TechTags({
  items,
  progress,
  start,
  mid,
  end,
  clampOnMobile = false,
  onSeeMore,
}) {
  const truncated = clampOnMobile && items.length > TECH_MOBILE_VISIBLE;
  const visible = truncated ? items.slice(0, TECH_MOBILE_VISIBLE) : items;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {visible.map((name, index) => (
        <TechTag
          key={name}
          name={name}
          index={index}
          count={visible.length}
          progress={progress}
          start={start}
          mid={mid}
          end={end}
        />
      ))}
      {truncated ? (
        <button
          type="button"
          onClick={onSeeMore}
          className="pointer-events-auto inline-flex items-center rounded-md border border-current/25 px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em] opacity-70"
        >
          see more
        </button>
      ) : null}
    </div>
  );
}

/**
 * Shared mobile bottom sheet — full tech stack + description.
 */
function ProjectDetailsSheet({ open, onClose, title, description, tech = [] }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="project-details-sheet"
          className="fixed inset-0 z-[200] flex flex-col justify-end md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="relative z-10 max-h-[78vh] overflow-y-auto rounded-t-3xl bg-[#141414] px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4 text-white shadow-[0_-20px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25" />
            <div className="mb-4 flex items-start justify-between gap-4">
              <h4 className="font-archivo-black text-[22px] leading-tight tracking-tight text-white">
                {title}
              </h4>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/15 px-3 py-1 font-gg-sans text-[11px] uppercase tracking-[0.14em] text-white/70"
              >
                Close
              </button>
            </div>

            {tech.length > 0 ? (
              <div className="mb-6">
                <p className="mb-2.5 font-gg-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {tech.map((name) => (
                    <TechTagStatic key={name} name={name} />
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="mb-2.5 font-gg-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                Description
              </p>
              <p className="whitespace-pre-line font-gg-sans text-[17px] font-normal leading-snug text-white/80">
                {description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Mobile: clamp overflowing copy + "see more" → shared details sheet.
 * Desktop: always show the full description inline.
 */
function ProjectDescription({
  text,
  y,
  clampOnMobile = false,
  onSeeMore,
}) {
  const [needsMore, setNeedsMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (!clampOnMobile) {
      setNeedsMore(false);
      return undefined;
    }

    const el = textRef.current;
    if (!el) return undefined;

    const measure = () => {
      setNeedsMore(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text, clampOnMobile]);

  if (!clampOnMobile) {
    return (
      <motion.p
        style={{ y }}
        className="mt-5 max-w-md whitespace-pre-line font-gg-sans text-[clamp(18px,1.4vw,20px)] font-normal leading-snug opacity-80"
      >
        {text}
      </motion.p>
    );
  }

  return (
    <div className="mt-5 max-w-md">
      <p
        ref={textRef}
        className="line-clamp-3 whitespace-pre-line font-gg-sans text-[18px] font-normal leading-snug opacity-80"
      >
        {text}
      </p>
      {needsMore ? (
        <button
          type="button"
          onClick={onSeeMore}
          className="mt-1.5 pointer-events-auto font-gg-sans text-[13px] uppercase tracking-[0.12em] underline underline-offset-2 opacity-70"
        >
          see more
        </button>
      ) : null}
    </div>
  );
}

/** First screenshot per project — enough for early gallery paint. */
const PROJECT_COVER_SHOTS = PROJECTS.map(
  (project) => project.screenshots?.[0]
).filter(Boolean);

/**
 * Warm cover screenshots via Next's optimizer (not raw PNGs).
 * Full hover sets warm when each Mac window mounts.
 */
function useProjectMediaWarmup(enabled) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return undefined;
    startedRef.current = true;

    const run = () => {
      PROJECT_COVER_SHOTS.forEach((src) => prefetchOptimizedImage(src));
    };

    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 1800 })
        : null;
    const timeoutId = idleId == null ? window.setTimeout(run, 900) : null;

    return () => {
      if (idleId != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [enabled]);
}

function ExternalLinkIcon({ className }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.5 3.5H3.5A1 1 0 0 0 2.5 4.5v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9.5 2.5h4v4M7.5 8.5l6-6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MacProjectWindow({
  screenshots = [],
  video,
  title,
  foreground,
  liveLink,
  isActive = false,
  warmMedia = false,
}) {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const videoRef = useRef(null);
  const hasVideo = Boolean(video);
  const shouldPlay = hasVideo && isActive;
  const shouldPreloadVideo = hasVideo && (shouldPlay || warmMedia);
  const canCycleScreens =
    !hasVideo && screenshots.length > 1;
  // Mobile: autoplay while project is active. Desktop: still hover-driven.
  const shouldCycleScreens = canCycleScreens && (isMobile ? isActive : isHovered);

  useEffect(() => {
    if (!shouldCycleScreens) return undefined;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % screenshots.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [shouldCycleScreens, screenshots.length]);

  // Restart slideshow from the first frame whenever this project leaves / re-enters
  useEffect(() => {
    if (isMobile) {
      if (!isActive) setActiveImage(0);
      return undefined;
    }
    if (!isHovered) setActiveImage(0);
    return undefined;
  }, [isMobile, isActive, isHovered]);

  // Prefetch hover frames through the optimizer so we never pull raw PNGs
  useEffect(() => {
    if (hasVideo || screenshots.length === 0) return undefined;
    screenshots.forEach((src) => prefetchOptimizedImage(src));
    return undefined;
  }, [screenshots, hasVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo || !shouldPreloadVideo) return undefined;
    el.preload = "auto";
    try {
      el.load();
    } catch {
      // ignore
    }
    return undefined;
  }, [shouldPreloadVideo, hasVideo, video]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return undefined;

    if (shouldPlay) {
      const play = () => {
        el.play().catch(() => {});
      };
      if (el.readyState >= 2) play();
      else {
        el.addEventListener("canplay", play, { once: true });
        return () => el.removeEventListener("canplay", play);
      }
      return undefined;
    }

    el.pause();
    return undefined;
  }, [shouldPlay, hasVideo]);

  const statusLabel = hasVideo
    ? shouldPlay
      ? "Playing"
      : "Video"
    : shouldCycleScreens || (isMobile && isActive)
      ? `${activeImage + 1} / ${screenshots.length}`
      : isMobile
        ? `${screenshots.length} shots`
        : "Hover to explore";

  return (
    <motion.div
      className="pointer-events-auto w-full overflow-hidden rounded-[20px] border border-black/15 bg-[#ececec] shadow-[0_35px_90px_rgba(0,0,0,0.34)]"
      onHoverStart={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onHoverEnd={() => {
        if (!isMobile) {
          setIsHovered(false);
          setActiveImage(0);
        }
      }}
      whileHover={isMobile ? undefined : { y: -10, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <div className="flex h-11 items-center border-b border-black/10 bg-[#e7e7e7] px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center rounded-md bg-black/6 font-gg-sans text-[9px] tracking-[0.08em] text-black/40">
          {title.toLowerCase().replaceAll(" ", "")}.com
        </div>
      </div>

      <div className="relative aspect-16/10 overflow-hidden bg-[#111]">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={video}
            className="absolute inset-0 h-full w-full object-contain object-center"
            muted
            loop
            playsInline
            preload={shouldPreloadVideo ? "auto" : "metadata"}
            aria-label={`${title} preview`}
          />
        ) : (
          screenshots.map((src, index) => (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: index === activeImage ? 1 : 0,
                scale: index === activeImage ? 1 : 1.012,
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <Image
                src={src}
                alt={`${title} screenshot ${index + 1}`}
                fill
                sizes="(max-width: 768px) 90vw, 50vw"
                quality={PROJECT_IMAGE_QUALITY}
                className="object-contain object-center"
                priority={isActive && index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          ))
        )}

        <div
          className="absolute bottom-3 right-3 z-20 rounded-full border px-3 py-1 font-gg-sans text-[9px] uppercase tracking-[0.14em] backdrop-blur-md"
          style={{
            color: foreground,
            borderColor: `${foreground}33`,
            backgroundColor: `${foreground}12`,
          }}
        >
          {statusLabel}
        </div>

        {liveLink ? (
          <AnimatePresence>
            {isHovered || (isMobile && isActive) ? (
              <motion.a
                key="live-site-link"
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-black/55 px-3 py-1.5 font-gg-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:bg-black/75 hover:border-white/40"
                onClick={(e) => e.stopPropagation()}
              >
                Live site
                <ExternalLinkIcon className="size-3.5 opacity-90" />
              </motion.a>
            ) : null}
          </AnimatePresence>
        ) : null}
      </div>
    </motion.div>
  );
}

function ProjectBeat({ project, progress, index, isActive, warmMedia = false }) {
  const count = PROJECTS.length;
  const start = index / count;
  const end = (index + 1) / count;
  const mid = (start + end) / 2;
  const isLast = index === count - 1;
  const isMobile = useIsMobile();

  const screenY = useTransform(
    progress,
    [start, mid, end],
    ["48vh", "0vh", "-52vh"]
  );
  // Copy moves vertically as one group so its baseline position stays intact...
  const copyY = useTransform(
    progress,
    [start, mid, end],
    ["32vh", "0vh", "-30vh"]
  );
  // ...while each line adds its own smaller vertical delta, creating parallax
  // between meta / title / description as they scroll (fastest → slowest).
  const metaYDelta = useTransform(
    progress,
    [start, mid, end],
    ["14vh", "0vh", "-8vh"]
  );
  const titleYDelta = useTransform(
    progress,
    [start, mid, end],
    ["8vh", "0vh", "-5vh"]
  );
  const descriptionYDelta = useTransform(
    progress,
    [start, mid, end],
    ["4vh", "0vh", "-2vh"]
  );
  const opacity = useTransform(
    progress,
    isLast
      ? [start, start + 0.055, 1]
      : [start, start + 0.055, end - 0.055, end],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const screenScale = useTransform(
    progress,
    [start, mid, end],
    [0.92, 1, 0.96]
  );
  // Number rides in/out with the beat while staying top-left over the ribbon.
  const numberY = useTransform(
    progress,
    [start, mid, end],
    ["18vh", "0vh", "-14vh"]
  );
  const numberScale = useTransform(progress, [start, mid, end], [0.9, 1, 0.94]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const openDetails = useCallback(() => setDetailsOpen(true), []);
  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  useEffect(() => {
    setDetailsOpen(false);
  }, [project.title]);

  return (
    <motion.article
      style={{ opacity, color: project.textColor ?? "#000000" }}
      className="pointer-events-none absolute inset-0"
      aria-label={`${project.title} project`}
    >
      <motion.span
        style={{ y: numberY, scale: numberScale }}
        className="absolute left-[calc(2.5vw+36px)] top-[3vh] z-30 hidden font-archivo-black text-[clamp(96px,18vw,320px)] leading-none tracking-tight text-current/25 md:block"
      >
        {project.number}
      </motion.span>

      {/*
        Mobile: one column — image + tech, then copy directly underneath.
        Desktop: md:contents unwraps so screen/copy can sit in their absolute slots.
      */}
      <motion.div
        style={isMobile ? { y: screenY, scale: screenScale } : undefined}
        className="absolute inset-x-0 top-[7vh] bottom-0 z-20 flex w-full flex-col overflow-y-auto overscroll-contain px-[5%] pointer-events-auto md:pointer-events-none md:contents"
      >
        <motion.div
          style={isMobile ? undefined : { y: screenY, scale: screenScale }}
          className="w-full md:absolute md:right-[3vw] md:top-[16vh] md:w-[50%]"
        >
          <MacProjectWindow
            screenshots={project.screenshots}
            video={project.video}
            title={project.title}
            foreground={project.foreground}
            liveLink={project.liveLink}
            isActive={isActive}
            warmMedia={warmMedia}
          />
          <TechTags
            items={project.tech ?? []}
            progress={progress}
            start={start}
            mid={mid}
            end={end}
            clampOnMobile={isMobile}
            onSeeMore={openDetails}
          />
        </motion.div>

        <motion.div
          style={isMobile ? undefined : { y: copyY }}
          className="z-40 mt-6 w-full pb-28 md:absolute md:bottom-[10vh] md:left-[calc(5vw+36px)] md:mt-0 md:w-[min(42vw,520px)] md:pb-0"
        >
          <motion.div
            style={{ y: isMobile ? 0 : metaYDelta }}
            className="mb-4 flex items-center gap-4 font-gg-sans uppercase tracking-[0.22em] opacity-60"
          >
            <span className="h-px w-10 bg-current opacity-40 font-bold" />
            <span className="font-bold">{project.type}</span>
          </motion.div>

          <motion.h3
            style={{
              y: isMobile ? 0 : titleYDelta,
              color: project.secondaryColor,
            }}
            className="relative z-40 font-archivo-black text-[clamp(36px,7.5vw,110px)] leading-[0.88] tracking-tight"
          >
            {project.title}
          </motion.h3>

          <ProjectDescription
            text={project.description}
            y={isMobile ? 0 : descriptionYDelta}
            clampOnMobile={isMobile}
            onSeeMore={openDetails}
          />
        </motion.div>
      </motion.div>

      {isMobile ? (
        <ProjectDetailsSheet
          open={detailsOpen}
          onClose={closeDetails}
          title={project.title}
          description={project.description}
          tech={project.tech ?? []}
        />
      ) : null}
    </motion.article>
  );
}

function ChevronIcon({ direction = "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-4"
      style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Right-rail index + bottom prev/next bar for jumping through projects.
 */
function ProjectGalleryNav({
  progress,
  activeIndex,
  onGoTo,
  onPrev,
  onNext,
}) {
  const opacity = useTransform(progress, [0.02, 0.07], [0, 1], { clamp: true });
  const y = useTransform(progress, [0.02, 0.08], [18, 0], { clamp: true });
  const pointerEvents = useTransform(opacity, (o) => (o > 0.35 ? "auto" : "none"));

  const active = PROJECTS[activeIndex] ?? PROJECTS[0];
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= PROJECTS.length - 1;

  return (
    <>
      {/* Vertical index rail — parked off-left, slides in when the cursor nears */}
      <motion.div
        style={{ opacity, y, pointerEvents }}
        className="group/rail absolute left-0 top-1/2 z-60 hidden h-[72vh] w-32 -translate-y-1/2 md:block"
      >
        <nav
          className="absolute left-5 top-1/2 flex -translate-x-11 -translate-y-1/2 flex-col items-start gap-1 transition-transform duration-500 ease-out group-hover/rail:translate-x-0 lg:left-7"
          aria-label="Project index"
        >
        <p className="mb-2 hidden font-gg-sans text-[10px] uppercase tracking-[0.22em] text-white/40 sm:block">
          Jump
        </p>
        <ul className="flex flex-col items-start gap-1.5">
          {PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={project.number}>
                <button
                  type="button"
                  onClick={() => onGoTo(index)}
                  aria-label={`Go to project ${project.number}: ${project.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors"
                >
                  <span
                    className={`relative flex h-8 min-w-8 items-center justify-center rounded-full border font-archivo-black text-[11px] tracking-wide transition-all duration-300 ${
                      isActive ? "scale-110 shadow-md" : "opacity-55 hover:opacity-100"
                    }`}
                    style={{
                      color: isActive ? "#111" : active.foreground,
                      borderColor: isActive
                        ? active.secondaryColor
                        : `${active.foreground}33`,
                      backgroundColor: isActive
                        ? active.secondaryColor
                        : `${active.foreground}0f`,
                    }}
                  >
                    {project.number}
                    {isActive ? (
                      <motion.span
                        layoutId="project-nav-active"
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 0 1px ${active.secondaryColor}55, 0 8px 22px ${active.secondaryColor}44`,
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    ) : null}
                  </span>
                  <span
                    className={`hidden max-w-0 overflow-hidden whitespace-nowrap font-gg-sans text-[11px] uppercase tracking-[0.14em] transition-all duration-300 group-hover:max-w-36 sm:block ${
                      isActive ? "max-w-36 opacity-90" : "opacity-0 group-hover:opacity-70"
                    }`}
                    style={{ color: isActive ? active.foreground : `${active.foreground}99` }}
                  >
                    {project.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-gg-sans text-[10px] tracking-[0.18em] text-black/35">
          {String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
        </p>
        </nav>
      </motion.div>

      {/* Bottom transport bar — prev / current / next */}
      <motion.div
        style={{ opacity, y, pointerEvents }}
        className="absolute bottom-5 left-1/2 z-60 flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-2 sm:bottom-7"
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label={isFirst ? "Back to projects intro" : "Previous project"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white/70 text-black/80 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-black active:scale-95 disabled:opacity-35"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="min-w-0 flex-1 overflow-hidden rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-center shadow-sm backdrop-blur-md">
          <p className="font-gg-sans text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold">
            Now viewing
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="truncate font-archivo-black text-[13px] tracking-tight text-black sm:text-[14px]"
            >
              {active.title}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          aria-label="Next project"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white/70 text-black/80 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-black active:scale-95 disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronIcon direction="right" />
        </button>
      </motion.div>
    </>
  );
}

/**
 * Projects underlayer — revealed by the Offerings curtain slide.
 *
 * 1. Curtain: white landing; "MY PROJECTS" eases left → center.
 * 2. Intro: heading scoots up; intro copy fades in (still white, no ribbon).
 * 3. Gallery: white land exits; project color + diagonal ribbon enter; snap beats.
 */
export default function MyProjects({
  curtainProgress,
  introProgress,
  projectsProgress,
  activeProjectIndex = 0,
  onGoToProject,
  onNextProject,
  onPrevProject,
}) {
  const [themeIndex, setThemeIndex] = useState(activeProjectIndex);
  /** Only treat a project as on-screen once the gallery phase has actually started. */
  const [galleryVisible, setGalleryVisible] = useState(false);
  /** Start warming media once the projects curtain begins (or shortly after mount). */
  const [warmMedia, setWarmMedia] = useState(false);
  /** Live scroll-derived index — keeps look-ahead mounts in sync during fast snaps. */
  const [progressIndex, setProgressIndex] = useState(0);
  const isMobile = useIsMobile();

  useProjectMediaWarmup(warmMedia);

  useEffect(() => {
    // Kick off early so hero/about/offerings scroll time is used for downloads
    const kickoff = window.setTimeout(() => setWarmMedia(true), 1200);
    return () => window.clearTimeout(kickoff);
  }, []);

  useMotionValueEvent(curtainProgress, "change", (value) => {
    if (value > 0.01) setWarmMedia(true);
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setThemeIndex(activeProjectIndex);
    }, COLOR_CHANGE_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [activeProjectIndex]);

  useMotionValueEvent(projectsProgress, "change", (value) => {
    setGalleryVisible(value > 0.04);
    const idx = Math.min(
      PROJECT_COUNT - 1,
      Math.max(0, Math.floor(value * PROJECT_COUNT))
    );
    setProgressIndex((prev) => (prev === idx ? prev : idx));
  });
  useEffect(() => {
    setGalleryVisible(projectsProgress.get() > 0.04);
    const value = projectsProgress.get();
    const idx = Math.min(
      PROJECT_COUNT - 1,
      Math.max(0, Math.floor(value * PROJECT_COUNT))
    );
    setProgressIndex(idx);
  }, [projectsProgress]);

  // —— Phase 1: left → center during curtain peel ——
  // x offsets are relative to a centered flex container (justify-center).
  const enterX = useTransform(curtainProgress, [0.05, 0.95], ["-42vw", "0vw"], {
    clamp: true,
  });
  const enterOpacity = useTransform(curtainProgress, [0.02, 0.22], [0, 1], {
    clamp: true,
  });

  // —— Phase 2: intro copy appears; heading scoots up so the pair stays centered ——
  // Subtitle is absolutely positioned under the title so it never expands the
  // flex box early; the title lifts by ~half the subtitle block height instead.
  const titleScootY = useTransform(introProgress, [0, 0.75], [0, -28], {
    clamp: true,
  });
  const subOpacity = useTransform(introProgress, [0.12, 0.55], [0, 1], {
    clamp: true,
  });
  const subY = useTransform(introProgress, [0.1, 0.6], [14, 0], {
    clamp: true,
  });
  const subBlur = useTransform(introProgress, [0.1, 0.55], [8, 0], {
    clamp: true,
  });
  const subFilter = useTransform(subBlur, (b) =>
    b > 0.05 ? `blur(${b}px)` : "blur(0px)"
  );

  // —— Phase 3: exit as gallery begins ——
  // Exit must finish before the first project's settle mid (index 0 mid ≈ 0.1),
  // otherwise the intro heading lingers over the first beat.
  const exitOpacity = useTransform(projectsProgress, [0, 0.045], [1, 0], {
    clamp: true,
  });
  const exitY = useTransform(projectsProgress, [0, 0.05], [0, -56], {
    clamp: true,
  });
  const exitScale = useTransform(projectsProgress, [0, 0.045], [1, 0.92], {
    clamp: true,
  });
  const exitBlur = useTransform(projectsProgress, [0, 0.045], [0, 14], {
    clamp: true,
  });
  const exitFilter = useTransform(exitBlur, (b) =>
    b > 0.05 ? `blur(${b}px)` : "blur(0px)"
  );

  const introChromeOpacity = useTransform(
    [enterOpacity, exitOpacity],
    ([enter, exit]) => enter * exit
  );
  // Keep chrome unmounted from hit-testing once fully gone (also avoids mix-layer glitches).
  const introChromeVisibility = useTransform(introChromeOpacity, (o) =>
    o < 0.01 ? "hidden" : "visible"
  );

  // Solid white base once the curtain peels — never fades out. Fading semi-
  // transparent layers revealed the sticky Hero underneath.
  const whiteBaseOpacity = useTransform(curtainProgress, [0, 0.08], [0, 1], {
    clamp: true,
  });

  const activeProject =
    PROJECTS[Math.min(PROJECTS.length - 1, Math.max(0, themeIndex))];
  const projectBgColor = useSprungColor(activeProject.primaryColor);
  const meshLineColor = useSprungColor(
    activeProject.meshColor ?? DEFAULT_MESH_COLOR
  );
  const meshBackgroundImage = useTransform(meshLineColor, (rgb) => {
    const rgba = rgb.replace("rgb(", "rgba(").replace(")", `, ${MESH_LINE_OPACITY})`);
    return `linear-gradient(to right, ${rgba} 1px, transparent 1px), linear-gradient(to bottom, ${rgba} 1px, transparent 1px)`;
  });
  const ribbonDark = useSprungColor(darkerShade(activeProject.secondaryColor));
  const ribbonLight = useSprungColor(lighterShade(activeProject.secondaryColor));
  const ribbonGradient = useTransform(
    [ribbonDark, ribbonLight],
    ([dark, light]) => `linear-gradient(90deg, ${dark} 0%, ${light} 100%)`
  );

  const projectBgOpacity = useTransform(projectsProgress, [0, 0.04], [0, 1], {
    clamp: true,
  });

  // Ribbon must be fully on-screen by first-project settle (~0.1), so finish early.
  const ribbonX = useTransform(projectsProgress, [0, 0.05], ["-70vw", "0vw"], {
    clamp: true,
  });
  const ribbonOpacity = useTransform(projectsProgress, [0, 0.035], [0, 1], {
    clamp: true,
  });

  // Project beats show once gallery starts.
  const galleryOpacity = useTransform(projectsProgress, [0, 0.03], [0, 1], {
    clamp: true,
  });

  return (
    <motion.section
      id="myProjects"
      className="absolute inset-0 z-0 h-full w-full overflow-hidden"
      aria-label="My Projects"
    >
      {/* Opaque white underlayer for curtain + intro (stays put under project color) */}
      <motion.div
        className="absolute inset-0 z-0 bg-white"
        style={{ opacity: whiteBaseOpacity }}
      />

      {/* Per-project color — opaque, covers white (and never shows the Hero) */}
      <motion.div
        className="absolute inset-0 z-1"
        style={{ backgroundColor: projectBgColor, opacity: projectBgOpacity }}
      />

      {/* Soft mesh grid — line color from project.meshColor (defaults to white) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-2"
        style={{
          opacity: galleryOpacity,
          backgroundImage: meshBackgroundImage,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        aria-hidden
        style={{
          x: ribbonX,
          opacity: ribbonOpacity,
          background: ribbonGradient,
        }}
        className="absolute z-10 top-[-22%] left-[-42%] h-[260px] w-[720px] rotate-[-35deg] sm:top-[-14%] sm:left-[-32%] sm:h-[300px] sm:w-[820px] md:top-[-10%] md:left-[-27%] md:h-85 md:w-355"
      />

      {/* Soft white radial glow — bottom-right of the project gallery (desktop only) */}
      <motion.div
        aria-hidden
        style={{
          opacity: galleryOpacity,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 72%)",
        }}
        className="pointer-events-none absolute -bottom-[22%] -right-[16%] z-10 hidden size-[70vw] max-h-180 max-w-180 min-h-80 min-w-80 rounded-full md:block"
      />

      {/* Intro chrome: slides in from left, then title + subtitle as a vertical stack. */}
      <motion.div
        style={{
          x: enterX,
          y: exitY,
          opacity: introChromeOpacity,
          scale: exitScale,
          filter: isMobile ? "none" : exitFilter,
          visibility: introChromeVisibility,
        }}
        className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-6 will-change-[transform,filter,opacity]"
      >
        <div className="relative flex flex-col items-center">
          <motion.h2
            style={{ y: titleScootY }}
            className="whitespace-nowrap text-center font-ginto text-[32px] uppercase leading-none tracking-tight text-black sm:text-[clamp(32px,calc(10vw-20px),100px)]"
          >
            MY PROJECTS
          </motion.h2>

          <motion.p
            style={{
              opacity: subOpacity,
              y: subY,
              filter: isMobile ? "none" : subFilter,
              x: "-50%",
            }}
            className="absolute left-1/2 top-full mt-5 w-[min(92vw,48rem)] text-center font-gg-sans text-[21px] font-bold leading-snug tracking-wide text-black/55 sm:text-[clamp(16px,1.5vw,34px)]"
          >
            Scroll to see some of the stuff I&apos;ve worked on or helped build :)
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-20"
        style={{ opacity: galleryOpacity }}
      >
        {PROJECTS.map((project, index) => {
          // Span active ↔ live progress so fast snaps never unmount the in-between beat.
          // +2 look-ahead pre-mounts the next window (and its screenshots) before opacity rises.
          const spanLo = Math.min(progressIndex, activeProjectIndex);
          const spanHi = Math.max(progressIndex, activeProjectIndex);
          const mountLo = Math.max(0, spanLo - 1);
          const mountHi = Math.min(PROJECT_COUNT - 1, spanHi + 2);
          const isMounted = index >= mountLo && index <= mountHi;

          if (!isMounted && galleryVisible) return null;
          // Before gallery is visible, prep the first two so the first snap is instant
          if (!galleryVisible && index > 1) return null;

          const nearActive = Math.abs(index - activeProjectIndex) <= 1;
          const nearProgress = Math.abs(index - progressIndex) <= 1;

          return (
            <ProjectBeat
              key={project.title}
              project={project}
              progress={projectsProgress}
              index={index}
              isActive={galleryVisible && activeProjectIndex === index}
              warmMedia={warmMedia && (nearActive || nearProgress)}
            />
          );
        })}
      </motion.div>

      {onGoToProject && onNextProject && onPrevProject ? (
        <ProjectGalleryNav
          progress={projectsProgress}
          activeIndex={activeProjectIndex}
          onGoTo={onGoToProject}
          onPrev={onPrevProject}
          onNext={onNextProject}
        />
      ) : null}
    </motion.section>
  );
}
