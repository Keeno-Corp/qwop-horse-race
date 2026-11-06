The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 37

The replay is verified. The finish replay now fires after the first finish plus 4.5 s.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The countdown leads into `phase:"race"` at frame 277. `R` restarted the race. `div#keys`, `div#tips` and the "1 PLAYER / 2 PLAYERS (2) / RESTART" buttons show, and `div#off2` ("◀ YOU 55 m") tracks YOU. I pressed no leg keys, so the loop and the finish by a human are still unchecked.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** Sir Trips-a-Lot reached `plants:5`, `state:"down"` with `pitch:3.12`, and was back to `state:"run"` later. The `div.pop` "FACE-PLANT!" and the lower-third line fired.
3. **Replay (last ~4 s, 0.25x, Space skips, sepia photo finish): 9.** `phase` went `finishing` → `replay` at frame 258 with `replay:{kind:"finish",rate:0.25,of:1300}`. The look is sepia with a film-frame border, a gate-weave edge and a vertical scratch, and shows the `div.tag` "REPLAY 0.25x", `div.cap2` "PHOTO FINISH", `div#pfc` "WINNER: Hoof Hearted · BY 0.13 SEC" and the "SPACE to skip" hint. I saw no grain or flicker in the single still. Face-plant-triggered replays were not seen.
4. **Photo finish and tangled AI collapse within the first minute: 9.** Hoof Hearted finished at 21.03 s and Dusty Rhodes at 21.16 s (`tangles:1`), with the replay at about 25 s. That is two for two, with the margin at 0.13 s in one run and 0.19 s in another.
5. **Results with most face-plants award: 9.** `div#results` shows "Hoof Hearted WINS! PHOTO FINISH · 0.19s", a podium, a "SMOOTH OPERATOR" badge and a red "DIRT EATER · MOST FACE-PLANTS" badge on Sir Trips-a-Lot, with a "DNF · 57 M SHORT" line for YOU.
6. **Looks as LOOK.md says: 8.** Toon steps, thick outlines, a warm orange/yellow palette, `div#crt` over `postpass-quad`, and `crowd`, billboards, rail and finish post. The far `hills` are still invisible in the `look` and flagged "Never visible" while in view. The background reads as flat grandstand with no distance haze.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB and the fonts are vendored. There is no network use at runtime.
8. **Horses match CHARACTERS.md and horse.png: 8.** In the replay and race looks the horses have a barrel body, white socks, oversized dark hooves, big round eyes, a bristly mane and blinkers. The saddle-cloth silks show.
9. **Broadcast overlay: 9.** `div#tote` has odds moving (2-1 → 30-1, 1-2, 6-5, WIN), silks and face-plant counts. `div#lower` has two commentators with live lines. The `LIVE` bug, the 4:00 PM clock, the RACE TIME bug and the progress bar are there.
10. **Camera: 8.** The side-track telephoto and the head-on replay cam of the finish line (the finish looks as if seen from the line, with a tower behind) both read well. I did not see the head-on cut during the race.
11. **Controls feel learnable: 7.** Unchanged. No human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and the `div#tips` line show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV and sepia replay hold up. The weak point is the missing depth on the far `hills`.

**Faults: 6.**
- `perf` shows 412 draw calls and 149k triangles, unchanged for six sessions. The 247 ms frame is SwiftShader at host load 1.4, so it is not a budget signal.
- `hills` is "Never visible" while in view, and `ridge` is never visible.
- The `until:{phase:"finishing"}` call reported "not met" even though the phase did reach `finishing`. That only affects the test harness.

**Next:**
1. **Draw calls (asked again, sixth time).** Merge the `merged` (142) and `Mesh` (59) calls by material across the horses, merge `merged-outline` (45) and `mesh-outline` (18), and instance `tail` (16). Cut `crowd` from 47.9k triangles with an InstancedMesh, and trim `dust` from 8.4k triangles. `perf` with `costs` should show under 250 draw calls.
2. **Depth (asked again).** The far `hills` are still not visible, and `ridge` is still never visible, so delete it. Check that the toon and shader materials use `fog:true` and that `postpass-quad` doesn't hide the fog. Then raise `hills` so it shows above the grandstand in the side-cam `look`. `look` with `sample` at its pixels should come out paler and bluer than the grass.
3. **Play both inputs.** `interact` with Q W O P and then `Digit2` with Q W E R and U I O P, and let YOU run so a human finish and the head-on cut show. Make sure the face-plant replay on a big plant also fires, and add grain and flicker that are visible in a `look` of the sepia replay.

SCORE: 7.9

## Iteration 38
**Did**
- `view.js`: deleted the never-visible `ridge` mesh; raised far `hills` height (`far * 12` → `far * 18`) so they should rise above the grandstand.
**Saw**
- Only `node --check view.js`; no `look`/`perf` run this session.
**Next**
- `look` side cam to confirm `hills` now shows paler/bluer; trees use hills' old height formula (12) so they may sink into the taller hills; adjust.
- Draw calls (~411): merge `merged`/`Mesh`/outlines, instance `tail`, crowd 47.9k tris.
- Play Q W O P / 2-player to see a human finish.
**Open**
- Hills change unverified visually; treeline `hY` still uses factor 12.
