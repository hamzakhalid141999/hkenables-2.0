"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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

function slideId(index) {
  return `project-slide-${index}`;
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

function ProjectWindow({ project, active, mountMedia }) {
  const [shot, setShot] = useState(0);
  const screenshots = project.screenshots ?? [];
  const hasVideo = Boolean(project.video);

  useEffect(() => {
    if (!mountMedia || hasVideo || !active || screenshots.length < 2) return undefined;
    const id = window.setInterval(() => {
      setShot((current) => (current + 1) % screenshots.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, [active, hasVideo, mountMedia, screenshots.length]);

  useEffect(() => {
    if (!active) setShot(0);
  }, [active]);

  useEffect(() => {
    if (!mountMedia) return;
    screenshots.slice(0, 3).forEach((src) => prefetchOptimizedImage(src));
  }, [mountMedia, screenshots]);

  return (
    <div className="pointer-events-none w-full overflow-hidden rounded-[20px] border border-black/15 bg-[#ececec] shadow-[0_35px_90px_rgba(0,0,0,0.34)]">
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
        {mountMedia && hasVideo ? (
          <MobileVideo
            src={project.video}
            title={project.title}
            active={active}
          />
        ) : null}
        {mountMedia && !hasVideo
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
            className="pointer-events-auto absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-black/55 px-3 py-1.5 font-gg-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Live site
            <ExternalLinkIcon className="size-3.5 opacity-90" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ProjectSlide({ project, index, active, mountMedia, onVisible, onSeeMore }) {
  const sectionRef = useRef(null);
  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;
  const tech = project.tech ?? [];
  const truncated = tech.length > TECH_VISIBLE;
  const visible = truncated ? tech.slice(0, TECH_VISIBLE) : tech;
  const mesh = project.meshColor ?? DEFAULT_MESH;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          onVisibleRef.current();
        }
      },
      { threshold: [0.55, 0.75] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={slideId(index)}
      data-snap
      className={`relative ${SNAP_SECTION} overflow-hidden`}
      style={{ backgroundColor: project.primaryColor, color: project.textColor }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, ${mesh} 1px, transparent 1px), linear-gradient(to bottom, ${mesh} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 flex h-full flex-col px-[5%] pt-[7vh] pb-28">
        <motion.div
          initial={false}
          animate={
            active
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0.35, y: 48, scale: 0.92 }
          }
          transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
        >
          <ProjectWindow project={project} active={active} mountMedia={mountMedia} />
        </motion.div>
        <motion.div
          className="mt-4 flex flex-wrap items-center gap-2"
          initial={false}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.45, delay: active ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
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
              className="pointer-events-auto inline-flex items-center rounded-md border border-current/25 px-2.5 py-1 font-gg-sans text-[11px] font-bold uppercase tracking-[0.08em] opacity-70"
            >
              see more
            </button>
          ) : null}
        </motion.div>
        <motion.div
          className="mt-5"
          initial={false}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.5, delay: active ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex items-center gap-4 font-gg-sans uppercase tracking-[0.22em] opacity-60">
            <span className="h-px w-10 bg-current opacity-40" />
            <span className="font-bold">{project.type}</span>
          </div>
          <h3
            className="font-archivo-black text-[clamp(36px,9vw,72px)] leading-[0.88] tracking-tight"
            style={{ color: project.secondaryColor }}
          >
            {project.title}
          </h3>
          <p className="mt-4 line-clamp-3 max-w-md font-gg-sans text-[17px] font-normal leading-snug opacity-80">
            {project.description}
          </p>
          <button
            type="button"
            onClick={onSeeMore}
            className="mt-1.5 font-gg-sans text-[13px] uppercase tracking-[0.12em] underline underline-offset-2 opacity-70"
          >
            see more
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default function MyProjectsMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsIndex, setDetailsIndex] = useState(null);
  const [inGallery, setInGallery] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [footerActive, setFooterActive] = useState(false);

  useEffect(() => {
    if (introActive) setInGallery(false);
  }, [introActive]);

  useEffect(() => {
    const sync = () => {
      const footer = document.getElementById("projects-footer");
      if (!footer) return;
      const top = footer.getBoundingClientRect().top;
      const vh = window.innerHeight || 800;
      const inView = Math.abs(top) < vh * 0.55;
      setFooterActive(inView);
      if (inView) setInGallery(false);
    };
    window.addEventListener("scroll", sync, { passive: true, capture: true });
    document.addEventListener("scroll", sync, { passive: true, capture: true });
    sync();
    return () => {
      window.removeEventListener("scroll", sync, { capture: true });
      document.removeEventListener("scroll", sync, { capture: true });
    };
  }, []);

  const goTo = useCallback((index) => {
    const el = document.getElementById(slideId(index));
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: "auto" });
  }, []);

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) {
      const intro = document.getElementById("projects-intro");
      if (!intro) return;
      window.scrollTo({
        top: window.scrollY + intro.getBoundingClientRect().top,
        behavior: "auto",
      });
      return;
    }
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    if (activeIndex >= PROJECTS.length - 1) {
      const footer = document.getElementById("projects-footer");
      if (!footer) return;
      window.scrollTo({
        top: window.scrollY + footer.getBoundingClientRect().top,
        behavior: "auto",
      });
      return;
    }
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const active = PROJECTS[activeIndex] ?? PROJECTS[0];
  const detailsProject =
    detailsIndex == null ? null : PROJECTS[detailsIndex];

  return (
    <div id="myProjects" className="relative z-0 w-full">
      <motion.section
        id="projects-intro"
        data-snap
        className={`flex ${SNAP_SECTION} items-center justify-center bg-white px-6`}
        onViewportEnter={() => setIntroActive(true)}
        onViewportLeave={() => setIntroActive(false)}
        viewport={{ amount: 0.45 }}
      >
        <motion.div
          className="text-center"
          initial={false}
          animate={
            introActive
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0.4, y: 18, scale: 0.96 }
          }
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          <h2 className="font-ginto text-[32px] uppercase leading-none tracking-tight text-black">
            MY PROJECTS
          </h2>
          <p className="mt-5 max-w-xl font-gg-sans text-[18px] font-medium leading-snug text-black/55">
            Scroll to see some of the stuff I&apos;ve worked on or helped build :)
          </p>
        </motion.div>
      </motion.section>

      {PROJECTS.map((project, index) => (
        <ProjectSlide
          key={project.title}
          project={project}
          index={index}
          active={activeIndex === index}
          mountMedia={Math.abs(index - activeIndex) <= 1}
          onVisible={() => {
            setActiveIndex((prev) => (prev === index ? prev : index));
            setInGallery(true);
          }}
          onSeeMore={() => setDetailsIndex(index)}
        />
      ))}

      <motion.section
        id="projects-footer"
        data-snap
        className={`relative flex ${SNAP_SECTION} flex-col items-center justify-center overflow-hidden bg-black px-6`}
        data-footer-active={footerActive ? "true" : "false"}
        onViewportEnter={() => {
          setFooterActive(true);
          setInGallery(false);
        }}
        onViewportLeave={() => setFooterActive(false)}
        viewport={{ amount: 0.4 }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center gap-8">
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
        <motion.h2
          initial={false}
          animate={{ y: footerActive ? "0vh" : "28vh" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute bottom-0 left-0 w-full origin-bottom scale-y-65 text-center font-gondens text-[clamp(3.75rem,18vw,22rem)] uppercase leading-none tracking-tight text-white/30"
        >
          HKENABLES
        </motion.h2>
      </motion.section>

      {inGallery ? (
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-60 flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label={activeIndex <= 0 ? "Back to projects intro" : "Previous project"}
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white/80 text-black/80 shadow-sm backdrop-blur-md"
        >
          <ChevronIcon direction="left" />
        </button>
        <div className="min-w-0 flex-1 overflow-hidden rounded-full border border-black/10 bg-white/80 px-4 py-2.5 text-center shadow-sm backdrop-blur-md">
          <p className="font-gg-sans text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
            Now viewing
          </p>
          <p className="truncate font-archivo-black text-[13px] tracking-tight text-black">
            {active.title}
          </p>
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label={
            activeIndex >= PROJECTS.length - 1 ? "Open footer" : "Next project"
          }
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white/80 text-black/80 shadow-sm backdrop-blur-md"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
      ) : null}

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
