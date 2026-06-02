/**
 * Configuración central de Trench Motors: datos de contacto, navegación y redes.
 * Estos valores son provisionales; reemplázalos por los reales cuando estén.
 */
export const siteConfig = {
  nombre: "Trench Motors",
  telefono: "+56 9 1234 5678",
  telefonoHref: "tel:+56912345678",
  // Número en formato internacional sin "+" ni espacios, para enlaces wa.me
  whatsapp: "56912345678",
  email: "contacto@trenchmotors.cl",
  direccion: "Av. Las Condes 1234, Santiago, Chile",
  horarios: [
    { dias: "Lunes a Viernes", horas: "09:00 – 19:00" },
    { dias: "Sábado", horas: "10:00 – 14:00" },
    { dias: "Domingo y festivos", horas: "Cerrado" },
  ],
  redes: {
    instagram: "https://instagram.com/trenchmotors",
    facebook: "https://facebook.com/trenchmotors",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Financiamiento", href: "/financiamiento" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];
