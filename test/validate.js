(() => {
  const errs = [];
  if (!Game.st) Game.st = newState('Tester', 0, 'knight');
  const st = Game.st;
  const tgt = (v, where) => { if (v == null || typeof v === 'function') return; if (typeof v === 'object') { if (v.battle) { if (!BATTLES[v.battle]) errs.push(where + ' bad battle ' + v.battle); tgt(v.win, where + '.win'); tgt(v.lose, where + '.lose'); } return; } if (!SECTIONS[v]) errs.push(where + ' -> missing ' + v); };
  const chk = (id, eff) => { if (!eff) return; if (typeof eff === 'function') { try { eff = eff(st); } catch (e) { errs.push(id + ' once throw ' + e.message); return; } if (!eff) return; } for (const k of [].concat(eff.item || [], eff.gift || [])) if (!ITEMS[k]) errs.push(id + ' item ' + k); for (const k of [].concat(eff.key || [])) if (!KEY_ITEMS[k]) errs.push(id + ' key ' + k); if (eff.learn && !CLASSES[eff.learn]) errs.push(id + ' learn'); for (const k of [].concat(eff.ally || [])) if (!CHAMPS[k]) errs.push(id + ' ally ' + k); for (const q of Object.keys(eff.quest || {})) if (!QUESTS[q]) errs.push(id + ' quest ' + q); for (const q of [].concat(eff.questDone || [])) if (!QUESTS[q]) errs.push(id + ' questDone ' + q); if (eff.potion && typeof eff.potion === 'object') for (const p in eff.potion) if (!POTIONS[p]) errs.push(id + ' potion ' + p); };
  for (const [id, s] of Object.entries(SECTIONS)) {
    if (s.scene && s.scene !== 'blank' && !World.SCENES[s.scene]) errs.push(id + ' scene ' + s.scene);
    if (s.foes && !BATTLES[s.foes]) errs.push(id + ' foes ' + s.foes);
    if (!s.ending && !s.death && !(s.choices && s.choices.length)) errs.push(id + ' no choices');
    if (s.ending && !ENDINGS[s.ending]) errs.push(id + ' ending name');
    (s.choices || []).forEach((c, i) => { const w = id + '#' + i; if (c.battle && !BATTLES[c.battle]) errs.push(w + ' battle ' + c.battle); tgt(c.to, w); tgt(c.win, w); tgt(c.lose, w); tgt(c.pass, w); tgt(c.fail, w); if (typeof c.endChapter === 'string' && !CHAPTERS[c.endChapter]) errs.push(w + ' chapter'); if (!c.to && c.to !== 0 && !c.battle && !c.check && !c.endChapter) errs.push(w + ' dead choice'); chk(w, c.give); try { Story.cond(st, c.show); Story.cond(st, c.need); } catch (e) { errs.push(w + ' cond throw ' + e.message); } });
    let acts = []; try { acts = Book.actorsOf(s); } catch (e) { errs.push(id + ' actors throw ' + e.message); }
    for (const a of acts) { if (a.who === 'hero' || a.who === 'tassel') continue; if (a.who.startsWith('e:')) { if (!ENEMIES[a.who.slice(2)]) errs.push(id + ' actor ' + a.who); } else if (!CAST[a.who] || !CAST[a.who].rig) errs.push(id + ' actor ' + a.who); }
    try { const t = typeof s.text === 'function' ? s.text(st) : s.text; if (!Array.isArray(t)) errs.push(id + ' text'); } catch (e) { errs.push(id + ' text throw ' + e.message); }
    chk(id, s.once);
    if (DISPLAY[id] == null) errs.push(id + ' no display number');
  }
  const nums = Object.values(DISPLAY); if (new Set(nums).size !== nums.length) errs.push('duplicate display numbers');
  for (const [id, bd] of Object.entries(BATTLES)) { if (!World.SCENES[bd.scene]) errs.push('battle ' + id + ' scene ' + bd.scene); for (const w of bd.waves) for (const sp of w) if (!ENEMIES[sp.t] && !CHAMPS[sp.t]) errs.push('battle ' + id + ' enemy ' + sp.t); for (const a of bd.allies || []) if (!ENEMIES[a.t] && !CHAMPS[a.t]) errs.push('battle ' + id + ' ally ' + a.t); if (bd.boss && !bd.waves.some((w) => w.some((sp) => sp.t === bd.boss))) errs.push('battle ' + id + ' boss missing'); }
  for (const [k, c] of Object.entries(CHAMPS)) { const cfg = c.cfg(); if (!cfg || !cfg.rig) errs.push('champ cfg ' + k); for (const a of c.abil.concat(c.pass)) if (!AB[a]) errs.push('champ ' + k + ' ability ' + a); }
  // reachability
  const seen = new Set([0]), q = [0];
  const push = (v) => { if (v == null) return; if (typeof v === 'object') { if (v.win != null) push(v.win); if (v.lose != null) push(v.lose); return; } if (typeof v === 'function') { for (const f of [{}, { goblinPact: 1 }, { quietThief: 1 }]) { try { push(v({ run: Object.assign({}, st.run, { flags: f }), meta: st.meta })); } catch (e) {} } return; } if (!seen.has(v) && SECTIONS[v]) { seen.add(v); q.push(v); } };
  while (q.length) { const id = q.shift(), s = SECTIONS[id]; for (const c of s.choices || []) { push(c.to); push(c.win); push(c.lose); push(c.pass); push(c.fail); if (typeof c.endChapter === 'string') push(CHAPTERS[c.endChapter].start); } }
  const unreached = Object.keys(SECTIONS).map(Number).filter((n) => !seen.has(n));
  if (unreached.length) errs.push('unreachable: ' + unreached.join(','));
  return JSON.stringify({ sections: Object.keys(SECTIONS).length, battles: Object.keys(BATTLES).length, abilities: Object.keys(AB).length, classes: Object.keys(CLASSES).length, errs });
})()
