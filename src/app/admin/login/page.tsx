import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Acceso — Trench Motors Admin" };

export default async function AdminLoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");
  return <LoginForm />;
}
