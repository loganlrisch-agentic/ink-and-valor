/* ==========================================================================
   Chapter II side stories - the far Fenmire and Saltmere's Upper Terraces
   Six new quests, a dozen new faces. Sections 1200-1399 belong to Chapter II.
   ========================================================================== */
Object.assign(CAST, {
  gideon: { rig: 'human', name: 'Gideon Mudd', skin: SKINS[2], hair: { style: 'mop', color: '#3a2a1a' }, beard: { style: 'full', color: '#3a2a1a' }, hat: { type: 'cap', color: '#3a3a24' }, body: { type: 'vest', color: '#4a4030', color2: '#6a5a40' }, weapon: { type: 'shovel', color: '#6a6a60' }, face: 'stern', wide: 1.15 },
  nell: { rig: 'human', name: 'Nell Mudd', skin: SKINS[2], hair: { style: 'braid', color: '#3a2a1a' }, body: { type: 'dress', color: '#5a6a3a', trim: '#c8b890' }, face: 'child', scale: 0.7 },
  corbin: { rig: 'human', name: 'Corbin Reed', skin: SKINS[1], hair: { style: 'mop', color: '#c8a060' }, hat: { type: 'brim', color: '#4a5a4a' }, body: { type: 'vest', color: '#3a4a4a', color2: '#c8c0a8' }, weapon: { type: 'spear', color: '#6a5030' }, face: 'hero' },
  granny_reed: { rig: 'human', name: 'Granny Reed', skin: '#b8c8a0', hair: { style: 'bun', color: '#e8e8e0' }, hat: { type: 'kerchief', color: '#3a5a4a' }, body: { type: 'dress', color: '#3a4a3a', trim: '#a8c890' }, weapon: { type: 'broom' }, face: 'old', hunch: 0.5, scale: 0.86 },
  silvermouth: { rig: 'human', name: 'Silvermouth, the Eel-Wife', skin: '#a8c8c8', hair: { style: 'long', color: '#1a3a3a' }, hat: { type: 'circlet', color: '#c8e8e8', color2: '#5affd8' }, body: { type: 'dress', color: '#1a4a4a', trim: '#8ae8d8' }, weapon: { type: 'staff', color: '#2a4a4a', color2: '#5affd8' }, eyes: { color: '#5affd8', glow: true }, cape: '#0e2a2a' },
  odile: { rig: 'human', name: 'Odile Fane', skin: SKINS[0], hair: { style: 'bun', color: '#e8a040' }, hat: { type: 'kerchief', color: '#2a4a7a' }, body: { type: 'dress', color: '#2a4a7a', trim: '#ffd27a', belt: '#6a4a2a' }, offhand: { type: 'lantern', color2: '#8ad8ff' }, face: 'stern' },
  jory_pike: { rig: 'human', name: '"Gentleman" Jory Pike', skin: SKINS[1], hair: { style: 'pony', color: '#1a1414' }, beard: { style: 'goatee', color: '#1a1414' }, hat: { type: 'tophat', color: '#2a1a2a', color2: '#a83a3a' }, body: { type: 'coat', color: '#3a1a2a', color2: '#d8c890' }, weapon: { type: 'sword', color: '#d8d8e0', color2: '#c9a14a' }, face: 'hero', mouth: 'smirk', scar: true },
  esme: { rig: 'human', name: 'Esmé Lark', skin: SKINS[3], hair: { style: 'wild', color: '#d8d0c8' }, hat: { type: 'brim', color: '#6a4a2a' }, body: { type: 'coat', color: '#4a5a3a', color2: '#d8c8a0' }, weapon: { type: 'staff', color: '#8a6a40' }, face: 'old', mouth: 'smirk' },
  finch: { rig: 'human', name: 'Finch', skin: SKINS[1], hair: { style: 'spiky', color: '#c86a2a' }, hat: { type: 'cap', color: '#6a4a2a' }, body: { type: 'tunic', color: '#6a7a4a', color2: '#4a5a3a' }, face: 'child', scale: 0.82 },
  hulda: { rig: 'human', name: 'Matron Hulda', skin: SKINS[0], hair: { style: 'bun', color: '#b8b0a8' }, hat: { type: 'kerchief', color: '#e8e0d0' }, body: { type: 'dress', color: '#3a4a6a', trim: '#e8e0d0', belt: '#e8e0d0' }, face: 'stern', wide: 1.2 },
  wynn: { rig: 'human', name: 'Wynn', skin: '#d8d4cc', hair: { style: 'mop', color: '#a8a49c' }, body: { type: 'tunic', color: '#9a9890', color2: '#7a7870' }, weapon: { type: 'sword', color: '#a8a49c', color2: '#7a7870' }, face: 'child', scale: 0.76 },
  isadora: { rig: 'human', name: 'Captain Isadora Vey', skin: SKINS[1], hair: { style: 'pony', color: '#7a1a1a' }, hat: { type: 'feathercap', color: '#1a2a4a', color2: '#e8e0d0' }, body: { type: 'coat', color: '#1a2a4a', color2: '#c9a14a' }, weapon: { type: 'sword', color: '#e8eef8', color2: '#c9a14a' }, face: 'hero', mouth: 'smirk', scar: true, cape: '#7a1a1a' },
  benedikt: { rig: 'human', name: 'Old Benedikt', skin: SKINS[2], hair: { style: 'bald', color: '#c8c4bc' }, beard: { style: 'mustache', color: '#e8e4dc' }, body: { type: 'coat', color: '#3a3a3a', color2: '#c8c0a8' }, face: 'old', hunch: 0.3 },
});

Object.assign(ENEMIES, {
  peatling: { name: 'Peatling', cfg: { rig: 'inkspawn', color: '#3a2a1a' }, hp: 34, dmg: 7, cd: 1.4, speed: 60, range: 36, ai: 'hopper', xp: 5, gold: [1, 3], r: 16, inkborn: true },
  bog_brute: { name: 'Turf-Shambler', cfg: { rig: 'human', skin: '#3a4a26', face: 'ghoul', hat: { type: 'horned', color: '#3a3020' }, body: { type: 'bare', color: '#2e3a1e', fur: '#3a4a24' }, weapon: { type: 'club', color: '#3a2a1a' }, claws: true, eyes: { color: '#c8ff5a', glow: true }, scale: 1.45, wide: 1.3, hunch: 0.6 }, hp: 150, dmg: 15, cd: 3.0, speed: 46, range: 72, ai: 'brute', xp: 20, gold: [5, 9], r: 22 },
  drowning_dream: { name: 'The Drowning Dream', cfg: { rig: 'inkspawn', big: true, color: '#1a3a2a', scale: 2.3 }, hp: 640, dmg: 15, cd: 2.6, speed: 44, range: 96, ai: 'brute', xp: 80, gold: [35, 45], r: 42, inkborn: true, boss: true, splits: 'peatling' },
  black_eel: { name: 'Black Eel', cfg: { rig: 'inkspawn', color: '#0e2a2a' }, hp: 36, dmg: 8, cd: 1.2, speed: 96, range: 40, ai: 'leaper', xp: 6, gold: [1, 3], r: 15 },
  eel_guard: { name: 'Eel-Wife’s Guard', cfg: { rig: 'human', skin: '#6a9a9a', face: 'ghoul', hair: { style: 'long', color: '#0e2a2a' }, body: { type: 'rags', color: '#1a3a3a' }, weapon: { type: 'spear', color: '#3a5a5a', color2: '#5affd8' }, eyes: { color: '#5affd8', glow: true }, legs: '#1a3a3a' }, hp: 70, dmg: 9, cd: 1.3, speed: 80, range: 70, ai: 'melee', xp: 10, gold: [2, 5], r: 15 },
  smuggler: { name: 'Pike’s Smuggler', cfg: { rig: 'human', skin: SKINS[2], hair: { style: 'mop', color: HAIRS[1] }, hat: { type: 'bandana', color: '#2a1a2a' }, body: { type: 'vest', color: '#3a2a2a', color2: '#5a3a3a' }, weapon: { type: 'cleaver' }, face: 'masked', legs: '#2a1e1e' }, hp: 56, dmg: 8, cd: 1.1, speed: 88, range: 46, ai: 'melee', xp: 8, gold: [3, 6], r: 14 },
  smuggler_gunner: { name: 'Pike’s Crossbowman', cfg: { rig: 'human', skin: SKINS[1], hair: { style: 'pony', color: HAIRS[0] }, hat: { type: 'brim', color: '#2a2a2a' }, body: { type: 'coat', color: '#2a2a3a', color2: '#4a3a3a' }, weapon: { type: 'crossbow' }, face: 'masked' }, hp: 40, dmg: 9, cd: 2.2, speed: 70, range: 300, ai: 'ranged', proj: 'quarrel', xp: 8, gold: [3, 6], r: 13 },
  jory_pike: { name: '"Gentleman" Jory Pike', cfg: Object.assign({}, CAST.jory_pike), hp: 520, dmg: 12, cd: 0.95, speed: 104, range: 52, ai: 'duelist', xp: 70, gold: [50, 60], r: 17, anim: 'thrust', boss: true },
  salt_crab: { name: 'Salt Crab', cfg: { rig: 'rat', color: '#b84a2a', eyes: { color: '#ffd04a' } }, hp: 30, dmg: 7, cd: 1.0, speed: 104, range: 30, ai: 'skitter', xp: 4, gold: [1, 2], r: 13 },
  pearl_warden: { name: 'The Pearl Warden', cfg: { rig: 'human', skin: '#5a7a8a', face: 'ghoul', hair: { style: 'wild', color: '#1a3a4a' }, hat: { type: 'crown', color: '#d8e8f0' }, body: { type: 'armor', color: '#2a4a5a', color2: '#8ad8e8', trim: '#d8e8f0' }, weapon: { type: 'spear', color: '#4a6a7a', color2: '#d8f8ff' }, eyes: { color: '#d8f8ff', glow: true }, shoulders: { type: 'skull' }, cape: '#0e2a3a', scale: 1.5 }, hp: 680, dmg: 14, cd: 1.6, speed: 66, range: 86, ai: 'brute', xp: 85, gold: [40, 50], r: 24, undead: true, boss: true },
  rag_doll: { name: 'Rag Doll', cfg: { rig: 'human', skin: '#c8b8a0', face: 'masked', hair: { style: 'wild', color: '#8a3a2a' }, body: { type: 'rags', color: '#6a5a7a' }, weapon: { type: 'knife', color: '#a8a8a0' }, eyes: { color: '#ff5a5a', glow: true }, scale: 0.85 }, hp: 34, dmg: 7, cd: 0.9, speed: 112, range: 40, ai: 'skitter', xp: 5, gold: [1, 3], r: 12 },
  rag_man: { name: 'The Rag-and-Bone Man', cfg: { rig: 'human', skin: '#a89880', face: 'skull', hat: { type: 'brim', color: '#2a2420' }, body: { type: 'coat', color: '#3a3028', color2: '#5a4a3a' }, weapon: { type: 'sickle', color: '#8a8a80' }, offhand: { type: 'lantern', color2: '#ffb84a' }, eyes: { color: '#ffb84a', glow: true }, cape: '#2a2420', hunch: 0.8, scale: 1.5, armLen: 1.35 }, hp: 600, dmg: 13, cd: 1.5, speed: 70, range: 70, ai: 'brute', xp: 80, gold: [40, 50], r: 22, boss: true },
});

Object.assign(BATTLES, {
  peat: { scene: 'fen', title: 'Bramble Hollow', tier: 1.9, hero: { dx: -100, y: 450 }, waves: [[{ t: 'peatling', dx: 150, y: 400 }, { t: 'peatling', dx: 190, y: 500 }, { t: 'peatling', dx: -230, y: 460 }, { t: 'bog_brute', dx: 260, y: 450 }], [{ t: 'peatling', edge: 1, y: 400 }, { t: 'peatling', edge: -1, y: 480 }, { t: 'bog_brute', edge: 1, y: 450 }]] },
  dream: { scene: 'fen', title: 'The Drowning Dream', boss: 'drowning_dream', tier: 1.7, hero: { dx: -200, y: 460 }, waves: [[{ t: 'drowning_dream', dx: 170, y: 440 }, { t: 'peatling', dx: 280, y: 380 }, { t: 'peatling', dx: 280, y: 510 }]] },
  eelguard: { scene: 'croakwater', title: 'The Black Pool', tier: 2.0, hero: { dx: -100, y: 450 }, waves: [[{ t: 'black_eel', dx: 150, y: 400 }, { t: 'black_eel', dx: 180, y: 500 }, { t: 'eel_guard', dx: 260, y: 450 }], [{ t: 'black_eel', edge: -1, y: 420 }, { t: 'black_eel', edge: 1, y: 480 }, { t: 'eel_guard', edge: 1, y: 400 }, { t: 'eel_guard', edge: -1, y: 500 }]] },
  smugglers: { scene: 'pit', title: 'Bottled Moonlight', tier: 2.1, hero: { dx: -120, y: 450 }, waves: [[{ t: 'smuggler', dx: 130, y: 400 }, { t: 'smuggler', dx: 160, y: 500 }, { t: 'smuggler_gunner', dx: 320, y: 420 }, { t: 'smuggler_gunner', dx: 330, y: 500 }], [{ t: 'jory_pike', dx: 220, y: 450 }, { t: 'smuggler', edge: 1, y: 400 }, { t: 'smuggler', edge: -1, y: 500 }]] },
  seacave: { scene: 'warrens', title: 'The Sea Caves', tier: 2.1, hero: { dx: -100, y: 450 }, waves: [[{ t: 'salt_crab', dx: 140, y: 400 }, { t: 'salt_crab', dx: 170, y: 500 }, { t: 'salt_crab', dx: -220, y: 460 }, { t: 'drowned_sailor', dx: 260, y: 450 }], [{ t: 'salt_crab', edge: 1, y: 390 }, { t: 'salt_crab', edge: -1, y: 520 }, { t: 'drowned_sailor', edge: 1, y: 450 }, { t: 'drowned_sailor', edge: -1, y: 430 }]] },
  pearl: { scene: 'warrens', title: 'The Pearl Warden', boss: 'pearl_warden', tier: 1.6, hero: { dx: -200, y: 460 }, waves: [[{ t: 'pearl_warden', dx: 170, y: 440 }, { t: 'salt_crab', dx: 260, y: 380 }, { t: 'salt_crab', dx: 260, y: 510 }]] },
  ragman: { scene: 'ghostship', title: 'The Rag-and-Bone Man', boss: 'rag_man', tier: 1.6, hero: { dx: -180, y: 460 }, waves: [[{ t: 'rag_man', dx: 180, y: 440 }, { t: 'rag_doll', dx: 100, y: 380 }, { t: 'rag_doll', dx: 110, y: 510 }], [{ t: 'rag_doll', edge: 1, y: 400 }, { t: 'rag_doll', edge: -1, y: 460 }, { t: 'rag_doll', edge: 1, y: 520 }]] },
  vey: { scene: 'saltmere', title: 'A Duel on the Terrace', boss: 'isadora', nonlethal: true, champHp: 1.6, champDmg: 0.6, tier: 1.0, hero: { dx: -160, y: 450 }, waves: [[{ t: 'isadora', dx: 160, y: 450, champ: true }]] },
});

Object.assign(QUESTS, {
  peat: { title: 'The Sleeping Giant', giver: 'Gideon Mudd', stages: { start: 'The peat-cutters of Bramble Hollow dug down and found a face. Something huge is asleep under the Fenmire, and its nightmares are climbing out.' } },
  eelwife: { title: 'The Eel-Wife’s Wedding', giver: 'Corbin Reed', stages: { start: 'Corbin Reed promised to marry the Eel-Wife of the Black Pool under the next full moon. The moon has stopped at half, and the Eel-Wife is drowning his village in grief.' } },
  smugglers: { title: 'Bottled Moonlight', giver: 'Odile Fane', stages: { start: 'Someone is selling "bottled moonlight" to Saltmere’s lanternmakers. Odile Fane thinks it is something worse.', warehouse: 'The moonlight is wisps from the Fenmire, caught in jars. Jory Pike’s smugglers keep them in a warehouse under the docks.' } },
  mapmaker: { title: 'The Cartographer’s Pearl', giver: 'Esmé Lark', stages: { start: 'Esmé Lark’s maps are drawing themselves wrong. She needs the Compass Pearl from the sea caves under Saltmere.' } },
  orphans: { title: 'The Gull’s Nest', giver: 'Matron Hulda', stages: { start: 'Wynn, a squire from a stopped story, is fading to pencil at the Gull’s Nest orphanage. Find the wooden sword the Rag-and-Bone Man took from him.' } },
  duelist: { title: 'The Duelist of the Terraces', giver: 'Captain Isadora Vey', stages: { start: 'Captain Isadora Vey has never lost a duel, and since the night came, no duel can end. She wants someone to beat her properly.' } },
});

/* everyone you won over here also stands with you at the end (or leaves if you turn) */
HEROES_ALL.push('tatters', 'columbine', 'silvermouth', 'isadora');

/* ---------- hooks: the Fenmire and Saltmere fill up ---------- */
SECTIONS[205].actors = (SECTIONS[205].actors || []).concat([A('gideon', 200, 450, -1, 'idle'), A('corbin', -210, 470, 1, 'idle')]);
SECTIONS[205].choices.splice(SECTIONS[205].choices.length - 1, 0,
  { t: 'Follow the peat-cutters’ shovels to Bramble Hollow', to: 1200, show: { notQuestDone: 'peat' } },
  { t: 'Ask the fisherman why he is pacing the bank in his wedding coat', to: 1210, show: { notQuestDone: 'eelwife' } });
SECTIONS[251].actors = (SECTIONS[251].actors || []).concat([A('odile', 210, 440, -1, 'idle'), A('finch', -220, 500, 1, 'run'), A('benedikt', 260, 500, -1, 'idle')]);
SECTIONS[251].choices.splice(3, 0, { t: 'Climb the rope-stairs to the Upper Terraces', ink: 'gold', to: 1250 });

const TERRACE_QUESTS = ['smugglers', 'mapmaker', 'orphans', 'duelist'];

Object.assign(SECTIONS, {
  /* ---------------- The Sleeping Giant ---------------- */
  1200: {
    title: 'Bramble Hollow', scene: 'fen', actors: [A('hero', -150, 470), A('gideon', 20, 460, -1, 'talk'), A('nell', 100, 490, -1, 'idle'), A('e:peatling', 230, 450, -1)],
    once: { quest: { peat: 'start' } },
    text: [
      `Bramble Hollow is a cluster of turf huts around a peat cutting, a great brown trench in the bog where the cutters slice the ground into bricks and stack them to dry. Nobody is cutting. The shovels are stuck upright in the trench like grave markers.`,
      `"Gideon Mudd," says the foreman, a man as broad and brown as the bog itself. "We dug down past the old peat, past the bog oak, past the black layer where the bones are. And then my shovel hit an eyelid."`,
      `He says it flatly, the way men say things they have said too many times to people who didn't believe them. "Big as a barn door. Shut. Asleep. There's a face down there, Reader, under the whole Fenmire, and it's dreaming. And every night since the dark came, its dreams climb out of the trench."`,
      `His daughter Nell tugs your sleeve. "They're bad dreams," she whispers. "Mud ones. They take people back down with them. They took Mister Rushby. Da won't let me go near the edge." She points. In the bottom of the trench something small and brown and wet is crawling up the cut face, all mouth.`,
      `T: Old bogs remember everything that ever fell into them. If something's been dreaming under here since before the Fenmire had a name, I'd very much like to know what it's dreaming about.`,
    ],
    choices: [
      { t: 'Go down into the cutting', ink: 'crimson', battle: 'peat', win: 1201 },
      { t: 'Leave Bramble Hollow be', to: 205 },
    ],
  },
  1201: {
    title: 'The Face Under the Fen', scene: 'fen', actors: [A('hero', -120, 470), A('tassel', -40, 390)],
    text: [
      `When the last peatling has slumped back into mud, you climb down to the bottom of the cutting, where Gideon's shovel is still standing.`,
      `It's an eyelid. There is no other word. A ridge of brown skin as long as a cart, fringed with lashes like bog roots, closed, and beneath it, through the skin, something moving: the slow sideways roll of a giant eye dreaming.`,
      `You put your hand on the peat beside it, and you feel it breathe. Once every minute. Deep as the tide.`,
      `And then, through your palm, you feel the dream. Water closing overhead. A small hand slipping out of a big one. A story that ended badly, sixty years ago, and the bog that swallowed the ending and has been dreaming it over and over ever since, because a bog never forgets what falls into it, and there's no last page to let it stop.`,
      `T: That's Little Moss, Reader. Gloam's daughter. The bog's been having her nightmare for sixty years. It took the ending, and the shears took the end of the ending, and now it can't wake up and it can't stop dreaming.`,
    ],
    choices: [
      { t: 'Lie down beside the eyelid and sing the dreamer a lullaby with an ending in it (Heart check, 10+)', ink: 'gold', check: { stat: 'heart', target: 10 }, pass: 1202, fail: 1203 },
      { t: 'Climb into the dream and fight the nightmare itself', ink: 'crimson', to: 1203 },
    ],
  },
  1203: {
    title: 'Into the Dream', scene: 'fen', actors: [A('hero', -150, 470, 1, 'idle'), A('e:drowning_dream', 140, 440, -1)],
    text: [
      `The bog opens under you like a mouth, and you fall, slowly, through brown water and drifting roots, down into the dream.`,
      `At the bottom of the dream it is always the same night, sixty years ago: black water, a cold moon, a little hand letting go. And around it, coiling, enormous, a nightmare made of mud and grief, with a hundred mouths, all of them saying "help" in a frog's voice.`,
      `It sees you. It has never seen anything new before. It doesn't like it.`,
    ],
    choices: [{ t: 'Fight the Drowning Dream', ink: 'crimson', battle: 'dream', win: 1204 }],
  },
  1202: {
    title: 'A Lullaby', scene: 'fen', actors: [A('hero', -100, 470, 1, 'kneel'), A('nell', 60, 490, -1, 'idle'), A('gideon', 140, 460, -1, 'idle')],
    once: { questDone: 'peat', xp: 70, gold: 25, item: 'thorn_ring', ink: { gold: 1 } },
    text: [
      `You lie down in the wet peat beside the enormous eyelid, the way you'd lie down beside a child who couldn't sleep, and you sing.`,
      `You don't know any bog songs, so you make one up. It goes like this: the water was cold, and the moon was high, and a little girl fell in. And then, because a song needs an ending, you give it one. The water carried her down to the sea, where the light is green and soft, and she grew up there, and she was happy, and one day she was old, and she went to sleep. The end.`,
      `It isn't true. It doesn't have to be. The great eye under the eyelid rolls, once, and stops rolling. The breathing slows. For the first time in sixty years, the bog dreams something different.`,
      `Nothing climbs out of the trench that night, or the next. Gideon's men pick up their shovels and cut the other way, carefully, around the face, and Nell leaves a jar of marsh flowers at the bottom of the cutting every morning, just in case it's the kind of giant that likes flowers.`,
      `Gideon gives you a ring of black bog-oak, carved with thorns. "Found it on the sleeper's lash," he says. "Reckon it'd want you to have it."`,
      `T: You know, for someone with no musical training whatsoever, that was very nearly beautiful.`,
    ],
    choices: [{ t: 'Back into the Fenmire', to: 205 }],
  },
  1204: {
    title: 'The Dreamer Wakes, a Little', scene: 'fen', actors: [A('hero', -100, 470, 1, 'cheer'), A('nell', 60, 490, -1, 'cheer'), A('gideon', 140, 460, -1, 'cheer')],
    once: { questDone: 'peat', xp: 75, gold: 35, item: 'thorn_ring', ink: { crimson: 1 } },
    text: [
      `The nightmare breaks apart into mud and water and the croak of a thousand frogs, and you come up out of the bog gasping, covered in peat to the eyebrows, with Gideon Mudd hauling you up the cut face by your collar.`,
      `At the bottom of the trench, the giant eyelid twitches. It opens, just a crack. A brown eye the size of a cartwheel looks up at the black sky, at the cutters, at Nell on the edge of the trench, very slowly, the way you'd look at the world after a fever breaks. Then it closes again, and the bog breathes out, long and easy, and is still.`,
      `"It's sleeping proper now," Nell says with total certainty. "Not dreaming. Just sleeping." Nobody argues with her.`,
      `Gideon gives you a ring of black bog-oak, carved with thorns. "Off the sleeper's lash," he says. "It'll keep you."`,
      `T: Well done. Very heroic. You smell like a drain, though. I'd like that noted for the record.`,
    ],
    choices: [{ t: 'Back into the Fenmire', to: 205 }],
  },

  /* ---------------- The Eel-Wife's Wedding ---------------- */
  1210: {
    title: 'A Man in a Wedding Coat', scene: 'fen', actors: [A('hero', -150, 470), A('corbin', 20, 460, -1, 'talk'), A('granny_reed', 110, 480, -1, 'idle')],
    once: { quest: { eelwife: 'start' } },
    text: [
      `A young man in a moth-eaten blue coat with brass buttons is pacing a stretch of black water with a posy of marsh orchids that died a while ago. An old woman sits on an upturned boat, shelling something that might be peas and might be snails, watching him with the patience of someone who has watched a lot of young men be stupid.`,
      `"Corbin Reed," he says. "I'm getting married. Supposed to be. Under the full moon, at the Black Pool, to Silvermouth." He swallows. "The Eel-Wife."`,
      `"He fell in last spring," says the old woman. "Granny Reed. Silly boy. And she caught him. Pretty as a pike, she is, eyes like lamps. She said she'd let him go home if he promised to come back and marry her at the next full moon. He promised." She cracks a shell. "And then the moon stopped at half and never came round again."`,
      `"She thinks I've jilted her," Corbin says miserably. "Every night the water comes up a little higher. Croakwater's half drowned already. She's not angry. Granny says she's grieving. That's worse. Angry, you can say sorry to."`,
      `T: A wedding that needs a full moon, in a book where the moon's frozen at half. Somebody has to fix the moon or fix the bride. I'm not sure which is harder.`,
    ],
    choices: [
      { t: 'Go with Corbin to the Black Pool', ink: 'gold', to: 1211 },
      { t: 'Wish him luck and leave', to: 205 },
    ],
  },
  1211: {
    title: 'The Black Pool', scene: 'croakwater', actors: [A('hero', -150, 470), A('corbin', -60, 460, 1, 'idle'), A('silvermouth', 130, 440, -1, 'cast'), A('e:eel_guard', 220, 480, -1)],
    text: [
      `The Black Pool sits at the edge of Croakwater, round and still as a dropped coin. The stilt-houses nearest it are already standing knee-deep, their lanterns doubled in the flat black water.`,
      `She rises out of the middle of it without a ripple: a tall woman with skin the color of river light and long dark hair that floats on the surface around her like weed, a circlet of pale shell on her brow, eyes like two green lamps. Behind her, lean grey shapes with spears break the surface. Her guards. They have too many teeth.`,
      `"Corbin," she says, and her voice is the sound of water going over a weir. "You came back. I knew you would come back." Her lamp-eyes go up to the half moon. "But it is not full. It will never be full. And a promise made under the moon cannot be kept without it."`,
      `"I'm sorry," says Corbin. "I'd marry you now if I could."`,
      `"I know," says Silvermouth. "That is what makes it unbearable." And the water rises another inch.`,
      `T: Reader, she's not wicked. She's just in love with a boy in a book that's stopped. That's the cruellest thing that man with the shears did. He didn't just stop the bad endings. He stopped the weddings too.`,
    ],
    choices: [
      { t: 'Fetch every wisp-lantern in Croakwater and hang a full moon over the pool', ink: 'gold', to: 1212 },
      { t: 'Tell Silvermouth the moon’s an excuse, and the wedding can go ahead tonight (Grace check, 10+)', ink: 'indigo', check: { stat: 'grace', target: 10 }, pass: 1213, fail: 1214 },
      { t: 'Draw your weapon and drive her guards back from the village', ink: 'crimson', to: 1214 },
    ],
  },
  1214: {
    title: 'The Water Rises', scene: 'croakwater', actors: [A('hero', -150, 470, 1, 'idle'), A('e:eel_guard', 120, 420, -1), A('e:black_eel', 60, 500, -1), A('e:black_eel', 200, 480, -1)],
    text: [
      `Silvermouth's lamp-eyes go dim and cold. "So," she says. "He has brought a champion to break the promise for him."`,
      `"No!" Corbin shouts. "That's not..." But she is already sinking, and the black water is boiling with eels, and her guards come up out of the pool with their spears levelled.`,
    ],
    choices: [{ t: 'Hold the bank', ink: 'crimson', battle: 'eelguard', win: 1215 }],
  },
  1215: {
    title: 'After the Fight', scene: 'croakwater', actors: [A('hero', -150, 470), A('corbin', -40, 460, 1, 'kneel'), A('silvermouth', 130, 440, -1, 'idle')],
    text: [
      `The last guard slips back under the water. The eels go still. Silvermouth rises again, slowly, and looks at Corbin kneeling in the mud, and at you, and her face is not angry. It's only very tired.`,
      `"You could have killed them," she says. "You did not. That is something." She looks up at the half moon. "But it does not fill the moon."`,
      `Corbin gets up. He has mud to the knees and his dead posy is crushed. "Then we'll fill it," he says. "Reader. Help me get the lanterns."`,
    ],
    choices: [{ t: 'Fetch every wisp-lantern in Croakwater', ink: 'gold', to: 1212 }],
  },
  1213: {
    title: 'A Lawyer at a Wedding', scene: 'croakwater', actors: [A('hero', -150, 470, 1, 'point'), A('corbin', -40, 460, 1, 'idle'), A('silvermouth', 130, 440, -1, 'idle')],
    once: { questDone: 'eelwife', xp: 65, gold: 30, ink: { indigo: 1 }, potion: { ghostwater: 1, heal: 1 } },
    text: [
      `"Your promise," you say, "was to marry him under the next full moon. You never said whose moon."`,
      `Silvermouth tilts her head. "There is only one moon."`,
      `"Look down," you say.`,
      `She looks down. In the flat black water of the pool, the reflected moon is just as stuck as the real one. But the reflection of the half moon, broken by her own ripples where she stands, has scattered into a thousand pieces of light, and if you squint, if you want it badly enough, they make a whole, round, shining circle around her.`,
      `There is a long silence. Then Silvermouth starts to laugh, a sound like a stream finding its way out from under a stone. "That," she says, "is a terrible argument. I accept it."`,
      `They are married at the Black Pool that night, with Granny Reed as witness and you as best man, standing inside a moon made of ripples. The water goes down by morning. Corbin has to learn to hold his breath for a very long time, but he says it's worth it.`,
      `T: That was a disgraceful legal trick and I loved every second of it.`,
    ],
    choices: [{ t: 'Back into the Fenmire', to: 205 }],
  },
  1212: {
    title: 'A Moon of Lanterns', scene: 'croakwater', actors: [A('hero', -150, 470, 1, 'cheer'), A('corbin', -40, 460, 1, 'cheer'), A('silvermouth', 80, 440, -1, 'cheer'), A('granny_reed', 180, 480, -1, 'cheer')],
    once: { questDone: 'eelwife', xp: 70, gold: 20, ally: 'silvermouth', item: 'tide_shell', ink: { gold: 1 } },
    text: [
      `It takes all night. Every family in Croakwater lends you its wisp-lantern, the blue flames sulking in their jars, and you and Corbin and a great many croaking children row out into the middle of the Black Pool and string them on fishing line from the tallest stilt-house to the dead heron-tree on the far bank.`,
      `When the last lantern goes up, you all row back to shore and look. It isn't a moon. It's a hundred little blue lights in a ragged circle, swinging in the breeze. But the pool is very black and very still, and in the water, the reflection is round and whole and shining.`,
      `Silvermouth rises in the middle of it and looks up for a long time. "It is the worst moon I have ever seen," she says, and her voice shakes. "It is perfect."`,
      `They're married that night under a moon of lanterns, Granny Reed weeping into her snails, and the water goes down by morning, and every frog in the Fenmire sings until dawn that doesn't come.`,
      `Before you leave, Silvermouth kisses your forehead, and it feels like rain. "When you go to fight the man with the scissors," she says, "go by water if you can. I will hear you. I will come up through the floor."`,
      `T: There's not a dry eye in the bog. Admittedly, there's not a dry anything in the bog.`,
    ],
    choices: [{ t: 'Back into the Fenmire', to: 205 }],
  },

  /* ---------------- Saltmere: The Upper Terraces ---------------- */
  1250: {
    title: 'The Upper Terraces', scene: 'saltmere',
    actors: (st) => { const a = [A('hero', -150, 470), A('tassel', -70, 390), A('benedikt', 220, 470, -1, 'idle')]; if (!(st.run.quests.duelist && st.run.quests.duelist.done)) a.push(A('isadora', 120, 440, -1, 'idle')); if (!(st.run.quests.smugglers && st.run.quests.smugglers.done)) a.push(A('odile', 40, 460, -1, 'idle')); return a; },
    text: (st) => {
      const done = TERRACE_QUESTS.filter((q) => st.run.quests[q] && st.run.quests[q].done).length;
      return [
        `Above the Lantern Market, Saltmere climbs the cliff in wooden steps: the Upper Terraces, where the sea captains built their tall thin houses so they could watch the harbor from their beds. Rope-bridges sag between the balconies. Gulls stand on every chimney, waiting for a tide that never turns.`,
        `Up here the lanterns are fewer, the money is older, and the trouble is better dressed.`,
        done >= TERRACE_QUESTS.length ? `People on the Terraces nod to you now. A captain's widow tries to give you a parrot. You decline the parrot.` : `On the widest terrace, a red-haired woman in a sea captain's coat is fencing with nobody, lunging and parrying at the empty air with a beautiful silver blade, while an old man sits on a crate beside her holding a towel and looking resigned.`,
        done ? `T: ${done} of the Terraces' troubles put right. Saltmere's starting to say your name properly. Last week it was "that one with the ribbon".` : `T: Rich people's problems. Still problems. The man with the shears didn't check anyone's purse before he cut.`,
      ];
    },
    choices: [
      { t: 'Talk to the lanternmaker frowning at a jar of light', to: 1251, show: { notQuestDone: 'smugglers' } },
      { t: 'Climb to the crooked house covered in maps', to: 1260, show: { notQuestDone: 'mapmaker' } },
      { t: 'Knock at the Gull’s Nest orphanage', to: 1270, show: { notQuestDone: 'orphans' } },
      { t: 'Ask the red-haired fencer who she is fighting', to: 1280, show: { notQuestDone: 'duelist' } },
      { t: 'Back down to the Lantern Market', to: 251 },
    ],
  },

  /* ---------------- Bottled Moonlight ---------------- */
  1251: {
    title: 'Odile Fane, Lanternwright', scene: 'saltmere', actors: [A('hero', -150, 470), A('odile', 30, 460, -1, 'talk')],
    once: { quest: { smugglers: 'start' } },
    text: [
      `The lanternmaker is a sharp-faced woman with orange hair wound up in a blue scarf and burns all over her fingers. She is holding a jar up to the light. Inside the jar, a pale blue flame is pressed flat against the glass.`,
      `"Odile Fane," she says. "I've lit Saltmere for thirty years. Whale oil, mostly. Then the sea stopped, the whalers stopped, and the oil ran out. And then a fellow turned up selling these. Bottled moonlight, he called it. Burns forever. Never needs trimming. Half the Terraces bought a jar."`,
      `She taps the glass. The flame inside shrinks away from her finger. "Moonlight doesn't flinch, Reader. And it doesn't cry at night. I've been sitting up with this one. It cries."`,
      `T: That's a wisp. Fen-light. Somebody's catching wisps out of the Fenmire and selling them as lamp fuel. Wisps eat memories, mostly small ones, but they're alive. They're scared.`,
      `"The seller calls himself Gentleman Jory Pike," Odile says. "Keeps a warehouse under the docks. Very well dressed. Very polite. Has a lot of friends with cleavers."`,
    ],
    choices: [
      { t: 'Go and find Jory Pike’s warehouse', ink: 'crimson', to: 1252 },
      { t: 'Not now', to: 1250 },
    ],
  },
  1252: {
    title: 'The Warehouse Under the Docks', scene: 'pit', actors: [A('hero', -150, 470), A('jory_pike', 120, 450, -1, 'talk'), A('e:smuggler', 40, 410, -1), A('e:smuggler_gunner', 220, 500, -1)],
    once: { quest: { smugglers: 'warehouse' } },
    text: [
      `Under the docks the pilings make a forest of black wood, and in the middle of the forest is a warehouse built from a ship's hull turned upside down. Inside, floor to ceiling, are shelves of jars, and in every jar a little blue flame, and the whole place is filled with a sound like very small people weeping in very small voices.`,
      `"Ah. A customer," says a man in a plum-colored coat and a top hat with a red band, coming down a ladder with a jar in each hand. He has a pointed beard, a scar through one eyebrow, and the smile of someone who has never paid full price for anything. "Gentleman Jory Pike, purveyor of fine illuminations. A jar for your bedside? It'll last longer than you will."`,
      `Behind him, men with cleavers and crossbows drift out from between the shelves.`,
      `"They're alive," you say.`,
      `"Everything's alive, friend, if you squint," says Pike cheerfully. "My grandmother's alive. Doesn't stop me selling her furniture. Now. You're either buying or you're leaving, and you're leaving a good deal lighter if you're not buying."`,
      `T: I'll say this for him: he's very well dressed for a monster.`,
    ],
    choices: [
      { t: 'Offer to buy the whole warehouse at a discount and walk out with the jars (Wits check, 11+)', ink: 'indigo', check: { stat: 'wits', target: 11 }, pass: 1254, fail: 1253 },
      { t: 'Smash the shelves and let the wisps go', ink: 'crimson', to: 1253 },
    ],
  },
  1253: {
    title: 'Cleavers and Crossbows', scene: 'pit', actors: [A('hero', -150, 470, 1, 'idle'), A('jory_pike', 140, 450, -1, 'attack'), A('e:smuggler', 40, 410, -1), A('e:smuggler', 60, 500, -1)],
    text: [
      `Gentleman Jory Pike sighs like a man who has been forced to cancel a very nice dinner. He draws a gilt-hilted sword with a little flourish. "Pity," he says. "You had an honest face. I was going to cheat you so gently."`,
    ],
    choices: [{ t: 'Fight Pike and his smugglers', ink: 'crimson', battle: 'smugglers', win: 1255 }],
  },
  1254: {
    title: 'A Very Good Deal', scene: 'pit', actors: [A('hero', -150, 470, 1, 'point'), A('jory_pike', 120, 450, -1, 'cower')],
    once: { questDone: 'smugglers', xp: 70, gold: 10, ink: { indigo: 1 }, flag: 'wispsFreed', potion: { quicksilver: 1 } },
    text: [
      `You make him an offer. A good one. Then you explain, in some detail, how the Duchess's tax collectors feel about untaxed lamp fuel, and how the Hollow Guild feels about men who sell under the docks without paying the Guild, and how the frog-folk of Croakwater feel about men who steal their wisps, and how they are all, as it happens, close personal friends of yours.`,
      `By the end of it Gentleman Jory Pike is sitting on a crate with his hat in his hands, looking very pale. "That's not a deal," he says. "That's a mugging with paperwork."`,
      `"Yes," you agree, and pay him one crown for the lot.`,
      `You and Odile carry the jars up to the top of the Terraces and open them, one after another. The wisps go up like sparks off a fire, hundreds of them, and hang for a moment over Saltmere in a blue cloud, and then stream away north, back toward the Fenmire, singing.`,
      `T: One crown. For a warehouse. I've never been so proud. I've also never been so worried about what you'll do next.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
  1255: {
    title: 'Let Them Go', scene: 'saltmere', actors: [A('hero', -150, 470, 1, 'cheer'), A('odile', 0, 460, 1, 'cheer')],
    text: [
      `Gentleman Jory Pike ends up face-down in a crate of jars, his top hat rolling away across the warehouse floor. His friends with cleavers have discovered somewhere else to be.`,
      `You and Odile carry the jars up to the top of the Terraces. There are hundreds. Odile holds one up and looks at the frightened little flame inside. "Saltmere'll be dark again," she says. "No oil. No moonlight. Nothing to light the streets." She looks at you. "Your choice, Reader. You're the one who fought for them."`,
    ],
    choices: [
      { t: 'Open every jar and let the wisps go home', ink: 'gold', to: 1256 },
      { t: 'Keep half the jars to light Saltmere’s streets, and free the rest', ink: 'indigo', to: 1257 },
    ],
  },
  1256: {
    title: 'A Blue Cloud Over Saltmere', scene: 'saltmere', actors: [A('hero', -100, 470, 1, 'cheer'), A('odile', 40, 460, -1, 'cheer')],
    once: { questDone: 'smugglers', xp: 70, gold: 30, ink: { gold: 1 }, flag: 'wispsFreed', item: 'lantern_moth' },
    text: [
      `You open them all. The wisps go up like sparks off a bonfire and hang over Saltmere for a moment in a great blue cloud, so bright that the whole city comes out onto its balconies to look. Then they stream away north, back toward the Fenmire and the reeds, singing in their small voices.`,
      `"Well," says Odile. "That's the streets dark again." But she's smiling. "I'll think of something. Fish oil. Seaweed. Bad poetry, it burns forever."`,
      `She presses a little moth-shaped brooch into your hand. "Lantern moth. My mother's. Always finds the light."`,
      `T: Somewhere in the Fenmire tonight, a few hundred frogs are going to be very surprised and very happy. Good.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
  1257: {
    title: 'Half the Light', scene: 'saltmere', actors: [A('hero', -100, 470, 1, 'idle'), A('odile', 40, 460, -1, 'idle')],
    once: { questDone: 'smugglers', xp: 70, gold: 60, align: 1, ink: { indigo: 1 } },
    text: [
      `You open half the jars. The freed wisps stream away north in a blue river. The rest you give to Odile, who hangs them in the street-lamps of the Terraces with a face like a woman doing arithmetic she doesn't like the answer to.`,
      `Saltmere's high streets stay lit. Children can walk home. The Duchess sends a note of thanks and a purse of gold.`,
      `At night, if you walk under the lamps on the Upper Terraces, you can hear them. Very faint. Very small.`,
      `T: People need light, Reader. I know. I know. I'm just going to walk on the other side of the street from now on.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },

  /* ---------------- The Cartographer's Pearl ---------------- */
  1260: {
    title: 'The House of Maps', scene: 'shop', actors: [A('hero', -150, 470), A('esme', 30, 450, -1, 'talk'), A('finch', 120, 480, -1, 'idle')],
    once: { quest: { mapmaker: 'start' } },
    text: [
      `The crooked house at the top of the Terraces is papered inside and out with maps: maps of Saltmere, of the Fenmire, of countries you have never heard of, all pinned edge to edge until the walls are a patchwork of coastlines.`,
      `They're moving. Not much. A river wriggles. A coastline shrugs a little further inland. On one map, the town of Quillsby has drifted three inches north and is still going.`,
      `"Esmé Lark," says the old woman at the drafting table, wild white hair, a brim hat full of pencils. "Cartographer to the Tome, or I was. Every map I've ever drawn is drawing itself wrong. The stories are coming loose from their places, you see. Without endings, they don't know where they stop. They're wandering."`,
      `"She needs the Compass Pearl," says the red-haired boy sorting pencils. "Finch. I'm the apprentice. It's a pearl that always knows where things really are. If you pin a map with it, the map stays true."`,
      `"It's in the sea caves under the city," Esmé says. "Where the tide used to come in. I was going to fetch it myself, but my knees are eighty-one and the sea caves are full of crabs, and something worse than crabs guards the Pearl. Something that used to be a king of the sea before the sea forgot him."`,
      `T: A map that won't stay put is a sad thing, Reader. It means the world's forgetting where it is. Let's get her that pearl.`,
    ],
    choices: [
      { t: 'Go down into the sea caves', ink: 'crimson', battle: 'seacave', win: 1261 },
      { t: 'Not now', to: 1250 },
    ],
  },
  1261: {
    title: 'The Drowned Throne', scene: 'warrens', actors: [A('hero', -150, 470), A('e:pearl_warden', 140, 440, -1)],
    text: [
      `Past the crabs, past the drowned sailors who still pull at oars that aren't there, the caves open into a vault of black rock where the sea used to come in. Now the water lies in the bottom like a sheet of glass, and in the middle, on a throne of coral and bones, sits something in a crown of shell.`,
      `It was a king once. A sea-king, from some story where the sea had kings. Now it's a long grey shape in green-bronze armor with a spear in its hand and a light in its eyes like moonlight through deep water. Set into the arm of the throne, glowing faintly, is a pearl the size of a hen's egg.`,
      `"The sea forgot me," it says. Its voice is the boom of a wave in a cave. "When the tide stopped, I was between one wave and the next, and the sea forgot I was its king. But the Pearl remembers where everything is. As long as I hold it, I know where I am." It stands. It is very tall. "I will not be lost."`,
      `T: Oh, that's awful. He's not guarding treasure. He's guarding the only thing that tells him he exists.`,
    ],
    choices: [
      { t: 'Promise to have Esmé draw him a map of his own kingdom, so he’ll always know where he is (Lore check, 10+)', ink: 'gold', check: { stat: 'lore', target: 10 }, pass: 1263, fail: 1262 },
      { t: 'Take the Pearl by force', ink: 'crimson', to: 1262 },
    ],
  },
  1262: {
    title: 'The Warden Rises', scene: 'warrens', actors: [A('hero', -150, 470, 1, 'idle'), A('e:pearl_warden', 140, 440, -1)],
    text: [`The drowned king lifts his spear. The glass-flat water around the throne begins, for the first time in a month, to move.`],
    choices: [{ t: 'Fight the Pearl Warden', ink: 'crimson', battle: 'pearl', win: 1264 }],
  },
  1263: {
    title: 'A Map of the Sea-King', scene: 'shop', actors: [A('hero', -150, 470, 1, 'cheer'), A('esme', 20, 450, -1, 'cheer'), A('finch', 110, 480, -1, 'cheer')],
    once: { questDone: 'mapmaker', xp: 75, gold: 25, item: 'owl_eye', lore: 'margins', ink: { gold: 1 } },
    text: [
      `It takes you three trips up and down the Terraces, carrying messages between a drowned king and an eighty-one-year-old cartographer, but in the end Esmé Lark draws him a map. The Kingdom Beneath Saltmere, it says at the top, in her best hand, and every cave is on it, and every rock, and in the middle, a little crowned figure on a throne: YOU ARE HERE.`,
      `You hang it on the wall of the vault where he can see it. The sea-king looks at it for a very long time. Then he takes the Pearl out of the arm of his throne and puts it in your hand, gently, the way you would hand back something you'd borrowed.`,
      `"I know where I am," he says. "It says so."`,
      `Back in the crooked house, Esmé pins her great map of the Tome with the Compass Pearl, and every map on every wall shivers, and slides, and settles, and stops. Quillsby goes back where it belongs. A river stops wriggling. Finch whoops.`,
      `"You'll want this," Esmé says, and gives you a bronze owl's eye on a chain. "Sees true. Mostly. Don't wear it to parties."`,
      `T: You gave a ghost a map so he wouldn't be lost. I'm going to think about that one for a while.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
  1264: {
    title: 'The Compass Pearl', scene: 'shop', actors: [A('hero', -150, 470, 1, 'cheer'), A('esme', 20, 450, -1, 'cheer'), A('finch', 110, 480, -1, 'cheer')],
    once: { questDone: 'mapmaker', xp: 80, gold: 40, item: 'owl_eye', ink: { crimson: 1 } },
    text: [
      `The drowned king goes down in a crash of green bronze and black water, and the sea, for one moment, remembers itself: a single wave rolls across the cave and breaks against the throne, and when it draws back, the king is gone, and the Pearl is lying in the wet sand, glowing.`,
      `Back in the crooked house, Esmé Lark pins her great map of the Tome with it. Every map on every wall shivers, slides, and settles, and stops. Quillsby drifts back where it belongs. Finch whoops and knocks over a pot of ink.`,
      `"You'll want this," Esmé says, and hangs a bronze owl's eye on a chain around your neck. "Sees true. Mostly."`,
      `T: That wave. Did you see? Just for a second, the sea came back for him. I think it remembered.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },

  /* ---------------- The Gull's Nest ---------------- */
  1270: {
    title: 'The Gull’s Nest', scene: 'inn', actors: [A('hero', -150, 470), A('hulda', 20, 460, -1, 'talk'), A('wynn', 110, 480, -1, 'idle')],
    once: { quest: { orphans: 'start' } },
    text: [
      `The Gull's Nest is a tall, scrubbed house full of children, most of whom are hanging off the banisters. Matron Hulda runs it the way an admiral runs a fleet, which is to say loudly and with great love.`,
      `"Since the night came we've been taking in strays from the stopped stories," she says. "Children whose books froze around them. A little goose-girl. Two of the Seven Swans, we're still looking for the other five. And this one." She puts a big hand on the shoulder of a small boy in a squire's tunic.`,
      `He is fading. Not grey, like poor Tom Brisk back in Quillsby. Faint. The pencil kind. You can see the wallpaper through his elbows.`,
      `"Wynn," the boy says, and bows like a squire. "Squire to Sir Gallant of the Thorn Tower. My story stopped the morning I was to be knighted. I got lost and I came here." He looks at his hands, at the wallpaper showing through. "I had a sword. A wooden one. Sir Gallant carved it for me. It was the only thing I brought out of my story. A man with a sack took it, down by the Net Quarter. He said he collects lost things. I think without it I'm forgetting which story I'm from."`,
      `"The Rag-and-Bone Man," Hulda says, very quietly so the other children won't hear. "Every port's got one. Ours is worse than most. He lives in the wreck of the Merrow, off the end of the old pier."`,
      `T: Things from stopped stories are all that keep these children tied to who they are. Steal the thing and you steal the child, slowly. Let's go and have a word with this rag man.`,
    ],
    choices: [
      { t: 'Row out to the wreck of the Merrow', ink: 'crimson', to: 1271 },
      { t: 'Not now', to: 1250 },
    ],
  },
  1271: {
    title: 'The Wreck of the Merrow', scene: 'ghostship', actors: [A('hero', -150, 470), A('e:rag_man', 140, 440, -1), A('e:rag_doll', 40, 400, -1), A('e:rag_doll', 60, 510, -1)],
    text: [
      `The Merrow lies on her side in the flat grey water, her masts broken, her hold torn open. Inside, it's a magpie's nest: thousands of things heaped to the deck-beams. Odd shoes. Hair ribbons. A crown. Somebody's wedding ring. A dragon's tooth. A glass slipper. Things that fell out of stories when the stories stopped.`,
      `On top of the heap, sorting, sits a tall bent figure in a coat of stitched-together rags and a wide-brimmed hat. His face is a skull. His hands are very long. A lantern hangs from his belt and gives off a sickly orange light.`,
      `"Rag and bone," he croons, without turning round. "Rag and bone. Lost and found. Mostly lost." He holds up a little wooden sword and turns it in the lantern-light. "Pretty thing. Somebody loved this. You can always tell. Love leaves a polish."`,
      `Around the heap, things are getting up. Dolls. Rag dolls with button eyes that glow red, and little knives, dozens of them, things that used to belong to children and now belong to him.`,
      `"Everything that's lost is mine," he says. "That's the law of the rag and bone. And that boy's going to be lost soon, isn't he? I'll have him too. I'll keep him in a jar."`,
      `T: Reader, I've stopped finding things charming. Hit him.`,
    ],
    choices: [{ t: 'Fight the Rag-and-Bone Man', ink: 'crimson', battle: 'ragman', win: 1272 }],
  },
  1272: {
    title: 'Lost and Found', scene: 'ghostship', actors: [A('hero', -120, 470, 1, 'kneel')],
    text: [
      `The Rag-and-Bone Man comes apart into a heap of rags and a hat, and his lantern rolls away into the bilge and goes out. The dolls fall over where they stand, just dolls again, button eyes dark.`,
      `You pick up the wooden sword. It's warm. Somebody really did love it.`,
      `Around you, the hold is still heaped to the beams with lost things. A glass slipper. A crown. A ring with an inscription that says FOREVER, M. Things that belong to people in stories you'll never see.`,
    ],
    choices: [
      { t: 'Take only the sword, and leave the rest for their owners to find', ink: 'gold', to: 1273 },
      { t: 'Take the sword, and fill your pockets with whatever else glitters', ink: 'indigo', to: 1274 },
    ],
  },
  1273: {
    title: 'Sir Wynn', scene: 'inn', actors: [A('hero', -150, 470, 1, 'cheer'), A('wynn', 30, 480, -1, 'cheer'), A('hulda', 120, 460, -1, 'cheer')],
    once: { questDone: 'orphans', xp: 75, gold: 20, item: 'saints_knuckle', ink: { gold: 1 } },
    text: [
      `When you put the wooden sword in Wynn's hands, the color comes back into him all at once, like a lamp being turned up. His elbows are elbows again. His cheeks go pink. He holds the sword up, and his eyes fill.`,
      `"Thorn Tower," he says. "Sir Gallant. The morning of my knighting. I remember." Then, because he is a squire, he sniffs very hard and stands up straight.`,
      `Matron Hulda makes everyone in the Gull's Nest line up in the hallway, all the strays from all the stopped stories, and you knight him. You've never done it before. You use his own wooden sword, one tap on each shoulder, and you make up the words, and every child in the house cheers until the windows rattle.`,
      `"It's not real," Wynn whispers afterwards. "Is it? You're not a king."`,
      `"It's as real as you make it," Hulda tells him firmly. "That's what knights are for."`,
      `She gives you a saint's knucklebone in a silver cage. "It's been in this house forty years. It keeps children safe. You look like you could use keeping."`,
      `T: I'm not crying. I'm a ribbon. This is just... fraying.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
  1274: {
    title: 'Deep Pockets', scene: 'inn', actors: [A('hero', -150, 470, 1, 'idle'), A('wynn', 30, 480, -1, 'cheer'), A('hulda', 120, 460, -1, 'idle')],
    once: { questDone: 'orphans', xp: 75, gold: 80, align: 1, item: 'saints_knuckle', ink: { indigo: 1 } },
    text: [
      `You take the sword. And a crown. And the ring that says FOREVER, M. And a few other things that will fetch good money in the Lantern Market from people who don't ask questions.`,
      `Back at the Gull's Nest, the color floods back into Wynn the moment the sword is in his hands. He cheers. The whole house cheers. Matron Hulda hugs you hard enough to bruise.`,
      `Later, in the market, you sell the ring. The jeweller turns it over and reads the inscription and gets a strange look, as if somewhere far away, in some stopped story, someone has just reached for their finger and found it bare.`,
      `T: Wynn's all right. That's what counts. That's what I'm telling myself, anyway.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },

  /* ---------------- The Duelist of the Terraces ---------------- */
  1280: {
    title: 'Captain Isadora Vey', scene: 'saltmere', actors: [A('hero', -150, 470), A('isadora', 30, 450, -1, 'attack'), A('benedikt', 140, 480, -1, 'idle')],
    once: { quest: { duelist: 'start' } },
    text: [
      `The red-haired woman finishes a long, complicated sequence of lunges against nothing, flicks her silver blade in a salute to the empty air, and turns to look at you. She has a scar through one eyebrow and the kind of grin that gets people into duels.`,
      `"Captain Isadora Vey," she says. "Formerly of the Saltmere Navy. Two hundred and six duels. Never lost. Not once." She sheathes the blade with a snap. "And for the last month I haven't been able to win, either."`,
      `"She means," says the old man on the crate, handing her a towel, "that nobody can be beaten any more. Old Benedikt. Her second. Forty years. Since the night came, a duel just goes on, madam. She disarms them, and they pick their sword up again. She pinks them, and they bleed a bit, and carry on. Nobody yields. Nobody falls. It's not that they won't. They can't. Duels don't end."`,
      `"Do you know how boring that is?" Isadora demands. "I've been fencing a ship's carpenter since Tuesday. He's terrible. He's never going to get better. I'm never going to get to stop." She looks at you sideways. "But you're a Reader. Things end around Readers. I can see it on you. So."`,
      `She draws her blade again. "I want to lose, Reader. Properly. Fairly. To someone good enough to deserve it. Once, so I know I still can. Will you fence me?"`,
      `T: That's the most magnificent thing I've ever heard anyone ask for. Say yes. Say yes, and try very hard not to get stabbed.`,
    ],
    choices: [
      { t: 'Accept her challenge', ink: 'crimson', battle: 'vey', win: 1282 },
      { t: 'Out-talk her: tell her she’s already lost, to the boredom (Grace check, 11+)', ink: 'indigo', check: { stat: 'grace', target: 11 }, pass: 1281, fail: 1283 },
      { t: 'Decline, for now', to: 1250 },
    ],
  },
  1283: {
    title: 'Words Are Not Steel', scene: 'saltmere', actors: [A('hero', -150, 470), A('isadora', 30, 450, -1, 'attack')],
    text: [
      `Isadora listens to your speech with her head on one side, then laughs. "Lovely," she says. "Clever. I don't care. Draw."`,
    ],
    choices: [{ t: 'Fence her', ink: 'crimson', battle: 'vey', win: 1282 }],
  },
  1281: {
    title: 'The Two Hundred and Seventh', scene: 'saltmere', actors: [A('hero', -150, 470, 1, 'point'), A('isadora', 30, 450, -1, 'kneel'), A('benedikt', 140, 480, -1, 'cheer')],
    once: { questDone: 'duelist', xp: 70, gold: 20, item: 'tricorn_of_tides', ally: 'isadora', ink: { indigo: 1 } },
    text: [
      `"You've already lost, Captain," you say. "Not to the carpenter. To Tuesday. To the boredom. You lost the moment you started fencing him and couldn't stop. Two hundred and six wins, and the two hundred and seventh duel's been going a month, and you're losing it. Every hour. You know you are."`,
      `Isadora Vey goes very still. Then, very slowly, she reverses her sword and holds it out to you hilt-first.`,
      `"Benedikt," she says, "write it down. Two hundred and seven duels. Two hundred and six won. One lost." She's grinning so hard it must hurt. "To a philosopher. Damn."`,
      `Old Benedikt writes it in a battered little book with tears running down into his mustache. "Forty years," he says. "Forty years I've waited to write that."`,
      `Isadora takes off her tricorn and puts it on your head. "Loser pays," she says. "And when you go to fight the man who did this to all of us, Reader, send for me. I'd like a duel that ends."`,
      `T: You beat the best swordswoman in Saltmere with a speech. Somewhere a bard is weeping with envy.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
  1282: {
    title: 'A Duel That Ends', scene: 'saltmere', actors: [A('hero', -150, 470, 1, 'cheer'), A('isadora', 30, 450, -1, 'kneel'), A('benedikt', 140, 480, -1, 'cheer')],
    once: { questDone: 'duelist', xp: 80, gold: 30, item: 'tricorn_of_tides', ally: 'isadora', ink: { crimson: 1 } },
    text: [
      `Your blade finds the gap and her silver sword spins out of her hand and clatters across the terrace boards, and this time, for the first time in a month, it stays where it falls.`,
      `Isadora Vey stares at it. Then she drops to one knee, laughing, breathless, and raises both hands. "Yield," she says. "I yield. I YIELD! Benedikt, did you hear me? It worked!"`,
      `"I heard, Captain." The old man is writing in a battered little book with tears running into his mustache. "Two hundred and seven. Two hundred and six won. One lost. Forty years I've waited to write that."`,
      `She gets up, still grinning, and puts her own tricorn on your head. "Loser pays," she says. "That was the best fight I've had in my life, and I've had a lot of fights." Then, quieter: "When you go after the one who did this, the one who made it so nothing can end, send for me. I'll come. I want to see what a real ending looks like."`,
      `T: You beat the best swordswoman in Saltmere and she's thrilled about it. This book gets stranger every page and I love it.`,
    ],
    choices: [{ t: 'Back to the Terraces', to: 1250 }],
  },
});
