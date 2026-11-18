/* ==========================================================================
   Audio - everything synthesized with WebAudio (no files)
   ========================================================================== */
const Sound = (() => {
  let ctx = null, master = null, comp = null, noiseBuf = null, enabled = true;
  let last = {};

  function ensure() {
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -16; comp.ratio.value = 4;
        master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(comp); comp.connect(ctx.destination);
        const len = ctx.sampleRate * 1.5;
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function env(g, t0, attack, dur, vol) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  function tone(o) {
    const c = ctx; if (!c) return;
    const t0 = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t0 + (o.dur || 0.2));
    if (o.detune) osc.detune.value = o.detune;
    env(g, t0, o.attack || 0.005, o.dur || 0.2, o.vol || 0.2);
    let node = osc;
    if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; node.connect(f); node = f; }
    node.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + (o.dur || 0.2) + 0.05);
  }

  function noise(o) {
    const c = ctx; if (!c) return;
    const t0 = c.currentTime + (o.delay || 0);
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = o.rate || 1;
    const f = c.createBiquadFilter();
    f.type = o.filter || 'bandpass';
    f.frequency.setValueAtTime(o.f || 1000, t0);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t0 + (o.dur || 0.2));
    f.Q.value = o.q || 1;
    const g = c.createGain();
    env(g, t0, o.attack || 0.004, o.dur || 0.2, o.vol || 0.2);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0, Math.random() * 0.5); src.stop(t0 + (o.dur || 0.2) + 0.05);
  }

  const S = {
    page() { noise({ dur: 0.28, vol: 0.16, filter: 'highpass', f: 1500, f2: 700, q: 0.7 }); noise({ dur: 0.1, vol: 0.12, filter: 'bandpass', f: 3500, q: 1.2, delay: 0.16 }); },
    click() { tone({ f: 420, f2: 300, type: 'triangle', dur: 0.06, vol: 0.09 }); },
    lock() { tone({ f: 180, f2: 140, type: 'square', dur: 0.08, vol: 0.05, lp: 900 }); },
    swing() { noise({ dur: 0.16, vol: 0.13, filter: 'bandpass', f: 500, f2: 2600, q: 2.2 }); },
    steel() { tone({ f: 1800, f2: 1200, type: 'triangle', dur: 0.12, vol: 0.06 }); noise({ dur: 0.07, vol: 0.18, filter: 'highpass', f: 2500 }); tone({ f: 150, f2: 60, dur: 0.12, vol: 0.28 }); },
    blunt() { tone({ f: 120, f2: 45, dur: 0.18, vol: 0.4 }); noise({ dur: 0.08, vol: 0.2, filter: 'lowpass', f: 1200 }); },
    crit() { tone({ f: 90, f2: 35, dur: 0.3, vol: 0.45 }); noise({ dur: 0.12, vol: 0.25, filter: 'bandpass', f: 1800, q: 0.8 }); tone({ f: 2400, f2: 1600, type: 'square', dur: 0.08, vol: 0.04 }); },
    bone() { for (let i = 0; i < 4; i++) noise({ dur: 0.04, vol: 0.14, filter: 'bandpass', f: 2200 + i * 500, q: 4, delay: i * 0.025 }); tone({ f: 200, f2: 90, dur: 0.1, vol: 0.12 }); },
    splat() { tone({ f: 260, f2: 60, dur: 0.22, vol: 0.22 }); noise({ dur: 0.2, vol: 0.16, filter: 'lowpass', f: 700, f2: 200 }); },
    hurt() { tone({ f: 200, f2: 110, type: 'sawtooth', dur: 0.16, vol: 0.08, lp: 1400 }); noise({ dur: 0.08, vol: 0.14, filter: 'lowpass', f: 900 }); },
    fire() { noise({ dur: 0.45, vol: 0.2, filter: 'bandpass', f: 600, f2: 2400, q: 0.6 }); },
    boom() { noise({ dur: 0.6, vol: 0.32, filter: 'lowpass', f: 1400, f2: 120 }); tone({ f: 110, f2: 38, dur: 0.45, vol: 0.38 }); },
    frost() { [1568, 2093, 2637, 3136].forEach((f, i) => tone({ f, type: 'sine', dur: 0.5, vol: 0.035, delay: i * 0.03 })); noise({ dur: 0.35, vol: 0.1, filter: 'highpass', f: 5000 }); },
    zap() { for (let i = 0; i < 5; i++) noise({ dur: 0.05, vol: 0.12, filter: 'highpass', f: 3000 + Math.random() * 3000, delay: i * 0.03 }); tone({ f: 900, f2: 140, type: 'sawtooth', dur: 0.2, vol: 0.05, lp: 4000 }); },
    holy() { [523, 784, 1046, 1568].forEach((f, i) => tone({ f, type: 'sine', dur: 0.8, vol: 0.05, delay: i * 0.05, attack: 0.04 })); },
    dark() { tone({ f: 70, f2: 50, type: 'sawtooth', dur: 0.6, vol: 0.1, lp: 500, attack: 0.08 }); tone({ f: 105, f2: 70, type: 'sine', dur: 0.6, vol: 0.12, attack: 0.1 }); },
    twang() { tone({ f: 320, f2: 160, type: 'triangle', dur: 0.12, vol: 0.12 }); noise({ dur: 0.1, vol: 0.12, filter: 'bandpass', f: 1600, q: 3 }); },
    heal() { [659, 784, 988, 1318].forEach((f, i) => tone({ f, type: 'sine', dur: 0.35, vol: 0.06, delay: i * 0.07, attack: 0.02 })); },
    gulp() { tone({ f: 300, f2: 520, type: 'sine', dur: 0.09, vol: 0.12 }); tone({ f: 280, f2: 500, type: 'sine', dur: 0.09, vol: 0.1, delay: 0.12 }); },
    glass() { tone({ f: 2600, f2: 1900, type: 'triangle', dur: 0.15, vol: 0.06 }); noise({ dur: 0.15, vol: 0.12, filter: 'highpass', f: 4000 }); },
    coin() { tone({ f: 1318, type: 'square', dur: 0.05, vol: 0.035 }); tone({ f: 1976, type: 'square', dur: 0.1, vol: 0.035, delay: 0.05 }); },
    blink() { tone({ f: 300, f2: 1400, type: 'sine', dur: 0.18, vol: 0.08 }); noise({ dur: 0.18, vol: 0.06, filter: 'highpass', f: 3000 }); },
    shout() { tone({ f: 160, f2: 120, type: 'sawtooth', dur: 0.4, vol: 0.12, lp: 900 }); tone({ f: 240, f2: 180, type: 'sawtooth', dur: 0.4, vol: 0.08, lp: 1200 }); noise({ dur: 0.35, vol: 0.08, filter: 'bandpass', f: 700 }); },
    slam() { tone({ f: 70, f2: 28, dur: 0.6, vol: 0.5 }); noise({ dur: 0.45, vol: 0.28, filter: 'lowpass', f: 600, f2: 90 }); },
    roar() { tone({ f: 110, f2: 70, type: 'sawtooth', dur: 1.1, vol: 0.14, lp: 700, attack: 0.08 }); tone({ f: 82, f2: 60, type: 'square', dur: 1.1, vol: 0.06, lp: 400, attack: 0.1 }); noise({ dur: 1.0, vol: 0.12, filter: 'bandpass', f: 400, f2: 250, q: 0.8 }); },
    stun() { [880, 1175, 1480].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.12, vol: 0.04, delay: i * 0.05 })); },
    dice() { for (let i = 0; i < 7; i++) noise({ dur: 0.03, vol: 0.12, filter: 'bandpass', f: 1800 + Math.random() * 1200, q: 3, delay: i * 0.06 + Math.random() * 0.03 }); },
    quest() { [392, 523, 659].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.35, vol: 0.06, delay: i * 0.09 })); },
    learn() { [262, 392, 523, 659, 784].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.6, vol: 0.06, delay: i * 0.08, attack: 0.02 })); },
    levelup() { [392, 494, 587, 784].forEach((f, i) => tone({ f, type: 'square', dur: 0.25, vol: 0.04, delay: i * 0.09, lp: 2500 })); tone({ f: 784, type: 'triangle', dur: 0.9, vol: 0.07, delay: 0.36 }); },
    victory() { [262, 330, 392, 523].forEach((f, i) => tone({ f, type: 'sawtooth', dur: 0.5, vol: 0.05, delay: i * 0.12, lp: 1800 })); tone({ f: 523, type: 'triangle', dur: 1.2, vol: 0.08, delay: 0.5 }); },
    defeat() { [392, 349, 311, 233].forEach((f, i) => tone({ f, type: 'sawtooth', dur: 0.6, vol: 0.05, delay: i * 0.22, lp: 1200 })); },
    bell() { [196, 392, 588].forEach((f, i) => tone({ f, type: 'sine', dur: 2.4, vol: 0.05 / (i + 1), attack: 0.005 })); },
    wind() { noise({ dur: 2.5, vol: 0.05, filter: 'bandpass', f: 400, f2: 900, q: 0.5, attack: 0.8 }); },
  };

  function play(name, minGap) {
    if (!enabled) return;
    if (!ensure()) return;
    const now = performance.now();
    if (minGap && last[name] && now - last[name] < minGap) return;
    last[name] = now;
    try { S[name] && S[name](); } catch (e) { /* ignore */ }
  }
  return {
    play, ensure, output: () => master,
    setEnabled(v) { enabled = !!v; },
    get enabled() { return enabled; },
  };
})();
