-- =============================================================
-- Acceso privado al panel
--   * se retira todo permiso sobre `constructora` al rol anon
--   * solo usuarios autenticados (Supabase Auth) pueden leer/escribir
--   * nomina sigue restringida a service_role
-- =============================================================

-- 1. Políticas: eliminar las públicas y crear las de usuarios -------------
do $$
declare t text;
begin
  foreach t in array array[
    'clientes','proyectos','empleados','asignaciones','materiales',
    'proveedores','pagos','consumos','avances'
  ] loop
    -- fuera políticas anónimas
    execute format('drop policy if exists "lectura publica" on constructora.%I', t);
    execute format('drop policy if exists "alta publica" on constructora.%I', t);
    execute format('drop policy if exists "edicion publica" on constructora.%I', t);

    -- políticas para usuarios con sesión
    execute format('drop policy if exists "panel lectura" on constructora.%I', t);
    execute format('create policy "panel lectura" on constructora.%I for select to authenticated using (true)', t);

    execute format('drop policy if exists "panel alta" on constructora.%I', t);
    execute format('create policy "panel alta" on constructora.%I for insert to authenticated with check (true)', t);

    execute format('drop policy if exists "panel edicion" on constructora.%I', t);
    execute format('create policy "panel edicion" on constructora.%I for update to authenticated using (true) with check (true)', t);

    execute format('drop policy if exists "panel borrado" on constructora.%I', t);
    execute format('create policy "panel borrado" on constructora.%I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- 2. Permisos por rol -----------------------------------------------------
revoke all on all tables in schema constructora from anon;
revoke usage on schema constructora from anon;

grant usage on schema constructora to authenticated, service_role;
grant select, insert, update, delete on all tables in schema constructora to authenticated;
grant all on all tables in schema constructora to service_role;

-- La nómina queda fuera del panel
revoke all on constructora.nomina from authenticated;

-- 3. Vistas: solo con sesión ---------------------------------------------
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
to authenticated, service_role;

-- 4. Realtime: las tablas ya están en la publicación; las políticas de
--    lectura de `authenticated` son las que autorizan los eventos.
