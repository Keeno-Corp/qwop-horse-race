**Judge 5 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - Auto mode (`auto: true`) plays all 60 m, and `YOU` finishes at `finishT` 20.7.
   - Digit2 gives `mode: 2` with `P1` and `P2`. After the countdown, holding Q and U moved `horses.0.x` and `horses.1.x`, so 2P input works.
   - The R restart key was not tested.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - Horses reach `state: "down"` with `plants` counts. `Sir Trips-a-Lot` was `down` with 2 plants at the finish, and `P1` plants early in 2P.
   - Auto-right timing was not measured.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The finish replay shows the REPLAY banner and "SPACE to skip", with a side view of the finish line.
   - `until: {phase:"results"}` still did not complete in 2400 frames. The state was stuck at `replay.pos` 1367 of 1480. The replay is too long, or too slow to get through.
   - The plant moment sheet is `player` 1.9%, a close shot of one downed horse. The AI pack is not framed.

4. **Photo finish and tangled AI collapse within the first minute: 3.**
   - At raceT 24.7, `YOU` had finished at 20.7. `Hoof Hearted` was at x=52.4, `Dusty Rhodes` at 43.5 and `Sir Trips-a-Lot` at 49.1, with none finished.
   - There is no close finish and no PHOTO FINISH popup. Iteration 5's AI tuning did not change this.

5. **Results with most face-plants award: 5.**
   - `results` is populated: YOU, Hoof Hearted, Sir Trips-a-Lot, Dusty Rhodes.
   - The results screen did not appear within 2400 frames, so I could not check the award.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker, green `hills` and dirt `track` match refs/01.jpg.
   - The horse has a blue cloth, white socks and a ringed eye.
   - `dust` is "Never visible" (29.4 units behind `player`).

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 5.**
   - Plants show in the sheet, with a `down` horse on the finish line.
   - There is no photo finish and no visible AI tangle. In the 2P run the AI horses were still lanes apart (z -1.46 and 1.52).

9. **Controls feel learnable: 6.**
   - The perfect rhythm finishes in 20.7 s, which is too fast, and the player dominates.
   - The 2P test shows slow forward progress with held keys (about 1 m in 1.5 s).
   - A human-like rhythm was not tested.

10. **Horses read as horses, match refs/01.jpg: 8.**

11. **Juice: 7.**
    - 22 sounds fired: cheer, thud, gasp, boing, powerup.
    - The commentator popups and the REPLAY banner show.
    - `feel` was not run, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button is visible and the keys move `P1` and `P2`.
    - The HUD hint line shows the 1P keys only. It is unclear whether Q W E R and U I O P are shown in 2P.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 383 draw calls and 33.7k triangles, with 0 MB of assets.
    - Median frame was 114 ms on SwiftShader, which says nothing about a real GPU. Host load was 1.6.

**Faults: 6.**
- The only console line is the PCFSoftShadowMap warning.
- `dust` is "Never visible".
- The finish-to-results flow still does not complete in 2400 frames.
- The photo-finish popup never fires.

**Next:**
1. **Make a photo finish happen (asked again, twice not solved by AI tuning).**
   - Stop tuning `AI.base`, since that failed in Iteration 5. Instead cap the player in auto mode: add a `S.auto` throttle (a longer `AUTO.period`, or skipped rhythm cycles) so `YOU` finishes at 35–45 s.
   - Also cut AI plant frequency (`next` 4–8 s in `AI.update`) and make the rubber band pull trailing AI toward the leader.
   - Done when `interact` with `until: {phase:"replay"}` shows 2+ horses with `finishT` within 0.3 s, and the PHOTO FINISH popup shows in `look`.
2. **Fix the replay so it reaches results (asked again).**
   - Cap the finish replay at about 4 s real time, or advance `pos` faster. The 0.25x playback of ~1480 frames takes too long, and `replay.pos` is still 1367 after 2400 frames.
   - Done when `interact` with `until: {phase:"results"}` returns `phase: "results"`, and `look` shows the most-face-plants award.
3. **Frame the plant replay on the tangle (asked again).**
   - In `subjectAt`, use the centroid of all `down` horses, and pull the lanes closer (z spread of about ±0.8 m instead of ±1.5 m) so the AI visibly collide.
   - Done when `look` during `kind:"plant"` shows 2+ horses overlapping, with the horse meshes over 5% of the frame.
   - Then run `feel` on a face-plant to confirm the shake.

SCORE: 6.7
