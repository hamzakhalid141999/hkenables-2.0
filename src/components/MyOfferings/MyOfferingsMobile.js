"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SaasBuildCard from "./SaasBuildCard";
import FullStackBuildCard from "./FullStackBuildCard";
import WebsiteRevampBuildCard from "./WebsiteRevampBuildCard";
import MyProjectsMobile from "@/components/MyProjects/MyProjectsMobile";
import { SNAP_SECTION } from "@/hooks/useMobileSnap";

const copyEase = [0.22, 1, 0.36, 1];

function SnapSlide({ id, className = "", children }) {
  const [active, setActive] = useState(false);
  return (
    <motion.section
      id={id}
      data-snap
      className={`${SNAP_SECTION} ${className}`}
      onViewportEnter={() => setActive(true)}
      onViewportLeave={() => setActive(false)}
      viewport={{ amount: 0.45, margin: "0px" }}
    >
      {typeof children === "function" ? children(active) : children}
    </motion.section>
  );
}

function StaticOfferingCard({ title, children }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-6">
      <p className="mb-1 font-gg-sans text-[10px] uppercase tracking-[0.22em] text-white/35">
        My Offerings
      </p>
      <h3 className="mb-3 shrink-0 text-center font-ginto text-[clamp(22px,6vw,34px)] leading-none tracking-tight text-white">
        {title}
      </h3>
      <div className="h-[min(64dvh,560px)] w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#1a1a1a] shadow-[0_8px_40px_rgba(0,0,0,0.20)]">
        {children}
      </div>
    </div>
  );
}

function CopyLine({ active, delay, children, className }) {
  return (
    <motion.div
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 22, filter: "blur(8px)" }
      }
      transition={{
        duration: 0.68,
        delay: active ? delay : 0,
        ease: copyEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function MyOfferingsMobile() {
  return (
    <div id="myOfferings" className="relative z-40 w-full bg-[#141414]">
      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <StaticOfferingCard title="SaaS Landing Page">
            <SaasBuildCard lite active={active} />
          </StaticOfferingCard>
        )}
      </SnapSlide>

      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <div className="flex h-full w-full items-center justify-center px-6">
            <div className="flex w-full max-w-4xl flex-col items-center text-center">
              <CopyLine active={active} delay={0.08}>
                <h3 className="font-ginto text-[clamp(32px,8vw,64px)] leading-[1.05] tracking-tight text-white">
                  Design, Develop and Engineer
                </h3>
              </CopyLine>
              <CopyLine
                active={active}
                delay={0.48}
                className="mt-5 max-w-2xl"
              >
                <p className="font-gg-sans text-[clamp(18px,4.2vw,28px)] leading-snug text-white/70">
                  your SaaS landing pages, that attract and convert users
                </p>
              </CopyLine>
              <CopyLine
                active={active}
                delay={0.88}
                className="mt-10 max-w-xl"
              >
                <p className="font-gg-sans text-[clamp(14px,3.6vw,24px)] leading-relaxed text-white/45">
                  See the latest example where we have{" "}
                  <span className="text-white/80">230+ signups</span> in less
                  than a month
                </p>
              </CopyLine>
              <CopyLine active={active} delay={1.22}>
                <a
                  href="https://www.batchedits.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 mt-6 inline-block font-gg-sans text-[clamp(15px,1.9vw,18px)] text-[#9aab6e] underline decoration-[#9aab6e]/40 underline-offset-4"
                >
                  www.batchedits.com
                </a>
              </CopyLine>
            </div>
          </div>
        )}
      </SnapSlide>

      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <StaticOfferingCard title="Develop, but fast">
            <FullStackBuildCard lite active={active} />
          </StaticOfferingCard>
        )}
      </SnapSlide>

      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <div className="flex h-full w-full items-center justify-center px-6">
            <div className="flex w-full max-w-4xl flex-col items-center text-center">
              <CopyLine active={active} delay={0.08}>
                <h3 className="font-ginto text-[clamp(32px,8vw,64px)] leading-[1.05] tracking-tight text-white">
                  Convert that idea into a SaaS!
                </h3>
              </CopyLine>
              <CopyLine
                active={active}
                delay={0.48}
                className="mt-5 max-w-2xl"
              >
                <p className="font-gg-sans text-[clamp(20px,4.2vw,28px)] leading-[33px] text-white/70">
                  I can ship fast, so can others. But I can ship it not looking
                  like another AI slop UI/UX
                  <br />
                  <br />
                  <span className="text-[18px] font-bold leading-snug text-white/45">
                    &quot;94% of first impressions of a business are related to
                    website design&quot; - Marketing LTB
                  </span>
                </p>
              </CopyLine>
              <CopyLine
                active={active}
                delay={1.02}
                className="mt-10 max-w-xl"
              >
                <p className="font-gg-sans text-[clamp(18px,3.8vw,24px)] leading-[30px] text-white/45">
                  Founders are busy, I let them take the back-seat and take
                  charge of the product myself. Don&apos;t take my word for it,{" "}
                  <a
                    href="https://www.linkedin.com/in/hamza-khalid-5a40931a5/details/recommendations/?detailScreenTabIndex=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9aab6e] underline decoration-[#9aab6e]/40 underline-offset-4"
                  >
                    see for yourself
                  </a>{" "}
                  :)
                </p>
              </CopyLine>
            </div>
          </div>
        )}
      </SnapSlide>

      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <StaticOfferingCard title="Website Revamps">
            <WebsiteRevampBuildCard lite active={active} />
          </StaticOfferingCard>
        )}
      </SnapSlide>

      <SnapSlide className="bg-[#141414]">
        {(active) => (
          <div className="flex h-full w-full items-center justify-center px-6">
            <div className="flex w-full max-w-4xl flex-col items-center text-center">
              <CopyLine active={active} delay={0.08}>
                <h3 className="font-ginto text-[clamp(32px,8vw,64px)] leading-[1.05] tracking-tight text-white">
                  Website looking tired?
                </h3>
              </CopyLine>
              <CopyLine
                active={active}
                delay={0.48}
                className="mt-5 max-w-2xl"
              >
                <p className="font-gg-sans text-[clamp(20px,4.2vw,28px)] leading-[30px] text-white/70">
                  I don&apos;t patch it. I{" "}
                  <span className="text-white">reinvent</span>
                  <br />
                  <br />
                  <span className="text-[18px] font-bold leading-snug text-white/45">
                    &quot;80% of website redesigns are initiated because of
                    outdated aesthetics. 38% of visitors leave a page if the
                    layout is unattractive&quot; - Marketing LTB
                  </span>
                </p>
              </CopyLine>
              <CopyLine
                active={active}
                delay={1.02}
                className="mt-10 max-w-xl"
              >
                <p className="font-gg-sans text-[clamp(18px,3.8vw,24px)] leading-[30px] text-white/45">
                  Your brand is cool. Your website isn&apos;t. Make it stand out
                  from the rest of the 1000+ websites out there.
                </p>
              </CopyLine>
            </div>
          </div>
        )}
      </SnapSlide>

      <MyProjectsMobile />
    </div>
  );
}
