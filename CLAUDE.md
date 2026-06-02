# Trench Motors

Sitio web de la automotora **Trench Motors**.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (modo `strict`)
- **Tailwind CSS** v3
- **shadcn/ui** (estilo `default`, color base `slate`, variables CSS HSL, modo oscuro activado por clase)
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) para datos y autenticación
- **Resend** para correos transaccionales
- Alias de import: `@/*` → `src/*`

## Estructura de carpetas

```
src/
├── app/                   # Rutas, layouts y páginas (App Router)
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes de shadcn/ui (generados)
│   └── layout/            # Header, footer y estructura de página
├── lib/
│   └── supabase/
│       ├── client.ts      # Cliente de navegador (Client Components)
│       └── server.ts      # Cliente de servidor (Server Components / Route Handlers)
├── hooks/                 # Custom hooks de React
└── types/                 # Tipos y modelos compartidos de TypeScript
```

## Convenciones

- **Componentes** en `PascalCase` (p. ej. `VehicleCard`).
- **Archivos** (y carpetas) en `kebab-case` (p. ej. `vehicle-card.tsx`). Excepción: los archivos especiales de Next (`page.tsx`, `layout.tsx`, etc.).
- **Todos los textos visibles en español** (incluyendo metadata, mensajes y comentarios de cara al usuario).
- **Moneda en CLP** formateada con `Intl.NumberFormat('es-CL')`:

  ```ts
  const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
  formatoCLP.format(12990000); // "$12.990.000"
  ```

- Variables de entorno: ver `.env.example`. Nunca commitear `.env.local`. Las claves `SUPABASE_SERVICE_ROLE_KEY` y `RESEND_API_KEY` son secretas y solo se usan en el servidor.
- Para añadir componentes de shadcn/ui usar el CLI: `npx shadcn@latest add <componente>`.

## Regla obligatoria antes de cada commit

Ejecutar y dejar **sin errores**:

```bash
npm run lint
npx tsc --noEmit
```

No commitear si alguno de los dos falla.
