/* ==========================================================================
   Art kit - outlined cartoon primitives, palette, glow sprites, text
   ========================================================================== */
const PAL = {
  out: '#26180f', parchment: '#e8dcc0', sepia: '#4a3826',
  night: '#10152a', night2: '#1d2542', night3: '#2c3660', moon: '#e4ebf5', moonlight: '#9fb4d8',
  torch: '#f2a541', fire1: '#ffe08a', fire2: '#f2802e', fire3: '#b8321e',
  crimson: '#a3241c', gold: '#c08f2a', indigo: '#3b3f8c',
  ink: '#1c1f3a', inkHi: '#55609e', holy: '#ffe9a8', necro: '#7bd389', frost: '#a8e6ff',
  poison: '#8fd14f', hex: '#b06ad8', blood: '#8e1b18',
  steel: '#aab5c3', steelDark: '#6c7684', iron: '#5a5f69', wood: '#7a5233', woodDark: '#4e3420', leather: '#6b4527',
  grass: '#2c4630', grassDark: '#1c2e22', dirt: '#463828', stone: '#5d5f69', stoneDark: '#3a3c46', bone: '#e6dfcc',
  goblin: '#86a64c', goblinDark: '#58722f',
};
const SKINS = ['#f3d2b5', '#e2b48c', '#c98d5f', '#9a6440', '#6a4027', '#d9cfc4'];
const HAIRS = ['#1f1714', '#4a2e1c', '#8c5a2b', '#c9a15a', '#e6e0d2', '#7a1f1b', '#2d3550', '#5b5f66'];
const HAIR_STYLES = ['spiky', 'mop', 'long', 'pony', 'braid', 'wild', 'bald'];

let LINE = 2.7;
let TINT_C = '#ffffff', TINT_A = 0;
function C(hex) { return TINT_A > 0.01 ? mix(hex, TINT_C, TINT_A) : hex; }
function setTint(c, a) { TINT_C = c || '#ffffff'; TINT_A = a || 0; }

function ink(ctx, fill, lw) {
  if (fill) { ctx.fillStyle = C(fill); ctx.fill(); }
  if (lw !== 0) { ctx.lineWidth = lw == null ? LINE : lw; ctx.strokeStyle = PAL.out; ctx.stroke(); }
}
function circ(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); }
function ell(ctx, x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, Math.abs(rx)), Math.max(0.1, Math.abs(ry)), rot || 0, 0, TAU); }
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function poly(ctx, pts, open) {
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  if (!open) ctx.closePath();
}
function cap(ctx, x1, y1, x2, y2, r) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.arc(x1, y1, r, a + Math.PI / 2, a - Math.PI / 2);
  ctx.arc(x2, y2, r, a - Math.PI / 2, a + Math.PI / 2);
  ctx.closePath();
}
/* 2010-style soft shading: base fill, a soft core shadow and a key-light highlight
   (cached radial sprites, clipped to the shape), then the outline */
const _shadeSpr = {};
function shadeSprite(kind) {
  if (_shadeSpr[kind]) return _shadeSpr[kind];
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (kind === 'hi') { grd.addColorStop(0, 'rgba(255,246,226,0.95)'); grd.addColorStop(0.5, 'rgba(255,246,226,0.35)'); grd.addColorStop(1, 'rgba(255,246,226,0)'); }
  else { grd.addColorStop(0, 'rgba(24,10,22,0.95)'); grd.addColorStop(0.55, 'rgba(24,10,22,0.6)'); grd.addColorStop(1, 'rgba(24,10,22,0)'); }
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return (_shadeSpr[kind] = c);
}
function band(ctx, build, fill, ox, oy, rr2, amt) {
  build(); ctx.fillStyle = C(fill); ctx.fill();
  ctx.save(); ctx.clip();
  const a = ctx.globalAlpha;
  ctx.globalAlpha = a * Math.min(0.9, (amt == null ? 0.22 : amt) * 2.6);
  ctx.drawImage(shadeSprite('lo'), ox - rr2 * 1.6, oy - rr2 * 1.6, rr2 * 3.2, rr2 * 3.2);
  const lx = ox + rr2 * 1.15, ly = oy - rr2 * 1.65;
  ctx.globalAlpha = a * 0.42;
  ctx.drawImage(shadeSprite('hi'), lx - rr2, ly - rr2, rr2 * 2, rr2 * 2);
  ctx.globalAlpha = a;
  ctx.restore();
  build(); ctx.lineWidth = LINE; ctx.strokeStyle = PAL.out; ctx.stroke();
}
/* glossy specular streak for metal and glass */
function sheen(ctx, x, y, w, h, rot, a) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
  ctx.globalAlpha *= (a == null ? 0.55 : a);
  ctx.drawImage(shadeSprite('hi'), -w / 2, -h / 2, w, h);
  ctx.restore();
}
function shadowBlob(ctx, x, y, rx, a) {
  ctx.fillStyle = `rgba(0,0,0,${a == null ? 0.32 : a})`;
  ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.32, 0, 0, TAU); ctx.fill();
}

/* ---- glow sprites (cached radial gradients) ---- */
const _glowCache = new Map();
function glowSprite(color) {
  let c = _glowCache.get(color);
  if (c) return c;
  c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, alpha(color, 1)); grd.addColorStop(0.25, alpha(color, 0.55));
  grd.addColorStop(0.6, alpha(color, 0.14)); grd.addColorStop(1, alpha(color, 0));
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  _glowCache.set(color, c);
  return c;
}
function glow(ctx, x, y, r, color, a) {
  if (r <= 0 || a <= 0) return;
  const pa = ctx.globalAlpha, op = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = pa * clamp(a, 0, 1);
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = pa; ctx.globalCompositeOperation = op;
}

/* ---- text ---- */
const FONT_DISPLAY = '"Grenze Gotisch", "Grenze", Georgia, serif';
const FONT_BOOK = '"IM Fell English", Georgia, serif';
function otext(ctx, str, x, y, size, fill, opts) {
  opts = opts || {};
  ctx.font = `${opts.weight || 800} ${size}px ${opts.font || FONT_DISPLAY}`;
  ctx.textAlign = opts.align || 'center'; ctx.textBaseline = opts.base || 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2, size * (opts.stroke || 0.2));
  ctx.strokeStyle = opts.strokeColor || '#140c08';
  ctx.strokeText(str, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
}

/* ---- tiny helpers for scenery ---- */
function grad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
function wobblePath(ctx, x0, x1, y, amp, seed, step) {
  const r = mulberry32(seed);
  ctx.moveTo(x0, y);
  for (let x = x0; x <= x1 + step; x += step) ctx.lineTo(x, y - r() * amp);
}
