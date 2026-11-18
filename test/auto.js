window.__auto = setInterval(() => {
  try {
    if (Battle.active && Battle.b && Battle.b.state === 'fight') {
      const b = Battle.b, h = b.hero;
      const foes = b.ents.filter((e) => e.kind === 'foe' && !e.dead && e.state !== 'bones');
      if (foes.length && (!h.target || h.target.dead)) { const f = foes[0]; Battle.tap(f.x, f.y, f); }
      for (let i = 0; i < 4; i++) if (b.loadout[i] && b.cds[i] <= 0 && Math.random() < 0.3) Battle.useSkill(i);
      if (h.hp < h.maxHp * 0.4) Battle.usePotion(0);
    }
    const c = document.querySelector('#hResults:not(.hide) [data-act=cont]'); if (c && !window.__noCont) c.click();
  } catch (e) { console.error('auto', e); }
}, 400);
'auto on'
