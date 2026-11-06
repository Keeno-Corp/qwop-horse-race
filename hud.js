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
      const nm = document.createElement('div'); nm.className = 'nm'; nm.innerHTML = `${i + 1} ${r.name}<small>FACE-PLANTS 0</small>`; d.appendChild(nm);
      const od = document.createElement('div'); od.className = 'od'; od.id = 'od' + i; od.textContent = '3-1'; d.appendChild(od);
      rows.appendChild(d);
    });
    document.querySelectorAll('#prog em').forEach((e) => e.remove());
    roles.forEach((r, i) => { const e = document.createElement('em'); e.id = 'mk' + i; e.style.background = G.hexs(r.color); $('prog').appendChild(e); });
    S.odds = horses.map(() => ({ shown: 3, target: 3, text: '3-1', dir: 0, t: 0 }));
  }

  function clockText() { const sec = 58 * 60 + Math.floor(S.time * 4); const m = Math.floor(sec / 60) % 60, hh = 3 + Math.floor(sec / 3600); return `${hh}:${String(m).padStart(2, '0')} PM`; }

  // face-plant chips, progress markers, timer/clock, flash
  function updateHud() {
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
        if (h.finished && S.order[0] === i) txt = horses.some((o, j) => j !== i && o.finished && Math.abs(o.finishT - h.finishT) < 0.15) ? 'PHOTO' : 'WIN'; else if (h.finished) txt = Math.abs(h.finishT - horses[S.order[0]].finishT) < 0.15 ? 'PHOTO' : '—';
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
    S.popups.forEach((p, i) => { p.el.style.top = (22 + i * 20) + 'vh'; }); // re-stack so two pops never overlap
  }
  // popup lifetimes (called once per tick)
  function updatePopups(dt) {
    for (let i = S.popups.length - 1; i >= 0; i--) { S.popups[i].t -= dt; if (S.popups[i].t <= 0) { S.popups[i].el.remove(); S.popups.splice(i, 1); } }
  }

  function showResults() {
    const { roles, horses, FINISH_X } = G;
    const res = S.results || { order: G.frontOrder().map((h) => h.idx) };
    const worst = horses.reduce((b, h) => (h.plants > horses[b].plants ? h.idx : b), 0); const ord = res.order, maxP = Math.max(...horses.map((h) => h.plants)), minP = Math.min(...horses.map((h) => h.plants));
    const hex = (i) => '#' + roles[i].color.toString(16).padStart(6, '0');
    const pod = [1, 0, 2].filter((k) => ord[k] !== undefined).map((k) => `<div class="p${k + 1}" style="${horses[ord[k]].finished ? '' : 'opacity:.65'}"><i style="background:${hex(ord[k])};width:16px;height:16px;border-radius:50%;border:2px solid #2b1810"></i><span>${roles[ord[k]].name}${horses[ord[k]].finished ? '' : ' (DNF)'}</span><b>${k + 1}</b></div>`).join('');
    const w = horses[ord[0]], rows = ord.map((i, k) => {
      const h = horses[i], t = h.finished ? h.finishT.toFixed(2) + 's' + (k ? ' (+' + (h.finishT - w.finishT).toFixed(2) + ')' : '') : 'DNF · ' + Math.max(0, FINISH_X - h.headTip().x).toFixed(0) + ' m short';
      const aw = (i === worst && maxP > 0 ? '<span class="award">DIRT EATER · MOST FACE-PLANTS</span>' : '') + (h.plants === minP && minP < maxP && h.finished ? '<span class="award g">SMOOTH OPERATOR</span>' : '');
      return `<tr><td class="n">${k + 1}</td><td><i style="background:${hex(i)}"></i>${roles[i].name}${aw}</td><td>${t}</td><td class="n">${h.plants} face-plant${h.plants === 1 ? '' : 's'}</td></tr>`;
    }).join('');
    const photo = res.gap < 1.0 ? `PHOTO FINISH · ${res.gap.toFixed(2)}s` : 'RESULTS';
    $('results').querySelector('.box').innerHTML = `<h1>${roles[ord[0]].name === 'YOU' ? 'YOU WIN!' : roles[ord[0]].name + ' WINS!'}<small>${photo}</small></h1><div class="pod">${pod}</div><table>${rows}</table>${maxP > 0 ? `<div class="hint" style="font-size:14px;color:var(--tomato);font-weight:bold">MOST FACE-PLANTS: ${roles[worst].name} (${maxP})</div>` : ''}<div class="hint">${G.mode === 1 ? 'Press R' : 'Press Enter'} for another race · 1 / 2 = players</div>`;
    $('results').style.display = 'flex'; S.resultsShown = true; for (const p of S.popups) p.el.remove(); S.popups = [];
  }

  return { buildHud, updateHud, updateOdds, clockText, popup, updatePopups, showResults };
}
