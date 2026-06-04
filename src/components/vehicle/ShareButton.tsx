"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  /** Título a compartir (p. ej. "Toyota Corolla 2021 — $14.990.000"). */
  title: string;
  /** Texto opcional adicional para el share. */
  text?: string;
  /** URL absoluta del vehículo. Si se omite, usa la URL actual. */
  url?: string;
  className?: string;
}

/**
 * Botón "Compartir": usa la Web Share API en móvil (sale el menú nativo con
 * WhatsApp, etc.) y, donde no está disponible, copia el link al portapapeles
 * mostrando confirmación. Degradación elegante en cualquier caso.
 */
export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (!shareUrl) return;

    // 1) Web Share API (principalmente móvil).
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url: shareUrl });
        return;
      } catch {
        // El usuario canceló o falló: caemos a copiar el link.
      }
    }

    // 2) Fallback: copiar al portapapeles.
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin clipboard disponible: no hacemos nada disruptivo */
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleShare}
      aria-label="Compartir este vehículo"
      className={className}
    >
      {copied ? (
        <>
          <Check className="size-4" aria-hidden />
          Link copiado
        </>
      ) : (
        <>
          <Share2 className="size-4 sm:hidden" aria-hidden />
          <Copy className="hidden size-4 sm:inline" aria-hidden />
          Compartir
        </>
      )}
    </Button>
  );
}
