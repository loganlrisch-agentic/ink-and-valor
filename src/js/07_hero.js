/* ==========================================================================
   Hero - state, derived stats, loadout, appearance
   ========================================================================== */
const STAT_KEYS = ['might', 'wits', 'grace', 'heart'];
const STAT_NAMES = { might: 'Might', wits: 'Wits', grace: 'Grace', heart: 'Heart' };
const STAT_HELP = { might: 'Weapon damage for swords, axes and maces. Unlocks warrior abilities and heavy armor.', wits: 'Spell power and staff damage. Unlocks most spells.', grace: 'Critical hits, attack and move speed, bows and knives. Unlocks agile abilities.', heart: 'Health and healing. Unlocks holy, nature and protective abilities.' };

const ORIGIN_KIT = {
  knight: { stats: { might: 4, wits: 1, grace: 1, heart: 2 }, equip: { weapon: 'notched_sword', offhand: 'buckler', head: 'dented_helm', body: 'padded_gambeson' }, cape: '#7a1f1b' },
  wizard: { stats: { might: 1, wits: 3, grace: 2, heart: 2 }, equip: { weapon: 'ashwood_staff', offhand: null, head: 'pointed_hat', body: 'ash_robe' }, cape: null },
  rogue: { stats: { might: 2, wits: 1, grace: 3, heart: 2 }, equip: { weapon: 'twin_knives', offhand: null, head: 'shadow_hood', body: 'night_leathers' }, cape: '#1c2420' },
  cleric: { stats: { might: 2, wits: 2, grace: 1, heart: 3 }, equip: { weapon: 'iron_mace', offhand: 'prayer_book', head: 'silver_circlet', body: 'vestments' }, cape: null },
  ranger: { stats: { might: 1, wits: 2, grace: 3, heart: 2 }, equip: { weapon: 'hunting_bow', offhand: null, head: 'wolf_hood', body: 'ranger_leathers' }, cape: '#3a4a2a', back: { type: 'quiver' } },
  barbarian: { stats: { might: 4, wits: 1, grace: 1, heart: 2 }, equip: { weapon: 'woodsman_axe', offhand: null, head: 'horned_cap', body: 'fur_jerkin' }, cape: null },
};

function newRun(origin) {
  const kit = ORIGIN_KIT[origin];
  const run = {
    section: 0, flags: {}, inks: { crimson: 0, gold: 0, indigo: 0 }, gold: 10, luck: 8,
    potions: { heal: 2 }, belt: ['heal', null, null],
    items: Object.values(kit.equip).filter(Boolean), equip: Object.assign({}, kit.equip),
    keys: [], classes: [origin], actives: [null, null, null, null, null], passives: [null, null, null, null, null], quests: {}, once: {}, battlesWon: {}, allies: [], align: 0,
  };
  return run;
}

function newState(name, look, origin) {
  const kit = ORIGIN_KIT[origin];
  const st = {
    v: 3,
    hero: { name: name || 'Reader', look, origin, level: 1, xp: 0, points: 0, stats: Object.assign({}, kit.stats) },
    run: newRun(origin),
    meta: { visited: {}, endings: {}, deaths: 0, battles: 0, started: Date.now(), dogearsUsed: 0 },
    dogears: [],
    settings: { sound: true, difficulty: 'normal' },
  };
  fixLoadout(st);
  return st;
}

function equippedStats(st) {
  const s = Object.assign({}, st.hero.stats);
  let def = 0, spell = 0;
  for (const slot of ['weapon', 'offhand', 'head', 'body']) {
    const it = ITEMS[st.run.equip[slot]];
    if (!it) continue;
    if (it.stats) for (const k in it.stats) s[k] += it.stats[k];
    def += it.def || 0; spell += it.spell || 0;
  }
  return { s, def, spell };
}

function heroPassives(st) { return computeP((st.run.passives || []).filter((id) => id && abilityStatus(st, id).ok)); }
function heroStats(st) {
  const { s, def, spell } = equippedStats(st);
  const P = heroPassives(st);
  const w = ITEMS[st.run.equip.weapon] || ITEMS.notched_sword;
  const wt = Object.assign({}, WEAPON_TYPES[w.wt]);
  if (wt.kind === 'ranged') wt.range *= 1 + P.range;
  const maxHp = (70 + s.heart * 12 + (st.hero.level - 1) * 7) * (1 + P.maxHp);
  let luck = st.run.luck + P.luck;
  if (st.run.keys.includes('hangmans_coin')) luck += 2;
  if (st.run.keys.includes('wrens_ribbon')) luck += 2;
  const D = def + P.def;
  return {
    might: s.might, wits: s.wits, grace: s.grace, heart: s.heart, P,
    maxHp: Math.round(maxHp), def: D, spellPower: 9 + spell + (st.hero.level - 1) * 0.6, weapon: w, wt,
    melee: w.dmg * (1 + 0.12 * s[wt.stat]) * (1 + P.melee) * (wt.kind === 'ranged' ? 1 + P.rangedDmg : 1) * (1 + (st.hero.level - 1) * 0.03),
    spellMul: (1 + 0.12 * s.wits) * (1 + P.spell),
    crit: Math.min(0.75, 0.05 + 0.015 * s.grace + P.crit + (wt.crit || 0)), critPow: 1.8 + P.critPow,
    atkSpeed: (1 + 0.04 * s.grace) * (1 + P.atkSpd), move: 165 * (1 + 0.02 * s.grace) * (1 + P.move), heal: (1 + 0.05 * s.heart) * (1 + P.heal),
    dmgTaken: 30 / (30 + D) * (1 - Math.min(0.6, P.dr)), luck, dodge: Math.min(0.4, P.dodge), cdr: Math.min(0.5, P.cdr),
  };
}

function meetsReq(st, req) {
  if (!req) return true;
  const { s } = equippedStats(st);
  for (const k in req) if ((s[k] || 0) < req[k]) return false;
  return true;
}
function reqText(req) { return Object.entries(req || {}).map(([k, v]) => `${STAT_NAMES[k]} ${v}`).join(', '); }

function abilityStatus(st, id) {
  const a = AB[id]; if (!a) return { ok: false, known: false, meets: false };
  const known = st.run.classes.includes(a.cls), meets = meetsReq(st, a.req);
  return { ok: known && meets, known, meets };
}
function skillStatus(st, id) { const r = abilityStatus(st, id); return { learned: r.known, meets: r.meets, ok: r.ok }; }
function knownSkills(st) { return Object.keys(AB).filter((id) => st.run.classes.includes(AB[id].cls)); }

/* 5 active + 5 passive slots; keep what is valid, auto-fill empty slots */
function fixLoadout(st) {
  const R = st.run;
  if (!R.actives) { R.actives = (R.loadout || []).concat([null, null, null, null, null]).slice(0, 5); }
  if (!R.passives) R.passives = [null, null, null, null, null];
  while (R.actives.length < 5) R.actives.push(null);
  while (R.passives.length < 5) R.passives.push(null);
  for (const [L, type] of [[R.actives, 'active'], [R.passives, 'passive']]) {
    for (let i = 0; i < 5; i++) if (L[i] && (!AB[L[i]] || AB[L[i]].type !== type || !abilityStatus(st, L[i]).ok)) L[i] = null;
    for (const id of knownSkills(st)) {
      if (AB[id].type !== type || L.includes(id) || !abilityStatus(st, id).ok) continue;
      if (R.cleared && R.cleared[id]) continue;
      const e = L.indexOf(null); if (e < 0) break; L[e] = id;
    }
  }
  R.loadout = R.actives;
}

function fixBelt(st) {
  const B = st.run.belt, P = st.run.potions;
  for (let i = 0; i < 3; i++) if (B[i] && !(P[B[i]] > 0)) B[i] = null;
  for (const id of POTION_ORDER) {
    if (!(P[id] > 0) || B.includes(id)) continue;
    const e = B.indexOf(null);
    if (e < 0) break;
    B[e] = id;
  }
}

function xpNeeded(level) { const k = level - 1; return 20 + k * 35 + k * k * 2; }
function gainXp(st, n) {
  const h = st.hero; let lv = 0;
  h.xp += n;
  while (h.xp >= xpNeeded(h.level)) { h.xp -= xpNeeded(h.level); h.level++; h.points += 2; lv++; }
  return lv;
}

function canEquip(st, id) { const it = ITEMS[id]; return !it.req || meetsReq(st, it.req); }

function heroCfg(st, overrideEquip) {
  const L = st.hero.look, e = overrideEquip || st.run.equip;
  const cfg = {
    rig: 'human', skin: SKINS[L.skin] || SKINS[0], hair: { style: HAIR_STYLES[L.hairStyle] || 'spiky', color: HAIRS[L.hairColor] || HAIRS[0] },
    face: 'hero', legs: '#3b3340', boots: '#2a1e1a', blinkSeed: 0.3, scale: 1,
    cape: (ORIGIN_KIT[st.hero.origin] || {}).cape || null,
  };
  const body = ITEMS[e.body], head = ITEMS[e.head], wpn = ITEMS[e.weapon], off = ITEMS[e.offhand];
  cfg.body = body ? Object.assign({}, body.vis) : { type: 'tunic', color: '#5a4a3a' };
  if (head) cfg.hat = Object.assign({}, head.vis);
  if (wpn) cfg.weapon = Object.assign({}, wpn.vis);
  const twoHand = wpn && ['daggers', 'crossbow', 'bow', 'greataxe', 'spear', 'fists'].includes(wpn.wt);
  if (off && !twoHand) cfg.offhand = Object.assign({}, off.vis);
  if (cfg.body.type === 'armor') cfg.gauntlets = true;
  const kit = ORIGIN_KIT[st.hero.origin] || {};
  if (kit.back && wpn && wpn.wt === 'bow') cfg.back = kit.back;
  else if (wpn && wpn.wt === 'bow') cfg.back = { type: 'quiver' };
  if (cfg.body.type === 'bare') { cfg.bracers = '#5a3a22'; }
  if (wpn && wpn.wt === 'fists') { cfg.weapon = null; cfg.wraps = '#efe6d2'; }
  if (cfg.body.type === 'robe') cfg.legs = '#2a2430';
  return cfg;
}

function hasItem(st, id) { return st.run.items.includes(id); }
function giveItem(st, id) { if (!st.run.items.includes(id)) st.run.items.push(id); }
function equipItem(st, id) {
  const it = ITEMS[id]; if (!it) return false;
  if (!canEquip(st, id)) return false;
  st.run.equip[it.slot] = id;
  if (it.slot === 'weapon' && (it.wt === 'daggers' || it.wt === 'crossbow')) { /* offhand hidden but kept */ }
  fixLoadout(st);
  return true;
}
