/* ==========================================================================
   Rigs - paper-puppet characters drawn in code
   Local space: origin at the feet, facing right, y negative is up.
   ========================================================================== */

/* ---------- weapons (grip at origin, blade toward -y) ---------- */
const WEAPON_TIP = { sword: [0, -36], mace: [0, -31], club: [0, -30], daggers: [0, -18], staff: [0, -36], spear: [0, -44], sickle: [7, -26], shovel: [0, 22], cleaver: [2, -22], knife: [0, -15], broom: [0, -34], crossbow: [0, -22], scythe: [10, -40] };

function drawWeapon(ctx, w, glowAmt) {
  const c1 = w.color, c2 = w.color2;
  switch (w.type) {
    case 'sword': {
      poly(ctx, [-2.8, -5, 2.8, -5, 2.8, -30, 0, -37, -2.8, -30]); ink(ctx, c1 || PAL.steel);
      ctx.beginPath(); ctx.moveTo(0.4, -8); ctx.lineTo(0.4, -30); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
      sheen(ctx, 0.6, -22, 5, 20, 0, 0.7);
      rr(ctx, -7, -6.5, 14, 3.8, 1.6); ink(ctx, c2 || PAL.gold);
      rr(ctx, -2, -4, 4, 9, 1.5); ink(ctx, PAL.leather);
      circ(ctx, 0, 6, 2.6); ink(ctx, c2 || PAL.gold);
      break;
    }
    case 'mace': case 'club': {
      rr(ctx, -2, -20, 4, 26, 1.8); ink(ctx, w.type === 'club' ? PAL.wood : PAL.woodDark);
      if (w.type === 'mace') {
        poly(ctx, [-7, -20, 7, -20, 8, -27, 0, -33, -8, -27]); ink(ctx, c1 || PAL.iron);
        for (const [x, y] of [[-8, -24], [8, -24], [0, -33]]) { circ(ctx, x, y, 2.2); ink(ctx, c2 || PAL.steel, 2); }
      } else {
        ell(ctx, 0, -26, 6.5, 9, 0); ink(ctx, c1 || PAL.wood);
        circ(ctx, 3, -29, 1.4); ink(ctx, PAL.steel, 1.5); circ(ctx, -3, -24, 1.4); ink(ctx, PAL.steel, 1.5);
      }
      break;
    }
    case 'daggers': case 'knife': {
      poly(ctx, [-2.2, -3, 2.2, -3, 1.6, -15, 0, -19, -1.6, -15]); ink(ctx, c1 || PAL.steel, 2.4);
      rr(ctx, -4.5, -4.5, 9, 3, 1); ink(ctx, c2 || PAL.iron, 2.2);
      rr(ctx, -1.6, -2, 3.2, 7, 1); ink(ctx, PAL.leather, 2.2);
      break;
    }
    case 'cleaver': {
      poly(ctx, [-2, -3, 6, -6, 9, -22, -2, -20]); ink(ctx, c1 || PAL.iron, 2.6);
      rr(ctx, -2, -4, 4, 9, 1.4); ink(ctx, PAL.woodDark, 2.4);
      break;
    }
    case 'staff': case 'broom': {
      rr(ctx, -2, -30, 4, 54, 2); ink(ctx, c1 || PAL.wood);
      if (w.type === 'broom') {
        poly(ctx, [-3, 22, 3, 22, 9, 40, -9, 40]); ink(ctx, '#b89a52');
        ctx.beginPath(); for (let i = -6; i <= 6; i += 3) { ctx.moveTo(i * 0.4, 24); ctx.lineTo(i, 39); } ctx.lineWidth = 1; ctx.strokeStyle = PAL.out; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(-2, -30); ctx.quadraticCurveTo(-9, -38, -3, -44); ctx.moveTo(2, -30); ctx.quadraticCurveTo(9, -38, 3, -44);
        ctx.lineWidth = LINE; ctx.strokeStyle = PAL.out; ctx.stroke();
        const gc = c2 || '#8fd7ff';
        circ(ctx, 0, -37, 5.2); ink(ctx, gc);
        circ(ctx, -1.5, -38.5, 1.6); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
        if (glowAmt > 0) glow(ctx, 0, -37, 26 + glowAmt * 30, gc, 0.5 + glowAmt * 0.5);
      }
      break;
    }
    case 'spear': {
      rr(ctx, -1.8, -36, 3.6, 54, 1.6); ink(ctx, PAL.wood, 2.4);
      poly(ctx, [-3.5, -35, 3.5, -35, 0, -47]); ink(ctx, c1 || PAL.iron, 2.4);
      break;
    }
    case 'sickle': case 'scythe': {
      const L = w.type === 'scythe' ? 40 : 18;
      rr(ctx, -1.8, -L, 3.6, L + 6, 1.6); ink(ctx, PAL.woodDark, 2.4);
      ctx.beginPath(); ctx.moveTo(0, -L); ctx.quadraticCurveTo(w.type === 'scythe' ? 26 : 16, -L - 4, w.type === 'scythe' ? 22 : 13, -L + 12);
      ctx.quadraticCurveTo(w.type === 'scythe' ? 16 : 9, -L + 2, 0, -L + 4); ctx.closePath(); ink(ctx, c1 || '#c7d0c4', 2.4);
      if (glowAmt > 0) glow(ctx, 8, -L + 2, 18, PAL.necro, 0.45);
      break;
    }
    case 'shovel': {
      rr(ctx, -2, -22, 4, 40, 1.6); ink(ctx, PAL.wood, 2.6);
      rr(ctx, -5, -27, 10, 5, 2); ink(ctx, PAL.woodDark, 2.4);
      poly(ctx, [-7, 16, 7, 16, 6, 30, 0, 34, -6, 30]); ink(ctx, c1 || PAL.iron, 2.6);
      break;
    }
    case 'crossbow': {
      rr(ctx, -2.4, -24, 4.8, 30, 2); ink(ctx, PAL.woodDark, 2.6);
      ctx.beginPath(); ctx.moveTo(-13, -14); ctx.quadraticCurveTo(0, -24, 13, -14);
      ctx.lineWidth = 4.5; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 2.4; ctx.strokeStyle = c1 || PAL.steelDark; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-13, -14); ctx.lineTo(0, -8); ctx.lineTo(13, -14); ctx.lineWidth = 1; ctx.strokeStyle = '#d8d0bc'; ctx.stroke();
      poly(ctx, [-1.2, -10, 1.2, -10, 1.2, -26, 0, -29, -1.2, -26]); ink(ctx, '#d9dde3', 1.6);
      break;
    }
    case 'sling': {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.lineWidth = 1.4; ctx.strokeStyle = '#6d5a3e'; ctx.stroke();
      circ(ctx, 0, 15, 3); ink(ctx, '#8a8578', 2);
      break;
    }
    case 'cards': {
      for (let i = -1; i <= 1; i++) { ctx.save(); ctx.rotate(i * 0.3); rr(ctx, -3, -13, 6, 9, 1); ink(ctx, i === 0 ? '#f0e8d4' : '#e5dcc4', 1.6); ctx.restore(); }
      break;
    }
    case 'candle': {
      rr(ctx, -2.2, -14, 4.4, 12, 1); ink(ctx, '#efe6cf', 2);
      ell(ctx, 0, -18, 2.2, 4, 0); ctx.fillStyle = PAL.fire1; ctx.fill();
      glow(ctx, 0, -18, 34, PAL.torch, 0.55);
      break;
    }
    case 'mirror': {
      rr(ctx, -1.6, -4, 3.2, 10, 1.4); ink(ctx, '#b9bfc9', 2);
      ell(ctx, 0, -12, 6, 8, 0); ink(ctx, '#c9d3e2', 2.4);
      ell(ctx, -1.5, -13.5, 2, 3.5, 0.3); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill();
      break;
    }
    default: break;
  }
}

function drawOffhand(ctx, o, t) {
  switch (o.type) {
    case 'shield': {
      circ(ctx, 0, 0, 11); ink(ctx, o.color || PAL.wood);
      circ(ctx, 0, 0, 11); ctx.lineWidth = 2.4; ctx.strokeStyle = C(o.color2 || PAL.iron); ctx.stroke();
      circ(ctx, 0, 0, 11.8); ctx.lineWidth = 1.4; ctx.strokeStyle = PAL.out; ctx.stroke();
      circ(ctx, 0, 0, 3.4); ink(ctx, o.color2 || PAL.steel, 2);
      break;
    }
    case 'kite': {
      ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(10, -12); ctx.quadraticCurveTo(11, 4, 0, 16); ctx.quadraticCurveTo(-11, 4, -10, -12); ctx.closePath();
      ink(ctx, o.color || '#2f4f7a');
      ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 12); ctx.moveTo(-7, -3); ctx.lineTo(7, -3); ctx.lineWidth = 2.6; ctx.strokeStyle = C(o.color2 || PAL.gold); ctx.stroke();
      break;
    }
    case 'tome': {
      rr(ctx, -8, -10, 15, 19, 2); ink(ctx, o.color || '#5b2a24');
      rr(ctx, 5, -9, 3, 17, 1); ink(ctx, '#e8dcc0', 1.6);
      circ(ctx, -0.5, -0.5, 3); ink(ctx, o.color2 || PAL.gold, 1.6);
      break;
    }
    case 'lantern': {
      const sw = Math.sin((t || 0) * 3) * 0.12;
      ctx.save(); ctx.rotate(sw);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 6); ctx.lineWidth = 1.6; ctx.strokeStyle = PAL.out; ctx.stroke();
      rr(ctx, -5.5, 6, 11, 14, 2.5); ink(ctx, alpha(o.color2 || PAL.fire1, 0.9));
      rr(ctx, -6.5, 4.5, 13, 3, 1); ink(ctx, o.color || PAL.iron, 2);
      rr(ctx, -6.5, 19, 13, 3, 1); ink(ctx, o.color || PAL.iron, 2);
      glow(ctx, 0, 13, 46, o.color2 || PAL.torch, 0.55);
      ctx.restore();
      break;
    }
    default: break;
  }
}

/* ---------- hair & hats ---------- */
function hairBack(ctx, cfg, hx, hy, t, sway) {
  const h = cfg.hair; if (!h) return;
  const c = h.color;
  if (h.style === 'long') { rr(ctx, hx - 17, hy - 6, 26, 30, 10); ink(ctx, c); }
  else if (h.style === 'pony') { ctx.save(); ctx.translate(hx - 15, hy - 6); ctx.rotate(0.35 + sway * 0.6); ell(ctx, -3, 10, 6, 12, 0.2); ink(ctx, c); ctx.restore(); }
  else if (h.style === 'braid') {
    for (let i = 0; i < 4; i++) { circ(ctx, hx - 13 - i * 1.5 - sway * i * 3, hy + 4 + i * 7, 5 - i * 0.5); ink(ctx, c, 2.4); }
  } else if (h.style === 'wild') {
    for (const [dx, dy, r] of [[-15, -2, 9], [-12, 9, 8], [-16, -12, 8], [-6, -18, 8], [5, -19, 8], [14, -13, 7]]) { circ(ctx, hx + dx, hy + dy, r); ink(ctx, c, 2.4); }
  } else if (h.style === 'bun') { circ(ctx, hx - 12, hy - 13, 7); ink(ctx, c); }
}
function hairFront(ctx, cfg, hx, hy, r) {
  const h = cfg.hair; if (!h || h.style === 'bald') return;
  const c = h.color;
  if (h.style === 'spiky') {
    ctx.beginPath(); ctx.moveTo(hx - r * 0.98, hy + 2);
    const pts = 7;
    for (let i = 0; i <= pts; i++) {
      const a = Math.PI + 0.15 + (i / pts) * (Math.PI * 0.95);
      const rr2 = r + (i % 2 ? 9 : 2);
      ctx.lineTo(hx + Math.cos(a) * rr2, hy + Math.sin(a) * rr2 - 1);
    }
    ctx.lineTo(hx + r * 0.95, hy - 4); ctx.quadraticCurveTo(hx + 4, hy - 8, hx - 2, hy - 3); ctx.quadraticCurveTo(hx - 8, hy - 9, hx - r * 0.98, hy + 2);
    ctx.closePath(); ink(ctx, c);
  } else if (h.style === 'mop' || h.style === 'long' || h.style === 'pony' || h.style === 'braid' || h.style === 'bun') {
    ctx.beginPath();
    ctx.arc(hx, hy, r + 2, Math.PI * 0.98, Math.PI * 2.02);
    ctx.quadraticCurveTo(hx + r * 0.9, hy - 1, hx + r * 0.55, hy - 5);
    ctx.quadraticCurveTo(hx + 3, hy - 2, hx + 2, hy - 8);
    ctx.quadraticCurveTo(hx - 6, hy - 1, hx - r - 2, hy + (h.style === 'mop' ? 6 : 3));
    ctx.closePath(); ink(ctx, c);
  } else if (h.style === 'wild') {
    for (const [dx, dy, rr2] of [[-10, -12, 8], [2, -15, 8], [12, -10, 7], [-15, -4, 6]]) { circ(ctx, hx + dx, hy + dy, rr2); ink(ctx, c, 2.4); }
  }
}

function drawHat(ctx, hat, hx, hy, r, t, layer) {
  const c = hat.color, c2 = hat.color2;
  switch (hat.type) {
    case 'helm': case 'greathelm': {
      if (layer !== 'front') return;
      ctx.beginPath(); ctx.arc(hx, hy + 1, r + 2.5, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(hx + r + 2, hy + 4); ctx.lineTo(hx - r - 2.5, hy + 4); ctx.closePath();
      band(ctx, () => { ctx.beginPath(); ctx.arc(hx, hy + 1, r + 2.5, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(hx + r + 2, hy + 4); ctx.lineTo(hx - r - 2.5, hy + 4); ctx.closePath(); }, c || PAL.steel, hx - 6, hy + 14, r + 4, 0.2);
      rr(ctx, hx - r - 3, hy + 1, r * 2 + 5, 5, 2); ink(ctx, c2 || PAL.steelDark);
      if (hat.type === 'greathelm') { rr(ctx, hx - r + 2, hy + 5, r * 2 - 2, 14, 4); ink(ctx, c || PAL.steel); rr(ctx, hx + 2, hy + 9, 14, 2.5, 1); ctx.fillStyle = PAL.out; ctx.fill(); }
      else { rr(ctx, hx + 9, hy + 2, 3.4, 13, 1.5); ink(ctx, c2 || PAL.steelDark, 2); }
      ctx.beginPath(); ctx.moveTo(hx - 6, hy - r + 1); ctx.quadraticCurveTo(hx - 2, hy - r - 4, hx + 3, hy - r + 2); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.stroke();
      sheen(ctx, hx + 3, hy - r * 0.55, 16, 9, -0.3, 0.75);
      if (hat.plume) {
        const sw = Math.sin(t * 2.2) * 2;
        ctx.beginPath(); ctx.moveTo(hx - 2, hy - r - 1); ctx.bezierCurveTo(hx - 10, hy - r - 18, hx - 26 + sw, hy - r - 10, hx - 30 + sw, hy - r + 4);
        ctx.bezierCurveTo(hx - 20, hy - r - 2, hx - 12, hy - r - 2, hx + 2, hy - r + 1); ctx.closePath(); ink(ctx, hat.plume);
      }
      break;
    }
    case 'wizard': {
      if (layer !== 'front') return;
      ell(ctx, hx, hy - 6, r + 10, 5.5, -0.06); ink(ctx, c || '#3a2f6b');
      ctx.beginPath(); ctx.moveTo(hx - r + 1, hy - 8); ctx.quadraticCurveTo(hx - 6, hy - r - 26, hx - 18, hy - r - 34 + Math.sin(t * 1.6) * 1.5);
      ctx.quadraticCurveTo(hx + 2, hy - r - 20, hx + r - 2, hy - 8); ctx.closePath(); ink(ctx, c || '#3a2f6b');
      rr(ctx, hx - r + 1, hy - 13, r * 2 - 3, 5, 1.5); ink(ctx, c2 || PAL.gold, 2.2);
      circ(ctx, hx + 2, hy - r - 6, 2.4); ctx.fillStyle = C(c2 || PAL.gold); ctx.fill();
      break;
    }
    case 'hood': case 'cowl': {
      const deep = hat.type === 'cowl';
      if (layer === 'back') {
        ctx.beginPath(); ctx.moveTo(hx + r * 0.7, hy - r * 0.9);
        ctx.quadraticCurveTo(hx - r * 0.2, hy - r - 9, hx - r - 7, hy - 3);
        ctx.quadraticCurveTo(hx - r - 10, hy + 16, hx - r + 2, hy + 24);
        ctx.lineTo(hx + 8, hy + 22); ctx.quadraticCurveTo(hx + r + 6, hy + 4, hx + r * 0.7, hy - r * 0.9); ctx.closePath();
        ink(ctx, c || '#2e3b2e');
      } else {
        ctx.beginPath(); ctx.arc(hx + 2, hy + 1, r + 3, Math.PI * 1.05, Math.PI * 1.85);
        ctx.quadraticCurveTo(hx + r + 1, hy - 4, hx + r - 3, hy + (deep ? 2 : -6));
        ctx.quadraticCurveTo(hx + 2, hy - 9, hx - r + 1, hy + 3); ctx.closePath(); ink(ctx, shade(c || '#2e3b2e', 0.08));
        if (deep) { ctx.beginPath(); ctx.arc(hx + 3, hy + 2, r - 2, -1.2, 1.4); ctx.fillStyle = 'rgba(10,8,12,0.45)'; ctx.fill(); }
      }
      break;
    }
    case 'veil': {
      if (layer === 'back') {
        ctx.beginPath(); ctx.moveTo(hx + 4, hy - r - 1); ctx.quadraticCurveTo(hx - r - 10, hy - r, hx - r - 8, hy + 26); ctx.lineTo(hx - 2, hy + 24); ctx.closePath(); ink(ctx, c || '#262a3a');
      } else {
        ctx.beginPath(); ctx.arc(hx + 1, hy + 1, r + 2, Math.PI * 0.95, Math.PI * 2.05); ctx.lineTo(hx + r - 2, hy - 4); ctx.quadraticCurveTo(hx + 2, hy - 10, hx - r + 2, hy - 2); ctx.closePath(); ink(ctx, c2 || '#f1ead8');
        rr(ctx, hx - r + 2, hy - 9, r * 2 - 1, 4, 1.5); ink(ctx, PAL.gold, 1.8);
      }
      break;
    }
    case 'circlet': {
      if (layer !== 'front') return;
      ctx.beginPath(); ctx.ellipse(hx, hy - 6, r + 0.5, 4, -0.05, Math.PI * 0.95, Math.PI * 2.05); ctx.lineWidth = 5; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 2.8; ctx.strokeStyle = C(c || PAL.gold); ctx.stroke();
      circ(ctx, hx + 6, hy - 10, 3); ink(ctx, c2 || '#7fd1ff', 1.8);
      break;
    }
    case 'cap': {
      if (layer !== 'front') return;
      ctx.beginPath(); ctx.arc(hx, hy, r + 1.5, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(hx + r + 8, hy - 3); ctx.lineTo(hx - r, hy - 2); ctx.closePath(); ink(ctx, c || PAL.leather);
      break;
    }
    case 'pot': {
      if (layer !== 'front') return;
      rr(ctx, hx - r - 2, hy - r - 8, r * 2 + 4, r + 4, 6); ink(ctx, c || '#4b4f58');
      rr(ctx, hx - r - 5, hy - 6, r * 2 + 10, 5, 2); ink(ctx, c2 || '#3a3d45');
      rr(ctx, hx + r + 2, hy - 14, 10, 3.5, 1.5); ink(ctx, '#3a3d45', 2.2);
      break;
    }
    case 'crown': {
      if (layer !== 'front') return;
      ctx.save(); ctx.translate(hx, hy - r + 2); ctx.rotate(0.12);
      poly(ctx, [-13, 6, -15, -10, -8, -2, -3, -14, 2, -3, 8, -12, 10, -1, 15, -9, 14, 6]); ink(ctx, c || '#c9a545');
      circ(ctx, -3, 0, 2); ctx.fillStyle = C('#b8321e'); ctx.fill(); circ(ctx, 7, 1, 2); ctx.fillStyle = C('#3b7bd1'); ctx.fill();
      ctx.restore();
      break;
    }
    case 'brim': {
      if (layer !== 'front') return;
      ell(ctx, hx + 1, hy - 7, r + 15, 5.5, -0.08); ink(ctx, c || '#1f1b1b');
      rr(ctx, hx - r + 2, hy - r - 9, r * 2 - 3, r - 3, 5); ink(ctx, c || '#1f1b1b');
      rr(ctx, hx - r + 2, hy - 14, r * 2 - 3, 4, 1); ink(ctx, c2 || '#7a1f1b', 2);
      rr(ctx, hx + 3, hy - 15, 5, 5, 1); ink(ctx, '#c9a545', 1.6);
      break;
    }
    case 'tophat': {
      if (layer !== 'front') return;
      ell(ctx, hx, hy - 9, r + 6, 4.5, -0.04); ink(ctx, c || '#262028');
      rr(ctx, hx - r + 4, hy - r - 20, r * 2 - 8, r + 12, 3); ink(ctx, c || '#262028');
      rr(ctx, hx - r + 4, hy - 16, r * 2 - 8, 4, 1); ink(ctx, c2 || '#7a1f1b', 2);
      break;
    }
    case 'kerchief': {
      if (layer === 'back') { poly(ctx, [hx - r + 2, hy - 8, hx - r - 10, hy - 2, hx - r - 6, hy + 6, hx - r + 4, hy - 2]); ink(ctx, c || '#6a2f43', 2.4); return; }
      ctx.beginPath(); ctx.arc(hx, hy, r + 1.8, Math.PI * 1.0, Math.PI * 2.0); ctx.quadraticCurveTo(hx, hy - 7, hx - r - 1.8, hy); ctx.closePath(); ink(ctx, c || '#6a2f43');
      for (const [dx, dy] of [[-6, -10], [4, -13], [10, -6]]) { circ(ctx, hx + dx, hy + dy, 1.4); ctx.fillStyle = 'rgba(255,240,210,0.7)'; ctx.fill(); }
      break;
    }
    case 'bandana': {
      if (layer === 'back') { poly(ctx, [hx - r + 1, hy - 7, hx - r - 12, hy - 4 + Math.sin(t * 4) * 2, hx - r - 9, hy + 3, hx - r + 2, hy - 2]); ink(ctx, c || PAL.crimson, 2.2); return; }
      ctx.beginPath(); ctx.arc(hx, hy, r + 1.5, Math.PI * 1.02, Math.PI * 1.98); ctx.quadraticCurveTo(hx, hy - 9, hx - r - 1.5, hy - 2); ctx.closePath(); ink(ctx, c || PAL.crimson);
      break;
    }
    case 'shamanskull': {
      if (layer !== 'front') return;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + s * 8, hy - r + 2); ctx.quadraticCurveTo(hx + s * 22, hy - r - 6, hx + s * 20, hy - r - 20); ctx.lineWidth = 5; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = C(PAL.bone); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(hx, hy - 2, r + 1.5, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(hx + r, hy - 4); ctx.lineTo(hx - r, hy - 4); ctx.closePath(); ink(ctx, PAL.bone);
      circ(ctx, hx - 4, hy - 10, 2.6); ctx.fillStyle = PAL.out; ctx.fill(); circ(ctx, hx + 6, hy - 10, 2.6); ctx.fill();
      for (const [dx, col] of [[-10, '#b8321e'], [-14, '#3b7bd1']]) { ctx.beginPath(); ctx.moveTo(hx + dx, hy - 8); ctx.quadraticCurveTo(hx + dx - 8, hy - 16, hx + dx - 6, hy - 26); ctx.lineWidth = 3; ctx.strokeStyle = C(col); ctx.stroke(); }
      break;
    }
    default: break;
  }
}

/* ---------- face ---------- */
function drawFace(ctx, cfg, hx, hy, r, pose) {
  const f = cfg.face || 'hero';
  const eyeY = hy + 1, e1 = hx + 5, e2 = hx + 13;
  const blink = (pose.t * 0.9 + (cfg.blinkSeed || 0)) % 4 > 3.88;
  const eyeCol = (cfg.eyes && cfg.eyes.color) || PAL.out;
  const glowEyes = cfg.eyes && cfg.eyes.glow;
  ctx.lineCap = 'round';
  const dot = (x, y, rx, ry, col) => { ell(ctx, x, y, rx, ry, 0); ctx.fillStyle = C(col); ctx.fill(); };
  if (f === 'skull' || f === 'ghoul' || f === 'shadow') {
    if (f === 'skull') { dot(e1, eyeY - 1, 3.8, 4.4, PAL.out); dot(e2, eyeY - 1, 3.4, 4.2, PAL.out); }
    if (f === 'ghoul') { dot(e1, eyeY, 3.6, 3, '#1a1414'); dot(e2, eyeY, 3.2, 2.8, '#1a1414'); }
    const gc = (cfg.eyes && cfg.eyes.color) || '#9fe6ff';
    dot(e1, eyeY - 1, 1.6, 1.6, gc); dot(e2, eyeY - 1, 1.5, 1.5, gc);
    glow(ctx, e1, eyeY - 1, 9, gc, 0.6); glow(ctx, e2, eyeY - 1, 9, gc, 0.6);
    if (f === 'skull') {
      poly(ctx, [hx + 9, hy + 6, hx + 11, hy + 9, hx + 7, hy + 9]); ctx.fillStyle = PAL.out; ctx.fill();
      ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(hx + 2 + i * 3, hy + 11); ctx.lineTo(hx + 2 + i * 3, hy + 15); }
      ctx.moveTo(hx, hy + 13); ctx.lineTo(hx + 16, hy + 13); ctx.lineWidth = 1.3; ctx.strokeStyle = PAL.out; ctx.stroke();
    } else if (f === 'ghoul') {
      ctx.beginPath(); ctx.moveTo(hx + 3, hy + 10);
      for (let i = 0; i < 6; i++) ctx.lineTo(hx + 4 + i * 2.4, hy + 10 + (i % 2 ? 3.5 : 0));
      ctx.lineWidth = 1.6; ctx.strokeStyle = PAL.out; ctx.stroke();
    }
    return;
  }
  if (f === 'goblin') {
    for (const [x, rx] of [[e1 - 1, 3.6], [e2 + 1, 3.3]]) {
      ell(ctx, x, eyeY, rx, 2.8, 0); ctx.fillStyle = C(glowEyes ? '#ffd23c' : '#f2d65c'); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = PAL.out; ctx.stroke();
      ell(ctx, x + 0.8, eyeY, 0.9, 2.3, 0); ctx.fillStyle = PAL.out; ctx.fill();
    }
    if (glowEyes) { glow(ctx, e1, eyeY, 10, '#ffcf3c', 0.4); glow(ctx, e2, eyeY, 10, '#ffcf3c', 0.4); }
    ctx.beginPath(); ctx.moveTo(e1 - 5, eyeY - 6); ctx.lineTo(e1 + 2, eyeY - 3); ctx.moveTo(e2 - 2, eyeY - 3); ctx.lineTo(e2 + 5, eyeY - 6.5);
    ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.out; ctx.stroke();
    ell(ctx, hx + 18, hy + 5, 6, 3.8, 0.3); ink(ctx, shade(cfg.skin, -0.06), 2.2);
    ctx.beginPath(); ctx.moveTo(hx + 2, hy + 11); ctx.quadraticCurveTo(hx + 9, hy + 14, hx + 15, hy + 10); ctx.lineWidth = 2; ctx.strokeStyle = PAL.out; ctx.stroke();
    poly(ctx, [hx + 5, hy + 11.6, hx + 6.5, hy + 15, hx + 8, hy + 12.4]); ctx.fillStyle = '#f2ead8'; ctx.fill();
    poly(ctx, [hx + 11, hy + 12.4, hx + 12.5, hy + 15.5, hx + 14, hy + 11.6]); ctx.fill();
    return;
  }
  if (f === 'masked') {
    rr(ctx, hx - 2, eyeY - 5, r + 3, 9, 3); ink(ctx, '#201a1e', 2);
    dot(e1, eyeY, 1.8, 1.8, '#f2ead8'); dot(e2, eyeY, 1.6, 1.6, '#f2ead8');
  } else if (f === 'old') {
    ctx.beginPath(); ctx.arc(e1, eyeY, 2.6, 0.2, Math.PI - 0.2); ctx.moveTo(e2 + 2.4, eyeY); ctx.arc(e2, eyeY, 2.4, 0.2, Math.PI - 0.2);
    ctx.lineWidth = 1.8; ctx.strokeStyle = PAL.out; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(e2 + 4, eyeY + 4); ctx.lineTo(e2 + 6, eyeY + 2); ctx.moveTo(e1 - 5, eyeY + 4); ctx.lineTo(e1 - 3, eyeY + 6); ctx.lineWidth = 1; ctx.stroke();
  } else {
    const big = f === 'child' || f === 'kind';
    const rx = big ? 2.7 : 2.3, ry = blink ? 0.5 : big ? 3.6 : 3.1;
    dot(e1, eyeY, rx, ry, eyeCol); dot(e2, eyeY, rx * 0.92, ry * 0.95, eyeCol);
    if (!blink) { dot(e1 - 0.8, eyeY - 1.2, 0.9, 0.9, '#ffffff'); dot(e2 - 0.8, eyeY - 1.2, 0.8, 0.8, '#ffffff'); }
    if (glowEyes) { glow(ctx, e1, eyeY, 9, eyeCol, 0.55); glow(ctx, e2, eyeY, 9, eyeCol, 0.55); }
  }
  // brows
  const br = cfg.brows || (f === 'stern' ? 'stern' : f === 'sad' ? 'sad' : 'none');
  if (br !== 'none') {
    ctx.beginPath();
    if (br === 'angry' || br === 'stern') { ctx.moveTo(e1 - 4, eyeY - 6); ctx.lineTo(e1 + 2, eyeY - 4.5); ctx.moveTo(e2 - 2, eyeY - 4.5); ctx.lineTo(e2 + 4, eyeY - 6); }
    else if (br === 'sad') { ctx.moveTo(e1 - 3, eyeY - 4.5); ctx.lineTo(e1 + 2, eyeY - 6.5); ctx.moveTo(e2 - 2, eyeY - 6.5); ctx.lineTo(e2 + 3, eyeY - 4.5); }
    ctx.lineWidth = br === 'stern' ? 2.6 : 2; ctx.strokeStyle = cfg.hair && cfg.hair.color !== '#e6e0d2' ? shade(cfg.hair.color, -0.3) : PAL.out; ctx.stroke();
  }
  // nose
  if (cfg.nose === 'hook') { ctx.beginPath(); ctx.moveTo(hx + 15, hy - 1); ctx.quadraticCurveTo(hx + 23, hy + 6, hx + 16, hy + 8); ctx.lineWidth = 2; ctx.strokeStyle = PAL.out; ctx.stroke(); }
  else if (cfg.nose === 'big') { ell(ctx, hx + 15, hy + 5, 4, 3.4, 0.2); ink(ctx, shade(cfg.skin, -0.08), 2); }
  else if (cfg.nose !== 'none') { ctx.beginPath(); ctx.arc(hx + 14, hy + 5, 1.8, -0.4, 1.6); ctx.lineWidth = 1.4; ctx.strokeStyle = PAL.out; ctx.stroke(); }
  // mouth
  const m = cfg.mouth || (f === 'stern' ? 'flat' : f === 'sad' ? 'frown' : 'smile');
  ctx.beginPath();
  if (pose.state === 'hurt' || pose.state === 'stun') { ell(ctx, hx + 10, hy + 11, 2, 2.6, 0); ctx.fillStyle = PAL.out; ctx.fill(); }
  else if (pose.state === 'attack' || pose.state === 'roar' || pose.shout) { ell(ctx, hx + 10, hy + 11, 3, 2.6, 0); ctx.fillStyle = '#3a1612'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = PAL.out; ctx.stroke(); }
  else {
    if (m === 'smile') { ctx.arc(hx + 10, hy + 8, 3.2, 0.3, Math.PI - 0.3); }
    else if (m === 'frown') { ctx.arc(hx + 10, hy + 13, 3, Math.PI + 0.4, Math.PI * 2 - 0.4); }
    else if (m === 'smirk') { ctx.moveTo(hx + 7, hy + 11); ctx.quadraticCurveTo(hx + 11, hy + 12, hx + 14, hy + 9); }
    else { ctx.moveTo(hx + 7, hy + 11); ctx.lineTo(hx + 13, hy + 11); }
    ctx.lineWidth = 1.7; ctx.strokeStyle = PAL.out; ctx.stroke();
  }
  // beard
  if (cfg.beard) {
    const bc = cfg.beard.color;
    if (cfg.beard.style === 'full') { ctx.beginPath(); ctx.moveTo(hx - 3, hy + 2); ctx.quadraticCurveTo(hx - 2, hy + 22, hx + 9, hy + 22); ctx.quadraticCurveTo(hx + 18, hy + 18, hx + 17, hy + 4); ctx.quadraticCurveTo(hx + 10, hy + 9, hx - 3, hy + 2); ink(ctx, bc); }
    if (cfg.beard.style === 'mustache' || cfg.beard.style === 'full') { ctx.beginPath(); ctx.moveTo(hx + 4, hy + 9); ctx.quadraticCurveTo(hx + 10, hy + 5, hx + 17, hy + 9); ctx.quadraticCurveTo(hx + 20, hy + 12, hx + 22, hy + 9); ctx.quadraticCurveTo(hx + 18, hy + 15, hx + 11, hy + 10); ctx.quadraticCurveTo(hx + 5, hy + 14, hx + 1, hy + 11); ctx.closePath(); ink(ctx, bc, 2); }
    if (cfg.beard.style === 'stubble') { ctx.beginPath(); ctx.arc(hx + 6, hy + 6, 11, 0.2, 1.5); ctx.lineWidth = 4; ctx.strokeStyle = alpha(bc, 0.35); ctx.stroke(); }
  }
  if (cfg.scar) { ctx.beginPath(); ctx.moveTo(hx + 2, hy - 6); ctx.lineTo(hx + 8, hy + 6); ctx.lineWidth = 1.4; ctx.strokeStyle = '#8e3a2e'; ctx.stroke(); }
  if (cfg.blush) { circ(ctx, hx + 15, hy + 6, 2.6); ctx.fillStyle = 'rgba(214,96,84,0.28)'; ctx.fill(); }
}

/* ---------- torso ---------- */
function drawTorso(ctx, cfg, bob, w) {
  const b = cfg.body || { type: 'tunic', color: '#5a4a6e' };
  const col = b.color, y0 = -33 + bob, top = y0;
  const hw = 11 * w;
  switch (b.type) {
    case 'robe': case 'dress': {
      const flare = b.type === 'dress' ? 17 : 15;
      const build = () => { ctx.beginPath(); ctx.moveTo(-hw + 1, top + 2); ctx.quadraticCurveTo(-hw - 1, top - 1, -hw + 4, top - 1); ctx.lineTo(hw - 3, top - 1); ctx.quadraticCurveTo(hw + 1, top - 1, hw - 1, top + 2); ctx.lineTo(flare * w, -2); ctx.quadraticCurveTo(0, 2, -flare * w, -2); ctx.closePath(); };
      band(ctx, build, col, -14, -6, 15, 0.18);
      if (b.trim) { ctx.beginPath(); ctx.moveTo(2, top); ctx.lineTo(4, -1); ctx.lineWidth = 3; ctx.strokeStyle = C(b.trim); ctx.stroke(); }
      if (b.belt !== false) { rr(ctx, -hw + 1, -17 + bob, hw * 2 - 2, 3.6, 1.4); ink(ctx, b.belt || b.trim || shade(col, -0.35), 2); }
      break;
    }
    case 'belly': {
      const build = () => { ell(ctx, 1, -20 + bob, 16 * w, 14, 0); };
      band(ctx, build, col, -10, -10 + bob, 14, 0.2);
      if (b.trim) { ctx.beginPath(); ctx.moveTo(4, -33 + bob); ctx.lineTo(6, -8 + bob); ctx.lineWidth = 2.6; ctx.strokeStyle = C(b.trim); ctx.stroke(); }
      rr(ctx, -14 * w, -12 + bob, 30 * w, 4, 1.6); ink(ctx, b.belt || PAL.leather, 2);
      break;
    }
    case 'bones': {
      ctx.beginPath(); ctx.moveTo(0, -33 + bob); ctx.lineTo(0, -12 + bob); ctx.lineWidth = 5.5; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = C(PAL.bone); ctx.stroke();
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, -28 + i * 4.6 + bob, 9 - i, 3.5, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.lineWidth = 4.6; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 2.3; ctx.strokeStyle = C(PAL.bone); ctx.stroke(); }
      ell(ctx, 0, -12 + bob, 7, 3.5, 0); ink(ctx, PAL.bone, 2);
      if (b.color) { poly(ctx, [-10, -14 + bob, 10, -14 + bob, 8, -4, 3, -8, -2, -3, -6, -8, -9, -4]); ink(ctx, b.color, 2); }
      break;
    }
    default: {
      const build = () => rr(ctx, -hw, top, hw * 2, 22, 6.5);
      band(ctx, build, col, -12, top + 24, 14, 0.2);
      if (b.type === 'armor') {
        ctx.beginPath(); ctx.moveTo(-hw + 3, top + 9); ctx.quadraticCurveTo(0, top + 12, hw - 3, top + 9); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(30,22,18,0.6)'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-3, top + 3); ctx.lineTo(1, top + 5); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke();
        sheen(ctx, 4, top + 6, 14, 8, -0.2, 0.6);
        if (b.color2) { rr(ctx, -4, top + 5, 9, 19, 2); ink(ctx, b.color2, 2); if (b.trim) { circ(ctx, 0.5, top + 12, 2.4); ctx.fillStyle = C(b.trim); ctx.fill(); } }
      }
      if (b.type === 'vest' || b.type === 'coat') {
        ctx.beginPath(); ctx.moveTo(-3, top + 1); ctx.lineTo(2, top + 10); ctx.lineTo(7, top + 1); ctx.fillStyle = C(b.color2 || shade(col, 0.25)); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = PAL.out; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-hw + 2, top + 3); ctx.lineTo(hw - 3, top + 17); ctx.lineWidth = 2.4; ctx.strokeStyle = C(PAL.leather); ctx.stroke();
      }
      if (b.type === 'rags') {
        poly(ctx, [-hw, top + 18, -hw + 4, top + 25, -hw + 8, top + 19, -hw + 12, top + 26, -hw + 16, top + 19, -hw + 19, top + 25, hw, top + 18]); ink(ctx, col, 2.2);
        rr(ctx, -6, top + 6, 6, 5, 1); ink(ctx, shade(col, 0.15), 1.4);
      }
      if (b.trim && b.type !== 'armor') { ctx.beginPath(); ctx.moveTo(-hw + 3, top + 1.5); ctx.quadraticCurveTo(2, top + 5, hw - 3, top + 1.5); ctx.lineWidth = 2.6; ctx.strokeStyle = C(b.trim); ctx.stroke(); }
      if (b.belt !== false && b.type !== 'rags') { rr(ctx, -hw, top + 15, hw * 2, 4, 1.6); ink(ctx, b.belt || PAL.leather, 2); rr(ctx, 1, top + 14.5, 5, 5, 1); ink(ctx, PAL.gold, 1.4); }
      break;
    }
  }
}

/* ---------- humanoid ---------- */
function humanPose(cfg, pose) {
  const t = pose.t || 0, st = pose.state || 'idle', p = pose.p || 0;
  const A = { bob: 0, lean: 0, legF: 0, legB: 0, armF: 0.3, armB: -0.2, crouch: 0, glow: 0, headTilt: 0 };
  const shieldy = cfg.offhand && (cfg.offhand.type === 'shield' || cfg.offhand.type === 'kite' || cfg.offhand.type === 'tome');
  if (shieldy) A.armB = 0.85;
  if (cfg.offhand && cfg.offhand.type === 'lantern') A.armB = 0.45;
  const idleWave = Math.sin(t * TAU * 0.85 + (cfg.blinkSeed || 0));
  switch (st) {
    case 'idle': case 'talk':
      A.bob = idleWave * 0.9; A.armF = 0.3 + idleWave * 0.07; A.armB += -idleWave * 0.05;
      if (st === 'talk') { A.armF = 0.9 + Math.sin(t * 6) * 0.35; A.headTilt = Math.sin(t * 5) * 0.05; }
      if (cfg.weapon && cfg.weapon.type === 'staff') A.armF = 0.55 + idleWave * 0.05;
      if (cfg.weapon && cfg.weapon.type === 'crossbow') A.armF = 0.95 + idleWave * 0.04;
      break;
    case 'walk': case 'run': {
      const sp = st === 'run' ? 3.1 : 2.3, ph = t * TAU * sp;
      A.legF = Math.sin(ph) * (st === 'run' ? 0.85 : 0.62); A.legB = -A.legF;
      A.bob = -Math.abs(Math.sin(ph)) * (st === 'run' ? 3 : 2.2);
      A.armF = 0.3 - Math.sin(ph) * 0.5; if (!shieldy) A.armB = -0.15 + Math.sin(ph) * 0.5;
      A.lean = st === 'run' ? 0.14 : 0.06;
      break;
    }
    case 'attack': {
      const h = pose.hit || 0.45;
      if (p < h * 0.72) { const k = easeOut(p / (h * 0.72)); A.armF = lerp(0.3, -2.55, k); A.lean = -0.1 * k; A.crouch = 2 * k; }
      else if (p < h * 1.18) { const k = (p - h * 0.72) / (h * 0.46); A.armF = lerp(-2.55, 1.65, k * k * (3 - 2 * k)); A.lean = lerp(-0.1, 0.16, k); A.crouch = lerp(2, 0, k); }
      else { const k = (p - h * 1.18) / Math.max(0.01, 1 - h * 1.18); A.armF = lerp(1.65, 0.3, easeOut(k)); A.lean = lerp(0.16, 0, k); }
      A.legF = 0.32; A.legB = -0.28; if (!shieldy) A.armB = -0.55;
      break;
    }
    case 'thrust': {
      const h = pose.hit || 0.4;
      if (p < h) { const k = easeOut(p / h); A.armF = lerp(0.6, -0.4, k); A.lean = -0.06 * k; }
      else if (p < h + 0.15) { const k = (p - h) / 0.15; A.armF = lerp(-0.4, 1.7, k); A.lean = lerp(-0.06, 0.2, k); }
      else { const k = (p - h - 0.15) / (0.85 - h); A.armF = lerp(1.7, 0.5, easeOut(clamp(k, 0, 1))); A.lean = lerp(0.2, 0, clamp(k, 0, 1)); }
      A.legF = 0.4; A.legB = -0.3;
      break;
    }
    case 'cast': case 'channel': {
      const k = st === 'channel' ? 1 : (p < 0.35 ? easeOut(p / 0.35) : p > 0.75 ? 1 - easeOut((p - 0.75) / 0.25) : 1);
      A.armF = lerp(0.4, 2.35, k); A.lean = -0.06 * k; A.glow = k;
      if (st === 'channel') { A.armB = 1.9 + Math.sin(t * 9) * 0.06; A.bob = Math.sin(t * 9) * 0.5; }
      break;
    }
    case 'shoot': {
      const k = p < 0.25 ? easeOut(p / 0.25) : 1;
      A.armF = lerp(0.95, 1.55, k); A.armB = lerp(0.6, 1.45, k);
      if (p > 0.45 && p < 0.65) A.lean = -0.12; // recoil
      break;
    }
    case 'throw': {
      const h = 0.45;
      if (p < h) { const k = easeOut(p / h); A.armF = lerp(0.3, -2.7, k); A.lean = -0.12 * k; }
      else if (p < h + 0.15) { const k = (p - h) / 0.15; A.armF = lerp(-2.7, 1.4, k); A.lean = lerp(-0.12, 0.15, k); }
      else { A.armF = lerp(1.4, 0.3, clamp((p - h - 0.15) / 0.4, 0, 1)); }
      break;
    }
    case 'spin': A.armF = 1.62; A.armB = -1.62; A.bob = -1; A.crouch = 2; break;
    case 'roar': { const k = Math.min(1, p * 4); A.armF = lerp(0.3, 2.7, k); A.armB = lerp(-0.2, -2.7, k); A.lean = -0.18 * k; A.bob = Math.sin(t * 30) * 0.8 * k; break; }
    case 'hurt': A.lean = -0.24 * (1 - p); A.armF = -0.7; A.armB = -0.9; A.headTilt = -0.1 * (1 - p); break;
    case 'stun': A.lean = Math.sin(t * 7) * 0.09; A.armF = 0.1; A.armB = -0.1; A.headTilt = Math.sin(t * 7) * 0.1; break;
    case 'kneel': A.crouch = 7; A.legF = 1.25; A.legB = -0.25; A.armF = 0.2; A.headTilt = 0.2; A.lean = 0.08; break;
    case 'point': A.armF = 1.75 + Math.sin(t * 3) * 0.05; A.bob = idleWave * 0.8; break;
    case 'cheer': A.armF = 2.75 + Math.sin(t * 8) * 0.15; A.armB = -2.6 - Math.sin(t * 8) * 0.15; A.bob = -Math.abs(Math.sin(t * 8)) * 3; break;
    case 'sit': A.crouch = 9; A.legF = 1.5; A.legB = 1.3; A.armF = 0.5; A.bob = idleWave * 0.6; break;
    case 'cower': A.crouch = 5; A.armF = 2.4; A.armB = 2.2; A.lean = -0.1; A.headTilt = 0.15; A.bob = Math.sin(t * 20) * 0.5; break;
    case 'dead': A.armF = -0.6; A.armB = -1.2; break;
    default: break;
  }
  return A;
}

function drawHumanoid(ctx, x, y, cfg, pose) {
  const s = (cfg.scale || 1) * (pose.ds || 1);
  const face = pose.facing < 0 ? -1 : 1;
  const A = humanPose(cfg, pose);
  const t = pose.t || 0;
  const w = cfg.wide || 1;
  const prevLine = LINE;
  LINE = 3 / Math.max(0.6, Math.sqrt(s)) * Math.min(1.25, Math.max(0.85, s));
  ctx.save();
  ctx.translate(x, y);
  if (!pose.noShadow) shadowBlob(ctx, 0, 0, 17 * s * w, (pose.alpha == null ? 1 : pose.alpha) * 0.32);
  if (pose.alpha != null && pose.alpha < 1) ctx.globalAlpha *= Math.max(0, pose.alpha);
  ctx.scale(s * face, s);
  if (pose.dead) { ctx.translate(-4, 0); ctx.rotate(-easeOut(Math.min(1, pose.dead)) * 1.45); ctx.translate(4, 0); }
  if (pose.lift) ctx.translate(0, -pose.lift);
  ctx.rotate(A.lean + (cfg.hunch || 0) * 0.25 + (pose.lean || 0));
  setTint(pose.tintC, pose.tintA);
  if (pose.flash > 0) setTint('#ffffff', Math.min(0.92, pose.flash));
  const bob = A.bob + A.crouch;
  const hx = 1, hy = -47 + bob + (cfg.hunch ? 6 : 0);
  const hr = cfg.headR || 17;
  const sway = clamp(-(pose.vx || 0) / 260, -0.6, 0.6) + Math.sin(t * 2.1) * 0.06;
  const skin = cfg.skin || SKINS[0];
  const bones = cfg.body && cfg.body.type === 'bones';
  const limb = bones ? PAL.bone : null;
  const legLen = 12;
  const hideLegs = cfg.body && (cfg.body.type === 'robe' || cfg.body.type === 'dress');
  const armL = 12 * (cfg.armLen || 1);
  const sleeve = cfg.arms || (cfg.body && cfg.body.color) || '#5a4a6e';
  const hand = cfg.gauntlets ? PAL.steel : skin;

  // cape
  if (cfg.cape) {
    ctx.beginPath(); ctx.moveTo(-7, -31 + bob); ctx.lineTo(6, -31 + bob);
    ctx.quadraticCurveTo(-4 + sway * 8, -16, -9 - sway * 26, -1 + Math.abs(sway) * 2);
    ctx.quadraticCurveTo(-18 - sway * 24, -4, -20 - sway * 30, -8 + Math.sin(t * 3) * 1.5);
    ctx.quadraticCurveTo(-14, -22 + bob, -7, -31 + bob); ctx.closePath(); ink(ctx, cfg.cape);
  }
  // hat back layers & long hair
  if (cfg.hat) drawHat(ctx, cfg.hat, hx, hy, hr, t, 'back');
  const hatHidesHair = cfg.hat && ['helm', 'greathelm', 'hood', 'cowl', 'pot', 'veil', 'shamanskull'].includes(cfg.hat.type);
  if (!hatHidesHair || (cfg.hair && cfg.hair.style === 'long')) hairBack(ctx, cfg, hx, hy, t, sway);
  // back arm
  const shB = [-5, -29 + bob], shF = [5, -29 + bob];
  const hB = [shB[0] + Math.sin(A.armB) * armL, shB[1] + Math.cos(A.armB) * armL];
  const drawArm = (sh, hp, back) => {
    cap(ctx, sh[0], sh[1], hp[0], hp[1], bones ? 2.3 : 4.3); ink(ctx, back ? shade(limb || sleeve, -0.15) : (limb || sleeve));
    circ(ctx, hp[0], hp[1], bones ? 3.2 : 4.6); ink(ctx, back ? shade(bones ? PAL.bone : hand, -0.12) : (bones ? PAL.bone : hand));
    if (cfg.claws) { ctx.beginPath(); for (let i = -1; i <= 1; i++) { ctx.moveTo(hp[0] + 2, hp[1] + i * 2.4); ctx.lineTo(hp[0] + 8, hp[1] + i * 3.4 + 2); } ctx.lineWidth = 1.6; ctx.strokeStyle = '#e6dfcc'; ctx.stroke(); }
  };
  drawArm(shB, hB, true);
  // back-hand dagger
  if (cfg.weapon && cfg.weapon.type === 'daggers') { ctx.save(); ctx.translate(hB[0], hB[1]); ctx.rotate(A.armB + 1.3); drawWeapon(ctx, cfg.weapon, 0); ctx.restore(); }
  // legs
  const leg = (lx, ang, back) => {
    const kx = lx + Math.sin(ang) * legLen, ky = -12 + bob * 0.4 + Math.cos(ang) * legLen - A.crouch * 0.4;
    const top = -12 + bob * 0.6;
    if (!hideLegs || Math.abs(ang) > 0.9) { cap(ctx, lx, top, kx, Math.min(ky, -2 + A.crouch * 0.1), bones ? 2.2 : 4.6); ink(ctx, back ? shade(limb || cfg.legs || '#3b3340', -0.15) : (limb || cfg.legs || '#3b3340')); }
    ell(ctx, kx + 2.2, Math.min(ky, -1) + 1.5, bones ? 3.6 : 5.4, bones ? 2.2 : 3.4, 0); ink(ctx, back ? shade(bones ? PAL.bone : (cfg.boots || '#2e2220'), -0.15) : (bones ? PAL.bone : (cfg.boots || '#2e2220')));
  };
  leg(-3, A.legB, true);
  leg(3.5, A.legF, false);
  // torso
  drawTorso(ctx, cfg, bob, w);
  if (cfg.body && cfg.body.type === 'armor') { for (const sx of [-9, 9]) { const px2 = sx * w, py2 = -31 + bob; band(ctx, () => circ(ctx, px2, py2, 6.2), cfg.body.pauldron || PAL.steel, px2 - 3, py2 + 4, 6, 0.2); sheen(ctx, px2 + 1.5, py2 - 2.5, 6, 4, 0, 0.8); } }
  if (cfg.body && cfg.body.type === 'coat' && cfg.body.tails !== false) { poly(ctx, [-11, -16 + bob, -16 - sway * 6, -2, -6, -6]); ink(ctx, cfg.body.color, 2.4); }
  // offhand
  if (cfg.offhand && cfg.offhand.type !== 'lantern') { ctx.save(); ctx.translate(hB[0] + 3, hB[1] - 1); drawOffhand(ctx, cfg.offhand, t); ctx.restore(); }
  // head
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(A.headTilt); ctx.translate(-hx, -hy);
  if (cfg.ears === 'goblin') { poly(ctx, [hx - 12, hy - 3, hx - 30, hy - 13 + Math.sin(t * 3) * 1.5, hx - 13, hy + 6]); ink(ctx, shade(skin, -0.12)); }
  if (bones) {
    band(ctx, () => { ctx.beginPath(); ctx.arc(hx, hy, hr - 1, Math.PI * 0.7, Math.PI * 2.3); ctx.lineTo(hx + 12, hy + 15); ctx.lineTo(hx - 4, hy + 15); ctx.closePath(); }, PAL.bone, hx - 10, hy + 12, hr, 0.15);
  } else {
    band(ctx, () => circ(ctx, hx, hy, hr), skin, hx - 9, hy + 11, hr * 0.95, 0.16);
  }
  if (cfg.ears === 'goblin') { poly(ctx, [hx + 8, hy - 7, hx + 25, hy - 16 + Math.sin(t * 3 + 1) * 1.5, hx + 12, hy + 3]); ink(ctx, skin); }
  else if (cfg.ears !== 'none' && !hatHidesHair && !bones) { ell(ctx, hx - 9, hy + 2, 3.4, 4.6, 0); ink(ctx, shade(skin, -0.05), 2); }
  if (cfg.wrinkles) { ctx.beginPath(); ctx.moveTo(hx + 3, hy - 9); ctx.lineTo(hx + 12, hy - 9.5); ctx.moveTo(hx + 4, hy - 6); ctx.lineTo(hx + 11, hy - 6.5); ctx.lineWidth = 0.9; ctx.strokeStyle = 'rgba(30,22,18,0.5)'; ctx.stroke(); }
  drawFace(ctx, cfg, hx, hy, hr, pose);
  if (!hatHidesHair) hairFront(ctx, cfg, hx, hy, hr);
  if (cfg.hat) drawHat(ctx, cfg.hat, hx, hy, hr, t, 'front');
  ctx.restore();
  // front arm + weapon
  const hF = [shF[0] + Math.sin(A.armF) * armL, shF[1] + Math.cos(A.armF) * armL];
  if (cfg.offhand && cfg.offhand.type === 'lantern') { ctx.save(); ctx.translate(hB[0], hB[1]); drawOffhand(ctx, cfg.offhand, t); ctx.restore(); }
  pose._tip = null;
  if (cfg.weapon) {
    const wt = cfg.weapon.type;
    let wr;
    if (wt === 'staff' || wt === 'broom' || wt === 'shovel' || wt === 'scythe') wr = A.armF * 0.55 - 0.05;
    else if (wt === 'daggers' || wt === 'knife') wr = A.armF + 1.35;
    else if (wt === 'spear') wr = A.armF + 1.45;
    else if (wt === 'crossbow') wr = A.armF;
    else if (wt === 'sling') wr = pose.state === 'attack' ? t * 22 : A.armF + 3.1;
    else if (wt === 'cards' || wt === 'candle' || wt === 'mirror') wr = A.armF + 2.6;
    else wr = A.armF + 0.62;
    ctx.save(); ctx.translate(hF[0], hF[1]); ctx.rotate(wr);
    drawWeapon(ctx, cfg.weapon, A.glow);
    const tip = WEAPON_TIP[wt];
    if (tip && pose.wantTip) { const m = ctx.getTransform(); pose._tip = [m.a * tip[0] + m.c * tip[1] + m.e, m.b * tip[0] + m.d * tip[1] + m.f]; }
    ctx.restore();
  }
  drawArm(shF, hF, false);
  setTint(null, 0);
  ctx.restore();
  LINE = prevLine;
  return pose;
}

/* ---------- monsters ---------- */
function drawInkspawn(ctx, x, y, cfg, pose) {
  const s = (cfg.scale || 1) * (pose.ds || 1), t = pose.t || 0, face = pose.facing < 0 ? -1 : 1;
  const big = cfg.big;
  const hop = pose.hop || 0;
  const air = Math.sin(hop * Math.PI);
  const sq = pose.state === 'attack' ? 1 + Math.sin(pose.p * Math.PI) * 0.25 : 1 + (hop > 0 ? (air > 0.2 ? -0.12 : 0.14) : Math.sin(t * 3.4) * 0.05);
  ctx.save(); ctx.translate(x, y);
  shadowBlob(ctx, 0, 0, (big ? 30 : 19) * s * (1 - air * 0.3), (pose.alpha == null ? 1 : pose.alpha) * 0.35);
  if (pose.alpha != null) ctx.globalAlpha *= Math.max(0, pose.alpha);
  ctx.translate(0, -air * (big ? 16 : 22) * s);
  ctx.scale(s * face / sq, s * sq);
  if (pose.dead) ctx.scale(1 + pose.dead * 0.6, 1 - pose.dead * 0.8);
  setTint(pose.tintC, pose.tintA); if (pose.flash > 0) setTint('#ffffff', Math.min(0.9, pose.flash));
  const W = big ? 30 : 19, H = big ? 36 : 24;
  const wob = (i) => Math.sin(t * 4 + i * 1.7) * (big ? 2.4 : 1.6);
  const build = () => {
    ctx.beginPath(); ctx.moveTo(-W, 0);
    ctx.bezierCurveTo(-W - 3, -H * 0.55 + wob(1), -W * 0.6, -H + wob(2), 0, -H + wob(3));
    ctx.bezierCurveTo(W * 0.7, -H + wob(4), W + 3, -H * 0.5 + wob(5), W, 0);
    ctx.quadraticCurveTo(W * 0.6, 3, 0, 2); ctx.quadraticCurveTo(-W * 0.6, 3, -W, 0); ctx.closePath();
  };
  LINE = 3;
  band(ctx, build, cfg.color || PAL.ink, -W * 0.5, H * 0.1, W * 0.9, 0.25);
  ell(ctx, -W * 0.3, -H * 0.72, W * 0.28, H * 0.12, -0.4); ctx.fillStyle = alpha(PAL.inkHi, 0.85); ctx.fill();
  // eyes - several, glowing
  const ec = cfg.eye || '#e8f0ff';
  const eyes = big ? [[2, -H * 0.62, 3.2], [12, -H * 0.66, 3.6], [-8, -H * 0.55, 2.2], [20, -H * 0.45, 2]] : [[3, -H * 0.62, 2.6], [11, -H * 0.62, 2.4]];
  for (const [ex, ey, er] of eyes) { circ(ctx, ex, ey, er); ctx.fillStyle = C(ec); ctx.fill(); glow(ctx, ex, ey, er * 4, '#9fb4ff', 0.35); }
  // maw
  const open = pose.state === 'attack' ? Math.sin(pose.p * Math.PI) : 0.25 + Math.sin(t * 2) * 0.1;
  const my = -H * 0.32, mw = big ? 16 : 10;
  ctx.beginPath(); ctx.moveTo(-mw * 0.4, my); ctx.quadraticCurveTo(mw * 0.6, my + 9 * open + 2, mw * 1.6, my - 1); ctx.quadraticCurveTo(mw * 0.6, my + 1, -mw * 0.4, my); ctx.closePath();
  ctx.fillStyle = '#05060f'; ctx.fill();
  ctx.beginPath(); for (let i = 0; i < (big ? 6 : 4); i++) { const tx = -mw * 0.2 + i * (mw * 1.7) / (big ? 6 : 4); ctx.moveTo(tx, my + 0.5); ctx.lineTo(tx + 1.6, my + 3.5 + open * 2); ctx.lineTo(tx + 3.2, my + 0.5); }
  ctx.fillStyle = C('#e9e4d6'); ctx.fill();
  // drips
  for (let i = 0; i < (big ? 3 : 2); i++) { const dx = -W * 0.5 + i * W * 0.55, dl = 3 + ((t * 2 + i * 0.7) % 1) * 6; ell(ctx, dx, 1 + dl * 0.5, 1.8, dl * 0.5, 0); ctx.fillStyle = C(cfg.color || PAL.ink); ctx.fill(); }
  setTint(null, 0);
  ctx.restore();
}

function drawRat(ctx, x, y, cfg, pose) {
  const s = (cfg.scale || 1) * (pose.ds || 1), t = pose.t || 0, face = pose.facing < 0 ? -1 : 1;
  const run = pose.state === 'walk' || pose.state === 'run';
  ctx.save(); ctx.translate(x, y);
  shadowBlob(ctx, 0, 0, 14 * s, (pose.alpha == null ? 1 : pose.alpha) * 0.3);
  if (pose.alpha != null) ctx.globalAlpha *= Math.max(0, pose.alpha);
  ctx.scale(s * face, s);
  if (pose.dead) { ctx.rotate(Math.PI * Math.min(1, pose.dead)); ctx.translate(0, 8 * pose.dead); }
  setTint(pose.tintC, pose.tintA); if (pose.flash > 0) setTint('#ffffff', Math.min(0.9, pose.flash));
  LINE = 2.6;
  const bob = run ? -Math.abs(Math.sin(t * 22)) * 2.5 : Math.sin(t * 5) * 0.5;
  const lunge = pose.state === 'attack' ? Math.sin(pose.p * Math.PI) * 6 : 0;
  const col = cfg.color || '#2a2638';
  ctx.beginPath(); ctx.moveTo(-14, -6 + bob);
  ctx.bezierCurveTo(-30, -6 + Math.sin(t * 9) * 4, -34, -16 + Math.sin(t * 7) * 3, -40, -10 + Math.sin(t * 8) * 4);
  ctx.lineWidth = 4.6; ctx.strokeStyle = PAL.out; ctx.stroke(); ctx.lineWidth = 2.4; ctx.strokeStyle = C('#4a3d48'); ctx.stroke();
  for (let i = 0; i < 4; i++) { const lx = -8 + i * 5.5, ph = t * 22 + i * 1.6; ctx.beginPath(); ctx.moveTo(lx, -4 + bob); ctx.lineTo(lx + (run ? Math.sin(ph) * 4 : 0), 0); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.out; ctx.stroke(); }
  band(ctx, () => ell(ctx, -2 + lunge * 0.3, -9 + bob, 15, 8.5, -0.05), col, -6, -2 + bob, 11, 0.25);
  poly(ctx, [8 + lunge, -15 + bob, 22 + lunge, -7 + bob, 9 + lunge, -3 + bob]); ink(ctx, col);
  circ(ctx, 22 + lunge, -7 + bob, 2); ctx.fillStyle = C('#c96b7c'); ctx.fill();
  circ(ctx, 7 + lunge, -15 + bob, 4.5); ink(ctx, shade(col, 0.1), 2.2);
  circ(ctx, 14 + lunge, -10 + bob, 1.7); ctx.fillStyle = '#ff5a4a'; ctx.fill(); glow(ctx, 14 + lunge, -10 + bob, 8, '#ff3a2a', 0.5);
  if (pose.state === 'attack') { poly(ctx, [17 + lunge, -5 + bob, 18.5 + lunge, -1 + bob, 20 + lunge, -5 + bob]); ctx.fillStyle = '#efe8d8'; ctx.fill(); }
  setTint(null, 0);
  ctx.restore();
}

function drawWisp(ctx, x, y, cfg, pose) {
  const s = (cfg.scale || 1) * (pose.ds || 1), t = pose.t || 0, face = pose.facing < 0 ? -1 : 1;
  const fl = 34 + Math.sin(t * 2.3) * 5;
  ctx.save(); ctx.translate(x, y);
  shadowBlob(ctx, 0, 0, 12 * s, 0.18 * (pose.alpha == null ? 1 : pose.alpha));
  const a = pose.alpha == null ? 1 : pose.alpha;
  ctx.globalAlpha *= Math.max(0, a) * (0.85 + Math.sin(t * 6) * 0.1);
  ctx.translate(0, -fl * s);
  ctx.scale(s * face, s);
  if (pose.dead) ctx.scale(1 + pose.dead, 1 + pose.dead);
  const col = cfg.color || '#8fe0ff';
  glow(ctx, 0, 0, 46, col, 0.5);
  ctx.beginPath(); ctx.moveTo(-12, 0);
  ctx.bezierCurveTo(-14, -16, 14, -16, 12, 0);
  ctx.bezierCurveTo(10, 10, 4, 10 + Math.sin(t * 5) * 3, -2, 22 + Math.sin(t * 4) * 4);
  ctx.bezierCurveTo(-6, 12, -10, 8, -12, 0); ctx.closePath();
  ctx.fillStyle = alpha('#d8f6ff', 0.82); ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = alpha('#1d3a52', 0.9); ctx.stroke();
  circ(ctx, -2, -4, 2.8); ctx.fillStyle = '#0d1a2a'; ctx.fill(); circ(ctx, 6, -4, 2.6); ctx.fill();
  ell(ctx, 2, 4, 2.2, 3.2 + Math.sin(t * 3) * 1, 0); ctx.fill();
  if (pose.flash > 0) { ctx.globalCompositeOperation = 'lighter'; circ(ctx, 0, 0, 14); ctx.fillStyle = `rgba(255,255,255,${pose.flash * 0.6})`; ctx.fill(); }
  ctx.restore();
}

function drawTassel(ctx, x, y, s, t, opts) {
  opts = opts || {};
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 3 * s); ctx.scale(s, s);
  const L = 56, Wd = 13;
  const pts = [];
  for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push([Math.sin(t * 2.6 + k * 4) * 6 * k + Math.sin(t * 1.3) * 2, -L / 2 + k * L]); }
  ctx.beginPath(); ctx.moveTo(pts[0][0] - Wd / 2, pts[0][1]);
  for (const p of pts) ctx.lineTo(p[0] - Wd / 2, p[1]);
  const e = pts[pts.length - 1];
  ctx.lineTo(e[0], e[1] - 6); ctx.lineTo(e[0] + Wd / 2, e[1]);
  for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0] + Wd / 2, pts[i][1]);
  ctx.closePath();
  LINE = 2.6; ink(ctx, opts.color || '#a3241c');
  ctx.beginPath(); for (let i = 1; i < pts.length; i += 2) { ctx.moveTo(pts[i][0] - Wd / 2 + 2, pts[i][1]); ctx.lineTo(pts[i][0] + Wd / 2 - 2, pts[i][1] + 2); }
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,200,180,0.3)'; ctx.stroke();
  const ex = pts[2][0], ey = pts[2][1];
  for (const dx of [-3, 3]) { ell(ctx, ex + dx, ey, 2.6, 3.4, 0); ctx.fillStyle = '#f6efe0'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = PAL.out; ctx.stroke(); circ(ctx, ex + dx + 0.8, ey + 0.6, 1.3); ctx.fillStyle = PAL.out; ctx.fill(); }
  ctx.beginPath(); ctx.arc(ex, ey + 6, 2.4, 0.2, Math.PI - 0.2); ctx.lineWidth = 1.3; ctx.strokeStyle = PAL.out; ctx.stroke();
  // golden tassel at the top knot
  const k0 = pts[0];
  circ(ctx, k0[0], k0[1] - 3, 4); ink(ctx, PAL.gold, 2);
  ctx.restore();
}

function drawStunStars(ctx, x, y, t, s) {
  for (let i = 0; i < 3; i++) {
    const a = t * 5 + (i * TAU) / 3;
    const sx = x + Math.cos(a) * 14 * s, sy = y + Math.sin(a) * 4 * s;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 4);
    poly(ctx, [0, -4, 1.2, -1.2, 4, 0, 1.2, 1.2, 0, 4, -1.2, 1.2, -4, 0, -1.2, -1.2]);
    ctx.fillStyle = '#ffe27a'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = PAL.out; ctx.stroke();
    ctx.restore();
  }
}

/* registry: draw any actor kind */
function drawActor(ctx, x, y, cfg, pose) {
  switch (cfg.rig) {
    case 'inkspawn': return drawInkspawn(ctx, x, y, cfg, pose);
    case 'rat': return drawRat(ctx, x, y, cfg, pose);
    case 'wisp': return drawWisp(ctx, x, y, cfg, pose);
    default: return drawHumanoid(ctx, x, y, cfg, pose);
  }
}
