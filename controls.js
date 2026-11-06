// Core team (b): keyboard/button input, the keys panel + tips, off-screen "YOU n m" indicators, 3D player markers.
export function createControls(G) {
  const { S, $, THREE, scene, camera, KEYS, LEGNAME } = G;
  const KEYLABEL = (c) => c.replace('Key', '').replace('Digit', '');
  const held = new Set();

  const normKey = (k) => { if (!k) return ''; if (k === ' ' || k === 'Space') return 'Space'; if (/^Key|^Digit|^Enter|^Escape/.test(k)) return k; if (/^[a-z]$/i.test(k)) return 'Key' + k.toUpperCase(); if (/^[0-9]$/.test(k)) return 'Digit' + k; return k; };
  function act({ key, down = true, type } = {}) {
    if (type === 'autoplay') { S.auto = down !== false; return; }
    const k = normKey(key);
    if (down) {
      if (k === 'Space') { if (S.phase === 'replay') G.endReplay(); return; }
      if (k === 'Digit2') { if (G.mode !== 2) setMode(2); return; }
      if (k === 'Digit1') return setMode(1);
      if ((k === 'KeyR' && (G.mode === 1 || S.phase === 'results')) || k === 'Enter') return G.resetRace();
      held.add(k);
    } else held.delete(k);
  }
  function setMode(m) { G.mode = m; G.resetRace(); }
  addEventListener('keydown', (e) => { if (e.repeat) return; if (['Space', 'Enter'].includes(e.code)) e.preventDefault(); act({ key: e.code }); });
  addEventListener('keyup', (e) => act({ key: e.code, down: false }));
  addEventListener('blur', () => held.clear());
  addEventListener('visibilitychange', () => { if (document.hidden) held.clear(); });
  $('b1').onclick = (e) => { setMode(1); e.target.blur(); }; $('b2').onclick = (e) => { setMode(2); e.target.blur(); }; $('br').onclick = (e) => { G.resetRace(); e.target.blur(); };

  // the keys panel, mode buttons and tips line (called from assignRoles after buildHud)
  function buildControlsHud() {
    const mode = G.mode;
    const keys = $('keys'); keys.innerHTML = '';
    (KEYS[mode]).forEach((set, pi) => {
      const kp = document.createElement('div'); kp.className = 'kp';
      kp.innerHTML = `<div>${mode === 2 ? 'PLAYER ' + (pi + 1) : 'YOUR LEGS'}</div><div class="row">${set.map((c, li) => `<div class="cap" id="cap-${pi}-${li}">${KEYLABEL(c)}<small>${LEGNAME[li]}</small></div>`).join('')}</div>`;
      keys.appendChild(kp);
    });
    $('b1').classList.toggle('on', mode === 1); $('b2').classList.toggle('on', mode === 2);
    $('tips').textContent = mode === 1 ? 'ALTERNATE LEGS: Q+P THEN W+O  ·  R RESTART  ·  2 = TWO PLAYERS  ·  SPACE SKIPS REPLAYS'
      : 'P1: Q W E R  ·  P2: U I O P  ·  ENTER RESTARTS  ·  1 = SOLO  ·  SPACE SKIPS REPLAYS';
  }

  // off-screen "YOU n m" indicators and key-cap highlights
  function updateControlsHud() {
    const { roles, horses, camLook } = G;
    roles.forEach((r, i) => {
      if (r.human < 0) return;
      let el = document.getElementById('off' + i);
      if (!el) { el = document.createElement('div'); el.id = 'off' + i; el.className = 'ui'; const c = r.color.toString(16).padStart(6, '0'); el.style.cssText = `position:fixed;top:46%;font:20px Bungee,Impact,sans-serif;color:#f2e1ad;background:#${c};padding:5px 12px;border:3px solid #2b1810;box-shadow:4px 4px 0 #2b1810;display:none;z-index:6`; document.body.appendChild(el); }
      const p = horses[i].pos(), v = new THREE.Vector3(p.x, 1, p.z || 0).project(camera), off = v.z > 1 || Math.abs(v.x) > 0.96;
      const show = off && (S.phase === 'race' || S.phase === 'finishing' || S.phase === 'countdown');
      if (show) { const left = v.z > 1 ? true : v.x < 0, d = Math.round(Math.abs(p.x - camLook.x)); el.textContent = (left ? '◀ ' : '') + 'YOU ' + d + ' m' + (left ? '' : ' ▶'); el.style.left = left ? '12px' : ''; el.style.right = left ? '' : '12px'; el.style.display = 'block'; } else el.style.display = 'none';
    });
    KEYS[G.mode].forEach((set, pi) => set.forEach((c, li) => $(`cap-${pi}-${li}`)?.classList.toggle('dn', held.has(c))));
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
    const { roles, horses } = G;
    markers.forEach((m, k) => {
      const hi = roles.findIndex((r) => r.human === k);
      m.visible = hi >= 0 && S.phase !== 'replay' && S.phase !== 'results';
      if (!m.visible) return;
      const t = horses[hi].torso.body.translation();
      m.position.set(t.x, 0, t.z); m.userData.arrow.position.y = 2.6 + Math.sin(S.time * 6) * 0.12;
    });
  }

  return { held, normKey, act, setMode, buildControlsHud, updateControlsHud, markers, updateMarkers };
}
