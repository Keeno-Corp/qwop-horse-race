**Verdict, session 23**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `div#keys` (Q W O P), the 1 PLAYER, 2 PLAYERS (2) and RESTART buttons and `div#tips` all show. Replay → results works, and Space skipped the replay. My Q+P / W+O rhythm barely moved `YOU`: 1.39 m after 8 s, then 2.37 m at the end of the race. I did not press 2.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** With no setup, the AI horses face-planted by themselves. `Sir Trips-a-Lot` and `Hoof Hearted` reached `state:"down"` with `plants:1`. By the end `Hoof Hearted` had 2 plants and was back in `state:"run"`, so auto-right works. The `legs` bitmasks follow the keys.
3. **Replay: 8.** The `REPLAY` banner and "SPACE to skip" show over a face-plant replay (`kind:"plant"`, `tangles:1`). The 0.25x rate was not measured.
4. **Photo finish and tangled AI collapse: 8.** A tangle was logged (`tangles:1`) at 7.9 s. The results `div.box` reads "Dusty Rhodes WINS! PHOTO FINISH · 0.10s" with the `finish-line` checker in view.
5. **Results with most face-plants award: 9.** The podium and table show the "DIRT EATER · MOST FACE-PLANTS" badge on `Hoof Hearted` (2 plants), "SMOOTH OPERATOR" on the winner, and a face-plants column.
6. **Looks as LOOK.md says: 8.** `grandstand` with its blocky crowd, white rail, `hills`, the dirt `track` and the replay close-up with saddle and socks match refs/01.jpg. There are no `Lighting:` lines. One `Surfaces:` note on two `grandstand` boxes shares a hidden face plane and only matters from below. `Subject: player drew no pixel` in both looks: the player is hidden or off-camera.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, horses, replay, results and tangles.
8. **Clip moments in the first minute: 8.** Two AI face-plants, a tangle replay and a photo-finish replay happened with the player's input being a bad rhythm. The first laugh is reliably early.
9. **Controls feel learnable: 4.** The suggested "Alternate legs: Q+P then W+O" rhythm gets about 1 to 2 m in 30 s, and `YOU` ended 56 m short with a face-plant. Finishing 60 m in under 60 s is not shown.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, eye, saddle cloth, white socks and dark hooves all read.
11. **Juice: 8.** Sounds fired (thud, gasp, cheer, boing, powerup). The `div.pop`, `#chips` and results box show, and the PHOTO FINISH caption now has a darker backing. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 8.** The "2 PLAYERS (2)" button and the tips line show. 2P play is still unplayed.
13. **Static page, vendored lib, no network: 9.** `perf` gave 386 draw calls, 33.8k triangles and 0 MB of assets. The 80 ms frame is SwiftShader and not a budget signal.

**Faults: 7.** The console has only the PCFSoftShadowMap warning. `dust` is reported as `Never visible` (outside the view). The player horse drew no pixel in either look.

**Next:**
1. **Make the controls learnable (asked again).** Tune the leg motor drive so a simple Q+P / W+O alternation, 10 frames each, gives steady forward motion. Add a stability aid such as a pitch-correcting torque, or a forward impulse on the leg that is down. Showing it done: `interact` with that rhythm for 1800 frames, `trace` `horses.2.x`. It should reach 60 with `plants` 0 or 1.
2. **Keep the `player` horse in frame.** The `Subject: player drew no pixel` line shows the camera follows the AI leaders. Frame the camera on `YOU` plus the nearest rival. A `look` mid-race should show the `player-marker` and `horse2-*` parts at 3% or more of the frame.
3. **Verify and polish 2P.** Press `2`, then hold Q/W/E/R and U/I/O/P in `interact`. `observe` should show two `human` horses (0 and 1) moving. Also make `dust` visible near the leaders so it is not `Never visible`.

SCORE: 7.9
