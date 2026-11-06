The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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

### Judge 40

**Photo Finish Fiasco, judge 40**

I made four calls: `open`, one `interact` (400 frames, then Q and P, with a `look`), and `perf` with `costs`. I did not re-run the replay, the finish, 2-player or the head-on cut. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs, and YOU responds to the keys (`legs:"0001"`, `pitch:-0.21`, `div#keys` lit). No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over.
5. **Results with most face-plants award: 9.** Carried over.
6. **Looks as LOOK.md says: 7.** Toon steps, outlines, an orange and golden palette, `div#crt`, `crowd`, the billboards ("ZENITH T…", "TOP-CAT TIRES", "…OATS") and the numbered "10" marker all read well. The backdrop is flat. `hills` is still "Never visible" (560 units, "in view", 3136 triangles). This is the fifth session in a row.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** Barrel bodies, white socks, dark hooves, big round eyes, bristly manes, blinkers and bridle, and saddle cloths with stripes, polka dots and a "4" all show.
9. **Broadcast overlay: 9.** `div#tote` shows the odds with silks, `div#lower` shows the Hank "Hoofbeat" Pruitt line, and the LIVE bug, 3:58 PM clock, "RACE TIME 2.7s", progress bar and `div#keys` are all there.
10. **Camera: 8.** The side-track telephoto reads well. The head-on cut and replay cams were not seen this session.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. This look did not report the "no fog" line it reported in earlier sessions, but the distance haze is still not visible in the picture.

**Faults: 6.**
- `perf` shows 411 draw calls and 149k triangles, unchanged for nine sessions. The 203 ms frame is SwiftShader at host load 2.6, so it is not a budget signal.
- `hills` has now missed three edits (iterations 38, 39 and 40).
- No console errors were seen.

**Next:**
1. **`hills` and depth (asked again).** Run `look` with `target: "hills"` to see where it is. Then run `cameras` with a high camera, for example position [30, 40, 60] looking at [30, 0, -80]. Move `hills` to sit just behind the grandstand roof, at a height and z the telephoto frustum covers. Give it a material that takes fog. `hills` should then leave "Never visible", and `sample` at about [1150, 150] should read paler and bluer than the grass.
2. **Draw calls (asked again, ninth time).** Merge `merged` (142 calls) and `Mesh` (59) by material across the horses. Merge `merged-outline` (45) and `mesh-outline` (18). Instance `tail` (16). Trim `dust` (8.4k triangles) and `crowd` (47.9k triangles, with 8k casting shadows, so turn crowd shadows off). `perf` with `costs` should show under 250 draw calls.
3. **Play both inputs to a finish.** Run `interact` with an alternating Q+P and W+O loop `until` YOU shows `finished:true`. Then run `Digit2` and play Q W E R against U I O P. Take one `look` of the sepia replay with `sample` at two frames to show grain and flicker.

SCORE: 7.7
