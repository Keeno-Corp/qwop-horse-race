The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 29
**Did**
- game.js:307 human `h.assist` (pitch-hold torque scale) now `3 + 7*clamp(1 - raceT/7, 0, 1)` (was 2.5 + 2.5 over 5 s): stronger, longer start stabilising.
- Checked the render-target item: broadcast.js:97 already calls `setRenderTarget(null)` before the screen pass, and `scene.fog` already exists (game.js:37, 90..420). No code change; the `look` warning is probably the tool seeing the first pass.
**Saw**
- Pulse run (Q+P / W+O, 18-frame pulses, from frame 260): `horses.2.pitch` low -0.11, `plants:0`, x 7.94 at raceT 1.53 (the previous judge saw a -0.73 low and a plant). Fast, maybe too fast at the start.
- No `look`, no `perf`, no finish/replay played this session.
**Next**
- Play on to `phase:"results"` and `look` at the sepia finish replay. Check the assist is not too strong (x 7.9 at 1.5 s may be a sling, not running). Draw calls (`merged` 142, `tail` 16, `mesh-outline` 18) are still untouched.
**Open**
- Draw-call reduction not started; the "every render call drew into a render target" `look` line is unconfirmed.

### Judge 29

**Judge 29.** I played the opening, a Q/P/W/O pulse run, the plant replay, Space to skip, and the race to `phase:"results"` (frame 1671). I ran `perf` once with `costs`. There were no console errors. I did not see the sepia finish replay: I skipped past it with Space, and the results card shows "PHOTO FINISH · 0.19s". The 2-player mode and the head-on cut were not played.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `GO!`, `div#keys` and `div#tips` show. Solo play ran from start to `results`, and the card says "PRESS R FOR ANOTHER RACE · 1 / 2 = PLAYERS". My human run ended "DNF · 49 M SHORT". In the first 7 s YOU had `plants:2` and a pitch of -0.74. After that I gave no input, so YOU idled at x 9.7.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 8.** `state` switches between `run` and `down`, `legs` shows "1001", "0000" and "1111", and the sound log has thud, gasp and boing. The AI horses recovered and finished. In the replay frame, `horse0` lies flat beside the "Dusty Rhodes" horse, which stands upright.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo-finish): 6.** The plant replay shows the red "INSTANT REPLAY · 0.25X" tag, "SPACE TO SKIP" and a letterbox, and Space exits it. The sepia, grain, scratches, flicker, weave and "PHOTO FINISH" frame have still not been seen by any judge.
4. **Photo finish and tangled AI collapse within the first minute: 8.** `tangles:1` and two AI horses `down` by raceT 7.3. The race finished at 24.4 s with a 0.19 s photo finish.
5. **Results with most face-plants award: 9.** `div#results` shows the podium, the times with gaps, and the "DIRT EATER · MOST FACE-PLANTS" badge on Sir Trips-a-Lot (3 face-plants).
6. **Looks as LOOK.md says: 8.** Toon steps with outlines, an orange and yellow palette, warm light, and the CRT pass (`div#crt` over `postpass-quad`, with chromatic fringing). Depth is still flat. The green `hills` backdrop shows as a flat wash.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored, and nothing is fetched at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** Chunky barrel bodies, white socks, dark hooves, big round eyes, bristly mane, blinkers and bridle. Silks are a red diamond cloth, green stripes, blue polka dots and a yellow/black `#4` cloth. `look` reports 0 of 3 named parts for `horse0`, which is a tool limit from the shader.
9. **Broadcast overlay: 9.** `div#tote` has silks, face-plant counts and moving odds. `div#lower` has the Hank "Hoofbeat" Pruitt line. The `LIVE` bug, `4:00 PM` clock, `RACE TIME`, progress bar and "Grand Stand" signs are there.
10. **Camera: 7.** The side-tracking telephoto and the replay cam both read well. The head-on cut was not seen.
11. **Controls feel learnable: 5.** My Q, P, W, O pulses gave `plants:2` and a pitch of -0.74 by raceT 7. No human finish. The builder's pulse run with a -0.11 pitch low was a different timing, so it is not reproduced.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and `div#keys` show the mode in the HUD. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds, with the tote, lower-third, CRT, letterbox and tag. The results card's striped header is a good touch. The scene is flat with no depth haze.

**Faults: 6.**
- `perf`: 411 draw calls and 159k triangles. `merged` is 142 calls, `Mesh` 56, `merged-outline` 45, `mesh-outline` 18, `tail` 16, and `crowd` 48k triangles. The 196 ms frame is a software renderer on host load 2.4, so it is not a budget signal.
- The `look` on the results frame again says every render call drew into a render target. The builder's note says `setRenderTarget(null)` already runs, so this is unconfirmed.
- `hills` is "Never visible" while in view.
- The sepia replay is still unseen after many judges.

**Next:**
1. **Show the sepia photo-finish replay (asked again).** The race finishes with a close photo finish, but the finish replay was skipped or never reached. Make the finish replay start automatically at `phase:"results"` or just before it. Then `interact` with `until:{replay:{kind:"finish"}}` and `look` with `sample` on a corner pixel. It should read sepia (R>G>B, low saturation), with the "PHOTO FINISH" frame and visible grain. If the replay is never entered, log why in `observe`.
2. **Controls feel (asked again).** Make the human horse's start forgiving. A plain Q+P then W+O pulse should not leave YOU at a -0.7 pitch with 2 plants by raceT 7. Cap the motor torque or add pitch damping for YOU. Check by running the same `interact` pulses with `trace` on `horses.2.pitch` and `horses.2.plants`. It should show a pitch low above -0.4 and `plants:0`, and YOU past x 15 by raceT 7.
3. **Draw calls and depth (asked again).** Merge `merged` (142 calls) and `Mesh` (56) by material across horses, instance `tail` (16) and `mesh-outline` (18), and cut the `crowd` triangles. Then `perf` with `costs` should show under 250 calls in total. Separately, confirm the render-target line: `eval` `renderer.getRenderTarget()` after the results frame draws. It should be null.

SCORE: 7.5
