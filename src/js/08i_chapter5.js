/* ==========================================================================
   CHAPTER V - THE LAST PAGE (expanded)
   New opening on the second moon: the walk across the last page, Vellum's
   last gambit, the hall of hanging last pages (which remembers what you did),
   and Agnes at the Bindery door. Then the original Bindery and endings.
   Sections 1600-1699 belong to Chapter V.
   ========================================================================== */
Object.assign(CAST, {
  agnes: { rig: 'human', name: 'Agnes Thrale', skin: SKINS[0], hair: { style: 'bun', color: '#e8e4dc' }, hat: { type: 'kerchief', color: '#5a4a6a' }, body: { type: 'dress', color: '#4a4a5a', trim: '#c8c0d0', belt: '#c9a14a' }, weapon: { type: 'staff', color: '#6a5a4a' }, face: 'old', hunch: 0.4, eyes: { color: '#ffe8b0', glow: true } },
});

Object.assign(BATTLES, {
  moon_siege: { scene: 'whitepage', title: 'The Red Line', boss: 'corrector_general', tier: 1.6, hero: { dx: -200, y: 460 }, waves: [[{ t: 'corrector_general', dx: 240, y: 440 }, { t: 'errata_soldier', dx: 120, y: 400 }, { t: 'errata_soldier', dx: 140, y: 500 }, { t: 'ink_scribe', dx: 320, y: 500 }], [{ t: 'errata_soldier', edge: 1, y: 410 }, { t: 'errata_soldier', edge: -1, y: 490 }, { t: 'corrector', edge: 1, y: 450 }]] },
});

/* every friend who swore to come gets their own entrance at the end */
const FINALE_ENTRANCES = {
  hessa: 'Old Hessa drops through the hole on a column of lightning, exactly as promised.',
  silvermouth: 'Water wells up between the flagstones, and Silvermouth rises out of the floor in a pillar of green light, just as she swore she would.',
  orm: 'Far below, a war-horn sounds, and King Orm Halfbeard and the whole Long Hall come roaring up the stair of pages, singing the fifth deed.',
  sir_doodle: 'A line of ink draws itself across the wall, then a shield, then a plume: Sir Doodle steps off the plaster and salutes.',
  tatters: 'Mister Tatters steps out from behind a press and plants himself in front of the lectern with his arms out wide, as if he had been standing there all along.',
  columbine: 'Something drops from the rafters on a single silver string and lands in a perfect curtsey. Columbine never misses an entrance.',
  isadora: 'A window bursts inward and Captain Isadora Vey swings through it, salutes the room with her silver blade, and says, "Somebody ordered a duel that ends?"',
};
const finaleArrival = (st) => {
  const ids = st.run.allies || [];
  if (!ids.length) return `You are alone. That's all right. Some stories end with one person and a ribbon.`;
  const special = ids.filter((id) => FINALE_ENTRANCES[id]).slice(0, 4);
  const rest = ids.filter((id) => !special.includes(id)).map((id) => (CHAMPS[id] ? CHAMPS[id].name : id));
  const first = CHAMPS[ids[0]] ? CHAMPS[ids[0]].name : ids[0];
  return `And then the roof caves in. ${special.map((id) => FINALE_ENTRANCES[id]).join(' ')}${rest.length ? ` Behind you the door bursts open: ${listNames(rest)}, out of breath, weapons drawn.` : ''} "Did you think," says ${first}, "we'd let you have the ending all to yourself?"`;
};

/* the Bindery scenes, adjusted for what happened on the way up */
(() => {
  const t402 = SECTIONS[402].text;
  SECTIONS[402].text = (st) => {
    const t = (typeof t402 === 'function' ? t402(st) : t402).slice();
    if (st.run.flags.toldEdmund || st.run.flags.readNotes) t[0] = `Edmund stands very still with the shears in his hands, as if he has forgotten what they are for. "I can't undo it," he whispers. "Not alone. Not with them watching." And from every shadow in the Bindery, the people who need him never to undo it step forward.`;
    if (st.run.flags.vellumMoon) t[1] = `Lord Chancellor Vellum is not here. He is sitting on the edge of the last page outside, with a grey story in his lap, reading the margin note over and over. But a Corrector in a red mitre steps out from behind a press in his place, and from the shadows by the door comes a sound like a quill scratching through paper, and the Red Errata ducks under the lintel, axe in hand.`;
    t[t.length - 1] = finaleArrival(st);
    return t;
  };
  SECTIONS[401].choices.splice(1, 0, { t: 'Show him the Author’s sampler from the Drafts', ink: 'gold', to: 1610, show: { flag: 'agnesAuthor', notFlag: 'toldEdmund' } });
})();

const LAST_PAGES = [
  ['belltower', () => `IDA CLAPPER. "...and the bell rang twelve, and the old man came down the tower, and his daughter took his hand, and they went home to supper."`],
  ['scarecrow', (st) => st.run.flags.tattersHome ? `MISTER TATTERS. "...and the crows never came back to Hobb's field, and in the spring the turnips grew the right way up."` : `MISTER TATTERS. "...and the scarecrow kept his watch on the moor, and not one name was ever lost again."`],
  ['collector', () => `TOM BRISK. "...and the next morning, for the first time in a long time, there was a next morning."`],
  ['well', () => `MARTHA GILL. "...and she was not alone when it ended, because somebody had promised."`],
  ['eelwife', (st) => st.run.allies.includes('silvermouth') ? `CORBIN REED AND SILVERMOUTH. "...and they were married under a moon of lanterns, and lived a long time, mostly underwater."` : `CORBIN REED. "...and the water went down, and the Black Pool was still and silver, and somebody was happy in it."`],
  ['duelist', () => `CAPTAIN ISADORA VEY. "Two hundred and seven duels. Two hundred and six won. One lost. Best fight of her life."`],
  ['ball', () => `PRINCESS ODALIE. "...and she walked out into the morning, and never looked back, and what happened next was entirely up to her."`],
  ['hall', () => `KING ORM HALFBEARD. "...and the Long Hall rode out at the end of the world, and Sigrun sang the fifth deed, and it was the best song she ever wrote."`],
  ['winter', (st) => st.run.flags.springCame ? `BRAM THE HUNTSMAN. "...and the first warm wind blew through the forest, and the huntsman went home, and it was spring."` : `THE WHITE STAG. "...and she lay in the snow and waited for spring, and it did not come, and still she waited."`],
];

Object.assign(SECTIONS, {
  1600: {
    title: 'The Last Page of the World', scene: 'whitepage', chapterStart: true,
    actors: [A('hero', -150, 470), A('tassel', -70, 390)],
    text: (st) => [
      `You walk across the last page of the Tome.`,
      `It is very quiet up here. The paper is warm under your feet, faintly ruled, so white it hums. Above and below and all around, the stories of the Tome hang in the dark like lanterns on a long string. You have walked through some of them. You have changed some of them. From up here they look small, and brave, and very far away.`,
      `When you look back, you see that your footprints are filling up with words. Small words, in black ink, in a crooked hand, writing themselves into the page behind you as you go. You crouch and read the nearest: ...and the Reader came up the stair of pages, at midnight, with ${st.run.allies.length ? `${st.run.allies.length} friend${st.run.allies.length === 1 ? '' : 's'} sworn to follow` : 'nobody but a ribbon'}...`,
      `T: It's writing you down. The last page. It's never had anything written on it before, and now it's writing you.`,
      `Ahead, in the middle of the page, stands the Bindery: a small round stone room, plain as a well, with candlelight in its windows. And between you and its door, drawn up in a long red line across the white, is an army.`,
    ],
    choices: [{ t: 'Walk toward the red line', to: 1601 }],
  },
  1601: {
    title: 'The Chancellor’s Last Gambit', scene: 'whitepage',
    actors: (st) => { const a = [A('hero', -150, 470), A('e:corrector_general', 160, 420, -1), A('e:errata_soldier', 230, 500, -1), A('e:errata_soldier', 90, 500, -1)]; if (!st.run.flags.vellumYielded) a.push(A('vellum', 60, 440, -1, 'talk')); return a; },
    text: (st) => st.run.flags.vellumYielded ? [
      `It is the Correction Office: two hundred red soldiers in strict ranks, their eyes glowing the colour of fresh mistakes, and at their head a tall Corrector in a scarlet mitre, the Corrector-General, holding a staff topped with a red pen-nib the size of a spearhead.`,
      `Lord Chancellor Vellum is not with them. You last saw him in the Folio, reading his own last page. But the Office does not need him. It runs on orders, and its last order was never withdrawn.`,
      `"Reader," says the Corrector-General, in a voice like a ledger closing. "You are an unauthorized ending. You will be corrected." Two hundred red pens lift at once.`,
      `T: They followed us up the stair. Of course they did. Corrections never stop until the page is clean.`,
    ] : [
      `It is the Correction Office: two hundred red soldiers in strict ranks, their eyes glowing the colour of fresh mistakes, and at their head a tall Corrector in a scarlet mitre with a staff topped by a red pen-nib the size of a spearhead. And in front of them all, smoothing his grey-and-silver coat, smiling his patient smile, stands Lord Chancellor Vellum.`,
      `"Reader," he says warmly, as if you were old friends meeting at a party. "You took the long way. I took the stair right behind you. Thank you for winding the clock. It saved me a great deal of paperwork."`,
      `"Here is my offer," he says. "Edmund will give those shears to whoever asks him nicely. I intend to ask first. You will stand aside. In return, I will write your name into every record in the Folio, on every page, in every copy, forever. You will never be forgotten, Reader. Not ever. Do you know how rare that is? Do you know what people would give for it?"`,
      `His smile slips, just a fraction. "I know," he says, more quietly. "I know exactly what they'd give."`,
      `T: He means it. That's the awful thing. He's offering you the only thing he ever wanted.`,
    ],
    choices: [
      { t: 'Give Vellum the grey story from the Drafts, open at the margin', ink: 'gold', to: 1603, show: { notFlag: 'vellumYielded' }, need: { keyCount: [['vellum_page'], 1, 'Vellum’s first draft'] } },
      { t: 'Refuse him, and break the red line', ink: 'crimson', battle: 'moon_siege', win: 1602, show: { notFlag: 'vellumYielded' } },
      { t: 'Break the red line', ink: 'crimson', battle: 'moon_siege', win: 1602, show: { flag: 'vellumYielded' } },
    ],
  },
  1603: {
    title: 'The Margin Note', scene: 'whitepage', actors: [A('hero', -150, 470, 1, 'idle'), A('vellum', 40, 450, -1, 'kneel'), A('e:corrector_general', 210, 420, -1)],
    once: { flag: ['vellumYielded', 'vellumMoon'], xp: 160, ink: { gold: 1 } },
    text: [
      `You don't say anything. You just take the grey story out of your coat, open it at the last page, and hold it out.`,
      `Lord Chancellor Vellum looks at it for a long moment without taking it. He knows what it is. You can see in his face that he has read it before, once, a very long time ago, and has spent every day since making sure he never has to read it again. Then he sees the margin. He takes the page.`,
      `I'm sorry, Valentine. Somebody has to be forgotten so the others can be remembered. I will try to make it up to you.`,
      `"She knew my name," Vellum says. It comes out strange, cracked down the middle. "She knew my name. She was sorry." He reads it again. "I never got as far as the margin. I read the last line and I ran. I ran all the way to the Folio and I built a city where nobody would ever be allowed to forget me." He laughs, a small terrible sound. "And all that time she was sorry."`,
      `He sits down, right there on the edge of the last page, in his beautiful coat, with the story in his lap. "Go in," he says without looking up. "Go and finish it. I'll... I'm going to read this again. I'd like to read the whole thing, this time."`,
      `Behind him, the Corrector-General lifts his red staff. "My lord," he says, "the order stands. Corrections cannot be withdrawn." And Vellum, Valentine, does not even turn around. "No," he says softly. "I suppose they can't. That was rather the point of them."`,
      `T: Reader. The red one doesn't care what Vellum says. Get ready.`,
    ],
    choices: [{ t: 'Break the red line', ink: 'crimson', battle: 'moon_siege', win: 1602 }],
  },
  1602: {
    title: 'Through the Red Line', scene: 'whitepage', actors: (st) => { const a = [A('hero', -150, 470, 1, 'idle')]; if (st.run.flags.vellumMoon) a.push(A('vellum', 120, 450, -1, 'sit')); return a; },
    once: { xp: 100 },
    text: (st) => [
      `The Corrector-General goes down in a spray of red ink, his great pen-nib snapping in two, and the red line breaks. Soldiers drop their pens and stand blinking at their own hands, as if a fresh mistake has just been gently rubbed out of each of them. Some of them sit down on the white page. One of them starts, very quietly, to hum.`,
      st.run.flags.vellumMoon ? `Vellum hasn't moved. He is still sitting at the edge of the page, reading. As you pass he says, without looking up, "Valentine. My name was Valentine." You tell him it's a good name. He seems to think about that for a long time.` : st.run.flags.vellumYielded ? `Nobody is giving orders any more. The Correction Office has run out of corrections.` : `Lord Chancellor Vellum has gone. In the confusion he slipped away across the page, coat-tails flying, toward the Bindery door. "I'll see you inside, Reader," his voice floats back. "I'll be with Edmund. I always am."`,
      `T: That's the last of the red. Come on. We're nearly there.`,
    ],
    choices: [{ t: 'Walk on toward the Bindery', to: 1604 }],
  },
  1604: {
    title: 'The Hall of Last Pages', scene: 'whitepage', actors: [A('hero', -150, 470, 1, 'idle'), A('tassel', -70, 390)],
    text: (st) => {
      const lines = LAST_PAGES.filter(([q]) => st.run.quests[q] && st.run.quests[q].done).map(([, f]) => f(st));
      return [
        `Around the Bindery, for a hundred paces in every direction, the air is full of hanging pages. Thousands upon thousands of them, each on its own thread, turning slowly in a wind you can't feel: every last page Edmund ever cut. You walk through them the way you would walk through a forest of paper leaves. They whisper as you pass.`,
        `Some of them you know.`,
        lines.length ? lines.slice(0, 6).join('\n\n') : `QUILLSBY. "...and the sun came up over the Barrow Moor, and the village woke, and the long night was over."`,
        lines.length > 6 ? `There are more. So many more. You stop reading them, eventually, because you can't see very well any more.` : `You stop reading after a while. There are too many. And they're not yours to read, not yet. They belong to the people they end.`,
        `Near the door, one page hangs by itself, a little apart from the others. Tassel drifts up to it and goes very still. It says CORWIN ASHBY at the top, and the rest of it is blank. Somebody has rubbed out every word.`,
        `T: They corrected even his ending. The Office. They took that too.`,
        `T: When this is over, Reader, I am going to write it back in myself. I don't care if ribbons can't hold pens. I'll learn.`,
      ];
    },
    choices: [{ t: 'Go to the Bindery door', to: 1605 }],
  },
  1605: {
    title: 'An Old Woman on the Step', scene: 'whitepage', actors: [A('hero', -150, 470), A('agnes', 40, 460, -1, 'sit'), A('tassel', -70, 390)],
    once: { potion: { heal: 2 }, xp: 60 },
    text: (st) => st.run.flags.agnesAuthor ? [
      `On the doorstep of the Bindery, sewing by the light of the windows, sits an old woman in a grey dress and a lilac kerchief, with a silver thimble on her finger. She is not quite solid. You can see the grain of the door through her shoulder.`,
      `Tassel makes a sound like a held breath let go.`,
      `T: Agnes.`,
      `"Hello, little ribbon." She smiles, and bites off a thread. "Hello, Reader. You've been down in the Drafts, haven't you? You've got Ellery's sampler in your coat. I can see the red thread." She looks at Tassel for a long moment. "And you remember her now. Oh, I'm glad. She'd be so glad."`,
      `"I'm not a ghost," she says, before you can ask. "I'm an ending. Mine. The night I died, Edmund was meant to read my last page aloud and close my story, the way I taught him. He couldn't. He cut it instead. The first one he ever cut." She looks down at her sewing. "Endings can't go into the room where they were cut. So I've been sitting out here ever since."`,
      `"I never told him she asked for him," she says quietly. "That the Author knew his name before I did. I thought it would be too much for him, a boy who already carried every ending in the book. I thought there'd be time." Her needle stops. "Tell him, Reader. Tell him he was never left. Tell him I'm not cross. And then finish it. You can. She always knew somebody would."`,
      `She presses two little bottles into your hand from her sewing basket, and goes back to her stitching, humming.`,
    ] : [
      `On the doorstep of the Bindery, sewing by the light of the windows, sits an old woman in a grey dress and a lilac kerchief, with a silver thimble on her finger. She is not quite solid. You can see the grain of the door through her shoulder.`,
      `Tassel makes a sound like a held breath let go.`,
      `T: Agnes.`,
      `"Hello, Tassel. Hello, Reader." She bites off a thread. "Don't mind me. I used to live here. I'm only an ending now: my own. The night I died, Edmund was meant to close my story, the way I taught him. He couldn't. He cut it instead. The first one he ever cut. Endings can't go into the room where they were cut, so here I sit."`,
      `"There's something he doesn't know," she says. "Something the Author asked of me, a long time ago, about him." She shakes her head. "No. It's not mine to put on you. It's written down somewhere, under the clock. You'll find it, or you won't, and either way you'll do your best by him. I can see it on you." She presses two little bottles into your hand from her sewing basket. "Be kind to him. He was always kind. That was the whole trouble."`,
    ],
    choices: [{ t: 'Open the door of the Bindery', ink: 'gold', to: 400 }],
  },
  1610: {
    title: 'Ellery', scene: 'bindery', actors: [A('hero', -150, 470, 1, 'idle'), A('unbinder', 80, 450, -1, 'kneel')],
    once: { flag: ['toldEdmund', 'readNotes'], xp: 120, ink: { gold: 1 } },
    text: (st) => [
      `You don't take the shears. Instead you take a folded square of linen out of your coat, a child's sewing sampler with a border of little red ribbons, and put it in his hands.`,
      `Edmund reads the name stitched in the middle. ELLERY, AGED 9. Then he reads what is written under it, in ink, in a small crooked hand he has seen ten thousand times in the margins of ten thousand stories, and his face goes slowly white. You watch him reach the line about a boy who cries at every last page. You watch him read it again.`,
      `"She knew about me," he says. "The Author. She knew about me." He sits down hard on the Bindery floor, the shears clattering beside him. "I thought she left. I thought she got tired of us and walked away and left Agnes and me with all the endings and never looked back. And she..." His voice breaks. "Look after him for me."`,
      `Tassel slips off your shoulder and drifts to him, and settles on his knee, the way a ribbon settles on a page.`,
      `T: I was hers first, Edmund. Her ribbon. I'd forgotten. When I left the Bindery to look for a Reader, I thought I was running away from you. I wasn't. I was still doing what she asked. Looking after you.`,
      `For a long time the only sound in the Bindery is a young man crying, quietly, the way you cry when you find out that something you carried alone for three hundred years was being carried beside you the whole way.`,
      `"She left the last page to the Reader," he whispers at last. "Not because she didn't care. Because she cared too much to do it herself. Just like me." He looks up at you, and for a moment he looks very young. "Oh, Agnes. Oh, Ellery. What have I done?"`,
      st.run.flags.vellumYielded ? `Before you can answer, a red mitre rises from behind a press. "Corrections," says a cold voice, "cannot be withdrawn." Behind it, the Red Errata ducks under the lintel, axe in hand.` : `"Nothing you can't be forgiven for, master," says a smooth voice, as Lord Chancellor Vellum steps out of the shadows. "Don't listen to the Reader. You were right." Behind him, the Red Errata ducks under the lintel, axe in hand.`,
    ],
    choices: [{ t: 'Stand your ground', ink: 'crimson', to: 402 }],
  },
});
