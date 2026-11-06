The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 9

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 7.** A solo race starts with a 3-2-1 countdown, and the held Q+P / W+O alternation moves `YOU` from x 1.42 to 4.66 in about 100 frames after the countdown. The `Tote`, `div#keys` and the `1 PLAYER` / `2 PLAYERS (2)` / `RESTART` buttons are all there. I did not run a full 60 m this session; iteration 9's ~3.2 m/s estimate stands.
2. **Rapier ragdoll, face-plant, auto-right: 7.** `YOU` pitched to a low of -0.46 at frame 148 and recovered to -0.19 by frame 177, with no `plants` count. The legs are visibly jointed in the dust-cloud picture. I did not time the ~2 s auto-right.
3. **Replay and sepia photo finish: 6.** Not reached this session. Iteration 9 reported a sepia `PHOTO FINISH` frame with grain and weave when it forced the finish, but I did not see it myself.
4. **Photo finish and tangle within a minute: 6.** Not re-checked. The fixed race-start alignment and the "0.14 SEC" banner from iteration 9 are the only evidence.
5. **Results with most face-plants award: 6.** Not reached. The `Tote` shows a `FACE-PLANTS` counter per horse.
6. **Looks as LOOK.md says: 8.** The outlined horses have flat toon steps. The track is warm orange and yellow, with `GOLDEN HOOF OATS` and `TOP-CAT TIRES` boards and a wooden grandstand. `div#crt` gives a warm VHS grade at 49% brightness. `look` finds no depth cue (no fog) and unnamed `PlaneGeometry` pairs at y = 0.09 that flicker from above. I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 7.** `observe` works, assets are 0.32 MB with fonts vendored, and there are no console errors. `look`'s `Subject` says `horse0` shows 0 of its 3 named parts, because `Mesh` (the post-pass quad) covers 89–92% of the frame.
8. **Horses match CHARACTERS.md and horse.png: 7.** The horses have a bristly mane, a tufted tail, white socks, dark hooves, big round eyes, a bridle, a saddle cloth with a number roundel and blinkers. Four distinct silks show on the tote chips (diamond, stripe, dots, band). The legs are still short against "long wobbly", and the blinker silks are small.
9. **Broadcast overlay: 9.** `Tote` has `WIN ODDS` that moved from 4-1 to 5-1 and 3-1, and a progress bar sits at the top. The lower-third switches commentators (`WALT DUNMORE` to `HANK "HOOFBEAT" PRUITT`) with new lines. The `LIVE` bug, the `3:58 PM` clock bug, `RACE TIME 1.7s`, `div#keys` and the countdown are all present.
10. **Camera: 7.** The telephoto side-track is clear, with the grandstand behind. I did not see the head-on cut or the replay cams.
11. **Controls feel learnable: 6.** The alternation moves the horse and dust particles show the gait. The 60 m finish is still unproven.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the `2 = TWO PLAYERS` footer are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The countdown numerals, `Tote`, lower-third, key caps and CRT pass read as one 70s broadcast. I did not run `reference` against `LOOK-board.png`.

**Faults: 5.**
- `perf` shows 435 draw calls and 183,974 triangles (scene pass 140 ms). The host load is 2.5 on 8 cores and this is a software renderer, so the frame time is noise, but the draw count is unchanged. `merged` is 142 draw calls, `Mesh` 97, `merged-outline` 45, and `crowd` 48k triangles in 4 calls.
- The "merged" z-fighting from iteration 9's Next is not visible in this look, but unnamed `PlaneGeometry` pairs share a face plane at y = 0.09 (2 more pairs out of view).
- `look`'s depth check says there is no fog, so depth does not read.
- `div#crt` covers 100% of the canvas.
- `look` still reports `Subject` horse0 as showing 0 of 3 parts, and the `hills` object is listed as never visible.
- No console errors.

**Next:**
1. **Cut draw calls from 435 to under 250.** Merge the `merged` groups (142 calls) and `merged-outline` (45) by material, and use `instances()` for fence posts and ad boards. In `perf costs:true`, `merged` should drop below about 40 calls and the total below 250.
2. **Make `horse0` a subject `look` can measure.** The post-pass quad `Mesh` hides all three named parts. Name the horse's body, legs and head meshes so they appear in `On screen`, and make `look target:"horse0"` show the horse with its long legs. Then lengthen the legs to about 1.2× body depth and enlarge the blinker silks. The target look should show long legs and a legible blinker pattern.
3. **Add depth fog and fix the y = 0.09 plane pairs.** Set `scene.fog` in the sky colour so the far grandstand and hills pale. Move one of each coplanar `PlaneGeometry` pair at least 1e-3 off the plane. The next `look` should drop the "no fog" and `Surfaces` lines. Then play to a finish and `look` at the results screen, so the sepia replay and the face-plant award are seen by a judge.

SCORE: 6.9

## Iteration 10
**Did**
- Lengthened legs 1.2×: physics.js `DIM.upper` 0.5→0.6, `DIM.lower` 0.55→0.66, `STAND_H` follows; view.js leg groups `u`/`l` in `buildHorseView` get `scale.y = 1.2` (mergeStatic bakes in root-local space, so the root scale applies at render).
**Saw**
- Held Q+P / W+O alternation after the countdown: YOU reached x 6.97 at race time 1.85 s, pitch -0.22, no plants, no console errors. Legs read longer and the gait still looks right in `look`. Brightness 47%, no fog fault listed (scene.fog already existed at view.js:301).
- `look` still lists y=0.09 plane pairs (lake `glint` quads vs lake disc, out of view), `div#crt` 100%, and horse0 0 of 3 parts. I did not run `perf`; draw calls are still ~435.
**Next**
- Cut draw calls (<250): merge `merged` groups across horses by material, instance posts/boards.
- Move lake glint quads to y=0.07 (lake is at 0.05, they sit at 0.09; pairs are among glints themselves, so offset each by i*1e-4).
- Enlarge blinker silks; name horse body/legs/head meshes so `look target` counts them.
**Open**
- Legs are longer so speed is higher (~3.7 m/s); a 60 m race may now finish in ~16 s, check balance. Draw calls untouched.
