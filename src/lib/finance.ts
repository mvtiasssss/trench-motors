/**
 * Motor de financiamiento de Trench Motors.
 *
 * Fuente ÚNICA de la matemática de cuotas: el simulador del detalle y la
 * "cuota desde" de las tarjetas usan exactamente estas funciones, por lo que
 * los números siempre coinciden.
 *
 * Supuestos por defecto (editables en un solo lugar):
 */

/** Tasa de interés ANUAL por defecto (fracción, no porcentaje). 0.14 = 14%. */
export const TASA_ANUAL_DEFAULT = 0.14;
/** Pie por defecto como fracción del precio. 0.20 = 20%. */
export const PIE_PORCENTAJE_DEFAULT = 0.2;
/** Plazo por defecto en meses. */
export const PLAZO_MESES_DEFAULT = 48;

export interface CuotaOpciones {
  /** Monto del pie en CLP. Si se omite, se usa PIE_PORCENTAJE_DEFAULT del precio. */
  pie?: number;
  /** Plazo en meses. Si se omite, PLAZO_MESES_DEFAULT. */
  plazoMeses?: number;
  /** Tasa ANUAL como fracción (0.14 = 14%). Si se omite, TASA_ANUAL_DEFAULT. */
  tasaAnual?: number;
}

/**
 * Cuota mensual por el sistema de amortización francés (cuota fija).
 * Devuelve un entero en CLP. Cubre el caso de tasa 0 (división simple).
 */
export function calcCuota(precio: number, opciones: CuotaOpciones = {}): number {
  const {
    pie = Math.round(precio * PIE_PORCENTAJE_DEFAULT),
    plazoMeses = PLAZO_MESES_DEFAULT,
    tasaAnual = TASA_ANUAL_DEFAULT,
  } = opciones;

  const montoFinanciado = Math.max(0, precio - pie);
  const n = plazoMeses;
  if (montoFinanciado <= 0 || n <= 0) return 0;

  const i = tasaAnual / 12; // tasa mensual
  if (i === 0) return Math.round(montoFinanciado / n);

  const factor = Math.pow(1 + i, n);
  const cuota = (montoFinanciado * (i * factor)) / (factor - 1);
  return Math.round(cuota);
}

/**
 * "Cuota desde": cuota estimada con los supuestos por defecto. Es lo que se
 * muestra en las tarjetas de vehículo.
 */
export function cuotaDesde(precio: number): number {
  return calcCuota(precio);
}

/**
 * Función INVERSA de {@link cuotaDesde}: dada una cuota máxima mensual (bajo los
 * supuestos por defecto), devuelve el precio máximo equivalente.
 *
 * Bajo supuestos fijos (pie proporcional, plazo y tasa constantes) la cuota es
 * estrictamente creciente en el precio, así que filtrar/ordenar por cuota
 * equivale a filtrar/ordenar por precio. Por eso podemos convertir una
 * "cuota máxima" del usuario a un "precio máximo" y filtrar eficientemente en
 * la consulta SQL.
 *
 * Devuelve un entero (CLP) redondeado hacia abajo, para que el precio resultante
 * nunca produzca una cuota mayor a la pedida.
 */
export function precioMaxParaCuota(cuotaMax: number): number {
  if (!Number.isFinite(cuotaMax) || cuotaMax <= 0) return 0;

  // montoFinanciado = precio * (1 - pie%)  →  precio = montoFinanciado / (1 - pie%)
  const fraccionFinanciada = 1 - PIE_PORCENTAJE_DEFAULT;
  if (fraccionFinanciada <= 0) return 0;

  const n = PLAZO_MESES_DEFAULT;
  const i = TASA_ANUAL_DEFAULT / 12;

  let montoFinanciado: number;
  if (i === 0) {
    // cuota = montoFinanciado / n  →  montoFinanciado = cuota * n
    montoFinanciado = cuotaMax * n;
  } else {
    // cuota = montoFinanciado * i*(1+i)^n / ((1+i)^n - 1)
    const factor = Math.pow(1 + i, n);
    const cuotaPorUnidad = (i * factor) / (factor - 1);
    montoFinanciado = cuotaMax / cuotaPorUnidad;
  }

  return Math.floor(montoFinanciado / fraccionFinanciada);
}
