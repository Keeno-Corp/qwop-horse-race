The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 30
**Did** game.js: plant replay camera now y 2.0→3.0 and z clamped to ≤3.4 (inside the rail); replay clip starts at `end-75` instead of `end-110` so it opens nearer the collapse.
**Saw** `interact until replay` + 20 frames, `look` at replay pos 402/472: rail no longer crosses the horses; horse0/horse1 (down) sit mid-frame with the grandstand behind, but horse3 (Dusty, running) fills the foreground and hides part of them. Only the PCFSoftShadowMap warning. Not run: perf, finish margin, 2P, results.
**Next** (1) Replay camera should avoid a third horse in front: pick the side/angle by the nearest other horse's z, or lower the aim. (2) Full rhythm race: finishT gap vs Dusty, results screen. (3) 2P and R/Enter restarts; the mid-race restart the judge saw.
**Open** Replay opening frame not checked at t:0 for whether horses are already down.

### Judge 30

**Verdict, session 30**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons and the Q W O P legs (`legs` "0000" for `YOU`) are in the state. With no input, `YOU` stayed at x 1.39 and `state` "run". I did not replay my rhythm test this session. Last session's rhythm test reached x 5 with `plants 0`. No full 60 m run has been confirmed in any session, and the mid-race restart seen in judge 29 is still unexplained.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Sir Trips-a-Lot and Hoof Hearted went `state:"down"` with `plants 1`. In the replay look their `horse*-body` and `horse*-head` parts are twisted into a heap. I did not watch auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** The `plant` replay runs at `rate` 0.25 (`of` 472), and the `REPLAY` banner and "SPACE to skip" show. The rail no longer crosses the horses. `horse3` (Dusty, running) fills the left foreground and hides about a third of the pile-up.
4. **Photo finish and tangled AI collapse: 7.** `tangles` 1 fires by raceT 7.9, which is early and funny. I have still never seen a finish margin (`finishT` is null for all four) or a photo-finish replay.
5. **Results with most face-plants award: 7.** The `div#chips` counters exist. I have not seen the results screen in any session.
6. **Looks as LOOK.md says: 7.** Low-poly horses with saddle cloths, a covered `grandstand` with a blocky crowd, white rail, hills and a dirt `track` all show. A `Lighting:` fault line is present: `player-10` is outside the shadow camera of `DirectionalLight` (past its +z edge), so it casts no shadow. The only `Surfaces:` line is two hidden grandstand faces sharing y 0, out of view.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `replay`, `tangles` and `horses`.
8. **Clip moments in the first minute: 8.** The pile-up replay is up by about 8 s with no input, and the three-horse tangle reads clearly. The photo-finish half is still unseen.
9. **Controls feel learnable: 8.** The rhythm test last session showed steady progress. A 60 m finish is unconfirmed.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves, white rail, covered stand with crowd and green hills all show.
11. **Juice: 8.** Ten sounds fired (blip, powerup, cheer, thud, gasp), and the REPLAY banner shows. I did not run `feel` for shake. `dust` is "Never visible" in the replay view.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and the tips text show. I have not run 2P in any session.
13. **Static page, vendored lib, no network: 9.** `perf` shows 383 draw calls, 33.6k triangles and 0 MB of assets. The 87 ms frame is SwiftShader, so it is not a fault.

**Faults: 7.** The `Lighting:` line above is a real fault: the shadow camera covers 52 × 34 units around (6.9, 28, 8) and does not follow the player. The only console line is the PCFSoftShadowMap warning. Frame time is noise on a software renderer.

**Next:**
1. **Fix the shadow camera (the new Lighting fault).** Move `DirectionalLight` and its target with the player or the camera focus, or widen `light.shadow.camera`, or call `stage().fit()`. Done when `look` has no `Lighting:` line and `player-10` shows a shadow.
2. **Verify the unseen paths in one run (asked again).** `interact` with a Q/P/W/O rhythm using `until {phase:"results"}`. Read the `finishT` gap between `YOU` and Dusty, then `look` at the results screen for the face-plants award. Tighten the AI tuning until the gap is under ~0.3 s, and check that a photo-finish replay fires. Separately, find what restarts the race mid-play by tracing `raceT` and `phase` during a long hold.
3. **Keep a running horse out of the replay foreground, then test 2P.** In the plant replay camera, pick the side by the nearest non-tangled horse's z so Dusty (`horse3`) is not in front. A `look` at `replay.pos` ~460 should show `horse0-body` and `horse1-body` uncovered. Then `interact` with `Digit2`, Q W E R and U I O P, and `Enter` and `R` restarts.

SCORE: 7.9
