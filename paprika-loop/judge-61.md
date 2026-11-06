I've finished checking session 61 and am writing the verdict now. I played the start, ran no input to the first face-plant replay, and ran `perf` once.

**Judge 61: scores**

1. **Plays as DESIGN.md says: 7.5.** Digit1 starts the race, `div#keys` shows Q FL, W FR, O BL and P BR, and the countdown ends in "GO!". With no input, YOU stood at x 1.99 with `legs` "0000" while the AI ran. I did not play a human finish, now six sessions running.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** At 9.9 s Hoof Hearted was `state` "down" with `pitch` 0.24, and Sir Trips-a-Lot had `plants` 1. `tangles` read 1 and the thud and gasp sounds fired. I did not see the auto-right.
3. **Replay and photo-finish look: 6.5.** The replay started on its own (`replay.kind` "plant", `rate` 0.25), and "INSTANT REPLAY · 0.25x" and "SPACE to skip" show. `look` flagged that every render call drew into a render target and none to the screen, so the picture was a stale start-of-race frame. If real, the replay shows the wrong image. I did not see the sepia photo finish.
4. **Photo finish and tangled AI collapse within a minute, no input: 7.5.** One AI horse went down and `tangles` was 1 by 9.9 s. I did not see a finish or a photo finish.
5. **Results with most face-plants award: 8, carried over, not viewed.** `div#tote` shows live face-plant counts.
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, CRT scanlines and warm light hold. The frame is still mostly flat yellow-olive ground and a haze-green wall. The mowing stripes are barely visible. The `grandstand` slab floats as a tan beam with a cut-off "GRAND STA" sign. The `look` ID list still reports `hills` at 0.13%.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys, assets are 0.32 MB, the fonts are vendored and I saw no console errors.
8. **Horses match CHARACTERS.md: 7.** The silks (diamonds, stripes, dots), numbered saddle cloth, big eyes, bristly mane and bridle show. At this camera pitch the legs and hooves are mostly hidden, so the horses read short and stocky, not long and wobbly.
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds and face-plant counts. The LIVE bug, the 3:58 PM clock, RACE TIME, the `div#lower` caption from Hank "Hoofbeat" Pruitt, `div#keys` and the progress bar are all there with 0 overlaps.
10. **Camera: 6.5.** The side-tracking shot is high, with the horizon near the top. Horses are stacked and overlap each other in the frame. I did not see the head-on cut or the replay cams.
11. **Learnable controls: 7.** The key caps and the tip line teach the pattern. A finish under 60 s is still unproven.
12. **Local 2-player, discoverable: 8.** "2 PLAYERS (2)" sits in `div#top-r` and the tip line mentions it.
13. **Style judged as hard as gameplay: 7.** The tote, hoardings and CRT pass read as 70s TV. The empty flat ground and the floating stand weaken the broadcast frame.

**Faults: 6.5.** I saw no console errors. `look` reported the render-target-left-bound line during the replay. `perf` read 87 ms a frame on SwiftShader, with 266 draw calls and 126k triangles. Host load was 2.1 on 8 cores, so that is no signal. `hills` is still listed at 0.13% (a measurement quirk), and `track` is only a 4 px strip.

**Next:**
1. **Replay render-target fault.** In the replay and photo-finish pass in `view.js`, call `renderer.setRenderTarget(null)` before the final post-pass draw. Then check with one `interact` using `until` `{"phase":"replay"}` and `look: true`. Done when the picture shows the replay moment, not the start grid, and the "Last frame" fault line is gone.
2. **Camera, ground and grandstand (asked again).** Lower the pitch so the horizon sits at about 40% of the frame height, and show the legs and hooves. Ground the `grandstand` with a base and crowd tier. Replace the flat ground with a grass-to-dirt gradient and stronger stripes. Done when `look` with `sample` at [300, 600] and [900, 300] gives clearly different colours (dirt, grass) and the stand's feet touch the ground.
3. **Playable human finish (asked again).** Soften the leg motor torque or add damping in `physics.js`. Then lengthen `DIM.upper` and `DIM.lower` by about 15%. Done when `interact` alternating Q+P and W+O at about 18 frames a hold, with `until` `{"horses.2.finished": true}` and `max` 3600, gives `finishT` under 60.

SCORE: 7.5
