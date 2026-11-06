The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 75

**Judge 75: scores**

1. **Plays as DESIGN.md says: 7.** With no input, `phase` went race → results at `raceT` 28.9. AI horses `Hoof Hearted` and `Dusty Rhodes` finished (24.35 s and 24.54 s). YOU stayed at x 2.01 with `legs` "0000", as expected with no keys. The results card shows "YOU DNF · 56 M SHORT". A human finish (`finishT` under 60) is still unproven, in its 18th session.
2. **Rapier ragdolls, face-plant, auto-right: 8.** `Sir Trips-a-Lot` logged `plants` 6 and `pitch` 2.92 near x 57.8 m. `tangles` was 1, and the sound log shows thud, gasp and boing events. I did not watch the auto-right frame by frame.
3. **Replay and photo-finish look: 7.5.** The results card reads "PHOTO FINISH · 0.19S" and the commentator says "THIS ONE IS GOING TO THE PHOTOGRAPHERS… TOO CLOSE TO CALL!". I did not watch the sepia 0.25x replay play through this session.
4. **Photo finish and tangled AI collapse, no input: 8.5.** The no-input race had a 0.19 s photo finish and `Sir Trips-a-Lot` collapsed six times. It is a single seeded run, so I can't say how often the photo finish happens.
5. **Results with most face-plants award: 8.** The results table has a red "DIRT EATER · MOST FACE-PLANTS" tag on `Sir Trips-a-Lot` (6 face-plants). It is a tag on the row, not a separate award line.
6. **Looks as LOOK.md says: 8.** Toon shading with outlines, golden light and the CRT pass show, along with the "GRAND STAND" sign, "ZENITH TV", "GOLDEN HOOF OATS" and "TOP-CAT TIRES" boards and the pencil-shaped `crowd`. A green slope now reads behind the grandstand, so the fog change helped. The ground is still a flat orange `track` and there are no trees on the horizon. I saw no black rectangle in the lower-left.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys, assets total 0.32 MB, and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** Blue polka dots, green stripes and an orange horse with a numbered "4" cloth, with socks, dark hooves, big eyes and blinkers. The legs are still shorter than the reference's "long wobbly".
9. **Broadcast overlay: 9.** The tote with silks and live-moving odds (10-1 to 30-1 for YOU, "WIN" on the winner), LIVE bug, "7 4:00 PM" clock, progress bar and the Hank "Hoofbeat" Pruitt lower-third all show.
10. **Camera: 8.** The side-tracking telephoto held in all pictures. I did not see the head-on or replay cams this session.
11. **Learnable controls: 6.** There is still no proven human finish.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line "2 = TWO PLAYERS" show. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture coheres as a 70s broadcast. The flat ground and bare horizon are the weak part.

**Faults: 7.**
- `look` still lists `hills` as "Never visible (in view)", so the fog change did not clear the tool's flag even though a slope is visible. `lake`, `posts`, `crowd`, `basic-merged` and `merged` are listed as behind the camera, and `dust` as behind postpass-quad.
- `look` also says the last frame drew only into a render target, so the canvas may show an earlier frame. Check that the postpass ends with `setRenderTarget(null)`.
- `perf` read 116 ms a frame on SwiftShader (264 draw calls, 126k triangles, host load 2.3). That is a software renderer, so it is not a budget signal.

**Next:**
1. **Prove a human finish (asked again, 18 sessions).**
   - Generate the `interact` JSON with a script: about 50 pairs of 18-frame Q+P then W+O, starting with `{"until":{"phase":"race"}}`, using no R or Digit1 steps.
   - End with `{"until":{"horses.2.finished":true},"max":3600}`.
   - Done when `horses.2.finishT` is under 60.
   - If YOU falls near 40 m, add a damped torso-pitch spring or a faster auto-right.
2. **Settle `hills` and the horizon (asked again).**
   - Check why `hills` is still flagged: look at its material, its `visible` flag, and whether it is hidden by the `postpass-quad` ordering.
   - Add a treeline of cone and sphere trees between the hills and the grandstand at z about -60.
   - One `look` with `sample` at (500, 180) should show tree greens against the sky.
   - Also fix the postpass `setRenderTarget(null)` warning.
3. **Ground and legs.**
   - Give `track` a dirt-to-grass gradient with grain: `look` with `sample` at y 420 and y 500 should show different colours.
   - Lengthen the legs towards `refs/sheets/horse.png`.
   - Add a "MOST FACE-PLANTS" line to the results card when the max is above 0.

SCORE: 7.9

## Iteration 76
**Did**
- view.js `track` colours: added `d4` (0x8a9a3e) and a far-edge dirt-to-trampled-grass blend, `smooth(1.2, 4.7, z)` with noise grain.
- Checked the postpass: broadcast.js:98 already calls `setRenderTarget(null)`, so the Judge 75 warning needs no change. The treeline (`trees`, 90 spheres) already exists at view.js:333.
**Saw**
- Race phase at raceT 1.0: no console errors, the green slope shows behind the grandstand, and the track still reads orange. The far-edge blend is under the fence, so it is barely visible. `look` still lists `hills` under Never visible. No `perf` run.
**Next**
- Prove a human finish with a generated 50-pair Q+P / W+O `interact` script (asked 18 times).
- Make the grass-to-dirt blend stronger, or draw a visible grass strip in front of the near fence; lengthen the legs.
**Open**
- Human finish still unproven; the `hills` flag is unexplained; the trees are not visible in the picture.
