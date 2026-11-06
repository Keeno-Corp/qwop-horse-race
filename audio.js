// Audio team (c): every sound in the game goes through cue(name, ...args); updateAudio(dt) runs the ambience (crowd bed, hoofbeats, tape hiss).
import { sfx } from './fx.js';

export function createAudio(G) {
  sfx.define('cheer', { volume: 0.55, frequency: 260, attack: 0.25, sustain: 0.9, release: 0.9, shape: 4, noise: 1.2, tremolo: 0.3, filter: -200 });
  sfx.define('gasp', { volume: 0.5, frequency: 520, attack: 0.04, sustain: 0.18, release: 0.3, shape: 4, noise: 0.9, slide: -0.25, filter: -300 });
  sfx.define('boing', { volume: 0.5, frequency: 180, shape: 1, sustain: 0.08, release: 0.3, slide: 3.5 });
  // ambience: a soft filtered-noise murmur, replayed back to back; hoof ticks; tape hiss
  sfx.define('crowd', { volume: 0.3, frequency: 150, attack: 0.18, sustain: 0.5, release: 0.3, shape: 4, noise: 2.5, tremolo: 0.25, filter: -650, seed: 7 });
  sfx.define('hoof', { volume: 0.35, frequency: 95, attack: 0.002, sustain: 0.004, release: 0.06, shape: 4, noise: 1.5, filter: -900, seed: 3 });
  sfx.define('hiss', { volume: 0.12, frequency: 4200, attack: 0.05, sustain: 0.35, release: 0.1, shape: 4, noise: 3, filter: 3500, seed: 11 });
  // bugle: call to post (three pitches, square-ish tone with a slight scoop)
  sfx.define('bugle', { volume: 0.28, frequency: 392, attack: 0.02, sustain: 0.1, release: 0.08, shape: 2, slide: 0.25, filter: -2500, seed: 1 });
  sfx.define('bugle2', { volume: 0.28, frequency: 523, attack: 0.02, sustain: 0.1, release: 0.08, shape: 2, slide: 0.25, filter: -2500, seed: 1 });
  sfx.define('bugle3', { volume: 0.3, frequency: 659, attack: 0.03, sustain: 0.4, release: 0.25, shape: 2, tremolo: 0.1, filter: -2800, seed: 1 });
  sfx.define('bell', { volume: 0.3, frequency: 1250, attack: 0.002, sustain: 0.05, release: 0.8, shape: 0, modulation: 0.7, decay: 0.2, sustainVolume: 0.4 });

  const CUES = {
    countdown: () => { play('blip', 0.7); },                                  // 3, 2, 1 beeps
    go: () => { play('bugle', 0.8); play('bugle', 0.8, 0.16); play('bugle2', 0.8, 0.32); play('bugle3', 0.9, 0.5); play('powerup', 0.6, 0.1); play('cheer', 0.6, 0.45); },   // race start fanfare
    plant: () => { play('thud', 0.8); play('gasp', 0.8, 0.03); },         // a face-plant / cartwheel / etc.
    rise: () => { play('boing', 0.5); },                                      // a horse stands back up
    finish: () => { play('bell', 0.9); play('bell', 0.9, 0.22); play('bell', 0.9, 0.44); play('cheer', 1, 0.05); play('powerup', 0.5, 0.1); },   // first horse crosses the line
    tangle: () => { play('cheer', 0.7); },                                    // pile-up
    replayFinish: () => { play('cheer', 0.8); },                              // the photo-finish replay starts
  };
  function cue(name, ...args) { const f = CUES[name]; if (f) f(...args); }

  // every ambience/cue sound goes through play() so tests can read counts from observe().audio
  const ST = { counts: {}, crowdVols: [], crowdBase: null, crowdMax: 0, hissOutside: 0, hoofOutside: 0, bugleCalls: 0, bellCalls: 0, hoofVolMax: 0 };
  function play(name, vol = 1, when = 0) {
    const ph = G.S.phase; ST.counts[name] = (ST.counts[name] || 0) + 1;
    if (name === 'crowd') { if (ST.crowdBase === null) ST.crowdBase = vol; ST.crowdMax = Math.max(ST.crowdMax, vol); ST.crowdVols.push(+vol.toFixed(2)); }
    if (name === 'hiss' && ph !== 'replay') ST.hissOutside++;
    if (name === 'hoof') { if (ph !== 'race' && ph !== 'finishing') ST.hoofOutside++; ST.hoofVolMax = Math.max(ST.hoofVolMax, vol); }
    if (name.startsWith('bugle')) ST.bugleCalls++;
    if (name === 'bell') ST.bellCalls++;
    return sfx.play(name, vol, when);
  }
  let wrapped = false;
  function wrapObserve() {
    const gm = window.__game; if (wrapped || !gm || !gm.observe) return; wrapped = true;
    const ob = gm.observe; gm.observe = () => ({ ...ob(), audio: { ...ST, crowdVols: ST.crowdVols.slice(-60) } });
  }
  const A = { bed: 0, hoof: 0, hiss: 0, rr: 0, prev: '' };
  function updateAudio(dt) {
    const { S, horses } = G; wrapObserve();
    const ph = S.phase;
    if (ph !== A.prev) { if (ph === 'replay') A.hiss = 0; A.prev = ph; }
    // crowd bed: back-to-back loop through countdown / race / finishing, louder with excitement
    if (ph === 'countdown' || ph === 'race' || ph === 'finishing') {
      A.bed -= dt;
      if (A.bed <= 0) { A.bed = 0.8; play('crowd', Math.min(1, 0.22 + 0.9 * (S.excite || 0))); }
    } else A.bed = 0;
    // hoof ticks: one tick per 0.14 s, round robin over horses that are really running
    if (ph === 'race' || ph === 'finishing') {
      A.hoof -= dt;
      if (A.hoof <= 0) {
        A.hoof = 0.14;
        for (let k = 0; k < horses.length; k++) {
          const h = horses[(A.rr + k) % horses.length];
          if (h.state !== 'run' || h.finished) continue;
          const v = Math.abs(h.torso.body.linvel().x);
          if (v < 1) continue;
          A.rr = (A.rr + k + 1) % horses.length;
          play('hoof', Math.min(0.6, 0.12 + v * 0.05));
          break;
        }
      }
    } else A.hoof = 0;
    // tape hiss only under replays
    if (ph === 'replay') {
      A.hiss -= dt;
      if (A.hiss <= 0) { A.hiss = 0.45; play('hiss', 0.8); }
    }
  }
  return { sfx, cue, updateAudio };
}
