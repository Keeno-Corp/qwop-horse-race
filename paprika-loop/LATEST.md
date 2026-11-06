The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 23

**Judge 23**

I played the countdown into the race and ran `perf` once. The black rectangle above `div#lower` is gone from both looks. I didn't reach a finish, so the sepia photo-finish replay, the head-on cut and 2-player are still unseen. I only held keys for about 1.5 s of race time.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The countdown went to `phase:"race"`. Q+P then W+O pulses moved YOU from x 1.44 to 5.48 in 94 frames, with `pitch` between -0.05 and -0.01 and no face-plant. The HUD tips say "ALTERNATE LEGS: Q+P THEN W+O". I didn't play to the finish.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 7.** The horses visibly gallop with jointed legs. `state:"run"` and `plants:0` held this session. No collapse or auto-right was seen this time.
3. **Replay (0.25x, Space skips, sepia photo-finish): 6.** The plant replay was confirmed in judge 19. The sepia "PHOTO FINISH" replay has still never been seen by any judge.
4. **Photo finish and tangled AI collapse within the first minute: 7.** This is unchanged from judge 19 (one race with +0.19 s). There is still no evidence of how often it happens.
5. **Results with most face-plants award: 8.** This was seen in judge 19 ("DIRT EATER" tag) and not re-seen this session.
6. **Looks as LOOK.md says: 8.** `track`, `merged` and `merged-outline` show toon steps with dark outlines on a warm orange and yellow palette, under `div#crt` and `postpass-quad`. The `look` Depth line says "no fog: depth does not read", so far objects are no paler than near ones. `hills` is still "Never visible" while in view.
7. **window.__game convention, static deploy: 9.** The `open` reply printed the `__game` keys. Assets are 0.32 MB, with the fonts vendored and no network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The screenshot shows a chunky body, white socks, dark hooves, big eyes, a bristly mane, blinkers and a bridle. The saddle cloths are distinct: red diamonds, green stripes, blue polka dots and a black/yellow `#4`. The blinker silks are still small, and `look target:"horse0"` finds 0 of 3 named parts.
9. **Broadcast overlay: 9.** `div#tote` has silks, face-plant counts and odds that moved (4-1 → 5-1, 2-1 → 3-2). `div#lower` shows the play-by-play ("AND THEY'RE OFF, FOLKS!"), and the commentator changed between looks. `LIVE`, the `3:58 PM` channel bug, `RACE TIME` and the "1" countdown are all there.
10. **Camera: 7.** The side-tracking telephoto is good. The head-on cut and the replay cams were not seen this session.
11. **Controls feel learnable: 5.** No human finish has been measured by any judge. The pulse pattern gave steady forward motion with no immediate fall.
12. **Local 2-player: 6.** The `2 PLAYERS (2)` button and the tips text are in the HUD. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s broadcast look holds, with the tote, lower-third and CRT pass. The picture is slightly flat for lack of depth fog.

**Faults: 6.**
- There were no console errors.
- `perf` showed 411 draw calls and 184k triangles. The 188 ms frame is a software renderer on host load 2.6, so it isn't a budget signal. The draw-call count is still high.
- `hills` is "Never visible" and there is no fog.

**Next:**
1. Play one full human finish. Alternate Q+P and W+O in a single `interact` with `{until:{phase:"results"}, max:2400}` and record YOU's `finishT`, then check that the sepia "PHOTO FINISH" replay appears (`replay.kind` should be the photo-finish kind). Then press `Digit2` and drive Q W E R vs U I O P once. Items 1, 3, 11 and 12 have been unproven for many sessions, and this lowest-scoring set is the main thing to settle.
2. Add depth fog. Set `scene.fog` to the sky or haze colour and make the toon and `merged` materials fog-aware, or lerp their colour in the shader. Check `hills` with `look cameras` along the track. Confirm with `look sample` that far pixels are paler than near ones, and that the `Depth:` line no longer says "no fog".
3. Cut draw calls from 411 to under 250. Merge `merged` and `merged-outline` per material, and instance `tail` and the crowd. Enlarge the blinker silks and name the horse parts, so `look target:"horse0"` finds more than 0 of 3. `perf` `variants` should show the draw-call count dropping.

SCORE: 7.2

## Iteration 25
**Did**
- Softened the human start: `game.js:550` race-start `guard` is 3 s for human horses (1.2 s for AI).
**Saw**
- Syntax check only; no render, perf or play run this session.
**Next**
- Re-run the Q+P/W+O pulse test and check YOU survives past raceT 5. Then a full finish and the photo-finish replay. Then draw calls (411).
**Open**
- Whether `Horse.human` exists; full finish, photo-finish replay and 2-player still unchecked.
