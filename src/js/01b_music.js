/* ==========================================================================
   Music - a small WebAudio orchestra that plays the score of the book.
   Every track is written here as notes (scale degrees) and synthesized
   live: harp, lute, fiddle, flute, horn, choir, organ, strings, bells,
   harpsichord, accordion, cello and war drums. Tracks follow the scene.
   ========================================================================== */
const Music = (() => {
  let ctx = null, out = null, rev = null, cur = null, timer = null, enabled = true, want = null, unlocked = false;
  const VOL = 0.3;
  const SCALES = { aeolian: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], harmonic: [0, 2, 3, 5, 7, 8, 11] };
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  /* ---------------- setup ---------------- */
  function init() {
    if (ctx) return true;
    ctx = Sound.ensure(); if (!ctx) return false;
    out = ctx.createGain(); out.gain.value = enabled ? VOL : 0;
    // a cathedral-ish reverb from a decaying noise impulse
    const len = Math.floor(ctx.sampleRate * 3.2), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev = ctx.createConvolver(); rev.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.42;
    rev.connect(wet); wet.connect(out);
    out.connect(Sound.output() || ctx.destination);
    return true;
  }

  /* ---------------- instruments ---------------- */
  function voice(bus, t, dur, vel, build) {
    const g = ctx.createGain(), send = ctx.createGain();
    g.connect(bus.dry); send.connect(bus.wet); send.gain.value = bus.send;
    g.connect(send);
    build(g, t, dur, vel);
  }
  function osc(type, f, t, stop, dest, detune) { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (detune) o.detune.setValueAtTime(detune, t); o.connect(dest); o.start(t); o.stop(stop); return o; }
  function lp(f, q, dest) { const b = ctx.createBiquadFilter(); b.type = 'lowpass'; b.frequency.value = f; b.Q.value = q || 0.7; b.connect(dest); return b; }
  function adsr(g, t, a, d, s, r, dur, v) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v * s), t + a + d); g.gain.setValueAtTime(Math.max(0.0002, v * s), t + Math.max(a + d, dur)); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a + d, dur) + r); return t + Math.max(a + d, dur) + r + 0.05; }
  function vib(o, t, end, rate, depth) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = rate; lg.gain.value = depth; l.connect(lg); lg.connect(o.frequency); l.start(t + 0.15); l.stop(end); }

  const INST = {
    harp(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.004, 1.6, 0.0001, 0.2, 0.01, v * 0.5); const fl = lp(3200, 0.5, a); fl.frequency.setValueAtTime(4200, t); fl.frequency.exponentialRampToValueAtTime(900, t + 0.8); osc('triangle', f, t, end, fl); osc('sine', f * 2, t, end, fl); },
    lute(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.003, 0.6, 0.0001, 0.1, 0.01, v * 0.45); const fl = lp(2400, 2, a); fl.frequency.setValueAtTime(3000, t); fl.frequency.exponentialRampToValueAtTime(600, t + 0.35); osc('sawtooth', f, t, end, fl); osc('triangle', f * 0.5, t, end, fl); },
    harpsichord(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.002, 0.45, 0.0001, 0.08, 0.01, v * 0.3); const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300; hp.connect(a); const fl = lp(5000, 1, hp); osc('sawtooth', f, t, end, fl); osc('square', f * 2, t, end, fl, 4); },
    fiddle(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.06, 0.1, 0.8, 0.15, dur * 0.95, v * 0.28); const fl = lp(2600, 1.2, a); const o = osc('sawtooth', f, t, end, fl); vib(o, t, end, 5.5, f * 0.008); },
    flute(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.07, 0.1, 0.85, 0.2, dur * 0.95, v * 0.42); const o = osc('sine', f, t, end, a); osc('triangle', f * 2, t, end, lp(1800, 0.5, a)).frequency.setValueAtTime(f * 2, t); vib(o, t, end, 4.8, f * 0.006); const n = ctx.createBufferSource(); n.buffer = noiseBuffer(); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 2; const ng = ctx.createGain(); ng.gain.value = v * 0.04; n.connect(bp); bp.connect(ng); ng.connect(a); n.start(t); n.stop(end); },
    horn(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.09, 0.2, 0.75, 0.25, dur * 0.95, v * 0.3); const fl = lp(700, 1.5, a); fl.frequency.setValueAtTime(400, t); fl.frequency.linearRampToValueAtTime(1500, t + 0.15); fl.frequency.linearRampToValueAtTime(1000, t + 0.5); osc('sawtooth', f, t, end, fl); osc('sawtooth', f, t, end, fl, 7); },
    choir(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.35, 0.3, 0.9, 0.8, dur, v * 0.16); for (const [ff, q, gg] of [[800, 6, 1], [1150, 8, 0.6], [2900, 10, 0.25]]) { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = ff; bp.Q.value = q; const bg = ctx.createGain(); bg.gain.value = gg * 3; bp.connect(bg); bg.connect(a); for (const dt of [-8, 7]) { const o = osc('sawtooth', f, t, end, bp, dt); vib(o, t, end, 5 + Math.random(), f * 0.004); } } },
    strings(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.4, 0.3, 0.85, 0.9, dur, v * 0.14); const fl = lp(1600, 0.6, a); for (const dt of [-8, 0, 7]) { const o = osc('sawtooth', f, t, end, fl, dt); vib(o, t, end, 5.2, f * 0.004); } },
    organ(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.12, 0.2, 0.9, 0.6, dur, v * 0.14); for (const [m, gg] of [[0.5, 0.5], [1, 1], [2, 0.5], [3, 0.25], [4, 0.2]]) { const og = ctx.createGain(); og.gain.value = gg; og.connect(a); osc('sine', f * m, t, end, og); } },
    bell(g, t, dur, v, f) { for (const [m, gg, d] of [[1, 1, 3.2], [2.76, 0.4, 1.6], [5.4, 0.2, 0.8], [0.5, 0.35, 3.6]]) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.003, d, 0.0001, 0.2, 0.01, v * 0.22 * gg); osc('sine', f * m, t, end, a); } },
    accordion(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.03, 0.1, 0.8, 0.1, dur * 0.9, v * 0.2); const fl = lp(1800, 1, a); osc('square', f, t, end, fl, -6); osc('square', f, t, end, fl, 6); osc('sawtooth', f * 2, t, end, fl); const tr = ctx.createOscillator(), tg = ctx.createGain(); tr.frequency.value = 6; tg.gain.value = v * 0.05; tr.connect(tg); tg.connect(a.gain); tr.start(t); tr.stop(end); },
    cello(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.08, 0.2, 0.8, 0.3, dur * 0.95, v * 0.3); const fl = lp(900, 0.8, a); const o = osc('sawtooth', f, t, end, fl); vib(o, t, end, 5, f * 0.005); osc('sine', f / 2, t, end, a); },
    bass(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 0.01, 0.25, 0.6, 0.12, dur * 0.85, v * 0.4); osc('triangle', f, t, end, lp(500, 1, a)); osc('sine', f / 2, t, end, a); },
    drone(g, t, dur, v, f) { const a = ctx.createGain(); a.connect(g); const end = adsr(a, t, 1.2, 0.5, 0.9, 1.5, dur, v * 0.16); const fl = lp(420, 0.5, a); osc('sawtooth', f, t, end, fl, -5); osc('sawtooth', f * 1.5, t, end, fl, 4); osc('sine', f / 2, t, end, a); },
  };
  let nb = null;
  function noiseBuffer() { if (nb) return nb; const len = ctx.sampleRate; nb = ctx.createBuffer(1, len, ctx.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; return nb; }
  const DRUM = {
    taiko(g, t, v) { const o = ctx.createOscillator(), a = ctx.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.35); a.gain.setValueAtTime(v * 0.9, t); a.gain.exponentialRampToValueAtTime(0.001, t + 0.7); o.connect(a); a.connect(g); o.start(t); o.stop(t + 0.75); hit(g, t, v * 0.25, 'lowpass', 300, 0.25); },
    tom(g, t, v) { const o = ctx.createOscillator(), a = ctx.createGain(); o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.2); a.gain.setValueAtTime(v * 0.6, t); a.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(a); a.connect(g); o.start(t); o.stop(t + 0.4); },
    snare(g, t, v) { hit(g, t, v * 0.35, 'bandpass', 2200, 0.18); const o = ctx.createOscillator(), a = ctx.createGain(); o.frequency.value = 220; a.gain.setValueAtTime(v * 0.2, t); a.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.connect(a); a.connect(g); o.start(t); o.stop(t + 0.12); },
    shaker(g, t, v) { hit(g, t, v * 0.12, 'highpass', 6000, 0.06); },
    frame(g, t, v) { hit(g, t, v * 0.3, 'bandpass', 700, 0.12); },
    toll(g, t, v) { INST.bell(g, t, 3, v * 1.4, hz(43)); },
  };
  function hit(g, t, v, type, f, d) { const n = ctx.createBufferSource(); n.buffer = noiseBuffer(); const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; const a = ctx.createGain(); a.gain.setValueAtTime(v, t); a.gain.exponentialRampToValueAtTime(0.001, t + d); n.connect(b); b.connect(a); a.connect(g); n.start(t, Math.random() * 0.5); n.stop(t + d + 0.02); }

  /* ---------------- score helpers ---------------- */
  function parse(str) { // "4:2 3:.5 r:1 6+:1" -> [{d, b, len}]
    const ev = []; let beat = 0;
    for (const tok of str.replace(/\|/g, ' ').trim().split(/\s+/)) { const [d, l] = tok.split(':'); const len = parseFloat(l); if (d !== 'r') ev.push({ d, b: beat, len }); beat += len; }
    return { ev, total: beat };
  }
  function note(T, d, oct) {
    let acc = 0; if (typeof d === 'string') { if (d.endsWith('+')) acc = 1; else if (d.endsWith('-')) acc = -1; d = parseInt(d, 10); }
    const sc = SCALES[T.mode], o = Math.floor(d / 7), i = ((d % 7) + 7) % 7;
    return T.root + (oct || 0) * 12 + o * 12 + sc[i] + acc;
  }
  function chordNotes(T, c) {
    let r = c, q = null; if (typeof c === 'string') { q = c.slice(-1); r = parseInt(c, 10); }
    const root = note(T, r);
    if (q === 'M') return [root, root + 4, root + 7];
    if (q === 'm') return [root, root + 3, root + 7];
    if (q === 'd') return [root, root + 3, root + 6];
    return [root, note(T, r + 2), note(T, r + 4)];
  }

  /* ---------------- the score ---------------- */
  const THEME_A = '4:2 3:.5 2:.5 3:1 | 2:1.5 1:.5 0:1 -2:1 | 2:1 4:1 7:2 | 6:1.5 5:.5 4:2 | 4:1 5:1 6:1 7:1 | 7:1.5 5:.5 3:2 | 4:1 6+:1 8:2 | 7:4';
  const THEME_B = '5:1 4:1 2:2 | 6:1 5:1 3:2 | 4:1.5 2:.5 0:2 | r:2 0:.5 2:.5 4:1 | 7:2 5:2 | 6:2 8:2 | 6+:2 4:2 | 4:4';
  const TRACKS = {
    theme: { tempo: 74, bpb: 4, root: 50, mode: 'aeolian', chords: [0, 5, 2, 6, 0, 3, '4M', 0, 5, 6, 0, 0, 5, 6, '4M', '4M'], melody: THEME_A + ' | ' + THEME_B, lead: 'horn', leadOct: 1, pad: 'strings', bass: 'cello', bassPat: 'root', arp: 'harp', arpPat: 'up8', drums: 'march', choirOn: [4, 5, 6, 7, 12, 13, 14, 15] },
    ending: { tempo: 62, bpb: 4, root: 50, mode: 'aeolian', chords: [0, 5, 2, 6, 0, 3, '4M', 0], melody: THEME_A, lead: 'flute', leadOct: 1, pad: 'choir', bass: 'cello', bassPat: 'root', arp: 'harp', arpPat: 'up4' },
    moor: { tempo: 58, bpb: 4, root: 57, mode: 'dorian', chords: [0, 0, 5, 6, 0, 4, 5, 4], melody: 'r:2 4:1 3:1 | 2:2 1:1 0:1 | r:1 0:1 2:1 3:1 | 4:3 r:1 | 7:2 6:1 4:1 | 4:2 3:1 1:1 | 2:2 3:1 2:1 | 1:4', lead: 'flute', leadOct: 0, pad: 'drone', bass: null, arp: 'harp', arpPat: 'slow', ambient: 'wind' },
    village: { tempo: 92, bpb: 3, root: 52, mode: 'harmonic', chords: [0, 6, 5, '4M', 0, 6, 5, '4M'], melody: '0:1 2:1 4:1 | 3:1.5 2:.5 1:1 | 2:1 4:1 5:1 | 4:2 6:1 | 7:1 6:1 4:1 | 3:1 4:1 1:1 | 2:1 0:1 2:1 | 4:3', lead: 'fiddle', leadOct: 1, pad: null, bass: 'bass', bassPat: 'waltz', arp: 'lute', arpPat: 'waltz', drums: 'frame3' },
    tavern: { tempo: 116, bpb: 4, root: 50, mode: 'dorian', chords: [0, 0, 6, 6, 3, 3, 4, 0], melody: '0:.5 2:.5 4:.5 2:.5 0:.5 2:.5 4:1 | 5:.5 4:.5 2:.5 4:.5 5:1 7:1 | 6:.5 4:.5 1:.5 4:.5 6:.5 4:.5 1:1 | 6:.5 7:.5 6:.5 4:.5 2:2 | 3:.5 5:.5 7:.5 5:.5 3:.5 5:.5 7:1 | 8:.5 7:.5 5:.5 3:.5 5:2 | 4:.5 6:.5 8:.5 6:.5 4:1 3:.5 2:.5 | 1:.5 2:.5 1:.5 0:.5 0:2', lead: 'fiddle', leadOct: 1, pad: null, bass: 'bass', bassPat: 'oompah', arp: 'lute', arpPat: 'strum', drums: 'jig' },
    fen: { tempo: 52, bpb: 4, root: 52, mode: 'phrygian', chords: [0, 1, 0, 6, 0, 1, 2, 1], melody: '7:2 r:2 | 8:1 7:1 r:2 | 4:2 3:2 | r:4 | 9:2 8:2 | 7:3 r:1 | 6:1 5:1 4:2 | 1:4', lead: 'bell', leadOct: 1, pad: 'choir', bass: 'drone', bassPat: 'drone', arp: 'harp', arpPat: 'sparse', ambient: 'marsh' },
    crypt: { tempo: 50, bpb: 4, root: 50, mode: 'aeolian', chords: [0, 0, 3, 4, 5, 3, '4M', 0], melody: '0:2 1:1 2:1 | 3:2 2:2 | 4:2 3:1 2:1 | 1:4 | 2:1 3:1 4:2 | 5:2 4:2 | 3:1 2:1 1:2 | 0:4', lead: 'choir', leadOct: 1, pad: 'organ', bass: 'drone', bassPat: 'drone', arp: null, drums: 'toll' },
    saltmere: { tempo: 100, bpb: 4, root: 55, mode: 'aeolian', chords: [0, 6, 5, 0, 0, 3, '4M', 0], melody: '0:.5 2:.5 4:1 4:.5 3:.5 2:1 | 1:.5 2:.5 3:1 1:2 | -1:.5 1:.5 3:1 3:.5 2:.5 1:1 | 0:1 2:1 0:2 | 4:1 7:1 6:.5 5:.5 4:1 | 3:1 5:1 4:2 | 2:.5 3:.5 4:1 3:.5 2:.5 1+:1 | 0:3 r:1', lead: 'accordion', leadOct: 1, pad: null, bass: 'bass', bassPat: 'shanty', arp: 'lute', arpPat: 'offbeat', drums: 'shanty', ambient: 'sea' },
    folio: { tempo: 98, bpb: 4, root: 48, mode: 'harmonic', chords: [0, 0, 3, '4M', 0, 5, 3, 0], melody: '0:1 2:1 4:1 7:1 | 6:1 7:.5 6:.5 5:1 4:1 | 3:1 5:1 3:1 1:1 | 4:2 6:2 | 7:1 9:1 8:1 7:1 | 5:1 7:1 6:1 5:1 | 4:1 3:1 2:1 6:1 | 7:4', lead: 'fiddle', leadOct: 0, pad: 'strings', bass: 'cello', bassPat: 'walk', arp: 'harpsichord', arpPat: 'alberti' },
    library: { tempo: 66, bpb: 4, root: 47, mode: 'phrygian', chords: [0, 1, 0, 1, 3, 5, 1, 0], melody: '0:2 1:2 | 0:4 | 2:2 3:2 | 1:4 | 4:2 5:2 | 4:2 3:1 2:1 | 1:2 2:1 1:1 | 0:4', lead: 'choir', leadOct: 1, pad: 'strings', bass: 'cello', bassPat: 'heart', arp: 'harpsichord', arpPat: 'sparse', drums: 'heartbeat' },
    battle: { tempo: 138, bpb: 4, root: 50, mode: 'harmonic', chords: [0, 5, 6, '4M', 0, 3, 5, '4M'], melody: '0:1.5 0:.5 2:1 3:1 | 4:2 3:1 2:1 | 1:1.5 1:.5 2:1 3:1 | 4:4 | 7:1.5 6:.5 5:1 4:1 | 5:1.5 4:.5 3:2 | 2:1 3:1 4:1 6+:1 | 7:2 4:2', lead: 'horn', leadOct: 1, pad: 'strings', bass: 'cello', bassPat: 'ostinato', arp: null, drums: 'battle' },
    boss: { tempo: 148, bpb: 4, root: 48, mode: 'phrygian', chords: [0, 0, 5, 1, 0, 0, 3, '4M'], melody: '0:2 1:2 | 0:2 -1+:2 | 3:2 4:2 | 1:4 | 7:2 8:2 | 7:2 5:2 | 4:1 3:1 1:1 0:1 | 0:4', lead: 'choir', leadOct: 1, pad: 'organ', bass: 'cello', bassPat: 'ostinato', arp: null, drums: 'boss' },
    finale: { tempo: 128, bpb: 4, root: 50, mode: 'aeolian', chords: [0, 5, 2, 6, 0, 3, '4M', 0, 5, 6, 0, 0, 5, 6, '4M', '4M'], melody: THEME_A + ' | ' + THEME_B, lead: 'horn', leadOct: 1, pad: 'choir', bass: 'cello', bassPat: 'ostinato', arp: 'harp', arpPat: 'up8', drums: 'battle' },
  };
  for (const T of Object.values(TRACKS)) { const m = parse(T.melody); T.mel = m.ev; T.bars = T.chords.length; T.len = T.bars * T.bpb; }

  const ARP = {
    up8: (n) => [0, 1, 2, 1, 0, 1, 2, 1].map((k, i) => [i * 0.5, n[k] + 12 * (i >= 4 ? 1 : 0), 0.5]),
    up4: (n) => [0, 1, 2, 1].map((k, i) => [i, n[k] + 12, 1]),
    slow: (n) => [[0, n[0], 2], [2, n[2], 1], [3, n[1] + 12, 1]],
    sparse: (n) => [[0, n[0] + 12, 2], [2.5, n[2] + 12, 1.5]],
    waltz: (n) => [[1, n[1], 0.9], [1, n[2], 0.9], [2, n[1], 0.9], [2, n[2], 0.9]],
    strum: (n) => [0, 1, 2, 3].flatMap((b) => [[b + 0.5, n[0] + 12, 0.4], [b + 0.52, n[1] + 12, 0.4], [b + 0.54, n[2] + 12, 0.4]]),
    offbeat: (n) => [0.5, 1.5, 2.5, 3.5].flatMap((b) => [[b, n[1] + 12, 0.4], [b + 0.01, n[2] + 12, 0.4]]),
    alberti: (n) => [0, 2, 1, 2, 0, 2, 1, 2].map((k, i) => [i * 0.5, n[k] + 12, 0.45]),
  };
  const BASS = {
    root: (n, bpb) => [[0, n[0] - 12, bpb]],
    drone: (n, bpb) => [[0, n[0] - 12, bpb]],
    waltz: (n) => [[0, n[0] - 12, 1]],
    oompah: (n) => [[0, n[0] - 12, 1], [1, n[2] - 24, 1], [2, n[0] - 12, 1], [3, n[2] - 24, 1]],
    shanty: (n) => [[0, n[0] - 12, 1], [1, n[2] - 12, 1], [2, n[0] - 12, 1], [3, n[2] - 12, 1]],
    walk: (n) => [[0, n[0] - 12, 1], [1, n[1] - 12, 1], [2, n[2] - 12, 1], [3, n[1] - 12, 1]],
    ostinato: (n) => [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((b, i) => [b, (i % 4 === 3 ? n[2] : n[0]) - 12, 0.45]),
    heart: (n) => [[0, n[0] - 12, 0.5], [0.5, n[0] - 12, 1.5], [2, n[0] - 12, 0.5], [2.5, n[0] - 12, 1.5]],
  };
  const DRUMS = {
    march: [[0, 'taiko', 0.7], [2, 'taiko', 0.4], [3.5, 'tom', 0.3]],
    frame3: [[0, 'frame', 0.6], [1, 'shaker', 0.5], [2, 'shaker', 0.5]],
    jig: [[0, 'frame', 0.7], [1, 'shaker', 0.5], [1.5, 'frame', 0.4], [2, 'frame', 0.6], [3, 'shaker', 0.5], [3.5, 'frame', 0.4]],
    shanty: [[0, 'tom', 0.6], [2, 'tom', 0.5], [1, 'frame', 0.4], [3, 'frame', 0.4]],
    toll: [[0, 'toll', 0.5]],
    heartbeat: [[0, 'tom', 0.5], [0.4, 'tom', 0.35], [2, 'tom', 0.5], [2.4, 'tom', 0.35]],
    battle: [[0, 'taiko', 0.8], [1, 'snare', 0.5], [1.5, 'tom', 0.4], [2, 'taiko', 0.6], [2.5, 'taiko', 0.4], [3, 'snare', 0.5], [3.75, 'snare', 0.3]],
    boss: [[0, 'taiko', 0.9], [0.5, 'taiko', 0.5], [1, 'snare', 0.6], [2, 'taiko', 0.9], [2.5, 'taiko', 0.5], [3, 'snare', 0.6], [3.5, 'tom', 0.5], [3.75, 'tom', 0.5]],
  };

  /* ---------------- playback ---------------- */
  function startTrack(name) {
    const T = TRACKS[name]; if (!T) return;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2.0); g.connect(out);
    const wet = ctx.createGain(); wet.connect(rev); wet.gain.value = 1;
    const bus = { dry: g, wet, send: name === 'crypt' || name === 'fen' || name === 'library' ? 0.75 : name === 'tavern' || name === 'battle' ? 0.25 : 0.45 };
    cur = { name, T, bus, bar: 0, next: ctx.currentTime + 0.15, spb: 60 / T.tempo, amb: null };
    if (T.ambient) cur.amb = ambient(T.ambient, g);
  }
  function stopTrack(c, fade) {
    if (!c) return; const t = ctx.currentTime;
    c.bus.dry.gain.cancelScheduledValues(t); c.bus.dry.gain.setValueAtTime(Math.max(0.0001, c.bus.dry.gain.value), t); c.bus.dry.gain.exponentialRampToValueAtTime(0.0001, t + fade);
    c.bus.wet.gain.setTargetAtTime(0, t, fade / 3);
    setTimeout(() => { try { c.bus.dry.disconnect(); c.bus.wet.disconnect(); if (c.amb) c.amb.stop(); } catch (e) { /* gone */ } }, (fade + 4) * 1000);
  }
  function ambient(kind, dest) {
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(); n.loop = true;
    const b = ctx.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = kind === 'sea' ? 500 : kind === 'marsh' ? 1400 : 650; b.Q.value = 0.6;
    const g = ctx.createGain(); g.gain.value = kind === 'sea' ? 0.05 : 0.035;
    const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = kind === 'sea' ? 0.12 : 0.07; lg.gain.value = kind === 'sea' ? 0.04 : 0.025; l.connect(lg); lg.connect(g.gain); l.start();
    n.connect(b); b.connect(g); g.connect(dest); n.start();
    return { stop() { try { n.stop(); l.stop(); } catch (e) { /* gone */ } } };
  }
  function scheduleBar(c) {
    const T = c.T, t0 = c.next, spb = c.spb, bi = c.bar % T.bars, bus = c.bus;
    const ch = chordNotes(T, T.chords[bi]);
    const play = (inst, b, m, len, v) => voice(bus, t0 + b * spb, len * spb, v, (g, t, d, vv) => INST[inst](g, t, d, vv, hz(m)));
    if (T.pad) for (const m of ch) play(T.pad, 0, m, T.bpb, T.pad === 'drone' ? 0.8 : 0.7);
    if (T.choirOn && T.choirOn.includes(bi)) for (const m of ch) play('choir', 0, m + 12, T.bpb, 0.6);
    if (T.bass && BASS[T.bassPat]) for (const [b, m, len] of BASS[T.bassPat](ch, T.bpb)) play(T.bass, b, m, len, 0.8);
    if (T.arp && ARP[T.arpPat]) for (const [b, m, len] of ARP[T.arpPat](ch)) if (b < T.bpb) play(T.arp, b, m, len, 0.55);
    const b0 = bi * T.bpb, b1 = b0 + T.bpb;
    for (const e of T.mel) if (e.b >= b0 && e.b < b1) play(T.lead, e.b - b0, note(T, e.d, T.leadOct), e.len, 0.8);
    if (T.drums) for (const [b, k, v] of DRUMS[T.drums]) if (b < T.bpb) { const tt = t0 + b * spb; DRUM[k](bus.dry, tt, v); }
    c.next += T.bpb * spb; c.bar++;
  }
  function tick() {
    if (!ctx || !cur) return;
    while (cur.next < ctx.currentTime + 0.35) scheduleBar(cur);
  }

  function setTrack(name) {
    want = name;
    if (!unlocked || !enabled) return;
    if (!init()) return;
    if (cur && cur.name === name) return;
    if (cur) stopTrack(cur, 1.6);
    cur = null;
    if (name && TRACKS[name]) startTrack(name);
    if (!timer) timer = setInterval(tick, 60);
  }
  const SCENE_TRACK = { moor: 'moor', dawn: 'moor', crossroads: 'moor', blank: 'moor', village: 'village', shop: 'village', mill: 'village', river: 'moor', bridge: 'moor', gate: 'village', camp: 'tavern', campback: 'tavern', tent: 'tavern', tavern: 'tavern', inn: 'tavern', wood: 'fen', fen: 'fen', croakwater: 'fen', warrens: 'fen', island: 'fen', hut: 'fen', churchyard: 'crypt', crypt: 'crypt', cellar: 'crypt', chapel: 'crypt', monastery: 'crypt', temple: 'crypt', tomb: 'crypt', saltmere: 'saltmere', lighthouse: 'saltmere', deck: 'saltmere', ghostship: 'fen', pit: 'tavern', guild: 'saltmere', hall: 'folio', folio: 'folio', archive: 'folio', correction: 'library', inkworks: 'library', underfolio: 'crypt', gardens: 'folio', vault: 'folio', stacks: 'library', library: 'library', bindery: 'library', whitepage: 'ending', ninth: 'moor', longhall: 'crypt', ballroom: 'folio', clockfall: 'folio', clockwork: 'library' };
  return {
    TRACKS,
    unlock() { if (unlocked) return; unlocked = true; if (want) { const w = want; want = null; setTrack(w); } },
    setTrack,
    forScene(scene, sec) {
      if (sec && (sec.ending || sec.chapterEnding)) return setTrack('ending');
      if (sec && sec.death) return setTrack('crypt');
      setTrack(SCENE_TRACK[scene] || 'moor');
    },
    forBattle(id) { const d = BATTLES[id] || {}; setTrack(/^finale/.test(id) ? 'finale' : d.boss ? 'boss' : 'battle'); },
    setEnabled(v) {
      enabled = !!v;
      if (!enabled) { if (cur) { want = cur.name; if (ctx) stopTrack(cur, 0.6); cur = null; } return; }
      if (out) out.gain.setTargetAtTime(VOL, ctx.currentTime, 0.3);
      if (want) { const w = want; want = null; setTrack(w); }
    },
    get current() { return cur && cur.name; },
  };
})();
