**Judge 6 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - Auto mode runs the whole race and `YOU` finishes at `finishT` 21.43.
   - The HUD shows the `1 PLAYER` and `2 PLAYERS (2)` buttons and a RESTART button.
   - The results screen says "Press R for another race · 1 / 2 = players".
   - I did not test 2P input or the R key this session.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - The `plants` counters read 2, 2, 0 and 1, so face-plants register.
   - Auto-right timing was still not measured.
   - After the finish, every horse goes to `pitch` -0.9 with `legs` "0000". Horses that have not finished look stuck in a slump.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The REPLAY banner and "SPACE to skip" show, and the side view of `YOU` slumped on the finish-line checker reads clearly.
   - `until: {phase:"results"}` still did not complete in 3000 frames. The replay sat at `pos` 1471 of 1490, and results only came after 200 more frames.
   - The replay is an end-of-race slump, not a funny moment.

4. **Photo finish and tangled AI collapse within the first minute: 3.**
   - `YOU` finished at 21.43. At raceT 25.45 `Dusty Rhodes` was at x 53.96, `Sir Trips-a-Lot` at 45.78 and `Hoof Hearted` at 44.86, and none had finished.
   - The results list `Dusty Rhodes` and the two others as "DNF · 4 m short" and "13 m short".
   - There is no photo finish and no PHOTO FINISH popup.
   - `tangles` reads 2, but the AI lanes are still about 1 m apart in z (−1.39, −0.39, 1.41), and the finish replay does not show a tangle.

5. **Results with most face-plants award: 7.**
   - The results screen shows a podium and a table with a "MOST FACE-PLANTS" badge.
   - The badge sits on two horses at once, `Sir Trips-a-Lot` and `Hoof Hearted`, since both have 2 plants.
   - The results end the race with 3 DNFs, which is a weak finish.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker with the FINISH banner, green `hills`, `clouds` and dirt `track` match refs/01.jpg.
   - The look reports no `Lighting:` or `Surfaces:` fault lines.
   - `dust` is still "Never visible".
   - On the results camera the subject blends in (edge contrast 0.045).

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 4.**
   - The 60 m race ends with one winner and three horses that never finish.
   - The AIs do not reach the line and no tangle shows.

9. **Controls feel learnable: 6.**
   - The perfect auto rhythm finishes in 21.4 s.
   - I did not test a human-like rhythm.
   - The AIs cannot finish, so the race feels one-sided.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, blue cloth, white socks and ringed eye read well, and the grandstand crowd is blocky and coloured.

11. **Juice: 7.**
    - 25 sounds fired: cheer, thud, gasp, boing and powerup.
    - The commentator chips, the REPLAY banner and the FINISH banner all show.
    - `feel` for camera shake was still not run.

12. **Local 2-player, discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button is visible and the tips line says "2 = two players".
    - The bottom keys panel shows "YOUR LEGS Q W O P" only. I did not check whether 2P shows Q W E R and U I O P.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 382 draw calls and 33.6k triangles, with 0 MB of assets.
    - Median frame was 80.6 ms on SwiftShader, which is no budget signal. Host load was 1.8.

**Faults: 6.**
- The only console line is the PCFSoftShadowMap warning.
- `dust` is "Never visible".
- Photo finish is still 0 for 3 sessions (sessions 4–6).
- The replay is slow to reach results, 3000 frames without arriving.

**Next:**
1. **Make a photo finish happen (asked again, a third time).**
   - AI tuning of `AI.base` has failed three times, so stop it. The AIs stall at 45–56 m and never finish.
   - In `AI.update`, add a rubber band toward the leader, and a hard rule that AIs cannot lose more than 3 m once `x` is over 40. Make a stalled AI (`legs` "0000" or `down`) get up within about 1.5 s.
   - Optionally, force a photo finish by capping the leader at x=58 until a second horse is within 0.3 m.
   - Done when `interact` with `{state:{auto:true}}` and `until: {phase:"replay"}` shows 2+ horses with `finishT` within 0.3 s, and `look` shows a PHOTO FINISH popup.
2. **Make the replay reach results quickly (asked again).**
   - The finish replay is `pos` 1471 of 1490 after 3000 frames. Cap it at about 4 s real time, for example `of` ≤ 240 frames at 1x or 0.6x.
   - Done when `interact` with `until: {phase:"results"}` returns `phase: "results"` within 1500 frames.
3. **Make the face-plant tangle show (asked again).**
   - Pull the AI lanes together (z spread about ±0.6 instead of ±1.4) and aim the plant replay at the centroid of the `down` horses in `subjectAt`.
   - Done when `look` during a `kind:"plant"` replay shows 2+ horses overlapping, with the horse meshes over 5% of the frame.
   - Then run `feel` on a face-plant to confirm the shake.
   - If time allows, fix `dust` so it is visible behind `player` (parent it to the world, not the camera-far group).

SCORE: 6.5
