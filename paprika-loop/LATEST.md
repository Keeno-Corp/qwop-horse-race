The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 48
**Did**
- `game.js` line 40: `LANES` widened to ±0.55/±1.65, `STAGGER` to 0/1/2/3 so the four horses overlap less in the opening frame.
- `view.js` `scene.fog`: `Fog(0xb4c6c4, 20, 130)` (was 28..170) so the far stand and billboards haze sooner.
**Saw**
- `open` + `interact` Enter then Q, with `look`: `phase:"race"`, no console errors, horses at x 0.1/1.1/2.2/3.0 are now clearly separated, all four silks and numbers read. Depth: nearest third brightness 48%, farthest third 36%. 
- No `perf` run; draw calls still ~410 (not touched).
**Next**
- Draw-call merge: `mergeStatic` runs per horse group (`groups` in `buildHorseView`, ~35 merged meshes per horse); merge across the groups that animate together, plus instance `tail` and thin `crowd`.
- Play Q+P / W+O to a human finish, check the replay, head-on cut and 2-player.
**Open**
- Draw calls unreduced (fifteenth time asked). Human finish, replay and 2-player not seen this session.

### Judge 48

**Photo Finish Fiasco, judge 48**

I ran `open`, one `interact` (Enter, then 600 frames with no input, with a `look`) and `perf` with `costs`. I did not play to a human finish, the replay, 2-player or the head-on cut, so those scores carry over.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs. `raceT` is 5.48 and the AI horses are at x 10–13.6. YOU sits at x 2.0 with `legs:"0000"`, which is correct for no input. No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session, so this carries over.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over. At 5.5 s the three AI horses are packed at x 10.3 to 13.6.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" per horse.
6. **Looks as LOOK.md says: 8.** The toon steps, outlines, orange and golden palette, `div#crt` and `crowd` read well. The "GOLDEN HOOF OATS" billboard is crisp. The grandstand still takes about half the frame, and the far hills are hazed only lightly. The lower-left black rectangle from the earlier restyle fault is gone.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The diamond, stripe, polka-dot and chevron silks, the numbers, hooves, eyes, manes, blinkers and bridle all show. The player's spotted horse is cut at the left edge of the frame.
9. **Broadcast overlay: 9.** `div#tote` has odds (3-1, 3-1, 20-1, 1-2) and silks. `div#lower` has the Walt Dunmore line "THE DUST IS FLYING OUT THERE AT THE FIASCO STAKES." The LIVE bug, 3:58 PM clock, "RACE TIME 5.5s", progress bar, `div#keys` and `div#tips` are all present.
10. **Camera: 7.** The side-track follows the AI pack, so a trailing player ends up half cut off at the left edge. The head-on cut and replay cams were not seen.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds.

**Faults: 6.**
- `perf` shows 411 draw calls and 141k triangles. The 201 ms frame is SwiftShader at host load 2.3, so it is not a budget signal. The draw-call count is the fault.
- `hills` is "Never visible" in the plain `look`, probably because `postpass-quad` covers it.
- No console errors were seen.

**Next:**
1. **Draw calls (asked again, sixteenth time).**
   - Merge `merged` (142 calls) and `Mesh` (59) by material across the horses, not per group. Merge `merged-outline` (45) and `mesh-outline` (18) the same way.
   - Instance `tail` (16), and cut `crowd` triangles (47.9k) with fewer or simpler spectators.
   - `perf` with `costs` should show under 250 draw calls.
2. **Play to a finish (asked again).**
   - Run `interact` with alternating Q+P and W+O `until` `{"horses.2.finished":true}`, with `max` 3000.
   - Then press `Digit2` and play Q W E R against U I O P.
   - Take a `look` of the sepia replay with `sample` at two frames to show grain and flicker, and confirm the head-on cut doesn't crop a far-behind player.
3. **Camera framing a trailing player.**
   - Frame the camera on the pack's weighted centre with the human always included, or zoom out or pan wider when YOU trails by more than about 6 m.
   - A `look` at `raceT` ≈ 5 with no input should show YOU's whole horse inside the frame (it is cut at the left edge now).

SCORE: 7.8
