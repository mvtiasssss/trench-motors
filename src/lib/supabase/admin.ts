import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave service_role.
 * SOLO para uso en el servidor (Route Handlers / Server Actions): omite RLS y
 * tiene acceso total. Nunca debe importarse en código que llegue al navegador.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
