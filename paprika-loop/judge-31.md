**Verdict, session 31**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** A no-input run reached `phase:"results"` at `raceT` 30.4. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons work. `Digit2` gave `mode` 2 with `P1` and `P2` and a restart. My rhythm test was not a real one: `YOU` had `x` 2.4 and was DNF. A 60 m human finish is still unconfirmed.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `plants` counters run (`Hoof Hearted` 2, `YOU` 1) and `legs` strings are driven per leg. The `YOU` row (`x` 2.37, `state` "run" at the end) suggests auto-right works. I did not watch it directly.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.** I did not watch a replay this session. The previous verdict saw the plant replay at `rate` 0.25. I did not look for a replay on the finish.
4. **Photo finish and tangled AI collapse: 8.** The results show "PHOTO FINISH · 0.10s" with Dusty at 23.92 and Sir Trips-a-Lot at 24.02. `tangles` is 1. This is the first finish margin seen in any session.
5. **Results with most face-plants award: 9.** The results box shows podium cards and four rows. The badges "SMOOTH OPERATOR" and "DIRT EATER · MOST FACE-PLANTS" show, with per-row face-plants and "DNF · 56 m short".
6. **Looks as LOOK.md says: 8.** The `Lighting:` fault is gone. Only the hidden `grandstand` face-plane `Surfaces:` note remains, on faces turned away from view. Subject `player-body` takes 0.87% of the 2P frame and stands out at 54% brightness against 35% around it, with `player-marker-*` rings. The finished look has saddle cloths, rail, stand and crowd.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `mode`, `raceT`, `results` and `horses`.
8. **Clip moments in the first minute: 9.** With no input there is a tangle and a 0.10 s photo finish by `raceT` 24.
9. **Controls feel learnable: 6.** The player with no input reached `x` 2.4 in 30 s. My short 2P test gave `P1` `x` 2.69 at 1.15 s. A human finish of the 60 m race in under 60 s has never been shown.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves, white rail and a blocky crowd in a covered stand all show in the 2P look.
11. **Juice: 8.** 21 sounds fired (cheer, thud, gasp, boing, powerup). The `chips` counters and `finish-line` checker show. `dust` was "Never visible" in the results view but visible in the 2P look. I did not run `feel` for shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button works. The tips line "P1: Q W E R · P2: U I O P · Enter restarts" and the two `div#keys` key rows swap in. Both players move.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 78.6 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** The only console line is the PCFSoftShadowMap warning. Builder's Open note: shadow softness after the wider frustum. The shadows in the 2P look read fine.

**Next:**
1. **Prove a human can finish (asked again).** `interact` with Q+P held ~8 frames, then W+O, repeated, and `until {phase:"results"}`. It should end with `YOU` `finished:true` and `finishT` under 60. If `x` stays near 2, make leg thrust stronger or forgiving enough that a Q+P / W+O alternation advances ~1 m a cycle. Check with `trace` on `horses.2.x`.
2. **Replay camera side (asked again).** In the plant replay, pick the camera side by the nearest running horse's z so `horse3` does not cover the pile-up. A `look` at `replay.pos` ~460 should show `horse0-body` and `horse1-body` with none of them covered.
3. **Cut the PCFSoftShadowMap warning and show the photo-finish replay.** Switch to `THREE.PCFShadowMap` to clear the console line. Then `look` right after a finish with a margin under 0.2 s and confirm the REPLAY banner and a side-on slow-motion shot of the finish line. I never saw a finish replay this session.

SCORE: 8.2
