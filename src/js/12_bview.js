/* ==========================================================================
   BView - draws the battle engine's state in 3D
   ents -> cel-shaded puppets; projectiles, particles, telegraphs, zones and
   slashes -> meshes and sprites; damage numbers & bars -> DOM overlay.
   ========================================================================== */
const BView = (() => {
  if (!HAS3D) return {};
  const PI = Math.PI;
  const chars = new Map();
  let overlay = null, root = null;
  const pools = {};
  const C = (c) => new THREE.Color(c);
  const H = (px) => px * HK; // screen-height px -> world height

  /* ---------- shared materials ---------- */
  const addMat = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: C(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }, o || {}));
  const ringTex = () => K3.tex('ringtex', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 40, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.85, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const discTex = () => K3.tex('disctex', 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(0.8, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.92, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const slashTex = () => K3.tex('slashtex', 256, 64, (g) => { const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.7)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 32); g.quadraticCurveTo(128, 0, 256, 20); g.lineTo(256, 44); g.quadraticCurveTo(128, 30, 0, 32); g.fill(); });
  const flatDisc = (tex, c, o) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), addMat(c, Object.assign({ map: tex }, o || {}))); m.rotation.x = -PI / 2; return m; };

  /* ---------- simple object pools keyed by kind ---------- */
  function take(kind, make) {
    const p = pools[kind] || (pools[kind] = { free: [], used: [] });
    let o = p.free.pop();
    if (!o) { o = make(); root.add(o); }
    o.visible = true; p.used.push(o);
    return o;
  }
  function recycleAll() { for (const k in pools) { const p = pools[k]; for (const o of p.used) { o.visible = false; p.free.push(o); } p.used = []; } }

  /* ---------- particles: one Points cloud ---------- */
  const PMAX = 900;
  let pts = null;
  function makePoints() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PMAX * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(PMAX * 3), 3));
    g.setAttribute('size', new THREE.BufferAttribute(new Float32Array(PMAX), 1));
    g.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(PMAX), 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { map: { value: K3.glowTex() }, scale: { value: 400 } },
      vertexShader: 'attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; uniform float scale; void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform sampler2D map; varying vec3 vC; varying float vA; void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC * t.rgb * 1.6, t.a * vA); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const solid = new THREE.ShaderMaterial({
      uniforms: { scale: { value: 400 } },
      vertexShader: 'attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; uniform float scale; void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying vec3 vC; varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; float edge = smoothstep(0.5, 0.36, r); gl_FragColor = vec4(mix(vec3(0.05,0.03,0.02), vC, edge), vA); }',
      transparent: true, depthWrite: false,
    });
    const glowP = new THREE.Points(g, m); glowP.frustumCulled = false;
    const g2 = g.clone(); const solidP = new THREE.Points(g2, solid); solidP.frustumCulled = false;
    return { glow: glowP, solid: solidP, m, solidM: solid };
  }
  const GLOWY = { spark: 1, ember: 1, holy: 1, poison: 1, frost: 1, hexspark: 1, necro: 1, coin: 1, shard: 1 };
  const _c = new THREE.Color();
  function drawParts(b) {
    const gA = pts.glow.geometry.attributes, sA = pts.solid.geometry.attributes;
    let gi = 0, si = 0;
    for (const p of b.parts) {
      const solid = !GLOWY[p.type];
      const A = solid ? sA : gA, i = solid ? si++ : gi++;
      if (i >= PMAX) continue;
      const gy = p.gy != null ? p.gy : p.y + 44;
      const X = wx(p.x), Z = wz(gy), Y = Math.max(0.03, H(gy - p.y));
      A.position.array[i * 3] = X; A.position.array[i * 3 + 1] = Y; A.position.array[i * 3 + 2] = Z;
      _c.set(p.c || '#ffffff').convertSRGBToLinear();
      A.color.array[i * 3] = _c.r; A.color.array[i * 3 + 1] = _c.g; A.color.array[i * 3 + 2] = _c.b;
      const k = p.life / p.max;
      A.size.array[i] = (p.size || 3) * (solid ? 0.03 : 0.07) * (p.type === 'dust' || p.type === 'smoke' ? 1.6 : 1) * (p.landed ? 1.3 : 1);
      A.alpha.array[i] = (p.type === 'coin' ? 1 : 1 - k * k) * (p.type === 'dust' || p.type === 'smoke' ? 0.35 : 1);
    }
    for (const [A, n] of [[gA, gi], [sA, si]]) { for (let i = n; i < Math.min(PMAX, n + 40); i++) A.alpha.array[i] = 0; A.position.needsUpdate = A.color.needsUpdate = A.size.needsUpdate = A.alpha.needsUpdate = true; }
    pts.glow.geometry.setDrawRange(0, Math.min(PMAX, gi)); pts.solid.geometry.setDrawRange(0, Math.min(PMAX, si));
    const sc = R3.h / (2 * Math.tan((R3.cam.fov * PI / 180) / 2));
    pts.m.uniforms.scale.value = sc; pts.solidM.uniforms.scale.value = sc;
  }

  /* ---------- DOM overlay ---------- */
  const texts = [], bars = new Map();
  function ensureOverlay(host) {
    if (overlay) return;
    overlay = document.createElement('div'); overlay.id = 'bover'; host.appendChild(overlay);
  }
  function drawTexts(b) {
    while (texts.length < b.texts.length) { const d = document.createElement('div'); d.className = 'dmg'; overlay.appendChild(d); texts.push(d); }
    texts.forEach((d, i) => {
      const t = b.texts[i];
      if (!t) { d.style.display = 'none'; return; }
      const gy = t.gy != null ? t.gy : t.y + 96;
      const p = R3.project(wx(t.x), H(gy - t.y), wz(gy));
      d.style.display = 'block';
      if (d._t !== t.text) { d.textContent = t.text; d._t = t.text; }
      const k = t.t, sc = (t.crit ? 1 + Math.max(0, 0.35 - k) * 2 : 1) * (t.size / 24);
      d.style.color = t.color;
      d.style.opacity = k > 0.75 ? (1.05 - k) / 0.3 : 1;
      d.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%) scale(${sc.toFixed(3)})`;
      d.classList.toggle('crit', !!t.crit);
    });
  }
  function drawBars(b) {
    const seen = new Set();
    for (const e of b.ents) {
      if (e.kind === 'hero' || e.dead || e.state === 'bones' || (e.boss && e.kind === 'foe')) continue;
      seen.add(e.id);
      let d = bars.get(e.id);
      if (!d) { d = document.createElement('div'); d.className = 'ebar' + (e.kind === 'ally' ? ' ally' : '') + (e.champ ? ' champ' : '') + (e.elite ? ' elite' : ''); d.innerHTML = '<i></i><b></b>' + (e.champ || e.elite ? `<em${e.elite ? ` style="color:${ELITES[e.elite].c}"` : ''}>${escapeHtml(e.name)}</em>` : ''); overlay.appendChild(d); bars.set(e.id, d); d._hp = 1; }
      const ch = chars.get(e.id); if (!ch) continue;
      const top = topOf(e, ch);
      const p = R3.project(top.x, top.y, top.z);
      const f = clamp(e.hp / e.maxHp, 0, 1);
      d._hp = lerp(d._hp, f, 0.12);
      d.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-100%)`;
      d.style.opacity = (e.alpha == null ? 1 : e.alpha) * (f < 1 || e.status.mark > 0 || e.champ || e.elite ? 1 : 0.55);
      d.children[0].style.width = (f * 100).toFixed(1) + '%';
      d.children[1].style.width = (d._hp * 100).toFixed(1) + '%';
      d.classList.toggle('marked', e.status.mark > 0);
    }
    for (const [id, d] of bars) if (!seen.has(id)) { d.remove(); bars.delete(id); }
  }
  function topOf(e, ch) {
    const s = (e.cfg.scale || 1);
    const h = (e.cfg.rig === 'inkspawn' ? (e.cfg.big ? 1.9 : 1.25) : e.cfg.rig === 'rat' ? 0.85 : e.cfg.rig === 'wisp' ? 2.3 : 2.35 * s) * 1.18;
    return { x: wx(e.x), y: h + H(-(e.z || 0)), z: wz(e.y) };
  }

  /* ---------- entities ---------- */
  const TINT = (e) => e.status.toad > 0 ? ['#5aff3a', 0.8] : e.status.sleep > 0 ? ['#8a9aff', 0.35] : e.buffs && e.buffs.divine > 0 ? ['#fff2b0', 0.6] : e.status.hexed > 0 ? ['#b06ad8', 0.35] : e.status.corrode > 0 ? ['#a8d84a', 0.3] : e.status.freeze > 0 ? ['#7fd8ff', 0.75] : e.status.burn > 0 ? ['#ff6a20', 0.35] : e.status.poison > 0 || e.status.rot > 0 ? ['#6ad84a', 0.35] : e.status.mark > 0 ? ['#ffcf4a', 0.25] : e.buffs && e.buffs.fury > 0 ? ['#ff4a2a', 0.3] : e.buffs && e.buffs.bulwark > 0 ? ['#a8c8ff', 0.25] : e.status.stun > 0 ? ['#fff0a0', 0.15] : null;
  /* foes read as foes: a coloured rim light, and the unnatural ones get burning eyes */
  const menaceC = (e) => e.elite ? ELITES[e.elite].c : e.boss ? '#ff3a1a' : e.def && e.def.undead ? '#7fd1ff' : e.def && e.def.inkborn ? '#b07aff' : e.champ ? '#ff6a4a' : '#ff5a3a';
  function buildFoe(e) {
    let cfg = e.cfg;
    const unnatural = e.boss || e.elite || (e.def && (e.def.undead || e.def.inkborn));
    if (cfg.rig === 'human' && !cfg.eyes && unnatural && !['goblin', 'child', 'kind'].includes(cfg.face)) cfg = Object.assign({}, cfg, { eyes: { color: menaceC(e), glow: true } });
    else if (cfg.rig !== 'human' && !cfg.eyes && unnatural) cfg = Object.assign({}, cfg, { eyes: menaceC(e) });
    const ch = M3.build(cfg);
    for (const m of [ch.mat, ch.capeMat]) if (m && m.userData && m.userData.rim) { m.userData.rim.value.set(menaceC(e)); m.userData.rimK.value = e.boss ? 1.25 : e.elite ? 1.1 : 0.85; }
    return ch;
  }
  function drawEnts(b, dt) {
    const seen = new Set();
    for (const e of b.ents) {
      seen.add(e.id);
      let ch = chars.get(e.id);
      if (!ch) { ch = e.kind === 'foe' ? buildFoe(e) : M3.build(e.cfg); root.add(ch.root); chars.set(e.id, ch); ch.deadVis = 0; }
      const tint = TINT(e);
      let state = e.state, p = e.p || 0;
      if (state === 'bones') { state = 'dead'; }
      if (state === 'rise') state = 'idle';
      if (state === 'hop') state = 'walk';
      const moving = state === 'walk' || state === 'run';
      const yaw = e.facing > 0 ? 1.0 : -1.0;
      let alpha = e.alpha == null ? 1 : e.alpha;
      if (e.buffs && (e.buffs.inkcloud > 0 || e.buffs.ghost > 0)) alpha = Math.min(alpha, 0.35);
      if (e.yielded) { state = 'kneel'; }
      else if (e.dead) { ch.deadVis += dt; alpha *= clamp(1 - (ch.deadVis - 1.2) / 0.8, 0, 1); }
      const hop = e.cfg.rig === 'inkspawn' && (e.state === 'hop' || e.state === 'walk') ? (e.animT * 1.7) % 1 : 0;
      M3.animate(ch, {
        x: wx(e.x), z: wz(e.y), h: H(-(e.z || 0)) + (e.def && e.def.flying ? 0 : 0), yaw, state, p, t: e.animT, hitAt: e.hitAt,
        scale: 1.18 * (e.kind === 'foe' && !e.champ ? 1.08 : 1) * (e.status.toad > 0 ? 0.42 : 1), flash: e.flash * 0.55, tint: tint && tint[0], tintA: tint ? tint[1] : 0, alpha,
        dead: e.dead && !e.yielded ? ch.deadVis / 0.45 : (e.state === 'bones' ? 1 : 0), hop, speed: moving ? Math.hypot(e.vx || 0, e.vy || 0) : 0,
      }, dt);
      // status icons over the head
      if (e.status.stun > 0 && !e.dead) { const s = take('stars', () => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: K3.starTex(), color: 0xfff2a0, transparent: true, depthWrite: false })); sp.scale.setScalar(0.32); g.add(sp); } return g; }); const top = topOf(e, ch); s.position.set(top.x, top.y + 0.1, top.z); s.children.forEach((c, i) => { const a = b.t * 5 + i * 2.1; c.position.set(Math.cos(a) * 0.4, Math.sin(a * 2) * 0.05, Math.sin(a) * 0.25); }); }
      if (e.shield > 0) { const s = take('shieldB', () => new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), addMat('#bfe0ff', { opacity: 0.2 }))); s.position.set(wx(e.x), 1.1, wz(e.y)); s.scale.set(0.95, 1.35, 0.95); s.material.opacity = 0.16 + Math.sin(b.t * 5) * 0.05; }
      if (e.buffs && e.buffs.bulwark > 0) { const s = take('bubble', () => new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), addMat('#9ac8ff', { opacity: 0.18 }))); s.position.set(wx(e.x), 1.1, wz(e.y)); s.scale.set(0.9, 1.3, 0.9); s.material.opacity = 0.12 + Math.sin(b.t * 6) * 0.04; }
      if (e.kind === 'hero' && b.state === 'fight') { const r = take('heroRing', () => flatDisc(ringTex(), '#ffd27a', { opacity: 0.55 })); r.position.set(wx(e.x), 0.03, wz(e.y)); r.scale.setScalar(0.75 + Math.sin(b.t * 4) * 0.04); }
      if (e.kind === 'ally' && !e.dead && !e.champ) { const r = take('allyRing', () => flatDisc(ringTex(), '#7bd389', { opacity: 0.5 })); r.position.set(wx(e.x), 0.03, wz(e.y)); r.scale.setScalar(0.7); }
      if (e.champ && !e.dead) { const r = take(e.kind === 'ally' ? 'champRingA' : 'champRingF', () => flatDisc(ringTex(), e.kind === 'ally' ? '#7bff9a' : '#ff6a5a', { opacity: 0.5 })); r.position.set(wx(e.x), 0.03, wz(e.y)); r.scale.setScalar(0.72); }
      if (e.elite && !e.dead) { const r = take('eliteRing', () => flatDisc(discTex(), '#ffffff', { opacity: 0.42 })); r.material.color.set(ELITES[e.elite].c); r.position.set(wx(e.x), 0.04, wz(e.y)); r.scale.setScalar(((e.r || 14) / 14) * 1.15 + Math.sin(b.t * 4 + e.id) * 0.08); }
      if (e.boss && e.kind === 'foe' && !e.dead) { const r = take('bossRing', () => flatDisc(discTex(), '#ff3a2a', { opacity: 0.32 })); r.position.set(wx(e.x), 0.04, wz(e.y)); r.scale.setScalar(((e.r || 20) / 14) * 1.25 + Math.sin(b.t * 2.5) * 0.1); }
      if (b.hero.target === e && !e.dead) { const r = take('tgtRing', () => flatDisc(ringTex(), '#ff4a3a', { opacity: 0.7 })); r.position.set(wx(e.x), 0.035, wz(e.y)); r.scale.setScalar(((e.r || 14) / 14) * 0.85 + Math.sin(b.t * 6) * 0.05); }
    }
    for (const [id, ch] of chars) if (!seen.has(id)) { M3.dispose(ch); chars.delete(id); }
  }

  /* ---------- projectiles ---------- */
  const PCOLS = { fireball: '#ff7a2a', bolt: '#8fd7ff', hex: '#c06ae8', cold: '#9fe6ff', silver: '#eef4ff', bone: '#d8ffd0', flask: '#ffb04a', lightning: '#cfe8ff', quarrel: '#e6eef8', rock: '#9a9488', knife: '#e6eef8', bola: '#c8b08a', nightshade: '#8fd14f' };
  function drawProjs(b) {
    for (const p of b.projs) {
      const k = p.D ? clamp((p.t * p.speed) / p.D, 0, 1) : 0;
      const h = p.h0 != null ? lerp(p.h0, p.h1 != null ? p.h1 : p.h0, k) : 44;
      const gy = p.y + h;
      const X = wx(p.x), Y = Math.max(0.15, H(h)), Z = wz(gy);
      const col = p.color || PCOLS[p.kind] || '#ffffff';
      const solid = p.kind === 'rock' || p.kind === 'quarrel' || p.kind === 'knife' || p.kind === 'bola' || p.kind === 'silver' || p.kind === 'bone';
      const g = take('pg_' + col, () => { const gg = new THREE.Group(); const sp = K3.glowSprite3(col, 1, 0.9); gg.add(sp); const core = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: C(col).multiplyScalar(2.2) })); gg.add(core); gg.userData = { sp, core }; return gg; });
      g.position.set(X, Y, Z);
      const big = p.kind === 'fireball' ? 1.6 : p.kind === 'flask' ? 0.7 : solid ? 0.45 : 0.9;
      g.userData.sp.scale.setScalar(big * (1 + Math.sin(b.t * 30) * 0.08));
      g.userData.sp.material.opacity = solid ? 0.35 : 0.95;
      g.userData.core.scale.set(big * (solid ? 0.12 : 0.16) * (solid ? 2.4 : 1), big * (solid ? 0.12 : 0.16) * (solid ? 0.5 : 1), big * (solid ? 0.12 : 0.16) * (solid ? 0.5 : 1));
      g.rotation.set(0, -Math.atan2((p.vy || 0) * ZK, p.vx || 1), 0);
      // trail sprites
      p._tr = p._tr || [];
      p._tr.unshift([X, Y, Z]); if (p._tr.length > 7) p._tr.pop();
      p._tr.forEach((q, i) => { if (i === 0) return; const s = take('tr_' + col, () => K3.glowSprite3(col, 1, 0.5)); s.position.set(q[0], q[1], q[2]); s.scale.setScalar(big * (0.9 - i * 0.11)); s.material.opacity = 0.5 - i * 0.06; });
    }
  }

  /* ---------- fx ---------- */
  const lineMesh = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), addMat('#ffffff', { map: discTex() })); m.rotation.x = -PI / 2; return m; };
  function groundLine(kind, x1, y1, x2, y2, w, col, op) {
    const m = take(kind, lineMesh);
    const X1 = wx(x1), Z1 = wz(y1), X2 = wx(x2), Z2 = wz(y2);
    m.position.set((X1 + X2) / 2, 0.04, (Z1 + Z2) / 2);
    m.rotation.set(-PI / 2, 0, -Math.atan2(Z2 - Z1, X2 - X1));
    m.scale.set(Math.hypot(X2 - X1, Z2 - Z1), w, 1);
    m.material.color.set(col); m.material.opacity = op;
    return m;
  }
  function drawFx(b) {
    for (const f of b.fx) {
      const k = f.dur ? clamp(f.t / f.dur, 0, 1) : 0;
      switch (f.type) {
        case 'tele': {
          const col = f.color || '#ff4a2a';
          if (f.shape === 'circle') {
            const r = H(0) + f.r / WU;
            const a = take('teleA', () => flatDisc(discTex(), '#ff4a2a', { opacity: 0.4 })); a.material.color.set(col); a.position.set(wx(f.x), 0.05, wz(f.y)); a.scale.set(r, r * ZK, 1); a.material.opacity = 0.25 + Math.sin(b.t * 18) * 0.06;
            const c = take('teleB', () => flatDisc(discTex(), '#ff4a2a', { opacity: 0.6 })); c.material.color.set(col); c.position.set(wx(f.x), 0.06, wz(f.y)); c.scale.set(r * k, r * k * ZK, 1); c.material.opacity = 0.5;
          } else {
            groundLine('teleL', f.x, f.y, f.x2, f.y2, f.w / WU * 1.2, col, 0.3 + Math.sin(b.t * 18) * 0.06);
            groundLine('teleL2', f.x, f.y, lerp(f.x, f.x2, k), lerp(f.y, f.y2, k), f.w / WU * 1.2, col, 0.45);
          }
          break;
        }
        case 'ring': {
          const r = lerp(f.r0, f.r1, easeOut(k)) / WU;
          const m = take('ring', () => flatDisc(ringTex(), '#ffffff', { opacity: 1 })); m.material.color.set(f.c || '#ffffff'); m.position.set(wx(f.x), 0.07, wz(f.y)); m.scale.set(r, r * ZK, 1); m.material.opacity = (1 - k) * 0.95;
          break;
        }
        case 'tapground': case 'tapfoe': {
          const m = take('tap', () => flatDisc(ringTex(), '#ffffff', { opacity: 1 })); m.material.color.set(f.type === 'tapfoe' ? '#ff6a4a' : '#ffe9a8'); m.position.set(wx(f.x), 0.06, wz(f.y)); const r = lerp(0.9, 0.35, easeOut(k)); m.scale.set(r, r, 1); m.material.opacity = 1 - k;
          break;
        }
        case 'slash': {
          const m = take('slash', () => { const mm = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), addMat('#ffffff', { map: slashTex() })); return mm; });
          const gy = f.y + 60;
          m.position.set(wx(f.x), H(gy - f.y), wz(gy) + 0.3);
          m.rotation.set(-0.5, 0, (f.f > 0 ? -1 : 1) * (0.6 - k * 1.2));
          const s = (f.big ? 2.4 : 1.7) * (0.7 + k * 0.5); m.scale.set(f.f > 0 ? s : -s, s, 1);
          m.material.color.set(f.c || '#ffffff'); m.material.opacity = (1 - k) * 1.2;
          break;
        }
        case 'streak': case 'beam': {
          const gy1 = f.y + 50, gy2 = f.y2 + 40;
          const A = new THREE.Vector3(wx(f.x), H(gy1 - f.y), wz(gy1)), Bv = new THREE.Vector3(wx(f.x2), H(gy2 - f.y2), wz(gy2));
          const m = take('beam', () => { const mm = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true), addMat('#ffffff')); return mm; });
          const L = A.distanceTo(Bv); m.position.copy(A).add(Bv).multiplyScalar(0.5);
          m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bv.clone().sub(A).normalize());
          const w = ((f.wide || 6) / WU) * (f.type === 'streak' ? 0.8 : 1) * (1 + Math.sin(b.t * 40) * 0.15);
          m.scale.set(w, L, w); m.material.color.set(f.c || '#ffffff'); m.material.opacity = (1 - k * k) * 0.9;
          break;
        }
        case 'explosion': {
          const m = take('boom', () => new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), addMat('#ff9a4a', { opacity: 0.8 })));
          const r = (f.r || 90) / WU * (0.4 + easeOut(k) * 0.9);
          m.position.set(wx(f.x), 0.4, wz(f.y)); m.scale.set(r, r * 0.8, r * ZK * 0.7); m.material.color.set(f.c || '#ff9a4a'); m.material.opacity = (1 - k) * 0.85;
          const s = take('boomS', () => K3.glowSprite3('#ffcf8a', 1, 1)); s.position.set(wx(f.x), 0.8, wz(f.y)); s.scale.setScalar(r * 3.2); s.material.opacity = (1 - k);
          break;
        }
        case 'pillar': {
          const m = take('pillar', () => new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16, 1, true), addMat('#ffe9a8', { opacity: 0.8 })));
          const w = (f.w || 40) / WU * (1 - k * 0.6);
          m.position.set(wx(f.x), 6, wz(f.y)); m.scale.set(w, 12, w); m.material.color.set(f.c || '#ffe9a8'); m.material.opacity = (1 - k) * 0.85;
          const s = take('pillarS', () => K3.glowSprite3('#fff2c0', 1, 1)); s.position.set(wx(f.x), 0.5, wz(f.y)); s.scale.setScalar(3.2 * (1 - k * 0.5)); s.material.opacity = 1 - k;
          break;
        }
        case 'lightning': {
          for (let i = 0; i < f.pts.length - 1; i++) {
            const [x1, y1] = f.pts[i], [x2, y2] = f.pts[i + 1];
            const A = new THREE.Vector3(wx(x1), 1.2, wz(y1 + 44)), Bv = new THREE.Vector3(wx(x2), 1.2, wz(y2 + 44));
            const segs = 5; let prev = A;
            for (let j = 1; j <= segs; j++) {
              const q = A.clone().lerp(Bv, j / segs); if (j < segs) { q.x += (Math.random() - 0.5) * 0.5; q.y += (Math.random() - 0.5) * 0.6; }
              const m = take('bolt', () => new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 5, 1, true), addMat('#cfe8ff')));
              m.position.copy(prev).add(q).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(prev).normalize());
              m.scale.set(0.05, prev.distanceTo(q), 0.05); m.material.opacity = (1 - k); prev = q;
            }
          }
          break;
        }
        case 'glint': case 'flashpt': {
          const s = take('glint', () => K3.glowSprite3('#ffffff', 1, 1)); const gy = f.y + 60; s.position.set(wx(f.x), H(gy - f.y), wz(gy)); s.scale.setScalar(1.6 * Math.sin(k * PI)); s.material.color.set(f.c || '#fff6d0');
          break;
        }
        case 'cloud': {
          for (let i = 0; i < 5; i++) { const c = take('cloudS', () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: K3.glowTex(), color: 0x2a2e3a, transparent: true, depthWrite: false, opacity: 0.85 })); return sp; }); const a = i * 1.3 + b.t * 0.4; c.position.set(wx(f.x) + Math.cos(a) * (f.r / WU) * 0.6, 4.2 + Math.sin(a * 2) * 0.15, wz(f.y) + Math.sin(a) * 0.6); c.scale.setScalar(2.6); c.material.opacity = 0.85 * Math.min(1, (f.dur - f.t) * 2, f.t * 3); }
          break;
        }
        case 'aura': {
          const e = f.ent; if (!e || e.dead) break;
          const r = take('aura', () => flatDisc(discTex(), '#ffffff', { opacity: 0.5 })); r.material.color.set(f.c || '#ffffff'); r.position.set(wx(e.x), 0.05, wz(e.y)); r.scale.setScalar(1.0 + Math.sin(b.t * 5) * 0.06); r.material.opacity = 0.35 * (1 - k * 0.5);
          break;
        }
        default: break;
      }
    }
    // zones
    for (const z of b.zones) {
      const k = clamp((z.dur - z.t) * 2, 0, 1);
      const col = z.color || z.light || '#ff8a3a';
      const d = take('zone', () => flatDisc(discTex(), '#ff8a3a', { opacity: 0.5 })); d.material.color.set(col); d.position.set(wx(z.x), 0.045, wz(z.y)); const r = z.r / WU; d.scale.set(r, r * ZK, 1); d.material.opacity = (0.35 + Math.sin(b.t * 7 + z.x) * 0.06) * k;
      if (z.kind === 'fire') for (let i = 0; i < 5; i++) { const fl = take('zflame', () => { const s = K3.flameSprite(0.9); return s; }); const a = i * 1.26 + z.x; fl.position.set(wx(z.x) + Math.cos(a) * r * 0.55, 0, wz(z.y) + Math.sin(a) * r * 0.55 * ZK); const s = 0.8 + Math.sin(b.t * 12 + i) * 0.15; fl.scale.set(0.5 * s * k, 0.95 * s * k, 1); }
      if (z.kind === 'trap') { d.scale.set(0.5, 0.5 * ZK, 1); d.material.opacity = 0.6; }
      if (z.kind === 'holy') { const c = take('zcol', () => new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 24, 1, true), addMat('#ffe9a8', { opacity: 0.2 }))); c.position.set(wx(z.x), 1.2, wz(z.y)); c.scale.set(r, 2.4, r * ZK); c.material.opacity = 0.14 * k; }
    }
    // drain beam while channelling
    const h = b.hero;
    if (h.channel && h.channel.target && !h.channel.target.dead) { const t = h.channel.target; f2beam(b, h.x, h.y, t.x, t.y, '#7bd389'); }
  }
  function f2beam(b, x1, y1, x2, y2, c) {
    const A = new THREE.Vector3(wx(x1), 1.3, wz(y1)), Bv = new THREE.Vector3(wx(x2), 1.1, wz(y2));
    const m = take('beam', () => new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true), addMat('#ffffff')));
    m.position.copy(A).add(Bv).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bv.clone().sub(A).normalize());
    const w = 0.08 + Math.sin(b.t * 30) * 0.03; m.scale.set(w, A.distanceTo(Bv), w); m.material.color.set(c); m.material.opacity = 0.8;
  }

  /* ---------- lights from the battle ---------- */
  function lights(b) {
    const L = [];
    const add = (x, gy, hpx, c, i, d) => L.push({ x: wx(x), y: Math.max(0.5, H(hpx)), z: wz(gy), c, i, d });
    for (const p of b.projs) { const c = { fireball: ['#ff8a3a', 2.4, 7], bolt: ['#8fd7ff', 1.2, 4], hex: ['#b06ad8', 1.2, 4], cold: ['#9fe6ff', 1, 4], bone: ['#9dffb0', 0.8, 3], flask: ['#ffb04a', 1, 3] }[p.kind]; if (c) add(p.x, p.y + (p.h0 || 44), p.h0 || 44, c[0], c[1], c[2]); }
    for (const f of b.fx) { const k = f.dur ? clamp(f.t / f.dur, 0, 1) : 0; if (f.type === 'explosion') add(f.x, f.y, 40, f.c || '#ff9a4a', 4 * (1 - k), 9); if (f.type === 'pillar') add(f.x, f.y, 90, '#ffe9a8', 4 * (1 - k), 9); if (f.type === 'lightning') { const q = f.pts[f.pts.length - 1]; add(q[0], q[1] + 44, 50, '#cfe8ff', 3 * (1 - k), 8); } }
    for (const z of b.zones) if (z.light) add(z.x, z.y, 20, z.light, 1.4 * clamp((z.dur - z.t) * 2, 0, 1), z.r / WU * 2.5);
    for (const e of b.ents) { if (e.dead) continue; if (e.cfg.rig === 'wisp') add(e.x, e.y, 90, '#9fe6ff', 1.2, 5); if (e.type === 'sexton') add(e.x - e.facing * 20, e.y, 50, '#7bd389', 1.6, 7); }
    return L.slice(0, 3);
  }

  return {
    begin(host) {
      if (!root) { root = new THREE.Group(); R3.scene.add(root); pts = makePoints(); root.add(pts.solid); root.add(pts.glow); }
      ensureOverlay(host);
      overlay.style.display = 'block';
    },
    end() {
      for (const [, ch] of chars) M3.dispose(ch); chars.clear();
      recycleAll();
      for (const [, d] of bars) d.remove(); bars.clear();
      texts.forEach((d) => { d.style.display = 'none'; });
      if (overlay) overlay.style.display = 'none';
      if (pts) { pts.glow.geometry.setDrawRange(0, 0); pts.solid.geometry.setDrawRange(0, 0); }
    },
    render(b, dt) {
      recycleAll();
      drawEnts(b, dt);
      drawProjs(b);
      drawFx(b);
      drawParts(b);
      R3.shake = b.shake; R3.zoom = b.zoom;
      R3.setFx({ uGrey: b.lost ? Math.min(1, b.stateT * 0.8) : 0, uHurt: Math.max(0, (HUD.hurtT || 0)) });
      R3.render(dt, lights(b));
      drawBars(b); drawTexts(b);
    },
    /* pick a foe under CSS px, else null */
    pickFoe(b, px, py) {
      let best = null, bd = 1e9;
      for (const e of b.ents) {
        if (e.kind !== 'foe' || e.dead || e.state === 'bones' || e.state === 'rise') continue;
        const ch = chars.get(e.id); if (!ch) continue;
        const top = topOf(e, ch);
        const a = R3.project(wx(e.x), 0, wz(e.y)), t = R3.project(top.x, top.y, top.z);
        const cx = (a.x + t.x) / 2, cy = (a.y + t.y) / 2, hh = Math.abs(a.y - t.y) / 2 + 12, ww = Math.max(26, hh * 0.6);
        const dx = (px - cx) / ww, dy = (py - cy) / hh, d = dx * dx + dy * dy;
        if (d < 1.25 && d < bd) { bd = d; best = e; }
      }
      return best;
    },
    chars,
  };
})();
