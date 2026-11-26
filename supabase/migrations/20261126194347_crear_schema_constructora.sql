-- =============================================================
-- Mueve el esquema de la constructora fuera de "public"
-- a un schema propio: constructora
-- =============================================================

create schema if not exists constructora;

comment on schema constructora is 'Esquema de la constructora de casas: clientes, proyectos, personal y materiales';

-- Uso del schema para los roles de la API
grant usage on schema constructora to anon, authenticated, service_role;

-- Mover las 5 tablas (conserva datos, FKs, indices y politicas)
alter table public.clientes     set schema constructora;
alter table public.proyectos    set schema constructora;
alter table public.empleados    set schema constructora;
alter table public.asignaciones set schema constructora;
alter table public.materiales   set schema constructora;

-- Permisos sobre las tablas en su nuevo schema
grant select, insert, update, delete on all tables in schema constructora to authenticated;
grant all on all tables in schema constructora to service_role;

-- Permisos por defecto para tablas futuras en este schema
alter default privileges in schema constructora
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema constructora
  grant all on tables to service_role;
