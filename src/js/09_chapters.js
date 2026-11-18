/* ==========================================================================
   Chapters - the four parts of the book, and the shuffled section numbers
   ========================================================================== */
const CHAPTERS = {
  I: { num: 'I', title: 'The Unending Night', start: 1, teaser: '' },
  II: { num: 'II', title: 'The Drowned Road', start: 200, teaser: 'South of Quillsby the sky is still black. Between you and the sea lies the Fenmire, where something is drowning stories.' },
  III: { num: 'III', title: 'The Library of Teeth', start: 300, teaser: 'The Folio: a city of paper towers, red soldiers and a Library with a mouth. The man with the shears is very close now.' },
  IV: { num: 'IV', title: 'The Last Page', start: 400, teaser: 'Behind the black door is the Bindery, and in the Bindery is the man who cut the endings out of the world.' },
};
function chapterOf(id) { id = +id || 0; return id >= 400 ? CHAPTERS.IV : id >= 300 ? CHAPTERS.III : id >= 200 ? CHAPTERS.II : CHAPTERS.I; }

/* gamebook-style shuffled section numbers; each chapter gets its own range */
const DISPLAY = (() => {
  const m = { 0: 0, 1: 1 };
  const ranges = [[2, 199, 2, 260, 1913, null], [200, 299, 261, 400, 2026, 200], [300, 399, 401, 520, 1066, 300], [400, 499, 521, 600, 1492, 400]];
  for (const [lo, hi, a, b, seed, start] of ranges) {
    const ids = Object.keys(SECTIONS).map(Number).filter((n) => n >= lo && n <= hi && n > 1 && n !== start).sort((x, y) => x - y);
    const r = mulberry32(seed), pool = [];
    for (let i = start ? a + 1 : a; i <= b; i++) pool.push(i);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    if (start) m[start] = a;
    ids.forEach((id, i) => { m[id] = pool[i]; });
  }
  return m;
})();
