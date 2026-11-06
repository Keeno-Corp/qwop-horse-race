The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 73
**Did**
- view.js: `hills.frustumCulled = false` and `lake.frustumCulled = false` (Judge 71 item 2, first half). Nothing else.
**Saw**
- No `open`/`look`/`perf` this session, so the fix is unchecked: `hills` and `lake` may still be "Never visible" in `look`.
**Next**
- `look` to confirm `hills` is listed on screen; then ground gradient and the treeline; then the 50-pair `interact` finish proof (generate the JSON with a script); then sepia photo finish and results card, longer legs.
**Open**
- Human finish still unproven. Ground gradient not started.

### Judge 73

**Judge 73: scores**

1. **Plays as DESIGN.md says: 7.** `phase` reached "race", the countdown ran, and AI `horses` ran at x≈5–8 m by `raceT` 3.65. YOU sat at x 2.06 with `legs` "0000" because I sent no keys. The results card shows "YOU … DNF · 8 M SHORT". The finish proof for `horses.2.finishT` is still missing, in its 17th session.
2. **Rapier ragdolls, face-plant, auto-right: 8.** Four horses ran with `state` "run" and `plants` 0. A toppled horse shows in the results backdrop. I did not watch a collapse or the auto-right.
3. **Replay and photo-finish look: 7.5.** The "later" moment is sepia with grain and a "PHOTO FINISH · 0.19S" header. I did not see the 0.25x replay play through this session.
4. **Photo finish and tangled AI collapse, no input: 8.** With the horses placed near the line, the "nearfinish" moment shows a "1" countdown card and a three-way bunch. The results card reads "PHOTO FINISH - 0.19S", and the commentator says "THIS ONE IS GOING TO THE PHOTOGRAPHERS… TOO CLOSE TO CALL!". I did not run the full no-input race.
5. **Results with most face-plants award: 6.5.** The results card has a podium and a table with a face-plants column. I saw no "most face-plants" award line, though all counts were 0 so it may not show.
6. **Looks as LOOK.md says: 8.** The toon shading with outlines, golden light, CRT pass, "GRAND STAND" sign, `crowd`, "ZENITH TV", "TOP-CAT TIRES" and "GOLDEN HOOF OATS" boards read as a 70s broadcast. The ground is still a flat orange slab with no gradient. `hills` is still "Never visible" although it is "in view", so the `frustumCulled = false` fix did not work. The horizon is a flat green-grey band.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets total 0.32 MB, and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** Blue polka dots, green stripes, an orange horse with a numbered "4" cloth, white socks, dark hooves, big eyes and blinkers all show. The legs are still stubby against "long wobbly".
9. **Broadcast overlay: 9.** The tote with silks and odds (YOU 8-1, then 20-1), the LIVE bug, the "7 3:58 PM" bug, the progress bar and the lower-third with Hank "Hoofbeat" Pruitt and Walt Dunmore all show. The title card also shows.
10. **Camera: 8.** The side-tracking telephoto held in all three pictures. I did not see the head-on or replay cams this session.
11. **Learnable controls: 6.** There is no proven human finish. The earlier pace was about 1.4 m/s.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line "2 = TWO PLAYERS" show. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture coheres. The flat ground and bare horizon are the weak part.

**Faults: 7.**
- `hills` is "Never visible" although it is in view. `lake`, `posts`, `crowd`, `merged`, `basic-merged` and `dust` are also never visible.
- `perf` read 118.9 ms a frame on SwiftShader (265 draw calls, 126k triangles, host load 1.5). That is a software renderer, so it is not a signal.
- The `div#crt` overlay covers 100% of the canvas, which is intended. I saw no console errors.

**Next:**
1. **Fix `hills` (asked again).**
   - `frustumCulled = false` on `hills` was not enough. Check whether `hills` has `visible` false or sits behind the grandstand, the backdrop or `track`. Check its position against the camera's far plane and the fog.
   - Put a treeline and hills behind the grandstand roof line at x/z where the side camera sees them.
   - One `look` should list `hills` on screen, with trees visible over the horizon.
2. **Prove a human finish (asked again, 17 sessions).**
   - Generate the `interact` JSON with a script: about 50 pairs of 18-frame Q+P then W+O, using `down: true` for the held keys.
   - Start with `{"until": {"phase": "race"}}` and use no R or Digit1 steps.
   - Finish with `{"until": {"horses.2.finished": true}, "max": 3600}`.
   - Done when `horses.2.finishT` is under 60.
   - If YOU falls near 40 m, add a damped torso-pitch spring or a faster auto-right.
3. **Ground, legs, award.**
   - Give `track` a dirt-to-grass gradient with grain.
   - Lengthen the legs towards `refs/sheets/horse.png`.
   - Add an award line "MOST FACE-PLANTS: name (n)" to the results card, shown whenever the max is above 0.
   - A `look` `sheet` set to a face-plant state should show the line.

SCORE: 7.7
