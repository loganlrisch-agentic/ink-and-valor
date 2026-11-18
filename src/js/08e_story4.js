/* ==========================================================================
   Chapter IV - The Last Page
   The Bindery. Edmund the Unbinder. Heroes against villains, or the reverse.
   ========================================================================== */
Object.assign(ENDINGS, {
  author: 'The End, At Last',
  newauthor: 'The New Author',
  mercy: 'The Binder’s Apprentice',
  middle: 'The Long Middle',
  trick: 'Snip',
});
BATTLES.finale_hero_b = Object.assign({}, BATTLES.finale_hero, { title: 'The Last Page', waves: [[{ t: 'unbinder', dx: 180, y: 450 }, { t: 'vellum', dx: 300, y: 380 }, { t: 'gloam', dx: 300, y: 510 }]], allies: [{ t: 'errata', dx: -120, y: 380 }] });

const finaleAllies = (st) => (st.run.allies || []).slice(0, 3).map((id) => CHAMPS[id] ? CHAMPS[id].name : id);

Object.assign(SECTIONS, {
  400: {
    title: 'The Bindery', scene: 'bindery', chapterStart: true,
    actors: (st) => { const a = [A('hero', -150, 470), A('unbinder', 80, 440, -1, 'idle'), A('tassel', -60, 390)]; if (st.run.flags.vellumPact) { a.push(A('vellum', 220, 400, -1, 'idle')); a.push(A('gloam', 230, 500, -1, 'idle')); } return a; },
    text: [
      `The Bindery is smaller than you expected. A stone room, round, warm with candles. Old printing presses stand against the walls like sleeping animals. Loose pages hang on strings from the ceiling, thousands of them, each one a last page, each one cut out of a story that will now never close.`,
      `In the middle of the room, on a lectern, lies an enormous open book. A young man stands beside it, reading. His hair is white, though his face is not old. His grey coat is too big for him. His eyes are red from crying, and you get the feeling they have been red for years.`,
      `Hanging on the wall behind him are the shears: tall and silver and simple, like a pair of tailor's scissors made for a giant.`,
      `"Hello, Tassel," says Edmund Marrow, without looking up. "You found another one." Then he turns to you, and smiles, and it is the saddest smile you have ever seen. "Hello, Reader. I'm so sorry about all the trouble. Please, sit down. I'd like to explain."`,
    ],
    choices: [{ t: 'Hear him out', to: 401 }],
  },
  401: {
    title: 'The Offer', scene: 'bindery', actors: [A('hero', -150, 470), A('unbinder', 80, 440, -1, 'talk'), A('tassel', -60, 390)],
    text: (st) => [
      `"Do you know what happens when a story ends?" Edmund says. "I do. I read thousands of them, sitting here, before she closed them. The last line comes, and everyone in the story goes quiet. Not dead. Worse. Finished. They stop, like a clock nobody winds."`,
      `"So I stopped it. Nobody ends now. Not the knight, not the goatherd, not the girl drowned in the river. They all get to stay." He touches the open book gently. "Yes, it's dark. Yes, the dead walk and the sea won't move. But they're here. Isn't that better than gone?"`,
      `T: It isn't, Edmund. You know it isn't. You made them a night that never ends and called it kindness.`,
      `He takes the shears down from the wall and holds them out to you, handles first. "I'm so tired, Reader. Take them. You'll never have to watch anyone end. Not ever."`,
      st.run.flags.vellumPact ? `Behind him, Vellum nods at you encouragingly. Gloam clasps her hands.` : null,
    ],
    choices: [
      { t: 'Refuse him. Stories deserve their endings.', ink: 'gold', to: 402 },
      { t: 'Read him the Author’s three notes', ink: 'gold', need: { keyCount: [['authornote1', 'authornote2', 'authornote3'], 3, 'notes from the Author'] }, to: 403, show: { notVisited: 403 } },
      { t: 'Take the shears', ink: 'indigo', need: { alignMin: 3 }, lock: { alignMin: 3 }, to: 410 },
      { t: 'Reach for the shears, then cut his own thread instead (Grace check, 11+)', ink: 'indigo', check: { stat: 'grace', target: 11 }, pass: 433, fail: 402 },
    ],
  },
  402: {
    title: 'Then Let It End', scene: 'bindery', once: { potion: { heal: 2, ironbark: 1 } },
    actors: (st) => { const a = [A('hero', -150, 470), A('unbinder', 120, 440, -1, 'cast'), A('vellum', 230, 380, -1, 'idle'), A('errata', 230, 500, -1, 'idle')]; (st.run.allies || []).slice(0, 3).forEach((id, i) => a.push(A(id, -250 - (i % 2) * 40, 390 + i * 50, 1, 'idle'))); return a; },
    text: (st) => {
      const n = finaleAllies(st);
      return [
        `Edmund lowers the shears. He doesn't look angry. He looks like a man who has been told a loved one isn't coming home. "Then I'm sorry," he says. "You'll have to stay in the middle too."`,
        `Lord Chancellor Vellum steps out from behind a press, smoothing his coat. From the shadows by the door comes a sound like a quill scratching through paper, and the Red Errata ducks under the lintel, axe in hand.`,
        n.length ? `And then the roof caves in. ${st.run.allies.includes('hessa') ? 'Old Hessa drops through the hole on a column of lightning, exactly as promised.' : 'Rubble and moonlight pour down.'} Behind you the door bursts open: ${listNames(n)}, out of breath, weapons drawn. "Did you think," says ${n[0]}, "we'd let you have the ending all to yourself?"` : `You are alone. That's all right. Some stories end with one person and a ribbon.`,
      ];
    },
    choices: [
      { t: 'Fight for the last page', ink: 'crimson', battle: 'finale_hero', win: 420 },
      { t: 'Call the Red Errata by his true name: "Corwin."', ink: 'gold', need: { flag: ['knowCorwin', 'erratabeaten'] }, lock: { flag: ['knowCorwin', 'erratabeaten'] }, to: 404, show: { flag: 'knowCorwin' } },
    ],
  },
  403: {
    title: 'The Author’s Notes', scene: 'bindery', actors: [A('hero', -150, 470), A('unbinder', 80, 440, -1, 'kneel'), A('tassel', -60, 390)],
    once: { flag: 'readNotes', xp: 40 },
    text: [
      `You lay the three notes on the lectern, one after another, in the Author's small crooked hand. "I could not write the ending. Every time I tried, they faded." "The Reader before you will try to stop you. Do not hate him." "The shears were never meant to cut endings. They cut the thread when a story is done, so it can rest."`,
      `Edmund reads them. Then he reads them again. His hands start to shake.`,
      `"She knew," he whispers. "She knew they faded. She couldn't bear it either. And she still left the last page to the Reader. She trusted us to..." He looks up at you, and for a moment he looks very young. "Rest. Not stop. Rest. Oh. Oh, what have I done?"`,
      `"Nothing you can't be forgiven for, master," says a smooth voice, as Lord Chancellor Vellum steps out of the shadows. "Don't listen to the Reader. You were right." Behind him, the Red Errata ducks under the lintel, axe in hand.`,
    ],
    choices: [{ t: 'Stand your ground', to: 402 }],
  },
  404: {
    title: 'Corwin', scene: 'bindery', actors: [A('hero', -150, 470), A('errata', 0, 450, -1, 'kneel'), A('unbinder', 160, 440, -1, 'idle'), A('vellum', 240, 390, -1, 'cower')],
    once: { xp: 50 },
    text: [
      `"Corwin," you say.`,
      `The Red Errata stops dead. The scratching voice catches, stutters, goes silent. Across his armor the crossings-out begin to lift off like dry leaves, and under them is writing, real writing, the story of a boy who hummed when he walked.`,
      `His helm splits and falls. "Tassel?" he says, and Tassel makes a sound you didn't know a ribbon could make.`,
      `Corwin turns around, very slowly, and looks at Lord Chancellor Vellum. Vellum takes a step backward. "Now, let's be reasonable," he says, as Mother Gloam scuttles out of the stacks to stand beside him.`,
    ],
    choices: [{ t: 'Fight for the last page, side by side', ink: 'crimson', battle: 'finale_hero_b', win: 420 }],
  },

  /* ---------------- the villain path ---------------- */
  410: {
    title: 'The Shears', scene: 'bindery', actors: [A('hero', -60, 470, 1, 'cast'), A('unbinder', 120, 440, -1, 'kneel'), A('vellum', 220, 400, -1, 'cheer'), A('gloam', 230, 500, -1, 'cheer')],
    once: { unally: HEROES_ALL, align: 2, flag: 'tookShears' },
    text: [
      `The shears are cold, then warm, then part of your hand. You feel every story in the Tome at once, a hundred threads running through the silver, and you understand that you could cut any of them. You could keep them all, forever, just as they are.`,
      `Edmund sinks into a chair and closes his eyes. "Thank you," he breathes. "Oh, thank you. I'm so tired."`,
      `Then the door of the Bindery explodes inward.`,
      `Captain Brannoc comes through it first, Oathblade raised. Sister Amberly is behind him with her book of hours glowing, Inquisitor Vane with his crossbow, and Old Hessa with lightning crawling up her staff. Every one of them looks at the shears in your hand. "Reader," says Brannoc. "Put them down. Please."`,
      `Tassel slips off your shoulder and drifts across the room, and settles on Brannoc's.`,
    ],
    choices: [
      { t: 'Raise the shears. Nobody ends.', ink: 'crimson', battle: 'finale_villain', win: 425 },
    ],
  },

  /* ---------------- endings ---------------- */
  420: {
    title: 'The Last Page', scene: 'bindery', actors: (st) => { const a = [A('hero', -60, 470, 1, 'idle'), A('unbinder', 120, 450, -1, 'kneel')]; (st.run.allies || []).slice(0, 3).forEach((id, i) => a.push(A(id, -220 - (i % 2) * 40, 400 + i * 50, 1, 'cheer'))); return a; },
    once: { xp: 100 },
    text: (st) => [
      `It is over. Vellum is gone, fled or fallen. The shears lie on the stone floor, ringing faintly. Edmund kneels beside the great book with his face in his hands.`,
      `"Go on, then," he says, not looking up. "Finish them. All of them. I won't stop you."`,
      `Thousands of last pages flutter on their strings over your head, waiting. The great book lies open on the lectern at a blank page. On the lectern beside it sits a quill, and a pot of ink that has never been opened.`,
      st.run.flags.readNotes ? `T: She left it to you, Reader. The last page. She always meant to.` : `T: Your choice, Reader. It always was.`,
    ],
    choices: [
      { t: 'Take up the shears and let the stories end, as they should', ink: 'gold', to: 430 },
      { t: 'Hand the shears to Edmund, and sit beside him while he closes the stories', ink: 'gold', to: 432 },
      { t: 'Pick up the quill and write the last page yourself', ink: 'indigo', need: { flag: 'readNotes' }, lock: { flag: 'readNotes' }, to: 431 },
    ],
  },
  430: {
    title: 'The End, At Last', scene: 'dawn', ending: 'author', actors: (st) => { const a = [A('hero', -60, 470, 1, 'cheer'), A('tassel', 30, 380)]; (st.run.allies || []).slice(0, 4).forEach((id, i) => a.push(A(id, 110 + i * 70, 440 + (i % 2) * 40, -1, 'cheer'))); return a; },
    text: [
      `You take the silver shears, and one by one you tie off the stories of the Tome. Not cutting out their endings: giving them back. Each last page slides home into its book, and you snip the thread, gently, the way a good Binder should.`,
      `In Saltmere the tide turns, and turns again. In the Fenmire the Drowned lie down in the reeds and sigh. On the Barrow Moor, far away, the second moon finally sets. And in a hundred stories at once, the sun comes up.`,
      `Edmund watches you close the last one, and weeps, and then, for the first time in years, he laughs. "They didn't stop," he says. "Look. They're still there. They're just... resting."`,
      `T: That's the thing about endings, Reader. The people in them don't go anywhere. They stay right where the reader left them. Happy, mostly. Thanks to you.`,
      `THE END. (At last.)`,
    ],
  },
  431: {
    title: 'The New Author', scene: 'dawn', ending: 'newauthor', actors: [A('hero', -40, 470, 1, 'cast'), A('tassel', 50, 380), A('unbinder', 160, 450, -1, 'idle')],
    text: [
      `You dip the quill in the unopened ink and set it to the blank last page of the Tome. You don't know what to write. Then you do.`,
      `You write the tide turning in Saltmere and the sun rising on Quillsby. You write Mabel back in Wren's arms. You write Corwin humming as he walks home. You write Mother Fen and Mother Gloam arguing over a cauldron, and a goblin king without a crown learning to bake bread. You write an ending for Edmund too, a kind one, where he sleeps for a very long time and wakes up somewhere with a lot of sunlight.`,
      `And at the very bottom of the page, in small crooked letters very like the Author's, you write: "To whoever reads this after me. It's all right. They don't fade. They rest. Turn the page."`,
      `T: You know what this makes you, don't you? An Author. I'm going to need a much bigger ribbon.`,
      `THE END.`,
    ],
  },
  432: {
    title: 'The Binder’s Apprentice', scene: 'bindery', ending: 'mercy', actors: [A('hero', -60, 470, 1, 'sit'), A('unbinder', 70, 450, -1, 'cast'), A('tassel', 0, 390)],
    text: [
      `You pick up the shears and put them back into Edmund's hands. He stares at you. "I can't," he says. "I can't do it. I can't watch them stop."`,
      `"Then don't watch alone," you tell him, and pull up a chair.`,
      `It takes all night. Story by story, he closes them, and you read each last page aloud as he does. The knight gets home. The goatherd gets better. The drowned girl sleeps. And each time, Edmund looks for the fading he's so afraid of, and each time, instead, he sees the people in the story settle, like someone sinking into a warm bath after a long day.`,
      `By dawn he is smiling. He hangs the shears back on the wall, where they belong, and writes his name in the Binder's ledger. Under it, in the space for an apprentice, he writes yours.`,
      `T: A Binder and his Reader. You know, I always thought this was how it should have gone the first time.`,
      `THE END.`,
    ],
  },
  425: {
    title: 'The Long Middle', scene: 'bindery', ending: 'middle', actors: [A('hero', -40, 470, 1, 'cast'), A('unbinder', 120, 450, -1, 'sit'), A('vellum', 220, 400, -1, 'cheer'), A('gloam', 230, 500, -1, 'cheer')],
    text: [
      `When it is over, the heroes of Quillsby lie still on the Bindery floor. Not dead. Nobody dies any more. They are only stopped, in the middle of their story, the way everyone is now.`,
      `You hang the shears on your belt. Vellum pours the wine. Gloam sings a drowning-song to the great open book, and the presses start up again, printing the middle of every story over and over, forever, with no last page.`,
      `Out in the Tome, the night goes on. The tide stays where it is. The dead walk and the living wait. Nobody ends. Nobody ever ends again.`,
      `Somewhere far away, in a paper city that never sees the sun, a red ribbon is looking for another Reader.`,
      `THE END. (Or, rather, not.)`,
    ],
  },
  433: {
    title: 'Snip', scene: 'dawn', ending: 'trick', actors: [A('hero', -60, 470, 1, 'cheer'), A('tassel', 30, 380)],
    once: { xp: 120 },
    text: [
      `You reach for the shears, and Edmund smiles with relief, and lets go. And before he can blink, before Vellum can shout, you find the one thread in the Tome you hadn't looked for: his.`,
      `Snip.`,
      `Edmund Marrow's story closes. He gasps, and then he settles, and the look on his face is not fear at all. It's rest. "Oh," he says softly. "Oh. That's not so bad." And he's gone, gently, like a candle at the end of a long evening.`,
      `Vellum flees. The Errata's red armor falls away in pieces. And you spend the rest of the night with the shears, tying off every story that Edmund cut, one after another, until the sun comes up over a hundred worlds at once.`,
      `T: That was the slyest, kindest, most terrifying thing I've ever seen. Remind me never to hand you scissors.`,
      `THE END.`,
    ],
  },
});
