/* ==========================================================================
   Battle engine - tap to move / tap to attack, 24 skills, enemy AI, bosses
   ========================================================================== */
const BS = 1.38;
const FIELD = { top: GROUND_TOP + 16, bot: GROUND_BOT - 6 };
const depthScale = (y) => 0.86 + 0.3 * clamp((y - GROUND_TOP) / (GROUND_BOT - GROUND_TOP), 0, 1);
const isAtk = (s) => s === 'attack' || s === 'thrust' || s === 'cast' || s === 'shoot' || s === 'throw';
const isDisabled = (e) => e.status.stun > 0 || e.status.freeze > 0 || e.status.sleep > 0 || e.status.toad > 0;

let _eid = 1;
function makeEnt(b, kind, type, x, y, forceChamp) {
  const st = Game.st;
  const diff = st.settings.difficulty === 'story' ? { hp: 0.85, dmg: 0.6 } : { hp: 1, dmg: 1 };
  let e;
  if (kind === 'hero') {
    const S = b.S;
    e = { kind, type: 'hero', cfg: heroCfg(st), hp: S.maxHp, maxHp: S.maxHp, r: 15, speed: S.move, name: st.hero.name };
  } else if (CHAMPS[type] && (forceChamp || kind === 'ally' || !ENEMIES[type])) {
    e = makeChamp(b, kind, type);
    if (kind === 'foe' && b.def.boss === type) e.boss = true;
  } else {
    const d = ENEMIES[type];
    const ally = kind === 'ally';
    const tier = ally ? 1 + Math.max(0, (st.hero.level - 1)) * 0.08 : (b.def.tier || 1);
    const hpMul = (ally ? 1 : diff.hp * (b.crowd || 1)) * tier;
    e = { kind, type, def: d, cfg: d.cfg, hp: Math.round(d.hp * hpMul), maxHp: Math.round(d.hp * hpMul), r: d.r, speed: d.speed, dmgMul: (ally ? 1 : diff.dmg) * (1 + (tier - 1) * 0.6), name: d.name, boss: !!d.boss && !ally, tier };
  }
  Object.assign(e, {
    id: _eid++, x, y, z: 0, vx: 0, vy: 0, kx: 0, ky: 0, facing: kind === 'hero' ? 1 : -1, state: 'idle', st: 0, p: 0,
    animT: Math.random() * 3, atkCd: kind === 'hero' ? 0 : rand(0.4, 1.4), target: null, moveTo: null,
    status: {}, buffs: {}, flash: 0, alpha: 1, dead: false, deadT: 0, engaged: false, orbitA: Math.random() * TAU,
    pose: { t: 0, facing: 1 }, trail: [], spec: { t1: rand(2, 4), t2: rand(5, 8), t3: 0 }, phase: 0,
  });
  e.cfg = Object.assign({}, e.cfg, { blinkSeed: Math.random() * 4 });
  b.ents.push(e);
  return e;
}

const living = (b, kind) => b.ents.filter((e) => e.kind === kind && !e.dead && e.state !== 'bones');
const foesOf = (b, e) => (e.kind === 'foe' ? b.ents.filter((o) => (o.kind === 'hero' || o.kind === 'ally') && !o.dead) : b.ents.filter((o) => o.kind === 'foe' && !o.dead && o.state !== 'bones' && o.state !== 'rise'));
const targetable = (e) => !e.dead && e.state !== 'bones' && e.state !== 'rise' && !(e.buffs.inkcloud > 0) && !(e.buffs.ghost > 0);
function nearest(list, x, y, maxR) { let best = null, bd = maxR || 1e9; for (const o of list) { const d = dist(x, y, o.x, o.y); if (d < bd) { bd = d; best = o; } } return best; }
function inRadius(list, x, y, r) { return list.filter((o) => dist(x, y * 1, o.x, o.y) <= r + o.r * 0.5); }

const Battle = {
  b: null, active: false, paused: false, acc: 0, hooks: null,

  start(id, hooks) {
    const def = BATTLES[id], st = Game.st;
    const W = R.W, cx = W / 2;
    const S = heroStats(st);
    const b = {
      id, def, scene: def.scene, W, cx, t: 0, ents: [], projs: [], parts: [], fx: [], zones: [], texts: [], tlights: [],
      wave: 0, waveDelay: 0, state: def.boss ? 'bossintro' : 'intro', stateT: 0, shake: 0, zoom: 0, hitstop: 0, slow: 1, slowT: 0,
      cds: [0, 0, 0, 0, 0], potCd: 0, P: S.P, xp: 0, gold: 0, kills: 0, S, tip: null, tipT: 0, tips: {}, attacked: false, usedSkill: false, banner: null,
      slots: def.slots || 3, won: false, lost: false, loadout: (st.run.actives || st.run.loadout).slice(0, 5), belt: st.run.belt.slice(),
    };
    this.b = b; this.active = true; this.paused = false; this.acc = 0; this.hooks = hooks || {};
    b.hero = makeEnt(b, 'hero', null, cx + def.hero.dx, def.hero.y);
    // You fight alone. Story companions only take the field for the final battle,
    // where everyone you won over along the way arrives at once.
    const allies = def.finale ? (def.allies || []).slice() : [];
    if (def.finale && def.party) for (const id of (st.run.allies || []).slice(0, def.party)) if (!allies.some((a) => a.t === id)) allies.push({ t: id });
    allies.forEach((a, i) => { const e = makeEnt(b, 'ally', a.t, clamp(cx + (a.dx != null ? a.dx : def.hero.dx - 50 - i * 40), 40, W - 40), a.y != null ? a.y : clamp(def.hero.y + (i % 2 ? 60 : -60) * (1 + Math.floor(i / 2) * 0.6), FIELD.top, FIELD.bot)); e.facing = 1; });
    // the more friends answer the call, the more the villains have saved up for them
    b.crowd = def.finale ? 1 + 0.22 * Math.max(0, allies.length - 3) : 1;
    this.spawnWave(0, true);
    for (const tr of (b.P && b.P.onStart) || []) { try { runFx(trigCtx(b, b.hero, null), tr.fx, { x: b.hero.x, y: b.hero.y, e: b.hero }); } catch (err) { console.warn(err); } }
    if (def.boss) { const boss = b.ents.find((e) => e.boss); if (boss) { boss.state = 'roar'; boss.st = 0; } }
    HUD.build(b);
    if (def.boss) HUD.bossIntro(b.ents.find((e) => e.boss));
  },

  spawnWave(i, initial) {
    const b = this.b, W = b.W;
    for (const sp of b.def.waves[i]) {
      let x, y = sp.y;
      if (sp.edge) x = sp.edge < 0 ? -50 - Math.random() * 40 : W + 50 + Math.random() * 40;
      else x = clamp(b.cx + sp.dx, 40, W - 40);
      const e = makeEnt(b, 'foe', sp.t, x, y, sp.champ);
      e.facing = x > b.hero.x ? -1 : 1;
      if (sp.edge) e.entering = true;
      else if (!initial) { e.state = 'rise'; e.st = 0; e.alpha = 0; burst(b, x, y - 10, 'ink', 14); }
    }
    b.wave = i;
    if (!initial) { b.banner = { text: `Wave ${i + 1}`, t: 0, dur: 1.4 }; Sound.play('shout'); }
  },

  stop() { this.active = false; this.b = null; HUD.hide(); },

  /* ------------------------------ input ------------------------------ */
  tap(lx, ly, pickE) {
    const b = this.b; if (!b || this.paused || b.state !== 'fight') return;
    const h = b.hero; if (h.dead) return;
    Sound.ensure();
    if (pickE) { h.target = pickE; h.moveTo = null; h.manual = false; addFx(b, { type: 'tapfoe', x: pickE.x, y: pickE.y, t: 0, dur: 0.4 }); }
    else {
      h.moveTo = { x: clamp(lx, 24, b.W - 24), y: clamp(ly, FIELD.top, FIELD.bot) }; h.target = null; h.manual = true;
      if (h.channel) endChannel(b, h);
      addFx(b, { type: 'tapground', x: h.moveTo.x, y: h.moveTo.y, t: 0, dur: 0.45 });
    }
  },
  useSkill(i) {
    const b = this.b; if (!b || this.paused || b.state !== 'fight') return;
    const h = b.hero, id = b.loadout[i];
    if (!id || h.dead) return;
    if (b.cds[i] > 0) { Sound.play('lock', 120); return; }
    if (isDisabled(h) || h.dash) return;
    Sound.ensure();
    const ok = castAbility(b, h, id);
    if (ok) { b.cds[i] = AB[id].cd * (1 - (b.S.cdr || 0)); b.usedSkill = true; HUD.flashSlot(i); }
    else { Sound.play('lock', 120); spawnText(b, h.x, headY(h) - 14, 'No target', '#d8c8b0', 15); }
  },
  usePotion(i) {
    const b = this.b; if (!b || this.paused || b.state !== 'fight') return;
    const id = b.belt[i], st = Game.st, h = b.hero;
    if (!id || !(st.run.potions[id] > 0) || h.dead || b.potCd > 0) return;
    if (POTION_FX[id](b, h) === false) return;
    st.run.potions[id]--; b.potCd = (b.P && b.P.potion) ? 0.6 : 1.2;
    Sound.play('gulp');
    if (!(st.run.potions[id] > 0)) { fixBelt(st); }
    HUD.refreshBelt(b);
  },
  togglePause(v) { if (!this.b) return; this.paused = v == null ? !this.paused : v; HUD.showPause(this.paused); },

  /* ------------------------------ loop ------------------------------ */
  frame(dt) {
    const b = this.b; if (!b) return;
    if (!this.paused) {
      this.acc += Math.min(dt, 0.1);
      const step = 1 / 60;
      let n = 0;
      while (this.acc >= step && n < 6) { this.update(step); this.acc -= step; n++; }
    }
    this.render(this.paused ? 0 : dt);
  },

  update(dt0) {
    const b = this.b;
    b.stateT += dt0;
    if (b.slowT > 0) { b.slowT -= dt0; if (b.slowT <= 0) b.slow = 1; }
    const dt = dt0 * b.slow;
    b.shake = Math.max(0, b.shake - dt0 * 2.6);
    b.zoom *= Math.pow(0.02, dt0);
    updateParts(b, dt0);
    updateTexts(b, dt0);
    if (b.banner) { b.banner.t += dt0; if (b.banner.t > b.banner.dur) b.banner = null; }
    if (b.hitstop > 0) { b.hitstop -= dt0; return; }
    b.t += dt;
    for (const e of b.ents) { e.animT += dt; e.st += dt; if (e.flash > 0) e.flash = Math.max(0, e.flash - dt * 5); }

    if (b.state === 'intro') { if (b.stateT > 0.55) { b.state = 'fight'; b.stateT = 0; } this.idleAll(dt); return; }
    if (b.state === 'bossintro') {
      const boss = b.ents.find((e) => e.boss);
      if (boss) { boss.state = 'roar'; boss.p = clamp(b.stateT / 2.0, 0, 1); if (b.stateT > 0.5 && b.stateT < 0.6) { Sound.play('roar', 500); b.shake = 1; } }
      if (b.stateT > 2.2) { b.state = 'fight'; b.stateT = 0; if (boss) { boss.state = 'idle'; boss.st = 0; } HUD.endBossIntro(); }
      return;
    }
    if (b.state === 'won' || b.state === 'lost') { this.idleAll(dt, true); updateFx(b, dt); return; }

    for (const i in b.cds) if (b.cds[i] > 0) b.cds[i] = Math.max(0, b.cds[i] - dt);
    if (b.potCd > 0) b.potCd -= dt;

    // AI
    computeSlots(b);
    for (const e of b.ents) {
      if (e.dead) { e.deadT += dt; continue; }
      tickStatus(b, e, dt);
      if (e.dead) continue;
      if (e.state === 'bones') { if (e.st > 3) { e.state = 'rise'; e.st = 0; e.hp = Math.round(e.maxHp * 0.5); Sound.play('bone'); } continue; }
      if (e.state === 'rise') { e.alpha = clamp(e.st / 0.6, 0, 1); if (e.st > 0.7) { e.state = 'idle'; e.st = 0; e.alpha = 1; } continue; }
      if (e.shieldT > 0) { e.shieldT -= dt; if (e.shieldT <= 0) e.shield = 0; }
      if (e.stacks) for (const k in e.stacks) { const sk = e.stacks[k]; sk.t -= dt; if (sk.t <= 0) delete e.stacks[k]; }
      if (e.life != null) { e.life -= dt; if (e.life <= 0) { killEnt(b, e, null, true); continue; } }
      if (e.kind === 'hero') heroThink(b, e, dt);
      else if (e.champ) champThink(b, e, dt);
      else if (e.kind === 'ally') allyThink(b, e, dt);
      else foeThink(b, e, dt);
      advanceAnim(b, e, dt);
    }
    physics(b, dt);
    updateProjs(b, dt);
    updateZones(b, dt);
    updateFx(b, dt);
    tutorial(b, dt);

    // sparring: whoever is beaten down to 1 hp yields
    if (b.def.nonlethal && b.state === 'fight') {
      for (const e of b.ents) if (e.kind === 'foe' && !e.dead && !e.yielded && e.hp <= 1) { e.yielded = true; e.dead = true; e.deadT = 0; spawnText(b, e.x, headY(e) - 24, 'I yield!', '#ffe6a0', 26); }
      if (b.hero.hp <= 1 && !b.hero.dead) { b.hero.dead = true; b.hero.yielded = true; spawnText(b, b.hero.x, headY(b.hero) - 24, 'Yield!', '#ffb0a0', 26); }
    }
    // win / lose / waves
    const alive = b.ents.filter((e) => e.kind === 'foe' && !e.dead);
    if (b.hero.dead && !b.lost) this.finish(false);
    else if (!alive.length && !b.won) {
      if (b.wave < b.def.waves.length - 1) { b.waveDelay += dt; if (b.waveDelay > 1.1) { b.waveDelay = 0; this.spawnWave(b.wave + 1); } }
      else this.finish(true);
    }
  },

  idleAll(dt, keep) {
    for (const e of this.b.ents) {
      if (e.dead) { e.deadT += dt; continue; }
      if (!keep || !isAtk(e.state)) { if (e.state !== 'roar' && e.state !== 'cheer' && e.state !== 'kneel') e.state = e.kind === 'hero' && this.b.won ? 'cheer' : 'idle'; }
      advanceAnim(this.b, e, dt);
    }
  },

  finish(won) {
    const b = this.b;
    if (won) {
      b.won = true; b.state = 'won'; b.stateT = 0; b.slow = 0.35; b.slowT = 0.9;
      b.banner = { text: b.def.nonlethal ? 'Well Fought' : 'Victory', t: 0, dur: 2.2, big: true };
      Sound.play('victory');
      setTimeout(() => HUD.results(b, true), 1500);
    } else {
      b.lost = true; b.state = 'lost'; b.stateT = 0; b.slow = 0.3; b.slowT = 1.2;
      Sound.play('defeat');
      HUD.grey(true);
      setTimeout(() => HUD.results(b, false), 1500);
    }
  },

  /* ------------------------------ render ------------------------------ */
  render(dt) {
    const b = this.b;
    BView.render(b, dt * (b.hitstop > 0 ? 0.15 : 1) * (b.slow || 1));
    HUD.update(b);
  },
};

/* ======================= hero control ======================= */
function heroThink(b, h, dt) {
  const S = b.S;
  if (isDisabled(h)) { h.state = 'stun'; return; }
  if (h.channel) { tickChannel(b, h, dt); return; }
  if (h.dash) return;
  if (isAtk(h.state) || h.state === 'spin' || h.state === 'hurt') {
    if (h.state === 'spin') { const mv = h.moveTo; if (mv) moveToward(b, h, mv.x, mv.y, S.move * 0.7 * buffSpeed(h), dt); }
    return;
  }
  h.atkCd -= dt * atkSpeedMul(b, h);
  const unst = b.P && b.P.unstoppable; const spd = S.move * buffSpeed(h) * (h.status.slow > 0 && !unst ? 0.6 : 1) * (h.status.root > 0 && !unst ? 0 : 1);
  if (h.moveTo) {
    const d = dist(h.x, h.y, h.moveTo.x, h.moveTo.y);
    if (d < 6) { h.moveTo = null; h.manual = false; h.state = 'idle'; }
    else { moveToward(b, h, h.moveTo.x, h.moveTo.y, spd, dt); h.state = spd > 0 ? 'run' : 'idle'; return; }
  }
  let tg = h.target;
  if (!tg || tg.dead || !targetable(tg) || tg.state === 'bones') { tg = nearest(foesOf(b, h).filter(targetable), h.x, h.y, 240); h.target = tg; }
  if (!tg) { h.state = 'idle'; return; }
  const wt = S.wt, ranged = wt.kind === 'ranged';
  const dx = tg.x - h.x, dy = tg.y - h.y;
  h.facing = dx < 0 ? -1 : 1;
  const inRange = ranged ? Math.hypot(dx, dy * 1.3) <= wt.range : Math.abs(dx) <= wt.range + tg.r * 0.6 && Math.abs(dy) <= 26;
  if (inRange) {
    if (h.atkCd <= 0) heroAttack(b, h, tg);
    else h.state = 'idle';
  } else {
    let gx = tg.x, gy = tg.y;
    if (!ranged) { const side = h.x < tg.x ? -1 : 1; gx = tg.x + side * (tg.r + wt.range * 0.55); }
    moveToward(b, h, gx, gy, spd, dt); h.state = 'run';
  }
}

function atkSpeedMul(b, e) {
  const S = statsOf(b, e); let m = S ? S.atkSpeed || 1 : 1;
  if (e.buffs.quick > 0) m *= 1.4; if (e.buffs.song > 0) m *= 1.2; if (e.buffs.bloodrage > 0) m *= 1.4;
  if (e.status.slow > 0 && !(passOf(b, e) || {}).unstoppable) m *= 0.7; if (e.status.hexed > 0) m *= 0.8;
  if (e.kind === 'ally' && b.P && b.P.allySpd && dist(e.x, e.y, b.hero.x, b.hero.y) < 320) m *= 1 + b.P.allySpd;
  return m;
}
function buffSpeed(e) { let m = 1; if (e.buffs.quick > 0) m *= 1.4; if (e.buffs.inkcloud > 0) m *= 1.4; return m; }

function heroAttack(b, h, tg) {
  const S = statsOf(b, h), wt = S.wt;
  h.state = wt.anim || 'attack'; h.st = 0;
  h.atkDur = clamp(wt.cd / atkSpeedMul(b, h) * 0.9, 0.34, 0.75);
  h.hitAt = wt.hit; h.hitDone = false; h.atkTarget = tg;
  h.atkCd = wt.cd;
  b.attacked = true;
  if (wt.kind === 'melee') Sound.play('swing', 60);
}

function heroStrike(b, h) {
  const S = statsOf(b, h), wt = S.wt, tg = h.atkTarget;
  if (!tg || tg.dead) return;
  if (wt.kind === 'ranged') {
    const hand = handPos(h);
    if (wt.proj === 'bolt') { shoot(b, h, hand.x, hand.y, tg, { kind: 'bolt', speed: 560, dmg: S.melee, color: '#8fd7ff', spell: false, auto: true }); Sound.play('zap', 80); }
    else { shoot(b, h, hand.x, hand.y, tg, { kind: 'quarrel', speed: 820, dmg: S.melee, color: '#e6eef8', auto: true }); Sound.play('twang', 80); }
    return;
  }
  const dx = tg.x - h.x, dy = tg.y - h.y;
  if (Math.abs(dx) <= wt.range + tg.r + 14 && Math.abs(dy) <= 32) {
    const dmg = S.melee * rand(0.9, 1.1);
    const r = dealDamage(b, h, tg, dmg, { kind: 'melee', auto: true });
    if (wt.cleave) for (const o of foesOf(b, h).filter(targetable)) if (o !== tg && Math.abs(o.x - tg.x) < wt.cleave && Math.abs(o.y - tg.y) < 40) dealDamage(b, h, o, dmg * 0.5, { kind: 'melee', quiet: false });
    if (r && wt.daze && chance(wt.daze)) addStatus(b, tg, 'stun', 0.5);
    if (r && wt.leech) healEnt(b, h, r.dmg * wt.leech, true);
    if (r && h.buffs.nightshade > 0) addPoison(b, tg, S.melee * 0.14, h);
    addFx(b, { type: 'slash', x: tg.x - h.facing * 6, y: tg.y - 34 * depthScale(tg.y) * BS * 0.6, f: h.facing, t: 0, dur: 0.18, c: wt.stat === 'wits' ? '#b6ffc8' : '#ffffff', big: r && r.crit });
  }
}

/* ======================= allies ======================= */
function allyThink(b, e, dt) {
  if (isDisabled(e)) { e.state = 'stun'; return; }
  if (e.dash) return;
  e.atkCd -= dt * atkSpeedMul(b, e);
  if (isAtk(e.state) || e.state === 'hurt') return;
  const tgs = foesOf(b, e).filter(targetable);
  if (e.def.ai === 'skitter') return skitterAI(b, e, dt, tgs);
  meleeAI(b, e, dt, tgs);
}

/* ======================= foes ======================= */
function computeSlots(b) {
  const melee = b.ents.filter((e) => e.kind === 'foe' && !e.dead && !e.boss && !e.entering && ['melee', 'hopper', 'skitter', 'leaper', 'duelist', 'knight', 'brute'].includes(e.def.ai) && e.state !== 'bones' && e.state !== 'rise');
  melee.sort((a, c) => dist(a.x, a.y, b.hero.x, b.hero.y) - dist(c.x, c.y, b.hero.x, b.hero.y));
  melee.forEach((e, i) => { e.engaged = i < b.slots; });
}

function pickFoeTarget(b, e) {
  const opts = foesOf(b, e).filter(targetable);
  if (!opts.length) return null;
  const taunt = opts.find((o) => o.def && o.def.taunt && dist(o.x, o.y, e.x, e.y) < 360);
  if (taunt) return taunt;
  let best = null, bd = 1e9;
  for (const o of opts) { const d = dist(e.x, e.y, o.x, o.y) * (o.kind === 'ally' ? 1.25 : 1); if (d < bd) { bd = d; best = o; } }
  return best;
}

function foeThink(b, e, dt) {
  const d = e.def;
  if (isDisabled(e)) { e.state = 'stun'; return; }
  if (e.dash) return;
  if (e.entering) {
    const tx = e.x < 0 ? 60 : b.W - 60;
    moveToward(b, e, tx, e.y, e.speed * 1.2, dt); e.state = 'walk';
    if (e.x > 40 && e.x < b.W - 40) e.entering = false;
    return;
  }
  if (e.status.fear > 0) {
    const h = nearest(foesOf(b, e), e.x, e.y, 2000) || b.hero; const ax = e.x - h.x, ay = e.y - h.y, L = Math.hypot(ax, ay) || 1;
    moveToward(b, e, e.x + ax / L * 100, e.y + ay / L * 60, e.speed * 1.1, dt); e.state = 'run'; return;
  }
  e.atkCd -= dt * atkSpeedMul(b, e);
  if (isAtk(e.state) || e.state === 'hurt' || e.state === 'roar' || e.state === 'slam') return;
  const tgs = foesOf(b, e).filter(targetable);
  switch (d.ai) {
    case 'ranged': return rangedAI(b, e, dt, tgs);
    case 'shaman': return shamanAI(b, e, dt, tgs);
    case 'brute': return bruteAI(b, e, dt, tgs);
    case 'leaper': return leaperAI(b, e, dt, tgs);
    case 'duelist': return duelistAI(b, e, dt, tgs);
    case 'knight': return knightAI(b, e, dt, tgs);
    case 'sexton': return sextonAI(b, e, dt, tgs);
    case 'king': return kingAI(b, e, dt, tgs);
    case 'skitter': return skitterAI(b, e, dt, tgs);
    default: return meleeAI(b, e, dt, tgs);
  }
}

function meleeAI(b, e, dt, tgs) {
  const tg = (e.target && targetable(e.target) && !e.target.dead) ? e.target : pickFoeTarget(b, e);
  e.target = tg;
  if (!tg) { e.state = 'idle'; return; }
  const d = e.def, range = d.range;
  const dx = tg.x - e.x, dy = tg.y - e.y;
  e.facing = dx < 0 ? -1 : 1;
  const spd = e.speed * (e.status.slow > 0 ? 0.6 : 1) * (e.status.root > 0 ? 0 : 1);
  if (e.kind === 'foe' && !e.engaged && tg.kind === 'hero') {
    // wait in a ring, strafing slowly
    e.orbitA += dt * 0.35 * (e.id % 2 ? 1 : -1);
    const ox = tg.x + Math.cos(e.orbitA) * 150, oy = clamp(tg.y + Math.sin(e.orbitA) * 70, FIELD.top, FIELD.bot);
    if (dist(e.x, e.y, ox, oy) > 12) { moveToward(b, e, ox, oy, spd * 0.6, dt); e.state = 'walk'; } else e.state = 'idle';
    e.facing = tg.x < e.x ? -1 : 1;
    return;
  }
  const inRange = Math.abs(dx) <= range + tg.r * 0.5 && Math.abs(dy) <= 24;
  if (inRange) {
    if (e.atkCd <= 0) { foeAttack(b, e, tg); }
    else e.state = 'idle';
  } else {
    const side = e.x < tg.x ? -1 : 1;
    const gx = tg.x + side * (tg.r + range * 0.7);
    moveToward(b, e, gx, tg.y, spd, dt);
    e.state = d.ai === 'hopper' ? 'hop' : 'walk';
  }
}

function foeAttack(b, e, tg) {
  const d = e.def;
  e.state = d.anim || 'attack'; e.st = 0; e.atkTarget = tg; e.hitDone = false;
  e.atkDur = d.ai === 'skitter' ? 0.42 : d.ai === 'hopper' ? 0.6 : 0.72;
  e.hitAt = d.ai === 'skitter' ? 0.45 : 0.58;
  e.atkCd = d.cd;
}

function foeStrike(b, e) {
  const tg = e.atkTarget, d = e.def;
  if (!tg || tg.dead) return;
  if (d.proj) {
    const hp = handPos(e);
    const kinds = { rock: { kind: 'rock', speed: 380, color: '#9a9488', arc: true }, hex: { kind: 'hex', speed: 340, color: '#b06ad8' }, cold: { kind: 'cold', speed: 320, color: '#9fe6ff' } };
    const o = Object.assign({ dmg: d.dmg * e.dmgMul }, kinds[d.proj]);
    shoot(b, e, hp.x, hp.y, tg, o);
    Sound.play(d.proj === 'rock' ? 'swing' : 'zap', 90);
    return;
  }
  const range = d.range;
  if (Math.abs(tg.x - e.x) <= range + tg.r + 16 && Math.abs(tg.y - e.y) <= 30) {
    dealDamage(b, e, tg, d.dmg * e.dmgMul * rand(0.9, 1.1), { kind: 'melee' });
    if (d.ai === 'leaper') addStatus(b, tg, 'bleed', 3, { dps: 2 * e.dmgMul });
  } else Sound.play('swing', 60);
  if (d.ai === 'skitter') { e.retreat = 0.6; }
}

function skitterAI(b, e, dt, tgs) {
  if (e.retreat > 0) {
    e.retreat -= dt; const h = e.target || b.hero;
    const ax = e.x - h.x || 1, L = Math.abs(ax);
    moveToward(b, e, e.x + ax / L * 80, e.y + (e.id % 2 ? 40 : -40), e.speed, dt); e.state = 'run';
    return;
  }
  meleeAI(b, e, dt, tgs);
}

function rangedAI(b, e, dt, tgs) {
  const tg = pickFoeTarget(b, e); e.target = tg;
  if (!tg) { e.state = 'idle'; return; }
  const d = dist(e.x, e.y, tg.x, tg.y);
  e.facing = tg.x < e.x ? -1 : 1;
  const spd = e.speed * (e.status.slow > 0 ? 0.6 : 1) * (e.status.root > 0 ? 0 : 1);
  if (d < 130) {
    const ax = e.x - tg.x || (Math.random() - 0.5), ay = e.y - tg.y, L = Math.hypot(ax, ay) || 1;
    moveToward(b, e, e.x + ax / L * 90, e.y + ay / L * 50, spd, dt); e.state = 'walk';
    e.facing = tg.x < e.x ? -1 : 1;
  } else if (d > e.def.range) { moveToward(b, e, tg.x, tg.y, spd, dt); e.state = 'walk'; }
  else if (e.atkCd <= 0) { e.state = e.def.proj === 'rock' ? 'attack' : 'cast'; e.st = 0; e.atkTarget = tg; e.hitDone = false; e.atkDur = 0.8; e.hitAt = 0.7; e.atkCd = e.def.cd; }
  else e.state = 'idle';
}

function shamanAI(b, e, dt, tgs) {
  e.spec.t1 -= dt;
  if (e.spec.t1 <= 0) {
    const hurt = b.ents.filter((o) => o.kind === 'foe' && !o.dead && o !== e && o.hp < o.maxHp * 0.85 && dist(o.x, o.y, e.x, e.y) < 260);
    if (hurt.length) {
      const o = hurt.sort((a, c) => a.hp / a.maxHp - c.hp / c.maxHp)[0];
      e.state = 'cast'; e.st = 0; e.atkDur = 0.7; e.hitAt = 2; e.hitDone = true;
      addFx(b, { type: 'beam', x: e.x, y: e.y - 40, x2: o.x, y2: o.y - 30, c: '#9dff7a', t: 0, dur: 0.5 });
      healEnt(b, o, 16, false); burst(b, o.x, o.y - 30, 'holy', 8, { c: '#9dff7a' });
      Sound.play('heal', 200);
      e.spec.t1 = 5;
      return;
    }
    e.spec.t1 = 1;
  }
  rangedAI(b, e, dt, tgs);
}

function bruteAI(b, e, dt, tgs) {
  const tg = pickFoeTarget(b, e); e.target = tg;
  if (!tg) { e.state = 'idle'; return; }
  const d = dist(e.x, e.y, tg.x, tg.y);
  e.facing = tg.x < e.x ? -1 : 1;
  if (d < 95 && e.atkCd <= 0) {
    e.state = 'slam'; e.st = 0; e.atkCd = e.def.cd;
    const sx = e.x + e.facing * 40, sy = e.y;
    tele(b, { shape: 'circle', x: sx, y: sy, r: 84, dur: 0.95, color: '#ff4a2a', onDone: () => {
      if (e.dead) return;
      e.state = 'attack'; e.st = e.atkDur * 0.5 || 0; e.atkDur = 0.5; e.hitAt = 2; e.hitDone = true;
      for (const o of foesOf(b, e)) if (dist(sx, sy, o.x, o.y) < 84 + o.r * 0.4) { dealDamage(b, e, o, e.def.dmg * e.dmgMul, { kind: 'melee', knock: 140 }); }
      b.shake = Math.max(b.shake, 0.9); Sound.play('slam'); burst(b, sx, sy, 'dust', 18); addFx(b, { type: 'ring', x: sx, y: sy, r0: 20, r1: 100, t: 0, dur: 0.35, c: '#d8b88a' });
    } });
    return;
  }
  if (!e.engaged && tg.kind === 'hero') { meleeAI(b, e, dt, tgs); return; }
  moveToward(b, e, tg.x + (e.x < tg.x ? -60 : 60), tg.y, e.speed * (e.status.slow > 0 ? 0.6 : 1) * (e.status.root > 0 ? 0 : 1), dt); e.state = 'walk';
}

function leaperAI(b, e, dt, tgs) {
  e.spec.t1 -= dt;
  const tg = pickFoeTarget(b, e);
  if (tg && e.spec.t1 <= 0 && !(e.status.root > 0)) {
    const d = dist(e.x, e.y, tg.x, tg.y);
    if (d > 110 && d < 300) {
      e.spec.t1 = rand(4, 5.5);
      e.facing = tg.x < e.x ? -1 : 1;
      startDash(b, e, tg.x - e.facing * 30, tg.y, 0.42, { arc: 46, onLand: () => {
        for (const o of foesOf(b, e)) if (dist(e.x, e.y, o.x, o.y) < 54) { dealDamage(b, e, o, e.def.dmg * 1.3 * e.dmgMul, { kind: 'melee' }); addStatus(b, o, 'bleed', 3, { dps: 2 * e.dmgMul }); }
        burst(b, e.x, e.y, 'dust', 10);
      } });
      Sound.play('hurt', 200);
      return;
    }
  }
  meleeAI(b, e, dt, tgs);
}

function duelistAI(b, e, dt, tgs) {
  e.spec.t2 -= dt;
  const tg = pickFoeTarget(b, e);
  if (tg && e.spec.t2 <= 0 && !(e.status.root > 0)) {
    e.spec.t2 = rand(5, 6.5);
    const ang = Math.atan2(tg.y - e.y, tg.x - e.x), L = 280;
    const x2 = clamp(e.x + Math.cos(ang) * L, 30, b.W - 30), y2 = clamp(e.y + Math.sin(ang) * L, FIELD.top, FIELD.bot);
    e.state = 'thrust'; e.st = 0; e.atkDur = 0.62; e.hitAt = 2; e.hitDone = true; e.facing = x2 < e.x ? -1 : 1;
    const sx = e.x, sy = e.y;
    tele(b, { shape: 'line', x: sx, y: sy, x2, y2, w: 40, dur: 0.6, color: '#ff4a2a', onDone: () => {
      if (e.dead) return;
      startDash(b, e, x2, y2, 0.18, { onLand: () => {} });
      for (const o of foesOf(b, e)) { if (distToSeg(o.x, o.y, sx, sy, x2, y2) < 30) dealDamage(b, e, o, 14 * e.dmgMul, { kind: 'melee' }); }
      Sound.play('swing'); addFx(b, { type: 'streak', x: sx, y: sy - 30, x2, y2: y2 - 30, t: 0, dur: 0.25, c: '#ffd0c0' });
    } });
    return;
  }
  meleeAI(b, e, dt, tgs);
}

function knightAI(b, e, dt, tgs) {
  e.spec.t2 -= dt;
  const tg = pickFoeTarget(b, e);
  if (tg && e.spec.t2 <= 0 && dist(e.x, e.y, tg.x, tg.y) < 260 && !(e.status.root > 0)) {
    e.spec.t2 = rand(6, 7.5);
    e.facing = tg.x < e.x ? -1 : 1;
    const x2 = tg.x - e.facing * 40, y2 = tg.y;
    e.state = 'cast'; e.st = 0; e.atkDur = 0.6; e.hitAt = 2; e.hitDone = true;
    addFx(b, { type: 'glint', x: e.x + e.facing * 18, y: e.y - 60, t: 0, dur: 0.6 });
    tele(b, { shape: 'line', x: e.x, y: e.y, x2, y2, w: 44, dur: 0.6, color: '#ffb02a', onDone: () => {
      if (e.dead) return;
      startDash(b, e, x2, y2, 0.2, { onLand: () => {
        for (const o of foesOf(b, e)) if (dist(e.x, e.y, o.x, o.y) < 60) { dealDamage(b, e, o, e.def.dmg * 1.2 * e.dmgMul, { kind: 'melee', knock: 120 }); addStatus(b, o, 'stun', 0.8); }
        Sound.play('blunt'); b.shake = Math.max(b.shake, 0.5);
      } });
    } });
    return;
  }
  meleeAI(b, e, dt, tgs);
}

function bossPhase(b, e, thresholds, fn) {
  const r = e.hp / e.maxHp;
  while (e.phase < thresholds.length && r <= thresholds[e.phase]) { fn(e.phase); e.phase++; }
}

function sextonAI(b, e, dt, tgs) {
  bossPhase(b, e, [0.7, 0.4], () => {
    e.state = 'roar'; e.st = 0; e.atkDur = 1; Sound.play('roar'); b.shake = 0.8;
    for (const dx of [-1, 1]) { const s = makeEnt(b, 'foe', 'skeleton', clamp(e.x + dx * 150, 40, b.W - 40), clamp(e.y + rand(-40, 40), FIELD.top, FIELD.bot)); s.state = 'rise'; s.st = 0; s.alpha = 0; burst(b, s.x, s.y, 'dust', 12); }
    b.banner = { text: 'The dead rise!', t: 0, dur: 1.4 };
  });
  const enr = e.hp < e.maxHp * 0.25 ? 0.72 : 1;
  e.spec.t1 -= dt; e.spec.t2 -= dt;
  const tg = pickFoeTarget(b, e); e.target = tg;
  if (!tg) { e.state = 'idle'; return; }
  e.facing = tg.x < e.x ? -1 : 1;
  if (e.spec.t1 <= 0) {
    e.spec.t1 = rand(6, 7) * enr;
    const sx = tg.x, sy = tg.y;
    e.state = 'slam'; e.st = 0;
    tele(b, { shape: 'circle', x: sx, y: sy, r: 100, dur: 1.0 * enr + 0.1, color: '#7bd389', onDone: () => {
      if (e.dead) return;
      e.state = 'attack'; e.st = 0.25; e.atkDur = 0.5; e.hitAt = 2; e.hitDone = true;
      for (const o of foesOf(b, e)) if (dist(sx, sy, o.x, o.y) < 100 + o.r * 0.4) dealDamage(b, e, o, 20 * e.dmgMul, { kind: 'melee', knock: 160 });
      b.shake = 1.1; Sound.play('slam'); burst(b, sx, sy, 'dust', 22); burst(b, sx, sy, 'bone', 8);
      addFx(b, { type: 'ring', x: sx, y: sy, r0: 20, r1: 120, t: 0, dur: 0.4, c: '#9dffb0' });
    } });
    return;
  }
  if (e.spec.t2 <= 0) {
    e.spec.t2 = rand(9, 10) * enr;
    const ang = Math.atan2(tg.y - e.y, tg.x - e.x);
    const x2 = e.x + Math.cos(ang) * 600, y2 = e.y + Math.sin(ang) * 600;
    e.state = 'cast'; e.st = 0; e.atkDur = 1.8; e.hitAt = 2; e.hitDone = true;
    const sx = e.x + e.facing * 10, sy = e.y;
    tele(b, { shape: 'line', x: sx, y: sy, x2, y2, w: 50, dur: 0.85, color: '#7bd389', onDone: () => {
      if (e.dead) return;
      addFx(b, { type: 'beam', x: sx + e.facing * 30, y: sy - 70, x2, y2: y2 - 40, c: '#9dffb0', t: 0, dur: 1.1, wide: 16 });
      Sound.play('dark');
      let ticks = 0;
      const iv = { t: 0, every: 0.2, n: 6, fn: () => { ticks++; for (const o of foesOf(b, e)) if (distToSeg(o.x, o.y, sx, sy, x2, y2) < 32) dealDamage(b, e, o, 6 * e.dmgMul, { kind: 'spell', quiet: ticks > 1 }); } };
      addFx(b, Object.assign({ type: 'ticker', dur: 1.25 }, iv));
    } });
    return;
  }
  meleeAI(b, e, dt, tgs);
}

function kingAI(b, e, dt, tgs) {
  bossPhase(b, e, [0.66, 0.33, 0.25], (ph) => {
    if (ph < 2) {
      e.state = 'roar'; e.st = 0; e.atkDur = 1; Sound.play('roar'); b.shake = 0.9;
      b.banner = { text: 'Rally to your king!', t: 0, dur: 1.4 };
      const m = makeEnt(b, 'foe', 'cutthroat', -50, rand(FIELD.top, FIELD.bot)); m.entering = true;
      const m2 = makeEnt(b, 'foe', 'cutthroat', b.W + 50, rand(FIELD.top, FIELD.bot)); m2.entering = true;
      const m3 = makeEnt(b, 'foe', ph === 0 ? 'slinger' : 'shaman', b.W + 70, rand(FIELD.top, FIELD.bot)); m3.entering = true;
    } else { e.frenzy = true; b.banner = { text: 'The Gutter King is frenzied!', t: 0, dur: 1.5 }; Sound.play('roar'); }
  });
  const enr = e.frenzy ? 0.7 : 1;
  if (e.frenzy) e.speed = e.def.speed * 1.35;
  e.spec.t1 -= dt;
  const tg = pickFoeTarget(b, e); e.target = tg;
  if (!tg) { e.state = 'idle'; return; }
  e.facing = tg.x < e.x ? -1 : 1;
  if (e.spec.t1 <= 0) {
    e.spec.t1 = rand(7, 8) * enr;
    const sx = e.x, sy = e.y;
    e.state = 'slam'; e.st = 0;
    tele(b, { shape: 'circle', x: sx, y: sy, r: 135, dur: 1.1 * enr, color: '#ff4a2a', onDone: () => {
      if (e.dead) return;
      e.state = 'attack'; e.st = 0.2; e.atkDur = 0.5; e.hitAt = 2; e.hitDone = true;
      for (const o of foesOf(b, e)) if (dist(sx, sy, o.x, o.y) < 135 + o.r * 0.4) dealDamage(b, e, o, 24 * e.dmgMul, { kind: 'melee', knock: 200 });
      b.shake = 1.3; b.zoom = 0.04; Sound.play('slam'); burst(b, sx, sy, 'dust', 28);
      addFx(b, { type: 'ring', x: sx, y: sy, r0: 30, r1: 170, t: 0, dur: 0.5, c: '#ffcf8a' });
    } });
    return;
  }
  // wide swing
  const dx = tg.x - e.x, dy = tg.y - e.y;
  if (Math.abs(dx) < 110 && Math.abs(dy) < 34 && e.atkCd <= 0) {
    e.state = 'attack'; e.st = 0; e.atkDur = 0.85 * enr; e.hitAt = 0.55; e.hitDone = false; e.atkTarget = tg; e.atkCd = e.def.cd * enr; e.wide = true;
    return;
  }
  const side = e.x < tg.x ? -1 : 1;
  moveToward(b, e, tg.x + side * 80, tg.y, e.speed * (e.status.slow > 0 ? 0.6 : 1) * (e.status.root > 0 ? 0 : 1), dt); e.state = 'walk';
}

/* ======================= animation & physics ======================= */
function advanceAnim(b, e, dt) {
  if (e.posing && !isAtk(e.state) && e.state !== 'spin') {
    e.p = clamp(e.st / (e.atkDur || 0.5), 0, 1);
    if (e.st >= (e.atkDur || 0.5) || isDisabled(e)) { e.posing = false; if (!isDisabled(e)) { e.state = 'idle'; e.st = 0; } }
    return;
  }
  if (isAtk(e.state) || e.state === 'spin') {
    const dur = e.atkDur || 0.6;
    e.p = clamp(e.st / dur, 0, 1);
    if (!e.hitDone && e.p >= (e.hitAt || 0.5)) {
      e.hitDone = true;
      if (e.kind === 'hero' || e.champ) heroStrike(b, e);
      else if (e.wide && e.def.ai === 'king') {
        for (const o of foesOf(b, e)) if (Math.abs(o.x - e.x) < 120 && Math.abs(o.y - e.y) < 40 && sign(o.x - e.x) === e.facing) dealDamage(b, e, o, e.def.dmg * e.dmgMul * rand(0.9, 1.1), { kind: 'melee', knock: 90 });
        addFx(b, { type: 'slash', x: e.x + e.facing * 70, y: e.y - 60, f: e.facing, t: 0, dur: 0.22, c: '#ffd9a0', big: true });
        Sound.play('blunt'); e.wide = false;
      } else foeStrike(b, e);
    }
    if (e.st >= dur) { e.state = 'idle'; e.st = 0; e.p = 0; e.posing = false; }
  } else if (e.state === 'hurt') { e.p = clamp(e.st / 0.22, 0, 1); if (e.st > 0.22) { e.state = 'idle'; e.st = 0; } }
  else if (e.state === 'roar') { e.p = clamp(e.st / (e.atkDur || 1), 0, 1); if (e.st > (e.atkDur || 1)) { e.state = 'idle'; e.st = 0; } }
  else if (e.state === 'slam') { e.p = clamp(e.st / 0.9, 0, 1); }
}

function moveToward(b, e, tx, ty, spd, dt) {
  const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
  if (d < 1) { e.vx = 0; e.vy = 0; return; }
  const s = Math.min(spd * dt, d);
  e.vx = dx / d * spd; e.vy = dy / d * spd;
  e.x += dx / d * s; e.y += dy / d * s * 0.85;
  if (Math.abs(dx) > 2) e.facing = dx < 0 ? -1 : 1;
}

function physics(b, dt) {
  const L = b.ents.filter((e) => !e.dead && !e.def?.flying && e.state !== 'bones');
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const a = L[i], c = L[j];
    const dx = c.x - a.x, dy = (c.y - a.y) * 1.8, d = Math.hypot(dx, dy), min = (a.r + c.r) * 0.85;
    if (d < min && d > 0.01) {
      const push = (min - d) * 0.5, nx = dx / d, ny = dy / d;
      const wa = a.boss ? 0.15 : c.boss ? 0.85 : 0.5, wc = 1 - wa;
      a.x -= nx * push * wa; a.y -= ny * push * wa * 0.5; c.x += nx * push * wc; c.y += ny * push * wc * 0.5;
    }
  }
  for (const e of b.ents) {
    if (e.dead) continue;
    if (e.kx || e.ky) { e.x += e.kx * dt; e.y += e.ky * dt; e.kx *= Math.pow(0.01, dt); e.ky *= Math.pow(0.01, dt); if (Math.abs(e.kx) < 2) e.kx = 0; if (Math.abs(e.ky) < 2) e.ky = 0; }
    if (e.dash) {
      const D = e.dash; D.t += dt; const k = clamp(D.t / D.dur, 0, 1);
      e.x = lerp(D.x0, D.x1, easeOut(k)); e.y = lerp(D.y0, D.y1, easeOut(k)); e.z = D.arc ? -Math.sin(k * Math.PI) * D.arc : 0;
      if (D.trail && Math.random() < 0.8) burst(b, e.x, e.y - 30, D.trail, 1);
      if (k >= 1) { e.dash = null; e.z = 0; D.onLand && D.onLand(); }
    }
    if (!e.entering) e.x = clamp(e.x, 22, b.W - 22);
    e.y = clamp(e.y, FIELD.top, FIELD.bot);
    if (e.def && e.def.flying) e.z = 0;
  }
}

function startDash(b, e, x1, y1, dur, o) {
  e.dash = Object.assign({ t: 0, dur, x0: e.x, y0: e.y, x1: clamp(x1, 22, b.W - 22), y1: clamp(y1, FIELD.top, FIELD.bot) }, o || {});
}

function handPos(e) {
  const ds = depthScale(e.y) * BS * ((e.cfg && e.cfg.scale) || 1);
  return { x: e.x + e.facing * 14 * ds, y: e.y - 36 * ds - (e.def && e.def.flying ? 40 : 0) };
}
function bodyY(e) { const ds = depthScale(e.y) * BS * ((e.cfg && e.cfg.scale) || 1); return e.y - 34 * ds - (e.def && e.def.flying ? 40 : 0) + (e.z || 0); }
function headY(e) { const ds = depthScale(e.y) * BS * ((e.cfg && e.cfg.scale) || 1); const h = e.cfg.rig === 'inkspawn' ? (e.cfg.big ? 44 : 30) : e.cfg.rig === 'rat' ? 22 : 74; return e.y - h * ds - (e.def && e.def.flying ? 40 : 0) + (e.z || 0); }

/* ======================= damage & status ======================= */
function trigCtx(b, e, tgt) { return { b, me: e, S: statsOf(b, e) || b.S, P: passOf(b, e) || emptyP(), a: { tg: 'self' }, tgt: tgt || null, pt: { x: e.x, y: e.y }, trig: true }; }
function dealDamage(b, src, tgt, amount, o) {
  if (!tgt || tgt.dead || tgt.state === 'bones' || tgt.state === 'rise') return null;
  o = o || {};
  if (tgt.buffs.ghost > 0) return null;
  if (tgt.buffs.divine > 0) { if (!o.dot) spawnText(b, tgt.x, headY(tgt) - 6, 'Immune', '#fff2b0', 15); return null; }
  const SS = src ? statsOf(b, src) : null, PS = src ? passOf(b, src) : null;
  const ST = statsOf(b, tgt), PT = passOf(b, tgt);
  let dmg = amount, crit = false;
  if (SS && !o.pure) {
    if (o.kind === 'spell') { dmg *= SS.spellMul || 1; if (src.buffs.empower > 0 && !o.noEmpower) { dmg *= 1.5; src.buffs.empower = 0; } if (src.buffs.bloodmoon > 0) dmg *= 1.4; }
    if (src.buffs.fury > 0) dmg *= 1.35;
    if (src.buffs.warcry > 0) dmg *= 1.25;
    if (src.buffs.song > 0) dmg *= 1.25;
    if (src.buffs.bear > 0 && o.kind !== 'spell') dmg *= 1.35;
    if (PS) {
      dmg *= 1 + (PS.dmg || 0) + ((o.school && PS.school && PS.school[o.school]) || 0);
      const V = PS.vs || {};
      if (V.unholy && unholy(tgt)) dmg *= 1 + V.unholy;
      if (V.cc && isCC(tgt)) dmg *= 1 + V.cc;
      if (V.full && tgt.hp >= tgt.maxHp) dmg *= 1 + V.full;
      if (V.marked && tgt.status.mark > 0) dmg *= 1 + V.marked;
      if (V.burning && tgt.status.burn > 0) dmg *= 1 + V.burning;
      if (V.unaware && tgt.target !== src) dmg *= 1 + V.unaware;
      if (PS.rage) dmg *= 1 + PS.rage * (1 - src.hp / src.maxHp);
      if (o.dot) dmg *= 1 + (PS.dot || 0);
      if (src.stacks && PS.stacks) for (const k in src.stacks) { const sd = PS.stacks[k]; if (!sd) continue; if (sd.dmg) dmg *= 1 + sd.dmg * src.stacks[k].n; if (sd.spell && o.kind === 'spell') dmg *= 1 + sd.spell * src.stacks[k].n; }
    }
    if (src.kind === 'ally' && b.P && b.P.allyDmg && dist(src.x, src.y, b.hero.x, b.hero.y) < 320) dmg *= 1 + b.P.allyDmg;
    if (tgt.status.mark > 0) dmg *= 1.5;
    let cc = (SS.crit || 0) * (o.critMul || 1), big = false;
    if (o.forceCrit || src.buffs.critNext > 0) { cc = 1; if (src.buffs.critNext > 0 && !o.dot) { src.buffs.critNext = 0; if (src.buffs.critBig > 0) { big = true; src.buffs.critBig = 0; } } }
    if (!o.dot && Math.random() < cc) { crit = true; dmg *= (SS.critPow || 1.8) * (o.critPow ? o.critPow / 1.8 : 1) * (big ? 1.67 : 1); }
  }
  if (tgt.status.rot > 0) dmg *= 1.25;
  if (tgt.status.hexed > 0) dmg *= 1.3;
  if (tgt.status.corrode > 0) dmg *= 1.25;
  if (tgt.status.sleep > 0 && !o.dot) tgt.status.sleep = 0;
  if (ST) {
    dmg *= ST.dmgTaken || 1;
    if (tgt.buffs.bulwark > 0) dmg *= 0.5;
    if (tgt.buffs.ironbark > 0) dmg *= 0.65;
    if (tgt.buffs.bear > 0) dmg *= 0.6;
    if (tgt.buffs.bloodrage > 0) dmg *= 1.15;
    if (PT && PT.drUnholy && unholy(src)) dmg *= 1 - PT.drUnholy;
    if (!o.dot && ST.dodge && Math.random() < ST.dodge) { spawnText(b, tgt.x, headY(tgt) - 6, 'Dodge', '#d8e8ff', 17); return null; }
  }
  if (tgt.def && tgt.def.ai === 'knight' && src && !o.dot && sign(src.x - tgt.x) === tgt.facing && chance(0.3)) {
    dmg *= 0.3; spawnText(b, tgt.x, headY(tgt) - 6, 'Blocked', '#cfd8e6', 18); Sound.play('steel', 60);
  }
  dmg = Math.max(1, Math.round(dmg));
  if (tgt.shield > 0) {
    const a = Math.min(tgt.shield, dmg); tgt.shield -= a; dmg -= a;
    if (tgt.shield <= 0) { tgt.shield = 0; if (tgt.shieldBurst) { const amt = tgt.shieldBurst; tgt.shieldBurst = 0; for (const f of inRadius(foesOf(b, tgt).filter(targetable), tgt.x, tgt.y, 130)) dealDamage(b, tgt, f, amt, { kind: 'spell', school: 'spirit', pure: true, noTrigger: true }); addFx(b, { type: 'ring', x: tgt.x, y: tgt.y, r0: 20, r1: 140, dur: 0.4, c: '#bfe0ff' }); Sound.play('holy'); } }
    if (dmg <= 0) { if (!o.dot) spawnText(b, tgt.x, headY(tgt) - 6, 'Absorbed', '#bfe0ff', 15); return { dmg: 0, crit }; }
  }
  if (tgt.def && tgt.def.nonlethal && tgt.hp - dmg <= 1) dmg = Math.max(0, tgt.hp - 1);
  if (tgt.kind === 'hero' && b.def.nonlethal && tgt.hp - dmg <= 1) dmg = Math.max(0, tgt.hp - 1);
  if (PT) {
    const after = (tgt.hp - dmg) / tgt.maxHp;
    for (const tr of PT.lowHp) if (!tgt['low' + tr.below] && after < tr.below) { tgt['low' + tr.below] = 1; runFx(trigCtx(b, tgt), tr.fx, { x: tgt.x, y: tgt.y, e: tgt }); }
    if (tgt.buffs.divine > 0 && tgt.hp - dmg <= 0) dmg = tgt.hp - 1;
    if (tgt.hp - dmg <= 0 && PT.cheatDeath && !tgt.cheated) { tgt.cheated = true; dmg = tgt.hp - 1; spawnText(b, tgt.x, headY(tgt) - 20, 'Nine lives!', '#c070ff', 20); Sound.play('dark'); }
  }
  tgt.hp -= dmg;
  if (!o.dot) tgt.flash = 1;
  if (tgt.kind === 'hero' || tgt.champ) { (tgt.hurtLog = tgt.hurtLog || []).push({ t: b.t, d: dmg }); if (tgt.hurtLog.length > 30) tgt.hurtLog.shift(); }
  if (tgt.dmark && src === tgt.dmark.src) tgt.dmark.acc += dmg;
  if (src && src.kind === 'hero') b.dmgDealt = (b.dmgDealt || 0) + dmg;
  if (src && !src.dead && src.buffs && src.buffs.bloodrage > 0 && !o.dot) healEnt(b, src, dmg * 0.2, false);
  if (src && PS && PS.leech && !o.dot) healEnt(b, src, dmg * PS.leech, false);
  // triggers
  if (PS && !o.dot && !o.noTrigger) {
    if (o.auto) for (const tr of PS.onHit) { if (!tr.auto) continue; if (tr.every) { src.hitN = (src.hitN || 0) + 1; if (src.hitN % tr.every) continue; } else if (Math.random() >= (tr.c == null ? 1 : tr.c)) continue; runFx(trigCtx(b, src, tgt), tr.fx, { x: tgt.x, y: tgt.y, e: tgt }); }
    if (crit) for (const tr of PS.onCrit) runFx(trigCtx(b, src, tgt), tr.fx, { x: tgt.x, y: tgt.y, e: tgt });
  }
  if (PT && src && !o.dot && !o.noTrigger) for (const tr of PT.onHurt) { if (tr.melee && o.kind !== 'melee') continue; if (Math.random() < tr.c) runFx(trigCtx(b, tgt, src), tr.fx, { x: src.x, y: src.y, e: src }); }
  // feedback
  const hx = tgt.x + rand(-8, 8), hy = headY(tgt);
  const friendly = tgt.kind === 'hero' || tgt.kind === 'ally';
  if (!o.quiet || crit) {
    if (friendly) spawnText(b, hx, hy - 4, `-${dmg}`, tgt.kind === 'hero' ? '#ff5a4a' : '#ff9a8a', tgt.kind === 'hero' ? 22 : 17);
    else spawnText(b, hx, hy - 4, crit ? `${dmg}!` : `${dmg}`, crit ? '#ffb02a' : o.kind === 'spell' ? '#e8d8ff' : '#fff6dc', (crit ? 34 : o.dot ? 16 : 24) * (src && src.kind !== 'hero' ? 0.8 : 1), crit);
  }
  if (!o.dot) {
    const kind = tgt.def && tgt.def.undead ? 'bone' : tgt.def && tgt.def.inkborn ? 'ink' : 'blood';
    burst(b, tgt.x, bodyY(tgt), 'spark', crit ? 10 : 5);
    burst(b, tgt.x, bodyY(tgt), kind, crit ? 8 : 4);
    if (src && src.kind === 'hero') {
      Sound.play(crit ? 'crit' : (b.S.wt.sfx === 'blunt' ? 'blunt' : 'steel'), 40);
      b.hitstop = Math.max(b.hitstop, crit ? 0.085 : 0.035);
      if (crit) { b.shake = Math.max(b.shake, 0.45); b.zoom = Math.max(b.zoom, 0.025); }
    } else if (tgt.kind === 'hero') { Sound.play('hurt', 80); b.shake = Math.max(b.shake, 0.35); b.dmgTaken = (b.dmgTaken || 0) + dmg; HUD.hurtFlash(); }
    else Sound.play('blunt', 60);
    if (o.knock && !tgt.boss) { const dir = src ? sign(tgt.x - src.x) || 1 : 1; tgt.kx = dir * o.knock; }
    if (!isAtk(tgt.state) && tgt.state !== 'spin' && !tgt.boss && tgt.state !== 'slam' && tgt.kind !== 'hero' && !tgt.dash && !tgt.channel && !tgt.posing) { tgt.state = 'hurt'; tgt.st = 0; }
  }
  if (tgt.hp <= 0) killEnt(b, tgt, src, false, o);
  return { dmg, crit };
}

function healEnt(b, e, amt, text) {
  if (e.dead) return 0;
  const before = e.hp;
  e.hp = Math.min(e.maxHp, e.hp + amt);
  const got = Math.round(e.hp - before);
  if (got > 0 && text !== false) spawnText(b, e.x, headY(e) - 10, `+${got}`, '#7dff8a', 22);
  return got;
}

function killEnt(b, e, src, silent, o) {
  if (e.dead) return;
  o = o || {};
  // skeletons reassemble once unless burned or smitten
  if (e.def && e.def.reassemble && !e.reassembled && !(o.school === 'holy' || o.school === 'fire') && e.kind === 'foe') {
    e.reassembled = true; e.state = 'bones'; e.st = 0; e.hp = 0; Sound.play('bone');
    burst(b, e.x, e.y - 20, 'bone', 10);
    spawnText(b, e.x, headY(e) - 10, 'It twitches...', '#9fe6ff', 16);
    return;
  }
  e.dead = true; e.deadT = 0; e.state = 'dead'; e.hp = 0;
  if (e.kind === 'hero') { b.slow = 0.3; b.slowT = 1.2; return; }
  if (e.status.footnote > 0 && e.status.footnoteD) { const fd = e.status.footnoteD; for (const o2 of inRadius(foesOf(b, fd.src).filter(targetable), e.x, e.y, 110)) dealDamage(b, fd.src, o2, fd.S.spellPower * 1.4, { kind: 'spell', school: 'ink', noTrigger: true }); addFx(b, { type: 'explosion', x: e.x, y: e.y, r: 110, dur: 0.4, c: '#6a50ff' }); burst(b, e.x, e.y - 30, 'ink', 20); Sound.play('boom', 100); }
  for (const k of b.ents) { if (k.dead || !passOf(b, k)) continue; const PK = passOf(b, k); if (PK.onAnyKill.length && sideOf(k) !== sideOf(e)) for (const tr of PK.onAnyKill) if (dist(k.x, k.y, e.x, e.y) < (tr.r || 260)) runFx(trigCtx(b, k), tr.fx, { x: k.x, y: k.y, e: k }); }
  if (src && passOf(b, src) && sideOf(src) !== sideOf(e)) for (const tr of passOf(b, src).onKill) runFx(trigCtx(b, src), tr.fx, { x: src.x, y: src.y, e: src });
  if (e.kind === 'foe' && !e.summon) {
    b.kills++;
    b.xp += Math.round((e.def ? e.def.xp || 0 : 0) * (e.tier || 1));
    const g = e.def ? Math.round(randi(e.def.gold[0], e.def.gold[1]) * (e.tier || 1)) : 0;
    if (g > 0) dropCoins(b, e.x, e.y, g);
    if (e.champ) { burst(b, e.x, e.y - 20, 'spark', 16); spawnText(b, e.x, headY(e) - 20, `${e.name} falls!`, '#ffd27a', 20); }
    else if (e.def.inkborn) { burst(b, e.x, e.y - 10, 'ink', 22); Sound.play('splat'); }
    else if (e.def.undead) { burst(b, e.x, e.y - 20, 'bone', 14); burst(b, e.x, e.y - 30, 'ember', 10, { c: '#9fe6ff' }); Sound.play('bone'); }
    else { burst(b, e.x, e.y - 20, 'ink', 12); burst(b, e.x, e.y - 30, 'ember', 8); }
    if (e.def.splits) for (const dx of [-30, 30]) { const s = makeEnt(b, 'foe', e.def.splits, e.x + dx, clamp(e.y + rand(-20, 20), FIELD.top, FIELD.bot)); s.state = 'rise'; s.st = 0.3; s.alpha = 0.5; }
    if (e.status.mark > 0) { for (let i = 0; i < b.cds.length; i++) b.cds[i] = Math.max(0, b.cds[i] - 3); spawnText(b, b.hero.x, headY(b.hero) - 26, 'Marked kill!', '#ffd27a', 18); }
    if (e.boss) { b.slow = 0.25; b.slowT = 1.6; b.zoom = 0.06; b.shake = 1.2; Sound.play('boom'); burst(b, e.x, e.y - 40, 'ember', 40); }
  }
  if (e.kind === 'ally') { burst(b, e.x, e.y - 20, e.champ ? 'spark' : 'bone', 10); if (e.champ && !silent) spawnText(b, e.x, headY(e) - 20, `${e.name} is down!`, '#ff9a8a', 18); }
}

function addStatus(b, e, name, dur, data) {
  if (e.dead) return;
  if (e.boss && (name === 'stun' || name === 'freeze' || name === 'fear' || name === 'root' || name === 'sleep')) dur *= 0.4;
  if (e.champ && (name === 'stun' || name === 'freeze' || name === 'sleep' || name === 'toad')) dur *= 0.7;
  if (e.kind === 'hero' && b.S && b.S.ccResist && ['stun', 'freeze', 'sleep', 'toad', 'fear', 'root', 'slow', 'hexed'].includes(name)) dur *= 1 - b.S.ccResist;
  const PT = passOf(b, e);
  if (PT && PT.unstoppable) { if (name === 'slow' || name === 'root') return; if (name === 'stun' || name === 'freeze') dur *= 0.5; }
  e.status[name] = Math.max(e.status[name] || 0, dur);
  if (data) e.status[name + 'D'] = data;
  if (name === 'stun' && dur > 0.3) Sound.play('stun', 150);
}
function addPoison(b, e, dps, src) {
  const s = e.status;
  s.poisonStacks = Math.min(5, (s.poison > 0 ? s.poisonStacks || 0 : 0) + 1);
  s.poison = 4; s.poisonD = { dps, src: src || (s.poisonD && s.poisonD.src) || null };
}

function tickStatus(b, e, dt) {
  const s = e.status;
  for (const k of ['stun', 'freeze', 'slow', 'root', 'fear', 'mark', 'rot', 'burn', 'poison', 'bleed', 'sleep', 'toad', 'hexed', 'corrode', 'footnote', 'taunt']) if (s[k] > 0) s[k] -= dt;
  for (const k in e.buffs) if (e.buffs[k] > 0) e.buffs[k] -= dt;
  if (s.freeze > 0 && s.freeze <= dt + 0.001) addStatus(b, e, 'slow', 1.5);
  e.dotT = (e.dotT || 0) + dt;
  if (e.dotT >= 0.5) {
    e.dotT = 0;
    const tick = (k, mul, col, school) => {
      if (!(s[k] > 0)) return;
      const D = s[k + 'D'];
      if (D && D.dps) dealDamage(b, D.src && !D.src.dead ? D.src : (e.kind === 'foe' ? b.hero : null), e, D.dps * 0.5 * mul, { dot: true, kind: 'dot', school, pure: !D.src });
      burst(b, e.x, bodyY(e), col, 2);
    };
    tick('poison', s.poisonStacks || 1, 'poison', 'poison'); tick('burn', 1, 'ember', 'fire'); tick('rot', 1, 'poison', 'death'); tick('bleed', 1, 'blood', 'blood');
    const P = passOf(b, e);
    if (P && e.hp < e.maxHp) {
      let r = P.regen || 0; if (P.regenLow && e.hp < e.maxHp * 0.5) r += P.regenLow;
      if (r) healEnt(b, e, e.maxHp * r * 0.5, false);
    }
  }
}

/* ======================= projectiles ======================= */
function shoot(b, src, x, y, tg, o) {
  const tx = tg ? tg.x : x + src.facing * 400, ty = tg ? bodyY(tg) : y;
  const ang = Math.atan2(ty - y, tx - x);
  const p = Object.assign({ x, y, ang, life: 2.2, from: src, side: sideOf(src), target: tg, hit: new Set(), pierce: 0, radius: 18, t: 0 }, o);
  p.h0 = Math.max(10, src.y - y); p.h1 = tg ? Math.max(10, tg.y - ty) : p.h0; p.D = tg ? Math.hypot(tx - x, ty - y) : 0;
  p.vx = Math.cos(ang) * p.speed; p.vy = Math.sin(ang) * p.speed;
  if (p.arc) { const d = Math.hypot(tx - x, ty - y); p.flight = d / p.speed; p.x0 = x; p.y0 = y; p.x1 = tx; p.y1 = ty; }
  b.projs.push(p);
  return p;
}

function updateProjs(b, dt) {
  for (const p of b.projs) {
    p.t += dt; p.life -= dt;
    if (p.arc) {
      const k = clamp(p.t / p.flight, 0, 1);
      p.x = lerp(p.x0, p.x1, k); p.y = lerp(p.y0, p.y1, k) - Math.sin(k * Math.PI) * (p.arcH || 80);
      if (k >= 1) { projImpact(b, p, null); p.life = 0; }
      continue;
    }
    if (p.homing && p.target && !p.target.dead) {
      const a2 = Math.atan2(bodyY(p.target) - p.y, p.target.x - p.x);
      let da = a2 - p.ang; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      p.ang += clamp(da, -6 * dt, 6 * dt); p.vx = Math.cos(p.ang) * p.speed; p.vy = Math.sin(p.ang) * p.speed;
    }
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.trail) burst(b, p.x, p.y, p.trail, 1);
    if (p.x < -80 || p.x > b.W + 80 || p.y < -40 || p.y > 660) { p.life = 0; continue; }
    const targets = p.side === 'foe' ? b.ents.filter((e) => (e.kind === 'hero' || e.kind === 'ally') && targetable(e)) : living(b, 'foe').filter((e) => e.state !== 'rise');
    for (const e of targets) {
      if (p.hit.has(e.id)) continue;
      if (Math.abs(p.x - e.x) < p.radius + e.r && Math.abs(p.y - bodyY(e)) < p.radius + 26) {
        p.hit.add(e.id);
        projImpact(b, p, e);
        if (p.pierce > 0) p.pierce--; else { p.life = 0; break; }
      }
    }
  }
  b.projs = b.projs.filter((p) => p.life > 0);
}

function projImpact(b, p, e) {
  if (p.onHit) { p.onHit(b, p, e); return; }
  if (e) {
    const r = dealDamage(b, p.from, e, p.dmg * rand(0.9, 1.1), { kind: p.spell ? 'spell' : 'ranged', school: p.school, auto: p.auto, knock: p.knock });
    if (p.side === 'foe' && p.kind === 'cold') addStatus(b, e, 'slow', 1.5);
    if (r && p.auto && p.from && p.from.buffs && p.from.buffs.nightshade > 0) addPoison(b, e, (statsOf(b, p.from) || b.S).melee * 0.14, p.from);
    if (r && p.knock && !e.boss) e.kx = sign(p.vx || 1) * p.knock;
    burst(b, p.x, p.y, p.kind === 'hex' ? 'hexspark' : 'spark', 6, { c: p.color });
  }
}

/* ======================= zones, telegraphs, fx ======================= */
function addZone(b, z) { z.t = 0; b.zones.push(z); return z; }
function updateZones(b, dt) {
  for (const z of b.zones) {
    z.t += dt; z.tick = (z.tick || 0) + dt;
    const side = z.side || 'hero';
    const enemies = () => side === 'foe' ? b.ents.filter((e) => (e.kind === 'hero' || e.kind === 'ally') && targetable(e)) : living(b, 'foe').filter((e) => e.state !== 'rise');
    if (z.trap) {
      const e = enemies().find((o) => dist(o.x, o.y, z.x, z.y) < z.r + o.r * 0.5);
      if (e) { const S = z.S || b.S; dealDamage(b, z.src || b.hero, e, S.melee * z.trap.m, { kind: 'melee', ability: true }); for (const st2 of z.trap.st || []) addStatus(b, e, st2[0], st2[1]); burst(b, z.x, z.y, 'spark', 10, { gy: z.y }); addFx(b, { type: 'ring', x: z.x, y: z.y, r0: 10, r1: 70, dur: 0.3, c: '#c8b08a' }); Sound.play('steel'); z.t = z.dur; }
      continue;
    }
    if (z.tick >= 0.5) {
      z.tick = 0;
      const dps = z.dps || z.foeDps || 0;
      for (const f of inRadius(enemies(), z.x, z.y, z.r)) {
        if (dps && (!z.unholyOnly || unholy(f))) dealDamage(b, z.src && !z.src.dead ? z.src : (side === 'hero' ? b.hero : null), f, dps * 0.5, { dot: true, kind: 'dot', school: z.school, pure: !z.src });
        if (z.slow) addStatus(b, f, 'slow', 0.7);
        if (z.poison) addPoison(b, f, z.poison, z.src);
      }
      const heal = z.heal || (z.healHero ? 0.04 : 0);
      if (heal) { const friends = side === 'foe' ? living(b, 'foe') : b.ents.filter((e) => (e.kind === 'hero' || e.kind === 'ally') && !e.dead); for (const f of inRadius(friends, z.x, z.y, z.r)) healEnt(b, f, f.maxHp * heal * 0.5 * ((statsOf(b, f) || {}).heal || 1), false); }
    }
  }
  b.zones = b.zones.filter((z) => z.t < z.dur);
}
function tele(b, o) { o.type = 'tele'; o.t = 0; b.fx.push(o); return o; }
function addFx(b, o) { o.t = o.t || 0; b.fx.push(o); return o; }
function updateFx(b, dt) {
  for (const f of b.fx) {
    f.t += dt;
    if (f.type === 'tele' && !f.done && f.t >= f.dur) { f.done = true; f.onDone && f.onDone(); }
    if (f.type === 'ticker') { f.acc = (f.acc || 0) + dt; while (f.acc >= f.every && (f.k || 0) < f.n) { f.acc -= f.every; f.k = (f.k || 0) + 1; f.fn(); } }
    if (f.type === 'delay' && !f.done && f.t >= f.dur) { f.done = true; f.fn(); }
  }
  b.fx = b.fx.filter((f) => f.t < f.dur + (f.type === 'tele' ? 0.05 : 0));
}
function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy || 1;
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / L, 0, 1);
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}
function later(b, sec, fn) { addFx(b, { type: 'delay', dur: sec, fn }); }

/* ======================= particles & text ======================= */
const PCOL = { spark: '#fff2c8', ember: '#ffb04a', ink: '#141830', blood: '#6e1612', bone: '#e6dfcc', dust: '#8a7a62', poison: '#8fd14f', holy: '#ffe9a8', frost: '#c8f0ff', hexspark: '#d8a0ff', shadow: '#2a2440', coin: '#ffd25a', necro: '#7bd389' };
function burst(b, x, y, type, n, o) {
  o = o || {};
  for (let i = 0; i < n; i++) {
    if (b.parts.length > 700) b.parts.shift();
    const a = Math.random() * TAU, sp = (o.speed || 1) * rand(40, 220);
    const gy = o.gy != null ? o.gy : (type === 'dust' || type === 'smoke' ? y : y + 46);
    const p = { type, x, y, gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.7 - (type === 'ember' || type === 'holy' || type === 'poison' || type === 'necro' ? 60 : 80), life: 0, max: rand(0.35, 0.8), size: rand(2, 4.5), c: o.c || PCOL[type] || '#fff', rot: Math.random() * TAU, vr: rand(-10, 10) };
    if (type === 'ember' || type === 'holy' || type === 'necro') { p.vx *= 0.3; p.vy = -rand(40, 120); p.max = rand(0.6, 1.3); }
    if (type === 'dust') { p.vy = -rand(10, 60); p.vx *= 0.8; p.size = rand(5, 12); p.max = rand(0.4, 0.9); }
    if (type === 'smoke') { p.vy = -rand(10, 40); p.vx *= 0.2; p.size = rand(10, 22); p.max = rand(0.6, 1.2); }
    if (type === 'ink' || type === 'blood' || type === 'bone') { p.grav = 520; p.ground = gy - rand(0, 3); }
    if (type === 'shard') { p.grav = 400; p.ground = gy - rand(0, 3); p.c = '#c8f0ff'; }
    b.parts.push(p);
  }
}
function dropCoins(b, x, y, n) {
  b.gold += n;
  const k = Math.min(n, 6);
  for (let i = 0; i < k; i++) { const gy = y + rand(-8, 8); b.parts.push({ type: 'coin', x, y: y - 20, gy, vx: rand(-90, 90), vy: -rand(160, 260), grav: 700, ground: gy, life: 0, max: 1.9, size: 5, bounce: 0, c: '#ffd25a' }); }
  later(b, 0.6, () => Sound.play('coin', 60));
}
function updateParts(b, dt) {
  for (const p of b.parts) {
    p.life += dt;
    if (p.grav) { p.vy += p.grav * dt; if (p.y > p.ground && p.vy > 0) { if (p.type === 'coin' && (p.bounce || 0) < 2) { p.vy *= -0.4; p.vx *= 0.6; p.bounce = (p.bounce || 0) + 1; } else { p.vy = 0; p.vx *= 0.8; p.grav = 0; p.landed = true; } } }
    else { p.vx *= Math.pow(0.2, dt); p.vy *= Math.pow(0.4, dt); }
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    if (p.type === 'coin' && p.life > 1.2) { p.y -= dt * 260; p.gy -= dt * 0; }
  }
  b.parts = b.parts.filter((p) => p.life < p.max);
}
function spawnText(b, x, y, text, color, size, crit) {
  b.texts.push({ x, y, gy: y + 104, text, color, size: size || 22, t: 0, vy: -70, crit });
  if (b.texts.length > 40) b.texts.shift();
}
function updateTexts(b, dt) { for (const t of b.texts) { t.t += dt; t.y += t.vy * dt; t.vy *= Math.pow(0.15, dt); } b.texts = b.texts.filter((t) => t.t < 1.05); }

/* ======================= channel (drain life) ======================= */
function tickChannel(b, h, dt) {
  const c = h.channel; c.t += dt; c.acc += dt;
  h.state = 'channel';
  if (!c.target || c.target.dead || c.t >= c.dur || isDisabled(h)) { endChannel(b, h); return; }
  h.facing = c.target.x < h.x ? -1 : 1;
  const S = statsOf(b, h) || b.S;
  if (c.acc >= 0.5) { c.acc = 0; const r = dealDamage(b, h, c.target, S.spellPower * (c.m || 0.45), { kind: 'spell', quiet: false, noEmpower: c.t > 0.6 }); if (r) healEnt(b, h, r.dmg * (c.leech == null ? 1 : c.leech)); burst(b, c.target.x, bodyY(c.target), 'necro', 4); }
}
function endChannel(b, h) { h.channel = null; if (h.state === 'channel') h.state = 'idle'; }

/* ======================= tutorial ======================= */
function tutorial(b, dt) {
  if (!b.def.tutorial) { if (b.hero.hp < b.hero.maxHp * 0.35 && b.belt.includes('heal') && !b.tips.pot) { b.tips.pot = 1; HUD.tip('You are hurt. Drink a Healing Draught from your belt (Q).', 4); } return; }
  const T = b.tips;
  if (!T.a && b.stateT > 0.2) { T.a = 1; HUD.tip('Tap a monster to attack it. You keep swinging until it drops.', 0); }
  if (T.a === 1 && b.attacked) { T.a = 2; HUD.tip('Tap the ground to move. Step away from bites to make them miss.', 4.5); }
  if (!T.s && b.kills >= 1 && b.loadout.some((id, i) => id && b.cds[i] <= 0) && !b.usedSkill) { T.s = 1; HUD.tip('Your spells sit on the bar below. Tap one, or press 1 to 5.', 5); }
  if (!T.p && b.hero.hp < b.hero.maxHp * 0.5 && b.belt[0]) { T.p = 1; HUD.tip('Hurt? Drink from your belt: tap the bottle or press Q.', 5); }
}

/* ======================= lights ======================= */
function collectLights(b) {
  const L = [{ x: b.hero.x, y: b.hero.y - 40, r: 150, c: '#ffd9a8', a: 0.45, noGlow: true }];
  for (const p of b.projs) {
    const c = { fireball: ['#ff8a3a', 170, 0.9], bolt: ['#8fd7ff', 90, 0.6], hex: ['#b06ad8', 90, 0.6], cold: ['#9fe6ff', 80, 0.5], silver: ['#e6eef8', 80, 0.5], bone: ['#9dffb0', 70, 0.4], flask: ['#ffb04a', 60, 0.5], lightning: ['#cfe8ff', 120, 0.7] }[p.kind];
    if (c) L.push({ x: p.x, y: p.y, r: c[1], c: c[0], a: c[2] });
  }
  for (const z of b.zones) { const c = z.light; if (c) L.push({ x: z.x, y: z.y - 10, r: z.r * 1.6, c, a: 0.55 * clamp((z.dur - z.t) * 2, 0, 1), f: 1 }); }
  for (const f of b.fx) {
    if (f.type === 'explosion') L.push({ x: f.x, y: f.y, r: 260 * (1 - f.t / f.dur), c: f.c || '#ff9a4a', a: 0.95 });
    if (f.type === 'pillar') L.push({ x: f.x, y: f.y - 60, r: 220 * (1 - f.t / f.dur), c: '#ffe9a8', a: 0.9 });
    if (f.type === 'ring' && f.light) L.push({ x: f.x, y: f.y, r: f.r1 * 1.4 * (1 - f.t / f.dur), c: f.c, a: 0.7 });
    if (f.type === 'lightning') L.push({ x: f.pts[f.pts.length - 1][0], y: f.pts[f.pts.length - 1][1], r: 200, c: '#cfe8ff', a: 0.8 * (1 - f.t / f.dur) });
    if (f.type === 'beam') L.push({ x: f.x2, y: f.y2, r: 110, c: f.c, a: 0.6 });
  }
  for (const e of b.ents) {
    if (e.dead) continue;
    if (e.cfg.rig === 'wisp') L.push({ x: e.x, y: e.y - 70, r: 110, c: '#9fe6ff', a: 0.6 });
    if (e.type === 'sexton') L.push({ x: e.x - e.facing * 20, y: e.y - 50, r: 170, c: '#7bd389', a: 0.7, f: 1 });
    if (e.cfg.weapon && e.cfg.weapon.type === 'staff') L.push({ x: e.x + e.facing * 20, y: e.y - 90, r: 70, c: e.cfg.weapon.color2 || '#8fd7ff', a: 0.4 });
    if (e.buffs.fury > 0 || e.frenzy) L.push({ x: e.x, y: e.y - 40, r: 90, c: '#ff5a2a', a: 0.4 });
  }
  return L;
}
