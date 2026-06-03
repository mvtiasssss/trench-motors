/**
 * Configuración central de Trench Motors: datos de contacto, navegación y redes.
 */
export const siteConfig = {
  nombre: "Trench Motors",
  slogan: "Autos nuevos y usados en Santiago",
  descripcion:
    "Compra vehículos nuevos y usados con financiamiento a tu medida. 15 años de experiencia. Confianza, garantía y atención cercana.",
  url: "https://trenchmotors.cl",
  telefono: "+56 9 9784 6740",
  telefonoHref: "tel:+56997846740",
  whatsapp: "56997846740",
  email: "matiastrenchcorreo@gmail.com",
  direccion: "El Acueducto 2945, Santiago",
  horarios: [
    { dias: "Lunes a Domingo", horas: "24/7" },
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
