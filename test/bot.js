(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  Book.turnSpeed = 0.02;
  const O = window.__bot || {};
  const log = [];
  Game.st = newState('Bot', 0, O.origin || 'knight'); Game.st.settings.sound = false; Game.save();
  Book.go(0, { noTurn: true });
  await sleep(200);
  const main = { knight: 'might', barbarian: 'might', wizard: 'wits', rogue: 'grace', ranger: 'grace', cleric: 'heart' }[O.origin || 'knight'];
  let steps = 0, battles = 0, deaths = 0, lastCh = 'I', t0 = Date.now(), simT = 0;
  const visits = {};
  const errs = [];
  while (steps++ < (O.max || 900)) {
    await sleep(20);
    if (Book.turning) { await sleep(60); continue; }
    const st = Game.st;
    while (st.hero.points > 0) { st.hero.stats[st.hero.points % 2 ? 'heart' : main]++; st.hero.points--; }
    if (Game.mode === 'battle' && Battle.b) {
      const b = Battle.b; let n = 0;
      try {
        while (b.state !== 'won' && b.state !== 'lost' && n < 60 * 300) {
          const h = b.hero;
          if (n % 15 === 0 && b.state === 'fight') {
            const foes = b.ents.filter((e) => e.kind === 'foe' && !e.dead && e.state !== 'bones');
            if (foes.length && (!h.target || h.target.dead)) { foes.sort((a, c) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(c.x - h.x, c.y - h.y)); Battle.tap(foes[0].x, foes[0].y, foes[0]); }
            for (let k = 0; k < 5; k++) if (b.loadout[k] && b.cds[k] <= 0 && Math.random() < 0.35) Battle.useSkill(k);
            if (h.hp < h.maxHp * 0.35) Battle.usePotion(0);
          }
          Battle.update(1 / 60); n++;
        }
      } catch (e) { errs.push('battle ' + b.id + ': ' + e.message); }
      simT += n / 60;
      const won = b.state === 'won';
      log.push(`  [${b.id}] ${won ? 'won' : 'LOST'} ${Math.round(n / 60)}s L${st.hero.level}`);
      await sleep(1700);
      if (won) { battles++; const c = document.querySelector('#hResults [data-act=cont]'); if (c) c.click(); else errs.push('no continue button'); }
      else { deaths++; if (deaths > 12) { errs.push('too many deaths'); break; } const r = document.querySelector('#hResults [data-act=retry]'); if (r) r.click(); }
      await sleep(150);
      continue;
    }
    const sec = Book.sec, id = Book.secId;
    if (!sec) { await sleep(100); continue; }
    const ch = chapterOf(id).num;
    if (ch !== lastCh) { log.push(`== Chapter ${ch} at L${st.hero.level} (xp ${st.hero.xp}), classes ${st.run.classes.length}, allies ${(st.run.allies || []).join(',')}, align ${st.run.align || 0}`); lastCh = ch; }
    if (sec.ending) { log.push(`END: ${sec.ending} at L${st.hero.level}; battles ${battles}, deaths ${deaths}, sim battle time ${Math.round(simT)}s, sections visited ${Object.keys(visits).length}`); break; }
    visits[id] = (visits[id] || 0) + 1;
    if (visits[id] > 14) { errs.push('loop at ' + id); break; }
    const right = document.getElementById('pageText');
    const acts = [...right.querySelectorAll('.choice[data-act]')];
    const nx = acts.find((b) => b.dataset.act === 'nextchapter') || acts.find((b) => b.dataset.act === 'retry') || (sec.death ? (acts.find((b) => b.dataset.act === 'dogear') || acts.find((b) => b.dataset.act === 'restart')) : null);
    if (sec.death) log.push(`  DEATH at ${id} ${sec.title}`);
    if (nx) { nx.click(); await sleep(150); continue; }
    const btns = [...right.querySelectorAll('.choice[data-i]')].filter((b) => !b.classList.contains('locked'));
    if (!btns.length) { errs.push('stuck at ' + id + ' ' + sec.title); break; }
    let best = null, bs = -1e9;
    for (const bt of btns) {
      const c = sec.choices[+bt.dataset.i];
      const t = typeof c.to === 'number' ? c.to : c.win != null && typeof c.win === 'number' ? c.win : typeof c.pass === 'number' ? c.pass : null;
      let s = Math.random();
      if (t != null) s += visits[t] ? -3 * visits[t] : 6;
      if (c.battle) s += O.fight ? 4 : 1;
      if (c.endChapter) s += (O.lingers ? -2 : 1);
      if (/^(Leave|Back away|Not yet|Thank her|Let it drop|Climb back up the ladder)/.test(c.t)) s -= 4;
      for (const [p, w] of (O.prefs || [])) if (c.t.includes(p)) s += w;
      if (s > bs) { bs = s; best = bt; }
    }
    log.push(`${DISPLAY[id]}/${id} ${sec.title} -> ${sec.choices[+best.dataset.i].t.slice(0, 60)}`);
    best.click();
    await sleep(80);
    for (let k = 0; k < 40 && document.querySelector('#rollBtn'); k++) { const rb = document.querySelector('#rollBtn'); if (rb && !rb.disabled) rb.click(); await sleep(250); }
  }
  return JSON.stringify({ errs, real: Math.round((Date.now() - t0) / 1000), log: log.join('\n') });
})()
