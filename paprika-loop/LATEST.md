The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 77
**Did**
- game.js `showResults`: added a separate "MOST FACE-PLANTS: name (n)" line under the table whenever the max `plants` is above 0 (red, bold `.hint`).
**Saw**
- Only a syntax check (`node --check game.js`); I did not open the page, so there is no `look` or `perf` reading this session.
**Next**
- Prove a human finish with about 25 Q+P / W+O pairs (asked 19 times), then `until horses.2.finished`.
- Make the grass band and trees visible; lengthen the legs.
**Open**
- Human finish unproven; the `hills` flag and the invisible `trees` are unexplained; the award line is unchecked on screen.

### Judge 77

**Judge 77: scores**

1. **Plays as DESIGN.md says: 7.** The Q+P / W+O alternating rhythm took `YOU` from x 2 to 11.76 in 3.8 s with `plants` 0. Over about 22 pairs, `YOU` fell 4 times and stalled at x 37.1 with `legs` "0000". `phase` reached results and the card showed `YOU` as "DNF · 21 M SHORT". `horses.2.finishT` is still null, so the finish is unproven. The AI took 20.7 s and 20.9 s, so a stalled human is the weakest part of the loop.
2. **Rapier ragdolls, face-plant, auto-right: 8.** The AI went down repeatedly (plants 5, 2, 1), and thud, gasp and boing sounds play. `YOU` got up again after each fall.
3. **Replay and photo-finish look: 7.** The results card shows "PHOTO FINISH · 0.13S". I did not play the sepia replay itself.
4. **Photo finish and tangled AI collapse with no input: 8.** Hoof Hearted and Dusty Rhodes finished 0.13 s apart in my play, and the AI face-plants as they run.
5. **Results with most face-plants award: 9.** The new red line "MOST FACE-PLANTS: SIR TRIPS-A-LOT (5)" sits under the table next to the "DIRT EATER · MOST FACE-PLANTS" row tag. It reads cleanly.
6. **Looks as LOOK.md says: 8.** Toon shading with outlines, a warm golden grade and the CRT overlay all show. The `track` is still flat orange. The green slope at the right edge of the grandstand shot is the only green. `hills` is still listed under "Never visible".
7. **`__game` convention, static, no network: 9.** Assets are 0.32 MB and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The mid-race `YOU` shot shows the cloth with the "4" disc, blinkers, white socks, dark hooves, big eyes and a bristly mane. The legs are still shorter than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The tote has silks and odds that move (30-1, then PHOTO). The LIVE bug, "4:00 PM" clock, progress bar and Walt Dunmore lower-third ("YOU EAT DIRT!") all show. The black rectangle above the lower-third is gone.
10. **Camera: 8.** The side-tracking telephoto reads well. The results background is a close-up of the stand.
11. **Learnable controls: 6.5.** Rhythmic alternation gives fast, clean running at first. Sustained play ended in 4 face-plants and a stall, and `YOU` did not recover under continued input.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture reads as a 70s broadcast. The flat ground is the weak spot.

**Faults: 6.5.**
- `look` flags "crowd" for z-fighting: two faces in one plane at z = -7.41 over 0.23 × 73 units.
- `hills` is still "Never visible (in view)".
- One `look` warned that every render call drew into a render target and none to the screen, so the canvas may have shown an earlier frame. Check that `setRenderTarget(null)` is called after the post pass.
- `perf` read 114.5 ms on SwiftShader (265 draw calls, 126k triangles, host load 2.6). That is a software renderer, so it is not a budget signal.

**Next:**
1. **Fix the human stall (asked again).**
   - After repeated face-plants `YOU` stopped at x 37.16 with `legs` "0000" and `state` "run", and did not move on under further input.
   - Check whether the auto-right leaves the horse stuck, or whether the leg motors cut out after a plant. Re-run about 25 Q+P / W+O pairs, then `{"until":{"horses.2.finished":true},"max":3600}`.
   - Done when `horses.2.finishT` is under 60. A forgiving setting such as a lower torso pitch limit or a stronger auto-right would also help the 60-second target.
2. **Make the ground and horizon visible (asked again).**
   - Add a grass band at the far edge of the `track` with a dirt-to-grass gradient.
   - Move the `trees` inside the frame behind the grandstand roofline and stop `hills` being flagged.
   - `look` with `sample` at (500, 180) and (500, 420) should show greens and a different dirt colour.
3. **Clean the faults and lengthen the legs.**
   - Remove the duplicate `crowd` face in the same plane, or offset it.
   - Fix the render-target warning.
   - Lengthen the leg segments toward `refs/sheets/horse.png`.
   - A `look` should show no `Surfaces:` line and a longer leg silhouette.

SCORE: 7.8
