"use client";

import { motion, useTransform } from "framer-motion";

const GREEN = "#5E683C";
const GREEN_SOFT = "rgba(94, 104, 60, 0.55)";

/**
 * Skeleton SaaS homepage — scroll builds layout + conversion signals.
 * `progress` is 0→1 while this card is active.
 * Spacing compresses on short viewports so the bottom metrics stay visible.
 */
export default function SaasBuildCard({ progress }) {
  const navOpacity = useTransform(progress, [0.12, 0.28], [0, 1]);
  const navY = useTransform(progress, [0.12, 0.28], [14, 0]);

  const heroOpacity = useTransform(progress, [0.24, 0.4], [0, 1]);
  const heroY = useTransform(progress, [0.24, 0.4], [20, 0]);

  const ctaOpacity = useTransform(progress, [0.36, 0.52], [0, 1]);
  const ctaScale = useTransform(progress, [0.36, 0.52], [0.92, 1]);

  const featureOpacity = useTransform(progress, [0.48, 0.64], [0, 1]);
  const featureY = useTransform(progress, [0.48, 0.64], [24, 0]);

  const chartOpacity = useTransform(progress, [0.58, 0.76], [0, 1]);
  const bar1 = useTransform(progress, [0.6, 0.82], ["12%", "42%"]);
  const bar2 = useTransform(progress, [0.64, 0.86], ["12%", "68%"]);
  const bar3 = useTransform(progress, [0.68, 0.9], ["12%", "88%"]);
  const bar4 = useTransform(progress, [0.72, 0.94], ["12%", "100%"]);

  const usersOpacity = useTransform(progress, [0.72, 0.9], [0, 1]);
  const usersCount = useTransform(progress, [0.72, 0.95], [120, 2840]);
  const usersDisplay = useTransform(usersCount, (v) =>
    Math.round(v).toLocaleString()
  );

  const convertOpacity = useTransform(progress, [0.82, 0.98], [0, 1]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] bg-[#1c1c1c] p-3 [@media(min-height:720px)]:p-5 [@media(min-height:820px)]:p-7">
      {/* Skeleton nav */}
      <motion.div
        style={{ opacity: navOpacity, y: navY }}
        className="mb-3 flex shrink-0 items-center justify-between gap-3 [@media(min-height:720px)]:mb-5 [@media(min-height:820px)]:mb-8 [@media(min-height:820px)]:gap-4"
      >
        <div className="flex items-center gap-2 [@media(min-height:720px)]:gap-3">
          <div className="h-6 w-6 rounded-md [@media(min-height:720px)]:h-8 [@media(min-height:720px)]:w-8 [@media(min-height:720px)]:rounded-lg" style={{ background: GREEN }} />
          <div className="h-2.5 w-16 rounded-full bg-white/15 [@media(min-height:720px)]:h-3 [@media(min-height:720px)]:w-20" />
        </div>
        <div className="hidden items-center gap-2 [@media(min-height:720px)]:flex">
          <div className="h-2.5 w-12 rounded-full bg-white/10" />
          <div className="h-2.5 w-12 rounded-full bg-white/10" />
          <div className="h-2.5 w-12 rounded-full bg-white/10" />
        </div>
        <div
          className="h-6 w-16 rounded-full [@media(min-height:720px)]:h-8 [@media(min-height:720px)]:w-20"
          style={{ background: `${GREEN}99` }}
        />
      </motion.div>

      {/* Skeleton hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="mb-2 flex shrink-0 flex-col items-center gap-2 text-center [@media(min-height:720px)]:mb-4 [@media(min-height:720px)]:gap-3 [@media(min-height:820px)]:mb-5"
      >
        <div className="h-3 w-[72%] max-w-md rounded-full bg-white/20 [@media(min-height:720px)]:h-4" />
        <div className="h-3 w-[54%] max-w-sm rounded-full bg-white/12 [@media(min-height:720px)]:h-4" />
        <div className="mt-0.5 h-2 w-[48%] max-w-xs rounded-full bg-white/8 [@media(min-height:720px)]:mt-1 [@media(min-height:720px)]:h-2.5" />
      </motion.div>

      {/* CTA block */}
      <motion.div
        style={{ opacity: ctaOpacity, scale: ctaScale }}
        className="mx-auto mb-3 flex w-full max-w-sm shrink-0 flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 [@media(min-height:720px)]:mb-5 [@media(min-height:720px)]:gap-3 [@media(min-height:720px)]:rounded-2xl [@media(min-height:720px)]:px-5 [@media(min-height:720px)]:py-4 [@media(min-height:820px)]:mb-7 [@media(min-height:820px)]:py-5"
      >
        <div className="h-2 w-24 rounded-full bg-white/15 [@media(min-height:720px)]:h-2.5 [@media(min-height:720px)]:w-28" />
        <div
          className="flex h-8 w-full items-center justify-center rounded-full font-gruppo text-[11px] text-white/90 [@media(min-height:720px)]:h-10 [@media(min-height:720px)]:text-[12px] [@media(min-height:820px)]:text-[13px]"
          style={{ background: GREEN }}
        >
          Start free trial
        </div>
        <div className="h-1.5 w-28 rounded-full bg-white/8 [@media(min-height:720px)]:h-2 [@media(min-height:720px)]:w-36" />
      </motion.div>

      {/* Feature skeleton row — can shrink / hide on very short screens */}
      <motion.div
        style={{ opacity: featureOpacity, y: featureY }}
        className="mb-2 hidden min-h-0 shrink grid-cols-3 gap-2 [@media(min-height:640px)]:grid [@media(min-height:720px)]:mb-4 [@media(min-height:720px)]:gap-2.5 [@media(min-height:820px)]:mb-6 [@media(min-height:820px)]:gap-3"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="min-h-0 overflow-hidden rounded-lg border border-white/6 bg-white/[0.03] p-2 [@media(min-height:720px)]:rounded-xl [@media(min-height:720px)]:p-3"
          >
            <div
              className="mb-2 h-5 w-5 rounded-md [@media(min-height:720px)]:mb-3 [@media(min-height:720px)]:h-7 [@media(min-height:720px)]:w-7"
              style={{ background: i === 1 ? GREEN : "rgba(255,255,255,0.1)" }}
            />
            <div className="mb-1.5 h-1.5 w-[80%] rounded-full bg-white/12 [@media(min-height:720px)]:h-2" />
            <div className="h-1.5 w-[55%] rounded-full bg-white/7 [@media(min-height:720px)]:h-2" />
          </div>
        ))}
      </motion.div>

      {/* Growth chart + live users — always kept in view */}
      <div className="mt-auto grid min-h-0 shrink-0 grid-cols-[1.4fr_1fr] gap-2 [@media(min-height:720px)]:gap-3">
        <motion.div
          style={{ opacity: chartOpacity }}
          className="flex min-h-0 flex-col justify-end rounded-lg border border-white/6 bg-white/[0.03] px-2.5 pb-2 pt-2.5 [@media(min-height:720px)]:rounded-xl [@media(min-height:720px)]:px-3 [@media(min-height:720px)]:pb-3 [@media(min-height:720px)]:pt-4"
        >
          <div className="mb-1.5 font-gruppo text-[9px] uppercase tracking-[0.14em] text-white/35 [@media(min-height:720px)]:mb-2 [@media(min-height:720px)]:text-[10px] [@media(min-height:720px)]:tracking-[0.16em]">
            Signups
          </div>
          <div className="flex h-10 items-end gap-1 [@media(min-height:720px)]:h-14 [@media(min-height:720px)]:gap-1.5 [@media(min-height:820px)]:h-20 [@media(min-height:820px)]:gap-2">
            {[bar1, bar2, bar3, bar4].map((bar, i) => (
              <motion.div
                key={i}
                style={{
                  height: bar,
                  background: i === 3 ? GREEN : GREEN_SOFT,
                }}
                className="flex-1 rounded-t-sm"
              />
            ))}
          </div>
        </motion.div>

        <div className="flex min-h-0 flex-col gap-1.5 [@media(min-height:720px)]:gap-2.5">
          <motion.div
            style={{ opacity: usersOpacity }}
            className="flex flex-1 flex-col justify-center rounded-lg border border-white/6 bg-white/[0.03] px-2.5 py-2 [@media(min-height:720px)]:rounded-xl [@media(min-height:720px)]:px-3 [@media(min-height:720px)]:py-3"
          >
            <div className="font-gruppo text-[9px] font-bold uppercase tracking-[0.14em] text-white [@media(min-height:720px)]:text-[10px] [@media(min-height:720px)]:tracking-[0.16em]">
              Active users
            </div>
            <motion.div className="mt-0.5 font-archivo-black text-[clamp(18px,3vw,32px)] leading-none text-white [@media(min-height:720px)]:mt-1">
              {usersDisplay}
            </motion.div>
          </motion.div>

          <motion.div
            style={{
              opacity: convertOpacity,
              borderColor: `${GREEN}55`,
              background: `${GREEN}18`,
            }}
            className="shrink-0 rounded-lg border px-2.5 py-2 [@media(min-height:720px)]:rounded-xl [@media(min-height:720px)]:px-3 [@media(min-height:720px)]:py-3"
          >
            <div className="font-archivo-black text-[15px] text-white [@media(min-height:720px)]:text-[18px] [@media(min-height:820px)]:text-[20px]">
              +42%
            </div>
            <div className="font-gruppo text-[9px] font-bold text-white [@media(min-height:720px)]:text-[10px]">
              conversion lift
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
