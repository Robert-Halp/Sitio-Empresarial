-- =============================================================
-- Datos de ejemplo adicionales
-- Objetivo: que las tablas del panel tengan volumen realista
-- (más filas) sin tocar el esquema ni las políticas.
-- Todas las inserciones son idempotentes.
-- =============================================================

-- CLIENTES -----------------------------------------------------
insert into constructora.clientes (nombre, email, telefono, direccion)
select v.nombre, v.email, v.telefono, v.direccion
from (values
  ('Grupo Inmobiliario Alameda', 'contacto@alameda.example',    '+52 55 4821 7700', 'Av. Alameda 210, CDMX'),
  ('Sofia Gutierrez',            'sofia.gutierrez@example.com', '+52 33 2211 8899', 'Calle Coyoacán 88, Guadalajara'),
  ('Desarrollos Peninsula',      'proyectos@peninsula.example',  '+52 998 123 4567', 'Blvd. Kukulcán 12, Cancún'),
  ('Hacienda Los Encinos SA',    'admin@losencinos.example',    '+52 442 300 1122', 'Camino a Los Encinos 5, Querétaro')
) as v(nombre, email, telefono, direccion)
where not exists (select 1 from constructora.clientes c where c.email = v.email);

-- PROYECTOS ----------------------------------------------------
insert into constructora.proyectos (cliente_id, nombre, direccion, estado, presupuesto, fecha_inicio, fecha_entrega)
select c.id, v.nombre, v.direccion, v.estado, v.presupuesto, v.fecha_inicio, v.fecha_entrega
from (values
  ('contacto@alameda.example',  'Privada San Jerónimo',  'Tlalpan, CDMX',      'cimentacion', 3200000.00, '2026-06-01'::date, '2027-03-30'::date),
  ('proyectos@peninsula.example','Torre Mirador Norte',   'Cancún, QRoo',       'permisos',    9800000.00, '2027-02-01'::date, null::date),
  ('sofia.gutierrez@example.com','Casa Patio Coyoacán',   'Coyoacán, CDMX',     'acabados',    2450000.00, '2026-01-20'::date, '2026-12-20'::date),
  ('admin@losencinos.example',  'Hacienda Los Encinos',  'Querétaro, QRO',     'planificacion',6300000.00, '2027-01-10'::date, null::date),
  ('contacto@alameda.example',  'Residencial Alameda II','Tlalpan, CDMX',      'estructura',  5100000.00, '2026-04-15'::date, '2027-06-30'::date)
) as v(email, nombre, direccion, estado, presupuesto, fecha_inicio, fecha_entrega)
join constructora.clientes c on c.email = v.email
where not exists (select 1 from constructora.proyectos p where p.nombre = v.nombre);

-- EMPLEADOS ----------------------------------------------------
insert into constructora.empleados (nombre, email, telefono, puesto, activo, contratado_en)
select v.nombre, v.email, v.telefono, v.puesto, v.activo, v.contratado_en
from (values
  ('Miguel Angel Duarte', 'miguel.duarte@constructora.example',    '+52 55 1122 3344', 'ingeniero',      true,  '2024-05-02'::date),
  ('Fernanda Rios',       'fernanda.rios@constructora.example',    '+52 55 2233 4455', 'arquitecto',     true,  '2023-09-18'::date),
  ('Ricardo Pena',        'ricardo.pena@constructora.example',     '+52 55 3344 5566', 'plomero',        true,  '2025-01-13'::date),
  ('Guadalupe Sanchez',   'guadalupe.sanchez@constructora.example','+52 55 4455 6677', 'administrativo', false, '2022-11-07'::date)
) as v(nombre, email, telefono, puesto, activo, contratado_en)
where not exists (select 1 from constructora.empleados e where e.email = v.email);

-- PROVEEDORES --------------------------------------------------
insert into constructora.proveedores (nombre, contacto, telefono, email) values
  ('Interceramic',   'Ventas',    '+52 81 8300 4000', 'ventas@interceramic.example'),
  ('Minas del Valle','Mostrador', '+52 33 3810 2200', 'ventas@minasdelvalle.example'),
  ('Comex',          'Atención',  '+52 55 5200 9000', 'contacto@comex.example')
on conflict (nombre) do nothing;

-- MATERIALES ---------------------------------------------------
insert into constructora.materiales (nombre, unidad, precio_unitario, stock, proveedor)
select v.nombre, v.unidad, v.precio_unitario, v.stock, v.proveedor
from (values
  ('Grava 3/4',                'm3',     420.00,  60, 'Minas del Valle'),
  ('Yeso de construccion 40 kg','saco',  145.00, 180, 'Materiales del Norte'),
  ('Loseta ceramica 60x60',    'm2',     210.00,  95, 'Interceramic'),
  ('Impermeabilizante 19 L',   'unidad', 890.00,  40, 'Comex'),
  ('Alambre recocido',         'kg',      32.50, 220, 'Deacero')
) as v(nombre, unidad, precio_unitario, stock, proveedor)
where not exists (select 1 from constructora.materiales m where m.nombre = v.nombre);

-- ASIGNACIONES -------------------------------------------------
insert into constructora.asignaciones (proyecto_id, empleado_id, rol_en_obra, horas_semanales, desde)
select p.id, e.id, v.rol, v.horas, v.desde
from (values
  ('Privada San Jerónimo',   'Miguel Angel Duarte', 'Ingeniero de obra',       40, '2026-06-05'::date),
  ('Privada San Jerónimo',   'Ricardo Pena',        'Instalación hidráulica',  32, '2026-08-01'::date),
  ('Torre Mirador Norte',    'Fernanda Rios',       'Arquitecta de proyecto',  40, '2026-12-01'::date),
  ('Casa Patio Coyoacán',    'Guadalupe Sanchez',   'Control administrativo',  24, '2026-02-01'::date),
  ('Hacienda Los Encinos',   'Carlos Ramirez',      'Arquitecto residente',    36, '2026-12-15'::date),
  ('Residencial Alameda II', 'Luis Mendoza',        'Maestro de obra',         48, '2026-04-20'::date)
) as v(proyecto, empleado, rol, horas, desde)
join constructora.proyectos p on p.nombre = v.proyecto
join constructora.empleados e on e.nombre = v.empleado
where not exists (
  select 1 from constructora.asignaciones a
  where a.proyecto_id = p.id and a.empleado_id = e.id and a.desde = v.desde
);

-- PAGOS --------------------------------------------------------
insert into constructora.pagos (proyecto_id, monto, fecha, metodo, referencia, estado)
select p.id, v.monto, v.fecha, v.metodo, v.referencia, v.estado
from (values
  ('Privada San Jerónimo',   1200000.00, '2026-07-01'::date, 'transferencia', 'TRF-2010', 'pagado'),
  ('Privada San Jerónimo',    600000.00, '2026-10-15'::date, 'transferencia', 'TRF-2077', 'pagado'),
  ('Torre Mirador Norte',    2000000.00, '2026-12-05'::date, 'transferencia', 'TRF-2100', 'pendiente'),
  ('Casa Patio Coyoacán',     900000.00, '2026-02-10'::date, 'transferencia', 'TRF-1902', 'pagado'),
  ('Casa Patio Coyoacán',     450000.00, '2026-08-22'::date, 'cheque',        'CHQ-0155', 'pagado'),
  ('Residencial Alameda II', 1500000.00, '2026-05-05'::date, 'transferencia', 'TRF-1950', 'pagado'),
  ('Hacienda Los Encinos',    300000.00, '2026-11-28'::date, 'efectivo',      'REC-0102', 'pendiente')
) as v(proyecto, monto, fecha, metodo, referencia, estado)
join constructora.proyectos p on p.nombre = v.proyecto
where not exists (select 1 from constructora.pagos x where x.referencia = v.referencia);

-- CONSUMOS -----------------------------------------------------
insert into constructora.consumos (proyecto_id, material_id, cantidad, fecha, notas)
select p.id, m.id, v.cantidad, v.fecha, v.notas
from (values
  ('Privada San Jerónimo',   'Grava 3/4',                45.0,  '2026-07-10'::date, 'Plantilla de cimentación'),
  ('Privada San Jerónimo',   'Cemento gris 50 kg',       240.0, '2026-07-12'::date, 'Colado de zapatas'),
  ('Torre Mirador Norte',    'Varilla corrugada 3/8',    800.0, '2026-12-10'::date, 'Armado preliminar'),
  ('Casa Patio Coyoacán',    'Loseta ceramica 60x60',    120.0, '2026-10-05'::date, 'Pisos interiores'),
  ('Casa Patio Coyoacán',    'Impermeabilizante 19 L',    12.0, '2026-11-02'::date, 'Azotea'),
  ('Residencial Alameda II', 'Alambre recocido',          90.0, '2026-05-18'::date, 'Amarres de estructura'),
  ('Hacienda Los Encinos',   'Yeso de construccion 40 kg',60.0, '2026-11-25'::date, 'Muestras de acabado')
) as v(proyecto, material, cantidad, fecha, notas)
join constructora.proyectos p on p.nombre = v.proyecto
join constructora.materiales m on m.nombre = v.material
where not exists (
  select 1 from constructora.consumos c
  where c.proyecto_id = p.id and c.material_id = m.id and c.fecha = v.fecha
);

-- AVANCES ------------------------------------------------------
insert into constructora.avances (proyecto_id, empleado_id, fecha, porcentaje, descripcion)
select p.id, e.id, v.fecha, v.porcentaje, v.descripcion
from (values
  ('Privada San Jerónimo',   'Miguel Angel Duarte','2026-08-01'::date, 25::smallint, 'Cimentación terminada'),
  ('Privada San Jerónimo',   'Miguel Angel Duarte','2026-11-10'::date, 40::smallint, 'Muros de planta baja'),
  ('Torre Mirador Norte',    'Fernanda Rios',      '2026-12-01'::date,  5::smallint, 'Permisos en trámite'),
  ('Casa Patio Coyoacán',    'Guadalupe Sanchez',  '2026-10-20'::date, 78::smallint, 'Acabados y carpintería'),
  ('Residencial Alameda II', 'Luis Mendoza',       '2026-06-15'::date, 30::smallint, 'Estructura nivel 1'),
  ('Hacienda Los Encinos',   'Carlos Ramirez',     '2026-11-28'::date,  8::smallint, 'Trazo y excavación')
) as v(proyecto, empleado, fecha, porcentaje, descripcion)
join constructora.proyectos p on p.nombre = v.proyecto
left join constructora.empleados e on e.nombre = v.empleado
where not exists (
  select 1 from constructora.avances a
  where a.proyecto_id = p.id and a.fecha = v.fecha
);

-- NOMINA de los empleados nuevos (privada, sin UI) --------------
insert into constructora.nomina (empleado_id, salario, desde)
select e.id, v.salario, e.contratado_en
from (values
  ('miguel.duarte@constructora.example',     41000.00),
  ('fernanda.rios@constructora.example',     36000.00),
  ('ricardo.pena@constructora.example',      19500.00),
  ('guadalupe.sanchez@constructora.example', 23000.00)
) as v(email, salario)
join constructora.empleados e on e.email = v.email
where not exists (select 1 from constructora.nomina n where n.empleado_id = e.id);
