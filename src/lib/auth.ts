import { createClient } from "@/lib/supabase/server";

/**
 * Devuelve el usuario autenticado (admin) o null.
 * Usa el cliente de servidor (cookies) y valida contra Supabase Auth con getUser().
 */
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
