-- =============================================================
-- Esquema: Constructora de casas
-- 5 tablas: clientes, proyectos, empleados, asignaciones, materiales
-- =============================================================

-- 1. CLIENTES -------------------------------------------------
create table if not exists public.clientes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  email       text unique,
  telefono    text,
  direccion   text,
  notas       text,
  creado_en   timestamptz not null default now(),
  constraint clientes_nombre_valido check (char_length(btrim(nombre)) between 2 and 120),
  constraint clientes_email_valido  check (email is null or position('@' in email) > 1)
);

comment on table public.clientes is 'Personas o empresas que contratan la construccion';

-- 2. PROYECTOS ------------------------------------------------
create table if not exists public.proyectos (
  id             uuid primary key default gen_random_uuid(),
  cliente_id     uuid not null references public.clientes(id) on delete restrict,
  nombre         text not null,
  direccion      text,
  estado         text not null default 'planificacion',
  presupuesto    numeric(12,2),
  fecha_inicio   date,
  fecha_entrega  date,
  creado_en      timestamptz not null default now(),
  constraint proyectos_nombre_valido check (char_length(btrim(nombre)) between 2 and 160),
  constraint proyectos_estado_valido check (estado in (
    'planificacion','permisos','cimentacion','estructura','acabados','entregado','cancelado'
  )),
  constraint proyectos_presupuesto_positivo check (presupuesto is null or presupuesto >= 0),
  constraint proyectos_fechas_coherentes
    check (fecha_entrega is null or fecha_inicio is null or fecha_entrega >= fecha_inicio)
);

comment on table public.proyectos is 'Obras de construccion, cada una ligada a un cliente';

-- 3. EMPLEADOS ------------------------------------------------
create table if not exists public.empleados (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  email          text unique,
  telefono       text,
  puesto         text not null,
  salario        numeric(10,2),
  activo         boolean not null default true,
  contratado_en  date not null default current_date,
  constraint empleados_nombre_valido check (char_length(btrim(nombre)) between 2 and 120),
  constraint empleados_puesto_valido check (puesto in (
    'arquitecto','ingeniero','maestro_obra','albanil','electricista','plomero','pintor','administrativo'
  )),
  constraint empleados_salario_positivo check (salario is null or salario >= 0)
);

comment on table public.empleados is 'Plantilla de la constructora';

-- 4. ASIGNACIONES (proyecto <-> empleado) ---------------------
create table if not exists public.asignaciones (
  id               uuid primary key default gen_random_uuid(),
  proyecto_id      uuid not null references public.proyectos(id) on delete cascade,
  empleado_id      uuid not null references public.empleados(id) on delete restrict,
  rol_en_obra      text,
  horas_semanales  smallint,
  desde            date not null default current_date,
  hasta            date,
  constraint asignaciones_horas_validas
    check (horas_semanales is null or horas_semanales between 1 and 60),
  constraint asignaciones_fechas_coherentes
    check (hasta is null or hasta >= desde),
  constraint asignaciones_unica_por_periodo unique (proyecto_id, empleado_id, desde)
);

comment on table public.asignaciones is 'Que empleado trabaja en que proyecto y desde cuando';

-- 5. MATERIALES -----------------------------------------------
create table if not exists public.materiales (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  unidad             text not null,
  precio_unitario    numeric(10,2) not null,
  stock              numeric(12,2) not null default 0,
  proveedor          text,
  actualizado_en     timestamptz not null default now(),
  constraint materiales_nombre_valido check (char_length(btrim(nombre)) between 2 and 120),
  constraint materiales_unidad_valida check (unidad in ('unidad','kg','m','m2','m3','saco','litro','rollo')),
  constraint materiales_precio_positivo check (precio_unitario >= 0),
  constraint materiales_stock_positivo check (stock >= 0)
);

comment on table public.materiales is 'Catalogo de materiales con precio y existencias';

-- INDICES ----------------------------------------------------
create index if not exists idx_proyectos_cliente    on public.proyectos(cliente_id);
create index if not exists idx_proyectos_estado     on public.proyectos(estado);
create index if not exists idx_asignaciones_proyecto on public.asignaciones(proyecto_id);
create index if not exists idx_asignaciones_empleado on public.asignaciones(empleado_id);
create index if not exists idx_materiales_nombre    on public.materiales(nombre);

-- RLS --------------------------------------------------------
alter table public.clientes     enable row level security;
alter table public.proyectos    enable row level security;
alter table public.empleados    enable row level security;
alter table public.asignaciones enable row level security;
alter table public.materiales   enable row level security;

-- Solo usuarios autenticados (staff) pueden operar. Anon: nada.
create policy "staff lee clientes"      on public.clientes     for select to authenticated using (true);
create policy "staff crea clientes"     on public.clientes     for insert to authenticated with check (true);
create policy "staff edita clientes"    on public.clientes     for update to authenticated using (true) with check (true);
create policy "staff borra clientes"    on public.clientes     for delete to authenticated using (true);

create policy "staff lee proyectos"     on public.proyectos    for select to authenticated using (true);
create policy "staff crea proyectos"    on public.proyectos    for insert to authenticated with check (true);
create policy "staff edita proyectos"   on public.proyectos    for update to authenticated using (true) with check (true);
create policy "staff borra proyectos"   on public.proyectos    for delete to authenticated using (true);

create policy "staff lee empleados"     on public.empleados    for select to authenticated using (true);
create policy "staff crea empleados"    on public.empleados    for insert to authenticated with check (true);
create policy "staff edita empleados"   on public.empleados    for update to authenticated using (true) with check (true);
create policy "staff borra empleados"   on public.empleados    for delete to authenticated using (true);

create policy "staff lee asignaciones"  on public.asignaciones for select to authenticated using (true);
create policy "staff crea asignaciones" on public.asignaciones for insert to authenticated with check (true);
create policy "staff edita asignaciones" on public.asignaciones for update to authenticated using (true) with check (true);
create policy "staff borra asignaciones" on public.asignaciones for delete to authenticated using (true);

create policy "staff lee materiales"    on public.materiales   for select to authenticated using (true);
create policy "staff crea materiales"   on public.materiales   for insert to authenticated with check (true);
create policy "staff edita materiales"  on public.materiales   for update to authenticated using (true) with check (true);
create policy "staff borra materiales"  on public.materiales   for delete to authenticated using (true);

-- GRANTS -----------------------------------------------------
grant select, insert, update, delete on
  public.clientes,
  public.proyectos,
  public.empleados,
  public.asignaciones,
  public.materiales
to authenticated;

grant all on
  public.clientes,
  public.proyectos,
  public.empleados,
  public.asignaciones,
  public.materiales
to service_role;
