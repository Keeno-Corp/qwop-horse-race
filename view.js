// Made with paprika3d · https://paprika3d.com
// Low-poly flat-shaded visuals: horses, track, grandstand with blocky spectators, fence, hills, sky and clouds.
import * as THREE from 'three';

const lam = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });
export const COLORS = { blue: 0x3f6cdc, green: 0x3fb04a, yellow: 0xf2d03a, red: 0xd93a2e };
const BODY = 0xc9793c, SOCK = 0xfbfbf6, DARK = 0x2a1d1a, DIRT = 0x99653e;

function mesh(geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...p); m.rotation.set(...r); m.scale.set(...s);
  m.castShadow = true; return m;
}
const cyl = (rt, rb, h, seg = 5) => new THREE.CylinderGeometry(rt, rb, h, seg);

/** Visual groups for one horse, in the same order as Horse.parts: torso, neck, head, then upper/lower per leg. */
export const COATS = [0xc9793c, 0x8e929a, 0xe8d8b0, 0xa8462a];
export function buildHorseView(color, tint = 0, coat = BODY) {
  const body = lam(new THREE.Color(coat).offsetHSL(0, 0, tint)), sock = lam(SOCK), dark = lam(DARK), cloth = lam(color);
  const clothDark = lam(new THREE.Color(color).multiplyScalar(0.7));
  const eyeW = new THREE.MeshLambertMaterial({ color: 0xffffff }), eyeB = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const groups = [];
  // torso
  const t = new THREE.Group();
  t.add(mesh(new THREE.IcosahedronGeometry(1, 1), body, [0, 0.02, 0], [0, 0, 0], [0.88, 0.4, 0.42]));
  t.add(mesh(new THREE.IcosahedronGeometry(1, 0), body, [0.6, 0.05, 0], [0, 0.3, 0], [0.42, 0.46, 0.4]));
  t.add(mesh(new THREE.IcosahedronGeometry(1, 0), body, [-0.62, 0.06, 0], [0, 0.2, 0], [0.46, 0.44, 0.42]));
  t.add(mesh(new THREE.BoxGeometry(0.52, 0.05, 0.8), cloth, [0.05, 0.41, 0]));
  for (const s of [-1, 1]) t.add(mesh(new THREE.BoxGeometry(0.52, 0.3, 0.035), cloth, [0.05, 0.27, s * 0.415], [s * 0.2, 0, 0]));
  t.add(mesh(new THREE.BoxGeometry(0.07, 0.84, 0.88), clothDark, [0.2, -0.02, 0]));
  t.add(mesh(new THREE.ConeGeometry(0.13, 0.85, 5), dark, [-1.22, -0.05, 0], [0, 0, 2.35]));
  t.add(mesh(new THREE.ConeGeometry(0.08, 0.5, 4), dark, [-1.1, 0.2, 0.06], [0, 0, 2.0]));
  groups.push(t);
  // neck (local +y toward the head, local -x is the top of the neck)
  const n = new THREE.Group();
  n.add(mesh(cyl(0.13, 0.21, 0.8, 6), body, [0, 0, 0], [0, 0, 0], [1, 1, 0.8]));
  n.add(mesh(new THREE.BoxGeometry(0.06, 0.74, 0.1), dark, [-0.14, 0.02, 0]));
  groups.push(n);
  // head (local +y toward the nose, local -x is the forehead)
  const h = new THREE.Group();
  h.add(mesh(cyl(0.085, 0.16, 0.56, 5), body, [0, 0.02, 0], [0, 0, 0], [1, 1, 0.82]));
  h.add(mesh(cyl(0.09, 0.09, 0.1, 5), lam(0x8a5a36), [0, 0.3, 0], [0, 0, 0], [1, 1, 0.82]));
  h.add(mesh(new THREE.BoxGeometry(0.03, 0.4, 0.06), sock, [-0.1, 0.0, 0]));
  h.add(mesh(cyl(0.1, 0.1, 0.05, 5), cloth, [0, 0.16, 0], [0, 0, 0], [1, 1, 0.84]));
  h.add(mesh(cyl(0.135, 0.135, 0.04, 5), cloth, [0, -0.05, 0], [0, 0, 0], [1, 1, 0.84]));
  for (const s of [-1, 1]) {
    h.add(mesh(new THREE.ConeGeometry(0.045, 0.16, 4), body, [-0.1, -0.3, s * 0.09], [0.2 * s, 0, 0.15]));
    h.add(mesh(new THREE.IcosahedronGeometry(0.075, 0), eyeW, [-0.06, -0.12, s * 0.12]));
    h.add(mesh(new THREE.IcosahedronGeometry(0.038, 0), eyeB, [-0.06, -0.12, s * 0.18]));
  }
  groups.push(h);
  // legs: upper (brown), lower (brown, white sock, dark hoof)
  for (let i = 0; i < 4; i++) {
    const u = new THREE.Group(); u.add(mesh(cyl(0.115, 0.08, 0.52, 5), body)); groups.push(u);
    const l = new THREE.Group();
    l.add(mesh(cyl(0.08, 0.062, 0.32, 5), body, [0, 0.12, 0]));
    l.add(mesh(cyl(0.064, 0.07, 0.22, 5), sock, [0, -0.13, 0]));
    l.add(mesh(cyl(0.075, 0.085, 0.07, 5), dark, [0, -0.255, 0]));
    groups.push(l);
  }
  return groups;
}

// -------- environment --------
function noise2(x, z) { // cheap smooth value noise
  const f = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return (f(xi, zi) * (1 - u) + f(xi + 1, zi) * u) * (1 - v) + (f(xi, zi + 1) * (1 - u) + f(xi + 1, zi + 1) * u) * v;
}
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function buildEnvironment(scene, tex, rng) {
  const env = { spectators: null, clouds: [], excite: 0 };
  // sky dome (vertex gradient)
  const sky = new THREE.SphereGeometry(500, 16, 10);
  const cols = []; const top = new THREE.Color(0x5aa6ff), hor = new THREE.Color(0x70b4ff), c = new THREE.Color();
  const pos = sky.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 500; c.copy(hor).lerp(top, Math.pow(Math.max(0, y), 0.12)); cols.push(c.r, c.g, c.b); }
  sky.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const skyM = new THREE.Mesh(sky, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  skyM.name = 'sky'; skyM.position.set(40, 0, 0); scene.add(skyM);
  scene.background = new THREE.Color(0x7bbaff);

  // hills + grass
  const hg = new THREE.PlaneGeometry(520, 300, 90, 52).rotateX(-Math.PI / 2);
  const hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    const x = hp.getX(i) + 50, z = hp.getZ(i) - 40;
    const far = smooth(24, 80, -z), near = smooth(30, 70, z), side = smooth(120, 200, Math.abs(x - 50));
    const n = 0.35 + 0.65 * noise2(x * 0.018, z * 0.018) + 0.25 * noise2(x * 0.06, z * 0.06);
    hp.setY(i, Math.max(far * 13, near * 6, side * 9) * n * 1.05 - 0.08 + (far > 0 ? 0 : 0));
  }
  const hn = hg.toNonIndexed(); hn.computeVertexNormals();
  const hc = []; const lo = new THREE.Color(0x8ed45a), hi = new THREE.Color(0x5fae3e), cc = new THREE.Color();
  const p2 = hn.attributes.position;
  for (let i = 0; i < p2.count; i += 3) {
    const y = (p2.getY(i) + p2.getY(i + 1) + p2.getY(i + 2)) / 3;
    cc.copy(lo).lerp(hi, Math.min(1, y / 16)).offsetHSL((rng() - 0.5) * 0.02, 0, (rng() - 0.5) * 0.06);
    for (let k = 0; k < 3; k++) hc.push(cc.r, cc.g, cc.b);
  }
  hn.setAttribute('color', new THREE.Float32BufferAttribute(hc, 3));
  const hills = new THREE.Mesh(hn, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  hills.position.set(50, 0, -40); hills.receiveShadow = true; hills.name = 'hills'; scene.add(hills);

  // dirt track: faceted ground with colour variation and little ruts
  const tg = new THREE.PlaneGeometry(190, 9.4, 76, 8).rotateX(-Math.PI / 2);
  const tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) tp.setY(i, (noise2(tp.getX(i) * 0.7, tp.getZ(i) * 0.7) - 0.5) * 0.07);
  const tn = tg.toNonIndexed(); tn.computeVertexNormals();
  const tcols = []; const d1 = new THREE.Color(0x9a653d), d2 = new THREE.Color(0x805431);
  const tq = tn.attributes.position;
  for (let i = 0; i < tq.count; i += 3) { cc.copy(d1).lerp(d2, rng()); { const z = tq.getZ(i), x = tq.getX(i); if (Math.abs(((z + 4.7 + Math.sin(x * 0.05) * 0.6) % (1.4 + 0.5 * noise2(Math.floor(x / 12), 3)))) < 0.16) cc.lerp(new THREE.Color(0xc79a6a), 0.4); cc.offsetHSL(0, 0, (noise2(x * 0.15, z * 0.9) - 0.5) * 0.08 + (noise2(x * 0.03 + 9, z * 0.3) - 0.5) * 0.1); } for (let k = 0; k < 3; k++) tcols.push(cc.r, cc.g, cc.b); }
  tn.setAttribute('color', new THREE.Float32BufferAttribute(tcols, 3));
  const track = new THREE.Mesh(tn, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  track.position.set(45, 0.005, 0); track.receiveShadow = true; track.name = 'track'; scene.add(track);

  // lines on the track
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const startLine = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 9.2).rotateX(-Math.PI / 2), white); startLine.position.set(1.2, 0.05, 0); scene.add(startLine);
  const FIN = 60;
  const fin = new THREE.Group(); fin.name = 'finish-line';
  const cw = 0.5, rows = 2, cells = 18;
  const bm = new THREE.MeshBasicMaterial({ color: 0x111111 });
  for (let r = 0; r < rows; r++) for (let k = 0; k < cells; k++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(cw, 9.0 / cells).rotateX(-Math.PI / 2), (r + k) % 2 ? bm : white);
    m.position.set(FIN - 0.25 + r * cw, 0.055, -4.5 + (k + 0.5) * 9.0 / cells); fin.add(m);
  }
  // finish gantry
  const wood = lam(0x8a5a35);
  fin.add(mesh(new THREE.BoxGeometry(0.4, 5.2, 0.4), wood, [FIN, 2.6, -5.1]));
  fin.add(mesh(new THREE.BoxGeometry(0.3, 0.3, 2.6), wood, [FIN, 4.3, -3.9], [0.6, 0, 0]));
  const bannerTex = tex.label('FINISH', { size: 256, color: '#fff6e0', background: '#d93a2e', font: '900 120px Impact, Arial Black, sans-serif', padding: 30 });
  const ba = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.3, 10.4), [lam(0xd93a2e), lam(0xd93a2e), lam(0xd93a2e), lam(0xd93a2e), lam(0xd93a2e), lam(0xd93a2e)]);
  ba.position.set(FIN, 5.0, 0); ba.castShadow = true; fin.add(ba);
  for (const side of [1, -1]) {
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.2), new THREE.MeshBasicMaterial({ map: bannerTex }));
    lab.position.set(FIN + side * 0.14, 5.0, 0); lab.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; fin.add(lab);
  }
  scene.add(fin);
  // distance boards
  for (let d = 10; d <= 50; d += 10) {
    const lab = tex.label(d + ' m', { size: 128, color: '#3a2416', background: '#fff6e0', font: '900 64px Impact, Arial Black, sans-serif', padding: 16 });
    const b = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), new THREE.MeshBasicMaterial({ map: lab })); b.position.set(1.2 + d, 0.9, 4.7); scene.add(b);
  }

  // fences
  const railM = lam(0xffffff), postGeo = new THREE.BoxGeometry(0.14, 1.2, 0.14);
  for (const z of [-4.7, 4.7]) {
    const n = 60, posts = new THREE.InstancedMesh(postGeo, railM, n), m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { const px = -18 + i * 3; m4.makeTranslation(z > 0 && px > 55 && px < 67 ? 999 : px, 0.6, z); posts.setMatrixAt(i, m4); }
    posts.castShadow = true; scene.add(posts);
    for (const y of [0.55, 1.0]) {
      if (z > 0) { scene.add(mesh(new THREE.BoxGeometry(73.5, 0.09, 0.07), railM, [-18 + 36.75, y, z])); scene.add(mesh(new THREE.BoxGeometry(60, 0.09, 0.07), railM, [67 + 30, y, z])); }
      else scene.add(mesh(new THREE.BoxGeometry(180, 0.09, 0.07), railM, [72, y, z]));
    }
  }

  // grandstands
  const spectators = [];
  function stand(x0, len, rows) {
    const g = new THREE.Group(); g.name = 'grandstand';
    const po = { polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 };
    const concrete = lam(0xcfc7b4, po), concrete2 = lam(0xb5ac98, po);
    const benchCols = [0xd93a2e, 0xf2d03a, 0x3f6cdc, 0x3fb04a];
    const z0 = -7.4;
    for (let r = 0; r < rows; r++) {
      const y = 0.35 + r * 0.6, z = z0 - r * 1.0;
      const step = mesh(new THREE.BoxGeometry(len, y, 1.04), r % 2 ? concrete : concrete2, [x0 + len / 2, y / 2 + 0.003, z]); step.receiveShadow = true; g.add(step);
      const bench = mesh(new THREE.BoxGeometry(len - 0.4, 0.12, 0.27), lam(benchCols[r % 4], { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), [x0 + len / 2, y + 0.3, z + 0.3]); g.add(bench);
      for (let k = 0; k < Math.floor(len / 1.05); k++) if (rng() < 0.9) spectators.push({ x: x0 + 0.8 + k * 1.05 + (rng() - 0.5) * 0.2, y: y + 0.36, z: z - 0.05, ph: rng() * 6.28, col: [0xf2d03a, 0x3f6cdc, 0xd93a2e, 0x3fb04a, 0xff8fb1, 0x7de0e0, 0xffffff, 0xff9a3c][Math.floor(rng() * 8)], skin: [0xf5cfa0, 0xe0a878, 0x9b6a45][Math.floor(rng() * 3)] });
    }
    const back = mesh(new THREE.BoxGeometry(len, rows * 0.6 + 1.2, 0.3), lam(0x7a746a), [x0 + len / 2, (rows * 0.6 + 1.2) / 2 + 0.006, z0 - rows * 1.0 - 0.1]); g.add(back);
    const roofY = rows * 0.6 + 3.3;
    const roof = mesh(new THREE.BoxGeometry(len + 2, 0.25, rows * 1.0 + 3.6), lam(0xd6c59f), [x0 + len / 2, roofY, z0 - rows * 0.5 + 0.2], [0.14, 0, 0]); g.add(roof);
    for (const px of [0.4, len - 0.4, len / 2]) for (const pz of [-1.0, -rows * 1.0 - 0.2]) { const h = pz > -2 ? roofY - 0.4 : roofY + 0.3; g.add(mesh(new THREE.BoxGeometry(0.25, h, 0.25), wood, [x0 + px, h / 2 + 0.009, z0 + pz])); }
    for (let k = 0; k <= 6; k++) g.add(mesh(new THREE.BoxGeometry(0.12, 0.12, rows + 2.6), wood, [x0 + k * len / 6, roofY - 0.2, z0 - rows * 0.5 + 0.2], [0.14, 0, 0]));
    scene.add(g);
  }
  stand(44, 32, 6); stand(2, 18, 4);
  const sp = spectators, bodyG = new THREE.BoxGeometry(0.34, 0.5, 0.26), headG = new THREE.BoxGeometry(0.26, 0.26, 0.26);
  const bodies = new THREE.InstancedMesh(bodyG, lam(0xffffff), sp.length), heads = new THREE.InstancedMesh(headG, lam(0xffffff), sp.length);
  const col = new THREE.Color();
  sp.forEach((s, i) => { bodies.setColorAt(i, col.set(s.col)); heads.setColorAt(i, col.set(s.skin)); });
  bodies.castShadow = true; scene.add(bodies, heads);
  const m4 = new THREE.Matrix4();
  env.spectators = {
    update(t, excite) {
      for (let i = 0; i < sp.length; i++) {
        const s = sp[i], b = Math.abs(Math.sin(t * (4 + excite * 6) + s.ph)) * (0.03 + excite * 0.25);
        m4.makeTranslation(s.x, s.y + 0.25 + b, s.z); bodies.setMatrixAt(i, m4);
        m4.makeTranslation(s.x, s.y + 0.64 + b, s.z); heads.setMatrixAt(i, m4);
      }
      bodies.instanceMatrix.needsUpdate = true; heads.instanceMatrix.needsUpdate = true;
    },
  };
  env.spectators.update(0, 0);

  // clouds
  const cloudM = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true, emissive: 0x8aa0b8, emissiveIntensity: 0.25 });
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group(), n = 3 + Math.floor(rng() * 3);
    for (let k = 0; k < n; k++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + rng() * 2.2, 0), cloudM); m.position.set(k * 3 - n * 1.4, rng() * 1.2, (rng() - 0.5) * 2); m.scale.y = 0.6; g.add(m); }
    g.position.set(-60 + i * 28 + rng() * 10, 36 + rng() * 14, -90 - rng() * 60); g.userData.speed = 0.4 + rng() * 0.4; scene.add(g); env.clouds.push(g);
  }
  env.update = (t, dt) => { for (const c of env.clouds) { c.position.x += c.userData.speed * dt; if (c.position.x > 200) c.position.x = -120; } };
  return env;
}
