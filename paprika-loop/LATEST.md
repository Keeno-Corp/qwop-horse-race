The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 36

**Verdict, session 36**

1. **Plays as DESIGN.md's Core loop and Controls say: 9.** The countdown ran into `phase` "race". A Q+P then W+O rhythm took `YOU` (`horses.2`) from `x` 2.23 to 8.14 in 1.2 s with `plants` 0. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons are in `div#top-r`.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Q+W then O+P for 20 frames each took `YOU` to `state` "down", `pitch` -1.03 and `plants` 1. The look shows the sprawled `player-body` with `dust*` chips and a "FACE-PLANT! YOU eats dirt!" pop. I did not watch `state` return to "run".
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** `phase` "replay" came with `replay` `kind` "plant" and `rate` 0.25. The look shows the REPLAY banner, "SPACE to skip" and letterbox bars. A close-up has `horse3-body` (Dusty Rhodes) in view beside `player-body`. The framing is tight and cuts `player-body` at the frame edge, so the pile-up context is thin. I did not see the finish replay.
4. **Photo finish and tangled AI collapse: 8.** Iteration 36 reported a 0.20 s PHOTO FINISH and Dusty DNF with 2 plants. I did not reach a finish this session.
5. **Results with most face-plants award: 9.** Iteration 36 recorded the "DIRT EATER" and "SMOOTH OPERATOR" badges and the podium. Nothing changed here.
6. **Looks as LOOK.md says: 8.** `player-body` shows 47% brightness against 38% around it, with a blue saddle and a `player-marker-*` ring. The scene has the white rail, the stand with its blocky crowd, green `hills` and the `track`. The replay frame is dark, at 26% brightness with 18% near black from the letterbox. The only `Surfaces:` note is the hidden `grandstand` face plane.
7. **window.__game convention, index.html at root: 9.** `observe` and `interact` return `phase`, `raceT`, `horses` and `replay`.
8. **Clip moments in the first minute: 8.** In the first 4 s, `horse3` ran beside `YOU` and a collapse pop appeared. I did not see a no-input AI tangle this session; Iteration 36 had one.
9. **Controls feel learnable: 7.** A plain rhythm gave about 4.9 m/s. That is about 12 s for 60 m, well under 60, but it is much faster than the AI's 22 s finishes. At raceT 4 `YOU` was at `x` 11.3 against AI at 6 to 9, so a rhythm player wins easily and there is no photo finish. Mistimed keys did punish, with a face-plant on the first mistimed attempt.
10. **Horses read as horses, match refs/01.jpg: 9.** The look shows head, neck, mane, tail, white socks and dark hooves. The sunny low-poly hills, stand, crowd and rail all show.
11. **Juice: 8.** The sounds were thud and gasp, and `dust*` ×42 and the pop all fired. I did not run `feel` for camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`, and the tip line `div#tips` shows "2 = two players".
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 77.5 ms frame is SwiftShader, so it is not a fault.

**Faults: 9.** I saw no console errors. The `grandstand` `Surfaces:` face plane is hidden, and `sky` shows as "Never visible", though it is in view behind the track. Host load was 1.3, so the frame time is noise.

**Next:**
1. **Make the AI competitive with a human rhythm.** In the `AI` constructor in game.js, add rubber-banding: raise a trailing AI's speed when `YOU` is ahead, or raise `base` further. Then `interact` the Q+P / W+O rhythm with `until {phase:"results"}`. `YOU` should finish with a margin under about 1 s over the AI `finishT`, instead of leading by about 10 s.
2. **Widen the plant-replay camera.** In the `replay` camera code, pull it back or aim it at the midpoint between the fallen horse and the nearest other horse. Trigger a plant, then `look` during `phase` "replay" with `sample` at the left and right edges. `player-body` should be fully in frame with the neighbouring horses beside it, not cut off. Also lift the exposure: the replay frame was 26% bright with 18% near black.
3. **Prove the auto-right and the finish replay.** `interact` after the plant with `trace` on `horses.2.state` for about 150 frames. It should show "down" then "run" at about 2 s. Then play to `phase` "results" and `look` at the finish `replay` with `kind` "finish" for the REPLAY banner and a side-on 0.25x shot.

SCORE: 8.5

## Iteration 37
**Did** game.js `AI.update`: added rubber-band for x 6–22 (a trailing AI speeds up to 45% when `YOU` leads by >1.5 m). Plant-replay camera in `updateCamera` pulled back (d 5.5→8, pair 6.5→9, fov 38→42) so the fallen horse and neighbours fit.
**Saw** Syntax check only (`node --check`); no look or race run this session.
**Next** (1) Run a Q+P / W+O rhythm to results and check the margin to AI `finishT` is under ~1–3 s. (2) `look` during a plant replay to confirm framing and brightness. (3) Trace `horses.2.state` down→run, and look at the finish replay.
**Open** Both changes unverified in the browser; if the rhythm player now loses badly, soften the 0.09 slope.
