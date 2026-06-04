/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Formatos modernos: Next negocia AVIF (mejor compresión) y cae a WebP.
    formats: ["image/avif", "image/webp"],
    // Anchos de dispositivo y de imagen razonables para móvil → desktop.
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cachea las variantes optimizadas 7 días (las fotos no cambian seguido).
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      // Imágenes de ejemplo del seed.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Fotos reales servidas desde Supabase Storage (bucket vehicle-photos).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
