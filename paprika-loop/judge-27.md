I've played through the tangle, both replays, the results screen and perf, so I'm writing the verdict now.

**Verdict, session 27**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips`, `div#keys` and the `div#chips` face-plant counters all show. The race runs to a results screen. A Q P W O rhythm in 10-frame beats got `YOU` only to x 6.7 by raceT 30 s, and `YOU` finished as "DNF · 52 m short". I did not test R or 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks are live, and `state:"down"` and `plants` counters work (Sir Trips-a-Lot 2). The `horse0-body` and `horse0-head` parts are jointed. I did not see auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.** The plant replay is right: `replay.kind` "plant", `rate` 0.25, `t` counting up, `of` 592, with the banner and "SPACE to skip". The finish replay opens on an empty track. The `look` at `phase:"replay"` showed the "20 m" sign, the `PHOTO FINISH!` pop-up and no horses at all, while both leaders were at x ≈ 59. The replay camera does not frame the finish at its start.
4. **Photo finish and tangled AI collapse: 6.** The forced collapse fires at raceT 9.0 and `tangles` is 1. But the two downed horses are Sir Trips-a-Lot (x 19.3, z 1.0) and Hoof Hearted (x 23.2, z −2.3). They are 4 m apart and 3 m across lanes, so there is no visible tangle of legs. The photo finish holds: Dusty Rhodes 23.45 s against Hoof Hearted 23.52 s, "by a nose (0.07s)".
5. **Results with most face-plants award: 9.** The `results` box shows "Dusty Rhodes WINS! PHOTO FINISH · 0.07s", a podium, and badges (SMOOTH OPERATOR, DIRT EATER · MOST FACE-PLANTS). It also shows DNF distances and "Press R for another race".
6. **Looks as LOOK.md says: 6.** The `grandstand` with its crowd, rail, `hills`, `track` and `finish-line` show, and the horses read as in refs/01.jpg. But `Subject: player-marker-0 … drew no pixel; 0 of 0 named parts`. `window.__game.subject` still names "player", which is not in the scene. The `YOU` horse is never on screen in the three looks.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `replay{kind,pos,t,of,rate}`, `results`, `horses` and `tangles`.
8. **Clip moments in the first minute: 6.** The face-plant replay at 9–10 s plays at 0.25x and the photo finish comes at 23.5 s. The first one is two horses lying apart, not a tangle, and the finish replay opens on an empty track.
9. **Controls feel learnable: 4.** `YOU` reached only x 6.7 in 30 s, and was 52 m short at the DNF. Finishing 60 m in under 60 s was not reproduced.
10. **Horses read as horses, match refs/01.jpg: 9.** The first `look` shows head, mane, tail, red saddle cloth, white socks and dark hooves on a dirt track with a rail fence and a grandstand with a blocky crowd.
11. **Juice: 8.** The sounds fired (blip, powerup, cheer, thud, gasp, boing), along with `div#flash`, the pop-ups, the camera and the results box. Shake was not measured with `feel`.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and "2 = two players" are visible. 2P was not run.
13. **Static page, vendored lib, no network: 9.** 383 draw calls, 33.6k triangles, 0 MB of assets. The 82 ms frame is SwiftShader (software renderer), so it is not a fault.

**Faults: 6.** The only console line is the PCFSoftShadowMap warning. `Never visible` is `sky` during the replays. The `Subject` name is broken, the finish-replay camera is empty, and the player is never in frame.

**Next:**
1. **Make the player's race winnable (asked again, Controls feel learnable).** After 4 beats of Q P W O, `YOU` was at x 6.7 at raceT 30 s. Raise the motor torque and forward drive per leg-press, or add a gentle assist when opposite legs alternate, so a 10-frame alternating Q+P, W+O rhythm reaches x ≥ 60 by raceT ≈ 45 s. Check with `interact` of that rhythm repeated, `until: {phase: "finishing"}`, then `observe`, where `horses[2].finishT` should be under 60.
2. **Fix the finish replay camera, and the `Subject` name.** At `phase:"replay"`, `kind:"finish"`, the camera shows the empty track at x ≈ 20 while the leaders are at x ≈ 59. Point the replay camera at the finish line with the first two finishers in frame from `t = 0`. Also set `window.__game.subject` to `player-body`, which exists. A `look` at the replay should list `horse*-body` near the `finish-line`, and a `look` mid-race should list `Subject: player-body`.
3. **Make the forced tangle a visible pile-up.** At raceT 9 the two collapsing AI horses sat 4 m apart in x and 3 m apart in z. Pick the two nearest AI horses, set their z within 0.6 of each other and their x within 1.5, and trip both. Check with `look` at the plant replay's midpoint, where two `horse*-body` groups should overlap with their legs in the same screen box. Keep it within `interact until: {tangles: 1}`, `max` 900.

SCORE: 7.2
