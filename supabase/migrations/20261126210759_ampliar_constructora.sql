-- =============================================================
-- Ampliación del esquema constructora
--   * 5 tablas nuevas: proveedores, pagos, consumos, avances, nomina
--   * el salario sale de empleados y pasa a nomina (dato privado)
--   * escritura desde el panel para el rol anon (modo demo)
--   * tablas publicadas en Realtime para actualizar el front en vivo
-- =============================================================

-- 1. PROVEEDORES -----------------------------------------------
create table if not exists constructora.proveedores (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  contacto    text,
  telefono    text,
  email       text,
  activo      boolean not null default true,
  creado_en   timestamptz not null default now(),
  constraint proveedores_nombre_valido check (char_length(btrim(nombre)) between 2 and 120),
  constraint proveedores_email_valido check (email is null or position('@' in email) > 1),
  constraint proveedores_nombre_unico unique (nombre)
);
comment on table constructora.proveedores is 'Empresas que surten materiales a la constructora';

-- 2. PAGOS -----------------------------------------------------
create table if not exists constructora.pagos (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references constructora.proyectos(id) on delete cascade,
  monto        numeric(12,2) not null,
  fecha        date not null default current_date,
  metodo       text not null default 'transferencia',
  referencia   text,
  estado       text not null default 'pagado',
  creado_en    timestamptz not null default now(),
  constraint pagos_monto_positivo check (monto > 0),
  constraint pagos_metodo_valido check (metodo in ('transferencia','efectivo','cheque','tarjeta')),
  constraint pagos_estado_valido check (estado in ('pendiente','pagado','cancelado'))
);
comment on table constructora.pagos is 'Cobros y abonos recibidos por cada proyecto';

-- 3. CONSUMOS (materiales usados en una obra) -------------------
create table if not exists constructora.consumos (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references constructora.proyectos(id) on delete cascade,
  material_id  uuid not null references constructora.materiales(id) on delete restrict,
  cantidad     numeric(12,3) not null,
  fecha        date not null default current_date,
  notas        text,
  creado_en    timestamptz not null default now(),
  constraint consumos_cantidad_positiva check (cantidad > 0)
);
comment on table constructora.consumos is 'Materiales consumidos por proyecto (base del costo real)';

-- 4. AVANCES ---------------------------------------------------
create table if not exists constructora.avances (
  id           uuid primary key default gen_random_uuid(),
  proyecto_id  uuid not null references constructora.proyectos(id) on delete cascade,
  empleado_id  uuid references constructora.empleados(id) on delete set null,
  fecha        date not null default current_date,
  porcentaje   smallint not null,
  descripcion  text,
  creado_en    timestamptz not null default now(),
  constraint avances_porcentaje_valido check (porcentaje between 0 and 100)
);
comment on table constructora.avances is 'Reportes de avance de obra con porcentaje';

-- 5. NOMINA (dato privado: no se expone en el panel) ------------
create table if not exists constructora.nomina (
  id           uuid primary key default gen_random_uuid(),
  empleado_id  uuid not null references constructora.empleados(id) on delete cascade,
  salario      numeric(10,2) not null,
  desde        date not null default current_date,
  hasta        date,
  creado_en    timestamptz not null default now(),
  constraint nomina_salario_positivo check (salario >= 0),
  constraint nomina_fechas_coherentes check (hasta is null or hasta >= desde)
);
comment on table constructora.nomina is 'Historial salarial del personal (privado, solo service_role)';

-- Mover el salario existente de empleados a nomina ---------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'constructora' and table_name = 'empleados' and column_name = 'salario'
  ) then
    insert into constructora.nomina (empleado_id, salario, desde)
    select id, salario, contratado_en
    from constructora.empleados
    where salario is not null;

    alter table constructora.empleados drop column salario;
  end if;
end $$;

-- INDICES ------------------------------------------------------
create index if not exists idx_pagos_proyecto      on constructora.pagos(proyecto_id);
create index if not exists idx_pagos_estado        on constructora.pagos(estado);
create index if not exists idx_consumos_proyecto  on constructora.consumos(proyecto_id);
create index if not exists idx_consumos_material   on constructora.consumos(material_id);
create index if not exists idx_avances_proyecto    on constructora.avances(proyecto_id);
create index if not exists idx_nomina_empleado     on constructora.nomina(empleado_id);
create index if not exists idx_proveedores_nombre  on constructora.proveedores(nombre);

-- VISTAS -------------------------------------------------------
-- Se añaden columnas al final para poder editar desde el panel.
create or replace view constructora.vista_clientes as
select id, nombre, email, telefono, direccion, creado_en, notas
from constructora.clientes;

create or replace view constructora.vista_proyectos as
select
  p.id, p.nombre, p.estado, p.presupuesto,
  p.fecha_inicio, p.fecha_entrega, p.direccion,
  c.nombre as cliente,
  p.cliente_id
from constructora.proyectos p
join constructora.clientes c on c.id = p.cliente_id;

create or replace view constructora.vista_empleados as
select id, nombre, puesto, activo, contratado_en, telefono, email
from constructora.empleados;

create or replace view constructora.vista_asignaciones as
select
  a.id,
  pr.nombre as proyecto,
  e.nombre  as empleado,
  e.puesto,
  a.rol_en_obra,
  a.horas_semanales,
  a.desde,
  a.hasta,
  a.proyecto_id,
  a.empleado_id
from constructora.asignaciones a
join constructora.proyectos pr on pr.id = a.proyecto_id
join constructora.empleados e  on e.id = a.empleado_id;

create or replace view constructora.vista_materiales as
select id, nombre, unidad, precio_unitario, stock, proveedor, actualizado_en
from constructora.materiales;

create or replace view constructora.vista_proveedores as
select id, nombre, contacto, telefono, email, activo, creado_en
from constructora.proveedores;

create or replace view constructora.vista_pagos as
select
  pa.id,
  pa.proyecto_id,
  pr.nombre as proyecto,
  pa.monto,
  pa.fecha,
  pa.metodo,
  pa.referencia,
  pa.estado
from constructora.pagos pa
join constructora.proyectos pr on pr.id = pa.proyecto_id;

create or replace view constructora.vista_consumos as
select
  co.id,
  co.proyecto_id,
  pr.nombre as proyecto,
  co.material_id,
  ma.nombre as material,
  ma.unidad,
  co.cantidad,
  co.fecha,
  round(co.cantidad * ma.precio_unitario, 2) as costo,
  co.notas
from constructora.consumos co
join constructora.proyectos pr on pr.id = co.proyecto_id
join constructora.materiales ma on ma.id = co.material_id;

create or replace view constructora.vista_avances as
select
  av.id,
  av.proyecto_id,
  pr.nombre as proyecto,
  av.empleado_id,
  e.nombre as empleado,
  av.fecha,
  av.porcentaje,
  av.descripcion
from constructora.avances av
join constructora.proyectos pr on pr.id = av.proyecto_id
left join constructora.empleados e on e.id = av.empleado_id;

-- RLS + PERMISOS -----------------------------------------------
-- Modo demo: `anon` puede leer, insertar y actualizar (no borrar).
-- En producción se reemplaza por Supabase Auth y políticas propias.
do $$
declare t text;
begin
  foreach t in array array[
    'clientes','proyectos','empleados','asignaciones','materiales',
    'proveedores','pagos','consumos','avances'
  ] loop
    execute format('alter table constructora.%I enable row level security', t);

    execute format('drop policy if exists "lectura publica" on constructora.%I', t);
    execute format('create policy "lectura publica" on constructora.%I for select to anon using (true)', t);

    execute format('drop policy if exists "alta publica" on constructora.%I', t);
    execute format('create policy "alta publica" on constructora.%I for insert to anon with check (true)', t);

    execute format('drop policy if exists "edicion publica" on constructora.%I', t);
    execute format('create policy "edicion publica" on constructora.%I for update to anon using (true) with check (true)', t);

    execute format('grant select, insert, update on constructora.%I to anon', t);
    execute format('grant select, insert, update, delete on constructora.%I to authenticated, service_role', t);
  end loop;
end $$;

-- Nómina: privada
alter table constructora.nomina enable row level security;
revoke all on constructora.nomina from anon, authenticated;
grant all on constructora.nomina to service_role;

-- Permisos de lectura sobre todas las vistas
grant select on
  constructora.vista_clientes,
  constructora.vista_proyectos,
  constructora.vista_empleados,
  constructora.vista_asignaciones,
  constructora.vista_materiales,
  constructora.vista_proveedores,
  constructora.vista_pagos,
  constructora.vista_consumos,
  constructora.vista_avances
to anon, authenticated, service_role;

-- REALTIME -----------------------------------------------------
do $$
declare t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array[
      'clientes','proyectos','empleados','asignaciones','materiales',
      'proveedores','pagos','consumos','avances'
    ] loop
      begin
        execute format('alter publication supabase_realtime add table constructora.%I', t);
      exception
        when duplicate_object then null;
      end;
    end loop;
  end if;
end $$;

-- DATOS DE EJEMPLO ---------------------------------------------
insert into constructora.proveedores (nombre, contacto, telefono, email) values
  ('Cemex',                 'Ventas Cemex',        '+52 81 8000 1000', 'ventas@cemex.example'),
  ('Deacero',               'Atención a clientes', '+52 81 8000 2000', 'contacto@deacero.example'),
  ('Materiales del Norte',  'Mostrador',           '+52 81 8000 3000', 'ventas@materialesnorte.example')
on conflict (nombre) do nothing;

insert into constructora.pagos (proyecto_id, monto, fecha, metodo, referencia, estado)
select p.id, v.monto, v.fecha, v.metodo, v.referencia, v.estado
from (values
  ('Residencial Los Robles',   1500000.00::numeric, '2026-03-01'::date, 'transferencia', 'TRF-1001', 'pagado'),
  ('Residencial Los Robles',    800000.00,          '2026-07-15'::date, 'transferencia', 'TRF-1042', 'pagado'),
  ('Residencial Los Robles',    500000.00,          '2026-11-20'::date, 'cheque',        'CHQ-0087', 'pendiente'),
  ('Casa Unifamiliar Cumbres',  900000.00,          '2026-05-10'::date, 'transferencia', 'TRF-1020', 'pagado'),
  ('Casa Unifamiliar Cumbres',  400000.00,          '2026-09-02'::date, 'efectivo',      'REC-0031', 'pagado'),
  ('Villas del Lago etapa 1',  1000000.00,          '2026-11-05'::date, 'transferencia', 'TRF-1099', 'pagado')
) as v(proyecto, monto, fecha, metodo, referencia, estado)
join constructora.proyectos p on p.nombre = v.proyecto;

insert into constructora.consumos (proyecto_id, material_id, cantidad, fecha, notas)
select p.id, m.id, v.cantidad, v.fecha, v.notas
from (values
  ('Residencial Los Robles',  'Cemento gris 50 kg',          120.000::numeric, '2026-09-15'::date, 'Colado de cimentación'),
  ('Residencial Los Robles',  'Varilla corrugada 3/8',       300.000,          '2026-09-15'::date, 'Armado de castillos'),
  ('Residencial Los Robles',  'Block de concreto 15x20x40', 1500.000,          '2026-10-02'::date, 'Muros planta baja'),
  ('Casa Unifamiliar Cumbres','Pintura vinilica blanca',      80.000,          '2026-11-12'::date, 'Acabados interiores'),
  ('Casa Unifamiliar Cumbres','Arena fina',                   20.000,          '2026-10-20'::date, 'Aplanados')
) as v(proyecto, material, cantidad, fecha, notas)
join constructora.proyectos p  on p.nombre = v.proyecto
join constructora.materiales m on m.nombre = v.material;

insert into constructora.avances (proyecto_id, empleado_id, fecha, porcentaje, descripcion)
select p.id, e.id, v.fecha, v.porcentaje, v.descripcion
from (values
  ('Residencial Los Robles',   'Carlos Ramirez', '2026-10-01'::date, 45::smallint, 'Colado de losa nivel 2'),
  ('Residencial Los Robles',   'Ana Torres',     '2026-11-01'::date, 65::smallint, 'Estructura terminada, inicio de acabados'),
  ('Casa Unifamiliar Cumbres', 'Luis Mendoza',   '2026-11-10'::date, 85::smallint, 'Pintura y detalles finales'),
  ('Villas del Lago etapa 1',  'Carlos Ramirez', '2026-11-15'::date, 10::smallint, 'Trazo y cimentación')
) as v(proyecto, empleado, fecha, porcentaje, descripcion)
join constructora.proyectos p on p.nombre = v.proyecto
left join constructora.empleados e on e.nombre = v.empleado;
