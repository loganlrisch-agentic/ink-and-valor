/* ==========================================================================
   Chapter II - The Drowned Road
   The Fenmire (Mother Fen, Brother Ash, the Green Hermit, the Bog Horror)
   and Saltmere, the stilt port whose tide was stolen.
   ========================================================================== */
Object.assign(QUESTS, {
  road: { title: 'The Drowned Road', giver: 'Tassel', main: true, stages: { start: 'Cross the Fenmire and reach Saltmere, the only port with ships for the Folio.', bog: 'Something huge lives in the bog across the south road. Get past it.' } },
  rook: { title: 'The Fen-Hunter', giver: 'Rook', stages: { start: 'A hunter is pinned down by mirespawn on the old causeway.' } },
  gloam: { title: 'Two Sisters', giver: 'Mother Fen', stages: { start: 'Mother Gloam, Fen’s sister, is drowning endings in the bog for the man with the shears. Stop her.' } },
  tide: { title: 'The Stolen Tide', giver: 'Duchess Coralie', main: true, stages: { start: 'The Tide Bell’s clapper was stolen and the sea stopped moving. No ship can sail for the Folio until the tide comes back.', duchess: 'The Duchess wants the Hollow Guild raided. She is sure they took the clapper.', tower: 'The Red Errata holds the clapper at the top of the Tide Bell tower.' } },
});
Object.assign(KEY_ITEMS, {
  authornote1: { name: 'A Note in the Margin (I)', desc: '"I could not write the ending. Every time I tried, they faded."' },
  authornote2: { name: 'A Note in the Margin (II)', desc: '"The Reader before you will try to stop you. Do not hate him."' },
  drowned_letter: { name: 'A Drowned Letter', desc: 'Sealed in red wax. "The Errata holds the bell. No ship sails for the Folio. -V."' },
  black_feather: { name: 'Gloam’s Black Feather', desc: 'Show it to the Errata and he will let you pass.' },
  clapper: { name: 'The Tide Bell’s Clapper', desc: 'A lump of black iron the size of a child. It hums when it is near the sea.' },
});
CAST.rook = { rig: 'human', name: 'Rook', skin: SKINS[1], hair: { style: 'pony', color: HAIRS[1] }, hat: { type: 'hood', color: '#3a4a2a' }, body: { type: 'vest', color: '#3a4a2a', color2: '#6a5a3a' }, weapon: { type: 'bow' }, back: { type: 'quiver' }, cape: '#2a3a20', legs: '#3a3020', boots: '#4a3a24' };
CAST.ferryman2 = Object.assign({}, CAST.ferryman || {}, {});
Object.assign(ITEMS.saltmere_cutlass, { market: 'saltmere' }); Object.assign(ITEMS.saltmere_coat, { market: 'saltmere' }); Object.assign(ITEMS.elm_longbow, { market: 'saltmere' }); Object.assign(ITEMS.stormglass_staff, { market: 'saltmere' }); Object.assign(ITEMS.stormweave_robe, { market: 'saltmere' });
Object.assign(ITEMS.quillspear, { market: 'folio' }); Object.assign(ITEMS.bonereaver, { market: 'folio' });
Object.assign(CLASSES.ranger, { teacher: 'Rook the fen-hunter' }); Object.assign(CLASSES.barbarian, { teacher: 'Ulfgar Ironbelly' });
Object.assign(CLASSES.knight, { teacher: 'Captain Brannoc' }); Object.assign(CLASSES.wizard, { teacher: 'Old Morrow' }); Object.assign(CLASSES.rogue, { teacher: 'Nim Blackwick' }); Object.assign(CLASSES.cleric, { teacher: 'Sister Amberly' });
BATTLES.palace.allies = [{ t: 'sable', dx: -170, y: 400 }];

const allyNames = (st) => (st.run.allies || []).map((a) => CHAMPS[a] ? CHAMPS[a].name : a);
const listNames = (n) => n.length <= 1 ? (n[0] || '') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];

Object.assign(SECTIONS, {
  200: {
    title: 'The Morning After', scene: 'dawn', chapterStart: true,
    actors: (st) => { const a = [A('hero', -60, 470), A('tassel', 30, 380)]; (st.run.allies || []).slice(0, 4).forEach((id, i) => a.push(A(id, 120 + i * 70, 440 + (i % 2) * 40, -1, 'idle'))); return a; },
    once: (st) => {
      const R = st.run, Q = R.quests, al = [];
      if (Q.oath && Q.oath.done) al.push('brannoc');
      if (Q.pell && Q.pell.done) al.push('amberly');
      if (Q.nim && Q.nim.done) al.push('nim');
      if (R.flags.vaneConvinced) al.push('vane');
      const dark = (R.once[141] ? 1 : 0) + (R.flags.morrowBurned ? 1 : 0) + (R.flags.veyraPact ? 1 : 0);
      return { ally: al.length ? al : null, quest: { road: 'start' }, xp: 20, align: dark || null };
    },
    text: (st) => {
      const n = allyNames(st);
      return [
        `Quillsby wakes into its first morning in a month. People keep stopping in the street to stare at their own shadows. A baker cries into his dough. Somebody's goat eats an entire hedge in celebration.`,
        `T: I have a confession, Reader. Quillsby isn't the only story with a missing page. Look south.`,
        `To the south the sky is still black. Not cloudy: black, the black of a page nobody has written on. Above the horizon, small and far away, hangs a second moon that has not moved in a month.`,
        `T: The Hundred-Path Tome has a hundred stories in it, and the man with the shears has been through dozens. Every one he cut is stuck in its last night. To find him we go to the Folio, the city at the middle of the book, where the Bindery is. The only ships for the Folio sail from Saltmere. And between us and Saltmere is the Fenmire.`,
        n.length ? `You are not leaving alone. At the edge of the village wait ${listNames(n)}, packed and ready, arguing about the best way through a bog.` : `Nobody comes to see you off. That's all right. Some stories start with one person and a ribbon.`,
      ];
    },
    choices: [
      { t: 'Take the Old Causeway, straight through the Fenmire', to: 202 },
      { t: 'Hire the Ferryman’s black barge down the Gloomwater', to: 210 },
    ],
  },

  /* ---------------- the causeway ---------------- */
  202: {
    title: 'The Old Causeway', scene: 'fen', foes: 'causeway', actors: [A('rook', -240, 420, 1, 'shoot')],
    once: { quest: { rook: 'start' } },
    text: [
      `The causeway is a road of flat stones laid across the marsh by someone who expected the marsh to stay put. It hasn't. Every third stone is underwater. Will-o'-wisps bob among the reeds, polite as waiters, waiting for you to step wrong.`,
      `Up ahead, a hunter in a green hood is backed against a dead tree, firing arrows into the water as fast as she can draw. Things are rising out of the water to meet them: lumps of green muck with mouths, like inkspawn that have been left out in the rain.`,
      `"Mirespawn!" she yells at you. "Either help or get out of my line of fire!"`,
    ],
    choices: [
      { t: 'Help the hunter', ink: 'crimson', battle: 'causeway', win: 203 },
      { t: 'Keep your head down and hurry past', ink: 'indigo', to: 204 },
    ],
  },
  203: {
    title: 'Rook', scene: 'fen', actors: [A('hero', -100, 470), A('rook', 50, 450, -1, 'talk')],
    once: { questDone: 'rook', learn: 'ranger', potion: { heal: 1 }, xp: 30 },
    text: [
      `"Rook," the hunter says, pulling arrows out of the muck and wiping them on her sleeve. "I hunt the fen. Or I did, before the fen started hunting back."`,
      `She shows you how she does it while you walk: how to read the reeds for movement, how to set a snare in water, how to put an arrow where something is going to be instead of where it is. "Trick is patience. Wait for the moment, then don't miss it."`,
      `"The bog's been rising since the night came," she says. "There's a witch out there, Mother Gloam, singing to the water. She drowns pages in it. Whole stories, I think. Whatever she drowns comes back up wrong." She nods at the mirespawn melting into the reeds. "That's what a drowned sentence looks like."`,
    ],
    choices: [{ t: 'Walk on into the heart of the Fenmire', to: 205 }],
  },
  204: {
    title: 'Sinking Stones', scene: 'fen', actors: [A('hero', 40, 470, 1, 'run')],
    text: [
      `You hop from stone to stone while the hunter shouts things after you that would curdle milk. Behind you there is a splash, a twang, a scream, then quiet.`,
      `T: I'm sure she was fine. Probably. Hunters are very resilient.`,
    ],
    choices: [{ t: 'Walk on into the heart of the Fenmire', to: 205 }],
  },
  206: {
    title: 'A Bowstring in the Mist', scene: 'fen', foes: 'causeway', actors: [A('rook', -240, 420, 1, 'shoot')],
    once: { quest: { rook: 'start' } },
    text: [
      `Somewhere in the mist a bowstring sings, again and again. You follow the sound to a hunter in a green hood, back to a dead tree, surrounded by lumps of green muck with mouths.`,
      `"Don't just stand there!" she shouts.`,
    ],
    choices: [
      { t: 'Help the hunter', ink: 'crimson', battle: 'causeway', win: 203 },
      { t: 'Leave her to it', to: 205 },
    ],
  },

  /* ---------------- the barge ---------------- */
  210: {
    title: 'The Black Barge', scene: 'river', foes: 'barge', actors: [A('ferryman', 220, 440, -1)],
    text: [
      `The Ferryman meets you at the Gloomwater with a barge as long as a church and as black as a coffin. He takes your coin without looking at it.`,
      `The passengers are already aboard. They sit in rows, dripping, faces grey and soft as wet bread. Weed in their hair. Water running out of their sleeves. One of them turns its head toward you with a slow, wet creak.`,
      `"The Drowned," says the Ferryman. "They got on at the last stop. They always get on at the last stop. They don't like the living. I'd sit at the back."`,
    ],
    choices: [
      { t: 'Sit at the front, weapon across your knees', ink: 'crimson', battle: 'barge', win: 211 },
      { t: 'Buy the Ferryman’s lantern to keep them sleeping (10 crowns)', ink: 'indigo', need: { gold: 10 }, take: { gold: 10 }, to: 212 },
    ],
  },
  211: {
    title: 'Running Aground', scene: 'fen', actors: [A('hero', -60, 470), A('ferryman', 120, 450, -1)],
    once: { xp: 15, flag: 'ferryLore2' },
    text: [
      `When the last of the Drowned slides over the side, the Ferryman nods as if you have paid an extra fare. The barge grinds onto a mud bank where the river gives up and turns into marsh.`,
      `"They're not bad folk," he says. "They're just people who read too close to the end of something and fell in. Gloam fishes them out and sends them back. End of the line, Reader. Mind the wisps."`,
    ],
    choices: [{ t: 'Step down into the Fenmire', to: 205 }],
  },
  212: {
    title: 'Lantern Light', scene: 'river', actors: [A('hero', -80, 470, 1, 'sit'), A('ferryman', 100, 450, -1, 'talk')],
    once: { flag: 'ferryLore2' },
    text: [
      `The Ferryman hangs a blue lantern from the prow. One by one the Drowned close their grey eyes and nod off, like old men in church.`,
      `"I carry endings," he says, poling slowly through the mist. "Always have. When a story's done, the last page goes in my boat and I take it somewhere quiet. Then he came along with his shears and paid me to stop. Paid me in pages. Thirty pages of somebody's happy ending." He spits in the river. "I took them. I've been sorry every day since."`,
      `"He wasn't cruel, mind. That's the worst of it. He wept when he paid me."`,
    ],
    choices: [{ t: 'Step down into the Fenmire', to: 205 }],
  },

  /* ---------------- the Fenmire hub ---------------- */
  205: {
    title: 'The Fenmire', scene: 'fen', actors: [A('tassel', 40, 380)],
    text: (st) => [
      `The Fenmire stretches in every direction: black water, grey reeds, dead trees standing up to their knees in mist. Frogs say the same word over and over. You think it might be "help."`,
      `Three lights burn in the mist. A green one, low and steady, from a hut on stilts. A white one that flickers in time with a bell ringing somewhere under the water. And on a low hill to the east, no light at all, just the sound of wolves and the smell of leaves that shouldn't be growing in a bog.`,
      st.meta.visited[245] ? `South, where the road should be, the bog heaves and burps.` : `South, where the road to Saltmere should be, the whole bog seems to be breathing.`,
      `T: Saltmere's past the bog. Everything else is optional. Optional the way vegetables are optional.`,
    ],
    choices: [
      { t: 'Follow the green light to the hut on stilts', to: 220, show: { notVisited: 221 } },
      { t: 'Wade toward the bell ringing under the water', to: 230, show: { notVisited: 231 } },
      { t: 'Climb the hill where the wolves are howling', to: 240, show: { notVisited: 240 } },
      { t: 'Follow the twang of a bowstring', to: 206, show: { notVisited: 203, notQuest: 'rook' } },
      { t: 'Head south toward Saltmere, through the bog', ink: 'crimson', to: 245 },
    ],
  },

  /* ---------------- Mother Fen ---------------- */
  220: {
    title: 'The Hut on Stilts', scene: 'fen', actors: [A('hero', -60, 470)],
    text: [
      `The hut stands on four crooked legs in the water, leaning like a drunk. Its one window glows the green of pond scum with a lamp behind it. A skull on the door has been carefully dusted.`,
      `Before you can knock, the door says, in an old woman's voice: "Oh, come in, come in, you're letting the damp out."`,
    ],
    choices: [{ t: 'Climb the ladder and go in', to: 221 }],
  },
  221: {
    title: 'Mother Fen', scene: 'hut', actors: [A('hero', -150, 470), A('fen', 30, 450, -1, 'talk'), A('tassel', -60, 380)],
    once: { quest: { gloam: 'start' } },
    text: [
      `Inside, it is warm and smells of mint and frog. A cauldron bubbles green. Bundles of dried things hang from the roof and some of them are still twitching. At the fire sits an old woman with moss-green hair and eyes like two drops of lime juice.`,
      `"Hello, ribbon," she says to Tassel. "Still lying to them?" Tassel goes very stiff on your shoulder.`,
      `"Sit, Reader. I know why you're here. Everybody's going to the Folio these days. Even my sister." Her face sours. "Gloam. She's gone over to him. The boy with the shears. She drowns the endings he cuts out, there in the bog, and sings over them until they get up again. She thinks she's being kind. People without endings can't die, you see. That's what he promised them."`,
      `"He was a sweet boy, once," says Mother Fen. "He cried at the end of every story. I don't think he ever stopped."`,
    ],
    choices: [
      { t: 'Ask her to teach you the old ways', ink: 'indigo', to: 222, show: { notCls: 'witch' } },
      { t: 'Promise to deal with Gloam', ink: 'gold', to: 224, show: { notFlag: 'fenPromise' } },
      { t: 'Ask what she meant about Tassel lying', to: 223, show: { notVisited: 223 } },
      { t: 'Thank her and go back into the fen', to: 205 },
    ],
  },
  222: {
    title: 'The Old Ways', scene: 'hut', actors: [A('hero', -100, 470, 1, 'cast'), A('fen', 60, 450, -1, 'cast')],
    once: { learn: 'witch', gift: 'witch_hat', potion: { nightshade: 1 }, xp: 20 },
    text: [
      `"Hexes aren't wicked," says Mother Fen, guiding your fingers through a shape that makes the candle flames lean away. "They're just honest. You look at a person and you say out loud what's rotten in them, and the world agrees with you for a while."`,
      `She teaches you how to sour a man's luck, how to boil the bog into a burst of gas, how to make a bully into the toad he always was. Black cats come in from nowhere to watch.`,
      `"They'll call you a witch now, in the towns," she says. "Wear it like a hat." She hands you one.`,
    ],
    choices: [{ t: 'Back to the fire', to: 221 }],
  },
  223: {
    title: 'Whose Bookmark', scene: 'hut', actors: [A('hero', -100, 470), A('fen', 60, 450, -1, 'point'), A('tassel', -20, 380)],
    text: [
      `Mother Fen laughs, not unkindly. "Ask your ribbon whose book it marked before yours, dear. Ask it what it watched. Ask it why it went looking for a Reader at all."`,
      `T: I'm a ribbon. I mark pages. It's not a mystery. It's stationery.`,
      `Mother Fen just stirs her pot and hums.`,
    ],
    choices: [{ t: 'Back to the fire', to: 221 }],
  },
  224: {
    title: 'A Witch’s Thanks', scene: 'hut', actors: [A('hero', -100, 470), A('fen', 60, 450, -1, 'cheer')],
    once: { flag: 'fenPromise', ally: 'fen', potion: { heal: 2 } },
    text: [
      `"Then I'll come along," says Mother Fen, already reaching for her crook. "Somebody has to say sorry to her afterwards, and it ought to be family."`,
      `She presses two red bottles into your hands. "For the bits where you get hit. There are always bits where you get hit."`,
    ],
    choices: [{ t: 'Back to the fire', to: 221 }],
  },

  /* ---------------- the drowned monastery ---------------- */
  230: {
    title: 'The Drowned Monastery', scene: 'monastery', foes: 'monastery', actors: [A('ash', -170, 420, 1, 'attack')],
    text: [
      `The monastery sits half under the water, its cloister flooded to the waist. Broken pillars stand in rows like teeth. Under the surface a great bell swings back and forth, and every stroke comes up muffled, like a heartbeat heard through a pillow.`,
      `On the only dry stones a monk in orange is fighting, barehanded, with three monks in grey. The grey monks are dead. They have the soft, swollen faces of the Drowned, and they move as fast as he does.`,
      `"Brothers!" he shouts, striking one in the chest so hard its sandals come off. "I am sorry! Please stay down!" They don't.`,
    ],
    choices: [
      { t: 'Jump in and fight beside him', ink: 'crimson', battle: 'monastery', win: 231 },
      { t: 'Back away into the reeds', to: 205 },
    ],
  },
  231: {
    title: 'Brother Ash', scene: 'monastery', actors: [A('hero', -100, 470), A('ash', 60, 450, -1, 'kneel')],
    once: { learn: 'monk', gift: 'wraps_of_ash', ally: 'ash', key: 'authornote1', xp: 35 },
    text: [
      `When the last grey brother lies still, the monk kneels beside him and closes his eyes with two fingers. "Brother Pell. Brother Ozzy. Brother Mung." He says each name as if setting down something heavy.`,
      `"Ash," he says at last. "The last brother of the Margin Order. We kept the Author's notes here, the scraps she wrote in the margins of the Tome. When Gloam flooded the cloister, I saved one." He opens his robe. A folded piece of paper is tied against his chest, dry. "It is yours. It was always meant for a Reader."`,
      `The handwriting is small and crooked, as if written very late at night: "To whoever reads this after me. I could not write the ending. Every time I tried, they faded. So I left the last page blank, and I left it to you."`,
      `"Breathe with me," says Brother Ash, and teaches you to be still, and then to be fast, and then to be both. "I will walk with you to the Folio. My brothers were drowned for a reason. I would like to know what it was."`,
    ],
    choices: [{ t: 'Wade back into the fen', to: 205 }],
  },

  /* ---------------- the Green Hermit ---------------- */
  240: {
    title: 'The Grove on the Hill', scene: 'wood', actors: [A('hero', -150, 470), A('hermit', 60, 450, -1, 'idle'), A('e:wolf', 160, 420, -1), A('e:wolf', 190, 500, -1, 'hurt')],
    text: [
      `On the hill a single grove grows green, as if the Fenmire forgot to rot it. In the middle of it an old man stands knee-deep in the earth, roots growing out of his feet, moss in his beard, a sapling sprouting from his shoulder.`,
      `Two grey wolves lie at his feet. One of them has a black arrow through its leg and is panting.`,
      `"Readers," says the Green Hermit, without opening his eyes. "You trample things. You skip pages. You decide the trees are background. What do you want?"`,
    ],
    choices: [
      { t: 'Kneel and pour a Healing Draught on the wolf’s wound', ink: 'gold', need: { potion: 'heal' }, take: { potion: { heal: 1 } }, to: 241 },
      { t: 'Answer him: "The trees are the story too" (Lore check, 9+)', check: { stat: 'lore', target: 9 }, pass: 241, fail: 242 },
      { t: 'Leave him to his roots', to: 205 },
    ],
  },
  241: {
    title: 'The Green Hermit', scene: 'wood', actors: [A('hero', -100, 470), A('hermit', 60, 450, -1, 'cast'), A('e:wolf', 160, 440, -1)],
    once: { learn: 'druid', gift: 'fen_crook', xp: 30 },
    text: [
      `The Hermit opens his eyes. They are the green of new leaves. "Hm. Not all Readers, then."`,
      `He teaches you to listen to the ground until it answers, to call roots up out of the mud to hold a foe, to wear the shape of a bear when your own shape isn't enough. The wolves sniff your hands and decide you'll do.`,
      `"The thing in the bog is made of every page Gloam has drowned," he says. "Hundreds of stories, packed into one body. Strike it and it comes apart into little ones. Strike those too. And Reader: when you cut the witch free of it, be gentle. She is only doing what grief told her to."`,
    ],
    choices: [{ t: 'Go back down the hill', to: 205 }],
  },
  242: {
    title: 'Background', scene: 'wood', actors: [A('hero', -100, 470), A('hermit', 60, 450, -1, 'idle')],
    text: [
      `The Hermit closes his eyes again. "Words," he says. "Readers are full of them." A root slides gently around your ankle and turns you round to face the way you came.`,
      `"Come back with kinder hands."`,
    ],
    choices: [{ t: 'Go back down the hill', to: 205 }],
  },

  /* ---------------- the bog ---------------- */
  245: {
    title: 'The Bog Horror', scene: 'fen', foes: 'bog', actors: [A('gloam', 260, 360, -1, 'cast')],
    once: { quest: { road: 'bog' } },
    text: [
      `The road south runs straight into the bog and stops. The bog stands up.`,
      `It is a hill of black mud and wet paper, taller than a house, with hundreds of sentences stuck to it and slowly dissolving. Eyes open in it here and there and close again. When it moves you hear a sound like a library being chewed.`,
      `On top of it, legs crossed, sits an old woman in rags with a staff topped by a goat's skull. Her skin is the color of duckweed. She waves.`,
      `"Ooh, a Reader! Did my sister send you? How sweet." Mother Gloam leans forward. "Why fight, pet? Every page I drown gets to stay. Forever. Nobody ends. Isn't that what you'd want for the people you love? Come over to our side. My master is very kind to the people who help him."`,
    ],
    choices: [
      { t: 'Fight the Bog Horror', ink: 'crimson', battle: 'bog', win: 246 },
      { t: 'Listen to what Gloam is offering', ink: 'indigo', to: 247 },
    ],
  },
  246: {
    title: 'Pages in the Mud', scene: 'fen', actors: [A('hero', -60, 470, 1, 'cheer'), A('tassel', 40, 380)],
    once: { questDone: 'road', key: 'drowned_letter', gold: 25, xp: 50 },
    text: (st) => [
      `The Bog Horror comes apart all at once, like a wet book dropped from a height. Pages slap down across the marsh. Hundreds of stories, lying in the mud: a wedding, a war, a recipe for plum cake, a man on his deathbed saying something kind. As you watch, the words begin to fade, gently, the way they are supposed to.`,
      `Mother Gloam lands in the reeds with a squawk, scrambles onto a broom made of bulrushes, and flaps away into the dark. "The Folio, Reader!" she cackles. "Go on, then! The Library has teeth!"`,
      st.run.allies && st.run.allies.includes('fen') ? `Mother Fen watches her sister go and says nothing at all.` : null,
      `In the mud where the Horror stood you find a letter sealed in red wax, somehow dry. It is addressed to Gloam. "The Errata holds Saltmere's bell. No ship sails for the Folio. Keep the Reader in the bog. -V."`,
      `T: V. I don't like V. Nobody good signs things with one letter.`,
    ],
    choices: [{ t: 'Take the south road to Saltmere', to: 250 }],
  },
  247: {
    title: 'Gloam’s Bargain', scene: 'fen', actors: [A('hero', -80, 470), A('gloam', 80, 450, -1, 'talk')],
    once: { flag: 'gloamPact', key: 'black_feather', align: 2, unally: 'fen', questDone: 'road', xp: 30 },
    text: (st) => [
      `"There," says Gloam, sliding down the Horror like a child down a haystack. "Nobody had to get hurt. That's the whole idea, pet. Nobody ever has to get hurt again."`,
      `The Bog Horror sinks back into the marsh with a long, contented burp. The road south is clear.`,
      `Gloam presses a black feather into your palm. Her hand is cold and wet. "When you meet a big red fellow in Saltmere, show him that. He'll let you by. The Master wants to meet you, Reader. He thinks you might understand."`,
      st.run.flags.fenPromise ? `Behind you, faint across the water, you hear a door slam in a hut on stilts.` : null,
      `T: Reader. I want it on record that I hate this.`,
    ],
    choices: [{ t: 'Take the south road to Saltmere', to: 250 }],
  },

  /* ---------------- Saltmere ---------------- */
  250: {
    title: 'Saltmere', scene: 'saltmere', actors: [A('hero', -100, 470), A('sailor', 120, 440, -1, 'idle'), A('villager', 220, 480, -1)],
    once: { quest: { tide: 'start' } },
    text: [
      `Saltmere stands on ten thousand wooden legs above a harbor, a whole city on stilts, its streets made of planks and rope bridges. Paper lanterns hang everywhere, blue and orange, so many that the port glows like a jellyfish in the dark.`,
      `And the sea is wrong. It lies flat and black and perfectly still, smooth as a mirror, not a ripple on it. The ships in the harbor sit on it like toys on a table. Dead fish float belly-up along the docks. The whole town smells of low tide that never goes out.`,
      `"Tide stopped a month back," a sailor tells you, unasked. "Same night the sun went out up north. Somebody nicked the clapper out of the Tide Bell, and the sea just... forgot what to do next. Nothing in, nothing out. Nothing sails."`,
    ],
    choices: [{ t: 'Walk into the Lantern Market', to: 251 }],
  },
  251: {
    title: 'The Lantern Market', scene: 'saltmere', actors: [A('tassel', 40, 380)],
    text: (st) => [
      `The Lantern Market fills a great platform over the water: stalls selling pickled eels, compasses, charms against drowning, and maps that rearrange themselves when you aren't looking. Lanterns sway overhead on long ropes.`,
      `Above the rooftops, at the end of the longest pier, the Tide Bell tower stands black against the stars. No light shows in it. ${st.run.quests.tide && st.run.quests.tide.stage === 'tower' ? 'Somewhere up there, the Red Errata is waiting.' : ''}`,
      `T: Saltmere. Pirates, smugglers, duchesses, and a sea that's stopped working. I feel right at home.`,
    ],
    choices: [
      { t: 'Climb to the Salt Palace and see the Duchess', to: 255 },
      { t: 'Drink at the Drowned Anchor', to: 260 },
      { t: 'Browse the market stalls', to: 252 },
      { t: 'Walk the docks', to: 253, show: { notVisited: 253 } },
      { t: 'Knock three times on the fish-scale door under the market', ink: 'indigo', to: 265, show: { flag: 'guildDoor', notVisited: 266, notFlag: 'guildBroken' } },
      { t: 'Climb the Tide Bell tower', ink: 'crimson', to: 270, show: { any: [{ flag: 'towerWay' }, { key: 'drowned_letter' }, { key: 'black_feather' }] } },
    ],
  },
  252: {
    title: 'Market Stalls', scene: 'saltmere', shop: { name: 'The Lantern Market', market: 'saltmere' }, actors: [A('sailor', 80, 450, -1, 'talk')],
    text: [
      `A one-eyed woman sells cutlasses and long coats, an old man sells potions out of a rowboat, and a boy with a monkey sells you a compass that points at whatever you most want. Yours points straight up the coast. Toward the Folio.`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },
  253: {
    title: 'The Docks', scene: 'saltmere', foes: 'docks',
    text: [
      `The docks are empty except for gulls and the creak of moored ships that cannot sail. Then they aren't empty. Figures drop from the rigging and step out from behind crates: thin, masked, knives out. Bowmen rise on the rooftops.`,
      `"Nothing personal, Reader," says one. "Somebody paid us to make sure you never get on a boat."`,
    ],
    choices: [{ t: 'Fight', ink: 'crimson', battle: 'docks', win: 254 }],
  },
  254: {
    title: 'A Hired Knife', scene: 'saltmere', actors: [A('hero', -60, 470), A('e:cutpurse', 80, 470, -1, 'dead')],
    once: { flag: 'vellumHired', gold: 20, xp: 20 },
    text: [
      `On the leader you find a purse heavy with Folio silver and a slip of paper, folded small. "Delay the Reader by any means. Half now, half when it is done. -V."`,
      `T: V again. Someone very far away really doesn't want us to catch a boat.`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },

  /* the Duchess */
  255: {
    title: 'The Salt Palace', scene: 'hall', actors: [A('hero', -150, 470), A('coralie', 40, 450, -1, 'talk'), A('e:salt_guard', -260, 430, 1), A('e:salt_guard', 220, 430, -1)],
    text: (st) => st.run.flags.robbedDuchess ? [
      `The guards at the Salt Palace lower their spears when they see you. The Duchess has put up posters. They're not flattering. You decide not to go in.`,
    ] : [
      `The Salt Palace is built from the timbers of a hundred wrecked ships, and at the top of it, on a throne carved from a single whale's jaw, sits Duchess Coralie: white hair piled high, a crown of sea glass, a face like a cliff.`,
      `"A Reader," she says. "At last, someone with sense. The Hollow Guild stole the clapper from my Tide Bell. They've wanted my throne for years, and now my city is starving and they sit in their holes and laugh. Raid the Guild. Bring me back my clapper, and I'll give you sixty crowns and passage on my fastest ship."`,
      st.run.flags.vellumHired ? `You notice a silver letter-opener on the arm of her throne, with a small V engraved on the handle.` : null,
    ],
    choices: [
      { t: 'Accept the Duchess’s commission', ink: 'gold', to: 251, give: { quest: { tide: 'duchess' } }, show: (st) => !st.run.flags.robbedDuchess && st.run.quests.tide && !st.run.quests.tide.done && st.run.quests.tide.stage === 'start' },
      { t: 'Ask her about the Folio', to: 256, show: { notFlag: 'robbedDuchess', notVisited: 256 } },
      { t: 'Back to the market', to: 251 },
    ],
  },
  256: {
    title: 'A Silver Offer', scene: 'hall', actors: [A('hero', -150, 470), A('coralie', 40, 450, -1, 'idle')],
    text: [
      `"The Folio," says the Duchess, and her mouth goes thin. "City of paper, run by a Chancellor named Vellum. He sent me a letter the week the tide stopped. Very kind. Very sorry for my trouble. He offered to buy the tide back for me, in exchange for my crown."`,
      `"I told him where he could put his offer. The next morning the Guild was seen near the bell." She turns the letter-opener in her fingers. "Coincidence, I'm sure."`,
      `T: That's two Vs. That's a pattern. I'm a ribbon and even I can see it.`,
    ],
    choices: [{ t: 'Back to the throne room', to: 255 }],
  },

  /* the Drowned Anchor */
  260: {
    title: 'The Drowned Anchor', scene: 'tavern', actors: [A('hero', -150, 470), A('sailor', 30, 460, -1, 'talk'), A('villager', 160, 440, -1, 'sit')],
    once: (st) => (st.run.quests.tide && !st.run.quests.tide.done ? { quest: { tide: 'tower' } } : null),
    text: [
      `The Drowned Anchor is a tavern built inside the hull of a sunken ship, so you drink upside down in the dark with fish looking in at the portholes. Sailors who can't sail sit in silence and drink with great dedication.`,
      `An old sailor with a beard like seafoam beckons you over. "You'll be wanting to know about the red one. Everybody does. Came on a black ship the night the tide stopped, walked down the longest pier in armor all scribbled over with ink, and went up into the Tide Bell tower. Hasn't come down since."`,
      `"They call him the Errata. Means a list of mistakes. Somebody corrected him." He drinks. "He was a Reader once, you know. Came through here years back, with a ribbon on his shoulder, same as you."`,
      `Tassel says nothing at all.`,
    ],
    choices: [
      { t: 'Ask where the Hollow Guild meets (5 crowns)', ink: 'indigo', need: { gold: 5 }, take: { gold: 5 }, to: 261, show: { notFlag: 'guildDoor' } },
      { t: 'Ask about the Reader with the ribbon', to: 262, show: { notVisited: 262 } },
      { t: 'Back to the Lantern Market', to: 251 },
    ],
  },
  261: {
    title: 'A Door Made of Fish', scene: 'tavern', actors: [A('hero', -100, 470), A('sailor', 60, 460, -1, 'point')],
    once: { flag: 'guildDoor' },
    text: [
      `The sailor bites your coin, nods, and lowers his voice. "Under the market there's a door covered in fish scales. Knock three times, then once more, quiet. Tell them the tide sent you. And Reader? Don't lie to Sable. She can always tell."`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },
  262: {
    title: 'The Reader With the Ribbon', scene: 'tavern', actors: [A('hero', -100, 470), A('sailor', 60, 460, -1, 'talk'), A('tassel', -10, 380)],
    once: { flag: 'readerLore' },
    text: [
      `"There've been a few," the old sailor says. "Readers. Every ten years or so one turns up, gets into trouble, saves somebody, and moves on toward the middle of the book. The last but one was a gentle lad. Edmund, he said his name was. Sad eyes."`,
      `"He told me something I never forgot. He said every time he finished a story, the people in it faded, like breath off a window. Just went pale and stopped. He said he couldn't bear it any more." The sailor shrugs. "Then the one in red came, years later, chasing after him. And now here you are."`,
      `T: ...Can we not do this here. Please.`,
    ],
    choices: [{ t: 'Let it drop, for now', to: 260 }],
  },

  /* the Hollow Guild */
  265: {
    title: 'The Hollow Guild', scene: 'guild', actors: [A('hero', -160, 470), A('sable', 40, 450, -1, 'idle'), A('e:cutpurse', 170, 420, -1), A('e:guild_bruiser', 220, 500, -1)],
    text: (st) => [
      `Behind the fish-scale door, a ladder goes down into the hollow inside the pilings: a whole hidden town of rope ladders and lantern light under the market, full of thieves counting things.`,
      `Their mistress sits cross-legged on a table, cleaning a knife that looks like it's made of the dark between stars. White hair, a black mask, violet eyes. "Sable," she says. "And you're the Reader that everybody's paying to kill. Popular."`,
      `"We didn't take the clapper. The Duchess knows it. Some red knight walked up the pier and took it, and she blamed us because it's convenient. I know how to get into that tower. I'll tell you, for a price."`,
      st.run.quests.tide && st.run.quests.tide.stage === 'duchess' ? `Her eyes flick to the Duchess's seal on your commission. "Or you could try to collect on that. Many have tried."` : `"Her signet ring. The Duchess's. Steal it for us, and my people in her jail walk free."`,
    ],
    choices: [
      { t: 'Challenge Sable to a duel for the secret', ink: 'crimson', battle: 'sable_duel', win: 266 },
      { t: 'Help the Guild rob the Salt Palace', ink: 'indigo', battle: 'palace', win: 267 },
      { t: 'Raid the Guild for the Duchess', ink: 'gold', battle: 'guild', win: 268, show: { quest: 'tide' } },
      { t: 'Climb back up the ladder', to: 251 },
    ],
  },
  266: {
    title: 'A Knife in the Lantern Light', scene: 'guild', actors: [A('hero', -100, 470), A('sable', 60, 450, -1, 'kneel')],
    once: { flag: 'towerWay', learn: 'shadowblade', ally: 'sable', xp: 40, quest: { tide: 'tower' } },
    text: [
      `Sable ends on one knee with your blade at her throat, and she laughs. It is a real laugh, surprised and delighted. "Nobody's done that in nine years."`,
      `She teaches you, there in the lantern light, how to step into a shadow on one side of a room and out of another, how to mark a man for death so the world itself leans toward the knife. "Forbidden, they call this," she says. "Only because it works."`,
      `"The tower's door is sealed with his ink, but the drain at the bottom isn't. Swim up the cistern and you'll come out under the bell." She sheathes her star-dark knife. "And I'm coming. I want to see what's under that red helmet."`,
    ],
    choices: [{ t: 'Climb back up to the market', to: 251 }],
  },
  267: {
    title: 'The Salt Palace Heist', scene: 'hall', actors: [A('hero', -100, 470, 1, 'run'), A('sable', 60, 450, -1, 'cheer')],
    once: { flag: ['towerWay', 'robbedDuchess'], learn: 'shadowblade', ally: 'sable', gold: 40, align: 1, xp: 40, quest: { tide: 'tower' } },
    text: [
      `The Duchess's guards lie groaning on her whalebone floor. Sable pulls the signet ring off a velvet cushion and blows it a kiss. Somewhere a bell is ringing, and it isn't the Tide Bell.`,
      `Back under the market, with half the Guild freed and cheering, Sable keeps her word. She shows you how to walk through shadows and mark a man for death. And she tells you how to get into the tower: up through the drain, into the cistern, out under the bell.`,
      `"I'm coming with you," she says. "Can't let the most interesting person in Saltmere get killed without me."`,
      `T: We just robbed a duchess. For the record. I'm writing it down.`,
    ],
    choices: [{ t: 'Back to the market (quickly)', to: 251 }],
  },
  268: {
    title: 'Rats in the Pilings', scene: 'guild', actors: [A('hero', -100, 470, 1, 'cheer'), A('sable', 80, 470, -1, 'cower')],
    once: { flag: ['towerWay', 'guildBroken'], gold: 60, gift: 'saltmere_coat', align: -1, xp: 40, quest: { tide: 'tower' } },
    text: [
      `The Guild scatters into the dark. Sable, cornered, spits blood and grins up at you through it. "Congratulations. You've helped a duchess. Now go up the tower and ask the man in red where the clapper is, you fool. It was never us."`,
      `The Duchess pays you sixty crowns and a sea captain's greatcoat, and never quite meets your eye.`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },

  /* the Tide Bell */
  270: {
    title: 'The Tide Bell', scene: 'saltmere', foes: 'red_errata',
    text: (st) => [
      `${st.run.flags.towerWay ? 'You come up through the cistern, wet and cold, into a round stone room at the top of the tower.' : 'You climb the outside of the tower in the dark, hand over hand, while the wind tries to pull you off.'} The Tide Bell hangs above you, huge and green with age, silent. No clapper.`,
      `Beneath it stands a knight in red plate, taller than any man. Every inch of his armor is covered in writing, and every line of the writing has been scratched out. The clapper of the bell, a lump of black iron as big as a child, is chained across his back.`,
      `When he speaks, it sounds like a quill scratching through paper. "READER. ARRIVED. STRIKE THAT. REPLACE WITH: NO ONE CAME."`,
    ],
    choices: [
      { t: 'Fight the Red Errata', ink: 'crimson', battle: 'red_errata', win: 271 },
      { t: 'Show him Gloam’s black feather', ink: 'indigo', need: { key: 'black_feather' }, to: 272, show: { key: 'black_feather' } },
    ],
  },
  271: {
    title: 'He Was a Reader Once', scene: 'saltmere', actors: [A('hero', -80, 470), A('errata', 80, 450, -1, 'kneel')],
    once: { key: ['clapper', 'authornote2'], xp: 60, gold: 30, flag: 'erratabeaten' },
    text: [
      `The Errata drops to one knee. His helm cracks down the middle, and through the gap you see a face: young, tired, ink running from his eyes like tears. For a moment the scratching voice stops, and someone else is speaking.`,
      `"I followed him. Edmund. I was going to stop him. I got as far as the Folio, and the Chancellor's people caught me, and they... corrected me. Struck out my name. Wrote orders where it used to be."`,
      `He presses something into your hand: a folded scrap of paper in a crooked hand you have seen before. "The Reader before you will try to stop you. Do not hate him. He loved them too much." Then the scribbles crawl back over his face, the helm seals, and he steps backward off the tower into the dark.`,
      `There is no splash. T: Corrections don't die, Reader. They get reissued. We'll see him again.`,
    ],
    choices: [{ t: 'Hang the clapper in the bell', to: 273 }],
  },
  272: {
    title: 'The Black Feather', scene: 'saltmere', actors: [A('hero', -80, 470), A('errata', 80, 450, -1, 'idle')],
    once: { key: 'clapper', align: 1, xp: 30 },
    text: [
      `The Errata looks at the feather for a long time. Then he unchains the clapper and sets it at your feet, as gently as a man setting down a sleeping child.`,
      `"THE MASTER IS EXPECTING YOU," he scratches. "THE CHANCELLOR WILL SEND A CARRIAGE. STRIKE: CARRIAGE. REPLACE WITH: SHIP."`,
      `T: He gave it to you. He just... gave it to you. That should feel like winning. Why doesn't it feel like winning?`,
    ],
    choices: [{ t: 'Hang the clapper in the bell', to: 273 }],
  },
  273: {
    title: 'The Tide Comes In', scene: 'saltmere', actors: (st) => { const a = [A('hero', -60, 470, 1, 'cheer'), A('villager', 140, 450, -1, 'cheer'), A('sailor', 220, 430, -1, 'cheer')]; if (!st.run.flags.robbedDuchess) a.push(A('coralie', -220, 450, 1, 'cheer')); return a; },
    once: { unkey: 'clapper', questDone: 'tide', xp: 60, potion: { heal: 2, quicksilver: 1 } },
    text: (st) => [
      `You heave the clapper up onto its hook and swing it, once. The Tide Bell speaks.`,
      `It is the deepest sound you have ever heard, a sound you feel in your teeth. All across Saltmere, people stop and look up. Then, very slowly, the black glass of the harbor wrinkles. A wave lifts the first ship an inch. The sea breathes in, and the tide comes rolling home under ten thousand wooden legs.`,
      `The whole town goes mad with joy. Lanterns are thrown into the air. Someone kisses a fish.`,
      st.run.flags.robbedDuchess ? `The Duchess sends a message, carried by a very nervous page. It says that you are banished from Saltmere forever, and also that she has arranged your passage to the Folio on her fastest ship, and that if you ever tell anyone about the second part she will have you drowned.` : `Duchess Coralie comes down to the docks herself, crown askew, and shakes your hand in front of everyone. "My fastest ship," she says. "The Gull. She sails at midnight, for the Folio."`,
    ],
    choices: [{ t: 'Board the Gull for the Folio', to: 275 }],
  },
  275: {
    title: 'Crossing', scene: 'deck',
    actors: (st) => { const a = [A('hero', -60, 470, 1, 'idle'), A('tassel', 20, 380)]; (st.run.allies || []).slice(0, 4).forEach((id, i) => a.push(A(id, 110 + i * 70, 430 + (i % 2) * 50, -1, i % 2 ? 'sit' : 'idle'))); return a; },
    text: (st) => [
      `The Gull runs north under a sky crowded with stars. For the first time since you woke on the Barrow Moor, nobody is trying to kill you. Somebody has found a fiddle. The sea makes the small talking noises it is supposed to make.`,
      st.run.allies && st.run.allies.length ? `Your companions sit around the lantern on the deck, telling each other lies about the Fenmire. ${allyNames(st)[0]} keeps looking north, where a light is growing on the horizon: not dawn, but a city, burning with ten thousand windows.` : `You sit alone at the prow and watch the horizon, where a light is growing: not dawn, but a city, burning with ten thousand windows.`,
      `T: Reader. When we get there, I'm going to have to tell you something. About me. About him. I'd like it noted that I'm not looking forward to it.`,
      `T: But not yet. Look. There it is. The Folio.`,
    ],
    choices: [{ t: 'Close Chapter II', ink: 'gold', endChapter: 'III' }],
  },
});
