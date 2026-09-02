"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";

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

const PROJECTS = [
  {
    number: "01",
    title: "H&S Auditor",
    type: "AI Health & Safety Auditor",
    description:
      "An AI-powered health and safety auditor that can help you identify and mitigate risks in your workplace or sites and generates a detailed excel with recommendations.",
    liveLink: "https://www.isekaiverse.io/",
    primaryColor: "#192222",
    secondaryColor: "#17FFC6",
    foreground: "#111111",
    textColor: "#FFFFFF",
    tech: [],
    video: "/projects-screenshots/hns-audit.mp4",
  },
  {
    number: "02",
    title: "BatchEdits",
    type: "Bulk Video Editor",
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
  },
  {
    number: "03",
    title: "Redbook",
    type: "Certified Listings Platform",
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
    number: "04",
    title: "FARBE",
    type: "NFT Marketplace",
    description:
      "An online NFT marketplace where artists could publish and sell their work, with support for multiple crypto wallets including MetaMask.",
    liveLink: "https://www.isekaiverse.io/",
    primaryColor: "#FFFFFF",
    secondaryColor: "#17FFC6",
    foreground: "#111111",
    textColor: "#000000",
    tech: ["JavaScript", "Next.js", "AWS", "MetaMask", "The Graph"],
    screenshots: Array.from(
      { length: 9 },
      (_, i) => `/projects-screenshots/fb-${i + 1}.png`
    ),
  },
  {
    number: "05",
    title: "Facing North",
    type: "Travel Agency",
    description:
      "A travel platform for customized tours showcasing the natural beauty, cultural heritage, and way of life across Pakistan's northern region.",
    primaryColor: "#73EAFC",
    secondaryColor: "#18B5CD",
    foreground: "#10252a",
    textColor: "#000000",
    tech: ["TypeScript", "Next.js", "AWS"],
    screenshots: Array.from(
      { length: 12 },
      (_, i) => `/projects-screenshots/fn-${i + 1}.png`
    ),
  },
  {
    number: "06",
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
    number: "07",
    title: "Rentto",
    type: "Real Estate Portal",
    description:
      "A direct rental marketplace for workplaces and properties, connecting renters with owners without the friction of a middleman.",
    liveLink: "https://renttoapp.com/",
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
    number: "08",
    title: "Zilaay",
    type: "Real Estate Portal",
    description:
      "A modern property portal bringing buyers and sellers closer through international-standard listings and map-based boundary search.",
    primaryColor: "#73EAFC",
    secondaryColor: "#18B5CD",
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
      className="inline-flex items-center rounded-md px-2.5 py-1 font-gruppo text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm sm:text-[12px]"
    >
      {name}
    </motion.span>
  );
}

function TechTags({ items, progress, start, mid, end }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {items.map((name, index) => (
        <TechTag
          key={name}
          name={name}
          index={index}
          count={items.length}
          progress={progress}
          start={start}
          mid={mid}
          end={end}
        />
      ))}
    </div>
  );
}

function MacProjectWindow({
  screenshots = [],
  video,
  title,
  foreground,
  isActive = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const videoRef = useRef(null);
  const hasVideo = Boolean(video);
  const shouldPlay = hasVideo && isActive;

  useEffect(() => {
    if (!isHovered || screenshots.length < 2 || hasVideo) return undefined;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % screenshots.length);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isHovered, screenshots.length, hasVideo]);

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

  return (
    <motion.div
      className="pointer-events-auto w-full overflow-hidden rounded-[20px] border border-black/15 bg-[#ececec] shadow-[0_35px_90px_rgba(0,0,0,0.34)]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setActiveImage(0);
      }}
      whileHover={{ y: -10, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <div className="flex h-11 items-center border-b border-black/10 bg-[#e7e7e7] px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center rounded-md bg-black/6 font-gruppo text-[9px] tracking-[0.08em] text-black/40">
          {title.toLowerCase().replaceAll(" ", "")}.com
        </div>
      </div>

      <div className="relative aspect-16/10 overflow-hidden bg-black">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={video}
            className="absolute inset-0 h-full w-full object-contain object-center"
            muted
            loop
            playsInline
            preload={shouldPlay ? "auto" : "none"}
            aria-label={`${title} preview`}
          />
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key={screenshots[activeImage]}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.012 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: "easeInOut" }}
            >
              <Image
                src={screenshots[activeImage]}
                alt={`${title} screenshot ${activeImage + 1}`}
                fill
                sizes="52vw"
                className="object-contain object-center"
                priority={activeImage === 0}
              />
            </motion.div>
          </AnimatePresence>
        )}

        <div
          className="absolute bottom-3 right-3 z-20 rounded-full border px-3 py-1 font-gruppo text-[9px] uppercase tracking-[0.14em] backdrop-blur-md"
          style={{
            color: foreground,
            borderColor: `${foreground}33`,
            backgroundColor: `${foreground}12`,
          }}
        >
          {hasVideo
            ? shouldPlay
              ? "Playing"
              : "Video"
            : isHovered
              ? `${activeImage + 1} / ${screenshots.length}`
              : "Hover to explore"}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectBeat({ project, progress, index, isActive }) {
  const count = PROJECTS.length;
  const start = index / count;
  const end = (index + 1) / count;
  const mid = (start + end) / 2;
  const isLast = index === count - 1;

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

  return (
    <motion.article
      style={{ opacity, color: project.textColor ?? "#000000" }}
      className="pointer-events-none absolute inset-0"
      aria-label={`${project.title} project`}
    >
      <motion.span
        style={{ y: numberY, scale: numberScale }}
        className="absolute left-[calc(2.5vw+36px)] top-[3vh] z-30 font-archivo-black text-[clamp(96px,18vw,320px)] leading-none tracking-tight text-current/25"
      >
        {project.number}
      </motion.span>

      {/* Screen under copy so long titles always sit on top of the window. */}
      <motion.div
        style={{ y: screenY, scale: screenScale }}
        className="absolute right-[5%] top-[17vh] z-20 w-[90%] md:right-[3vw] md:top-[16vh] md:w-[50%]"
      >
        <MacProjectWindow
          screenshots={project.screenshots}
          video={project.video}
          title={project.title}
          foreground={project.foreground}
          isActive={isActive}
        />
        <TechTags
          items={project.tech ?? []}
          progress={progress}
          start={start}
          mid={mid}
          end={end}
        />
      </motion.div>

      <motion.div
        style={{ y: copyY }}
        className="absolute bottom-[15vh] left-[6%] z-40 w-[90%] md:bottom-[10vh] md:left-[calc(5vw+36px)] md:w-[min(42vw,520px)]"
      >
        <motion.div
          style={{ y: metaYDelta }}
          className="mb-4 flex items-center gap-4 font-gruppo uppercase tracking-[0.22em] opacity-60"
        >
          <span className="h-px w-10 bg-current opacity-40 font-bold" />
          <span className="font-bold">{project.type}</span>
        </motion.div>

        <motion.h3
          style={{ y: titleYDelta, color: project.secondaryColor }}
          className="relative z-40 font-archivo-black text-[clamp(44px,7.5vw,110px)] leading-[0.88] tracking-tight"
        >
          {project.title}
        </motion.h3>

        <motion.p
          style={{ y: descriptionYDelta }}
          className="mt-5 max-w-md whitespace-pre-line font-gruppo text-[clamp(15px,1.4vw,20px)] font-bold leading-snug opacity-80"
        >
          {project.description}
        </motion.p>

        <div className="mt-6">
          {project.liveLink ? (
            <span className="font-gruppo text-[11px] uppercase tracking-[0.18em] opacity-55">
              Live project ↗
            </span>
          ) : (
            <span className="font-gruppo text-[11px] uppercase tracking-[0.18em] opacity-45">
              Selected work
            </span>
          )}
        </div>
      </motion.div>
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
        <p className="mb-2 hidden font-gruppo text-[10px] uppercase tracking-[0.22em] text-white/40 sm:block">
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
                    className={`hidden max-w-0 overflow-hidden whitespace-nowrap font-gruppo text-[11px] uppercase tracking-[0.14em] transition-all duration-300 group-hover:max-w-36 sm:block ${
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
        <p className="mt-3 font-gruppo text-[10px] tracking-[0.18em] text-black/35">
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
          <p className="font-gruppo text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold">
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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setThemeIndex(activeProjectIndex);
    }, COLOR_CHANGE_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [activeProjectIndex]);

  useMotionValueEvent(projectsProgress, "change", (value) => {
    setGalleryVisible(value > 0.04);
  });
  useEffect(() => {
    setGalleryVisible(projectsProgress.get() > 0.04);
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

      {/* Soft light-grey grid — reads as a lighter wash of the project bg */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-2"
        style={{
          opacity: galleryOpacity,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
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

      {/* Soft white radial glow — bottom-right of the project gallery */}
      <motion.div
        aria-hidden
        style={{
          opacity: galleryOpacity,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 72%)",
        }}
        className="pointer-events-none absolute -bottom-[22%] -right-[16%] z-10 size-[70vw] max-h-180 max-w-180 min-h-80 min-w-80 rounded-full"
      />

      {/* Intro chrome: slides in from left, then title + subtitle as a vertical stack. */}
      <motion.div
        style={{
          x: enterX,
          y: exitY,
          opacity: introChromeOpacity,
          scale: exitScale,
          filter: exitFilter,
          visibility: introChromeVisibility,
        }}
        className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-6 will-change-[transform,filter,opacity]"
      >
        <div className="relative flex flex-col items-center">
          <motion.h2
            style={{ y: titleScootY }}
            className="whitespace-nowrap text-center font-climate-crisis text-[42px] uppercase leading-none tracking-tight text-black sm:text-[clamp(36px,calc(10vw-20px),100px)]"
          >
            MY PROJECTS
          </motion.h2>

          <motion.p
            style={{
              opacity: subOpacity,
              y: subY,
              filter: subFilter,
              x: "-50%",
            }}
            className="absolute left-1/2 top-full mt-5 w-[min(92vw,48rem)] text-center font-gruppo text-[21px] font-bold leading-snug tracking-wide text-black/55 sm:text-[clamp(16px,1.5vw,34px)]"
          >
            Scroll to see some of the stuff I&apos;ve worked on or helped build :)
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-20"
        style={{ opacity: galleryOpacity }}
      >
        {PROJECTS.map((project, index) => (
          <ProjectBeat
            key={project.title}
            project={project}
            progress={projectsProgress}
            index={index}
            isActive={galleryVisible && activeProjectIndex === index}
          />
        ))}
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
