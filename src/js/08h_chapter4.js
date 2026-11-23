/* ==========================================================================
   CHAPTER IV - THE UNWRITTEN
   Behind the black door there is no Bindery. Edmund has folded it up onto the
   last page of the Tome (the "second moon"). To climb there, the Reader must
   make the stopped clock of Clockfall strike midnight, which needs three
   things borrowed from three stuck stories: a chime, a hammer, a minute hand.
   Sections 1700-1999 belong to Chapter IV.
   ========================================================================== */
Object.assign(CAST, {
  sir_doodle: { rig: 'human', name: 'Sir Doodle', skin: '#f4f0e6', face: 'masked', hat: { type: 'greathelm', color: '#f4f0e6', color2: '#16161e' }, body: { type: 'armor', color: '#f4f0e6', color2: '#16161e', trim: '#16161e' }, weapon: { type: 'sword', color: '#16161e', color2: '#16161e' }, offhand: { type: 'kite', color: '#f4f0e6', color2: '#16161e' }, eyes: { color: '#4a6aff', glow: true }, legs: '#16161e', arms: '#f4f0e6', cape: '#16161e', scale: 0.92 },
  tock: { rig: 'human', name: 'Old Tobias Tock', skin: SKINS[1], hair: { style: 'wild', color: '#e8e4dc' }, beard: { style: 'mustache', color: '#e8e4dc' }, hat: { type: 'cap', color: '#5a4a3a' }, body: { type: 'vest', color: '#6a4a2a', color2: '#c8b890' }, weapon: { type: 'hammer', color: '#8a8a90' }, face: 'old', hunch: 0.4 },
  mina: { rig: 'human', name: 'Mina Tock', skin: SKINS[1], hair: { style: 'braid', color: '#2a1a14' }, hat: { type: 'kerchief', color: '#9a7a3a' }, body: { type: 'dress', color: '#5a4a3a', trim: '#c9a14a' }, face: 'child', scale: 0.78 },
  odalie: { rig: 'human', name: 'Princess Odalie', skin: '#ecdcee', hair: { style: 'bun', color: '#d8c8a0' }, hat: { type: 'circlet', color: '#ece4f4', color2: '#ff9ac8' }, body: { type: 'dress', color: '#e8c8d8', trim: '#ffffff' }, face: 'sad', eyes: { color: '#ffc8e8', glow: true } },
  maestro: { rig: 'human', name: 'Maestro Grimaldi', skin: '#d8c8b8', hair: { style: 'long', color: '#1a1414' }, hat: { type: 'tophat', color: '#1a0a10', color2: '#c9a14a' }, body: { type: 'coat', color: '#2a0a14', color2: '#c9a14a' }, weapon: { type: 'staff', color: '#1a1414' }, face: 'masked', eyes: { color: '#ff5a8a', glow: true }, cape: '#1a0a10', scale: 1.3, armLen: 1.25 },
  orm: { rig: 'human', name: 'King Orm Halfbeard', skin: SKINS[1], hair: { style: 'braid', color: '#c86a2a' }, beard: { style: 'braid', color: '#c86a2a' }, hat: { type: 'crown', color: '#c9a14a' }, body: { type: 'armor', color: '#6a4a2a', color2: '#8a8a90', trim: '#c9a14a' }, weapon: { type: 'hammer', color: '#8a8a90', color2: '#c9a14a' }, cape: '#7a1a1a', face: 'stern', wide: 1.3, scale: 1.15 },
  sigrun: { rig: 'human', name: 'Sigrun Saga-Tongue', skin: SKINS[0], hair: { style: 'braid', color: '#e8d8a0' }, hat: { type: 'winged', color: '#8a8a90' }, body: { type: 'dress', color: '#3a4a6a', trim: '#c9a14a' }, weapon: { type: 'lute' }, face: 'hero' },
  bram: { rig: 'human', name: 'Bram the Huntsman', skin: SKINS[2], hair: { style: 'long', color: '#5a3a24' }, beard: { style: 'stubble', color: '#4a2a1a' }, hat: { type: 'hood', color: '#4a5a4a' }, body: { type: 'coat', color: '#5a4a3a', color2: '#e8e0d0' }, weapon: { type: 'spear', color: '#c9a14a', color2: '#e8e0d0' }, cape: '#e8e0d0', face: 'sad' },
  strikethrough: { rig: 'human', name: 'Strikethrough', skin: '#e8e4d8', hair: { style: 'bald', color: '#e8e4d8' }, body: { type: 'robe', color: '#e8e4d8', trim: '#16161e' }, weapon: { type: 'candle' }, face: 'old', hunch: 0.5 },
});

Object.assign(ENEMIES, {
  scribble: { name: 'Scribble', cfg: { rig: 'inkspawn', color: '#14141c', eyes: { color: '#4a6aff' } }, hp: 40, dmg: 8, cd: 1.0, speed: 110, range: 34, ai: 'hopper', xp: 6, gold: [1, 3], r: 14, inkborn: true },
  white_hound: { name: 'Blank Hound', cfg: { rig: 'wolf', color: '#ece6d8', eyes: { color: '#16161e' } }, hp: 64, dmg: 10, cd: 1.15, speed: 120, range: 38, ai: 'leaper', xp: 9, gold: [2, 4], r: 15 },
  waltz_wraith: { name: 'Waltzing Wraith', cfg: { rig: 'human', skin: '#d8c8e0', face: 'ghoul', hair: { style: 'bun', color: '#a898b8' }, body: { type: 'dress', color: '#5a2a40', trim: '#e8c8d8' }, weapon: { type: 'knife', color: '#e8e0f0' }, eyes: { color: '#ff8ac8', glow: true } }, hp: 70, dmg: 9, cd: 0.95, speed: 112, range: 44, ai: 'duelist', xp: 10, gold: [2, 5], r: 14, undead: true },
  maestro: { name: 'Maestro Grimaldi', cfg: Object.assign({}, CAST.maestro), hp: 820, dmg: 14, cd: 1.7, speed: 80, range: 280, ai: 'shaman', proj: 'hex', xp: 120, gold: [60, 70], r: 18, boss: true, minion: 'waltz_wraith' },
  hall_thane: { name: 'Thane of the Hall', cfg: { rig: 'human', skin: SKINS[1], hair: { style: 'braid', color: '#c8a060' }, beard: { style: 'full', color: '#c8a060' }, hat: { type: 'helm', color: '#8a8a90' }, body: { type: 'armor', color: '#5a4a3a', color2: '#8a8a90' }, weapon: { type: 'hammer', color: '#8a8a90' }, offhand: { type: 'shield', color: '#7a1a1a', color2: '#c9a14a' } }, hp: 110, dmg: 11, cd: 1.4, speed: 80, range: 52, ai: 'knight', xp: 14, gold: [3, 6], r: 16 },
  grimwolf: { name: 'Grimwolf the Unsleeping', cfg: { rig: 'human', skin: SKINS[2], hair: { style: 'wild', color: '#4a3a2a' }, beard: { style: 'full', color: '#4a3a2a' }, hat: { type: 'horned', color: '#6a6a70' }, body: { type: 'bare', color: '#5a3a2a', fur: '#6a5a4a' }, weapon: { type: 'greataxe', color: '#8a8f86' }, eyes: { color: '#ff4a2a', glow: true }, scale: 1.6, wide: 1.4 }, hp: 900, dmg: 18, cd: 2.2, speed: 72, range: 78, ai: 'brute', xp: 120, gold: [60, 70], r: 24, boss: true, minion: 'hall_thane' },
  frost_wolf: { name: 'Frost Wolf', cfg: { rig: 'wolf', color: '#d8e8f4', eyes: { color: '#7fd1ff' } }, hp: 62, dmg: 10, cd: 1.1, speed: 124, range: 38, ai: 'leaper', xp: 9, gold: [1, 4], r: 15 },
  rime_wight: { name: 'Rime Wight', cfg: { rig: 'human', skin: '#a8c8d8', face: 'ghoul', hat: { type: 'hood', color: '#d8e8f4' }, body: { type: 'rags', color: '#8aa8c0' }, weapon: { type: 'bow', color: '#d8e8f4' }, eyes: { color: '#7fd1ff', glow: true } }, hp: 58, dmg: 11, cd: 2.3, speed: 66, range: 320, ai: 'ranged', proj: 'cold', xp: 10, gold: [2, 5], r: 13, undead: true },
  old_rime: { name: 'Old Rime, the Winter King', cfg: { rig: 'human', skin: '#a8c8e0', hair: { style: 'long', color: '#e8f4ff' }, beard: { style: 'long', color: '#e8f4ff' }, hat: { type: 'crown', color: '#d8f0ff' }, body: { type: 'robe', color: '#d8e8f4', trim: '#7fd1ff' }, weapon: { type: 'staff', color: '#a8c8e0', color2: '#7fd1ff' }, eyes: { color: '#7fd1ff', glow: true }, cape: '#e8f4ff', scale: 1.7, hunch: 0.3 }, hp: 860, dmg: 15, cd: 1.8, speed: 64, range: 300, ai: 'shaman', proj: 'cold', xp: 120, gold: [60, 70], r: 22, boss: true, minion: 'frost_wolf' },
  strikeout: { name: 'Strikeout', cfg: { rig: 'human', skin: '#e8e4d8', face: 'masked', hair: { style: 'wild', color: '#16161e' }, body: { type: 'tunic', color: '#e8e4d8', color2: '#16161e' }, weapon: { type: 'knife', color: '#16161e' }, eyes: { color: '#ff3a3a', glow: true } }, hp: 56, dmg: 9, cd: 0.9, speed: 116, range: 40, ai: 'skitter', xp: 8, gold: [2, 4], r: 13, inkborn: true },
  rough_draft: { name: 'The Rough Draft', cfg: { rig: 'inkspawn', big: true, color: '#16161e', scale: 2.2, eyes: { color: '#ff3a3a' } }, hp: 780, dmg: 15, cd: 2.4, speed: 50, range: 96, ai: 'brute', xp: 110, gold: [50, 60], r: 40, inkborn: true, boss: true, splits: 'scribble', minion: 'strikeout' },
  tick_soldier: { name: 'Tick-Tock Soldier', cfg: { rig: 'human', skin: '#b8903a', face: 'masked', hat: { type: 'pot', color: '#8a6a2a' }, body: { type: 'armor', color: '#8a6a2a', color2: '#c9a14a' }, weapon: { type: 'spear', color: '#c9a14a' }, eyes: { color: '#ffb84a', glow: true }, legs: '#5a4a2a', arms: '#b8903a' }, hp: 120, dmg: 11, cd: 1.5, speed: 70, range: 70, ai: 'knight', xp: 14, gold: [3, 6], r: 16 },
  cog_spider: { name: 'Cog Spider', cfg: { rig: 'rat', color: '#8a6a2a', eyes: { color: '#ffb84a' } }, hp: 44, dmg: 8, cd: 0.9, speed: 128, range: 30, ai: 'skitter', xp: 6, gold: [1, 3], r: 13 },
  stopwatch: { name: 'The Stopwatch', cfg: { rig: 'human', skin: '#b8903a', face: 'masked', hat: { type: 'greathelm', color: '#c9a14a', color2: '#5a4a2a' }, body: { type: 'armor', color: '#8a6a2a', color2: '#c9a14a', trim: '#5a4a2a' }, weapon: { type: 'greataxe', color: '#d8d8e0' }, eyes: { color: '#ffd04a', glow: true }, shoulders: { type: 'skull' }, arms: '#b8903a', legs: '#5a4a2a', scale: 2.0, wide: 1.3 }, hp: 1180, dmg: 21, cd: 2.3, speed: 60, range: 90, ai: 'brute', xp: 140, gold: [70, 80], r: 26, boss: true, minion: 'cog_spider' },
  the_blank: { name: 'The Blank', cfg: { rig: 'human', skin: '#f4f0e6', face: 'shadow', body: { type: 'robe', color: '#ece6d8', trim: '#d8d0c0' }, arms: '#f4f0e6', legs: '#ece6d8', scale: 2.3, armLen: 1.5, hunch: 0.3 }, hp: 1380, dmg: 22, cd: 2.2, speed: 62, range: 96, ai: 'brute', xp: 180, gold: [90, 110], r: 28, boss: true, minion: 'scribble' },
  corrector_general: { name: 'The Corrector-General', cfg: { rig: 'human', skin: '#e8dcc8', hat: { type: 'mitre', color: '#a3241c', color2: '#ffd27a' }, body: { type: 'robe', color: '#a3241c', trim: '#ffd27a' }, weapon: { type: 'staff', color: '#2a1a1a', color2: '#ff3a2a' }, face: 'stern', eyes: { color: '#ff3a2a', glow: true }, cape: '#5a0e0a', scale: 1.45 }, hp: 900, dmg: 15, cd: 1.6, speed: 66, range: 300, ai: 'shaman', proj: 'hex', xp: 150, gold: [70, 90], r: 20, boss: true, minion: 'errata_soldier' },
});

Object.assign(BATTLES, {
  whiteroad: { scene: 'whitepage', title: 'The White Country', tier: 3.0, hero: { dx: -120, y: 450 }, waves: [[{ t: 'scribble', dx: 140, y: 400 }, { t: 'scribble', dx: 170, y: 500 }, { t: 'white_hound', dx: 240, y: 440 }, { t: 'scribble', dx: -220, y: 460 }], [{ t: 'white_hound', edge: 1, y: 400 }, { t: 'white_hound', edge: -1, y: 500 }, { t: 'scribble', edge: 1, y: 460 }, { t: 'margin_hound', edge: -1, y: 420 }]] },
  bandmaster: { scene: 'ballroom', title: 'The Hundredth Dance', boss: 'maestro', tier: 1.7, hero: { dx: -180, y: 460 }, waves: [[{ t: 'maestro', dx: 230, y: 430 }, { t: 'waltz_wraith', dx: 110, y: 390 }, { t: 'waltz_wraith', dx: 130, y: 510 }], [{ t: 'waltz_wraith', edge: 1, y: 410 }, { t: 'waltz_wraith', edge: -1, y: 490 }]] },
  grimwolf: { scene: 'longhall', title: 'Grimwolf the Unsleeping', boss: 'grimwolf', tier: 1.7, hero: { dx: -180, y: 460 }, waves: [[{ t: 'grimwolf', dx: 190, y: 450 }, { t: 'hall_thane', dx: 280, y: 380 }]] },
  frostwolves: { scene: 'ninth', title: 'The Ninth Winter', tier: 3.1, hero: { dx: -110, y: 450 }, waves: [[{ t: 'frost_wolf', dx: 140, y: 400 }, { t: 'frost_wolf', dx: 170, y: 500 }, { t: 'rime_wight', dx: 320, y: 440 }], [{ t: 'frost_wolf', edge: 1, y: 420 }, { t: 'frost_wolf', edge: -1, y: 480 }, { t: 'rime_wight', edge: 1, y: 380 }, { t: 'rime_wight', edge: -1, y: 520 }]] },
  old_rime: { scene: 'ninth', title: 'Old Rime, the Winter King', boss: 'old_rime', tier: 1.7, hero: { dx: -180, y: 460 }, waves: [[{ t: 'old_rime', dx: 230, y: 440 }, { t: 'frost_wolf', dx: 120, y: 390 }, { t: 'frost_wolf', dx: 140, y: 510 }]] },
  drafts: { scene: 'stacks', title: 'The Drafts Riot', boss: 'rough_draft', tier: 1.6, hero: { dx: -180, y: 460 }, waves: [[{ t: 'strikeout', dx: 120, y: 400 }, { t: 'strikeout', dx: 150, y: 500 }, { t: 'strikeout', dx: -220, y: 450 }], [{ t: 'rough_draft', dx: 220, y: 450 }, { t: 'strikeout', edge: 1, y: 400 }, { t: 'strikeout', edge: -1, y: 500 }]] },
  clockworks: { scene: 'clockwork', title: 'Inside the Clock', tier: 3.2, hero: { dx: -120, y: 450 }, waves: [[{ t: 'tick_soldier', dx: 150, y: 420 }, { t: 'cog_spider', dx: 120, y: 500 }, { t: 'cog_spider', dx: -210, y: 460 }, { t: 'tick_soldier', dx: 260, y: 480 }], [{ t: 'cog_spider', edge: 1, y: 400 }, { t: 'cog_spider', edge: -1, y: 500 }, { t: 'tick_soldier', edge: 1, y: 450 }, { t: 'tick_soldier', edge: -1, y: 430 }]] },
  stopwatch: { scene: 'clockwork', title: 'The Stopwatch', boss: 'stopwatch', tier: 1.75, hero: { dx: -200, y: 460 }, waves: [[{ t: 'stopwatch', dx: 200, y: 450 }, { t: 'cog_spider', dx: 280, y: 380 }, { t: 'cog_spider', dx: 280, y: 520 }]] },
  the_blank: { scene: 'whitepage', title: 'The Blank', boss: 'the_blank', tier: 1.8, hero: { dx: -200, y: 460 }, waves: [[{ t: 'the_blank', dx: 200, y: 450 }, { t: 'scribble', dx: 120, y: 390 }, { t: 'scribble', dx: 130, y: 510 }], [{ t: 'white_hound', edge: 1, y: 420 }, { t: 'white_hound', edge: -1, y: 480 }]] },
});

Object.assign(QUESTS, {
  unwritten: { title: 'The Clock at the Edge of the World', giver: 'Old Tobias Tock', main: true, stages: { start: 'Edmund has folded the Bindery up onto the last page of the Tome. Clockfall’s great clock stopped at a minute to midnight; when it strikes twelve, the stair to the last page unfolds. It is missing three pieces: a chime, a hammer and a minute hand.', parts: 'You have all three pieces of the clock. Take them to the clocktower.' } },
  ball: { title: 'The Hundredth Dance', giver: 'Old Tobias Tock', stages: { start: 'The clock’s midnight chime was lent to a royal ball three hundred years ago. The princess is still dancing. The Maestro will not play the last song.' } },
  hall: { title: 'The Unending Feast', giver: 'Old Tobias Tock', stages: { start: 'King Orm Halfbeard took the clock’s striking hammer to his mead-hall, where his warriors have feasted for three hundred years, waiting for a last battle that never comes.' } },
  winter: { title: 'The Ninth Winter', giver: 'Old Tobias Tock', stages: { start: 'The clock’s minute hand was forged into a hunting spear. Its owner, Bram the Huntsman, will not finish his hunt, and so it has been winter in his forest for nine years.' } },
  drafts: { title: 'The Drafts', giver: 'Sir Doodle', stages: { start: 'Under Clockfall lies the archive where the Author kept every draft she crossed out. Sir Doodle thinks you should see it.' } },
});
Object.assign(KEY_ITEMS, {
  midnight_chime: { name: 'The Midnight Chime', desc: 'A note of crystal that rings without being struck. The clock’s voice.' },
  orm_hammer: { name: 'Thunder-Tongue', desc: 'King Orm’s hammer. Once, long ago, it struck the hours of Clockfall.' },
  minute_hand: { name: 'The Minute Hand', desc: 'A spear of black iron, a little too long and a little too thin, that points toward midnight whichever way you hold it.' },
  vellum_page: { name: 'A First Draft', desc: '"The Under-Clerk of Pellingham," in the Author’s crooked hand. The last line has a name in it: Valentine Pellum.' },
});
HEROES_ALL.push('orm', 'sir_doodle');

const CLOCK_PARTS = ['midnight_chime', 'orm_hammer', 'minute_hand'];
const partsHeld = (st) => CLOCK_PARTS.filter((k) => st.run.keys.includes(k)).length;

Object.assign(SECTIONS, {
  1700: {
    title: 'Through the Black Door', scene: 'whitepage', chapterStart: true,
    actors: [A('hero', -100, 470, 1, 'hurt'), A('tassel', -20, 390)],
    once: { quest: { unwritten: 'start' } },
    text: [
      `You open the black door and step through, and the floor is not there.`,
      `You fall a long way through nothing in particular, and land on your back on something soft and dry that crackles. Paper. A plain of blank white paper running away in every direction, faintly ruled with pale blue lines, under a white sky with no sun in it. The black door is gone. There is no Bindery. There is no Edmund.`,
      `Far, far above you hangs the second moon. You have seen it every night since Quillsby, but never this close: an enormous blank page, edges curling, glowing like a lamp through paper. And on it, so small you have to squint, there is a round stone room with candlelight in its windows.`,
      `T: Oh no. Oh, he didn't. He did. He felt the door open and he folded the whole Bindery up and put it on the last page. The one page nobody can reach, because nothing in the Tome has an ending to climb on.`,
      `Tassel flutters in a tight, furious circle.`,
      `T: He used to do this with his books when he was a boy. Agnes told me. If a story frightened him, he'd fold the last page over so he couldn't see it. He's folding the whole world over, Reader.`,
    ],
    choices: [{ t: 'Get up and look around', to: 1701 }],
  },
  1701: {
    title: 'Sir Doodle', scene: 'whitepage', actors: [A('hero', -150, 470), A('tassel', -70, 390), A('sir_doodle', 90, 460, -1, 'talk')],
    text: [
      `Something is coming across the paper toward you at a brisk clank. It is a knight, about as tall as your chest, and it is drawn. Not painted. Drawn, in quick black ink, the lines a little wobbly, the shield slightly the wrong shape, the plume on its helm clearly added later by someone who thought it needed a plume.`,
      `It stops, salutes with a sword that is mostly a single line, and speaks in a voice like a nib scratching. "Sir Doodle, of the Margins. Knight of the Bottom Left Corner. You are a Reader. I can tell. You are in colour."`,
      `"She drew me," he says, before you can ask. "The Author. Late one night, in the margin of chapter nine, while she was trying to think of how a story ended. She never put me in the story. So I have been out here ever since, being a knight at nobody in particular." He draws himself up, which makes him very slightly taller. "But I know the way to the last page. Nobody else does."`,
      `"Only a story with an ending can climb to the last page," he explains, pointing up with his sword. "Out here nothing has one. Except," and the ink of his face rearranges itself into something like a grin, "the Clock."`,
      `T: What clock?`,
      `"The one that turns the pages of the whole Tome, small ribbon. It stood in Clockfall at the edge of the margins and struck the end of every story, and when it struck midnight, a stair unfolded from it all the way up to the last page, so the Binder could climb up and close the book. Then a boy with white hair came by with a pair of scissors and stopped it at a minute to twelve." Sir Doodle lowers his voice. "It has been a minute to twelve for three hundred years. Come. It is not far. It is only dangerous."`,
    ],
    choices: [
      { t: '"Lead on, Sir Doodle."', ink: 'gold', to: 1702 },
      { t: '"Why would you help us?"', ink: 'indigo', to: 1702 },
    ],
  },
  1702: {
    title: 'The White Country', scene: 'whitepage', actors: [A('hero', -150, 470), A('sir_doodle', -60, 460, 1, 'attack'), A('e:white_hound', 150, 430, -1), A('e:scribble', 220, 500, -1), A('e:scribble', 90, 390, -1)],
    text: (st) => [
      `You walk for what might be an hour across the ruled lines, and the white country fills up with things that were never finished. A castle with only one wall. A sea that is a single wavy line. A crowd of people with no faces, who turn to watch you go by. A word, enormous, half-erased, lying on its side like a fallen statue: ONCE.`,
      `"Doodles," says Sir Doodle quietly. "Crossings-out. Drafts. Things that wanted to be in a story and were not. Most of them are harmless." He draws his line of a sword. "Most."`,
      `Over a low ridge of crumpled paper come the hounds: long white dogs with nothing where their faces should be, only blank paper, sniffing for ink. Behind them, scribbles boil up out of the margin, angry knots of black line with too many legs.`,
      `"They smell your colour," says Sir Doodle. "They want it." He settles his drawn shield on his drawn arm. "I will be honest: I have never actually been in a fight. I was drawn holding a sword. I am hoping that counts."`,
      `T: Sir Doodle, stand behind the Reader.`,
      `"Gladly, small ribbon."`,
    ],
    choices: [{ t: 'Fight through the white country', ink: 'crimson', battle: 'whiteroad', win: 1703 }],
  },
  1703: {
    title: 'Clockfall', scene: 'clockfall', actors: [A('hero', -150, 470), A('sir_doodle', -70, 460, 1, 'idle'), A('mina', 120, 480, -1, 'talk')],
    text: [
      `The white country ends at a cliff of torn paper, and below the cliff is a city that someone remembered to draw properly.`,
      `Clockfall is all steep slate roofs and crooked chimneys and lamplit windows, stacked up a hillside under a black night sky full of stars. Every street climbs toward the same thing: a clocktower so tall its top is lost in the dark, with a great white face the size of a village green. Both hands point almost straight up. The minute hand is missing. Where it should be, there is only a hole.`,
      `It is very quiet. Then you notice why. Everyone in Clockfall is moving, but only a little: a baker sliding a tray into an oven, over and over; a man taking off his hat to a woman, and putting it back on, and taking it off; a dog jumping for a stick that is always just about to be thrown. They are all living the last minute before midnight. They have been living it for three hundred years.`,
      `One person is not. A girl of nine or ten with a dark braid and a clockmaker's apron runs down the steps toward you, waving both arms. "You're moving!" she shouts. "You're MOVING! Grandpa! GRANDPA! Somebody new is moving!"`,
    ],
    choices: [{ t: 'Follow her up the steps', to: 1704 }],
  },
  1704: {
    title: 'Old Tobias Tock', scene: 'shop', actors: [A('hero', -150, 470), A('tock', 40, 460, -1, 'talk'), A('mina', 130, 480, -1, 'idle'), A('sir_doodle', -230, 470, 1, 'idle')],
    once: { xp: 40 },
    text: [
      `The clockmaker's shop is the only place in Clockfall where every clock is ticking. Hundreds of them on the walls, all slightly different, all keeping time out of sheer stubbornness. In the middle of it sits an old man with a white mustache and a jeweller's glass in one eye.`,
      `"Tobias Tock," he says. "Keeper of the Great Clock, for what that's worth these days. This is Mina, my granddaughter. We're the only two in Clockfall who keep moving. Clockmakers can't help it. We'd go mad, standing still with all these ticking." He squints at you. "You'll be wanting the stair."`,
      `He takes down a drawing of the clocktower and spreads it on the bench. "The Great Clock is the one that strikes the last hour of every story. When it strikes midnight, the stair of pages unfolds and goes up to the last page of the Tome. Three hundred years ago a white-haired lad climbed the tower and talked very gently to me, and said he was sorry, and stopped the clock at a minute to twelve. Then he took three pieces away with him and gave them to three stories that he said needed them more."`,
      `He ticks them off on his fingers. "The Midnight Chime, the note the clock sings with: he lent it to a royal ball, so that midnight would never strike there. The Striking Hammer: he gave it to a king of the north in a hall that feasts forever. And the Minute Hand: he had it forged into a spear for a huntsman, so the huntsman would never have to finish his hunt." Old Tock sighs. "Kind lad. Terrible idea."`,
      `"Bring me all three," he says, "and I'll make her strike."`,
      `T: Three stories, three pieces. And in each one, I'd bet my fringe, somebody who doesn't want their story to end.`,
      `"There's a fourth thing," says Sir Doodle, a little shyly. "Under Clockfall. The archive where she kept her drafts. Every page she ever crossed out." His inky face is serious. "I think you should see it before you go up. I think it might matter."`,
    ],
    choices: [{ t: 'Go out into Clockfall', to: 1705 }],
  },
  1705: {
    title: 'Clockfall Square', scene: 'clockfall',
    actors: (st) => { const a = [A('hero', -150, 470), A('tassel', -70, 390), A('sir_doodle', -230, 470, 1, 'idle'), A('mina', 220, 490, -1, 'idle')]; if (partsHeld(st) >= 3) a.push(A('tock', 140, 460, -1, 'cheer')); return a; },
    once: { quest: { ball: 'start', hall: 'start', winter: 'start' } },
    text: (st) => {
      const n = partsHeld(st);
      return [
        `The Great Clock looms over the square, its face as white and blind as the second moon, both hands straining toward twelve. Around you Clockfall lives out its last minute: the baker, the hat, the dog and the stick. Somewhere a church choir sings the same four bars, beautifully, again and again.`,
        n === 0 ? `Three roads lead out of the square. One climbs to a palace on the hill, where every window blazes and music has been playing for three hundred years. One runs north, toward a black line of forest under falling snow. One goes down to a long timber hall by the shore, roaring with song.` : n < 3 ? `You have ${n} of the clock's three pieces. Old Tock comes out of his shop every time you pass and asks how it's going, and then pretends he wasn't waiting.` : `You have all three pieces of the clock. Old Tock is standing at the foot of the tower with his toolbag, practically vibrating.`,
        `Mina Tock follows you about at a distance, taking notes in a little book. When you catch her at it she says, "I'm writing down everything that happens. In case it all starts again. Somebody ought to remember."`,
      ];
    },
    choices: [
      { t: 'Climb to the palace where the music never stops', to: 1710, show: { notQuestDone: 'ball' } },
      { t: 'Go down to the roaring hall by the shore', to: 1720, show: { notQuestDone: 'hall' } },
      { t: 'Take the north road into the snow', to: 1730, show: { notQuestDone: 'winter' } },
      { t: 'Let Sir Doodle show you the archive under the city', to: 1740, show: { notQuestDone: 'drafts' } },
      { t: 'Wander Clockfall’s frozen streets', to: 1706, show: { notFlag: 'clockStreets' } },
      { t: 'Take the three pieces to the clocktower', ink: 'gold', to: 1750, need: { keyCount: [CLOCK_PARTS, 3, 'pieces of the clock'] } },
    ],
  },
  1706: {
    title: 'A Minute to Midnight', scene: 'clockfall', actors: [A('hero', -120, 470), A('mina', 30, 490, -1, 'talk')],
    once: { flag: 'clockStreets', potion: { heal: 1, clarity: 1 }, xp: 30 },
    text: [
      `Mina takes you round, because she has been everywhere in Clockfall ten thousand times and is delighted to finally have someone to show.`,
      `"That's Mr. Abernethy, he's proposing. She's going to say yes, you can tell by her eyebrows, but he never gets to the end of the question. That's the lamplighter, he's lighting the last lamp on Weft Street. That's a birthday." She points through a window at a boy leaning over a cake, cheeks puffed, about to blow out the candles. He has been about to blow them out for three hundred years. "He's going to be seven."`,
      `"I used to think it was funny," Mina says. "Then I used to think it was sad. Now I just want to know what happens. Does she say yes? Does he get his wish?" She closes her little book. "Grandpa says it doesn't matter what happens. It matters that it gets to."`,
      `T: Your grandfather is a wise man, Mina.`,
      `"He's a clockmaker," says Mina, as if that were the same thing. Before you go she presses two little bottles into your hand from her apron pocket. "From the apothecary. He's been reaching for them for three hundred years. He won't miss them."`,
    ],
    choices: [{ t: 'Back to the square', to: 1705 }],
  },

  /* ---------------- The Hundredth Dance ---------------- */
  1710: {
    title: 'The Hundredth Dance', scene: 'ballroom', actors: [A('hero', -150, 470), A('odalie', 30, 450, 1, 'idle'), A('maestro', 200, 400, -1, 'cast'), A('e:waltz_wraith', 110, 500, -1)],
    text: [
      `The palace ballroom is a red throat of light: three great chandeliers, a floor polished like black ice, and a hundred couples turning, turning, turning to a waltz that has no last bar. Their silks have faded to the colour of old roses. Their faces have faded further. They are not quite ghosts. They are what a story looks like after three hundred years of the same song.`,
      `In the middle of the floor, dancing alone, is a princess in a pale gown, with a silver circlet and her eyes shut.`,
      `"Princess Odalie," murmurs Sir Doodle. "I have heard about her. They say she promised her mother, on her deathbed, that she would dance one hundred dances at her first ball, and then leave the palace forever to go and live her own life. She has danced ninety-nine."`,
      `Up on the bandstand, a tall man in a black tailcoat and a white mask conducts the orchestra with a long black baton. His players are skeletons in powdered wigs. Hanging on a ribbon around his neck, ringing faintly with every beat, is a little crystal bell: the Midnight Chime.`,
      `Odalie opens her eyes as you cross the floor. "You're new," she says. "Nobody is new." She doesn't stop dancing. "The Maestro won't play the hundredth. He says if he plays it, the ball ends, and his music ends, and then what was it all for? A white-haired boy came to my ball once, and danced the ninety-ninth with me, and cried, and said: you'll never have to say goodbye now." She smiles, very tiredly. "I've been saying goodbye for three hundred years. I'd like to finish."`,
      `T: She wants the hundredth dance, Reader. Somebody has to give it to her.`,
    ],
    choices: [
      { t: 'Bow, take Odalie’s hand and lead the hundredth dance without the music (Grace check, 11+)', ink: 'gold', check: { stat: 'grace', target: 11 }, pass: 1711, fail: 1712 },
      { t: 'Climb onto the bandstand and make the Maestro play the last song', ink: 'crimson', battle: 'bandmaster', win: 1713 },
    ],
  },
  1712: {
    title: 'A Missed Step', scene: 'ballroom', actors: [A('hero', -150, 470, 1, 'hurt'), A('maestro', 200, 400, -1, 'cast'), A('e:waltz_wraith', 90, 420, -1), A('e:waltz_wraith', 120, 510, -1)],
    text: [
      `You get three steps into a dance with no music before your foot comes down on nothing, and you stumble, and the whole ballroom stops turning and looks at you.`,
      `"An interruption," says the Maestro, softly. "In my ball." His baton sweeps down, and the faded dancers let go of each other's hands and come at you, still waltzing, knives in their fingers.`,
    ],
    choices: [{ t: 'Fight your way to the bandstand', ink: 'crimson', battle: 'bandmaster', win: 1713 }],
  },
  1711: {
    title: 'Without Music', scene: 'ballroom', actors: [A('hero', -100, 470, 1, 'cheer'), A('odalie', 20, 460, -1, 'cheer'), A('maestro', 210, 400, -1, 'cower')],
    once: { key: 'midnight_chime', questDone: 'ball', xp: 120, gold: 40, ink: { gold: 1 }, item: 'mirror_shard' },
    text: [
      `You bow. She curtseys. You take her hand, and you begin to dance, and there is no music at all.`,
      `The orchestra falters into silence. The Maestro's baton hangs in the air. Around you, one by one, the faded couples stop turning to watch. And then, from your shoulder, very softly, Tassel begins to hum: not the waltz, but something simpler, the kind of tune you'd hum to a child at the end of a long day.`,
      `You dance the hundredth dance to a ribbon humming in a silent ballroom. Odalie laughs once, surprised, and leans her head on your shoulder, and when the tune runs out you both stand still in the middle of the floor and the dance is over.`,
      `Somewhere a clock you can't see strikes midnight in her story. The chandeliers dim. The faded dancers bow to one another and go out like candles, gently, one couple at a time. Odalie steps back and curtseys to you, very low, and her gown is white now, not faded, and her face is not tired.`,
      `"I'm going to go and live my own life now," she says. "I don't know what happens in it. Isn't that wonderful?" And she walks out of the ballroom doors into a morning you cannot see, and doesn't look back.`,
      `The Maestro stands alone on the bandstand. Slowly he takes the crystal bell from around his neck and holds it out. "It was a very good waltz," he says, to nobody. "It was the best thing I ever wrote." Then he puts down his baton, and sits on the edge of the stage, and weeps.`,
    ],
    choices: [{ t: 'Take the Midnight Chime back to Clockfall', to: 1705 }],
  },
  1713: {
    title: 'The Last Song', scene: 'ballroom', actors: [A('hero', -100, 470, 1, 'cheer'), A('odalie', 20, 460, -1, 'cheer')],
    once: { key: 'midnight_chime', questDone: 'ball', xp: 130, gold: 50, ink: { crimson: 1 } },
    text: [
      `The Maestro's baton snaps across your knee. The crystal bell flies off its ribbon and rings, one clear note, and the skeleton orchestra, freed from three hundred years of the same waltz, looks at one another, and lifts their bows, and plays the last song.`,
      `It is short. It is very beautiful. Odalie dances it alone in the middle of the floor with her eyes open, and when the last note fades she is standing still for the first time in three hundred years.`,
      `Somewhere a clock strikes midnight in her story. The faded couples bow to one another and go out like candles, gently, a pair at a time. Odalie curtseys to you, and her gown is white, not faded, and her face is not tired at all.`,
      `"I'm going to go and live my own life now," she says. "I don't know what happens next. Isn't that wonderful?" And she walks out of the ballroom doors into a morning you can't see.`,
      `You pick the Midnight Chime up off the floor. It rings in your hand without being struck. On the edge of the bandstand, the Maestro sits with his broken baton across his knees, listening to the silence.`,
      `T: He'll write another one. That's the thing about endings. They make room.`,
    ],
    choices: [{ t: 'Take the Midnight Chime back to Clockfall', to: 1705 }],
  },

  /* ---------------- The Unending Feast ---------------- */
  1720: {
    title: 'The Hall of the Unending Feast', scene: 'longhall', actors: [A('hero', -150, 470), A('orm', 40, 440, -1, 'talk'), A('sigrun', 140, 480, -1, 'idle'), A('e:hall_thane', 220, 420, -1), A('e:hall_thane', -240, 450, 1)],
    text: [
      `The hall by the shore is long and white-timbered, its roof beams carved with dragons, and it is so full of noise that the noise has a weather of its own. Two hundred warriors in mail and furs sit at the long tables, eating, drinking, singing, arm-wrestling, and arguing, all at once, all at the tops of their voices. The meat never runs out. The mead never runs out. Nobody has been sober for three centuries.`,
      `On a high seat at the end of the hall sits an enormous red-haired king with a gold crown, a braided beard on the left side of his face and a scorch-mark where the right side used to be. Across his knees lies a great iron hammer with lightning carved down the haft.`,
      `"KING ORM HALFBEARD," a woman with a lute and a winged helm announces, before he can. "Lord of the Long Hall, Breaker of the Sea-Wall, who lost half his beard to the breath of the dragon Skarn and kept the other half out of spite!" She bows to you. "Sigrun Saga-Tongue. I sing the king's deeds. I have been singing the same four for three hundred years."`,
      `"Because the fifth never comes!" roars the king, and slams his drinking horn down. "We were promised a last battle, small one! At the end of the world, when the sky splits and the wolf eats the sun, the heroes of this hall will ride out and die gloriously, and the skalds will sing it forever. And so we feast, and wait. And wait." He glowers into his horn. "A white-haired boy came here once and gave me this hammer and said: you'll never have to ride out now. Never have to die. Feast forever!" Orm belches thoughtfully. "Seemed generous at the time."`,
      `T: Reader, that hammer has a clock-maker's mark on the head. That's it.`,
      `Orm's eyes narrow. "You want Thunder-Tongue? Ha! Nobody takes a thing from this hall without proving they are worth a song. Beat Sigrun in a riddle-game, and I'll hand it over and call you clever. Or face my champion, Grimwolf the Unsleeping, who has not lost a fight in three hundred years, and I'll call you brave." He grins with half a beard. "Either way, it'll be the most interesting thing that's happened in here since the dragon."`,
    ],
    choices: [
      { t: 'Play the riddle-game with Sigrun Saga-Tongue (Wits check, 11+)', ink: 'indigo', check: { stat: 'wits', target: 11 }, pass: 1721, fail: 1722 },
      { t: 'Face Grimwolf the Unsleeping', ink: 'crimson', battle: 'grimwolf', win: 1723 },
    ],
  },
  1722: {
    title: 'The Riddle You Couldn’t Answer', scene: 'longhall', actors: [A('hero', -150, 470, 1, 'hurt'), A('orm', 60, 440, -1, 'cheer'), A('e:grimwolf', 200, 450, -1)],
    text: [
      `Sigrun's third riddle goes: "What is always coming and never arrives?" You think about it for too long, and the whole hall bangs its cups on the tables and roars "TOMORROW!" and Sigrun bows, delighted.`,
      `"A good try," says King Orm generously. "A brave try. And bravery, small one, must be tested." He snaps his fingers. At the far end of the hall, something enormous gets up off the floor, where it had been sleeping with its eyes open.`,
    ],
    choices: [{ t: 'Face Grimwolf the Unsleeping', ink: 'crimson', battle: 'grimwolf', win: 1723 }],
  },
  1721: {
    title: 'The Fifth Deed', scene: 'longhall', actors: [A('hero', -150, 470, 1, 'cheer'), A('orm', 40, 440, -1, 'cheer'), A('sigrun', 140, 480, -1, 'cheer')],
    once: { key: 'orm_hammer', questDone: 'hall', xp: 120, gold: 60, ally: 'orm', ink: { indigo: 1 } },
    text: [
      `Sigrun asks you three riddles and you answer all three. Then it is your turn, and you ask her only one: "What does a feast become, if it never ends?"`,
      `She opens her mouth. Shuts it. Looks out over the long tables, at the warriors with their glazed eyes and their grease-shined beards, singing the same song for the forty-thousandth time.`,
      `"A prison," says Sigrun Saga-Tongue softly, and the hall goes quiet for the first time in three hundred years.`,
      `King Orm looks down at the hammer across his knees for a long while. Then he stands, and he is even bigger standing. "She's right," he says. "Gods help me, the small one's clever and the skald's right. We weren't promised a feast. We were promised an ending." He holds Thunder-Tongue out to you, haft first. "Take it. Start the clock. Bring on the end of the world."`,
      `"And when it comes," he adds, as his warriors begin to stand up along the tables, one by one, blinking, reaching for helmets and shields they have not touched in centuries, "you will find the Long Hall riding at your back. That is a promise, Reader. Sigrun! The fifth deed!"`,
      `Sigrun is already tuning her lute, and for the first time in three hundred years, the song is new.`,
    ],
    choices: [{ t: 'Take Thunder-Tongue back to Clockfall', to: 1705 }],
  },
  1723: {
    title: 'Grimwolf Sleeps', scene: 'longhall', actors: [A('hero', -150, 470, 1, 'cheer'), A('orm', 40, 440, -1, 'cheer'), A('sigrun', 140, 480, -1, 'cheer')],
    once: { key: 'orm_hammer', questDone: 'hall', xp: 140, gold: 70, ally: 'orm', ink: { crimson: 1 } },
    text: [
      `Grimwolf the Unsleeping goes down like a felled oak, and lies on the rushes, and looks up at the carved dragons in the roof, and for the first time in three hundred years, he closes his eyes. Within a minute he is snoring like a landslide.`,
      `The hall is silent. Then King Orm Halfbeard begins to laugh, and pound the arm of his high seat, and two hundred warriors pound the tables with him until the dishes jump.`,
      `"THAT," roars Orm, "is a deed! Sigrun! Is that a deed?"`,
      `"That," says Sigrun Saga-Tongue, scribbling, "is the fifth deed, my king. The first new verse in three hundred years."`,
      `Orm stands and holds Thunder-Tongue out to you, haft first. "Take it. Wind the clock. Bring on the end of the world, small one, and when it comes," and along the tables his warriors are standing, blinking, reaching for shields they have not lifted in centuries, "you'll find the Long Hall riding at your back. That is the word of Orm."`,
      `T: I've just been promised an army of drunk Vikings. This is the best day of my life.`,
    ],
    choices: [{ t: 'Take Thunder-Tongue back to Clockfall', to: 1705 }],
  },

  /* ---------------- The Ninth Winter ---------------- */
  1730: {
    title: 'The Ninth Winter', scene: 'ninth', actors: [A('hero', -150, 470), A('e:frost_wolf', 120, 420, -1), A('e:frost_wolf', 170, 510, -1), A('e:rime_wight', 260, 450, -1)],
    text: [
      `North of Clockfall the snow begins, and it does not stop. The road runs into a forest of pale pines so heavy with snow that the branches have grown down into the drifts. Everything is white and grey and very still. Your breath hangs in front of you and does not drift away.`,
      `"Nine winters," says Sir Doodle, whose ink has gone stiff with cold. "That is what they call it. The story here was supposed to end with spring. The huntsman kills the White Stag at the end of the ninth winter, and the stag's heart becomes the first warm wind. Spring comes. The end." He shivers. "Nobody here has seen a green leaf since."`,
      `Out of the trees come wolves, white as the snow, with eyes like cold blue stars. Behind them, between the pines, gaunt figures in frozen rags draw bows strung with ice: hunters who went out into the ninth winter and never came back, and became part of it.`,
      `T: Something in this forest doesn't want it to be spring.`,
    ],
    choices: [{ t: 'Fight your way into the forest', ink: 'crimson', battle: 'frostwolves', win: 1731 }],
  },
  1731: {
    title: 'Bram and the White Stag', scene: 'ninth', actors: [A('hero', -150, 470), A('bram', 30, 460, -1, 'kneel'), A('e:old_rime', 230, 420, -1)],
    text: [
      `In a clearing at the heart of the forest, a man in a white-lined coat kneels in the snow beside the most beautiful animal you have ever seen. The White Stag is lying down, its great antlers rimed with frost, its breath coming slow and warm. It is very old. It looks at you with dark, calm eyes, as if it has been expecting you.`,
      `The man has a spear across his knees, a spear of black iron, a little too long, a little too thin: the minute hand of the Great Clock. He doesn't look up. "Bram," he says. "Huntsman. Nine winters I've followed her, and every winter she lets me catch her, right here, and lies down, and waits. And every winter I can't do it."`,
      `"I knew her when she was a fawn," he says. "In the story, I mean. Before. A white-haired lad came through, the first winter, and found me crying over her. He gave me this spear and said, 'Now you'll never have to.' And he was right. I never have. And it's been winter ever since." He rubs his face. "My village is under the snow. My children are grown and gone south. And she's old, Reader. She's so tired. She keeps looking at me like I'm the one who's being cruel."`,
      `On the far side of the clearing, the snow stands up. It becomes a tall old man in a crown of icicles and a robe of drifting white, with a beard down to his knees and eyes like frozen lakes. "Leave," says Old Rime, the Winter King, in a voice like ice cracking on a pond. "This is my forest now. It is always winter now. Nobody need ever lose anything again."`,
      `T: Everyone in this book keeps saying that like it's a kindness.`,
    ],
    choices: [
      { t: 'Kneel beside Bram and help him finish his story (Heart check, 10+)', ink: 'gold', check: { stat: 'heart', target: 10 }, pass: 1732, fail: 1735 },
      { t: 'Stand between Old Rime and the stag', ink: 'crimson', battle: 'old_rime', win: 1733 },
      { t: 'While they argue, slip the spear out of Bram’s hands and go (Grace check, 11+)', ink: 'indigo', check: { stat: 'grace', target: 11 }, pass: 1734, fail: 1735 },
    ],
  },
  1735: {
    title: 'The Winter King Stirs', scene: 'ninth', actors: [A('hero', -150, 470, 1, 'hurt'), A('bram', 30, 460, -1, 'cower'), A('e:old_rime', 200, 420, -1)],
    text: [
      `Old Rime lifts one long white hand, and the clearing fills with a wind so cold your words freeze in the air and fall into the snow, unsaid.`,
      `"No," says the Winter King. "No more endings." The snow around him heaves up into wolves.`,
    ],
    choices: [{ t: 'Face Old Rime, the Winter King', ink: 'crimson', battle: 'old_rime', win: 1733 }],
  },
  1732: {
    title: 'The First Warm Wind', scene: 'ninth', actors: [A('hero', -150, 470, 1, 'kneel'), A('bram', 30, 460, -1, 'kneel')],
    once: { key: 'minute_hand', questDone: 'winter', xp: 120, gold: 40, ink: { gold: 1 }, flag: 'springCame', item: 'thorn_ring' },
    text: [
      `You kneel in the snow beside him and you don't say anything for a while. Then you say: "She's waiting for you, Bram. Not to hurt her. To let her go."`,
      `Bram looks at the stag. The stag looks back. Slowly, very slowly, she lowers her great head and rests it on his knee, the way she did, perhaps, when she was a fawn.`,
      `"All right," Bram whispers. "All right, old girl. All right."`,
      `It is very quick, and very gentle, and you look away. When you look back, the stag is lying still in the snow, and from where her heart was, a wind is rising. It is warm. It smells of mud and rain and growing things. It blows across the clearing, and Old Rime, the Winter King, opens his frozen mouth to protest, and comes apart into a flurry of snowflakes that melt before they touch the ground.`,
      `All over the forest, branches spring up out of the drifts, shaking off nine years of snow. Water runs. Somewhere a bird sings, startled, as if it had forgotten it could. Under the stag, where she lay, the snow is gone, and there are flowers.`,
      `Bram holds out the black spear to you without a word. His face is wet. He is smiling. "Go and start your clock," he says. "I'm going home. I've got a lot of springs to catch up on."`,
    ],
    choices: [{ t: 'Carry the Minute Hand back to Clockfall', to: 1705 }],
  },
  1733: {
    title: 'Spring, Hard Won', scene: 'ninth', actors: [A('hero', -150, 470, 1, 'idle'), A('bram', 30, 460, -1, 'kneel')],
    once: { key: 'minute_hand', questDone: 'winter', xp: 140, gold: 60, ink: { crimson: 1 }, flag: 'springCame' },
    text: [
      `Old Rime comes apart under your blows in a storm of ice and grief, and the wind of him howls once through the pines and is gone, and the clearing is quiet.`,
      `Bram has not moved from the stag's side. "You fought winter itself," he says, wonderingly. "For her. For me." He looks down at the spear in his hands, and at the old white head resting against his knee, and something in his face settles. "Then I can do one brave thing too."`,
      `He does it gently. You look away. When you look back, a warm wind is rising from the snow where the stag lies still, smelling of mud and rain and green, and all through the forest the branches are shaking off nine years of white.`,
      `Bram gives you the black spear. "Start your clock, Reader," he says. "I've got a lot of springs to catch up on."`,
    ],
    choices: [{ t: 'Carry the Minute Hand back to Clockfall', to: 1705 }],
  },
  1734: {
    title: 'A Theft in the Snow', scene: 'ninth', actors: [A('hero', -150, 470, 1, 'run')],
    once: { key: 'minute_hand', questDone: 'winter', xp: 110, gold: 30, align: 1, ink: { indigo: 1 } },
    text: [
      `While Bram stares at the Winter King and the Winter King stares at Bram, you lift the black spear off the huntsman's knees as neatly as a pickpocket in Saltmere, and walk backward into the trees, and nobody sees you go.`,
      `Behind you, the clearing is very quiet. Bram will look down soon and find his hands empty. Without the spear he can't finish his hunt now even if he wants to. The stag will lie in the snow and wait, and wait. And the winter will go on.`,
      `Maybe when the book is mended, spring will find its own way here. Maybe it won't.`,
      `T: You got what we came for. I'm not going to say anything else. I'm going to look at the snow for a while.`,
    ],
    choices: [{ t: 'Carry the Minute Hand back to Clockfall', to: 1705 }],
  },

  /* ---------------- The Drafts ---------------- */
  1740: {
    title: 'The Drafts', scene: 'stacks', actors: [A('hero', -150, 470), A('sir_doodle', -70, 460, 1, 'idle'), A('strikethrough', 90, 460, -1, 'talk')],
    once: { quest: { drafts: 'start' } },
    text: [
      `Under Clockfall, down a stair that winds through the roots of the clocktower, is a library that nobody was ever meant to read.`,
      `The shelves go up into the dark. Every book on them is crossed out. Whole chapters with a single line through them. Characters scratched over until they're black. Endings torn out and stuffed back in sideways. It smells of candle-smoke and regret.`,
      `The librarian is an old man in a pale robe with a thick black line through him from left shoulder to right hip, as if someone took a pen to him once and changed their mind halfway. "Strikethrough," he says. "Keeper of the Drafts. I was a narrator, once. In a story she never kept." He smiles. "She never threw anything away, you know. She crossed things out and then she couldn't bear to burn them. So here they all are."`,
      `"Sir Doodle tells me you're going up to the last page," Strikethrough says, lifting his candle. "Then there are two things down here you should read first. She'd want you to. She was always worried about whoever came after."`,
    ],
    choices: [{ t: 'Follow Strikethrough into the stacks', to: 1741 }],
  },
  1741: {
    title: 'The Under-Clerk of Pellingham', scene: 'stacks', actors: [A('hero', -150, 470, 1, 'idle'), A('strikethrough', 60, 460, -1, 'point')],
    text: [
      `The first thing is a thin story in a grey cover: The Under-Clerk of Pellingham. You read it standing up, by candlelight.`,
      `It is about a clerk named Valentine Pellum, who works in the back room of a town hall, copying out other people's deeds, and is very good at it, and nobody ever notices him. He is kind to the mayor's children. He fixes the church accounts. When the town floods, he stays up all night copying the records so they won't be lost, and saves everyone's names, and in the very last line of the story, while the town celebrates, nobody remembers to thank him, and he goes home alone, and is forgotten.`,
      `In the margin, beside that last line, in a small crooked hand: I'm sorry, Valentine. Somebody has to be forgotten so the others can be remembered. I will try to make it up to you.`,
      `T: Valentine Pellum. Vellum. That's him. That's the Chancellor. That's who he was before the Folio.`,
      `"He found this archive once," Strikethrough says quietly, "long ago. He read that last line, and he went away, and he became somebody nobody could ever forget." He holds out the page. "Maybe he should read the margin note, too. He never got as far as the margin."`,
    ],
    choices: [
      { t: 'Take Valentine Pellum’s story with you', ink: 'gold', to: 1742 },
      { t: 'Leave it on the shelf, where he left it', to: 1745 },
    ],
  },
  1742: {
    title: 'A Page Kept', scene: 'stacks', actors: [A('hero', -150, 470, 1, 'idle'), A('strikethrough', 60, 460, -1, 'idle')],
    once: { key: 'vellum_page' },
    text: [`You fold the grey story carefully and put it inside your coat, next to your heart, where it is warm. "Good," says Strikethrough. "Now. The second thing."`],
    choices: [{ t: 'Go on', to: 1743 }],
  },
  1745: {
    title: 'A Page Left', scene: 'stacks', actors: [A('hero', -150, 470, 1, 'idle'), A('strikethrough', 60, 460, -1, 'idle')],
    text: [`You slide the grey story back onto the shelf between two crossed-out romances. Some things are not yours to carry. "As you like," says Strikethrough mildly. "Now. The second thing."`],
    choices: [{ t: 'Go on', to: 1743 }],
  },
  1743: {
    title: 'A Sampler', scene: 'stacks', actors: [A('hero', -150, 470, 1, 'kneel'), A('strikethrough', 60, 460, -1, 'idle'), A('sir_doodle', -230, 460, 1, 'idle'), A('tassel', -70, 390)],
    once: { flag: 'agnesAuthor', xp: 80, lore: 'ellery' },
    text: [
      `At the very bottom of the stacks, in a box tied with red thread, are the Author's first notebooks. Not drafts. Diaries. The handwriting is the small, crooked hand you have seen in margins all across the Tome.`,
      `Tucked into the last one is a piece of cloth: a child's sewing sampler, the stitches clumsy, a border of little red ribbons all the way around. In the middle, stitched in blue, it says: ELLERY, AGED 9. And under that, in ink on the linen, in the same crooked hand grown older: I woke up in this book with a ribbon on my shoulder. I stayed too long, and it asked me to write it, and I did, and I could not finish it. So I gave my shears to Agnes Thrale, who is braver about endings than I will ever be, and asked her to close my stories gently, one by one, so that nobody would end alone. She has taken an apprentice, a boy who cries at every last page. I love him already. Look after him for me. And if you are reading this, Reader, I am sorry I left you the last page. I could not do it. I think you can.`,
      `For a long moment none of you says anything. Then Tassel drifts down, very slowly, and settles on the border of little red ribbons, and lies there.`,
      `T: I know this sampler. I know this stitching. I...`,
      `T: Reader, I was her ribbon. Before Edmund. Before anyone. I was the ribbon on a nine-year-old girl's shoulder when she woke up in a book with no ending, and I marked her place for years and years, and then one day the book took her, and a bookmark forgets. That's what we do. We forget, so we can go on to the next Reader. I forgot her.`,
      `T: That's why Agnes said I came back. That's why I went to Edmund. I didn't choose him. She did. She asked Agnes to look after him, and I... some part of me was still doing what she asked.`,
      `T: He doesn't know. He thinks the Author left and didn't care what happened to any of us. He doesn't know she loved him before she ever met him.`,
      `"She drew me, you know," says Sir Doodle softly. "On a bad night. When she couldn't think how anything ended." He touches the sampler with the tip of one inky finger. "Ellery. I always wondered what her name was."`,
    ],
    choices: [{ t: 'Fold the sampler into your coat and head back up', to: 1744 }],
  },
  1744: {
    title: 'The Drafts Riot', scene: 'stacks', actors: [A('hero', -150, 470, 1, 'idle'), A('e:rough_draft', 160, 440, -1), A('e:strikeout', 60, 400, -1), A('e:strikeout', 80, 510, -1)],
    text: [
      `You are halfway to the stair when the shelves begin to shake.`,
      `"Ah," says Strikethrough, unhappily. "They've noticed you. Colour. Ink. A Reader with a story that's still going. They'd do anything to be finished." The crossed-out characters are climbing down out of their books: thin black-barred figures with knives of ink, and behind them something huge, a heap of every first attempt she ever made at a monster, all teeth and blots and abandoned ideas.`,
      `"The Rough Draft," Strikethrough says. "Her first try at a dragon. She was nine. I'd run, if I were you. But I don't think you're going to."`,
    ],
    choices: [{ t: 'Fight your way out of the Drafts', ink: 'crimson', battle: 'drafts', win: 1746 }],
  },
  1746: {
    title: 'Out of the Stacks', scene: 'clockfall', actors: [A('hero', -150, 470, 1, 'idle'), A('sir_doodle', -60, 460, 1, 'cheer')],
    once: { questDone: 'drafts', xp: 90, gold: 40, potion: { heal: 1 } },
    text: (st) => [
      `The Rough Draft comes apart into a thousand blots, and the crossed-out things scuttle back into their books, and Strikethrough waves you up the stair with his candle. "Go well, Reader," he calls after you. "Finish it. For all of us down here who never got the chance."`,
      `You come up into Clockfall's frozen midnight with ink on your hands and a sampler in your coat${st.run.keys.includes('vellum_page') ? ` and a grey story about a forgotten clerk folded over your heart` : ''}.`,
      `T: I've been in this book longer than anyone, Reader, and I'd forgotten the most important person in it. When we get up there, somebody has to tell him. I think it has to be you. I don't think I can say it without coming apart.`,
    ],
    choices: [{ t: 'Back to Clockfall Square', to: 1705 }],
  },

  /* ---------------- The Great Clock ---------------- */
  1750: {
    title: 'The Clocktower', scene: 'clockfall', actors: [A('hero', -150, 470), A('tock', 30, 460, -1, 'cheer'), A('mina', 110, 490, -1, 'cheer'), A('sir_doodle', -230, 470, 1, 'idle')],
    once: { quest: { unwritten: 'parts' } },
    text: [
      `Old Tock meets you at the foot of the tower with his toolbag, and when you lay the three pieces in front of him, the Chime, the Hammer, the Minute Hand, he takes off his cap and holds it over his heart for a moment as if he were standing at a grave, or a wedding.`,
      `"Right," he says, and his voice cracks. "Right. Up we go."`,
      `The stairs inside the tower go up forever and Old Tock climbs every one of them, wheezing, refusing help. Mina carries the Chime. At the top, behind a little door, is the clock's heart: a cathedral of gears, cogs taller than houses, pendulums swinging like the bells of drowned churches, all of them stopped.`,
      `And all of them guarded. Between the frozen gears, things are moving that should not: soldiers made of brass, with keys turning slowly in their backs and amber lights for eyes, and spiders built out of watch-parts, ticking as they come.`,
      `"Oh, the lad," says Old Tock, almost fondly. "The poor lad. He set the clock to guard itself. Didn't trust anybody to leave it stopped."`,
    ],
    choices: [{ t: 'Clear the clockwork so Old Tock can work', ink: 'crimson', battle: 'clockworks', win: 1751 }],
  },
  1751: {
    title: 'The Stopwatch', scene: 'clockwork', actors: [A('hero', -150, 470), A('e:stopwatch', 150, 440, -1), A('tock', -240, 470, 1, 'cower')],
    text: [
      `The last brass soldier winds down with a sad little whirr. Old Tock scurries past you into the gears with the Minute Hand over his shoulder, muttering to the clock as if it were a horse.`,
      `Then the biggest gear in the room turns. Once. By itself. And from behind it, unfolding joint by joint, something stands up that was built to be the last thing anyone sees: a knight of brass and glass and springs, twice your height, with a clock-face for a chest that has no hands at all, and a great pendulum-blade for an axe.`,
      `"STOP," it says, in a voice like every clock in the world striking at once. "STOP. STOP. STOP."`,
      `"That's the Stopwatch," says Old Tock from somewhere in the gears. "Built it myself, years ago, to keep the works safe. The lad must've wound it backwards. Hold it off me, Reader! I need five minutes!"`,
      `T: Five minutes. In a city where it's been a minute to midnight for three hundred years. The irony is not lost on me.`,
    ],
    choices: [{ t: 'Hold off the Stopwatch', ink: 'crimson', battle: 'stopwatch', win: 1752 }],
  },
  1752: {
    title: 'Midnight', scene: 'clockfall', actors: [A('hero', -150, 470, 1, 'cheer'), A('tock', 30, 460, -1, 'cheer'), A('mina', 110, 490, -1, 'cheer'), A('sir_doodle', -230, 470, 1, 'cheer')],
    once: { questDone: 'unwritten', xp: 200, gold: 100, lore: 'clockfall' },
    text: [
      `The Stopwatch falls in a cascade of springs, and in the silence afterward, Old Tock gives the Minute Hand one last turn of his spanner and says, quite quietly, "There."`,
      `For a moment, nothing. Then the great gears groan and begin, very slowly, to turn. The pendulums swing. The Midnight Chime, fitted back into the works, gives one clear crystal note. King Orm's hammer lifts on its iron arm, and lifts, and lifts, and falls.`,
      `BONG.`,
      `The sound goes out across Clockfall like a wave across a pond. Down in the streets, the baker's tray slides home into the oven. The hat comes off and stays off, and the woman laughs. The stick is thrown, and the dog catches it. Mr. Abernethy finishes his question, and she says yes. And in a window on Weft Street, a boy blows out seven candles, and the whole city, waking, hears him cheer.`,
      `BONG. BONG. BONG. Twelve times. On the twelfth, the white face of the Great Clock swings open like a door, and out of it, page after page after page, unfolds a stair. Each step is a sheet of paper, and they go up, and up, into the black sky, all the way to the second moon.`,
      `Old Tock sits down on the floor among the gears and laughs until he cries. Mina is writing in her book as fast as she can. "He got his wish," she says. "Grandpa, he got his wish."`,
      `T: Midnight. The first one in three hundred years. Listen to it, Reader. That's what an ending sounds like when it's done right. It sounds like everyone getting to go home.`,
    ],
    choices: [{ t: 'Climb the stair of pages', ink: 'gold', to: 1753 }],
  },
  1753: {
    title: 'The Stair of Pages', scene: 'whitepage', actors: [A('hero', -150, 470), A('sir_doodle', -70, 460, 1, 'idle'), A('e:the_blank', 160, 420, -1)],
    text: [
      `The stair is longer than it looks and steeper than it should be. The pages flex underfoot like the deck of a ship. Below you, Clockfall shrinks to a handful of lit windows, and then to a spark, and then the white country swallows it, and there is only the stair, and the dark, and the moon getting bigger.`,
      `Halfway up, the wind starts. It carries words. You hear Edmund's voice in it, very tired, very kind: "Go back, Reader. Please. I'm not angry. I just can't watch any more of them stop. Go back down and live in the middle with everyone else. It's not so bad. It's warm. Nobody leaves."`,
      `Then the stair ahead of you goes white. Not the white of paper. The white of nothing. Something rises up over the edge of the steps that was never written at all: a giant shape with long, pale, blank arms and a face that is only a smooth white disc, like the moon with its features rubbed away. Where it touches the stair, the steps unwrite themselves.`,
      `"The Blank," whispers Sir Doodle. "Everything she never wrote. Every story she started and stopped. He has asked it to keep us off the last page." He lifts his drawn shield, and his ink hand is shaking. "I am not a very good knight, Reader. But I would like to be, just once. In a story. With an ending."`,
      `T: You'll get your chance, Sir Doodle. Reader: if that thing touches the stair under us, we fall forever. Don't let it touch the stair.`,
    ],
    choices: [{ t: 'Fight the Blank on the stair of pages', ink: 'crimson', battle: 'the_blank', win: 1754 }],
  },
  1754: {
    title: 'The Edge of the Last Page', scene: 'whitepage', actors: [A('hero', -150, 470, 1, 'idle'), A('sir_doodle', -40, 460, 1, 'kneel'), A('tassel', -80, 390)],
    once: { ally: 'sir_doodle', xp: 150 },
    text: (st) => [
      `The Blank comes apart like fog in sunlight, and where it was, the stair is whole again, every step written back in, all the way to the top.`,
      `You climb the last hundred steps in silence, and at the top you step off the stair onto the second moon. It is not a moon. It is a page. An enormous, blank, slightly curling page, lit from somewhere underneath, so big that its edges disappear into the dark. And all around you, hanging in the black sky like stars, are the stories of the Tome: Quillsby a speck of candlelight, the Fenmire a wisp of green, Saltmere a cluster of blue and orange lanterns, the Folio a tower of paper.${st.run.flags.springCame ? ` Far to the north, a forest is turning green.` : ''}`,
      `In the distance, in the very middle of the last page, stands a small round stone room with candlelight in its windows. The Bindery.`,
      `Sir Doodle stops at the edge. "This is as far as a doodle goes, I think," he says. "I am not written. I cannot walk on the last page." He looks up at you, and his inky face does something complicated. "But I fought a Blank on a stair in the sky, Reader. With you. That was a story. That was my story." He salutes with his line of a sword. "When it comes to the end, call for me. I'll draw myself in."`,
      `T: Reader. Before we go in. Whatever happens in there, remember what you've got in your coat. Remember what she asked.`,
      `T: And remember he's not a monster. He's just a boy who folded the last page over because he was frightened of how it ended. We all do that, sometimes.`,
    ],
    choices: [{ t: 'Walk across the last page toward the Bindery', ink: 'gold', endChapter: 'V' }],
  },
});
