The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 71

**Judge 71: scores**

1. **Plays as DESIGN.md says: 7.** In the first run I started a fresh race with the 18-frame Q+P / W+O alternation after `phase` "race". `horses.2.x` went 2.0 → 11.71 in 428 frames, with `pitch` between -0.19 and +0.03 and `plants` at 0, so the controls work. My second `interact` call, a long alternation meant to reach `finished`, did not run in that race. It opened on `countdown` 0.93 and `horses.2.x` 2.1, with "GRAND STAND" and Walt Dunmore's opening line showing. Something restarted the race between the two calls, or the first call's R and Digit1 steps did. I could not tell which, and it cost the finish proof. `horses.2.finishT` has still never been seen, in the 16th session with no proven human finish.
2. **Rapier ragdolls, face-plant and auto-right: 8.** `horses` states and the tote's "FACE-PLANTS n" counters work. The horses show a visible lean (`pitch` -0.19). I saw no face-plant this session.
3. **Replay and photo-finish look: 7.** The 0.25x replay and Space skip were confirmed in session 70. I have not looked at the sepia photo-finish frame, and this session did not either.
4. **Photo finish and tangled AI collapse, no input: 7.5.** Session 69 saw PHOTO at 25.75 s. I did not re-run it.
5. **Results with most face-plants award: 6.5.** Nobody has looked at the results card in several sessions.
6. **Looks as LOOK.md says: 8.** The toon shading with outlines, golden light, CRT pass, "GRAND STAND" sign, `crowd` benches, "10" board and "GOLDEN HOOF OATS" ad boards read as a 70s broadcast. The `crowd` z-fighting `Surfaces:` line is gone from `look`. The ground is still a flat orange slab, and `hills` is "Never visible" although it is listed "in view". The horizon is a flat green band.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys. Assets total 0.32 MB. I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** Diamonds, blue polka dots, a stripes cloth and a numbered "4" cloth read. The white socks, dark hooves, eye and blinkers show. The legs are still stubby against the "long wobbly" brief.
9. **Broadcast overlay: 9.** The tote with silks and live odds (YOU went 2-1 → 5-2), the LIVE bug, the 3:58 PM channel "7" clock, the progress bar and the lower-third with two commentators (Hank "Hoofbeat" Pruitt, Walt Dunmore) all show. The "GO!" and "1" countdown cards are big and fit the style.
10. **Camera: 8.5.** The side-tracking telephoto held in both pictures. I did not cut to the head-on or replay cams this session.
11. **Learnable controls: 6.5.** The first 7 s alternation moved YOU 9.7 m, about 1.4 m/s, with legs `"0000"` at the end of the run. That pace would give a 60 m finish in about 43 s only if the horse never falls, and nothing has shown that yet.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the key panel show. I did not play it.
13. **Style judged as hard as gameplay: 8.** The picture coheres. The flat ground and bare horizon are the weak part.

**Faults: 7.**
- `look` has no `Surfaces:` fault line for `crowd` any more, so the z-fight fix worked.
- `hills`, `lake`, `posts`, `crowd`, `merged` and `basic-merged` are still "Never visible".
- `perf` read 90.9 ms a frame on SwiftShader (265 draw calls, 126k triangles, host load 2.5), so it is not a signal.
- The `div#crt` overlay covers 100% of the canvas. That is intended.
- I saw no console errors.

**Next:**
1. **Prove a human finish (asked again, 16 sessions).**
   - Open a fresh page. Do not press R or Digit1 inside the steps, because the race restarted under my second `interact` call.
   - Run one `interact` with `until` `{"phase": "race"}` first. Then run the alternation as repeated 18-frame Q+P / W+O pairs and `until` `{"horses.2.finished": true}` with `max` 3600, with a Space step to skip any replay.
   - Done when `horses.2.finishT` is under 60.
   - If YOU falls near 40 m, add a damped torso-pitch spring or a faster auto-right in `state` "down".
   - Find out what restarts the race between two `interact` calls, if anything does. A race that resets on its own would explain several sessions without a finish.
2. **Fix the ground and horizon.**
   - Give `track` a dirt-to-grass gradient with grain, and soften the shadow polygons.
   - Set `frustumCulled = false` on `hills` and add a treeline, with the same change for `crowd`, `merged`, `lake` and `posts`.
   - Done when `look` lists `hills` among the objects on screen and the horizon shows hills and trees.
3. **Look at the untouched Must-haves: the sepia photo-finish frame and the results card.**
   - With a `look` `sheet` of two moments, one with `state` set near the finish line for the photo-finish replay and one at the results.
   - Done when the sheet shows the sepia grain and the "PHOTO FINISH" frame, and a "most face-plants" award line on the results card.
   - Then lengthen the legs of the horses (long, wobbly legs) so they match `refs/sheets/horse.png`.

SCORE: 7.7

## Iteration 73
**Did**
- view.js: `hills.frustumCulled = false` and `lake.frustumCulled = false` (Judge 71 item 2, first half). Nothing else.
**Saw**
- No `open`/`look`/`perf` this session, so the fix is unchecked: `hills` and `lake` may still be "Never visible" in `look`.
**Next**
- `look` to confirm `hills` is listed on screen; then ground gradient and the treeline; then the 50-pair `interact` finish proof (generate the JSON with a script); then sepia photo finish and results card, longer legs.
**Open**
- Human finish still unproven. Ground gradient not started.
