import * as React from "react";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

interface WhatsAppButtonProps {
  /** Mensaje prellenado en el chat de WhatsApp */
  message?: string;
  /** Número en formato internacional sin "+" (por defecto, el del sitio) */
  phone?: string;
  /** Texto del botón */
  label?: string;
  className?: string;
}

/**
 * Enlace a wa.me con mensaje configurable. Abre WhatsApp en una pestaña nueva.
 */
export function WhatsAppButton({
  message = "Hola, me interesa conocer más sobre los vehículos de Trench Motors.",
  phone = siteConfig.whatsapp,
  label = "Escríbenos por WhatsApp",
  className,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir chat de WhatsApp"
      className={cn(
        buttonVariants({ variant: "default" }),
        "gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5b]",
        className
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </a>
  );
}
