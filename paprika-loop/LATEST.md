The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 70
**Did**
- `view.js` `stand()` GRAND STAND `lab`: moved onto the roof front fascia (`x0 + len*0.27`, `roofY - 0.08`, `rz + rd/2 + 0.12`) and canvas `w` 512→1024 (text was cut by the texture, not the HUD).
**Saw**
- `look` at the countdown "2": "GRAND STAND" reads in full, clear of the `top-r` HUD; 0 HUD overlaps; no console errors. Never-visible list unchanged (stale `crowd`, `lake`, `posts`, `merged`).
- `interact` Q+P / W+O alternation at 18 frames a hold from race start: `horses.2.x` 2.09 → 8.06 in 225 frames, pitch low -0.24, state `run`. So YOU does advance (~6 m in ~3.7 s). Not run to the finish (finishT unproven), no `perf`.
**Next**
- Run the alternation `until` `horses.2.finished` to get a real `finishT`; tune if it falls over.
- Ground dirt-to-grass gradient, softer shadow polygons, hills treeline in the top third.
- Head-on cut and results card look; wider photo-finish framing; recompute `crowd`/`merged` bounding spheres.
**Open**
- Human finish not proven end to end. Ground/horizon untouched.

### Judge 70

**Judge 70: scores**

1. **Plays as DESIGN.md says: 7.5.** I held Q+P then W+O at 18 frames a hold, starting at the "go" frame after the Digit1 countdown. `horses.2.x` went 2.08 → 13.74 in 144 frames, with pitch around -0.15, so a human does advance. I then ran a long alternation that reached x=43.6 at raceT 13 s before YOU's second face-plant (`state` "down", `pitch` -0.89). `horses.2.finished` stayed false, so no `finishT` is proven. That is a 15th session with no proven human finish.
2. **Rapier ragdolls, face-plant and auto-right: 8.5.** The `horses` state moves through `run` and `down`. The tote's `plants` counters read 2–3 by 13 s. The replay cell shows a crumpled horse with its legs splayed.
3. **Replay and photo-finish look: 7.5.** The "INSTANT REPLAY · 0.25X" tag, "SPACE to skip" and the `replay` state (`kind` "plant", `rate` 0.25) all work, and Space returned the page to `phase` "race". The plant replay is in colour with a visible CRT fringe. I did not see the sepia photo-finish frame this session.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.** Judge 69 saw PHOTO for horses 1 and 4 at 25.75 s. This session I only ran with input, so I did not re-check it.
5. **Results with most face-plants award: 7.** The tote's "FACE-PLANTS n" counters and a "FACE-PLANT! YOU lost control of that face" pop are live. I did not reach the results card.
6. **Looks as LOOK.md says: 8.** The toon shading, outlines, golden light and CRT pass hold. The "GRAND STAND" sign now reads in full, and the benches of crowd, the ad boards and the "10" and "20" boards read as a 70s broadcast. The `look` sample at (300, 560), (900, 600) and (600, 120) gave three different colours (#f99b31, #ab6d25, #d2432a). In the head-on picture the ground is still a flat orange slab with polygon shadows, and the `hills` treeline is "Never visible".
7. **`__game` convention, static, no network: 9.** `__game` returns its keys and assets total 0.32 MB with vendored fonts. I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The red diamonds, blue polka dots, orange "4" cloth with stripes, white socks, dark hooves, an eye and blinkers read. The hooves are still small.
9. **Broadcast overlay: 9.** The `tote` shows silks and live odds (YOU went 1-2 → 10-1). The LIVE bug, the 3:58 and 3:59 PM channel-7 clock, the race-time readout, the progress bar and the Hank "Hoofbeat" Pruitt lower-third all show.
10. **Camera: 8.5.** The side-tracking telephoto, the replay cam and the head-on cut (the race at 13 s, the horse in the lane with the tower at right) all showed.
11. **Learnable controls: 6.5.** Alternating pairs moves YOU about 5 m/s, so a 60 m finish in under 60 s looks reachable. The long alternation still ended in a face-plant at x=43.6, which is what mistimed keys are meant to do. A clean finish is not shown.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the Q W E R | U I O P key panel show. I did not play it.
13. **Style judged as hard as gameplay: 8.** The HUD, set and horses cohere as a 70s broadcast. The flat ground and bare horizon in the head-on cut are the weak part.

**Faults: 6.5.**
- `look` flags `crowd` with two faces in one plane (z = -7.41 and -7.48), which flicker. Judge 69's `crowd` entry had no such line.
- `look-3` reports that the last frame drew only into a render target, so the canvas may be showing an earlier frame (a missing `setRenderTarget(null)` after a pass).
- `hills`, `lake`, `posts`, `crowd`, `merged` and `basic-merged` are still "Never visible".
- `perf` read 129 ms a frame on SwiftShader (266 draw calls, 126k triangles). The host load was 2.2 on 8 cores, so this is not a signal.
- I saw no console errors.

**Next:**
1. **Prove a human finish (asked again, 15 sessions).**
   - Run the 18-frame Q+P / W+O alternation in one `interact` with `until` `{"horses.2.finished": true}` and `max` 3600, including a Space step to skip any replay.
   - Done when `horses.2.finishT` is under 60.
   - If YOU falls over at about 40 m, add a damped torso-pitch spring or a faster auto-right in `state` "down", so a steady alternation survives.
2. **Fix the ground and horizon.**
   - Give the `track` a dirt-to-grass gradient and grain, and soften the shadow polygons.
   - Raise or recompute `hills` and add a treeline so it enters the frustum (compute `boundingSphere` or set `frustumCulled = false`). The same fix applies to `crowd`, `merged` and `lake`.
   - Done when `look` at the head-on cut shows hills and trees in the top third, and `hills` leaves the "Never visible" list.
3. **Fix the `crowd` z-fighting and the render-target line.**
   - Move one of the two coplanar `crowd` faces about 0.01 away at z ≈ -7.41 and -7.48, or delete the hidden one.
   - Make the last pass call `setRenderTarget(null)` and draw to the screen.
   - Done when `look` shows neither the `Surfaces:` line nor the "Last frame" line.
   - After that, `look` the sepia photo-finish frame and the results card with the most-face-plants award.

SCORE: 7.8
