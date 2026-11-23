/* ==========================================================================
   The Arena - instant action from the title page.
   Pick a calling, fight endless waves drawn from every chapter, choose a
   boon between waves, and see how deep you get. Never touches the story save.
   ========================================================================== */
const Arena = {
  on: false,
  wave: 0,
  hpFrac: 1,
  origin: 'knight',
  BEST_KEY: 'inkvalor_arena_best',
  AUTO_KEY: 'inkvalor_arena_auto',
  get autoLoadout() { try { return localStorage.getItem(this.AUTO_KEY) === '1'; } catch (e) { return false; } },
  set autoLoadout(v) { try { localStorage.setItem(this.AUTO_KEY, v ? '1' : '0'); } catch (e) { /* storage may be blocked */ } },

  /* how strong an ability is for this hero: big capstones first, then high requirements, then fit with the hero's best stats */
  score(id) {
    const a = AB[id], st = Game.st, req = a.req || {};
    let s = (a.capstone ? 60 : 0) + (a.minLevel || 1) * 4;
    for (const k in req) s += req[k] * 1.5 + (st.hero.stats[k] || 0) * 0.6;
    if (a.type === 'passive' && a.P) s += Object.keys(a.P).length * 5;
    if (a.type === 'active' && a.cd) s += Math.min(a.cd, 30) * 0.3;
    return s;
  },
  autoPick() {
    const st = Game.st, R = st.run;
    const ready = knownSkills(st).filter((id) => abilityStatus(st, id).ok);
    for (const [type, key] of [['active', 'actives'], ['passive', 'passives']]) {
      const best = ready.filter((id) => AB[id].type === type).sort((a, b) => this.score(b) - this.score(a)).slice(0, 5);
      R[key] = best.concat([null, null, null, null, null]).slice(0, 5);
    }
  },

  best() { try { return +(localStorage.getItem(this.BEST_KEY) || 0); } catch (e) { return 0; } },
  setBest(n) { try { if (n > this.best()) localStorage.setItem(this.BEST_KEY, String(n)); } catch (e) { /* storage may be blocked */ } },

  /* which monsters and places belong to which part of the book */
  pools() {
    if (this._pools) return this._pools;
    const mk = () => ({ foes: new Set(), bosses: new Set(), scenes: new Set() });
    const P = { I: mk(), II: mk(), III: mk(), IV: mk(), V: mk() };
    const chOf = (id) => { for (const [lo, hi, k] of CHAPTER_RANGES) if (id >= lo && id <= hi) return k; return 'I'; };
    for (const sid of Object.keys(SECTIONS)) {
      const s = SECTIONS[sid]; if (!Array.isArray(s.choices)) continue;
      const k = chOf(+sid);
      for (const c of s.choices) {
        const bd = c.battle && BATTLES[c.battle];
        if (!bd || bd.nonlethal || bd.finale || bd.tutorial) continue;
        P[k].scenes.add(bd.scene);
        for (const w of bd.waves) for (const sp of w) {
          const d = ENEMIES[sp.t];
          if (!d || sp.champ || d.ally) continue;
          (d.boss ? P[k].bosses : P[k].foes).add(sp.t);
        }
      }
    }
    for (const k in P) for (const f of ['foes', 'bosses', 'scenes']) P[k][f] = [...P[k][f]];
    return (this._pools = P);
  },
  eraFor(n) { return n <= 4 ? ['I'] : n <= 9 ? ['I', 'II'] : n <= 14 ? ['II', 'III'] : n <= 19 ? ['III', 'IV'] : ['II', 'III', 'IV', 'V']; },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },

  /* ---------- the title-page picker ---------- */
  open() {
    const t = document.getElementById('title');
    const best = this.best();
    t.innerHTML = `<div class="cover"><div class="cv-frame arena-pick"><div class="cv-top">The Arena</div><h1>Endless <span>Ink</span></h1>
      <div class="cv-sub">Waves from every chapter. A boon after each one. How deep can you go?${best ? `<br>Your best: wave ${best}` : ''}</div>
      <div class="origins arena-origins">${ORIGINS.map((o) => `<button class="orig" data-o="${o}"><img src="${Icons.cls(o)}" alt=""><b>${CLASSES[o].name}</b></button>`).join('')}</div>
      <div class="cv-btns"><button class="btn ghost" data-t="back">Back to the book</button></div>
      <div class="cv-foot">Pick a calling to begin. Your story save is never touched.</div></div></div>`;
    t.classList.add('on');
    t.querySelectorAll('[data-o]').forEach((b) => b.addEventListener('click', () => { Sound.ensure(); Sound.play('page'); t.classList.remove('on'); this.start(b.dataset.o); }));
    t.querySelector('[data-t=back]').addEventListener('click', () => { Sound.play('page'); Book.showTitle(); });
  },

  start(origin) {
    this.origin = origin;
    if (!this.on) this.saved = Game.st || null;
    this.on = true; this.wave = 0; this.hpFrac = 1;
    const st = newState('Champion', { skin: Math.floor(Math.random() * SKINS.length), hairStyle: Math.floor(Math.random() * 4), hairColor: Math.floor(Math.random() * HAIRS.length) }, origin);
    st.settings = Object.assign({}, (this.saved && this.saved.settings) || {}, { difficulty: 'normal' });
    st.run.potions.heal = 2; fixBelt(st);
    Game.st = st;
    Track.event('arena_start', { origin });
    this.next();
  },

  /* ---------- building a wave ---------- */
  next() {
    const n = ++this.wave;
    const P = this.pools(), eras = this.eraFor(n);
    const foes = [].concat(...eras.map((k) => P[k].foes)), bosses = [].concat(...eras.map((k) => P[k].bosses));
    const scenes = [].concat(...eras.map((k) => P[k].scenes)).filter((sc) => sc !== 'bindery');
    const isBoss = n % 5 === 0 && bosses.length;
    const count = Math.min(9, 3 + Math.floor(n / 2));
    const spot = (i, edge) => edge ? { edge: i % 2 ? -1 : 1, y: 390 + ((i * 47) % 140) } : { dx: (i % 2 ? -1 : 1) * (150 + ((i * 37) % 120)), y: 390 + ((i * 53) % 140) };
    const w1 = [], w2 = [];
    if (isBoss) { w1.push(Object.assign({ t: this.pick(bosses) }, { dx: 200, y: 450 })); for (let i = 0; i < 2 + Math.floor(n / 10); i++) w1.push(Object.assign({ t: this.pick(foes) }, spot(i))); }
    else {
      const first = Math.ceil(count * 0.6);
      for (let i = 0; i < first; i++) w1.push(Object.assign({ t: this.pick(foes) }, spot(i)));
      for (let i = first; i < count; i++) w2.push(Object.assign({ t: this.pick(foes) }, spot(i, true)));
    }
    BATTLES.__arena = { scene: this.pick(scenes), title: isBoss ? `Wave ${n} · A Champion of the Ink` : `Arena · Wave ${n}`, tier: 1 + (n - 1) * 0.085, hero: { dx: -150, y: 450 }, waves: w2.length ? [w1, w2] : [w1] };
    if (isBoss) BATTLES.__arena.boss = w1[0].t; else delete BATTLES.__arena.boss;
    this.fight();
  },
  fight() {
    Game.setMode('battle');
    R3.setWorld(BATTLES.__arena.scene); Music.forBattle('__arena');
    R3.clearActors();
    BView.begin(document.getElementById('view'));
    Battle.start('__arena', {});
    const h = Battle.b && Battle.b.hero; if (h) h.hp = Math.max(1, Math.round(h.maxHp * this.hpFrac));
    Sound.play('shout', 300);
  },

  /* ---------- between waves ---------- */
  boons() {
    const st = Game.st, R = st.run;
    const kit = ORIGIN_KIT[st.hero.origin];
    const main = STAT_KEYS.filter((k) => k !== 'heart').sort((a, b) => kit.stats[b] - kit.stats[a])[0];
    const all = [];
    const unlearned = Object.keys(CLASSES).filter((c) => !R.classes.includes(c));
    if (unlearned.length) { const c = this.pick(unlearned); all.push({ id: 'class', icon: Icons.cls(c), name: `Learn the ${CLASSES[c].name}`, desc: `Its abilities join your bar as your level allows.`, go: () => { R.classes.push(c); fixLoadout(st, true); } }); }
    all.push({ id: 'might', name: `+3 ${STAT_NAMES[main]}`, desc: 'Hit harder with your calling’s favourite stat.', go: () => { st.hero.stats[main] += 3; } });
    all.push({ id: 'heart', name: '+4 Heart', desc: 'More health for the waves to come.', go: () => { st.hero.stats.heart += 4; } });
    all.push({ id: 'mend', name: 'Mend', desc: 'Return to full health and gain a healing draught.', go: () => { this.hpFrac = 1; R.potions.heal = (R.potions.heal || 0) + 1; fixBelt(st); } });
    const gear = LOOT_POOL.filter((id) => !R.items.includes(id) && canEquip(st, id));
    if (gear.length) { const g = this.pick(gear); const it = ITEMS[g]; all.push({ id: 'gear', name: it.name, desc: it.trinket ? it.desc : `New ${it.slot}: ${itemLine(g)}`, color: (RARITY[ITEM_RARITY[g] || 'common'] || {}).color, go: () => { giveItem(st, g); R.equip[it.slot] = g; } }); }
    if (this.wave % 3 === 0) all.push({ id: 'pots', name: 'Two Draughts', desc: 'Two more healing potions on your belt.', go: () => { R.potions.heal = (R.potions.heal || 0) + 2; fixBelt(st); } });
    // always offer three different boons, shuffled
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    return all.slice(0, 3);
  },
  levelUp() {
    const st = Game.st, h = st.hero;
    gainXp(st, xpNeeded(h.level));
    const kit = ORIGIN_KIT[h.origin];
    const main = STAT_KEYS.filter((k) => k !== 'heart').sort((a, b) => kit.stats[b] - kit.stats[a])[0];
    while (h.points > 0) { h.stats[h.points % 3 === 0 ? 'heart' : main]++; h.points--; }
    if (this.autoLoadout) this.autoPick(); else fixLoadout(st, true);
  },

  results(b, won, el) {
    Track.event(won ? 'arena_wave_won' : 'arena_died', { wave: this.wave, origin: this.origin });
    if (won) {
      const h = b.hero; this.hpFrac = Math.min(1, (h ? h.hp / h.maxHp : 1) + 0.3);
      this.levelUp();
      this.setBest(this.wave);
      const opts = this.boons();
      el.innerHTML = `<div class="card win arena-card"><h2>Wave ${this.wave} Cleared</h2>
        <div class="rw"><div><b>${b.kills}</b><span>foes</span></div><div><b>${Game.st.hero.level}</b><span>level</span></div><div><b>${this.best()}</b><span>best wave</span></div></div>
        <p class="tip">Choose a boon.</p>
        <div class="boons">${opts.map((o, i) => `<button class="boon" data-i="${i}">${o.icon ? `<img src="${o.icon}" alt="">` : ''}<b${o.color ? ` style="color:${o.color}"` : ''}>${escapeHtml(o.name)}</b><em>${escapeHtml(o.desc)}</em></button>`).join('')}</div>
        <button class="btn ghost sm" data-act="quit">Leave the Arena</button></div>`;
      el.querySelectorAll('[data-i]').forEach((btn) => btn.addEventListener('click', () => { Sound.play('click'); opts[+btn.dataset.i].go(); if (this.autoLoadout) { this.autoPick(); this.closeBattle(); this.next(); } else this.showLoadout(el); }));
    } else {
      this.setBest(this.wave - 1);
      el.innerHTML = `<div class="card lose arena-card"><h2>Fallen on Wave ${this.wave}</h2>
        <p>You cleared ${this.wave - 1} wave${this.wave - 1 === 1 ? '' : 's'} as a ${escapeHtml(CLASSES[this.origin].name)}. Your best is wave ${this.best()}.</p>
        <p class="tip">The story mode has twelve more callings to learn, and a book full of people who need you.</p>
        <button class="btn" data-act="again">Fight again</button><button class="btn ghost" data-act="read">Read the story</button><button class="btn ghost sm" data-act="quit">Back to the title</button></div>`;
      el.querySelector('[data-act=again]').addEventListener('click', () => { this.closeBattle(); this.start(this.origin); });
      el.querySelector('[data-act=read]').addEventListener('click', () => { this.exit(); Book.showCreate(); });
    }
    el.querySelector('[data-act=quit]').addEventListener('click', () => this.exit());
    el.classList.remove('hide');
  },
  /* ---------- choose your loadout between waves ---------- */
  showLoadout(el) {
    const st = Game.st, R = st.run;
    const draw = () => {
      const slots = (list, type) => list.map((id, i) => `<button class="lslot ${type}" data-clear="${type}:${i}" title="${id ? escapeHtml(AB[id].name + ': ' + AB[id].desc) : 'Empty'}">${id ? `<img src="${Icons.skill(id)}" alt=""><span>${AB[id].name}</span>` : `<span class="e">${type === 'active' ? i + 1 : '◇'}</span>`}</button>`).join('');
      // only what this hero can use right now, strongest first
      const ready = knownSkills(st).filter((id) => abilityStatus(st, id).ok).sort((a, b) => this.score(b) - this.score(a));
      const tile = (id) => { const a = AB[id], on = (a.type === 'active' ? R.actives : R.passives).includes(id); return `<button class="atile ${a.type} ${on ? 'on' : ''}" data-skill="${id}" title="${escapeHtml(a.name + ': ' + a.desc)}"><img src="${Icons.skill(id)}" alt=""><span>${a.name}</span></button>`; };
      const group = (type, label) => { const ids = ready.filter((id) => AB[id].type === type); return ids.length ? `<div class="agroup"><h4>${label} <small>${ids.length} unlocked</small></h4><div class="atiles">${ids.map(tile).join('')}</div></div>` : ''; };
      el.innerHTML = `<div class="card win arena-card arena-load"><h2>Your Loadout</h2>
        <p class="tip">Tap to swap abilities in and out. Wave ${this.wave + 1} is next.</p>
        <div class="lrow"><b>Spells</b><div class="loadout">${slots(R.actives, 'active')}</div></div>
        <div class="lrow"><b>Passives</b><div class="loadout">${slots(R.passives, 'passive')}</div></div>
        <div class="arena-spells">${group('active', 'Spells')}${group('passive', 'Passives')}</div>
        <label class="arena-auto"><input type="checkbox" ${this.autoLoadout ? 'checked' : ''}> Always pick the strongest for me and skip this screen</label>
        <div class="arena-load-btns"><button class="btn ghost" data-act="auto">Auto-pick strongest</button><button class="btn" data-act="go">Fight wave ${this.wave + 1}</button></div></div>`;
      el.querySelectorAll('[data-clear]').forEach((b) => b.addEventListener('click', () => { const [type, i] = b.dataset.clear.split(':'); (type === 'active' ? R.actives : R.passives)[+i] = null; Sound.play('click'); draw(); }));
      el.querySelectorAll('[data-skill]').forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.skill, L = AB[id].type === 'active' ? R.actives : R.passives;
        const at = L.indexOf(id);
        if (at >= 0) L[at] = null; else { const e = L.indexOf(null); if (e < 0) { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); return; } L[e] = id; }
        Sound.play('click'); draw();
      }));
      el.querySelector('.arena-auto input').addEventListener('change', (e) => { this.autoLoadout = e.target.checked; if (e.target.checked) { this.autoPick(); draw(); } });
      el.querySelector('[data-act=auto]').addEventListener('click', () => { this.autoPick(); Sound.play('click'); draw(); });
      el.querySelector('[data-act=go]').addEventListener('click', () => { Sound.play('page'); this.closeBattle(); this.next(); });
    };
    draw();
  },
  closeBattle() { Battle.stop(); BView.end(); HUD.hide(); HUD.hurtT = 0; R3.setFx({ uHurt: 0, uGrey: 0, uFlash: 0 }); R3.shake = 0; R3.zoom = 0; },
  exit() {
    this.closeBattle();
    this.on = false; Game.st = this.saved || null; this.saved = null;
    delete BATTLES.__arena;
    Book.showTitle();
  },
};

/* ---------- a tiny event log, ready to forward to a portal SDK ---------- */
const Track = {
  log: [],
  event(name, data) {
    const e = Object.assign({ e: name, t: Date.now() }, data || {});
    this.log.push(e); if (this.log.length > 200) this.log.shift();
    try { if (window.__trackHook) window.__trackHook(e); } catch (err) { /* never let analytics break the game */ }
  },
};
