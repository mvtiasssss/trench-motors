"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { IntroSplash } from "@/components/IntroSplash";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80";

const SEEN_KEY = "trench_intro_seen";

type Phase = "intro" | "igniting" | "accelerating" | "settled";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function HomeHero() {
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [introVisible, setIntroVisible] = React.useState(true);
  const [introFading, setIntroFading] = React.useState(false);
  const [showText, setShowText] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [muted, setMuted] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Decisión inicial (antes del primer paint): ¿intro vista? ¿reduced motion?
  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = Boolean(prefersReduced);
    setReduced(Boolean(prefersReduced));

    if (seen) {
      setIntroVisible(false);
      setPhase("settled");
      setShowText(true);
    }
  }, []);

  // Bloquea el scroll mientras la intro está visible.
  React.useEffect(() => {
    if (introVisible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [introVisible]);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* sessionStorage no disponible */
    }
  }

  function playMotor() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.muted = muted;
      audio.currentTime = 0;
      const p = audio.play();
      if (p) p.catch(() => {});
    } catch {
      /* el audio puede fallar; la animación corre igual */
    }
  }

  /** Encadena ignición → aceleración → asentar (con tiempos por defecto). */
  function runSequence() {
    clearTimers();
    if (reducedRef.current) {
      setPhase("settled");
      setShowText(true);
      return;
    }
    setPhase("igniting");
    setShowText(false);
    timers.current.push(
      setTimeout(() => {
        setPhase("accelerating");
        setShowText(true);
      }, 600)
    );
    timers.current.push(
      setTimeout(() => {
        setPhase("settled");
      }, 1800)
    );
  }

  function handleIgnite() {
    markSeen();
    playMotor();
    setIntroFading(true);
    runSequence();
    const delay = reducedRef.current ? 400 : 850;
    timers.current.push(setTimeout(() => setIntroVisible(false), delay));
  }

  function handleSkip() {
    markSeen();
    setIntroFading(true);
    setPhase("settled");
    setShowText(true);
    timers.current.push(setTimeout(() => setIntroVisible(false), 350));
  }

  function handleReplay() {
    playMotor();
    runSequence();
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/motor-startup.m4a" preload="auto">
        <track kind="captions" />
      </audio>

      <section
        className={cn(
          "tm-hero relative flex min-h-screen items-center overflow-hidden",
          `tm-phase-${phase}`
        )}
      >
        {/* Imagen del hero (animada por fase) */}
        <div className="tm-hero-img absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Auto deportivo en Trench Motors"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Bloom de luz (faros) durante la aceleración */}
        <div
          aria-hidden
          className="tm-bloom pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.35),transparent_55%)]"
        />

        {/* Líneas de velocidad (solo al acelerar y sin reduced-motion) */}
        {phase === "accelerating" && !reduced ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {[18, 34, 50, 66, 82].map((top, i) => (
              <span
                key={top}
                className="tm-streak absolute h-px w-[45vw] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[1px]"
                style={{ top: `${top}%`, animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        ) : null}

        {/* Overlays oscuros para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-black/40" />
        <div
          aria-hidden
          className="tm-vignette pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_50px_rgba(0,0,0,0.85)]"
        />

        <Container className="relative z-10 pb-32 pt-28">
          {showText ? (
            <div className="max-w-3xl">
              <h1
                className="animate-fade-up font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
                style={{ animationDelay: "0.05s" }}
              >
                Tu próximo auto, sin rodeos.
              </h1>
              <p
                className="animate-fade-up mt-6 max-w-xl text-lg text-foreground/80 sm:text-xl"
                style={{ animationDelay: "0.2s" }}
              >
                Trench Motors — vehículos nuevos y usados con financiamiento a tu
                medida
              </p>
              <div
                className="animate-fade-up mt-8 flex flex-col gap-4 sm:flex-row"
                style={{ animationDelay: "0.35s" }}
              >
                <Button asChild size="lg">
                  <Link href="/catalogo">Ver Catálogo</Link>
                </Button>
                <WhatsAppButton
                  variant="outline"
                  size="lg"
                  label="Cotizar por WhatsApp"
                  message="Hola Trench Motors, quiero información sobre sus vehículos"
                />
              </div>
            </div>
          ) : null}
        </Container>

        {/* Controles: volver a encender / silenciar */}
        {!introVisible ? (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              {muted ? (
                <VolumeX className="size-4" aria-hidden />
              ) : (
                <Volume2 className="size-4" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={handleReplay}
              aria-label="Volver a encender el motor"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <RotateCcw className="size-4" aria-hidden />
              Volver a encender
            </button>
          </div>
        ) : null}
      </section>

      {introVisible ? (
        <IntroSplash
          onIgnite={handleIgnite}
          onSkip={handleSkip}
          reduced={reduced}
          fading={introFading}
        />
      ) : null}
    </>
  );
}
