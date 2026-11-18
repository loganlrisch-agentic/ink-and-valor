/* ==========================================================================
   Renderer - canvas sizing, background cache, dynamic night lighting
   ========================================================================== */
const R = {
  canvas: null, ctx: null, W: 960, H: 600, px: 1,
  bgCanvas: null, bgKey: '',
  lightCanvas: null, lightCtx: null,
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bgCanvas = document.createElement('canvas');
    this.lightCanvas = document.createElement('canvas');
    this.lightCtx = this.lightCanvas.getContext('2d');
  },
  /* cssW/cssH: on-screen size in CSS px; logical width follows the aspect */
  resize(cssW, cssH, logicalW) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pw = Math.round(cssW * dpr), ph = Math.round(cssH * dpr);
    const maxPx = 2600000;
    if (pw * ph > maxPx) { const k = Math.sqrt(maxPx / (pw * ph)); pw = Math.round(pw * k); ph = Math.round(ph * k); }
    this.W = logicalW; this.H = 600;
    if (this.canvas.width !== pw || this.canvas.height !== ph) { this.canvas.width = pw; this.canvas.height = ph; }
    this.px = ph / 600;
    this.canvas.style.width = cssW + 'px'; this.canvas.style.height = cssH + 'px';
    this.lightCanvas.width = Math.ceil(this.W * 0.5); this.lightCanvas.height = 300;
    this.bgKey = '';
  },
  begin() {
    const c = this.ctx;
    c.setTransform(this.px, 0, 0, this.px, 0, 0);
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.lineJoin = 'round'; c.lineCap = 'round';
    return c;
  },
  background(sceneId) {
    const key = sceneId + '|' + this.canvas.width + 'x' + this.canvas.height + '|' + this.W;
    if (key !== this.bgKey) {
      const sc = SCENES[sceneId] || SCENES.blank;
      this.bgCanvas.width = this.canvas.width; this.bgCanvas.height = this.canvas.height;
      const g = this.bgCanvas.getContext('2d');
      g.setTransform(this.px, 0, 0, this.px, 0, 0);
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.clearRect(0, 0, this.W, 600);
      const pl = LINE; LINE = 3;
      try { sc.paint(g, this.W); } catch (e) { console.error('paint', sceneId, e); }
      LINE = pl;
      gradeBackground(g, this.W, sc);
      this.bgKey = key;
    }
    return this.bgCanvas;
  },
  drawBackground(ctx, sceneId) {
    const bg = this.background(sceneId);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bg, 0, 0); ctx.restore();
  },
  /* darkness with light cut-outs, then a soft coloured glow pass */
  lighting(ctx, sceneId, dyn, t, darkMul) {
    const sc = SCENES[sceneId] || SCENES.blank;
    const dark = (sc.dark || 0) * (darkMul == null ? 1 : darkMul);
    const lights = (sc.lights ? sc.lights(this.W) : []).concat(dyn || []);
    if (dark > 0.01) {
      const l = this.lightCtx;
      l.setTransform(0.5, 0, 0, 0.5, 0, 0);
      l.globalCompositeOperation = 'source-over';
      l.clearRect(0, 0, this.W, 600);
      l.fillStyle = sc.darkColor || `rgba(4,6,20,${dark})`;
      if (sc.darkColor) l.globalAlpha = dark;
      l.fillRect(0, 0, this.W, 600);
      l.globalAlpha = 1;
      l.globalCompositeOperation = 'destination-out';
      const spr = glowSprite('#ffffff');
      for (const L of lights) {
        const fl = L.f ? 1 + Math.sin(t * 11 + L.x * 0.37) * 0.05 + Math.sin(t * 23 + L.y) * 0.03 : 1;
        const r = L.r * fl * 1.15;
        l.globalAlpha = clamp((L.a == null ? 0.8 : L.a) * 1.1, 0, 1);
        l.drawImage(spr, L.x - r, L.y - r, r * 2, r * 2);
      }
      l.globalAlpha = 1; l.globalCompositeOperation = 'source-over';
      ctx.drawImage(this.lightCanvas, 0, 0, this.W, 600);
    }
    for (const L of lights) {
      if (L.noGlow) continue;
      const fl = L.f ? 1 + Math.sin(t * 11 + L.x * 0.37) * 0.06 : 1;
      glow(ctx, L.x, L.y, L.r * 0.55 * fl, L.c || '#f2a541', (L.a == null ? 0.8 : L.a) * 0.22);
    }
  },
};

/* 2010 look: split-tone grade (teal shadows, amber highlights) + painterly grain, baked into the background */
let _grainTex = null;
function grainTexture() {
  if (_grainTex) return _grainTex;
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), img = g.createImageData(256, 256), r = mulberry32(77);
  for (let i = 0; i < img.data.length; i += 4) { const v = 110 + r() * 145; img.data[i] = v; img.data[i + 1] = v * 0.97; img.data[i + 2] = v * 0.92; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  // soft brush blotches
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${r() > 0.5 ? '255,240,210' : '40,30,20'},${0.05 + r() * 0.07})`; g.beginPath(); g.ellipse(r() * 256, r() * 256, 10 + r() * 40, 6 + r() * 20, r() * 3, 0, TAU); g.fill(); }
  return (_grainTex = c);
}
function gradeBackground(g, W, sc) {
  if (sc.noGrade) return;
  g.save();
  try {
    g.globalCompositeOperation = 'soft-light';
    g.fillStyle = grad(g, 0, 0, 0, 600, [[0, sc.warm ? 'rgba(255,190,120,0.55)' : 'rgba(40,90,110,0.55)'], [0.55, 'rgba(120,90,60,0.25)'], [1, 'rgba(110,60,25,0.6)']]);
    g.fillRect(0, 0, W, 600);
    g.globalCompositeOperation = 'multiply';
    g.globalAlpha = 0.16;
    const pat = g.createPattern(grainTexture(), 'repeat');
    g.fillStyle = pat; g.fillRect(0, 0, W, 600);
  } catch (e) { /* older browsers: skip grade */ }
  g.restore();
}
