// Made with paprika3d · https://paprika3d.com
// Share team (d): slit-scan photo-finish print, the "official result" card (PNG), a rolling WebM recorder of the real rendered canvas,
// and the inline share panel on the results graphic. Browser features are probed lazily so unsupported/failing APIs report honestly.
import { silksCanvas } from './view.js';

const SEG_MS = 7000, STAGGER_MS = 3500, MIN_SEG_MS = 2500, KEEP = 3, CLIP_W = 640, CLIP_FPS = 30, MAX_COLS = 1400, STRIP_H = 360;
const TITLE = 'The Photo Finish Fiasco Stakes';
const pad = (n) => String(n).padStart(2, '0');

export function createShare(G) {
  const { S, $, horses, roles } = G;
  const now = () => performance.now();
  let fault = '';   // test seam (setState({shareFault})): 'norec' | 'noclip' | 'cliperr' | 'cardfail' to exercise the unsupported/error paths

  // ---------- clip recorder: two staggered MediaRecorders cut self-contained <=7 s WebM segments of a downscaled copy of the canvas ----------
  const rec = { cv: null, ctx: null, stream: null, mime: null, slots: [], segs: [], events: [], lastDraw: 0, startedAt: 0, active: false, failed: null, plants: [] };
  const pickMime = () => {
    if (fault === 'norec' || typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return null;
    return ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch { return false; } }) || null;
  };
  function recStart(src) {
    if (rec.active || rec.failed) return;
    rec.mime = pickMime();
    if (!rec.mime || !src.captureStream) { rec.failed = !rec.mime ? 'This browser has no WebM recorder (MediaRecorder).' : 'This canvas cannot be captured.'; return; }
    try {
      rec.cv = document.createElement('canvas'); rec.cv.width = CLIP_W; rec.cv.height = Math.max(2, Math.round(CLIP_W * src.height / src.width / 2) * 2);
      rec.ctx = rec.cv.getContext('2d'); rec.ctx.drawImage(src, 0, 0, rec.cv.width, rec.cv.height);
      rec.stream = rec.cv.captureStream(CLIP_FPS); rec.active = true; rec.startedAt = now();
      openSlot(0); rec.slots[1] = null; rec.slot1At = rec.startedAt + STAGGER_MS;
    } catch (e) { rec.failed = 'Recorder could not start: ' + (e && e.message || e); recStop(); }
  }
  function openSlot(i) {
    const slot = { t0: now(), chunks: [], r: null };
    try {
      slot.r = new MediaRecorder(rec.stream, { mimeType: rec.mime, videoBitsPerSecond: 1_400_000 });
      slot.r.ondataavailable = (e) => { if (e.data && e.data.size) slot.chunks.push(e.data); };
      slot.r.onerror = (e) => { rec.failed = 'Recorder error: ' + ((e.error && e.error.message) || 'unknown'); };
      slot.done = new Promise((res) => { slot.r.onstop = () => { slot.t1 = now(); res(closeSlot(slot)); }; });
      slot.r.start(); rec.slots[i] = slot;
    } catch (e) { rec.failed = 'Recorder could not start: ' + (e && e.message || e); rec.slots[i] = null; }
  }
  function scoreSeg(t0, t1) {
    let s = 0; for (const ev of rec.events) if (ev.t >= t0 + 300 && ev.t <= t1 - 200) s += ev.w; return s;
  }
  function closeSlot(slot) {
    const dur = slot.t1 - slot.t0;
    if (dur < MIN_SEG_MS || !slot.chunks.length || rec.discard) return;
    const blob = new Blob(slot.chunks, { type: rec.mime.split(';')[0] });
    rec.segs.push({ blob, t0: slot.t0, t1: slot.t1, dur, score: scoreSeg(slot.t0, slot.t1) });
    // bounded memory: keep the newest segment and the best-scoring others
    if (rec.segs.length > KEEP) { const newest = rec.segs[rec.segs.length - 1]; const rest = rec.segs.slice(0, -1).sort((a, b) => b.score - a.score || b.t1 - a.t1); rec.segs = [...rest.slice(0, KEEP - 1), newest]; }
  }
  function recTick(src) {   // after each rendered frame
    if (!rec.active) return;
    const t = now();
    if (t - rec.lastDraw >= 1000 / CLIP_FPS - 2) { rec.lastDraw = t; try { rec.ctx.drawImage(src, 0, 0, rec.cv.width, rec.cv.height); } catch { /* lost context: keep going */ } }
    for (let i = 0; i < 2; i++) {
      const s = rec.slots[i];
      if (s && s.r && s.r.state === 'recording' && t - s.t0 >= SEG_MS) { const j = i; s.r.stop(); rec.slots[j] = null; openSlot(j); }
      else if (!s && i === 1 && rec.slot1At && t >= rec.slot1At) { rec.slot1At = 0; openSlot(1); }
    }
  }
  async function recFinish() {   // stop both slots, wait for their blobs, pick the best <=10 s segment
    if (!rec.active) return;
    const open = rec.slots.filter((s) => s && s.r && s.r.state === 'recording'); rec.slots = [null, null]; rec.active = false;
    for (const s of open) { try { s.r.stop(); } catch { /* already stopped */ } }
    await Promise.all(open.map((s) => s.done)).catch(() => {});
    if (rec.stream) { rec.stream.getTracks().forEach((t) => t.stop()); rec.stream = null; }
    for (const g of rec.segs) { g.score = scoreSeg(g.t0, g.t1); g.fin = rec.events.some((e) => e.kind === 'finish' && e.t >= g.t0 + 300 && e.t <= g.t1 - 200); }
    // finish first (the clip must show the line when any segment caught it), then the most face-plants, then the newest
    rec.segs.sort((a, b) => (b.fin - a.fin) || b.score - a.score || b.t1 - a.t1);
    return rec.segs[0] || null;
  }
  function recStop() {
    rec.discard = true;
    for (const s of rec.slots) if (s && s.r && s.r.state === 'recording') { try { s.r.stop(); } catch { /* ok */ } }
    rec.slots = [null, null]; rec.active = false; rec.slot1At = 0;
    if (rec.stream) { rec.stream.getTracks().forEach((t) => t.stop()); rec.stream = null; }
    rec.cv = rec.ctx = null; rec.segs = []; rec.events = [];
    setTimeout(() => { rec.discard = false; }, 0);
  }

  // ---------- slit-scan: one pixel column at the finish line per rendered frame ----------
  const strip = { buf: {}, mark: -1 };
  function stripReset() { strip.buf = {}; strip.mark = -1; }
  // True slit-scan: every frame the real scene is rendered by a fixed, normal-FOV camera standing side-on to the finish line (the near pole hidden),
  // the single pixel column at the line is read back and appended to the print. Time runs left to right.
  const RT_W = 640, RT_H = STRIP_H;
  let slit = null;
  function slitInit() {
    const T = G.THREE, rt = new T.WebGLRenderTarget(RT_W, RT_H, { depthBuffer: true });
    rt.texture.colorSpace = T.SRGBColorSpace;
    const cam = new T.PerspectiveCamera(22, RT_W / RT_H, 1, 80);
    cam.position.set(G.FINISH_X, 1.7, 17); cam.lookAt(G.FINISH_X, 1.6, 0); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    slit = { rt, cam, px: new Uint8Array(RT_H * 4), img: new ImageData(1, RT_H) };
  }
  function slitDisposeAll() { if (slit) { slit.rt.dispose(); slit = null; } }
  function sampleCol(buf) {
    if (!slit) slitInit();
    const r = G.renderer, { rt, cam, px, img } = slit, prevRT = r.getRenderTarget(), prevAuto = r.shadowMap.autoUpdate, near = G.env.finNear, nv = near && near.visible;
    try {
      r.shadowMap.autoUpdate = false; if (near) near.visible = false; G.scene.visible = true;
      r.setRenderTarget(rt); r.clear(); r.render(G.scene, cam);
      r.readRenderTargetPixels(rt, RT_W >> 1, 0, 1, RT_H, px);   // the centre column only
    } finally { r.setRenderTarget(prevRT); r.shadowMap.autoUpdate = prevAuto; if (near) near.visible = nv; }
    let any = 0; for (let i = 0; i < px.length; i += 16) any |= px[i] | px[i + 1] | px[i + 2];
    if (!any) return;   // the readback came back blank (lost context, tab not drawing): never put an empty column in the print
    if (!buf.cv) { buf.cv = document.createElement('canvas'); buf.cv.width = MAX_COLS; buf.cv.height = STRIP_H; buf.ctx = buf.cv.getContext('2d'); buf.n = 0; buf.act = []; buf.base = null; }
    const d = img.data; let act = 0;
    for (let y = 0; y < RT_H; y++) { const o = (RT_H - 1 - y) * 4; d[y * 4] = px[o]; d[y * 4 + 1] = px[o + 1]; d[y * 4 + 2] = px[o + 2]; d[y * 4 + 3] = 255; }   // GL rows run bottom-up
    buf.ctx.putImageData(img, buf.n, 0);
    // activity: distance from the empty-track column seen first, so the print can be cropped to the horses crossing
    if (buf.n < 4) buf.base = buf.base ? buf.base.map((v, i) => (v * buf.n + d[i]) / (buf.n + 1)) : Array.from(d);
    else for (let i = 0; i < d.length; i += 4) act += Math.abs(d[i] - buf.base[i]) + Math.abs(d[i + 1] - buf.base[i + 1]) + Math.abs(d[i + 2] - buf.base[i + 2]);
    buf.act.push(act / (RT_H * 3)); buf.n++;
  }
  function stripCols() {
    if (S.phase !== 'race' && S.phase !== 'finishing') return;
    const lead = Math.max(...horses.map((h) => h.headTip().x));
    if (lead < G.FINISH_X - 5 || (strip.buf.n || 0) >= MAX_COLS) return;
    sampleCol(strip.buf);
    if (strip.mark < 0 && S.firstFinish !== null) strip.mark = strip.buf.n - 1;
  }

  // ---------- per-frame hook (called right after the renderer drew, while the canvas is still readable) ----------
  let seenPlants = [0, 0, 0, 0], seenFinish = false, startedRace = false;
  function frame(src) {
    if (!src || !src.width) return;
    if (S.phase === 'countdown') { seenPlants = horses.map((h) => h.plants); seenFinish = false; startedRace = false; return; }
    if (!startedRace && (S.phase === 'race' || S.phase === 'finishing')) { startedRace = true; recStart(src); }
    horses.forEach((h, i) => { if (h.plants > seenPlants[i]) { seenPlants[i] = h.plants; rec.events.push({ t: now(), w: roles[i].human >= 0 ? 3 : 2, kind: 'plant', horse: i }); } });
    if (!seenFinish && S.firstFinish !== null) { seenFinish = true; rec.events.push({ t: now(), w: 100, kind: 'finish' }); }
    if (S.phase === 'replay' && S.replay && S.replay.kind === 'finish' && !rec.finRep) { rec.finRep = true; rec.events.push({ t: now(), w: 60, kind: 'finish-replay' }); }
    if (S.phase !== 'results') { recTick(src); stripCols(); }
  }

  // ---------- reset on every restart ----------
  const urls = new Set(); let panel = null, built = null, token = 0, statusT = 0;
  function reset() {
    token++; recStop(); stripReset(); slitDisposeAll(); rec.failed = null; rec.finRep = false; startedRace = false; seenFinish = false; seenPlants = [0, 0, 0, 0]; rec.slot1At = 0;
    for (const u of urls) URL.revokeObjectURL(u); urls.clear();
    built = null; panel = null; clearTimeout(statusT); document.body.classList.remove('shared');
  }
  addEventListener('pagehide', () => { token++; recStop(); slitDisposeAll(); for (const u of urls) URL.revokeObjectURL(u); urls.clear(); });

  // ---------- card ----------
  const hex = (n) => '#' + n.toString(16).padStart(6, '0');
  function paintStrip(ctx, x, y, w, h, hasPrint) {
    const src = (strip.buf.n || 0) >= 20 ? { cv: strip.buf.cv, n: strip.buf.n, buf: strip.buf } : null;
    ctx.fillStyle = '#2b1810'; ctx.fillRect(x, y, w, h);
    if (!src) {
      ctx.fillStyle = '#f2e1ad'; ctx.font = '22px Bungee, Impact, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('NO PRINT: THE CAMERA NEVER CAUGHT THE LINE', x + w / 2, y + h / 2 + 8); ctx.textAlign = 'left'; return false;
    }
    let c0 = 0, c1 = src.n;   // crop to the stretch where something crossed the line (activity above the empty-track baseline), with a little margin either side
    const act = src.buf.act; if (act && act.length > 30) { const thr = Math.max(14, 0.35 * Math.max(...act)); const on = act.map((a, i) => (a > thr ? i : -1)).filter((i) => i >= 0); if (on.length > 8) { c0 = Math.max(0, on[0] - 14); c1 = Math.min(src.n, on[on.length - 1] + 14); if (c1 - c0 < 40) { c0 = Math.max(0, c0 - 20); c1 = Math.min(src.n, c1 + 20); } } }
    src.c0 = c0; src.c1 = c1; ctx.imageSmoothingEnabled = true; ctx.drawImage(src.cv, c0, 0, c1 - c0, STRIP_H, x, y, w, h);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,168,104,.55)'; ctx.fillRect(x, y, w, h); ctx.restore();   // sepia tint of the print
    ctx.fillStyle = 'rgba(43,24,16,.35)'; for (let k = 0; k < w; k += 3) ctx.fillRect(x + k, y, 1, h);   // gate-weave grain
    ctx.fillStyle = '#f2e1ad'; for (let k = 0; k <= c1 - c0; k += 30) { const tx = x + (k / (c1 - c0)) * w; ctx.fillRect(tx, y + h - 12, 2, 12); ctx.fillRect(tx, y, 2, 8); }   // half-second ticks
    if (strip.mark >= c0 && strip.mark <= c1) { const mx = x + ((strip.mark - c0) / (c1 - c0)) * w; ctx.fillStyle = '#d3432b'; ctx.fillRect(mx - 1, y, 3, h); ctx.font = '16px Bungee, Impact, sans-serif'; ctx.fillText('FIRST NOSE', Math.min(mx + 8, x + w - 120), y + 24); }
    return true;
  }
  function drawCard(d) {
    if (fault === 'cardfail') throw new Error('canvas unavailable (test fault)');
    const W = 1200, H = 860, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const SH = 'Shrikhand, Georgia, serif', BU = 'Bungee, Impact, sans-serif', INK = '#2b1810', CHOC = '#4c2c21', CREAM = '#f2e1ad', TOM = '#d3432b', MUS = '#e5af2c';
    c.fillStyle = CREAM; c.fillRect(0, 0, W, H);
    const cols = [TOM, MUS, '#305da2', '#95a641']; for (let i = 0; i < W; i += 50) { c.fillStyle = cols[(i / 50) % 4]; c.fillRect(i, 0, 50, 34); }
    c.fillStyle = INK; c.fillRect(0, 34, W, 5);
    c.textAlign = 'center'; c.fillStyle = TOM; c.font = `22px ${BU}`; c.fillText('CHANNEL 7 · RACE OF THE WEEK · OFFICIAL PHOTO FINISH', W / 2, 78);
    let tp = 74; do { c.font = `${tp}px ${SH}`; tp -= 2; } while (c.measureText(TITLE).width > W - 120 && tp > 24);   // fit between the borders
    c.fillStyle = MUS; c.fillText(TITLE, W / 2 + 4, 154); c.fillStyle = CHOC; c.fillText(TITLE, W / 2, 150);
    c.textAlign = 'left';
    // print
    const px = 50, py = 176, pw = W - 100, ph = 190;
    c.fillStyle = INK; c.fillRect(px - 8, py - 8, pw + 16, ph + 16); paintStrip(c, px, py, pw, ph);
    c.fillStyle = CHOC; c.font = `15px ${BU}`; c.fillText('SLIT-SCAN PRINT · FIXED CAMERA ON THE LINE, ONE SLICE PER FRAME', px, py + ph + 30);
    // winner banner
    c.fillStyle = TOM; c.fillRect(50, 404, W - 100, 62); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(50, 404, W - 100, 62);
    c.fillStyle = CREAM; c.font = `40px ${SH}`; c.fillText(d.winName, 70, 449); c.textAlign = 'right'; c.font = `20px ${BU}`; c.fillText(d.margin, W - 70, 445); c.textAlign = 'left';
    // placings
    d.rows.forEach((r, k) => {
      const y = 486 + k * 68;
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

  function mount(box, d) {
    reset2();
    const my = ++token; const sc = document.createElement('div'); sc.className = 'share'; panel = sc;
    sc.innerHTML = '<div class="sh-hd"><b>SHARE THE PRINT</b><span class="sh-clip">CLIP: …</span></div><img class="sh-th" alt="Photo-finish print">' +
      '<div class="sh-btns"><button data-a="card">DOWNLOAD CARD</button><button data-a="copy">COPY CARD</button><button data-a="clip">DOWNLOAD CLIP</button><button data-a="share">SHARE CLIP</button></div><div class="sh-msg" role="status" aria-live="polite">Building your print…</div>';
    box.appendChild(sc); document.body.classList.add('shared');
    built = { card: null, cardBlob: null, clip: null, d };
    try { built.card = drawCard(d); { const t = document.createElement('canvas'); t.width = 680; t.height = 117; paintStrip(t.getContext('2d'), 0, 0, 680, 117); sc.querySelector('.sh-th').src = t.toDataURL('image/png'); } built.cardBlob = toBlob(built.card); built.cardBlob.catch(() => {}); say('Print ready. Pick a button.'); }
    catch (e) { built.card = null; say('Could not draw the card: ' + (e && e.message || e), 'err'); }
    const clipEl = sc.querySelector('.sh-clip');
    if (rec.failed) { clipEl.textContent = 'CLIP: UNAVAILABLE'; sc.querySelector('[data-a=clip]').classList.add('off'); sc.querySelector('[data-a=share]').classList.add('off'); }
    recFinish().then((seg) => {
      if (my !== token || !panel) return;
      if (!seg) { clipEl.textContent = rec.failed ? 'CLIP: UNAVAILABLE' : 'CLIP: NONE RECORDED'; sc.querySelectorAll('[data-a=clip],[data-a=share]').forEach((b) => b.classList.add('off')); built.clipWhy = rec.failed || 'No clip was recorded for this race (it ended too quickly or the recorder produced nothing).'; return; }
      built.clip = seg; const n = rec.events.filter((e) => e.kind === 'plant' && e.t >= seg.t0 && e.t <= seg.t1).length;
      clipEl.textContent = `CLIP ${(seg.dur / 1000).toFixed(1)}S · ${(seg.blob.size / 1048576).toFixed(1)}MB · ${n} PLANT${n === 1 ? '' : 'S'}`;
      if (typeof navigator.canShare !== 'function' || typeof navigator.share !== 'function') sc.querySelector('[data-a=share]').classList.add('off');
    });
    sc.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); act(b.dataset.a, b); } });
    sc.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'Enter') e.stopPropagation(); });   // Space/Enter on a focused button activates it, not the game (R, 1, 2 still work)
    return sc;
  }
  function reset2() { clearTimeout(statusT); }

  async function act(a, btn) {
    if (!built) return say('Nothing to share yet.', 'err');
    try {
      if (a === 'card') {
        if (!built.card) return say('No card to download: ' + (state.last ? state.last.msg : 'drawing failed'), 'err');
        download(await built.cardBlob, fname('png')); say('Card PNG downloaded.');
      } else if (a === 'copy') {
        if (!built.card) return say('No card to copy.', 'err');
        if (!canClip()) return say('Copy is not supported here (no image clipboard). Use DOWNLOAD CARD.', 'err');
        if (fault === 'cliperr') throw new Error('clipboard write rejected (test fault)');
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': built.cardBlob })]); say('Card copied to the clipboard. Paste it anywhere.');
      } else if (a === 'clip') {
        if (!built.clip) return say(built.clipWhy || 'Clip is still finishing. Try again in a second.', 'err');
        download(built.clip.blob, fname('webm')); say(`Clip downloaded (${(built.clip.dur / 1000).toFixed(1)}s WebM).`);
      } else if (a === 'share') {
        if (!built.clip) return say(built.clipWhy || 'Clip is still finishing. Try again in a second.', 'err');
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

  const stateOut = () => ({ fault, recorderFailed: rec.failed, mime: rec.mime, segments: rec.segs.length, events: rec.events.length, stripCols: strip.buf.n || 0, firstNoseCol: strip.mark, activeCols: (strip.buf.act || []).filter((a) => a > 14).length,
    clip: built && built.clip ? { dur: +(built.clip.dur / 1000).toFixed(2), bytes: built.clip.blob.size, score: built.clip.score, hasFinish: !!built.clip.fin } : null, panel: !!panel, last: state.last, urls: urls.size, active: rec.active, history: state.history.slice(-8) });

  return { shareFrame: frame, shareReset: reset, shareMount: mount, shareState: stateOut, shareAct: act, shareFault: (v) => { fault = v || ''; } };
}
