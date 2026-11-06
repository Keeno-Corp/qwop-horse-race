**Judge 78: scores**

1. **Plays as DESIGN.md says: 7.** Rhythmic Q+P / W+O alternation worked well. `YOU` went from x 2 to 25 in about 6.5 s of `raceT` with `plants` 0. The countdown, `tote`, 2-player button and R restart are all there. The finish is still unproven: `horses.2.finishT` stayed null. `YOU` fell at x ≈ 39.4 (`plants` 2, `state` "down", `pitch` -0.8) and was still down when the 84-frame final check ended. The 600-frame `until` run and that check cover at least 1.4 s of `raceT`, so the watchdog (which only covers `run`) did not rescue this fall.
2. **Rapier ragdolls, face-plant, auto-right: 8.** `Sir Trips-a-Lot` and `Hoof Hearted` both went `down` with `pitch` ≈ -1.9. Thud and gasp sounds played, and `Sir Trips-a-Lot` was back in `run` later. A `tangles` count appeared. The auto-right of `YOU` at x 39 is unconfirmed.
3. **Replay and photo-finish look: 7.** The "INSTANT REPLAY · 0.25x" tag, "SPACE to skip" and the 0.25 `rate` all work, and Space skipped it. The sepia photo-finish replay was not reached, because no one finished.
4. **Photo finish and tangled AI collapse with no input: 7.** I played with input, so I could not check this. The AI collapsed (`plants` 3, 2, 1) and `tangles` was 1 by about 14 s.
5. **Results with most face-plants award: 8.** It was not reached this session. Judge 77 saw it ("MOST FACE-PLANTS: SIR TRIPS-A-LOT").
6. **Looks as LOOK.md says: 8.** The toon shading, outlines, warm grade, CRT overlay and hatching all show. The green backdrop is now visible, so the horizon reads better. `track` is still flat orange and `hills` is still "Never visible". Shadows on the dirt are good.
7. **`__game` convention, static, no network: 9.** `observe` works, assets are 0.32 MB and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-polka-dot `YOU` and the chevron/diamond horses show cloth numbers, blinkers, big eyes, white socks, dark hooves and a bristly mane. The legs are still shorter than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The `tote` shows silks and odds that move (5-1 to 30-1, 15-1), plus per-horse "FACE-PLANTS 3 · OUCH". The LIVE bug, the 3:58 → 3:59 PM clock, the progress bar, the Walt Dunmore lower-third and the "FACE-PLANT!" pop are all there. The commentary reads correctly ("SIR TRIPS-A-LOT EATS DIRT!").
10. **Camera: 8.** The side-tracking telephoto is good. The replay camera is close and readable.
11. **Learnable controls: 6.5.** Alternation gives about 4 m/s and an easy start. After about 30 pairs the human fell at x 39 and did not clearly get back up, so a finish under 60 s is still unshown.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture reads as a 70s broadcast. The flat orange ground is the weak spot.

**Faults: 6.5.**
- `hills` is still "Never visible (in view)".
- `look` warned again that every render call drew into a render target and none to the screen (frame 3). Check `setRenderTarget(null)` after the post pass at `broadcast.js:98`.
- `perf` read 117 ms on SwiftShader (266 draw calls, 126k triangles, host load 1.7). This is a software renderer, so it is not a budget signal.

**Next:**
1. **Make the human reach the finish (asked again).**
   - The watchdog in `physStep` only covers `state` "run". `YOU` was stuck in `state` "down" at x 39.4 with `pitch` about -0.8 and `legs` "0110" while keys were held.
   - Check that the auto-right timer for `down` is not reset or blocked by held leg keys, and that it fires about 2 s after the plant.
   - Re-run about 30 alternating pairs and then `{"until":{"horses.2.finished":true},"max":3600}`. Done when `horses.2.finishT` is under 60 and the results card shows.
2. **Fix the render-target warning and make the ground richer (asked again).**
   - Call `renderer.setRenderTarget(null)` after the last post pass, so `look` stops reporting "none to the screen".
   - Give `track` a dirt-to-grass edge and tyre or hoof-print variation. Move `hills` into frame so they leave "Never visible".
   - `look` with `sample` at (500, 420) should show more than one orange, and the look should have no "Never visible: hills" line.
3. **Lengthen the legs and show the photo finish.**
   - Lengthen the leg segments toward `refs/sheets/horse.png`. A `look` should show a longer leg silhouette without breaking the gait.
   - Check the sepia photo-finish replay appears in a no-input solo race, using `interact` `{"until":{"phase":"replay"}}` and a `look` at that point. It should show sepia, grain and the "PHOTO FINISH" frame.

SCORE: 7.7
