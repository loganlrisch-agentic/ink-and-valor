/* ==========================================================================
   HUD - battle bar (portrait, health, spells, potions), boss bar, banners,
   tips and the results card. Plus painted 2010-style icons.
   ========================================================================== */
const Icons = (() => {
  const cache = {};
  function glyph(g, kind, c) {
    g.save(); g.translate(48, 48); g.lineJoin = 'round'; g.lineCap = 'round';
    g.fillStyle = c; g.strokeStyle = '#140b06'; g.lineWidth = 4;
    const P = (pts, close = true) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); g.fill(); g.stroke(); };
    const O = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke(); };
    switch (kind) {
      case 'shield': P([[-20, -24], [20, -24], [22, 0], [0, 28], [-22, 0]]); g.fillStyle = '#140b06'; g.fillRect(-3, -18, 6, 34); g.fillRect(-14, -8, 28, 6); break;
      case 'whirl': for (let i = 0; i < 3; i++) { g.rotate(TAU / 3); P([[0, -4], [24, -18], [30, -10], [6, 4]]); } O(0, 0, 7); break;
      case 'tower': P([[-22, -26], [22, -26], [22, 6], [0, 28], [-22, 6]]); g.strokeStyle = '#140b06'; g.beginPath(); g.moveTo(-12, -14); g.lineTo(12, -14); g.moveTo(-12, -2); g.lineTo(12, -2); g.stroke(); break;
      case 'horn': P([[-26, 10], [10, -20], [24, -26], [20, -10], [-16, 22]]); O(-22, 16, 8); break;
      case 'flame': P([[0, -30], [14, -10], [20, 6], [12, 24], [0, 28], [-12, 24], [-20, 6], [-10, -6], [-6, 4], [-2, -14]]); g.fillStyle = '#fff2b0'; g.beginPath(); g.ellipse(0, 14, 6, 10, 0, 0, TAU); g.fill(); break;
      case 'flake': g.lineWidth = 7; g.strokeStyle = '#140b06'; for (let i = 0; i < 3; i++) { g.rotate(PI3); g.beginPath(); g.moveTo(0, -28); g.lineTo(0, 28); g.stroke(); } g.lineWidth = 3.5; g.strokeStyle = c; for (let i = 0; i < 3; i++) { g.rotate(PI3); g.beginPath(); g.moveTo(0, -27); g.lineTo(0, 27); g.moveTo(-8, -20); g.lineTo(0, -12); g.lineTo(8, -20); g.moveTo(-8, 20); g.lineTo(0, 12); g.lineTo(8, 20); g.stroke(); } break;
      case 'page': P([[-18, -26], [10, -26], [20, -16], [20, 26], [-18, 26]]); g.strokeStyle = '#140b06'; g.lineWidth = 2.5; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-10, -10 + i * 9); g.lineTo(12, -10 + i * 9); g.stroke(); } break;
      case 'bolt': P([[6, -30], [-14, 2], [0, 2], [-8, 30], [16, -6], [2, -6], [12, -30]]); break;
      case 'dagger': g.rotate(-0.7); P([[0, -32], [7, -8], [5, 10], [-5, 10], [-7, -8]]); g.fillStyle = '#c9a14a'; P([[-14, 10], [14, 10], [14, 16], [-14, 16]]); g.fillStyle = '#5a3a22'; P([[-4, 16], [4, 16], [4, 30], [-4, 30]]); break;
      case 'drop': P([[0, -28], [16, 2], [14, 18], [0, 28], [-14, 18], [-16, 2]]); g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-6, 6, 4, 8, 0.3, 0, TAU); g.fill(); break;
      case 'fan': for (let i = -2; i <= 2; i++) { g.save(); g.rotate(i * 0.38); P([[0, -32], [5, -12], [3, 6], [-3, 6], [-5, -12]]); g.restore(); } break;
      case 'cloud': O(-10, 4, 14); O(10, 4, 14); O(0, -8, 14); g.fillStyle = c; g.beginPath(); g.arc(-10, 4, 12, 0, TAU); g.arc(10, 4, 12, 0, TAU); g.arc(0, -8, 12, 0, TAU); g.fill(); break;
      case 'cross': P([[-7, -28], [7, -28], [7, -8], [26, -8], [26, 6], [7, 6], [7, 28], [-7, 28], [-7, 6], [-26, 6], [-26, -8], [-7, -8]]); break;
      case 'pillar': P([[-10, -32], [10, -32], [14, 24], [-14, 24]]); g.fillStyle = '#fff6d0'; g.fillRect(-4, -30, 8, 52); P([[-24, 24], [24, 24], [18, 30], [-18, 30]]); break;
      case 'sun': for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * TAU / 8); P([[-5, -16], [5, -16], [0, -32]]); g.restore(); } O(0, 0, 14); break;
      case 'ring': g.lineWidth = 10; g.strokeStyle = '#140b06'; g.beginPath(); g.arc(0, 4, 22, 0, TAU); g.stroke(); g.lineWidth = 6; g.strokeStyle = c; g.beginPath(); g.arc(0, 4, 22, 0, TAU); g.stroke(); P([[-4, -30], [4, -30], [4, -10], [-4, -10]]); break;
      case 'bone': g.rotate(-0.7); P([[-4, -22], [4, -22], [4, 22], [-4, 22]]); O(-6, -24, 7); O(6, -24, 7); O(-6, 24, 7); O(6, 24, 7); break;
      case 'heart': P([[0, 26], [-24, 0], [-22, -16], [-10, -22], [0, -12], [10, -22], [22, -16], [24, 0]]); break;
      case 'skull': O(0, -4, 22); P([[-12, 12], [12, 12], [10, 26], [-10, 26]]); g.fillStyle = '#140b06'; g.beginPath(); g.ellipse(-9, -4, 6, 7, 0, 0, TAU); g.ellipse(9, -4, 6, 7, 0, 0, TAU); g.fill(); break;
      case 'eye': g.beginPath(); g.moveTo(-28, 0); g.quadraticCurveTo(0, -24, 28, 0); g.quadraticCurveTo(0, 24, -28, 0); g.fill(); g.stroke(); g.fillStyle = '#140b06'; g.beginPath(); g.arc(0, 0, 9, 0, TAU); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(-3, -3, 3, 0, TAU); g.fill(); break;
      case 'quarrel': g.rotate(-0.8); P([[0, -32], [6, -20], [2, -20], [2, 22], [-2, 22], [-2, -20], [-6, -20]]); P([[-8, 18], [0, 26], [8, 18], [0, 30]]); break;
      case 'flask': P([[-6, -28], [6, -28], [6, -12], [20, 12], [14, 26], [-14, 26], [-20, 12], [-6, -12]]); g.fillStyle = '#ffcf6a'; g.beginPath(); g.moveTo(-17, 12); g.lineTo(17, 12); g.lineTo(12, 23); g.lineTo(-12, 23); g.fill(); break;
      case 'bola': g.lineWidth = 4; g.beginPath(); g.moveTo(-16, -14); g.lineTo(0, 4); g.lineTo(18, -10); g.moveTo(0, 4); g.lineTo(0, 22); g.stroke(); O(-16, -16, 9); O(18, -12, 9); O(0, 24, 9); break;
      case 'mark': g.lineWidth = 6; g.strokeStyle = '#140b06'; g.beginPath(); g.arc(0, 0, 22, 0, TAU); g.moveTo(-30, 0); g.lineTo(30, 0); g.moveTo(0, -30); g.lineTo(0, 30); g.stroke(); g.lineWidth = 3; g.strokeStyle = c; g.beginPath(); g.arc(0, 0, 22, 0, TAU); g.moveTo(-28, 0); g.lineTo(28, 0); g.moveTo(0, -28); g.lineTo(0, 28); g.stroke(); break;
      case 'bottle': case 'potion': P([[-6, -30], [6, -30], [6, -16], [18, -4], [18, 22], [-18, 22], [-18, -4], [-6, -16]]); break;
      case 'hammer': g.rotate(-0.6); P([[-3, -6], [3, -6], [3, 30], [-3, 30]]); P([[-18, -28], [18, -28], [18, -6], [-18, -6]]); break;
      case 'arrow': g.rotate(-0.8); P([[0, -32], [8, -18], [2, -18], [2, 24], [-2, 24], [-2, -18], [-8, -18]]); P([[-8, 18], [0, 26], [8, 18], [0, 30]]); break;
      case 'axe': g.rotate(-0.5); P([[-3, -28], [3, -28], [3, 30], [-3, 30]]); P([[3, -26], [24, -32], [28, -8], [3, -12]]); break;
      case 'trap': g.lineWidth = 4; for (let i = -3; i <= 3; i++) P([[i * 7 - 3, 8], [i * 7, -10], [i * 7 + 3, 8]]); g.beginPath(); g.arc(0, 10, 26, Math.PI * 0.05, Math.PI * 0.95); g.stroke(); break;
      case 'wing': P([[-26, 10], [-8, -22], [10, -26], [26, -18], [14, -10], [22, -4], [8, 2], [14, 10], [-4, 10]]); break;
      case 'fist': P([[-18, -10], [-16, -24], [16, -24], [20, -10], [20, 16], [8, 28], [-12, 28], [-20, 14]]); g.strokeStyle = '#140b06'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-8 + i * 9, -24); g.lineTo(-8 + i * 9, -12); g.stroke(); } break;
      case 'tornado': for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(i * 2 - 4, -22 + i * 11, 24 - i * 4, 5, 0, 0, Math.PI * 2); g.fill(); g.stroke(); } break;
      case 'wave': P([[-28, 10], [-18, -8], [-4, -16], [12, -14], [26, -4], [16, -4], [8, 2], [-6, 2], [-16, 14]]); break;
      case 'boot': P([[-10, -28], [8, -28], [8, 6], [26, 14], [26, 26], [-12, 26]]); break;
      case 'lotus': for (let i = -2; i <= 2; i++) { g.save(); g.rotate(i * 0.45); P([[0, 20], [-8, 0], [0, -26], [8, 0]]); g.restore(); } break;
      case 'note': P([[-14, 14], [-4, 14], [-4, -22], [18, -28], [18, 6], [10, 6], [10, -14], [2, -12], [2, 14]], true); O(-10, 16, 9); O(14, 8, 8); break;
      case 'moon': g.beginPath(); g.arc(0, 0, 24, 0.4, Math.PI * 2 - 0.4); g.arc(10, 0, 18, Math.PI * 2 - 0.6, 0.6, true); g.closePath(); g.fill(); g.stroke(); break;
      case 'star': P(Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 11 : 28, a = i * Math.PI / 5 - Math.PI / 2; return [Math.cos(a) * r, Math.sin(a) * r]; })); break;
      case 'coin': O(0, 0, 22); g.fillStyle = '#140b06'; g.font = 'bold 26px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('¢', 0, 2); break;
      case 'toad': O(0, 6, 22); O(-12, -14, 9); O(12, -14, 9); g.fillStyle = '#140b06'; O(-12, -14, 4); O(12, -14, 4); g.beginPath(); g.moveTo(-12, 10); g.quadraticCurveTo(0, 18, 12, 10); g.stroke(); break;
      case 'cat': P([[-20, 24], [-22, -10], [-16, -28], [-8, -14], [8, -14], [16, -28], [22, -10], [20, 24]]); g.fillStyle = '#ffd23a'; O(-8, 0, 4); O(8, 0, 4); break;
      case 'thorn': g.lineWidth = 6; g.beginPath(); g.moveTo(-26, 22); g.bezierCurveTo(-10, -10, 10, 20, 24, -24); g.stroke(); for (let i = 0; i < 4; i++) P([[-18 + i * 12, 8 - i * 8], [-12 + i * 12, -2 - i * 8], [-10 + i * 12, 10 - i * 8]]); break;
      case 'leaf': g.beginPath(); g.moveTo(0, 28); g.quadraticCurveTo(-28, 0, 0, -28); g.quadraticCurveTo(28, 0, 0, 28); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 26); g.lineTo(0, -22); g.stroke(); break;
      case 'paw': O(0, 10, 13); O(-14, -8, 6); O(-5, -16, 6); O(5, -16, 6); O(14, -8, 6); break;
      case 'golem': P([[-16, -28], [16, -28], [20, -8], [28, 4], [20, 28], [-20, 28], [-28, 4], [-20, -8]]); g.fillStyle = '#ffcf6a'; O(-7, -16, 3); O(7, -16, 3); break;
      case 'quill': g.rotate(0.6); P([[0, -32], [10, -12], [6, 10], [0, 30], [-6, 10], [-10, -12]]); g.strokeStyle = '#140b06'; g.beginPath(); g.moveTo(0, -26); g.lineTo(0, 26); g.stroke(); break;
      case 'hourglass': P([[-16, -28], [16, -28], [2, 0], [16, 28], [-16, 28], [-2, 0]]); break;
      case 'bang': P([[-8, -30], [8, -30], [5, 10], [-5, 10]]); O(0, 22, 7); break;
      case 'lantern': P([[-12, -18], [12, -18], [16, 18], [-16, 18]]); g.fillStyle = '#fff2b0'; P([[-7, -10], [7, -10], [9, 12], [-9, 12]]); g.fillStyle = c; g.beginPath(); g.arc(0, -22, 8, Math.PI, 0); g.stroke(); break;
      case 'chain': g.lineWidth = 5; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(-16 + i * 16, -12 + i * 12, 10, 6, -0.7, 0, Math.PI * 2); g.stroke(); } break;
      case 'bell': g.beginPath(); g.moveTo(-22, 18); g.quadraticCurveTo(-18, -26, 0, -26); g.quadraticCurveTo(18, -26, 22, 18); g.closePath(); g.fill(); g.stroke(); O(0, 24, 5); break;
      case 'key': O(-12, -12, 10); P([[-4, -4], [24, 24], [20, 28], [14, 22], [10, 26], [6, 22], [-8, 0]]); break;
      default: O(0, 0, 18);
    }
    g.restore();
  }
  const PI3 = Math.PI / 3;
  function frame(g, base) {
    const gr = g.createRadialGradient(40, 34, 6, 48, 48, 60);
    gr.addColorStop(0, shade(base, 0.35)); gr.addColorStop(0.55, shade(base, -0.15)); gr.addColorStop(1, shade(base, -0.6));
    g.fillStyle = '#140b06'; rrect(g, 0, 0, 96, 96, 16); g.fill();
    g.fillStyle = gr; rrect(g, 5, 5, 86, 86, 12); g.fill();
    const sh = g.createLinearGradient(0, 0, 0, 96); sh.addColorStop(0, 'rgba(255,255,255,0.35)'); sh.addColorStop(0.45, 'rgba(255,255,255,0.03)'); sh.addColorStop(1, 'rgba(0,0,0,0.25)');
    g.fillStyle = sh; rrect(g, 5, 5, 86, 86, 12); g.fill();
  }
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function make(key, base, kind, fg, round) {
    if (cache[key]) return cache[key];
    const cv = document.createElement('canvas'); cv.width = cv.height = 96; const g = cv.getContext('2d');
    if (round) { g.save(); g.beginPath(); g.arc(48, 48, 46, 0, TAU); g.clip(); frame(g, base); g.restore(); g.strokeStyle = '#d4ad48'; g.lineWidth = 4; g.beginPath(); g.arc(48, 48, 44, 0, TAU); g.stroke(); }
    else frame(g, base);
    glyph(g, kind, fg || '#fff6e0');
    return (cache[key] = cv.toDataURL());
  }
  return {
    skill(id) { const a = AB[id]; if (!a) return ''; const c = SCHOOL_COLOR[a.school] || CLASSES[a.cls].color || '#888'; const cc = CLASSES[a.cls].color; return make('s_' + id, shade(a.type === 'passive' ? cc : c, a.type === 'passive' ? -0.45 : -0.35), a.glyph || 'orb', shade(c, 0.3), a.type === 'passive'); },
    cls(k) { const c = CLASSES[k]; return make('c_' + k, c.color, c.glyph || 'orb', '#fff6e0'); },
    potion(id) { const p = POTIONS[id]; return make('p_' + id, '#3a2a24', 'bottle', p.color); },
    glyph: (key, base, kind, fg) => make(key, base, kind, fg),
  };
})();

const HUD = {
  root: null, hurtT: 0, tipT: 0,
  el(id) { return document.getElementById(id); },
  build(b) {
    const st = Game.st, h = this.root = this.el('hud');
    h.innerHTML = '';
    h.className = 'on';
    const S = b.S;
    const skillBtns = b.loadout.map((id, i) => {
      if (!id) return `<div class="slot empty"><span class="key">${i + 1}</span></div>`;
      const sk = SKILLS[id];
      return `<button class="slot" data-skill="${i}" title="${escapeHtml(sk.name)}: ${escapeHtml(sk.desc)}"><img src="${Icons.skill(id)}" alt=""><span class="cd"></span><span class="cdn"></span><span class="key">${i + 1}</span><span class="nm">${escapeHtml(sk.name)}</span></button>`;
    }).join('');
    const pas = (st.run.passives || []).filter(Boolean).map((id) => `<img class="pas" src="${Icons.skill(id)}" title="${escapeHtml(AB[id].name)}: ${escapeHtml(AB[id].desc)}" alt="">`).join('');
    h.innerHTML = `
      <div id="hTop"><div id="hTitle">${escapeHtml(b.def.title || '')}</div><div id="hBoss" class="hide"><div class="bn"></div><div class="bb"><i></i><b></b></div></div><div id="hTip" class="hide"></div></div>
      <div id="hBanner"></div>
      <button id="hPause" title="Pause (Space)">❚❚</button>
      <div id="hBar">
        <div id="hHero"><div class="port"><img src="${Icons.cls(st.hero.origin)}" alt=""></div>
          <div class="hpw"><div class="nm">${escapeHtml(st.hero.name)} <span>Lv ${st.hero.level}</span></div><div class="hp"><i></i><b></b><span></span></div><div class="buffs"></div><div class="passives">${pas}</div></div></div>
        <div id="hSkills">${skillBtns}</div>
        <div id="hBelt"></div>
      </div>
      <div id="hPauseCard" class="hide"><h2>Paused</h2><p>The ink holds its breath.</p><button class="btn" data-act="resume">Resume</button><button class="btn ghost" data-act="flee">Flee the battle</button></div>
      <div id="hResults" class="hide"></div>`;
    this.refreshBelt(b);
    h.querySelectorAll('[data-skill]').forEach((btn) => btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); Battle.useSkill(+btn.dataset.skill); }));
    this.el('hPause').addEventListener('click', () => Battle.togglePause());
    h.querySelector('[data-act=resume]').addEventListener('click', () => Battle.togglePause(false));
    h.querySelector('[data-act=flee]').addEventListener('click', () => { Battle.togglePause(false); Book.battleEnded(false, Battle.b, true); });
    this.slots = [...h.querySelectorAll('#hSkills .slot')];
    this.hpI = h.querySelector('.hp i'); this.hpB = h.querySelector('.hp b'); this.hpT = h.querySelector('.hp span');
    this._hp = 1; this.tipT = 0;
    this.banner('', 0);
    this.hurtT = 0;
  },
  refreshBelt(b) {
    const st = Game.st, el = this.el('hBelt'); if (!el) return;
    el.innerHTML = b.belt.map((id, i) => {
      const k = ['Q', 'W', 'E'][i];
      if (!id || !(st.run.potions[id] > 0)) return `<div class="pot empty"><span class="key">${k}</span></div>`;
      return `<button class="pot" data-pot="${i}" title="${escapeHtml(POTIONS[id].name)}: ${escapeHtml(POTIONS[id].desc)}"><img src="${Icons.potion(id)}" alt=""><span class="n">${st.run.potions[id]}</span><span class="key">${k}</span></button>`;
    }).join('');
    el.querySelectorAll('[data-pot]').forEach((btn) => btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); Battle.usePotion(+btn.dataset.pot); }));
  },
  hide() { const h = this.el('hud'); if (h) { h.className = ''; h.innerHTML = ''; } },
  showPause(v) { const c = this.el('hPauseCard'); if (c) c.classList.toggle('hide', !v); },
  flashSlot(i) { const s = this.slots && this.slots[i]; if (!s) return; s.classList.remove('fire'); void s.offsetWidth; s.classList.add('fire'); },
  bossIntro(boss) { if (!boss) return; const el = this.el('hBoss'); el.classList.remove('hide'); el.querySelector('.bn').textContent = boss.name; this.boss = boss; this.banner(boss.name, 2.0, true); },
  endBossIntro() {},
  hurtFlash() { this.hurtT = 0.45; },
  grey() {},
  tip(text, dur) { const el = this.el('hTip'); if (!el) return; el.innerHTML = text; el.classList.remove('hide'); this.tipT = dur || 0; this.tipHold = !dur; },
  banner(text, dur, big) { const el = this.el('hBanner'); if (!el) return; if (!text) { el.className = ''; el.textContent = ''; return; } el.textContent = text; el.className = 'show' + (big ? ' big' : ''); clearTimeout(this._bt); this._bt = setTimeout(() => { el.className = ''; }, (dur || 1.4) * 1000); },
  update(b) {
    if (!this.root || !b) return;
    const h = b.hero, f = clamp(h.hp / h.maxHp, 0, 1);
    this._hp = lerp(this._hp, f, 0.08);
    if (this.hpI) { this.hpI.style.width = (f * 100) + '%'; this.hpB.style.width = (this._hp * 100) + '%'; this.hpT.textContent = `${Math.ceil(Math.max(0, h.hp))} / ${h.maxHp}`; this.hpI.parentNode.classList.toggle('low', f < 0.3); }
    (this.slots || []).forEach((s) => {
      const i = +s.dataset.skill; const id = b.loadout[i]; if (!id) return;
      const cd = b.cds[i], max = AB[id].cd * (1 - (b.S.cdr || 0)), k = cd > 0 ? Math.min(1, cd / max) : 0;
      s.querySelector('.cd').style.background = k > 0 ? `conic-gradient(rgba(10,6,4,0.72) ${k * 360}deg, rgba(0,0,0,0) 0)` : 'none';
      s.querySelector('.cdn').textContent = cd > 0 ? (cd < 1 ? cd.toFixed(1) : Math.ceil(cd)) : '';
      s.classList.toggle('ready', cd <= 0);
    });
    document.querySelectorAll('#hBelt .pot').forEach((p) => p.classList.toggle('cool', b.potCd > 0));
    if (this.boss) { const bb = this.el('hBoss'); const k = clamp(this.boss.hp / this.boss.maxHp, 0, 1); bb.querySelector('i').style.width = (k * 100) + '%'; this._bk = lerp(this._bk == null ? 1 : this._bk, k, 0.06); bb.querySelector('b').style.width = (this._bk * 100) + '%'; }
    if (this.tipT > 0) { this.tipT -= 1 / 60; if (this.tipT <= 0) this.el('hTip').classList.add('hide'); }
    if (this.tipHold && b.attacked && b.tips.a === 2) { this.tipHold = false; }
    if (this.hurtT > 0) this.hurtT = Math.max(0, this.hurtT - 1 / 50);
    if (b.banner && b.banner !== this._lastBanner) { this._lastBanner = b.banner; this.banner(b.banner.text, b.banner.dur, b.banner.big); }
    const buffs = []; const B = h.buffs;
    for (const [k, lbl, c] of [['fury', 'Fury', '#ff6a3a'], ['ironbark', 'Ironbark', '#c8a070'], ['quick', 'Quick', '#e6eef8'], ['bulwark', 'Bulwark', '#9ac8ff'], ['warcry', 'Warcry', '#ffcf8a'], ['nightshade', 'Poisoned blades', '#8fd14f'], ['empower', 'Empowered', '#b3a2ff'], ['inkcloud', 'Hidden', '#8a7ab8'], ['ghost', 'Mist', '#9fe6ff'], ['song', 'Ballad', '#ffb0e0'], ['bloodrage', 'Bloodrage', '#e0303a'], ['divine', 'Divine', '#fff2b0'], ['bear', 'Bear', '#c8a070'], ['bloodmoon', 'Blood Moon', '#e0303a']]) if (B[k] > 0) buffs.push(`<span style="--c:${c}">${lbl} ${Math.ceil(B[k])}</span>`);
    if (h.shield > 0) buffs.push(`<span style="--c:#bfe0ff">Shield ${Math.ceil(h.shield)}</span>`);
    if (h.stacks) for (const k in h.stacks) buffs.push(`<span style="--c:#d8c8ff">${k === 'soul' ? 'Souls' : 'Crescendo'} ×${h.stacks[k].n}</span>`);
    const bs = buffs.join('');
    const bel = this.root.querySelector('.buffs'); if (bel && bel._h !== bs) { bel.innerHTML = bs; bel._h = bs; }
  },
  results(b, won) {
    const el = this.el('hResults'); if (!el) return;
    const st = Game.st;
    if (won) {
      const lvBefore = st.hero.level;
      const out = Book.applyBattleRewards(b);
      el.innerHTML = `<div class="card win"><h2>${b.def.nonlethal ? 'Well Fought' : 'Victory'}</h2>
        <div class="rw"><div><b>${b.kills}</b><span>foes</span></div><div><b>+${b.xp}</b><span>experience</span></div><div><b>+${b.gold}</b><span>crowns</span></div></div>
        ${st.hero.level > lvBefore ? `<div class="lvup">Level ${st.hero.level}! You have ${st.hero.points} stat point${st.hero.points === 1 ? '' : 's'} to spend in your Adventure Sheet.</div>` : ''}
        <div class="xpbar"><i style="width:${(st.hero.xp / xpNeeded(st.hero.level)) * 100}%"></i><span>Level ${st.hero.level}: ${st.hero.xp} / ${xpNeeded(st.hero.level)}</span></div>
        ${b.loot ? `<div class="loot"><span>Found</span><b style="color:${(RARITY[ITEM_RARITY[b.loot] || 'common'] || {}).color || '#fff'}">${escapeHtml(ITEMS[b.loot].name)}</b><em>${ITEMS[b.loot].trinket ? escapeHtml(ITEMS[b.loot].desc) : escapeHtml(itemLine(ITEMS[b.loot]))}</em></div>` : ''}
        <button class="btn" data-act="cont">Turn the page</button></div>`;
      el.querySelector('[data-act=cont]').addEventListener('click', () => Book.battleEnded(true, b));
      void out;
    } else {
      el.innerHTML = `<div class="card lose"><h2>You Have Fallen</h2><p>The ink closes over you. Somewhere, a ribbon sighs.</p>
        <button class="btn" data-act="retry">Fight again</button><button class="btn ghost" data-act="end">Turn to the end</button></div>`;
      el.querySelector('[data-act=retry]').addEventListener('click', () => Book.retryBattle());
      el.querySelector('[data-act=end]').addEventListener('click', () => Book.battleEnded(false, b));
    }
    el.classList.remove('hide');
  },
};
