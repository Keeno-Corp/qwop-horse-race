**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** In a no-input solo run `phase` reached `results` at raceT 31.33 with `YOU` parked at x 2.27, so the `results` card and `RESTART`/`1 PLAYER`/`2 PLAYERS (2)` buttons work. `div#keys` shows `YOUR LEGS Q FL W FR O BL P BR`. I did not hold keys through a full race.
2. **Rapier ragdoll, face-plant, auto-right: 7.** `Dusty Rhodes` is `state:"down"`, `pitch` 3.13, `plants` 5. The others are back in `run` with `plants` 1. I did not time the ~2 s auto-right.
3. **Replay and sepia photo finish: 5.** This run ended in a photo finish, but `interact` ran straight through to `results`. I did not see the sepia replay (grain, scratches, `PHOTO FINISH` frame) or any plant replay. It has been unproven for three sessions.
4. **Photo finish and tangle within a minute: 5.** `tangles:1` came with no input and the race ended at 31 s. The gap is still 0.01 s: `finishT` is 24.81 for `Hoof Hearted` and 24.82 for `Sir Trips-a-Lot`. The `results` card prints `PHOTO FINISH · 0.01s`, so the iteration 6 `hhGap` edit did not take effect and the finish looks scripted.
5. **Results with most-face-plants award: 8.** The `results` card has a `DIRT EATER · MOST FACE-PLANTS` tag on `Dusty Rhodes` (5 face-plants). It also has a podium and `SMOOTH OPERATOR` tags.
6. **Looks as LOOK.md says: 8.** The cream `div.box` card with striped awning and the `Tote` board read as a 70s broadcast. There is a warm brown CRT pass and 0% near-black. I did not `sample` the toon shading steps this session.
7. **`window.__game`, static, no network: 7.** `observe` works and assets are 0.32 MB with the fonts vendored. `subject` is `horse0-body`, which `look` still says is not in the scene, so the fault is open for a third time.
8. **Horses match CHARACTERS.md and horse.png: 6.** The horses were not on screen under the results card, so this is carried from last session. The legs are still short against "long wobbly" and the blinker silks are barely visible.
9. **Broadcast overlay: 9.** `div#tote` shows the silks, `PHOTO` odds labels, `30-1` and the face-plant counts. `div#top-r` has `LIVE`, `4:01 PM` and `RACE TIME`. `div#lower` has the Walt Dunmore line "THIS ONE IS GOING TO THE PHOTOGRAPHERS". The progress bar is in place.
10. **Camera: 6.** I did not see the side-tracking, head-on or replay cams this session, so this is carried over.
11. **Controls feel learnable: 5.** No input was sent, so the 60 m in under 60 s claim is untested after four sessions.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the tips line `2 = TWO PLAYERS` are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The results card, tote and lower-third are cohesive. I did not run `reference` against `LOOK-board.png`.

**Faults: 4.**
- `perf` shows 441 draw calls and 183,986 triangles. The 225 ms frame is SwiftShader, so it is not a fault by itself, but the draw count is high and has been left alone for three sessions.
- The 0.01 s AI dead heat is still there.
- `__game.subject` points at `horse0-body`, which is not in the scene.
- `div#crt` covers the whole canvas.
- No console errors.

**Next:**
1. **(asked again) Make the dead heat actually widen.** In game.js find where the AI `finishT` is decided, because `S.hhGap` in `resetRace` is evidently not what sets it. The two leaders still finish 0.01 s apart (24.81 vs 24.82). Done when `interact` with `until:{phase:"results"}` plus `observe` shows the `finishT` gap at 0.03–0.3 s and the card prints that value in `PHOTO FINISH · …s`.
2. **(asked again) Prove the sepia photo-finish replay and the head-on cut.** Run `interact` with `until:{phase:"replay"}` and `look: true` right after the first finish. Done when the picture shows sepia, grain, scratches, gate weave and the `PHOTO FINISH` frame. A second `look` with the head-on cam should show the front view of the horses crossing the line. If the replay never starts, fix that first.
3. **(asked again) Cut draw calls and fix `subject`.** Draw calls are at 441. Put the crowd figures, fence posts, ad boards and grandstand pieces into `instances()`. Name a Group `horse0` so `look` can find `__game.subject`. Done when `perf costs:true` reports under 250 draw calls and `look` no longer says the subject is not in the scene. Lengthening the legs by ~25% and the blinker silks come after this; check that a mistimed-key `interact` still gives a dog-sit and that a held-key race finishes under 60 s.

SCORE: 6.4
