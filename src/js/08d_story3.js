/* ==========================================================================
   Chapter III - The Library of Teeth
   The Folio, the paper capital: Scriveners, Barrow Keepers, the Chancellor,
   and the Library that guards the Bindery door.
   ========================================================================== */
Object.assign(QUESTS, {
  folio: { title: 'The Library of Teeth', giver: 'Tassel', main: true, stages: { start: 'The Bindery door lies beyond the Library of Teeth. Only the Chancellor’s seal opens it.', seal: 'You have the seal. The Library of Teeth is waiting.' } },
  margins: { title: 'Trouble in the Margins', giver: 'Archivist Quire', stages: { start: 'Things are escaping from the margins of the Scriveners’ Hall.' } },
  barrow: { title: 'The Sunken Barrow', giver: 'Keeper Lantry', stages: { start: 'The dead under the Folio will not stay buried. Their king refuses his ending.', king: 'Face the Barrow King on his throne of bones.' } },
});
Object.assign(KEY_ITEMS, {
  authornote3: { name: 'A Note in the Margin (III)', desc: '"The shears were never meant to cut endings. They cut the thread when a story is done, so it can rest."' },
  library_seal: { name: 'The Chancellor’s Seal', desc: 'Red wax and a golden V. The Library of Teeth opens its mouth for it.' },
});
const HEROES_ALL = ['brannoc', 'amberly', 'nim', 'vane', 'hessa', 'pip', 'ulfgar', 'ash', 'fen', 'sable', 'quire', 'aldric'];

Object.assign(SECTIONS, {
  300: {
    title: 'The Folio', scene: 'folio', chapterStart: true, actors: (st) => [A('hero', -120, 470), A('e:errata_soldier', 120, 440, -1, 'idle'), A('e:errata_soldier', 200, 500, -1, 'idle'), A('scribe', -250, 430, 1, 'idle')],
    once: { quest: { folio: 'start' }, xp: 20 },
    text: (st) => [
      `The Folio is a city made of paper. Its towers are stacks of pages a hundred feet tall, bound with iron bands and roofed with leather. Its streets are paved with old title pages. Its people are stained with ink to the elbow, and they walk fast, heads down, the way people walk when somebody is watching.`,
      `Everywhere there is writing. On the walls, on the banners, on the clothes. NOTICES. ORDERS. CORRECTIONS. Red-armored soldiers stand on every corner, their armor scribbled over just like the Errata's, their eyes glowing the color of a fresh mistake.`,
      st.run.flags.gloamPact ? `At the dock, two red soldiers are waiting for you. They bow. "The Chancellor sends his compliments, Reader. Welcome to the Folio."` : `At the end of the dock is a booth with a sign: CORRECTION OFFICE. ALL ARRIVALS MUST BE CHECKED FOR ERRORS. A clerk with a pen behind each ear looks you up and down and starts writing.`,
    ],
    choices: [
      { t: 'Walk past the soldiers into the city', ink: 'indigo', to: 302, show: { flag: 'gloamPact' } },
      { t: 'Answer the clerk’s questions', to: 301, show: { notFlag: 'gloamPact' } },
      { t: 'Fight your way through the checkpoint', ink: 'crimson', battle: 'checkpoint', win: 302, show: { notFlag: 'gloamPact' } },
    ],
  },
  301: {
    title: 'Name, Purpose, Ending', scene: 'folio', actors: [A('hero', -100, 470), A('scribe', 60, 450, -1, 'talk'), A('e:errata_soldier', 180, 440, -1, 'idle')],
    text: [
      `"Name," says the clerk, without looking up. "Purpose of visit. Expected ending." He waits, pen poised. "Expected ending, please. We can't let you in without one. Unauthorized endings are illegal in the Folio by order of the Lord Chancellor."`,
      `T: Lie. Lie beautifully. I believe in you.`,
    ],
    choices: [
      { t: '"Happily ever after. Paperwork’s in the post." (Wits check, 10+)', ink: 'indigo', check: { stat: 'wits', target: 10 }, pass: 302, fail: { battle: 'checkpoint', win: 302 } },
      { t: '"My ending is none of your business."', ink: 'crimson', battle: 'checkpoint', win: 302 },
    ],
  },
  302: {
    title: 'The Paper City', scene: 'folio', actors: [A('tassel', 40, 380)],
    text: (st) => [
      `From the middle of the Folio you can see the whole city: towers of stacked paper leaning together like gossips, bridges of rope and ribbon, and the long red banners of the Chancellor hanging from every roof.`,
      `At the very center rises a black building with no windows at all, its doors shaped like an open mouth. Even from here you can see the teeth. The Library. Behind it, small and old and dark, is the Bindery.`,
      st.run.keys.includes('library_seal') ? `The Chancellor's seal is warm in your pocket. The Library is waiting.` : `T: The Library only opens for the Chancellor's seal. We'll need it, or a very good idea. Preferably both.`,
    ],
    choices: [
      { t: 'Visit the Scriveners’ Hall', to: 310, show: { notVisited: 311 } },
      { t: 'Find the Barrow Keepers at the cemetery gate', to: 320, show: (st) => !(st.run.once[323] || st.run.once[324] || st.run.once[325]) },
      { t: 'Browse the Paper Market', to: 303 },
      { t: 'Answer the Chancellor’s invitation', ink: 'gold', to: 330, show: (st) => (st.run.once[311] || st.run.once[321] || st.run.flags.gloamPact) && !st.run.once[331] },
      { t: 'Approach the Library of Teeth', ink: 'crimson', to: 340, show: { key: 'library_seal' } },
    ],
  },
  303: {
    title: 'The Paper Market', scene: 'folio', shop: { name: 'The Paper Market', market: 'folio' }, actors: [A('scribe', 80, 450, -1, 'talk')],
    text: [
      `Stalls sell ink in a hundred colors, quills from birds that don't exist, and weapons forged from old typesetting lead. A woman sells second-hand endings in jars; she glances around nervously each time someone buys one.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- the Scriveners ---------------- */
  310: {
    title: 'The Scriveners’ Hall', scene: 'archive', foes: 'margin', actors: [A('quire', -220, 430, 1, 'cast')],
    once: { quest: { margins: 'start' } },
    text: [
      `The Scriveners' Hall is long and quiet and smells of candle smoke and old paper. Rows of scriveners sit at sloping desks copying the stories of the Tome by hand, one word at a time, so that nothing is ever lost.`,
      `Then a shelf falls over. Then another. From the margins of an open book on the central lectern, something is climbing out: long, black, four-legged things made of doodles and crossings-out, with red eyes and too many teeth. Scriveners scatter, shrieking, spilling ink.`,
      `A woman in a scholar's mitre stands her ground at the lectern, a long quill held like a spear. "Margin hounds!" she shouts. "Somebody's torn the edges! Don't let them get into the main text!"`,
    ],
    choices: [{ t: 'Defend the Hall', ink: 'crimson', battle: 'margin', win: 311 }],
  },
  311: {
    title: 'Archivist Quire', scene: 'archive', actors: [A('hero', -110, 470), A('quire', 50, 450, -1, 'talk'), A('scribe', 180, 430, -1, 'cower')],
    once: { questDone: 'margins', learn: 'scrivener', item: 'quillspear', ally: 'quire', key: 'authornote3', xp: 45 },
    text: [
      `"Quire," says the scholar, pushing her spectacles up with an inky finger. "Archivist. Thank you. The margins have been tearing all month. Stories with no endings fray at the edges, and things get out."`,
      `She shows you the oldest secret of the Hall: that a word written with enough meaning becomes true for a little while. She has you write STOP on a margin hound, and it stops. She has you write SHIELD on yourself, and the next blow slides away.`,
      `"Here." From inside the lectern she takes a scrap in a familiar crooked hand. "The Author's. We've kept it for three hundred years. 'The shears were never meant to cut endings. They cut the thread when a story is done, so it can rest.'"`,
      `"Come back to the Hall when you go to the Bindery," says Quire. "I'd like to be there. I've spent my whole life copying endings. I'd like to see one happen."`,
    ],
    choices: [
      { t: 'Ask about the Bindery and the shears', to: 312, show: { notVisited: 312 } },
      { t: 'Back to the city', to: 302 },
    ],
  },
  312: {
    title: 'The Binder’s Apprentice', scene: 'archive', actors: [A('hero', -110, 470), A('quire', 50, 450, -1, 'talk'), A('tassel', -20, 380)],
    once: { flag: 'edmundLore' },
    text: [
      `"The Binder ties off the stories," says Quire. "When a story is finished, she cuts the last thread with the silver shears, and the story closes and rests. That's all an ending is: a story allowed to rest."`,
      `"The last Binder took an apprentice. A Reader. Edmund Marrow. A gentle, clever boy who wept at every story he finished. He worked beside her for years, reading the last page of every story in the Tome before she closed it. Thousands of endings. Thousands of people going quiet."`,
      `"A month ago the Binder died. She was very old. And the next night, Edmund took the shears and started cutting out the last pages instead. So nothing would ever have to close again." Quire looks at the ribbon on your shoulder. "They say he had a bookmark. A red one."`,
      `Tassel is very still.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- the Barrow Keepers ---------------- */
  320: {
    title: 'The Barrow Keepers', scene: 'churchyard', actors: [A('hero', -140, 470), A('keeper', 40, 450, -1, 'talk')],
    once: { quest: { barrow: 'start' } },
    text: [
      `The Folio buries its dead in paper coffins in the catacombs under the city, and the Barrow Keepers stand guard at the gate with lanterns and chains. Tonight the gate is rattling.`,
      `"Keeper Lantry," says the old man in charge, without taking his eyes off the gate. His lantern burns a cold blue. "The dead down there won't stay quiet. Their king won't let them. The Barrow King, they call him: king of a story that was cut before his funeral. He's owed an ending, he says, and he'll take everyone else's until he gets it."`,
      `"He's got the Bindery's old knight chained up down there too. Sir Aldric. A ghost who swore to guard the shears. Swore and failed." Lantry hefts his chain. "Coming down?"`,
    ],
    choices: [
      { t: 'Descend into the Sunken Barrow', ink: 'crimson', battle: 'catacombs', win: 321 },
      { t: 'Not yet', to: 302 },
    ],
  },
  321: {
    title: 'The Keepers’ Way', scene: 'crypt', actors: [A('hero', -100, 470), A('keeper', 60, 450, -1, 'talk')],
    once: { learn: 'gravewarden', quest: { barrow: 'king' }, xp: 40 },
    text: [
      `Lantry looks at the broken skeletons around you and grunts, which seems to be high praise. "You'll do. Here."`,
      `He hands you a lantern. "It remembers names. Hold it up to the dead and say who they were, and most of them will listen. The ones that won't, you chain. And this." A small iron bell. "Ring it and every dead thing nearby remembers it's supposed to be dead."`,
      `Ahead, the tunnel opens into a great vault. Cold blue light pours out of it, and the sound of slow, heavy breathing from something that does not need to breathe.`,
    ],
    choices: [{ t: 'Enter the vault', to: 322 }],
  },
  322: {
    title: 'The Barrow King', scene: 'crypt', foes: 'barrow_king', actors: [A('aldric', -260, 400, 1, 'kneel', { alpha: 0.6 })],
    text: [
      `The Barrow King sits on a throne of skulls in a vault the size of a cathedral. He is a skeleton in rotted royal robes, crowned in cold iron, with blue fire in his eyes. Around him kneel his knights, dead and armored, waiting.`,
      `Against the far wall, chained in silver, kneels the ghost of a knight in white plate, faint as smoke. Sir Aldric.`,
      `"Reader," says the King. His voice is like stones grinding. "My story was cut before my funeral. I never got my last words. I never got my grave. I am owed an ending. Give me yours."`,
    ],
    choices: [
      { t: 'Give him an ending with your weapon', ink: 'crimson', battle: 'barrow_king', win: 323 },
      { t: 'Promise him a proper funeral and last words (Heart check, 11+)', ink: 'gold', check: { stat: 'heart', target: 11 }, pass: 324, fail: { battle: 'barrow_king', win: 323 } },
      { t: 'Command him to kneel, as a necromancer', ink: 'indigo', need: { cls: 'necromancer' }, to: 325, show: { cls: 'necromancer' } },
    ],
  },
  323: {
    title: 'An Ending for a King', scene: 'crypt', actors: [A('hero', -100, 470), A('aldric', 60, 450, -1, 'kneel')],
    once: { questDone: 'barrow', learn: 'paladin', item: ['barrow_blade', 'sun_hammer'], ally: 'aldric', xp: 70, gold: 40 },
    text: [
      `The Barrow King falls apart slowly, the way old buildings do. As his crown rolls across the floor, he says, very quietly, "Thank you." Then he is bones, and then dust, and the blue fire goes out.`,
      `The silver chains fall from Sir Aldric. The ghost stands, and stands, and goes on standing until he is taller than you. Light comes off him like heat off a forge.`,
      `"I swore to guard the shears," he says. "I failed. The boy took them while I wept for his mistress." He puts a hand of cold light on your shoulder. "Let me teach you what I know, so that someone keeps the oath I broke." He teaches you to make your faith into a hammer and a wall.`,
      `"When you go into the Bindery, I go with you. I would like to see the shears put to their proper use, once, before I rest."`,
    ],
    choices: [{ t: 'Climb back up to the city', to: 302 }],
  },
  324: {
    title: 'Last Words', scene: 'crypt', actors: [A('hero', -100, 470, 1, 'kneel'), A('barrow_king', 80, 450, -1, 'talk'), A('aldric', -240, 440, 1, 'idle')],
    once: { questDone: 'barrow', learn: 'paladin', item: ['barrow_blade', 'sun_hammer'], ally: 'aldric', xp: 90, gold: 40, luck: 1 },
    text: [
      `You kneel and ask the King what his last words would have been. He is quiet for a very long time.`,
      `Then he tells you. They are about a daughter, and an apple tree, and a quarrel he was sorry for. You listen to all of it. When he is done he takes off his iron crown, sets it on the floor, lies down on his throne of skulls, and is still. His knights lie down around him.`,
      `The silver chains slip off Sir Aldric. "That," says the ghost, "was well done. Better than I would have done it." He teaches you to make your faith into a hammer and a wall, and swears to walk with you into the Bindery.`,
    ],
    choices: [{ t: 'Climb back up to the city', to: 302 }],
  },
  325: {
    title: 'The Kneeling King', scene: 'crypt', actors: [A('hero', -100, 470, 1, 'cast'), A('barrow_king', 80, 450, -1, 'kneel'), A('aldric', -240, 440, 1, 'idle', { alpha: 0.6 })],
    once: { questDone: 'barrow', learn: 'paladin', item: 'barrow_blade', align: 1, xp: 60, gold: 60, flag: 'kingKnelt' },
    text: [
      `You say the word Veyra taught you, and the Barrow King's blue eyes flicker. Slowly, horribly, he climbs down from his throne and kneels. All around the vault, his knights kneel with him.`,
      `"Master," he says, and hands you his blade.`,
      `Sir Aldric's chains fall away, but the ghost does not thank you. He looks at the kneeling dead for a long time. "I will teach you what I know," he says at last, "because the oath needs keeping. But I will not walk beside a Reader who makes kings kneel." And he fades.`,
    ],
    choices: [{ t: 'Climb back up to the city', to: 302 }],
  },

  /* ---------------- the Chancellor ---------------- */
  330: {
    title: 'An Invitation', scene: 'folio', actors: [A('hero', -100, 470), A('scribe', 80, 450, -1, 'talk')],
    text: [
      `A page in red livery finds you in the street, bows, and offers a card on a silver tray. The card is heavy, cream-colored, sealed with a golden V.`,
      `"The Lord Chancellor Vellum requests the pleasure of the Reader's company at dinner," the page recites, "this evening, at the Chancellery. Dress is formal. Weapons are discouraged. Ending is optional."`,
      `T: Well. At least we finally get to meet V.`,
    ],
    choices: [{ t: 'Go to dinner', to: 331 }],
  },
  331: {
    title: 'Dinner With the Chancellor', scene: 'hall', actors: [A('hero', -150, 470), A('vellum', 50, 450, -1, 'talk'), A('e:errata_soldier', 180, 410, -1), A('e:errata_soldier', 200, 500, -1)],
    text: (st) => [
      `The Chancellery dining hall glitters with crystal and candlelight. The table is set for two. Lord Chancellor Vellum rises to greet you: tall and thin and elegant, in a coat the color of dried blood, with a smile that has been practiced in mirrors.`,
      `"Reader. Do sit. You've had such a long journey. The bog, the docks, the tower." He pours you wine. "I tried so hard to keep you away, you know. For your sake. And now here you are. So let us be honest with each other."`,
      `"I serve the Unbinder because he's right. Every ending is a death. He sat beside the old Binder for years and watched ten thousand stories close, and every person in every one of them went quiet. Now nobody has to. And yes, a story that never ends never needs a new Chancellor. I'm not ashamed of that. Everybody wants something."`,
      `He slides a golden seal across the table. "This opens the Library. Take it. Take a seat at the master's right hand. When Edmund tires, and he will, someone will need to hold the shears. Why not you?"`,
      st.run.flags.gloamPact ? `T: Reader, I know Gloam got to you. I know. But please. Please think.` : `T: Don't. Don't, don't, don't.`,
    ],
    choices: [
      { t: 'Accept the seal, and the Chancellor’s offer', ink: 'indigo', to: 332 },
      { t: 'Pretend to accept, and pocket the seal (Wits check, 11+)', ink: 'indigo', check: { stat: 'wits', target: 11 }, pass: 334, fail: { battle: 'vellum_guards', win: 333 } },
      { t: 'Kick the table over', ink: 'crimson', battle: 'vellum_guards', win: 333 },
    ],
  },
  332: {
    title: 'The Chancellor’s Heir', scene: 'hall', actors: (st) => [A('hero', -100, 470), A('vellum', 60, 450, -1, 'cheer')],
    once: (st) => ({ flag: 'vellumPact', key: 'library_seal', align: 3, unally: HEROES_ALL, quest: { folio: 'seal' }, xp: 40, gold: 80 }),
    text: (st) => {
      const n = allyNames(st);
      return [
        `You take the seal. It is warm, like something alive. Vellum raises his glass. "To the long middle," he says. "May it never end."`,
        n.length ? `When you leave the Chancellery, your companions are waiting outside. They've heard. Of course they've heard. ${listNames(n)} look at the golden V in your hand, and then at you, and one by one they turn and walk away into the paper streets. Nobody says anything. That's the worst part.` : `Outside, the paper city is very quiet.`,
        `Tassel doesn't speak for a long time. When it does, its voice is small. T: I've done this before, you know. Watched a Reader go this way. I thought you'd be different.`,
      ];
    },
    choices: [{ t: 'Go to the Library of Teeth', to: 302 }],
  },
  333: {
    title: 'Dinner Is Ruined', scene: 'hall', actors: [A('hero', -60, 470, 1, 'cheer')],
    once: { key: 'library_seal', quest: { folio: 'seal' }, xp: 50, gold: 30 },
    text: [
      `The Chancellor's soldiers lie among the broken crystal. Vellum himself backs away through a hidden door in the paneling, bleeding ink from a cut across his cheek, still smiling.`,
      `"Such manners," he says. "The master will be so disappointed. He likes Readers." The door shuts. On the floor, among the spilled wine, lies the golden seal.`,
      `T: Grab it. Grab it and let's go before he remembers he dropped it.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },
  334: {
    title: 'A Smile and a Seal', scene: 'hall', actors: [A('hero', -100, 470), A('vellum', 60, 450, -1, 'cheer')],
    once: { key: 'library_seal', flag: 'fakePact', quest: { folio: 'seal' }, xp: 50 },
    text: [
      `You smile your best smile and raise your glass. "To the long middle." Vellum beams and presses the seal into your hand, warm as a living thing. He tells you about the wine, the weather, the beauty of a world where nothing ends, and you nod in all the right places.`,
      `Out in the street, you finally let your face fall. T: That was terrifying. You were terrifying. Remind me never to play cards with you.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- the Library ---------------- */
  340: {
    title: 'The Library of Teeth', scene: 'library', foes: 'library',
    text: (st) => [
      `The Library has a mouth. The doorway is an arch of long, yellow teeth, and as you approach with the seal, it opens wider with a sound like a yawn. Warm air breathes out, smelling of old paper and old meat.`,
      `Inside, the shelves are alive. The books on them blink. Some of the shelves have eyes, red and patient. Shelf wyrms coil along the stacks, and in the aisles the Chancellor's soldiers are waiting, and behind them, cackling on a ladder, is a woman the color of duckweed.`,
      st.run.flags.vellumPact ? `But when they see the golden seal and the way you hold it, the soldiers lower their swords. Mother Gloam claps her hands. "The heir! Oh, pet, I knew you'd understand."` : `"Reader!" Mother Gloam calls down. "We meet again! The master's just through there. You'll have to go through me first, I'm afraid. And all my little friends."`,
    ],
    choices: [
      { t: 'Walk through the Library as the Chancellor’s heir', ink: 'indigo', to: 341, show: { flag: 'vellumPact' } },
      { t: 'Fight through the Library of Teeth', ink: 'crimson', battle: 'library', win: 342, show: { notFlag: 'vellumPact' } },
    ],
  },
  341: {
    title: 'The Library Bows', scene: 'library', actors: [A('hero', -60, 470), A('gloam', 80, 450, -1, 'cheer'), A('e:errata_soldier', 200, 420, -1, 'kneel'), A('e:errata_soldier', -220, 430, 1, 'kneel')],
    once: { questDone: 'folio', xp: 40 },
    text: [
      `The soldiers kneel as you pass. The shelf wyrms coil back into the stacks. The eyes in the shelves close politely. Mother Gloam takes your arm like a favorite aunt and walks you down the long aisle to a small black door at the far end.`,
      `"The Bindery," she whispers. "He's waiting."`,
    ],
    choices: [{ t: 'Stop at the black door', to: 343 }],
  },
  342: {
    title: 'Teeth and Ink', scene: 'library', actors: [A('hero', -60, 470, 1, 'cheer')],
    once: { questDone: 'folio', xp: 80, gold: 40, potion: { heal: 2 } },
    text: (st) => [
      `The last soldier falls, the last shelf wyrm goes limp across the stacks, and Mother Gloam drops her skull-staff with a clatter. She sits down hard on the floor among the scattered books.`,
      `"I only wanted them to stay," she says. "All of them. Is that so terrible?"`,
      st.run.allies && st.run.allies.includes('fen') ? `Mother Fen kneels beside her sister and puts an arm around her. "No," she says. "But they have to be allowed to go, too. Come home, Gloamie." And Gloam, to everyone's surprise, starts to cry.` : `Nobody answers her. After a while she gets up, and wanders off into the stacks, and does not come back.`,
      `At the far end of the Library is a small black door, older than anything in the city.`,
    ],
    choices: [{ t: 'Go to the black door', to: 343 }],
  },
  343: {
    title: 'Tassel’s Confession', scene: 'library', actors: [A('hero', -60, 470), A('tassel', 30, 400)],
    once: { flag: 'knowCorwin' },
    text: (st) => [
      `Before the black door, Tassel slides down off your shoulder and hangs in the air in front of you, red and small and trembling.`,
      `T: I have to tell you now. I was Edmund's bookmark. For years. I marked every last page he ever read. I watched him read ten thousand endings, and I watched him cry over every one, and I watched him get quieter and quieter.`,
      `T: When I saw what he was going to do with the shears, I left him. I went looking for a Reader who could stop him. I found one. His name was Corwin. He was brave and funny and he hummed when he walked. I brought him here, and Vellum caught him and corrected him, and now he wears red armor and doesn't remember his own name.`,
      `T: So I hid. I waited a long time. And then I found you. I'm sorry I didn't tell you. I didn't think you'd come if you knew how it went last time.`,
      st.run.flags.vellumPact ? `T: And now you're going in there as his heir. Maybe that's how this story always goes. Maybe I'm just a ribbon that marks the place where Readers go wrong.` : `T: That's it. That's everything. The door's open. He's in there.`,
    ],
    choices: [
      { t: '"You did right, Tassel. Now let’s finish it."', ink: 'gold', endChapter: 'IV', give: { luck: 1 } },
      { t: 'Say nothing, and open the door', endChapter: 'IV' },
    ],
  },
});
