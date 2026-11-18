/* ==========================================================================
   Chapter III - side quests in the Folio: the Correction Office, the
   Printers' Press and the Inkworks, the Underfolio, the Binder's tomb,
   the Hanging Gardens, the Ribbon Bridges, the Chancellor's vault,
   and two places where the story can end early.
   ========================================================================== */
Object.assign(QUESTS, {
  corrected: { title: 'The Corrected', giver: 'Archivist Quire', stages: { start: 'People are being "corrected" in vats of red ink at the Correction Office. Get them out.' } },
  press: { title: 'Stop the Presses', giver: 'Mother Type', stages: { start: 'Someone is pasting leaflets on every wall: THE END IS COMING. GOOD. Find who.', inkworks: 'Mother Type wants the Inkworks destroyed, where Vellum boils confiscated stories into correcting ink.' } },
  tomb: { title: 'The Binder’s Tomb', giver: 'The Mumbler King', stages: { start: 'The last Binder is buried somewhere under the city. The wordless people of the Underfolio know where.' } },
  garden: { title: 'A Page Among Flowers', giver: 'Old Folio', stages: { start: 'In the Hanging Gardens a single page is kept under glass. It is Vellum’s own ending.' } },
});
Object.assign(KEY_ITEMS, {
  red_pen: { name: 'The Chancellor’s Red Pen', desc: 'A correcting pen from the Correction Office. Whatever it crosses out stays crossed out. Whatever it writes...' },
  authornote4: { name: 'A Note in the Margin (IV)', desc: '"I was a Reader once. Then I stayed too long, and the book asked me to write it."' },
  vellum_page: { name: 'Vellum’s Last Page', desc: 'The final page of a forgotten story. On it, a young clerk named Vellum is forgotten by everyone he ever loved.' },
});
Object.assign(ENDINGS, { chancellor: 'The Paper Throne', copyist: 'The Copyist' });
BATTLES.finale_hero_c = Object.assign({}, BATTLES.finale_hero, { champHp: 1.2, waves: [[{ t: 'unbinder', dx: 180, y: 450 }, { t: 'errata', dx: 300, y: 510 }, { t: 'ink_scribe', dx: 320, y: 380 }, { t: 'corrector', dx: 340, y: 450 }]] });
BATTLES.finale_hero_d = Object.assign({}, BATTLES.finale_hero_b, { champHp: 1.2, waves: [[{ t: 'unbinder', dx: 180, y: 450 }, { t: 'gloam', dx: 300, y: 510 }, { t: 'corrector', dx: 320, y: 380 }]] });

/* ---------------- hooks ---------------- */
SECTIONS[302].choices.splice(3, 0,
  { t: 'Follow the screaming to the Correction Office', ink: 'crimson', to: 700, show: { notVisited: 703 } },
  { t: 'Read the leaflets pasted on every wall', to: 705, show: { notQuestDone: 'press' } },
  { t: 'Climb down a drain into the Underfolio', to: 710, show: { notVisited: 715 } },
  { t: 'Walk across the Ribbon Bridges', to: 725, show: { notVisited: 725 } },
  { t: 'Visit the Hanging Gardens', to: 720, show: { notKey: 'vellum_page' } },
  { t: 'Break into the Chancellor’s vault', ink: 'indigo', to: 730, show: (st) => !st.run.keys.includes('library_seal') && (st.run.keys.includes('red_pen') || (st.run.allies || []).includes('sable') || st.run.classes.includes('rogue') || st.run.classes.includes('shadowblade')) });
SECTIONS[311].choices.push({ t: 'Stay in the Hall. Become a Scrivener.', ink: 'gold', to: 736 });
SECTIONS[331].choices.splice(2, 0, { t: 'Lay Vellum’s own last page on the table', ink: 'gold', need: { key: 'vellum_page' }, to: 723, show: { key: 'vellum_page' } });
SECTIONS[402].choices[0].show = (st) => !st.run.flags.vellumYielded;
SECTIONS[402].choices.splice(1, 0, { t: 'Fight for the last page', ink: 'crimson', battle: 'finale_hero_c', win: 420, show: { flag: 'vellumYielded' } });
SECTIONS[404].choices = [
  { t: 'Fight for the last page, side by side', ink: 'crimson', battle: 'finale_hero_b', win: 420, show: { notFlag: 'vellumYielded' } },
  { t: 'Fight for the last page, side by side', ink: 'crimson', battle: 'finale_hero_d', win: 420, show: { flag: 'vellumYielded' } },
];
{
  const t402 = SECTIONS[402].text, t404 = SECTIONS[404].text;
  SECTIONS[402].text = (st) => { const t = t402(st); if (st.run.flags.vellumYielded) t[1] = `Lord Chancellor Vellum is not here. He is somewhere in the Folio, you hope, reading his own last page and finding it is not as bad as he feared. But a Corrector in a red mitre steps out from behind a press in his place, and from the shadows by the door comes a sound like a quill scratching through paper, and the Red Errata ducks under the lintel, axe in hand.`; return t; };
  SECTIONS[404].text = (st) => { const t = Array.isArray(t404) ? t404.slice() : t404(st); if (st.run.flags.vellumYielded) t[3] = `Corwin turns around, very slowly, and looks at the Corrector who made him. The Corrector takes a step backward. Mother Gloam scuttles out of the stacks to stand beside it.`; return t; };
}

Object.assign(SECTIONS, {
  /* ---------------- the Correction Office ---------------- */
  700: {
    title: 'The Correction Office', scene: 'correction', foes: 'correction',
    once: { quest: { corrected: 'start' } },
    text: (st) => [
      `The Correction Office is a long hall that smells of hot ink and fear. Along both walls stand vats of red ink, steaming. In the vats, up to their necks, stand people. Clerks in red mitres lean over them with long pens and write on their foreheads, and every time a pen touches skin, the person in the vat forgets something.`,
      `"Name?" a clerk asks a weeping old man. "Ambrose." The clerk crosses it out. "Wrong. Your name is Citizen. Your opinion of the Chancellor?" The old man hesitates. The pen moves. "Correct. You adore him."`,
      st.run.allies && st.run.allies.includes('quire') ? `Quire grabs your arm, white-faced. "Tobin. My apprentice. That's him, in the third vat. They took him a week ago."` : `In the third vat a boy in a scrivener's robe is trying very hard to remember his own name, and you can see it slipping.`,
    ],
    choices: [
      { t: 'Smash the vats and fight the clerks', ink: 'crimson', battle: 'correction', win: 702 },
      { t: 'Forge a release order in perfect clerk’s hand (Lore check, 10+)', ink: 'indigo', check: { stat: 'lore', target: 10 }, pass: 703, fail: { battle: 'correction', win: 702 } },
      { t: 'Back away into the street', to: 302 },
    ],
  },
  702: {
    title: 'Red Ink on the Floor', scene: 'correction', actors: [A('hero', -60, 470, 1, 'cheer')],
    once: { xp: 30 },
    text: [
      `The vats crack. Red ink floods the floor and runs out under the door into the gutter, and the people who were standing in it climb out, dripping, blinking, beginning to remember.`,
    ],
    choices: [{ t: 'Help them out', to: 703 }],
  },
  703: {
    title: 'The Corrected', scene: 'correction', actors: [A('hero', -120, 470), A('tobin', 30, 470, -1, 'kneel'), A('villager', 140, 450, -1, 'idle'), A('villager2', 230, 470, -1, 'cower')],
    once: (st) => ({ questDone: 'corrected', key: 'red_pen', item: 'red_pen_dagger', xp: 50, lore: 'correction', potion: (st.run.allies || []).includes('quire') ? { heal: 2 } : null }),
    text: (st) => [
      `Some remember fast. Some don't. A big man in an apron insists, very politely, that he is a teapot, and will not be talked out of it. An old woman remembers her husband's name and sits down on the floor and laughs and cries at the same time.`,
      `The boy in the scrivener's robe stares at his hands for a long time. Then he says, "Tobin. I'm Tobin. I copied the third volume of the Saltmere Chronicles. I put a mistake on page forty on purpose so I'd know it was mine."`,
      (st.run.allies || []).includes('quire') ? `Quire hugs him so hard his spectacles fall off.` : `"Tell Archivist Quire I'm all right," he says. "She'll have been worried. She worries."`,
      `On the head clerk's desk lies a red pen, thick as a finger, warm as a living thing. Whatever it crosses out stays crossed out. You take it. You also take its twin, sharpened to a point.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- the Printers' Press and the Inkworks ---------------- */
  705: {
    title: 'A Message on the Walls', scene: 'folio', actors: [A('hero', -100, 470), A('scribe', 120, 450, -1, 'point')],
    once: { quest: { press: 'start' } },
    text: [
      `Every wall in the street is papered with leaflets, still wet. THE END IS COMING. GOOD. And under that, smaller: ASK WHAT THE CHANCELLOR DOES WITH CONFISCATED STORIES.`,
      `Red soldiers are tearing them down as fast as they can. A boy with an ink-stained cap pastes up three more behind their backs, sees you watching, and jerks his head at an alley.`,
    ],
    choices: [
      { t: 'Follow the boy', to: 706 },
      { t: 'Back to the city', to: 302 },
    ],
  },
  706: {
    title: 'The Press Room', scene: 'inkworks', actors: [A('hero', -140, 470), A('mothertype', 30, 450, -1, 'talk'), A('scribe', 160, 440, -1, 'idle')],
    once: { quest: { press: 'inkworks' } },
    text: [
      `Under a bakery, behind a false oven, the boy leads you into a cellar full of printing presses, clanking and wheezing. Printers in leather aprons look up from their work. Their leader is an old woman with arms like a blacksmith's and a hammer through her belt.`,
      `"Mother Type," she says. "We're the Press. We print the truth, and they tear it down, and we print it again. Today's truth: the Chancellor confiscates stories. Whole books. He takes them to the Inkworks by the river and boils them down for ink, and he uses that ink to correct people."`,
      `"Every corrected man in this city was written over with someone else's story. Boiled-down lullabies. Rendered-down love letters. I want the Inkworks gone. Will you help?"`,
    ],
    choices: [
      { t: 'Go to the Inkworks with the Press', ink: 'crimson', to: 707 },
      { t: 'Not yet', to: 302 },
    ],
  },
  707: {
    title: 'The Inkworks', scene: 'inkworks', foes: 'inkworks',
    text: [
      `The Inkworks is a factory on the river, all chimneys and pipes, and the smoke that comes out of it smells of burnt paper. Inside, books are fed into great iron vats by the cartload. They dissolve with a sound like a crowd sighing. The ink that comes out of the taps at the bottom is so black it seems to eat the light.`,
      `Things move in the vats. Things made of the ink, too big to be inkspawn. They climb out when they see you.`,
    ],
    choices: [
      { t: 'Fight your way to the main vat', ink: 'crimson', battle: 'inkworks', win: 708 },
      { t: 'Poison the vats so they boil over (alchemist)', ink: 'indigo', need: { cls: 'alchemist' }, to: 708, show: { cls: 'alchemist' } },
      { t: 'Swap the labels on the reagent barrels (Lore check, 10+)', ink: 'indigo', check: { stat: 'lore', target: 10 }, pass: 708, fail: { battle: 'inkworks', win: 708 } },
    ],
  },
  708: {
    title: 'Black Rain', scene: 'folio', actors: [A('hero', -100, 470, 1, 'cheer'), A('mothertype', 60, 450, -1, 'cheer'), A('scribe', 180, 440, -1, 'cheer')],
    once: { questDone: 'press', flag: 'inkworksDown', item: 'margin_codex', gold: 40, xp: 60 },
    text: [
      `The main vat goes up like a volcano. A column of black ink shoots out of the roof and comes down over the whole Folio as rain: warm, black rain that smells of old books.`,
      `Where it lands, words appear. On walls, on windows, on people's arms: fragments of the stories that were boiled. "Once upon a time." "I'll always love you." "And they lived." All over the city, people stop in the street and read their own skin and remember things that were never theirs, and some of them start to cry.`,
      `Mother Type wipes ink off her face and grins at you. "Best day's printing I ever did." She gives you a book bound in blue, all footnotes. "From the Press. You've earned it."`,
    ],
    choices: [{ t: 'Ask about the Folio’s real history', to: 709 }, { t: 'Back to the city', to: 302 }],
  },
  709: {
    title: 'The True History', scene: 'inkworks', actors: [A('hero', -100, 470), A('mothertype', 60, 450, -1, 'talk')],
    once: { lore: 'binder' },
    text: [
      `"The Folio wasn't always his," says Mother Type, cleaning her hammer. "When I was a girl, the Binder was the heart of this city. Old Agnes Thrale. She used to walk the Ribbon Bridges every morning and say hello to the bookmarks. People brought her their finished stories like you'd bring a dog to a vet."`,
      `"Then Vellum rose in the Correction Office, and one day nobody could remember what the Binder looked like. Corrected out. The whole city." She spits. "I only remember because I printed her face on a calendar once, and I kept it. They're buried down in the Underfolio somewhere, her and her secrets. Ask the Mumbler. If you can understand him."`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- the Underfolio ---------------- */
  710: {
    title: 'The Underfolio', scene: 'underfolio', actors: [A('hero', -140, 470), A('villager2', 80, 460, -1, 'cower'), A('mumbler', 200, 440, -1, 'idle')],
    once: { quest: { tomb: 'start' } },
    text: [
      `Under the paper city run the sewers, and down the sewers drain all the words nobody used: half-sentences, deleted paragraphs, things people meant to say and didn't. They clog the tunnels like wet leaves.`,
      `People live down here. Their mouths open, but nothing comes out. Their words were corrected out of them, years ago. They talk with their hands, very fast, and when they see you they point you deeper, toward a throne made of broken typesetting where a ragged old man wears a tin crown.`,
      `"The Mumbler King," Tassel whispers. "He speaks only in crossed-out words. Good luck."`,
    ],
    choices: [{ t: 'Approach the Mumbler King', to: 711 }],
  },
  711: {
    title: 'The Mumbler King', scene: 'underfolio', actors: [A('hero', -100, 470), A('mumbler', 80, 450, -1, 'talk')],
    text: [
      `The Mumbler King speaks. Every word comes out already crossed through, a scratchy sound like a pen being dragged across paper: "~~Welcome~~ ~~Reader~~. ~~You~~ ~~seek~~ ~~the~~ ~~Binder~~."`,
      `He waits, head tilted, to see if you understand him.`,
    ],
    choices: [
      { t: 'Listen past the crossings-out (Lore check, 9+)', check: { stat: 'lore', target: 9 }, pass: 712, fail: 713 },
      { t: 'Reply in kind, with your hands', ink: 'gold', need: { cls: 'scrivener' }, to: 712, show: { cls: 'scrivener' } },
    ],
  },
  712: {
    title: 'What the Mumbler Said', scene: 'underfolio', actors: [A('hero', -100, 470), A('mumbler', 80, 450, -1, 'point')],
    once: { xp: 30, lore: 'underfolio' },
    text: [
      `You stop trying to hear the words and listen to what's under them, the way you'd read a letter with half the lines blacked out. It works.`,
      `"Thank you," says the Mumbler King, and for the first time in years someone understands him, and his eyes fill. "We were the Binder's people. Her printers and her pressmen. When Vellum corrected the city, he took our words so we couldn't tell anyone what she was. But we kept her. We carried her down here and buried her where he'd never look." He points down a dark tunnel. "Go gently. She was kind."`,
    ],
    choices: [{ t: 'Follow the tunnel', to: 715 }],
  },
  713: {
    title: 'Rats', scene: 'underfolio', foes: 'sewer',
    text: [
      `You get it wrong. Whatever you say, the Mumbler King hears an insult. He stands up off his throne, and the heaps of unused words around him start to squeak and move. Rats. Hundreds of them, and the long black shapes of margin hounds behind them.`,
    ],
    choices: [{ t: 'Fight', ink: 'crimson', battle: 'sewer', win: 714 }],
  },
  714: {
    title: 'A Grudging Respect', scene: 'underfolio', actors: [A('hero', -100, 470), A('mumbler', 80, 450, -1, 'idle')],
    once: { xp: 25, lore: 'underfolio' },
    text: [
      `When the last rat flees, the Mumbler King sits down again and looks at you for a long time. Then he sighs, scratchily, and points down a dark tunnel. Some things don't need words.`,
    ],
    choices: [{ t: 'Follow the tunnel', to: 715 }],
  },

  /* ---------------- the Binder's tomb ---------------- */
  715: {
    title: 'The Binder’s Tomb', scene: 'tomb', actors: [A('hero', -120, 470), A('tassel', -30, 390)],
    text: [
      `The tunnel ends in a small round room lined with books. In the middle stands a stone coffin, and carved on its lid is an old woman holding a pair of shears across her chest. AGNES THRALE, it says. BINDER. SHE CLOSED THEM GENTLY.`,
      `Candles are burning. Someone down here still lights them every day. Hanging on the wall above the coffin, in the place of honor, is an empty hook the size and shape of a pair of giant scissors.`,
      `Tassel is trembling. "I knew her," it says quietly. "Before Edmund. Before anyone."`,
    ],
    choices: [
      { t: 'Call to her spirit (Spirit check, 10+)', ink: 'gold', check: { stat: 'spirit', target: 10 }, pass: 716, fail: 717 },
      { t: 'Search the shelves around the coffin', to: 717 },
    ],
  },
  716: {
    title: 'Agnes Thrale', scene: 'tomb', actors: [A('hero', -120, 470, 1, 'kneel'), A('agnes', 60, 450, -1, 'talk', { alpha: 0.75 }), A('tassel', -30, 390)],
    once: { questDone: 'tomb', key: 'authornote4', xp: 70, luck: 1 },
    text: [
      `The candles bend toward the coffin, and an old woman sits up through the stone lid, faint and golden, with spectacles on a chain. She looks at you, and then at Tassel, and smiles. "Hello, little ribbon. You came back."`,
      `"Edmund," she says, before you can ask. "My poor boy. He read every ending aloud, so nobody would end alone. I should have read them with him. I let him carry them by himself, and they broke him." She sighs. "He thinks endings are deaths because he only ever saw the last line. He never saw what comes after. The rest."`,
      `"I'll tell you a secret I told only him. The Author was a Reader once. She woke up in this book with a ribbon on her shoulder, just like you. She stayed too long, and the book asked her to write it." She holds out a scrap of paper in a small crooked hand. "She left one more note. For whoever came next."`,
      `"I was a Reader once," it says. "Then I stayed too long, and the book asked me to write it. When your turn comes, don't be afraid of the last page."`,
    ],
    choices: [{ t: 'Thank her, and go back up to the city', to: 302 }],
  },
  717: {
    title: 'The Binder’s Journal', scene: 'tomb', actors: [A('hero', -60, 470, 1, 'idle'), A('tassel', 30, 390)],
    once: { questDone: 'tomb', key: 'authornote4', xp: 50 },
    text: [
      `On the shelf nearest the coffin is a journal in a neat old hand. The last entry: "My boy read sixty endings today. He came back grey. I must tell him what the Author told me, before it is too late. That she was a Reader once. That the last page is not a wall but a door."`,
      `Tucked into the back cover is a scrap in a smaller, crooked hand: "I was a Reader once. Then I stayed too long, and the book asked me to write it. When your turn comes, don't be afraid of the last page."`,
      `T: She never got to tell him. She died that night. And he took the shears.`,
    ],
    choices: [{ t: 'Go back up to the city', to: 302 }],
  },

  /* ---------------- the Hanging Gardens ---------------- */
  720: {
    title: 'The Hanging Gardens', scene: 'gardens', actors: [A('hero', -140, 470), A('gardener', 60, 450, -1, 'idle')],
    once: { quest: { garden: 'start' } },
    text: [
      `On the roof of the tallest tower in the Folio there is a garden of paper flowers: roses folded from love letters, lilies from wedding invitations, a whole bed of poppies made from war poems. They rustle in a wind you can't feel.`,
      `In the middle, under a glass dome, lies a single page. An old gardener with a long beard is polishing the glass. "The Chancellor's," he says, without being asked. "His own last page. He planted this whole garden around it. Comes up here every night to look at it. Never reads it, mind. Can't bring himself to."`,
    ],
    choices: [
      { t: 'Ask the gardener about it', to: 722 },
      { t: 'Lift the glass while he isn’t looking (Grace check, 10+)', ink: 'indigo', check: { stat: 'grace', target: 10 }, pass: 721, fail: 722 },
      { t: 'Leave the garden', to: 302 },
    ],
  },
  721: {
    title: 'A Light Touch', scene: 'gardens', actors: [A('hero', -60, 470, 1, 'idle')],
    once: { key: 'vellum_page', questDone: 'garden', xp: 30 },
    text: [
      `You wait for the gardener to bend over the roses, lift the glass a finger's width, and slide the page out. He doesn't turn around. He hums, and goes on folding a new flower out of somebody's apology.`,
      `T: Reader, that was very good and also very bad. I'm going to choose to be impressed.`,
    ],
    choices: [{ t: 'Read the page', to: 722 }],
  },
  722: {
    title: 'Vellum’s Ending', scene: 'gardens', actors: [A('hero', -100, 470), A('gardener', 60, 450, -1, 'talk')],
    once: { key: 'vellum_page', questDone: 'garden', xp: 30 },
    text: [
      `"He was a clerk," says the gardener, "in a little story about a lighthouse family. Not even a main character. Third clerk from the left. In the last chapter the family sails away and they all forget about him. That's his ending. 'And nobody ever thought of young Vellum again.'"`,
      `"He climbed out of his story and came here, and worked his way up, and made himself the most important man in the Tome, so nobody could ever forget him. And then the boy with the shears offered him a world where no story ever ends. Where his last page never comes." The old man lifts the glass and hands you the page. "Take it. Somebody should read it to him. It's kinder than you'd think."`,
      `You read it. It is a sad little page. It ends: "And nobody ever thought of young Vellum again, except the lighthouse keeper's daughter, who kept the paper flower he folded her all her life."`,
      `T: He never read to the end. He stopped one line short.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },
  723: {
    title: 'The Line He Never Read', scene: 'hall', actors: [A('hero', -150, 470), A('vellum', 50, 450, -1, 'kneel')],
    once: { flag: 'vellumYielded', key: 'library_seal', quest: { folio: 'seal' }, xp: 80 },
    text: [
      `You lay the page on the white tablecloth between the soup and the fish. Vellum goes still. He knows it at once.`,
      `"Don't," he says. "Please." But you read it to him anyway, all the way down, and you read the last line slowly. "...except the lighthouse keeper's daughter, who kept the paper flower he folded her all her life."`,
      `For a long time the Chancellor of the Folio says nothing at all. Then he takes off his golden seal and sets it beside the page. "I never read the last line," he says. "Forty years, and I never..." His voice breaks. "Take it. Take the seal. Go and let the boy end it. I find I'm rather tired of being remembered by people who are afraid of me."`,
    ],
    choices: [{ t: 'Take the seal and go', to: 302 }],
  },

  /* ---------------- the Ribbon Bridges ---------------- */
  725: {
    title: 'The Ribbon Bridges', scene: 'folio', actors: [A('hero', -100, 470), A('gilt', 60, 400, -1, 'idle'), A('tassel', -10, 390)],
    once: { luck: 1, xp: 20 },
    text: [
      `Between the paper towers hang bridges woven from ribbons, swaying over the drop. Hundreds more ribbons hang from their rails like wind-chimes: old bookmarks, retired, faded, chattering among themselves in tiny papery voices.`,
      `"Tassel!" squeaks a frayed gold one. "Tassel, as I live and fray! Everyone, it's Tassel! Still Reading, dear? Still dragging Readers about? How many is this one?"`,
      `Tassel has gone a deeper red than usual. T: Gilt. Hello. This is... we're very busy.`,
    ],
    choices: [
      { t: 'Ask Gilt about Tassel’s past Readers', ink: 'indigo', to: 726 },
      { t: 'Spare Tassel and walk on', ink: 'gold', to: 302 },
    ],
  },
  726: {
    title: 'Gossip on the Bridges', scene: 'folio', actors: [A('hero', -100, 470), A('gilt', 60, 400, -1, 'talk'), A('tassel', -10, 390)],
    once: { flag: 'giltGossip' },
    text: [
      `"Oh, Tassel's had dozens," says Gilt happily, while Tassel tries to hide under your collar. "The sad boy with the white hair. The one who hummed. And before them, oh, years and years before, back when Tassel was a different color entirely, Tassel was the ribbon in the Author's own book."`,
      `"The Author's?" you say. Gilt rustles. "Don't you know? Tassel marked the very last page she ever reached. Right before the blank one. Then she put down her pen and walked off into the margins and nobody saw her again. Tassel's been looking for someone to turn that page ever since."`,
      `T: I don't remember that. I don't. Gilt is very old and gossips terribly.`,
      `Tassel is lying. You've never heard Tassel lie badly before.`,
    ],
    choices: [{ t: 'Walk on, thinking', to: 302 }],
  },

  /* ---------------- the Chancellor's vault ---------------- */
  730: {
    title: 'The Chancellor’s Vault', scene: 'vault', foes: 'vault',
    text: (st) => [
      `${st.run.keys.includes('red_pen') ? 'The red pen gets you through three locked doors: you cross out the locks and they forget they were ever locked.' : 'Getting in takes a ladder, a window, and a great deal of nerve.'} The Chancellor's vault is a round golden room lined with shelves of confiscated stories in chains, chests of Folio silver, and on a velvet stand in the middle, a spare golden seal.`,
      `There are guards, of course. There are always guards.`,
    ],
    choices: [
      { t: 'Slip past the guards to the seal (Grace check, 11+)', ink: 'indigo', check: { stat: 'grace', target: 11 }, pass: 731, fail: { battle: 'vault', win: 732 } },
      { t: 'Take the guards head-on', ink: 'crimson', battle: 'vault', win: 732 },
      { t: 'Use the red pen to write yourself into the Chancellor’s chair', ink: 'indigo', need: { key: 'red_pen' }, to: 735, show: { key: 'red_pen' } },
    ],
  },
  731: {
    title: 'Light Fingers, Golden Seal', scene: 'vault', actors: [A('hero', -60, 470, 1, 'run')],
    once: { key: 'library_seal', gold: 60, quest: { folio: 'seal' }, xp: 50, align: 1 },
    text: [
      `You move between the guards like a draught, lift the seal off its stand, scoop a handful of silver for the road, and are out of the window before anyone looks up.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },
  732: {
    title: 'Vault Cracked', scene: 'vault', actors: [A('hero', -60, 470, 1, 'cheer')],
    once: { key: 'library_seal', gold: 60, quest: { folio: 'seal' }, xp: 50, align: 1 },
    text: [
      `When the last guard goes down you take the seal, and a bag of silver, and on your way out you unchain as many confiscated stories as you can carry and throw them out of the window, where they flap away over the rooftops like birds.`,
    ],
    choices: [{ t: 'Back to the city', to: 302 }],
  },

  /* ---------------- early endings ---------------- */
  735: {
    title: 'The Paper Throne', scene: 'hall', ending: 'chancellor', actors: [A('hero', -40, 470, 1, 'sit'), A('e:errata_soldier', 160, 430, -1, 'kneel'), A('e:errata_soldier', -200, 430, 1, 'kneel'), A('e:corrector', 230, 480, -1, 'kneel')],
    text: [
      `You take the Chancellor's own register from the vault, find the line that says LORD CHANCELLOR: VELLUM, and with the red pen, you correct it.`,
      `By morning nobody in the Folio remembers Vellum at all. They remember you. They always have, they would swear to it. The red soldiers salute you in the street. The Correction Office sends you its reports. You never go to the Library of Teeth. Why would you? Everything is so orderly here.`,
      `Somewhere behind the Library, a sad young man goes on cutting, and the night goes on everywhere, and in the Folio it doesn't matter, because you have decided that it doesn't. You correct anyone who disagrees.`,
      `Some nights you find a red ribbon on your pillow. You can never remember who left it.`,
      `THE END.`,
    ],
  },
  736: {
    title: 'The Copyist', scene: 'archive', ending: 'copyist', actors: [A('hero', -40, 470, 1, 'sit'), A('quire', 100, 450, -1, 'cheer'), A('tobin', 200, 460, -1, 'sit')],
    text: [
      `You put down your weapons and take up a pen. Quire finds you a desk by the window.`,
      `It is quiet work, and slow, and you love it more than you expected to. Every day you copy one ending from the Tome into the great books of the Hall, so that wherever the shears go, at least one copy of every last page survives. Wedding endings. War endings. A dog asleep by a fire. You copy them all.`,
      `You never go to the Bindery. Somebody else does, or nobody does; the Hall is very quiet and very far from such things. But when you are old, the Scriveners' shelves hold ten thousand endings in your hand, and young scribes still come to look at them, and to look at the first one you ever copied, which has a small mistake on page forty that you put there on purpose.`,
      `THE END.`,
    ],
  },
});
