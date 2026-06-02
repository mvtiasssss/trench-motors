/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Imágenes de ejemplo del seed.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Fotos reales servidas desde Supabase Storage (bucket vehicle-photos).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
