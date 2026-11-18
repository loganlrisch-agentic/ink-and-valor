/* ==========================================================================
   Abilities - 18 callings, 144 abilities (90 active spells, 54 passives).
   Every active is a small recipe of effects (fx) run by doFx(); a few have
   custom code. Passives fold into one modifier block (P) plus triggers.
   Any caster can use them: the hero, allied champions or enemy champions.
   ========================================================================== */
const AB = {};
const CLASS_ABILS = {};
function defA(cls, id, name, o) { AB[id] = Object.assign({ id, cls, name, type: 'active', cd: 10, tg: 'foe', range: 480, pose: 'cast' }, o); (CLASS_ABILS[cls] = CLASS_ABILS[cls] || []).push(id); }
function defP(cls, id, name, o) { AB[id] = Object.assign({ id, cls, name, type: 'passive' }, o); (CLASS_ABILS[cls] = CLASS_ABILS[cls] || []).push(id); }
const SKILLS = AB; // older code reads SKILLS[id].name / .cd / .school

/* ---------------- KNIGHT ---------------- */
defA('knight', 'shield_rush', 'Shield Rush', { school: 'steel', glyph: 'shield', cd: 8, range: 380, req: { might: 2 }, pose: 'thrust', desc: 'Charge a foe shield-first: 120% damage and a 1.5s stun.', fx: [{ t: 'dash', to: 'tgt', dur: 0.22, land: [{ t: 'dmg', m: 1.2, s: 'melee', knock: 160, st: [['stun', 1.5]] }, { t: 'fx', type: 'ring', r: 80, c: '#e8eef8' }, { t: 'shake', v: 0.6 }] }], sfx: 'slam' });
defA('knight', 'steel_whirl', 'Steel Whirl', { school: 'steel', glyph: 'whirl', cd: 10, tg: 'self', req: { might: 4 }, pose: 'spin', poseDur: 1.0, desc: 'Spin like a millwheel: three sweeps of 80% damage around you.', fx: [{ t: 'repeat', n: 3, every: 0.33, fx: [{ t: 'dmg', m: 0.8, s: 'melee', r: 100, knock: 60 }, { t: 'fx', type: 'ring', r: 110, c: '#ffffff' }] }], sfx: 'swing' });
defA('knight', 'bulwark', 'Bulwark', { school: 'steel', glyph: 'tower', cd: 18, tg: 'self', req: { heart: 4 }, pose: 'roar', desc: 'Raise your guard: take 50% less damage for 6s.', fx: [{ t: 'buff', n: 'bulwark', d: 6 }, { t: 'aura', c: '#9ac8ff', d: 6 }], sfx: 'steel' });
defA('knight', 'warcry', 'Warcry', { school: 'steel', glyph: 'horn', cd: 20, tg: 'self', req: { might: 6 }, pose: 'roar', desc: 'A bellow that frightens foes for 3s and gives you and allies +25% damage for 8s.', fx: [{ t: 'st', n: 'fear', d: 3, r: 280 }, { t: 'buff', n: 'warcry', d: 8, team: true }, { t: 'fx', type: 'ring', r: 300, c: '#ffcf8a' }, { t: 'shake', v: 0.7 }], sfx: 'shout' });
defP('knight', 'stalwart', 'Stalwart', { school: 'steel', glyph: 'shield', desc: '+15% max health.', P: { maxHp: 0.15 } });
defP('knight', 'iron_discipline', 'Iron Discipline', { school: 'steel', glyph: 'tower', req: { heart: 3 }, desc: 'Take 12% less damage and gain 3 armor.', P: { dr: 0.12, def: 3 } });
defP('knight', 'riposte', 'Riposte', { school: 'steel', glyph: 'whirl', req: { might: 5 }, desc: 'When struck in melee, 30% chance to strike back for 70% weapon damage.', P: { onHurt: [{ c: 0.3, melee: true, fx: [{ t: 'dmg', m: 0.7, s: 'melee', at: 'src' }, { t: 'fx', type: 'slash', at: 'src' }] }] } });

/* ---------------- WIZARD ---------------- */
defA('wizard', 'fireball', 'Fireball', { school: 'fire', glyph: 'flame', cd: 6, range: 560, req: { wits: 2 }, delay: 0.18, desc: 'A roaring ball of fire: 160% to all near the impact, leaving flames.', fx: [{ t: 'proj', k: 'fireball', sp: 520, rad: 22, trail: 'ember', hit: [{ t: 'dmg', m: 1.6, s: 'spell', sc: 'fire', r: 85 }, { t: 'zone', r: 70, d: 3, dps: 0.5, sc: 'fire', k: 'fire', c: '#ff5a1a' }, { t: 'fx', type: 'explosion', r: 95, c: '#ff8a3a' }, { t: 'shake', v: 0.5 }] }], sfx: 'fire' });
defA('wizard', 'frost_ring', 'Frost Ring', { school: 'frost', glyph: 'flake', cd: 12, tg: 'self', req: { wits: 4 }, desc: 'Ice explodes outward: 90% damage and freezes nearby foes for 2.5s.', fx: [{ t: 'dmg', m: 0.9, s: 'spell', sc: 'frost', r: 150, st: [['freeze', 2.5]] }, { t: 'fx', type: 'ring', r: 170, c: '#9fe6ff' }, { t: 'burst', p: 'shard', n: 18 }], sfx: 'frost' });
defA('wizard', 'page_skip', 'Page Skip', { school: 'arcane', glyph: 'page', cd: 9, tg: 'self', req: { grace: 3 }, desc: 'Skip ahead a page: blink away from danger. Your next spell deals +50%.', fx: [{ t: 'blink', to: 'away', d: 230 }, { t: 'buff', n: 'empower', d: 8 }], sfx: 'blink' });
defA('wizard', 'chain_lightning', 'Chain Lightning', { school: 'storm', glyph: 'bolt', cd: 11, range: 460, req: { wits: 6 }, desc: 'Lightning leaps through up to 5 foes, 130% and fading.', fx: [{ t: 'chain', n: 5, m: 1.3, r: 220, sc: 'storm', st: [['stun', 0.3]] }], sfx: 'zap' });
defP('wizard', 'arcane_ink', 'Arcane Ink', { school: 'arcane', glyph: 'page', desc: '+12% spell damage.', P: { spell: 0.12 } });
defP('wizard', 'kindling', 'Kindling', { school: 'fire', glyph: 'flame', req: { wits: 4 }, desc: 'Fire damage +20%, and fire spells set foes burning for 3s.', P: { school: { fire: 0.2 }, onSpellHit: [{ sc: 'fire', fx: [{ t: 'st', n: 'burn', d: 3, dps: 0.2 }] }] } });
defP('wizard', 'overflowing_inkwell', 'Overflowing Inkwell', { school: 'arcane', glyph: 'drop', req: { wits: 6 }, desc: 'Every third spell you cast takes 3s off your other cooldowns.', P: { onCast: [{ every: 3, fx: [{ t: 'cdr', s: 3 }] }] } });

/* ---------------- ROGUE ---------------- */
defA('rogue', 'backstab', 'Backstab', { school: 'shadow', glyph: 'dagger', cd: 8, range: 420, req: { grace: 2 }, pose: 'thrust', desc: 'Appear behind a foe and stab for 240%. Always critical on stunned or frozen foes.', fx: [{ t: 'blink', to: 'behind' }, { t: 'delay', d: 0.12, fx: [{ t: 'dmg', m: 2.4, s: 'melee', critIfCC: true, critMul: 2 }, { t: 'fx', type: 'slash', big: true, c: '#d8c8ff' }] }], sfx: 'blink' });
defA('rogue', 'nightshade_edge', 'Nightshade Edge', { school: 'poison', glyph: 'drop', cd: 14, tg: 'self', req: { wits: 3 }, pose: 'roar', desc: 'Coat your blades: for 8s every hit poisons (stacks up to 5).', fx: [{ t: 'buff', n: 'nightshade', d: 8 }, { t: 'aura', c: '#8fd14f', d: 8 }], sfx: 'gulp' });
defA('rogue', 'knife_fan', 'Knife Fan', { school: 'steel', glyph: 'fan', cd: 9, tg: 'self', req: { grace: 4 }, pose: 'throw', desc: 'Throw a ring of ten knives, 70% each, that pierce once.', fx: [{ t: 'proj', k: 'knife', n: 10, ring: true, sp: 620, m: 0.7, s: 'melee', pierce: 1, rad: 14, life: 0.8 }], sfx: 'swing' });
defA('rogue', 'inkcloud', 'Inkcloud', { school: 'shadow', glyph: 'cloud', cd: 16, tg: 'self', req: { grace: 6 }, desc: 'Vanish in spilled ink for 3s: foes lose you, you move faster, and your next hit is a crushing critical.', fx: [{ t: 'buff', n: 'inkcloud', d: 3 }, { t: 'buff', n: 'critNext', d: 6 }, { t: 'lose' }, { t: 'burst', p: 'smoke', n: 20, c: '#1a1630' }], sfx: 'dark' });
defP('rogue', 'keen_edge', 'Keen Edge', { school: 'steel', glyph: 'dagger', desc: '+7% critical chance.', P: { crit: 0.07 } });
defP('rogue', 'opportunist', 'Opportunist', { school: 'shadow', glyph: 'eye', req: { grace: 4 }, desc: '+30% damage to stunned, frozen, rooted or sleeping foes.', P: { vs: { cc: 0.3 } } });
defP('rogue', 'quickfingers', 'Quickfingers', { school: 'steel', glyph: 'fan', req: { grace: 6 }, desc: '+12% attack speed and +8% movement speed.', P: { atkSpd: 0.12, move: 0.08 } });

/* ---------------- CLERIC ---------------- */
defA('cleric', 'mend', 'Mend', { school: 'holy', glyph: 'cross', cd: 12, tg: 'ally', req: { heart: 2 }, desc: 'Heal yourself or the most wounded ally for 35% of their health.', fx: [{ t: 'heal', p: 0.35 }, { t: 'fx', type: 'pillar', c: '#9dffb0', at: 'tgt' }], sfx: 'heal' });
defA('cleric', 'smite', 'Smite', { school: 'holy', glyph: 'pillar', cd: 8, range: 520, req: { wits: 3 }, desc: 'A pillar of light: 180% holy damage (x1.5 to undead and Inkspawn). Heals you for 30% of it.', fx: [{ t: 'fx', type: 'pillar', c: '#ffe9a8' }, { t: 'delay', d: 0.1, fx: [{ t: 'dmg', m: 1.8, s: 'spell', sc: 'holy', unholy: 1.5, leech: 0.3 }] }], sfx: 'holy' });
defA('cleric', 'radiance', 'Radiance', { school: 'holy', glyph: 'sun', cd: 14, tg: 'self', req: { heart: 4 }, desc: 'Burst with light: 100% to nearby foes (double to the unholy) and blinds them for 1.2s.', fx: [{ t: 'dmg', m: 1.0, s: 'spell', sc: 'holy', r: 170, unholy: 2, st: [['stun', 1.2]] }, { t: 'fx', type: 'ring', r: 190, c: '#ffe9a8' }, { t: 'fx', type: 'pillar', w: 70 }], sfx: 'holy' });
defA('cleric', 'sanctuary', 'Sanctuary', { school: 'holy', glyph: 'ring', cd: 22, tg: 'self', req: { heart: 6 }, desc: 'Hallow the ground for 6s: you and allies inside heal steadily, foes inside are slowed.', fx: [{ t: 'zone', r: 120, d: 6, heal: 0.04, slow: true, k: 'holy', c: '#ffe08a' }], sfx: 'holy' });
defP('cleric', 'blessed', 'Blessed', { school: 'holy', glyph: 'cross', desc: 'Regenerate 0.8% of max health every second.', P: { regen: 0.008 } });
defP('cleric', 'martyrs_grace', "Martyr's Grace", { school: 'holy', glyph: 'heart', req: { heart: 4 }, desc: 'Your healing is 25% stronger.', P: { heal: 0.25 } });
defP('cleric', 'holy_ward', 'Holy Ward', { school: 'holy', glyph: 'sun', req: { heart: 6 }, desc: 'The first time you fall below 35% health, gain a shield worth 25% of your health.', P: { lowHp: [{ below: 0.35, fx: [{ t: 'shield', p: 0.25, d: 8 }] }] } });

/* ---------------- RANGER ---------------- */
defA('ranger', 'piercing_shot', 'Piercing Shot', { school: 'nature', glyph: 'arrow', cd: 7, range: 620, req: { grace: 2 }, pose: 'shoot', delay: 0.18, desc: 'An arrow that punches through every foe in a line for 130%.', fx: [{ t: 'proj', k: 'quarrel', sp: 980, m: 1.3, s: 'melee', pierce: 9, rad: 16, life: 1.2 }], sfx: 'twang' });
defA('ranger', 'volley', 'Volley', { school: 'nature', glyph: 'fan', cd: 12, range: 560, tg: 'point', req: { grace: 4 }, pose: 'shoot', desc: 'Loose a cloud of arrows: six strikes of 70% around the target over 1.2s.', fx: [{ t: 'repeat', n: 6, every: 0.2, fx: [{ t: 'dmg', m: 0.7, s: 'melee', r: 90, quiet: true }, { t: 'burst', p: 'spark', n: 6, spread: 80 }] }, { t: 'fx', type: 'tele', r: 90, c: '#e8d8a0', d: 1.2 }], sfx: 'twang' });
defA('ranger', 'snare_trap', 'Snare Trap', { school: 'nature', glyph: 'trap', cd: 14, tg: 'point', range: 420, req: { wits: 3 }, pose: 'throw', desc: 'Toss a jawed trap: foes stepping in are rooted 3s and take 90%.', fx: [{ t: 'trap', r: 60, m: 0.9, d: 12, st: [['root', 3]] }], sfx: 'steel' });
defA('ranger', 'call_hawk', 'Call the Hawk', { school: 'nature', glyph: 'wing', cd: 24, tg: 'self', req: { grace: 6 }, pose: 'point', desc: 'A hunting hawk joins you for 16s, diving at your foes.', fx: [{ t: 'summon', u: 'hawk', n: 1, life: 16 }], sfx: 'wind' });
defP('ranger', 'hawkeye', 'Hawkeye', { school: 'nature', glyph: 'eye', desc: '+20% range and +10% damage with bows, crossbows and staves.', P: { range: 0.2, rangedDmg: 0.1 } });
defP('ranger', 'hunters_patience', "Hunter's Patience", { school: 'nature', glyph: 'arrow', req: { grace: 4 }, desc: 'Hits on foes at full health deal +45%.', P: { vs: { full: 0.45 } } });
defP('ranger', 'fleetfoot', 'Fleetfoot', { school: 'nature', glyph: 'boot', req: { grace: 6 }, desc: '+12% move speed. Casting a spell makes you Quick for 2s.', P: { move: 0.12, onCast: [{ every: 1, fx: [{ t: 'buff', n: 'quick', d: 2 }] }] } });

/* ---------------- BARBARIAN ---------------- */
defA('barbarian', 'cleave', 'Cleave', { school: 'steel', glyph: 'axe', cd: 6, tg: 'self', req: { might: 2 }, pose: 'attack', poseDur: 0.5, desc: 'A huge swing through every foe in front of you: 140%.', fx: [{ t: 'delay', d: 0.2, fx: [{ t: 'cone', r: 120, m: 1.4, s: 'melee', knock: 90 }, { t: 'fx', type: 'slash', big: true, fwd: 60 }] }], sfx: 'swing' });
defA('barbarian', 'leap_slam', 'Leap Slam', { school: 'steel', glyph: 'fist', cd: 11, range: 420, req: { might: 4 }, pose: 'slam', desc: 'Leap onto a foe: 120% to all nearby and a 1s stun.', fx: [{ t: 'dash', to: 'tgt', dur: 0.42, arc: 90, land: [{ t: 'dmg', m: 1.2, s: 'melee', r: 95, st: [['stun', 1]] }, { t: 'fx', type: 'ring', r: 110, c: '#d8b880' }, { t: 'burst', p: 'dust', n: 18 }, { t: 'shake', v: 0.9 }] }], sfx: 'slam' });
defA('barbarian', 'bloodrage', 'Bloodrage', { school: 'blood', glyph: 'heart', cd: 22, tg: 'self', req: { heart: 3 }, pose: 'roar', desc: 'For 8s: +40% attack speed and heal for 20% of damage dealt, but take 15% more damage.', fx: [{ t: 'buff', n: 'bloodrage', d: 8 }, { t: 'aura', c: '#ff3a2a', d: 8 }], sfx: 'roar' });
defA('barbarian', 'earthshaker', 'Earthshaker', { school: 'earth', glyph: 'whirl', cd: 16, tg: 'point', range: 400, req: { might: 6 }, pose: 'slam', desc: 'Split the ground in a line: 160% and a 1.2s stun to everything on it.', fx: [{ t: 'delay', d: 0.3, fx: [{ t: 'line', len: 360, w: 40, m: 1.6, s: 'melee', st: [['stun', 1.2]], knock: 120 }, { t: 'shake', v: 1 }] }], sfx: 'slam' });
defP('barbarian', 'thick_hide', 'Thick Hide', { school: 'earth', glyph: 'shield', desc: '+20% max health.', P: { maxHp: 0.2 } });
defP('barbarian', 'berserk_blood', 'Berserk Blood', { school: 'blood', glyph: 'heart', req: { might: 4 }, desc: 'Deal up to +40% damage the lower your health is.', P: { rage: 0.4 } });
defP('barbarian', 'unstoppable', 'Unstoppable', { school: 'earth', glyph: 'boot', req: { might: 6 }, desc: 'Immune to slows and roots. Stuns on you last half as long.', P: { unstoppable: true } });

/* ---------------- PALADIN ---------------- */
defA('paladin', 'judgment', 'Judgment', { school: 'holy', glyph: 'hammer', cd: 9, range: 480, req: { might: 2 }, pose: 'throw', desc: 'Hurl a blessed hammer that bounces through 3 foes for 120%. Undead it strikes are stunned.', fx: [{ t: 'chain', n: 3, m: 1.2, r: 240, sc: 'holy', vis: 'hammer', stUnholy: [['stun', 1.2]] }], sfx: 'holy' });
defA('paladin', 'consecration', 'Consecration', { school: 'holy', glyph: 'sun', cd: 16, tg: 'self', req: { heart: 3 }, desc: 'Sanctify the ground for 6s: foes standing in it burn with holy fire, you heal.', fx: [{ t: 'zone', r: 115, d: 6, dps: 0.55, sc: 'holy', heal: 0.02, k: 'holy', c: '#ffd86a' }], sfx: 'holy' });
defA('paladin', 'divine_shield', 'Divine Shield', { school: 'holy', glyph: 'tower', cd: 28, tg: 'self', req: { heart: 5 }, pose: 'roar', desc: 'Become immune to all damage for 2.5s.', fx: [{ t: 'buff', n: 'divine', d: 2.5 }, { t: 'aura', c: '#fff2b0', d: 2.5 }, { t: 'fx', type: 'pillar', w: 60 }], sfx: 'holy' });
defA('paladin', 'lay_on_hands', 'Lay on Hands', { school: 'holy', glyph: 'cross', cd: 32, tg: 'ally', req: { heart: 7 }, desc: 'Restore 60% of health to yourself or the most wounded ally, and cleanse them.', fx: [{ t: 'heal', p: 0.6 }, { t: 'cleanse' }, { t: 'fx', type: 'pillar', at: 'tgt', c: '#fff2c0' }], sfx: 'heal' });
defP('paladin', 'aura_of_valor', 'Aura of Valor', { school: 'holy', glyph: 'sun', desc: 'You and allies near you deal +10% damage.', P: { dmg: 0.1, allyDmg: 0.1 } });
defP('paladin', 'bane_of_the_dead', 'Bane of the Dead', { school: 'holy', glyph: 'skull', req: { might: 4 }, desc: '+30% damage to undead and Inkspawn.', P: { vs: { unholy: 0.3 } } });
defP('paladin', 'oathbound', 'Oathbound', { school: 'holy', glyph: 'heart', req: { heart: 6 }, desc: 'Every weapon hit heals you for 1.5% of your health.', P: { onHit: [{ c: 1, auto: true, fx: [{ t: 'heal', p: 0.015, self: true, quiet: true }] }] } });

/* ---------------- STORMCALLER ---------------- */
defA('stormcaller', 'gale_slash', 'Gale Slash', { school: 'storm', glyph: 'wave', cd: 6, range: 520, req: { wits: 2 }, delay: 0.15, desc: 'A crescent of wind that cuts through every foe in its path (110%) and throws them back.', fx: [{ t: 'proj', k: 'gale', sp: 700, m: 1.1, s: 'spell', sc: 'storm', pierce: 9, rad: 26, life: 1, knock: 180 }], sfx: 'wind' });
defA('stormcaller', 'tempest', 'Tempest', { school: 'storm', glyph: 'cloud', cd: 15, tg: 'point', range: 520, req: { wits: 4 }, desc: 'A thundercloud boils over the target for 4s, striking random foes below for 70%.', fx: [{ t: 'storm', r: 140, d: 4, every: 0.45, m: 0.7 }], sfx: 'zap' });
defA('stormcaller', 'updraft', 'Updraft', { school: 'storm', glyph: 'tornado', cd: 14, tg: 'point', range: 460, req: { grace: 4 }, desc: 'A whirlwind drags nearby foes together and hurls them up: 1.6s stun.', fx: [{ t: 'pull', r: 170, str: 1 }, { t: 'delay', d: 0.25, fx: [{ t: 'dmg', m: 0.6, s: 'spell', sc: 'storm', r: 120, st: [['stun', 1.6]], lift: true }, { t: 'fx', type: 'ring', r: 130, c: '#cfe8ff' }] }], sfx: 'wind' });
defA('stormcaller', 'thunderclap', 'Thunderclap', { school: 'storm', glyph: 'bolt', cd: 12, range: 420, req: { wits: 6 }, desc: 'Ride the lightning to a foe and explode: 150% around you and a 1s stun.', fx: [{ t: 'blink', to: 'tgt' }, { t: 'dmg', m: 1.5, s: 'spell', sc: 'storm', r: 110, st: [['stun', 1]] }, { t: 'fx', type: 'pillar', c: '#cfe8ff', w: 50 }, { t: 'fx', type: 'ring', r: 120, c: '#cfe8ff' }, { t: 'shake', v: 0.6 }], sfx: 'zap' });
defP('stormcaller', 'static_charge', 'Static Charge', { school: 'storm', glyph: 'bolt', desc: 'Auto attacks have a 22% chance to arc lightning into 2 more foes.', P: { onHit: [{ c: 0.22, auto: true, fx: [{ t: 'chain', n: 2, m: 0.5, r: 200, sc: 'storm', from: 'tgt', skipFirst: true }] }] } });
defP('stormcaller', 'eye_of_the_storm', 'Eye of the Storm', { school: 'storm', glyph: 'tornado', req: { grace: 4 }, desc: '+10% attack and move speed, +5% critical chance.', P: { atkSpd: 0.1, move: 0.1, crit: 0.05 } });
defP('stormcaller', 'windwalker', 'Windwalker', { school: 'storm', glyph: 'wing', req: { grace: 6 }, desc: '12% chance to dodge any attack.', P: { dodge: 0.12 } });

/* ---------------- NECROMANCER ---------------- */
defA('necromancer', 'bone_spear', 'Bone Spear', { school: 'death', glyph: 'bone', cd: 6, range: 600, req: { wits: 2 }, delay: 0.1, desc: 'A spear of bone that pierces six foes for 130%.', fx: [{ t: 'proj', k: 'bone', sp: 760, m: 1.3, s: 'spell', sc: 'death', pierce: 6, rad: 18, life: 1.4 }], sfx: 'bone' });
defA('necromancer', 'drain_life', 'Drain Life', { school: 'death', glyph: 'heart', cd: 12, range: 320, req: { heart: 3 }, desc: 'Channel for 2s, pulling 45% damage every half second from a foe into your own veins.', fx: [{ t: 'chan', d: 2, m: 0.45, leech: 1, c: '#7bd389' }], sfx: 'dark' });
defA('necromancer', 'raise_dead', 'Raise Dead', { school: 'death', glyph: 'skull', cd: 18, tg: 'self', req: { wits: 4 }, desc: 'A skeleton warrior claws up from the ground and fights for you for 18s.', fx: [{ t: 'summon', u: 'skeleton_ally', n: 1, life: 18 }], sfx: 'bone' });
defA('necromancer', 'curse_of_rot', 'Curse of Rot', { school: 'death', glyph: 'eye', cd: 14, tg: 'point', range: 520, req: { wits: 6 }, desc: 'Rot creeps through foes near the target: they decay for 6s and take 25% more damage.', fx: [{ t: 'st', n: 'rot', d: 6, dps: 0.35, r: 130 }, { t: 'fx', type: 'ring', r: 140, c: '#7bd389' }], sfx: 'dark' });
defP('necromancer', 'deaths_due', "Death's Due", { school: 'death', glyph: 'skull', desc: 'Heal 3% of your health whenever a foe dies near you.', P: { onAnyKill: [{ r: 260, fx: [{ t: 'heal', p: 0.03, self: true }] }] } });
defP('necromancer', 'grave_pact', 'Grave Pact', { school: 'death', glyph: 'bone', req: { wits: 4 }, desc: 'Your summoned allies have +40% health and damage.', P: { summon: 0.4 } });
defP('necromancer', 'soul_harvest', 'Soul Harvest', { school: 'death', glyph: 'drop', req: { wits: 6 }, desc: 'Each kill grants +5% spell damage for the rest of the battle (up to +30%).', P: { onKill: [{ fx: [{ t: 'stack', n: 'soul', max: 6 }] }], stacks: { soul: { spell: 0.05 } } } });

/* ---------------- WITCH HUNTER ---------------- */
defA('witchhunter', 'silver_bolt', 'Silver Bolt', { school: 'silver', glyph: 'quarrel', cd: 6, range: 620, req: { grace: 2 }, pose: 'shoot', delay: 0.15, desc: 'A blessed quarrel: 160%, piercing two foes.', fx: [{ t: 'proj', k: 'silver', sp: 950, m: 1.6, s: 'melee', sc: 'silver', pierce: 2, rad: 16 }], sfx: 'twang' });
defA('witchhunter', 'firebrand_flask', 'Firebrand Flask', { school: 'fire', glyph: 'flask', cd: 10, range: 520, req: { might: 3 }, pose: 'throw', delay: 0.2, desc: 'Lob a flask of burning pitch: an explosion and a pool of fire.', fx: [{ t: 'flask', m: 1.3, r: 80 }], sfx: 'glass' });
defA('witchhunter', 'snare_bola', 'Snare Bola', { school: 'steel', glyph: 'bola', cd: 12, range: 520, req: { grace: 4 }, pose: 'throw', delay: 0.15, desc: 'Weighted cords tangle a foe and everything near it: rooted for 3s.', fx: [{ t: 'proj', k: 'bola', sp: 600, m: 0.5, s: 'melee', rad: 20, hit: [{ t: 'dmg', m: 0.5, s: 'melee' }, { t: 'st', n: 'root', d: 3, r: 70 }, { t: 'fx', type: 'ring', r: 70, c: '#c8b08a' }] }], sfx: 'swing' });
defA('witchhunter', 'hunters_mark', "Hunter's Mark", { school: 'silver', glyph: 'mark', cd: 14, range: 600, req: { grace: 6 }, pose: 'point', desc: 'Mark a foe for 8s: it takes +50% damage, and killing it takes 3s off your cooldowns.', fx: [{ t: 'st', n: 'mark', d: 8 }, { t: 'fx', type: 'glint', c: '#ffd27a' }, { t: 'text', s: 'Marked', c: '#ffd27a' }], sfx: 'bell' });
defP('witchhunter', 'silver_oath', 'Silver Oath', { school: 'silver', glyph: 'quarrel', desc: '+20% damage to undead and Inkspawn.', P: { vs: { unholy: 0.2 } } });
defP('witchhunter', 'inquisitors_fervor', "Inquisitor's Fervor", { school: 'silver', glyph: 'mark', req: { grace: 4 }, desc: '+25% damage to marked and burning foes.', P: { vs: { marked: 0.25, burning: 0.25 } } });
defP('witchhunter', 'pitch_and_powder', 'Pitch and Powder', { school: 'fire', glyph: 'flask', req: { might: 5 }, desc: 'Fire damage +25%, and your explosions are 30% wider.', P: { school: { fire: 0.25 }, aoe: 0.3 } });

/* ---------------- MONK ---------------- */
defA('monk', 'hundred_fists', 'Hundred Fists', { school: 'ki', glyph: 'fist', cd: 8, range: 300, req: { grace: 2 }, pose: 'thrust', desc: 'Close in and unleash eight rapid strikes of 40%.', fx: [{ t: 'dash', to: 'tgt', dur: 0.16, land: [{ t: 'repeat', n: 8, every: 0.08, fx: [{ t: 'dmg', m: 0.4, s: 'melee', quiet: true }, { t: 'fx', type: 'slash', c: '#ffe0a0' }] }] }], sfx: 'blunt', poseDur: 0.8 });
defA('monk', 'still_lake_palm', 'Palm of the Still Lake', { school: 'ki', glyph: 'wave', cd: 10, range: 200, req: { heart: 3 }, pose: 'thrust', desc: 'A ki strike that sends a foe flying and stuns it for 1.5s: 120%.', fx: [{ t: 'dash', to: 'tgt', dur: 0.12, land: [{ t: 'dmg', m: 1.2, s: 'melee', knock: 420, st: [['stun', 1.5]] }, { t: 'fx', type: 'ring', r: 60, c: '#bfe8ff' }] }], sfx: 'slam' });
defA('monk', 'flying_crane', 'Flying Crane', { school: 'ki', glyph: 'wing', cd: 12, tg: 'point', range: 380, req: { grace: 4 }, pose: 'thrust', desc: 'Dash clean through a line of foes, striking each for 130%.', fx: [{ t: 'dash', to: 'through', dur: 0.25, sweep: { w: 40, m: 1.3, s: 'melee' } }], sfx: 'swing' });
defA('monk', 'inner_peace', 'Inner Peace', { school: 'ki', glyph: 'lotus', cd: 24, tg: 'self', req: { heart: 6 }, pose: 'kneel', poseDur: 1.2, desc: 'Breathe. Cleanse every ailment and heal 40% of your health.', fx: [{ t: 'cleanse' }, { t: 'heal', p: 0.4, self: true }, { t: 'aura', c: '#bfe8ff', d: 1.5 }], sfx: 'heal' });
defP('monk', 'iron_body', 'Iron Body', { school: 'ki', glyph: 'fist', desc: '+10% max health and +3 armor.', P: { maxHp: 0.1, def: 3 } });
defP('monk', 'flowing_water', 'Flowing Water', { school: 'ki', glyph: 'wave', req: { grace: 4 }, desc: '15% chance to dodge any attack.', P: { dodge: 0.15 } });
defP('monk', 'ki_strikes', 'Ki Strikes', { school: 'ki', glyph: 'lotus', req: { grace: 6 }, desc: 'Every third weapon hit releases a ki wave: 60% to all nearby foes.', P: { onHit: [{ every: 3, auto: true, fx: [{ t: 'dmg', m: 0.6, s: 'melee', r: 90, at: 'self' }, { t: 'fx', type: 'ring', r: 90, c: '#bfe8ff', at: 'self' }] }] } });

/* ---------------- BARD ---------------- */
defA('bard', 'ballad_of_courage', 'Ballad of Courage', { school: 'song', glyph: 'note', cd: 20, tg: 'self', req: { heart: 2 }, pose: 'talk', desc: 'A rousing verse: you and allies deal +25% damage and attack 20% faster for 8s.', fx: [{ t: 'buff', n: 'song', d: 8, team: true }, { t: 'fx', type: 'ring', r: 260, c: '#ffd27a' }, { t: 'burst', p: 'spark', n: 16, c: '#ffd27a' }], sfx: 'bell' });
defA('bard', 'discord', 'Discord', { school: 'song', glyph: 'horn', cd: 10, tg: 'self', req: { wits: 3 }, pose: 'talk', desc: 'A chord so wrong it hurts: 90% to nearby foes and a 1s daze.', fx: [{ t: 'dmg', m: 0.9, s: 'spell', sc: 'song', r: 150, st: [['stun', 1]] }, { t: 'fx', type: 'ring', r: 160, c: '#e0a0ff' }], sfx: 'shout' });
defA('bard', 'lullaby', 'Lullaby', { school: 'song', glyph: 'moon', cd: 22, tg: 'self', req: { heart: 4 }, pose: 'talk', desc: 'Sing every foe in a wide circle to sleep for 3s.', fx: [{ t: 'st', n: 'sleep', d: 3, r: 260 }, { t: 'fx', type: 'ring', r: 270, c: '#b8c8ff' }, { t: 'burst', p: 'frost', n: 14, c: '#b8c8ff' }], sfx: 'bell' });
defA('bard', 'encore', 'Encore', { school: 'song', glyph: 'star', cd: 26, tg: 'self', req: { wits: 6 }, pose: 'cheer', desc: 'Take a bow. All your other cooldowns drop by 6s.', fx: [{ t: 'cdr', s: 6 }, { t: 'burst', p: 'spark', n: 20, c: '#ffe08a' }], sfx: 'quest' });
defP('bard', 'inspiring_presence', 'Inspiring Presence', { school: 'song', glyph: 'note', desc: 'Allies near you attack 10% faster. You regenerate 0.4% health per second.', P: { regen: 0.004, allySpd: 0.1 } });
defP('bard', 'silver_tongue', 'Silver Tongue', { school: 'song', glyph: 'coin', req: { wits: 3 }, desc: '+30% crowns from battles.', P: { gold: 0.3 } });
defP('bard', 'crescendo', 'Crescendo', { school: 'song', glyph: 'star', req: { heart: 6 }, desc: 'Each spell you cast adds +7% damage for 8s (stacks 3).', P: { onCast: [{ every: 1, fx: [{ t: 'stack', n: 'cresc', max: 3, d: 8 }] }], stacks: { cresc: { dmg: 0.07 } } } });

/* ---------------- WITCH ---------------- */
defA('witch', 'hex_of_toads', 'Hex of Toads', { school: 'hex', glyph: 'toad', cd: 14, range: 480, req: { wits: 2 }, desc: 'Turn a foe into a toad for 3s. Toads cannot fight back. Bosses only shrink.', fx: [{ t: 'st', n: 'toad', d: 3 }, { t: 'burst', p: 'hexspark', n: 14 }, { t: 'fx', type: 'glint', c: '#a6ff5a' }], sfx: 'dark' });
defA('witch', 'withering_curse', 'Withering Curse', { school: 'hex', glyph: 'eye', cd: 12, tg: 'point', range: 520, req: { wits: 4 }, desc: 'Curse foes near the target for 6s: they take 30% more damage and attack 20% slower.', fx: [{ t: 'st', n: 'hexed', d: 6, r: 120 }, { t: 'fx', type: 'ring', r: 130, c: '#b06ad8' }], sfx: 'dark' });
defA('witch', 'bog_burst', 'Bog Burst', { school: 'poison', glyph: 'drop', cd: 11, tg: 'point', range: 500, req: { heart: 3 }, desc: 'Swamp gas erupts under foes: a poison pool for 5s that slows anything inside.', fx: [{ t: 'zone', r: 100, d: 5, dps: 0.45, poison: 0.12, slow: true, sc: 'poison', k: 'poison', c: '#6ad84a' }, { t: 'burst', p: 'poison', n: 20 }], sfx: 'splat' });
defA('witch', 'blood_moon_rite', 'Blood Moon Rite', { school: 'blood', glyph: 'moon', cd: 26, tg: 'self', req: { wits: 6 }, pose: 'channel', poseDur: 0.8, desc: 'Spill 15% of your health. For 10s your spells deal +40% damage.', fx: [{ t: 'selfdmg', p: 0.15 }, { t: 'buff', n: 'bloodmoon', d: 10 }, { t: 'aura', c: '#c8102e', d: 10 }], sfx: 'dark' });
defP('witch', 'covens_malice', "Coven's Malice", { school: 'hex', glyph: 'eye', desc: 'Your poisons, burns, bleeds and rot deal +30% damage.', P: { dot: 0.3 } });
defP('witch', 'evil_eye', 'Evil Eye', { school: 'hex', glyph: 'eye', req: { wits: 4 }, desc: 'Auto attacks have a 15% chance to hex the target for 3s (+30% damage taken).', P: { onHit: [{ c: 0.15, auto: true, fx: [{ t: 'st', n: 'hexed', d: 3 }] }] } });
defP('witch', 'black_cat', 'Black Cat', { school: 'hex', glyph: 'cat', req: { heart: 5 }, desc: 'Once per battle, survive a killing blow with 1 health.', P: { cheatDeath: true } });

/* ---------------- DRUID ---------------- */
defA('druid', 'thornlash', 'Thornlash', { school: 'nature', glyph: 'thorn', cd: 7, tg: 'point', range: 340, req: { wits: 2 }, desc: 'A whip of thorns tears through a line: 110% and bleeding for 4s.', fx: [{ t: 'line', len: 320, w: 36, m: 1.1, s: 'spell', sc: 'nature', st: [['bleed', 4, 0.25]] }], sfx: 'swing' });
defA('druid', 'entangle', 'Entangle', { school: 'nature', glyph: 'leaf', cd: 13, tg: 'point', range: 480, req: { heart: 3 }, desc: 'Roots burst up and hold foes near the target for 3s, crushing them for 80%.', fx: [{ t: 'dmg', m: 0.8, s: 'spell', sc: 'nature', r: 110, st: [['root', 3]] }, { t: 'fx', type: 'ring', r: 120, c: '#7bbf3a' }, { t: 'burst', p: 'dust', n: 14, c: '#5a8a2a' }], sfx: 'steel' });
defA('druid', 'bear_form', 'Bear Form', { school: 'nature', glyph: 'paw', cd: 30, tg: 'self', req: { might: 4 }, pose: 'roar', desc: 'Become a great bear for 12s: take 40% less damage and hit 35% harder.', fx: [{ t: 'buff', n: 'bear', d: 12 }, { t: 'aura', c: '#8a6a3a', d: 12 }, { t: 'shake', v: 0.4 }], sfx: 'roar' });
defA('druid', 'call_of_the_pack', 'Call of the Pack', { school: 'nature', glyph: 'paw', cd: 26, tg: 'self', req: { heart: 6 }, pose: 'roar', desc: 'Two wolves bound out of the dark and fight beside you for 16s.', fx: [{ t: 'summon', u: 'wolf', n: 2, life: 16 }], sfx: 'roar' });
defP('druid', 'barkskin', 'Barkskin', { school: 'nature', glyph: 'leaf', desc: '+5 armor.', P: { def: 5 } });
defP('druid', 'regrowth', 'Regrowth', { school: 'nature', glyph: 'leaf', req: { heart: 4 }, desc: 'Below half health, regenerate 1.2% health per second.', P: { regenLow: 0.012 } });
defP('druid', 'pack_leader', 'Pack Leader', { school: 'nature', glyph: 'paw', req: { heart: 6 }, desc: 'Your summoned allies deal +30% damage and stay 30% longer.', P: { summon: 0.3, summonLife: 0.3 } });

/* ---------------- ALCHEMIST ---------------- */
defA('alchemist', 'volatile_flask', 'Volatile Flask', { school: 'fire', glyph: 'flask', cd: 7, range: 520, req: { wits: 2 }, pose: 'throw', delay: 0.18, desc: 'An unstable brew: a big explosion for 150% and burning ground.', fx: [{ t: 'flask', m: 1.5, r: 95 }], sfx: 'glass' });
defA('alchemist', 'acid_splash', 'Acid Splash', { school: 'poison', glyph: 'drop', cd: 10, range: 480, req: { grace: 3 }, pose: 'throw', delay: 0.15, desc: 'Corrosive acid: 90% and corroded armor (+25% damage taken) for 6s around the target.', fx: [{ t: 'proj', k: 'nightshade', sp: 520, arc: true, rad: 18, hit: [{ t: 'dmg', m: 0.9, s: 'spell', sc: 'poison', r: 80, st: [['corrode', 6]] }, { t: 'burst', p: 'poison', n: 16 }] }], sfx: 'splat' });
defA('alchemist', 'elixir_rain', 'Elixir Rain', { school: 'nature', glyph: 'potion', cd: 20, tg: 'self', req: { heart: 4 }, desc: 'A mist of tonic: you and allies heal 25% and become Quick for 5s.', fx: [{ t: 'heal', p: 0.25, team: true }, { t: 'buff', n: 'quick', d: 5, team: true }, { t: 'burst', p: 'holy', n: 20, c: '#9dffb0' }], sfx: 'gulp' });
defA('alchemist', 'homunculus', 'Homunculus', { school: 'earth', glyph: 'golem', cd: 28, tg: 'self', req: { wits: 6 }, desc: 'Breathe life into a clay golem for 20s. It taunts foes and hits hard.', fx: [{ t: 'summon', u: 'golem', n: 1, life: 20 }], sfx: 'slam' });
defP('alchemist', 'potion_master', 'Potion Master', { school: 'nature', glyph: 'potion', desc: 'Potions are 40% stronger and come back twice as fast.', P: { potion: 0.4 } });
defP('alchemist', 'volatile_reagents', 'Volatile Reagents', { school: 'fire', glyph: 'flask', req: { wits: 4 }, desc: 'Fire and poison damage +20%.', P: { school: { fire: 0.2, poison: 0.2 } } });
defP('alchemist', 'prospector', 'Prospector', { school: 'earth', glyph: 'coin', req: { wits: 5 }, desc: '+35% crowns and +10% experience from battles.', P: { gold: 0.35, xp: 0.1 } });

/* ---------------- SHADOWBLADE ---------------- */
defA('shadowblade', 'shadowstep', 'Shadowstep', { school: 'shadow', glyph: 'dagger', cd: 9, range: 700, tg: 'far', req: { grace: 2 }, pose: 'thrust', desc: 'Step through the dark to the farthest foe and strike for 180%.', fx: [{ t: 'blink', to: 'behind' }, { t: 'delay', d: 0.1, fx: [{ t: 'dmg', m: 1.8, s: 'melee' }, { t: 'fx', type: 'slash', big: true, c: '#a090ff' }] }], sfx: 'blink' });
defA('shadowblade', 'death_mark', 'Death Mark', { school: 'shadow', glyph: 'skull', cd: 18, range: 520, req: { grace: 4 }, pose: 'point', desc: 'Doom a foe. After 4s, it suffers again 60% of all damage you dealt it in that time.', fx: [{ t: 'deathmark', d: 4, m: 0.6 }], sfx: 'dark' });
defA('shadowblade', 'blade_dance', 'Blade Dance', { school: 'steel', glyph: 'whirl', cd: 12, tg: 'self', req: { grace: 5 }, pose: 'spin', poseDur: 1.0, desc: 'Whirl with both blades: four cuts of 65% to everything near you, untouchable as you spin.', fx: [{ t: 'buff', n: 'ghost', d: 1 }, { t: 'repeat', n: 4, every: 0.25, fx: [{ t: 'dmg', m: 0.65, s: 'melee', r: 95 }, { t: 'fx', type: 'ring', r: 100, c: '#c8b0ff' }] }], sfx: 'swing' });
defA('shadowblade', 'vanish', 'Vanish', { school: 'shadow', glyph: 'cloud', cd: 20, tg: 'self', req: { grace: 7 }, desc: 'Disappear for 3s. Your next hit deals triple critical damage.', fx: [{ t: 'buff', n: 'inkcloud', d: 3 }, { t: 'buff', n: 'critNext', d: 8 }, { t: 'buff', n: 'critBig', d: 8 }, { t: 'lose' }, { t: 'burst', p: 'shadow', n: 20 }], sfx: 'dark' });
defP('shadowblade', 'killing_edge', 'Killing Edge', { school: 'shadow', glyph: 'dagger', desc: 'Critical hits deal +40% more damage.', P: { critPow: 0.4 } });
defP('shadowblade', 'nightstalker', 'Nightstalker', { school: 'shadow', glyph: 'moon', req: { grace: 4 }, desc: '+25% damage to foes that are not targeting you.', P: { vs: { unaware: 0.25 } } });
defP('shadowblade', 'bloodthirst', 'Bloodthirst', { school: 'blood', glyph: 'heart', req: { grace: 6 }, desc: 'Every kill heals 6% of your health and takes 1s off your cooldowns.', P: { onKill: [{ fx: [{ t: 'heal', p: 0.06, self: true }, { t: 'cdr', s: 1 }] }] } });

/* ---------------- SCRIVENER ---------------- */
defA('scrivener', 'strike_through', 'Strike Through', { school: 'ink', glyph: 'quill', cd: 8, tg: 'point', range: 420, req: { wits: 2 }, desc: 'Draw a line of ink through the world. Everything on it takes 150% and is slowed.', fx: [{ t: 'line', len: 400, w: 34, m: 1.5, s: 'spell', sc: 'ink', st: [['slow', 3]], vis: 'ink' }], sfx: 'page' });
defA('scrivener', 'footnote', 'Footnote', { school: 'ink', glyph: 'page', cd: 10, range: 520, req: { wits: 3 }, desc: 'Annotate a foe for 10s. If it dies annotated, it bursts for 140% to everything near it.', fx: [{ t: 'st', n: 'footnote', d: 10 }, { t: 'dmg', m: 0.5, s: 'spell', sc: 'ink' }, { t: 'text', s: '*', c: '#b8a0ff' }], sfx: 'page' });
defA('scrivener', 'rewrite', 'Rewrite', { school: 'ink', glyph: 'hourglass', cd: 24, tg: 'self', req: { heart: 4 }, pose: 'channel', poseDur: 0.6, desc: 'Scratch out the last 4 seconds: recover all the health you lost in them.', fx: [{ t: 'rewrite', s: 4 }, { t: 'burst', p: 'hexspark', n: 18 }], sfx: 'page' });
defA('scrivener', 'exclamation', 'Exclamation!', { school: 'ink', glyph: 'bang', cd: 15, tg: 'point', range: 480, req: { wits: 6 }, desc: 'Slam a giant inked "!" onto the page: 200% around the target and a 1s stun.', fx: [{ t: 'fx', type: 'tele', r: 110, c: '#8a70ff', d: 0.5 }, { t: 'delay', d: 0.5, fx: [{ t: 'dmg', m: 2.0, s: 'spell', sc: 'ink', r: 110, st: [['stun', 1]] }, { t: 'fx', type: 'explosion', r: 110, c: '#6a50ff' }, { t: 'burst', p: 'ink', n: 24 }, { t: 'shake', v: 0.9 }] }], sfx: 'slam' });
defP('scrivener', 'marginalia', 'Marginalia', { school: 'ink', glyph: 'quill', desc: 'Your cooldowns recover 15% faster.', P: { cdr: 0.15 } });
defP('scrivener', 'italics', 'Italics', { school: 'ink', glyph: 'page', req: { wits: 4 }, desc: '+10% spell damage and +10% movement speed.', P: { spell: 0.1, move: 0.1 } });
defP('scrivener', 'plot_armor', 'Plot Armor', { school: 'ink', glyph: 'tower', req: { heart: 6 }, desc: 'The first time you would fall below 25% health, become invulnerable for 2s.', P: { lowHp: [{ below: 0.25, fx: [{ t: 'buff', n: 'divine', d: 2 }, { t: 'text', s: 'Plot Armor', c: '#d8c8ff' }] }] } });

/* ---------------- GRAVEWARDEN ---------------- */
defA('gravewarden', 'lantern_of_souls', 'Lantern of Souls', { school: 'spirit', glyph: 'lantern', cd: 18, tg: 'self', req: { heart: 2 }, desc: 'Set down a grave-lantern for 8s: allies in its light heal, the undead in it burn.', fx: [{ t: 'zone', r: 130, d: 8, heal: 0.03, dps: 0.4, unholyOnly: true, sc: 'spirit', k: 'holy', c: '#9fe6ff' }], sfx: 'bell' });
defA('gravewarden', 'chain_hook', 'Chain Hook', { school: 'steel', glyph: 'chain', cd: 9, range: 420, req: { might: 3 }, pose: 'throw', desc: 'Hurl a hooked chain: drag a foe to your feet, 100% and a 1s stun.', fx: [{ t: 'hook', m: 1.0 }], sfx: 'steel' });
defA('gravewarden', 'toll_the_bell', 'Toll the Bell', { school: 'spirit', glyph: 'bell', cd: 16, tg: 'self', req: { heart: 4 }, pose: 'slam', desc: 'One deep toll: 90% to foes in a wide ring, all slowed, and the dead flee in terror.', fx: [{ t: 'dmg', m: 0.9, s: 'spell', sc: 'spirit', r: 220, st: [['slow', 3]], fearUnholy: 3 }, { t: 'fx', type: 'ring', r: 230, c: '#bfe0ff' }, { t: 'fx', type: 'ring', r: 140, c: '#bfe0ff' }, { t: 'shake', v: 0.5 }], sfx: 'bell' });
defA('gravewarden', 'soul_ward', 'Soul Ward', { school: 'spirit', glyph: 'ring', cd: 20, tg: 'self', req: { heart: 6 }, pose: 'roar', desc: 'Wrap yourself in bound spirits: a shield of 30% health for 6s that bursts for 120% when broken.', fx: [{ t: 'shield', p: 0.3, d: 6, burst: 1.2 }, { t: 'aura', c: '#bfe0ff', d: 6 }], sfx: 'holy' });
defP('gravewarden', 'keeper_of_keys', 'Keeper of Keys', { school: 'spirit', glyph: 'key', desc: '+10% max health and +2 Luck.', P: { maxHp: 0.1, luck: 2 } });
defP('gravewarden', 'wardens_vigil', "Warden's Vigil", { school: 'spirit', glyph: 'lantern', req: { heart: 4 }, desc: '+25% damage to undead and Inkspawn. They deal 15% less damage to you.', P: { vs: { unholy: 0.25 }, drUnholy: 0.15 } });
defP('gravewarden', 'iron_chains', 'Iron Chains', { school: 'steel', glyph: 'chain', req: { might: 5 }, desc: 'Your stuns, roots and freezes last 30% longer.', P: { ccDur: 0.3 } });

/* ==========================================================================
   Passive aggregation
   ========================================================================== */

/* ---------------- capstone spells: the fifth spell of every calling ----------------
   Capstones need level 10 and a high main attribute, and they hit like it. */
function defA5(cls, id, name, o) { defA(cls, id, name, Object.assign({ minLevel: 10, capstone: true }, o)); const L = CLASS_ABILS[cls]; L.splice(L.indexOf(id), 1); L.splice(4, 0, id); }
defA5('knight', 'banner_of_the_watch', 'Banner of the Watch', { school: 'steel', glyph: 'star', cd: 30, tg: 'self', pose: 'roar', desc: 'Plant the old watch banner: allies heal 30% and gain Warcry for 12s, you take half damage for 8s, every foe nearby takes 160% and flees for 3s.', fx: [{ t: 'heal', p: 0.3, team: true }, { t: 'buff', n: 'warcry', d: 12, team: true }, { t: 'buff', n: 'bulwark', d: 8 }, { t: 'dmg', m: 1.6, s: 'melee', r: 220, st: [['fear', 3]] }, { t: 'fx', type: 'pillar', c: '#ffe0a0', w: 70 }, { t: 'fx', type: 'ring', r: 240, c: '#ffcf8a' }, { t: 'shake', v: 1 }], sfx: 'shout' });
defA5('wizard', 'meteor', 'Meteor', { school: 'fire', glyph: 'star', cd: 28, tg: 'point', range: 600, desc: 'Call down a falling star. After a second it lands for 520% fire damage in a huge blast, stuns for 2.5s, and leaves the ground burning.', fx: [{ t: 'fx', type: 'tele', r: 160, c: '#ff7a3a', d: 1 }, { t: 'delay', d: 1.0, fx: [{ t: 'dmg', m: 5.2, s: 'spell', sc: 'fire', r: 160, st: [['stun', 2.5]], knock: 200 }, { t: 'zone', r: 140, d: 6, dps: 1.0, sc: 'fire', k: 'fire', c: '#ff5a1a' }, { t: 'fx', type: 'explosion', r: 190, c: '#ff8a3a' }, { t: 'burst', p: 'ember', n: 60 }, { t: 'shake', v: 1.6 }] }], sfx: 'boom' });
defA5('rogue', 'thousand_cuts', 'A Thousand Cuts', { school: 'shadow', glyph: 'dagger', cd: 24, range: 420, pose: 'thrust', desc: 'Vanish behind a foe and open it up: ten quick cuts of 70%, then a finishing stab of 260% that always crits on the stunned.', fx: [{ t: 'blink', to: 'behind' }, { t: 'repeat', n: 10, every: 0.09, fx: [{ t: 'dmg', m: 0.7, s: 'melee', quiet: true }, { t: 'fx', type: 'slash', c: '#d8c8ff' }] }, { t: 'delay', d: 0.95, fx: [{ t: 'dmg', m: 2.6, s: 'melee', critIfCC: true, critMul: 2.2, st: [['stun', 1.2]] }, { t: 'fx', type: 'slash', big: true, c: '#ffffff' }, { t: 'shake', v: 0.8 }] }], sfx: 'swing' });
defA5('cleric', 'dawns_mercy', 'Dawn’s Mercy', { school: 'holy', glyph: 'sun', cd: 34, tg: 'self', desc: 'The sun rises, just for a moment: all allies heal 70%, are cleansed, gain a shield worth 30% of their health, and the unholy nearby take 300% holy damage.', fx: [{ t: 'heal', p: 0.7, team: true }, { t: 'cleanse', team: true }, { t: 'shield', p: 0.3, d: 10, team: true }, { t: 'dmg', m: 1.2, s: 'spell', sc: 'holy', r: 300, unholy: 2.5 }, { t: 'fx', type: 'pillar', c: '#fff2c0', w: 110 }, { t: 'fx', type: 'ring', r: 330, c: '#ffe9a8' }, { t: 'burst', p: 'holy', n: 40 }], sfx: 'holy' });
defA5('ranger', 'storm_of_arrows', 'Storm of Arrows', { school: 'nature', glyph: 'arrow', cd: 26, tg: 'point', range: 640, pose: 'shoot', desc: 'Empty your quiver into the sky: fourteen volleys of 85% rain down over a wide circle, slowing and pinning everything under them.', fx: [{ t: 'fx', type: 'tele', r: 170, c: '#cfe8b0', d: 2 }, { t: 'repeat', n: 14, every: 0.14, fx: [{ t: 'dmg', m: 0.85, s: 'melee', r: 170, quiet: true, st: [['slow', 2.5]] }, { t: 'burst', p: 'spark', n: 8, spread: 160 }] }, { t: 'st', n: 'root', d: 1.5, r: 170 }], sfx: 'twang' });
defA5('barbarian', 'skullsplitter', 'Skullsplitter', { school: 'steel', glyph: 'axe', cd: 24, range: 460, pose: 'slam', desc: 'Leap high and bring the axe down on one foe: 480% and a 3s stun, with a shockwave of 170% around it. Below 30% health, it hits twice as hard.', fx: [{ t: 'dash', to: 'tgt', dur: 0.5, arc: 160, land: [{ t: 'dmg', m: 4.8, s: 'melee', st: [['stun', 3]], execute: 0.3, execMul: 2 }, { t: 'dmg', m: 1.7, s: 'melee', r: 140, knock: 170 }, { t: 'fx', type: 'ring', r: 150, c: '#e8b070' }, { t: 'burst', p: 'dust', n: 30 }, { t: 'shake', v: 1.5 }] }], sfx: 'slam' });
defA5('paladin', 'hammer_of_dawn', 'Hammer of Dawn', { school: 'holy', glyph: 'hammer', cd: 26, tg: 'point', range: 520, desc: 'A hammer of light falls from the sky: 400% holy damage (x2 to the unholy) and a 2.5s stun; allies nearby heal 25% and gain Divine for 3s.', fx: [{ t: 'fx', type: 'pillar', c: '#ffe08a', w: 100 }, { t: 'delay', d: 0.35, fx: [{ t: 'dmg', m: 4.0, s: 'spell', sc: 'holy', r: 140, unholy: 2, st: [['stun', 2.5]] }, { t: 'heal', p: 0.25, team: true, quiet: true }, { t: 'buff', n: 'divine', d: 3, team: true }, { t: 'fx', type: 'ring', r: 160, c: '#ffe9a8' }, { t: 'shake', v: 1.3 }] }], sfx: 'holy' });
defA5('stormcaller', 'hurricane', 'Hurricane', { school: 'storm', glyph: 'tornado', cd: 28, tg: 'self', desc: 'Become the eye of a storm: foes are dragged toward you, then lightning hammers everything nearby for 6s at 120% a strike.', fx: [{ t: 'pull', r: 360, str: 1.2 }, { t: 'storm', r: 210, d: 6, every: 0.28, m: 1.2 }, { t: 'aura', c: '#cfe8ff', d: 6 }, { t: 'shake', v: 0.8 }], sfx: 'wind' });
defA5('necromancer', 'army_of_the_grave', 'Army of the Grave', { school: 'death', glyph: 'skull', cd: 34, tg: 'self', desc: 'Five skeleton warriors claw out of the earth and fight for you for 22s, and every foe nearby is cursed with Rot.', fx: [{ t: 'summon', u: 'skeleton_ally', n: 5, life: 22 }, { t: 'st', n: 'rot', d: 6, r: 240, dps: 0.4 }, { t: 'burst', p: 'bone', n: 30 }, { t: 'shake', v: 0.8 }], sfx: 'bone' });
defA5('witchhunter', 'burn_the_witch', 'Burn the Witch', { school: 'fire', glyph: 'flame', cd: 26, range: 540, pose: 'throw', delay: 0.2, desc: 'Hurl a keg of blessed pitch: 340% fire in a wide blast (x1.5 to the unholy), then everything caught burns hard and panics for 3s.', fx: [{ t: 'flask', m: 3.4, r: 150 }, { t: 'delay', d: 0.6, fx: [{ t: 'st', n: 'burn', d: 6, r: 150, at: 'tgt', dps: 0.5 }, { t: 'st', n: 'fear', d: 3, r: 150, at: 'tgt' }] }], sfx: 'glass' });
defA5('monk', 'mountain_palm', 'Mountain Palm', { school: 'ki', glyph: 'fist', cd: 22, range: 380, pose: 'thrust', desc: 'Close the distance in a blink and strike with the weight of a mountain: 560% and a 3s stun, hurling the foe away and knocking down everything behind it.', fx: [{ t: 'dash', to: 'tgt', dur: 0.15, land: [{ t: 'dmg', m: 5.6, s: 'melee', knock: 480, st: [['stun', 3]] }, { t: 'dmg', m: 1.2, s: 'melee', r: 110, st: [['stun', 1]] }, { t: 'fx', type: 'ring', r: 110, c: '#ffd08a' }, { t: 'shake', v: 1.3 }] }], sfx: 'slam' });
defA5('bard', 'grand_finale', 'Grand Finale', { school: 'song', glyph: 'note', cd: 28, tg: 'self', pose: 'cheer', desc: 'Hit the last chord: 260% to every foe in a wide circle and they fall asleep for 2s; every ally gets the Ballad for 14s and their cooldowns tick 4s closer.', fx: [{ t: 'dmg', m: 2.6, s: 'spell', sc: 'song', r: 300 }, { t: 'st', n: 'sleep', d: 2, r: 300 }, { t: 'buff', n: 'song', d: 14, team: true }, { t: 'cdr', s: 4 }, { t: 'fx', type: 'ring', r: 320, c: '#ffb0e0' }, { t: 'burst', p: 'holy', n: 30, c: '#ffb0e0' }], sfx: 'bell' });
defA5('witch', 'hags_moon', 'The Hag’s Moon', { school: 'hex', glyph: 'moon', cd: 28, tg: 'point', range: 520, desc: 'Curse the ground under a crooked moon: foes nearby are hexed for 12s, the closest become toads for 4s, and the bog rises under them for 7s.', fx: [{ t: 'st', n: 'hexed', d: 12, r: 220 }, { t: 'st', n: 'toad', d: 4, r: 130 }, { t: 'zone', r: 170, d: 7, dps: 0.7, poison: 0.15, slow: true, sc: 'poison', k: 'poison', c: '#9a5ad8' }, { t: 'fx', type: 'ring', r: 230, c: '#c08aff' }], sfx: 'dark' });
defA5('druid', 'wild_hunt', 'The Wild Hunt', { school: 'nature', glyph: 'paw', cd: 32, tg: 'self', pose: 'roar', desc: 'Howl, and four grey wolves answer for 20s. You run with them in bear-strength: Quick and Ironbark for 8s.', fx: [{ t: 'summon', u: 'wolf', n: 4, life: 20 }, { t: 'buff', n: 'quick', d: 8 }, { t: 'buff', n: 'ironbark', d: 8 }, { t: 'burst', p: 'dust', n: 20, c: '#7a8a5a' }], sfx: 'wind' });
defA5('alchemist', 'chain_reaction', 'Chain Reaction', { school: 'fire', glyph: 'bang', cd: 26, range: 540, pose: 'throw', delay: 0.2, desc: 'Throw five unstable flasks in quick succession: five explosions of 170% around the target.', fx: [{ t: 'repeat', n: 5, every: 0.3, fx: [{ t: 'flask', m: 1.7, r: 105 }] }], sfx: 'glass' });
defA5('shadowblade', 'mirror_of_night', 'Mirror of Night', { school: 'shadow', glyph: 'eye', cd: 30, tg: 'self', desc: 'Step out of your own shadow three times: three ink doubles fight for 16s, you vanish for 3s, and your next strike always crits.', fx: [{ t: 'summon', u: 'ink_double', n: 3, life: 16 }, { t: 'buff', n: 'inkcloud', d: 3 }, { t: 'buff', n: 'critNext', d: 8 }, { t: 'lose' }, { t: 'burst', p: 'smoke', n: 24, c: '#1a1630' }], sfx: 'dark' });
defA5('scrivener', 'the_end', 'The End.', { school: 'ink', glyph: 'quill', cd: 32, range: 500, pose: 'point', desc: 'Write a full stop after a foe: 340% damage, quadrupled if it is below 35% health.', fx: [{ t: 'fx', type: 'pillar', c: '#2a2040', w: 60 }, { t: 'delay', d: 0.25, fx: [{ t: 'dmg', m: 3.4, s: 'spell', sc: 'ink', execute: 0.35, execMul: 4 }, { t: 'fx', type: 'ring', r: 90, c: '#8a70ff' }, { t: 'shake', v: 1 }] }], sfx: 'page' });
defA5('gravewarden', 'funeral_march', 'Funeral March', { school: 'spirit', glyph: 'bell', cd: 32, tg: 'self', pose: 'roar', desc: 'Toll for the dead: two spectral knights rise to fight for you for 22s, and foes nearby take 180% and flee for 3s.', fx: [{ t: 'summon', u: 'spirit_knight', n: 2, life: 22 }, { t: 'dmg', m: 1.8, s: 'spell', sc: 'spirit', r: 260, st: [['fear', 3]] }, { t: 'fx', type: 'ring', r: 270, c: '#9fe6ff' }], sfx: 'bell' });

/* every calling leans on a main attribute and a second one; requirements climb by tier */
const CLASS_STATS = { knight: ['might', 'heart'], wizard: ['wits', 'lore'], rogue: ['grace', 'wits'], cleric: ['heart', 'spirit'], ranger: ['grace', 'wits'], barbarian: ['might', 'heart'], paladin: ['might', 'spirit'], stormcaller: ['wits', 'spirit'], necromancer: ['spirit', 'wits'], witchhunter: ['grace', 'lore'], monk: ['grace', 'spirit'], bard: ['heart', 'lore'], witch: ['spirit', 'heart'], druid: ['heart', 'spirit'], alchemist: ['lore', 'wits'], shadowblade: ['grace', 'might'], scrivener: ['lore', 'wits'], gravewarden: ['spirit', 'might'] };
for (const [cls, L] of Object.entries(CLASS_ABILS)) {
  const [p, q] = CLASS_STATS[cls];
  const acts = L.filter((id) => AB[id].type === 'active'), pas = L.filter((id) => AB[id].type === 'passive');
  const tierA = [{ [p]: 2 }, { [p]: 4 }, { [q]: 4 }, { [p]: 7, [q]: 3 }, { [p]: 12, [q]: 7 }];
  const tierP = [{}, { [p]: 4 }, { [p]: 6, [q]: 4 }];
  acts.forEach((id, i) => { AB[id].req = tierA[Math.min(i, 4)]; });
  pas.forEach((id, i) => { AB[id].req = tierP[Math.min(i, 2)]; });
}

function emptyP() { return { maxHp: 0, melee: 0, spell: 0, dmg: 0, crit: 0, critPow: 0, atkSpd: 0, move: 0, def: 0, dr: 0, heal: 0, cdr: 0, leech: 0, regen: 0, regenLow: 0, dodge: 0, potion: 0, gold: 0, xp: 0, range: 0, rangedDmg: 0, summon: 0, summonLife: 0, dot: 0, ccDur: 0, aoe: 0, rage: 0, luck: 0, allyDmg: 0, allySpd: 0, drUnholy: 0, school: {}, vs: {}, stacks: {}, onHit: [], onSpellHit: [], onCrit: [], onKill: [], onAnyKill: [], onHurt: [], onCast: [], lowHp: [], onStart: [], unstoppable: false, cheatDeath: false }; }
function computeP(ids) {
  const P = emptyP();
  for (const id of ids || []) {
    const a = AB[id]; if (!a || a.type !== 'passive' || !a.P) continue;
    mergeP(P, a.P);
  }
  return P;
}
function mergeP(P, src) {
  {
    for (const k in src) {
      const v = src[k];
      if (Array.isArray(v)) P[k] = (P[k] || []).concat(v);
      else if (typeof v === 'object') { P[k] = P[k] || {}; for (const kk in v) P[k][kk] = (typeof v[kk] === 'object') ? Object.assign({}, P[k][kk] || {}, v[kk]) : (P[k][kk] || 0) + v[kk]; }
      else if (typeof v === 'boolean') P[k] = P[k] || v;
      else P[k] = (P[k] || 0) + v;
    }
  }
  return P;
}

/* ==========================================================================
   Casting
   ========================================================================== */
function sideOf(e) { return e.kind === 'foe' ? 'foe' : 'hero'; }
function enemiesOf(b, me) { return foesOf(b, me).filter(targetable); }
function friendsOf(b, me) { return me.kind === 'foe' ? b.ents.filter((o) => o.kind === 'foe' && !o.dead && o.state !== 'bones') : b.ents.filter((o) => (o.kind === 'hero' || o.kind === 'ally') && !o.dead); }
function statsOf(b, e) { return e.kind === 'hero' ? b.S : e.S || null; }
function passOf(b, e) { return e.kind === 'hero' ? b.P : e.P || null; }
const unholy = (e) => !!(e && e.def && (e.def.undead || e.def.inkborn));
const isCC = (e) => e.status.stun > 0 || e.status.freeze > 0 || e.status.root > 0 || e.status.sleep > 0 || e.status.toad > 0;
function castPose(me, dur, st) { me.state = st || 'cast'; me.st = 0; me.atkDur = dur || 0.5; me.hitAt = 2; me.hitDone = true; me.moveTo = null; me.p = 0; me.posing = true; }
function faceTo(me, t) { if (t) me.facing = t.x < me.x ? -1 : 1; }

function pickTarget(b, me, a) {
  const range = a.range * (1 + ((passOf(b, me) || {}).range || 0) * 0.5);
  const E = enemiesOf(b, me);
  if (a.tg === 'far') { let best = null, bd = -1; for (const o of E) { const d = dist(me.x, me.y, o.x, o.y); if (d <= range && d > bd) { bd = d; best = o; } } return best; }
  const t = me.target && targetable(me.target) && !me.target.dead && me.target.kind !== me.kind && dist(me.x, me.y, me.target.x, me.target.y) <= range ? me.target : null;
  return t || nearest(E, me.x, me.y, range);
}

/* returns true if the ability fired */
function castAbility(b, me, id) {
  const a = AB[id]; if (!a || a.type !== 'active') return false;
  const S = statsOf(b, me); if (!S) return false;
  const ctx = { b, me, S, P: passOf(b, me) || emptyP(), a, tgt: null, pt: null };
  if (a.tg === 'foe' || a.tg === 'far') { ctx.tgt = pickTarget(b, me, a); if (!ctx.tgt) return false; ctx.pt = { x: ctx.tgt.x, y: ctx.tgt.y }; }
  else if (a.tg === 'point') { const t = pickTarget(b, me, a); ctx.tgt = t; ctx.pt = t ? { x: t.x, y: t.y } : { x: me.x + me.facing * 160, y: me.y }; }
  else if (a.tg === 'ally') { const F = friendsOf(b, me); ctx.tgt = F.reduce((m, o) => (o.hp / o.maxHp < m.hp / m.maxHp ? o : m), me); ctx.pt = { x: ctx.tgt.x, y: ctx.tgt.y }; }
  else { ctx.tgt = me; ctx.pt = { x: me.x, y: me.y }; }
  if (ctx.tgt && ctx.tgt !== me) faceTo(me, ctx.tgt);
  castPose(me, a.poseDur || 0.5, a.pose);
  if (me.channel && a.fx[0].t !== 'chan') endChannel(b, me);
  const at = { x: ctx.pt.x, y: ctx.pt.y, e: ctx.tgt };
  const go = () => runFx(ctx, a.fx, at);
  if (a.delay) later(b, a.delay, go); else go();
  if (a.sfx) Sound.play(a.sfx, 60);
  // cast triggers
  me.casts = (me.casts || 0) + 1;
  for (const tr of ctx.P.onCast) if (me.casts % (tr.every || 1) === 0) runFx(ctx, tr.fx, { x: me.x, y: me.y, e: me });
  return true;
}

function runFx(ctx, list, at) { for (const f of list || []) doFx(ctx, f, at); }
function hitOne(ctx, e, f, at) {
  const { b, me, S } = ctx;
  if (!e || e.dead) return null;
  let m = f.m || 1;
  if (f.unholy && unholy(e)) m *= f.unholy;
  if (f.sc && S.school && S.school[f.sc]) m *= S.school[f.sc];
  if (f.execute && e.hp / e.maxHp < f.execute) { m *= f.execMul || 3; spawnText(b, e.x, headY(e) - 30, 'THE END', '#ffe6a0', 26); }
  const base = f.s === 'melee' ? S.melee : S.spellPower;
  const crit = f.critIfCC && isCC(e);
  const r = dealDamage(b, me, e, base * m * rand(0.94, 1.06), { kind: f.s === 'melee' ? 'melee' : 'spell', school: f.sc, knock: f.knock, forceCrit: crit, critMul: f.critMul, quiet: f.quiet && !crit, ability: true });
  if (r) {
    for (const s of f.st || []) applySt(ctx, e, s[0], s[1], s[2]);
    if (f.stUnholy && unholy(e)) for (const s of f.stUnholy) applySt(ctx, e, s[0], s[1], s[2]);
    if (f.fearUnholy && unholy(e)) applySt(ctx, e, 'fear', f.fearUnholy);
    if (f.leech) healEnt(b, me, r.dmg * f.leech);
    if (f.lift) e.z = -30;
    if (f.s !== 'melee') for (const tr of ctx.P.onSpellHit) if (!tr.sc || tr.sc === f.sc) runFx(ctx, tr.fx, { x: e.x, y: e.y, e });
  }
  return r;
}
function applySt(ctx, e, name, dur, dpsMul) {
  const { b, S, P, me } = ctx;
  if (e.dead) return;
  let d = dur;
  if (['stun', 'freeze', 'root', 'sleep', 'toad'].includes(name)) d *= 1 + (P.ccDur || 0);
  if (name === 'toad' && e.boss) { name = 'slow'; d = 3; }
  addStatus(b, e, name, d, dpsMul ? { dps: S.spellPower * dpsMul * (1 + (P.dot || 0)) * (S.dotMul || 1), src: me } : (name === 'hexed' || name === 'corrode' || name === 'footnote' ? { src: me, S } : null));
  if (name === 'poison') addPoison(b, e, S.spellPower * (dpsMul || 0.15));
}
function radiusOf(ctx, r) { return r * (1 + (ctx.P.aoe || 0)); }

function doFx(ctx, f, at) {
  const { b, me, S, P } = ctx;
  const anchor = f.at === 'self' ? { x: me.x, y: me.y, e: me } : f.at === 'src' ? at : f.at === 'tgt' ? { x: (ctx.tgt || me).x, y: (ctx.tgt || me).y, e: ctx.tgt || me } : at;
  const E = () => enemiesOf(b, me);
  switch (f.t) {
    case 'dmg': {
      if (f.r) { for (const e of inRadius(E(), anchor.x, anchor.y, radiusOf(ctx, f.r))) hitOne(ctx, e, f, anchor); }
      else if (anchor.e && anchor.e !== me) hitOne(ctx, anchor.e, f, anchor);
      break;
    }
    case 'cone': { for (const e of E()) { const dx = (e.x - me.x) * me.facing; if (dx > -10 && dx < f.r + e.r && Math.abs(e.y - me.y) < 46) hitOne(ctx, e, f, anchor); } break; }
    case 'line': {
      const ang = Math.atan2((anchor.y - me.y), (anchor.x - me.x) || me.facing);
      const x2 = me.x + Math.cos(ang) * f.len, y2 = me.y + Math.sin(ang) * f.len * 0.6;
      for (const e of E()) if (distToSeg(e.x, e.y, me.x, me.y, x2, y2) < f.w + e.r * 0.5) hitOne(ctx, e, f, anchor);
      addFx(b, { type: 'streak', x: me.x, y: me.y, x2, y2, dur: 0.35, c: f.vis === 'ink' ? '#3a2a8a' : ({ nature: '#7bbf3a', earth: '#c8a070' })[f.sc] || '#ffffff', wide: f.w * 0.5 });
      if (f.vis === 'ink') burst(b, (me.x + x2) / 2, (me.y + y2) / 2, 'ink', 16, { gy: (me.y + y2) / 2 });
      else burst(b, (me.x + x2) / 2, (me.y + y2) / 2, 'dust', 12, { gy: (me.y + y2) / 2 });
      break;
    }
    case 'st': {
      const targets = f.r ? inRadius(E(), anchor.x, anchor.y, radiusOf(ctx, f.r)) : (anchor.e && anchor.e !== me ? [anchor.e] : []);
      for (const e of targets) applySt(ctx, e, f.n, f.d, f.dps);
      break;
    }
    case 'proj': {
      const hp = handPos(me), n = f.n || 1;
      for (let i = 0; i < n; i++) {
        const o = { kind: f.k, speed: f.sp || 600, dmg: (f.s === 'melee' ? S.melee : S.spellPower) * (f.m || 1), spell: f.s !== 'melee', school: f.sc, pierce: f.pierce || 0, radius: f.rad || 18, life: f.life || 2.2, trail: f.trail, knock: f.knock, arc: f.arc, arcH: 90, ability: true };
        if (f.ring) o.ang = (i / n) * TAU;
        if (f.hit) o.onHit = (bb, p, e) => runFx(ctx, f.hit, { x: e ? e.x : (p.x1 != null ? p.x1 : p.x), y: e ? e.y : (p.y1 != null ? (ctx.tgt ? ctx.tgt.y : p.y + 44) : p.y + 44), e });
        shoot(b, me, hp.x, hp.y, f.ring ? null : ctx.tgt, o);
      }
      break;
    }
    case 'flask': {
      const hp = handPos(me), t = ctx.tgt, r = radiusOf(ctx, f.r || 80);
      shoot(b, me, hp.x, hp.y, t, { kind: 'flask', speed: 420, arc: true, arcH: 90, dmg: 0, radius: 16, onHit: (bb, p) => {
        const gx = p.x1 != null ? p.x1 : p.x, gy = t ? t.y : p.y + 44;
        for (const e of inRadius(E(), gx, gy, r)) hitOne(ctx, e, { m: f.m, s: 'spell', sc: 'fire' }, null);
        addZone(bb, { x: gx, y: gy, r: r * 0.9, dur: 3.5, dps: S.spellPower * 0.35, school: 'fire', kind: 'fire', light: '#ff7a2a', color: '#ff5a1a', side: sideOf(me), src: me });
        addFx(bb, { type: 'explosion', x: gx, y: gy, r, dur: 0.4, c: '#ffa040' }); burst(bb, gx, gy, 'ember', 16, { gy }); Sound.play('fire'); bb.shake = Math.max(bb.shake, 0.4);
      } });
      break;
    }
    case 'buff': {
      const who = f.team ? friendsOf(b, me).filter((o) => dist(o.x, o.y, me.x, me.y) < 320) : [me];
      for (const o of who) { o.buffs[f.n] = Math.max(o.buffs[f.n] || 0, f.d); }
      break;
    }
    case 'stack': {
      me.stacks = me.stacks || {}; const s = me.stacks[f.n] = me.stacks[f.n] || { n: 0, t: 0 };
      s.n = Math.min(f.max || 99, s.n + 1); s.t = f.d || 1e9;
      break;
    }
    case 'heal': {
      const who = f.team ? friendsOf(b, me).filter((o) => dist(o.x, o.y, me.x, me.y) < 320) : [f.self ? me : (ctx.tgt && ctx.tgt.kind === me.kind ? ctx.tgt : (ctx.tgt && sideOf(ctx.tgt) === sideOf(me) ? ctx.tgt : me))];
      for (const o of who) { const amt = (f.p ? o.maxHp * f.p : S.spellPower * (f.m || 1)) * (S.heal || 1) * (1 + (P.heal || 0)); healEnt(b, o, amt, f.quiet ? false : undefined); if (!f.quiet) burst(b, o.x, bodyY(o), 'holy', 8); }
      break;
    }
    case 'shield': { for (const o of f.team ? friendsOf(b, me).filter((x) => dist(x.x, x.y, me.x, me.y) < 320) : [me]) { o.shield = Math.max(o.shield || 0, o.maxHp * f.p * (S.shieldMul || 1)); o.shieldT = f.d; o.shieldBurst = f.burst && o === me ? S.spellPower * f.burst : 0; spawnText(b, o.x, headY(o) - 10, 'Shielded', '#bfe0ff', 18); } break; }
    case 'dash': {
      const t = anchor.e && anchor.e !== me ? anchor.e : null;
      let x1, y1;
      if (f.to === 'tgt' && t) { x1 = t.x - (t.x > me.x ? 1 : -1) * (t.r + 20); y1 = t.y; }
      else if (f.to === 'through') { const ang = Math.atan2(anchor.y - me.y, (anchor.x - me.x) || me.facing); x1 = me.x + Math.cos(ang) * 300; y1 = me.y + Math.sin(ang) * 180; }
      else { x1 = me.x + me.facing * (f.d || 200); y1 = me.y; }
      const x0 = me.x, y0 = me.y;
      startDash(b, me, x1, y1, f.dur || 0.25, { arc: f.arc, trail: 'dust', onLand: () => {
        if (f.sweep) { for (const e of E()) if (distToSeg(e.x, e.y, x0, y0, me.x, me.y) < f.sweep.w + e.r) hitOne(ctx, e, f.sweep, null); addFx(b, { type: 'streak', x: x0, y: y0, x2: me.x, y2: me.y, dur: 0.3, c: '#bfe8ff', wide: 10 }); }
        runFx(ctx, f.land, { x: t ? t.x : me.x, y: t ? t.y : me.y, e: t });
      } });
      break;
    }
    case 'blink': {
      const t = anchor.e && anchor.e !== me ? anchor.e : null;
      addFx(b, { type: 'glint', x: me.x, y: me.y, dur: 0.3, c: '#b3a2ff' }); burst(b, me.x, bodyY(me), 'shadow', 8);
      if (f.to === 'behind' && t) { const side = t.facing || 1; me.x = clamp(t.x - side * (t.r + 26), 30, b.W - 30); me.y = t.y; me.facing = side; }
      else if (f.to === 'tgt' && t) { me.x = clamp(t.x - (t.x > me.x ? 1 : -1) * (t.r + 18), 30, b.W - 30); me.y = t.y; }
      else { const f0 = nearest(E(), me.x, me.y, 600); const dx = f0 ? Math.sign(me.x - f0.x) || 1 : -me.facing; me.x = clamp(me.x + dx * (f.d || 220), 40, b.W - 40); if (f0) me.y = clamp(me.y + (me.y - f0.y) * 0.5, FIELD.top, FIELD.bot); }
      me.moveTo = null;
      addFx(b, { type: 'glint', x: me.x, y: me.y, dur: 0.3, c: '#b3a2ff' }); burst(b, me.x, bodyY(me), 'hexspark', 8);
      break;
    }
    case 'zone': {
      const z = { x: anchor.x, y: anchor.y, r: radiusOf(ctx, f.r), dur: f.d, dps: f.dps ? S.spellPower * f.dps : 0, heal: f.heal || 0, slow: !!f.slow, poison: f.poison ? S.spellPower * f.poison : 0, school: f.sc, kind: f.k, color: f.c, light: f.c, side: sideOf(me), src: me, unholyOnly: f.unholyOnly };
      if (f.t === 'zone' && (ctx.a.tg === 'self' || f.at === 'self')) { z.x = me.x; z.y = me.y; }
      addZone(b, z);
      break;
    }
    case 'trap': {
      addZone(b, { x: anchor.x, y: anchor.y, r: f.r, dur: f.d, trap: { m: f.m, st: f.st }, side: sideOf(me), src: me, color: '#c8b08a', kind: 'trap', S });
      break;
    }
    case 'storm': {
      const z = { x: anchor.x, y: anchor.y };
      addFx(b, { type: 'cloud', x: z.x, y: z.y, r: f.r, dur: f.d });
      addFx(b, { type: 'ticker', dur: f.d, every: f.every, n: Math.floor(f.d / f.every), fn: () => {
        const c = inRadius(E(), z.x, z.y, radiusOf(ctx, f.r)); if (!c.length) return;
        const e = pick(c); hitOne(ctx, e, { m: f.m, s: 'spell', sc: 'storm', st: [['stun', 0.2]] }, null);
        addFx(b, { type: 'lightning', pts: [[e.x, e.y - 300], [e.x, e.y - 44]], dur: 0.25 }); Sound.play('zap', 90);
      } });
      break;
    }
    case 'summon': {
      const n = f.n || 1, side = me.kind === 'foe' ? 'foe' : 'ally';
      for (let i = 0; i < n; i++) {
        const s = makeEnt(b, side, f.u, clamp(me.x + me.facing * (50 + i * 30), 40, b.W - 40), clamp(me.y + (i - (n - 1) / 2) * 40, FIELD.top, FIELD.bot));
        const boost = (1 + (P.summon || 0)) * (S.summonMul || 1);
        s.maxHp = Math.round(s.maxHp * boost); s.hp = s.maxHp; s.dmgMul = (s.dmgMul || 1) * boost;
        s.life = f.life * (1 + (P.summonLife || 0)); s.summon = true; s.owner = me;
        s.state = 'rise'; s.st = 0; s.alpha = 0; s.facing = me.facing;
        burst(b, s.x, s.y, 'dust', 12, { gy: s.y });
      }
      break;
    }
    case 'chain': {
      let t = f.from === 'tgt' ? anchor.e : (anchor.e && anchor.e !== me ? anchor.e : null);
      if (!t) break;
      const src = f.from === 'tgt' ? t : me;
      const hp = f.from === 'tgt' ? { x: t.x, y: t.y - 44 } : handPos(me), pts = [[hp.x, hp.y + 10]], hit = new Set();
      let m = f.m;
      if (f.skipFirst) { hit.add(t.id); const prev = t; t = nearest(E().filter((o) => !hit.has(o.id)), prev.x, prev.y, f.r); }
      for (let i = 0; i < f.n && t; i++) {
        hit.add(t.id); pts.push([t.x, t.y - 44]);
        hitOne(ctx, t, { m, s: 'spell', sc: f.sc, st: f.st, stUnholy: f.stUnholy }, null);
        burst(b, t.x, bodyY(t), 'spark', 6, { c: f.sc === 'holy' ? '#ffe9a8' : '#cfe8ff' });
        m *= 0.85;
        const prev = t; t = nearest(E().filter((o) => !hit.has(o.id)), prev.x, prev.y, f.r);
      }
      if (pts.length > 1) addFx(b, { type: f.vis === 'hammer' ? 'streak' : 'lightning', pts, x: pts[0][0], y: pts[0][1] - 40, x2: pts[pts.length - 1][0], y2: pts[pts.length - 1][1] - 40, dur: 0.35, c: '#ffe9a8', wide: 8 });
      void src;
      break;
    }
    case 'chan': { if (!anchor.e || anchor.e === me) break; me.channel = { target: anchor.e, t: 0, dur: f.d, acc: 0.3, m: f.m, leech: f.leech, c: f.c }; me.moveTo = null; break; }
    case 'pull': { for (const e of inRadius(E(), anchor.x, anchor.y, radiusOf(ctx, f.r))) { if (e.boss) continue; const dx = anchor.x - e.x, dy = anchor.y - e.y; e.kx = dx * 3.2 * f.str; e.ky = dy * 3.2 * f.str; } addFx(b, { type: 'ring', x: anchor.x, y: anchor.y, r0: f.r, r1: 20, dur: 0.35, c: '#cfe8ff' }); break; }
    case 'hook': {
      const t = anchor.e; if (!t || t === me) break;
      addFx(b, { type: 'streak', x: me.x, y: me.y, x2: t.x, y2: t.y, dur: 0.3, c: '#9aa0aa', wide: 4 });
      hitOne(ctx, t, { m: f.m, s: 'melee', st: [['stun', 1]] }, null);
      if (!t.boss) startDash(b, t, me.x + me.facing * (me.r + t.r + 10), me.y, 0.25, {});
      break;
    }
    case 'deathmark': {
      const t = anchor.e; if (!t || t === me) break;
      t.dmark = { acc: 0, src: me };
      addFx(b, { type: 'glint', x: t.x, y: t.y - 60, dur: 0.5, c: '#a090ff' });
      spawnText(b, t.x, headY(t) - 14, 'Doomed', '#a090ff', 18);
      later(b, f.d, () => { if (t.dead || !t.dmark) return; const amt = t.dmark.acc * f.m; t.dmark = null; if (amt > 0) { dealDamage(b, me, t, amt, { kind: 'spell', school: 'shadow', noEmpower: true, pure: true }); addFx(b, { type: 'explosion', x: t.x, y: t.y, r: 60, dur: 0.35, c: '#6a50ff' }); Sound.play('crit'); } });
      break;
    }
    case 'rewrite': { const hist = (me.hurtLog || []).filter((h) => b.t - h.t <= f.s); const amt = hist.reduce((s, h) => s + h.d, 0); me.hurtLog = []; healEnt(b, me, Math.max(amt, me.maxHp * 0.05)); spawnText(b, me.x, headY(me) - 22, 'Rewritten', '#d8c8ff', 18); break; }
    case 'selfdmg': { me.hp = Math.max(1, me.hp - me.maxHp * f.p); spawnText(b, me.x, headY(me), `-${Math.round(me.maxHp * f.p)}`, '#c8102e', 18); burst(b, me.x, bodyY(me), 'blood', 10); break; }
    case 'cleanse': { const ts = f.team ? friendsOf(b, me) : [ctx.tgt && sideOf(ctx.tgt) === sideOf(me) ? ctx.tgt : me]; for (const t of ts) for (const k of ['stun', 'freeze', 'slow', 'root', 'fear', 'burn', 'poison', 'bleed', 'rot', 'hexed', 'corrode', 'sleep', 'toad']) t.status[k] = 0; break; }
    case 'cdr': {
      if (me.kind === 'hero') { for (let i = 0; i < b.cds.length; i++) if (b.cds[i] > 0) b.cds[i] = Math.max(0, b.cds[i] - f.s); }
      else if (me.acd) for (const k in me.acd) me.acd[k] = Math.max(0, me.acd[k] - f.s);
      break;
    }
    case 'lose': { for (const o of b.ents) if (o.target === me) o.target = null; break; }
    case 'repeat': { let k = 0; addFx(b, { type: 'ticker', dur: f.n * f.every + 0.05, every: f.every, n: f.n, fn: () => { k++; const t = anchor.e; const a2 = t && !t.dead ? { x: t.x, y: t.y, e: t } : f.fx.some((q) => q.r) ? (ctx.a.tg === 'self' ? { x: me.x, y: me.y, e: me } : anchor) : anchor; runFx(ctx, f.fx, a2); } }); runFx(ctx, f.fx, anchor); break; }
    case 'delay': { later(b, f.d, () => runFx(ctx, f.fx, anchor.e && !anchor.e.dead ? { x: anchor.e.x, y: anchor.e.y, e: anchor.e } : anchor)); break; }
    case 'aura': { addFx(b, { type: 'aura', ent: me, dur: f.d, c: f.c }); break; }
    case 'shake': { b.shake = Math.max(b.shake, f.v); break; }
    case 'burst': { const n = f.n || 10; if (f.spread) { for (let i = 0; i < n; i++) burst(b, anchor.x + rand(-f.spread, f.spread), anchor.y + rand(-f.spread * 0.5, f.spread * 0.5) - 40, f.p, 1, { c: f.c }); } else burst(b, anchor.x, anchor.y - 30, f.p, n, { c: f.c, gy: anchor.y }); break; }
    case 'text': { const t = anchor.e || me; spawnText(b, t.x, headY(t) - 14, f.s, f.c || '#fff', 18); break; }
    case 'fx': {
      const ty = f.type;
      if (ty === 'ring') addFx(b, { type: 'ring', x: anchor.x, y: anchor.y, r0: 20, r1: radiusOf(ctx, f.r || 100), dur: 0.4, c: f.c });
      else if (ty === 'pillar') addFx(b, { type: 'pillar', x: anchor.x, y: anchor.y, w: f.w || 46, dur: 0.55, c: f.c });
      else if (ty === 'explosion') addFx(b, { type: 'explosion', x: anchor.x, y: anchor.y, r: radiusOf(ctx, f.r || 90), dur: 0.45, c: f.c });
      else if (ty === 'glint') addFx(b, { type: 'glint', x: anchor.x, y: anchor.y - 60, dur: 0.45, c: f.c });
      else if (ty === 'slash') { const t = anchor.e || me; addFx(b, { type: 'slash', x: t.x + (f.fwd ? me.facing * f.fwd : 0), y: t.y - 30, f: me.facing, dur: 0.2, c: f.c || '#ffffff', big: f.big }); }
      else if (ty === 'tele') tele(b, { shape: 'circle', x: anchor.x, y: anchor.y, r: radiusOf(ctx, f.r), dur: f.d || 0.6, color: f.c });
      break;
    }
    default: break;
  }
}

/* ==========================================================================
   Potions (unchanged behaviour, now scaled by Potion Master)
   ========================================================================== */
function throwFlask(b, h, hp, t, dmg, poison) {
  shoot(b, h, hp.x, hp.y, t, { kind: poison ? 'nightshade' : 'flask', speed: 420, arc: true, arcH: 90, dmg, radius: 16, onHit: (bb, p) => {
    const gx = p.x1 != null ? p.x1 : p.x, gy = t ? t.y : p.y + 44;
    if (poison) { addZone(bb, { x: gx, y: gy, r: 85, dur: 4, dps: dmg * 0.3, poison: dmg * 0.1, slow: true, kind: 'poison', light: '#8fd14f', color: '#6ad84a', side: 'hero', src: h }); burst(bb, gx, gy, 'poison', 18, { gy }); Sound.play('glass'); return; }
    for (const f of inRadius(living(bb, 'foe'), gx, gy, 80)) dealDamage(bb, h, f, dmg, { kind: 'spell', school: 'fire' });
    addZone(bb, { x: gx, y: gy, r: 75, dur: 3.5, dps: dmg * 0.35, school: 'fire', kind: 'fire', light: '#ff7a2a', color: '#ff5a1a', side: 'hero', src: h });
    addFx(bb, { type: 'explosion', x: gx, y: gy, r: 85, dur: 0.4, c: '#ffa040' }); burst(bb, gx, gy, 'ember', 16, { gy }); Sound.play('glass'); Sound.play('fire');
  } });
}
const potK = (b) => (1 + ((b.P && b.P.potion) || 0)) * ((b.S && b.S.potionMul) || 1);
const POTION_FX = {
  heal(b, h) { healEnt(b, h, h.maxHp * 0.4 * potK(b)); burst(b, h.x, bodyY(h), 'holy', 12, { c: '#ff8a7a' }); addFx(b, { type: 'ring', x: h.x, y: h.y, r0: 10, r1: 60, dur: 0.35, c: '#ff8a7a' }); return true; },
  fury(b, h) { h.buffs.fury = 12 * potK(b); burst(b, h.x, bodyY(h), 'ember', 14); spawnText(b, h.x, headY(h) - 10, 'Fury!', '#ff8a4a', 20); return true; },
  ironbark(b, h) { h.buffs.ironbark = 12 * potK(b); spawnText(b, h.x, headY(h) - 10, 'Ironbark', '#c8a878', 18); addFx(b, { type: 'aura', ent: h, dur: 12, c: '#c8a070' }); return true; },
  quicksilver(b, h) { h.buffs.quick = 10 * potK(b); spawnText(b, h.x, headY(h) - 10, 'Quicksilver', '#e6eef8', 18); burst(b, h.x, bodyY(h), 'spark', 12); return true; },
  fire(b, h) { const t = nearest(enemiesOf(b, h), h.x, h.y, 560); if (!t) return false; throwFlask(b, h, handPos(h), t, 26 * potK(b)); castPose(h, 0.4, 'throw'); return true; },
  nightshade(b, h) { const t = nearest(enemiesOf(b, h), h.x, h.y, 560); if (!t) return false; throwFlask(b, h, handPos(h), t, 18 * potK(b), true); castPose(h, 0.4, 'throw'); return true; },
  ghostwater(b, h) { h.buffs.ghost = 3 * potK(b); h.status.poison = 0; h.status.burn = 0; h.status.bleed = 0; burst(b, h.x, bodyY(h), 'frost', 16); spawnText(b, h.x, headY(h) - 10, 'Mist-form', '#9fe6ff', 18); return true; },
  clarity(b, h) { for (let i = 0; i < b.cds.length; i++) b.cds[i] = 0; burst(b, h.x, bodyY(h), 'holy', 16, { c: '#ffe08a' }); spawnText(b, h.x, headY(h) - 10, 'Clarity', '#ffe08a', 18); return true; },
};
