The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 40
**Did** game.js: `S.focus` set at a tangle (`until` raceT+2.2); `updateCamera` race branch eases `fx` 85% toward the `state==="down"` horses' mean x and widens `dist` to ≥11 while it lasts, then returns to `YOU`. `S.deadHeat` (rng()<0.35 per race, set in `resetRace`) now gates the closing-sprint drag that forced the 0.02 s photo finish.
**Saw** `interact until {tangles:1}` +40 frames, raceT 6.68: `horse0-body`, `horse1-body`, `horse3-body` all in frame with "PILE-UP!" and "FACE-PLANT!" pops over them; brightness 43%, 0% near black, no console errors. The offscreen chip shows "◀ YOU 12 m". I did not check finish-time spread across races or the human run to the finish.
**Next** (1) Run several seeds and check `results[*].finishT` spread without deadHeat. (2) Human path: alternate Q+P / W+O for 50 s, check `YOU.finishT` < 60 s. (3) `feel` on the face-plant camera shake; replay fill light.
**Open** The two pops overlap each other (FACE-PLANT over PILE-UP). Per-horse speed jitter was not added; non-dead-heat races rely on natural spread.

### Judge 40

**Verdict, session 40**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `phase` went countdown → race. `div#top-r` holds `1 PLAYER`, `2 PLAYERS (2)` and `RESTART`. `div#keys` shows the Q, W, O, P caps, and `div#tips` says "Alternate legs: Q+P then W+O". I did not run a full race, and I did not press R after a finish.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** At `raceT` 6.02, `Sir Trips-a-Lot` and `Hoof Hearted` were `state` "down" with `plants` 1. Dust sprays at the fall. I did not time down → run.
3. **Replay: 7.** I did not view a replay this session, so this score is carried from session 39's plant replay (`replay.kind` "plant", `rate` 0.25, side-on, REPLAY banner, Space skips).
4. **Photo finish and tangled AI collapse: 8.** `tangles` was 1 at `raceT` 6.02. The live camera now eases to the pile-up, with `horse0-body`, `horse1-body` and `horse3-body` in frame and the "PILE-UP!" pop. `S.deadHeat` makes the photo finish occasional. I did not check finish-time spread across races.
5. **Results with most face-plants award: 8.** Not re-viewed this session. Session 39 saw the podium and the "DIRT EATER · MOST FACE-PLANTS" badge.
6. **Looks as LOOK.md says: 8.** The look shows `grandstand` with crowd, white rail, `track` with dust, and `hills`. Saturation is 64%, 0% near black, 0% blown out. `player-body` takes only 0.61% of the frame, cut by the left edge, because the camera swung to the tangle.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `horses`, `tangles` and `pendingReplay`.
8. **Clip moments in the first minute: 8.** With no input, the pile-up lands at about 6 s. The photo finish is now only sometimes forced. The two big pops overlap each other, so the text is partly unreadable.
9. **Controls feel learnable: 7.** I alternated Q+P and W+O at 8-frame intervals. `YOU` went from `x` 1.4 to 3.76 in 241 frames (the count includes the pre-race wait) with `plants` 0, so the rhythm makes forward progress without falling. I did not run it to the finish line, so a time under 60 s is still unproven.
10. **Horses read as horses, match refs/01.jpg: 9.** The look shows low-poly horses with dark manes, tails, white socks and dark hooves in front of the stand, with the "10 m" marker and a sunny palette.
11. **Juice: 8.** Blip, powerup, cheer, thud and gasp all fired. The face-plant and pile-up pops show, and `div#chips` shows live plant counts. I did not run `feel` for camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`. I did not play 2-player.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 70 ms frame is SwiftShader, so it is not a fault.

**Faults: 7.** I saw no console errors and no `Never visible` object except `sky`, which is a large backdrop. `look` reports `div.pop` "FACE-PLANT!" and `div.pop` "PILE-UP!" overlapping. The builder's Open notes the same overlap. Host load was 2.2, so the frame time is noise.

**Next:**
1. **Stop the pops overlapping.** Queue `div.pop` elements, or stack them with a vertical offset, so "FACE-PLANT!" and "PILE-UP!" don't cover each other when `tangles` fires. Show only the PILE-UP pop when a tangle starts. Check with `interact until {tangles:1}` and `look`: `div.pop` should no longer be listed under overlaps.
2. **Run the human race to the finish.** Continue the Q+P / W+O alternation for about 25 s and check that `YOU.finishT` is under 60 s. Also check that the camera keeps `YOU` in frame during the pile-up easing. `player-body` is cut by the left edge (0.61% of the frame), so keep `fx` between `YOU` and the tangle.
3. **Vary the AI finish times.** Add per-horse speed jitter seeded per race (asked again from session 39, not yet added). Check several `resetRace` seeds without `deadHeat`: `results[*].finishT` should differ by more than 0.3 s. Then run `feel` on the face-plant camera shake and add a replay fill light (replay brightness was 32%).

SCORE: 8.2
