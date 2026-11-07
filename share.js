// Made with paprika3d · https://paprika3d.com
// Share team (d): the photo-finish print, the "official result" card (PNG) and a deterministic highlight CLIP (WebM).
// The clip is NOT a live recording: every tick of the race is snapshotted (poses), and after the race the finish crossing and the nearby face-plants
// are re-rendered from those real poses at a fixed 30 fps, encoded with WebCodecs (explicit microsecond timestamps) and muxed into a self-contained
// WebM. Its duration is read back from the muxed file, never from wall time, so a slow GPU only makes the export take longer.
import { silksCanvas } from './view.js';

const FPS = 30, STEP = 2, CLIP_W = 640, CLIP_H = 360, KEY_EVERY = 30, MAX_TICKS = 12000, STILL_W = 1100, STILL_H = 450, BAND_T = 34, BAND_B = 28, REG_H = STILL_H - BAND_T - BAND_B, VIEW_H = 3.6, SS = 2;
const TITLE = 'The Photo Finish Fiasco Stakes';
const pad = (n) => String(n).padStart(2, '0');

// ---------- minimal WebM (Matroska) muxer + reader: one VP8 video track, 8-byte sizes, clusters at keyframes, Cues, Duration ----------
const cat = (parts) => { let n = 0; for (const p of parts) n += p.length; const o = new Uint8Array(n); let k = 0; for (const p of parts) { o.set(p, k); k += p.length; } return o; };
const idB = (id) => { const a = []; while (id > 0) { a.unshift(id % 256); id = Math.floor(id / 256); } return Uint8Array.from(a); };
const szB = (n) => { const b = new Uint8Array(8); b[0] = 1; let v = n; for (let i = 7; i >= 1; i--) { b[i] = v % 256; v = Math.floor(v / 256); } return b; };
const el = (id, payload) => { const p = Array.isArray(payload) ? cat(payload) : payload; return cat([idB(id), szB(p.length), p]); };
const uintEl = (id, v) => { const a = []; do { a.unshift(v % 256); v = Math.floor(v / 256); } while (v > 0); return el(id, Uint8Array.from(a)); };
const strEl = (id, s) => el(id, Uint8Array.from([...s].map((c) => c.charCodeAt(0))));
const f64El = (id, v) => { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v); return el(id, b); };

export function muxWebm(chunks, width, height) {   // chunks: [{ts (µs), key, data}] in presentation order
  const frameUs = Math.round(1e6 / FPS), ms = (c) => Math.round(c.ts / 1000);
  const durMs = ms(chunks[chunks.length - 1]) - ms(chunks[0]) + frameUs / 1000, t0 = ms(chunks[0]);
  const ebml = el(0x1A45DFA3, [uintEl(0x4286, 1), uintEl(0x42F7, 1), uintEl(0x42F2, 4), uintEl(0x42F3, 8), strEl(0x4282, 'webm'), uintEl(0x4287, 4), uintEl(0x4285, 2)]);
  const info = el(0x1549A966, [uintEl(0x2AD7B1, 1000000), strEl(0x4D80, 'paprika3d'), strEl(0x5741, 'paprika3d'), f64El(0x4489, durMs)]);
  const tracks = el(0x1654AE6B, [el(0xAE, [uintEl(0xD7, 1), uintEl(0x73C5, 1), uintEl(0x83, 1), strEl(0x86, 'V_VP8'), el(0xE0, [uintEl(0xB0, width), uintEl(0xBA, height)])])]);
  const clusters = [], cues = []; let cur = null, pos = info.length + tracks.length;
  const flush = () => { if (!cur) return; const c = el(0x1F43B675, [uintEl(0xE7, cur.t), ...cur.blocks]); clusters.push(c); pos += c.length; cur = null; };
  for (const ch of chunks) {
    const t = ms(ch) - t0;
    if (!cur || (ch.key && cur.blocks.length)) { flush(); cur = { t, blocks: [] }; if (ch.key) cues.push({ t, at: pos }); }
    const rel = t - cur.t, hdr = Uint8Array.from([0x81, (rel >> 8) & 255, rel & 255, ch.key ? 0x80 : 0]);
    cur.blocks.push(el(0xA3, cat([hdr, ch.data])));
  }
  flush();
  const cueEl = el(0x1C53BB6B, cues.map((c) => el(0xBB, [uintEl(0xB3, c.t), el(0xB7, [uintEl(0xF7, 1), uintEl(0xF1, c.at)])])));
  return cat([ebml, el(0x18538067, [info, tracks, ...clusters, cueEl])]);
}
export function readWebm(b) {   // what the file itself says: block count, first/last block time, header Duration
  const out = { blocks: [], headerMs: null, scale: 1000000, keyframes: 0 };
  const vint = (o, id) => { let len = 1, m = 0x80; while (len <= 8 && !(b[o] & m)) { len++; m >>= 1; } let v = id ? b[o] : b[o] & (m - 1); for (let i = 1; i < len; i++) v = v * 256 + b[o + i]; return { v, len }; };
  const uint = (o, n) => { let v = 0; for (let i = 0; i < n; i++) v = v * 256 + b[o + i]; return v; };
  const walk = (o, end, base) => {
    let clusterT = 0;
    while (o < end) {
      const id = vint(o, true), sz = vint(o + id.len, false), d = o + id.len + sz.len, e = Math.min(end, d + sz.v);
      if (id.v === 0x18538067 || id.v === 0x1549A966) walk(d, e, base);
      else if (id.v === 0x1F43B675) clusterT = walkCluster(d, e);
      else if (id.v === 0x4489) out.headerMs = sz.v === 8 ? new DataView(b.buffer, b.byteOffset + d, 8).getFloat64(0) : new DataView(b.buffer, b.byteOffset + d, 4).getFloat32(0);
      else if (id.v === 0x2AD7B1) out.scale = uint(d, sz.v);
      o = e;
    }
  };
  const walkCluster = (o, end) => {
    let t = 0;
    while (o < end) {
      const id = vint(o, true), sz = vint(o + id.len, false), d = o + id.len + sz.len, e = d + sz.v;
      if (id.v === 0xE7) t = uint(d, sz.v);
      else if (id.v === 0xA3) { const tn = vint(d, false), rel = (b[d + tn.len] << 8 | b[d + tn.len + 1]) << 16 >> 16, fl = b[d + tn.len + 2]; out.blocks.push(t + rel); if (fl & 0x80) out.keyframes++; }
      o = e;
    }
    return t;
  };
  walk(0, b.length, 0);
  const n = out.blocks.length, first = n ? out.blocks[0] : 0, last = n ? out.blocks[n - 1] : 0;
  return { frames: n, keyframes: out.keyframes, firstMs: first, lastMs: last, durationS: n ? +((last - first + 1000 / FPS) / 1000).toFixed(3) : 0, headerDurationS: out.headerMs == null ? null : +(out.headerMs / 1000).toFixed(3) };
}

export function createShare(G) {
  const { S, $, horses, roles } = G;
  let fault = '';   // test seam (setState({shareFault})): 'norec' (no encoder) | 'encerr' | 'noclip' | 'cliperr' | 'cardfail' exercise the unsupported/error paths
  const urls = new Set(); let panel = null, built = null, token = 0, job = null, races = 0, stale = 0;

  // ---------- pose snapshots: every race tick, bounded (12000 ticks = 200 s, more than the 150 s race limit) ----------
  const NP = horses[0].parts.length, FRAME = 4 * NP * 7;
  const store = { n: 0, poses: null, tip: null, down: null, t: null, finish: -1, falls: [], lastPlants: [0, 0, 0, 0], full: false };
  function storeReset() { store.n = 0; store.finish = -1; store.falls = []; store.lastPlants = [0, 0, 0, 0]; store.full = false; if (!store.poses) { store.poses = new Float32Array(MAX_TICKS * FRAME); store.tip = new Float32Array(MAX_TICKS * 4); store.down = new Uint8Array(MAX_TICKS * 4); store.t = new Float32Array(MAX_TICKS); } }
  function record() {   // once per game tick in race/finishing, right after replay.js records its own ring
    if (store.full) return;
    if (store.n >= MAX_TICKS) { store.full = true; return; }
    const i = store.n; let k = i * FRAME;
    horses.forEach((h, hi) => {
      for (const p of h.parts) { const t = p.body.translation(), q = p.body.rotation(); const P = store.poses; P[k++] = t.x; P[k++] = t.y; P[k++] = t.z; P[k++] = q.x; P[k++] = q.y; P[k++] = q.z; P[k++] = q.w; }
      store.tip[i * 4 + hi] = h.headTip().x; store.down[i * 4 + hi] = h.state === 'run' ? 0 : 1;
      if (h.plants > store.lastPlants[hi]) { store.lastPlants[hi] = h.plants; store.falls.push({ tick: i, horse: hi }); }
    });
    store.t[i] = S.raceT;
    if (store.finish < 0 && S.firstFinish !== null) store.finish = i;
    store.n++;
  }

  // ---------- rendering a tick from stored poses (invisible: live transforms are restored before the next main render) ----------
  const T = G.THREE, views = G.views;
  const liveP = new Float32Array(FRAME), qa = new T.Quaternion();
  function withPoses(tick, cam, rt, sunX, hidePole, fn) {
    const r = G.renderer, prevRT = r.getRenderTarget(), near = G.env.finNear, nv = near && near.visible, sp = G.sun.position.clone(), st = G.sun.target.position.clone();
    let k = 0; for (let hi = 0; hi < views.length; hi++) for (let pi = 0; pi < NP; pi++) { const g = views[hi][pi]; liveP[k++] = g.position.x; liveP[k++] = g.position.y; liveP[k++] = g.position.z; liveP[k++] = g.quaternion.x; liveP[k++] = g.quaternion.y; liveP[k++] = g.quaternion.z; liveP[k++] = g.quaternion.w; }
    try {
      const P = store.poses; k = tick * FRAME;
      for (let hi = 0; hi < views.length; hi++) for (let pi = 0; pi < NP; pi++) { const g = views[hi][pi]; g.position.set(P[k], P[k + 1], P[k + 2]); g.quaternion.set(P[k + 3], P[k + 4], P[k + 5], P[k + 6]); k += 7; }
      if (near && hidePole) near.visible = false;
      G.sun.position.set(sunX - 24, 13, -6); G.sun.target.position.set(sunX, 0, 0); G.sun.target.updateMatrixWorld(); G.scene.visible = true;
      cam.updateMatrixWorld(); r.setRenderTarget(rt); r.clear(); r.render(G.scene, cam);
      return fn(r);
    } finally {
      k = 0; for (let hi = 0; hi < views.length; hi++) for (let pi = 0; pi < NP; pi++) { const g = views[hi][pi]; g.position.set(liveP[k], liveP[k + 1], liveP[k + 2]); g.quaternion.set(liveP[k + 3], liveP[k + 4], liveP[k + 5], liveP[k + 6]); k += 7; }
      if (near) near.visible = nv; G.sun.position.copy(sp); G.sun.target.position.copy(st); G.sun.target.updateMatrixWorld(); r.setRenderTarget(prevRT);
    }
  }
  const luma = (px) => { let t = 0, n = 0; for (let i = 0; i < px.length; i += 52) { t += px[i] + px[i + 1] + px[i + 2]; n += 3; } return t / n; };
  const blank = (px) => luma(px) === 0;   // nothing was drawn (lost context, tab not rendering): never encode it
  const torsoX = (tick, hi) => store.poses[tick * FRAME + hi * NP * 7];
  const leaderTip = (tick) => Math.max(store.tip[tick * 4], store.tip[tick * 4 + 1], store.tip[tick * 4 + 2], store.tip[tick * 4 + 3]);

  // ---------- the photo-finish print: ONE sharp still rebuilt from the recorded poses at the leader's first nose crossing ----------
  // NOT a slit-scan: a single orthographic render (side-on, tilted down ~30 deg so the four lanes separate and the near rail stays below the horses),
  // rendered once after the results show, then graded sepia and marked up in 2D (finish line, metre scale, chips). No live renders or readbacks.
  const still = { cv: null, tick: -1, lead: -1, ok: false, leadX: 0 };
  function stillReset() { still.cv = null; still.tick = -1; still.lead = -1; still.ok = false; still.leadX = 0; }
  const PITCH = 30 * Math.PI / 180, VIEW_W = VIEW_H * STILL_W / REG_H, LINE_AT = 0.84;
  function stillUnit(j) {
    const F = store.finish, RW = STILL_W * SS, RH = REG_H * SS, rt = new T.WebGLRenderTarget(RW, RH, { depthBuffer: true }); rt.texture.colorSpace = T.SRGBColorSpace;   // rendered at 2x and averaged down (no MSAA: it is not portable to every GPU)
    try {
      const camX = G.FINISH_X - (LINE_AT - 0.5) * VIEW_W, cam = new T.OrthographicCamera(-VIEW_W / 2, VIEW_W / 2, VIEW_H / 2, -VIEW_H / 2, 1, 120);
      const tx = camX, ty = 0.95, tz = 0.2, d = 50; cam.position.set(tx, ty + d * Math.sin(PITCH), tz + d * Math.cos(PITCH)); cam.lookAt(tx, ty, tz);
      const px = new Uint8Array(RW * RH * 4);
      withPoses(F, cam, rt, camX, true, (r) => r.readRenderTargetPixels(rt, 0, 0, RW, RH, px));
      if (blank(px)) return false;
      const hi = document.createElement('canvas'); hi.width = RW; hi.height = RH; const hc = hi.getContext('2d'), himg = new ImageData(RW, RH), hrow = RW * 4;
      for (let y = 0; y < RH; y++) himg.data.set(px.subarray((RH - 1 - y) * hrow, (RH - y) * hrow), y * hrow);
      hc.putImageData(himg, 0, 0);
      const cv = document.createElement('canvas'); cv.width = STILL_W; cv.height = STILL_H; const c = cv.getContext('2d'); c.imageSmoothingQuality = 'high'; c.drawImage(hi, 0, BAND_T, STILL_W, REG_H);
      const img = c.getImageData(0, BAND_T, STILL_W, REG_H), d8 = img.data, row = STILL_W * 4;
      let seed = 1234567;   // deterministic grain
      for (let y = 0; y < REG_H; y++) {
        for (let x = 0; x < STILL_W; x++) {
          const o = y * row + x * 4, r = d8[o], g = d8[o + 1], b = d8[o + 2];
          let l = (0.3 * r + 0.59 * g + 0.11 * b) / 255; l = Math.min(1, Math.max(0, (l - 0.12) * 1.55));
          seed = (seed * 1664525 + 1013904223) >>> 0; const n = ((seed >>> 24) - 128) * 0.1;
          d8[o] = Math.min(255, Math.max(0, (43 + 199 * l) * 0.85 + r * 0.15 + n)); d8[o + 1] = Math.min(255, Math.max(0, (24 + 201 * l) * 0.85 + g * 0.15 + n)); d8[o + 2] = Math.min(255, Math.max(0, (16 + 157 * l) * 0.85 + b * 0.15 + n)); d8[o + 3] = 255;
        }
      }
      c.putImageData(img, 0, BAND_T);
      const lead = [0, 1, 2, 3].reduce((m, k) => (store.tip[F * 4 + k] > store.tip[F * 4 + m] ? k : m), 0);
      Object.assign(still, { cv, tick: F, lead, ok: true, leadX: +store.tip[F * 4 + lead].toFixed(2) });
      markStill(c);
      return true;
    } finally { rt.dispose(); }
  }
  function markStill(c) {   // restrained photo-timing graphics: chips and a metre scale live in their own bands, so nothing can hide a horse
    const W = STILL_W, H = STILL_H, BU = 'Bungee, Impact, sans-serif', INK = '#2b1810', CREAM = '#f2e1ad', MUS = '#e5af2c', TOM = '#d3432b', ppm = W / VIEW_W;
    c.save(); c.beginPath(); c.rect(0, BAND_T, W, REG_H); c.clip();
    const g = c.createRadialGradient(W / 2, H / 2, REG_H * 0.8, W / 2, H / 2, W * 0.62); g.addColorStop(0, 'rgba(43,24,16,0)'); g.addColorStop(1, 'rgba(43,24,16,.45)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const lx = Math.round(W * LINE_AT);
    c.fillStyle = 'rgba(43,24,16,.5)'; c.fillRect(lx - 2, BAND_T, 5, REG_H); c.fillStyle = 'rgba(242,225,173,.85)'; c.fillRect(lx - 1, BAND_T, 3, REG_H);   // the finish line: a hairline
    c.restore();
    c.fillStyle = INK; c.fillRect(0, 0, W, BAND_T); c.fillRect(0, H - BAND_B, W, BAND_B);
    for (let m = -Math.floor(lx / ppm); lx + m * ppm < W; m++) { const x = Math.round(lx + m * ppm), big = m % 5 === 0; c.fillStyle = big ? MUS : CREAM; c.fillRect(x, H - BAND_B, big ? 2 : 1, big ? 14 : 8); if (big && m <= 0) { c.font = `12px ${BU}`; c.textAlign = 'left'; c.fillText(m === 0 ? 'LINE' : `${-m} M`, x + 5, H - 6); } }
    c.fillStyle = CREAM; c.fillRect(lx - 1, H - BAND_B, 3, BAND_B); c.fillRect(lx - 1, 0, 3, BAND_T);
    c.textAlign = 'left'; c.font = `17px ${BU}`;
    const chip = (x, y, w, bg, fg, txt) => { c.fillStyle = bg; c.fillRect(x, y, w, 26); c.strokeStyle = '#6b4a35'; c.lineWidth = 2; c.strokeRect(x, y, w, 26); c.fillStyle = fg; c.textAlign = 'center'; c.fillText(txt, x + w / 2, y + 19); };
    chip(12, 4, 156, MUS, INK, 'PHOTO FINISH');
    chip(lx - 156, 4, 142, TOM, CREAM, 'FIRST NOSE');
    chip(W - 164, 4, 152, '#4c2c21', MUS, 'T+' + store.t[still.tick].toFixed(2) + 'S');
    c.textAlign = 'left';
  }

  // ---------- the clip plan: face-plant window(s) + finish window, in ticks, never longer than 10 s ----------
  function clipPlan() {
    const n = store.n, F = store.finish, secs = (s) => Math.round(s * 60), segs = [];
    const clamp = (t) => Math.max(0, Math.min(n - 1, t));
    if (F >= 0) {
      const fin = [clamp(F - secs(2.5)), clamp(F + secs(1.75))];
      // ALWAYS a distinct fall segment (camera on the fallen horse) when anyone fell, even if it overlaps the finish window in time:
      // the fall nearest before the finish (a human's fall wins a tie within 1 s), else the nearest after it
      const falls = store.falls.filter((f) => f.tick < F + secs(1.5)).sort((x, y) => (Math.abs(x.tick - F) - Math.abs(y.tick - F)));
      if (falls.length) {
        const before = falls.filter((f) => f.tick <= F), pool = before.length ? before : falls, near = pool[0];
        const fall = pool.find((f) => roles[f.horse].human >= 0 && Math.abs(Math.abs(f.tick - F) - Math.abs(near.tick - F)) < secs(1)) || near;
        segs.push({ kind: 'fall', a: clamp(fall.tick - secs(1)), b: clamp(fall.tick + secs(2)), horse: fall.horse, tick: fall.tick });
      }
      segs.push({ kind: 'finish', a: fin[0], b: fin[1] });
      // too short (no fall, short race)? pad the finish window backwards to reach 6 s
      const tot = () => segs.reduce((s, g) => s + (g.b - g.a), 0);
      if (tot() < secs(6)) { const g = segs[segs.length - 1]; g.a = clamp(g.a - (secs(6) - tot())); }
      if (tot() > secs(10)) { const g = segs[segs.length - 1]; g.a = Math.min(g.b - 1, g.a + (tot() - secs(10))); }
    } else if (n > 0) {   // no finish (timeout): the last 7 s, honestly labelled
      segs.push({ kind: 'noFinish', a: clamp(n - 1 - secs(7)), b: n - 1 });
    }
    const frames = [];
    segs.forEach((g, si) => { for (let t = g.a; t <= g.b; t += STEP) frames.push({ tick: t, seg: si, kind: g.kind, horse: g.horse }); });
    return { segs, frames };
  }

  // ---------- frame painter: toon render + broadcast graphics (channel bug, lower-third, scanlines, vignette) ----------
  let fx = null;
  function fxInit() {
    const rt = new T.WebGLRenderTarget(CLIP_W, CLIP_H, { depthBuffer: true }); rt.texture.colorSpace = T.SRGBColorSpace;
    const cam = new T.PerspectiveCamera(32, CLIP_W / CLIP_H, 0.5, 300), cv = document.createElement('canvas'); cv.width = CLIP_W; cv.height = CLIP_H;
    const ctx = cv.getContext('2d', { willReadFrequently: false }), img = new ImageData(CLIP_W, CLIP_H), px = new Uint8Array(CLIP_W * CLIP_H * 4);
    const sl = document.createElement('canvas'); sl.width = 1; sl.height = 3; { const c = sl.getContext('2d'); c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(0, 0, 1, 1); }
    fx = { rt, cam, cv, ctx, img, px, scan: ctx.createPattern(sl, 'repeat'), camX: 0 };
  }
  function clipUnit(j) {
    if (!fx) fxInit();
    const f = j.plan.frames[j.fi], first = j.fi === 0 || j.plan.frames[j.fi - 1].seg !== f.seg;
    let cx = f.kind === 'fall' ? torsoX(f.tick, f.horse) : Math.min(leaderTip(f.tick) - 1, G.FINISH_X - 0.5);
    if (first) fx.camX = cx; else fx.camX += (cx - fx.camX) * 0.22;
    const { cam } = fx; cam.position.set(fx.camX + 3, 1.6, 11); cam.lookAt(fx.camX - 0.3, 1.0, 0);
    withPoses(f.tick, cam, fx.rt, fx.camX, f.kind !== 'fall', (r) => r.readRenderTargetPixels(fx.rt, 0, 0, CLIP_W, CLIP_H, fx.px));
    const lu = luma(fx.px); if (lu === 0) return false;
    j.lumaMin = Math.min(j.lumaMin ?? 255, lu); if (lu < 6) j.dark = (j.dark || 0) + 1;
    const { px, img, ctx } = fx, row = CLIP_W * 4;
    for (let y = 0; y < CLIP_H; y++) img.data.set(px.subarray((CLIP_H - 1 - y) * row, (CLIP_H - y) * row), y * row);
    ctx.putImageData(img, 0, 0);
    overlay(ctx, f, j);
    const ts = Math.round(j.fi * 1e6 / FPS);
    const vf = new VideoFrame(fx.cv, { timestamp: ts, duration: Math.round(1e6 / FPS) });
    try { j.enc.encode(vf, { keyFrame: j.fi % KEY_EVERY === 0 }); } finally { vf.close(); }
    return true;
  }
  function overlay(c, f, j) {
    const W = CLIP_W, H = CLIP_H, BU = 'Bungee, Impact, sans-serif';
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(255,226,176,.22)'; c.fillRect(0, 0, W, H); c.restore();   // warm faded grade
    c.fillStyle = fx.scan; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95); g.addColorStop(0, 'rgba(20,8,0,0)'); g.addColorStop(1, 'rgba(20,8,0,.45)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // channel bug + race clock
    c.fillStyle = '#d3432b'; c.fillRect(W - 232, 10, 222, 26); c.strokeStyle = '#2b1810'; c.lineWidth = 3; c.strokeRect(W - 232, 10, 222, 26);
    c.fillStyle = '#f2e1ad'; c.font = `15px ${BU}`; c.textAlign = 'center'; c.fillText('CH 7 · HIGHLIGHT REPLAY', W - 121, 29);
    c.fillStyle = '#4c2c21'; c.fillRect(10, 10, 150, 26); c.strokeRect(10, 10, 150, 26); c.fillStyle = '#e5af2c'; c.fillText('RACE ' + store.t[f.tick].toFixed(1) + 'S', 85, 29);
    // lower third
    const sub = f.kind === 'fall' ? 'FACE-PLANT!' : f.kind === 'finish' ? 'PHOTO FINISH' : 'FINAL STRETCH', who = f.kind === 'fall' ? G.dn(roles[f.horse].name) : (j.d.winName || '');
    c.fillStyle = '#e5af2c'; c.fillRect(14, H - 78, 150, 20); c.strokeRect(14, H - 78, 150, 20); c.fillStyle = '#4c2c21'; c.font = `12px ${BU}`; c.fillText(sub, 89, H - 63);
    c.fillStyle = '#4c2c21'; c.fillRect(14, H - 58, 420, 38); c.strokeRect(14, H - 58, 420, 38); c.fillStyle = '#d3432b'; c.fillRect(14, H - 58, 8, 38);
    c.textAlign = 'left'; c.fillStyle = '#f2e1ad'; c.font = `18px ${BU}`; c.fillText(who.slice(0, 26), 32, H - 32); c.textAlign = 'center';
  }

  // ---------- the job: the still first (the card can be made), then clip frames; a few ms of work per rendered frame ----------
  const supported = () => fault !== 'norec' && typeof VideoEncoder === 'function' && typeof VideoFrame === 'function';
  function startJob(d) {
    const my = token; job = { d, token: my, stage: 'strip', plan: clipPlan(), fi: 0, chunks: [], enc: null, err: null, progress: 0, clip: null, flushing: false };
    if (!store.n) { job.stage = 'failed'; job.err = 'No race was recorded.'; }
  }
  function pump() {
    const j = job; if (!j || j.token !== token || j.stage === 'done' || j.stage === 'failed') return;
    const t0 = performance.now();
    try {
      if (j.stage === 'strip') {   // the one still (or nothing, when no horse crossed the line)
        if (store.finish >= 0 && stillUnit(j) === false) { blankRetry(j); return; }
        j.blank = 0; j.progress = 1; onStrip(); j.stage = 'clip'; if (!startEncoder(j)) return;
        return;
      }
      if (j.stage === 'clip') {
        if (!j.plan.frames.length) throw new Error('Nothing to render.');
        let n = 0;
        while (j.fi < j.plan.frames.length && j.enc.encodeQueueSize < 6 && (n === 0 || performance.now() - t0 < 14)) { if (clipUnit(j) === false) { blankRetry(j); break; } j.blank = 0; j.fi++; n++; }
        j.progress = j.fi / j.plan.frames.length; updateClipLabel();
        if (j.fi >= j.plan.frames.length && !j.flushing) { j.flushing = true; j.enc.flush().then(() => finishClip(j)).catch((e) => failJob(j, 'Encoder failed: ' + (e && e.message || e))); }
      }
    } catch (e) { failJob(j, (j.stage === 'strip' ? 'Print failed: ' : 'Clip render failed: ') + (e && e.message || e)); }
  }
  function blankRetry(j) { j.blank = (j.blank || 0) + 1; if (j.blank > 900) failJob(j, 'Rendering kept coming back blank (the tab or GPU is not drawing), so the clip was not made. Try again after a restart.'); }
  function startEncoder(j) {
    if (!supported()) { failJob(j, 'This browser has no WebCodecs video encoder (VideoEncoder), so the clip cannot be made. The card still works.'); return false; }
    try {
      j.enc = new VideoEncoder({ output: (c) => { const data = new Uint8Array(c.byteLength); c.copyTo(data); j.chunks.push({ ts: c.timestamp, key: c.type === 'key', data }); }, error: (e) => failJob(j, 'Encoder failed: ' + (e && e.message || e)) });
      j.enc.configure({ codec: 'vp8', width: CLIP_W, height: CLIP_H, bitrate: 1_600_000, framerate: FPS });
      if (fault === 'encerr') throw new Error('encoder rejected the configuration (test fault)');
    } catch (e) { failJob(j, 'Encoder could not start: ' + (e && e.message || e)); return false; }
    return true;
  }
  function failJob(j, msg) {
    if (j.token !== token || j.stage === 'failed') return;
    j.stage = 'failed'; j.err = msg; try { j.enc && j.enc.state !== 'closed' && j.enc.close(); } catch { /* closed */ }
    if (panel) { const c = panel.querySelector('.sh-clip'); c.textContent = 'CLIP: UNAVAILABLE'; panel.querySelectorAll('[data-a=clip],[data-a=share]').forEach((b) => { b.classList.add('off'); b.setAttribute('aria-disabled', 'true'); }); }
    if (built) built.clipWhy = msg; say(msg, 'err');
  }
  function finishClip(j) {
    if (j.token !== token) { stale++; return; }   // a flush that finished after a restart: dropped, never shown
    if (j.stage === 'failed') return;
    const chunks = j.chunks.sort((a, b) => a.ts - b.ts);
    if (!chunks.length) return failJob(j, 'The encoder produced no frames.');
    const bytes = muxWebm(chunks, CLIP_W, CLIP_H), info = readWebm(bytes), blob = new Blob([bytes], { type: 'video/webm' });
    // where in the FILE's timeline the real events are (derived from the exported frames' source ticks, in file time)
    const at = (i) => +(i / FPS).toFixed(3), fr = j.plan.frames;
    const finSeg = j.plan.segs.findIndex((g) => g.kind === 'finish');   // the crossing counts only inside the FINISH segment (never a leader crossing during the fall segment)
    let crossIdx = -1; for (let i = 1; i < fr.length; i++) if (fr[i].seg === finSeg && fr[i - 1].seg === finSeg && leaderTip(fr[i - 1].tick) < G.FINISH_X && leaderTip(fr[i].tick) >= G.FINISH_X) { crossIdx = i; break; }
    // only falls the camera actually shows: the fall segment's target horse, inside that segment
    const falls = [], fseg = j.plan.segs.findIndex((g) => g.kind === 'fall'); let downFrames = 0, segStart = null, segEnd = null;
    if (fseg >= 0) { const g = j.plan.segs[fseg]; fr.forEach((x, i) => { if (x.seg !== fseg) return; if (segStart === null) segStart = at(i); segEnd = at(i + 1); if (store.down[x.tick * 4 + g.horse]) downFrames++; });
      for (const f of store.falls) if (f.horse === g.horse && f.tick >= g.a && f.tick <= g.b) { const i = fr.findIndex((x) => x.seg === fseg && x.tick >= f.tick); if (i >= 0) falls.push({ horse: roles[f.horse].name, atS: at(i), tick: f.tick }); } }
    j.clip = { blob, bytes: bytes.length, frames: info.frames, keyframes: info.keyframes, durationS: info.durationS, headerDurationS: info.headerDurationS, fps: FPS, width: CLIP_W, height: CLIP_H, finishAtS: crossIdx >= 0 ? at(crossIdx) : null, falls, planned: fr.length, segments: j.plan.segs.map((s) => s.kind), fallTarget: fseg >= 0 ? roles[j.plan.segs[fseg].horse].name : null, fallSegStartS: segStart, fallSegEndS: segEnd, downFrames, minLuma: +(j.lumaMin ?? 0).toFixed(1), darkFrames: j.dark || 0, gen: j.token, raceTMin: +Math.min(...fr.map((x) => store.t[x.tick])).toFixed(2), raceTMax: +Math.max(...fr.map((x) => store.t[x.tick])).toFixed(2) };
    built.clip = j.clip; j.stage = 'done'; j.progress = 1; try { j.enc.close(); } catch { /* closed */ }
    if (fx) { fx.rt.dispose(); fx = null; }
    if (panel) {
      const c = panel.querySelector('.sh-clip'), nf = falls.length;
      c.textContent = `CLIP ${info.durationS.toFixed(1)}S · ${(bytes.length / 1048576).toFixed(1)}MB · ${crossIdx >= 0 ? 'FINISH' : 'NO FINISH'} + ${nf} FALL${nf === 1 ? '' : 'S'}`;
      panel.querySelectorAll('[data-a=clip]').forEach((b) => { b.classList.remove('off'); b.removeAttribute('aria-disabled'); });
      const sh = panel.querySelector('[data-a=share]'); if (typeof navigator.canShare === 'function' && typeof navigator.share === 'function') { sh.classList.remove('off'); sh.removeAttribute('aria-disabled'); }
      say('Clip ready. Pick a button.');
    }
  }
  function updateClipLabel() { const c = panel && panel.querySelector('.sh-clip'); if (c && job && job.stage === 'clip') c.textContent = `CLIP: RENDERING ${Math.floor(job.progress * 100)}%`; }

  // ---------- per-frame hook (after the main render): pumps the job while the results are up ----------
  function frame() { if (S.phase === 'results') pump(); }
  function reset() {
    token++; races++; storeReset(); stillReset();
    if (job) { try { job.enc && job.enc.state !== 'closed' && job.enc.close(); } catch { /* closed */ } } job = null;
    if (fx) { fx.rt.dispose(); fx = null; }
    for (const u of urls) URL.revokeObjectURL(u); urls.clear();
    built = null; panel = null; document.body.classList.remove('shared');
  }
  addEventListener('pagehide', () => { token++; if (job && job.enc && job.enc.state !== 'closed') { try { job.enc.close(); } catch { /* closed */ } } for (const u of urls) URL.revokeObjectURL(u); urls.clear(); });
  storeReset();

  // ---------- card ----------
  const hex = (n) => '#' + n.toString(16).padStart(6, '0');
  function paintStill(ctx, x, y, w, h) {
    ctx.fillStyle = '#2b1810'; ctx.fillRect(x, y, w, h);
    if (!still.ok || !still.cv) {   // honest empty state: no horse crossed the line, so there is no first nose to print
      ctx.fillStyle = '#f2e1ad'; ctx.font = `${Math.round(h * 0.055)}px Bungee, Impact, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText('NO PRINT: NO HORSE CROSSED THE LINE', x + w / 2, y + h / 2 + 8); ctx.textAlign = 'left'; return false;
    }
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(still.cv, x, y, w, h); return true;
  }
  function thumbStill(ctx, w, h) {   // compact panel thumbnail: the whole still letterboxed (never cropped, so no horse is cut), timing text in the side bars
    if (!still.ok) return paintStill(ctx, 0, 0, w, h);
    const iw = Math.round(h * STILL_W / STILL_H), x = (w - iw) >> 1; paintStill(ctx, x, 0, iw, h);
    ctx.fillStyle = '#e5af2c'; ctx.font = '12px Bungee, Impact, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('PHOTO', x / 2, h / 2 - 6); ctx.fillText('FINISH', x / 2, h / 2 + 14);
    ctx.fillStyle = '#f2e1ad'; ctx.fillText('T+' + store.t[still.tick].toFixed(2), x + iw + x / 2, h / 2 - 6); ctx.fillText('FIRST NOSE', x + iw + x / 2, h / 2 + 14); ctx.textAlign = 'left'; return true;
  }
  function drawCard(d) {
    if (fault === 'cardfail') throw new Error('canvas unavailable (test fault)');
    const W = 1200, pH = Math.round((W - 100) * STILL_H / STILL_W), by = 176 + pH + 38, ry = by + 82, H = ry + 4 * 68 + 102, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const SH = 'Shrikhand, Georgia, serif', BU = 'Bungee, Impact, sans-serif', INK = '#2b1810', CHOC = '#4c2c21', CREAM = '#f2e1ad', TOM = '#d3432b', MUS = '#e5af2c';
    c.fillStyle = CREAM; c.fillRect(0, 0, W, H);
    const cols = [TOM, MUS, '#305da2', '#95a641']; for (let i = 0; i < W; i += 50) { c.fillStyle = cols[(i / 50) % 4]; c.fillRect(i, 0, 50, 34); }
    c.fillStyle = INK; c.fillRect(0, 34, W, 5);
    c.textAlign = 'center'; c.fillStyle = TOM; c.font = `22px ${BU}`; c.fillText('CHANNEL 7 · RACE OF THE WEEK · OFFICIAL PHOTO FINISH', W / 2, 78);
    let tp = 74; do { c.font = `${tp}px ${SH}`; tp -= 2; } while (c.measureText(TITLE).width > W - 120 && tp > 24);   // fit between the borders
    c.fillStyle = MUS; c.fillText(TITLE, W / 2 + 4, 154); c.fillStyle = CHOC; c.fillText(TITLE, W / 2, 150);
    c.textAlign = 'left';
    // print
    const px = 50, py = 176, pw = W - 100, ph = Math.round(pw * STILL_H / STILL_W);
    c.fillStyle = INK; c.fillRect(px - 8, py - 8, pw + 16, ph + 16); paintStill(c, px, py, pw, ph);
    c.fillStyle = CHOC; c.font = `15px ${BU}`; c.fillText(still.ok ? `PHOTO FINISH · FIRST NOSE · STILL REBUILT FROM THE RECORDED POSES${still.lead >= 0 ? ' · ' + G.dn(roles[still.lead].name) + ' LEADS' : ''}` : 'PHOTO FINISH · NO FIRST NOSE RECORDED', px, py + ph + 30);
    // winner banner
    c.fillStyle = TOM; c.fillRect(50, by, W - 100, 62); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(50, by, W - 100, 62);
    c.fillStyle = CREAM; c.font = `40px ${SH}`; c.fillText(d.winName, 70, by + 45); c.textAlign = 'right'; c.font = `20px ${BU}`; c.fillText(d.margin, W - 70, by + 41); c.textAlign = 'left';
    // placings
    d.rows.forEach((r, k) => {
      const y = ry + k * 68;
      c.fillStyle = k === 0 ? 'rgba(229,175,44,.35)' : 'rgba(76,44,33,.08)'; c.fillRect(50, y, W - 100, 60);
      c.fillStyle = k === 0 ? TOM : MUS; c.beginPath(); c.arc(92, y + 30, 22, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
      c.fillStyle = k === 0 ? CREAM : INK; c.font = `24px ${BU}`; c.textAlign = 'center'; c.fillText(String(k + 1), 92, y + 39); c.textAlign = 'left';
      try { c.drawImage(silksCanvas(r.silk.kind, r.silk.a, r.silk.b, 64, 64), 130, y + 8, 44, 44); } catch { c.fillStyle = r.hex; c.fillRect(130, y + 8, 44, 44); }
      c.strokeStyle = INK; c.lineWidth = 3; c.strokeRect(130, y + 8, 44, 44);
      c.fillStyle = CHOC; c.font = `26px ${BU}`; c.fillText(r.name, 192, y + 30);
      if (r.award) { c.font = `13px ${BU}`; c.fillStyle = TOM; c.fillText(r.award, 192, y + 50); }
      c.textAlign = 'right'; c.fillStyle = CHOC; c.font = `30px ${BU}`; c.fillText(r.time, W - 70, y + 32); c.font = `15px ${BU}`; c.fillStyle = TOM; c.fillText(r.sub, W - 70, y + 52); c.textAlign = 'left';
    });
    c.fillStyle = INK; c.fillRect(0, H - 56, W, 56); c.fillStyle = MUS; c.fillRect(0, H - 60, W, 4);
    c.fillStyle = CREAM; c.font = `18px ${BU}`; c.fillText(d.most || 'NOBODY FACE-PLANTED. SUSPICIOUS.', 50, H - 22);
    c.textAlign = 'right'; c.fillStyle = MUS; c.fillText('RACE TIME ' + d.raceT + 's · NO REFUNDS', W - 50, H - 22);
    c.lineWidth = 12; c.strokeStyle = INK; c.strokeRect(0, 0, W, H);
    return cv;
  }
  const toBlob = (cv) => new Promise((res, rej) => { try { cv.toBlob((b) => (b ? res(b) : rej(new Error('PNG encoding returned nothing'))), 'image/png'); } catch (e) { rej(e); } });
  const fname = (ext) => { const d = new Date(); return `photo-finish-fiasco-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.${ext}`; };

  // ---------- panel ----------
  const state = { last: null, history: [] };
  function say(msg, kind = 'ok') {
    state.last = { msg, kind }; state.history.push(state.last);
    const el = panel && panel.querySelector('.sh-msg'); if (!el) return;
    el.textContent = msg; el.className = 'sh-msg ' + kind;
  }
  function download(blob, name) {
    const u = URL.createObjectURL(blob); urls.add(u);
    const a = document.createElement('a'); a.href = u; a.download = name; a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => { URL.revokeObjectURL(u); urls.delete(u); }, 4000);
  }
  const canClip = () => fault !== 'noclip' && typeof ClipboardItem !== 'undefined' && !!(navigator.clipboard && navigator.clipboard.write);
  const enable = (sel) => panel && panel.querySelectorAll(sel).forEach((b) => { b.classList.remove('off'); b.removeAttribute('aria-disabled'); });

  function onStrip() {   // the print is developed: draw the card, show the strip, enable the card buttons
    if (!built || !panel) return;
    try {
      built.card = drawCard(built.d);
      const t = document.createElement('canvas'); t.width = 680; t.height = 190; thumbStill(t.getContext('2d'), t.width, t.height); panel.querySelector('.sh-th').src = t.toDataURL('image/png');
      built.cardBlob = toBlob(built.card); built.cardBlob.catch(() => {}); enable('[data-a=card],[data-a=copy]'); say('Print ready. The clip is rendering…');
    } catch (e) { built.card = null; say('Could not draw the card: ' + (e && e.message || e), 'err'); }
  }

  function mount(box, d) {
    token++; const sc = document.createElement('div'); sc.className = 'share'; panel = sc;
    sc.innerHTML = '<div class="sh-hd"><b>SHARE THE PRINT</b><span class="sh-clip">CLIP: STARTING…</span></div><img class="sh-th" alt="Photo-finish print">' +
      '<div class="sh-btns"><button data-a="card" class="off" aria-disabled="true">DOWNLOAD CARD</button><button data-a="copy" class="off" aria-disabled="true">COPY CARD</button><button data-a="clip" class="off" aria-disabled="true">DOWNLOAD CLIP</button><button data-a="share" class="off" aria-disabled="true">SHARE CLIP</button></div><div class="sh-msg" role="status" aria-live="polite">Developing the photo-finish print…</div>';
    box.appendChild(sc); document.body.classList.add('shared');
    built = { card: null, cardBlob: null, clip: null, d, clipWhy: '' };
    startJob(d);
    sc.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); act(b.dataset.a, b); } });
    sc.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'Enter') e.stopPropagation(); });   // Space/Enter on a focused button activates it, not the game (R, 1, 2 still work)
    return sc;
  }

  async function act(a) {
    if (!built) return say('Nothing to share yet.', 'err');
    const wait = () => (job && job.stage === 'failed' ? (built.clipWhy || job.err) : `The clip is still rendering (${Math.floor((job ? job.progress : 0) * 100)}%). Try again when it says ready.`);
    try {
      if (a === 'card') {
        if (!built.card) return say(job && job.stage === 'strip' ? 'The print is still developing.' : 'No card to download: drawing failed.', 'err');
        download(await built.cardBlob, fname('png')); say('Card PNG downloaded.');
      } else if (a === 'copy') {
        if (!built.card) return say(job && job.stage === 'strip' ? 'The print is still developing.' : 'No card to copy.', 'err');
        if (!canClip()) return say('Copy is not supported here (no image clipboard). Use DOWNLOAD CARD.', 'err');
        if (fault === 'cliperr') throw new Error('clipboard write rejected (test fault)');
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': built.cardBlob })]); say('Card copied to the clipboard. Paste it anywhere.');
      } else if (a === 'clip') {
        if (!built.clip) return say(wait(), job && job.stage === 'failed' ? 'err' : 'warn');
        download(built.clip.blob, fname('webm')); say(`Clip downloaded (${built.clip.durationS.toFixed(1)}s, ${built.clip.frames} frames, WebM).`);
      } else if (a === 'share') {
        if (!built.clip) return say(wait(), job && job.stage === 'failed' ? 'err' : 'warn');
        const file = new File([built.clip.blob], fname('webm'), { type: 'video/webm' });
        if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function' || !navigator.canShare({ files: [file] })) return say('This browser cannot share video files. Use DOWNLOAD CLIP.', 'err');
        await navigator.share({ files: [file], title: TITLE, text: built.d.winName + ' ' + built.d.margin }); say('Shared.');
      }
    } catch (e) {
      const n = e && e.name;
      if (n === 'AbortError') say('Share cancelled.', 'warn');
      else if (n === 'NotAllowedError') say('The browser blocked that (permission denied).', 'err');
      else say((a === 'copy' ? 'Copy failed: ' : a === 'share' ? 'Share failed: ' : 'Export failed: ') + (e && e.message || n || 'unknown error'), 'err');
    }
  }

  const stateOut = () => ({
    fault, stage: job ? job.stage : 'idle', progress: job ? +job.progress.toFixed(2) : 0, clipFailed: job && job.stage === 'failed' ? job.err : null,
    races, stale, ticks: store.n, firstRaceT: store.n ? +store.t[0].toFixed(3) : null, lastRaceT: store.n ? +store.t[store.n - 1].toFixed(2) : null, tickSpanGap: store.n ? +(store.t[store.n - 1] - store.n / 60).toFixed(2) : null, finishTick: store.finish, falls: store.falls.map((f) => f.tick), still: { ok: still.ok, tick: still.tick, lead: still.lead >= 0 ? roles[still.lead].name : null, leadX: still.leadX, w: still.ok ? STILL_W : 0, h: still.ok ? STILL_H : 0 },
    clip: built && built.clip ? { frames: built.clip.frames, planned: built.clip.planned, keyframes: built.clip.keyframes, durationS: built.clip.durationS, headerDurationS: built.clip.headerDurationS, bytes: built.clip.bytes, finishAtS: built.clip.finishAtS, falls: built.clip.falls, segments: built.clip.segments, fallTarget: built.clip.fallTarget, fallSegStartS: built.clip.fallSegStartS, fallSegEndS: built.clip.fallSegEndS, downFrames: built.clip.downFrames, minLuma: built.clip.minLuma, darkFrames: built.clip.darkFrames, current: built.clip.gen === token, raceTMin: built.clip.raceTMin, raceTMax: built.clip.raceTMax } : null,
    panel: !!panel, last: state.last, urls: urls.size, history: state.history.slice(-8),
  });

  return { shareFrame: frame, shareRecord: record, shareReset: reset, shareMount: mount, shareState: stateOut, shareAct: act, shareFault: (v) => { fault = v || ''; }, shareClipBlob: () => (built && built.clip ? built.clip.blob : null) };
}
