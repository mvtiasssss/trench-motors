"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

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

export function Gallery({ images, alt, videoUrl }: GalleryProps) {
  const video = videoUrl ? parseVideo(videoUrl) : null;

  // Modo inicial: si hay video, mostrarlo primero; si no, la primera foto.
  const [mode, setMode] = React.useState<"video" | "image">(
    video ? "video" : "image"
  );
  const [selected, setSelected] = React.useState(0);
  const [videoActivado, setVideoActivado] = React.useState(false);

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
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
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
          <Image
            src={current.url}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        ) : null}
      </div>

      {/* Miniaturas (video primero, si existe) */}
      {video || images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {video ? (
            <button
              type="button"
              onClick={() => setMode("video")}
              aria-label="Ver video"
              aria-current={mode === "video"}
              className={cn(
                "relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-md border transition",
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
                "relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-md border transition",
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
    </div>
  );
}
