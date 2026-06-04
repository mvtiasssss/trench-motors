import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Gauge,
  Settings,
  Fuel,
  Palette,
  DoorOpen,
  Car,
  Tag,
  ChevronLeft,
  Eye,
} from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SimuladorCuota } from "@/components/SimuladorCuota";
import { Gallery } from "@/components/vehicle/Gallery";
import { QuoteForm } from "@/components/vehicle/QuoteForm";
import { ShareButton } from "@/components/vehicle/ShareButton";
import { RegisterView } from "@/components/vehicle/RegisterView";
import { Garantias } from "@/components/garantias";
import { getSimilarVehicles, getVehicleBySlug } from "@/lib/vehicles";
import { formatCLP, formatKm } from "@/lib/format";
import { TIPOS } from "@/lib/vehicle-options";
import { siteConfig } from "@/lib/site";
import type { VehicleWithImages } from "@/types/vehicle";

const transmisionLabel: Record<string, string> = {
  manual: "Manual",
  automatica: "Automática",
};
const combustibleLabel: Record<string, string> = {
  bencina: "Bencina",
  diesel: "Diésel",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};
const condicionLabel: Record<string, string> = {
  nuevo: "Nuevo",
  usado: "Usado",
};

function tipoLabel(tipo: string): string {
  return TIPOS.find((t) => t.value === tipo)?.label ?? tipo;
}

function fotoPrincipal(vehicle: VehicleWithImages): string | undefined {
  return (
    vehicle.imagenes.find((img) => img.es_principal) ?? vehicle.imagenes[0]
  )?.url;
}

function buildJsonLd(vehicle: VehicleWithImages) {
  const foto = fotoPrincipal(vehicle);
  const url = `${siteConfig.url}/vehiculo/${vehicle.slug}`;

  const organization = {
    "@type": "AutoDealer",
    "@id": siteConfig.url,
    name: siteConfig.nombre,
    url: siteConfig.url,
    telephone: siteConfig.telefono,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.direccion,
      addressCountry: "CL",
    },
  };

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.marca} ${vehicle.modelo}${vehicle.version ? ` ${vehicle.version}` : ""}`,
    description:
      vehicle.descripcion ??
      `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio} disponible en Trench Motors.`,
    url,
    ...(foto ? { image: foto } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: vehicle.precio,
      availability: vehicle.vendido
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: organization,
      url,
    },
  };

  return JSON.stringify(product);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let vehicle: VehicleWithImages | null = null;
  try {
    vehicle = await getVehicleBySlug(params.slug);
  } catch {
    vehicle = null;
  }
  if (!vehicle) {
    return { title: "Vehículo no encontrado | Trench Motors" };
  }

  // Título de la pestaña (con sufijo de marca vía template del layout)
  const titulo = `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio}`;
  // Título enriquecido para compartir (incluye el precio, lo que más importa)
  const tituloSocial = `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio} — ${formatCLP(
    vehicle.precio
  )}`;

  // Descripción con specs clave (lo que se ve en la tarjeta de WhatsApp)
  const specsClave = [
    formatKm(vehicle.kilometraje),
    transmisionLabel[vehicle.transmision] ?? vehicle.transmision,
    combustibleLabel[vehicle.combustible] ?? vehicle.combustible,
    tipoLabel(vehicle.tipo),
  ].join(" · ");
  const descripcion =
    vehicle.descripcion ??
    `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio} en Trench Motors. ${specsClave}.`;

  const foto = fotoPrincipal(vehicle);
  const url = `${siteConfig.url}/vehiculo/${vehicle.slug}`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.nombre,
      title: tituloSocial,
      description: descripcion,
      images: foto
        ? [{ url: foto, width: 1200, height: 630, alt: tituloSocial }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloSocial,
      description: descripcion,
      images: foto ? [foto] : [],
    },
  };
}

export default async function VehiculoPage({
  params,
}: {
  params: { slug: string };
}) {
  let vehicle: VehicleWithImages | null = null;
  try {
    vehicle = await getVehicleBySlug(params.slug);
  } catch {
    vehicle = null;
  }
  if (!vehicle) notFound();

  let similares: VehicleWithImages[] = [];
  try {
    similares = await getSimilarVehicles(vehicle, 4);
  } catch {
    similares = [];
  }

  const {
    id,
    marca,
    modelo,
    version,
    anio,
    kilometraje,
    precio,
    transmision,
    combustible,
    color,
    puertas,
    tipo,
    condicion,
    descripcion,
    vendido,
    vistas,
    imagenes,
  } = vehicle;

  const specs = [
    { icon: Calendar, label: "Año", value: String(anio) },
    { icon: Gauge, label: "Kilometraje", value: formatKm(kilometraje) },
    { icon: Settings, label: "Transmisión", value: transmisionLabel[transmision] ?? transmision },
    { icon: Fuel, label: "Combustible", value: combustibleLabel[combustible] ?? combustible },
    { icon: Palette, label: "Color", value: color ?? "—" },
    { icon: DoorOpen, label: "Puertas", value: puertas != null ? String(puertas) : "—" },
    { icon: Car, label: "Tipo", value: tipoLabel(tipo) },
    { icon: Tag, label: "Condición", value: condicionLabel[condicion] ?? condicion },
  ];

  const mensajeWhatsApp = `Hola Trench Motors, me interesa el ${marca} ${modelo} ${anio}. ¿Sigue disponible?`;
  const estadoBadge = vendido
    ? { variant: "vendido" as const, label: "Vendido" }
    : condicion === "nuevo"
      ? { variant: "nuevo" as const, label: "Nuevo" }
      : { variant: "financiable" as const, label: "Usado" };

  return (
    <Container className="pb-16 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(vehicle) }}
      />
      {/* Suma 1 vista (dedup por cookie httpOnly en /api/views) */}
      <RegisterView slug={vehicle.slug} />
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Volver al catálogo
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="flex flex-col gap-10 lg:col-span-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {marca}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              {modelo}
              {version ? ` ${version}` : ""}{" "}
              <span className="text-muted-foreground">{anio}</span>
            </h1>
          </div>

          <Gallery images={imagenes} alt={`${marca} ${modelo} ${anio}`} />

          {/* Ficha técnica */}
          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
              Ficha técnica
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-start gap-1 rounded-lg border border-border bg-card p-4"
                >
                  <s.icon className="size-5 text-primary" aria-hidden />
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Descripción */}
          {descripcion ? (
            <section>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                Descripción
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {descripcion}
              </p>
            </section>
          ) : null}

          {/* Nuestro compromiso (garantías) */}
          <section>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
              Nuestro compromiso
            </h2>
            <Garantias variant="compact" className="mt-4" />
          </section>
        </div>

        {/* Caja de precio (sticky) */}
        <aside className="lg:col-span-1">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={estadoBadge.variant}>{estadoBadge.label}</Badge>
              <Badge variant="financiable">Financiable</Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Precio</span>
              <p className="font-display text-3xl font-bold text-foreground">
                {formatCLP(precio)}
              </p>
              {/* Prueba social honesta: solo si hay suficientes vistas reales */}
              {vistas >= 10 ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="size-3.5" aria-hidden />
                  {vistas} personas han visto este auto
                </p>
              ) : null}
            </div>
            <Button asChild size="lg">
              <a href="#cotizar">Cotizar</a>
            </Button>
            <WhatsAppButton
              variant="whatsapp"
              size="lg"
              label="Consultar por WhatsApp"
              message={mensajeWhatsApp}
            />
            <ShareButton
              title={`${marca} ${modelo} ${anio} — ${formatCLP(precio)}`}
              text={`Mira este ${marca} ${modelo} ${anio} en Trench Motors`}
              url={`${siteConfig.url}/vehiculo/${vehicle.slug}`}
            />

            {/* Simulador de cuota con el precio del vehículo */}
            <SimuladorCuota precio={precio} compact className="bg-background" />
          </div>
        </aside>
      </div>

      {/* Formulario de cotización */}
      <section id="cotizar" className="mt-12 scroll-mt-28">
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Solicita tu cotización
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Déjanos tus datos y te contactamos por este vehículo.
          </p>
          <div className="mt-6">
            <QuoteForm
              vehicleId={id}
              defaultMensaje={`Hola, me interesa el ${marca} ${modelo} ${anio}. ¿Sigue disponible?`}
            />
          </div>
        </div>
      </section>

      {/* Vehículos similares */}
      {similares.length > 0 ? (
        <section className="mt-16">
          <SectionHeading title="Vehículos similares" />
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similares.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
