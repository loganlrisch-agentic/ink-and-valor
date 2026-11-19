/* ==========================================================================
   Chapter II - expansion: the south road and the Last Lantern inn,
   Croakwater and the Wisp Queen, the abbot's ledger, Gloam's island,
   Saltmere's quarters, the fighting pit, the ghost ship, a sea monster,
   and three places where the story can end early.
   ========================================================================== */
Object.assign(QUESTS, {
  tadpoles: { title: 'The Croaklings', giver: 'Grandmother Bulge', stages: { start: 'Gloam’s toads carried off the children of Croakwater. Find the Toad Warrens and bring them home.' } },
  widow: { title: 'The Widow’s Kiss', giver: 'Bessa Gill', stages: { start: 'A drowned ship sits in Saltmere harbor. Its dead crew row ashore at night. Board it.' } },
  pit: { title: 'The Fighting Pit', giver: 'Lord Gnash', stages: { start: 'Three bouts in the pit under the docks. Win all three for the champion’s helm.' } },
});
Object.assign(KEY_ITEMS, {
  moss_ribbon: { name: 'A Green Ribbon', desc: 'A child’s hair ribbon, stitched with the word MOSS. Found in Gloam’s things.' },
  grey_feather: { name: 'A Grey Feather', desc: 'Left on a chair at the Last Lantern by a stranger who asked if you liked endings.' },
});
Object.assign(ENDINGS, { thieves: 'Queen of Thieves', champion: 'The Duchess’s Champion', drowned: 'The Bog Witch' });

/* ---------------- hooks into the first half of the chapter ---------------- */
SECTIONS[200].choices = [{ t: 'Take the south road out of Quillsby', to: 600 }];
SECTIONS[205].choices.splice(3, 0,
  { t: 'Follow the frog-song to the village on stilts', to: 620, show: { notVisited: 625 } },
  { t: 'Row out to the island in the middle of the bog', ink: 'indigo', to: 645, show: { notVisited: 645 } });
SECTIONS[231].choices.unshift({ t: 'Ask about the bell still ringing under the water', to: 630, show: { notVisited: 630 } });
SECTIONS[241].choices.unshift({ t: 'Ask about the black arrow in the wolf’s leg', ink: 'gold', to: 640, show: { notVisited: 640 } });
SECTIONS[245].choices.splice(1, 0, { t: 'Hold up the green ribbon stitched with MOSS', ink: 'gold', need: { key: 'moss_ribbon' }, to: 650, show: { key: 'moss_ribbon' } });
SECTIONS[247].choices.push({ t: 'Stay with Gloam. Learn her songs.', ink: 'indigo', to: 682 });
SECTIONS[251].choices.splice(3, 0,
  { t: 'Walk down to the Net Quarter', to: 660, show: { notQuestDone: 'widow' } },
  { t: 'Climb out to the lighthouse on the rocks', to: 664, show: { notVisited: 664 } },
  { t: 'Follow the roar to the fighting pit under the docks', ink: 'crimson', to: 666, show: { notQuestDone: 'pit' } },
  { t: 'Light a candle in the Temple of the Drowned God', to: 672, show: { notVisited: 673 } });
SECTIONS[251].choices.push(
  { t: 'Stay in Saltmere with Sable and the Hollow Guild', ink: 'indigo', to: 680, show: (st) => (st.run.allies || []).includes('sable') && st.run.quests.tide && st.run.quests.tide.done },
  { t: 'Accept the Duchess’s offer to stay on as her Champion', ink: 'gold', to: 681, show: (st) => st.run.quests.tide && st.run.quests.tide.done && !st.run.flags.robbedDuchess });
SECTIONS[275].choices = [{ t: 'Watch the water', to: 276 }];
SECTIONS[340].choices = [
  { t: 'Walk through the Library as the Chancellor’s heir', ink: 'indigo', to: 341, show: { flag: 'vellumPact' } },
  { t: 'Fight through the Library of Teeth', ink: 'crimson', battle: 'library', win: 342, show: { notFlag: ['vellumPact'], notFlag2: 0 }, showFn: 1 },
];
SECTIONS[340].choices[1].show = (st) => !st.run.flags.vellumPact && !st.run.flags.gloamSoftened;
SECTIONS[340].choices.push({ t: 'Fight through the Library of Teeth', ink: 'crimson', battle: 'library_b', win: 342, show: (st) => !st.run.flags.vellumPact && st.run.flags.gloamSoftened });
{
  const t340 = SECTIONS[340].text, t342 = SECTIONS[342].text;
  SECTIONS[340].text = (st) => { const t = t340(st); if (st.run.flags.gloamSoftened && !st.run.flags.vellumPact) { t[1] = t[1].replace(', and behind them, cackling on a ladder, is a woman the color of duckweed', ''); t[2] = `There is no sign of Mother Gloam. Somewhere in the fen, you think, a woman is sitting by a little made bed, not singing.`; } return t; };
  SECTIONS[342].text = (st) => st.run.flags.gloamSoftened ? [`The last soldier falls, and the last shelf wyrm goes limp across the stacks. The Library's teeth stop grinding. In the silence you can hear the building breathe.`, `At the far end of the Library is a small black door, older than anything in the city.`] : t342(st);
}

Object.assign(SECTIONS, {
  /* ---------------- the south road ---------------- */
  600: {
    title: 'The South Road', scene: 'crossroads', actors: (st) => { const a = [A('hero', -120, 470), A('tassel', -30, 380)]; return a; },
    text: [
      `The road south runs out of the sunlight like a man walking out of a warm house into the snow. One step it is morning. The next, it is night again, the old night, the one that has lasted a month everywhere except Quillsby.`,
      `The fields on either side are dead. Not winter-dead: stopped. Half-cut wheat stands where the reapers left it. A scarecrow in a farmer's hat turns its head to watch you pass, slowly, the way a sunflower follows the sun.`,
      `At a crossroads stands a gibbet, and on the gibbet hangs a man. He has been hanging there a long time. He is still breathing.`,
      `"Evening," says the hanged man.`,
    ],
    choices: [
      { t: 'Talk to the hanged man', to: 601 },
      { t: 'Hurry past toward the lights of an inn further down the road', to: 603 },
    ],
  },
  601: {
    title: 'The Gibbet', scene: 'crossroads', actors: [A('hero', -100, 470), A('hanged', 80, 420, -1, 'idle', { z: -40 })],
    text: [
      `"They hanged me the night the shears closed," he says conversationally. "For stealing a horse. I did steal it, to be fair. And then the trapdoor dropped, and the rope went tight, and I waited to be dead. And I waited. And here we are."`,
      `"Can't end, you see. Nobody can. I've had a lot of time to think up here. I've seen things go by on this road. Refugees, mostly. People from other stories, all walking south, all looking for somewhere their story still works."`,
      `"And a month ago, the night it happened, a young man in a grey coat walked past. He stopped and looked up at me, and he cried. He said, 'I'm sorry. But this is better than the alternative.'" The hanged man considers this. "I'm not sure it is."`,
    ],
    choices: [
      { t: 'Cut him down', ink: 'gold', to: 602 },
      { t: 'Leave him hanging and walk on', ink: 'crimson', to: 603, give: { align: 1 } },
    ],
  },
  602: {
    title: 'Down From the Gibbet', scene: 'crossroads', actors: [A('hero', -60, 470), A('hanged', 60, 460, -1, 'kneel')],
    once: { luck: 1, xp: 15 },
    text: [
      `You climb the gibbet and saw through the rope. The hanged man drops into the mud, lies there a moment, and then laughs until he coughs.`,
      `"Thank you. Oh, thank you. I'm going to go and find somewhere soft, and lie down in it, and wait for the end of the story like a normal person." He rubs his neck. "Here. For luck." He presses a horseshoe into your hand. It is warm. Then he limps off into the dark fields, whistling.`,
      `T: That was kind. It was also slightly disgusting. Wash your hands.`,
    ],
    choices: [{ t: 'Walk on to the inn', to: 603 }],
  },
  603: {
    title: 'The Last Lantern', scene: 'inn', actors: [A('hero', -150, 470), A('mags', 30, 450, -1, 'talk'), A('refugee', 180, 430, -1, 'sit'), A('villager2', -260, 430, 1, 'sit')],
    text: (st) => [
      `The Last Lantern is a long, low inn with smoke coming out of every crack. It is packed. People sleep on the benches, under the tables, on the stairs. Most of them are strangers, and not just to you. They are strangers to this story.`,
      `"Refugees," says the innkeeper, a big red-faced woman with forearms like hams. "From all over the book. Their stories stopped, so they walked until they found one that still had a fire going. Name's Mags. Rooms are full, but there's floor. Floor's free."`,
      st.meta.visited[605] ? `The chair by the fire where the stranger sat is empty.` : `In the best chair by the fire sits a pale young man in a grey coat, reading. Nobody else seems to notice him.`,
    ],
    choices: [
      { t: 'Talk to the refugees', to: 604, show: { notVisited: 604 } },
      { t: 'Sit down across from the young man by the fire', ink: 'indigo', to: 605, show: { notVisited: 605 } },
      { t: 'Find a spot on the floor and sleep', to: 606 },
    ],
  },
  604: {
    title: 'Refugees', scene: 'inn', actors: [A('hero', -150, 470), A('refugee', 30, 450, -1, 'talk'), A('villager', 150, 440, -1, 'sit'), A('villager2', 230, 480, -1, 'sit')],
    once: { xp: 10 },
    text: [
      `There is a knight in dented armor whose quest stopped halfway up a mountain. He was about to fight a dragon, he says. The dragon stopped too, mid-roar, with its mouth open. He waited three days for it to finish roaring and then walked down again.`,
      `There are two lovers who were supposed to be married the morning after the night came. "We keep trying," the bride says. "We go to the chapel and stand in front of the priest and he opens his mouth to say the words and nothing comes out." She shows you her ring finger. There is a pale line where the ring should be.`,
      `And there is a little girl who says she has been seven years old for a very long time. "Seven is fine," she says, "but I wanted to be eight."`,
      `T: This is what he did, Reader. Not just Quillsby. Everyone. Everywhere.`,
    ],
    choices: [{ t: 'Back to the fire', to: 603 }],
  },
  605: {
    title: 'The Stranger by the Fire', scene: 'inn', actors: [A('hero', -100, 470, 1, 'sit'), A('edmund', 60, 450, -1, 'sit', { alpha: 0.8 })],
    text: [
      `You sit. The young man closes his book and smiles at you. His hair is white, though he can't be much older than you, and his eyes are red as if he's been crying for years.`,
      `"Do you like endings?" he asks. "I used to. I used to read the last page first. Then I started to notice what happens to people after the last page. They don't go on, you know. They stop. Like a clock nobody winds. I couldn't stand it."`,
      `"Tell me honestly. If you could make sure nobody you loved ever had to end, would you?"`,
      `Tassel has gone completely rigid on your shoulder. Not a word.`,
    ],
    choices: [
      { t: '"No. Endings are what make the story mean something."', ink: 'gold', to: 607 },
      { t: '"Yes. I would."', ink: 'indigo', to: 607, give: { align: 1, flag: 'toldStranger' } },
      { t: 'Say nothing, and watch him', to: 607 },
    ],
  },
  607: {
    title: 'A Grey Feather', scene: 'inn', actors: [A('hero', -100, 470, 1, 'sit'), A('tassel', -20, 400)],
    once: { key: 'grey_feather' },
    text: (st) => [
      st.run.flags.toldStranger ? `He smiles, very gently, as if you've given him a present. "I thought you might understand."` : `He nods slowly, as if he expected that. "Everyone says that," he says. "Until it's someone they love."`,
      `A log shifts in the fire. When you look back, the chair is empty. There is no one there. There is only a single grey feather on the seat, and his book is gone.`,
      `T: That was him. Reader, that was him. Or a piece of him, left in the margins. He does that. He leaves himself in places. Like a smell.`,
      `T: He knows we're coming. Of course he does. He's read ahead.`,
    ],
    choices: [{ t: 'Back to the crowded room', to: 603 }],
  },
  606: {
    title: 'The Toll Brothers', scene: 'inn', foes: 'tollmen', actors: [A('mags', -260, 430, 1, 'cower')],
    text: [
      `You wake to the sound of the door hitting the wall. Four men are standing in the doorway, big and bald and bearded, carrying clubs. Behind them, a fifth has a bow.`,
      `"Evening, Mags," says the biggest. "Toll's due. Every refugee pays to sleep on our road. Two crowns a head. You've got, what, sixty heads in here?"`,
      `"It's not your road, Barlow," says Mags, white in the face.`,
      `"It is now. Nobody's going to stop us, are they? Nothing ends. Not even a beating." He grins. "So we can beat you forever."`,
    ],
    choices: [
      { t: 'Stand up and stop them', ink: 'crimson', battle: 'tollmen', win: 608 },
      { t: 'Pay the toll for the whole room (15 crowns)', ink: 'gold', need: { gold: 15 }, take: { gold: 15 }, to: 609 },
      { t: 'Nod to the huge man drinking alone in the corner. It’s Ulfgar.', ink: 'crimson', need: { ally: 'ulfgar' }, to: 610, show: { ally: 'ulfgar' } },
    ],
  },
  608: {
    title: 'Brothers Broken', scene: 'inn', actors: [A('hero', -60, 470, 1, 'cheer'), A('mags', 80, 460, -1, 'cheer'), A('refugee', 180, 440, -1, 'cheer')],
    once: { xp: 25, potion: { heal: 1 }, gold: 10 },
    text: [
      `The Toll Brothers leave faster than they came, with fewer teeth. The refugees cheer. The knight from the stopped mountain shakes your hand and won't let go.`,
      `Mags slams a plate of sausages in front of you. "On the house. All of it. Forever." She pauses. "Well. You know what I mean."`,
    ],
    choices: [{ t: 'Sleep, and set out at dawn', to: 611 }],
  },
  609: {
    title: 'Paid in Full', scene: 'inn', actors: [A('hero', -60, 470), A('mags', 80, 460, -1, 'talk')],
    once: { xp: 10, luck: 1 },
    text: [
      `You count fifteen crowns into Barlow's hand. He looks at it, then at you, then at the room full of exhausted strangers. Something crosses his face that might be shame. He leaves without counting it.`,
      `"That," says Mags, "was either the kindest or the stupidest thing I've seen all month." She gives you a blanket. "Kindest. I've decided."`,
    ],
    choices: [{ t: 'Sleep, and set out at dawn', to: 611 }],
  },
  610: {
    title: 'Ulfgar’s Toll', scene: 'inn', actors: [A('hero', -60, 470, 1, 'cheer'), A('ulfgar', 60, 450, -1, 'roar'), A('mags', 200, 460, -1, 'cheer')],
    once: { xp: 20 },
    text: [
      `Ulfgar took the south road on business of his own, and has been sitting in the corner the whole time, minding a very small cup. Now he stands up. He keeps standing up for longer than seems possible. When he is finished standing up, the Toll Brothers have to tilt their heads back to see his face.`,
      `"TOLL," says Ulfgar thoughtfully, and picks Barlow up by the belt and throws him through the window. The other three leave by the door, very quickly, which is the polite way.`,
      `"I like this inn," Ulfgar announces to the room. "Nobody hurts this inn." The refugees applaud.`,
    ],
    choices: [{ t: 'Sleep, and set out at dawn', to: 611 }],
  },
  611: {
    title: 'Morning That Isn’t', scene: 'crossroads', actors: [A('hero', -60, 470), A('mags', 120, 450, -1, 'point'), A('tassel', 20, 380)],
    text: [
      `There is no morning, of course. There's just a slightly paler dark, and Mags on the step with a lantern, pointing south.`,
      `"Two ways to the sea. The Old Causeway goes straight through the Fenmire. Stones are sinking and there's things in the water, but it's quick. Or the Ferryman runs his barge down the Gloomwater. Slower, drier, and his passengers are dead." She shrugs. "Your choice. Come back when it's over. I'll save you the good chair."`,
    ],
    choices: [
      { t: 'Take the Old Causeway', to: 202 },
      { t: 'Find the Ferryman’s barge', to: 210 },
    ],
  },

  /* ---------------- Croakwater ---------------- */
  620: {
    title: 'Croakwater', scene: 'croakwater', actors: [A('hero', -150, 470), A('croaker', 20, 450, -1, 'cower'), A('croaker', 120, 430, -1, 'idle'), A('tadpole', 200, 480, -1, 'idle', { alpha: 0 })],
    text: [
      `The frog-song leads you to a village on stilts: a dozen round huts on crooked legs, joined by rope bridges and lit by lanterns full of trapped green light. The people who live here are short and broad and green, with wide mouths and gold eyes. Croakers, Tassel says. Fen-folk.`,
      `They are not singing. They are wailing. All of them, on every porch, in a low terrible chorus.`,
      `A croaker with a fishing spear hops down to meet you. "Reader? Oh. Oh, thank the mud. Please. The Grandmother. Please come."`,
    ],
    choices: [{ t: 'Follow him to the biggest hut', to: 621 }],
  },
  621: {
    title: 'Grandmother Bulge', scene: 'croakwater', actors: [A('hero', -150, 470), A('bulge', 40, 450, -1, 'talk'), A('croaker', 180, 430, -1, 'cower')],
    once: { quest: { tadpoles: 'start' } },
    text: (st) => [
      `Grandmother Bulge is enormous and ancient, a croaker so old that moss grows on her shoulders. She sits on a throne of woven reeds and does not get up.`,
      `"Toads," she says. "Big as cows. Gloam's toads. They came out of the bog three nights ago and took every croakling in the village. Every child. Thirty-one of them. Carried them off to the warrens under the dead willows."`,
      `"Gloam says she is saving them. Taking them somewhere they will never have to grow up and never have to grow old and never have to end." The Grandmother's gold eyes are wet. "Bring them home, Reader. Let them grow up. Let them end, one day, the way frogs are meant to."`,
      st.run.quests.tadpoles && st.run.quests.tadpoles.done ? null : `T: Thirty-one children. Of course it's thirty-one. It's always a horrible number.`,
    ],
    choices: [
      { t: 'Go to the Toad Warrens', ink: 'crimson', to: 623 },
      { t: 'Visit the wisp market on the far porch', to: 622, show: { notVisited: 622 } },
      { t: 'Leave Croakwater for now', to: 205 },
    ],
  },
  622: {
    title: 'The Wisp Market', scene: 'croakwater', actors: [A('hero', -150, 470), A('croaker', 30, 450, -1, 'talk'), A('e:wisp', 160, 380, -1)],
    text: [
      `On the far porch, a croaker sells wisps in jars: little blue flames bobbing behind glass, each one a lamp that never needs oil. "Caught fresh," he says. "Well. Caught. The Queen gets angry if we take too many."`,
      `"The Wisp Queen. Lives out in the reeds where the water's deepest. She'll give you a light that never goes out, if you give her something to burn." He taps his head. "A memory. A good one. She only takes good ones."`,
      `T: Do not give a fire your memories, Reader. That's not advice. That's a rule.`,
    ],
    choices: [
      { t: 'Go out into the deep reeds to find the Wisp Queen', ink: 'indigo', to: 626 },
      { t: 'Back to the Grandmother', to: 621 },
    ],
  },
  623: {
    title: 'The Toad Warrens', scene: 'warrens', foes: 'warrens',
    text: [
      `Under the dead willows the ground is hollow, a maze of mud tunnels that smell of rot and frogspawn. Glowing green mushrooms light the way. Somewhere deep inside, you hear thin little voices crying.`,
      `The toads are waiting in the first chamber. They are exactly as big as cows. Behind them a bog hag in a pointed hat is stirring a pot and singing a drowning-song, and the croaklings are in cages along the walls, their gold eyes huge.`,
    ],
    choices: [{ t: 'Charge', ink: 'crimson', battle: 'warrens', win: 624 }],
  },
  624: {
    title: 'Croaklings in Cages', scene: 'warrens', actors: [A('hero', -100, 470, 1, 'cheer'), A('tadpole', 40, 470, -1, 'cheer'), A('tadpole', 110, 440, -1, 'cheer'), A('tadpole', 170, 490, -1, 'idle')],
    once: { key: 'moss_ribbon', xp: 30 },
    text: [
      `You break the cages one by one. Croaklings tumble out, small and slippery and squeaking, and cling to your legs, your arms, your hair. Thirty-one of them. You count twice to be sure.`,
      `In the bog hag's pot, among the bones and the reeds, you find something that doesn't belong: a child's hair ribbon, faded green, with a name stitched into it in careful letters. MOSS.`,
      `T: That's not a croakling's. Croaklings don't have hair. Somebody kept that for a very long time.`,
    ],
    choices: [{ t: 'Lead the croaklings home', to: 625 }],
  },
  625: {
    title: 'A Village Sings', scene: 'croakwater', actors: [A('hero', -100, 470, 1, 'cheer'), A('bulge', 60, 450, -1, 'cheer'), A('croaker', 160, 430, -1, 'cheer'), A('tadpole', 220, 480, -1, 'cheer'), A('tadpole', -220, 480, 1, 'cheer')],
    once: { questDone: 'tadpoles', gold: 20, potion: { heal: 2 }, luck: 1, xp: 40 },
    text: [
      `Croakwater sings. Not wailing now: a proper song, the whole village croaking in harmony on every porch, so loud the lantern-wisps jump in their jars.`,
      `Grandmother Bulge holds out a webbed hand and you put the green ribbon in it. She turns it over and goes very quiet. "Moss," she says. "Little Moss. Gloam's girl. She drowned in the Fenmire when Gloam and Fen were young, oh, sixty years back. A story ended badly and the water took her."`,
      `"Gloam never forgave the ending. Not the story's ending. Moss's." She gives the ribbon back. "Keep it. If you meet Gloam, show her. Maybe she'll remember there's another way to love somebody than to keep them."`,
    ],
    choices: [{ t: 'Back into the fen', to: 205 }],
  },
  626: {
    title: 'The Wisp Queen', scene: 'fen', foes: 'wisp_queen',
    text: [
      `Where the reeds are tallest and the water is black, a light is waiting for you. It is the size of a woman and the shape of one, mostly, a tall blue flame with a crown of smaller flames, and it is beautiful in a way that makes you forget to blink.`,
      `"A Reader," says the Wisp Queen, in a voice like a candle being blown out. "You smell of good memories. So many. Give me one. Just one. The smallest. And I will give you a light that never goes out."`,
      `Little wisps drift closer, curious, hungry.`,
    ],
    choices: [
      { t: 'Give her a memory', ink: 'indigo', to: 627 },
      { t: 'Refuse, and put her out', ink: 'crimson', battle: 'wisp_queen', win: 628 },
      { t: 'Back away to the market', to: 622 },
    ],
  },
  627: {
    title: 'A Memory for a Light', scene: 'fen', actors: [A('hero', -60, 470, 1, 'kneel'), A('e:wisp_queen', 100, 420, -1)],
    once: { item: 'wisplight', luck: -1, xp: 20 },
    text: [
      `You close your eyes and choose a memory. It's a small one: a kitchen, a warm afternoon, someone humming. You hold it out. The Queen takes it the way a candle takes a moth.`,
      `When you open your eyes she has gone, and in your hand is a lantern woven from reeds with a little blue flame inside it, bobbing happily.`,
      `You try to remember what you gave her. There was a kitchen. Somebody was humming. You can't remember who.`,
      `T: Reader. I'm not going to say I told you so. I'm going to think it very loudly.`,
    ],
    choices: [{ t: 'Back into the fen', to: 205 }],
  },
  628: {
    title: 'The Queen Gutters Out', scene: 'fen', actors: [A('hero', -60, 470, 1, 'cheer')],
    once: { item: 'wisplight', xp: 40, gold: 20 },
    text: [
      `The Wisp Queen shrinks, and flickers, and goes out with a sound like a sigh. Where she was, a single small flame bobs in the air, confused, like a firefly that has lost its friends.`,
      `It drifts over and settles into your hand. You weave it a cage out of reeds. It seems to like that.`,
    ],
    choices: [{ t: 'Back into the fen', to: 205 }],
  },

  /* ---------------- the abbot's ledger ---------------- */
  630: {
    title: 'The Bell Beneath', scene: 'monastery', actors: [A('hero', -60, 470), A('ash', 100, 450, -1, 'point')],
    text: [
      `"The Drowning Bell," says Brother Ash. "It has rung every hour since the flood, under the water. Our abbot is inside it. He went in to ring it the night the cloister drowned, and he never came out."`,
      `The water in the cloister is black and still. Somewhere below, the bell tolls, slow and muffled.`,
    ],
    choices: [
      { t: 'Dive, and call to the dead below (Spirit check, 9+)', check: { stat: 'spirit', target: 9 }, pass: 631, fail: { battle: 'scriptorium', win: 633 } },
      { t: 'Not today', to: 205 },
    ],
  },
  631: {
    title: 'The Drowned Abbot', scene: 'monastery', actors: [A('hero', -60, 470), A('abbot', 80, 450, -1, 'talk')],
    text: [
      `Inside the bell there is air, trapped and stale, and a ghost. An old man in a blue robe, glowing faintly, ringing the bell by hand with a rope that is no longer there.`,
      `"Ah," says the Drowned Abbot, "a Reader. The Margin Order kept watch for Readers, you know. Every few years, one comes. We wrote them all down."`,
      `"The last-but-one came here, years ago. Edmund. He knelt in the chapel above and asked me if endings hurt. I said I didn't know." The ghost closes his eyes. "I should have said no. I should have told him the truth: that an ending is only a door, and it doesn't hurt to walk through a door. I didn't know it then. I know it now. I've had a month to think."`,
      `"The scriptorium is under the chapel. Take this." He gives you a key that drips. "Read the ledger. It has your name in it."`,
    ],
    choices: [{ t: 'Swim down to the scriptorium', ink: 'crimson', battle: 'scriptorium', win: 633 }],
  },
  633: {
    title: 'The Ledger of Readers', scene: 'monastery', actors: [A('hero', -60, 470), A('tassel', 30, 390)],
    once: { item: 'abbots_beads', flag: 'ledger', xp: 30 },
    text: [
      `In the flooded scriptorium, on a lectern above the waterline, lies a great book bound in blue: the Ledger of Readers. Every Reader who ever came to the Tome is written in it, in careful monk's hand. Hundreds of names. Each one has a short note beside it, and each one has been neatly crossed out when their chapter ended.`,
      `Near the end: "Edmund Marrow. Gentle. Wept at endings. Went to the Folio to serve the Binder." Not crossed out. Below it: "Corwin Ashby. Brave. Hummed when he walked. Went north after Edmund." Crossed out in red ink, not black.`,
      `And below that, on the last line, in fresh ink that is still wet, is your name.`,
      `The note beside it is blank. Tassel reads it over your shoulder and says nothing at all, and among the abbot's things you find a string of prayer beads that feel warm in your hand.`,
    ],
    choices: [{ t: 'Swim back up to the fen', to: 205 }],
  },

  /* ---------------- the Hermit's wolves ---------------- */
  640: {
    title: 'Black Arrows', scene: 'wood', foes: 'hunters', actors: [A('hermit', -250, 430, 1, 'point')],
    text: [
      `"Gloam's hunters," says the Hermit, and his voice cracks like an old branch. "Hags with black bows. They shoot my wolves and drag them to the bog, to drown them and sing them back up as something else. They are out there now. I can feel them on the roots."`,
      `Two of his wolves get up and look at you. They are waiting for you to lead.`,
    ],
    choices: [
      { t: 'Hunt the hunters', ink: 'crimson', battle: 'hunters', win: 642 },
      { t: 'Not now', to: 205 },
    ],
  },
  642: {
    title: 'The Hermit’s Gift', scene: 'wood', actors: [A('hero', -100, 470), A('hermit', 60, 450, -1, 'cast'), A('e:wolf', 160, 440, -1)],
    once: { item: 'thornmail', xp: 40 },
    text: [
      `When you come back up the hill with the wolves trotting behind you, the Hermit is waiting. A wide green leaf has unfolded from the sapling on his shoulder.`,
      `He lays his hands on the bark of the nearest tree, and the tree gives him something: a breastplate of living wood, warm and smelling of spring. "Wear it," he says. "It will remember you were kind to wolves."`,
    ],
    choices: [{ t: 'Back down into the fen', to: 205 }],
  },

  /* ---------------- Gloam's island ---------------- */
  645: {
    title: 'Gloam’s Island', scene: 'island', actors: [A('hero', -100, 470), A('tassel', -10, 380)],
    text: [
      `You find a flat-bottomed boat tied to a dead tree and pole it out across the black water to the island in the middle of the bog. Gloam's hut stands on it, leaning, a skull on the door, its window dark. She is not home.`,
      `Beside the hut is a pool. Not water. Ink, or something like it, and floating in it are pages: hundreds of them, sodden, the words running. Drowned endings. Every last page she has ever stolen from a story.`,
    ],
    choices: [
      { t: 'Kneel and read the drowned pages', to: 646, show: { notVisited: 646 } },
      { t: 'Search the hut', ink: 'indigo', to: 647 },
      { t: 'Pole back to the shore', to: 205 },
    ],
  },
  646: {
    title: 'The Pool of Drowned Pages', scene: 'island', actors: [A('hero', -40, 470, 1, 'kneel')],
    once: { xp: 20 },
    text: [
      `You lift a page out of the pool. "And the old dog lay down by the fire, and was content, and slept, and did not wake." You lift another. "She opened the letter, and it said: Yes."`,
      `Another. "The war was over. They walked home through the poppy fields, and nobody spoke, because nobody needed to." Another. "And the little girl in the green ribbon went down under the water, and her mother screamed and screamed, and that was the end of the story of the Fen sisters."`,
      `You put that one back very gently.`,
      `T: They're not all sad. That's the thing he never understood. Most of them are just... done. Like a good meal.`,
    ],
    choices: [{ t: 'Turn to the hut', to: 645 }],
  },
  647: {
    title: 'Gloam’s Hut', scene: 'island', foes: 'island', actors: [],
    text: [
      `Inside, the hut is full of toys. Old ones. Wooden horses, rag dolls, a little boat with a paper sail. Everything is clean and dusted. A child's bed in the corner is made up, with a nightgown laid out on the pillow, as if somebody is expected home any minute.`,
      `On the table is a diary. The last entry, in shaking letters: "He came to me tonight. The boy with the shears. He says that soon nothing will end. No more stories going under. No more little girls going under. I said yes. Of course I said yes."`,
      `Behind you, the pool of pages starts to bubble. Things are climbing out of it.`,
    ],
    choices: [{ t: 'Fight your way out', ink: 'crimson', battle: 'island', win: 648 }],
  },
  648: {
    title: 'A Made Bed', scene: 'island', actors: [A('hero', -60, 470), A('tassel', 30, 390)],
    once: (st) => (st.run.keys.includes('moss_ribbon') ? { xp: 30, flag: 'readDiary' } : { key: 'moss_ribbon', xp: 30, flag: 'readDiary' }),
    text: (st) => [
      `When the last mirespawn melts back into the pool, you go back inside and stand by the little made bed for a while.`,
      st.run.keys.includes('moss_ribbon') ? `The ribbon from the warrens is heavy in your pocket. Now you know whose it was.` : `Folded on the pillow, beside the nightgown, is a faded green hair ribbon with a name stitched into it. MOSS. You take it. You aren't sure why.`,
      `T: Grief makes monsters, Reader. Not all monsters. But a lot of them.`,
    ],
    choices: [{ t: 'Pole back to the shore', to: 205 }],
  },
  650: {
    title: 'Little Moss', scene: 'fen', actors: [A('hero', -100, 470), A('gloam', 80, 450, -1, 'kneel'), A('moss', 0, 460, 1, 'idle', { alpha: 0.7 })],
    once: { flag: 'gloamSoftened', questDone: 'road', key: 'drowned_letter', xp: 70, quest: { gloam: 'start' } },
    text: [
      `You hold up the green ribbon. Gloam stops cackling. The Bog Horror stops moving. For a long moment the only sound in the Fenmire is the frogs.`,
      `Then, from among the pages stuck to the Horror's flank, something peels loose and drifts down: the shape of a little girl, made of mist and lettering, with moss-green braids. She walks across the water to her mother.`,
      `"Mama," says Little Moss. "It's all right. I'm not gone. I'm just resting. You can let the others rest too."`,
      `Gloam slides down off the Horror and kneels in the mud, and reaches for her daughter, and her hands go through. She makes a sound you will never forget. The Bog Horror sinks slowly into the marsh like a tired animal lying down. When it is gone, Gloam is gone too, and in the mud where she knelt there is a letter sealed with red wax.`,
    ],
    choices: [{ t: 'Take the letter and the south road to Saltmere', to: 250 }],
  },

  /* ---------------- Saltmere quarters ---------------- */
  660: {
    title: 'The Net Quarter', scene: 'saltmere', actors: [A('hero', -120, 470), A('fishwife', 40, 450, -1, 'talk'), A('sailor', 180, 430, -1, 'sit')],
    once: { quest: { widow: 'start' } },
    text: [
      `The Net Quarter is the poor end of Saltmere: tarred shacks and drying racks with nothing on them, children with sharp elbows and sharper eyes. A fishwife with arms like anchor chain is mending a net that will catch nothing.`,
      `"You want to help?" says Bessa Gill. "Look out there." In the harbor, beyond the merchant ships, sits a black ship with rotten sails. "The Widow's Kiss. Sank thirty years ago. The night the tide stopped, she came back up. Every night her crew row ashore and take something. Last night it was the Pellow boy."`,
      `"Nobody'll go out there. They're scared of the dead. I'm not. I'm scared of losing more boys."`,
    ],
    choices: [
      { t: 'Row out to the Widow’s Kiss', ink: 'crimson', to: 661 },
      { t: 'Back to the Lantern Market', to: 251 },
    ],
  },
  661: {
    title: 'Rowing Out', scene: 'ghostship', foes: 'ghostship',
    text: [
      `Bessa rows you out herself. The water is flat and black and the oars barely ripple it. The Widow's Kiss looms out of a green fog that hangs only around her, and her hull is so covered in barnacles it looks like it has skin disease.`,
      `You climb aboard. On deck, the dead are waiting: sailors in rotten coats with seaweed hair and grey faces, and in the stern, sitting on a coil of rope with an anchor across his knees, an enormous dead captain in a tall black hat.`,
      `"Visitors," he gurgles. "Haven't had visitors in thirty years. Stay. Stay forever. Nobody leaves the Widow."`,
    ],
    choices: [{ t: 'Fight the dead crew', ink: 'crimson', battle: 'ghostship', win: 663 }],
  },
  663: {
    title: 'The Captain’s Log', scene: 'ghostship', actors: [A('hero', -60, 470, 1, 'cheer'), A('tadpole', 120, 470, -1, 'cheer', { skin: SKINS[1], face: 'child' })],
    once: { questDone: 'widow', item: 'hollis_cutlass', gold: 40, xp: 50, flag: 'readLog' },
    text: [
      `When Captain Hollis finally falls, he falls apart like wet driftwood, and his crew go with him, and the green fog lifts. Below decks, in a locked cabin, you find the Pellow boy and four other children, terrified and alive. Bessa weeps when she sees them.`,
      `In the captain's cabin is his log. The last entries are thirty years old. But the very last page is new, written in a hand that is not the captain's: "Carried one passenger north, years back. Young fellow, ribbon on his shoulder, hummed the whole way. Corwin Ashby. Said he was going to stop a friend from doing something kind and terrible."`,
      `T: ...He hummed. He always hummed. It drove me up the wall.`,
    ],
    choices: [{ t: 'Row back to the Lantern Market', to: 251 }],
  },
  664: {
    title: 'The Lighthouse', scene: 'lighthouse', actors: [A('hero', -140, 470), A('lampkeeper', 40, 450, -1, 'talk')],
    once: { luck: 1, xp: 15 },
    text: [
      `The lighthouse stands on black rocks at the mouth of the harbor, striped red and white, its great lamp still burning though no ships can sail. The keeper is an old man with a beard like sea-foam and a brass telescope as long as he is.`,
      `"Old Wick," he says. "Keeper of the light. Not much call for it lately. I spend my nights watching her instead." He points his telescope up at the second moon, the one that hasn't moved in a month.`,
      `"That's no moon, Reader. That's a page. A blank page, the size of a cathedral, hanging in the sky. It's been there since before I was born. My grandmother said it was the Author's last page, the one she never wrote. You can only see it now because the sun's gone."`,
      `"Grandmother also said the Author was a Reader, once. Before she was an Author. Make of that what you will."`,
    ],
    choices: [
      { t: 'Look through the telescope', to: 665 },
      { t: 'Back to the Lantern Market', to: 251 },
    ],
  },
  665: {
    title: 'The Blank Page', scene: 'lighthouse', actors: [A('hero', -40, 470, 1, 'point'), A('lampkeeper', 100, 450, -1, 'idle')],
    once: { flag: 'sawPage' },
    text: [
      `Through the telescope the second moon fills the whole world: white, faintly lined, like paper. Huge. Empty.`,
      `Then, as you watch, a word appears on it, very faint, in letters that look like someone is writing them as you breathe. It's your name.`,
      `You jerk back from the eyepiece. When you look again, the page is blank.`,
      `"Saw something, did you?" says Old Wick, not unkindly. "Everyone who looks sees something different. I always see my wife's face. She died forty years ago." He pats the telescope. "Good night, Reader."`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },
  666: {
    title: 'The Fighting Pit', scene: 'pit', actors: [A('hero', -140, 470), A('pitboss', 60, 440, -1, 'talk'), A('sailor', 220, 480, -1, 'cheer'), A('villager', -260, 440, 1, 'cheer')],
    once: { quest: { pit: 'start' } },
    text: [
      `Under the docks, in a hollow between the pilings, Saltmere has built a pit: a ring of sand walled with stakes, lit by torches, surrounded by tiers of screaming sailors with nothing better to do than bet on who bleeds.`,
      `Lord Gnash runs it: a tall, painted man in a purple coat with a gold mohawk. "A Reader! Oh, the crowd will love a Reader. Three bouts. Win them all and you take the champion's helm. Lose, and you yield, and nobody dies, because nobody can these days. Isn't it marvelous? Endless violence and no funerals!"`,
    ],
    choices: [
      { t: 'Step into the pit for the first bout', ink: 'crimson', battle: 'pit1', win: 667, lose: 670 },
      { t: 'Back to the Lantern Market', to: 251 },
    ],
  },
  667: {
    title: 'First Blood', scene: 'pit', actors: [A('hero', -60, 470, 1, 'cheer'), A('pitboss', 120, 440, -1, 'cheer')],
    once: { gold: 20, xp: 15 },
    text: [
      `The crowd roars. Coins rain into the sand. Lord Gnash leaps into the ring, arms wide. "A natural! Ladies and gentlemen, a NATURAL! Shall we see if the Reader can survive the Salt Guard?"`,
    ],
    choices: [
      { t: 'The second bout', ink: 'crimson', battle: 'pit2', win: 668, lose: 670 },
      { t: 'Take your winnings and go', to: 251 },
    ],
  },
  668: {
    title: 'The Crowd Roars', scene: 'pit', actors: [A('hero', -60, 470, 1, 'cheer'), A('pitboss', 120, 440, -1, 'point'), A('agatha', 240, 460, -1, 'idle')],
    once: { gold: 30, xp: 20 },
    text: (st) => [
      `"And now," shrieks Lord Gnash, "the moment you have been waiting for. Our reigning champion. Undefeated in twenty-eight bouts. Lately of the north. Give it up for... RED AGATHA!"`,
      `A big woman in a red coat steps into the pit, a knife in each hand. She sees you and stops.`,
      st.run.quests.nim && st.run.quests.nim.done ? `"You," she says. "The one from Quillsby. You cost me thirty crowns and a perfectly good tavern." She smiles, and it isn't nice. "I've been looking forward to this."` : `"Huh," she says. "Fresh meat."`,
    ],
    choices: [
      { t: 'Fight Red Agatha', ink: 'crimson', battle: 'pit3', win: 669, lose: 670 },
      { t: 'Take your winnings and go', to: 251 },
    ],
  },
  669: {
    title: 'Champion of the Pit', scene: 'pit', actors: [A('hero', -60, 470, 1, 'cheer'), A('pitboss', 120, 440, -1, 'cheer'), A('agatha', 220, 470, -1, 'kneel')],
    once: { questDone: 'pit', item: 'gnash_helm', gold: 60, xp: 40 },
    text: [
      `Red Agatha yields on her knees in the sand, laughing through a split lip. "Fine. FINE. You win." The crowd goes berserk. Lord Gnash crowns you with a dented helm to the sound of three hundred drunk sailors stamping their feet.`,
      `As you leave, Agatha calls after you. "Tell Nim she still owes me thirty crowns." A pause. "And tell her I miss her stupid card tricks."`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },
  670: {
    title: 'Flat on the Sand', scene: 'pit', actors: [A('hero', -60, 470, 1, 'kneel'), A('pitboss', 120, 440, -1, 'talk')],
    text: [
      `You yield. The crowd boos, then cheers, because a good loss is nearly as fun as a good win. Lord Gnash helps you up, beaming. "Come back any time. We love a comeback."`,
    ],
    choices: [
      { t: 'Try again', ink: 'crimson', to: 666 },
      { t: 'Back to the Lantern Market', to: 251 },
    ],
  },
  672: {
    title: 'The Temple of the Drowned God', scene: 'temple', actors: [A('hero', -140, 470), A('priestess', 40, 450, -1, 'talk')],
    text: [
      `The temple is built half into the sea, so that the floor of the nave is a pool of black water with candles floating on it. The god is a statue of a drowned man with his arms open and his eyes closed. The priestess is a woman with sea-green hair and a voice like waves on shingle.`,
      `"Mother Undertow," she says. "The sea is the god, child. It breathes in and it breathes out. Every story is a tide. It comes in, and it goes out, and then it comes in again somewhere else."`,
      `"Your man with the shears wants high tide forever. Do you know what high tide forever is? It's a flood. Everything under the water, nothing breathing." She offers you a candle. "Light one, and the god will bless you."`,
    ],
    choices: [
      { t: 'Pray for strength', to: 673, give: { potion: { fury: 1, ironbark: 1 } } },
      { t: 'Pray for luck', to: 673, give: { luck: 2 } },
      { t: 'Pray for the people you have lost', ink: 'gold', to: 673, give: { potion: { heal: 2 }, xp: 20 } },
    ],
  },
  673: {
    title: 'Blessed', scene: 'temple', actors: [A('hero', -60, 470, 1, 'kneel'), A('priestess', 80, 450, -1, 'cast')],
    once: { flag: 'blessed' },
    text: [
      `You light the candle and set it on the water. It drifts out toward the statue, and when it touches the drowned god's feet, for just a moment, the black water of the nave stirs: in, then out. A breath.`,
      `"There," says Mother Undertow. "It still remembers. Go and remind the rest of the world."`,
    ],
    choices: [{ t: 'Back to the Lantern Market', to: 251 }],
  },

  /* ---------------- the crossing ---------------- */
  276: {
    title: 'Something in the Water', scene: 'deck', foes: 'kraken',
    text: [
      `Halfway across, the sea goes quiet. The fiddler stops playing. The lantern on the mast flickers and every flame on the ship bends the same way, toward the water, as if something below is breathing in.`,
      `Then the margin of the sea tears open like the edge of a page, and something comes up out of the white gap: a mass of black ink the size of a church, with too many arms, each one covered in crossed-out words. Its eye opens. It is the size of a cartwheel, and it is full of red editing marks.`,
      `"Margin Kraken!" screams the captain. "Every hand to the deck!"`,
      `T: Stories that fray at the edges let things in from the margins, Reader. This is a big thing.`,
    ],
    choices: [{ t: 'Defend the Gull', ink: 'crimson', battle: 'kraken', win: 277 }],
  },
  277: {
    title: 'Landfall', scene: 'deck', actors: (st) => { const a = [A('hero', -60, 470, 1, 'cheer'), A('tassel', 20, 380), A('sailor', 220, 450, -1, 'cheer')]; return a; },
    once: { xp: 40, gold: 30 },
    text: [
      `The Kraken sinks back through the torn margin with a sound like a library slamming its doors, and the sea stitches itself shut behind it. The crew cheer until they're hoarse. The captain gives you his own hat. It doesn't fit. You wear it anyway.`,
      `By dawn-that-isn't, the Folio rises out of the sea ahead: a city of paper towers burning with ten thousand windows, leaning together like gossips, crowned with red banners that snap in a wind you can't feel.`,
      `T: Here we are. The middle of the book.`,
    ],
    choices: [{ t: 'Close Chapter II', ink: 'gold', endChapter: 'III' }],
  },

  /* ---------------- endings ---------------- */
  680: {
    title: 'Queen of Thieves', scene: 'guild', ending: 'thieves', actors: [A('hero', -40, 470, 1, 'sit'), A('sable', 80, 450, -1, 'cheer'), A('e:cutpurse', 200, 430, -1, 'cheer'), A('e:guild_bruiser', -220, 470, 1, 'cheer')],
    text: [
      `The Gull sails for the Folio without you.`,
      `You stay under the market with Sable, in the hidden town between the pilings, and learn every secret Saltmere has. Within a year you run the docks. Within two, the Duchess comes to you for favors. Within five, when Sable finally retires to a house by the sea with a view of the tide, the Hollow Guild calls you Queen.`,
      `Up north the night goes on, and the Folio sends its red ships, and somewhere in the middle of the book a sad young man keeps cutting. But in Saltmere the tide comes in and the tide goes out, and the lanterns never go dark, and that is enough. Most days.`,
      `Tassel left the first winter. Went looking for another Reader, you think. You didn't stop it.`,
      `THE END.`,
    ],
  },
  681: {
    title: 'The Duchess’s Champion', scene: 'hall', ending: 'champion', actors: [A('hero', -40, 470, 1, 'kneel'), A('coralie', 80, 450, -1, 'cast'), A('e:salt_guard', 200, 430, -1, 'cheer'), A('e:salt_guard', -220, 430, 1, 'cheer')],
    text: [
      `The Duchess knights you on the whalebone floor of the Salt Palace with a sword made from a narwhal's tusk. Champion of Saltmere. Keeper of the Tide Bell.`,
      `You never sail for the Folio. There is always another smuggler, another sea-monster, another plot against the Duchess, and you are always there. The people of the Net Quarter name their children after you. The tide comes in and goes out on time, every time, because you guard it.`,
      `Sometimes, on clear nights, you climb the lighthouse and look north at the black horizon, and at the blank page in the sky, and you wonder who went instead of you. Whether anyone did.`,
      `THE END.`,
    ],
  },
  682: {
    title: 'The Bog Witch', scene: 'island', ending: 'drowned', actors: [A('hero', -40, 470, 1, 'cast'), A('gloam', 80, 450, -1, 'cheer'), A('e:bogtoad', 200, 460, -1), A('e:mirespawn', -200, 470, 1)],
    text: [
      `You never reach Saltmere. You go back with Gloam to her island instead, and she teaches you the drowning-songs: how to sing a lost page up out of the black water, so that it lives again and never has to end.`,
      `The years go by, and don't, because nothing does any more. You sing whole stories up out of the bog. They walk, and they talk, and they never stop. They aren't quite right, but they're here. You tell yourself that's what matters.`,
      `They call you Mother Fen, eventually, in the villages, though that was never your name. The real Mother Fen stopped speaking to you long ago.`,
      `Some nights you hear a little girl singing out in the reeds, and you sing back, and neither of you ever finishes the song.`,
      `THE END.`,
    ],
  },
});
