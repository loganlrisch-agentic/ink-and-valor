/* ==========================================================================
   Scenes - painted night backgrounds, lights, ambient fx
   Logical canvas is W x 600. The walkable ground runs from y=330 to 528.
   ========================================================================== */
const GROUND_TOP = 330, GROUND_BOT = 528;

/* ---------------- painting kit ---------------- */
const K = {
  sky(ctx, W, stops) { ctx.fillStyle = grad(ctx, 0, 0, 0, 340, stops); ctx.fillRect(0, 0, W, 600); },
  stars(ctx, W, h, n, seed) {
    const r = mulberry32(seed);
    for (let i = 0; i < n; i++) { const x = r() * W, y = r() * h, s = r(); ctx.fillStyle = `rgba(230,236,255,${0.25 + s * 0.6})`; ctx.fillRect(x, y, s > 0.9 ? 2 : 1.2, s > 0.9 ? 2 : 1.2); }
  },
  moon(ctx, x, y, r, col) {
    glow(ctx, x, y, r * 6, col || '#9fb4d8', 0.35);
    circ(ctx, x, y, r); ctx.fillStyle = col || PAL.moon; ctx.fill();
    ctx.fillStyle = 'rgba(150,165,195,0.45)';
    circ(ctx, x - r * 0.3, y - r * 0.2, r * 0.22); ctx.fill(); circ(ctx, x + r * 0.35, y + r * 0.25, r * 0.15); ctx.fill(); circ(ctx, x + r * 0.1, y - r * 0.45, r * 0.1); ctx.fill();
  },
  clouds(ctx, W, y, col, seed, a) {
    const r = mulberry32(seed);
    ctx.fillStyle = alpha(col, a == null ? 0.6 : a);
    for (let i = 0; i < 7; i++) { const cx = r() * W, cy = y + r() * 40, w = 120 + r() * 200; ell(ctx, cx, cy, w, 14 + r() * 12, 0); ctx.fill(); ell(ctx, cx + w * 0.3, cy - 8, w * 0.5, 12, 0); ctx.fill(); }
  },
  hills(ctx, W, y, amp, col, seed, step, line) {
    const r = mulberry32(seed);
    ctx.beginPath(); ctx.moveTo(-10, 600); ctx.lineTo(-10, y);
    let px = -10, py = y;
    for (let x = -10; x <= W + step; x += step) { const ny = y - r() * amp; ctx.quadraticCurveTo(px + step / 2, Math.min(py, ny) - amp * 0.25, x, ny); px = x; py = ny; }
    ctx.lineTo(W + 10, 600); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    if (line) { ctx.lineWidth = line; ctx.strokeStyle = 'rgba(20,14,12,0.6)'; ctx.stroke(); }
  },
  treeline(ctx, W, y, col, seed, h, dens) {
    const r = mulberry32(seed);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, 600); ctx.lineTo(-10, y);
    for (let x = -10; x < W + 30; x += 10 + r() * (dens || 18)) { const th = h * (0.5 + r() * 0.7); ctx.lineTo(x, y - th * 0.4); ctx.lineTo(x + 6, y - th); ctx.lineTo(x + 12, y - th * 0.35); }
    ctx.lineTo(W + 10, y); ctx.lineTo(W + 10, 600); ctx.closePath(); ctx.fill();
  },
  deadTree(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.quadraticCurveTo(-5, -50, -14, -100); ctx.lineTo(-6, -100); ctx.quadraticCurveTo(2, -60, 9, 0); ctx.closePath();
    ink(ctx, col || '#241c1a', 3);
    const br = [[-10, -70, -48, -96], [-12, -92, -30, -130], [-8, -96, 18, -128], [-4, -60, 30, -84], [-12, -40, -40, -52]];
    for (const [ax, ay, bx, by] of br) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + bx) / 2, ay - 18, bx, by); ctx.lineWidth = 7; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = col || '#241c1a'; ctx.stroke(); }
    ctx.restore();
  },
  gnarled(ctx, x, y, s, trunk, leaf, seed) {
    const r = mulberry32(seed || 7);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-14, 0); ctx.bezierCurveTo(-6, -30, -18, -60, -8, -95); ctx.lineTo(8, -95); ctx.bezierCurveTo(14, -60, 4, -30, 16, 0); ctx.closePath(); ink(ctx, trunk || '#2a211c', 3);
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, d = 30 + r() * 30; circ(ctx, Math.cos(a) * d, -100 + Math.sin(a) * d * 0.6, 26 + r() * 16); ink(ctx, shade(leaf || '#1f3326', (r() - 0.5) * 0.15), 3); }
    ctx.restore();
  },
  pine(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(ctx, -4, -16, 8, 18, 2); ink(ctx, '#2a1f1a', 2.6);
    for (let i = 0; i < 4; i++) { const w = 30 - i * 6, yy = -14 - i * 22; poly(ctx, [-w, yy, 0, yy - 36, w, yy]); ink(ctx, shade(col || '#1d3324', i * 0.04), 2.6); }
    ctx.restore();
  },
  ground(ctx, W, y0, c0, c1) { ctx.fillStyle = grad(ctx, 0, y0, 0, 600, [[0, c0], [1, c1]]); ctx.fillRect(0, y0, W, 600 - y0); },
  road(ctx, W, col) {
    ctx.beginPath(); ctx.moveTo(W * 0.42, GROUND_TOP - 6); ctx.lineTo(W * 0.58, GROUND_TOP - 6); ctx.lineTo(W * 0.9, 600); ctx.lineTo(W * 0.1, 600); ctx.closePath();
    ctx.fillStyle = col || '#4c3f30'; ctx.fill();
  },
  tufts(ctx, rng, x0, x1, y0, y1, n, col) {
    ctx.strokeStyle = col || '#3d5a3b'; ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) { const x = x0 + rng() * (x1 - x0), y = y0 + rng() * (y1 - y0), h = 5 + rng() * 8; ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 2, y - h); ctx.moveTo(x, y); ctx.lineTo(x + 1, y - h * 1.2); ctx.moveTo(x + 4, y); ctx.lineTo(x + 5, y - h * 0.8); ctx.stroke(); }
  },
  pebbles(ctx, rng, x0, x1, y0, y1, n, col) {
    for (let i = 0; i < n; i++) { const x = x0 + rng() * (x1 - x0), y = y0 + rng() * (y1 - y0); ell(ctx, x, y, 2 + rng() * 4, 1.5 + rng() * 2, 0); ctx.fillStyle = col || 'rgba(0,0,0,0.25)'; ctx.fill(); }
  },
  rock(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly(ctx, [-20, 0, -16, -14, -4, -20, 12, -16, 20, -4, 18, 0]); ink(ctx, col || PAL.stone, 3); ctx.beginPath(); ctx.moveTo(-6, -15); ctx.lineTo(4, -8); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.stroke(); ctx.restore(); },
  stone(ctx, x, y, w, h, col, lean) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(lean || 0);
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + 3, -h + 8); ctx.quadraticCurveTo(0, -h - 6, w / 2 - 3, -h + 6); ctx.lineTo(w / 2, 0); ctx.closePath(); ink(ctx, col || '#5a5c66', 3);
    ctx.beginPath(); ctx.moveTo(-w / 4, -h * 0.6); ctx.lineTo(0, -h * 0.4); ctx.moveTo(w / 6, -h * 0.75); ctx.lineTo(w / 4, -h * 0.5); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.stroke();
    ctx.restore();
  },
  house(ctx, x, y, w, h, o) {
    o = o || {};
    const sk = o.sketch;
    ctx.save();
    if (sk) { ctx.setLineDash([5, 4]); }
    const out = sk ? 'rgba(120,110,95,0.85)' : PAL.out;
    const fill = (c) => (sk ? 'rgba(232,220,192,0.18)' : c);
    // wall
    rr(ctx, x - w / 2, y - h, w, h, 3); ctx.fillStyle = fill(o.wall || '#6e5a48'); ctx.fill(); ctx.lineWidth = sk ? 1.6 : 3; ctx.strokeStyle = out; ctx.stroke();
    if (!sk) { ctx.beginPath(); ctx.moveTo(x - w / 2, y - h * 0.55); ctx.lineTo(x + w / 2, y - h * 0.55); ctx.moveTo(x - w / 4, y - h); ctx.lineTo(x - w / 4, y); ctx.moveTo(x + w / 4, y - h); ctx.lineTo(x + w / 4, y); ctx.lineWidth = 4; ctx.strokeStyle = o.timber || '#3a2a20'; ctx.stroke(); }
    // roof
    poly(ctx, [x - w / 2 - 12, y - h + 2, x, y - h - w * 0.55, x + w / 2 + 12, y - h + 2]); ctx.fillStyle = fill(o.roof || '#3e2a2a'); ctx.fill(); ctx.lineWidth = sk ? 1.6 : 3; ctx.strokeStyle = out; ctx.stroke();
    if (o.chimney) { rr(ctx, x + w * 0.2, y - h - w * 0.5, 12, 26, 2); ctx.fillStyle = fill('#4a3a34'); ctx.fill(); ctx.stroke(); }
    // windows + door
    const winC = o.lit ? '#f2b552' : '#1a1a24';
    rr(ctx, x - w * 0.36, y - h * 0.48, w * 0.2, h * 0.24, 2); ctx.fillStyle = sk ? 'transparent' : winC; ctx.fill(); ctx.lineWidth = sk ? 1.4 : 2.4; ctx.stroke();
    rr(ctx, x + w * 0.1, y - h * 0.42, w * 0.22, h * 0.42, 3); ctx.fillStyle = fill('#2e2018'); ctx.fill(); ctx.stroke();
    if (sk) { ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x - w / 2 + 4, y - 4); ctx.lineTo(x - w / 2 + 18, y - h + 10); ctx.moveTo(x + w / 2 - 20, y - 4); ctx.lineTo(x + w / 2 - 6, y - h * 0.5); ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(120,110,95,0.6)'; ctx.stroke(); }
    ctx.restore();
  },
  lamppost(ctx, x, y) {
    rr(ctx, x - 2.5, y - 70, 5, 70, 2); ink(ctx, '#2a2a30', 2.4);
    rr(ctx, x - 2, y - 74, 22, 4, 1); ink(ctx, '#2a2a30', 2.2);
    rr(ctx, x + 12, y - 70, 12, 15, 3); ink(ctx, '#f6c46a', 2.2);
  },
  well(ctx, x, y) {
    rr(ctx, x - 26, y - 22, 52, 22, 4); ink(ctx, '#5a5c66');
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 26 + i * 14, y - 22); ctx.lineTo(x - 26 + i * 14, y); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.stroke(); }
    rr(ctx, x - 24, y - 64, 5, 44, 2); ink(ctx, PAL.wood, 2.4); rr(ctx, x + 19, y - 64, 5, 44, 2); ink(ctx, PAL.wood, 2.4);
    poly(ctx, [x - 32, y - 60, x, y - 80, x + 32, y - 60]); ink(ctx, '#3e2a2a');
  },
  grave(ctx, x, y, s, kind, lean) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(lean || 0);
    if (kind === 'cross') { rr(ctx, -3.5, -40, 7, 40, 1.5); ink(ctx, '#4b4d57', 2.6); rr(ctx, -13, -31, 26, 7, 1.5); ink(ctx, '#4b4d57', 2.6); }
    else { ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(-11, -22); ctx.arc(0, -22, 11, Math.PI, 0); ctx.lineTo(11, 0); ctx.closePath(); ink(ctx, '#575964', 2.6); ctx.beginPath(); ctx.moveTo(-5, -24); ctx.lineTo(5, -24); ctx.moveTo(-5, -18); ctx.lineTo(4, -18); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.stroke(); }
    ctx.restore();
  },
  mound(ctx, x, y, w, open) { ell(ctx, x, y, w, 9, 0); ink(ctx, open ? '#1c1410' : '#3d3226', 2.4); if (open) { ell(ctx, x, y - 1, w * 0.7, 5, 0); ctx.fillStyle = '#0a0806'; ctx.fill(); } },
  church(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(ctx, -60, -90, 120, 90, 2); ink(ctx, col || '#2e3040');
    poly(ctx, [-70, -88, 0, -140, 70, -88]); ink(ctx, shade(col || '#2e3040', -0.1));
    rr(ctx, 30, -190, 34, 110, 2); ink(ctx, col || '#2e3040'); poly(ctx, [26, -188, 47, -240, 68, -188]); ink(ctx, shade(col || '#2e3040', -0.1));
    rr(ctx, 44, -262, 6, 26, 1); ink(ctx, '#2e3040', 2); rr(ctx, 39, -254, 16, 5, 1); ink(ctx, '#2e3040', 2);
    ctx.beginPath(); ctx.moveTo(-14, -40); ctx.lineTo(-14, -60); ctx.arc(0, -60, 14, Math.PI, 0); ctx.lineTo(14, -40); ctx.closePath(); ink(ctx, '#d79a4a', 2.4);
    ctx.restore();
  },
  planks(ctx, W, y0, y1, col) {
    ctx.fillStyle = col; ctx.fillRect(0, y0, W, y1 - y0);
    const r = mulberry32(3);
    for (let x = 0; x < W; x += 34) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.stroke(); ctx.fillStyle = `rgba(255,220,180,${r() * 0.05})`; ctx.fillRect(x + 2, y0, 30, y1 - y0); }
  },
  stoneWall(ctx, W, y0, y1, col, seed) {
    ctx.fillStyle = col; ctx.fillRect(0, y0, W, y1 - y0);
    const r = mulberry32(seed || 11);
    for (let y = y0; y < y1; y += 26) {
      const off = ((y - y0) / 26) % 2 ? 22 : 0;
      for (let x = -off; x < W; x += 44 + r() * 10) { rr(ctx, x + 2, y + 2, 40, 22, 4); ctx.fillStyle = shade(col, (r() - 0.5) * 0.18); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(10,8,8,0.55)'; ctx.stroke(); }
    }
  },
  floor(ctx, W, y0, col, lines) {
    ctx.fillStyle = grad(ctx, 0, y0, 0, 600, [[0, shade(col, 0.06)], [1, shade(col, -0.25)]]); ctx.fillRect(0, y0, W, 600 - y0);
    if (lines) for (let y = y0 + 20, i = 0; y < 600; y += 18 + i * 6, i++) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.stroke(); }
  },
  barrel(ctx, x, y, s, label) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.quadraticCurveTo(-21, -22, -16, -44); ctx.lineTo(16, -44); ctx.quadraticCurveTo(21, -22, 16, 0); ctx.closePath(); ink(ctx, '#6a4528');
    for (const yy of [-8, -36]) { ctx.beginPath(); ctx.moveTo(-18, yy); ctx.lineTo(18, yy); ctx.lineWidth = 4; ctx.strokeStyle = '#3a3a40'; ctx.stroke(); }
    ell(ctx, 0, -44, 16, 4, 0); ink(ctx, '#7a5233', 2.4);
    if (label) { ctx.fillStyle = '#e8dcc0'; ctx.font = `700 7px ${FONT_BOOK}`; ctx.textAlign = 'center'; ctx.fillText(label, 0, -20); }
    ctx.restore();
  },
  crate(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -18, -34, 36, 34, 2); ink(ctx, '#7a5a3a'); ctx.beginPath(); ctx.moveTo(-18, -34); ctx.lineTo(18, 0); ctx.moveTo(18, -34); ctx.lineTo(-18, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#4e3420'; ctx.stroke(); ctx.restore(); },
  table(ctx, x, y, w) { rr(ctx, x - w / 2, y - 30, w, 8, 2); ink(ctx, '#5a3c26'); rr(ctx, x - w / 2 + 6, y - 24, 6, 24, 1); ink(ctx, '#4a3020', 2.4); rr(ctx, x + w / 2 - 12, y - 24, 6, 24, 1); ink(ctx, '#4a3020', 2.4); },
  bottle(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-8, -10, -3, -14); ctx.lineTo(-3, -20); ctx.lineTo(3, -20); ctx.lineTo(3, -14); ctx.quadraticCurveTo(8, -10, 6, 0); ctx.closePath(); ink(ctx, col, 2); rr(ctx, -3.5, -24, 7, 4, 1); ink(ctx, '#7a5233', 1.6); ctx.restore(); },
  shelf(ctx, x, y, w, rows, seed) {
    const r = mulberry32(seed || 5), cols = ['#7bd389', '#c94a3a', '#6aa7e0', '#d8b04a', '#b06ad8', '#e8dcc0'];
    for (let i = 0; i < rows; i++) { const yy = y + i * 46; rr(ctx, x - w / 2, yy, w, 6, 1); ink(ctx, '#4a3020', 2.4); for (let bx = x - w / 2 + 10; bx < x + w / 2 - 8; bx += 14 + r() * 8) K.bottle(ctx, bx, yy, 0.8 + r() * 0.4, cols[(r() * cols.length) | 0]); }
  },
  window(ctx, x, y, w, h, col, gothic) {
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h + w / 2);
    if (gothic) { ctx.quadraticCurveTo(x - w / 2, y - h, x, y - h - w * 0.3); ctx.quadraticCurveTo(x + w / 2, y - h, x + w / 2, y - h + w / 2); }
    else ctx.arc(x, y - h + w / 2, w / 2, Math.PI, 0);
    ctx.lineTo(x + w / 2, y); ctx.closePath(); ink(ctx, col || '#3a5a8a', 3);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h - 4); ctx.moveTo(x - w / 2, y - h * 0.45); ctx.lineTo(x + w / 2, y - h * 0.45); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.out; ctx.stroke();
  },
  tent(ctx, x, y, w, h, col) {
    poly(ctx, [x - w / 2, y, x - w * 0.1, y - h, x + w * 0.1, y - h, x + w / 2, y]); ink(ctx, col || '#6b4a32');
    poly(ctx, [x - w * 0.12, y, x, y - h * 0.62, x + w * 0.12, y]); ctx.fillStyle = '#140d0a'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.out; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - w * 0.1, y - h); ctx.lineTo(x - w * 0.18, y - h - 16); ctx.moveTo(x + w * 0.1, y - h); ctx.lineTo(x + w * 0.2, y - h - 14); ctx.lineWidth = 3; ctx.strokeStyle = '#3a2a1c'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - w * 0.3, y - h * 0.4); ctx.lineTo(x - w * 0.2, y - h * 0.55); ctx.moveTo(x + w * 0.28, y - h * 0.3); ctx.lineTo(x + w * 0.36, y - h * 0.18); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.stroke();
  },
  palisade(ctx, x0, x1, y, h, seed) {
    const r = mulberry32(seed || 9);
    for (let x = x0; x < x1; x += 15) { const hh = h * (0.85 + r() * 0.25); poly(ctx, [x, y, x, y - hh, x + 7, y - hh - 12, x + 14, y - hh, x + 14, y]); ink(ctx, shade('#5a4030', (r() - 0.5) * 0.2), 2.6); }
    ctx.beginPath(); ctx.moveTo(x0, y - h * 0.35); ctx.lineTo(x1, y - h * 0.35); ctx.lineWidth = 4; ctx.strokeStyle = '#3a2a1c'; ctx.stroke();
  },
  banner(ctx, x, y, h, col, t) {
    rr(ctx, x - 2.5, y - h, 5, h, 2); ink(ctx, PAL.woodDark, 2.4);
    const sw = Math.sin((t || 0) * 2) * 3;
    poly(ctx, [x + 2, y - h + 4, x + 34 + sw, y - h + 8, x + 30 + sw, y - h + 40, x + 18 + sw, y - h + 32, x + 2, y - h + 44]); ink(ctx, col || '#7a1f1b', 2.6);
    circ(ctx, x + 18 + sw * 0.6, y - h + 22, 6); ctx.fillStyle = '#e6dfcc'; ctx.fill();
  },
  skullPole(ctx, x, y) { rr(ctx, x - 2.5, y - 60, 5, 60, 2); ink(ctx, PAL.woodDark, 2.4); band(ctx, () => circ(ctx, x, y - 66, 9), PAL.bone, x - 4, y - 60, 8, 0.15); circ(ctx, x - 3, y - 67, 2.4); ctx.fillStyle = PAL.out; ctx.fill(); circ(ctx, x + 4, y - 67, 2.4); ctx.fill(); },
  fgStrip(ctx, W, col, seed) {
    const r = mulberry32(seed || 21);
    ctx.fillStyle = col || '#0d120f';
    ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, 560);
    for (let x = 0; x <= W; x += 14) ctx.lineTo(x, 548 + r() * 22 - (r() > 0.9 ? 22 : 0));
    ctx.lineTo(W, 600); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, GROUND_BOT + 10, W, 600 - GROUND_BOT);
  },
  vignette(ctx, W, a) {
    const g = ctx.createRadialGradient(W / 2, 330, 200, W / 2, 330, W * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a == null ? 0.55 : a})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 600);
  },
};

/* --------------- ambient fx helpers (drawn every frame) --------------- */
const FX = {
  fog(ctx, W, t, y, col, a, speed) {
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 5; i++) {
      const x = ((t * (speed || 12) * (1 + i * 0.3) + i * 260) % (W + 400)) - 200;
      const img = glowSprite(col || '#8c9cc0');
      ctx.drawImage(img, x - 220, y - 40 + i * 10, 440, 90);
    }
    ctx.restore();
  },
  flame(ctx, x, y, s, t, seed) {
    const f = Math.sin(t * 13 + seed) * 0.12 + Math.sin(t * 23 + seed * 2) * 0.08;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + f));
    ctx.beginPath(); ctx.moveTo(-7, 0); ctx.quadraticCurveTo(-9, -12, 0, -26 + f * 10); ctx.quadraticCurveTo(9, -12, 7, 0); ctx.closePath(); ctx.fillStyle = PAL.fire2; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.quadraticCurveTo(-5, -8, 0, -17); ctx.quadraticCurveTo(5, -8, 4, 0); ctx.closePath(); ctx.fillStyle = PAL.fire1; ctx.fill();
    ctx.restore();
    glow(ctx, x, y - 10 * s, 40 * s, PAL.torch, 0.55);
  },
  torch(ctx, x, y, t, seed) { rr(ctx, x - 2.5, y - 56, 5, 56, 2); ink(ctx, PAL.woodDark, 2.2); rr(ctx, x - 5, y - 62, 10, 8, 2); ink(ctx, '#3a3a40', 2); FX.flame(ctx, x, y - 60, 0.9, t, seed); },
  candle(ctx, x, y, t, seed, h) { rr(ctx, x - 3, y - (h || 14), 6, h || 14, 1.5); ink(ctx, '#ece3cc', 1.8); FX.flame(ctx, x, y - (h || 14), 0.35, t, seed); },
  embers(ctx, W, t, x0, x1, y, n, col) {
    for (let i = 0; i < n; i++) {
      const life = (t * 0.35 + i / n) % 1, x = x0 + ((i * 97.3) % (x1 - x0)) + Math.sin(t * 2 + i) * 10, yy = y - life * 160;
      ctx.fillStyle = alpha(col || '#ffb04a', (1 - life) * 0.9); ctx.fillRect(x, yy, 2.2, 2.2);
    }
  },
  motes(ctx, W, t, n, col, y0, y1) {
    for (let i = 0; i < n; i++) {
      const x = (i * 131.7 + Math.sin(t * 0.4 + i) * 40 + t * 6) % W, y = y0 + ((i * 73.3) % (y1 - y0)) + Math.sin(t * 0.9 + i * 2) * 14;
      const a = 0.4 + Math.sin(t * 2 + i) * 0.35;
      glow(ctx, x, y, 7, col || '#c8ffd0', a * 0.6); ctx.fillStyle = alpha(col || '#e8fff0', a); ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  },
  smoke(ctx, x, y, t, n) {
    for (let i = 0; i < (n || 6); i++) {
      const life = (t * 0.18 + i / (n || 6)) % 1;
      ctx.fillStyle = `rgba(150,150,170,${0.18 * (1 - life)})`;
      circ(ctx, x + Math.sin(t + i) * 6 + life * 30, y - life * 120, 6 + life * 22); ctx.fill();
    }
  },
  water(ctx, W, y0, y1, t, col) {
    for (let i = 0; i < 26; i++) {
      const y = y0 + ((i * 37) % (y1 - y0)), x = ((i * 113 + t * (20 + (i % 5) * 8)) % (W + 80)) - 40;
      ctx.strokeStyle = alpha(col || '#9fb4d8', 0.25 + (i % 3) * 0.1); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18 + (i % 4) * 8, y); ctx.stroke();
    }
  },
  rain(ctx, W, t, a) {
    ctx.strokeStyle = `rgba(170,190,230,${a || 0.18})`; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 70; i++) { const x = (i * 53.7 + t * 90) % (W + 60), y = (i * 91.3 + t * 520) % 620 - 20; ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 16); }
    ctx.stroke();
  },
};

/* ------------------------------ scenes ------------------------------ */
const NIGHT_SKY = [[0, '#070a18'], [0.6, '#141c38'], [1, '#2a3459']];
const SCENES = {
  blank: {
    dark: 0, label: 'The Hundred-Path Tome',
    paint(ctx, W) {
      ctx.fillStyle = '#e8dcc0'; ctx.fillRect(0, 0, W, 600);
      const r = mulberry32(4);
      for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(90,60,30,${r() * 0.06})`; circ(ctx, r() * W, r() * 600, 20 + r() * 80); ctx.fill(); }
      ctx.strokeStyle = 'rgba(74,56,38,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(W / 2, 300, 170, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(W / 2, 300, 160, 0, TAU); ctx.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 160, 300 + Math.sin(a) * 160); ctx.lineTo(W / 2 + Math.cos(a) * 190, 300 + Math.sin(a) * 190); ctx.stroke(); }
    },
    fx(ctx, W, t) { drawTassel(ctx, W / 2, 300, 3.2, t); },
  },
  moor: {
    dark: 0.42, label: 'The Barrow Moor',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 260, 160, 2);
      K.moon(ctx, W * 0.78, 92, 34);
      K.clouds(ctx, W, 120, '#3a4670', 5, 0.45);
      K.hills(ctx, W, 270, 40, '#1a2236', 3, 120);
      for (let i = 0; i < 9; i++) { ctx.fillStyle = '#f2b552'; ctx.fillRect(W * 0.1 + i * 9 + (i % 3) * 3, 262 - (i % 2) * 4, 2.4, 2.4); }
      K.hills(ctx, W, 305, 26, '#222b3a', 8, 90);
      K.ground(ctx, W, GROUND_TOP - 20, '#2a3428', '#151c17');
      const r = mulberry32(12);
      K.tufts(ctx, r, 0, W, GROUND_TOP, GROUND_BOT, 70, '#3c5038');
      ell(ctx, W * 0.5, GROUND_TOP - 6, 150, 34, 0); ink(ctx, '#2e382c', 3);
      rr(ctx, W * 0.5 - 22, GROUND_TOP - 40, 44, 36, 6); ink(ctx, '#3a3c46');
      rr(ctx, W * 0.5 - 14, GROUND_TOP - 30, 28, 26, 4); ctx.fillStyle = '#05060c'; ctx.fill();
      for (const [dx, h, l] of [[-0.36, 92, -0.06], [-0.24, 70, 0.04], [0.22, 84, 0.05], [0.36, 64, -0.08]]) K.stone(ctx, W * 0.5 + dx * W, GROUND_TOP + 8, 30, h, '#4e505c', l);
      K.deadTree(ctx, W * 0.08, GROUND_TOP + 20, 1.1);
      K.deadTree(ctx, W * 0.93, GROUND_TOP + 30, 0.9);
      ell(ctx, W * 0.5, GROUND_TOP + 30, 60, 12, 0); ctx.fillStyle = 'rgba(20,24,52,0.9)'; ctx.fill();
      K.fgStrip(ctx, W, '#0a0f0c', 3);
    },
    lights(W) { return [{ x: W * 0.78, y: 92, r: 520, c: '#9fb4d8', a: 0.45 }, { x: W * 0.5, y: GROUND_TOP - 20, r: 120, c: '#6f7fff', a: 0.4, f: 1 }]; },
    fx(ctx, W, t) { FX.fog(ctx, W, t, GROUND_TOP + 10, '#7d8db8', 0.22, 9); FX.smoke(ctx, W * 0.12, 260, t, 5); FX.fog(ctx, W, t + 50, GROUND_BOT - 30, '#6d7db0', 0.16, 14); },
  },
  wood: {
    dark: 0.55, label: 'The Whisperwood',
    paint(ctx, W) {
      K.sky(ctx, W, [[0, '#05080f'], [1, '#141f24']]);
      K.treeline(ctx, W, 250, '#0e1714', 2, 160, 10);
      K.treeline(ctx, W, 300, '#122019', 5, 120, 14);
      K.ground(ctx, W, GROUND_TOP - 24, '#1d2a20', '#0d1410');
      const r = mulberry32(31);
      for (let i = 0; i < 5; i++) K.gnarled(ctx, (i + 0.5) * W / 5 + (r() - 0.5) * 60, GROUND_TOP + 4, 0.9 + r() * 0.4, '#231a16', '#16261d', i + 3);
      K.tufts(ctx, r, 0, W, GROUND_TOP, GROUND_BOT, 80, '#2c4230');
      rr(ctx, W * 0.5 + 60, GROUND_TOP + 18, 40, 26, 6); ink(ctx, '#4a3424'); ell(ctx, W * 0.5 + 80, GROUND_TOP + 18, 20, 6, 0); ink(ctx, '#7a5a3a', 2.4);
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(r() * W, 0); ctx.quadraticCurveTo(r() * W, 120, r() * W, 200 + r() * 60); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(40,60,46,0.6)'; ctx.stroke(); }
      K.fgStrip(ctx, W, '#060a08', 7);
    },
    lights(W) { return [{ x: W * 0.5, y: 120, r: 380, c: '#7fb0a0', a: 0.3 }]; },
    fx(ctx, W, t) { FX.motes(ctx, W, t, 26, '#c8ffd8', 120, 520); FX.fog(ctx, W, t, GROUND_TOP + 40, '#6a8a7a', 0.2, 7); },
  },
  village: {
    dark: 0.45, label: 'Quillsby Square',
    paint(ctx, W, opts) {
      const dawn = opts && opts.dawn;
      K.sky(ctx, W, dawn ? [[0, '#3a3a6a'], [0.55, '#d98a5a'], [1, '#f6d08a']] : NIGHT_SKY);
      if (!dawn) { K.stars(ctx, W, 220, 120, 8); K.moon(ctx, W * 0.15, 80, 26); }
      else { glow(ctx, W * 0.5, 320, 420, '#ffd27a', 0.8); circ(ctx, W * 0.5, 300, 46); ctx.fillStyle = '#fff1c4'; ctx.fill(); }
      K.hills(ctx, W, 270, 30, dawn ? '#5a4a5e' : '#161d30', 4, 110);
      const cx = W / 2, sk = !dawn;
      const houses = [[-0.42, 120, 110, false], [-0.27, 100, 90, sk], [-0.12, 130, 118, false], [0.13, 110, 100, false], [0.29, 96, 120, sk], [0.44, 120, 104, false]];
      for (const [dx, w, h, s2] of houses) K.house(ctx, cx + dx * W, GROUND_TOP + 4, w, h, { sketch: s2, lit: !s2, chimney: !s2, roof: dawn ? '#7a3a2e' : '#3a2828', wall: dawn ? '#9a7a5a' : '#5e4c3e' });
      K.ground(ctx, W, GROUND_TOP, dawn ? '#8a7258' : '#3a3530', dawn ? '#5a4632' : '#1c1a18');
      const r = mulberry32(5);
      for (let i = 0; i < 90; i++) { const x = r() * W, y = GROUND_TOP + 8 + r() * 190; rr(ctx, x, y, 12 + r() * 10, 6, 2); ctx.fillStyle = `rgba(0,0,0,${0.12 + r() * 0.1})`; ctx.fill(); }
      K.well(ctx, cx - W * 0.02, GROUND_TOP + 30);
      K.lamppost(ctx, cx - W * 0.33, GROUND_TOP + 40); K.lamppost(ctx, cx + W * 0.3, GROUND_TOP + 46);
      if (!dawn) { ctx.beginPath(); ctx.moveTo(cx - W * 0.4, 200); ctx.quadraticCurveTo(cx, 240, cx + W * 0.4, 196); ctx.lineWidth = 1.6; ctx.strokeStyle = '#2a2020'; ctx.stroke(); for (let i = 0; i < 9; i++) { const x = cx - W * 0.36 + i * W * 0.09; poly(ctx, [x, 214 + Math.sin(i) * 6, x + 10, 214 + Math.sin(i) * 6, x + 5, 230]); ink(ctx, i % 2 ? '#6a2a2a' : '#2a3a5a', 1.6); } }
      else { for (let i = 0; i < 12; i++) { const x = cx - W * 0.4 + i * W * 0.07; circ(ctx, x, 210 + Math.sin(i * 1.3) * 10, 6); ink(ctx, '#f6c46a', 2); } }
      K.fgStrip(ctx, W, dawn ? '#3a2a1e' : '#0b0d0c', 5);
    },
    lights(W) { return [{ x: W * 0.15, y: 80, r: 420, c: '#9fb4d8', a: 0.35 }, { x: W / 2 - W * 0.33 + 18, y: GROUND_TOP - 22, r: 150, c: '#f2a541', a: 0.8, f: 1 }, { x: W / 2 + W * 0.3 + 18, y: GROUND_TOP - 16, r: 150, c: '#f2a541', a: 0.8, f: 1 }, { x: W / 2 - W * 0.42, y: GROUND_TOP - 40, r: 90, c: '#f2b552', a: 0.5 }, { x: W / 2 + W * 0.13, y: GROUND_TOP - 40, r: 90, c: '#f2b552', a: 0.5 }]; },
    fx(ctx, W, t) { FX.smoke(ctx, W / 2 - W * 0.42 + 26, GROUND_TOP - 160, t, 5); FX.smoke(ctx, W / 2 + W * 0.13 + 24, GROUND_TOP - 150, t + 3, 5); FX.fog(ctx, W, t, GROUND_BOT - 20, '#7d8db8', 0.12, 8); },
  },
  dawn: {
    dark: 0, label: 'Quillsby at Dawn', warm: true,
    paint(ctx, W) { SCENES.village.paint(ctx, W, { dawn: true }); },
    lights() { return []; },
    fx(ctx, W, t) { FX.motes(ctx, W, t, 30, '#fff1b0', 150, 520); },
  },
  tavern: {
    dark: 0.3, label: 'The Leaky Inkpot',
    paint(ctx, W) {
      K.planks(ctx, W, 0, GROUND_TOP, '#3e2a1e');
      for (let x = 60; x < W; x += 220) { rr(ctx, x - 8, 0, 16, GROUND_TOP, 2); ink(ctx, '#2a1c14'); }
      rr(ctx, 0, 40, W, 16, 2); ink(ctx, '#2a1c14');
      const cx = W / 2;
      rr(ctx, cx - 90, GROUND_TOP - 130, 180, 130, 6); ink(ctx, '#4a4a52'); rr(ctx, cx - 60, GROUND_TOP - 90, 120, 90, 30); ctx.fillStyle = '#120a06'; ctx.fill(); ctx.stroke();
      rr(ctx, cx - 100, GROUND_TOP - 140, 200, 14, 3); ink(ctx, '#3a2a1e');
      K.shelf(ctx, cx - W * 0.33, 120, 170, 3, 8); K.shelf(ctx, cx + W * 0.33, 120, 170, 3, 9);
      K.floor(ctx, W, GROUND_TOP, '#4a3424', true);
      K.barrel(ctx, cx - W * 0.44, GROUND_TOP + 30, 1.1); K.barrel(ctx, cx - W * 0.4, GROUND_TOP + 50, 1.2); K.barrel(ctx, cx + W * 0.43, GROUND_TOP + 40, 1.1);
      for (const dx of [-0.25, 0.26]) { K.table(ctx, cx + dx * W, GROUND_TOP + 46, 90); }
      for (const dx of [-0.15, 0.12, 0.38]) { rr(ctx, cx + dx * W - 10, 52, 20, 26, 4); ink(ctx, '#55555e', 2.4); }
      K.fgStrip(ctx, W, '#120c08', 9);
    },
    lights(W) { return [{ x: W / 2, y: GROUND_TOP - 40, r: 260, c: '#f2802e', a: 0.9, f: 1 }, { x: W / 2 - W * 0.25, y: GROUND_TOP + 10, r: 110, c: '#f2b552', a: 0.6, f: 1 }, { x: W / 2 + W * 0.26, y: GROUND_TOP + 10, r: 110, c: '#f2b552', a: 0.6, f: 1 }]; },
    fx(ctx, W, t) {
      FX.flame(ctx, W / 2, GROUND_TOP - 2, 1.8, t, 1); FX.flame(ctx, W / 2 - 22, GROUND_TOP - 2, 1.2, t, 2); FX.flame(ctx, W / 2 + 24, GROUND_TOP - 2, 1.3, t, 3);
      FX.candle(ctx, W / 2 - W * 0.25, GROUND_TOP + 14, t, 4); FX.candle(ctx, W / 2 + W * 0.26, GROUND_TOP + 14, t, 5);
      for (const dx of [-0.15, 0.12, 0.38]) { const ph = (t * 0.7 + dx * 5) % 1; ell(ctx, W / 2 + dx * W, 80 + ph * 40, 2, 3.4, 0); ctx.fillStyle = PAL.ink; ctx.fill(); }
      FX.embers(ctx, W, t, W / 2 - 40, W / 2 + 40, GROUND_TOP - 20, 10);
    },
  },
  chapel: {
    dark: 0.3, label: 'The Hilltop Chapel',
    paint(ctx, W) {
      K.stoneWall(ctx, W, 0, GROUND_TOP, '#3c3e4a', 13);
      const cx = W / 2;
      for (const dx of [-0.32, 0.32]) { rr(ctx, cx + dx * W - 18, 0, 36, GROUND_TOP, 4); ink(ctx, '#33353f'); }
      K.window(ctx, cx, GROUND_TOP - 120, 90, 170, '#24365c', true);
      ctx.save(); ctx.globalAlpha = 0.85; poly(ctx, [cx - 40, GROUND_TOP - 140, cx, GROUND_TOP - 290, cx + 40, GROUND_TOP - 140]); ctx.restore();
      circ(ctx, cx, GROUND_TOP - 210, 24); ctx.fillStyle = '#d8a84a'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.out; ctx.stroke();
      K.floor(ctx, W, GROUND_TOP, '#4a4c56', true);
      rr(ctx, cx - 70, GROUND_TOP - 6, 140, 40, 4); ink(ctx, '#5a5c66'); rr(ctx, cx - 76, GROUND_TOP - 12, 152, 10, 3); ink(ctx, '#e8dcc0', 2.4);
      rr(ctx, cx + W * 0.2, GROUND_TOP + 40, 140, 22, 4); ink(ctx, '#5a3c26'); rr(ctx, cx + W * 0.2 + 4, GROUND_TOP + 30, 132, 14, 5); ink(ctx, '#d8ccb0', 2.4);
      K.fgStrip(ctx, W, '#0c0c10', 2);
    },
    lights(W) { return [{ x: W / 2, y: GROUND_TOP - 200, r: 320, c: '#6f8fd8', a: 0.45 }, { x: W / 2 - 50, y: GROUND_TOP - 20, r: 120, c: '#f2b552', a: 0.8, f: 1 }, { x: W / 2 + 50, y: GROUND_TOP - 20, r: 120, c: '#f2b552', a: 0.8, f: 1 }]; },
    fx(ctx, W, t) { for (let i = -2; i <= 2; i++) FX.candle(ctx, W / 2 + i * 26, GROUND_TOP - 10, t, i + 7, 14 + Math.abs(i) * 3); FX.motes(ctx, W, t, 10, '#fff2c8', 60, 300); },
  },
  churchyard: {
    dark: 0.52, label: 'The Churchyard',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 200, 90, 21); K.moon(ctx, W * 0.82, 70, 24, '#d8e0ee');
      K.church(ctx, W * 0.22, GROUND_TOP - 20, 0.95, '#252838');
      K.hills(ctx, W, 300, 20, '#181f2c', 6, 120);
      K.ground(ctx, W, GROUND_TOP - 12, '#232c26', '#111613');
      K.gnarled(ctx, W * 0.86, GROUND_TOP + 10, 1.3, '#1e1714', '#121e18', 41);
      const r = mulberry32(22);
      for (let i = 0; i < 16; i++) { const x = (i + 0.5) * W / 16 + (r() - 0.5) * 30, y = GROUND_TOP + 4 + (i % 3) * 8; K.grave(ctx, x, y, 0.8 + r() * 0.3, r() > 0.55 ? 'cross' : 'stone', (r() - 0.5) * 0.3); }
      for (let i = 0; i < 4; i++) K.mound(ctx, W * (0.18 + i * 0.22), GROUND_TOP + 110 + (i % 2) * 40, 24, true);
      ctx.beginPath(); ctx.moveTo(0, GROUND_TOP - 30); for (let x = 0; x < W; x += 16) { ctx.moveTo(x, GROUND_TOP - 2); ctx.lineTo(x, GROUND_TOP - 30); } ctx.moveTo(0, GROUND_TOP - 24); ctx.lineTo(W, GROUND_TOP - 24); ctx.lineWidth = 2.6; ctx.strokeStyle = '#141414'; ctx.stroke();
      K.tufts(ctx, r, 0, W, GROUND_TOP + 10, GROUND_BOT, 50, '#2e4234');
      K.fgStrip(ctx, W, '#080b09', 13);
    },
    lights(W) { return [{ x: W * 0.82, y: 70, r: 440, c: '#9fb4d8', a: 0.38 }, { x: W * 0.22, y: GROUND_TOP - 70, r: 70, c: '#d79a4a', a: 0.5 }]; },
    fx(ctx, W, t) { FX.fog(ctx, W, t, GROUND_TOP + 20, '#8fa0c8', 0.28, 6); FX.fog(ctx, W, t + 99, GROUND_BOT - 40, '#7d8db8', 0.2, 10); FX.motes(ctx, W, t, 8, '#a8e6ff', 300, 500); },
  },
  crypt: {
    dark: 0.6, label: 'The Crypt',
    paint(ctx, W) {
      K.stoneWall(ctx, W, 0, GROUND_TOP, '#2c2e36', 17);
      const cx = W / 2;
      for (let i = 0; i < 4; i++) { const x = (i + 0.5) * W / 4; ctx.beginPath(); ctx.moveTo(x - 70, GROUND_TOP); ctx.lineTo(x - 70, 140); ctx.quadraticCurveTo(x, 40, x + 70, 140); ctx.lineTo(x + 70, GROUND_TOP); ctx.lineWidth = 10; ctx.strokeStyle = '#1e2026'; ctx.stroke(); }
      for (let i = 0; i < 3; i++) { const x = cx + (i - 1) * W * 0.3; rr(ctx, x - 40, 150, 80, 50, 4); ctx.fillStyle = '#121318'; ctx.fill(); for (let j = 0; j < 4; j++) { circ(ctx, x - 26 + j * 17, 175, 6); ink(ctx, PAL.bone, 1.6); } }
      K.floor(ctx, W, GROUND_TOP, '#34363e', true);
      rr(ctx, cx - 60, GROUND_TOP + 10, 120, 40, 5); ink(ctx, '#4a4c56'); rr(ctx, cx - 66, GROUND_TOP + 2, 132, 12, 4); ink(ctx, '#5a5c66');
      rr(ctx, cx - W * 0.38, GROUND_TOP + 30, 90, 30, 5); ink(ctx, '#3e4048'); rr(ctx, cx + W * 0.3, GROUND_TOP + 36, 90, 30, 5); ink(ctx, '#3e4048');
      const r = mulberry32(17); for (let i = 0; i < 18; i++) { const x = r() * W, y = GROUND_TOP + 20 + r() * 180; ell(ctx, x, y, 5, 2, r() * 3); ink(ctx, PAL.bone, 1.4); }
      K.fgStrip(ctx, W, '#08080a', 17);
    },
    lights(W) { return [{ x: W / 2, y: GROUND_TOP - 10, r: 260, c: '#7bd389', a: 0.55, f: 1 }, { x: W * 0.15, y: GROUND_TOP - 80, r: 110, c: '#f2b552', a: 0.5, f: 1 }, { x: W * 0.85, y: GROUND_TOP - 80, r: 110, c: '#f2b552', a: 0.5, f: 1 }]; },
    fx(ctx, W, t) { FX.candle(ctx, W * 0.15, GROUND_TOP - 70, t, 3, 18); FX.candle(ctx, W * 0.85, GROUND_TOP - 70, t, 6, 18); FX.motes(ctx, W, t, 18, '#9dffb0', 200, 520); FX.fog(ctx, W, t, GROUND_BOT - 30, '#4a8a5a', 0.18, 5); },
  },
  shop: {
    dark: 0.28, label: "Madam Tallow's Apothecary",
    paint(ctx, W) {
      K.planks(ctx, W, 0, GROUND_TOP, '#33241c');
      const cx = W / 2;
      K.shelf(ctx, cx - W * 0.28, 70, 210, 5, 33); K.shelf(ctx, cx + W * 0.28, 70, 210, 5, 34);
      for (let i = 0; i < 9; i++) { const x = cx - 180 + i * 45; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 30 + (i % 3) * 10); ctx.lineWidth = 1.4; ctx.strokeStyle = '#1a120c'; ctx.stroke(); ell(ctx, x, 40 + (i % 3) * 10, 8, 14, 0); ink(ctx, i % 2 ? '#4a6a3a' : '#6a5a2a', 2); }
      K.floor(ctx, W, GROUND_TOP, '#3e2c20', true);
      rr(ctx, cx - 120, GROUND_TOP - 24, 240, 50, 4); ink(ctx, '#5a3c26'); rr(ctx, cx - 126, GROUND_TOP - 30, 252, 10, 3); ink(ctx, '#6a4a30');
      for (let i = 0; i < 6; i++) K.bottle(ctx, cx - 90 + i * 34, GROUND_TOP - 30, 1.2, ['#c94a3a', '#7bd389', '#6aa7e0', '#d8b04a', '#b06ad8', '#e8e0ff'][i]);
      ell(ctx, cx + W * 0.36, GROUND_TOP + 60, 46, 14, 0); ink(ctx, '#2a2a30'); ell(ctx, cx + W * 0.36, GROUND_TOP + 58, 38, 9, 0); ctx.fillStyle = '#4e9a52'; ctx.fill();
      K.fgStrip(ctx, W, '#0e0a08', 33);
    },
    lights(W) { return [{ x: W / 2, y: GROUND_TOP - 60, r: 240, c: '#f2b552', a: 0.75, f: 1 }, { x: W / 2 + W * 0.36, y: GROUND_TOP + 40, r: 130, c: '#7bd389', a: 0.6, f: 1 }]; },
    fx(ctx, W, t) { FX.candle(ctx, W / 2 - 110, GROUND_TOP - 30, t, 2); FX.candle(ctx, W / 2 + 110, GROUND_TOP - 30, t, 3); for (let i = 0; i < 5; i++) { const ph = (t * 0.5 + i / 5) % 1; circ(ctx, W / 2 + W * 0.36 + Math.sin(i * 3) * 20, GROUND_TOP + 50 - ph * 60, 3 + ph * 5); ctx.fillStyle = `rgba(140,230,150,${0.5 * (1 - ph)})`; ctx.fill(); } },
  },
  gate: {
    dark: 0.45, label: 'The Watch Post',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 230, 110, 41); K.moon(ctx, W * 0.6, 70, 22);
      K.hills(ctx, W, 280, 26, '#161d30', 9, 120);
      K.palisade(ctx, -10, W * 0.36, GROUND_TOP + 4, 120, 4); K.palisade(ctx, W * 0.64, W + 10, GROUND_TOP + 4, 120, 5);
      const cx = W / 2;
      rr(ctx, cx - W * 0.14 - 20, GROUND_TOP - 170, 40, 174, 3); ink(ctx, '#4a3626'); rr(ctx, cx + W * 0.14 - 20, GROUND_TOP - 170, 40, 174, 3); ink(ctx, '#4a3626');
      rr(ctx, cx - W * 0.14 - 30, GROUND_TOP - 190, W * 0.28 + 60, 26, 3); ink(ctx, '#3e2c20');
      K.ground(ctx, W, GROUND_TOP, '#33302a', '#171614');
      K.road(ctx, W, '#3e3428');
      rr(ctx, cx + W * 0.3, GROUND_TOP + 20, 8, 70, 2); ink(ctx, PAL.wood, 2.4); rr(ctx, cx + W * 0.3 - 24, GROUND_TOP + 34, 56, 8, 2); ink(ctx, PAL.wood, 2.4); ell(ctx, cx + W * 0.3 + 4, GROUND_TOP + 30, 13, 16, 0); ink(ctx, '#b89a52'); circ(ctx, cx + W * 0.3 + 4, GROUND_TOP + 6, 10); ink(ctx, '#b89a52');
      K.fgStrip(ctx, W, '#0a0b0a', 41);
    },
    lights(W) { return [{ x: W * 0.6, y: 70, r: 380, c: '#9fb4d8', a: 0.35 }, { x: W / 2 - W * 0.14, y: GROUND_TOP - 30, r: 170, c: '#f2802e', a: 0.85, f: 1 }, { x: W / 2 + W * 0.14, y: GROUND_TOP - 30, r: 170, c: '#f2802e', a: 0.85, f: 1 }]; },
    fx(ctx, W, t) { for (const dx of [-0.14, 0.14]) { rr(ctx, W / 2 + dx * W - 14, GROUND_TOP - 22, 28, 22, 4); ink(ctx, '#3a3a40', 2.4); FX.flame(ctx, W / 2 + dx * W, GROUND_TOP - 22, 1.3, t, dx * 9); FX.embers(ctx, W, t, W / 2 + dx * W - 10, W / 2 + dx * W + 10, GROUND_TOP - 30, 6); } },
  },
  bridge: {
    dark: 0.45, label: 'The Grumble Bridge',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 220, 100, 51); K.moon(ctx, W * 0.3, 80, 26);
      K.hills(ctx, W, 250, 30, '#141a2c', 10, 110);
      K.treeline(ctx, W, 290, '#0f1720', 6, 70, 16);
      ctx.fillStyle = grad(ctx, 0, 290, 0, 600, [[0, '#1c2a40'], [1, '#0a1220']]); ctx.fillRect(0, 290, W, 310);
      ctx.fillStyle = 'rgba(159,180,216,0.12)'; for (let i = 0; i < 8; i++) { ctx.fillRect(W * 0.3 - 30 + (i % 2) * 16, 300 + i * 10, 60 - i * 6, 3); }
      ctx.fillStyle = '#5a4030'; ctx.fillRect(0, GROUND_TOP + 18, W, 150);
      ctx.fillStyle = '#4a3424'; for (let x = 0; x < W; x += 24) { ctx.fillRect(x, GROUND_TOP + 18, 2, 150); }
      for (let x = 0; x < W; x += 120) { rr(ctx, x - 6, GROUND_TOP + 160, 12, 70, 2); ink(ctx, '#3a2818', 2.4); }
      rr(ctx, 0, GROUND_TOP + 4, W, 10, 2); ink(ctx, '#5a3c26', 2.4); for (let x = 20; x < W; x += 80) { rr(ctx, x - 4, GROUND_TOP - 22, 8, 32, 2); ink(ctx, '#4a3020', 2.4); }
      ctx.beginPath(); ctx.moveTo(0, GROUND_TOP - 16); ctx.lineTo(W, GROUND_TOP - 16); ctx.lineWidth = 5; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#5a3c26'; ctx.stroke();
      const cx = W / 2;
      rr(ctx, cx + W * 0.28, GROUND_TOP - 80, 70, 84, 4); ink(ctx, '#4a3626'); poly(ctx, [cx + W * 0.28 - 8, GROUND_TOP - 76, cx + W * 0.28 + 35, GROUND_TOP - 110, cx + W * 0.28 + 78, GROUND_TOP - 76]); ink(ctx, '#3a2a20');
      rr(ctx, cx + W * 0.06, GROUND_TOP - 60, 62, 30, 2); ink(ctx, '#7a5a3a', 2.4); rr(ctx, cx + W * 0.06 + 29, GROUND_TOP - 30, 4, 30, 1); ink(ctx, '#4a3020', 2);
      ctx.fillStyle = PAL.out; ctx.font = `700 9px ${FONT_BOOK}`; ctx.textAlign = 'center'; ctx.fillText('TOLL', cx + W * 0.06 + 31, GROUND_TOP - 47); ctx.fillText('1 SILVER', cx + W * 0.06 + 31, GROUND_TOP - 37);
      K.fgStrip(ctx, W, '#070a10', 51);
    },
    lights(W) { return [{ x: W * 0.3, y: 80, r: 420, c: '#9fb4d8', a: 0.38 }, { x: W / 2 + W * 0.28 + 35, y: GROUND_TOP - 60, r: 150, c: '#f2802e', a: 0.8, f: 1 }, { x: W / 2 - W * 0.3, y: GROUND_TOP - 50, r: 140, c: '#f2802e', a: 0.75, f: 1 }]; },
    fx(ctx, W, t) { FX.water(ctx, W, 296, GROUND_TOP, t); FX.torch(ctx, W / 2 + W * 0.28 - 14, GROUND_TOP + 6, t, 1); FX.torch(ctx, W / 2 - W * 0.3, GROUND_TOP + 10, t, 2); FX.fog(ctx, W, t, 300, '#6a7aa0', 0.18, 10); },
  },
  mill: {
    dark: 0.45, label: 'The Old Mill',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 220, 110, 61); K.moon(ctx, W * 0.82, 84, 28);
      K.hills(ctx, W, 270, 28, '#161d30', 12, 120);
      const cx = W / 2;
      ctx.fillStyle = grad(ctx, 0, 300, 0, GROUND_TOP, [[0, '#1c2a40'], [1, '#0e1828']]); ctx.fillRect(0, 300, W, 60);
      rr(ctx, cx - 120, GROUND_TOP - 170, 160, 176, 4); ink(ctx, '#5e4c3e'); poly(ctx, [cx - 134, GROUND_TOP - 168, cx - 40, GROUND_TOP - 250, cx + 54, GROUND_TOP - 168]); ink(ctx, '#3a2828');
      K.window(ctx, cx - 76, GROUND_TOP - 96, 30, 40, '#f2b552'); rr(ctx, cx - 30, GROUND_TOP - 70, 40, 74, 3); ink(ctx, '#2e2018');
      K.ground(ctx, W, GROUND_TOP, '#2c3428', '#141a14');
      const r = mulberry32(61); K.tufts(ctx, r, 0, W, GROUND_TOP, GROUND_BOT, 60, '#3c5038');
      for (let i = 0; i < 14; i++) { const x = cx + W * 0.3 + r() * W * 0.2, y = GROUND_TOP + r() * 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4, y - 30, x + 2, y - 50); ctx.lineWidth = 2.4; ctx.strokeStyle = '#3a4a2a'; ctx.stroke(); ell(ctx, x + 2, y - 50, 3, 8, 0); ctx.fillStyle = '#5a3a24'; ctx.fill(); }
      K.fgStrip(ctx, W, '#090c09', 61);
    },
    lights(W) { return [{ x: W * 0.82, y: 84, r: 420, c: '#9fb4d8', a: 0.4 }, { x: W / 2 - 76, y: GROUND_TOP - 110, r: 130, c: '#f2b552', a: 0.75, f: 1 }]; },
    fx(ctx, W, t) {
      const x = W / 2 + 58, y = GROUND_TOP - 90, R = 70;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.6);
      circ(ctx, 0, 0, R); ctx.lineWidth = 9; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#5a3c26'; ctx.stroke();
      for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); rr(ctx, -4, -R - 6, 8, R + 6, 2); ink(ctx, '#6a4a30', 2.4); }
      circ(ctx, 0, 0, 9); ink(ctx, '#3a3a40');
      ctx.restore();
      FX.water(ctx, W, 300, GROUND_TOP - 4, t);
      for (let i = 0; i < 8; i++) { const ph = (t * 1.2 + i / 8) % 1; circ(ctx, x + 40 + ph * 30, GROUND_TOP - 20 + ph * 10, 2 + ph * 3); ctx.fillStyle = `rgba(190,210,240,${0.5 * (1 - ph)})`; ctx.fill(); }
      FX.fog(ctx, W, t, GROUND_TOP + 20, '#7d8db8', 0.16, 8);
    },
  },
  cellar: {
    dark: 0.62, label: 'The Mill Cellar',
    paint(ctx, W) {
      K.stoneWall(ctx, W, 0, GROUND_TOP, '#2e2a2a', 71);
      const cx = W / 2;
      rr(ctx, cx - 60, GROUND_TOP - 150, 120, 152, 6); ink(ctx, '#2a2c32'); for (let i = 0; i < 5; i++) { rr(ctx, cx - 56, GROUND_TOP - 140 + i * 30, 112, 4, 1); ink(ctx, '#3e4048', 2); } circ(ctx, cx + 38, GROUND_TOP - 70, 7); ink(ctx, '#5a5c66', 2.2);
      K.floor(ctx, W, GROUND_TOP, '#2c2826', true);
      K.barrel(ctx, cx - W * 0.36, GROUND_TOP + 20, 1.2); K.barrel(ctx, cx - W * 0.3, GROUND_TOP + 40, 1.1); K.barrel(ctx, cx + W * 0.34, GROUND_TOP + 30, 1.3, 'DO NOT OPEN'); K.crate(ctx, cx + W * 0.42, GROUND_TOP + 50, 1.1);
      for (let i = 0; i < 6; i++) { ell(ctx, cx + (i - 2.5) * 90, GROUND_TOP + 80 + (i % 2) * 50, 40, 9, 0); ctx.fillStyle = 'rgba(20,24,52,0.85)'; ctx.fill(); }
      ctx.fillStyle = 'rgba(220,220,240,0.6)'; for (let i = 0; i < 30; i++) { ctx.fillRect(40 + (i * 37) % (W - 80), 30 + (i * 53) % 260, 3, 3); }
      K.fgStrip(ctx, W, '#090808', 71);
    },
    lights(W) { return [{ x: W * 0.2, y: GROUND_TOP - 60, r: 160, c: '#f2b552', a: 0.7, f: 1 }]; },
    fx(ctx, W, t) { FX.torch(ctx, W * 0.2, GROUND_TOP, t, 4); for (let i = 0; i < 4; i++) { const ph = (t * 0.6 + i / 4) % 1; ell(ctx, 100 + i * (W - 200) / 3, 20 + ph * 280, 1.8, 3, 0); ctx.fillStyle = 'rgba(28,31,58,0.9)'; ctx.fill(); } },
  },
  river: {
    dark: 0.5, label: 'The Gloomwater',
    paint(ctx, W) {
      K.sky(ctx, W, NIGHT_SKY); K.stars(ctx, W, 200, 90, 81); K.moon(ctx, W * 0.5, 70, 20, '#cfd8ea');
      K.treeline(ctx, W, 270, '#0e1520', 8, 90, 14);
      ctx.fillStyle = grad(ctx, 0, 270, 0, 600, [[0, '#14223a'], [1, '#060b16']]); ctx.fillRect(0, 270, W, 330);
      ctx.fillStyle = 'rgba(200,215,240,0.14)'; for (let i = 0; i < 10; i++) ctx.fillRect(W * 0.5 - 40 + (i % 2) * 20, 280 + i * 12, 80 - i * 7, 3);
      ctx.fillStyle = '#2a3428'; ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, GROUND_TOP + 30); ctx.quadraticCurveTo(W * 0.3, GROUND_TOP + 10, W * 0.45, GROUND_TOP + 60); ctx.quadraticCurveTo(W * 0.6, GROUND_TOP + 120, W, GROUND_TOP + 90); ctx.lineTo(W, 600); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.out; ctx.stroke();
      rr(ctx, W * 0.1, GROUND_TOP + 34, 150, 12, 2); ink(ctx, '#4a3424'); for (let i = 0; i < 4; i++) { rr(ctx, W * 0.1 + 10 + i * 40, GROUND_TOP + 44, 8, 50, 2); ink(ctx, '#3a2818', 2.4); }
      for (const x of [0.62, 0.8, 0.9]) K.rock(ctx, W * x, GROUND_TOP + 30 + x * 20, 1.2, '#3a3c46');
      K.fgStrip(ctx, W, '#070a0c', 81);
    },
    lights(W) { return [{ x: W * 0.5, y: 70, r: 380, c: '#9fb4d8', a: 0.35 }, { x: W * 0.55, y: GROUND_TOP - 30, r: 140, c: '#6fa8ff', a: 0.7, f: 1 }]; },
    fx(ctx, W, t) { FX.water(ctx, W, 280, GROUND_TOP + 30, t, '#8aa4d0'); FX.fog(ctx, W, t, 300, '#8fa0c8', 0.3, 7); FX.fog(ctx, W, t + 40, GROUND_TOP + 60, '#6d7db0', 0.18, 11); },
  },
  camp: {
    dark: 0.42, label: 'The Goblin Camp',
    paint(ctx, W) {
      K.sky(ctx, W, [[0, '#0a0a16'], [0.7, '#2a1a26'], [1, '#4a2a28']]); K.stars(ctx, W, 180, 70, 91);
      K.hills(ctx, W, 270, 26, '#1a1520', 13, 120);
      K.palisade(ctx, -10, W + 10, GROUND_TOP - 30, 90, 7);
      const cx = W / 2;
      K.tent(ctx, cx - W * 0.33, GROUND_TOP + 10, 150, 110, '#6b4a32'); K.tent(ctx, cx + W * 0.34, GROUND_TOP + 6, 170, 126, '#5a3c2a'); K.tent(ctx, cx - W * 0.08, GROUND_TOP - 10, 120, 90, '#7a5236');
      K.ground(ctx, W, GROUND_TOP + 4, '#3a2e24', '#18120e');
      K.skullPole(ctx, cx - W * 0.18, GROUND_TOP + 24); K.skullPole(ctx, cx + W * 0.2, GROUND_TOP + 30);
      K.banner(ctx, cx + W * 0.1, GROUND_TOP - 20, 110, '#7a1f1b', 0);
      const r = mulberry32(91); for (let i = 0; i < 26; i++) { ell(ctx, r() * W, GROUND_TOP + 20 + r() * 180, 4, 2, 0); ctx.fillStyle = PAL.bone; ctx.fill(); }
      ell(ctx, cx + 20, GROUND_TOP + 70, 40, 12, 0); ink(ctx, '#2a2420'); for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU; ell(ctx, cx + 20 + Math.cos(a) * 38, GROUND_TOP + 70 + Math.sin(a) * 11, 7, 4, 0); ink(ctx, '#5a5c66', 2); }
      K.fgStrip(ctx, W, '#0b0807', 91);
    },
    lights(W) { return [{ x: W / 2 + 20, y: GROUND_TOP + 50, r: 280, c: '#f2802e', a: 0.95, f: 1 }, { x: W / 2 - W * 0.33, y: GROUND_TOP - 30, r: 90, c: '#f2a541', a: 0.4 }]; },
    fx(ctx, W, t) { FX.flame(ctx, W / 2 + 20, GROUND_TOP + 66, 2.2, t, 1); FX.flame(ctx, W / 2 + 4, GROUND_TOP + 68, 1.4, t, 2); FX.flame(ctx, W / 2 + 38, GROUND_TOP + 68, 1.5, t, 3); FX.embers(ctx, W, t, W / 2 - 20, W / 2 + 60, GROUND_TOP + 50, 18); FX.smoke(ctx, W / 2 + 20, GROUND_TOP + 10, t, 7); },
  },
  campback: {
    dark: 0.55, label: 'Behind the Tents',
    paint(ctx, W) {
      K.sky(ctx, W, [[0, '#08080f'], [1, '#22161e']]); K.stars(ctx, W, 160, 60, 92);
      K.palisade(ctx, -10, W + 10, GROUND_TOP - 40, 100, 8);
      const cx = W / 2;
      K.tent(ctx, cx + W * 0.1, GROUND_TOP + 6, 260, 170, '#5a3a28');
      K.ground(ctx, W, GROUND_TOP, '#2e261e', '#120e0a');
      K.crate(ctx, cx - W * 0.3, GROUND_TOP + 30, 1.2); K.crate(ctx, cx - W * 0.26, GROUND_TOP + 2, 1); K.barrel(ctx, cx - W * 0.4, GROUND_TOP + 40, 1.1);
      ctx.save(); ctx.translate(cx - W * 0.12, GROUND_TOP + 50); rr(ctx, -34, -60, 68, 60, 3); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill(); ctx.beginPath(); for (let i = 0; i <= 6; i++) { ctx.moveTo(-34 + i * 11.3, -60); ctx.lineTo(-34 + i * 11.3, 0); } ctx.moveTo(-34, -60); ctx.lineTo(34, -60); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#2a2a30'; ctx.stroke(); ctx.restore();
      K.fgStrip(ctx, W, '#090706', 92);
    },
    lights(W) { return [{ x: W / 2 + W * 0.1, y: GROUND_TOP - 40, r: 160, c: '#f2802e', a: 0.55, f: 1 }]; },
    fx(ctx, W, t) { FX.embers(ctx, W, t, W * 0.4, W * 0.9, GROUND_TOP - 120, 10); },
  },
  tent: {
    dark: 0.35, label: "The Gutter King's Tent",
    paint(ctx, W) {
      ctx.fillStyle = grad(ctx, 0, 0, 0, GROUND_TOP, [[0, '#2a1a12'], [1, '#4a2e1e']]); ctx.fillRect(0, 0, W, GROUND_TOP);
      for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 45, GROUND_TOP * 0.5, x + 10, GROUND_TOP); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(20,10,6,0.5)'; ctx.stroke(); }
      const cx = W / 2;
      K.floor(ctx, W, GROUND_TOP, '#3a2a1e', false);
      ell(ctx, cx, GROUND_TOP + 80, W * 0.36, 60, 0); ctx.fillStyle = '#5a2a22'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.out; ctx.stroke();
      ell(ctx, cx, GROUND_TOP + 80, W * 0.3, 48, 0); ctx.lineWidth = 2; ctx.strokeStyle = '#c08f2a'; ctx.stroke();
      rr(ctx, cx - 50, GROUND_TOP - 140, 100, 140, 8); ink(ctx, '#6a4a30'); rr(ctx, cx - 64, GROUND_TOP - 60, 128, 60, 6); ink(ctx, '#7a5236');
      for (let i = 0; i < 7; i++) { circ(ctx, cx - 60 + i * 20, GROUND_TOP - 146 - (i % 2) * 8, 9); ink(ctx, PAL.bone, 2.4); }
      rr(ctx, cx - 34, GROUND_TOP - 128, 68, 46, 2); ink(ctx, '#e8dcc0', 2.4); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(cx - 26, GROUND_TOP - 118 + i * 8); ctx.lineTo(cx + 26, GROUND_TOP - 118 + i * 8); ctx.lineWidth = 1; ctx.strokeStyle = '#7a6a52'; ctx.stroke(); }
      for (const dx of [-0.32, 0.3]) { for (let i = 0; i < 12; i++) { circ(ctx, cx + dx * W + (i % 4) * 14 - 20, GROUND_TOP + 20 - Math.floor(i / 4) * 10, 7); ink(ctx, i % 3 ? '#c9c9d4' : '#c9a545', 1.8); } }
      K.fgStrip(ctx, W, '#0c0806', 99);
    },
    lights(W) { return [{ x: W * 0.18, y: GROUND_TOP - 40, r: 200, c: '#f2802e', a: 0.85, f: 1 }, { x: W * 0.82, y: GROUND_TOP - 40, r: 200, c: '#f2802e', a: 0.85, f: 1 }, { x: W / 2, y: GROUND_TOP - 100, r: 120, c: '#ffe9a8', a: 0.4 }]; },
    fx(ctx, W, t) { FX.torch(ctx, W * 0.18, GROUND_TOP + 20, t, 1); FX.torch(ctx, W * 0.82, GROUND_TOP + 20, t, 2); FX.embers(ctx, W, t, W * 0.1, W * 0.9, GROUND_TOP, 8); },
  },
};
