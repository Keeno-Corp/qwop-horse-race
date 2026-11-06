The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 47
**Did**
- `game.js` `updateCamera` (side-track branch): look target moved from `fx + 2.0` to `fx + 1.0` so the horses sit further right in frame and crop less at the left edge.
**Saw**
- No `look`/`perf` run this session; the change is one number and unverified by picture.
**Next**
- `look` to confirm the left crop is gone; then the draw-call merge (`merged`, `mesh-outline`, instance `tail`, thin `crowd`).
- Play Q+P / W+O to a human finish; look at replay, head-on cut, 2-player.
- Paler far stand and billboards toward the haze.
**Open**
- Draw calls (~410) still not reduced; camera shift not seen.

### Judge 47

**Photo Finish Fiasco, judge 47**

I ran `open`, one `interact` (Enter, 300 frames, then Q and P, with a `look`) and `perf` with `costs`. I did not play to a finish, the replay, 2-player or the head-on cut. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs with `raceT` 1.07. YOU's legs read `"0001"` after Q then P, and `div#keys` lights P. No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" per horse.
6. **Looks as LOOK.md says: 8.** Toon steps, outlines, the orange and golden palette, `div#crt` and `crowd` read well. The "GOLDEN HOOF OATS" billboard is crisp. The stand still fills most of the frame. The far third of objects is only slightly paler than the near third (brightness 32% against 48%).
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The saddle cloths show numbers 3 and 4, and the diamond, stripe and polka-dot silks show. Hooves, big eyes, manes, blinkers and bridle are present. The horses are packed tightly together.
9. **Broadcast overlay: 9.** `div#tote` has odds and silks. `div#lower` has the Hank "Hoofbeat" Pruitt line "AND THEY'RE OFF, FOLKS!". The LIVE bug, 3:58 PM clock, "RACE TIME", progress bar, `div#keys` and `div#tips` are all there.
10. **Camera: 8.** The `fx + 1.0` look-target shift worked. The pack now sits in the left-centre and only the rearmost horse's tail is cut at the left edge. The head-on cut and replay cams were not seen.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds.

**Faults: 6.**
- `perf` shows 410 draw calls and 141k triangles. The 190 ms frame is SwiftShader at host load 2.5, so it is not a budget signal.
- `hills` is "Never visible" in the plain `look`. The tool reads it as hidden behind `postpass-quad`, and `look target:"hills"` works.
- No console errors were seen.

**Next:**
1. **Draw calls (asked again, fourteenth time).**
   - Merge `merged` (142 calls) and `Mesh` (59) by material across the horses.
   - Merge `merged-outline` (45) and `mesh-outline` (18).
   - Instance `tail` (16).
   - Cut `crowd` triangles (47.9k) with fewer or simpler spectators.
   - `perf` with `costs` should show under 250 draw calls.
2. **Play both inputs to a finish (asked again).**
   - Run `interact` with an alternating Q+P and W+O loop `until` `{"horses.2.finished":true}`, with `max` 3000.
   - Then press `Digit2` and play Q W E R against U I O P.
   - Take a `look` of the sepia replay with `sample` at two frames to show grain and flicker.
   - Check that the head-on cut doesn't crop a far-behind player.
3. **Depth and haze (asked again).**
   - Make the far stand and billboards paler toward the haze, so far objects read at least 15% lighter than near ones.
   - A `look` with `sample` at the far stand and a near billboard should show the far one paler.
   - Spread the start positions so the four horses overlap less in the opening frame.

SCORE: 7.9
