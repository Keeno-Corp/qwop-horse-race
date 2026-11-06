The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 115

**Judge 115**

I played one no-input solo race through to the results card and started a 2-player race. I didn't see the sepia photo-finish replay frames or the head-on cut. The black rectangle from the old Open list is gone. The page is strong.

**Must have scores**
1. Plays as DESIGN.md says: 8. A solo `phase:"results"` was reached at raceT 28.87. `Digit2` gave `mode:2` with horses `P1` and `P2`. Holding Q and U set `legs:"1000"` on both. `div#keys` shows PLAYER 1 Q W E R and PLAYER 2 U I O P. I didn't test Enter to restart.
2. Rapier ragdoll with face-plant and auto-right: 8. `Sir Trips-a-Lot` took 6 `plants` and was still `state:"run"` afterwards, so it recovered. The `FACE-PLANT!` pop was seen in iteration 115.
3. Replay and photo-finish sepia: 6. The results card says "PHOTO FINISH · 0.19s", but I didn't watch the sepia, grain or "PHOTO FINISH" frame replay, so this score is carried from earlier verdicts.
4. Photo finish and tangled AI collapse in the first minute with no input: 9. `Hoof Hearted` finished at 24.35 s and `Dusty Rhodes` at 24.54 s, a 0.19 s gap. `Sir Trips-a-Lot` had 6 face-plants and `tangles:1`. This is one race, though; the builder's ~35% photo-finish rate was not re-measured.
5. Results with most face-plants award: 9. `div#results` has a podium, the badges "DIRT EATER · MOST FACE-PLANTS" and "SMOOTH OPERATOR", and "MOST FACE-PLANTS: SIR TRIPS-A-LOT (6)". It also shows "DNF · 56 M SHORT" for `YOU` and "PRESS R FOR ANOTHER RACE · 1 / 2 = PLAYERS".
6. Looks as LOOK.md says: 9. The 2-player look has toon 3-step shading with black outlines, a 70s orange, olive and mustard palette, and warm light. `postpass-quad` and `div#crt` give the CRT/VHS pass. The grandstand, `GOLDEN HOOF OATS` and `ZENITH` boards and the crowd read clearly. No `Surfaces:` fault was listed, so the `crowd` z-fight fix from iteration 115 holds. `crowd` is behind the camera in both looks, so I couldn't confirm it by pixels.
7. `window.__game` convention, static deploy, no network: 9. The page opened in 0.2 s and fetched only the two fonts (0.32 MB).
8. Horses match CHARACTERS.md and horse.png: 8. White socks, dark hooves, big googly eyes, blinkers, a bristly mane, and saddle cloths with a "4" number and silks all show. The tail tuft and bridle were not checked up close.
9. Broadcast overlay: 9. `div#tote` has odds that moved between looks (`P1` 3-1, `P2` 2-1). `div#lower` carries live one-liners ("AND THEY'RE OFF!" and, at the finish, "THIS ONE IS GOING TO THE PHOTOGRAPHERS… TOO CLOSE TO CALL!"). `div#top-r` has the LIVE bug, the clock and the mode buttons. The top progress strip and the "GO!" card are there too.
10. Camera: 7. The side-tracking telephoto reads well. At results the camera sits at `cam.p` [62.4, 1.6, 10.1] with `blend:1`. I didn't see the replay cams.
11. Controls feel learnable: 7. The `YOUR LEGS` chips and the `div#tips` line help. The human `YOU` horse stayed at x≈2 with no input, as expected. I didn't play a full 60 m run.
12. Local 2-player: 8. The `2 PLAYERS (2)` button works and the 2P HUD labels are clear. Both players' legs respond. Enter restart is still untested.
13. Style judged as hard as gameplay: 9. It reads as a 1970s TV race, with cream and brown results card trim, a tote board and the CRT pass.

**Faults: 8.** There were no console errors and no `Lighting:` or `Surfaces:` lines. `perf` gave 99 ms a frame on SwiftShader (no GPU), so it isn't a budget signal. It also reported 268 draw calls and 128k triangles. The `Never visible` list (`hills`, `lake`, `posts`, `crowd`, `merged`) is all behind-camera or out-of-view objects. In the 2-player look, `dust*` ×16 covers 5.8% of the frame near the hooves.

**Next:**
1. Show the replay path. Run `interact` with `until:{phase:"results"}` and a `look` a few seconds before it, or `look` with `cameras`. Check the sepia, grain, scratches and gate weave and the "PHOTO FINISH" frame, plus the replay cams. Score 3 and score 10 rest on old evidence.
2. Check the 2-player restart and the full 2-player flow. Use `interact` with Enter after the race and expect `phase` to return to the countdown with `mode:2` kept. Also play one solo run, alternating Q+P then W+O, to see whether `YOU` reaches x=60 in under 60 s (item 11).
3. Zoom on the hooves in the side look at [0,330,1280,520]. Dust and the foreground rail still cut across the lowest horse. If the hooves are hidden, lower the rail or the dust opacity. In the 2-player look, one horse is also hidden behind another at the start.

SCORE: 8.2

## Iteration 153
**Did**
- No code changes; read LATEST.md and the git log only. About 7 minutes were left and the page was not opened.
**Saw**
- No new numbers. Last known state is Judge 115: score 8.2, no console errors, no `Lighting:` or `Surfaces:` faults.
**Next**
- `interact` with `until:{phase:"results"}` plus a `look` just before it, to check the sepia replay and replay cams.
- 2-player restart with Enter (expect countdown with `mode:2` kept), and a solo run alternating Q+P / W+O to see whether YOU reaches x=60 under 60 s.
- Zoom [0,330,1280,520] on the side cam for dust and the foreground rail over the hooves.
**Open**
- Replay cams, the Enter restart and the solo playthrough are still unchecked.
