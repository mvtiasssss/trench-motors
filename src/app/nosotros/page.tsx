import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { BLUR_DATA_URL } from "@/lib/image";

export const metadata: Metadata = {
  title: "Nosotros | Trench Motors",
  description:
    "Conoce la historia de Trench Motors, nuestro equipo y los valores que nos guían: 15 años de experiencia en el mundo automotriz.",
};

const equipo = [
  {
    nombre: "George Trench",
    rol: "Fundador y Gerente General",
    descripcion:
      "Ingeniero automotriz, mecánico y con experiencia en banca. Su pasión por los autos lo llevó a crear Trench Motors con una visión de compra/venta cercana y sin rodeos.",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=70",
  },
  {
    nombre: "Felipe Mardones",
    rol: "Fuerza de ventas",
    descripcion:
      "Especialista en atención al cliente y asesoría de venta. Te acompaña en todo el proceso para que encuentres el auto ideal.",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=70",
  },
  {
    nombre: "Eduardo Stowhas",
    rol: "Mecánico",
    descripcion:
      "Técnico automotriz con años de experiencia. Revisa y certifica cada vehículo antes de que llegue a nuestro catálogo.",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=70",
  },
  {
    nombre: "Matías Trench",
    rol: "Operador digital",
    descripcion:
      "Responsable de la presencia digital de Trench Motors. Gestiona el sitio web, catálogo online y comunicaciones.",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=70",
  },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <Container className="pb-12 pt-28 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl">
            Sobre Trench Motors
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Más de 15 años de experiencia automotriz al servicio de quienes
            buscan su próximo auto con confianza.
          </p>
        </Container>
      </section>

      {/* Historia */}
      <section className="py-12 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=75"
                alt="George Trench, fundador de Trench Motors"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <SectionHeading
                eyebrow="Nuestra historia"
                title="Una pasión que se convirtió en negocio"
              />
              <p className="leading-relaxed text-muted-foreground">
                George Trench siempre tuvo los autos en la sangre. Comenzó su
                carrera formándose como ingeniero automotriz, después ejerció
                como mecánico — aprendiendo cada detalle del motor desde adentro
                — y más tarde pasó por el mundo de la banca, donde entendió el
                lado financiero de la compra de vehículos.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Esa combinación de conocimiento técnico, experiencia en
                financiamiento y, sobre todo, el amor genuino por los autos, lo
                llevó a crear{" "}
                <span className="font-semibold text-foreground">
                  Trench Motors
                </span>
                : una automotora compacta donde cada cliente recibe asesoría
                honesta, cada vehículo pasa por revisión técnica y el proceso de
                compra no tiene letra chica.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Más de 15 años después, ese espíritu sigue siendo el motor de
                todo lo que hacemos.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Equipo */}
      <section className="border-y border-border bg-card py-12 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Equipo"
            title="Las personas detrás de Trench Motors"
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {equipo.map((persona) => (
              <div
                key={persona.nombre}
                className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-6 text-center"
              >
                <div className="relative size-24 overflow-hidden rounded-full border-2 border-border bg-muted">
                  <Image
                    src={persona.foto}
                    alt={persona.nombre}
                    fill
                    sizes="96px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-foreground">
                    {persona.nombre}
                  </p>
                  <p className="text-sm text-primary">{persona.rol}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {persona.descripcion}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="py-12 sm:py-20">
        <Container className="max-w-3xl text-center">
          <SectionHeading
            eyebrow="Valores"
            title="Lo que nos define"
            align="center"
          />
          <div className="mt-10 flex flex-col items-center gap-5 rounded-xl border border-border bg-card p-8">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-7" aria-hidden />
            </span>
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Confianza
            </h3>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              Todo lo que hacemos parte de la confianza: publicamos el precio
              real, describimos el estado real del vehículo y te explicamos cada
              detalle del proceso de compra sin presión. Porque un cliente que
              confía, vuelve y recomienda.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            ¿Listo para tu próximo auto? Conversemos
          </h2>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/contacto">
              Contáctanos
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
