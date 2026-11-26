/* =========================================================
   Constructora · Panel de operaciones
   Lee de vistas y escribe en tablas (schema constructora).
   Actualización en vivo con Supabase Realtime.
   ========================================================= */

const CFG = {
  url: "https://qflopcnipzecycjopulg.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG9wY25pcHplY3ljam9wdWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NDY5OTIsImV4cCI6MjExMDUyMjk5Mn0.daZChfRPz-YS3ZfTR_VV9nQoFFq_CVFotL424Zp5shs",
  schema: "constructora"
};

/* ---------------- iconos ---------------- */
const ICO = {
  resumen: `<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>`,
  clientes: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  proyectos: `<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>`,
  empleados: `<rect x="3" y="4" width="18" height="17" rx="2.2"/><circle cx="9" cy="10" r="2.3"/><path d="M6 17.2c0-2 1.5-3.2 3-3.2s3 1.2 3 3.2"/><path d="M15 9.5h3M15 13.5h3"/>`,
  asignaciones: `<path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>`,
  materiales: `<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>`,
  proveedores: `<path d="M1 3h13v13H1z"/><path d="M14 8h4l4 4v4h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>`,
  pagos: `<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h4"/>`,
  consumos: `<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>`,
  avances: `<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>`,
  dinero: `<rect x="2.5" y="6" width="19" height="12.5" rx="2.5"/><path d="M2.5 10.5h19"/><circle cx="17" cy="14.8" r="1.1"/>`,
  alerta: `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>`,
  buscar: `<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>`,
  bajar: `<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>`,
  mas: `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  editar: `<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="m14.5 5.5 4 4"/>`
};
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

/* ---------------- secciones ---------------- */
const TABLAS = {
  clientes:     { vista: "vista_clientes",     icono: "clientes",     titulo: "Clientes",     sub: "Personas y empresas que contratan una obra.", seccion: "Catálogos" },
  proyectos:    { vista: "vista_proyectos",    icono: "proyectos",    titulo: "Proyectos",    sub: "Obras en curso, presupuesto y fechas de entrega.", seccion: "Operación" },
  empleados:    { vista: "vista_empleados",    icono: "empleados",    titulo: "Empleados",    sub: "Plantilla de la constructora.", seccion: "Catálogos" },
  asignaciones: { vista: "vista_asignaciones", icono: "asignaciones", titulo: "Asignaciones", sub: "Quién trabaja en cada obra y con qué rol.", seccion: "Operación" },
  materiales:   { vista: "vista_materiales",   icono: "materiales",   titulo: "Materiales",   sub: "Catálogo con precios y existencias.", seccion: "Catálogos" },
  proveedores:  { vista: "vista_proveedores",  icono: "proveedores",  titulo: "Proveedores",  sub: "Empresas que surten materiales.", seccion: "Compras" },
  pagos:        { vista: "vista_pagos",        icono: "pagos",        titulo: "Pagos",        sub: "Cobros y abonos recibidos por proyecto.", seccion: "Finanzas" },
  consumos:     { vista: "vista_consumos",     icono: "consumos",     titulo: "Consumos",     sub: "Materiales usados en cada obra y su costo.", seccion: "Operación" },
  avances:      { vista: "vista_avances",      icono: "avances",      titulo: "Avances",      sub: "Reportes de avance con porcentaje de obra.", seccion: "Operación" }
};

const RESUMEN = {
  titulo: "Resumen",
  sub: "Vista rápida de la operación: cartera, entregas y materiales.",
  seccion: "General"
};

/* ---------------- columnas de cada tabla ---------------- */
const COLS = {
  clientes: [
    { k: "nombre",    t: "Cliente",  tipo: "persona" },
    { k: "email",     t: "Email" },
    { k: "telefono",  t: "Teléfono" },
    { k: "direccion", t: "Dirección" },
    { k: "obras",     t: "Obras",    tipo: "calc", calc: (f) => obrasDeCliente(f.nombre), num: true, formato: "num" },
    { k: "creado_en", t: "Alta",     tipo: "fecha" }
  ],
  proyectos: [
    { k: "nombre",        t: "Proyecto",    tipo: "principal" },
    { k: "cliente",       t: "Cliente" },
    { k: "estado",        t: "Estado",      tipo: "estado" },
    { k: "avance",        t: "Avance",      tipo: "calc", calc: (f) => avanceDeProyecto(f.nombre), render: "pct", num: true },
    { k: "presupuesto",   t: "Presupuesto", tipo: "dinero", dec: 0, num: true },
    { k: "fecha_inicio",  t: "Inicio",      tipo: "fecha" },
    { k: "fecha_entrega", t: "Entrega",     tipo: "fecha" }
  ],
  empleados: [
    { k: "nombre",        t: "Empleado",   tipo: "persona" },
    { k: "puesto",        t: "Puesto",     tipo: "puesto" },
    { k: "telefono",      t: "Teléfono" },
    { k: "obras",         t: "Obras",      tipo: "calc", calc: (f) => obrasDeEmpleado(f.nombre), num: true, formato: "num" },
    { k: "activo",        t: "Activo",     tipo: "bool" },
    { k: "contratado_en", t: "Contratado", tipo: "fecha" }
  ],
  asignaciones: [
    { k: "empleado",        t: "Empleado",   tipo: "persona" },
    { k: "puesto",          t: "Puesto",     tipo: "puesto" },
    { k: "proyecto",        t: "Proyecto" },
    { k: "rol_en_obra",     t: "Rol en obra" },
    { k: "horas_semanales", t: "Horas/sem",  num: true },
    { k: "desde",           t: "Desde",      tipo: "fecha" }
  ],
  materiales: [
    { k: "nombre",          t: "Material",    tipo: "principal" },
    { k: "unidad",          t: "Unidad" },
    { k: "precio_unitario", t: "Precio unit.", tipo: "dinero", dec: 2, num: true },
    { k: "stock",           t: "Stock",       tipo: "stock", num: true },
    { k: "valor",           t: "Valor",       tipo: "calc", calc: valorInventario, num: true, formato: "dinero" },
    { k: "proveedor",       t: "Proveedor" }
  ],
  proveedores: [
    { k: "nombre",     t: "Proveedor", tipo: "principal" },
    { k: "contacto",   t: "Contacto" },
    { k: "telefono",   t: "Teléfono" },
    { k: "email",      t: "Email" },
    { k: "materiales", t: "Materiales", tipo: "calc", calc: (f) => materialesDeProveedor(f.nombre), num: true, formato: "num" },
    { k: "activo",     t: "Activo",    tipo: "bool" }
  ],
  pagos: [
    { k: "fecha",      t: "Fecha",     tipo: "fecha" },
    { k: "proyecto",   t: "Proyecto" },
    { k: "monto",      t: "Monto",     tipo: "dinero", dec: 2, num: true },
    { k: "metodo",     t: "Método",    tipo: "puesto" },
    { k: "referencia", t: "Referencia" },
    { k: "estado",     t: "Estado",    tipo: "estado" }
  ],
  consumos: [
    { k: "fecha",    t: "Fecha",    tipo: "fecha" },
    { k: "proyecto", t: "Proyecto" },
    { k: "material", t: "Material" },
    { k: "cantidad", t: "Cantidad", num: true },
    { k: "costo",    t: "Costo",    tipo: "dinero", dec: 2, num: true }
  ],
  avances: [
    { k: "fecha",       t: "Fecha",       tipo: "fecha" },
    { k: "proyecto",    t: "Proyecto" },
    { k: "porcentaje",  t: "Avance",      tipo: "porcentaje" },
    { k: "empleado",    t: "Responsable" },
    { k: "descripcion", t: "Descripción" }
  ]
};

const ORDEN_INICIAL = {
  clientes:     { k: "nombre",      dir: 1 },
  proyectos:    { k: "presupuesto", dir: -1 },
  empleados:    { k: "nombre",      dir: 1 },
  asignaciones: { k: "empleado",    dir: 1 },
  materiales:   { k: "stock",       dir: -1 },
  proveedores:  { k: "nombre",      dir: 1 },
  pagos:        { k: "fecha",       dir: -1 },
  consumos:     { k: "fecha",       dir: -1 },
  avances:      { k: "fecha",       dir: -1 }
};

/* ---------------- catálogos de valores ---------------- */
const ESTADOS = ["planificacion", "permisos", "cimentacion", "estructura", "acabados", "entregado", "cancelado"];
const PUESTOS = ["arquitecto", "ingeniero", "maestro_obra", "albanil", "electricista", "plomero", "pintor", "administrativo"];
const UNIDADES = ["unidad", "kg", "m", "m2", "m3", "saco", "litro", "rollo"];
const METODOS = ["transferencia", "efectivo", "cheque", "tarjeta"];
const ESTADOS_PAGO = ["pendiente", "pagado", "cancelado"];

const COLOR_ESTADO = {
  planificacion: "#6366f1", permisos: "#8b5cf6", cimentacion: "#f59e0b",
  estructura: "#f97316", acabados: "#14b8a6", entregado: "#22c55e", cancelado: "#ef4444"
};

/* ---------------- formularios (alta y edición) ---------------- */
const hoy = () => new Date().toISOString().slice(0, 10);

const FORMULARIOS = {
  clientes: {
    tabla: "clientes", singular: "cliente",
    campos: [
      { k: "nombre",    t: "Nombre",    req: true, max: 120 },
      { k: "email",     t: "Email",     tipo: "email" },
      { k: "telefono",  t: "Teléfono",  tipo: "tel" },
      { k: "direccion", t: "Dirección" },
      { k: "notas",     t: "Notas",     tipo: "textarea" }
    ]
  },
  proyectos: {
    tabla: "proyectos", singular: "proyecto",
    campos: [
      { k: "cliente_id",    t: "Cliente",  tipo: "select", req: true, fuente: "clientes" },
      { k: "nombre",        t: "Nombre del proyecto", req: true, max: 160 },
      { k: "direccion",     t: "Dirección de la obra" },
      { k: "estado",        t: "Estado",   tipo: "select", req: true, opciones: ESTADOS, defecto: "planificacion" },
      { k: "presupuesto",   t: "Presupuesto (MXN)", tipo: "number", step: "0.01", min: 0 },
      { k: "fecha_inicio",  t: "Fecha de inicio",  tipo: "date" },
      { k: "fecha_entrega", t: "Fecha de entrega", tipo: "date" }
    ]
  },
  empleados: {
    tabla: "empleados", singular: "empleado",
    campos: [
      { k: "nombre",        t: "Nombre",  req: true, max: 120 },
      { k: "email",         t: "Email",   tipo: "email" },
      { k: "telefono",      t: "Teléfono", tipo: "tel" },
      { k: "puesto",        t: "Puesto",  tipo: "select", req: true, opciones: PUESTOS },
      { k: "contratado_en", t: "Fecha de contratación", tipo: "date", req: true, defecto: hoy },
      { k: "activo",        t: "Activo",  tipo: "checkbox", defecto: true }
    ]
  },
  asignaciones: {
    tabla: "asignaciones", singular: "asignación",
    campos: [
      { k: "proyecto_id",     t: "Proyecto", tipo: "select", req: true, fuente: "proyectos" },
      { k: "empleado_id",     t: "Empleado", tipo: "select", req: true, fuente: "empleados" },
      { k: "rol_en_obra",     t: "Rol en obra" },
      { k: "horas_semanales", t: "Horas por semana", tipo: "number", min: 1, maxv: 60 },
      { k: "desde",           t: "Desde", tipo: "date", req: true, defecto: hoy },
      { k: "hasta",           t: "Hasta", tipo: "date" }
    ]
  },
  materiales: {
    tabla: "materiales", singular: "material",
    campos: [
      { k: "nombre",          t: "Nombre", tipo: "principal", req: true, max: 120 },
      { k: "unidad",          t: "Unidad", tipo: "select", req: true, opciones: UNIDADES },
      { k: "precio_unitario", t: "Precio unitario (MXN)", tipo: "number", step: "0.01", min: 0, req: true },
      { k: "stock",           t: "Stock",  tipo: "number", step: "0.01", min: 0, defecto: 0 },
      { k: "proveedor",       t: "Proveedor" }
    ]
  },
  proveedores: {
    tabla: "proveedores", singular: "proveedor",
    campos: [
      { k: "nombre",   t: "Nombre", req: true, max: 120 },
      { k: "contacto", t: "Persona de contacto" },
      { k: "telefono", t: "Teléfono", tipo: "tel" },
      { k: "email",    t: "Email", tipo: "email" },
      { k: "activo",   t: "Activo", tipo: "checkbox", defecto: true }
    ]
  },
  pagos: {
    tabla: "pagos", singular: "pago",
    campos: [
      { k: "proyecto_id", t: "Proyecto", tipo: "select", req: true, fuente: "proyectos" },
      { k: "monto",       t: "Monto (MXN)", tipo: "number", step: "0.01", min: 0.01, req: true },
      { k: "fecha",       t: "Fecha", tipo: "date", req: true, defecto: hoy },
      { k: "metodo",      t: "Método", tipo: "select", req: true, opciones: METODOS, defecto: "transferencia" },
      { k: "referencia",  t: "Referencia" },
      { k: "estado",      t: "Estado", tipo: "select", req: true, opciones: ESTADOS_PAGO, defecto: "pagado" }
    ]
  },
  consumos: {
    tabla: "consumos", singular: "consumo",
    campos: [
      { k: "proyecto_id", t: "Proyecto", tipo: "select", req: true, fuente: "proyectos" },
      { k: "material_id", t: "Material", tipo: "select", req: true, fuente: "materiales" },
      { k: "cantidad",    t: "Cantidad", tipo: "number", step: "0.001", min: 0.001, req: true },
      { k: "fecha",       t: "Fecha", tipo: "date", req: true, defecto: hoy },
      { k: "notas",       t: "Notas", tipo: "textarea" }
    ]
  },
  avances: {
    tabla: "avances", singular: "avance",
    campos: [
      { k: "proyecto_id", t: "Proyecto", tipo: "select", req: true, fuente: "proyectos" },
      { k: "empleado_id", t: "Responsable", tipo: "select", fuente: "empleados" },
      { k: "fecha",       t: "Fecha", tipo: "date", req: true, defecto: hoy },
      { k: "porcentaje",  t: "Avance (%)", tipo: "number", min: 0, maxv: 100, req: true, defecto: 0 },
      { k: "descripcion", t: "Descripción", tipo: "textarea" }
    ]
  }
};

/* ---------------- estado ---------------- */
const datos = {};
const filtros = {};
Object.keys(TABLAS).forEach((k) => (filtros[k] = ""));
const orden = JSON.parse(JSON.stringify(ORDEN_INICIAL));

let pestaña = "resumen";
let cargando = true;
let refrescando = false;
let error = null;
let actualizado = null;
let realtimeActivo = false;
let formActual = null;          // { nombre, fila }
let ultimaAccionPropia = 0;
let timerRefresco = null;
let toastPendiente = false;
let animarEntrada = true;
let navLista = false;

/* ---------------- utilidades ---------------- */
const $ = (s) => document.querySelector(s);

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function dinero(v, dec = 0) {
  if (v === null || v === undefined) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: dec, maximumFractionDigits: dec
  }).format(Number(v));
}
function numero(v) {
  return v === null || v === undefined ? "—" : new Intl.NumberFormat("es-MX").format(Number(v));
}
function fecha(v) {
  if (!v) return "—";
  const d = new Date(String(v).slice(0, 10) + "T00:00:00");
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}
function humano(v) {
  if (!v) return "—";
  const s = String(v).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function iniciales(nombre) {
  const p = String(nombre || "").trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}
function diasHasta(f) {
  if (!f) return null;
  const h = new Date(); h.setHours(0, 0, 0, 0);
  const d = new Date(String(f).slice(0, 10) + "T00:00:00");
  return Math.round((d - h) / 86400000);
}
const variante = (s) => "a" + ((String(s).length % 4) + 1);

/* ---------------- datos derivados ---------------- */
function obrasDeCliente(nombre) {
  return (datos.proyectos || []).filter((p) => p.cliente === nombre).length;
}
function avanceDeProyecto(nombre) {
  const arr = (datos.avances || []).filter((a) => a.proyecto === nombre);
  if (!arr.length) return null;
  return arr.reduce((max, a) => (String(a.fecha) > String(max.fecha) ? a : max), arr[0]).porcentaje;
}
function cobradoDeProyecto(nombre) {
  return (datos.pagos || [])
    .filter((p) => p.proyecto === nombre && p.estado === "pagado")
    .reduce((s, p) => s + Number(p.monto || 0), 0);
}
function obrasDeEmpleado(nombre) {
  return (datos.asignaciones || []).filter((a) => a.empleado === nombre).length;
}
function valorInventario(fila) {
  return Number(fila.stock || 0) * Number(fila.precio_unitario || 0);
}
function materialesDeProveedor(nombre) {
  return (datos.materiales || []).filter(
    (m) => String(m.proveedor || "").toLowerCase() === String(nombre).toLowerCase()
  ).length;
}
function valorDe(fila, col) {
  if (!col) return undefined;
  return col.calc ? col.calc(fila) : fila[col.k];
}
const pctHTML = (v) => `<span class="pct"><span class="pct-track"><i style="width:${Number(v)}%"></i></span><b>${Number(v)}%</b></span>`;

/* ---------------- API ---------------- */
function cabeceras(extra = {}) {
  return {
    apikey: CFG.key,
    Authorization: `Bearer ${CFG.key}`,
    "Accept-Profile": CFG.schema,
    "Content-Profile": CFG.schema,
    ...extra
  };
}

async function pedirVista(vista) {
  const res = await fetch(`${CFG.url}/rest/v1/${vista}?select=*`, { headers: cabeceras() });
  if (!res.ok) {
    const detalle = (await res.text()).slice(0, 180);
    throw new Error(`${vista}: HTTP ${res.status} · ${detalle}`);
  }
  return res.json();
}

async function mensajeError(res) {
  try {
    const j = await res.json();
    return [j.message, j.details, j.hint].filter(Boolean).join(" · ") || `HTTP ${res.status}`;
  } catch (_) {
    return `HTTP ${res.status}`;
  }
}

async function insertar(tabla, payload) {
  const res = await fetch(`${CFG.url}/rest/v1/${tabla}`, {
    method: "POST",
    headers: cabeceras({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await mensajeError(res));
}

async function actualizar(tabla, id, payload) {
  const res = await fetch(`${CFG.url}/rest/v1/${tabla}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: cabeceras({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await mensajeError(res));
}

/* ---------------- carga ---------------- */
async function cargarTodo(esRefresco = false) {
  if (esRefresco) {
    refrescando = true;
    bloquearBoton(true);
  } else {
    cargando = true;
    error = null;
    pintar();
  }

  try {
    const nombres = Object.keys(TABLAS);
    const resultados = await Promise.all(nombres.map((n) => pedirVista(TABLAS[n].vista)));
    nombres.forEach((n, i) => { datos[n] = resultados[i]; });
    error = null;
    actualizado = new Date();
  } catch (e) {
    error = e.message || String(e);
  }

  cargando = false;
  refrescando = false;
  animarEntrada = !esRefresco;
  pintar();
  animarEntrada = false;
}

function bloquearBoton(activo) {
  const btn = $("#refrescar");
  if (!btn) return;
  btn.disabled = activo;
  btn.querySelector("svg").classList.toggle("spin", activo);
}

/* ---------------- pintado ---------------- */
function pintar() {
  const activo = document.activeElement;
  const eraBusqueda = activo && activo.id === "q";
  const cursor = eraBusqueda ? activo.selectionStart : 0;

  pintarNav();
  pintarCabecera();
  pintarLive();
  pintarAviso();

  if (cargando) {
    $("#vista").innerHTML = esqueleto();
    return;
  }
  if (error && !datos.clientes) { $("#vista").innerHTML = ""; return; }

  if (pestaña === "resumen") pintarResumen();
  else pintarTabla(pestaña);

  if (animarEntrada) animarContadores();
  bloquearBoton(refrescando);

  if (eraBusqueda) {
    const q = $("#q");
    if (q) { q.focus(); try { q.setSelectionRange(cursor, cursor); } catch (_) {} }
  }
}

function pintarNav() {
  if (!navLista) {
    const items = [["resumen", "Resumen", "resumen"], ...Object.entries(TABLAS).map(([k, v]) => [k, v.titulo, v.icono])];
    $("#nav").innerHTML = items.map(([k, t, ico]) => `
      <button class="nav-item" data-tab="${k}" aria-current="false">
        ${svg(ICO[ico])}
        <span>${t}</span>
        ${k === "resumen" ? "" : `<span class="count">—</span>`}
      </button>`).join("");
    navLista = true;
  }

  document.querySelectorAll(".nav-item").forEach((btn) => {
    const k = btn.dataset.tab;
    btn.setAttribute("aria-current", k === pestaña ? "page" : "false");
    if (k !== "resumen") {
      const c = btn.querySelector(".count");
      if (c) c.textContent = datos[k] ? datos[k].length : "—";
    }
  });
}

function pintarCabecera() {
  const info = pestaña === "resumen" ? RESUMEN : TABLAS[pestaña];
  $("#eyebrow").textContent = info.seccion;
  $("#page-title").textContent = info.titulo;
  $("#page-sub").textContent = info.sub;
  $("#updated").textContent = actualizado
    ? "Actualizado " + actualizado.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    : "";
}

function pintarLive() {
  const dot = $("#live .dot");
  const txt = $("#live-txt");
  if (!dot) return;
  dot.className = "dot " + (error ? "err" : cargando ? "load" : "");
  txt.textContent = error
    ? "Sin conexión"
    : cargando
      ? "Conectando…"
      : realtimeActivo ? "En vivo · tiempo real" : "En vivo · Supabase";
  $("#live").title = realtimeActivo
    ? "Los cambios se sincronizan automáticamente"
    : "Actualización manual disponible";
}

function pintarAviso() {
  $("#aviso").innerHTML = error
    ? `<div class="error"><strong>No se pudieron cargar los datos</strong><code>${esc(error)}</code></div>`
    : "";
}

/* ---------------- resumen ---------------- */
function pintarResumen() {
  const p = datos.proyectos || [];
  const enObra = p.filter((x) => !["entregado", "cancelado"].includes(x.estado));
  const cartera = enObra.reduce((s, x) => s + (Number(x.presupuesto) || 0), 0);
  const bajo = (datos.materiales || []).filter((m) => Number(m.stock) < 120);

  const conteo = {};
  ESTADOS.forEach((e) => (conteo[e] = 0));
  p.forEach((x) => { if (conteo[x.estado] !== undefined) conteo[x.estado]++; });

  const seguimiento = [...p]
    .filter((x) => x.fecha_entrega && !["entregado", "cancelado"].includes(x.estado))
    .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
    .slice(0, 3);

  const topProy = [...p].sort((a, b) => Number(b.presupuesto) - Number(a.presupuesto)).slice(0, 4);
  const maxPro = Math.max(1, ...topProy.map((x) => Number(x.presupuesto) || 0));

  const pagos = datos.pagos || [];
  const cobrado = pagos.filter((x) => x.estado === "pagado").reduce((s, x) => s + Number(x.monto || 0), 0);
  const pendiente = pagos.filter((x) => x.estado === "pendiente").reduce((s, x) => s + Number(x.monto || 0), 0);

  $("#vista").innerHTML = `
    ${heroResumen(enObra, cobrado, bajo)}

    <section class="kpis">
      ${kpi("clientes", "Clientes", (datos.clientes || []).length, "registrados en el sistema", "blue")}
      ${kpi("proyectos", "Proyectos en obra", enObra.length, `de ${p.length} en total`, "green")}
      ${kpi("dinero", "Cartera en obra", cartera, "presupuesto de obras activas", "", false, "money")}
      ${kpi("alerta", "Materiales por reponer", bajo.length, "stock menor a 120", bajo.length ? "red" : "", bajo.length > 0)}
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="card-head"><h3>Proyectos por estado</h3><span class="meta">${p.length} en total</span></div>
        <div class="donut-wrap">
          <div class="donut ${animarEntrada ? "anim" : ""}">
            <svg viewBox="0 0 168 168" role="img" aria-label="Proyectos por estado">
              ${dona(conteo, p.length)}
            </svg>
            <div class="donut-center"><strong>${p.length}</strong><span>obras</span></div>
          </div>
          <div class="legend">
            ${ESTADOS.map((e) => `
              <div class="legend-row ${conteo[e] ? "" : "zero"}">
                <i style="background:${COLOR_ESTADO[e]}"></i>${humano(e)}<span class="n">${conteo[e]}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Próximas entregas</h3><span class="meta">orden cronológico</span></div>
        ${seguimiento.map((x) => entregaItem(x)).join("") || `<p class="muted" style="font-size:13px">No hay entregas programadas.</p>`}
      </div>
    </section>

    <section class="grid-2 equal">
      <div class="card">
        <div class="card-head"><h3>Mayor presupuesto</h3><span class="meta">top ${topProy.length}</span></div>
        ${topProy.map((x) => `
          <div class="hbar">
            <div class="hbar-top"><b>${esc(x.nombre)}</b><span>${dinero(x.presupuesto)}</span></div>
            <div class="track"><div class="fill" style="width:${((Number(x.presupuesto) || 0) / maxPro) * 100}%"></div></div>
          </div>`).join("") || `<p class="muted" style="font-size:13px">Sin proyectos.</p>`}
      </div>

      <div class="card">
        <div class="card-head"><h3>Cobrado vs pendiente</h3><span class="meta">${pagos.length} pagos</span></div>
        <div class="money-row">
          <div><span class="money-lbl">Cobrado</span><strong class="money ok">${dinero(cobrado)}</strong></div>
          <div><span class="money-lbl">Pendiente</span><strong class="money warn">${dinero(pendiente)}</strong></div>
        </div>
        <div class="track" style="height:10px;margin-top:6px">
          <div class="fill" style="width:${cobrado + pendiente ? (cobrado / (cobrado + pendiente)) * 100 : 0}%;background:linear-gradient(90deg,#34d399,#059669)"></div>
        </div>
        <div class="card-head" style="margin:18px 0 10px"><h3 style="font-size:12.5px">Inventario bajo</h3><span class="meta">${bajo.length}</span></div>
        ${bajo.sort((a, b) => Number(a.stock) - Number(b.stock)).slice(0, 3).map((m) => `
          <div class="stock-row">
            <div class="nm">${esc(m.nombre)}<small>${esc(m.proveedor || "sin proveedor")}</small></div>
            <div class="track"><div class="fill" style="width:${Math.min(100, (Number(m.stock) / 120) * 100)}%;background:linear-gradient(90deg,#fca5a5,#ef4444)"></div></div>
            <div class="qty low">${numero(m.stock)}</div>
          </div>`).join("") || `<p class="muted" style="font-size:13px">Todo el inventario está por encima del mínimo.</p>`}
      </div>
    </section>`;
}

function kpi(icono, etiqueta, valor, pista, color = "", warn = false, formato = "num") {
  const esNum = typeof valor === "number";
  const animable = esNum && animarEntrada;
  const texto = esNum ? (formato === "money" ? dinero(valor) : numero(valor)) : valor;
  return `
    <article class="kpi ${warn ? "warn" : ""}">
      <div class="kpi-top">
        <span class="chip ${color}">${svg(ICO[icono])}</span>
        <span class="lbl">${esc(etiqueta)}</span>
      </div>
      <div class="val" ${animable ? `data-count="${valor}" data-formato="${formato}"` : ""}>${texto}</div>
      <div class="hint">${esc(pista)}</div>
    </article>`;
}

function heroResumen(enObra, cobrado, bajo) {
  const fecha = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  const materiales = `${bajo.length} material${bajo.length === 1 ? "" : "es"} por reponer`;
  return `
    <section class="hero">
      <div class="hero-txt">
        <span class="hero-badge"><span class="dot-mini"></span> Operación al día · ${esc(fecha)}</span>
        <h2>Tu obra, bajo control.</h2>
        <p><strong>${enObra.length} obras activas</strong> · <strong>${dinero(cobrado)}</strong> cobrados · ${materiales}.</p>
        <div class="hero-actions">
          <button class="btn primary" type="button" data-quick="proyectos">${svg(ICO.mas)}<span>Nuevo proyecto</span></button>
          <button class="btn hero-ghost" type="button" data-quick="pagos">${svg(ICO.dinero)}<span>Registrar pago</span></button>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">${artObra()}</div>
    </section>`;
}

function artObra() {
  return `
    <svg viewBox="0 0 260 180" fill="none">
      <g class="flotante">
        <path d="M12 158h236" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-linecap="round"/>
        <g stroke="rgba(255,255,255,.42)" stroke-width="2">
          <rect x="96" y="94" width="74" height="64" rx="3"/>
          <path d="M96 114h74M96 134h74M120 94v64M146 94v64"/>
        </g>
        <g stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round">
          <path d="M58 158V44"/>
          <path d="M42 58h152"/>
          <path d="M58 44 42 58M58 44l16 14"/>
          <path d="M170 58v28"/>
          <path d="M58 58v20"/>
        </g>
        <rect x="158" y="86" width="24" height="17" rx="3" stroke="#fde68a" stroke-width="2"/>
        <g stroke="rgba(253,230,138,.7)" stroke-width="2">
          <rect x="186" y="140" width="34" height="18" rx="3"/>
          <rect x="190" y="122" width="26" height="18" rx="3"/>
        </g>
      </g>
    </svg>`;
}

function animarContadores() {
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-count]").forEach((el) => {
    const fin = Number(el.dataset.count) || 0;
    const money = el.dataset.formato === "money";
    const pintarNum = (v) => { el.textContent = money ? dinero(v) : numero(v); };
    if (reducido) { pintarNum(fin); return; }

    const t0 = performance.now();
    const dur = 850;
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      pintarNum(Math.round(fin * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}

function esqueleto() {
  return `
    <div class="sk sk-hero"></div>
    <section class="kpis">${'<div class="sk sk-kpi"></div>'.repeat(4)}</section>
    <div class="grid-2"><div class="sk sk-card"></div><div class="sk sk-card"></div></div>
    <div class="sk sk-panel"></div>`;
}

function dona(conteo, total) {
  const R = 62, C = 2 * Math.PI * R;
  if (!total) return `<circle cx="84" cy="84" r="${R}" fill="none" stroke="#f1efec" stroke-width="17"/>`;
  let offset = 0;
  return `<circle cx="84" cy="84" r="${R}" fill="none" stroke="#f4f2ef" stroke-width="17"/>` +
    ESTADOS.filter((e) => conteo[e] > 0).map((e) => {
      const largo = (conteo[e] / total) * C;
      const hueco = 2.5;
      const visible = Math.max(largo - hueco, 1);
      const s = `<circle class="seg" cx="84" cy="84" r="${R}" fill="none" stroke="${COLOR_ESTADO[e]}" stroke-width="17"
        stroke-dasharray="${visible} ${C - visible}" stroke-dashoffset="${-offset}"/>`;
      offset += largo;
      return s;
    }).join("");
}

function entregaItem(x) {
  const d = new Date(String(x.fecha_entrega).slice(0, 10) + "T00:00:00");
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "");
  const dias = diasHasta(x.fecha_entrega);
  let pill = `<span class="pill ok">en ${dias} d</span>`;
  if (dias < 0) pill = `<span class="pill late">vencido</span>`;
  else if (dias === 0) pill = `<span class="pill soon">hoy</span>`;
  else if (dias <= 30) pill = `<span class="pill soon">en ${dias} d</span>`;
  return `
    <div class="delivery">
      <div class="datebox"><b>${dia}</b><span>${esc(mes)}</span></div>
      <div class="who"><b>${esc(x.nombre)}</b><span>${esc(x.cliente)}</span></div>
      <div class="when">${pill}</div>
    </div>`;
}

/* ---------------- panel lateral de resumen ---------------- */
function dineroCorto(v) {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1e3) return "$" + Math.round(n / 1e3) + "k";
  return dinero(n);
}
const hayDatos = `<p class="muted" style="font-size:12px">Sin datos todavía.</p>`;
const insCard = (titulo, cuerpo) => `<div class="insight-card"><h3>${esc(titulo)}</h3>${cuerpo}</div>`;
const statGrid = (items) => `<div class="stat-grid">${items.join("")}</div>`;
const stat = (lbl, val, cls = "") => `<div class="stat ${cls}"><span>${esc(lbl)}</span><b>${val}</b></div>`;

function grupoSuma(arr, clave, valor) {
  const m = new Map();
  arr.forEach((x) => {
    const k = clave(x);
    if (k === null || k === undefined || k === "") return;
    m.set(k, (m.get(k) || 0) + Number(valor(x) || 0));
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function insBars(items, max, formato = (v) => numero(v), clase = "") {
  if (!items.length) return hayDatos;
  return items.map(([nombre, valor]) => `
    <div class="ins-bar">
      <div class="ins-bar-top"><span>${esc(nombre)}</span><b>${formato(valor)}</b></div>
      <div class="track"><div class="fill ${clase}" style="width:${max ? Math.max(4, (valor / max) * 100) : 0}%"></div></div>
    </div>`).join("");
}

function insightsHTML(nombre) {
  const d = datos;
  let cuerpo = "";

  if (nombre === "clientes") {
    const proy = d.proyectos || [];
    const cartera = proy.reduce((s, p) => s + (Number(p.presupuesto) || 0), 0);
    const conObra = new Set(proy.map((p) => p.cliente)).size;
    const total = (d.clientes || []).length;
    const top = grupoSuma(proy, (p) => p.cliente, (p) => p.presupuesto).slice(0, 4);
    cuerpo = insCard("Resumen", statGrid([
      stat("Total", numero(total)),
      stat("Con obra", numero(conObra), "ok"),
      stat("Sin obra", numero(Math.max(0, total - conObra))),
      stat("Cartera", dineroCorto(cartera))
    ])) + insCard("Cartera por cliente", insBars(top, top[0]?.[1] || 1, (v) => dinero(v)));
  }

  if (nombre === "proyectos") {
    const p = d.proyectos || [];
    const enObra = p.filter((x) => !["entregado", "cancelado"].includes(x.estado)).length;
    const presupuesto = p.reduce((s, x) => s + (Number(x.presupuesto) || 0), 0);
    const cobrado = (d.pagos || []).filter((x) => x.estado === "pagado").reduce((s, x) => s + Number(x.monto || 0), 0);
    const avances = p.map((x) => avanceDeProyecto(x.nombre)).filter((v) => v !== null);
    const prom = avances.length ? Math.round(avances.reduce((a, b) => a + Number(b), 0) / avances.length) : 0;
    const lista = p.map((x) => [x.nombre, avanceDeProyecto(x.nombre) ?? 0]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    cuerpo = insCard("Resumen", statGrid([
      stat("En obra", numero(enObra)),
      stat("Cobrado", dineroCorto(cobrado), "ok"),
      stat("Presupuesto", dineroCorto(presupuesto)),
      stat("Avance prom.", prom + "%")
    ])) + insCard("Avance por obra", insBars(lista, 100, (v) => v + "%"));
  }

  if (nombre === "empleados") {
    const e = d.empleados || [];
    const activos = e.filter((x) => x.activo).length;
    const puestos = grupoSuma(e, (x) => x.puesto, () => 1);
    cuerpo = insCard("Resumen", statGrid([
      stat("Total", numero(e.length)),
      stat("Activos", numero(activos), "ok"),
      stat("Inactivos", numero(e.length - activos), activos === e.length ? "" : "warn"),
      stat("Asignaciones", numero((d.asignaciones || []).length))
    ])) + insCard("Por puesto", insBars(puestos, puestos[0]?.[1] || 1));
  }

  if (nombre === "asignaciones") {
    const a = d.asignaciones || [];
    const horas = a.reduce((s, x) => s + (Number(x.horas_semanales) || 0), 0);
    const personas = new Set(a.map((x) => x.empleado)).size;
    const obras = new Set(a.map((x) => x.proyecto)).size;
    const porObra = grupoSuma(a, (x) => x.proyecto, (x) => x.horas_semanales).slice(0, 5);
    cuerpo = insCard("Resumen", statGrid([
      stat("Registros", numero(a.length)),
      stat("Personas", numero(personas)),
      stat("Obras", numero(obras)),
      stat("Horas/sem", numero(horas))
    ])) + insCard("Horas por obra", insBars(porObra, porObra[0]?.[1] || 1, (v) => v + " h"));
  }

  if (nombre === "materiales") {
    const m = d.materiales || [];
    const valor = m.reduce((s, x) => s + valorInventario(x), 0);
    const bajo = m.filter((x) => Number(x.stock) < 120).length;
    const provs = new Set(m.map((x) => x.proveedor).filter(Boolean)).size;
    const top = m.map((x) => [x.nombre, valorInventario(x)]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    cuerpo = insCard("Resumen", statGrid([
      stat("Materiales", numero(m.length)),
      stat("Inventario", dineroCorto(valor)),
      stat("Bajo stock", numero(bajo), bajo ? "warn" : "ok"),
      stat("Proveedores", numero(provs))
    ])) + insCard("Mayor valor en stock", insBars(top, top[0]?.[1] || 1, (v) => dinero(v)));
  }

  if (nombre === "proveedores") {
    const p = d.proveedores || [];
    const activos = p.filter((x) => x.activo).length;
    const conEmail = p.filter((x) => x.email).length;
    const totalMat = p.reduce((s, x) => s + materialesDeProveedor(x.nombre), 0);
    const lista = p.map((x) => [x.nombre, materialesDeProveedor(x.nombre)]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    cuerpo = insCard("Resumen", statGrid([
      stat("Total", numero(p.length)),
      stat("Activos", numero(activos), "ok"),
      stat("Con email", numero(conEmail)),
      stat("Materiales", numero(totalMat))
    ])) + insCard("Materiales por proveedor", insBars(lista, lista[0]?.[1] || 1));
  }

  if (nombre === "pagos") {
    const pg = d.pagos || [];
    const pagados = pg.filter((x) => x.estado === "pagado");
    const cobrado = pagados.reduce((s, x) => s + Number(x.monto || 0), 0);
    const pendiente = pg.filter((x) => x.estado === "pendiente").reduce((s, x) => s + Number(x.monto || 0), 0);
    const ticket = pagados.length ? cobrado / pagados.length : 0;
    const ultimos = [...pg].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).slice(0, 4);
    const lista = ultimos.map((x) => `
      <div class="ins-row">
        <span>${esc(x.proyecto)}<small>${fecha(x.fecha)} · ${esc(humano(x.metodo))}</small></span>
        <b>${dinero(x.monto)}</b>
      </div>`).join("");
    cuerpo = insCard("Resumen", statGrid([
      stat("Cobrado", dineroCorto(cobrado), "ok"),
      stat("Pendiente", dineroCorto(pendiente), pendiente ? "warn" : ""),
      stat("Pagos", numero(pg.length)),
      stat("Ticket prom.", dineroCorto(ticket))
    ])) + insCard("Últimos pagos", lista || hayDatos);
  }

  if (nombre === "consumos") {
    const c = d.consumos || [];
    const costo = c.reduce((s, x) => s + Number(x.costo || 0), 0);
    const obras = new Set(c.map((x) => x.proyecto)).size;
    const mats = new Set(c.map((x) => x.material)).size;
    const top = grupoSuma(c, (x) => x.material, (x) => x.costo).slice(0, 4);
    cuerpo = insCard("Resumen", statGrid([
      stat("Registros", numero(c.length)),
      stat("Costo", dineroCorto(costo)),
      stat("Obras", numero(obras)),
      stat("Materiales", numero(mats))
    ])) + insCard("Costo por material", insBars(top, top[0]?.[1] || 1, (v) => dinero(v)));
  }

  if (nombre === "avances") {
    const a = d.avances || [];
    const p = d.proyectos || [];
    const porObra = p.map((x) => [x.nombre, avanceDeProyecto(x.nombre)]).filter(([, v]) => v !== null).sort((x, y) => y[1] - x[1]).slice(0, 5);
    const prom = porObra.length ? Math.round(porObra.reduce((s, [, v]) => s + Number(v), 0) / porObra.length) : 0;
    const ultimo = [...a].sort((x, y) => String(y.fecha).localeCompare(String(x.fecha)))[0];
    cuerpo = insCard("Resumen", statGrid([
      stat("Reportes", numero(a.length)),
      stat("Obras", numero(porObra.length)),
      stat("Promedio", prom + "%"),
      stat("Último", ultimo ? fecha(ultimo.fecha) : "—")
    ])) + insCard("Avance por obra", insBars(porObra, 100, (v) => v + "%"));
  }

  return `<aside class="insights">${cuerpo}</aside>`;
}

function pieResumen(nombre) {
  const d = datos;
  if (nombre === "clientes") {
    return "Cartera: " + dinero((d.proyectos || []).reduce((s, p) => s + (Number(p.presupuesto) || 0), 0));
  }
  if (nombre === "proyectos") {
    return "Presupuesto total: " + dinero((d.proyectos || []).reduce((s, p) => s + (Number(p.presupuesto) || 0), 0));
  }
  if (nombre === "empleados") {
    const e = d.empleados || [];
    return "Activos: " + e.filter((x) => x.activo).length + " de " + e.length;
  }
  if (nombre === "asignaciones") {
    return "Horas/sem totales: " + numero((d.asignaciones || []).reduce((s, x) => s + (Number(x.horas_semanales) || 0), 0));
  }
  if (nombre === "materiales") {
    return "Valor del inventario: " + dinero((d.materiales || []).reduce((s, x) => s + valorInventario(x), 0));
  }
  if (nombre === "proveedores") {
    const p = d.proveedores || [];
    return "Activos: " + p.filter((x) => x.activo).length + " de " + p.length;
  }
  if (nombre === "pagos") {
    return "Cobrado: " + dinero((d.pagos || []).filter((x) => x.estado === "pagado").reduce((s, x) => s + Number(x.monto || 0), 0));
  }
  if (nombre === "consumos") {
    return "Costo total: " + dinero((d.consumos || []).reduce((s, x) => s + Number(x.costo || 0), 0));
  }
  if (nombre === "avances") {
    const p = d.proyectos || [];
    const v = p.map((x) => avanceDeProyecto(x.nombre)).filter((x) => x !== null);
    const prom = v.length ? Math.round(v.reduce((a, b) => a + Number(b), 0) / v.length) : 0;
    return "Avance promedio: " + prom + "%";
  }
  return "";
}

/* ---------------- tablas ---------------- */
function pintarTabla(nombre) {
  const info = TABLAS[nombre];

  $("#vista").innerHTML = `
    <div class="panel-layout">
      <div class="panel">
        <div class="panel-head">
          <div class="search">
            ${svg(ICO.buscar)}
            <input id="q" type="search" placeholder="Buscar en ${esc(info.titulo.toLowerCase())}…"
                   value="${esc(filtros[nombre])}" aria-label="Buscar en ${esc(info.titulo)}">
          </div>
          <div class="panel-tools">
            <span class="meta muted" id="meta-count"></span>
            <button class="btn ghost" id="csv" type="button">${svg(ICO.bajar)}<span>Exportar</span></button>
            <button class="btn primary" id="nuevo" type="button">${svg(ICO.mas)}<span>Nuevo</span></button>
          </div>
        </div>
        <div id="lista"></div>
      </div>
      ${insightsHTML(nombre)}
    </div>`;

  $("#q").addEventListener("input", (e) => {
    filtros[nombre] = e.target.value;
    pintarFilas(nombre);
  });

  $("#csv").addEventListener("click", () => descargarCSV(nombre));
  $("#nuevo").addEventListener("click", () => abrirModal(nombre, null));

  $("#lista").addEventListener("click", (e) => {
    const editar = e.target.closest("button[data-edit]");
    if (editar) {
      const fila = (datos[nombre] || []).find((r) => String(r.id) === editar.dataset.edit);
      if (fila) abrirModal(nombre, fila);
      return;
    }
    const th = e.target.closest("th button[data-k]");
    if (!th) return;
    const k = th.dataset.k;
    if (orden[nombre].k === k) orden[nombre].dir *= -1;
    else { orden[nombre].k = k; orden[nombre].dir = 1; }
    pintarFilas(nombre);
  });

  pintarFilas(nombre);
}

function filasVisibles(nombre) {
  const cols = COLS[nombre];
  const q = filtros[nombre].trim().toLowerCase();
  let filas = [...(datos[nombre] || [])];

  if (q) {
    filas = filas.filter((f) => cols.some((c) => {
      const v = valorDe(f, c);
      const s = typeof v === "boolean" ? (v ? "si" : "no") : String(v ?? "").toLowerCase();
      return s.includes(q);
    }));
  }

  const { k, dir } = orden[nombre];
  const col = cols.find((c) => c.k === k) || cols[0];
  filas.sort((a, b) => {
    const va = valorDe(a, col), vb = valorDe(b, col);
    if (col.tipo === "dinero" || col.num || col.tipo === "stock" || col.tipo === "porcentaje") {
      return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
    }
    return String(va ?? "").toLowerCase().localeCompare(String(vb ?? "").toLowerCase(), "es") * dir;
  });
  return filas;
}

function celda(fila, col) {
  const v = valorDe(fila, col);
  if (v === null || v === undefined || v === "") return `<span class="muted">—</span>`;

  switch (col.tipo) {
    case "persona":
      return `<div class="who-cell">
        <span class="avatar ${variante(v)}">${esc(iniciales(v))}</span>
        <span class="nm"><b>${esc(v)}</b></span>
      </div>`;
    case "principal":
      return `<span class="strong">${esc(v)}</span>`;
    case "estado":
      return `<span class="badge b-${esc(v)}">${esc(humano(v))}</span>`;
    case "puesto":
      return `<span class="tag">${esc(humano(v))}</span>`;
    case "dinero":
      return dinero(v, col.dec ?? 0);
    case "fecha":
      return `<span class="muted">${fecha(v)}</span>`;
    case "bool":
      return v ? `<span class="yes">Sí</span>` : `<span class="no">No</span>`;
    case "stock":
      return `<span class="${Number(v) < 120 ? "low" : ""}">${numero(v)}</span>`;
    case "porcentaje":
      return pctHTML(v);
    case "calc":
      if (col.render === "pct") return pctHTML(v);
      if (col.formato === "dinero") return dinero(v, col.dec ?? 0);
      return numero(v);
    default:
      return esc(v);
  }
}

function pintarFilas(nombre) {
  const cols = COLS[nombre];
  const filas = filasVisibles(nombre);
  const total = (datos[nombre] || []).length;
  const o = orden[nombre];
  const editable = Boolean(FORMULARIOS[nombre]);

  const head = cols.map((c) => {
    const activa = o.k === c.k;
    return `<th class="${activa ? "sorted" : ""} ${c.num ? "r" : ""}">
      <button data-k="${c.k}">${esc(c.t)}<span class="arw">${activa ? (o.dir === 1 ? "▲" : "▼") : "↕"}</span></button>
    </th>`;
  }).join("") + (editable ? `<th class="acciones"><span class="sr-only">Acciones</span></th>` : "");

  const body = filas.map((f, i) => `
    <tr class="${animarEntrada ? "row-in" : ""}" ${animarEntrada ? `style="animation-delay:${Math.min(i, 10) * 28}ms"` : ""}>${cols.map((c) => {
      const classe = [c.tipo === "principal" || c.tipo === "persona" ? "strong" : "", c.num ? "r" : ""].join(" ");
      return `<td class="${classe}">${celda(f, c)}</td>`;
    }).join("")}
    ${editable ? `<td class="acciones"><button class="icon-btn" data-edit="${esc(f.id)}" title="Editar" aria-label="Editar">${svg(ICO.editar)}</button></td>` : ""}
    </tr>`).join("");

  $("#meta-count").textContent = `${total} registro${total === 1 ? "" : "s"}`;
  $("#csv").disabled = filas.length === 0;

  $("#lista").innerHTML = `
    <div class="table-scroll">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body || `<tr><td colspan="${cols.length + (editable ? 1 : 0)}"><div class="empty">Sin resultados para “${esc(filtros[nombre])}”.</div></td></tr>`}</tbody>
      </table>
    </div>
    <div class="panel-foot">
      <span>Mostrando <strong>${filas.length}</strong> de ${total}</span>
      <span class="pie-total">${pieResumen(nombre)}</span>
    </div>`;
}

/* ---------------- modal de alta / edición ---------------- */
function opcionesDe(campo) {
  if (campo.fuente) {
    const arr = datos[campo.fuente] || [];
    return arr.map((x) => ({
      v: x.id,
      t: campo.fuente === "materiales" ? `${x.nombre} (${x.unidad})` : x.nombre
    }));
  }
  return (campo.opciones || []).map((o) => (typeof o === "string" ? { v: o, t: humano(o) } : o));
}

function campoHTML(c, valor) {
  const id = "f_" + c.k;
  const val = valor !== undefined ? valor : (typeof c.defecto === "function" ? c.defecto() : c.defecto ?? "");
  const req = c.req ? "required" : "";
  const label = `<span>${esc(c.t)}${c.req ? ' <em>*</em>' : ""}</span>`;

  if (c.tipo === "checkbox") {
    return `<label class="field check">
      <input type="checkbox" id="${id}" ${val ? "checked" : ""}>
      <span>${esc(c.t)}</span>
    </label>`;
  }

  if (c.tipo === "textarea") {
    return `<label class="field wide">${label}
      <textarea id="${id}" rows="3" ${req} maxlength="${c.max || 2000}">${esc(val)}</textarea>
    </label>`;
  }

  if (c.tipo === "select") {
    const opts = opcionesDe(c).map((o) =>
      `<option value="${esc(o.v)}" ${String(o.v) === String(val) ? "selected" : ""}>${esc(o.t)}</option>`).join("");
    return `<label class="field">${label}
      <select id="${id}" ${req}>
        <option value="">Selecciona…</option>
        ${opts}
      </select>
    </label>`;
  }

  const extra = c.tipo === "number"
    ? `step="${c.step || "any"}" ${c.min !== undefined ? `min="${c.min}"` : ""} ${c.maxv !== undefined ? `max="${c.maxv}"` : ""}`
    : "";

  return `<label class="field">${label}
    <input id="${id}" type="${c.tipo || "text"}" value="${esc(val)}" ${req} ${extra} ${c.max ? `maxlength="${c.max}"` : ""}>
  </label>`;
}

function abrirModal(nombre, fila) {
  const cfg = FORMULARIOS[nombre];
  if (!cfg) return;
  formActual = { nombre, fila };

  $("#modal-title").textContent = (fila ? "Editar " : "Nuevo ") + cfg.singular;
  $("#modal-error").hidden = true;
  $("#modal-fields").innerHTML = cfg.campos
    .map((c) => campoHTML(c, fila ? (fila[c.k] ?? "") : undefined))
    .join("");

  $("#modal").hidden = false;
  document.body.classList.add("modal-open");
  const primero = $("#modal-fields input, #modal-fields select, #modal-fields textarea");
  if (primero) primero.focus();
}

function cerrarModal() {
  $("#modal").hidden = true;
  document.body.classList.remove("modal-open");
  formActual = null;
}

function leerFormulario() {
  const cfg = FORMULARIOS[formActual.nombre];
  const payload = {};
  for (const c of cfg.campos) {
    const el = document.getElementById("f_" + c.k);
    if (!el) continue;
    if (c.tipo === "checkbox") payload[c.k] = el.checked;
    else if (c.tipo === "number") payload[c.k] = el.value === "" ? null : Number(el.value);
    else payload[c.k] = el.value.trim() === "" ? null : el.value.trim();
  }
  return payload;
}

async function guardarFormulario(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.reportValidity()) return;

  const cfg = FORMULARIOS[formActual.nombre];
  const fila = formActual.fila;
  const payload = leerFormulario();
  const btn = $("#modal-save");

  btn.disabled = true;
  $("#modal-error").hidden = true;

  try {
    ultimaAccionPropia = Date.now();
    if (fila) await actualizar(cfg.tabla, fila.id, payload);
    else await insertar(cfg.tabla, payload);

    cerrarModal();
    toast(fila ? `${humano(cfg.singular)} actualizado` : `${humano(cfg.singular)} creado`, "ok");
    await cargarTodo(true);
  } catch (err) {
    $("#modal-error").hidden = false;
    $("#modal-error").textContent = "No se pudo guardar: " + err.message;
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- toasts ---------------- */
function toast(texto, tipo = "ok") {
  const cont = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast " + tipo;
  el.textContent = texto;
  cont.appendChild(el);
  setTimeout(() => { el.classList.add("out"); }, 2600);
  setTimeout(() => { el.remove(); }, 3200);
}

/* ---------------- exportar CSV ---------------- */
function descargarCSV(nombre) {
  const cols = COLS[nombre];
  const filas = filasVisibles(nombre);
  const celdaCSV = (fila, col) => {
    const v = valorDe(fila, col);
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "Sí" : "No";
    return String(v).replace(/"/g, '""');
  };
  const linea = (arr) => arr.map((x) => (/[";\n]/.test(x) ? `"${x}"` : x)).join(";");

  const contenido = "\ufeff" + [linea(cols.map((c) => c.t))]
    .concat(filas.map((f) => linea(cols.map((c) => celdaCSV(f, c)))))
    .join("\r\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${nombre}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------------- tiempo real ---------------- */
function programarRefresco(propio) {
  if (!propio) toastPendiente = true;
  clearTimeout(timerRefresco);
  timerRefresco = setTimeout(async () => {
    await cargarTodo(true);
    marcarActualizado();
    if (toastPendiente) {
      toast("Cambio recibido en tiempo real", "info");
      toastPendiente = false;
    }
  }, 350);
}

function marcarActualizado() {
  const el = $("#updated");
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 1200);
}

async function iniciarTiempoReal() {
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    const sb = mod.createClient(CFG.url, CFG.key, { db: { schema: CFG.schema } });

    sb.channel("panel-constructora")
      .on("postgres_changes", { event: "*", schema: CFG.schema }, () => {
        const propio = Date.now() - ultimaAccionPropia < 2000;
        programarRefresco(propio);
      })
      .subscribe((estado) => {
        realtimeActivo = estado === "SUBSCRIBED";
        pintarLive();
      });
  } catch (e) {
    // Sin CDN: se mantiene el panel funcional con refresco periódico.
    realtimeActivo = false;
    pintarLive();
    setInterval(() => { if (!document.hidden) cargarTodo(true); }, 15000);
  }
}

/* ---------------- navegación ---------------- */
function ir(nombre) {
  pestaña = nombre;
  if (location.hash.slice(1) !== nombre) history.replaceState(null, "", "#" + nombre);
  animarEntrada = true;
  pintar();
  animarEntrada = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const inicial = location.hash.slice(1);
  if (inicial === "resumen" || TABLAS[inicial]) pestaña = inicial;

  $("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (btn) ir(btn.dataset.tab);
  });

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quick]");
    if (q) abrirModal(q.dataset.quick, null);
  });

  $("#refrescar").addEventListener("click", () => cargarTodo(true));

  $("#modal-close").addEventListener("click", cerrarModal);
  $("#modal-cancel").addEventListener("click", cerrarModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") cerrarModal(); });
  $("#modal-form").addEventListener("submit", guardarFormulario);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#modal").hidden) cerrarModal();
  });

  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if ((h === "resumen" || TABLAS[h]) && h !== pestaña) { pestaña = h; pintar(); }
  });

  cargarTodo().then(iniciarTiempoReal);
});
