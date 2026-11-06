The player's horse covered 11.6 m in about 3 s while alternating legs, so a 60 m finish in under 60 s looks reachable. I didn't play it to the end.

**Scores**

1. **Plays as DESIGN.md says: 8.** `Digit1` starts the countdown, then `phase` goes `race` with `raceT` running. The `div#tips` line lists R restart, 2 for two players and Space to skip replays. Alternating Q+P / W+O holds took YOU from x 2.03 to 13.64 in 176 frames with `state` "run" throughout. I didn't play the full finish.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** Each horse in the state has `state`, `plants`, `pitch` and `legs`. YOU's pitch went to -0.2 and its y to 0.83 while running. I didn't trigger a face-plant or time the auto-right.
3. **Replay and photo-finish look: 8, carried over.** I didn't re-view the replay this session, and the last session's change was CSS only.
4. **Photo finish and tangled AI collapse within a minute, no input: 8, carried over.** I didn't run a no-input race to the end.
5. **Results with most face-plants award: 8, carried over.** I didn't re-check the DIRT EATER tag on `div#results`.
6. **Looks as LOOK.md says: 7.5.** The look shows toon steps with outlines (`mesh-outline`, `merged-outline`), orange 48% / yellow 34% hues, warm light and the `div#crt` / `postpass-quad` CRT pass. But `hills` is still a 0.82% strip at y 408-415, so the `grandstand` fills the background and no ridge, treeline or sky shows. The haze behind it is flat.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys and units, assets are 0.32 MB and the fonts are vendored. There were no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-dot, grey and chestnut horses show white socks, dark hooves, big eyes, bridle and blinkers, a bristly mane and number saddle cloths. The legs still read short against the "long wobbly" brief.
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds and face-plant counts. The overlay also has the LIVE bug, the 3:58 PM clock, the RACE TIME box, the Hank "Hoofbeat" Pruitt `div#lower` and the `div#keys` caps.
10. **Camera: 7.5.** The side-tracking telephoto works, and the hooves now clear the narrower `div#lower`, which ends at x 597. The head-on cut and the replay cams were not triggered this session.
11. **Learnable controls: 7.5.** The `div#keys` caps and the tip line "ALTERNATE LEGS: Q+P THEN W+O" show how to play. A 60 m finish in under 60 s is plausible from the 11.6 m in 3 s, but it is not shown.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button in `div#top-r` is visible. I didn't press `Digit2`.
13. **Style judged as hard as gameplay: 8.** The tote, the ad hoardings (ZENITH, TOP-CAT), the crowd and the scanlines read as a 1970s TV race. The background is the weak part.

**Faults: 7.5.** There were no console errors, and the `div#lower` change is confirmed. `perf` read 169 ms a frame on SwiftShader, which is no signal, with host load 2.3 on 8 cores. Draw calls (267) and triangles (141k) are heavy. `hills` is hidden behind the stand. The `div#crt` overlay is intentional.

**Next:**
1. The `hills` ridge is still a 0.82% strip behind the stand (asked again, third time). In `view.js`, move the `grandstand` back along z, or lower its roof and shorten the `crowd` tiers. Add a treeline and a lighter sky gradient above the ridge. `look` should then list `hills` at over 3% of the frame, with a sky or ridge colour at about [640, 120].
2. Play a full human finish (asked again): `interact` with repeated Q+P / W+O holds of about 40 frames and `until` `{"horses.2.finished": true}` with `max` 3600. It is done when `finishT` is under 60 and the replay or results appear. Then check that the head-on cut fires during that race.
3. Add a long-legs pass on the horses (CHARACTERS.md says "long wobbly"). Lengthen the leg segments about 15% in the horse builder so the legs read taller than the barrel. `look` at race start should show a visible gap between belly and ground.

SCORE: 8.1
