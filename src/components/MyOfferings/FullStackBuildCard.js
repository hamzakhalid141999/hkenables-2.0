"use client";

import { motion, useTransform } from "framer-motion";

const GREEN = "#5E683C";

function ScreenChrome({ label, status }) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 px-2 py-1.5 min-[830px]:px-3 min-[830px]:py-2.5">
      <div className="flex items-center gap-1.5 min-[830px]:gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/15 min-[830px]:h-2 min-[830px]:w-2" />
        <span className="font-gruppo text-[8px] font-bold uppercase tracking-[0.14em] text-white min-[830px]:text-[10px] min-[830px]:tracking-[0.16em]">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1 min-[830px]:gap-1.5">
        <span className="h-1 w-1 rounded-full bg-[#9aab6e] min-[830px]:h-1.5 min-[830px]:w-1.5" />
        <span className="font-gruppo text-[7px] uppercase tracking-[0.1em] text-[#9aab6e] min-[830px]:text-[9px] min-[830px]:tracking-[0.12em]">
          {status}
        </span>
      </div>
    </div>
  );
}

export default function FullStackBuildCard({ progress }) {
  const frontendOpacity = useTransform(progress, [0.04, 0.16], [0, 1]);
  const frontendX = useTransform(progress, [0.04, 0.2], [-90, 0]);
  const backendOpacity = useTransform(progress, [0.09, 0.21], [0, 1]);
  const backendX = useTransform(progress, [0.09, 0.25], [90, 0]);
  const databaseOpacity = useTransform(progress, [0.14, 0.26], [0, 1]);
  const databaseY = useTransform(progress, [0.14, 0.3], [70, 0]);

  // Manual development reaches 24%, then AI accelerates it rapidly to 100%.
  const buildProgress = useTransform(progress, (value) => {
    if (value <= 0.18) return 0;
    if (value <= 0.46) return ((value - 0.18) / 0.28) * 24;
    if (value >= 0.74) return 100;

    const accelerated = (value - 0.46) / 0.28;
    return 24 + (1 - Math.pow(1 - accelerated, 3)) * 76;
  });
  const buildWidth = useTransform(buildProgress, (value) => `${value}%`);
  const buildLabel = useTransform(
    buildProgress,
    (value) => `${Math.round(value)}%`
  );

  const frontendHeroWidth = useTransform(
    buildProgress,
    [0, 45, 100],
    ["15%", "55%", "82%"]
  );
  const frontendCopyWidth = useTransform(
    buildProgress,
    [0, 55, 100],
    ["8%", "42%", "64%"]
  );
  const frontendCtaWidth = useTransform(
    buildProgress,
    [0, 65, 100],
    ["0%", "18%", "34%"]
  );

  const codeLineOne = useTransform(
    buildProgress,
    [0, 45, 100],
    ["10%", "48%", "92%"]
  );
  const codeLineTwo = useTransform(
    buildProgress,
    [0, 55, 100],
    ["6%", "38%", "76%"]
  );
  const codeLineThree = useTransform(
    buildProgress,
    [0, 70, 100],
    ["0%", "30%", "84%"]
  );
  const codeLineFour = useTransform(
    buildProgress,
    [0, 78, 100],
    ["0%", "22%", "62%"]
  );

  const databaseFill = useTransform(
    buildProgress,
    [0, 35, 100],
    ["8%", "34%", "100%"]
  );
  const databaseRows = useTransform(buildProgress, [0, 45, 100], [1, 2, 4]);
  const databaseLabel = useTransform(
    databaseRows,
    (value) => `${Math.round(value)}`
  );

  const aiOpacity = useTransform(progress, [0.4, 0.51], [0, 1]);
  const aiScale = useTransform(progress, [0.4, 0.56], [0.65, 1]);
  const manualOpacity = useTransform(progress, [0.3, 0.43], [1, 0]);
  const acceleratedOpacity = useTransform(progress, [0.46, 0.57], [0, 1]);
  const beamScale = useTransform(progress, [0.45, 0.6], [0, 1]);
  const beamOpacity = useTransform(progress, [0.44, 0.53], [0, 1]);

  const packetOpacity = useTransform(
    progress,
    [0.5, 0.55, 0.76, 0.82],
    [0, 1, 1, 0]
  );
  const packetX = useTransform(progress, [0.5, 0.82], ["0vw", "54vw"]);

  const deployOpacity = useTransform(progress, [0.76, 0.9], [0, 1]);
  const deployY = useTransform(progress, [0.76, 0.9], [16, 0]);
  const completeGlow = useTransform(progress, [0.76, 0.94], [0, 1]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-[#191919] px-3 py-4 min-[830px]:px-7 min-[830px]:py-7">
      <motion.div
        style={{ opacity: completeGlow }}
        className="pointer-events-none absolute inset-x-[18%] bottom-[-25%] h-[55%] rounded-full bg-[#5E683C]/30 blur-[80px]"
      />

      <div className="flex flex-col gap-2 min-[830px]:flex-row min-[830px]:items-center min-[830px]:justify-between">
        <div>
          <div className="font-gruppo text-[9px] font-bold uppercase tracking-[0.18em] text-white min-[830px]:text-[10px] min-[830px]:tracking-[0.2em]">
            AI-powered development
          </div>
          <div className="mt-0.5 font-archivo-black text-[12px] text-white min-[830px]:mt-1 min-[830px]:text-[16px]">
            Three layers. One accelerated build.
          </div>
        </div>
        <div className="relative flex min-w-20 justify-start min-[830px]:min-w-24 min-[830px]:justify-end">
          <motion.div
            style={{ opacity: manualOpacity }}
            className="absolute left-0 rounded-full border border-white/8 bg-white/4 px-2.5 py-1 font-gruppo text-[8px] uppercase tracking-[0.12em] text-white/35 min-[830px]:right-0 min-[830px]:left-auto min-[830px]:px-3 min-[830px]:py-1.5 min-[830px]:text-[9px] min-[830px]:tracking-[0.14em]"
          >
            1× manual
          </motion.div>
          <motion.div
            style={{ opacity: acceleratedOpacity }}
            className="rounded-full border border-[#5E683C]/50 bg-[#5E683C]/15 px-2.5 py-1 font-gruppo text-[8px] uppercase tracking-[0.12em] text-[#b4c487] min-[830px]:px-3 min-[830px]:py-1.5 min-[830px]:text-[9px] min-[830px]:tracking-[0.14em]"
          >
            8× faster
          </motion.div>
        </div>
      </div>

      <div className="relative mt-3 min-h-0 flex-1 min-[830px]:mt-5">
        {/* AI core sends acceleration into all three development screens. */}
        <motion.div
          style={{ opacity: aiOpacity, scale: aiScale }}
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 min-[830px]:top-[2%]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#9aab6e]/50 bg-[#5E683C] shadow-[0_0_35px_rgba(154,171,110,0.4)] min-[830px]:h-14 min-[830px]:w-14 min-[830px]:rounded-2xl">
            <span className="font-climate-crisis text-[12px] text-black min-[830px]:text-[15px]">
              AI
            </span>
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute inset-0 rounded-xl border border-[#9aab6e]/70 min-[830px]:rounded-2xl"
            />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: beamOpacity }}
          className="pointer-events-none absolute left-1/2 top-[12%] z-10 hidden h-[27%] w-[72%] -translate-x-1/2 min-[830px]:block"
        >
          <motion.div
            style={{ scaleX: beamScale, rotate: 17 }}
            className="absolute left-1/2 top-0 h-px w-1/2 origin-left bg-linear-to-r from-[#9aab6e] to-transparent"
          />
          <motion.div
            style={{ scaleX: beamScale, rotate: 163 }}
            className="absolute left-1/2 top-0 h-px w-1/2 origin-left bg-linear-to-r from-[#9aab6e] to-transparent"
          />
          <motion.div
            style={{ scaleY: beamScale }}
            className="absolute left-1/2 top-0 h-full w-px origin-top bg-linear-to-b from-[#9aab6e] to-transparent"
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-[5%] top-[14%] grid min-h-0 grid-cols-1 grid-rows-3 gap-2 min-[830px]:bottom-[7%] min-[830px]:top-[27%] min-[830px]:grid-cols-[1fr_0.72fr_1fr] min-[830px]:grid-rows-1 min-[830px]:gap-4">
          {/* Frontend screen */}
          <motion.div
            style={{ opacity: frontendOpacity, x: frontendX }}
            className="min-h-0 overflow-hidden rounded-xl border border-white/10 bg-[#202020] shadow-[0_18px_38px_rgba(0,0,0,0.3)] min-[830px]:rounded-2xl"
          >
            <ScreenChrome label="Frontend" status="Building" />
            <div className="flex h-[calc(100%_-_30px)] min-h-0 flex-col p-2 min-[830px]:h-[calc(100%_-_38px)] min-[830px]:p-4">
              <div className="mb-2 flex items-center justify-between min-[830px]:mb-3">
                <div className="h-1.5 w-8 rounded-full bg-white/10 min-[830px]:h-2 min-[830px]:w-10" />
                <div className="h-4 w-8 rounded-full bg-[#5E683C]/60 min-[830px]:h-5 min-[830px]:w-10" />
              </div>
              <motion.div
                style={{ width: frontendHeroWidth }}
                className="mb-1.5 h-2 rounded-full bg-white/20 min-[830px]:mb-2 min-[830px]:h-3"
              />
              <motion.div
                style={{ width: frontendCopyWidth }}
                className="mb-2 h-1.5 rounded-full bg-white/8 min-[830px]:mb-4 min-[830px]:h-2"
              />
              <motion.div
                style={{ width: frontendCtaWidth }}
                className="h-5 min-w-1 rounded-md bg-[#5E683C] min-[830px]:h-6"
              />
              <div className="mt-auto hidden grid-cols-2 gap-2 min-[830px]:grid">
                <div className="h-10 rounded-lg border border-white/6 bg-white/3" />
                <div className="h-10 rounded-lg border border-white/6 bg-white/3" />
              </div>
            </div>
          </motion.div>

          {/* Database screen */}
          <motion.div
            style={{ opacity: databaseOpacity, y: databaseY }}
            className="relative min-h-0 overflow-hidden rounded-xl border border-white/10 bg-[#202020] shadow-[0_18px_38px_rgba(0,0,0,0.3)] min-[830px]:rounded-2xl"
          >
            <ScreenChrome label="Database" status="Syncing" />
            <div className="relative flex h-[calc(100%_-_30px)] min-h-0 flex-row items-center justify-center gap-3 px-3 min-[830px]:h-[calc(100%_-_38px)] min-[830px]:flex-col min-[830px]:px-2">
              <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-[50%/12%] border border-[#9aab6e]/35 bg-black/20 min-[830px]:h-[58%] min-[830px]:w-[72%] min-[830px]:min-w-14">
                <motion.div
                  style={{ height: databaseFill }}
                  className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#5E683C] to-[#9aab6e]/45"
                />
                {[24, 45, 66].map((top) => (
                  <div
                    key={top}
                    className="absolute inset-x-0 h-px bg-white/10"
                    style={{ top: `${top}%` }}
                  />
                ))}
              </div>
              <div className="font-archivo-black text-[14px] text-white min-[830px]:mt-3 min-[830px]:text-[20px]">
                <motion.span>{databaseLabel}</motion.span>
                <span className="ml-1 font-gruppo text-[8px] font-normal text-white/35 min-[830px]:text-[9px]">
                  tables
                </span>
              </div>
            </div>
          </motion.div>

          {/* Backend screen */}
          <motion.div
            style={{ opacity: backendOpacity, x: backendX }}
            className="min-h-0 overflow-hidden rounded-xl border border-white/10 bg-[#202020] shadow-[0_18px_38px_rgba(0,0,0,0.3)] min-[830px]:rounded-2xl"
          >
            <ScreenChrome label="Backend" status="Compiling" />
            <div className="space-y-2 p-2 min-[830px]:space-y-3 min-[830px]:p-4">
              {[codeLineOne, codeLineTwo, codeLineThree, codeLineFour].map(
                (width, index) => (
                  <div key={index} className="flex items-center gap-1.5 min-[830px]:gap-2">
                    <span className="font-gruppo text-[7px] text-[#9aab6e]/55 min-[830px]:text-[8px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <motion.div
                      style={{ width }}
                      className={`h-1.5 rounded-full min-[830px]:h-2 ${
                        index === 1 ? "bg-[#9aab6e]/55" : "bg-white/10"
                      }`}
                    />
                  </div>
                )
              )}
              <div className="mt-2 rounded-lg border border-white/6 bg-black/15 p-1.5 min-[830px]:mt-5 min-[830px]:p-2">
                <div className="mb-1.5 h-1 w-8 rounded-full bg-white/10 min-[830px]:mb-2 min-[830px]:h-1.5 min-[830px]:w-10" />
                <div className="h-1 w-[72%] rounded-full bg-[#5E683C]/50 min-[830px]:h-1.5" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: packetOpacity }}
          className="pointer-events-none absolute inset-x-[8%] bottom-[3%] z-30 h-px bg-white/6"
        >
          <motion.span
            style={{ x: packetX }}
            className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#b4c487] shadow-[0_0_18px_#9aab6e]"
          />
        </motion.div>
      </div>

      <div className="relative mt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
          <motion.div
            style={{ width: buildWidth }}
            className="h-full rounded-full bg-linear-to-r from-[#5E683C] to-[#b4c487]"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-gruppo text-[9px] uppercase tracking-[0.14em] text-white/30">
            Full-stack build
          </span>
          <motion.span className="font-archivo-black text-[11px] text-white/70">
            {buildLabel}
          </motion.span>
        </div>
      </div>

      <motion.div
        style={{ opacity: deployOpacity, y: deployY }}
        className="absolute bottom-3 left-1/2 z-40 flex max-w-[92%] -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#9aab6e]/35 bg-[#25291d] px-3 py-1.5 shadow-[0_0_30px_rgba(94,104,60,0.3)] min-[830px]:bottom-5 min-[830px]:gap-2 min-[830px]:px-4 min-[830px]:py-2"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b4c487] shadow-[0_0_10px_#9aab6e] min-[830px]:h-2 min-[830px]:w-2" />
        <span className="truncate font-archivo-black text-[9px] text-white min-[830px]:whitespace-nowrap min-[830px]:text-[11px]">
          Production ready — 8× faster
        </span>
      </motion.div>
    </div>
  );
}
