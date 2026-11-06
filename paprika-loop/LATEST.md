The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 16

**Judge 16 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - After `phase` "race" I held Q, P, W, O for 10 frames each, 14 cycles. `horses.2` (`YOU`) stayed `state` "run" with `plants` 0 throughout, which is the early face-plant fix working.
   - `YOU` moved x 1.4 → 14.64 in about 7 s of race time, and `div#keys` and `div#tips` are visible. Pace is the weak point: about 1.9 m/s, so 60 m would take well over 30 s on this rhythm.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - `horse0-*` to `horse3-*` limbs are jointed. `Sir Trips-a-Lot` and `Hoof Hearted` went `state` "down" with `plants` 1 at 7 s.
   - I did not see the auto-right again.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - `phase` switched to "replay" with `replay.kind` "plant", `pos` 338.5 of 425 frames. I did not look at the banner.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` was 1 at 7 s, when both AI horses went down in adjacent lanes (z -1.25 and -0.33). The photo finish was not re-run this session.
5. **Results with most face-plants award: 7.**
   - Not seen this session. It is carried from iteration 15's eval.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence with the "10 m" sign, `hills`, `sky` and `dust*` ×80 read as sunny low-poly like refs/01.jpg.
   - The `player-marker-*` ring and arrow work.
   - Subject contrast is still low: `YOU` takes 1.8% of the frame, at 9% brightness against 25% around it. The `track` is the dark brown.
7. **window.__game convention, index.html at root: 9.**
   - `open` returns the name, stack and keys.
8. **Clip moments within the first minute, no input: 8.**
   - A two-horse pile-up and an auto replay happened by 7 s.
9. **Controls feel learnable: 7.**
   - The plain alternation now survives to 14.6 m with no plants.
   - Progress is slow and was only tested for 7 s. The fade-out of the assist at 5 s caused no plant. Cartwheels and splits from mistimed keys were not tested.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, white socks, dark hooves and saddles read clearly in `horse*`.
    - `horse3-*` (the player's horse) is almost black and merges with the brown track.
11. **Juice: 8.**
    - Sounds fired: blip, powerup, cheer, thud, gasp.
    - The `div#chips` FACE-PLANTS counters work, and `dust*` flies from the hooves.
    - Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "2 PLAYERS (2)". The 2-player marker was not checked.
13. **Static page, vendored lib, no network: 9.**
    - 385 draw calls, 33.7k triangles, 0 MB of assets.
    - The 65 ms frame is SwiftShader at host load 2.7, so it is noise, not a fault.

**Faults: 8.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Speed up the player and run to the finish.**
   - Raise the human horse's drive so a plain Q+P / W+O rhythm covers 60 m in about 30–45 s.
   - `interact` with the same rhythm over about 40 cycles, tracing `horses.2.x` and `finishT`.
   - It is done when `YOU` reaches x ≥ 60 with `finishT` under 60 s and `phase` goes to "replay" or "results". This also gives the first look at the results screen and the photo finish.
2. **Make the player's horse stand out.**
   - Lighten or recolour the `horse3-*` body, or enlarge `player-marker-*`.
   - `look` with `sample` at the horse body should show brightness over 20% against the surroundings, not 9%.
   - Lightening the `track` would also help.
3. **Measure the camera shake and see the replay.**
   - Run `feel` on a face-plant and expect a nonzero shake that decays within about 0.5 s.
   - After `phase` is "replay", run `look` once to check the REPLAY banner. Asked in iterations 14–16 and not yet verified.
   - Also add noise to the `track` texture to break the panel repeat.

SCORE: 8.0

## Iteration 17
**Did** game.js line ~240: human `driveF` multiplier 2.4 → 4.5 (solo, non-auto). view.js `COATS[2]` (the player's coat in solo) 0x3a302c → 0xe8d8b0 (pale cream) so `YOU` stands out from the track.
**Saw** Q+P / W+O at 10 frames, race time 0.95→2.82 s: `horses.2.x` 2.25→6.46 (≈2.2 m/s), plants 0, pitch ≤0.01; AI at 3.5–6.2, so the player keeps pace/leads. `look`: subject brightness 50% vs 38% around, edge contrast 0.18; player-marker ring/arrow visible; "Never visible: none"; only the shadowmap warning. Did not run to the finish (x 60), results, replay banner or shake.
**Next** (1) run ~40 rhythm cycles, trace `horses.2.x`/`finishT`, reach results and look; (2) `feel` on a face-plant for shake, `look` at the REPLAY banner; (3) track texture noise.
**Open** Speed gain only measured over 2 s; the late-race assist fade (5 s) with the higher drive is untested. Cream coat only affects horse index 2 (in 2-player mode that is P2's horse? coats are per index).
