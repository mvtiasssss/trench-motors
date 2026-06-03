"use client";

import * as React from "react";
import Image from "next/image";
import { Power } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IntroSplashProps {
  /** Enciende el motor: reproduce el audio y dispara la animación del hero. */
  onIgnite: () => void;
  /** Salta la intro (sin sonido). */
  onSkip: () => void;
  /** prefers-reduced-motion activo. */
  reduced: boolean;
  /** Cuando true, el overlay hace fade-out para revelar el hero. */
  fading: boolean;
}

export function IntroSplash({
  onIgnite,
  onSkip,
  reduced,
  fading,
}: IntroSplashProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0D] px-6 transition-opacity duration-700 ease-out",
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden={fading}
    >
      {/* Logo con entrada elegante + sheen metálico */}
      <div
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl",
          !reduced && "tm-logo-in"
        )}
      >
        <Image
          src="/logo-trench.jpg"
          alt="Trench Motors"
          width={701}
          height={632}
          priority
          sizes="(max-width: 640px) 90vw, 384px"
          className="h-auto w-full"
        />
        {!reduced ? (
          <span
            aria-hidden
            className="tm-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        ) : null}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={onIgnite}
          className="h-14 gap-3 px-10 text-base font-bold uppercase tracking-widest"
        >
          <Power className="size-5" aria-hidden />
          Encender motor
        </Button>
        <p className="text-xs text-muted-foreground">
          Sube el volumen para la experiencia completa
        </p>
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-6 right-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Saltar intro
      </button>
    </div>
  );
}
