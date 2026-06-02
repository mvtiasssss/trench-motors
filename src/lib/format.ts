/** Formatea un monto en pesos chilenos (CLP) sin decimales: 12990000 → "$12.990.000". */
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formatea kilometraje con separador de miles: 45000 → "45.000 km". */
export function formatKm(km: number): string {
  return `${new Intl.NumberFormat("es-CL").format(km)} km`;
}
