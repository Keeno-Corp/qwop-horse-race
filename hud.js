// Presentation team (c): tote board, progress bar, timer/clock, flash, odds, popups and the results card.
import { silksCanvas } from './view.js';

export function createHud(G) {
  const { S, $, clamp, rr, THREE } = G;

  // tote rows, progress markers, odds state (the keys panel is controls.js)
  function buildHud() {
    const { roles, horses } = G;
    const tote = $('tote'); tote.innerHTML = '<div class="hd"><b>Tote</b><span>WIN ODDS</span></div><div class="bar"></div><div class="rows"></div>';
    const rows = tote.querySelector('.rows');
    roles.forEach((r, i) => {
      const d = document.createElement('div'); d.className = 'row' + (r.human >= 0 ? ' me' : ''); d.id = 'chip' + i;
      const cv = new Image(); cv.src = silksCanvas(r.silk.kind, r.silk.a, r.silk.b, 64, 64).toDataURL(); d.appendChild(cv);
      const nm = document.createElement('div'); nm.className = 'nm'; nm.innerHTML = `${i + 1} ${G.dn(r.name)}<small>FACE-PLANTS 0</small>`; d.appendChild(nm);
      const od = document.createElement('div'); od.className = 'od'; od.id = 'od' + i; od.textContent = '3-1'; d.appendChild(od);
      rows.appendChild(d);
    });
    document.querySelectorAll('#prog em').forEach((e) => e.remove());
    roles.forEach((r, i) => { const e = document.createElement('em'); e.id = 'mk' + i; e.style.background = G.hexs(r.color); $('prog').appendChild(e); });
    S.odds = horses.map(() => ({ shown: 3, target: 3, text: '3-1', dir: 0, t: 0 }));
  }

  function clockText() { const sec = 58 * 60 + Math.floor(S.time * 4); const m = Math.floor(sec / 60) % 60, hh = 3 + Math.floor(sec / 3600); return `${hh}:${String(m).padStart(2, '0')} PM`; }

  // face-plant chips, progress markers, timer/clock, flash
  let updateHud = function updateHud0() {
    const { roles, horses, FINISH_X, bc } = G;
    roles.forEach((r, i) => {
      const h = horses[i], chip = $('chip' + i), s = chip.querySelector('small'), txt = 'FACE-PLANTS ' + h.plants + (h.state === 'down' ? ' · OUCH' : '');
      if (s.textContent !== txt) s.textContent = txt;
      $('mk' + i).style.left = (clamp(h.pos().x / FINISH_X, 0, 1) * 100) + '%';
    });
    $('timer').textContent = 'RACE TIME ' + S.raceT.toFixed(1) + 's'; const ck = clockText(); if ($('clock').textContent !== ck) $('clock').textContent = ck;
    const f = $('flash'); if (S.flash > 0) { S.flash = Math.max(0, S.flash - 0.06); f.style.opacity = (S.flash * 0.35).toFixed(2); bc.U.uFlash.value = S.flash * 0.12; } else if (f.style.opacity !== '0') { f.style.opacity = 0; bc.U.uFlash.value = 0; }
  }

  function updateOdds(dt) {
    const { horses, roles, env } = G;
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
        if (h.finished && S.order[0] === i) txt = horses.some((o, j) => j !== i && o.finished && Math.abs(o.finishT - h.finishT) < 0.15) ? 'PHOTO' : 'WIN'; else if (h.finished) { const pl = S.order.indexOf(i); txt = Math.abs(h.finishT - horses[S.order[0]].finishT) < 0.15 ? 'PHOTO' : ['WIN', '2ND', '3RD', '4TH'][pl] || 'PLC'; }
        if (txt !== o.text) { o.dir = v > (o.last || v) ? -1 : 1; o.last = v; o.text = txt; const el = $('od' + i); if (el) { el.textContent = txt; el.className = 'od ' + (o.dir > 0 ? 'up' : 'dn'); setTimeout(() => el && (el.className = 'od'), 700); } }
      }
    });
    S.toteT = (S.toteT || 0) - dt;
    if (S.toteT <= 0 && env.tote) { S.toteT = 0.5; env.tote.draw(horses.map((h, i) => ({ name: roles[i].name, silk: roles[i].silk, odds: S.odds[i].text, hot: S.odds[i].dir > 0 })), S.phase === 'countdown' ? 'WIN ODDS' : 'LIVE ODDS'); }
  }

  function popup(text, sub = '', color = '#ffd27a', life = 1.7) {
    const last = S.lastPopup[text] ?? -9; if (S.time - last < 1.4) return; S.lastPopup[text] = S.time;
    while (S.popups.length > 1) S.popups.shift().el.remove();
    const el = document.createElement('div'); el.className = 'pop'; el.style.background = color;
    el.style.setProperty('--r', rr(-6, 6).toFixed(1) + 'deg'); el.style.animation = `pop ${life}s ease-out forwards`;
    el.style.left = '50%';
    el.innerHTML = G.gram(text) + (sub ? `<span>${G.gram(sub)}</span>` : ''); $('popups').appendChild(el); S.popups.push({ el, t: life });
    placePops();
  }
  // popups sit upper-centre; during a director cut (head-on cam) they shrink into the top-right corner so the cut stays clear
  function placePops() {
    const cut = !!(G.CUT && G.CUT.kind);
    S.popups.forEach((p, i) => { p.el.classList.toggle('cut', cut); p.el.style.top = cut ? (21 + i * 11) + 'vh' : (22 + i * 20) + 'vh'; }); // re-stack so two pops never overlap
  }
  // popup lifetimes (called once per tick)
  function updatePopups(dt) {
    for (let i = S.popups.length - 1; i >= 0; i--) { S.popups[i].t -= dt; if (S.popups[i].t <= 0) { S.popups[i].el.remove(); S.popups.splice(i, 1); } }
    if (S.popups.length && S.popups.some((p) => p.el.classList.contains('cut') !== !!(G.CUT && G.CUT.kind))) placePops();
  }

  function showResults() {
    const { roles, horses, FINISH_X } = G, dn = G.dn;
    const res = S.results || { order: G.frontOrder().map((h) => h.idx), gap: 9 };
    const ord = res.order, maxP = Math.max(...horses.map((h) => h.plants)), minP = Math.min(...horses.map((h) => h.plants));
    const worst = horses.reduce((b, h) => (h.plants > horses[b].plants ? h.idx : b), 0);
    const smooth = minP < maxP ? ord.find((i) => horses[i].finished && horses[i].plants === minP) : undefined;   // one award only: best-placed of the fewest plants
    const hex = (i) => '#' + roles[i].color.toString(16).padStart(6, '0');
    const w = horses[ord[0]], gap = res.gap ?? 9, ORD = ['1ST', '2ND', '3RD', '4TH'];
    const by = gap < 0.3 ? 'BY A NOSE' : gap < 0.8 ? 'BY A HEAD' : gap < 3 ? 'BY A LENGTH' : 'BY ' + gap.toFixed(1) + ' S';
    const margin = w.finished && gap < 9 ? `${by} · ${gap.toFixed(2)} S` : 'GOING AWAY';
    const rows = ord.map((i, k) => {
      const h = horses[i], t = h.finished ? h.finishT.toFixed(2) + 's' + (k ? '<em>+' + (h.finishT - w.finishT).toFixed(2) + '</em>' : '') : 'DNF<em>' + Math.max(0, FINISH_X - h.headTip().x).toFixed(0) + ' m short</em>';
      const aw = (i === worst && maxP > 0 ? '<span class="award">DIRT EATER</span>' : '') + (i === smooth ? '<span class="award g">SMOOTH OPERATOR</span>' : '');
      return `<li class="${k === 0 ? 'w' : ''}"><b class="pl">${k + 1}</b><i style="background:${hex(i)}"></i><span class="nm">${dn(roles[i].name)}${aw}</span><span class="tm">${t}</span></li>`;
    }).join('');
    const winName = roles[ord[0]].name === 'YOU' ? 'YOU WIN!' : dn(roles[ord[0]].name) + ' WINS!';
    $('results').querySelector('.box').innerHTML = `<div class="top"><span>CHANNEL 7</span><b>OFFICIAL RESULT</b></div><h1>${winName}<small>${gap < 1 ? 'PHOTO FINISH · ' : ''}${margin}</small></h1><ol>${rows}</ol>${maxP > 0 ? `<div class="most">MOST FACE-PLANTS: ${dn(roles[worst].name)} (${maxP})</div>` : ''}<div class="hint">${G.mode === 1 ? 'Press R' : 'Press Enter'} for another race · 1 / 2 = players</div>`;
    $('results').style.display = 'flex'; S.resultsShown = true; for (const p of S.popups) p.el.remove(); S.popups = [];
  }

  // evidence for tests: observe().hud (DOM checks) and observe().crowd (instance matrices of the stands)
  let wrapped = false;
  function wrapObserve() {
    const gm = window.__game; if (wrapped || !gm || !gm.observe) return; wrapped = true;
    const ob = gm.observe, R = (e) => e.getBoundingClientRect();
    gm.observe = () => {
      const clipped = []; document.querySelectorAll('#tote .row, #tote .row *').forEach((e) => { if (e.scrollWidth > e.clientWidth + 0.5) clipped.push((e.className || e.tagName) + ':' + e.textContent.slice(0, 20)); });
      const cx0 = innerWidth * 0.35, cx1 = innerWidth * 0.65, cy0 = innerHeight * 0.3, cy1 = innerHeight * 0.7;
      const pops = [...document.querySelectorAll('.pop')].map((e) => { const r = R(e); return { cut: e.classList.contains('cut'), l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), overlapsCentre: r.right > cx0 && r.left < cx1 && r.bottom > cy0 && r.top < cy1 }; });
      let arms = null, bodies = null; G.scene.traverse((o) => { if (o.isInstancedMesh && o.name === 'crowd') { if (o.geometry.type === 'BoxGeometry') arms = o; else if (o.geometry.type === 'CylinderGeometry') bodies = o; } });
      let crowd = null;
      if (arms && bodies) { let up = 0, ys = 0, hs = 0; for (let i = 0; i < arms.count; i++) if (arms.instanceMatrix.array[i * 16 + 5] > 0.5) up++; for (let i = 0; i < bodies.count; i++) { ys += bodies.instanceMatrix.array[i * 16 + 13]; hs += bodies.instanceMatrix.array[i * 16 + 5]; } crowd = { armsUpFrac: +(up / arms.count).toFixed(3), meanBodyY: +(ys / bodies.count).toFixed(3), meanBodyH: +(hs / bodies.count).toFixed(3), excite: +S.excite.toFixed(2), sum: +arms.instanceMatrix.array.reduce((a, b) => a + b, 0).toFixed(2) }; }
      const res = $('results');
      return { ...ob(), crowd, hud: { toteClipped: clipped.length, clipped, odds: [...document.querySelectorAll('#tote .od')].map((e) => e.textContent), cut: G.CUT.kind, pops, popOverlapCentre: pops.filter((p) => p.overlapsCentre).length, resultsShown: res.style.display === 'flex', hint: (res.querySelector('.hint') || {}).textContent || null, smoothCount: res.querySelectorAll('.award.g').length, resultsRect: res.querySelector('.box') ? (({ left, top, right, bottom }) => [left, top, right, bottom].map(Math.round))(R(res.querySelector('.box'))) : null, resultsText: (res.querySelector('.box') || {}).textContent || '' } };
    };
  }
  const _uh = updateHud; updateHud = function () { wrapObserve(); return _uh.apply(this, arguments); };

  return { buildHud, updateHud, updateOdds, clockText, popup, updatePopups, showResults };
}
