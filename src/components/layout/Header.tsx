"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { navLinks, siteConfig } from "@/lib/site";

type HeaderVariant = "transparent" | "solid";

interface HeaderProps {
  /**
   * "transparent": arranca transparente sobre el hero y se vuelve sólido al
   * hacer scroll. "solid": siempre sólido.
   */
  variant?: HeaderVariant;
}

export function Header({ variant = "transparent" }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // Bloquea el scroll del body cuando el menú móvil está abierto.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isSolid = variant === "solid" || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid
          ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" aria-label="Trench Motors — Inicio" className="shrink-0">
          <Logo variant="horizontal" />
        </Link>

        {/* Navegación (desktop) */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={siteConfig.telefonoHref}
            className="hidden items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground lg:flex"
          >
            <Phone className="size-4" aria-hidden />
            {siteConfig.telefono}
          </a>
          <Button asChild>
            <Link href="/contacto">Cotizar</Link>
          </Button>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </Container>

      {/* Overlay + panel deslizante (móvil) */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {/* Fondo oscuro */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-background shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Logo variant="horizontal" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-border px-5 py-5">
            <a
              href={siteConfig.telefonoHref}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              <Phone className="size-4" aria-hidden />
              {siteConfig.telefono}
            </a>
            <Button asChild className="w-full">
              <Link href="/contacto" onClick={() => setOpen(false)}>
                Cotizar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
