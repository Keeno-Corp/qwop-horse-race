The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 17

**Judge 17 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - I held Q+P then W+O for 10 frames each over 4 s. `horses.2` (`YOU`) went from x 1.42 to 7.17 with `plants` 0, `state` "run" and `pitch` at most 0.02 in magnitude.
   - That is about 2.3 m/s, so the 60 m would take about 26 s, which fits the under-60 s target. I did not run it to x 60.
   - `div#keys` and `div#tips` are visible.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The `horse0-*` to `horse3-*` limbs are jointed, and in this run `Hoof Hearted` and `Dusty Rhodes` showed `y` dips and `pitch` -0.1.
   - I saw no face-plant or auto-right this session.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - Not reached this session. The `phase` "replay" switch was seen in judge 16, but the banner has not been looked at in any session.
4. **Photo finish and tangled AI collapse within the first minute: 7.**
   - No collapse happened in the first 4 s (all four `plants` 0). The tangle was seen in judge 16, and the photo finish has never been reached.
5. **Results with most face-plants award: 6.**
   - Not seen. The only evidence is the earlier eval from iteration 15.
6. **Looks as LOOK.md says: 9.**
   - The `grandstand` crowd, rail fence, `hills`, `sky` and `track` read as sunny low-poly like refs/01.jpg.
   - The cream-coated `horse3-*` (YOU) now stands out. Subject brightness is 47% against 31% around it, up from 9% against 25%.
   - The blue `player-marker-*` ring and arrow are clear.
   - The `track` is still a flat brown, with visible panel repeats.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.**
   - The first 4 s with input were clean running. The earlier tangle and auto replay were seen in judge 16, but not re-checked.
9. **Controls feel learnable: 8.**
   - A plain Q+P / W+O rhythm gives steady progress with no plants and a pace that finishes in about 26 s.
   - Mistimed keys (splits, cartwheels, dog-sits) were not tested this session.
10. **Horses read as horses, match refs/01.jpg: 9.**
    - Head, mane, tail, white socks, dark hooves, saddle colours and lane colours read clearly in the look.
11. **Juice: 8.**
    - Sounds fired: blip, powerup, cheer. Dust flies from the hooves, and the `div#chips` face-plant counters work.
    - Camera shake is still unmeasured after four iterations.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER" and "2 PLAYERS (2)". The 2-player marker and the cream coat per index were not checked.
13. **Static page, vendored lib, no network: 9.**
    - 387 draw calls, 33.8k triangles, 0 MB of assets.
    - The 66.9 ms frame is SwiftShader at host load 3.0, so it is noise, not a fault.

**Faults: 9.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Verify the end of the race: finish, photo finish, replay banner and results.** This was asked in iterations 15–17 and is still unverified.
   - Add a debug `setState`, or an `act` such as `{action:"teleport", x:55}` for the human horse, so `interact` can reach the finish in one call. Expect `phase` "replay" with a `REPLAY` banner, then "results".
   - Use `look` with `sample` on the banner and on the results screen to check the face-plants award text is there.
   - Check that 2-player mode gives the cream coat to the right horse.
2. **Measure camera shake with `feel` on a face-plant.**
   - Force `Hoof Hearted` to `state` "down" via `setState`. Expect a nonzero shake that decays within about 0.5 s.
   - Also look at the auto-right after about 2 s.
3. **Break up the `track` repeat and add AI pressure.**
   - Add noise or hoof-print variation to the `track` texture, and lighten it a little.
   - Check the AI collapses within the first 10 s with a `sheet` at frames 300, 480 and 600 with no input. Expect `tangles` ≥ 1 in at least one of them.

SCORE: 8.0

## Iteration 18
**Did** game.js line 226: face-plant `shakeAmp` 0.12 → 0.3 (shake was ~0.07 m, near invisible; `feel` showed no camera shake since the follow cam moves). Otherwise verification only.
**Saw** Via `setState` horses teleport: no-input run reached `phase` "replay" (plant replay) at raceT 8.03: REPLAY banner [38,88,406,173] and "SPACE to skip" visible. Space skipped; teleport of `YOU` to x 58.5 gave finishT 8.07, `finishing` → replay (finish kind) → `results`: "YOU WINS!" box with podium, ranked list, DNF "20 m short", "DIRT EATER · MOST FACE-PLANTS" badge on Sir Trips-a-Lot. "Never visible": dust only (when far from view). Only the shadowmap warning in console. Did not run `perf` or re-look after the shake change.
**Next** (1) check 2-player cream coat per horse index; (2) track texture variation/lighten (flat brown); (3) results box: the podium "1" card overlaps the horse behind it — consider dimming bg more; verify photo finish with two AI finishing close.
**Open** Shake amplitude change untested visually. Photo finish (two finishers within 0.3 s) never observed.
