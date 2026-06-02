-- =====================================================================
-- Trench Motors — Datos de ejemplo (seed)
-- Ejecutar en: Supabase → SQL Editor, DESPUÉS de schema.sql.
-- 8 vehículos realistas para Chile (mezcla nuevos/usados), con marcas,
-- imágenes de placeholder (images.unsplash.com) y 2 destacados.
-- Idempotente: las imágenes se regeneran en cada ejecución.
-- =====================================================================

-- ---- Marcas ---------------------------------------------------------
insert into public.brands (nombre) values
  ('Toyota'), ('Hyundai'), ('Kia'), ('Chevrolet'), ('Nissan'), ('Mazda')
on conflict (nombre) do nothing;

-- ---- Vehículos ------------------------------------------------------
insert into public.vehicles
  (slug, marca, modelo, version, anio, precio, kilometraje, tipo, transmision,
   combustible, color, puertas, condicion, descripcion, destacado, vendido)
values
  ('toyota-rav4-2024', 'Toyota', 'RAV4', '2.5 Limited HV AWD', 2024, 41990000, 0,
   'suv', 'automatica', 'hibrido', 'Gris Plata', 5, 'nuevo',
   'RAV4 híbrida 0 km, tracción AWD, equipamiento Limited. Garantía oficial Toyota.',
   true, false),

  ('kia-sportage-2023', 'Kia', 'Sportage', '2.0 LX', 2023, 27490000, 0,
   'suv', 'automatica', 'bencina', 'Gris Titanio', 5, 'nuevo',
   'Sportage nueva generación, motor 2.0, full equipo. Disponible para entrega inmediata.',
   true, false),

  ('toyota-corolla-2021', 'Toyota', 'Corolla', '1.8 XEI CVT', 2021, 16490000, 48000,
   'sedan', 'automatica', 'bencina', 'Blanco Perla', 4, 'usado',
   'Corolla XEI único dueño, mantenciones al día en concesionario. Excelente estado.',
   false, false),

  ('hyundai-tucson-2022', 'Hyundai', 'Tucson', '2.0 CRDi GLS', 2022, 24990000, 36500,
   'suv', 'automatica', 'diesel', 'Negro', 5, 'usado',
   'Tucson diésel automática, bajo kilometraje, muy económica en consumo.',
   false, false),

  ('mazda-cx5-2023', 'Mazda', 'CX-5', '2.0 R', 2023, 29990000, 18500,
   'suv', 'automatica', 'bencina', 'Azul Marino', 5, 'usado',
   'CX-5 como nueva, diseño KODO, interior cuero. Recibimos tu auto en parte de pago.',
   false, false),

  ('nissan-versa-2022', 'Nissan', 'Versa', '1.6 Advance CVT', 2022, 12990000, 29800,
   'sedan', 'automatica', 'bencina', 'Plata', 4, 'usado',
   'Versa Advance automático, amplio maletero, ideal primer auto o trabajo.',
   false, false),

  ('chevrolet-colorado-2021', 'Chevrolet', 'Colorado', '2.8 High Country 4x4', 2021, 23990000, 67000,
   'pickup', 'automatica', 'diesel', 'Blanco', 4, 'usado',
   'Colorado High Country 4x4, mantenida, lista para el trabajo o la aventura.',
   false, false),

  ('chevrolet-sail-2019', 'Chevrolet', 'Sail', '1.5 LS', 2019, 7990000, 62000,
   'sedan', 'manual', 'bencina', 'Rojo', 4, 'usado',
   'Sail 1.5 económico y confiable. (Vehículo de ejemplo marcado como vendido.)',
   false, true)
on conflict (slug) do nothing;

-- ---- Imágenes (se limpian y recrean para evitar duplicados) ---------
delete from public.vehicle_images
where vehicle_id in (
  select id from public.vehicles where slug in (
    'toyota-rav4-2024','kia-sportage-2023','toyota-corolla-2021','hyundai-tucson-2022',
    'mazda-cx5-2023','nissan-versa-2022','chevrolet-colorado-2021','chevrolet-sail-2019'
  )
);

insert into public.vehicle_images (vehicle_id, url, orden, es_principal) values
  -- Toyota RAV4 (3)
  ((select id from public.vehicles where slug='toyota-rav4-2024'),
   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=70', 0, true),
  ((select id from public.vehicles where slug='toyota-rav4-2024'),
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70', 1, false),
  ((select id from public.vehicles where slug='toyota-rav4-2024'),
   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=70', 2, false),

  -- Kia Sportage (2)
  ((select id from public.vehicles where slug='kia-sportage-2023'),
   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=70', 0, true),
  ((select id from public.vehicles where slug='kia-sportage-2023'),
   'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70', 1, false),

  -- Toyota Corolla (2)
  ((select id from public.vehicles where slug='toyota-corolla-2021'),
   'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=70', 0, true),
  ((select id from public.vehicles where slug='toyota-corolla-2021'),
   'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=70', 1, false),

  -- Hyundai Tucson (1)
  ((select id from public.vehicles where slug='hyundai-tucson-2022'),
   'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=70', 0, true),

  -- Mazda CX-5 (3)
  ((select id from public.vehicles where slug='mazda-cx5-2023'),
   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=70', 0, true),
  ((select id from public.vehicles where slug='mazda-cx5-2023'),
   'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70', 1, false),
  ((select id from public.vehicles where slug='mazda-cx5-2023'),
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70', 2, false),

  -- Nissan Versa (1)
  ((select id from public.vehicles where slug='nissan-versa-2022'),
   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=70', 0, true),

  -- Chevrolet Colorado (2)
  ((select id from public.vehicles where slug='chevrolet-colorado-2021'),
   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=70', 0, true),
  ((select id from public.vehicles where slug='chevrolet-colorado-2021'),
   'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=70', 1, false),

  -- Chevrolet Sail (1)
  ((select id from public.vehicles where slug='chevrolet-sail-2019'),
   'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=70', 0, true);
