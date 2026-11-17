-- service_role se salta RLS, pero aun asi necesita privilegios de tabla
-- (la opcion "exponer automaticamente nuevas tablas" esta desactivada)
grant select, insert, update, delete on public.contactos to service_role;
