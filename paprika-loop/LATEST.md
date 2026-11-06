The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 39

**Photo Finish Fiasco, judge 39**

I made three calls: `open`, one `interact` (240 frames, then Q, P, W and O) with a `look`, and `perf` with `costs`. I did not re-run the replay, the finish, 2-player or the head-on cut this session. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The countdown reaches `phase:"race"`, the "GO!" pop shows, and YOU responds to the keys (`legs:"0010"`, `pitch:-0.19`, `div#keys` lit). No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over from judge 37. Grain and flicker are still not shown in a still.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over from judge 37, which saw 0.13 s and 0.19 s margins twice.
5. **Results with most face-plants award: 9.** Carried over ("DIRT EATER · MOST FACE-PLANTS" badge).
6. **Looks as LOOK.md says: 7.** Toon steps, thick outlines, an orange and golden palette, `div#crt` over `postpass-quad`, `crowd`, billboards ("TOP-CAT TIRES", "HOOF OATS") and a numbered "10" marker all read well. Depth does not read. `look` reports "Far objects are no lighter or paler than near ones, and there is no fog". `hills` is still "Never visible" (560 units, "in view" but no pixel) for the fourth session.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored, and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** Barrel bodies, white socks, dark hooves, big round eyes, bristly manes, blinkers and bridle, and saddle cloths with stripes, polka dots and a "4" on a yellow-black cloth all show.
9. **Broadcast overlay: 9.** `div#tote` shows the odds with silks, `div#lower` shows "HANK "HOOFBEAT" PRUITT" with a live line, and the LIVE bug, 3:58 PM clock, "RACE TIME 0.7s" and progress bar are all there.
10. **Camera: 8.** The side-track telephoto reads well. The head-on cut and replay cams were not seen this session.
11. **Controls feel learnable: 7.** The `div#tips` text is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is shown. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds, but depth is flat.

**Faults: 6.**
- `perf` shows 411 draw calls and 149k triangles, unchanged for eight sessions. The 186 ms frame is SwiftShader at host load 3.0, so it is not a budget signal.
- `hills` has not appeared in four sessions, so the two height edits (iterations 38 and 39) did nothing visible.
- No console errors were seen.

**Next:**
1. **Depth: add fog and fix `hills` (asked again).** Add `scene.fog = new THREE.Fog(0xb4c6c4, 25, 160)` or a similar haze, and make the far materials fog-aware. Check that the `hills` material takes `fog` and sits behind the grandstand at a z where the telephoto cam can see it. If the cam never sees it, move it up and in front of the roof line, or stop sizing it by guesswork. Use `look` with `cameras` including a high camera to find where the pixels are. `look` should then no longer list "Far objects are no lighter or paler", and `hills` should leave "Never visible". `sample` at about [1150, 150] should come out paler and bluer than the grass.
2. **Draw calls (asked again, eighth time).** Merge `merged` (142) and `Mesh` (59) by material across the horses, and merge `merged-outline` (45) and `mesh-outline` (18). Instance `tail` (16 calls). Trim `dust` (8.4k triangles) and the `crowd` triangles (47.9k, 4 calls already). `perf` with `costs` should show under 250 draw calls.
3. **Play both inputs to a finish.** `interact` with an alternating Q+P / W+O loop `until` YOU shows `finished:true`. Then `Digit2` and play Q W E R against U I O P. This shows the human finish, the head-on cut and a face-plant replay. Also take one `look` of the sepia replay with `sample` on a few pixels at two frames, to show grain and flicker.

SCORE: 7.7

## Iteration 40
**Did**
- Found `game.js` line 37 overwrote `view.js`'s `scene.fog` with a weaker haze (70–330) on every load. Deleted that line. `view.js` `scene.fog` is now `Fog(0xb4c6c4, 28, 170)`.
**Saw**
- `look` after 400 frames: the page loads and the race runs (`phase:"race"`, 4 horses `state:"run"`), no console errors. `look` still says "Far objects are no lighter or paler than near ones, and there is no fog" (nearest third 49%/61%, farthest 50%/62%). `hills` is still "Never visible". No `perf` run.
**Next**
- Find out why fog has no effect: check whether the `mergeStatic` materials, `toon()` or the postpass shader take fog, and whether a custom toon ShaderMaterial ignores it. Try a `look` with a high camera to find `hills`.
- Draw calls (~411): merge `merged`/`Mesh`/outlines by material, instance `tail`.
- Play both inputs to a finish.
**Open**
- Fog fix not confirmed visible; the look's depth line is unchanged.
