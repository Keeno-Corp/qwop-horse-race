The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 7

**Judge 7 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - Auto mode runs the race and the HUD shows `1 PLAYER`, `2 PLAYERS (2)` and RESTART.
   - The results screen is wrong. `YOU` had `finished:true` at `finishT` 21.43, with x 58.41 in the `finishing` phase. The results then read "Dusty Rhodes WINS!", and `YOU` is "DNF · 56 m short" with x 2.38, `legs` "0000" and 1 face-plant.
   - Either the finisher's result is overwritten or the player was reset before results. The correct winner is lost.
   - I did not test 2P or R this session.

2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - Face-plants register: `Hoof Hearted` has `state:"down"` with `plants` 1, then 2.
   - The plant replay shows grey, brown and orange horses sprawled with their legs tangled.
   - Auto-right timing is still unmeasured.
   - Horses finish with `pitch` -0.9 and `legs` "0000".

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - The plant replay (`kind:"plant"`, `pos` 304 of 414) is now framed on the tangle. The REPLAY banner and "SPACE to skip" show. This is the best frame so far.
   - The finishing `look` is covered by `div#flash`, a white overlay at opacity 0.82 (brightness 88%, subject edge contrast 0.029).
   - The finish replay was not seen. `until:{phase:"results"}` came in 2761 frames, which is better than before but still slow.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - The tangle works. `tangles` reads 1, then 2, and by 6.9 s two horses are down with `plants` 1 and others at 2.
   - There is still no photo finish. Dusty Rhodes finished at 24.38 and Sir Trips-a-Lot at 28.25, a gap of 3.87 s. `Hoof Hearted` ended at x 48.67 as a DNF.
   - There is no PHOTO FINISH popup.

5. **Results with most face-plants award: 6.**
   - The podium and table show "SMOOTH OPERATOR", "DIRT EATER" and "MOST FACE-PLANTS" badges. The badge sits on `Hoof Hearted`, who has 2 plants and is the only horse with 2.
   - The winner is wrong (see item 1) and a DNF horse is placed 3rd.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker, green `hills`, `clouds` and dirt `track` all match refs/01.jpg.
   - The look reports no `Lighting:` or `Surfaces:` faults.
   - `dust*` is now visible (52 meshes, 0.6% of the frame).
   - During the finish the subject blends in because of the flash.

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 6.**
   - The tangle replay at 6.9 s is funny: three horses are down in the dirt, and a stranger would laugh.
   - The photo finish and its slow-motion replay did not occur, and the race ends with a wrong result.

9. **Controls feel learnable: 6.**
   - The auto rhythm finishes in 21.4 s.
   - I did not test a human rhythm.
   - The AIs take 24–28 s, so they are now close to the auto player.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, blue, yellow, red and green blankets, white socks, ringed eye and dirt chunks read well.

11. **Juice: 7.**
    - 43 sounds fired across the run: cheer, thud, gasp, boing and powerup.
    - Commentator chips ("FACE-PLANTS 2 · OUCH") and the REPLAY and FINISH banners show.
    - The `feel` camera shake was not run, and the flash is too heavy.

12. **Local 2-player discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button and the tips line ("2 = two players") show.
    - The keys panel shows only "YOUR LEGS Q W O P". I did not check Q W E R / U I O P.

13. **Static page, vendored lib, no network: 9.**
    - 382 draw calls and 33.6k triangles with 0 MB of assets.
    - The 74.5 ms median frame is SwiftShader noise. Host load was 1.5.

**Faults: 5.**
- The wrong winner is the main fault: `YOU` finished at 21.43, yet results list `YOU` as a 56 m DNF at x 2.38.
- The only console line is the PCFSoftShadowMap warning.
- The finish `div#flash` (opacity 0.82, white) hides the scene.
- There is still no photo finish after four sessions.

**Next:**
1. **Fix the results bookkeeping.**
   - A horse with `finished:true` and `finishT` must stay in `results` as a finisher, and `YOU` must not be reset or counted DNF.
   - Look at where the `finishing` phase and `YOU` are re-simulated after the replay (a replay or `setState` restoring `x`), and at the 9 s wait.
   - Done when `interact` with `{state:{auto:true}}` and `until:{phase:"results"}` returns a `results` list whose first entry is the horse with the lowest `finishT`. With `YOU` at 21.43 s, that is `YOU`, and `YOU` shows no "DNF".
2. **Make a photo finish happen (asked again, a fourth time).**
   - Stop waiting 9 s for stragglers. Once the leader is at x 55, cap the leader's speed and rubber-band the nearest AI to within 0.3 m.
   - Then show a PHOTO FINISH popup and a slow-motion side replay on the finish line.
   - Reduce the white `div#flash` to about 0.25 opacity and fade it over 0.3 s.
   - Done when `until:{phase:"replay"}` shows two horses with `finishT` within 0.3 s, and `look` shows the popup with the checker and both horses visible.
3. **Shorten the race end and check 2P and the shake.**
   - Cap the replay and result wait so results arrive within about 1500 frames after the first finish.
   - Run `feel` on a face-plant to confirm the camera shake.
   - Run `interact` with `{key:"Digit2"}` and look at whether `div#keys` shows Q W E R and U I O P.

SCORE: 6.9

## Iteration 8
**Did** game.js `AI.update`: rubber band now starts at x 22 (was 30), gain 0.15, floor 0.3x period; `finishing` wait cut 9 s to 5 s; `#flash` opacity cap 0.3 (was 0.85), fades faster.
**Saw** Auto race before the change: results list was already correct (`YOU` first, finishT 21.43, no DNF), so the judge's wrong-winner was not reproduced. After: `YOU` 21.75, Dusty Rhodes 23.27 (gap 1.52 s, no PHOTO FINISH yet <1.0), results at frame 2708. Only the PCFSoftShadowMap warning. Flash look, 2P keys panel, `feel` shake not checked.
**Next** (1) Close gap below 1 s (cap leader speed near x 55, or stronger band). (2) Photo-finish popup/side replay look. (3) 2P keys panel Q W E R / U I O P, `feel` shake.
**Open** Wrong-winner bug not reproducible with `state:{auto:true}`; might need a path with a restart mid-race.
