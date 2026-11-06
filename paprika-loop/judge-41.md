**Photo Finish Fiasco, judge 41**

I made three calls: `open`, one `interact` (Enter, 400 frames, then Q and P, with a `look`), and `perf` with `costs`. I did not run the replay, the finish, 2-player or the head-on cut. Those scores carry over from earlier verdicts.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `phase:"race"` runs. YOU responds to Q and P (`legs:"0001"`, `div#keys` shows P lit). No human finish has been seen.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0`. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Carried over.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Carried over.
5. **Results with most face-plants award: 9.** Carried over. `div#tote` shows "FACE-PLANTS 0" per horse.
6. **Looks as LOOK.md says: 7.** Toon steps, outlines, the orange and golden palette, `div#crt`, `crowd` and the billboards ("ZENITH", "…OF OATS", "TOP-CAT TIRES") read well. The backdrop is still a flat tan wall behind the stand. `hills` is still "Never visible (560 units, in view)". This is the sixth session in a row with that fault.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** Barrel bodies, white socks, dark hooves, big round eyes, bristly manes, blinkers and bridle, and saddle cloths with diamonds, polka dots and a "4" on a stripe all show.
9. **Broadcast overlay: 9.** `div#tote` has odds and silks, `div#lower` has the Hank "Hoofbeat" Pruitt line, and the LIVE bug, 3:58 PM clock, "RACE TIME", progress bar and `div#keys` are all there.
10. **Camera: 8.** The side-track telephoto reads well. The head-on cut and replay cams were not seen.
11. **Controls feel learnable: 7.** `div#tips` is clear, but no human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button is visible. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. The distance is still flat.

**Faults: 6.**
- `hills` has now missed four edits (iterations 38 to 41). The 41 changes (ramp from z -65, fog on) had no visible effect.
- `perf` shows 410 draw calls and 141k triangles. `crowd` casts no shadows now (0 casting, down from 8k). The 237 ms frame is SwiftShader at host load 2.3, so it is not a budget signal.
- No console errors were seen.

**Next:**
1. **`hills` (asked again).** Run `look` with `cameras` [{position:[30,40,60], lookAt:[30,0,-80]}] to see where `hills` really sits. Then `look` with `target:"hills"`. The telephoto may look over or past it, or the grandstand and the tan back wall may cover it. Move it above the stand's roofline, or add a painted hills strip to `sky`. Done when `hills` leaves "Never visible" and `sample` at [640,60] reads a hill colour, not the tan wall.
2. **Draw calls (asked again, tenth time).** Merge `merged` (142 calls) and `Mesh` (59) by material across the horses. Merge `merged-outline` (45) and `mesh-outline` (18). Instance `tail` (16). Trim `dust` (8.4k triangles). `perf` with `costs` should show under 250 draw calls.
3. **Play both inputs to a finish.** Run `interact` with an alternating Q+P and W+O loop `until` `{"horses.2.finished":true}`, with `max` 3000. Then run `Digit2` and play Q W E R against U I O P. Take one `look` of the sepia replay with `sample` at two frames to show grain and flicker.

SCORE: 7.7
