import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Logo oficial de Trench Motors (escudo cromado con auto y acento rojo en "CH").
  Se usa public/logo-trench.jpg. Si en el futuro hay un PNG con fondo transparente
  (public/logo-trench.png), basta cambiar `LOGO_SRC` aquí.
*/
const LOGO_SRC = "/logo-trench.jpg";
const LOGO_W = 701;
const LOGO_H = 632;

interface LogoProps {
  className?: string;
  /** "horizontal" para headers (más bajo); "full" para footer/hero (más alto). */
  variant?: "full" | "horizontal";
  priority?: boolean;
}

export function Logo({ className, variant = "full", priority = false }: LogoProps) {
  const sizeClass = variant === "horizontal" ? "h-11 w-auto" : "h-24 w-auto";
  return (
    <Image
      src={LOGO_SRC}
      alt="Trench Motors"
      width={LOGO_W}
      height={LOGO_H}
      priority={priority}
      className={cn("object-contain", sizeClass, className)}
    />
  );
}
