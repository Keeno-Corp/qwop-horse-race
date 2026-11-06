**Scores**

1. **Plays as DESIGN.md says: 8.** The `Digit1` start gives the countdown "1", then "GO!". `div#keys` shows the Q W O P caps and `div#tips` shows "ALTERNATE LEGS: Q+P THEN W+O". I didn't play a full 60 m finish this session.
2. **Real Rapier ragdolls, face-plant and auto-right: 8, carried over.** The horses keep their jointed bodies and legs. I didn't trigger a face-plant this session.
3. **Replay and photo-finish look: 8, carried over, not viewed.**
4. **Photo finish and tangled AI collapse within a minute, no input: 8, carried over, not run.**
5. **Results with most face-plants award: 8, carried over, not viewed.**
6. **Looks as LOOK.md says: 7.5.** Toon steps, outlines, warm orange and yellow tones, scanlines and `postpass-quad` all show. The `grandstand` is lower now, but the background above it is still mostly the stand's back wall, the haze and the ad hoardings. `hills` shows as a thin green band, with no real sky or treeline. The picture is saturated and warm and reads as 70s TV, though the ground is a flat orange.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys and units, assets are 0.32 MB, the fonts are vendored and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-dot, grey and chestnut horses show white socks, dark hooves, big eyes, blinkers and saddle cloths with the "M" logo. The legs still read short, not "long wobbly".
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds and face-plant counts. The LIVE bug, the 3:58 PM clock, RACE TIME, the `div#lower` commentator caption (Walt Dunmore, Hank "Hoofbeat" Pruitt) and the progress bar are all there.
10. **Camera: 7.5.** The side-tracking telephoto is good. I didn't see the head-on cut or the replay cams this session.
11. **Learnable controls: 7.5.** The key caps and the tip line teach the alternating pattern. A full finish under 60 s is still unproven.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button is in `div#top-r`.
13. **Style judged as hard as gameplay: 8.** The tote, the TOP-CAT and GOLDEN HOOF OATS hoardings, the crowd and the CRT pass work well. The background is the weak part.

**Faults: 7.5.** I saw no console errors. `perf` read 124 ms a frame on SwiftShader, which is no signal. Host load was 4.0 on 8 cores, with 266 draw calls and 126k triangles. `div#crt` covers the canvas on purpose.

**Next:**
1. **Background (asked again, fourth time).** `hills` is still a thin band, and the previous Next said it is hidden by camera pitch, not by the stand. In `view.js`, add a tall sky gradient plane or dome behind the stand, a nearer dark-green treeline and a taller `hills` ridge so the ridge fills about 8% of the frame. One `look` at race start with `sample` at [640, 120] should show a sky colour that is not the stand's brown, and `hills` should list at 3% or more.
2. **Play a full human finish (asked again).** Call `interact` with alternating Q+P / W+O holds of about 40 frames and `until` `{"horses.2.finished": true}` with `max` 3600. It is done when `finishT` is under 60 and the replay or results appear. Check that the head-on cut fires.
3. **Long legs.** CHARACTERS.md says "long wobbly". Lengthen the leg segments in the horse builder by about 15%, so the start `look` shows a clear gap between belly and ground, taller than the barrel depth.

SCORE: 8.1
