const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "design", "sportbook-boceto-tablet.svg");
const downloadsOut = path.join(process.env.USERPROFILE || root, "Downloads", "Mi pagina tablet.svg");

const W = 2600;
const H = 4200;
const c = {
  page: "#B6B6B6",
  board: "#626262",
  black: "#050505",
  dark: "#0f0f0f",
  panel: "#1f1f1f",
  panel2: "#262626",
  line: "#333333",
  yellow: "#ffcc00",
  white: "#ffffff",
  muted: "#cccccc",
  cyan: "#67d7ff",
  red: "#ff6b5f",
};

const s = [];
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const add = (v) => s.push(v);
const rect = (x, y, w, h, fill, stroke = "none", rx = 0, extra = "") => add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" ${extra}/>`);
const text = (x, y, value, size, fill = c.white, weight = 700, anchor = "start") => add(`<text x="${x}" y="${y}" fill="${fill}" font-family="Poppins, Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`);
const line = (x1, y1, x2, y2, stroke = c.yellow, sw = 4) => add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`);

function lines(x, y, arr, size = 18, fill = c.muted, gap = 27, weight = 500) {
  arr.forEach((v, i) => text(x, y + i * gap, v, size, fill, weight));
}
function logo(x, y, scale = 1) {
  rect(x, y, 42 * scale, 42 * scale, c.yellow, c.yellow, 10 * scale);
  text(x + 21 * scale, y + 27 * scale, "SB", 12 * scale, "#111111", 900, "middle");
  text(x + 56 * scale, y + 28 * scale, "SportBook", 19 * scale, c.yellow, 900);
}
function button(x, y, w, h, label, fill = c.yellow, color = "#111111") {
  rect(x, y, w, h, fill, fill, 6);
  text(x + w / 2, y + h / 2 + 6, label, 15, color, 900, "middle");
}
function ghostButton(x, y, w, h, label) {
  rect(x, y, w, h, "transparent", c.line, 6);
  text(x + w / 2, y + h / 2 + 6, label, 14, c.white, 800, "middle");
}
function card(x, y, w, h, rx = 10) {
  rect(x, y, w, h, c.panel, c.line, rx);
}
function input(x, y, w, h, label = "") {
  rect(x, y, w, h, "#0b0b0b", c.line, 4);
  if (label) text(x + 15, y + h / 2 + 6, label, 14, "#8d8d8d", 600);
}
function imageBlock(x, y, w, h) {
  rect(x, y, w, h, "#2b2b2b", c.line, 5);
  line(x + 18, y + h - 45, x + w - 18, y + 28, c.yellow, 8);
  line(x + 18, y + h - 64, x + w - 18, y + 8, "#141414", 15);
}
function screen(x, y, w, h, title) {
  text(x, y - 20, title, 24, "#dedede", 900);
  rect(x, y, w, h, c.black, "#111111", 0, `filter="url(#shadow)"`);
}
function navHeader(x, y, w, tabletMenu = false) {
  rect(x, y, w, 70, "#050505", "rgba(255,204,0,0.14)");
  logo(x + 28, y + 15, 0.85);
  if (tabletMenu) {
    button(x + w - 120, y + 20, 86, 30, "Menú");
  } else {
    ["Inicio", "Nosotros", "Servicios", "Instalaciones", "Ayuda"].forEach((item, i) => text(x + 305 + i * 118, y + 43, item, 14, c.white, 800, "middle"));
    ghostButton(x + w - 255, y + 18, 105, 34, "Iniciar sesión");
    button(x + w - 135, y + 18, 105, 34, "Crear cuenta");
  }
}
function sectionTitle(x, y, label, title1, title2 = "") {
  text(x, y, label.toUpperCase(), 13, c.yellow, 900);
  text(x, y + 58, title1, 34, c.white, 900);
  if (title2) text(x, y + 96, title2, 34, c.white, 900);
}

function homeTablet(x, y) {
  const w = 840;
  const h = 3060;
  screen(x, y, w, h, "Inicio tablet completo");
  navHeader(x, y, w);
  rect(x, y + 70, w, 500, "#1a1a1a");
  line(x - 30, y + 540, x + w + 30, y + 345, "rgba(255,204,0,0.55)", 16);
  sectionTitle(x + 56, y + 205, "Reservas deportivas online", "SportBook");
  lines(x + 56, y + 342, ["Reserva fútbol, yoga, gimnasio, pádel y natación desde una", "plataforma rápida, clara y pensada para clientes."], 18);
  [["5+", "Actividades"], ["24h", "Reserva online"], ["100%", "Para clientes"]].forEach(([a, b], i) => {
    card(x + 56 + i * 235, y + 445, 225, 82, 6);
    text(x + 78 + i * 235, y + 482, a, 30, c.yellow, 900);
    text(x + 78 + i * 235, y + 508, b, 13, c.white, 800);
  });

  sectionTitle(x + 180, y + 700, "Nosotros", "Todo lo que necesitas para reservar deporte", "sin llamadas ni esperas");
  lines(x + 152, y + 830, ["SportBook centraliza actividades, horarios, reseñas y ayuda en una experiencia sencilla."], 17, c.muted);
  ["Busca una actividad", "Reserva tu plaza", "Gestiona tu experiencia"].forEach((v, i) => {
    const px = x + 70 + i * 250;
    card(px, y + 910, 220, 168);
    rect(px + 22, y + 940, 38, 38, c.yellow, c.yellow, 9);
    text(px + 41, y + 965, `0${i + 1}`, 12, "#111111", 900, "middle");
    text(px + 22, y + 1020, v, 18, c.white, 900);
    lines(px + 22, y + 1050, ["Consulta y reserva", "en pocos pasos."], 13);
  });

  sectionTitle(x + 180, y + 1260, "Servicios", "Una experiencia preparada para reservar mejor");
  ["Actividades", "Reservas claras", "Ayuda privada", "Reseñas"].forEach((v, i) => {
    const px = x + 60 + i * 185;
    card(px, y + 1370, 165, 158);
    rect(px + 22, y + 1400, 34, 34, c.yellow, c.yellow, 8);
    text(px + 39, y + 1423, `0${i + 1}`, 11, "#111111", 900, "middle");
    text(px + 22, y + 1474, v, 17, c.white, 900);
    lines(px + 22, y + 1502, ["Gestión clara", "desde un panel."], 12);
  });

  sectionTitle(x + 160, y + 1708, "Instalaciones", "Fotos, direcciones y horarios de reserva");
  lines(x + 120, y + 1812, ["Consulta dónde tienes que ir antes de reservar y los horarios habituales disponibles."], 16);
  const facilities = ["Campos exteriores y pista sala", "Salas Zen, Norte y terraza", "Zona fuerza, cardio y entreno personal", "Pistas exteriores y cubierta", "Piscina cubierta y piscina infantil"];
  facilities.forEach((v, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = x + 60 + col * 375;
    const py = y + 1880 + row * 255;
    card(px, py, 345, 220);
    imageBlock(px + 18, py + 18, 309, 112);
    rect(px + 22, py + 146, 62, 24, "#2d2a12", "rgba(255,204,0,0.35)", 12);
    text(px + 53, py + 163, i === 0 ? "Fútbol" : i === 1 ? "Yoga" : i === 2 ? "Gimnasio" : i === 3 ? "Pádel" : "Natación", 11, c.yellow, 800, "middle");
    text(px + 22, py + 190, v, 18, c.white, 900);
    text(px + 22, py + 214, "Madrid · horarios disponibles", 13, c.cyan, 800);
  });

  sectionTitle(x + 170, y + 2710, "Ayuda", "Pregunta sobre reservas sin registrarte");
  card(x + 84, y + 2825, 672, 170);
  text(x + 112, y + 2870, "Centro de ayuda SportBook", 20, c.white, 900);
  lines(x + 112, y + 2905, ["Completa tus datos para que podamos entender tu consulta."], 14);
  input(x + 370, y + 2860, 160, 32, "Nombre");
  input(x + 548, y + 2860, 160, 32, "Gmail");
  input(x + 370, y + 2910, 338, 42, "Mensaje");
  button(x + 370, y + 2968, 338, 34, "Enviar pregunta");
  rect(x, y + h - 74, w, 74, "#090909");
  logo(x + 56, y + h - 54, 0.65);
  text(x + w - 275, y + h - 28, "SportBook © 2026", 14, c.muted, 700);
}

function authTablet(x, y, title, action) {
  const w = 520;
  const h = 610;
  screen(x, y, w, h, title);
  rect(x + 135, y + 130, 250, 318, "#111111", c.yellow, 8);
  text(x + 260, y + 185, title, 25, c.yellow, 900, "middle");
  text(x + 260, y + 214, "Datos de acceso", 13, c.white, 800, "middle");
  input(x + 174, y + 260, 172, 34, "Email");
  input(x + 174, y + 312, 172, 34, title.includes("Crea") ? "Correo" : "Contraseña");
  if (title.includes("Crea")) input(x + 174, y + 364, 172, 34, "Confirmar");
  button(x + 174, y + (title.includes("Crea") ? 420 : 368), 172, 36, action);
  text(x + 260, y + 492, title.includes("Recupera") ? "Volver al login" : "Registro / Recuperar", 13, c.yellow, 700, "middle");
}

function dashboardTablet(x, y) {
  const w = 860;
  const h = 1730;
  screen(x, y, w, h, "Panel usuario tablet");
  navHeader(x, y, w);
  ghostButton(x + w - 126, y + 18, 92, 34, "Usuario");
  sectionTitle(x + 58, y + 150, "Reserva online", "Elige tu deporte y guarda tu plaza");
  lines(x + 58, y + 250, ["Fútbol, yoga, gimnasio, pádel y natación en un mismo sitio."], 17);
  ["Confirmación inmediata", "Horarios disponibles", "Instalaciones cercanas"].forEach((v, i) => {
    card(x + 58, y + 320 + i * 60, 330, 42, 6);
    text(x + 76, y + 348 + i * 60, v, 14, c.white, 900);
  });
  card(x + 454, y + 138, 340, 630);
  text(x + 484, y + 190, "NUEVA RESERVA", 13, c.yellow, 900);
  text(x + 484, y + 232, "Completa tus datos", 28, c.white, 900);
  ["Fútbol", "Yoga", "Gym"].forEach((v, i) => ghostButton(x + 484 + i * 76, y + 260, 62, 38, v));
  ["Actividad", "Instalación", "Fecha", "Hora", "Personas", "Método pago", "Nombre"].forEach((v, i) => input(x + 484, y + 330 + i * 50, 250, 34, v));
  button(x + 484, y + 700, 250, 38, "Reservar y pagar");
  card(x + 58, y + 855, 736, 245);
  imageBlock(x + 82, y + 882, 330, 120);
  imageBlock(x + 438, y + 882, 330, 120);
  text(x + 82, y + 1040, "Información de la instalación", 18, c.yellow, 900);
  lines(x + 82, y + 1065, ["Selecciona una actividad para ver imagen, horarios y disponibilidad."], 13);
  ["Horario", "Días disponibles", "Horas ocupadas"].forEach((v, i) => {
    card(x + 58 + i * 250, y + 1145, 220, 88);
    text(x + 78 + i * 250, y + 1184, v, 17, c.white, 900);
    text(x + 78 + i * 250, y + 1214, "-", 16, c.muted, 900);
  });
  card(x + 58, y + 1270, 736, 62);
  text(x + 80, y + 1308, "Mis reservas", 18, c.white, 900);
  card(x + 58, y + 1370, 350, 150);
  text(x + 80, y + 1412, "¿Necesitas ayuda?", 19, c.yellow, 900);
  text(x + 80, y + 1444, "Formulario privado.", 15, c.white, 800);
  card(x + 444, y + 1370, 350, 150);
  text(x + 466, y + 1412, "Comparte tu experiencia", 19, c.yellow, 900);
  text(x + 466, y + 1444, "Valora tu actividad.", 15, c.white, 800);
}

function adminTablet(x, y, active, title) {
  const w = 860;
  const h = 610;
  screen(x, y, w, h, `Admin tablet - ${title}`);
  rect(x, y, 205, h, "#050505", c.line);
  logo(x + 28, y + 24, 0.72);
  ["Resumen", "Pagos pendientes", "Ayuda recibida", "Reseñas", "Bloqueados"].forEach((v, i) => {
    rect(x + 28, y + 100 + i * 56, 150, 38, i === active ? c.yellow : "#151515", i === active ? c.yellow : c.line, 5);
    text(x + 44, y + 125 + i * 56, v, 13, i === active ? "#111111" : c.white, 850);
  });
  text(x + 250, y + 72, "ADMINISTRADOR", 13, c.yellow, 900);
  text(x + 250, y + 122, title, 34, c.white, 900);
  ghostButton(x + w - 160, y + 58, 120, 36, "Bienvenido");
  if (active === 0) {
    ["0 € Cobrados", "0 € Pendientes", "0 Reservas", "0 Bloqueados"].forEach((v, i) => {
      card(x + 250 + i * 140, y + 175, 118, 72);
      text(x + 264 + i * 140, y + 218, v, 13, c.white, 900);
    });
    card(x + 250, y + 298, 560, 150);
    text(x + 530, y + 380, "No se encontraron datos", 16, c.white, 800, "middle");
  } else if (active === 1) {
    card(x + 250, y + 168, 260, 105);
    text(x + 274, y + 210, "Bizum antes de la reserva", 17, c.yellow, 900);
    lines(x + 274, y + 238, ["Comprueba importe y cliente."], 13);
    card(x + 535, y + 168, 260, 105);
    text(x + 559, y + 210, "Pago pendiente", 17, c.yellow, 900);
    lines(x + 559, y + 238, ["Contacta antes de la actividad."], 13);
    card(x + 250, y + 322, 545, 112);
    ["CLIENTE", "RESERVA", "IMPORTE", "ACCIONES"].forEach((v, i) => text(x + 278 + i * 128, y + 365, v, 13, c.yellow, 900));
  } else {
    card(x + 250, y + 170, 545, 160);
    text(x + 274, y + 215, active === 2 ? "Ayuda recibida" : active === 3 ? "Reseñas" : "Usuarios bloqueados", 20, c.white, 900);
    lines(x + 274, y + 252, ["Tabla editable con los datos del proyecto."], 14);
  }
}

add(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">`);
add(`<defs><filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.42"/></filter></defs>`);
rect(0, 0, W, H, c.page);
rect(42, 42, W - 84, H - 84, c.board);
text(82, 95, "sportbook-boceto editable - Tablet", 28, "#dcdcdc", 900);

homeTablet(82, 160);
authTablet(1020, 160, "Bienvenido a SportBook", "Entrar");
authTablet(1020, 860, "Crea tu cuenta", "Crear cuenta");
authTablet(1020, 1560, "Recupera tu cuenta", "Cambiar");
dashboardTablet(1600, 160);
adminTablet(1020, 2280, 0, "Resumen");
adminTablet(1020, 2990, 1, "Pagos pendientes");
adminTablet(1600, 2060, 2, "Ayuda recibida");
adminTablet(1600, 2770, 3, "Reseñas");
adminTablet(1600, 3480, 4, "Usuarios bloqueados");

add(`</svg>`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, s.join("\n"), "utf8");
fs.copyFileSync(out, downloadsOut);
console.log(out);
console.log(downloadsOut);
