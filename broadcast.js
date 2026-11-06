// Made with paprika3d · https://paprika3d.com
// Full-screen CRT / VHS broadcast pass: barrel curve, scanlines, chromatic fringe, warm faded grade, vignette, noise.
// uReplay 0..1 switches to sepia film: heavy grain, scratches, flicker, gate weave.
import * as THREE from 'three';

export function createBroadcast(renderer) {
  const size = new THREE.Vector2();
  renderer.getDrawingBufferSize(size);
  const rt = new THREE.WebGLRenderTarget(size.x, size.y, { samples: 0 });
  const U = { tDiffuse: { value: rt.texture }, uRes: { value: size.clone() }, uTime: { value: 0 }, uReplay: { value: 0 }, uGlitch: { value: 0 }, uDpr: { value: renderer.getPixelRatio() }, uFlash: { value: 0 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: /* glsl */`
precision highp float;
uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uTime, uReplay, uGlitch, uDpr, uFlash; varying vec2 vUv;
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main(){
  vec2 uv = vUv;
  float film = uReplay;
  float step12 = floor(uTime * 12.0);
  // gate weave + jitter on film, tracking roll / hold glitch on tape
  uv.x += film * (sin(uTime * 9.0) * 0.0025 + (h11(step12) - 0.5) * 0.004);
  uv.y += film * (h11(step12 + 7.0) - 0.5) * 0.004;
  float band = smoothstep(0.0, 0.02, 0.5 - abs(fract(uv.y * 0.9 - uTime * 0.4 * uGlitch) - 0.5));
  uv.x += uGlitch * (0.012 * sin(uv.y * 80.0 + uTime * 40.0) * (1.0 - band) + 0.03 * (h11(floor(uv.y * 40.0) + step12) - 0.5) * step(0.7, h11(step12)));
  uv.y += uGlitch * 0.04 * h11(step12 + 3.0) * step(0.8, h11(step12 + 9.0));
  // barrel curve
  vec2 cc = uv - 0.5; float r2 = dot(cc, cc);
  vec2 d = 0.5 + cc * (1.0 + 0.085 * r2 + 0.04 * r2 * r2);
  // soft rounded-corner mask
  vec2 q = abs(d - 0.5) - (0.5 - 0.035);
  float rad = 0.035;
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad + 0.0;
  float mask = 1.0 - smoothstep(-0.002, 0.004, sd + 0.0);
  // chromatic fringe (grows toward edges)
  vec2 off = cc * (0.0016 + 0.012 * r2) * (1.0 - 0.6 * film) + vec2(uGlitch * 0.004, 0.0);
  vec3 c;
  c.r = texture2D(tDiffuse, clamp(d + off, 0.0, 1.0)).r;
  c.g = texture2D(tDiffuse, clamp(d, 0.0, 1.0)).g;
  c.b = texture2D(tDiffuse, clamp(d - off, 0.0, 1.0)).b;
  // slight horizontal bleed (soft tape)
  vec2 px = 1.0 / uRes;
  c = mix(c, 0.5 * (c + texture2D(tDiffuse, clamp(d + vec2(px.x * 2.0, 0.0), 0.0, 1.0)).rgb), 0.35);
  c = toSRGB(c);
  // warm faded grade
  float luma = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(luma), c, 0.88);
  c = c * vec3(1.07, 1.01, 0.9) * 1.0 + vec3(0.03, 0.02, 0.015);
  c = (c - 0.5) * 1.06 + 0.5; c *= 1.07;
  // sepia film for replays
  float l2 = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 sep = mix(vec3(0.10, 0.06, 0.03), vec3(0.98, 0.88, 0.66), smoothstep(0.02, 0.95, l2)) * (0.92 + 0.08 * h11(floor(uTime * 24.0)));
  c = mix(c, sep, film);
  // scanlines (device-pixel aware), subtle so text stays readable
  float sl = 0.5 + 0.5 * sin(gl_FragCoord.y * 6.28318 / (3.0 * uDpr));
  c *= 1.0 - (0.07 + 0.05 * film) * sl;
  // phosphor mask hint
  c *= 0.985 + 0.015 * sin(gl_FragCoord.x * 6.28318 / (3.0 * uDpr));
  // vignette
  float vg = smoothstep(0.85, 0.2, length(cc * vec2(1.0, 1.1)));
  c *= mix(0.7, 1.0, vg) * mix(1.0, 0.8, film * (1.0 - vg));
  // grain
  float g1 = h21(gl_FragCoord.xy / uDpr + vec2(fract(uTime * 7.3) * 91.0, fract(uTime * 3.1) * 53.0)) - 0.5;
  c += g1 * (0.045 + 0.1 * film);
  // scratches + dust on film
  if (film > 0.01) {
    float s0 = floor(uTime * 14.0);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float x = h11(s0 * 3.7 + fi * 11.3);
      float on = step(0.55, h11(s0 + fi * 5.1));
      float w = 0.0006 + 0.0006 * h11(fi + s0);
      float len = smoothstep(0.0, 0.1, fract(uv.y * 1.0 + h11(s0 + fi) * 3.0));
      c = mix(c, vec3(0.95, 0.9, 0.78), film * on * (1.0 - smoothstep(w, w * 2.2, abs(uv.x - x + 0.0003 * sin(uv.y * 30.0)))) * 0.45 * len);
    }
    vec2 sp = floor(uv * vec2(120.0, 68.0)); float dust = step(0.9985, h21(sp + s0)); c = mix(c, vec3(0.08, 0.05, 0.03), dust * film * 0.8);
    c *= 0.9 + 0.1 * h11(floor(uTime * 20.0));
  }
  c = mix(c, vec3(1.0, 0.95, 0.82), uFlash);
  gl_FragColor = vec4(c * mask, 1.0);
}`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false;
  const scn = new THREE.Scene(); scn.add(quad); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return {
    U,
    setSize() { renderer.getDrawingBufferSize(size); rt.setSize(size.x, size.y); U.uRes.value.copy(size); U.uDpr.value = renderer.getPixelRatio(); },
    render(scene, camera, t) {
      U.uTime.value = t;
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, camera);
      renderer.setRenderTarget(null); renderer.render(scn, cam);
    },
  };
}
