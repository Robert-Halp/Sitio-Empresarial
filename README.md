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

## Formulario web

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
└── supabase/
    ├── config.toml     # configuración del CLI
    └── migrations/     # migraciones SQL versionadas
```

## Seguridad

- El repo es **público**: nunca subas `.env`, claves ni contraseñas.
- `SUPABASE_SERVICE_ROLE_KEY` omite RLS → **solo en servidor**.
- Activa **RLS en todas las tablas** y escribe políticas explícitas.
- No expongas tablas nuevas automáticamente; da permisos a mano.
