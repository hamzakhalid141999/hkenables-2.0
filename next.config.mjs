/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Prefer AVIF, fall back to WebP (then original)
    formats: ["image/avif", "image/webp"],
    // Next 16 allowlists quality — keep in sync with <Image quality={…}>
    qualities: [60, 75],
    // Project windows are ~90vw mobile / ~50vw desktop — no need for huge srcset steps
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512, 640],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
