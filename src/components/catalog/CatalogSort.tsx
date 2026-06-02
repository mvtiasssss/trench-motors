"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ORDENES } from "@/lib/vehicle-options";

export function CatalogSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get("orden") ?? "recientes";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value === "recientes") params.delete("orden");
    else params.set("orden", event.target.value);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="orden"
        className="text-sm text-muted-foreground whitespace-nowrap"
      >
        Ordenar por
      </label>
      <select
        id="orden"
        value={value}
        onChange={handleChange}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {ORDENES.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
