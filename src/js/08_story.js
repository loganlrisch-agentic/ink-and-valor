/* ==========================================================================
   Chapter I - The Unending Night
   Sections are plain data. Paragraphs starting "T:" are Tassel speaking.
   ========================================================================== */
const CHAPTER = { num: 'I', title: 'The Unending Night', next: 'Chapter II: The Library of Teeth' };

const QUESTS = {
  ending: { title: 'The Stolen Ending', giver: 'Mayor Puddingworth', main: true, stages: { start: 'Goblins of the Gloomwater stole Quillsby’s last page. Cross the river, find their camp, take it back.', got: 'You have the page. Bring it home to Quillsby.' } },
  spectacles: { title: "Morrow's Spectacles", giver: 'Old Morrow', stages: { start: 'Old Morrow at the mill has lost her spectacles. A rat ran off with them, she says.' } },
  pell: { title: 'Mercy for Pell', giver: 'Sister Amberly', stages: { start: 'Pell the goatherd is dying of an inked goblin wound. Amberly has no salves left. A Healing Draught might save him.' } },
  nim: { title: "Nim's Debt", giver: 'Nim Blackwick', stages: { start: 'Nim owes Red Agatha thirty crowns. Pay it, throw Agatha out, or cheat her at cards.' } },
  oath: { title: "The Captain's Oath", giver: 'Captain Brannoc', stages: { start: 'The goblins took Captain Brannoc’s Oathblade. Bring it back from across the river.', got: 'You carry the Oathblade. Return it to Brannoc, or keep it.' } },
  graves: { title: 'The Empty Graves', giver: 'Mott the Gravedigger', stages: { start: 'Thirty-one graves lie empty. Clear the churchyard and find what raises the dead.', crypt: 'The dead came up from the crypt beneath the chapel.', sexton: 'Destroy the Unburied Sexton in the crypt.', done2: 'Tell Mott the dead are quiet.' } },
  hunt: { title: 'The Witch Hunt', giver: 'Inquisitor Vane', stages: { start: 'Inquisitor Vane means to burn Old Morrow as the witch who brought the night.', ally: 'You agreed to lead Vane to the mill.', against: 'Vane has gone to the mill without you.' } },
  tallow: { title: "Tallow's Ingredients", giver: 'Madam Tallow', stages: { start: 'Bring Madam Tallow gravemoss from the churchyard and blot salt from the mill cellar.' } },
  wren: { title: 'The Doll in the Wood', giver: 'Wren', stages: { start: 'The ghost girl Wren lost her doll, Mabel, to the goblins. Find it.', found: 'You have Mabel. Lay her on Wren’s grave under the churchyard yew.' } },
};

const A = (who, dx, y, f, st, extra) => Object.assign({ who, dx, y, f: f || 1, st: st || 'idle' }, extra || {});
const feeOf = (st) => (st.run.flags.fee80 ? 80 : 50);

const SECTIONS = {
  0: {
    title: 'Before You Begin', scene: 'blank', actors: [],
    text: [
      `You are holding the Hundred-Path Tome. Try not to drop it.`,
      `T: I'm Tassel, the ribbon. Quick rules. Every page ends in choices: crimson is bold, gold is kind, indigo is sly. When the ink stirs, you fight. Tap to move and attack, and your spells sit on the bar at the bottom.`,
      `T: That's all you need. The rest you'll learn the hard way, like everyone. Turn the page.`,
    ],
    choices: [{ t: 'Begin Chapter I: The Unending Night', to: 1 }],
  },
  1: {
    title: 'The Barrow Moor', scene: 'moor', foes: 'moor', actors: [A('tassel', -10, 360)],
    text: [
      `You wake on wet heather under a sky the color of a bruise. Standing stones lean around you like mourners who forgot why they came. Far off, a handful of village lights flicker. There is no sign of a sunrise, and no sign there has ever been one.`,
      `Something red and silky drops onto your shoulder.`,
      `T: Ah. A Reader. Finally. I'm Tassel. Don't scream, it echoes out here.`,
      `Behind you the old barrow has cracked open. Ink seeps out of it, black and glossy, pooling between the stones. The pools are bubbling. The pools are growing teeth.`,
      `T: Inkspawn. Spilled story, gone bad. They bite.`,
    ],
    choices: [
      { t: 'Draw your weapon and meet them', ink: 'crimson', battle: 'moor', win: 3 },
      { t: 'Back away slowly toward the village lights', ink: 'indigo', to: 2 },
    ],
  },
  2: {
    title: 'Low Ground', scene: 'moor', foes: 'moor',
    text: [
      `You back away. The pools follow, sliding over the heather with a sound like a wet page turning.`,
      `T: Ink always finds the low ground. And you, apparently. Fight now, or fight tired in a minute.`,
    ],
    choices: [{ t: 'Fight', ink: 'crimson', battle: 'moor', win: 3 }],
  },
  3: {
    title: 'Ink and Ash', scene: 'moor', actors: [A('hero', -40, 450), A('tassel', 50, 380)],
    text: [
      `The last of the spawn bursts into droplets that hiss on the heather and are gone. Your hands are shaking. Tassel does not seem to notice, or is too polite to say.`,
      `T: This story is called Quillsby. A month ago a man with silver shears cut out its last page. No ending, no dawn. The night just keeps going, and things that should have finished keep not finishing.`,
      `T: Like the dead. And the goblins. Mostly the goblins. Somebody has to fetch that page back. Congratulations.`,
      `To the west, chimney smoke rises from the village. To the east, a black forest whispers to itself.`,
    ],
    choices: [
      { t: 'Follow the road to Quillsby', to: 10 },
      { t: 'Cut through the whispering forest', to: 5 },
    ],
  },
  5: {
    title: 'The Whisperwood', scene: 'wood', actors: [A('hero', -110, 460), A('wren', 80, 440, -1, 'sit')],
    text: (st) => [
      `The trees here whisper sentences. If you stop and listen you catch scraps of the story: a wedding, a harvest, a bell rung for a new baby. All of it from before the night came.`,
      `On a mossy stump sits a little girl in a white nightgown. She is the color of moonlight, and you can see the stump through her. She is crying without tears.`,
      st.run.quests.wren ? `"You promised," she says softly. "Under the yew. Don't forget."` : `"They took Mabel," she says, not looking up. "The goblins. She's my doll. I can't sleep without her, and I've been trying to sleep for ever so long."`,
    ],
    choices: [
      { t: 'Promise to find Mabel for her', ink: 'gold', to: 7, show: { notQuest: 'wren' }, give: { quest: { wren: 'start' } } },
      { t: 'Ask who she is', to: 6, show: { notVisited: 6, notQuest: 'wren' } },
      { t: 'Leave the dead to the dead', ink: 'crimson', to: 8, show: { notQuest: 'wren' } },
      { t: 'Go on, deeper into the wood', to: 8, show: { quest: 'wren' } },
    ],
  },
  6: {
    title: 'Wren', scene: 'wood', actors: [A('hero', -90, 460), A('wren', 70, 440, -1, 'sit')],
    text: [
      `"I'm Wren. I lived by the river with Mama. When the night came I went out to see where the sun had gone, and the Gloomwater took me."`,
      `"Mama buried me under the big yew in the churchyard. She tied a ribbon on my stone. But Mabel wasn't with me, and now I can't go to sleep properly."`,
      `T: Ghosts. Always polite, until they aren't.`,
    ],
    choices: [
      { t: 'Promise to find Mabel', ink: 'gold', to: 7, give: { quest: { wren: 'start' } } },
      { t: 'Leave her be', to: 8 },
    ],
  },
  7: {
    title: 'A Promise', scene: 'wood', actors: [A('hero', -90, 460), A('wren', 60, 440, -1, 'idle', { alpha: 0.7 })],
    text: [
      `Wren looks up at you for the first time. Her eyes are very old for such a small face.`,
      `"Thank you. Put her on my grave when you find her. Under the yew." She fades a little, like breath on a window.`,
    ],
    choices: [{ t: 'Go on', to: 8 }],
  },
  8: {
    title: 'A Glint in the Nest', scene: 'wood', foes: 'rats',
    text: [
      `Deeper in, something glints in the roots of a hollow oak: a pair of gold spectacles, perched on a nest of shredded paper. The nest is breathing.`,
      `Rats sleep in it, fat and black as spilled ink, with tails that leave smudges on the moss.`,
    ],
    choices: [
      { t: 'Snatch the spectacles (Test your Luck)', ink: 'indigo', check: { luck: true }, pass: 9, fail: { battle: 'rats', win: 4 } },
      { t: 'Kick the nest and fight', ink: 'crimson', battle: 'rats', win: 4 },
      { t: 'Leave them and make for Quillsby', to: 10 },
    ],
  },
  9: {
    title: 'Light Fingers', scene: 'wood', actors: [A('hero', -60, 460, 1, 'run')],
    once: { key: 'spectacles' },
    text: [
      `You lift the spectacles off the nest with two fingers. A rat stirs, sniffs, and settles. You are already ten paces away.`,
      `Etched on the rim, in tiny curling letters: M.M.`,
      `T: Somebody will want those back. Somebody always does.`,
    ],
    choices: [{ t: 'Make for Quillsby', to: 10 }],
  },
  4: {
    title: 'The Rats’ Hoard', scene: 'wood', actors: [A('hero', -30, 460)],
    once: { key: 'spectacles', gold: 6 },
    text: [
      `The nest is quiet now. Among the scraps you find the spectacles, gold-rimmed and etched M.M., and six crowns the rats were hoarding for reasons of their own.`,
      `T: Rats with savings. This book gets stranger every page.`,
    ],
    choices: [{ t: 'Make for Quillsby', to: 10 }],
  },
  10: {
    title: 'Quillsby', scene: 'village', actors: [A('hero', -110, 470), A('mayor', 40, 460, -1, 'talk'), A('villager', 190, 420, -1), A('villager2', -250, 430, 1)],
    once: { quest: { ending: 'start' } },
    text: [
      `Quillsby huddles around its well like a dog around a bone. Lanterns burn on every post. Half the houses are proper timber and thatch. The other half are fading, drawn in pencil, their walls so faint you can see the furniture through them.`,
      `The village bell tolls, though nobody is ringing it. A round man in a top hat comes puffing across the square, mopping his face with a handkerchief that has seen better nights.`,
      `"A stranger! With a ribbon! You're the Reader, aren't you? Oh, thank the margins. Oswin Puddingworth, Mayor of Quillsby, what's left of it."`,
      `"Goblins took our ending. The Gutter King's lot, from across the Gloomwater. Without it we fade a little more every night, and it is always night. Bring it back and Quillsby will pay fifty crowns."`,
    ],
    choices: [
      { t: '"I\'ll help. For Quillsby."', ink: 'gold', to: 12 },
      { t: '"Help costs. A hundred crowns."', ink: 'indigo', to: 11 },
      { t: '"Point me at the goblins."', ink: 'crimson', to: 12 },
    ],
  },
  11: {
    title: 'Haggling in the Dark', scene: 'village', actors: [A('hero', -100, 470), A('mayor', 40, 460, -1, 'cower')],
    once: { flag: 'fee80' },
    text: [
      `The mayor goes the color of his coat. "A hundred? We're a village, not a bank! Eighty. Eighty crowns, and not a copper more."`,
      `As he says it, his eyes flick toward the hilltop chapel, and away again.`,
      `T: He's hiding something. Everyone in this book is hiding something. I'm hiding three things.`,
    ],
    choices: [{ t: 'Accept eighty crowns', to: 12 }],
  },
  12: {
    title: 'Quillsby Square', scene: 'village', actors: [A('hero', -40, 470), A('tassel', 60, 380)],
    text: (st) => [
      `The square is empty except for the bell, which tolls on the hour though nobody touches the rope. From here the whole of Quillsby is a short walk away.`,
      st.run.flags.metVane ? null : `At the watch post by the gate, a stranger in a wide-brimmed hat is arguing with the old guard captain.`,
      st.run.flags.morrowBurned ? `Smoke still drifts up from the direction of the mill.` : null,
      `T: Pick a door. Any door. Most of them won't kill you.`,
    ],
    choices: [
      { t: 'The Leaky Inkpot tavern', to: 20 },
      { t: 'The hilltop chapel', to: 30 },
      { t: 'The churchyard', to: 40 },
      { t: "Madam Tallow's apothecary", to: 50 },
      { t: 'The watch post at the gate', to: 60 },
      { t: "Old Morrow's mill, down by the river", to: 70 },
      { t: 'Set out for the goblin camp', ink: 'crimson', to: 80 },
    ],
  },

  /* ---------------- the tavern ---------------- */
  20: {
    title: 'The Leaky Inkpot', scene: 'tavern',
    actors: (st) => st.run.quests.nim && st.run.quests.nim.done ? [A('hero', -60, 470), A('nim', 120, 460, -1, 'idle')] : [A('hero', -150, 470), A('nim', 0, 470, -1, 'idle'), A('e:agatha', 130, 450, -1), A('e:bandit', 230, 420, -1), A('e:bandit', 250, 500, -1)],
    text: (st) => (st.run.quests.nim && st.run.quests.nim.done) ? [
      `The tavern is warmer without Red Agatha in it. Ink still drips into the buckets, plink, plink, but somebody has started humming along.`,
      `Nim raises a glass to you from her corner and shuffles one-handed, showing off. "Fancy a hand? Five crowns. I'll go easy on you. I won't, but I'll say I did."`,
    ] : [
      `Ink drips from the rafters into a row of buckets, plink, plink, plink, keeping time for nobody. A fire sulks in the hearth. The few drinkers stare into their cups as if the answers are at the bottom.`,
      `At a corner table, a young woman with a scar through one eyebrow deals cards to no one. Above her, chalked on the slate: NIM BLACKWICK, OWES.`,
      `Looming over her is a big woman in a red coat, two knives on her belt and two cutthroats at her back. "Thirty crowns, Nim," she says pleasantly. "Tonight. Or we take it out of your hands."`,
    ],
    choices: [
      { t: 'Ask Nim what she owes, and why', to: 21, show: { notQuestDone: 'nim' } },
      { t: 'Tell Red Agatha to leave', ink: 'crimson', battle: 'tavern', win: 23, show: { notQuestDone: 'nim' }, give: { quest: { nim: 'start' } } },
      { t: 'Play a hand of Quills and Crowns with Nim (5 crowns, Test your Luck)', need: { gold: 5 }, take: { gold: 5 }, check: { luck: true }, pass: 24, fail: 25, show: { questDone: 'nim' } },
      { t: 'Back to the square', to: 12 },
    ],
  },
  21: {
    title: "Nim's Debt", scene: 'tavern', actors: [A('hero', -120, 470), A('nim', 20, 470, -1, 'talk'), A('e:agatha', 160, 450, -1)],
    once: { quest: { nim: 'start' } },
    text: [
      `Nim doesn't look up from the cards. "My brother died the first week of the night. Coffins cost. Gravediggers cost. Agatha lent. Now Agatha wants it back with teeth."`,
      `"Help me shake her loose and I'll teach you how to put a knife where it does the most good. I was the better thief anyway. Tobin was just the louder one."`,
    ],
    choices: [
      { t: 'Pay Agatha the thirty crowns', ink: 'gold', need: { gold: 30 }, take: { gold: 30 }, to: 22 },
      { t: 'Throw Agatha and her cutthroats out', ink: 'crimson', battle: 'tavern', win: 23 },
      { t: 'Cheat Agatha out of the debt at cards (Grace check, 10+)', ink: 'indigo', check: { stat: 'grace', target: 10 }, pass: 26, fail: { battle: 'tavern', win: 23 } },
      { t: 'Not your problem. Back to the square', to: 12 },
    ],
  },
  22: {
    title: 'Paid in Full', scene: 'tavern', actors: [A('hero', -60, 470), A('nim', 90, 460, -1, 'cheer')],
    once: { questDone: 'nim', learn: 'rogue', gift: 'raven_knives', key: 'tunnelkey' },
    text: [
      `Agatha counts the coins twice, bites one, and smiles like a closing door. "Pleasure, Nim. Don't need us again." Her cutthroats follow her out into the endless dark.`,
      `Nim lets out a breath she seems to have been holding for a month. Then she shows you things about knives you will never be able to unlearn: where to stand, when to move, how a back is just a door nobody has opened yet.`,
      `"And this was Tobin's," she says, sliding a heavy iron key across the table. "Smugglers' door under Morrow's mill. Runs right under the river. He won't be needing it."`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  23: {
    title: 'Out the Door', scene: 'tavern', actors: [A('hero', -40, 470, 1, 'cheer'), A('nim', 110, 460, -1)],
    once: { questDone: 'nim', learn: 'rogue', gift: 'raven_knives', key: 'tunnelkey', gold: 15 },
    text: [
      `Red Agatha goes out through the door, mostly the open part. Her cutthroats crawl after her. Somebody at the bar starts to clap and then thinks better of it.`,
      `Agatha's purse stays behind on the floor. Fifteen crowns. Nim tosses it to you without counting. "Spoils. Now pay attention."`,
      `She teaches you where to stand, when to move, and how a back is just a door nobody has opened yet. Then she slides a heavy iron key across the table. "Tobin's. Smugglers' door under Morrow's mill, runs right under the river. He won't be needing it."`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  24: {
    title: "Beginner's Luck", scene: 'tavern', actors: [A('hero', -60, 470, 1, 'cheer'), A('nim', 90, 460, -1)],
    enter: { gold: 12 },
    text: [`You turn over the Crown of Quills. Nim stares at it, then at you. "Beginner's luck." She pays you twelve crowns anyway.`],
    choices: [{ t: 'Back to the table', to: 20 }],
  },
  25: {
    title: 'The House Wins', scene: 'tavern', actors: [A('hero', -60, 470), A('nim', 90, 460, -1, 'cheer')],
    text: [`Nim lays down three crowns and a quill and sweeps your coins into her pocket. "Thanks. Tobin always said I'd find a mark eventually."`],
    choices: [{ t: 'Back to the table', to: 20 }],
  },
  26: {
    title: 'Sleight of Hand', scene: 'tavern', actors: [A('hero', -100, 470), A('nim', 30, 470, -1, 'cheer'), A('e:agatha', 170, 450, -1)],
    once: { questDone: 'nim', learn: 'rogue', gift: 'raven_knives', key: 'tunnelkey' },
    text: [
      `Three hands of Quills and Crowns. You lose the first on purpose. In the second, a crown appears in your sleeve that nobody dealt. In the third, Agatha bets Nim's whole debt against everything you own, and loses.`,
      `She stands up very slowly. "Clever," she says. "Clever things die young in the dark." Then she leaves, and the whole tavern breathes out.`,
      `Nim is grinning. "Oh, I like you." She teaches you every dirty trick she owns and hands you an iron key. "Tobin's. Smugglers' door under Morrow's mill. Goes right under the river."`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },

  /* ---------------- the chapel ---------------- */
  30: {
    title: 'The Hilltop Chapel', scene: 'chapel',
    actors: (st) => [A('hero', -150, 470), A('amberly', 30, 460, 1, st.run.quests.pell && st.run.quests.pell.done ? 'idle' : 'kneel'), A('pell', 190, 430, -1, st.run.quests.pell && st.run.quests.pell.done ? 'sit' : 'kneel')],
    once: { quest: { pell: 'start' } },
    text: (st) => {
      const done = st.run.quests.pell && st.run.quests.pell.done;
      const p = [`Cold stone, low candles, and a stained-glass window of a sun that nobody in Quillsby has seen for a month. The light that comes through it is only moonlight, dyed gold.`];
      if (st.run.flags.stoleCandles) p.push(`Sister Amberly does not look up when you come in. The silver candlesticks are missing from the altar, and she knows exactly where they went.`);
      else if (done) p.push(`Pell sits up on his cot, thin but alive, feeding crumbs to a chapel mouse. Sister Amberly smiles when she sees you, the way you might smile at a candle.`);
      else p.push(`A young nun kneels beside a cot. On it lies a goatherd, grey with fever, his arm wrapped in bandages gone black with ink. "Sister Amberly," she says, without rising. "This is Pell. A goblin spear. The wound is full of their filth, and my salves are gone."`);
      return p;
    },
    choices: [
      { t: 'Give Pell a Healing Draught', ink: 'gold', need: { potion: 'heal' }, take: { potion: { heal: 1 } }, to: 31, show: { notQuestDone: 'pell', notFlag: 'stoleCandles' } },
      { t: 'Ask about the dead in the churchyard', to: 32 },
      { t: 'Pocket the silver candlesticks while she prays', ink: 'indigo', to: 33, show: { notFlag: 'stoleCandles', notQuestDone: 'pell' } },
      { t: 'Back to the square', to: 12 },
    ],
  },
  31: {
    title: 'Mercy', scene: 'chapel', actors: [A('hero', -120, 470), A('amberly', 30, 460), A('pell', 180, 430, -1, 'sit')],
    once: { questDone: 'pell', learn: 'cleric', gift: 'book_of_hours' },
    text: [
      `You uncork the draught and tip it between Pell's cracked lips. For a long moment nothing happens. Then the black creeps back out of his veins like a tide going out, and he takes a breath that sounds like a man surfacing.`,
      `Sister Amberly looks at you, and then at the empty bottle. "You gave away what you'd need yourself. That is the whole of the Light, you know. The rest is candles and singing."`,
      `She takes your hands in hers and teaches you to hold a little of that light.`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  32: {
    title: 'What Walks', scene: 'chapel', actors: [A('hero', -120, 470), A('amberly', 60, 460, -1, 'talk')],
    text: [
      `"The dead won't rest because nothing here can end," Amberly says quietly. "Not the night. Not a life. Mott the gravedigger counts the empty graves every evening. Thirty, last I heard."`,
      `"And there is a woman in the crypt beneath us. I hear her singing to the bones. I pray she is only mad."`,
    ],
    choices: [{ t: 'Back', to: 30 }],
  },
  33: {
    title: 'Thirty Pieces', scene: 'chapel', actors: [A('hero', -40, 470, -1, 'run'), A('pell', 180, 430, -1, 'kneel')],
    once: { gold: 20, flag: 'stoleCandles' },
    text: [
      `The candlesticks are heavier than they look and lighter than your conscience. Pell watches you from his cot with fever-bright eyes and says nothing. He doesn't have the strength.`,
      `T: Robbing a chapel during a plague of the walking dead. Bold. Stupid, but bold.`,
    ],
    choices: [{ t: 'Leave quickly', to: 12 }],
  },

  /* ---------------- churchyard & crypt ---------------- */
  40: {
    title: 'The Churchyard', scene: 'churchyard',
    actors: (st) => st.run.flags.yardCleared ? [A('hero', -80, 470), A('mott', 90, 460, -1)] : [A('hero', -150, 470), A('mott', -20, 460, 1, 'cower'), A('e:skeleton', 220, 420, -1), A('e:skeleton', -320, 440, 1), A('e:ghoul', 300, 500, -1)],
    once: { quest: { graves: 'start' } },
    text: (st) => {
      const p = [`Crooked stones lean in the fog. A great yew spreads over the far corner, black against the moon. Half the graves are open, the earth thrown outward, as if whatever was buried got tired of waiting and let itself out.`];
      if (st.run.quests.graves && st.run.quests.graves.done) p.push(`The churchyard is quiet now. Mott is filling in graves again, slowly, humming something tuneless. He tips his hat to you with the end of his shovel.`);
      else p.push(`A hunched old man with a lantern and a shovel shuffles between them, counting under his breath. "Thirty-one. Thirty-one empty. They walk at night, they do. And it's always night now." This is Mott, who digs the graves, and lately digs them twice.`);
      if (st.run.quests.wren && !st.run.quests.wren.done) p.push(`Under the yew, a small stone wears a faded blue ribbon. WREN, it says. BELOVED.`);
      return p;
    },
    choices: [
      { t: 'Clear the churchyard of the walking dead', ink: 'crimson', battle: 'churchyard', win: 41, show: { notFlag: 'yardCleared' } },
      { t: 'Ask Mott about the crypt', to: 42, show: { notFlag: 'yardCleared' } },
      { t: 'Go down into the crypt', to: 43, show: { flag: 'yardCleared', notQuestDone: 'graves' } },
      { t: "Lay Mabel on Wren's grave", ink: 'gold', need: { key: 'doll' }, to: 45, show: { quest: 'wren' } },
      { t: 'Back to the square', to: 12 },
    ],
  },
  41: {
    title: 'Bones in the Fog', scene: 'churchyard', actors: [A('hero', -60, 470), A('mott', 100, 460, -1, 'point')],
    once: { flag: 'yardCleared', key: 'gravemoss', quest: { graves: 'crypt' } },
    text: [
      `The last skeleton comes apart in a rattle and does not get up again. Mott peers out from behind a headstone. "They came up from below," he whispers. "From the crypt. There's a trapdoor by the chapel wall. Green light down there."`,
      `Pale moss grows thick on the opened graves. Gravemoss, Mott calls it, and warns you not to eat it. You pocket a handful anyway. Apothecaries pay for strange things.`,
    ],
    choices: [{ t: 'Descend into the crypt', ink: 'crimson', to: 43 }, { t: 'Back to the square', to: 12 }],
  },
  42: {
    title: 'The Tenant', scene: 'churchyard', actors: [A('hero', -100, 470), A('mott', 60, 460, -1, 'talk')],
    text: [
      `"Crypt's got a tenant," Mott says, and spits for luck. "Pale lady. Talks to the bones. Sings 'em lullabies. I don't go down there. My gran said never go where the singing is."`,
      `"The dead walk out every night and back in every morning. Only there's no morning anymore. So they just walk."`,
    ],
    choices: [{ t: 'Back', to: 40 }],
  },
  43: {
    title: 'The Crypt', scene: 'crypt', actors: [A('hero', -150, 470), A('veyra', 40, 450, -1, 'sit')],
    once: { quest: { graves: 'sexton' } },
    text: [
      `Stone steps lead down into green light. Candles burn the color of pond water along the walls. In the middle of the vault, on a coffin, sits a woman in a black cowl, stitching a shroud with quick white fingers. In the alcoves, the skulls turn to watch you.`,
      `"A Reader," she says, delighted. "I'm Veyra. Don't look so pale, it's my color. The dead walk because the night won't end, little Reader. I keep most of them down here, sleeping. Most."`,
      `"But the Sexton has gone wrong. The old gravedigger, before Mott. He was buried with his lantern and his spite, and now he leads my dead out to dance. Destroy him for me, and I will teach you to command what he cannot."`,
    ],
    choices: [
      { t: 'Accept her bargain', ink: 'indigo', to: 44, give: { flag: 'veyraPact' } },
      { t: 'Refuse. The dead deserve rest, not servants', ink: 'gold', to: 44, give: { flag: 'refusedVeyra' } },
      { t: 'Strike her down where she sits', ink: 'crimson', to: 44, give: { flag: 'struckVeyra' } },
    ],
  },
  44: {
    title: 'The Unburied Sexton', scene: 'crypt', foes: 'sexton',
    text: (st) => [
      st.run.flags.struckVeyra ? `Your blow passes through an empty cowl. Veyra's laughter comes from everywhere at once. "Rude. Very well. Dance with him, then."`
        : st.run.flags.veyraPact ? `Veyra smiles and steps back into the shadows. "Good. Here he comes."`
        : `Veyra sighs. "Pity. Kill him anyway. Even saints have to take out the rubbish."`,
      `The largest tomb splits down the middle. Out climbs a corpse twice the size of a man, in a gravedigger's coat gone green with mold. A lantern of witch-fire swings from one fist. A shovel the size of a door hangs from the other.`,
      `T: That's the Sexton. He looks upset. Try not to get buried.`,
    ],
    choices: [{ t: 'Fight the Unburied Sexton', ink: 'crimson', battle: 'sexton', win: 46 }],
  },
  46: {
    title: 'The Last Shovelful', scene: 'crypt', actors: (st) => [A('hero', -60, 470), st.run.flags.veyraPact ? A('veyra', 100, 460, -1, 'talk') : A('tassel', 90, 380)],
    once: (st) => st.run.flags.veyraPact ? { learn: 'necromancer', item: 'grave_sickle', quest: { graves: 'done2' } } : { potion: { heal: 2 }, gold: 10, quest: { graves: 'done2' } },
    text: (st) => [
      `The Sexton falls to pieces, and the witch-fire in his lantern gutters out with a sound like a sigh. All through the crypt, bones settle back into their alcoves.`,
      st.run.flags.veyraPact ? `Veyra kneels beside you and presses something cold into your palm. "As promised." She teaches you the words that wake the dead, and the worse words that make them obey. When she is finished the candles have burned down a finger's width, and you are not quite the person who came down the stairs. She gives you her sickle, too. "It likes you."`
        : st.run.flags.struckVeyra ? `Of Veyra there is no sign, except a voice in the dark: "Next time, knock." On the steps, somebody has left two healing draughts and a few coins. You decide not to think about it.`
        : `Veyra watches you go with something like respect. "Saints," she says. "Always so tidy." She leaves two healing draughts and a few coins on the steps, which you decide not to think about.`,
    ],
    choices: [{ t: 'Climb back up to the churchyard', to: 47 }],
  },
  47: {
    title: 'Quiet Graves', scene: 'churchyard', actors: [A('hero', -60, 470), A('mott', 100, 460, -1, 'kneel')],
    once: { questDone: 'graves', gold: 25 },
    text: [
      `Mott is waiting at the top of the steps with his lantern held high. When you tell him, he sits down on a headstone, takes off his hat, and cries a little.`,
      `"Quiet," he says. "First time in a month." He presses a purse into your hands: twenty-five crowns, the fees from every grave he had to dig twice.`,
    ],
    choices: [{ t: 'Back to the churchyard', to: 40 }, { t: 'Back to the square', to: 12 }],
  },
  45: {
    title: 'Under the Yew', scene: 'churchyard', actors: [A('hero', -80, 470, 1, 'kneel'), A('wren', 60, 450, -1, 'idle', { alpha: 0.75 })],
    once: { unkey: 'doll', questDone: 'wren', key: 'wrens_ribbon', potion: { ghostwater: 2 } },
    text: [
      `You kneel under the yew and set Mabel against the little stone. Her button eyes catch the moonlight.`,
      `The air goes cold, then warm. Wren is standing beside you, holding the doll, though the doll is also still on the grave. She smiles, a real smile, and for the first time in a month there is a light in Quillsby the color of morning.`,
      `"Goodnight," she says. Then she is gone, and the ribbon from her stone is in your hand, and two small bottles of something misty sit where she stood.`,
      `T: ...Right. Dust in my weave. Moving on.`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },

  /* ---------------- the apothecary ---------------- */
  50: {
    title: "Madam Tallow's Apothecary", scene: 'shop', shop: true, actors: [A('hero', -150, 470), A('tallow', 40, 450, -1, 'talk')],
    once: { quest: { tallow: 'start' } },
    text: (st) => [
      `Bottles crowd every shelf, glowing faintly: red, green, amber, a blue that hurts to look at. Bundles of herbs hang from the beams like sleeping bats. Behind the counter stands a broad woman with a burn-scarred face and a candle stuck in her kerchief.`,
      `"Tallow," she says. "Potions, poultices, and the occasional poison, for the right reasons. Prices are fixed. Pity costs extra."`,
      st.run.flags.tallowDone ? `"Fire and nightshade, fresh," she says, tapping two new rows of bottles. "Try not to throw them at anything you love."` : `"If you're going out into that, bring me gravemoss from the churchyard and blot salt from under the mill. I'll brew you something that burns and something that rots, and give you first pick."`,
    ],
    choices: [
      { t: 'Hand over the gravemoss and blot salt', ink: 'gold', need: { key: ['gravemoss', 'blotsalt'] }, to: 51, show: { notQuestDone: 'tallow' } },
      { t: 'Back to the square', to: 12 },
    ],
  },
  51: {
    title: 'Brewed', scene: 'shop', actors: [A('hero', -120, 470), A('tallow', 60, 450, -1, 'cheer')],
    once: { unkey: ['gravemoss', 'blotsalt'], questDone: 'tallow', flag: 'tallowDone', potion: { clarity: 1, fire: 1 } },
    text: [
      `Tallow grinds the moss and the salt together in a mortar black with use, adds three drops of something that smokes, and pours the result into two cauldrons at once.`,
      `"There. Alchemist's Fire and Nightshade Vials, on my shelf from now on. And this." She sets a small golden bottle in front of you. "Elixir of Clarity. One sip and every trick you know is ready again. Don't waste it on a hangover."`,
    ],
    choices: [{ t: 'Browse her wares', to: 50 }],
  },

  /* ---------------- the watch post ---------------- */
  60: {
    title: 'The Watch Post', scene: 'gate',
    actors: (st) => st.run.flags.metVane ? [A('hero', -110, 470), A('brannoc', 60, 460, -1)] : [A('hero', -170, 470), A('brannoc', -10, 460, -1, 'talk'), A('vane', 170, 450, -1)],
    once: { quest: { oath: 'start' } },
    text: (st) => [
      `Two braziers burn at Quillsby's gate, the only warm things for a mile. Between them stands an old knight in dented plate with a beard like a snowdrift: Captain Brannoc, last of the Quillsby watch.`,
      `"Goblins took my Oathblade when they took the page," he says, without being asked. "Forty years I carried it. A knight without his oath is just a man in a tin can. If you go over the river, bring it back."`,
      st.run.flags.metVane ? null : `A stranger leans against the gatepost: long black coat, wide-brimmed hat, a crossbow on his back too clean to be anything but well used. He watches you the way crows watch a field.`,
    ],
    choices: [
      { t: 'Spar with the captain', ink: 'crimson', battle: 'duel', win: 61, lose: 62, show: { notFlag: 'sparWon' } },
      { t: 'Ask about the ways across the Gloomwater', to: 63 },
      { t: 'Speak to the stranger in the wide hat', to: 64, show: { notFlag: 'metVane' } },
      { t: 'Back to the square', to: 12 },
    ],
  },
  61: {
    title: 'Steel Answers', scene: 'gate', actors: [A('hero', -90, 470), A('brannoc', 70, 460, -1, 'cheer')],
    once: { flag: 'sparWon', learn: 'knight', gift: 'iron_kite' },
    text: [
      `Brannoc lowers his sword, breathing hard, and laughs for the first time in a month. "Ha! You fight like a cornered badger. Good. Badgers live."`,
      `He spends the next hour showing you how to take a blow on a shield instead of your face, how to rush a man off his feet, and how to plant yourself so the world has to go around you.`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },
  62: {
    title: 'Flat on Your Back', scene: 'gate', actors: [A('hero', -40, 470, 1, 'kneel'), A('brannoc', 80, 460, -1)],
    text: [
      `You are looking at the sky. It is still night. A gauntleted hand appears and hauls you up.`,
      `"Not bad," Brannoc says. "Not good, either. Come back when you'll last longer out there than you did in here."`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },
  63: {
    title: 'Three Ways Across', scene: 'gate', actors: [A('hero', -100, 470), A('brannoc', 60, 460, -1, 'point')],
    text: [
      `"Three ways across the Gloomwater," Brannoc says, counting on gauntleted fingers. "The Grumble Bridge, where Gorrak's goblins take a toll. The Ferryman's landing, where a dead man rows you over for a coin, and sometimes for more. Or the smugglers' tunnel under Morrow's mill, if you have a key."`,
      `"Bridge is the straightest road, and the most goblins. The Ferryman is quietest. The tunnel comes up right behind their camp, if the stories are true."`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },
  64: {
    title: 'Inquisitor Vane', scene: 'gate', actors: [A('hero', -100, 470), A('vane', 60, 450, -1, 'talk')],
    once: { flag: 'metVane', quest: { hunt: 'start' } },
    text: [
      `"Silas Vane," he says. "Inquisitor of the Silver Order. Witch hunter, to the peasants." He does not offer a hand.`,
      `"The night fell the same week a witch moved into the old mill. Morrow, they call her. I mean to put her to the question, and then to the fire. You look like someone who gets places. Lead me to her and I will make it worth your while."`,
    ],
    choices: [
      { t: '"I\'ll take you to her."', ink: 'indigo', to: 66 },
      { t: '"Old Morrow helps people. Leave her alone."', ink: 'gold', to: 65 },
      { t: 'Tell him what really stole the dawn (Wits check, 10+)', check: { stat: 'wits', target: 10 }, pass: 67, fail: 65 },
    ],
  },
  65: {
    title: 'Out of My Way', scene: 'gate', actors: [A('hero', -60, 470), A('vane', 120, 450, 1, 'walk')],
    once: { flag: 'vaneHunting', quest: { hunt: 'against' } },
    text: [
      `Vane's eyes are colder than the night. "Then stay out of my way." He shoulders his crossbow and walks off toward the river and the mill.`,
      `T: That is a man who has made up his mind, and he's carrying matches.`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },
  66: {
    title: 'A Bargain with the Silver Order', scene: 'gate', actors: [A('hero', -60, 470), A('vane', 120, 450, 1, 'walk')],
    once: { flag: 'vaneAlly', quest: { hunt: 'ally' } },
    text: [
      `Vane nods, once. "Good. Meet me at the mill." He walks off toward the river without looking back, as if you were already following.`,
      `T: I want it noted that I said nothing. Silently. With great disapproval.`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },
  67: {
    title: 'The Man with the Shears', scene: 'gate', actors: [A('hero', -100, 470, 1, 'talk'), A('vane', 60, 450, -1)],
    once: { flag: ['vaneConvinced', 'morrowSaved'], questDone: 'hunt', learn: 'witchhunter', gift: 'hunters_crossbow' },
    text: [
      `You tell him about the Unbinder: the silver shears, the stolen ending, a night that is not a curse but a missing page. Vane listens without blinking.`,
      `"Silver shears," he says at last. "The Order keeps an old file on a man like that. I thought him a nursery tale." He looks toward the mill, then away. "A witch can wait. The thing that ate the sun cannot."`,
      `He teaches you the Silver Oath: the crossbow, the burning flask, and how to mark a monster so it can never hide from you again.`,
    ],
    choices: [{ t: 'Back to the gate', to: 60 }],
  },

  /* ---------------- the mill ---------------- */
  70: {
    title: 'The Old Mill', scene: 'mill',
    redirect: (st) => ((st.run.flags.vaneHunting || st.run.flags.vaneAlly) && !(st.run.quests.hunt && st.run.quests.hunt.done)) ? 75 : null,
    actors: (st) => st.run.flags.morrowBurned ? [A('hero', -60, 470)] : [A('hero', -150, 470), A('morrow', 20, 460, -1)],
    once: (st) => st.run.flags.morrowBurned ? {} : { quest: { spectacles: 'start' } },
    text: (st) => {
      if (st.run.flags.morrowBurned) return [`The mill is a black skeleton against the stars. The waterwheel still turns, groaning, carrying ash down into the Gloomwater. Of Old Morrow nothing is left but a broom handle, and a smell you will not forget.`];
      const p = [`The waterwheel groans on its axle, turning black water to silver. A lantern burns in one window. On the doorstep, an old woman with hair like a startled cloud sweeps nothing in particular and squints at the dark.`];
      if (st.run.quests.spectacles && st.run.quests.spectacles.done) p.push(`Old Morrow waves her broom at you. "Ah, the Reader! Come for a brew? Or just to admire my wheel?"`);
      else p.push(`"Who's that? Speak up! I'm blind as a mole without my spectacles, and some wretched rat has run off with them into the Whisperwood."`);
      return p;
    },
    choices: [
      { t: 'Return her spectacles', ink: 'gold', need: { key: 'spectacles' }, to: 71, show: { notQuestDone: 'spectacles', notFlag: 'morrowBurned' } },
      { t: 'Ask about the tunnel under the mill', to: 72, show: { notFlag: 'morrowBurned' } },
      { t: 'Ask her to brew you something (15 crowns)', need: { gold: 15 }, take: { gold: 15 }, to: 73, show: { questDone: 'spectacles', notFlag: 'morrowBurned' } },
      { t: 'Go down into the cellar', to: 76 },
      { t: 'Back to the square', to: 12 },
    ],
  },
  71: {
    title: 'Clear Sight', scene: 'mill', actors: [A('hero', -110, 470), A('morrow', 50, 460, -1, 'cheer')],
    once: { unkey: 'spectacles', questDone: 'spectacles', learn: 'wizard', gift: 'inkwell_staff', potion: { ghostwater: 1 } },
    text: [
      `Morrow settles the spectacles on her nose and peers at you, and her whole face changes. "Oh! You're younger than you sound. And there's ink all over you. Reader's ink. Well, well."`,
      `She drags you inside, sits you by the stove, and teaches you to read the margins of the world, where the words are thinnest, and how to set them alight. When you leave, your fingertips smell of smoke. She presses a cloudy bottle into your hand. "Ghostwater. For when you need to not be there."`,
    ],
    choices: [{ t: 'Back outside', to: 70 }],
  },
  72: {
    title: 'Under the Wheel', scene: 'mill', actors: [A('hero', -110, 470), A('morrow', 50, 460, -1, 'talk')],
    text: [
      `"The tunnel? Under my cellar. Smugglers dug it in my grandmother's day. Goes clear under the Gloomwater and comes up behind the goblins' fence." She cackles. "Locked tight, mind. Iron door. The Blackwick boy had the key, and he's dead, poor lamb."`,
      `"And my cellar's full of rats. Big ones. Made of ink. Everything's made of ink lately."`,
    ],
    choices: [{ t: 'Back', to: 70 }],
  },
  73: {
    title: 'A Brew', scene: 'mill', actors: [A('hero', -110, 470), A('morrow', 50, 460, -1, 'cast')],
    enter: { potion: { ghostwater: 1 } },
    text: [`Morrow drops things into a pot that should not go in a pot, stirs it with her broom handle, and decants a bottle of cloudy, faintly glowing water. "Ghostwater. Drink it and you're mist for a breath or three. Don't stay mist too long. You'll forget how to come back."`],
    choices: [{ t: 'Back', to: 70 }],
  },
  75: {
    title: 'The Witch Hunt', scene: 'mill', actors: [A('hero', -200, 470), A('vane', -40, 450, 1, 'shoot'), A('morrow', 140, 460, -1, 'cower')],
    text: (st) => [
      `Torchlight at the mill. Vane stands in the yard with his crossbow leveled. Old Morrow has her back to the waterwheel and her broom held out like a sword.`,
      st.run.flags.vaneAlly ? `"There you are," Vane says, without looking away from her. "Stand aside, Reader. You've done your part."` : `"Stay back, Reader," Vane says. "This is Order business."`,
      `"I never stole any sun!" Morrow shrieks. "I can't even find my spectacles!"`,
    ],
    choices: [
      { t: 'Let him take her', ink: 'indigo', to: 77, show: { flag: 'vaneAlly' } },
      { t: 'Step between them', ink: 'gold', to: 78 },
      { t: 'Tell Vane what really stole the dawn (Wits check, 9+)', check: { stat: 'wits', target: 9 }, pass: 79, fail: 78 },
    ],
  },
  77: {
    title: 'Ashes', scene: 'mill', actors: [A('hero', -100, 470, 1, 'idle'), A('vane', 60, 450, -1)],
    once: { flag: 'morrowBurned', questDone: 'hunt', learn: 'witchhunter', gift: 'hunters_crossbow' },
    text: [
      `You step back. Vane steps forward. You will remember the rest at odd moments for the rest of your life: the crackle, the smell, the way she kept asking for her spectacles until she didn't.`,
      `Afterwards Vane wipes his hands on a white cloth and is, in his way, grateful. He teaches you the Silver Oath: the crossbow, the flask, the mark that lets nothing hide. His lessons are excellent. You do not sleep well, and there is no morning to wake to.`,
      `T: ...`,
    ],
    choices: [{ t: 'Leave the mill', to: 12 }],
  },
  78: {
    title: "The Witch's Shield", scene: 'mill', actors: [A('hero', 0, 470, -1), A('vane', -160, 450, 1), A('morrow', 140, 460, -1)],
    once: { questDone: 'hunt', flag: 'morrowSaved', potion: { ghostwater: 1 } },
    text: [
      `You step into the line of his crossbow. Vane's finger tightens on the trigger, then eases. "You'd die for a hedge witch?"`,
      `"If I have to," you say, and for a moment you even mean it.`,
      `"Fools and saints," Vane mutters, lowering the bow. "The world is full of both." He leaves into the dark. Morrow presses a cloudy bottle into your hands, still trembling. "Ghostwater. For when the next one comes."`,
    ],
    choices: [{ t: 'Back to the mill', to: 70 }],
  },
  79: {
    title: 'Proof', scene: 'mill', actors: [A('hero', -100, 470, 1, 'talk'), A('vane', 40, 450, -1), A('morrow', 170, 460, -1)],
    once: { flag: ['vaneConvinced', 'morrowSaved'], questDone: 'hunt', learn: 'witchhunter', gift: 'hunters_crossbow' },
    text: [
      `"She didn't steal your sun," you tell him. "A man with silver shears cut it out of the book." You tell him the rest. Morrow chimes in at all the wrong moments.`,
      `Vane lowers the crossbow by degrees. "Silver shears. The Order keeps a file on a man like that." He looks at Morrow, who sticks out her tongue. "Fine. A witch can wait. The thing that ate the sun cannot."`,
      `Before he goes he teaches you the Silver Oath: the crossbow, the flask, the mark that lets nothing hide. Morrow watches the whole lesson and tuts.`,
    ],
    choices: [{ t: 'Back to the mill', to: 70 }],
  },
  76: {
    title: 'The Mill Cellar', scene: 'cellar', foes: 'cellar',
    redirect: (st) => (st.run.flags.cellarCleared ? 82 : null),
    text: [
      `Stone steps lead down into a cellar that smells of river and rot. Ink has seeped through the walls and pooled on the floor in black mirrors. Barrels line the walls. One is stenciled DO NOT OPEN.`,
      `Something squeaks. Something much bigger gurgles.`,
    ],
    choices: [{ t: 'Fight', ink: 'crimson', battle: 'cellar', win: 82 }, { t: 'Back upstairs', to: 70 }],
  },
  82: {
    title: 'The Iron Door', scene: 'cellar', actors: [A('hero', -60, 470)],
    once: { flag: 'cellarCleared', key: 'blotsalt' },
    text: [
      `The cellar is quiet. Black crystals crust the walls where the ink pooled longest: blot salt, the apothecaries call it. You scrape a handful into your pack.`,
      `At the far end stands an iron door, banded and studded, with a keyhole the size of your thumb. Beside it, the barrel stenciled DO NOT OPEN sits very, very still.`,
    ],
    choices: [
      { t: "Unlock the door with the smuggler's key", need: { key: 'tunnelkey' }, to: 84 },
      { t: 'Force the door (Might check, 11+)', ink: 'crimson', check: { stat: 'might', target: 11 }, pass: 84, fail: 83, show: { notKey: 'tunnelkey' } },
      { t: 'Open the barrel marked DO NOT OPEN', ink: 'indigo', to: 99 },
      { t: 'Back upstairs', to: 70 },
    ],
  },
  83: {
    title: 'Unmoved', scene: 'cellar', actors: [A('hero', 0, 470, 1, 'hurt')],
    text: [
      `You hit the door with your shoulder. The door wins. You hit it again. The door wins harder.`,
      `T: Nim at the tavern had a brother who smuggled. Smugglers have keys. Just a thought, from a ribbon.`,
    ],
    choices: [{ t: 'Back', to: 82 }],
  },
  84: {
    title: 'Under the Gloomwater', scene: 'cellar', actors: [A('hero', 40, 470, 1, 'walk')],
    text: [
      `The tunnel is low and wet and longer than any tunnel has a right to be. Somewhere above, the river grinds along. Water drips on your neck in a slow, patient rhythm, like a clock counting down.`,
      `At last the passage climbs, and you push up through a trapdoor into the smell of woodsmoke, goblin, and stolen beer. You are behind the goblin camp.`,
    ],
    choices: [{ t: 'Climb out', to: 92 }],
  },
  99: {
    title: 'Do Not Open', scene: 'cellar', death: true, actors: [A('hero', 0, 470, 1, 'hurt', { alpha: 0.45 })],
    text: [
      `You pry the lid off the barrel. Inside, packed to the brim, are eraser shavings: grey, crumbly, endless. A breath of cellar air lifts them like smoke.`,
      `Where they touch you, you stop being written. First your fingers. Then your hands. Then the rest of the sentence that was you.`,
      `T: It said DO NOT OPEN. In capitals.`,
    ],
  },

  /* ---------------- crossing the river ---------------- */
  80: {
    title: 'The Gloomwater', scene: 'river', actors: [A('hero', -90, 470), A('tassel', 10, 380)],
    text: [
      `The last lantern of Quillsby falls behind you. Ahead, the Gloomwater slides by, black and wide and quiet as a held breath. Somewhere downstream it roars, where it falls off the edge of the page.`,
      `Three ways across.`,
    ],
    choices: [
      { t: 'The Grumble Bridge', to: 85 },
      { t: "The Ferryman's landing", to: 87 },
      { t: "The smugglers' tunnel under Morrow's mill", to: 70 },
      { t: 'Not yet. Back to the square', to: 12 },
    ],
  },
  85: {
    title: 'The Grumble Bridge', scene: 'bridge', foes: 'bridge',
    text: [
      `A rickety bridge of black timber, lit by torches on goblin spears. A toll booth squats at the far end, under a sign: TOLL 1 SILVER. OR 1 FINGER.`,
      `A goblin wearing a cooking pot for a helmet hops off the booth. "Halt! Gorrak is toll-keeper! Gorrak takes silver, or Gorrak takes fingers. Gorrak is not picky!" His crew snickers behind him, tossing stones from hand to hand.`,
    ],
    choices: [
      { t: 'Pay the toll (10 crowns)', need: { gold: 10 }, take: { gold: 10 }, to: 86 },
      { t: 'Clear the bridge', ink: 'crimson', battle: 'bridge', win: 89 },
      { t: '"The Gutter King wants you back at camp. Now." (Wits check, 9+)', ink: 'indigo', check: { stat: 'wits', target: 9 }, pass: 88, fail: { battle: 'bridge', win: 89 } },
    ],
  },
  86: {
    title: 'Paid Passage', scene: 'bridge', actors: [A('hero', -100, 470), A('gorrak', 60, 460, -1, 'cheer'), A('e:cutthroat', 170, 420, -1), A('e:slinger', 230, 490, -1)],
    text: [
      `Gorrak bites each coin and pockets it with a happy grunt. "Pleasure! Come again! Bring more fingers!" The goblins part, sniggering, and let you cross.`,
      `T: You just funded goblin crime. I hope you're proud.`,
    ],
    choices: [{ t: 'Cross the bridge', to: 90 }],
  },
  88: {
    title: 'Royal Summons', scene: 'bridge', actors: [A('hero', -80, 470), A('gorrak', 130, 460, 1, 'run'), A('e:cutthroat', 220, 430, 1, 'run')],
    text: [`"The king wants us? Now?" Gorrak's ears droop. "Gorrak didn't do it. Whatever it was, it was Snit." He and his crew scamper off across the bridge in a clatter of pots and spears, leaving the toll booth empty.`],
    choices: [{ t: 'Cross the bridge', to: 90 }],
  },
  89: {
    title: 'Toll Paid in Full', scene: 'bridge', actors: [A('hero', -20, 470)],
    once: { item: 'gorrak_pot', gold: 8 },
    text: [
      `The bridge is quiet except for the river. Gorrak's pot rolls to a stop at your feet, dented but sturdy. The toll box rattles with coins taken from braver travelers than these goblins.`,
      `T: A pot for a helmet. Wear it and you'll smell of soup forever. It does fit, though.`,
    ],
    choices: [{ t: 'Cross the bridge', to: 90 }],
  },
  87: {
    title: 'The Ferryman', scene: 'river', actors: [A('hero', -150, 470), A('ferryman', 60, 450, -1)],
    text: [
      `A boat waits at the rotting landing, black as the water. In it stands a tall figure in a hooded robe, leaning on a pole topped with blue fire. Under the hood there is no face, only bone, and two cold lights where eyes should be.`,
      `"Coin," says the Ferryman, in a voice like wind in an empty house. "For the crossing."`,
    ],
    choices: [
      { t: 'Pay the Ferryman (5 crowns)', need: { gold: 5 }, take: { gold: 5 }, to: 91 },
      { t: 'Steal the boat while he looks away (Test your Luck)', ink: 'indigo', check: { luck: true }, pass: 93, fail: 98 },
      { t: 'Refuse him, and swim', ink: 'crimson', to: 97 },
      { t: 'Back to the riverbank', to: 80 },
    ],
  },
  91: {
    title: 'Across the Black Water', scene: 'river', actors: [A('hero', -40, 470, 1, 'sit'), A('ferryman', 70, 450, -1)],
    once: { flag: 'ferryLore' },
    text: [
      `You sit. He rows. The Gloomwater makes no sound against the hull. Halfway across, without turning, the Ferryman speaks.`,
      `"The one with the shears crossed here, a month past. Paid in silver. Too much silver. He went to the goblin king. He came back with nothing in his hands, and smiling."`,
      `The boat bumps against the far bank. When you look back there is no boat and no Ferryman, only fog.`,
    ],
    choices: [{ t: 'Climb ashore', to: 90 }],
  },
  93: {
    title: 'Thief of the Dead', scene: 'river', actors: [A('hero', 40, 470, 1, 'run')],
    text: [
      `You wait until the Ferryman turns his hood toward the far shore, then shove off. The boat wallows. The current grabs it. For three long breaths you are sure you are going over the falls.`,
      `Then the hull scrapes sand on the far side and you leap out. Behind you, the boat drifts back across the water on its own, to where the Ferryman stands waiting, watching you with his cold blue eyes.`,
      `T: He'll remember that. They always remember.`,
    ],
    choices: [{ t: 'Hurry on', to: 90 }],
  },
  97: {
    title: 'Cold Water', scene: 'river', death: true, actors: [A('ferryman', 40, 450, -1)],
    text: [
      `You wade in. The Gloomwater is colder than winter and deeper than grief. Something soft brushes your leg. Then something not soft.`,
      `The last thing you see is the Ferryman drifting past in his black boat, holding out one bony hand. For the coin you did not pay.`,
    ],
  },
  98: {
    title: 'The Falls', scene: 'river', death: true, actors: [A('ferryman', 60, 450, -1)],
    text: [
      `The boat wallows, spins, and tips. The Gloomwater takes you without a sound. Far away, the falls are roaring.`,
      `The Ferryman watches from the bank. He does not row out. He has all the time in the world, and now, so do you.`,
    ],
  },

  /* ---------------- the goblin camp ---------------- */
  90: {
    title: 'The Goblin Camp', scene: 'camp', foes: 'camp',
    text: [
      `A ring of sharpened stakes, hung with skulls and bells. Inside, hide tents crowd around a bonfire the size of a house. Goblins squabble, gamble and sharpen things. Over the biggest tent flies a banner: a rat wearing a crown.`,
      `T: The Gutter King's flag. Subtle, isn't it.`,
    ],
    choices: [
      { t: 'Storm the gate', ink: 'crimson', battle: 'camp', win: 94 },
      { t: 'Sneak around to the back of the camp (Grace check, 9+)', ink: 'indigo', check: { stat: 'grace', target: 9 }, pass: 92, fail: { battle: 'patrol', win: 94 } },
      { t: 'Walk in under a white rag and ask to parley', ink: 'gold', to: 95 },
    ],
  },
  92: {
    title: 'Behind the Tents', scene: 'campback', actors: [A('hero', -150, 470, 1, 'idle')],
    text: (st) => [
      `Behind the camp the goblins keep their loot: crates of stolen candles, a church bell, a sack of somebody's teeth. A cage of iron bars holds the oddments too precious to share.`,
      (st.run.quests.wren && !st.run.quests.wren.done && !st.run.keys.includes('doll')) ? `In the cage, propped against a broken lute, sits a rag doll with button eyes. Mabel.` : null,
      `From the biggest tent comes a low voice, and the scrape of something heavy dragged across the floor.`,
    ],
    choices: [
      { t: 'Take Mabel from the cage', ink: 'gold', to: 92, show: { quest: 'wren', notKey: 'doll' }, give: { key: 'doll', quest: { wren: 'found' } } },
      { t: 'Listen at the tent wall', to: 96, show: { notVisited: 96 } },
      { t: 'Slip inside and steal the page (Test your Luck)', ink: 'indigo', check: { luck: true }, pass: 110, fail: 100 },
      { t: 'Cut through the tent wall and attack', ink: 'crimson', to: 100 },
      { t: 'Walk around to the front and ask to parley', ink: 'gold', to: 95 },
    ],
  },
  96: {
    title: 'The Mirror', scene: 'tent', actors: [A('grubnose', 20, 450, 1, 'idle', { weapon: { type: 'mirror' } }), A('unbinder', 160, 440, -1, 'idle', { alpha: 0.45 })],
    once: { flag: 'heardUnbinder' },
    text: [
      `Through a gap in the hide you see him: Grubnose, the Gutter King, fat and green and crowned in tin, sitting on a throne of junk. Pinned to the back of the throne is a single page that glows faintly gold.`,
      `He is talking to a hand mirror. In the glass, something tall and pale bows politely. When it speaks you hear the soft snip of shears between the words.`,
      `"Keep my page safe, little king," says the voice in the mirror, "and I will bring your people silver." "And the sun?" Grubnose asks, very quietly. "You said the sun would come back." A pause. "Eventually."`,
      `The mirror goes dark. The Gutter King sits alone, and for a moment he looks less like a king than a frightened goblin in a tin hat.`,
    ],
    choices: [
      { t: 'Slip inside and steal the page (Test your Luck)', ink: 'indigo', check: { luck: true }, pass: 110, fail: 100 },
      { t: 'Walk in and offer him a better deal', ink: 'gold', to: 95 },
      { t: 'Cut through the tent wall and attack', ink: 'crimson', to: 100 },
    ],
  },
  94: {
    title: 'Fire in the Camp', scene: 'camp', actors: [A('hero', 0, 470, 1, 'walk')],
    text: [`The camp is chaos: tents burning, goblins fleeing into the dark, the bonfire kicked across the mud. You stride through the smoke to the biggest tent and tear the flap aside.`],
    choices: [{ t: 'Enter the tent', ink: 'crimson', to: 100 }],
  },
  95: {
    title: 'Parley', scene: 'tent', actors: [A('hero', -150, 470), A('grubnose', 60, 450, -1, 'sit'), A('e:cutthroat', -260, 430, 1), A('e:cutthroat', 230, 500, -1)],
    text: [
      `Two goblins with spears march you into the biggest tent. The Gutter King sprawls on a throne of junk: cartwheels, church pews, a coffin lid. Behind him a single page glows faintly gold. Across his knees lies a fine old sword with a knight's crest on the pommel.`,
      `"A Reader," Grubnose says, picking his teeth with a dagger. "Brave. Stupid. Grubnose likes both. Talk, Reader. Talk fast."`,
    ],
    choices: [
      { t: 'Ask who he is so afraid of', ink: 'gold', need: { any: [{ flag: 'heardUnbinder' }, { flag: 'ferryLore' }, { inkMin: { gold: 3 } }] }, lock: 'needs proof, or a kinder name', to: 102 },
      { t: 'Offer a hundred crowns for the page', need: { gold: 100 }, take: { gold: 100 }, to: 101 },
      { t: 'Tell him his crown is made of tin', ink: 'crimson', to: 100 },
    ],
  },
  100: {
    title: 'The Gutter King', scene: 'tent', foes: 'king',
    text: [
      `Grubnose surges up off his throne, and keeps surging. He is bigger than he looked, much bigger, with a mace like a tree stump and a belly that has eaten three kingdoms' worth of stolen pies.`,
      `"Grubnose was king of the gutter before your book had a spine!" he bellows. "Grubnose will be king of it after!"`,
      `T: Oh good, a speech. Hit him while he's talking.`,
    ],
    choices: [{ t: 'Fight the Gutter King', ink: 'crimson', battle: 'king', win: 103 }],
  },
  103: {
    title: 'The King Yields', scene: 'tent', actors: [A('hero', -110, 470), A('grubnose', 60, 450, -1, 'kneel')],
    text: [`The Gutter King crashes to his knees, crown askew, mace rolling away across the carpet. "Enough! Enough. Grubnose yields." He holds up a shaking green hand. "Take the page. Take it. It never brought the sun anyway."`],
    choices: [
      { t: 'Spare him, and ask why he took it', ink: 'gold', to: 102 },
      { t: 'Take the page, the sword and his crown', ink: 'indigo', to: 120, give: { key: 'page', item: ['oathblade', 'gutter_crown'], quest: { oath: 'got', ending: 'got' }, flag: 'tookCrown' } },
      { t: 'End the Gutter King', ink: 'crimson', to: 104 },
    ],
  },
  104: {
    title: 'Long Live Nobody', scene: 'tent', actors: [A('hero', 0, 470)],
    once: { key: 'page', item: 'oathblade', quest: { oath: 'got', ending: 'got' }, flag: 'killedKing' },
    text: [
      `It is quick. It is not clean. The goblins outside hear the silence and understand it, and by the time you step out of the tent the camp is empty, its fires burning for nobody.`,
      `You take the glowing page from the throne, and the old knight's sword. The crown you leave in the dirt where it fell.`,
      `T: Well. That's one way to end a reign. Let's go home before something else does.`,
    ],
    choices: [{ t: 'Return to Quillsby', to: 120 }],
  },
  101: {
    title: 'A Fair Price', scene: 'tent', actors: [A('hero', -110, 470), A('grubnose', 60, 450, -1, 'cheer')],
    once: { key: 'page', quest: { ending: 'got' }, flag: 'boughtPage' },
    text: [
      `Grubnose counts the coins with surprising speed, bites three, and grins with all his teeth. "Done! Grubnose is a reasonable king." He unpins the page and hands it over.`,
      `When your eyes go to the sword across his knees, he lays a hand on it. "No. The sword stays. Spoils of war. Go away now, Reader, before Grubnose stops being reasonable."`,
    ],
    choices: [{ t: 'Return to Quillsby', to: 120 }],
  },
  102: {
    title: "A Goblin's Word", scene: 'tent', actors: [A('hero', -110, 470), A('grubnose', 60, 450, -1, 'kneel')],
    once: { key: ['page', 'mapscrap'], item: 'oathblade', quest: { oath: 'got', ending: 'got' }, flag: 'goblinPact' },
    text: [
      `The fight goes out of the Gutter King all at once. "The snip-snip man," he whispers. "Came in the first week of the dark. Gave silver. Said: keep the page, and the goblins get the town when it fades. Said: refuse, and snip, snip. No more goblins. Never were any goblins."`,
      `"Grubnose has two hundred goblins. Hungry ones. Little ones. What does a king do?" He unpins the page and holds it out, with the old knight's sword. "Take them. Stop the snip-snip man. Grubnose swears on his crown, the goblins leave Quillsby be."`,
      `He presses a scrap of hide into your hand as well: a crude map, marked with a building full of teeth. "That is where the snip-snip man went."`,
    ],
    choices: [{ t: 'Return to Quillsby', to: 120 }],
  },
  110: {
    title: 'The Quiet Thief', scene: 'tent', actors: [A('hero', 40, 470, 1, 'run')],
    once: { key: 'page', quest: { ending: 'got' }, flag: 'quietThief' },
    text: [
      `You slip under the hide while the Gutter King mutters to himself. Three steps. Four. Your fingers close on the page, warm as a sleeping cat, and you ease it off the pin.`,
      `By the time the roar goes up behind you, you are already over the fence and running for the river, with Quillsby's ending tucked inside your shirt.`,
    ],
    choices: [{ t: 'Run for Quillsby', to: 120 }],
  },

  /* ---------------- homecoming & endings ---------------- */
  120: {
    title: 'Homecoming', scene: 'village',
    actors: (st) => { const a = [A('hero', -120, 470), A('mayor', 20, 460, -1, 'talk'), A('villager', 150, 420, -1), A('villager2', -260, 430, 1)]; if (st.run.items.includes('oathblade') && st.run.quests.oath && !st.run.quests.oath.done) a.push(A('brannoc', 230, 470, -1)); return a; },
    text: (st) => [
      `Quillsby is fading faster now. Whole streets have gone to pencil. But word of your coming runs ahead of you, and by the time you reach the square, everyone still drawn in ink has gathered around the well.`,
      `Mayor Puddingworth pushes to the front, hat in his hands. "You have it? You have it! Oh, give it here, quickly, quickly!"`,
      (st.run.items.includes('oathblade') && st.run.quests.oath && !st.run.quests.oath.done) ? `At the back of the crowd stands Captain Brannoc. His eyes go straight to the sword at your hip.` : null,
    ],
    choices: [
      { t: 'Return the Oathblade to Captain Brannoc', ink: 'gold', show: { item: 'oathblade', quest: 'oath' }, give: { unitem: 'oathblade', item: 'captains_helm', questDone: 'oath' }, to: 121 },
      { t: 'Give the page to the mayor', ink: 'gold', to: (st) => (st.run.flags.goblinPact ? 142 : st.run.flags.quietThief ? 143 : 140) },
      { t: 'Hold the page up until the mayor doubles your fee', ink: 'indigo', need: { inkMin: { indigo: 3 } }, lock: 'needs a sly reputation', to: 141 },
    ],
  },
  121: {
    title: 'An Oath Returned', scene: 'village', actors: [A('hero', -100, 470), A('brannoc', 60, 460, -1, 'kneel')],
    text: [
      `Brannoc takes the sword in both hands like a man taking back his own heart. For a long moment he cannot speak. Then he lifts off his plumed helm and puts it into your hands.`,
      `"I'll not need two," he says gruffly. "Wear it. Let them see what a knight looks like."`,
    ],
    choices: [{ t: 'Turn back to the mayor', to: 120 }],
  },
  140: {
    title: 'The Hero of Quillsby', scene: 'dawn', ending: 'hero', actors: [A('hero', -60, 470, 1, 'cheer'), A('mayor', 80, 460, -1, 'cheer'), A('villager', 200, 430, -1, 'cheer'), A('villager2', -220, 440, 1, 'cheer')],
    once: (st) => ({ gold: feeOf(st), unkey: 'page', questDone: 'ending' }),
    text: [
      `The mayor lays the page on the rim of the well. It flutters, though there is no wind, slides up into the air, and keeps rising until it is a gold point above the rooftops.`,
      `Then, for the first time in a month, the sun comes up. It comes up all at once, the way it does in stories, gold pouring over the hills and into every street. The pencil houses darken into timber and thatch. In the churchyard, the last of the walking dead lie down with a sigh.`,
      `Quillsby cheers. Somebody rings the bell on purpose. The mayor pays you, weeping openly, and there is bread and ale and a fiddler who knows only two songs and plays both all night, except that it isn't night anymore.`,
      `T: Not bad, Reader. Not bad at all. Hold on to that feeling. Chapter Two has teeth.`,
    ],
    choices: [{ t: 'Close Chapter I', endChapter: true }],
  },
  141: {
    title: 'The Price of a Page', scene: 'dawn', ending: 'price', actors: [A('hero', -40, 470, 1, 'point'), A('mayor', 100, 460, -1, 'cower'), A('villager', 210, 430, -1), A('villager2', -220, 440, 1)],
    once: (st) => ({ gold: feeOf(st) * 2, unkey: 'page', questDone: 'ending' }),
    text: [
      `"Double," you say, and hold the page above your head where the mayor can see it and not reach it. The square goes quiet.`,
      `In the end he pays. Everyone pays. You watch them turn out their pockets in the lantern light: coppers, wedding rings, a child's lucky stone. Then you hand over the page, and the sun comes up over Quillsby for the first time in a month.`,
      `It is a beautiful morning. Nobody meets your eyes. Later somebody paints your portrait for the tavern wall. It is not flattering.`,
      `T: Gold glitters lovely at sunrise. I suppose.`,
    ],
    choices: [{ t: 'Close Chapter I', endChapter: true }],
  },
  142: {
    title: "A Goblin's Word", scene: 'dawn', ending: 'goblin', actors: [A('hero', -100, 470), A('grubnose', 70, 450, -1, 'idle', { hat: null }), A('mott', 200, 460, -1, 'point'), A('e:cutthroat', -240, 440, 1, 'cheer')],
    once: (st) => ({ gold: feeOf(st), unkey: 'page', questDone: 'ending' }),
    text: [
      `The page rises from the well like a gold leaf on a warm wind, and the sun comes up over Quillsby for the first time in a month. The pencil houses darken into timber. The dead lie down.`,
      `At noon a line of goblins appears on the river road, ears down, carrying crates: candles, a church bell, a sack of teeth. At their head waddles Grubnose, without his crown, holding a white rag. The village stares. The goblins stare back.`,
      `Nobody quite knows what to do, so Mott hands Grubnose a shovel, and by evening goblins and villagers are rebuilding the chapel wall together, badly, arguing the whole time.`,
      `The map scrap in your pocket feels heavier than it should. A building full of teeth. That is where the snip-snip man went.`,
      `T: A goblin alliance. Ink and valor, Reader. Ink and valor.`,
    ],
    choices: [{ t: 'Close Chapter I', endChapter: true }],
  },
  143: {
    title: 'The Quiet Thief', scene: 'dawn', ending: 'thief', actors: [A('hero', -60, 470, 1, 'idle'), A('mayor', 90, 460, -1, 'cheer'), A('villager', 210, 430, -1, 'cheer')],
    once: (st) => ({ gold: feeOf(st), unkey: 'page', questDone: 'ending' }),
    text: [
      `The page goes back where it belongs, and the sun comes up over Quillsby for the first time in a month. The pencil houses darken into timber and thatch.`,
      `Nobody saw you take it. Nobody knows how it came back. By lunchtime there are four different stories in the tavern about how the Gutter King lost his page, and you are in none of them.`,
      `Across the river, a very large goblin wakes up, looks at the empty pin on the back of his throne, and screams loud enough to knock birds out of trees in three counties.`,
      `T: Sneaky. Very sneaky. The best heroes never get statues. They get away.`,
    ],
    choices: [{ t: 'Close Chapter I', endChapter: true }],
  },
};

const ENDINGS = { hero: 'The Hero of Quillsby', price: 'The Price of a Page', goblin: "A Goblin's Word", thief: 'The Quiet Thief' };

