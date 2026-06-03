import type { MetadataRoute } from "next";

import { getVehicles } from "@/lib/vehicles";
import { siteConfig } from "@/lib/site";

const base = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/financiamiento`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Vehículos del catálogo (no vendidos)
  let vehiculoPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getVehicles({ perPage: 1000, orden: "recientes" });
    vehiculoPages = data.map((v) => ({
      url: `${base}/vehiculo/${v.slug}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Si Supabase no está configurado, el sitemap se genera sin los vehículos.
  }

  return [...staticPages, ...vehiculoPages];
}
