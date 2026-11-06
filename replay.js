// Replay/camera team (a): the pose recorder ring buffer and the instant / photo-finish replays.
export function createReplay(G) {
  const { THREE, S, horses, views, bc, env, $, FINISH_X } = G;
  const NP = horses[0].parts.length, FRAME = 4 * NP * 7, RING = 300;
  const ring = new Float32Array(RING * FRAME); let ringN = 0;
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

  function setReplayUi(on, kind) {
    if (env.finNear) env.finNear.visible = !(on && kind === 'finish');
    document.body.classList.toggle('replaying', on); document.body.classList.toggle('pfin', on && kind === 'finish');
    $('replay').style.display = on ? 'block' : 'none'; $('pf').style.display = on && kind === 'finish' ? 'block' : 'none';
    $('rtag').textContent = kind === 'finish' ? 'REPLAY 0.25x' : 'INSTANT REPLAY · 0.25x';
    if (on && kind === 'finish') { const g = S.pfGap ?? 9; $('pfc').textContent = 'WINNER: ' + (S.pfWinner || '?') + (g < 1 ? ' · BY ' + g.toFixed(2) + ' SEC' : ' · OFFICIAL') + ' · HOLD ALL TICKETS'; }
    if (on) { bc.U.uGlitch.value = 1; }
  }
  function startFinishReplay() {
    const { roles } = G;
    if (S.phase === 'replay' || S.phase === 'results') return;
    const order = G.frontOrder(), w = order[0];
    const gap = order[1] && order[1].finished ? order[1].finishT - w.finishT : 9;
    S.results = { order: order.map((h) => h.idx), gap };
    G.popup(gap < 1.0 ? 'PHOTO FINISH!' : 'WINNER!', roles[w.idx].name + (gap < 0.5 ? ' by a nose (' + gap.toFixed(2) + 's)!' : ' takes it!'), '#e5af2c', 2.4);
    G.say(gap < 0.5 ? G.line('tied') : G.line('win', roles[w.idx].name), 5, 5); S.pfGap = gap; S.pfWinner = roles[w.idx].name;
    const start = Math.max(Math.max(0, ringN - RING + 2), (S.firstFinishFrame || ringN - 1) - 24), end = Math.min(ringN - 1, start + 64);
    S.replay = { kind: 'finish', start, end, pos: start, subject: w.idx, snap: true }; applyFrame(start);
    S.phase = 'replay'; setReplayUi(true, 'finish'); S.flash = 0.5; G.cue('replayFinish');
    G.camPos.set(FINISH_X + 4, 1.3, 10); G.camLook.set(FINISH_X - 0.5, 1.0, 0);
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
    if (rp.kind === 'finish') { S.phase = 'results'; G.showResults(); }
    else S.phase = S.prevPhase || 'race';
  }
  // the S.phase === 'replay' branch of tick()
  function advanceReplay(dt) {
    const rp = S.replay; rp.pos += (0.25) * dt * 60;
    if (rp.pos >= rp.end) endReplay(); else applyFrame(rp.pos);
  }
  // sepia/glitch blending of the broadcast pass (once per tick)
  function blendReplayShader(dt) {
    const rk = S.phase === 'replay' && S.replay ? S.replay.kind : null;
    bc.U.uReplay.value += ((rk === 'finish' ? 1 : 0) - bc.U.uReplay.value) * Math.min(1, dt * 14);
    bc.U.uGlitch.value = Math.max(rk === 'plant' ? 0.12 : 0, bc.U.uGlitch.value - dt * 2.2);
  }

  return { NP, FRAME, RING, ring, get ringN() { return ringN; }, set ringN(v) { ringN = v; }, record, applyFrame, subjectAt, setReplayUi, startFinishReplay, startPlantReplay, endReplay, advanceReplay, blendReplayShader };
}
