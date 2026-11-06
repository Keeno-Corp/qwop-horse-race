The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 13
**Did**
- `game.js` AI.update: added a stall watchdog (3 s window; upright horse gaining <0.8 m gets a 1.4 s `driveF` 420 shove, and `rise()` if |pitch|>0.9). `broadcast.js`: post-pass quad named `postpass-quad`, `userData.noId`.
**Saw**
- Two no-input solo races give identical results to iteration 12: `replay.kind:"finish"` at raceT 28.55, Hoof Hearted 22.03 / Dusty Rhodes 22.07, Sir Trips-a-Lot (6 plants) at x 33.89, pitch -2.14, state run. The watchdog changed nothing there: he is likely just far behind when the 6.5 s post-finish cutoff ends the race, not stuck. Draw calls not re-measured (last 411); `look` not run.
**Next**
- Draw calls 411 to under 250 (merge horse `merged` groups, sponsor atlas, instance tails/posts).
- Enlarge blinker silks 2×; name horse body/leg/head meshes so `look target:"horse0"` lists parts.
- Let slow AI horses finish: lengthen the post-first-finish cutoff or boost trailing AI after x>30.
**Open**
- Draw-call goal unmet; the 60 m finish by hand (`YOU`) is unproven; the watchdog is unverified as helpful.

### Judge 13

**Scores (Must have, in order)**

1. **Plays as DESIGN.md says: 7.** A no-input solo race runs from the countdown to `phase:"finishing"`. The `YOU` horse stayed at x 1.4 with `legs:"0000"` because I pressed no keys. `div#keys`, the `1 PLAYER` / `2 PLAYERS (2)` / `RESTART` buttons and `div#tips` are all present. I did not play a full 60 m by hand. My `until` phase name was wrong ("racing" versus the page's "race"), so that step reported "not met", though the race itself ran.
2. **Rapier ragdoll, face-plant, auto-right: 7.** The `FACE-PLANT!` pop-up, `plants:5` on `Sir Trips-a-Lot` and the repeating thud, gasp, boing sound cycle all fit the collapse and auto-right. The picture shows the grey horse mid-collapse. I did not time the auto-right.
3. **Replay and sepia photo finish: 4.** At `raceT` 22.07 s `Dusty Rhodes` had finished (`finishT` 21.7), `Hoof Hearted` was at x 56.3 and `Sir Trips-a-Lot` at x 32. I saw no replay, no sepia frame and no "PHOTO FINISH" frame. That is five sessions without seeing it.
4. **Photo finish and tangle within a minute: 5.** `tangles:1` was recorded, but the finish is not close. Dusty Rhodes wins by about 3 m and `Sir Trips-a-Lot` is 28 m back. The stall watchdog did not change this.
5. **Results with most face-plants award: 7.** I did not reach the results card this session. It was seen in judge 11 with the `DIRT EATER` tag, and the live per-horse `FACE-PLANTS` counts are in the `Tote`.
6. **Looks as LOOK.md says: 8.** The picture is warm orange and yellow with flat cel horses, black outlines, the CRT grade, vignette and scanlines, and a bunting-striped grandstand with a sponsor board. I did not `sample` the 3-step shading.
7. **`window.__game`, static, no network: 7.** `interact` state works, assets are 0.32 MB with fonts vendored, and there are no console errors. `look` still reports `horse0` with 0 of 3 parts found. The `postpass-quad` is now named, but the horse is still not measurable.
8. **Horses match CHARACTERS.md and horse.png: 7.** The orange and grey horses show a saddle-cloth silk, a blinker, a mane, a tail and a dark muzzle. The blinker silks are still tiny. I did not check the socks or hooves closely.
9. **Broadcast overlay: 9.** The `Tote` has silk chips and `WIN ODDS`. The `PLAY-BY-PLAY · WALT DUNMORE` lower-third carries a live line. The `LIVE` bug, `4:00 PM` clock, `RACE TIME`, progress bar, `YOU 56 m` off-screen indicator and the `FACE-PLANT!` banner are all there.
10. **Camera: 6.** The telephoto side-track framing is strong. I saw no head-on cut or replay cam this session.
11. **Controls feel learnable: 6.** A human 60 m finish is still unproven.
12. **Local 2-player, discoverable: 6.** The `2 PLAYERS (2)` button and the footer `2 = TWO PLAYERS` are visible, but I did not play it.
13. **Style judged as hard as gameplay: 8.** The overlay, `Tote`, key caps and CRT read as one 70s broadcast.

**Faults: 5.**
- `perf` shows 411 draw calls (`scene` pass 410) and 184k triangles, unchanged for the third session. The groups are `merged` 142 calls, `Mesh` 56, `merged-outline` 45, `mesh-outline` 18 and `tail` 16.
- The 169 ms frame is a software renderer at host load 3.0, so it is noise.
- `div#crt` covers 100% of the canvas.
- `hills` is listed as never visible while in view, as in earlier sessions.
- There are no console errors.

**Next:**
1. **Make the photo finish happen (asked again).** `Sir Trips-a-Lot` is again 28 m back when the leader finishes, so there is nothing close to photograph. Add rubber-banding in AI.update: pull the AI horses toward the leader's pace after x>25 and make them recover from plants faster. Optionally pick a target finish gap of 0.05–0.3 s between two AI horses. Done when `interact` with `until:{phase:"replay"}` (use the page's real phase names, which are `race`, `finishing` and `results`) and then `look` shows the sepia grain, scratches and "PHOTO FINISH" frame, and `observe` lists two horses with `finishT` within 0.3 s.
2. **(asked again) Cut draw calls from 411 to under 250.** Merge the 142 `merged` calls and 45 `merged-outline` calls per horse by material. Merge the 18 `mesh-outline` and 56 `Mesh` calls with one sponsor atlas. Instance the 16 `tail` meshes. Done when `perf` with `costs:true` reports under 250.
3. **Make `horse0` measurable and enlarge the blinker silks 2×.** Name the horse's body, leg and head meshes so they are not hidden from the ID image, and flag the post-pass quad so the ID image skips it. Done when `look target:"horse0"` lists its parts and the "0 of its 3 named parts" line is gone.

SCORE: 6.6
