The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 33

**Judge 33.** I opened the page and played Q, P, W, O pulses twice (20 frames each) after waiting for `phase:"race"`, with a `look`, then ran `perf` with `costs`. There were no console errors. I did not play the finish replay, 2-player mode, the head-on cut or the results screen this session.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `div#keys`, `div#tips` and the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons show, with `RACE TIME 4.7s`. Starting from `phase:"race"`, YOU (`horses.2.x`) reached 10.76 at raceT ~4.5 s. The AI were at 10.2 to 11.0 at 4.68 s, so the human horse now keeps pace. Last judge's YOU was at 4.1.
2. **Real Rapier jointed ragdoll, face-plant collapse and auto-right: 8.** YOU went to `state:"down"` with `plants:1`, `pitch -0.43` and `legs:"0000"`. The "FACE-PLANT! YOU eat dirt!" pop and the "ouch" tote line fired, and the sound log shows thud and gasp. I did not watch the ~2 s auto-right.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo finish): 7.** I did not see it, so the grain is still unchecked (asked in Judges 30 and 32 and Iteration 33).
4. **Photo finish and tangled AI collapse within the first minute: 8.** This rests on earlier measurements. All three AI were in `state:"run"` and bunched at x 10.2 to 11.0 at 4.7 s.
5. **Results with most face-plants award: 9.** From earlier judges. I did not reach it.
6. **Looks as LOOK.md says: 8.** The `look` shows toon steps with thick outlines, an orange and yellow palette, warm light and the CRT pass (`div#crt` over `postpass-quad`). The grandstand crowd, rail, Pronto Pizza and Top-Cat Tires billboards read as a 70s broadcast. `hills` is still a flat blob at top right and `look` still lists it as "Never visible".
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and the fonts are vendored. The `plants` path I traced is not in `observe()`, although it is in `horses.N.plants`.
8. **Horses match CHARACTERS.md and horse.png: 8.** The `look` shows a chunky body, a bristly mane, white socks, dark hooves, big round eyes and blinkers. The silk cloths are a blue polka dot, a red diamond, green stripes and black and yellow stripes.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds (3-1, 3-1, 6-1, 2-1) and face-plant counts. `div#lower` has the Hank "Hoofbeat" Pruitt line. `LIVE`, the `3:58 PM` clock bug and the progress bar are there.
10. **Camera: 7.** The side-tracking telephoto reads well. I did not see the head-on cut or a replay cam.
11. **Controls feel learnable: 7.** The drive boost from Iteration 33 helps: YOU kept pace with the AI. Alternating pulses still ended in a face-plant at raceT ~4.5 s, which fits "mistimed keys give face-plants". No human finish was seen, and YOU drifted from 10.76 to 10.69 while down.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and `div#keys` show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. The open issues are `hills`, which has no depth, and the lower-left HUD, which is now clean.

**Faults: 6.**
- `perf` shows 411 draw calls and 158,804 triangles.
- `merged` is 142 calls, `Mesh` 56, `merged-outline` 45 and `mesh-outline` 18. `tail` is 16, and `crowd` is 48k triangles.
- The 229 ms frame is a software renderer at host load 2.3, so it is not a budget signal.
- `hills` is "Never visible" while in view.
- The grain is unchecked.

**Next:**
1. **Draw calls (asked again, third time).** The Iteration 33 Next list this and `perf` still shows 411. Merge `merged` (142) and `Mesh` (56) by material across horses, merge `merged-outline` (45) and `mesh-outline` (18), instance `tail` (16), and cut `crowd` from 48k triangles with an InstancedMesh or fewer figures. Check with `perf` and `costs`, which should show under 250 calls and about 100k triangles.
2. **Verify the finish replay and 2-player (asked again, fourth time).** Run `interact` with `until:{replay:{kind:"finish"}}`. Then use `look` with `sample` on a corner pixel (sepia read, R>G>B) and a `zoom` on the "PHOTO FINISH" frame, where the grain should be visible but not harsh. Then press key 2, play Q W E R and U I O P, and `look` at the head-on cut.
3. **Give `hills` depth, and tune YOU so a clean alternating rhythm finishes.** For `hills`, add a second, farther and paler hill layer, or distance fog. Check with `look` and `sample` on the blob and a foreground grass pixel, where the blob should be paler and bluer. For YOU, run `interact` with Q+P then W+O in 12-frame alternations from `phase:"race"` and `trace` `horses.2.x`. A clean rhythm should reach x 60 in under 60 s with `plants` ≤1. If it face-plants by 5 s, soften the pitch collapse threshold for the human horse.

SCORE: 7.7

## Iteration 35
**Did**
- Added a `ridge` mesh in `view.js` (700 units wide, pale blue `0xa9bec6` MeshBasicMaterial, at z -185 behind `hills`) for depth. Not yet proven to help.
**Saw**
- No console errors. `look` lists `ridge` as "Never visible" (behind the camera), and in the race view the grandstand covers the backdrop, so the ridge cannot show there; `hills` only peeks out at top left.
- `look` Depth line: far objects are no paler than near ones, there is no fog.
- Race started and ran fine to 1 s (4 horses in state "run"). Not run: `perf`, finish replay, 2-player.
**Next**
- Add `scene.fog` in the haze colour (`0xb4c6c4`), or pale the far stand and crowd colours, so depth reads. Check with `look`'s Depth line.
- Draw-call merging (`merged` 142, `Mesh` 56, outlines, `tail`) and `crowd` triangles (about 48k).
- Fix the dark first replay frame; verify the finish replay and 2-player (`Digit2`).
**Open**
- `ridge` is possibly invisible from the shipped camera angles; remove it if it stays so. Draw calls are still about 411.
