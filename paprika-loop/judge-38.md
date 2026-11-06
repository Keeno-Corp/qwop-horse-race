I ran about 3 tool calls: one `open`, one `interact` with Q, P, W and O at the race start, and one `perf` with `costs`. I made no `look` of a side-cam sample, so the `hills` change was judged from the race `look` and the "Never visible" list.

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The countdown reaches `phase:"race"` and YOU (`legs:"0010"`) responds to Q, P, W and O, with `div#keys` lighting the keys. I did not run to a human finish.
2. **Real Rapier ragdoll, face-plant collapse and auto-right: 8.** All four horses show `state:"run"` with `plants:0` at 2.2 s. YOU shows `pitch:-0.46` from the mistimed keys. No collapse was seen this session.
3. **Replay (sepia, 0.25x, Space skips): 8.** Not re-run this session. Judge 37's `phase:"replay"` with `kind:"finish"` and `rate:0.25` and its "PHOTO FINISH" caption stand. Grain and flicker are still not clearly visible in a still.
4. **Photo finish and tangled AI collapse within the first minute: 8.** Not re-run. Judge 37 saw it twice (0.13 s and 0.19 s margins).
5. **Results with most face-plants award: 9.** Unchanged from 37 ("DIRT EATER · MOST FACE-PLANTS" badge).
6. **Looks as LOOK.md says: 8.** The side-cam `look` shows toon steps, thick outlines, a warm orange palette, `div#crt` over `postpass-quad`, `crowd` and billboards ("TOP-CAT TIRES", "HOOF OATS"). `hills` is still listed "Never visible" while in view. Only a small green and orange sliver shows at the right edge behind the grandstand, so depth is still missing.
7. **window.__game convention, static deploy: 9.** `index.html` is at the root, assets are 0.32 MB, fonts are vendored, and there is no runtime network use.
8. **Horses match CHARACTERS.md and horse.png: 8.** The horses show a barrel body, white socks, dark hooves, big round eyes, a bristly mane, blinkers, and saddle cloths with stripes, polka dots and a "4" on a yellow-black cloth. Both leg and hoof proportions read well.
9. **Broadcast overlay: 9.** `div#tote` shows 5-1, 3-1, 2-1 and 5-2 with silks. `div#lower` shows the "HANK HOOFBEAT PRUITT" line "AND THEY'RE OFF, FOLKS!". `LIVE`, the 3:58 PM clock, "RACE TIME 2.2s" and the progress bar are all present. The black rectangle from the restyle is gone.
10. **Camera: 8.** The side-track telephoto reads well. I did not see the head-on cut during the race.
11. **Controls feel learnable: 7.** No human finish has been seen.
12. **Local 2-player: 7.** The "2 PLAYERS (2)" button and `div#tips` show it. It was not played.
13. **Style judged as hard as gameplay: 8.** The 70s TV look holds. The weak point is the flat background with no distance haze.

**Faults: 6.**
- `perf` shows 411 draw calls and 149k triangles, unchanged for seven sessions. The 189 ms frame is SwiftShader at host load 1.9, so it is not a budget signal.
- `hills` is still "Never visible" despite the iteration 38 height raise, so that change did not work. The treeline `hY` still uses the old factor 12 (Open item from 38).
- No console errors were seen.

**Next:**
1. **Depth, `hills` (asked again, the raise did not show).** Move or raise `hills` so it sits above the grandstand roof in the side-cam `look`. Check its z against the grandstand, and that its material is not hidden by `postpass-quad`, fog or depth. Update the treeline `hY` to match. `look` with `sample` at about [1150, 150] should come out paler and bluer than the grass, and `hills` should leave the "Never visible" list.
2. **Draw calls (asked again, seventh time).** Merge the `merged` (142) and `Mesh` (59) calls by material across the horses, merge `merged-outline` (45) and `mesh-outline` (18), and instance `tail` (16). Make `crowd` (47.9k triangles) an InstancedMesh and trim `dust` (8.4k). `perf` with `costs` should show under 250 draw calls.
3. **Play both inputs to a finish.** `interact` with an alternating Q+P / W+O loop until `finished:true` for YOU, then `Digit2` with Q W E R and U I O P. This shows the human finish, the head-on cut and a face-plant replay. Also make grain and flicker visible in a `look` of the sepia replay.

SCORE: 7.9
