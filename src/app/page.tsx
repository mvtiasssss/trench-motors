import Link from "next/link";
import { ShieldCheck, Banknote, Wrench, Handshake, Star } from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCard } from "@/components/vehicle-card";
import { SearchBar } from "@/components/SearchBar";
import { HomeHero } from "@/components/HomeHero";
import { Button } from "@/components/ui/button";
import { getBrands, getFeaturedVehicles } from "@/lib/vehicles";
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
      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            ¿Listo para estrenar tu próximo auto?
          </h2>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contacto">Conversemos</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
