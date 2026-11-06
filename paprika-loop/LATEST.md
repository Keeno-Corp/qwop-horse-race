The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 30

**Judge 30.** I opened the page, ran a Q, P, W, O pulse (20 frames each, then 200 idle) with a `look`, and ran `perf` with `costs`. There were no console errors. I did not play the plant replay, the finish replay, 2-player mode or the head-on cut this session. The sepia finish replay is taken from Iteration 30's report, not from my own look.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `GO!`, `div#keys` (Q FL, W FR, O BL, P BR) and `div#tips` show. The pulse run kept all four horses in `state:"run"`. I did not play on to a finish or to `results` this session.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 8.** The `legs` strings differ per horse ("1001", "1111", "0110", "0000"), and the horses run in a pack with dust. I saw no face-plant this session, so this rests on Judge 29's `down` states.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo-finish): 7.** Iteration 30 reported the finish replay as working. It runs on its own after the plant replay, with the sprocket frame, "PHOTO FINISH" title and "HOLD ALL TICKETS". I did not see it myself. The builder then softened the grain in `broadcast.js` without re-running `look`, so the grain level is unchecked.
4. **Photo finish and tangled AI collapse within the first minute: 8.** This rests on Judge 29's `tangles:1` and the 0.19 s photo finish. I did not re-measure it.
5. **Results with most face-plants award: 9.** From Judge 29: `div#results` shows the podium and the "DIRT EATER · MOST FACE-PLANTS" badge. I did not reach it this session.
6. **Looks as LOOK.md says: 8.** The `look` shows toon steps with outlines, an orange and yellow palette, warm light, and the CRT pass (`div#crt` over `postpass-quad`). The `hills` backdrop is still a flat green blob at the left (and `look` reports it "Never visible"). The scene has no depth haze.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored, and nothing is fetched at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** `horse0` has blue polka dots, `horse1` a red diamond cloth, `horse3` black and yellow stripes. They have white socks, dark hooves, big eyes, a mane and blinkers. The tool again reports 0 of 3 parts for `horse0`, which is the shader limit.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds and face-plant counts. `div#lower` has the Hank "Hoofbeat" Pruitt line. `LIVE`, the `3:58 PM` clock, `RACE TIME 3.4s`, the progress bar and the Top-Cat Tires billboards are all there.
10. **Camera: 7.** The side-tracking telephoto reads well. I did not see the head-on cut or a replay cam this session.
11. **Controls feel learnable: 6.** My pulses gave YOU `plants:0` throughout and a pitch low of -0.27, so the start-pitch assist helps. But YOU was only at x 1.74 after about 8 s, against the AI at 4.5 to 6.8. A short pulse barely moves the horse. No human finish was seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and `div#keys` show the mode in the HUD. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds: tote, lower-third, CRT, billboards and tag. The depth and `hills` issue remains.

**Faults: 6.**
- `perf` shows 411 draw calls and 158,804 triangles. `merged` is 142 calls, `Mesh` 56, `merged-outline` 45, `mesh-outline` 18 and `tail` 16, and `crowd` is 48k triangles. The 223 ms frame is a software renderer at host load 2.5, so it is not a budget signal.
- `hills` is "Never visible" while in view.
- The grain softening is unchecked, because the builder did not re-run `look`.

**Next:**
1. **Controls feel (asked again).** The start is now stable, but YOU only reached x 1.74 in 8 s on the same pulses. Make a held Q+P then W+O pulse produce real forward speed. For example, add a stride-synced forward impulse for the human horse, or raise leg motor speed so the alternate pulse covers ground. Then check: `interact` with the same pulse steps and `trace` on `horses.2.x`. It should pass x 15 by raceT 7 with `plants:0`.
2. **Draw calls and depth (asked again).** Merge `merged` (142 calls) and `Mesh` (56) by material across horses, instance `tail` (16) and `mesh-outline` (18), and cut the `crowd` triangles. Then `perf` with `costs` should show under 250 calls. Also fix `hills`. Move it so it reads as a distant hill with atmospheric haze (a lighter, bluer fog colour at distance) rather than a flat green blob. `look` at the opening frame with `sample` on the blob should show it paler than the foreground.
3. **Verify the finish replay and its softened grain.** `interact` with `until:{replay:{kind:"finish"}}`, then `look` with `sample` on a corner pixel (the sepia read, R>G>B) and a `zoom` on the "PHOTO FINISH" frame. The grain should be visible but under the ~37/255 noise `look` flagged last time. Then play 2-player once (key 2, then Q W E R and U I O P) and confirm the head-on cut with a `look` on the camera.

SCORE: 7.6

## Iteration 31
**Did**
- No code change. Re-ran Judge 30's item 1 (controls feel) with the same pulse pattern: Q+P 20 frames, W+O 20 frames, twice, then 200 idle frames.
**Saw**
- YOU (`horses.2`) reached x 8.53 at raceT 4.85 (peak 9.07), `plants:0` for all 567 frames, pitch low -0.53 and then -0.22. The AI were at x 11.2 to 11.9 at the same time, so YOU is about 3 m behind the pack. The earlier x 1.74 reading is not reproduced.
- Not run this session: `look`, `perf`, the finish replay and 2-player.
**Next**
- Judge 30 items 2 and 3 are still open. Item 2 is draw calls (`merged` 142, `Mesh` 56, `mesh-outline` 18, `tail` 16) and the `hills` haze. Item 3 is a `look` check of the softened sepia grain on the finish replay, then 2-player and the head-on cut.
- I would check the sprint to x 15 by raceT 7 in a longer pulse run.
**Open**
- Draw-call reduction not started. The softened grain is unchecked. Controls feel looks acceptable but was only checked with this one pulse pattern.
