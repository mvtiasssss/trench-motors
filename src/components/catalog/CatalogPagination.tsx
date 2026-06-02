import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  /** Params actuales del catálogo (sin "page"). */
  params: Record<string, string>;
}

function buildPages(page: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function CatalogPagination({
  page,
  totalPages,
  params,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams(params);
    if (p <= 1) sp.delete("page");
    else sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  };

  const pages = buildPages(page, totalPages);
  const navClass = (active: boolean) =>
    cn(buttonVariants({ variant: active ? "default" : "outline", size: "icon" }));
  const disabledClass = cn(
    buttonVariants({ variant: "outline", size: "icon" }),
    "pointer-events-none opacity-50"
  );

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Paginación"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={navClass(false)} aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={navClass(p === page)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={navClass(false)} aria-label="Página siguiente">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
