/* ==========================================================================
   Data IV - side quests in Quillsby and the Folio
   ========================================================================== */
Object.assign(CAST, {
  ilse: { rig: 'human', name: 'Ilse Penwright', skin: '#d8d0c8', hair: { style: 'bun', color: '#6a6a6a' }, body: { type: 'dress', color: '#8a8a8a', trim: '#c8c8c8' }, face: 'sad', alpha: 0.75 },
  dot: { rig: 'human', name: 'Dot', skin: '#e0dad4', hair: { style: 'braid', color: '#7a7a7a' }, body: { type: 'dress', color: '#a0a0a0', trim: '#e0e0e0' }, face: 'child', scale: 0.6, alpha: 0.6 },
  wendel: { rig: 'human', name: 'Old Wendel', skin: '#bfd8e8', hair: { style: 'wild', color: '#e8eef4' }, beard: { style: 'full', color: '#e8eef4' }, hat: { type: 'cap', color: '#3a4a5a' }, body: { type: 'coat', color: '#3a4a5a', color2: '#9fe6ff' }, offhand: { type: 'lantern', color: '#3a3a40', color2: '#9fe6ff' }, face: 'old', eyes: { color: '#9fe6ff', glow: true }, rimColor: '#9fe6ff' },
  tobin: { rig: 'human', name: 'Tobin', skin: SKINS[1], hair: { style: 'mop', color: HAIRS[2] }, body: { type: 'robe', color: '#3a3a6a', trim: '#e8dcc0' }, face: 'kind', scale: 0.85 },
  mothertype: { rig: 'human', name: 'Mother Type', skin: SKINS[2], hair: { style: 'bun', color: '#e8e8e8' }, body: { type: 'vest', color: '#2a2a2a', color2: '#8a6a3a' }, weapon: { type: 'hammer', color: '#6a6a70' }, face: 'stern', brows: 'bushy', wide: 1.1 },
  mumbler: { rig: 'human', name: 'The Mumbler King', skin: '#8a8a90', hair: { style: 'wild', color: '#3a3a3a' }, hat: { type: 'crown', color: '#6a6a6a' }, body: { type: 'rags', color: '#3a3a40' }, face: 'old', hunch: 0.5, scribble: '#1a1418' },
  agnes: { rig: 'human', name: 'Agnes Thrale', skin: '#e8e0d0', hair: { style: 'bun', color: '#f0f0f0' }, body: { type: 'robe', color: '#d8ccb0', trim: '#c9a14a' }, face: 'old', eyes: { color: '#ffe8b0', glow: true }, rimColor: '#ffe8b0' },
  gardener: { rig: 'human', name: 'Old Folio', skin: SKINS[0], hair: { style: 'bald', color: '#aaa' }, beard: { style: 'long', color: '#d8d8d0' }, body: { type: 'robe', color: '#5a6a3a', trim: '#efe6d2' }, weapon: { type: 'staff', color: '#6a5a3a' }, face: 'old' },
  gilt: { rig: 'human', name: 'Gilt', skin: '#c9a14a', face: 'kind', body: { type: 'robe', color: '#c9a14a', trim: '#7a1f1b' }, scale: 0.55, alpha: 0.9 },
});
Object.assign(ENEMIES, {
  corrector: { name: 'Corrector', cfg: { rig: 'human', skin: '#d8d0c8', hat: { type: 'mitre', color: '#6a1a18', color2: '#0a0606' }, body: { type: 'robe', color: '#5a1a18', trim: '#0a0606', rune: '#ff4a3a' }, weapon: { type: 'staff', top: 'crystal', color: '#1a1414', color2: '#ff4a3a' }, scribble: '#0a0606', eyes: { color: '#ff4a3a', glow: true } }, hp: 60, dmg: 12, cd: 2.2, speed: 60, range: 290, ai: 'shaman', proj: 'hex', xp: 14, gold: [4, 8], r: 15 },
  ink_golem: { name: 'Ink Golem', cfg: { rig: 'inkspawn', big: true, color: '#1a1a3a', scale: 1.35 }, hp: 190, dmg: 16, cd: 2.8, speed: 44, range: 80, ai: 'brute', xp: 22, gold: [6, 12], r: 28, inkborn: true },
});
Object.assign(ITEMS, {
  lamplighters_lantern: { slot: 'offhand', name: 'Lamplighter’s Lantern', def: 1, spell: 2, stats: { spirit: 2 }, vis: { type: 'lantern', color: '#3a3a40', color2: '#9fe6ff' }, desc: 'Old Wendel lit Quillsby with it for fifty years. It still burns, a little blue, for him.' },
  penwright_quill: { slot: 'weapon', name: 'The Penwright Quill', wt: 'staff', dmg: 13, spell: 4, stats: { lore: 2 }, vis: { type: 'staff', top: 'crystal', color: '#e8dcc0', color2: '#3a3040' }, desc: 'A quill the length of a walking stick. Whatever it writes stays written.' },
  red_pen_dagger: { slot: 'weapon', name: 'The Red Pen', wt: 'knives', dmg: 14, stats: { grace: 1, lore: 1 }, vis: { type: 'daggers', color: '#6a1a18', color2: '#ff4a3a' }, desc: 'A correcting pen sharpened into a blade. It still wants to fix things.' },
});
Object.assign(ITEM_RARITY, { lamplighters_lantern: 'rare', penwright_quill: 'epic', red_pen_dagger: 'rare' });
Object.assign(BATTLES, {
  correction: { scene: 'correction', title: 'The Correction Office', tier: 2.9, hero: { dx: -120, y: 450 }, waves: [[{ t: 'errata_soldier', dx: 140, y: 400 }, { t: 'errata_soldier', dx: 170, y: 500 }, { t: 'corrector', dx: 320, y: 450 }], [{ t: 'errata_soldier', edge: 1, y: 420 }, { t: 'corrector', edge: 1, y: 380 }, { t: 'ink_scribe', edge: -1, y: 480 }]], party: 2 },
  inkworks: { scene: 'inkworks', title: 'The Inkworks', tier: 3.1, hero: { dx: -120, y: 450 }, waves: [[{ t: 'ink_golem', dx: 180, y: 450 }, { t: 'inkspawn', dx: 140, y: 390 }, { t: 'inkspawn', dx: 150, y: 510 }, { t: 'inkspawn', dx: -220, y: 450 }], [{ t: 'ink_golem', edge: 1, y: 420 }, { t: 'corrector', dx: 320, y: 480 }]], party: 2 },
  sewer: { scene: 'underfolio', title: 'The Mumbler’s Rats', tier: 2.9, hero: { dx: -60, y: 450 }, waves: [[{ t: 'rat', dx: 140, y: 400 }, { t: 'rat', dx: 160, y: 500 }, { t: 'rat', dx: -200, y: 420 }, { t: 'rat', dx: -220, y: 500 }, { t: 'bookworm', dx: 260, y: 450 }], [{ t: 'margin_hound', edge: 1, y: 430 }, { t: 'bookworm', edge: -1, y: 470 }]], party: 2 },
  vault: { scene: 'vault', title: 'The Chancellor’s Vault', tier: 3.3, hero: { dx: -120, y: 450 }, waves: [[{ t: 'errata_soldier', dx: 140, y: 400 }, { t: 'errata_soldier', dx: 160, y: 500 }, { t: 'ink_golem', dx: 260, y: 450 }, { t: 'corrector', dx: 340, y: 400 }]], party: 2 },
  lamplighter: { scene: 'churchyard', title: 'The Last Lamp', tier: 1.7, hero: { dx: -100, y: 450 }, waves: [[{ t: 'ghoul', dx: 140, y: 410 }, { t: 'ghoul', dx: 170, y: 500 }, { t: 'wisp', dx: 240, y: 380 }]] },
});
