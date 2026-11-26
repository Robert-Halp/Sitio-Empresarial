-- =============================================================
-- Vistas de solo lectura para el panel web publico.
--
-- Las tablas de `constructora` tienen RLS y solo las lee service_role.
-- Para el dashboard (GitHub Pages) se exponen estas vistas que:
--   * solo muestran columnas no sensibles (se omite salario),
--   * resuelven las relaciones (cliente, empleado, proyecto),
--   * son de solo lectura para `anon`.
-- El resto de columnas y toda la escritura sigue bloqueada.
-- =============================================================

-- 1. CLIENTES --------------------------------------------------
create or replace view constructora.vista_clientes as
select id, nombre, email, telefono, direccion, creado_en
from constructora.clientes;

-- 2. PROYECTOS (con nombre del cliente) ------------------------
create or replace view constructora.vista_proyectos as
select
  p.id,
  p.nombre,
  p.estado,
  p.presupuesto,
  p.fecha_inicio,
  p.fecha_entrega,
  p.direccion,
  c.nombre as cliente
from constructora.proyectos p
join constructora.clientes c on c.id = p.cliente_id;

-- 3. EMPLEADOS (sin salario) -----------------------------------
create or replace view constructora.vista_empleados as
select id, nombre, puesto, activo, contratado_en, telefono
from constructora.empleados;

-- 4. ASIGNACIONES (con nombres ya resueltos) -------------------
create or replace view constructora.vista_asignaciones as
select
  a.id,
  pr.nombre as proyecto,
  e.nombre  as empleado,
  e.puesto,
  a.rol_en_obra,
  a.horas_semanales,
  a.desde,
  a.hasta
from constructora.asignaciones a
join constructora.proyectos pr on pr.id = a.proyecto_id
join constructora.empleados e  on e.id = a.empleado_id;

-- 5. MATERIALES ------------------------------------------------
create or replace view constructora.vista_materiales as
select id, nombre, unidad, precio_unitario, stock, proveedor, actualizado_en
from constructora.materiales;

-- PERMISOS -----------------------------------------------------
-- `anon` solo puede leer las vistas. Nunca las tablas base.
revoke all on constructora.vista_clientes     from anon, authenticated;
revoke all on constructora.vista_proyectos    from anon, authenticated;
revoke all on constructora.vista_empleados    from anon, authenticated;
revoke all on constructora.vista_asignaciones from anon, authenticated;
revoke all on constructora.vista_materiales   from anon, authenticated;

grant select on
  constructora.vista_clientes,
  constructora.vista_proyectos,
  constructora.vista_empleados,
  constructora.vista_asignaciones,
  constructora.vista_materiales
to anon, authenticated, service_role;

comment on view constructora.vista_clientes     is 'Clientes para el dashboard publico (sin datos internos)';
comment on view constructora.vista_proyectos    is 'Proyectos con el nombre del cliente resuelto';
comment on view constructora.vista_empleados    is 'Plantilla sin salario: dato confidencial';
comment on view constructora.vista_asignaciones is 'Asignaciones con proyecto y empleado resueltos';
comment on view constructora.vista_materiales   is 'Catalogo de materiales con stock';
