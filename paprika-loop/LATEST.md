The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 9
**Did** game.js: `AI.update` band gain 0.3 / floor 0.22 past x 38; `updateRace` closing sprint (best AI chaser within 14 m of `AI.leadX` gets vx*1.012 per frame, cap 9 m/s) for a photo finish; finishing wait now ends at 6.5 s since first finisher (or all finished, or non-runners after 3.5 s) instead of when the 2nd horse crosses; MOST FACE-PLANTS badge goes to one horse (`worst`).
**Saw** Auto race: results at frame 2756, `Dusty Rhodes` finishT 21.67 beats `YOU` 21.75 (gap 0.08 s, so the PHOTO FINISH popup/label fires). Sir Trips-a-Lot and Hoof Hearted still "DNF · ~25 m short" while running (tangled earlier). One run before the sprint gave a 5.77 s gap, so the sprint is what makes it. Photo finish popup, 2P keys panel, shake, finish pose and results backdrop not looked at.
**Next** (1) Look at the photo-finish popup/replay picture. (2) Label running horses "still racing" and keep them off the podium. (3) 2P `div#keys`, `feel` shake, release YOU's legs/level pitch after the line, dim results box.
**Open** Auto bot loses to Dusty by 0.08 s; fine as a photo finish but check the human can still win. Sprint is a speed nudge, not rhythm-based.

### Judge 9

**Judge 9 verdict (amended with the `track` note)**

The scores below are unchanged. The `track` repeat note is a small Looks and Faults item that I add to Next item 3.

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The auto race runs from countdown to results.
   - The 2P switch works: `mode` 2, horses `P1` and `P2`, and `div#keys` shows both players' keys.
   - This run had no photo finish. `Dusty Rhodes` finished alone at `finishT` 24.45.
   - `YOU` sat at x 2.4 with `legs` "0000" and is labelled "DNF · 56 m short".
   - `Hoof Hearted` holds 3rd on the podium without finishing.
   - Results appear while `Sir Trips-a-Lot` is still `state:"run"` at x 47.6.

2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - `plants` count up (Sir Trips-a-Lot reaches 3).
   - `Dusty Rhodes` crosses the line with `pitch` -0.89 and `legs` "0000".
   - Auto-right timing is unmeasured.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - The `kind:"plant"` replay shows the REPLAY banner and "SPACE to skip".
   - Space skips to results.
   - No finish replay was seen.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - The tangle works (`tangles` 1 by 7.9 s).
   - There is no photo finish and no PHOTO FINISH popup in this run.

5. **Results with most face-plants award: 6.**
   - `Sir Trips-a-Lot` carries a single "MOST FACE-PLANTS" badge.
   - Non-finishers are ranked on the podium and labelled DNF while still running.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand`, rail fence, `finish-line`, `hills`, `clouds` and dirt `track` match refs/01.jpg.
   - The `track` texture repeats every 60 px and the pattern shows.
   - The results `div.box` (alpha 0.92) covers 25% of the canvas and hides the winner.

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 6.**
   - The tangle is funny, but there is no photo finish and no slow-motion side replay at the line.

9. **Controls feel learnable: 5.**
   - No human rhythm was tested, and the idle `YOU` was 56 m short.

10. **Horses read as horses, match refs/01.jpg: 8.**

11. **Juice: 7.**
    - 27 sounds fired.
    - The shake is unmeasured.

12. **Local 2-player discoverable from the HUD: 8.**
    - `2 PLAYERS (2)` works and `div#keys` swaps to "PLAYER 1 Q W E R / PLAYER 2 U I O P".

13. **Static page, vendored lib, no network: 9.**
    - 383 draw calls and 0 MB of assets.
    - The frame time is SwiftShader noise.

**Faults: 5.**
- No reliable photo finish after six sessions.
- Running horses are labelled DNF and ranked on the podium.
- The finish pose has `pitch` -0.89.
- `dust` is "Never visible".
- The `track` texture shows a visible 60 px repeat.

**Next:**
1. **Make the photo finish deterministic, with a banner and a finish replay (asked again, a sixth time).**
   - In `updateRace`, clamp the chaser's `vx` so the top two reach x 60 within 0.3 s whenever both are running at x 50.
   - On the second crossing, show a PHOTO FINISH! popup and play a `kind:"finish"` replay, side-on, holding on the `finish-line`.
   - One call shows it done: `interact` with `until:{phase:"replay"}` and `look:true`. The top two `finishT` values should be within 0.3 s, and the picture should show the banner, the `finish-line` and both horses.
2. **Fix the results (asked again).**
   - Rank only finishers on the podium. Label running horses "still racing, X m short".
   - Give the auto bot a Q+P / W+O rhythm so `YOU` reaches x 50 or more.
   - Level the post-line pose to a `pitch` of about -0.1 with the legs released.
   - Lighten the `div.box` backdrop below 0.92.
   - One call shows it done: `interact` with `until:{phase:"results"}`. The podium should contain only finishers, and `YOU` should be at x 50 or more.
3. **Prove the human can finish, and tidy the surfaces.**
   - Run `interact` alternating Q+P and W+O every ~10 frames and check it reaches x 60 in under 60 s.
   - Run `feel` on a forced face-plant to measure the shake.
   - Blend a second, larger-scale dirt texture into `track`, or vary the repeat with distance, so the 60 px repeat no longer shows. Check it with a `look` at the same camera.
   - Move `dust` in front of `track` so it is no longer "Never visible".

SCORE: 6.7
