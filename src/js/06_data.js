/* ==========================================================================
   Data - classes, spells, gear, potions, enemies, cast, battles
   ========================================================================== */
const CLASSES = {
  knight: { name: 'Knight', color: '#6f8fb8', glyph: 'shield', blurb: 'Steel, shield and stubbornness. Stands in front so others do not have to.', teacher: 'your own training' },
  wizard: { name: 'Wizard', color: '#6a7ae0', glyph: 'flame', blurb: 'Reads the margins of the world and sets them on fire.', teacher: 'your own training' },
  rogue: { name: 'Rogue', color: '#6aa36a', glyph: 'dagger', blurb: 'Quick hands, quicker knives, and no great love of fair fights.', teacher: 'your own training' },
  cleric: { name: 'Cleric', color: '#d8b04a', glyph: 'cross', blurb: 'Carries a candle into the dark and expects it to listen.', teacher: 'your own training' },
  ranger: { name: 'Ranger', color: '#5a8a3a', glyph: 'arrow', blurb: 'Bow, traps and a hawk. Ends fights before they reach arm’s length.', teacher: 'your own training' },
  barbarian: { name: 'Barbarian', color: '#b8481e', glyph: 'axe', blurb: 'Big axe, bigger temper. Gets stronger the more it bleeds.', teacher: 'your own training' },
  paladin: { name: 'Paladin', color: '#e8c060', glyph: 'hammer', blurb: 'An oath made steel. Hammers, holy fire and a shield no blade can pass.', teacher: 'the ghost of Sir Aldric' },
  stormcaller: { name: 'Stormcaller', color: '#6fd0ff', glyph: 'tornado', blurb: 'Speaks to the wind and the wind answers with lightning.', teacher: 'Old Hessa of the standing stones' },
  necromancer: { name: 'Necromancer', color: '#7bd389', glyph: 'skull', blurb: 'Forbidden. Commands what the night will not let rest.', forbidden: true, teacher: 'Veyra the gravedigger' },
  witchhunter: { name: 'Witch Hunter', color: '#b8b0a0', glyph: 'quarrel', blurb: 'Silver, fire and a crossbow, sworn against the dark.', teacher: 'Inquisitor Vane' },
  monk: { name: 'Monk', color: '#e0903a', glyph: 'fist', blurb: 'Empty hands, full breath. Moves like water and strikes like a door slamming.', teacher: 'Brother Ash of the drowned monastery' },
  bard: { name: 'Bard', color: '#d870c0', glyph: 'note', blurb: 'A lute, a lie and a lullaby. Makes allies braver and enemies drowsy.', teacher: 'Pip of the Leaky Inkpot' },
  witch: { name: 'Witch', color: '#9a5ad8', glyph: 'toad', blurb: 'Hexes, swamp gas and a temper. Turns trouble into toads.', forbidden: true, teacher: 'Mother Fen of the Fenmire' },
  druid: { name: 'Druid', color: '#4a9a4a', glyph: 'leaf', blurb: 'Thorns, roots and wolves. Wears a bear when it needs to.', teacher: 'the Green Hermit' },
  alchemist: { name: 'Alchemist', color: '#c8a030', glyph: 'flask', blurb: 'Bottled fire, acid and miracles, in that order.', teacher: 'Madam Tallow' },
  shadowblade: { name: 'Shadowblade', color: '#6a50c8', glyph: 'moon', blurb: 'An assassin who walks through shadows the way you walk through doors.', forbidden: true, teacher: 'the Hollow Guild of Saltmere' },
  scrivener: { name: 'Scrivener', color: '#4a3aa8', glyph: 'quill', blurb: 'Writes words into the world and they become true for a while.', teacher: 'the Scriveners of the Folio' },
  gravewarden: { name: 'Gravewarden', color: '#9ab8d0', glyph: 'lantern', blurb: 'Keeper of the dead’s doors. Chains, bells and a lantern that remembers names.', teacher: 'the Barrow Keepers' },
};
const ORIGINS = ['knight', 'wizard', 'rogue', 'cleric', 'ranger', 'barbarian'];

/* ability schools (the abilities themselves live in 13_skills.js) */
const SCHOOL_COLOR = { steel: '#d9e2ee', fire: '#ff8a3a', frost: '#a8e6ff', arcane: '#b3a2ff', storm: '#cfe8ff', shadow: '#8a7ab8', poison: '#8fd14f', holy: '#ffe9a8', death: '#7bd389', silver: '#e6eef8', nature: '#8fd060', blood: '#e0303a', earth: '#c8a070', ki: '#bfe8ff', song: '#ffb0e0', hex: '#c070ff', ink: '#8a70ff', spirit: '#bfe0ff' };

/* weapons: dmg, cd (seconds between swings), range, kind, scale stat */
const WEAPON_TYPES = {
  sword: { kind: 'melee', range: 58, cd: 0.9, hit: 0.42, stat: 'might', sfx: 'steel' },
  mace: { kind: 'melee', range: 58, cd: 1.25, hit: 0.48, stat: 'might', daze: 0.15, sfx: 'blunt' },
  daggers: { kind: 'melee', range: 48, cd: 0.52, hit: 0.4, stat: 'grace', crit: 0.08, sfx: 'steel', anim: 'thrust' },
  staff: { kind: 'ranged', range: 280, cd: 1.1, hit: 0.5, stat: 'wits', proj: 'bolt', spellAuto: true },
  crossbow: { kind: 'ranged', range: 320, cd: 1.5, hit: 0.5, stat: 'grace', proj: 'quarrel', anim: 'shoot' },
  sickle: { kind: 'melee', range: 54, cd: 0.85, hit: 0.42, stat: 'wits', leech: 0.12, sfx: 'steel' },
  bow: { kind: 'ranged', range: 340, cd: 1.0, hit: 0.5, stat: 'grace', proj: 'quarrel', anim: 'shoot', bow: true },
  greataxe: { kind: 'melee', range: 66, cd: 1.35, hit: 0.5, stat: 'might', cleave: 70, sfx: 'blunt' },
  hammer: { kind: 'melee', range: 60, cd: 1.3, hit: 0.5, stat: 'might', daze: 0.2, sfx: 'blunt' },
  spear: { kind: 'melee', range: 84, cd: 1.0, hit: 0.45, stat: 'grace', sfx: 'steel', anim: 'thrust' },
  fists: { kind: 'melee', range: 44, cd: 0.45, hit: 0.4, stat: 'grace', sfx: 'blunt', anim: 'thrust' },
};

/* gear. slot: weapon | offhand | head | body */
const ITEMS = {
  notched_sword: { slot: 'weapon', name: 'Notched Sword', wt: 'sword', dmg: 9, vis: { type: 'sword' }, desc: 'Seen better days. So have you.' },
  ashwood_staff: { slot: 'weapon', name: 'Ashwood Staff', wt: 'staff', dmg: 8, spell: 3, vis: { type: 'staff', color2: '#8fd7ff' }, desc: 'Hums when lies are told near it.' },
  twin_knives: { slot: 'weapon', name: 'Twin Knives', wt: 'daggers', dmg: 5, vis: { type: 'daggers' }, desc: 'One for each problem.' },
  iron_mace: { slot: 'weapon', name: 'Iron Mace', wt: 'mace', dmg: 13, vis: { type: 'mace' }, desc: 'Argues theology with skulls.' },
  quill_blade: { slot: 'weapon', name: 'Quill Blade', wt: 'sword', dmg: 13, stats: { might: 1 }, vis: { type: 'sword', color: '#d7dde6', color2: '#3b3f8c' }, price: 45, desc: 'Forged from a giant’s pen-nib. Writes in red.' },
  bellbreaker: { slot: 'weapon', name: 'Bellbreaker', wt: 'mace', dmg: 18, vis: { type: 'mace', color: '#4a4f58', color2: '#c08f2a' }, price: 45, req: { might: 3 }, desc: 'Cracked the chapel bell. Nobody asked twice.' },
  raven_knives: { slot: 'weapon', name: "Nim's Ravens", wt: 'daggers', dmg: 7, stats: { grace: 1 }, vis: { type: 'daggers', color: '#2a2a36', color2: '#a3241c' }, desc: 'Black blades with red tassels. Nim’s brother carried them.' },
  inkwell_staff: { slot: 'weapon', name: 'Inkwell Staff', wt: 'staff', dmg: 11, spell: 5, vis: { type: 'staff', color: '#3a2a4a', color2: '#b06ad8' }, price: 45, desc: 'Topped with an inkwell that is never empty.' },
  hunters_crossbow: { slot: 'weapon', name: "Hunter's Crossbow", wt: 'crossbow', dmg: 15, vis: { type: 'crossbow' }, price: 50, desc: 'Silver-chased. Smells of pitch and certainty.' },
  grave_sickle: { slot: 'weapon', name: 'Grave Sickle', wt: 'sickle', dmg: 10, spell: 2, vis: { type: 'sickle', color: '#c7d0c4' }, desc: 'Veyra’s. It wants to be used, which is the problem.' },
  oathblade: { slot: 'weapon', name: 'The Oathblade', wt: 'sword', dmg: 16, stats: { might: 1, heart: 1 }, vis: { type: 'sword', color: '#e9eef5', color2: '#c08f2a' }, desc: 'Captain Brannoc’s sworn sword. It is not yours.' },
  hunting_bow: { slot: 'weapon', name: 'Yew Hunting Bow', wt: 'bow', dmg: 8, vis: { type: 'bow' }, desc: 'Strung with gut from something that argued.' },
  woodsman_axe: { slot: 'weapon', name: "Woodsman's Greataxe", wt: 'greataxe', dmg: 15, vis: { type: 'greataxe' }, desc: 'Felled a forest. Is now looking for a new hobby.' },
  stormglass_staff: { slot: 'weapon', name: 'Stormglass Staff', wt: 'staff', dmg: 12, spell: 6, stats: { grace: 1 }, vis: { type: 'staff', top: 'storm', color: '#e8eef4', color2: '#6fe0ff' }, price: 70, desc: 'A bottled thunderhead on a stick. Do not shake.' },
  sun_hammer: { slot: 'weapon', name: 'Sunforged Hammer', wt: 'hammer', dmg: 19, stats: { heart: 1 }, req: { might: 4 }, vis: { type: 'hammer', color: '#e8eaee' }, desc: 'Sir Aldric’s hammer. It is warm, always.' },
  fen_crook: { slot: 'weapon', name: 'Fen Crook', wt: 'staff', dmg: 10, spell: 5, stats: { wits: 1 }, vis: { type: 'staff', top: 'hook', color: '#3a2a20', color2: '#a6ff5a' }, desc: 'Mother Fen’s old crook. Toads follow it.' },
  saltmere_cutlass: { slot: 'weapon', name: 'Saltmere Cutlass', wt: 'sword', dmg: 15, stats: { grace: 1 }, vis: { type: 'sword', color: '#cfd8e0', color2: '#3a6a8a' }, price: 60, desc: 'Curved for boarding actions and bad arguments.' },
  barrow_blade: { slot: 'weapon', name: 'Barrow-King’s Blade', wt: 'sword', dmg: 22, stats: { might: 2 }, req: { might: 5 }, vis: { type: 'runeblade', color: '#9ab8d0', glow: '#7fd1ff' }, desc: 'Cold enough to frost your breath. It remembers a crown.' },
  quillspear: { slot: 'weapon', name: 'Quillspear', wt: 'spear', dmg: 17, spell: 3, stats: { wits: 1 }, vis: { type: 'spear', color: '#d7dde6' }, price: 75, desc: 'A Scrivener’s pen grown to the size of an argument.' },
  wraps_of_ash: { slot: 'weapon', name: 'Wraps of Ash', wt: 'fists', dmg: 7, stats: { grace: 1, heart: 1 }, vis: { type: 'none' }, desc: 'Monk’s hand-wraps. They never fray.' },
  elm_longbow: { slot: 'weapon', name: 'Elm Longbow', wt: 'bow', dmg: 13, stats: { grace: 1 }, vis: { type: 'bow', color: '#8a5a2a' }, price: 55, desc: 'Taller than its owner and twice as patient.' },
  bonereaver: { slot: 'weapon', name: 'Bonereaver', wt: 'greataxe', dmg: 24, stats: { might: 1 }, req: { might: 5 }, vis: { type: 'greataxe', color: '#e0d8c8' }, price: 90, desc: 'An axe with a ribcage for a haft.' },
  buckler: { slot: 'offhand', name: 'Battered Buckler', def: 3, vis: { type: 'shield' }, desc: 'Dented by three wars and one goat.' },
  iron_kite: { slot: 'offhand', name: 'Iron Kite Shield', def: 6, req: { might: 3 }, vis: { type: 'kite', color: '#2f4f7a' }, price: 30, desc: 'Tall enough to hide behind. Heavy enough to regret.' },
  prayer_book: { slot: 'offhand', name: 'Prayer Book', spell: 2, vis: { type: 'tome', color: '#5b2a24' }, desc: 'Margins full of a previous owner’s doubts.' },
  book_of_hours: { slot: 'offhand', name: 'Book of Hours', spell: 4, stats: { heart: 1 }, vis: { type: 'tome', color: '#e8dcc0', color2: '#d4ad48' }, desc: 'Amberly’s own. Every prayer in it has been answered at least once.' },
  wolf_hood: { slot: 'head', name: 'Wolfskin Hood', def: 2, stats: { grace: 1 }, vis: { type: 'hood', color: '#4a5a3a' }, desc: 'The wolf did not need it anymore.' },
  horned_cap: { slot: 'head', name: 'Horned Cap', def: 3, stats: { might: 1 }, vis: { type: 'horned' }, desc: 'Mostly for intimidation. Partly for headbutts.' },
  stormcrown: { slot: 'head', name: 'Storm Circlet', def: 2, stats: { wits: 1, grace: 1 }, vis: { type: 'circlet', color: '#c8d4e0', color2: '#6fe0ff', wings: true }, desc: 'Hessa’s gift. Your hair stands up when it rains.' },
  winged_helm: { slot: 'head', name: 'Winged Helm', def: 6, stats: { heart: 1 }, req: { might: 4 }, vis: { type: 'winged', color: '#e8e6e0', color2: '#c9a14a' }, desc: 'The wings are not for flying. They are for being seen.' },
  witch_hat: { slot: 'head', name: 'Fen Witch’s Hat', def: 1, stats: { wits: 2 }, vis: { type: 'witch', color: '#2a1e34', color2: '#6a8a3a' }, desc: 'Brimmed wide enough to keep the moon off your secrets.' },
  dented_helm: { slot: 'head', name: 'Dented Helm', def: 3, vis: { type: 'helm' }, desc: 'Keeps most of the rain out.' },
  pointed_hat: { slot: 'head', name: 'Pointed Hat', def: 1, stats: { wits: 1 }, vis: { type: 'wizard', color: '#2c2a5a' }, desc: 'The point is mostly symbolic.' },
  shadow_hood: { slot: 'head', name: 'Shadow Hood', def: 2, stats: { grace: 1 }, vis: { type: 'hood', color: '#28332a' }, desc: 'Deep enough to hide a frown.' },
  silver_circlet: { slot: 'head', name: 'Silver Circlet', def: 1, stats: { heart: 1 }, vis: { type: 'circlet' }, desc: 'Cold against the brow. Warm against the dark.' },
  gorrak_pot: { slot: 'head', name: "Gorrak's Pot", def: 4, vis: { type: 'pot' }, desc: 'Still smells of stew.' },
  captains_helm: { slot: 'head', name: "Captain's Helm", def: 6, stats: { might: 1 }, vis: { type: 'helm', plume: '#a3241c' }, desc: 'Brannoc’s plumed helm, given freely.' },
  gutter_crown: { slot: 'head', name: 'The Gutter Crown', def: 3, stats: { might: 1, wits: 1, grace: 1, heart: 1 }, vis: { type: 'crown' }, desc: 'Tin, glass and stolen pride.' },
  grave_cowl: { slot: 'head', name: 'Grave Cowl', def: 2, stats: { wits: 1 }, vis: { type: 'cowl', color: '#1e2420' }, desc: 'The dark inside it looks back.' },
  hunters_brim: { slot: 'head', name: "Hunter's Hat", def: 2, stats: { grace: 1 }, vis: { type: 'brim', color: '#1f1b1b' }, price: 28, desc: 'Wide enough to keep the moon out of your eyes.' },
  fur_jerkin: { slot: 'body', name: 'Fur Jerkin', def: 3, vis: { type: 'bare', color: '#5a3a24', fur: '#9a8466' }, desc: 'Warm, smelly and very convincing.' },
  ranger_leathers: { slot: 'body', name: 'Ranger Leathers', def: 3, vis: { type: 'vest', color: '#5a4a2e', color2: '#7a6a44' }, desc: 'Green-dyed and patched with moss.' },
  oath_plate: { slot: 'body', name: 'Oath Plate', def: 11, stats: { heart: 1 }, req: { might: 5 }, vis: { type: 'armor', color: '#e4e2dc', color2: '#f2efe6', trim: '#d4ad48', emblem: 'sun', pauldron: '#d4ad48' }, desc: 'Every dent in it is a promise kept.' },
  stormweave_robe: { slot: 'body', name: 'Stormweave Robe', def: 4, stats: { grace: 1 }, vis: { type: 'robe', color: '#3a6ea8', trim: '#eef6ff', rune: '#6fe0ff' }, price: 60, desc: 'Lined with stitched lightning.' },
  saltmere_coat: { slot: 'body', name: 'Saltmere Greatcoat', def: 6, stats: { might: 1 }, vis: { type: 'coat', color: '#2a3a4a', color2: '#d8c890' }, price: 55, desc: 'Brass buttons, salt stains, three hidden pockets.' },
  padded_gambeson: { slot: 'body', name: 'Padded Gambeson', def: 4, vis: { type: 'armor', color: '#8a7a64', color2: '#2f4f7a', pauldron: '#8a8f99' }, desc: 'Quilted, patched, reliable.' },
  ash_robe: { slot: 'body', name: 'Ash Robe', def: 2, vis: { type: 'robe', color: '#2c2a5a', trim: '#c08f2a' }, desc: 'Singed at the hem. Twice.' },
  night_leathers: { slot: 'body', name: 'Night Leathers', def: 3, vis: { type: 'vest', color: '#3a2c24', color2: '#5a4434' }, desc: 'Creaks only when it wants to.' },
  vestments: { slot: 'body', name: 'Chapel Vestments', def: 3, vis: { type: 'robe', color: '#ece4d0', trim: '#c08f2a' }, desc: 'White, against all odds.' },
  chainmail: { slot: 'body', name: 'Chainmail', def: 8, req: { might: 3 }, vis: { type: 'armor', color: '#9aa4b2', color2: '#7a1f1b', trim: '#c08f2a' }, price: 40, desc: 'Ten thousand rings, each with an opinion.' },
  hunters_coat: { slot: 'body', name: "Hunter's Coat", def: 5, stats: { grace: 1 }, vis: { type: 'coat', color: '#2a2426', color2: '#d8d0c0' }, price: 35, desc: 'Long, black and full of silver pins.' },
  grave_shroud: { slot: 'body', name: 'Grave Shroud', def: 3, stats: { wits: 2 }, vis: { type: 'robe', color: '#1f2622', trim: '#7bd389' }, desc: 'Stitched by Veyra from a dozen funerals.' },
};

const POTIONS = {
  heal: { name: 'Healing Draught', color: '#c94a3a', price: 10, desc: 'Heals 40% of your health.' },
  fury: { name: 'Draught of Fury', color: '#e8742a', price: 16, desc: '+35% damage for 12 s.' },
  ironbark: { name: 'Ironbark Tonic', color: '#8a6a3a', price: 16, desc: 'Take 35% less damage for 12 s.' },
  quicksilver: { name: 'Quicksilver', color: '#cfd8e6', price: 18, desc: '+40% move and attack speed for 10 s.' },
  fire: { name: "Alchemist's Fire", color: '#ff9a2a', price: 14, lockedUntil: 'tallowDone', desc: 'Thrown. A burst of fire that leaves the ground burning.' },
  nightshade: { name: 'Nightshade Vial', color: '#7bbf3a', price: 14, lockedUntil: 'tallowDone', desc: 'Thrown. A poison cloud that slows and sickens.' },
  ghostwater: { name: 'Ghostwater', color: '#9fe6ff', desc: 'Become untouchable mist for 3 s. Clears poison and burns.' },
  clarity: { name: 'Elixir of Clarity', color: '#d8b04a', desc: 'Every cooldown is reset.' },
};
const POTION_ORDER = ['heal', 'fury', 'ironbark', 'quicksilver', 'fire', 'nightshade', 'ghostwater', 'clarity'];

const KEY_ITEMS = {
  spectacles: { name: "Morrow's Spectacles", desc: 'Gold-rimmed, etched "M.M." Found in a rat’s nest.' },
  doll: { name: 'Mabel the Doll', desc: 'A rag doll with button eyes. It belongs to a dead girl.' },
  gravemoss: { name: 'Gravemoss', desc: 'Pale moss that only grows where the dead were buried.' },
  blotsalt: { name: 'Blot Salt', desc: 'Black crystals that form where ink has pooled for weeks.' },
  tunnelkey: { name: 'Smuggler’s Key', desc: 'Opens the iron door under the mill.' },
  page: { name: "Quillsby's Ending", desc: 'A single page, torn neatly along the spine. It is warm.' },
  mapscrap: { name: 'Goblin Map Scrap', desc: 'A crude map to a library with teeth.' },
  hangmans_coin: { name: "Hangman's Coin", desc: 'Lucky, if you ask the hangman. +2 Luck.' },
  wrens_ribbon: { name: "Wren's Ribbon", desc: 'A faded blue ribbon. You feel watched over. +2 Luck.' },
};

/* ---------------- cast (people) ---------------- */
const CAST = {
  tassel: { name: 'Tassel' },
  mayor: { rig: 'human', name: 'Mayor Puddingworth', skin: SKINS[0], hair: { style: 'bald', color: '#5a4030' }, hat: { type: 'tophat' }, body: { type: 'belly', color: '#6a1f1b', trim: '#c08f2a' }, beard: { style: 'mustache', color: '#6a4a36' }, face: 'sad', wide: 1.25, legs: '#2a2228' },
  amberly: { rig: 'human', name: 'Sister Amberly', skin: SKINS[1], hat: { type: 'veil', color: '#262a3a' }, body: { type: 'dress', color: '#ece4d0', trim: '#c08f2a' }, weapon: { type: 'candle' }, face: 'kind' },
  pell: { rig: 'human', name: 'Pell', skin: SKINS[2], hair: { style: 'mop', color: HAIRS[1] }, body: { type: 'tunic', color: '#6a5a40' }, face: 'sad', legs: '#4a3a2a' },
  nim: { rig: 'human', name: 'Nim Blackwick', skin: SKINS[1], hair: { style: 'pony', color: '#1a1414' }, hat: { type: 'hood', color: '#2a2440' }, body: { type: 'vest', color: '#2e2630', color2: '#5a4058' }, weapon: { type: 'cards' }, face: 'hero', mouth: 'smirk', scar: true, legs: '#221c22' },
  agatha: { rig: 'human', name: 'Red Agatha', skin: SKINS[3], hair: { style: 'braid', color: '#7a1f1b' }, hat: { type: 'bandana', color: '#a3241c' }, body: { type: 'coat', color: '#7a1f1b', color2: '#2a1a1a' }, weapon: { type: 'daggers' }, face: 'stern', brows: 'angry', scale: 1.1, wide: 1.1, legs: '#2a2020' },
  brannoc: { rig: 'human', name: 'Captain Brannoc', skin: SKINS[0], hair: { style: 'bald', color: '#cfc8bc' }, beard: { style: 'full', color: '#d8d2c6' }, body: { type: 'armor', color: '#8a96a6', color2: '#2f4f7a', trim: '#c08f2a' }, weapon: { type: 'sword' }, offhand: { type: 'kite', color: '#2f4f7a' }, face: 'stern', gauntlets: true, cape: '#2f4f7a', scale: 1.08 },
  vane: { rig: 'human', name: 'Inquisitor Vane', skin: SKINS[0], hair: { style: 'long', color: '#2a2220' }, hat: { type: 'brim', color: '#1a1616', color2: '#7a1f1b' }, body: { type: 'coat', color: '#221e20', color2: '#d8d0c0' }, weapon: { type: 'crossbow' }, face: 'stern', beard: { style: 'stubble', color: '#2a201a' }, cape: '#141212', legs: '#1a1618' },
  morrow: { rig: 'human', name: 'Old Morrow', skin: '#d9c2a8', hair: { style: 'wild', color: '#cfcac0' }, body: { type: 'dress', color: '#3e3654', trim: '#6a5a7a' }, weapon: { type: 'broom' }, face: 'old', nose: 'hook', wrinkles: true, hunch: 0.35 },
  mott: { rig: 'human', name: 'Mott the Gravedigger', skin: '#c9b29a', hair: { style: 'wild', color: '#6a6a6a' }, body: { type: 'tunic', color: '#4a4436' }, weapon: { type: 'shovel' }, offhand: { type: 'lantern' }, face: 'old', nose: 'big', hunch: 0.8, wrinkles: true },
  veyra: { rig: 'human', name: 'Veyra, the Grave Witch', skin: '#d8dcd6', hat: { type: 'cowl', color: '#1a201c' }, body: { type: 'dress', color: '#1f2622', trim: '#7bd389' }, weapon: { type: 'sickle' }, face: 'hero', eyes: { color: '#7bd389', glow: true }, mouth: 'smirk' },
  tallow: { rig: 'human', name: 'Madam Tallow', skin: SKINS[1], hair: { style: 'bun', color: '#8c5a2b' }, hat: { type: 'kerchief', color: '#6a2f43' }, body: { type: 'dress', color: '#5a4636', trim: '#e8dcc0', belt: '#e8dcc0' }, weapon: { type: 'candle' }, face: 'stern', mouth: 'smirk', wide: 1.1 },
  wren: { rig: 'human', name: 'Wren', skin: '#dfe8f0', hair: { style: 'long', color: '#c8d0dc' }, body: { type: 'dress', color: '#e6eef6' }, face: 'child', scale: 0.72, eyes: { color: '#5a8ab0' } },
  gorrak: { rig: 'human', name: 'Gorrak', skin: PAL.goblin, ears: 'goblin', face: 'goblin', body: { type: 'rags', color: '#6a4a30' }, hat: { type: 'pot' }, weapon: { type: 'spear' }, scale: 0.85, legs: '#3a3226' },
  ferryman: { rig: 'human', name: 'The Ferryman', skin: PAL.bone, face: 'skull', body: { type: 'robe', color: '#1c2028' }, hat: { type: 'cowl', color: '#1c2028' }, weapon: { type: 'staff', color: '#2a2018', color2: '#6fa8ff' }, eyes: { color: '#6fa8ff' }, scale: 1.15, hunch: 0.3 },
  grubnose: { rig: 'human', name: 'Grubnose, the Gutter King', skin: '#7a9a46', ears: 'goblin', face: 'goblin', eyes: { glow: true }, body: { type: 'belly', color: '#5a3a24', belt: '#3a2a1c' }, hat: { type: 'crown' }, cape: '#5a1a16', weapon: { type: 'mace', color: '#3a3d45' }, scale: 1.55, wide: 1.25, legs: '#3a2a1e' },
  unbinder: { rig: 'human', name: 'The Unbinder', skin: '#e8ecef', hair: { style: 'long', color: '#d8dce2' }, body: { type: 'coat', color: '#2a2a34', color2: '#c9c9d4' }, weapon: { type: 'scythe', color: '#e6eef8' }, face: 'shadow', eyes: { color: '#e6eef8' }, scale: 1.2 },
  villager: { rig: 'human', name: 'Villager', skin: SKINS[2], hair: { style: 'mop', color: HAIRS[1] }, body: { type: 'tunic', color: '#5a4a3a' }, face: 'sad', legs: '#3a3030' },
  villager2: { rig: 'human', name: 'Villager', skin: SKINS[0], hair: { style: 'bun', color: HAIRS[3] }, hat: { type: 'kerchief', color: '#3a4a6a' }, body: { type: 'dress', color: '#4a3a4a' }, face: 'sad' },
};

/* ---------------- enemies ---------------- */
const GOB = (o) => Object.assign({ rig: 'human', skin: PAL.goblin, ears: 'goblin', face: 'goblin', legs: '#3a3226', scale: 0.86 }, o);
const ENEMIES = {
  inkspawn: { name: 'Inkspawn', cfg: { rig: 'inkspawn' }, hp: 26, dmg: 5, cd: 1.5, speed: 52, range: 34, ai: 'hopper', xp: 4, gold: [1, 3], r: 16, inkborn: true },
  bloat: { name: 'Bloated Inkspawn', cfg: { rig: 'inkspawn', big: true }, hp: 110, dmg: 10, cd: 2.1, speed: 36, range: 50, ai: 'hopper', xp: 14, gold: [4, 7], r: 26, inkborn: true, splits: 'inkspawn' },
  rat: { name: 'Blot Rat', cfg: { rig: 'rat' }, hp: 12, dmg: 3, cd: 0.95, speed: 128, range: 26, ai: 'skitter', xp: 2, gold: [0, 1], r: 11, inkborn: true },
  cutthroat: { name: 'Goblin Cutthroat', cfg: GOB({ body: { type: 'rags', color: '#5b4a32' }, weapon: { type: 'cleaver' } }), hp: 34, dmg: 6, cd: 1.25, speed: 80, range: 44, ai: 'melee', xp: 6, gold: [2, 5], r: 14 },
  gorrak: { name: 'Gorrak', cfg: Object.assign({}, CAST.gorrak), hp: 46, dmg: 7, cd: 1.3, speed: 76, range: 56, ai: 'melee', xp: 9, gold: [6, 9], r: 15, anim: 'thrust' },
  slinger: { name: 'Goblin Slinger', cfg: GOB({ body: { type: 'rags', color: '#4a5a32' }, weapon: { type: 'sling' }, hat: { type: 'bandana', color: '#5a3a24' } }), hp: 24, dmg: 6, cd: 2.2, speed: 66, range: 250, ai: 'ranged', proj: 'rock', xp: 6, gold: [2, 4], r: 13 },
  shaman: { name: 'Goblin Shaman', cfg: GOB({ body: { type: 'robe', color: '#3a4a5a', trim: '#b06ad8' }, weapon: { type: 'staff', color: '#4a3020', color2: '#b06ad8' }, hat: { type: 'shamanskull' } }), hp: 30, dmg: 7, cd: 2.6, speed: 60, range: 260, ai: 'shaman', proj: 'hex', xp: 9, gold: [3, 6], r: 13 },
  brute: { name: 'Goblin Brute', cfg: GOB({ body: { type: 'belly', color: '#4a3424' }, weapon: { type: 'club' }, hat: { type: 'pot' }, scale: 1.3, wide: 1.2 }), hp: 120, dmg: 16, cd: 3.4, speed: 46, range: 70, ai: 'brute', xp: 18, gold: [5, 9], r: 22 },
  bandit: { name: 'Hollow Road Cutthroat', cfg: { rig: 'human', skin: SKINS[2], hair: { style: 'mop', color: HAIRS[0] }, hat: { type: 'bandana', color: '#4a2a2a' }, face: 'masked', body: { type: 'vest', color: '#3e3226' }, weapon: { type: 'knife' }, legs: '#2a2420' }, hp: 40, dmg: 7, cd: 1.1, speed: 84, range: 44, ai: 'melee', xp: 7, gold: [3, 7], r: 14, anim: 'thrust' },
  agatha: { name: 'Red Agatha', cfg: Object.assign({}, CAST.agatha), hp: 150, dmg: 9, cd: 1.0, speed: 96, range: 48, ai: 'duelist', xp: 25, gold: [15, 15], r: 16, anim: 'thrust', boss: true },
  skeleton: { name: 'Skeleton', cfg: { rig: 'human', skin: PAL.bone, face: 'skull', body: { type: 'bones', color: '#3e3a36' }, weapon: { type: 'sword', color: '#8a8f86', color2: '#5a5040' }, eyes: { color: '#9fe6ff' } }, hp: 38, dmg: 7, cd: 1.3, speed: 64, range: 52, ai: 'melee', xp: 7, gold: [1, 3], r: 14, undead: true, reassemble: true },
  ghoul: { name: 'Ghoul', cfg: { rig: 'human', skin: '#8a9a86', face: 'ghoul', body: { type: 'rags', color: '#3e3a34' }, claws: true, hunch: 1, armLen: 1.3, eyes: { color: '#d8ff7a' }, legs: '#3a3632' }, hp: 46, dmg: 8, cd: 1.1, speed: 104, range: 42, ai: 'leaper', xp: 9, gold: [1, 4], r: 14, undead: true },
  wisp: { name: 'Corpse-light', cfg: { rig: 'wisp' }, hp: 30, dmg: 7, cd: 2.4, speed: 70, range: 240, ai: 'ranged', proj: 'cold', xp: 9, gold: [1, 3], r: 13, undead: true, flying: true },
  brannoc: { name: 'Captain Brannoc', cfg: Object.assign({}, CAST.brannoc), hp: 190, dmg: 10, cd: 1.15, speed: 86, range: 58, ai: 'knight', xp: 30, gold: [0, 0], r: 16, boss: true, nonlethal: true },
  sexton: { name: 'The Unburied Sexton', cfg: { rig: 'human', skin: '#9aa592', face: 'ghoul', hair: { style: 'wild', color: '#5a5a52' }, body: { type: 'coat', color: '#2a2a26', color2: '#4a4a40' }, weapon: { type: 'shovel', color: '#5a5f69' }, offhand: { type: 'lantern', color2: '#7bd389' }, eyes: { color: '#7bd389' }, hunch: 0.6, scale: 1.65, wide: 1.2, legs: '#24221e' }, hp: 520, dmg: 12, cd: 1.6, speed: 56, range: 74, ai: 'sexton', xp: 60, gold: [40, 40], r: 24, undead: true, boss: true },
  grubnose: { name: 'Grubnose, the Gutter King', cfg: Object.assign({}, CAST.grubnose), hp: 560, dmg: 11, cd: 1.6, speed: 64, range: 80, ai: 'king', xp: 80, gold: [60, 60], r: 26, boss: true },
  skeleton_ally: { name: 'Risen Skeleton', cfg: { rig: 'human', skin: PAL.bone, face: 'skull', body: { type: 'bones', color: '#1f2a22' }, weapon: { type: 'sword', color: '#a8b0a4' }, offhand: { type: 'shield', color: '#2a3a2e', color2: '#7bd389' }, eyes: { color: '#7bd389' } }, hp: 40, dmg: 6, cd: 1.2, speed: 86, range: 52, ai: 'melee', r: 14, ally: true },
};

/* ---------------- battles ---------------- */
const BATTLES = {
  moor: { scene: 'moor', title: 'The Barrow Moor', tutorial: true, hero: { dx: -60, y: 440 }, waves: [[{ t: 'inkspawn', dx: 150, y: 400 }, { t: 'inkspawn', dx: 230, y: 470 }, { t: 'inkspawn', dx: -260, y: 470 }]], slots: 2 },
  rats: { scene: 'wood', title: 'The Whisperwood', hero: { dx: -40, y: 440 }, waves: [[{ t: 'rat', dx: 200, y: 380 }, { t: 'rat', dx: 260, y: 450 }, { t: 'rat', dx: 230, y: 510 }], [{ t: 'rat', edge: -1, y: 400 }, { t: 'rat', edge: -1, y: 470 }, { t: 'rat', edge: 1, y: 430 }, { t: 'rat', edge: 1, y: 500 }]] },
  tavern: { scene: 'tavern', title: 'The Leaky Inkpot', hero: { dx: -100, y: 450 }, waves: [[{ t: 'bandit', dx: 120, y: 400 }, { t: 'bandit', dx: 160, y: 500 }, { t: 'agatha', dx: 280, y: 450 }]], slots: 2 },
  duel: { scene: 'gate', title: 'A Spar at the Watch Post', hero: { dx: -140, y: 450 }, waves: [[{ t: 'brannoc', dx: 140, y: 450 }]], nonlethal: true },
  churchyard: { scene: 'churchyard', title: 'The Churchyard', hero: { dx: 0, y: 450 }, waves: [[{ t: 'skeleton', dx: 220, y: 400 }, { t: 'skeleton', dx: -240, y: 420 }, { t: 'skeleton', dx: 260, y: 500 }], [{ t: 'ghoul', edge: 1, y: 420 }, { t: 'ghoul', edge: -1, y: 480 }, { t: 'wisp', dx: 0, y: 360 }]] },
  sexton: { scene: 'crypt', title: 'The Unburied Sexton', boss: 'sexton', hero: { dx: -160, y: 460 }, waves: [[{ t: 'sexton', dx: 160, y: 440 }]] },
  bridge: { scene: 'bridge', title: 'The Grumble Bridge', hero: { dx: -150, y: 450 }, waves: [[{ t: 'gorrak', dx: 90, y: 440 }, { t: 'cutthroat', dx: 200, y: 390 }, { t: 'cutthroat', dx: 230, y: 500 }, { t: 'slinger', dx: 330, y: 440 }]], slots: 3 },
  cellar: { scene: 'cellar', title: 'The Mill Cellar', hero: { dx: -150, y: 450 }, waves: [[{ t: 'rat', dx: 120, y: 400 }, { t: 'rat', dx: 160, y: 470 }, { t: 'rat', dx: -260, y: 480 }, { t: 'rat', dx: 200, y: 510 }], [{ t: 'bloat', dx: 220, y: 450 }]] },
  camp: { scene: 'camp', title: 'The Goblin Camp', hero: { dx: -200, y: 450 }, waves: [[{ t: 'cutthroat', dx: 120, y: 400 }, { t: 'cutthroat', dx: 160, y: 500 }, { t: 'cutthroat', dx: 260, y: 450 }, { t: 'slinger', dx: 360, y: 390 }, { t: 'slinger', dx: 380, y: 500 }], [{ t: 'brute', edge: 1, y: 450 }, { t: 'shaman', edge: 1, y: 380 }, { t: 'cutthroat', edge: -1, y: 420 }, { t: 'cutthroat', edge: -1, y: 500 }]], slots: 3 },
  patrol: { scene: 'campback', title: 'Spotted!', hero: { dx: -80, y: 450 }, waves: [[{ t: 'cutthroat', dx: 160, y: 410 }, { t: 'cutthroat', dx: 200, y: 490 }, { t: 'shaman', dx: 320, y: 450 }]] },
  king: { scene: 'tent', title: 'Grubnose, the Gutter King', boss: 'grubnose', hero: { dx: -180, y: 460 }, waves: [[{ t: 'grubnose', dx: 150, y: 440 }]] },
};

/* loot rarity, coloured the 2010 way */
const RARITY = { common: { name: 'Common', color: '#e8e2d4' }, uncommon: { name: 'Uncommon', color: '#3fd35a' }, rare: { name: 'Rare', color: '#4a90ff' }, epic: { name: 'Epic', color: '#b45af2' }, legendary: { name: 'Legendary', color: '#ff8c1a' } };
const ITEM_RARITY = { stormglass_staff: 'rare', sun_hammer: 'epic', fen_crook: 'rare', saltmere_cutlass: 'uncommon', barrow_blade: 'legendary', quillspear: 'rare', wraps_of_ash: 'rare', elm_longbow: 'uncommon', bonereaver: 'epic', stormcrown: 'rare', winged_helm: 'epic', witch_hat: 'rare', oath_plate: 'epic', stormweave_robe: 'rare', saltmere_coat: 'uncommon', quill_blade: 'uncommon', bellbreaker: 'uncommon', inkwell_staff: 'uncommon', hunters_crossbow: 'uncommon', iron_kite: 'uncommon', chainmail: 'uncommon', hunters_coat: 'uncommon', hunters_brim: 'uncommon', gorrak_pot: 'uncommon', raven_knives: 'rare', book_of_hours: 'rare', captains_helm: 'rare', grave_cowl: 'rare', grave_shroud: 'rare', grave_sickle: 'epic', gutter_crown: 'epic', oathblade: 'legendary' };
for (const id in ITEMS) ITEMS[id].rarity = ITEM_RARITY[id] || 'common';
