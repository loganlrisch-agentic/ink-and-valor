/* ==========================================================================
   3D characters - jointed chibi puppets built from primitives
   Built from the same cfg objects as the cast/enemy data.
   ========================================================================== */
const M3 = (() => {
  if (!HAS3D) return {};
  const { geo, mat, glowMat, mesh, grp } = K3;
  const PI = Math.PI;
  const OUTC = '#24160e';

  /* place a point on the head sphere: phiDeg around (90 = front), thetaDeg from top */
  function onHead(R, phiDeg, thetaDeg, k) {
    const ph = phiDeg * PI / 180, th = thetaDeg * PI / 180, r = R * (k || 1.01);
    return new THREE.Vector3(-r * Math.cos(ph) * Math.sin(th), r * Math.cos(th), r * Math.sin(ph) * Math.sin(th));
  }

  /* ---------------- weapons: grip at origin, business end along +Y ---------------- */
  function buildWeapon(w) {
    const g = grp();
    const t = w.type;
    const steel = mat(w.color || '#b9c3d0', { metal: true });
    const dark = mat('#3a2a1c');
    const gold = mat(w.color2 || '#c9a14a', { metal: true });
    g.userData.tip = new THREE.Vector3(0, 1, 0);
    if (t === 'sword') {
      g.add(mesh(geo.box(), steel, 0.11, 0.86, 0.035, 0, 0.56, 0));
      g.add(mesh(geo.cone(4), steel, 0.078, 0.16, 0.025, 0, 1.06, 0, 0, PI / 4, 0));
      g.add(mesh(geo.box(), mat('#e8eef6', { metal: true }), 0.02, 0.8, 0.04, 0, 0.56, 0));
      g.add(mesh(geo.box(), gold, 0.34, 0.06, 0.08, 0, 0.12, 0));
      g.add(mesh(geo.sphere(8), gold, 0.05, 0.05, 0.05, 0.17, 0.12, 0)); g.add(mesh(geo.sphere(8), gold, 0.05, 0.05, 0.05, -0.17, 0.12, 0));
      g.add(mesh(geo.cyl(1, 1, 8), mat('#5a3a22'), 0.045, 0.22, 0.045, 0, 0, 0));
      g.add(mesh(geo.sphere(8), gold, 0.065, 0.065, 0.065, 0, -0.13, 0));
      g.userData.tip.set(0, 1.12, 0);
    } else if (t === 'axe' || t === 'greataxe') {
      const L = t === 'greataxe' ? 1.25 : 0.9;
      g.add(mesh(geo.cyl(1, 1, 8), dark, 0.05, L, 0.05, 0, L / 2 - 0.1, 0));
      const head = new THREE.Shape(); head.moveTo(0, 0.12); head.quadraticCurveTo(0.42, 0.34, 0.38, 0); head.quadraticCurveTo(0.42, -0.34, 0, -0.12); head.lineTo(0, 0.12);
      const hg = new THREE.ExtrudeGeometry(head, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 1 });
      const hm = new THREE.Mesh(hg, steel); hm.position.set(0.02, L - 0.24, -0.03); g.add(hm);
      if (t === 'greataxe') { const hm2 = new THREE.Mesh(hg, steel); hm2.rotation.y = PI; hm2.position.set(-0.02, L - 0.24, 0.03); g.add(hm2); }
      g.add(mesh(geo.cyl(1, 1, 8), mat('#6a4a2a'), 0.065, 0.14, 0.065, 0, 0.05, 0));
      g.userData.tip.set(0.3, L - 0.24, 0);
    } else if (t === 'mace' || t === 'hammer' || t === 'club') {
      g.add(mesh(geo.cyl(1, 1, 8), dark, 0.05, 0.78, 0.05, 0, 0.3, 0));
      if (t === 'mace') {
        g.add(mesh(geo.ico(0), mat(w.color || '#5a5f69', { metal: true, flat: true }), 0.17, 0.17, 0.17, 0, 0.74, 0));
        for (const v of [[0.17, 0, 0], [-0.17, 0, 0], [0, 0.17, 0], [0, 0, 0.17], [0, 0, -0.17]]) { const s = mesh(geo.cone(5), steel, 0.04, 0.12, 0.04, v[0], 0.74 + v[1], v[2]); s.lookAt(new THREE.Vector3(v[0] * 5, 0.74 + v[1] * 5, v[2] * 5)); s.rotateX(PI / 2); g.add(s); }
      } else if (t === 'hammer') {
        g.add(mesh(geo.box(), mat(w.color || '#c9ced6', { metal: true }), 0.42, 0.24, 0.24, 0, 0.76, 0));
        g.add(mesh(geo.box(), gold, 0.44, 0.06, 0.26, 0, 0.76, 0));
        g.add(mesh(geo.sphere(8), glowMat(w.color2 || '#ffe9a8', 2.2), 0.06, 0.06, 0.06, 0, 0.76, 0.13));
      } else g.add(mesh(geo.sphere(10), mat(w.color || '#7a5233'), 0.15, 0.24, 0.15, 0, 0.68, 0));
      g.userData.tip.set(0, 0.8, 0);
    } else if (t === 'daggers' || t === 'knife') {
      g.add(mesh(geo.box(), steel, 0.07, 0.36, 0.025, 0, 0.26, 0));
      g.add(mesh(geo.cone(4), steel, 0.05, 0.1, 0.02, 0, 0.49, 0, 0, PI / 4, 0));
      g.add(mesh(geo.box(), mat(w.color2 || '#4a4a52', { metal: true }), 0.18, 0.04, 0.06, 0, 0.07, 0));
      g.add(mesh(geo.cyl(1, 1, 6), mat('#4a2a1a'), 0.035, 0.14, 0.035, 0, -0.01, 0));
      g.userData.tip.set(0, 0.52, 0);
    } else if (t === 'cleaver') {
      g.add(mesh(geo.box(), mat(w.color || '#6a6e76', { metal: true }), 0.2, 0.44, 0.03, 0.05, 0.32, 0));
      g.add(mesh(geo.cyl(1, 1, 6), dark, 0.04, 0.2, 0.04, 0, 0, 0));
      g.userData.tip.set(0.08, 0.52, 0);
    } else if (t === 'staff' || t === 'broom' || t === 'totem') {
      g.add(mesh(geo.cyl(0.8, 1, 7), mat(w.color || '#6a4a2a'), 0.05, 1.7, 0.05, 0, 0.25, 0));
      if (t === 'broom') { g.add(mesh(geo.cone(10), mat('#b89a52'), 0.18, 0.5, 0.18, 0, -0.8, 0, PI, 0, 0)); }
      else {
        const gc = w.color2 || '#8fd7ff';
        for (let i = 0; i < 3; i++) { const p = mesh(geo.torus(0.25, PI * 0.9, 10), mat('#6a4a2a'), 0.12, 0.12, 0.12, 0, 1.12, 0, PI / 2, (i * 2 * PI) / 3, 0); g.add(p); }
        const orb = mesh(geo.sphere(14), glowMat(gc, 2.6), 0.11, 0.11, 0.11, 0, 1.2, 0); orb.userData.glow = true; g.add(orb);
        const sp = K3.glowSprite3(gc, 0.9, 0.55); sp.position.set(0, 1.2, 0); sp.userData.pulse = true; g.add(sp);
        if (t === 'totem') g.add(mesh(geo.sphere(8), mat(PAL.bone), 0.12, 0.12, 0.12, 0, 1.0, 0));
      }
      g.userData.tip.set(0, 1.2, 0); g.userData.staff = true;
    } else if (t === 'spear') {
      g.add(mesh(geo.cyl(1, 1, 7), dark, 0.04, 1.7, 0.04, 0, 0.35, 0));
      g.add(mesh(geo.cone(4), steel, 0.07, 0.3, 0.07, 0, 1.33, 0));
      g.userData.tip.set(0, 1.45, 0);
    } else if (t === 'sickle' || t === 'scythe') {
      const L = t === 'scythe' ? 1.6 : 0.5;
      g.add(mesh(geo.cyl(1, 1, 7), mat('#3a2a1c'), 0.04, L, 0.04, 0, L / 2 - 0.1, 0));
      const bl = mesh(geo.torus(0.06, PI * 0.75, 14), mat(w.color || '#c7d0c4', { metal: true }), t === 'scythe' ? 0.5 : 0.24, t === 'scythe' ? 0.5 : 0.24, 0.3, (t === 'scythe' ? 0.5 : 0.24), L - 0.12, 0, 0, 0, PI * 0.15);
      g.add(bl);
      if (t === 'sickle') { const sp = K3.glowSprite3('#7bd389', 0.6, 0.45); sp.position.set(0.2, L, 0); g.add(sp); }
      g.userData.tip.set(t === 'scythe' ? 0.8 : 0.4, L - 0.1, 0);
    } else if (t === 'shovel') {
      g.add(mesh(geo.cyl(1, 1, 7), mat('#6a4a2a'), 0.045, 1.4, 0.045, 0, 0, 0));
      g.add(mesh(geo.box(), mat(w.color || '#5a5f69', { metal: true }), 0.32, 0.42, 0.04, 0, -0.85, 0));
      g.userData.tip.set(0, -0.95, 0);
    } else if (t === 'crossbow') {
      g.add(mesh(geo.box(), mat('#3e2a1a'), 0.09, 0.62, 0.09, 0, 0.2, 0));
      g.add(mesh(geo.torus(0.04, PI * 0.8, 12), mat('#5a5f69', { metal: true }), 0.34, 0.34, 0.34, 0, 0.38, 0, 0, 0, PI * 0.1));
      g.add(mesh(geo.box(), mat('#e6eef8', { metal: true }), 0.025, 0.42, 0.025, 0, 0.45, 0.05));
      g.userData.tip.set(0, 0.6, 0);
    } else if (t === 'bow') {
      const arc = mesh(geo.torus(0.035, PI * 0.95, 16), mat(w.color || '#6a4a2a'), 0.62, 0.62, 0.62, -0.1, 0, 0, 0, 0, -PI * 0.47);
      g.add(arc);
      const str = mesh(geo.cyl(1, 1, 4), mat('#e8e0cc'), 0.008, 1.2, 0.008, -0.1, 0, 0); g.add(str);
      g.userData.tip.set(0, 0.6, 0); g.userData.bow = true;
    } else if (t === 'lute') {
      g.add(mesh(geo.sphere(14), mat('#8a5a2a', { glossy: true }), 0.26, 0.32, 0.12, 0, 0.0, 0));
      g.add(mesh(geo.box(), mat('#3a2414'), 0.08, 0.6, 0.05, 0, 0.42, 0));
      g.add(mesh(geo.circle(16), mat('#1a0e08'), 0.07, 0.07, 1, 0, 0.05, 0.121));
      g.userData.tip.set(0, 0.7, 0);
    } else if (t === 'sling') {
      g.add(mesh(geo.cyl(1, 1, 4), mat('#6d5a3e'), 0.012, 0.42, 0.012, 0, -0.2, 0));
      g.add(mesh(geo.sphere(8), mat('#8a8578'), 0.06, 0.06, 0.06, 0, -0.42, 0));
      g.userData.tip.set(0, -0.42, 0);
    } else if (t === 'cards') {
      for (let i = -1; i <= 1; i++) g.add(mesh(geo.box(), mat(i === 0 ? '#f0e8d4' : '#e2d8c0'), 0.14, 0.2, 0.01, i * 0.05, 0.12, 0, 0, 0, i * 0.35));
    } else if (t === 'candle') {
      g.add(mesh(geo.cyl(1, 1, 8), mat('#efe6cf'), 0.05, 0.28, 0.05, 0, 0.12, 0));
      const f = K3.flameSprite(0.32); f.position.set(0, 0.26, 0); f.userData.flicker = true; g.add(f);
      const gl = K3.glowSprite3('#f2a541', 1.4, 0.5); gl.position.set(0, 0.34, 0); gl.userData.pulse = true; g.add(gl);
      g.userData.light = '#f2a541';
    } else if (t === 'mirror') {
      g.add(mesh(geo.cyl(1, 1, 6), mat('#9aa0aa', { metal: true }), 0.03, 0.22, 0.03, 0, 0, 0));
      g.add(mesh(geo.cyl(1, 1, 18), mat('#dfe6f2', { metal: true, shininess: 120 }), 0.16, 0.03, 0.2, 0, 0.26, 0, PI / 2, 0, 0));
      const sp = K3.glowSprite3('#cfe0ff', 0.5, 0.5); sp.position.set(0, 0.26, 0.05); g.add(sp);
    }
    return g;
  }

  function buildOffhand(o) {
    const g = grp(), t = o.type;
    if (t === 'shield') {
      g.add(mesh(geo.cyl(1, 1, 18), mat(o.color || '#6a4a30'), 0.33, 0.06, 0.33, 0, 0, 0.1, PI / 2, 0, 0));
      g.add(mesh(geo.torus(0.08, PI * 2, 24), mat(o.color2 || '#5a5f69', { metal: true }), 0.33, 0.33, 0.33, 0, 0, 0.13));
      g.add(mesh(geo.sphere(10), mat(o.color2 || '#aab5c3', { metal: true }), 0.09, 0.09, 0.06, 0, 0, 0.15));
      for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; g.add(mesh(geo.sphere(6), mat('#8a8f99', { metal: true }), 0.022, 0.022, 0.022, Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0.145)); }
    } else if (t === 'kite') {
      const s = new THREE.Shape(); s.moveTo(-0.3, 0.38); s.lineTo(0.3, 0.38); s.quadraticCurveTo(0.32, -0.05, 0, -0.5); s.quadraticCurveTo(-0.32, -0.05, -0.3, 0.38);
      const eg = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2 });
      const m = new THREE.Mesh(eg, mat(o.color || '#2f4f7a', { glossy: true })); m.position.z = 0.08; g.add(m);
      g.add(mesh(geo.box(), mat(o.color2 || '#c9a14a', { metal: true }), 0.07, 0.7, 0.03, 0, -0.02, 0.17));
      g.add(mesh(geo.box(), mat(o.color2 || '#c9a14a', { metal: true }), 0.42, 0.07, 0.03, 0, 0.14, 0.17));
    } else if (t === 'tome') {
      g.add(mesh(geo.box(), mat(o.color || '#5b2a24'), 0.32, 0.4, 0.1, 0, 0, 0.08));
      g.add(mesh(geo.box(), mat('#e8dcc0'), 0.29, 0.37, 0.08, 0.02, 0, 0.08));
      g.add(mesh(geo.sphere(8), mat(o.color2 || '#c9a14a', { metal: true }), 0.06, 0.06, 0.03, 0, 0, 0.14));
    } else if (t === 'lantern') {
      const lg = grp(0, -0.12, 0.06);
      lg.add(mesh(geo.cyl(1, 1, 6), mat(o.color || '#4a4f58', { metal: true }), 0.12, 0.05, 0.12, 0, 0, 0));
      lg.add(mesh(geo.cyl(1, 1, 6), glowMat(o.color2 || '#ffcf7a', 2.4, { opacity: 0.9 }), 0.1, 0.22, 0.1, 0, -0.14, 0));
      lg.add(mesh(geo.cyl(1, 1, 6), mat(o.color || '#4a4f58', { metal: true }), 0.13, 0.05, 0.13, 0, -0.27, 0));
      const sp = K3.glowSprite3(o.color2 || '#f2a541', 1.8, 0.7); sp.position.set(0, -0.14, 0); sp.userData.pulse = true; lg.add(sp);
      g.add(lg); g.userData.lantern = lg; g.userData.light = o.color2 || '#f2a541';
    } else if (t === 'bow') {
      const b = buildWeapon({ type: 'bow', color: o.color }); g.add(b);
    }
    return g;
  }

  /* ---------------- hair & hats ---------------- */
  function hairMeshes(head, cfg, R) {
    const h = cfg.hair; if (!h || h.style === 'bald') return;
    const m = mat(h.color, { glossy: true });
    const cap = () => { const c = mesh(geo.sphere(18), m, R * 1.07, R * 1.02, R * 1.07, 0, R * 0.08, -R * 0.03); c.scale.y *= 1; head.add(c); const cut = mesh(geo.hemi(), m, R * 1.08, R * 1.0, R * 1.08, 0, R * 0.05, -R * 0.02); head.add(cut); return c; };
    if (h.style === 'spiky') {
      head.add(mesh(geo.hemi(), m, R * 1.05, R * 0.95, R * 1.05, 0, R * 0.12, -R * 0.02));
      for (let i = 0; i < 9; i++) { const a = (i / 9) * PI * 2; const sp = mesh(geo.cone(6), m, R * 0.26, R * 0.65, R * 0.26, Math.cos(a) * R * 0.55, R * 0.82, Math.sin(a) * R * 0.5 - R * 0.1); sp.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7); head.add(sp); }
      head.add(mesh(geo.cone(6), m, R * 0.3, R * 0.6, R * 0.3, R * 0.15, R * 0.72, R * 0.62, 1.1, 0, -0.2));
    } else if (h.style === 'mop' || h.style === 'long' || h.style === 'pony' || h.style === 'braid' || h.style === 'bun') {
      head.add(mesh(geo.hemi(), m, R * 1.08, R * 1.02, R * 1.08, 0, R * 0.04, -R * 0.03));
      const fr = mesh(geo.sphere(12), m, R * 0.9, R * 0.32, R * 0.4, R * 0.05, R * 0.58, R * 0.62, -0.5, 0, 0.12); head.add(fr);
      for (const s of [-1, 1]) head.add(mesh(geo.sphere(10), m, R * 0.28, R * 0.55, R * 0.4, s * R * 0.84, R * 0.0, R * 0.1));
      if (h.style === 'long') head.add(mesh(geo.sphere(12), m, R * 0.95, R * 1.15, R * 0.5, 0, -R * 0.55, -R * 0.62));
      if (h.style === 'pony') { const pt = mesh(geo.sphere(10), m, R * 0.3, R * 0.75, R * 0.3, 0, -R * 0.3, -R * 1.1, -0.5, 0, 0); head.add(pt); head.userData.pony = pt; }
      if (h.style === 'braid') for (let i = 0; i < 5; i++) head.add(mesh(geo.sphere(8), m, R * 0.2, R * 0.22, R * 0.2, 0, -R * 0.3 - i * R * 0.32, -R * 0.95));
      if (h.style === 'bun') head.add(mesh(geo.sphere(12), m, R * 0.42, R * 0.42, R * 0.42, 0, R * 0.65, -R * 0.75));
    } else if (h.style === 'wild') {
      const r = mulberry32(3);
      for (let i = 0; i < 14; i++) { const a = r() * PI * 2, el = r() * 1.2; head.add(mesh(geo.sphere(8), m, R * (0.35 + r() * 0.2), R * (0.35 + r() * 0.2), R * (0.35 + r() * 0.2), Math.cos(a) * R * 0.8 * Math.cos(el * 0.6), R * 0.35 + Math.sin(el) * R * 0.6, Math.sin(a) * R * 0.75 - R * 0.25)); }
    }
  }

  function hatMeshes(head, cfg, R, char) {
    const hat = cfg.hat; if (!hat) return false;
    const c = hat.color, c2 = hat.color2;
    const metal = (col) => mat(col || '#b0bac6', { metal: true });
    switch (hat.type) {
      case 'helm': case 'greathelm': {
        head.add(mesh(geo.hemi(), metal(c), R * 1.12, R * 1.12, R * 1.12, 0, R * 0.08, 0));
        head.add(mesh(geo.torus(0.07, PI * 2, 24), metal(c2 || '#7c8692'), R * 1.12, R * 1.12, R * 1.12, 0, R * 0.12, 0, PI / 2, 0, 0));
        head.add(mesh(geo.box(), metal(c2 || '#7c8692'), R * 0.12, R * 0.78, R * 0.1, 0, R * 0.62, R * 1.0, -0.15, 0, 0));
        if (hat.type === 'greathelm') { const face = mesh(geo.cyl(1, 1, 18, true), metal(c), R * 1.1, R * 0.8, R * 1.1, 0, -R * 0.3, 0); head.add(face); head.add(mesh(geo.box(), mat('#0a0806'), R * 0.9, R * 0.1, R * 0.1, 0, -R * 0.05, R * 1.08)); }
        else { head.add(mesh(geo.box(), metal(c2 || '#7c8692'), R * 0.1, R * 0.55, R * 0.12, 0, -R * 0.12, R * 1.06)); for (const s of [-1, 1]) head.add(mesh(geo.box(), metal(c), R * 0.12, R * 0.62, R * 0.5, s * R * 0.98, -R * 0.15, R * 0.22)); }
        for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2; head.add(mesh(geo.sphere(6), metal('#e0e6ee'), R * 0.05, R * 0.05, R * 0.05, Math.cos(a) * R * 1.13, R * 0.13, Math.sin(a) * R * 1.13)); }
        if (hat.plume) { const pl = grp(0, R * 1.15, -R * 0.1); for (let i = 0; i < 4; i++) pl.add(mesh(geo.sphere(8), mat(hat.plume, { glossy: true }), R * 0.18, R * 0.55, R * 0.22, 0, R * 0.3, -R * (0.2 + i * 0.32), -0.8 - i * 0.25, 0, 0)); head.add(pl); char.plume = pl; }
        return true;
      }
      case 'wizard': {
        head.add(mesh(geo.cyl(1, 1, 24), mat(c || '#2c2a5a'), R * 1.85, R * 0.05, R * 1.85, 0, R * 0.42, 0));
        const cone = grp(0, R * 0.45, 0);
        const c1 = mesh(geo.cone(16), mat(c || '#2c2a5a'), R * 0.95, R * 1.2, R * 0.95, 0, R * 0.6, 0); cone.add(c1);
        const c2m = mesh(geo.cone(12), mat(c || '#2c2a5a'), R * 0.45, R * 1.0, R * 0.45, 0, R * 1.45, -R * 0.35, -0.6, 0, 0); cone.add(c2m);
        cone.add(mesh(geo.cyl(1, 1, 20), mat(c2 || '#c9a14a', { metal: true }), R * 0.88, R * 0.14, R * 0.88, 0, R * 0.1, 0));
        const star = mesh(geo.ico(0), glowMat(c2 || '#ffd56a', 2.6), R * 0.1, R * 0.1, R * 0.1, 0, R * 0.55, R * 0.72); cone.add(star);
        head.add(cone); char.hatTip = c2m;
        return false;
      }
      case 'hood': case 'cowl': {
        const deep = hat.type === 'cowl';
        const hm = mat(c || '#2e3b2e', { double: true });
        const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, PI * 0.93, PI * 1.14, 0, PI * 0.8), hm);
        shell.scale.set(R * 1.14, R * 1.16, R * 1.16); shell.position.set(0, R * 0.08, -R * 0.06); shell.rotation.y = 0; head.add(shell);
        head.add(mesh(geo.cone(12), hm, R * 0.6, R * 0.7, R * 0.4, 0, R * 1.05, -R * 0.75, -1.9, 0, 0));
        if (deep) head.add(mesh(geo.sphere(14), mat('#050406', { opacity: 0.55 }), R * 1.02, R * 1.0, R * 0.5, 0, 0, R * 0.62));
        char.drape = mesh(geo.cone(12, true), hm, R * 1.25, R * 0.8, R * 1.0, 0, -R * 1.05, -R * 0.1);
        head.add(char.drape);
        return true;
      }
      case 'veil': {
        const hm = mat(c || '#262a3a', { double: true });
        const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, PI * 0.95, PI * 1.1, 0, PI * 0.82), hm);
        shell.scale.set(R * 1.15, R * 1.18, R * 1.18); head.add(shell);
        head.add(mesh(geo.torus(0.1, PI * 1.2, 18), mat(c2 || '#f1ead8'), R * 1.05, R * 1.05, R * 1.05, 0, R * 0.05, R * 0.05, 0, 0, -PI * 0.1));
        head.add(mesh(geo.box(), mat('#c9a14a', { metal: true }), R * 1.5, R * 0.1, R * 0.4, 0, R * 0.62, R * 0.62, -0.5, 0, 0));
        head.add(mesh(geo.cone(12, true), hm, R * 1.1, R * 1.5, R * 0.9, 0, -R * 1.0, -R * 0.35));
        return true;
      }
      case 'circlet': {
        head.add(mesh(geo.torus(0.06, PI * 2, 24), mat(c || '#c9a14a', { metal: true }), R * 1.03, R * 1.03, R * 1.03, 0, R * 0.32, 0, PI / 2 + 0.15, 0, 0));
        const gem = mesh(geo.ico(0), glowMat(c2 || '#7fd1ff', 2.2), R * 0.1, R * 0.12, R * 0.08, 0, R * 0.48, R * 0.98); head.add(gem);
        return false;
      }
      case 'cap': {
        head.add(mesh(geo.hemi(), mat(c || '#6b4527'), R * 1.08, R * 0.9, R * 1.08, 0, R * 0.12, 0));
        head.add(mesh(geo.cyl(1, 1, 16), mat(c || '#6b4527'), R * 0.7, R * 0.05, R * 0.5, 0, R * 0.18, R * 0.82));
        return false;
      }
      case 'pot': {
        head.add(mesh(geo.cyl(0.92, 1, 16, true), mat(c || '#4b4f58', { metal: true, double: true }), R * 1.1, R * 0.6, R * 1.1, 0, R * 0.48, 0));
        head.add(mesh(geo.cyl(1, 1, 16), mat(c || '#4b4f58', { metal: true }), R * 1.02, R * 0.06, R * 1.02, 0, R * 0.78, 0));
        head.add(mesh(geo.torus(0.12, PI * 2, 18), mat(c2 || '#3a3d45', { metal: true }), R * 1.15, R * 1.15, R * 1.15, 0, R * 0.18, 0, PI / 2, 0, 0));
        head.add(mesh(geo.box(), mat('#3a3d45', { metal: true }), R * 0.7, R * 0.12, R * 0.14, R * 1.4, R * 0.7, 0));
        return true;
      }
      case 'crown': {
        const cr = grp(0, R * 0.78, 0); cr.rotation.z = 0.15;
        cr.add(mesh(geo.cyl(1, 1, 16, true), mat(c || '#c9a545', { metal: true, double: true }), R * 0.75, R * 0.28, R * 0.75, 0, 0, 0));
        for (let i = 0; i < 7; i++) { const a = (i / 7) * PI * 2; cr.add(mesh(geo.cone(4), mat(c || '#c9a545', { metal: true }), R * 0.13, R * 0.38 + (i % 2) * R * 0.15, R * 0.13, Math.cos(a) * R * 0.72, R * 0.3, Math.sin(a) * R * 0.72)); }
        cr.add(mesh(geo.ico(0), glowMat('#ff4a3a', 1.8), R * 0.09, R * 0.09, R * 0.09, 0, 0, R * 0.76));
        head.add(cr);
        return false;
      }
      case 'brim': {
        head.add(mesh(geo.cyl(1, 1, 28), mat(c || '#1f1b1b'), R * 2.1, R * 0.05, R * 2.1, 0, R * 0.48, 0, 0.06, 0, 0));
        head.add(mesh(geo.cyl(0.85, 1, 20), mat(c || '#1f1b1b'), R * 0.9, R * 0.7, R * 0.9, 0, R * 0.85, 0));
        head.add(mesh(geo.cyl(1, 1, 20), mat(c2 || '#7a1f1b'), R * 0.92, R * 0.14, R * 0.92, 0, R * 0.6, 0));
        head.add(mesh(geo.box(), mat('#c9a545', { metal: true }), R * 0.2, R * 0.2, R * 0.05, 0, R * 0.6, R * 0.92));
        return false;
      }
      case 'tophat': {
        head.add(mesh(geo.cyl(1, 1, 24), mat(c || '#262028', { glossy: true }), R * 1.35, R * 0.05, R * 1.35, 0, R * 0.62, 0));
        head.add(mesh(geo.cyl(1, 0.92, 22), mat(c || '#262028', { glossy: true }), R * 0.8, R * 1.2, R * 0.8, 0, R * 1.25, 0));
        head.add(mesh(geo.cyl(1, 1, 22), mat(c2 || '#7a1f1b'), R * 0.82, R * 0.16, R * 0.82, 0, R * 0.78, 0));
        return false;
      }
      case 'kerchief': {
        head.add(mesh(geo.hemi(), mat(c || '#6a2f43'), R * 1.09, R * 1.0, R * 1.09, 0, R * 0.08, -R * 0.02));
        head.add(mesh(geo.sphere(8), mat(c || '#6a2f43'), R * 0.22, R * 0.18, R * 0.3, 0, R * 0.15, -R * 1.1));
        return true;
      }
      case 'bandana': {
        head.add(mesh(geo.cyl(1, 1, 22, true), mat(c || '#a3241c', { double: true }), R * 1.05, R * 0.3, R * 1.05, 0, R * 0.4, 0));
        head.add(mesh(geo.hemi(), mat(c || '#a3241c'), R * 1.04, R * 0.85, R * 1.04, 0, R * 0.5, 0));
        const tl = mesh(geo.box(), mat(c || '#a3241c'), R * 0.15, R * 0.6, R * 0.04, R * 0.15, R * 0.15, -R * 1.1, 0.4, 0, 0.2); head.add(tl); char.tail = tl;
        return false;
      }
      case 'shamanskull': {
        head.add(mesh(geo.hemi(), mat(PAL.bone), R * 1.1, R * 1.0, R * 1.1, 0, R * 0.12, 0));
        for (const s of [-1, 1]) head.add(mesh(geo.torus(0.12, PI * 0.6, 10), mat('#d8cfb8'), R * 0.7, R * 0.7, R * 0.7, s * R * 0.7, R * 0.9, 0, 0, PI / 2, s > 0 ? 0.2 : PI - 0.2));
        for (let i = 0; i < 3; i++) head.add(mesh(geo.box(), mat(['#b8321e', '#3b7bd1', '#e8c040'][i]), R * 0.06, R * 0.7, R * 0.15, -R * 0.4 + i * R * 0.15, R * 1.2, -R * 0.6, -0.4, 0, 0.2 - i * 0.2));
        for (const s of [-1, 1]) head.add(mesh(geo.sphere(8), mat('#1a1210'), R * 0.12, R * 0.14, R * 0.08, s * R * 0.3, R * 0.75, R * 0.88));
        return true;
      }
      case 'antlers': {
        for (const s of [-1, 1]) { const a = grp(s * R * 0.5, R * 0.75, 0); a.add(mesh(geo.cyl(0.6, 1, 6), mat('#5a4a3a'), R * 0.08, R * 0.9, R * 0.08, 0, R * 0.45, 0, 0, 0, -s * 0.5)); a.add(mesh(geo.cyl(0.6, 1, 6), mat('#5a4a3a'), R * 0.06, R * 0.5, R * 0.06, -s * R * 0.3, R * 0.8, R * 0.1, 0.4, 0, s * 0.6)); head.add(a); }
        return false;
      }
      case 'horned': {
        head.add(mesh(geo.hemi(), metal(c || '#6a6e76'), R * 1.12, R * 1.1, R * 1.12, 0, R * 0.08, 0));
        for (const s of [-1, 1]) head.add(mesh(geo.cone(8), mat('#e8dcc0'), R * 0.18, R * 0.9, R * 0.18, s * R * 1.0, R * 0.7, 0, 0, 0, -s * 0.9));
        return true;
      }
      default: return false;
    }
  }

  /* ---------------- torso ---------------- */
  function torsoMeshes(T, cfg, char) {
    const b = cfg.body || { type: 'tunic', color: '#5a4a6e' };
    const col = b.color || '#5a4a6e', w = cfg.wide || 1;
    const cloth = mat(col), trim = b.trim ? mat(b.trim, { metal: /c[0-9a-f]a|gold/i.test(b.trim) }) : null;
    const belt = mat(b.belt || '#4a2e1c', { glossy: true });
    const add = (m) => { T.add(m); return m; };
    switch (b.type) {
      case 'robe': case 'dress': {
        add(mesh(geo.torso(), cloth, 0.95 * w, 0.95, 0.8 * w, 0, 0, 0));
        const sk = add(mesh(geo.skirt(b.type === 'dress' ? 0.25 : 0.1), cloth, w, 1, 0.88 * w, 0, 0.04, 0));
        char.skirt = sk;
        if (trim) { add(mesh(geo.torus(0.06, PI * 2, 24), trim, 0.52 * w, 0.52 * w, 0.46 * w, 0, -0.62, 0, PI / 2, 0, 0)); add(mesh(geo.box(), trim, 0.07, 1.15, 0.02, 0, -0.04, 0.27 * w)); }
        if (b.belt !== false) { add(mesh(geo.torus(0.12, PI * 2, 22), belt, 0.31 * w, 0.31 * w, 0.27 * w, 0, 0.06, 0, PI / 2, 0, 0)); }
        add(mesh(geo.torus(0.25, PI * 2, 18), trim || cloth, 0.2, 0.2, 0.17, 0, 0.6, 0, PI / 2, 0, 0));
        return 'skirt';
      }
      case 'belly': {
        add(mesh(geo.sphere(18), cloth, 0.46 * w, 0.44, 0.42 * w, 0, 0.28, 0.04));
        add(mesh(geo.torso(), cloth, 0.95 * w, 0.95, 0.8 * w, 0, 0.05, 0));
        add(mesh(geo.torus(0.1, PI * 2, 26), belt, 0.44 * w, 0.44 * w, 0.42 * w, 0, 0.06, 0.02, PI / 2, 0, 0));
        add(mesh(geo.box(), mat('#c9a14a', { metal: true }), 0.14, 0.1, 0.04, 0, 0.06, 0.45 * w));
        if (trim) add(mesh(geo.box(), trim, 0.06, 0.6, 0.02, 0.06, 0.32, 0.46 * w, 0.15, 0, 0));
        return 'belly';
      }
      case 'bones': {
        const bone = mat(PAL.bone);
        add(mesh(geo.cyl(1, 1, 6), bone, 0.05, 0.62, 0.05, 0, 0.3, -0.05));
        for (let i = 0; i < 4; i++) add(mesh(geo.torus(0.09, PI * 1.4, 12), bone, 0.22 - i * 0.02, 0.22 - i * 0.02, 0.17, 0, 0.52 - i * 0.11, 0.02, PI / 2, 0, -PI * 0.7 + PI / 2));
        add(mesh(geo.sphere(10), bone, 0.22, 0.1, 0.16, 0, 0.02, 0));
        if (b.color) for (let i = 0; i < 5; i++) add(mesh(geo.box(), mat(b.color, { double: true }), 0.12, 0.3, 0.02, Math.cos(i * 1.3) * 0.18, -0.05 - (i % 2) * 0.08, 0.15 - (i % 3) * 0.12, 0.2, i, 0));
        return 'bones';
      }
      default: {
        const metalBody = b.type === 'armor';
        const tm = metalBody ? mat(col, { metal: true }) : cloth;
        add(mesh(geo.torso(), tm, w, 0.95, 0.8 * w, 0, 0, 0));
        if (metalBody) {
          add(mesh(geo.sphere(16), tm, 0.3 * w, 0.26, 0.2, 0, 0.42, 0.1));
          if (b.color2) { add(mesh(geo.box(), mat(b.color2), 0.26 * w, 0.62, 0.03, 0, 0.12, 0.26)); if (b.trim) { add(mesh(geo.box(), mat(b.trim, { metal: true }), 0.04, 0.5, 0.02, 0, 0.14, 0.28)); add(mesh(geo.box(), mat(b.trim, { metal: true }), 0.18, 0.04, 0.02, 0, 0.25, 0.28)); } }
          for (const s of [-1, 1]) {
            const p = grp(s * 0.33 * w, 0.58, 0);
            p.add(mesh(geo.hemi(), mat(b.pauldron || col, { metal: true }), 0.22, 0.18, 0.22, 0, 0, 0, 0, 0, s * 0.35));
            p.add(mesh(geo.torus(0.12, PI * 2, 18), mat('#7c8692', { metal: true }), 0.2, 0.2, 0.2, 0, 0, 0, PI / 2, 0, s * 0.35));
            for (let i = 0; i < 3; i++) p.add(mesh(geo.sphere(5), mat('#e0e6ee', { metal: true }), 0.025, 0.025, 0.025, s * 0.02 + Math.cos(i * 1.2 - 1.2) * 0.12, 0.1, Math.sin(i * 1.2 - 1.2) * 0.12));
            T.add(p);
          }
          add(mesh(geo.cyl(1, 1, 16), mat('#5a5f69', { metal: true }), 0.33 * w, 0.06, 0.26 * w, 0, 0.18, 0));
        }
        if (b.type === 'vest' || b.type === 'coat') {
          add(mesh(geo.box(), mat(b.color2 || shade(col, 0.25)), 0.16, 0.34, 0.02, 0, 0.42, 0.24));
          add(mesh(geo.box(), mat('#4a2e1c', { glossy: true }), 0.06, 0.78, 0.04, 0, 0.32, 0.18, 0, 0, 0.75)).position.z = 0.24;
          add(mesh(geo.box(), mat('#5a3a22'), 0.12, 0.1, 0.07, 0.2, 0.08, 0.2));
        }
        if (b.type === 'coat') {
          const tails = mesh(new THREE.CylinderGeometry(0.34, 0.46, 0.75, 14, 1, true, PI * 0.15, PI * 1.7), mat(col, { double: true }), w, 1, w, 0, -0.32, 0);
          tails.rotation.y = PI; add(tails); char.skirt = tails;
          for (const s of [-1, 1]) add(mesh(geo.box(), mat(b.color2 || '#d8d0c0'), 0.06, 0.4, 0.02, s * 0.1, 0.4, 0.25, 0, 0, s * 0.3));
        }
        if (b.type === 'rags') {
          add(mesh(geo.cyl(1, 1, 7, true), mat(col, { double: true, flat: true }), 0.36 * w, 0.2, 0.3 * w, 0, -0.04, 0));
          add(mesh(geo.box(), mat(shade(col, 0.18)), 0.12, 0.12, 0.02, -0.1, 0.4, 0.25));
          add(mesh(geo.box(), mat('#4a2e1c'), 0.05, 0.75, 0.04, 0, 0.3, 0.2, 0, 0, -0.7)).position.z = 0.25;
        }
        if (b.type === 'tunic') add(mesh(geo.cyl(1, 1.1, 16, true), mat(col, { double: true }), 0.34 * w, 0.18, 0.27 * w, 0, -0.04, 0));
        if (trim && !metalBody) add(mesh(geo.torus(0.22, PI * 2, 18), trim, 0.2, 0.2, 0.16, 0, 0.62, 0, PI / 2, 0, 0));
        if (b.belt !== false && b.type !== 'rags') { add(mesh(geo.cyl(1, 1, 16), belt, 0.33 * w, 0.08, 0.26 * w, 0, 0.06, 0)); add(mesh(geo.box(), mat('#c9a14a', { metal: true }), 0.1, 0.09, 0.03, 0, 0.06, 0.27 * w)); add(mesh(geo.box(), mat('#5a3a22'), 0.11, 0.12, 0.08, -0.24 * w, 0.0, 0.14)); }
        return metalBody ? 'armor' : 'tunic';
      }
    }
  }

  /* ---------------- the character ---------------- */
  function build(cfg) {
    const char = { cfg, mats: [], blinkT: Math.random() * 4, t: Math.random() * 10 };
    const root = grp();
    const body = grp(); root.add(body);
    char.root = root; char.body = body;
    const sc = cfg.scale || 1;
    root.scale.setScalar(sc);
    const skin = cfg.skin || SKINS[0];
    const bones = cfg.body && cfg.body.type === 'bones';
    const skinM = mat(bones ? PAL.bone : skin);
    const limbM = bones ? mat(PAL.bone) : mat(cfg.arms || (cfg.body && cfg.body.color) || '#5a4a6e');
    const legM = bones ? mat(PAL.bone) : mat(cfg.legs || '#3b3340');
    const bootM = bones ? mat(PAL.bone) : mat(cfg.boots || '#2e2220', { glossy: true });
    const handM = cfg.gauntlets ? mat('#b9c3d0', { metal: true }) : skinM;
    const R = cfg.headR || 0.5;
    const limbR = bones ? 0.05 : 0.125;

    root.add(char.shadow = K3.blobShadow(0.62 * (cfg.wide || 1)));
    if (cfg.rig === 'inkspawn' || cfg.rig === 'rat' || cfg.rig === 'wisp') return buildCreature(cfg, char);

    // legs
    const pelvis = grp(0, 0.62, 0); body.add(pelvis);
    char.legs = [];
    for (const s of [-1, 1]) {
      const p = grp(s * 0.15 * (cfg.wide || 1), 0, 0); pelvis.add(p);
      p.add(mesh(geo.capsule(limbR * 1.05, 0.5), legM));
      const boot = mesh(geo.sphere(12), bootM, bones ? 0.07 : 0.17, bones ? 0.06 : 0.13, bones ? 0.12 : 0.26, 0, -0.5, 0.07); p.add(boot);
      if (!bones) p.add(mesh(geo.sphere(12), mat('#1a120c'), 0.175, 0.04, 0.27, 0, -0.6, 0.07));
      if (!bones) p.add(mesh(geo.torus(0.25, PI * 2, 14), bootM, 0.13, 0.13, 0.13, 0, -0.36, 0, PI / 2, 0, 0));
      char.legs.push(p);
    }
    // torso
    const T = grp(0, 0.62, 0); body.add(T); char.torso = T;
    char.bodyKind = torsoMeshes(T, cfg, char);
    if (cfg.hunch) T.rotation.x = 0.35 * cfg.hunch;
    // arms
    char.arms = [];
    const shY = char.bodyKind === 'belly' ? 0.55 : 0.52;
    for (const s of [-1, 1]) {
      const sh = grp(s * 0.36 * (cfg.wide || 1), shY, 0); T.add(sh);
      const L = 0.46 * (cfg.armLen || 1);
      sh.add(mesh(geo.capsule(limbR, L), limbM));
      if (!bones && cfg.body && cfg.body.type !== 'armor') { sh.add(mesh(geo.torus(0.3, PI * 2, 12), limbM, 0.13, 0.13, 0.13, 0, -L + 0.14, 0, PI / 2, 0, 0)); sh.add(mesh(geo.sphere(10), limbM, 0.15, 0.15, 0.15, 0, -0.02, 0)); }
      if (cfg.gauntlets) sh.add(mesh(geo.cyl(1, 1.15, 10), mat('#9aa4b2', { metal: true }), 0.15, 0.18, 0.15, 0, -L + 0.16, 0));
      const hand = grp(0, -L, 0); sh.add(hand);
      hand.add(mesh(geo.sphere(12), handM, bones ? 0.07 : 0.15));
      if (!bones) hand.add(mesh(geo.sphere(8), handM, 0.06, 0.06, 0.06, s * -0.09, 0.02, 0.07));
      if (cfg.claws) for (let i = -1; i <= 1; i++) hand.add(mesh(geo.cone(4), mat('#e6dfcc'), 0.025, 0.16, 0.025, i * 0.05, -0.12, 0.06, 0.6, 0, 0));
      char.arms.push({ sh, hand, side: s });
    }
    char.armR = char.arms[1]; char.armL = char.arms[0];
    // weapon & offhand
    const twoHanded = cfg.weapon && (cfg.weapon.type === 'daggers');
    if (cfg.weapon) {
      const wpn = buildWeapon(cfg.weapon);
      const sock = grp(0, -0.02, 0.02); char.armR.hand.add(sock); sock.add(wpn);
      char.weapon = wpn; char.wSock = sock;
      if (cfg.weapon.type === 'daggers') { const w2 = buildWeapon(cfg.weapon); const s2 = grp(0, -0.02, 0.02); char.armL.hand.add(s2); s2.add(w2); char.wSock2 = s2; }
      if (wpn.userData.light) char.light = wpn.userData.light;
    }
    if (cfg.offhand && !twoHanded) {
      const off = buildOffhand(cfg.offhand);
      const sock = grp(0, -0.02, 0.05); char.armL.hand.add(sock); sock.add(off);
      char.off = off; char.oSock = sock;
      if (off.userData.light) char.light = off.userData.light;
    }
    // head
    const neckY = char.bodyKind === 'belly' ? 0.66 : 0.62;
    const H = grp(0, neckY + R * 0.82, 0); T.add(H); char.head = H;
    const faceOpen = new THREE.MeshPhongMaterial({ color: 0xffffff, map: K3.faceTex(cfg, false), shininess: 6, specular: new THREE.Color(0x141414) });
    const faceClosed = new THREE.MeshPhongMaterial({ color: 0xffffff, map: K3.faceTex(cfg, true), shininess: 6, specular: new THREE.Color(0x141414) });
    char.faceOpen = faceOpen; char.faceClosed = faceClosed;
    const headMesh = mesh(geo.sphere(24), faceOpen, R, R * 0.96, R, 0, 0, 0);
    H.add(headMesh); char.headMesh = headMesh;
    if (bones) H.add(mesh(geo.box(), mat(PAL.bone), R * 0.9, R * 0.3, R * 0.7, 0, -R * 0.75, R * 0.25));
    const hidesHair = hatMeshes(H, cfg, R, char);
    if (!hidesHair || (cfg.hair && cfg.hair.style === 'long')) hairMeshes(H, cfg, R);
    // ears
    if (cfg.ears === 'goblin') for (const s of [-1, 1]) { const e = mesh(geo.cone(6), skinM, R * 0.22, R * 0.95, R * 0.12, s * R * 1.25, R * 0.25, -R * 0.05, 0, 0, -s * 1.25); H.add(e); }
    else if (cfg.ears !== 'none' && !hidesHair && !bones && cfg.face !== 'skull') for (const s of [-1, 1]) H.add(mesh(geo.sphere(8), skinM, R * 0.12, R * 0.2, R * 0.12, s * R * 0.98, 0, 0));
    // nose & beard
    const f = cfg.face || 'hero';
    if (f === 'goblin' || cfg.nose === 'big') H.add(mesh(geo.sphere(10), mat(shade(skin, -0.08)), R * 0.16, R * 0.14, R * 0.34, 0, -R * 0.08, R * 1.02, -0.2, 0, 0));
    else if (cfg.nose === 'hook') H.add(mesh(geo.cone(8), skinM, R * 0.1, R * 0.4, R * 0.12, 0, -R * 0.12, R * 1.1, 1.9, 0, 0));
    else if (f !== 'skull' && f !== 'shadow' && f !== 'ghoul') H.add(mesh(geo.sphere(8), skinM, R * 0.08, R * 0.07, R * 0.07, 0, -R * 0.1, R * 0.99));
    if (cfg.beard) {
      const bm = mat(cfg.beard.color, { glossy: true });
      if (cfg.beard.style === 'full') { H.add(mesh(geo.sphere(14), bm, R * 0.72, R * 0.6, R * 0.5, 0, -R * 0.62, R * 0.55)); H.add(mesh(geo.cone(10), bm, R * 0.5, R * 0.6, R * 0.35, 0, -R * 1.15, R * 0.6, PI, 0, 0)); }
      if (cfg.beard.style === 'mustache' || cfg.beard.style === 'full') for (const s of [-1, 1]) H.add(mesh(geo.sphere(8), bm, R * 0.28, R * 0.09, R * 0.12, s * R * 0.22, -R * 0.3, R * 0.95, 0, s * 0.3, -s * 0.35));
      if (cfg.beard.style === 'stubble') H.add(mesh(geo.sphere(14), mat(cfg.beard.color, { opacity: 0.35 }), R * 0.86, R * 0.55, R * 0.82, 0, -R * 0.42, R * 0.2));
    }
    // glowing eyes
    const glowEyes = (cfg.eyes && cfg.eyes.glow) || f === 'skull' || f === 'ghoul' || f === 'shadow' || (f === 'goblin' && cfg.eyes && cfg.eyes.glow);
    if (glowEyes) {
      const gc = (cfg.eyes && cfg.eyes.color) || (f === 'goblin' ? '#ffcf3c' : '#9fe6ff');
      char.eyes = [];
      for (const s of [-1, 1]) {
        const pos = onHead(R, 90 + s * 21, 84.4, 1.02);
        const e = mesh(geo.sphere(8), glowMat(gc, 3), R * 0.07, R * 0.07, R * 0.05); e.position.copy(pos); H.add(e);
        const sp = K3.glowSprite3(gc, R * 0.7, 0.6); sp.position.copy(pos).multiplyScalar(1.05); H.add(sp);
        char.eyes.push(e);
      }
    }
    // cape
    if (cfg.cape) {
      const cg = new THREE.PlaneGeometry(0.72 * (cfg.wide || 1), 1.0, 2, 6);
      cg.translate(0, -0.5, 0);
      const cape = new THREE.Mesh(cg, mat(cfg.cape, { double: true }));
      cape.position.set(0, 0.6, -0.22); T.add(cape);
      char.cape = cape; char.capeBase = Float32Array.from(cg.attributes.position.array);
    }
    finalizeMats(char);
    return char;
  }

  /* ---------------- creatures ---------------- */
  function buildCreature(cfg, char) {
    const body = char.body;
    if (cfg.rig === 'inkspawn') {
      const big = cfg.big;
      const s = big ? 1.5 : 0.95;
      const blobM = mat(cfg.color || '#151a33', { glossy: true, shininess: 90 });
      const blob = mesh(geo.sphere(20), blobM, 0.6 * s, 0.48 * s, 0.55 * s, 0, 0.42 * s, 0); body.add(blob); char.blob = blob;
      for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2; body.add(mesh(geo.sphere(10), blobM, 0.22 * s, 0.14 * s, 0.22 * s, Math.cos(a) * 0.5 * s, 0.08 * s, Math.sin(a) * 0.45 * s)); }
      const n = big ? 5 : 3;
      char.eyes = [];
      for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 0.42; const e = mesh(geo.sphere(8), glowMat('#cfe0ff', 2.4), 0.07 * s, 0.07 * s, 0.05 * s, Math.sin(a) * 0.44 * s, (0.66 + (i % 2) * 0.08) * s, Math.cos(a) * 0.44 * s); body.add(e); char.eyes.push(e); }
      const maw = grp(0, 0.34 * s, 0.5 * s); body.add(maw); char.maw = maw;
      maw.add(mesh(geo.sphere(12), mat('#020306'), 0.3 * s, 0.08 * s, 0.1 * s));
      for (let i = 0; i < 7; i++) maw.add(mesh(geo.cone(4), mat('#ece6d6'), 0.03 * s, 0.09 * s, 0.03 * s, -0.24 * s + i * 0.08 * s, 0.04 * s, 0.04 * s, PI, 0, 0));
      char.shadow.scale.setScalar(0.75 * s);
    } else if (cfg.rig === 'rat') {
      const rm = mat(cfg.color || '#2a2638', { glossy: true });
      const b = mesh(geo.sphere(14), rm, 0.3, 0.22, 0.45, 0, 0.26, 0); body.add(b);
      const hd = grp(0, 0.3, 0.42); body.add(hd); char.head = hd;
      hd.add(mesh(geo.cone(10), rm, 0.17, 0.4, 0.17, 0, 0, 0.12, PI / 2, 0, 0));
      hd.add(mesh(geo.sphere(8), mat('#c96b7c'), 0.04, 0.04, 0.04, 0, 0, 0.33));
      for (const s of [-1, 1]) { hd.add(mesh(geo.sphere(8), rm, 0.09, 0.11, 0.03, s * 0.12, 0.12, -0.02)); const e = mesh(geo.sphere(6), glowMat('#ff4a3a', 3), 0.03, 0.03, 0.03, s * 0.08, 0.06, 0.14); hd.add(e); }
      const tail = grp(0, 0.24, -0.42); body.add(tail); char.tail = tail;
      for (let i = 0; i < 6; i++) tail.add(mesh(geo.sphere(6), mat('#4a3d48'), 0.035, 0.035, 0.08, 0, 0.02 * i, -0.1 * i));
      char.legs = [];
      for (const [x, z] of [[-0.18, 0.22], [0.18, 0.22], [-0.18, -0.2], [0.18, -0.2]]) { const l = grp(x, 0.18, z); l.add(mesh(geo.capsule(0.04, 0.18), rm)); body.add(l); char.legs.push(l); }
      char.shadow.scale.setScalar(0.45);
    } else if (cfg.rig === 'wisp') {
      const col = cfg.color || '#9fe6ff';
      const w = grp(0, 1.5, 0); body.add(w); char.blob = w;
      w.add(mesh(geo.sphere(16), glowMat(col, 1.6, { opacity: 0.75 }), 0.32, 0.38, 0.32));
      w.add(mesh(geo.cone(12), glowMat(col, 1.1, { opacity: 0.45 }), 0.28, 0.7, 0.28, 0, -0.45, 0, PI, 0, 0));
      for (const s of [-1, 1]) w.add(mesh(geo.sphere(8), mat('#06101a'), 0.06, 0.08, 0.04, s * 0.11, 0.06, 0.3));
      w.add(mesh(geo.sphere(8), mat('#06101a'), 0.05, 0.08, 0.04, 0, -0.1, 0.31));
      const sp = K3.glowSprite3(col, 2.4, 0.6); w.add(sp); sp.userData.pulse = true;
      char.light = col; char.shadow.scale.setScalar(0.35);
    }
    finalizeMats(char);
    return char;
  }

  /* each character owns its materials so it can flash, tint and fade on its own */
  function finalizeMats(char) {
    const seen = new Map();
    char.root.traverse((o) => {
      if (!o.material || o === char.shadow) return;
      if (o.isSprite) return;
      let m = seen.get(o.material);
      if (!m) { m = o.material.clone(); seen.set(o.material, m); char.mats.push(m); }
      o.material = m;
    });
    if (char.headMesh) { char.faceOpen = char.headMesh.material; char.faceClosed = char.faceClosed.clone(); char.mats.push(char.faceClosed); }
    for (const m of char.mats) { m.userData.baseEmissive = m.emissive ? m.emissive.clone() : null; m.userData.baseOpacity = m.opacity; m.userData.baseTransparent = m.transparent; }
  }

  /* ---------------- animation ---------------- */
  /* arm/leg angle a: 0 = hanging down, + swings forward, PI = straight up */
  function pose(cfg, st, t, p, hitAt) {
    const A = { bob: 0, lean: 0, crouch: 0, aR: 0.25, aL: -0.15, sR: 0, sL: 0, lR: 0, lL: 0, head: 0, twist: 0, glow: 0, spin: 0, wpn: 0 };
    const shieldy = cfg.offhand && ['shield', 'kite', 'tome', 'lantern'].includes(cfg.offhand.type) && !(cfg.weapon && cfg.weapon.type === 'daggers');
    if (shieldy) A.aL = 0.75;
    const wt = cfg.weapon && cfg.weapon.type;
    const idleW = Math.sin(t * 2.4 + (cfg.blinkSeed || 0));
    const H = hitAt || 0.5;
    switch (st) {
      case 'idle': case 'talk':
        A.bob = idleW * 0.012; A.aR = 0.28 + idleW * 0.05; A.aL += -idleW * 0.04; A.head = idleW * 0.03;
        if (wt === 'staff' || wt === 'totem') A.aR = 0.5;
        if (wt === 'crossbow') A.aR = 0.9;
        if (st === 'talk') { A.aR = 0.8 + Math.sin(t * 6) * 0.35; A.head = Math.sin(t * 5) * 0.06; }
        break;
      case 'walk': case 'run': case 'hop': {
        const run = st === 'run', ph = t * (run ? 11 : 8);
        A.lR = Math.sin(ph) * (run ? 0.85 : 0.6); A.lL = -A.lR;
        A.bob = Math.abs(Math.sin(ph)) * (run ? 0.07 : 0.045);
        A.aR = 0.3 - Math.sin(ph) * (run ? 0.6 : 0.45); if (!shieldy) A.aL = -0.1 + Math.sin(ph) * (run ? 0.6 : 0.45);
        A.lean = run ? 0.18 : 0.06; A.twist = Math.sin(ph) * 0.08;
        break;
      }
      case 'attack': {
        if (p < H * 0.7) { const k = easeOut(p / (H * 0.7)); A.aR = lerp(0.3, 3.5, k); A.lean = -0.12 * k; A.twist = -0.45 * k; A.crouch = 0.04 * k; }
        else if (p < H * 1.15) { const k = (p - H * 0.7) / (H * 0.45); const e = k * k * (3 - 2 * k); A.aR = lerp(3.5, 0.95, e); A.lean = lerp(-0.12, 0.2, e); A.twist = lerp(-0.45, 0.35, e); A.crouch = lerp(0.04, 0.08, e); }
        else { const k = (p - H * 1.15) / Math.max(0.01, 1 - H * 1.15); A.aR = lerp(0.95, 0.3, easeOut(k)); A.lean = lerp(0.2, 0, k); A.twist = lerp(0.35, 0, k); A.crouch = lerp(0.08, 0, k); }
        A.lR = 0.35; A.lL = -0.3; if (!shieldy) A.aL = -0.5;
        break;
      }
      case 'slam': { const k = Math.min(1, p * 1.4); A.aR = lerp(0.3, 3.3, easeOut(k)); A.aL = lerp(A.aL, 3.1, easeOut(k)); A.lean = -0.18 * k; A.crouch = 0.05 * k; break; }
      case 'thrust': {
        if (p < H) { const k = easeOut(p / H); A.aR = lerp(0.6, 0.9, k); A.sR = -0.3 * k; A.lean = -0.08 * k; A.twist = -0.3 * k; }
        else if (p < H + 0.15) { const k = (p - H) / 0.15; A.aR = lerp(0.9, 1.65, k); A.lean = lerp(-0.08, 0.25, k); A.twist = lerp(-0.3, 0.4, k); }
        else { const k = clamp((p - H - 0.15) / (0.85 - H), 0, 1); A.aR = lerp(1.65, 0.4, easeOut(k)); A.lean = lerp(0.25, 0, k); A.twist = lerp(0.4, 0, k); }
        A.lR = 0.45; A.lL = -0.35; if (wt === 'daggers') A.aL = A.aR * 0.8;
        break;
      }
      case 'cast': case 'channel': {
        const k = st === 'channel' ? 1 : (p < 0.35 ? easeOut(p / 0.35) : p > 0.78 ? 1 - easeOut((p - 0.78) / 0.22) : 1);
        A.aR = lerp(0.4, 2.4, k); A.lean = -0.08 * k; A.glow = k;
        if (st === 'channel' || !shieldy) A.aL = lerp(A.aL, 1.9, k);
        if (st === 'channel') { A.bob = Math.sin(t * 20) * 0.008; }
        break;
      }
      case 'shoot': {
        const k = p < 0.25 ? easeOut(p / 0.25) : 1;
        if (wt === 'bow' || (cfg.offhand && cfg.offhand.type === 'bow')) { A.aL = lerp(0.5, 1.57, k); A.aR = lerp(0.5, 1.45, k); A.sR = -0.5 * k; A.twist = -0.5 * k; }
        else { A.aR = lerp(0.9, 1.55, k); A.aL = lerp(0.6, 1.45, k); }
        if (p > 0.48 && p < 0.62) A.lean = -0.12;
        break;
      }
      case 'throw': {
        if (p < 0.45) { const k = easeOut(p / 0.45); A.aR = lerp(0.3, 3.6, k); A.lean = -0.14 * k; A.twist = -0.5 * k; }
        else if (p < 0.6) { const k = (p - 0.45) / 0.15; A.aR = lerp(3.6, 1.3, k); A.lean = lerp(-0.14, 0.18, k); A.twist = lerp(-0.5, 0.4, k); }
        else A.aR = lerp(1.3, 0.3, clamp((p - 0.6) / 0.4, 0, 1));
        break;
      }
      case 'spin': A.aR = 1.57; A.aL = 1.57; A.sR = 1.2; A.sL = -1.2; A.crouch = 0.06; A.spin = t * 16; break;
      case 'roar': { const k = Math.min(1, p * 4); A.aR = lerp(0.3, 2.8, k); A.aL = lerp(A.aL, 2.8, k); A.sR = 0.6 * k; A.sL = -0.6 * k; A.lean = -0.25 * k; A.bob = Math.sin(t * 40) * 0.01 * k; break; }
      case 'hurt': A.lean = -0.3 * (1 - p); A.aR = -0.5; A.aL = -0.6; A.head = -0.2 * (1 - p); break;
      case 'stun': A.lean = Math.sin(t * 7) * 0.1; A.aR = 0.1; A.aL = 0.1; A.head = Math.sin(t * 7) * 0.15; A.twist = Math.sin(t * 3.5) * 0.3; break;
      case 'kneel': A.crouch = 0.28; A.lR = 1.4; A.lL = -0.2; A.aR = 0.2; A.head = 0.25; A.lean = 0.12; break;
      case 'point': A.aR = 1.6 + Math.sin(t * 3) * 0.05; A.bob = idleW * 0.012; break;
      case 'cheer': A.aR = 2.9 + Math.sin(t * 9) * 0.15; A.aL = 2.8 - Math.sin(t * 9) * 0.15; A.sR = 0.3; A.sL = -0.3; A.bob = Math.abs(Math.sin(t * 9)) * 0.08; break;
      case 'sit': A.crouch = 0.42; A.lR = 1.5; A.lL = 1.45; A.aR = 0.5; A.aL = 0.45; A.bob = idleW * 0.008; break;
      case 'cower': A.crouch = 0.16; A.aR = 2.5; A.aL = 2.4; A.lean = -0.15; A.head = 0.2; A.bob = Math.sin(t * 30) * 0.006; break;
      case 'dead': A.aR = -0.4; A.aL = -0.9; break;
      default: break;
    }
    return A;
  }

  const _v = new THREE.Vector3();
  /* drive a built character from battle/illustration state */
  function animate(char, o, dt) {
    const cfg = char.cfg;
    char.t += dt;
    const t = o.t != null ? o.t : char.t;
    const root = char.root;
    root.position.set(o.x, o.h || 0, o.z);
    // smooth turning
    if (o.yaw != null) {
      let d = o.yaw - root.rotation.y; while (d > PI) d -= PI * 2; while (d < -PI) d += PI * 2;
      root.rotation.y += d * Math.min(1, dt * 14);
    }
    const sc = (cfg.scale || 1) * (o.scale || 1);
    root.scale.setScalar(sc);
    // tint / flash / fade
    const flash = o.flash || 0, tintC = o.tint, tintA = o.tintA || 0, alpha = o.alpha == null ? 1 : o.alpha;
    if (flash > 0.01 || tintA > 0.01 || char._tinted) {
      for (const m of char.mats) {
        if (!m.emissive) continue;
        if (flash > 0.01) m.emissive.setRGB(flash * 0.9, flash * 0.85, flash * 0.8);
        else if (tintA > 0.01) m.emissive.set(tintC).multiplyScalar(tintA * 0.6);
        else if (m.userData.baseEmissive) m.emissive.copy(m.userData.baseEmissive);
      }
      char._tinted = flash > 0.01 || tintA > 0.01;
    }
    if (alpha < 0.999 || char._faded) {
      for (const m of char.mats) { m.transparent = alpha < 0.999 || m.userData.baseTransparent; m.opacity = (m.userData.baseOpacity || 1) * alpha; }
      char._faded = alpha < 0.999;
      char.shadow.material.opacity = alpha;
    }
    if (o.dead != null && o.dead > 0) {
      const k = easeOut(Math.min(1, o.dead));
      char.body.rotation.x = -k * 1.45; char.body.position.y = 0;
      if (cfg.rig === 'inkspawn') { char.body.rotation.x = 0; char.body.scale.set(1 + k * 0.7, 1 - k * 0.85, 1 + k * 0.7); }
      return;
    } else if (char.body.scale.x !== 1 && cfg.rig === 'inkspawn' && !o.hop) char.body.scale.set(1, 1, 1);

    if (cfg.rig === 'inkspawn') return animInkspawn(char, o, t, dt);
    if (cfg.rig === 'rat') return animRat(char, o, t);
    if (cfg.rig === 'wisp') { char.blob.position.y = 1.5 + Math.sin(t * 2.3) * 0.15; char.blob.rotation.y = Math.sin(t) * 0.3; return; }

    const A = pose(cfg, o.state || 'idle', t, o.p || 0, o.hitAt);
    const B = char.body;
    B.position.y = A.bob - A.crouch;
    B.rotation.x = A.lean + (o.lean || 0);
    B.rotation.y = A.twist + A.spin;
    char.armR.sh.rotation.set(-A.aR, 0, -A.sR * 0.6);
    char.armL.sh.rotation.set(-A.aL, 0, -A.sL * 0.6);
    if (char.legs) { char.legs[1].rotation.x = -A.lR; char.legs[0].rotation.x = -A.lL; }
    char.head.rotation.x = A.head + (cfg.hunch ? -0.25 : 0);
    // weapon grip relative to the arm
    if (char.wSock) {
      const wt = cfg.weapon.type;
      let gx = 1.35;
      if (wt === 'staff' || wt === 'broom' || wt === 'totem' || wt === 'shovel' || wt === 'scythe') gx = A.aR * 0.55 + 0.05 + (wt === 'shovel' ? 0 : 0);
      else if (wt === 'spear') gx = 1.57;
      else if (wt === 'crossbow') gx = A.aR > 1.2 ? 1.57 : 1.3;
      else if (wt === 'bow') gx = 0.2;
      else if (wt === 'sling') gx = o.state === 'attack' ? t * 20 : 0;
      else if (wt === 'candle' || wt === 'cards' || wt === 'mirror' || wt === 'lute') gx = 1.2;
      else if (wt === 'daggers' || wt === 'knife') gx = 1.5;
      char.wSock.rotation.set(gx, 0, 0);
      if (char.wSock2) char.wSock2.rotation.set(1.5, 0, 0);
    }
    if (char.oSock) { const ot = cfg.offhand.type; char.oSock.rotation.set(ot === 'lantern' ? A.aL : ot === 'bow' ? 0.0 : 0.85, ot === 'bow' ? PI / 2 : 0, 0); if (char.off.userData.lantern) char.off.userData.lantern.rotation.x = Math.sin(t * 2.5) * 0.15 - A.aL + (ot === 'lantern' ? 0 : 0); }
    // glow on staff orbs
    if (char.weapon && char.weapon.userData.staff) char.weapon.traverse((m) => { if (m.userData.pulse) { const s = 0.8 + A.glow * 0.9 + Math.sin(t * 4) * 0.08; m.scale.set(s, s, 1); } });
    // blink
    char.blinkT -= dt;
    if (char.headMesh) {
      if (char.blinkT < 0) { char.headMesh.material = char.faceClosed; if (char.blinkT < -0.12) { char.blinkT = 2 + Math.random() * 3.5; } }
      else if (char.headMesh.material !== char.faceOpen) char.headMesh.material = char.faceOpen;
      if (o.state === 'hurt' || o.state === 'stun') char.headMesh.material = char.faceClosed;
    }
    // cape physics-ish sway
    if (char.cape) {
      const pos = char.cape.geometry.attributes.position, base = char.capeBase;
      const sp = clamp((o.speed || 0) / 200, 0, 1.4);
      for (let i = 0; i < pos.count; i++) {
        const by = base[i * 3 + 1], k = -by;
        pos.array[i * 3 + 2] = base[i * 3 + 2] - k * k * (0.35 + sp * 0.9) - Math.sin(t * 3 + k * 4 + base[i * 3] * 3) * 0.05 * k;
        pos.array[i * 3 + 1] = by + k * k * sp * 0.25;
      }
      pos.needsUpdate = true;
      char.cape.rotation.x = A.lean * -0.5;
    }
    if (char.plume) char.plume.rotation.x = Math.sin(t * 3) * 0.08 - clamp((o.speed || 0) / 400, 0, 0.5);
    if (char.skirt && char.bodyKind !== 'belly') char.skirt.rotation.x = -A.lean * 0.4 + Math.sin(t * 2) * 0.02;
    if (char.drape) char.drape.rotation.x = -A.head * 0.8;
    // weapon tip for trails
    if (o.wantTip && char.weapon) { char.weapon.updateWorldMatrix(true, false); _v.copy(char.weapon.userData.tip).applyMatrix4(char.weapon.matrixWorld); char.tip = _v.clone(); }
    else char.tip = null;
    // flames on candles flicker
    if (char.weapon && char.weapon.userData.light) char.weapon.traverse((m) => { if (m.userData.flicker) m.scale.y = 0.32 * (1 + Math.sin(t * 17) * 0.12 + Math.sin(t * 29) * 0.08); });
  }

  function animInkspawn(char, o, t, dt) {
    const hop = o.hop || 0, air = Math.sin(hop * PI);
    const atk = o.state === 'attack' ? Math.sin((o.p || 0) * PI) : 0;
    const sq = hop > 0 ? (air > 0.2 ? 0.86 : 1.14) : 1 + Math.sin(t * 3.4) * 0.05;
    char.body.position.y = air * (char.cfg.big ? 0.5 : 0.75);
    char.body.scale.set(1 / Math.sqrt(sq) + atk * 0.12, sq + atk * 0.2, 1 / Math.sqrt(sq) + atk * 0.12);
    char.blob.rotation.y = Math.sin(t * 2) * 0.1;
    if (char.maw) char.maw.scale.y = 1 + atk * 3 + Math.sin(t * 2) * 0.2;
    char.shadow.scale.setScalar((char.cfg.big ? 1.1 : 0.72) * (1 - air * 0.35));
  }
  function animRat(char, o, t) {
    const run = o.state === 'walk' || o.state === 'run';
    char.body.position.y = run ? Math.abs(Math.sin(t * 22)) * 0.05 : 0;
    if (char.legs) char.legs.forEach((l, i) => { l.rotation.x = run ? Math.sin(t * 22 + i * 1.6) * 0.7 : 0; });
    if (char.tail) char.tail.rotation.y = Math.sin(t * 8) * 0.5;
    if (char.head) char.head.rotation.x = o.state === 'attack' ? -Math.sin((o.p || 0) * PI) * 0.5 : Math.sin(t * 5) * 0.05;
  }

  function dispose(char) { /* geometries/materials are cached or per-char clones; let GC handle clones */ if (char.root.parent) char.root.parent.remove(char.root); }

  return { build, animate, pose, dispose, buildWeapon };
})();
