/* ==========================================================================
   Book - story engine, page rendering, choices, dice, dog-ears, shop,
   Adventure Sheet, title & character creation
   ========================================================================== */
const Story = {
  has(arr, v) { return (Array.isArray(v) ? v : [v]).every((x) => arr.includes(x)); },
  cond(st, c) {
    if (!c) return true;
    if (typeof c === 'function') return !!c(st);
    const R = st.run, Q = R.quests;
    for (const k in c) {
      const v = c[k];
      switch (k) {
        case 'gold': if (R.gold < v) return false; break;
        case 'potion': if (!(R.potions[v] > 0)) return false; break;
        case 'key': if (!this.has(R.keys, v)) return false; break;
        case 'notKey': if ((Array.isArray(v) ? v : [v]).some((x) => R.keys.includes(x))) return false; break;
        case 'item': if (!this.has(R.items, v)) return false; break;
        case 'flag': if (!(Array.isArray(v) ? v : [v]).every((f) => R.flags[f])) return false; break;
        case 'notFlag': if ((Array.isArray(v) ? v : [v]).some((f) => R.flags[f])) return false; break;
        case 'inkMin': for (const i in v) if ((R.inks[i] || 0) < v[i]) return false; break;
        case 'cls': if (!R.classes.includes(v)) return false; break;
        case 'notCls': if (R.classes.includes(v)) return false; break;
        case 'quest': if (!Q[v] || Q[v].done) return false; break;
        case 'questDone': if (!(Q[v] && Q[v].done)) return false; break;
        case 'notQuest': if (Q[v]) return false; break;
        case 'notQuestDone': if (Q[v] && Q[v].done) return false; break;
        case 'visited': if (!st.meta.visited[v]) return false; break;
        case 'notVisited': if (st.meta.visited[v]) return false; break;
        case 'any': if (!v.some((cc) => this.cond(st, cc))) return false; break;
        case 'ally': if (!(Array.isArray(v) ? v : [v]).every((a) => (R.allies || []).includes(a))) return false; break;
        case 'notAlly': if ((Array.isArray(v) ? v : [v]).some((a) => (R.allies || []).includes(a))) return false; break;
        case 'alignMin': if ((R.align || 0) < v) return false; break;
        case 'alignMax': if ((R.align || 0) > v) return false; break;
        case 'level': if (st.hero.level < v) return false; break;
        case 'keyCount': if (v[0].filter((k) => R.keys.includes(k)).length < v[1]) return false; break;
        default: break;
      }
    }
    return true;
  },
  needText(c) {
    if (!c) return '';
    const out = [];
    if (c.gold) out.push(`${c.gold} crowns`);
    if (c.potion) out.push(POTIONS[c.potion] ? POTIONS[c.potion].name : c.potion);
    if (c.key) out.push((Array.isArray(c.key) ? c.key : [c.key]).map((k) => (KEY_ITEMS[k] || { name: k }).name).join(' and '));
    if (c.item) out.push((Array.isArray(c.item) ? c.item : [c.item]).map((k) => (ITEMS[k] || { name: k }).name).join(' and '));
    if (c.cls) out.push(`the ways of the ${CLASSES[c.cls].name}`);
    if (c.ally) out.push((Array.isArray(c.ally) ? c.ally : [c.ally]).map((a) => CHAMPS[a] ? CHAMPS[a].name : a).join(' and ') + ' at your side');
    if (c.level) out.push(`level ${c.level}`);
    if (c.alignMin) out.push('a darker story behind you');
    if (c.keyCount) out.push(`${c.keyCount[1]} ${c.keyCount[2] || 'pieces'}`);
    return out.length ? 'Needs ' + out.join(', ') : 'Locked';
  },
  apply(st, eff, toast) {
    if (!eff) return;
    if (typeof eff === 'function') eff = eff(st);
    if (!eff) return;
    const R = st.run, arr = (v) => (Array.isArray(v) ? v : [v]);
    if (eff.gold) { R.gold = Math.max(0, R.gold + eff.gold); toast(eff.gold > 0 ? `+${eff.gold} crowns` : `${eff.gold} crowns`, 'gold'); }
    if (eff.luck) { R.luck += eff.luck; toast(`Luck ${eff.luck > 0 ? '+' : ''}${eff.luck}`, 'luck'); }
    if (eff.potion) { const P = typeof eff.potion === 'string' ? { [eff.potion]: 1 } : eff.potion; for (const id in P) { R.potions[id] = Math.max(0, (R.potions[id] || 0) + P[id]); if (P[id] > 0) toast(`${POTIONS[id].name} ×${P[id]}`, 'potion'); } fixBelt(st); }
    if (eff.key) for (const k of arr(eff.key)) if (!R.keys.includes(k)) { R.keys.push(k); toast(`Found: ${(KEY_ITEMS[k] || { name: k }).name}`, 'key'); }
    if (eff.unkey) for (const k of arr(eff.unkey)) R.keys = R.keys.filter((x) => x !== k);
    if (eff.item) for (const k of arr(eff.item)) if (ITEMS[k]) { giveItem(st, k); toast(`Received: ${ITEMS[k].name}`, 'item'); }
    if (eff.unitem) for (const k of arr(eff.unitem)) { R.items = R.items.filter((x) => x !== k); for (const s in R.equip) if (R.equip[s] === k) R.equip[s] = null; }
    if (eff.flag) for (const f of arr(eff.flag)) R.flags[f] = true;
    if (eff.ink) for (const i in eff.ink) R.inks[i] = (R.inks[i] || 0) + eff.ink[i];
    if (eff.learn && !R.classes.includes(eff.learn)) { R.classes.push(eff.learn); fixLoadout(st); toast(`You learned the ways of the ${CLASSES[eff.learn].name}!`, 'learn'); Sound.play('learn'); }
    if (eff.gift && ITEMS[eff.gift]) { giveItem(st, eff.gift); const ok = canEquip(st, eff.gift) && equipItem(st, eff.gift); toast(`Gift: ${ITEMS[eff.gift].name}${ok ? ' (equipped)' : ''}`, 'item'); }
    if (eff.quest) for (const q in eff.quest) { const isNew = !R.quests[q]; R.quests[q] = Object.assign(R.quests[q] || {}, { stage: eff.quest[q] }); if (isNew) { toast(`New quest: ${QUESTS[q] ? QUESTS[q].title : q}`, 'quest'); Sound.play('quest'); } else toast(`Quest updated: ${QUESTS[q] ? QUESTS[q].title : q}`, 'quest'); }
    if (eff.questDone) for (const q of arr(eff.questDone)) { R.quests[q] = Object.assign(R.quests[q] || {}, { done: true }); toast(`Quest complete: ${QUESTS[q] ? QUESTS[q].title : q}`, 'quest'); Sound.play('quest'); }
    if (eff.xp) { const lv = gainXp(st, eff.xp); toast(`+${eff.xp} experience`, 'xp'); if (lv) toast(`Level ${st.hero.level}!`, 'learn'); }
    if (eff.ally) { R.allies = R.allies || []; for (const a of arr(eff.ally)) if (CHAMPS[a] && !R.allies.includes(a)) { R.allies.push(a); toast(`${CHAMPS[a].name} will fight beside you`, 'ally'); } }
    if (eff.unally) R.allies = (R.allies || []).filter((a) => !arr(eff.unally).includes(a));
    if (eff.align) { R.align = (R.align || 0) + eff.align; if (eff.align > 0) toast('The ink darkens', 'dark'); else toast('Your page brightens', 'light'); }
  },
};

const Book = {
  sec: null, secId: null, dest: null, busy: false,
  get st() { return Game.st; },

  /* ---------------- navigation ---------------- */
  go(id, opt) {
    opt = opt || {};
    const st = this.st;
    let sec = SECTIONS[id];
    if (!sec) { console.warn('missing section', id); id = 0; sec = SECTIONS[0]; }
    if (sec.redirect) { const r = sec.redirect(st); if (r != null && r !== id) return this.go(r, opt); }
    const toasts = [];
    const toast = (t, k) => toasts.push([t, k]);
    if (!opt.silent) {
      st.meta.visited[id] = (st.meta.visited[id] || 0) + 1;
      if (sec.once && !st.run.once[id]) { st.run.once[id] = 1; Story.apply(st, sec.once, toast); }
      if (sec.enter) Story.apply(st, sec.enter, toast);
      if (sec.ending) st.meta.endings[sec.ending] = Date.now();
    }
    st.run.section = id;
    this.sec = sec; this.secId = id;
    if (sec.chapterStart && !opt.silent && !(st.chapterStart && st.chapterStart.sec === id)) { st.dogears = []; st.meta.dogearsUsed = 0; st.chapterStart = { sec: id, run: deepClone(st.run), hero: deepClone(st.hero) }; }
    Game.save();
    const draw = () => this.render(toasts, opt);
    if (Game.mode === 'book' && !opt.noTurn && R3.ok) this.turn(draw); else draw();
  },

  /* ---------------- the page turn ----------------
     The right-hand leaf lifts off the spine and lands on the left. Its front is
     the page you just read; its back is the new left page, with a still of the new
     3D plate, so the leaf passes OVER the old picture and lays the new one down. */
  turn(applyNew) {
    if (this.turning) this.endTurn();
    const app = document.getElementById('app');
    if (reduceMotion) { applyNew(); return; }
    const portrait = app.classList.contains('portrait');
    const left = document.querySelector('#book .page.left'), right = document.querySelector('#book .page.right'), book = document.getElementById('book');
    const aR = app.getBoundingClientRect();
    const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - aR.left, y: r.top - aR.top, w: r.width, h: r.height }; };
    const place = (el, r, z) => { el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px'; el.style.zIndex = z; };
    const putShot = (pageClone, shot) => { const pl = pageClone.querySelector('#plate'); if (!pl) return; pl.appendChild(shot); const fr = document.getElementById('plateFrame').cloneNode(true); fr.removeAttribute('style'); fr.className = 'frclone'; pl.appendChild(fr); };
    const oldScroll = document.getElementById('pageText').scrollTop;
    const oldShot = R3.snapshot();
    const parts = [];
    if (portrait) {
      const oldBook = book.cloneNode(true); oldBook.removeAttribute('id'); oldBook.classList.add('bookclone');
      applyNew(); R3.warm();
      const leaf = document.createElement('div'); leaf.className = 'leaf portrait';
      const front = document.createElement('div'); front.className = 'face front'; front.appendChild(oldBook);
      const back = document.createElement('div'); back.className = 'face back page';
      leaf.appendChild(front); leaf.appendChild(back);
      place(leaf, rect(book), 9); app.appendChild(leaf); parts.push(leaf);
      putShot(oldBook, oldShot);
      const pt = oldBook.querySelector('#pageText'); if (pt) pt.scrollTop = oldScroll;
    } else {
      const oldLeft = left.cloneNode(true), oldRight = right.cloneNode(true);
      const rL = rect(left), rR = rect(right);
      applyNew(); R3.warm();
      const newShot = R3.snapshot();
      const newLeft = left.cloneNode(true);
      // the old left page stays put until the leaf lands on it
      const freeze = document.createElement('div'); freeze.className = 'freeze'; oldLeft.classList.add('face'); freeze.appendChild(oldLeft); putShot(oldLeft, oldShot);
      const shL = document.createElement('i'); shL.className = 'castL'; freeze.appendChild(shL);
      place(freeze, rL, 8); app.appendChild(freeze); parts.push(freeze);
      const shR = document.createElement('div'); shR.className = 'castR'; place(shR, rR, 8); app.appendChild(shR); parts.push(shR);
      const leaf = document.createElement('div'); leaf.className = 'leaf';
      oldRight.classList.add('face', 'front'); newLeft.classList.add('face', 'back');
      for (const f of [oldRight, newLeft]) { const sh = document.createElement('i'); sh.className = 'shade'; f.appendChild(sh); }
      leaf.appendChild(oldRight); leaf.appendChild(newLeft);
      putShot(newLeft, newShot);
      place(leaf, rR, 9); app.appendChild(leaf); parts.push(leaf);
      const pt = oldRight.querySelector('#pageText'); if (pt) pt.scrollTop = oldScroll;
    }
    this.turning = { parts };
    Sound.play('page', 120);
    const k = this.turnSpeed || 1;
    if (k !== 1) parts.forEach((p) => p.querySelectorAll('*').forEach((c) => { c.style.animationDuration = k + 's'; }) || (p.style.animationDuration = k + 's'));
    requestAnimationFrame(() => parts.forEach((p) => p.classList.add('go')));
    this.turnTimer = setTimeout(() => this.endTurn(), 1050 * k);
  },
  endTurn() {
    clearTimeout(this.turnTimer);
    if (this.turning) for (const p of this.turning.parts) p.remove();
    this.turning = null;
  },
  textOf(sec) { const st = this.st; const t = typeof sec.text === 'function' ? sec.text(st) : sec.text; return (t || []).filter(Boolean); },
  actorsOf(sec) {
    const st = this.st;
    let a = typeof sec.actors === 'function' ? sec.actors(st) : (sec.actors || []);
    a = a.slice();
    if (sec.foes && BATTLES[sec.foes]) { const bd = BATTLES[sec.foes]; if (!a.some((x) => x.who === 'hero')) a.push(A('hero', bd.hero.dx, bd.hero.y)); for (const sp of bd.waves[0]) if (sp.dx != null) a.push(A(ENEMIES[sp.t] && !sp.champ ? 'e:' + sp.t : sp.t, sp.dx, sp.y, -1, 'idle')); }
    if (sec.scene !== 'blank' && !sec.death && !a.some((x) => x.who === 'hero')) a.unshift(A('hero', -120, 470));
    if (sec.scene === 'blank' && !a.length) a.push(A('tassel', 0, 440));
    return a;
  },

  /* ---------------- page rendering ---------------- */
  render(toasts, opt) {
    const st = this.st, sec = this.sec, id = this.secId;
    Game.setMode('book');
    R3.setWorld(sec.scene === 'blank' ? 'blank' : (sec.scene || 'moor'));
    R3.setActors(this.actorsOf(sec), st);
    const right = document.getElementById('pageText');
    const paras = this.textOf(sec).map((p, i) => {
      if (p.startsWith('T:')) return `<p class="tassel"><span class="rib"></span>${escapeHtml(p.slice(2).trim())}</p>`;
      return `<p${i === 0 ? ' class="first"' : ''}>${escapeHtml(p)}</p>`;
    }).join('');
    let choices = '';
    if (sec.death) choices = this.deathChoices();
    else if (sec.ending) choices = this.endingChoices(sec);
    else choices = (sec.choices || []).map((c, i) => this.choiceHtml(c, i)).join('');
    const folded = st.dogears.some((d) => d.sec === id);
    right.innerHTML = `
      <div class="sechead"><span class="secnum">§ ${DISPLAY[id] != null ? DISPLAY[id] : id}</span><button id="dogear" class="${folded ? 'folded' : ''}" title="Fold this page's corner (${3 - st.meta.dogearsUsed} left)"></button></div>
      <h1 class="sectitle">${escapeHtml(sec.title || '')}</h1>
      <div class="toasts">${(toasts || []).map(([t, k]) => `<div class="toast t-${k}">${escapeHtml(t)}</div>`).join('')}</div>
      <div class="prose">${paras}</div>
      ${sec.death || sec.ending ? `<div class="theend"><span>${sec.ending ? 'The End' : 'The End'}</span>${sec.ending ? `<em>${escapeHtml(ENDINGS[sec.ending] || '')}</em>` : ''}</div>` : '<div class="flourish"></div>'}
      <div class="choices">${choices}</div>
      ${sec.shop ? '<button class="btn shopbtn" data-act="shop">Browse the shelves</button>' : ''}`;
    right.scrollTop = 0;
    right.querySelectorAll('.choice[data-i]').forEach((b) => b.addEventListener('click', () => this.choose(+b.dataset.i)));
    right.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => this.act(b.dataset.act, b.dataset)));
    document.getElementById('dogear').addEventListener('click', () => this.fold());
    document.getElementById('plateCap').innerHTML = `<b>${escapeHtml(sec.title || '')}</b>`;
    this.refreshStatus();
  },
  choiceHtml(c, i) {
    const st = this.st;
    if (c.show && !Story.cond(st, c.show)) return '';
    const ok = Story.cond(st, c.need) && (!c.lock || Story.cond(st, c.lock));
    let to = '';
    if (c.battle) to = '<span class="to fight">fight</span>';
    else if (c.check) to = '<span class="to dice">roll</span>';
    else if (typeof c.to === 'number' && DISPLAY[c.to] != null) to = `<span class="to">turn to ${DISPLAY[c.to]}</span>`;
    else to = '<span class="to">turn the page</span>';
    return `<button class="choice ${c.ink ? 'ink-' + c.ink : ''} ${ok ? '' : 'locked'}" data-i="${i}" ${ok ? '' : 'aria-disabled="true"'}><span class="drop"></span><span class="t">${escapeHtml(c.t)}${ok ? '' : `<em class="req">${escapeHtml(Story.needText(c.need || c.lock))}</em>`}</span>${to}</button>`;
  },
  deathChoices() {
    const st = this.st;
    let h = '';
    if (this.lastBattle) h += `<button class="choice ink-crimson" data-act="retry"><span class="drop"></span><span class="t">Take up arms again and refight the battle</span><span class="to fight">fight</span></button>`;
    st.dogears.forEach((d, i) => { h += `<button class="choice ink-gold" data-act="dogear" data-i="${i}"><span class="drop"></span><span class="t">Flip back to your folded page: ${escapeHtml(SECTIONS[d.sec].title)}</span><span class="to">turn to ${DISPLAY[d.sec]}</span></button>`; });
    const ch = chapterOf(st.run.section);
    h += `<button class="choice" data-act="restart"><span class="drop"></span><span class="t">Begin Chapter ${ch.num} again (you keep your level and stats)</span><span class="to">turn to ${DISPLAY[ch.start] != null ? DISPLAY[ch.start] : ch.start}</span></button>`;
    return h;
  },
  endingChoices() {
    const st = this.st;
    let h = '';
    st.dogears.forEach((d, i) => { h += `<button class="choice ink-gold" data-act="dogear" data-i="${i}"><span class="drop"></span><span class="t">Flip back to: ${escapeHtml(SECTIONS[d.sec].title)}</span><span class="to">turn to ${DISPLAY[d.sec]}</span></button>`; });
    h += `<button class="choice ink-indigo" data-act="newgame"><span class="drop"></span><span class="t">Read the whole book again, keeping your hero, and find another ending</span><span class="to">turn to 1</span></button>`;
    return h;
  },
  turnAnim() { Sound.play('page', 200); },
  refreshStatus() {
    const st = this.st; if (!st) return;
    const el = document.getElementById('status'); if (!el) return;
    const pts = st.hero.points ? `<span class="pts" title="Unspent stat points">${st.hero.points}</span>` : '';
    el.innerHTML = `<span class="lv">${escapeHtml(st.hero.name)} · Lv ${st.hero.level}</span><span class="gold" title="Crowns">${st.run.gold}</span><span class="luck" title="Luck">${st.run.luck}</span><span class="inks"><i class="c" title="Crimson">${st.run.inks.crimson}</i><i class="g" title="Gold">${st.run.inks.gold}</i><i class="n" title="Indigo">${st.run.inks.indigo}</i></span>`;
    const sb = document.getElementById('btnSheet'); if (sb) sb.innerHTML = 'Adventure Sheet' + pts;
    const mg = document.getElementById('margin');
    if (mg) {
      const q = Object.entries(st.run.quests).filter(([, v]) => !v.done).sort((a, b) => (QUESTS[b[0]].main ? 1 : 0) - (QUESTS[a[0]].main ? 1 : 0)).slice(0, 2);
      mg.innerHTML = q.length ? q.map(([k, v]) => `<div class="mq"><b>${escapeHtml(QUESTS[k].title)}</b>${escapeHtml(QUESTS[k].stages[v.stage] || QUESTS[k].stages.start)}</div>`).join('') : `<div class="mq"><b>Margin notes</b>Your quests will be scribbled here as the story finds you.</div>`;
    }
  },

  /* ---------------- choices ---------------- */
  choose(i) {
    if (this.busy || this.turning) return;
    const st = this.st, c = this.sec.choices[i];
    if (!c) return;
    if (!Story.cond(st, c.need) || (c.lock && !Story.cond(st, c.lock))) { Sound.play('lock', 120); const b = document.querySelector(`.choice[data-i="${i}"]`); if (b) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); } return; }
    Sound.ensure(); Sound.play('click');
    const toasts = [];
    if (c.take) { const neg = {}; for (const k in c.take) { if (k === 'gold') neg.gold = -c.take.gold; else if (k === 'potion') { neg.potion = {}; for (const p in c.take.potion) neg.potion[p] = -c.take.potion[p]; } else if (k === 'key') neg.unkey = c.take.key; else if (k === 'item') neg.unitem = c.take.item; } Story.apply(st, neg, () => {}); }
    if (c.give) Story.apply(st, c.give, (t, k) => toasts.push([t, k]));
    if (c.ink) st.run.inks[c.ink] = (st.run.inks[c.ink] || 0) + 1;
    this.pendingToasts = toasts;
    const goTo = (dest) => {
      if (dest == null) return;
      if (typeof dest === 'object' && dest.battle) return this.startBattle(dest.battle, { win: dest.win, lose: dest.lose });
      const id = typeof dest === 'function' ? dest(st) : dest;
      if (c.endChapter) return this.chapterEnd(typeof c.endChapter === 'string' ? c.endChapter : null);
      this.go(id);
    };
    if (c.check) return this.roll(c.check, (pass) => goTo(pass ? c.pass : c.fail));
    if (c.battle) return this.startBattle(c.battle, { win: c.win, lose: c.lose });
    if (c.endChapter) return this.chapterEnd(typeof c.endChapter === 'string' ? c.endChapter : null);
    goTo(c.to);
  },
  act(a, ds) {
    const st = this.st;
    if (a === 'shop') return this.openShop();
    if (a === 'retry') return this.retryBattle();
    if (a === 'dogear') { const d = st.dogears[+ds.i]; if (!d) return; st.run = deepClone(d.run); this.lastBattle = null; this.go(d.sec, { silent: true }); return; }
    if (a === 'restart') {
      const ch = chapterOf(st.run.section);
      this.lastBattle = null; st.dogears = []; st.meta.dogearsUsed = 0;
      if (ch.start > 1 && st.chapterStart && st.chapterStart.sec === ch.start) { st.run = deepClone(st.chapterStart.run); this.go(ch.start, { silent: true }); return; }
      st.run = newRun(st.hero.origin); fixLoadout(st); this.go(1); return;
    }
    if (a === 'newgame') { const classes = st.run.classes.slice(); st.run = newRun(st.hero.origin); st.run.classes = classes; fixLoadout(st); st.dogears = []; st.meta.dogearsUsed = 0; st.chapterStart = null; this.lastBattle = null; this.go(1); }
    if (a === 'nextchapter') { const n = CHAPTERS[ds.ch]; if (n) this.go(n.start); }
  },
  fold() {
    const st = this.st, id = this.secId;
    if (this.sec.death || this.sec.ending) return;
    const ex = st.dogears.findIndex((d) => d.sec === id);
    if (ex >= 0) { Game.toast('This corner is already folded.'); return; }
    if (st.meta.dogearsUsed >= 3) { Game.toast('No folds left this chapter.'); Sound.play('lock'); return; }
    st.dogears.push({ sec: id, run: deepClone(st.run) }); st.meta.dogearsUsed++;
    Game.save(); Sound.play('page');
    document.getElementById('dogear').classList.add('folded');
    Game.toast(`Corner folded. ${3 - st.meta.dogearsUsed} fold${3 - st.meta.dogearsUsed === 1 ? '' : 's'} left.`);
  },
  chapterEnd(next) { this.turn(() => this.chapterEndPage(next)); },
  chapterEndPage(next) {
    const right = document.getElementById('pageText');
    const cur = chapterOf(this.secId), nx = next && CHAPTERS[next];
    Game.save();
    right.innerHTML = `<div class="sechead"><span class="secnum">Chapter ${cur.num}</span></div><h1 class="sectitle">${escapeHtml(cur.title)}</h1><div class="theend"><span>Chapter ${cur.num} Ends</span></div>
      <div class="prose"><p class="first">The page settles. Ink dries. You have folded ${this.st.meta.dogearsUsed} corners, won ${this.st.meta.battles} battles, and learned the ways of ${this.st.run.classes.length} callings.</p>${nx ? `<p class="tassel"><span class="rib"></span>${escapeHtml(nx.teaser)}</p>` : ''}</div>
      <div class="choices">${nx ? `<button class="choice ink-gold" data-act="nextchapter" data-ch="${next}"><span class="drop"></span><span class="t">Turn to Chapter ${nx.num}: ${escapeHtml(nx.title)}</span><span class="to">turn the page</span></button>` : this.endingChoices()}</div>`;
    right.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => this.act(b.dataset.act, b.dataset)));
  },

  /* ---------------- dice ---------------- */
  roll(check, done) {
    const st = this.st, S = equippedStats(st).s;
    const luck = !!check.luck;
    const m = Game.modal(`<div class="dice-card"><h2>${luck ? 'Test your Luck' : `${STAT_NAMES[check.stat]} check`}</h2>
      <p class="sub">${luck ? `Roll two dice. Equal to or under your Luck (${heroStats(st).luck}) and fortune smiles. Each test costs a point of Luck.` : `Roll two dice and add your ${STAT_NAMES[check.stat]} (${S[check.stat]}). You need ${check.target} or more.`}</p>
      <div class="dice"><div class="die" id="d1"></div><div class="die" id="d2"></div></div><div class="dres"></div>
      <button class="btn" id="rollBtn">Roll</button></div>`, { noClose: true });
    const pip = (el, n) => { const P = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }[n]; el.innerHTML = Array.from({ length: 9 }, (_, i) => `<i class="${P.includes(i + 1) ? 'on' : ''}"></i>`).join(''); };
    const d1 = m.querySelector('#d1'), d2 = m.querySelector('#d2'); pip(d1, 6); pip(d2, 6);
    const btn = m.querySelector('#rollBtn');
    btn.addEventListener('click', () => {
      if (btn.dataset.done) { Game.closeModal(); done(btn.dataset.pass === '1'); return; }
      btn.disabled = true; Sound.ensure(); Sound.play('dice');
      const a = randi(1, 6), b = randi(1, 6);
      let n = 0; d1.classList.add('roll'); d2.classList.add('roll');
      const iv = setInterval(() => { pip(d1, randi(1, 6)); pip(d2, randi(1, 6)); if (++n > 9) { clearInterval(iv); pip(d1, a); pip(d2, b); d1.classList.remove('roll'); d2.classList.remove('roll'); finish(); } }, 80);
      const finish = () => {
        let pass, txt;
        if (luck) { const L = heroStats(st).luck; pass = a + b <= L; st.run.luck = Math.max(0, st.run.luck - 1); txt = `You rolled ${a + b} against Luck ${L}. ${pass ? 'Lucky!' : 'Unlucky.'} Your Luck drops to ${st.run.luck}.`; }
        else { const tot = a + b + S[check.stat]; pass = tot >= check.target; txt = `${a} + ${b} + ${STAT_NAMES[check.stat]} ${S[check.stat]} = ${tot}. ${pass ? 'Success!' : 'Not enough.'}`; }
        const r = m.querySelector('.dres'); r.textContent = txt; r.className = 'dres ' + (pass ? 'pass' : 'fail');
        Sound.play(pass ? 'quest' : 'lock');
        btn.disabled = false; btn.textContent = 'Continue'; btn.dataset.done = '1'; btn.dataset.pass = pass ? '1' : '0';
      };
    });
  },

  /* ---------------- battle ---------------- */
  startBattle(id, dest) {
    this.dest = dest || {}; this.lastBattle = id; this.battleDone = false;
    Game.setMode('battle');
    R3.setWorld(BATTLES[id].scene);
    R3.clearActors();
    BView.begin(document.getElementById('view'));
    Battle.start(id, {});
    Sound.play('shout', 300);
  },
  retryBattle() { const id = this.lastBattle; if (!id) return; Battle.stop(); BView.end(); HUD.hide(); this.startBattle(id, this.dest); },
  applyBattleRewards(b) {
    if (this.battleDone) return; this.battleDone = true;
    const st = this.st;
    gainXp(st, b.xp); st.run.gold += b.gold; st.meta.battles++; st.run.battlesWon[b.id] = 1;
    Game.save();
  },
  battleEnded(won, b, fled) {
    Battle.stop(); BView.end(); HUD.hide(); HUD.hurtT = 0; R3.setFx({ uHurt: 0, uGrey: 0, uFlash: 0 }); R3.shake = 0; R3.zoom = 0;
    const d = this.dest || {};
    if (fled) { this.render([], {}); return; }
    if (won) { this.lastBattle = null; const t = this.pendingToasts || []; this.pendingToasts = null; if (d.win != null) this.go(typeof d.win === 'function' ? d.win(this.st) : d.win, { noTurn: true }); else this.render(t); return; }
    this.st.meta.deaths++;
    if (d.lose != null) { this.lastBattle = null; this.go(d.lose, { noTurn: true }); return; }
    // generic death page
    this.sec = { title: 'The Ink Takes You', scene: BATTLES[b.id].scene, death: true, text: [`You fall among the ${BATTLES[b.id].title.replace(/^The /, '').toLowerCase()} and do not rise. The words around you blur and run.`, 'T: Well. That is a shame. Shall we pretend that did not happen?'], actors: [A('tassel', 0, 420)] };
    this.secId = this.st.run.section;
    this.render([], {});
  },

  /* ---------------- shop ---------------- */
  openShop() {
    const st = this.st;
    const draw = () => {
      const pots = POTION_ORDER.filter((id) => POTIONS[id].price && (!POTIONS[id].lockedUntil || st.run.flags[POTIONS[id].lockedUntil]));
      const sh = this.sec && typeof this.sec.shop === 'object' ? this.sec.shop : { name: "Madam Tallow's Shelves" };
      const gear = Object.keys(ITEMS).filter((id) => ITEMS[id].price && !st.run.items.includes(id) && (ITEMS[id].market || 'quillsby') === (sh.market || 'quillsby'));
      return `<div class="shop"><h2>${escapeHtml(sh.name)}</h2><p class="sub">You have <b class="gold">${st.run.gold}</b> crowns.</p>
        <div class="grid">${pots.map((id) => `<div class="ware"><img src="${Icons.potion(id)}"><div><b>${POTIONS[id].name}</b><span>${POTIONS[id].desc}</span><em>Owned: ${st.run.potions[id] || 0}</em></div><button class="btn sm" data-buy="p:${id}" ${st.run.gold < POTIONS[id].price ? 'disabled' : ''}>${POTIONS[id].price} cr</button></div>`).join('')}
        ${gear.map((id) => { const it = ITEMS[id]; const r = RARITY[ITEM_RARITY[id] || 'common']; return `<div class="ware"><div class="gi" style="--r:${r ? r.color : '#ccc'}">${it.slot[0].toUpperCase()}</div><div><b style="color:${r ? r.color : 'inherit'}">${escapeHtml(it.name)}</b><span>${escapeHtml(itemLine(it))}</span><em>${escapeHtml(it.desc || '')}</em></div><button class="btn sm" data-buy="i:${id}" ${st.run.gold < it.price ? 'disabled' : ''}>${it.price} cr</button></div>`; }).join('')}</div></div>`;
    };
    const m = Game.modal(draw());
    const wire = () => m.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => {
      const [t, id] = b.dataset.buy.split(':');
      const price = t === 'p' ? POTIONS[id].price : ITEMS[id].price;
      if (st.run.gold < price) return;
      st.run.gold -= price;
      if (t === 'p') { st.run.potions[id] = (st.run.potions[id] || 0) + 1; fixBelt(st); } else { giveItem(st, id); if (canEquip(st, id)) equipItem(st, id); }
      Sound.play('coin'); Game.save(); this.refreshStatus(); R3.setActors(this.actorsOf(this.sec), st);
      m.querySelector('.mbody').innerHTML = draw(); wire();
    }));
    wire();
  },

  /* ---------------- adventure sheet ---------------- */
  openSheet(tab) {
    const st = this.st;
    tab = tab || 'hero';
    const draw = () => {
      const S = heroStats(st), E = equippedStats(st);
      const tabs = [['hero', 'Hero'], ['gear', 'Gear'], ['spells', 'Abilities'], ['party', 'Party'], ['satchel', 'Satchel'], ['quests', 'Quests']].map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('');
      let body = '';
      if (tab === 'hero') {
        body = `<div class="sheet-hero"><div class="who"><h3>${escapeHtml(st.hero.name)}</h3><p>Level ${st.hero.level} ${CLASSES[st.hero.origin].name}${st.run.classes.length > 1 ? ' · also ' + st.run.classes.filter((c) => c !== st.hero.origin).map((c) => CLASSES[c].name).join(', ') : ''}</p>
          <div class="xpbar"><i style="width:${(st.hero.xp / xpNeeded(st.hero.level)) * 100}%"></i><span>${st.hero.xp} / ${xpNeeded(st.hero.level)} XP</span></div>
          ${st.hero.points ? `<p class="pts">${st.hero.points} point${st.hero.points > 1 ? 's' : ''} to spend</p>` : ''}</div>
          <div class="stats">${STAT_KEYS.map((k) => `<div class="stat"><b>${STAT_NAMES[k]}</b><span class="v">${E.s[k]}${E.s[k] !== st.hero.stats[k] ? `<small> (${st.hero.stats[k]} base)</small>` : ''}</span>${st.hero.points ? `<button class="btn sm plus" data-plus="${k}">+</button>` : ''}<em>${STAT_HELP[k]}</em></div>`).join('')}</div>
          <div class="derived"><div><b>${S.maxHp}</b><span>Health</span></div><div><b>${Math.round(S.melee)}</b><span>Weapon dmg</span></div><div><b>${Math.round(S.spellPower * S.spellMul)}</b><span>Spell power</span></div><div><b>${Math.round(S.crit * 100)}%</b><span>Crit</span></div><div><b>${S.def}</b><span>Armor</span></div><div><b>${S.luck}</b><span>Luck</span></div></div></div>`;
      } else if (tab === 'gear') {
        body = ['weapon', 'offhand', 'head', 'body'].map((slot) => {
          const own = st.run.items.filter((id) => ITEMS[id] && ITEMS[id].slot === slot);
          return `<div class="gslot"><h4>${slot === 'offhand' ? 'Off hand' : slot[0].toUpperCase() + slot.slice(1)}</h4>${own.length ? own.map((id) => { const it = ITEMS[id], on = st.run.equip[slot] === id, ok = canEquip(st, id); const r = RARITY[ITEM_RARITY[id] || 'common']; return `<div class="gitem ${on ? 'on' : ''}"><div><b style="color:${r ? r.color : 'inherit'}">${escapeHtml(it.name)}</b><span>${escapeHtml(itemLine(it))}</span>${it.req ? `<em class="${ok ? '' : 'bad'}">Requires ${reqText(it.req)}</em>` : ''}</div>${on ? (slot === 'weapon' ? '<span class="eq">Equipped</span>' : `<button class="btn sm ghost" data-unequip="${slot}">Remove</button>`) : `<button class="btn sm" data-equip="${id}" ${ok ? '' : 'disabled'}>Equip</button>`}</div>`; }).join('') : '<p class="none">Nothing yet.</p>'}</div>`;
        }).join('');
      } else if (tab === 'spells') {
        const slots = (list, type) => list.map((id, i) => `<button class="lslot ${type}" data-clear="${type}:${i}" title="${id ? escapeHtml(AB[id].name + ': ' + AB[id].desc) : 'Empty'}">${id ? `<img src="${Icons.skill(id)}"><span>${AB[id].name}</span>` : `<span class="e">${type === 'active' ? i + 1 : '◇'}</span>`}</button>`).join('');
        const known = Object.keys(AB).filter((id) => st.run.classes.includes(AB[id].cls)).length;
        const row = (id) => { const a = AB[id], s2 = abilityStatus(st, id), on = (a.type === 'active' ? st.run.actives : st.run.passives).includes(id); return `<button class="spell ${a.type} ${s2.ok ? '' : 'locked'} ${on ? 'on' : ''}" data-skill="${id}" ${s2.ok ? '' : 'disabled'}><img src="${Icons.skill(id)}"><div><b>${a.name}</b><span>${a.desc}</span><em>${a.type === 'active' ? `Spell · ${a.cd}s` : 'Passive'}${s2.meets ? '' : ' · needs ' + reqText(a.req)}</em></div></button>`; };
        const filt = this.sheetCls && st.run.classes.includes(this.sheetCls) ? this.sheetCls : st.run.classes[0];
        body = `<p class="sub">Five spells for your bar and five passives that are always on. Tap an ability to equip it; tap a slot to empty it. You know <b>${known}</b> of ${Object.keys(AB).length} abilities.</p>
          <div class="lrow"><b>Spells</b><div class="loadout">${slots(st.run.actives, 'active')}</div></div>
          <div class="lrow"><b>Passives</b><div class="loadout">${slots(st.run.passives, 'passive')}</div></div>
          <div class="clstabs">${Object.keys(CLASSES).map((k) => { const kn = st.run.classes.includes(k); return `<button class="clstab ${k === filt ? 'on' : ''} ${kn ? '' : 'unknown'}" ${kn ? `data-cls="${k}"` : 'disabled'} title="${kn ? CLASSES[k].name : `${CLASSES[k].name}: learn from ${CLASSES[k].teacher}`}"><img src="${Icons.cls(k)}"><span>${kn ? CLASSES[k].name : '???'}</span></button>`; }).join('')}</div>
          <h4>${CLASSES[filt].name} <small>${escapeHtml(CLASSES[filt].blurb)}</small></h4>
          <div class="spells">${(CLASS_ABILS[filt] || []).map(row).join('')}</div>
          <p class="sub">${Object.keys(CLASSES).length - st.run.classes.length} callings remain unknown. Their masters are somewhere in the story.</p>`;
      } else if (tab === 'party') {
        const al = st.run.allies || [];
        body = `<p class="sub">Companions fight beside you in the battles that matter. The first three in this list come with you; tap one to bring them to the front.</p>
          ${al.length ? `<div class="party">${al.map((id, i) => { const c = CHAMPS[id]; return `<button class="pmember ${i < 3 ? 'on' : ''}" data-front="${id}"><img src="${Icons.cls(c.cls)}"><div><b>${escapeHtml(c.name)}</b><span>${CLASSES[c.cls].name} · ${c.role}</span><em>${c.abil.map((a) => AB[a].name).join(', ')}</em></div>${i < 3 ? '<span class="eq">In your party</span>' : ''}</button>`; }).join('')}</div>` : '<p class="none">Nobody has sworn to stand with you yet. Help people, and some of them will remember.</p>'}`;
      } else if (tab === 'satchel') {
        const pots = POTION_ORDER.filter((id) => st.run.potions[id] > 0);
        body = `<h4>Potions</h4><div class="pots">${pots.length ? pots.map((id) => `<div class="pitem"><img src="${Icons.potion(id)}"><div><b>${POTIONS[id].name} ×${st.run.potions[id]}</b><span>${POTIONS[id].desc}</span></div>${st.run.belt.includes(id) ? '<span class="eq">On belt</span>' : ''}</div>`).join('') : '<p class="none">No potions.</p>'}</div>
          <h4>Keepsakes</h4><div class="keys">${st.run.keys.length ? st.run.keys.map((k) => `<div class="kitem"><b>${escapeHtml((KEY_ITEMS[k] || { name: k }).name)}</b><span>${escapeHtml((KEY_ITEMS[k] || {}).desc || '')}</span></div>`).join('') : '<p class="none">Empty pockets.</p>'}</div>`;
      } else if (tab === 'quests') {
        const q = Object.entries(st.run.quests);
        const act = q.filter(([, v]) => !v.done), don = q.filter(([, v]) => v.done);
        body = `${act.length ? act.map(([k, v]) => `<div class="quest ${QUESTS[k] && QUESTS[k].main ? 'main' : ''}"><b>${escapeHtml(QUESTS[k].title)}</b><em>${escapeHtml(QUESTS[k].giver)}</em><span>${escapeHtml(QUESTS[k].stages[v.stage] || QUESTS[k].stages.start)}</span></div>`).join('') : '<p class="none">No open quests. Talk to people.</p>'}
          ${don.length ? `<h4>Completed</h4>${don.map(([k]) => `<div class="quest done"><b>${escapeHtml(QUESTS[k].title)}</b></div>`).join('')}` : ''}`;
      }
      return `<div class="sheet"><h2>Adventure Sheet</h2><div class="tabs">${tabs}</div><div class="tbody">${body}</div></div>`;
    };
    const m = Game.modal(draw(), { wide: true, onClose: () => { this.refreshStatus(); if (this.sec) R3.setActors(this.actorsOf(this.sec), st); } });
    const wire = () => {
      const q = (s, f) => m.querySelectorAll(s).forEach((b) => b.addEventListener('click', () => { f(b); Game.save(); m.querySelector('.mbody').innerHTML = draw(); wire(); }));
      q('[data-tab]', (b) => { tab = b.dataset.tab; Sound.play('page', 100); });
      q('[data-plus]', (b) => { if (st.hero.points > 0) { st.hero.stats[b.dataset.plus]++; st.hero.points--; fixLoadout(st); Sound.play('learn'); } });
      q('[data-equip]', (b) => { equipItem(st, b.dataset.equip); Sound.play('steel'); });
      q('[data-unequip]', (b) => { st.run.equip[b.dataset.unequip] = null; fixLoadout(st); });
      q('[data-skill]', (b) => { const id = b.dataset.skill, a = AB[id], L = a.type === 'active' ? st.run.actives : st.run.passives; if (L.includes(id)) return; const e = L.indexOf(null); L[e >= 0 ? e : 4] = id; if (st.run.cleared) delete st.run.cleared[id]; st.run.loadout = st.run.actives; Sound.play('click'); });
      q('[data-clear]', (b) => { const [type, i] = b.dataset.clear.split(':'); const L = type === 'active' ? st.run.actives : st.run.passives; if (L[+i]) { st.run.cleared = st.run.cleared || {}; st.run.cleared[L[+i]] = 1; } L[+i] = null; st.run.loadout = st.run.actives; });
      q('[data-cls]', (b) => { this.sheetCls = b.dataset.cls; });
      q('[data-front]', (b) => { const id = b.dataset.front, al = st.run.allies; const k = al.indexOf(id); if (k > 0) { al.splice(k, 1); al.unshift(id); } Sound.play('click'); });
    };
    wire();
  },

  /* ---------------- title & creation ---------------- */
  showTitle() {
    Game.setMode('title');
    R3.setWorld('moor'); R3.clearActors();
    const sv = Game.peek(), has = !!sv;
    const t = document.getElementById('title');
    t.innerHTML = `<div class="cover"><div class="cv-frame"><div class="cv-top">A Hundred-Path Tome</div><h1>Ink <span>&amp;</span> Valor</h1><div class="cv-sub">Chapter I · The Unending Night</div>
      <div class="cv-btns">${has ? `<button class="btn big" data-t="cont">Continue Reading<small>${escapeHtml(sv.hero.name)} · Lv ${sv.hero.level} ${escapeHtml(CLASSES[sv.hero.origin].name)}</small></button>` : ''}<button class="btn big ${has ? 'ghost' : ''}" data-t="new">${has ? 'A New Reader' : 'Open the Book'}</button><button class="lnk" data-t="code">Save code</button></div>
      <div class="cv-foot">Early demo · tap or click to fight · keys 1-4 for spells, Q W E for potions</div></div></div>`;
    t.classList.add('on');
    t.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => {
      Sound.ensure(); Sound.play('page');
      if (b.dataset.t === 'code') { Game.saveCodeModal(); return; }
      if (b.dataset.t === 'new' && has && !b.dataset.sure) { b.dataset.sure = '1'; b.innerHTML = 'Start over? This replaces your saved hero'; return; }
      t.classList.remove('on');
      if (b.dataset.t === 'cont') { Game.load(); this.go(Game.st.run.section || 0, { silent: true }); }
      else this.showCreate();
    }));
  },
  showCreate() {
    Game.setMode('book');
    R3.setWorld('moor');
    const look = { skin: 0, hairStyle: 0, hairColor: 2 };
    let origin = 'knight', name = '';
    const preview = () => { Game.st = newState(name || 'Reader', look, origin); R3.setActors([A('hero', 0, 455, 1, 'pose'), A('tassel', 120, 400)], Game.st); };
    const right = document.getElementById('pageText');
    const sw = (arr, key, cls) => arr.map((c, i) => `<button class="sw ${cls}" style="--c:${c}" data-k="${key}" data-v="${i}" aria-label="${key} ${i + 1}"></button>`).join('');
    const draw = () => {
      const kit = ORIGIN_KIT[origin];
      right.innerHTML = `<div class="sechead"><span class="secnum">The Reader's Page</span></div><h1 class="sectitle">Who holds the book?</h1>
        <div class="create">
          <label class="lbl">Your name</label><input id="cName" maxlength="18" placeholder="Reader" value="${escapeHtml(name)}">
          <label class="lbl">Your calling</label>
          <div class="origins">${ORIGINS.map((o) => `<button class="orig ${o === origin ? 'on' : ''}" data-o="${o}"><img src="${Icons.cls(o)}"><b>${CLASSES[o].name}</b></button>`).join('')}</div>
          <p class="oblurb">${escapeHtml(CLASSES[origin].blurb)} <em>Starts with: ${CLASS_ABILS[origin].map((id) => AB[id].name).join(', ')}. Twelve more callings wait to be learned in the story.</em></p>
          <div class="ostats">${STAT_KEYS.map((k) => `<span><b>${kit.stats[k]}</b>${STAT_NAMES[k]}</span>`).join('')}</div>
          <label class="lbl">Skin</label><div class="sws">${sw(SKINS, 'skin', '')}</div>
          <label class="lbl">Hair</label><div class="sws">${sw(HAIRS, 'hairColor', '')}</div>
          <div class="hs"><button class="btn sm ghost" data-hs="-1">‹</button><span>${HAIR_STYLES[look.hairStyle]}</span><button class="btn sm ghost" data-hs="1">›</button></div>
          <button class="btn big sign" id="cGo">Sign the Book</button>
        </div>`;
      right.querySelectorAll(`.sw[data-k="skin"]`)[look.skin].classList.add('on');
      right.querySelectorAll(`.sw[data-k="hairColor"]`)[look.hairColor].classList.add('on');
      right.querySelector('#cName').addEventListener('input', (e) => { name = e.target.value; });
      right.querySelectorAll('[data-o]').forEach((b) => b.addEventListener('click', () => { origin = b.dataset.o; Sound.play('click'); preview(); draw(); }));
      right.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { look[b.dataset.k] = +b.dataset.v; Sound.play('click'); preview(); draw(); }));
      right.querySelectorAll('[data-hs]').forEach((b) => b.addEventListener('click', () => { look.hairStyle = (look.hairStyle + +b.dataset.hs + HAIR_STYLES.length) % HAIR_STYLES.length; Sound.play('click'); preview(); draw(); }));
      right.querySelector('#cGo').addEventListener('click', () => { Game.st = newState((name || '').trim() || 'Reader', look, origin); Game.save(); Sound.play('quest'); this.go(0); });
    };
    document.getElementById('plateCap').innerHTML = '<b>Frontispiece</b>';
    preview(); draw(); this.refreshStatus(); this.turnAnim();
  },
};

function itemLine(it) {
  const p = [];
  if (it.dmg) p.push(`${it.dmg} damage`);
  if (it.def) p.push(`${it.def} armor`);
  if (it.spell) p.push(`+${it.spell} spell power`);
  if (it.stats) for (const k in it.stats) p.push(`+${it.stats[k]} ${STAT_NAMES[k]}`);
  return p.join(' · ');
}
