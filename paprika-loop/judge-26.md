**Verdict, session 26**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` show. I pressed Q, P, W, O, Q, P in 10-frame beats, and `YOU` reached only x 2.37 by raceT 29.8 s. `plants` was 1. The AI finished at 22 s. Enter restarted the race, but I did not test R, and I did not run 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks are live, for example "0110" and "1111". Sounds included thud, gasp and boing. I did not see auto-right.
3. **Replay (~4 s, 0.25x, REPLAY banner, Space skips): 6.** The `REPLAY` tag, the "SPACE to skip" line and the `PHOTO FINISH!` pop-up show. But `replay.rate` reads 0.6, not 0.25, and `replay.t` stayed at 0 (`pos` 1865 of 2125). Also, the replay waited 36 s for a stalled human (`phase:"finishing"` from 22 s to 36 s), while the picture sat on the finish line. That is dead time.
4. **Photo finish and tangled AI collapse: 5.** The photo finish holds: `Hoof Hearted` 22.07 s and `Dusty Rhodes` 22.10 s, "by a nose (0.03s)". `tangles` was 0 through about 36 s of race, and no AI had `plants` above 0. The forced pile-up from this iteration did not fire.
5. **Results with most face-plants award: 6.** The `results` array is already ordered by the time of the replay. I did not reach the results screen and did not see the award badge.
6. **Looks as LOOK.md says: 6.** The `grandstand`, crowd, rail, `hills`, `track` with the "50 m" sign, `finish-line` and horses match refs/01.jpg. But `Subject: player drew no pixel; 0 named parts`. `YOU` is off-screen at x 2 while the camera follows the leaders, and only the `div#off2` "◀ YOU 50 m" chip points to it. The player is the subject and is not on screen.
7. **window.__game convention, index.html at root: 9.** `observe` has `phase`, `replay{kind,pos,t,of,rate}`, `results` and `horses`.
8. **Clip moments in the first minute: 5.** The photo finish comes at 22 s. The tangle did not happen, so the 10-second laugh is missing.
9. **Controls feel learnable: 5.** A 6-beat rhythm gave 2.4 m in 30 s. I did not reproduce a 60 m finish in under 60 s.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloths, white socks and dark hooves read clearly in both looks.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer, thud, gasp, boing). The `div#flash`, `PHOTO FINISH!` pop-up, `div#chips` and finish banner show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 7.** "2 = two players" in the tips and the `2 PLAYERS (2)` button. Not run.
13. **Static page, vendored lib, no network: 9.** 382 draw calls, 33.6k triangles, 0 MB of assets. The 113 ms frame is SwiftShader (software renderer), not a real GPU.

**Faults: 6.** The only console line is the PCFSoftShadowMap warning. `Never visible` is only `dust`. The forced tangle did not fire, `Subject` still lists 0 named parts, and `YOU` is not drawn while behind.

**Next:**
1. **Make the AI tangle fire.** In `updateRace`, the pile-up never produced `tangles` 1 by 36 s (`interact` with `until: {tangles: 1}, max: 1800` ran out). Skip the random chance. At raceT ≈ 8–10 s, pick two neighbouring AI horses, push both into the same lane (z within 0.8) and trip one (set its state to a face-plant). Check with `interact` `until: {tangles: 1}`, `max` 900. It should fire before raceT 15, and the replay should catch it as a "big face-plant".
2. **Keep `YOU` in frame, and name its parts.** At x 2 behind the leaders at x 59 the camera shows only the AI, so `Subject: player` is empty. Make the camera follow the player (or frame the player and the leader) until the player has finished, and name `player-body` and `player-head` so `Subject` lists them. A `look` at 20 s with `YOU` trailing should show `Subject: player` at 2% or more.
3. **Fix the replay and the stall.** Set the replay rate to 0.25 (it reads 0.6) and make `replay.t` count up. Cut `humanWait` to about 4 s, or end the finish early with DNF for a player who is far behind, so the replay starts about 3 s after the first finish. Check with `interact` `until: {phase: "replay"}`, which should hold by raceT ≈ 26 s, and then `observe`, where `replay.rate` is 0.25 and `replay.t` is above 0.

SCORE: 6.9
