**Scores**

1. **Plays as DESIGN.md says: 8.** `Digit1` starts the countdown, then `phase` goes `race` with `raceT` running. The `div#tips` line lists R restart, 2 for two players and Space to skip replays. I did not play a human finish. In this run YOU sat at x 2.03 with `legs` "0000", as expected with no input.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** Each horse in the state has `state` "run", `plants` and `legs` bit strings. I did not trigger a face-plant or time the auto-right this session.
3. **Replay and photo-finish look: 8.** Not re-viewed this session. The last verdict saw the sepia replay, the "PHOTO FINISH" title and film borders, and nothing in this session's change touches them.
4. **Photo finish and tangled AI collapse within a minute, no input: 8, carried over.** The last verdict saw two races end in photo finishes. I did not run a no-input race this session.
5. **Results with most face-plants award: 8.5, carried over.** The last verdict saw the DIRT EATER tag on `div#results`. I did not re-check it.
6. **Looks as LOOK.md says: 7.5.** The picture shows toon steps with outlines (`mesh-outline`, `merged-outline`), an orange 49% / yellow 33% palette and warm light. The `div#crt` and `postpass-quad` give the CRT/VHS look. The camera now tilts up, so a green-yellow haze shows behind the `grandstand` instead of the stand filling the frame. But `hills` is still a 0.82% strip at y 408-415, and no ridge, treeline or clear sky shows.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys and units, assets are 0.32 MB, and the fonts are vendored. There were no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-dot, grey and chestnut horses show white socks, dark hooves, big eyes, bridle and blinkers, a bristly mane and number saddle cloths. The saddle cloth with the "4" shows stripes, and the legs still read short against the "long wobbly" brief.
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds (4-1/4-1/3-1/3-2) and face-plant counts. The overlay also has the LIVE bug, the "3:58 PM" clock, the "RACE TIME" box, the Hank "Hoofbeat" Pruitt `div#lower` and the `div#keys` cap labels.
10. **Camera: 7.5.** The side-tracking telephoto at look target y 3.2 puts the horses low, level with the `div#lower` caption. The head-on live cut was not triggered, and I did not play a human finish.
11. **Learnable controls: 7.** A human 60 m finish is still unplayed. The `div#keys` caps read Q FL, W FR, O BL, P BR, and the tip line says "ALTERNATE LEGS: Q+P THEN W+O".
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button in `div#top-r` and the "2 = TWO PLAYERS" tip are visible. I did not re-press `Digit2` this session.
13. **Style judged as hard as gameplay: 8.** The tote, the ad hoardings (ZENITH, TOP-CAT), the crowd on the stand and the CRT scanlines read as a 1970s TV race. The haze background is a bit flat.

**Faults: 7.** There were no console errors. `perf` read 167 ms a frame on SwiftShader, which is no signal, and host load was 1.3 on 8 cores. Draw calls (267) and triangles (141k) are still heavy. `hills` is hidden behind the stand. The `div#crt` overlay is still reported as covering the canvas after 5 s, but it is the intended CRT pass.

**Next:**
1. The `hills` ridge is still a 0.82% strip behind the stand (asked again). Move the `grandstand` back, or lower its roof and shorten the `crowd` tiers, so the `hills` ridge and a treeline show on the horizon between the stand and the haze. `look` with `sample` at about [640, 120] should read sky or haze, and `hills` should list at over 3% of the frame.
2. The horses sit low in the frame, level with the `div#lower` caption. Raise the follow-cam's look target y slightly, or move `div#lower` further left or down, so the horse legs and hooves clear the caption box. In the look at race start, the hooves should end above y 650.
3. Play a human finish (asked again): `interact` with alternating Q+P / W+O holds and `until` `horses.2.finished`, and check it finishes in under 60 s. Then check the head-on cut fires during a live race.

SCORE: 8.0
