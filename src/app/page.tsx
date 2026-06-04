import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Banknote, Wrench, Handshake, Star } from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCard } from "@/components/vehicle-card";
import { SearchBar } from "@/components/SearchBar";
import { HomeHero } from "@/components/HomeHero";
import { Button } from "@/components/ui/button";
import { getBrands, getFeaturedVehicles } from "@/lib/vehicles";
import { BLUR_DATA_URL } from "@/lib/image";
import type { Brand, VehicleWithImages } from "@/types/vehicle";

const beneficios = [
  {
    icon: ShieldCheck,
    title: "Garantía en cada vehículo",
    desc: "Todos nuestros autos pasan por control de calidad y cuentan con respaldo.",
  },
  {
    icon: Banknote,
    title: "Financiamiento a tu medida",
    desc: "Te ayudamos a encontrar el crédito que mejor se ajusta a tu bolsillo.",
  },
  {
    icon: Wrench,
    title: "Revisión técnica al día",
    desc: "Entregamos cada vehículo revisado y con su documentación en regla.",
  },
  {
    icon: Handshake,
    title: "Atención cercana y sin presión",
    desc: "Te asesoramos con transparencia para que compres con tranquilidad.",
  },
];

const marcas = ["Toyota", "Hyundai", "Kia", "Chevrolet", "Nissan", "Mazda"];

const testimonios = [
  {
    nombre: "Camila Rojas",
    comentario:
      "Compré mi primer auto en Trench Motors y la atención fue impecable. Me explicaron todo sin apuro y el financiamiento quedó a mi medida.",
  },
  {
    nombre: "Felipe Soto",
    comentario:
      "Vehículo tal cual lo publicado, revisado y con papeles al día. Proceso rápido y transparente. Recomendado 100%.",
  },
  {
    nombre: "Daniela Muñoz",
    comentario:
      "Excelente experiencia. Recibieron mi auto en parte de pago y me fui con una SUV impecable el mismo día.",
  },
];

export default async function Home() {
  let destacados: VehicleWithImages[] = [];
  let brands: Brand[] = [];
  // Si Supabase aún no está configurado, la página se renderiza igual (sin datos).
  try {
    destacados = await getFeaturedVehicles(6);
  } catch {
    destacados = [];
  }
  try {
    brands = await getBrands();
  } catch {
    brands = [];
  }

  return (
    <>
      {/* ===================== HERO + INTRO DE MARCA ==================== */}
      <HomeHero />

      {/* ===================== BÚSQUEDA RÁPIDA ========================== */}
      <Container className="relative z-20 -mt-24">
        <SearchBar brands={brands} />
      </Container>

      {/* ======================== DESTACADOS =========================== */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Catálogo"
            title="Destacados"
            subtitle="Una selección de vehículos listos para entrega."
            align="center"
          />
          {destacados.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((vehiculo) => (
                <VehicleCard key={vehiculo.id} vehicle={vehiculo} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-muted-foreground">
              Pronto publicaremos nuestros vehículos destacados.
            </p>
          )}
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/catalogo">Ver todo el catálogo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* ==================== ¿POR QUÉ TRENCH? ========================= */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Por qué elegirnos"
            title="¿Por qué Trench Motors?"
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center gap-4 rounded-lg border border-border bg-background p-6 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <b.icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================== MARCAS ============================= */}
      <section className="py-12 sm:py-16">
        <Container>
          <p className="text-center text-sm uppercase tracking-widest text-muted-foreground">
            Trabajamos con las mejores marcas
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {marcas.map((m) => (
              <span
                key={m}
                className="font-display text-2xl font-bold uppercase tracking-wide text-muted-foreground/60 transition-colors duration-300 hover:text-silver sm:text-3xl"
              >
                {m}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ======================== TESTIMONIOS ========================== */}
      <section className="border-t border-border bg-card py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Testimonios"
            title="Lo que dicen nuestros clientes"
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonios.map((t) => (
              <figure
                key={t.nombre}
                className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6"
              >
                <div className="flex gap-1 text-amber-400" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.comentario}&rdquo;
                </blockquote>
                <figcaption className="mt-auto font-display text-sm font-semibold text-foreground">
                  {t.nombre}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ======================= CTA FINAL ============================= */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Foto del Mercedes escalada y difuminada — solo compositor (scale+filter) */}
        <div className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=60"
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover blur-sm"
            aria-hidden
          />
        </div>

        {/* Overlay oscuro degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/90 via-[#0B0B0D]/80 to-[#0B0B0D]/95" />

        {/* Borde superior plateado muy fino */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver/60 to-transparent" />

        {/* Contenido */}
        <Container className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Acento rojo fino sobre el título */}
          <span className="h-[3px] w-10 rounded-full bg-primary" aria-hidden />

          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
            ¿Listo para estrenar tu próximo auto?
          </h2>

          <p className="max-w-md text-base text-white/70 sm:text-lg">
            Visítanos o escríbenos — estamos disponibles para encontrar el
            vehículo perfecto para ti.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg">
              <Link href="/contacto">Conversemos</Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-silver/50 text-white hover:border-silver hover:bg-white/10">
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
