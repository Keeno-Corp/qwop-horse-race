**Judge 35.** I opened the page and played from `phase:"race"` for 2 s, with a `look`. I then ran `perf` with `costs`. There were no console errors. I did not play the finish replay, 2-player mode, the head-on cut, the results screen or a restart this session. Those scores rest on earlier judges.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `div#keys` ("YOUR LEGS Q FL W FR O BL P BR"), `div#tips` and the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons show. At raceT 2.02 s all 4 horses were in `state:"run"` and YOU was at x 1.43 with `legs:"0000"`.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** The `tote` shows "FACE-PLANTS 0" per horse, and `state` and `plants` are tracked per horse. I did not see a collapse or the auto-right this session.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo finish): 7.** Unseen again, so the grain is unchecked. It has been asked for in Judges 30, 32 and 33.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Earlier measurement. The AI were bunched at x 1.7 to 3.8 at 2 s.
5. **Results with most face-plants award: 9.** From earlier judges. I did not reach it.
6. **Looks as LOOK.md says: 8.** The `look` shows toon steps with thick outlines, an orange and yellow palette, warm light, and the CRT pass (`div#crt` over `postpass-quad`). The grandstand, rail, crowd and billboards read as 1970s TV. The `look` Depth line says there is no fog and far objects are no paler than near ones. `hills` is a flat green and orange blob at top left, and `ridge` is "Never visible" (behind the camera).
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and the fonts are vendored. There is no network use at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** The `look` shows a chunky barrel body, a bristly mane, white socks, dark hooves, big round eyes and blinkers. The silks are a blue polka dot on cream, black and yellow diamonds, and others on the saddle cloths.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds (4-1, 5-2, 3-1, 2-1) and face-plant counts. `div#lower` has the Hank "Hoofbeat" Pruitt line. The `LIVE` bug, the `3:58 PM` clock bug, the race-time bug and the progress bar are there.
10. **Camera: 7.** The side-tracking telephoto reads well. I did not see the head-on cut or a replay cam.
11. **Controls feel learnable: 7.** Unchanged from Judge 33. YOU kept pace with the AI then, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and the `div#tips` line show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. Depth is the weak point: `hills` is a flat blob and there is no fog.

**Faults: 6.**
- `perf` shows 412 draw calls and 158,944 triangles, unchanged for four sessions.
- `merged` is 142 calls, `Mesh` 56, `merged-outline` 45, `mesh-outline` 18 and `tail` 16. `crowd` is 48k triangles and `hills` is 12.5k for a flat blob.
- The 220 ms frame is a software renderer at host load 2.3, so it is not a budget signal.
- `hills` is "Never visible" while in view, and `ridge` is never visible either.
- The dark first replay frame and the grain are unchecked.

**Next:**
1. **Draw calls (asked again, fourth time).** `perf` still shows 412 calls. Merge `merged` (142) and `Mesh` (56) by material across horses, merge `merged-outline` (45) and `mesh-outline` (18), and instance `tail` (16). Cut `crowd` from 48k triangles with fewer figures or an InstancedMesh, and cut `hills` from 12.5k triangles to a few hundred. Check with `perf` and `costs`, which should show under 250 calls and about 100k triangles.
2. **Depth (asked again).** Add `scene.fog` in the haze colour (`0xb4c6c4`) with near/far values that leave the horses untouched, and delete `ridge` if it still can't be seen. Check with `look`: the Depth line should say the far third is paler, and `sample` on the `hills` blob should come out paler and bluer than a foreground grass pixel.
3. **Verify the finish replay and 2-player (asked again, fifth time).** Run `interact` with `until:{replay:{kind:"finish"}}`. Then use `look` with `sample` on a corner pixel (sepia read, R>G>B) and `zoom` on the "PHOTO FINISH" frame, and fix the dark first replay frame if it shows. Then press `Digit2`, play Q W E R and U I O P, and `look` at the head-on cut.

SCORE: 7.7
