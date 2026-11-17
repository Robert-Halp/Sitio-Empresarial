-- Tabla de mensajes del formulario de contacto
create table if not exists public.contactos (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null check (char_length(nombre) between 2 and 120),
  email      text not null check (position('@' in email) > 1),
  mensaje    text check (char_length(mensaje) <= 2000),
  creado_en  timestamptz not null default now()
);

comment on table public.contactos is 'Mensajes enviados desde el formulario de contacto del sitio';

-- RLS: cerrado por defecto
alter table public.contactos enable row level security;

-- El formulario público puede INSERTAR, pero nunca leer
create policy "anon puede enviar formulario"
  on public.contactos
  for insert
  to anon, authenticated
  with check (true);

-- Solo usuarios autenticados pueden leer los mensajes
create policy "autenticados pueden leer"
  on public.contactos
  for select
  to authenticated
  using (true);

-- Permisos de los roles de la API (necesarios al no exponer tablas automáticamente)
grant insert on public.contactos to anon, authenticated;
grant select on public.contactos to authenticated;
