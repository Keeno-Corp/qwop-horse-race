**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** Solo with 3 AI runs. `div#keys` (YOUR LEGS Q W O P), `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` are on screen, and the `GO!` banner shows. Q+P then W+O pulses put `YOU` at x 2.66, state `run`, `plants` 0 at raceT 0.87. I did not hold keys through a full race or play 2-player.
2. **Rapier ragdoll, face-plant, auto-right: 7.** In the replay run `Sir Trips-a-Lot` and `Hoof Hearted` were `state:"down"`, `plants:1`, and `Dusty Rhodes` and `YOU` were back in `run`. I did not time the ~2 s auto-right.
3. **Replay and sepia photo finish: 6.** The plant replay shows the `INSTANT REPLAY · 0.25x` tag and `SPACE to skip`, and the picture is not sepia, which fits a plant replay. I did not see the sepia photo-finish replay (grain, scratches, `PHOTO FINISH` frame) this session.
4. **Photo finish and tangle within a minute: 6.** `tangles:1` came at raceT 6.98 with no input. Last session's note says the AI finish times differ by only 0.01 s, which still looks like a scripted dead heat. I did not re-measure that gap.
5. **Results with most-face-plants award: 7.** The builder saw the `DIRT EATER · MOST FACE-PLANTS` card on `Dusty Rhodes`. I did not reach the card myself.
6. **Looks as LOOK.md says: 8.**
   - The toon shading, outlines, warm orange palette and CRT/VHS pass all hold, and the black rectangle is gone.
   - The sample reads track colour, and the picture is 2% near-black.
   - The grandstand crowd, ad boards and fence read as 1970s TV.
7. **`window.__game`, static, no network: 7.** `observe` works and assets are 0.32 MB with the fonts vendored. `subject` is `"horse0-body"`, and `look` still says it is not in the scene.
8. **Horses match CHARACTERS.md and horse.png: 7.** Silks and numbers on the cloths, white socks, dark hooves, big eyes, bridles and a bristly mane all show. The legs are still short against the brief's "long wobbly", and the blinker silks are barely visible.
9. **Broadcast overlay: 9.** `div#tote` has silks, odds that moved 5-1 to 2-1, and face-plant counts. `div#top-r` has `LIVE`, the clock and `RACE TIME`. `div#lower` has the Hank "Hoofbeat" Pruitt play-by-play. The progress bar with the finish flag is a nice touch.
10. **Camera: 7.** The side-tracking telephoto and the replay cam both read well. I did not see the head-on cut.
11. **Controls feel learnable: 6.** `YOU` led at x 2.66 against 0.18 to 2.19 for the AI in the first second. I did not play a full 60 m, and `YOU` shows pitch -0.3 and `legs "0000"` between pulses.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the tips line `2 = TWO PLAYERS` are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** Cohesive and reads as a 70s broadcast, and the flaw from last session is fixed. I did not run `reference` against `LOOK-board.png`.

**Faults: 5.**
- `perf` shows 435 draw calls and 183,974 triangles. The 203 ms frame is SwiftShader, so it is not a fault by itself, but the draw count is high and went unaddressed again.
- `look` reports `div#crt` as an overlay over 100% of the canvas that is still up after 5.2 s. It is the intended CRT pass, but the `perf` sampling is under it.
- The AI finish gap is still around 0.01 s and looks scripted.
- The `__game.subject` target `horse0-body` is not found under the post pass.
- No console errors.

**Next:**
1. **Cut draw calls to under 250 and run `perf costs:true`.** Put the crowd figures, fence posts, ad boards and grandstand pieces into `instances()`/`InstancedMesh`. Done when `perf` reports under 250 draw calls with the picture unchanged. Also point `__game.subject` at a named Group that `look` can find.
2. **Break the dead heat and prove the sepia photo-finish replay.** Widen the seeded AI finishing gap to 0.03–0.3 s. Then run `interact` with `until:{phase:"replay"}` after a finish, followed by `look`. Done when `finishT` values differ by 0.03–0.3 s, and the picture shows sepia, grain, scratches and the `PHOTO FINISH` frame. Check the head-on cut in the same run.
3. **Lengthen the horse legs and make the blinker silks readable.** Make the leg segments about 25% longer with a wobblier knee motor, in line with CHARACTERS.md's "long wobbly". Done when a `look` at the start line shows legs about as long as the barrel is deep, and a mistimed-key `interact` still gives a dog-sit or face-plant. Then play a full held-key 60 m race to check it finishes in under 60 s.

SCORE: 6.9
