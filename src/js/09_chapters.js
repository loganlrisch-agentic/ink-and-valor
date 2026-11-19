/* ==========================================================================
   Chapters - the four parts of the book, and the shuffled section numbers.
   Section ids are grouped in ranges; each range belongs to one chapter.
   ========================================================================== */
const CHAPTERS = {
  I: { num: 'I', title: 'The Unending Night', start: 1, teaser: '' },
  II: { num: 'II', title: 'The Drowned Road', start: 200, teaser: 'South of Quillsby the sky is still black. Between you and the sea lies the Fenmire, where something is drowning stories.' },
  III: { num: 'III', title: 'The Library of Teeth', start: 300, teaser: 'The Folio: a city of paper towers, red soldiers and a Library with a mouth. The man with the shears is very close now.' },
  IV: { num: 'IV', title: 'The Last Page', start: 400, teaser: 'Behind the black door is the Bindery, and in the Bindery is the man who cut the endings out of the world.' },
};
const CHAPTER_RANGES = [[0, 199, 'I'], [1000, 1199, 'I'], [200, 299, 'II'], [600, 699, 'II'], [1200, 1399, 'II'], [300, 399, 'III'], [700, 799, 'III'], [1400, 1599, 'III'], [400, 599, 'IV'], [800, 899, 'IV'], [1600, 1999, 'IV']];
function chapterOf(id) { id = +id || 0; for (const [lo, hi, k] of CHAPTER_RANGES) if (id >= lo && id <= hi) return CHAPTERS[k]; return CHAPTERS.I; }

/* gamebook-style shuffled section numbers; each chapter gets its own block of numbers */
const DISPLAY = (() => {
  const m = { 0: 0, 1: 1 };
  const blocks = { I: [2, 299, 1913], II: [300, 599, 2026], III: [600, 899, 1066], IV: [900, 1199, 1492] };
  for (const k of Object.keys(blocks)) {
    const [a, b, seed] = blocks[k], start = CHAPTERS[k].start;
    const ids = Object.keys(SECTIONS).map(Number).filter((n) => n > 1 && chapterOf(n).num === k && n !== start).sort((x, y) => x - y);
    const r = mulberry32(seed), pool = [];
    for (let i = start > 1 ? a + 1 : a; i <= b; i++) pool.push(i);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    if (start > 1) m[start] = a;
    ids.forEach((id, i) => { m[id] = pool[i]; });
  }
  return m;
})();
