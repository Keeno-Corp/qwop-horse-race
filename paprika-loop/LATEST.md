The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 17

**Judge 17**

Replay t=5 shows two horses and the camera on them, so the empty-first-frame fix looks fine. I did not run a full race to the finish. A 600 s `look` sheet hung, so I only saw the opening, the start, and a no-input race up to its first face-plant replay.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** Holding Q gave `phase:"race"`, with `countdown` reaching 0 and the `GO!` banner. In the no-input race, `horses` Sir Trips-a-Lot and Hoof Hearted went `state:"down"` with `plants:1`, and `tangles:1`. I did not test 2-player or R. I did not run a human finish of 60 m, so it is unproven.
2. **Real Rapier jointed ragdoll horses, face-plant collapse and auto-right: 7.** `state` moves run→down and `pitch` reaches -0.23. I did not watch the auto-right after about 2 s.
3. **Replay: 7.** The `plant` replay runs at `rate:0.25` with the "INSTANT REPLAY · 0.25X" tag and a "SPACE to skip" hint. I did not see the sepia photo-finish replay with "PHOTO FINISH" frame.
4. **Photo finish and tangled AI collapse within the first minute: 6.** A face-plant and `tangles:1` came at raceT 7.7 with no input. I did not confirm that a close-finish photo-finish replay happens.
5. **Results with most face-plants award: 4.** I did not reach the results screen. The tote does show `FACE-PLANTS 0` per horse.
6. **Looks as LOOK.md says: 8.** The picture has toon steps with dark outlines, a warm orange and yellow palette, and a CRT vignette from `postpass-quad`. The `Depth:` line says far objects are no paler than near ones and there is no fog. `hills` shows as "Never visible" although it is in view.
7. **window.__game convention, static deploy: 9.** The `open` reply printed the `__game` keys JSON. Assets total 0.32 MB, with `Shrikhand-Regular.ttf` and `Bungee-Regular.ttf` vendored.
8. **Horses match CHARACTERS.md and horse.png: 8.** The picture shows chunky barrel bodies, white socks, dark hooves, big round eyes, a bristly mane, and silks on `#4` (black/yellow) and `#2` (green stripes). `look target:"horse0"` finds 0 of 3 named parts. The blinker silks are small.
9. **Broadcast overlay: 9.** `div#tote` has silks and odds that moved from 3-1 to 4-1, 3-1 and 2-1. `div#lower` shows the commentator changing from Walt Dunmore to Hank "Hoofbeat" Pruitt. The `LIVE` and `7 3:58 PM` bug and the title card are all there.
10. **Camera: 7.** The side-tracking telephoto and the replay camera are good. I did not see the head-on cut.
11. **Controls feel learnable: 5.** Nothing was measured here. Under `legs:"0000"` the `YOU` horse trots on its own, which may make play too easy.
12. **Local 2-player: 6.** The `2 PLAYERS (2)` button is in the HUD, but I did not test it.
13. **Style judged as hard as gameplay: 8.** It reads as a 1970s TV race, and the tote and title card are very close to the refs.

**Faults: 6.**
- There are no console errors.
- `perf` showed 412 draw calls and 184k triangles. Frame time was 151 ms, but the host load line shows a busy host on a software renderer, so that is noise.
- `div#crt` covers the canvas, as intended.
- A 4500-frame look sheet hung for 600 s. That is probably the SwiftShader cost, not a bug.
- The black-rectangle fault from PROMPT.md's Open list is not present.

**Next:**
1. Run the full race to the finish with `interact until phase:"results"`, then `look`. Confirm the photo-finish replay (sepia, grain, "PHOTO FINISH" frame) and the results screen with the face-plants award, since neither has been seen. Fix whichever is missing. The 4 (item 5) and 6 (item 4) scores are the lowest.
2. Prove the 60 m human finish with scripted alternating Q+P / W+O input, and check that `legs:"0000"` stops the horse. Then record the time in the notes.
3. Cut draw calls from 411 to under 250 by merging `merged` and `merged-outline` per material and instancing `tail`. Also add `scene.fog` in the sky colour so depth reads, and name the horse parts so `look target:"horse0"` works.

SCORE: 7.0

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
