/* ==========================================================================
   3D kit - shared geometry, materials, painted canvas textures, sprites
   1 world unit = 40 logic px. Ground is y = 0. Characters face +Z locally.
   ========================================================================== */
const HAS3D = typeof THREE !== 'undefined';
const U = 1 / 40;

const K3 = (() => {
  if (!HAS3D) return {};
  const geoCache = new Map(), matCache = new Map(), texCache = new Map();
  const G = (key, make) => { let g = geoCache.get(key); if (!g) { g = make(); geoCache.set(key, g); } return g; };

  const geo = {
    sphere: (seg) => G('s' + (seg || 16), () => new THREE.SphereGeometry(1, seg || 16, Math.max(6, Math.round((seg || 16) * 0.7)))),
    hemi: () => G('hemi', () => new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)),
    box: () => G('box', () => new THREE.BoxGeometry(1, 1, 1)),
    cyl: (rt, rb, seg, open) => G(`c${rt}|${rb}|${seg}|${open}`, () => new THREE.CylinderGeometry(rt, rb, 1, seg || 12, 1, !!open)),
    cone: (seg) => G('cone' + (seg || 12), () => new THREE.ConeGeometry(1, 1, seg || 12)),
    torus: (tube, arc, seg) => G(`t${tube}|${arc}|${seg}`, () => new THREE.TorusGeometry(1, tube, 6, seg || 18, arc || Math.PI * 2)),
    ico: (d) => G('ico' + (d || 0), () => new THREE.IcosahedronGeometry(1, d || 0)),
    dodeca: () => G('dod', () => new THREE.DodecahedronGeometry(1, 0)),
    plane: () => G('plane', () => new THREE.PlaneGeometry(1, 1)),
    circle: (seg) => G('circ' + (seg || 32), () => new THREE.CircleGeometry(1, seg || 32)),
    ring: (inner, seg) => G(`ring${inner}|${seg}`, () => new THREE.RingGeometry(inner, 1, seg || 48)),
    /* rounded barrel torso (base at y=0, top at ~0.64), flatten in z when placed */
    torso: () => G('torso', () => {
      const P = [[0.0, 0], [0.27, 0], [0.3, 0.08], [0.31, 0.25], [0.335, 0.42], [0.32, 0.53], [0.25, 0.61], [0.12, 0.645], [0, 0.65]];
      return new THREE.LatheGeometry(P.map(([x, y]) => new THREE.Vector2(x, y)), 18);
    }),
    /* flared skirt with a soft wavy hem, top at y=0 hanging to y=-0.66 */
    skirt: (flare) => G('skirt' + flare, () => {
      const P = [[0.0, 0.02], [0.3, 0.02], [0.33, -0.1], [0.4 + flare * 0.3, -0.38], [0.5 + flare * 0.5, -0.64], [0.48 + flare * 0.5, -0.68]];
      const g2 = new THREE.LatheGeometry(P.map(([x, y]) => new THREE.Vector2(x, y)), 22);
      const pos = g2.attributes.position;
      for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < -0.5) { const a = Math.atan2(pos.getZ(i), pos.getX(i)); pos.setY(i, y + Math.sin(a * 7) * 0.025); } }
      g2.computeVertexNormals();
      return g2;
    }),
    /* capsule hanging down from the origin, total length L, radius r */
    capsule: (r, L) => G(`cap${r}|${L}`, () => {
      const pts = [], n = 5;
      for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(t) * r, -L + r - Math.cos(t) * r)); }
      for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(t) * r, -r + Math.sin(t) * r)); }
      return new THREE.LatheGeometry(pts, 10);
    }),
  };

  function tex(key, w, h, paint, repeat) {
    let t = texCache.get(key);
    if (t) return t;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    paint(g, w, h);
    t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    texCache.set(key, t);
    return t;
  }

  /* subtle painted grain used as a map on most materials */
  const paintTex = () => tex('paint', 128, 128, (g, w, h) => {
    const r = mulberry32(5), img = g.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) { const v = 222 + r() * 33; img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() > 0.5 ? 255 : 150},${r() > 0.5 ? 255 : 150},${r() > 0.5 ? 255 : 150},0.06)`; g.beginPath(); g.ellipse(r() * w, r() * h, 6 + r() * 20, 3 + r() * 9, r() * 3, 0, TAU); g.fill(); }
  }, true);

  function mat(color, o) {
    o = o || {};
    const key = color + JSON.stringify(o);
    let m = matCache.get(key);
    if (m) return m;
    const metal = o.metal, glossy = o.glossy;
    m = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: o.shininess != null ? o.shininess : metal ? 70 : glossy ? 34 : 7,
      specular: new THREE.Color(metal ? 0x9a9a9a : glossy ? 0x4a4a4a : 0x141414),
      flatShading: !!o.flat,
      map: o.noMap ? null : (o.map || paintTex()),
      transparent: !!o.transparent || o.opacity != null,
      opacity: o.opacity != null ? o.opacity : 1,
      side: o.double ? THREE.DoubleSide : THREE.FrontSide,
      emissive: new THREE.Color(o.emissive || 0x000000),
      emissiveIntensity: o.emissiveIntensity != null ? o.emissiveIntensity : 1,
      depthWrite: o.depthWrite !== false,
    });
    matCache.set(key, m);
    return m;
  }
  /* unlit, over-bright material that blooms */
  function glowMat(color, k, o) {
    o = o || {};
    const key = 'glow' + color + k + JSON.stringify(o);
    let m = matCache.get(key);
    if (m) return m;
    const c = new THREE.Color(color).multiplyScalar(k || 2.2);
    m = new THREE.MeshBasicMaterial({ color: c, transparent: !!o.transparent || o.opacity != null, opacity: o.opacity != null ? o.opacity : 1, blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending, depthWrite: !o.additive, side: o.double ? THREE.DoubleSide : THREE.FrontSide, toneMapped: true });
    matCache.set(key, m);
    return m;
  }

  function mesh(g, m, sx, sy, sz, x, y, z, rx, ry, rz) {
    const me = new THREE.Mesh(g, m);
    me.scale.set(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy, sz == null ? (sx == null ? 1 : sx) : sz);
    me.position.set(x || 0, y || 0, z || 0);
    if (rx || ry || rz) me.rotation.set(rx || 0, ry || 0, rz || 0);
    return me;
  }
  const grp = (x, y, z) => { const g2 = new THREE.Group(); g2.position.set(x || 0, y || 0, z || 0); return g2; };

  /* ---------- radial glow / flame textures & sprites ---------- */
  const glowTex = () => tex('glowtex', 128, 128, (g) => {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.2, 'rgba(255,255,255,0.65)'); grd.addColorStop(0.5, 'rgba(255,255,255,0.18)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  });
  const flameTex = () => tex('flametex', 64, 128, (g) => {
    const grd = g.createRadialGradient(32, 92, 2, 32, 80, 60);
    grd.addColorStop(0, 'rgba(255,250,220,1)'); grd.addColorStop(0.25, 'rgba(255,200,90,0.95)'); grd.addColorStop(0.55, 'rgba(240,110,30,0.6)'); grd.addColorStop(1, 'rgba(160,40,10,0)');
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(32, 2); g.bezierCurveTo(56, 50, 62, 90, 32, 124); g.bezierCurveTo(2, 90, 8, 50, 32, 2); g.fill();
  });
  const shadowTex = () => tex('shadowtex', 64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(0,0,0,0.7)'); grd.addColorStop(0.6, 'rgba(0,0,0,0.35)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  });
  const starTex = () => tex('startex', 32, 32, (g) => {
    g.fillStyle = '#fff2a0'; g.translate(16, 16); g.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 6 : 15, a = (i / 10) * TAU - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); g.fill();
  });

  function glowSprite3(color, size, opacity) {
    const m = new THREE.SpriteMaterial({ map: glowTex(), color: new THREE.Color(color), blending: THREE.AdditiveBlending, transparent: true, opacity: opacity == null ? 1 : opacity, depthWrite: false });
    const s = new THREE.Sprite(m); s.scale.set(size, size, 1);
    return s;
  }
  function flameSprite(size) {
    const m = new THREE.SpriteMaterial({ map: flameTex(), color: new THREE.Color(1.6, 1.25, 1.0), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
    const s = new THREE.Sprite(m); s.scale.set(size * 0.55, size, 1); s.center.set(0.5, 0.05);
    return s;
  }
  function blobShadow(r) {
    const m = matCache.get('shadowmat') || new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false, color: 0x000000 });
    matCache.set('shadowmat', m);
    const s = new THREE.Mesh(geo.circle(20), m);
    s.rotation.x = -Math.PI / 2; s.position.y = 0.015; s.scale.set(r, r, 1); s.renderOrder = 1;
    return s;
  }

  /* ---------- painted faces (equirect, face centred at u = 0.25) ---------- */
  function faceTex(cfg, closed) {
    const f = cfg.face || 'hero';
    const key = ['face', cfg.skin, f, cfg.mouth, cfg.brows, cfg.scar, cfg.blush, cfg.nose, (cfg.eyes && cfg.eyes.color) || '', cfg.wrinkles, closed ? 1 : 0, cfg.body && cfg.body.type === 'bones' ? 'b' : ''].join('|');
    return tex(key, 512, 256, (g, w, h) => {
      const skin = f === 'skull' ? PAL.bone : (cfg.skin || SKINS[0]);
      g.fillStyle = skin; g.fillRect(0, 0, w, h);
      // soft cheek warmth & chin shade
      const cx = 128, ey = 120;
      const grd = g.createRadialGradient(cx, 150, 10, cx, 150, 120); grd.addColorStop(0, 'rgba(255,220,200,0.12)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = grd; g.fillRect(0, 0, w, h);
      const ink = '#24160e';
      const ell = (x, y, rx, ry, c, rot) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, TAU); g.fillStyle = c; g.fill(); };
      const eyes = (dx, rx, ry) => {
        for (const s of [-1, 1]) {
          const x = cx + s * dx;
          if (closed) { g.beginPath(); g.moveTo(x - rx, ey); g.quadraticCurveTo(x, ey + ry * 0.6, x + rx, ey); g.lineWidth = 4; g.strokeStyle = ink; g.stroke(); continue; }
          ell(x, ey, rx + 2, ry + 2, '#f6f0e4');
          ell(x + s * 1, ey + 2, rx * 0.72, ry * 0.8, (cfg.eyes && cfg.eyes.color) || '#3a2516');
          ell(x + s * 1, ey + 3, rx * 0.38, ry * 0.42, ink);
          ell(x - rx * 0.3, ey - ry * 0.35, rx * 0.28, ry * 0.24, '#ffffff');
          g.beginPath(); g.ellipse(x, ey, rx + 2, ry + 2, 0, 0, TAU); g.lineWidth = 3; g.strokeStyle = ink; g.stroke();
        }
      };
      const brows = (kind) => {
        g.lineWidth = 6; g.strokeStyle = kind === 'light' ? 'rgba(60,40,30,0.55)' : ink; g.lineCap = 'round';
        for (const s of [-1, 1]) {
          const x = cx + s * 30; g.beginPath();
          if (kind === 'angry' || kind === 'stern') { g.moveTo(x - s * 14, ey - 30); g.lineTo(x + s * 12, ey - 22); }
          else if (kind === 'sad') { g.moveTo(x - s * 14, ey - 22); g.lineTo(x + s * 12, ey - 31); }
          else { g.moveTo(x - 13, ey - 27); g.quadraticCurveTo(x, ey - 33, x + 13, ey - 27); }
          g.stroke();
        }
      };
      const mouth = (kind) => {
        g.lineWidth = 4; g.strokeStyle = ink; g.lineCap = 'round'; g.beginPath();
        const my = 168;
        if (kind === 'smile') g.arc(cx, my - 10, 14, 0.35, Math.PI - 0.35);
        else if (kind === 'frown') g.arc(cx, my + 12, 12, Math.PI + 0.45, -0.45);
        else if (kind === 'smirk') { g.moveTo(cx - 12, my); g.quadraticCurveTo(cx + 2, my + 4, cx + 14, my - 6); }
        else { g.moveTo(cx - 11, my); g.lineTo(cx + 11, my); }
        g.stroke();
      };
      if (f === 'skull') {
        for (const s of [-1, 1]) ell(cx + s * 30, ey, 22, 25, '#1a1210');
        g.beginPath(); g.moveTo(cx, 142); g.lineTo(cx - 8, 158); g.lineTo(cx + 8, 158); g.closePath(); g.fillStyle = '#1a1210'; g.fill();
        g.fillStyle = '#1a1210'; g.fillRect(cx - 34, 172, 68, 4);
        for (let i = 0; i < 7; i++) g.fillRect(cx - 32 + i * 10.5, 164, 3, 20);
        g.strokeStyle = 'rgba(90,70,50,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + 40, 60); g.lineTo(cx + 22, 90); g.lineTo(cx + 30, 100); g.stroke();
        return;
      }
      if (f === 'ghoul') {
        for (const s of [-1, 1]) ell(cx + s * 28, ey, 19, 15, '#1c1612');
        g.lineWidth = 3; g.strokeStyle = '#1c1612'; g.beginPath(); g.moveTo(cx - 26, 170);
        for (let i = 0; i < 9; i++) g.lineTo(cx - 26 + i * 6.5, 170 + (i % 2 ? 8 : 0));
        g.stroke();
        g.strokeStyle = 'rgba(40,60,40,0.4)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(cx - 60 + i * 24, 70); g.lineTo(cx - 50 + i * 24, 96); g.stroke(); }
        return;
      }
      if (f === 'shadow') { g.fillStyle = 'rgba(8,6,10,0.92)'; g.beginPath(); g.ellipse(cx, 135, 92, 90, 0, 0, TAU); g.fill(); return; }
      if (f === 'goblin') {
        for (const s of [-1, 1]) {
          const x = cx + s * 30;
          if (closed) { g.lineWidth = 4; g.strokeStyle = ink; g.beginPath(); g.moveTo(x - 14, ey); g.lineTo(x + 14, ey); g.stroke(); continue; }
          ell(x, ey, 17, 12, '#f2d65c'); ell(x + s * 2, ey, 3.5, 10, ink);
          g.beginPath(); g.ellipse(x, ey, 17, 12, 0, 0, TAU); g.lineWidth = 3; g.strokeStyle = ink; g.stroke();
        }
        brows('angry');
        g.lineWidth = 4; g.strokeStyle = ink; g.beginPath(); g.moveTo(cx - 30, 172); g.quadraticCurveTo(cx, 186, cx + 30, 170); g.stroke();
        g.fillStyle = '#f2ead8';
        for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * 16, 176); g.lineTo(cx + s * 20, 192); g.lineTo(cx + s * 24, 175); g.closePath(); g.fill(); }
        return;
      }
      if (f === 'masked') { g.fillStyle = '#201a1e'; g.fillRect(cx - 70, ey - 24, 140, 42); for (const s of [-1, 1]) ell(cx + s * 30, ey, 9, 7, '#f2ead8'); mouth('flat'); return; }
      if (f === 'old') {
        for (const s of [-1, 1]) { g.lineWidth = 4; g.strokeStyle = ink; g.beginPath(); g.arc(cx + s * 30, ey - 4, 13, 0.25, Math.PI - 0.25); g.stroke(); }
        g.lineWidth = 2; g.strokeStyle = 'rgba(60,40,30,0.5)';
        for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(cx - 40, 72 + i * 9); g.lineTo(cx + 40, 70 + i * 9); g.stroke(); }
        for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * 50, ey + 2); g.lineTo(cx + s * 60, ey - 6); g.moveTo(cx + s * 50, ey + 8); g.lineTo(cx + s * 60, ey + 10); g.stroke(); }
        mouth(cfg.mouth || 'flat');
        return;
      }
      const big = f === 'child' || f === 'kind';
      eyes(30, big ? 15 : 12.5, big ? 18 : 15);
      brows(cfg.brows || (f === 'stern' ? 'stern' : f === 'sad' ? 'sad' : 'light'));
      mouth(cfg.mouth || (f === 'stern' ? 'flat' : f === 'sad' ? 'frown' : 'smile'));
      if (cfg.blush !== false && (f === 'hero' || f === 'kind' || f === 'child')) { for (const s of [-1, 1]) { const gg = g.createRadialGradient(cx + s * 48, 150, 2, cx + s * 48, 150, 18); gg.addColorStop(0, 'rgba(220,100,90,0.32)'); gg.addColorStop(1, 'rgba(220,100,90,0)'); g.fillStyle = gg; g.fillRect(cx + s * 48 - 20, 130, 40, 40); } }
      if (cfg.scar) { g.lineWidth = 3; g.strokeStyle = '#8e3a2e'; g.beginPath(); g.moveTo(cx + 22, ey - 40); g.lineTo(cx + 38, ey + 16); g.stroke(); }
    });
  }

  /* ---------- tiled ground textures ---------- */
  function groundTex(kind) {
    return tex('ground_' + kind, 512, 512, (g, w, h) => {
      const r = mulberry32(kind.length * 97 + 11);
      const base = { grass: '#2e3d27', moor: '#33392a', dirt: '#463726', cobble: '#3f3b38', planks: '#4a3322', flag: '#44464e', forest: '#212b20', mud: '#3c2f22', crypt: '#34363f', sand: '#8a7254', rug: '#5a2422' }[kind] || '#333';
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      const speck = (n, cols, s0, s1) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; const s = s0 + r() * (s1 - s0); g.globalAlpha = 0.25 + r() * 0.35; g.beginPath(); g.ellipse(r() * w, r() * h, s, s * (0.4 + r() * 0.6), r() * 3, 0, TAU); g.fill(); } g.globalAlpha = 1; };
      if (kind === 'grass' || kind === 'moor' || kind === 'forest') {
        speck(400, kind === 'moor' ? ['#4a5236', '#2a3020', '#5a4a5e', '#3e3a2a'] : kind === 'forest' ? ['#2c3a28', '#1a2218', '#3a3a24', '#40301e'] : ['#3a4a30', '#24301e', '#46523a'], 4, 18);
        g.strokeStyle = kind === 'forest' ? 'rgba(80,100,60,0.35)' : 'rgba(110,140,80,0.35)'; g.lineWidth = 1.5;
        for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 4, y - 4 - r() * 6); g.stroke(); }
        if (kind === 'moor') speck(160, ['#7a5a86', '#5a4066'], 1.5, 3.5);
      } else if (kind === 'cobble' || kind === 'flag' || kind === 'crypt') {
        const s = kind === 'cobble' ? 40 : 86;
        for (let y = 0; y < h; y += s * 0.8) for (let x = ((y / (s * 0.8)) % 2) * s * 0.5; x < w + s; x += s) {
          g.fillStyle = shade(base, (r() - 0.5) * 0.3); g.beginPath();
          if (kind === 'cobble') g.ellipse(x, y, s * 0.42, s * 0.32, r(), 0, TAU); else g.rect(x - s * 0.47, y - s * 0.37, s * 0.94, s * 0.74);
          g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(15,12,10,0.55)'; g.stroke();
        }
        speck(120, ['#2a2622', '#5a5650'], 2, 8);
        if (kind === 'crypt') speck(60, ['#2a4a32'], 4, 14);
      } else if (kind === 'planks') {
        for (let x = 0; x < w; x += 64) { g.fillStyle = shade(base, (r() - 0.5) * 0.18); g.fillRect(x, 0, 62, h); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(x + 62, 0, 2, h); for (let y = (r() * 200) | 0; y < h; y += 180 + r() * 120) g.fillRect(x, y, 62, 2); }
        g.strokeStyle = 'rgba(30,20,12,0.25)'; g.lineWidth = 1; for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 1, y + 20 + r() * 30); g.stroke(); }
      } else if (kind === 'rug') {
        g.fillStyle = '#5a2422'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c08f2a'; g.lineWidth = 10; g.strokeRect(30, 30, w - 60, h - 60); g.lineWidth = 4; g.strokeRect(60, 60, w - 120, h - 120);
        for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w / 2, h / 2, 40 + i * 30, 0, TAU); g.strokeStyle = i % 2 ? '#7a3a2a' : '#3a1a18'; g.stroke(); }
      } else {
        speck(500, kind === 'mud' ? ['#4e3e2c', '#2c2218', '#5a4632'] : ['#56442e', '#3a2c1e', '#64503a'], 3, 16);
        if (kind === 'mud') speck(50, ['#d8d0bc'], 1.5, 3);
      }
    }, true);
  }

  /* painted night (or dawn) sky used as scene.background */
  function skyTex(kind) {
    return tex('sky_' + kind, 1024, 512, (g, w, h) => {
      const stops = kind === 'dawn' ? [[0, '#2c2c5a'], [0.45, '#b06a5a'], [0.75, '#f0b070'], [1, '#ffe2a0']]
        : kind === 'ember' ? [[0, '#07070f'], [0.6, '#24141e'], [1, '#5a2a22']]
        : kind === 'interior' ? [[0, '#0c0806'], [1, '#1a120c']]
        : kind === 'crypt' ? [[0, '#05070a'], [1, '#0e1a14']]
        : kind === 'forest' ? [[0, '#03060a'], [1, '#0e1a18']]
        : [[0, '#05081a'], [0.55, '#121a36'], [1, '#2a3460']];
      const gr = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      if (kind === 'interior' || kind === 'crypt') return;
      const r = mulberry32(kind.length * 31 + 7);
      if (kind !== 'dawn') for (let i = 0; i < 380; i++) { const s = r(); g.fillStyle = `rgba(230,236,255,${0.2 + s * 0.7})`; g.fillRect(r() * w, r() * h * 0.75, s > 0.93 ? 2.2 : 1.2, s > 0.93 ? 2.2 : 1.2); }
      if (kind === 'night' || kind === 'river') {
        const mx = w * 0.72, my = h * 0.22;
        const mg = g.createRadialGradient(mx, my, 10, mx, my, 160); mg.addColorStop(0, 'rgba(180,200,240,0.55)'); mg.addColorStop(1, 'rgba(180,200,240,0)'); g.fillStyle = mg; g.fillRect(mx - 160, my - 160, 320, 320);
        g.fillStyle = '#e8eef8'; g.beginPath(); g.arc(mx, my, 30, 0, TAU); g.fill();
        g.fillStyle = 'rgba(150,165,195,0.5)'; [[-9, -6, 7], [10, 8, 5], [3, -14, 3.5]].forEach(([dx, dy, rr2]) => { g.beginPath(); g.arc(mx + dx, my + dy, rr2, 0, TAU); g.fill(); });
      }
      if (kind === 'dawn') { const sg = g.createRadialGradient(w / 2, h * 0.9, 10, w / 2, h * 0.9, 380); sg.addColorStop(0, 'rgba(255,240,190,1)'); sg.addColorStop(0.2, 'rgba(255,210,130,0.7)'); sg.addColorStop(1, 'rgba(255,180,90,0)'); g.fillStyle = sg; g.fillRect(0, 0, w, h); }
      g.fillStyle = kind === 'dawn' ? 'rgba(120,80,90,0.35)' : 'rgba(50,60,95,0.45)';
      for (let i = 0; i < 9; i++) { const x = r() * w, y = h * 0.3 + r() * h * 0.4, ww = 120 + r() * 220; g.beginPath(); g.ellipse(x, y, ww, 10 + r() * 12, 0, 0, TAU); g.fill(); }
    });
  }

  function woodTex() { return tex('wood', 128, 128, (g, w, h) => { g.fillStyle = '#6a4a30'; g.fillRect(0, 0, w, h); const r = mulberry32(3); g.strokeStyle = 'rgba(40,25,15,0.45)'; for (let i = 0; i < 30; i++) { g.lineWidth = 1 + r() * 2; g.beginPath(); const y = r() * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 10, w * 0.6, y + (r() - 0.5) * 10, w, y); g.stroke(); } }, true); }
  function stoneTex() { return tex('stone', 256, 256, (g, w, h) => { g.fillStyle = '#5a5c66'; g.fillRect(0, 0, w, h); const r = mulberry32(9); for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? -24 : 0; x < w; x += 48) { g.fillStyle = shade('#5a5c66', (r() - 0.5) * 0.25); g.fillRect(x + 2, y + 2, 44, 28); } }, true); }
  function timberTex(lit) {
    return tex('timber' + (lit ? 1 : 0), 256, 256, (g, w, h) => {
      g.fillStyle = '#8a7a64'; g.fillRect(0, 0, w, h);
      const r = mulberry32(2); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${r() > 0.5 ? 255 : 60},${r() > 0.5 ? 240 : 50},${r() > 0.5 ? 220 : 40},0.06)`; g.fillRect(r() * w, r() * h, 6, 3); }
      g.fillStyle = '#3a2a1e'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14); g.fillRect(0, 0, 14, h); g.fillRect(w - 14, 0, 14, h); g.fillRect(0, h * 0.48, w, 12);
      g.save(); g.translate(w / 2, h * 0.24); g.rotate(0.55); g.fillRect(-150, -6, 300, 12); g.restore();
      g.save(); g.translate(w / 2, h * 0.74); g.rotate(-0.55); g.fillRect(-150, -6, 300, 12); g.restore();
    }, true);
  }
  function roofTex() { return tex('roof', 128, 128, (g, w, h) => { g.fillStyle = '#4a2c26'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, y, w, 3); for (let x = (y / 16) % 2 ? 8 : 0; x < w; x += 16) g.fillRect(x, y, 2, 16); } }, true); }
  function stainedTex() {
    return tex('stained', 256, 512, (g, w, h) => {
      g.fillStyle = '#101826'; g.fillRect(0, 0, w, h);
      const cols = ['#2a4a8a', '#8a2a2a', '#c08f2a', '#2a6a4a', '#5a3a8a'], r = mulberry32(8);
      for (let y = 0; y < h; y += 40) for (let x = 0; x < w; x += 40) { g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(x + 3, y + 3, 34, 34); }
      g.fillStyle = '#ffd56a'; g.beginPath(); g.arc(w / 2, h * 0.35, 60, 0, TAU); g.fill();
      g.strokeStyle = '#111'; g.lineWidth = 6; for (let x = 0; x <= w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y <= h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    });
  }

  return { geo, mat, glowMat, mesh, grp, tex, paintTex, glowTex, flameTex, starTex, glowSprite3, flameSprite, blobShadow, faceTex, groundTex, skyTex, woodTex, stoneTex, timberTex, roofTex, stainedTex };
})();
