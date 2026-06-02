import * as React from "react";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/** "whatsapp" usa el verde de la marca; el resto reusa los estilos del botón base. */
type WhatsAppVariant =
  | "whatsapp"
  | "default"
  | "outline"
  | "secondary"
  | "ghost";
type WhatsAppSize = "default" | "sm" | "lg";

interface WhatsAppButtonProps {
  /** Mensaje prellenado en el chat de WhatsApp */
  message?: string;
  /** Número en formato internacional sin "+" (por defecto, el del sitio) */
  phone?: string;
  /** Texto del botón */
  label?: string;
  variant?: WhatsAppVariant;
  size?: WhatsAppSize;
  className?: string;
}

/**
 * Enlace a wa.me con mensaje configurable. Abre WhatsApp en una pestaña nueva.
 */
export function WhatsAppButton({
  message = "Hola, me interesa conocer más sobre los vehículos de Trench Motors.",
  phone = siteConfig.whatsapp,
  label = "Escríbenos por WhatsApp",
  variant = "whatsapp",
  size = "default",
  className,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const base =
    variant === "whatsapp"
      ? cn(
          buttonVariants({ variant: "default", size }),
          "bg-[#25D366] text-white hover:bg-[#1ebe5b]"
        )
      : buttonVariants({ variant, size });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir chat de WhatsApp"
      className={cn(base, "gap-2", className)}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </a>
  );
}
