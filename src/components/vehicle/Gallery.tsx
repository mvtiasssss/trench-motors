"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

import type { VehicleImage } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/image";

interface GalleryProps {
  images: VehicleImage[];
  alt: string;
  /** URL de video opcional (YouTube/Vimeo o archivo MP4). */
  videoUrl?: string | null;
}

type VideoInfo =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; url: string };

/** Reconoce YouTube / Vimeo / archivo de video desde URLs comunes. */
function parseVideo(url: string): VideoInfo | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return { kind: "youtube", id: yt[1] };

  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "vimeo", id: vm[1] };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { kind: "file", url };
  }
  return null;
}

/** Flecha de navegación: visible pero sutil (fondo semitransparente). */
function NavArrow({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={direction === "prev" ? "Imagen anterior" : "Imagen siguiente"}
      className={cn(
        "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        direction === "prev" ? "left-3" : "right-3",
        className
      )}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}

export function Gallery({ images, alt, videoUrl }: GalleryProps) {
  const video = videoUrl ? parseVideo(videoUrl) : null;

  // Modo inicial: si hay video, mostrarlo primero; si no, la primera foto.
  const [mode, setMode] = React.useState<"video" | "image">(
    video ? "video" : "image"
  );
  const [selected, setSelected] = React.useState(0);
  const [videoActivado, setVideoActivado] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const hasMultiple = images.length > 1;

  const goPrev = React.useCallback(() => {
    setMode("image");
    setSelected((s) => (s - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = React.useCallback(() => {
    setMode("image");
    setSelected((s) => (s + 1) % images.length);
  }, [images.length]);

  // Bloquea el scroll del fondo y maneja el teclado mientras el lightbox está abierto.
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, goPrev, goNext]);

  // Navegación con flechas del teclado sobre el visor en línea (cuando tiene foco).
  const onViewerKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple || mode !== "image") return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  // Sin fotos NI video: estado vacío (igual que antes).
  if (images.length === 0 && !video) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
        Sin imágenes disponibles
      </div>
    );
  }

  const current = images[selected] ?? images[0];
  const poster =
    (images.find((img) => img.es_principal) ?? images[0])?.url ?? undefined;

  const youtubeThumb =
    video?.kind === "youtube"
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : undefined;
  const facadePoster = youtubeThumb ?? poster;

  return (
    <div className="flex flex-col gap-3">
      {/* Visor principal */}
      <div
        role="group"
        aria-label={`Galería de ${alt}`}
        tabIndex={mode === "image" && hasMultiple ? 0 : -1}
        onKeyDown={onViewerKeyDown}
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-[#0B0B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {mode === "video" && video ? (
          video.kind === "file" ? (
            <video
              controls
              preload="metadata"
              poster={poster}
              className="h-full w-full bg-black object-contain"
            >
              <source src={video.url} />
              <track kind="captions" />
              Tu navegador no puede reproducir este video.
            </video>
          ) : videoActivado ? (
            <iframe
              src={
                video.kind === "youtube"
                  ? `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`
                  : `https://player.vimeo.com/video/${video.id}?autoplay=1`
              }
              title={`Video de ${alt}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          ) : (
            // Facade: solo carga el iframe al hacer clic (mejor rendimiento).
            <button
              type="button"
              onClick={() => setVideoActivado(true)}
              aria-label="Reproducir video"
              className="group relative h-full w-full"
            >
              {facadePoster ? (
                <Image
                  src={facadePoster}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 bg-black" />
              )}
              <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
              <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
                <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
              </span>
            </button>
          )
        ) : current ? (
          <>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Ampliar imagen"
              className="group block h-full w-full cursor-zoom-in"
            >
              <Image
                src={current.url}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
            {hasMultiple ? (
              <>
                <NavArrow direction="prev" onClick={goPrev} />
                <NavArrow direction="next" onClick={goNext} />
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {selected + 1} / {images.length}
                </span>
              </>
            ) : null}
          </>
        ) : null}
      </div>

      {/* Miniaturas (video primero, si existe) */}
      {video || hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {video ? (
            <button
              type="button"
              onClick={() => setMode("video")}
              aria-label="Ver video"
              aria-current={mode === "video"}
              className={cn(
                "relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-[#0B0B0D] transition",
                mode === "video"
                  ? "border-primary"
                  : "border-border opacity-70 hover:opacity-100"
              )}
            >
              {facadePoster ? (
                <Image
                  src={facadePoster}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 bg-black" />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="size-5 fill-current text-white" aria-hidden />
              </span>
            </button>
          ) : null}

          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setMode("image");
                setSelected(i);
              }}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={mode === "image" && i === selected}
              className={cn(
                "relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-[#0B0B0D] transition",
                mode === "image" && i === selected
                  ? "border-primary"
                  : "border-border opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="96px"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Lightbox / modal a pantalla completa */}
      {lightboxOpen && current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${alt}`}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 sm:p-12"
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X className="size-6" aria-hidden />
          </button>

          {/* Imagen centrada (clic sobre ella no cierra) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto h-full w-full max-w-6xl"
          >
            <Image
              src={current.url}
              alt={alt}
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="select-none object-contain"
            />
          </div>

          {hasMultiple ? (
            <>
              <NavArrow direction="prev" onClick={goPrev} className="left-4" />
              <NavArrow direction="next" onClick={goNext} className="right-4" />
              <span className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {selected + 1} / {images.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
