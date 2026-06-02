/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite servir imágenes remotas (fotos de vehículos) por https.
    // Ajusta los hosts a los reales (p. ej. el bucket de Supabase Storage).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
