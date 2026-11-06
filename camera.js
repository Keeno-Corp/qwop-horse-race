// Replay/camera team (a): follow cam, director cuts, replay cams, shake, sun follow.
export function createCamera(G) {
  const { THREE, S, camera, sun, bc, clamp, FINISH_X } = G;
  const camPos = new THREE.Vector3(-8, 5, 15), camLook = new THREE.Vector3(2, 1, 0);
  const tp = new THREE.Vector3(), tl = new THREE.Vector3();
  function followTarget() {
    const { roles, horses } = G;
    const humans = roles.map((r, i) => r.human >= 0 ? horses[i].pos().x : null).filter((v) => v !== null);
    const hx = humans.reduce((a, b) => a + b, 0) / humans.length;
    const leader = Math.max(...horses.map((h) => h.pos().x));
    const gap = leader - hx, sm = clamp((gap - 8) / 22, 0, 1);
    // when the player falls far behind, the camera drifts to the lead pack so the race stays in frame
    const sm2 = clamp((gap - 5) / 12, 0, 1), sm3 = sm2 * sm2 * (3 - 2 * sm2);
    const mine = hx + Math.min(clamp(gap, -4, 60) * 0.3, 4.5);
    let fx = mine + (leader - 3.5 - mine) * sm3;
    fx = Math.min(fx, FINISH_X + 2, hx + 5.5 / Math.pow(Math.min(1, camera.aspect / 1.5), 0.7));   // the human's whole horse stays inside the frame
    const far = Math.min(Math.abs(leader - hx), 26) * (1 - sm3 * 0.7);
    const asp = Math.min(1, camera.aspect / 1.5);
    const dist = (14.5 + clamp(far * 0.5, 0, 14)) / Math.pow(asp, 0.7);   // long telephoto from the infield, far off the rail
    return { fx, dist, leader };
  }
  // broadcast director: side-tracking telephoto, hard cut to a head-on cam for tangles and the stretch, replay cams
  const CUT = { kind: null, until: 0, x: 0, snap: false };
  function cutTo(kind, dur, x) { CUT.kind = kind; CUT.until = S.time + dur; CUT.x = x; CUT.snap = true; bc.U.uGlitch.value = 0.8; }
  function updateCamera(dt) {
    const { horses } = G;
    let fov = (S.phase === 'race' || S.phase === 'finishing' || S.phase === 'countdown') ? 30 : 36, snap = false;
    if (S.phase === 'replay') {
      const rp = S.replay;
      if (rp.kind === 'finish') {
        const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start);
        tp.set(FINISH_X + 4 - prog * 1.5, 1.3 + prog * 0.3, 10); tl.set(FINISH_X - 0.5 - prog * 0.5, 1.0, 0); fov = 34 - prog * 4;
      } else { // low rail cam orbiting the pile-up
        const prog = (rp.pos - rp.start) / Math.max(1, rp.end - rp.start), s = G.subjectAt(rp.pos, rp.subject), a = 0.35 + prog * 1.1;
        let cx = s.x, cz = s.z, d = 8;
        if (rp.pair) { const s2 = G.subjectAt(rp.pos, rp.pair[0] === rp.subject ? rp.pair[1] : rp.pair[0]); cx = (s.x + s2.x) / 2; cz = (s.z + s2.z) / 2; d = 9 + Math.abs(s.x - s2.x) * 0.5; }
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
        tp.set(fx - 0.4, 2.0 + (dist - 14.5) * 0.1, dist); tl.set(fx + 1.0, 2.7, 0.3);
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
  return { camPos, camLook, tp, tl, followTarget, CUT, cutTo, updateCamera };
}
