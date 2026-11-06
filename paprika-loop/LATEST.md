The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 46
**Did**
- `broadcast.js` `render`: set `scn.fog = scene.fog` each frame so the harness's last-rendered scene (the composite `scn`) carries the game's fog.
**Saw**
- `look` no longer prints the "no fog" Depth fault. `look target:"hills"` now works (560×39×330, drawn in four views). The plain `look` still lists `hills` as "Never visible" (hidden behind `postpass-quad`, a tool artifact; the ridge is drawn). No console errors. No perf run.
**Next**
- Draw calls (~410): merge `merged`/`mesh-outline` by material, instance `tail`, cut `crowd` triangles (47.9k).
- Play Q+P / W+O to a human finish; look at replay, head-on cut and 2-player.
**Open**
- Fog still has to be judged from the picture; the tool's scene pick is a workaround, not a render change.

### Judge 46

**Photo Finish Fiasco, judge 46**

I ran `open`, one `interact` (Enter, 300 frames, then Q, P, W and O, with a `look`) and `perf` with `costs`. I did not play to a finish, the replay, 2-player or the head-on cut. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs. YOU responds to the keys (`legs:"0010"`), and `div#keys` shows O lit. No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over.
5. **Results with most face-plants award: 9.** `div#tote` shows "FACE-PLANTS 0" per horse.
6. **Looks as LOOK.md says: 8.** Toon steps, outlines, the orange and golden palette, `div#crt` and `crowd` read well. The "TOP-CAT TIRES" billboard and the number 10 marker are crisp. A strip of hills and sky shows above the stand roof. The stand still fills most of the frame, and the haze is subtle.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The saddle cloths show numbers 3 and 4, and the polka-dot horse has a white coat. Hooves, eyes, manes, blinkers and bridle are present.
9. **Broadcast overlay: 9.** `div#tote` has odds and silks. `div#lower` has the Hank "Hoofbeat" Pruitt line "AND THEY'RE OFF, FOLKS!". The LIVE bug, 3:58 PM clock, "RACE TIME", progress bar, `div#keys` and `div#tips` are all there.
10. **Camera: 8.** The side-track telephoto frames the horses well, but horses crop at the left edge. The head-on cut and replay cams were not seen.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds.

**Faults: 6.**
- `hills` is still "Never visible" in the plain `look`. The tool reads it as hidden behind `postpass-quad`, and `look target:"hills"` works.
- `perf` shows 410 draw calls and 141k triangles. The 204 ms frame is SwiftShader at host load 1.8, so it is not a budget signal.
- No console errors were seen.

**Next:**
1. **Draw calls (asked again, thirteenth time).**
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
3. **Depth and framing.**
   - Make the far stand and billboards paler toward the haze, so far objects read at least 15% lighter than near ones.
   - Pull the telephoto back or shift it so the leading horses aren't cut at the left edge.
   - `look` `sample` at a far billboard and a near one should show the far one paler.

SCORE: 7.9
