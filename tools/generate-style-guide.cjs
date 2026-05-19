const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "design", "sportbook-guia-estilo.svg");
const downloadsOut = path.join(process.env.USERPROFILE || root, "Downloads", "SportBook guia de estilo.svg");

const W = 1920;
const H = 1680;
const C = {
  bg: "#0f0f0f",
  black: "#050505",
  soft: "#111111",
  panel: "#1f1f1f",
  panel2: "#262626",
  line: "#333333",
  text: "#ffffff",
  muted: "#cccccc",
  accent: "#ffcc00",
  accentHover: "#ffd633",
  danger: "#ff6b5f",
  success: "#45d483",
  board: "#626262",
};

const s = [];
const add = (v) => s.push(v);
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rect = (x, y, w, h, fill, stroke = "none", rx = 0) => add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`);
const text = (x, y, value, size, fill = C.text, weight = 700, anchor = "start") => add(`<text x="${x}" y="${y}" fill="${fill}" font-family="Poppins, Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`);
const line = (x1, y1, x2, y2, color = C.line, sw = 2) => add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`);

function card(x, y, w, h, title) {
  rect(x, y, w, h, C.panel, C.line, 14);
  text(x + 28, y + 48, title, 26, C.text, 900);
  line(x + 28, y + 70, x + w - 28, y + 70, "rgba(255,204,0,0.3)", 2);
}
function pill(x, y, label, fill, color = "#111111") {
  rect(x, y, 112, 34, fill, fill, 17);
  text(x + 56, y + 23, label, 13, color, 900, "middle");
}
function swatch(x, y, label, hex) {
  rect(x, y, 118, 118, hex, C.line, 14);
  text(x, y + 152, label, 18, C.text, 900);
  text(x, y + 178, hex, 16, C.muted, 600);
}
function input(x, y, label, state = "normal") {
  const stroke = state === "error" ? C.danger : state === "focus" ? C.accent : C.line;
  rect(x, y, 260, 50, "#0b0b0b", stroke, 6);
  text(x + 16, y + 31, label, 15, state === "disabled" ? "#777777" : C.muted, 600);
}
function button(x, y, label, type = "primary") {
  if (type === "primary") {
    rect(x, y, 210, 50, C.accent, C.accent, 7);
    text(x + 105, y + 32, label, 16, "#111111", 900, "middle");
  } else if (type === "hover") {
    rect(x, y, 210, 50, C.accentHover, C.accentHover, 7);
    text(x + 105, y + 32, label, 16, "#111111", 900, "middle");
  } else if (type === "danger") {
    rect(x, y, 210, 50, "rgba(255,107,95,0.18)", C.danger, 7);
    text(x + 105, y + 32, label, 16, C.text, 900, "middle");
  } else {
    rect(x, y, 210, 50, "transparent", C.line, 7);
    text(x + 105, y + 32, label, 16, C.text, 900, "middle");
  }
}
function iconBox(x, y, label, symbol) {
  rect(x, y, 120, 112, C.panel2, C.line, 10);
  rect(x + 36, y + 18, 48, 48, C.accent, C.accent, 12);
  text(x + 60, y + 51, symbol, 22, "#111111", 900, "middle");
  text(x + 60, y + 91, label, 13, C.text, 800, "middle");
}

add(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">`);
rect(0, 0, W, H, "#b6b6b6");
rect(44, 44, W - 88, H - 88, C.board);
rect(84, 84, W - 168, H - 168, C.bg, "none", 0);

rect(84, 84, W - 168, 152, C.black);
rect(122, 122, 56, 56, C.accent, C.accent, 14);
text(150, 158, "SB", 17, "#111111", 900, "middle");
text(198, 158, "SportBook", 34, C.accent, 900);
text(122, 210, "Guía de estilo y sistema de diseño", 42, C.text, 900);
text(1180, 156, "Proyecto Jakarta EE · Reservas deportivas", 20, C.muted, 700);

card(122, 290, 760, 390, "Paleta de colores");
[
  ["Negro", C.bg],
  ["Cabecera", C.black],
  ["Panel", C.panel],
  ["Panel suave", C.panel2],
  ["Borde", C.line],
  ["Texto", C.text],
  ["Texto gris", C.muted],
  ["SportBook", C.accent],
  ["Hover", C.accentHover],
  ["Error", C.danger],
  ["Éxito", C.success],
].forEach(([label, hex], i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  swatch(156 + col * 118, 390 + row * 190, label, hex);
});

card(930, 290, 828, 390, "Tipografías y jerarquías");
text(966, 388, "Poppins / Segoe UI / Arial", 24, C.accent, 900);
text(966, 465, "H1 · SportBook", 58, C.text, 900);
text(966, 530, "H2 · Elige tu deporte y guarda tu plaza", 32, C.text, 900);
text(966, 585, "H3 · Completa tus datos", 24, C.text, 900);
text(966, 632, "Texto normal para formularios, tarjetas y paneles.", 18, C.muted, 600);
pill(1482, 594, "Etiqueta", "rgba(255,204,0,0.12)", C.accent);

card(122, 740, 760, 412, "Formularios y controles");
text(158, 836, "Campos", 20, C.accent, 900);
input(158, 870, "Nombre completo");
input(158, 940, "tu@gmail.com", "focus");
input(158, 1010, "Contraseña", "error");
text(440, 836, "Botones", 20, C.accent, 900);
button(440, 870, "Reservar y pagar");
button(440, 940, "Iniciar sesión", "secondary");
button(440, 1010, "Cerrar sesión", "danger");
text(158, 1108, "Los formularios usan fondo oscuro, borde gris y foco amarillo.", 17, C.muted, 600);

card(930, 740, 828, 412, "Componentes visuales e iconografía");
iconBox(970, 838, "Usuario", "U");
iconBox(1115, 838, "Reserva", "R");
iconBox(1260, 838, "Pago", "€");
iconBox(1405, 838, "Ayuda", "?");
iconBox(1550, 838, "Admin", "A");
rect(970, 1000, 340, 100, C.panel2, C.line, 10);
text(1000, 1043, "Tarjeta de información", 22, C.text, 900);
text(1000, 1075, "Fondo #262626, borde #333333.", 16, C.muted, 600);
rect(1348, 1000, 340, 100, C.panel2, C.line, 10);
text(1378, 1043, "Panel administrador", 22, C.text, 900);
text(1378, 1075, "Tablas, filtros y acciones.", 16, C.muted, 600);

card(122, 1210, 1636, 310, "Estados de la interfaz");
[
  ["Normal", "Elemento en reposo", C.panel2, C.line, C.text],
  ["Hover", "Amarillo más claro", C.accentHover, C.accentHover, "#111111"],
  ["Activo", "Sección seleccionada", C.accent, C.accent, "#111111"],
  ["Error", "Campo incorrecto", "rgba(255,107,95,0.16)", C.danger, C.text],
  ["Éxito", "Acción completada", C.success, C.success, "#111111"],
  ["Vacío", "Sin datos todavía", "#151515", C.line, C.muted],
].forEach(([name, desc, fill, stroke, color], i) => {
  const x = 164 + i * 260;
  rect(x, 1320, 210, 92, fill, stroke, 10);
  text(x + 22, 1360, name, 20, color, 900);
  text(x + 22, 1388, desc, 14, color === "#111111" ? "#111111" : C.muted, 700);
});
text(158, 1475, "Uso: amarillo para marca y acciones principales; rojo para peligro; verde para confirmaciones; gris para estados vacíos.", 18, C.muted, 600);

add("</svg>");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, s.join("\n"), "utf8");
fs.copyFileSync(out, downloadsOut);
console.log(out);
console.log(downloadsOut);
