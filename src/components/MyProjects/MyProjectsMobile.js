"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  PROJECT_IMAGE_QUALITY,
  prefetchOptimizedImage,
} from "@/lib/optimizedImage";
import { PROJECTS } from "@/components/MyProjects/MyProjects";
import { SNAP_SECTION } from "@/hooks/useMobileSnap";

const TECH_STYLES = {
  JavaScript: { bg: "#F7DF1E", text: "#1a1a1a" },
  TypeScript: { bg: "#3178C6", text: "#FFFFFF" },
  React: { bg: "#61DAFB", text: "#0b1a22" },
  "Next.js": { bg: "#111111", text: "#FFFFFF" },
  NestJS: { bg: "#E0234E", text: "#FFFFFF" },
  "Node.js": { bg: "#339933", text: "#FFFFFF" },
  MongoDB: { bg: "#47A248", text: "#FFFFFF" },
  Terraform: { bg: "#7B42BC", text: "#FFFFFF" },
  FastAPI: { bg: "#009688", text: "#FFFFFF" },
  Anthropic: { bg: "#D4A27F", text: "#1a1a1a" },
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

const FOOTER_CONTACTS = [
  {
    id: "linkedin",
    src: "/contacts/linkedin.svg",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hamza-khalid-5a40931a5/",
  },
  {
    id: "github",
    src: "/contacts/github.svg",
    label: "Github",
    href: "https://github.com/hamzakhalid141999",
  },
  {
    id: "mail",
    src: "/contacts/mail.svg",
    label: "Email",
    href: "mailto:hamzakhalid141999@gmail.com",
  },
];

const TECH_VISIBLE = 5;
const DEFAULT_MESH = "#FFFFFF";

function techStyle(name) {
  return TECH_STYLES[name] ?? { bg: "#2a2a2a", text: "#FFFFFF" };
}

function hexToRgb(hex) {
  const raw = String(hex).replace("#", "");
  const full =
    raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return { r: 120, g: 140, b: 80 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function darkerShade(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * 0.6)}, ${Math.round(g * 0.6)}, ${Math.round(b * 0.6)})`;
}

function lighterShade(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r + (255 - r) * 0.45)}, ${Math.round(g + (255 - g) * 0.45)}, ${Math.round(b + (255 - b) * 0.45)})`;
}

function SnapSlide({ id, className = "", onActiveChange, children }) {
  const [active, setActive] = useState(false);
  return (
    <motion.section
      id={id}
      data-snap
      className={`${SNAP_SECTION} ${className}`}
      onViewportEnter={() => {
        setActive(true);
        onActiveChange?.(true);
      }}
      onViewportLeave={() => {
        setActive(false);
        onActiveChange?.(false);
      }}
      viewport={{ amount: 0.45, margin: "0px" }}
    >
      {typeof children === "function" ? children(active) : children}
    </motion.section>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
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

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close details"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} details`}
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
              {tech.map((name) => {
                const { bg, text } = techStyle(name);
                return (
                  <span
                    key={name}
                    style={{ backgroundColor: bg, color: text }}
                    className="inline-flex items-center rounded-md px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em]"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
        <p className="mb-2.5 font-gg-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
          Description
        </p>
        <p className="whitespace-pre-line font-gg-sans text-[17px] font-normal leading-snug text-white/80">
          {description}
        </p>
      </div>
    </div>,
    document.body
  );
}

function MobileVideo({ src, title, active }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      src={src}
      className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
      muted
      loop
      playsInline
      controls={false}
      preload={active ? "auto" : "metadata"}
      aria-label={`${title} preview`}
    />
  );
}

function ProjectWindow({ project, active }) {
  const [shot, setShot] = useState(0);
  const screenshots = project.screenshots ?? [];
  const hasVideo = Boolean(project.video);

  useEffect(() => {
    if (hasVideo || !active || screenshots.length < 2) return undefined;
    const id = window.setInterval(() => {
      setShot((current) => (current + 1) % screenshots.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, [active, hasVideo, screenshots.length]);

  useEffect(() => {
    if (!active) setShot(0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    screenshots.slice(0, 3).forEach((src) => prefetchOptimizedImage(src));
  }, [active, screenshots]);

  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-black/15 bg-[#ececec] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
      <div className="flex h-11 items-center border-b border-black/10 bg-[#e7e7e7] px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center rounded-md bg-black/6 font-gg-sans text-[9px] tracking-[0.08em] text-black/40">
          {project.title.toLowerCase().replaceAll(" ", "")}.com
        </div>
      </div>
      <div className="relative aspect-16/10 overflow-hidden bg-[#111]">
        {hasVideo ? (
          <MobileVideo src={project.video} title={project.title} active={active} />
        ) : null}
        {!hasVideo
          ? screenshots.map((src, index) => (
              <div
                key={src}
                className="absolute inset-0"
                style={{ opacity: index === shot ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  sizes="90vw"
                  quality={PROJECT_IMAGE_QUALITY}
                  className="object-contain object-center"
                  priority={active && index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))
          : null}
        {project.liveLink ? (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-black/55 px-3 py-1.5 font-gg-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Live site
            <ExternalLinkIcon className="size-3.5 opacity-90" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ProjectDescriptionMobile({ text, onSeeMore }) {
  const [needsMore, setNeedsMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
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
  }, [text]);

  return (
    <div className="mt-3 max-w-md">
      <p
        ref={textRef}
        className="line-clamp-8 whitespace-pre-line font-gg-sans text-[16px] font-normal leading-snug opacity-80"
      >
        {text}
      </p>
      {needsMore ? (
        <button
          type="button"
          onClick={onSeeMore}
          className="mt-1.5 font-gg-sans text-[13px] uppercase tracking-[0.12em] underline underline-offset-2 opacity-70"
        >
          see more
        </button>
      ) : null}
    </div>
  );
}

function ProjectSnapCard({ project, active, onSeeMore }) {
  const tech = project.tech ?? [];
  const truncated = tech.length > TECH_VISIBLE;
  const visible = truncated ? tech.slice(0, TECH_VISIBLE) : tech;
  const mesh = project.meshColor ?? DEFAULT_MESH;

  return (
    <article
      className="relative flex h-full w-full flex-col overflow-hidden px-[5%] pt-[8vh] pb-8"
      style={{ color: project.textColor ?? "#000000" }}
      aria-label={`${project.title} project`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, ${mesh} 1px, transparent 1px), linear-gradient(to bottom, ${mesh} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 min-h-0 flex-1">
        <ProjectWindow project={project} active={active} />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {visible.map((name) => {
            const { bg, text } = techStyle(name);
            return (
              <span
                key={name}
                style={{ backgroundColor: bg, color: text }}
                className="inline-flex items-center rounded-md px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em]"
              >
                {name}
              </span>
            );
          })}
          {truncated ? (
            <button
              type="button"
              onClick={onSeeMore}
              className="inline-flex items-center rounded-md border border-current/25 px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em] opacity-70"
            >
              see more
            </button>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-4 font-gg-sans uppercase tracking-[0.22em] opacity-60">
            <span className="h-px w-10 bg-current opacity-40" />
            <span className="font-bold">{project.type}</span>
          </div>
          <h3
            className="font-archivo-black text-[clamp(36px,9vw,64px)] leading-[0.88] tracking-tight"
            style={{ color: project.secondaryColor }}
          >
            {project.title}
          </h3>
          <ProjectDescriptionMobile
            text={project.description}
            onSeeMore={onSeeMore}
          />
        </div>
      </div>
    </article>
  );
}

export default function MyProjectsMobile() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [detailsIndex, setDetailsIndex] = useState(null);
  const [footerActive, setFooterActive] = useState(false);

  const onProjectActive = useCallback((index, isActive) => {
    if (isActive) setActiveIndex(index);
  }, []);

  const active = activeIndex == null ? null : PROJECTS[activeIndex];
  const ribbonGradient = active
    ? `linear-gradient(90deg, ${darkerShade(active.secondaryColor)} 0%, ${lighterShade(active.secondaryColor)} 100%)`
    : "transparent";
  const detailsProject =
    detailsIndex == null ? null : PROJECTS[detailsIndex];

  return (
    <div id="myProjects" className="relative z-0 w-full">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-10 top-[-18%] left-[-48%] h-[240px] w-[640px] rotate-[-35deg]"
        animate={{
          opacity: active ? 1 : 0,
          background: ribbonGradient,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <SnapSlide
        id="projects-intro"
        className="bg-white"
        onActiveChange={(on) => {
          if (on) setActiveIndex(null);
        }}
      >
        {(introActive) => (
          <div className="flex h-full w-full items-center justify-center px-6">
            <motion.div
              className="text-center"
              initial={false}
              animate={
                introActive
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0.45, y: 12 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-ginto text-[32px] uppercase leading-none tracking-tight text-black">
                MY PROJECTS
              </h2>
              <p className="mt-5 max-w-xl font-gg-sans text-[18px] font-medium leading-snug text-black/55">
                Scroll to see some of the stuff I&apos;ve worked on or helped
                build :)
              </p>
            </motion.div>
          </div>
        )}
      </SnapSlide>

      {PROJECTS.map((project, index) => (
        <SnapSlide
          key={project.title}
          id={`project-slide-${index}`}
          className="overflow-hidden"
          onActiveChange={(isActive) => onProjectActive(index, isActive)}
        >
          {(slideActive) => (
            <div
              className="h-full w-full"
              style={{ backgroundColor: project.primaryColor }}
            >
              <ProjectSnapCard
                project={project}
                active={slideActive}
                onSeeMore={() => setDetailsIndex(index)}
              />
            </div>
          )}
        </SnapSlide>
      ))}

      <SnapSlide
        id="projects-footer"
        className="relative overflow-hidden bg-black"
        onActiveChange={(on) => {
          setFooterActive(on);
          if (on) setActiveIndex(null);
        }}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6">
          {FOOTER_CONTACTS.map((contact, index) => {
            const isMail = contact.href.startsWith("mailto:");
            return (
              <motion.a
                key={contact.id}
                href={contact.href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                aria-label={contact.label}
                initial={false}
                animate={
                  footerActive
                    ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, y: 36, scale: 0.82, filter: "blur(14px)" }
                }
                transition={{
                  delay: index * 0.16,
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  mass: 0.7,
                }}
                className="flex items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contact.src}
                  alt=""
                  className="h-10 w-auto opacity-80"
                  draggable={false}
                />
                <span className="ml-1 font-archivo-black text-[clamp(28px,8vw,44px)] leading-none text-white/80">
                  {contact.label}
                </span>
              </motion.a>
            );
          })}
        </div>
        <h2 className="pointer-events-none absolute bottom-0 left-0 w-full origin-bottom scale-y-65 text-center font-gondens text-[clamp(3.75rem,18vw,22rem)] uppercase leading-none tracking-tight text-white/30">
          HKENABLES
        </h2>
      </SnapSlide>

      <ProjectDetailsSheet
        open={detailsProject != null}
        onClose={() => setDetailsIndex(null)}
        title={detailsProject?.title ?? ""}
        description={detailsProject?.description ?? ""}
        tech={detailsProject?.tech ?? []}
      />
    </div>
  );
}
