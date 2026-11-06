// Made with paprika3d · https://paprika3d.com
// Photo Finish Fiasco: QWOP horse racing. Four Rapier ragdoll horses, one key per leg.
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { sfx, tex } from './fx.js';
import { createWorld, Horse, DT, FINISH_X, STAND_H } from './physics.js';
import { buildHorseView, buildEnvironment, COLORS, COATS } from './view.js';

await RAPIER.init();

// ---------- deterministic randomness ----------
let seed = 12345;
const rng = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + (b - a) * rng();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = (id) => document.getElementById(id);

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 900);
scene.add(new THREE.HemisphereLight(0xcfe6ff, 0xa87648, 1.25));
const sun = new THREE.DirectionalLight(0xfff0d8, 2.1);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 22, bottom: -12, near: 1, far: 100 });
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
const env = buildEnvironment(scene, tex, rng);
const clouds = new THREE.Group(); clouds.name = 'clouds';
{ const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  for (let i = 0; i < 14; i++) { const c = new THREE.Group(); const n = 4 + (i % 3);
    for (let k = 0; k < n; k++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + (k % 3) * 1.4, 1), cm); b.position.set(k * 4.2 - n * 2, (k % 2) * 1.2, (k % 3) * 1.5); b.scale.y = 0.6; c.add(b); }
    c.position.set(-60 + i * 14, 34 + (i % 4) * 6, -120 - (i % 3) * 25); clouds.add(c); }
  scene.add(clouds); }

// ---------- physics + horses ----------
const world = createWorld(RAPIER);
const LANES = [-1.5, -0.5, 0.5, 1.5], STAGGER = [0, 0.7, 1.4, 2.1];   // a visual stagger so the field reads as four horses, not one pile
const horses = [0, 1, 2, 3].map((i) => new Horse(RAPIER, world, i, LANES[i], 0));
const views = [];         // per horse: visual groups
const roles = [];         // per horse: { name, color, human, ai }
const NAMES_AI = ['Sir Trips-a-Lot', 'Hoof Hearted', 'Dusty Rhodes', 'Neigh-poleon'];
const KEYS = { 1: [['KeyQ', 'KeyW', 'KeyO', 'KeyP']], 2: [['KeyQ', 'KeyW', 'KeyE', 'KeyR'], ['KeyU', 'KeyI', 'KeyO', 'KeyP']] };
const KEYLABEL = (c) => c.replace('Key', '').replace('Digit', '');
const LEGNAME = ['FL', 'FR', 'BL', 'BR'];
const held = new Set();
let mode = 1;

// ---------- AI ----------
class AI {
  constructor(skill) { this.skill = skill; this.phase = rr(0, 1); this.base = rr(0.57, 0.65) / skill; this.t = 0; this.delay = rr(0.05, 0.5); this.next = rr(7, 12); this.m = null; this.wob = rr(0, 6); this.chaos = rr(0.85, 1.25); }
  update(h, dt, lead) {
    this.t += dt; this.wob += dt;
    const px = h.pos().x; let band = 1;
    if (px > 22) { if (this.m) this.m = null; this.next = 99; const gapL = (AI.leadX || 0) - px; if (gapL > 0.5) band = 1 - clamp((gapL - 0.5) * (px > 38 ? 0.3 : 0.15), 0, px > 38 ? 0.78 : 0.7); }
    if (this.t < this.delay) { for (let i = 0; i < 4; i++) h.setHeld(i, false); return; }
    const per = band * this.base * (1 + 0.14 * Math.sin(this.wob * 1.7) + 0.08 * Math.sin(this.wob * 4.1)) * (1 + clamp(lead * 0.07, -0.35, 0.5)) * (h.pos().x > 40 ? 1 - clamp(lead * 0.06, -0.3, 0.3) : 1);
    this.phase = (this.phase + dt / per) % 1;
    const off = [0, 0.5, 0.5, 0], duty = 0.58;
    const flags = off.map((o) => ((this.phase + o) % 1) < duty);
    this.next -= dt * (lead > 4 ? 1.8 : lead < -5 ? 0.4 : 1) * this.chaos;
    if (!this.m && this.next <= 0 && h.state === 'run' && h.guard <= 0) {
      const r = rng(), kinds = r < 0.25 ? 'freeze' : r < 0.45 ? 'limp' : r < 0.6 ? 'stall' : r < 0.85 ? 'weave' : 'mash';
      this.m = { kind: kinds, t: kinds === 'freeze' ? rr(0.5, 0.9) : kinds === 'stall' ? rr(0.5, 0.9) : rr(1, 2), leg: Math.floor(rng() * 4), dir: rng() < 0.5 ? -1 : 1 };
      this.next = rr(7, 12);
    }
    if (this.m) {
      const m = this.m; m.t -= dt;
      if (m.kind === 'freeze') flags.fill(true);
      else if (m.kind === 'stall') flags.fill(false);
      else if (m.kind === 'limp') flags[m.leg] = true;
      else if (m.kind === 'mash') for (let i = 0; i < 4; i++) flags[i] = rng() < 0.5;
      else if (m.kind === 'weave') h.laneZ = clamp(h.laneZ + m.dir * dt * 0.9, -2.0, 2.0);
      if (m.t <= 0) this.m = null;
    } else if (h.laneZ !== h.homeZ) h.laneZ += clamp(h.homeZ - h.laneZ, -dt * 0.5, dt * 0.5);
    for (let i = 0; i < 4; i++) h.setHeld(i, flags[i]);
  }
}

function assignRoles() {
  for (const v of views) for (const g of v) scene.remove(g);
  views.length = 0; roles.length = 0;
  const spec = mode === 1
    ? [{ ai: 0, color: 'red' }, { ai: 1, color: 'green' }, { human: 0, color: 'blue', name: 'YOU' }, { ai: 2, color: 'yellow' }]
    : [{ ai: 0, color: 'red' }, { human: 0, color: 'blue', name: 'P1' }, { human: 1, color: 'green', name: 'P2' }, { ai: 2, color: 'yellow' }];
  spec.forEach((s, i) => {
    const r = { color: COLORS[s.color], colorName: s.color, human: s.human ?? -1, name: s.name || NAMES_AI[s.ai], ai: s.human === undefined ? new AI(rr(0.93, 1.03)) : null };
    roles.push(r);
    const groups = buildHorseView(r.color, 0, COATS[i]);
    groups.forEach((g, k) => { g.name = (r.human === 0 ? 'player' : 'horse' + i) + (k === 0 ? '' : '-' + k); scene.add(g); });
    views.push(groups);
    horses[i].homeZ = LANES[i];
  });
  buildHud();
}

// ---------- dust chunks ----------
const NDUST = 420;
const dustM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), NDUST);
dustM.castShadow = false; dustM.frustumCulled = false; dustM.name = 'dust'; scene.add(dustM);
const dust = Array.from({ length: NDUST }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 1, r: new THREE.Euler() }));
{ const c = new THREE.Color(); dust.forEach((d, i) => dustM.setColorAt(i, c.set([0xc9a077, 0xb48a5e, 0xd8b88c, 0x9d7048][i % 4]))); }
let dustHead = 0;
function emitDust(x, y, z, n, speed = 2.5, up = 2.5, big = 1) {
  for (let k = 0; k < n; k++) {
    const d = dust[dustHead++ % NDUST];
    d.life = rr(0.6, 1.3); d.p.set(x + rr(-0.15, 0.15), y + 0.05, z + rr(-0.15, 0.15));
    d.v.set(rr(-1, 1) * speed + 0.6, rr(0.3, 1) * up, rr(-1, 1) * speed * 0.7); d.s = rr(0.5, 1.4) * big; d.r.set(rr(0, 6), rr(0, 6), rr(0, 6));
  }
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _e = new THREE.Euler();
function updateDust(dt) {
  for (let i = 0; i < NDUST; i++) {
    const d = dust[i];
    if (d.life > 0) {
      d.life -= dt; d.v.y -= 9 * dt; d.p.addScaledVector(d.v, dt);
      if (d.p.y < 0.06) { d.p.y = 0.06; d.v.y *= -0.25; d.v.x *= 0.6; d.v.z *= 0.6; }
      d.r.x += dt * 5; d.r.z += dt * 4;
      const sc = d.s * Math.min(1, d.life * 2.5);
      _q.setFromEuler(d.r); _s.set(sc, sc, sc); _m.compose(d.p, _q, _s);
    } else { _s.set(0, 0, 0); _m.compose(d.p, _q, _s); }
    dustM.setMatrixAt(i, _m);
  }
  dustM.instanceMatrix.needsUpdate = true;
}

// ---------- recorder / replay ----------
const NP = horses[0].parts.length, FRAME = 4 * NP * 7, RING = 300;
const ring = new Float32Array(RING * FRAME); let ringN = 0;
const tmpFrame = new Float32Array(FRAME);
function record() {
  const o = (ringN % RING) * FRAME; let k = o;
  for (const h of horses) for (const p of h.parts) {
    const t = p.body.translation(), q = p.body.rotation();
    ring[k++] = t.x; ring[k++] = t.y; ring[k++] = t.z; ring[k++] = q.x; ring[k++] = q.y; ring[k++] = q.z; ring[k++] = q.w;
  }
  ringN++;
}
const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
function applyFrame(idx) { // idx: fractional absolute frame number
  const i0 = Math.floor(idx), f = idx - i0, a = (i0 % RING) * FRAME, b = (((i0 + 1) < ringN ? i0 + 1 : i0) % RING) * FRAME;
  let k = 0;
  for (let hi = 0; hi < horses.length; hi++) for (let pi = 0; pi < NP; pi++, k += 7) {
    const g = views[hi][pi];
    g.position.set(ring[a + k] + (ring[b + k] - ring[a + k]) * f, ring[a + k + 1] + (ring[b + k + 1] - ring[a + k + 1]) * f, ring[a + k + 2] + (ring[b + k + 2] - ring[a + k + 2]) * f);
    _qa.set(ring[a + k + 3], ring[a + k + 4], ring[a + k + 5], ring[a + k + 6]); _qb.set(ring[b + k + 3], ring[b + k + 4], ring[b + k + 5], ring[b + k + 6]);
    g.quaternion.copy(_qa).slerp(_qb, f);
  }
}
function subjectAt(idx, hi) {
  const i0 = Math.floor(idx), base = (i0 % RING) * FRAME, c = new THREE.Vector3(), m = base + hi * NP * 7;
  let n = 0;
  for (let h = 0; h < horses.length; h++) { const a = base + h * NP * 7; if (h === hi || Math.abs(ring[a] - ring[m]) < 5) { c.x += ring[a]; c.y += ring[a + 1]; c.z += ring[a + 2]; n++; } }
  return c.multiplyScalar(1 / n);
}

// ---------- game state ----------
const S = {
  phase: 'countdown', countdown: 3.2, raceT: 0, finishT: null, firstFinish: null, firstFinishFrame: 0, order: [],
  pending: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, shakeAmp: 0, shake: 0,
  excite: 0, time: 0, camBlend: 0, popups: [], lastPopup: {}, results: null, resultsShown: false, seedRound: 0,
};

function buildHud() {
  const chips = $('chips'); chips.innerHTML = '';
  roles.forEach((r, i) => {
    const d = document.createElement('div'); d.className = 'chip' + (r.human >= 0 ? ' me' : ''); d.id = 'chip' + i;
    d.innerHTML = `<i style="background:#${r.color.toString(16).padStart(6, '0')}"></i><b>${r.name}</b><s>FACE-PLANTS 0</s>`; chips.appendChild(d);
  });
  document.querySelectorAll('#prog em').forEach((e) => e.remove());
  roles.forEach((r, i) => { const e = document.createElement('em'); e.id = 'mk' + i; e.style.background = '#' + r.color.toString(16).padStart(6, '0'); $('prog').appendChild(e); });
  const keys = $('keys'); keys.innerHTML = '';
  (KEYS[mode]).forEach((set, pi) => {
    const kp = document.createElement('div'); kp.className = 'kp';
    kp.innerHTML = `<div>${mode === 2 ? 'PLAYER ' + (pi + 1) : 'YOUR LEGS'}</div><div class="row">${set.map((c, li) => `<div class="cap" id="cap-${pi}-${li}">${KEYLABEL(c)}<small>${LEGNAME[li]}</small></div>`).join('')}</div>`;
    keys.appendChild(kp);
  });
  $('b1').classList.toggle('on', mode === 1); $('b2').classList.toggle('on', mode === 2);
  $('tips').textContent = mode === 1 ? 'Alternate your legs — Q+P then W+O works! · R restart · 2 = two players · Space skips replays'
    : 'P1: Q W E R · P2: U I O P · Enter restarts · 1 = solo · Space skips replays';
}

function resetRace() {
  seed = 12345 + 7919 * (++S.seedRound);
  assignRoles();
  horses.forEach((h, i) => { h.reset(STAGGER[i], LANES[i]); h.guard = 99; h.assist = 1; h.stiff = 1; h.plants = 0; h.finished = false; h.finishT = null; h.speedBefore = 0; h.drive = 0; h.legT = [0, 0, 0, 0]; for (let k = 0; k < 4; k++) h.setHeld(k, false); });
  Object.assign(S, { phase: 'countdown', countdown: 3.2, raceT: 0, finishT: null, firstFinish: null, order: [], pending: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, excite: 0, results: null, resultsShown: false, camBlend: 0 });
  ringN = 0; for (const d of dust) d.life = 0;
  for (const p of S.popups) p.el.remove(); S.popups = [];
  $('results').style.display = 'none'; setReplayUi(false); $('count').textContent = '';
  S.lastCount = 4;
}

// ---------- popups / sound ----------
sfx.define('cheer', { volume: 0.55, frequency: 260, attack: 0.25, sustain: 0.9, release: 0.9, shape: 4, noise: 1.2, tremolo: 0.3, filter: -200 });
sfx.define('gasp', { volume: 0.5, frequency: 520, attack: 0.04, sustain: 0.18, release: 0.3, shape: 4, noise: 0.9, slide: -0.25, filter: -300 });
sfx.define('boing', { volume: 0.5, frequency: 180, shape: 1, sustain: 0.08, release: 0.3, slide: 3.5 });
function popup(text, sub = '', color = '#ffd27a', life = 1.7) {
  const last = S.lastPopup[text] ?? -9; if (S.time - last < 1.4) return; S.lastPopup[text] = S.time;
  while (S.popups.length > 1) S.popups.shift().el.remove();
  const el = document.createElement('div'); el.className = 'pop'; el.style.color = color;
  el.style.setProperty('--r', rr(-6, 6).toFixed(1) + 'deg'); el.style.animation = `pop ${life}s ease-out forwards`;
  el.style.top = (16 + S.popups.length * 16) + 'vh'; el.style.left = '50%';
  el.innerHTML = text + (sub ? `<span>${sub}</span>` : ''); $('popups').appendChild(el); S.popups.push({ el, t: life });
}
const COMMENT = {
  'FACE-PLANT!': ['{n} eats dirt!', '{n} kisses the track!', 'Nose-first for {n}!', '{n} has lost control of their face'],
  'CARTWHEEL!': ['{n} is doing gymnastics!', '10/10 from the judges, {n}!'],
  'DOG SIT!': ['{n} is sitting like a dog!', '{n} thinks this is a picnic'],
  'SPLITS!': ['{n} does the splits!', 'Ouch! {n} is not a gymnast'],
  'BACKFLIP!': ['{n} flips over backwards!', 'Look at {n} go! Upside down!'],
};
const pick = (a) => a[Math.floor(rng() * a.length)];

function onPlant(h, kind) {
  const r = roles[h.idx], p = h.torso.body.translation();
  const sub = (COMMENT[kind] ? pick(COMMENT[kind]) : '{n}').replace('{n}', r.name === 'YOU' ? 'YOU' : r.name);
  if (r.human >= 0 || S.popups.length < 1) popup(kind, sub, '#' + new THREE.Color(r.color).lerp(new THREE.Color(0xffffff), 0.35).getHexString());
  sfx.play('thud', 0.8); sfx.play('gasp', 0.8, 0.03);
  emitDust(p.x, 0.1, p.z, 34, 3.5, 3.4, 1.4);
  S.excite = Math.min(1, S.excite + 0.5);
  S.shake = 0.6; S.shakeAmp = Math.max(S.shakeAmp, 0.12);
  const big = h.speedBefore > 1.6 || kind === 'CARTWHEEL!' || kind === 'BACKFLIP!';
  if (S.phase === 'race' && big && S.raceT > 3 && S.raceT - S.lastReplayAt > 11 && p.x < FINISH_X - 10 && !S.pending && (r.human >= 0 || rng() < 0.7)) {
    S.pending = { at: S.time + 0.9, horse: h.idx }; S.lastReplayAt = S.raceT;
  }
}

// ---------- race logic ----------
const AUTO = { period: 0.32 };
function physStep() {
  for (const h of horses) {
    const r = roles[h.idx];
    if (r.human >= 0 && (S.phase === 'race' || S.phase === 'finishing') && !h.finished) {
      const set = KEYS[mode][r.human]; const ph = Math.floor(S.raceT / AUTO.period) % 2; for (let i = 0; i < 4; i++) { const d = S.auto ? ((i === 0 || i === 3) === (ph === 0)) : held.has(set[i]); if (d && !h.held[i]) h.drive = Math.min(1.2, (h.drive || 0) + 0.2); h.setHeld(i, d); }
      if (S.phase === 'race') { const others = horses.filter((o, j) => roles[j].ai).map((o) => o.pos().x); const avg = others.reduce((a, b) => a + b, 0) / Math.max(1, others.length); h.driveF = (S.auto ? 0.5 : 1) * Math.max(0, 30 + clamp(avg - h.pos().x - 4, 0, 30) * 6 - clamp(h.pos().x - avg - 0.3, 0, 20) * 14); }
    } else if (r.human >= 0) for (let i = 0; i < 4; i++) h.setHeld(i, false);
    if (h.finished || S.phase === 'results') h.guard = 99;
    const ev = h.step(DT);
    if (ev === 'rise') { const p = h.torso.body.translation(); emitDust(p.x, 0.05, p.z, 14, 2, 3, 1.1); sfx.play('boing', 0.5); }
    else if (ev) onPlant(h, ev);
  }
  world.step();
}

function footDust(dt) {
  for (const h of horses) {
    if (h.state !== 'run') continue;
    for (let i = 0; i < 4; i++) {
      const L = h.legs[i], v = L.lo.body.linvel(), f = h.footPos(i);
      h.legT[i] -= dt;
      if (f.y < 0.12 && Math.abs(v.x) > 2.6 && h.legT[i] <= 0) { emitDust(f.x, 0.02, f.z, 2, 1.1, 1.8, 0.8); h.legT[i] = 0.09; }
    }
  }
}

function frontOrder() {
  return horses.map((h) => h).sort((a, b) => {
    if (a.finished && b.finished) return a.finishT - b.finishT;
    if (a.finished) return -1; if (b.finished) return 1;
    return b.headTip().x - a.headTip().x;
  });
}

function updateRace(dt) {
  // AI
  const xs = horses.map((h) => h.pos().x); AI.leadX = Math.max(...xs); const sorted = [...xs].sort((a, b) => b - a), mean = (sorted[0] + sorted[1] + sorted[2]) / 3;
  if (S.phase === 'race' || S.phase === 'finishing') {
    horses.forEach((h, i) => { const r = roles[i]; if (r.ai) { if (h.finished) for (let k = 0; k < 4; k++) h.setHeld(k, false); else r.ai.update(h, dt, xs[i] - mean); } });
  }
  if ((S.phase === 'race' || S.phase === 'finishing') && AI.leadX > 34) { // closing sprint: the best chaser draws level for a photo finish
    let ch = null; horses.forEach((h, i) => { if (roles[i].ai && h.state === 'run' && !h.finished && xs[i] < AI.leadX - 0.2 && xs[i] > 28 && (!ch || xs[i] > xs[ch.idx])) ch = h; });
    if (ch && AI.leadX - xs[ch.idx] < 20) for (const p of ch.parts) { const v = p.body.linvel(); if (v.x < 10.5) p.body.setLinvel({ x: v.x * 1.02 + 0.03, y: v.y, z: v.z }, true); }
  }
  const steps = Math.round(dt / DT);
  for (let s = 0; s < steps; s++) physStep();
  footDust(dt);
  for (const h of horses) { const v = h.torso.body.linvel(); if (h.state === 'run') h.speedBefore = Math.hypot(v.x, v.z); }
  if (S.phase === 'race' || S.phase === 'finishing') {
    S.raceT += dt;
    for (const h of horses) if (!h.finished && h.headTip().x >= FINISH_X) {
      h.finished = true; h.finishT = S.raceT; S.order.push(h.idx);
      if (S.firstFinish === null) {
        S.firstFinish = S.raceT; S.phase = 'finishing'; S.firstFinishFrame = ringN; S.pending = null;
        sfx.play('cheer', 1); sfx.play('powerup', 0.6, 0.1); S.excite = 1; S.flash = 1;
      }
    }
    // pile-up: neighbours who run side by side may take each other out
    if (S.phase === 'race' && S.raceT > 6 && S.raceT - S.lastTangle > 12 && S.tangles < 3) {
      for (let i = 0; i < 3 && S.tangles < 3; i++) {
        const a = horses[i], b = horses[i + 1];
        if (a.state !== 'run' || b.state !== 'run' || a.guard > 0 || b.guard > 0) continue;
        const pa = a.pos(), pb = b.pos();
        if (Math.abs(pa.x - pb.x) < 1.7 && pa.x > 6 && pa.x < FINISH_X - 14 && (roles[i].ai || roles[i + 1].ai) && rng() < 0.012) {
          S.tangles++; S.lastTangle = S.raceT;
          const first = roles[i].ai ? a : b, other = first === a ? b : a;
          first.collapse('FACE-PLANT!'); onPlant(first, 'FACE-PLANT!');
          const dir = Math.sign(other.pos().z - first.pos().z) || 1;
          for (const p of first.parts) p.body.setLinvel({ x: p.body.linvel().x * 0.9, y: p.body.linvel().y, z: dir * 4.2 }, true);
          if (roles[other.idx].ai) { other.collapse('CARTWHEEL!'); onPlant(other, 'CARTWHEEL!'); for (const p of other.parts) p.body.setLinvel({ x: p.body.linvel().x * 0.9, y: p.body.linvel().y + 1.5, z: -dir * 2.6 }, true); }
          popup('PILE-UP!', 'A tangle of legs!', '#ff9a3c', 1.9); sfx.play('cheer', 0.7);
          break;
        }
      }
    }
    if (S.phase === 'finishing') {
      const since = S.raceT - S.firstFinish;
      if (since > 6.5 || horses.every((h) => h.finished || h.state !== 'run' && since > 3.5)) startFinishReplay();
    } else if (S.raceT > 150) startFinishReplay();
  }
}

function setReplayUi(on) { document.body.classList.toggle('replaying', on); $('replay').style.display = on ? 'block' : 'none'; }
function startFinishReplay() {
  if (S.phase === 'replay' || S.phase === 'results') return;
  const order = frontOrder(), w = order[0];
  const gap = order[1] && order[1].finished ? order[1].finishT - w.finishT : 9;
  S.results = { order: order.map((h) => h.idx), gap };
  popup(gap < 1.0 ? 'PHOTO FINISH!' : 'WINNER!', roles[w.idx].name + (gap < 0.5 ? ' by a nose (' + gap.toFixed(2) + 's)!' : ' takes it!'), '#ffd27a', 2.4);
  const start = Math.max(Math.max(0, ringN - RING + 2), (S.firstFinishFrame || ringN - 1) - 54), end = Math.min(ringN - 1, start + 260);
  S.replay = { kind: 'finish', start, end, pos: start, subject: w.idx };
  S.phase = 'replay'; setReplayUi(true); S.flash = 1; sfx.play('cheer', 0.8);
}
function startPlantReplay() {
  const hi = S.pending.horse; S.pending = null;
  const end = ringN - 1, start = Math.max(Math.max(0, ringN - RING + 2), end - 110);
  S.replay = { kind: 'plant', start, end, pos: start, subject: hi, back: S.phase };
  S.prevPhase = S.phase; S.phase = 'replay'; for (const p of S.popups) p.el.remove(); S.popups = []; setReplayUi(true);
}
function endReplay() {
  const rp = S.replay; S.replay = null; setReplayUi(false);
  if (rp.kind === 'finish') { S.phase = 'results'; showResults(); }
  else S.phase = S.prevPhase || 'race';
}

function showResults() {
  const res = S.results || { order: frontOrder().map((h) => h.idx) };
  const worst = horses.reduce((b, h) => (h.plants > horses[b].plants ? h.idx : b), 0); const ord = res.order, maxP = Math.max(...horses.map((h) => h.plants)), minP = Math.min(...horses.map((h) => h.plants));
  const hex = (i) => '#' + roles[i].color.toString(16).padStart(6, '0');
  const pod = [1, 0, 2].filter((k) => ord[k] !== undefined && horses[ord[k]].finished).map((k) => `<div class="p${k + 1}"><i style="background:${hex(ord[k])};width:16px;height:16px;border-radius:50%;border:2px solid #3a2416"></i><span>${roles[ord[k]].name}</span><b>${k + 1}</b></div>`).join('');
  const w = horses[ord[0]], rows = ord.map((i, k) => {
    const h = horses[i], t = h.finished ? h.finishT.toFixed(2) + 's' + (k ? ' (+' + (h.finishT - w.finishT).toFixed(2) + ')' : '') : (h.state === 'run' ? 'still racing · ' : 'DNF · ') + Math.max(0, FINISH_X - h.headTip().x).toFixed(0) + ' m short';
    const aw = (i === worst && maxP > 0 ? '<span class="award">DIRT EATER · MOST FACE-PLANTS</span>' : '') + (h.plants === minP && minP < maxP && h.finished ? '<span class="award g">SMOOTH OPERATOR</span>' : '');
    return `<tr><td class="n">${k + 1}</td><td><i style="background:${hex(i)}"></i>${roles[i].name}${aw}</td><td>${t}</td><td class="n">${h.plants} face-plant${h.plants === 1 ? '' : 's'}</td></tr>`;
  }).join('');
  const photo = res.gap < 1.0 ? `PHOTO FINISH · ${res.gap.toFixed(2)}s` : 'RESULTS';
  $('results').querySelector('.box').innerHTML = `<h1>${roles[ord[0]].name} WINS! <small style="font-size:14px;color:#fff6e0">${photo}</small></h1><div class="pod">${pod}</div><table>${rows}</table><div class="hint">${mode === 1 ? 'Press R' : 'Press Enter'} for another race · 1 / 2 = players</div>`;
  $('results').style.display = 'flex'; S.resultsShown = true;
}

// ---------- camera ----------
const camPos = new THREE.Vector3(-8, 5, 15), camLook = new THREE.Vector3(2, 1, 0);
const tp = new THREE.Vector3(), tl = new THREE.Vector3();
function followTarget() {
  const humans = roles.map((r, i) => r.human >= 0 ? horses[i].pos().x : null).filter((v) => v !== null);
  const hx = humans.reduce((a, b) => a + b, 0) / humans.length;
  const leader = Math.max(...horses.map((h) => h.pos().x));
  let fx = hx + clamp(leader - hx, -4, 14) * 0.3;
  fx = Math.min(fx, FINISH_X + 2);
  const far = Math.abs(leader - hx);
  const asp = Math.min(1, camera.aspect / 1.5);
  const dist = (9.4 + clamp(far * 0.3, 0, 10)) / Math.pow(asp, 0.7);
  return { fx, dist };
}
function updateCamera(dt) {
  let fov = 42;
  if (S.phase === 'replay') {
    const rp = S.replay;
    if (rp.kind === 'finish') {
      const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start);
      tp.set(FINISH_X + 3.4 - prog * 0.8, 2.2, 11.5); tl.set(FINISH_X - 0.2, 1.0, 0); fov = 29 - prog * 4;
    } else {
      const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start), s = subjectAt(rp.pos, rp.subject), a = 0.35 + prog * 1.1;
      tp.set(s.x + Math.sin(a) * 5.5, 1.3 + prog * 1.2, s.z + Math.cos(a) * 5.5); tl.set(s.x, 0.8, s.z); fov = 38;
    }
    camPos.lerp(tp, 1 - Math.exp(-dt * 6)); camLook.lerp(tl, 1 - Math.exp(-dt * 8));
  } else if (S.phase === 'results') {
    tp.set(FINISH_X - 4, 2.6, 12); tl.set(FINISH_X + 2, 1.2, 0);
    camPos.lerp(tp, 1 - Math.exp(-dt * 1.5)); camLook.lerp(tl, 1 - Math.exp(-dt * 2));
  } else {
    const { fx, dist } = followTarget();
    if (S.phase === 'countdown') {
      S.camBlend = Math.min(1, S.camBlend + dt / 3.0); const e = S.camBlend * S.camBlend * (3 - 2 * S.camBlend);
      tp.set(-2.5 + (fx - 0.4 + 2.5) * e, 2.6 + 0.9 * e, 7.2 - (7.2 - dist) * e); tl.set(1.5 + (fx + 1.8 - 1.5) * e, 1.2, 0);
      camPos.copy(tp); camLook.copy(tl);
    } else {
      tp.set(fx - 0.4, 3.5 + (dist - 9.4) * 0.15, dist); tl.set(fx + 1.8, 1.25, 0);
      camPos.lerp(tp, 1 - Math.exp(-dt * 3.5)); camLook.lerp(tl, 1 - Math.exp(-dt * 5));
    }
  }
  camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * 6)); camera.updateProjectionMatrix();
  camera.position.copy(camPos);
  if (S.shake > 0) { S.shake = Math.max(0, S.shake - dt); const a = S.shakeAmp * S.shake; camera.position.x += Math.sin(S.time * 83) * a; camera.position.y += Math.cos(S.time * 71) * a; if (S.shake === 0) S.shakeAmp = 0; }
  camera.lookAt(camLook);
  sun.position.set(camLook.x - 10, 28, 8); sun.target.position.set(camLook.x, 0, -4);
}

// ---------- HUD update ----------
function updateHud() {
  roles.forEach((r, i) => {
    const h = horses[i], chip = $('chip' + i), s = chip.querySelector('s'), txt = 'FACE-PLANTS ' + h.plants + (h.state === 'down' ? ' · OUCH' : '');
    if (s.textContent !== txt) s.textContent = txt;
    $('mk' + i).style.left = (clamp(h.pos().x / FINISH_X, 0, 1) * 100) + '%';
  });
  $('timer').textContent = S.raceT.toFixed(1) + 's';
  KEYS[mode].forEach((set, pi) => set.forEach((c, li) => $(`cap-${pi}-${li}`)?.classList.toggle('dn', held.has(c))));
  const f = $('flash'); if (S.flash > 0) { S.flash = Math.max(0, S.flash - 0.06); f.style.opacity = (S.flash * 0.3).toFixed(2); } else if (f.style.opacity !== '0') f.style.opacity = 0;
}

// ---------- main loop ----------
let last = null;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = last === null ? 1 / 60 : Math.min((now - last) / 1000, 0.05); last = now;
  S.time += dt;
  S.excite = Math.max(0, S.excite - dt * 0.25);
  // fixed 1/60 game ticks keep the replay buffer evenly spaced
  const n = clamp(Math.round(dt * 60), 1, 3);
  for (let i = 0; i < n; i++) tick(1 / 60);
  renderer.render(scene, camera);
}
function tick(dt) {
  if (S.phase === 'countdown') {
    S.countdown -= dt;
    const n = Math.ceil(S.countdown);
    if (n !== S.lastCount && n <= 3) { S.lastCount = n; if (n > 0) { $('count').textContent = n; $('count').style.color = n === 1 ? '#ffd27a' : '#fff6e0'; sfx.play('blip', 0.7); } }
    if (S.countdown <= 0) {
      S.phase = 'race'; $('count').textContent = 'GO!'; $('count').style.color = '#6fe36f'; S.goT = 0.9; sfx.play('powerup', 0.8); sfx.play('cheer', 0.6, 0.1);
      horses.forEach((h) => { h.guard = 1.2; });
    }
    updateRace(dt);
    if (S.phase === 'countdown') for (const h of horses) h.guard = 99;
  } else if (S.phase === 'race' || S.phase === 'finishing') {
    if (S.goT > 0) { S.goT -= dt; if (S.goT <= 0) $('count').textContent = ''; }
    updateRace(dt);
    record();
    if (S.pending && S.time >= S.pending.at && S.phase === 'race') startPlantReplay();
  } else if (S.phase === 'replay') {
    const rp = S.replay; rp.pos += (rp.kind === 'finish' ? 0.6 : 0.25) * dt * 60;
    if (rp.pos >= rp.end) endReplay(); else applyFrame(rp.pos);
  } else if (S.phase === 'results') {
    for (const h of horses) { for (let i = 0; i < 4; i++) h.setHeld(i, false); }
    horses.forEach((h) => { if (roles[h.idx].ai) for (let k = 0; k < 4; k++) h.setHeld(k, false); });
    const steps = Math.round(dt / DT); for (let s = 0; s < steps; s++) physStep();
  }
  if (S.phase !== 'replay') syncViews();
  updateDust(dt); dustM.visible = S.phase !== 'replay' || true;
  env.update(S.time, dt); clouds.position.x = camLook.x * 0.9 + S.time * 0.4;
  env.spectators.update(S.time, S.phase === 'results' ? 0.8 : S.excite);
  // popups lifetimes
  for (let i = S.popups.length - 1; i >= 0; i--) { S.popups[i].t -= dt; if (S.popups[i].t <= 0) { S.popups[i].el.remove(); S.popups.splice(i, 1); } }
  updateCamera(dt); updateHud();
}
function syncViews() {
  horses.forEach((h, hi) => h.parts.forEach((p, pi) => {
    const t = p.body.translation(), q = p.body.rotation(), g = views[hi][pi];
    g.position.set(t.x, t.y, t.z); g.quaternion.set(q.x, q.y, q.z, q.w);
  }));
}

// ---------- input ----------
const normKey = (k) => { if (!k) return ''; if (k === ' ' || k === 'Space') return 'Space'; if (/^Key|^Digit|^Enter|^Escape/.test(k)) return k; if (/^[a-z]$/i.test(k)) return 'Key' + k.toUpperCase(); if (/^[0-9]$/.test(k)) return 'Digit' + k; return k; };
function act({ key, down = true } = {}) {
  const k = normKey(key);
  if (down) {
    if (k === 'Space') { if (S.phase === 'replay') endReplay(); return; }
    if (k === 'Digit2') return setMode(mode === 2 ? 1 : 2);
    if (k === 'Digit1') return setMode(1);
    if ((k === 'KeyR' && (mode === 1 || S.phase === 'results')) || k === 'Enter') return resetRace();
    held.add(k);
  } else held.delete(k);
}
function setMode(m) { mode = m; resetRace(); }
addEventListener('keydown', (e) => { if (e.repeat) return; if (['Space', 'Enter'].includes(e.code)) e.preventDefault(); act({ key: e.code }); });
addEventListener('keyup', (e) => act({ key: e.code, down: false }));
addEventListener('blur', () => held.clear());
$('b1').onclick = (e) => { setMode(1); e.target.blur(); }; $('b2').onclick = (e) => { setMode(2); e.target.blur(); }; $('br').onclick = (e) => { resetRace(); e.target.blur(); };
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

// ---------- start ----------
resetRace(); syncViews();
requestAnimationFrame(frame);

// ---------- window.__game ----------
const r2 = (v) => +v.toFixed(2);
window.__game = {
  subject: 'player',
  describe: () => ({
    name: 'Photo Finish Fiasco', stack: 'three + rapier ragdoll', units: 'metres, x down the track (finish at x=60), y up, z across lanes',
    keys: { solo: { KeyQ: 'front-left leg (hold)', KeyW: 'front-right leg', KeyO: 'back-left leg', KeyP: 'back-right leg', KeyR: 'restart', Digit2: 'two players', Digit1: 'solo', Space: 'skip replay' }, twoPlayer: { p1: 'Q W E R', p2: 'U I O P', Enter: 'restart' } },
  }),
  observe: () => ({
    phase: S.phase, mode, raceT: r2(S.raceT), countdown: r2(Math.max(0, S.countdown)), replay: S.replay ? { kind: S.replay.kind, pos: r2(S.replay.pos), of: S.replay.end } : null,
    pendingReplay: !!S.pending, tangles: S.tangles, results: S.results ? S.results.order.map((i) => roles[i].name) : null,
    horses: horses.map((h, i) => ({ name: roles[i].name, human: roles[i].human, x: r2(h.torso.body.translation().x), y: r2(h.torso.body.translation().y), z: r2(h.torso.body.translation().z), pitch: r2(h.pitch()), state: h.state, plants: h.plants, finished: h.finished, finishT: h.finishT && r2(h.finishT), legs: h.held.map((v) => (v ? 1 : 0)).join('') })),
  }),
  act,
  setState: (s) => {
    if (s.auto !== undefined) S.auto = !!s.auto;
    if (s.autoPeriod) AUTO.period = s.autoPeriod;
    if (s.mode && s.mode !== mode) setMode(s.mode);
    if (s.restart) resetRace();
    if (s.phase === 'race' && S.phase === 'countdown') { S.countdown = 0.001; }
    if (s.phase === 'replay-skip' && S.phase === 'replay') endReplay();
    if (s.horses) s.horses.forEach((o, i) => { if (!o) return; const h = horses[i]; if (o.x !== undefined) { h.place(o.x, o.z ?? h.laneZ, STAND_H + 0.02); for (const p of h.parts) p.body.setLinvel({ x: o.vx ?? 0, y: 0, z: 0 }, true); } if (o.collapse) { h.guard = 0; h.collapse(o.collapse === true ? 'FACE-PLANT!' : o.collapse); onPlant(h, h.lastPlantKind); } });
    if (s.raceT !== undefined) S.raceT = s.raceT;
  },
};
