The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

### Judge 76

I've run the page, the 5.7 s human-input play, `perf` and a mid-race and results sheet. I'm writing the verdict now.

**Judge 76: scores**

1. **Plays as DESIGN.md says: 7.5.** With no input the race ran to results ("Hoof Hearted WINS!", photo finish 0.19 s, `YOU` "DNF · 56 M SHORT"). Alternating Q+P then W+O in 18-frame holds took `YOU` from x 2 to x 10.97 in 1.82 s of race time (about 5 m/s). `pitch` stayed above -0.16 and `plants` stayed 0, while the three AI horses were `state` "down". At that pace 60 m takes about 12 s, well inside the 60 s target. I only played 6 pairs, so `finishT` is still unobserved.
2. **Rapier ragdolls, face-plant, auto-right: 8.** All three AI horses went `down` at about 1.8 s in this run, with thud and gasp sounds. I did not watch the auto-right.
3. **Replay and photo-finish look: 7.** The results card shows "PHOTO FINISH · 0.19S" with a podium and the commentary line "TOO CLOSE TO CALL!". I did not play the sepia 0.25x replay itself.
4. **Photo finish and AI collapse with no input: 8.5.** The no-input race gave a 0.19 s photo finish and a collapse, as it did last session.
5. **Results with most face-plants award: 8.** The results table has a red "DIRT EATER · MOST FACE-PLANTS" tag on the `Sir Trips-a-Lot` row. It is still a tag, not a separate award line.
6. **Looks as LOOK.md says: 8.** Toon shading with outlines, a warm golden grade, the CRT pass, and the "GRAND STAND", "ZENITH TV", "GOLDEN HOOF OATS" and "TOP-CAT TIRES" boards all show. The green slope behind the stand reads. The `track` is still a flat orange. The `trees` from iteration 76 do not show anywhere, including the end shot.
7. **`__game` convention, static, no network: 9.** Assets total 0.32 MB and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-polka-dot horse and the orange horse with the numbered "4" cloth show socks, dark hooves, big eyes, blinkers and a bristly mane. The legs are still short next to `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The tote has silks and live-moving odds (the YOU odds went 3-1, then 30-1). The LIVE bug, "3:58 PM" clock, progress bar, race title card and the Hank "Hoofbeat" Pruitt lower-third all show.
10. **Camera: 8.** The side-tracking telephoto is good. The end picture shows a replay or head-on cut, but I did not inspect it.
11. **Learnable controls: 7.** The alternating-pair rhythm moves `YOU` fast with no face-plants. The finish is still not observed.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture reads as a 70s broadcast. The flat ground and the missing treeline are the weak spots.

**Faults: 7.**
- `look` still lists `hills` as "Never visible (in view)". This was flagged last session and the cause is still unexplained.
- `perf` read 99.9 ms on SwiftShader (265 draw calls, 126k triangles, host load 2.2). That is a software renderer, so it is not a budget signal.

**Next:**
1. **Prove the finish (asked again).**
   - Play about 25 pairs of Q+P then W+O, 18 frames each (6 pairs already gave x 10.97), then `{"until":{"horses.2.finished":true},"max":3600}`.
   - Done when `horses.2.finishT` is under 60 and the interact reply shows `phase` results.
   - If `YOU` falls, tune the auto-right or the torso pitch.
2. **Make the ground and horizon visible (asked again).**
   - The `track` still reads flat orange, and the `trees` and `hills` don't show.
   - Draw a visible grass band at the far edge of the `track` that stays above the fence line, with a dirt-to-grass gradient.
   - Move the `trees` into the frame behind the grandstand roofline and stop `hills` being flagged.
   - `look` with `sample` at (500, 180) and at (500, 420) should show tree or grass greens and a different dirt colour.
3. **Legs and the award line.**
   - Lengthen the leg segments toward `refs/sheets/horse.png`.
   - Add a separate "MOST FACE-PLANTS: name (n)" line to the results card whenever the max is above 0.
   - Check `look` on the results sheet cell.

SCORE: 8.0
