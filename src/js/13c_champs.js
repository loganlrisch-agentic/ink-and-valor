/* ==========================================================================
   Champions - named heroes and villains who fight with full ability kits.
   They can stand beside you (allies) or against you (foes). Their power
   follows your level, so the finale is a real team fight either way.
   ========================================================================== */
const CHAMPS = {
  /* ---- heroes ---- */
  brannoc: { name: 'Captain Brannoc', cfg: () => Object.assign({}, CAST.brannoc), cls: 'knight', wt: 'sword', dmg: 11, hp: 230, armor: 9, abil: ['shield_rush', 'steel_whirl', 'bulwark', 'warcry'], pass: ['stalwart', 'iron_discipline'], role: 'tank' },
  amberly: { name: 'Sister Amberly', cfg: () => Object.assign({}, CAST.amberly, { weapon: { type: 'mace', color: '#c8ccd4' }, offhand: { type: 'tome', color: '#e8dcc0' } }), cls: 'cleric', wt: 'mace', dmg: 8, hp: 160, armor: 4, abil: ['mend', 'smite', 'radiance', 'sanctuary'], pass: ['blessed', 'martyrs_grace'], role: 'healer' },
  nim: { name: 'Nim Blackwick', cfg: () => Object.assign({}, CAST.nim), cls: 'rogue', wt: 'daggers', dmg: 6, hp: 150, armor: 3, abil: ['backstab', 'knife_fan', 'nightshade_edge', 'inkcloud'], pass: ['keen_edge', 'opportunist'], role: 'dps' },
  vane: { name: 'Inquisitor Vane', cfg: () => Object.assign({}, CAST.vane), cls: 'witchhunter', wt: 'crossbow', dmg: 14, hp: 170, armor: 5, abil: ['silver_bolt', 'firebrand_flask', 'snare_bola', 'hunters_mark'], pass: ['silver_oath', 'pitch_and_powder'], role: 'dps' },
  hessa: { name: 'Old Hessa', cfg: () => Object.assign({}, CAST.hessa), cls: 'stormcaller', wt: 'staff', dmg: 10, hp: 140, armor: 3, abil: ['gale_slash', 'tempest', 'updraft', 'thunderclap'], pass: ['static_charge', 'windwalker'], role: 'caster' },
  pip: { name: 'Pip the Bard', cfg: () => Object.assign({}, CAST.pip), cls: 'bard', wt: 'daggers', dmg: 6, hp: 140, armor: 3, abil: ['ballad_of_courage', 'discord', 'lullaby'], pass: ['inspiring_presence'], role: 'support' },
  ulfgar: { name: 'Ulfgar Ironbelly', cfg: () => Object.assign({}, CAST.ulfgar), cls: 'barbarian', wt: 'greataxe', dmg: 15, hp: 240, armor: 5, abil: ['cleave', 'leap_slam', 'bloodrage', 'earthshaker'], pass: ['thick_hide', 'berserk_blood'], role: 'tank' },
  ash: { name: 'Brother Ash', cfg: () => Object.assign({}, CAST.ash), cls: 'monk', wt: 'fists', dmg: 8, hp: 170, armor: 5, abil: ['hundred_fists', 'still_lake_palm', 'flying_crane', 'inner_peace'], pass: ['iron_body', 'flowing_water'], role: 'dps' },
  fen: { name: 'Mother Fen', cfg: () => Object.assign({}, CAST.fen), cls: 'witch', wt: 'staff', dmg: 9, hp: 150, armor: 3, abil: ['hex_of_toads', 'withering_curse', 'bog_burst'], pass: ['covens_malice', 'black_cat'], role: 'caster' },
  sable: { name: 'Sable of the Hollow Guild', cfg: () => Object.assign({}, CAST.sable), cls: 'shadowblade', wt: 'daggers', dmg: 7, hp: 145, armor: 3, abil: ['shadowstep', 'blade_dance', 'death_mark'], pass: ['killing_edge', 'nightstalker'], role: 'dps' },
  quire: { name: 'Archivist Quire', cfg: () => Object.assign({}, CAST.quire), cls: 'scrivener', wt: 'staff', dmg: 9, hp: 140, armor: 3, abil: ['strike_through', 'footnote', 'exclamation', 'rewrite'], pass: ['marginalia', 'italics'], role: 'caster' },
  aldric: { name: 'Sir Aldric the Unfaded', cfg: () => Object.assign({}, CAST.aldric), cls: 'paladin', wt: 'hammer', dmg: 13, hp: 220, armor: 9, abil: ['judgment', 'consecration', 'divine_shield', 'lay_on_hands'], pass: ['aura_of_valor', 'bane_of_the_dead'], role: 'tank' },
  /* ---- villains ---- */
  unbinder: { name: 'The Unbinder', cfg: () => Object.assign({}, CAST.unbinder), cls: 'scrivener', wt: 'sword', dmg: 16, hp: 720, armor: 8, boss: true, abil: ['strike_through', 'exclamation', 'shadowstep', 'death_mark', 'rewrite'], pass: ['killing_edge', 'plot_armor', 'marginalia'], role: 'boss', xp: 160, gold: [80, 80], cdMul: 1.1 },
  vellum: { name: 'Lord Chancellor Vellum', cfg: () => Object.assign({}, CAST.vellum), cls: 'alchemist', wt: 'staff', dmg: 10, hp: 220, armor: 5, abil: ['volatile_flask', 'acid_splash', 'homunculus'], pass: ['volatile_reagents'], role: 'caster', xp: 40, gold: [30, 30] },
  errata: { name: 'The Red Errata', cfg: () => Object.assign({}, CAST.errata), cls: 'knight', wt: 'greataxe', dmg: 15, hp: 280, armor: 10, abil: ['leap_slam', 'cleave', 'warcry'], pass: ['unstoppable', 'thick_hide'], role: 'tank', xp: 40, gold: [20, 20] },
  gloam: { name: 'Mother Gloam', cfg: () => Object.assign({}, CAST.gloam), cls: 'witch', wt: 'staff', dmg: 10, hp: 200, armor: 4, abil: ['bog_burst', 'withering_curse', 'hex_of_toads', 'blood_moon_rite'], pass: ['covens_malice', 'black_cat'], role: 'caster', xp: 40, gold: [20, 20] },
  agatha_c: { name: 'Red Agatha', cfg: () => Object.assign({}, CAST.agatha), cls: 'rogue', wt: 'daggers', dmg: 8, hp: 200, armor: 4, abil: ['backstab', 'knife_fan', 'inkcloud'], pass: ['keen_edge', 'opportunist'], role: 'dps', xp: 35, gold: [20, 20] },
  grubnose_c: { name: 'Grubnose, the Gutter King', cfg: () => Object.assign({}, CAST.grubnose), cls: 'barbarian', wt: 'greataxe', dmg: 15, hp: 330, armor: 6, abil: ['earthshaker', 'leap_slam', 'bloodrage'], pass: ['thick_hide', 'berserk_blood'], role: 'tank', xp: 40, gold: [30, 30] },
  barrow_king: { name: 'The Barrow King', cfg: () => Object.assign({}, CAST.barrow_king), cls: 'necromancer', wt: 'staff', dmg: 12, hp: 620, armor: 7, boss: true, undead: true, abil: ['bone_spear', 'raise_dead', 'curse_of_rot', 'drain_life'], pass: ['soul_harvest', 'grave_pact'], role: 'boss', xp: 120, gold: [60, 60], cdMul: 1.0 },
  veyra_c: { name: 'Veyra, the Grave Witch', cfg: () => Object.assign({}, CAST.veyra), cls: 'necromancer', wt: 'sickle', dmg: 9, hp: 170, armor: 4, abil: ['bone_spear', 'raise_dead', 'drain_life'], pass: ['deaths_due', 'grave_pact'], role: 'caster', xp: 30, gold: [15, 15] },
};

function champStats(d, P, lvl) {
  const wt = Object.assign({}, WEAPON_TYPES[d.wt]);
  if (wt.kind === 'ranged') wt.range *= 1 + P.range;
  return {
    melee: d.dmg * (1 + lvl * 0.07) * (1 + P.melee), spellPower: 9 + lvl * 1.5, spellMul: (1.25 + lvl * 0.03) * (1 + P.spell),
    crit: 0.07 + P.crit, critPow: 1.8 + P.critPow, atkSpeed: 1 + P.atkSpd, move: 150 * (1 + P.move), heal: 1.1 + P.heal,
    dmgTaken: 30 / (30 + (d.armor || 4) + P.def) * (1 - Math.min(0.6, P.dr)), dodge: Math.min(0.35, P.dodge), cdr: P.cdr, wt,
  };
}
function makeChamp(b, kind, type) {
  const d = CHAMPS[type], st = Game.st;
  const hl = st ? st.hero.level : 3;
  const lvl = Math.max(1, hl + (kind === 'foe' ? (d.boss ? 1 : 0) : 0));
  const P = computeP(d.pass);
  const S = champStats(d, P, lvl);
  if (kind === 'ally') { S.melee *= 0.8; S.spellMul *= 0.8; S.heal *= 0.85; }
  if (kind === 'foe' && b.def.champDmg) { S.melee *= b.def.champDmg; S.spellMul *= b.def.champDmg; }
  const diff = kind === 'foe' && st && st.settings.difficulty === 'story' ? 0.8 : 1;
  const hp = Math.round(d.hp * (1 + 0.11 * (lvl - 1)) * (1 + P.maxHp) * diff * (kind === 'foe' ? (b.def.champHp || 1) : 0.8));
  const acd = {}; for (const id of d.abil) acd[id] = rand(1.5, 5);
  return {
    kind, type, champ: true, cfg: d.cfg(), hp, maxHp: hp, r: d.boss ? 18 : 15, speed: S.move, dmgMul: kind === 'ally' ? 0.8 : 1, name: d.name, boss: !!d.boss && kind === 'foe',
    def: { name: d.name, ai: 'champ', xp: d.xp || 30, gold: d.gold || [10, 15], undead: !!d.undead, nonlethal: !!d.nonlethal, cdMul: d.cdMul || 1.3, role: d.role },
    S, P, abil: d.abil.slice(), acd,
  };
}

function champTarget(b, e, E) {
  let best = null, bs = 1e9;
  for (const o of E) {
    let s = dist(e.x, e.y, o.x, o.y);
    if (e.kind === 'foe' && o.kind === 'hero') s *= b.def.spreadAggro ? 1.3 : 0.9;
    if (o.champ) s *= 0.9;
    if (o.summon) s *= 1.3;
    if (o.def && o.def.taunt) s *= 0.5;
    if (s < bs) { bs = s; best = o; }
  }
  return best;
}
function champWants(b, e, a, E) {
  const F = friendsOf(b, e);
  const fx = a.fx || [];
  const has = (t) => fx.some((f) => f.t === t || (f.fx && f.fx.some((g) => g.t === t)) || (f.land && f.land.some((g) => g.t === t)));
  const near = (r) => E.filter((o) => dist(o.x, o.y, e.x, e.y) < r).length;
  if (has('heal') && (a.tg === 'ally' || a.tg === 'self')) { if (fx.some((f) => f.team)) return F.some((o) => o.hp < o.maxHp * 0.6); return F.some((o) => o.hp < o.maxHp * 0.5 && dist(o.x, o.y, e.x, e.y) < 600); }
  if (a.tg === 'self') {
    if (has('shield') || ['bulwark', 'divine_shield', 'bear_form', 'inner_peace', 'soul_ward', 'rewrite', 'vanish', 'inkcloud'].includes(a.id)) return e.hp < e.maxHp * 0.55 && near(260) > 0;
    if (has('summon') || has('buff') || a.id === 'encore') return near(420) > 0;
    if (has('zone')) return near(140) > 0;
    if (has('blink')) return near(110) > 0;
    return near(150) > (e.boss ? 0 : (E.length > 1 ? 1 : 0));
  }
  const t = pickTarget(b, e, a);
  if (!t) return false;
  if (a.id === 'hunters_mark' || a.id === 'death_mark') return t.hp > t.maxHp * 0.4;
  return true;
}

function champThink(b, e, dt) {
  if (isDisabled(e)) { e.state = 'stun'; return; }
  if (e.status.fear > 0) { const h = nearest(foesOf(b, e), e.x, e.y, 2000) || b.hero; const ax = e.x - h.x, ay = e.y - h.y, L = Math.hypot(ax, ay) || 1; moveToward(b, e, e.x + ax / L * 100, e.y + ay / L * 60, e.speed, dt); e.state = 'run'; return; }
  if (e.channel) { tickChannel(b, e, dt); return; }
  if (e.dash) return;
  e.atkCd -= dt * atkSpeedMul(b, e);
  for (const k in e.acd) if (e.acd[k] > 0) e.acd[k] -= dt * (1 + (e.S.cdr || 0));
  if (isAtk(e.state) || e.state === 'spin' || e.state === 'hurt' || e.posing || e.state === 'roar') return;
  const E = enemiesOf(b, e);
  if (!E.length) { e.state = 'idle'; return; }
  e.think = (e.think || 0) - dt;
  if (e.think <= 0 && b.state === 'fight') {
    e.think = 0.35 + Math.random() * 0.35;
    const ready = e.abil.filter((id) => e.acd[id] <= 0);
    for (let i = ready.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ready[i], ready[j]] = [ready[j], ready[i]]; }
    for (const id of ready) {
      const a = AB[id];
      if (!champWants(b, e, a, E)) continue;
      if (castAbility(b, e, id)) { e.acd[id] = a.cd * (e.def.cdMul || 1.3) + rand(0, 1.5); return; }
    }
  }
  let tg = e.target;
  if (!tg || tg.dead || !targetable(tg) || sideOf(tg) === sideOf(e)) { tg = champTarget(b, e, E); e.target = tg; }
  if (!tg) { e.state = 'idle'; return; }
  const wt = e.S.wt, ranged = wt.kind === 'ranged';
  const dx = tg.x - e.x, dy = tg.y - e.y, d = Math.hypot(dx, dy * 1.3);
  e.facing = dx < 0 ? -1 : 1;
  const spd = e.S.move * buffSpeed(e) * (e.status.slow > 0 ? 0.6 : 1) * (e.status.root > 0 ? 0 : 1);
  if (ranged && d < 90 && spd > 0) { moveToward(b, e, e.x - Math.sign(dx || 1) * 80, e.y + rand(-30, 30), spd, dt); e.state = 'run'; return; }
  const inRange = ranged ? d <= wt.range : Math.abs(dx) <= wt.range + tg.r * 0.6 && Math.abs(dy) <= 26;
  if (inRange) { if (e.atkCd <= 0) heroAttack(b, e, tg); else e.state = 'idle'; }
  else {
    let gx = tg.x, gy = tg.y;
    if (!ranged) { const side = e.x < tg.x ? -1 : 1; gx = tg.x + side * (tg.r + wt.range * 0.55); }
    else { gx = tg.x - Math.sign(dx || 1) * wt.range * 0.8; }
    moveToward(b, e, gx, gy, spd, dt); e.state = 'run';
  }
}

/* champions learn their calling's capstone spell too */
for (const [k, id] of Object.entries({ brannoc: 'banner_of_the_watch', amberly: 'dawns_mercy', nim: 'thousand_cuts', vane: 'burn_the_witch', hessa: 'hurricane', pip: 'grand_finale', ulfgar: 'skullsplitter', ash: 'mountain_palm', fen: 'hags_moon', sable: 'mirror_of_night', quire: 'the_end', aldric: 'hammer_of_dawn', barrow_king: 'army_of_the_grave', vellum: 'chain_reaction' })) if (CHAMPS[k] && AB[id] && !CHAMPS[k].abil.includes(id)) CHAMPS[k].abil.push(id);
