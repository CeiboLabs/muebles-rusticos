-- ============================================================
-- Muebles Rústicos Solymar — Initial Schema
-- ============================================================

-- Categories table
create table if not exists public.categories (
  id          bigserial primary key,
  name        text        not null,
  slug        text        not null unique,
  description text,
  cover_image_url text,
  created_at  timestamptz default now()
);

-- Gallery items table
create table if not exists public.gallery_items (
  id          bigserial primary key,
  category_id bigint      not null references public.categories(id) on delete cascade,
  title       text,
  description text,
  image_url   text        not null,
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists gallery_items_category_id_idx on public.gallery_items(category_id);

-- Row Level Security
alter table public.categories   enable row level security;
alter table public.gallery_items enable row level security;

-- Public read access
create policy "Public read categories"
  on public.categories for select using (true);

create policy "Public read gallery_items"
  on public.gallery_items for select using (true);

-- Authenticated write access
create policy "Authenticated insert categories"
  on public.categories for insert with check (auth.role() = 'authenticated');

create policy "Authenticated update categories"
  on public.categories for update using (auth.role() = 'authenticated');

create policy "Authenticated delete categories"
  on public.categories for delete using (auth.role() = 'authenticated');

create policy "Authenticated insert gallery_items"
  on public.gallery_items for insert with check (auth.role() = 'authenticated');

create policy "Authenticated update gallery_items"
  on public.gallery_items for update using (auth.role() = 'authenticated');

create policy "Authenticated delete gallery_items"
  on public.gallery_items for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Seed: Categories
-- ============================================================
insert into public.categories (name, slug, description) values
  ('Comedores',             'comedores',          'Mesas y sillas de comedor artesanales'),
  ('Living',                'living',             'Sofás, sillones y muebles para el living'),
  ('Dormitorios',           'dormitorios',        'Camas, placares y mesas de luz'),
  ('Dormitorios de Niños',  'dormitorios-ninos',  'Muebles infantiles seguros y duraderos'),
  ('Baños y Cocinas',       'banos-y-cocinas',    'Muebles para baño y cocina'),
  ('Barbacoas',             'barbacoas',          'Parrillas y estructuras para asado'),
  ('Escritorios',           'escritorios',        'Escritorios y muebles de oficina'),
  ('Muebles de Exterior',   'exterior',           'Muebles resistentes para exteriores'),
  ('Hierro y Madera',       'hierro-y-madera',    'Combinaciones de hierro forjado y madera'),
  ('Tapicería',             'tapiceria',          'Tapizado artesanal de alta calidad'),
  ('Pérgolas y Decks',      'pergolas-y-decks',   'Estructuras de madera para exteriores'),
  ('Decoración',            'decoracion',         'Piezas decorativas únicas')
on conflict (slug) do nothing;
