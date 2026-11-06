The page is judged. Here is the verdict for session 7.

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 6.** A no-input solo run reached `phase:"results"` at raceT 31.33. The `Tote` board, the Q/W/O/P `div#keys` caps and the `1 PLAYER` / `2 PLAYERS` / `RESTART` buttons are all there. `YOU` sat at x 2.27 and I did not hold keys through a race.
2. **Rapier ragdoll, face-plant, auto-right: 7.** `Sir Trips-a-Lot` and `Hoof Hearted` went `state:"down"` at raceT 7.2 with `plants:1` each, and `Dusty Rhodes` ended `down`, `pitch` 3.13, `plants` 5. I did not time the ~2 s auto-right.
3. **Replay and sepia photo finish: 6.** The `kind:"plant"` replay now starts (`INSTANT REPLAY · 0.25x` tag, `SPACE to skip`, `rate` 0.25). Its picture shows a warm VHS grade, three horses in the side cam and a letterbox. It is dark at `t:0`, and the first look had brightness 9%. I pressed Space and never saw a finish replay, so the sepia `PHOTO FINISH` frame with grain, scratches and gate weave is still unseen after four sessions.
4. **Photo finish and tangle within a minute: 7.** `tangles:1` came with no input. The iteration 7 floor works: `finishT` is 24.81 for `Hoof Hearted` and 25.09 for `Sir Trips-a-Lot`, a 0.28 s gap instead of 0.01 s. The race ended at 31 s, but `Dusty Rhodes` dropped out at 47.6 m. I did not read the card's `PHOTO FINISH · …s` text.
5. **Results with most-face-plants award: 8.** `results` lists the four horses in order, and `Dusty Rhodes` has `plants:5`. I did not re-read the `DIRT EATER` tag this session.
6. **Looks as LOOK.md says: 8.** The `start` look shows a cream title card with a silks-colour stripe and the 70s palette. Outlined toon horses stand in a warm orange track with a grandstand and `GOLDEN HOOF OATS` ad boards. A CRT/VHS grade covers it all (`div#crt`, 2% near-black). I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 7.** `observe` works and assets are 0.32 MB with the fonts vendored. `subject` is still `horse0-body`, which `look` says is not in the scene. This is the fourth session with that fault.
8. **Horses match CHARACTERS.md and horse.png: 6.** The horses have white socks, dark hooves, big eyes, a bristly mane, a saddle cloth with silks and a number, and a bridle. The legs are still short against "long wobbly". The blinker silks are barely readable at play distance. The polka-dot horse looks right.
9. **Broadcast overlay: 9.** `Tote` has silks chips, `WIN ODDS` (`3-1`, `8-1`, `5-2`) and face-plant counts. There is a `LIVE` bug, a `3:58 PM` clock bug and `RACE TIME`. The play-by-play lower-third names commentators (`HANK "HOOFBEAT" PRUITT`, `WALT DUNMORE`) with live lines, and the race title card shows at the start.
10. **Camera: 7.** The start look shows the broadcast side-tracking telephoto, and the replay cam shows a different side angle. I did not see the head-on cut.
11. **Controls feel learnable: 5.** No keys were sent, so the claim that 60 m takes under 60 s is untested after five sessions.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the footer line `2 = TWO PLAYERS` are visible. I did not play it.
13. **Style judged as hard as gameplay: 8.** The title card, `Tote`, lower-third and key caps are cohesive. I did not run `reference` against `LOOK-board.png`.

**Faults: 5.**
- `perf` shows 440 draw calls and 183,984 triangles. 160 ms of the 185 ms frame is the scene pass. The SwiftShader frame time is not a budget signal, but the draw count has been left alone for four sessions.
- `__game.subject` points at `horse0-body`, which is not in the scene.
- The replay opens on a near-black frame (9% brightness at `t:0`).
- `div#crt` covers the whole canvas.
- No console errors.

**Next:**
1. **(asked again) Prove the sepia finish replay and the head-on cut.** Run `interact` with `until:{phase:"replay"}` after a horse has `finished:true`. Don't press Space, and skip the `kind:"plant"` replay by waiting it out or checking `replay.kind`. Then `look` at `replay.kind` `"finish"` or `"photo"`. Done when the picture is sepia with grain, scratches, weave and the `PHOTO FINISH` frame, and a second `look` shows the head-on front view at the line. If no finish replay starts after the finish, fix that first. Also fade in the first replay frame so it is not black.
2. **(asked again) Cut draw calls to under 250 and fix `subject`.** Use `instances()` for the crowd figures (the `.crowd` pieces in the grandstand look), fence posts, ad boards and grandstand rows. Name a Group `horse0` so `__game.subject` resolves. Done when `perf costs:true` reports under 250 draw calls and `look` stops saying the subject is not in the scene.
3. **Test the controls and lengthen the legs.** Run `interact` with held Q W O P alternating, and check that one human reaches x 60 in under 60 s. Then lengthen the legs ~25% and make the blinker silks bigger. Done when the horse `look` shows legs about 1.2× the body depth, a mistimed-key `interact` still gives a dog-sit or face-plant, and the held-key race finishes under 60 s.

SCORE: 6.9
