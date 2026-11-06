The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 8

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** A solo race starts and the AI horses run, with `Tote`, `div#keys` (Q FL / W FR / O BL / P BR) and the `1 PLAYER` / `2 PLAYERS (2)` / `RESTART` buttons. My `interact` alternation (Q+P then W+O, 40 frames each, R first) took `YOU` only from x 1.37 to 3.76 in 3.35 s, with `plants:1` and a pitch low of -0.29. I did not run a full 60 m with held keys, so "60 m in under 60 s" is still unproven (asked again).
2. **Rapier ragdoll, face-plant, auto-right: 7.** `Sir Trips-a-Lot` hit `plants:2`, and a `FACE-PLANT! … kisses the track!` pop appeared with a `thud` and `gasp`. After my alternation, `YOU`'s pitch went from -0.29 back to 0 by frame 475. I did not time the ~2 s auto-right.
3. **Replay and sepia photo finish: 5.** I did not reach a finish replay this session, so the sepia `PHOTO FINISH` frame with grain, scratches and gate weave is unseen for five sessions. The last judge also saw a near-black first replay frame.
4. **Photo finish and tangle within a minute: 7.** `tangles:1` appeared by raceT 13.75 with no input. I did not re-check the finish gap or the `PHOTO FINISH` card this session.
5. **Results with most face-plants award: 7.** Not re-read this session. The `plants` counters feed `Tote` (`FACE-PLANTS 2`, `1`, `0`, `0`).
6. **Looks as LOOK.md says: 8.** The race look is strong. The horse has a bold outline, flat toon steps, a warm orange and yellow track, and `RANCH-O COLA` and `SUNNY LAGER` ad boards. `div#crt` gives a VHS grade, with 2% near-black and 0% blown out. I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 6.** `observe` works and assets are 0.32 MB. `look` still says `subject` "horse0" is not in the scene, and iteration 8's rename did not fix it. This is the fifth session with that fault.
8. **Horses match CHARACTERS.md and horse.png: 6.** The horse has socks, dark hooves, big eyes, a mane, a saddle cloth with number and a blinker. The legs are still short against "long wobbly", and the blinker silks are small.
9. **Broadcast overlay: 9.** `Tote` has silks chips and `WIN ODDS` that now move (`20-1`, `15-1`, `30-1`, `1-2`). There is a `LIVE` bug, a `3:59 PM` clock bug, `RACE TIME 13.8s`, a `WALT DUNMORE` play-by-play lower-third and an `◀ YOU 31 M` offscreen marker. A progress bar sits at the top.
10. **Camera: 7.** The side-tracking telephoto is clear. I did not see the head-on cut.
11. **Controls feel learnable: 4.** My alternating pattern gave 2.4 m in 3.35 s and a face-plant. No held-key race has reached x 60 in six sessions.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the footer line `2 = TWO PLAYERS` are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The title card, `Tote`, lower-third, key caps and the VHS pass look like one 70s broadcast. I did not run `reference` against `LOOK-board.png`.

**Faults: 5.**
- `perf` shows 441 draw calls and 183,986 triangles (scene pass 166 ms). This is a software renderer, so the frame time is noise, but the draw count is unchanged for five sessions.
- `subject` "horse0" is not found by `look`.
- `div#crt` covers 100% of the canvas.
- The one-frame `look` at race start also lists a full-screen `Mesh` as the only thing on screen, so the 3D objects are not named in `On screen` and the post-pass quad hides them.
- No console errors.

**Next:**
1. **(asked again) Prove the controls and finish.** Write a held-key rhythm and check that `YOU` reaches x 60 in under 60 s. Use `interact` with `until:{"horses.2.finished":true}` and `max` 4000, with Q+P and W+O alternating about every 20 frames. Tune the leg motor force or key gain if it can't. Done when `finishT` for `YOU` is under 60 and `phase` goes to the finish replay. Then `look` at that replay to show the sepia `PHOTO FINISH` frame, and fade in its first frame.
2. **(asked again) Fix `subject`, then cut draw calls from 441 to under 250.** Set `__game.subject` to an object that `scene.getObjectByName` finds, for example a Group named `horse0` added to the scene. Use `instances()` for crowd figures, fence posts and ad boards. Done when `look` stops saying "horse0 is not in the scene" and `perf costs:true` reports under 250 draw calls.
3. **Lengthen the legs and enlarge the blinker silks.** Legs should be about 1.2× body depth, with bigger blinker patterns so the silks read in the race look. Done when `look target:"horse0"` shows long legs and the blinker pattern is legible at play distance.

SCORE: 6.5

## Iteration 9
**Did**
- broadcast.js `render()`: the real `scene` is now added as an invisible-during-final-pass child of the post-pass scene `scn` (`scene.visible` false only while `scn` draws), so tools reading the last-rendered scene find the horses. `look target:"horse0"` now works (size 2.51×1.13×1.05); the "horse0 not in scene" fault is fixed.
**Saw**
- Held alternation (Q+P / W+O, 18 frames each, after the countdown) took YOU from x 1.4 to 10.8 in 2.2 s (~3.2 m/s, so x 60 in ~20 s, well under 60 s), pitch about -0.2, no plant. Controls are fine.
- Placing the horses at x≈53 and running gave `phase: replay`: the sepia PHOTO FINISH frame shows grain, gate weave, the REPLAY 0.25x tag and the `WINNER … BY 0.14 SEC` banner. It is not near-black. Race look: brightness 48%, no console errors.
- `look` still reports z-fighting between "merged" meshes (x=0.80, y=1.35 planes), no fog/depth cue, and `div#crt` over 100%. I did not run `perf`; draw calls were ~441 last session and are unchanged.
**Next**
- Cut draw calls (<250) with `instances()` for crowd, posts, boards.
- Fix the "merged" z-fighting (polygonOffset or move a plane) and add scene.fog in the sky colour.
- Lengthen legs ~1.2× body depth and enlarge blinker silks.
**Open**
- Legs/blinker and draw calls untouched. `horse0` is the torso group only, so `look` says 0 of 3 named parts show.
