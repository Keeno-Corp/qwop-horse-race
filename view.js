// Made with paprika3d · https://paprika3d.com
// 1970s TV broadcast look: toon (3-step ramp) materials + inverted-hull outlines, silks patterns,
// chunky cartoon horses (refs/sheets/horse.png), concrete grandstand with striped awning, tote board, camera towers.
import * as THREE from 'three';

// ---------------------------------------------------------------- palette
export const PAL = { tomato: 0xd3432b, mustard: 0xe5af2c, avocado: 0x95a641, orange: 0xd06322, blue: 0x305da2, dirt: 0xcc8930, cream: 0xf2e1ad, choc: 0x4c2c21, ink: 0x2b1810 };
export const COLORS = { blue: PAL.blue, green: PAL.avocado, yellow: PAL.mustard, red: PAL.tomato };
export const COATS = [0x6b3322, 0x9a948a, 0xf2e1ad, 0xb8602a]; // dark bay, grey, (player cream), chestnut
export const SILKS = { // pattern + two colours per lane colour
  red: { kind: 'diamonds', a: '#d3432b', b: '#e5af2c' },
  green: { kind: 'chevrons', a: '#95a641', b: '#f2e1ad' },
  blue: { kind: 'dots', a: '#305da2', b: '#f2e1ad' },
  yellow: { kind: 'stripes', a: '#e5af2c', b: '#4c2c21' },
};
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

// ---------------------------------------------------------------- toon + outline
const ramp = new THREE.DataTexture(new Uint8Array([
  96, 70, 96, 255, // shadow: warm plum
  176, 156, 140, 255, // mid
  255, 255, 255, 255, // lit
]), 3, 1, THREE.RGBAFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
export const RAMP = ramp;
const toonCache = new Map();
export function toon(color, extra = {}) {
  const key = new THREE.Color(color).getHex() + JSON.stringify(Object.keys(extra).map((k) => k + (extra[k]?.uuid || extra[k])));
  if (!extra.map && toonCache.has(key)) return toonCache.get(key);
  const m = new THREE.MeshToonMaterial({ color, gradientMap: ramp, ...extra });
  if (!extra.map) toonCache.set(key, m);
  return m;
}
export const outlineU = { uThick: { value: 0.0135 }, uAspect: { value: 1.6 } };
const outlineMatCache = new Map();
function outlineMat(color = PAL.ink, scale = 1) {
  const k = color + ':' + scale;
  if (!outlineMatCache.has(k)) outlineMatCache.set(k, new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uThick: outlineU.uThick, uAspect: outlineU.uAspect, uScale: { value: scale } },
    side: THREE.BackSide, fog: false,
    vertexShader: `uniform float uThick; uniform float uAspect; uniform float uScale; attribute vec3 onrm;
void main(){
  #ifdef USE_INSTANCING
    mat4 mvm = modelViewMatrix * instanceMatrix;
  #else
    mat4 mvm = modelViewMatrix;
  #endif
  vec4 p = projectionMatrix * mvm * vec4(position, 1.0);
  vec3 n = mat3(mvm) * onrm;
  vec2 d = n.xy / (length(n.xy) + 1e-4) * length(onrm);
  p.xy += vec2(d.x / uAspect, d.y) * uThick * uScale * p.w;
  gl_Position = p;
}`,
    fragmentShader: `uniform vec3 uColor;
void main(){
  gl_FragColor = vec4(uColor, 1.0);
}`,
  }));
  return outlineMatCache.get(k);
}
/** averaged normals per welded position: smooth hull directions (and, when `light`, smooth shading). */
function hullNormals(geo, light) {
  if (geo.attributes.onrm) return geo;
  if (!geo.attributes.normal) geo.computeVertexNormals();
  const p = geo.attributes.position, n = geo.attributes.normal, acc = new Map(), key = (i) => Math.round(p.getX(i) * 2e3) + ',' + Math.round(p.getY(i) * 2e3) + ',' + Math.round(p.getZ(i) * 2e3);
  for (let i = 0; i < p.count; i++) { const k = key(i); let a = acc.get(k); if (!a) acc.set(k, a = [0, 0, 0]); a[0] += n.getX(i); a[1] += n.getY(i); a[2] += n.getZ(i); }
  const out = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) { const a = acc.get(key(i)), l = Math.hypot(a[0], a[1], a[2]) || 1; out[i * 3] = a[0] / l; out[i * 3 + 1] = a[1] / l; out[i * 3 + 2] = a[2] / l; }
  geo.setAttribute('onrm', new THREE.BufferAttribute(out, 3));
  if (light) geo.setAttribute('normal', new THREE.BufferAttribute(out.slice(), 3));
  return geo;
}
/** a toon mesh with an outline hull child. opts: { outline: false | scale, shadow, smooth } */
export function tm(geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], o = {}) {
  hullNormals(geo, o.smooth);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...p); m.rotation.set(...r); m.scale.set(...s);
  m.castShadow = o.shadow ?? true; m.receiveShadow = o.receive ?? true;
  if (o.outline !== false) addOutline(m, o.outline || 1, o.color);
  return m;
}
export function addOutline(m, scale = 1, color = PAL.ink) {
  const h = m.isInstancedMesh ? new THREE.InstancedMesh(m.geometry, outlineMat(color, scale), m.count) : new THREE.Mesh(m.geometry, outlineMat(color, scale));
  if (m.isInstancedMesh) h.instanceMatrix = m.instanceMatrix;
  h.castShadow = false; h.receiveShadow = false; h.name = (m.name || 'mesh') + '-outline'; h.frustumCulled = m.frustumCulled;
  m.add(h); return h;
}

// ---------------------------------------------------------------- merging (keeps draw calls low)
/** merge the toon meshes under `root` into one mesh per material plus one outline hull; basic-material meshes, instanced meshes and `userData.noMerge` subtrees stay. */
const vcMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: ramp, vertexColors: true });
export function mergeStatic(root, vc = false) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), nm = new THREE.Matrix3(), tmp = new THREE.Vector3();
  const buckets = new Map(), hull = { pos: [], nrm: [] }, doomed = [];
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o === root || o.material.isShaderMaterial || o.material.isMeshBasicMaterial || o.userData.noMerge) return;
    for (let p = o.parent; p && p !== root; p = p.parent) if (p.userData.noMerge) return;
    const rel = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld); nm.getNormalMatrix(rel);
    const src = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const hullChild = o.children.find((c) => c.material && c.material.isShaderMaterial);
    if (hullChild) {
      const sc = hullChild.material.uniforms.uScale.value, P = src.attributes.position, N = src.attributes.onrm || src.attributes.normal;
      for (let i = 0; i < P.count; i++) {
        tmp.fromBufferAttribute(P, i).applyMatrix4(rel); hull.pos.push(tmp.x, tmp.y, tmp.z);
        tmp.fromBufferAttribute(N, i).applyMatrix3(nm).normalize().multiplyScalar(sc); hull.nrm.push(tmp.x, tmp.y, tmp.z);
      }
    }
    const g = new THREE.BufferGeometry();
    const P = src.attributes.position, N = src.attributes.normal, UV = src.attributes.uv, n = P.count;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      tmp.fromBufferAttribute(P, i).applyMatrix4(rel); pos.set([tmp.x, tmp.y, tmp.z], i * 3);
      tmp.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor.set([tmp.x, tmp.y, tmp.z], i * 3);
      if (UV) uv.set([UV.getX(i), UV.getY(i)], i * 2);
    }
    const plain = vc && !o.material.map && o.material.isMeshToonMaterial && !o.material.transparent;
    const k = plain ? 'vc' : o.material.uuid; let b = buckets.get(k); if (!b) buckets.set(k, b = { mat: plain ? vcMat : o.material, pos: [], nor: [], uv: [], col: [], cast: false });
    if (plain) { const c = o.material.color, col = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3); (b.col ||= []).push(col); }
    b.pos.push(pos); b.nor.push(nor); b.uv.push(uv); b.cast ||= o.castShadow;
    doomed.push(o);
  });
  for (const o of doomed) o.parent.remove(o);
  const cat = (arrs) => { const out = new Float32Array(arrs.reduce((a, b) => a + b.length, 0)); let o = 0; for (const a of arrs) { out.set(a, o); o += a.length; } return out; };
  let bi = 0;
  for (const b of buckets.values()) {
    if (b.mat && b.mat !== vcMat && !b.mat.polygonOffset) { b.mat.polygonOffset = true; b.mat.polygonOffsetFactor = -(bi++ % 4); b.mat.polygonOffsetUnits = -(bi % 4); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(cat(b.pos), 3)); g.setAttribute('normal', new THREE.BufferAttribute(cat(b.nor), 3)); g.setAttribute('uv', new THREE.BufferAttribute(cat(b.uv), 2)); if (b.mat === vcMat) g.setAttribute('color', new THREE.BufferAttribute(cat(b.col), 3));
    const m = new THREE.Mesh(g, b.mat); m.castShadow = b.cast; m.receiveShadow = true; m.name = 'merged'; if (b.mat && !b.mat.polygonOffset) { b.mat.polygonOffset = true; b.mat.polygonOffsetFactor = -1; b.mat.polygonOffsetUnits = -1; } root.add(m);
  }
  if (hull.pos.length) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(hull.pos, 3)); g.setAttribute('onrm', new THREE.Float32BufferAttribute(hull.nrm, 3));
    const h = new THREE.Mesh(g, outlineMat(PAL.ink, 1)); h.name = 'merged-outline'; h.castShadow = false; h.frustumCulled = true; root.add(h);
  }
  return root;
}
/** merge plain-colour basic meshes (no map, not transparent-sorted separately) under `root` into one mesh per material */
export function mergeBasic(root) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), by = new Map(), doomed = [];
  root.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o !== root && o.material.isMeshBasicMaterial && !o.material.map) { const g = o.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)); g.deleteAttribute('uv'); if (g.index) { const n = g.toNonIndexed(); g.dispose(); (by.get(o.material) || by.set(o.material, []).get(o.material)).push(n); } else (by.get(o.material) || by.set(o.material, []).get(o.material)).push(g); doomed.push(o); } });
  for (const o of doomed) o.parent.remove(o);
  for (const [mat, gs] of by) { let n = 0; for (const g of gs) n += g.attributes.position.count; const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let k = 0; for (const g of gs) { pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); k += g.attributes.position.count; } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); const m = new THREE.Mesh(g, mat); m.name = 'basic-merged'; root.add(m); }
}
const cyl = (rt, rb, h, seg = 8) => new THREE.CylinderGeometry(rt, rb, h, seg);
const sph = (r, w = 14, h = 10) => new THREE.SphereGeometry(r, w, h);
const box = (x, y, z) => new THREE.BoxGeometry(x, y, z);

// ---------------------------------------------------------------- silks
export function silksCanvas(kind, a, b, w = 256, h = 256) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = a; g.fillRect(0, 0, w, h); g.strokeStyle = '#2b1810'; g.lineWidth = Math.max(2, w / 64); g.lineJoin = 'round';
  if (kind === 'diamonds') {
    const n = 4, sx = w / n, sy = h / n;
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { if ((i + j) % 2) continue; const cx = i * sx, cy = j * sy; g.fillStyle = b; g.beginPath(); g.moveTo(cx, cy - sy / 2); g.lineTo(cx + sx / 2, cy); g.lineTo(cx, cy + sy / 2); g.lineTo(cx - sx / 2, cy); g.closePath(); g.fill(); g.stroke(); }
  } else if (kind === 'stripes') {
    const n = 6; for (let i = 0; i < n; i += 2) { g.fillStyle = b; g.fillRect(i * w / n, 0, w / n, h); }
    g.strokeRect(0, 0, w, h);
  } else if (kind === 'dots') {
    const n = 4; g.fillStyle = b; g.fillRect(0, 0, w, h); g.fillStyle = a;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { g.beginPath(); g.arc((i + 0.5 + (j % 2) * 0.5) * w / n, (j + 0.5) * h / n, w / n * 0.33, 0, 7); g.fill(); g.stroke(); }
  } else if (kind === 'chevrons') {
    const n = 3, bh = h / n; g.fillStyle = b;
    for (let i = -1; i < n; i++) { const y = i * bh + bh * 0.2; g.beginPath(); g.moveTo(0, y); g.lineTo(w / 2, y + bh * 0.85); g.lineTo(w, y); g.lineTo(w, y + bh * 0.38); g.lineTo(w / 2, y + bh * 1.23); g.lineTo(0, y + bh * 0.38); g.closePath(); g.fill(); g.stroke(); }
  }
  return c;
}
const tex = (canvas, rep) => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; };
function numberCanvas(n) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#f2e1ad'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.lineWidth = 7; g.strokeStyle = '#2b1810'; g.stroke();
  g.fillStyle = '#2b1810'; g.font = '900 78px Bungee, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 64, 70); return c;
}

// ---------------------------------------------------------------- horse
/** Visual groups for one horse in the order of Horse.parts: torso, neck, head, then upper/lower per leg. */
export function buildHorseView(color, tint = 0, coat = COATS[0], silk = SILKS.red, number = 1) {
  const body = toon(new THREE.Color(coat).offsetHSL(0, 0, tint)), sock = toon(0xfbf1d6), hoof = toon(0x2b1c18), mane = toon(0x3a2218), snout = toon(new THREE.Color(coat).offsetHSL(0.01, -0.05, 0.14));
  const cloth = toon(0xffffff, { map: tex(silksCanvas(silk.kind, silk.a, silk.b)), side: THREE.DoubleSide });
  const leather = toon(0x8a2f14), brass = toon(0xe5af2c), eyeW = toon(0xffffff), eyeB = toon(0x151010);
  const groups = [];
  // --- torso: one warped sphere = chunky barrel
  const t = new THREE.Group();
  const bg = new THREE.SphereGeometry(1, 28, 18), bp = bg.attributes.position;
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i); bp.setXYZ(i, x * 0.92, bp.getY(i) * 0.5 * (1 + 0.1 * x), bp.getZ(i) * 0.43 * (1 + 0.05 * (1 - Math.abs(x)))); }
  bg.computeVertexNormals();
  t.add(tm(bg, body, [0, 0.0, 0], [0, 0, 0], [1, 1, 1], { smooth: true }));
  // saddle cloth (silks) as an open arc over the back + number discs on both sides
  const cg = new THREE.CylinderGeometry(1, 1, 0.92, 24, 1, true, Math.PI * 0.5 - 1.5, 3.0).rotateZ(Math.PI / 2);
  const cm = new THREE.Mesh(cg, cloth); cm.scale.set(1, 0.54, 0.485); cm.position.set(0.05, 0.0, 0); cm.castShadow = true; t.add(cm);
  const girth = tm(new THREE.TorusGeometry(0.5, 0.025, 6, 20), leather, [0.28, -0.03, 0], [0, Math.PI / 2, 0], [1, 0.95, 0.9], { outline: 0.6 }); t.add(girth);
  const numTex = tex(numberCanvas(number));
  for (const s of [-1, 1]) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.17, 20), new THREE.MeshBasicMaterial({ map: numTex })); d.position.set(0.05, 0.1, s * 0.4795); d.rotation.y = s > 0 ? 0 : Math.PI; t.add(d); }
  // tail tuft: three layered cones sweeping back and down, plus a root bump
  const tail = new THREE.Group(); tail.position.set(-0.88, 0.14, 0); tail.name = 'tail';
  tail.add(tm(sph(0.1, 8, 6), mane, [0, 0, 0], [0, 0, 0], [1, 1, 1]));
  for (const [rz, len, rad, zz] of [[2.5, 0.9, 0.12, 0], [2.15, 0.75, 0.09, 0.07], [2.85, 0.65, 0.08, -0.07]]) {
        tail.add(tm(new THREE.ConeGeometry(rad, len, 5), mane, [-Math.sin(rz) * len * -0.5 * -1, Math.cos(rz) * len * 0.5, zz], [0, 0, rz], [1, 1, 1]));
  }
  t.add(tail); t.userData.tail = tail; tail.userData.noMerge = true;
  groups.push(t);
  // --- neck (local +y toward the head, local -x = top of the neck)
  const n = new THREE.Group();
  n.add(tm(cyl(0.15, 0.24, 0.82, 10), body, [0, 0, 0], [0, 0, 0], [1, 1, 0.82], { smooth: true }));
  for (let i = 0; i < 6; i++) { const y = -0.33 + i * 0.13; n.add(tm(new THREE.ConeGeometry(0.075, 0.3 + (i % 2) * 0.08, 5), mane, [-0.2, y, 0], [0, 0, Math.PI / 2 + 0.55 - i * 0.04], [1, 1, 1], { outline: 0.8 })); }
  n.add(tm(box(0.08, 0.82, 0.12), mane, [-0.16, 0, 0], [0, 0, 0], [1, 1, 1], { outline: 0.5 }));
  n.add(tm(new THREE.TorusGeometry(0.2, 0.03, 6, 14), leather, [0, 0.33, 0], [Math.PI / 2, 0, 0], [1, 0.82, 1], { outline: 0.6 }));
  groups.push(n);
  // --- head (local +y toward the nose, local -x = forehead)
  const h = new THREE.Group();
  h.add(tm(cyl(0.11, 0.2, 0.58, 12), body, [0, 0.02, 0], [0, 0, 0], [1, 1, 0.82], { smooth: true }));
  h.add(tm(sph(0.13, 12, 8), snout, [0, 0.3, 0], [0, 0, 0], [1, 0.9, 0.82], { smooth: true }));
  for (const s of [-1, 1]) h.add(tm(sph(0.022, 5, 4), eyeB, [0.015, 0.4, s * 0.06], [0, 0, 0], [1, 1, 1], { outline: false }));
  h.add(tm(box(0.025, 0.42, 0.06), sock, [-0.115, 0.0, 0], [0, 0, 0.06], [1, 1, 1], { outline: 0.5 })); // blaze
  // blinker hood: silks band round the head with the eyes poking through
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.235, 0.24, 16, 1, true), toon(0xffffff, { map: tex(silksCanvas(silk.kind, silk.a, silk.b), [1, 1]), side: THREE.DoubleSide }));
  hood.position.set(0, -0.13, 0); hood.scale.z = 0.92; hood.castShadow = true; h.add(hood);
  h.add(tm(new THREE.TorusGeometry(0.17, 0.02, 6, 14), leather, [0, -0.045, 0], [Math.PI / 2, 0, 0], [1, 0.87, 1], { outline: 0.6 }));
  h.add(tm(new THREE.TorusGeometry(0.125, 0.026, 6, 14), leather, [0, 0.22, 0], [Math.PI / 2, 0, 0], [1, 0.9, 1], { outline: 0.6 })); // noseband
  for (const s of [-1, 1]) {
    h.add(tm(new THREE.ConeGeometry(0.065, 0.24, 5), body, [-0.1, -0.3, s * 0.1], [0.28 * s, 0, 1.45], [1, 1, 0.8]));
    // big round cartoon eyes
    h.add(tm(sph(0.13, 14, 10), eyeW, [-0.045, -0.15, s * 0.16], [0, 0, 0], [1, 1, 0.7], { outline: 1 }));
    h.add(tm(sph(0.062, 10, 8), eyeB, [-0.01, -0.125, s * 0.235], [0, 0, 0], [1, 1, 0.55], { outline: false, shadow: false }));
    h.add(tm(sph(0.022, 6, 5), eyeW, [-0.03, -0.1, s * 0.265], [0, 0, 0], [1, 1, 1], { outline: false, shadow: false }));
    h.add(tm(sph(0.03, 6, 5), brass, [0.0, 0.0, s * 0.165], [0, 0, 0], [1, 1, 1], { outline: 0.5 })); // bridle ring
  }
  // forelock bristles
  for (let i = -1; i <= 1; i++) h.add(tm(new THREE.ConeGeometry(0.04, 0.2, 4), mane, [-0.17, -0.33, i * 0.04], [0, 0, 1.2 + i * 0.12], [1, 1, 1], { outline: 0.7 }));
  groups.push(h);
  // --- legs: thigh/upper (coat), lower (coat, white sock, oversized dark hoof)
  for (let i = 0; i < 4; i++) {
    const u = new THREE.Group();
    u.add(tm(cyl(0.135, 0.085, 0.54, 9), body, [0, 0, 0], [0, 0, 0], [1, 1, 0.92], { smooth: true }));
    u.add(tm(sph(0.095, 8, 6), body, [0, -0.27, 0], [0, 0, 0], [1, 1, 1], { smooth: true, outline: 0.9 }));
    u.scale.y = 1.32; groups.push(u);
    const l = new THREE.Group();
    l.add(tm(cyl(0.075, 0.058, 0.58, 8), body, [0, 0.0, 0], [0, 0, 0], [1, 1, 1], { smooth: true }));
    l.add(tm(cyl(0.082, 0.074, 0.27, 8), sock, [0, -0.07, 0], [0, 0, 0], [1, 1, 1], { smooth: true, outline: 0.8 }));
    l.add(tm(cyl(0.1, 0.155, 0.115, 9), hoof, [0.03, -0.218, 0], [0, 0, 0], [1.1, 1, 1], { smooth: true }));
    l.scale.y = 1.32; groups.push(l);
  }
  for (const g of groups) mergeStatic(g, true);
  return groups;
}
/** wobble the tail a little (call each frame with game time) */
export function animateHorse(groups, t, speed = 0) { const tail = groups[0].userData.tail; if (tail) tail.rotation.z = Math.sin(t * 7 + groups[0].id) * (0.12 + Math.min(0.4, speed * 0.05)); }

// ---------------------------------------------------------------- environment helpers
function noise2(x, z) {
  const f = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return (f(xi, zi) * (1 - u) + f(xi + 1, zi) * u) * (1 - v) + (f(xi, zi + 1) * (1 - u) + f(xi + 1, zi + 1) * u) * v;
}
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function labelCanvas(text, { w = 512, h = 128, bg = '#d3432b', fg = '#f2e1ad', font = '900 80px Shrikhand, Impact, sans-serif', border = '#2b1810', stripe = null } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (stripe) { g.fillStyle = stripe; g.fillRect(0, 0, w, h * 0.1); g.fillRect(0, h * 0.9, w, h * 0.1); }
  g.lineWidth = h * 0.06; g.strokeStyle = border; g.strokeRect(0, 0, w, h);
  g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#2b1810'; g.shadowOffsetX = h * 0.03; g.shadowOffsetY = h * 0.03; g.fillText(text, w / 2, h * 0.54);
  return c;
}
const labelPlane = (text, w, h, opts) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex(labelCanvas(text, { ...opts, w: opts?.w || 512, h: Math.round((opts?.w || 512) * h / w) })), fog: true }));

function awningTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d');
  const cols = ['#d3432b', '#e5af2c', '#305da2', '#f2e1ad']; for (let i = 0; i < 16; i++) { g.fillStyle = cols[i % 4]; g.fillRect(i * 32, 0, 32, 64); }
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 54, 512, 10); return tex(c);
}

/** tote board texture: rows of silks + odds, redrawn by env.tote.draw(rows) */
function makeTote() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d'); const t = tex(c);
  const silkCache = {};
  const draw = (rows = [], title = 'WIN ODDS') => {
    g.fillStyle = '#1d140f'; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = '#4c2c21'; g.fillRect(0, 0, 1024, 84); g.fillStyle = '#e5af2c'; g.fillRect(0, 78, 1024, 8);
    g.fillStyle = '#f2e1ad'; g.font = '84px Shrikhand, Impact, serif'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('TOTE', 28, 46);
    g.font = '40px Bungee, Impact, sans-serif'; g.textAlign = 'right'; g.fillStyle = '#e5af2c'; g.fillText(title, 996, 46);
    rows.slice(0, 4).forEach((r, i) => {
      const y = 106 + i * 100;
      g.fillStyle = i % 2 ? '#2a1b14' : '#33211a'; g.fillRect(14, y, 996, 92);
      const k = r.silk.kind + r.silk.a + r.silk.b; if (!silkCache[k]) silkCache[k] = silksCanvas(r.silk.kind, r.silk.a, r.silk.b, 96, 96);
      g.fillStyle = '#f2e1ad'; g.beginPath(); g.arc(70, y + 46, 38, 0, 7); g.fill(); g.drawImage(silkCache[k], 0, 0, 96, 96, 38, y + 14, 64, 64);
      g.strokeStyle = '#f2e1ad'; g.lineWidth = 4; g.strokeRect(38, y + 14, 64, 64);
      g.fillStyle = '#f2e1ad'; g.font = '44px Bungee, Impact, sans-serif'; g.textAlign = 'left'; g.fillText(String(i + 1) + '  ' + r.name.toUpperCase().slice(0, 14), 130, y + 50);
      g.fillStyle = r.hot ? '#ff7a45' : '#ffb347'; g.textAlign = 'right'; g.font = '62px Bungee, Impact, monospace'; g.fillText(r.odds, 990, y + 52);
    });
    t.needsUpdate = true;
  };
  draw();
  return { tex: t, draw };
}

// ---------------------------------------------------------------- environment
export function buildEnvironment(scene, _tex, rng) {
  const env = { spectators: null, clouds: [], excite: 0, sky: null };
  // sky: warm gradient + low sun glow
  const sky = new THREE.SphereGeometry(500, 24, 14), cols = [], c = new THREE.Color(), cTop = new THREE.Color(0x8fb0bf), cMid = new THREE.Color(0xd2dac0), cHor = new THREE.Color(0xfbf1b6), cLow = new THREE.Color(0xf0d28a);
  const pos = sky.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 500, az = Math.atan2(pos.getX(i), pos.getZ(i)), ridge = 0.05 + 0.035 * Math.sin(az * 5 + 1) + 0.02 * Math.sin(az * 13) + 0.012 * Math.sin(az * 29); if (y >= 0 && y < ridge) { c.set(y < ridge * 0.45 ? 0x7d9040 : 0x8fa04a).lerp(cMid, 0.35); cols.push(c.r, c.g, c.b); continue; } if (y < 0) c.copy(cLow); else if (y < 0.18) c.copy(cHor).lerp(cMid, y / 0.18); else c.copy(cMid).lerp(cTop, Math.min(1, Math.pow((y - 0.18) / 0.6, 0.8))); cols.push(c.r, c.g, c.b); }
  sky.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const skyG = new THREE.Group(); skyG.name = 'sky';
  skyG.add(new THREE.Mesh(sky, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));
  { const gc = document.createElement('canvas'); gc.width = gc.height = 256; const g = gc.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,248,214,1)'); gr.addColorStop(0.2, 'rgba(255,236,170,0.8)'); gr.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(380, 380), new THREE.MeshBasicMaterial({ map: tex(gc), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    glow.position.set(210, 60, -420); glow.lookAt(0, 0, 0); skyG.add(glow); }
  scene.add(skyG); env.sky = skyG;
  scene.background = new THREE.Color(0xd2dac0);
  scene.fog = new THREE.Fog(0xb4c6c4, 30, 320);   // sky-coloured haze: far hills and stands read paler

  // grass with mowing stripes + far hills
  const hg = new THREE.PlaneGeometry(560, 330, 56, 28).rotateX(-Math.PI / 2), hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    const x = hp.getX(i) + 50, z = hp.getZ(i) - 55;
    const far = smooth(28, 110, -z), side = smooth(150, 230, Math.abs(x - 50)), n = 0.4 + 0.6 * noise2(x * 0.02, z * 0.02) + 0.2 * noise2(x * 0.07, z * 0.07);
    hp.setY(i, Math.max(far * 95, side * 9) * n - 0.1);
  }
  const hn = hg.toNonIndexed(); hn.computeVertexNormals();
  const hc = [], g1 = new THREE.Color(0xa8ad4a), g2 = new THREE.Color(0x96a444), g3 = new THREE.Color(0x7d9040), cc = new THREE.Color(), haze = new THREE.Color(0xb4c6c4), hillC = new THREE.Color(0x4f7f5a), p2 = hn.attributes.position;
  for (let i = 0; i < p2.count; i += 3) {
    const y = (p2.getY(i) + p2.getY(i + 1) + p2.getY(i + 2)) / 3, x = (p2.getX(i) + p2.getX(i + 1) + p2.getX(i + 2)) / 3 + 50;
    const wz = p2.getZ(i) - 55, stripe = Math.floor(x / 4) % 2, near = 1 - smooth(-20, 5, wz);
    cc.copy(stripe ? g1 : g2).offsetHSL(0, 0, (stripe ? 0.09 : -0.09) * near).lerp(g3, Math.min(1, y / 11)).offsetHSL((rng() - 0.5) * 0.015, 0, (rng() - 0.5) * 0.03);
    cc.lerp(new THREE.Color(0x4f9a3c), 0.55 * smooth(-4, -16, wz)).lerp(new THREE.Color(0xc9a45a), 0.5 * (1 - smooth(-14, -4, wz)) * (1 - smooth(-4, 6, wz)) * 0).lerp(hillC, smooth(1, 14, y) * 0.8).lerp(haze, 0.35 * smooth(10, 70, 55 - p2.getZ(i)) + 0.25 * smooth(8, 60, y));
    for (let k = 0; k < 3; k++) hc.push(cc.r, cc.g, cc.b);
  }
  hn.setAttribute('color', new THREE.Float32BufferAttribute(hc, 3));
  const hills = new THREE.Mesh(hn, new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp, fog: true })); hills.position.set(50, 3, -45); hills.receiveShadow = true; hills.name = 'hills'; hills.frustumCulled = false; scene.add(hills);

  // treeline on the far hills
  const treeG = new THREE.SphereGeometry(1, 12, 8), trunkG = cyl(0.12, 0.18, 1, 5), tcols = [0x5f7a2e, 0x6f8a3a, 0x7a8a34, 0x9a7a2a, 0x4f6a2a];
  const trees = new THREE.InstancedMesh(treeG, toon(0xffffff), 90), tc = new THREE.Color(), tm4 = new THREE.Matrix4();
  for (let i = 0; i < 90; i++) { const x = -110 + i * 3.6 + (rng() - 0.5) * 3, z = -60 - rng() * 24, s = 3 + rng() * 3, hY = Math.max(0, smooth(40, 120, -(z)) * 18 * (0.4 + 0.6 * noise2((x + 50) * 0.02, (z - 55 + 55) * 0.02))) - 0.1; tm4.compose(new THREE.Vector3(x, hY + s * 0.7, z), new THREE.Quaternion(), new THREE.Vector3(s, s * 0.9, s)); trees.setMatrixAt(i, tm4); trees.setColorAt(i, tc.set(tcols[i % 5])); }
  scene.add(trees);

  // infield lake behind the gap between the stands
  const lake = new THREE.Mesh(new THREE.CircleGeometry(1, 36).rotateX(-Math.PI / 2), toon(0x9cc3bd)); lake.scale.set(22, 1, 11); lake.position.set(32, 0.05, -36); lake.receiveShadow = true; lake.name = 'lake'; lake.frustumCulled = false; scene.add(lake);
  const glint = new THREE.MeshBasicMaterial({ color: 0xfff6d0, transparent: true, opacity: 0.8, fog: true });
  { const gl = new THREE.Group(); for (let i = 0; i < 40; i++) { const q = new THREE.Mesh(new THREE.PlaneGeometry(1 + rng() * 4, 0.3).rotateX(-Math.PI / 2), glint); q.position.set(32 + (rng() - 0.3) * 26, 0.075 + i * 1e-4, -36 + (rng() - 0.5) * 12); gl.add(q); } mergeBasic(gl); lake.parent.add(gl); }

  // dirt track: warm ochre bands with ruts
  const tg = new THREE.PlaneGeometry(190, 9.4, 76, 8).rotateX(-Math.PI / 2), tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) tp.setY(i, (noise2(tp.getX(i) * 0.7, tp.getZ(i) * 0.7) - 0.5) * 0.07);
  const tn = tg.toNonIndexed(); tn.computeVertexNormals();
  const tcol = [], d1 = new THREE.Color(0xcc8930), d2 = new THREE.Color(0xb87a2c), d3 = new THREE.Color(0xe0a850), d4 = new THREE.Color(0x8a9a3e), tq = tn.attributes.position;
  for (let i = 0; i < tq.count; i += 3) {
    const z = tq.getZ(i), x = tq.getX(i); cc.copy(d1).lerp(d2, rng() * 0.8);
    if (Math.abs((z + 4.7 + Math.sin(x * 0.05) * 0.6) % (1.4 + 0.5 * noise2(Math.floor(x / 12), 3))) < 0.2) cc.lerp(d3, 0.55);
    cc.offsetHSL(0, 0, (noise2(x * 0.15, z * 0.9) - 0.5) * 0.06 + (noise2(x * 0.03 + 9, z * 0.3) - 0.5) * 0.08);
    cc.lerp(d4, 0.7 * smooth(1.2, 4.7, z) * (0.6 + 0.4 * noise2(x * 0.4, z * 2)));   // far edge fades dirt into trampled grass
    for (let k = 0; k < 3; k++) tcol.push(cc.r, cc.g, cc.b);
  }
  tn.setAttribute('color', new THREE.Float32BufferAttribute(tcol, 3));
  const track = new THREE.Mesh(tn, new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp })); track.position.set(45, 0.005, 0); track.receiveShadow = true; track.name = 'track'; scene.add(track);

  // lines on the track + finish gantry (striped poles, banner, checker line)
  const cream = toon(0xf4ead0), tomato = toon(PAL.tomato), inkM = new THREE.MeshBasicMaterial({ color: PAL.ink });
  const startLine = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 9.2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xf4ead0 })); startLine.position.set(1.2, 0.05, 0); scene.add(startLine);
  const FIN = 60, fin = new THREE.Group(); fin.name = 'finish-line';
  const bmat = new THREE.MeshBasicMaterial({ color: 0x2b1810 }), wmat = new THREE.MeshBasicMaterial({ color: 0xf4ead0 }), cw = 0.5, cells = 18;
  for (let r = 0; r < 2; r++) for (let k = 0; k < cells; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(cw, 9.0 / cells).rotateX(-Math.PI / 2), (r + k) % 2 ? bmat : wmat); m.position.set(FIN - 0.25 + r * cw, 0.055, -4.5 + (k + 0.5) * 9.0 / cells); fin.add(m); }
  const poleTex = (() => { const cv = document.createElement('canvas'); cv.width = 16; cv.height = 128; const g = cv.getContext('2d'); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f4ead0' : '#d3432b'; g.fillRect(0, i * 16, 16, 16); } return tex(cv); })();
  const poleM = toon(0xffffff, { map: poleTex });
  env.finNear = new THREE.Group(); env.finNear.name = 'fin-near'; env.finNear.userData.noMerge = true;
  for (const z of [-5.2, 5.2]) { const gg = z > 0 ? env.finNear : fin; gg.add(tm(cyl(0.2, 0.2, 5.6, 10), poleM, [FIN, 2.8, z])); gg.add(tm(sph(0.3, 10, 8), toon(PAL.mustard), [FIN, 5.7, z])); }
  scene.add(env.finNear);
  const ban = tm(box(0.3, 1.3, 10.8), toon(PAL.tomato), [FIN, 5.2, 0]); fin.add(ban);
  for (const side of [1, -1]) { const lab = labelPlane('FINISH', 6.2, 1.2, { bg: '#d3432b', fg: '#f2e1ad', stripe: '#e5af2c' }); lab.position.set(FIN + side * 0.17, 5.2, 0); lab.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; fin.add(lab); }
  mergeBasic(fin); scene.add(fin);
  // numbered distance poles standing on the far rail (the near side stays clear of the horses)
  for (let d = 10; d <= 50; d += 10) {
    const g = new THREE.Group(); g.position.set(1.2 + d, 0, -4.95);
    g.add(tm(cyl(0.05, 0.05, 1.7, 6), poleM, [0, 0.85, 0], [0, 0, 0], [1, 1, 1], { outline: 0.7 }));
    const lab = labelPlane(String(d), 0.7, 0.7, { w: 128, bg: '#f2e1ad', fg: '#4c2c21', font: '900 78px Bungee, Impact, sans-serif', stripe: '#d3432b' }); lab.position.set(0, 1.95, 0.05); g.add(lab);
    g.add(tm(box(0.78, 0.78, 0.06), toon(PAL.choc), [0, 1.95, 0], [0, 0, 0], [1, 1, 1], { outline: 0.8 })); scene.add(g);
  }

  // rails (chalk white) with chunky posts
  const railM = toon(0xf4ead0);
  for (const z of [-4.7, 4.7]) {
    const near = z > 0, ph = near ? 0.75 : 1.2, n = 62, posts = new THREE.InstancedMesh(box(0.16, ph, 0.16), railM, n), m4 = new THREE.Matrix4(); posts.name = 'posts'; posts.frustumCulled = false;
    for (let i = 0; i < n; i++) { m4.makeTranslation(-18 + i * 3, ph / 2, z); posts.setMatrixAt(i, m4); }
    hullNormals(posts.geometry); posts.castShadow = true; posts.receiveShadow = true; addOutline(posts); scene.add(posts);
    for (const y of (near ? [0.5] : [0.55, 1.0])) scene.add(tm(box(186, 0.1, 0.09), railM, [75, y, z], [0, 0, 0], [1, 1, 1], { outline: 0.8 }));
  }
  // sponsor boards on the far rail (fake brands, 70s pop colours)
  const SP = [['RANCH-O COLA', '#d3432b', '#f2e1ad'], ['ZENITH TV', '#305da2', '#f2e1ad'], ['GOLDEN HOOF OATS', '#e5af2c', '#4c2c21'], ['TOP-CAT TIRES', '#d06322', '#f2e1ad'], ['PRONTO PIZZA', '#95a641', '#f2e1ad'], ['SUNNY LAGER', '#f2e1ad', '#d3432b']];
  for (let i = 0; i < 18; i++) { const s = SP[i % SP.length], lab = labelPlane(s[0], 5, 0.9, { bg: s[1], fg: s[2], w: 640, font: '900 64px Shrikhand, Impact, sans-serif', stripe: '#f4ead0' }); lab.position.set(-6 + i * 6.4, 0.55, -4.6); scene.add(lab); const back = tm(box(5.1, 0.9, 0.06), toon(PAL.choc), [-6 + i * 6.4, 0.5, -4.66], [0, 0, 0], [1, 1, 1], { outline: 0.7 }); scene.add(back); }

  // ---- grandstands (concrete slabs, steel posts, striped scalloped awning, upper glass level)
  const spectators = [], awnTex = awningTexture(), concrete = toon(0xcfc5ae), concrete2 = toon(0xb3a78f), slab = toon(0x9a9079), steel = toon(0x6f6a5e), glass = toon(0x55747a), dark = toon(0x2b2018);
  const benchCols = [PAL.tomato, PAL.mustard, PAL.blue, PAL.avocado];
  const PEOPLE = [0xe5af2c, 0x305da2, 0xd3432b, 0x95a641, 0xd06322, 0xf2e1ad, 0x7a4a2a, 0xc98a5a], SKIN = [0xf5cfa0, 0xe0a878, 0x9b6a45, 0xc58c5c];
  function stand(x0, len, rows, awning) {
    const g = new THREE.Group(); g.name = 'grandstand'; const z0 = -7.4;
    for (let r = 0; r < rows; r++) {
      const y = 0.4 + r * 0.7, z = z0 - r * 1.1;
      const step = tm(box(len, y, 1.1 + 0.02 * r), r % 2 ? concrete : concrete2, [x0 + len / 2, y / 2, z], [0, 0, 0], [1, 1, 1], { outline: 0.7 }); g.add(step);
      g.add(tm(box(len - 0.4, 0.14, 0.3), toon(benchCols[r % 4]), [x0 + len / 2, y + 0.3, z + 0.32], [0, 0, 0], [1, 1, 1], { outline: 0.5, shadow: false }));
      for (let k = 0; k < Math.floor(len / 0.95); k++) if (rng() < 0.92) spectators.push({ x: x0 + 0.7 + k * 0.95 + (rng() - 0.5) * 0.2, y: y + 0.36, z: z - 0.05, ph: rng() * 6.28, col: PEOPLE[Math.floor(rng() * 8)], skin: SKIN[Math.floor(rng() * 4)] });
    }
    g.add(tm(box(len + 1.2, 0.25, rows * 1.1 + 2.4), slab, [x0 + len / 2, 0.05, z0 - rows * 0.55 + 0.5], [0, 0, 0], [1, 1, 1], { outline: 0.8 }));
    const H = rows * 0.7 + 1.6;
    g.add(tm(box(len, H + 0.8, 0.5), concrete2, [x0 + len / 2, (H + 0.8) / 2, z0 - rows * 1.1 - 0.4], [0, 0, 0], [1, 1, 1], { outline: 0.8 }));
    // window slit band on the back wall + upper glass level
    for (let k = 0; k < Math.floor(len / 3); k++) g.add(tm(box(1.8, 0.8, 0.08), glass, [x0 + 1.8 + k * 3, H + 1.4, z0 - rows * 1.1 - 0.1], [0, 0, 0], [1, 1, 1], { outline: 0.6, shadow: false }));
    const roofY = rows * 0.7 + 2.5, rz = z0 - rows * 0.55 + 0.4, rd = rows * 1.1 + 3.2;
    g.add(tm(box(len + 2.4, 0.5, rd), slab, [x0 + len / 2, roofY, rz], [0.08, 0, 0], [1, 1, 1], { outline: 1 }));
    g.add(tm(box(len + 2.4, 0.9, 0.3), concrete, [x0 + len / 2, roofY - 0.1, rz + rd / 2 - 0.1], [0.08, 0, 0], [1, 1, 1], { outline: 0.9 }));
    for (const px of [0.3, len * 0.33, len * 0.66, len - 0.3]) for (const pz of [-0.6, -rows * 1.1 + 0.3]) { const hh = roofY - 0.3; g.add(tm(cyl(0.11, 0.11, hh, 6), steel, [x0 + px, hh / 2, z0 + pz], [0, 0, 0], [1, 1, 1], { outline: 0.7 })); }
    if (awning) { // striped canopy hanging off the front of the roof, scalloped edge
      const am = awnTex.clone(); am.repeat.set(len / 8, 1); am.wrapS = THREE.RepeatWrapping; am.needsUpdate = true;
      const awm = tm(box(len + 1.6, 0.14, 3.0), toon(0xffffff, { map: am }), [x0 + len / 2, roofY - 0.9, z0 + 0.6 - 0.2], [-0.5, 0, 0], [1, 1, 1], { outline: 0.9 }); g.add(awm);
      const nS = Math.floor((len + 1.6) / 0.8);
      for (let k = 0; k < nS; k++) { const sc = tm(cyl(0.4, 0.4, 0.15, 10, 1), toon([PAL.tomato, PAL.mustard, PAL.blue, 0xf2e1ad][k % 4]), [x0 + 0.1 - 0.8 + 0.4 + k * 0.8 + (len + 1.6 - nS * 0.8) / 2, roofY - 1.9 + 0.5 - 0.14, z0 + 1.82 - 0.1], [Math.PI / 2, 0, 0], [1, 1, 1], { outline: 0.8 }); g.add(sc); }
    }
    // roof sign + a TV gantry box
    const cap = tm(box(5, 1.6, 1.8), concrete2, [x0 + len * 0.7, roofY + 1.1, rz - 1], [0, 0, 0], [1, 1, 1], { outline: 0.9 }); g.add(cap);
    const lab = labelPlane('GRAND STAND', 3.4, 0.7, { bg: '#4c2c21', fg: '#e5af2c', w: 1024, stripe: '#d3432b' }); lab.position.set(x0 + len * 0.27, roofY - 0.08, rz + rd / 2 + 0.12); g.add(lab);
    scene.add(g);
  }
  stand(44, 32, 4, true); stand(2, 18, 3, false);
  const sp = spectators, bodyG = new THREE.CylinderGeometry(0.17, 0.2, 0.5, 8), headG = new THREE.SphereGeometry(0.16, 10, 7), armG = new THREE.BoxGeometry(0.07, 0.34, 0.07), hatG = new THREE.ConeGeometry(0.17, 0.2, 7);
  const bodies = new THREE.InstancedMesh(bodyG, toon(0xffffff), sp.length), heads = new THREE.InstancedMesh(headG, toon(0xffffff), sp.length), arms = new THREE.InstancedMesh(armG, toon(0xffffff), sp.length * 2), hats = new THREE.InstancedMesh(hatG, toon(0xffffff), sp.length), col = new THREE.Color();
  sp.forEach((s, i) => { s.h = 0.85 + rng() * 0.3; s.hat = rng() < 0.3; s.wave = rng() < 0.5; bodies.setColorAt(i, col.set(s.col)); heads.setColorAt(i, col.set(s.skin)); arms.setColorAt(i * 2, col.set(s.skin)); arms.setColorAt(i * 2 + 1, col.set(s.skin)); hats.setColorAt(i, col.set([0xd3432b, 0xf2e1ad, 0x305da2, 0x4c2c21][i % 4])); });
  bodies.name = heads.name = arms.name = hats.name = 'crowd'; for (const m of [bodies, heads, arms, hats]) { m.frustumCulled = false; m.castShadow = false; scene.add(m); }
  const mm = new THREE.Matrix4(), qq = new THREE.Quaternion(), ee = new THREE.Euler(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  env.spectators = { update(t, excite) {
    for (let i = 0; i < sp.length; i++) {
      const s = sp[i], b = Math.abs(Math.sin(t * (4 + excite * 6) + s.ph)) * (0.03 + excite * 0.25), hh = s.h;
      mm.compose(p3.set(s.x, s.y + 0.25 * hh + b, s.z), qq.identity(), s3.set(1, hh, 1)); bodies.setMatrixAt(i, mm);
      mm.compose(p3.set(s.x, s.y + 0.55 * hh + 0.1 + b, s.z), qq.identity(), s3.set(1, 1, 1)); heads.setMatrixAt(i, mm);
      if (s.hat) { mm.compose(p3.set(s.x, s.y + 0.55 * hh + 0.31 + b, s.z), qq.identity(), s3.set(1, 1, 1)); hats.setMatrixAt(i, mm); } else hats.setMatrixAt(i, zero);
      const up = s.wave ? Math.min(2.6, 0.5 + excite * 2.4 + Math.sin(t * 9 + s.ph) * 0.3 * excite) : 0.25;
      for (const side of [-1, 1]) { qq.setFromEuler(ee.set(0, 0, side * up)); mm.compose(p3.set(s.x + side * 0.2, s.y + 0.42 * hh + b, s.z), qq, s3.set(1, 1, 1)); mm.multiply(new THREE.Matrix4().makeTranslation(0, 0.15, 0)); arms.setMatrixAt(i * 2 + (side > 0 ? 1 : 0), mm); }
    }
    for (const m of [bodies, heads, arms, hats]) m.instanceMatrix.needsUpdate = true;
  } };
  env.spectators.update(0, 0);

  // ---- tote boards (live) and broadcast camera towers
  env.tote = makeTote();
  for (const [x, z, w] of [[96, -10, 12], [-12, -14, 10]]) {
    const g = new THREE.Group(); g.name = 'tote-board'; const h = w / 2;
    g.add(tm(box(w + 0.8, h + 0.8, 0.5), toon(PAL.choc), [x, 5.2 + h / 2, z], [0, 0, 0], [1, 1, 1], { outline: 1 }));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: env.tote.tex })); face.position.set(x, 5.2 + h / 2, z + 0.27); g.add(face);
    for (const dx of [-w / 2 + 0.6, w / 2 - 0.6]) g.add(tm(box(0.5, 5.4, 0.5), steel, [x + dx, 2.7, z - 0.1], [0, 0, 0], [1, 1, 1], { outline: 0.9 }));
    scene.add(g);
  }
  function tower(x, z, s = 1) {
    const g = new THREE.Group(); g.name = 'camera-tower'; g.position.set(x, 0, z); g.scale.setScalar(s);
    const sc = toon(0x7b756a), deck = toon(0xb8a888), ds = toon(PAL.tomato);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(tm(cyl(0.1, 0.13, 6.4, 6), sc, [dx * 1.0, 3.2, dz * 1.0], [dx * -0.04, 0, dz * 0.04], [1, 1, 1], { outline: 0.8 }));
    for (const y of [1.4, 3.2, 5.0]) for (const [dx, dz, w, d] of [[0, -1, 2.1, 0.08], [0, 1, 2.1, 0.08], [-1, 0, 0.08, 2.1], [1, 0, 0.08, 2.1]]) g.add(tm(box(w, 0.1, d), sc, [dx, y, dz], [0, 0, 0], [1, 1, 1], { outline: 0.6 }));
    g.add(tm(box(2.8, 0.2, 2.8), deck, [0, 6.5, 0], [0, 0, 0], [1, 1, 1], { outline: 0.9 }));
    for (const [dx, dz, w, d] of [[0, -1.4, 2.8, 0.08], [0, 1.4, 2.8, 0.08], [-1.4, 0, 0.08, 2.8], [1.4, 0, 0.08, 2.8]]) g.add(tm(box(w, 0.6, d), ds, [dx, 6.9, dz], [0, 0, 0], [1, 1, 1], { outline: 0.7 }));
    const cam = new THREE.Group(); cam.position.set(0, 7.6, 0.2); cam.rotation.y = 0; cam.name = 'tower-cam';
    cam.add(tm(box(0.7, 0.7, 1.2), toon(0x3b3530), [0, 0, 0], [0, 0, 0], [1, 1, 1], { outline: 0.9 }));
    cam.add(tm(cyl(0.22, 0.28, 0.9, 10), toon(0x1c1816), [0, 0, 1.0], [Math.PI / 2, 0, 0], [1, 1, 1], { outline: 0.9 }));
    cam.add(tm(sph(0.1, 8, 6), toon(PAL.tomato), [0, 0.45, -0.3], [0, 0, 0], [1, 1, 1], { outline: 0.7 }));
    g.add(cam);
    const lab = labelPlane('CH 7', 1.6, 0.55, { bg: '#e5af2c', fg: '#4c2c21', w: 256, font: '900 64px Bungee, Impact, sans-serif' }); lab.position.set(0, 6.9, 1.46); g.add(lab);
    g.userData.cam = cam; scene.add(g); return g;
  }
  env.towers = [tower(32, -5.9, 1.15), tower(-6, -6.5, 1)];
  env.towers[0].userData.cam.rotation.y = 0.2;

  // ---- clouds: soft cream puffs
  const cloudM = new THREE.MeshToonMaterial({ color: 0xfaf0d2, gradientMap: ramp, fog: false });
  for (let i = 0; i < 10; i++) {
    const g = new THREE.Group(), n = 3 + Math.floor(rng() * 3);
    for (let k = 0; k < n; k++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4 + rng() * 2.2, 1), cloudM); m.position.set(k * 3.6 - n * 1.6, rng() * 1.2, (rng() - 0.5) * 2); m.scale.y = 0.5; g.add(m); }
    g.position.set(-60 + i * 22 + rng() * 10, 40 + rng() * 14, -170 - rng() * 70); g.userData.speed = 0.35 + rng() * 0.35; scene.add(g); env.clouds.push(g);
  }
  // merge every static toon mesh into a few draw calls
  const statics = new THREE.Group(); statics.name = 'statics';
  for (const o of [...scene.children]) {
    if (o.isLight || o.isInstancedMesh || ['sky', 'hills', 'track', 'lake'].includes(o.name) || env.clouds.includes(o)) continue;
    if (o.isMesh && (o.material.isMeshBasicMaterial || o.material.isShaderMaterial)) continue;
    if (!(o.isGroup || o.isMesh)) continue;
    statics.add(o);
  }
  scene.add(statics); mergeStatic(statics);
  env.update = (t, dt, camX = 0) => { for (const c of env.clouds) { c.position.x += c.userData.speed * dt; if (c.position.x > camX + 240) c.position.x = camX - 240; } skyG.position.x = camX; };
  return env;
}
