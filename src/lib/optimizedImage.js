import { getImageProps } from "next/image";

/** Match next.config `images.qualities` + <Image quality>. */
export const PROJECT_IMAGE_QUALITY = 75;

/**
 * Typical display width for project Mac windows (~50vw desktop, capped).
 * Optimizer resizes down from 2–3k source PNGs to this.
 */
export const PROJECT_IMAGE_WIDTH = 1200;

/**
 * URL served by Next's image optimizer (AVIF/WebP + resize).
 * Use this for prefetch/warmup so we never pull raw multi‑MB PNGs.
 */
export function optimizedImageSrc(
  src,
  { width = PROJECT_IMAGE_WIDTH, quality = PROJECT_IMAGE_QUALITY } = {}
) {
  if (!src || typeof src !== "string") return src;
  // Videos / external — leave alone
  if (src.endsWith(".mp4") || src.startsWith("http")) return src;

  const { props } = getImageProps({
    src,
    alt: "",
    width,
    height: Math.round((width * 10) / 16),
    quality,
  });
  return props.src;
}

/** Prefetch an optimized image into the browser cache. */
export function prefetchOptimizedImage(src, options) {
  if (typeof window === "undefined" || !src) return;
  const img = new window.Image();
  img.decoding = "async";
  img.src = optimizedImageSrc(src, options);
}
