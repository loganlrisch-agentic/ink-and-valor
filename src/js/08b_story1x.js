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

/* ---------------- Chapter I side quests: the Pencil House, the Lamplighter ---------------- */
Object.assign(QUESTS, {
  pencil: { title: 'The Pencil House', giver: 'Ilse Penwright', stages: { start: 'The Penwright house is fading to pencil, family and all. Find a way to ink them back.', ink: 'Old Morrow keeps a pot of true ink at the mill. Or you could trust your own hand.' } },
  lamplighter: { title: 'The Lamplighter', giver: 'Old Wendel', stages: { start: 'A ghost lights Quillsby’s lamps every night and cannot stop. Help him finish his round.' } },
});
SECTIONS[12].choices.splice(SECTIONS[12].choices.length - 1, 0,
  { t: 'Knock at the grey house that looks like a sketch', to: 160, show: { notQuestDone: 'pencil' } },
  { t: 'Follow the blue light moving from lamp to lamp', to: 165, show: { notQuestDone: 'lamplighter' } });
Object.assign(SECTIONS, {
  160: {
    title: 'The Pencil House', scene: 'village', actors: [A('hero', -140, 470), A('ilse', 40, 450, -1, 'talk'), A('dot', 120, 480, -1, 'idle')],
    once: { quest: { pencil: 'start' } },
    text: (st) => [
      `One house on the square is grey. Not painted grey: drawn. Its timbers are pencil lines, its thatch is cross-hatching, and through the wall you can faintly see a table and two chairs.`,
      `A woman opens the door. She is grey too, and slightly see-through, like a drawing on thin paper held up to a window. Behind her skirts a little girl peers out. Half of the girl's face is still there. The other half is an outline, waiting to be filled in.`,
      `"Ilse Penwright," says the woman. "And this is Dot. We were the first to fade. Our family wrote the village ledger, you see, for two hundred years. When the last page went, we went first." She tries to smile. "Dot keeps asking if it hurts. It doesn't. It's just... quiet."`,
      st.run.flags.morrowInk ? `You have a pot of Old Morrow's true ink in your satchel.` : `T: Ink takes to pencil, Reader. If you know where to put it.`,
    ],
    choices: [
      { t: 'Trace their names in ink over the pencil lines (Lore check, 9+)', check: { stat: 'lore', target: 9 }, pass: 161, fail: 162 },
      { t: 'Ask Old Morrow at the mill for a pot of true ink', to: 163, show: { notFlag: 'morrowInk' } },
      { t: 'Paint the house with Old Morrow’s true ink', ink: 'gold', need: { flag: 'morrowInk' }, to: 161, show: { flag: 'morrowInk' } },
      { t: 'Promise to come back', to: 12 },
    ],
  },
  161: {
    title: 'Inked', scene: 'village', actors: [A('hero', -100, 470, 1, 'cheer'), A('ilse', 40, 450, -1, 'cheer', { alpha: 1 }), A('dot', 120, 480, -1, 'cheer', { alpha: 1 })],
    once: { questDone: 'pencil', item: 'penwright_quill', xp: 30, luck: 1, lore: 'pencil' },
    text: [
      `You write their names in the doorframe, slowly, in your best hand: ILSE PENWRIGHT. DOT PENWRIGHT. Then the house. Then the table, and the two chairs, and the cat asleep on the windowsill that you hadn't noticed was there.`,
      `The ink spreads like water into blotting paper. Color comes back into the timbers, warm brown and white. Dot's face fills in, freckle by freckle, and she touches her cheek and laughs.`,
      `Ilse presses a long quill into your hands, as tall as a walking stick. "The family pen. Whatever it writes stays written. We won't be needing it. Not until somebody brings the last page home."`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  162: {
    title: 'Smudged', scene: 'village', actors: [A('hero', -100, 470, 1, 'cower'), A('ilse', 40, 450, -1, 'talk'), A('dot', 120, 480, -1, 'idle')],
    once: { quest: { pencil: 'ink' } },
    text: [
      `Your hand slips. The ink blots, and runs, and where it runs, a little more of Dot goes faint. She looks down at her fading fingers and then up at you, very brave. "It's all right. You can try again."`,
      `"Old Morrow keeps true ink at the mill," says Ilse quietly. "Ink that remembers. He might share it, if you ask nicely. Or if you ask the right way."`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  163: {
    title: 'True Ink', scene: 'mill', actors: [A('hero', -100, 470), A('morrow', 60, 450, -1, 'talk')],
    once: { flag: 'morrowInk', quest: { pencil: 'ink' } },
    text: (st) => [
      `Old Morrow listens to you with his head on one side, like a crow. "The Penwrights. Of course. Good family. Terrible handwriting." He shuffles to a shelf and takes down a small black pot sealed with wax.`,
      `"True ink. Ground from the bones of old stories. It remembers what things were, and it reminds them." He presses it into your hands. "Don't spill any on yourself. You'd remember everything you've ever forgotten, all at once. Most unpleasant."`,
      st.run.flags.morrowBurned ? `He doesn't mention what you did to his mill. That somehow makes it worse.` : null,
    ],
    choices: [{ t: 'Hurry back to the Pencil House', to: 160 }],
  },
  165: {
    title: 'The Lamplighter', scene: 'village', actors: [A('hero', -140, 470), A('wendel', 60, 440, -1, 'idle')],
    once: { quest: { lamplighter: 'start' } },
    text: [
      `A blue light bobs along the edge of the square, stopping at each lamp post. When you get close you see an old man in a lamplighter's coat, raising a long pole to each lamp in turn. The lamps light. He moves on. He is see-through, and he is glowing, and he looks very, very tired.`,
      `"Evening," he says, without stopping. "Wendel. Lamplighter. Fifty years. Died in the spring, I think. Can't stop, though. If I stop, it'll be dark. And it's always dark now. So I never stop."`,
      `"There's one lamp I can't reach. The last one, at the churchyard gate. Things are sitting under it. If I could just light that one, I think I could finish my round. And then I think I could rest."`,
    ],
    choices: [
      { t: 'Go with him to the churchyard gate', ink: 'crimson', battle: 'lamplighter', win: 166 },
      { t: 'Tell him gently that he can stop now (Spirit check, 9+)', ink: 'gold', check: { stat: 'spirit', target: 9 }, pass: 167, fail: 168 },
      { t: 'Leave him to his round', to: 12 },
    ],
  },
  166: {
    title: 'The Last Lamp', scene: 'churchyard', actors: [A('hero', -100, 470), A('wendel', 60, 440, -1, 'cast')],
    once: { questDone: 'lamplighter', item: 'lamplighters_lantern', xp: 30 },
    text: [
      `When the ghouls are gone, Wendel raises his pole to the last lamp at the churchyard gate. It lights blue, then gold, then the warm yellow of an ordinary evening.`,
      `"There," he says. "Round's done." He looks at his pole, and then at you, and holds out his lantern. "You'll need a light more than I will, where you're going." Then he sits down on the step under the lamp, closes his eyes, and fades, slowly and comfortably, like a man dozing off by a fire.`,
    ],
    choices: [{ t: 'Back to the square', to: 12 }],
  },
  167: {
    title: 'Rest', scene: 'village', actors: [A('hero', -100, 470, 1, 'kneel'), A('wendel', 60, 450, -1, 'sit')],
    once: { questDone: 'lamplighter', item: 'lamplighters_lantern', xp: 35, luck: 1 },
    text: [
      `You walk beside him for a while, matching his pace. Then you tell him: the lamps are lit. Every one. The town is safe. Somebody else will carry the light for a while. He has done enough.`,
      `Wendel stops. He looks at his pole as if seeing it for the first time. "Have I?" he says. "Fifty years. I suppose I have." He sits down on the edge of the well and sets the lantern beside him, and when you look back a moment later, there is only the lantern, still burning a little blue.`,
    ],
    choices: [{ t: 'Take the lantern and go back to the square', to: 12 }],
  },
  168: {
    title: 'Not Yet', scene: 'village', actors: [A('hero', -100, 470), A('wendel', 80, 440, -1, 'idle')],
    text: [
      `"Stop?" Wendel shakes his head and hurries on. "No, no. Can't stop. It'll be dark." He doesn't look back. The blue light moves away down the lane, lamp to lamp.`,
    ],
    choices: [
      { t: 'Go with him to the churchyard gate', ink: 'crimson', battle: 'lamplighter', win: 166 },
      { t: 'Back to the square', to: 12 },
    ],
  },
});
