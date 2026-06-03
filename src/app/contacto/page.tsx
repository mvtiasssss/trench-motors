import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { QuoteForm } from "@/components/vehicle/QuoteForm";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto | Trench Motors",
  description:
    "Conversemos. Escríbenos o visítanos: teléfono, WhatsApp, correo y ubicación de Trench Motors.",
};

const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  siteConfig.direccion
)}&output=embed`;

export default function ContactoPage() {
  return (
    <>
      {/* Hero corto */}
      <section className="border-b border-border bg-card">
        <Container className="pb-12 pt-28 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl">
            Conversemos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            ¿Tienes dudas o quieres agendar una visita? Escríbenos y te
            respondemos a la brevedad.
          </p>
        </Container>
      </section>

      {/* Datos + formulario */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Datos de contacto */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                eyebrow="Contacto"
                title="Hablemos"
                subtitle="Estamos para ayudarte a encontrar tu próximo auto."
              />
              <ul className="flex flex-col gap-5">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <a
                      href={siteConfig.telefonoHref}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {siteConfig.telefono}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      Escríbenos por WhatsApp
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm text-muted-foreground">Correo</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium text-foreground">
                      {siteConfig.direccion}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Horarios de atención
                    </p>
                    <ul className="font-medium text-foreground">
                      {siteConfig.horarios.map((h) => (
                        <li key={h.dias}>
                          {h.dias}: {h.horas}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

            {/* Formulario */}
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
              <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                Envíanos un mensaje
              </h2>
              <QuoteForm origen="contacto" submitLabel="Enviar mensaje" />
            </div>
          </div>
        </Container>
      </section>

      {/* Mapa */}
      <section className="pb-16">
        <Container>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Ubicación de Trench Motors"
              src={mapaSrc}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>

      {/* WhatsApp flotante */}
      <WhatsAppButton
        variant="whatsapp"
        label="WhatsApp"
        message="Hola Trench Motors, quiero más información."
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg shadow-black/30"
      />
    </>
  );
}
