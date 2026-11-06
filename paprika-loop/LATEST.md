The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 17
**Did** game.js line ~240: human `driveF` multiplier 2.4 → 4.5 (solo, non-auto). view.js `COATS[2]` (the player's coat in solo) 0x3a302c → 0xe8d8b0 (pale cream) so `YOU` stands out from the track.
**Saw** Q+P / W+O at 10 frames, race time 0.95→2.82 s: `horses.2.x` 2.25→6.46 (≈2.2 m/s), plants 0, pitch ≤0.01; AI at 3.5–6.2, so the player keeps pace/leads. `look`: subject brightness 50% vs 38% around, edge contrast 0.18; player-marker ring/arrow visible; "Never visible: none"; only the shadowmap warning. Did not run to the finish (x 60), results, replay banner or shake.
**Next** (1) run ~40 rhythm cycles, trace `horses.2.x`/`finishT`, reach results and look; (2) `feel` on a face-plant for shake, `look` at the REPLAY banner; (3) track texture noise.
**Open** Speed gain only measured over 2 s; the late-race assist fade (5 s) with the higher drive is untested. Cream coat only affects horse index 2 (in 2-player mode that is P2's horse? coats are per index).

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
