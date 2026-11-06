// Audio team (c): every sound in the game goes through cue(name, ...args). Same sounds, volumes and delays as before.
import { sfx } from './fx.js';

export function createAudio(G) {
  sfx.define('cheer', { volume: 0.55, frequency: 260, attack: 0.25, sustain: 0.9, release: 0.9, shape: 4, noise: 1.2, tremolo: 0.3, filter: -200 });
  sfx.define('gasp', { volume: 0.5, frequency: 520, attack: 0.04, sustain: 0.18, release: 0.3, shape: 4, noise: 0.9, slide: -0.25, filter: -300 });
  sfx.define('boing', { volume: 0.5, frequency: 180, shape: 1, sustain: 0.08, release: 0.3, slide: 3.5 });

  const CUES = {
    countdown: () => { sfx.play('blip', 0.7); },                                  // 3, 2, 1 beeps
    go: () => { sfx.play('powerup', 0.8); sfx.play('cheer', 0.6, 0.1); },         // race start
    plant: () => { sfx.play('thud', 0.8); sfx.play('gasp', 0.8, 0.03); },         // a face-plant / cartwheel / etc.
    rise: () => { sfx.play('boing', 0.5); },                                      // a horse stands back up
    finish: () => { sfx.play('cheer', 1); sfx.play('powerup', 0.6, 0.1); },       // first horse crosses the line
    tangle: () => { sfx.play('cheer', 0.7); },                                    // pile-up
    replayFinish: () => { sfx.play('cheer', 0.8); },                              // the photo-finish replay starts
  };
  function cue(name, ...args) { const f = CUES[name]; if (f) f(...args); }
  function updateAudio(dt) { /* later: ambience (crowd bed, hoofbeats) */ }
  return { sfx, cue, updateAudio };
}
