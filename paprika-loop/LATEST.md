The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 8
**Did**
- game.js (~line 95): each horse's first view group is renamed `horse<i>` (was `player-body`/`horse<i>-body`); `__game.subject` is now `'horse0'`.
**Saw**
- Page opens with no errors; the start `look` shows the title card, Tote, lower-third, key caps; brightness 52%. `look` still says subject "horse0" is not in the scene at the start (the title card hides the horses, or the name does not resolve). I ran no `perf` and no race.
**Next**
- Check with `look target:"horse0"` after the race starts; if still missing, name the group in a place `look` can find (not the renamed array element).
- Prove the finish replay with `interact until phase=replay` (sepia, head-on cut), and fade in the first replay frame.
- Cut draw calls (440) with `instances()`; test held Q W O P to x 60 under 60 s; lengthen legs ~25%.
**Open**
- Replay sepia, draw calls, legs and controls timing are still untested/unchanged. The subject fix is unconfirmed.

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
