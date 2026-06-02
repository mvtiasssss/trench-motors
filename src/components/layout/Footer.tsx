import * as React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, Clock } from "lucide-react";

import { Container } from "@/components/container";
import { navLinks, siteConfig } from "@/lib/site";

// lucide-react v1 ya no incluye logos de marca; usamos SVG inline.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca + navegación */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.15em]">
              Trench<span className="text-primary"> Motors</span>
            </span>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={siteConfig.telefonoHref}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {siteConfig.telefono}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <MessageCircle className="size-4 shrink-0" aria-hidden />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Horarios
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              {siteConfig.horarios.map((h) => (
                <li key={h.dias} className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-foreground">{h.dias}</span>
                    {h.horas}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Síguenos
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href={siteConfig.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <FacebookIcon className="size-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">{siteConfig.direccion}</p>
          </div>
        </div>
      </Container>

      {/* Franja inferior */}
      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            Trench Motors © {year} · Todos los derechos reservados
          </p>
        </Container>
      </div>
    </footer>
  );
}
