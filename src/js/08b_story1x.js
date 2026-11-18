/* ==========================================================================
   Chapter I - additions: Old Hessa, Pip the bard, Tallow's craft, Ulfgar
   ========================================================================== */
Object.assign(QUESTS, {
  stones: { title: 'The Singing Stones', giver: 'Old Hessa', stages: { start: 'Wisps are breaking the singing stones on the ridge. Old Hessa cannot hold them alone.' } },
  cage: { title: 'The Caged Northman', giver: 'Ulfgar Ironbelly', stages: { start: 'A northman is caged behind the goblin camp. He says he will be grateful. Loudly.' } },
});

/* hooks into existing Chapter I pages */
SECTIONS[0].text = SECTIONS[0].text.map((p) => p.replace('numbered 1 to 4', 'numbered 1 to 5, with your passive talents shown under your name'));
SECTIONS[3].choices.push({ t: 'Follow the humming up to the ridge of singing stones', ink: 'gold', to: 150, show: { notVisited: 150 } });
SECTIONS[20].choices.splice(SECTIONS[20].choices.length - 1, 0, { t: 'Find out who is singing so badly in the corner', to: 152, show: { notFlag: 'metPip' } });
SECTIONS[50].choices.splice(SECTIONS[50].choices.length - 1, 0, { t: 'Ask Tallow to teach you how she does it', ink: 'gold', to: 154, show: { questDone: 'tallow', notFlag: 'tallowTaught' } });
SECTIONS[51].choices.unshift({ t: 'Ask Tallow to teach you how she does it', ink: 'gold', to: 154, show: { notFlag: 'tallowTaught' } });
SECTIONS[92].choices.splice(1, 0, { t: 'Find out what is roaring inside the big iron cage', to: 155, show: { notVisited: 155 } });
SECTIONS[94].choices.push({ t: 'Free whoever is bellowing in the cage behind the tents', ink: 'gold', to: 155, show: { notVisited: 155 } });
SECTIONS[121].once = { ally: 'brannoc' };

/* Chapter I no longer ends the book: each ending turns to Chapter II */
const CHAPTER_ENDINGS = Object.assign({}, ENDINGS);
for (const k of Object.keys(ENDINGS)) delete ENDINGS[k];
for (const id of [140, 141, 142, 143]) {
  const s = SECTIONS[id];
  s.chapterEnding = s.ending; delete s.ending;
  s.choices = [{ t: 'Turn the page to Chapter II: The Drowned Road', ink: 'gold', endChapter: 'II' }];
  s.text = s.text.map((p) => p.replace('Chapter Two has teeth.', 'Chapter Two has a bog in it.'));
}

Object.assign(SECTIONS, {
  /* ---------------- Old Hessa ---------------- */
  150: {
    title: 'The Singing Stones', scene: 'moor', actors: [A('hero', -150, 470), A('hessa', -30, 420, 1, 'cast'), A('e:wisp', 140, 390, -1), A('e:wisp', 220, 470, -1)],
    once: { quest: { stones: 'start' } },
    text: [
      `Up on the ridge the standing stones are humming, each one a different note, the way a choir warms up before a hymn. The air tastes of copper and rain.`,
      `In the middle of the ring stands an old woman with white hair blown straight up off her head. Lightning crawls along her staff. She is shouting at the sky, and the sky is shouting back.`,
      `Blue wisps circle the stones, gnawing at them. Wherever a wisp bites, the humming stops and the stone goes grey and quiet.`,
      `"Don't just stand there gawking!" the old woman bellows without looking round. "Every stone they silence is a word I can't hear any more! Hit something!"`,
    ],
    choices: [
      { t: 'Stand with her among the stones', ink: 'crimson', battle: 'stones', win: 151 },
      { t: 'Back away down the ridge', to: 3 },
    ],
  },
  151: {
    title: 'Old Hessa', scene: 'moor', actors: [A('hero', -100, 470), A('hessa', 50, 450, -1, 'talk'), A('tassel', 140, 380)],
    once: { questDone: 'stones', learn: 'stormcaller', gift: 'stormcrown', ally: 'hessa', xp: 30 },
    text: [
      `The last wisp pops like a soap bubble. One by one the stones take up their notes again until the ridge is ringing.`,
      `"Hessa," the old woman says, and spits over her shoulder for luck. "Stormcaller, retired, unretired. The wind carries every sentence anybody ever spoke, if you know how to listen. These stones are my ears."`,
      `"I heard it, you know. The night the shears closed. A man's voice, soft as a page turning. He said: 'There. Now nobody else has to end.' And then the wind went quiet for the first time in four hundred years."`,
      `She grabs your wrist, and lightning jumps from her fingers to yours. It doesn't hurt. It feels like remembering something. "There. Now you can hear it too. Hold out your hand and say please, and the sky will usually oblige. When you go after him, and you will, send word on the wind. I'll come."`,
      `T: She means it. Stormcallers always arrive. Usually through the roof.`,
    ],
    choices: [
      { t: 'Follow the road to Quillsby', to: 10 },
      { t: 'Cut through the whispering forest', to: 5 },
    ],
  },

  /* ---------------- Pip ---------------- */
  152: {
    title: 'A Bard Without an Audience', scene: 'tavern', actors: [A('hero', -150, 470), A('pip', 30, 460, -1, 'talk')],
    once: { flag: 'metPip' },
    text: [
      `In the corner by the dead fire a young man in a feathered cap is singing to an empty room. He is not good. He is very, very enthusiastic.`,
      `"...and the knight rode on, and on, and on," he sings, "and on, and on, and..." He stops, scowls, and slaps the lute. "It won't END. None of them will end any more. I've sung this verse forty times. I'm Pip, by the way. Bard. Collector of endings. Currently out of stock."`,
      `"Songs need last verses," he says, "or they go sour. You can hear it. Listen." He plucks one string. It hangs in the air and wobbles, like a note that has forgotten where it was going.`,
      `"A man came through, before the night. Grey coat, kind face, terrible sad eyes. He asked me for a song with no ending. I said there's no such thing. He said there would be soon."`,
    ],
    choices: [
      { t: 'Buy him a drink and ask him to teach you a song that still works (3 crowns)', ink: 'gold', need: { gold: 3 }, take: { gold: 3 }, to: 153 },
      { t: 'Sing him the end of his song yourself (Heart check, 9+)', check: { stat: 'heart', target: 9 }, pass: 153, fail: 158 },
      { t: 'Leave him to it', to: 20 },
    ],
  },
  153: {
    title: 'The Last Verse', scene: 'tavern', actors: [A('hero', -100, 470, 1, 'cheer'), A('pip', 60, 460, -1, 'cheer')],
    once: { learn: 'bard', ally: 'pip', xp: 20, flag: 'pipTaught' },
    text: [
      `Between you, somehow, you find a last verse. The knight gets home. His horse gets a carrot. It is not poetry, but when Pip strikes the final chord it rings true and clean, and three drinkers at the bar burst into tears and don't know why.`,
      `"THAT," Pip says, "is what an ending sounds like." He teaches you the lullaby that puts brawlers to sleep, the ballad that makes cowards brave, the one chord that makes goblins wince.`,
      `"You're going after him, aren't you? The grey man." He's already packing the lute. "Somebody has to make up the songs about you. Might as well be somebody who'll lie in your favor."`,
    ],
    choices: [{ t: 'Back to the bar', to: 20 }],
  },
  158: {
    title: 'Off Key', scene: 'tavern', actors: [A('hero', -100, 470, 1, 'cower'), A('pip', 60, 460, -1, 'talk')],
    once: { flag: 'pipTaught', learn: 'bard', xp: 10 },
    text: [
      `You sing. There is a silence of the kind that happens after someone drops a tray of glasses.`,
      `"Well," says Pip kindly, "you're worse than me, which I didn't know was possible. Sit down. I'll teach you the basics before you hurt somebody." He shows you a lullaby and a marching tune, and how to hold a lute so it doesn't look like you're strangling it.`,
      `When you leave he's still trying to finish his song. He doesn't look up.`,
    ],
    choices: [{ t: 'Back to the bar', to: 20 }],
  },

  /* ---------------- Tallow ---------------- */
  154: {
    title: "Tallow's Apprentice", scene: 'shop', actors: [A('hero', -120, 470), A('tallow', 40, 450, -1, 'cast')],
    once: { flag: 'tallowTaught', learn: 'alchemist', potion: { fire: 1, heal: 1 }, xp: 15 },
    text: [
      `Tallow looks you over like she's pricing a cut of meat. Then she pushes a mortar across the counter. "Grind. No, from the wrist. You're not killing it, it's already dead."`,
      `For an hour she shows you how fire likes to live in a bottle, how acid wants out, how one drop too many turns medicine into an explosion and one drop too few turns it into soup. Her scars, she says, are her lecture notes.`,
      `"I learned in the Folio," she says while you work. "City of paper towers, up the coast past Saltmere. I was a scrivener's apprentice once. Then I saw what they do in the Correction Office, and I left and took up something gentler." She taps a bottle that is quietly smoking. "Poison."`,
      `T: The Folio. That's where the Bindery is. Where the shears were kept. Just mentioning it. For no reason.`,
    ],
    choices: [{ t: 'Back to her shelves', to: 50 }],
  },

  /* ---------------- Ulfgar ---------------- */
  155: {
    title: 'The Northman in the Cage', scene: 'campback', actors: [A('hero', -170, 470), A('ulfgar', 40, 450, -1, 'roar')],
    once: { quest: { cage: 'start' } },
    text: [
      `In the biggest cage, the one with the thickest bars, is the biggest man you have ever seen. His beard is red and braided with iron rings. His belly has its own weather. Blue warpaint runs down his chest like rain.`,
      `"ULFGAR," he roars, before you can say anything. "IRONBELLY. OF THE NINTH PAGE. The goblins got me drunk and I woke up in a box. Let me out and I will be grateful. LOUDLY."`,
      `"The Ninth Page is gone," he adds, quieter. "A man in grey cut it out of the book. My people are blank now. Just shapes where faces were. I walked south to find him. I found goblin beer instead."`,
    ],
    choices: [
      { t: 'Smash the lock and fight the guards together', ink: 'crimson', battle: 'cage', win: 156 },
      { t: 'Pick the lock quietly (Grace check, 9+)', ink: 'indigo', check: { stat: 'grace', target: 9 }, pass: 157, fail: { battle: 'cage', win: 156 } },
      { t: 'Leave him', to: 92 },
    ],
  },
  156: {
    title: 'Ironbelly', scene: 'campback', actors: [A('hero', -100, 470, 1, 'cheer'), A('ulfgar', 60, 450, -1, 'cheer')],
    once: { questDone: 'cage', learn: 'barbarian', ally: 'ulfgar', item: 'horned_cap', xp: 30 },
    text: [
      `Ulfgar picks up the last goblin by the ankle and uses him to knock down the other two. Then he laughs, and the laugh goes on for a while.`,
      `"You fight like a southerner," he says, clapping you on the back hard enough to rearrange your spine, "but you fight. Here. Let me show you how to be angry properly. Anger is a fire. You don't put it out. You cook with it."`,
      `"When you find the grey man, I am coming. I want to ask him a question with my axe."`,
    ],
    choices: [
      { t: 'Charge the Gutter King’s tent together', ink: 'crimson', to: 100 },
      { t: 'Slip back into the shadows behind the tents', to: 92 },
    ],
  },
  157: {
    title: 'A Quiet Rescue', scene: 'campback', actors: [A('hero', -100, 470, 1, 'idle'), A('ulfgar', 60, 450, -1, 'talk')],
    once: { questDone: 'cage', learn: 'barbarian', ally: 'ulfgar', item: 'horned_cap', xp: 30 },
    text: [
      `The lock clicks. Ulfgar steps out, stretches until his shoulders crack like kindling, and whispers, in what he clearly believes is a whisper: "THANK YOU."`,
      `Somehow, nobody hears. He teaches you in grunts and gestures, crouched behind a crate: how to plant your feet, how to let the hurt in and turn it into strength. "The more they cut you, the harder you hit. Simple. Like me."`,
      `"When you find the grey man, I am coming," he says. "I want to ask him a question with my axe."`,
    ],
    choices: [
      { t: 'Charge the Gutter King’s tent together', ink: 'crimson', to: 100 },
      { t: 'Slip back into the shadows behind the tents', to: 92 },
    ],
  },
});
