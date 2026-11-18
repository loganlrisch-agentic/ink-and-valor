'use strict';
/* ==========================================================================
   Ink & Valor - core helpers
   ========================================================================== */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const invLerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1);
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
const angleTo = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);
const sign = (v) => (v < 0 ? -1 : 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const deepClone = (o) => JSON.parse(JSON.stringify(o));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k));
  return n;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---- colour ---- */
const _hexCache = new Map();
function hexToRgb(h) {
  let c = _hexCache.get(h);
  if (c) return c;
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((x) => x + x).join('');
  c = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  _hexCache.set(h, c);
  return c;
}
function rgbStr(r, g, b, a) { return a == null || a >= 1 ? `rgb(${r | 0},${g | 0},${b | 0})` : `rgba(${r | 0},${g | 0},${b | 0},${a})`; }
const _mixCache = new Map();
function mix(a, b, t) {
  if (t <= 0) return a; if (t >= 1) return b;
  const key = a + b + ((t * 50) | 0);
  let v = _mixCache.get(key);
  if (v) return v;
  const A = hexToRgb(a), B = hexToRgb(b), q = ((t * 50) | 0) / 50;
  v = rgbStr(A[0] + (B[0] - A[0]) * q, A[1] + (B[1] - A[1]) * q, A[2] + (B[2] - A[2]) * q);
  if (_mixCache.size > 4000) _mixCache.clear();
  _mixCache.set(key, v);
  return v;
}
function shade(hex, amt) { return amt < 0 ? mix(hex, '#000000', -amt) : mix(hex, '#ffffff', amt); }
function alpha(hex, a) { const c = hexToRgb(hex); return rgbStr(c[0], c[1], c[2], a); }

/* deterministic rng for scenery */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* tiny event bus */
const Bus = (() => {
  const m = {};
  return {
    on(ev, fn) { (m[ev] = m[ev] || []).push(fn); },
    emit(ev, d) { (m[ev] || []).forEach((fn) => { try { fn(d); } catch (e) { console.error(e); } }); },
  };
})();

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
