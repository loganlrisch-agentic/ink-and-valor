/* ==========================================================================
   Gear II - trinkets (a fifth gear slot, each with a quirky boost and a
   random rolled bonus) and a wave of better-looking weapons and armor.
   ========================================================================== */
const TRINKETS = {
  rabbits_foot: { name: 'Rabbit’s Foot', gem: '#e8e0d0', desc: '+2 Luck and 8% chance to dodge.', P: { luck: 2, dodge: 0.08 } },
  gamblers_die: { name: 'Gambler’s Die', gem: '#e8e8f0', desc: 'Every weapon hit has a 12% chance to strike again for 150%.', P: { onHit: [{ c: 0.12, auto: true, fx: [{ t: 'dmg', m: 1.5, s: 'melee', at: 'tgt' }, { t: 'text', s: 'Lucky!', c: '#ffe08a' }] }] } },
  ember_heart: { name: 'Ember Heart', gem: '#ff6a2a', desc: 'Weapon hits have a 15% chance to set foes burning. Fire spells +12%.', P: { onHit: [{ c: 0.15, auto: true, fx: [{ t: 'st', n: 'burn', d: 4, dps: 0.3 }] }], school: { fire: 0.12 } } },
  frost_locket: { name: 'Frost Locket', gem: '#9fe6ff', desc: 'When struck, 25% chance to freeze the attacker for 1s.', P: { onHurt: [{ c: 0.25, fx: [{ t: 'st', n: 'freeze', d: 1, at: 'src' }, { t: 'burst', p: 'frost', n: 10, at: 'src' }] }] } },
  vampire_tooth: { name: 'Vampire’s Tooth', gem: '#c01a2a', desc: 'Heal for 5% of all damage you deal.', P: { leech: 0.05 } },
  cracked_hourglass: { name: 'Cracked Hourglass', gem: '#e8c870', desc: 'Spell cooldowns 10% faster.', P: { cdr: 0.1 } },
  war_drum: { name: 'Tiny War Drum', gem: '#c88a4a', desc: 'Start every battle with Warcry for 10s.', P: { onStart: [{ fx: [{ t: 'buff', n: 'warcry', d: 10 }, { t: 'text', s: 'Boom boom!', c: '#ffcf8a' }] }] } },
  saints_knuckle: { name: 'Saint’s Knucklebone', gem: '#fff2c0', desc: '+15% healing, and you slowly regenerate while badly hurt.', P: { heal: 0.15, regenLow: 0.012 } },
  crows_feather: { name: 'Crow’s Feather', gem: '#2a2a3a', desc: '+12% move speed and +8% attack speed.', P: { move: 0.12, atkSpd: 0.08 } },
  ink_pearl: { name: 'Ink Pearl', gem: '#3a2a6a', desc: '+10% spell damage and 5% faster cooldowns.', P: { spell: 0.1, cdr: 0.05 } },
  goblin_coin: { name: 'Goblin Coin', gem: '#d4ad48', desc: '+40% crowns from battles. It bites back if you bite it.', P: { gold: 0.4 } },
  owl_eye: { name: 'Owl’s Eye', gem: '#ffd23a', desc: '+8% critical chance and critical hits +25% stronger.', P: { crit: 0.08, critPow: 0.25 } },
  grave_dirt: { name: 'Pouch of Grave Dirt', gem: '#5a4a3a', desc: 'Your summons are 30% stronger and last 30% longer.', P: { summon: 0.3, summonLife: 0.3 } },
  thorn_ring: { name: 'Ring of Thorns', gem: '#5a8a3a', desc: 'Melee attackers take 35% of your weapon damage back.', P: { onHurt: [{ c: 1, melee: true, fx: [{ t: 'dmg', m: 0.35, s: 'melee', at: 'src', quiet: true }] }] } },
  tide_shell: { name: 'Tide Shell', gem: '#6ad0d8', desc: 'Start every battle shielded for 20% of your health.', P: { onStart: [{ fx: [{ t: 'shield', p: 0.2, d: 12 }] }] } },
  witch_knot: { name: 'Witch’s Knot', gem: '#9a5ad8', desc: 'Burns, poisons and curses deal 25% more. Stuns and roots last 15% longer.', P: { dot: 0.25, ccDur: 0.15 } },
  lantern_moth: { name: 'Lantern Moth', gem: '#fff2b0', desc: 'Every kill heals you for 6% of your health.', P: { onKill: [{ fx: [{ t: 'heal', p: 0.06, self: true, quiet: true }] }] } },
  broken_signet: { name: 'Broken Signet', gem: '#c9a14a', desc: '+6 armor and +8% max health.', P: { def: 6, maxHp: 0.08 } },
  silver_pick: { name: 'Silver Lute Pick', gem: '#d8dce4', desc: 'Your companions deal 12% more damage and attack 10% faster.', P: { allyDmg: 0.12, allySpd: 0.1 } },
  storm_bottle: { name: 'Storm in a Bottle', gem: '#cfe8ff', desc: 'Critical hits arc lightning into 2 more foes.', P: { onCrit: [{ fx: [{ t: 'chain', n: 2, m: 0.6, r: 220, sc: 'storm', from: 'tgt', skipFirst: true }] }] } },
  phoenix_feather: { name: 'Phoenix Feather', gem: '#ff8a3a', desc: 'Once per battle, survive a killing blow and burst into flame: 200% fire to everything nearby.', P: { cheatDeath: true, lowHp: [{ below: 0.3, fx: [{ t: 'dmg', m: 2.0, s: 'spell', sc: 'fire', r: 160 }, { t: 'fx', type: 'explosion', r: 170, c: '#ff8a3a' }] }] } },
  mirror_shard: { name: 'Mirror Shard', gem: '#e0e8f0', desc: 'Spells have a 15% chance to cost no cooldown.', P: { onCast: [{ c: 0.15, fx: [{ t: 'cdr', s: 99 }, { t: 'text', s: 'Again!', c: '#e0e8f0' }] }] } },
};
const TRINKET_RARITY = { phoenix_feather: 'legendary', storm_bottle: 'epic', gamblers_die: 'epic', mirror_shard: 'epic', vampire_tooth: 'rare', owl_eye: 'rare', tide_shell: 'rare', witch_knot: 'rare', grave_dirt: 'rare', ember_heart: 'rare', frost_locket: 'rare', silver_pick: 'rare', lantern_moth: 'uncommon', thorn_ring: 'uncommon', broken_signet: 'uncommon', war_drum: 'uncommon', cracked_hourglass: 'uncommon', ink_pearl: 'uncommon', crows_feather: 'uncommon', saints_knuckle: 'uncommon', goblin_coin: 'common', rabbits_foot: 'common' };
for (const [id, t] of Object.entries(TRINKETS)) ITEMS[id] = { slot: 'trinket', name: t.name, desc: t.desc, P: t.P, gem: t.gem, trinket: true };
Object.assign(ITEM_RARITY, TRINKET_RARITY);
Object.assign(ITEMS.goblin_coin, { price: 20 }); Object.assign(ITEMS.rabbits_foot, { price: 25 }); Object.assign(ITEMS.crows_feather, { price: 40, market: 'saltmere' }); Object.assign(ITEMS.tide_shell, { price: 55, market: 'saltmere' }); Object.assign(ITEMS.ink_pearl, { price: 50, market: 'folio' }); Object.assign(ITEMS.owl_eye, { price: 70, market: 'folio' });

/* each trinket you find rolls a random bonus attribute */
function rollTrinket(st, id) {
  st.run.rolls = st.run.rolls || {};
  if (st.run.rolls[id]) return st.run.rolls[id];
  const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)], r = Math.random();
  const roll = { stat, v: r < 0.15 ? 3 : r < 0.5 ? 2 : 1 };
  st.run.rolls[id] = roll; return roll;
}

/* new arms and armor: louder silhouettes, capes, glows */
Object.assign(ITEMS, {
  ember_runeblade: { slot: 'weapon', name: 'Emberwake Runeblade', wt: 'sword', dmg: 22, stats: { might: 2 }, price: 110, market: 'folio', vis: { type: 'runeblade', color: '#3a2a2a', glow: '#ff6a2a' }, desc: 'Runes along the fuller smoulder when it is drawn. They roar when it bites.' },
  frostbite_staff: { slot: 'weapon', name: 'Frostbite Staff', wt: 'staff', dmg: 13, spell: 6, stats: { wits: 2 }, price: 85, market: 'saltmere', vis: { type: 'staff', top: 'crystal', color: '#cfe8ff', color2: '#6fd0ff' }, desc: 'A spike of blue ice that never melts, bound to white ash.' },
  widowmaker_scythe: { slot: 'weapon', name: 'Widowmaker', wt: 'greataxe', dmg: 26, stats: { might: 1, spirit: 2 }, req: { might: 6 }, vis: { type: 'scythe', color: '#5a4a3a', color2: '#cfe8ff' }, desc: 'A reaper’s scythe taken from the Sunken Barrow. It sighs when it swings.' },
  kingsbane_greatsword: { slot: 'weapon', name: 'Kingsbane', wt: 'greataxe', dmg: 28, stats: { might: 3 }, req: { might: 8 }, vis: { type: 'greatsword', color: '#d8dce4', color2: '#c9a14a' }, desc: 'Forged to end a tyrant. Somebody did not finish the job.' },
  hexwood_totem: { slot: 'weapon', name: 'Hexwood Totem', wt: 'staff', dmg: 12, spell: 5, stats: { spirit: 2, heart: 1 }, vis: { type: 'totem', color: '#3a2a20', color2: '#a6ff5a' }, desc: 'Carved by a bog witch. The faces on it change when you are not looking.' },
  starsilver_bow: { slot: 'weapon', name: 'Starsilver Longbow', wt: 'bow', dmg: 20, stats: { grace: 2, wits: 1 }, req: { grace: 6 }, vis: { type: 'bow', color: '#d8dce4', color2: '#9fe6ff' }, desc: 'Strung with a hair from the Wisp Queen’s crown. It hums at the moon.' },
  aegis_of_dawn: { slot: 'offhand', name: 'Aegis of Dawn', def: 7, stats: { heart: 1, spirit: 1 }, req: { might: 5 }, vis: { type: 'kite', color: '#eef0f4', color2: '#d4ad48', emblem: 'sun' }, desc: 'A tower shield painted with a rising sun. Arrows tend to change their minds.' },
  skull_lantern: { slot: 'offhand', name: 'Skull Lantern', def: 1, spell: 4, stats: { spirit: 2 }, vis: { type: 'lantern', color: '#d8d0b8', color2: '#a6ff5a' }, desc: 'A lantern made from a skull, lit with marsh-light. It hums funeral hymns.' },
  grimoire_of_ash: { slot: 'offhand', name: 'Grimoire of Ash', def: 1, spell: 6, stats: { wits: 1, lore: 2 }, price: 90, market: 'folio', vis: { type: 'tome', color: '#3a1a1a', color2: '#ff6a3a' }, desc: 'Its pages are warm. Some of them are on fire. All of them are still legible.' },
  plague_doctor_mask: { slot: 'head', name: 'Plague Doctor’s Mask', def: 3, stats: { lore: 1, spirit: 1 }, vis: { type: 'hood', color: '#1a1a1a' }, mask: '#e8dcc0', desc: 'Long-beaked and stuffed with lavender. The fen smells much nicer through it.' },
  crown_of_thorns: { slot: 'head', name: 'Crown of Thorns', def: 2, stats: { heart: 2, spirit: 1 }, vis: { type: 'circlet', color: '#4a6a2a', color2: '#a6ff5a' }, desc: 'The Green Hermit grew it on a whim. It flowers when you heal someone.' },
  dreadhelm: { slot: 'head', name: 'Dread Greathelm', def: 6, stats: { might: 2 }, req: { might: 6 }, vis: { type: 'greathelm', color: '#2a2a32', color2: '#ff4a3a', plume: '#7a1f1b' }, desc: 'Black iron with a red plume. You can hear your own breathing inside it, and nothing else.' },
  tricorn_of_tides: { slot: 'head', name: 'Captain’s Tricorn', def: 2, stats: { grace: 1, lore: 1 }, price: 45, market: 'saltmere', vis: { type: 'tophat', color: '#1a2a3a', color2: '#d4ad48' }, desc: 'The Gull’s captain gave it to you. It still fits nobody but you.' },
  nightfall_cloak: { slot: 'body', name: 'Nightfall Cloak', def: 5, stats: { grace: 2 }, price: 75, market: 'saltmere', vis: { type: 'vest', color: '#14101c', color2: '#3a2a54' }, cape: '#120e18', desc: 'Woven from the dark between lanterns. It moves a half-second after you do.' },
  gilded_warplate: { slot: 'body', name: 'Gilded Warplate', def: 12, stats: { might: 1, heart: 1 }, req: { might: 7 }, vis: { type: 'armor', color: '#c9a14a', color2: '#eef0f4', trim: '#7a1f1b', pauldron: '#d4ad48', emblem: 'sun' }, cape: '#7a1f1b', desc: 'Parade armor that someone actually fought in. The dents are polished too.' },
  bone_lords_robe: { slot: 'body', name: 'Bone Lord’s Robe', def: 4, spell: 4, stats: { spirit: 2, wits: 1 }, vis: { type: 'robe', color: '#1a2230', trim: '#9ab8d0', rune: '#7fd1ff' }, cape: '#0e141c', desc: 'Taken from the Barrow King’s wardrobe. The skulls on the shoulders whisper advice.' },
  pilgrims_mantle: { slot: 'body', name: 'Pilgrim’s Mantle', def: 5, stats: { heart: 1, spirit: 1, lore: 1 }, price: 60, market: 'saltmere', vis: { type: 'coat', color: '#6a5a3a', color2: '#d8c890' }, cape: '#4a3a2a', desc: 'Worn by a hundred travellers before you. It knows the way, mostly.' },
});
Object.assign(ITEM_RARITY, { ember_runeblade: 'epic', frostbite_staff: 'rare', widowmaker_scythe: 'epic', kingsbane_greatsword: 'legendary', hexwood_totem: 'rare', starsilver_bow: 'epic', aegis_of_dawn: 'epic', skull_lantern: 'rare', grimoire_of_ash: 'epic', plague_doctor_mask: 'rare', crown_of_thorns: 'rare', dreadhelm: 'epic', tricorn_of_tides: 'uncommon', nightfall_cloak: 'rare', gilded_warplate: 'epic', bone_lords_robe: 'epic', pilgrims_mantle: 'uncommon' });
ITEMS.mourning_veil.vis = { type: 'veil', color: '#1a1a22' };
ITEMS.red_pen_dagger.wt = 'daggers';
for (const id in ITEMS) ITEMS[id].rarity = ITEM_RARITY[id] || 'common';

/* battle loot: trinkets and the odd rare piece of gear */
const LOOT_POOL = Object.keys(TRINKETS).filter((id) => !ITEMS[id].price).concat(['widowmaker_scythe', 'hexwood_totem', 'starsilver_bow', 'skull_lantern', 'plague_doctor_mask', 'crown_of_thorns', 'dreadhelm', 'bone_lords_robe', 'kingsbane_greatsword', 'aegis_of_dawn', 'gilded_warplate']);
