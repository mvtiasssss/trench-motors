"use client";

import * as React from "react";
import Image from "next/image";

import type { VehicleImage } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/image";

interface GalleryProps {
  images: VehicleImage[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [selected, setSelected] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
        Sin imágenes disponibles
      </div>
    );
  }

  const current = images[selected] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
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
      </div>

      {/* Miniaturas (strip deslizable en móvil) */}
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                "relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-md border transition",
                i === selected
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
