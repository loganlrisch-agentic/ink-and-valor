/* ==========================================================================
   Chapter I side stories - the Back Lanes of Quillsby
   Six new quests, sixteen new faces, and the creatures that came with them.
   Sections 1000-1099 belong to Chapter I (see CHAPTER_RANGES).
   ========================================================================== */
Object.assign(CAST, {
  dunstan: { rig: 'human', name: 'Dunstan the Baker', skin: SKINS[1], hair: { style: 'bald', color: '#8a6a4a' }, beard: { style: 'mustache', color: '#6a4a2a' }, body: { type: 'belly', color: '#e8dcc0', color2: '#c8b898' }, weapon: { type: 'club', color: '#c8a070' }, face: 'kind', wide: 1.25 },
  ida: { rig: 'human', name: 'Ida Clapper', skin: SKINS[0], hair: { style: 'braid', color: '#c87a3a' }, body: { type: 'dress', color: '#4a6a8a', trim: '#e8dcc0' }, offhand: { type: 'lantern', color2: '#ffd27a' }, face: 'child', scale: 0.74 },
  josiah: { rig: 'human', name: 'Josiah Clapper', skin: SKINS[1], hair: { style: 'wild', color: '#d8d4cc' }, beard: { style: 'full', color: '#d8d4cc' }, body: { type: 'tunic', color: '#5a4a3a', color2: '#3a2e24' }, face: 'old', hunch: 0.4 },
  hobb: { rig: 'human', name: 'Farmer Hobb', skin: SKINS[2], hair: { style: 'mop', color: '#6a4a2a' }, hat: { type: 'brim', color: '#8a7040' }, beard: { style: 'stubble', color: '#5a3a1a' }, body: { type: 'vest', color: '#5a6a3a', color2: '#e8dcc0' }, weapon: { type: 'sickle' }, face: 'stern' },
  goody_hobb: { rig: 'human', name: 'Goodwife Hobb', skin: SKINS[2], hair: { style: 'bun', color: '#7a5a3a' }, hat: { type: 'kerchief', color: '#a84a3a' }, body: { type: 'dress', color: '#6a4a3a', trim: '#e8dcc0', belt: '#e8dcc0' }, face: 'kind', wide: 1.1 },
  tatters: { rig: 'human', name: 'Mister Tatters', skin: '#c8a860', face: 'masked', hat: { type: 'brim', color: '#6a5a30' }, body: { type: 'rags', color: '#5a4a3a' }, weapon: { type: 'staff', color: '#6a5030' }, eyes: { color: '#ffb84a', glow: true }, arms: '#c8a860', legs: '#4a3a2a', hunch: 0.25, scale: 1.12 },
  widow_brisk: { rig: 'human', name: 'Widow Brisk', skin: SKINS[1], hair: { style: 'bun', color: '#4a3a3a' }, hat: { type: 'veil', color: '#1a1618' }, body: { type: 'dress', color: '#2a2428', trim: '#4a4048' }, face: 'sad' },
  tom_brisk: { rig: 'human', name: 'Tom Brisk', skin: '#c8c8c8', hair: { style: 'mop', color: '#7a7a7a' }, body: { type: 'tunic', color: '#8a8a8a', color2: '#6a6a6a' }, face: 'child', scale: 0.8 },
  sallow: { rig: 'human', name: 'Mr. Sallow', skin: '#2a2a30', hat: { type: 'tophat', color: '#2e2e34', color2: '#8a8a90' }, body: { type: 'coat', color: '#4a4a52', color2: '#2a2a30' }, weapon: { type: 'cards', color: '#e8e8e0' }, face: 'shadow', eyes: { color: '#f0f0ff', glow: true }, legs: '#2a2a30', scale: 1.28, cape: '#2a2a30' },
  bryony: { rig: 'human', name: 'Bryony Oake', skin: SKINS[0], hair: { style: 'pony', color: '#d8b060' }, hat: { type: 'kerchief', color: '#5a7a4a' }, body: { type: 'dress', color: '#7a8a5a', trim: '#e8dcc0' }, weapon: { type: 'staff', color: '#8a6a40' }, face: 'hero', scale: 0.88 },
  oake: { rig: 'human', name: 'Grandad Oake', skin: SKINS[2], hair: { style: 'bald', color: '#d8d4cc' }, beard: { style: 'long', color: '#e8e4dc' }, hat: { type: 'cap', color: '#5a4a3a' }, body: { type: 'coat', color: '#5a5040', color2: '#e8dcc0' }, weapon: { type: 'staff', color: '#6a5030' }, face: 'old', hunch: 0.5 },
  poppy: { rig: 'human', name: 'Poppy', skin: SKINS[0], hair: { style: 'pony', color: '#a83a2a' }, body: { type: 'dress', color: '#c86a5a', trim: '#e8dcc0' }, face: 'child', scale: 0.66 },
  jem: { rig: 'human', name: 'Jem', skin: SKINS[3], hair: { style: 'spiky', color: '#1a1414' }, body: { type: 'tunic', color: '#4a6a4a', color2: '#3a4a3a' }, face: 'child', scale: 0.7 },
  martha: { rig: 'human', name: 'Martha Gill', skin: '#bcd4dc', hair: { style: 'long', color: '#5a7a84' }, body: { type: 'dress', color: '#8aa8b0', trim: '#d8e8ec' }, face: 'sad', eyes: { color: '#9fe6ff', glow: true }, scale: 0.8 },
  bellamy: { rig: 'human', name: 'Signor Bellamy', skin: SKINS[1], hair: { style: 'long', color: '#2a1a14' }, beard: { style: 'goatee', color: '#2a1a14' }, hat: { type: 'feathercap', color: '#7a1a3a', color2: '#ffd27a' }, body: { type: 'coat', color: '#7a1a3a', color2: '#ffd27a' }, face: 'hero', mouth: 'smirk' },
  columbine: { rig: 'human', name: 'Columbine', skin: '#e8d0b8', hair: { style: 'bun', color: '#1a1418' }, face: 'masked', body: { type: 'dress', color: '#e8e0f0', trim: '#2a1a3a' }, weapon: { type: 'daggers', color: '#d8d8e0' }, eyes: { color: '#ff7ac0', glow: true }, scale: 0.84 },
});

const MOTH = '#9a968c';
Object.assign(ENEMIES, {
  hour_crow: { name: 'Hour-Crow', cfg: { rig: 'bird', color: '#2a1e3a', eyes: { color: '#c08aff' } }, hp: 22, dmg: 5, cd: 1.1, speed: 145, range: 30, ai: 'skitter', xp: 4, gold: [0, 2], r: 11, flying: true, inkborn: true },
  thirteenth_hour: { name: 'The Thirteenth Hour', cfg: { rig: 'bird', color: '#1a1028', scale: 2.6, eyes: { color: '#e0aaff' } }, hp: 420, dmg: 12, cd: 1.7, speed: 92, range: 64, ai: 'brute', xp: 55, gold: [25, 30], r: 30, flying: true, inkborn: true, boss: true },
  chaff_wight: { name: 'Chaff-Wight', cfg: { rig: 'human', skin: '#b89850', face: 'masked', hat: { type: 'brim', color: '#4a3a20' }, body: { type: 'rags', color: '#3a2e24' }, weapon: { type: 'sickle', color: '#8a8f86' }, eyes: { color: '#ff8a2a', glow: true }, arms: '#b89850', legs: '#3a2e24', hunch: 0.6, armLen: 1.2 }, hp: 46, dmg: 8, cd: 1.25, speed: 74, range: 52, ai: 'melee', xp: 7, gold: [1, 3], r: 14 },
  moor_crow: { name: 'Moor-Crow', cfg: { rig: 'bird', color: '#141018', eyes: { color: '#ff4a2a' } }, hp: 16, dmg: 4, cd: 0.95, speed: 155, range: 28, ai: 'skitter', xp: 3, gold: [0, 1], r: 10, flying: true },
  sallow: { name: 'Mr. Sallow, Purchaser', cfg: Object.assign({}, CAST.sallow), hp: 440, dmg: 10, cd: 1.9, speed: 72, range: 270, ai: 'shaman', proj: 'hex', xp: 60, gold: [40, 50], r: 18, boss: true },
  ledger_moth: { name: 'Ledger Moth', cfg: { rig: 'bird', color: MOTH, eyes: { color: '#ffffff' } }, hp: 14, dmg: 4, cd: 1.0, speed: 150, range: 26, ai: 'skitter', xp: 2, gold: [0, 1], r: 10, flying: true },
  inkwool: { name: 'Inkwool Ram', cfg: { rig: 'wolf', color: '#1a1622', eyes: { color: '#ff3a3a' } }, hp: 42, dmg: 7, cd: 1.2, speed: 112, range: 38, ai: 'leaper', xp: 6, gold: [0, 2], r: 15, inkborn: true },
  moor_shepherd: { name: 'The Shepherd Who Counts', cfg: { rig: 'human', skin: '#9ab0b8', face: 'skull', hat: { type: 'hood', color: '#2a3038' }, body: { type: 'robe', color: '#2a3038', trim: '#9fe6ff' }, weapon: { type: 'staff', color: '#4a4038', top: 'skull', color2: '#9fe6ff' }, eyes: { color: '#9fe6ff', glow: true }, cape: '#1a2028', hunch: 0.5, scale: 1.45 }, hp: 360, dmg: 11, cd: 1.6, speed: 62, range: 72, ai: 'brute', xp: 50, gold: [20, 26], r: 22, undead: true, boss: true },
  well_lurker: { name: 'Well Lurker', cfg: { rig: 'human', skin: '#5a7a7a', face: 'ghoul', hair: { style: 'long', color: '#1a2a2a' }, body: { type: 'rags', color: '#1a2626' }, claws: true, hunch: 1, armLen: 1.55, eyes: { color: '#5affd8', glow: true }, legs: '#1a2626' }, hp: 54, dmg: 8, cd: 1.1, speed: 108, range: 46, ai: 'leaper', xp: 9, gold: [1, 4], r: 15, undead: true },
  marionette: { name: 'Marionette', cfg: { rig: 'human', skin: '#d8b890', face: 'masked', hat: { type: 'feathercap', color: '#7a1a3a', color2: '#ffd27a' }, body: { type: 'tunic', color: '#7a1a3a', color2: '#ffd27a' }, weapon: { type: 'sword', color: '#c8a070', color2: '#8a6a40' }, eyes: { color: '#ff7ac0', glow: true }, arms: '#d8b890', legs: '#2a1a24' }, hp: 38, dmg: 7, cd: 1.0, speed: 98, range: 48, ai: 'duelist', xp: 7, gold: [2, 4], r: 14 },
  puppet_dragon: { name: 'The Dragon (Puppet)', cfg: { rig: 'inkspawn', big: true, color: '#9a2a1a', scale: 2.1 }, hp: 380, dmg: 13, cd: 2.4, speed: 48, range: 96, ai: 'brute', xp: 50, gold: [24, 30], r: 38, boss: true },
});

Object.assign(BATTLES, {
  bellcrows: { scene: 'chapel', title: 'The Endless Stair', hero: { dx: -80, y: 450 }, waves: [[{ t: 'hour_crow', dx: 160, y: 390 }, { t: 'hour_crow', dx: 220, y: 470 }, { t: 'hour_crow', dx: -240, y: 430 }, { t: 'hour_crow', dx: 260, y: 520 }], [{ t: 'hour_crow', edge: 1, y: 400 }, { t: 'hour_crow', edge: -1, y: 460 }, { t: 'hour_crow', edge: 1, y: 510 }, { t: 'inkspawn', dx: 180, y: 450 }]] },
  thirteenth: { scene: 'chapel', title: 'The Thirteenth Hour', boss: 'thirteenth_hour', hero: { dx: -180, y: 460 }, waves: [[{ t: 'thirteenth_hour', dx: 170, y: 440 }, { t: 'hour_crow', dx: 260, y: 380 }, { t: 'hour_crow', dx: 280, y: 510 }]] },
  tatters: { scene: 'moor', title: 'The Forgotten Barrow', hero: { dx: -60, y: 450 }, waves: [[{ t: 'chaff_wight', dx: 170, y: 400 }, { t: 'chaff_wight', dx: 230, y: 490 }, { t: 'moor_crow', dx: -220, y: 420 }, { t: 'moor_crow', dx: 260, y: 360 }], [{ t: 'chaff_wight', edge: 1, y: 420 }, { t: 'chaff_wight', edge: -1, y: 480 }, { t: 'moor_crow', edge: 1, y: 380 }, { t: 'moor_crow', edge: -1, y: 520 }]] },
  collector: { scene: 'shop', title: 'Sallow & Sallow, Purchasers', boss: 'sallow', hero: { dx: -180, y: 460 }, waves: [[{ t: 'sallow', dx: 200, y: 440 }, { t: 'ledger_moth', dx: 120, y: 380 }, { t: 'ledger_moth', dx: 140, y: 510 }], [{ t: 'ledger_moth', edge: 1, y: 400 }, { t: 'ledger_moth', edge: -1, y: 460 }, { t: 'ledger_moth', edge: 1, y: 520 }, { t: 'ledger_moth', edge: -1, y: 380 }]] },
  blackwool: { scene: 'crypt', title: 'The Long Barrow', hero: { dx: -120, y: 450 }, waves: [[{ t: 'inkwool', dx: 150, y: 400 }, { t: 'inkwool', dx: 190, y: 500 }, { t: 'inkwool', dx: -230, y: 450 }], [{ t: 'moor_shepherd', dx: 220, y: 450 }, { t: 'inkwool', edge: 1, y: 390 }, { t: 'inkwool', edge: -1, y: 510 }]] },
  wellwater: { scene: 'cellar', title: 'At the Bottom of the Well', hero: { dx: -100, y: 450 }, waves: [[{ t: 'well_lurker', dx: 160, y: 400 }, { t: 'inkspawn', dx: 200, y: 500 }, { t: 'inkspawn', dx: -220, y: 470 }], [{ t: 'well_lurker', edge: 1, y: 430 }, { t: 'well_lurker', edge: -1, y: 480 }, { t: 'bloat', dx: 220, y: 450 }]] },
  puppets: { scene: 'tent', title: 'The Last Act', boss: 'puppet_dragon', hero: { dx: -160, y: 450 }, waves: [[{ t: 'marionette', dx: 120, y: 400 }, { t: 'marionette', dx: 150, y: 500 }, { t: 'marionette', dx: -220, y: 450 }], [{ t: 'puppet_dragon', dx: 220, y: 450 }, { t: 'marionette', edge: 1, y: 400 }]] },
});

Object.assign(QUESTS, {
  belltower: { title: 'Thirteen Bells', giver: 'Ida Clapper', stages: { start: 'The chapel bell rings thirteen every hour. Ida’s father climbed the tower a month ago and never came down.', stair: 'The tower stair loops back on itself. Something is nesting in the bell.' } },
  scarecrow: { title: 'Mister Tatters', giver: 'Farmer Hobb', stages: { start: 'Farmer Hobb’s scarecrow walked off his field and stands at the edge of the moor every night, pointing. Bring him back.', barrow: 'Mister Tatters is guarding a forgotten barrow. Something is eating the names off the stones.' } },
  collector: { title: 'The Man Who Buys Tomorrows', giver: 'Widow Brisk', stages: { start: 'Tom Brisk sold his tomorrows to a grey man named Mr. Sallow, and now Tom is turning grey. Get them back.' } },
  blackwool: { title: 'Black Wool', giver: 'Bryony Oake', stages: { start: 'Bryony’s sheep wandered into the Long Barrow and came out black, dripping ink. Her old dog Bracken never came out at all.' } },
  well: { title: 'The Voice in the Well', giver: 'Poppy and Jem', stages: { start: 'The old well finishes your sentences before you can. Poppy shouted a wish into it and lost her shadow.' } },
  puppets: { title: 'Signor Bellamy’s Marionettes', giver: 'Columbine', stages: { start: 'A puppet show has been playing the same scene since the night came. The puppeteer is missing and the puppets want an ending.' } },
});

/* ---------- hooks: Quillsby gets busier, and grows a back lane ---------- */
SECTIONS[12].actors = (SECTIONS[12].actors || []).concat([A('dunstan', 190, 440, -1, 'idle'), A('poppy', -230, 500, 1, 'cheer'), A('jem', -190, 520, 1, 'run'), A('goody_hobb', 240, 510, -1, 'talk')]);
SECTIONS[12].choices.splice(SECTIONS[12].choices.length - 1, 0, { t: 'Wander into the back lanes, where the lamps are fewer', ink: 'gold', to: 1000 });

const BACKLANE_QUESTS = ['belltower', 'scarecrow', 'collector', 'blackwool', 'well', 'puppets'];

Object.assign(SECTIONS, {
  1000: {
    title: 'The Back Lanes', scene: 'village',
    actors: (st) => { const a = [A('hero', -150, 470), A('tassel', -70, 390)]; if (!(st.run.quests.belltower && st.run.quests.belltower.done)) a.push(A('ida', 70, 470, -1, 'idle')); if (!(st.run.quests.well && st.run.quests.well.done)) { a.push(A('poppy', 160, 500, -1, 'cower')); a.push(A('jem', 200, 450, -1, 'point')); } a.push(A('dunstan', 250, 410, -1, 'idle')); return a; },
    text: (st) => {
      const done = BACKLANE_QUESTS.filter((q) => st.run.quests[q] && st.run.quests[q].done).length;
      return [
        done >= BACKLANE_QUESTS.length ? `The back lanes are quieter now. Somebody has strung bunting between the chimneys. Dunstan the baker waves a loaf at you as you pass, which in Quillsby is a medal.` : `Behind the square, Quillsby folds in on itself: crooked lanes too narrow for a cart, doors painted in colors that have started to grey, washing that has been hanging out to dry for a month and will never dry.`,
        `Everyone who lives back here has a problem, and every problem has the same shape. Something was supposed to finish, and didn't.`,
        `Dunstan the baker leans in his doorway with flour to the elbows. "Every loaf comes out half-baked," he says. "Not burnt. Not raw. Half. The oven won't let them finish." He sighs. "There's worse off than me down these lanes, Reader. Ask around."`,
        done ? `T: ${done} of the back lanes' troubles sorted. Small stories, Reader. But small stories are most of the book.` : `T: Small stories. Nobody writes songs about a baker's half-loaves. But the man with the shears cut these pages too.`,
      ];
    },
    choices: [
      { t: 'Ask the girl with the lantern why she keeps staring at the chapel', to: 1010, show: { notQuestDone: 'belltower' } },
      { t: 'Find out why Farmer Hobb is standing in an empty field', to: 1020, show: { notQuestDone: 'scarecrow' } },
      { t: 'Knock at the house with black crepe on the door', to: 1030, show: { notQuestDone: 'collector' } },
      { t: 'Follow the bleating out to the edge of the moor', to: 1040, show: { notQuestDone: 'blackwool' } },
      { t: 'Ask the two children what they are whispering about', to: 1050, show: { notQuestDone: 'well' } },
      { t: 'Follow the music to the painted wagon behind the stables', to: 1060, show: { notQuestDone: 'puppets' } },
      { t: 'Back to the square', to: 12 },
    ],
  },

  /* ---------------- Thirteen Bells ---------------- */
  1010: {
    title: 'The Bell-Ringer’s Daughter', scene: 'village', actors: [A('hero', -120, 470), A('ida', 40, 470, -1, 'talk'), A('tassel', -40, 390)],
    once: { quest: { belltower: 'start' } },
    text: [
      `Up on the hill, the chapel bell begins to ring. You count without meaning to. Ten. Eleven. Twelve. A pause, as if the bell is embarrassed. Thirteen.`,
      `The girl with the lantern counts too, mouthing the numbers. She is ten, perhaps, with a copper braid and a coat three sizes too big that smells of tallow and rope. "That's Da," she says. "He rings the hours. He's rung them for forty years and he's never once got it wrong."`,
      `"Ida Clapper," she adds, and sticks out a hand like a grown-up. "The night the dark came, Da said, 'Someone's got to keep the hours or folk won't know when to sleep,' and he climbed the tower. That was a month ago. He's still ringing. He just isn't coming down."`,
      `"I've tried the stair. It goes up and up and then you're at the bottom again, and there's birds. Black ones. They eat the clock off your mind. I forgot my own birthday for a whole day."`,
      `T: A tower that keeps you in and a bell that's lost count. Somebody's been nibbling at the hours, Reader.`,
    ],
    choices: [
      { t: 'Take Ida’s lantern and climb the bell tower', ink: 'gold', to: 1011 },
      { t: 'Promise to come back later', to: 1000 },
    ],
  },
  1011: {
    title: 'The Endless Stair', scene: 'chapel', actors: [A('hero', -100, 470), A('e:hour_crow', 120, 400, -1), A('e:hour_crow', 200, 460, -1), A('e:hour_crow', 60, 380, -1)],
    once: { quest: { belltower: 'stair' } },
    text: [
      `The tower stair is a stone screw turning up into the dark. You climb. Your legs ache. You pass a window with a moth on the sill, and a little later you pass the same window, the same moth, which looks at you as if it is also getting tired of this.`,
      `On every step, someone has scratched a number: 1, 2, 3, all the way to 12. The thirteenth step has no number. When you put your foot on it, you are standing on step 1 again, and the door to the chapel is just below you, smug.`,
      `Above, in the throat of the tower, things rustle. Black birds with eyes like spilled violet ink crowd the rafters, dozens of them, and every time the bell swings they snap at the sound as if it were a fly. You feel a whole minute go missing from your head. It is very unpleasant.`,
      `T: Hour-crows. They nest where time stops. That thirteenth step is the hour the story can't reach. They've built a nest in it.`,
    ],
    choices: [
      { t: 'Climb the stair backwards, counting down from twelve (Wits check, 9+)', ink: 'indigo', check: { stat: 'wits', target: 9 }, pass: 1012, fail: 1013 },
      { t: 'Clear the crows off the stair by force', ink: 'crimson', battle: 'bellcrows', win: 1012 },
    ],
  },
  1013: {
    title: 'Lost Count', scene: 'chapel', actors: [A('hero', -60, 470, 1, 'hurt'), A('e:hour_crow', 100, 400, -1), A('e:hour_crow', 160, 480, -1), A('e:hour_crow', -180, 430, 1)],
    text: [
      `Twelve, eleven, ten... and somewhere around six you sneeze, and lose your place, and the stair puts you back at the bottom like a cat dropping a mouse at the door.`,
      `The crows have noticed you now. They come down out of the rafters in a black flurry, beaks open, eating the seconds out of the air around you.`,
    ],
    choices: [{ t: 'Fight your way up through them', ink: 'crimson', battle: 'bellcrows', win: 1012 }],
  },
  1012: {
    title: 'Josiah Clapper', scene: 'chapel', actors: [A('hero', -150, 470), A('josiah', 40, 450, -1, 'cast'), A('e:thirteenth_hour', 190, 400, -1)],
    text: [
      `At the top of the tower is the bell, enormous and green with age, and under the bell is an old man with his arms locked around the rope. Josiah Clapper's beard has grown down to his belt. His eyes are open. He pulls, and the bell swings, and the bell rings, and he pulls again, forever.`,
      `"Ten," he whispers. "Eleven. Twelve." His face creases with worry. "And... and..."`,
      `"Thirteen," says something above the bell, in a voice like a clock being strangled. A crow the size of a cart unfolds itself from the beams. Its feathers are made of torn calendar pages. Its eyes are two clock faces with no hands.`,
      `"I AM THE HOUR THAT DOES NOT COME," it says. "The last hour. The hour when stories finish and old men climb down and go home to supper. The man with the shears gave me to myself. I will not be rung."`,
      `T: There's two ways to shift a bird off a bell, Reader. You can ring it a note it's never heard, or you can wring its neck.`,
    ],
    choices: [
      { t: 'Take the rope and ring Ida’s name into the bell, one stroke for every letter (Heart check, 10+)', ink: 'gold', check: { stat: 'heart', target: 10 }, pass: 1015, fail: 1016 },
      { t: 'Draw your weapon on the Thirteenth Hour', ink: 'crimson', battle: 'thirteenth', win: 1014 },
    ],
  },
  1016: {
    title: 'A Wrong Note', scene: 'chapel', actors: [A('hero', -150, 470, 1, 'hurt'), A('josiah', 40, 450, -1, 'cower'), A('e:thirteenth_hour', 190, 400, -1)],
    text: [
      `You get as far as the D. Then the great crow laughs, a sound like a cuckoo clock falling downstairs, and snaps the next note out of the air before it can sound.`,
      `"Clever," it says. "Not clever enough." It spreads its calendar wings.`,
    ],
    choices: [{ t: 'Fight the Thirteenth Hour', ink: 'crimson', battle: 'thirteenth', win: 1014 }],
  },
  1015: {
    title: 'A New Note', scene: 'chapel', actors: [A('hero', -100, 470, 1, 'cast'), A('josiah', 60, 450, -1, 'kneel')],
    once: { questDone: 'belltower', xp: 45, gold: 15, item: 'cracked_hourglass', ink: { gold: 1 } },
    text: [
      `I. D. A. Three strokes, clumsy and slow, not on the hour at all. The bell makes a noise it has never made before, and the great crow tilts its head, puzzled, because a name is not a time and it does not know how to eat one.`,
      `You keep ringing. C. L. A. P. P. E. R. By the last letter the Thirteenth Hour is coming apart, pages peeling off it and drifting down the tower like leaves, until there's nothing on the beam but a single sheet torn from an almanac. It says: TOMORROW.`,
      `Josiah Clapper lets go of the rope. He looks at his hands as if he's never seen them. "I was ringing the hours," he says. "I'd have rung them forever. Whose name was that?"`,
      `You tell him. He's down the stairs before you, and the stair doesn't loop for him at all. At the bottom, a copper braid crashes into his beard and stays there.`,
      `"She wanted you to have this," Josiah says later, pressing a little cracked hourglass into your hand. "Never kept time right. But it never stops, either. Seemed fitting."`,
      `T: That's the first time I've seen a monster beaten with a spelling lesson. I'm going to tell everyone.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1014: {
    title: 'Twelve Again', scene: 'chapel', actors: [A('hero', -100, 470, 1, 'cheer'), A('josiah', 60, 450, -1, 'kneel'), A('ida', 150, 470, -1, 'cheer')],
    once: { questDone: 'belltower', xp: 40, gold: 20, item: 'cracked_hourglass' },
    text: [
      `The Thirteenth Hour comes down in a blizzard of calendar pages: Tuesdays, Saints' days, a whole March. When the last of it settles, the bell hangs quiet and the rope swings slack in Josiah Clapper's hands.`,
      `The old man sits down hard on the top step. "Twelve," he says, wonderingly. "I counted twelve. I'm sure I counted twelve."`,
      `Ida comes up the stair two steps at a time, and the stair lets her. Neither of them says anything for a long while, which is how you can tell it's important.`,
      `"Here," Josiah says at last, and gives you a little hourglass with a crack down one side. "Never kept time right. Never stops, though. Thought you might need something that doesn't stop."`,
      `T: That bell's going to ring twelve now. And one day, when somebody fixes the book, it'll ring the hour when the story ends. That's the right number of bells, Reader. That's all a clock wants.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },

  /* ---------------- Mister Tatters ---------------- */
  1020: {
    title: 'Hobb’s Field', scene: 'moor', actors: [A('hero', -140, 470), A('hobb', 20, 460, -1, 'talk'), A('goody_hobb', 110, 470, -1, 'idle')],
    once: { quest: { scarecrow: 'start' } },
    text: [
      `Farmer Hobb stands in the middle of his turnip field with his arms out, perfectly still, while crows walk around his boots eating everything.`,
      `"I'm the scarecrow," he says, without moving his mouth much. "Somebody has to be. Mister Tatters walked off a month ago, bold as you like, and he's not come back."`,
      `"Walked," says Goodwife Hobb, coming up with a basket. "Climbed down off his pole like a man getting off a horse, tipped his hat to me, and walked off up the moor. Every night since, he stands at the edge of the barrows, pointing at something. Won't come home. Won't say why. Can't say anything, the dear, his mouth's a bit of stitching."`,
      `"My gran made him," Hobb says. "Out of my granda's old coat, the year he died. Fifty years he's watched this field." He clears his throat. "It's the crows, mostly. Turnips grow upside down in the dark. But it's not just the crows."`,
      `T: Scarecrows only walk in two kinds of story. The funny kind and the other kind. Let's find out which one this is.`,
    ],
    choices: [
      { t: 'Go up the moor and find Mister Tatters', to: 1021 },
      { t: 'Leave the Hobbs to their turnips', to: 1000 },
    ],
  },
  1021: {
    title: 'The Pointing Man', scene: 'moor', actors: [A('hero', -150, 470), A('tatters', 20, 450, 1, 'point'), A('e:chaff_wight', 180, 420, -1), A('e:moor_crow', 230, 370, -1)],
    once: { quest: { scarecrow: 'barrow' } },
    text: [
      `You find him at the edge of the barrows, where the heather gives up and the old graves begin: a tall straw man in a dead man's coat, one arm stretched out straight, pointing at a low mound you would never have noticed.`,
      `His face is a flour sack with a smile stitched on. When you come close he turns his head, slowly, and two small orange lights wake behind the sacking. He does not seem surprised to see you. With his free hand he picks up a stick and writes in the dirt, in big careful capitals:`,
      `THEY FORGOT THE NAMES.`,
      `The mound he is pointing at has a ring of little standing stones, each carved with a name. Most of the names are already gone. On the last stone, black crows with red eyes are pecking out the letters one at a time, and swallowing them. And out of the heather, dragging their sickles, come other scarecrows: the straw men of farms that lost their farmers, with nothing left inside them but chaff and spite.`,
      `T: Those stones are the Hobbs, Reader. Generations of them. When the names go, the family goes. Mister Tatters has been holding the line alone for a month.`,
    ],
    choices: [{ t: 'Stand with Mister Tatters at the barrow', ink: 'crimson', battle: 'tatters', win: 1022 }],
  },
  1022: {
    title: 'The Names', scene: 'moor', actors: [A('hero', -120, 470), A('tatters', 40, 450, -1, 'kneel')],
    text: [
      `The last chaff-wight falls apart into a heap of old straw and a sickle. The crows go up off the stones in a black, complaining sheet and don't come back.`,
      `Mister Tatters kneels by the ring of stones and rubs the moss off them with his sleeve, one by one, until you can read what's left. HOBB. HOBB. HOBB. MARGERY HOBB, WHO MADE THINGS. The last stone has only half a name left: AMOS HO...`,
      `Mister Tatters taps his own coat, then the stone, and you understand. Amos Hobb. The granda whose coat he's wearing. The scarecrow writes in the dirt again: I WAS HIS COAT. NOW I AM HIS LAST GOOD JOB.`,
      `T: He can't fix the names, Reader. But we can. A name's only gone if nobody says it any more.`,
      `You say them, all the ones you can read, out loud, into the wind. When you get to the last stone you say "Amos Hobb," and the half-eaten letters fill back in, one by one, black and sharp as the day they were cut.`,
    ],
    choices: [
      { t: 'Ask Mister Tatters to come home to his field', ink: 'gold', to: 1023 },
      { t: 'Let him stay and stand guard over the Hobb barrow', ink: 'crimson', to: 1024 },
    ],
  },
  1023: {
    title: 'Home to the Field', scene: 'moor', actors: [A('hero', -150, 470, 1, 'cheer'), A('tatters', -20, 450, 1, 'idle'), A('hobb', 90, 460, -1, 'cheer'), A('goody_hobb', 170, 470, -1, 'cheer')],
    once: { questDone: 'scarecrow', xp: 40, gold: 15, gift: 'crows_feather', potion: { heal: 1 }, ally: 'tatters', flag: 'tattersHome' },
    text: [
      `Mister Tatters walks back down the moor beside you with a scarecrow's long, loping stride, and when Farmer Hobb sees him coming he drops his arms for the first time in a month and just stands there with his mouth open.`,
      `Goodwife Hobb sews him a fresh face that night, with a better smile. Hobb tells him about the turnips. The scarecrow listens with his head on one side, and then climbs back up his pole like a man getting onto a horse, and the crows leave the field so fast they forget their manners.`,
      `In the morning there is a black feather on your pillow and a message scratched into the windowsill: WHEN THE LAST PAGE COMES, I WILL STAND IN FRONT OF IT.`,
      `T: Do you know, I believe him. I've never been threatened so politely by a sack.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1024: {
    title: 'The Guard on the Moor', scene: 'moor', actors: [A('hero', -150, 470), A('tatters', 60, 450, 1, 'point')],
    once: { questDone: 'scarecrow', xp: 55, gold: 10, ally: 'tatters', flag: 'tattersGuard', ink: { crimson: 1 } },
    text: [
      `You nod. Mister Tatters straightens up, takes his place at the edge of the Hobb barrow, and points out across the moor at whatever might come for the names next. Then he looks at you, and lowers his arm for a moment, and taps his chest twice, over the place where a heart would be if the man who owned the coat were still in it.`,
      `Farmer Hobb grumbles when you tell him, and then goes quiet, and the next morning he walks up the moor with his best pipe and sits by the stones for an hour, saying names.`,
      `Before you leave, the scarecrow writes one more thing in the dirt: IF THE MAN WITH THE SHEARS COMES FOR YOUR NAME, CALL ME.`,
      `T: I've known knights with less backbone than that. And he hasn't even got a back. He's got a pole.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },

  /* ---------------- The Man Who Buys Tomorrows ---------------- */
  1030: {
    title: 'Black Crepe', scene: 'village', actors: [A('hero', -140, 470), A('widow_brisk', 20, 460, -1, 'talk'), A('tom_brisk', 100, 480, -1, 'idle')],
    once: { quest: { collector: 'start' } },
    text: [
      `Widow Brisk opens the door before you knock, as if she has been waiting behind it for somebody, anybody. She is in mourning black, and so is her house, and behind her, sitting on a stool by a cold hearth, is a boy of twelve the color of a pencil sketch.`,
      `Not pale. Grey. His hair is grey, his freckles are grey, the apple in his hand is a grey shape with a grey bite out of it. He smiles at you and even the smile looks like it was drawn in a hurry.`,
      `"A gentleman came round," the widow says. "Tall. Polite. Grey gloves. He said, 'Tomorrow never comes in Quillsby any more, madam, so what's the harm in selling it?' He paid a silver penny a day. Tom sold him every tomorrow he had. Bought me a ham with it." Her voice cracks. "I didn't ask where the money came from. I was so glad of the ham."`,
      `"It's not bad, being grey," says Tom. "It's quiet. I don't mind about things." He takes another bite of the grey apple. "Mr. Sallow says lots of people have sold. He keeps an office in the old cobbler's by the mill race. He's always open."`,
      `T: A boy with no tomorrows doesn't fade all at once. He just stops minding, one day at a time, until there's nothing left to mind with.`,
    ],
    choices: [
      { t: 'Pay a call on Mr. Sallow', ink: 'crimson', to: 1031 },
      { t: 'Not today', to: 1000 },
    ],
  },
  1031: {
    title: 'Sallow & Sallow, Purchasers', scene: 'shop', actors: [A('hero', -150, 470), A('sallow', 80, 450, -1, 'idle'), A('e:ledger_moth', 160, 380, -1)],
    text: [
      `The old cobbler's shop has a new sign, grey letters on grey board: SALLOW & SALLOW, PURCHASERS. TOMORROWS, MEMORIES, SPARE BIRTHDAYS. FAIR PRICES.`,
      `Inside, every shelf is lined with little jars. Each jar holds a pale, flickering light and a paper label. ANNIE PELLOW, 14 TOMORROWS. MR. GRISWOLD, FIRST KISS (SLIGHTLY USED). TOM BRISK, ALL OF THEM.`,
      `Behind the counter sits a very tall man in a grey coat and a grey top hat. Where his face should be there is only shadow, and two small white lights, polite as candles. A ledger lies open in front of him. Grey moths crawl across its pages.`,
      `"A Reader," says Mr. Sallow warmly. "How rare. How very rare. Do sit down. I expect you've come about the Brisk boy. Everyone always comes about the boy. Nobody ever comes about Mr. Griswold." He steeples long grey fingers. "I'll be frank. I could return young Tom's tomorrows. But the ledger must balance. Something must take their place. Your tomorrows, perhaps? A Reader must have so many."`,
      `T: Don't sign anything. Don't touch the pen. Don't let him call you 'friend', it's in the contract somewhere, I'd bet my tassels on it.`,
    ],
    choices: [
      { t: 'Sign his ledger in Tom’s place', ink: 'indigo', to: 1033 },
      { t: 'Ask to read the terms first (Wits check, 10+)', ink: 'indigo', check: { stat: 'wits', target: 10 }, pass: 1034, fail: 1035 },
      { t: 'Snatch the ledger off the counter', ink: 'crimson', battle: 'collector', win: 1032 },
    ],
  },
  1033: {
    title: 'The Pen That Would Not Write', scene: 'shop', actors: [A('hero', -150, 470, 1, 'cast'), A('sallow', 80, 450, -1, 'hurt')],
    text: [
      `You take the grey pen. You write your name at the bottom of the page. Or you try to: the ink runs off the nib, shies away from the paper, and pools on the counter in a little black puddle that spells out, very faintly, NOT YET.`,
      `Mr. Sallow stares at it. The two white lights in his face flicker. "That's not... a Reader's tomorrows are not... they're not written yet," he whispers. "They're not anyone's to sell. Not even yours."`,
      `T: Ha! Readers don't have tomorrows in this book, you grey vulture. We have choices. Try putting those in a jar.`,
      `The moths come off the ledger in a hissing cloud. Mr. Sallow rises, and keeps rising, and his coat spreads out behind him like a storm. "Then I'll take what you have now," he says, not warmly at all.`,
    ],
    choices: [{ t: 'Fight Mr. Sallow', ink: 'crimson', battle: 'collector', win: 1032 }],
  },
  1035: {
    title: 'Very Small Print', scene: 'shop', actors: [A('hero', -150, 470, 1, 'hurt'), A('sallow', 80, 450, -1, 'cast')],
    text: [
      `The terms run on for pages, in a hand that gets smaller and smaller as you read until the letters are crawling like ants, and then they are ants, and then they are moths, and they come up off the paper into your face.`,
      `"Reading the contract counts as signing it in some jurisdictions," Mr. Sallow says pleasantly, standing. "Not this one, sadly. But I'm sure we can come to some arrangement."`,
    ],
    choices: [{ t: 'Fight Mr. Sallow', ink: 'crimson', battle: 'collector', win: 1032 }],
  },
  1034: {
    title: 'The Clause', scene: 'shop', actors: [A('hero', -150, 470, 1, 'point'), A('sallow', 80, 450, -1, 'cower')],
    once: { questDone: 'collector', xp: 60, gold: 25, ink: { indigo: 1 }, item: 'goblin_coin' },
    text: [
      `The terms run on for pages in a shrinking hand, but you have read worse, and you keep going, and on page nineteen, down near the bottom, you find it.`,
      `"Clause forty-one," you read aloud. "'The Purchaser undertakes to collect each tomorrow upon its arrival.'" You look up. "Mr. Sallow. When does tomorrow arrive in Quillsby?"`,
      `There is a long silence. The two white lights in Mr. Sallow's face go very small.`,
      `"It doesn't," you say. "It can't. You bought something that never gets delivered. Every one of these contracts is void."`,
      `The jars on the shelves begin to rattle. One by one the corks pop out, and the pale lights stream out of the door and away up the lane like sparks from a bonfire. Mr. Sallow makes a noise like a ledger being slammed, and folds up, and up, until he is only a grey moth on the counter, which flutters out through the keyhole and does not come back.`,
      `When you get back to the Brisk house, Tom is sitting by the hearth eating an apple, and the apple is red, and Tom is crying because he minds about things again, and his mother is crying because he minds.`,
      `T: Contract law. The most terrifying magic there is. I'm proud of you and slightly frightened.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1032: {
    title: 'The Ledger', scene: 'shop', actors: [A('hero', -150, 470), A('tom_brisk', 60, 480, -1, 'idle')],
    text: [
      `Mr. Sallow comes apart the way wet paper does: slowly, and then all at once, into a drift of grey moths that beat themselves against the windows and then are gone.`,
      `The ledger lies open on the counter. Every name in Quillsby is in it somewhere. You could burn it, and every jar on the shelves would empty, and every tomorrow would go home.`,
      `But you could also tear out one page first. Nobody would know. A page of tomorrows is worth a lot to the right buyer, and there are always buyers.`,
      `T: I'm not going to tell you what to do. I'm going to stand here and look at you very hard, though.`,
    ],
    choices: [
      { t: 'Burn the whole ledger', ink: 'gold', to: 1036 },
      { t: 'Tear out a page for yourself, then burn the rest', ink: 'indigo', to: 1037 },
    ],
  },
  1036: {
    title: 'Every Tomorrow Goes Home', scene: 'village', actors: [A('hero', -100, 470, 1, 'cheer'), A('tom_brisk', 40, 480, -1, 'cheer'), A('widow_brisk', 120, 460, -1, 'cheer')],
    once: { questDone: 'collector', xp: 50, gold: 20, ink: { gold: 1 }, potion: { heal: 1, clarity: 1 } },
    text: [
      `The ledger burns grey, then gold. Every jar on every shelf pops its cork, and the lights pour out of the cobbler's door and stream away up the lanes like sparks off a bonfire, each one hunting for its own front door.`,
      `At the Brisk house, Tom is sitting by the hearth with an apple, and the apple is red. So are his freckles. So are his eyes, because he's crying, because he minds about things again. Widow Brisk takes the black crepe off the door with her own hands.`,
      `Up and down the back lanes, people are opening their windows and looking up at the sky with puzzled faces, as if they have just remembered they were supposed to be doing something tomorrow.`,
      `T: They'll get there. Tomorrow's still stuck. But at least they've all got one to wait for again.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1037: {
    title: 'A Page in Your Pocket', scene: 'village', actors: [A('hero', -100, 470, 1, 'idle'), A('tom_brisk', 40, 480, -1, 'cheer')],
    once: { questDone: 'collector', xp: 50, gold: 70, align: 1, ink: { indigo: 1 } },
    text: [
      `You fold the page small and slip it inside your coat, and then you burn the rest. The jars empty. The lights go home. Tom Brisk gets his color back and his tomorrows with it, and the widow kisses both your cheeks.`,
      `You don't look at whose names are on your page. You sell it that night to a woman in a grey hood who appears at the tavern door exactly when you think about selling it, and she pays in good gold crowns and doesn't haggle.`,
      `Somewhere in Quillsby, eleven people will wake up one morning, when mornings come back, feeling like they've forgotten something important.`,
      `T: ...`,
      `T: I'm not saying anything. I'm a ribbon. Ribbons don't judge. I'm just going to be very quiet for a while.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },

  /* ---------------- Black Wool ---------------- */
  1040: {
    title: 'Bryony’s Flock', scene: 'moor', actors: [A('hero', -150, 470), A('bryony', 20, 460, -1, 'talk'), A('oake', 110, 470, -1, 'idle'), A('e:inkwool', 230, 430, -1)],
    once: { quest: { blackwool: 'start' } },
    text: [
      `On the high moor a girl with a crook and a straw-colored ponytail is trying to herd sheep that do not want to be herded. They are black. Not black-faced, like moor sheep: black all over, wet-black, and when they shake themselves they spatter the heather with ink. Their eyes are red. One of them bares its teeth at you. Sheep do not, as a rule, have those kinds of teeth.`,
      `"They were white yesterday," says the girl. "Well. A month of yesterdays. Bryony Oake. That's Grandad. Don't let the rams near your ankles."`,
      `"They got into the Long Barrow," says the old man, leaning on his staff. "Fog came down, I lost count, and when it lifted they were trotting out of the barrow door, every one of them, dripping like that. All but Bracken."`,
      `"Bracken's our dog," Bryony says, and her chin goes stubborn the way chins do when they are trying not to wobble. "He went in after them. He's old. He's slow. He's been in there a month. I keep thinking I can hear him barking."`,
      `T: Something in that barrow is counting sheep, Reader. And whatever it is, it's not trying to get to sleep.`,
    ],
    choices: [
      { t: 'Go into the Long Barrow after Bracken', ink: 'crimson', to: 1041 },
      { t: 'Leave the moor for now', to: 1000 },
    ],
  },
  1041: {
    title: 'The Long Barrow', scene: 'crypt', actors: [A('hero', -150, 470), A('e:moor_shepherd', 120, 440, -1), A('e:inkwool', 40, 400, -1), A('e:inkwool', 200, 500, -1)],
    text: [
      `The Long Barrow is a stone throat running down into the hill. Your light catches on scratch marks on every wall: little upright lines in groups of five, thousands upon thousands of them, someone counting something for longer than anyone should count anything.`,
      `At the bottom, in a round chamber, a tall figure in a shepherd's hood sits on a stone, tapping a crook on the floor. Tap. "Eight thousand and one." Tap. "Eight thousand and two." Ink-black sheep file past him in a circle, round and round, and every time one passes he counts it again.`,
      `His face, under the hood, is bone. His eyes are two pale blue flames. "You'll be the new one," he says, without stopping counting. "Everyone who comes down here gets counted. The dog. The sheep. You. I can't stop until I get to the end, see, and there's no end. There used to be. Then a pale fellow came by with a pair of scissors and now I just keep going."`,
      `Behind him, in the shadow at the back of the chamber, something old and grey lifts its head and gives one tired, furious bark.`,
      `T: That's Bracken. And that's a shepherd who died on the moor and never got buried. He's been counting the flock home for a hundred years.`,
    ],
    choices: [{ t: 'Break his circle and get to the dog', ink: 'crimson', battle: 'blackwool', win: 1042 }],
  },
  1042: {
    title: 'Bracken', scene: 'crypt', actors: [A('hero', -120, 470, 1, 'kneel'), A('bryony', 60, 470, -1, 'cheer')],
    text: [
      `The shepherd's crook clatters on the stone. The blue flames in his eyes gutter, and for a moment, before they go out, he looks almost relieved. "Eight thousand and three," he says. "That's... that's the lot, I think. That's all of them."`,
      `Behind him, lying across a little cleft in the rock, is an old grey sheepdog, half starved and so stiff he can barely stand. Curled against his belly is a single lamb, the only white one in the barrow. Bracken has been lying across the gap for a month, keeping it out of the circle.`,
      `You carry him up into the air. Bryony meets you at the barrow door and doesn't say anything at all, just buries her face in his ruff, and the old dog thumps his tail on your arm, once, twice, as hard as he can.`,
      `The black flock stands about in the heather, looking confused. One by one, as the wind gets into their fleeces, the ink blows out of them in long dark streamers, and underneath they are white.`,
      `Grandad Oake looks at the barrow for a long time. "There's no name on that stone," he says. "Never was. Fellow died up here in a snowstorm before my granda's time and nobody ever found him to bury him."`,
    ],
    choices: [
      { t: 'Help Grandad Oake give the shepherd a proper burial', ink: 'gold', to: 1043 },
      { t: 'Seal the barrow door and let the dead keep their own counting', ink: 'indigo', to: 1044 },
    ],
  },
  1043: {
    title: 'The Last Sheep Home', scene: 'moor', actors: [A('hero', -120, 470, 1, 'idle'), A('oake', 0, 460, 1, 'kneel'), A('bryony', 90, 470, -1, 'idle')],
    once: { questDone: 'blackwool', xp: 45, gold: 15, item: 'pilgrims_mantle', ink: { gold: 1 } },
    text: [
      `You bring the shepherd's bones up out of the dark and lay them under a cairn on the high moor, where he can see the whole flock. Grandad Oake says the words. He doesn't know the man's name, so he calls him what the moor calls him: The Shepherd.`,
      `"Every sheep's home," Bryony tells the cairn. "I counted. All of them. You can stop now."`,
      `On the way down, Bracken walks at her heel, slowly, and every so often stops to look back up the hill.`,
      `Grandad Oake gives you an old shepherd's mantle, oiled against the weather, the one he wore when he was young. "Folk in Quillsby'll tell you it's a small thing, burying a stranger," he says. "Folk in Quillsby are wrong about plenty."`,
      `T: Do you know what I like about you, Reader? You stop for the small ones.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1044: {
    title: 'The Sealed Door', scene: 'moor', actors: [A('hero', -120, 470, 1, 'idle'), A('bryony', 40, 470, -1, 'idle'), A('oake', 120, 460, -1, 'idle')],
    once: { questDone: 'blackwool', xp: 50, gold: 30, key: 'shepherds_crook', ink: { indigo: 1 } },
    text: [
      `You roll a stone across the barrow mouth and wedge it. Whatever's left down there can count in the dark for as long as it likes. It isn't your business, and it isn't your sheep.`,
      `Grandad Oake nods slowly, as if that's what he would have done too, at Bryony's age. Bryony doesn't say anything. She's got her dog. That's enough for today.`,
      `Before you go, you pocket the shepherd's crook-head, a little bone hook worn smooth by a hundred years of tapping. It hums faintly when you hold it, like it's still counting.`,
      `T: Fair enough. Not every ghost wants a funeral. Some of them just want the door shut.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },

  /* ---------------- The Voice in the Well ---------------- */
  1050: {
    title: 'The Wishing Well', scene: 'village', actors: [A('hero', -140, 470), A('poppy', 10, 490, -1, 'cower'), A('jem', 80, 470, -1, 'talk')],
    once: { quest: { well: 'start' } },
    text: [
      `Two children are crouched behind a water butt at the end of the lane, watching an old stone well with a broken winch the way you would watch a sleeping dog.`,
      `"Don't shout down it," the boy says at once. "Jem. That's Poppy. She shouted down it. It's a dare, everyone does it, you shout the start of a wish and you run. Only now when you shout the start, it shouts the end back. Before you've even thought of it."`,
      `"I shouted 'I wish,'" Poppy says, very small. "And it shouted, 'I'd never been born.'" She looks down at the cobbles. Everything in the lane has a shadow: the butt, the well, Jem, you. Poppy doesn't. "I didn't mean it. I didn't even think it. It just... knew where the sentence was going."`,
      `Jem leans in. "My nan says there was a girl drowned down there, a hundred years back. Martha something. Nan says she's been at the bottom ever since, waiting for someone to finish her story."`,
      `T: A well that knows how every sentence ends, in a book where nothing does. Now that is interesting. Sad. But interesting.`,
    ],
    choices: [
      { t: 'Climb down the well', ink: 'crimson', to: 1051 },
      { t: 'Tell them you’ll come back', to: 1000 },
    ],
  },
  1051: {
    title: 'Down the Well', scene: 'cellar', actors: [A('hero', -150, 470), A('martha', 60, 450, -1, 'idle'), A('e:well_lurker', 190, 430, -1)],
    text: [
      `The rungs go down a long way. At the bottom there's no water, only a round stone room lined with damp, and in the middle of the room, sitting on a bucket, is a girl made of pale blue light.`,
      `All around her, pinned to the walls like butterflies, are shadows. A dozen of them. Children's shadows, mostly. One of them is wearing a ponytail.`,
      `"Hello," she says. "You're going to say 'Are you Martha Gill?'" You open your mouth to say it and she says, "Yes. I am. Sorry. I can't help it. I only know the ends of things now."`,
      `She hugs her knees. "I fell in a hundred years ago. That was my ending, it was a sad one, but it was mine. A kind man with white hair used to come down every year and read it to me, so I wouldn't be alone when I finished. Then one year he came with a big pair of scissors and said, 'You'll never have to finish now, Martha. I'm so sorry I didn't think of it sooner.' And he went away and never came back."`,
      `"I don't want to finish alone," she says. "So I've been collecting a crowd. People shouldn't end alone. That's what he always said." Behind her, in the dark, long grey arms unfold from the walls. Things that live in wells. Things that have been waiting for her to finish so they can have the bucket.`,
      `T: Reader. The man with white hair. That was him. That was Edmund.`,
    ],
    choices: [
      { t: 'Promise Martha that she won’t end alone (Heart check, 9+)', ink: 'gold', check: { stat: 'heart', target: 9 }, pass: 1052, fail: 1053 },
      { t: 'Fight off the things in the walls', ink: 'crimson', battle: 'wellwater', win: 1054 },
    ],
  },
  1053: {
    title: 'The Wrong End of the Sentence', scene: 'cellar', actors: [A('hero', -150, 470, 1, 'hurt'), A('martha', 60, 450, -1, 'cower'), A('e:well_lurker', 160, 400, -1), A('e:well_lurker', -200, 480, 1)],
    text: [
      `"I'll stay with—" you start, and Martha says, "—you until something better comes along," and you didn't mean that at all, but it's out in the air now, the end of the sentence, and she flinches like you hit her.`,
      `The grey things come off the walls.`,
    ],
    choices: [{ t: 'Fight them off', ink: 'crimson', battle: 'wellwater', win: 1054 }],
  },
  1054: {
    title: 'Martha Gill', scene: 'cellar', actors: [A('hero', -120, 470), A('martha', 60, 450, -1, 'idle')],
    text: [
      `The last of the well-things slithers back into the cracks it came from. Martha Gill hasn't moved from her bucket. She looks at you as if she is trying very hard not to know how this ends.`,
      `"You're going to say I have to give the shadows back," she says. "And I'm going to say yes, because I always knew I would."`,
      `She unpins them one by one, and they go up the well like smoke up a chimney. Poppy's goes last. Then she sits back down and folds her hands.`,
    ],
    choices: [
      { t: 'Sit with her and tell her you’ll make sure her story gets its ending', ink: 'gold', to: 1052 },
      { t: 'Climb back up and leave her in peace', to: 1055 },
    ],
  },
  1052: {
    title: 'Not Alone', scene: 'cellar', actors: [A('hero', -100, 470, 1, 'kneel'), A('martha', 60, 450, -1, 'cheer')],
    once: { questDone: 'well', xp: 50, gold: 10, item: 'ink_pearl', lore: 'edmund', ink: { gold: 1 } },
    text: [
      `You sit down on the cold floor next to her and tell her the truth. That you're going after the man with the scissors. That when you find him, you're going to make him give the endings back, hers too. And that when her ending comes, you'll come back down this well and sit with her while it happens.`,
      `Martha Gill looks at you for a long time, and for once she doesn't say how the sentence finishes. She waits to hear it.`,
      `"Nobody ever said that bit," she says at last. "He always read me the end. He never said he'd come." She stands up and starts unpinning the shadows from the walls, one by one, and they rise up the well like smoke. "I believe you. That's the funny thing. I always know how things end, and I don't know this one, and I believe you anyway."`,
      `At the top of the well, Poppy is standing in the lamplight, staring at her own shadow as if it's a new puppy. Before you leave, Martha's voice floats up the shaft, small and bright: "Reader? When you find him... tell him I'm not cross."`,
      `In your pocket, where there was nothing, there is a black pearl, cold as well water.`,
      `T: He used to come every year. Ten thousand last pages, Reader, and he went back for a girl at the bottom of a well. I don't know what to do with that.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1055: {
    title: 'A Quiet Well', scene: 'village', actors: [A('hero', -100, 470), A('poppy', 40, 490, -1, 'cheer'), A('jem', 110, 470, -1, 'cheer')],
    once: { questDone: 'well', xp: 40, gold: 15, potion: { ghostwater: 1 } },
    text: [
      `You climb back up into the lamplight. Poppy is standing by the well, turning in circles, watching her shadow turn with her. Jem is pretending not to be impressed and failing.`,
      `Nobody shouts down the well after that. Sometimes, late, if you lean over the edge, you can hear someone humming at the bottom, the same four notes over and over, the start of a song that never gets to its end.`,
      `T: Some ghosts you help. Some you just stop from hurting anyone. Both count.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },

  /* ---------------- Signor Bellamy's Marionettes ---------------- */
  1060: {
    title: 'The Painted Wagon', scene: 'village', actors: [A('hero', -150, 470), A('columbine', 60, 440, -1, 'talk'), A('e:marionette', 160, 470, -1), A('dunstan', 250, 460, -1, 'idle')],
    once: { quest: { puppets: 'start' } },
    text: [
      `Behind the stables stands a wagon painted with gold stars and fat red curtains, and on its little stage, puppets are performing The Tragedy of Prince Valentine and the Dragon of Wyvernmouth to an audience of thirty villagers who have not blinked in a month.`,
      `You watch for a while. The prince declares his love. The dragon roars. The prince draws his wooden sword, raises it high... and the curtain jerks shut, and opens again, and the prince is declaring his love. The audience gasps in exactly the same places. Dunstan the baker is in the second row, mouthing along.`,
      `A small puppet in a white dress and a black half-mask drops down from the proscenium on her strings, though nobody is holding them. "Oh, thank goodness. A Reader. You're not stuck. I can tell, you blinked." She curtsies. "Columbine. Leading lady. Nominally. Signor Bellamy's gone and the play hasn't got a last page and we can't stop, and the audience can't leave, and frankly, darling, it's become unbearable."`,
      `T: A stage play with no curtain call. That's not a show, Reader, that's a prison with lighting.`,
    ],
    choices: [
      { t: 'Climb behind the curtain with Columbine', ink: 'gold', to: 1061 },
      { t: 'Slip away before the dragon roars again', to: 1000 },
    ],
  },
  1061: {
    title: 'Behind the Curtain', scene: 'tent', actors: [A('hero', -150, 470), A('bellamy', 30, 420, -1, 'hurt'), A('columbine', 120, 450, -1, 'talk'), A('e:marionette', 200, 480, -1)],
    text: [
      `Backstage is a cave of hanging puppets and painted flats. Up in the rafters, tangled in a cat's cradle of his own strings, hangs a man in a plum-colored coat with a pointed beard, upside down, fading to pencil from the toes up.`,
      `"Signor Bellamy," says Columbine fondly. "He tried to cut the last page out of the script to save it from the man with the scissors. Thought if he hid the ending, nobody could steal it. Then he forgot where he hid it. Now the strings have got him. He's become part of the act."`,
      `"Mmmf," says Signor Bellamy, who has a string through his mouth.`,
      `"So here's the thing, darling," Columbine says. "A play needs an ending. Any ending. Somebody has to write one, and none of us can, we're puppets, we just do what the story says. But you're a Reader." She hands you a stub of pencil and a blank page. "Write us a last act. Just mind the dragon. He's very attached to his part."`,
      `T: No pressure. Only thirty people's eyeballs and a man's life. Go on. Be brilliant.`,
    ],
    choices: [
      { t: 'Write that the prince slays the dragon and wins the day', ink: 'crimson', to: 1062 },
      { t: 'Write that the prince lays down his sword and the dragon weeps and they share a pot of tea (Heart check, 9+)', ink: 'gold', check: { stat: 'heart', target: 9 }, pass: 1063, fail: 1062 },
      { t: 'Write that the dragon eats the prince, and then the applause', ink: 'indigo', to: 1064 },
    ],
  },
  1062: {
    title: 'The Dragon Objects', scene: 'tent', actors: [A('hero', -150, 470, 1, 'idle'), A('e:puppet_dragon', 160, 440, -1), A('e:marionette', 60, 400, -1), A('e:marionette', 80, 500, -1)],
    text: [
      `The pencil scratches. The page takes the words. Out front, the curtain swishes back, and the prince raises his sword...`,
      `...and the dragon does not die. The dragon turns its great painted head and looks straight backstage at you, and its wooden jaw creaks open, and from inside comes a voice like a bellows in a cathedral.`,
      `"I HAVE DIED NINE HUNDRED TIMES IN THIS WAGON," it says. "NINE HUNDRED. ALWAYS THE SAME SWORD. ALWAYS THE SAME SQUEAK. NOT. AGAIN."`,
      `The dragon comes off the stage, and it grows as it comes, canvas wings unrolling, and every puppet in the wagon picks up whatever it was holding and turns to face you.`,
      `T: Critics. Every playwright's nightmare.`,
    ],
    choices: [{ t: 'Fight the last act yourself', ink: 'crimson', battle: 'puppets', win: 1065 }],
  },
  1063: {
    title: 'A Pot of Tea', scene: 'tent', actors: [A('hero', -150, 470, 1, 'cheer'), A('bellamy', 20, 460, -1, 'cheer'), A('columbine', 110, 450, -1, 'cheer')],
    once: { questDone: 'puppets', xp: 55, gold: 20, item: 'mirror_shard', ally: 'columbine', ink: { gold: 1 } },
    text: [
      `The prince raises his wooden sword. And then, for the first time in nine hundred performances, he lowers it.`,
      `The dragon blinks its painted eyes. The prince says something the script never said: "You must be very tired of this." And the dragon, after a long creaking pause, says, "YOU HAVE NO IDEA," and begins, very quietly, to cry, great canvas tears, and the prince sits down beside it and somebody wheels on a little puppet table with a little puppet teapot.`,
      `The curtain falls. It stays fallen. Out front, thirty villagers blink all at once, and then they're on their feet, clapping and stamping and sobbing into their hats, Dunstan loudest of all.`,
      `Backstage, every string in the wagon goes slack. Signor Bellamy drops out of the rafters into a basket of costumes. He sits up, spits out a string, and stares at the page in your hand. "TEA," he says. "Tea! Magnifico! Why did I never think of tea?"`,
      `Columbine climbs up onto your shoulder and settles there like she means to stay. "I'm coming with you," she announces. "Not now. You're far too dull at present. But when you get to the end of your story, darling, you'll want someone who knows how to make an entrance."`,
      `Bellamy presses a little silver mirror shard into your hand. "From the dragon's eye. Bad luck to keep it. Worse luck to refuse it. Ciao!"`,
      `T: I cried at the tea part. Don't tell anyone. Ribbons aren't supposed to leak.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1065: {
    title: 'Curtain', scene: 'tent', actors: [A('hero', -150, 470, 1, 'cheer'), A('bellamy', 20, 460, -1, 'cheer'), A('columbine', 110, 450, -1, 'cheer')],
    once: { questDone: 'puppets', xp: 55, gold: 30, ally: 'columbine', ink: { crimson: 1 } },
    text: [
      `The dragon comes apart in a heap of canvas and lath and paint. Somewhere out front, the prince's wooden sword finally comes down on the place where the dragon used to be, exactly on cue, and the curtain falls, and stays fallen.`,
      `For a moment there's silence. Then thirty villagers blink all at once and leap to their feet clapping, stamping, weeping into their hats, convinced it was the best show of their lives. Dunstan the baker shouts "BRAVO" so hard he sits down again.`,
      `Every string in the wagon goes slack. Signor Bellamy drops out of the rafters into a basket of feathers. "A FIGHT," he gasps. "A real fight! On my stage! The critics will DIE."`,
      `Columbine lands on your shoulder, a little scuffed. "Well," she says, "that was vulgar and marvellous. I'm coming with you. Not now, you understand. But when you get to your last act, darling, you'll want someone in the wings who isn't afraid of a dragon."`,
      `T: That's two of us, then. Although I'd like it noted that I was in the wings first.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
  1064: {
    title: 'The Dragon’s Ending', scene: 'tent', actors: [A('hero', -150, 470, 1, 'idle'), A('bellamy', 20, 460, -1, 'cower'), A('columbine', 110, 450, -1, 'hurt')],
    once: { questDone: 'puppets', xp: 50, gold: 50, align: 1, ink: { indigo: 1 }, item: 'mirror_shard' },
    text: [
      `The prince raises his sword. The dragon opens its jaws. And this time the jaws keep opening, wider than the wagon, and there is a crunch, and then there isn't a prince.`,
      `Then the dragon turns to the audience and breathes in, and you hear thirty people's applause, the clapping they had saved up for nine hundred performances, go whistling out of their hands and down its throat.`,
      `The curtain falls. It stays fallen. The audience gets up and leaves in silence, blinking, rubbing their palms. Nobody claps. Nobody can.`,
      `Signor Bellamy drops out of the rafters, shaking. "It's... a very strong ending," he says faintly. "Very... modern." He gives you the dragon's mirror eye and a purse of gold and asks you, politely, never to write for him again.`,
      `Columbine says nothing at all. She just hangs on her strings, watching you go.`,
      `T: Well. It finished. You can't say it didn't finish.`,
    ],
    choices: [{ t: 'Back to the lanes', to: 1000 }],
  },
});

/* new keepsakes found in the back lanes */
Object.assign(KEY_ITEMS, {
  shepherds_crook: { name: 'Shepherd’s Crook-Head', desc: 'A bone hook from the Long Barrow. It hums faintly, still counting.' },
});
