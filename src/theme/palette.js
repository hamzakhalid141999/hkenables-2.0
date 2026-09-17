/**
 * Site gradient theme: #A5C244 → #2A7B9B across major sections.
 * Stops are evenly spaced for a natural lime → teal progression.
 */
export const THEME = {
  /** 1 — Hero (visual stays; notch icon uses this) */
  hero: "#A5C244",
  /** 2 — About Me */
  about: "rgba(197 250 133 / 0.45)",
  /** 3 — SaaS Landing Page card */
  saas: "#5A976C",
  /** 4 — Develop, but fast card */
  fullstack: "#5A9782",
  /** 5 — Website Revamps card (+ projects notch) */
  revamp: "#43898A",
  /** 6 — Projects→footer theme wipe / contact */
  footer: "#2A7B9B",
};

/** Soft/light companions for card accents (≈38% toward white). */
export const THEME_LIGHT = {
  hero: "#c7d98b",
  about: "#b8d196",
  saas: "#99bfa4",
  fullstack: "#99bfb2",
  revamp: "#8ab6b6",
  footer: "#7badc1",
};

/** Mix hex toward white (0–1). */
export function lighten(hex, amount = 0.35) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return rgbToHex(mix(r), mix(g), mix(b));
}

/** rgba() string from hex + alpha. */
export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex) {
  const raw = String(hex).replace("#", "");
  const full =
    raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
