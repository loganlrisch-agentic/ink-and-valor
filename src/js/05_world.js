/* ==========================================================================
   World - battlefield coordinates, cel-shaded props, scenes, panoramas, Tassel
   Logic space (battle + story actors): x 0..960, y = ground depth 330..528.
   World space: 1 unit = 40 logic px, depth stretched by ZK. Heights in px * HK.
   ========================================================================== */
const LW = 960, GROUND_TOP = 330, GROUND_BOT = 528, GMID = 436, WU = 50, ZK = 1.5, HK = 1 / 44;
const R = { W: LW, H: 600 };
const wx = (x) => (x - LW / 2) / WU;
const wz = (y) => (y - GMID) / WU * ZK;
const fromWorld = (X, Z) => ({ x: X * WU + LW / 2, y: Z / ZK * WU + GMID });

const World = (() => {
  if (!HAS3D) return {};
  const PI = Math.PI;
  const { G } = M3;
  const cache = new Map();
  /* build a prop once, then clone (shares geometry) */
  function prop(kind, seed, o) {
    const key = kind + '|' + (seed || 0) + '|' + (o ? JSON.stringify(o) : '');
    let g = cache.get(key);
    if (!g) {
      const fn = PROPS[kind]; if (!fn) return new THREE.Group();
      const info = {};
      g = M3.prop((f) => fn(f, mulberry32((seed || 1) * 7919), o || {}, info));
      g.userData.info = info;
      cache.set(key, g);
    }
    const c = g.clone(); c.userData.info = g.userData.info; return c;
  }
  const bark = '#3a2a20', barkD = '#2a1e18', stone = '#7a7c86', stoneD = '#5a5c66', wood = '#6a4a2e', woodD = '#4a321e', iron = '#3a3c44';

  const PROPS = {
    oak(f, r, o) {
      const lc = o.leaf || '#2c4a2a', h = 2.2 + r() * 0.6;
      f.put(G.cyl(0.62, 1, 9), bark, 0, h / 2, 0, 0, 0, 0, 0.34, h, 0.34, { grad: [0.6, 1.05] });
      for (let i = 0; i < 4; i++) { const a = i * 1.7 + r(); f.put(G.cone(6), barkD, Math.cos(a) * 0.32, 0.15, Math.sin(a) * 0.32, Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9, 0.16, 0.6, 0.16); }
      for (const s of [-1, 1]) f.put(G.cyl(0.5, 1, 7), bark, s * 0.45, h * 0.82, 0, 0, 0, -s * 0.9, 0.12, 1.1, 0.12);
      const n = 7;
      for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2 + r(); const rr = 0.7 + r() * 0.4; f.put(G.sphere(14), i % 3 ? lc : shade(lc, 0.12), Math.cos(a) * rr, h + 0.4 + r() * 0.7, Math.sin(a) * rr * 0.8, 0, 0, 0, 0.9 + r() * 0.4, 0.75 + r() * 0.3, 0.9 + r() * 0.4, { grad: [0.55, 1.1] }); }
      f.put(G.sphere(14), shade(lc, 0.1), 0, h + 1.2, 0, 0, 0, 0, 1.1, 0.9, 1.0, { grad: [0.6, 1.15] });
    },
    deadtree(f, r) {
      let x = 0, y = 0, z = 0, a = 0;
      for (let i = 0; i < 5; i++) { const L = 0.7 - i * 0.06, rad = 0.3 - i * 0.05; const tilt = (r() - 0.5) * 0.5; f.put(G.cyl(0.8, 1, 7), i % 2 ? bark : barkD, x, y + L / 2, z, 0, 0, tilt, rad, L + 0.1, rad); x += -Math.sin(tilt) * L; y += Math.cos(tilt) * L; a = tilt; }
      for (let i = 0; i < 5; i++) { const s = i % 2 ? 1 : -1, yy = 1.2 + i * 0.5; f.put(G.cone(6), barkD, s * 0.5 + x * (yy / y), yy + 0.3, (r() - 0.5) * 0.6, (r() - 0.5) * 0.6, 0, -s * (0.9 + r() * 0.4), 0.09, 1.2 + r() * 0.5, 0.09); }
      for (let i = 0; i < 3; i++) { const aa = i * 2.1; f.put(G.cone(6), barkD, Math.cos(aa) * 0.3, 0.12, Math.sin(aa) * 0.3, Math.sin(aa) * 1, 0, -Math.cos(aa) * 1, 0.14, 0.6, 0.14); }
    },
    pine(f, r, o) {
      const lc = o.leaf || '#1e3a34', h = 0.8;
      f.put(G.cyl(0.7, 1, 7), bark, 0, h / 2, 0, 0, 0, 0, 0.22, h, 0.22);
      for (let i = 0; i < 4; i++) f.put(G.cone(9), i % 2 ? lc : shade(lc, 0.1), 0, h + 0.5 + i * 0.75, 0, 0, i * 0.5, 0, 1.5 - i * 0.3, 1.5 - i * 0.12, 1.5 - i * 0.3, { grad: [0.55, 1.1] });
    },
    bush(f, r, o) { const c = o.color || '#2e4a2a'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + r(); f.put(G.sphere(12), i % 2 ? c : shade(c, 0.1), Math.cos(a) * 0.45, 0.35 + r() * 0.2, Math.sin(a) * 0.35, 0, 0, 0, 0.5 + r() * 0.2, 0.45, 0.5); } },
    tuft(f, r, o) { const c = o.color || '#4a5a30'; for (let i = 0; i < 6; i++) { const a = r() * PI * 2; f.put(G.cone(4), i % 2 ? c : shade(c, 0.15), Math.cos(a) * 0.15, 0.2, Math.sin(a) * 0.15, Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4, 0.06, 0.45 + r() * 0.2, 0.06, { ow: 0.25 }); } },
    heather(f, r) { for (let i = 0; i < 5; i++) { const a = r() * PI * 2, d = r() * 0.4; f.put(G.sphere(8), i % 2 ? '#5a3a5a' : '#6a4a6a', Math.cos(a) * d, 0.12, Math.sin(a) * d, 0, 0, 0, 0.25, 0.16, 0.25); } },
    rock(f, r, o) { const c = o.color || stone; const s = o.s || 1; f.put(G.ico(1), c, 0, 0.25 * s, 0, r(), r(), r(), (0.5 + r() * 0.3) * s, (0.35 + r() * 0.2) * s, (0.45 + r() * 0.3) * s, { grad: [0.6, 1.15] }); if (r() < 0.6) f.put(G.ico(1), shade(c, -0.08), 0.45 * s, 0.12 * s, 0.2 * s, r(), r(), r(), 0.25 * s, 0.18 * s, 0.22 * s); },
    standing(f, r, o) {
      const h = 2.2 + r() * 1.0;
      f.put(G.rbox(0.9, h, 0.55, 0.16), o.color || '#6a6e7a', 0, h / 2 - 0.1, 0, (r() - 0.5) * 0.12, 0, (r() - 0.5) * 0.18, 1, 1, 1, { grad: [0.55, 1.12] });
      f.decal(G.sphere(10), '#3a5a34', 0.15, h * 0.25, 0.27, 0, 0, 0, 0.35, 0.3, 0.05);
      if (o.rune) f.glow(G.rbox(0.1, 0.5, 0.05, 0.02), o.rune, 0, h * 0.6, 0.29, 0, 0, 0.3, 1, 1, 1, 2);
    },
    grave(f, r, o) {
      const t = o.t || Math.floor(r() * 3), c = shade('#8a8a90', (r() - 0.5) * 0.15);
      f.put(G.sphere(10), '#3a3024', 0, 0, 0.55, 0, 0, 0, 0.5, 0.18, 0.75);
      if (t === 0) f.put(G.rbox(0.7, 1.0, 0.2, 0.3), c, 0, 0.45, 0, (r() - 0.5) * 0.2, 0, (r() - 0.5) * 0.25);
      else if (t === 1) { const tl = (r() - 0.5) * 0.3; f.put(G.rbox(0.16, 1.2, 0.16, 0.04), c, 0, 0.55, 0, 0, 0, tl); f.put(G.rbox(0.62, 0.16, 0.16, 0.04), c, -Math.sin(tl) * 0.35, 0.8, 0, 0, 0, tl); }
      else { f.put(G.rbox(0.8, 0.7, 0.24, 0.06), c, 0, 0.3, 0, 0, 0, (r() - 0.5) * 0.15); f.put(G.cyl(1, 1, 12), c, 0, 0.66, 0, PI / 2, 0, 0, 0.4, 0.24, 0.2); }
      f.decal(G.rbox(0.3, 0.05, 0.02, 0.01), '#4a4a50', 0, 0.55, 0.12);
    },
    fence(f, r, o) { const L = o.L || 3, c = o.color || woodD; for (let i = 0; i <= 3; i++) f.put(G.rbox(0.12, 1.0 + r() * 0.15, 0.12, 0.03), c, -L / 2 + i * L / 3, 0.45, 0, 0, 0, (r() - 0.5) * 0.1); for (const y of [0.35, 0.75]) f.put(G.rbox(L + 0.2, 0.08, 0.06, 0.02), c, 0, y, 0.06, 0, 0, (r() - 0.5) * 0.05); },
    ironfence(f, r, o) { const L = o.L || 3; for (let i = 0; i <= 10; i++) { f.metal(G.cyl(1, 1, 5), iron, -L / 2 + i * L / 10, 0.65, 0, 0, 0, 0, 0.025, 1.3, 0.025); f.metal(G.cone(4), iron, -L / 2 + i * L / 10, 1.36, 0, 0, 0, 0, 0.05, 0.14, 0.05); } for (const y of [0.3, 1.1]) f.metal(G.rbox(L, 0.05, 0.04, 0.01), iron, 0, y, 0); },
    house(f, r, o, info) {
      const w = o.w || 4, d = 3, h = 2.4, wall = o.wall || '#d6c6a2', beam = '#3a2618', roof = o.roof || (r() < 0.5 ? '#6a4a30' : '#4a4a5a');
      f.put(G.rbox(w, h, d, 0.06), wall, 0, h / 2, 0, 0, 0, 0, 1, 1, 1, { grad: [0.75, 1.05] });
      for (const s of [-1, 1]) f.flat(G.rbox(0.16, h, 0.06, 0.02), beam, s * (w / 2 - 0.08), h / 2, d / 2 + 0.01);
      f.flat(G.rbox(w, 0.14, 0.06, 0.02), beam, 0, h * 0.5, d / 2 + 0.01); f.flat(G.rbox(w, 0.16, 0.06, 0.02), beam, 0, h - 0.08, d / 2 + 0.01);
      f.flat(G.rbox(0.12, h * 0.62, 0.05, 0.02), beam, -w * 0.3, h * 0.25, d / 2 + 0.02, 0, 0, 0.6);
      const tri = G.shape('gable', (s) => { s.moveTo(-1, 0); s.lineTo(1, 0); s.lineTo(0, 0.75); s.lineTo(-1, 0); }, 0.1, 0.02);
      for (const s of [-1, 1]) f.put(tri, wall, 0, h, s * (d / 2 - 0.05), 0, 0, 0, w / 2, w / 2, 1);
      const rl = Math.hypot(w / 2, w * 0.375) + 0.35, ang = Math.atan2(w * 0.375, w / 2);
      for (const s of [-1, 1]) f.put(G.rbox(rl, 0.22, d + 0.6, 0.06), roof, s * (w / 4 + 0.05), h + w * 0.19, 0, 0, 0, -s * ang, 1, 1, 1, { grad: [0.6, 1.1] });
      f.put(G.rbox(0.3, 0.3, d + 0.7, 0.08), shade(roof, -0.2), 0, h + w * 0.375 + 0.05, 0);
      f.put(G.rbox(0.6, 1.4, 0.6, 0.05), '#6a6870', w * 0.28, h + w * 0.35, -0.4, 0, 0, 0, 1, 1, 1);
      f.put(G.rbox(0.8, 1.4, 0.12, 0.05), woodD, w * 0.1, 0.7, d / 2 + 0.04);
      f.metal(G.sphere(6), '#c9a14a', w * 0.1 + 0.25, 0.72, d / 2 + 0.12, 0, 0, 0, 0.05, 0.05, 0.05);
      const lit = o.lit !== false;
      for (const x of [-w * 0.28, w * 0.34]) {
        f.put(G.rbox(0.72, 0.62, 0.1, 0.03), beam, x, 1.55, d / 2 + 0.03);
        if (lit) f.glow(G.rbox(0.56, 0.48, 0.06, 0.02), '#ffb050', x, 1.55, d / 2 + 0.06, 0, 0, 0, 1, 1, 1, 1.9);
        else f.flat(G.rbox(0.56, 0.48, 0.06, 0.02), '#1a1820', x, 1.55, d / 2 + 0.06);
        f.flat(G.rbox(0.05, 0.5, 0.08, 0.01), beam, x, 1.55, d / 2 + 0.08); f.flat(G.rbox(0.58, 0.05, 0.08, 0.01), beam, x, 1.55, d / 2 + 0.08);
      }
      if (lit) info.light = { x: 0, y: 1.6, z: d / 2 + 0.8, c: '#ffb060', i: 0.8, d: 6 };
    },
    well(f) {
      f.put(G.tube(1, 1.05, 0.28, 16), stone, 0, 0.45, 0, 0, 0, 0, 0.9, 0.9, 0.9, { grad: [0.6, 1.1] });
      f.flat(G.cyl(1, 1, 16), '#0c0e14', 0, 0.75, 0, 0, 0, 0, 0.62, 0.02, 0.62);
      for (const s of [-1, 1]) f.put(G.rbox(0.14, 1.9, 0.14, 0.04), wood, s * 0.75, 1.3, 0);
      f.put(G.cyl(1, 1, 8), woodD, 0, 1.9, 0, 0, 0, PI / 2, 0.08, 1.6, 0.08);
      for (const s of [-1, 1]) f.put(G.rbox(2.0, 0.12, 0.9, 0.04), '#5a3a26', 0, 2.35, s * 0.3, s * 0.6, 0, 0);
      f.put(G.cyl(0.8, 1, 10), wood, 0.1, 1.3, 0, 0, 0, 0, 0.16, 0.24, 0.16); f.flat(G.cyl(1, 1, 3), '#8a7a60', 0.1, 1.65, 0, 0, 0, 0, 0.008, 0.5, 0.008);
    },
    lamp(f, r, o, info) {
      f.metal(G.cyl(1, 1.3, 8), iron, 0, 1.3, 0, 0, 0, 0, 0.07, 2.6, 0.07);
      f.metal(G.rbox(0.3, 0.12, 0.3, 0.04), iron, 0, 0.06, 0);
      f.metal(G.rbox(0.7, 0.06, 0.06, 0.02), iron, 0.3, 2.55, 0);
      const c = o.c || '#ffb050';
      f.metal(G.cone(6), iron, 0.6, 2.62, 0, 0, 0, 0, 0.2, 0.16, 0.2); f.glow(G.cyl(1, 1, 6), c, 0.6, 2.35, 0, 0, 0, 0, 0.13, 0.3, 0.13, 2.4); f.metal(G.cyl(1, 1, 6), iron, 0.6, 2.18, 0, 0, 0, 0, 0.15, 0.04, 0.15);
      info.light = { x: 0.6, y: 2.3, z: 0, c, i: 1.1, d: 7, flicker: 0.15 };
    },
    torch(f, r, o, info) { f.put(G.cyl(0.6, 1, 6), woodD, 0, 0.9, 0, 0, 0, 0, 0.06, 1.8, 0.06); f.metal(G.cyl(1, 0.6, 8), iron, 0, 1.85, 0, 0, 0, 0, 0.12, 0.18, 0.12); f.glow(G.cone(8), '#ffa040', 0, 2.1, 0, 0, 0, 0, 0.12, 0.4, 0.12, 2.6); info.light = { x: 0, y: 2.2, z: 0, c: '#ff9a40', i: 1.0, d: 6, flicker: 0.3 }; info.flame = { x: 0, y: 1.95, z: 0, s: 0.7 }; },
    campfire(f, r, o, info) {
      for (let i = 0; i < 9; i++) { const a = (i / 9) * PI * 2; f.put(G.ico(0), i % 2 ? stone : stoneD, Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7, r(), r(), r(), 0.2, 0.14, 0.18); }
      for (let i = 0; i < 4; i++) f.put(G.cyl(1, 1, 7), i % 2 ? woodD : wood, 0, 0.18, 0, 0.3, i * 0.8, PI / 2, 0.1, 1.1, 0.1);
      f.glow(G.sphere(10), '#ff6a20', 0, 0.2, 0, 0, 0, 0, 0.4, 0.12, 0.4, 2.2);
      const big = o.big ? 1.8 : 1;
      info.light = { x: 0, y: 0.9 * big, z: 0, c: '#ff8a3a', i: 1.8 * big, d: 9 * big, flicker: 0.35 };
      info.flame = { x: 0, y: 0.1, z: 0, s: 1.6 * big };
    },
    tent(f, r, o) {
      const c = o.color || '#7a5a3a';
      f.put(G.cone(7), c, 0, 1.1, 0, 0, r(), 0, 1.6, 2.2, 1.6, { grad: [0.6, 1.1] });
      f.put(G.cone(7), shade(c, -0.15), 0, 0.5, 0.02, 0, r(), 0, 1.62, 1.0, 1.62, { grad: [0.6, 1] });
      f.flat(G.shape('flap', (s) => { s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0, 1.3); s.lineTo(-0.5, 0); }, 0.04, 0.01), '#140c08', 0, 0, 1.2, -0.42, 0, 0);
      f.put(G.cyl(1, 1, 5), woodD, 0, 2.3, 0, 0, 0, 0.1, 0.05, 0.7, 0.05);
      for (let i = 0; i < 3; i++) f.put(G.rbox(0.25, 0.3, 0.02, 0.01), ['#a3241c', '#e8d8b0', '#3a3a3a'][i], Math.cos(i * 2) * 0.9, 1.0, Math.sin(i * 2) * 0.9 + 0.2, 0, i * 2, 0);
    },
    barrel(f, r) { f.put(G.cyl(0.85, 0.85, 12), wood, 0, 0.45, 0, 0, 0, 0, 0.36, 0.9, 0.36, { grad: [0.6, 1.1] }); f.put(G.sphere(12), wood, 0, 0.45, 0, 0, 0, 0, 0.42, 0.42, 0.42); for (const y of [0.15, 0.75]) f.metal(G.torus(0.1, PI * 2, 16), iron, 0, y, 0, PI / 2, 0, 0, 0.38, 0.38, 0.38); f.flat(G.cyl(1, 1, 12), woodD, 0, 0.9, 0, 0, 0, 0, 0.31, 0.02, 0.31); },
    crate(f, r) { const s = 0.7 + r() * 0.2; f.put(G.rbox(s, s, s, 0.04), '#7a5a36', 0, s / 2, 0, 0, r() * 0.6, 0); f.flat(G.rbox(s * 1.02, 0.08, s * 1.02, 0.02), woodD, 0, s * 0.85, 0, 0, 0, 0); f.flat(G.rbox(s * 1.02, 0.08, s * 1.02, 0.02), woodD, 0, s * 0.15, 0); },
    table(f, r, o) { const L = o.L || 2; f.put(G.rbox(L, 0.12, 1.0, 0.04), '#6a4a2e', 0, 0.85, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.put(G.rbox(0.1, 0.85, 0.1, 0.02), woodD, sx * (L / 2 - 0.15), 0.42, sz * 0.35); if (o.mugs !== false) for (let i = 0; i < 3; i++) { f.put(G.cyl(1, 0.9, 8), '#8a6a4a', -L / 3 + i * L / 3 + r() * 0.2, 1.0, (r() - 0.5) * 0.5, 0, 0, 0, 0.08, 0.2, 0.08); } },
    stool(f) { f.put(G.cyl(1, 1, 10), wood, 0, 0.5, 0, 0, 0, 0, 0.25, 0.08, 0.25); for (let i = 0; i < 3; i++) f.put(G.cyl(1, 1, 5), woodD, Math.cos(i * 2.1) * 0.15, 0.25, Math.sin(i * 2.1) * 0.15, 0, 0, 0, 0.03, 0.5, 0.03); },
    bench(f, r, o) { const L = o.L || 2; f.put(G.rbox(L, 0.1, 0.45, 0.03), wood, 0, 0.48, 0); f.put(G.rbox(L, 0.6, 0.08, 0.03), wood, 0, 0.85, -0.2); for (const s of [-1, 1]) f.put(G.rbox(0.1, 0.48, 0.4, 0.02), woodD, s * (L / 2 - 0.1), 0.24, 0); },
    bar(f, r, o, info) {
      const L = o.L || 6;
      f.put(G.rbox(L, 1.1, 0.9, 0.05), '#5a3a22', 0, 0.55, 0, 0, 0, 0, 1, 1, 1, { grad: [0.6, 1.05] });
      f.put(G.rbox(L + 0.2, 0.12, 1.05, 0.04), '#7a5232', 0, 1.15, 0);
      for (let i = 0; i < 8; i++) { const x = -L / 2 + 0.4 + i * (L - 0.8) / 7; f.put(G.cyl(0.4, 1, 8), ['#3a6a3a', '#6a2a2a', '#4a3a6a'][i % 3], x, 1.4, (r() - 0.5) * 0.4, 0, 0, 0, 0.09, 0.4, 0.09); }
      f.put(G.rbox(L, 2.2, 0.4, 0.04), '#4a3020', 0, 1.6, -1.2);
      for (const y of [1.4, 2.2]) for (let i = 0; i < 9; i++) f.glow(G.cyl(0.5, 1, 6), ['#5ad86a', '#d8a040', '#c04a3a', '#6a8ad8'][i % 4], -L / 2 + 0.4 + i * (L - 0.8) / 8, y, -1.0, 0, 0, 0, 0.08, 0.3, 0.08, 0.9);
    },
    hearth(f, r, o, info) {
      f.put(G.rbox(2.6, 2.6, 1.0, 0.08), '#6a6268', 0, 1.3, 0, 0, 0, 0, 1, 1, 1, { grad: [0.6, 1.1] });
      f.flat(G.rbox(1.5, 1.2, 0.4, 0.1), '#140c08', 0, 0.62, 0.35);
      f.put(G.rbox(3.0, 0.25, 1.2, 0.05), '#5a3a26', 0, 2.0, 0.05);
      f.glow(G.sphere(10), '#ff6a20', 0, 0.3, 0.45, 0, 0, 0, 0.6, 0.15, 0.25, 2.2);
      info.light = { x: 0, y: 0.8, z: 1.2, c: '#ff8a3a', i: 1.6, d: 9, flicker: 0.3 };
      info.flame = { x: 0, y: 0.2, z: 0.45, s: 1.1 };
    },
    candles(f, r, o, info) { for (let i = 0; i < 4; i++) { const x = (r() - 0.5) * 0.5, z = (r() - 0.5) * 0.4, h = 0.2 + r() * 0.3; f.put(G.cyl(1, 1, 8), '#efe6cf', x, h / 2, z, 0, 0, 0, 0.05, h, 0.05); f.glow(G.cone(6), '#ffc070', x, h + 0.06, z, 0, 0, 0, 0.03, 0.1, 0.03, 2.6); } info.light = { x: 0, y: 0.6, z: 0.3, c: '#ffb060', i: 0.7, d: 4.5, flicker: 0.2 }; },
    pillar(f, r, o) { const h = o.h || 4; f.put(G.cyl(1, 1, 12), o.color || '#6a6a74', 0, h / 2, 0, 0, 0, 0, 0.42, h, 0.42, { grad: [0.55, 1.1] }); f.put(G.rbox(1.1, 0.3, 1.1, 0.05), stoneD, 0, 0.15, 0); f.put(G.rbox(1.1, 0.3, 1.1, 0.05), stoneD, 0, h - 0.1, 0); if (r() < 0.5) f.decal(G.sphere(8), '#3a4a34', 0.2, h * 0.3, 0.38, 0, 0.5, 0, 0.25, 0.4, 0.06); },
    sarcophagus(f, r) { f.put(G.rbox(1.0, 0.8, 2.2, 0.06), '#7a7884', 0, 0.4, 0); f.put(G.rbox(1.1, 0.18, 2.3, 0.06), '#8a8894', 0, 0.88, 0, 0, 0, (r() - 0.5) * 0.08); f.put(G.sphere(10), '#8a8894', 0, 1.02, -0.7, 0, 0, 0, 0.22, 0.14, 0.2); f.put(G.rbox(0.4, 0.12, 1.1, 0.04), '#8a8894', 0, 1.0, 0.1); },
    pew(f) { f.put(G.rbox(2.6, 0.1, 0.5, 0.03), '#5a3a22', 0, 0.5, 0); f.put(G.rbox(2.6, 0.8, 0.1, 0.03), '#5a3a22', 0, 0.95, -0.22); for (const s of [-1, 1]) f.put(G.rbox(0.1, 1.1, 0.55, 0.03), '#4a2e1a', s * 1.3, 0.55, 0); },
    altar(f, r, o, info) { f.put(G.rbox(2.4, 1.1, 1.0, 0.05), '#8a8690', 0, 0.55, 0); f.put(G.rbox(2.5, 0.08, 1.1, 0.02), '#ece4d0', 0, 1.12, 0); f.flat(G.rbox(0.6, 1.0, 0.04, 0.01), '#7a1f1b', 0, 0.6, 0.52); f.metal(G.rbox(0.08, 0.6, 0.06, 0.02), '#d4ad48', 0, 1.45, 0); f.metal(G.rbox(0.36, 0.08, 0.06, 0.02), '#d4ad48', 0, 1.55, 0); for (const s of [-1, 1]) { f.put(G.cyl(1, 1, 8), '#efe6cf', s * 0.9, 1.35, 0, 0, 0, 0, 0.06, 0.4, 0.06); f.glow(G.cone(6), '#ffc070', s * 0.9, 1.6, 0, 0, 0, 0, 0.04, 0.12, 0.04, 2.6); } info.light = { x: 0, y: 1.8, z: 0.8, c: '#ffc070', i: 1.0, d: 6, flicker: 0.15 }; },
    stake(f, r) { const h = 1.6 + r() * 0.6; f.put(G.cyl(1, 1, 6), wood, 0, h / 2, 0, 0, 0, (r() - 0.5) * 0.2, 0.12, h, 0.12); f.put(G.cone(6), '#8a6a4a', 0, h + 0.2, 0, 0, 0, 0, 0.12, 0.4, 0.12); if (r() < 0.6) { f.put(G.sphere(10), PAL.bone, 0, h - 0.1, 0.12, 0, 0, 0, 0.17, 0.16, 0.16); for (const s of [-1, 1]) f.decal(G.sphere(6), '#120a06', s * 0.06, h - 0.08, 0.26, 0, 0, 0, 0.045, 0.05, 0.02); } },
    palisade(f, r, o) { const L = o.L || 5; const n = Math.round(L / 0.36); for (let i = 0; i < n; i++) { const h = 2.4 + r() * 0.5; f.put(G.cyl(1, 1, 6), i % 2 ? wood : woodD, -L / 2 + i * L / (n - 1), h / 2, 0, 0, 0, (r() - 0.5) * 0.06, 0.18, h, 0.18); f.put(G.cone(6), '#8a6a4a', -L / 2 + i * L / (n - 1), h + 0.22, 0, 0, 0, 0, 0.18, 0.45, 0.18); } f.put(G.rbox(L, 0.15, 0.1, 0.03), '#4a3020', 0, 1.6, 0.2); },
    banner(f, r, o) { const c = o.color || '#7a1f1b'; f.put(G.cyl(1, 1, 6), woodD, 0, 1.7, 0, 0, 0, 0, 0.06, 3.4, 0.06); f.put(G.rbox(1.0, 0.07, 0.07, 0.02), woodD, 0.4, 3.2, 0); f.put(G.rbox(0.8, 1.4, 0.03, 0.01), c, 0.45, 2.45, 0, 0, 0, 0.03); f.put(G.sphere(10), o.c2 || '#d4ad48', 0.45, 2.55, 0.03, 0, 0, 0, 0.2, 0.2, 0.03); },
    mushroom(f, r, o) { const c = o.c || '#7affc8'; for (let i = 0; i < 3; i++) { const x = (r() - 0.5) * 0.6, z = (r() - 0.5) * 0.6, h = 0.2 + r() * 0.3; f.put(G.cyl(0.8, 1, 6), '#d8d0c0', x, h / 2, z, 0, 0, 0, 0.04, h, 0.04); f.glow(G.hemi(), c, x, h, z, 0, 0, 0, 0.12 + r() * 0.06, 0.08, 0.12, 1.3); } },
    reeds(f, r) { for (let i = 0; i < 8; i++) { const x = (r() - 0.5) * 0.8, z = (r() - 0.5) * 0.5, h = 0.8 + r() * 0.6; f.put(G.cyl(1, 1, 3), '#5a6a3a', x, h / 2, z, (r() - 0.5) * 0.2, 0, (r() - 0.5) * 0.2, 0.015, h, 0.015, { ow: 0.1 }); if (r() < 0.5) f.put(G.capsule(0.04, 0.22), '#5a3a22', x, h + 0.2, z); } },
    barrow(f, r, o, info) {
      f.put(G.sphere(20), '#3a4430', 0, 0, 0, 0, 0, 0, 4.2, 2.2, 3.0, { grad: [0.6, 1.1] });
      for (const s of [-1, 1]) f.put(G.rbox(0.6, 2.0, 0.6, 0.1), '#6a6e7a', s * 0.9, 1.0, 2.5, 0, 0, s * 0.06);
      f.put(G.rbox(2.6, 0.5, 0.7, 0.1), '#6a6e7a', 0, 2.1, 2.5, 0, 0, 0.05);
      f.flat(G.rbox(1.2, 1.8, 0.2, 0.2), '#05060a', 0, 0.9, 2.6);
      f.glow(G.rbox(0.9, 1.4, 0.05, 0.1), '#2a2a6a', 0, 0.8, 2.66, 0, 0, 0, 1, 1, 1, 0.7);
      info.light = { x: 0, y: 1, z: 3.2, c: '#5a6aff', i: 0.6, d: 6 };
    },
    inkpool(f, r, o) { const s = o.s || 1; f.put(G.sphere(16), '#0a0c18', 0, 0.03, 0, 0, 0, 0, 1.2 * s, 0.07, 0.8 * s, { grad: false, ow: 0.3 }); f.shine(0.3 * s, 0.11, -0.1, 0.4 * s, 0.1, 0, -PI / 2, 0); for (let i = 0; i < 3; i++) f.put(G.sphere(8), '#141830', (r() - 0.5) * s, 0.06, (r() - 0.5) * 0.6 * s, 0, 0, 0, 0.14, 0.1, 0.14); },
    millwheel(f) { const g = f.at(0, 2.2, 0, 0, PI / 2, 0); g.put(G.torus(0.06, PI * 2, 24), woodD, 0, 0, 0, 0, 0, 0, 2.0, 2.0, 2.0); g.put(G.torus(0.06, PI * 2, 24), woodD, 0, 0, 0.5, 0, 0, 0, 2.0, 2.0, 2.0); for (let i = 0; i < 8; i++) { const a = i * PI / 4; g.put(G.rbox(0.12, 4.0, 0.1, 0.02), wood, 0, 0, 0.25, 0, 0, a); g.put(G.rbox(0.5, 0.06, 0.7, 0.02), wood, Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0.25, 0, 0, a); } g.put(G.cyl(1, 1, 10), iron, 0, 0, 0.25, PI / 2, 0, 0, 0.25, 1.0, 0.25); },
    shelf(f, r) { f.put(G.rbox(2.4, 2.6, 0.5, 0.04), woodD, 0, 1.3, 0); for (const y of [0.6, 1.3, 2.0]) { f.put(G.rbox(2.3, 0.06, 0.55, 0.02), wood, 0, y, 0.05); for (let i = 0; i < 6; i++) f.glow(i % 2 ? G.sphere(8) : G.cyl(0.6, 1, 6), ['#c94a3a', '#7bbf3a', '#9fe6ff', '#d8b04a', '#b06ad8'][Math.floor(r() * 5)], -0.95 + i * 0.38, y + 0.18, 0.1, 0, 0, 0, 0.1, 0.16, 0.1, 1.1); } },
    cauldron(f, r, o, info) { f.metal(G.sphere(14), '#2a2a30', 0, 0.5, 0, 0, 0, 0, 0.7, 0.55, 0.7); f.metal(G.torus(0.1, PI * 2, 18), '#3a3a40', 0, 0.92, 0, PI / 2, 0, 0, 0.62, 0.62, 0.62); f.glow(G.cyl(1, 1, 16), '#6aff5a', 0, 0.93, 0, 0, 0, 0, 0.56, 0.02, 0.56, 1.4); for (let i = 0; i < 3; i++) f.metal(G.cone(4), '#2a2a30', Math.cos(i * 2.1) * 0.5, 0.1, Math.sin(i * 2.1) * 0.5, PI, 0, 0, 0.08, 0.3, 0.08); info.light = { x: 0, y: 1.3, z: 0, c: '#6aff5a', i: 0.8, d: 5 }; },
    throne(f) { f.put(G.rbox(1.6, 1.0, 1.2, 0.08), '#5a3a22', 0, 0.5, 0); f.put(G.rbox(1.6, 2.4, 0.3, 0.06), '#4a2e1a', 0, 1.4, -0.55); for (let i = 0; i < 5; i++) { f.put(G.cone(5), '#8a6a4a', -0.7 + i * 0.35, 2.85, -0.55, 0, 0, (i - 2) * 0.15, 0.08, 0.5, 0.08); f.put(G.sphere(10), PAL.bone, -0.7 + i * 0.35, 2.55, -0.38, 0, 0, 0, 0.14, 0.13, 0.13); } f.put(G.rbox(1.4, 0.15, 1.0, 0.05), '#7a1f1b', 0, 1.05, 0.05); },
    treasure(f, r) { for (let i = 0; i < 14; i++) f.metal(G.cyl(1, 1, 8), '#e8c060', (r() - 0.5) * 1.2, 0.05 + r() * 0.25, (r() - 0.5) * 0.8, r() * 0.4, 0, r() * 0.4, 0.1, 0.03, 0.1); f.put(G.rbox(0.8, 0.5, 0.5, 0.05), '#6a4a2e', 0.5, 0.25, -0.2); f.metal(G.rbox(0.82, 0.08, 0.52, 0.02), '#c9a14a', 0.5, 0.42, -0.2); },
    boat(f) { f.put(G.rbox(1.2, 0.5, 3.4, 0.25), '#2a2420', 0, 0.2, 0); f.flat(G.rbox(1.0, 0.1, 3.0, 0.2), '#141010', 0, 0.42, 0); f.put(G.cone(6), '#2a2420', 0, 0.3, 1.9, PI / 2, 0, 0, 0.45, 0.8, 0.22); f.metal(G.cyl(1, 1, 5), '#4a3a2a', 0.3, 1.2, -1.2, 0, 0, -0.2, 0.03, 2.4, 0.03); },
    chapel(f, r, o, info) {
      const wall = '#7a7680';
      f.put(G.rbox(6, 4.5, 4, 0.1), wall, 0, 2.25, 0, 0, 0, 0, 1, 1, 1, { grad: [0.55, 1.05] });
      for (const s of [-1, 1]) f.put(G.rbox(4.0, 0.25, 4.6, 0.06), '#3a3a48', s * 1.55, 5.2, 0, 0, 0, -s * 0.7);
      f.put(G.rbox(1.8, 7.5, 1.8, 0.08), wall, 0, 3.75, 1.8, 0, 0, 0, 1, 1, 1, { grad: [0.55, 1.05] });
      f.put(G.cone(4), '#3a3a48', 0, 8.6, 1.8, 0, PI / 4, 0, 1.45, 2.4, 1.45);
      f.metal(G.rbox(0.1, 0.8, 0.1, 0.02), '#c9a14a', 0, 10.1, 1.8); f.metal(G.rbox(0.45, 0.1, 0.1, 0.02), '#c9a14a', 0, 10.2, 1.8);
      f.glow(G.cyl(1, 1, 16), '#ffcf7a', 0, 5.8, 2.72, PI / 2, 0, 0, 0.5, 0.06, 0.5, 1.6);
      f.glow(G.rbox(0.9, 1.8, 0.06, 0.4), '#d86a4a', 0, 3.2, 2.72, 0, 0, 0, 1, 1, 1, 1.4);
      f.put(G.rbox(1.2, 2.0, 0.1, 0.5), '#3a2414', 0, 1.0, 2.72);
      info.light = { x: 0, y: 3, z: 4, c: '#ffb070', i: 1.0, d: 9 };
    },
    gatehouse(f, r, o, info) {
      for (const s of [-1, 1]) { f.put(G.rbox(1.8, 4.6, 1.8, 0.08), '#6a6268', s * 2.4, 2.3, 0, 0, 0, 0, 1, 1, 1, { grad: [0.55, 1.08] }); f.put(G.cone(4), '#4a3a30', s * 2.4, 5.4, 0, 0, PI / 4, 0, 1.45, 1.6, 1.45); f.glow(G.rbox(0.3, 0.5, 0.05, 0.1), '#ffb050', s * 2.4, 3.4, 0.92, 0, 0, 0, 1, 1, 1, 1.8); }
      f.put(G.rbox(3.2, 0.8, 1.4, 0.06), '#5a5258', 0, 4.0, 0);
      for (let i = 0; i < 5; i++) f.metal(G.rbox(0.07, 2.8, 0.07, 0.02), iron, -1.2 + i * 0.6, 2.3, 0.2);
      info.light = { x: 0, y: 3.2, z: 1.5, c: '#ff9a40', i: 1.0, d: 7, flicker: 0.25 };
    },
    millhouse(f, r, o, info) {
      f.put(G.rbox(4.5, 3.4, 3.6, 0.06), '#8a7a62', 0, 1.7, 0, 0, 0, 0, 1, 1, 1, { grad: [0.6, 1.05] });
      for (const s of [-1, 1]) f.put(G.rbox(3.4, 0.22, 4.2, 0.06), '#5a4030', s * 1.25, 4.1, 0, 0, 0, -s * 0.75);
      f.glow(G.rbox(0.6, 0.6, 0.06, 0.03), '#ffb050', -1.0, 2.2, 1.82, 0, 0, 0, 1, 1, 1, 1.8);
      f.put(G.rbox(1.0, 1.8, 0.1, 0.04), woodD, 0.8, 0.9, 1.82);
      info.light = { x: -1, y: 2.2, z: 2.6, c: '#ffb060', i: 0.7, d: 6 };
    },
    bridgeplank(f, r, o) { const L = o.L || 26; const n = Math.round(L / 0.5); for (let i = 0; i < n; i++) f.put(G.rbox(0.46, 0.14, 8.6, 0.03), i % 3 ? '#6a4a2e' : '#5a3e26', -L / 2 + i * L / n, -0.07, 0, (r() - 0.5) * 0.02, 0, (r() - 0.5) * 0.02); for (const z of [-4.4, 4.4]) { f.put(G.rbox(L, 0.16, 0.16, 0.04), woodD, 0, 1.0, z); for (let i = 0; i <= 10; i++) f.put(G.rbox(0.18, 1.6, 0.18, 0.04), woodD, -L / 2 + i * L / 10, 0.3, z); } },
    skulls(f, r) { for (let i = 0; i < 6; i++) { const x = (r() - 0.5) * 0.9, z = (r() - 0.5) * 0.6, y = 0.12 + (i > 3 ? 0.22 : 0); f.put(G.sphere(10), PAL.bone, x, y, z, 0, r(), 0, 0.17, 0.16, 0.18); f.decal(G.sphere(6), '#120a06', x + 0.06, y + 0.02, z + 0.15, 0, 0, 0, 0.045, 0.05, 0.02); f.decal(G.sphere(6), '#120a06', x - 0.06, y + 0.02, z + 0.15, 0, 0, 0, 0.045, 0.05, 0.02); } },
    stilthouse(f, r, o, info) {
      const w = o.w || 3.4, d = 2.6, h = 2.2, lift = o.lift != null ? o.lift : 1.4, wall = o.wall || '#6a5a48', roof = o.roof || '#3a3a2a';
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.put(G.cyl(1, 1, 6), woodD, sx * (w / 2 - 0.2), lift / 2 - 0.2, sz * (d / 2 - 0.2), 0, 0, (r() - 0.5) * 0.12, 0.1, lift + 0.4, 0.1);
      f.put(G.rbox(w + 0.7, 0.14, d + 0.7, 0.03), wood, 0, lift, 0);
      f.put(G.rbox(w, h, d, 0.06), wall, 0, lift + h / 2, 0, 0, 0, (r() - 0.5) * 0.05, 1, 1, 1, { grad: [0.7, 1.05] });
      for (const s of [-1, 1]) f.put(G.rbox(w * 0.66, 0.18, d + 0.7, 0.05), roof, s * w * 0.27, lift + h + w * 0.17, 0, 0, 0, -s * 0.62, 1, 1, 1, { grad: [0.6, 1.1] });
      f.put(G.rbox(0.45, 1.2, 0.45, 0.04), '#5a5050', w * 0.3, lift + h + 0.9, -0.3, 0, 0, 0.12);
      f.put(G.rbox(0.7, 1.25, 0.1, 0.04), woodD, -w * 0.18, lift + 0.62, d / 2 + 0.03);
      if (o.lit !== false) { f.glow(G.rbox(0.55, 0.48, 0.06, 0.02), o.lc || '#ffb050', w * 0.24, lift + 1.35, d / 2 + 0.05, 0, 0, 0, 1, 1, 1, 1.9); info.light = { x: w * 0.24, y: lift + 1.3, z: d / 2 + 0.9, c: o.lc || '#ffb060', i: 0.75, d: 6 }; }
      if (lift > 0.5) { for (let i = 0; i < 4; i++) f.put(G.rbox(0.5, 0.05, 0.05, 0.01), woodD, -w * 0.18, 0.22 + i * (lift / 4), d / 2 + 0.5); for (const s of [-1, 1]) f.put(G.rbox(0.05, lift, 0.05, 0.01), woodD, -w * 0.18 + s * 0.25, lift / 2, d / 2 + 0.5); }
      if (o.skull) f.put(G.sphere(10), PAL.bone, -w * 0.18, lift + 1.45, d / 2 + 0.12, 0, 0, 0, 0.16, 0.15, 0.14);
    },
    dock(f, r, o) {
      const L = o.L || 8, D = o.D || 2.4, n = Math.round(L / 0.45);
      for (let i = 0; i < n; i++) f.put(G.rbox(0.42, 0.12, D, 0.03), i % 3 ? '#6a4a2e' : '#5a3e26', -L / 2 + i * L / n + 0.2, 0.3, 0, 0, 0, (r() - 0.5) * 0.03);
      for (let i = 0; i <= Math.floor(L / 2); i++) for (const s of [-1, 1]) f.put(G.cyl(1, 1, 6), woodD, -L / 2 + i * 2 + 0.1, 0.25, s * (D / 2), 0, 0, 0, 0.13, 1.4, 0.13);
    },
    lilies(f, r) { for (let i = 0; i < 6; i++) { const x = (r() - 0.5) * 2.4, z = (r() - 0.5) * 1.4, s = 0.25 + r() * 0.25; f.put(G.cyl(1, 1, 10), i % 2 ? '#3a6a3a' : '#2e5a30', x, 0.06, z, 0, r() * 3, 0, s, 0.02, s, { ow: 0.1 }); if (r() < 0.35) f.glow(G.sphere(8), r() < 0.5 ? '#f0d8ff' : '#fff2c0', x, 0.12, z, 0, 0, 0, 0.09, 0.07, 0.09, 1.6); } },
    bookshelf(f, r, o) {
      const W = o.w || 2.4, H = o.h || 4.2;
      f.put(G.rbox(W, H, 0.6, 0.04), o.wood || '#3a2418', 0, H / 2, 0, 0, 0, 0, 1, 1, 1, { grad: [0.6, 1.05] });
      const rows = Math.floor(H / 0.7);
      for (let k = 0; k < rows; k++) {
        const y = 0.3 + k * 0.7;
        f.put(G.rbox(W - 0.1, 0.06, 0.62, 0.02), '#5a3a22', 0, y - 0.04, 0.02);
        let x = -W / 2 + 0.12;
        while (x < W / 2 - 0.22) { const bw = 0.1 + r() * 0.12, bh = 0.38 + r() * 0.2; f.put(G.rbox(bw, bh, 0.42, 0.01), ['#6a1f1b', '#2a3a5a', '#3a5a2a', '#5a4a2a', '#4a2a4a', '#1e1a1a', '#8a6a2a'][Math.floor(r() * 7)], x + bw / 2, y + bh / 2, 0.08, 0, 0, r() < 0.08 ? 0.25 : 0, 1, 1, 1, { ow: 0.12 }); x += bw + 0.015; }
      }
      if (o.eyes) for (let i = 0; i < 2; i++) f.glow(G.sphere(6), '#ff4a3a', -0.2 + i * 0.4, H * 0.55, 0.36, 0, 0, 0, 0.05, 0.05, 0.03, 2.4);
    },
    teethdoor(f, r, o, info) {
      f.put(G.rbox(5.4, 6.4, 1.0, 0.1), o.color || '#4a3a3e', 0, 3.2, -0.25, 0, 0, 0, 1, 1, 1, { grad: [0.55, 1.05] });
      f.flat(G.rbox(3.0, 4.2, 0.2, 0.3), '#05030a', 0, 2.1, 0.32);
      f.glow(G.rbox(2.5, 3.7, 0.05, 0.3), '#4a0610', 0, 1.95, 0.42, 0, 0, 0, 1, 1, 1, 0.9);
      for (let i = 0; i <= 10; i++) { const a = PI * (i / 10); f.put(G.cone(6), '#efe6cf', Math.cos(a) * 1.5, 2.9 + Math.sin(a) * 1.3, 0.45, 0, 0, a + PI / 2, 0.15, 0.55 + (i % 2) * 0.2, 0.15); }
      for (let i = 0; i < 6; i++) f.put(G.cone(6), '#efe6cf', -1.25 + i * 0.5, 0.25, 0.45, 0, 0, 0, 0.15, 0.5 + (i % 2) * 0.2, 0.15);
      for (const s of [-1, 1]) f.glow(G.sphere(8), '#ffcf6a', s * 2.0, 5.4, 0.3, 0, 0, 0, 0.18, 0.12, 0.05, 2.2);
      info.light = { x: 0, y: 2, z: 1.6, c: '#ff3a4a', i: 1.0, d: 8, flicker: 0.12 };
    },
    pages(f, r, o) {
      const L = o.L || 6, y0 = o.y || 4.6, n = Math.round(L / 0.6);
      f.flat(G.cyl(1, 1, 3), '#2a2018', 0, y0, 0, 0, 0, PI / 2, 0.012, L, 0.012);
      for (let i = 0; i < n; i++) { const x = -L / 2 + 0.3 + i * 0.6, dy = r() * 0.5; f.put(G.rbox(0.42, 0.56, 0.012, 0.004), r() < 0.25 ? '#d8c8a8' : '#efe6d2', x, y0 - 0.35 - dy, (r() - 0.5) * 0.2, (r() - 0.5) * 0.3, (r() - 0.5) * 0.7, (r() - 0.5) * 0.3, 1, 1, 1, { ow: 0.1 }); for (let k = 0; k < 3; k++) f.decal(G.rbox(0.3, 0.02, 0.004, 0.001), o.ink || '#3a3040', x, y0 - 0.22 - dy - k * 0.1, 0.02); }
    },
    press(f) {
      f.put(G.rbox(1.6, 0.9, 1.2, 0.05), woodD, 0, 0.45, 0);
      for (const s of [-1, 1]) f.put(G.rbox(0.2, 2.6, 0.2, 0.04), wood, s * 0.7, 1.3, 0);
      f.put(G.rbox(1.8, 0.3, 0.4, 0.05), wood, 0, 2.55, 0);
      f.metal(G.cyl(1, 1, 10), iron, 0, 1.95, 0, 0, 0, 0, 0.08, 1.1, 0.08); f.metal(G.rbox(1.2, 0.2, 0.9, 0.04), iron, 0, 1.3, 0);
      f.metal(G.cyl(1, 1, 8), iron, 0, 2.15, 0, 0, 0, PI / 2, 0.05, 1.6, 0.05);
      f.put(G.rbox(1.0, 0.04, 0.8, 0.01), '#efe6d2', 0, 0.92, 0.1);
      f.flat(G.rbox(0.7, 0.01, 0.5, 0.01), '#1a1418', 0, 0.95, 0.1);
    },
    tower(f, r, o) {
      const h = o.h || 9, w = o.w || 2.2, c = o.color || '#d8ccb0', rows = Math.floor(h / 1.5);
      f.put(G.rbox(w, h, w, 0.08), c, 0, h / 2, 0, 0, 0, (r() - 0.5) * 0.05, 1, 1, 1, { grad: [0.55, 1.05] });
      for (let k = 0; k < rows; k++) f.flat(G.rbox(w * 1.03, 0.08, w * 1.03, 0.01), '#3a3040', 0, 1 + k * 1.5, 0);
      for (let k = 0; k < rows - 1; k++) for (const sx of [-0.25, 0.25]) if (r() < 0.75) f.glow(G.rbox(0.28, 0.42, 0.04, 0.02), r() < 0.8 ? '#ffc070' : '#9fe6ff', sx * w, 1.75 + k * 1.5, w / 2 + 0.03, 0, 0, 0, 1, 1, 1, 1.6);
      f.put(G.cone(4), o.roof || '#5a1a18', 0, h + 1.0, 0, 0, PI / 4, 0, w * 0.78, 2.2, w * 0.78, { grad: [0.6, 1.1] });
      for (let i = 0; i < 3; i++) f.put(G.rbox(0.5, 0.65, 0.02, 0.005), '#efe6d2', (r() - 0.5) * w * 0.7, h * (0.3 + r() * 0.5), w / 2 + 0.05, 0, 0, (r() - 0.5) * 0.6, 1, 1, 1, { ow: 0.1 });
    },
    bellframe(f, r, o) {
      for (const s of [-1, 1]) f.put(G.rbox(0.28, 3.8, 0.28, 0.04), woodD, s * 1.3, 1.9, 0, 0, 0, s * -0.05);
      f.put(G.rbox(3.2, 0.32, 0.36, 0.04), woodD, 0, 3.75, 0);
      f.metal(G.cone(14), o.color || '#7a6a3a', 0, 2.55, 0, 0, 0, 0, 0.95, 1.35, 0.95);
      f.metal(G.torus(0.1, PI * 2, 18), shade(o.color || '#7a6a3a', -0.15), 0, 1.92, 0, PI / 2, 0, 0, 0.92, 0.92, 0.92);
      f.metal(G.sphere(8), iron, 0, 1.85, 0, 0, 0, 0, 0.16, 0.16, 0.16);
      if (o.weed) for (let i = 0; i < 5; i++) f.put(G.cyl(1, 1, 3), '#3a5a3a', -0.6 + i * 0.3, 2.3, 0.6, 0, 0, (r() - 0.5) * 0.3, 0.025, 1.2, 0.025, { ow: 0.1 });
    },
    lanterns(f, r, o, info) {
      const L = o.L || 8, n = Math.max(3, Math.round(L / 1.1)), pt = (t) => [-L / 2 + t * L, 3.1 - Math.sin(t * PI) * 0.6];
      for (const s of [-1, 1]) f.put(G.cyl(1, 1, 6), woodD, s * L / 2, 1.6, 0, 0, 0, 0, 0.07, 3.2, 0.07);
      for (let i = 0; i < n; i++) { const [x1, y1] = pt(i / n), [x2, y2] = pt((i + 1) / n), a = Math.atan2(y2 - y1, x2 - x1); f.flat(G.cyl(1, 1, 3), '#2a2018', (x1 + x2) / 2, (y1 + y2) / 2, 0, 0, 0, PI / 2 + a, 0.012, Math.hypot(x2 - x1, y2 - y1), 0.012); }
      for (let i = 1; i < n; i++) { const [x, y] = pt(i / n); f.glow(G.sphere(10), (o.cols || ['#ffb050', '#ff7a50', '#ffd070', '#9fe6ff'])[i % 4], x, y - 0.22, 0, 0, 0, 0, 0.17, 0.22, 0.17, 2.0); }
      info.light = { x: 0, y: 2.5, z: 0.6, c: '#ffb060', i: 0.9, d: 8, flicker: 0.1 };
    },
    ship(f) {
      f.put(G.rbox(7, 1.5, 2.4, 0.5), '#3a2a20', 0, 0.45, 0, 0, 0, 0, 1, 1, 1, { grad: [0.6, 1.05] });
      f.put(G.cone(8), '#3a2a20', 4.1, 0.55, 0, 0, 0, -PI / 2, 1.1, 1.6, 0.9);
      f.put(G.rbox(7.2, 0.2, 2.5, 0.05), '#5a3e26', 0, 1.2, 0);
      for (let i = 0; i < 4; i++) f.glow(G.cyl(1, 1, 10), '#ffb050', -2.4 + i * 1.5, 0.75, 1.22, PI / 2, 0, 0, 0.14, 0.05, 0.14, 1.6);
      f.put(G.cyl(1, 1, 8), woodD, 0.3, 4.2, 0, 0, 0, 0, 0.12, 6, 0.12);
      f.put(G.rbox(3.4, 3.0, 0.06, 0.02), '#d8ccb0', 0.3, 4.6, 0.15, 0, 0, 0, 1, 1, 1, { ow: 0.2 });
      f.put(G.rbox(3.8, 0.12, 0.12, 0.02), woodD, 0.3, 6.15, 0.1);
      f.put(G.rbox(1.0, 0.6, 0.03, 0.01), '#2a5a7a', 0.8, 7.0, 0);
    },
    chandelier(f, r, o, info) {
      f.metal(G.torus(0.05, PI * 2, 20), '#c9a14a', 0, 4.6, 0, PI / 2, 0, 0, 1.0, 1.0, 1.0);
      f.flat(G.cyl(1, 1, 3), '#2a2018', 0, 5.6, 0, 0, 0, 0, 0.015, 2, 0.015);
      for (let i = 0; i < 8; i++) { const a = i * PI / 4; f.put(G.cyl(1, 1, 6), '#efe6cf', Math.cos(a), 4.75, Math.sin(a), 0, 0, 0, 0.04, 0.25, 0.04); f.glow(G.cone(6), o.c || '#ffc070', Math.cos(a), 4.98, Math.sin(a), 0, 0, 0, 0.05, 0.14, 0.05, 2.4); }
      info.light = { x: 0, y: 4.4, z: 0, c: o.c || '#ffc070', i: 1.2, d: 10, flicker: 0.1 };
    },
    rug(f, r, o) { f.flat(G.rbox(o.w || 3, 0.02, o.L || 8, 0.01), o.color || '#6a1a1a', 0, 0.02, 0); f.flat(G.rbox((o.w || 3) - 0.4, 0.025, (o.L || 8) - 0.4, 0.01), o.c2 || '#c9a14a', 0, 0.022, 0); f.flat(G.rbox((o.w || 3) - 0.6, 0.03, (o.L || 8) - 0.6, 0.01), o.color || '#6a1a1a', 0, 0.025, 0); },
    statue(f, r, o) {
      const c = o.color || '#8a8a90';
      f.put(G.rbox(1.2, 1.0, 1.2, 0.05), shade(c, -0.15), 0, 0.5, 0);
      f.put(G.cone(10), c, 0, 1.9, 0, 0, 0, 0, 0.55, 1.9, 0.55);
      f.put(G.sphere(12), c, 0, 3.15, 0, 0, 0, 0, 0.3, 0.32, 0.3);
      f.put(G.rbox(0.12, 1.6, 0.12, 0.03), c, 0.45, 2.6, 0.2, 0, 0, -0.2);
      if (o.book) f.put(G.rbox(0.5, 0.36, 0.12, 0.03), c, -0.3, 2.3, 0.4, -0.4, 0, 0);
      if (o.blind) f.flat(G.rbox(0.62, 0.08, 0.32, 0.02), '#1a1418', 0, 3.2, 0.06);
    },
    bigbook(f, r, o, info) {
      f.put(G.rbox(1.2, 1.6, 1.0, 0.06), woodD, 0, 0.8, 0);
      f.put(G.rbox(2.4, 0.16, 1.6, 0.04), '#4a1a1a', 0, 1.66, 0, -0.32, 0, 0);
      for (const s of [-1, 1]) f.put(G.rbox(1.15, 0.14, 1.45, 0.05), '#efe6d2', s * 0.6, 1.82, 0, -0.32, 0, s * 0.08);
      f.glow(G.rbox(2.0, 0.02, 1.1, 0.01), o.c || '#ffe0a0', 0, 1.93, 0.02, -0.32, 0, 0, 1, 1, 1, 1.2);
      info.light = { x: 0, y: 2.6, z: 0.6, c: o.c || '#ffe0a0', i: 1.4, d: 9 };
    },
    shears(f, r, o) {
      for (const s of [-1, 1]) { const g = f.at(0, 3.2, 0, 0, 0, s * 0.32); g.metal(G.rbox(0.28, 3.4, 0.08, 0.04), '#d8dce4', 0, 1.2, 0); g.metal(G.torus(0.08, PI * 2, 14), '#c9a14a', 0, -0.95, 0, 0, 0, 0, 0.45, 0.45, 0.45); }
      f.metal(G.sphere(8), '#c9a14a', 0, 3.2, 0.08, 0, 0, 0, 0.14, 0.14, 0.14);
    },
    gibbet(f, r, o) {
      f.put(G.rbox(0.3, 4.2, 0.3, 0.04), woodD, 0, 2.1, 0, 0, 0, 0.03);
      f.put(G.rbox(2.0, 0.26, 0.26, 0.04), woodD, 0.85, 4.0, 0);
      f.put(G.rbox(0.18, 1.2, 0.18, 0.03), woodD, 0.35, 3.45, 0, 0, 0, -0.8);
      f.flat(G.cyl(1, 1, 3), '#6a5a40', 1.6, 3.5, 0, 0, 0, 0, 0.015, 1.0, 0.015);
      if (o.cage !== false) { for (let i = 0; i < 8; i++) { const a = i * PI / 4; f.metal(G.cyl(1, 1, 4), iron, 1.6 + Math.cos(a) * 0.35, 2.4, Math.sin(a) * 0.35, 0, 0, 0, 0.02, 1.6, 0.02); } f.metal(G.torus(0.03, PI * 2, 12), iron, 1.6, 3.2, 0, PI / 2, 0, 0, 0.36, 0.36, 0.36); f.metal(G.torus(0.03, PI * 2, 12), iron, 1.6, 1.6, 0, PI / 2, 0, 0, 0.36, 0.36, 0.36); }
      f.put(G.ico(1), stone, 0, 0.15, 0, 0, 0, 0, 0.5, 0.3, 0.5);
    },
    lighthouse(f, r, o, info) {
      const h = o.h || 11;
      for (let k = 0; k < 6; k++) f.put(G.cyl(0.92, 1, 14), k % 2 ? '#e8e0d0' : '#8a2a2a', 0, k * h / 6 + h / 12, 0, 0, 0, 0, 1.3 - k * 0.08, h / 6, 1.3 - k * 0.08, { grad: [0.6, 1.05] });
      f.metal(G.cyl(1, 1, 12), iron, 0, h + 0.1, 0, 0, 0, 0, 1.0, 0.2, 1.0);
      f.glow(G.cyl(1, 1, 12), o.c || '#fff2b0', 0, h + 0.8, 0, 0, 0, 0, 0.7, 1.2, 0.7, 2.6);
      f.put(G.cone(12), '#2a2a30', 0, h + 1.9, 0, 0, 0, 0, 0.95, 0.9, 0.95);
      info.light = { x: 0, y: h + 0.8, z: 2, c: o.c || '#fff2b0', i: 1.6, d: 14 };
    },
    vat(f, r, o, info) {
      f.metal(G.cyl(1, 1, 16), o.color || '#3a3a44', 0, 1.1, 0, 0, 0, 0, 1.2, 2.2, 1.2);
      for (const y of [0.4, 1.8]) f.metal(G.torus(0.06, PI * 2, 18), iron, 0, y, 0, PI / 2, 0, 0, 1.22, 1.22, 1.22);
      f.glow(G.cyl(1, 1, 16), o.c || '#3a2a6a', 0, 2.21, 0, 0, 0, 0, 1.1, 0.02, 1.1, 1.2);
      f.metal(G.cyl(1, 1, 8), iron, 1.4, 2.6, 0, 0, 0, 0.6, 0.12, 1.6, 0.12);
      for (const s of [-1, 1]) f.put(G.rbox(0.2, 0.6, 0.2, 0.02), iron, s * 0.9, 0.3, 0.9);
      if (o.lit !== false) info.light = { x: 0, y: 2.6, z: 0, c: o.c || '#6a4aff', i: 0.6, d: 5 };
    },
    gear(f, r, o) {
      const R0 = o.r || 1.6, n = Math.round(R0 * 8), c = o.color || '#9a7a3a';
      const g = f.at(0, R0 + 0.2, 0, 0, 0, 0);
      g.metal(G.torus(0.16, PI * 2, 28), c, 0, 0, 0, 0, 0, 0, R0, R0, R0 * 1.4);
      for (let i = 0; i < n; i++) { const a = i * PI * 2 / n; g.metal(G.rbox(0.3, 0.32, 0.22, 0.03), c, Math.cos(a) * (R0 + 0.22), Math.sin(a) * (R0 + 0.22), 0, 0, 0, a); }
      for (let i = 0; i < 4; i++) g.metal(G.rbox(0.14, R0 * 2, 0.14, 0.02), shade(c, -0.1), 0, 0, 0, 0, 0, i * PI / 4);
      g.metal(G.sphere(10), shade(c, 0.1), 0, 0, 0, 0, 0, 0, 0.3, 0.3, 0.3);
      f.put(G.rbox(0.4, R0 + 0.3, 0.4, 0.04), iron, 0, (R0 + 0.3) / 2, -0.3);
    },
    clocktower(f, r, o, info) {
      const h = o.h || 9, w = o.w || 2.6, c = o.color || '#6a5a4a';
      f.put(G.rbox(w, h, w, 0.08), c, 0, h / 2, 0, 0, 0, 0, 1, 1, 1, { grad: [0.55, 1.05] });
      f.glow(G.cyl(1, 1, 24), '#f8e8b0', 0, h - 1.4, w / 2 + 0.04, PI / 2, 0, 0, w * 0.36, 0.05, w * 0.36, 1.4);
      f.flat(G.rbox(0.06, w * 0.3, 0.04, 0.01), '#1a1418', 0, h - 1.4 + w * 0.12, w / 2 + 0.1);
      f.flat(G.rbox(0.05, w * 0.22, 0.04, 0.01), '#1a1418', -w * 0.06, h - 1.4 + w * 0.08, w / 2 + 0.1, 0, 0, 0.6);
      f.put(G.cone(4), o.roof || '#3a3a5a', 0, h + 1.3, 0, 0, PI / 4, 0, w * 0.78, 2.6, w * 0.78, { grad: [0.6, 1.1] });
      info.light = { x: 0, y: h - 1.4, z: w / 2 + 1.5, c: '#f8e8b0', i: 0.8, d: 8 };
    },
    cage(f, r, o) {
      const s = o.s || 1;
      f.metal(G.rbox(1.6 * s, 0.12, 1.6 * s, 0.02), iron, 0, 0.06, 0); f.metal(G.rbox(1.6 * s, 0.12, 1.6 * s, 0.02), iron, 0, 2.0 * s, 0);
      for (let i = 0; i < 6; i++) for (const z of [-0.75, 0.75]) f.metal(G.cyl(1, 1, 4), iron, (-0.75 + i * 0.3) * s, s, z * s, 0, 0, 0, 0.03, 2 * s, 0.03);
      for (let i = 1; i < 5; i++) for (const x of [-0.75, 0.75]) f.metal(G.cyl(1, 1, 4), iron, x * s, s, (-0.75 + i * 0.3) * s, 0, 0, 0, 0.03, 2 * s, 0.03);
      if (o.ink) f.put(G.sphere(12), '#0a0c18', 0, 0.3, 0, 0, 0, 0, 0.6 * s, 0.3, 0.6 * s);
    },
    paperflower(f, r, o) {
      for (let i = 0; i < 5; i++) { const x = (r() - 0.5) * 1.2, z = (r() - 0.5) * 0.8, h = 0.5 + r() * 0.9; f.put(G.cyl(1, 1, 4), '#4a5a3a', x, h / 2, z, 0, 0, (r() - 0.5) * 0.2, 0.02, h, 0.02, { ow: 0.1 }); for (let k = 0; k < 5; k++) f.put(G.rbox(0.22, 0.02, 0.1, 0.005), o.c || (r() < 0.5 ? '#efe6d2' : '#e8b8c8'), x + Math.cos(k * 1.26) * 0.1, h, z + Math.sin(k * 1.26) * 0.1, 0, k * 1.26, 0.4, 1, 1, 1, { ow: 0.08 }); }
    },
  };

  /* ---------------- painted ground (soft, low-contrast, tileable) ---------------- */
  const GPAL = {
    moor: ['#5c6446', ['#6e7652', '#4c5438', '#5a4a5c', '#7a7a58'], '#6a4a6e'],
    grass: ['#4e6a3e', ['#5e7a48', '#3e5632', '#6a7a4a', '#4a5e38'], '#8a9a5a'],
    forest: ['#3e5238', ['#4a6040', '#2e4030', '#56603e', '#3a4a30'], '#6a5a3a'],
    dirt: ['#7a6448', ['#8a7254', '#62503a', '#806a4a', '#6a5a40'], '#9a8a6a'],
    mud: ['#5e5040', ['#6a5a48', '#4a3e30', '#665a44', '#56483a'], '#8a7a62'],
    bog: ['#3e4c34', ['#4a5a3a', '#2e3a26', '#56603a', '#3a4430'], '#7a8a4a'],
    snow: ['#d8dce4', ['#e8ecf2', '#c8ccd6', '#f0f2f6', '#b8bcc8'], '#9aa0b0'],
    white: ['#ece6d8', ['#f2ece0', '#e0d8c8', '#f6f2ea', '#d8d0c0'], '#c8c0b0'],
    paper: ['#b8ad94', ['#c8bea6', '#a89c82', '#d0c4aa', '#9a8e76'], '#5a4a6a'],
  };
  function paintGround(kind) {
    const P = GPAL[kind];
    return K3.tex('pground_' + kind, 512, 512, (g, w, h) => {
      const r = mulberry32(kind.length * 31 + 5);
      g.fillStyle = P[0]; g.fillRect(0, 0, w, h);
      const wrap = (fn) => { for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) fn(ox, oy); };
      for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h, rad = 40 + r() * 110, c = P[1][(r() * 4) | 0], a = 0.12 + r() * 0.14; wrap((ox, oy) => { const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad); gr.addColorStop(0, alpha(c, a)); gr.addColorStop(1, alpha(c, 0)); g.fillStyle = gr; g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2); }); }
      for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, rad = 6 + r() * 14; wrap((ox, oy) => { g.fillStyle = alpha(P[2], 0.18 + r() * 0.12); g.beginPath(); g.ellipse(x + ox, y + oy, rad, rad * 0.6, r() * 3, 0, TAU); g.fill(); }); }
      g.lineWidth = 1.4;
      for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h; g.strokeStyle = r() < 0.5 ? 'rgba(20,30,10,0.16)' : 'rgba(220,230,170,0.12)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 4, y - 3 - r() * 5); g.stroke(); }
      for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, s2 = 1.5 + r() * 3; g.fillStyle = 'rgba(30,24,18,0.25)'; g.beginPath(); g.ellipse(x + 1, y + 1, s2, s2 * 0.7, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(200,190,170,0.35)'; g.beginPath(); g.ellipse(x, y, s2, s2 * 0.7, 0, 0, TAU); g.fill(); }
    }, true);
  }

  /* ---------------- panoramas (painted 2010-style backdrops) ---------------- */
  function panorama(p) {
    const key = 'pano|' + JSON.stringify(p);
    return K3.tex(key, 2048, 512, (g) => {
      const W = 2048, H = 512, r = mulberry32(p.seed || 7);
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, p.sky[0]); gr.addColorStop(0.55, p.sky[1]); gr.addColorStop(1, p.sky[2]);
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let i = 0; i < (p.stars || 0); i++) { g.fillStyle = `rgba(255,250,230,${0.3 + r() * 0.6})`; const s = r() < 0.1 ? 2 : 1; g.fillRect(r() * W, r() * H * 0.5, s, s); }
      if (p.moon) { const [mx, my, mr] = p.moon; const hg = g.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4); hg.addColorStop(0, 'rgba(230,226,255,0.35)'); hg.addColorStop(1, 'rgba(230,226,255,0)'); g.fillStyle = hg; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8); g.fillStyle = '#efeadc'; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill(); g.fillStyle = 'rgba(160,150,170,0.35)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(mx + (r() - 0.5) * mr, my + (r() - 0.5) * mr, mr * (0.1 + r() * 0.2), 0, TAU); g.fill(); } }
      if (p.sun) { const [sx, sy, sr] = p.sun; const hg = g.createRadialGradient(sx, sy, 0, sx, sy, sr * 6); hg.addColorStop(0, 'rgba(255,230,170,0.9)'); hg.addColorStop(0.2, 'rgba(255,190,120,0.5)'); hg.addColorStop(1, 'rgba(255,160,120,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H); g.fillStyle = '#fff2c8'; g.beginPath(); g.arc(sx, sy, sr, 0, TAU); g.fill(); }
      if (p.glow) { const hg = g.createRadialGradient(p.glow[0], H, 0, p.glow[0], H, 500); hg.addColorStop(0, p.glow[1]); hg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H); }
      for (const L of p.layers) {
        g.fillStyle = L.c; g.beginPath(); g.moveTo(0, H);
        const base = L.base * H, amp = (L.amp || 0.05) * H;
        if (L.type === 'hills') { for (let x = 0; x <= W; x += 16) g.lineTo(x, base - Math.sin(x * 0.004 + L.seed) * amp - Math.sin(x * 0.011 + L.seed * 2) * amp * 0.4); }
        else if (L.type === 'mountains') { let x = 0; while (x <= W) { g.lineTo(x, base - r() * amp * 0.3); x += 40 + r() * 60; g.lineTo(x, base - amp * (0.5 + r() * 0.5)); x += 40 + r() * 60; } g.lineTo(W, base); }
        else if (L.type === 'trees') { let x = 0; g.lineTo(0, base); while (x <= W) { const h = amp * (0.6 + r() * 0.8), w = 18 + r() * 26; g.lineTo(x, base); g.lineTo(x + w / 2, base - h); g.lineTo(x + w, base); x += w * (0.5 + r() * 0.4); } g.lineTo(W, base); }
        else if (L.type === 'blobtrees') { let x = 0; g.lineTo(0, base); while (x <= W) { const h = amp * (0.6 + r() * 0.6), w = 50 + r() * 60; g.lineTo(x, base - h * 0.2); g.quadraticCurveTo(x + w / 2, base - h * 1.6, x + w, base - h * 0.2); x += w * 0.8; } g.lineTo(W, base); }
        else if (L.type === 'roofs') { let x = 0; g.lineTo(0, base); while (x <= W) { const w = 70 + r() * 70, h = amp * (0.4 + r() * 0.6); g.lineTo(x, base - h); g.lineTo(x + w / 2, base - h - w * 0.45); g.lineTo(x + w, base - h); if (r() < 0.5) { g.lineTo(x + w * 0.8, base - h - w * 0.2); g.lineTo(x + w * 0.8, base - h - w * 0.45); g.lineTo(x + w * 0.88, base - h - w * 0.45); g.lineTo(x + w * 0.88, base - h); } if (r() < 0.07) { g.lineTo(x + w, base - h - 160); g.lineTo(x + w + 15, base - h - 220); g.lineTo(x + w + 30, base - h - 160); g.lineTo(x + w + 30, base - h); } x += w + r() * 20; } g.lineTo(W, base); }
        else if (L.type === 'stakes') { let x = 0; g.lineTo(0, base); while (x <= W) { const h = amp * (0.7 + r() * 0.5); g.lineTo(x, base); g.lineTo(x + 6, base - h); g.lineTo(x + 12, base); x += 14 + r() * 8; } g.lineTo(W, base); }
        g.lineTo(W, H); g.closePath(); g.fill();
        if (L.lights) { for (let i = 0; i < L.lights; i++) { const x = r() * W, y = base - r() * amp * 0.7; g.fillStyle = 'rgba(255,190,90,0.9)'; g.fillRect(x, y, 3, 4); const hg = g.createRadialGradient(x, y, 0, x, y, 14); hg.addColorStop(0, 'rgba(255,170,80,0.35)'); hg.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = hg; g.fillRect(x - 14, y - 14, 28, 28); } }
      }
      if (p.mist) { const mg = g.createLinearGradient(0, H * 0.62, 0, H); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(1, p.mist); g.fillStyle = mg; g.fillRect(0, H * 0.62, W, H * 0.38); }
    });
  }

  /* ---------------- scene table ---------------- */
  const NIGHT = { sky: ['#0c0a1c', '#22183a', '#4a3450'], stars: 260, moon: [520, 120, 34] };
  const SCENES = {
    blank: { outdoor: true, ground: 'none', groundC: '#1a1820', pano: { sky: ['#080608', '#120e14', '#1a1418'], layers: [] }, fog: ['#100c12', 8, 30], hemi: ['#6a5a7a', '#1a1418', 0.4], key: ['#d8c8ff', 0.6], build() {} },
    moor: {
      outdoor: true, ground: 'moor', groundC: '#56604a', pano: Object.assign({}, NIGHT, { layers: [{ type: 'hills', c: '#2a2236', base: 0.72, amp: 0.08, seed: 1, lights: 7 }, { type: 'hills', c: '#1c1826', base: 0.82, amp: 0.06, seed: 4 }], mist: 'rgba(120,110,150,0.4)' }),
      fog: ['#2a2438', 18, 46], hemi: ['#9a90c8', '#3a3028', 0.62], key: ['#c8c4ff', 0.95, -6, 10, 4], particles: 'fireflies',
      build(add) {
        add('barrow', 2, -11, { ry: 0.1 });
        add('inkpool', 1.5, -7.5, { o: { s: 1.4 } });
        for (let i = 0; i < 9; i++) { const a = PI * 0.15 + (i / 8) * PI * 0.7; add('standing', Math.cos(a) * 15, -Math.sin(a) * 9.5 + 1, { seed: i + 3, ry: a, o: i % 3 === 0 ? { rune: '#7a8aff' } : {} }); }
        add('deadtree', -13.5, -7, { seed: 2, s: 1.2 }); add('deadtree', 14, -8.5, { seed: 5 }); add('deadtree', -9, -10, { seed: 8, s: 0.9 });
        for (let i = 0; i < 14; i++) add(i % 2 ? 'heather' : 'tuft', -14 + i * 2.1 + (i % 3), -6 - (i % 4) * 0.9, { seed: i + 10, o: { color: '#5a6040' } });
        for (let i = 0; i < 6; i++) add('rock', (i % 2 ? 1 : -1) * (12.5 + i * 0.4), -2 + i * 1.2, { seed: i + 30 });
        for (let i = 0; i < 8; i++) add(i % 2 ? 'heather' : 'tuft', (i % 2 ? 1 : -1) * (12 + (i % 3)), 2 + (i % 4) * 0.8, { seed: i + 50 });
      },
    },
    dawn: {
      outdoor: true, ground: 'moor', groundC: '#7a7a58', pano: { sky: ['#3a4a7a', '#d88a6a', '#ffd0a0'], sun: [1100, 400, 40], layers: [{ type: 'hills', c: '#4a3a4a', base: 0.78, amp: 0.07, seed: 2 }, { type: 'roofs', c: '#3a2a3a', base: 0.86, amp: 0.05, lights: 0 }] },
      fog: ['#c89a8a', 20, 55], hemi: ['#ffd8b8', '#4a3a30', 0.85], key: ['#ffc890', 1.25, 8, 8, -2], particles: 'motes',
      build(add) { for (let i = 0; i < 7; i++) { const a = PI * 0.2 + (i / 6) * PI * 0.6; add('standing', Math.cos(a) * 15, -Math.sin(a) * 9 + 1, { seed: i + 3, ry: a }); } add('oak', -13, -8, { seed: 3, o: { leaf: '#4a6a3a' } }); add('oak', 13, -9, { seed: 6, o: { leaf: '#4a6a3a' } }); for (let i = 0; i < 12; i++) add('tuft', -13 + i * 2.3, -6.5 - (i % 3), { seed: i, o: { color: '#7a8a4a' } }); },
    },
    wood: {
      outdoor: true, ground: 'forest', groundC: '#3a4a34', pano: { sky: ['#06100e', '#0e2420', '#1e3a34'], stars: 60, layers: [{ type: 'trees', c: '#0e1e1c', base: 0.8, amp: 0.35, seed: 3 }, { type: 'trees', c: '#081412', base: 0.92, amp: 0.3, seed: 5 }], mist: 'rgba(80,140,130,0.35)' },
      fog: ['#14302c', 12, 40], hemi: ['#6aa8a0', '#1a2420', 0.55], key: ['#a8e8d8', 0.75, -4, 10, 2], particles: 'fireflies',
      build(add) {
        for (let i = 0; i < 12; i++) add(i % 3 === 1 ? 'oak' : 'pine', -15 + i * 2.7, -7.5 - (i % 3) * 1.6, { seed: i + 1, s: 1 + (i % 2) * 0.25 });
        for (let i = 0; i < 6; i++) { add(i % 2 ? 'oak' : 'pine', (i % 2 ? 1 : -1) * (14 + (i % 3)), -3 + i * 1.4, { seed: i + 20 }); }
        for (let i = 0; i < 8; i++) add('mushroom', -12 + i * 3.2, -5.5 - (i % 2), { seed: i, o: { c: i % 2 ? '#7affc8' : '#b0a0ff' } });
        for (let i = 0; i < 10; i++) add('bush', (i % 2 ? 1 : -1) * (12.5 + (i % 3) * 0.8), -5 + i, { seed: i + 40 });
        add('rock', -4, -6, { seed: 2 }); add('rock', 7, -6.5, { seed: 3, o: { color: '#5a6a5a' } });
      },
    },
    village: {
      outdoor: true, ground: 'cobble', groundC: '#7a7468', pano: Object.assign({}, NIGHT, { layers: [{ type: 'roofs', c: '#1e1828', base: 0.84, amp: 0.12, seed: 2, lights: 18 }], mist: 'rgba(90,80,110,0.4)' }),
      fog: ['#28203a', 18, 48], hemi: ['#9a90c8', '#3a3028', 0.55], key: ['#c8c4ff', 0.75, -6, 10, 4],
      build(add) {
        add('house', -9.5, -10, { seed: 1, ry: 0.15 }); add('house', -2.5, -11.2, { seed: 2, o: { w: 5 } }); add('house', 5, -10.6, { seed: 3, ry: -0.08 }); add('house', 12, -9, { seed: 4, ry: -0.35, o: { lit: false, wall: '#b8b0a0' } });
        add('house', -15.5, -4, { seed: 5, ry: 1.2 }); add('house', 16, -3, { seed: 6, ry: -1.3 });
        add('well', 1, -6.5);
        add('lamp', -6, -5.8); add('lamp', 8, -5.6, { ry: PI });
        add('barrel', -12.5, -5); add('barrel', -13.1, -4.3); add('crate', 12.8, -4.5, { seed: 2 }); add('crate', 13.5, -5.2, { seed: 5 });
        add('fence', -13.5, 1, { ry: PI / 2, o: { L: 4 } }); add('fence', 13.5, 1.5, { ry: PI / 2, o: { L: 4 } });
      },
    },
    gate: {
      outdoor: true, ground: 'dirt', groundC: '#6a5e4c', pano: Object.assign({}, NIGHT, { layers: [{ type: 'hills', c: '#221a2c', base: 0.76, amp: 0.06, seed: 3 }, { type: 'blobtrees', c: '#161420', base: 0.86, amp: 0.1, seed: 2 }], mist: 'rgba(90,80,110,0.35)' }),
      fog: ['#28203a', 16, 46], hemi: ['#9a90c8', '#3a3028', 0.55], key: ['#c8c4ff', 0.8, -6, 10, 4],
      build(add) {
        add('gatehouse', 0, -9.5); add('palisade', -8.5, -9.5, { o: { L: 9 } }); add('palisade', 8.5, -9.5, { o: { L: 9 } });
        add('torch', -3.6, -7.5); add('torch', 3.6, -7.5);
        add('banner', -13, -6, { o: { color: '#2f4f7a' } }); add('banner', 13, -6, { o: { color: '#2f4f7a' } });
        add('barrel', 11, -6.8); add('crate', -11, -7, { seed: 3 }); add('rock', -14, 0, { seed: 7 }); add('tuft', 14, 1, { seed: 3 });
      },
    },
    churchyard: {
      outdoor: true, ground: 'grass', groundC: '#4a5440', pano: Object.assign({}, NIGHT, { moon: [1300, 110, 40], layers: [{ type: 'hills', c: '#1e1a28', base: 0.8, amp: 0.05, seed: 6 }], mist: 'rgba(110,140,150,0.45)' }),
      fog: ['#202a34', 14, 42], hemi: ['#90a8c8', '#2a2a28', 0.55], key: ['#c0d0ff', 0.85, 6, 10, 3], particles: 'wisps',
      build(add) {
        add('chapel', 3, -13.5);
        add('oak', -11, -8.5, { seed: 9, o: { leaf: '#1e2e24' }, s: 1.25 });
        for (let i = 0; i < 18; i++) { const x = -14 + (i % 9) * 3.4 + (i > 8 ? 1.5 : 0), z = -5.6 - Math.floor(i / 9) * 1.8; if (Math.abs(x - 3) < 2 && z < -6) continue; add('grave', x, z, { seed: i + 2, ry: (i % 3 - 1) * 0.12 }); }
        for (let i = 0; i < 4; i++) add('grave', (i % 2 ? 1 : -1) * (13 + (i > 1 ? 1.2 : 0)), -1 + i * 1.3, { seed: i + 40, ry: PI / 2 * (i % 2 ? -1 : 1) });
        add('ironfence', -8, -10.5, { o: { L: 8 } }); add('ironfence', 12, -10.5, { o: { L: 6 } });
        add('deadtree', 14.5, -7, { seed: 4 }); add('candles', -2, -5.5, { seed: 3 });
      },
    },
    mill: {
      outdoor: true, ground: 'grass', groundC: '#56603e', pano: Object.assign({}, NIGHT, { layers: [{ type: 'hills', c: '#241e30', base: 0.74, amp: 0.07, seed: 8 }, { type: 'blobtrees', c: '#141420', base: 0.86, amp: 0.1, seed: 4 }] }),
      fog: ['#28203a', 16, 46], hemi: ['#9a90c8', '#3a3028', 0.58], key: ['#c8c4ff', 0.85, -6, 10, 4], water: { z: -9, w: 40, d: 3 }, particles: 'fireflies',
      build(add) { add('millhouse', -2, -12.5); add('millwheel', 1.4, -10.6); add('reeds', -8, -7.6, { seed: 2 }); add('reeds', 9, -7.8, { seed: 5 }); add('reeds', 13, -7.5, { seed: 9 }); add('oak', -13, -8, { seed: 4 }); add('oak', 13.5, -9, { seed: 7 }); add('fence', -9, -6.4, { o: { L: 4 } }); add('lamp', 6, -6.2); add('crate', -13, -4, { seed: 1 }); add('barrel', 13, -4.5); },
    },
    river: {
      outdoor: true, ground: 'mud', groundC: '#5a5440', pano: Object.assign({}, NIGHT, { moon: [900, 140, 30], layers: [{ type: 'mountains', c: '#262038', base: 0.7, amp: 0.25, seed: 2 }, { type: 'trees', c: '#14141e', base: 0.84, amp: 0.14, seed: 9 }], mist: 'rgba(110,120,160,0.5)' }),
      fog: ['#202436', 16, 46], hemi: ['#90a0d0', '#2a2820', 0.58], key: ['#c0ccff', 0.85, -6, 10, 4], water: { z: -9.5, w: 60, d: 7 }, particles: 'motes',
      build(add) { add('boat', 6, -9.5, { ry: 1.4 }); for (let i = 0; i < 6; i++) add('reeds', -14 + i * 5.5, -6.2 - (i % 2) * 0.5, { seed: i + 3 }); add('deadtree', -13, -5, { seed: 6 }); add('rock', 13, -5, { seed: 2 }); add('rock', -6, -6.5, { seed: 9 }); add('lamp', -9, -5.6, { o: { c: '#9fd0ff' } }); },
    },
    bridge: {
      outdoor: true, ground: 'none', groundC: '#3a3a40', pano: Object.assign({}, NIGHT, { layers: [{ type: 'mountains', c: '#262038', base: 0.72, amp: 0.25, seed: 5 }, { type: 'trees', c: '#14141e', base: 0.86, amp: 0.12, seed: 3 }], mist: 'rgba(110,120,160,0.55)' }),
      fog: ['#202436', 14, 44], hemi: ['#90a0d0', '#2a2820', 0.6], key: ['#c0ccff', 0.85, -6, 10, 4], water: { z: 0, w: 120, d: 60, y: -1.4 },
      build(add) { add('bridgeplank', 0, -0.5, { o: { L: 34 } }); add('torch', -6, -5.2); add('torch', 6, -5.2); add('rock', -14, -10, { seed: 1, o: { s: 2.2 } }); add('rock', 15, -11, { seed: 4, o: { s: 2.5 } }); },
    },
    camp: {
      outdoor: true, ground: 'dirt', groundC: '#5a4a3a', pano: { sky: ['#0c0810', '#2a1418', '#6a2a1a'], stars: 80, glow: [1024, 'rgba(255,120,40,0.45)'], layers: [{ type: 'hills', c: '#1e1418', base: 0.76, amp: 0.06, seed: 1 }, { type: 'stakes', c: '#120c0c', base: 0.9, amp: 0.12, seed: 2 }] },
      fog: ['#2a1814', 16, 44], hemi: ['#c8907a', '#3a2418', 0.5], key: ['#ffb080', 0.6, 4, 9, 3], particles: 'embers',
      build(add) {
        add('campfire', 0, -7.5, { o: { big: true } });
        add('tent', -9, -10, { seed: 1 }); add('tent', -3.5, -12, { seed: 2, o: { color: '#6a4a30' } }); add('tent', 5, -11.5, { seed: 3 }); add('tent', 11, -9.5, { seed: 4, o: { color: '#5a3a2a' } });
        for (let i = 0; i < 9; i++) add('stake', -14 + i * 3.5, -14, { seed: i });
        add('banner', -13, -6.5, { o: { color: '#5a1a16', c2: '#e8d8a0' } }); add('banner', 13, -6.5, { o: { color: '#5a1a16', c2: '#e8d8a0' } });
        add('skulls', 8, -6.5, { seed: 2 }); add('crate', -12, -5, { seed: 4 }); add('barrel', 12.5, -4);
      },
    },
    tent: {
      outdoor: false, ground: 'rug', groundC: '#5a3a2a', walls: { tex: 'hide', c: '#6a4a32' },
      fog: ['#1e120c', 16, 40], hemi: ['#d8a080', '#3a2418', 0.45], key: ['#ffb080', 0.45, 3, 9, 4], particles: 'embers',
      build(add) { add('throne', 0, -8.5); add('treasure', 4, -8, { seed: 2 }); add('treasure', -4.5, -7.5, { seed: 5 }); add('torch', -7, -7.6); add('torch', 7, -7.6); add('skulls', -10, -5, { seed: 3 }); add('banner', 11, -6.5, { o: { color: '#5a1a16' } }); add('crate', 12.5, -3, { seed: 1 }); },
    },
    campback: null,
    tavern: {
      outdoor: false, ground: 'planks', groundC: '#7a5a3e', walls: { tex: 'timber', c: '#c8b088' },
      fog: ['#1e140c', 18, 44], hemi: ['#d8b890', '#3a2418', 0.5], key: ['#ffd0a0', 0.5, 3, 9, 6], particles: 'motes',
      build(add) { add('bar', -2, -8.3, { o: { L: 8 } }); add('hearth', 9, -9); add('table', -11, -4, { o: { L: 2 } }); add('table', 12, -3, { o: { L: 2 } }); add('stool', -11, -2.6); add('stool', 12, -1.6); add('stool', -2.5, -6.5); add('stool', 0.5, -6.4); add('barrel', -13.5, -8); add('barrel', -12.8, -8.6); add('candles', -11, -4, { seed: 2 }); add('lamp', 4.5, -7.3, { o: { c: '#ffc070' } }); },
    },
    shop: {
      outdoor: false, ground: 'planks', groundC: '#6a5040', walls: { tex: 'timber', c: '#b8a080' },
      fog: ['#1a120e', 18, 44], hemi: ['#d0b0d0', '#2a1c18', 0.5], key: ['#ffd8b0', 0.5, 3, 9, 6], particles: 'motes',
      build(add) { add('shelf', -6, -9); add('shelf', -2, -9.2, { seed: 4 }); add('shelf', 6, -9, { seed: 7 }); add('cauldron', 2.5, -7.2); add('table', -10, -5, { o: { L: 2.2, mugs: false } }); add('candles', -10, -5, { seed: 3 }); add('barrel', 12, -6); add('crate', 12.6, -4.8, { seed: 3 }); },
    },
    chapel: {
      outdoor: false, ground: 'flag', groundC: '#7a7680', walls: { tex: 'stone', c: '#8a8690', window: '#d86a4a' },
      fog: ['#14121c', 18, 44], hemi: ['#a8a0c8', '#2a2428', 0.5], key: ['#d0c8ff', 0.6, -3, 9, 6], particles: 'motes',
      build(add) { add('altar', 0, -9); for (let i = 0; i < 4; i++) { add('pew', -7, -5.2 + i * 1.9 - 4, {}); add('pew', 7, -5.2 + i * 1.9 - 4, {}); } add('pillar', -11, -8, { o: { h: 6 } }); add('pillar', 11, -8, { o: { h: 6 } }); add('candles', -4, -8.5, { seed: 4 }); add('candles', 4, -8.5, { seed: 6 }); },
    },
    crypt: {
      outdoor: false, ground: 'crypt', groundC: '#5a5a64', walls: { tex: 'stone', c: '#5a5a66' },
      fog: ['#0c1410', 14, 36], hemi: ['#7ab89a', '#141818', 0.42], key: ['#9affc0', 0.35, 3, 9, 6], particles: 'wisps', tint: '#7bd389',
      build(add) { for (let i = 0; i < 4; i++) { add('pillar', -12 + i * 8, -8.5, { o: { h: 5.5 } }); } add('pillar', -13.5, -1, { o: { h: 5.5 } }); add('pillar', 13.5, -1, { o: { h: 5.5 } }); add('sarcophagus', -6, -7.5, { ry: PI / 2 }); add('sarcophagus', 6, -7.5, { ry: PI / 2, seed: 3 }); add('candles', -2.5, -7.5, { seed: 7 }); add('candles', 2.5, -7.8, { seed: 9 }); add('skulls', 11.5, -5.5, { seed: 4 }); add('skulls', -11.5, -4.5, { seed: 8 }); },
    },
    cellar: {
      outdoor: false, ground: 'flag', groundC: '#5a5450', walls: { tex: 'stone', c: '#6a625c' },
      fog: ['#0e0c10', 14, 36], hemi: ['#a090b0', '#1a1418', 0.42], key: ['#d8c8ff', 0.4, 3, 9, 6], particles: 'motes',
      build(add) { for (let i = 0; i < 5; i++) add('barrel', -13 + i * 1.1, -8.4 + (i % 2) * 0.6); add('crate', 9, -8.5, { seed: 1 }); add('crate', 10, -8.6, { seed: 2 }); add('crate', 9.5, -7.6, { seed: 3 }); add('inkpool', 3, -6.5, { o: { s: 1.2 } }); add('inkpool', -6, -5, { seed: 3, o: { s: 0.8 } }); add('candles', -2, -8.5, { seed: 5 }); add('pillar', -6, -9.5, { o: { h: 5 } }); add('pillar', 6, -9.5, { o: { h: 5 } }); },
    },
  };
  SCENES.campback = Object.assign({}, SCENES.camp, { build(add) { add('tent', -6, -8.5, { seed: 2 }); add('tent', 2, -10, { seed: 3, o: { color: '#6a4a30' } }); add('tent', 9, -8.8, { seed: 4 }); add('campfire', 13, -12, { o: { big: true } }); for (let i = 0; i < 9; i++) add('stake', -14 + i * 3.5, -14, { seed: i + 3 }); add('crate', -12, -5, { seed: 4 }); add('skulls', -9, -6, { seed: 6 }); add('barrel', 12.5, -4); } });


  SCENES.fen = {
    outdoor: true, ground: 'bog', groundC: '#3e4a30', pano: { sky: ['#050c08', '#10241a', '#2a4430'], stars: 40, moon: [1400, 130, 26], layers: [{ type: 'blobtrees', c: '#0e1e14', base: 0.8, amp: 0.16, seed: 3 }, { type: 'trees', c: '#08140c', base: 0.9, amp: 0.12, seed: 6 }], mist: 'rgba(120,190,130,0.5)' },
    fog: ['#18302a', 11, 38], hemi: ['#8ac0a0', '#1a2418', 0.58], key: ['#b8ffd0', 0.75, -4, 10, 2], water: { z: -9.5, w: 70, d: 7, c: 0x4a6a4a }, particles: 'wisps', tint: '#7bd389',
    build(add) {
      add('stilthouse', 9, -11.5, { seed: 2, ry: -0.2, o: { lc: '#a6ff5a', roof: '#2a3a24', wall: '#4a4a3a', skull: true } });
      add('deadtree', -12, -8, { seed: 3, s: 1.3 }); add('deadtree', -5, -10.5, { seed: 7 }); add('deadtree', 14, -6, { seed: 9, s: 1.1 }); add('deadtree', 3, -11, { seed: 12, s: 0.9 });
      for (let i = 0; i < 7; i++) add('reeds', -14 + i * 4.6, -6.4 - (i % 2) * 0.6, { seed: i + 3 });
      add('lilies', -6, -8, { seed: 2 }); add('lilies', 4, -7.8, { seed: 5 }); add('lilies', 12, -8.4, { seed: 8 });
      add('inkpool', -9, -4, { seed: 3, o: { s: 1.1 } }); add('inkpool', 11, -2, { seed: 5, o: { s: 0.8 } });
      for (let i = 0; i < 5; i++) add('mushroom', (i % 2 ? 1 : -1) * (12 + i * 0.5), -4 + i * 1.4, { seed: i + 4, o: { c: '#a6ff5a' } });
      add('rock', -13.5, 0.5, { seed: 4, o: { color: '#4a5048' } }); add('tuft', 13, 2, { seed: 6, o: { color: '#4a5a30' } });
    },
  };
  SCENES.hut = {
    outdoor: false, ground: 'planks', groundC: '#4a3a2a', walls: { tex: 'timber', c: '#6a6048' },
    fog: ['#0c140c', 14, 36], hemi: ['#a8d8a0', '#1a2014', 0.45], key: ['#c0ffb0', 0.4, 3, 9, 6], particles: 'motes', tint: '#a6ff5a',
    build(add) { add('cauldron', 0, -7.5); add('shelf', -7, -9.2, { seed: 9 }); add('shelf', 7, -9.2, { seed: 11 }); add('skulls', -10.5, -6, { seed: 5 }); add('candles', 4, -8, { seed: 6 }); add('candles', -4, -8.3, { seed: 7 }); add('table', 11, -5, { o: { L: 2, mugs: false } }); add('mushroom', -12, -4, { seed: 2, o: { c: '#a6ff5a' } }); add('pages', 0, -6, { seed: 3, o: { L: 7, y: 4.4, ink: '#2a4a2a' } }); },
  };
  SCENES.monastery = {
    outdoor: true, ground: 'flag', groundC: '#6a7076', pano: { sky: ['#0a0e16', '#1c2a3a', '#3a5060'], stars: 90, moon: [700, 120, 30], layers: [{ type: 'mountains', c: '#1a2430', base: 0.72, amp: 0.2, seed: 7 }, { type: 'hills', c: '#121a22', base: 0.85, amp: 0.05, seed: 2 }], mist: 'rgba(130,170,190,0.5)' },
    fog: ['#1a2632', 13, 42], hemi: ['#9ab8d0', '#1e2428', 0.55], key: ['#c8e0ff', 0.8, 6, 10, 3], water: { z: -9.5, w: 60, d: 6, c: 0x5a7a8a }, particles: 'motes',
    build(add) {
      add('chapel', 1, -14, { ry: 0.05 }); add('bellframe', -8, -9, { seed: 2, o: { color: '#5a6a4a', weed: true } });
      for (let i = 0; i < 6; i++) add('pillar', -13 + i * 5.2, -7.6 - (i % 2) * 0.4, { seed: i, o: { h: 1.5 + ((i * 7) % 5) * 0.8, color: '#7a8088' } });
      add('statue', 8, -8.5, { seed: 1, o: { color: '#6a7a7a', blind: true } });
      add('reeds', -12, -6, { seed: 4 }); add('reeds', 12, -6.4, { seed: 6 }); add('lilies', 3, -8, { seed: 9 });
      add('candles', -3, -6.5, { seed: 2 }); add('candles', 4.5, -6.8, { seed: 4 }); add('rock', 14, 0, { seed: 3, o: { color: '#6a7076' } }); add('rock', -14, 1, { seed: 6, o: { color: '#6a7076' } });
    },
  };
  SCENES.saltmere = {
    outdoor: true, ground: 'planks', groundC: '#6a5a46', pano: { sky: ['#070a18', '#18223a', '#3a3a58'], stars: 160, moon: [1500, 110, 30], layers: [{ type: 'roofs', c: '#141a2a', base: 0.8, amp: 0.16, seed: 4, lights: 40 }, { type: 'stakes', c: '#0c101a', base: 0.9, amp: 0.05, seed: 9 }], mist: 'rgba(90,110,150,0.45)' },
    fog: ['#1a2236', 16, 46], hemi: ['#9aa8d0', '#2a2620', 0.58], key: ['#c0ccff', 0.85, -6, 10, 4], water: { z: -11, w: 80, d: 6 }, particles: 'motes',
    build(add) {
      add('ship', 5, -12.5, { seed: 1, ry: 0.06 });
      add('stilthouse', -9, -10, { seed: 3, o: { lift: 0.4, wall: '#5a6a7a', roof: '#2a3a4a' } }); add('stilthouse', -14.5, -6, { seed: 4, ry: 1.2, o: { lift: 0.4, wall: '#6a5a4a' } }); add('stilthouse', 15, -6, { seed: 6, ry: -1.2, o: { lift: 0.4, wall: '#4a5a6a', roof: '#3a2a2a' } });
      add('lanterns', -2, -7.4, { seed: 2, o: { L: 9 } }); add('lanterns', 10, -6.4, { seed: 5, o: { L: 6, cols: ['#9fe6ff', '#ffb050', '#ff7a50', '#ffd070'] } });
      add('barrel', -12, -4.5); add('barrel', -12.6, -3.8); add('crate', 12, -3.5, { seed: 2 }); add('crate', 12.8, -4.2, { seed: 6 }); add('crate', 12.4, -3.5, { seed: 8, s: 0.7 });
      add('lamp', -5.5, -6, { o: { c: '#9fd0ff' } }); add('boat', -4, -11, { ry: 1.5 });
    },
  };
  SCENES.deck = {
    outdoor: true, ground: 'planks', groundC: '#6a5040', pano: { sky: ['#0a0c1c', '#1e2440', '#4a4a6a'], stars: 200, moon: [900, 110, 34], layers: [{ type: 'hills', c: '#1a2034', base: 0.86, amp: 0.02, seed: 2 }], mist: 'rgba(100,120,170,0.4)' },
    fog: ['#1a2238', 18, 50], hemi: ['#a0b0e0', '#2a2620', 0.6], key: ['#c8d4ff', 0.9, -6, 10, 4], water: { z: -11, w: 120, d: 8 }, particles: 'motes',
    build(add) { add('ship', 0, -13, { seed: 2 }); add('barrel', -11, -6); add('barrel', -10.4, -5.4); add('crate', 11, -5.5, { seed: 3 }); add('lanterns', 0, -7.4, { seed: 7, o: { L: 12 } }); add('fence', -13.5, 0, { ry: PI / 2, o: { L: 6, color: '#4a321e' } }); add('fence', 13.5, 0, { ry: PI / 2, o: { L: 6, color: '#4a321e' } }); },
  };
  SCENES.guild = {
    outdoor: false, ground: 'planks', groundC: '#3a2e2a', walls: { tex: 'stone', c: '#3a3440' },
    fog: ['#0a080e', 14, 36], hemi: ['#a090c8', '#140e14', 0.42], key: ['#c8b0ff', 0.4, 3, 9, 6], particles: 'motes', tint: '#8a6aff',
    build(add) { add('table', 0, -8, { o: { L: 3 } }); add('candles', 0, -8, { seed: 9 }); add('treasure', -6, -8.5, { seed: 4 }); add('treasure', 6, -8.2, { seed: 7 }); add('banner', -11, -7, { o: { color: '#3a2a54', c2: '#d8c8ff' } }); add('banner', 11, -7, { o: { color: '#3a2a54', c2: '#d8c8ff' } }); add('crate', -12, -4, { seed: 2 }); add('crate', -12.6, -3.2, { seed: 3, s: 0.8 }); add('barrel', 12, -4); add('stool', -1.5, -6.6); add('stool', 1.5, -6.6); add('pillar', -8, -9.5, { o: { h: 5, color: '#4a4450' } }); add('pillar', 8, -9.5, { o: { h: 5, color: '#4a4450' } }); },
  };
  SCENES.hall = {
    outdoor: false, ground: 'flag', groundC: '#8a8a94', walls: { tex: 'stone', c: '#8a90a0', window: '#6ab0d8' },
    fog: ['#10141c', 18, 44], hemi: ['#b0c0e0', '#2a2830', 0.55], key: ['#d8e4ff', 0.6, -3, 9, 6], particles: 'motes',
    build(add) { add('throne', 0, -9.2); add('rug', 0, -4.5, { o: { w: 3, L: 9, color: '#1a3a5a' } }); add('chandelier', -6, -5); add('chandelier', 6, -5); for (const s of [-1, 1]) { add('pillar', s * 10, -8.5, { o: { h: 6, color: '#9aa0ac' } }); add('pillar', s * 12.5, -2, { o: { h: 6, color: '#9aa0ac' } }); add('banner', s * 4, -9.2, { o: { color: '#1a3a5a', c2: '#e8d8a0' } }); } add('table', -9, -5, { o: { L: 2.6 } }); add('table', 9, -5, { o: { L: 2.6 } }); add('candles', -9, -5, { seed: 3 }); add('candles', 9, -5, { seed: 5 }); },
  };
  SCENES.folio = {
    outdoor: true, ground: 'paper', groundC: '#b8ad94', pano: { sky: ['#0e0812', '#2e1424', '#7a3a34'], stars: 120, glow: [1024, 'rgba(255,90,60,0.35)'], layers: [{ type: 'roofs', c: '#2a1a24', base: 0.7, amp: 0.3, seed: 8, lights: 60 }, { type: 'roofs', c: '#1a1018', base: 0.84, amp: 0.14, seed: 3, lights: 20 }], mist: 'rgba(200,170,150,0.3)' },
    fog: ['#2a1a24', 16, 46], hemi: ['#d8b8c0', '#3a2a24', 0.6], key: ['#ffd0c0', 0.85, -6, 10, 4], particles: 'motes',
    build(add) {
      add('tower', -10, -12, { seed: 1, o: { h: 10, roof: '#5a1a18' } }); add('tower', -4, -14, { seed: 2, o: { h: 13, w: 2.6, roof: '#2a2a5a' } }); add('tower', 3, -13, { seed: 3, o: { h: 11, roof: '#5a1a18' } }); add('tower', 10, -12.5, { seed: 4, o: { h: 9, w: 2.4, roof: '#3a3a3a' } });
      add('pages', -7, -8, { seed: 2, o: { L: 7 } }); add('pages', 6, -8.3, { seed: 5, o: { L: 7, ink: '#5a1a18' } });
      add('lamp', -12, -6); add('lamp', 12, -6, { ry: PI }); add('banner', -2.5, -8.5, { o: { color: '#6a1a18', c2: '#0a0606' } }); add('banner', 2.5, -8.5, { o: { color: '#6a1a18', c2: '#0a0606' } });
      add('statue', 0, -10, { seed: 3, o: { color: '#a89c88', book: true } }); add('crate', -13, -3, { seed: 5 }); add('press', 13, -3.5, { ry: -0.6 });
    },
  };
  SCENES.archive = {
    outdoor: false, ground: 'flag', groundC: '#6a6070', walls: { tex: 'stone', c: '#5a5468' },
    fog: ['#100c16', 16, 40], hemi: ['#b0a0d0', '#1a1420', 0.5], key: ['#d8c8ff', 0.55, 3, 9, 6], particles: 'motes', tint: '#8a70ff',
    build(add) { for (let i = 0; i < 6; i++) add('bookshelf', -12.5 + i * 5, -9.6, { seed: i + 1 }); add('table', -6, -5.5, { o: { L: 2.6, mugs: false } }); add('table', 6, -5.5, { o: { L: 2.6, mugs: false } }); add('candles', -6, -5.5, { seed: 2 }); add('candles', 6, -5.5, { seed: 6 }); add('bigbook', 0, -7.5, { o: { c: '#b8a8ff' } }); add('pages', 0, -4, { seed: 9, o: { L: 10, y: 5.2 } }); },
  };
  SCENES.library = {
    outdoor: false, ground: 'flag', groundC: '#5a5060', walls: { tex: 'stone', c: '#4a4050' },
    fog: ['#0e0a12', 14, 38], hemi: ['#b090c0', '#160e14', 0.45], key: ['#ffc8d8', 0.45, 3, 9, 6], particles: 'motes', tint: '#ff4a6a',
    build(add) { add('teethdoor', 0, -10); for (const s of [-1, 1]) { add('bookshelf', s * 5.5, -9.6, { seed: s + 5, o: { h: 5, eyes: true } }); add('bookshelf', s * 9, -9.4, { seed: s + 8, o: { h: 4.6 } }); add('bookshelf', s * 12.6, -8, { seed: s + 11, ry: s * -0.6 }); } add('candles', -3.2, -7.5, { seed: 4 }); add('candles', 3.2, -7.5, { seed: 8 }); add('pages', -7, -5, { seed: 4, o: { L: 6, y: 5.4 } }); add('pages', 7, -5.2, { seed: 7, o: { L: 6, y: 5.2 } }); add('skulls', 11, -4, { seed: 3 }); },
  };
  SCENES.bindery = {
    outdoor: false, ground: 'flag', groundC: '#4a4048', walls: { tex: 'stone', c: '#3a3038' },
    fog: ['#100608', 14, 40], hemi: ['#d0a0b0', '#140a0c', 0.45], key: ['#ffd8c8', 0.5, 3, 9, 6], particles: 'embers', tint: '#ff6a4a',
    build(add) { add('bigbook', 0, -8.5, { o: { c: '#ffd8a0' } }); add('shears', 0, -11.6); add('press', -8, -8.5, { ry: 0.3 }); add('press', 8, -8.5, { ry: -0.3 }); for (const s of [-1, 1]) { add('pillar', s * 12, -8, { o: { h: 6, color: '#5a4a50' } }); add('pages', s * 6, -4.5, { seed: s + 3, o: { L: 7, y: 5.4, ink: '#5a1a18' } }); add('candles', s * 3.5, -7.5, { seed: s + 7 }); } add('inkpool', -4, -3, { seed: 2, o: { s: 1.2 } }); add('inkpool', 5, -2, { seed: 4, o: { s: 0.9 } }); },
  };


  /* ---------- Chapter II extras ---------- */
  SCENES.crossroads = Object.assign({}, SCENES.moor, { build(add) { add('gibbet', 2, -8.5, { seed: 1 }); add('deadtree', -11, -8, { seed: 4, s: 1.2 }); add('deadtree', 12, -9, { seed: 7 }); for (let i = 0; i < 10; i++) add(i % 2 ? 'tuft' : 'heather', -14 + i * 3, -6 - (i % 3), { seed: i + 3 }); add('fence', -8, -6.5, { ry: 0.1, o: { L: 4 } }); add('fence', 9, -6.8, { ry: -0.1, o: { L: 4 } }); add('rock', 13, 0, { seed: 2 }); add('lamp', -4.5, -6.2, { o: { c: '#ffb050' } }); } });
  SCENES.inn = Object.assign({}, SCENES.tavern, { hemi: ['#e8c090', '#3a2418', 0.55], build(add) { add('hearth', -2, -9); add('table', -9, -5, { o: { L: 2.4 } }); add('table', 8, -5.5, { o: { L: 2.4 } }); add('table', 0, -4, { o: { L: 2 } }); for (const [x, z] of [[-9, -3.6], [-10.5, -6.4], [8, -4.1], [9.6, -6.9], [-1.4, -2.6], [1.4, -2.6]]) add('stool', x, z); add('barrel', 12.5, -8); add('barrel', 13, -7.2); add('crate', -12.6, -8, { seed: 2 }); add('bench', 12, -3, { ry: -PI / 2, o: { L: 2.4 } }); add('candles', -9, -5, { seed: 1 }); add('candles', 8, -5.5, { seed: 4 }); add('banner', 6, -9, { o: { color: '#5a3a22', c2: '#ffcf6a' } }); } });
  SCENES.croakwater = Object.assign({}, SCENES.fen, { build(add) { add('stilthouse', -10, -10.5, { seed: 2, o: { lc: '#a6ff5a', roof: '#2a3a24', wall: '#4a5a3a' } }); add('stilthouse', -2, -12, { seed: 3, o: { lc: '#ffb050', roof: '#3a4a2a', wall: '#5a5a3a' } }); add('stilthouse', 7, -11, { seed: 5, ry: -0.2, o: { lc: '#9fe6ff', roof: '#2a3a2a', wall: '#4a4a3a' } }); add('stilthouse', 14.5, -7, { seed: 6, ry: -1.1, o: { roof: '#2a3a24' } }); add('dock', 0, -6.8, { o: { L: 12, D: 1.6 } }); add('lanterns', -5, -7.4, { seed: 3, o: { L: 7, cols: ['#a6ff5a', '#9fe6ff', '#ffd070', '#a6ff5a'] } }); add('lilies', 4, -8.5, { seed: 6 }); add('lilies', -12, -7, { seed: 2 }); add('reeds', 12, -6, { seed: 4 }); add('reeds', -14, -5, { seed: 8 }); } });
  SCENES.warrens = { outdoor: false, ground: 'mud', groundC: '#3a3a28', walls: { tex: 'hide', c: '#3a3a28' }, fog: ['#0c1408', 12, 34], hemi: ['#a0c080', '#141a10', 0.42], key: ['#c0ff90', 0.35, 3, 9, 6], particles: 'wisps', tint: '#a6ff5a', build(add) { add('inkpool', -6, -6, { seed: 2, o: { s: 1.4 } }); add('inkpool', 7, -5, { seed: 4, o: { s: 1.1 } }); add('mushroom', -11, -7, { seed: 3, o: { c: '#a6ff5a' } }); add('mushroom', 11, -8, { seed: 5, o: { c: '#a6ff5a' } }); add('skulls', 0, -8.5, { seed: 6 }); add('cage', 10, -8.6, { seed: 1, o: { s: 0.9 } }); add('cage', -10, -8.8, { seed: 2, o: { s: 0.9 } }); add('candles', 2, -8, { seed: 2 }); add('reeds', -13, -3, { seed: 9 }); } };
  SCENES.island = Object.assign({}, SCENES.fen, { build(add) { add('stilthouse', 0, -11.5, { seed: 9, o: { lift: 0.6, lc: '#a6ff5a', roof: '#1a2a1a', wall: '#3a3a2a', skull: true } }); add('inkpool', -6, -6.5, { seed: 5, o: { s: 1.6 } }); add('pages', 6, -7.5, { seed: 2, o: { L: 5, y: 3.4, ink: '#2a4a2a' } }); add('deadtree', -12, -8, { seed: 2, s: 1.3 }); add('deadtree', 12, -9, { seed: 6, s: 1.1 }); add('mushroom', -9, -9, { seed: 7, o: { c: '#a6ff5a' } }); add('reeds', 10, -6, { seed: 3 }); add('candles', -2, -8, { seed: 4 }); } });
  SCENES.temple = Object.assign({}, SCENES.chapel, { walls: { tex: 'stone', c: '#5a7a80', window: '#4ab0c8' }, hemi: ['#90c8d8', '#1a2428', 0.5], key: ['#b8f0ff', 0.6, -3, 9, 6], tint: '#4ab0c8', build(add) { add('altar', 0, -9); add('statue', 0, -10.6, { seed: 2, o: { color: '#4a7a80' } }); add('inkpool', 0, -5.5, { seed: 3, o: { s: 1.5 } }); add('pillar', -10, -8, { o: { h: 6, color: '#5a7a80' } }); add('pillar', 10, -8, { o: { h: 6, color: '#5a7a80' } }); add('candles', -4, -8.5, { seed: 2 }); add('candles', 4, -8.5, { seed: 5 }); add('lilies', -6, -4, { seed: 3 }); add('lilies', 6, -4.5, { seed: 7 }); } });
  SCENES.pit = { outdoor: false, ground: 'dirt', groundC: '#6a5440', walls: { tex: 'timber', c: '#5a4a3a' }, fog: ['#1a120c', 16, 40], hemi: ['#e0b890', '#2a1c14', 0.5], key: ['#ffc890', 0.55, 3, 9, 6], particles: 'embers', build(add) { add('palisade', 0, -10.5, { o: { L: 26 } }); add('palisade', -14, -3, { ry: PI / 2, o: { L: 10 } }); add('palisade', 14, -3, { ry: PI / 2, o: { L: 10 } }); for (const x of [-9, -3, 3, 9]) add('torch', x, -9.2); add('banner', -6, -9.6, { o: { color: '#3a2a54' } }); add('banner', 6, -9.6, { o: { color: '#2a5a7a' } }); add('skulls', 11, -8, { seed: 2 }); add('barrel', -12, -8); add('cage', 12, -6, { seed: 3, o: { s: 0.8 } }); } };
  SCENES.lighthouse = Object.assign({}, SCENES.saltmere, { build(add) { add('lighthouse', 4, -12.5); add('rock', -9, -9, { seed: 3, o: { s: 2.4, color: '#5a5a62' } }); add('rock', 13, -8, { seed: 5, o: { s: 2, color: '#5a5a62' } }); add('rock', -14, -4, { seed: 7, o: { s: 1.6, color: '#5a5a62' } }); add('dock', -4, -7.6, { o: { L: 6, D: 1.4 } }); add('boat', -6, -10, { ry: 1.2 }); add('barrel', 10, -5); add('lamp', -1, -6.3, { o: { c: '#fff2b0' } }); } });
  SCENES.ghostship = Object.assign({}, SCENES.deck, { fog: ['#14281e', 10, 36], hemi: ['#8ad8b0', '#141a14', 0.5], key: ['#a8ffd0', 0.6, -6, 10, 4], particles: 'wisps', tint: '#7bd389', build(add) { add('ship', 0, -13, { seed: 5 }); add('barrel', -11, -6); add('skulls', -9, -5, { seed: 4 }); add('crate', 11, -5.5, { seed: 6 }); add('lanterns', 0, -7.4, { seed: 9, o: { L: 12, cols: ['#7bd389', '#9fe6ff', '#7bd389', '#a6ff5a'] } }); add('fence', -13.5, 0, { ry: PI / 2, o: { L: 6, color: '#2a2a20' } }); add('fence', 13.5, 0, { ry: PI / 2, o: { L: 6, color: '#2a2a20' } }); add('pages', 4, -6, { seed: 6, o: { L: 4, y: 3.6, ink: '#2a4a3a' } }); } });
  /* ---------- Chapter III extras ---------- */
  SCENES.correction = { outdoor: false, ground: 'flag', groundC: '#5a4a50', walls: { tex: 'stone', c: '#4a3a40' }, fog: ['#140a0c', 14, 38], hemi: ['#d0a0a8', '#180c0e', 0.45], key: ['#ffc0c0', 0.5, 3, 9, 6], particles: 'motes', tint: '#ff4a3a', build(add) { add('vat', -8, -8.5, { seed: 1, o: { c: '#5a0a14' } }); add('vat', 8, -8.5, { seed: 2, o: { c: '#5a0a14' } }); add('cage', -12.5, -5, { seed: 1, o: { ink: true } }); add('cage', 12.5, -5, { seed: 2, o: { ink: true } }); add('table', 0, -7, { o: { L: 3, mugs: false } }); add('candles', 0, -7, { seed: 4 }); add('banner', -3, -9.5, { o: { color: '#6a1a18', c2: '#0a0606' } }); add('banner', 3, -9.5, { o: { color: '#6a1a18', c2: '#0a0606' } }); add('pages', 0, -4.5, { seed: 8, o: { L: 9, y: 5.2, ink: '#6a1a18' } }); } };
  SCENES.inkworks = { outdoor: false, ground: 'flag', groundC: '#3a3440', walls: { tex: 'stone', c: '#3a3440' }, fog: ['#0a080e', 14, 38], hemi: ['#9a90c8', '#100c14', 0.42], key: ['#c0b0ff', 0.45, 3, 9, 6], particles: 'embers', tint: '#6a4aff', build(add) { for (let i = 0; i < 4; i++) add('vat', -10.5 + i * 7, -9, { seed: i + 1, o: { c: i % 2 ? '#2a1a6a' : '#1a1a3a' } }); add('press', -12.5, -4, { ry: 0.8 }); add('press', 12.5, -4, { ry: -0.8 }); add('inkpool', 0, -5, { seed: 2, o: { s: 1.5 } }); add('inkpool', -6, -3, { seed: 7, o: { s: 0.8 } }); add('crate', 11, -7, { seed: 4 }); add('barrel', -11, -7); } };
  SCENES.underfolio = Object.assign({}, SCENES.cellar, { water: { z: -5, w: 30, d: 3, y: 0.05, c: 0x2a2a3a }, build(add) { for (let i = 0; i < 5; i++) add('pillar', -12 + i * 6, -9, { o: { h: 5, color: '#4a4448' } }); add('pages', -6, -7, { seed: 3, o: { L: 6, y: 4.4 } }); add('pages', 6, -7.2, { seed: 5, o: { L: 6, y: 4.2 } }); add('crate', -12, -3, { seed: 2 }); add('barrel', 12, -3); add('candles', -2, -8.5, { seed: 6 }); add('skulls', 9, -8, { seed: 2 }); } });
  SCENES.tomb = Object.assign({}, SCENES.crypt, { tint: '#ffd8a0', key: ['#ffe8c0', 0.45, 3, 9, 6], build(add) { add('sarcophagus', 0, -8.5, { ry: 0 }); add('shears', 0, -11, { seed: 2 }); for (const s of [-1, 1]) { add('pillar', s * 7, -8.5, { o: { h: 5.5 } }); add('candles', s * 3, -8, { seed: s + 4 }); add('bookshelf', s * 11.5, -9.5, { seed: s + 2, o: { h: 3.6 } }); } add('pages', 0, -5.5, { seed: 2, o: { L: 8, y: 5 } }); } });
  SCENES.gardens = Object.assign({}, SCENES.folio, { build(add) { for (let i = 0; i < 8; i++) add('paperflower', -13 + i * 3.7, -7.5 - (i % 2) * 1.6, { seed: i + 1, o: i % 3 === 0 ? { c: '#e8b8c8' } : {} }); add('statue', -6, -10, { seed: 2, o: { color: '#d8ccb0' } }); add('statue', 6, -10, { seed: 3, o: { color: '#d8ccb0', book: true } }); add('tower', 0, -14, { seed: 6, o: { h: 12, roof: '#5a1a18' } }); add('lanterns', 0, -6.8, { seed: 4, o: { L: 10, cols: ['#ffd070', '#ffb0c0', '#efe6d2', '#ffd070'] } }); add('paperflower', -12, -3, { seed: 11 }); add('paperflower', 12, -3, { seed: 12, o: { c: '#e8b8c8' } }); } });
  SCENES.vault = Object.assign({}, SCENES.hall, { walls: { tex: 'stone', c: '#6a5a40' }, hemi: ['#f0d8a0', '#2a2010', 0.5], key: ['#ffe0a0', 0.55, -3, 9, 6], build(add) { for (let i = 0; i < 5; i++) add('treasure', -10 + i * 5, -8.5 - (i % 2) * 0.8, { seed: i + 2 }); add('pillar', -12.5, -6, { o: { h: 6, color: '#a08850' } }); add('pillar', 12.5, -6, { o: { h: 6, color: '#a08850' } }); add('shelf', -6, -10.2, { seed: 3 }); add('shelf', 6, -10.2, { seed: 5 }); add('chandelier', 0, -5, { o: { c: '#ffd070' } }); add('rug', 0, -4, { o: { w: 3, L: 7, color: '#6a1a18' } }); } });
  SCENES.stacks = Object.assign({}, SCENES.library, { build(add) { for (let i = 0; i < 7; i++) add('bookshelf', -13 + i * 4.3, -9.4 - (i % 2) * 0.8, { seed: i + 20, o: { h: 5, eyes: i % 3 === 1 } }); for (const s of [-1, 1]) add('bookshelf', s * 12.5, -3, { seed: s + 30, ry: s * -PI / 2, o: { h: 4.6 } }); add('candles', -3, -6.5, { seed: 2 }); add('candles', 3, -6.5, { seed: 5 }); add('pages', 0, -4, { seed: 7, o: { L: 9, y: 5.6 } }); } });
  /* ---------- Chapter IV extras ---------- */
  const PALE = { sky: ['#c8ccd8', '#dcdfe8', '#eceef4'], stars: 0, layers: [{ type: 'mountains', c: '#b0b4c4', base: 0.74, amp: 0.25, seed: 9 }, { type: 'trees', c: '#9a9eb0', base: 0.86, amp: 0.12, seed: 4 }], mist: 'rgba(240,242,248,0.6)' };
  SCENES.ninth = { outdoor: true, ground: 'snow', groundC: '#d8dce4', pano: PALE, fog: ['#d8dce8', 14, 44], hemi: ['#ffffff', '#8a90a0', 0.8], key: ['#ffffff', 0.9, -6, 10, 4], particles: 'motes', build(add) { for (let i = 0; i < 9; i++) add('pine', -14 + i * 3.6, -8 - (i % 3) * 1.4, { seed: i + 2, s: 1 + (i % 2) * 0.3, o: { leaf: '#c8d0d8' } }); add('standing', -6, -7, { seed: 4, o: { color: '#d8dce4' } }); add('standing', 7, -7.5, { seed: 6, o: { color: '#d8dce4' } }); add('house', 0, -12, { seed: 8, o: { wall: '#e0e0e4', roof: '#b8bcc8', lit: false } }); for (let i = 0; i < 6; i++) add('rock', (i % 2 ? 1 : -1) * (12 + i * 0.4), -3 + i, { seed: i + 6, o: { color: '#c8ccd4' } }); } };
  SCENES.longhall = { outdoor: false, ground: 'planks', groundC: '#c8c0b8', walls: { tex: 'timber', c: '#e0dcd8' }, fog: ['#c8c8d0', 18, 46], hemi: ['#ffffff', '#6a6a70', 0.7], key: ['#ffffff', 0.6, 3, 9, 6], particles: 'motes', build(add) { add('hearth', 0, -9); add('throne', 0, -6.8, { s: 0.9 }); add('table', -8, -5, { o: { L: 4 } }); add('table', 8, -5, { o: { L: 4 } }); add('bench', -8, -3.6, { o: { L: 4 } }); add('bench', 8, -3.6, { o: { L: 4 } }); add('banner', -11, -8, { o: { color: '#d8dce4', c2: '#9aa0b0' } }); add('banner', 11, -8, { o: { color: '#d8dce4', c2: '#9aa0b0' } }); add('pillar', -5, -9, { o: { h: 5, color: '#c8c0b8' } }); add('pillar', 5, -9, { o: { h: 5, color: '#c8c0b8' } }); } };
  SCENES.ballroom = Object.assign({}, SCENES.hall, { walls: { tex: 'stone', c: '#5a2a30', window: '#ff8a6a' }, hemi: ['#ffc0b0', '#2a1014', 0.55], key: ['#ffd8c8', 0.6, -3, 9, 6], tint: '#ff6a5a', particles: 'motes', build(add) { add('chandelier', -6, -5, { o: { c: '#ffb080' } }); add('chandelier', 6, -5, { o: { c: '#ffb080' } }); add('chandelier', 0, -8, { o: { c: '#ffb080' } }); add('rug', 0, -5, { o: { w: 8, L: 7, color: '#5a0a14', c2: '#c9a14a' } }); for (const s of [-1, 1]) { add('pillar', s * 11, -8.5, { o: { h: 6, color: '#8a5a50' } }); add('pillar', s * 13, -2, { o: { h: 6, color: '#8a5a50' } }); add('table', s * 10, -5, { o: { L: 2.4 } }); add('candles', s * 10, -5, { seed: s + 3 }); } add('throne', 0, -10, { s: 0.8 }); } });
  SCENES.clockfall = { outdoor: true, ground: 'cobble', groundC: '#6a6460', pano: { sky: ['#0a0a14', '#1e1a2a', '#3a2e3a'], stars: 180, moon: [1024, 90, 44], layers: [{ type: 'roofs', c: '#18141e', base: 0.72, amp: 0.28, seed: 6, lights: 30 }], mist: 'rgba(120,100,120,0.35)' }, fog: ['#1e1a28', 16, 46], hemi: ['#b0a0c8', '#2a2420', 0.55], key: ['#e8d8ff', 0.85, -6, 10, 4], particles: 'motes', build(add) { add('clocktower', 0, -13, { seed: 1, o: { h: 12, w: 3 } }); add('clocktower', -10, -11, { seed: 2, o: { h: 8 } }); add('clocktower', 10, -11.5, { seed: 3, o: { h: 9, roof: '#5a3a2a' } }); add('gear', -6, -8.5, { seed: 2, ry: 0.3, o: { r: 1.4 } }); add('gear', 7, -8.2, { seed: 3, ry: -0.4, o: { r: 1.1, color: '#8a8a90' } }); add('lamp', -12.5, -5.5); add('lamp', 12.5, -5.5, { ry: PI }); add('crate', -13, -3, { seed: 4 }); add('gear', 13, -3, { seed: 5, ry: -1.2, o: { r: 0.8 } }); } };
  SCENES.clockwork = { outdoor: false, ground: 'planks', groundC: '#5a4a3a', walls: { tex: 'stone', c: '#5a5048' }, fog: ['#140e0a', 14, 38], hemi: ['#e0c8a0', '#1a140e', 0.5], key: ['#ffe0b0', 0.55, 3, 9, 6], particles: 'embers', build(add) { for (let i = 0; i < 5; i++) add('gear', -12 + i * 6, -10, { seed: i + 1, ry: (i % 2 ? 0.2 : -0.2), o: { r: 1 + (i % 3) * 0.6, color: i % 2 ? '#8a8a90' : '#9a7a3a' } }); add('gear', -13, -4, { seed: 9, ry: PI / 2, o: { r: 1.2 } }); add('gear', 13, -4.5, { seed: 10, ry: -PI / 2, o: { r: 1.4, color: '#8a8a90' } }); add('candles', 0, -7.5, { seed: 3 }); add('table', 0, -7, { o: { L: 2.4, mugs: false } }); } };
  SCENES.whitepage = { outdoor: true, ground: 'white', groundC: '#cfc5ae', pano: { sky: ['#b8ae98', '#cdc4b0', '#e2dac8'], stars: 0, layers: [{ type: 'mountains', c: '#c4baa4', base: 0.8, amp: 0.16, seed: 11 }], mist: 'rgba(236,230,216,0.45)' }, fog: ['#cec4ae', 22, 66], hemi: ['#fff2dc', '#5a5244', 0.46], key: ['#ffe8c8', 0.62, -6, 10, 4], tint: '#b8a47a', particles: 'motes', build(add) { add('bigbook', 0, -9, { o: { c: '#ffe8b0' } }); add('pages', -7, -7, { seed: 2, o: { L: 6, y: 5.4 } }); add('pages', 7, -7.5, { seed: 4, o: { L: 6, y: 5.2 } }); add('shears', 0, -12, { seed: 3 }); } };

  function wallTex(kind, c) {
    if (kind === 'stone') return K3.stoneTex ? K3.stoneTex() : null;
    if (kind === 'timber') return K3.timberTex ? K3.timberTex(true) : null;
    return K3.tex('hidewall', 256, 256, (g) => { g.fillStyle = '#6a4a32'; g.fillRect(0, 0, 256, 256); const r = mulberry32(3); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '40,24,14' : '140,100,70'},${0.15 + r() * 0.2})`; g.beginPath(); g.ellipse(r() * 256, r() * 256, 20 + r() * 40, 10 + r() * 20, r() * 3, 0, TAU); g.fill(); } g.strokeStyle = 'rgba(30,18,10,0.6)'; g.lineWidth = 3; for (let x = 0; x < 256; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 10, 256); g.stroke(); } });
  }

  /* ---------------- build a scene ---------------- */
  function build(kind) {
    const S = SCENES[kind] || SCENES.moor;
    const root = new THREE.Group();
    const lights = [], flames = [], anim = [];
    const add = (pk, x, z, opt) => {
      opt = opt || {};
      const p = prop(pk, opt.seed || 1, opt.o);
      p.position.set(x, 0, z); p.rotation.y = opt.ry || 0; if (opt.s) p.scale.setScalar(opt.s);
      root.add(p);
      const info = p.userData.info || {};
      const tf = (v) => new THREE.Vector3(v.x, v.y, v.z).multiplyScalar(opt.s || 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), opt.ry || 0).add(p.position);
      if (info.light) lights.push(Object.assign({}, info.light, { pos: tf(info.light) }));
      if (info.flame) { const fl = K3.flameSprite(info.flame.s); fl.position.copy(tf(info.flame)); root.add(fl); flames.push({ s: fl, base: info.flame.s, ph: Math.random() * 10 }); const gl = K3.glowSprite3('#ff8a3a', info.flame.s * 2.2, 0.45); gl.position.copy(fl.position).add(new THREE.Vector3(0, info.flame.s * 0.35, 0)); root.add(gl); }
      return p;
    };
    // ground
    if (S.ground !== 'none') {
      const painted = !!GPAL[S.ground];
      const gt = painted ? paintGround(S.ground) : K3.groundTex(S.ground); gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(painted ? 7 : 9, painted ? 4 : 5);
      const gm = new THREE.Mesh(new THREE.PlaneGeometry(90, 50), new THREE.MeshLambertMaterial({ map: gt, color: painted ? new THREE.Color(1.15, 1.15, 1.15) : (() => { const c = new THREE.Color(S.groundC || '#ffffff').convertSRGBToLinear(); return c.multiplyScalar(3.4 / Math.max(c.r, c.g, c.b, 0.01)); })() }));
      gm.rotation.x = -PI / 2; gm.position.z = -6; root.add(gm);
      // a soft, lighter battle "stage" in the middle
      const st = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ map: K3.glowTex ? K3.glowTex() : null, color: new THREE.Color(S.outdoor ? '#a09aa8' : '#c0a080'), transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }));
      st.rotation.x = -PI / 2; st.position.set(0, 0.02, -0.4); st.scale.set(15, 7, 1); root.add(st);
    }
    // backdrop
    if (S.outdoor) {
      const pt = panorama(S.pano); pt.wrapS = THREE.RepeatWrapping;
      const cy = new THREE.Mesh(new THREE.CylinderGeometry(52, 52, 30, 48, 1, true, PI * 0.5, PI * 1.0), new THREE.MeshBasicMaterial({ map: pt, side: THREE.BackSide, fog: false, depthWrite: false }));
      cy.position.set(0, 9.5, 6); cy.renderOrder = -10; root.add(cy);
    } else {
      const W = S.walls || {};
      const t = wallTex(W.tex, W.c); if (t) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 2); }
      const wm = new THREE.MeshLambertMaterial({ map: t, color: new THREE.Color(W.c || '#8a7a6a').convertSRGBToLinear().multiplyScalar(1.4) });
      const back = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), wm); back.position.set(0, 5, -11); root.add(back);
      for (const s of [-1, 1]) { const side = new THREE.Mesh(new THREE.PlaneGeometry(26, 10), wm); side.position.set(s * 16.5, 5, -1); side.rotation.y = -s * PI / 2 * 0.86; root.add(side); }
      const beamM = new THREE.MeshLambertMaterial({ color: new THREE.Color('#3a2618').convertSRGBToLinear() });
      if (W.tex === 'timber' || W.tex === 'hide') for (let i = -3; i <= 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 0.4), beamM); b.position.set(i * 5.5, 5, -10.8); root.add(b); }
      if (W.window) { const wg = M3.prop((f) => { f.glow(M3.G.rbox(1.4, 3.0, 0.1, 0.6), W.window, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1.6); f.glow(M3.G.rbox(0.1, 3.0, 0.12, 0.04), '#2a2a3a', 0, 0, 0.02, 0, 0, 0, 1, 1, 1, 0.3); }); for (const x of [-6, 6]) { const w2 = wg.clone(); w2.position.set(x, 5, -10.9); root.add(w2); } }
    }
    if (S.water) {
      const w = S.water;
      const wt = K3.tex('watertex', 256, 256, (g) => { g.fillStyle = '#1a2a3a'; g.fillRect(0, 0, 256, 256); const r = mulberry32(5); for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(${150 + r() * 80},${170 + r() * 60},230,${0.1 + r() * 0.25})`; g.lineWidth = 1 + r() * 2; const x = r() * 256, y = r() * 256, L = 10 + r() * 40; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + L / 2, y - 3, x + L, y); g.stroke(); } });
      wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(w.w / 6, w.d / 6);
      const wmesh = new THREE.Mesh(new THREE.PlaneGeometry(w.w, w.d), new THREE.MeshPhongMaterial({ map: wt, color: w.c || 0x6a8aaa, shininess: 80, specular: 0x8899bb, transparent: true, opacity: 0.94 }));
      wmesh.rotation.x = -PI / 2; wmesh.position.set(0, w.y != null ? w.y : 0.04, w.z); root.add(wmesh);
      anim.push((t) => { wt.offset.x = t * 0.02; wt.offset.y = Math.sin(t * 0.3) * 0.02; });
    }
    S.build(add);
    // ambient particles
    let parts = null;
    if (S.particles) parts = ambient(S.particles); if (parts) root.add(parts.obj);
    return {
      kind, S, root, lights,
      update(t, dt) {
        for (const f of flames) { const k = 1 + Math.sin(t * 13 + f.ph) * 0.08 + Math.sin(t * 7.3 + f.ph) * 0.06; f.s.scale.set(f.base * 0.55 * k, f.base * (2 - k), 1); }
        for (const a of anim) a(t);
        if (parts) parts.update(t, dt);
      },
      dispose() { root.traverse((o) => { if (o.material && o.material.map && o.material.map.isCanvasTexture) { /* cached */ } }); },
    };
  }

  /* drifting motes / fireflies / embers / wisps */
  function ambient(kind) {
    const N = kind === 'embers' ? 70 : kind === 'motes' ? 60 : 45;
    const pos = new Float32Array(N * 3), seed = [];
    const r = mulberry32(9);
    for (let i = 0; i < N; i++) { seed.push({ x: (r() - 0.5) * 34, y: r() * 4, z: -10 + r() * 14, ph: r() * 10, sp: 0.3 + r() * 0.7 }); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const col = { fireflies: '#d8ff7a', embers: '#ff9a40', motes: '#ffe8c0', wisps: '#9fe6ff' }[kind];
    const m = new THREE.PointsMaterial({ map: K3.glowTex(), color: new THREE.Color(col), size: kind === 'motes' ? 0.12 : kind === 'wisps' ? 0.5 : 0.28, transparent: true, opacity: kind === 'motes' ? 0.5 : 0.9, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const obj = new THREE.Points(g, m);
    return {
      obj,
      update(t, dt) {
        for (let i = 0; i < N; i++) {
          const s = seed[i];
          if (kind === 'embers') { s.y += dt * s.sp * 1.2; if (s.y > 6) s.y = 0; pos[i * 3] = s.x + Math.sin(t * s.sp + s.ph) * 0.6; pos[i * 3 + 1] = s.y; pos[i * 3 + 2] = s.z; }
          else { pos[i * 3] = s.x + Math.sin(t * 0.3 * s.sp + s.ph) * 1.2; pos[i * 3 + 1] = 0.6 + s.y * 0.7 + Math.sin(t * 0.7 * s.sp + s.ph * 2) * 0.4; pos[i * 3 + 2] = s.z + Math.cos(t * 0.25 * s.sp + s.ph) * 1.0; }
        }
        g.attributes.position.needsUpdate = true;
        m.opacity = kind === 'fireflies' ? 0.6 + Math.sin(t * 2) * 0.25 : m.opacity;
      },
    };
  }

  /* ---------------- Tassel, the ribbon bookmark ---------------- */
  function tassel() {
    const root = new THREE.Group(), segs = [];
    let parent = root;
    for (let i = 0; i < 6; i++) {
      const g = M3.prop((f) => {
        f.put(G.rbox(0.2 - i * 0.012, 0.26, 0.04, 0.02), i % 2 ? '#c42a20' : '#b3261e', 0, -0.13, 0, 0, 0, 0, 1, 1, 1, { grad: [0.8, 1.1] });
        if (i === 0) { for (const s of [-1, 1]) { f.decal(G.sphere(10), '#140b06', s * 0.045, -0.08, 0.025, 0, 0, 0, 0.032, 0.045, 0.02); f.glow(G.sphere(6), '#ffffff', s * 0.045 - 0.01, -0.065, 0.04, 0, 0, 0, 0.012, 0.014, 0.01, 1); } f.metal(G.rbox(0.24, 0.06, 0.06, 0.02), '#d4ad48', 0, 0, 0); }
        if (i === 5) { f.metal(G.cone(8), '#d4ad48', 0, -0.3, 0, PI, 0, 0, 0.09, 0.14, 0.09); for (let k = 0; k < 5; k++) f.put(G.cyl(1, 1, 3), '#e8c060', (k - 2) * 0.02, -0.47, 0, 0, 0, (k - 2) * 0.12, 0.008, 0.24, 0.008, { ow: 0.1 }); }
      });
      g.position.y = i === 0 ? 0 : -0.26; parent.add(g); segs.push(g); parent = g;
    }
    const gl = K3.glowSprite3('#ff6a4a', 1.2, 0.25); gl.position.y = -0.6; root.add(gl);
    return {
      root, isTassel: true,
      animate(o, t) { root.position.set(o.x, (o.h || 1.7) + Math.sin(t * 1.8) * 0.12, o.z); root.rotation.y = Math.sin(t * 0.6) * 0.5; segs.forEach((s, i) => { s.rotation.z = Math.sin(t * 3 - i * 0.7) * 0.22 * (i ? 1 : 0.3); s.rotation.x = Math.sin(t * 2.2 - i * 0.5) * 0.12; }); },
    };
  }

  return { build, SCENES, prop, tassel, panorama };
})();
