The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 19
**Did**
- game.js line 37: added `scene.fog = new THREE.Fog(scene.background, 90, 420)` after `buildEnvironment`, only if the background is a Color. This is the sky-coloured haze the judge asked for.
**Saw**
- `open` and `look` at the title card: the page renders, the title card, tote, bug and keys overlay are all there, with no console errors. Brightness 52%, orange 44% / yellow 38%.
- I did not check whether the fog tints the far hills, because the title card covers them. Draw calls and frame time not re-measured. `hills` is still listed "Never visible".
**Next**
- Look mid-race to confirm the fog is visible. If the toon materials ignore fog, set `fog: true` on them or move the near/far range.
- Draw calls 411 to <250: merge `merged` and `merged-outline` per material, instance `tail`.
- Scripted human Q+P / W+O input to 60 m, and check `legs:"0000"` stops the horse. Name horse parts so `look target:"horse0"` finds them. Enlarge blinker silks.
**Open**
- Fog effect unverified in race view. The sepia photo-finish replay is still unseen. A human-key finish is still unproven.

### Judge 19

**Judge 19**

I ran a no-input race to the results screen, then restarted and watched the face-plant replay. I did not see the sepia photo-finish replay itself, test 2-player, or play a human finish. The results screen ends with "Hoof Hearted WINS! PHOTO FINISH · 0.19s".

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** Holding Q led from `phase:"race"` to `phase:"results"` at frame 2646 (raceT 30.2). `results` ranks Hoof Hearted, Dusty Rhodes, Sir Trips-a-Lot, then YOU (DNF, 56 m short). After KeyR the phase went back to `race`. 2-player was not played.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 7.** `state` goes run→down and back to run (Sir Trips-a-Lot reached `plants:5`). The `pitch` values in the replay (down to -0.66) look right. Auto-right was not timed.
3. **Replay: 7.** `replay.kind:"plant"` at `rate:0.25`, with the "INSTANT REPLAY · 0.25X" tag and the "SPACE to skip" hint. The sepia photo-finish replay with grain and a "PHOTO FINISH" frame was not reached. The results card does say PHOTO FINISH.
4. **Photo finish and tangled AI collapse within the first minute: 8.** With no input, `tangles:1` and several face-plants happened by raceT 7. The finish was Hoof Hearted 23.70 s against Dusty Rhodes 23.90 s (+0.19). That is one race, so I can't say how often it happens.
5. **Results with most face-plants award: 9.** The `div#results` card has a podium and a table. Sir Trips-a-Lot carries a red "DIRT EATER · MOST FACE-PLANTS" tag, and Hoof Hearted and Dusty Rhodes carry "SMOOTH OPERATOR". The card is very close to the refs.
6. **Looks as LOOK.md says: 8.** The picture has toon steps with dark outlines, a warm orange and yellow palette, and a CRT/VHS pass from `postpass-quad` and `div#crt`. The horses read well in the replay. The fog from iteration 19 isn't visible. `hills` is still listed "Never visible" even though it is in view. The look output also warns that every render call drew into a render target, so the canvas may be showing an earlier frame.
7. **window.__game convention, static deploy: 9.** The `open` reply printed the `__game` keys JSON. Assets total 0.32 MB, with `Shrikhand-Regular.ttf` and `Bungee-Regular.ttf` vendored, and there is no network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** In the replay I saw chunky bodies, white socks, dark hooves, big round eyes, a bristly mane, a bridle, and silks on `#1` (red diamonds) and `#4` (black/yellow). The blinker silks are still small, and `look target:"horse0"` finds 0 of 3 named parts.
9. **Broadcast overlay: 9.** `div#tote` shows silks, face-plant counts and moving odds (3-2, WIN, 30-1). `div#lower` carries the play-by-play from Hank "Hoofbeat" Pruitt. The `LIVE` bug, the `7 4:00 PM` bug, the `RACE TIME` readout and the title card are all there.
10. **Camera: 7.** The side-tracking telephoto and the replay camera are good. The head-on cut was not seen.
11. **Controls feel learnable: 5.** I did not measure a human 60 m finish, and no scripted input was run. My no-input run was only Q for 5 frames, and YOU ended 56 m short (`legs:"0000"`).
12. **Local 2-player: 6.** The `2 PLAYERS (2)` button is in the HUD and the tips line mentions `1 / 2 = PLAYERS`. I did not test it.
13. **Style judged as hard as gameplay: 8.** It reads as a 1970s TV broadcast. The tote, the results card and the CRT pass are strong.

**Faults: 6.**
- There are no console errors.
- `perf` showed 411 draw calls, 184k triangles and a 209 ms median frame on a software renderer. Host load was 2.1 on 8 cores, so the frame time is not a budget signal. Draw calls are still high.
- The render-target warning is above, and `hills` is "Never visible".

**Next:**
1. Play a human finish with scripted alternating input, `Q+P` then `W+O`, using `interact until phase:"results"`, and record YOU's `finishT`. Check that `legs:"0000"` stops the horse. Then test 2-player with `{key:"Digit2"}` and Q W E R vs U I O P, and watch for the sepia "PHOTO FINISH" replay after a close finish. The brief's items 1, 3, 11 and 12 are all unproven.
2. Fix the render-target warning in the `postpass-quad` pass (`setRenderTarget(null)` before the final draw) and check `hills` with `look cameras` at x≈20 looking along the track. Then confirm the fog from `scene.fog` shows. That means the toon materials must accept fog, or the near/far range of 90 to 420 must be tightened. Sample far hill pixels with `look sample` to see whether they are paler than near ones.
3. Cut draw calls from 411 to under 250 by merging `merged` and `merged-outline` per material and instancing `tail` and the crowd. Enlarge the blinker silks, and name the horse parts so `look target:"horse0"` finds them (`perf variants` should show the change).

SCORE: 7.5
