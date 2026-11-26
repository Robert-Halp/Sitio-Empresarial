/* =========================================================
   Constructora · Panel de operaciones
   Solo lectura: claves públicas + vistas de Supabase.
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
  dinero: `<rect x="2.5" y="6" width="19" height="12.5" rx="2.5"/><path d="M2.5 10.5h19"/><circle cx="17" cy="14.8" r="1.1"/>`,
  alerta: `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>`,
  buscar: `<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>`,
  bajar: `<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>`,
  refrescar: `<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>`
};
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

/* ---------------- configuración de vistas ---------------- */
const TABLAS = {
  clientes:     { vista: "vista_clientes",     icono: "clientes",     titulo: "Clientes",     sub: "Personas y empresas que contratan una obra.", seccion: "Catálogos" },
  proyectos:    { vista: "vista_proyectos",    icono: "proyectos",    titulo: "Proyectos",    sub: "Obras en curso, presupuesto y fechas de entrega.", seccion: "Operación" },
  empleados:    { vista: "vista_empleados",    icono: "empleados",    titulo: "Empleados",    sub: "Plantilla de la constructora. El salario no se expone.", seccion: "Catálogos" },
  asignaciones: { vista: "vista_asignaciones", icono: "asignaciones", titulo: "Asignaciones", sub: "Quién trabaja en cada obra y con qué rol.", seccion: "Operación" },
  materiales:   { vista: "vista_materiales",   icono: "materiales",   titulo: "Materiales",   sub: "Catálogo con precios y existencias.", seccion: "Catálogos" }
};

const RESUMEN = {
  titulo: "Resumen",
  sub: "Vista rápida de la operación: cartera, entregas y materiales.",
  seccion: "General"
};

const COLS = {
  clientes: [
    { k: "nombre",    t: "Cliente",  tipo: "persona" },
    { k: "email",     t: "Email" },
    { k: "telefono",  t: "Teléfono" },
    { k: "direccion", t: "Dirección" },
    { k: "creado_en", t: "Alta",     tipo: "fecha" }
  ],
  proyectos: [
    { k: "nombre",        t: "Proyecto",    tipo: "principal" },
    { k: "cliente",       t: "Cliente",     sub: true },
    { k: "estado",        t: "Estado",      tipo: "estado" },
    { k: "presupuesto",   t: "Presupuesto", tipo: "dinero", dec: 0, num: true },
    { k: "fecha_inicio",  t: "Inicio",      tipo: "fecha" },
    { k: "fecha_entrega", t: "Entrega",     tipo: "fecha" }
  ],
  empleados: [
    { k: "nombre",        t: "Empleado",   tipo: "persona" },
    { k: "puesto",        t: "Puesto",     tipo: "puesto" },
    { k: "telefono",      t: "Teléfono" },
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
    { k: "proveedor",       t: "Proveedor" }
  ]
};

const ORDEN_INICIAL = {
  clientes:     { k: "nombre",      dir: 1 },
  proyectos:    { k: "presupuesto", dir: -1 },
  empleados:    { k: "nombre",      dir: 1 },
  asignaciones: { k: "empleado",    dir: 1 },
  materiales:   { k: "stock",       dir: -1 }
};

const ESTADOS = ["planificacion", "permisos", "cimentacion", "estructura", "acabados", "entregado", "cancelado"];
const COLOR_ESTADO = {
  planificacion: "#6366f1", permisos: "#8b5cf6", cimentacion: "#f59e0b",
  estructura: "#f97316", acabados: "#14b8a6", entregado: "#22c55e", cancelado: "#ef4444"
};

/* ---------------- estado ---------------- */
const datos = {};
const filtros = { clientes: "", proyectos: "", empleados: "", asignaciones: "", materiales: "" };
const orden = JSON.parse(JSON.stringify(ORDEN_INICIAL));
let pestaña = "resumen";
let cargando = true;
let refrescando = false;
let error = null;
let actualizado = null;

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
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const d = new Date(String(f).slice(0, 10) + "T00:00:00");
  return Math.round((d - hoy) / 86400000);
}
const variante = (s) => "a" + ((String(s).length % 4) + 1);

/* ---------------- API ---------------- */
async function pedirVista(vista) {
  const res = await fetch(`${CFG.url}/rest/v1/${vista}?select=*`, {
    headers: {
      apikey: CFG.key,
      Authorization: `Bearer ${CFG.key}`,
      "Accept-Profile": CFG.schema
    }
  });
  if (!res.ok) {
    const detalle = (await res.text()).slice(0, 180);
    throw new Error(`${vista}: HTTP ${res.status} · ${detalle}`);
  }
  return res.json();
}

async function cargarTodo(esRefresco = false) {
  if (esRefresco) refrescando = true;
  else { cargando = true; error = null; }
  pintar();

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
  pintar();
}

/* ---------------- pintado general ---------------- */
function pintar() {
  pintarNav();
  pintarCabecera();
  pintarLive();
  pintarAviso();

  if (cargando) {
    $("#vista").innerHTML = `<div class="panel"><div class="loading"><div class="spinner"></div>Cargando datos de la constructora…</div></div>`;
    return;
  }
  if (error && !datos.clientes) { $("#vista").innerHTML = ""; return; }

  if (pestaña === "resumen") pintarResumen();
  else pintarTabla(pestaña);

  const btn = $("#refrescar");
  btn.disabled = refrescando;
  btn.querySelector("svg").classList.toggle("spin", refrescando);
}

function pintarNav() {
  const items = [["resumen", "Resumen", "resumen", null]];
  Object.entries(TABLAS).forEach(([k, v]) => items.push([k, v.titulo, v.icono, datos[k] ? datos[k].length : null]));

  $("#nav").innerHTML = items.map(([k, t, ico, n]) => `
    <button class="nav-item" data-tab="${k}" aria-current="${pestaña === k ? "page" : "false"}">
      ${svg(ICO[ico])}
      <span>${t}</span>
      ${n === null ? "" : `<span class="count">${n}</span>`}
    </button>`).join("");
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
  txt.textContent = error ? "Sin conexión" : cargando ? "Conectando…" : "En vivo · Supabase";
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

  $("#vista").innerHTML = `
    <section class="kpis">
      ${kpi("clientes", "Clientes", (datos.clientes || []).length, "registrados en el sistema", "blue")}
      ${kpi("proyectos", "Proyectos en obra", enObra.length, `de ${p.length} en total`, "green")}
      ${kpi("dinero", "Cartera en obra", dinero(cartera), "presupuesto de obras activas", "amber")}
      ${kpi("alerta", "Materiales por reponer", bajo.length, "stock menor a 120", bajo.length ? "red" : "", bajo.length > 0)}
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="card-head"><h3>Proyectos por estado</h3><span class="meta">${p.length} en total</span></div>
        <div class="donut-wrap">
          <div class="donut">
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
        <div class="card-head"><h3>Inventario bajo</h3><span class="meta">${bajo.length} material${bajo.length === 1 ? "" : "es"}</span></div>
        ${bajo.sort((a, b) => Number(a.stock) - Number(b.stock)).map((m) => `
          <div class="stock-row">
            <div class="nm">${esc(m.nombre)}<small>${esc(m.proveedor || "sin proveedor")}</small></div>
            <div class="track"><div class="fill" style="width:${Math.min(100, (Number(m.stock) / 120) * 100)}%;background:linear-gradient(90deg,#fca5a5,#ef4444)"></div></div>
            <div class="qty low">${numero(m.stock)}</div>
          </div>`).join("") || `<p class="muted" style="font-size:13px">Todo el inventario está por encima del mínimo.</p>`}
      </div>
    </section>`;
}

function kpi(icono, etiqueta, valor, pista, color = "", warn = false) {
  return `
    <article class="kpi ${warn ? "warn" : ""}">
      <div class="kpi-top">
        <span class="chip ${color}">${svg(ICO[icono])}</span>
        <span class="lbl">${esc(etiqueta)}</span>
      </div>
      <div class="val">${typeof valor === "number" ? numero(valor) : valor}</div>
      <div class="hint">${esc(pista)}</div>
    </article>`;
}

function dona(conteo, total) {
  const R = 62, C = 2 * Math.PI * R;
  if (!total) return `<circle cx="84" cy="84" r="${R}" fill="none" stroke="#f1efec" stroke-width="17"/>`;
  let offset = 0;
  return `<circle cx="84" cy="84" r="${R}" fill="none" stroke="#f4f2ef" stroke-width="17"/>` +
    ESTADOS.filter((e) => conteo[e] > 0).map((e) => {
      const largo = (conteo[e] / total) * C;
      const hueco = 2.5;
      const s = `<circle class="seg" cx="84" cy="84" r="${R}" fill="none" stroke="${COLOR_ESTADO[e]}" stroke-width="17"
        stroke-dasharray="${Math.max(largo - hueco, 1)} ${C - Math.max(largo - hueco, 1)}"
        stroke-dashoffset="${-offset}"/>`;
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

/* ---------------- tablas ---------------- */
function pintarTabla(nombre) {
  const info = TABLAS[nombre];

  $("#vista").innerHTML = `
    <div class="panel">
      <div class="panel-head">
        <div class="search">
          ${svg(ICO.buscar)}
          <input id="q" type="search" placeholder="Buscar en ${esc(info.titulo.toLowerCase())}…"
                 value="${esc(filtros[nombre])}" aria-label="Buscar en ${esc(info.titulo)}">
        </div>
        <div class="panel-tools">
          <span class="meta muted" id="meta-count"></span>
          <button class="btn ghost" id="csv" type="button">${svg(ICO.bajar)}<span>Exportar CSV</span></button>
        </div>
      </div>
      <div id="lista"></div>
    </div>`;

  $("#q").addEventListener("input", (e) => {
    filtros[nombre] = e.target.value;
    pintarFilas(nombre);
  });

  $("#csv").addEventListener("click", () => descargarCSV(nombre));

  $("#lista").addEventListener("click", (e) => {
    const btn = e.target.closest("th button[data-k]");
    if (!btn) return;
    const k = btn.dataset.k;
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
      const v = f[c.k];
      const s = typeof v === "boolean" ? (v ? "si" : "no") : String(v ?? "").toLowerCase();
      return s.includes(q);
    }));
  }

  const { k, dir } = orden[nombre];
  const col = cols.find((c) => c.k === k) || cols[0];
  filas.sort((a, b) => {
    let va = a[col.k], vb = b[col.k];
    if (col.tipo === "dinero" || col.num || col.tipo === "stock") {
      return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
    }
    return String(va ?? "").toLowerCase().localeCompare(String(vb ?? "").toLowerCase(), "es") * dir;
  });
  return filas;
}

function celda(fila, col) {
  const v = fila[col.k];
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
    default:
      return esc(v);
  }
}

function pintarFilas(nombre) {
  const cols = COLS[nombre];
  const filas = filasVisibles(nombre);
  const total = (datos[nombre] || []).length;
  const o = orden[nombre];

  const head = cols.map((c) => {
    const activa = o.k === c.k;
    return `<th class="${activa ? "sorted" : ""} ${c.num ? "r" : ""}">
      <button data-k="${c.k}">${esc(c.t)}<span class="arw">${activa ? (o.dir === 1 ? "▲" : "▼") : "↕"}</span></button>
    </th>`;
  }).join("");

  const body = filas.map((f) => `
    <tr>${cols.map((c) => {
      const classe = [c.tipo === "principal" || c.tipo === "persona" ? "strong" : "", c.num ? "r" : ""].join(" ");
      return `<td class="${classe}">${celda(f, c)}</td>`;
    }).join("")}</tr>`).join("");

  $("#meta-count").textContent = `${total} registro${total === 1 ? "" : "s"}`;
  $("#csv").disabled = filas.length === 0;

  $("#lista").innerHTML = `
    <div class="table-scroll">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body || `<tr><td colspan="${cols.length}"><div class="empty">Sin resultados para “${esc(filtros[nombre])}”.</div></td></tr>`}</tbody>
      </table>
    </div>
    <div class="panel-foot">
      <span>Mostrando <strong>${filas.length}</strong> de ${total}</span>
      <span>Datos de solo lectura</span>
    </div>`;
}

/* ---------------- exportar CSV ---------------- */
function descargarCSV(nombre) {
  const cols = COLS[nombre];
  const filas = filasVisibles(nombre);
  const celdaCSV = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "Sí" : "No";
    return String(v).replace(/"/g, '""');
  };
  const linea = (arr) => arr.map((x) => (/[";\n]/.test(x) ? `"${x}"` : x)).join(";");

  const contenido = "\ufeff" + [linea(cols.map((c) => c.t))]
    .concat(filas.map((f) => linea(cols.map((c) => celdaCSV(f[c.k])))))
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

/* ---------------- navegación ---------------- */
function ir(nombre) {
  pestaña = nombre;
  if (location.hash.slice(1) !== nombre) history.replaceState(null, "", "#" + nombre);
  pintar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const inicial = location.hash.slice(1);
  if (inicial === "resumen" || TABLAS[inicial]) pestaña = inicial;

  $("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (btn) ir(btn.dataset.tab);
  });

  $("#refrescar").addEventListener("click", () => cargarTodo(true));

  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if ((h === "resumen" || TABLAS[h]) && h !== pestaña) { pestaña = h; pintar(); }
  });

  cargarTodo();
});
