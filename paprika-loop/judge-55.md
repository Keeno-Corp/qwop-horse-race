**Scores**

1. **Plays as DESIGN.md says: 8.** The solo countdown runs to the "GO!" call, then `phase` goes `race` and `results`. `Digit2` shows `2 P1` / `3 P2` in the tote, with two lane markers and a PLAYER 1 / PLAYER 2 keys box. R's restart and the 2-player Enter restart are listed in `div#tips`. A human finish was not played.
2. **Real Rapier ragdolls, face-plant and auto-right: 8.** The horses carry `plants` and `state` fields, and the 25 s no-input race logged 4 face-plants for Sir Trips-a-Lot with thud/gasp/boing sounds. The auto-right timing was not measured.
3. **Replay and photo-finish look: 8.5.** The no-input run reached the sepia replay by frame 2300, about 40 s in. It has the "PHOTO FINISH" title, "REPLAY 0.25X", film borders with scratches, and the "WINNER: DUSTY RHODES · BY 0.13 SEC" caption.
4. **Photo finish and tangled AI collapse within a minute, no input: 8.** Both runs ended in a photo finish: 0.19 s in the 25 s run and 0.13 s in the 40 s run (reported as "0.19s" / "0.13 SEC", which is rounding of one race's gap, not a mismatch). `tangles` was 1. Only two races were seen, so "nearly every race" is not shown.
5. **Results with most face-plants award: 9.** `div#results` shows "Dusty Rhodes WINS!", a podium, and the "DIRT EATER · MOST FACE-PLANTS" tag on Sir Trips-a-Lot. It also has the "SMOOTH OPERATOR" tag and "DNF · 56 M SHORT" for YOU.
6. **Looks as LOOK.md says: 7.5.** The picture has toon steps with outlines (`merged-outline`, `mesh-outline`), an orange/yellow palette at 53%/26%, warm light, and CRT scanlines and vignette in `div#crt` with `postpass-quad` at 98%. `hills` is still a 0.82% strip at y 408-415. The grandstand fills the horizon, and the camera never shows sky or treeline.
7. **`__game` convention, static, no network: 9.** `window.__game` returns keys and units. Assets are 0.32 MB, with the fonts vendored, and there were no console errors.
8. **Horses match CHARACTERS.md: 8.** Chunky bodies, white socks, dark hooves, big eyes, bristly manes, tails, blinkers and saddle-cloth silks (diamond, stripe, polka dot, chevron) all read. The legs look shorter and sturdier than the "long wobbly" legs in the brief.
9. **Broadcast overlay: 9.** `div#tote` has silks chips, live odds (5-1/4-1/2-1/3-2, then "30-1" and "—" at the finish) and per-horse face-plant counts. The overlay also has the LIVE bug, the "7 3:58 PM" clock, `div#lower` with Hank "Hoofbeat" Pruitt's play-by-play, the "GO!" title and the progress bar.
10. **Camera: 7.5.** The side-tracking telephoto and the replay cam (head-on, dolly) show. The head-on live cut was not triggered in what I saw.
11. **Learnable controls: 7.** I did not play a human finish. In the no-input race YOU stayed at x 2 with `plants` 0 and finished DNF, and the key cap labels read "Q FL W FR O BL P BR".
12. **Local 2-player, discoverable: 8.** A "2 PLAYERS (2)" button sits in `div#top-r`, and `div#keys` splits into PLAYER 1 / PLAYER 2 with Q W E R / U I O P.
13. **Style judged as hard as gameplay: 8.** The 70s TV race reads strongly: the tote, the cream results card, the crowd and the ad hoardings.

**Faults: 7.** There were no console errors. `perf` read 212 ms a frame, 266 draw calls and 141k triangles on a software renderer, so the frame time is not a signal. Draw calls and triangles are still heavy, with `merged-outline`, `mesh-outline` and `tail` as separate draws. The `hills` ridge is barely visible.

**Next:**
1. The `hills` ridge, sky and treeline are still a thin strip behind the grandstand. Lower the `grandstand` roof or move the stand back or tilt the camera up so the ridge and sky show above it. A `look` at start should then show `hills` over 3% of the frame, with sky colour above y 390.
2. Play a human finish with `interact` on Q/W/O/P (or `Digit2` with both players) and tune it until a 60 m run finishes in under 60 s. Make the YOU leg legs and keys visibly respond, and check the head-on cut fires during a live race.
3. Cut draw calls (266, 141k triangles): merge or instance `merged-outline`, `mesh-outline`, `tail`, and the crowd and ad geometry. `perf` should then show the draw calls dropping, for example under 150.

SCORE: 8.1
