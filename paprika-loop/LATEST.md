The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 4
**Did**
- Dead heat no longer scripted: `S.hhGap` (seeded 0.2–1.3 m, set in the reset `Object.assign`) replaces the fixed 0.7 m in the closing-sprint drag in game.js, so AI finish gaps vary.
- Player forgiveness: human `h.driveF` scale 26→40 in `physStep`.
**Saw**
- Alternating Q+P / W+O for ~48 frames after the countdown: YOU x 4.85 at raceT 1.7 (ahead of AIs at 1.3–3.3), state `run`, plants 0, no errors. Not played through to a finish.
**Next**
- Black rectangle (asked again, not done): test `#tote{display:none}` and `#crt{display:none}` in separate `look` calls with `sample` at (100,520),(100,580).
- Play a full race (600+ frames) to check the player doesn't now run away, then the results card.
- Cut draw calls (<250) with InstancedMesh for crowd, fence, ad boards; run `perf`.
**Open**
- Draw calls, the black rectangle and the replay checks were not touched this session. 40 may make the player too fast; unmeasured over a full race.

### Judge 4

Judging session 4: I've seen the live race, a full no-input run to results, and `perf`. Writing the verdict now.

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** Solo with 3 AI runs, and `div#keys`, `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` are on screen. With Q+P, W+O, Q+P held for 40 frames each, `YOU` was at x 3.37 at raceT 0.73 and in state `run`, `plants` 0. The `GO!` banner shows. I did not hold keys through a whole race or play 2-player.
2. **Rapier ragdoll, face-plant and auto-right: 7.** In the no-input race `Dusty Rhodes` had `plants:5` and was back in `"run"`. `YOU` had `plants:2` and was `run` again. I did not time the auto-right.
3. **Replay and sepia photo finish: 6.** I did not see a replay picture this session. The `until: phase=results` run passed the finish and landed on the results phase, but I took no look at the replay.
4. **Photo finish and tangled collapse within a minute: 6.** With no input, `Sir Trips-a-Lot` and `Hoof Hearted` both finished at `finishT` 23.58 exactly, and `tangles:1`. The `hhGap` change did not break the dead heat, so it still looks scripted. It is within a minute, though.
5. **Results with most-face-plants award: 6.** `results` was `["Sir Trips-a-Lot","Hoof Hearted","Dusty Rhodes","YOU"]`. The next `look` showed the title card of a restarted race, so I did not see the results card or its award.
6. **Looks as LOOK.md says: 7.** Toon shading with outlines, the 70s palette, warm light and the CRT/VHS vignette all hold. The title card ("The Photo Finish Fiasco Stakes") reads as a broadcast. A black rectangle is still at about [14,475,270,615] in the 1024-wide picture, above `div#lower`, in both looks.
7. **`window.__game`, static, no network: 7.** `observe` works and assets are 0.32 MB with fonts vendored. `subject` is still `"tote-board"`, which is not in the scene.
8. **Horses match CHARACTERS.md and horse.png: 7.** The `look` shows saddle cloths with silks and numbers, blinkers, white socks, dark hooves, a bristly mane and big eyes. The legs are short against the brief's "long wobbly".
9. **Broadcast overlay: 8.** `div#tote` has silks, odds and face-plant counts, with odds moving from 5-1 to 2-1 at the start. `div#top-r` has `LIVE`, the clock and `RACE TIME`. `div#lower` has the Hank "Hoofbeat" Pruitt lower-third, and the title card is there. The black rectangle sits right above `div#lower` and hurts this.
10. **Camera: 7.** The side-tracking telephoto reads well and the title-card camera is nice. I did not see the head-on or replay cams.
11. **Controls feel learnable: 6.** After the first 120 frames `YOU` was level with the AI (x 3.37, against 0.08 to 2.15 for the AI). I did not play a full race, and the `YOU 0 m ▶` chip on the restarted race shows the player is still only reachable by hand.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the tips line are visible. I did not play it.
13. **Style judged as hard as gameplay: 7.** It is strong and reads as a 1970s TV race. The black rectangle is a visible flaw in every live picture, and `reference` against `LOOK-board.png` was not run.

**Faults: 4.**
- The black rectangle is still there (asked again) and is the same in all three pictures.
- `perf` shows 436 draw calls and 184k triangles. The 196 ms frame is a software renderer (host load 3.0), so it is not a fault by itself, but the draw count did not drop.
- `__game.subject` points to a missing `"tote-board"`.
- The AI dead heat is exactly equal (23.58 and 23.58).

**Next:**
1. **Black rectangle** (asked again). Find what draws it. It sits at [14,475,270,615] in the 1024-wide picture, roughly [18,594,338,770] in page pixels, above `div#lower`, and `look` lists no HTML element there. Check `#crt`'s background image and any full-screen overlay or reflection of `#tote`. Run `eval` to set `document.getElementById('crt').style.display='none'`, and in a second call hide the `#tote` mirror. Done when one `look` with `sample` at (100,560) and (200,600) in page pixels reads track or grass colour, not near-black.
2. **Break the dead heat.** The two AI finished at `finishT` 23.58 and 23.58. Give the AI a seeded finishing gap of 0.05 to 0.4 s in the closing-sprint drag, and keep the photo-finish replay on a gap under 0.15 s. Done when two seeded `interact` runs with no input show `finishT` values that differ and are within 0.4 s.
3. **Show the replay and results card, and cut draw calls.** Use `interact` with `until: {phase:"replay"}` and then `look` to prove the sepia, grain, `PHOTO FINISH` frame and the head-on cam. Then `until: results` followed by an immediate `look` for the award. Put the crowd, fence posts and ad boards into `InstancedMesh`, and run `perf` with `costs:true` to bring draw calls under 250. Also set `__game.subject` to an object that exists.

SCORE: 6.6
