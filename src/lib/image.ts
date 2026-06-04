/**
 * Placeholder de bajo costo para next/image (`placeholder="blur"`).
 *
 * Next.js solo genera blurDataURL automáticamente para imágenes importadas
 * estáticamente; nuestras fotos son remotas (Supabase/Unsplash), así que
 * usamos este degradado oscuro fijo. Evita el "flash" de caja vacía y el salto
 * visual mientras carga la foto, sin costo de red (es un SVG embebido).
 *
 * SVG: degradado #1c1c20 → #0d0d10 (acorde al tema oscuro de la marca).
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFjMWMyMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBkMGQxMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==";
