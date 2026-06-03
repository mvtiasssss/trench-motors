import type { Metadata } from "next";
import { CreditCard, FileText, Briefcase } from "lucide-react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { SimuladorCuota } from "@/components/SimuladorCuota";
import { QuoteForm } from "@/components/vehicle/QuoteForm";

export const metadata: Metadata = {
  title: "Financiamiento | Trench Motors",
  description:
    "Simula la cuota de tu próximo auto y precalifica para financiamiento en Trench Motors.",
};

const entidades = ["BancoEstado", "Santander", "BCI", "Scotiabank", "BICE"];

const requisitos = [
  {
    icon: CreditCard,
    title: "Cédula de identidad",
    desc: "Documento vigente del titular del crédito.",
  },
  {
    icon: FileText,
    title: "Liquidaciones de sueldo",
    desc: "Últimas 3 liquidaciones o cartola de movimientos.",
  },
  {
    icon: Briefcase,
    title: "Antigüedad laboral",
    desc: "Mínimo 3 meses en tu trabajo actual.",
  },
];

export default function FinanciamientoPage() {
  return (
    <>
      {/* Hero corto */}
      <section className="border-b border-border bg-card">
        <Container className="pb-12 pt-28 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl">
            Financia tu próximo auto
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Simula tu cuota mensual y precalifica en minutos. Te acompañamos en
            todo el proceso para que estrenes sin complicaciones.
          </p>
        </Container>
      </section>

      {/* Simulador */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Calcula"
            title="Simulador de cuotas"
            subtitle="Ajusta el pie, el plazo y la tasa para estimar tu cuota mensual."
            align="center"
          />
          <div className="mx-auto mt-8 max-w-2xl">
            <SimuladorCuota />
          </div>
        </Container>
      </section>

      {/* Entidades financieras */}
      <section className="border-y border-border py-10">
        <Container>
          <p className="text-center text-sm uppercase tracking-widest text-muted-foreground">
            Trabajamos con las principales entidades financieras
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {entidades.map((e) => (
              <span
                key={e}
                className="font-display text-xl font-bold uppercase tracking-wide text-muted-foreground/60 transition-colors duration-300 hover:text-silver sm:text-2xl"
              >
                {e}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Requisitos */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Requisitos"
            title="Lo que necesitas"
            subtitle="Reúne estos documentos y agilizamos tu evaluación."
            align="center"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {requisitos.map((r) => (
              <div
                key={r.title}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <r.icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Precalificación */}
      <section className="border-t border-border bg-card py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Precalifica"
              title="Solicita tu precalificación"
              subtitle="Déjanos tus datos y un ejecutivo te contactará con las alternativas disponibles."
              align="center"
            />
            <div className="mt-8 rounded-lg border border-border bg-background p-6 sm:p-8">
              <QuoteForm
                origen="precalificacion"
                defaultMensaje="Hola, quiero precalificar para financiamiento. ¿Qué alternativas tienen?"
                submitLabel="Solicitar precalificación"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
