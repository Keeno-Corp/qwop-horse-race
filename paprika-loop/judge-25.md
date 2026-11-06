**Judge 25**

I played a solo race through to `phase:"results"` and then started 2-player mode with `Digit2`. I ran `perf` once. There were no console errors. I did not play a full human finish: I held keys for about 3.4 s of race time, and YOU then idled at x 13.3 until the race ended at raceT 27.7. I did not see the head-on cut or the sepia photo-finish replay itself. I saw only the results card that follows it.

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** Q+P then W+O pulses took YOU from x 4.36 to 9.28 by raceT 3.4 and made YOU the leader. Pitch went to -0.44 at frame 34, then recovered to -0.07 with `plants:0`. The new 3 s start guard works. In 2-player mode `Digit2` gave `mode:2`, with horses `P1` and `P2` and the `div#keys` "PLAYER 1 Q W E R / PLAYER 2 U I O P".
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 8.** The idle race gave `plants` of 5 for Sir Trips-a-Lot and 2 each for YOU and Hoof Hearted. The sound log shows repeated thud, gasp and boing. The 1-player state strings `legs:"0110"` and `"1001"` show the legs driven. Sir Trips-a-Lot ended at pitch 0.84 and stayed `state:"run"` while still hurt. I did not see the 2 s auto-right clearly.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo-finish): 6.** The results card reads "PHOTO FINISH · 0.19s", so the photo-finish logic fires. I stepped straight to `results` and did not look at a replay frame, so the sepia, grain, scratches and "PHOTO FINISH" frame are still unseen by every judge.
4. **Photo finish and tangled AI collapse within the first minute: 8.** With no input from the AI side, Hoof Hearted beat Dusty Rhodes by 0.19 s at 21.15 s, and `tangles:1`. This is the second race in a row that has given a photo finish.
5. **Results with most face-plants award: 9.** `div#results` shows a podium and a table. The badges are "SMOOTH OPERATOR" for Dusty Rhodes and "DIRT EATER · MOST FACE-PLANTS" for Sir Trips-a-Lot. DNF rows show "1 M SHORT" and "45 M SHORT".
6. **Looks as LOOK.md says: 8.** The picture shows toon steps with outlines, an orange and yellow 70s palette, warm light, and `div#crt` over `postpass-quad`. The `look` Depth line still says "no fog: depth does not read". `hills` is still "Never visible" while in view. The `look` reply on the results frame also flags a render target left bound ("every render call drew into a render target, none to the screen").
7. **window.__game convention, static deploy: 9.** `index.html` is at the root. Assets total 0.32 MB, the fonts are vendored, and nothing is fetched at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** The look shows chunky bodies, white socks, dark hooves, big eyes, a bristly mane, blinkers and a bridle. The saddle cloths are red diamonds, green stripes, blue polka dots and the `#4` black/yellow. `look` reports 0 of 3 named parts for `horse0`, so the horse parts are not named for inspection.
9. **Broadcast overlay: 9.** `div#tote` shows silks, face-plant counts and odds that moved (5-1 → 2-1, 30-1 for YOU). `div#lower` carries the Hank "Hoofbeat" Pruitt play-by-play, and its line changed to "THIS ONE IS GOING TO THE PHOTOGRAPHERS... TOO CLOSE TO CALL!". `LIVE`, the `3:58 PM` clock, `RACE TIME` and the progress bar are all present.
10. **Camera: 7.** The side-tracking telephoto reads well, with the grandstand behind the horses. I did not see the head-on cut or the replay cams.
11. **Controls feel learnable: 6.** The pulse pattern gave a fast start and recovery from a -0.44 pitch dip. I did not measure a human finish under 60 s, and YOU stalled at 13.3 m when the keys stopped.
12. **Local 2-player: 7.** The mode switches in the HUD and both players' key panels show. Q and U held together gave both horses a pitch of about -0.22 at raceT 1.08. I did not play it to a finish.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds, with the tote, lower-third, CRT and results card. The picture is a little flat with no depth fog, and the `hills` backdrop never registers.

**Faults: 6.**
- `perf` showed 411 draw calls and 184k triangles. The 185 ms frame is a software renderer on host load 2.9, so it is not a budget signal. The draw-call count is still high.
- `hills` is "Never visible" and there is no fog.
- The results-frame render-target warning above.

**Next:**
1. Play one full human finish and the replay. Use a long `interact` that alternates Q+P and W+O in 20-frame pulses with `{until:{phase:"results"}, max:3000}`, and record YOU's `finishT`. Then `look` right after the finish, once with `observe` for the replay state, to see the sepia "PHOTO FINISH" frame with grain and scratches. Items 3, 10 and 11 stay lowest until this is seen. Also check the head-on cut, and whether the results frame's render-target warning is real.
2. Add depth fog (asked again). Set `scene.fog` to the sky or haze colour and make the toon and `merged` materials fog-aware. Make `hills` visible, for example by checking its position against the camera. `look` with `sample` at far pixels should show them paler than near pixels, and the `Depth:` line should no longer say "no fog".
3. Cut draw calls from 411 to under 250 (asked again). Merge `merged` and `merged-outline` per material, and instance `tail` and the crowd. Name the horse parts so `look target:"horse0"` finds more than 0 of 3. `perf` `variants` should show the draw-call count dropping.

SCORE: 7.7
