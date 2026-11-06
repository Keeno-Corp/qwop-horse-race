// Made with paprika3d · https://paprika3d.com
// Photo Finish Fiasco: QWOP horse racing. Four Rapier ragdoll horses, one key per leg.
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { tex } from './fx.js';
import { createWorld, Horse, DT, FINISH_X, STAND_H } from './physics.js';
import { buildHorseView, buildEnvironment, animateHorse, outlineU, RAMP, COLORS, COATS, SILKS } from './view.js';
import { createBroadcast } from './broadcast.js';
import { createAudio } from './audio.js';
import { createCommentary } from './commentary.js';
import { createHud } from './hud.js';
import { createCamera } from './camera.js';
import { createReplay } from './replay.js';
import { createControls } from './controls.js';

await RAPIER.init();
await Promise.all(['40px Shrikhand', '30px Bungee'].map((f) => document.fonts.load(f))).catch(() => {});

// ---------- deterministic randomness ----------
let seed = 12345;
const rng = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + (b - a) * rng();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = (id) => document.getElementById(id);

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NoToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.prepend(renderer.domElement);
const bc = createBroadcast(renderer);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.5, 900);
scene.add(new THREE.HemisphereLight(0xf0efd6, 0xe8b46a, 2.3));
const sun = new THREE.DirectionalLight(0xffdca6, 3.4);   // low warm golden sun from the front-left: long shadows streaming behind the horses
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 26, bottom: -26, near: 1, far: 120 });
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun, sun.target);
const env = buildEnvironment(scene, tex, rng);
window.__scene = scene; window.__cam = camera;

// ---------- physics + horses ----------
const world = createWorld(RAPIER);
const LANES = [-1.65, -0.55, 0.55, 1.65], STAGGER = [0, 1.0, 2.0, 3.0];   // a visual stagger so the field reads as four horses, not one pile
const horses = [0, 1, 2, 3].map((i) => new Horse(RAPIER, world, i, LANES[i], 0));
const views = [];         // per horse: visual groups
const roles = [];         // per horse: { name, color, human, ai }
const NAMES_AI = ['Sir Trips-a-Lot', 'Hoof Hearted', 'Dusty Rhodes', 'Neigh-poleon'];
const KEYS = { 1: [['KeyQ', 'KeyW', 'KeyO', 'KeyP']], 2: [['KeyQ', 'KeyW', 'KeyE', 'KeyR'], ['KeyU', 'KeyI', 'KeyO', 'KeyP']] };
const LEGNAME = ['FL', 'FR', 'BL', 'BR'];
let mode = 1;


// ---------- AI ----------
class AI {
  constructor(skill) { this.skill = skill; this.phase = rr(0, 1); this.base = rr(0.51, 0.58) / skill; this.t = 0; this.delay = rr(0.05, 0.5); this.next = rr(7, 12); this.m = null; this.wob = rr(0, 6); this.chaos = rr(0.85, 1.25); this.jit = rr(0.95, 1.05); }
  update(h, dt, lead) {
    this.t += dt; this.wob += dt;
    const px = h.pos().x; let band = 1;
    if (px > 6 && px <= 22) { const g0 = (AI.aiLeadX || 0) - px; if (g0 > 1.5) band = 1 - clamp((g0 - 1.5) * 0.09, 0, 0.45); }
    if (px > 22) { if (this.m) this.m = null; this.next = 99; const gapL = (AI.aiLeadX || 0) - px; if (gapL > 0.5) band = 1 - clamp((gapL - 0.5) * (px > 38 ? 0.3 : 0.15), 0, px > 38 ? 0.78 : 0.7); }
    h.drag = 16 * (AI.humanX > 5 && px > 6 ? 1 + clamp((px - AI.humanX - 1) * 0.25, 0, 1.5) : 1); // ease off while a human is still racing behind
    { const g1 = (AI.leadX || 0) - px; if (g1 > 1.5 && h.state === 'run' && !h.finished) { h.drive = 1; h.driveF = 40 * clamp(g1 - 1.5, 0, 14); } else h.driveF = 0; }
    { // stall watchdog: a horse that has barely moved in 3 s while upright gets a firm shove
      this.wx = this.wx ?? px; this.wt = (this.wt || 0) + dt;
      if (this.wt > 3) { this.stuck = h.state === 'run' && !h.finished && px > 5 && px - this.wx < 0.8 ? 1.4 : 0; this.wx = px; this.wt = 0; }
      if (this.stuck === 1.4 && h.rise) { this.stuck = 1.39; if (Math.abs(h.pitch()) > 0.9) h.rise(); }
      if (this.stuck > 0) { this.stuck -= dt; h.drive = 1; h.driveF = Math.max(h.driveF || 0, 420); }
    }
    if (this.t < this.delay) { for (let i = 0; i < 4; i++) h.setHeld(i, false); return; }
    const per = this.jit * band * this.base * (1 + 0.14 * Math.sin(this.wob * 1.7) + 0.08 * Math.sin(this.wob * 4.1)) * (1 + clamp(lead * 0.07, -0.35, 0.5)) * (1 - clamp(((AI.leadX || 0) - px - 1) * 0.06, 0, 0.4)) * (h.pos().x > 40 ? 1 - clamp(lead * 0.1, -0.4, 0.4) : 1);
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
    const r = { color: COLORS[s.color], colorName: s.color, silk: SILKS[s.color], human: s.human ?? -1, name: s.name || NAMES_AI[s.ai], ai: s.human === undefined ? new AI(rr(0.93, 1.03)) : null };
    roles.push(r);
    const groups = buildHorseView(r.color, 0, r.human === 0 ? 0xf2e1ad : r.human === 1 ? 0x6b3a22 : COATS[i], SILKS[s.color], i + 1);
    groups.forEach((g, k) => { g.name = (r.human === 0 ? 'player' : 'horse' + i) + (k === 0 ? '-body' : k === 1 ? '-head' : '-' + k); scene.add(g); });
    groups[0].name = 'horse' + i;     views.push(groups);
    horses[i].homeZ = LANES[i];
  });
  G.buildHud(); G.buildControlsHud();
}

// ---------- dust chunks ----------
const NDUST = 420;
const dustM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.15, 0), new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: RAMP, transparent: true, opacity: 0.92 }), NDUST);
dustM.castShadow = false; dustM.frustumCulled = false; dustM.name = 'dust'; dustM.renderOrder = 5; dustM.material.polygonOffset = true; dustM.material.polygonOffsetFactor = -2; scene.add(dustM);
const dust = Array.from({ length: NDUST }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 1, r: new THREE.Euler() }));
{ const c = new THREE.Color(); dust.forEach((d, i) => dustM.setColorAt(i, c.set([0xe9c88e, 0xd9ac6a, 0xf3dfae, 0xc99a58][i % 4]))); }
let dustHead = 0;
function emitDust(x, y, z, n, speed = 2.5, up = 2.5, big = 1) {
  for (let k = 0; k < n; k++) {
    const d = dust[dustHead++ % NDUST];
    d.life = rr(0.7, 1.5); d.p.set(x + rr(-0.15, 0.15), y + 0.18, z + rr(-0.15, 0.15));
    d.v.set(rr(-1, 1) * speed + 0.6, rr(0.3, 1) * up, rr(-1, 1) * speed * 0.7); d.s = rr(0.5, 1.4) * big; d.r.set(rr(0, 6), rr(0, 6), rr(0, 6));
  }
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _e = new THREE.Euler();
function updateDust(dt) {
  for (let i = 0; i < NDUST; i++) {
    const d = dust[i];
    if (d.life > 0) {
      d.life -= dt; d.v.y -= 9 * dt; d.p.addScaledVector(d.v, dt);
      if (d.p.y < 0.14) { d.p.y = 0.14; d.v.y *= -0.25; d.v.x *= 0.6; d.v.z *= 0.6; }
      d.r.x += dt * 5; d.r.z += dt * 4;
      const sc = d.s * Math.min(1, d.life * 2.5);
      _q.setFromEuler(d.r); _s.set(sc, sc, sc); _m.compose(d.p, _q, _s);
    } else { _s.set(0, 0, 0); _m.compose(d.p, _q, _s); }
    dustM.setMatrixAt(i, _m);
  }
  dustM.instanceMatrix.needsUpdate = true;
}

// ---------- shared context + modules ----------
// One context object G is handed to each module's factory; modules call each other through G at call time.
const S = {
  phase: 'countdown', countdown: 4.6, raceT: 0, finishT: null, firstFinish: null, firstFinishFrame: 0, order: [],
  pending: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, shakeAmp: 0, shake: 0,
  excite: 0, time: 0, camBlend: 0, popups: [], lastPopup: {}, results: null, resultsShown: false, seedRound: 0,
};
const hexs = (n) => '#' + n.toString(16).padStart(6, '0');
const G = {
  THREE, S, horses, roles, views, env, bc, camera, scene, sun, renderer, world, KEYS, LEGNAME, FINISH_X, DT, rng, rr, clamp, $, hexs,
  get mode() { return mode; }, set mode(v) { mode = v; },
  resetRace: () => resetRace(), frontOrder: () => frontOrder(),
};
// copy property descriptors (not values) so modules' live getters/setters (ringN) stay live on G
const mix = (o) => Object.defineProperties(G, Object.getOwnPropertyDescriptors(o));
mix(createAudio(G)); mix(createCommentary(G)); mix(createHud(G)); mix(createCamera(G)); mix(createReplay(G)); mix(createControls(G));
const { camLook, CUT } = G;   // shared objects (never reassigned), read live

function resetRace() {
  seed = 12345 + 7919 * (++S.seedRound);
  assignRoles();
  horses.forEach((h, i) => { h.reset(STAGGER[i], LANES[i]); h.guard = 99; h.assist = 1; h.stiff = 1; h.plants = 0; h.trip = undefined; h.finished = false; h.finishT = null; h.speedBefore = 0; h.drive = 0; h.driveF = 0; h.wd = 0; h.wdX = undefined; h.wdAny = false; h.legT = [0, 0, 0, 0]; for (let k = 0; k < 4; k++) h.setHeld(k, false); });
  Object.assign(S, { phase: 'countdown', countdown: 4.6, raceT: 0, finishT: null, firstFinish: null, order: [], pending: null, pair: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, focus: null, deadHeat: true, hhGap: 0.5 + rng() * 2.8, excite: 0, results: null, resultsShown: false, camBlend: 0 });
  G.ringN = 0; for (const d of dust) d.life = 0;
  for (const p of S.popups) p.el.remove(); S.popups = [];
  $('results').style.display = 'none'; G.setReplayUi(false); $('count').textContent = '';
  S.lastCount = 4; S.stretchCut = false; S.stretchSaid = false; S.titleOn = null; CUT.kind = null; CUT.snap = false; G.COMM.until = 0; G.COMM.lastLead = -1; G.COMM.fillT = S.time; G.say('Good afternoon from Channel 7! Four riderless entrants, one finish line, zero jockeys.', 1, 4.5); $('title').style.display = 'flex'; S.titleOn = true;
}

// ---------- race logic ----------
function onPlant(h, kind) {
  const r = roles[h.idx], p = h.torso.body.translation();
  G.commentOnPlant(h, kind);      // popup + play-by-play first (commentary.js)
  G.cue('plant');
  emitDust(p.x, 0.1, p.z, 34, 3.5, 3.4, 1.4);
  S.excite = Math.min(1, S.excite + 0.5);
  S.shake = 0.6; S.shakeAmp = Math.max(S.shakeAmp, 0.3);
  const big = h.speedBefore > 1.6 || kind === 'CARTWHEEL!' || kind === 'BACKFLIP!';
  if (S.phase === 'race' && big && S.raceT > 3 && S.raceT - S.lastReplayAt > 11 && p.x < FINISH_X - 10 && !S.pending && (r.human >= 0 || rng() < 0.7)) {
    S.pending = { at: S.time + 0.9, horse: h.idx }; S.lastReplayAt = S.raceT;
  }
}

const AUTO = { period: 0.32 };
const TUNE = { trip: 380, lo: 3, hi: 5.5, jit: 0.25 }; // trip: nose-down torque kick, lo..hi seconds between kicks, jit: +-fraction of random size
function physStep() {
  for (const h of horses) {
    const r = roles[h.idx];
    if (r.human >= 0 && (S.phase === 'race' || S.phase === 'finishing') && !h.finished) {
      const set = KEYS[mode][r.human]; const ph = Math.floor(S.raceT / AUTO.period) % 2; for (let i = 0; i < 4; i++) { const d = S.auto ? ((i === 0 || i === 3) === (ph === 0)) : G.held.has(set[i]); if (d && !h.held[i]) h.drive = Math.min(2.2, (h.drive || 0) + 0.8); h.setHeld(i, d); }
      if (S.phase === 'race') { const others = horses.filter((o, j) => roles[j].ai).map((o) => o.pos().x); const avg = others.reduce((a, b) => a + b, 0) / Math.max(1, others.length); h.driveF = (S.auto ? 0.5 : 16) * Math.max(0, 30 + clamp(avg - h.pos().x - 4, 0, 30) * 6 - clamp(h.pos().x - avg - 0.3, 0, 20) * 14); }
    } else if (r.human >= 0) for (let i = 0; i < 4; i++) h.setHeld(i, false);
    if (h.finished || S.phase === 'results') h.guard = 99;
    if (r.human >= 0 && S.phase === 'race' && !h.finished && h.state === 'run') { // human stall watchdog: a stuck upright or tipped horse is stood up and nudged
      h.wd = (h.wd || 0) + DT; h.wdAny = h.wdAny || h.held.some((v) => v);
      if (h.wd > 2.5) { const px = h.pos().x; if (h.wdAny && px > 3 && px - (h.wdX ?? -9) < 0.5) { if (Math.abs(h.pitch()) > 0.7 || h.pos().y < 0.8) h.rise(); h.drive = 1; h.driveF = Math.max(h.driveF || 0, 420); } h.wdX = px; h.wd = 0; h.wdAny = false; }
    }
    if (r.human >= 0) h.drag = S.auto ? 16 : 45;
    if (r.human >= 0 && !S.auto && S.phase === 'race' && h.state === 'run' && h.guard <= 0) { // stumble: a rough patch of track pitches a running horse nose-down now and then
      h.trip = (h.trip ?? rr(4, 7)) - DT;
      if (h.trip <= 0) { h.trip = rr(TUNE.lo, TUNE.hi); if (h.torso.body.linvel().x > 2) h.torso.body.applyTorqueImpulse({ x: 0, y: 0, z: -TUNE.trip * (1 + TUNE.jit * (rng() * 2 - 1)) }, true); }
    }
    if (r.human >= 0 && !S.auto) h.assist = 0.6 + 9.4 * clamp(1 - S.raceT / 7, 0, 1) * (S.phase === "race" ? 1 : 0);
    const ev = h.step(DT);
    if (ev === 'rise') { const p = h.torso.body.translation(); emitDust(p.x, 0.05, p.z, 14, 2, 3, 1.1); G.cue('rise'); }
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
      if (f.y < 0.2 && Math.abs(v.x) > 1.5 && h.legT[i] <= 0) { emitDust(f.x, 0.02, f.z, 3, 1.1, 1.8, 1); h.legT[i] = 0.07; }
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
  const xs = horses.map((h) => h.pos().x); AI.leadX = Math.max(...xs); AI.aiLeadX = Math.max(...xs.filter((_, i) => roles[i] && roles[i].ai)); AI.humanX = Math.max(0, ...xs.filter((_, i) => roles[i] && roles[i].human >= 0 && !horses[i].finished)); const sorted = [...xs].sort((a, b) => b - a), mean = (sorted[0] + sorted[1] + sorted[2]) / 3;
  if (S.phase === 'race' || S.phase === 'finishing') {
    horses.forEach((h, i) => { const r = roles[i]; if (r.ai) { if (h.finished) for (let k = 0; k < 4; k++) h.setHeld(k, false); else r.ai.update(h, dt, xs[i] - mean); } });
  }
  if (S.deadHeat && (S.phase === 'race' || S.phase === 'finishing') && AI.leadX > 25) { // closing sprint: the best chaser is dragged level for a photo finish
    let ld = null; horses.forEach((h) => { if (!ld || h.pos().x > ld.pos().x) ld = h; });
    let ch = null; horses.forEach((h, i) => { if (roles[i].ai && h !== ld && !h.finished && xs[i] > 14 && (!ch || xs[i] > xs[ch.idx])) ch = h; });
    if (ch && ld) {
      if (ch.state !== 'run') { ch.rise(); ch.guard = 99; }
      const gap = (ld.finished ? 60 : ld.pos().x) - ch.pos().x, sh = Math.min(Math.max(0, gap - (S.hhGap || 0.7)), (gap > 8 ? 7 : 3.2) * dt);
      if (sh > 0) for (const p of ch.parts) { const t = p.body.translation(); p.body.setTranslation({ x: t.x + sh, y: t.y, z: t.z }, true); }
      for (const p of ch.parts) { const v = p.body.linvel(), lv = ld.torso.body.linvel().x; if (v.x < lv) p.body.setLinvel({ x: v.x + (lv - v.x) * 0.1, y: v.y, z: v.z }, true); }
    }
  }
  const steps = Math.round(dt / DT);
  for (let s = 0; s < steps; s++) physStep();
  footDust(dt);
  for (const h of horses) { const v = h.torso.body.linvel(); if (h.state === 'run') h.speedBefore = Math.hypot(v.x, v.z); }
  if (S.phase === 'race' || S.phase === 'finishing') {
    S.raceT += dt;
    for (const h of horses) if (!h.finished && h.headTip().x >= FINISH_X) {
      h.finished = true; h.finishT = S.raceT - Math.min(dt, Math.max(0, (h.headTip().x - FINISH_X) / Math.max(3, h.torso.body.linvel().x))); S.order.push(h.idx);
      if (S.deadHeat && S.order.length === 2) { const f = horses[S.order[0]].finishT, minGap = 0.03 + (((S.hhGap || 0.5) - 0.5) / 2.8) * 0.27; if (h.finishT - f < minGap) h.finishT = f + minGap; }
      if (S.firstFinish === null) {
        S.firstFinish = S.raceT; S.phase = 'finishing'; S.firstFinishFrame = G.ringN; S.pending = null;
        G.cue('finish'); S.excite = 1; S.flash = 1;
      }
    }
    // pile-up: neighbours who run side by side may take each other out
    if (S.phase === 'race' && S.raceT > 6 && S.raceT - S.lastTangle > 12 && S.tangles < 3) {
      for (let i = 0; i < 3 && S.tangles < 3; i++) {
        const a = horses[i], b = horses[i + 1];
        if (a.state !== 'run' || b.state !== 'run' || a.guard > 0 || b.guard > 0) continue;
        const pa = a.pos(), pb = b.pos();
        const forced = S.tangles === 0 && S.raceT > 9 && roles[i].ai && roles[i + 1].ai;
        if (pa.x > 6 && pa.x < FINISH_X - 14 && (roles[i].ai || roles[i + 1].ai) && (forced || (Math.abs(pa.x - pb.x) < 1.7 && rng() < 0.012))) {
          S.tangles++; S.lastTangle = S.raceT; S.focus = { x: (pa.x + pb.x) / 2, until: S.raceT + 2.2 };
          if (forced) { const sx = pa.x - pb.x - 1.2, sz = pa.z - pb.z + 0.5; if (roles[i + 1].ai) for (const p of b.parts) { const t = p.body.translation(); p.body.setTranslation({ x: t.x + sx, y: t.y, z: t.z + sz }, true); } }
          const first = roles[i].ai ? a : b, other = first === a ? b : a;
          first.collapse('FACE-PLANT!'); onPlant(first, 'FACE-PLANT!');
          const dir = Math.sign(other.pos().z - first.pos().z) || 1;
          for (const p of first.parts) p.body.setLinvel({ x: p.body.linvel().x * 0.9, y: p.body.linvel().y, z: dir * 4.2 }, true);
          if (roles[other.idx].ai) { other.collapse('CARTWHEEL!'); onPlant(other, 'CARTWHEEL!'); for (const p of other.parts) p.body.setLinvel({ x: p.body.linvel().x * 0.9, y: p.body.linvel().y + 1.5, z: -dir * 2.6 }, true); }
          S.pair = [first.idx, other.idx]; if (!S.pending) { S.pending = { at: S.time + 0.9, horse: first.idx }; S.lastReplayAt = S.raceT; }
          G.popup('PILE-UP!', 'A tangle of legs!', '#d06322', 1.9); G.say(G.line('tangle', roles[first.idx].name, Math.round(pa.x) + ' metre'), 4, 4); G.cue('tangle');
          break;
        }
      }
    }
    if (S.phase === 'finishing') {
      const since = S.raceT - S.firstFinish;
      const humanWait = roles.some((r, i) => r.human >= 0 && !horses[i].finished && horses[i].pos().x > 40) && since < 9; // a human still coming (even mid face-plant) gets to finish
      if ((since > 4.5 && !humanWait) || horses.every((h) => h.finished || h.state !== 'run' && since > 3.5)) G.startFinishReplay();
    } else if (S.raceT > 150) G.startFinishReplay();
  }

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
  if (location.search.includes('nopass')) renderer.render(scene, camera); else bc.render(scene, camera, S.time);
}
function tick(dt) {
  if (S.phase === 'countdown') {
    S.countdown -= dt;
    const n = Math.ceil(S.countdown);
    if (S.titleOn !== (S.countdown > 3)) { S.titleOn = S.countdown > 3; $('title').style.display = S.titleOn ? 'flex' : 'none'; }
    if (n !== S.lastCount && n <= 3) { S.lastCount = n; if (n > 0) { $('count').textContent = n; $('count').style.color = n === 1 ? '#ffd27a' : '#fff6e0'; G.cue('countdown'); } }
    if (S.countdown <= 0) {
      S.phase = 'race'; G.say(G.line('off'), 3, 4.5); $('count').textContent = 'GO!'; $('count').style.color = '#6fe36f'; S.goT = 0.9; G.cue('go');
      horses.forEach((h) => { h.guard = roles[h.idx].human >= 0 ? 3 : 1.2; });
    }
    updateRace(dt);
    if (S.phase === 'countdown') for (const h of horses) h.guard = 99;
  } else if (S.phase === 'race' || S.phase === 'finishing') {
    if (S.goT > 0) { S.goT -= dt; if (S.goT <= 0) $('count').textContent = ''; }
    updateRace(dt);
    G.record();
    if (S.pending && S.time >= S.pending.at && S.phase === 'race') G.startPlantReplay();
  } else if (S.phase === 'replay') {
    G.advanceReplay(dt);
  } else if (S.phase === 'results') {
    for (const h of horses) { for (let i = 0; i < 4; i++) h.setHeld(i, false); }
    horses.forEach((h) => { if (roles[h.idx].ai) for (let k = 0; k < 4; k++) h.setHeld(k, false); });
    const steps = Math.round(dt / DT); for (let s = 0; s < steps; s++) physStep();
  }
  if (S.phase !== 'replay') syncViews();
  G.updateMarkers();
  updateDust(dt); dustM.visible = S.phase !== 'replay' || true;
  env.update(S.time, dt, camLook.x);
  env.spectators.update(S.time, S.phase === 'results' ? 0.8 : S.excite);
  G.updatePopups(dt);
  G.directorCommentary(dt); G.updateOdds(dt);
  G.blendReplayShader(dt);
  for (let i = 0; i < horses.length; i++) animateHorse(views[i], S.time + i, Math.abs(horses[i].torso.body.linvel().x));
  G.updateCamera(dt); G.updateHud(); G.updateControlsHud();
  G.updateAudio(dt);
}
function syncViews() {
  horses.forEach((h, hi) => h.parts.forEach((p, pi) => {
    const t = p.body.translation(), q = p.body.rotation(), g = views[hi][pi];
    g.position.set(t.x, t.y, t.z); g.quaternion.set(q.x, q.y, q.z, q.w);
  }));
}
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); bc.setSize(); outlineU.uAspect.value = innerWidth / innerHeight; camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

// ---------- start ----------
resetRace(); syncViews();
requestAnimationFrame(frame);

// ---------- window.__game ----------
const r2 = (v) => +v.toFixed(2);
window.__game = {
  subject: 'horse0',
  describe: () => ({
    name: 'Photo Finish Fiasco', stack: 'three + rapier ragdoll', units: 'metres, x down the track (finish at x=60), y up, z across lanes',
    keys: { solo: { KeyQ: 'front-left leg (hold)', KeyW: 'front-right leg', KeyO: 'back-left leg', KeyP: 'back-right leg', KeyR: 'restart', Digit2: 'two players', Digit1: 'solo', Space: 'skip replay' }, twoPlayer: { p1: 'Q W E R', p2: 'U I O P', Enter: 'restart' } },
  }),
  observe: () => ({
    cam: { p: camera.position.toArray().map(r2), look: camLook.toArray().map(r2), fov: r2(camera.fov), blend: r2(S.camBlend) },
    phase: S.phase, mode: G.mode, raceT: r2(S.raceT), countdown: r2(Math.max(0, S.countdown)), replay: S.replay ? { kind: S.replay.kind, pos: r2(S.replay.pos), t: r2(S.replay.pos - S.replay.start), of: S.replay.end, rate: 0.25 } : null,
    pendingReplay: !!S.pending, tangles: S.tangles, results: S.results ? S.results.order.map((i) => roles[i].name) : null,
    horses: horses.map((h, i) => ({ name: roles[i].name, human: roles[i].human, x: r2(h.torso.body.translation().x), y: r2(h.torso.body.translation().y), z: r2(h.torso.body.translation().z), pitch: r2(h.pitch()), state: h.state, plants: h.plants, finished: h.finished, finishT: h.finishT && r2(h.finishT), legs: h.held.map((v) => (v ? 1 : 0)).join('') })),
  }),
  act: G.act,
  setState: (s) => {
    if (s.auto !== undefined) S.auto = !!s.auto;
    if (s.autoPeriod) AUTO.period = s.autoPeriod;
    if (s.mode && s.mode !== G.mode) G.setMode(s.mode);
    if (s.restart) resetRace();
    if (s.phase === 'race' && S.phase === 'countdown') { S.countdown = 0.001; }
    if (s.phase === 'replay-skip' && S.phase === 'replay') G.endReplay();
    if (s.horses) s.horses.forEach((o, i) => { if (!o) return; const h = horses[i]; if (o.x !== undefined) { h.place(o.x, o.z ?? h.laneZ, STAND_H + 0.02); for (const p of h.parts) p.body.setLinvel({ x: o.vx ?? 0, y: 0, z: 0 }, true); } if (o.collapse) { h.guard = 0; h.collapse(o.collapse === true ? 'FACE-PLANT!' : o.collapse); onPlant(h, h.lastPlantKind); } });
    if (s.raceT !== undefined) S.raceT = s.raceT;
    if (s.cam !== undefined) S.dbgCam = s.cam;
  },
};

