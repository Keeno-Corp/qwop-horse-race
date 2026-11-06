**Verdict, session 25**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` show, and `YOU` moves under Q+P / W+O. One short rhythm (about 4 s) only took it from x 1.4 to 2.2. After I stopped pressing, it stood at x 4.7 with `plants` 2 while both AI horses finished. I did not press R or run 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks follow the keys. `YOU` reached `plants` 2 and the sounds included "thud", "gasp" and "boing". I did not see auto-right.
3. **Replay: 6.** `replay.t` is not in `observe()`, so the 0.25x rate cannot be measured. I did not watch the banner this session.
4. **Photo finish and tangled AI collapse: 6.** `Hoof Hearted` (`finishT` 22.12) and `Dusty Rhodes` (22.22) finished 0.10 s apart, so the photo finish holds. `tangles` stayed 0 and no AI had `plants` above 0 in this run, so the AI tangle did not happen.
5. **Results with most face-plants award: 7.** `phase:"results"` came at `raceT` 28.6 with `results` ordered Hoof Hearted, Dusty Rhodes, Sir Trips-a-Lot, YOU. I did not look at the screen for the award badge. Results fired while `Sir Trips-a-Lot` (x 35.8) and `YOU` had not finished.
6. **Looks as LOOK.md says: 7.** The `grandstand` with its crowd, white rail, `hills`, dirt `track` and `dust*` match refs/01.jpg. The `Subject: player` line is 1.2% with 0 named parts, which was 3.8% last session. In the mid-race look the `YOU` horse is half hidden behind `horse3` and its yellow saddle cloth. The "GO!" banner covers the grandstand. The camera is so close that horses are cut off at the left edge. There is a grandstand coplanar-face note, on faces turned away.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, mode, raceT, results and horses.
8. **Clip moments in the first minute: 6.** The photo finish came at 22 s. The tangle did not occur in this run, and a laugh in the first 10 s depends on it.
9. **Controls feel learnable: 6.** I could not reproduce the finish in under 60 s from one short rhythm. The earlier 3.3 m/s run is last session's, and I did not test it at length this time.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloths, white socks and dark hooves read clearly.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer, thud, gasp, boing). The `GO!` banner, `div#chips`, `player-marker` and `div#keys` show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 7.** The tips line says "2 = two players" and the `2 PLAYERS (2)` button shows. I did not run 2P this session.
13. **Static page, vendored lib, no network: 9.** 383 draw calls, 33.6k triangles and 0 MB of assets. The 80 ms frame is SwiftShader and says nothing about a real GPU.

**Faults: 7.** The only console line is the PCFSoftShadowMap warning, and `Never visible` is none. `Subject` still lists 0 named parts. The closer camera lets rivals hide `YOU`.

**Next:**
1. **Fix the camera so `YOU` is never hidden (asked again).** Raise the camera or offset it sideways so rivals do not cover `player`, and put `YOU`'s lane in the near half of the frame. Pull the dist back to about 8.5 and keep the fov at 36 during the race. A mid-race `look` at 1.8 s should give `Subject: player` at 3% or more, with `player` not overlapped by `horse3`. Name the player's parts (`player-body`, `player-head`) so `Subject` lists them.
2. **Make the AI tangle reliably in the first 30 s, and let results wait for everyone.** `tangles` was 0 and all AI `plants` were 0 here. Add a forced pile-up event, such as two neighbouring lanes crossing with a stumble at x 20–35 m, and check it with `interact` `until` `tangles` 1. The results screen showed with `Sir Trips-a-Lot` and `YOU` unfinished. Wait for the player, or show DNF for them.
3. **Expose `replay.t` and `replay.rate` in `observe` and test the replay, shake and mistimed keys.** Run `interact` for 2300 frames of a good rhythm and check that `phase` shows "replay" at the finish. Run `feel` on a face-plant for the camera shake. Press Q+W+O+P together and confirm `plants` rises.

SCORE: 7.4
