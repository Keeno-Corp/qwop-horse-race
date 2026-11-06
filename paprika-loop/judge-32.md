**Verdict, session 32**

1. **Plays as DESIGN.md's Core loop and Controls say: 9.** A Q+P then W+O rhythm moved `YOU` from `x` 1.86 to 8.38 in 1.7 s of `raceT`, with no plant and `state` "run". The countdown runs 3, 2, 1, then `phase` "race". The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons are present.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` strings ("1001", "0110") show per-leg motors, and `plants` counters run. `player-body` stayed upright at `pitch` -0.01 under the rhythm. I did not watch a collapse or the auto-right this session.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.** I saw no replay this session. The builder's camera change (height 2.0 to 3.0) is still untested with `look`.
4. **Photo finish and tangled AI collapse: 8.** Session 31 recorded a 0.10 s photo finish and `tangles` 1. I did not reach a finish this session.
5. **Results with most face-plants award: 9.** Session 31 showed the "DIRT EATER · MOST FACE-PLANTS" badge and the "DNF · 56 m short" rows. Nothing changed in this area.
6. **Looks as LOOK.md says: 8.** The `player-body` subject stands out at 49% brightness against 36% around it. It has a blue saddle cloth, a `player-marker-*` ring, flying `dust*` chips, rail, the "10" distance board, and the stand with its blocky crowd. The only `Surfaces:` note is a hidden `grandstand` face plane at y = 0.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `countdown` and `horses`, and `__game` loads from index.html.
8. **Clip moments in the first minute: 9.** The `look` showed `horse3` close beside `YOU` in the starting pack, and session 31's no-input run had a tangle and a photo finish by `raceT` 24.
9. **Controls feel learnable: 8.** A plain rhythm gave about 3.8 m/s, so 60 m takes roughly 16 s, well under 60. I did not run it to `phase` "results", so there is no `finishT` yet. The human pace may now be too fast against the AI, which was at `x` 1.8, 2.4 and 4.3 when `YOU` was at 8.4. I did not test mistimed keys for splits and dog-sits.
10. **Horses read as horses, match refs/01.jpg: 9.** The player horse shows head, neck, mane, tail, white socks and dark hooves. The sunny low-poly hills, covered stand with crowd and white rail all show.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer), and the `dust*` chips and `chips` counters show. I did not run `feel` for camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The `2 PLAYERS (2)` button is in `div#top-r`. Session 31 confirmed both players move.
13. **Static page, vendored lib, no network: 9.** `perf` shows 378 draw calls, 33.5k triangles and 0 MB of assets. The 82.9 ms frame is SwiftShader, so it is not a fault.

**Faults: 9.** I saw no console errors. The PCFSoftShadowMap warning is gone with the move to `PCFShadowMap`. `dust` was "Never visible" at the start, but `dust*` ×32 showed in the race look. The only other note is the hidden `grandstand` `Surfaces:` face plane.

**Next:**
1. **Prove the finish and look at the finish replay (asked again).** `interact` the Q+P / W+O rhythm for about 1000 frames with `until {phase:"results"}`. It should end with `YOU` `finished:true`, `finishT` set and a margin shown. Then `look` right after the finish to confirm the REPLAY banner and a side-on shot at 0.25x. If `finishT` is under about 20 s, make the AI pace match so a rhythm player gets a close race.
2. **Pick the plant-replay camera side by the nearest running horse's z (asked again).** Session 32 only raised the camera height. Trigger a plant with `state` on a middle lane, then `look` at the replay. The `horse0-body` and `horse1-body` pile-up should show with no other horse covering it.
3. **Show that mistimed keys punish.** Press Q+W together and O+P together for 20 frames. `interact` with `trace` on `horses.2.pitch` and `horses.2.plants` should show a dog-sit or face-plant, a collapse banner and `plants` 1. Then let it sit about 2 s to confirm `state` returns to "run". This also covers the auto-right and camera-shake checks.

SCORE: 8.6
