/* ==========================================================================
   R3 - the WebGL view: renderer, bloom + grade, cameras, lights, story actors
   ========================================================================== */
const R3 = {
  ok: false, mode: 'book', world: null, worldKind: null, actors: [], t: 0,
  cam: null, camCur: null, camTo: null, camK: 1, shake: 0, zoom: 0, w: 1, h: 1,
  init(host) {
    if (!HAS3D) return false;
    try {
      const cv = document.createElement('canvas'); cv.id = 'gl'; host.appendChild(cv);
      const ren = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
      ren.outputEncoding = THREE.sRGBEncoding; ren.toneMapping = THREE.ACESFilmicToneMapping; ren.toneMappingExposure = 1.0;
      ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      this.ren = ren; this.host = host; this.canvas = cv;
    } catch (e) { console.warn('WebGL failed', e); return false; }
    const sc = this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(32, 1, 0.1, 220);
    this.hemi = new THREE.HemisphereLight(0x9a90c8, 0x3a3028, 0.6); sc.add(this.hemi);
    this.key = new THREE.DirectionalLight(0xc8c4ff, 0.9); this.key.position.set(-6, 10, 4); sc.add(this.key); sc.add(this.key.target);
    this.rimL = new THREE.DirectionalLight(0x8090c0, 0.25); this.rimL.position.set(5, 4, -8); sc.add(this.rimL);
    this.pool = [];
    for (let i = 0; i < 7; i++) { const l = new THREE.PointLight(0xffffff, 0, 8, 2); l.position.set(0, -50, 0); sc.add(l); this.pool.push(l); }
    this.stage = new THREE.Group(); sc.add(this.stage);
    this.fxRoot = new THREE.Group(); sc.add(this.fxRoot);
    this.camCur = { pos: new THREE.Vector3(0, 3.4, 13), look: new THREE.Vector3(0, 1.1, -0.5), fov: 30 };
    this.camTo = { pos: this.camCur.pos.clone(), look: this.camCur.look.clone(), fov: 30 };
    this.setupPost();
    this.ok = true;
    return true;
  },
  setupPost() {
    if (!THREE.EffectComposer || !THREE.UnrealBloomPass) { this.composer = null; return; }
    const ren = this.ren;
    let rt;
    if (ren.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget) { rt = new THREE.WebGLMultisampleRenderTarget(4, 4, { format: THREE.RGBAFormat }); rt.samples = 4; }
    const comp = new THREE.EffectComposer(ren, rt);
    comp.addPass(new THREE.RenderPass(this.scene, this.cam));
    this.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.45, 0.78);
    comp.addPass(this.bloom);
    this.grade = new THREE.ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVig: { value: 0.75 }, uSepia: { value: 0 }, uTint: { value: new THREE.Color(1, 1, 1) }, uFlash: { value: 0 }, uGrey: { value: 0 }, uHurt: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: [
        'uniform sampler2D tDiffuse; uniform float uTime, uVig, uSepia, uFlash, uGrey, uHurt; uniform vec3 uTint; uniform vec2 uRes; varying vec2 vUv;',
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
        'void main(){',
        '  vec3 c = texture2D(tDiffuse, vUv).rgb;',
        '  float l = dot(c, vec3(0.299,0.587,0.114));',
        '  c = mix(c, vec3(l), 0.08);',
        '  c = (c - 0.5) * 1.06 + 0.5;',
        '  vec3 shadowT = vec3(0.9,0.95,1.12), hiT = vec3(1.07,1.0,0.9);',
        '  c *= mix(shadowT, hiT, smoothstep(0.1,0.7,l));',
        '  c *= uTint;',
        '  vec3 sep = vec3(l*1.08, l*0.92, l*0.72);',
        '  c = mix(c, sep, uSepia);',
        '  c = mix(c, vec3(l*0.9), uGrey);',
        '  vec2 d = vUv - 0.5; d.x *= uRes.x / uRes.y * 0.75;',
        '  float v = smoothstep(0.85, 0.2, length(d));',
        '  c *= mix(1.0 - uVig * 0.55, 1.0, v);',
        '  c = mix(c, vec3(0.6,0.04,0.02), uHurt * (1.0 - v) * 0.8);',
        '  c += uFlash;',
        '  c += (hash(vUv * uRes + uTime) - 0.5) * 0.016;',
        '  gl_FragColor = linearToOutputTexel(vec4(max(c, 0.0), 1.0));',
        '}',
      ].join('\n'),
    });
    comp.addPass(this.grade);
    this.composer = comp;
  },
  resize(w, h) {
    w = Math.max(2, Math.round(w)); h = Math.max(2, Math.round(h));
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.ren.setSize(w, h, false);
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.cam.aspect = w / h; this.cam.updateProjectionMatrix();
    if (this.composer) { this.composer.setSize(w, h); this.bloom.resolution.set(w / 2, h / 2); this.grade.uniforms.uRes.value.set(w, h); }
  },

  /* ---------------- world ---------------- */
  setWorld(kind) {
    if (kind === this.worldKind) return;
    if (this.world) { this.stage.remove(this.world.root); this.world.dispose(); }
    this.worldKind = kind;
    this.world = World.build(kind);
    this.stage.add(this.world.root);
    const S = this.world.S;
    this.scene.fog = new THREE.Fog(S.fog[0], S.fog[1], S.fog[2]);
    this.scene.background = new THREE.Color(S.fog[0]);
    this.hemi.color.set(S.hemi[0]); this.hemi.groundColor.set(S.hemi[1]); this.hemi.intensity = S.hemi[2] * 1.05;
    this.key.color.set(S.key[0]); this.key.intensity = S.key[1]; this.key.position.set(S.key[2] || -6, S.key[3] || 10, S.key[4] || 4);
    this.rimL.color.set(S.tint || '#8090c0');
    this.staticLights = this.world.lights.slice(0, 4);
    this.fogMode();
  },

  /* ---------------- story actors ---------------- */
  setActors(list, st) {
    const want = (list || []).map((a, i) => ({ a, key: a.who + '|' + i + '|' + (a.who === 'hero' ? JSON.stringify(heroCfg(st)) : '') }));
    const keep = [];
    for (const old of this.actors) { const m = want.find((w) => !w.used && w.key === old.key); if (m) { m.used = true; old.a = m.a; keep.push(old); } else this.dropActor(old); }
    for (const w of want) {
      if (w.used) continue;
      const a = w.a; let obj;
      if (a.who === 'tassel') { obj = World.tassel(); }
      else {
        let cfg = null;
        if (a.who === 'hero') cfg = heroCfg(st);
        else if (a.who.startsWith('e:')) cfg = (ENEMIES[a.who.slice(2)] || {}).cfg;
        else cfg = CAST[a.who];
        if (!cfg || !cfg.rig) continue;
        obj = M3.build(cfg);
        obj.isChar = true;
      }
      obj.key = w.key; obj.a = a; obj.t0 = Math.random() * 10;
      this.stage.add(obj.root);
      keep.push(obj);
    }
    this.actors = keep;
  },
  dropActor(o) { if (o.isChar) M3.dispose(o); else this.stage.remove(o.root); },
  clearActors() { for (const o of this.actors) this.dropActor(o); this.actors = []; },
  animActors(dt) {
    for (const o of this.actors) {
      const a = o.a, x = wx(LW / 2 + (a.dx || 0)), z = wz(a.y || 450);
      if (!o.isChar) { o.animate({ x, z, h: a.who === 'tassel' ? 1.9 : 1.6 }, this.t + o.t0); continue; }
      const yaw = (a.f || 1) > 0 ? 0.62 : -0.62;
      M3.animate(o, { x, z, yaw, snap: !o._placed, state: a.st || 'idle', p: (this.t * 0.6) % 1, alpha: a.alpha, flash: 0 }, dt);
      o._placed = true;
    }
  },

  /* ---------------- camera ---------------- */
  bookCam(aspect) {
    // frame the actors' strip from slightly above, like an illustration plate
    const wide = aspect > 1.15;
    return { pos: new THREE.Vector3(0, wide ? 3.7 : 4.4, wide ? 15.2 : 18), look: new THREE.Vector3(0, 1.0, -0.6), fov: wide ? 30 : 34 };
  },
  battleCam(aspect) {
    const fov = 34, halfW = 9.3, t = Math.tan((fov * Math.PI / 180) / 2) * Math.max(0.9, aspect);
    const d = Math.max(13, halfW / t);
    const pitch = 0.74;
    return { pos: new THREE.Vector3(0, Math.sin(pitch) * d + 0.6, Math.cos(pitch) * d + 0.4), look: new THREE.Vector3(0, 0.6, -0.4), fov };
  },
  setMode(mode, instant) {
    this.mode = mode;
    const asp = this.w / this.h;
    this.camTo = mode === 'battle' ? this.battleCam(asp) : this.bookCam(asp);
    this.camK = instant ? 1 : 0;
    if (instant) { this.camCur.pos.copy(this.camTo.pos); this.camCur.look.copy(this.camTo.look); this.camCur.fov = this.camTo.fov; }
    if (this.grade) this.grade.uniforms.uSepia.value = mode === 'book' ? 0.12 : 0;
    this.fogMode();
  },
  fogMode() { if (!this.world || !this.scene.fog) return; const F = this.world.S.fog; this.scene.fog.near = F[1] * (this.mode === 'battle' ? 1.6 : 1); this.scene.fog.far = F[2] * (this.mode === 'battle' ? 1.5 : 1); },
  updateCam(dt) {
    const asp = this.w / this.h;
    const target = this.mode === 'battle' ? this.battleCam(asp) : this.bookCam(asp);
    this.camTo = target;
    const k = 1 - Math.pow(0.02, dt * 1.6);
    this.camCur.pos.lerp(this.camTo.pos, k); this.camCur.look.lerp(this.camTo.look, k); this.camCur.fov = lerp(this.camCur.fov, this.camTo.fov, k);
    const c = this.cam;
    c.position.copy(this.camCur.pos);
    if (this.mode === 'book') { c.position.x += Math.sin(this.t * 0.17) * 0.25; c.position.y += Math.sin(this.t * 0.23) * 0.08; }
    if (this.shake > 0) { c.position.x += (Math.random() - 0.5) * this.shake * 0.35; c.position.y += (Math.random() - 0.5) * this.shake * 0.25; }
    const fov = this.camCur.fov * (1 - this.zoom * 2.2);
    if (Math.abs(c.fov - fov) > 0.001) { c.fov = fov; c.updateProjectionMatrix(); }
    c.lookAt(this.camCur.look);
  },

  /* ---------------- lights: statics + dynamic list [{x,y,z,c,i,d}] ---------------- */
  applyLights(dyn) {
    const all = (this.staticLights || []).map((l) => ({ x: l.pos.x, y: l.pos.y, z: l.pos.z, c: l.c, i: l.i * (1 + (l.flicker ? (Math.sin(this.t * 11 + l.pos.x) * 0.5 + Math.sin(this.t * 17.3) * 0.5) * l.flicker : 0)), d: l.d })).concat(dyn || []);
    for (let i = 0; i < this.pool.length; i++) {
      const L = this.pool[i], s = all[i];
      if (!s) { L.intensity = 0; continue; }
      L.position.set(s.x, s.y, s.z); L.color.set(s.c); L.intensity = s.i * 1.6; L.distance = s.d || 8;
    }
  },

  /* ---------------- frame ---------------- */
  render(dt, dynLights) {
    if (!this.ok) return;
    this.t += dt;
    if (this.world) this.world.update(this.t, dt);
    this.updateCam(dt);
    this.applyLights(dynLights);
    if (this.composer) { this.grade.uniforms.uTime.value = this.t % 100; this.composer.render(dt); }
    else this.ren.render(this.scene, this.cam);
  },
  /* copy the current frame into a plain canvas (used by the page turn) */
  snapshot() {
    const c = document.createElement('canvas'); c.width = this.canvas.width; c.height = this.canvas.height;
    try { c.getContext('2d').drawImage(this.canvas, 0, 0); } catch (e) { /* tainted or lost context */ }
    c.className = 'shot'; return c;
  },
  /* settle the camera and actors on a freshly set scene and draw one frame */
  warm() { this.setMode('book', true); this.animActors(0.016); this.render(0.016, []); },
  setFx(o) { if (!this.grade) return; const u = this.grade.uniforms; for (const k in o) if (u[k]) u[k].value = o[k]; },

  /* project a world point to CSS px inside the view */
  _v: null,
  project(X, Y, Z) {
    const v = this._v || (this._v = new THREE.Vector3());
    v.set(X, Y, Z).project(this.cam);
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h, behind: v.z > 1 };
  },
  /* ray from CSS px to the ground plane, back in logic coords */
  groundAt(px, py) {
    const v = new THREE.Vector3((px / this.w) * 2 - 1, -(py / this.h) * 2 + 1, 0.5).unproject(this.cam);
    const dir = v.sub(this.cam.position).normalize();
    if (Math.abs(dir.y) < 1e-4) return null;
    const t = -this.cam.position.y / dir.y; if (t < 0) return null;
    const p = this.cam.position.clone().add(dir.multiplyScalar(t));
    return fromWorld(p.x, p.z);
  },
};
