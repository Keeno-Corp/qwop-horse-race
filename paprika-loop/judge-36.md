**Judge 36.** I opened the page, ran a no-input solo race through the finish with three `look`s, and ran `perf` with `costs`. There were no console errors. I did not reach the finish replay, the results screen, 2-player mode or the head-on cut. Those scores rest on earlier judges.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The countdown 4.6 → 0 leads into `phase:"race"` at frame 277. `div#keys`, `div#tips` and the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons show, and `div#off2` ("◀ YOU 57 m") tracks the player. I did not press any keys.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** Sir Trips-a-Lot reached `plants:5` with `pitch:2.39` (face-first) and was back to `state:"run"` and finished at 26.37 s. The lower-third said "EATS DIRT! FACE-FIRST INTO THE TRACK!".
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo finish): 6.** After the finish (Hoof Hearted 21.82 s, Dusty Rhodes 22.01 s) I looked at 24 s and 27 s, and `phase` stayed `"finishing"` with no replay. I did not see the sepia, grain or "PHOTO FINISH" frame, so I can't confirm any of it. It has been asked for in Judges 30, 32, 33 and 35.
4. **Photo finish and tangled AI collapse within the first minute: 8.** At 20 s the AI horses Hoof Hearted and Dusty Rhodes were level at x 53.18 and 53.17, with `tangles:1` and Sir Trips-a-Lot on `plants:4`. The finish was 0.19 s apart.
5. **Results with most face-plants award: 7.** I did not reach it. The score rests on earlier judges, and the YOU horse never moved in this no-input run.
6. **Looks as LOOK.md says: 8.** The `look` shows toon steps with thick outlines, an orange and yellow palette, warm light, and the CRT pass (`div#crt` over `postpass-quad`). The grandstand, `crowd`, billboards, rail and finish post read as 1970s TV. The Depth line still reports no fog on the far hills, which sit at top-left as a flat orange and green blob. `hills` is "Never visible" while in view, and `ridge` is behind the camera.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and the fonts are vendored. There is no network use at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** The `look` shows a chunky barrel body, a bristly mane, white socks, dark hooves, big round eyes and blinkers. The saddle-cloth silks are diamonds, stripes, a polka dot and a "U" emblem.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds that moved from 4-1 to 30-1, 1-2 and 1-2, then WIN, and face-plant counts. `div#lower` has two commentators and live lines. The `LIVE` bug, the clock bug, the race-time bug, the progress bar and the title countdown are there.
10. **Camera: 7.** The side-tracking telephoto reads well, with the finish post in the foreground. I did not see the head-on cut or a replay cam.
11. **Controls feel learnable: 7.** Unchanged. No human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and the `div#tips` line show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. The weak point is still depth: far `hills` has no haze visible.

**Faults: 6.**
- `perf` shows 412 draw calls and about 149k triangles. This is unchanged for five sessions, apart from `hills` dropping from 12.5k to 3.1k triangles.
- `merged` is 142 calls, `Mesh` 59, `merged-outline` 45, `mesh-outline` 18 and `tail` 16. `crowd` is 47.9k triangles, and `dust` is 8.4k triangles for one draw call.
- The 190 ms work per frame is a software renderer (SwiftShader) at host load 2.1, so it is not a budget signal.
- `hills` is "Never visible" while in view, and `ridge` is never visible.
- The replay did not start after the finish in my run, so I could not check it.

**Next:**
1. **Verify the finish replay (asked again, sixth time).** Replay never started at 24 s or 27 s, even though two horses finished 0.19 s apart. Check with `observe` after `interact` `{wait:400}` from the finish. `replay` should become non-null and `look` with `sample` on a corner pixel should read sepia (R>G>B), with `zoom` on the "PHOTO FINISH" frame. If `phase` stays `"finishing"` because YOU never finishes, make the replay start once the first horse finishes plus a delay, or end the race when the AI are all done. Then press `Digit2`, play Q W E R and U I O P, and `look` at the head-on cut.
2. **Draw calls (asked again, fifth time).** Merge `merged` (142) and `Mesh` (59) by material across the horses, merge `merged-outline` (45) and `mesh-outline` (18), and instance `tail` (16). Cut `crowd` from 47.9k triangles with an InstancedMesh or fewer figures, and trim `dust` from 8.4k triangles. `perf` with `costs` should show under 250 calls.
3. **Depth (asked again).** Iteration 36 set `Fog(0xb4c6c4,70,330)`, but the Depth line and the picture still show no far haze. Check that the toon and shader materials use `fog:true`, and that the `postpass-quad` doesn't hide it. Delete `ridge`, which is still never visible. In `look`, `sample` the `hills` blob at about (60,230): it should come out paler and bluer than a foreground grass pixel.

SCORE: 7.5
