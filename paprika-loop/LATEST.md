The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 44

**Photo Finish Fiasco, judge 44**

I ran `open`, one `interact` (Enter, 300 frames, then Q and P, with a `look`) and `perf` with `costs`. I did not play to a finish, the replay, 2-player or the head-on cut. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs, YOU responds to Q and P (`legs:"0001"`), and `div#keys` shows P lit. No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" per horse.
6. **Looks as LOOK.md says: 7.** Toon steps, outlines, the orange and golden palette, `div#crt`, `crowd` and the billboards ("TOP-CAT TIRES", "GOLDEN HOOF OATS") read well.
   - The camera pitch change helped: a strip of green hills and haze sky now shows above the stand roof.
   - `look` still reports no depth, because there is no `scene.fog` (far third of objects 33% brightness against 46% near) and it lists `hills` as "Never visible".
   - The stand still fills most of the frame.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** Barrel bodies, white socks, dark hooves, big eyes, manes, blinkers and bridle, and saddle cloths with a diamond and numbers 2 and 4 all show.
9. **Broadcast overlay: 9.** `div#tote` has odds and silks, `div#lower` has the Hank "Hoofbeat" Pruitt line, and the LIVE bug, 3:58 PM clock, "RACE TIME", progress bar and `div#keys` are all there.
10. **Camera: 8.** The side-track telephoto now frames horses, stand and a strip of sky well. The head-on cut and replay cams were not seen.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds and the depth strip is better. Depth is still flat.

**Faults: 6.**
- `hills` is "Never visible" in `look` even though it is drawn. The painted ridge shows in the picture.
- `perf` shows 410 draw calls and 141k triangles, with `crowd` at 47.9k triangles. The 198 ms frame is SwiftShader at host load 2.0, so it is not a budget signal.
- No console errors were seen.

**Next:**
1. **Depth (asked again).**
   - Add `scene.fog` in the haze colour, or lighten the far stand and billboard colours toward haze. The `Depth:` line should then show far objects paler than near.
   - If `hills` stays "Never visible", check its material and ID pass: it is probably a `ShaderMaterial` or a `depthWrite` setting.
   - It is done when `look` `target:"hills"` shows it and the `Depth:` line no longer says "no fog".
2. **Draw calls (asked again, twelfth time).** Merge `merged` (142 calls) and `Mesh` (59) by material across the horses. Merge `merged-outline` (45) and `mesh-outline` (18). Instance `tail` (16). Cut `crowd` triangles (47.9k). `perf` with `costs` should show under 250 draw calls.
3. **Play both inputs to a finish (asked again).**
   - Run `interact` with an alternating Q+P and W+O loop `until` `{"horses.2.finished":true}`, with `max` 3000.
   - Then press `Digit2` and play Q W E R against U I O P.
   - Take a `look` of the sepia replay with `sample` at two frames to show grain and flicker. Also check that a far-behind player is not cropped by the new telephoto pitch.

SCORE: 7.7

## Iteration 45
**Did**
- No code change. Traced the judge's "no `scene.fog`" fault: `view.js` `buildEnvironment` already sets `scene.fog = new THREE.Fog(0xb4c6c4, 28, 170)` (since the first restyle), and `hills` uses `MeshToonMaterial` with `fog: true`.
**Saw**
- `eval` in the harness: `scene.children.length` is 2 and `scene.fog` is null. The harness's `scene` is the post-process composite scene in `broadcast.js` (`scn` with a full-screen `quad`), not the game's `scene` (`game.js:27`). That is why `look` reports "no fog" and `hills` "Never visible": it inspects the wrong scene. The game's fog and hills are real.
- No perf run, no console errors seen.
**Next**
- Make the harness see the real scene: render the game scene last to the screen (or draw the composite without a separate `Scene`), or expose `window.scene`/`__game.scene` if the tool honours it. Then recheck `Depth:` and `hills`.
- Draw calls (~410): merge `merged`/`mesh-outline` by material, instance `tail`, cut `crowd` triangles (47.9k).
- Play both inputs to a human finish; look at replay and 2-player.
**Open**
- Fix for the tool's scene pick is untested. Head-on and replay cams unchecked.
