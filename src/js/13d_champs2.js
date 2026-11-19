/* ==========================================================================
   New champions won in the side stories. They walk their own roads until
   the last page, then come running with everyone else.
   ========================================================================== */
Object.assign(CHAMPS, {
  tatters: { name: 'Mister Tatters', cfg: () => Object.assign({}, CAST.tatters), cls: 'druid', wt: 'staff', dmg: 11, hp: 230, armor: 6, abil: ['thornlash', 'entangle', 'call_of_the_pack', 'wild_hunt'], pass: ['barkskin', 'regrowth'], role: 'tank' },
  columbine: { name: 'Columbine', cfg: () => Object.assign({}, CAST.columbine), cls: 'rogue', wt: 'daggers', dmg: 7, hp: 150, armor: 3, abil: ['backstab', 'knife_fan', 'inkcloud', 'thousand_cuts'], pass: ['keen_edge', 'quickfingers'], role: 'dps' },
  silvermouth: { name: 'Silvermouth, the Eel-Wife', cfg: () => Object.assign({}, CAST.silvermouth), cls: 'witch', wt: 'staff', dmg: 9, hp: 170, armor: 3, abil: ['bog_burst', 'hex_of_toads', 'withering_curse', 'hags_moon'], pass: ['evil_eye', 'covens_malice'], role: 'caster' },
  isadora: { name: 'Captain Isadora Vey', cfg: () => Object.assign({}, CAST.isadora), cls: 'shadowblade', wt: 'sword', dmg: 12, hp: 210, armor: 5, abil: ['blade_dance', 'shadowstep', 'death_mark', 'mirror_of_night'], pass: ['killing_edge', 'nightstalker'], role: 'dps', xp: 40, gold: [0, 0] },
});
for (const id of Object.keys(CHAMPS)) for (const a of CHAMPS[id].abil.concat(CHAMPS[id].pass)) if (!AB[a]) console.warn('champ', id, 'unknown ability', a);
