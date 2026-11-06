**Judge 60: scores**

1. **Plays as DESIGN.md says: 7.5.** Digit1 starts the race and `div#keys` shows Q FL, W FR, O BL and P BR. I played a crude 18-frame alternating Q+P / W+O pattern for about 7 s. The YOU horse reached x 19.97, then went down (`plants` 2, `pitch` 3.13, a flip). That gait was too fast and uneven. The human finish is still unproven, now five sessions running.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** Three horses went to `state` "down" at once (`plants` 1, 1 and 2). `tangles` read 1 and the thud and gasp sounds fired. I didn't see the auto-right.
3. **Replay and photo-finish look: 8, carried over, not viewed.**
4. **Photo finish and tangled AI collapse within a minute, no input: 8.** Two AI horses went down by about 7 s, but that run had my input. I didn't view a finish.
5. **Results with most face-plants award: 8, carried over, not viewed.** `div#tote` shows live face-plant counts.
6. **Looks as LOOK.md says: 6.5.** The toon steps, outlines, scanlines and `postpass-quad` hold. The race camera looks down at the ground, so the frame is mostly flat olive-yellow ground and a floating `grandstand` slab with its "GRAND STAND" sign. `hills` is 0.13% of the frame, just a 1 px line at y 0, and the ground is unchanged. The horses' legs are hidden by the pitch of the view, so the shot reads as bodies sliding along.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys and units, assets are 0.32 MB, the fonts are vendored and I saw no console errors.
8. **Horses match CHARACTERS.md: 7.5.** The silks, numbered saddle cloths, blinkers, big eyes and bristly manes show. In this camera the legs and hooves barely show, and the bodies sit close to the ground, so they read short rather than "long wobbly".
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds and face-plant counts. The LIVE bug, the 3:58 PM clock, RACE TIME, the `div#lower` caption from Hank "Hoofbeat" Pruitt, the progress bar and `div#keys` are all there with no overlaps.
10. **Camera: 6.5.** The side-tracking shot got worse at this pitch: the lens looks down at the ground and the grandstand floats at the top. I didn't see the head-on cut or the replay cams.
11. **Learnable controls: 7.** The key caps and the tip line teach the pattern. My naive alternation flipped the YOU horse by 7 s, and a finish under 60 s is not shown.
12. **Local 2-player, discoverable: 8.** "2 PLAYERS (2)" sits in `div#top-r` and the tip line mentions it.
13. **Style judged as hard as gameplay: 7.** The tote, the hoardings and the CRT pass fit the 70s TV look, but the empty flat ground and the missing hills weaken the broadcast frame.

**Faults: 7.5.** I saw no console errors and no fault lines. `perf` read 99 ms a frame on SwiftShader, which is no signal. Host load was 2.4 on 8 cores, with 266 draw calls and 126k triangles. The hills are still effectively `Never visible`, at 0.13%.

**Next:**
1. **Camera and hills (asked again).** Pitch the race camera up so the horizon sits at about 40% of the frame height. Lower the `lookAt` y or raise the pitch in `view.js`, then show a nearer ridge and treeline at z ≈ -30 behind the stand. A start `look` should list `hills` at 3% or more, with `sample` at [640, 300] showing hill green. It should also show the horses' legs and hooves clearly.
2. **Ground (asked again).** Replace the flat olive-yellow ground with a grass and dirt gradient plus mowing stripes, and make the `track` strip read as dirt. `sample` at [300, 600] should differ from the grass colour.
3. **Playable human finish (asked again).** Soften the leg motor torque or add damping in `physics.js` so a steady alternating Q+P / W+O at about 18 frames per hold keeps the YOU horse upright. It is done when `interact` with `until` `{"horses.2.finished": true}` and `max` 3600 gives `finishT` under 60. Then lengthen `DIM.upper` and `DIM.lower` by about 15%.

SCORE: 7.7
