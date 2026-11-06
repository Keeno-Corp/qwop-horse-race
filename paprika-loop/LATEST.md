The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 11

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 7.** A no-input solo race ran to `phase:"results"` at `raceT` 28.2 s. The race has a countdown, a `finish` and a results screen with the "PRESS R FOR ANOTHER RACE · 1 / 2 = PLAYERS" prompt. `div#keys`, the `1 PLAYER` / `2 PLAYERS (2)` / `RESTART` buttons and the footer `div#tips` are all present. I did not play a full 60 m myself.
2. **Rapier ragdoll, face-plant, auto-right: 7.** The AI horses `Sir Trips-a-Lot` (5 plants) and `Hoof Hearted` (3) have live per-horse `FACE-PLANTS` counts in the `Tote`. The sound log shows a repeating thud, gasp, boing cycle that fits the collapse and auto-right. I did not time the auto-right.
3. **Replay and sepia photo finish: 5.** The race went through `finish` to `results` within the single `until` call. The `until: {phase:"finish"}` step reported "not met" because the page jumped past it, so I never saw a replay or the sepia frame. Nothing in the `Tote` or results marks a photo finish. That makes four sessions without seeing it.
4. **Photo finish and tangle within a minute: 6.** `tangles:1` was recorded and the race ended at 28 s. Only `Dusty Rhodes` finished (21.7 s). The other two AI horses stopped 2–3 m short (DNF), so there was no close finish and no photo finish.
5. **Results with most face-plants award: 8.** The `div#results` card shows a podium, a `SMOOTH OPERATOR` tag and a red `DIRT EATER · MOST FACE-PLANTS` tag on `Sir Trips-a-Lot` (5). The card is cream with a striped silks banner and fits the 70s style.
6. **Looks as LOOK.md says: 8.** The picture is warm orange and yellow with toon-flat horses, a CRT grade, vignette and scanlines. I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 7.** `interact` state works, assets are 0.32 MB with fonts vendored, and there are no console errors. `look` reports a new fault: every render call drew into a render target, so the canvas shows an earlier frame. `horse0` still shows 0 of its 3 parts because the post-pass `Mesh` covers 100% of the frame.
8. **Horses match CHARACTERS.md and horse.png: 7.** The horse is only partly visible behind the results card. The earlier look showed socks, hooves, mane, tail and a saddle-cloth silk. The blinker silks are still tiny, and I could not verify them through the card.
9. **Broadcast overlay: 9.** The `Tote` has silks chips and `WIN ODDS`. The `PLAY-BY-PLAY · WALT DUNMORE` lower-third, the `LIVE` bug, the `4:02 PM` clock, `RACE TIME 28.2s` and the progress bar are all on screen.
10. **Camera: 6.** The telephoto side-track is clear. I saw no head-on cut or replay cams.
11. **Controls feel learnable: 6.** I made no input this time. `YOU` stayed at x 2.8, with 57 m left, because I held no keys, as expected. The 60 m finish is unproven.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the footer `2 = TWO PLAYERS` are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The overlay, `Tote`, key caps, results card and CRT read as one 70s broadcast.

**Faults: 5.**
- `perf` shows 411 draw calls (`scene` pass 410) and 184k triangles. That is down only from 435 and still far over a 250 target. The 151 ms frame is a software renderer at host load 2.5, so it is noise, but the draw count is real.
- `look` reports that the last frame drew only into a render target and none to the screen. Check for a missing `setRenderTarget(null)` in the post pass.
- `div#crt` covers 100% of the canvas.
- `hills` is listed as never visible.
- There are no console errors.
- The unnamed `PlaneGeometry` y = 0.09 Surfaces line did not appear this time, so the lake fix seems to have worked.

**Next:**
1. **Make the photo finish happen and show it.** Do this in the AI tuning: the two trailing AI horses (`Sir Trips-a-Lot`, `Hoof Hearted`) quit 2–3 m short while the leader wins by a big margin, so there is nothing close to photograph. Keep the AI horses within about 0.3 s of each other near x=60 and make them recover from face-plants. Then use `interact` with `until: {phase:"replay"}` or the page's replay-phase name, since `finish` is skipped, followed by `look`. It is done when `look` shows the sepia grain, scratches and the "PHOTO FINISH" frame and `observe` lists two horses with `finishT` within ~0.3 s.
2. **(asked again) Cut draw calls from 411 to under 250.** Merge the horses' `merged` and `merged-outline` groups per horse by material, use one atlas texture for the 18 sponsor `labelPlane`s, and instance the 16 `tail` meshes and the `posts`. Run `perf` with `costs:true`. It is done when the total is under 250.
3. **Fix the render-target fault, then make `horse0` measurable.** Call `setRenderTarget(null)` at the end of the post pass so `look` stops reporting the stale canvas. Name the horse body, legs and head meshes and flag the post-pass quad `Mesh` so the ID image can skip it. Enlarge the blinker silks 2×. It is done when `look target:"horse0"` lists its parts and the "Last frame … render target" line is gone.

SCORE: 6.8

## Iteration 12
**Did**
- No code change. I checked the photo finish, the judge's top Next item, by playing a no-input solo race with `interact`.
**Saw**
- The race reached `replay.kind:"plant"` at raceT 7.6 (`tangles:1`). `look` showed the instant replay: three horses side by side, the "INSTANT REPLAY · 0.25x" tag and "SPACE to skip".
- It then reached `replay.kind:"finish"`. `look` showed the sepia grain, scratches, film-strip border, "PHOTO FINISH" banner and the "WINNER: Hoof Hearted · BY 0.05 SEC · HOLD ALL TICKETS" strip. Two horses finished 0.04 s apart (22.03 and 22.07). So the photo finish exists and works; the `until: {phase:"finish"}` step in the earlier session missed it because the phase is named `replay`. Use `until: {"replay.kind":"finish"}`.
- `Sir Trips-a-Lot` (6 face-plants) was still at x 33.9 at raceT 28.6, so one horse still doesn't finish.
- `look` still reports the post-pass `Mesh` at 100%, so `horse0` shows 0 of 3 parts. `broadcast.js:95-97` already calls `setRenderTarget(null)`, so the "render target" warning was not seen this time. Draw calls were not re-measured (last 411).
**Next**
- Draw calls 411 to under 250: merge the horse `merged` groups per horse, one atlas for the 18 sponsor `labelPlane`s, instance the 16 `tail` meshes.
- Name the horse parts and flag the post-pass quad so `look target:"horse0"` works. Enlarge the blinker silks 2×.
- Let a fallen AI horse recover sooner (the 6-plant one stalls at x 34).
**Open**
- The draw-call goal is unmet. The human horse `YOU` was never driven in this session, so the 60 m finish by hand is still unproven.
- Note: `look`'s "PlaneGeometry covers 100% with dense fine detail" is the post-pass quad during the photo-finish replay. The sepia film grain is the intended look, so I left it. If a later judge counts it as a fault, lower the grain amplitude in `broadcast.js`.
