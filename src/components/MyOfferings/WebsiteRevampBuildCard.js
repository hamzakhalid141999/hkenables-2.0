"use client";

import { motion, useTransform } from "framer-motion";

const GREEN = "#5E683C";
const GREEN_LIGHT = "#9aab6e";

function BrowserChrome({ label, tone = "old" }) {
  const isNew = tone === "new";
  return (
    <div
      className={`flex items-center gap-2 border-b px-3 py-2.5 ${
        isNew ? "border-white/10 bg-[#1a1c18]" : "border-white/6 bg-[#161616]"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
      <div
        className={`ml-2 flex-1 rounded-md px-2 py-1 font-gruppo text-[9px] ${
          isNew ? "bg-white/8 text-white/40" : "bg-white/5 text-white/25"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function OldSite() {
  return (
    <div className="flex h-full flex-col bg-[#2a2a2a]">
      <BrowserChrome label="yoursite.com — outdated" tone="old" />
      <div className="flex flex-1 flex-col gap-3 p-4 opacity-70">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded-sm bg-white/15" />
          <div className="flex gap-2">
            <div className="h-2 w-8 rounded-sm bg-white/10" />
            <div className="h-2 w-8 rounded-sm bg-white/10" />
            <div className="h-2 w-8 rounded-sm bg-white/10" />
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <div className="h-4 w-[70%] rounded-sm bg-white/12" />
          <div className="h-4 w-[48%] rounded-sm bg-white/8" />
          <div className="h-2.5 w-[85%] rounded-sm bg-white/6" />
          <div className="h-2.5 w-[62%] rounded-sm bg-white/5" />
        </div>
        <div className="mt-3 h-8 w-28 rounded-sm bg-white/10" />
        <div className="mt-auto grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-sm border border-white/5 bg-white/3"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewSite() {
  return (
    <div className="flex h-full flex-col bg-[#12140f]">
      <BrowserChrome label="yoursite.com — redesigned" tone="new" />
      <div className="relative flex flex-1 flex-col gap-3 overflow-hidden p-4">
        <div
          className="pointer-events-none absolute -right-8 top-6 h-32 w-32 rounded-full blur-3xl"
          style={{ background: `${GREEN}55` }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md" style={{ background: GREEN }} />
            <div className="h-2.5 w-14 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-9 rounded-full bg-white/15" />
            <div className="h-2 w-9 rounded-full bg-white/15" />
            <div
              className="h-6 w-16 rounded-full"
              style={{ background: GREEN_LIGHT }}
            />
          </div>
        </div>
        <div className="relative z-10 mt-3 space-y-2">
          <div className="h-5 w-[78%] rounded-full bg-white/25" />
          <div className="h-5 w-[52%] rounded-full bg-white/12" />
          <div className="h-2.5 w-[68%] rounded-full bg-white/8" />
        </div>
        <div
          className="relative z-10 mt-2 h-9 w-36 rounded-full"
          style={{ background: GREEN_LIGHT }}
        />
        <div className="relative z-10 mt-auto grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl border border-white/10 bg-white/5 p-2"
            >
              <div
                className="mb-2 h-4 w-4 rounded-md"
                style={{
                  background:
                    i === 1 ? GREEN_LIGHT : "rgba(255,255,255,0.12)",
                }}
              />
              <div className="h-1.5 w-[70%] rounded-full bg-white/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Website revamp — outdated site transforms into a high-engagement redesign.
 */
export default function WebsiteRevampBuildCard({ progress }) {
  const stageOpacity = useTransform(progress, [0.05, 0.18], [0, 1]);
  const stageY = useTransform(progress, [0.05, 0.22], [24, 0]);

  const afterClipPath = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.28) / 0.3));
    return `inset(0 ${100 - t * 100}% 0 0)`;
  });

  const wipeLeft = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.28) / 0.3));
    return `${t * 100}%`;
  });
  const wipeOpacity = useTransform(
    progress,
    [0.28, 0.35, 0.55, 0.62],
    [0, 1, 1, 0]
  );

  const beforeOpacity = useTransform(progress, [0.52, 0.68], [1, 0.15]);
  const badgeBeforeOpacity = useTransform(
    progress,
    [0.12, 0.22, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const badgeAfterOpacity = useTransform(progress, [0.5, 0.62], [0, 1]);

  const metricsOpacity = useTransform(progress, [0.58, 0.72], [0, 1]);
  const metricsY = useTransform(progress, [0.58, 0.72], [20, 0]);

  const engagement = useTransform(progress, [0.6, 0.88], [12, 78]);
  const engagementLabel = useTransform(engagement, (v) => `+${Math.round(v)}%`);
  const timeOnSite = useTransform(progress, [0.62, 0.9], [0.4, 3.8]);
  const timeLabel = useTransform(timeOnSite, (v) => `${v.toFixed(1)}m`);
  const bounce = useTransform(progress, [0.64, 0.9], [68, 21]);
  const bounceLabel = useTransform(bounce, (v) => `${Math.round(v)}%`);

  const barWidth = useTransform(progress, [0.62, 0.88], ["12%", "86%"]);

  const glowOpacity = useTransform(progress, [0.55, 0.75], [0, 1]);
  const resultOpacity = useTransform(progress, [0.78, 0.92], [0, 1]);
  const resultY = useTransform(progress, [0.78, 0.92], [14, 0]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-[#191919] px-4 py-5 sm:px-7 sm:py-7">
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute inset-x-[20%] bottom-[-20%] h-[50%] rounded-full bg-[#5E683C]/28 blur-[80px]"
      />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-gruppo text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Website revamp
          </div>
          <div className="mt-1 font-archivo-black text-[13px] text-white sm:text-[16px]">
            From outdated to unforgettable
          </div>
        </div>
        <motion.div
          style={{ opacity: resultOpacity }}
          className="rounded-full border border-[#5E683C]/50 bg-[#5E683C]/15 px-3 py-1.5 font-gruppo text-[9px] uppercase tracking-[0.14em] text-[#b4c487]"
        >
          Engagement up
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: stageOpacity, y: stageY }}
        className="relative min-h-0 flex-1"
      >
        <div className="relative h-[62%] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:h-[65%]">
          <motion.div
            style={{ opacity: beforeOpacity }}
            className="absolute inset-0"
          >
            <OldSite />
          </motion.div>

          <motion.div
            style={{ clipPath: afterClipPath }}
            className="absolute inset-0"
          >
            <NewSite />
          </motion.div>

          <motion.div
            style={{ left: wipeLeft, opacity: wipeOpacity }}
            className="absolute top-0 z-20 h-full w-0.5 -translate-x-1/2 bg-[#b4c487] shadow-[0_0_18px_#9aab6e]"
          />

          <motion.span
            style={{ opacity: badgeBeforeOpacity }}
            className="absolute left-3 top-3 z-30 rounded-full bg-black/55 px-2.5 py-1 font-gruppo text-[9px] uppercase tracking-[0.14em] text-white/55 backdrop-blur-sm"
          >
            Before
          </motion.span>
          <motion.span
            style={{
              opacity: badgeAfterOpacity,
              background: GREEN_LIGHT,
            }}
            className="absolute right-3 top-3 z-30 rounded-full px-2.5 py-1 font-gruppo text-[9px] uppercase tracking-[0.14em] text-black"
          >
            After
          </motion.span>
        </div>

        <motion.div
          style={{ opacity: metricsOpacity, y: metricsY }}
          className="mt-3 grid grid-cols-3 gap-2 sm:gap-3"
        >
          <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
            <div className="font-gruppo text-[8px] uppercase tracking-[0.14em] text-white/35 sm:text-[9px]">
              Engagement
            </div>
            <motion.div className="mt-1 font-archivo-black text-[18px] text-[#b4c487] sm:text-[22px]">
              {engagementLabel}
            </motion.div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
            <div className="font-gruppo text-[8px] uppercase tracking-[0.14em] text-white/35 sm:text-[9px]">
              Time on site
            </div>
            <motion.div className="mt-1 font-archivo-black text-[18px] text-white sm:text-[22px]">
              {timeLabel}
            </motion.div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
            <div className="font-gruppo text-[8px] uppercase tracking-[0.14em] text-white/35 sm:text-[9px]">
              Bounce rate
            </div>
            <motion.div className="mt-1 font-archivo-black text-[18px] text-white sm:text-[22px]">
              {bounceLabel}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: metricsOpacity }}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6"
        >
          <motion.div
            style={{
              width: barWidth,
              background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT})`,
            }}
            className="h-full rounded-full"
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: resultOpacity, y: resultY }}
        className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#9aab6e]/35 bg-[#25291d] px-4 py-2 shadow-[0_0_30px_rgba(94,104,60,0.3)]"
      >
        <span className="h-2 w-2 rounded-full bg-[#b4c487] shadow-[0_0_10px_#9aab6e]" />
        <span className="whitespace-nowrap font-archivo-black text-[10px] text-white sm:text-[11px]">
          Visitors stay longer. Convert more.
        </span>
      </motion.div>
    </div>
  );
}
