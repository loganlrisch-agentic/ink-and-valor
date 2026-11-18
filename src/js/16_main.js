/* ==========================================================================
   Game - boot, layout (book spread <-> battle), loop, input, saves, modals
   ========================================================================== */
const SAVE_KEY = 'inkvalor.save.v3';
const Game = {
  st: null, mode: 'title', rect: null, rectTo: null, last: 0,
  /* progress autosaves to this browser after every page, battle, purchase and level-up */
  save() {
    if (!this.st) return;
    try {
      this.st.meta.savedAt = Date.now();
      const prev = localStorage.getItem(SAVE_KEY);
      if (prev) localStorage.setItem(SAVE_KEY + '.bak', prev);
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.st));
      if (!this._persist && navigator.storage && navigator.storage.persist) { this._persist = true; navigator.storage.persist().catch(() => {}); }
      const el = document.getElementById('saved'); if (el) { el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }
    } catch (e) { /* storage blocked: the game still plays, it just won't remember */ }
  },
  peek() { for (const k of [SAVE_KEY, SAVE_KEY + '.bak']) { try { const s = JSON.parse(localStorage.getItem(k)); if (s && s.v === 3 && s.hero && s.run) return s; } catch (e) { /* try backup */ } } return null; },
  hasSave() { return !!this.peek(); },
  load() { const s = this.peek(); if (s) { this.st = s; return true; } return false; },
  exportCode() { return 'IV1.' + btoa(unescape(encodeURIComponent(JSON.stringify(this.st || this.peek())))); },
  importCode(code) {
    const s = JSON.parse(decodeURIComponent(escape(atob(String(code).trim().replace(/^IV1\./, '').replace(/\s+/g, '')))));
    if (!s || s.v !== 3 || !s.hero || !s.run) throw new Error('not a save');
    this.st = s; this.save(); return s;
  },
  saveCodeModal() {
    const has = this.st || this.peek();
    const m = this.modal(`<h2>Save Code</h2><p class="sub">Your progress saves itself in this browser as you play. To carry it to another device or browser, copy this code there and choose <b>Load a save code</b>.</p>
      ${has ? `<textarea id="scOut" readonly rows="4">${this.exportCode()}</textarea><button class="btn sm" id="scCopy">Copy code</button>` : '<p class="none">No saved hero yet.</p>'}
      <h4>Load a save code</h4><textarea id="scIn" rows="3" placeholder="Paste a code that starts with IV1."></textarea><button class="btn sm ghost" id="scLoad">Load this save</button><p class="scmsg"></p>`);
    const msg = m.querySelector('.scmsg');
    const cp = m.querySelector('#scCopy');
    if (cp) cp.addEventListener('click', () => { const ta = m.querySelector('#scOut'); ta.select(); const done = () => { msg.textContent = 'Copied.'; }; try { navigator.clipboard.writeText(ta.value).then(done, () => { document.execCommand('copy'); done(); }); } catch (e) { document.execCommand('copy'); done(); } });
    m.querySelector('#scLoad').addEventListener('click', () => { try { const s = this.importCode(m.querySelector('#scIn').value); msg.textContent = `Loaded ${s.hero.name}, level ${s.hero.level}.`; setTimeout(() => { this.closeModal(); Book.showTitle(); }, 700); } catch (e) { msg.textContent = 'That code did not work. Check it was copied whole.'; } });
  },

  boot() {
    const app = document.getElementById('app');
    if (!R3.init(document.getElementById('view'))) {
      app.innerHTML = '<div class="nogl"><h1>Ink &amp; Valor</h1><p>This book needs WebGL to show its pictures. Try a recent Chrome, Safari or Firefox.</p></div>';
      return;
    }
    window.addEventListener('resize', () => this.layout(true));
    this.bindInput();
    this.layout(true);
    R3.setMode('title', true);
    Book.showTitle();
    const hot = window.claude && window.claude.hot;
    if (hot && hot.snapshot) try { hot.snapshot(() => ({ st: this.st })); } catch (e) { /* */ }
    requestAnimationFrame((t) => this.loop(t));
  },

  setMode(m) {
    this.mode = m;
    const app = document.getElementById('app');
    app.dataset.mode = m;
    R3.setMode(m === 'battle' ? 'battle' : m === 'title' ? 'book' : 'book');
    this.layout();
  },

  /* fit the open book to the window; work out where the 3D view sits */
  layout(snap) {
    const app = document.getElementById('app'), book = document.getElementById('book');
    const W = window.innerWidth, H = window.innerHeight;
    const portrait = W / H < 0.95;
    app.classList.toggle('portrait', portrait);
    let bw, bh;
    if (portrait) { bw = W; bh = H; }
    else { const asp = 1.6; bw = Math.min(W - 24, (H - 24) * asp, 1720); bh = bw / asp; }
    book.style.width = bw + 'px'; book.style.height = bh + 'px';
    book.style.left = ((W - bw) / 2) + 'px'; book.style.top = ((H - bh) / 2) + 'px';
    const fs = portrait ? Math.max(14, Math.min(17, W / 26)) : Math.max(12.5, Math.min(19, bw / 78));
    document.documentElement.style.setProperty('--fs', fs + 'px');
    this.rectTo = this.viewRect();
    if (snap || !this.rect) this.rect = Object.assign({}, this.rectTo);
  },
  viewRect() {
    const W = window.innerWidth, H = window.innerHeight;
    if (this.mode === 'title') return { x: 0, y: 0, w: W, h: H };
    const book = document.getElementById('book').getBoundingClientRect();
    if (this.mode === 'battle') { const portrait = W / H < 0.95; if (portrait) return { x: 0, y: 0, w: W, h: H }; const pad = book.width * 0.012; return { x: book.left + pad, y: book.top + pad, w: book.width - pad * 2, h: book.height - pad * 2 }; }
    const pl = document.getElementById('plate').getBoundingClientRect();
    return { x: pl.left, y: pl.top, w: pl.width, h: pl.height };
  },
  applyRect(dt) {
    const v = document.getElementById('view');
    const T = this.viewRect(); this.rectTo = T;
    const k = 1 - Math.pow(0.0008, dt);
    const r = this.rect;
    for (const key of ['x', 'y', 'w', 'h']) { r[key] = lerp(r[key], T[key], k); if (Math.abs(r[key] - T[key]) < 0.5) r[key] = T[key]; }
    v.style.transform = `translate(${r.x}px, ${r.y}px)`;
    v.style.width = r.w + 'px'; v.style.height = r.h + 'px';
    R3.resize(r.w, r.h);
    const pf = document.getElementById('plateFrame');
    pf.style.transform = `translate(${r.x}px, ${r.y}px)`; pf.style.width = r.w + 'px'; pf.style.height = r.h + 'px';
  },

  loop(t) {
    const dt = Math.min(0.05, Math.max(0.001, (t - (this.last || t)) / 1000)); this.last = t;
    try {
      this.applyRect(dt);
      if (Battle.active && Battle.b) Battle.frame(dt);
      else { R3.animActors(dt); R3.render(dt, []); }
    } catch (e) { console.error(e); }
    requestAnimationFrame((tt) => this.loop(tt));
  },

  bindInput() {
    const v = document.getElementById('view');
    v.addEventListener('pointerdown', (e) => {
      if (!Battle.active || !Battle.b) return;
      const r = v.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      const foe = BView.pickFoe(Battle.b, px, py);
      if (foe) Battle.tap(foe.x, foe.y, foe);
      else { const g = R3.groundAt(px, py); if (g) Battle.tap(g.x, g.y, null); }
      e.preventDefault();
    });
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (Battle.active) {
        if (e.key >= '1' && e.key <= '5') { Battle.useSkill(+e.key - 1); e.preventDefault(); }
        const pi = { q: 0, w: 1, e: 2 }[e.key.toLowerCase()]; if (pi != null) { Battle.usePotion(pi); e.preventDefault(); }
        if (e.key === ' ' || e.key === 'Escape' || e.key === 'p') { Battle.togglePause(); e.preventDefault(); }
        return;
      }
      if (e.key === 'Escape') this.closeModal();
      if (!document.getElementById('modal').classList.contains('on') && this.mode === 'book' && Book.sec) {
        const n = +e.key; if (n >= 1 && n <= 9) { const btns = [...document.querySelectorAll('#pageText .choice')]; if (btns[n - 1]) btns[n - 1].click(); }
      }
    });
    document.getElementById('btnSheet').addEventListener('click', () => { if (this.st && !Battle.active) Book.openSheet(); });
    document.getElementById('btnQuests').addEventListener('click', () => { if (this.st && !Battle.active) Book.openSheet('quests'); });
    document.getElementById('btnSound').addEventListener('click', (e) => { const on = !(this.st ? this.st.settings.sound : true); if (this.st) this.st.settings.sound = on; Sound.setEnabled(on); e.currentTarget.classList.toggle('off', !on); this.save(); });
    document.getElementById('btnMenu').addEventListener('click', () => { if (Battle.active) return; this.save(); Book.showTitle(); });
  },

  /* ---------------- modal & toast ---------------- */
  modal(html, o) {
    o = o || {};
    const m = document.getElementById('modal');
    m.innerHTML = `<div class="mcard ${o.wide ? 'wide' : ''}">${o.noClose ? '' : '<button class="mclose" aria-label="Close">×</button>'}<div class="mbody">${html}</div></div>`;
    m.classList.add('on');
    this._onClose = o.onClose || null;
    const x = m.querySelector('.mclose'); if (x) x.addEventListener('click', () => this.closeModal());
    if (!o.noClose) m.onclick = (e) => { if (e.target === m) this.closeModal(); }; else m.onclick = null;
    return m;
  },
  closeModal() { const m = document.getElementById('modal'); if (!m.classList.contains('on')) return; m.classList.remove('on'); m.innerHTML = ''; const f = this._onClose; this._onClose = null; if (f) f(); },
  toast(t) { const el = document.getElementById('gtoast'); el.textContent = t; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); },
};

window.addEventListener('DOMContentLoaded', () => Game.boot());
