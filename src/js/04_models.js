/* ==========================================================================
   3D characters - Battleheart-style cel-shaded puppets
   Each bone's shapes are merged into one vertex-coloured mesh, drawn with a
   stepped toon ramp + rim light, and an inverted-hull ink outline.
   Characters face +Z. 1 unit = 40 logic px. A hero stands ~2.4 units tall.
   ========================================================================== */
const M3 = (() => {
  if (!HAS3D) return {};
  const PI = Math.PI;

  /* ---------------- geometry (non-indexed, cached) ---------------- */
  const NI = new Map();
  const ni = (key, make) => { let g = NI.get(key); if (!g) { g = make(); if (g.index) g = g.toNonIndexed(); NI.set(key, g); } return g; };
  function roundedBox(w, h, d, r, seg) {
    const s = seg || 2;
    const g = new THREE.BoxGeometry(w, h, d, s * 2, s * 2, s * 2);
    const p = g.attributes.position, n = g.attributes.normal;
    const ix = Math.max(0, w / 2 - r), iy = Math.max(0, h / 2 - r), iz = Math.max(0, d / 2 - r);
    const v = new THREE.Vector3(), c = new THREE.Vector3(), dir = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      c.set(clamp(v.x, -ix, ix), clamp(v.y, -iy, iy), clamp(v.z, -iz, iz));
      dir.subVectors(v, c); if (dir.lengthSq() < 1e-12) dir.set(0, 1, 0);
      dir.normalize();
      p.setXYZ(i, c.x + dir.x * r, c.y + dir.y * r, c.z + dir.z * r);
      n.setXYZ(i, dir.x, dir.y, dir.z);
    }
    return g;
  }
  /* lathe with increasing-y points faces outward; optional bend & seam fix */
  function lathe(pts, seg, bendAmt) {
    const S = seg || 16;
    const g = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), S);
    if (bendAmt) {
      const p = g.attributes.position;
      let H = 0; for (const q of pts) H = Math.max(H, q[1]);
      for (let i = 0; i < p.count; i++) { const t = clamp(p.getY(i) / H, 0, 1); p.setZ(i, p.getZ(i) - bendAmt * Math.pow(t, 2.3) * H); p.setY(i, p.getY(i) - bendAmt * 0.32 * Math.pow(t, 3) * H); }
      g.computeVertexNormals();
      const n = g.attributes.normal, P = pts.length, v = new THREE.Vector3();
      for (let j = 0; j < P; j++) { const a = j, b = S * P + j; v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize(); n.setXYZ(a, v.x, v.y, v.z); n.setXYZ(b, v.x, v.y, v.z); }
    }
    return g;
  }
  const G = {
    sphere: (s) => ni('sp' + (s || 16), () => new THREE.SphereGeometry(1, s || 16, Math.round((s || 16) * 0.7))),
    hemi: (s) => ni('hemi' + (s || 18), () => new THREE.SphereGeometry(1, s || 18, 9, 0, PI * 2, 0, PI / 2)),
    rbox: (w, h, d, r) => ni(`rb${w}|${h}|${d}|${r}`, () => roundedBox(w, h, d, Math.min(r, w / 2, h / 2, d / 2), 2)),
    cyl: (rt, rb, s, open) => ni(`cy${rt}|${rb}|${s}|${open}`, () => new THREE.CylinderGeometry(rt, rb, 1, s || 14, 1, !!open)),
    cone: (s) => ni('co' + (s || 10), () => new THREE.ConeGeometry(1, 1, s || 10)),
    torus: (tube, arc, s) => ni(`to${tube}|${arc}|${s}`, () => new THREE.TorusGeometry(1, tube, 8, s || 22, arc || PI * 2)),
    /* capsule hanging down from the origin, length L */
    capsule: (r, L) => ni(`ca${r}|${L}`, () => { const pts = []; for (let i = 0; i <= 5; i++) { const t = (i / 5) * PI / 2; pts.push([Math.sin(t) * r, -L + r - Math.cos(t) * r]); } for (let i = 0; i <= 5; i++) { const t = (i / 5) * PI / 2; pts.push([Math.cos(t) * r, -r + Math.sin(t) * r]); } return lathe(pts, 12); }),
    /* capsule centred on the origin, lying along X */
    pill: (r, L) => ni(`pi${r}|${L}`, () => { const pts = []; for (let i = 0; i <= 4; i++) { const t = (i / 4) * PI / 2; pts.push([Math.sin(t) * r, -L / 2 - Math.cos(t) * r + r]); } for (let i = 0; i <= 4; i++) { const t = (i / 4) * PI / 2; pts.push([Math.cos(t) * r, L / 2 - r + Math.sin(t) * r]); } const g = lathe(pts, 10); g.rotateZ(PI / 2); return g; }),
    torso: () => ni('torso', () => lathe([[0, 0], [0.27, 0], [0.305, 0.07], [0.315, 0.22], [0.34, 0.38], [0.335, 0.5], [0.275, 0.59], [0.14, 0.635], [0, 0.645]], 20)),
    skirt: (fl) => ni('sk' + fl, () => { const g = lathe([[0, -0.69], [0.47 + fl * 0.5, -0.69], [0.5 + fl * 0.5, -0.63], [0.4 + fl * 0.3, -0.38], [0.33, -0.1], [0.3, 0.02], [0, 0.02]], 24); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < -0.5 && Math.hypot(p.getX(i), p.getZ(i)) > 0.2) { const a = Math.atan2(p.getZ(i), p.getX(i)); p.setY(i, y + Math.sin(a * 7) * 0.03); } } g.computeVertexNormals(); return g; }),
    belly: () => ni('belly', () => lathe([[0, 0], [0.3, 0.01], [0.42, 0.12], [0.47, 0.3], [0.43, 0.48], [0.33, 0.6], [0.16, 0.66], [0, 0.67]], 22)),
    /* hat cone that flops backwards: base radius 1 at y 0, tip at ~y 1 */
    bentCone: (b) => ni('bc' + b, () => { const pts = [[0, 0]]; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([Math.max(0.012, Math.pow(1 - t, 1.15) * (1 + Math.sin(t * PI) * 0.08)), t]); } return lathe(pts, 18, b); }),
    blade: (w, L) => ni(`bl${w}|${L}`, () => { const g = roundedBox(w, L, w * 0.22, w * 0.1, 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) / L + 0.5; const k = y > 0.8 ? 1 - (y - 0.8) / 0.2 * 0.94 : 1; p.setX(i, p.getX(i) * k); } g.translate(0, L / 2, 0); return g; }),
    /* thick-walled open tube (sleeves, mantles, skirts), height 1 centred on 0 */
    tube: (rt, rb, th, seg, ps, pl) => ni(`tu${rt}|${rb}|${th}|${seg}|${ps}|${pl}`, () => { const t = th || 0.08, P = [[rt - t, 0.5], [rb - t, -0.5], [rb - t, -0.5], [rb, -0.5], [rb, -0.5], [rt, 0.5], [rt, 0.5], [rt - t, 0.5]]; return new THREE.LatheGeometry(P.map(([x, y]) => new THREE.Vector2(x, y)), seg || 18, ps || 0, pl || PI * 2); }),
    octa: () => ni('octa', () => new THREE.OctahedronGeometry(1, 0)),
    ico: (d) => ni('ico' + (d || 0), () => new THREE.IcosahedronGeometry(1, d || 0)),
    shell: (start, len, thLen, inner) => ni(`sh${start}|${len}|${thLen}|${inner}`, () => { const g = new THREE.SphereGeometry(1, 22, 14, PI * start, PI * len, 0, PI * thLen); if (inner) { g.scale(-1, 1, 1); g.computeVertexNormals(); } return g; }),
    shape: (key, build, depth, bevel) => ni('shp' + key, () => { const s = new THREE.Shape(); build(s); const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 10 }); g.translate(0, 0, -depth / 2); return g; }),
  };

  /* ---------------- merge buffers ---------------- */
  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _c = new THREE.Color(), _m3 = new THREE.Matrix3();
  class Part {
    constructor() { this.P = []; this.N = []; this.C = []; this.W = []; }
    add(geo, color, m, grad, k, ow) {
      const p = geo.attributes.position, n = geo.attributes.normal;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const e = m.elements, bb = geo.boundingBox;
      const md = Math.min((bb.max.x - bb.min.x) * Math.hypot(e[0], e[1], e[2]), (bb.max.y - bb.min.y) * Math.hypot(e[4], e[5], e[6]), (bb.max.z - bb.min.z) * Math.hypot(e[8], e[9], e[10]));
      const w = ow != null ? ow : clamp((md - 0.025) / 0.2, 0.12, 1);
      _m3.getNormalMatrix(m);
      _c.set(color).convertSRGBToLinear();
      if (k) _c.multiplyScalar(k);
      let y0 = Infinity, y1 = -Infinity;
      if (grad) for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const span = y1 - y0 || 1;
      for (let i = 0; i < p.count; i++) {
        _v.fromBufferAttribute(p, i).applyMatrix4(m); this.P.push(_v.x, _v.y, _v.z);
        _n.fromBufferAttribute(n, i).applyMatrix3(_m3).normalize(); this.N.push(_n.x, _n.y, _n.z);
        const f = grad ? lerp(grad[0], grad[1], (p.getY(i) - y0) / span) : 1;
        this.C.push(_c.r * f, _c.g * f, _c.b * f);
        this.W.push(w);
      }
    }
    geometry() {
      if (!this.P.length) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(this.N, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(this.C, 3));
      g.setAttribute('ow', new THREE.Float32BufferAttribute(this.W, 1));
      g.computeBoundingSphere();
      return g;
    }
  }
  const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  const TRS = (x, y, z, rx, ry, rz, sx, sy, sz) => {
    const ux = sx == null ? 1 : sx;
    return new THREE.Matrix4().compose(_p.set(x || 0, y || 0, z || 0), _q.setFromEuler(_e.set(rx || 0, ry || 0, rz || 0)), _s.set(ux, sy == null ? ux : sy, sz == null ? ux : sz));
  };
  /* a bone being modelled: toon (outlined), decal (lit, no outline), glow (unlit, blooms) */
  function Bone(name) { return { name, toon: new Part(), decal: new Part(), glow: new Part() }; }
  function F(bone, m) {
    return {
      bone, m: m || new THREE.Matrix4(),
      at(x, y, z, rx, ry, rz, s) { return F(bone, this.m.clone().multiply(TRS(x, y, z, rx, ry, rz, s))); },
      put(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, o) {
        o = o || {};
        const part = o.glow ? bone.glow : o.decal ? bone.decal : bone.toon;
        part.add(geo, col, this.m.clone().multiply(TRS(x, y, z, rx, ry, rz, sx, sy, sz)), o.glow || o.grad === false ? null : (o.grad || [0.72, 1.06]), o.glow ? (o.k || 2.6) : o.k, o.ow);
        return this;
      },
      flat(geo, col, x, y, z, rx, ry, rz, sx, sy, sz) { return this.put(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, { grad: false }); },
      metal(geo, col, x, y, z, rx, ry, rz, sx, sy, sz) { return this.put(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, { grad: [0.5, 1.28] }); },
      glow(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, k) { return this.put(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, { glow: true, k }); },
      decal(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, k) { return this.put(geo, col, x, y, z, rx, ry, rz, sx, sy, sz, { decal: true, grad: false, k }); },
      shine(x, y, z, sx, sy, rot, rx, ry) { return this.put(G.sphere(8), '#ffffff', x, y, z, rx || 0, ry || 0, rot || 0, sx, sy, Math.min(sx, sy) * 0.3, { glow: true, k: 0.62 }); },
      /* place a piece on a face point from faceSurf() */
      face(e, geo, col, rz, sx, sy, sz, o) { return this.put(geo, col, e.p[0], e.p[1], e.p[2], e.r[0], e.r[1], rz || 0, sx, sy, sz, Object.assign({ decal: true, grad: false }, o || {})); },
    };
  }

  /* ---------------- materials ---------------- */
  const RAMP = (() => { const t = new THREE.DataTexture(new Uint8Array([92, 92, 92, 255, 150, 150, 150, 255, 218, 218, 218, 255, 255, 255, 255, 255]), 4, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; })();
  function toonMat(o) {
    const m = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: RAMP, side: (o && o.side) || THREE.FrontSide });
    m.userData.rim = { value: new THREE.Color(0x9fb4ff) };
    m.userData.rimK = { value: 0.6 };
    m.onBeforeCompile = function (sh) {
      sh.uniforms.rimColor = this.userData.rim; sh.uniforms.rimStrength = this.userData.rimK;
      sh.fragmentShader = 'uniform vec3 rimColor;\nuniform float rimStrength;\n' + sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        'float rimF = 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) );\n\trimF = smoothstep( 0.52, 0.78, rimF );\n\toutgoingLight += rimColor * rimF * rimStrength * ( 0.25 + diffuseColor.rgb * 0.9 );\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );');
    };
    return m;
  }
  const OUTLINE = { k: { value: 0.0021 }, color: { value: new THREE.Color('#120a05') } };
  function outlineMat() {
    return new THREE.ShaderMaterial({
      uniforms: { k: OUTLINE.k, color: OUTLINE.color, opacity: { value: 1 } },
      vertexShader: 'uniform float k;\nattribute float ow;\nvoid main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix * normal); n.z *= 0.35; mv.xyz += normalize(n) * k * ow * max(6.0, -mv.z); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 color; uniform float opacity;\nvoid main(){ gl_FragColor = vec4(color, opacity); }',
      side: THREE.BackSide,
    });
  }
  const glowMatV = () => new THREE.MeshBasicMaterial({ vertexColors: true });

  /* surface of the head (sphere + chubby cheeks) for placing face features */
  function faceSurf(R, bones) {
    const E = [{ c: [0, 0, 0], a: [R, R * 0.93, R * 0.97] }];
    if (!bones) E.push({ c: [0, -R * 0.3, R * 0.14], a: [R * 0.84, R * 0.62, R * 0.8] });
    return (x, y, lift) => {
      let best = -1e9, n = [0, 0, 1];
      for (const e of E) {
        const dx = (x - e.c[0]) / e.a[0], dy = (y - e.c[1]) / e.a[1], q = 1 - dx * dx - dy * dy;
        if (q <= 0) continue;
        const z = e.c[2] + e.a[2] * Math.sqrt(q);
        if (z > best) { best = z; const nx = (x - e.c[0]) / (e.a[0] * e.a[0]), ny = (y - e.c[1]) / (e.a[1] * e.a[1]), nz = (z - e.c[2]) / (e.a[2] * e.a[2]); const L = Math.hypot(nx, ny, nz); n = [nx / L, ny / L, nz / L]; }
      }
      if (best < -1e8) best = 0;
      const l = lift || 0, a = Math.asin(clamp(n[0], -1, 1)), b = Math.asin(clamp(-n[1] / Math.cos(a), -1, 1));
      return { p: [x + n[0] * l, y + n[1] * l, best + n[2] * l], r: [b, a, 0], n };
    };
  }

  /* ================= heads ================= */
  function buildHead(f, cfg, R, char) {
    const face = cfg.face || 'hero';
    const bones = (cfg.body && cfg.body.type === 'bones') || face === 'skull';
    const sk = bones ? PAL.bone : (cfg.skin || SKINS[0]);
    const fs = faceSurf(R, bones);
    f.put(G.sphere(26), sk, 0, 0, 0, 0, 0, 0, R, R * 0.93, R * 0.97, { grad: [0.78, 1.05] });
    if (!bones) f.put(G.sphere(20), sk, 0, -R * 0.3, R * 0.14, 0, 0, 0, R * 0.84, R * 0.62, R * 0.8, { grad: [0.8, 1.04] });
    const eyes = Bone('eyes'), ef = F(eyes);
    const ec = (cfg.eyes && cfg.eyes.color) || null;
    const isGlow = (cfg.eyes && cfg.eyes.glow) || face === 'skull' || face === 'ghoul' || face === 'shadow';
    const eyeY = -R * 0.08, eyeX = R * 0.37;
    char.eyeY = eyeY;
    const glowAt = [];
    if (face === 'skull') {
      f.put(G.rbox(R * 1.12, R * 0.46, R * 0.98, R * 0.18), PAL.bone, 0, -R * 0.66, R * 0.1, 0.05, 0, 0);
      for (const s of [-1, 1]) { const e = fs(s * R * 0.4, eyeY, 0); f.face(e, G.sphere(14), '#140d0a', s * 0.2, R * 0.27, R * 0.3, R * 0.16); glowAt.push(fs(s * R * 0.4, eyeY, R * 0.05)); }
      f.face(fs(0, -R * 0.3, 0), G.cone(3), '#140d0a', PI, R * 0.1, R * 0.17, R * 0.08);
      for (let i = 0; i < 6; i++) f.flat(G.rbox(0.06, 0.12, 0.05, 0.015), '#efe8d4', -R * 0.4 + i * R * 0.16, -R * 0.66, R * 0.6);
      f.decal(G.rbox(R * 1.0, 0.02, 0.05, 0.01), '#140d0a', 0, -R * 0.66, R * 0.6);
      f.decal(G.pill(0.012, R * 0.4), '#8a8270', R * 0.3, R * 0.5, R * 0.75, 0.4, 0.3, 0.9);
    } else if (face === 'ghoul') {
      for (const s of [-1, 1]) { const e = fs(s * R * 0.38, eyeY, 0); f.face(e, G.sphere(14), '#140d0a', s * -0.3, R * 0.25, R * 0.2, R * 0.14); glowAt.push(fs(s * R * 0.38, eyeY, R * 0.04)); }
      f.face(fs(0, -R * 0.48, 0), G.sphere(14), '#1a0c08', 0, R * 0.36, R * 0.12, R * 0.1);
      for (let i = 0; i < 7; i++) { const e = fs(-R * 0.3 + i * R * 0.1, -R * 0.4 - (i % 2) * R * 0.04, R * 0.02); f.face(e, G.cone(4), '#ece4cf', PI, R * 0.045, R * 0.16, R * 0.04, { grad: false, decal: false }); }
      for (const s of [-1, 1]) f.face(fs(s * R * 0.55, R * 0.25, 0), G.pill(0.02, R * 0.3), shade(sk, -0.3), s * 0.5, 1, 1, 1);
    } else if (face === 'shadow') {
      f.face(fs(0, -R * 0.12, 0), G.sphere(18), '#050306', 0, R * 0.8, R * 0.72, R * 0.3);
      for (const s of [-1, 1]) glowAt.push(fs(s * R * 0.3, -R * 0.05, R * 0.06));
    } else if (face === 'goblin') {
      for (const s of [-1, 1]) {
        const e = fs(s * R * 0.42, eyeY + R * 0.02, 0);
        ef.face(e, G.sphere(16), '#f6d850', s * -0.3, R * 0.25, R * 0.19, R * 0.1);
        ef.face(fs(s * R * 0.42, eyeY + R * 0.02, R * 0.06), G.sphere(10), '#120a06', 0, R * 0.055, R * 0.16, R * 0.05);
        ef.face(fs(s * R * 0.4, eyeY + R * 0.18, R * 0.02), G.pill(0.04, R * 0.42), shade(sk, -0.35), s * 0.45, 1, 1, 1, { decal: false });
      }
      // wide toothy grin
      f.face(fs(0, -R * 0.44, 0), G.torus(0.3, PI * 0.82, 18), '#1f0c08', PI * 1.09, R * 0.46, R * 0.26, R * 0.12);
      f.face(fs(0, -R * 0.5, 0), G.sphere(14), '#1f0c08', 0, R * 0.4, R * 0.12, R * 0.09);
      for (const s of [-1, 1]) f.face(fs(s * R * 0.22, -R * 0.5, R * 0.04), G.cone(5), '#f6eedc', PI, R * 0.075, R * 0.22, R * 0.06, { decal: false, grad: false });
      for (const s of [-1, 1]) f.face(fs(s * R * 0.08, -R * 0.42, R * 0.03), G.rbox(1, 1, 1, 0.2), '#f6eedc', 0, R * 0.1, R * 0.1, R * 0.06, { decal: false, grad: false });
    } else {
      // human style: big glossy chibi eyes
      const tall = face === 'stern' ? 0.17 : face === 'sad' ? 0.2 : face === 'old' ? 0.08 : 0.24;
      const wid = face === 'child' ? 0.2 : 0.17;
      for (const s of [-1, 1]) {
        const e = fs(s * eyeX, eyeY, 0);
        if (face === 'old') { ef.face(e, G.torus(0.28, PI * 0.85, 12), '#1c120c', PI * 1.08 + s * 0.06, R * 0.14, R * 0.09, R * 0.06); continue; }
        if (face === 'masked') { ef.face(fs(s * eyeX, eyeY, R * 0.18), G.sphere(14), '#f4ecd8', s * -0.25, R * 0.13, R * 0.075, R * 0.05); continue; }
        ef.face(e, G.sphere(18), '#140b06', 0, R * wid, R * tall, R * 0.11);
        if (ec && !isGlow) ef.face(fs(s * eyeX, eyeY - R * tall * 0.18, R * 0.06), G.sphere(14), ec, 0, R * wid * 0.66, R * tall * 0.6, R * 0.06);
        ef.face(fs(s * eyeX - s * R * wid * 0.25, eyeY + R * tall * 0.38, R * 0.1), G.sphere(10), '#ffffff', 0, R * 0.065, R * 0.075, R * 0.03, { glow: true, k: 1.05 });
        ef.face(fs(s * eyeX + s * R * wid * 0.32, eyeY - R * tall * 0.4, R * 0.1), G.sphere(8), '#ffffff', 0, R * 0.03, R * 0.03, R * 0.02, { glow: true, k: 0.9 });
      }
      if (face === 'masked') f.put(G.rbox(R * 2.04, R * 0.42, R * 1.2, R * 0.2), '#1e181c', 0, eyeY, R * 0.2, 0, 0, 0);
      // brows
      const hairC = cfg.hair && cfg.hair.style !== 'bald' ? cfg.hair.color : (cfg.beard ? cfg.beard.color : '#3a2418');
      const browC = shade(hairC, -0.22);
      const br = cfg.brows || (face === 'stern' ? 'stern' : face === 'sad' ? 'sad' : face === 'old' ? 'bushy' : 'soft');
      for (const s of [-1, 1]) {
        const ang = br === 'angry' ? 0.5 : br === 'stern' ? 0.3 : br === 'sad' ? -0.38 : br === 'bushy' ? -0.15 : 0.06;
        const th = br === 'bushy' ? 0.075 : br === 'soft' ? 0.042 : 0.052;
        f.face(fs(s * R * 0.36, R * 0.27 - (br === 'angry' ? R * 0.03 : 0), R * 0.03), G.pill(th, R * 0.42), browC, s * ang, 1, 1, 1, { decal: false, grad: false });
      }
      // mouth
      const mo = cfg.mouth || (face === 'stern' ? 'flat' : face === 'sad' ? 'frown' : face === 'old' ? 'flat' : 'smile');
      const me = fs(0, -R * 0.45, R * 0.01);
      if (mo === 'smile') f.face(fs(0, -R * 0.4, 0.004), G.torus(0.26, PI * 0.72, 16), '#4a1812', PI * 1.14, R * 0.15, R * 0.11, R * 0.08);
      else if (mo === 'frown') f.face(fs(0, -R * 0.52, 0.004), G.torus(0.26, PI * 0.62, 16), '#4a1812', PI * 0.19, R * 0.14, R * 0.09, R * 0.08);
      else if (mo === 'smirk') f.face(me, G.pill(0.016, R * 0.22), '#4a1812', 0.28, 1, 1, 1);
      else if (mo === 'grin') { f.face(fs(0, -R * 0.44, 0), G.sphere(14), '#3a1410', 0, R * 0.22, R * 0.1, R * 0.06); f.face(fs(0, -R * 0.41, R * 0.03), G.rbox(1, 1, 1, 0.2), '#f6eedc', 0, R * 0.32, R * 0.05, R * 0.04); }
      else f.face(me, G.pill(0.014, R * 0.18), '#4a1812', 0, 1, 1, 1);
      if (face === 'hero' || face === 'kind' || face === 'child') for (const s of [-1, 1]) f.face(fs(s * R * 0.6, -R * 0.28, 0), G.sphere(12), '#e8806a', 0, R * 0.15, R * 0.08, R * 0.05, { k: 0.95 });
      if (cfg.scar) f.face(fs(R * 0.42, R * 0.06, R * 0.01), G.pill(0.018, R * 0.42), '#9a3a2e', 1.15, 1, 1, 1);
      if (cfg.warpaint) for (const s of [-1, 1]) f.face(fs(s * R * 0.42, eyeY, R * 0.005), G.rbox(1, 1, 1, 0.3), cfg.warpaint, 0, R * 0.5, R * 0.14, R * 0.02);
      if (cfg.wrinkles) for (const s of [-1, 1]) f.face(fs(s * R * 0.62, eyeY - R * 0.02, R * 0.005), G.pill(0.012, R * 0.12), shade(sk, -0.25), s * 0.5 + PI / 2, 1, 1, 1);
    }
    if (isGlow) {
      char.glowEyes = true;
      const gc = (cfg.eyes && cfg.eyes.color) || (face === 'goblin' ? '#ffd23a' : '#9fe6ff');
      const pts = glowAt.length ? glowAt : [-1, 1].map((s) => fs(s * eyeX, eyeY, R * 0.08));
      for (const e of pts) { ef.face(e, G.sphere(12), gc, 0, R * 0.085, R * 0.085, R * 0.05, { glow: true, k: 3.4 }); }
    }
    // nose & ears
    if (face === 'goblin' || cfg.nose === 'big') f.face(fs(0, -R * 0.18, -R * 0.05), G.sphere(16), shade(sk, -0.05), 0, R * 0.19, R * 0.16, R * 0.36, { decal: false, grad: [0.85, 1.05] });
    else if (cfg.nose === 'hook') f.face(fs(0, -R * 0.08, R * 0.05), G.cone(10), sk, 0, R * 0.12, R * 0.44, R * 0.12, { decal: false });
    else if (!bones && face !== 'shadow' && face !== 'ghoul' && face !== 'masked') f.face(fs(0, -R * 0.2, -R * 0.02), G.sphere(10), shade(sk, -0.05), 0, R * 0.075, R * 0.065, R * 0.07, { decal: false });
    if (cfg.ears === 'goblin') for (const s of [-1, 1]) { f.put(G.cone(10), sk, s * R * 1.3, R * 0.1, -R * 0.12, -0.18, s * 0.3, -s * 1.32, R * 0.3, R * 1.15, R * 0.12); f.decal(G.cone(8), shade(sk, -0.3), s * R * 1.32, R * 0.11, -R * 0.06, -0.18, s * 0.3, -s * 1.32, R * 0.18, R * 0.9, R * 0.05); }
    else if (cfg.ears === 'elf') for (const s of [-1, 1]) f.put(G.cone(8), sk, s * R * 1.08, R * 0.12, -R * 0.05, -0.3, 0, -s * 0.9, R * 0.15, R * 0.6, R * 0.08);
    else if (cfg.ears !== 'none' && !bones && face !== 'shadow') for (const s of [-1, 1]) f.put(G.sphere(10), sk, s * R * 0.97, -R * 0.1, -R * 0.02, 0, 0, 0, R * 0.14, R * 0.22, R * 0.13);
    // beard
    if (cfg.beard) {
      const bc = cfg.beard.color, bs = cfg.beard.style, dk = shade(bc, -0.14);
      if (bs === 'full' || bs === 'braid' || bs === 'long') {
        f.put(G.sphere(18), bc, 0, -R * 0.58, R * 0.42, 0, 0, 0, R * 0.86, R * 0.62, R * 0.6);
        for (const s of [-1, 1]) f.put(G.sphere(12), dk, s * R * 0.62, -R * 0.36, R * 0.38, 0, 0, s * 0.3, R * 0.26, R * 0.5, R * 0.32);
        if (bs === 'braid') for (let i = 0; i < 4; i++) f.put(G.sphere(10), i % 2 ? dk : bc, 0, -R * (1.05 + i * 0.26), R * (0.72 - i * 0.04), 0, 0, 0, R * (0.2 - i * 0.02), R * 0.2, R * (0.2 - i * 0.02));
        else f.put(G.cone(12), bc, 0, -R * (bs === 'long' ? 1.35 : 1.12), R * 0.56, PI - 0.22, 0, 0, R * 0.55, R * (bs === 'long' ? 1.1 : 0.62), R * 0.36);
      }
      if (bs === 'mustache' || bs === 'full' || bs === 'braid' || bs === 'long') for (const s of [-1, 1]) f.face(fs(s * R * 0.2, -R * 0.33, R * 0.06), G.pill(0.07, R * 0.42), bc, s * -0.35, 1, 1, 1, { decal: false, grad: false });
      if (bs === 'stubble') f.put(G.sphere(18), shade(sk, -0.16), 0, -R * 0.34, R * 0.18, 0, 0, 0, R * 0.86, R * 0.6, R * 0.82, { decal: true, grad: false });
      if (bs === 'goatee') f.face(fs(0, -R * 0.62, 0), G.cone(8), bc, PI, R * 0.17, R * 0.36, R * 0.14, { decal: false });
    }
    return eyes;
  }

  /* ================= hair ================= */
  function buildHair(f, cfg, R, mode) {
    const h = cfg.hair; if (!h || h.style === 'bald') return;
    const c = h.color, dk = shade(c, -0.16), lt = shade(c, 0.12);
    const capOK = mode !== 'cap';
    const cap = () => { if (capOK) f.put(G.hemi(22), c, 0, R * 0.03, -R * 0.04, -0.14, 0, 0, R * 1.09, R * 1.07, R * 1.09); f.put(G.sphere(16), c, 0, -R * 0.12, -R * 0.36, 0, 0, 0, R * 0.99, R * 0.82, R * 0.73); };
    const bangs = (n) => { const k = capOK ? 1 : 0.8, yb = capOK ? 0.62 : 0.4; for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : i / (n - 1) - 0.5; f.put(G.sphere(12), i % 2 ? dk : c, t * R * 1.25, R * (yb - Math.abs(t) * 0.3), R * (0.74 - Math.abs(t) * 0.25), -0.6, 0, t * 0.6, R * 0.25 * k, R * 0.36 * k, R * 0.2); } };
    const sides = () => { for (const s of [-1, 1]) f.put(G.sphere(12), c, s * R * 0.86, -R * 0.14, R * 0.08, 0, 0, s * 0.15, R * 0.26, R * 0.56, R * 0.42); };
    switch (h.style) {
      case 'spiky': {
        cap();
        if (capOK) {
          const spikes = [[0, 1.0, -0.15, -0.45, 0, 0], [0.45, 0.9, -0.25, -0.6, 0, -0.65], [-0.45, 0.9, -0.25, -0.6, 0, 0.65], [0.22, 0.68, -0.72, -1.15, 0, -0.35], [-0.22, 0.68, -0.72, -1.15, 0, 0.35], [0.68, 0.45, -0.4, -0.45, 0, -1.15], [-0.68, 0.45, -0.4, -0.45, 0, 1.15], [0, 0.4, -0.95, -1.7, 0, 0]];
          for (const [x, y, z, rx, ry, rz] of spikes) f.put(G.cone(8), c, x * R, y * R, z * R, rx, ry, rz, R * 0.34, R * 0.9, R * 0.34);
        }
        for (const [x, rz] of [[-0.42, 0.55], [0, -0.05], [0.4, -0.55]]) f.put(G.cone(7), x === 0 ? dk : c, x * R, R * 0.6, R * 0.74, 1.3, 0, rz, R * 0.26, R * 0.6, R * 0.2);
        sides();
        break;
      }
      case 'mop': case 'long': case 'pony': case 'braid': case 'bun': {
        cap(); bangs(5); sides();
        if (h.style === 'long') { f.put(G.rbox(R * 1.8, R * 1.6, R * 0.62, R * 0.3), c, 0, -R * 0.68, -R * 0.6, 0.12, 0, 0); for (const s of [-1, 1]) f.put(G.sphere(12), dk, s * R * 0.84, -R * 0.82, -R * 0.15, 0, 0, s * 0.1, R * 0.27, R * 0.68, R * 0.32); }
        if (h.style === 'pony') { f.put(G.torus(0.32, PI * 2, 12), '#7a1f1b', 0, R * 0.5, -R * 0.92, 0.5, 0, 0, R * 0.15, R * 0.15, R * 0.15); for (let i = 0; i < 4; i++) f.put(G.sphere(12), i % 2 ? dk : c, 0, R * (0.3 - i * 0.34), -R * (1.1 + i * 0.1), 0, 0, 0, R * (0.3 - i * 0.04), R * 0.4, R * (0.3 - i * 0.04)); }
        if (h.style === 'braid') for (let i = 0; i < 6; i++) f.put(G.sphere(10), i % 2 ? dk : c, 0, -R * (0.25 + i * 0.3), -R * (0.95 - i * 0.02), 0, 0, 0, R * 0.21, R * 0.22, R * 0.21);
        if (h.style === 'bun') f.put(G.sphere(14), c, 0, R * 0.64, -R * 0.78, 0, 0, 0, R * 0.44, R * 0.42, R * 0.44);
        break;
      }
      case 'topknot': {
        f.put(G.sphere(14), c, 0, R * 1.05, -R * 0.1, 0, 0, 0, R * 0.3, R * 0.3, R * 0.3);
        f.put(G.torus(0.3, PI * 2, 12), '#a3241c', 0, R * 0.86, -R * 0.08, PI / 2, 0, 0, R * 0.16, R * 0.16, R * 0.16);
        f.put(G.hemi(), shade(cfg.skin || SKINS[0], -0.08), 0, R * 0.05, 0, 0, 0, 0, R * 1.005, R * 0.94, R * 0.98, { decal: true, grad: false });
        break;
      }
      case 'mohawk': {
        for (let i = 0; i < 6; i++) { const a = -0.3 + i * 0.42; f.put(G.cone(8), i % 2 ? dk : c, 0, Math.cos(a) * R * 1.0, Math.sin(-a) * R * 1.0, -a, 0, 0, R * 0.16, R * 0.7, R * 0.3); }
        break;
      }
      case 'wild': {
        const r = mulberry32(5);
        for (let i = 0; i < 18; i++) { const a = r() * PI * 2, el = r() * 1.1; if (!capOK && el > 0.5) continue; f.put(G.sphere(10), i % 3 ? c : (i % 2 ? dk : lt), Math.cos(a) * R * 0.86 * Math.cos(el * 0.5), R * 0.25 + Math.sin(el) * R * 0.72, Math.sin(a) * R * 0.78 - R * 0.3, 0, 0, 0, R * (0.36 + r() * 0.18), R * (0.32 + r() * 0.18), R * (0.36 + r() * 0.18)); }
        break;
      }
      default: break;
    }
  }

  /* ================= hats - return 'hide' (covers hair), 'cap' (hides top of hair) or '' ================= */
  function buildHat(f, cfg, R, char) {
    const hat = cfg.hat; if (!hat) return '';
    const c = hat.color, c2 = hat.color2;
    const rivets = (rad, y, n, col) => { for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2; f.metal(G.sphere(6), col || '#eef2f8', Math.cos(a) * rad, y, Math.sin(a) * rad, 0, 0, 0, R * 0.055, R * 0.055, R * 0.055); } };
    switch (hat.type) {
      case 'helm': case 'winged': {
        const st = c || '#b9c3cf', dk = c2 || shade(st, -0.28);
        f.metal(G.hemi(24), st, 0, R * 0.14, -R * 0.02, 0, 0, 0, R * 1.16, R * 1.16, R * 1.18);
        f.metal(G.tube(1, 1, 0.05, 24), st, 0, R * 0.02, -R * 0.06, 0, 0, 0, R * 1.16, R * 0.26, R * 1.17);
        f.metal(G.torus(0.1, PI * 2, 30), dk, 0, R * 0.17, -R * 0.02, PI / 2, 0, 0, R * 1.16, R * 1.18, R * 1.16);
        f.metal(G.rbox(R * 0.24, R * 0.34, R * 2.15, R * 0.11), dk, 0, R * 1.18, -R * 0.12, 0.25, 0, 0);
        f.metal(G.rbox(R * 0.2, R * 0.66, R * 0.16, R * 0.07), dk, 0, -R * 0.12, R * 1.1, -0.06, 0, 0);
        for (const s of [-1, 1]) { f.metal(G.rbox(R * 0.2, R * 0.85, R * 0.72, R * 0.1), st, s * R * 1.0, -R * 0.32, R * 0.12, 0.14, 0, s * 0.12); f.metal(G.sphere(8), '#eef2f8', s * R * 1.1, -R * 0.15, R * 0.28, 0, 0, 0, R * 0.06, R * 0.06, R * 0.06); }
        rivets(R * 1.18, R * 0.17, 12);
        f.shine(-R * 0.4, R * 0.95, R * 0.6, R * 0.32, R * 0.14, 0.5, -0.7, -0.4);
        if (hat.type === 'winged') {
          const wc = hat.wing || '#f0ead8';
          for (const s of [-1, 1]) for (let i = 0; i < 4; i++) f.put(G.sphere(12), i % 2 ? shade(wc, -0.1) : wc, s * R * (1.25 + i * 0.12), R * (0.45 + i * 0.32), -R * (0.15 + i * 0.12), -0.3, s * 0.2, -s * (0.55 + i * 0.1), R * 0.16, R * (0.65 - i * 0.08), R * 0.09);
          f.metal(G.octa(), '#e8c060', 0, R * 0.5, R * 1.2, 0, 0, 0, R * 0.14, R * 0.2, R * 0.08);
          f.glow(G.octa(), '#fff2b0', 0, R * 0.5, R * 1.26, 0, 0, 0, R * 0.07, R * 0.1, R * 0.04, 2.2);
        }
        if (hat.plume) char.plumeColor = hat.plume;
        return 'hide';
      }
      case 'greathelm': {
        const st = c || '#b9c3cf';
        f.metal(G.cyl(1, 1.04, 24), st, 0, -R * 0.08, 0, 0, 0, 0, R * 1.14, R * 1.75, R * 1.12);
        f.metal(G.hemi(24), st, 0, R * 0.79, 0, 0, 0, 0, R * 1.14, R * 0.48, R * 1.12);
        f.decal(G.rbox(R * 1.34, R * 0.16, R * 0.2, R * 0.06), '#0a0604', 0, R * 0.12, R * 1.04);
        f.decal(G.rbox(R * 0.16, R * 0.62, R * 0.2, R * 0.06), '#0a0604', 0, -R * 0.12, R * 1.04);
        f.metal(G.torus(0.08, PI * 2, 28), c2 || '#c9a14a', 0, R * 0.62, 0, PI / 2, 0, 0, R * 1.16, R * 1.16, R * 1.14);
        f.metal(G.torus(0.08, PI * 2, 28), c2 || '#c9a14a', 0, -R * 0.9, 0, PI / 2, 0, 0, R * 1.18, R * 1.18, R * 1.16);
        f.shine(-R * 0.4, R * 0.5, R * 0.95, R * 0.24, R * 0.45, 0, 0, -0.4);
        if (hat.plume) char.plumeColor = hat.plume;
        return 'hide';
      }
      case 'horned': {
        f.metal(G.hemi(24), c || '#7a7e86', 0, R * 0.08, 0, 0, 0, 0, R * 1.16, R * 1.15, R * 1.16);
        f.metal(G.torus(0.11, PI * 2, 28), '#5a4632', 0, R * 0.12, 0, PI / 2, 0, 0, R * 1.16, R * 1.16, R * 1.16);
        rivets(R * 1.17, R * 0.12, 10, '#b8a67a');
        for (const s of [-1, 1]) {
          const hf = f.at(s * R * 1.0, R * 0.55, 0, 0, 0, -s * 0.5);
          for (let i = 0; i < 5; i++) { const t = i / 4; hf.put(G.sphere(12), i === 4 ? '#f6eedb' : lerp(0, 1, t) > 0.5 ? '#e6d8b4' : '#d4c094', s * R * (0.2 + t * 0.7), R * (t * t * 1.0), 0, 0, 0, -s * (0.4 - t * 1.2), R * (0.3 - t * 0.2), R * (0.36 - t * 0.2), R * (0.3 - t * 0.2)); }
          hf.put(G.cone(8), '#f6eedb', s * R * 0.98, R * 1.12, 0, 0, 0, s * 0.25, R * 0.1, R * 0.38, R * 0.1);
        }
        f.metal(G.rbox(R * 0.2, R * 0.62, R * 0.15, R * 0.07), '#5a4632', 0, -R * 0.12, R * 1.1, -0.06, 0, 0);
        f.shine(-R * 0.35, R * 0.85, R * 0.65, R * 0.25, R * 0.12, 0.4, -0.7, -0.4);
        return 'hide';
      }
      case 'wizard': case 'witch': {
        const hc = c || '#2c2a5a', wide = hat.type === 'witch' ? 2.05 : 1.7;
        f.put(G.cyl(1, 1, 32), hc, 0, R * 0.46, 0, 0.1, 0, 0.05, R * wide, R * 0.07, R * wide, { grad: [0.85, 1] });
        f.put(G.torus(0.06, PI * 2, 32), shade(hc, -0.2), 0, R * 0.44, 0, PI / 2 + 0.1, 0, 0.05, R * wide, R * wide, R * wide);
        const cn = f.at(0, R * 0.48, 0, 0.05, 0, 0.08);
        cn.put(G.bentCone(0.75), hc, 0, 0, 0, 0, 0, 0, R * 0.98, R * 2.5, R * 0.98, { grad: [0.85, 1.12] });
        cn.metal(G.cyl(1, 0.98, 24), c2 || '#c9a14a', 0, R * 0.12, 0, 0, 0, 0, R * 0.92, R * 0.22, R * 0.92);
        if (hat.type === 'wizard') { cn.glow(G.octa(), c2 === '#c9a14a' || !c2 ? '#ffd56a' : c2, 0, R * 0.13, R * 0.95, 0, 0, 0, R * 0.13, R * 0.17, R * 0.07, 2.6); for (let i = 0; i < 4; i++) cn.glow(G.octa(), '#ffe9a8', Math.cos(i * 1.9) * R * 0.5, R * (0.6 + i * 0.32), Math.sin(i * 1.9) * R * 0.45 - R * i * 0.12 + R * 0.15, 0, i, 0, R * 0.05, R * 0.07, R * 0.05, 1.6); }
        else { cn.metal(G.rbox(R * 0.3, R * 0.26, R * 0.08, R * 0.04), '#c9b060', 0, R * 0.12, R * 0.95); cn.put(G.sphere(10), '#5a2a6a', 0, R * 0.4, R * 0.7, 0, 0, 0, R * 0.12, R * 0.12, R * 0.12); }
        return 'cap';
      }
      case 'hood': case 'cowl': {
        const hc = c || '#2e3b2e', deep = hat.type === 'cowl';
        f.put(G.shell(0.96, 1.08, 0.84), hc, 0, R * 0.08, -R * 0.06, 0, 0, 0, R * 1.2, R * 1.22, R * 1.22);
        f.put(G.shell(0.96, 1.08, 0.84, true), shade(hc, -0.45), 0, R * 0.08, -R * 0.06, 0, 0, 0, R * 1.17, R * 1.19, R * 1.19, { decal: true, grad: false });
        f.put(G.torus(0.13, PI * 1.25, 22), shade(hc, 0.1), 0, R * 0.06, R * 0.18, 0.12, 0, -PI * 0.125, R * 1.08, R * 1.14, R * 1.0);
        f.put(G.bentCone(1.1), hc, 0, R * 0.6, -R * 0.82, -1.0, 0, 0, R * 0.55, R * 0.95, R * 0.4);
        f.put(G.tube(0.55, 1, 0.06, 22), hc, 0, -R * 1.12, -R * 0.08, 0, 0, 0, R * 1.32, R * 0.46, R * 1.16);
        if (deep) f.decal(G.sphere(18), '#050306', 0, -R * 0.08, R * 0.6, 0, 0, 0, R * 0.88, R * 0.88, R * 0.44, 1);
        if (cfg.mask) { f.put(G.sphere(18), cfg.mask, 0, -R * 0.42, R * 0.38, 0, 0, 0, R * 0.97, R * 0.52, R * 0.7); f.put(G.cone(6), cfg.mask, 0, -R * 0.78, R * 0.8, 2.4, 0, 0, R * 0.22, R * 0.35, R * 0.1); }
        return 'hide';
      }
      case 'veil': {
        const vc = c || '#262a3a';
        f.put(G.shell(0.96, 1.08, 0.86), vc, 0, R * 0.05, -R * 0.08, 0, 0, 0, R * 1.15, R * 1.2, R * 1.17);
        f.put(G.torus(0.14, PI * 1.32, 22), c2 || '#f1ead8', 0, R * 0.03, R * 0.12, 0.08, 0, -PI * 0.16, R * 1.04, R * 1.1, R * 0.99);
        f.metal(G.torus(0.07, PI * 1.2, 22), '#c9a14a', 0, R * 0.44, R * 0.18, 0.55, 0, -PI * 0.1, R * 1.02, R * 1.0, R * 0.92);
        f.put(G.tube(0.62, 1, 0.06, 22), vc, 0, -R * 1.05, -R * 0.3, 0.12, 0, 0, R * 1.22, R * 1.1, R * 1.0);
        return 'hide';
      }
      case 'mitre': {
        const mc = c || '#f0ead8', gc = c2 || '#c9a14a';
        f.put(G.cyl(1, 1, 24), mc, 0, R * 0.55, 0, 0.08, 0, 0, R * 0.96, R * 0.34, R * 0.94);
        for (const s of [-1, 1]) f.put(G.cone(4), mc, 0, R * 1.3, s * R * 0.06, 0.08, PI / 4, 0, R * 0.95, R * 1.4, R * 0.95, { grad: [0.85, 1.08] });
        f.metal(G.rbox(R * 0.2, R * 1.2, R * 0.05, R * 0.03), gc, 0, R * 1.1, R * 0.62, -0.32, 0, 0);
        f.metal(G.rbox(R * 0.9, R * 0.18, R * 0.05, R * 0.03), gc, 0, R * 1.2, R * 0.55, -0.32, 0, 0);
        f.metal(G.torus(0.12, PI * 2, 24), gc, 0, R * 0.42, 0, PI / 2 + 0.08, 0, 0, R * 0.97, R * 0.97, R * 0.97);
        return 'cap';
      }
      case 'circlet': {
        f.metal(G.torus(0.08, PI * 2, 30), c || '#d4ad55', 0, R * 0.36, 0, PI / 2 + 0.2, 0, 0, R * 1.05, R * 1.05, R * 1.05);
        f.metal(G.octa(), c || '#d4ad55', 0, R * 0.56, R * 1.0, 0, 0, 0, R * 0.17, R * 0.24, R * 0.1);
        f.glow(G.octa(), c2 || '#7fd1ff', 0, R * 0.56, R * 1.04, 0, 0, 0, R * 0.1, R * 0.15, R * 0.07, 2.6);
        if (hat.wings) for (const s of [-1, 1]) for (let i = 0; i < 3; i++) f.put(G.sphere(10), i % 2 ? '#d8e6f0' : '#f4f8fc', s * R * (1.05 + i * 0.1), R * (0.42 + i * 0.25), -R * (0.05 + i * 0.12), -0.2, 0, -s * (0.75 + i * 0.12), R * 0.1, R * (0.42 - i * 0.06), R * 0.06);
        return '';
      }
      case 'cap': {
        f.put(G.hemi(), c || '#6b4527', 0, R * 0.14, 0, 0, 0, 0, R * 1.1, R * 0.92, R * 1.1);
        f.put(G.rbox(R * 1.3, R * 0.08, R * 0.7, R * 0.04), c || '#6b4527', 0, R * 0.2, R * 0.9, 0.15, 0, 0);
        return 'cap';
      }
      case 'pot': {
        f.metal(G.cyl(0.92, 1, 20), c || '#50545e', 0, R * 0.52, 0, 0.14, 0, 0.12, R * 1.14, R * 0.72, R * 1.14);
        f.metal(G.torus(0.14, PI * 2, 24), c2 || '#3a3d45', 0, R * 0.17, 0, PI / 2 + 0.14, 0, 0.12, R * 1.16, R * 1.16, R * 1.16);
        f.metal(G.rbox(R * 0.8, R * 0.15, R * 0.2, R * 0.07), '#3a3d45', R * 1.4, R * 0.66, 0, 0, 0, 0.12);
        f.decal(G.sphere(8), '#6a3a1e', -R * 0.6, R * 0.6, R * 0.82, 0, 0, 0, R * 0.14, R * 0.1, R * 0.04);
        f.shine(-R * 0.3, R * 0.75, R * 0.88, R * 0.12, R * 0.22, 0.3);
        return 'hide';
      }
      case 'crown': {
        const cr = f.at(0, R * 0.82, 0, 0, 0, 0.2);
        const gc = c || '#d4ad48';
        cr.metal(G.tube(1, 0.94, 0.08, 20), gc, 0, 0, 0, 0, 0, 0, R * 0.8, R * 0.36, R * 0.8);
        cr.metal(G.torus(0.12, PI * 2, 22), shade(gc, -0.12), 0, -R * 0.16, 0, PI / 2, 0, 0, R * 0.78, R * 0.78, R * 0.78);
        for (let i = 0; i < 7; i++) { const a = (i / 7) * PI * 2; cr.metal(G.cone(4), gc, Math.cos(a) * R * 0.76, R * (0.3 + (i % 2) * 0.1), Math.sin(a) * R * 0.76, 0, -a, 0, R * 0.17, R * (0.4 + (i % 2) * 0.22), R * 0.17); cr.metal(G.sphere(6), gc, Math.cos(a) * R * 0.76, R * (0.55 + (i % 2) * 0.22), Math.sin(a) * R * 0.76, 0, 0, 0, R * 0.06, R * 0.06, R * 0.06); }
        cr.glow(G.octa(), '#ff3a2a', 0, 0, R * 0.82, 0, 0, 0, R * 0.13, R * 0.13, R * 0.08, 2.2);
        cr.glow(G.octa(), '#3b9bff', R * 0.58, 0, R * 0.58, 0, PI / 4, 0, R * 0.09, R * 0.09, R * 0.06, 2.2);
        cr.glow(G.octa(), '#4ad86a', -R * 0.58, 0, R * 0.58, 0, -PI / 4, 0, R * 0.09, R * 0.09, R * 0.06, 2.2);
        return '';
      }
      case 'brim': {
        f.put(G.cyl(1, 1, 32), c || '#1f1b1b', 0, R * 0.5, 0, 0.1, 0, 0, R * 2.0, R * 0.07, R * 2.0, { grad: [0.85, 1] });
        f.put(G.torus(0.05, PI * 2, 32), shade(c || '#1f1b1b', -0.2), 0, R * 0.48, 0, PI / 2 + 0.1, 0, 0, R * 2.0, R * 2.0, R * 2.0);
        f.put(G.cyl(0.84, 1, 24), c || '#1f1b1b', 0, R * 0.95, -R * 0.05, 0.1, 0, 0, R * 0.92, R * 0.84, R * 0.92);
        f.put(G.cyl(1, 1, 24), c2 || '#7a1f1b', 0, R * 0.66, -R * 0.02, 0.1, 0, 0, R * 0.94, R * 0.18, R * 0.94);
        f.metal(G.rbox(R * 0.3, R * 0.26, R * 0.08, R * 0.04), '#d4ad48', 0, R * 0.72, R * 0.9, 0.1, 0, 0);
        return 'cap';
      }
      case 'tophat': {
        f.put(G.cyl(1, 1, 28), c || '#262028', 0, R * 0.64, 0, 0, 0, 0, R * 1.4, R * 0.07, R * 1.4);
        f.put(G.cyl(1, 0.9, 24), c || '#262028', 0, R * 1.3, 0, -0.05, 0, 0, R * 0.84, R * 1.28, R * 0.84);
        f.put(G.cyl(1, 1, 24), c2 || '#7a1f1b', 0, R * 0.8, 0, -0.05, 0, 0, R * 0.86, R * 0.2, R * 0.86);
        f.shine(-R * 0.45, R * 1.45, R * 0.66, R * 0.1, R * 0.5, 0, 0, -0.5);
        return 'cap';
      }
      case 'kerchief': {
        f.put(G.hemi(), c || '#6a2f43', 0, R * 0.1, -R * 0.02, -0.12, 0, 0, R * 1.11, R * 1.05, R * 1.11);
        f.put(G.sphere(10), c || '#6a2f43', 0, R * 0.05, -R * 1.12, 0, 0, 0, R * 0.26, R * 0.2, R * 0.28);
        for (const s of [-1, 1]) f.put(G.cone(6), c || '#6a2f43', s * R * 0.2, -R * 0.15, -R * 1.18, 0.4, 0, s * 0.5, R * 0.15, R * 0.44, R * 0.06);
        return 'cap';
      }
      case 'bandana': {
        f.put(G.hemi(), c || '#a3241c', 0, R * 0.36, 0, 0.05, 0, 0, R * 1.07, R * 0.86, R * 1.07);
        f.put(G.tube(1, 1, 0.05, 26), c || '#a3241c', 0, R * 0.38, 0, 0.05, 0, 0, R * 1.08, R * 0.34, R * 1.08);
        f.put(G.sphere(10), shade(c || '#a3241c', -0.1), 0, R * 0.38, -R * 1.08, 0, 0, 0, R * 0.2, R * 0.16, R * 0.16);
        for (const s of [-1, 1]) f.put(G.rbox(R * 0.2, R * 0.62, R * 0.05, R * 0.025), c || '#a3241c', s * R * 0.16, R * 0.08, -R * 1.14, 0.45, 0, s * 0.3);
        return 'cap';
      }
      case 'feathercap': {
        const hc = c || '#2a5a3a';
        f.put(G.hemi(), hc, 0, R * 0.2, -R * 0.02, -0.18, 0, 0.18, R * 1.1, R * 0.85, R * 1.14);
        f.put(G.cone(12), hc, R * 0.05, R * 0.75, -R * 0.4, -0.9, 0, 0.2, R * 0.55, R * 1.0, R * 0.4);
        f.put(G.torus(0.1, PI * 2, 26), shade(hc, -0.15), 0, R * 0.24, 0, PI / 2 - 0.18, 0, 0.18, R * 1.1, R * 1.14, R * 1.1);
        const fc = c2 || '#c93a2a';
        f.put(G.sphere(12), fc, R * 0.7, R * 0.95, -R * 0.45, -0.85, 0, -0.5, R * 0.15, R * 0.95, R * 0.06);
        f.decal(G.pill(0.01, R * 1.6), shade(fc, -0.35), R * 0.72, R * 0.96, -R * 0.4, 0, PI / 2 - 0.5, -0.85 + PI / 2);
        return 'cap';
      }
      case 'shamanskull': {
        f.put(G.hemi(), PAL.bone, 0, R * 0.14, 0, 0, 0, 0, R * 1.14, R * 1.08, R * 1.14);
        f.put(G.rbox(R * 1.1, R * 0.4, R * 0.5, R * 0.14), PAL.bone, 0, R * 0.42, R * 0.86, 0.1, 0, 0);
        for (const s of [-1, 1]) f.decal(G.sphere(10), '#160e0a', s * R * 0.32, R * 0.48, R * 1.1, 0, 0, 0, R * 0.17, R * 0.14, R * 0.06);
        for (const s of [-1, 1]) { const hf = f.at(s * R * 0.9, R * 0.8, 0, 0, 0, -s * 0.4); for (let i = 0; i < 4; i++) { const t = i / 3; hf.put(G.sphere(10), '#e6dcc0', s * R * t * 0.6, R * t * t * 0.7, 0, 0, 0, 0, R * (0.2 - t * 0.12), R * (0.22 - t * 0.12), R * (0.2 - t * 0.12)); } }
        for (let i = 0; i < 3; i++) f.put(G.rbox(R * 0.1, R * 0.85, R * 0.24, R * 0.05), ['#b8321e', '#3b7bd1', '#e8c040'][i], -R * 0.3 + i * R * 0.3, R * 1.25, -R * 0.62, -0.55, 0, 0.3 - i * 0.3);
        return 'hide';
      }
      default: return '';
    }
  }

  /* ================= shoulders ================= */
  function pauldron(f, s, w, type, col, spikes) {
    const p = f.at(s * 0.37 * w, 0.58, 0, 0, 0, s * -0.38);
    const pc = col || '#aab5c3';
    switch (type) {
      case 'skull': {
        p.put(G.hemi(), '#3a3236', 0, -0.02, 0, 0, 0, 0, 0.27, 0.12, 0.27);
        p.put(G.sphere(16), PAL.bone, 0, 0.08, 0, 0, s * -0.4, 0, 0.18, 0.17, 0.19);
        p.put(G.rbox(0.18, 0.08, 0.14, 0.03), PAL.bone, 0, -0.03, 0.08);
        for (const e of [-1, 1]) p.decal(G.sphere(8), '#0e0a08', e * 0.065, 0.09, 0.16, 0, 0, 0, 0.05, 0.055, 0.03);
        for (const e of [-1, 1]) p.glow(G.sphere(6), '#7bd389', e * 0.065, 0.09, 0.18, 0, 0, 0, 0.022, 0.022, 0.015, 3);
        break;
      }
      case 'fur': {
        const r = mulberry32(s > 0 ? 11 : 12);
        for (let i = 0; i < 6; i++) p.put(G.sphere(10), i % 2 ? pc : shade(pc, -0.12), (r() - 0.5) * 0.24, 0.02 + r() * 0.08, (r() - 0.5) * 0.3, 0, 0, 0, 0.15, 0.12, 0.15);
        break;
      }
      default: {
        p.metal(G.hemi(20), pc, 0, 0, 0, 0, 0, 0, 0.3, 0.25, 0.29);
        p.metal(G.hemi(20), shade(pc, -0.08), 0, -0.1, 0, 0, 0, 0, 0.3, 0.15, 0.29);
        p.metal(G.torus(0.12, PI * 2, 22), shade(pc, -0.28), 0, 0, 0, PI / 2, 0, 0, 0.3, 0.29, 0.3);
        p.metal(G.torus(0.12, PI * 2, 22), shade(pc, -0.28), 0, -0.1, 0, PI / 2, 0, 0, 0.3, 0.29, 0.3);
        for (let i = 0; i < 3; i++) p.metal(G.sphere(6), '#eef2f8', Math.cos(i * 1.1 - 1.1) * 0.17 * s, 0.17, Math.sin(i * 1.1 - 1.1 + PI) * -0.17, 0, 0, 0, 0.03, 0.03, 0.03);
        if (spikes) for (let i = 0; i < 3; i++) p.metal(G.cone(6), '#c8ccd2', (i - 1) * 0.11, 0.26, 0, 0, 0, s * 0.3, 0.05, 0.22, 0.05);
        p.shine(s * -0.02, 0.2, 0.12, 0.09, 0.05, 0, -0.6, 0);
      }
    }
  }

  /* ================= torso ================= */
  function buildTorso(f, cfg, char) {
    const b = cfg.body || { type: 'tunic', color: '#5a4a6e' };
    const col = b.color || '#5a4a6e', w = cfg.wide || 1;
    const trim = b.trim, beltC = b.belt || '#4a2e1c';
    const belt = (y, r, buckle) => { f.put(G.torus(0.15, PI * 2, 28), beltC, 0, y, 0, PI / 2, 0, 0, r * w, r * w, r * 0.84 * w); f.metal(G.rbox(buckle || 0.15, buckle || 0.13, 0.06, 0.025), '#d4ad48', 0, y, r * 0.84 * w + 0.015); f.decal(G.rbox((buckle || 0.15) * 0.5, (buckle || 0.13) * 0.45, 0.07, 0.01), beltC, 0, y, r * 0.84 * w + 0.02); };
    const pouch = (x, y) => { f.put(G.rbox(0.14, 0.16, 0.1, 0.035), '#5a3a22', x, y - 0.06, 0.24 * w, 0, x > 0 ? 0.6 : -0.6, 0); f.put(G.rbox(0.15, 0.06, 0.11, 0.02), '#4a2e1c', x, y, 0.24 * w, 0, x > 0 ? 0.6 : -0.6, 0); };
    const sh = cfg.shoulders;
    if (sh) for (const s of [-1, 1]) pauldron(f, s, w, sh.type, sh.color, sh.spikes);
    if (cfg.back) buildBack(f, cfg.back, w);
    switch (b.type) {
      case 'robe': case 'dress': {
        const fl = b.type === 'dress' ? 0.3 : 0.2, sy = 1.0, hem = 0.05 - 0.645 * sy;
        f.put(G.torso(), col, 0, 0, 0, 0, 0, 0, 0.98 * w, 0.95, 0.8 * w);
        f.put(G.skirt(fl), col, 0, 0.05, 0, 0, 0, 0, w, sy, 0.86 * w);
        if (trim) {
          const hr = (0.5 + fl * 0.5) * w;
          f.metal(G.torus(0.075, PI * 2, 32), trim, 0, hem, 0, PI / 2, 0, 0, hr, hr, hr * 0.86);
          f.put(G.rbox(0.1, 0.55 - hem, 0.04, 0.02), trim, 0, (0.55 + hem) / 2, 0.28 * w, -0.12, 0, 0);
          f.put(G.torus(0.25, PI * 2, 20), trim, 0, 0.6, 0, PI / 2, 0, 0, 0.21, 0.21, 0.18);
          if (b.rune) f.glow(G.octa(), b.rune, 0, 0.3, 0.29 * w, 0, 0, 0, 0.05, 0.08, 0.02, 2.2);
        }
        f.put(G.tube(0.62, 1, 0.08, 22), shade(col, -0.06), 0, 0.52, 0, 0, 0, 0, 0.38 * w, 0.2, 0.31 * w);
        if (b.belt !== false) belt(0.08, 0.31, 0.12);
        if (b.sash) { f.put(G.rbox(0.12, 0.5, 0.04, 0.02), b.sash, 0.1, -0.2, 0.3 * w, 0.1, 0, 0.1); }
        return 'skirt';
      }
      case 'belly': {
        f.put(G.belly(), col, 0, -0.02, 0.03, 0, 0, 0, w, 1.0, 0.95 * w);
        f.put(G.sphere(16), shade(col, 0.08), 0, 0.22, 0.2 * w, 0, 0, 0, 0.3 * w, 0.26, 0.26 * w);
        belt(0.08, 0.45, 0.2);
        if (trim) for (let i = 0; i < 4; i++) f.metal(G.sphere(8), trim, 0, 0.2 + i * 0.12, 0.42 * w - i * 0.025, 0, 0, 0, 0.04, 0.04, 0.04);
        if (b.fur) f.put(G.torus(0.36, PI * 2, 18), b.fur, 0, 0.6, -0.02, PI / 2, 0, 0, 0.36 * w, 0.36 * w, 0.3 * w);
        return 'belly';
      }
      case 'bones': {
        f.put(G.cyl(1, 1, 8), PAL.bone, 0, 0.32, -0.08, 0, 0, 0, 0.055, 0.64, 0.055);
        f.put(G.sphere(12), '#1a1410', 0, 0.38, -0.02, 0, 0, 0, 0.2, 0.22, 0.13, { decal: true, grad: false });
        for (let i = 0; i < 4; i++) f.put(G.torus(0.13, PI * 1.4, 14), PAL.bone, 0, 0.54 - i * 0.11, -0.02, PI / 2, 0, PI * 0.5 - PI * 1.7, 0.25 - i * 0.022, 0.25 - i * 0.022, 0.19);
        f.put(G.rbox(0.05, 0.36, 0.04, 0.02), PAL.bone, 0, 0.4, 0.16);
        f.put(G.sphere(14), PAL.bone, 0, 0.03, 0, 0, 0, 0, 0.25, 0.12, 0.18);
        f.put(G.torus(0.25, PI * 2, 16), PAL.bone, 0, 0.6, -0.02, PI / 2, 0, 0, 0.26, 0.26, 0.2);
        if (b.color) for (let i = 0; i < 7; i++) f.put(G.rbox(0.13, 0.36, 0.03, 0.01), b.color, Math.sin(i * 0.9) * 0.22, -0.08 - (i % 2) * 0.08, Math.cos(i * 0.9) * 0.18, 0.18, i * 0.9, 0.05);
        if (b.armor) { f.metal(G.sphere(14), b.armor, 0, 0.42, 0.06, 0, 0, 0, 0.3, 0.25, 0.22); }
        return 'bones';
      }
      case 'bare': {
        const sk = cfg.skin || SKINS[1];
        f.put(G.torso(), sk, 0, 0, 0, 0, 0, 0, 1.04 * w, 0.95, 0.82 * w, { grad: [0.78, 1.05] });
        for (const s of [-1, 1]) f.put(G.sphere(14), shade(sk, 0.03), s * 0.13 * w, 0.42, 0.18 * w, 0, 0, 0, 0.17 * w, 0.13, 0.12);
        for (let i = 0; i < 3; i++) for (const s of [-1, 1]) f.put(G.sphere(10), sk, s * 0.07, 0.24 - i * 0.09, 0.24 * w, 0, 0, 0, 0.065, 0.045, 0.05);
        if (b.paint) f.decal(G.rbox(0.06, 0.4, 0.05, 0.02), b.paint, -0.1, 0.36, 0.27 * w, 0, 0, 0.5);
        f.put(G.rbox(0.07, 0.85, 0.05, 0.02), '#4a2e1c', 0, 0.32, 0.27 * w, 0, 0, 0.7);
        f.put(G.torus(0.4, PI * 2, 20), b.fur || '#8a7a64', 0, 0.6, -0.02, PI / 2, 0, 0, 0.36 * w, 0.36 * w, 0.29 * w);
        { const r = mulberry32(3); for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2; f.put(G.sphere(10), i % 2 ? (b.fur || '#8a7a64') : shade(b.fur || '#8a7a64', -0.14), Math.cos(a) * 0.32 * w, 0.63 + r() * 0.04, Math.sin(a) * 0.26 * w, 0, 0, 0, 0.13, 0.1, 0.13); } }
        f.put(G.tube(1, 1.15, 0.06, 18), col, 0, -0.08, 0, 0, 0, 0, 0.35 * w, 0.24, 0.29 * w);
        f.put(G.rbox(0.22, 0.42, 0.04, 0.02), col, 0, -0.26, 0.29 * w, -0.1, 0, 0);
        belt(0.06, 0.34, 0.22);
        return 'tunic';
      }
      default: {
        const metalBody = b.type === 'armor';
        const put = metalBody ? f.metal.bind(f) : f.put.bind(f);
        put(G.torso(), col, 0, 0, 0, 0, 0, 0, w, 0.95, 0.8 * w);
        if (metalBody) {
          f.metal(G.sphere(18), shade(col, 0.06), 0, 0.4, 0.09, 0, 0, 0, 0.31 * w, 0.27, 0.2);
          if (b.color2) {
            f.put(G.rbox(0.3 * w, 0.66, 0.05, 0.03), b.color2, 0, 0.0, 0.27 * w, -0.04, 0, 0);
            f.put(G.rbox(0.3 * w, 0.66, 0.05, 0.03), b.color2, 0, 0.0, -0.26 * w, 0.04, 0, 0);
            if (trim) { f.metal(G.rbox(0.05, 0.38, 0.03, 0.012), trim, 0, 0.06, 0.3 * w, -0.04, 0, 0); f.metal(G.rbox(0.22, 0.05, 0.03, 0.012), trim, 0, 0.16, 0.3 * w, -0.04, 0, 0); }
            if (b.emblem === 'sun') { f.metal(G.cyl(1, 1, 16), '#e8c060', 0, 0.38, 0.3 * w, PI / 2, 0, 0, 0.09, 0.03, 0.09); for (let i = 0; i < 8; i++) f.metal(G.cone(4), '#e8c060', Math.cos(i * PI / 4) * 0.13, 0.38 + Math.sin(i * PI / 4) * 0.13, 0.29 * w, 0, 0, i * PI / 4 - PI / 2, 0.03, 0.08, 0.02); }
          }
          for (let i = 0; i < 2; i++) f.metal(G.torus(0.08, PI * 2, 28), shade(col, -0.2), 0, 0.12 + i * 0.1, 0, PI / 2, 0, 0, (0.3 + i * 0.005) * w, (0.3 + i * 0.005) * w, 0.245 * w);
          for (let i = -1; i <= 1; i++) f.metal(G.rbox(0.18, 0.22, 0.05, 0.03), shade(col, -0.05), i * 0.2 * w, -0.1, 0.25 * w - Math.abs(i) * 0.06, 0.12, i * 0.45, 0);
          for (const s of [-1, 1]) f.metal(G.rbox(0.18, 0.22, 0.05, 0.03), shade(col, -0.08), s * 0.3 * w, -0.1, 0, 0, s * PI / 2, s * 0.1);
          f.metal(G.torus(0.22, PI * 2, 22), shade(col, -0.12), 0, 0.6, 0, PI / 2, 0, 0, 0.23, 0.23, 0.2);
          f.shine(-0.12, 0.47, 0.29, 0.12, 0.06, 0.4, -0.4, -0.3);
          if (!sh) for (const s of [-1, 1]) pauldron(f, s, w, 'plate', b.pauldron || col, b.spikes);
          belt(0.0, 0.33);
        } else {
          if (b.type === 'vest' || b.type === 'coat' || b.type === 'gi') {
            f.put(G.rbox(0.2, 0.36, 0.04, 0.02), b.color2 || shade(col, 0.25), 0, 0.42, 0.25 * w);
          }
          if (b.type === 'vest' || b.type === 'coat') {
            f.put(G.rbox(0.07, 0.86, 0.05, 0.02), '#4a2e1c', 0, 0.3, 0.26 * w, 0, 0, 0.72);
            f.metal(G.rbox(0.07, 0.07, 0.03, 0.012), '#a0a6ae', 0.1, 0.4, 0.29 * w, 0, 0, 0.72);
            for (let i = 0; i < 3; i++) f.metal(G.rbox(0.06, 0.14, 0.03, 0.01), '#a8aeb6', -0.18 + i * 0.07, 0.28 + i * 0.07, 0.25 * w, 0, 0.3, 0.72);
            pouch(0.24 * w, 0.06);
          }
          if (b.type === 'coat') {
            f.put(G.tube(0.34, 0.5, 0.04, 18, PI * 0.2, PI * 1.6), col, 0, -0.33, 0, 0, 0, 0, w, 0.8, w, { grad: [0.6, 1.0] });
            for (const s of [-1, 1]) f.put(G.rbox(0.08, 0.44, 0.03, 0.012), b.color2 || '#d8d0c0', s * 0.12, 0.4, 0.28 * w, -0.05, 0, s * 0.3);
            for (let i = 0; i < 3; i++) f.metal(G.sphere(6), '#d4ad48', 0.0, 0.3 - i * 0.12, 0.29 * w, 0, 0, 0, 0.028, 0.028, 0.028);
          }
          if (b.type === 'gi') {
            for (const s of [-1, 1]) f.put(G.rbox(0.09, 0.62, 0.035, 0.015), b.color2 || shade(col, -0.2), s * 0.08, 0.32, 0.27 * w, -0.05, 0, s * 0.45);
            f.put(G.tube(1, 1.15, 0.06, 18), col, 0, -0.1, 0, 0, 0, 0, 0.34 * w, 0.26, 0.28 * w);
            f.put(G.torus(0.22, PI * 2, 24), b.belt || '#a3241c', 0, 0.06, 0, PI / 2, 0, 0, 0.33 * w, 0.33 * w, 0.28 * w);
            for (const s of [-1, 1]) f.put(G.rbox(0.08, 0.36, 0.03, 0.01), b.belt || '#a3241c', s * 0.1 + 0.12, -0.12, 0.28 * w, 0.1, 0, s * 0.18);
            return 'tunic';
          }
          if (b.type === 'rags') {
            f.put(G.tube(1, 1.08, 0.06, 7), col, 0, -0.06, 0, 0, 0.3, 0, 0.36 * w, 0.24, 0.3 * w);
            f.put(G.rbox(0.13, 0.13, 0.03, 0.02), shade(col, 0.2), -0.12, 0.4, 0.25 * w);
            f.put(G.rbox(0.1, 0.1, 0.03, 0.02), shade(col, -0.2), 0.14, 0.18, 0.26 * w, 0, 0, 0.4);
            f.put(G.torus(0.18, PI * 2, 18), '#8a7350', 0, 0.06, 0, PI / 2, 0, 0, 0.32 * w, 0.32 * w, 0.26 * w);
          }
          if (b.type === 'tunic') { f.put(G.tube(1, 1.12, 0.06, 18), col, 0, -0.07, 0, 0, 0, 0, 0.34 * w, 0.22, 0.27 * w); f.put(G.torus(0.12, PI * 2, 26), b.color2 || shade(col, -0.2), 0, -0.18, 0, PI / 2, 0, 0, 0.37 * w, 0.37 * w, 0.3 * w); }
          if (b.type === 'fur') {
            f.put(G.torus(0.38, PI * 2, 18), b.color2 || '#8a7a64', 0, 0.58, 0, PI / 2, 0, 0, 0.34 * w, 0.34 * w, 0.28 * w);
            f.put(G.rbox(0.07, 0.9, 0.05, 0.02), '#4a2e1c', 0, 0.3, 0.24 * w, 0, 0, 0.7);
          }
          if (trim) f.put(G.torus(0.22, PI * 2, 20), trim, 0, 0.6, 0, PI / 2, 0, 0, 0.21, 0.21, 0.18);
          if (b.belt !== false && b.type !== 'rags') { belt(0.04, 0.33); pouch(-0.24 * w, 0.0); }
        }
        return metalBody ? 'armor' : 'tunic';
      }
    }
  }
  function buildBack(f, bk, w) {
    switch (bk.type) {
      case 'quiver': {
        const q = f.at(0.1, 0.36, -0.3 * w, 0.25, 0, -0.45);
        q.put(G.cyl(1, 0.9, 14), bk.color || '#6a4426', 0, 0, 0, 0, 0, 0, 0.11, 0.62, 0.11);
        q.put(G.torus(0.2, PI * 2, 14), '#3a2410', 0, 0.28, 0, PI / 2, 0, 0, 0.115, 0.115, 0.115);
        q.put(G.torus(0.2, PI * 2, 14), '#3a2410', 0, -0.2, 0, PI / 2, 0, 0, 0.11, 0.11, 0.11);
        for (let i = 0; i < 4; i++) { const a = i * 1.6; q.put(G.cyl(1, 1, 4), '#c8b08a', Math.cos(a) * 0.05, 0.42, Math.sin(a) * 0.05, 0, 0, 0, 0.012, 0.3, 0.012); q.put(G.cone(3), i % 2 ? '#e8e0d0' : '#b8321e', Math.cos(a) * 0.05, 0.56, Math.sin(a) * 0.05, 0, a, 0, 0.04, 0.14, 0.012); }
        f.put(G.rbox(0.07, 0.9, 0.05, 0.02), '#4a2e1c', 0, 0.3, 0.27 * w, 0, 0, -0.72);
        break;
      }
      case 'pack': {
        f.put(G.rbox(0.4, 0.42, 0.22, 0.08), bk.color || '#6a4a2e', 0, 0.3, -0.32 * w);
        f.put(G.rbox(0.42, 0.12, 0.24, 0.05), shade(bk.color || '#6a4a2e', -0.15), 0, 0.52, -0.32 * w);
        f.put(G.cyl(1, 1, 12), '#8a6a4a', 0, 0.6, -0.3 * w, 0, 0, PI / 2, 0.08, 0.46, 0.08);
        break;
      }
      case 'banner': {
        f.put(G.cyl(1, 1, 6), '#5a3a22', 0.1, 0.8, -0.3 * w, 0, 0, 0, 0.022, 1.3, 0.022);
        f.put(G.rbox(0.36, 0.5, 0.02, 0.01), bk.color || '#7a1f1b', 0.28, 1.2, -0.3 * w);
        f.put(G.rbox(0.14, 0.14, 0.03, 0.01), bk.color2 || '#d4ad48', 0.28, 1.22, -0.28 * w, 0, 0, PI / 4);
        break;
      }
      default: break;
    }
  }

  /* ================= weapons (grip at origin, business end along +Y) ================= */
  function buildWeapon(f, w) {
    const t = w.type;
    const steel = w.color || '#c6cfdb', gold = w.color2 || '#d4ad48', wood = '#5a3a22';
    let tip = [0, 1, 0];
    switch (t) {
      case 'sword': case 'greatsword': case 'runeblade': {
        const big = t === 'greatsword', L = big ? 1.5 : 1.12, Wd = big ? 0.24 : 0.18;
        f.metal(G.blade(Wd, L), steel, 0, 0.14, 0);
        f.decal(G.rbox(Wd * 0.18, L * 0.7, Wd * 0.26, 0.008), shade(steel, -0.3), 0, 0.14 + L * 0.4, 0);
        if (t === 'runeblade' || w.glow) for (let i = 0; i < 4; i++) f.glow(G.rbox(Wd * 0.22, 0.06, Wd * 0.3, 0.01), w.glow || '#7fd1ff', 0, 0.3 + i * L * 0.16, 0, 0, 0, (i % 2) * 0.6, 1, 1, 1, 2.4);
        f.metal(G.rbox(big ? 0.56 : 0.46, 0.09, 0.12, 0.04), gold, 0, 0.13, 0, 0, 0, 0);
        for (const s of [-1, 1]) f.metal(G.sphere(8), gold, s * (big ? 0.29 : 0.24), 0.15, 0, 0, 0, 0, 0.06, 0.06, 0.06);
        f.metal(G.sphere(8), gold, 0, 0.16, 0.05, 0, 0, 0, 0.045, 0.06, 0.03);
        f.put(G.cyl(1, 1, 10), '#3a2014', 0, -0.02, 0, 0, 0, 0, 0.05, big ? 0.4 : 0.28, 0.05);
        for (let i = 0; i < 3; i++) f.put(G.torus(0.3, PI * 2, 10), '#24140c', 0, -0.1 + i * 0.07, 0, PI / 2, 0, 0, 0.055, 0.055, 0.055);
        f.metal(G.sphere(10), gold, 0, big ? -0.26 : -0.19, 0, 0, 0, 0, 0.08, 0.08, 0.08);
        f.shine(Wd * 0.18, 0.14 + L * 0.5, Wd * 0.12, 0.025, L * 0.32, 0);
        tip = [0, 0.14 + L, 0];
        break;
      }
      case 'axe': case 'greataxe': {
        const L = t === 'greataxe' ? 1.45 : 1.0;
        f.put(G.cyl(1, 0.85, 8), wood, 0, L / 2 - 0.14, 0, 0, 0, 0, 0.06, L, 0.06);
        const hg = G.shape('axe', (s) => { s.moveTo(0, 0.16); s.quadraticCurveTo(0.28, 0.22, 0.42, 0.42); s.quadraticCurveTo(0.6, 0, 0.42, -0.42); s.quadraticCurveTo(0.28, -0.22, 0, -0.16); s.lineTo(0, 0.16); }, 0.05, 0.025);
        f.metal(hg, steel, 0.03, L - 0.26, 0);
        f.decal(G.shape('axeEdge', (s) => { s.moveTo(0.36, 0.36); s.quadraticCurveTo(0.54, 0, 0.36, -0.36); s.quadraticCurveTo(0.5, 0, 0.36, 0.36); }, 0.07, 0.01), '#f2f6fa', 0.03, L - 0.26, 0);
        if (t === 'greataxe') f.metal(hg, steel, -0.03, L - 0.26, 0, 0, PI, 0);
        f.metal(G.rbox(0.14, 0.32, 0.14, 0.04), '#5a5f69', 0, L - 0.26, 0);
        f.metal(G.cone(6), steel, 0, L - 0.02, 0, 0, 0, 0, 0.05, 0.22, 0.05);
        for (let i = 0; i < 3; i++) f.put(G.torus(0.3, PI * 2, 10), '#3a2410', 0, 0.02 + i * 0.08, 0, PI / 2, 0, 0, 0.07, 0.07, 0.07);
        tip = [0.4, L - 0.26, 0];
        break;
      }
      case 'mace': {
        f.put(G.cyl(1, 1, 8), wood, 0, 0.32, 0, 0, 0, 0, 0.05, 0.82, 0.05);
        f.metal(G.sphere(16), w.color || '#6a6e78', 0, 0.8, 0, 0, 0, 0, 0.15, 0.18, 0.15);
        for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; f.metal(G.rbox(0.05, 0.3, 0.17, 0.02), w.color || '#80848e', Math.cos(a) * 0.13, 0.8, Math.sin(a) * 0.13, 0, -a, 0); }
        f.metal(G.cone(6), steel, 0, 1.01, 0, 0, 0, 0, 0.06, 0.18, 0.06);
        f.metal(G.torus(0.3, PI * 2, 12), gold, 0, 0.6, 0, PI / 2, 0, 0, 0.07, 0.07, 0.07);
        tip = [0, 0.98, 0];
        break;
      }
      case 'hammer': {
        f.put(G.cyl(1, 1, 8), wood, 0, 0.36, 0, 0, 0, 0, 0.055, 1.0, 0.055);
        f.metal(G.rbox(0.56, 0.32, 0.32, 0.06), w.color || '#dfe3ea', 0, 0.9, 0);
        for (const s of [-1, 1]) f.metal(G.rbox(0.07, 0.36, 0.36, 0.025), gold, s * 0.2, 0.9, 0);
        f.metal(G.cyl(1, 1, 16), gold, 0, 0.9, 0.17, PI / 2, 0, 0, 0.1, 0.03, 0.1);
        f.glow(G.octa(), w.color2 && w.color2 !== '#d4ad48' ? w.color2 : '#ffe9a8', 0, 0.9, 0.2, 0, 0, 0, 0.06, 0.08, 0.03, 2.6);
        f.metal(G.cone(6), steel, 0, 1.12, 0, 0, 0, 0, 0.05, 0.16, 0.05);
        tip = [0.28, 0.9, 0];
        break;
      }
      case 'club': {
        f.put(G.cyl(0.62, 1, 10), w.color || '#7a5233', 0, 0.42, 0, 0, 0, 0, 0.16, 0.98, 0.16);
        f.put(G.sphere(12), w.color || '#7a5233', 0, 0.9, 0, 0, 0, 0, 0.16, 0.12, 0.16);
        for (let i = 0; i < 5; i++) f.metal(G.cone(5), '#a0a6ae', Math.cos(i * 1.6) * 0.14, 0.58 + i * 0.07, Math.sin(i * 1.6) * 0.14, Math.sin(i * 1.6) * 1.4, 0, Math.cos(i * 1.6) * -1.4, 0.035, 0.12, 0.035);
        tip = [0, 0.9, 0];
        break;
      }
      case 'daggers': case 'knife': {
        f.metal(G.blade(0.11, 0.5), steel, 0, 0.08, 0);
        f.metal(G.rbox(0.24, 0.05, 0.08, 0.02), w.color2 || '#4a4a52', 0, 0.07, 0);
        f.put(G.cyl(1, 1, 8), '#3a2214', 0, -0.03, 0, 0, 0, 0, 0.042, 0.17, 0.042);
        if (w.color2) f.put(G.cone(6), w.color2, 0, -0.18, 0, PI, 0, 0, 0.045, 0.16, 0.045);
        f.shine(0.02, 0.32, 0.015, 0.015, 0.14, 0);
        tip = [0, 0.58, 0];
        break;
      }
      case 'cleaver': {
        f.metal(G.rbox(0.28, 0.52, 0.04, 0.02), w.color || '#80848c', 0.06, 0.35, 0);
        f.decal(G.sphere(8), '#6a2a1a', 0.1, 0.45, 0.02, 0, 0, 0, 0.06, 0.04, 0.02);
        f.put(G.cyl(1, 1, 6), wood, 0, 0, 0, 0, 0, 0, 0.05, 0.25, 0.05);
        tip = [0.1, 0.6, 0];
        break;
      }
      case 'staff': case 'broom': case 'totem': {
        const sc = w.color || '#6a4426';
        f.put(G.cyl(0.75, 1, 8), sc, 0, 0.25, 0, 0, 0, 0, 0.06, 1.85, 0.06);
        for (let i = 0; i < 4; i++) f.put(G.sphere(8), shade(sc, -0.1), 0, -0.45 + i * 0.4, 0, 0, 0, 0, 0.075, 0.06, 0.075);
        if (t === 'broom') { f.put(G.cone(12), '#b89a52', 0, -0.9, 0, PI, 0, 0, 0.22, 0.58, 0.22); f.put(G.torus(0.25, PI * 2, 12), '#6a4426', 0, -0.64, 0, PI / 2, 0, 0, 0.1, 0.1, 0.1); tip = [0, -1.15, 0]; break; }
        const gc = w.color2 || '#8fd7ff', top = w.top || (t === 'totem' ? 'skull' : 'crystal');
        if (top === 'skull') {
          f.put(G.sphere(14), PAL.bone, 0, 1.3, 0.03, 0, 0, 0, 0.17, 0.16, 0.17);
          f.put(G.rbox(0.18, 0.08, 0.14, 0.03), PAL.bone, 0, 1.18, 0.07);
          for (const s of [-1, 1]) { f.decal(G.sphere(8), '#0e0a08', s * 0.065, 1.31, 0.17, 0, 0, 0, 0.05, 0.055, 0.03); f.glow(G.sphere(6), gc, s * 0.065, 1.31, 0.19, 0, 0, 0, 0.025, 0.025, 0.015, 3.2); }
          for (const s of [-1, 1]) f.put(G.torus(0.18, PI * 0.7, 10), sc, s * 0.12, 1.32, 0, 0, PI / 2, s > 0 ? -0.2 : PI + 0.2, 0.2, 0.2, 0.2);
          f.glow(G.ico(1), gc, 0, 1.56, 0, 0, 0, 0, 0.07, 0.07, 0.07, 2.4);
          if (t === 'totem') for (const s of [-1, 1]) f.put(G.rbox(0.05, 0.32, 0.1, 0.02), '#c93a2a', s * 0.15, 1.08, 0, 0, 0, s * 0.4);
          tip = [0, 1.45, 0];
        } else if (top === 'storm') {
          for (let i = 0; i < 2; i++) f.put(G.torus(0.12, PI * 1.5, 16), sc, 0, 1.28, 0, PI / 2, i * PI / 2, i * PI, 0.2 - i * 0.04, 0.2 - i * 0.04, 0.2 - i * 0.04);
          f.glow(G.octa(), gc, 0, 1.44, 0, 0, 0.5, 0, 0.11, 0.24, 0.11, 2.8);
          for (let i = 0; i < 3; i++) f.glow(G.torus(0.04, PI * 1.2, 20), shade(gc, 0.2), 0, 1.36 + i * 0.12, 0, PI / 2 + 0.3, 0, i * 2, 0.24 - i * 0.04, 0.24 - i * 0.04, 0.24 - i * 0.04, 1.5);
          tip = [0, 1.45, 0];
        } else if (top === 'orb') {
          for (let i = 0; i < 3; i++) f.put(G.torus(0.2, PI * 0.95, 10), sc, 0, 1.25, 0, PI / 2, (i * 2 * PI) / 3, 0, 0.16, 0.16, 0.16);
          f.glow(G.sphere(16), gc, 0, 1.38, 0, 0, 0, 0, 0.13, 0.13, 0.13, 2.4);
          tip = [0, 1.38, 0];
        } else if (top === 'hook') {
          f.put(G.torus(0.22, PI * 1.3, 16), sc, 0.15, 1.2, 0, 0, 0, -0.2, 0.17, 0.17, 0.17);
          for (let i = 0; i < 3; i++) { f.put(G.cyl(1, 1, 3), '#d8d0c0', 0.3, 1.02 - i * 0.04, 0, 0, 0, 0, 0.005, 0.22, 0.005); f.put(i === 1 ? G.sphere(8) : G.octa(), ['#7bd389', PAL.bone, '#b06ad8'][i], 0.3 + (i - 1) * 0.04, 0.88 - i * 0.03, 0, 0, 0, 0, 0.04, 0.05, 0.04); }
          f.glow(G.sphere(10), gc, 0.3, 1.25, 0, 0, 0, 0, 0.06, 0.06, 0.06, 2.6);
          tip = [0.3, 1.25, 0];
        } else {
          for (let i = 0; i < 3; i++) f.put(G.torus(0.22, PI * 0.95, 10), sc, 0, 1.24, 0, PI / 2, (i * 2 * PI) / 3, 0, 0.16, 0.16, 0.16);
          f.glow(G.octa(), gc, 0, 1.36, 0, 0, 0.4, 0, 0.13, 0.22, 0.13, 2.8);
          tip = [0, 1.36, 0];
        }
        break;
      }
      case 'spear': {
        f.put(G.cyl(1, 1, 8), wood, 0, 0.35, 0, 0, 0, 0, 0.045, 1.8, 0.045);
        f.metal(G.blade(0.15, 0.4), steel, 0, 1.22, 0);
        f.put(G.rbox(0.1, 0.12, 0.1, 0.03), '#3a2410', 0, 1.2, 0);
        f.put(G.rbox(0.03, 0.28, 0.1, 0.01), '#a3241c', 0.06, 1.1, 0, 0, 0, -0.3);
        tip = [0, 1.62, 0];
        break;
      }
      case 'sickle': case 'scythe': {
        const L = t === 'scythe' ? 1.7 : 0.55, big = t === 'scythe';
        f.put(G.cyl(1, 1, 8), '#3a2a1c', 0, L / 2 - 0.12, 0, 0, 0, 0, 0.045, L, 0.045);
        const bl = G.shape('scy', (s) => { s.moveTo(0, 0.05); s.quadraticCurveTo(0.55, 0.32, 1.0, -0.15); s.quadraticCurveTo(0.55, 0.08, 0, -0.06); s.lineTo(0, 0.05); }, 0.03, 0.012);
        f.metal(bl, w.color || '#cfd8cc', 0, L - 0.14, 0, 0, 0, 0, big ? 0.85 : 0.42, big ? 0.85 : 0.42, 1);
        if (!big) f.glow(G.sphere(8), '#7bd389', 0.0, L - 0.08, 0, 0, 0, 0, 0.05, 0.05, 0.05, 2.6);
        tip = [big ? 0.85 : 0.42, L - 0.2, 0];
        break;
      }
      case 'shovel': {
        f.put(G.cyl(1, 1, 8), wood, 0, 0, 0, 0, 0, 0, 0.05, 1.5, 0.05);
        f.metal(G.rbox(0.38, 0.48, 0.05, 0.04), w.color || '#5a5f69', 0, -0.9, 0);
        f.put(G.rbox(0.24, 0.08, 0.08, 0.03), '#3a2410', 0, 0.76, 0);
        tip = [0, -1.08, 0];
        break;
      }
      case 'crossbow': {
        f.put(G.rbox(0.12, 0.74, 0.12, 0.03), '#3e2a1a', 0, 0.2, 0);
        f.metal(G.rbox(0.05, 0.6, 0.06, 0.015), '#a8b0ba', 0, 0.26, 0.07);
        f.metal(G.torus(0.06, PI * 0.82, 18), '#5a5f69', 0, 0.42, 0, 0, 0, PI * 0.09, 0.42, 0.42, 0.42);
        f.put(G.cyl(1, 1, 4), '#e8e0cc', 0, 0.36, 0, 0, 0, PI / 2, 0.008, 0.74, 0.008, { grad: false });
        f.metal(G.blade(0.045, 0.5), '#e6eef8', 0, 0.22, 0.1);
        f.metal(G.torus(0.3, PI * 2, 12), '#d4ad48', 0, -0.08, 0, PI / 2, 0, 0, 0.07, 0.07, 0.07);
        tip = [0, 0.72, 0];
        break;
      }
      case 'bow': {
        const bc = w.color || '#6a4426';
        const bow = f.at(-0.06, 0, 0);
        for (const s of [-1, 1]) bow.put(G.torus(0.065, PI * 0.42, 14), bc, 0.62, 0, 0, 0, 0, s > 0 ? PI * 0.58 : PI, 0.72, 0.72, 0.72);
        for (const s of [-1, 1]) bow.put(G.cone(6), shade(bc, 0.2), -0.02, s * 0.7, 0, s > 0 ? 0 : PI, 0, 0, 0.04, 0.12, 0.04);
        bow.put(G.rbox(0.1, 0.24, 0.1, 0.03), '#3a2410', -0.1, 0, 0);
        bow.put(G.cyl(1, 1, 4), '#efe6d2', 0.14, 0, 0, 0, 0, 0, 0.008, 1.38, 0.008, { grad: false });
        tip = [0, 0.66, 0];
        break;
      }
      case 'lute': {
        f.put(G.sphere(18), '#9a6430', 0, 0, 0, 0, 0, 0, 0.3, 0.36, 0.14);
        f.put(G.rbox(0.1, 0.7, 0.06, 0.02), '#3a2414', 0, 0.48, 0.04);
        f.put(G.rbox(0.15, 0.18, 0.07, 0.03), '#3a2414', 0, 0.86, 0.0, -0.45, 0, 0);
        f.decal(G.sphere(12), '#1a0e08', 0, 0.06, 0.13, 0, 0, 0, 0.08, 0.08, 0.02);
        for (let i = -1; i <= 1; i++) f.put(G.cyl(1, 1, 3), '#efe6d2', i * 0.022, 0.4, 0.09, 0, 0, 0, 0.004, 0.8, 0.004, { grad: false });
        tip = [0, 0.86, 0];
        break;
      }
      case 'sling': { f.put(G.cyl(1, 1, 4), '#6d5a3e', 0, -0.2, 0, 0, 0, 0, 0.015, 0.42, 0.015); f.put(G.sphere(8), '#8a8578', 0, -0.44, 0, 0, 0, 0, 0.075, 0.075, 0.075); tip = [0, -0.44, 0]; break; }
      case 'cards': { for (let i = -1; i <= 1; i++) f.flat(G.rbox(0.16, 0.22, 0.012, 0.006), i === 0 ? '#f0e8d4' : '#ddd2b8', i * 0.05, 0.14, i * 0.012, 0, 0, i * 0.35); f.decal(G.sphere(6), '#a3241c', 0, 0.15, 0.012, 0, 0, 0, 0.03, 0.04, 0.005); break; }
      case 'candle': { f.put(G.cyl(1, 1, 10), '#efe6cf', 0, 0.13, 0, 0, 0, 0, 0.06, 0.3, 0.06); f.metal(G.cyl(1, 1, 12), '#b08a4a', 0, -0.02, 0, 0, 0, 0, 0.12, 0.04, 0.12); f.glow(G.cone(8), '#ffc86a', 0, 0.37, 0, 0, 0, 0, 0.045, 0.14, 0.045, 2.8); tip = [0, 0.38, 0]; break; }
      case 'mirror': { f.metal(G.cyl(1, 1, 8), '#9aa0aa', 0, 0, 0, 0, 0, 0, 0.035, 0.24, 0.035); f.metal(G.cyl(1, 1, 20), '#8a9098', 0, 0.28, 0, PI / 2, 0, 0, 0.18, 0.04, 0.22); f.glow(G.cyl(1, 1, 20), '#bcd4ff', 0, 0.28, 0.025, PI / 2, 0, 0, 0.15, 0.01, 0.19, 1.4); break; }
      default: break;
    }
    return tip;
  }

  function buildOffhand(f, o) {
    switch (o.type) {
      case 'shield': {
        const g = f.at(0, 0, 0.13, PI / 2, 0, 0);
        g.put(G.cyl(1, 1, 24), o.color || '#7a5230', 0, 0, 0, 0, 0, 0, 0.4, 0.08, 0.4);
        for (let i = 0; i < 4; i++) g.decal(G.rbox(0.02, 0.082, 0.7, 0.005), shade(o.color || '#7a5230', -0.28), -0.24 + i * 0.16, 0, 0);
        g.metal(G.torus(0.1, PI * 2, 28), o.color2 || '#6a7078', 0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.4);
        g.metal(G.hemi(), o.color2 || '#b9c2ce', 0, 0.04, 0, 0, 0, 0, 0.13, 0.09, 0.13);
        for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2; g.metal(G.sphere(6), '#dfe5ec', Math.cos(a) * 0.32, 0.045, Math.sin(a) * 0.32, 0, 0, 0, 0.028, 0.028, 0.028); }
        break;
      }
      case 'kite': {
        const eg = G.shape('kite', (s) => { s.moveTo(-0.34, 0.44); s.quadraticCurveTo(0, 0.52, 0.34, 0.44); s.quadraticCurveTo(0.38, -0.05, 0, -0.6); s.quadraticCurveTo(-0.38, -0.05, -0.34, 0.44); }, 0.06, 0.035);
        const ec = G.shape('kiteRim', (s) => { s.moveTo(-0.3, 0.38); s.quadraticCurveTo(0, 0.45, 0.3, 0.38); s.quadraticCurveTo(0.33, -0.05, 0, -0.52); s.quadraticCurveTo(-0.33, -0.05, -0.3, 0.38); }, 0.06, 0.02);
        f.metal(eg, o.color2 || '#c9a14a', 0, 0, 0.09);
        f.put(ec, o.color || '#2f4f7a', 0, 0, 0.12);
        const em = o.color2 || '#d4ad48', emb = o.emblem || 'cross';
        if (emb === 'sun') { f.metal(G.cyl(1, 1, 18), em, 0, 0.04, 0.17, PI / 2, 0, 0, 0.12, 0.04, 0.12); for (let i = 0; i < 8; i++) f.metal(G.cone(4), em, Math.cos(i * PI / 4) * 0.18, 0.04 + Math.sin(i * PI / 4) * 0.18, 0.16, 0, 0, i * PI / 4 - PI / 2, 0.04, 0.12, 0.02); }
        else if (emb === 'skull') { f.put(G.sphere(12), PAL.bone, 0, 0.06, 0.17, 0, 0, 0, 0.12, 0.12, 0.06); for (const s of [-1, 1]) f.decal(G.sphere(6), '#120a06', s * 0.045, 0.07, 0.22, 0, 0, 0, 0.03, 0.035, 0.02); }
        else { f.metal(G.rbox(0.09, 0.82, 0.04, 0.02), em, 0, -0.04, 0.17); f.metal(G.rbox(0.52, 0.09, 0.04, 0.02), em, 0, 0.16, 0.17); f.metal(G.sphere(10), em, 0, 0.16, 0.18, 0, 0, 0, 0.07, 0.07, 0.04); }
        f.shine(-0.15, 0.25, 0.16, 0.05, 0.12, 0.3);
        break;
      }
      case 'tome': {
        f.put(G.rbox(0.38, 0.46, 0.13, 0.03), o.color || '#5b2a24', 0, 0, 0.09);
        f.flat(G.rbox(0.35, 0.42, 0.1, 0.02), '#ece0c4', 0.025, 0, 0.09);
        f.metal(G.rbox(0.13, 0.13, 0.04, 0.02), o.color2 || '#d4ad48', 0, 0, 0.17);
        f.glow(G.octa(), o.glow || '#ffd56a', 0, 0, 0.19, 0, 0, 0, 0.035, 0.05, 0.02, 2);
        f.metal(G.rbox(0.4, 0.04, 0.14, 0.01), o.color2 || '#d4ad48', 0, 0.17, 0.09);
        break;
      }
      case 'lantern': {
        const g = f.at(0, -0.14, 0.08);
        g.metal(G.cyl(1, 1, 6), o.color || '#4a4f58', 0, 0, 0, 0, 0, 0, 0.14, 0.05, 0.14);
        g.glow(G.cyl(1, 1, 6), o.color2 || '#ffc86a', 0, -0.16, 0, 0, 0, 0, 0.11, 0.24, 0.11, 2.2);
        for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; g.metal(G.cyl(1, 1, 4), o.color || '#4a4f58', Math.cos(a) * 0.12, -0.16, Math.sin(a) * 0.12, 0, 0, 0, 0.014, 0.26, 0.014); }
        g.metal(G.cyl(1, 1, 6), o.color || '#4a4f58', 0, -0.31, 0, 0, 0, 0, 0.15, 0.05, 0.15);
        g.metal(G.torus(0.2, PI, 10), o.color || '#4a4f58', 0, 0.08, 0, 0, 0, 0, 0.08, 0.08, 0.08);
        break;
      }
      case 'orb': {
        f.glow(G.sphere(14), o.color || '#7fd1ff', 0, 0.12, 0.12, 0, 0, 0, 0.13, 0.13, 0.13, 2.2);
        break;
      }
      default: break;
    }
  }

  /* ================= build a character ================= */
  function build(cfg) {
    const char = { cfg, t: Math.random() * 10, blinkT: 1 + Math.random() * 3 };
    const root = new THREE.Group(), body = new THREE.Group();
    root.add(body);
    char.root = root; char.body = body;
    char.mat = toonMat(); char.out = outlineMat(); char.glow = glowMatV();
    if (cfg.rimColor) char.mat.userData.rim.value.set(cfg.rimColor);
    char.shadow = K3.blobShadow(0.66 * (cfg.wide || 1));
    char.shadow.material = char.shadow.material.clone(); root.add(char.shadow);
    if (cfg.rig === 'inkspawn' || cfg.rig === 'rat' || cfg.rig === 'wisp' || cfg.rig === 'wolf' || cfg.rig === 'bird') { buildCreature(cfg, char); return finish(char); }
    const bonesBody = cfg.body && cfg.body.type === 'bones';
    const skin = cfg.skin || SKINS[0];
    const R = cfg.headR || 0.37;
    const wide = cfg.wide || 1;
    const armorBody = cfg.body && cfg.body.type === 'armor';
    const sleeveC = cfg.arms || (cfg.body && cfg.body.type === 'bare' ? skin : (cfg.body && cfg.body.color) || '#5a4a6e');
    const legC = cfg.legs || '#3b3340', bootC = cfg.boots || '#3a2a20';
    char.R = R;

    // legs
    const pelvis = new THREE.Group(); pelvis.position.y = 0.74; body.add(pelvis);
    char.legs = [];
    for (const s of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(s * 0.16 * wide, 0, 0); pelvis.add(g);
      const bn = Bone('leg'), f = F(bn);
      if (bonesBody) { f.put(G.capsule(0.06, 0.62), PAL.bone, 0, 0, 0); f.put(G.sphere(8), PAL.bone, 0, -0.31, 0.02, 0, 0, 0, 0.075, 0.07, 0.075); f.put(G.rbox(0.14, 0.09, 0.26, 0.04), PAL.bone, 0, -0.68, 0.06); }
      else {
        f.put(G.capsule(0.14, 0.56), legC, 0, 0, 0);
        if (armorBody || cfg.greaves) { f.metal(G.cyl(1, 1.12, 14), cfg.greaves || '#a8b2bf', 0, -0.4, 0.01, 0, 0, 0, 0.16, 0.24, 0.16); f.metal(G.sphere(12), cfg.greaves || '#b8c2cf', 0, -0.25, 0.12, 0, 0, 0, 0.1, 0.09, 0.07); }
        f.put(G.rbox(0.3, 0.27, 0.44, 0.115), bootC, 0, -0.6, 0.07, 0, 0, 0, 1, 1, 1, { grad: [0.62, 1.1] });
        f.put(G.rbox(0.31, 0.07, 0.46, 0.03), '#1a100a', 0, -0.705, 0.07);
        f.put(G.torus(0.3, PI * 2, 18), shade(bootC, 0.12), 0, -0.47, 0, PI / 2, 0, 0, 0.155, 0.155, 0.155);
        if (armorBody) f.metal(G.hemi(), '#b0bac6', 0, -0.58, 0.23, 0.25, 0, 0, 0.15, 0.1, 0.13);
      }
      addBone(char, g, bn); char.legs.push(g);
    }
    // torso
    const T = new THREE.Group(); T.position.y = 0.72; body.add(T); char.torso = T;
    const tb = Bone('torso'), tf = F(tb);
    char.bodyKind = buildTorso(tf, cfg, char);
    if (cfg.scribble) for (const sd of [-1, 1]) { tf.decal(G.rbox(0.07, 0.95, 0.06, 0.02), cfg.scribble, 0, 0.32, 0.3 * wide, 0, 0, sd * 0.7); tf.decal(G.rbox(0.05, 0.95, 0.06, 0.02), cfg.scribble, 0, 0.32, -0.29 * wide, 0, 0, sd * 0.7); }
    if (cfg.cape) { tf.put(G.torus(0.32, PI * 2, 18), cfg.cape, 0, 0.6, -0.04, PI / 2, 0, 0, 0.3 * wide, 0.3 * wide, 0.26 * wide); tf.metal(G.sphere(10), '#d4ad48', 0.17 * wide, 0.6, 0.2, 0, 0, 0, 0.065, 0.065, 0.045); }
    if (cfg.amulet) {
      tf.metal(G.torus(0.018, PI * 2, 18), '#c9a14a', 0, 0.56, 0.07, PI / 2 + 0.55, 0, 0, 0.21 * wide, 0.21 * wide, 0.21 * wide);
      tf.metal(G.cyl(1, 1, 10), '#c9a14a', 0, 0.4, 0.29 * wide + 0.02, PI / 2, 0, 0, 0.11, 0.03, 0.11);
      tf.glow(G.octa ? G.octa() : G.sphere(8), cfg.amulet, 0, 0.4, 0.29 * wide + 0.06, 0, 0, 0, 0.085, 0.12, 0.05, 2.6);
    }
    addBone(char, T, tb);
    if (cfg.hunch) T.rotation.x = 0.35 * cfg.hunch;
    // arms
    char.arms = [];
    const shY = char.bodyKind === 'belly' ? 0.52 : 0.5;
    const robeSleeve = cfg.body && (cfg.body.type === 'robe' || cfg.body.type === 'dress');
    const plated = cfg.gauntlets || armorBody;
    for (const s of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(s * 0.4 * wide, shY, 0); T.add(sh);
      const L = 0.5 * (cfg.armLen || 1);
      const bn = Bone('arm'), f = F(bn);
      if (bonesBody) { f.put(G.capsule(0.055, L), PAL.bone, 0, 0, 0); f.put(G.sphere(8), PAL.bone, 0, -L * 0.5, 0, 0, 0, 0, 0.07, 0.07, 0.07); }
      else {
        f.put(G.sphere(12), sleeveC, 0, -0.02, 0, 0, 0, 0, 0.165, 0.165, 0.165);
        f.put(G.capsule(0.14, L), sleeveC, 0, 0, 0);
        if (robeSleeve) f.put(G.tube(0.5, 1, 0.1, 18), sleeveC, 0, -L + 0.13, 0.01, 0, 0, 0, 0.3, 0.3, 0.3, { grad: [0.6, 1] });
        else if (cfg.wraps) for (let i = 0; i < 3; i++) f.put(G.torus(0.3, PI * 2, 14), cfg.wraps, 0, -L + 0.08 + i * 0.07, 0, PI / 2, 0, 0.1, 0.145, 0.145, 0.145);
        else if (!plated) f.put(G.torus(0.3, PI * 2, 14), shade(sleeveC, -0.12), 0, -L + 0.14, 0, PI / 2, 0, 0, 0.145, 0.145, 0.145);
        if (plated) { f.metal(G.cyl(1, 1.2, 14), cfg.gauntlets && cfg.gauntlets !== true ? cfg.gauntlets : '#aeb8c5', 0, -L + 0.18, 0, 0, 0, 0, 0.16, 0.22, 0.16); f.metal(G.torus(0.26, PI * 2, 16), '#7c8692', 0, -L + 0.08, 0, PI / 2, 0, 0, 0.17, 0.17, 0.17); }
        if (cfg.bracers) f.put(G.cyl(1, 1.15, 14), cfg.bracers, 0, -L + 0.16, 0, 0, 0, 0, 0.155, 0.2, 0.155);
      }
      addBone(char, sh, bn);
      const hand = new THREE.Group(); hand.position.y = -L; sh.add(hand);
      const hb = Bone('hand'), hf = F(hb);
      const handC = bonesBody ? PAL.bone : plated ? (cfg.gauntlets && cfg.gauntlets !== true ? cfg.gauntlets : '#bcc6d3') : cfg.gloves || (cfg.wraps ? cfg.wraps : skin);
      if (bonesBody) { hf.put(G.sphere(10), PAL.bone, 0, -0.03, 0, 0, 0, 0, 0.085, 0.085, 0.085); for (let i = -1; i <= 1; i++) hf.put(G.capsule(0.02, 0.1), PAL.bone, i * 0.04, -0.07, 0.02); }
      else if (plated) { hf.metal(G.rbox(0.29, 0.27, 0.27, 0.11), handC, 0, -0.05, 0.01); hf.metal(G.rbox(0.31, 0.08, 0.29, 0.04), shade(handC, -0.15), 0, 0.03, 0.01); }
      else { hf.put(G.sphere(14), handC, 0, -0.045, 0, 0, 0, 0, 0.165, 0.155, 0.165); hf.put(G.sphere(8), handC, -s * 0.12, 0.0, 0.07, 0, 0, 0, 0.07, 0.07, 0.07); }
      if (cfg.claws) for (let i = -1; i <= 1; i++) hf.put(G.cone(4), '#ece4d0', i * 0.065, -0.2, 0.08, 0.5, 0, 0, 0.032, 0.2, 0.032);
      addBone(char, hand, hb);
      char.arms.push({ sh, hand, side: s });
    }
    char.armR = char.arms[1]; char.armL = char.arms[0];
    // weapon & offhand
    const dual = cfg.weapon && cfg.weapon.type === 'daggers';
    if (cfg.weapon) {
      const sock = new THREE.Group(); sock.position.set(0, -0.06, 0.02); char.armR.hand.add(sock);
      const wb = Bone('weapon'); const tip = buildWeapon(F(wb), cfg.weapon);
      addBone(char, sock, wb);
      char.wSock = sock; char.tip0 = new THREE.Vector3(tip[0], tip[1], tip[2]);
      if (dual) { const s2 = new THREE.Group(); s2.position.set(0, -0.06, 0.02); char.armL.hand.add(s2); const wb2 = Bone('weapon2'); buildWeapon(F(wb2), cfg.weapon); addBone(char, s2, wb2); char.wSock2 = s2; }
      if (cfg.weapon.type === 'candle') char.light = '#f2a541';
    }
    if (cfg.offhand && !dual) {
      const sock = new THREE.Group(); sock.position.set(0, -0.06, 0.05); char.armL.hand.add(sock);
      const ob = Bone('off'); buildOffhand(F(ob), cfg.offhand); addBone(char, sock, ob);
      char.oSock = sock;
      if (cfg.offhand.type === 'lantern') char.light = cfg.offhand.color2 || '#f2a541';
    }
    // head
    const neckY = char.bodyKind === 'belly' ? 0.66 : 0.63;
    const H = new THREE.Group(); H.position.y = neckY + R * 0.82; T.add(H); char.head = H;
    const hb = Bone('head'), hf = F(hb);
    const eyesBone = buildHead(hf, cfg, R, char);
    const hatMode = buildHat(hf, cfg, R, char);
    if (hatMode !== 'hide' || (cfg.hair && cfg.hair.style === 'long')) buildHair(hf, cfg, R, hatMode === 'hide' ? 'cap' : hatMode);
    addBone(char, H, hb);
    const EG = new THREE.Group(); H.add(EG); char.eyesG = EG;
    addBone(char, EG, eyesBone);
    if (char.plumeColor) {
      const pg = new THREE.Group(); pg.position.set(0, R * 1.32, -R * 0.2); H.add(pg);
      const pb = Bone('plume'), pf = F(pb), pc = char.plumeColor;
      for (let i = 0; i < 6; i++) pf.put(G.sphere(12), i % 2 ? shade(pc, -0.14) : pc, 0, R * (0.28 - i * 0.07), -R * (0.05 + i * 0.3), -0.55 - i * 0.3, 0, 0, R * 0.22, R * 0.6, R * 0.26);
      addBone(char, pg, pb); char.plume = pg;
    }
    // cape
    if (cfg.cape) {
      const cw = 0.8 * wide, chh = cfg.capeLen || 1.08;
      const cg = new THREE.PlaneGeometry(cw, chh, 4, 8); cg.translate(0, -chh / 2, 0);
      const pos = cg.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setX(i, x * (0.62 + 0.38 * (-y / chh))); pos.setZ(i, -Math.cos((x / cw) * PI) * 0.1); }
      cg.computeVertexNormals();
      const cc = new THREE.Color(cfg.cape).convertSRGBToLinear();
      const cols = []; for (let i = 0; i < pos.count; i++) { const k = 0.66 + 0.4 * (pos.getY(i) + chh) / chh; cols.push(cc.r * k, cc.g * k, cc.b * k); }
      cg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      const capeMat = toonMat({ side: THREE.DoubleSide }); char.capeMat = capeMat;
      const cape = new THREE.Mesh(cg, capeMat); cape.position.set(0, 0.62, -0.25); cape.scale.y = 1.15; T.add(cape);
      char.cape = cape; char.capeBase = Float32Array.from(pos.array);
    }
    return finish(char);
  }

  function addBone(char, group, bone) {
    const tg = bone.toon.geometry(), dg = bone.decal.geometry(), gg = bone.glow.geometry();
    if (tg) { group.add(new THREE.Mesh(tg, char.mat)); const o = new THREE.Mesh(tg, char.out); o.renderOrder = -1; group.add(o); }
    if (dg) group.add(new THREE.Mesh(dg, char.mat));
    if (gg) group.add(new THREE.Mesh(gg, char.glow));
  }

  /* ================= creatures ================= */
  function buildCreature(cfg, char) {
    const body = char.body;
    if (cfg.rig === 'inkspawn') {
      const s = cfg.big ? 1.5 : 0.95;
      const bn = Bone('blob'), f = F(bn);
      const col = cfg.color || '#1e2444';
      f.put(G.sphere(24), col, 0, 0.44 * s, 0, 0, 0, 0, 0.64 * s, 0.52 * s, 0.58 * s, { grad: [0.45, 1.3] });
      for (let i = 0; i < 7; i++) { const a = (i / 7) * PI * 2 + 0.3; f.put(G.sphere(12), col, Math.cos(a) * 0.52 * s, 0.08 * s, Math.sin(a) * 0.48 * s, 0, 0, 0, 0.25 * s, 0.14 * s, 0.25 * s); }
      for (let i = 0; i < 4; i++) { const a = i * 1.7 + 0.5; f.put(G.sphere(10), shade(col, 0.15), Math.cos(a) * 0.4 * s, (0.7 + (i % 2) * 0.12) * s, Math.sin(a) * 0.3 * s - 0.1 * s, 0, 0, 0, 0.12 * s, 0.14 * s, 0.12 * s); }
      f.shine(-0.22 * s, 0.82 * s, 0.38 * s, 0.18 * s, 0.09 * s, 0.4, -0.5, -0.4);
      f.decal(G.sphere(18), '#04050a', 0, 0.36 * s, 0.52 * s, 0, 0, 0, 0.36 * s, 0.13 * s, 0.1 * s);
      for (let i = 0; i < 9; i++) f.put(G.cone(4), '#f2ecdc', -0.3 * s + i * 0.075 * s, 0.43 * s, 0.56 * s, PI, 0, 0, 0.032 * s, 0.11 * s, 0.03 * s, { grad: false });
      for (let i = 0; i < 6; i++) f.put(G.cone(4), '#e2dccc', -0.2 * s + i * 0.08 * s, 0.28 * s, 0.56 * s, 0, 0, 0, 0.026 * s, 0.08 * s, 0.026 * s, { grad: false });
      const n = cfg.big ? 5 : 3;
      for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 0.42; f.decal(G.sphere(10), '#04050a', Math.sin(a) * 0.48 * s, (0.66 + (i % 2) * 0.08) * s, Math.cos(a) * 0.47 * s, 0, a, 0, 0.1 * s, 0.1 * s, 0.05 * s); f.glow(G.sphere(10), '#e2ecff', Math.sin(a) * 0.5 * s, (0.66 + (i % 2) * 0.08) * s, Math.cos(a) * 0.49 * s, 0, 0, 0, 0.06 * s, 0.06 * s, 0.04 * s, 3.2); }
      const g = new THREE.Group(); body.add(g); addBone(char, g, bn); char.blob = g;
      char.shadow.scale.setScalar(0.8 * s);
    } else if (cfg.rig === 'rat') {
      const col = cfg.color || '#2e2a3a';
      const bn = Bone('rat'), f = F(bn);
      f.put(G.sphere(18), col, 0, 0.3, 0, 0, 0, 0, 0.34, 0.27, 0.5);
      f.put(G.sphere(14), shade(col, 0.22), 0, 0.22, 0.12, 0, 0, 0, 0.25, 0.17, 0.32);
      for (let i = 0; i < 5; i++) f.put(G.cone(5), shade(col, -0.15), (i - 2) * 0.07, 0.54, -0.15 + Math.abs(i - 2) * 0.04, -0.6, 0, (i - 2) * 0.3, 0.05, 0.16, 0.05);
      const tail = Bone('tail'), tf = F(tail);
      for (let i = 0; i < 8; i++) tf.put(G.sphere(6), '#6a5866', 0, 0.025 * i, -0.1 * i, 0, 0, 0, 0.05 - i * 0.005, 0.05 - i * 0.005, 0.08);
      const g = new THREE.Group(); body.add(g); addBone(char, g, bn);
      const hd = new THREE.Group(); hd.position.set(0, 0.34, 0.44); body.add(hd); char.head = hd;
      const hb = Bone('rhead'), hf = F(hb);
      hf.put(G.cone(14), col, 0, 0, 0.13, PI / 2, 0, 0, 0.21, 0.44, 0.21);
      hf.put(G.sphere(8), '#d27a8a', 0, 0, 0.36, 0, 0, 0, 0.05, 0.05, 0.05);
      for (const s of [-1, 1]) { hf.put(G.sphere(12), shade(col, 0.12), s * 0.15, 0.16, -0.03, 0, 0, s * 0.3, 0.12, 0.15, 0.04); hf.decal(G.sphere(10), '#d88a96', s * 0.15, 0.16, -0.01, 0, 0, s * 0.3, 0.07, 0.09, 0.03); hf.decal(G.sphere(8), '#080406', s * 0.09, 0.08, 0.15, 0, s * 0.5, 0, 0.05, 0.05, 0.03); hf.glow(G.sphere(6), '#ff4a3a', s * 0.095, 0.085, 0.165, 0, 0, 0, 0.028, 0.028, 0.02, 3.4); }
      for (const s of [-1, 1]) hf.put(G.cone(4), '#f2ecdc', s * 0.03, -0.07, 0.3, PI, 0, 0, 0.02, 0.07, 0.02, { grad: false });
      for (let i = 0; i < 3; i++) hf.flat(G.cyl(1, 1, 3), '#d8d0c0', 0, -0.02, 0.28, 0, 0, PI / 2 + (i - 1) * 0.25, 0.006, 0.4, 0.006);
      addBone(char, hd, hb);
      const tg = new THREE.Group(); tg.position.set(0, 0.28, -0.46); body.add(tg); addBone(char, tg, tail); char.tail = tg;
      char.legs = [];
      for (const [x, z] of [[-0.2, 0.26], [0.2, 0.26], [-0.21, -0.22], [0.21, -0.22]]) { const l = new THREE.Group(); l.position.set(x, 0.2, z); const lb = Bone('rl'); F(lb).put(G.capsule(0.055, 0.2), col, 0, 0, 0).put(G.sphere(8), '#d27a8a', 0, -0.19, 0.03, 0, 0, 0, 0.055, 0.03, 0.07); addBone(char, l, lb); body.add(l); char.legs.push(l); }
      char.shadow.scale.setScalar(0.5);
    } else if (cfg.rig === 'wolf') {
      const col = cfg.color || '#6a6e78', dk = shade(col, -0.25), lt = shade(col, 0.25);
      const bn = Bone('wolf'), f = F(bn);
      f.put(G.sphere(18), col, 0, 0.62, -0.05, 0, 0, 0, 0.34, 0.32, 0.62, { grad: [0.6, 1.1] });
      f.put(G.sphere(16), lt, 0, 0.6, 0.32, 0, 0, 0, 0.3, 0.34, 0.34);
      for (let i = 0; i < 5; i++) f.put(G.cone(5), dk, (i - 2) * 0.08, 0.92, 0.1 - Math.abs(i - 2) * 0.05, -0.5, 0, (i - 2) * 0.25, 0.07, 0.24, 0.07);
      const g = new THREE.Group(); body.add(g); addBone(char, g, bn);
      const hd = new THREE.Group(); hd.position.set(0, 0.86, 0.6); body.add(hd); char.head = hd;
      const hb = Bone('whead'), hf = F(hb);
      hf.put(G.sphere(16), col, 0, 0, 0, 0, 0, 0, 0.24, 0.22, 0.26);
      hf.put(G.rbox(0.2, 0.16, 0.34, 0.07), lt, 0, -0.06, 0.24);
      hf.put(G.sphere(8), '#141010', 0, -0.02, 0.42, 0, 0, 0, 0.06, 0.05, 0.05);
      for (const sd of [-1, 1]) { hf.put(G.cone(6), col, sd * 0.13, 0.22, -0.05, -0.2, 0, -sd * 0.3, 0.08, 0.2, 0.05); hf.glow(G.sphere(6), cfg.eyes || '#ffd23a', sd * 0.1, 0.06, 0.2, 0, 0, 0, 0.035, 0.03, 0.02, 3); }
      for (let i = 0; i < 4; i++) hf.put(G.cone(4), '#f2ecdc', (i - 1.5) * 0.04, -0.16, 0.36, PI, 0, 0, 0.018, 0.06, 0.018, { grad: false });
      addBone(char, hd, hb);
      const tg = new THREE.Group(); tg.position.set(0, 0.7, -0.6); body.add(tg); const tb = Bone('wtail'); F(tb).put(G.cone(8), col, 0, 0.05, -0.25, -1.1, 0, 0, 0.12, 0.6, 0.12); addBone(char, tg, tb); char.tail = tg;
      char.legs = [];
      for (const [x, z] of [[-0.18, 0.32], [0.18, 0.32], [-0.18, -0.38], [0.18, -0.38]]) { const l = new THREE.Group(); l.position.set(x, 0.5, z); const lb = Bone('wl'); F(lb).put(G.capsule(0.075, 0.48), col, 0, 0, 0).put(G.sphere(8), dk, 0, -0.47, 0.04, 0, 0, 0, 0.09, 0.05, 0.11); addBone(char, l, lb); body.add(l); char.legs.push(l); }
      char.shadow.scale.setScalar(0.62);
    } else if (cfg.rig === 'bird') {
      const col = cfg.color || '#8a6a4a';
      const g = new THREE.Group(); g.position.y = 1.6; body.add(g); char.blob = g;
      const bn = Bone('bird'), f = F(bn);
      f.put(G.sphere(16), col, 0, 0, 0, 0, 0, 0, 0.2, 0.2, 0.34);
      f.put(G.sphere(14), shade(col, 0.3), 0, 0.12, 0.26, 0, 0, 0, 0.15, 0.15, 0.15);
      f.put(G.cone(6), '#e8b030', 0, 0.1, 0.44, PI / 2, 0, 0, 0.05, 0.12, 0.05);
      for (const sd of [-1, 1]) f.decal(G.sphere(6), '#140b06', sd * 0.08, 0.16, 0.36, 0, 0, 0, 0.03, 0.03, 0.02);
      f.put(G.cone(6), shade(col, -0.2), 0, 0, -0.4, -PI / 2, 0, 0, 0.14, 0.3, 0.05);
      addBone(char, g, bn);
      char.wings = [];
      for (const sd of [-1, 1]) { const w = new THREE.Group(); w.position.set(sd * 0.14, 0.06, 0); g.add(w); const wb = Bone('wing'); F(wb).put(G.rbox(0.62, 0.04, 0.28, 0.02), shade(col, -0.1), sd * 0.32, 0, -0.02, 0, 0, 0, 1, 1, 1).put(G.rbox(0.3, 0.035, 0.22, 0.015), shade(col, 0.15), sd * 0.62, 0, -0.06, 0, sd * 0.2, 0, 1, 1, 1); addBone(char, w, wb); char.wings.push({ w, sd }); }
      char.shadow.scale.setScalar(0.3);
    } else if (cfg.rig === 'wisp') {
      const col = cfg.color || '#9fe6ff';
      const g = new THREE.Group(); g.position.y = 1.5; body.add(g); char.blob = g;
      const bn = Bone('wisp'), f = F(bn);
      f.glow(G.sphere(20), col, 0, 0, 0, 0, 0, 0, 0.34, 0.4, 0.34, 1.6);
      f.glow(G.bentCone(-0.5), col, 0, -0.1, 0, PI, 0, 0, 0.3, 0.8, 0.3, 1.2);
      for (const s of [-1, 1]) f.decal(G.sphere(10), '#06101a', s * 0.12, 0.06, 0.31, 0, s * 0.3, 0, 0.08, 0.1, 0.04);
      f.decal(G.sphere(10), '#06101a', 0, -0.13, 0.32, 0, 0, 0, 0.06, 0.1, 0.04);
      addBone(char, g, bn);
      g.add(K3.glowSprite3(col, 2.6, 0.55));
      char.light = col; char.shadow.scale.setScalar(0.35);
    }
  }

  function finish(char) {
    char.mats = [char.mat, char.out, char.glow].concat(char.capeMat ? [char.capeMat] : []);
    return char;
  }

  /* ================= animation ================= */
  function pose(cfg, st, t, p, hitAt) {
    const A = { bob: 0, lean: 0, crouch: 0, aR: 0.25, aL: -0.12, sR: 0, sL: 0, lR: 0, lL: 0, spread: 0, head: 0, twist: 0, glow: 0, spin: 0 };
    const wt = cfg.weapon && cfg.weapon.type;
    const shieldy = cfg.offhand && ['shield', 'kite', 'tome', 'lantern', 'orb'].includes(cfg.offhand.type) && wt !== 'daggers';
    if (shieldy) A.aL = 0.8;
    const idleW = Math.sin(t * 2.4 + (cfg.blinkSeed || 0));
    const H = hitAt || 0.5;
    switch (st) {
      case 'idle': case 'talk':
        A.bob = idleW * 0.016; A.aR = 0.32 + idleW * 0.05; A.aL += -idleW * 0.04; A.head = idleW * 0.03; A.sR = 0.12; A.sL = -0.08; A.spread = 0.06;
        if (wt === 'staff' || wt === 'totem') A.aR = 0.5;
        if (wt === 'crossbow') A.aR = 0.95;
        if (st === 'talk') { A.aR = 0.85 + Math.sin(t * 6) * 0.35; A.head = Math.sin(t * 5) * 0.06; }
        break;
      case 'pose': {
        A.bob = idleW * 0.014; A.spread = 0.16; A.lR = 0.12; A.lL = -0.1; A.twist = 0.12; A.crouch = 0.03;
        if (wt === 'staff' || wt === 'totem') { A.aR = 0.75; A.aL = 1.9; A.sL = -0.4; A.glow = 1; }
        else if (wt === 'bow') { A.aR = 0.9; A.aL = 0.5; A.sR = 0.2; }
        else if (wt === 'crossbow') { A.aR = 1.15; A.aL = 0.9; }
        else if (wt === 'lute') { A.aR = 1.0; A.aL = 1.1; A.sL = 0.5; A.head = Math.sin(t * 4) * 0.05; }
        else if (wt === 'daggers') { A.aR = 1.2; A.aL = 1.0; A.sR = 0.35; A.sL = -0.35; A.crouch = 0.08; A.lean = 0.12; }
        else if (wt === 'greataxe' || wt === 'greatsword' || wt === 'hammer') { A.aR = 2.2; A.sR = 0.25; A.aL = shieldy ? 0.9 : 0.2; A.lean = -0.05; }
        else if (!wt) { A.aR = 1.3; A.aL = 0.7; A.sR = 0.15; A.sL = -0.2; A.crouch = 0.1; A.lR = 0.4; A.lL = -0.3; }
        else { A.aR = 1.15; A.sR = 0.3; A.aL = shieldy ? 1.0 : 0.3; }
        break;
      }
      case 'walk': case 'run': case 'hop': {
        const run = st === 'run', ph = t * (run ? 11.5 : 8);
        A.lR = Math.sin(ph) * (run ? 0.9 : 0.6); A.lL = -A.lR;
        A.bob = Math.abs(Math.sin(ph)) * (run ? 0.08 : 0.05);
        A.aR = 0.3 - Math.sin(ph) * (run ? 0.65 : 0.45); if (!shieldy) A.aL = -0.1 + Math.sin(ph) * (run ? 0.65 : 0.45);
        A.lean = run ? 0.2 : 0.07; A.twist = Math.sin(ph) * 0.1; A.sR = 0.1; A.sL = -0.1;
        break;
      }
      case 'attack': {
        if (p < H * 0.7) { const k = easeOut(p / (H * 0.7)); A.aR = lerp(0.3, 3.55, k); A.lean = -0.14 * k; A.twist = -0.55 * k; A.crouch = 0.05 * k; A.sR = 0.2; }
        else if (p < H * 1.15) { const k = (p - H * 0.7) / (H * 0.45); const e = k * k * (3 - 2 * k); A.aR = lerp(3.55, 0.85, e); A.lean = lerp(-0.14, 0.24, e); A.twist = lerp(-0.55, 0.45, e); A.crouch = lerp(0.05, 0.1, e); A.sR = 0.25; }
        else { const k = (p - H * 1.15) / Math.max(0.01, 1 - H * 1.15); A.aR = lerp(0.85, 0.3, easeOut(k)); A.lean = lerp(0.24, 0, k); A.twist = lerp(0.45, 0, k); A.crouch = lerp(0.1, 0, k); }
        A.lR = 0.4; A.lL = -0.35; A.spread = 0.1; if (!shieldy) A.aL = -0.5;
        break;
      }
      case 'slam': { const k = Math.min(1, p * 1.4); A.aR = lerp(0.3, 3.3, easeOut(k)); A.aL = lerp(A.aL, 3.1, easeOut(k)); A.lean = -0.2 * k; A.crouch = 0.06 * k; break; }
      case 'thrust': {
        if (p < H) { const k = easeOut(p / H); A.aR = lerp(0.6, 0.9, k); A.lean = -0.1 * k; A.twist = -0.35 * k; }
        else if (p < H + 0.15) { const k = (p - H) / 0.15; A.aR = lerp(0.9, 1.7, k); A.lean = lerp(-0.1, 0.28, k); A.twist = lerp(-0.35, 0.45, k); }
        else { const k = clamp((p - H - 0.15) / (0.85 - H), 0, 1); A.aR = lerp(1.7, 0.4, easeOut(k)); A.lean = lerp(0.28, 0, k); A.twist = lerp(0.45, 0, k); }
        A.lR = 0.5; A.lL = -0.35; if (wt === 'daggers') A.aL = A.aR * 0.85;
        break;
      }
      case 'cast': case 'channel': {
        const k = st === 'channel' ? 1 : (p < 0.35 ? easeOut(p / 0.35) : p > 0.78 ? 1 - easeOut((p - 0.78) / 0.22) : 1);
        A.aR = lerp(0.4, 2.45, k); A.lean = -0.1 * k; A.glow = k; A.sR = 0.2 * k;
        if (st === 'channel' || !shieldy) A.aL = lerp(A.aL, 1.95, k);
        if (st === 'channel') A.bob = Math.sin(t * 20) * 0.008;
        break;
      }
      case 'shoot': {
        const k = p < 0.25 ? easeOut(p / 0.25) : 1;
        if (wt === 'bow') { A.aR = lerp(0.4, 1.57, k); A.aL = lerp(0.4, 1.45, k); A.sL = 0.5 * k; A.twist = 0.5 * k; }
        else { A.aR = lerp(0.95, 1.57, k); A.aL = lerp(0.6, 1.45, k); }
        if (p > 0.48 && p < 0.62) A.lean = -0.14;
        break;
      }
      case 'throw': {
        if (p < 0.45) { const k = easeOut(p / 0.45); A.aR = lerp(0.3, 3.6, k); A.lean = -0.15 * k; A.twist = -0.55 * k; }
        else if (p < 0.6) { const k = (p - 0.45) / 0.15; A.aR = lerp(3.6, 1.3, k); A.lean = lerp(-0.15, 0.2, k); A.twist = lerp(-0.55, 0.45, k); }
        else A.aR = lerp(1.3, 0.3, clamp((p - 0.6) / 0.4, 0, 1));
        break;
      }
      case 'spin': A.aR = 1.57; A.aL = 1.57; A.sR = 1.25; A.sL = -1.25; A.crouch = 0.07; A.spin = t * 16; break;
      case 'roar': { const k = Math.min(1, p * 4); A.aR = lerp(0.3, 2.85, k); A.aL = lerp(A.aL, 2.85, k); A.sR = 0.65 * k; A.sL = -0.65 * k; A.lean = -0.28 * k; A.bob = Math.sin(t * 40) * 0.012 * k; break; }
      case 'hurt': A.lean = -0.32 * (1 - p); A.aR = -0.5; A.aL = -0.6; A.head = -0.22 * (1 - p); break;
      case 'stun': A.lean = Math.sin(t * 7) * 0.1; A.aR = 0.1; A.aL = 0.1; A.head = Math.sin(t * 7) * 0.15; A.twist = Math.sin(t * 3.5) * 0.3; break;
      case 'kneel': A.crouch = 0.3; A.lR = 1.45; A.lL = -0.2; A.aR = 0.2; A.head = 0.25; A.lean = 0.12; break;
      case 'point': A.aR = 1.6 + Math.sin(t * 3) * 0.05; A.bob = idleW * 0.012; A.sR = 0.1; break;
      case 'cheer': A.aR = 2.9 + Math.sin(t * 9) * 0.15; A.aL = 2.8 - Math.sin(t * 9) * 0.15; A.sR = 0.35; A.sL = -0.35; A.bob = Math.abs(Math.sin(t * 9)) * 0.09; break;
      case 'sit': A.crouch = 0.44; A.lR = 1.5; A.lL = 1.45; A.aR = 0.5; A.aL = 0.45; A.bob = idleW * 0.008; break;
      case 'cower': A.crouch = 0.17; A.aR = 2.5; A.aL = 2.4; A.lean = -0.16; A.head = 0.2; A.bob = Math.sin(t * 30) * 0.006; break;
      case 'dead': A.aR = -0.4; A.aL = -0.9; break;
      default: break;
    }
    return A;
  }

  const _tv = new THREE.Vector3();
  function animate(char, o, dt) {
    const cfg = char.cfg;
    char.t += dt;
    const t = o.t != null ? o.t : char.t;
    const root = char.root;
    root.position.set(o.x, o.h || 0, o.z);
    if (o.yaw != null) { let d = o.yaw - root.rotation.y; while (d > PI) d -= PI * 2; while (d < -PI) d += PI * 2; root.rotation.y += o.snap ? d : d * Math.min(1, dt * 14); }
    root.scale.setScalar((cfg.scale || 1) * (o.scale || 1));
    // flash / tint / fade
    const flash = o.flash || 0, tintA = o.tintA || 0, alpha = o.alpha == null ? 1 : o.alpha;
    if (flash > 0.01) char.mat.emissive.setRGB(flash, flash * 0.95, flash * 0.9);
    else if (tintA > 0.01) char.mat.emissive.set(o.tint).multiplyScalar(tintA * 0.7);
    else char.mat.emissive.setRGB(0, 0, 0);
    if (char.capeMat) char.capeMat.emissive.copy(char.mat.emissive);
    if (alpha < 0.999 || char._faded) {
      const tr = alpha < 0.999;
      for (const m of char.mats) { m.transparent = tr; m.opacity = alpha; if (m.uniforms && m.uniforms.opacity) m.uniforms.opacity.value = alpha; m.depthWrite = alpha > 0.5; }
      char._faded = tr; char.shadow.material.opacity = alpha;
    }
    if (o.rim) char.mat.userData.rim.value.set(o.rim);
    if (o.dead != null && o.dead > 0) {
      const k = easeOut(Math.min(1, o.dead));
      if (cfg.rig === 'inkspawn') { char.body.rotation.x = 0; char.body.scale.set(1 + k * 0.7, Math.max(0.05, 1 - k * 0.9), 1 + k * 0.7); return; }
      char.body.rotation.x = -k * 1.45; char.body.position.y = 0;
      return;
    }
    if (cfg.rig === 'inkspawn') return animInk(char, o, t);
    if (cfg.rig === 'rat') return animRat(char, o, t);
    if (cfg.rig === 'wisp') { char.blob.position.y = 1.5 + Math.sin(t * 2.3) * 0.15; char.blob.rotation.y = Math.sin(t) * 0.3; return; }
    if (cfg.rig === 'wolf') return animRat(char, Object.assign({}, o, { wolf: true }), t);
    if (cfg.rig === 'bird') { const atk = o.state === 'attack' ? Math.sin((o.p || 0) * PI) : 0; char.blob.position.y = 1.6 - atk * 1.1 + Math.sin(t * 3) * 0.08; char.blob.rotation.x = atk * 0.8; for (const { w, sd } of char.wings) w.rotation.z = sd * Math.sin(t * (atk ? 8 : 14)) * 0.7; return; }
    const A = pose(cfg, o.state || 'idle', t, o.p || 0, o.hitAt);
    const B = char.body;
    B.position.y = A.bob - A.crouch;
    B.rotation.set(A.lean + (o.lean || 0), A.twist + A.spin, 0);
    char.armR.sh.rotation.set(-A.aR, 0, 0.16 + A.sR * 0.55);
    char.armL.sh.rotation.set(-A.aL, 0, -0.16 + A.sL * 0.55);
    if (char.legs) { char.legs[1].rotation.set(-A.lR, 0, A.spread); char.legs[0].rotation.set(-A.lL, 0, -A.spread); }
    char.head.rotation.x = A.head + (cfg.hunch ? -0.3 * cfg.hunch : 0);
    if (char.wSock) {
      const wt = cfg.weapon.type;
      let gx = 1.25, gz = 0;
      if (wt === 'staff' || wt === 'broom' || wt === 'totem' || wt === 'shovel' || wt === 'scythe') gx = A.aR * 0.6;
      else if (wt === 'spear') gx = 1.57;
      else if (wt === 'crossbow') gx = A.aR > 1.2 ? 1.57 : 1.3;
      else if (wt === 'bow') { gx = 0.15; }
      else if (wt === 'sling') gx = o.state === 'attack' ? t * 20 : 0;
      else if (wt === 'lute') { gx = 1.3; gz = 1.1; }
      else if (wt === 'candle' || wt === 'cards' || wt === 'mirror') gx = 1.25;
      else if (wt === 'daggers' || wt === 'knife') gx = 1.45;
      char.wSock.rotation.set(gx, wt === 'bow' ? PI / 2 : 0, gz);
      if (char.wSock2) char.wSock2.rotation.set(1.45, 0, 0);
    }
    if (char.oSock) { const ot = cfg.offhand.type; char.oSock.rotation.set(ot === 'lantern' ? A.aL : 0.85, 0, 0); }
    // blink: squash the eye group about the eye line
    char.blinkT -= dt;
    if (char.eyesG && !char.glowEyes) {
      let sy = 1;
      if (char.blinkT < 0) { sy = 0.1; if (char.blinkT < -0.11) char.blinkT = 2 + Math.random() * 3.5; }
      if (o.state === 'hurt' || o.state === 'stun') sy = 0.12;
      if (o.blink != null) sy = o.blink;
      char.eyesG.scale.y = sy; char.eyesG.position.y = char.eyeY * (1 - sy);
    }
    if (char.cape) {
      const pos = char.cape.geometry.attributes.position, base = char.capeBase;
      const sp = clamp((o.speed || 0) / 200, 0, 1.4);
      for (let i = 0; i < pos.count; i++) {
        const by = base[i * 3 + 1], k = -by;
        pos.array[i * 3 + 2] = base[i * 3 + 2] - k * k * (0.28 + sp * 0.85) - Math.sin(t * 3 + k * 4 + base[i * 3] * 3) * 0.05 * k;
        pos.array[i * 3 + 1] = by + k * k * sp * 0.22;
      }
      pos.needsUpdate = true;
      char.cape.rotation.x = A.lean * -0.6;
    }
    if (char.plume) char.plume.rotation.x = Math.sin(t * 3) * 0.08 - clamp((o.speed || 0) / 400, 0, 0.5);
    if (o.wantTip && char.wSock) { char.wSock.updateWorldMatrix(true, false); _tv.copy(char.tip0).applyMatrix4(char.wSock.matrixWorld); char.tip = _tv.clone(); } else char.tip = null;
  }
  function animInk(char, o, t) {
    const hop = o.hop || 0, air = Math.sin(hop * PI);
    const atk = o.state === 'attack' ? Math.sin((o.p || 0) * PI) : 0;
    const sq = hop > 0 ? (air > 0.2 ? 0.84 : 1.16) : 1 + Math.sin(t * 3.4) * 0.05;
    char.body.position.y = air * (char.cfg.big ? 0.5 : 0.8);
    char.body.rotation.x = 0;
    char.body.scale.set(1 / Math.sqrt(sq) + atk * 0.14, sq + atk * 0.22, 1 / Math.sqrt(sq) + atk * 0.14);
    char.blob.rotation.y = Math.sin(t * 2) * 0.12;
    char.shadow.scale.setScalar((char.cfg.big ? 1.2 : 0.76) * (1 - air * 0.35));
  }
  function animRat(char, o, t) {
    const run = o.state === 'walk' || o.state === 'run';
    const f = o.wolf ? 14 : 22;
    char.body.position.y = run ? Math.abs(Math.sin(t * f)) * (o.wolf ? 0.08 : 0.05) : 0;
    if (o.wolf && char.legs) { char.legs.forEach((l, i) => { l.rotation.x = run ? Math.sin(t * f + (i % 2 ? 0 : PI) + (i > 1 ? 0.6 : 0)) * 0.7 : (o.state === 'attack' ? -0.3 : 0); }); if (char.tail) char.tail.rotation.y = Math.sin(t * 6) * 0.4; if (char.head) char.head.rotation.x = o.state === 'attack' ? Math.sin((o.p || 0) * PI) * 0.4 : Math.sin(t * 2) * 0.04; return; }
    char.body.rotation.x = 0;
    if (char.legs) char.legs.forEach((l, i) => { l.rotation.x = run ? Math.sin(t * 22 + i * 1.6) * 0.8 : 0; });
    if (char.tail) char.tail.rotation.y = Math.sin(t * 8) * 0.5;
    if (char.head) char.head.rotation.x = o.state === 'attack' ? -Math.sin((o.p || 0) * PI) * 0.5 : Math.sin(t * 5) * 0.05;
  }
  function setOutlineK(k) { OUTLINE.k.value = k; }
  function dispose(char) {
    if (char.root.parent) char.root.parent.remove(char.root);
    const seen = new Set();
    char.root.traverse((o) => { if (o !== char.shadow && o.geometry && !seen.has(o.geometry) && ![...NI.values()].includes(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); } });
    char.mats.forEach((m) => m.dispose()); char.shadow.material.dispose();
  }
  /* shared style kit so props/scenery match the characters */
  const propMats = (() => { let m = null; return () => m || (m = { mat: toonMat(), out: outlineMat(), glow: glowMatV() }); })();
  function prop(build) { const bone = Bone('prop'); build(F(bone)); const g = new THREE.Group(); addBone(propMats(), g, bone); return g; }

  return { build, animate, pose, dispose, setOutlineK, OUTLINE, G, F, Bone, prop, propMats, toonMat };
})();
