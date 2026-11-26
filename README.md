# Sitio-Empresarial

Repositorio del sitio empresarial. Backend de datos sobre **Supabase** (Postgres + API REST automática + Auth).

## Requisitos

| Herramienta | Versión | Instalado |
|---|---|---|
| Git | 2.56+ | ✅ |
| Node.js (LTS) | 26.x | ✅ |
| Supabase CLI | 3.2+ | ✅ |
| Docker Desktop | — | ⬜ opcional, solo para desarrollo local |

## Configuración

1. Copia las variables de entorno:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Rellena `.env` con los datos de tu proyecto:
   `Settings > API` → Project URL + anon key.
   `Settings > Database` → contraseña y connection string.

3. Enlaza el proyecto remoto (una sola vez):

   ```powershell
   supabase login
   supabase link --project-ref <project-ref>
   ```

   El `project-ref` es el trozo de la URL: `https://<project-ref>.supabase.co`.

## Proyecto vinculado

| Dato | Valor |
|---|---|
| Nombre | Robert-Halp's Project |
| Ref | `qflopcnipzecycjopulg` |
| URL API | `https://qflopcnipzecycjopulg.supabase.co` |
| Región | East US (North Virginia) |
| Postgres | 17.12 |

> Sin Docker, los comandos de BD apuntan por defecto al stack local
> (`127.0.0.1:54322`) y fallan con `ECONNREFUSED`. Añade siempre `--remote`
> para trabajar contra el proyecto real: `supabase migration list --remote`.

## Comandos habituales

```powershell
# Ver estado del CLI y del proyecto enlazado
supabase status
supabase projects list

# Traer el esquema remoto como migraciones
supabase db pull

# Crear una migración nueva
supabase db diff -f nombre_de_la_migracion

# Aplicar migraciones al proyecto remoto
supabase db push

# Desarrollo local completo (requiere Docker)
supabase start
supabase stop
```

## Esquema de datos

### `public.contactos`

Mensajes del formulario de contacto.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `nombre` | text | 2–120 caracteres |
| `email` | text | validación mínima de `@` |
| `mensaje` | text | máx. 2000 caracteres |
| `creado_en` | timestamptz | `now()` |

**RLS activo** (probado contra la API real):

| Rol | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| `anon` | ✅ | ❌ `42501` | ❌ | ❌ |
| `authenticated` | ✅ | ✅ | ❌ | ❌ |
| `service_role` | ✅ | ✅ | ✅ | ✅ |
| sin clave | ❌ `401` | ❌ | ❌ | ❌ |

El formulario público solo puede **insertar**. Nadie anónimo puede leer los mensajes.

### Schema `constructora` — 10 tablas

> **Importante:** estas tablas viven en el schema **`constructora`**, no en `public`.
> Al consultar por la API hay que enviar la cabecera `Accept-Profile: constructora`
> (y `Content-Profile: constructora` al escribir).

```
clientes 1 ─── N proyectos
proyectos 1 ─── N asignaciones ─── N empleados
proyectos 1 ─── N pagos
proyectos 1 ─── N consumos ─── N materiales
proyectos 1 ─── N avances
empleados 1 ─── N nomina        (privada)
proveedores                     (catálogo de compras)
```

| Tabla | Para qué sirve | Columnas clave |
|---|---|---|
| `clientes` | Quién contrata la obra | nombre, email (único), teléfono, dirección |
| `proyectos` | Cada obra | cliente_id → clientes, nombre, estado, presupuesto, fechas |
| `empleados` | Plantilla | nombre, puesto, activo, contratado_en |
| `asignaciones` | Quién trabaja en qué obra | proyecto_id, empleado_id, rol_en_obra, horas_semanales, desde/hasta |
| `materiales` | Catálogo con inventario | nombre, unidad, precio_unitario, stock, proveedor |
| `proveedores` | Empresas que surten | nombre (único), contacto, teléfono, email, activo |
| `pagos` | Cobros y abonos por obra | proyecto_id, monto, fecha, método, referencia, estado |
| `consumos` | Material usado en cada obra | proyecto_id, material_id, cantidad, fecha, notas |
| `avances` | Reportes de avance | proyecto_id, empleado_id, fecha, porcentaje, descripción |
| `nomina` | Historial salarial (**privado**) | empleado_id, salario, desde, hasta |

**Reglas de integridad incluidas:**

- `proyectos.estado` limitado a: planificacion, permisos, cimentacion, estructura, acabados, entregado, cancelado
- `empleados.puesto` limitado a 8 puestos válidos
- `materiales.unidad` limitada a: unidad, kg, m, m2, m3, saco, litro, rollo
- `asignaciones` no permite duplicar el mismo empleado en el mismo proyecto y fecha
- `fecha_entrega >= fecha_inicio`, precios y stock no negativos
- Borrar un proyecto borra sus asignaciones (`on delete cascade`)
- No se puede borrar un cliente con proyectos (`on delete restrict`)

**Seguridad:** RLS activo en las 10 tablas. `nomina` solo la lee `service_role`. En **modo demo**
`anon` puede leer, insertar y actualizar las 9 tablas operativas (nunca borrar). Las políticas
`staff ...` conceden acceso completo a usuarios autenticados cuando se añada Auth.

**Schema expuesto:** `public`, `graphql_public` y `constructora` (`supabase/config.toml` → `[api] schemas`).

### Vistas y escritura del panel

El panel **lee** de 9 vistas que resuelven las relaciones y **escribe** en las tablas.
`nomina` no tiene vista ni permisos para `anon`: el salario queda privado.

| Vista | Contenido |
|---|---|
| `constructora.vista_clientes` | Cliente con contacto, dirección y notas |
| `constructora.vista_proyectos` | Proyecto + nombre del cliente |
| `constructora.vista_empleados` | Plantilla (sin salario) |
| `constructora.vista_asignaciones` | Empleado + proyecto + rol resueltos |
| `constructora.vista_materiales` | Catálogo con precio y stock |
| `constructora.vista_proveedores` | Proveedores con contacto |
| `constructora.vista_pagos` | Pago + nombre del proyecto |
| `constructora.vista_consumos` | Material + cantidad + costo calculado |
| `constructora.vista_avances` | Avance + proyecto + responsable |

**Modo demo:** `anon` tiene `SELECT`, `INSERT` y `UPDATE` sobre las 9 tablas operativas
(sin `DELETE`). Cualquiera con la URL puede crear o editar registros; antes de publicar de
verdad hay que sustituirlo por Supabase Auth. Se aplica en
`20261126210759_ampliar_constructora.sql`.

## Panel de operaciones (dashboard)

**Publicado (Vercel):** https://panel-constructora.vercel.app
**Espejo (GitHub Pages):** https://robert-halp.github.io/Sitio-Empresarial/

`docs/` contiene un dashboard estático (HTML + CSS + JS, sin build) que consume las 9 vistas
con `Accept-Profile: constructora`. Incluye KPIs, dona de estados, buscador, orden por columna,
exportación a CSV y **formularios de alta y edición** que escriben en la base de datos.

Cada sección muestra **columnas derivadas** (avance por obra, número de obras por cliente,
valor del inventario, materiales por proveedor) y un **panel de resumen** con métricas y
mini-gráficos de la sección; en pantallas anchas va al lado derecho y en laptops debajo de la tabla.

**Tiempo real:** las 9 tablas están publicadas en `supabase_realtime`; el panel se suscribe con
`@supabase/supabase-js` (CDN) y se refresca solo cuando cambia un registro, venga del propio
panel o del *Table Editor*. Si el CDN no carga, cae a sondeo cada 15 s.

El formulario de contacto enlaza al panel y el panel enlaza al formulario.

```powershell
# desplegar el panel a producción en Vercel
cd docs
vercel deploy --prod --yes --project panel-constructora
```

```
docs/
├── index.html   # estructura de la página
├── styles.css   # diseño y responsive
├── app.js       # consumo de la API y render
└── .nojekyll    # evita el procesado de Jekyll en GitHub Pages
```

Para verlo en local sirve cualquier servidor estático (`npx serve docs`); abrir el archivo
con `file://` también funciona pero algunos navegadores bloquean `fetch`.

## Formulario web

**Publicado:** https://web-marga4.vercel.app

`web/` contiene un formulario de contacto sin build ni dependencias: HTML + CSS + JS, usando `fetch` contra la API REST.

```
web/
├── index.html   # formulario y estilos
└── config.js    # SUPABASE_URL + anon key (claves publicas)
```

**Verlo en local** (cualquier servidor estático sirve):

```powershell
cd web
npx serve .          # o abre index.html directamente en el navegador
```

**Flujo:** el formulario hace `POST /rest/v1/contactos` → RLS permite el insert anónimo → la fila aparece en Supabase → *Table Editor* → `contactos`.

**Seguridad:** la anon key es pública por diseño y RLS impide leer los mensajes. Pero el insert es abierto, así que conviene añadir captcha o rate limiting antes de publicar el sitio.

## Estructura

```
.
├── .env.example        # plantilla de variables (sí se sube)
├── .env                # valores reales (NO se sube)
├── .gitignore
├── README.md
├── docs/               # dashboard publicado en GitHub Pages
│   ├── index.html
│   └── .nojekyll
├── web/                # formulario de contacto (Vercel)
└── supabase/
    ├── config.toml     # configuración del CLI
    └── migrations/     # migraciones SQL versionadas
```

## Seguridad

- El repo es **público**: nunca subas `.env`, claves ni contraseñas.
- `SUPABASE_SERVICE_ROLE_KEY` omite RLS → **solo en servidor**.
- Activa **RLS en todas las tablas** y escribe políticas explícitas.
- No expongas tablas nuevas automáticamente; da permisos a mano.
- **Modo demo:** el panel permite a `anon` insertar y actualizar en las 9 tablas operativas
  para poder demostrar el CRUD. Eso significa que cualquiera con la URL puede modificar datos.
  No hay `DELETE` para `anon`. Para un entorno real: activar Supabase Auth, cambiar las políticas
  a `to authenticated` y retirar los permisos de escritura a `anon`.
- `nomina` (salarios) está fuera del panel: solo `service_role` tiene acceso.
