// Made with paprika3d · https://paprika3d.com
// Rapier ragdoll horse: torso, neck, head, 4 legs of 2 segments, hinge joints with motors. x = down the track, y up, z = lanes.
export const DT = 1 / 120;
export const FINISH_X = 60;
export const LEG = ['FL', 'FR', 'BL', 'BR'];
const G_GROUND = 0x8000;

export function createWorld(R) {
  const world = new R.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = DT;
  world.integrationParameters.numSolverIterations = 8;
  const g = world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(30, -0.5, 0));
  world.createCollider(R.ColliderDesc.cuboid(120, 0.5, 14).setFriction(1.4).setRestitution(0).setCollisionGroups((G_GROUND << 16) | 0xffff), g);
  return world;
}

const DIM = {
  torso: [0.78, 0.27, 0.36], upper: 0.6, lower: 0.66, neck: 0.72, head: 0.5,
  hipX: 0.56, hipY: -0.18, hipZ: 0.2,
};
export const STAND_H = 0.18 + 0.6 + 0.66 + 0.03; // torso centre height standing

export const T = { // pose targets (radians)
  hipRel: -0.22, hipHeld: 1.05, kneeRel: 0.0, kneeHeld: -1.9,
  hipK: 700, hipD: 45, hipF: 420, kneeK: 520, kneeD: 32, kneeF: 320,
};

export class Horse {
  constructor(R, world, idx, laneZ, x0, opts = {}) {
    this.R = R; this.world = world; this.idx = idx; this.laneZ = laneZ; this.x0 = x0;
    this.name = opts.name || 'Horse ' + (idx + 1);
    this.h = [0, 0, 0, 0]; this.held = [false, false, false, false];
    this.state = 'run'; this.stateT = 0; this.plants = 0; this.lastPlantKind = ''; this.guard = 1.0;
    this.finished = false; this.finishT = null; this.stiff = 0.3; this.idle = 1;
    this.parts = []; this.joints = [];
    this.build();
  }
  mk(name, pos, rot, shape, mass, extra = {}) {
    const R = this.R, w = this.world;
    const d = R.RigidBodyDesc.dynamic().setTranslation(pos[0], pos[1], pos[2])
      .setRotation({ x: 0, y: 0, z: Math.sin(rot / 2), w: Math.cos(rot / 2) })
      .setLinearDamping(0.05).setAngularDamping(0.4).setCcdEnabled(true);
    const b = w.createRigidBody(d);
    const me = 1 << this.idx, others = (0x3f & ~me);
    const cd = shape.setMass(mass).setFriction(extra.friction ?? 0.9).setRestitution(0.02).setCollisionGroups((me << 16) | (G_GROUND | others));
    const c = w.createCollider(cd, b);
    const p = { name, body: b, collider: c, rest: rot };
    this.parts.push(p); return p;
  }
  joint(a, b, anchorA, anchorB, lo, hi) {
    const R = this.R;
    const jd = R.JointData.revolute({ x: anchorA[0], y: anchorA[1], z: anchorA[2] }, { x: anchorB[0], y: anchorB[1], z: anchorB[2] }, { x: 0, y: 0, z: 1 });
    jd.limitsEnabled = true; jd.limits = [lo, hi];
    const j = this.world.createImpulseJoint(jd, a.body, b.body, true);
    j.configureMotorModel(R.MotorModel.ForceBased);
    this.joints.push(j); return j;
  }
  build() {
    const R = this.R, x0 = this.x0, z0 = this.laneZ, y0 = STAND_H;
    const [hx, hy, hz] = DIM.torso;
    this.torso = this.mk('torso', [x0, y0, z0], 0, R.ColliderDesc.cuboid(hx, hy, hz), 42);
    // neck: pivot on torso front-top
    const nA = [0.62, 0.17, 0], nr = -0.85, nl = DIM.neck;
    const npos = [x0 + nA[0] + Math.sin(-nr) * nl / 2, y0 + nA[1] + Math.cos(nr) * nl / 2, z0];
    this.neck = this.mk('neck', npos, nr, R.ColliderDesc.cuboid(0.13, nl / 2, 0.16), 6);
    this.neckJ = this.joint(this.torso, this.neck, nA, [0, -nl / 2, 0], -2.0, 1.0);
    const hr = -1.9, hl = DIM.head;
    const hp = [npos[0] + Math.sin(-nr) * nl / 2 + Math.sin(-hr) * hl / 2, npos[1] + Math.cos(nr) * nl / 2 + Math.cos(hr) * hl / 2, z0];
    this.head = this.mk('head', hp, hr, R.ColliderDesc.cuboid(0.12, hl / 2, 0.13), 5);
    this.headJ = this.joint(this.neck, this.head, [0, nl / 2, 0], [0, -hl / 2 + 0.04, 0], -2.0, 1.0);
    this.neckT = nr; this.headT = hr - nr;
    this.legs = [];
    const sx = [1, 1, -1, -1], sz = [-1, 1, -1, 1];
    for (let i = 0; i < 4; i++) {
      const lx = x0 + sx[i] * DIM.hipX, lz = z0 + sz[i] * DIM.hipZ, ly = y0 + DIM.hipY;
      const up = this.mk('up' + i, [lx, ly - DIM.upper / 2, lz], 0, R.ColliderDesc.capsule(DIM.upper / 2 - 0.07, 0.085), 5);
      const lo = this.mk('lo' + i, [lx, ly - DIM.upper - DIM.lower / 2, lz], 0, R.ColliderDesc.capsule(DIM.lower / 2 - 0.07, 0.07), 3.5, { friction: 1.6 });
      const hip = this.joint(this.torso, up, [sx[i] * DIM.hipX, DIM.hipY, sz[i] * DIM.hipZ], [0, DIM.upper / 2, 0], -1.4, 1.5);
      const knee = this.joint(up, lo, [0, -DIM.upper / 2, 0], [0, DIM.lower / 2, 0], -2.3, 0.0);
      this.legs.push({ up, lo, hip, knee });
    }
    this.applyMotors(1);
    this.spawn = { x: x0, z: z0 };
    this._ref = new Map(this.parts.map(p => { const t = p.body.translation(); return [p.name, { x: t.x - x0, y: t.y, z: t.z }]; }));
  }
  setHeld(i, v) { this.held[i] = !!v; }
  applyMotors(stiff) {
    const s = stiff;
    for (let i = 0; i < 4; i++) {
      const L = this.legs[i], h = this.h[i];
      const hipRel = T.hipRel + (-0.04 - T.hipRel) * this.idle;
      const hipT = hipRel + (T.hipHeld - hipRel) * h;
      const kneeT = T.kneeRel + (T.kneeHeld - T.kneeRel) * h;
      L.hip.setMotorMaxForce(T.hipF); L.hip.configureMotorPosition(hipT, T.hipK * s, T.hipD * (0.3 + 0.7 * s));
      L.knee.setMotorMaxForce(T.kneeF); L.knee.configureMotorPosition(kneeT, T.kneeK * s, T.kneeD * (0.3 + 0.7 * s));
    }
    this.neckJ.setMotorMaxForce(160); this.neckJ.configureMotorPosition(this.neckT, 260 * s, 24 * (0.3 + 0.7 * s));
    this.headJ.setMotorMaxForce(80); this.headJ.configureMotorPosition(this.headT, 110 * s, 10 * (0.3 + 0.7 * s));
  }
  pos() { const t = this.torso.body.translation(); return t; }
  pitch() { const q = this.torso.body.rotation(); const d = qrot(q, 1, 0, 0); return Math.atan2(d.y, d.x); }
  upY() { const q = this.torso.body.rotation(); return qrot(q, 0, 1, 0).y; }
  headTip() { const b = this.head.body, p = b.translation(), q = b.rotation(); const d = qrot(q, 0, 1, 0); return { x: p.x + d.x * 0.28, y: p.y + d.y * 0.28, z: p.z }; }
  footPos(i) { const b = this.legs[i].lo.body, p = b.translation(), q = b.rotation(); const d = qrot(q, 0, -1, 0); return { x: p.x + d.x * 0.3, y: p.y + d.y * 0.3, z: p.z }; }
  // returns an event string when something notable happens
  step(dt) {
    let ev = null;
    const k = Math.min(1, dt * 20);
    for (let i = 0; i < 4; i++) this.h[i] += ((this.held[i] && this.state === 'run' ? 1 : 0) - this.h[i]) * k;
    const none = !this.held.some(Boolean) && this.h.every((v) => v < 0.05);
    this.idle += ((none ? 1 : 0) - this.idle) * Math.min(1, dt * (none ? 3 : 12));
    this.stateT += dt; this.guard = Math.max(0, this.guard - dt);
    const tb = this.torso.body, p = tb.translation(), v = tb.linvel();
    for (const q of [this.torso, this.neck, this.head]) { q.body.resetForces(false); q.body.resetTorques(false); }
    if (this.state === 'run') {
      this.stiff += (1 - this.stiff) * Math.min(1, dt * 4);
      this.applyMotors(this.stiff);
      // lane keeping + light yaw-free steering
      const m = 42;
      tb.addForce({ x: 0, y: 0, z: (-(p.z - this.laneZ) * 40 - v.z * 25) * m * 0.2 }, true);
      this.drive = Math.max(0, (this.drive || 0) - dt * 0.45);
      if (this.drive > 0) tb.addForce({ x: this.drive * (this.driveF || 150) * 1, y: 0, z: 0 }, true);
      tb.addForce({ x: -v.x * Math.abs(v.x) * (this.drag ?? 16), y: 0, z: 0 }, true);
      // keep the hinge plane upright: torso roll and yaw are springs, pitch is free (that is the game)
      const q = tb.rotation(), f = qrot(q, 1, 0, 0), u = qrot(q, 0, 1, 0), w = tb.angvel();
      const pit = Math.atan2(f.y, f.x), assist = this.assist ?? 1;
      tb.addTorque({ x: -u.z * 5000 - w.x * 450, y: f.z * 5000 - w.y * 450, z: this.finished ? (-(pit + 0.1) * 2600 - w.z * 260) : (-pit * 380 - w.z * 90) * assist * Math.max(0, 1 - Math.abs(pit) / 1.2) }, true);
      // pass the same sideways damping to the neck and head so they stay in plane
      for (const part of [this.neck, this.head]) { const aw = part.body.angvel(); part.body.addTorque({ x: -aw.x * 6, y: -aw.y * 6, z: 0 }, true); }
      // plant detection
      const ht = this.headTip(), pitch = this.pitch(), up = this.upY();
      if (this.guard <= 0) {
        let kind = null;
        if (ht.y < 0.22 && (v.x > 0.8 || pitch < -0.35 || ht.y < 0.12)) kind = 'FACE-PLANT!';
        else if (up < 0.0) kind = 'CARTWHEEL!';
        else if (pitch < -0.95) kind = 'FACE-PLANT!';
        else if (pitch > 1.0) kind = 'BACKFLIP!';
        else if (p.y < 0.62 && this.stateT > 0.5) kind = this.legsSplit() ? 'SPLITS!' : 'DOG SIT!';
        if (kind) { this.collapse(kind); ev = kind; }
      }
    } else if (this.state === 'down') {
      this.stiff = 0.02; this.applyMotors(this.stiff);
      if (this.stateT > 2.1) { this.rise(); ev = 'rise'; }
    }
    return ev;
  }
  legsSplit() {
    const b = this.legs[2].lo.body.translation().x, f = this.legs[3].lo.body.translation().x;
    const fl = this.legs[0].lo.body.translation().x, fr = this.legs[1].lo.body.translation().x;
    return Math.abs(b - f) > 0.8 || Math.abs(fl - fr) > 0.8;
  }
  collapse(kind) {
    this.state = 'down'; this.stateT = 0; this.plants++; this.lastPlantKind = kind;
    for (const p of this.parts) { p.body.setAngularDamping(2.5); p.body.setLinearDamping(0.25); }
    const R = this.world;
    const b = this.torso.body, v = b.linvel();
    // the comic tumble: a shove and a spin, rolling sideways into neighbours
    const side = (this.idx % 2 ? 1 : -1) * (0.6 + 0.8 * ((this.idx * 7 + this.plants * 3) % 5) / 5);
    b.applyImpulse({ x: 0, y: kind === 'CARTWHEEL!' ? 14 : 5, z: side * 12 }, true);
    b.applyTorqueImpulse({ x: side * 5, y: side * 4, z: kind === 'BACKFLIP!' ? 8 : -7 }, true);
    this.headTipVel = v.x;
  }
  rise() {
    // auto-right: stand the horse back up where it fell, with a hop
    const tb = this.torso.body, p = tb.translation();
    const x = p.x, z = Math.max(-1.7, Math.min(1.7, p.z));
    this.laneBias = 0;
    this.place(x, z, STAND_H + 0.1);
    for (const p of this.parts) { p.body.setAngularDamping(0.4); p.body.setLinearDamping(0.05); }
    this.state = 'run'; this.stateT = 0; this.stiff = 0.85; this.idle = 1; this.guard = 1.6; this.h = [0, 0, 0, 0];
  }
  place(x, z, y) {
    const [hx, hy, hz] = DIM.torso;
    const ref = this._ref;
    for (const p of this.parts) {
      const r = ref.get(p.name);
      p.body.setTranslation({ x: x + r.x, y: y - STAND_H + r.y, z: z + (r.z - this.spawn.z) }, true);
      p.body.setRotation({ x: 0, y: 0, z: Math.sin(p.rest / 2), w: Math.cos(p.rest / 2) }, true);
      p.body.setLinvel({ x: 0.3, y: 0, z: 0 }, true); p.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }
  reset(x, z) { this.state = 'run'; this.stateT = 0; this.stiff = 1; this.h = [0, 0, 0, 0]; this.guard = 1.5; this.finished = false; this.finishT = null; this.plants = 0; this.place(x, z, STAND_H + 0.02); for (const p of this.parts) p.body.setLinvel({ x: 0, y: 0, z: 0 }, true); this.laneZ = z; }
}
export function qrot(q, x, y, z) {
  const ix = q.w * x + q.y * z - q.z * y, iy = q.w * y + q.z * x - q.x * z, iz = q.w * z + q.x * y - q.y * x, iw = -q.x * x - q.y * y - q.z * z;
  return { x: ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y, y: iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z, z: iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x };
}
