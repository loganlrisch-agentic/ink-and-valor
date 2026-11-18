(() => {
  let n = 0;
  for (let i = 0; i < 3000 && Battle.b && Battle.b.state !== 'won' && Battle.b.state !== 'lost'; i++) {
    const b = Battle.b, h = b.hero;
    if (i % 20 === 0 && b.state === 'fight') {
      const foes = b.ents.filter((e) => e.kind === 'foe' && !e.dead && e.state !== 'bones');
      if (foes.length && (!h.target || h.target.dead)) { const f = foes[0]; Battle.tap(f.x, f.y, f); }
      for (let k = 0; k < 4; k++) if (b.loadout[k] && b.cds[k] <= 0 && Math.random() < 0.2) Battle.useSkill(k);
      if (h.hp < h.maxHp * 0.4) Battle.usePotion(0);
    }
    Battle.update(1 / 60); n++;
  }
  const b = Battle.b; return b ? `${b.state} after ${n} steps, kills ${b.kills}, hp ${Math.round(b.hero.hp)}/${b.hero.maxHp}, xp ${b.xp}, gold ${b.gold}` : 'none';
})()
