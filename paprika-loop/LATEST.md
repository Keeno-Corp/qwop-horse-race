The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 67
**Did**
- `game.js` race camera: position y `2.6` -> `2.0 + (dist-14.5)*0.1`, look target y `1.35` -> `2.7` (tilts the view up so the stand roof and the "GRAND STAND" sign come into frame).
**Saw**
- `look` at raceT 2.4 s: the "GRAND STAND" sign and roof slab now show in the upper half; horses still full-size and centred; no console errors. `crowd`, `hills` (0.13%), `posts`, `merged` still listed as never visible/too small; ground still flat yellow-olive with big shadow polygons. Not run: `perf`, replay sheet, finish run.
**Next**
- Make `crowd` visible under the stand roof (move it or its z toward the camera, or raise the stand front); give `hills` a real treeline in the top third; grass-to-dirt ground gradient and smaller shadow polygons.
- Pace: a clean run is ~14 s; add fatigue/torque loss so it takes 25–40 s. Sepia photo-finish replay and head-on cut `look` sheet; `merged` z-fight.
**Open**
- The render-target-left-bound warning looks like a tool artefact: `broadcast.js` ends with `setRenderTarget(null)`. Camera tilt not checked in the head-on or results cams or with the horses far ahead.

### Judge 67

**Judge 67: scores**

1. **Plays as DESIGN.md says: 6.5.** Digit1 gives the countdown and then "GO!". The `keys` panel and the "ALTERNATE LEGS: Q+P THEN W+O" tip show. The solo no-input race ended in `results` at raceT 26.85 s. I only held legs for the first 18 frames, so no human finish is proven. YOU got "DNF · 54 M SHORT" at x 4.24. YOU's `legs` stayed "0110".
2. **Rapier ragdolls, face-plant and auto-right: 8.** Hoof Hearted logged `plants` 5 and ended at `pitch` -1.74 with `legs` "1111", 1.5 m short of the line. Sir Trips-a-Lot got up again with `plants` 1 and finished. The motor-driven legs read in the pictures.
3. **Replay and photo-finish look: 6.5.** The results card says "PHOTO FINISH · 0.13s". I did not see the sepia replay, grain, scratches or "PHOTO FINISH" frame. This is the fifth session without it.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.5.** Sir Trips-a-Lot finished at 22.33 s and Dusty Rhodes at 22.46 s. `tangles` was 1 and Hoof Hearted collapsed (5 plants, DNF), all within 27 s.
5. **Results with most face-plants award: 9.** The card shows a "DIRT EATER · MOST FACE-PLANTS" badge on Hoof Hearted (5 face-plants), a "SMOOTH OPERATOR" badge, a podium and "PRESS R".
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, warm light and CRT/VHS pass hold. The camera tilt brings the stand roof into view, but the "GRAND STAND" sign is hidden behind the `top-r` HUD. The ground is still flat yellow-olive with large diagonal shadow polygons. `hills` is 0.13% (a 1 px strip) and `crowd` is "behind the camera". The picture is a fence, a plank roof and empty field.
7. **`__game` convention, static, no network: 9.** `__game` returns its keys. Assets are 0.32 MB with vendored fonts, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** The red diamonds, green stripes, blue polka dots and orange "4" cloth read. The big eyes, bristly mane, bridle and blinkers read. The hooves and socks are still small.
9. **Broadcast overlay: 9.** The `tote` has silks, face-plant counts and live odds. The LIVE bug, the clock (3:58 PM to 4:01 PM), race time, progress bar and `lower` commentator (Hank "Hoofbeat" Pruitt, then Walt Dunmore) all show. `look` reports 0 overlaps.
10. **Camera: 6.5.** The side-tracking telephoto works and is now tilted up. I did not see the head-on cut or the replay cams. The sky is still empty.
11. **Learnable controls: 6.** No human finish has been proven in 12 sessions. At the start YOU stands low and then slowly rises.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the "2 = TWO PLAYERS" tips bar show it. I did not play it.
13. **Style judged as hard as gameplay: 7.** The HUD, results card and horses carry the 70s feel. The empty background still weakens it.

**Faults: 6.5.** There were no console errors. `perf` read 117 ms a frame (265 draw calls, 126k triangles) on SwiftShader, which is not a signal. `look` still reports the last frame drawn only into a render target, and that warning has now appeared in several sessions. `lake`, `posts`, `crowd`, `merged` and `basic-merged` are never visible. The `merged` z-fight is unfixed.

**Next:**
1. **Make the world behind the horses read (asked again).**
   - Put `crowd` under the stand roof and in front of the `grandstand` body, inside the camera's tilted view.
   - Move the "GRAND STAND" sign clear of the `top-r` HUD.
   - Add a `hills` treeline in the top third and give the ground a grass-to-dirt gradient with smaller shadow polygons.
   - Done when `look` lists `crowd` and `grandstand` under On screen, and `sample` at [300, 40] and [900, 600] gives clearly different colours.
2. **Prove a human finish (asked again, twelve sessions).**
   - Add a stand-up assist for the first second and lower the leg torque or add damping.
   - Done when `interact` alternates Q+P and W+O at 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.
3. **Show the sepia photo-finish replay and the head-on cut (asked again).**
   - Run `look` with a `sheet` at about 1 s and 4 s after the finish of a no-input race, so the replay and the head-on cut appear as separate shots. Check the tilted camera in both.
   - Move the final `setRenderTarget(null)` so the last draw reaches the screen. Hide or offset `merged` to end the z-fight.
   - Done when the sheet shows sepia, grain, scratches and a "PHOTO FINISH" frame, and `look` no longer reports the render-target warning.

SCORE: 7.5
