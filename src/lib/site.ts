/**
 * Configuración central de Trench Motors: datos de contacto, navegación y redes.
 */
export const siteConfig = {
  nombre: "Trench Motors",
  slogan: "Autos nuevos y usados en Santiago",
  descripcion:
    "Compra vehículos nuevos y usados con financiamiento a tu medida. 15 años de experiencia. Confianza, garantía y atención cercana.",
  url: "https://trenchmotors.cl",
  telefono: "+56 9 5669 8671",
  telefonoHref: "tel:+56956698671",
  whatsapp: "56956698671",
  email: "george@trenchmotors.cl",
  redes: {
    instagram: "https://instagram.com/automotoratrenchmotors",
    facebook: "https://www.facebook.com/profile.php?id=61590865915183",
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
  { label: "Contacto", href: "/contacto" },
];
