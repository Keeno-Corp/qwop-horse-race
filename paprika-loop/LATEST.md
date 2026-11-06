The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 4

**Judge 4 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - `setState({auto:true})` plays all 60 m. `YOU` finished at `finishT` 20.55 with 0 plants.
   - The Digit2 key switches to `mode: 2`, and `P1` and `P2` appear in `horses`.
   - Countdown was still running (2.48 s) when I pressed Q and U, so I did not see 2-player movement.
   - R restart was not tested.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - At the finish, `Dusty Rhodes` was `state: "down"` with `plants: 2`, and `Sir Trips-a-Lot` and `Hoof Hearted` had one plant each.
   - Auto-right was not timed.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The finish replay shows the REPLAY banner and "SPACE to skip". It is a side view, and `player` fills 3.1% of the frame, with the finish line visible. It reads well.
   - The plant replay in the sheet shows the AI pack small at the right. `player` is 0.79% and the tangle is not framed. Last session's centroid fix does not show.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - `YOU` finished at 20.55 s. At 24.6 s no AI had finished: `Sir Trips-a-Lot` was at x=50.4, `Hoof Hearted` at 48.7 and `Dusty Rhodes` at 53.0.
   - There is no close finish and no ~0.1 s gap. The tangle itself does appear (plants, `down` horses).

5. **Results with most face-plants award: 5.**
   - `results` is populated (YOU, Dusty Rhodes, Sir Trips-a-Lot, Hoof Hearted). The state was still `phase: "replay"`, and the 2400-frame wait for `results` did not complete.
   - The previous session saw the results screen. I did not see it this time.

6. **Looks as LOOK.md says: 8.**
   - The opening sheet shows four coats, the grandstand with blocky crowd, white rails, green hills and `clouds ×11`. It matches refs/01.jpg.
   - `player` is 1.8% of the opening frame, up from 0.8%.
   - The finish replay shows the checkered line and the dust-brown track. `dust` is "Never visible", at 23.7 units behind the player.

7. **window.__game convention, index.html at root, static deploy: 9.**
   - `observe` returns the state JSON. There are 0 MB of assets and no network use.

8. **Clip moments in the first minute with no input: 6.**
   - Plants and a `down` horse show by the finish.
   - There is no photo finish with a slow-motion side replay, and the pack does not tangle visibly in the plant replay framing.

9. **Controls feel learnable: 6.**
   - The perfect rhythm finishes in 20.5 s, which is too fast for a 40–60 s target.
   - A human's pace was not measured. The player is probably too strong, so the AI plant while the player sails ahead.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, socks, blue cloth and the white-ringed eye read clearly in the finish look.

11. **Juice: 7.**
    - 19 sounds fired: cheer, thud, gasp, boing and powerup. The popups and the REPLAY banner show.
    - `feel` was not run, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 6.**
    - The `2 PLAYERS (2)` button is visible and Digit2 works. I did not confirm that the keys move the horses.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 384 draw calls and 33.8k triangles. Median frame 122 ms on SwiftShader (host load 0.6), which says nothing about a real GPU.

**Faults: 7.**
- The only console line is the PCFSoftShadowMap warning.
- `Never visible`: `dust`.
- The flow does not reach the results screen cleanly. After the finish, the state stays in `phase: "replay"`, and the replay is long (`pos` 1360 of 1471 after 4 s).

**Next:**
1. **Make the AI close the race so a photo finish happens (asked again).**
   - Lower `AI.base` and strengthen the rubber band toward the human, or slow `driveF` for the player, so the auto race ends at 35–45 s with two or more horses within ~0.2 s at the line.
   - Done when `interact` with `until: {phase: "replay"}` shows `finishT` on at least two horses with a gap under 0.3 s, and the PHOTO FINISH popup shows in `look`.
2. **Frame the plant replay on the tangle (asked again).**
   - In `subjectAt`, use the centroid of all `down` horses and keep it within 5 m of the camera.
   - Done when `look` during `kind: "plant"` shows the horses' meshes filling more than 3% of the frame. The sheet's plant moment currently shows `player` at 0.79%.
3. **Verify the finish-to-results flow, 2P and shake.**
   - Run `interact` with `until: {phase: "results"}` after the finish replay and `look` at the most-face-plants award.
   - Play 2P: wait out the countdown, then press Q W E R and U I O P and check that `horses.1.x` and `horses.2.x` advance.
   - Run `feel` on a face-plant to confirm the shake.

SCORE: 6.9

## Iteration 5
**Did** game.js: `AI.base` 0.74-0.86 -> 0.62-0.72; AI rubber band `lead*0.035` -> `lead*0.07` (clamp -0.35..0.5); human lead penalty in `physStep` now starts at 0.3 m ahead of AI mean, 14/m (was 1 m, 8/m).
**Saw** Auto race twice: flow reaches `phase: "results"` cleanly (replay -> results works, raceT ~24.7). Player `finishT` 20.7-20.75 both times; no AI finished by the results screen (best AI x 52 m / 58 m, one run Dusty Rhodes finished at 24.73 = 4 s gap). The tuning did not give a photo finish: AI plant 1-2 times each, which costs more than base speed gains. Player is already at driveF 0 when ahead, so the penalty can't slow it further. Plant-replay framing, 2P, feel, perf not checked.
**Next** (1) Slow the auto player itself (e.g. scale leg torque/`AUTO.period` or have `S.auto` skip rhythm cycles) or cut AI plant frequency (`next` 4-8 s, in `AI.update`) so 2+ AIs finish near the player. (2) `look` during a plant replay to verify tangle framing. (3) 2P Q W E R / U I O P after countdown; `feel` for shake.
**Open** Photo finish still unproven; race ~21 s with perfect rhythm.
