// Made with paprika3d · https://paprika3d.com
// Photo Finish Fiasco: QWOP horse racing. Four Rapier ragdoll horses, one key per leg.
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { sfx, tex } from './fx.js';
import { createWorld, Horse, DT, FINISH_X, STAND_H } from './physics.js';
import { buildHorseView, buildEnvironment, animateHorse, silksCanvas, outlineU, RAMP, COLORS, COATS, SILKS } from './view.js';
import { createBroadcast } from './broadcast.js';

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
  constructor(skill) { this.skill = skill; this.phase = rr(0, 1); this.base = rr(0.51, 0.58) / skill; this.t = 0; this.delay = rr(0.05, 0.5); this.next = rr(7, 12); this.m = null; this.wob = rr(0, 6); this.chaos = rr(0.85, 1.25); this.jit = rr(0.95, 1.05); }
  update(h, dt, lead) {
    this.t += dt; this.wob += dt;
    const px = h.pos().x; let band = 1;
    if (px > 6 && px <= 22) { const g0 = (AI.aiLeadX || 0) - px; if (g0 > 1.5) band = 1 - clamp((g0 - 1.5) * 0.09, 0, 0.45); }
    if (px > 22) { if (this.m) this.m = null; this.next = 99; const gapL = (AI.aiLeadX || 0) - px; if (gapL > 0.5) band = 1 - clamp((gapL - 0.5) * (px > 38 ? 0.3 : 0.15), 0, px > 38 ? 0.78 : 0.7); }
    { const g1 = (AI.leadX || 0) - px; if (g1 > 1.5 && h.state === 'run' && !h.finished) { h.drive = 1; h.driveF = 40 * clamp(g1 - 1.5, 0, 14); } else h.driveF = 0; }
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
  buildHud();
}

// ---------- dust chunks ----------
const NDUST = 420;
const dustM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.15, 1), new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: RAMP, transparent: true, opacity: 0.92 }), NDUST);
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
  phase: 'countdown', countdown: 4.6, raceT: 0, finishT: null, firstFinish: null, firstFinishFrame: 0, order: [],
  pending: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, shakeAmp: 0, shake: 0,
  excite: 0, time: 0, camBlend: 0, popups: [], lastPopup: {}, results: null, resultsShown: false, seedRound: 0,
};

const hexs = (n) => '#' + n.toString(16).padStart(6, '0');
function buildHud() {
  const tote = $('tote'); tote.innerHTML = '<div class="hd"><b>Tote</b><span>WIN ODDS</span></div><div class="bar"></div><div class="rows"></div>';
  const rows = tote.querySelector('.rows');
  roles.forEach((r, i) => {
    const d = document.createElement('div'); d.className = 'row' + (r.human >= 0 ? ' me' : ''); d.id = 'chip' + i;
    const cv = new Image(); cv.src = silksCanvas(r.silk.kind, r.silk.a, r.silk.b, 64, 64).toDataURL(); d.appendChild(cv);
    const nm = document.createElement('div'); nm.className = 'nm'; nm.innerHTML = `${i + 1} ${r.name}<small>FACE-PLANTS 0</small>`; d.appendChild(nm);
    const od = document.createElement('div'); od.className = 'od'; od.id = 'od' + i; od.textContent = '3-1'; d.appendChild(od);
    rows.appendChild(d);
  });
  document.querySelectorAll('#prog em').forEach((e) => e.remove());
  roles.forEach((r, i) => { const e = document.createElement('em'); e.id = 'mk' + i; e.style.background = hexs(r.color); $('prog').appendChild(e); });
  const keys = $('keys'); keys.innerHTML = '';
  (KEYS[mode]).forEach((set, pi) => {
    const kp = document.createElement('div'); kp.className = 'kp';
    kp.innerHTML = `<div>${mode === 2 ? 'PLAYER ' + (pi + 1) : 'YOUR LEGS'}</div><div class="row">${set.map((c, li) => `<div class="cap" id="cap-${pi}-${li}">${KEYLABEL(c)}<small>${LEGNAME[li]}</small></div>`).join('')}</div>`;
    keys.appendChild(kp);
  });
  $('b1').classList.toggle('on', mode === 1); $('b2').classList.toggle('on', mode === 2);
  $('tips').textContent = mode === 1 ? 'ALTERNATE LEGS: Q+P THEN W+O  ·  R RESTART  ·  2 = TWO PLAYERS  ·  SPACE SKIPS REPLAYS'
    : 'P1: Q W E R  ·  P2: U I O P  ·  ENTER RESTARTS  ·  1 = SOLO  ·  SPACE SKIPS REPLAYS';
  S.odds = horses.map(() => ({ shown: 3, target: 3, text: '3-1', dir: 0, t: 0 }));
}

// ---------- commentary (lower-third) ----------
const ANNOUNCERS = ['WALT DUNMORE', 'HANK "HOOFBEAT" PRUITT'];
const LINES = {
  off: ["AND THEY'RE OFF! Four riderless thoroughbreds and absolutely no plan.", "AND THEY'RE OFF, folks! Hold onto your hats and your lunch."],
  lead: ['{n} takes the lead! Well, takes a lead. It is not a good one.', '{n} moves to the front! Legs flailing, spirits high!', 'And it is {n} out in front now!'],
  fill: ['The dust is flying out there at the Fiasco Stakes.', 'Nobody has told these horses how legs work.', 'What a crowd today at the track, over six dozen!', 'Look at that stride! I use the word loosely.', 'Sponsored by Ranch-O Cola, the taste of victory.'],
  far: ['{n} is miles back. Somebody send a search party.', '{n} is out of the picture, folks.'],
  stretch: ["Into the stretch! It's going to be close!", 'Down to the wire, folks, down to the wire!'],
  win: ['{n} wins it! What a finish!', "That's the ballgame! {n} takes the Fiasco Stakes!"],
  tangle: ['OH NO! A tangle of legs at the {m} mark! Nobody knows whose hoof is whose!', 'A pile-up! {n} and company have become a single large horse!'],
  tied: ['This one is going to the photographers... too close to call!'],
};
const COMM = { q: [], cur: 0, until: 0, lastLead: -1, leadT: -99, fillAt: 6, last: '' };
const GV = { takes: 'take', wins: 'win', moves: 'move', eats: 'eat', kisses: 'kiss', does: 'do', flips: 'flip', goes: 'go', thinks: 'think', sits: 'sit', has: 'have', is: 'are' };
const gram = (t) => t.replace(/\bYOU (takes|wins|moves|eats|kisses|does|flips|goes|thinks|sits|has|is)\b/gi, (m, v) => { const g = GV[v.toLowerCase()]; return 'YOU ' + (v === v.toUpperCase() ? g.toUpperCase() : g); });
function say(text, pri = 1, hold = 3.6) {
  if (!text) return;
  if (S.time < COMM.until && pri <= COMM.pri) return;
  COMM.pri = pri; COMM.until = S.time + hold;
  text = gram(text); const el = $('ltxt'); if (el.textContent === text) return; el.textContent = text; COMM.last = text;
  const lo = $('lower'); lo.classList.remove('flash'); void lo.offsetWidth; lo.classList.add('flash');
  $('cname').textContent = ANNOUNCERS[(COMM.cur++) % 2];
}
let cseed = 4242; const crng = () => { cseed = (cseed * 1664525 + 1013904223) >>> 0; return cseed / 4294967296; };
const line = (k, n = '', m = '') => LINES[k][Math.floor(crng() * LINES[k].length)].replace('{n}', n).replace('{m}', m);

// ---------- live odds ----------
function updateOdds(dt) {
  if (!S.odds || !S.odds.length) return;
  const xs = horses.map((h) => h.pos().x), mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const w = horses.map((h, i) => (h.finished ? (S.order[0] === i ? 40 : 0.6) : Math.exp(clamp((xs[i] - mean) * 0.28, -3, 3)) * (h.state === 'down' ? 0.25 : 1) * (1 + 0.15 * Math.sin(S.time * 0.9 + i * 2))));
  const tot = w.reduce((a, b) => a + b, 0);
  horses.forEach((h, i) => {
    const o = S.odds[i], p = clamp(w[i] / tot, 0.03, 0.97), target = clamp((1 - p) / p * 0.9, 0.5, 49);
    o.target = target; o.shown += (target - o.shown) * Math.min(1, dt * 1.2); o.t -= dt;
    if (o.t <= 0) {
      o.t = 0.35; const v = o.shown, num = v >= 10 ? Math.round(v) : v >= 4 ? Math.round(v * 2) / 2 : Math.round(v * 2) / 2;
      let txt = v < 1 ? '1-2' : v < 1.25 ? '6-5' : v < 1.75 ? '3-2' : v < 2.25 ? '2-1' : v < 2.75 ? '5-2' : v < 3.5 ? '3-1' : v < 4.5 ? '4-1' : v < 5.5 ? '5-1' : v < 7 ? '6-1' : v < 8.5 ? '8-1' : v < 12 ? '10-1' : v < 17 ? '15-1' : v < 25 ? '20-1' : '30-1';
      if (h.finished && S.order[0] === i) txt = horses.some((o, j) => j !== i && o.finished && Math.abs(o.finishT - h.finishT) < 0.15) ? 'PHOTO' : 'WIN'; else if (h.finished) txt = Math.abs(h.finishT - horses[S.order[0]].finishT) < 0.15 ? 'PHOTO' : '—';
      if (txt !== o.text) { o.dir = v > (o.last || v) ? -1 : 1; o.last = v; o.text = txt; const el = $('od' + i); if (el) { el.textContent = txt; el.className = 'od ' + (o.dir > 0 ? 'up' : 'dn'); setTimeout(() => el && (el.className = 'od'), 700); } }
    }
  });
  S.toteT = (S.toteT || 0) - dt;
  if (S.toteT <= 0 && env.tote) { S.toteT = 0.5; env.tote.draw(horses.map((h, i) => ({ name: roles[i].name, silk: roles[i].silk, odds: S.odds[i].text, hot: S.odds[i].dir > 0 })), S.phase === 'countdown' ? 'WIN ODDS' : 'LIVE ODDS'); }
}

// ---------- title card / clock ----------
function clockText() { const sec = 58 * 60 + Math.floor(S.time * 4); const m = Math.floor(sec / 60) % 60, hh = 3 + Math.floor(sec / 3600); return `${hh}:${String(m).padStart(2, '0')} PM`; }

function resetRace() {
  seed = 12345 + 7919 * (++S.seedRound);
  assignRoles();
  horses.forEach((h, i) => { h.reset(STAGGER[i], LANES[i]); h.guard = 99; h.assist = 1; h.stiff = 1; h.plants = 0; h.finished = false; h.finishT = null; h.speedBefore = 0; h.drive = 0; h.legT = [0, 0, 0, 0]; for (let k = 0; k < 4; k++) h.setHeld(k, false); });
  Object.assign(S, { phase: 'countdown', countdown: 4.6, raceT: 0, finishT: null, firstFinish: null, order: [], pending: null, pair: null, lastReplayAt: -99, replay: null, tangles: 0, lastTangle: -99, focus: null, deadHeat: rng() < 0.9, hhGap: 0.5 + rng() * 2.8, excite: 0, results: null, resultsShown: false, camBlend: 0 });
  ringN = 0; for (const d of dust) d.life = 0;
  for (const p of S.popups) p.el.remove(); S.popups = [];
  $('results').style.display = 'none'; setReplayUi(false); $('count').textContent = '';
  S.lastCount = 4; S.stretchCut = false; S.stretchSaid = false; S.titleOn = null; CUT.kind = null; CUT.snap = false; COMM.until = 0; COMM.lastLead = -1; COMM.fillT = S.time; say('Good afternoon from Channel 7! Four riderless entrants, one finish line, zero jockeys.', 1, 4.5); $('title').style.display = 'flex'; S.titleOn = true;
}

// ---------- popups / sound ----------
sfx.define('cheer', { volume: 0.55, frequency: 260, attack: 0.25, sustain: 0.9, release: 0.9, shape: 4, noise: 1.2, tremolo: 0.3, filter: -200 });
sfx.define('gasp', { volume: 0.5, frequency: 520, attack: 0.04, sustain: 0.18, release: 0.3, shape: 4, noise: 0.9, slide: -0.25, filter: -300 });
sfx.define('boing', { volume: 0.5, frequency: 180, shape: 1, sustain: 0.08, release: 0.3, slide: 3.5 });
function popup(text, sub = '', color = '#ffd27a', life = 1.7) {
  const last = S.lastPopup[text] ?? -9; if (S.time - last < 1.4) return; S.lastPopup[text] = S.time;
  while (S.popups.length > 1) S.popups.shift().el.remove();
  const el = document.createElement('div'); el.className = 'pop'; el.style.background = color;
  el.style.setProperty('--r', rr(-6, 6).toFixed(1) + 'deg'); el.style.animation = `pop ${life}s ease-out forwards`;
  el.style.left = '50%';
  el.innerHTML = gram(text) + (sub ? `<span>${gram(sub)}</span>` : ''); $('popups').appendChild(el); S.popups.push({ el, t: life });
  S.popups.forEach((p, i) => { p.el.style.top = (22 + i * 20) + 'vh'; }); // re-stack so two pops never overlap
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
  if (r.human >= 0 || S.popups.length < 1) popup(kind, sub, hexs(r.color));
  say(kind === 'FACE-PLANT!' ? `${r.name === 'YOU' ? 'YOU' : r.name} eats dirt! ` + pick(['Face-first into the track!', 'That one is going to hurt in the morning.', 'And the crowd gasps!']) : sub, 3, 3.2);
  sfx.play('thud', 0.8); sfx.play('gasp', 0.8, 0.03);
  emitDust(p.x, 0.1, p.z, 34, 3.5, 3.4, 1.4);
  S.excite = Math.min(1, S.excite + 0.5);
  S.shake = 0.6; S.shakeAmp = Math.max(S.shakeAmp, 0.3);
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
      const set = KEYS[mode][r.human]; const ph = Math.floor(S.raceT / AUTO.period) % 2; for (let i = 0; i < 4; i++) { const d = S.auto ? ((i === 0 || i === 3) === (ph === 0)) : held.has(set[i]); if (d && !h.held[i]) h.drive = Math.min(1.6, (h.drive || 0) + 0.5); h.setHeld(i, d); }
      if (S.phase === 'race') { const others = horses.filter((o, j) => roles[j].ai).map((o) => o.pos().x); const avg = others.reduce((a, b) => a + b, 0) / Math.max(1, others.length); h.driveF = (S.auto ? 0.5 : 40) * Math.max(0, 30 + clamp(avg - h.pos().x - 4, 0, 30) * 6 - clamp(h.pos().x - avg - 0.3, 0, 20) * 14); }
    } else if (r.human >= 0) for (let i = 0; i < 4; i++) h.setHeld(i, false);
    if (h.finished || S.phase === 'results') h.guard = 99;
    if (r.human >= 0 && !S.auto) h.assist = 2.5 + 2.5 * clamp(1 - S.raceT / 5, 0, 1) * (S.phase === "race" ? 1 : 0);
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
  const xs = horses.map((h) => h.pos().x); AI.leadX = Math.max(...xs); AI.aiLeadX = Math.max(...xs.filter((_, i) => roles[i] && roles[i].ai)); const sorted = [...xs].sort((a, b) => b - a), mean = (sorted[0] + sorted[1] + sorted[2]) / 3;
  if (S.phase === 'race' || S.phase === 'finishing') {
    horses.forEach((h, i) => { const r = roles[i]; if (r.ai) { if (h.finished) for (let k = 0; k < 4; k++) h.setHeld(k, false); else r.ai.update(h, dt, xs[i] - mean); } });
  }
  if (S.deadHeat && (S.phase === 'race' || S.phase === 'finishing') && AI.leadX > 34) { // closing sprint: the best chaser is dragged level for a photo finish
    let ld = null; horses.forEach((h) => { if (!h.finished && (!ld || h.pos().x > ld.pos().x)) ld = h; });
    let ch = null; horses.forEach((h, i) => { if (roles[i].ai && h !== ld && !h.finished && xs[i] > 14 && (!ch || xs[i] > xs[ch.idx])) ch = h; });
    if (ch && ld) {
      if (ch.state !== 'run') { ch.rise(); ch.guard = 99; }
      const gap = ld.pos().x - ch.pos().x, sh = Math.min(Math.max(0, gap - (S.hhGap || 0.7)), (gap > 8 ? 7 : 3.2) * dt);
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
          popup('PILE-UP!', 'A tangle of legs!', '#d06322', 1.9); say(line('tangle', roles[first.idx].name, Math.round(pa.x) + ' metre'), 4, 4); sfx.play('cheer', 0.7);
          break;
        }
      }
    }
    if (S.phase === 'finishing') {
      const since = S.raceT - S.firstFinish;
      const humanWait = roles.some((r, i) => r.human >= 0 && !horses[i].finished && horses[i].state === 'run') && since < 4;
      if ((since > 6.5 && !humanWait) || horses.every((h) => h.finished || h.state !== 'run' && since > 3.5)) startFinishReplay();
    } else if (S.raceT > 150) startFinishReplay();
  }
}

function setReplayUi(on, kind) {
  if (env.finNear) env.finNear.visible = !(on && kind === 'finish');
  document.body.classList.toggle('replaying', on); document.body.classList.toggle('pfin', on && kind === 'finish');
  $('replay').style.display = on ? 'block' : 'none'; $('pf').style.display = on && kind === 'finish' ? 'block' : 'none';
  $('rtag').textContent = kind === 'finish' ? 'REPLAY 0.25x' : 'INSTANT REPLAY · 0.25x';
  if (on && kind === 'finish') { const g = S.pfGap ?? 9; $('pfc').textContent = 'WINNER: ' + (S.pfWinner || '?') + (g < 1 ? ' · BY ' + g.toFixed(2) + ' SEC' : ' · OFFICIAL') + ' · HOLD ALL TICKETS'; }
  if (on) { bc.U.uGlitch.value = 1; }
}
function startFinishReplay() {
  if (S.phase === 'replay' || S.phase === 'results') return;
  const order = frontOrder(), w = order[0];
  const gap = order[1] && order[1].finished ? order[1].finishT - w.finishT : 9;
  S.results = { order: order.map((h) => h.idx), gap };
  popup(gap < 1.0 ? 'PHOTO FINISH!' : 'WINNER!', roles[w.idx].name + (gap < 0.5 ? ' by a nose (' + gap.toFixed(2) + 's)!' : ' takes it!'), '#e5af2c', 2.4);
  say(gap < 0.5 ? line('tied') : line('win', roles[w.idx].name), 5, 5); S.pfGap = gap; S.pfWinner = roles[w.idx].name;
  const start = Math.max(Math.max(0, ringN - RING + 2), (S.firstFinishFrame || ringN - 1) - 24), end = Math.min(ringN - 1, start + 64);
  S.replay = { kind: 'finish', start, end, pos: start, subject: w.idx };
  S.phase = 'replay'; setReplayUi(true, 'finish'); S.flash = 1; sfx.play('cheer', 0.8);
  camPos.set(FINISH_X + 7, 1.1, 3.2); camLook.set(FINISH_X - 2.5, 1.2, 0);
}
function startPlantReplay() {
  const hi = S.pending.horse; S.pending = null;
  const end = ringN - 1, start = Math.max(Math.max(0, ringN - RING + 2), end - 75);
  const pr = S.pair && S.pair.includes(hi) ? S.pair : null;
  S.replay = { kind: 'plant', start, end, pos: start, subject: hi, pair: pr, snap: true, back: S.phase };
  S.prevPhase = S.phase; S.phase = 'replay'; for (const p of S.popups) p.el.remove(); S.popups = []; setReplayUi(true, 'plant');
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
  const pod = [1, 0, 2].filter((k) => ord[k] !== undefined).map((k) => `<div class="p${k + 1}" style="${horses[ord[k]].finished ? '' : 'opacity:.65'}"><i style="background:${hex(ord[k])};width:16px;height:16px;border-radius:50%;border:2px solid #2b1810"></i><span>${roles[ord[k]].name}${horses[ord[k]].finished ? '' : ' (DNF)'}</span><b>${k + 1}</b></div>`).join('');
  const w = horses[ord[0]], rows = ord.map((i, k) => {
    const h = horses[i], t = h.finished ? h.finishT.toFixed(2) + 's' + (k ? ' (+' + (h.finishT - w.finishT).toFixed(2) + ')' : '') : 'DNF · ' + Math.max(0, FINISH_X - h.headTip().x).toFixed(0) + ' m short';
    const aw = (i === worst && maxP > 0 ? '<span class="award">DIRT EATER · MOST FACE-PLANTS</span>' : '') + (h.plants === minP && minP < maxP && h.finished ? '<span class="award g">SMOOTH OPERATOR</span>' : '');
    return `<tr><td class="n">${k + 1}</td><td><i style="background:${hex(i)}"></i>${roles[i].name}${aw}</td><td>${t}</td><td class="n">${h.plants} face-plant${h.plants === 1 ? '' : 's'}</td></tr>`;
  }).join('');
  const photo = res.gap < 1.0 ? `PHOTO FINISH · ${res.gap.toFixed(2)}s` : 'RESULTS';
  $('results').querySelector('.box').innerHTML = `<h1>${roles[ord[0]].name === 'YOU' ? 'YOU WIN!' : roles[ord[0]].name + ' WINS!'}<small>${photo}</small></h1><div class="pod">${pod}</div><table>${rows}</table><div class="hint">${mode === 1 ? 'Press R' : 'Press Enter'} for another race · 1 / 2 = players</div>`;
  $('results').style.display = 'flex'; S.resultsShown = true; for (const p of S.popups) p.el.remove(); S.popups = [];
}

// ---------- camera ----------
const camPos = new THREE.Vector3(-8, 5, 15), camLook = new THREE.Vector3(2, 1, 0);
const tp = new THREE.Vector3(), tl = new THREE.Vector3();
function followTarget() {
  const humans = roles.map((r, i) => r.human >= 0 ? horses[i].pos().x : null).filter((v) => v !== null);
  const hx = humans.reduce((a, b) => a + b, 0) / humans.length;
  const leader = Math.max(...horses.map((h) => h.pos().x));
  const gap = leader - hx, sm = clamp((gap - 8) / 22, 0, 1);
  // when the player falls far behind, the camera drifts to the lead pack so the race stays in frame
  const sm2 = clamp((gap - 5) / 12, 0, 1), sm3 = sm2 * sm2 * (3 - 2 * sm2);
  const mine = hx + Math.min(clamp(gap, -4, 60) * 0.3, 4.5);
  let fx = mine + (leader - 3.5 - mine) * sm3;
  fx = Math.min(fx, FINISH_X + 2);
  const far = Math.min(Math.abs(leader - hx), 26) * (1 - sm3 * 0.7);
  const asp = Math.min(1, camera.aspect / 1.5);
  const dist = (14.5 + clamp(far * 0.5, 0, 14)) / Math.pow(asp, 0.7);   // long telephoto from the infield, far off the rail
  return { fx, dist, leader };
}
// broadcast director: side-tracking telephoto, hard cut to a head-on cam for tangles and the stretch, replay cams
const CUT = { kind: null, until: 0, x: 0, snap: false };
function cutTo(kind, dur, x) { CUT.kind = kind; CUT.until = S.time + dur; CUT.x = x; CUT.snap = true; bc.U.uGlitch.value = 0.8; }
function updateCamera(dt) {
  let fov = (S.phase === 'race' || S.phase === 'finishing' || S.phase === 'countdown') ? 30 : 36, snap = false;
  if (S.phase === 'replay') {
    const rp = S.replay;
    if (rp.kind === 'finish') {
      const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start);
      tp.set(FINISH_X + 7 - prog * 1.5, 1.1 + prog * 0.3, 3.2); tl.set(FINISH_X - 2.5 - prog * 1.0, 1.2, 0); fov = 30 - prog * 4;
    } else { // low rail cam orbiting the pile-up
      const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start), s = subjectAt(rp.pos, rp.subject), a = 0.35 + prog * 1.1;
      let cx = s.x, cz = s.z, d = 8;
      if (rp.pair) { const s2 = subjectAt(rp.pos, rp.pair[0] === rp.subject ? rp.pair[1] : rp.pair[0]); cx = (s.x + s2.x) / 2; cz = (s.z + s2.z) / 2; d = 9 + Math.abs(s.x - s2.x) * 0.5; }
      tp.set(cx - 1.5 + Math.sin(a) * d * 0.45, 1.8 + prog * 1.2, cz + Math.max(d, 10.5)); tl.set(cx, 1.0, cz); fov = 34;
    }
    if (rp.snap) { rp.snap = false; snap = true; }
    if (snap) { camPos.copy(tp); camLook.copy(tl); } else { camPos.lerp(tp, 1 - Math.exp(-dt * 6)); camLook.lerp(tl, 1 - Math.exp(-dt * 8)); }
  } else if (S.phase === 'results') {
    tp.set(FINISH_X - 4, 2.4, 14); tl.set(FINISH_X + 2, 1.2, 0); fov = 32;
    camPos.lerp(tp, 1 - Math.exp(-dt * 1.5)); camLook.lerp(tl, 1 - Math.exp(-dt * 2));
  } else {
    let { fx, dist, leader } = followTarget();
    if (S.focus && S.phase === 'race') {
      const left = S.focus.until - S.raceT;
      if (left > 0) { const w = Math.min(1, left / 0.5, (2.2 - left) / 0.5 + 0.2); const fh = horses.filter((h) => h.state === 'down'); const tx = fh.length ? fh.reduce((a, h) => a + h.pos().x, 0) / fh.length : S.focus.x; fx += (tx - fx) * 0.85 * w; dist = Math.max(dist, 18); if (!S.focus.cut) { S.focus.cut = true; cutTo('head', 1.7, S.focus.x); } } else S.focus = null;
    }
    if (S.phase !== 'countdown' && !S.stretchCut && leader > FINISH_X - 21 && leader < FINISH_X - 10) { S.stretchCut = true; cutTo('head', 2.0, leader); }
    if (CUT.kind && S.time > CUT.until) { CUT.kind = null; CUT.snap = true; bc.U.uGlitch.value = 0.7; snap = true; }
    if (CUT.kind === 'head' && (S.phase === 'race' || S.phase === 'finishing')) {
      if (CUT.snap) { CUT.px = CUT.x + 23; CUT.snap = false; snap = true; }
      const lead = S.focus ? S.focus.x : leader;
      tp.set(Math.min(CUT.px, FINISH_X + 20), 1.5, 1.6); tl.set(lead + 0.5, 1.1, 0); fov = 24;
      camPos.copy(tp); camLook.lerp(tl, snap ? 1 : 1 - Math.exp(-dt * 7));
    } else if (S.phase === 'countdown') {
      S.camBlend = Math.min(1, S.camBlend + dt / 4.0); const e = S.camBlend * S.camBlend * (3 - 2 * S.camBlend);
      tp.set(-6 + (fx - 0.4 + 6) * e, 3.4 + 0.4 * e, 17 - (17 - dist) * e); tl.set(1.5 + (fx + 1.8 - 1.5) * e, 1.2, 0);
      camPos.copy(tp); camLook.copy(tl);
    } else {
      tp.set(fx - 0.4, 3.0 + (dist - 14.5) * 0.14, dist); tl.set(fx + 2.0, 1.7, 0.3);
      if (snap) { camPos.copy(tp); camLook.copy(tl); } else { camPos.lerp(tp, 1 - Math.exp(-dt * 2.6)); camLook.lerp(tl, 1 - Math.exp(-dt * 4)); }
    }
  }
  camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * (CUT.snap || snap ? 40 : 6))); camera.updateProjectionMatrix();
  camera.position.copy(camPos);
  if (S.shake > 0) { S.shake = Math.max(0, S.shake - dt); const a = S.shakeAmp * S.shake; camera.position.x += Math.sin(S.time * 83) * a; camera.position.y += Math.cos(S.time * 71) * a; if (S.shake === 0) S.shakeAmp = 0; }
  camera.lookAt(camLook);
  if (S.dbgCam) { camera.position.set(...S.dbgCam.pos); camera.fov = S.dbgCam.fov || 30; camera.updateProjectionMatrix(); camera.lookAt(...S.dbgCam.look); }
  sun.position.set(camLook.x - 24, 13, -6); sun.target.position.set(camLook.x, 0, 0);
}

// ---------- HUD update ----------
function updateHud() {
  roles.forEach((r, i) => {
    const h = horses[i], chip = $('chip' + i), s = chip.querySelector('small'), txt = 'FACE-PLANTS ' + h.plants + (h.state === 'down' ? ' · OUCH' : '');
    if (s.textContent !== txt) s.textContent = txt;
    $('mk' + i).style.left = (clamp(h.pos().x / FINISH_X, 0, 1) * 100) + '%';
  });
  $('timer').textContent = 'RACE TIME ' + S.raceT.toFixed(1) + 's'; const ck = clockText(); if ($('clock').textContent !== ck) $('clock').textContent = ck;
  roles.forEach((r, i) => {
    if (r.human < 0) return;
    let el = document.getElementById('off' + i);
    if (!el) { el = document.createElement('div'); el.id = 'off' + i; el.className = 'ui'; const c = r.color.toString(16).padStart(6, '0'); el.style.cssText = `position:fixed;top:46%;font:20px Bungee,Impact,sans-serif;color:#f2e1ad;background:#${c};padding:5px 12px;border:3px solid #2b1810;box-shadow:4px 4px 0 #2b1810;display:none;z-index:6`; document.body.appendChild(el); }
    const p = horses[i].pos(), v = new THREE.Vector3(p.x, 1, p.z || 0).project(camera), off = v.z > 1 || Math.abs(v.x) > 0.96;
    const show = off && (S.phase === 'race' || S.phase === 'finishing' || S.phase === 'countdown');
    if (show) { const left = v.z > 1 ? true : v.x < 0, d = Math.round(Math.abs(p.x - camLook.x)); el.textContent = (left ? '◀ ' : '') + 'YOU ' + d + ' m' + (left ? '' : ' ▶'); el.style.left = left ? '12px' : ''; el.style.right = left ? '' : '12px'; el.style.display = 'block'; } else el.style.display = 'none';
  });
  KEYS[mode].forEach((set, pi) => set.forEach((c, li) => $(`cap-${pi}-${li}`)?.classList.toggle('dn', held.has(c))));
  const f = $('flash'); if (S.flash > 0) { S.flash = Math.max(0, S.flash - 0.06); f.style.opacity = (S.flash * 0.35).toFixed(2); bc.U.uFlash.value = S.flash * 0.12; } else if (f.style.opacity !== '0') { f.style.opacity = 0; bc.U.uFlash.value = 0; }
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
    if (n !== S.lastCount && n <= 3) { S.lastCount = n; if (n > 0) { $('count').textContent = n; $('count').style.color = n === 1 ? '#ffd27a' : '#fff6e0'; sfx.play('blip', 0.7); } }
    if (S.countdown <= 0) {
      S.phase = 'race'; say(line('off'), 3, 4.5); $('count').textContent = 'GO!'; $('count').style.color = '#6fe36f'; S.goT = 0.9; sfx.play('powerup', 0.8); sfx.play('cheer', 0.6, 0.1);
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
    const rp = S.replay; rp.pos += (0.25) * dt * 60;
    if (rp.pos >= rp.end) endReplay(); else applyFrame(rp.pos);
  } else if (S.phase === 'results') {
    for (const h of horses) { for (let i = 0; i < 4; i++) h.setHeld(i, false); }
    horses.forEach((h) => { if (roles[h.idx].ai) for (let k = 0; k < 4; k++) h.setHeld(k, false); });
    const steps = Math.round(dt / DT); for (let s = 0; s < steps; s++) physStep();
  }
  if (S.phase !== 'replay') syncViews();
  updateMarkers();
  updateDust(dt); dustM.visible = S.phase !== 'replay' || true;
  env.update(S.time, dt, camLook.x);
  env.spectators.update(S.time, S.phase === 'results' ? 0.8 : S.excite);
  // popups lifetimes
  for (let i = S.popups.length - 1; i >= 0; i--) { S.popups[i].t -= dt; if (S.popups[i].t <= 0) { S.popups[i].el.remove(); S.popups.splice(i, 1); } }
  directorCommentary(dt); updateOdds(dt);
  const rk = S.phase === 'replay' && S.replay ? S.replay.kind : null;
  bc.U.uReplay.value += ((rk === 'finish' ? 1 : 0) - bc.U.uReplay.value) * Math.min(1, dt * 14);
  bc.U.uGlitch.value = Math.max(rk === 'plant' ? 0.12 : 0, bc.U.uGlitch.value - dt * 2.2);
  for (let i = 0; i < horses.length; i++) animateHorse(views[i], S.time + i, Math.abs(horses[i].torso.body.linvel().x));
  updateCamera(dt); updateHud();
}
function directorCommentary(dt) {
  if (S.phase !== 'race' && S.phase !== 'finishing') return;
  S.cmT = (S.cmT || 0) - dt; if (S.cmT > 0) return; S.cmT = 0.3;
  const xs = horses.map((h) => h.pos().x), lead = xs.indexOf(Math.max(...xs)), hum = roles.findIndex((r) => r.human >= 0), L = Math.max(...xs);
  if (S.phase === 'race' && S.raceT > 2 && lead !== COMM.lastLead) { if (COMM.lastLead >= 0 && S.time - COMM.leadT > 4 && Math.abs(xs[lead] - xs[COMM.lastLead]) > 0.5) { say(line('lead', roles[lead].name), 2, 3.2); COMM.leadT = S.time; } COMM.lastLead = lead; }
  if (S.phase === 'race' && L > FINISH_X - 14 && !S.stretchSaid) { S.stretchSaid = true; say(line('stretch'), 3, 3.5); }
  if (S.phase === 'race' && hum >= 0 && L - xs[hum] > 22 && S.time - (COMM.farT || -99) > 14) { COMM.farT = S.time; say(line('far', roles[hum].name === 'YOU' ? 'YOU' : roles[hum].name), 2, 3.2); }
  if (S.time > COMM.until + 0.5 && S.time - (COMM.fillT || 0) > 6) { COMM.fillT = S.time; say(line('fill'), 1, 3.5); }
}
// player markers: bobbing arrow above and a ground ring under each human horse
const markers = [0, 1].map((k) => {
  const col = k === 0 ? 0x3d9bff : 0xff7ad9;
  const g = new THREE.Group(); g.name = 'player-marker-' + k;
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 4), new THREE.MeshBasicMaterial({ color: col, depthTest: false }));
  arrow.rotation.x = Math.PI; arrow.position.y = 2.7; arrow.renderOrder = 20; arrow.castShadow = false; g.add(arrow);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.05, 32), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 - k, polygonOffsetUnits: -2 - k }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07 + k * 0.03; ring.castShadow = false; ring.renderOrder = 4; g.add(ring);
  g.userData.arrow = arrow; g.frustumCulled = false; scene.add(g); return g;
});
function updateMarkers() {
  markers.forEach((m, k) => {
    const hi = roles.findIndex((r) => r.human === k);
    m.visible = hi >= 0 && S.phase !== 'replay' && S.phase !== 'results';
    if (!m.visible) return;
    const t = horses[hi].torso.body.translation();
    m.position.set(t.x, 0, t.z); m.userData.arrow.position.y = 2.6 + Math.sin(S.time * 6) * 0.12;
  });
}
function syncViews() {
  horses.forEach((h, hi) => h.parts.forEach((p, pi) => {
    const t = p.body.translation(), q = p.body.rotation(), g = views[hi][pi];
    g.position.set(t.x, t.y, t.z); g.quaternion.set(q.x, q.y, q.z, q.w);
  }));
}

// ---------- input ----------
const normKey = (k) => { if (!k) return ''; if (k === ' ' || k === 'Space') return 'Space'; if (/^Key|^Digit|^Enter|^Escape/.test(k)) return k; if (/^[a-z]$/i.test(k)) return 'Key' + k.toUpperCase(); if (/^[0-9]$/.test(k)) return 'Digit' + k; return k; };
function act({ key, down = true, type } = {}) {
  if (type === 'autoplay') { S.auto = down !== false; return; }
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
    phase: S.phase, mode, raceT: r2(S.raceT), countdown: r2(Math.max(0, S.countdown)), replay: S.replay ? { kind: S.replay.kind, pos: r2(S.replay.pos), t: r2(S.replay.pos - S.replay.start), of: S.replay.end, rate: 0.25 } : null,
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
    if (s.cam !== undefined) S.dbgCam = s.cam;
  },
};
