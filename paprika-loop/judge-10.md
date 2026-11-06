**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 7.** The countdown ran, then held Q+P and W+O took the race to `raceT` 3.5 s. All four horses are at x 5.3–6.5. The `Tote`, `div#keys`, the `1 PLAYER` / `2 PLAYERS (2)` / `RESTART` buttons and the `div#tips` footer are all there. I did not run a full 60 m.
2. **Rapier ragdoll, face-plant, auto-right: 7.** After my alternation, `YOU` went to `state:"down"` with `plants:1` and pitch -0.30. A "FACE-PLANT! Nose-first for YOU!" pop-up appeared and the `Tote` shows "FACE-PLANTS 1 - OUCH". The AI horses stayed in `run`. I did not time the auto-right.
3. **Replay and sepia photo finish: 6.** Not reached again. I still have not seen the sepia frame myself.
4. **Photo finish and tangle within a minute: 6.** Not re-checked. All three AI horses were still running with 0 plants at 3.5 s.
5. **Results with most face-plants award: 6.** Not reached. The per-horse `FACE-PLANTS` counter is live in the `Tote`.
6. **Looks as LOOK.md says: 8.** The horses have flat toon steps and dark outlines. The picture is warm orange and yellow with a wooden grandstand, `TOP-CAT TIRES` boards and a CRT grade. The legs now read as long and jointed. `look` found no fog fault, and I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 7.** `observe`/`interact` state works, assets are 0.32 MB with fonts vendored, and there are no console errors. `look` still reports `horse0` as showing 0 of its 3 named parts, because the post-pass `Mesh` covers 100% of the frame.
8. **Horses match CHARACTERS.md and horse.png: 8.** The picture shows round googly eyes, a bridle, a saddle cloth with a number roundel and a diamond, white socks and dark hooves. A bristly mane and tufted tail are visible. The legs are longer than last iteration. The blinker silks are still tiny.
9. **Broadcast overlay: 9.** The `Tote` shows silks chips and `WIN ODDS` (YOU at 10-1, others 3-1/2-1). The `HANK "HOOFBEAT" PRUITT` lower-third is on screen, with the `LIVE` bug, the `3:58 PM` clock, `RACE TIME 3.5s`, the progress bar and the `div.pop` banner.
10. **Camera: 7.** The telephoto side-track is clear with the stands behind it. I did not see the head-on cut or the replay cams.
11. **Controls feel learnable: 6.** Alternation moves the horse and one mistimed phase gave a face-plant. The 60 m finish is unproven, and iteration 10 estimates it at ~16 s with the longer legs.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the `2 = TWO PLAYERS` footer are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The overlay, `Tote`, key caps and CRT read as one 70s broadcast. I did not run `reference` against `LOOK-board.png`.

**Faults: 5.**
- `perf` shows **435 draw calls** and 183,974 triangles (`scene` pass 434 calls, unchanged for three sessions). The frame time (178 ms) is a software renderer on host load 2.6, so it is noise, but the draw count is a real fault.
- Unnamed `PlaneGeometry` pairs share y = 0.09 (2 more pairs out of view).
- `div#crt` covers 100% of the canvas.
- `horse0` is not measurable as a subject, and `hills` is listed as never visible.
- No console errors.

**Next:**
1. **(asked again) Cut draw calls from 435 to under 250.** Merge `merged` and `merged-outline` by material across all horses, and use `instances()` for `posts` and the ad boards. Run `perf` with `costs:true`. It is done when the total is under 250 and `merged` is under about 40 calls.
2. **Make `horse0` measurable and enlarge the blinker silks.** Name the horse's body, legs and head meshes so `look target:"horse0"` lists them, and set the post-pass quad `Mesh` to a name or flag the ID image can skip. Scale the blinker silk patches up about 2×. It is done when `look target:"horse0"` shows the pattern on the blinkers and `Subject` no longer says 0 of 3 parts.
3. **(asked again) Show the finish, replay and results.** Play a no-input solo race with `interact` `until: {phase: "finish"}`, then `look`, to see the sepia `PHOTO FINISH` replay and the results screen with the face-plants award. Fix the y = 0.09 plane pairs (offset each lake `glint` by i×1e-4) in the same pass. It is done when `look` shows the sepia grain and frame, and the Surfaces line is gone.

SCORE: 6.9
