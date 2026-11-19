(() => {
  const out = [];
  const plan = window.__plan;
  for (const P of plan) {
    const st = newState('Sim', 0, P.origin);
    st.hero.level = P.lvl; st.hero.points = 0;
    const main = { knight: 'might', barbarian: 'might', wizard: 'wits', rogue: 'grace', ranger: 'grace', cleric: 'heart' }[P.origin];
    st.hero.stats[main] += (P.lvl - 1); st.hero.stats.heart += (P.lvl - 1);
    st.run.classes = Array.from(new Set([P.origin].concat(P.classes || [])));
    st.run.allies = (P.allies || []).slice();
    st.run.potions.heal = P.pots != null ? P.pots : 4;
    if (P.items) for (const it of P.items) { giveItem(st, it); equipItem(st, it); }
    st.run.actives = (P.actives || CLASS_ABILS[P.origin].filter((id) => AB[id].type === 'active')).concat([null, null, null, null, null]).slice(0, 5);
    st.run.passives = (P.passives || CLASS_ABILS[P.origin].filter((id) => AB[id].type === 'passive')).concat([null, null, null, null, null]).slice(0, 5);
    st.run.loadout = st.run.actives;
    if (P.flags) Object.assign(st.run.flags, P.flags);
    Game.st = st;
    let err = null, n = 0;
    try {
      Battle.start(P.id, {});
      for (let i = 0; i < 60 * 240 && Battle.b && Battle.b.state !== 'won' && Battle.b.state !== 'lost'; i++) {
        const b = Battle.b, h = b.hero;
        if (i % 15 === 0 && b.state === 'fight') {
          const foes = b.ents.filter((e) => e.kind === 'foe' && !e.dead && e.state !== 'bones');
          if (foes.length && (!h.target || h.target.dead)) { foes.sort((a, c) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(c.x - h.x, c.y - h.y)); const f = foes[0]; Battle.tap(f.x, f.y, f); }
          for (let k = 0; k < 5; k++) if (b.loadout[k] && b.cds[k] <= 0 && Math.random() < 0.35) Battle.useSkill(k);
          if (h.hp < h.maxHp * 0.35) Battle.usePotion(0);
        }
        Battle.update(1 / 60); n++;
      }
    } catch (e) { err = e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | '); }
    const b = Battle.b;
    const allies = b ? b.ents.filter((e) => e.kind === 'ally').map((e) => `${e.type}:${e.dead ? 'X' : Math.round(e.hp)}`).join(' ') : '';
    const foes = b ? b.ents.filter((e) => e.kind === 'foe' && !e.dead).map((e) => `${e.type}:${Math.round(e.hp)}/${e.maxHp}`).join(' ') : '';
    out.push(`${P.id} L${P.lvl} ${P.origin}: ${b ? b.state : 'none'} ${Math.round(n / 60)}s hp ${b ? Math.round(b.hero.hp) + '/' + b.hero.maxHp : ''} xp ${b ? b.xp : ''} gold ${b ? b.gold : ''} | allies ${allies} | left ${foes}${err ? ' | ERR ' + err : ''}`);
    try { Battle.stop(); } catch (e) {}
  }
  return out.join('\n');
})()
